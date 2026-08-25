import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { Loader } from "./components/Loader";
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
      {!intro.skip && !intro.done && (
        <motion.div className="loader" style={{ opacity: intro.loaderOpacity }} aria-hidden="true">
          <Loader
            trackOpacity={intro.trackOpacity}
            dashOffset={intro.dashOffset}
            tracerOpacity={intro.tracerOpacity}
            rx={intro.rx}
            ry={intro.ry}
            ringOpacity={intro.ringOpacity}
            riseY={intro.riseY}
          />
        </motion.div>
      )}

      <motion.header className="nav" style={{ opacity: intro.pageOpacity }}>
        <a className="wordmark" href="#hero">
          Elev8
        </a>
        <a className="nav-cta" href="mailto:hello@02100.studio?subject=Elev8">
          Let’s talk
        </a>
      </motion.header>

      <Story intro={intro} reduced={skip} />
    </>
  );
}
