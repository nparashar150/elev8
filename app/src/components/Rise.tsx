import { motion, type MotionValue } from "motion/react";
import riseSrc from "../assets/el-rise.png";
import { ENTER } from "../lib/motion";

/**
 * Geometry measured by tools/build-assets.py off the neutral sprite. el-rise.png
 * is El with the hole knocked out and cropped at the hole's centre line, so the
 * hole below can be drawn — and animated — separately.
 */
export const RISE = { w: 608, h: 462, cx: 303.5, rx: 278.5, ry: 65 };

const VIEW_BOX = `0 0 ${RISE.w} ${RISE.h + RISE.ry}`;

/** Bible §05: the hole opens, El rises ears-first, never a hard cut, never a pop-in. */
const hole = {
  hide: { scale: 0 },
  show: { scale: 1, transition: { duration: 0.3, ease: ENTER } },
};

const el = {
  hide: { y: RISE.h },
  show: { y: 0, transition: { duration: 0.5, delay: 0.22, ease: ENTER } },
};

type Props =
  /** Preload: the 1.6s timeline drives the values directly. */
  | { holeOpen: MotionValue<number>; riseY: MotionValue<number>; className?: string }
  /** §03: the hole opens at the edge of the section as it scrolls into view. */
  | { inView: true; className?: string };

export function Rise(props: Props) {
  const driven = "holeOpen" in props;

  return (
    <motion.svg
      className={props.className}
      viewBox={VIEW_BOX}
      fill="none"
      aria-hidden="true"
      {...(driven ? {} : { initial: "hide", whileInView: "show", viewport: { once: true, amount: 0.5 } })}
    >
      <defs>
        <clipPath id="el-rise-clip">
          {/* She is hidden below the hole's centre line until she rises through it. */}
          <rect x="0" y="0" width={RISE.w} height={RISE.h} />
        </clipPath>
      </defs>

      <motion.ellipse
        cx={RISE.cx}
        cy={RISE.h}
        rx={RISE.rx}
        ry={RISE.ry}
        fill="var(--plum)"
        style={{ transformBox: "fill-box", transformOrigin: "center", ...(driven ? { scale: props.holeOpen } : {}) }}
        {...(driven ? {} : { variants: hole })}
      />

      <g clipPath="url(#el-rise-clip)">
        <motion.image
          href={riseSrc}
          x="0"
          y="0"
          width={RISE.w}
          height={RISE.h}
          style={driven ? { y: props.riseY } : undefined}
          {...(driven ? {} : { variants: el })}
        />
      </g>
    </motion.svg>
  );
}
