"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getHomepageFeaturedProjects } from "@/content/projects";

export function FeaturedProjects() {
  const featured = getHomepageFeaturedProjects();
  const featuredDescription =
    "Software, systems troubleshooting, research, and audio DSP. Each project explains the work and the decisions behind it.";

  return (
    <section className="py-14 sm:py-20 relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader
            eyebrow="Selected Work"
            title="Featured Projects"
            description={featuredDescription}
            headingLevel={2}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} compact />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className={buttonVariants({ variant: "outline" })}
          >
            View All Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
