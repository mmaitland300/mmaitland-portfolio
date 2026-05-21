import { getResearchRadarDemoUrl } from "@/lib/research-radar";
import { getSnakeDemoUrl } from "@/lib/snake-demo";

const snakeDemoUrl = getSnakeDemoUrl();
const researchRadarDemoUrl = getResearchRadarDemoUrl();

export type ProjectCategory = "featured" | "experiment";
export type ProjectStatus =
  | "in-progress"
  | "operational"
  | "live-site"
  | "live-prototype"
  | "live-demo"
  | "current-role"
  | "source-installable"
  | "desktop-prototype"
  | "shipped"
  | "archived";
export type ProofLinkKind =
  | "repo"
  | "test"
  | "ci"
  | "post"
  | "case-study"
  | "product-page"
  | "artifact"
  | "release"
  | "walkthrough"
  | "workflow";

export interface ProofLink {
  label: string;
  href: string;
  kind?: ProofLinkKind;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  problem?: string;
  constraints?: string;
  tradeoff?: string;
  role?: string;
  outcome?: string;
  status?: ProjectStatus;
  evidence?: string;
  knownLimits?: string;
  proofLinks?: ProofLink[];
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  /** Primary CTA when `demo` is an on-site path (default: "Visit product page"). */
  demoCtaLabel?: string;
  caseStudy?: string;
  iframe?: string;
  category: ProjectCategory;
}

/** Homepage grid: practical tooling first, then support, research, and audio work. */
export const HOMEPAGE_FEATURED_SLUGS = [
  "smart-project-backup",
  "full-swing-tech-support",
  "research-radar",
  "stringflux",
] as const;

export type HomepageFeaturedSlug = (typeof HOMEPAGE_FEATURED_SLUGS)[number];

export const projects: Project[] = [
  {
    slug: "stringflux",
    title: "StringFlux",
    description:
      "A multiband granular delay and freeze plugin for guitar. The effect reacts to how you play, not just what you play - pick attacks and sustained lines drive grain scheduling so the texture follows the performance.",
    problem:
      "Most granular processors treat every input the same. For stringed instruments, that means pick attacks get smeared and the effect feels disconnected from the performance.",
    constraints:
      "Real-time audio code cannot rely on mid-buffer rebuilds, allocation-heavy behavior, or vague \"we'll fix it later\" DSP decisions.",
    tradeoff:
      "I've kept the feature set narrow on purpose. Getting the engine stable and the transient response right matters more than adding controls nobody can trust yet.",
    outcome:
      "Still in progress. The current build has 3-band crossover routing, transient-driven grain scheduling, history/freeze capture, and safe 1x/2x/4x oversampling transitions.",
    status: "in-progress",
    evidence:
      "Public DSP case study and decision records document architecture, constraints, a pre-RC validation snapshot, latency data, and current limits. Core implementation details are kept private for licensing and commercial release planning.",
    knownLimits:
      "Validation currently covers one Windows VST3 pre-RC build. CPU table, broader host compatibility, and final release validation are still pending.",
    proofLinks: [
      {
        label: "StringFlux case study",
        href: "/projects/stringflux",
        kind: "case-study",
      },
      {
        label: "Oversampling decision log",
        href: "/blog/stringflux-oversampling-decision-log",
        kind: "post",
      },
      {
        label: "StringFlux public product page",
        href: "/stringflux",
        kind: "product-page",
      },
    ],
    tags: [
      "Audio Plugin",
      "DSP",
      "Granular Synthesis",
      "Transient Detection",
      "Oversampling",
    ],
    image: "/images/stringflux/ui-advanced.png",
    demo: "/stringflux",
    demoCtaLabel: "Product page & beta waitlist",
    caseStudy: "/projects/stringflux",
    category: "featured",
  },
  {
    slug: "research-radar",
    title: "Research Radar",
    description:
      "A working prototype for MIR and audio ML papers: ranked emerging and undercited feeds with visible signal breakdowns, plus paper detail, trends, evaluation, and bridge experiments.",
    problem:
      "Paper discovery tools often hide the signals behind ranking. I wanted ranked lists where those signals are visible so you can compare versions without guessing what moved.",
    constraints:
      "Solo prototype, curated corpus, no human-labeled relevance benchmark, and ranking claims limited to visible signals and baseline comparisons.",
    tradeoff:
      "I focused first on saving ranking runs, exposing signal breakdowns, and making the prototype understandable before pushing harder on more experimental ranking ideas.",
    outcome:
      "The current prototype has working emerging and undercited feeds, paper detail with similar papers, a trends view, an evaluation page for comparing output against simple baselines, and a separate bridge experiment.",
    status: "live-prototype",
    evidence:
      "The strongest stable claim today is that the prototype makes its ranking behavior visible and understandable over a curated set of MIR and audio ML papers.",
    knownLimits:
      "Bridge is an experimental view separate from the main recommender; semantic similarity only appears in runs where the UI labels it; the corpus is still narrower than the long-term plan.",
    proofLinks: [
      {
        label: "Research Radar case study",
        href: "/projects/research-radar",
        kind: "case-study",
      },
      {
        label: "Research Radar source repo",
        href: "https://github.com/mmaitland300/Research-Radar",
        kind: "repo",
      },
      {
        label: "Technical brief and evaluation notes",
        href: "https://github.com/mmaitland300/Research-Radar/blob/main/docs/reviewer-brief.md",
        kind: "post",
      },
      {
        label: "Ranked recommendation tests",
        href: "https://github.com/mmaitland300/Research-Radar/blob/main/apps/api/tests/test_recommendations_ranked.py",
        kind: "test",
      },
      {
        label: "Evaluation compare tests",
        href: "https://github.com/mmaitland300/Research-Radar/blob/main/apps/api/tests/test_evaluation_compare.py",
        kind: "test",
      },
    ],
    tags: [
      "Next.js",
      "FastAPI",
      "Postgres",
      "pgvector",
      "Python",
      "Ranking",
    ],
    github: "https://github.com/mmaitland300/Research-Radar",
    demo: researchRadarDemoUrl,
    image: "/images/projects/research-radar/recommended-emerging.png",
    caseStudy: "/projects/research-radar",
    category: "featured",
  },
  {
    slug: "portfolio-site",
    title: "mmaitland.dev",
    description:
      "The site where I keep project writeups, music, blog notes, and things I am learning. It uses Next.js 16 with typed content, a Resend contact flow, graceful database fallbacks, and a GitHub OAuth admin inbox for managing submissions.",
    problem:
      "GitHub alone was a weak container for case studies, limits, and supporting links. I also needed contact that survives spam without turning into extra maintenance work, plus a stack I could iterate on without fearing every deploy.",
    constraints:
      "Solo-maintained site, so the moving parts have to stay small. No dedicated backend: managed services (Resend for email, Upstash for rate limiting, Neon for Postgres) handle the heavy parts.",
    tradeoff:
      "Server Actions plus Resend, Upstash, and Neon keep the site small; the trade is accepting vendor-shaped limits I can live with on a personal site.",
    outcome:
      "Live at mmaitland.dev with honeypot + Redis rate limiting on contact, GitHub OAuth admin gating, and MDX blog with draft protection.",
    status: "live-site",
    evidence:
      "The case study and decision record document the contact flow, admin path, CI, and smoke tests.",
    knownLimits:
      "Some route-level dynamic behavior remains broader than needed and will be narrowed in later optimization work.",
    proofLinks: [
      {
        label: "mmaitland.dev build notes",
        href: "/projects/portfolio-site",
        kind: "case-study",
      },
      {
        label: "Contact decision record",
        href: "/blog/contact-pipeline-decision-record",
        kind: "post",
      },
      {
        label: "Route smoke tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/e2e/routes.spec.ts",
        kind: "test",
      },
      {
        label: "Environment parsing tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/src/lib/env.test.ts",
        kind: "test",
      },
      {
        label: "Contact action tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/src/actions/contact.test.ts",
        kind: "test",
      },
      {
        label: "CI workflow",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/.github/workflows/ci.yml",
        kind: "ci",
      },
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Auth.js",
      "Upstash",
      "MDX",
    ],
    github: "https://github.com/mmaitland300/mmaitland-portfolio",
    image: "/images/projects/portfolio-site-projects.png",
    caseStudy: "/projects/portfolio-site",
    category: "featured",
  },
  {
    slug: "full-swing-tech-support",
    title: "Full Swing Technical Support",
    description:
      "My day job. I work at Auxillium supporting Full Swing simulator customers remotely. Many setups also run Laser Shot or E6 Golf from TruGolf, which I support on the same tickets. This case study documents the triage approach I've built from that work.",
    problem:
      "Simulator issues rarely have one cause. A customer reports \"the ball isn't tracking\" and the root cause could be calibration drift, a licensing timeout, a network config problem, or a Windows update that broke a driver.",
    constraints:
      "Remote support, incomplete logs, frustrated users, mixed hardware/software/network symptoms, and privacy limits on public detail.",
    tradeoff:
      "More time upfront on isolation and logging pays back when the same failure signature shows up again: you reopen the checklist instead of re-deriving the path from memory.",
    role: "Technical support specialist at Auxillium. Scope is Full Swing simulator deployments plus Laser Shot and E6 Golf from TruGolf when those are part of the install.",
    outcome:
      "Built repeatable triage workflows that I now use across calibration, licensing, display, networking, and OS subsystems. Documented publicly as a case study.",
    status: "current-role",
    evidence:
      "Public case study includes workflow artifact, representative incident pattern, and troubleshooting playbook linkage.",
    knownLimits:
      "Customer-identifying details and hard incident counts are intentionally excluded due to privacy and support constraints.",
    proofLinks: [
      {
        label: "Full Swing case study",
        href: "/projects/full-swing-tech-support",
        kind: "case-study",
      },
      {
        label: "Troubleshooting playbook",
        href: "/blog/troubleshooting-playbook-multi-layer-failures",
        kind: "post",
      },
    ],
    tags: [
      "Technical Support",
      "Troubleshooting",
      "Windows",
      "Networking",
      "Hardware/Software Integration",
    ],
    image: "/images/projects/full-swing-triage-artifact.svg",
    caseStudy: "/projects/full-swing-tech-support",
    category: "featured",
  },
  {
    slug: "smart-project-backup",
    title: "Smart Project Backup",
    description:
      "Source-installable Python CLI for incremental project backups. It hashes files with SHA-256, copies only new or changed content, tracks state in SQLite manifests, and can watch a configured source tree for DAW-style save bursts.",
    problem:
      "Manual project backups are easy to skip and hard to trust when large creative folders change in small bursts.",
    outcome:
      "Milestone build with manual backup, config defaults, watch mode, Linux/Windows CI, and restore-safety guidance in the README.",
    status: "source-installable",
    evidence:
      "Public repo includes CLI usage, source release notes, tests, CI, config behavior, watch-mode behavior, and restore-safety notes.",
    knownLimits:
      "The v0.2.0 source release is published; no PyPI package, standalone installer, or packaged app yet. Restore flow should be tested on copies before relying on it for active projects.",
    proofLinks: [
      {
        label: "Source repo",
        href: "https://github.com/mmaitland300/DAWBackup",
        kind: "repo",
      },
      {
        label: "v0.2.0 source release",
        href: "https://github.com/mmaitland300/DAWBackup/releases/tag/v0.2.0",
        kind: "release",
      },
      {
        label: "Workflow walkthrough",
        href: "https://github.com/mmaitland300/DAWBackup/blob/main/docs/workflow-walkthrough.md",
        kind: "workflow",
      },
      {
        label: "CLI tests",
        href: "https://github.com/mmaitland300/DAWBackup/blob/main/tests/test_cli.py",
        kind: "test",
      },
      {
        label: "CI workflow",
        href: "https://github.com/mmaitland300/DAWBackup/blob/main/.github/workflows/ci.yml",
        kind: "ci",
      },
    ],
    tags: ["Python", "CLI", "SQLite", "Backups", "File Watching"],
    github: "https://github.com/mmaitland300/DAWBackup",
    category: "experiment",
  },
  {
    slug: "snake-detector",
    title: "Snake Detector",
    description:
      "Narrow snake vs no-snake computer vision with a reproducible training and evaluation workflow, explicit limits, and a public case study plus training repo.",
    problem:
      "The original prototype was easy to overstate: noisy data, uneven image quality, and weak licensing assumptions made headline accuracy a bad proxy for operational reliability.",
    outcome:
      "Scripted training and evaluation with inspectable artifacts; limits and disclaimers are documented in the case study.",
    status: "live-demo",
    evidence:
      "Public case study, reproducible CLI flow, saved artifact, and demo boundary that avoids redistributing third-party images.",
    knownLimits:
      "Demo is a narrow snake vs no-snake experiment and should not be treated as species identification or field-safe classification.",
    proofLinks: [
      {
        label: "Snake Detector case study",
        href: "/projects/snake-detector",
        kind: "case-study",
      },
      {
        label: "Training repo",
        href: "https://github.com/mmaitland300/Snake-detector",
        kind: "repo",
      },
    ],
    tags: ["Python", "Machine Learning", "CNN", "Computer Vision"],
    demo: snakeDemoUrl,
    github: "https://github.com/mmaitland300/Snake-detector",
    caseStudy: "/projects/snake-detector",
    category: "experiment",
  },
  {
    slug: "sample-organizer",
    title: "Sample Library Organizer",
    description:
      "A local-first PyQt desktop app for scanning, tagging, previewing, and cleaning up large sample and audio libraries without uploading media.",
    status: "desktop-prototype",
    evidence:
      "The repo includes dark-mode screenshots, a workflow walkthrough, setup checks, scoped CI, and explicit packaging limits.",
    knownLimits:
      "Not packaged as a consumer installer yet. Setup is still developer-oriented and can depend on local Python/audio-library behavior.",
    proofLinks: [
      {
        label: "Visual walkthrough",
        href: "https://github.com/mmaitland300/musicians-organizer#visual-walkthrough",
        kind: "walkthrough",
      },
      {
        label: "Workflow walkthrough",
        href: "https://github.com/mmaitland300/musicians-organizer/blob/main/docs/workflow-walkthrough.md",
        kind: "workflow",
      },
      {
        label: "CI workflow",
        href: "https://github.com/mmaitland300/musicians-organizer/blob/main/.github/workflows/ci.yml",
        kind: "ci",
      },
    ],
    image: "/images/projects/sample-organizer-loaded.png",
    tags: ["Python", "PyQt", "SQLite", "Audio"],
    github: "https://github.com/mmaitland300/musicians-organizer",
    category: "experiment",
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.category === "featured");
}

/** Curated subset for the homepage hero grid. */
export function getHomepageFeaturedProjects(): Project[] {
  return HOMEPAGE_FEATURED_SLUGS.map((slug) => {
    const p = projects.find((x) => x.slug === slug);
    if (!p) {
      throw new Error(`Homepage featured slug missing from data: ${slug}`);
    }
    return p;
  });
}

export function getExperiments() {
  return projects.filter((p) => p.category === "experiment");
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Slugs that have a case-study page and accept comments. */
export function getCommentableSlugs(): Set<string> {
  return new Set(
    projects.filter((p) => p.caseStudy).map((p) => p.slug)
  );
}
