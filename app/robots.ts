import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/pay/"],
    },
    sitemap: "https://wheelo.fit/sitemap.xml",
  };
}
