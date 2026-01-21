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
  const bucket = (BUCKET_KEYS.includes(sp.bucket as BucketKey) ? sp.bucket : "artistic") as BucketKey;

  // Fetch majors linked to active bucket - include both language fields
  const { data, error } = await supabase
    .from("major_interest_categories")
    .select(`
      majors ( slug, title_en, title_ar, intro_en, intro_ar ),
      interest_categories!inner ( key )
    `)
    .eq("interest_categories.key", bucket);

  if (error) {
    return (
      <MajorsLibraryClient
        majors={[]}
        bucket={bucket}
        countsByKey={{}}
        error={error.message}
      />
    );
  }

  const majors: MajorRow[] = (data ?? [])
    .map((r: any) => r.majors)
    .filter(Boolean);

  // Dynamic counts per bucket
  const { data: countData } = await supabase
    .from("major_interest_categories")
    .select("interest_categories!inner(key)");

  const countsByKey: Record<string, number> = {};
  if (countData) {
    for (const row of countData as any[]) {
      const k = row.interest_categories?.key;
      if (!k) continue;
      countsByKey[k] = (countsByKey[k] ?? 0) + 1;
    }
  }

  return (
    <MajorsLibraryClient
      majors={majors}
      bucket={bucket}
      countsByKey={countsByKey}
    />
  );
}
