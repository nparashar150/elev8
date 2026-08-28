import { Card } from "@heroui/react";
import { motion } from "motion/react";
import { ENTER } from "../lib/motion";
import { useReveal } from "../lib/useReveal";

/**
 * Six things, as six things you can count rather than six lines you have to
 * read. The number carries the scan, the title carries the meaning, and the
 * line is there for whoever slows down.
 *
 * They arrive one at a time so the count registers as a count. Six tiles that
 * appear together are a texture you skim past; six that land in order are six
 * things, and someone hearing this pitched out loud can name each one as it
 * lands. See useReveal for why this is not whileInView.
 */
const OFFER: [string, string][] = [
  ["Brand", "Name, El, voice, and the system under all of it."],
  ["Web", "Nineteen sections, rebuilt as one path."],
  ["App", "The one already on both stores, rebuilt around El."],
  ["Backend", "APIs, consent, audit logs, India residency."],
  ["Social", "Instagram, YouTube, LinkedIn. One voice."],
  ["Content", "The video hub and knowledge centre, on a schedule."],
];

/** Faster than the phase track: a tile lands whole, a phase has a line to draw. */
const BETWEEN_CARDS = 120;

export function Offer({ play }: { play: boolean }) {
  const shown = useReveal(play, OFFER.length, BETWEEN_CARDS);

  return (
    <ul className="scorecards">
      {OFFER.map(([title, copy], index) => {
        const on = index < shown;
        return (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
            transition={{ duration: 0.36, ease: ENTER }}
          >
            <Card className="scorecard">
              <Card.Content>
                <span className="scorecard-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="scorecard-title">{title}</span>
                <span className="scorecard-line">{copy}</span>
              </Card.Content>
            </Card>
          </motion.li>
        );
      })}
    </ul>
  );
}
