import { motion, type MotionValue } from "motion/react";
import riseSrc from "../assets/el-rise.png";
import { EIGHT_CENTRE, EIGHT_D, EIGHT_STROKE, OPENED } from "../lib/eight";

/** el-rise.png, and where its baked-in hole sits. From tools/build-assets.py. */
const EL = { w: 608, h: 462, holeRatio: 0.4581 };

// Scale El so her hole lines up exactly with the drawn one at full open.
const EL_W = OPENED.rx / EL.holeRatio;
const EL_H = EL_W * (EL.h / EL.w);
const EL_X = EIGHT_CENTRE.cx - EL_W / 2;
const EL_Y = EIGHT_CENTRE.cy - EL_H;

/**
 * The loader, matching the Paper file's five loading artboards:
 *
 *   01 Trace    a petal dash travels the faint 8
 *   02 Infinity it keeps going, one unbroken line
 *   03 Unwind   the loop collapses to a small ellipse at the centre
 *   04 The hole the ellipse opens, petal rim around warm plum
 *   05 El       the rim recedes and she rises through, ears first
 */
type Props = {
  trackOpacity: MotionValue<number>;
  dashOffset: MotionValue<number>;
  tracerOpacity: MotionValue<number>;
  rx: MotionValue<number>;
  ry: MotionValue<number>;
  ringOpacity: MotionValue<number>;
  riseY: MotionValue<number>;
};

export function Loader({ trackOpacity, dashOffset, tracerOpacity, rx, ry, ringOpacity, riseY }: Props) {
  return (
    <svg className="loader-eight" viewBox="0 -56 120 116" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="loader-el-clip">
          {/* She is hidden below the hole's centre line until she rises. */}
          <rect x={EL_X} y={EL_Y} width={EL_W} height={EL_H} />
        </clipPath>
      </defs>

      <motion.path
        d={EIGHT_D}
        stroke="var(--petal)"
        strokeWidth={EIGHT_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: trackOpacity }}
      />

      <motion.path
        d={EIGHT_D}
        stroke="var(--petal)"
        strokeWidth={EIGHT_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="32 220"
        style={{ strokeDashoffset: dashOffset, opacity: tracerOpacity }}
      />

      {/* Back to front: the hole, then El clipped at its centre line, then the
          rim on top so she reads as being inside it rather than in front. */}
      <motion.ellipse cx={EIGHT_CENTRE.cx} cy={EIGHT_CENTRE.cy} rx={rx} ry={ry} fill="var(--plum)" />

      <g clipPath="url(#loader-el-clip)">
        <motion.image href={riseSrc} x={EL_X} y={EL_Y} width={EL_W} height={EL_H} style={{ y: riseY }} />
      </g>
      <motion.ellipse
        cx={EIGHT_CENTRE.cx}
        cy={EIGHT_CENTRE.cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="var(--petal)"
        strokeWidth={OPENED.ring}
        style={{ opacity: ringOpacity }}
      />
    </svg>
  );
}
