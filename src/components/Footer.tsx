import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { content } from "@/data/content";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-card-border pb-10 pt-24 md:pt-36"
    >
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-20">
        <SectionLabel index="06" label="Kontakt" aside="Austria / CET" />

        <Reveal>
          <h2 className="font-display text-[clamp(3.1rem,13vw,12rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.075em] text-foreground">
            <span className="block">Lass</span>
            <span className="text-stroke block md:translate-x-[8vw]">
              uns
            </span>
            <span className="block text-right">bauen.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-card-border pt-10 md:mt-24 md:grid-cols-[0.8fr_1.2fr] md:items-end md:pt-14">
          <Reveal delay={0.1} className="max-w-md">
            <p className="font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.18em] text-muted">
              Du hast eine Frage, ein Projekt oder willst gemeinsam an etwas
              arbeiten?
            </p>
          </Reveal>

          <Reveal delay={0.15} className="md:justify-self-end">
            <a
              href={`mailto:${content.contact.email}`}
              className="group inline-flex max-w-full items-center gap-4 border-b border-foreground pb-2 font-display text-[clamp(1.5rem,3.5vw,3.5rem)] font-bold tracking-[-0.04em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span className="truncate">{content.contact.email}</span>
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight />
              </span>
            </a>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-card-border pt-6 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between md:mt-28">
          <p>
            © 2026 {content.name.first} {content.name.last}
          </p>
          <nav aria-label="Footer-Navigation" className="flex flex-wrap gap-6">
            <a className="transition-colors hover:text-foreground" href="#about">
              Über mich
            </a>
            <a className="transition-colors hover:text-foreground" href="#system">
              System
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#projects"
            >
              Projekte
            </a>
            <a
              href={content.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {content.contact.githubLabel}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
