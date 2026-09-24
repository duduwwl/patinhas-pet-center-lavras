import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
export const metadata: Metadata = { title: "Checkout" };
export default function CheckoutPage() { return <main><section className="page-hero"><div className="shell"><span className="eyebrow">Compra segura</span><h1>Finalizar pedido</h1><p>Identificação, endereço, entrega, pagamento e revisão em um fluxo claro.</p></div></section><section className="section"><div className="shell"><CheckoutForm /></div></section></main>; }
