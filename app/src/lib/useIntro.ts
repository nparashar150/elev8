import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState, type RefObject } from "react";
import elRise from "../assets/el-rise.png";
import { EL_TRAVEL } from "../components/Loader";
import { ENTER, LEAVE, SETTLE } from "./motion";

/** Where the lockup lands: the wordmark in the nav. */
export type WordmarkTarget = { x: number; y: number; scale: number };

const SEEN_KEY = "elev8:intro-seen";

/**
 * The entrance choreography, in ms. FLOOR must clear it or she is pulled away
 * mid-move; it is derived from the timings below rather than guessed, so the
 * two cannot drift apart.
 */
const ENTRANCE_ENDS = 2440;
const FLOOR = ENTRANCE_ENDS;
const CEILING = 3800;

/**
 * Plays on every load while we are still working on it.
 *
 * Flip to false for once-per-session, which is what returning visitors want:
 * a preloader on every reload is a tax on the one person we need to read this.
 * ?intro forces it either way.
 */
const PLAY_EVERY_LOAD = true;

function shouldPlay() {
  try {
    if (new URLSearchParams(location.search).has("intro")) return true;
    if (PLAY_EVERY_LOAD) return true;
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Blocked storage just means it plays again. Harmless.
  }
}

/** Resolves when the things the first screen actually needs are ready. */
function assetsReady() {
  const image = new Image();
  image.src = elRise;
  return Promise.all([document.fonts?.ready ?? Promise.resolve(), image.decode().catch(() => undefined)]);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The loader: the logotype assembling itself, then handing over to the nav.
 *
 *   "Elev" is written in
 *   the 8 draws after it
 *   El rises out of the top loop, holds, drops back in
 *   the lockup travels to the nav and the 8 signs itself once more
 *
 * Gated on real work rather than on a fixed script: the entrance plays, then it
 * waits for fonts and El's artwork, then it leaves. This page is fast so it
 * almost always leaves at FLOOR, but on a bad connection it holds rather than
 * tearing. Any input skips it.
 */
export function useIntro(reducedMotion: boolean, target: RefObject<WordmarkTarget | null>) {
  const [play] = useState(() => !reducedMotion && shouldPlay());
  const skip = !play;

  const elev = useMotionValue(skip ? 1 : 0);
  const draw = useMotionValue(skip ? 1 : 0);
  const riseY = useMotionValue(EL_TRAVEL);
  const stageX = useMotionValue(0);
  const stageY = useMotionValue(0);
  const stageScale = useMotionValue(1);
  const markDraw = useMotionValue(skip ? 1 : 0);
  const loaderOpacity = useMotionValue(skip ? 0 : 1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    let cancelled = false;
    const running: AnimationPlaybackControls[] = [];
    const run = (controls: AnimationPlaybackControls) => {
      running.push(controls);
      return controls;
    };

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      setDone(true);
      markSeen();
    };

    // "Elev" is written in, then the 8 draws after it.
    run(animate(elev, 1, { duration: 0.62, ease: ENTER }));
    run(animate(draw, 1, { duration: 0.8, delay: 0.54, ease: ENTER }));

    // She rises out of the top loop, holds, and drops back into it.
    run(animate(riseY, 0, { duration: 0.62, delay: 1.3, ease: ENTER }));
    run(animate(riseY, EL_TRAVEL, { duration: 0.44, delay: 2.0, ease: LEAVE }));

    const exit = () => {
      if (cancelled) return;
      const mark = target.current;
      const move = { duration: 0.78, ease: SETTLE };

      run(animate(pageOpacity, 1, { duration: 0.5, delay: 0.24, ease: ENTER }));

      if (mark) {
        run(animate(stageX, mark.x, move));
        run(animate(stageY, mark.y, move));
        run(animate(stageScale, mark.scale, move));
      }

      // It lands, then the 8 signs itself once more, now in the nav.
      run(animate(loaderOpacity, 0, { duration: 0.26, delay: 0.74, ease: LEAVE }));
      run(animate(markDraw, 1, { duration: 0.85, delay: 0.8, ease: ENTER }));
      window.setTimeout(finish, 1020);
    };

    void Promise.race([Promise.all([assetsReady(), wait(FLOOR)]), wait(CEILING)]).then(() => {
      if (!cancelled) exit();
    });

    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });
    window.addEventListener("wheel", finish, { once: true, passive: true });

    return () => {
      cancelled = true;
      running.forEach((controls) => controls.stop());
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("wheel", finish);
    };
  }, [skip, target, elev, draw, riseY, stageX, stageY, stageScale, markDraw, loaderOpacity, pageOpacity]);

  return { elev, draw, riseY, stageX, stageY, stageScale, markDraw, loaderOpacity, pageOpacity, done, skip };
}
