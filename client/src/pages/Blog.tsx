import { useState } from "react";
import { PublicLayout, SectionHeader } from "@/components/SiteLayout";

const filters = ["All", "Investment Trends", "Deep-Tech Funding Strategies", "Governance & Regulation", "Family Office Perspective"] as const;
const posts = [
  ["Family Office Perspective", "Why Patient Capital Matters for Deep-Tech Founders", "Forthcoming perspective", "A view on why the work of building hard technology demands a horizon longer than the nearest cycle."],
  ["Investment Trends", "Five Signals We Look for in AI Infrastructure Startups", "Forthcoming perspective", "An outline of the questions behind a durable infrastructure thesis."],
  ["Governance & Regulation", "Navigating Regulation as a Frontier Startup", "Forthcoming perspective", "A perspective on making regulatory context part of the operating conversation."],
  ["Deep-Tech Funding Strategies", "From Seed to Growth: Structuring Biotech Funding", "Forthcoming perspective", "An article on aligning capital structure with long research and commercialization pathways."],
  ["Investment Trends", "Space Systems and the Infrastructure Behind Opportunity", "Forthcoming perspective", "A research-focused perspective on the systems enabling connectivity and earth observation."],
  ["Deep-Tech Funding Strategies", "Designing for the Renewable Energy Transition", "Forthcoming perspective", "A note on the operational and capital dimensions of energy-transition technologies."],
] as const;

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const visiblePosts = activeFilter === "All" ? posts : posts.filter(([category]) => category === activeFilter);
  return <PublicLayout>
    <section className="grid-shell bg-ink px-5 py-20 lg:px-9 lg:py-28"><div className="mx-auto max-w-[1500px]"><p className="label-type text-[10px] text-white/55">Perspectives</p><h1 className="display-type mt-7 max-w-5xl text-6xl font-semibold sm:text-7xl lg:text-9xl">A long view, <span className="text-white/45">in writing.</span></h1><p className="mt-10 max-w-2xl text-lg leading-8 text-white/65">A publication space for investment trends, deep-tech funding, frontier-sector governance, and the family office perspective.</p></div></section>
    <section className="bg-paper px-5 py-20 text-ink lg:px-9 lg:py-28"><div className="mx-auto max-w-[1500px]"><SectionHeader light eyebrow="Editorial Library" title={<>Ideas before they become <span className="text-ink/45">articles.</span></>} copy="A forthcoming series of firm perspectives across the sectors and partnership questions that matter to Osmora Capital." /><div className="mt-12 flex flex-wrap gap-2 border-b border-ink/25 pb-6" aria-label="Filter perspectives by category">{filters.map(filter => <button key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={`border px-4 py-3 label-type text-[9px] transition ${activeFilter === filter ? "border-ink bg-ink text-white" : "border-ink/25 text-ink/65 hover:border-ink hover:text-ink"}`}>{filter}</button>)}</div><div className="mt-0 grid gap-px bg-ink/20 md:grid-cols-2 lg:grid-cols-3">{visiblePosts.map(([category, title, label, copy], index) => <article className={`min-h-80 p-6 ${index % 3 === 1 ? "bg-ink text-white" : "bg-paper"}`} key={title}><p className={`label-type text-[9px] ${index % 3 === 1 ? "text-white/50" : "text-ink/55"}`}>{category}</p><h2 className="mt-16 text-3xl font-semibold tracking-[-.06em]">{title}</h2><p className={`mt-5 text-sm leading-6 ${index % 3 === 1 ? "text-white/65" : "text-ink/65"}`}>{copy}</p><p className={`mt-8 label-type text-[9px] ${index % 3 === 1 ? "text-white/45" : "text-ink/45"}`}>{label}</p></article>)}</div>{visiblePosts.length === 0 && <p className="border border-t-0 border-ink/20 p-6 text-sm text-ink/60">No perspectives are listed in this category yet.</p>}</div></section>
  </PublicLayout>;
}
