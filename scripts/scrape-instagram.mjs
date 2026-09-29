import "dotenv/config";
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const INSTAGRAM_USERNAME = "wheelo.fit";

async function scrape() {
  const userDataDir = path.join(__dirname, "..", ".ig-session");

  console.log(`\n======================================================`);
  console.log(`[Scraper] ATTENTION: A browser window will now open.`);
  console.log(`[Scraper] PLEASE DO NOT CLOSE THE BROWSER WINDOW!`);
  console.log(`======================================================\n`);

  console.log(
    `[Scraper] Launching browser to scrape @${INSTAGRAM_USERNAME}...`,
  );
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: true, // Use headless for stability in automated run
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
  });

  const page =
    browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();

  console.log(`[Scraper] Navigating to Instagram...`);
  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log(`[Scraper] Waiting 15 seconds to collect data...`);
  await page.waitForTimeout(15000);

  const reels = await page.$$eval('a[href*="/reel/"]', (links) => {
    return links
      .map((a) => {
        const parts = a.href.split("/reel/");
        const shortcode = parts.length > 1 ? parts[1].replace("/", "") : null;
        const imgMatch = a.innerHTML.match(/src="([^"]+)"/);
        const src = imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : null;
        const altMatch = a.innerHTML.match(/alt="([^"]+)"/);
        const alt = altMatch ? altMatch[1] : "";
        return {
          id: shortcode,
          link: a.href,
          image: src,
          caption: alt.substring(0, 100), // Trim caption
          likes: 0,
          comments: 0,
          timestamp: new Date().toISOString(),
        };
      })
      .filter((r) => r.id && r.image);
  });

  await browser.close();

  const seen = new Set();
  const unique = reels.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  const top4 = unique.slice(0, 4);

  console.log(`[Scraper] Successfully found ${top4.length} latest reels.`);

  if (top4.length === 0) {
    console.error(
      "[Scraper] Failed to find reels. Make sure your internet is working.",
    );
    process.exit(1);
  }

  console.log(`[Scraper] Pushing reels to live MongoDB database...`);

  try {
    const ops = top4.map((r) => {
      const updateData = { ...r };
      delete updateData.id;
      return prisma.instagramReel.upsert({
        where: { id: r.id },
        create: r,
        update: updateData,
      });
    });

    await prisma.$transaction(ops);

    const incomingIds = top4.map((r) => r.id);
    await prisma.instagramReel.deleteMany({
      where: { id: { notIn: incomingIds } },
    });

    console.log(
      `[Scraper] ✅ Success! Your website is now updated with the latest reels.`,
    );
  } catch (err) {
    console.error("[Scraper] Database error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

scrape().catch((err) => {
  console.error("[Scraper] Fatal error:", err);
  process.exit(1);
});
