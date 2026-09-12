import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ResumeDocument } from "@/components/resume/resume-document";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  alternates: { canonical: "/resume" },
  title: "Resume",
  description:
    "Resume for Matt Maitland: regional management, software engineering with an ML team, robotics and technical support experience, web software, and audio DSP.",
};

export default function ResumePage() {
  const publicEmail = getPublicContactEmail();
  return (
    <div className="py-24">
      <MainContentAnchor />
      <ResumeDocument variant="web" publicEmail={publicEmail} />
    </div>
  );
}
