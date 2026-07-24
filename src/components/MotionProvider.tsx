"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Respektiert die OS-Einstellung „Bewegung reduzieren“:
 * Framer Motion deaktiviert damit Transform-Animationen
 * für betroffene Nutzer automatisch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
