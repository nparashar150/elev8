import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState, type RefObject } from "react";
import { ENTER, LEAVE, SETTLE } from "./motion";

/** Where the hole lands when it closes: the "8" of the logotype, measured at runtime. */
export type EightTarget = { x: number; y: number; scale: number };

/**
 * Landing page §PRELOAD, to the beat:
 *
 *   "A soft round plum hole opens center-screen. El's ears rise through it, then
 *    her eyes. She holds a beat, then steps back down as the hole closes into the
 *    '8' of the logotype, top-left. 1.6 seconds. No copy."
 *
 * The timeline never waits on the measurement. If the "8" hasn't been measured by
 * the time the hole closes it just shrinks in place, because a preload that can
 * stall is a blank screen over the whole pitch.
 */
export function useIntro(skip: boolean, target: RefObject<EightTarget | null>) {
  const holeOpen = useMotionValue(0);
  const riseY = useMotionValue(462);
  const stageX = useMotionValue(0);
  const stageY = useMotionValue(0);
  const stageScale = useMotionValue(1);
  const stageOpacity = useMotionValue(skip ? 0 : 1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    const running: AnimationPlaybackControls[] = [];
    const timers: number[] = [];
    const play = (controls: AnimationPlaybackControls) => {
      running.push(controls);
      return controls;
    };

    // Seconds, laid out against the script's 1.6s budget.
    play(animate(holeOpen, 1, { duration: 0.3, ease: ENTER }));
    play(animate(riseY, 0, { duration: 0.5, delay: 0.22, ease: ENTER }));
    play(animate(riseY, 462, { duration: 0.28, delay: 1.0, ease: LEAVE }));
    play(animate(holeOpen, 0, { duration: 0.34, delay: 1.2, ease: LEAVE }));
    play(animate(stageOpacity, 0, { duration: 0.22, delay: 1.36, ease: LEAVE }));
    play(animate(pageOpacity, 1, { duration: 0.45, delay: 1.15, ease: ENTER }));

    // Read the "8" at the moment it's needed, not as a precondition for starting.
    timers.push(
      window.setTimeout(() => {
        const eight = target.current;
        if (!eight) return;
        const options = { duration: 0.38, ease: SETTLE };
        play(animate(stageX, eight.x, options));
        play(animate(stageY, eight.y, options));
        play(animate(stageScale, eight.scale, options));
      }, 1200),
    );

    timers.push(window.setTimeout(() => setDone(true), 1600));

    return () => {
      timers.forEach(window.clearTimeout);
      running.forEach((controls) => controls.stop());
    };
  }, [skip, target, holeOpen, riseY, stageX, stageY, stageScale, stageOpacity, pageOpacity]);

  return { holeOpen, riseY, stageX, stageY, stageScale, stageOpacity, pageOpacity, done, skip };
}
