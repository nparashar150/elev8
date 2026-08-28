import { motion } from "motion/react";
import { ENTER } from "../lib/motion";
import { useReveal } from "../lib/useReveal";

/**
 * Five phases as a track rather than a list.
 *
 * This fold is the one that answers "show me how things will flow", so it does
 * not simply appear: the line draws forward, the node lands on it, the copy
 * arrives with the node, and only then does the next phase begin.
 *
 * See useReveal for why this is neither whileInView nor staggerChildren.
 */
const PHASES: { title: string; line: string; mark?: boolean }[] = [
  { title: "Identity", line: "Strategy, naming, El, the visual system." },
  { title: "Surfaces", line: "Website, backend, CMS, launch." },
  { title: "Product", line: "The app, and El inside it.", mark: true },
  { title: "Marketing", line: "Runs alongside 1 to 3, not after." },
  { title: "Scale", line: "Content becomes the engine." },
];

/** A phase takes about 0.5s to land, so the next one waits that long. */
const BETWEEN_PHASES = 520;

export function Phases({ play }: { play: boolean }) {
  const shown = useReveal(play, PHASES.length, BETWEEN_PHASES);

  return (
    <ol className="track">
      {PHASES.map((phase, index) => {
        const on = index < shown;
        return (
          <li key={phase.title} className={phase.mark ? "is-marked" : undefined}>
            {/* The line reaches ahead before the phase it leads to exists. */}
            <motion.span
              className="track-seg"
              aria-hidden="true"
              initial={{ scaleX: 0, scaleY: 0 }}
              animate={{ scaleX: on ? 1 : 0, scaleY: on ? 1 : 0 }}
              transition={{ duration: 0.26, ease: ENTER }}
            />
            <motion.span
              className="track-node"
              aria-hidden="true"
              initial={{ scale: 0 }}
              animate={{ scale: on ? 1 : 0 }}
              transition={{ duration: 0.24, delay: on ? 0.1 : 0, ease: ENTER }}
            />
            {/* The copy arrives with its node, so a phase lands as one thing. */}
            <motion.span
              className="track-body"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
              transition={{ duration: 0.28, delay: on ? 0.13 : 0, ease: ENTER }}
            >
              <span className="track-num">Phase {index + 1}</span>
              <span className="track-title">{phase.title}</span>
              <span className="track-line">{phase.line}</span>
            </motion.span>
          </li>
        );
      })}
    </ol>
  );
}
