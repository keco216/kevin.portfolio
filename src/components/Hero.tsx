"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { content } from "@/data/content";

const EASE: [number, number, number, number] = [0.21, 0.65, 0.35, 1];
const AVATAR_SPRING = {
  stiffness: 190,
  damping: 21,
  mass: 0.58,
};

/**
 * Hero-Sektion: volle Viewporthöhe, riesiger zweizeiliger Name in Syne,
 * schwebender Avatar, Noise-Overlay und langsam treibende Glow-Flächen.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const avatarTargetX = useMotionValue(0);
  const avatarTargetY = useMotionValue(0);
  const avatarX = useSpring(avatarTargetX, AVATAR_SPRING);
  const avatarY = useSpring(avatarTargetY, AVATAR_SPRING);
  const avatarRotateX = useTransform(avatarY, [-20, 20], [3.5, -3.5]);
  const avatarRotateY = useTransform(avatarX, [-24, 24], [-4.5, 4.5]);

  const resetAvatarPosition = () => {
    avatarTargetX.set(0);
    avatarTargetY.set(0);
  };

  const handleAvatarPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (prefersReducedMotion || event.pointerType === "touch") {
      resetAvatarPosition();
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX =
      (event.clientX - (bounds.left + bounds.width / 2)) /
      Math.max(bounds.width / 2, 1);
    const normalizedY =
      (event.clientY - (bounds.top + bounds.height / 2)) /
      Math.max(bounds.height / 2, 1);
    const clampedX = Math.max(-1, Math.min(1, normalizedX));
    const clampedY = Math.max(-1, Math.min(1, normalizedY));
    const maxOffsetX = Math.min(24, bounds.width * 0.08);
    const maxOffsetY = Math.min(20, bounds.height * 0.065);

    avatarTargetX.set(clampedX * maxOffsetX);
    avatarTargetY.set(clampedY * maxOffsetY);
  };

  return (
    <section
      id="home"
      className="hero-stage relative flex min-h-svh flex-col overflow-hidden bg-background"
    >
      {/* Sehr subtile, langsam animierte radiale Glow-Flächen */}
      <motion.div
        aria-hidden
        className="absolute -top-40 left-[-15%] z-0 h-[38rem] w-[38rem] rounded-full bg-[#1d3158] opacity-[0.18] blur-3xl"
        animate={{ x: [0, 70, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-20%] right-[-10%] z-0 h-[34rem] w-[34rem] rounded-full bg-accent opacity-[0.08] blur-3xl"
        animate={{ x: [0, -60, 40, 0], y: [0, -50, 20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/3 z-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#17233a] opacity-[0.18] blur-3xl"
        animate={{ x: [0, 50, -50, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      <div aria-hidden className="hero-coordinate-field" />
      <div aria-hidden className="hero-signal-rings" />
      <div className="noise-overlay z-10" />

      <div className="relative z-20 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-6 md:px-12 lg:px-20">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
          className="grid grid-cols-2 items-center gap-6 pt-8 md:grid-cols-[1fr_auto_1fr]"
        >
          <a
            href={`mailto:${content.contact.email}`}
            data-cursor="button"
            className="w-fit rounded-full border border-card-border px-5 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-background"
          >
            Kontakt
          </a>
          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-8 font-mono text-[0.64rem] font-medium uppercase tracking-[0.18em] text-muted md:flex"
          >
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
          </nav>
          <a
            href={content.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-end font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline"
          >
            {content.contact.githubLabel}
          </a>
        </motion.header>

        <div className="flex flex-1 flex-col items-center justify-center py-16">
          <div className="relative w-full">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.75, ease: EASE }}
              className="mb-8 text-center font-mono text-[0.66rem] font-medium uppercase tracking-[0.24em] text-muted md:mb-10"
            >
              {content.role}
            </motion.p>

            <div className="relative">
              {/*
               * Jede Zeile ist ein Flex-Container: justify-center verteilt
               * Überlauf symmetrisch, wenn die Wortmarke auf breiten
               * Viewports breiter als der Inhaltsbereich wird —
               * text-align:center würde den Überlauf komplett nach rechts
               * schieben. pr-[…] gleicht zusätzlich das negative
               * letter-spacing aus, das CSS auch nach dem letzten Glyph
               * anwendet und die Zeile sonst leicht nach rechts versetzt.
               */}
              <h1
                aria-label={`${content.name.first} ${content.name.last}`}
                className="text-center font-display font-extrabold uppercase text-foreground"
              >
                <span className="flex origin-center scale-x-[0.48] justify-center whitespace-nowrap pr-[0.065em] text-[clamp(3.35rem,17vw,20rem)] leading-[0.72] tracking-[-0.065em]">
                  <motion.span
                    aria-hidden="true"
                    className="block"
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                  >
                    {content.name.first}
                  </motion.span>
                </span>
                <span className="mt-[0.04em] flex justify-center whitespace-nowrap pr-[0.075em] text-[clamp(3.35rem,17vw,20rem)] leading-[0.72] tracking-[-0.075em]">
                  <motion.span
                    aria-hidden="true"
                    className="block"
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                  >
                    {content.name.last}
                  </motion.span>
                </span>
              </h1>

              <div className="mt-7 flex justify-center md:absolute md:left-1/2 md:top-[119%] md:z-10 md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2">
                <div
                  className="hero-avatar-motion-zone inline-flex"
                  data-avatar-motion-zone
                  onPointerMove={handleAvatarPointerMove}
                  onPointerLeave={resetAvatarPosition}
                  onPointerCancel={resetAvatarPosition}
                >
                  <motion.div
                    className="hero-avatar-motion-card"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                    style={{
                      x: avatarX,
                      y: avatarY,
                      rotateX: avatarRotateX,
                      rotateY: avatarRotateY,
                    }}
                  >
                    <div className="hero-avatar relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-card shadow-[0_38px_110px_rgb(0_0_0/0.62)] md:rounded-[2.5rem]">
                      <Image
                        src={content.avatar}
                        alt={`${content.name.first} ${content.name.last}`}
                        width={1254}
                        height={1254}
                        sizes="(min-width: 768px) clamp(184px, 19vw, 336px), (min-width: 640px) 170px, 148px"
                        preload
                        className="hero-avatar-image h-[148px] w-[148px] object-cover sm:h-[170px] sm:w-[170px] md:h-[clamp(11.5rem,19vw,21rem)] md:w-[clamp(11.5rem,19vw,21rem)]"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden h-[clamp(7rem,13vw,15rem)] md:block"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          className="grid gap-8 pb-8 sm:grid-cols-[1fr_auto_1fr] sm:items-end"
        >
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {content.heroLeft}
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              {content.availability}
            </p>
          </div>

          <a
            href="#about"
            aria-label="Zum Über-mich-Bereich scrollen"
            className="group hidden flex-col items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground sm:flex"
          >
            Scroll
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border transition-colors group-hover:border-accent">
              ↓
            </span>
          </a>

          <p className="max-w-xs text-sm leading-relaxed text-muted sm:justify-self-end sm:text-right">
            {content.heroRight}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
