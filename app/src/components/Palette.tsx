import { VERTICALS } from "./Verticals";

/**
 * The six colours, as the rule they are evidence for.
 *
 * Six static circles are a swatch row, and a swatch row is a thing designers
 * show each other. Picking one names the panel it belongs to and prints the
 * hex, which is the whole claim of this fold made touchable: the rules are
 * written down, and here is one of them written down.
 *
 * The block behind it takes the chosen colour, which is why the selection lives
 * in the deck rather than in here: the rule is not described, it is applied to
 * the slide making the claim.
 *
 * Every swatch carries a ring in the block's own text colour. Whichever door is
 * selected is amber-on-amber with its own ground, so without the ring that one
 * swatch is simply not there.
 */
export function Palette({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const current = VERTICALS.find((vertical) => vertical.id === value) ?? VERTICALS[0];

  return (
    <div className="palette-set">
      <ul className="palette">
        {VERTICALS.map((vertical) => (
          <li key={vertical.id}>
            <button
              type="button"
              aria-pressed={vertical.id === value}
              aria-label={`${vertical.name}, ${vertical.hex}`}
              onClick={() => onChange(vertical.id)}
              style={{ ["--tile" as string]: vertical.colour }}
            >
              <span className="swatch" aria-hidden="true" />
              <span className="swatch-name">{vertical.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="palette-read" aria-live="polite">
        <b>{current.name}</b>
        <span className="palette-hex">{current.hex}</span>
        {current.tagline}
      </p>
    </div>
  );
}
