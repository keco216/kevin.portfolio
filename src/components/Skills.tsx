import { content } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

/**
 * Skills-Sektion: pro Gruppe eine zweifarbige Syne-Überschrift
 * (erstes Wort Creme, Rest gedämpft) und darunter alle Skills
 * als ein kommagetrennter Fließtext-Absatz.
 */
export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-20">
        <SectionLabel
          index="02"
          label="Stack"
          aside="Vom Pixel bis zum Netzwerk"
        />

        <Reveal>
          <h2 className="max-w-5xl text-balance font-display text-[clamp(3rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.055em]">
            Ein Stack für das ganze System.
          </h2>
        </Reveal>

        <ol className="mt-16 border-t border-card-border md:mt-24">
          {content.skillGroups.map((group, index) => (
            <li key={group.title}>
              <Reveal delay={index * 0.1}>
                <article className="group grid gap-6 border-b border-card-border py-9 transition-colors duration-300 hover:border-accent/70 md:grid-cols-[4rem_0.65fr_1.35fr] md:gap-10 md:py-12">
                  <p className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.045em] md:text-4xl">
                      {group.title}
                    </h3>
                    <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
                      {group.skills.length} Werkzeuge
                    </p>
                  </div>
                  <ul className="flex flex-wrap content-start gap-x-4 gap-y-2 text-base leading-relaxed text-muted md:text-lg">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="after:ml-4 after:text-card-border after:content-['/'] last:after:hidden"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
