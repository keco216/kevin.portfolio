import { content } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

/**
 * About-Sektion: große Display-Headline plus gestaffelt
 * einblendende Absätze aus content.about.
 */
export function About() {
  const [headlineStart, headlineEnd] = content.about.headline.split("selbst");
  const skillCount = content.skillGroups.reduce(
    (total, group) => total + group.skills.length,
    0,
  );
  const metrics = [
    { value: String(content.projects.length).padStart(2, "0"), label: "Selected Builds" },
    { value: String(skillCount), label: "Tools & Technologien" },
    { value: String(content.skillGroups.length).padStart(2, "0"), label: "Disziplinen" },
  ];

  return (
    <section
      id="about"
      className="mx-auto w-full max-w-[90rem] px-6 py-24 md:px-12 md:py-36 lg:px-20"
    >
      <SectionLabel index="01" label="Über mich" aside="Builder / Operator" />

      <Reveal>
        <h2
          lang="de"
          className="break-words text-balance font-display text-[clamp(1.75rem,7vw,3.4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.055em] text-foreground md:hidden"
        >
          Ich baue Tools, hoste sie <span className="text-stroke">selbst</span>{" "}
          und spare Handarbeit.
        </h2>
        <h2
          lang="de"
          className="hidden max-w-[82rem] text-balance font-display text-[clamp(3.5rem,7vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.055em] text-foreground md:block"
        >
          {headlineStart}
          <span className="text-stroke">selbst</span>
          {headlineEnd}
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-16 border-t border-card-border pt-10 md:mt-24 md:pt-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <Reveal delay={0.08}>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-l border-card-border pl-4 md:pl-6 lg:flex lg:items-end lg:justify-between lg:border-b lg:border-l-0 lg:pb-6 lg:pl-0"
              >
                <p className="font-display text-3xl font-bold tracking-[-0.05em] text-accent md:text-5xl">
                  {metric.value}
                </p>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted md:text-[0.62rem] lg:max-w-32 lg:text-right">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="space-y-7">
          {content.about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.1 * (index + 1)}>
              <p
                className={`leading-relaxed ${
                  index === 0
                    ? "text-xl text-foreground md:text-2xl"
                    : "text-lg text-muted md:text-xl"
                }`}
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
