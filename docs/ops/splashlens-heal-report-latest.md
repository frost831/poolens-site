# SplashLens Heal Report

Generated: 2026-07-13 08:02:22 -05:00

Result: PASS

| Surface | Check | Result | Evidence |
|---|---|---|---|
| Marketing | homepage HTTP 200 | pass | https://splashlens.com/?heal=1783947742 returned 200, expected 200 |
| App | app shell HTTP 200 | pass | https://app.splashlens.com/?heal=1783947742 returned 200, expected 200 |
| Marketing | /pricing returns 404 | pass | https://splashlens.com/pricing?heal=1783947742 returned 404, expected 404 |
| Marketing | /signup returns 404 | pass | https://splashlens.com/signup?heal=1783947742 returned 404, expected 404 |
| Marketing | internal docs are blocked | pass | https://splashlens.com/docs/outreach/splashlens-drip-queue.csv?heal=1783947742 returned 404, expected 404 |
| Payments | monthly checkout redirects | pass | status=302; mode=payment_link_direct; location=https://buy.stripe.com/7sY7sE2aIaq31cE5EF8AE0O |
| Payments | yearly checkout redirects | pass | status=302; mode=payment_link_direct; location=https://buy.stripe.com/aFa28k9Da69NdZq3wx8AE0P |
| Payments | restore endpoint is function JSON | pass | GET returned 200 |
| SEO | sitemap readable XML | pass | https://splashlens.com/sitemap.xml length=63154 |
| SEO | sitemap readable XML | pass | https://splashlens.com/pseo-sitemap.xml length=42134 |
| SEO | sitemap readable XML | pass | https://splashlens.com/seo-hub-sitemap.xml length=3213 |
| SEO | sitemap readable XML | pass | https://splashlens.com/category-hub-sitemap.xml length=1427 |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/?heal=1783947742 hits= |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/partsnap.html?heal=1783947742 hits= |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/partners.html?heal=1783947742 hits= |
| Trust copy | PoolPro proof above fold copy exists | pass | homepage PoolPro proof phrase |
| Trust copy | consistent pricing phrase exists | pass | homepage pricing phrase |
| SEO | OG image uses SplashLens asset | pass | og/screenshot asset |
| App restore | restore UI shipped | pass | app.js restore strings |
