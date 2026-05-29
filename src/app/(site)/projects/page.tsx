import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ProjectGrid } from "@/components/sections/project-grid";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects grouped by what they are, why I built them, what works now, and what is still limited.",
};

export default function ProjectsPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Projects"
          title="Case Studies and Experiments"
          description="Selected projects grouped by what they are, why I built them, what works now, and what is still limited. Smaller experiments are grouped separately."
          className="mb-12"
        />
        <ProjectGrid />
      </div>
    </div>
  );
}
