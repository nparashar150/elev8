import { motion, type MotionValue } from "motion/react";
import { El, type Pose } from "./El";
import { HOLE_LINE } from "../lib/shapes";

export type StageValues = {
  d: MotionValue<string>;
  dashOffset: MotionValue<number>;
  dashArray: MotionValue<string>;
  fillOpacity: MotionValue<number>;
  strokeOpacity: MotionValue<number>;
  trackOpacity: MotionValue<number>;
  elY: MotionValue<number>;
  elOpacity: MotionValue<number>;
};

type Props = {
  values: StageValues;
  pose: Pose;
  blinking: boolean;
};

/**
 * Two identical paths, same recipe as Motion's infinite path-drawing example:
 * a faint full track plus a 25% dash whose offset runs 0 → −1 on `pathLength={1}`.
 * When the intro morphs, both paths share `d` so the figure-eight, the circle
 * and the hole are one object, not three drawings swapped in.
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
        fill="none"
        stroke="#E8A79C"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: values.trackOpacity }}
      />

      <motion.path
        d={values.d}
        pathLength={1}
        fill="#4A3B3F"
        stroke="#E8A79C"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          fillOpacity: values.fillOpacity,
          strokeOpacity: values.strokeOpacity,
          strokeDashoffset: values.dashOffset,
          strokeDasharray: values.dashArray,
        }}
      />

      <motion.g clipPath="url(#hole-clip)" style={{ opacity: values.elOpacity }}>
        <motion.g style={{ y: values.elY }}>
          <El pose={pose} blinking={blinking} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
