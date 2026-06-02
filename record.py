import asyncio
from playwright.async_api import async_playwright
import sys
import os
import random

async def record_website(url):
    os.makedirs("output/screenshots", exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1600, "height": 900},
            record_video_dir="output/"
        )
        page = await context.new_page()

        await page.goto(url)
        
        # Wait for loader to disappear
        await page.wait_for_selector("#loader.hide", timeout=15000)
        await page.wait_for_timeout(2000)

        # Click random painting
        cards = await page.locator(".p-card").all()
        random_card = cards[random.randint(0, len(cards) - 1)]
        await random_card.click()
        
        # Wait for viewer
        await page.wait_for_selector("#viewer.open", timeout=10000)
        await page.wait_for_timeout(1500)

        # Auto-rotate
        await page.click("button:has-text('Auto')")
        await page.wait_for_timeout(5000)

        # Side view
        await page.click("button:has-text('Side')")
        await page.wait_for_timeout(3000)

        # Cycle rollers
        for sw in await page.locator("#roller-sw .sw").all():
            await sw.click()
            await page.wait_for_timeout(1200)

        # Cycle silk
        for sw in await page.locator("#silk-sw .sw").all():
            await sw.click()
            await page.wait_for_timeout(1200)

        # Cycle sizes
        for btn in await page.locator("#size-row .sz-btn").all():
            await btn.click()
            await page.wait_for_timeout(1000)

        # Cycle environments
        for env in ["Night", "Studio", "Tatami", "Dawn"]:
            await page.click(f"button:has-text('{env}')")
            await page.wait_for_timeout(1500)

        # Adjust lights
        for val in [30, 50, 70, 90]:
            await page.locator("#light-sl").fill(str(val))
            await page.locator("#warm-sl").fill(str(100 - val))
            await page.wait_for_timeout(800)

        # Final views
        for view in ["Front", "Top"]:
            await page.click(f"button:has-text('{view}')")
            await page.wait_for_timeout(2000)

        # Close
        await page.click("#v-close")
        await page.wait_for_timeout(1000)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(record_website(sys.argv[1]))