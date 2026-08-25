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
 * Geometry: turned upright, the mark's crown sits at y = -18. She comes up from
 * behind that crown rather than through the loop's counter, which at a stroke of
 * 15 is far too small to read as an opening. Her ears overflow above the
 * viewBox, which the stylesheet allows.
 */
const CROWN = -10;
/*
 * el-rise.png spans the full width of her hole, so she only occupies about half
 * of it. Sized off the sprite alone she comes out a speck; this is scaled so her
 * body reads at roughly the mark's own width.
 */
const EL = { w: 74, h: 74 * (462 / 608) };
const EL_X = 60 - EL.w / 2;
const EL_Y = CROWN - EL.h;

/** How far she travels to sit fully inside the loop. */
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
            {/* Nothing of her shows below the crown, so she reads as being
                inside the mark until she climbs out of the top of it. */}
            <rect x={EL_X} y={-110} width={EL.w} height={110 + CROWN} />
          </clipPath>
        }
        behind={
          /* Painted before the mark, so the crown crosses in front of her
             and she reads as coming up from inside it. */
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
