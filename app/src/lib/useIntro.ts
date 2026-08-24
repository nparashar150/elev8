import { animate, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState } from "react";
import { CIRCLE_D, HOLE_D, INFINITY_D } from "./shapes";
import type { StageValues } from "../components/ElStage";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The opening reads as one continuous gesture: the mark loads, resolves into a
 * circle, the circle sinks into a hole, El climbs out of it, blinks, and then
 * carries the whole stage over to the right where she stays for the rest of the
 * page.
 *
 * The loader is deliberately unhurried. Dynamic motion shortens how long a wait
 * *feels*, but urgent motion next to serious content reads as alarm, and El's
 * register is calm by construction.
 */
export function useIntro(stageRef: React.RefObject<HTMLDivElement | null>, skip: boolean) {
  const d = useMotionValue(skip ? HOLE_D : INFINITY_D);
  const dashLength = useMotionValue(skip ? 1 : 0.26);
  const dashOffset = useMotionValue(0);
  const fillOpacity = useMotionValue(skip ? 1 : 0);
  const strokeOpacity = useMotionValue(skip ? 0 : 1);
  const elY = useMotionValue(skip ? 0 : 78);
  const elOpacity = useMotionValue(skip ? 1 : 0);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scale = useMotionValue(1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);

  const dash = useTransform(dashLength, (v) => `${v} ${Math.max(1 - v, 0.0001)}`);

  const [blinking, setBlinking] = useState(false);
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

    // Park the stage dead centre, larger than its resting size.
    //
    // The offsets are measured from layout geometry rather than
    // getBoundingClientRect, because the rect already includes whatever
    // transform is on the element and would compound if this effect re-runs.
    const centre = () => {
      const node = stageRef.current;
      if (!node) return;
      let left = 0;
      let top = 0;
      for (let el: HTMLElement | null = node; el; el = el.offsetParent as HTMLElement | null) {
        left += el.offsetLeft;
        top += el.offsetTop;
      }
      const centreX = left + node.offsetWidth / 2 - window.scrollX;
      const centreY = top + node.offsetHeight / 2 - window.scrollY;
      const target = Math.min(window.innerHeight * 0.6, window.innerWidth * 0.62);
      scale.set(node.offsetHeight ? target / node.offsetHeight : 1);
      offsetX.set(window.innerWidth / 2 - centreX);
      offsetY.set(window.innerHeight / 2 - centreY);
    };
    centre();

    const run = async () => {
      // 1. Load. The dash travels the figure-eight twice before anything resolves.
      play(animate(dashOffset, -2, { duration: 1.9, ease: "linear" }));
      await wait(1900);
      if (cancelled) return;

      // 2. The loop closes into a circle and the gap in the stroke seals shut.
      play(animate(dashLength, 1, { duration: 0.5, ease: EASE }));
      play(animate(dashOffset, 0, { duration: 0.5, ease: EASE }));
      await play(animate(d, CIRCLE_D, { duration: 0.62, ease: EASE }));
      if (cancelled) return;
      await wait(420);
      if (cancelled) return;

      // 3. The circle sinks and flattens into an opening in the page.
      play(animate(strokeOpacity, 0, { duration: 0.45 }));
      play(animate(fillOpacity, 1, { duration: 0.4 }));
      await play(animate(d, HOLE_D, { duration: 0.62, ease: EASE }));
      if (cancelled) return;

      // 4. She was always there. Ears first.
      play(animate(elOpacity, 1, { duration: 0.2 }));
      await play(animate(elY, 0, { type: "spring", stiffness: 90, damping: 15 }));
      if (cancelled) return;

      // 5. Two blinks, so she registers as present rather than placed.
      await wait(260);
      if (cancelled) return;
      setBlinking(true);
      await wait(120);
      setBlinking(false);
      await wait(240);
      setBlinking(true);
      await wait(120);
      setBlinking(false);
      await wait(340);
      if (cancelled) return;

      // 6. She carries the stage to the right and hands the page over.
      play(animate(pageOpacity, 1, { duration: 0.7, ease: EASE }));
      await Promise.all([
        play(animate(offsetX, 0, { duration: 1.05, ease: EASE })),
        play(animate(offsetY, 0, { duration: 1.05, ease: EASE })),
        play(animate(scale, 1, { duration: 1.05, ease: EASE })),
      ]);
      if (cancelled) return;
      setDone(true);
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      running.forEach((controls) => controls.stop());
    };
  }, [skip, stageRef, d, dashLength, dashOffset, fillOpacity, strokeOpacity, elY, elOpacity, offsetX, offsetY, scale, pageOpacity]);

  return {
    values: { d, dash, dashOffset, fillOpacity, strokeOpacity, elY, elOpacity } satisfies StageValues,
    offsetX,
    offsetY,
    scale,
    pageOpacity,
    blinking,
    done,
  };
}
