import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState } from "react";
import { ENTER, LEAVE } from "./motion";

/**
 * The loader does one thing: the 8 draws itself as a single unbroken line,
 * holds for a beat, and hands over to the page.
 *
 * It deliberately does not stage the mascot. El rising belongs to the hero,
 * where she has somewhere to be; doing it twice in three seconds read as busy.
 */
export function useIntro(skip: boolean) {
  const draw = useMotionValue(skip ? 1 : 0);
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

    play(animate(draw, 1, { duration: 0.9, ease: ENTER }));
    play(animate(pageOpacity, 1, { duration: 0.5, delay: 1.15, ease: ENTER }));
    play(animate(loaderOpacity, 0, { duration: 0.4, delay: 1.15, ease: LEAVE }));

    const settle = window.setTimeout(() => setDone(true), 1650);
    return () => {
      window.clearTimeout(settle);
      running.forEach((controls) => controls.stop());
    };
  }, [skip, draw, loaderOpacity, pageOpacity]);

  return { draw, loaderOpacity, pageOpacity, done, skip };
}
