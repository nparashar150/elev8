import { animate, motion, useMotionValue, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useEffect, useId, type ReactNode } from "react";
import { EIGHT_D } from "../lib/eight";
import { ENTER, SETTLE } from "../lib/motion";

/**
 * "Elev" plus the 8 drawn as El's own line, coiled.
 *
 * The loader's lockup lands on this, so this cannot be a typographic 8: a drawn
 * petal ribbon shrinking onto a text glyph never matches. It is the same path
 * the loader draws, turned upright. Bible SS05, "the '8' in Elev8 is El's line,
 * coiled" and "the logo, the loader and the mascot are three views of one
 * asset."
 *
 * The loader renders this exact component at display size, so the two can never
 * drift out of proportion with each other.
 *
 * Rotating the lemniscate 90 degrees about its centre maps its bounding box
 * from x 12..108 / y 13..47 to x 43..77 / y -18..78, padded here by the stroke.
 */
export const WORDMARK_VIEW_BOX = "34 -27 52 114";

/**
 * The loader draws the ribbon at 6 in a 120-wide box. At wordmark size that
 * renders under a pixel, which reads as a hairline beside 560-weight type, so
 * the mark is stroked heavier to sit at the same optical weight as the letters.
 */
export const WORDMARK_STROKE = 15;

/** Turns the flat lemniscate upright, which is what makes it read as an 8. */
export const UPRIGHT = "rotate(90 60 30)";

type Props = {
  /** Traces the mark on. Omit for a static logotype. */
  draw?: MotionValue<number>;
  /** Traces the mark once, the first time it scrolls into view. */
  reveal?: boolean;
  /** A gold gleam that sweeps the mark once, after it has drawn. */
  shine?: boolean;
  /** Rendered inside the mark, behind it, so it reads as coming through the loop. */
  behind?: ReactNode;
  /** Clips whatever is behind the mark. */
  defs?: ReactNode;
  /** Applied to the word only. A clip here must never wrap the mark, whose
   *  contents deliberately overflow their box. */
  textStyle?: MotionStyle;
  className?: string;
};

/**
 * A gleam is a narrow bright band swept across a gradient, not a dash chasing
 * the path. Running a dash around the loop reads as a worm crawling the mark;
 * moving the band's stops across the stroke reads as light catching it.
 */
function useShine(active: boolean) {
  const position = useMotionValue(-0.25);

  useEffect(() => {
    if (!active) return;
    // After the mark has finished drawing itself, once, then done.
    const controls = animate(position, 1.25, { duration: 1.05, delay: 1.35, ease: SETTLE });
    return () => controls.stop();
  }, [active, position]);

  const band = 0.14;
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  return {
    lead: useTransform(position, (value) => clamp(value - band)),
    peak: useTransform(position, clamp),
    tail: useTransform(position, (value) => clamp(value + band)),
  };
}

export function Wordmark({ draw, reveal, shine, behind, defs, textStyle, className }: Props) {
  const gradientId = useId();
  const { lead, peak, tail } = useShine(Boolean(shine));
  return (
    <span className={`wordmark-inner${className ? ` ${className}` : ""}`}>
      <motion.span className="wordmark-text" style={textStyle}>
        Elev
      </motion.span>
      <svg className="wordmark-eight" viewBox={WORDMARK_VIEW_BOX} fill="none" role="img" aria-label="8">
        {shine && (
          <defs>
            {/* Diagonal, so the band travels the mark rather than banding it. */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0.6" y2="1">
              <motion.stop offset={lead} stopColor="currentColor" />
              <motion.stop offset={peak} stopColor="var(--long)" />
              <motion.stop offset={tail} stopColor="currentColor" />
            </linearGradient>
          </defs>
        )}
        {defs}
        {behind}
        <motion.path
          d={EIGHT_D}
          transform={UPRIGHT}
          stroke={shine ? `url(#${gradientId})` : "currentColor"}
          strokeWidth={WORDMARK_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={draw ? { pathLength: draw } : undefined}
          {...(reveal
            ? {
                initial: { pathLength: 0 },
                whileInView: { pathLength: 1 },
                viewport: { once: true, amount: 0.6 },
                transition: { duration: 1.1, ease: ENTER, delay: 0.15 },
              }
            : {})}
        />

      </svg>
    </span>
  );
}
