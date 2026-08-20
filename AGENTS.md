# Elev8

## Cursor Cloud specific instructions

Push straight to `main`. Do not open pull requests unless the user asks for one.

The pitch site is a static page (`index.html`). After changes land on `main`, GitHub Pages republishes automatically. Keep that deploy path working so the live site stays current.

Local preview from the repo root:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Open `http://127.0.0.1:4173/` in this environment’s Desktop browser, not the laptop browser.
