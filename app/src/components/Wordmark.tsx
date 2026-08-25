import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { EIGHT_D } from "../lib/eight";

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
  /** Rendered inside the mark, behind it, so it reads as coming through the loop. */
  behind?: ReactNode;
  /** Clips whatever is behind the mark. */
  defs?: ReactNode;
  className?: string;
};

export function Wordmark({ draw, behind, defs, className }: Props) {
  return (
    <span className={`wordmark-inner${className ? ` ${className}` : ""}`}>
      Elev
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
        />
      </svg>
    </span>
  );
}
