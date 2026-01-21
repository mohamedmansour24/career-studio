"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function NewsletterSection() {
  const { lang, isRTL } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16" dir={isRTL ? "rtl" : "ltr"}>
      <div className="rounded-3xl border border-border bg-card/30 p-8 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="text-sm tracking-wide text-foreground/60">
              {lang === "ar" ? "النشرة الإخبارية / التحديثات" : "NEWSLETTER / UPDATES"}
            </div>

            <h3 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {lang === "ar"
                ? "احصل على إشعار عند إطلاق الاختبارات ومكتبة الجامعات."
                : "Get notified when assessments & the college library launch."}
            </h3>

            <p className="mt-4 text-foreground/70 leading-relaxed max-w-xl">
              {lang === "ar"
                ? "سنرسل لك تحديثات المنتج من حين لآخر (بدون رسائل مزعجة). كن أول من يجرب الميزات الجديدة مثل اختبارات الشخصية، والبحث عن الجامعات، والمكتبات الجديدة."
                : "We'll send occasional product updates (no spam). Be the first to try new features like personality assessments, college search, and new libraries."}
            </p>
          </div>

          {/* Form */}
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              alert(lang === "ar" ? "شكراً! سيتم ربط النشرة الإخبارية قريباً." : "Thanks! Newsletter wiring comes next.");
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email address"}
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
              />

              <button
                type="submit"
                className="rounded-xl bg-primary hover:bg-primary/90 transition px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                {lang === "ar" ? "أعلمني" : "Notify me"}
              </button>
            </div>

            <div className="mt-3 text-xs text-foreground/45">
              {lang === "ar" ? (
                <>
                  بالاشتراك، أنت توافق على تلقي رسائل من Career Studio.{" "}
                  <Link href="/privacy" className="underline hover:text-foreground/70">
                    الخصوصية
                  </Link>
                  .
                </>
              ) : (
                <>
                  By subscribing, you agree to receive emails from Career Studio.{" "}
                  <Link href="/privacy" className="underline hover:text-foreground/70">
                    Privacy
                  </Link>
                  .
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
