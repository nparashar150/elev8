import { motion } from "motion/react";
import { ENTER } from "../lib/motion";
import { useReveal } from "../lib/useReveal";

/**
 * Three counts taken off the live site.
 *
 * The line above this one is praise, and praise is easy to wave away. Numbers
 * he can go and check on his own site in ten seconds are not, which is why the
 * argument is made in counts rather than adjectives. Nothing here is an
 * opinion: it is what is on healthcentric.net today.
 *
 * They land one at a time because nineteen, then ten, then one is a sentence
 * with a punchline, and the punchline only works if it arrives last.
 */
const COUNTS: [string, string][] = [
  ["19", "sections on the homepage"],
  ["10", "destinations in the top navigation"],
  ["1", "main button, and it asks for a phone call"],
];

const BETWEEN_COUNTS = 300;

export function Audit({ play }: { play: boolean }) {
  const shown = useReveal(play, COUNTS.length, BETWEEN_COUNTS);

  return (
    <ul className="counts">
      {COUNTS.map(([number, label], index) => {
        const on = index < shown;
        return (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
            transition={{ duration: 0.36, ease: ENTER }}
          >
            <span className="count-num">{number}</span>
            <span className="count-label">{label}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}
