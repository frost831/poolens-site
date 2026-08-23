# SplashLens Dropbox Cleanup Audit - 2026-06-19

Scope cleaned:

- `C:\Users\sales\Dropbox\Projects\poolens-site`
- `C:\Users\sales\Dropbox\Projects\poolens`

## Git Cleanup

`poolens-site`:

- Committed `functions/api/event.js` and `functions/api/subscribe.js`.
- Commit: `f671991 Add SplashLens email alerts for site events`
- Pushed to `origin/outreach/splashlens-drip-20260616`.
- Final status: clean.

`poolens`:

- Committed App Store metadata updates, `functions/api/waitlist.js`, and Mac handoff.
- Commit: `ff0b4d3 Update SplashLens app metadata and waitlist alerts`
- Pushed to `origin/feature/splashlens-usage-alerts-dashboard`.
- Final status: clean.

## Generated Folder Cleanup

Removed generated/cache folders from `poolens` only:

- `.wrangler`
- `android-twa/.gradle`
- `android-twa/app/build`
- `android-twa/build`

Left in place intentionally:

- `.secrets.local`
- `play-store-artifacts/SplashLens-Field-Tools-1.0.0-v1-signed.aab`
- `play-store-artifacts/SplashLens-Field-Tools-1.0.1-v2-signed.aab`

## Verification

Syntax checks passed for:

- `poolens-site/functions/api/event.js`
- `poolens-site/functions/api/subscribe.js`
- `poolens/functions/api/waitlist.js`

Final ignored cleanup dry-run:

- `poolens`: only `.secrets.local/` remains ignored.
- `poolens-site`: no ignored cleanup candidates.

## Wider Dropbox Projects Audit

Top-level Dropbox project scan found many unrelated dirty repositories outside SplashLens. I did not commit, stash, delete, or mutate those unrelated projects.

Largest tracked-dirty repos found:

- `throttleshare`
- `hyperpulse`
- `lumenly`
- `grainbrief`
- `plowshare`
- `acreshare`
- `herdroute`
- `driftpatrol`
- `dashboard`
- `belowzeromedia`
- `job-scraper`
- `answermap`
- `re-deal-analyzer`

Clean SplashLens-related repos after cleanup:

- `poolens`
- `poolens-site`

Other top-level repos reported clean in the scan:

- `bay2course-data-passport`
- `grainbrief-deploy-sync`
- `markset-recruiting-intelligence`
- `notary_vault`
- `throttleshare_outreach`

## Notes

The older `C:\Users\sales\Dropbox\Projects\splashlens` folder still contains generated dependencies/build folders and a Dropbox conflicted copy. It was not touched because current project memory and recent deployments identify `poolens` and `poolens-site` as the active SplashLens repos.
