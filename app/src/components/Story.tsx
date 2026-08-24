import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { SECTIONS, SECTION_HOLD } from "./sections";
import { StoryBeat } from "./StoryBeat";
import type { useIntro } from "../lib/useIntro";

type Intro = ReturnType<typeof useIntro>;

type Props = {
  intro: Intro;
  reduced: boolean;
};

function rangesFor(holds: number[]) {
  const total = holds.reduce((sum, hold) => sum + hold, 0);
  let cursor = 0;
  return {
    total,
    ranges: holds.map((hold) => {
      const start = cursor / total;
      cursor += hold;
      return { start, end: cursor / total };
    }),
  };
}

export function Story({ intro, reduced }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const holds = useMemo(() => SECTIONS.map((section) => SECTION_HOLD[section.id] ?? 1), []);
  const { total, ranges } = useMemo(() => rangesFor(holds), [holds]);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = ranges.findIndex((range) => value < range.end - 0.0001);
    const next = index === -1 ? ranges.length - 1 : index;
    setActive((prev) => (prev === next ? prev : next));
  });

  if (reduced) {
    return (
      <motion.main className="story-flow" style={{ opacity: intro.pageOpacity }}>
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className={`panel panel-${section.id}`}>
            <p className="kicker">{section.kicker}</p>
            {section.body}
          </section>
        ))}
      </motion.main>
    );
  }

  return (
    <section ref={containerRef} className="story" style={{ height: `${total * 100}vh` }}>
      <div className="story-pin">
        <motion.div className="story-left" style={{ opacity: intro.pageOpacity }}>
          {SECTIONS.map((section, index) => (
            <StoryBeat
              key={section.id}
              section={section}
              start={ranges[index].start}
              end={ranges[index].end}
              progress={scrollYProgress}
              active={index === active}
            />
          ))}
        </motion.div>
        <motion.div className="story-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </div>
    </section>
  );
}
