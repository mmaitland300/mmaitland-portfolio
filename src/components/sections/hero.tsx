import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="accent-frame mx-auto max-w-6xl px-6 pb-16 pt-28 text-center sm:pb-24 sm:pt-36">
        <p className="accent-pill mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/90">
          <span className="accent-pill-dot shrink-0" />
          Software · Robotics · Audio
        </p>
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="hero-lead">Hi, I&apos;m</span>{" "}
          <span className="accent-title hero-name">Matt Maitland</span>
        </h1>
        <h2 className="mx-auto mt-6 max-w-4xl text-2xl font-semibold leading-tight text-foreground/95 sm:text-3xl">
          I work in software development. Outside of work, I build audio tools
          and write and produce music.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          This site is where I share software projects, audio DSP work, research
          experiments, technical notes, and music, along with what I learn while
          making them.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/projects" className={buttonVariants({ variant: "brandCta", size: "lg" })}>
            Browse case studies <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/resume" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View resume
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Contact me
          </Link>
        </div>
        <div className="mx-auto mt-8 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            <Link href="/stringflux" className="font-medium text-foreground underline-offset-4 hover:underline">
              StringFlux
            </Link>{" "}
            is my JUCE/C++ plugin in development for transient-aware granular
            delay and freeze on guitar.
          </p>
          <p>
            <Link href="/music" className="font-medium text-foreground underline-offset-4 hover:underline">
              NEUROCHEMICAL ENTROPY
            </Link>{" "}
            is where I share original music that I write, record, produce, and
            master.
          </p>
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          I work methodically: understand the problem, test one change at a time,
          and keep notes. My{" "}
          <Link href="/projects" className="text-foreground underline-offset-4 hover:underline">
            case studies
          </Link>{" "}
          and{" "}
          <Link href="/blog" className="text-foreground underline-offset-4 hover:underline">
            blog posts
          </Link>{" "}
          show that process in practice.
        </p>
        <a href="https://github.com/mmaitland300" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground">
          GitHub
        </a>
      </div>
    </section>
  );
}
