import { Reveal } from "@/components/Reveal";
import { content } from "@/data/content";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function GitHubCallout() {
  return (
    <section id="github" className="px-3 py-10 md:px-6 md:py-16">
      <Reveal>
        <div className="mx-auto grid w-full max-w-[86rem] overflow-hidden rounded-[2rem] bg-accent text-background shadow-[0_35px_120px_rgb(0_0_0/0.35)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 md:p-12 lg:p-16">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
              {content.githubCta.eyebrow}
            </p>
            <h2 className="mt-8 max-w-4xl text-balance font-display text-[clamp(3rem,7vw,7rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.06em]">
              {content.githubCta.headline}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-background/75 md:text-xl">
              {content.githubCta.description}
            </p>
            <a
              href={content.contact.github}
              data-cursor="button"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-4 rounded-full bg-background px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-transform duration-300 hover:-translate-y-1"
            >
              {content.githubCta.action}
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight />
              </span>
            </a>
          </div>

          <div className="technical-grid flex items-center bg-background p-6 text-foreground md:p-10 lg:p-12">
            <div className="w-full overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-card-border px-5 py-4">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
                <span className="ml-auto font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
                  public repositories
                </span>
              </div>
              <div className="space-y-5 p-5 font-mono text-xs leading-relaxed md:p-7">
                <p className="text-muted">
                  <span className="text-accent">$</span> gh repo list keco216
                </p>
                {[
                  "kevin-connection-manager",
                  "litecloud",
                  "u-got-mail",
                  "SpeedTest",
                ].map((repo) => (
                  <p
                    key={repo}
                    className="flex items-center justify-between gap-4 border-b border-card-border pb-4"
                  >
                    <span className="truncate">{repo}</span>
                    <span className="text-signal">public</span>
                  </p>
                ))}
                <p className="text-muted">... und weitere Projekte</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
