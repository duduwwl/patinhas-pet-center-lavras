import type { Metadata } from "next";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { AdminDashboard } from "@/components/admin-dashboard";
export const metadata: Metadata = { title: "Painel administrativo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage() { const user = await requireChatGPTUser("/admin"); return <main><section className="page-hero"><div className="shell"><span className="eyebrow">Área protegida</span><h1>Gestão Patinhas</h1><p>Produtos, pedidos, serviços, agendamentos e disponibilidade em um único painel.</p></div></section><section className="section"><div className="shell"><AdminDashboard userEmail={user.email} /></div></section></main>; }
