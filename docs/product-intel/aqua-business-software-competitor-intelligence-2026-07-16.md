# AQUA Business Software and Product Intelligence - 2026-07-16

## Decision

SplashLens should remain the field-intelligence and proof layer beside route and CRM systems. The reviewed products validate strong demand for less admin, faster field capture, connected-equipment visibility, and cleaner customer communication. They do not justify rebuilding scheduling, invoicing, payments, accounting, or a full CRM inside SplashLens.

## Implemented Now

| Signal | SplashLens response | Status |
| --- | --- | --- |
| Task Hub supports prioritized tasks and resume-later work. | Added a local Field Proof Queue to Service Proof Passport with save, resume, clear, priority, review route, chemistry rows, and senior-tech packet access. | Implemented |
| Vigipool exposes connected temperature, lights, filtration, pumps, chemistry, remote data, and alerts. | Expanded CCEI/Vigipool proof around alert timestamp, local-panel state, network status, app screenshot, and manual chemistry verification. | Implemented |
| MeasureGO uses supported Apple LiDAR hardware and a manufacturer portal for cover measuring. | Added generic cover-measure proof prompts for perimeter, steps, raised walls, obstructions, anchors, device capability, photos, and manufacturer review. No fitment claim or proprietary measuring workflow copied. | Implemented |
| Plunge All-In Gen 2 combines cooling, ozone, circulation, integrated sensors, Wi-Fi, maintenance reminders, and remote control. | Added a connected cold-plunge proof workflow for actual temperature, setpoint, flow, filter, ozone status, app alert, network state, and qualified refrigeration/electrical boundaries. | Implemented |
| Active Invoicing converts chemical and supply use into billable records. | Kept SplashLens's existing chemical amount, stock source, and estimated stop-cost capture; preserved it in drafts and proof exports instead of adding accounting. | Implemented |
| Paythepoolman/Orenda connects readings to in-app dose recommendations. | Added a generic Dose Basis / Calculator Source field to Service Proof drafts, reports, and share packets so the calculation source travels with the work. No Orenda integration or proprietary formula is claimed. | Implemented |
| Jandy X-Series AOP adds in-line/off-line UV-C plus ozone systems with service-status indicators. | Added Jandy X-Series AOP models and a cautious proof card for model/configuration, volume, LED state, flow, installation, lamp age, ozone tubing/check valve, and manual sanitizer verification. | Implemented |
| SwamCam combines two smart cameras, local/remote alerts, backup behavior, auto-arm, and keypad access. | Added a Pool Safety Monitoring lane for coverage, blind spots, walk tests, alarm paths, network/backup power, access, privacy, and failed-test escalation. | Implemented |

## Competitive Boundaries

| Product | Primary lane | Useful lesson | Do not chase now |
| --- | --- | --- | --- |
| ProValet | Route-service operating system | Frictionless technician workflows, subscription automation, clean customer communication | Payments, subscriptions, accounting sync, route dispatch |
| Paythepoolman Task Hub | Team task management | Priority, assignment, resume-later work | General office task system |
| PoolDial | Pool-service CRM | Mobile field capture and scalable solo-to-team positioning | AI receptionist, website builder, invoicing, full CRM |
| Paythepoolman Map Pin Routing | Route operations | One-screen action context and fewer page changes | Route optimization and map dispatch |
| Paythepoolman Pool Junction | Customer portal | Customer-safe issue intake and transparent service proof | Billing profile, payments, deposits, bid approval |
| The Service Program | QuickBooks-connected service management | Before/after proof, chemical use, maintenance history | QuickBooks and calendar integrations until a real API/export partner exists |
| ProValet Active Invoicing | Automated chemical/supply billing | Capture usage once at the stop | Becoming merchant-of-record or invoicing engine |
| Paythepoolman 2.0 | All-in-one pool service management | Cleaner, faster mobile workflows and fewer interrupted stops | Scheduling, routing, billing, invoicing, or all-in-one CRM positioning |
| Paythepoolman / Orenda integration | CRM-linked chemistry calculations | Preserve calculation provenance beside the readings and applied dose | Claiming an Orenda integration or copying branded/proprietary calculations |

## Product Intelligence

### CCEI Vigipool

- Field proof: app alert, alert time, device/controller model, local panel state, network state, manual chemistry, current schedule, and affected device.
- Boundary: remote readings and alarms are clues. Manual tests, current manuals, and qualified work remain required.

### Latham MeasureGO / MeasurePRO

- Field proof: supported device, pool perimeter, steps, walls, obstructions, existing anchors, deck condition, wide photos, unusual geometry, and manufacturer portal review.
- Boundary: SplashLens does not reproduce the patented LiDAR workflow and does not guarantee a cover fit.

### Plunge All-In Gen 2

- Field proof: actual temperature, setpoint, cooling time complaint, filter and flow, ozone/maintenance status, sensor alert, Wi-Fi state, app screenshot, and ambient context.
- Boundary: refrigeration, internal electrical, sensor replacement, and sanitation-service work follow current manufacturer guidance and qualified service.

### Jandy X-Series AOP

- Field proof: model plate, in-line/off-line configuration, pool volume, LED state, circulation flow, plumbing orientation, mounting, lamp age, ozone tubing/check valve, and manual sanitizer reading.
- Boundary: AOP is supplemental treatment. Keep required sanitizer residuals and testing in place. Manufacturer efficacy, oxidation-power, chemical-reduction, and equipment-life claims are not repeated as independent SplashLens guarantees.

### SwamCam / Smart Pool Safety Monitoring

- Field proof: both camera views, remaining blind spots, armed state, walk-test time, audible alarm, alert destinations, network state, backup power, auto-arm, keypad access, and privacy/access settings.
- Boundary: monitoring technology never replaces supervision, barriers, gates, covers, code-compliant alarms, lifeguards, or emergency plans. A successful device test is not a guarantee that drowning will be prevented.

## Sources Reviewed

- ProValet enhancements: https://www.aquamagazine.com/products/business-software/article/15828697/provalet-provalet-enhances-software-platform-to-expand-routebased-service-business-automation
- Paythepoolman Task Hub: https://www.aquamagazine.com/products/business-software/article/15828659/paythepoolman-paythepoolman-task-hub
- PoolDial: https://www.aquamagazine.com/products/business-software/article/15820949/pooldial-pooldial-pool-service-management-software
- Paythepoolman Map Pin Routing: https://www.aquamagazine.com/products/business-software/article/15774195/paythepoolman-paythepoolman-map-pin-routing
- Plunge All-In Gen 2: https://www.aquamagazine.com/products/article/15770427/plunge-plunge-allin-gen-2
- CCEI Vigipool: https://www.aquamagazine.com/products/business-software/article/15755502/ccei-usa-ccei-vigipool-app-improvements
- Paythepoolman Pool Junction: https://www.aquamagazine.com/products/business-software/article/15754817/paythepoolman-paythepoolman-the-pool-junction
- The Service Program: https://www.aquamagazine.com/products/business-software/article/15754498/the-service-program-the-service-program
- Latham MeasureGO: https://www.aquamagazine.com/products/business-software/article/15754403/latham-pool-products-latham-introduces-its-latest-industryleading-measure-technology-measurego
- ProValet platform: https://www.aquamagazine.com/products/business-software/article/15751581/provalet-provalet-provalet-automation-platform
- ProValet Active Invoicing: https://www.aquamagazine.com/products/business-software/article/15750265/provalet-provalet-announces-launch-of-provalet-active-invoicing-pai
- Paythepoolman 2.0: https://www.aquamagazine.com/products/business-software/article/15749089/paythepoolman-paythepoolman-paythepooman-20
- Jandy X-Series AOP: https://www.aquamagazine.com/products/sanitizing/article/15742584/fluidra-fluidra-jandy-xseries-aop-systems
- Paythepoolman / Orenda integration: https://www.aquamagazine.com/products/business-software/article/15681634/paythepoolman-orenda-integration
- SwamCam dual-camera system: https://www.aquamagazine.com/products/pool-accessories/article/15741101/swamcam-swamcam-dual-camera-system

Product-submission claims were treated as market signals, not independently verified performance guarantees.
