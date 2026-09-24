"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { products, type Product } from "@/lib/catalog";
type CartItem = { productId: string; quantity: number };
type CartContextValue = { items: CartItem[]; count: number; subtotal: number; loading: boolean; add: (product: Product) => Promise<void>; update: (productId: string, quantity: number) => Promise<void>; remove: (productId: string) => Promise<void>; clear: () => Promise<void> };
const CartContext = createContext<CartContextValue | null>(null);
async function syncCart(method: string, body?: unknown) { const response = await fetch("/api/cart", { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined }); if (!response.ok) throw new Error("Não foi possível atualizar o carrinho"); return response.json(); }
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { syncCart("GET").then((data) => setItems(data.items ?? [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  const save = useCallback(async (next: CartItem[], body: unknown) => { const previous = items; setItems(next); try { const data = await syncCart("POST", body); setItems(data.items ?? next); } catch { setItems(previous); toast.error("Não foi possível salvar o carrinho. Tente novamente."); } }, [items]);
  const add = useCallback(async (product: Product) => {
    if (product.price === null) { window.open(`https://wa.me/5535988427974?text=${encodeURIComponent(`Olá! Gostaria de consultar o preço de ${product.name}.`)}`, "_blank"); return; }
    const current = items.find((item) => item.productId === product.id); const quantity = (current?.quantity ?? 0) + 1;
    const next = current ? items.map((item) => item.productId === product.id ? { ...item, quantity } : item) : [...items, { productId: product.id, quantity: 1 }];
    await save(next, { productId: product.id, quantity }); toast.success(`${product.name} foi adicionado ao carrinho.`);
  }, [items, save]);
  const update = useCallback(async (productId: string, quantity: number) => { const next = quantity <= 0 ? items.filter((item) => item.productId !== productId) : items.map((item) => item.productId === productId ? { ...item, quantity } : item); await save(next, { productId, quantity }); }, [items, save]);
  const remove = useCallback(async (productId: string) => update(productId, 0), [update]);
  const clear = useCallback(async () => { const previous = items; setItems([]); try { await syncCart("DELETE"); } catch { setItems(previous); toast.error("Não foi possível limpar o carrinho."); } }, [items]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool?: Function } }).modelContext; if (!context?.registerTool) return; const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({ name: "add_product_to_cart", title: "Adicionar produto ao carrinho", description: "Adiciona ao carrinho um produto disponível no catálogo da Patinhas Pet Center.", inputSchema: { type: "object", properties: { productId: { type: "string" } }, required: ["productId"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: async (input: { productId: string }) => { const product = products.find((item) => item.id === input.productId); if (!product || product.price === null) throw new Error("Produto indisponível para compra direta"); await add(product); return { productId: product.id, status: "added" }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [add]);
  const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.quantity, 0), subtotal: items.reduce((sum, item) => { const product = products.find((candidate) => candidate.id === item.productId); return sum + (product?.price ?? 0) * item.quantity; }, 0), loading, add, update, remove, clear }), [items, loading, add, update, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
