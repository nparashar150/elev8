/**
 * Step control, bottom right. Small and quiet: the deck is a normal scrolling
 * page and this is an affordance, not the way you are meant to read it.
 *
 * It takes the colour of whichever card is on top, the same variable the header
 * uses, so it stays legible over every block.
 */
type Props = {
  active: number;
  count: number;
  onGo: (index: number) => void;
};

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={up ? { rotate: "180deg" } : undefined}>
      <path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DeckNav({ active, count, onGo }: Props) {
  const atStart = active <= 0;
  const atEnd = count > 0 && active >= count - 1;

  return (
    <div className="deck-nav">
      <button type="button" aria-label="Previous section" disabled={atStart} onClick={() => onGo(active - 1)}>
        <Chevron up />
      </button>
      <button type="button" aria-label="Next section" disabled={atEnd} onClick={() => onGo(active + 1)}>
        <Chevron />
      </button>
    </div>
  );
}
