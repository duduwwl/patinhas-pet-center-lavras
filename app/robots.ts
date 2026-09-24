import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/conta", "/checkout"] }, sitemap: "https://patinhas-pet-center-lavras.nifty-gull-0625.chatgpt.site/sitemap.xml" }; }
