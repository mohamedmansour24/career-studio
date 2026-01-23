"use client";

import { useState, useMemo } from "react";
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
  categories: string[]; // Array of category keys (e.g., ["artistic", "social"])
}

interface CareersLibraryClientProps {
  careers: CareerRow[];
  initialBucket: BucketKey;
  countsByKey: Record<string, number>;
  error?: string | null;
}

export function CareersLibraryClient({
  careers,
  initialBucket,
  countsByKey,
  error,
}: CareersLibraryClientProps) {
  const { lang, isRTL } = useLanguage();
  const text = t[lang];

  // Helper to get localized text
  const localize = (obj: Record<string, any>, field: string): string => {
    const localizedKey = `${field}_${lang}`;
    const fallbackKey = `${field}_en`;
    return String(obj[localizedKey] ?? obj[fallbackKey] ?? "");
  };

  // Client-side bucket state for instant switching
  const [activeBucketKey, setActiveBucketKey] = useState<BucketKey>(initialBucket);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter careers client-side based on selected bucket OR search query
  const filteredCareers = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return careers.filter((c) => {
        const title = localize(c, "title").toLowerCase();
        const intro = localize(c, "intro").toLowerCase();
        return title.includes(query) || intro.includes(query);
      });
    }
    return careers.filter((c) => c.categories.includes(activeBucketKey));
  }, [careers, activeBucketKey, searchQuery, lang]);

  const activeBucket = BUCKETS.find((b) => b.key === activeBucketKey) ?? BUCKETS[0];
  const activeColor = searchQuery.trim() ? undefined : activeBucket.color;

  // Handle bucket click - instant client-side switch
  const handleBucketClick = (key: BucketKey) => {
    setActiveBucketKey(key);
    // Update URL without navigation for bookmarkability
    window.history.replaceState(null, "", `/careers?bucket=${key}`);
  };

  if (error) {
    return (
      <BackgroundShell>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pt-16 pb-20" dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-3xl font-semibold">{text.errorTitle}</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
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


        {/* Content layer ABOVE background */}
        <div className="relative z-10">
          <h1 className="text-5xl font-semibold tracking-tight text-center text-foreground">
            {text.title}
          </h1>
          <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">
            {text.subtitle}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <input
              type="text"
              placeholder={lang === "ar" ? "ابحث عن وظيفة..." : "Search for a career..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm placeholder:text-muted-foreground/60 text-center focus:text-left focus:placeholder:text-transparent"
            />
          </div>

          {/* Buckets */}
          <div className={`mt-8 transition-opacity duration-300 ${searchQuery.trim() ? "opacity-30 pointer-events-none blur-sm" : "opacity-100"}`}>
            {/* Desktop/tablet */}
            <div className="hidden md:flex flex-wrap justify-center gap-8 text-center">
              {BUCKETS.map((b) => {
                const isActive = b.key === activeBucketKey;
                const bucketLabel = lang === "ar" ? b.label_ar : b.label_en;

                return (
                  <button
                    key={b.key}
                    onClick={() => handleBucketClick(b.key)}
                    className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
                  >
                    <div
                      className={
                        isActive
                          ? "px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                          : "px-6 py-3 text-foreground/80 hover:text-foreground transition-all duration-200"
                      }
                      style={
                        isActive
                          ? { backgroundColor: b.color, color: "#061A33" }
                          : undefined
                      }
                    >
                      {bucketLabel}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {countsByKey[b.key] ?? 0} {text.jobsTotal}
                    </div>

                    <div
                      className="h-[3px] w-16 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: isActive
                          ? b.color
                          : "currentColor",
                        opacity: isActive ? 1 : 0.2,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Mobile: single pill dropdown */}
            <div className="md:hidden flex justify-center">
              <MobileBucketPillSelect
                value={activeBucketKey}
                basePath="/careers"
                options={BUCKETS.map(({ key, label_en, label_ar }) => ({
                  key,
                  label: lang === "ar" ? label_ar : label_en,
                }))}
                colors={
                  Object.fromEntries(BUCKETS.map((b) => [b.key, b.color])) as any
                }
                onSelect={handleBucketClick}
              />
            </div>

            <div className="md:hidden mt-2 text-center text-xs text-muted-foreground">
              {text.tapToSwitch}
            </div>
          </div>

          {/* Cards */}
          <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCareers.map((c) => (
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
          {filteredCareers.length === 0 && (
            <div className="mt-10 text-center text-muted-foreground">
              {searchQuery.trim() ? (
                <>
                  {lang === "ar" ? "لا توجد نتائج لـ" : "No results found for"}{" "}
                  <span className="text-foreground font-semibold">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  {text.noCareers}{" "}
                  <span className="text-foreground">
                    {lang === "ar" ? activeBucket.label_ar : activeBucket.label_en}
                  </span>{" "}
                  {text.yet}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </BackgroundShell>
  );
}
