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
  company?: string;
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

// Title, employer, and start date verified against the August 11, 2026 offer
// letter. Software development contributions are also confirmed by Matt.
export const professionalIntro =
  "I work in software development. My background includes freelance web development and C++ projects such as StringFlux.";

export const siteDescription =
  "Software developer. Web applications, audio software, and original music.";

export const resumeSummary =
  "Software developer with experience in freelance web development and C++ audio software.";

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
    role: "Regional Manager",
    company: "Barn Owl Precision Agriculture (BOPA)",
    period: "August 2026 - Present",
    description:
      "Manage Colorado deployments and customer support, coordinate with engineering, and contribute to software development and machine learning.",
  },
  {
    role: "Robotics Technician",
    company: "Barn Owl Precision Agriculture (BOPA)",
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
