// scripts/scrape-instagram.js
// Run locally via `npm run sync-reels` to bypass Instagram's cloud blocking.
// It scrapes your reels using your home internet and pushes them straight to MongoDB.

import "dotenv/config";
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const INSTAGRAM_USERNAME = "wheelo.fit";

function parseNode(node) {
  if (!node) return null;

  const isReel =
    node.__typename === "GraphVideo" ||
    node.__typename === "XDTGraphVideo" ||
    node.is_video === true ||
    node.media_type === 2 ||
    node.product_type === "clips";

  if (!isReel) return null;

  const shortcode =
    node.shortcode || node.code || (node.pk ? String(node.pk) : null);
  if (!shortcode) return null;

  const image =
    node.thumbnail_src ||
    node.display_url ||
    node.cover_frame_url ||
    node.image_versions2?.candidates?.[0]?.url ||
    node.thumbnail_resources?.[node.thumbnail_resources?.length - 1]?.src ||
    "";

  if (!image) return null;

  const likes =
    node.edge_liked_by?.count ??
    node.edge_media_preview_like?.count ??
    node.like_count ??
    0;

  const comments =
    node.edge_media_to_comment?.count ??
    node.comments_count ??
    node.comment_count ??
    0;

  const caption =
    node.edge_media_to_caption?.edges?.[0]?.node?.text ||
    node.caption?.text ||
    "";

  const takenAt = node.taken_at_timestamp || node.taken_at;
  const timestamp = takenAt ? new Date(takenAt * 1000).toISOString() : "";

  return {
    id: shortcode,
    image,
    link: `https://www.instagram.com/reel/${shortcode}/`,
    likes,
    comments,
    caption,
    timestamp,
  };
}

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
    headless: false,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
  });

  const page =
    browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();
  const reels = [];

  page.on("response", async (response) => {
    const url = response.url();
    const ct = response.headers()["content-type"] || "";
    if (
      !url.includes("instagram.com") ||
      !ct.includes("json") ||
      url.includes("/static/")
    )
      return;

    try {
      const json = await response.json();
      const edges =
        json?.data?.user?.edge_owner_to_timeline_media?.edges ||
        json?.data?.xdt_api__v1__feed__user_timeline_graphql_connection
          ?.edges ||
        json?.graphql?.user?.edge_owner_to_timeline_media?.edges ||
        [];

      const clipEdges =
        json?.data?.xdt_api__v1__clips__user__connection_v2?.edges ||
        json?.items?.map((i) => ({ node: i?.media || i })) ||
        [];

      for (const edge of [...edges, ...clipEdges]) {
        const p = parseNode(edge?.node || edge?.media);
        if (p) reels.push(p);
      }
    } catch {
      /* ignore */
    }
  });

  console.log(`[Scraper] Navigating to Instagram...`);
  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/reels/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log(`[Scraper] Waiting 15 seconds to collect data...`);
  console.log(
    `[Scraper] IF YOU SEE A LOGIN SCREEN, PLEASE LOG IN NOW. Your session will be saved for next time!`,
  );
  await page.waitForTimeout(15000);

  if (reels.length === 0) {
    console.log(
      `[Scraper] Attempting to load main profile page as fallback...`,
    );
    await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(10000);
  }

  await browser.close();

  const seen = new Set();
  const unique = reels.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
