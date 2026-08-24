import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Story } from "./components/Story";
import { useIntro } from "./lib/useIntro";

export default function App() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const intro = useIntro(stageRef, Boolean(reduced));

  useEffect(() => {
    document.body.style.overflow = intro.done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro.done]);

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

      <Story intro={intro} stageRef={stageRef} reduced={Boolean(reduced)} />
    </>
  );
}
