# Unloaded: hosted app

Upload **every file in this folder** to a web host, point a domain at it, and share
the link. It installs to a home screen, works offline, and needs no backend.

The name is **UNLOADED.** and the site is **getunloaded.now**. Everything user-facing
still reads from the `BRAND` and `COPY` objects near the top of the `<script>` in
`index.html`, so a future rename stays a config change rather than a find-and-replace.

## Files (upload all eight)

| File | What it does |
|---|---|
| `index.html` | The whole app. Fonts are embedded, so it makes no external requests. |
| `privacy.html` | Privacy policy. Linked from the app's More screen. |
| `manifest.webmanifest` | Makes it installable, and sets the name and icon on the home screen. |
| `sw.js` | Service worker. Caches the app so it opens offline. |
| `icon-192.png`, `icon-512.png` | Home screen and app switcher icons (maskable). |
| `apple-touch-icon.png` | Home screen icon on iPhone and iPad. |
| `README.md` | This file. Not served to anyone; keep it or drop it. |

---

## Before you go live

`privacy.html` names **MumOnTheMoney** as the operator, with
**mumonthemoney@gmail.com** as the contact. Change those two if the business name or
address changes; they are the only identity details in the file.

The rest of that policy is already accurate for how the app actually behaves: no
account, no server, no analytics, everything in local storage. **The one section
worth reading yourself is the microphone.** On most browsers, the speech-to-text
feature sends what you say to the browser maker (Google on Chrome, Apple on Safari)
to be transcribed. The app never receives or stores audio, only the text, but that
round trip is real and the policy says so. Typing is always available instead.

---

## Hosting it

Any static host works. Both of these are free and take about five minutes:

**Cloudflare Pages** or **Netlify**

1. Create a free account.
2. Drag this whole folder into their deploy area.
3. Add `getunloaded.now` as a custom domain in the site settings and follow
   their DNS steps.

You need HTTPS for install and offline to work. Both hosts give you that
automatically, including on a custom domain.

One thing specific to `.now`: it is on the HSTS preload list, so browsers refuse
to load it over plain HTTP at all. That is fine on Cloudflare or Netlify, which
issue a certificate for you, but it does mean a half-finished DNS setup will look
completely broken rather than merely insecure. Finish the certificate step before
testing.

---

## Telling people how to install it

- **iPhone:** open the link in **Safari**, tap **Share**, then **Add to Home Screen**.
- **Android:** open in **Chrome**, tap the **⋮** menu, then **Install app**.
- **Computer:** works in the browser. Chrome and Edge show an install icon in the address bar.

Once installed it opens full screen like a normal app and works with no signal.
Each person's data stays on their own device.

---

## Working on it

`hosted-app/index.html` is the source of truth. Everything else is generated.
After changing it, from the project root run:

```bash
node build.js
```

That produces all four outputs from the one source, and fails loudly if any of
them would ship broken:

- `Unloaded.html` — single file with fonts, icons and manifest inlined
- `dist/` — this bundle, rebuilt
- `unloaded-hosted.zip` — the bundle, zipped
- `design/prototype.html` — the shareable Artifact build

**Do not edit `dist/`, the zip, or `design/prototype.html` by hand.** They get
overwritten on the next build.

### Testing locally

Open it through a small web server rather than double-clicking the file, because
service workers need `http` or `https`:

```bash
cd dist && python -m http.server 8000
```

Then visit `http://localhost:8000`. Screens are addressable directly by hash, which
is handy while working: `#/today`, `#/week`, `#/owns`, `#/chaos`, `#/return`,
`#/reset`, `#/share`, `#/more`.

### Shipping an update

Bump the version in `CACHE` at the top of `sw.js` (currently `rtw-v2`, so use
`rtw-v3`) whenever `index.html` changes. Without that bump, people who already
installed it keep the old cached version.

---

## Still prototype, not V1

The dark **Prototype controls** bar at the top is scaffolding, not product. It
switches stage, voice level, theme and candidate name so you can reach states that
would otherwise take weeks of real time. Remove it before this goes to anyone real:
delete the `<div class="pb">` block, its `.pb` styles, and the `syncProto` wiring
near the bottom of the script.

Known gaps, all deliberate: one child only, no partner sync, and the "Ready for
Monday" checklist still needs the rethink described in `design/PHASE-2-NOTES.md`.
