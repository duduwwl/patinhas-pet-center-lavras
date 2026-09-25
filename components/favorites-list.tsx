"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useFavorites } from "@/components/favorites-provider";
import { products } from "@/lib/catalog";

export function FavoritesList() {
  const { ids } = useFavorites();
  const favorites = products.filter((product) => ids.includes(product.id));

  if (!favorites.length) return <div className="empty-state">
    <Heart className="mx-auto mb-4 size-9 text-[#8b1937]" />
    <h2>Nenhum favorito ainda</h2>
    <p className="mt-2 text-sm text-[#766f6d]">Toque no coração de um produto para guardá-lo aqui neste dispositivo.</p>
    <Link href="/loja" className="btn btn-primary mt-5">Explorar a loja</Link>
  </div>;

  return <div className="product-grid">{favorites.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
