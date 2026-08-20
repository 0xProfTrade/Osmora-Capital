import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/content/site-data";

export function Wordmark({ light = true }: { light?: boolean }) {
  return <span className={`font-semibold tracking-[-0.06em] ${light ? "text-white" : "text-ink"}`}>Osmora Capital</span>;
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-white/15 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between px-5 lg:px-9">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg leading-none"><Wordmark /></Link>
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
            {navItems.map(item => <Link key={item.href} href={item.href} className={`industrial-link label-type text-[10px] transition-colors ${isActive(item.href) ? "text-white" : "text-white/55 hover:text-white"}`}>{item.label}</Link>)}
          </nav>
          <div className="hidden md:block">
            <Link href="/submit-proposal" className="group flex items-center gap-2 bg-white px-4 py-2.5 label-type text-[10px] text-ink transition hover:bg-neutral-300">Submit a Proposal <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
          <button className="p-2 text-white md:hidden" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="border-t border-white/15 bg-charcoal px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {navItems.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="display-type text-4xl text-white">{item.label}</Link>)}
            <div className="mt-3 border-t border-white/15 pt-5">
              <Link href="/submit-proposal" onClick={() => setOpen(false)} className="block bg-white px-3 py-3 text-center label-type text-[10px] text-ink">Submit Proposal</Link>
            </div>
          </nav>
        </div>}
      </header>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return <footer className="relative overflow-hidden border-t border-white/15 bg-charcoal px-5 py-14 lg:px-9">
    <div className="pointer-events-none absolute -bottom-28 right-[-2rem] h-80 w-80 rounded-full border border-white/10 before:absolute before:inset-12 before:rounded-full before:border before:border-white/10 after:absolute after:inset-24 after:rounded-full after:border after:border-white/10" />
    <div className="relative mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.2fr_.8fr_.7fr]">
      <div>
        <Wordmark />
        <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">A selective Indonesian family office building long-horizon partnerships with frontier-sector founders.</p>
      </div>
      <div className="grid grid-cols-2 gap-5 text-sm text-white/65">
        {navItems.map(item => <Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}
        <Link href="/submit-proposal" className="transition hover:text-white">Submit a Proposal</Link>
      </div>
      <div className="text-sm leading-7 text-white/65">
        <a className="block transition hover:text-white" href="mailto:contacts@osmora.xyz">contacts@osmora.xyz</a>
        <a className="block transition hover:text-white" href="tel:+84563199752">WhatsApp / SMS: +84 56 319 9752</a>
      </div>
    </div>
    <div className="relative mx-auto mt-14 flex max-w-[1500px] flex-col gap-4 border-t border-white/15 pt-5 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between label-type">
      <span>© 2026 Osmora Capital. All Rights Reserved.</span>
      <span className="flex gap-5"><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link><Link href="/terms-of-use" className="hover:text-white">Terms of Use</Link></span>
    </div>
  </footer>;
}

export function SectionHeader({ eyebrow, title, copy, light = false }: { eyebrow: string; title: React.ReactNode; copy?: string; light?: boolean }) {
  return <div className={`grid gap-7 border-t pt-5 lg:grid-cols-[.75fr_1.25fr] lg:gap-12 ${light ? "border-ink/25" : "border-white/20"}`}>
    <p className={`label-type text-[10px] ${light ? "text-ink/60" : "text-white/55"}`}>{eyebrow}</p>
    <div><h2 className={`display-type max-w-4xl text-5xl font-semibold sm:text-6xl lg:text-7xl ${light ? "text-ink" : "text-white"}`}>{title}</h2>{copy && <p className={`mt-7 max-w-2xl text-base leading-7 ${light ? "text-ink/65" : "text-white/65"}`}>{copy}</p>}</div>
  </div>;
}
