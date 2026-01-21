import { resolveAssetUrl } from "@/lib/assets/url";
import { BackgroundShell } from "@/components/site/BackgroundShell";
import { Navbar } from "@/components/site/Navbar";
import { CareerProfileClient, CareerData } from "@/components/profile/CareerProfileClient";
import { supabase } from "@/lib/supabase/client";
import { educationLabel } from "@/lib/mappers/education";

// Pre-compute education labels for all possible levels
const EDUCATION_LABELS: Record<string, string> = {
  phd: educationLabel("phd"),
  masters: educationLabel("masters"),
  bachelors: educationLabel("bachelors"),
  associate: educationLabel("associate"),
  some_college: educationLabel("some_college"),
  high_school: educationLabel("high_school"),
  less_than_high_school: educationLabel("less_than_high_school"),
  unknown_or_other: educationLabel("unknown_or_other"),
};

export default async function CareerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const initialSection = sp.section || "intro";

  // Single optimized query - fetches everything including both languages
  const { data: career, error: careerError } = await supabase
    .from("careers")
    .select(`
      id,
      slug,
      title_en,
      title_ar,
      intro_en,
      intro_ar,
      description_en,
      description_ar,
      personality_summary_en,
      personality_summary_ar,
      career_interest_categories (
        interest_categories ( title_en, title_ar )
      ),
      career_tasks ( title_en, title_ar, order_index ),
      career_skills ( skills ( name_en, name_ar, type ) ),
      career_education_stats ( level, percent ),
      career_work_glance ( level, work_dimensions ( title_en, title_ar, order_index ) ),
      career_character_assets ( variant, assets:asset_id ( external_url, storage_path ) ),
      career_majors ( majors ( title_en, title_ar ) )
    `)
    .eq("slug", slug)
    .single();

  if (careerError || !career) {
    return (
      <BackgroundShell>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pt-16 pb-20">
          <h1 className="text-3xl font-semibold">Career not found</h1>
          <p className="mt-3 text-white/70">{careerError?.message}</p>
        </main>
      </BackgroundShell>
    );
  }

  // Transform the nested data into the format expected by the client component
  const careerData: CareerData = {
    id: career.id,
    slug: career.slug,
    title_en: career.title_en,
    title_ar: career.title_ar,
    intro_en: career.intro_en,
    intro_ar: career.intro_ar,
    description_en: career.description_en,
    description_ar: career.description_ar,
    personality_summary_en: career.personality_summary_en,
    personality_summary_ar: career.personality_summary_ar,
    categories: (career.career_interest_categories ?? [])
      .map((c: any) => c.interest_categories)
      .filter(Boolean),
    tasks: (career.career_tasks ?? []).map((t: any) => ({
      title_en: t.title_en,
      title_ar: t.title_ar,
      order_index: t.order_index,
    })),
    skills: (career.career_skills ?? [])
      .map((s: any) => s.skills)
      .filter(Boolean)
      .map((s: any) => ({
        name_en: s.name_en,
        name_ar: s.name_ar,
        type: s.type as "hard" | "soft",
      })),
    educationStats: (career.career_education_stats ?? []).map((e: any) => ({
      level: e.level,
      percent: Number(e.percent),
    })),
    workDimensions: (career.career_work_glance ?? [])
      .map((w: any) => {
        const dim = w.work_dimensions;
        if (!dim) return null;
        return {
          level: w.level as "low" | "medium" | "high",
          title_en: dim.title_en as string,
          title_ar: dim.title_ar as string | null,
          order_index: (dim.order_index ?? 999) as number,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
    linkedMajors: (career.career_majors ?? [])
      .map((m: any) => m.majors)
      .filter(Boolean)
      .map((m: any) => ({
        title_en: m.title_en,
        title_ar: m.title_ar,
      })),
    maleUrl: (() => {
      const found = (career.career_character_assets ?? []).find((c: any) => c.variant === "male");
      const asset = found?.assets;
      // assets could be an object or array depending on Supabase's inference
      if (Array.isArray(asset)) {
        return resolveAssetUrl(asset[0] ?? null);
      }
      return resolveAssetUrl(asset ?? null);
    })(),
    femaleUrl: (() => {
      const found = (career.career_character_assets ?? []).find((c: any) => c.variant === "female");
      const asset = found?.assets;
      if (Array.isArray(asset)) {
        return resolveAssetUrl(asset[0] ?? null);
      }
      return resolveAssetUrl(asset ?? null);
    })(),
  };

  return (
    <BackgroundShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-20">
        <section className="relative">
          <CareerProfileClient
            career={careerData}
            initialSection={initialSection as any}
            educationLabels={EDUCATION_LABELS}
          />
        </section>
      </main>
    </BackgroundShell>
  );
}
