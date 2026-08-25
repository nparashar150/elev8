import { Tabs } from "@heroui/react";
import type { ReactNode } from "react";

/**
 * §05. The point is one claim: same science, different sentence. HeroUI Tabs
 * carries the switch, so keyboard and assistive-tech behaviour comes from
 * react-aria rather than from anything I hand-rolled.
 */
const LINES: { was: string; now: ReactNode }[] = [
  {
    was: "“Endocrinology & Metabolism Panel, Rs. 25,000”",
    now: (
      <>
        “Why your body treats food differently. <b>Metabolism.</b> From ₹25,000.”
      </>
    ),
  },
  {
    was: "“Genes influencing MODY, T2D/T1D, Insulin sensitivity with exercise”",
    now: "“Find out whether exercise actually moves your blood sugar.”",
  },
  {
    was: "“Gene variants influencing production of DHEA, Oxytocin, Melatonin, Cortisol”",
    now: "“Four hormones decide how you sleep, stress and recover. Yours don’t behave like anyone else’s.”",
  },
  {
    was: "“2 Million, World’s Most Advanced Genomic Bigdata”",
    now: (
      <>
        “2 million genomes so we can be precise about <b>one.</b> Yours.”
      </>
    ),
  },
  {
    was: "“ALWAYS BE HEALTH CENTRIC”",
    now: "“Know your baseline. Elevate everything.”",
  },
];

function Lines({ which }: { which: "was" | "now" }) {
  return (
    <ul className="voice-lines">
      {LINES.map((line, index) => (
        <li key={index} className={which}>
          {which === "now" ? line.now : line.was}
        </li>
      ))}
    </ul>
  );
}

export function Voices() {
  return (
    <Tabs defaultSelectedKey="now" className="voices">
      <Tabs.List aria-label="Whose wording to show" className="voices-tabs">
        <Tabs.Tab id="was">Health Centric says</Tabs.Tab>
        <Tabs.Tab id="now">Elev8 says</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="was">
        <Lines which="was" />
      </Tabs.Panel>
      <Tabs.Panel id="now">
        <Lines which="now" />
      </Tabs.Panel>
    </Tabs>
  );
}
