"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SectionCard } from "@/components/profile/SectionCard";
import { IntroSection } from "@/components/profile/sections/IntroSection";
import { LibraryCard } from "@/components/cards/LibraryCard";

const SECTIONS = [
  { key: "intro", label_en: "Intro", label_ar: "مقدمة" },
  { key: "classes", label_en: "Classes", label_ar: "المواد" },
  { key: "skills", label_en: "Skills", label_ar: "المهارات" },
  { key: "careers", label_en: "Careers", label_ar: "الوظائف" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

// Types for the major data
export interface MajorData {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string | null;
  intro_en: string | null;
  intro_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  classes: Array<{
    id: string;
    title_en: string;
    title_ar: string | null;
    description_en: string | null;
    description_ar: string | null;
    video_url: string | null;
    order_index: number;
  }>;
  skills: Array<{
    id: string;
    name_en: string;
    name_ar: string | null;
    type: "hard" | "soft";
  }>;
  linkedCareers: Array<{
    slug: string;
    title_en: string;
    title_ar: string | null;
    intro_en: string | null;
    intro_ar: string | null;
  }>;
}

interface MajorProfileClientProps {
  major: MajorData;
  initialSection?: SectionKey;
}

function Pill({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm">
      {label}
    </span>
  );
}

export function MajorProfileClient({
  major,
  initialSection = "intro",
}: MajorProfileClientProps) {
  const [section, setSection] = useState<SectionKey>(initialSection);
  const { lang, isRTL } = useLanguage();

  // Helper to get localized text
  const t = (obj: Record<string, any>, field: string): string => {
    const localizedKey = `${field}_${lang}`;
    const fallbackKey = `${field}_en`;
    return String(obj[localizedKey] ?? obj[fallbackKey] ?? "");
  };

  // Process data for current language
  const title = t(major as any, "title");
  const intro = t(major as any, "intro");
  const description = t(major as any, "description") || intro;

  const classes = major.classes
    .sort((a, b) => a.order_index - b.order_index)
    .map((c) => ({
      id: c.id,
      title: t(c, "title"),
      description: t(c, "description"),
      video_url: c.video_url,
    }));

  const hardSkills = major.skills
    .filter((s) => s.type === "hard")
    .map((s) => ({ id: s.id, name: t(s, "name") }));

  const softSkills = major.skills
    .filter((s) => s.type === "soft")
    .map((s) => ({ id: s.id, name: t(s, "name") }));

  const linkedCareers = major.linkedCareers.map((c) => ({
    slug: c.slug,
    title: t(c, "title"),
    intro: t(c, "intro"),
  }));

  const currentSection = SECTIONS.find((s) => s.key === section) ?? SECTIONS[0];
  const sectionTitle = lang === "ar" ? currentSection.label_ar : currentSection.label_en;

  return (
    <div
      className="rounded-3xl border border-white/15 bg-white/5 p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-white/80">
        {lang === "ar" ? "تخصص" : "Major"}
      </div>

      <h1 className="mt-4 text-5xl font-semibold tracking-tight">{title}</h1>

      <p className="mt-4 text-white/70 leading-relaxed max-w-2xl line-clamp-2">
        {intro}
      </p>

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

        {section === "classes" && (
          <div className="space-y-5">
            {classes.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <div className="text-white font-semibold">{c.title}</div>

                {c.description && (
                  <div className="mt-2 text-white/70 leading-relaxed">
                    {c.description}
                  </div>
                )}

                {c.video_url && (
                  <a
                    href={c.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm text-white/80 hover:text-white underline underline-offset-4"
                  >
                    {lang === "ar" ? "شاهد المحاضرة" : "Watch lecture"}
                  </a>
                )}
              </div>
            ))}

            {classes.length === 0 && (
              <div className="text-white/70">
                {lang === "ar" ? "لا توجد مواد بعد." : "No classes added yet."}
              </div>
            )}
          </div>
        )}

        {section === "skills" && (
          <div className="space-y-6">
            <div>
              <div className="text-sm text-white/60 mb-3">
                {lang === "ar" ? "المهارات التقنية" : "Hard Skills"}
              </div>
              <div className="flex flex-wrap gap-3">
                {hardSkills.map((s) => (
                  <Pill key={s.id} label={s.name} />
                ))}
                {hardSkills.length === 0 && (
                  <div className="text-white/70">
                    {lang === "ar" ? "لا توجد بعد." : "None yet."}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-white/60 mb-3">
                {lang === "ar" ? "المهارات الشخصية" : "Soft Skills"}
              </div>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((s) => (
                  <Pill key={s.id} label={s.name} />
                ))}
                {softSkills.length === 0 && (
                  <div className="text-white/70">
                    {lang === "ar" ? "لا توجد بعد." : "None yet."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {section === "careers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {linkedCareers.map((c) => (
              <LibraryCard
                key={c.slug}
                title={c.title}
                description={c.intro}
                href={`/careers/${c.slug}?section=intro`}
              />
            ))}

            {linkedCareers.length === 0 && (
              <div className="text-white/70">
                {lang === "ar" ? "لا توجد وظائف مرتبطة بعد." : "No linked careers yet."}
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
