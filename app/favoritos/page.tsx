import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritesPage() {
  return <main>
    <section className="page-hero favorites-hero"><div className="shell"><span className="eyebrow">Sua seleção</span><h1>Favoritos</h1><p>Produtos que você guardou para consultar quando quiser.</p></div></section>
    <section className="section"><div className="shell"><FavoritesList /></div></section>
  </main>;
}
