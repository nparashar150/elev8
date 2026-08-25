import celebrating from "../assets/el/celebrating.png";
import neutral from "../assets/el/neutral.png";
import thinking from "../assets/el/thinking.png";
import waiting from "../assets/el/waiting.png";

export type ElPose = "neutral" | "thinking" | "waiting" | "celebrating";

export const EL_SRC: Record<ElPose, string> = {
  celebrating,
  neutral,
  thinking,
  waiting,
};

/** Petal outline, Cream fill, Warm Plum hole — bible §07. */
export function El({ pose = "neutral" }: { pose?: ElPose }) {
  return <img className="el-png" src={EL_SRC[pose]} alt="" />;
}

/** Bible §08 — gesture and expression change, the silhouette never does. */
export const EL_POSES: { pose: ElPose; label: string; note: string }[] = [
  { pose: "neutral", label: "Neutral", note: "Ears up, at ease, hands resting on the hole’s edge." },
  { pose: "waiting", label: "Waiting", note: "She stays fully herself; a small separate spinner appears beside her." },
  { pose: "thinking", label: "Thinking", note: "One ear tilts, paw at chin, eyes cast up and to the side." },
  { pose: "celebrating", label: "Thumbs up", note: "Fully emerged, one paw raised, warm proud expression." },
];
