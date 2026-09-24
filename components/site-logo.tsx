import Link from "next/link";
import { PawPrint } from "lucide-react";
export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="group flex items-center gap-2.5" aria-label="Patinhas Pet Center — início"><span className="grid size-11 place-items-center rounded-full border-2 border-[#f3b91f] bg-[#1b1a1d] text-[#f3b91f] shadow-[0_5px_0_#7d1732] transition-transform group-hover:-rotate-6"><PawPrint className="size-6" strokeWidth={2.4} /></span>{!compact && <span className="leading-none"><strong className="block font-serif text-[1.32rem] font-black tracking-[-.04em] text-[#8b1937]">Patinhas</strong><span className="mt-1 block text-[.67rem] font-bold uppercase tracking-[.19em] text-[#2c292d]">Pet Center</span></span>}</Link>;
}
