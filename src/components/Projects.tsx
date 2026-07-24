"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { content, type Project } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.01-1.04-0.015-2.04-3.338 0.724-4.042-1.61-4.042-1.61-0.546-1.385-1.333-1.754-1.333-1.754-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495 0.998 0.108-0.776 0.417-1.305 0.76-1.605-2.665-0.3-5.466-1.332-5.466-5.93 0-1.31 0.465-2.38 1.235-3.22-0.135-0.303-0.54-1.523 0.105-3.176 0 0 1.005-0.322 3.3 1.23 0.96-0.267 1.98-0.399 3-0.405 1.02 0.006 2.04 0.138 3 0.405 2.28-1.552 3.285-1.23 3.285-1.23 0.645 1.653 0.24 2.873 0.12 3.176 0.765 0.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92 0.42 0.36 0.81 1.096 0.81 2.22 0 1.606-0.015 2.896-0.015 3.286 0 0.315 0.21 0.69 0.825 0.57 4.801-1.574 8.236-6.074 8.236-11.369 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ProjectImage({ project }: { project: Project }) {
  if (project.orientation === "landscape") {
    const repository =
      project.githubUrl?.replace("https://github.com/", "") ?? project.name;

    return (
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-card-border bg-background p-2 shadow-[0_24px_70px_rgb(0_0_0/0.32)] md:p-3">
          <div className="flex items-center gap-2 px-2 pb-3 pt-1">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="ml-auto max-w-[58%] truncate font-mono text-[0.52rem] uppercase tracking-[0.12em] text-muted">
              {repository}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src={project.image}
              alt={`Screenshot von ${project.name}`}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="mx-auto h-2.5 w-[88%] rounded-b-2xl bg-card-border" />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center rounded-2xl bg-background/60 p-6 md:p-8">
      <Image
        src={project.image}
        alt={`Screenshot von ${project.name}`}
        width={640}
        height={960}
        className="h-auto max-h-[480px] w-auto rounded-xl"
      />
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const mirrored = index % 2 === 1;
  const borderRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const border = borderRef.current;
    if (!border || event.pointerType === "touch") return;

    const rect = border.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);

    border.style.setProperty("--card-angle", `${angle}rad`);
  };

  const resetBorder = () => {
    borderRef.current?.style.setProperty("--card-angle", "0rad");
  };

  return (
    <motion.div
      ref={borderRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetBorder}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="project-card-frame group rounded-[1.8rem] p-px"
    >
      <article className="project-card-surface relative overflow-hidden rounded-[1.72rem] bg-card p-6 md:p-10 lg:p-12">
        <div className="mb-8 flex items-center justify-between gap-6 border-b border-card-border pb-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          <p>
            <span className="text-accent">Project</span> /{" "}
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                data-cursor="button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} auf GitHub ansehen`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 hover:scale-110"
              >
                <GitHubIcon />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                data-cursor="button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live ansehen`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 hover:scale-110"
              >
                <LinkIcon />
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div
            className={`flex flex-col justify-between gap-8 ${
              mirrored ? "md:order-2" : ""
            }`}
          >
            <div className="space-y-5">
              <h3 className="project-card-title relative -mx-2 w-fit max-w-xl overflow-hidden px-2 py-1 font-display text-4xl font-bold leading-[0.95] tracking-[-0.045em] transition-colors duration-300 md:text-5xl lg:text-6xl">
                <span className="relative z-10 block">{project.name}</span>
              </h3>
              <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
                {project.description}
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-card-border bg-background/60 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`flex items-end justify-center ${
              mirrored ? "md:order-1 md:justify-start" : "md:justify-end"
            }`}
          >
            <ProjectImage project={project} />
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-20">
        <SectionLabel
          index="04"
          label="Selected Work"
          aside={`${content.projects.length} Projekte`}
        />

        <Reveal>
          <h2 className="break-words font-display text-[clamp(2rem,8vw,5rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.065em] sm:whitespace-nowrap md:text-[clamp(4rem,9.6vw,8.8rem)]">
            <span className="text-stroke block">Meine</span>
            <span className="block text-right">Projekte</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex justify-end">
          <p className="max-w-2xl text-right font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.18em] text-muted md:text-xs">
            {content.projectsIntro}
          </p>
        </Reveal>

        <div className="mt-16 space-y-10 md:mt-24">
          {content.projects.map((project, index) => (
            <Reveal key={project.name} delay={0.1}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
