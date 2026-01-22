"use client";

import React from "react";
import { FloatingRobot } from "@/components/site/FloatingRobot";

/**
 * BackgroundShell - Theme-aware background wrapper for library pages
 * 
 * Uses pure CSS dark: variants for INSTANT theme switching
 * No React state or useEffect needed - CSS handles everything
 */
export function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden bg-background">
      {/* Base wave pattern - visible in dark mode */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-60 transition-opacity duration-200"
        style={{
          backgroundImage: `url('/backgrounds/landing.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* Light mode wave pattern - uses library.png for light background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-0 transition-opacity duration-200"
        style={{
          backgroundImage: `url('/backgrounds/library.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Light mode accent overlays - subtle depth */}
      <div
        className="absolute inset-0 pointer-events-none dark:opacity-0 transition-opacity duration-200"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 20%, rgba(244, 96, 54, 0.12), transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(91, 133, 170, 0.15), transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(117, 112, 78, 0.1), transparent 40%)
          `,
        }}
      />

      {/* Dark mode depth overlays - hidden in light mode via CSS */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-200"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top center, rgba(255,255,255,0.06), transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(0,180,255,0.1), transparent 55%),
            radial-gradient(circle at 20% 85%, rgba(244,96,54,0.08), transparent 55%),
            radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 100%)
          `,
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>

      <FloatingRobot />
    </div>
  );
}
