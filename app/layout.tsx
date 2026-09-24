import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { MessageCircle } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patinhas-pet-center-lavras.nifty-gull-0625.chatgpt.site"),
  title: { default: "Patinhas Pet Center | Loja e Banho & Tosa em Lavras", template: "%s | Patinhas Pet Center" },
  description: "Produtos para cães, gatos e outros pets, farmácia pet e agendamento de banho e tosa em Lavras, MG.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: { index: true, follow: true },
  other: { "theme-color": "#17151a" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <a className="whatsapp-fab" href="https://wa.me/5535988427974?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20Patinhas." target="_blank" rel="noreferrer" aria-label="Falar com a Patinhas no WhatsApp"><MessageCircle /><span>Fale com a gente</span></a>
        </Providers>
      </body>
    </html>
  );
}
