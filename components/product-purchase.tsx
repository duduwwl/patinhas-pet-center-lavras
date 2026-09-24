"use client";
import { useState } from "react";
import { MessageCircle, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/catalog";
export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1); const { add } = useCart();
  const addQuantity = async () => { for (let index = 0; index < quantity; index += 1) await add(product); };
  if (product.price === null) return <div className="mt-7"><a className="btn btn-primary btn-lg w-full" href={`https://wa.me/5535988427974?text=${encodeURIComponent(`Olá! Gostaria de saber preço, variações e estoque de ${product.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle />Consultar no WhatsApp</a></div>;
  return <div className="mt-7"><div className="mb-4 flex items-center gap-4"><span className="text-sm font-bold">Quantidade</span><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade"><Minus /></button><strong>{quantity}</strong><button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade"><Plus /></button></div></div><div className="grid gap-3 sm:grid-cols-2"><button className="btn btn-primary btn-lg" onClick={addQuantity}><ShoppingBag />Adicionar ao carrinho</button><a className="btn btn-gold btn-lg" href="/checkout"><Zap />Comprar agora</a></div></div>;
}
