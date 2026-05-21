export const contactInfo = {
  name: "Matt Maitland",
  /** Public inbox: set NEXT_PUBLIC_CONTACT_EMAIL for a domain alias; see site-contact helper. */
  location: "Colorado, USA",
  github: "https://github.com/mmaitland300",
};

export type ResumeHighlight = {
  text: string;
  href?: string;
};

export type ResumeExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: ResumeHighlight[];
};

export type ResumeEducationItem = {
  degree: string;
  school: string;
  period: string;
  description?: string;
};

export type ResumeSkillTier = {
  id: "core" | "working" | "familiar";
  title: string;
  skills: string[];
};

export const resumeSummary =
  "Technical support specialist working on Full Swing simulator systems through Auxillium. I troubleshoot remote issues across calibration, licensing, display, networking, Windows, and connected hardware, often with incomplete logs and no direct hardware access. Outside work, I build web and audio tools to understand systems better and make useful things I would like to see exist, including mmaitland.dev, StringFlux, and Research Radar.";

export const resumeSkillTiers: ResumeSkillTier[] = [
  {
    id: "core",
    title: "Core Skills",
    skills: [
      "Troubleshooting",
      "Windows systems",
      "Networking / TCP/IP",
      "TypeScript",
      "Next.js",
      "React",
      "Git / GitHub",
      "Technical communication",
    ],
  },
  {
    id: "working",
    title: "Working Project Experience",
    skills: [
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Tailwind CSS",
      "Python",
      "Zod",
      "Resend / Upstash",
      "C++",
      "JUCE",
      "DSP",
    ],
  },
  {
    id: "familiar",
    title: "Familiar / Earlier work",
    skills: ["Flask / Django", "MySQL", "MongoDB", "Machine Learning / CNN", "Apache"],
  },
];

export const resumeExperience: ResumeExperienceItem[] = [
  {
    role: "Independent Software and Audio Development",
    company: "Self-directed",
    period: "2022 - Present",
    description:
      "Self-directed web and audio software built around things I wanted to understand better or tools I wanted to use, maintained around full-time work with public notes on scope, decisions, and limits.",
    highlights: [
      {
        text: "Built mmaitland.dev with typed content, CI, smoke tests, contact validation, rate limiting, and optional admin workflows.",
        href: "https://www.mmaitland.dev",
      },
      {
        text: "Building StringFlux in JUCE/C++ with focus on real-time-safe behavior, narrow scope, and documented tradeoffs.",
        href: "https://www.mmaitland.dev/stringflux",
      },
      {
        text: "Write case studies and decision notes so project pages explain the decisions, limits, and current state behind the demos and repositories.",
      },
    ],
  },
  {
    role: "Technical Support / Product Support Specialist",
    company: "Auxillium (technical support for Full Swing)",
    period: "April 2024 - Present",
    description:
      "Diagnose remote simulator issues across calibration, licensing, display, networking, OS, and peripheral layers in customer production environments.",
    highlights: [
      {
        text: "Built repeatable triage notes for recurring failure patterns so similar tickets start from the right isolation steps instead of from scratch.",
        href: "/projects/full-swing-tech-support",
      },
      {
        text: "Support Full Swing-first environments with Laser Shot and E6 Golf from TruGolf often present on the same install.",
      },
    ],
  },
];

export const resumeEducation: ResumeEducationItem[] = [
  {
    degree: "Bachelor's in Biochemistry",
    school: "University of South Florida",
    period: "January 2014 to December 2016",
  },
  {
    degree: "Associate in General Studies",
    school: "Florida Southwestern State College",
    period: "January 2008 to December 2011",
  },
];

export const resumeCertifications = [
  {
    name: "CompTIA A+",
    period: "July 2023 to July 2026",
    description:
      "Validated hands-on skills across hardware, software, networking, troubleshooting, security, mobile devices, and customer support.",
  },
];
