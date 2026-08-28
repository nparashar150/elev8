import { Kbd } from "@heroui/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import closeSrc from "../assets/el-rise.png";
import heroSrc from "../assets/el-rise.png";
import { ENTER } from "../lib/motion";
import { useDeck } from "../lib/useDeck";
import type { useIntro } from "../lib/useIntro";
import { Block, TONES } from "./Block";
import { DeckNav } from "./DeckNav";
import { DeckRail } from "./DeckRail";
import { EL_POSES, EL_SRC } from "./El";
import { ElevateMark } from "./ElevateMark";
import { Hole } from "./Hole";
import { Offer } from "./Offer";
import { Palette } from "./Palette";
import { Phases } from "./Phases";
import { StackCard } from "./StackCard";
import { Verticals, VERTICALS } from "./Verticals";
import { Voices } from "./Voices";

type Props = {
  intro: ReturnType<typeof useIntro>;
  reduced: boolean;
};

/** Card order, so the nav can take the colour of whichever card is on top. */
/** The deck, in order. Drives the nav colour and the slide numbers. */
export const DECK = [
  { id: "hero", tone: "cream", title: "Know your baseline" },
  { id: "honest", tone: "kalava", title: "Where the name came from" },
  { id: "el", tone: "know", title: "This is El" },
  { id: "elevate", tone: "cream", title: "Six reasons" },
  { id: "problem", tone: "clear", title: "The door" },
  { id: "voice", tone: "fuel", title: "Same science" },
  { id: "kit", tone: "long", title: "The rules" },
  { id: "offer", tone: "plum", title: "What you get" },
  { id: "run", tone: "look", title: "Five phases" },
  { id: "close", tone: "cream", title: "Scope call" },
] as const;

export const DECK_TONES = DECK.map((slide) => slide.tone);

/* Six names, not six explanations. The slide's point is that rules exist and
   get handed over, and describing each one turned that into a spec sheet. */
const KIT = ["Colour", "Type", "El", "Motion", "Voice", "Layout"];

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

/* The kit fold opens on its own colour, so nothing moves until someone picks. */
const KIT_DEFAULT = "long";

export function Story({ intro, reduced }: Props) {
  const { active, revealing, count, goTo } = useDeck();

  // Which door the kit fold is currently painted in. It is the one slide whose
  // colour is not fixed, because the rule it states is "one colour per panel"
  // and the cheapest way to prove that is to let the slide obey it.
  const [door, setDoor] = useState<string>(KIT_DEFAULT);
  const kit = VERTICALS.find((vertical) => vertical.id === door) ?? VERTICALS[1];

  const toneName = DECK[active]?.id === "kit" ? kit.tone : DECK_TONES[active] ?? "cream";
  const tone = TONES[toneName];

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
                  <b>Two million genomes. One baseline.</b>
                  <br />
                  The brand, product and system built around it.
                </p>
                {/* A first pass, not a finished answer. The whole deck is
                    pitched at a scope call, and the cover has to say so. */}
                <p className="fine">A first pass at Elev8.</p>
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
                She rises as the rewrite lands, so she is performing the change
                rather than standing next to it. Bible SS04's test is that she
                shows up for a reason; this is the reason, and it means the hero
                answers "what does the mascot do" without a word of explanation.
              */}
              {/* She rises as the rewrite lands, so she performs the change
                  rather than standing beside it. */}
              <div className="hero-el">
                <Hole width="100%">
                  <img src={heroSrc} alt="El, the Elev8 mascot" />
                </Hole>
              </div>
            </div>
          </Block>
        </StackCard>

        <StackCard>
          <Block
            id="honest"
            tone="kalava"
            kicker="Where the name came from"
            watermark="move"
          >
            <h2>We didn&rsquo;t invent the name.</h2>
            <p className="line lead">Your homepage already says:</p>
            <blockquote className="artefact">&ldquo;Elevate your life.&rdquo;</blockquote>
            <p className="line">
              <b>Health Centric</b> describes the company.
              <br />
              <b>Elev8</b> describes what the customer comes here to do.
            </p>
            <p className="line">
              You already wrote the promise. We think it deserves to be the
              brand.
            </p>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="el" tone="know" kicker="The character">
            <h2>This is El.</h2>
            <p className="line lead">
              The 8, stepped out.
              <br />
              Not another generic AI mascot. Not a chatbot with a face.
            </p>
            <p className="line">
              El explains. El waits. El knows when to step back.
              <br />
              <b>One character across the app, website and brand.</b>
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
            kicker="Your six panels, renamed"
          >
            <h2>What are you actually trying to elevate?</h2>
            <p className="line lead">
              Today the customer sees six medical categories. We see six reasons
              to become better. Pick one.
            </p>
            <Verticals />
          </Block>
        </StackCard>

        <StackCard>
          <Block
            id="problem"
            tone="clear"
            kicker="Who it is for"
            watermark="clear"
          >
            <h2>The problem isn&rsquo;t the product. It&rsquo;s the door.</h2>
            <p className="line lead">
              Health Centric currently speaks to everyone: cancer, diabetes,
              beauty, sport, longevity, diagnostics. When everything is for
              everyone, <b>nothing feels like it was made for me</b>.
            </p>
            <dl className="fork">
              <div>
                <dt>Too exclusive</dt>
                <dd>Loses scale.</dd>
              </div>
              <div>
                <dt>Too broad</dt>
                <dd>Loses value.</dd>
              </div>
            </dl>
            <p className="pull">Elev8 sits between the two.</p>
            <p className="line">
              <em>
                The result is yours alone. The desire to improve is universal.
              </em>
            </p>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="voice" tone="fuel" kicker="The words on the site" watermark="fuel">
            <h2>We don&rsquo;t need to change the science.</h2>
            <p className="lede">
              We need to change the way people understand it.
            </p>
            <Voices />
            <p className="line">
              Every line on the left is live on healthcentric.net today.
              <br />
              <b>Same test. Same price. Different reason to care.</b>
            </p>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="kit" tone={kit.tone} kicker="After we hand over" watermark={door}>
            <h2>A brand shouldn&rsquo;t depend on the person who built it.</h2>
            <p className="line lead">
              We don&rsquo;t just hand over the logo. We hand over the rules
              that make Elev8 <b>Elev8</b>.
            </p>
            <p className="palette-note">One colour per panel</p>
            <Palette value={door} onChange={setDoor} />
            <p className="rules">{KIT.join(" · ")}</p>
            <p className="line">
              So six months later, another designer doesn&rsquo;t start
              guessing.
            </p>
          </Block>
        </StackCard>

        <StackCard>
          <Block id="offer" tone="plum" kicker="What you get" watermark="know">
            <h2>Six things. One team.</h2>
            <p className="line lead">
              Brand. Web. App. Backend. Social. Content.
              <br />
              <b>One system, instead of six disconnected projects.</b>
            </p>
            <Offer play={DECK[revealing]?.id === "offer"} />
          </Block>
        </StackCard>

        <StackCard>
          <Block id="run" tone="look" kicker="How we’d run it" watermark="look">
            <h2>Five phases. One conversation at a time.</h2>
            <p className="line lead">
              We don&rsquo;t need to lock the entire journey today. We start
              with the identity, build the surfaces, bring El into the product,
              then scale what works.
            </p>
            <Phases play={DECK[revealing]?.id === "run"} />
            <p className="line">Every phase leaves something usable behind.</p>
          </Block>
        </StackCard>

        <StackCard last>
          <Block id="close" tone="cream">
            <div className="close">
              {/* The ask is a conversation, not a signature. Asking to scope it
                  together is the honest next step and the easier yes. */}
              <p className="close-note">
                We&rsquo;ve spent three days turning the idea into a first
                system.
                <br />
                This is still a rough sketch.
              </p>
              {/* The last word performs the pun: elevate becomes Elev8. */}
              <h2>
                Let&rsquo;s scope <ElevateMark />
              </h2>
              <p className="line">
                Let&rsquo;s sit together, pressure-test it, and work out what we
                build first.
              </p>
              {/* One last rise to close it out. */}
              <Hole width="min(240px, 52vw)">
                <img className="el-png el-idle" src={closeSrc} alt="" />
              </Hole>
            </div>
          </Block>
        </StackCard>
      </motion.main>

      <DeckRail active={active} onGo={goTo} />
      <DeckNav active={active} count={count} onGo={goTo} />
    </>
  );
}
