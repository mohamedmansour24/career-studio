import { BackgroundShell } from "@/components/site/BackgroundShell";
import { Navbar } from "@/components/site/Navbar";
import { MajorProfileClient, MajorData } from "@/components/profile/MajorProfileClient";
import { supabase } from "@/lib/supabase/client";

export default async function MajorProfilePage({
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
  const { data: major, error } = await supabase
    .from("majors")
    .select(`
      id,
      slug,
      title_en,
      title_ar,
      intro_en,
      intro_ar,
      description_en,
      description_ar,
      major_classes ( id, title_en, title_ar, description_en, description_ar, video_url, order_index ),
      major_skills ( skills ( id, name_en, name_ar, type ) ),
      career_majors ( careers ( slug, title_en, title_ar, intro_en, intro_ar ) )
    `)
    .eq("slug", slug)
    .single();

  if (error || !major) {
    return (
      <BackgroundShell>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pt-16 pb-20">
          <h1 className="text-3xl font-semibold">Major not found</h1>
          {error?.message && <p className="mt-3 text-white/70">{error.message}</p>}
        </main>
      </BackgroundShell>
    );
  }

  // Transform the nested data into the format expected by the client component
  const majorData: MajorData = {
    id: major.id,
    slug: major.slug,
    title_en: major.title_en,
    title_ar: major.title_ar,
    intro_en: major.intro_en,
    intro_ar: major.intro_ar,
    description_en: major.description_en,
    description_ar: major.description_ar,
    classes: (major.major_classes ?? []).map((c: any) => ({
      id: c.id,
      title_en: c.title_en,
      title_ar: c.title_ar,
      description_en: c.description_en,
      description_ar: c.description_ar,
      video_url: c.video_url,
      order_index: c.order_index ?? 0,
    })),
    skills: (major.major_skills ?? [])
      .map((s: any) => s.skills)
      .filter(Boolean)
      .map((s: any) => ({
        id: s.id,
        name_en: s.name_en,
        name_ar: s.name_ar,
        type: s.type as "hard" | "soft",
      })),
    linkedCareers: (major.career_majors ?? [])
      .map((cm: any) => cm.careers)
      .filter(Boolean)
      .map((c: any) => ({
        slug: c.slug,
        title_en: c.title_en,
        title_ar: c.title_ar,
        intro_en: c.intro_en,
        intro_ar: c.intro_ar,
      })),
  };

  return (
    <BackgroundShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-20">
        <MajorProfileClient
          major={majorData}
          initialSection={initialSection as any}
        />
      </main>
    </BackgroundShell>
  );
}
