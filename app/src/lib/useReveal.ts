import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Reveals a list one item at a time, once, and returns how many are on screen.
 *
 * Deliberately not whileInView. The deck stacks its cards, so an
 * IntersectionObserver calls a card visible while it is still buried under the
 * ones above it: the sequence plays where nobody can see it and you arrive to
 * find it already over. This runs off the deck's active card instead.
 *
 * Deliberately not staggerChildren either. That only steps through elements
 * declaring variants at every level between the parent and the thing being
 * animated, and one missing link silently collapses the whole sequence into a
 * single frame, which is exactly what happened twice here. Counting in state is
 * duller and cannot fail that way.
 *
 * The count only goes up, so leaving the slide and coming back finds the list
 * built rather than replaying it at someone who has already watched it. Leaving
 * mid-sequence pauses it; returning picks it up where it stopped.
 *
 * Reduced motion skips the sequence entirely rather than pacing it slower. The
 * whole list is present from the start, because a preference about movement
 * should never be the reason someone has to wait for content.
 */
export function useReveal(play: boolean, total: number, step: number) {
  const still = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (still || !play || shown >= total) return;
    // The first item does not wait. play only turns true once the card has
    // finished arriving, so a lead-in here would be a second wait for something
    // that has already happened, and it reads as the section lagging the scroll.
    if (shown === 0) {
      setShown(1);
      return;
    }
    const timer = window.setTimeout(() => setShown((count) => count + 1), step);
    return () => window.clearTimeout(timer);
  }, [still, play, shown, total, step]);

  return still ? total : shown;
}
