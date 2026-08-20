import { sectors } from "@/content/site-data";

type OrbitalNetworkProps = {
  activeId?: string;
  onSelect?: (id: string) => void;
  interactive?: boolean;
  compact?: boolean;
};

const positions = [
  { x: 207, y: 47 }, { x: 359, y: 158 }, { x: 300, y: 348 }, { x: 108, y: 350 }, { x: 48, y: 165 },
];

export function OrbitalNetwork({ activeId, onSelect, interactive = false, compact = false }: OrbitalNetworkProps) {
  const size = compact ? "max-w-[360px]" : "max-w-[510px]";
  return <div className={`relative mx-auto w-full ${size}`}>
    <svg className="w-full overflow-visible" viewBox="0 0 410 410" role="img" aria-label="Osmora Capital orbital network of five investment focus areas">
      <g className="orbital-rotate" style={{ transformBox: "fill-box" }}>
        <circle cx="205" cy="205" r="157" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth=".6" strokeDasharray="2 7" />
        <circle cx="205" cy="205" r="108" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".6" />
        {positions.map((position, index) => <line key={index} x1="205" y1="205" x2={position.x} y2={position.y} stroke="rgba(255,255,255,.3)" strokeWidth=".8" />)}
      </g>
      <circle cx="205" cy="205" r="52" fill="#f2f2f0" />
      <text x="205" y="208" textAnchor="middle" className="fill-[#101010] font-mono text-[8px] tracking-[.08em]">Osmora Capital</text>
      {sectors.map((sector, index) => {
        const position = positions[index];
        const active = activeId === sector.id;
        return <g key={sector.id} className={interactive ? "cursor-pointer" : ""} onClick={() => interactive && onSelect?.(sector.id)} onKeyDown={event => { if (interactive && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect?.(sector.id); } }} tabIndex={interactive ? 0 : undefined} role={interactive ? "button" : undefined} aria-label={interactive ? `Reveal ${sector.name} thesis` : undefined}>
          <circle cx={position.x} cy={position.y} r={active ? 30 : 23} fill={active ? "#f2f2f0" : "#101010"} stroke="#f2f2f0" strokeWidth={active ? 2 : 1} className="transition-all duration-200" />
          <text x={position.x} y={position.y + 3} textAnchor="middle" className={active ? "fill-[#101010] font-mono text-[7px]" : "fill-[#f2f2f0] font-mono text-[7px]"}>{sector.abbreviatedName}</text>
        </g>;
      })}
    </svg>
  </div>;
}
