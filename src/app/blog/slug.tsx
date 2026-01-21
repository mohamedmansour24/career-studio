import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang === "ar" ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const supabase = supabaseServer();
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title_en, title_ar, content_en, content_ar, published_at, status"
    )
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) notFound();
  if (!post) notFound();

  const title = lang === "ar" ? post.title_ar : post.title_en;
  const content = lang === "ar" ? post.content_ar : post.content_en;

  return (
    <div className="min-h-screen bg-[#071B33] text-white px-6 py-16" dir={dir}>
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/blog?lang=${lang}`}
          className="text-sm text-white/70 hover:text-white"
        >
          ← {lang === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">{title}</h1>

        <div className="mt-3 text-xs text-white/45">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString()
            : ""}
        </div>

        <article className="prose prose-invert max-w-none mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
