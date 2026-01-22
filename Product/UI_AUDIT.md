# Career Studio UI Audit Report

**Date:** January 22, 2026
**Auditor:** Senior UI/UX Engineer
**Scope:** All pages and key components

---

## Executive Summary

**Overall UI Health Score: 7.2 / 10**

The Career Studio application demonstrates solid foundational architecture with a well-structured design system using CSS variables for theming. The codebase shows good practices including proper TypeScript usage, RTL support, and responsive design considerations. However, there are several issues that need attention before launch, particularly around hardcoded colors breaking theme consistency, accessibility gaps, and some light mode styling problems.

### Strengths
- Comprehensive CSS variable system for theming
- Good bilingual (EN/AR) and RTL support
- Responsive breakpoints generally well-implemented
- Clean component architecture with proper separation of concerns
- Proper hydration handling to avoid SSR mismatches

### Key Concerns
- Multiple hardcoded colors that break in light mode
- Accessibility gaps (missing focus states, ARIA labels)
- Inconsistent button styling across components
- Some placeholder content still in production code

---

## P0 Issues (Blocking) - Must Fix Before Launch

### P0-1: CharacterPanel Hardcoded Colors (Light Mode Broken)
**File:** `/src/components/site/CharacterPanel.tsx`
**Lines:** 32, 42-43, 50, 54-57, 64-67

```tsx
// ISSUE: All colors hardcoded as white, invisible in light mode
<div className="... border-white/15 bg-white/5 ...">
<div className="... text-white/50 ...">
<div className="... border-white/15 bg-white/5 ...">
<button className="... bg-white/15 text-white ..." | "text-white/70">
```

**Impact:** Character panel toggle buttons and container borders are completely invisible in light mode because they use hardcoded white colors against a light background.

**Fix:** Replace with CSS variable-based colors:
- `border-white/15` -> `border-foreground/15`
- `bg-white/5` -> `bg-foreground/5`
- `text-white` -> `text-foreground`
- `text-white/70` -> `text-foreground/70`

---

### P0-2: MobileBucketPillSelect Hardcoded Dark Theme
**File:** `/src/components/site/MobileBucketPillSelect.tsx`
**Lines:** 61, 67-70, 89

```tsx
// ISSUE: Dropdown forces dark theme colors
<span className="text-[#061A33]/70">
<div className="... border-white/15 bg-[#071B33] ...">
<span className={isActive ? "text-white" : "text-white/80"}>
```

**Impact:** Mobile bucket selector dropdown has dark hardcoded background (`#071B33`) which may create jarring contrast in light mode. The dropdown is unusable for users who expect light mode consistency.

**Fix:** Use theme-aware classes:
- `bg-[#071B33]` -> `bg-card`
- `border-white/15` -> `border-border`
- `text-white` -> `text-foreground`

---

### P0-3: WorkGlanceSection Hardcoded Accent Color
**File:** `/src/components/profile/sections/WorkGlanceSection.tsx`
**Lines:** 30-33

```tsx
style={isOn ? {
  backgroundColor: "#6097FF",
  boxShadow: "0 0 10px rgba(96,151,255,0.35)",
} : undefined}
```

**Impact:** The work dimension level indicators use a hardcoded blue that doesn't match the design system's primary/secondary colors and can't adapt to themes.

**Fix:** Use CSS variable `var(--primary)` or `var(--secondary)` with Tailwind's theme colors.

---

### P0-4: EducationSection Hardcoded Color Palette
**File:** `/src/components/profile/sections/EducationSection.tsx`
**Lines:** 5-13, 59

```tsx
const PALETTE = [
  "#6097FF", "#8FBFA3", "#F2C94C", "#9B51E0",
  "#56CCF2", "#EB5757", "#2F80ED",
];
// Also uses inline drop-shadow
filter: "drop-shadow(0 0 6px rgba(96,151,255,0.25))",
```

**Impact:** The donut chart uses hardcoded colors that can't be themed and may have contrast issues in light mode. While a palette for data visualization is acceptable, the glow effect uses a fixed blue that may clash.

**Recommendation:** Keep the palette but consider adding light/dark variants or using CSS variables for the glow effect.

---

### P0-5: Salary Section Shows Placeholder Data
**File:** `/src/components/profile/CareerProfileClient.tsx`
**Lines:** 211-216

```tsx
<div className="text-sm text-muted-foreground">
  {lang === "ar" ? "الراتب" : "Salary"}
</div>
<div className="mt-1 text-lg text-foreground">$10,000 - $20,000</div>
```

**Impact:** Every career shows the same hardcoded salary range. This is misleading to users and appears broken.

**Fix:** Either:
1. Remove the salary section entirely until real data is available
2. Add salary data to the database and display actual values
3. Add a "Data coming soon" indicator

---

## P1 Issues (Degraded) - Should Fix This Sprint

### P1-1: Missing Focus States on Section Tab Buttons
**File:** `/src/components/profile/CareerProfileClient.tsx`, `/src/components/profile/MajorProfileClient.tsx`
**Lines:** 220-232, 126-139

```tsx
<button
  key={s.key}
  onClick={() => setSection(s.key)}
  className={s.key === section
    ? "whitespace-nowrap text-foreground"
    : "whitespace-nowrap hover:text-foreground"}
>
```

**Impact:** Keyboard users cannot visually identify which tab is focused. This is an accessibility failure (WCAG 2.4.7).

**Fix:** Add focus-visible styles:
```tsx
className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
```

---

### P1-2: Bucket Selection Buttons Missing Focus Styles
**File:** `/src/components/library/CareersLibraryClient.tsx`, `/src/components/library/MajorsLibraryClient.tsx`
**Lines:** 134-167

```tsx
<button
  key={b.key}
  onClick={() => handleBucketClick(b.key)}
  className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
>
```

**Impact:** `focus:outline-none` removes all focus indication without replacement. Keyboard users cannot see which bucket is focused.

**Fix:** Replace with proper focus styles or remove `focus:outline-none` entirely.

---

### P1-3: Newsletter Form Submits with Alert Only
**File:** `/src/components/landing/NewsletterSection.tsx`
**Lines:** 31-36

```tsx
onSubmit={(e) => {
  e.preventDefault();
  alert(lang === "ar" ? "شكراً! ..." : "Thanks! Newsletter wiring comes next.");
}}
```

**Impact:** The newsletter form appears functional but only shows an alert. Users will feel tricked when their email isn't actually captured.

**Fix:** Either:
1. Connect to an actual email capture service (Mailchimp, Resend, etc.)
2. Disable the form with a "Coming soon" state
3. Add clear "Coming soon" messaging

---

### P1-4: "In Demand" Badge Hardcoded for All Careers
**File:** `/src/components/profile/CareerProfileClient.tsx`
**Lines:** 133-135

```tsx
<div className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-200">
  {lang === "ar" ? "مطلوب" : "In Demand"}
</div>
```

**Impact:** Every career shows "In Demand" badge, making it meaningless. This is a data accuracy issue.

**Fix:** Add an `is_in_demand` field to careers table and conditionally render the badge.

---

### P1-5: JourneyCard Counts Are Static
**File:** `/src/components/landing/LandingContent.tsx`
**Lines:** 141-163

```tsx
<JourneyCard count="800" label={text.careers} ... />
<JourneyCard count="300" label={text.majors} ... />
<JourneyCard count="31097" label={text.colleges} ... />
```

**Impact:** The landing page claims specific numbers (800 careers, 300 majors) that may not match actual database counts. This could be misleading if data changes.

**Fix:** Fetch actual counts from the database or remove specific numbers.

---

### P1-6: Colleges Card Links to Majors
**File:** `/src/components/landing/LandingContent.tsx`
**Line:** 162

```tsx
<JourneyCard
  count="31097"
  label={text.colleges}
  ...
  href="/majors?bucket=artistic"  // Wrong link for colleges!
/>
```

**Impact:** The "Colleges" card links to the majors page, which is confusing and likely a mistake.

**Fix:** Either link to a colleges "coming soon" page or make it non-clickable.

---

### P1-7: Blog Page Missing BackgroundShell and Footer
**File:** `/src/app/blog/page.tsx`

**Impact:** The blog page uses a plain `div` with `bg-background` instead of `BackgroundShell`, making it visually inconsistent with other pages. It also lacks the Footer component.

**Fix:** Wrap content in `BackgroundShell` and add `Footer` for consistency.

---

### P1-8: LibraryCard Button Missing Aria-Label
**File:** `/src/components/cards/LibraryCard.tsx`
**Lines:** 58-74

The card's CTA link should have an accessible name that includes context (e.g., "Explore Software Engineer career").

**Fix:** Add `aria-label={`${ctaLabel}: ${title}`}` to the Link component.

---

## P2 Issues (Cosmetic) - Can Defer to Post-Launch

### P2-1: FutureConfusionSection Preview Area is Empty
**File:** `/src/components/landing/FutureConfusionSection.tsx`
**Lines:** 131-143

```tsx
<div className="text-foreground/35 text-sm">
  {lang === "ar" ? `معاينة الخطوة ${slide.step}` : `Preview for step ${slide.step}`}
</div>
```

**Impact:** The carousel has an empty preview area with placeholder text. While functional, it looks unfinished.

**Recommendation:** Either add preview images/animations or remove the preview panel entirely.

---

### P2-2: IntroSection Fixed Height May Truncate Content
**File:** `/src/components/profile/sections/IntroSection.tsx`
**Lines:** 3-11

```tsx
className="max-h-[300px] overflow-y-auto pr-2 ..."
```

**Impact:** Long introductions are truncated at 300px with scroll. This may hide important content from users who don't realize they can scroll.

**Recommendation:** Consider showing a "Show more" button or removing the height constraint.

---

### P2-3: RoleSection Missing Empty State
**File:** `/src/components/profile/sections/RoleSection.tsx`

**Impact:** If a career has no tasks, the section shows nothing (empty list).

**Fix:** Add empty state: "No role tasks defined yet."

---

### P2-4: SkillsSection Missing Empty State
**File:** `/src/components/profile/sections/SkillsSection.tsx`

**Impact:** If hard or soft skills arrays are empty, the section header still shows but with no content.

**Fix:** Add "No skills defined yet" message when both arrays are empty.

---

### P2-5: Inconsistent Button Border Radius
Multiple files use different border radius values:
- `rounded-xl` (12px) - Most buttons
- `rounded-lg` (8px) - Some buttons
- `rounded-full` - Pills

**Files affected:**
- Navbar.tsx (rounded-lg for language toggle, rounded-xl for mobile menu)
- JourneyCard.tsx (rounded-lg)
- LibraryCard.tsx (rounded-lg)
- Landing buttons (rounded-xl)

**Recommendation:** Standardize on `rounded-xl` for action buttons and `rounded-full` for pills.

---

### P2-6: Error/404 Pages Missing Navbar
**Files:** `/src/app/error.tsx`, `/src/app/not-found.tsx`

**Impact:** Users have no easy navigation when they hit these pages except for the provided links.

**Recommendation:** Add Navbar for consistent navigation.

---

### P2-7: Duplicated Pill Component Definition
**Files:**
- `/src/components/profile/MajorProfileClient.tsx` (lines 57-62)
- `/src/components/profile/sections/SkillsSection.tsx` (lines 5-11)

Both files define an identical `Pill` component locally.

**Fix:** Extract to a shared component `/src/components/ui/Pill.tsx`.

---

### P2-8: BUCKETS Array Duplicated
**Files:**
- `/src/components/library/CareersLibraryClient.tsx` (lines 10-17)
- `/src/components/library/MajorsLibraryClient.tsx` (lines 10-17)

Identical BUCKETS configuration is duplicated.

**Fix:** Extract to a shared constant `/src/lib/constants/buckets.ts`.

---

### P2-9: ThemeToggle Uses Inconsistent Border Class
**File:** `/src/components/site/ThemeToggle.tsx`
**Line:** 11

```tsx
"... border border-border bg-card/50 ..."
```

The Navbar's language toggle uses `border-foreground/15` while ThemeToggle uses `border-border`. While both work, it's inconsistent.

---

### P2-10: Missing RTL Testing for Slide Animations
**File:** `/src/components/landing/FutureConfusionSection.tsx`

The auto-advancing carousel and step indicator animations may not feel natural in RTL mode. The arrow icon in CTA buttons always points right.

**Recommendation:** Test with Arabic users and consider flipping arrow direction in RTL.

---

## Recommendations - Prioritized Fix List

### Immediate (Before Launch)
1. **Fix CharacterPanel hardcoded white colors** (P0-1) - Critical for light mode
2. **Fix MobileBucketPillSelect dark theme** (P0-2) - Mobile unusable in light mode
3. **Remove or fix hardcoded salary** (P0-5) - Misleading users
4. **Add focus states to all interactive elements** (P1-1, P1-2) - Accessibility requirement

### This Sprint
5. **Connect newsletter form or disable it** (P1-3) - User trust issue
6. **Fix Colleges card link** (P1-6) - Confusing navigation
7. **Add BackgroundShell to blog page** (P1-7) - Visual consistency
8. **Remove or data-drive "In Demand" badge** (P1-4) - Data accuracy
9. **Fix hardcoded colors in WorkGlanceSection** (P0-3) - Theme consistency

### Post-Launch
10. Extract shared components (Pill, BUCKETS) - Code maintainability
11. Add empty states to all sections - Better UX
12. Standardize button border radius - Visual polish
13. Add Navbar to error pages - Better navigation
14. Replace FutureConfusionSection preview placeholder - Professional appearance

---

## Technical Debt Notes

1. **scrollbar-thin, scrollbar-thumb-transparent** classes in IntroSection may not work in all browsers. Consider using the hover-scroll utility from globals.css instead.

2. The `@tailwindcss/line-clamp` plugin in tailwind.config.ts may be unnecessary in Tailwind CSS v3.3+ as line-clamp is now included by default.

3. Multiple components use `any` type casting (e.g., `career as any`) which reduces type safety. Consider proper typing.

---

## Accessibility Audit Summary

| Criterion | Status | Notes |
|-----------|--------|-------|
| Color Contrast | Partial | Light mode has issues with hardcoded white |
| Keyboard Navigation | Fail | Missing focus indicators on buttons |
| Screen Reader | Partial | Some aria-labels present, others missing |
| Reduced Motion | Pass | No problematic animations |
| RTL Support | Pass | Well implemented throughout |
| Responsive Design | Pass | Good breakpoint handling |

---

*End of Report*
