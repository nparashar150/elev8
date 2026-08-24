import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ElStage } from "./components/ElStage";
import { SECTIONS } from "./components/sections";
import { useIntro } from "./lib/useIntro";

export default function App() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const intro = useIntro(stageRef, Boolean(reduced));
  const [active, setActive] = useState(0);

  // Nothing scrolls until El has arrived; the opening is a single held moment.
  useEffect(() => {
    document.body.style.overflow = intro.done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro.done]);

  // Whichever section owns the middle of the viewport owns El's expression.
  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = nodes.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header className="nav" style={{ opacity: intro.pageOpacity }}>
        <a className="wordmark" href="#hero">
          Elev
          <svg viewBox="0 0 28 40" aria-hidden="true">
            <path
              d="M14 3.5C7 3.5 4.5 8 4.5 12.5C4.5 16.5 7.5 19 14 20.5C20.5 22 23.5 24.5 23.5 28.5C23.5 33.5 20 36.5 14 36.5C8 36.5 4.5 33.5 4.5 28.5C4.5 24.5 7.5 22 14 20.5C20.5 19 23.5 16.5 23.5 12.5C23.5 8 21 3.5 14 3.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.1}
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a className="nav-cta" href="mailto:hello@02100.studio?subject=Elev8">
          Let’s talk
        </a>
      </motion.header>

      <div className="shell">
        <motion.main className="column" style={{ opacity: intro.pageOpacity }}>
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={`panel panel-${section.id}`}>
              <p className="kicker">{section.kicker}</p>
              {section.body}
            </section>
          ))}
        </motion.main>

        <div className="stage-col">
          {/* The column only announces itself once El has moved in. */}
          <motion.div className="stage-bed" style={{ opacity: intro.pageOpacity }} aria-hidden="true" />
          <motion.div
            ref={stageRef}
            className="stage"
            style={{ x: intro.offsetX, y: intro.offsetY, scale: intro.scale }}
          >
            <ElStage values={intro.values} pose={SECTIONS[active].pose} blinking={intro.blinking} />
          </motion.div>
          <motion.p className="pose-label" style={{ opacity: intro.pageOpacity }} aria-live="polite">
            {SECTIONS[active].pose}
          </motion.p>
        </div>
      </div>
    </>
  );
}
