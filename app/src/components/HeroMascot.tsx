import { motion, useReducedMotion } from "motion/react";
import heroSrc from "../assets/el/neutral.png";
import { ENTER } from "../lib/motion";

/**
 * El introduces herself in the hero.
 *
 * The page used to open on brand lines alone, so you did not learn what she was
 * or what the page was for until the second fold. She says it herself now, in
 * the first few seconds.
 *
 * Her voice, per bible SS04: short, warm, plain sentences, and no
 * exclamation-mark enthusiasm. So "Hi. I'm El." rather than "Hi, I'm El!"
 *
 * The bubble is made of her: Cream fill, Petal line. It reads as part of the
 * mascot rather than a chat widget dropped on top of her.
 */
const LINES = ["Hi. I’m El.", "I’ll show you what changes."];

export function HeroMascot() {
  const reduced = useReducedMotion() === true;

  return (
    <div className="hero-mascot">
      <motion.div
        className="hero-bubble"
        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, delay: reduced ? 0 : 0.75, ease: ENTER }}
      >
        {LINES.map((line, index) => (
          <motion.p
            key={line}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: reduced ? 0 : 0.95 + index * 0.18, ease: ENTER }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      <img className="el-png hero-el" src={heroSrc} alt="El, the Elev8 mascot" />
    </div>
  );
}
