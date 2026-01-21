export function ClassesSection({
  classes,
}: {
  classes: Array<{
    title: string;
    description?: string | null;
    video_url?: string | null;
  }>;
}) {
  return (
    <div className="space-y-5">
      {classes.map((c, i) => (
        <div key={`${c.title}-${i}`} className="rounded-xl border border-white/15 bg-white/5 p-5">
          <div className="font-semibold text-white">{c.title}</div>
          {c.description ? (
            <div className="mt-2 text-white/70 leading-relaxed whitespace-pre-line">
              {c.description}
            </div>
          ) : null}

          {c.video_url ? (
            <a
              className="mt-3 inline-block text-sm text-white/80 underline underline-offset-4 hover:text-white"
              href={c.video_url}
              target="_blank"
              rel="noreferrer"
            >
              Watch lecture
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
