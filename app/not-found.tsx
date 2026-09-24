import Link from "next/link";
import { PawPrint } from "lucide-react";
export default function NotFound() { return <main className="section"><div className="shell empty-state py-24"><PawPrint className="mx-auto size-14 text-[#8b1937]" /><span className="eyebrow mt-6">Erro 404</span><h1 className="mt-4 font-serif text-5xl font-bold">Essa patinha saiu do caminho.</h1><p className="mt-3 text-[#6f6865]">A página não existe ou foi movida.</p><Link className="btn btn-primary mt-7" href="/">Voltar ao início</Link></div></main>; }
