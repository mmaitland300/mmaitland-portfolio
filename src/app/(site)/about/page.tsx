import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { AboutContent } from "@/components/sections/about-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Robotics technician building web software and audio DSP tools, writing and producing music, and working on research prototypes. Current role is Robotics Technician at Barn Owl Precision; earlier work included supporting complex simulator systems.",
};

export default function AboutPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="About"
          title="Robotics technician, web software, and audio DSP"
          description="Current role is Robotics Technician at Barn Owl Precision. Earlier work included supporting complex simulator systems. Outside of that I build web software and audio DSP tools, write and produce music, and work on research prototypes. The troubleshooting habits carry across all of it."
          className="mb-16"
        />
        <AboutContent publicEmail={getPublicContactEmail()} />
      </div>
    </div>
  );
}
