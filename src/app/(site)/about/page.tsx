import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { AboutContent } from "@/components/sections/about-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";
import { professionalIntro, siteDescription } from "@/content/resume";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: siteDescription,
};

export default function AboutPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="About"
          title="Software, robotics, and audio DSP"
          description={professionalIntro}
          className="mb-16"
        />
        <AboutContent publicEmail={getPublicContactEmail()} />
      </div>
    </div>
  );
}
