import { DECK } from "./Story";

/**
 * The running order as a rail rather than a slide.
 *
 * An agenda page tells you the shape once and then you forget it. A rail keeps
 * answering "where am I, how much is left" for the whole deck, and costs no
 * screen to do it. Titles stay hidden until you reach for them, so it reads as
 * a quiet mark rather than a menu.
 */
export function DeckRail({ active, onGo }: { active: number; onGo: (index: number) => void }) {
  return (
    <nav className="rail" aria-label="Slides">
      {DECK.map((slide, index) => (
        <button
          key={slide.id}
          type="button"
          className={index === active ? "is-active" : undefined}
          aria-current={index === active ? "true" : undefined}
          aria-label={`${index + 1}. ${slide.title}`}
          onClick={() => onGo(index)}
        >
          <span className="rail-tick" aria-hidden="true" />
          <span className="rail-label" aria-hidden="true">
            {slide.title}
          </span>
        </button>
      ))}
    </nav>
  );
}
