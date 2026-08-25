import { useEffect, useState } from "react";

/**
 * Deck behaviour for the stacked cards.
 *
 * The hero shows an arrow-key hint, so the arrow keys have to actually work.
 * Also reports which card is on top, so the nav can take that card's text
 * colour instead of relying on a blend mode to guess.
 */
export function useDeck() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = () => Array.from(document.querySelectorAll<HTMLElement>(".stack-card"));

    const read = () => {
      const list = cards();
      let index = 0;
      list.forEach((card, i) => {
        if (card.getBoundingClientRect().top <= 1) index = i;
      });
      setActive((previous) => (previous === index ? previous : index));
    };

    const goTo = (index: number) => {
      const list = cards();
      const target = list[Math.max(0, Math.min(list.length - 1, index))];
      if (target) window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    };

    const onKey = (event: KeyboardEvent) => {
      // Leave typing and modified shortcuts alone.
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const list = cards();
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

  return active;
}
