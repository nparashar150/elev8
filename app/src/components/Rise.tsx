import { motion, type MotionValue } from "motion/react";
import { EIGHT_D, EIGHT_STROKE } from "../lib/eight";

/** The 8, drawing itself as one unbroken line. */
export function Rise({ draw }: { draw: MotionValue<number> }) {
  return (
    <svg className="loader-eight" viewBox="0 0 120 60" fill="none" aria-hidden="true">
      <path d={EIGHT_D} stroke="var(--petal)" strokeWidth={EIGHT_STROKE} strokeLinecap="round" opacity={0.18} />
      <motion.path
        d={EIGHT_D}
        stroke="var(--petal)"
        strokeWidth={EIGHT_STROKE}
        strokeLinecap="round"
        style={{ pathLength: draw }}
      />
    </svg>
  );
}
