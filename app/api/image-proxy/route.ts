import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow Instagram/Facebook CDN URLs
  const allowed = ["fbcdn.net", "cdninstagram.com", "instagram.com"];
  const isAllowed = allowed.some((domain) => url.includes(domain));
  if (!isAllowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Spoof a browser referer so the CDN doesn't reject the request
        Referer: "https://www.instagram.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // Don't follow redirects automatically — stream it straight back
      redirect: "follow",
    });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 24 hours on CDN / 1 hour in browser
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("[Image Proxy] Error:", err);
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
