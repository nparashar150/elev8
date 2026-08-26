import { Kbd } from "@heroui/react";

/**
 * Step control, bottom right. Uses the same key the hero's cue shows, so the
 * two read as one system: this is the thing that arrow does.
 *
 * It takes the colour of whichever card is on top, the same variable the header
 * uses, so it stays legible over every block.
 */
type Props = {
  active: number;
  count: number;
  onGo: (index: number) => void;
};

export function DeckNav({ active, count, onGo }: Props) {
  const atStart = active <= 0;
  const atEnd = count > 0 && active >= count - 1;

  return (
    <div className="deck-nav">
      <button type="button" aria-label="Previous section" disabled={atStart} onClick={() => onGo(active - 1)}>
        <Kbd>
          <Kbd.Abbr keyValue="up" />
        </Kbd>
      </button>
      <button type="button" aria-label="Next section" disabled={atEnd} onClick={() => onGo(active + 1)}>
        <Kbd>
          <Kbd.Abbr keyValue="down" />
        </Kbd>
      </button>
    </div>
  );
}
