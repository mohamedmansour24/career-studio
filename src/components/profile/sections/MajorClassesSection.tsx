export function MajorClassesSection({
  classes,
}: {
  classes: Array<{
    id: string;
    title_en: string;
    description_en: string | null;
    video_url: string | null;
  }>;
}) {
  return (
    <div className="space-y-5">
      {classes.map((c) => (
        <div
          key={c.id}
          className="rounded-2xl border border-white/15 bg-white/5 p-5"
        >
          <div className="text-white font-semibold">{c.title_en}</div>

          {c.description_en && (
            <div className="mt-2 text-white/70 leading-relaxed">
              {c.description_en}
            </div>
          )}

          {c.video_url && (
            <a
              href={c.video_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-white/80 hover:text-white underline underline-offset-4"
            >
              Watch lecture
            </a>
          )}
        </div>
      ))}

      {classes.length === 0 && (
        <div className="text-white/70">No classes added yet.</div>
      )}
    </div>
  );
}
