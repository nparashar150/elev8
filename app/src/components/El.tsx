import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const PETAL = "#E8A79C";
const CREAM = "#FBF3EC";
const PLUM = "#4A3B3F";

const EAR_LEFT =
  "M108 124C102 124 96 72 100 38C102 18 114 16 116 40C118 66 116 106 114 124C113 128 110 128 108 124Z";
const EAR_RIGHT =
  "M132 124C138 124 144 72 140 38C138 18 126 16 124 40C122 66 124 106 126 124C127 128 130 128 132 124Z";
const HEAD =
  "M94 150C94 128 105 116 120 116C135 116 146 128 146 150C146 170 136 184 120 184C104 184 94 170 94 150Z";
const PAW_LEFT = "M76 206C68 206 66 197 76 194C86 191 94 198 92 206C90 213 84 213 76 206Z";
const PAW_RIGHT = "M164 206C172 206 174 197 164 194C154 191 146 198 148 206C150 213 156 213 164 206Z";

const stroke = {
  fill: CREAM,
  stroke: PETAL,
  strokeWidth: 4.4,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function useBlink(enabled: boolean) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setClosed(true);
        window.setTimeout(() => setClosed(false), 90);
        schedule();
      }, 3200 + Math.random() * 4000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return closed;
}

/** One drawing. She blinks. That is the animation. */
export function El() {
  const reduced = useReducedMotion();
  const closed = useBlink(!reduced);

  return (
    <svg className="el-svg" viewBox="0 0 240 240" role="img" aria-label="El">
      <ellipse cx={120} cy={214} rx={64} ry={14} fill={PLUM} />
      <path d={EAR_LEFT} {...stroke} />
      <path d={EAR_RIGHT} {...stroke} />
      <path d={HEAD} {...stroke} />
      <g>
        {[105, 135].map((cx) => (
          <motion.g
            key={cx}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={{ scaleY: closed ? 0.1 : 1 }}
            transition={{ duration: 0.08, ease: "easeOut" }}
          >
            <circle cx={cx} cy={148} r={4.4} fill={PLUM} />
            <circle cx={cx + 1.4} cy={146.6} r={1.2} fill={CREAM} />
          </motion.g>
        ))}
        <ellipse cx={120} cy={160} rx={2.6} ry={2} fill={PETAL} />
      </g>
      <path d={PAW_LEFT} {...stroke} />
      <path d={PAW_RIGHT} {...stroke} />
    </svg>
  );
}
