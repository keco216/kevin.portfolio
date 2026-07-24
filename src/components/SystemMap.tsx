"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { content } from "@/data/content";

const EASE: [number, number, number, number] = [0.21, 0.65, 0.35, 1];

export function SystemMap() {
  return (
    <section id="system" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-20">
        <SectionLabel
          index="03"
          label="System Map"
          aside="Interface → Infrastruktur"
        />

        <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-end">
          <Reveal className="min-w-0 lg:col-span-2">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-accent">
              {content.system.eyebrow}
            </p>
            <h2 className="max-w-[82rem] text-balance font-display text-[clamp(1.5rem,7vw,2.05rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.055em] md:text-[clamp(2.05rem,6vw,6.7rem)]">
              {content.system.headline}
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="min-w-0 lg:col-start-2 lg:justify-self-end"
          >
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              {content.system.description}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-16 md:mt-24">
          <div className="technical-grid relative overflow-hidden rounded-[1.75rem] border border-card-border bg-card p-5 shadow-[0_30px_100px_rgb(0_0_0/0.28)] md:p-8 lg:p-10">
            <div className="flex flex-col gap-5 border-b border-card-border pb-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
                </span>
                Keco local network
              </p>
              <p>Route status / operational</p>
            </div>

            <div className="relative mt-8 md:mt-12">
              <div
                aria-hidden="true"
                className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-card-border lg:block"
              >
                <motion.div
                  className="h-full origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
                />
              </div>

              <ol className="grid gap-4 lg:grid-cols-5">
                {content.system.steps.map((step, index) => (
                  <motion.li
                    key={step.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.12 * index,
                      ease: EASE,
                    }}
                    className="group relative rounded-2xl border border-card-border bg-background/85 p-5 backdrop-blur transition-colors duration-300 hover:border-accent/70 lg:pt-16"
                  >
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-card font-mono text-xs font-semibold text-accent lg:absolute lg:left-1/2 lg:top-0 lg:z-10 lg:-translate-x-1/2 lg:-translate-y-1/2">
                      {step.label}
                    </span>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-card-border pt-6 md:mt-10">
              {content.system.protocols.map((protocol) => (
                <span
                  key={protocol}
                  className="rounded-full border border-card-border bg-background/65 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted"
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
