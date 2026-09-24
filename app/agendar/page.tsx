import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
export const metadata: Metadata = { title: "Agendar Banho e Tosa", description: "Escolha pet, serviço, data e horário para solicitar seu agendamento na Patinhas Pet Center." };
export default function BookingPage() { return <main><section className="page-hero"><div className="shell"><span className="eyebrow">Agendamento online</span><h1>Um horário só para o seu pet.</h1><p>Preencha os dados em poucos passos. No final, você recebe um resumo pronto para confirmar diretamente com a equipe.</p></div></section><section className="section"><div className="shell"><BookingForm /></div></section></main>; }
