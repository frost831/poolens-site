# SplashLens Site Claims Handoff - 2026-05-27

## Status

The SplashLens marketing site now aligns better with the field-app direction:

- SplashLens is the public brand.
- PoolLens remains the historical/source repo name only.
- The core product is a free field-rescue PWA for pool service technicians.
- Manual field tools work offline after first load.
- Online AI scanner features require internet.
- PartSnap Pro is a web-only paid launch product with device-local access while account entitlement is being built.
- Route Ready is a free pilot / planned training layer, not a completed paid certificate product.
- Homepage positioning now leads with "before you call the senior tech" and uses field-reference language instead of repair guarantees.
- The homepage favicon uses the local SplashLens logo asset at `/favicon.svg`.

## What Changed

- Tightened homepage, privacy, terms, Route Ready, outreach, and LLM copy.
- Updated homepage pool/pump-pad visual choices and first-screen copy.
- Added stronger security headers and deployment/env documentation.
- Clarified AI scanner privacy, Stripe checkout, anonymous event tracking, and affiliate disclosure boundaries.
- Added store-wrapper warning for native submissions: free-core only unless native billing is added.

## Verification

Completed on Windows:

- `git diff --check`
- targeted `rg` scans for PoolLens/SplashLens, Route Ready, PartSnap Pro, affiliate, AI scanner, and entitlement language
- manual review of `_headers`, `.env.example`, and `DEPLOYMENT.md`

## Remaining Blockers

- Bind `SUBSCRIBERS_DB` before production deploys that rely on subscribe/event functions.
- Replace hardcoded Stripe Payment Links with env vars before rotating links.
- Add clear affiliate disclosure before any real Amazon or parts affiliate tag goes live.
- Paid scanner entitlement is still not production-complete: `poolens/functions/api/scan.js` enforces anonymous server metering when `SCAN_USAGE_KV` is bound, but it does not verify an account, Stripe customer, or native store entitlement.
- Full live-site E2E deploy/smoke remains part of the final flagship gate.

## Backup Gate

This lane is not considered done until:

- The branch is pushed to GitHub.
- The PR/branch URL is captured in the final handoff.
- The repo remains available in the current Dropbox/Codex workspace.
- E: full backup is added later when that drive is healthy.
