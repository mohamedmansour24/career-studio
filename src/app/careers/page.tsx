import { supabase } from "@/lib/supabase/client";
import { CareersLibraryClient, CareerRow } from "@/components/library/CareersLibraryClient";

const BUCKET_KEYS = ["artistic", "social", "enterprising", "investigative", "conventional", "realistic"] as const;
type BucketKey = (typeof BUCKET_KEYS)[number];

export default async function CareersLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ bucket?: string }>;
}) {
  const sp = await searchParams;
  const initialBucket = (BUCKET_KEYS.includes(sp.bucket as BucketKey) ? sp.bucket : "artistic") as BucketKey;

  // Fetch ALL careers with their interest categories for client-side filtering
  const { data, error } = await supabase
    .from("careers")
    .select(`
      slug, 
      title_en, 
      title_ar, 
      intro_en, 
      intro_ar,
      career_interest_categories (
        interest_categories ( key )
      )
    `);

  if (error) {
    return (
      <CareersLibraryClient
        careers={[]}
        initialBucket={initialBucket}
        countsByKey={{}}
        error={error.message}
      />
    );
  }

  // Transform data to include categories array for each career
  const careers: CareerRow[] = (data ?? []).map((career: any) => ({
    slug: career.slug,
    title_en: career.title_en,
    title_ar: career.title_ar,
    intro_en: career.intro_en,
    intro_ar: career.intro_ar,
    categories: (career.career_interest_categories ?? [])
      .map((cic: any) => cic.interest_categories?.key)
      .filter(Boolean) as string[],
  }));

  // Calculate counts per bucket from the career data
  const countsByKey: Record<string, number> = {};
  for (const career of careers) {
    for (const categoryKey of career.categories) {
      countsByKey[categoryKey] = (countsByKey[categoryKey] ?? 0) + 1;
    }
  }

  return (
    <CareersLibraryClient
      careers={careers}
      initialBucket={initialBucket}
      countsByKey={countsByKey}
    />
  );
}
