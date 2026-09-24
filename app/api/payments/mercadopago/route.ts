import { env } from "cloudflare:workers";
import { z } from "zod";
export const dynamic = "force-dynamic";
const schema = z.object({ orderId: z.string().uuid(), payerEmail: z.string().email(), paymentMethodId: z.string().default("pix"), token: z.string().optional(), installments: z.number().int().min(1).max(12).optional() });
export async function POST(request: Request) {
  try {
    const token = (env as unknown as Record<string, string>).MERCADO_PAGO_ACCESS_TOKEN; if (!token) return Response.json({ error: "Gateway em modo sandbox: configure MERCADO_PAGO_ACCESS_TOKEN no ambiente do Site." }, { status: 503 });
    const input = schema.parse(await request.json()); const order = await env.DB.prepare("SELECT id, order_number as orderNumber, total_cents as totalCents, status FROM orders WHERE id = ?").bind(input.orderId).first<{ id: string; orderNumber: string; totalCents: number; status: string }>(); if (!order || order.status !== "pending_payment") return Response.json({ error: "Pedido inválido ou já processado." }, { status: 409 });
    const idempotencyKey = `patinhas:${order.id}:payment-v1`; const response = await fetch("https://api.mercadopago.com/v1/payments", { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "x-idempotency-key": idempotencyKey }, body: JSON.stringify({ transaction_amount: order.totalCents / 100, description: `Pedido ${order.orderNumber} — Patinhas Pet Center`, payment_method_id: input.paymentMethodId, token: input.token, installments: input.installments ?? 1, payer: { email: input.payerEmail }, external_reference: order.id, notification_url: (env as unknown as Record<string, string>).MERCADO_PAGO_WEBHOOK_URL }) });
    const payment = await response.json() as { id?: number; status?: string; status_detail?: string }; if (!response.ok || !payment.id) return Response.json({ error: "Pagamento não autorizado pelo provedor.", detail: payment.status_detail }, { status: 402 });
    await env.DB.prepare("INSERT INTO payments (id, order_id, provider, provider_payment_id, idempotency_key, status, amount_cents, raw_status) VALUES (?, ?, 'mercadopago', ?, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO UPDATE SET provider_payment_id = excluded.provider_payment_id, status = excluded.status, raw_status = excluded.raw_status").bind(crypto.randomUUID(), order.id, String(payment.id), idempotencyKey, payment.status ?? "pending", order.totalCents, payment.status_detail ?? null).run();
    return Response.json({ providerPaymentId: payment.id, status: payment.status });
  } catch { return Response.json({ error: "Não foi possível iniciar o pagamento." }, { status: 400 }); }
}
