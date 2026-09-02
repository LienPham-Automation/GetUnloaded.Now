# UNLOADED.

Get the return to work out of your head.

A mental load tool for mothers returning to paid work after maternity or parental
leave. No backend, no account, no analytics, no AI. Everything a person enters
stays in their own browser on their own device.

**Live:** getunloaded.now

## Deploying

There is nothing to build. Upload these seven files to any static host and it
works.

**Vercel:** import the repo, leave every setting alone (framework "Other", no
build command, no output directory), deploy, then add `getunloaded.now` as a
domain.

`.now` is on the HSTS preload list, so browsers refuse to load it over plain
HTTP. Vercel issues the certificate automatically, but until DNS and the
certificate are both done the site looks broken rather than merely insecure.
Finish both before testing.

## Files

| File | What it does |
|---|---|
| `index.html` | The whole app. Fonts and everything else are inside it. |
| `privacy.html` | Privacy policy. Linked from the app's More screen. |
| `manifest.webmanifest` | Makes it installable, sets the home screen name and icon. |
| `sw.js` | Service worker. Makes it work offline. |
| `icon-192.png`, `icon-512.png` | Home screen and app switcher icons. |
| `apple-touch-icon.png` | Home screen icon on iPhone and iPad. |

## Installing it

- **iPhone:** open the link in Safari, tap Share, then Add to Home Screen.
- **Android:** open in Chrome, tap the menu, then Install app.

Once installed it opens full screen and works with no signal.

## Changing it

Edit `index.html` directly. Everything user-facing is in two objects near the top
of the `<script>`: `BRAND` for the name and voice level, `COPY` for every string.

**One rule:** after changing `index.html`, change the version in `CACHE` at the
top of `sw.js` (currently `unloaded-v2`, so make it `unloaded-v3` or
anything different). Without that, people who already installed it keep the old
version.

## Contact

Operated by MumOnTheMoney, mumonthemoney@gmail.com. Those two details appear in
`privacy.html` and are the only identity information in these files.
