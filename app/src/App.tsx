import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Loader } from "./components/Loader";
import { Wordmark } from "./components/Wordmark";
import { Story } from "./components/Story";
import { useIntro, type WordmarkTarget } from "./lib/useIntro";

export default function App() {
  const reduced = useReducedMotion() === true;
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const target = useRef<WordmarkTarget | null>(null);

  // The whole lockup travels to the nav, so measure the whole wordmark and the
  // loader's own box, and fly one onto the other.
  useLayoutEffect(() => {
    const measure = () => {
      const node = wordmarkRef.current;
      const stage = document.querySelector(".loader-lockup");
      if (!node || !stage) return;
      const mark = node.getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      if (!mark.width || !box.width) return;
      target.current = {
        x: mark.left + mark.width / 2 - (box.left + box.width / 2),
        y: mark.top + mark.height / 2 - (box.top + box.height / 2),
        scale: mark.width / box.width,
      };
    };
    measure();
    const id = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const intro = useIntro(reduced, target);

  useEffect(() => {
    document.body.style.overflow = intro.done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro.done]);

  return (
    <>
      {!intro.skip && !intro.done && (
        <motion.div className="loader" style={{ opacity: intro.loaderOpacity }} aria-hidden="true">
          <motion.div
            className="loader-travel"
            style={{ x: intro.stageX, y: intro.stageY, scale: intro.stageScale }}
          >
          <Loader elev={intro.elev} draw={intro.draw} riseY={intro.riseY} />
          </motion.div>
        </motion.div>
      )}

      <motion.header className="nav" style={{ opacity: intro.pageOpacity }}>
        <a className="wordmark" href="#hero" ref={wordmarkRef}>
          <Wordmark draw={intro.markDraw} />
        </a>
        {/* Scrolls to the close rather than firing a mailto, which from a nav
            reads as nothing happening. The button down there is the real one. */}
        <a className="nav-cta" href="#close">
          Let’s talk
        </a>
      </motion.header>

      <Story intro={intro} reduced={reduced} />
    </>
  );
}
