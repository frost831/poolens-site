# SplashLens Heal Report

Generated: 2026-10-02 09:46:46 -05:00

Result: PASS

| Surface | Check | Result | Evidence |
|---|---|---|---|
| Marketing | homepage HTTP 200 | pass | https://splashlens.com/?heal=1790952406 returned 200, expected 200 |
| App | app shell HTTP 200 | pass | https://app.splashlens.com/?heal=1790952406 returned 200, expected 200 |
| Marketing | /pricing routes to the pricing section | pass | status=302; location=/?heal=1790952406#pricing |
| Marketing | /signup returns 404 | pass | https://splashlens.com/signup?heal=1790952406 returned 404, expected 404 |
| Marketing | internal docs are blocked | pass | https://splashlens.com/docs/outreach/splashlens-drip-queue.csv?heal=1790952406 returned 404, expected 404 |
| Payments | monthly checkout redirects | pass | status=302; mode=stripe_checkout_session; location=https://checkout.stripe.com/c/pay/cs_live_b1ZVTObdQToWu0Vull07VG2yAfa5OMN0sEeCltVv1RUZTKUiLNsDA96XyB#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicyc%2FNSknZHVsTmB8Jz8ndW5aaWxzYFowNFFPNzZxNzBjdElwazNmU3ZmaHQwbUQzPEB%2FZGAyd2NPcVdmSUZjczNTQ31zbEFgckFRN1NsXUtGSldMPUZxRmZKMTBvbUJNSE88azJib3BpcGRBXU1EfDU1b0NkMEl2PXwnKSdjd2poVmB3c2B3Jz9xd3BgKSdnZGZuYndqcGthRmppancnPycmY2NjY2NjJyknaWR8anBxUXx1YCc%2FJ2hwaXFsWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl |
| Payments | yearly checkout redirects | pass | status=302; mode=stripe_checkout_session; location=https://checkout.stripe.com/c/pay/cs_live_b1jJX0iETcaWplacvW4qbHBGthorKxGrOqk9XBYUks5O8ozLqj6O85610w#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicyc%2FNSknZHVsTmB8Jz8ndW5aaWxzYFowNFFPNzZxNzBjdElwazNmU3ZmaHQwbUQzPEB%2FZGAyd2NPcVdmSUZjczNTQ31zbEFgckFRN1NsXUtGSldMPUZxRmZKMTBvbUJNSE88azJib3BpcGRBXU1EfDU1b0NkMEl2PXwnKSdjd2poVmB3c2B3Jz9xd3BgKSdnZGZuYndqcGthRmppancnPycmY2NjY2NjJyknaWR8anBxUXx1YCc%2FJ2hwaXFsWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl |
| Payments | restore endpoint rejects GET | pass | GET returned 405 |
| SEO | sitemap readable XML | pass | https://splashlens.com/sitemap.xml length=65949 |
| SEO | sitemap readable XML | pass | https://splashlens.com/pseo-sitemap.xml length=42134 |
| SEO | sitemap readable XML | pass | https://splashlens.com/seo-hub-sitemap.xml length=3351 |
| SEO | sitemap readable XML | pass | https://splashlens.com/category-hub-sitemap.xml length=1427 |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/?heal=1790952406 hits= |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/partsnap.html?heal=1790952406 hits= |
| Trust copy | no internal or fake-scenario phrase leak | pass | https://splashlens.com/partners.html?heal=1790952406 hits= |
| Trust copy | PoolPro proof above fold copy exists | pass | homepage PoolPro proof strip |
| Trust copy | live Pro pricing is consistent | pass | homepage free and Pro pricing |
| SEO | OG image uses SplashLens asset | pass | og/screenshot asset |
| App restore | restore UI shipped | pass | app.js restore strings |
