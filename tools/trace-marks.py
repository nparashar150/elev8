#!/usr/bin/env python3
"""Turn the six vertical marks into real SVG geometry.

The designer's "SVG" export is a raster in an SVG wrapper, so the marks cannot
be stroke-drawn or dot-staggered as bitmaps. This traces the alpha of each
sliced mark and writes app/src/lib/marks.ts.

Per mark, the geometry that suits how it should animate:
  KNOW  -> exact circle centres, so the dots can stagger in
  LONG  -> one circle, so it can scale up
  others-> a traced outline path, normalised to a 100x100 box

Run: python3 tools/trace-marks.py   (after tools/build-assets.py)
"""

import json
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ICONS = ROOT / "app" / "src" / "assets" / "icons"
OUT = ROOT / "app" / "src" / "lib" / "marks.ts"

BOX = 100.0


def alpha(name):
    im = Image.open(ICONS / f"{name}.png").convert("RGBA")
    return np.array(im)[:, :, 3] > 100


def components(mask):
    """Label 8-connected blobs without scipy. Returns list of (cy, cx, radius)."""
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    blobs = []
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or seen[y, x]:
                continue
            stack, pixels = [(y, x)], []
            seen[y, x] = True
            while stack:
                cy, cx = stack.pop()
                pixels.append((cy, cx))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            stack.append((ny, nx))
            ys = [p[0] for p in pixels]
            xs = [p[1] for p in pixels]
            blobs.append(
                (
                    sum(ys) / len(ys),
                    sum(xs) / len(xs),
                    ((max(ys) - min(ys)) + (max(xs) - min(xs))) / 4 + 0.5,
                )
            )
    return blobs


def contour(mask):
    """Moore boundary trace of the largest blob, walking the outer edge once."""
    h, w = mask.shape
    start = None
    for y in range(h):
        xs = np.nonzero(mask[y])[0]
        if xs.size:
            start = (y, int(xs[0]))
            break
    if start is None:
        return []

    # Clockwise neighbour offsets.
    nbrs = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    path = [start]
    cur = start
    back = 6  # came from the left
    for _ in range(200000):
        found = False
        for step in range(8):
            i = (back + 1 + step) % 8
            ny, nx = cur[0] + nbrs[i][0], cur[1] + nbrs[i][1]
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx]:
                back = (i + 4 + 1) % 8
                cur = (ny, nx)
                path.append(cur)
                found = True
                break
        if not found or (len(path) > 3 and cur == start):
            break
    return path


def simplify(points, tolerance):
    """Douglas-Peucker."""
    if len(points) < 3:
        return points
    a, b = np.array(points[0]), np.array(points[-1])
    ab = b - a
    norm = np.hypot(*ab)
    pts = np.array(points)
    if norm == 0:
        d = np.hypot(*(pts - a).T)
    else:
        d = np.abs(np.cross(ab, pts - a)) / norm
    i = int(np.argmax(d))
    if d[i] > tolerance:
        left = simplify(points[: i + 1], tolerance)
        right = simplify(points[i:], tolerance)
        return left[:-1] + right
    return [points[0], points[-1]]


def to_path(points, size):
    """Normalise (row, col) pixels into a 0..100 box and emit a closed path."""
    scale = BOX / size
    out = [f"M{points[0][1] * scale:.2f} {points[0][0] * scale:.2f}"]
    for y, x in points[1:]:
        out.append(f"L{x * scale:.2f} {y * scale:.2f}")
    out.append("Z")
    return "".join(out)


def main():
    marks = {}

    for name in ["move", "clear", "long", "fuel", "know", "look"]:
        mask = alpha(name)
        size = mask.shape[0]

        if name == "know":
            blobs = [b for b in components(mask) if b[2] > 1.5]
            marks[name] = {
                "kind": "dots",
                # Ordered along the trail so they can stagger in sequence.
                "dots": [
                    {"cx": round(cx * BOX / size, 2), "cy": round(cy * BOX / size, 2), "r": round(r * BOX / size, 2)}
                    for cy, cx, r in sorted(blobs, key=lambda b: (b[1], b[0]))
                ],
            }
        elif name == "long":
            ys, xs = np.nonzero(mask)
            marks[name] = {
                "kind": "circle",
                "cx": round(float(xs.mean()) * BOX / size, 2),
                "cy": round(float(ys.mean()) * BOX / size, 2),
                "r": round(float((xs.max() - xs.min() + ys.max() - ys.min()) / 4) * BOX / size, 2),
            }
        else:
            pts = simplify(contour(mask), tolerance=1.1)
            marks[name] = {"kind": "path", "d": to_path(pts, size)}

        kind = marks[name]["kind"]
        detail = len(marks[name].get("dots", marks[name].get("d", "")))
        print(f"{name}: {kind} ({detail})")

    body = json.dumps(marks, indent=2)
    OUT.write_text(
        "// Generated by tools/trace-marks.py from the sliced mark PNGs.\n"
        "// The designer's export is a raster, so the geometry needed for\n"
        "// stroke-drawing and dot-staggering is traced rather than authored.\n"
        "// Coordinates are normalised to a 100x100 viewBox.\n\n"
        "export type Mark =\n"
        "  | { kind: 'path'; d: string }\n"
        "  | { kind: 'circle'; cx: number; cy: number; r: number }\n"
        "  | { kind: 'dots'; dots: { cx: number; cy: number; r: number }[] };\n\n"
        f"export const MARKS: Record<string, Mark> = {body} as const;\n"
    )
    print("wrote", OUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
