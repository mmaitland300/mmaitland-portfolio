import type { Metadata } from "next";
import Link from "next/link";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { Suspense } from "react";
import {
  ArrowLeft,
  BarChart3,
  FlaskConical,
  ListChecks,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/github-icon";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectComments } from "@/components/sections/project-comments";
import { MlEvalWorkflowDiagram } from "@/components/case-studies/ml-eval-workflow-diagram";
import { getProjectBySlug } from "@/content/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/snake-detector" },
  title: "Snake Detector: Narrow CV Demo",
  description:
    "A snake vs no-snake demo with a reproducible training workflow, explicit limits, and saved evaluation artifacts. Scope stops short of species ID or field wildlife workflows.",
};

export const dynamic = "force-dynamic";

const artifactTable = [
  {
    artifact: "Stratified train/val split",
    purpose:
      "Keep class ratios stable so headline metrics track the same class mix across runs.",
  },
  {
    artifact: "Augmentation policy (logged)",
    purpose:
      "Log image-level changes so augmentation stays comparable run to run.",
  },
  {
    artifact: "Confusion matrix + structured error review",
    purpose:
      "Surface which classes get confused before touching model depth or width.",
  },
  {
    artifact: "Run folder (config + metrics snapshot)",
    purpose:
      "Reproduce any reported number without guessing which code version produced it.",
  },
];

const currentModelMetrics = [
  { label: "Release", value: "v1.1.0-real-dataset" },
  { label: "Held-out test split", value: "1,283 images" },
  { label: "Decision threshold", value: "0.76" },
  { label: "Accuracy", value: "0.9026" },
  { label: "Snake recall", value: "0.6667" },
];

const currentModelLinks = [
  {
    label: "GitHub model release",
    href: "https://github.com/mmaitland300/Snake-detector/releases/tag/v1.1.0-real-dataset",
  },
  {
    label: "Model card",
    href: "https://github.com/mmaitland300/Snake-detector/blob/main/MODEL_CARD.md",
  },
  {
    label: "Dataset card",
    href: "https://github.com/mmaitland300/Snake-detector/blob/main/DATASET_CARD.md",
  },
];

const ctaBaseClassName =
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px";
const ctaDefaultClassName =
  "bg-primary px-2.5 py-2 text-primary-foreground";
const ctaOutlineClassName =
  "border-border bg-background px-2.5 py-2 hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50";
const ctaGhostClassName =
  "px-2.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50";

export default function SnakeDetectorCaseStudyPage() {
  const project = getProjectBySlug("snake-detector");
  if (!project?.github) {
    throw new Error("Missing project data for snake-detector");
  }
  const demoUrl = project.demo;

  return (
    <div className="py-24">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <header className="mb-10">
          <SectionHeader
            align="left"
            eyebrow="Case Study"
            title="Snake Detector: a narrow computer-vision demo with a reproducible workflow"
            description={`This project started as a model experiment. The workflow, dataset boundary, and limitations are explicit so the story stays honest for readers of the case study and anyone reproducing from the repo.${demoUrl ? " A live demo runs on a separate host so you can try uploads in the browser." : " The case study and training repository show the reproducible path from code to artifacts."}`}
            descriptionClassName="max-w-3xl leading-relaxed"
            badges={
              <>
                <Badge variant="secondary">Computer Vision</Badge>
                <Badge variant="secondary">CNN</Badge>
                <Badge variant="secondary">Evaluation</Badge>
                <Badge variant="secondary">Experiment</Badge>
              </>
            }
            actions={
              <>
                {demoUrl ? (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      ctaBaseClassName,
                      ctaDefaultClassName,
                      "gap-2"
                    )}
                  >
                    <ExternalLink size={16} />
                    Try live demo
                  </a>
                ) : (
                  <p className="max-w-md text-sm text-muted-foreground">
                    No public demo link is configured right now. Use the
                    workflow artifacts and repository below for reproduction.
                  </p>
                )}
                <a
                  href="#evaluation-artifacts"
                  className={cn(ctaBaseClassName, ctaOutlineClassName)}
                >
                  View workflow artifacts
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(ctaBaseClassName, ctaGhostClassName)}
                >
                  <GitHubIcon size={16} className="mr-1.5" />
                  Code
                </a>
              </>
            }
          />
        </header>

        <section
          className="mb-10 rounded-xl border border-amber-500/35 bg-amber-500/5 p-6"
          aria-labelledby="known-limits-heading"
        >
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <h2 id="known-limits-heading" className="text-xl font-semibold">
              Known limits
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.knownLimits}
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Try it</h2>
          {demoUrl ? (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Open the{" "}
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-cyan underline-offset-4 hover:underline"
                >
                  live demo
                </a>{" "}
                in a new tab. Upload a photo and get a narrow snake vs no-snake
                prediction from the current public build.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Note: the demo may take a few seconds to wake on first load while
                the host cold-starts.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use the{" "}
              <a
                href="#evaluation-artifacts"
                className="text-brand-cyan underline-offset-4 hover:underline"
              >
                workflow artifacts
              </a>{" "}
              and training repository to inspect artifacts and reproduce evaluation
              runs in your own environment.
            </p>
          )}
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Current public model</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The live demo uses a real-photo iNaturalist-trained Keras model. The
            model file stays out of normal git history, but the release package
            mirrors the model, deployment config, held-out metrics, threshold
            sweep, confusion matrix, training curves, sample predictions, and
            checksum manifest.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {currentModelMetrics.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/70 bg-background/40 p-3"
              >
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The held-out split is 255 snake images and 1,028 no-snake images at
            threshold 0.76. The snake recall number is why this page keeps the
            safety boundary explicit: the demo can miss snakes and is not
            field-safe wildlife software.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {currentModelLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-cyan underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">What the demo shows</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {demoUrl ? (
              <li>
                <span className="font-medium text-foreground/90">
                  Deployment and inference path:
                </span>{" "}
                a working public endpoint with limited inputs and outputs.
              </li>
            ) : (
              <li>
                <span className="font-medium text-foreground/90">
                  Deployment and inference path:
                </span>{" "}
                there is no in-browser demo linked from this site; scripts and
                saved artifacts in the repository define the inference boundary and how
                to run it.
              </li>
            )}
            <li>
              <span className="font-medium text-foreground/90">
                Reproducibility:
              </span>{" "}
              the training and evaluation loop is scripted; artifacts and the repo
              back the story on this page.
            </li>
            <li>
              It is{" "}
              <span className="font-medium text-foreground/90">not</span>{" "}
              field-ready wildlife identification, species-level reliability, or
              licensing-cleared training data suitable for commercial redistribution.
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">How to use it</h2>
          {demoUrl ? (
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Upload one image through the demo UI.</li>
              <li>Review the prediction and confidence framing shown in the app.</li>
              <li>
                Read the known limits above before trusting the output for anything
                beyond a narrow experiment.
              </li>
            </ol>
          ) : (
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>
                Open the workflow artifacts and training repo to understand
                splits, metrics, and limits.
              </li>
              <li>
                Reproduce or adapt the workflow locally from the repo when you need
                numbers you can defend.
              </li>
              <li>
                Cross-check results against the known limits before treating output
                as reliable outside a narrow experiment.
              </li>
            </ol>
          )}
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Why the project matters</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Most of the value is in dataset hygiene, fixed evaluation splits,
            confusion-driven review, and refusing to let aggregate accuracy hide
            weak classes. That discipline transfers directly to larger vision
            projects where bad predictions fail quietly in production.
          </p>
        </section>

        <section
          id="evaluation-artifacts"
          className="mb-10 scroll-mt-16 rounded-xl border border-border bg-card/40 p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-brand-violet" />
            <h2 className="text-xl font-semibold">Workflow artifacts</h2>
          </div>
          <MlEvalWorkflowDiagram />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Artifact</th>
                  <th className="py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {artifactTable.map((row) => (
                  <tr key={row.artifact} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {row.artifact}
                    </td>
                    <td className="py-3 text-muted-foreground">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Where it stands</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The repo holds the full training flow, split configuration, and
            evaluation scripts.
            {demoUrl
              ? " The live demo is intentionally narrow so visitors can try the behavior without mistaking it for a general-purpose classifier."
              : " This site leans on the repository artifacts when no demo URL is configured."}
          </p>
        </section>

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="snake-detector"
            currentPath="/projects/snake-detector"
          />
        </Suspense>
      </div>
    </div>
  );
}
