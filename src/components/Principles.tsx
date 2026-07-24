import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { content } from "@/data/content";

export function Principles() {
  return (
    <section id="principles" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-20">
        <SectionLabel
          index="05"
          label="Arbeitsweise"
          aside="Was hinter dem Code zählt"
        />

        <Reveal>
          <h2 className="max-w-6xl text-balance font-display text-[clamp(2.1rem,8vw,8rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.055em]">
            <span className="block">Klar bauen.</span>
            <span className="block text-right">Solide betreiben.</span>
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-card-border md:mt-24">
          {content.principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.08}>
              <article className="group grid gap-5 border-b border-card-border py-8 transition-colors duration-300 hover:border-accent/60 md:grid-cols-[5rem_0.9fr_1.1fr] md:items-start md:gap-10 md:py-12">
                <p className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.035em] md:text-4xl">
                  {principle.title}
                </h3>
                <p className="max-w-xl text-lg leading-relaxed text-muted md:justify-self-end">
                  {principle.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
