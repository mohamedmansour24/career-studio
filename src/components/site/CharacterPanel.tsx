"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function CharacterPanel({
  careerTitle,
  maleUrl,
  femaleUrl,
}: {
  careerTitle: string;
  maleUrl?: string | null;
  femaleUrl?: string | null;
}) {
  const { lang } = useLanguage();
  const hasMale = !!maleUrl;
  const hasFemale = !!femaleUrl;

  const defaultVariant = useMemo<"female" | "male">(() => {
    if (hasFemale) return "female";
    return "male";
  }, [hasFemale]);

  const [variant, setVariant] = useState<"female" | "male">(defaultVariant);

  const activeUrl = variant === "female" ? femaleUrl : maleUrl;
  const canToggle = hasMale && hasFemale;

  return (
    <div className="flex flex-col items-center md:items-start gap-4">
      <div className="relative h-[360px] w-[260px] rounded-3xl border border-foreground/15 bg-foreground/5 overflow-hidden">
        {activeUrl ? (
          <Image
            src={activeUrl}
            alt={`${careerTitle} character`}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/50 text-sm">
            {lang === "ar" ? "صورة الشخصية" : "Character image"}
          </div>
        )}
      </div>

      {/* Toggle only if both exist */}
      {canToggle ? (
        <div className="inline-flex rounded-full border border-foreground/15 bg-foreground/5 p-1">
          <button
            onClick={() => setVariant("female")}
            className={
              "px-4 py-2 rounded-full text-sm transition " +
              (variant === "female"
                ? "bg-foreground/15 text-foreground"
                : "text-foreground/70 hover:text-foreground")
            }
          >
            {lang === "ar" ? "أنثى" : "Female"}
          </button>
          <button
            onClick={() => setVariant("male")}
            className={
              "px-4 py-2 rounded-full text-sm transition " +
              (variant === "male"
                ? "bg-foreground/15 text-foreground"
                : "text-foreground/70 hover:text-foreground")
            }
          >
            {lang === "ar" ? "ذكر" : "Male"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
