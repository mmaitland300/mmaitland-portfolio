"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fade = {
    initial: false as const,
    animate: { opacity: 1, y: 0 },
  };
  const fadeTrans = (delay: number) => ({
    duration: reduceMotion ? 0.01 : 0.55,
    delay: reduceMotion ? 0 : delay,
    ease: "easeOut" as const,
  });

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden pb-16 md:pb-20">
      <div className="accent-frame mx-auto max-w-6xl px-6 py-24 text-center sm:py-28 md:py-32">
        <motion.div
          {...fade}
          transition={fadeTrans(0)}
        >
          <div className="accent-pill mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/90 backdrop-blur-sm">
            <span className="accent-pill-dot shrink-0" />
            Robotics Systems - Web Software - Audio DSP
          </div>
        </motion.div>

        <motion.h1
          {...fade}
          transition={fadeTrans(0.08)}
          className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="hero-lead">Hi, I&apos;m</span>{" "}
          <span className="accent-title hero-name">Matt Maitland</span>
        </motion.h1>

        <motion.h2
          {...fade}
          transition={fadeTrans(0.12)}
          className="mt-5 mx-auto max-w-4xl text-2xl font-semibold leading-tight text-foreground/95 sm:text-3xl"
        >
          I work in robotics. Outside of work, I build software and audio tools,
          and I write and produce music.
        </motion.h2>

        <motion.p
          {...fade}
          transition={fadeTrans(0.16)}
          className="mt-6 mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          I currently work as a Robotics Technician at Barn Owl Precision.
          Before that, I supported complex golf simulator systems. This site is
          where I share software projects, audio DSP work, research experiments,
          technical notes, and music.
        </motion.p>

        <motion.div
          {...fade}
          transition={fadeTrans(0.18)}
          className="mx-auto mt-5 max-w-xl space-y-1.5 text-center text-sm leading-relaxed text-muted-foreground/90 sm:text-base"
        >
          <p>
            <Link
              href="/stringflux"
              className="font-medium text-foreground/90 underline-offset-4 hover:underline"
            >
              StringFlux
            </Link>
            <span className="text-muted-foreground">
              {" "}
              - JUCE plugin: transient-aware granular delay and freeze for guitar
            </span>
          </p>
          <p>
            <Link
              href="/music"
              className="font-medium text-foreground/90 underline-offset-4 hover:underline"
            >
              NEUROCHEMICAL ENTROPY
            </Link>
            <span className="text-muted-foreground">
              {" "}
              - original music (write, record, produce, master)
            </span>
          </p>
        </motion.div>

        <motion.p
          {...fade}
          transition={fadeTrans(0.2)}
          className="mt-4 mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          I tend to work methodically: understand the problem, change one thing
          at a time, and keep notes on what worked and what did not.{" "}
          <Link
            href="/projects"
            className="text-foreground/90 underline-offset-4 hover:underline"
          >
            Case studies
          </Link>
          {" and "}
          <Link
            href="/blog"
            className="text-foreground/90 underline-offset-4 hover:underline"
          >
            blog posts
          </Link>
          {" show that process in more detail."}
        </motion.p>

        <motion.div
          {...fade}
          transition={fadeTrans(0.24)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className={buttonVariants({
              variant: "brandCta",
              size: "lg",
            })}
          >
            Browse case studies <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/resume"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View resume
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Contact me
          </Link>
        </motion.div>

        <motion.div
          {...fade}
          transition={fadeTrans(0.32)}
          className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <a
            href="https://github.com/mmaitland300"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Link href="/music" className="hover:text-foreground transition-colors">
            Music
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reduceMotion ? 0 : 0.72,
            duration: reduceMotion ? 0.01 : 0.65,
          }}
          className="mt-10 flex justify-center sm:mt-12"
          aria-hidden={true}
        >
          {reduceMotion ? (
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/30 pt-2">
              <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
            </div>
          ) : (
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              }}
              className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/30 pt-2"
            >
              <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
