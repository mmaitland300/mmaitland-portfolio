import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, CheckCircle2, FileCode2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { CaseStudyEvidenceFooter } from "@/components/sections/case-study-evidence-footer";
import { ProjectComments } from "@/components/sections/project-comments";
import { getProjectBySlug } from "@/content/projects";

const PORTFOLIO_ARTIFACT_SRC = "/images/projects/portfolio-delivery-artifact.svg";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/portfolio-site" },
  title: "How I Built mmaitland.dev",
  description:
    "How mmaitland.dev is built as a home for projects, music, writing, and things I am learning, including typed content, contact validation, an optional admin inbox, and the small set of services behind it.",
};

export const dynamic = "force-dynamic";

const safeguards = [
  "Server-side Zod validation for contact and waitlist before side effects",
  "Honeypot field plus Upstash sliding-window rate limiting on contact submissions",
  "GitHub OAuth via Auth.js for admin routes and inbox views when configured",
  "Optional Prisma persistence for contact and waitlist records after email sends",
  "Playwright smoke tests on public routes, titles, and OG metadata",
];

const tradeoffs = [
  {
    title: "Managed services to keep the site small",
    detail:
      "Used Resend, Upstash, and Neon-backed Prisma integration so the site can handle contact, rate limits, and optional persistence without becoming a separate backend project.",
  },
  {
    title: "Delivery first, then persistence",
    detail:
      "Contact action treats email delivery as the primary success path, with inbox persistence as best-effort to avoid silent form success when mail is misconfigured.",
  },
  {
    title: "Small, reviewable changes",
    detail:
      "Incremental PRs and merge gates so each fix stays review-sized and the history stays legible when something regresses.",
  },
];

export default function PortfolioSiteCaseStudyPage() {
  const project = getProjectBySlug("portfolio-site");
  if (!project) {
    throw new Error("Missing project data for portfolio-site");
  }

  return (
    <div className="py-24">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <header className="mb-12">
          <SectionHeader
            align="left"
            eyebrow="Case Study"
            title="How I Built mmaitland.dev"
            description="This site is where I keep project writeups, music, blog notes, and things I am learning. This case study covers the contact flow, optional admin inbox, typed content, and service setup without turning it into a bigger app than it needed to be."
            descriptionClassName="max-w-3xl"
            badges={
              <>
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">Auth.js</Badge>
                <Badge variant="secondary">Prisma</Badge>
                <Badge variant="secondary">Contact &amp; admin</Badge>
              </>
            }
          />
        </header>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Architecture artifact</h2>
          </div>
          <figure className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <div className="relative aspect-[1200/675] w-full">
              <Image
                src={PORTFOLIO_ARTIFACT_SRC}
                alt="Flow diagram: public routes, server actions, contact validation and rate limits, optional admin inbox"
                fill
                unoptimized
                className="object-contain object-center p-2 sm:p-4"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <figcaption className="border-t border-border bg-card/50 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
              Sketch of the contact path and optional admin persistence - useful
              for keeping assumptions explicit when iterating alone.
            </figcaption>
          </figure>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-violet" />
            <h2 className="text-xl font-semibold">What runs in production</h2>
          </div>
          <ul className="space-y-2">
            {safeguards.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Tradeoffs</h2>
          <div className="space-y-4">
            {tradeoffs.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <CaseStudyEvidenceFooter
          project={project}
          statusIcon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          currentCaseStudyPath="/projects/portfolio-site"
        />

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="portfolio-site"
            currentPath="/projects/portfolio-site"
          />
        </Suspense>
      </div>
    </div>
  );
}
