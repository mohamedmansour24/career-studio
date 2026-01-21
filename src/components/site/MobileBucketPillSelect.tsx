"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function MobileBucketPillSelect<T extends string>({
  value,
  options,
  basePath,
  colors,
}: {
  value: T;
  options: Array<{ key: T; label: string }>;
  basePath: string; // "/careers" or "/majors"
  colors: Record<T, string>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(
    () => options.find((o) => o.key === value) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const activeColor = colors[value] ?? "#8FBFA3";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-5 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
        style={{ backgroundColor: activeColor, color: "#061A33" }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{active.label}</span>
        <span className="text-[#061A33]/70">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute left-0 mt-2 w-56
            rounded-2xl border border-white/15
            bg-[#071B33] shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            overflow-hidden z-50
          "
          role="listbox"
        >
          {options.map((o) => {
            const isActive = o.key === value;
            const c = colors[o.key] ?? "#8FBFA3";

            return (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(`${basePath}?bucket=${o.key}`);
                }}
                className="
                  w-full text-left px-4 py-3
                  flex items-center justify-between
                  hover:bg-white/5
                "
              >
                <span className={isActive ? "text-white" : "text-white/80"}>
                  {o.label}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
