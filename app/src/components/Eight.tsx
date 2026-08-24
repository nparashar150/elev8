import { motion, type MotionValue } from "motion/react";
import { EIGHT_D } from "../lib/eight";

type Props = {
  className?: string;
  pathLength?: MotionValue<number> | number;
  color?: string;
};

/** One drawing of the 8. Used large for the opening, small nowhere — the nav is type. */
export function Eight({ className, pathLength, color = "#E8A79C" }: Props) {
  return (
    <svg className={className} viewBox="0 0 28 40" fill="none" aria-hidden="true">
      <motion.path
        d={EIGHT_D}
        stroke={color}
        strokeWidth={2.55}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={pathLength === undefined ? undefined : { pathLength }}
      />
    </svg>
  );
}
