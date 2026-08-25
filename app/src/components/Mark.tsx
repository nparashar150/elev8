import { motion } from "motion/react";
import { MARKS } from "../lib/marks";
import { ENTER } from "../lib/motion";

/**
 * A vertical's mark, drawn rather than shown, using Motion's pathLength so the
 * outline is traced on before the fill arrives. Each shape animates the way the
 * bible argues for it:
 *
 *   MOVE  a stroke caught mid-air
 *   CLEAR a spiral unwinding from a tight centre
 *   LONG  a complete form, no start and no end
 *   FUEL  grown, not drawn with a ruler
 *   KNOW  single markers, strung one at a time into a pattern
 *   LOOK  one drop
 *
 * The geometry comes from tools/trace-marks.py; the export is a raster, and a
 * bitmap cannot be stroke-drawn.
 */
type Props = { id: string; colour: string; size?: number; delay?: number };

const DRAW = { duration: 1.1, ease: ENTER };

export function Mark({ id, colour, size = 100, delay = 0 }: Props) {
  const mark = MARKS[id];

  return (
    <motion.svg
      className="mark"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-hidden="true"
    >
      {mark.kind === "dots" &&
        mark.dots.map((dot, index) => (
          <motion.circle
            key={index}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={colour}
            variants={{
              hide: { scale: 0, opacity: 0 },
              show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.26, delay: delay + index * 0.045, ease: ENTER },
              },
            }}
          />
        ))}

      {mark.kind === "circle" && (
        <>
          <motion.circle
            cx={mark.cx}
            cy={mark.cy}
            r={mark.r}
            fill="none"
            stroke={colour}
            strokeWidth={2.5}
            variants={{
              hide: { pathLength: 0 },
              show: { pathLength: 1, transition: { ...DRAW, delay } },
            }}
          />
          <motion.circle
            cx={mark.cx}
            cy={mark.cy}
            r={mark.r}
            fill={colour}
            variants={{
              hide: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.45, delay: delay + 0.75, ease: ENTER } },
            }}
          />
        </>
      )}

      {mark.kind === "path" && (
        <>
          <motion.path
            d={mark.d}
            fill="none"
            stroke={colour}
            strokeWidth={2}
            strokeLinecap="round"
            variants={{
              hide: { pathLength: 0 },
              show: { pathLength: 1, transition: { ...DRAW, delay } },
            }}
          />
          <motion.path
            d={mark.d}
            fill={colour}
            variants={{
              hide: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.5, delay: delay + 0.7, ease: ENTER } },
            }}
          />
        </>
      )}
    </motion.svg>
  );
}
