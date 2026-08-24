import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { Eight } from "./components/Eight";
import { El } from "./components/El";
import { Story } from "./components/Story";
import { useIntro } from "./lib/useIntro";

export default function App() {
  const reduced = useReducedMotion();
  const skip = reduced === true;
  const intro = useIntro(skip);

  useEffect(() => {
    document.body.style.overflow = intro.done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro.done]);

  return (
    <>
      <motion.div className="intro-veil" style={{ opacity: intro.veilOpacity }} aria-hidden="true" />
      <motion.div className="intro-eight" style={{ opacity: intro.eightOpacity }} aria-hidden="true">
        <Eight pathLength={intro.pathLength} />
      </motion.div>

      <motion.header className="nav" style={{ opacity: intro.pageOpacity }}>
        <a className="wordmark" href="#hero">
          Elev8
        </a>
        <a className="nav-cta" href="mailto:hello@02100.studio?subject=Elev8">
          Let’s talk
        </a>
      </motion.header>

      <Story intro={intro} reduced={skip} />

      <motion.aside className="el-mark" style={{ opacity: intro.elOpacity }} aria-hidden="true">
        <El />
      </motion.aside>
    </>
  );
}
