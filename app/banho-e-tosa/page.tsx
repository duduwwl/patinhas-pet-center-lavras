import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bath, CalendarCheck, CheckCircle2, MessageCircle, Scissors, Sparkles } from "lucide-react";
import { services } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Banho e Tosa",
  description: "Banho, tosa e cuidado completo com agendamento online na Patinhas Pet Center.",
};

export default function GroomingPage() {
  const icons = [Bath, Scissors, Sparkles];

  return <main>
    <section className="section-dark grooming-hero">
      <div className="shell image-split py-20">
        <div className="service-copy">
          <span className="eyebrow text-[#f3b91f]">Banho &amp; Tosa</span>
          <h1>Porque cuidado também se sente.</h1>
          <p className="!text-white/60">Atendimento com atenção ao perfil, porte e pelagem do pet. Serviços e valores finais são confirmados pela equipe.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-gold btn-lg">Agendar agora <ArrowRight /></Link>
          </div>
        </div>
        <div className="image-frame aspect-[1.1]">
          <Image src="/images/hero-patinhas.png" alt="Cachorro e gato bem cuidados na Patinhas Pet Center" fill sizes="50vw" className="!object-[68%_center]" />
        </div>
      </div>
    </section>
    <section className="section">
      <div className="shell">
        <div className="section-heading">
          <div><span className="eyebrow">Serviços confirmados</span><h2>Escolha o cuidado</h2></div>
          <p>Os serviços abaixo foram confirmados nas informações enviadas. Itens adicionais ficam disponíveis somente após validação da empresa.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index];
            return <article className="form-card" key={service.id}>
              <span className="category-icon"><Icon /></span>
              <h3 className="mt-6 font-serif text-3xl font-bold">{service.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6f6865]">{service.description}</p>
              <div className="mt-5 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-[#8b1937]" />Duração aproximada: {service.duration} min</div>
              <div className="mt-2 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-[#8b1937]" />Preço conforme porte e pelagem</div>
              <Link href={`/agendar?servico=${service.id}`} className="btn btn-outline mt-7 w-full">Selecionar serviço</Link>
            </article>;
          })}
        </div>
      </div>
    </section>
    <section className="section section-soft">
      <div className="shell">
        <div className="section-heading"><div><span className="eyebrow">Como funciona</span><h2>Do agendamento ao rabinho feliz</h2></div></div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="contact-card"><CalendarCheck /><h3 className="mt-5 font-bold">1. Agende online</h3><p className="mt-2 text-sm text-[#6f6865]">Informe pet, serviço, data e horário.</p></div>
          <div className="contact-card"><MessageCircle /><h3 className="mt-5 font-bold">2. Confirme no WhatsApp</h3><p className="mt-2 text-sm text-[#6f6865]">A equipe valida disponibilidade e valor.</p></div>
          <div className="contact-card"><Sparkles /><h3 className="mt-5 font-bold">3. Cuidado na Patinhas</h3><p className="mt-2 text-sm text-[#6f6865]">Traga o pet no horário combinado.</p></div>
        </div>
      </div>
    </section>
  </main>;
}
