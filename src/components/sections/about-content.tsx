"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Code2,
  Briefcase,
  GraduationCap,
  Github,
  FileDown,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  resumeSkillTiers,
  resumeExperience as experience,
  resumeEducation as education,
  resumeCertifications as certifications,
} from "@/content/resume";
import { HighlightText } from "@/components/ui/highlight-text";

type AboutContentProps = {
  publicEmail: string;
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.5 },
};

export function AboutContent({ publicEmail }: AboutContentProps) {
  return (
    <div className="space-y-16">
      <motion.section {...fadeUp}>
        <p className="text-lg font-medium text-foreground leading-relaxed">
          A lot of my work comes down to diagnosing problems where the symptom
          and the root cause live in different layers. In robotics, past
          support work, web software, and audio DSP,
          the visible failure is often only the first clue: hardware state,
          environment, operating-system behavior, connectivity, and human
          context can all be part of the real cause.
        </p>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          I currently do that as a Robotics Technician at Barn Owl Precision.
          Before that, I supported complex simulator systems. That support work
          taught me to work from observation, isolate variables, and distrust
          fixes that cannot be reproduced.
        </p>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Those habits still apply when I work on my own projects: web
          software, audio DSP tools, and music. I still care about naming real
          limits: remote
          diagnosis with incomplete information, Windows and display stack
          overlap, real-time audio deadline pressure, and small-scope solo
          maintenance.
        </p>
      </motion.section>

      <motion.section {...fadeUp}>
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-xl font-semibold text-foreground">How I Work</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Observe before changing.</li>
            <li>Isolate one variable at a time.</li>
            <li>Prefer reversible fixes first.</li>
            <li>Turn solved incidents into repeatable playbooks.</li>
          </ul>
        </div>
      </motion.section>

      <motion.section {...fadeUp}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <Code2 className="h-5 w-5 text-brand-violet" />
          </div>
          <h2 className="text-2xl font-bold">Skills & Technologies</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {resumeSkillTiers.map((tier) => (
            <article
              key={tier.id}
              className="rounded-xl border border-border bg-card/40 p-4"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {tier.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <Badge
                    key={`${tier.id}-${skill}`}
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp}>
        <p className="text-lg text-muted-foreground leading-relaxed">
          I write, record, produce, and master original work as NEUROCHEMICAL
          ENTROPY, and that practice directly affects how I think about timing,
          feel, interfaces, and audio DSP software. StringFlux exists because
          those two sides of my work overlap.
        </p>
      </motion.section>

      <Separator className="bg-border" />

      <motion.section {...fadeUp}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-cyan/10">
            <Briefcase className="h-5 w-5 text-brand-cyan" />
          </div>
          <h2 className="text-2xl font-bold">Experience</h2>
        </div>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div
              key={`${exp.role}-${exp.company}`}
              className="relative pl-6 border-l-2 border-border"
            >
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-brand-violet border-2 border-background" />
              <h3 className="font-semibold text-foreground">{exp.role}</h3>
              <p className="text-sm text-brand-violet">{exp.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {exp.period}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {exp.description}
              </p>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.highlights.map((highlight, index) => (
                    <li
                      key={`${highlight.text}-${index}`}
                      className="text-sm text-muted-foreground pl-3 relative before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-brand-violet/50"
                    >
                      <HighlightText highlight={highlight} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <GraduationCap className="h-5 w-5 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <div className="space-y-6">
          {education.map((edu) => (
            <div
              key={`${edu.degree}-${edu.school}`}
              className="relative pl-6 border-l-2 border-border"
            >
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-pink-500 border-2 border-background" />
              <h3 className="font-semibold text-foreground">{edu.degree}</h3>
              <p className="text-sm text-pink-400">{edu.school}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {edu.period}
              </p>
              {edu.description ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {edu.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Certifications</h2>
        </div>
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="relative pl-6 border-l-2 border-border"
            >
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
              <h3 className="font-semibold text-foreground">{cert.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cert.period}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <Separator className="bg-border" />

      <motion.section {...fadeUp} className="flex flex-wrap gap-3">
        <a
          href="https://github.com/mmaitland300"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline" })}
        >
          <Github className="mr-2 h-4 w-4" /> GitHub
        </a>
        <a
          href={`mailto:${publicEmail}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Mail className="mr-2 h-4 w-4" /> Email
        </a>
        <Link
          href="/resume"
          className={buttonVariants({ variant: "outline" })}
        >
          <FileDown className="mr-2 h-4 w-4" /> View Resume
        </Link>
      </motion.section>
    </div>
  );
}
