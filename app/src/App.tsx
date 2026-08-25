import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Rise, RISE } from "./components/Rise";
import { Story } from "./components/Story";
import { useIntro, type EightTarget } from "./lib/useIntro";

/** Matches .preload-stage in global.css — the preload needs its own width to aim. */
const stageWidth = () => Math.min(360, window.innerWidth * 0.46);

export default function App() {
  const reduced = useReducedMotion();
  const skip = reduced === true;
  const eightRef = useRef<HTMLSpanElement>(null);
  const target = useRef<EightTarget | null>(null);

  // §PRELOAD closes the hole "into the '8' of the logotype, top-left" — so measure
  // the 8 rather than guessing at where the wordmark renders.
  useLayoutEffect(() => {
    const measure = () => {
      const node = eightRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const holeWidth = stageWidth() * ((RISE.rx * 2) / RISE.w);
      target.current = {
        x: box.left + box.width / 2 - window.innerWidth / 2,
        y: box.top + box.height / 2 - window.innerHeight / 2,
        scale: box.width / holeWidth,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    // Inter arrives after first paint and moves the 8 — re-measure once it has.
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const intro = useIntro(skip, target);

  useEffect(() => {
    document.body.style.overflow = intro.done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro.done]);

  return (
    <>
      {!intro.skip && !intro.done && (
        <motion.div className="preload" style={{ opacity: intro.stageOpacity }} aria-hidden="true">
          <motion.div
            className="preload-stage"
            style={{ x: intro.stageX, y: intro.stageY, scale: intro.stageScale }}
          >
            <Rise holeOpen={intro.holeOpen} riseY={intro.riseY} className="preload-rise" />
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

      <Story intro={intro} reduced={skip} />
    </>
  );
}
