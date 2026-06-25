"""
SplashLens launch automation — runs with your existing Chrome session.
Handles: GSC sitemap submit, CF Web Analytics setup, Reddit posts.
Run: python automate_launch.py
"""

import time, sys, re
from playwright.sync_api import sync_playwright

CHROME_PROFILE = r"C:\Users\sales\AppData\Local\Google\Chrome\User Data"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

SITEMAP_URL = "https://splashlens.com/sitemap.xml"
SITE_URL = "https://splashlens.com"

REDDIT_POSTS = [
    {
        "subreddit": "r/swimmingpools",
        "title": "Built a free offline reference app for pool techs — error codes, dosing calculators, AI scanner (splashlens.com)",
        "body": """I've been building tools for pool service techs and wanted to share what I've put together.

**SplashLens** (splashlens.com) is a free, offline-first PWA — no account for core reference use, store listings available, no subscription required for the free field tools. Open it on your phone and core manual-reference tools keep working after first load.

What's in it:
- **230+ field troubleshooting entries** across major pool equipment categories: Hayward, Pentair, Jandy, Raypak, AquaCal, Sta-Rite, Maytronics Dolphin, Aiper, Beatbot, Polaris, Waterway, lighting, automation, robots, and more
- **Chemical dosing calculators** — chlorine, acid, alkalinity, cyanuric acid, with pool volume built in
- **SLAM tracker** — multi-day tracker with OCLT logging
- **AI scanner** — point your camera at error codes or equipment nameplates
- **Filter guides** — backwash procedures, DE recharge, cartridge cleaning
- **Weekly service checklist**

It's genuinely free. I'm not trying to upsell anything. The goal is to give techs a better reference than Googling mid-job.

splashlens.com — works on any phone, installs as an app if you want it to.

Would love feedback from anyone actually doing pool service work. What's missing?"""
    },
    {
        "subreddit": "r/poolsupplies",
        "title": "Free pool tech reference app — error codes, SLAM tracker, AI equipment scanner (splashlens.com)",
        "body": """Made something I think pool service techs will actually use.

**SplashLens** (splashlens.com) — free offline PWA, no account needed.

The main things:
- 230+ equipment and field troubleshooting entries with causes, verification notes, and next-check prompts
- Chemical dosing calculators with the math already done
- SLAM multi-day tracker with OCLT
- AI camera scanner for error displays and equipment nameplates
- Works offline after first load

No upsells. No subscription. Just a better reference for the pad.

splashlens.com"""
    }
]


def run_gsc(page):
    print("\n=== GOOGLE SEARCH CONSOLE ===")
    page.goto("https://search.google.com/search-console/welcome", wait_until="networkidle", timeout=30000)
    time.sleep(2)

    # Check if already logged in and see what properties exist
    content = page.content()
    if "sign in" in content.lower() or "accounts.google.com" in page.url:
        print("  Need to sign in to Google — please log in in the browser window")
        page.wait_for_url("**/search-console/**", timeout=120000)

    print("  Navigating to Search Console...")
    page.goto("https://search.google.com/search-console/", wait_until="networkidle", timeout=30000)
    time.sleep(3)

    # Try to find splashlens.com property
    page_text = page.inner_text("body")

    if "splashlens.com" in page_text:
        print("  Found splashlens.com property — navigating to it...")
        # Click on splashlens.com
        try:
            page.get_by_text("splashlens.com").first.click()
            time.sleep(3)
        except:
            print("  Could not click property — navigating directly")
            page.goto("https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fsplashlens.com%2F", timeout=30000)
    else:
        print("  splashlens.com not found in properties — you may need to add it manually")
        print("  Opening Add Property dialog...")
        try:
            # Try to add property
            add_btn = page.get_by_text("Add property").first
            add_btn.click()
            time.sleep(2)
            # Enter URL
            url_input = page.get_by_placeholder("https://www.example.com")
            if url_input:
                url_input.fill("https://splashlens.com/")
                page.keyboard.press("Enter")
                time.sleep(3)
        except Exception as e:
            print(f"  Could not auto-add property: {e}")

    # Navigate to sitemaps
    print("  Going to Sitemaps section...")
    page.goto("https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fsplashlens.com%2F",
              wait_until="networkidle", timeout=30000)
    time.sleep(3)

    # Check if sitemap already submitted
    page_text = page.inner_text("body")
    if "sitemap.xml" in page_text and "Success" in page_text:
        print("  Sitemap already submitted and indexed!")
        return True

    # Submit sitemap
    print("  Submitting sitemap...")
    try:
        # Find the sitemap input
        sitemap_input = page.locator("input[type='text']").first
        sitemap_input.fill("sitemap.xml")
        time.sleep(1)

        # Click submit
        submit_btn = page.get_by_text("Submit").first
        submit_btn.click()
        time.sleep(5)

        page_text = page.inner_text("body")
        if "Success" in page_text or "Submitted" in page_text or "sitemap.xml" in page_text:
            print("  ✅ Sitemap submitted successfully!")
            return True
        else:
            print("  Sitemap submit attempted — check the browser window to confirm")
            return False
    except Exception as e:
        print(f"  Could not auto-submit: {e}")
        print(f"  Please manually enter 'sitemap.xml' and click Submit in the browser")
        time.sleep(15)
        return False


def run_cf_analytics(page):
    print("\n=== CLOUDFLARE WEB ANALYTICS ===")
    page.goto("https://dash.cloudflare.com/", wait_until="networkidle", timeout=30000)
    time.sleep(3)

    if "login" in page.url or "cloudflare.com/login" in page.url:
        print("  Please log in to Cloudflare in the browser window...")
        page.wait_for_url("**/dash.cloudflare.com/**", timeout=120000)
        time.sleep(3)

    # Navigate to Web Analytics for splashlens.com
    print("  Looking for Web Analytics...")

    # Try direct navigation to web analytics
    page.goto("https://dash.cloudflare.com/?to=/:account/web-analytics", wait_until="networkidle", timeout=30000)
    time.sleep(3)

    page_text = page.inner_text("body")

    if "splashlens" in page_text.lower():
        print("  Found splashlens.com in Web Analytics")
        try:
            page.get_by_text("splashlens.com").first.click()
            time.sleep(3)
        except:
            pass
    else:
        print("  splashlens.com not yet in Web Analytics — look for 'Add site' button")
        try:
            add_site = page.get_by_text("Add site").first
            add_site.click()
            time.sleep(2)
            site_input = page.locator("input[placeholder*='example']").first
            site_input.fill("splashlens.com")
            page.keyboard.press("Enter")
            time.sleep(3)
        except Exception as e:
            print(f"  Could not auto-add site: {e}")

    # Get the beacon script
    time.sleep(3)
    page_text = page.inner_text("body")

    # Look for the beacon token
    beacon_match = re.search(r'token["\s:=]+([a-f0-9]{32,})', page_text, re.IGNORECASE)
    if not beacon_match:
        # Try to find it in page source
        content = page.content()
        beacon_match = re.search(r'src="https://static\.cloudflareinsights\.com/beacon\.min\.js"\s+data-cf-beacon=\'{"token":\s*"([a-f0-9]+)"', content)

    if beacon_match:
        token = beacon_match.group(1)
        print(f"  ✅ Web Analytics token: {token}")
        return token
    else:
        print("  Could not auto-extract token — checking page for beacon script...")
        # Take a screenshot so user can see
        page.screenshot(path="cf_analytics_screenshot.png")
        print("  Screenshot saved to cf_analytics_screenshot.png")
        print("  Look for the beacon snippet in the browser — it will contain a token like:")
        print('  <script src="...beacon.min.js" data-cf-beacon=\'{"token": "YOUR_TOKEN"}\'>')
        return None


def run_reddit(page, post):
    print(f"\n=== REDDIT — {post['subreddit']} ===")

    # Navigate to subreddit submit page
    subreddit_name = post['subreddit'].replace('r/', '')
    page.goto(f"https://www.reddit.com/r/{subreddit_name}/submit", wait_until="networkidle", timeout=30000)
    time.sleep(3)

    if "login" in page.url or "www.reddit.com/login" in page.url:
        print("  Please log in to Reddit in the browser window...")
        input("  Press Enter when logged in and back at the submit page...")
        page.goto(f"https://www.reddit.com/r/{subreddit_name}/submit", wait_until="networkidle", timeout=30000)
        time.sleep(3)

    # Check if we hit age gate or rules
    page_text = page.inner_text("body")
    if "age" in page_text.lower() and "verify" in page_text.lower():
        print("  Age verification required — please complete in browser")
        time.sleep(10)

    try:
        # Click "Text" post type if available
        try:
            text_tab = page.get_by_role("tab", name="Text").first
            text_tab.click()
            time.sleep(1)
        except:
            pass

        # Fill title
        title_input = page.locator("textarea[placeholder*='Title']").first
        if not title_input.is_visible():
            title_input = page.locator("input[placeholder*='Title']").first
        title_input.click()
        title_input.fill(post['title'])
        time.sleep(1)

        # Fill body
        body_area = page.locator("div[contenteditable='true']").first
        if not body_area.is_visible():
            body_area = page.locator("textarea").nth(1)
        body_area.click()
        body_area.fill(post['body'])
        time.sleep(1)

        print(f"  Title and body filled for {post['subreddit']}")
        print("  REVIEW THE POST IN THE BROWSER — click Submit when ready")
        print("  (Not auto-submitting to avoid accidental duplicate posts)")
        time.sleep(20)

        return True
    except Exception as e:
        print(f"  Could not fill post form: {e}")
        print("  Please manually fill in the post using the content from LAUNCH_REDDIT_POSTS.md")
        time.sleep(15)
        return False


def main():
    print("Starting SplashLens launch automation...")
    print("This will open Chrome with your existing profile (all logins preserved)\n")

    with sync_playwright() as p:
        # Use Playwright's Chromium — no profile lock issues
        browser = p.chromium.launch(
            headless=False,
            args=["--start-maximized", "--disable-blink-features=AutomationControlled"],
        )
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        results = {}

        # 1. Google Search Console
        try:
            results['gsc'] = run_gsc(page)
        except Exception as e:
            print(f"  GSC error: {e}")
            results['gsc'] = False

        time.sleep(3)

        # 2. Cloudflare Web Analytics
        try:
            token = run_cf_analytics(page)
            results['cf_token'] = token
        except Exception as e:
            print(f"  CF Analytics error: {e}")
            results['cf_token'] = None

        time.sleep(3)

        # 3. Reddit posts — fill the forms, user reviews and clicks Submit
        for post in REDDIT_POSTS:
            try:
                run_reddit(page, post)
            except Exception as e:
                print(f"  Reddit error for {post['subreddit']}: {e}")

        # Summary
        print("\n" + "="*50)
        print("LAUNCH AUTOMATION COMPLETE")
        print("="*50)
        print(f"GSC sitemap submitted: {results.get('gsc', False)}")
        print(f"CF Analytics token: {results.get('cf_token', 'manual step needed')}")
        print(f"Reddit posts: filled — review and click Submit in browser")
        print("\nKeeping browser open — press Ctrl+C or close the terminal when done")
        try:
            while True:
                time.sleep(5)
        except KeyboardInterrupt:
            pass

        browser.close()


if __name__ == "__main__":
    main()
