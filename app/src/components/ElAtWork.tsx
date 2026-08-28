import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EL_SRC, type ElPose } from "./El";
import { Hole } from "./Hole";
import { ENTER } from "../lib/motion";

/**
 * What El actually does, which the deck answers and then buries.
 *
 * The line "El as an in-app companion, the thing that reads your genome back to
 * you in your own language" sits inside Phase 3 of a delivery timeline. Bible
 * SS10 lists where she works, and, more usefully, where she does not. This fold
 * promotes both into a product moment.
 *
 * Every word here is the deck's own. The third beat is the one that earns her:
 * near a serious result she is absent, on purpose.
 */
/** Chunks enter staggered and leave together, smaller than they arrived. */
const CHUNK = {
  enter: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ENTER } },
  leave: { opacity: 0, y: -4, transition: { duration: 0.18, ease: ENTER } },
};

type Step = {
  title: string;
  caption: string;
  pose: ElPose | null;
  screen: ReactNode;
};

const STEPS: Step[] = [
  {
    title: "The report lands.",
    caption: "A report-ready moment. She waits. She never nags.",
    pose: "waiting",
    screen: (
      <>
        <motion.p variants={CHUNK} className="screen-label">Endocrinology &amp; Metabolism</motion.p>
        <motion.p variants={CHUNK} className="screen-headline">Your panel is ready.</motion.p>
        <motion.p variants={CHUNK} className="screen-meta">12 findings · ₹25,000 panel</motion.p>
      </>
    ),
  },
  {
    title: "She reads it back to you.",
    caption: "In your own language. And she remembers what you asked last month.",
    pose: "neutral",
    screen: (
      <>
        <motion.p variants={CHUNK} className="screen-label">The finding</motion.p>
        <motion.p variants={CHUNK} className="screen-was">
          Gene variants influencing production of DHEA, Oxytocin, Melatonin, Cortisol
        </motion.p>
        <motion.p variants={CHUNK} className="screen-headline">
          Four hormones decide how you sleep, stress and recover. Yours don’t behave like anyone else’s.
        </motion.p>
      </>
    ),
  },
  {
    title: "And she knows when to leave.",
    caption: "Near a serious result she steps back. That one is a human moment, not a mascot’s.",
    pose: null,
    screen: (
      <>
        <motion.p variants={CHUNK} className="screen-label">A finding that needs a person</motion.p>
        <motion.p variants={CHUNK} className="screen-headline">This one we’d rather you heard from someone.</motion.p>
        <motion.p variants={CHUNK} className="screen-action">Talk to a genetic counsellor →</motion.p>
      </>
    ),
  },
];

const DWELL = 3600;

export function ElAtWork({ play }: { play: boolean }) {
  const reduced = useReducedMotion() === true;
  const [step, setStep] = useState(0);
  const [driving, setDriving] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  // Runs off the deck's own signal rather than a viewport observer. Under
  // stacked cards an observer calls this visible while it is still buried, so
  // the sequence used to start unseen and, because it wrapped, you arrived at
  // whichever beat it happened to be on. On a fold titled "this is what she
  // does" that was usually beat three, the one where she is deliberately
  // absent. It now starts at one when you get here and stops at three.
  useEffect(() => {
    if (!play || !driving || reduced) return;
    if (step >= STEPS.length - 1) return;
    timer.current = window.setTimeout(() => setStep((current) => current + 1), DWELL);
    return () => window.clearTimeout(timer.current);
  }, [play, driving, reduced, step]);

  const current = STEPS[step];

  return (
    <motion.div className="atwork">
      <div className="atwork-copy">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial="enter"
            animate="show"
            exit="leave"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            <motion.p className="atwork-step" variants={CHUNK}>
              {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </motion.p>
            <motion.p className="pull pull-small" variants={CHUNK}>
              {current.title}
            </motion.p>
            <motion.p className="line" variants={CHUNK}>
              {current.caption}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <ol className="atwork-dots">
          {STEPS.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                aria-label={item.title}
                aria-current={index === step}
                className={index === step ? "is-active" : undefined}
                onClick={() => {
                  window.clearTimeout(timer.current);
                  setDriving(false);
                  setStep(index);
                }}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="atwork-frame">
        <div className="atwork-screen">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial="enter"
              animate="show"
              exit="leave"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {current.screen}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Her absence in the last step is the argument, so the slot stays. */}
        <div className="atwork-el">
          <AnimatePresence initial={false}>
            {current.pose && (
              <motion.div
                key={current.pose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: ENTER }}
              >
                <Hole width="100%">
                  <img src={EL_SRC[current.pose]} alt="" />
                </Hole>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
