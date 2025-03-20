import { MetadataRoute } from "next";
import env from "../env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      disallow: ["/admin", "/api"],
      allow: ["/"],
    }],
    sitemap: `${env.endpoint?.base}/sitemap.xml`,
  };
}