import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * El is one character. Construction stays fixed — slim loop ears, round head,
 * cream fill, petal stroke — and only gesture changes. Poses are animated
 * (ears, eyes, mouth, arms), not swapped drawings.
 */
export type Pose = "neutral" | "thinking" | "waiting" | "celebrating";

const PETAL = "#E8A79C";
const CREAM = "#FBF3EC";
const PLUM = "#4A3B3F";

const EAR_LEFT =
  "M108 124C102 124 96 72 100 38C102 18 114 16 116 40C118 66 116 106 114 124C113 128 110 128 108 124Z";
const EAR_RIGHT =
  "M132 124C138 124 144 72 140 38C138 18 126 16 124 40C122 66 124 106 126 124C127 128 130 128 132 124Z";
const EAR_INNER_LEFT =
  "M109 114C106 96 104 58 106 44C107 36 112 38 113 54C115 74 113 102 112 114C111 116 110 116 109 114Z";
const EAR_INNER_RIGHT =
  "M131 114C134 96 136 58 134 44C133 36 128 38 127 54C125 74 127 102 128 114C129 116 130 116 131 114Z";
const HEAD =
  "M94 150C94 128 105 116 120 116C135 116 146 128 146 150C146 170 136 184 120 184C104 184 94 170 94 150Z";
const SHOULDERS =
  "M88 210C88 188 102 176 120 176C138 176 152 188 152 210Z";
const PAW_LEFT =
  "M76 206C68 206 66 197 76 194C86 191 94 198 92 206C90 213 84 213 76 206Z";
const PAW_RIGHT =
  "M164 206C172 206 174 200 170 196C166 192 156 190 150 196C146 202 146 208 152 210C156 214 160 214 164 206Z";
const ARM_THINK =
  "M150 210C144 186 134 166 128 154C122 144 130 138 140 142C150 146 154 156 150 166C148 178 150 194 150 210Z";
const ARM_FIST =
  "M188 210L194 168C194 158 198 156 206 156L224 156C234 156 234 166 234 174L234 188C234 198 226 198 216 198L200 198L194 210Z";
const ARM_THUMB =
  "M196 160L196 104C196 92 206 90 214 90L218 90C228 90 228 102 228 110L228 160Z";

const MOUTH_REST = "M114 168C117 171 123 171 126 168";
const MOUTH_SMILE = "M110 166C116 176 124 176 130 166";
const MOUTH_HMM = "M116 170C119 168 121 168 124 170";

const stroke = {
  fill: CREAM,
  stroke: PETAL,
  strokeWidth: 4.2,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const spring = { type: "spring" as const, stiffness: 240, damping: 18, mass: 0.8 };
const soft = { type: "spring" as const, stiffness: 120, damping: 16 };

const originBase = { transformBox: "fill-box" as const, transformOrigin: "50% 100%" };
const originCenter = { transformBox: "fill-box" as const, transformOrigin: "center" };

function useBlink(enabled: boolean) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setClosed(true);
        window.setTimeout(() => setClosed(false), 120);
        if (Math.random() > 0.6) {
          window.setTimeout(() => setClosed(true), 280);
          window.setTimeout(() => setClosed(false), 400);
        }
        schedule();
      }, 2200 + Math.random() * 2600);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return closed;
}

type Props = {
  pose: Pose;
  blinking?: boolean;
};

export function El({ pose, blinking = false }: Props) {
  const reduced = useReducedMotion();
  const idleBlink = useBlink(!reduced && pose !== "celebrating");
  const closed = blinking || idleBlink;
  const thinking = pose === "thinking";
  const waiting = pose === "waiting";
  const happy = pose === "celebrating";

  return (
    <motion.g
      animate={
        reduced
          ? { y: 0 }
          : happy
            ? { y: [0, -9, -2] }
            : { y: [0, -2.5, 0] }
      }
      transition={
        reduced
          ? { duration: 0 }
          : happy
            ? { duration: 0.7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
            : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <path d={SHOULDERS} fill={CREAM} stroke={PETAL} strokeWidth={4.2} strokeLinejoin="round" />

      <motion.g
        style={{ transformOrigin: "120px 168px" }}
        animate={{ rotate: thinking ? -10 : happy ? 4 : waiting ? 10 : 0 }}
        transition={spring}
      >
        <Ear
          outer={EAR_LEFT}
          inner={EAR_INNER_LEFT}
          rotate={thinking ? -10 : happy ? -12 : waiting ? [-4, 10, -4] : 0}
          waiting={waiting && !reduced}
        />
        <Ear
          outer={EAR_RIGHT}
          inner={EAR_INNER_RIGHT}
          rotate={thinking ? 48 : happy ? 12 : waiting ? [6, -10, 6] : 0}
          waiting={waiting && !reduced}
        />

        <path d={HEAD} {...stroke} />

        <motion.ellipse
          cx={100}
          cy={160}
          rx={6}
          ry={4}
          fill={PETAL}
          animate={{ opacity: happy ? 0.4 : 0.16 }}
          transition={{ duration: 0.25 }}
        />
        <motion.ellipse
          cx={140}
          cy={160}
          rx={6}
          ry={4}
          fill={PETAL}
          animate={{ opacity: happy ? 0.4 : 0.16 }}
          transition={{ duration: 0.25 }}
        />

        <Face pose={pose} closed={closed} reduced={Boolean(reduced)} />
      </motion.g>

      <motion.path
        d={PAW_LEFT}
        {...stroke}
        style={originBase}
        animate={waiting && !reduced ? { y: [0, 0, 4, 0, 4, 0] } : { y: 0 }}
        transition={waiting && !reduced ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : spring}
      />

      <motion.path
        d={PAW_RIGHT}
        {...stroke}
        style={originBase}
        initial={false}
        animate={{
          d: thinking ? ARM_THINK : PAW_RIGHT,
          opacity: happy ? 0 : 1,
          x: thinking ? -6 : 0,
          y: thinking ? -8 : 0,
          rotate: thinking ? -12 : 0,
        }}
        transition={spring}
      />

      <motion.g
        style={{ transformOrigin: "200px 210px" }}
        initial={false}
        animate={happy ? { opacity: 1, y: 0, rotate: -4 } : { opacity: 0, y: 40, rotate: 12 }}
        transition={soft}
      >
        <path d={ARM_FIST} {...stroke} />
        <path d={ARM_THUMB} {...stroke} />
      </motion.g>
    </motion.g>
  );
}

function Ear({
  outer,
  inner,
  rotate,
  waiting,
}: {
  outer: string;
  inner: string;
  rotate: number | number[];
  waiting: boolean;
}) {
  return (
    <motion.g
      style={originBase}
      animate={{ rotate }}
      transition={waiting ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : spring}
    >
      <path d={outer} {...stroke} />
      <path d={inner} fill={PETAL} opacity={0.4} />
    </motion.g>
  );
}

function Face({ pose, closed, reduced }: { pose: Pose; closed: boolean; reduced: boolean }) {
  const thinking = pose === "thinking";
  const waiting = pose === "waiting";
  const happy = pose === "celebrating";
  const mouth = happy ? MOUTH_SMILE : thinking ? MOUTH_HMM : MOUTH_REST;

  return (
    <motion.g
      animate={
        waiting && !reduced
          ? { x: [7, 7, -5, -5, 7], y: [-3, -3, 0, 0, -3] }
          : { x: thinking ? -6 : 0, y: thinking ? -8 : 0 }
      }
      transition={
        waiting && !reduced
          ? { duration: 3.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.18, 0.42, 0.58, 0.82, 1] }
          : spring
      }
    >
        {[105, 135].map((cx) => (
        <g key={cx}>
          <motion.g
            style={originCenter}
            animate={{ scaleY: closed && !happy ? 0.08 : 1, opacity: happy ? 0 : 1 }}
            transition={{ duration: closed ? 0.08 : 0.18, ease: "easeOut" }}
          >
            <circle cx={cx} cy={148} r={5.2} fill={PLUM} />
            <circle cx={cx + 1.7} cy={146.4} r={1.5} fill={CREAM} />
          </motion.g>
          <motion.path
            d={`M${cx - 7} 150C${cx - 3} 144 ${cx + 3} 144 ${cx + 7} 150`}
            fill="none"
            stroke={PLUM}
            strokeWidth={3.4}
            strokeLinecap="round"
            style={originCenter}
            animate={{ opacity: happy ? 1 : 0, pathLength: happy ? 1 : 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>
      ))}

      <ellipse cx={120} cy={160} rx={3} ry={2.3} fill={PETAL} />

      <motion.path
        d={mouth}
        fill="none"
        stroke={PLUM}
        strokeWidth={2.4}
        strokeLinecap="round"
        initial={false}
        animate={{ d: mouth }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.g>
  );
}
