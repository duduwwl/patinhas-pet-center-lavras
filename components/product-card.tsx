"use client";
import Link from "next/link";
import { Heart, Plus, MessageCircle } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
import { useFavorites } from "@/components/favorites-provider";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useFavorites();
  const favorite = has(product.id);
  const visualStyle = { "--swatch": product.color, "--image-position": product.imagePosition, "--image-sheet": `url("${product.imageSheet ?? "/images/catalog-products-sprite-v2.png"}")` } as React.CSSProperties;
  return <article className="product-card reveal"><div className="product-visual" style={visualStyle}>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button${favorite ? " is-favorite" : ""}`} onClick={() => toggle(product.id)} aria-label={`${favorite ? "Remover" : "Adicionar"} ${product.name} ${favorite ? "dos" : "aos"} favoritos`} aria-pressed={favorite}><Heart fill={favorite ? "currentColor" : "none"} /></button><Link href={`/produto/${product.slug}`} className="product-photo-link" aria-label={`Ver detalhes de ${product.name}`}><span className="product-photo" role="img" aria-label={product.imageAlt} /></Link></div><div className="product-info"><small>{product.brand} · {product.category}</small><Link href={`/produto/${product.slug}`}><h3>{product.name}</h3></Link>{product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}<div className="product-price"><div><strong>{formatPrice(product.price)}</strong><span>{product.stock ? `${product.stock} em estoque` : "Consulte disponibilidade"}</span></div><button className="add-button" onClick={() => add(product)} aria-label={product.price === null ? `Consultar ${product.name}` : `Adicionar ${product.name} ao carrinho`}>{product.price === null ? <MessageCircle /> : <Plus />}</button></div></div></article>;
}
