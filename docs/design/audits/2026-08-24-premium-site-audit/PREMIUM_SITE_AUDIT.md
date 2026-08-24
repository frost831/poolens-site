# SplashLens Premium Site Audit - 2026-08-24

## Bottom Line

SplashLens no longer feels like a generic AI landing page. The current hero, pool-pad photography, simple promise, app chips, and recent AQUA/PoolPro proof make the first screen credible and field-specific.

Overall grade: **B+ / A-**

The product story is strong enough to support industry attention. The remaining gap is not trust or basic quality; it is **premium compression**. The homepage is still trying to show too much. A top-tier studio would make the first journey feel more cinematic, more edited, and more decisive: identify the part, prove the visit, close the season cleanly.

## Evidence Checked

- Live homepage: `https://splashlens.com`
- Closing Season page: `https://splashlens.com/closing-season.html`
- PartSnap page: `https://splashlens.com/partsnap.html`
- Service Proof page: `https://splashlens.com/service-proof-passport.html`
- Web app: `https://app.splashlens.com`
- Desktop screenshot: `home-desktop-1440.png`
- Mobile screenshot: `home-mobile-390.png`
- Closing mobile screenshot: `closing-mobile-390.png`
- App mobile screenshot: `app-mobile-390.png`
- Automated UI audit: 30 surface checks, 0 failures
- Closing workflow checks: 0 failures
- Browser console audit: 0 console errors
- Horizontal overflow: none found on checked mobile routes

Only browser request issue observed: Google Analytics collection requests aborted in headless testing. That is not a visible site failure.

## Ranked Findings

| Rank | Area | Severity | Finding | Fix Priority |
|---:|---|---|---|---|
| 1 | Homepage focus | High | Homepage is still too long and over-informational. Mobile homepage measured about 30,390px of scroll height and 106 focusable controls. | Cut the homepage into a premium sales path and move deep detail into tool pages. |
| 2 | Premium composition | High | Hero is strong, but the desktop first viewport has too many proof cards/chips immediately after the CTA row. It feels useful, not fully art-directed. | Make the hero more cinematic and move the numbered proof flow just below the first viewport. |
| 3 | Product proof | High | The site says the app is powerful, but the hero does not yet show an actual app screen or live PartSnap result. | Add one phone mockup or live app capture in the hero/second section. |
| 4 | Conversion path | High | There are many CTAs competing: identify, proof, pilot, app stores, press, cards, chips. | Pick one dominant CTA per section and one secondary CTA. |
| 5 | Mobile speed of understanding | Medium | Mobile hero is clear, but the press line wraps into multiple lines and competes with the app badges. | Convert press into two compact trust pills or a small "As published in" row. |
| 6 | Agency polish | Medium | Some cards still use repeated white/pastel blocks and heavy rounded pills. This feels polished but not fully custom. | Add a tighter component system: proof rails, app screenshots, fewer cards, richer section rhythm. |
| 7 | Motion | Medium | Motion does not appear broken, but the current experience is more static utility than premium guided reveal. | Add subtle load choreography and section transitions with reduced-motion support. |
| 8 | App first door | Medium | The app persona wizard is smart and useful. It could look more like a premium field console and less like a form stack. | Add iconography, stronger selected-state hierarchy, and a sticky "start" affordance. |
| 9 | SEO/AEO | Low | Current SEO pages are strong and crawlable. Recent AQUA proof is now present. | Add article schema/news item reference only if kept conservative. |
| 10 | Accessibility | Low | No overflow or obvious contrast failure was seen in the checked screenshots. Some hero text overlays depend on dark photo treatment. | Keep contrast tests in the release gate after image changes. |

## Visual Identity Direction

Recommended identity: **Field-Proof Utility, Premium Industrial, Clean Water Tech**

The visual language should feel like:

- A field tool built by someone who has stood at an equipment pad.
- Less "AI SaaS," more "calm command surface for messy service work."
- Premium without being soft: high contrast, clean geometry, rugged proof language, real pool-pad photography.

### Mood

- Fast
- Practical
- Confident
- Field-proven
- Clean
- Slightly technical, never nerdy

### Color Palette

Keep the current SplashLens blue, but make the palette more dimensional:

- Deep navy: command surfaces, footer, dark proof panels
- Splash blue: primary CTAs, active states
- Teal/green: verified proof, saved state, "ready"
- White/off-white: scan readability
- Safety amber: caution, missing proof, callback risk
- Muted gray-blue: secondary cards and support text

Avoid letting every element become blue-on-blue. The site is strongest when blue is the action color, not the whole world.

### Typography

Current typography is bold and readable. The hero headline works.

Recommended refinement:

- Keep the heavy display face for the hero and section anchors.
- Use smaller, tighter headings inside cards.
- Reduce all-caps microcopy except for true labels.
- Give body copy more editorial calm: shorter line lengths and fewer stacked paragraphs.

### Layout System

Use a three-layer system:

1. **Hero / proof moment**: full-bleed photo, short promise, one primary action.
2. **Workflow strips**: numbered or segmented horizontal steps.
3. **Tool pages**: deeper cards, SEO copy, calculators, proof examples.

Homepage should not try to be the whole app manual.

## Complete Experience Audit

### Navigation

Current state: good but dense.

Recommended:

- Keep top nav short: `Features`, `Tools`, `Equipment`, `Learn`, `Partners`, `For Facilities`, `Web App`.
- Avoid adding more top-level items.
- On mobile, route people into role/workflow chips instead of long menus.
- Press/coverage belongs in hero proof and footer, not nav.

### Hero

Current state: strong.

What works:

- "Get off the pad faster" is excellent.
- Real pool-pad image is domain-specific.
- CTA row is clear.
- App Store / Google Play chips look credible.
- New AQUA proof adds urgency.

What weakens premium feel:

- Desktop hero has too many proof tiles in the first viewport.
- The CTA row, app badges, press line, six proof cards, product bars, and pills are all fighting for attention.
- The background image is useful but could be treated with more intentional lighting/depth.

Recommendation:

- First viewport: headline, 1-line subhead, primary CTA, app badges, compact press row.
- First scroll: "1. Identify / 2. Prove / 3. Send" as a premium animated proof rail.
- Second section: phone mockup with PartSnap result.

### Content Flow

Recommended homepage flow:

1. Hero: Get off the pad faster.
2. Proof bar: Published in AQUA twice + PoolPro.
3. Flagship feature: PartSnap and missing-proof workflow.
4. Closing Season Mode: timely FOMO.
5. Service Proof: save the stop.
6. Facility Assist: separate audience lane.
7. Pricing: simple, plain-language.
8. FAQ: objections and trust.
9. Footer: app links, coverage, contact.

### Product Presentation

Current: lots of useful tools are visible.

Problem: everything is presented as equally important.

Fix:

- Make PartSnap the flagship card.
- Closing Season Mode is the current urgency card.
- Service Proof is the paid/business wedge.
- Facility Assist is a partner/pilot lane.
- Everything else moves under "All tools."

### Social Proof

Current: strong and recently improved.

Recommendation:

- Use "Published by AQUA Magazine twice" carefully.
- Always say coverage, article, or published. Never say endorsed, approved, partner, or recommended.
- Put the Aug. 24 article first while it is fresh.

### CTAs

Current CTAs are abundant.

Recommended conversion model:

- Hero primary: `Identify a Part`
- Hero secondary: `Save Visit Proof`
- Timely CTA: `Open Closing Mode`
- Business CTA: `Request Field Pilot`
- Footer CTA: `Get the App`

Kill or demote repeated CTAs that point to the same app without a different job.

### Forms

Audit did not test every form submission in this pass.

Recommendation:

- Every partner/pilot/form submission should show: success state, failure state, spam guard, and email routing proof.
- Keep form labels plain: "What do you want SplashLens to help with?" instead of abstract "partner intake."

### Footer

Footer should carry:

- App links
- Coverage links
- Privacy/terms
- Contact
- "Reference aid, not diagnosis" language

Do not bury coverage only in the homepage body.

## Signature Hero Concept

Concept: **The Stop Before the Callback**

Visual:

- Full-bleed real equipment pad photo.
- Darkened center lighting around the headline.
- A subtle phone screen or proof packet floating near the lower right on desktop.
- On mobile, keep the photo full bleed and stack CTAs cleanly.

Hero copy:

- H1: `Get off the pad faster.`
- Subhead: `Identify the part, prove the stop, and send a cleaner packet before anyone guesses.`
- Primary CTA: `Identify a Part`
- Secondary CTA: `Save Visit Proof`

First-scroll transition:

- The hero dark overlay lifts into a white proof rail.
- Three steps animate in: `Identify`, `Prove`, `Send`.
- The phone mockup pins briefly while the text explains PartSnap.

Cursor/hover:

- Desktop CTA hover: small directional slide, not glow.
- Proof cards: lift 2-4px with a faint field-grid shadow.
- Press links: underline wipe.

## Motion Language

Use motion like a field workflow, not a portfolio trick.

### Page Load

1. Logo appears immediately.
2. Hero image fades in already visible, no blank state.
3. H1 rises 12px with a 180ms ease.
4. CTA row appears 80ms later.
5. Press row fades in last.

### Scroll

- Use 120-180ms reveals only.
- Never set content to `opacity: 0` without a no-JS fallback.
- Respect `prefers-reduced-motion`.
- Avoid parallax on mobile.

### Micro-Interactions

- CTA hover: slight lift and darken.
- App badges: no bounce.
- Cards: consistent 2px border movement or shadow, not mixed effects.
- Form success: clear green check + short sentence.

### Performance Rule

No motion should delay a tech from tapping a workflow. If the animation costs clarity, remove it.

## Agency-Built Polish List

These are the changes that would make the site feel more custom and less assembled:

1. Reduce homepage content by 35-45%.
2. Add one real app screenshot/phone mockup above the fold or immediately after it.
3. Replace the six hero proof cards with a tighter three-step proof rail.
4. Convert press line into a compact "Published by" proof strip with AQUA/AQUA/PoolPro.
5. Make Closing Season Mode a bold seasonal chapter, not just another band.
6. Use fewer rounded pills and more structured proof modules.
7. Standardize section rhythm: dark photo, white product section, light proof band, dark seasonal band, pricing.
8. Make mobile CTAs larger but fewer.
9. Add a footer coverage block.
10. Make PartSnap visually own the homepage.

## AI Build Prompt Sequence

Use this prompt sequence if another model is asked to implement the redesign without manual coding.

### Prompt 1 - Inspect First

Inspect the existing SplashLens site in `C:\Users\sales\Dropbox\Projects\poolens-site`. Read `index.html`, `closing-season.html`, `splashlens-nav.js`, `_headers`, `sitemap.xml`, `ai.txt`, `llms.txt`, and `tests/site-link-regression.test.mjs`. Do not edit yet. Report the current homepage structure, linked public pages, CTA routes, analytics attributes, and any existing design system CSS.

### Prompt 2 - Define The Homepage System

Create a focused homepage design system that keeps the current brand but makes it more premium. Define typography scale, color tokens, button styles, proof rail, phone mockup component, press strip, seasonal band, pricing cards, FAQ cards, and footer coverage block. Preserve all existing live routes and analytics attributes.

### Prompt 3 - Rebuild The Hero

Refactor only the homepage hero. Keep `Get off the pad faster.` as the H1. Use the current pool-pad photo. Reduce hero CTAs to Identify a Part, Save Visit Proof, and app store badges. Convert the press line into a compact published-by strip. Move the six proof cards below the first viewport or replace them with a three-step proof rail. Verify desktop 1440px and mobile 390px screenshots.

### Prompt 4 - Product Story Compression

Compress the homepage body into the flow: PartSnap, Closing Season Mode, Service Proof, Facility Assist, Pricing, FAQ, Footer. Move excessive tool detail behind existing tool pages. Ensure all copy stays reference-only and does not imply diagnosis, warranty, fitment, endorsement, or manufacturer approval.

### Prompt 5 - Add Product Screenshots

Add two or three real app screenshots using existing assets in `product-screenshots/`. Use responsive phone mockups. Do not use fake UI. Optimize image sizes and include width, height, lazy loading, and alt text.

### Prompt 6 - Motion Polish

Add a small motion system: visible-by-default content, subtle load choreography, 150-180ms scroll reveal, CTA hover states, and reduced-motion support. Do not create blank scroll states. Do not add heavy parallax on mobile.

### Prompt 7 - Accessibility And SEO

Check heading order, alt text, focus states, contrast, tap targets, canonical tags, Open Graph, schema, sitemap, `ai.txt`, and `llms.txt`. Add the new AQUA Closing Season article only as coverage, not endorsement.

### Prompt 8 - Regression Tests

Run:

```powershell
node --check tools\qa-live-ui-audit.mjs
node tools\qa-live-ui-audit.mjs
node --test tests\activation-funnel-bridge.test.mjs tests\amplitude-forwarding.test.mjs tests\field-proof-pilot.test.mjs tests\site-link-regression.test.mjs
```

Fix failures before reporting.

### Prompt 9 - Visual QA

Capture desktop and mobile screenshots for homepage, closing-season page, PartSnap page, Service Proof page, and app front door. Check for overflow, clipped text, overlong buttons, hidden CTAs, console errors, and broken network requests.

### Prompt 10 - Deploy Gate

Commit only the intended site files. Deploy to Cloudflare Pages production. Smoke `https://splashlens.com`, `https://splashlens.com/closing-season.html`, `https://splashlens.com/whats-new.html`, and `https://app.splashlens.com`. Confirm the new proof links, CTAs, and app routes return 200.

## Final Smoothness And Launch Audit

| Category | Grade | Notes |
|---|---|---|
| First impression | A- | Strong headline, real photo, clear value. Needs fewer first-screen elements. |
| Brand distinction | B+ | Field-specific and credible. Needs more custom product imagery. |
| Typography | B+ | Bold and readable. Card hierarchy should be calmer. |
| Color | B+ | Strong blue identity. Needs more accent discipline and less blue repetition. |
| Layout | B | Useful but still long. Needs tighter storytelling. |
| Motion | B | No visible breakage, but not yet signature/premium. |
| Mobile UX | A- | Clear hero and no overflow. Reduce press/app/CTA competition. |
| App workflow clarity | A- | Persona wizard is smart. Visual polish can rise. |
| Conversion | B | Many CTAs, but strong jobs-to-be-done. Needs a cleaner hierarchy. |
| Social proof | A | AQUA twice plus PoolPro is a strong trust asset when framed correctly. |
| SEO/AEO | A- | Crawlable, current, conservative. Keep updating What's New. |
| Accessibility | B+ | No obvious overflow or contrast failure in checked screens. Needs formal contrast pass after visual edits. |
| Performance | B | Technical checks are clean, but homepage length and asset density should be reduced. |
| Browser compatibility | B+ | Chromium checks passed. Needs Safari/iOS visual pass on Mac. |
| Launch readiness | A- | Safe to market now. Premium redesign would increase conversion and perceived value. |

## Recommended Execution Order

1. **Hero compression and proof strip**: highest impact on first impression.
2. **PartSnap phone mockup**: makes the product real immediately.
3. **Homepage content cut**: reduce scroll and decision fatigue.
4. **Closing Season seasonal chapter**: use the fresh AQUA article while it is timely.
5. **Pricing simplification**: keep free core and paid proof lanes plain.
6. **Motion pass**: add subtle premium smoothness after the structure is fixed.
7. **Mac Safari/iOS visual pass**: verify no mobile browser-specific issues before the next big announcement.

## Pass / Fail

Current site: **Pass for live marketing.**

Premium studio standard: **Not fully there yet.**

The site is credible and functional today. To make it feel undeniably agency-built, the next move is not adding more features. It is editing, visual proof, and motion restraint.
