# Mac Handoff - SplashLens Site Logo Preview Fix - 2026-07-09

## Done

- Audited all `631` static HTML pages in `C:\Users\sales\Dropbox\Projects\poolens-site`.
- Fixed the missing canonical SplashLens logo/share preview metadata across all pages.
- Added `og:image:secure_url` to every HTML route so link previews have the secure logo/share-card URL.
- Fixed the `facilities.html` outlier that was missing `favicon-32.png`, `site.webmanifest`, `twitter:card`, and `twitter:image`.
- Added an audit note at `C:\Users\sales\Dropbox\Projects\poolens-site\docs\SPLASHLENS_LINK_LOGO_AUDIT_2026-07-09.md`.

## Needs Manual Action

- On Mac, after pulling this site commit, open a few live pages in Safari and Chrome and inspect the page source/head:
  - `https://splashlens.com/`
  - `https://splashlens.com/facilities.html`
  - `https://splashlens.com/blog/above-ground-pool-brands.html`
  - `https://splashlens.com/partsnap-pool-part-identification-app.html`
- If testing link previews in Messages/Slack/LinkedIn, remember those services may cache old previews. If an old preview appears, use the platform's preview debugger/cache refresh where available.

## Files/Artifacts

- Site repo: `C:\Users\sales\Dropbox\Projects\poolens-site`
- Audit note: `C:\Users\sales\Dropbox\Projects\poolens-site\docs\SPLASHLENS_LINK_LOGO_AUDIT_2026-07-09.md`
- This handoff: `C:\Users\sales\Dropbox\Projects\poolens-site\docs\MAC_HANDOFF_SPLASHLENS_SITE_LOGO_PREVIEW_FIX_2026-07-09.md`
- Canonical share card: `https://splashlens.com/splashlens-share-card.png`

## Commands

From `C:\Users\sales\Dropbox\Projects\poolens-site`:

```powershell
git pull
git status --short
curl.exe -s https://splashlens.com/facilities.html | Select-String -Pattern 'favicon-32.png|apple-touch-icon|site.webmanifest|og:image|og:image:secure_url|twitter:image'
curl.exe -s https://splashlens.com/blog/above-ground-pool-brands.html | Select-String -Pattern 'og:image:secure_url|twitter:image'
```

## Verification

Local audit after fix:

- HTML files checked: `631`
- Pages missing required logo/link preview metadata: `0`

The required metadata contract is:

- `/favicon.svg`
- `/favicon-32.png`
- `/splashlens-icon-180.png`
- `/site.webmanifest`
- `og:image`
- `og:image:secure_url`
- `og:image:width`
- `og:image:height`
- `og:image:type`
- `og:image:alt`
- `twitter:card`
- `twitter:image`

## Checklist

- [ ] Pull site repo on Mac.
- [ ] Confirm no unexpected local dirty files before any store/app work.
- [ ] Spot-check the live HTML head for the links listed above.
- [ ] If link previews still show a generic image, refresh the external platform preview cache.
- [ ] Continue iOS/App Store Connect work only after the site repo is clean.

