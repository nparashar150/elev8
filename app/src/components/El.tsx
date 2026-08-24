import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * El is one character, not four drawings. Construction stays fixed — rounded
 * head, two tall closed ears, dot eyes, dot nose — and only gesture and
 * expression change between poses, per the character bible.
 */
export type Pose = "neutral" | "thinking" | "waiting" | "celebrating";

const PETAL = "#E8A79C";
const CREAM = "#FBF3EC";

const EAR_LEFT =
  "M96 118C88 118 78 72 80 40C82 18 98 12 108 26C115 36 114 86 112 118C110 126 102 126 96 118Z";
const EAR_RIGHT =
  "M144 118C152 118 162 72 160 40C158 18 142 12 132 26C125 36 126 86 128 118C130 126 138 126 144 118Z";
const HEAD =
  "M78 142C78 116 96 100 120 100C144 100 162 116 162 142C162 170 146 190 120 190C94 190 78 170 78 142Z";
const PAW_LEFT =
  "M64 214C56 214 54 202 64 198C74 194 86 204 82 214C78 224 70 224 64 214Z";
const PAW_RIGHT =
  "M176 214C184 214 186 202 176 198C166 194 154 204 158 214C162 224 170 224 176 214Z";
/**
 * Thinking is the same paw, moved — El gestures, she never reshapes. One closed
 * silhouette: forearm out of the hole, fist, thumb clear of the fist above it.
 */
const ARM_THUMBS_UP =
  "M174 218C174 198 174 186 176 176C178 167 172 162 172 150C172 138 178 130 186 132C193 134 195 143 192 152C200 150 210 156 210 168C210 184 208 200 208 218Z";

const stroke = {
  fill: CREAM,
  stroke: PETAL,
  strokeWidth: 7,
  strokeLinejoin: "round" as const,
};

/**
 * Eyelids, not eye swaps. Squashing the eye on its own centre reads as a blink;
 * hiding and showing a second shape reads as a glitch.
 */
function useBlink(enabled: boolean) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setClosed(true);
        window.setTimeout(() => setClosed(false), 110);
        // Humans double-blink often enough that always single-blinking reads robotic.
        if (Math.random() > 0.65) {
          window.setTimeout(() => setClosed(true), 260);
          window.setTimeout(() => setClosed(false), 370);
        }
        schedule();
      }, 2400 + Math.random() * 2800);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return closed;
}

type Props = {
  pose: Pose;
  /** Force a blink from the intro timeline, independent of the idle loop. */
  blinking?: boolean;
};

export function El({ pose, blinking = false }: Props) {
  const reduced = useReducedMotion();
  const idleBlink = useBlink(!reduced);
  const closed = blinking || idleBlink;
  const happy = pose === "celebrating";
  const thinking = pose === "thinking";

  const eyeY = thinking ? -6 : 0;
  const eyeX = thinking ? -4 : 0;

  return (
    <g>
      <path d={EAR_LEFT} {...stroke} />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        animate={{ rotate: thinking ? 14 : 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 14 }}
      >
        <path d={EAR_RIGHT} {...stroke} />
      </motion.g>

      <path d={HEAD} {...stroke} />

      <motion.g animate={{ x: eyeX, y: eyeY }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        {[106, 134].map((cx) => (
          <motion.g
            key={cx}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={{ scaleY: closed ? 0.1 : 1 }}
            transition={{ duration: 0.09, ease: "easeOut" }}
          >
            {happy ? (
              <path
                d={`M${cx - 8} 142C${cx - 5} 136 ${cx + 5} 136 ${cx + 8} 142`}
                stroke={PETAL}
                strokeWidth={4.4}
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <ellipse cx={cx} cy={140} rx={5} ry={3.2} fill={PETAL} />
            )}
          </motion.g>
        ))}
        <circle cx={120} cy={154} r={3.3} fill={PETAL} />
      </motion.g>

      <path d={PAW_LEFT} {...stroke} />

      {/* The right paw is the one that gestures: resting, at the chin, or raised. */}
      {pose === "celebrating" ? (
        <motion.path
          d={ARM_THUMBS_UP}
          {...stroke}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 14 }}
        />
      ) : (
        <motion.path
          d={PAW_RIGHT}
          {...stroke}
          strokeWidth={6}
          animate={{
            x: thinking ? -12 : 0,
            y: thinking ? -24 : 0,
          }}
          transition={{ type: "spring", stiffness: 130, damping: 15 }}
        />
      )}

      {/* Waiting keeps El calm and puts the impatience in a separate mark. */}
      {pose === "waiting" && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.3 },
            rotate: { duration: 1.4, repeat: Infinity, ease: "linear" },
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle
            cx={194}
            cy={104}
            r={16}
            stroke={PETAL}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeDasharray="36 66"
            fill="none"
          />
        </motion.g>
      )}
    </g>
  );
}
