# SplashLens site handoff for Grok — October 22, 2026

Use `codex/splashlens-grok-handoff-20261022` in both [poolens-site](https://github.com/frost831/poolens-site) and [poolens](https://github.com/frost831/poolens). The complete cross-repository plan, payment configuration, PartSnap acceptance gap and selected evidence are in the [app GROK_HANDOFF.md](https://github.com/frost831/poolens/blob/codex/splashlens-grok-handoff-20261022/GROK_HANDOFF.md).

## Done

This branch includes site master `cf863ce` (including direct Closing Pro and Crew CTAs from #21 and the bridge repository fix) plus public-asset security integration `8873b21e4704be3e924428682a49f0343bbe7eb2`. The strict staging allowlist, runtime artifact guards and mandatory packaging tests are included. The previously local public-artifact-packaging branch was also pushed. No site deployment was performed for this Git handoff.

Fresh local verification on October 22: **119 tests passed, zero failures, zero skips**. The app companion passes **388 tests, zero failures/skips**, with a passing 120-case metadata-only PartSnap benchmark. Real photo recognition remains unproven. See `docs/handoff/2026-10-22/verification.json` and `site-test-summary.txt`.

## Commands

For a fresh checkout:

```sh
git clone --branch codex/splashlens-grok-handoff-20261022 https://github.com/frost831/poolens-site.git
git clone --branch codex/splashlens-grok-handoff-20261022 https://github.com/frost831/poolens.git
```

For an existing clean clone:

```sh
git fetch origin --prune
git switch codex/splashlens-grok-handoff-20261022
git pull --ff-only origin codex/splashlens-grok-handoff-20261022
npm test
node tools/stage-public-assets.mjs
```

If the branch is not local, use `git switch --track origin/codex/splashlens-grok-handoff-20261022`. Preserve existing local edits. Staging writes `_deploy/public`; deploy only the staged public output. Never publish the repository root or copy `functions/`, docs, tests, tools, Git files or private evidence into public assets. Functions compile separately from the repository working directory.

## Current checks and next work

1. Inspect the fresh handoff branch CI. Existing [security PR #23](https://github.com/frost831/poolens-site/pull/23) had successful bridge CI but canceled test CI at the October 22 check. A canceled check is not a pass; resolve the ordinary checks before integration. Reconcile overlapping PRs after merging this branch rather than duplicating changes.
2. Refresh actual production deployment and custom-domain assets before a release claim or redeploy. October 19 snapshots in the app evidence folder are historical. Verify allowed public assets and private-route rejection after any authorized release.
3. Follow the app handoff for the main remaining work: installed iPhone/Android gallery and real-photo PartSnap acceptance, fresh failure diagnosis, real post-value checkout intent and paid fulfillment, and current store-console evidence. Existing live Closing Pro/Crew products must not be recreated. TEST fulfillment is already proven; actual customer revenue is separate.

Generated caches and historical unrelated edits remain local. Credentials, signed access URLs and raw browser/auth logs were excluded from this handoff. No further user action is required to pull both repositories and start the engineering work.
