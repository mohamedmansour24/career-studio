"use client";

import React from "react";
import { useTheme } from "next-themes";

/**
 * SectionCard - Theme-aware card for profile sections
 * Uses explicit dark: variant to ensure proper dark mode rendering
 */
export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className="mt-6 rounded-2xl border p-6 transition-colors"
      style={{
        backgroundColor: isDark ? "#0F172D" : "#F5F3E8",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(23,24,59,0.1)",
      }}
    >
      <h2
        className="text-xl font-semibold"
        style={{ color: isDark ? "#FFFFFF" : "#17183B" }}
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
