import type { ReactNode } from "react";
import type { Pose } from "./El";

export type Section = {
  id: string;
  pose: Pose;
  kicker: string;
  body: ReactNode;
};

const VERTICALS = [
  ["Move", "#C2412D", "Train the body you actually have.", "Every rep, every stride: one upward line."],
  ["Long", "#E6B422", "Play the long game with real numbers.", "A whole, steady state, held over time."],
  ["Clear", "#3D458F", "Sleep, stress, and the head between them.", "The line stress takes, before you catch it."],
  ["Fuel", "#4F7A54", "Find out what your food is actually doing.", "Shaped by what you actually eat."],
  ["Know", "#7A5A8A", "Get ahead of what runs in the family.", "Every point, connected: your family’s pattern."],
  ["Look", "#2A8A82", "Skin and hair, decided by chemistry.", "One clear read on skin and hair."],
];

const VOICES = [
  ["Endocrinology & Metabolism Panel: Rs. 25,000", "Why your body treats food differently. Metabolism. From ₹25,000."],
  [
    "Genes influencing MODY, T2D/T1D, Insulin sensitivity with exercise",
    "Find out whether exercise actually moves your blood sugar, or whether you need a different lever.",
  ],
  [
    "Gene variants influencing production of DHEA, Oxytocin, Melatonin, Cortisol",
    "Four hormones decide how you sleep, stress and recover. Yours don’t behave like anyone else’s.",
  ],
  ["2 Million: World’s Most Advanced Genomic Bigdata", "2 million genomes so we can be precise about one. Yours."],
  ["ALWAYS BE HEALTH CENTRIC", "Know your baseline. Elevate everything."],
];

const OFFER = [
  [
    "Brand",
    "Positioning, naming, the El character with a full pose sheet, colour and type system, tone of voice, and every collateral you’ll actually use. Delivered as a brand book any agency or freelancer can execute from without calling us.",
  ],
  [
    "Web design & development",
    "Every template, home to checkout, built on your existing stack so nothing’s thrown away. CMS your team can publish from. Green Core Web Vitals on mobile. Accessibility to WCAG AA. Non-negotiable in health.",
  ],
  [
    "App development",
    "iOS and Android. Onboarding that doesn’t lose people at the kit stage. Reports that translate findings into a plan. Roadmapped to El as an in-app companion.",
  ],
  [
    "Backend & infrastructure",
    "APIs, auth, sample lifecycle, report generation, payments, admin dashboard. Built for genomic data: encryption, consent management, audit logs, India data residency, a defensible DPDP position.",
  ],
  [
    "Social: Instagram, YouTube, LinkedIn",
    "Instagram is the brand’s face. YouTube is the credibility engine that converts a ₹25,000 decision. LinkedIn is the B2B pipeline into hospitals, corporates, and sports academies.",
  ],
  [
    "Content & always-on",
    "Pillar strategy, SEO, the Knowledge Centre rebuilt as a real asset, and AI-search optimisation, so Elev8 gets cited when someone asks a chatbot about genetic testing in India.",
  ],
];

const PHASES = [
  ["Identity", "Brand strategy, naming lock, El design and pose sheet, full visual system, brand book, core collateral."],
  ["Surfaces", "Website design and build, backend, CMS, B2B property, launch campaign, social system live."],
  [
    "Product & companion",
    "App design and build, report-translation layer, and El as an in-app companion: the thing that reads your genome back to you in your own language and remembers what you asked last month.",
  ],
  [
    "Parallel marketing",
    "Runs alongside Phases 1 to 3, not after. Instagram and LinkedIn content built in the brand’s own voice from day one, so Elev8 has a warmed-up audience waiting before the site or app ever ships.",
  ],
  [
    "Content at scale",
    "Where content stops being a build-up and becomes the engine. What’s working in Phase 4 tells us what’s worth scaling, rather than guessing at it now.",
  ],
];

export const SECTIONS: Section[] = [
  {
    id: "hero",
    pose: "neutral",
    kicker: "Health Centric → Elev8",
    body: (
      <>
        <h1>
          Know your <em>baseline.</em>
        </h1>
        <p className="lede">Elevate everything.</p>
        <p className="body">Two million genomes, so we can be precise about one.</p>
        <p className="cue">Scroll</p>
      </>
    ),
  },
  {
    id: "honest",
    pose: "neutral",
    kicker: "Where we start",
    body: (
      <>
        <h2>You already said it.</h2>
        <p className="quote">“Elevate your life.”</p>
        <p className="body">
          Health Centric’s current homepage carries one line above everything else. It’s the best thing on the site, and
          it’s fighting for air against four database statistics and a panel called Endocrinology &amp; Metabolism.
        </p>
        <p className="body">
          Elev8 isn’t a new idea. It’s the idea you already had, given a name, a face, and somewhere to stand.
        </p>
      </>
    ),
  },
  {
    id: "choice",
    pose: "thinking",
    kicker: "The brand problem",
    body: (
      <>
        <h2>Exclusive, or inclusive. Pick one.</h2>
        <p className="body">
          Exclusive gets you margin, aspiration, a reason to charge what precision is worth. It also gets you a brand
          nobody’s mother would click.
        </p>
        <p className="body">
          Inclusive gets you scale, warmth, a market of a billion people. It also gets you a commodity nobody pays a
          premium for.
        </p>
        <p className="pull">We don’t pick.</p>
        <p className="body">
          Elev8 is exclusive because it’s n=1. Nobody else on earth has your data, so nobody else can be sold your plan.
          It’s inclusive because everyone has a baseline, and every baseline is a legitimate place to start.
        </p>
      </>
    ),
  },
  {
    id: "el",
    pose: "neutral",
    kicker: "The character",
    body: (
      <>
        <h2>Meet El.</h2>
        <p className="body">
          Look at the “8” in Elev8 and you’ll find it: one unbroken line, looped twice. It’s the same shape as your
          nervous system in miniature. El was drawn from that line.
        </p>
        <p className="body">
          When you need her, the loop unwinds, opens a small hole in the page, and she rises up through it, ears first.
          She’s not arriving from somewhere else. She was already there.
        </p>
        <dl className="pairs">
          <div>
            <dt>Why a bunny</dt>
            <dd>She has to feel safe next to serious content. Calm, never performative.</dd>
          </div>
          <div>
            <dt>Why a hole</dt>
            <dd>She’s literally the logo. The hole and the loop she’s drawn from are the same “8”.</dd>
          </div>
        </dl>
      </>
    ),
  },
  {
    id: "elevate",
    pose: "waiting",
    kicker: "The same six panels. A different door.",
    body: (
      <>
        <h2>What are you trying to elevate?</h2>
        <ul className="verticals">
          {VERTICALS.map(([name, colour, tag, line]) => (
            <li key={name} style={{ ["--tile" as string]: colour }}>
              <span className="dot" aria-hidden="true" />
              <div>
                <h3>{name}</h3>
                <p>{tag}</p>
                <p className="fine">{line}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "voice",
    pose: "thinking",
    kicker: "Same science, different sentence",
    body: (
      <>
        <h2>We didn’t change what you sell. We changed what it sounds like.</h2>
        <ol className="voices">
          {VOICES.map(([was, now]) => (
            <li key={was}>
              <p className="was">{was}</p>
              <p className="now">{now}</p>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "kit",
    pose: "neutral",
    kicker: "The kit",
    body: (
      <>
        <h2>A brand you can hand to anyone.</h2>
        <div className="swatches" aria-hidden="true">
          {["#C2412D", "#3D458F", "#E6B422", "#4F7A54", "#E8A79C", "#4A3B3F"].map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </div>
        <p className="body">
          Colour lifted from the four-colour base-call scheme of a DNA sequencing chromatogram, warmed and made
          brand-safe. Kalava red carries every primary action. One saturated colour, one job.
        </p>
        <p className="body">
          One typeface across the whole system, confident enough to hold a 140px headline and warm enough to sit at 18px
          next to a diagnosis. Sport sits beside Cancer Panel here. The type has to survive both.
        </p>
        <p className="body">
          One motion system: things draw in before they appear, El leads every load and every empty state, and
          everything respects reduced motion by default.
        </p>
      </>
    ),
  },
  {
    id: "offer",
    pose: "waiting",
    kicker: "What you get from us",
    body: (
      <>
        <h2>Six things. One team. One line of accountability.</h2>
        <ol className="numbered">
          {OFFER.map(([title, copy], i) => (
            <li key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "run",
    pose: "thinking",
    kicker: "How we’d run it",
    body: (
      <>
        <h2>Five phases. One line.</h2>
        <ol className="numbered">
          {PHASES.map(([title, copy], i) => (
            <li key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="pull small">
          Phase 3 is where a mascot stops being a logo and starts being a reason to renew a subscription.
        </p>
      </>
    ),
  },
  {
    id: "close",
    pose: "celebrating",
    kicker: "02100 · Bengaluru",
    body: (
      <>
        <h2>Chandra. Everything above took a couple of days.</h2>
        <p className="lede">Give us the brand and we’ll give you the rest.</p>
        <a className="btn" href="mailto:hello@02100.studio?subject=Elev8">
          Let’s talk
        </a>
        <p className="fine">
          <a href="assets/elev8-landing-page-final.pdf">Download the deck</a>
        </p>
      </>
    ),
  },
];
