import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState, type RefObject } from "react";
import elRise from "../assets/el-rise.png";
import { OPENED, UNWOUND } from "./eight";
import { ENTER, LEAVE, SETTLE } from "./motion";

/** Where the loop lands when it re-forms: the "8" of the logotype. */
export type WordmarkTarget = { x: number; y: number; scale: number };

const SEEN_KEY = "elev8:intro-seen";

/**
 * Floor and ceiling, in ms.
 *
 * FLOOR must clear the entrance choreography, which finishes at ~1.44s, plus a
 * beat for El to actually be seen. Set it below that and she gets pulled away
 * mid-rise. CEILING exists because nothing justifies holding a reader longer;
 * users overestimate passive waiting by about a third, so this already feels
 * like more than it is.
 */
const ENTRANCE_ENDS = 1440;
const FLOOR = ENTRANCE_ENDS + 260;
const CEILING = 2600;

/** Once per session, unless ?intro is present, which forces it for demos. */
function shouldPlay() {
  try {
    if (new URLSearchParams(location.search).has("intro")) return true;
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
  return Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    image.decode().catch(() => undefined),
  ]);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The loader, following the Paper loading artboards:
 *
 *   the 8 draws itself, one unbroken line
 *   it sinks into a hole and El rises through it, ears first
 *   she steps back down and the loop re-forms into the logotype
 *
 * It is gated on real work rather than on a fixed script. The entrance plays,
 * then it waits for fonts and El's artwork, then it leaves. Because the page is
 * fast that almost always means it leaves at FLOOR, but on a bad connection it
 * holds instead of tearing.
 *
 * The exit and the page's arrival are the same beat, from bible SS05: "the loop
 * re-forms into the logotype." Any input skips it.
 */
export function useIntro(reducedMotion: boolean, target: RefObject<WordmarkTarget | null>) {
  const [play] = useState(() => !reducedMotion && shouldPlay());
  const skip = !play;

  const draw = useMotionValue(skip ? 1 : 0);
  const eightOpacity = useMotionValue(skip ? 0 : 1);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const ringOpacity = useMotionValue(0);
  const riseY = useMotionValue(462);
  const stageX = useMotionValue(0);
  const stageY = useMotionValue(0);
  const stageScale = useMotionValue(1);
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

    // Entrance. The 8 comes into being, then sinks and she rises through it.
    run(animate(draw, 1, { duration: 0.58, ease: ENTER }));
    run(animate(eightOpacity, 0, { duration: 0.22, delay: 0.56, ease: LEAVE }));
    run(animate(ringOpacity, 1, { duration: 0.14, delay: 0.58, ease: ENTER }));
    run(animate(rx, UNWOUND.rx, { duration: 0.18, delay: 0.56, ease: SETTLE }));
    run(animate(ry, UNWOUND.ry, { duration: 0.18, delay: 0.56, ease: SETTLE }));
    run(animate(rx, OPENED.rx, { duration: 0.32, delay: 0.72, ease: ENTER }));
    run(animate(ry, OPENED.ry, { duration: 0.32, delay: 0.72, ease: ENTER }));
    // Ears first, unhurried. This is the moment the whole loader exists for.
    run(animate(riseY, 0, { duration: 0.58, delay: 0.86, ease: ENTER }));
    run(animate(ringOpacity, 0, { duration: 0.28, delay: 1.08, ease: LEAVE }));

    const exit = () => {
      if (cancelled) return;
      const mark = target.current;
      const move = { duration: 0.46, ease: SETTLE };

      // She steps back down first, then the loop travels alone.
      run(animate(riseY, 462, { duration: 0.28, ease: LEAVE }));
      run(animate(pageOpacity, 1, { duration: 0.44, delay: 0.16, ease: ENTER }));

      window.setTimeout(() => {
        if (cancelled) return;
        if (mark) {
          run(animate(stageX, mark.x, move));
          run(animate(stageY, mark.y, move));
          run(animate(stageScale, mark.scale, move));
        } else {
          // Nothing measured: close in place rather than fly somewhere wrong.
          run(animate(rx, 0, move));
          run(animate(ry, 0, move));
        }
        run(animate(loaderOpacity, 0, { duration: 0.26, delay: 0.28, ease: LEAVE }));
        window.setTimeout(finish, 620);
      }, 260);
    };

    // Leave when the work is done, never before FLOOR, never after CEILING.
    void Promise.race([
      Promise.all([assetsReady(), wait(FLOOR)]),
      wait(CEILING),
    ]).then(() => {
      if (!cancelled) exit();
    });

    // Any input skips straight out.
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
  }, [
    skip,
    target,
    draw,
    eightOpacity,
    rx,
    ry,
    ringOpacity,
    riseY,
    stageX,
    stageY,
    stageScale,
    loaderOpacity,
    pageOpacity,
  ]);

  return {
    draw,
    eightOpacity,
    rx,
    ry,
    ringOpacity,
    riseY,
    stageX,
    stageY,
    stageScale,
    loaderOpacity,
    pageOpacity,
    done,
    skip,
  };
}
