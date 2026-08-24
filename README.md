# Elev8

Pitch site for Health Centric → Elev8.

Live: https://nparashar150.github.io/elev8/

## Stack

- Vite + React + TypeScript
- [Motion](https://motion.dev) for the SVG morph, the character animation, and the scroll
  stage
- Inter as the single typeface, driven by its optical-size axis

## Structure

```
app/            source (index.html, src/, public/)
index.html      build output, committed for GitHub Pages
static/         build output, committed for GitHub Pages
assets/         PDFs, copied from app/public on build
```

## Develop

```bash
npm install
npm run dev      # http://127.0.0.1:5173/elev8/
npm run build    # typecheck, then emit index.html + static/ to the repo root
npm run preview  # http://127.0.0.1:4173/elev8/
```

Pages serves the repo root of `main`, so a change is only live once `npm run build` output
is committed alongside the source.
