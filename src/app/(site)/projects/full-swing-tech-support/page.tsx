import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { TriageFlowDiagram } from "@/components/case-studies/triage-flow-diagram";
import { CaseStudyEvidenceFooter } from "@/components/sections/case-study-evidence-footer";
import { ProjectComments } from "@/components/sections/project-comments";
import { getProjectBySlug } from "@/content/projects";

/** Same asset as the Full Swing project card thumbnail. */
const TRIAGE_ARTIFACT_SRC = "/images/projects/full-swing-triage-artifact.svg";

export const metadata: Metadata = {
  title: "Full Swing Technical Support Case Study",
  description:
    "Troubleshooting case study from prior support work with complex simulator systems. Triage, failure isolation, and tradeoffs.",
};

export const dynamic = "force-dynamic";

const failureModes = [
  "Calibration drift impacting ball/club data accuracy",
  "Licensing and activation failures after environment changes",
  "Display and graphics mismatches across GPU/OS updates",
  "Network/configuration instability affecting software behavior",
  "Peripheral and Windows conflicts causing intermittent faults",
];

const workflow = [
  {
    step: "1. Scope and classify symptoms",
    detail:
      "Separate user-reported symptoms from underlying system layers (hardware, licensing, network, OS, graphics) to avoid premature root-cause assumptions.",
  },
  {
    step: "2. Build a reproducible baseline",
    detail:
      "Capture current environment state and reproduce under controlled conditions to reduce noise and identify which variables are actually causal.",
  },
  {
    step: "3. Isolate likely failure paths",
    detail:
      "Use layer-by-layer checks: test one subsystem at a time, log each result, and use those results to narrow the hypothesis list.",
  },
  {
    step: "4. Apply lowest-risk corrective action",
    detail:
      "Prioritize reversible fixes first, then progress to deeper remediations only when diagnostics confirm they are necessary.",
  },
  {
    step: "5. Document and codify pattern",
    detail:
      "Convert resolved incidents into repeatable troubleshooting paths so similar issues are solved faster and with higher consistency.",
  },
];

const representativeIncident = [
  {
    label: "Symptom",
    detail:
      "FS Core reported that it could not communicate with the required Full Swing API service. At first glance this looked like a network outage because the Core-side communication check failed, but the API endpoint was reachable in a browser on the same machine.",
  },
  {
    label: "Candidate causes",
    detail:
      "DNS or ISP issue, firewall or endpoint-security block, expired license/session state, damaged local service state, restricted Windows admin surface, broken WMI namespace/class data, or a vendor-side service issue.",
  },
  {
    label: "Hypothesis elimination path",
    detail:
      "First separate basic internet reachability from application-layer communication. Browser access showed the machine could reach the API endpoint, so the next checks moved to local Windows dependencies: service state, Windows management APIs, WMI namespace availability, endpoint policy, and recent update/security changes.",
  },
  {
    label: "Root cause pattern",
    detail:
      "The failure pointed past whitelist or port-forwarding checks. WMI namespace errors indicated the Windows management layer was damaged or unavailable, which made the simulator stack behave as if external communication had failed even though basic browser access still worked. Use this path only when evidence points at WMI.",
  },
  {
    label: "Fix pattern",
    detail:
      "Run the approved WMI namespace repair batch process, reboot, and re-test Core communication from a clean baseline. In this incident pattern, Core recovered after restart. A changed remote-support ID after reboot was treated as an observed follow-up clue that local Windows management or support-session identity state had been repaired, reset, or reinitialized, not a definitive diagnosis of the exact subsystem that changed.",
  },
  {
    label: "What changed after",
    detail:
      "This became a reusable troubleshooting path: when browser access works but Core still reports API communication failure, check WMI/admin health before assuming firewall, DNS, port forwarding, or vendor API outage.",
  },
];

const hypothesisEliminationRows = [
  {
    symptom: "Intermittent misreads after update window",
    plausibleLayers: "Calibration + GPU/driver + OS mixed state",
    ruledOutBy: "Controlled baseline and display pipeline checks",
    finalPattern: "Mixed-state config after update + calibration mismatch",
  },
  {
    symptom:
      "Core reports API communication failure while a browser on the same machine can still reach the API endpoint",
    plausibleLayers:
      "ISP/DNS, firewall or endpoint block, license/session, local service state, Windows WMI/management layer, vendor API outage",
    ruledOutBy:
      "Browser reachability made a simple external-outage theory less likely; WMI namespace errors pointed at the Windows management layer",
    finalPattern:
      "Damaged or unavailable WMI namespace/management layer; approved WMI namespace repair batch + reboot restored Core communication in this pattern",
  },
];

export default function FullSwingCaseStudyPage() {
  const project = getProjectBySlug("full-swing-tech-support");
  if (!project) {
    throw new Error("Missing project data for full-swing-tech-support");
  }

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

        <header className="mb-12">
          <SectionHeader
            align="left"
            eyebrow="Case Study"
            title="Full Swing Technical Support Case Study"
            description="This case study comes from prior work supporting complex simulator systems. It focuses on how multi-layer issues get diagnosed with remote-only access, incomplete logs, and privacy limits on what can be shared."
            descriptionClassName="max-w-3xl"
            badges={
              <>
                <Badge variant="secondary">Technical Support</Badge>
                <Badge variant="secondary">Troubleshooting</Badge>
                <Badge variant="secondary">Failure Analysis</Badge>
                <Badge variant="secondary">Operational Workflow</Badge>
              </>
            }
          />
        </header>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Problem Context</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Incidents were rarely single-point failures. Most escalations
            involved multiple plausible causes and partial signals, creating a
            high risk of quick but unstable fixes. The key challenge was
            identifying root cause with enough confidence to prevent recurrence.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Common Failure Modes</h2>
          <ul className="space-y-2">
            {failureModes.map((mode) => (
              <li
                key={mode}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {mode}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Diagnostic Workflow</h2>
          </div>
          <figure className="mb-8 overflow-hidden rounded-lg border border-border bg-muted/20">
            <div className="relative aspect-[1200/675] w-full">
              <Image
                src={TRIAGE_ARTIFACT_SRC}
                alt="Hypothesis-driven triage workflow: classify symptoms, build baseline, test likely layers, apply fix, verify, and document"
                fill
                unoptimized
                className="object-contain object-center p-2 sm:p-4"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <figcaption className="border-t border-border bg-card/50 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
              Public triage sketch for multi-layer simulator support, separate
              from Full Swing vendor artwork.
            </figcaption>
          </figure>
          <p className="mb-4 text-sm text-muted-foreground">
            Below is a simplified linear view of the same idea, useful when you
            want a quick read of the end-to-end path.
          </p>
          <TriageFlowDiagram />
          <div className="mt-8 space-y-4">
            {workflow.map((item) => (
              <div key={item.step}>
                <h3 className="text-sm font-medium text-foreground">{item.step}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-2 text-xl font-semibold">
            Representative Incident Pattern
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            This walkthrough composites real escalation patterns into one
            public-safe narrative. Customer-specific details, internal identifiers,
            and proprietary support tooling are intentionally excluded.
          </p>
          <div className="space-y-3">
            {representativeIncident.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm"
              >
                <span className="font-medium text-foreground">{item.label}: </span>
                <span className="text-muted-foreground">{item.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 overflow-x-auto rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Hypothesis elimination table</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            A compact view of how plausible layers are ruled out before locking a
            final cause pattern.
          </p>
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Symptom</th>
                <th className="py-2 pr-4 font-medium">Plausible layers</th>
                <th className="py-2 pr-4 font-medium">What ruled out alternatives</th>
                <th className="py-2 font-medium">Final cause pattern</th>
              </tr>
            </thead>
            <tbody>
              {hypothesisEliminationRows.map((row) => (
                <tr key={row.symptom} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 text-muted-foreground">{row.symptom}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.plausibleLayers}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.ruledOutBy}</td>
                  <td className="py-3 text-muted-foreground">{row.finalPattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Tradeoffs</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The consistent tradeoff was speed versus reliability. Fast,
            one-off fixes could close tickets quickly but often increased
            repeat incidents. A structured, reproducible triage path required
            more discipline up front, but produced better long-term resolution
            quality and lower ambiguity on future cases.
          </p>
        </section>

        <CaseStudyEvidenceFooter
          project={project}
          statusIcon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          currentCaseStudyPath="/projects/full-swing-tech-support"
        />

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="full-swing-tech-support"
            currentPath="/projects/full-swing-tech-support"
          />
        </Suspense>
      </div>
    </div>
  );
}
