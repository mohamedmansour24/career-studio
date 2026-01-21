"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/site/Navbar";
import { FutureConfusionSection } from "@/components/landing/FutureConfusionSection";
import { JourneyCard } from "@/components/landing/JourneyCard";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { Footer } from "@/components/site/Footer";
import { ArrowRight } from "lucide-react";

// Translations
const t = {
  en: {
    discoverPath: "Discover Your Path with:",
    brandName: "Career Studio",
    tagline1: "Unlock a World of Possibilities",
    tagline2: "Find Your Perfect Path Forward",
    exploreCareers: "Explore Careers",
    exploreMajors: "Explore Majors",
    yourJourney: "YOUR",
    journey: "JOURNEY,",
    yourChoices: "YOUR",
    choices: "CHOICES!",
    journeyDescription: "With a world of careers, majors, and colleges at your fingertips, let's make choosing feel less like rocket science and more like a fun road trip.",
    careers: "CAREERS",
    careersDesc: "Explore structured career profiles with role tasks, skills, education pathways, and real-world work environments.",
    exploreCareersBtn: "EXPLORE CAREERS",
    majors: "MAJORS",
    majorsDesc: "Browse majors, see what you'll study, and connect each major to careers so you can compare paths clearly.",
    exploreMajorsBtn: "EXPLORE MAJORS",
    colleges: "COLLEGES",
    collegesDesc: "Coming soon: explore colleges by fit, location, and focus so you can shortlist options with confidence.",
    comingSoon: "COMING SOON",
  },
  ar: {
    discoverPath: "اكتشف مسارك مع:",
    brandName: "Career Studio",
    tagline1: "افتح عالماً من الإمكانيات",
    tagline2: "اعثر على مسارك المثالي",
    exploreCareers: "استكشف الوظائف",
    exploreMajors: "استكشف التخصصات",
    yourJourney: "رحلتك",
    journey: "",
    yourChoices: "خياراتك",
    choices: "!",
    journeyDescription: "مع عالم من الوظائف والتخصصات والجامعات في متناول يدك، دعنا نجعل الاختيار أقل تعقيداً وأكثر متعة.",
    careers: "الوظائف",
    careersDesc: "استكشف ملفات وظيفية منظمة تتضمن مهام الدور والمهارات ومسارات التعليم وبيئات العمل الحقيقية.",
    exploreCareersBtn: "استكشف الوظائف",
    majors: "التخصصات",
    majorsDesc: "تصفح التخصصات واكتشف ما ستدرسه وما المهارات التي ستكتسبها وما الوظائف المرتبطة بكل تخصص.",
    exploreMajorsBtn: "استكشف التخصصات",
    colleges: "الجامعات",
    collegesDesc: "قريباً: استكشف الجامعات حسب الملاءمة والموقع والتركيز لتتمكن من اختيار الأفضل بثقة.",
    comingSoon: "قريباً",
  },
};

export function LandingContent() {
  const { lang, isRTL } = useLanguage();
  const text = t[lang];

  return (
    <div
      className="landing-page min-h-screen text-foreground relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative z-10">
        {/* NAVBAR */}
        <Navbar />

        {/* HERO */}
        <section className="mx-auto max-w-6xl px-6 pt-12 md:pt-20 pb-20 min-h-[85vh] flex items-center">
          <div className="max-w-3xl">
            <div className="text-sm text-secondary tracking-wide mb-6 font-semibold uppercase">
              {text.discoverPath}
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Career{" "}
              <span className="text-primary">Studio</span>
            </h1>

            <p className="mt-6 text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              {text.tagline1}
            </p>

            <p className="mt-2 text-2xl md:text-3xl text-foreground/70 leading-relaxed">
              {text.tagline2}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/careers?bucket=artistic"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition font-semibold text-lg shadow-lg shadow-primary/25"
              >
                {text.exploreCareers}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/majors?bucket=artistic"
                className="px-8 py-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 text-center font-semibold text-lg transition"
              >
                {text.exploreMajors}
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: CONFUSED ABOUT YOUR FUTURE? */}
        <FutureConfusionSection />

        {/* SECTION 3: YOUR JOURNEY, YOUR CHOICES! */}
        <section className="mx-auto max-w-6xl px-6 pt-10 pb-24">
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {lang === "en" ? (
                <>
                  <span className="text-secondary">{text.yourJourney}</span> {text.journey}{" "}
                  <span className="text-secondary">{text.yourChoices}</span>
                  <br />
                  {text.choices}
                </>
              ) : (
                <>
                  <span className="text-secondary">{text.yourJourney}</span>،{" "}
                  <span className="text-secondary">{text.yourChoices}</span>
                  {text.choices}
                </>
              )}
            </h3>

            <p className="mt-4 text-foreground/70 leading-relaxed">
              {text.journeyDescription}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <JourneyCard
              count="800"
              label={text.careers}
              description={text.careersDesc}
              buttonLabel={text.exploreCareersBtn}
              href="/careers?bucket=artistic"
            />

            <JourneyCard
              count="300"
              label={text.majors}
              description={text.majorsDesc}
              buttonLabel={text.exploreMajorsBtn}
              href="/majors?bucket=artistic"
            />

            <JourneyCard
              count="31097"
              label={text.colleges}
              description={text.collegesDesc}
              buttonLabel={text.comingSoon}
              href="/majors?bucket=artistic"
            />
          </div>
        </section>

        {/* NEWSLETTER */}
        <NewsletterSection />

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
