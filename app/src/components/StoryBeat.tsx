import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Section } from "./sections";

type Props = {
  section: Section;
  start: number;
  end: number;
  progress: MotionValue<number>;
  active: boolean;
};

/**
 * One beat of a scroll-linked story. Opacity is bound to the beat's slice of
 * the container's scroll progress — the same idea as Motion's `scroll()` with
 * `offset: ["start start", "end end"]` on a tall pin. If the copy is taller
 * than the sticky viewport, `y` tracks the leftover so the beat pans instead
 * of clipping.
 */
export function StoryBeat({ section, start, end, progress, active }: Props) {
  const reduced = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  const span = Math.max(end - start, 0.0001);
  const fade = Math.min(0.07, span * 0.2);
  const first = start <= 0.0001;
  const last = end >= 0.999;

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const frame = inner?.parentElement;
    if (!inner || !frame) return;

    const measure = () => {
      setShift(Math.max(0, inner.scrollHeight - frame.clientHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const opacity = useTransform(
    progress,
    first ? [0, end - fade, end] : last ? [start, start + fade, 1] : [start, start + fade, end - fade, end],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  );

  const y = useTransform(progress, [start + fade, Math.max(end - fade, start + fade + 0.001)], [0, -shift]);

  return (
    <motion.article
      id={section.id}
      className={`story-beat panel-${section.id}`}
      style={reduced ? undefined : { opacity, pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
    >
      <motion.div ref={innerRef} className="story-beat-inner" style={reduced ? undefined : { y }}>
        <p className="kicker">{section.kicker}</p>
        {section.body}
      </motion.div>
    </motion.article>
  );
}
