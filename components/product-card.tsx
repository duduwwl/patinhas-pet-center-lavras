"use client";
import Link from "next/link";
import { Heart, PackageOpen, Plus, MessageCircle } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return <article className="product-card reveal"><div className="product-visual" style={{ "--swatch": product.color } as React.CSSProperties}>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="favorite-button" aria-label={`Favoritar ${product.name}`}><Heart /></button><Link href={`/produto/${product.slug}`} className="product-placeholder"><span><PackageOpen /><small>Foto a confirmar</small></span></Link></div><div className="product-info"><small>{product.brand}</small><Link href={`/produto/${product.slug}`}><h3>{product.name}</h3></Link><div className="product-price"><div><strong>{formatPrice(product.price)}</strong><span>{product.price === null ? " pelo WhatsApp" : " ou PIX quando configurado"}</span></div><button className="add-button" onClick={() => add(product)} aria-label={product.price === null ? `Consultar ${product.name}` : `Adicionar ${product.name} ao carrinho`}>{product.price === null ? <MessageCircle /> : <Plus />}</button></div></div></article>;
}
