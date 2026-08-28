import type { ReactNode } from "react";
import { Mark } from "./Mark";

/**
 * A full-bleed colour block. The palette is the page structure, not a swatch
 * row: every section owns one brand colour and the type reverses out of it.
 *
 * `ground` is the background; `on` is the only text colour used on top of it,
 * chosen per block so body copy clears WCAG AA rather than by eye.
 *
 * No scroll reveal. The one reveal on this page is El rising out of her hole,
 * in her own section; everything else is just there when you get to it.
 */
export type BlockTone = {
  ground: string;
  on: "cream" | "ink";
};

export const TONES: Record<string, BlockTone> = {
  cream: { ground: "var(--color-cream)", on: "ink" },
  kalava: { ground: "var(--color-kalava-block)", on: "cream" },
  clear: { ground: "var(--color-clear)", on: "cream" },
  plum: { ground: "var(--color-plum)", on: "cream" },
  fuel: { ground: "var(--color-fuel-block)", on: "cream" },
  long: { ground: "var(--color-long)", on: "ink" },
  know: { ground: "var(--color-know)", on: "cream" },
  look: { ground: "var(--color-look-block)", on: "cream" },
};

type Props = {
  id: string;
  tone: keyof typeof TONES;
  kicker?: string;
  /** The block's own mark, drawn large and quiet in the right half. */
  watermark?: string;
  children: ReactNode;
};

export function Block({ id, tone, kicker, watermark, children }: Props) {
  const { ground, on } = TONES[tone];
  return (
    <section id={id} className={`block block-on-${on}`} style={{ background: ground }}>
      <div className="block-inner">
        <div className="block-copy">
          {kicker && <p className="kicker">{kicker}</p>}
          {children}
        </div>
        {watermark && (
          <div className="block-mark" aria-hidden="true">
            <Mark key={watermark} id={watermark} colour="currentColor" size={520} delay={0.15} />
          </div>
        )}
      </div>
    </section>
  );
}
