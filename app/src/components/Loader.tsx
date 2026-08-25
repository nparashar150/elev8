import { motion, useTransform, type MotionValue } from "motion/react";
import riseSrc from "../assets/el-rise.png";
import { Wordmark } from "./Wordmark";

/**
 * The loader is the logotype assembling itself:
 *
 *   "Elev" is written in
 *   the 8 draws after it, one unbroken line
 *   El rises out of the top loop, ears first, and holds
 *   she drops back into it
 *   the whole lockup travels to the nav, and the 8 signs itself once more
 *
 * She emerges from the mark rather than beside it, which is the argument the
 * deck makes: bible SS05, "she is literally drawn from the brand mark itself."
 *
 * This renders the real Wordmark component, so the lockup here and the one in
 * the nav are the same object at two sizes. That is what makes the landing a
 * match rather than a dissolve, and it is why the 8 cannot end up out of
 * proportion with "Elev" in one place and right in the other.
 *
 * Geometry: turned upright, the mark's upper loop is centred at (60, 0). That
 * loop is the hole. She is clipped at its centre line, so her body stays down
 * inside it while her ears rise clear above the whole mark, and the ribbon is
 * painted over her so it reads as the rim she is coming through.
 */
const LOOP = { cx: 60, cy: 0 };

/*
 * el-rise.png spans the full width of her hole, so she occupies only about half
 * of the sprite and its width badly understates her. This is scaled so her ears
 * stand well above the 8 rather than peeking over it.
 */
const EL = { w: 92, h: 92 * (462 / 608) };
const EL_X = LOOP.cx - EL.w / 2;
const EL_Y = LOOP.cy - EL.h;

/** How far she travels to sit fully out of sight inside the loop. */
export const EL_TRAVEL = EL.h;

type Props = {
  elev: MotionValue<number>;
  draw: MotionValue<number>;
  riseY: MotionValue<number>;
};

export function Loader({ elev, draw, riseY }: Props) {
  // "Elev" wipes in left to right, so it reads as being written.
  const clipPath = useTransform(elev, (value) => `inset(0 ${(1 - value) * 100}% 0 0)`);

  return (
    <div className="loader-lockup">
      <Wordmark
        textStyle={{ clipPath }}
        draw={draw}
        defs={
          <clipPath id="loader-loop-clip">
            {/* Nothing below the loop's centre line: she is down in the hole,
                and only what has cleared it shows. */}
            <rect x={EL_X} y={-260} width={EL.w} height={260 + LOOP.cy} />
          </clipPath>
        }
        behind={
          /* Painted before the mark, so the ribbon reads as the rim she is
             coming up through. */
          <g clipPath="url(#loader-loop-clip)">
            <motion.image
              href={riseSrc}
              x={EL_X}
              y={EL_Y}
              width={EL.w}
              height={EL.h}
              style={{ y: riseY }}
            />
          </g>
        }
      />
    </div>
  );
}
