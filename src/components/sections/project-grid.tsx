"use client";

import { motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { ProjectCard } from "@/components/sections/project-card";
import { Separator } from "@/components/ui/separator";
import { getExperiments, getFeaturedProjects } from "@/content/projects";

export function ProjectGrid() {
  const featured = getFeaturedProjects();
  const experiments = getExperiments();

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Featured case studies
        </h2>
        <p className="mt-2 mx-auto max-w-2xl text-sm text-muted-foreground">
          Explore the problem, the work, and the decisions behind each project.
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {featured.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

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
              Smaller projects where I tried an idea, learned a tool, or worked
              through a technical problem.
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

