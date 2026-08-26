import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ENTER } from "../lib/motion";
import { Wordmark } from "./Wordmark";

/**
 * The last word of the pitch performs its own pun: "elevate" becomes "Elev8".
 *
 * The word holds long enough to be read, then swaps for the real wordmark in
 * Kalava, whose 8 traces itself on arrival. The wrapper animates its own layout
 * so the width change carries the rest of the sentence with it rather than
 * snapping.
 *
 * Under reduced motion it is simply the mark, already drawn.
 */
const HOLD = 700;

export function ElevateMark() {
  const reduced = useReducedMotion() === true;
  const [swapped, setSwapped] = useState(reduced);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <motion.span
      className="elevate-mark"
      layout
      onViewportEnter={() => {
        if (swapped) return;
        timer.current = window.setTimeout(() => setSwapped(true), HOLD);
      }}
      viewport={{ once: true, amount: 0.8 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {swapped ? (
          <motion.span
            key="mark"
            className="wordmark-accent"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: ENTER }}
          >
            <Wordmark reveal={!reduced} shine={!reduced} />
          </motion.span>
        ) : (
          <motion.span key="word" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: ENTER }}>
            elevate
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
