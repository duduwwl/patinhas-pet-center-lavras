import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart-page";
export const metadata: Metadata = { title: "Carrinho" };
export default function CartPage() { return <main><section className="page-hero"><div className="shell"><span className="eyebrow">Sua sacola</span><h1>Carrinho</h1><p>Revise quantidades e siga para uma compra segura.</p></div></section><section className="section"><div className="shell"><CartPageClient /></div></section></main>; }
