import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Stacked-card scroll. Each card sticks to the top and the next one slides over
 * it, so the deck builds up rather than scrolling past. The card underneath
 * eases back as it gets covered, which is what sells the depth.
 */
export function StackCard({ children, last = false }: { children: ReactNode; last?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The last card is never covered, so it must not shrink.
  const scale = useTransform(scrollYProgress, [0, 1], last ? [1, 1] : [1, 0.9]);
  const brightness = useTransform(scrollYProgress, [0, 1], last ? [1, 1] : [1, 0.72]);
  const filter = useTransform(brightness, (value) => `brightness(${value})`);

  // The slot holds the layout position; the card inside it is what sticks.
  // Reading offsetTop off a sticky element gives its current stuck offset, not
  // where it actually lives, so navigation needs the slot.
  return (
    <div ref={ref} className="stack-slot">
      <div className="stack-card">
        <motion.div className="stack-card-inner" style={{ scale, filter }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
