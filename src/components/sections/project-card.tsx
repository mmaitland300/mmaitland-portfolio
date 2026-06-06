"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Gamepad2, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/content/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  compact?: boolean;
}

const statusLabel: Record<NonNullable<Project["status"]>, string> = {
  "in-progress": "In Progress",
  operational: "Operational",
  "live-site": "Live site",
  "live-prototype": "Live prototype",
  "live-demo": "Live demo",
  "current-role": "Current role",
  "prior-role": "Prior role",
  "source-installable": "Source-installable milestone",
  "desktop-prototype": "Desktop prototype",
  shipped: "Shipped",
  archived: "Archived",
};

const proofKindLabel: Record<
  NonNullable<NonNullable<Project["proofLinks"]>[number]["kind"]>,
  string
> = {
  repo: "repo",
  test: "test",
  ci: "ci",
  post: "decision record",
  "case-study": "case study",
  "product-page": "product page",
  artifact: "artifact",
  release: "release",
  walkthrough: "walkthrough",
  workflow: "workflow",
};

/** Same on homepage (compact) and /projects so the primary demo CTA reads consistently. */
const demoPrimaryLinkClass =
  "flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-cyan-hover";

/** External URLs are playable hosts; same-site paths point at product pages (not live sandboxes). */
function demoPrimaryLabel(project: Project): string {
  if (project.demo?.startsWith("/")) {
    return project.demoCtaLabel ?? "Visit product page";
  }
  return "Try live demo";
}

/**
 * Featured projects should open the case study first.
 * Experiments can continue using demo-first behavior.
 */
function getProjectCardDestination(project: Project): {
  href: string;
  external: boolean;
} | null {
  if (project.category === "featured" && project.caseStudy) {
    if (project.caseStudy.startsWith("/")) {
      return { href: project.caseStudy, external: false };
    }
    return { href: project.caseStudy, external: true };
  }

  if (project.demo) {
    if (project.demo.startsWith("/")) {
      return { href: project.demo, external: false };
    }
    if (/^https?:\/\//i.test(project.demo)) {
      return { href: project.demo, external: true };
    }
  }
  if (project.caseStudy?.startsWith("/")) {
    return { href: project.caseStudy, external: false };
  }
  if (project.caseStudy) {
    return { href: project.caseStudy, external: true };
  }
  return null;
}

export function ProjectCard({ project, index, compact }: ProjectCardProps) {
  const [iframeActive, setIframeActive] = useState(false);
  const internalDemoHref = project.demo?.startsWith("/") ? project.demo : null;
  const internalCaseStudyHref = project.caseStudy?.startsWith("/")
    ? project.caseStudy
    : null;
  const hasCaseStudy = Boolean(project.caseStudy);
  const hasDemo = Boolean(project.demo);
  const preferCaseStudyCtaOrder = project.category === "featured";
  const evidenceKinds = Array.from(
    new Set(
      (project.proofLinks ?? [])
        .map((link) => link.kind)
        .filter((kind): kind is NonNullable<typeof kind> => Boolean(kind))
        .map((kind) => proofKindLabel[kind])
    )
  );

  const cardDestination = getProjectCardDestination(project);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-brand-violet/30 transition-all duration-300"
      data-testid={`project-card-${project.slug}`}
    >
      {cardDestination ? (
        cardDestination.external ? (
          <a
            href={cardDestination.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="absolute inset-0 z-[1] rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        ) : (
          <Link
            href={cardDestination.href}
            aria-label={`Open ${project.title}`}
            className="absolute inset-0 z-[1] rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        )
      ) : null}
      {/* Preview area */}
      {project.iframe ? (
        <div className="relative z-[2] h-48 overflow-hidden bg-black/50">
          {iframeActive ? (
            <>
              <iframe
                src={project.iframe}
                className="w-full h-full border-0"
                title={project.title}
                sandbox="allow-scripts allow-same-origin"
              />
              <button
                onClick={() => setIframeActive(false)}
                className="absolute top-2 right-2 z-20 p-1 rounded-md bg-black/60 text-white/70 hover:text-white transition-colors"
                aria-label="Close interactive preview"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIframeActive(true)}
              className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="p-3 rounded-full bg-brand-violet/20 text-brand-violet transition-transform group-hover:scale-110">
                <Play size={24} className="ml-0.5" />
              </div>
              <span className="text-xs text-muted-foreground">
                Click to play
              </span>
            </button>
          )}
        </div>
      ) : project.image ? (
        <div className="relative z-[2] h-48 overflow-hidden bg-black/30">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            unoptimized={project.image.toLowerCase().endsWith(".svg")}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="relative z-[2] flex h-48 flex-col items-center justify-center gap-2 border-b border-border/50 bg-brand-surface-faint">
          <div className="flex gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-[2] p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-violet transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        {project.status && (
          <div className="mb-4">
            <Badge variant="secondary" className="text-[11px] font-medium">
              Status: {statusLabel[project.status]}
            </Badge>
          </div>
        )}

        {compact && evidenceKinds.length > 0 && (
          <p className="mb-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Project links: </span>
            {evidenceKinds.join(" / ")}
          </p>
        )}

        {!compact && project.problem && (
          <div className="space-y-2 mb-4 text-sm">
            <div>
              <span className="font-medium text-foreground/80">Problem: </span>
              <span className="text-muted-foreground">{project.problem}</span>
            </div>
            {project.constraints && (
              <div>
                <span className="font-medium text-foreground/80">
                  Constraints:{" "}
                </span>
                <span className="text-muted-foreground">
                  {project.constraints}
                </span>
              </div>
            )}
            {project.tradeoff && (
              <div>
                <span className="font-medium text-foreground/80">
                  Tradeoff:{" "}
                </span>
                <span className="text-muted-foreground">{project.tradeoff}</span>
              </div>
            )}
            {project.role && (
              <div>
                <span className="font-medium text-foreground/80">Role: </span>
                <span className="text-muted-foreground">{project.role}</span>
              </div>
            )}
            {project.outcome && (
              <div>
                <span className="font-medium text-foreground/80">
                  Outcome:{" "}
                </span>
                <span className="text-muted-foreground">{project.outcome}</span>
              </div>
            )}
            {project.evidence && (
              <div>
                <span className="font-medium text-foreground/80">Notes: </span>
                <span className="text-muted-foreground">{project.evidence}</span>
              </div>
            )}
            {project.knownLimits && (
              <div>
                <span className="font-medium text-foreground/80">
                  Known limits:{" "}
                </span>
                <span className="text-muted-foreground">{project.knownLimits}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {project.proofLinks && project.proofLinks.length > 0 && (
          <div className="mb-4 text-xs">
            <span className="font-medium text-foreground/80">
              Supporting links:{" "}
            </span>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {project.proofLinks.slice(0, 3).map((link) => {
                const isInternal = link.href.startsWith("/");
                const className =
                  "text-muted-foreground hover:text-foreground transition-colors";
                return isInternal ? (
                  <Link key={link.label} href={link.href} className={className}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA hierarchy for featured work: case study -> live prototype -> code. */}
        <div className="relative z-[3] flex flex-wrap items-center gap-x-4 gap-y-2">
          {preferCaseStudyCtaOrder && hasCaseStudy ? (
            internalCaseStudyHref ? (
              <Link href={internalCaseStudyHref} className={demoPrimaryLinkClass}>
                <ExternalLink size={14} /> Case study
              </Link>
            ) : (
              <a
                href={project.caseStudy!}
                className={demoPrimaryLinkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} /> Case study
              </a>
            )
          ) : internalDemoHref ? (
            <Link href={internalDemoHref} className={demoPrimaryLinkClass}>
              <ExternalLink size={14} /> {demoPrimaryLabel(project)}
            </Link>
          ) : hasDemo ? (
            <a
              href={project.demo!}
              target="_blank"
              rel="noopener noreferrer"
              className={demoPrimaryLinkClass}
            >
              <ExternalLink size={14} /> {demoPrimaryLabel(project)}
            </a>
          ) : null}

          {preferCaseStudyCtaOrder && hasDemo ? (
            internalDemoHref ? (
              <Link
                href={internalDemoHref}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink size={14} /> {demoPrimaryLabel(project)}
              </Link>
            ) : (
              <a
                href={project.demo!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink size={14} /> {demoPrimaryLabel(project)}
              </a>
            )
          ) : !preferCaseStudyCtaOrder && internalCaseStudyHref ? (
            <Link
              href={internalCaseStudyHref}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink size={14} /> Case study
            </Link>
          ) : !preferCaseStudyCtaOrder && project.caseStudy ? (
            <a
              href={project.caseStudy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink size={14} /> Case study
            </a>
          ) : null}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github size={14} /> Code
            </a>
          )}
          {project.iframe && (
            <button
              type="button"
              onClick={() => setIframeActive(!iframeActive)}
              className="flex items-center gap-1.5 text-xs text-brand-violet transition-colors hover:text-brand-violet-hover"
            >
              <Gamepad2 size={14} /> {iframeActive ? "Stop" : "Play"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
