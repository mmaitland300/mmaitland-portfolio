"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { ProjectCard } from "@/components/sections/project-card";
import { Separator } from "@/components/ui/separator";
import { getExperiments, getFeaturedProjects } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectGrid() {
  const featured = getFeaturedProjects();
  const experiments = getExperiments();

  const allTags = Array.from(new Set(featured.flatMap((p) => p.tags))).sort();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? featured.filter((p) => p.tags.includes(activeTag))
    : featured;

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Featured case studies
        </h2>
        <p className="mt-2 mx-auto max-w-2xl text-sm text-muted-foreground">
          Larger projects include case studies or notes with the useful parts,
          tradeoffs, and current limits. Cards here give more context than the
          homepage preview row.
        </p>
      </div>

      <div
        role="group"
        aria-label="Filter projects by tag"
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        <button
          type="button"
          aria-pressed={activeTag === null}
          aria-controls="project-grid-filter-results"
          onClick={() => setActiveTag(null)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            !activeTag
              ? "border border-brand-violet/30 bg-brand-violet/20 text-brand-violet"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={activeTag === tag}
            aria-controls="project-grid-filter-results"
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              tag === activeTag
                ? "border border-brand-violet/30 bg-brand-violet/20 text-brand-violet"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div
        id="project-grid-filter-results"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No projects match that filter.
        </p>
      )}

      {experiments.length > 0 && (
        <>
          <Separator className="my-16 bg-border" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="mb-3 flex items-center justify-center gap-2">
              <Beaker className="h-5 w-5 text-brand-cyan" />
              <h2 className="text-2xl font-bold tracking-tight">Experiments</h2>
            </div>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Interactive experiments and small-scope builds used to explore
              implementation patterns, runtime behavior, and tradeoffs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {experiments.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                compact
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

