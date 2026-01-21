import { LibraryCard } from "@/components/cards/LibraryCard";

export function MajorCareersSection({
  careers,
}: {
  careers: Array<{ slug: string; title_en: string; intro_en: string }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {careers.map((c) => (
        <LibraryCard
          key={c.slug}
          title={c.title_en}
          description={c.intro_en}
          href={`/careers/${c.slug}?section=intro`}
        />
      ))}

      {careers.length === 0 && (
        <div className="text-white/70">No linked careers yet.</div>
      )}
    </div>
  );
}
