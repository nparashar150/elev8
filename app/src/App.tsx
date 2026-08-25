import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Loader } from "./components/Loader";
import { OPENED } from "./lib/eight";
import { Story } from "./components/Story";
import { useIntro, type WordmarkTarget } from "./lib/useIntro";

/*
 * The loop re-forms into the logotype, so the loader has to know where the "8"
 * actually renders. The hole sits at 50% across and 74.1% down the loader's own
 * box (viewBox 0 -56 120 116, hole centred at 60,30), and its drawn width is
 * 2 * 41.4 / 120 of that box.
 */
const HOLE_X = 0.5;
const HOLE_Y = (30 + 56) / 116;
const HOLE_W = (OPENED.rx * 2) / 120;

export default function App() {
  const reduced = useReducedMotion() === true;
  const eightRef = useRef<HTMLSpanElement>(null);
  const target = useRef<WordmarkTarget | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const node = eightRef.current;
      const stage = document.querySelector(".loader-eight");
      if (!node || !stage) return;
      const mark = node.getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      if (!mark.width || !box.width) return;
      target.current = {
        x: mark.left + mark.width / 2 - (box.left + box.width * HOLE_X),
        y: mark.top + mark.height / 2 - (box.top + box.height * HOLE_Y),
        scale: mark.width / (box.width * HOLE_W),
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
          <Loader
            draw={intro.draw}
            eightOpacity={intro.eightOpacity}
            rx={intro.rx}
            ry={intro.ry}
            ringOpacity={intro.ringOpacity}
            riseY={intro.riseY}
          />
          </motion.div>
        </motion.div>
      )}

      <motion.header className="nav" style={{ opacity: intro.pageOpacity }}>
        <a className="wordmark" href="#hero">
          Elev<span ref={eightRef}>8</span>
        </a>
        <a className="nav-cta" href="mailto:hello@02100.studio?subject=Elev8">
          Let’s talk
        </a>
      </motion.header>

      <Story intro={intro} reduced={reduced} />
    </>
  );
}
