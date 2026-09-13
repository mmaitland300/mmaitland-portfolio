import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { professionalIntro } from "@/content/resume";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="accent-frame mx-auto max-w-6xl px-6 pb-14 pt-28 text-center sm:pb-20 sm:pt-36">
        <p className="accent-pill mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/90">
          <span className="accent-pill-dot shrink-0" />
          Software · Robotics · Audio
        </p>
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="hero-lead">Hi, I&apos;m</span>{" "}
          <span className="accent-title hero-name">Matt Maitland</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {professionalIntro}
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
        <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Outside work, I build audio tools like{" "}
          <Link href="/stringflux" className="font-medium text-foreground underline-offset-4 hover:underline">
            StringFlux
          </Link>{" "}
          and write and produce music as{" "}
          <Link href="/music" className="font-medium text-foreground underline-offset-4 hover:underline">
            NEUROCHEMICAL ENTROPY
          </Link>.
        </p>
        <a href="https://github.com/mmaitland300" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground">
          GitHub
        </a>
      </div>
    </section>
  );
}
