"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { lang, toggleLang, isRTL } = useLanguage();
  const { resolvedTheme } = useTheme();

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on resize
  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Keep navbar layout fixed (LTR) regardless of language
  // Only text content changes, not the layout direction
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        className={mobile ? "py-3 hover:text-foreground" : "hover:text-foreground transition-colors"}
        href="/careers"
        onClick={() => setOpen(false)}
      >
        {lang === "ar" ? "المهن" : "Careers"}
      </Link>
      <Link
        className={mobile ? "py-3 hover:text-foreground" : "hover:text-foreground transition-colors"}
        href="/majors"
        onClick={() => setOpen(false)}
      >
        {lang === "ar" ? "التخصصات" : "Majors"}
      </Link>
      <Link
        className={mobile ? "py-3 hover:text-foreground" : "hover:text-foreground transition-colors"}
        href="/blog"
        onClick={() => setOpen(false)}
      >
        {lang === "ar" ? "المدونة" : "Blogs"}
      </Link>
      <Link
        className={mobile ? "py-3 hover:text-foreground" : "hover:text-foreground transition-colors"}
        href="/request-feature"
        onClick={() => setOpen(false)}
      >
        {lang === "ar" ? "اطلب ميزة" : "Request a Feature"}
      </Link>
      <Link
        className={mobile ? "py-3 hover:text-foreground" : "hover:text-foreground transition-colors"}
        href="/chat"
        onClick={() => setOpen(false)}
      >
        {lang === "ar" ? "تحدث معنا" : "Chat with Us"}
      </Link>
    </>
  );

  return (
    <header className="w-full">
      {/* Navbar always LTR layout - does not flip on language change */}
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between" dir="ltr">
        <Link href="/" className="flex items-center gap-3">
          {/* 
            Logo with fixed dimensions to prevent layout shift
            Both logos render at same size regardless of internal SVG aspect ratio
          */}
          <div className="relative w-[140px] h-[40px] flex-shrink-0">
            {mounted ? (
              <Image
                src={isDark ? "/assets/logo/logo_light_trim.png" : "/assets/logo/logo_dark_trim.png"}
                alt="Career Studio"
                fill
                priority
                className="object-contain object-left"
              />
            ) : (
              <div className="w-[140px] h-[40px]" />
            )}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-foreground/70 text-sm">
          <NavLinks />

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-xs font-semibold hover:bg-foreground/10 transition"
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-foreground" : "text-foreground/50"}>EN</span>
            <span className="text-foreground/35">|</span>
            <span className={lang === "ar" ? "text-foreground" : "text-foreground/50"}>AR</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-foreground/15 bg-foreground/5 min-w-11 min-h-11 p-2 hover:bg-foreground/10 transition"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-6xl px-6 pb-6">
            <div className="rounded-2xl border border-foreground/15 glass-panel p-4 text-foreground/80 text-sm flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
              <NavLinks mobile />

              {/* Language Toggle (mobile) */}
              <button
                type="button"
                onClick={toggleLang}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-3 text-xs font-semibold hover:bg-foreground/10 transition"
                aria-label="Toggle language"
              >
                <span className={lang === "en" ? "text-foreground" : "text-foreground/50"}>EN</span>
                <span className="text-foreground/35">|</span>
                <span className={lang === "ar" ? "text-foreground" : "text-foreground/50"}>AR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
