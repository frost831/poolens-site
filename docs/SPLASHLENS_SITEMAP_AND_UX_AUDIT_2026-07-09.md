# SplashLens Sitemap And UX Audit - 2026-07-09

## What Changed

The public homepage top navigation was too flat. It exposed too many product, training, partner, and workflow links as equal choices, which made the page feel heavier than the app's field-use promise.

The homepage nav now uses four product buckets:

- Tools: PartSnap, Parts ID, Proof Library, Mystery Lab, AI scanning, web app
- Equipment: robots, automation, lighting, salt cells, spa/swim spa, brand hubs
- Learn: Facility Assist, Tech Radar, training, blog, how it works, compare
- Partners: partner page, field testers, partner field-card packet, media traffic

The store badges remain in their own download strip under the nav.

## Sitemap Audit

Checked local sitemap files:

- `sitemap.xml`: 374 URLs, no duplicate URLs, Facility Assist present
- `pseo-sitemap.xml`: 253 URLs, no duplicate URLs
- `category-hub-sitemap.xml`: 9 URLs, no duplicate URLs
- `seo-hub-sitemap.xml`: 19 URLs, no duplicate URLs
- `source-pages-sitemap.xml`: 23 URLs, no duplicate URLs

`robots.txt` references all five sitemap files:

- `https://splashlens.com/sitemap.xml`
- `https://splashlens.com/pseo-sitemap.xml`
- `https://splashlens.com/seo-hub-sitemap.xml`
- `https://splashlens.com/category-hub-sitemap.xml`
- `https://splashlens.com/source-pages-sitemap.xml`

## UX Notes

The website should not try to make every SplashLens lane equally loud. The homepage should sell the core wedge first:

1. PartSnap / part identification
2. Open the field tools
3. Equipment lanes if the user knows what they are working on
4. Facility Assist if the user is a CPO/operator instead of a repair tech
5. Partner/media/testing routes for industry users

The app should mirror this hierarchy with a first-screen workflow chooser instead of making every tool compete at once.

Recommended app first-screen order:

1. Identify a part or label
2. Look up an error/code
3. Facility/CPO quick action
4. Equipment troubleshooting by type
5. Dosing/math
6. Notes/proof/report
7. Training/apprentice mode

## Remaining Watch Items

- Search Console should still submit all five sitemap files individually.
- If Google starts surfacing too many thin pages, keep the hub/category pages strong and use them as the primary internal-link backbone.
- Keep public copy conservative: SplashLens is a field reference and proof workflow, not a repair guarantee or official manufacturer procedure.
