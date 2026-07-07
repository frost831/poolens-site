# PartSnap Source and Part Taxonomy - 2026-07-07

## Goal

PartSnap should help a tech create a safer proof packet before ordering, escalating, or asking a counter/vendor for help. It should not claim exact identification or guaranteed fitment from one photo.

## Universal Proof Checklist

Require or encourage these before any confident part path:

1. Wide equipment photo: full pump/heater/filter/controller/robot/cover area.
2. Model plate: brand, model, serial, BTU/HP/voltage, manufacture date if visible.
3. Part close-up: clean, well-lit photo of the suspected part.
4. Context photo: where the part sits in the assembly.
5. Measurement: diameter, length, port size, union size, thread type, or gasket profile.
6. Symptom/code: what failed and what the display/app shows.
7. Safety context: power/gas/refrigerant/water-pressure boundary where relevant.
8. Current manual/source link: official support, parts sheet, or manufacturer page.

## Part Families To Track

### Pumps

- Lid, lid o-ring, basket, strainer pot, volute, seal plate, diffuser, impeller, shaft seal, drain plug, union, motor, drive, keypad/control cover, fan/shroud, communication cable.
- Proof flags: pump family, HP/THP, voltage, date range, wet-end/motor split, union size, automation connection.

### Heaters / Heat Pumps

- Thermal regulator, manifold/header, bypass, pressure switch, flow switch, hi-limit, igniter, flame sensor, gas valve, blower, control board, display, temperature sensor, heat exchanger, compressor/fan capacitor, defrost sensor.
- Proof flags: gas/electric/heat pump, BTU, model/serial, error code, flow/filter pressure, ambient temperature, qualified gas/refrigerant boundary.

### Salt Systems

- Salt cell, flow switch, union, control board, power center, transformer, sensor, cleaning cap, blade condition.
- Proof flags: cell model, controller display, salt test, flow direction, cell age, cable/connector, compatible controller family.

### Automation / Smart Backyard

- Main board, relay, transformer, valve actuator, RS-485 terminal, wireless bridge, antenna, keypad, remote, sensor, circuit breaker/GFCI.
- Proof flags: controller model, firmware/app screen, wiring photo, relay label, assigned circuit, 24VAC/line-voltage boundary.

### Lighting

- Fixture, niche, cord, junction box, transformer, driver, lamp/LED engine, gasket, face ring, lens, controller.
- Proof flags: voltage, fixture/niche family, cord length/path, transformer load, GFCI behavior, automation mode.

### Robots / Cleaners

- Power supply, dock, charging contacts, battery housing, tracks, wheels, brushes, filter basket/panel, debris tray, impeller, motor unit, cable, swivel, caddy, retrieval hook, app status.
- Proof flags: model/serial, charger/dock model, LED/app code, runtime, climb behavior, mapping/app screen, missing demo-unit accessories.

### Pressure / Suction Cleaners

- Wall fitting, hose section, backup valve, float, tail sweep, sweep hose, tire, wheel, axle, turbine, gearbox, belts, bags, feed pipe, swivel.
- Proof flags: cleaner model, hose count/length, wall fitting, booster pump presence, wheel RPM, pressure relief, debris type.

### Filters

- Cartridge, DE grid, manifold, air relief, clamp, tank o-ring, bulkhead, standpipe, laterals, multiport valve, pressure gauge, drain plug.
- Proof flags: filter model, square footage, clamp type, cartridge/grid dimensions, pressure clean/dirty, backwash valve type.

### Valves / Plumbing

- Diverter, check valve flapper, spring, lid, valve top, gasket, o-ring, union, actuator, spider gasket, push-pull piston.
- Proof flags: port size, valve brand/family, top/side mount, handle position, actuator compatibility, flow direction.

### Covers

- Track, glider, rope/cable, leading edge, pulley, motor, mechanism, key switch, cover pump, fabric, brackets, coping channel.
- Proof flags: track style, deck/coping detail, cover travel behavior, standing water, obstruction, motor/control photo.

### Spas / Hot Tubs

- Spa pack, topside control, heater tube, pressure switch, flow switch, circ pump, jet body, air valve, filter, ozone/UV/AOP unit, sensor, union.
- Proof flags: small-volume chemistry, breaker/GFCI behavior, flow/no-heat code, pack model, topside display code, pump voltage, plumbing layout, heater tube, sensor family, filter condition, drain/purge history, cover condition.

### Spa Pack / Topside Controllers

- Balboa, Gecko, Waterway NEO, OEM-branded pack, topside keypad, heater tube, pressure/flow switch, temp sensor, high-limit sensor, relay/board, GFCI behavior.
- Proof flags: controller ecosystem, exact display code, pack label, topside photo, pump/circ-pump running status, water level, filter proof, valve position, breaker trip timing, manual/source link.

### Spa Ozone / UV / AOP

- Ozone module, UV/AOP chamber, lamp, check valve, injector, tubing, status light, flow loop, power supply.
- Proof flags: module label, status light, lamp age, check-valve water intrusion, injector air draw, flow proof, tubing route, qualified electrical boundary.

### Chemical Feeders / Controllers

- ORP probe, pH probe, flow cell, injection fitting, peristaltic tube, pump head, tank, controller board, calibration solution, check valve.
- Proof flags: controller model, probe age, calibration date, flow-cell photo, feed line route, overfeed/lockout status.

## Confidence Ladder

- `low`: one photo or one symptom; suggest more proof.
- `possible`: model family plus visible part family, still needs manual/source verification.
- `probable`: model plate, part close-up, context photo, and source match all agree.
- `vendor-ready`: includes proof packet, measurements, symptom/code, and current manual/source link.

## Partner-Verified Card Fields

When a manufacturer, distributor, trainer, or senior tech helps, capture:

- Brand and model family.
- Exact part-family names they prefer.
- Known lookalike mistakes.
- Required proof photos before ordering.
- Date/serial/revision caveats.
- Safety or warranty language.
- Link to current official support/manual page.

## New Proof Packet Templates

### Spa Pack Proof Packet

- Controller ecosystem: Balboa, Gecko, Waterway NEO, OEM-branded, or unknown.
- Visible code: display text, flashing indicators, app screen, or blank display.
- Water/flow proof: water level, filter state, valve position, circ pump or jet pump movement.
- Safety proof: GFCI trip timing, wet pack/topside evidence, heater/high-limit repeat behavior.
- Escalation rule: do not recommend board, sensor, heater, or pump replacement without current manual and qualified verification.

### Chemical Controller Proof Packet

- Controller model and app/screen state.
- Manual water test, probe age, calibration standard/date, flow cell, sample line, tank/tablet level, feed tubing, injection fitting.
- Risk prompt: automation readings that disagree with manual tests are high callback risk.

### AOP / Ozone / UV Proof Packet

- Module label, status light/app alert, lamp age, flow proof, tubing/check-valve condition, injector air draw, water-in-tubing evidence.
- Risk prompt: stop if water has reached electronics or if the unit requires energized internal testing.

## Scrape Sources That Help PartSnap

- Official parts sheets and exploded diagrams.
- Official support/manual libraries.
- Product catalog replacement-parts sections.
- Distributor parts diagrams only as secondary cross-checks.
- Training/provider guides only for workflow language, not manufacturer claims.
- User-submitted proof packets only with permission and no customer private data.

## Copy Boundary

SplashLens should say:

"PartSnap helps create possible part paths and proof packets for verification."

SplashLens should not say:

"PartSnap identifies the exact part," "guaranteed fit," "manufacturer-approved," or "replace this part."
