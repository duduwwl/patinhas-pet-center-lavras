import Link from "next/link";
import { Bird, Cat, Dog, Fish, HeartPulse, Rabbit } from "lucide-react";
import { categories } from "@/lib/catalog";
const icons = { dog: Dog, cat: Cat, bird: Bird, rabbit: Rabbit, fish: Fish, heart: HeartPulse };
export function CategoryGrid() {
  return <div className="category-grid">{categories.map((category) => { const Icon = icons[category.icon as keyof typeof icons]; return <Link href={`/loja?categoria=${encodeURIComponent(category.name)}`} className="category-card" key={category.name}><span className="category-icon"><Icon /></span><h3>{category.name}</h3><p>{category.description}</p></Link>; })}</div>;
}
