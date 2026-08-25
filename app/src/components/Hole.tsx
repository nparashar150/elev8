import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ENTER } from "../lib/motion";

/**
 * The only reveal on the page. Bible §04: "She emerges, she doesn't appear.
 * Every entrance starts with the hole opening, then ears, then eyes. Never a
 * hard cut, never a pop-in."
 *
 * `stagger` hands timing to a parent list so the poses can come up one rabbit
 * at a time; on its own it plays as soon as it scrolls into view.
 */
const lip = {
  hide: { scaleX: 0, scaleY: 0 },
  show: { scaleX: 1, scaleY: 1, transition: { duration: 0.4, ease: ENTER } },
};

const payload = {
  hide: { y: "100%" },
  show: { y: 0, transition: { duration: 0.62, delay: 0.15, ease: ENTER } },
};

type Props = { children: ReactNode; width: string; stagger?: boolean };

export function Hole({ children, width, stagger = false }: Props) {
  const own = stagger
    ? {}
    : { initial: "hide" as const, whileInView: "show" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <motion.div className="hole" style={{ ["--hole-width" as string]: width }} {...own}>
      <div className="hole-well">
        <motion.div className="hole-payload" variants={payload}>
          {children}
        </motion.div>
      </div>
      <motion.div className="hole-lip" variants={lip} aria-hidden="true" />
    </motion.div>
  );
}
