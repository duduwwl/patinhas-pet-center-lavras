import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { products } from "@/lib/catalog";
export const metadata: Metadata = { title: "Loja", description: "Catálogo de produtos para cães, gatos e outros pets da Patinhas Pet Center." };
export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <main><section className="page-hero shop-hero"><div className="shell"><span className="eyebrow">Loja Patinhas</span><h1>Um catálogo para cada patinha.</h1><p>Alimentação, higiene, passeio, brinquedos e cuidados para cães, gatos e outros pets — organizados para você encontrar tudo com facilidade.</p><div className="catalog-stats"><span><strong>{products.length}</strong> produtos</span><span><strong>{new Set(products.map((product) => product.category)).size}</strong> categorias</span><span><strong>{new Set(products.map((product) => product.animal)).size}</strong> tipos de pet</span></div></div></section><section className="section"><div className="shell"><p className="notice mb-7">Catálogo demonstrativo com imagens ilustrativas. Confirme marca, variação, preço e estoque com a equipe antes da compra.</p><ShopCatalog initialQuery={typeof params.q === "string" ? params.q : ""} initialAnimal={typeof params.animal === "string" ? params.animal : ""} onlyOffers={params.promocao === "1"} /></div></section></main>;
}
