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

// Role names confirmed by Matt in September 2026. Add detailed employment
// entries once the employer, start dates, and publishable scope are confirmed.
export const professionalIntro =
  "I work in regional management and as a software engineer with an ML team. My background includes robotics, systems troubleshooting, and technical support.";

export const siteDescription =
  "Regional management, software engineering with an ML team, and a background in robotics. Projects in web software, audio DSP, and original music.";

export const resumeSummary =
  "Regional Manager and Software Engineer working with an ML team. Background in robotics, systems diagnostics, and technical support across Windows, Linux, networks, and connected hardware. Independent projects include TypeScript web applications, JUCE/C++ audio tools, and original music.";

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
    period: "Earlier experience",
    description:
      "Supported robotic systems operating in dust, heat, and daily field use.",
    highlights: [
      {
        text: "Applied hardware, Windows, and networking experience through observation, fault isolation, and repeatable diagnostics.",
      },
    ],
  },
  {
    role: "Independent Software and Audio Development",
    company: "Self-directed",
    period: "2022 - Present",
    description:
      "Develop web software and audio DSP tools alongside writing, recording, and producing original music.",
    highlights: [
      {
        text: "Built mmaitland.dev with typed content, CI, smoke tests, contact validation, rate limiting, and optional admin workflows.",
        href: "https://www.mmaitland.dev",
      },
      {
        text: "Building StringFlux in JUCE/C++ for stable real-time audio processing.",
        href: "https://www.mmaitland.dev/stringflux",
      },
      {
        text: "Document design decisions, test results, and next steps in case studies and technical notes.",
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
        text: "Documented recurring failures and repeatable triage steps.",
        href: "/projects/full-swing-tech-support",
      },
      {
        text: "Diagnosed customer-facing simulator faults remotely through isolation and testing.",
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
