# Elev8

## Cursor Cloud specific instructions

Push straight to `main`. Do not open pull requests unless the user asks for one.

The pitch site is a React app (Vite + TypeScript + Motion). Source lives in `app/`.

GitHub Pages serves this repo from the **root of `main`**, so the production build is
written back into the repo root and committed. `index.html` and `static/` at the root are
build output — never hand-edit them, edit `app/` and rebuild.

```bash
npm install
npm run dev      # http://127.0.0.1:5173/elev8/
npm run build    # typechecks, then writes index.html + static/ to the repo root
npm run preview  # serves the built output at http://127.0.0.1:4173/elev8/
```

The dev and preview URLs include the `/elev8/` base path because that is where Pages
serves from. Open them in this environment's Desktop browser, not the laptop browser.

Always run `npm run build` and commit the regenerated root files in the same commit as any
`app/` change, or the live site will not match the source.

## Design constraints

- One typeface for the whole site: Inter, using its optical-size axis. Do not add a second
  family.
- El (the character) follows `assets/el-character-bible.pdf`: fixed construction, calm
  register only, gesture changes rather than reshaping, petal outline and cream fill, and
  the CTA red is never used on her.
