import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ENTER } from "../lib/motion";
import { Mark } from "./Mark";

/**
 * Bible §09. Six marks, each drawn the way its own shape argues for itself.
 * Picking a vertical replays that mark, so the choice is the reveal.
 */
/*
 * The six doors, in one place. The kit fold shows the same list as swatches and
 * takes the chosen one as its own background, so a colour, the panel it belongs
 * to and the block it paints can never drift apart.
 *
 * `tone` is the full-bleed version of `colour`. Three of the six are darkened
 * as grounds because the mark value cannot carry cream body copy at AA; Move
 * runs on Kalava, which is the same red the brand uses everywhere else.
 */
export const VERTICALS = [
  { id: "move", name: "Move", tone: "kalava", colour: "var(--move)", hex: "#C2412D", tagline: "Train the body you actually have." },
  { id: "long", name: "Long", tone: "long", colour: "var(--long)", hex: "#E6B422", tagline: "Play the long game with real numbers." },
  { id: "clear", name: "Clear", tone: "clear", colour: "var(--clear)", hex: "#3D458F", tagline: "Sleep, stress, and the head between them." },
  { id: "fuel", name: "Fuel", tone: "fuel", colour: "var(--fuel)", hex: "#4F7A54", tagline: "Find out what your food is actually doing." },
  { id: "know", name: "Know", tone: "know", colour: "var(--know)", hex: "#7A5A8A", tagline: "Get ahead of what runs in the family." },
  { id: "look", name: "Look", tone: "look", colour: "var(--look)", hex: "#2A8A82", tagline: "Skin and hair, decided by chemistry." },
] as const;

export function Verticals() {
  const [active, setActive] = useState<string>(VERTICALS[0].id);
  // A mark redraws by remounting, so each one carries its own count. Keying
  // every mark on the active id instead meant one click changed all six keys
  // and the whole row redrew, when only the one you pressed should.
  const [replays, setReplays] = useState<Record<string, number>>({});
  const current = VERTICALS.find((vertical) => vertical.id === active) ?? VERTICALS[0];

  const pick = (id: string) => {
    setActive(id);
    setReplays((counts) => ({ ...counts, [id]: (counts[id] ?? 0) + 1 }));
  };

  return (
    <div className="verticals">
      <ul className="marks">
        {VERTICALS.map((vertical) => (
          <li key={vertical.id}>
            <button
              type="button"
              aria-pressed={vertical.id === active}
              onClick={() => pick(vertical.id)}
              style={{ ["--tile" as string]: vertical.colour }}
            >
              {/* Keyed on its own replay count, so only this mark redraws. */}
              <Mark
                key={`${vertical.id}-${replays[vertical.id] ?? 0}`}
                id={vertical.id}
                colour={vertical.colour}
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
