import { Card } from "@heroui/react";

/**
 * Six things, as six things you can count rather than six lines you have to
 * read. The number carries the scan, the title carries the meaning, and the
 * line is there for whoever slows down.
 */
const OFFER: [string, string][] = [
  ["Brand", "Positioning, naming, El, the whole system."],
  ["Web", "Every template, home to checkout."],
  ["App", "iOS and Android, onboarding that survives the kit."],
  ["Backend", "APIs, consent, audit logs, India residency."],
  ["Social", "Instagram, YouTube, LinkedIn. One voice."],
  ["Content", "The editorial engine behind everything."],
];

export function Offer() {
  return (
    <ul className="scorecards">
      {OFFER.map(([title, copy], index) => (
        <li key={title}>
          <Card className="scorecard">
            <Card.Content>
              <span className="scorecard-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="scorecard-title">{title}</span>
              <span className="scorecard-line">{copy}</span>
            </Card.Content>
          </Card>
        </li>
      ))}
    </ul>
  );
}
