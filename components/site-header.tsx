"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, PersonStanding, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { SiteLogo } from "@/components/site-logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/components/cart-provider";
import { useFavorites } from "@/components/favorites-provider";
import { products } from "@/lib/catalog";

const nav = [
  ["Início", "/"], ["Loja", "/loja"], ["Cachorros", "/loja?animal=Cachorros"],
  ["Gatos", "/loja?animal=Gatos"], ["Outros pets", "/loja?animal=Outros%20pets"],
  ["Banho e Tosa", "/banho-e-tosa"], ["Ofertas", "/loja?promocao=1"], ["Contato", "/contato"],
] as const;

function SearchDialog() {
  const [query, setQuery] = useState("");
  const matches = products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  return <Dialog>
    <DialogTrigger asChild><button className="icon-button" aria-label="Buscar produtos"><Search /></button></DialogTrigger>
    <DialogContent className="overflow-hidden rounded-[1.75rem] border-0 p-0 sm:max-w-2xl">
      <DialogHeader className="border-b bg-[#f8f5ed] p-6"><DialogTitle>O que seu pet precisa?</DialogTitle><DialogDescription>Busque por produto, marca ou categoria.</DialogDescription></DialogHeader>
      <div className="p-5"><label className="search-field"><Search className="size-5" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: ração, Frontline, brinquedo..." /></label>
        <div className="mt-4 space-y-2">{(query ? matches : products.slice(0, 4)).map((product) => <Link key={product.id} href={`/produto/${product.slug}`} className="search-result"><span className="product-swatch" style={{ background: product.color }} /><span><strong>{product.name}</strong><small>{product.brand} · {product.category}</small></span><span aria-hidden>→</span></Link>)}</div>
      </div>
    </DialogContent>
  </Dialog>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { ids } = useFavorites();

  return <>
    <div className="announcement"><span>Entrega e retirada na loja</span><span>•</span><span>Desde 2015 cuidando de quem faz parte da família</span></div>
    <header className="site-header">
      <div className="header-main shell">
        <div className="lg:hidden"><Sheet><SheetTrigger asChild><button className="icon-button" aria-label="Abrir menu"><Menu /></button></SheetTrigger><SheetContent side="left" className="w-[88%] bg-[#fffdf8] p-0"><SheetHeader className="border-b p-6"><SheetTitle><SiteLogo /></SheetTitle></SheetHeader><nav className="flex flex-col p-4">{nav.map(([label, href]) => <a key={href} href={href} className="mobile-nav-link">{label}</a>)}</nav><div className="p-4"><Link href="/agendar" className="btn btn-primary w-full">Agendar banho e tosa</Link></div></SheetContent></Sheet></div>
        <SiteLogo />
        <label className="header-search hidden xl:flex"><Search className="size-5" /><input aria-label="Buscar produtos" placeholder="Busque produtos e marcas" onKeyDown={(event) => { if (event.key === "Enter") router.push(`/loja?q=${encodeURIComponent(event.currentTarget.value)}`); }} /></label>
        <div className="header-actions">
          <SearchDialog />
          <Link href="/favoritos" className="icon-button header-icon-action hidden sm:grid" aria-label={`Favoritos${ids.length ? `: ${ids.length} produtos` : ""}`}><Heart fill={ids.length ? "currentColor" : "none"} />{ids.length > 0 && <span className="cart-count">{ids.length}</span>}</Link>
          <Link href="/conta" className="icon-button header-icon-action hidden sm:grid" aria-label="Minha conta"><PersonStanding /></Link>
          <Link href="/carrinho" className="icon-button header-icon-action relative" aria-label={`Carrinho com ${count} itens`}><ShoppingBag />{count > 0 && <span className="cart-count">{count}</span>}</Link>
          <Link href="/agendar" className="btn btn-primary hidden md:inline-flex">Agendar banho e tosa</Link>
        </div>
      </div>
      <nav className="header-nav shell hidden lg:flex" aria-label="Navegação principal">{nav.map(([label, href]) => { const active = href === "/" ? pathname === "/" : label === "Loja" ? pathname === "/loja" : pathname === href; return <a key={href} href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{label}</a>; })}</nav>
    </header>
  </>;
}
