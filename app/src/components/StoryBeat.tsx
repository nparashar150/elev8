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
 * One beat of a scroll-linked story. Visibility is tied to the beat's slice of
 * the pin's scroll progress (Motion `offset: ["start start", "end end"]`).
 * Only the active beat paints — stacked copy was unreadable. If the copy is
 * taller than the sticky viewport, `y` tracks the leftover so the beat pans.
 */
export function StoryBeat({ section, start, end, progress, active }: Props) {
  const reduced = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  const span = Math.max(end - start, 0.0001);
  const fade = Math.min(0.07, span * 0.2);

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

  const y = useTransform(progress, [start + fade, Math.max(end - fade, start + fade + 0.001)], [0, -shift]);

  return (
    <article
      id={section.id}
      className={`story-beat panel-${section.id}${active ? " is-active" : ""}`}
      aria-hidden={!active}
    >
      <motion.div ref={innerRef} className="story-beat-inner" style={reduced ? undefined : { y }}>
        <p className="kicker">{section.kicker}</p>
        {section.body}
      </motion.div>
    </article>
  );
}
