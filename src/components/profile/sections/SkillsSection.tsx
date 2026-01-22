"use client";

import { useLanguage } from "@/context/LanguageContext";

function Pill({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 rounded-full bg-secondary/10 border border-border text-foreground/80 text-sm">
      {label}
    </span>
  );
}

export function SkillsSection({
  hard,
  soft,
}: {
  hard: string[];
  soft: string[];
}) {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-muted-foreground mb-3">
          {lang === "ar" ? "المهارات التقنية" : "Hard Skills"}
        </div>
        <div className="flex flex-wrap gap-3">
          {hard.map((s) => (
            <Pill key={s} label={s} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-3">
          {lang === "ar" ? "المهارات الشخصية" : "Soft Skills"}
        </div>
        <div className="flex flex-wrap gap-3">
          {soft.map((s) => (
            <Pill key={s} label={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
