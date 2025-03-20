import { MetadataRoute } from "next";
import env from "../env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      disallow: ["/admin", "/api", "/_next", "/public", "/403"],
      allow: ["/"],
    }],
    sitemap: `${env.endpoint?.base}/sitemap.xml`,
  };
}