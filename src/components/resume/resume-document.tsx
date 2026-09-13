import { FileDown, Github, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  contactInfo,
  resumeEducation,
  resumeExperience,
  resumeSkillTiers,
  resumeSummary,
  type ResumeHighlight,
} from "@/content/resume";
import { HighlightText } from "@/components/ui/highlight-text";
import { getResumePdfLinkBase } from "@/lib/site-url";

function resolveHrefForPdf(href: string, pdfLinkBase: string): string {
  if (/^https?:\/\//i.test(href)) {
    return href;
  }
  const base = pdfLinkBase.replace(/\/$/, "");
  return href.startsWith("/") ? `${base}${href}` : `${base}/${href}`;
}

function ResumeHighlightLine({
  highlight,
  print,
  pdfLinkBase,
}: {
  highlight: ResumeHighlight;
  print: boolean;
  pdfLinkBase?: string;
}) {
  if (!highlight.href) {
    return <>{highlight.text}</>;
  }
  const href =
    print && pdfLinkBase
      ? resolveHrefForPdf(highlight.href, pdfLinkBase)
      : highlight.href;
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={
        print
          ? "text-blue-900 underline underline-offset-2"
          : "underline decoration-brand-violet/50 underline-offset-4 transition-colors hover:text-foreground"
      }
    >
      {highlight.text}
    </a>
  );
}

export function ResumeDocument({
  variant,
  publicEmail,
}: {
  variant: "web" | "print";
  publicEmail: string;
}) {
  const pdfLinkBase = variant === "print" ? getResumePdfLinkBase() : undefined;

  if (variant === "print") {
    return (
      <div
        className="resume-print-document mx-auto max-w-[8.5in] px-2 text-[11pt] leading-snug text-neutral-900"
        data-resume-print-ready
      >
        <header className="border-b border-neutral-300 pb-3">
          <h1 className="text-[22pt] font-bold tracking-tight text-neutral-950">
            {contactInfo.name}
          </h1>
          <p className="mt-2 max-w-[6.5in] text-[10pt] leading-snug text-neutral-700">
            {resumeSummary}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9pt] text-neutral-800">
            <a className="text-blue-900 underline" href={`mailto:${publicEmail}`}>
              {publicEmail}
            </a>
            <span className="text-neutral-400" aria-hidden="true">
              |
            </span>
            <span>{contactInfo.location}</span>
            <span className="text-neutral-400" aria-hidden="true">
              |
            </span>
            <a
              className="text-blue-900 underline"
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/mmaitland300
            </a>
          </p>
        </header>

        <section className="mt-4">
          <h2 className="border-b border-neutral-400 pb-0.5 text-[10pt] font-bold uppercase tracking-wider text-neutral-900">
            Experience
          </h2>
          <div className="mt-2 space-y-3">
            {resumeExperience.map((item) => (
              <article
                key={`${item.role}-${item.company}-print`}
                className="break-inside-avoid border-b border-neutral-200 pb-2 last:border-b-0"
              >
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-[11pt] font-bold text-black">
                      {item.role}
                    </h3>
                    {item.company ? (
                      <p className="text-[10pt] text-neutral-700">{item.company}</p>
                    ) : null}
                  </div>
                  <p className="text-[10pt] text-neutral-600 sm:shrink-0 sm:text-right">
                    {item.period}
                  </p>
                </div>
                <p className="mt-1 text-[10pt] leading-snug text-neutral-800">
                  {item.description}
                </p>
                {item.highlights && item.highlights.length > 0 ? (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10pt] text-neutral-800">
                    {item.highlights.map((highlight, index) => (
                      <li key={`${highlight.text}-${index}`}>
                        <ResumeHighlightLine
                          highlight={highlight}
                          print
                          pdfLinkBase={pdfLinkBase}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 break-inside-avoid">
          <h2 className="border-b border-neutral-400 pb-0.5 text-[10pt] font-bold uppercase tracking-wider text-neutral-900">
            Skills
          </h2>
          <div className="mt-2 space-y-2">
            {resumeSkillTiers.map((tier) => (
              <div key={tier.id}>
                <p className="text-[10pt] font-semibold text-neutral-900">
                  {tier.title}
                </p>
                <p className="text-[10pt] leading-snug text-neutral-800">
                  {tier.skills.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 break-inside-avoid">
          <h2 className="border-b border-neutral-400 pb-0.5 text-[10pt] font-bold uppercase tracking-wider text-neutral-900">
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {resumeEducation.map((item) => (
              <article key={`${item.degree}-${item.school}`}>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-[11pt] font-semibold text-neutral-950">
                      {item.degree}
                    </h3>
                    <p className="text-[10pt] text-neutral-700">{item.school}</p>
                  </div>
                  <p className="text-[10pt] text-neutral-600 sm:shrink-0 sm:text-right">
                    {item.period}
                  </p>
                </div>
                {item.description ? (
                  <p className="mt-1 text-[10pt] leading-snug text-neutral-800">
                    {item.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Resume
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {contactInfo.name}
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">{resumeSummary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all outline-none select-none",
              "hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
            )}
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </a>
          <a
            href={`mailto:${publicEmail}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            {publicEmail}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {contactInfo.location}
          </span>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            github.com/mmaitland300
          </a>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Experience</h2>
        <div className="mt-5 space-y-6">
          {resumeExperience.map((item) => (
            <article
              key={`${item.role}-${item.company}`}
              className="rounded-xl border border-border bg-card/40 p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-bold text-foreground">{item.role}</h3>
                  {item.company ? (
                    <p className="text-sm text-brand-violet">{item.company}</p>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{item.period}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              {item.highlights && item.highlights.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {item.highlights.map((highlight, index) => (
                    <li
                      key={`${highlight.text}-${index}`}
                      className="text-sm text-muted-foreground pl-3 relative before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-brand-violet/50"
                    >
                      <HighlightText highlight={highlight} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="mt-4 space-y-5">
          {resumeSkillTiers.map((tier) => (
            <article key={tier.id}>
              <h3 className="text-sm font-medium text-foreground">{tier.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <span
                    key={`${tier.id}-${skill}`}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Education</h2>
        <div className="mt-5 space-y-5">
          {resumeEducation.map((item) => (
            <article key={`${item.degree}-${item.school}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.degree}</h3>
                  <p className="text-sm text-muted-foreground">{item.school}</p>
                </div>
                <p className="text-sm text-muted-foreground">{item.period}</p>
              </div>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
