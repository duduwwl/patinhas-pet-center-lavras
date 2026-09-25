"use client";
import Link from "next/link";
import { Heart, Plus, MessageCircle } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const visualStyle = { "--swatch": product.color, "--image-position": product.imagePosition } as React.CSSProperties;
  return <article className="product-card reveal"><div className="product-visual" style={visualStyle}>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="favorite-button" aria-label={`Favoritar ${product.name}`}><Heart /></button><Link href={`/produto/${product.slug}`} className="product-photo-link" aria-label={`Ver detalhes de ${product.name}`}><span className="product-photo" role="img" aria-label={product.imageAlt} /></Link></div><div className="product-info"><small>{product.brand} · {product.category}</small><Link href={`/produto/${product.slug}`}><h3>{product.name}</h3></Link>{product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}<div className="product-price"><div><strong>{formatPrice(product.price)}</strong><span>{product.stock ? `${product.stock} em estoque` : "Consulte disponibilidade"}</span></div><button className="add-button" onClick={() => add(product)} aria-label={product.price === null ? `Consultar ${product.name}` : `Adicionar ${product.name} ao carrinho`}>{product.price === null ? <MessageCircle /> : <Plus />}</button></div></div></article>;
}
