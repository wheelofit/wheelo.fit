import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import type { InstagramReel } from "@prisma/client";

export interface Post {
  id: string;
  type: "reel";
  image: string;
  link: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

// In-memory cache (survives within a single serverless instance lifetime)
let cachedPosts: Post[] = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 0; // Disabled cache so it updates instantly after scrape

export async function GET() {
  const now = Date.now();

  // Serve from memory cache if still fresh
  if (cachedPosts.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json({ posts: cachedPosts, source: "cache" });
  }

  try {
    const reels = await prisma.instagramReel.findMany({
      orderBy: [{ timestamp: "desc" }],
      take: 4,
    });

    if (reels.length > 0) {
      cachedPosts = reels.map((r: InstagramReel) => ({
        id: r.id,
        type: "reel" as const,
        image: r.image,
        link: r.link,
        likes: r.likes,
        comments: r.comments,
        caption: r.caption,
        timestamp: r.timestamp,
      }));
      lastFetchTime = now;
      return NextResponse.json({ posts: cachedPosts, source: "db" });
    }

    // DB is empty - return in-memory stale cache or empty
    if (cachedPosts.length > 0) {
      return NextResponse.json({ posts: cachedPosts, source: "cache_stale" });
    }

    return NextResponse.json(
      { error: "No Instagram reels in database yet. Run the sync workflow." },
      { status: 404 },
    );
  } catch (err) {
    console.error("[Instagram API] DB error:", err);

    if (cachedPosts.length > 0) {
      return NextResponse.json({ posts: cachedPosts, source: "cache_stale" });
    }

    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
