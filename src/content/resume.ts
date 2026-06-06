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
  "Robotics Technician at Barn Owl Precision with a background in layered technical support, Windows and various Linux systems, networking, connected hardware, and software projects. Previously, I supported complex simulator systems. Outside work, I build web software and audio DSP tools, write and produce music, and work on research prototypes, including mmaitland.dev, StringFlux, NEUROCHEMICAL ENTROPY, and Research Radar.";

export const resumeSkillTiers: ResumeSkillTier[] = [
  {
    id: "core",
    title: "Core Skills",
    skills: [
      "Troubleshooting",
      "Robotics systems",
      "Systems diagnostics",
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
    role: "Robotics Technician",
    company: "Barn Owl Precision",
    period: "Current",
    description:
      "Hands-on robotics technician role supporting robotic systems that need to operate accurately and consistently in dust, heat, and day-to-day use.",
    highlights: [
      {
        text: "Bring layer-by-layer troubleshooting habits from simulator support into robotics work, with emphasis on observation, isolation, and repeatable fixes.",
      },
      {
        text: "Apply hardware, Windows, networking, and diagnostic experience in a hands-on equipment context.",
      },
    ],
  },
  {
    role: "Independent Software and Audio Development",
    company: "Self-directed",
    period: "2022 - Present",
    description:
      "Self-directed web software and audio DSP projects, plus original music, maintained around full-time work with public notes on scope, decisions, and limits.",
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
    company: "Auxillium",
    period: "April 2024 - 2026",
    description:
      "Supported complex simulator systems remotely, often with incomplete logs and limited direct hardware access.",
    highlights: [
      {
        text: "Built repeatable triage notes for recurring failure patterns so similar tickets started from the right isolation steps instead of from scratch.",
        href: "/projects/full-swing-tech-support",
      },
      {
        text: "Worked through customer-facing simulator issues by isolating symptoms, testing likely causes, and documenting repeatable fixes.",
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
