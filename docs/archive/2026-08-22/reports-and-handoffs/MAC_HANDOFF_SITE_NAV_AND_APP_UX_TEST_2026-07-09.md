# Mac Handoff - SplashLens Site Nav And App UX Test

## Objective

Test the updated SplashLens public-site navigation and use the same information architecture to guide iOS/Android app polish.

## Git Context

Site repo:

`C:\Users\sales\Dropbox\Projects\poolens-site`

Branch:

`outreach/splashlens-drip-20260616`

Expected newest site commits include:

- `c233704 Add SplashLens icons across public pages`
- `de6a1d3 Move store badges below site nav`
- latest nav/dropdown commit from Codex after this handoff is committed

## Public Site Test

Open:

`https://splashlens.com/`

Verify desktop:

- Top nav is not a flat wall of links.
- Dropdown buckets appear: Tools, Equipment, Learn, Partners.
- Only one dropdown remains open at a time.
- Clicking outside a dropdown closes it.
- Escape closes open dropdowns.
- App Store and Google Play badges sit in the separate strip under the nav.
- No horizontal overflow.

Verify mobile:

- Header does not overflow.
- Dropdown summaries are tappable.
- Dropdown panels fit on screen and scroll if needed.
- Store badges are still reachable and not crushed.
- Open App remains visible enough to be useful.

## Native App UX Direction

Mirror the website hierarchy in the app. The current product is strong, but the first screen should steer the user before showing the whole toolbox.

Recommended first-screen chooser:

1. Identify a part or label
2. Look up an error/code
3. Facility/CPO quick action
4. Troubleshoot by equipment type
5. Chemical dose/math
6. Save notes/proof/report
7. Training/apprentice mode

## Store Submission QA

Before TestFlight / Google Play refresh:

- Verify app icon matches the public-site SplashLens icon.
- Verify screenshots do not show outdated "Pool Brain" language.
- Use "Connected Pool Network" or "Connected Pool Pad" instead of "Pool Brain."
- Verify PartSnap is positioned as possible matches plus missing proof, not guaranteed diagnosis.
- Verify Facility Assist says reference workflow only and does not claim CPO training replacement.

## Pass/Fail

Pass if:

- Site nav is usable on desktop and mobile.
- The app first screen is clearly easier than the previous all-tools-at-once model.
- Store screenshots and copy match the current site language.

Fail if:

- Any nav dropdown is clipped or unreachable.
- App still opens into an overwhelming tool wall.
- Store copy suggests diagnosis, official manufacturer support, or official training approval.
