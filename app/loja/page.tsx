import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
export const metadata: Metadata = { title: "Loja", description: "Catálogo de produtos para cães, gatos e outros pets da Patinhas Pet Center." };
export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <main><section className="page-hero"><div className="shell"><span className="eyebrow">Loja Patinhas</span><h1>Tudo para cuidar bem.</h1><p>Explore os produtos identificados nas referências da loja. Informações ainda não confirmadas aparecem como “Consulte” para evitar dados comerciais incorretos.</p></div></section><section className="section"><div className="shell"><ShopCatalog initialQuery={typeof params.q === "string" ? params.q : ""} initialAnimal={typeof params.animal === "string" ? params.animal : ""} onlyOffers={params.promocao === "1"} /></div></section></main>;
}
