/**
 * Five phases as a track rather than a list.
 *
 * This fold is also the one that answers "show me how things will flow", so it
 * reads left to right along a line, with Phase 3 marked because that is where
 * the argument lives: the mascot stops being a logo and starts being a reason
 * to renew.
 */
const PHASES: { title: string; line: string; mark?: boolean }[] = [
  { title: "Identity", line: "Strategy, naming, El, the visual system." },
  { title: "Surfaces", line: "Website, backend, CMS, launch." },
  { title: "Product", line: "The app, and El inside it.", mark: true },
  { title: "Marketing", line: "Runs alongside 1 to 3, not after." },
  { title: "Scale", line: "Content becomes the engine." },
];

export function Phases() {
  return (
    <ol className="track">
      {PHASES.map((phase, index) => (
        <li key={phase.title} className={phase.mark ? "is-marked" : undefined}>
          <span className="track-node" aria-hidden="true" />
          <span className="track-num">Phase {index + 1}</span>
          <span className="track-title">{phase.title}</span>
          <span className="track-line">{phase.line}</span>
        </li>
      ))}
    </ol>
  );
}
