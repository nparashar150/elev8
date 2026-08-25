import { motion, type MotionValue } from "motion/react";
import { EIGHT_D } from "../lib/eight";

/**
 * "Elev" plus the 8 drawn as El's own line, coiled.
 *
 * The loader's loop lands here, so this cannot be a typographic 8: a drawn
 * petal ribbon shrinking onto a text glyph never matches. It is the same path
 * the loader draws, turned upright. Bible SS05, "the '8' in Elev8 is El's
 * line, coiled" and "the logo, the loader and the mascot are three views of
 * one asset."
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
const WORDMARK_STROKE = 15;

type Props = { eightRef?: React.Ref<SVGSVGElement>; draw?: MotionValue<number> };

export function Wordmark({ eightRef, draw }: Props) {
  return (
    <span className="wordmark-inner">
      Elev
      <svg
        ref={eightRef}
        className="wordmark-eight"
        viewBox={WORDMARK_VIEW_BOX}
        fill="none"
        role="img"
        aria-label="8"
      >
        <motion.path
          d={EIGHT_D}
          transform="rotate(90 60 30)"
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
