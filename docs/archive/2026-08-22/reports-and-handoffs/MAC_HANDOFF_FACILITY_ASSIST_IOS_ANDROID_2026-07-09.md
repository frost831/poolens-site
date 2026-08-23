# Mac Handoff - Facility Assist Native Update - 2026-07-09

## Objective

Mirror the new SplashLens Facility Assist workflow into the native iOS and Android shells without changing the existing PartSnap/service-tech depth.

Public site page now live-ready in the site repo:

- `C:\Users\sales\Dropbox\Projects\poolens-site\facility-assist.html`
- Public target: `https://splashlens.com/facility-assist.html`

App repo already has the first web-app version of the CPO / Facility quick start:

- Repo: `C:\Users\sales\Dropbox\Projects\poolens`
- Web app target: `https://app.splashlens.com`
- Function: `startOperatorWizard(intent)` in `js/app.js`
- Event: `operator_pilot_wizard_opened`
- Dashboard metric: `operatorWizard30d`

## Native UX To Add

Add a first-screen or top-card mode named:

**CPO / Facility quick start**

Do not replace PartSnap or service-tech tools. This is a role/situation front door.

Six buttons:

1. Daily Pool Check
2. Chemical Dose
3. Contamination Event
4. Pump / Motor Basic
5. Find Manual / Label
6. Call Support

Each button should render short 3-step guidance, then route into existing app tools:

- Daily Pool Check -> Visit Report / checklist
- Chemical Dose -> Dosing / volume
- Contamination Event -> Report / support packet
- Pump / Motor Basic -> Scanner / report
- Find Manual / Label -> PartSnap / equipment proof
- Call Support -> Build Report, then configurable phone/support route

## Product Boundary

Use this language:

- "Reference only."
- "Local code, facility policy, CPO training, manufacturer manuals, and qualified judgment still control."
- "Basic visible checks only."
- "Escalate when the issue is above staff scope."

Avoid:

- Diagnosis replacement claims.
- Certified training claims.
- Official Aquatic Council partnership claims until paperwork exists.
- Any statement that Facility Assist determines reopening after contamination.

## Support Route

For now, keep support route configurable. Do not hardcode Aquatic Council as an official support provider in App Store / Play Store metadata unless Joshua confirms the agreement.

If a demo build needs a route for Tim, use a configuration constant or build flag:

- `FACILITY_SUPPORT_PHONE`
- `FACILITY_SUPPORT_LABEL`
- `FACILITY_SUPPORT_EMAIL`

## ASO Copy Angle

Add lightly to update notes only after native UI exists:

"New Facility Assist workflow for CPOs and pool operators: daily checks, chemical dosing support, contamination-event documentation, basic equipment proof, and escalation packets. Reference only; follow local code, facility policy, CPO training, and qualified service guidance."

## TestFlight / Play Internal Test Checklist

- Open app fresh and confirm CPO / Facility quick start appears without hiding PartSnap.
- Tap all six workflow buttons.
- Confirm no button implies diagnosis, reopening approval, code compliance, or official certification.
- Confirm `operator_pilot_wizard_opened` fires.
- Confirm dashboard `/dashboard` shows CPO Wizard count after test.
- Confirm PartSnap and scanner still work.
- Confirm existing iOS/Android store badges and shell detection remain unchanged.

## Demo Talk Track For Tim

"We built the light front door before you sent the full map so you can react to something concrete. The service-tech depth is still underneath, but the CPO/facility workflow starts with daily check, dose, contamination, basic equipment, manual/label, or support. The next step is mapping your real call-log categories into this flow."

