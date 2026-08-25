#!/usr/bin/env python3
"""Regenerate app/src/assets from the designer's exports in design/mascot.

Run after any re-export:  python3 tools/build-assets.py

Two things the raw exports can't do on their own:

1. El ships with a fully transparent body — the artwork assumes the cream page
   shows through her outline. That breaks the moment she moves over anything
   else (the preload hole, a tinted section), so we flood the enclosed regions
   with Cream #FBF3EC, the fill the character bible actually specifies.

2. The preload needs her without the hole baked in, so her ears can rise
   through a hole we animate ourselves. el-rise.png is her knocked out of the
   plum and cropped at the hole's centre line.

"All elements.svg" is the six vertical icon marks on one sheet; they get
segmented off the alpha projection rather than a naive grid, because the MOVE
swoosh overruns its third and the KNOW squiggle is six disjoint dot clusters.
"""

import base64
import io
import pathlib
import re
from collections import deque

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
DESIGN = ROOT / "design" / "mascot"
ASSETS = ROOT / "app" / "src" / "assets"

CREAM = (0xFB, 0xF3, 0xEC, 255)  # bible §06: El's body and face fill
PLUM = (0x4A, 0x3B, 0x3F)  # bible §06: the hole. Exports drift toward #49324B.
POSES = ["neutral", "waiting", "thinking", "celebrating"]


def is_plum(r, g, b, a):
    """The export's hole colour varies a little between poses — match the family."""
    return a > 40 and r < 110 and g < 90 and b < 110 and abs(r - b) < 30


def fill_interior(im: Image.Image) -> Image.Image:
    """Paint every transparent region enclosed by El's outline with Cream."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    opaque = [[px[x, y][3] > 128 for y in range(h)] for x in range(w)]

    # Flood from the border through transparent pixels: whatever we can't reach
    # is enclosed by her outline, i.e. body, face, ear interiors.
    outside = [[False] * h for _ in range(w)]
    queue = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not opaque[x][y] and not outside[x][y]:
                outside[x][y] = True
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not opaque[x][y] and not outside[x][y]:
                outside[x][y] = True
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not opaque[nx][ny] and not outside[nx][ny]:
                outside[nx][ny] = True
                queue.append((nx, ny))

    for x in range(w):
        for y in range(h):
            if not opaque[x][y] and not outside[x][y]:
                px[x, y] = CREAM
    return im


def hole_box(im: Image.Image):
    """Bounding box of the plum hole, measured rather than hard-coded per pose."""
    px = im.load()
    w, h = im.size
    xs, ys = [], []
    for y in range(h):
        for x in range(w):
            if is_plum(*px[x, y]):
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit("no plum hole found — check the export")
    return min(xs), min(ys), max(xs), max(ys)


def build_el():
    out = ASSETS / "el"
    out.mkdir(parents=True, exist_ok=True)
    for pose in POSES:
        filled = fill_interior(Image.open(DESIGN / "el" / f"{pose}.png"))
        # Pin every pose's hole to the bible value so the drawn preload hole
        # and the baked-in sprite holes are the same colour.
        px = filled.load()
        for y in range(filled.height):
            for x in range(filled.width):
                if is_plum(*px[x, y]):
                    px[x, y] = (*PLUM, px[x, y][3])
        filled.save(out / f"{pose}.png")
        print(f"el/{pose}.png {filled.size}")

    # The rising El: neutral, hole knocked out, cropped at the hole's centre line.
    neutral = fill_interior(Image.open(DESIGN / "el" / "neutral.png"))
    x0, y0, x1, y1 = hole_box(neutral)
    px = neutral.load()
    w, h = neutral.size
    for y in range(h):
        for x in range(w):
            if is_plum(*px[x, y]):
                px[x, y] = (*PLUM, 0)
    cy = (y0 + y1) // 2
    neutral.crop((0, 0, w, cy)).save(ASSETS / "el-rise.png")

    # The page draws the hole to these proportions, expressed against the crop.
    print(
        f"el-rise.png {w}x{cy}  hole: cx={(x0 + x1) / 2 / w:.4f}w "
        f"rx={(x1 - x0) / 2 / w:.4f}w ry={(y1 - y0) / 2 / w:.4f}w"
    )


def build_icons():
    """Six vertical marks, segmented off the alpha projection of the sheet."""
    svg = (DESIGN / "src" / "All elements.svg").read_text()
    blobs = re.findall(r"base64,([A-Za-z0-9+/=]+)", svg)
    if len(blobs) != 2:
        raise SystemExit("expected a mask + colour pair in All elements.svg")
    mask = Image.open(io.BytesIO(base64.b64decode(blobs[0]))).convert("L")
    colour = Image.open(io.BytesIO(base64.b64decode(blobs[1]))).convert("RGB")
    sheet = colour.copy()
    sheet.putalpha(mask)
    w, h = sheet.size
    mpx = mask.load()

    def runs(length, probe, merge):
        spans, start = [], None
        for i in range(length):
            on = probe(i)
            if on and start is None:
                start = i
            elif not on and start is not None:
                spans.append((start, i))
                start = None
        if start is not None:
            spans.append((start, length))
        merged = []
        for span in spans:
            if merged and span[0] - merged[-1][1] < merge:
                merged[-1] = (merged[-1][0], span[1])
            else:
                merged.append(span)
        return merged

    rows = runs(h, lambda y: any(mpx[x, y] > 20 for x in range(0, w, 2)), 40)
    # Bible §09 order, matching the sheet: swoosh, spiral, circle / leaf, squiggle, droplet.
    names = [["move", "clear", "long"], ["fuel", "know", "look"]]
    out = ASSETS / "icons"
    out.mkdir(parents=True, exist_ok=True)
    for (y0, y1), row in zip(rows, names):
        cols = runs(w, lambda x: any(mpx[x, y] > 20 for y in range(y0, y1, 2)), 80)
        for (x0, x1), name in zip(cols, row):
            icon = sheet.crop((x0, y0, x1, y1))
            side = max(icon.size)
            square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
            square.paste(icon, ((side - icon.width) // 2, (side - icon.height) // 2))
            square.resize((256, 256), Image.LANCZOS).save(out / f"{name}.png")
            print(f"icons/{name}.png {icon.size}")


if __name__ == "__main__":
    build_el()
    build_icons()
