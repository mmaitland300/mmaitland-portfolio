import type { Metadata } from "next";
import Link from "next/link";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { Suspense } from "react";
import {
  ArrowLeft,
  AudioLines,
  Gauge,
  Layers3,
  Network,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { StringFluxSignalDiagram } from "@/components/case-studies/stringflux-signal-diagram";
import { CaseStudyEvidenceFooter } from "@/components/sections/case-study-evidence-footer";
import { ProjectComments } from "@/components/sections/project-comments";
import { getProjectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/stringflux" },
  title: "StringFlux DSP Case Study",
  description:
    "A technical deep-dive on StringFlux: transient-aware multiband granular delay architecture, limits, and implementation tradeoffs.",
};

export const dynamic = "force-dynamic";

const architecture = [
  "Dry/wet path split with wet-only advanced processing",
  "3-band crossover before grain generation",
  "Host-rate history rings used as grain/freeze source buffers",
  "Grain bus shaper for harmonic character control",
  "FeedbackBus reinjection at host rate",
  "Mix -> Gain -> Limiter -> Output final stage",
];

const schedulers = [
  "Density-driven scheduler for baseline grain cloud behavior",
  "Transient-driven scheduler for performance-reactive accents",
  "Band-aware source selection from history rings",
  "Shaping controls for grain length, density, pitch, and pan",
];

const constraints = [
  "Real-time safety: oversampling reconfiguration is queued and applied only at safe points.",
  "Latency and responsiveness: transient-following behavior must remain playable for string attacks.",
  "Stability under host variance: processing must tolerate differing host rates and plugin states.",
  "Feature discipline: avoid effect sprawl while core instrument behavior is still being refined.",
];

const oversamplingPolicy = [
  {
    factor: "1x",
    goal: "Baseline CPU; default monitoring path",
    behavior: "No resampler churn; simplest state machine",
  },
  {
    factor: "2x / 4x",
    goal: "Reduce aliasing on nonlinear stages in the wet path",
    behavior: "Reconfiguration queued; applied only at safe boundaries",
  },
];

const tradeoffs = [
  {
    title: "Determinism over feature breadth",
    body: "The engine prioritizes predictable scheduler behavior and stable routing over adding more effect modules early.",
  },
  {
    title: "Safe oversampling transitions over immediate switching",
    body: "Oversampling changes are deferred to safe boundaries to avoid audio-thread instability and state corruption.",
  },
  {
    title: "Playable response over maximal density",
    body: "Scheduler behavior keeps transient attacks readable and leaves headroom before grain density pegs at the ceiling.",
  },
];

const validationChecks = [
  {
    scenario: "Oversampling mode change during active playback",
    observation:
      "Mode switches queue to the next safe boundary so the audio thread never tears down oversamplers mid-callback.",
    whyItMatters:
      "This keeps behavior deterministic and reduces transition instability risk while tuning the wet-path nonlinear stages.",
  },
  {
    scenario: "Repeated transitions across 1x, 2x, and 4x modes in dev sessions",
    observation:
      "Engine state stays recoverable after mode changes, so dev sessions keep moving without bouncing the plugin instance.",
    whyItMatters:
      "Supports practical iteration speed while validating multiband routing and scheduler behavior.",
  },
];

const releaseEvidenceSummary = [
  {
    label: "Build under test",
    value: "v1.0.0-beta / f27ea6d",
    note: "Current main pre-RC validation build, not the final v1.0.0 release build.",
  },
  {
    label: "Format and platform",
    value: "Windows VST3",
    note: "Primary development validation is currently on Windows, with Cubase as the main host.",
  },
  {
    label: "Public release status",
    value: "Not released",
    note: "Validation logs help define the current boundary, but compatibility claims remain provisional until final release validation is rerun.",
  },
];

const automatedValidationResults = [
  {
    check: "pluginval 1.0.4",
    result: "Pass",
    details: "Strictness 10, repeat 200 randomized run, exit code 0.",
  },
  {
    check: "Steinberg VST3 Validator",
    result: "Pass",
    details: "Standalone validator run reported 47 tests passed and 0 failed.",
  },
  {
    check: "VST3 moduleinfo",
    result: "Pass",
    details: "Vendor check found the expected Matt Maitland module metadata.",
  },
  {
    check: "Standalone app smoke flow",
    result: "Pass",
    details:
      "Launch, audio, resize/no-crash, and settings/preset memory were checked on Windows 11.",
  },
];

const latencyResults = [
  {
    mode: "Studio",
    oversampling: "Standard 1x",
    samples: "512",
    milliseconds: "10.7",
    note: "Cubase host-reported insert latency at 48 kHz.",
  },
  {
    mode: "Studio",
    oversampling: "High 2x",
    samples: "305",
    milliseconds: "6.4",
    note: "Host-reported Cubase value; FIR delay is converted from oversampled domain.",
  },
  {
    mode: "Studio",
    oversampling: "Ultra 4x",
    samples: "187",
    milliseconds: "3.9",
    note: "Host-reported Cubase value; lower than 1x/2x because the FIR delay runs oversampled.",
  },
  {
    mode: "Live",
    oversampling: "Forced 1x",
    samples: "0",
    milliseconds: "0.00",
    note: "Live mode exposes forced 1x only; Cubase showed no latency value.",
  },
];

const pendingBeforeStrongerClaims = [
  "CPU table across representative sessions, sample rates, and buffer sizes.",
  "Controlled DSP notes that explain what mode-to-mode response differences mean.",
  "Full Cubase host notes beyond the latency table.",
  "Preset tuning and final v1.0.0 release validation rerun.",
  "A broader DAW compatibility matrix; Cubase is the primary development host for now.",
];

const validationBoundaries = {
  trueNow: [
    "One Windows VST3 pre-RC build has passed pluginval strictness 10 repeat 200 and a standalone Steinberg VST3 Validator run.",
    "Cubase host-reported latency has been captured at 48 kHz for Studio 1x/2x/4x and Live forced-1x modes.",
    "Standalone launch/audio/UI/state validation passed on Windows 11.",
    "Safe oversampling state transitions are implemented and used in active development.",
    "Transient-aware behavior is a current design target in the scheduling model.",
    "Core multiband routing, freeze/history capture, and feedback-bus flow are operational.",
  ],
  beingValidated: [
    "CPU behavior under broader sample-rate, buffer-size, and preset conditions.",
    "Consistency across broader host/session combinations.",
    "Playability under wider performance dynamics and gain staging contexts.",
  ],
  notYetClaimed: [
    "No final release compatibility claim yet.",
    "No public CPU benchmark claim yet.",
    "No broad compatibility guarantee beyond currently tested host/dev setups.",
  ],
};

export default function StringFluxCaseStudyPage() {
  const project = getProjectBySlug("stringflux");
  if (!project) {
    throw new Error("Missing project data for stringflux");
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
            title="StringFlux: DSP Architecture Case Study"
            description="StringFlux is a transient-aware, multiband granular delay and freeze plugin for stringed instruments. The design goal is to turn one performance into layered texture while preserving playable response."
            descriptionClassName="max-w-3xl"
            badges={
              <>
                <Badge variant="secondary">Audio Plugin</Badge>
                <Badge variant="secondary">DSP</Badge>
                <Badge variant="secondary">Granular Synthesis</Badge>
                <Badge variant="secondary">Transient Processing</Badge>
              </>
            }
          />
        </header>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Signal Architecture</h2>
          </div>
          <ul className="space-y-2">
            {architecture.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <StringFluxSignalDiagram />
        </section>

        <section className="mb-10 overflow-x-auto rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Oversampling policy (design table)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Design reference for quality, CPU, and audio-thread safety. CPU
            numbers stay informal until there is a stable build to measure.
          </p>
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Factor</th>
                <th className="py-2 pr-4 font-medium">Goal</th>
                <th className="py-2 font-medium">Engine behavior</th>
              </tr>
            </thead>
            <tbody>
              {oversamplingPolicy.map((row) => (
                <tr key={row.factor} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {row.factor}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.goal}</td>
                  <td className="py-3 text-muted-foreground">{row.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Network className="h-5 w-5 text-brand-violet" />
            <h2 className="text-xl font-semibold">Grain Scheduling Model</h2>
          </div>
          <ul className="space-y-2">
            {schedulers.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Production Constraints</h2>
          </div>
          <ul className="space-y-2">
            {constraints.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Tradeoffs</h2>
          </div>
          <div className="space-y-4">
            {tradeoffs.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-2 text-xl font-semibold">Current Validation Checks</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Pre-RC validation currently covers automated VST3 checks, Cubase
            host-reported latency, and a standalone app smoke flow. These checks
            describe the current development build, not a final release
            compatibility guarantee.
          </p>
          <div className="space-y-3">
            {validationChecks.map((item) => (
              <div
                key={item.scenario}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm"
              >
                <p>
                  <span className="font-medium text-foreground">Scenario: </span>
                  <span className="text-muted-foreground">{item.scenario}</span>
                </p>
                <p className="mt-1">
                  <span className="font-medium text-foreground">
                    Observed behavior:{" "}
                  </span>
                  <span className="text-muted-foreground">{item.observation}</span>
                </p>
                <p className="mt-1">
                  <span className="font-medium text-foreground">
                    Engineering value:{" "}
                  </span>
                  <span className="text-muted-foreground">{item.whyItMatters}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Validation Status</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Current public validation is intentionally bounded. StringFlux is
            still in active development, so this section records what has been
            checked without implying release-level compatibility. The product-page
            screenshots may show a `v0.3-dev` UI label; the build label below refers
            to the validation candidate captured for these checks.
          </p>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {releaseEvidenceSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 font-medium text-foreground">{item.value}</p>
                <p className="mt-1 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Check</th>
                  <th className="py-2 pr-4 font-medium">Result</th>
                  <th className="py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {automatedValidationResults.map((row) => (
                  <tr key={row.check} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {row.check}
                    </td>
                    <td className="py-3 pr-4 text-emerald-400">
                      {row.result}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {row.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 overflow-x-auto rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">
            Cubase host-reported latency
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            These values were captured from Cubase Channel Latency Overview at
            48 kHz. They are host-reported development measurements, not a
            cross-DAW latency guarantee.
          </p>
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Mode</th>
                <th className="py-2 pr-4 font-medium">Oversampling</th>
                <th className="py-2 pr-4 font-medium">Samples</th>
                <th className="py-2 pr-4 font-medium">ms</th>
                <th className="py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {latencyResults.map((row) => (
                <tr
                  key={`${row.mode}-${row.oversampling}`}
                  className="border-b border-border/60"
                >
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {row.mode}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.oversampling}
                  </td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">
                    {row.samples}
                  </td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">
                    {row.milliseconds}
                  </td>
                  <td className="py-3 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">
            Pending before stronger claims
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {pendingBeforeStrongerClaims.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Validation boundary</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-foreground">True now</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {validationBoundaries.trueNow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Being validated</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {validationBoundaries.beingValidated.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Not yet claimed</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {validationBoundaries.notYetClaimed.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <CaseStudyEvidenceFooter
          project={project}
          statusIcon={<AudioLines className="h-5 w-5 text-rose-400" />}
          currentCaseStudyPath="/projects/stringflux"
        />

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="stringflux"
            currentPath="/projects/stringflux"
          />
        </Suspense>
      </div>
    </div>
  );
}
