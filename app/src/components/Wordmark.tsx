import { motion, type MotionStyle, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { EIGHT_D } from "../lib/eight";
import { ENTER } from "../lib/motion";

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

/** One full lap of the loop, in the path's own units. */
const LOOP_LENGTH = 252;

/** Turns the flat lemniscate upright, which is what makes it read as an 8. */
export const UPRIGHT = "rotate(90 60 30)";

type Props = {
  /** Traces the mark on. Omit for a static logotype. */
  draw?: MotionValue<number>;
  /** Traces the mark once, the first time it scrolls into view. */
  reveal?: boolean;
  /** A highlight that keeps running the loop, the way the loader's does. */
  pulse?: boolean;
  /** Rendered inside the mark, behind it, so it reads as coming through the loop. */
  behind?: ReactNode;
  /** Clips whatever is behind the mark. */
  defs?: ReactNode;
  /** Applied to the word only. A clip here must never wrap the mark, whose
   *  contents deliberately overflow their box. */
  textStyle?: MotionStyle;
  className?: string;
};

export function Wordmark({ draw, reveal, pulse, behind, defs, textStyle, className }: Props) {
  return (
    <span className={`wordmark-inner${className ? ` ${className}` : ""}`}>
      <motion.span className="wordmark-text" style={textStyle}>
        Elev
      </motion.span>
      <svg className="wordmark-eight" viewBox={WORDMARK_VIEW_BOX} fill="none" role="img" aria-label="8">
        {defs}
        {behind}
        <motion.path
          d={EIGHT_D}
          transform={UPRIGHT}
          stroke="currentColor"
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

        {/* One unbroken line, still running. The dash is the same device the
            loading artboards use, thinner than the ribbon so it reads as a
            light travelling inside the mark rather than a second outline. */}
        {pulse && (
          <motion.path
            d={EIGHT_D}
            transform={UPRIGHT}
            stroke="var(--petal)"
            strokeWidth={WORDMARK_STROKE * 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40 212"
            animate={{ strokeDashoffset: [0, -LOOP_LENGTH] }}
            transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
          />
        )}
      </svg>
    </span>
  );
}
