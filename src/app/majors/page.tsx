import { supabase } from "@/lib/supabase/client";
import { MajorsLibraryClient, MajorRow } from "@/components/library/MajorsLibraryClient";

const BUCKET_KEYS = ["artistic", "social", "enterprising", "investigative", "conventional", "realistic"] as const;
type BucketKey = (typeof BUCKET_KEYS)[number];

export default async function MajorsLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ bucket?: string }>;
}) {
  const sp = await searchParams;
  const initialBucket = (BUCKET_KEYS.includes(sp.bucket as BucketKey) ? sp.bucket : "artistic") as BucketKey;

  // Fetch ALL majors with their interest categories for client-side filtering
  const { data, error } = await supabase
    .from("majors")
    .select(`
      slug, 
      title_en, 
      title_ar, 
      intro_en, 
      intro_ar,
      major_interest_categories (
        interest_categories ( key )
      )
    `);

  if (error) {
    return (
      <MajorsLibraryClient
        majors={[]}
        initialBucket={initialBucket}
        countsByKey={{}}
        error={error.message}
      />
    );
  }

  // Transform data to include categories array for each major
  const majors: MajorRow[] = (data ?? []).map((major: any) => ({
    slug: major.slug,
    title_en: major.title_en,
    title_ar: major.title_ar,
    intro_en: major.intro_en,
    intro_ar: major.intro_ar,
    categories: (major.major_interest_categories ?? [])
      .map((mic: any) => mic.interest_categories?.key)
      .filter(Boolean) as string[],
  }));

  // Calculate counts per bucket from the major data
  const countsByKey: Record<string, number> = {};
  for (const major of majors) {
    for (const categoryKey of major.categories) {
      countsByKey[categoryKey] = (countsByKey[categoryKey] ?? 0) + 1;
    }
  }

  return (
    <MajorsLibraryClient
      majors={majors}
      initialBucket={initialBucket}
      countsByKey={countsByKey}
    />
  );
}
