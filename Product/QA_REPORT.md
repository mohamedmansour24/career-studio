# Career Studio - Technical QA Audit Report

**Date:** January 22, 2026
**Auditor:** Senior Software Engineer
**Codebase:** `/Users/mohamedmansour/PARA/Projects/career-studio-main`

---

## Executive Summary

Career Studio is a Next.js 16 application with React 19, Tailwind CSS 4, and Supabase as the backend. The codebase demonstrates solid foundational architecture with bilingual (EN/AR) support, proper theme handling, and server-side rendering patterns. However, several **critical issues** must be addressed before building further, including broken pages, missing dependencies, type safety concerns, and absent error handling infrastructure.

**Verdict:** The foundation is usable but requires immediate fixes before scaling. Refactoring is recommended in targeted areas rather than a full rewrite.

---

## Critical Issues (MUST FIX)

### 1. Blog Page is Completely Broken

**Files Affected:**
- `/src/app/blog/page.tsx`
- `/src/app/blog/slug.tsx`

**Issues:**
- `supabaseServer()` function is called but never imported or defined
- Missing dependencies: `react-markdown`, `remark-gfm`
- `@/lib/supabase/server` module does not exist
- `slug.tsx` file is named incorrectly (should be `[slug]/page.tsx` for dynamic routing)
- TypeScript parameter `p` has implicit `any` type

**TypeScript Errors:**
```
src/app/blog/page.tsx(12,20): error TS2304: Cannot find name 'supabaseServer'.
src/app/blog/page.tsx(44,31): error TS7006: Parameter 'p' implicitly has an 'any' type.
src/app/blog/slug.tsx(2,27): error TS2307: Cannot find module 'react-markdown'
src/app/blog/slug.tsx(3,23): error TS2307: Cannot find module 'remark-gfm'
src/app/blog/slug.tsx(4,32): error TS2307: Cannot find module '@/lib/supabase/server'
```

**Impact:** Blog functionality is non-functional. Application will crash if users navigate to `/blog`.

**Recommendation:** Either remove blog pages entirely for now or:
1. Create `/src/lib/supabase/server.ts` with server-side Supabase client
2. Install missing dependencies: `npm install react-markdown remark-gfm`
3. Rename `slug.tsx` to `[slug]/page.tsx`

---

### 2. No Error Boundaries or Error Pages

**Missing Files:**
- No `error.tsx` files in any route
- No `not-found.tsx` (404 page)
- No global error boundary

**Impact:** Unhandled errors will crash the entire application. Users will see default browser error pages instead of graceful error states.

**Recommendation:** Create at minimum:
- `/src/app/error.tsx` - Global error boundary
- `/src/app/not-found.tsx` - Custom 404 page
- Consider route-specific error handlers for `/careers/[slug]` and `/majors/[slug]`

---

### 3. No Loading States

**Missing Files:**
- No `loading.tsx` files in any route

**Impact:** Users see no feedback during server-side data fetching, creating poor UX especially on slow connections.

**Recommendation:** Add loading skeletons to:
- `/src/app/careers/loading.tsx`
- `/src/app/careers/[slug]/loading.tsx`
- `/src/app/majors/loading.tsx`
- `/src/app/majors/[slug]/loading.tsx`

---

### 4. Missing SEO Meta Tags

**File:** `/src/app/layout.tsx`

**Issue:** No `metadata` export for SEO. The layout defines fonts but no page title, description, Open Graph tags, or viewport settings.

**Current State:**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // No metadata export
```

**Impact:** Poor SEO, missing page titles in browser tabs, no social media preview cards.

**Recommendation:** Add metadata export:
```tsx
export const metadata = {
  title: {
    default: 'Career Studio',
    template: '%s | Career Studio'
  },
  description: 'Discover your career path...',
  // ... other meta tags
};
```

---

### 5. React Render Rule Violation

**File:** `/src/components/profile/sections/EducationSection.tsx` (Line 62)

**ESLint Error:**
```
Error: Cannot reassign variable after render completes
Reassigning `offset` after render has completed can cause inconsistent behavior
```

**Issue:** The `offset` variable is mutated during the render cycle in the `Donut` component's SVG generation. This violates React's pure render rule.

**Impact:** Potential inconsistent rendering, especially with React Strict Mode or concurrent features.

**Recommendation:** Use `reduce` or memoize the offset calculations:
```tsx
const segments = useMemo(() => {
  let offset = 0;
  return safe.map((s, i) => {
    const dash = (s.percent / 100) * c;
    const result = { ...s, offset, dash, color: PALETTE[i % PALETTE.length] };
    offset += dash;
    return result;
  });
}, [safe, c]);
```

---

## Medium Issues (SHOULD FIX)

### 6. Excessive Use of `any` Type

**Files Affected:**
- `/src/app/careers/page.tsx` (2 instances)
- `/src/app/careers/[slug]/page.tsx` (11 instances)
- `/src/app/majors/page.tsx` (2 instances)
- `/src/app/majors/[slug]/page.tsx` (6 instances)
- `/src/components/profile/CareerProfileClient.tsx` (5 instances)
- `/src/components/profile/MajorProfileClient.tsx` (4 instances)
- `/src/components/library/CareersLibraryClient.tsx` (2 instances)
- `/src/components/library/MajorsLibraryClient.tsx` (2 instances)

**Total:** 34+ instances of `@typescript-eslint/no-explicit-any` violations

**Impact:** Loss of type safety, potential runtime errors, harder debugging.

**Recommendation:** Generate Supabase types using:
```bash
npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
```
Then use proper typing for all database queries.

---

### 7. Non-null Assertion on Environment Variables

**File:** `/src/lib/supabase/client.ts`

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
```

**Issue:** Using `!` assumes these will always be defined. If missing, the app will crash with an unclear error.

**Recommendation:** Add validation:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

---

### 8. Duplicate Code in Library Components

**Files:**
- `/src/components/library/CareersLibraryClient.tsx`
- `/src/components/library/MajorsLibraryClient.tsx`

**Issue:** These two files are ~95% identical with only minor differences (careers vs majors). This violates DRY principles.

**Recommendation:** Create a generic `LibraryClient` component that accepts:
- `items: T[]`
- `itemType: 'career' | 'major'`
- `basePath: string`
- `translations: object`

---

### 9. Duplicate Pill Components

**Files containing `Pill` component:**
- `/src/components/profile/sections/SkillsSection.tsx`
- `/src/components/profile/sections/MajorSkillsSection.tsx`
- `/src/components/profile/MajorProfileClient.tsx`

**Recommendation:** Extract to `/src/components/ui/Pill.tsx`

---

### 10. Hardcoded Salary Data

**File:** `/src/components/profile/CareerProfileClient.tsx` (Line 215)

```tsx
<div className="mt-1 text-lg text-white">$10,000 - $20,000</div>
```

**Issue:** Salary is hardcoded rather than coming from the database or API.

**Recommendation:** Either:
- Add salary fields to the careers table
- Remove the salary display
- Add a "Coming Soon" placeholder

---

### 11. FloatingRobot Component Non-functional

**File:** `/src/components/site/FloatingRobot.tsx`

**Issue:** The "Ask me anything" button has no `onClick` handler. It appears functional but does nothing.

**Recommendation:** Either implement the chat functionality or remove/hide this component until ready.

---

### 12. Unused Mock Data Files

**Files:**
- `/src/lib/mock/careers.ts`
- `/src/lib/mock/careerProfile.ts`
- `/src/lib/mock/majors.ts`

**Issue:** These files exist but are not imported anywhere. They appear to be from early development.

**Recommendation:** Remove or document as reference data for testing.

---

## Low Issues (NICE TO FIX)

### 13. Scripts Using CommonJS

**Files:** All files in `/scripts/`

**ESLint Warnings:** Multiple `@typescript-eslint/no-require-imports` violations.

**Impact:** Inconsistent module system usage. Scripts work fine but trigger linting errors.

**Recommendation:** Either:
- Convert to ES modules (.mjs extension)
- Add `/scripts/` to ESLint ignore
- Leave as-is since these are one-time import scripts

---

### 14. Unused Variables in Scripts

**Files:** `/scripts/import-data.js`, `/scripts/import-majors.js`, etc.

**Warnings:**
- `mapLevelToScale` defined but never used
- `slugify` defined but never used
- Various `data` variables assigned but never used

**Recommendation:** Clean up or use these functions.

---

### 15. LanguageContext Hydration Mismatch Risk

**File:** `/src/context/LanguageContext.tsx`

**Issue:** The `mounted` state is tracked but not used to prevent hydration mismatch. Language defaults to "en" during SSR but may differ on client if user previously selected Arabic.

**Current Pattern (from other components like Navbar):**
```tsx
const [mounted, setMounted] = useState(false);
React.useEffect(() => { setMounted(true); }, []);
// Content only shows after mounted
```

**Recommendation:** Consider using cookies or URL params for language to ensure SSR/client consistency.

---

### 16. Missing ARIA Labels for Interactive Elements

**Files:** Various button elements without descriptive labels.

**Example:** Category filter buttons in library pages have no `aria-label`.

**Recommendation:** Add appropriate ARIA labels for accessibility compliance.

---

### 17. Hard-coded Colors in BackgroundShell

**File:** `/src/components/site/BackgroundShell.tsx`

```tsx
style={{
  backgroundColor: "#001F3F",
  backgroundImage: `...rgba(0,180,255,0.14)...`
}}
```

**Issue:** These colors don't use CSS variables, so they won't respond to theme changes.

**Recommendation:** Use `var(--background)` or conditional rendering based on theme.

---

## Database & Security Assessment

### SQL Injection Risk: LOW

The codebase uses Supabase's JavaScript client with parameterized queries. No raw SQL strings are constructed from user input.

**Example of safe usage:**
```typescript
await supabase.from("careers").select("*").eq("slug", slug);
```

### Environment Variables: ACCEPTABLE

- `.env.example` provided with template values
- `.env*` properly gitignored
- Service key used only in import scripts (not deployed)
- NEXT_PUBLIC_ prefix correctly used for client-side variables

### Authentication: NOT IMPLEMENTED

No authentication or user system exists. All data is publicly readable through the Supabase anon key.

**Note:** RLS (Row Level Security) should be verified on Supabase dashboard.

---

## Performance Assessment

### Server Components: GOOD

Most data fetching happens in Server Components (pages), with Client Components used only for interactivity (language toggle, section tabs, theme).

### Image Optimization: GOOD

Using Next.js `Image` component with proper `sizes` and `priority` attributes.

### Bundle Size: ACCEPTABLE

Dependencies are minimal. No heavy UI libraries. `lucide-react` is tree-shakeable.

### Potential Improvements:

1. **Implement Data Caching**
   - Add `revalidate` to server-side fetches
   - Consider `unstable_cache` for expensive queries

2. **Consider React.memo**
   - `LibraryCard` could benefit from memoization when lists are large

3. **Consider Virtual Scrolling**
   - If career/major lists grow large (800+ items per bucket), implement virtualization

---

## Architecture Assessment

### Folder Structure: GOOD

```
src/
  app/           # Next.js App Router pages
  components/    # React components (organized by feature)
  context/       # React Context providers
  lib/           # Utilities and Supabase client
```

### Component Organization: GOOD

- Clear separation between site-level, feature-level, and UI components
- Profile sections properly extracted
- Provider pattern correctly implemented

### Recommendations:

1. Add `/src/types/` directory for shared TypeScript types
2. Consider `/src/hooks/` for custom hooks (currently inline)
3. Add `/src/constants/` for BUCKETS and other shared constants

---

## Technical Debt Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical Bugs | 5 | High |
| Type Safety | 34+ | Medium |
| Code Duplication | 3 areas | Medium |
| Missing Infrastructure | 4 | High |
| Minor Issues | 5 | Low |

---

## Action Items (Priority Order)

### Immediate (Before Next Feature)

1. Fix or remove blog pages
2. Create error.tsx and not-found.tsx
3. Add layout metadata for SEO
4. Fix EducationSection render violation

### This Sprint

5. Generate Supabase types and eliminate `any`
6. Add loading.tsx skeletons
7. Validate environment variables at startup

### Technical Debt Backlog

8. Consolidate duplicate components
9. Clean up unused mock data
10. Implement FloatingRobot or remove it
11. Add salary data to careers table
12. Improve accessibility (ARIA labels)

---

## Conclusion

Career Studio has a solid foundation with modern tooling and good patterns. The **critical issues are fixable within 1-2 days** of focused work. The codebase is suitable for continued development once these issues are addressed.

**Recommendation:** Proceed with development after fixing critical issues. Allocate 1 sprint (2 weeks) to address medium-priority technical debt in parallel with feature work.

---

*Report generated: January 22, 2026*
