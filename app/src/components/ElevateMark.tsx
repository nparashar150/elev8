import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ENTER } from "../lib/motion";
import { Wordmark } from "./Wordmark";

/**
 * The last word of the pitch performs its own pun, in three beats:
 *
 *   elevate   the word, read plainly
 *   gold      a gleam sweeps across it, which is the hinge
 *   Elev8     the real wordmark, its 8 drawing itself as one unbroken line
 *
 * The gold sits on the word rather than on the mark. After the mark has already
 * arrived it is just a flourish; before, it is the thing that turns one into
 * the other.
 *
 * Under reduced motion it is simply the mark, already drawn.
 */
const GILD = 900;
const SWAP = 1040;

export function ElevateMark() {
  const reduced = useReducedMotion() === true;
  const [gilding, setGilding] = useState(false);
  const [swapped, setSwapped] = useState(reduced);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <motion.span
      className="elevate-mark"
      layout
      onViewportEnter={() => {
        if (swapped || gilding) return;
        setGilding(true);
        timer.current = window.setTimeout(() => setSwapped(true), SWAP);
      }}
      viewport={{ once: true, amount: 0.8 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {swapped ? (
          <motion.span
            key="mark"
            className="wordmark-accent"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, ease: ENTER }}
          >
            <Wordmark reveal={!reduced} />
          </motion.span>
        ) : (
          <motion.span
            key="word"
            className={gilding ? "elevate-word is-gilding" : "elevate-word"}
            style={{ ["--gild-ms" as string]: `${GILD}ms` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: ENTER }}
          >
            elevate
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
