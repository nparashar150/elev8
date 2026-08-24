/**
 * Morph targets for the opening sequence.
 *
 * Every shape is authored as `M` + four cubic `C` segments + `Z` in the same
 * order and direction. Matching the command structure is what lets Motion
 * interpolate the `d` attribute directly — mismatched commands make the
 * interpolator give up and snap between shapes.
 *
 * Shared coordinate space with <El />: viewBox "0 0 240 260".
 */

type Cubic = [number, number, number, number, number, number];
type Shape = { start: [number, number]; curves: [Cubic, Cubic, Cubic, Cubic] };

const shape = (start: [number, number], curves: [Cubic, Cubic, Cubic, Cubic]): Shape => ({
  start,
  curves,
});

/** Ellipse/circle control point offset: 4 cubics approximate a circle at k * r. */
const K = 0.5523;

/** The wordmark's "8" laid on its side: one unbroken line, looped twice. */
export const INFINITY = shape([30, 130], [
  [30, 90, 120, 90, 120, 130],
  [120, 170, 210, 170, 210, 130],
  [210, 90, 120, 90, 120, 130],
  [120, 170, 30, 170, 30, 130],
]);

/** The loop resolves into a single closed circle. */
export const CIRCLE = (() => {
  const cx = 120;
  const cy = 130;
  const r = 52;
  const k = K * r;
  return shape([cx - r, cy], [
    [cx - r, cy - k, cx - k, cy - r, cx, cy - r],
    [cx + k, cy - r, cx + r, cy - k, cx + r, cy],
    [cx + r, cy + k, cx + k, cy + r, cx, cy + r],
    [cx - k, cy + r, cx - r, cy + k, cx - r, cy],
  ]);
})();

/** The circle sinks and flattens into the hole El rises through. */
export const HOLE = (() => {
  const cx = 120;
  const cy = 206;
  const rx = 96;
  const ry = 20;
  const kx = K * rx;
  const ky = K * ry;
  return shape([cx - rx, cy], [
    [cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry],
    [cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy],
    [cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry],
    [cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy],
  ]);
})();

const round = (n: number) => Math.round(n * 100) / 100;

export function toPath({ start, curves }: Shape): string {
  const head = `M ${round(start[0])} ${round(start[1])}`;
  const body = curves
    .map((c) => `C ${c.map(round).join(" ")}`)
    .join(" ");
  return `${head} ${body} Z`;
}

export const INFINITY_D = toPath(INFINITY);
export const CIRCLE_D = toPath(CIRCLE);
export const HOLE_D = toPath(HOLE);

/** Where the hole's opening sits — El is clipped to everything above this line. */
export const HOLE_LINE = 206;
