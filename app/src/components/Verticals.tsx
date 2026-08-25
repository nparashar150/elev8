import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ENTER } from "../lib/motion";
import { Mark } from "./Mark";

/**
 * Bible §09. Six marks, each drawn the way its own shape argues for itself.
 * Picking a vertical replays that mark, so the choice is the reveal.
 */
const VERTICALS = [
  { id: "move", name: "Move", colour: "var(--move)", tagline: "Train the body you actually have." },
  { id: "long", name: "Long", colour: "var(--long)", tagline: "Play the long game with real numbers." },
  { id: "clear", name: "Clear", colour: "var(--clear)", tagline: "Sleep, stress, and the head between them." },
  { id: "fuel", name: "Fuel", colour: "var(--fuel)", tagline: "Find out what your food is actually doing." },
  { id: "know", name: "Know", colour: "var(--know)", tagline: "Get ahead of what runs in the family." },
  { id: "look", name: "Look", colour: "var(--look)", tagline: "Skin and hair, decided by chemistry." },
];

export function Verticals() {
  const [active, setActive] = useState(VERTICALS[0].id);
  const current = VERTICALS.find((vertical) => vertical.id === active) ?? VERTICALS[0];

  return (
    <div className="verticals">
      <ul className="marks">
        {VERTICALS.map((vertical) => (
          <li key={vertical.id}>
            <button
              type="button"
              aria-pressed={vertical.id === active}
              onClick={() => setActive(vertical.id)}
              style={{ ["--tile" as string]: vertical.colour }}
            >
              {/* Keyed on active so the selected mark redraws itself. */}
              <Mark
                key={`${vertical.id}-${vertical.id === active}`}
                id={vertical.id}
                colour={vertical.colour}
                play
                size={72}
              />
              <span className="mark-label">{vertical.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mark-copy" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.id}
            className="pull mark-tagline"
            style={{ ["--tile" as string]: current.colour }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: ENTER }}
          >
            {current.tagline}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
