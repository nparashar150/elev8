import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useState } from "react";
import { CIRCLE_D, HOLE_D, INFINITY_D } from "./shapes";
import type { StageValues } from "../components/ElStage";

const EASE = [0.22, 1, 0.36, 1] as const;
const GLIDE = [0.65, 0, 0.35, 1] as const;

/**
 * Opening is a held sequence. The loader is a compact vertical 8 — the
 * wordmark, not a wide sideways infinity — with a dash chasing the stroke.
 * After two seconds it morphs into a circle, holds, then flattens into the
 * hole El climbs out of.
 */
export function useIntro(stageRef: React.RefObject<HTMLDivElement | null>, skip: boolean) {
  const d = useMotionValue(skip ? HOLE_D : INFINITY_D);
  const dashOffset = useMotionValue(0);
  const dashArray = useMotionValue(skip ? "1 0" : "0.42 0.58");
  const fillOpacity = useMotionValue(skip ? 1 : 0);
  const strokeOpacity = useMotionValue(skip ? 0 : 1);
  const trackOpacity = useMotionValue(skip ? 0 : 0.28);
  const elY = useMotionValue(skip ? 0 : 78);
  const elOpacity = useMotionValue(skip ? 1 : 0);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scale = useMotionValue(1);
  const pageOpacity = useMotionValue(skip ? 1 : 0);

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
      const target = Math.min(window.innerHeight * 0.7, window.innerWidth * 0.48);
      scale.set(node.offsetHeight ? target / node.offsetHeight : 1);
      offsetX.set(window.innerWidth / 2 - centreX);
      offsetY.set(window.innerHeight / 2 - centreY);
    };
    centre();

    const run = async () => {
      // 1. Load. Same loop as Motion's example: offset 0 → −1, 1s, forever.
      const loop = play(animate(dashOffset, -1, { duration: 1, repeat: Infinity, ease: "linear" }));
      await wait(2400);
      loop.stop();
      if (cancelled) return;

      // 2. Seal the dash so the whole mark is present, then close it into a circle.
      dashOffset.set(0);
      dashArray.set("1 0");
      play(animate(trackOpacity, 0, { duration: 0.45 }));
      await play(animate(d, CIRCLE_D, { duration: 0.8, ease: EASE }));
      if (cancelled) return;
      await wait(700);
      if (cancelled) return;

      // 3. The circle sinks and flattens into an opening in the page.
      play(animate(strokeOpacity, 0, { duration: 0.45 }));
      play(animate(fillOpacity, 1, { duration: 0.4 }));
      await play(animate(d, HOLE_D, { duration: 0.75, ease: EASE }));
      if (cancelled) return;

      // 4. She was always there. Ears first.
      play(animate(elOpacity, 1, { duration: 0.25 }));
      await play(animate(elY, 0, { type: "spring", stiffness: 70, damping: 16 }));
      if (cancelled) return;

      // 5. Two blinks, so she registers as present rather than placed.
      await wait(400);
      if (cancelled) return;
      setBlinking(true);
      await wait(220);
      setBlinking(false);
      await wait(280);
      setBlinking(true);
      await wait(220);
      setBlinking(false);
      await wait(480);
      if (cancelled) return;

      // 6. She carries the stage to the right. Content follows her, not the other way round.
      play(animate(pageOpacity, 1, { duration: 0.8, delay: 0.35, ease: "easeOut" }));
      await Promise.all([
        play(animate(offsetX, 0, { duration: 1.25, ease: GLIDE })),
        play(animate(offsetY, 0, { duration: 1.25, ease: GLIDE })),
        play(animate(scale, 1, { duration: 1.25, ease: GLIDE })),
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
  }, [skip, stageRef, d, dashOffset, dashArray, fillOpacity, strokeOpacity, trackOpacity, elY, elOpacity, offsetX, offsetY, scale, pageOpacity]);

  return {
    values: { d, dashOffset, dashArray, fillOpacity, strokeOpacity, trackOpacity, elY, elOpacity } satisfies StageValues,
    offsetX,
    offsetY,
    scale,
    pageOpacity,
    blinking,
    done,
  };
}
