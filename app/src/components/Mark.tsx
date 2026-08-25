import { motion } from "motion/react";
import { MARKS } from "../lib/marks";
import { ENTER } from "../lib/motion";

/**
 * A vertical's mark, drawn rather than shown. Each shape animates the way the
 * bible describes it, so the motion carries the same argument as the drawing:
 *
 *   MOVE  a stroke drawn left to right, caught mid-air
 *   CLEAR a spiral unwinding from a tight centre outward
 *   LONG  a complete form arriving whole
 *   FUEL  grown, not drawn with a ruler
 *   KNOW  single markers, strung one at a time into a pattern
 *   LOOK  one drop, forming
 */
type Props = { id: string; colour: string; play: boolean; size?: number };

export function Mark({ id, colour, play, size = 100 }: Props) {
  const mark = MARKS[id];
  const state = play ? "show" : "hide";
  const clipId = `mark-clip-${id}`;

  return (
    <motion.svg
      className="mark"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      initial="hide"
      animate={state}
      aria-hidden="true"
    >
      {mark.kind === "circle" && (
        <motion.circle
          cx={mark.cx}
          cy={mark.cy}
          r={mark.r}
          fill={colour}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          variants={{
            hide: { scale: 0 },
            show: { scale: 1, transition: { duration: 0.5, ease: ENTER } },
          }}
        />
      )}

      {mark.kind === "dots" &&
        mark.dots.map((dot, index) => (
          <motion.circle
            key={index}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={colour}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{
              hide: { scale: 0, opacity: 0 },
              show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.26, delay: index * 0.035, ease: ENTER },
              },
            }}
          />
        ))}

      {mark.kind === "path" && (
        <>
          <defs>
            <clipPath id={clipId}>
              {/* MOVE sweeps left to right; the rest open out from their centre. */}
              {id === "move" ? (
                <motion.rect
                  x="0"
                  y="0"
                  height="100"
                  width="100"
                  style={{ transformBox: "view-box", transformOrigin: "left center" }}
                  variants={{
                    hide: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 0.65, ease: ENTER } },
                  }}
                />
              ) : (
                <motion.circle
                  cx="50"
                  cy="50"
                  r="72"
                  style={{ transformBox: "view-box", transformOrigin: "center" }}
                  variants={{
                    hide: { scale: 0 },
                    show: { scale: 1, transition: { duration: 0.7, ease: ENTER } },
                  }}
                />
              )}
            </clipPath>
          </defs>
          <path d={mark.d} fill={colour} clipPath={`url(#${clipId})`} />
        </>
      )}
    </motion.svg>
  );
}
