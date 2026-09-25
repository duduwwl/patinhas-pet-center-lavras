import Link from "next/link";
import { categories } from "@/lib/catalog";

const visuals: Record<string, { emoji: string; tint: string; href: string }> = {
  Cachorros: { emoji: "🐶", tint: "#fff0c7", href: "/loja?animal=Cachorros" },
  Gatos: { emoji: "🐱", tint: "#fce2e5", href: "/loja?animal=Gatos" },
  Aves: { emoji: "🐦", tint: "#dff4f0", href: "/loja?categoria=Aves" },
  Roedores: { emoji: "🐹", tint: "#f5e5cf", href: "/loja?categoria=Roedores" },
  Peixes: { emoji: "🐠", tint: "#dfeefd", href: "/loja?categoria=Aquarismo" },
  "Farmácia pet": { emoji: "💊", tint: "#e6e4fa", href: "/loja?categoria=Farm%C3%A1cia%20pet" },
};

export function CategoryGrid() {
  return <div className="category-grid">{categories.map((category) => {
    const visual = visuals[category.name];
    return <Link href={visual.href} className="category-card" key={category.name}>
      <span className="category-emoji" style={{ background: visual.tint }} aria-hidden="true">{visual.emoji}</span>
      <h3>{category.name}</h3><p>{category.description}</p>
    </Link>;
  })}</div>;
}
