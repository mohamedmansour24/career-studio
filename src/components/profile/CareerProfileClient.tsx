"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CharacterPanel } from "@/components/site/CharacterPanel";
import { SectionCard } from "@/components/profile/SectionCard";
import { IntroSection } from "@/components/profile/sections/IntroSection";
import { RoleSection } from "@/components/profile/sections/RoleSection";
import { SkillsSection } from "@/components/profile/sections/SkillsSection";
import { EducationSection } from "@/components/profile/sections/EducationSection";
import { WorkGlanceSection } from "@/components/profile/sections/WorkGlanceSection";

const SECTIONS = [
  { key: "intro", label_en: "Intro", label_ar: "مقدمة" },
  { key: "role", label_en: "The Role", label_ar: "الدور" },
  { key: "skills", label_en: "Skills", label_ar: "المهارات" },
  { key: "education", label_en: "Education", label_ar: "التعليم" },
  { key: "personality", label_en: "Personality", label_ar: "الشخصية" },
  { key: "work", label_en: "Work At a Glance", label_ar: "نظرة على العمل" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

// Types for the career data
export interface CareerData {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string | null;
  intro_en: string | null;
  intro_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  personality_summary_en: string | null;
  personality_summary_ar: string | null;
  categories: Array<{ title_en: string; title_ar: string | null }>;
  tasks: Array<{ title_en: string; title_ar: string | null; order_index: number }>;
  skills: Array<{ name_en: string; name_ar: string | null; type: "hard" | "soft" }>;
  educationStats: Array<{ level: string; percent: number }>;
  workDimensions: Array<{
    level: "low" | "medium" | "high";
    title_en: string;
    title_ar: string | null;
    order_index: number;
  }>;
  linkedMajors: Array<{ title_en: string; title_ar: string | null }>;
  maleUrl: string | null;
  femaleUrl: string | null;
}

interface CareerProfileClientProps {
  career: CareerData;
  initialSection?: SectionKey;
  educationLabels: Record<string, string>;
}

export function CareerProfileClient({
  career,
  initialSection = "intro",
  educationLabels,
}: CareerProfileClientProps) {
  const [section, setSection] = useState<SectionKey>(initialSection);
  const { lang, isRTL } = useLanguage();

  // Helper to get localized text
  const t = (obj: Record<string, any>, field: string): string => {
    const localizedKey = `${field}_${lang}`;
    const fallbackKey = `${field}_en`;
    return String(obj[localizedKey] ?? obj[fallbackKey] ?? "");
  };

  // Process data for current language
  const title = t(career as any, "title");
  const intro = t(career as any, "intro");
  const description = t(career as any, "description") || intro;
  const personalitySummary = t(career as any, "personality_summary");

  const tasks = career.tasks
    .sort((a, b) => a.order_index - b.order_index)
    .map((task) => t(task, "title"));

  const hardSkills = career.skills
    .filter((s) => s.type === "hard")
    .map((s) => t(s, "name"));

  const softSkills = career.skills
    .filter((s) => s.type === "soft")
    .map((s) => t(s, "name"));

  const educationSlices = career.educationStats
    .map((e) => ({
      label: educationLabels[e.level] || e.level,
      percent: e.percent,
    }))
    .sort((a, b) => b.percent - a.percent);

  const workRows = career.workDimensions
    .sort((a, b) => a.order_index - b.order_index)
    .map((w) => ({
      label: t(w, "title"),
      level: w.level,
    }));

  const linkedMajors = career.linkedMajors.map((m) => ({
    title: t(m, "title"),
  }));

  const categories = career.categories.map((c) => t(c, "title"));

  const currentSection = SECTIONS.find((s) => s.key === section) ?? SECTIONS[0];
  const sectionTitle = lang === "ar" ? currentSection.label_ar : currentSection.label_en;

  return (
    <div
      className="rounded-3xl border border-white/15 bg-white/5 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background asset (fallback if missing) */}
      <div className="absolute inset-0 opacity-25">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="relative p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 items-start">
          {/* Character panel */}
          <CharacterPanel
            careerTitle={title}
            maleUrl={career.maleUrl}
            femaleUrl={career.femaleUrl}
          />

          <div>
            <div className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200">
              {lang === "ar" ? "مطلوب" : "In Demand"}
            </div>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight">{title}</h1>

            <p className="mt-4 text-white/70 leading-relaxed max-w-2xl line-clamp-2">
              {intro}
            </p>

            <div className="mt-8">
              {/* Title */}
              <div className="text-sm text-white/60">
                {lang === "ar"
                  ? "هذه المهنة مناسبة لك إذا كنت:"
                  : "This career is a great fit if you are:"}
              </div>

              {/* Pills */}
              <div className="mt-3 flex flex-wrap gap-3">
                {categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white/80"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Explanation + links */}
              <div className="mt-3 text-xs text-white/50 leading-relaxed">
                {lang === "ar" ? (
                  <>
                    بناءً على{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Holland_Codes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-white"
                    >
                      نموذج هولاند للاهتمامات
                    </a>
                    .<br className="hidden sm:block" />
                    لست متأكداً من اهتماماتك؟{" "}
                    <a
                      href="/interests"
                      className="underline underline-offset-4 hover:text-white"
                    >
                      اكتشفها هنا
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Based on{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Holland_Codes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-white"
                    >
                      Holland&apos;s Interests Model
                    </a>
                    .<br className="hidden sm:block" />
                    Not sure what your interests are?{" "}
                    <a
                      href="/interests"
                      className="underline underline-offset-4 hover:text-white"
                    >
                      Find out here
                    </a>
                    .
                  </>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-sm text-white/60">
                {lang === "ar" ? "الراتب" : "Salary"}
              </div>
              <div className="mt-1 text-lg text-white">$10,000 - $20,000</div>
            </div>

            {/* Section tabs - client-side navigation */}
            <div className="mt-10 flex gap-8 overflow-x-auto text-white/70 pb-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={
                    s.key === section
                      ? "whitespace-nowrap text-white"
                      : "whitespace-nowrap hover:text-white"
                  }
                >
                  {lang === "ar" ? s.label_ar : s.label_en}
                </button>
              ))}
            </div>

            {/* Section content */}
            <SectionCard title={sectionTitle}>
              {section === "intro" && <IntroSection text={description.trim()} />}

              {section === "role" && <RoleSection tasks={tasks} />}

              {section === "skills" && <SkillsSection hard={hardSkills} soft={softSkills} />}

              {section === "education" && (
                <EducationSection slices={educationSlices} majors={linkedMajors} />
              )}

              {section === "personality" && (
                <div className="text-white/70 leading-relaxed whitespace-pre-line">
                  {personalitySummary ||
                    (lang === "ar"
                      ? "لا يوجد ملخص للشخصية بعد."
                      : "No personality summary yet.")}
                </div>
              )}

              {section === "work" && <WorkGlanceSection rows={workRows} />}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
