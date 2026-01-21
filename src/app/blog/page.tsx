import Link from "next/link";


export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const supabase = supabaseServer();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("slug, title_en, title_ar, excerpt_en, excerpt_ar, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-[#071B33] text-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-4 text-white/70">Failed to load posts.</p>
          <pre className="mt-4 text-xs text-white/50">{error.message}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071B33] text-white px-6 py-16" dir={dir}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {lang === "ar" ? "المدونة" : "Blog"}
        </h1>
        <p className="mt-3 text-white/70">
          {lang === "ar"
            ? "آخر التحديثات والمقالات من Career Studio."
            : "Updates and articles from Career Studio."}
        </p>

        <div className="mt-10 space-y-6">
          {(posts ?? []).map((p) => {
            const title = lang === "ar" ? p.title_ar : p.title_en;
            const excerpt = lang === "ar" ? p.excerpt_ar : p.excerpt_en;

            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}?lang=${lang}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition"
              >
                <div className="text-xl font-semibold">{title}</div>
                {excerpt ? (
                  <p className="mt-2 text-white/70 leading-relaxed">{excerpt}</p>
                ) : null}
                <div className="mt-3 text-xs text-white/45">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString()
                    : ""}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
