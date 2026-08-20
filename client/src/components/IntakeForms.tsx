import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sectorOptions, type Sector } from "@/content/site-data";
import { trpc } from "@/lib/trpc";

const inputClass = "w-full border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 transition focus:border-white";
const lightInputClass = "w-full border border-ink/25 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition focus:border-ink";

function Consent({ light = false }: { light?: boolean }) {
  return <label className={`flex gap-3 text-xs leading-5 ${light ? "text-ink/65" : "text-white/60"}`}><input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-white" /><span>By submitting this form, you agree that Osmora Capital may store and use this information to evaluate your inquiry or proposal. See our <a href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</a>.</span></label>;
}

export function ProposalForm() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.intake.submitProposal.useMutation({ onSuccess: () => setSubmitted(true) });
  if (submitted) return <SuccessMessage title="Proposal recorded." copy="Thank you for sharing your work. Osmora Capital will review the information submitted through this private channel." />;
  return <form className="grid gap-5" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("consent") !== "on") return;
    mutation.mutate({
      name: String(data.get("name") || ""), firm: String(data.get("firm") || ""), sector: String(data.get("sector")) as Sector | "Other", stage: String(data.get("stage") || ""), description: String(data.get("description") || ""), email: String(data.get("email") || ""), phone: String(data.get("phone") || ""), consent: true,
    });
  }}>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Founder / Company Name"><input className={inputClass} name="name" required placeholder="Your name" /></Field><Field label="Firm"><input className={inputClass} name="firm" required placeholder="Company name" /></Field></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Sector"><select className={inputClass} name="sector" defaultValue="Artificial Intelligence">{sectorOptions.map(sector => <option className="bg-charcoal" key={sector} value={sector}>{sector}</option>)}</select></Field><Field label="Stage"><input className={inputClass} name="stage" required placeholder="Pre-seed, Seed, Growth…" /></Field></div>
    <Field label="Deal Description"><textarea className={`${inputClass} min-h-40 resize-y`} name="description" required minLength={30} placeholder="Describe the company, its work, and why the partnership merits attention." /></Field>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Email"><input className={inputClass} name="email" type="email" required placeholder="name@company.com" /></Field><Field label="Phone"><input className={inputClass} name="phone" required placeholder="+62 …" /></Field></div>
    <Consent />
    {mutation.error && <p className="text-sm text-red-200">We could not record the proposal. Please review the fields and try again.</p>}
    <button disabled={mutation.isPending} className="flex w-full items-center justify-center gap-2 bg-white px-5 py-4 label-type text-[11px] text-ink transition hover:bg-neutral-300 disabled:cursor-wait disabled:opacity-60">{mutation.isPending && <Loader2 className="animate-spin" size={15} />} Submit Proposal</button>
  </form>;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.intake.submitContact.useMutation({ onSuccess: () => setSubmitted(true) });
  if (submitted) return <SuccessMessage light title="Inquiry recorded." copy="Thank you for getting in touch. Your message has been stored in Osmora Capital’s private inquiry channel." />;
  return <form className="grid gap-5" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("consent") !== "on") return;
    const selectedSector = String(data.get("sector") || "");
    mutation.mutate({ name: String(data.get("name") || ""), companyProject: String(data.get("companyProject") || "") || undefined, sector: selectedSector ? selectedSector as Sector | "Other" : undefined, email: String(data.get("email") || ""), message: String(data.get("message") || ""), consent: true });
  }}>
    <div className="grid gap-5 sm:grid-cols-2"><Field light label="Name"><input className={lightInputClass} name="name" required placeholder="Your name" /></Field><Field light label="Company / Project"><input className={lightInputClass} name="companyProject" placeholder="Optional" /></Field></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field light label="Email"><input className={lightInputClass} name="email" type="email" required placeholder="name@company.com" /></Field><Field light label="Sector of Interest"><select className={lightInputClass} name="sector" defaultValue=""><option value="">Select if relevant</option>{sectorOptions.map(sector => <option key={sector} value={sector}>{sector}</option>)}</select></Field></div>
    <Field light label="Message"><textarea className={`${lightInputClass} min-h-40 resize-y`} name="message" required minLength={20} placeholder="How can we help?" /></Field>
    <Consent light />
    {mutation.error && <p className="text-sm text-red-800">We could not record this inquiry. Please review the fields and try again.</p>}
    <button disabled={mutation.isPending} className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-4 label-type text-[11px] text-white transition hover:bg-smoke disabled:cursor-wait disabled:opacity-60">{mutation.isPending && <Loader2 className="animate-spin" size={15} />} Send Inquiry</button>
  </form>;
}

function Field({ label, children, light = false }: { label: string; children: React.ReactNode; light?: boolean }) { return <label className="grid gap-2"><span className={`label-type text-[10px] ${light ? "text-ink/60" : "text-white/60"}`}>{label}</span>{children}</label>; }
function SuccessMessage({ title, copy, light = false }: { title: string; copy: string; light?: boolean }) { return <div className={`border p-7 ${light ? "border-ink/25 text-ink" : "border-white/25 text-white"}`}><CheckCircle2 size={28} /><h3 className="mt-5 text-2xl font-semibold tracking-[-.05em]">{title}</h3><p className={`mt-3 max-w-md text-sm leading-6 ${light ? "text-ink/65" : "text-white/65"}`}>{copy}</p></div>; }
