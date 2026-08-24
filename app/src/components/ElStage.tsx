import { motion, type MotionValue } from "motion/react";
import { El, type Pose } from "./El";
import { HOLE_LINE } from "../lib/shapes";

export type StageValues = {
  d: MotionValue<string>;
  dash: MotionValue<string>;
  dashOffset: MotionValue<number>;
  fillOpacity: MotionValue<number>;
  strokeOpacity: MotionValue<number>;
  elY: MotionValue<number>;
  elOpacity: MotionValue<number>;
};

type Props = {
  values: StageValues;
  pose: Pose;
  blinking: boolean;
};

/**
 * One SVG carries the whole opening: the looping mark, the circle it resolves
 * into, and the hole El climbs out of. Keeping them in a single coordinate
 * space is what makes the sequence read as one object instead of three.
 */
export function ElStage({ values, pose, blinking }: Props) {
  return (
    <svg className="stage-svg" viewBox="0 0 240 260" role="img" aria-label="El, the Elev8 character">
      <defs>
        <clipPath id="hole-clip">
          <rect x="0" y="0" width="240" height={HOLE_LINE} />
        </clipPath>
      </defs>

      <motion.path
        d={values.d}
        pathLength={1}
        fill="#4A3B3F"
        style={{
          fillOpacity: values.fillOpacity,
          strokeOpacity: values.strokeOpacity,
          strokeDasharray: values.dash,
          strokeDashoffset: values.dashOffset,
        }}
        stroke="#E8A79C"
        strokeWidth={7}
        strokeLinecap="round"
      />

      <motion.g clipPath="url(#hole-clip)" style={{ opacity: values.elOpacity }}>
        <motion.g style={{ y: values.elY }}>
          <El pose={pose} blinking={blinking} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
