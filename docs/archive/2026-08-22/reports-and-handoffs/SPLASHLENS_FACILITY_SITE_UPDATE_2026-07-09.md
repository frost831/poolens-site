# SplashLens Site Update - Persona Fork / Facilities Page

Date: 2026-07-09

## Shipped on the public site

- Homepage persona fork under the hero:
  - `I fix pools for a living` -> `https://app.splashlens.com/?mode=tech`
  - `I am responsible for a pool, not the repair tech` -> `/facility-assist`
  - `Service company or multi-site operator?` -> `/facilities`
- Facility Assist promoted to top nav as `For Facilities`.
- Facility Assist CTAs now point to `https://app.splashlens.com/?mode=facility`.
- Added `/facilities` B2B/operator page:
  - six-lane workflow
  - QR pilot-in-a-box
  - usage reporting
  - partner/operator positioning
  - pilot lead note form
- Added `/facilities` to:
  - `sitemap.xml`
  - `ai.txt`
  - `llms.txt`
- Unified homepage count language to `230+`.
- Verified no `Connected Pool Brain` wording remains in the checked public HTML surfaces.

## Validation run

- Local Playwright test verified:
  - 3 persona fork links on homepage.
  - Facility Assist has 0 old `tab=errors` links.
  - Facility Assist has 3 `mode=facility` links.
  - `/facilities.html` renders the B2B hero.
- Grep checks:
  - no `tab=errors`, `180+`, or `Connected Pool Brain` in `index.html`, `facility-assist.html`, `facility-assist-page.html`, `facilities.html`, `ai.txt`, `llms.txt`, or `sitemap.xml`.
