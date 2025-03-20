import env from "@/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${env.endpoint.base}/`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${env.endpoint.base}/about`,
      lastModified: new Date().toISOString(),
    },
  ]
}