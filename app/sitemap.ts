import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
const base = "https://patinhas-pet-center-lavras.nifty-gull-0625.chatgpt.site";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/loja", "/banho-e-tosa", "/agendar", "/contato", "/sobre", "/institucional/faq", "/institucional/privacidade", "/institucional/termos", "/institucional/trocas", "/institucional/entrega"]; return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : .7 })), ...products.map((product) => ({ url: `${base}/produto/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .6 }))]; }
