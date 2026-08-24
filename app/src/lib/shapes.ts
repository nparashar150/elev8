/**
 * Morph targets for the opening sequence.
 *
 * Every shape is `M` + four cubic `C` segments + `Z`, all starting at the top
 * of the figure so Motion can interpolate `d` without snapping. The loader is
 * a compact vertical 8 — the wordmark, not a wide sideways infinity.
 *
 * Shared coordinate space with <El />: viewBox "0 0 240 260".
 */

type Cubic = [number, number, number, number, number, number];
type Shape = { start: [number, number]; curves: [Cubic, Cubic, Cubic, Cubic] };

const shape = (start: [number, number], curves: [Cubic, Cubic, Cubic, Cubic]): Shape => ({
  start,
  curves,
});

const K = 0.5523;

/** Vertical 8 — wordmark proportions, compact, actually readable on the cream. */
export const INFINITY = shape([120, 72], [
  [82, 72, 82, 122, 120, 130],
  [158, 138, 158, 188, 120, 188],
  [82, 188, 82, 138, 120, 130],
  [158, 122, 158, 72, 120, 72],
]);

/** The 8 resolves into a circle of almost the same size. */
export const CIRCLE = (() => {
  const cx = 120;
  const cy = 130;
  const r = 48;
  const k = K * r;
  return shape([cx, cy - r], [
    [cx + k, cy - r, cx + r, cy - k, cx + r, cy],
    [cx + r, cy + k, cx + k, cy + r, cx, cy + r],
    [cx - k, cy + r, cx - r, cy + k, cx - r, cy],
    [cx - r, cy - k, cx - k, cy - r, cx, cy - r],
  ]);
})();

/** The circle sinks and flattens into the hole El rises through. */
export const HOLE = (() => {
  const cx = 120;
  const cy = 206;
  const rx = 72;
  const ry = 18;
  const kx = K * rx;
  const ky = K * ry;
  return shape([cx, cy - ry], [
    [cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy],
    [cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry],
    [cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy],
    [cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry],
  ]);
})();

const round = (n: number) => Math.round(n * 100) / 100;

export function toPath({ start, curves }: Shape): string {
  const head = `M ${round(start[0])} ${round(start[1])}`;
  const body = curves.map((c) => `C ${c.map(round).join(" ")}`).join(" ");
  return `${head} ${body} Z`;
}

export const INFINITY_D = toPath(INFINITY);
export const CIRCLE_D = toPath(CIRCLE);
export const HOLE_D = toPath(HOLE);

/** Where the hole's opening sits — El is clipped to everything above this line. */
export const HOLE_LINE = 206;
