# SplashLens AI Scanner Metering Blocker - 2026-05-27

## Scope Decision

No new server auth was implemented in this pass.

The scanner route that matters for the live PWA is in:

```text
../poolens/functions/api/scan.js
```

That route already has a production stop-rule: if production scanner traffic does not have `SCAN_USAGE_KV`, it returns `503` with `Server scan metering is not configured`. It also supports a Cloudflare rate limiter binding when available.

## Remaining Blocker

The route does not yet verify a real paid entitlement.

Before calling PartSnap Pro or paid AI scans production-complete, the server needs:

- durable user/customer/device identity
- Stripe customer or native store entitlement verification
- server-side paid scan allowance and monthly reset logic
- failed-scan handling that does not burn paid usage
- restore/sync behavior for users moving devices

## Public-Site Copy Rule

The public site can say:

- free manual field tools
- online scanner workflows
- 10 free AI scans when the app enforces that limit
- PartSnap Pro as a web scanner upgrade

The public site should not say:

- guaranteed repairs
- diagnostic certainty
- unlimited paid scans until entitlement is server-verified
- cross-device subscription sync until account entitlement exists

