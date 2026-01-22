# Career Studio - Sprint Backlog

**Sprint:** Foundation Sprint + Content Strategy (Current)
**Sprint Goal:** Fix critical issues, establish technical foundation, and categorize content for MENA relevance
**Duration:** 1 week

---

## Sprint Summary

### Inputs Completed
| Deliverable | Status | Key Insight |
|-------------|--------|-------------|
| Competitive Analysis | ✅ DONE | Market gap validated - no bilingual career exploration platform for MENA students |
| Technical QA Report | ✅ DONE | 5 critical issues, 34+ type violations, but architecture is SOLID |
| User Research Synthesis | ✅ DONE | 5 assumptions validated, 6 personas defined |
| Product Strategy | ✅ DONE | B2B schools primary, B2C parents secondary |
| Pricing Strategy | ✅ DONE | $5/month B2C, $12/student B2B |
| Business Case | ✅ DONE | $254K Year 1 revenue target |
| MENA Data Sources | ✅ DONE | ESCO Arabic identified as best source |
| Content Strategy | ✅ DONE | Hybrid approach: filter O*NET + integrate ESCO |
| MENA Categorization | ✅ DONE | Framework for 761 careers |

### Strategic Decisions
1. **Technical:** Proceed with development - foundation is solid
2. **Content:** Hybrid approach - filter O*NET now, ESCO integration post-launch

---

## Team Assignments

### UI/UX Agent (Frontend)
**Focus:** Critical UX issues and missing infrastructure

| Priority | Task | Files | Acceptance Criteria |
|----------|------|-------|---------------------|
| P0 | Create error boundary | `/src/app/error.tsx` | Graceful error display with retry button |
| P0 | Create 404 page | `/src/app/not-found.tsx` | Branded 404 with navigation back home |
| P0 | Add SEO metadata | `/src/app/layout.tsx` | Title, description, OG tags, viewport |
| P1 | Add loading skeletons | `/src/app/careers/loading.tsx`, `/src/app/majors/loading.tsx` | Skeleton UI during data fetch |
| P1 | Fix FloatingRobot | `/src/components/site/FloatingRobot.tsx` | Either implement chat or hide component |
| P2 | Remove broken blog | `/src/app/blog/` | Delete until ready to implement |

### Database Engineer (Backend)
**Focus:** Data infrastructure and type safety

| Priority | Task | Files | Acceptance Criteria |
|----------|------|-------|---------------------|
| P0 | Generate Supabase types | `/src/types/supabase.ts` | Auto-generated types from schema |
| P0 | Validate env variables | `/src/lib/supabase/client.ts` | Throw clear error if missing |
| P1 | Create server Supabase client | `/src/lib/supabase/server.ts` | Server-side client for SSR |
| P1 | Configure Supabase project | `.env.local` | Working connection to database |
| P1 | Run data import | `scripts/import-data.js` | 761 careers, 519 majors in database |
| P2 | Add salary data to schema | `schema.sql` | salary_min, salary_max fields |

### Code Quality (Either Team)
**Focus:** Technical debt reduction

| Priority | Task | Files | Acceptance Criteria |
|----------|------|-------|---------------------|
| P0 | Fix React render violation | `/src/components/profile/sections/EducationSection.tsx` | Use useMemo for offset calculations |
| P1 | Replace `any` types | All page/component files | Use generated Supabase types |
| P2 | Consolidate Pill component | `/src/components/ui/Pill.tsx` | Single reusable component |
| P2 | Consolidate Library components | `/src/components/library/LibraryClient.tsx` | Generic component for careers/majors |

---

## Definition of Done

A task is DONE when:
1. Code compiles with no TypeScript errors
2. `npm run lint` passes
3. Feature works in both English and Arabic
4. Feature works in both light and dark mode
5. No console errors in browser

---

## Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TASK DEPENDENCIES                                  │
└─────────────────────────────────────────────────────────────────────────────┘

[Configure Supabase] ──► [Generate Types] ──► [Replace `any` types]
         │
         ▼
   [Run Data Import] ──► [Test Career/Major pages with real data]

[Create error.tsx] ──┬──► [Remove broken blog safely]
[Create not-found.tsx]─┘

[Fix EducationSection] ──► [No dependencies]
[Add SEO metadata] ──► [No dependencies]
[Add loading skeletons] ──► [No dependencies]
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase credentials not available | Medium | High | User must provide; document clearly in SETUP.md |
| Data import fails | Low | Medium | Script has error handling; can run incrementally |
| Type generation issues | Low | Low | Manual types as fallback |

---

## Sprint Metrics

**Planned:**
- Critical issues: 5
- P0 tasks: 8
- P1 tasks: 6
- P2 tasks: 4

**Completion Criteria:**
- All P0 tasks complete
- App runs without console errors
- Careers and Majors pages work with real data

---

## Notes for Development Teams

### For UI/UX Agent
- Follow existing component patterns (see `/src/components/profile/` for reference)
- Maintain bilingual support - all user-facing text needs `en`/`ar` variants
- Use existing Tailwind classes - don't introduce new CSS
- Test in both LTR (English) and RTL (Arabic) modes

### For Database Engineer
- The import script already exists at `scripts/import-data.js`
- Source data is in Dori folder - paths are hardcoded in script
- Schema is in `schema.sql` - tables should already exist
- Use service role key for imports, anon key for client

### For Both Teams
- Commit frequently with clear messages
- If blocked, document in this file and move to next task
- Quality > speed - we're building foundation, not racing

---

## Content Strategy Phase (NEW)

### Database Team
| Priority | Task | Files | Acceptance Criteria |
|----------|------|-------|---------------------|
| P0 | Add `mena_relevance` column | `schema.sql` | Column with check constraint |
| P0 | Categorize 761 careers | Database | Using framework in `MENA_CATEGORIZATION.md` |
| P1 | Download ESCO Arabic CSV | `/data/esco/` | Arabic language, classification data |
| P1 | Create career-to-ESCO mapping | Spreadsheet | For future enrichment |

### UI/UX Team
| Priority | Task | Files | Acceptance Criteria |
|----------|------|-------|---------------------|
| P1 | Add filter for `mena_relevance` | Library pages | Only show `universal` and `adapted` |
| P2 | Add "MENA Context" badge | Career profiles | Visual indicator for adapted careers |

---

## After This Sprint

### Completed ✅
1. ~~Pricing Strategy~~ → `PRICING_STRATEGY.md`
2. ~~Business Case~~ → `BUSINESS_CASE.md`
3. ~~Content Strategy~~ → `CONTENT_STRATEGY.md`

### Next Priorities
1. **ESCO Integration** - Post-launch enrichment with Arabic data
2. **Value Propositions** - Clear messaging per segment
3. **Feature Development** - Assessment integration, parent dashboard
4. **Production Deployment** - Vercel deployment, domain setup

---

*Last Updated: January 22, 2026*
*Owner: CTO/Product Manager*

---

*Last Updated: January 22, 2026*
*Owner: CTO/Product Manager*
