import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState } from "react";
import { ENTER, LEAVE, SETTLE } from "./motion";
import { OPENED, UNWOUND } from "./eight";

/** One full lap of the eight, in the path's own units. */
const LAP = 252;

/**
 * The loader, following the Paper file's five loading artboards in order:
 *
 *   01 Trace     a petal dash travels the faint 8
 *   02 Infinity  it keeps travelling, one unbroken line
 *   03 Unwind    the loop collapses to a small ellipse at the centre
 *   04 The hole  the ellipse opens, petal rim around warm plum
 *   05 El        the rim recedes and she rises through, ears first
 *
 * Roughly 2.6s end to end. Every value here is measured off those artboards
 * rather than invented; see lib/eight.ts for the conversion.
 */
export function useIntro(skip: boolean) {
  const trackOpacity = useMotionValue(skip ? 0 : 0.19);
  const dashOffset = useMotionValue(0);
  const tracerOpacity = useMotionValue(skip ? 0 : 1);
  const rx = useMotionValue(skip ? OPENED.rx : 0);
  const ry = useMotionValue(skip ? OPENED.ry : 0);
  const ringOpacity = useMotionValue(0);
  const riseY = useMotionValue(462);
  const loaderOpacity = useMotionValue(skip ? 0 : 1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    const running: AnimationPlaybackControls[] = [];
    const play = (controls: AnimationPlaybackControls) => {
      running.push(controls);
      return controls;
    };

    // 01 + 02: the dash runs one and a half laps of the eight.
    play(animate(dashOffset, -LAP * 1.5, { duration: 1.35, ease: "linear" }));

    // 03: the loop collapses into the centre, the track fades out behind it.
    play(animate(tracerOpacity, 0, { duration: 0.22, delay: 1.2, ease: LEAVE }));
    play(animate(trackOpacity, 0, { duration: 0.32, delay: 1.24, ease: LEAVE }));
    play(animate(ringOpacity, 1, { duration: 0.18, delay: 1.22, ease: ENTER }));
    play(animate(rx, UNWOUND.rx, { duration: 0.3, delay: 1.2, ease: SETTLE }));
    play(animate(ry, UNWOUND.ry, { duration: 0.3, delay: 1.2, ease: SETTLE }));

    // 04: the hole opens.
    play(animate(rx, OPENED.rx, { duration: 0.42, delay: 1.55, ease: ENTER }));
    play(animate(ry, OPENED.ry, { duration: 0.42, delay: 1.55, ease: ENTER }));

    // 05: the rim recedes as she rises through it, ears first.
    play(animate(riseY, 0, { duration: 0.62, delay: 1.95, ease: ENTER }));
    play(animate(ringOpacity, 0, { duration: 0.4, delay: 2.05, ease: LEAVE }));

    // She holds a beat, then steps back down and the hole closes after her.
    // The page arrives on an empty screen, so there is nothing to cross-fade
    // her into and no jump from the centre to wherever the hero holds her.
    play(animate(riseY, 462, { duration: 0.44, delay: 2.95, ease: LEAVE }));
    play(animate(rx, 0, { duration: 0.36, delay: 3.24, ease: SETTLE }));
    play(animate(ry, 0, { duration: 0.36, delay: 3.24, ease: SETTLE }));

    play(animate(pageOpacity, 1, { duration: 0.52, delay: 3.5, ease: ENTER }));
    play(animate(loaderOpacity, 0, { duration: 0.3, delay: 3.5, ease: LEAVE }));

    const settle = window.setTimeout(() => setDone(true), 4050);
    return () => {
      window.clearTimeout(settle);
      running.forEach((controls) => controls.stop());
    };
  }, [skip, trackOpacity, dashOffset, tracerOpacity, rx, ry, ringOpacity, riseY, loaderOpacity, pageOpacity]);

  return {
    trackOpacity,
    dashOffset,
    tracerOpacity,
    rx,
    ry,
    ringOpacity,
    riseY,
    loaderOpacity,
    pageOpacity,
    done,
    skip,
  };
}
