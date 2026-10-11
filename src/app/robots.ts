import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  const { indexable, origin } = config();
  // Allow crawling so robots can read noindex; don't hide noindex behind Disallow.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/autogestion/"] },
    ...(indexable ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
