import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMemo, useRef, useState, type RefObject } from "react";
import { ElStage } from "./ElStage";
import { SECTIONS, SECTION_HOLD } from "./sections";
import { StoryBeat } from "./StoryBeat";
import type { useIntro } from "../lib/useIntro";

type Intro = ReturnType<typeof useIntro>;

type Props = {
  intro: Intro;
  stageRef: RefObject<HTMLDivElement | null>;
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

/**
 * Motion's pinning recipe: a tall container defines the scroll distance, an
 * inner `position: sticky; height: 100vh` holds the scene, and `useScroll`
 * with `offset: ["start start", "end end"]` binds values to that distance.
 * El's pose is a function of the same progress, so the right column is
 * scroll-linked rather than observer-triggered.
 */
export function Story({ intro, stageRef, reduced }: Props) {
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
      <div className="shell">
        <motion.main className="column" style={{ opacity: intro.pageOpacity }}>
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={`panel panel-${section.id}`}>
              <p className="kicker">{section.kicker}</p>
              {section.body}
            </section>
          ))}
        </motion.main>
        <Stage intro={intro} stageRef={stageRef} poseIndex={active} />
      </div>
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
        <Stage intro={intro} stageRef={stageRef} poseIndex={active} />
        <motion.div className="story-progress" style={{ scaleY: scrollYProgress }} aria-hidden="true" />
      </div>
    </section>
  );
}

function Stage({
  intro,
  stageRef,
  poseIndex,
}: {
  intro: Intro;
  stageRef: RefObject<HTMLDivElement | null>;
  poseIndex: number;
}) {
  return (
    <div className="stage-col">
      <motion.div className="stage-bed" style={{ opacity: intro.pageOpacity }} aria-hidden="true" />
      <motion.div
        ref={stageRef}
        className="stage"
        style={{ x: intro.offsetX, y: intro.offsetY, scale: intro.scale }}
      >
        <ElStage values={intro.values} pose={SECTIONS[poseIndex].pose} blinking={intro.blinking} />
      </motion.div>
      <motion.p className="pose-label" style={{ opacity: intro.pageOpacity }} aria-live="polite">
        {SECTIONS[poseIndex].pose}
      </motion.p>
    </div>
  );
}
