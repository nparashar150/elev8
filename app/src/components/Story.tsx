import { Button, Chip, ColorSwatch, Kbd } from "@heroui/react";
import { motion } from "motion/react";
import { useEffect } from "react";
import closeSrc from "../assets/el-rise.png";
import heroSrc from "../assets/el/neutral.png";
import { ENTER } from "../lib/motion";
import { useDeck } from "../lib/useDeck";
import type { useIntro } from "../lib/useIntro";
import { Block, TONES } from "./Block";
import { DeckNav } from "./DeckNav";
import { EL_POSES, EL_SRC } from "./El";
import { ElevateMark } from "./ElevateMark";
import { Expand } from "./Expand";
import { Hole } from "./Hole";
import { StackCard } from "./StackCard";
import { Verticals } from "./Verticals";
import { Voices } from "./Voices";

type Props = {
  intro: ReturnType<typeof useIntro>;
  reduced: boolean;
};

/** Card order, so the nav can take the colour of whichever card is on top. */
export const DECK_TONES = [
  "cream",
  "know",
  "cream",
  "kalava",
  "clear",
  "fuel",
  "long",
  "plum",
  "look",
  "cream",
] as const;

const OFFER: [string, string][] = [
  ["Brand", "Positioning, naming, El, the whole system."],
  ["Web", "Every template, home to checkout."],
  ["App", "iOS and Android, onboarding that survives the kit."],
  ["Backend", "APIs, consent, audit logs, India residency."],
  ["Social", "Instagram, YouTube, LinkedIn. One voice."],
  ["Content", "The editorial engine behind everything."],
];

const PHASES: [string, string][] = [
  ["Identity", "Strategy, naming, El, the visual system."],
  ["Surfaces", "Website, backend, CMS, launch."],
  ["Product", "The app, and El inside it."],
  ["Marketing", "Runs alongside 1 to 3, not after."],
  ["Scale", "Content stops building up and becomes the engine."],
];

const KIT: [string, string][] = [
  ["Colour", "One saturated red. One job."],
  ["Type", "Confident at 96px. Still warm at 24, right next to a diagnosis."],
  ["El", "Drawn from the logo, not bolted onto it."],
  ["Motion", "Everything draws in. Nothing pops."],
];

const PALETTE: [string, string][] = [
  ["#C2412D", "Kalava"],
  ["#3D458F", "Signal Blue"],
  ["#E6B422", "Amber"],
  ["#4F7A54", "Jade"],
  ["#E8A79C", "Petal"],
  ["#4A3B3F", "Warm Plum"],
];

/**
 * The Waiting pose's companion mark. HeroUI's Spinner draws a gradient, which
 * is right for a product and wrong here: bible SS08 wants "a small separate
 * abstract spinner, drawn in her line colour". So it is drawn in Petal, at the
 * size and position the artwork had it, lifted out by tools/build-assets.py.
 */
function PoseSpinner() {
  return (
    <svg
      className="pose-spinner"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="var(--petal)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="46 36"
      />
    </svg>
  );
}

function Numbered({ items }: { items: [string, string][] }) {
  return (
    <ol className="numbered">
      {items.map(([title, copy], index) => (
        <li key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{title}</b>
          <i>
            {copy}
            {title === "Content" && (
              <Chip className="chip-soft" size="sm">
                <Chip.Label>recommended</Chip.Label>
              </Chip>
            )}
          </i>
        </li>
      ))}
    </ol>
  );
}

export function Story({ intro, reduced }: Props) {
  const { active, count, goTo } = useDeck();
  const tone = TONES[DECK_TONES[active] ?? "cream"];

  // The nav is a sibling of <main>, not a descendant, so a variable set on the
  // page cannot reach it. It goes on the root element instead.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--nav-on",
      tone.on === "cream" ? "var(--color-cream)" : "var(--color-ink)",
    );
  }, [tone]);

  return (
    <>
      <motion.main
        className="page"
        style={intro.done ? { opacity: 1 } : { opacity: intro.pageOpacity }}
      >
        <StackCard>
          <Block id="hero" tone="cream" kicker="Health Centric → Elev8">
            <div className="hero">
              <div>
                <h1>
                  Know your <em>baseline.</em>
                </h1>
                <p className="lede">Elevate everything.</p>
                <p className="line">
                  Two million genomes. So we can be precise about one.
                </p>
                <button
                  type="button"
                  className="cue"
                  onClick={() => goTo(active + 1)}
                >
                  <Kbd>
                    <Kbd.Abbr keyValue="down" />
                  </Kbd>
                  Start reading
                </button>
              </div>
              {/*
              She is simply here, peeking up, as the script has it: "a small
              hole open at the lower-right, El peeking up, ears up, watching the
              headline arrive." The rise belongs to the loader and to Meet El;
              doing it again here made her reveal twice on a first visit and
              wave on every reload.
            */}
              <img className="el-png el-idle hero-el" src={heroSrc} alt="" />
            </div>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="el" tone="know" kicker="The character">
            <h2>Meet El.</h2>
            <p className="line">
              She’s the 8 in your logo. Stepped out to say hello.
            </p>
            {/* Rabbit by rabbit: each pose rises out of its own hole in turn. */}
            <motion.ul
              className="poses"
              initial={reduced ? undefined : "hide"}
              whileInView={reduced ? undefined : "show"}
              viewport={{ once: true, amount: 0.4 }}
              variants={{ show: { transition: { staggerChildren: 0.16 } } }}
            >
              {EL_POSES.map(({ pose, label }) => (
                <motion.li
                  key={pose}
                  variants={{
                    hide: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { duration: 0.2, ease: ENTER },
                    },
                  }}
                >
                  <Hole width="100%" stagger>
                    <span className="pose-art">
                      <img
                        className={`el-gesture el-gesture-${pose}`}
                        src={EL_SRC[pose]}
                        alt=""
                      />
                      {/* Bible SS08: the spinner is a separate mark beside her,
                        never part of her body. */}
                      {pose === "waiting" && <PoseSpinner />}
                    </span>
                  </Hole>
                  <span>{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </Block>
        </StackCard>

        <StackCard>
          <Block
            id="elevate"
            tone="cream"
            kicker="Six panels. A different door."
          >
            <h2>What are you trying to elevate?</h2>
            <Verticals />
          </Block>
        </StackCard>

        <StackCard>
          <Block
            id="honest"
            tone="kalava"
            kicker="Where we start"
            watermark="move"
          >
            <h2>You already said it.</h2>
            <p className="line">
              <em>“Elevate your life.”</em> Already there. Already the best line
              on the page. Buried under four database stats and a panel called{" "}
              <em>Endocrinology &amp; Metabolism</em>.
            </p>
            <p className="pull">
              Elev8 isn’t a new idea. It’s the one you already wrote. We just
              gave it a face.
            </p>
          </Block>
        </StackCard>

        <StackCard>
          <Block
            id="problem"
            tone="clear"
            kicker="The brand problem"
            watermark="clear"
          >
            <h2>Exclusive, or inclusive.</h2>
            <p className="pull pull-muted">We don’t pick.</p>
            <p className="pull">
              Your baseline is yours alone. The wish to rise is everyone’s.
            </p>
            <Expand label="the reasoning">
              Exclusive because it’s n=1. Nobody else has your data, so nobody
              else can be sold your plan. Inclusive because everyone has a
              baseline, and every baseline is a legitimate place to start.
            </Expand>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="voice" tone="fuel" kicker="Same science" watermark="fuel">
            <h2>Different sentence.</h2>
            <Voices />
          </Block>
        </StackCard>

        <StackCard>
          <Block id="kit" tone="long" kicker="The kit" watermark="long">
            <h2>The brand breakdown for Elev8.</h2>
            <ul className="palette">
              {PALETTE.map(([hex, name]) => (
                <li key={hex}>
                  <ColorSwatch
                    color={hex}
                    size="lg"
                    colorName={name}
                    aria-label={`${name}, ${hex}`}
                  />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
            <dl className="terse">
              {KIT.map(([term, copy]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="offer" tone="plum" kicker="What you get" watermark="know">
            <h2>Six things. One team.</h2>
            <Numbered items={OFFER} />
          </Block>
        </StackCard>

        <StackCard>
          <Block id="run" tone="look" kicker="How we’d run it" watermark="look">
            <h2>Five phases. One line.</h2>
            <Numbered items={PHASES} />
            <p className="line">
              Phase 3 is where a mascot stops being a logo and starts being a
              reason to renew.
            </p>
          </Block>
        </StackCard>

        <StackCard last>
          <Block id="close" tone="cream">
            <div className="close">
              {/* The aside is the aside. The ask is the headline. */}
              <p className="close-note">
                Hey Chandra, this took us 3 days to put everything together.
                <br />
                And note that this is only the rough sketch.
              </p>
              {/* The last word performs the pun: elevate becomes Elev8. */}
              <h2>
                Give us the brand and we’ll <ElevateMark />
              </h2>
              <Button
                size="lg"
                className="cta"
                onPress={() => {
                  window.location.href =
                    "mailto:hello@02100.studio?subject=Elev8";
                }}
              >
                Let’s talk →
              </Button>
              {/* One last rise to close it out. */}
              <Hole width="min(240px, 52vw)">
                <img className="el-png el-idle" src={closeSrc} alt="" />
              </Hole>
            </div>
          </Block>
        </StackCard>
      </motion.main>

      <DeckNav active={active} count={count} onGo={goTo} />
    </>
  );
}
