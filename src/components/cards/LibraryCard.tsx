"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * LibraryCard - Compact horizontal row card for career/major listings
 * 
 * Design: Clean row with accent dot, title, and arrow
 * Benefits: Consistent height, scannable, modern feel
 */
export function LibraryCard({
  title,
  description,
  href,
  accentColor = "#5B85AA",
  ctaLabel = "Explore",
}: {
  title: string;
  description: string;
  href: string;
  accentColor?: string;
  ctaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${ctaLabel}: ${title}`}
      className="
        group flex items-center gap-4
        px-5 py-4
        rounded-xl
        bg-card/60 hover:bg-card
        border border-border/50 hover:border-border
        transition-all duration-200
        hover:shadow-lg
      "
      style={{
        boxShadow: `0 0 0 1px color-mix(in srgb, ${accentColor} 10%, transparent)`,
      }}
    >
      {/* Accent dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      {/* Title & optional preview */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate leading-snug">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {description}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight
        className="w-5 h-5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors"
      />
    </Link>
  );
}