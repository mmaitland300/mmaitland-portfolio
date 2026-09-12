import type { Metadata } from "next";
import Link from "next/link";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { FileText, Layers3, Music2, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { StringFluxPluginPreview } from "@/components/case-studies/stringflux-plugin-preview";
import { StringFluxWaitlistForm } from "@/components/sections/stringflux-waitlist-form";

export const metadata: Metadata = {
  alternates: { canonical: "/stringflux" },
  title: "StringFlux",
  description:
    "StringFlux is a transient-aware multiband granular delay and freeze plugin for guitar and other stringed instruments. Signal flow, interface previews, and a waitlist to join for beta access.",
};

const howItWorks = [
  {
    icon: Music2,
    color: "text-brand-violet",
    title: "You play",
    body: "StringFlux reads your input in real time. It tracks string attacks and captures a rolling history of your signal across three frequency bands.",
  },
  {
    icon: Zap,
    color: "text-brand-cyan",
    title: "Grains fire on transients",
    body: "When you strike a note, a transient-driven scheduler fires grains timed to your playing. A density scheduler fills the space between attacks to build texture.",
  },
  {
    icon: Layers3,
    color: "text-amber-400",
    title: "Layered texture comes out",
    body: "The output blends your dry signal with the processed grain cloud - controllable density, grain length, pitch spread, and feedback. You stay in control.",
  },
];

export default function StringFluxPage() {
  return (
    <div className="py-24">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-16">
          <SectionHeader
            eyebrow="Product"
            title="StringFlux"
            titleClassName="text-gradient-brand font-bold"
            description="Transient-aware multiband granular delay and freeze for guitar and stringed instruments. Turn a single performance into layered texture while keeping the response playable."
            descriptionClassName="text-lg leading-relaxed"
            badges={
              <>
                <Badge variant="secondary">Audio Plugin</Badge>
                <Badge variant="secondary">DSP</Badge>
                <Badge
                  variant="secondary"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-400"
                >
                  In Development
                </Badge>
              </>
            }
            actions={
              <>
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2 rounded-lg border-0 bg-brand-cta-gradient px-5 py-2.5 text-sm font-medium text-white shadow-brand-cta"
                >
                  Join the waitlist <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/projects/stringflux"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FileText className="h-4 w-4" /> DSP case study
                </Link>
              </>
            }
          />
        </header>

        <section className="mb-16" aria-labelledby="ui-section">
          <h2 id="ui-section" className="mb-4 text-xl font-semibold">
            Plugin interface
          </h2>
          <StringFluxPluginPreview />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Three interface layouts from the dev build: Core (primary controls
            only), Waveform (grain region editor), and Advanced (modulation matrix and
            deeper shaping). Preset names visible in the captures are incidental; many
            presets will use these same panels. Mod-source envelope meters show live
            activity; polish is ongoing. The `v0.3-dev` label in the screenshots is
            a UI/dev marker, not the validation candidate label used in the case
            study.
          </p>
        </section>

        <section className="mb-16" aria-labelledby="how-section">
          <h2 id="how-section" className="mb-6 text-xl font-semibold">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-border bg-card/40 p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <step.icon className={`h-4 w-4 ${step.color}`} />
                </div>
                <h3 className="mb-1 font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="waitlist"
          className="rounded-xl border border-brand-violet/20 bg-card/60 p-8"
          aria-labelledby="waitlist-section"
        >
          <div className="max-w-lg">
            <h2 id="waitlist-section" className="mb-1 text-2xl font-bold">
              Waitlist
            </h2>
            <p className="mb-6 text-muted-foreground">
              StringFlux is in active development. Join the waitlist with your
              email and I&apos;ll reach out when beta access or a first release is
              available.
            </p>
            <StringFluxWaitlistForm />
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/projects/stringflux"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Read the DSP architecture case study{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
