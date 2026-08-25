/**
 * The 8, uncoiled. Taken verbatim from the Paper file's loading artboards
 * (01 Trace through 03 Unwind), which all share a 120x60 viewBox.
 */
export const EIGHT_D =
  "M108 30 L107.31 34.64 L105.35 38.85 L102.36 42.3 L98.68 44.8 L94.64 46.33 L90.5 46.94 L86.46 46.78 L82.63 46 L79.06 44.73 L75.77 43.11 L72.73 41.22 L69.91 39.16 L67.27 36.96 L64.77 34.68 L62.36 32.35 L60 30 L57.64 27.65 L55.23 25.32 L52.73 23.04 L50.09 20.84 L47.27 18.78 L44.23 16.89 L40.94 15.27 L37.37 14 L33.54 13.22 L29.5 13.06 L25.36 13.67 L21.32 15.2 L17.64 17.7 L14.65 21.15 L12.69 25.36 L12 30 L12.69 34.64 L14.65 38.85 L17.64 42.3 L21.32 44.8 L25.36 46.33 L29.5 46.94 L33.54 46.78 L37.37 46 L40.94 44.73 L44.23 43.11 L47.27 41.22 L50.09 39.16 L52.73 36.96 L55.23 34.68 L57.64 32.35 L60 30 L62.36 27.65 L64.77 25.32 L67.27 23.04 L69.91 20.84 L72.73 18.78 L75.77 16.89 L79.06 15.27 L82.63 14 L86.46 13.22 L90.5 13.06 L94.64 13.67 L98.68 15.2 L102.36 17.7 L105.35 21.15 L107.31 25.36 L108 30 Z";

/**
 * Petal ribbon weight. The reference draws it at 8; thinned to 6 because at
 * loader scale that reads heavy. The hole's rim is thinned to match so the
 * ribbon stays one consistent width through the whole sequence.
 */
export const EIGHT_STROKE = 6;

/**
 * Loader geometry, converted into the 120x60 box the eight lives in.
 *
 * 03 Unwind draws the collapsed loop at rx 11 / ry 3.4 with a stroke of 8.
 * 04 The hole draws rx 92 / ry 24 stroke 16 in a 240x100 box rendered at
 * 360x140, which is rx 41.4 / ry 10.1 / stroke 7.2 once mapped across. The
 * ribbon width barely changes, which is the point: it is one line throughout.
 */
export const UNWOUND = { rx: 11, ry: 3.4, ring: 6 };
export const OPENED = { rx: 41.4, ry: 10.1, ring: 5.4 };
export const EIGHT_CENTRE = { cx: 60, cy: 30 };
