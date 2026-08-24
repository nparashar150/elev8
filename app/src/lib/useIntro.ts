import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState } from "react";

/**
 * One gesture: the 8 draws complete, holds, then the page takes over.
 * No dash, no infinity, no morphing circus.
 */
export function useIntro(skip: boolean) {
  const pathLength = useMotionValue(skip ? 1 : 0);
  const eightOpacity = useMotionValue(skip ? 0 : 1);
  const veilOpacity = useMotionValue(skip ? 0 : 1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);
  const elOpacity = useMotionValue(skip ? 1 : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    let cancelled = false;
    const timers: number[] = [];
    const running: AnimationPlaybackControls[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    const play = <T extends AnimationPlaybackControls>(controls: T) => {
      running.push(controls);
      return controls;
    };

    const run = async () => {
      await wait(180);
      if (cancelled) return;
      await play(animate(pathLength, 1, { duration: 1.7, ease: [0.22, 1, 0.36, 1] }));
      if (cancelled) return;
      await wait(1100);
      if (cancelled) return;
      play(animate(pageOpacity, 1, { duration: 0.9, ease: "easeOut" }));
      play(animate(elOpacity, 1, { duration: 1.1, delay: 0.25, ease: "easeOut" }));
      play(animate(eightOpacity, 0, { duration: 0.7, delay: 0.15, ease: "easeOut" }));
      await play(animate(veilOpacity, 0, { duration: 0.85, delay: 0.1, ease: "easeOut" }));
      if (cancelled) return;
      setDone(true);
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      running.forEach((controls) => controls.stop());
    };
  }, [skip, pathLength, eightOpacity, veilOpacity, pageOpacity, elOpacity]);

  return { pathLength, eightOpacity, veilOpacity, pageOpacity, elOpacity, done };
}
