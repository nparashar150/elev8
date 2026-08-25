import { Button, ColorSwatch, Kbd } from "@heroui/react";
import { motion } from "motion/react";
import riseSrc from "../assets/el-rise.png";
import { ENTER } from "../lib/motion";
import { useDeck } from "../lib/useDeck";
import type { useIntro } from "../lib/useIntro";
import { Block, TONES } from "./Block";
import { EL_POSES, EL_SRC } from "./El";
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
  "kalava",
  "clear",
  "plum",
  "cream",
  "fuel",
  "long",
  "know",
  "look",
  "cream",
] as const;

const OFFER: [string, string][] = [
  ["Brand", "Positioning, naming, El, the whole system."],
  ["Web", "Every template, home to checkout."],
  ["App", "iOS and Android, onboarding that survives the kit."],
  ["Backend", "APIs, consent, audit logs, India residency."],
  ["Social", "Instagram, YouTube, LinkedIn. One voice."],
  ["Content", "The editorial engine. Recommended add-on."],
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
  ["Type", "A 96px headline and a 24px diagnosis. One face."],
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

function Numbered({ items }: { items: [string, string][] }) {
  return (
    <ol className="numbered">
      {items.map(([title, copy], index) => (
        <li key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{title}</b>
          <i>{copy}</i>
        </li>
      ))}
    </ol>
  );
}

export function Story({ intro, reduced }: Props) {
  const active = useDeck();
  const tone = TONES[DECK_TONES[active] ?? "cream"];

  return (
    <motion.main
      className="page"
      style={{
        opacity: intro.pageOpacity,
        ["--nav-on" as string]: tone.on === "cream" ? "var(--color-cream)" : "var(--color-ink)",
      }}
    >
      <StackCard>
        <Block id="hero" tone="cream" kicker="Health Centric → Elev8">
          <div className="hero">
            <div>
              <h1>
                Know your <em>baseline.</em>
              </h1>
              <p className="lede">Elevate everything.</p>
              <p className="line">Two million genomes. So we can be precise about one.</p>
              <p className="cue">
                <Kbd>
                  <Kbd.Abbr keyValue="down" />
                </Kbd>
                Start reading
              </p>
            </div>
            <img className="el-png el-idle hero-el" src={riseSrc} alt="" />
          </div>
        </Block>
      </StackCard>

      <StackCard>
        <Block id="honest" tone="kalava" kicker="Where we start">
          <h2>You already said it.</h2>
          <p className="line">
            <em>“Elevate your life.”</em> Best line on your site. Buried under four database statistics.
          </p>
          <p className="pull">Elev8 isn’t a new idea. It’s yours, with a face.</p>
        </Block>
      </StackCard>

      <StackCard>
        <Block id="problem" tone="clear" kicker="The brand problem">
          <h2>Exclusive, or inclusive.</h2>
          <p className="pull pull-muted">We don’t pick.</p>
          <p className="pull">Your baseline is yours alone. The wish to rise is everyone’s.</p>
          <Expand label="why that works">
            Exclusive because it’s n=1. Nobody else has your data, so nobody else can be sold your plan. Inclusive
            because everyone has a baseline, and every baseline is a legitimate place to start.
          </Expand>
        </Block>
      </StackCard>

      <StackCard>
        <Block id="el" tone="plum" kicker="The character">
          <h2>Meet El.</h2>
          <p className="line">She’s the 8 in your logo, stepped out.</p>
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
                  show: { opacity: 1, transition: { duration: 0.2, ease: ENTER } },
                }}
              >
                <Hole width="100%" stagger>
                  <img className="el-idle" src={EL_SRC[pose]} alt="" />
                </Hole>
                <span>{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Block>
      </StackCard>

      <StackCard>
        <Block id="elevate" tone="cream" kicker="Six panels. A different door.">
          <h2>What are you trying to elevate?</h2>
          <Verticals />
        </Block>
      </StackCard>

      <StackCard>
        <Block id="voice" tone="fuel" kicker="Same science">
          <h2>Different sentence.</h2>
          <Voices />
        </Block>
      </StackCard>

      <StackCard>
        <Block id="kit" tone="long" kicker="The kit">
          <h2>A brand you can hand to anyone.</h2>
          <ul className="palette">
            {PALETTE.map(([hex, name]) => (
              <li key={hex}>
                <ColorSwatch color={hex} size="lg" colorName={name} aria-label={`${name}, ${hex}`} />
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
        <Block id="offer" tone="know" kicker="What you get">
          <h2>Six things. One team.</h2>
          <Numbered items={OFFER} />
        </Block>
      </StackCard>

      <StackCard>
        <Block id="run" tone="look" kicker="How we’d run it">
          <h2>Five phases. One line.</h2>
          <Numbered items={PHASES} />
          <p className="line">Phase 3 is where a mascot becomes a reason to renew.</p>
        </Block>
      </StackCard>

      <StackCard last>
        <Block id="close" tone="cream">
          <div className="close">
            <h2>Chandra, this took a couple of days.</h2>
            <p className="lede">Give us the brand and we’ll give you the rest.</p>
            <Button
              size="lg"
              className="cta"
              onPress={() => {
                window.location.href = "mailto:hello@02100.studio?subject=Elev8";
              }}
            >
              Let’s talk →
            </Button>
            <p className="fine">
              A pitch from <b>02100</b>, a design studio in Bengaluru. ·{" "}
              <a href="assets/elev8-landing-page-final.pdf">Download the deck</a>
            </p>
            {/* She comes up one last time to close it out. */}
            <Hole width="min(240px, 52vw)">
              <img className="el-png el-idle" src={riseSrc} alt="" />
            </Hole>
          </div>
        </Block>
      </StackCard>
    </motion.main>
  );
}
