/** Premium, calm. El never bounces. */
export const ENTER = [0.22, 1, 0.36, 1] as const;
export const LEAVE = [0.3, 0, 1, 1] as const;
export const SETTLE = [0.4, 0, 0.2, 1] as const;

export const beat = {
  hide: {
    opacity: 0,
    y: 22,
    transition: { duration: 0.32, ease: LEAVE },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ENTER, staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const fadeUp = {
  hide: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ENTER } },
};

export const staggerList = {
  hide: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

export const staggerItem = {
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ENTER } },
};
