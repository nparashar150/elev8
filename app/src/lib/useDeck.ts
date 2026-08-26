import { useCallback, useEffect, useState } from "react";

/**
 * Deck behaviour for the stacked cards.
 *
 * One source of truth for moving between cards: the arrow keys, the hero's
 * "start reading" cue and the corner control all go through goTo, so they
 * cannot disagree about where the next card is.
 *
 * Also reports which card is on top, so the nav can take that card's text
 * colour instead of relying on a blend mode to guess.
 */
export function useDeck() {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);

  const goTo = useCallback((index: number) => {
    const slots = Array.from(document.querySelectorAll<HTMLElement>(".stack-slot"));
    const target = slots[Math.max(0, Math.min(slots.length - 1, index))];
    // The slot holds the layout position; a sticky card's offsetTop is wherever
    // it is currently stuck, which is not where it lives.
    if (target) window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const slots = () => Array.from(document.querySelectorAll<HTMLElement>(".stack-slot"));
    const cards = () => Array.from(document.querySelectorAll<HTMLElement>(".stack-card"));

    const read = () => {
      const list = cards();
      let index = 0;
      list.forEach((card, i) => {
        if (card.getBoundingClientRect().top <= 1) index = i;
      });
      setActive((previous) => (previous === index ? previous : index));
      setCount((previous) => (previous === list.length ? previous : list.length));
    };

    const onKey = (event: KeyboardEvent) => {
      // Leave typing and modified shortcuts alone.
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const list = slots();
      let index: number | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown") index = active + 1;
      else if (event.key === "ArrowUp" || event.key === "PageUp") index = active - 1;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = list.length - 1;
      if (index === null) return;

      event.preventDefault();
      goTo(index);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return { active, count, goTo };
}
