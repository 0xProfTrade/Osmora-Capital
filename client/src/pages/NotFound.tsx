import { Link } from "wouter";
import { PublicLayout } from "@/components/SiteLayout";
export default function NotFound() { return <PublicLayout><section className="grid-shell flex min-h-[65vh] items-center bg-ink px-5 py-20 lg:px-9"><div className="mx-auto w-full max-w-[1500px]"><p className="label-type text-[10px] text-white/55">404 / Not Found</p><h1 className="display-type mt-7 text-7xl font-semibold sm:text-8xl">This path is <span className="text-white/45">unmapped.</span></h1><Link href="/" className="mt-10 inline-block bg-white px-5 py-4 label-type text-[11px] text-ink">Return Home</Link></div></section></PublicLayout>; }

