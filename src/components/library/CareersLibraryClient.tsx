"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BackgroundShell } from "@/components/site/BackgroundShell";
import { Navbar } from "@/components/site/Navbar";
import { LibraryCard } from "@/components/cards/LibraryCard";
import { MobileBucketPillSelect } from "@/components/site/MobileBucketPillSelect";

const BUCKETS = [
  { key: "artistic", label_en: "Artistic", label_ar: "فني", color: "#8FBFA3" },
  { key: "social", label_en: "Social", label_ar: "اجتماعي", color: "#F2C94C" },
  { key: "enterprising", label_en: "Enterprising", label_ar: "ريادي", color: "#56CCF2" },
  { key: "investigative", label_en: "Investigative", label_ar: "استقصائي", color: "#9B51E0" },
  { key: "conventional", label_en: "Conventional", label_ar: "تقليدي", color: "#EB5757" },
  { key: "realistic", label_en: "Realistic", label_ar: "واقعي", color: "#2F80ED" },
] as const;

type BucketKey = (typeof BUCKETS)[number]["key"];

const t = {
  en: {
    title: "Careers Library",
    subtitle: "Explore careers based on your interests.",
    jobsTotal: "Jobs Total",
    tapToSwitch: "Tap the category to switch",
    exploreCareer: "Explore Career",
    noCareers: "No careers are linked to",
    yet: "yet.",
    errorTitle: "Error loading careers",
  },
  ar: {
    title: "مكتبة الوظائف",
    subtitle: "استكشف الوظائف بناءً على اهتماماتك.",
    jobsTotal: "وظيفة",
    tapToSwitch: "اضغط على الفئة للتبديل",
    exploreCareer: "استكشف الوظيفة",
    noCareers: "لا توجد وظائف مرتبطة بـ",
    yet: "حتى الآن.",
    errorTitle: "خطأ في تحميل الوظائف",
  },
};

export interface CareerRow {
  slug: string;
  title_en: string;
  title_ar: string | null;
  intro_en: string | null;
  intro_ar: string | null;
}

interface CareersLibraryClientProps {
  careers: CareerRow[];
  bucket: BucketKey;
  countsByKey: Record<string, number>;
  error?: string | null;
}

export function CareersLibraryClient({
  careers,
  bucket,
  countsByKey,
  error,
}: CareersLibraryClientProps) {
  const { lang, isRTL } = useLanguage();
  const text = t[lang];

  const activeBucket = BUCKETS.find((b) => b.key === bucket) ?? BUCKETS[0];
  const activeColor = activeBucket.color;

  // Helper to get localized text
  const localize = (obj: Record<string, any>, field: string): string => {
    const localizedKey = `${field}_${lang}`;
    const fallbackKey = `${field}_en`;
    return String(obj[localizedKey] ?? obj[fallbackKey] ?? "");
  };

  if (error) {
    return (
      <BackgroundShell>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pt-16 pb-20" dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-3xl font-semibold">{text.errorTitle}</h1>
          <p className="mt-3 text-white/70">{error}</p>
        </main>
      </BackgroundShell>
    );
  }

  return (
    <BackgroundShell>
      <Navbar />

      <main
        className="mx-auto max-w-6xl px-6 pt-10 pb-20 relative min-h-[80vh]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background PNG */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "url('/backgrounds/library.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Content layer ABOVE background */}
        <div className="relative z-10">
          <h1 className="text-5xl font-semibold tracking-tight text-center">
            {text.title}
          </h1>
          <p className="mt-4 text-white/70 text-center max-w-2xl mx-auto">
            {text.subtitle}
          </p>

          {/* Buckets */}
          <div className="mt-12">
            {/* Desktop/tablet */}
            <div className="hidden md:flex flex-wrap justify-center gap-8 text-center">
              {BUCKETS.map((b) => {
                const isActive = b.key === bucket;
                const bucketLabel = lang === "ar" ? b.label_ar : b.label_en;

                return (
                  <a
                    key={b.key}
                    href={`/careers?bucket=${b.key}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={
                        isActive
                          ? "px-6 py-3 rounded-xl font-semibold"
                          : "px-6 py-3 text-white/80 hover:text-white"
                      }
                      style={
                        isActive
                          ? { backgroundColor: b.color, color: "#061A33" }
                          : undefined
                      }
                    >
                      {bucketLabel}
                    </div>

                    <div className="text-xs text-white/60">
                      {countsByKey[b.key] ?? 0} {text.jobsTotal}
                    </div>

                    <div
                      className="h-[3px] w-16 rounded-full"
                      style={{
                        backgroundColor: isActive
                          ? b.color
                          : "rgba(255,255,255,0.2)",
                      }}
                    />
                  </a>
                );
              })}
            </div>

            {/* Mobile: single pill dropdown */}
            <div className="md:hidden flex justify-center">
              <MobileBucketPillSelect
                value={bucket}
                basePath="/careers"
                options={BUCKETS.map(({ key, label_en, label_ar }) => ({
                  key,
                  label: lang === "ar" ? label_ar : label_en,
                }))}
                colors={
                  Object.fromEntries(BUCKETS.map((b) => [b.key, b.color])) as any
                }
              />
            </div>

            <div className="md:hidden mt-2 text-center text-xs text-white/60">
              {text.tapToSwitch}
            </div>
          </div>

          {/* Cards */}
          <section className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {careers.map((c) => (
              <LibraryCard
                key={c.slug}
                title={localize(c, "title")}
                description={localize(c, "intro")}
                href={`/careers/${c.slug}?section=intro`}
                accentColor={activeColor}
                ctaLabel={text.exploreCareer}
              />
            ))}
          </section>

          {/* Empty state */}
          {careers.length === 0 && (
            <div className="mt-10 text-center text-white/70">
              {text.noCareers}{" "}
              <span className="text-white">
                {lang === "ar" ? activeBucket.label_ar : activeBucket.label_en}
              </span>{" "}
              {text.yet}
            </div>
          )}
        </div>
      </main>
    </BackgroundShell>
  );
}
