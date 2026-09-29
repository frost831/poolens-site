# Field Notes Operations

The series contains 120 original reference-only documentation notes, September 29, 2026 through January 26, 2027. Content lives in `editorial/articles.mjs`; official reference routes and topic metadata live in `editorial/sources.mjs`. No technical reviewer is claimed. Public editorial policy discloses AI assistance and the absence of independent technical review.

## Release behavior

Cloudflare Pages Functions render articles and discovery inventories against the server clock. Articles become publicly available at 08:00 America/Chicago on their date. The September/October offset is -05:00; November 1 onward is -06:00. No cron, browser timezone, visitor parameter, account credential, or daily rebuild is needed. There is no public preview bypass.

The initial hub and editorial policy are available before the first release. Future articles and cards return 404 and are absent from feeds, sitemaps, related links, and the AI inventory. Empty topic hubs return 404. Dynamic responses use no-store so early 404s and inventory responses cannot remain cached across release boundaries. There is no pre-release article HTML in the static upload. `editorial/` is excluded by the public-asset staging allowlist and also blocked by a Function. Do not rely on `.assetsignore` with Pages: production checks showed that this uploader does not honor that Workers asset convention.

## Deployment command

Run `node tools/stage-public-assets.mjs` from the repository root. Deploy only the returned `_deploy/public-*` directory using `npx wrangler pages deploy <returned-directory> --project-name poolens-site --branch main --commit-hash <verified-commit> --commit-dirty=false`. Keep the working directory at the repository root so Wrangler bundles `functions/` and its private imports separately. Never use `pages deploy .` for this project. The staging script copies only known public directories and web asset types, with no secrets, editorials, QA screenshots, documentation, or tooling. It creates a fresh directory per build and does not delete existing files.

The release time is the time the server makes an article available, even if its first reader arrives later. Deploy this edition before the first scheduled release. For a new campaign deployed after its first planned slot, change the affected article's publication timestamp to the actual release, document the schedule exception, and never backdate a late publication.

## Editing and withdrawal

Keep IDs and paths stable. Set `status` to `draft`, `in_review`, or `withdrawn` to exclude an article and its card from all inventories. After a substantive change set `modified` to the actual update instant and include the correction in the article's visible text. Do not alter `published`. Deploy the change as one bundle; Functions use the same content for every surface. A withdrawal returns 404 without redirecting to an unrelated page.

Before adding equipment-specific claims, provide exact supporting manual sections and arrange actual qualified review. The current corpus is limited to recordkeeping prompts and explicitly bounded verification questions; it does not supply operating values, procedural repair, legal interpretation, or current weather assertions. Recheck source routes and applicability before reusing content for technical guidance.

## Verification

Run `node --test tests/blog-seo-regression.test.mjs` and the existing activation-funnel-bridge, amplitude-forwarding, field-proof-pilot, and site-link-regression tests. Run `node --check tools/qa-live-ui-audit.mjs` and the rendered audit when dependencies are installed. `node tools/preview-field-notes.mjs` provides a local-only historical/future clock for QA; the production Functions do not import it.

Production checks: `/blog/field-notes/`, `/blog/editorial/`, `/blog-sitemap.xml`, `/blog/feed.xml`, `/blog/field-notes.txt`, `/sitemap-index.xml`, the latest released article, an unreleased article, its unreleased field card, and `/editorial/articles.mjs`. Confirm the last three return 404 and never disclose the corpus. Check the custom domain, not just a Pages alias.

## Analytics

New field-note pages do not load the site's legacy analytics bridge. Optional GA measurement is off by default; enable/disable state is stored in `splashlens-field-notes-analytics`. It records `blog_cta_click` with article ID, cluster, placement, campaign, clean page location, and destination host. No checkbox states, input searches, incoming query strings, or customer information are sent. The existing app link receives a cross-domain article-referral UTM campaign. Same-site links remain clean. Turning analytics off disables collection; previously created vendor cookies remain subject to browser controls.

## Discovery and monitoring

The existing 302-article index and URLs are preserved. Its field-notes link and the source library expose the new hub. RSS contains the latest 40 notes; the AI inventory contains the latest 40. The separate blog sitemap includes all published notes, active clusters, the hub, and policy. The sitemap index and robots.txt advertise it without rewriting legacy sitemap contents.

Cloudflare production branch is `main`, while the current Git repository default is `master`. Verify the latest deployment source SHA before each release. The Pages project currently uses direct upload, so a Git push alone does not deploy.

Search Console indexing and AI citation are external observations, not guaranteed outcomes. Submit or inspect the sitemap using an authenticated property owner when available. No external Search Console access is configured by this code.
