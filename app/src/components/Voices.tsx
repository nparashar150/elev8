import type { ReactNode } from "react";

/**
 * SS05, "same science, different sentence".
 *
 * The contrast is the entire argument, so both wordings have to be on screen at
 * once. A wipe made you operate a slider to see it; a tab made you remember the
 * other column. Paired rows need neither: you read across, once, and the
 * hierarchy does the arguing.
 *
 * Three rows, not five. The first one makes the point and the other two prove
 * it is a pattern; past that it stops being evidence and starts being a wall.
 */
const LINES: { was: string; now: ReactNode }[] = [
  {
    was: "Endocrinology & Metabolism Panel, Rs. 25,000",
    now: (
      <>
        Why your body treats food differently. <b>Metabolism.</b> From ₹25,000.
      </>
    ),
  },
  {
    was: "Gene variants influencing production of DHEA, Oxytocin, Melatonin, Cortisol",
    now: "Four hormones decide how you sleep, stress and recover. Yours don’t behave like anyone else’s.",
  },
  {
    was: "ALWAYS BE HEALTH CENTRIC",
    now: "Know your baseline. Elevate everything.",
  },
];

export function Voices() {
  return (
    <div className="voices">
      <div className="voices-heads" aria-hidden="true">
        <span>Health Centric says</span>
        <span>Elev8 says</span>
      </div>

      <dl className="voice-rows">
        {LINES.map((line, index) => (
          <div className="voice-row" key={index}>
            <dt>{line.was}</dt>
            <dd>{line.now}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
