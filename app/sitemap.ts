import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://cavistore.pe";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/checkout", priority: 0.3 },
    { path: "/reclamaciones", priority: 0.4 },
    { path: "/legal/terminos", priority: 0.3 },
    { path: "/legal/privacidad", priority: 0.3 },
    { path: "/legal/envios", priority: 0.3 },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.path === "/" ? "daily" : "monthly",
    priority: r.priority,
  }));
}
