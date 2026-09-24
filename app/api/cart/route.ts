import { env } from "cloudflare:workers";
import { z } from "zod";
import { products } from "@/lib/catalog";
export const dynamic = "force-dynamic";
const itemSchema = z.object({ productId: z.string().min(1), quantity: z.number().int().min(0).max(99) });
function userKey(request: Request) { return request.headers.get("oai-authenticated-user-id") ?? "local-preview"; }
async function cartId(request: Request) {
  if (!env.DB) throw new Error("DB unavailable"); const id = `cart:${userKey(request)}`;
  await env.DB.prepare("INSERT OR IGNORE INTO carts (id, user_id, status) VALUES (?, ?, 'active')").bind(id, userKey(request)).run(); return id;
}
async function readItems(id: string) { const result = await env.DB.prepare("SELECT product_id as productId, quantity FROM cart_items WHERE cart_id = ? ORDER BY id").bind(id).all<{ productId: string; quantity: number }>(); return result.results ?? []; }
export async function GET(request: Request) { try { const id = await cartId(request); return Response.json({ items: await readItems(id) }); } catch { return Response.json({ items: [], unavailable: true }); } }
export async function POST(request: Request) {
  try { const body = itemSchema.parse(await request.json()); const product = products.find((item) => item.id === body.productId); if (!product || product.price === null) return Response.json({ error: "Produto indisponível para compra direta" }, { status: 400 }); const id = await cartId(request);
    if (body.quantity === 0) await env.DB.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?").bind(id, body.productId).run();
    else await env.DB.prepare("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(cart_id, product_id) DO UPDATE SET quantity = excluded.quantity").bind(id, body.productId, body.quantity).run();
    return Response.json({ items: await readItems(id) });
  } catch { return Response.json({ error: "Dados inválidos" }, { status: 400 }); }
}
export async function DELETE(request: Request) { try { const id = await cartId(request); await env.DB.prepare("DELETE FROM cart_items WHERE cart_id = ?").bind(id).run(); return Response.json({ items: [] }); } catch { return Response.json({ error: "Carrinho indisponível" }, { status: 503 }); } }
