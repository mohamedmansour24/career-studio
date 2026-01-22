# Content Strategy Decision Document

**Date:** January 22, 2026
**Author:** CTO/Product Manager
**Status:** DECISION REQUIRED

---

## Situation

Career Studio's current data (761 careers from Dori) is sourced from O*NET - a US-centric classification system. This creates misalignment with our MENA target market.

### Problem Evidence
| Issue | Example | Impact |
|-------|---------|--------|
| US job titles | "Physician Assistants" (not licensed in most MENA) | Confusing |
| US industry data | "Government 8%" references US sectors | Misleading |
| US salary ranges | Implicit USD context | Not relevant |
| Missing MENA careers | No "Falconer", "Pearl Diver", "Iftar Coordinator" | Incomplete |

---

## Research Findings

### Workstream 1: MENA Data Sources

| Source | Records | Accessibility | Format | Arabic | Effort |
|--------|---------|---------------|--------|--------|--------|
| **ESCO Arabic** | 3,039 occupations | ✅ Public | CSV/API | ✅ Native | Low |
| **Qatar QNOC** | 3,717 job titles | ✅ Public | PDF | ✅ | Medium |
| **Saudi SSCO** | 2,013 careers | ✅ Public | Web | ✅ | Medium |
| **ASCO 2008** | 2,993 jobs | ❌ Licensed | Unknown | ✅ | High |

**Key Finding:** ESCO Arabic is the most accessible, comprehensive, and API-enabled source with proper Arabic support.

### Workstream 2: Current Data Analysis

**Current O*NET data (761 careers):**
- All descriptions in English
- US industry percentages
- No MENA market context
- Some careers not applicable to MENA

---

## Strategic Options

### Option A: Curate Current O*NET Data
**Timeline:** 2-3 weeks

| Action | Effort |
|--------|--------|
| Filter ~300 MENA-universally-relevant careers | 1 week |
| Add disclaimers about US-origin | 2 days |
| Hide obviously US-specific careers | 2 days |

**Pros:** Quick, uses existing data
**Cons:** Still "filtered US", not authentic

---

### Option B: Replace with ESCO Arabic
**Timeline:** 4-6 weeks

| Action | Effort |
|--------|--------|
| Download ESCO Arabic dataset | 1 day |
| Map to current schema | 1 week |
| Create import scripts | 1 week |
| Migrate and test | 2 weeks |

**Pros:** Authentic Arabic, EU-backed quality, international not US-specific
**Cons:** Larger effort, new data structure

---

### Option C: Hybrid Approach (RECOMMENDED)
**Timeline:** 3-4 weeks

| Phase | Action | Outcome |
|-------|--------|---------|
| **Week 1** | Filter O*NET to ~300 universal careers | Launch-ready subset |
| **Week 1** | Download ESCO Arabic | Data in hand |
| **Week 2** | Add MENA_RELEVANCE column to schema | Tracking |
| **Week 3-4** | Gradually enrich with ESCO data | Better content |

**Pros:** Ship fast, improve iteratively
**Cons:** Two workstreams in parallel

---

## CTO/PM Recommendation

### Decision: **Option C - Hybrid Approach**

**Reasoning:**

1. **Don't delay launch** - The platform architecture is ready
2. **Don't mislead users** - Filter out obviously US-specific content
3. **Build toward authentic** - ESCO Arabic as the destination
4. **Show momentum** - Ship something users can try

### Implementation Plan

| Week | Deliverable | Owner |
|------|-------------|-------|
| 1 | Filter O*NET careers by MENA relevance | Database Team |
| 1 | Download ESCO Arabic dataset | Research |
| 2 | Add `mena_relevance` field to careers table | Database Team |
| 2 | Create ESCO→Career mapping specification | CTO/PM |
| 3-4 | Begin ESCO integration for enriched careers | Database Team |

### Schema Change Required

```sql
ALTER TABLE careers ADD COLUMN mena_relevance TEXT 
  CHECK (mena_relevance IN ('universal', 'adapted', 'us_only', 'pending'));
```

### Career Categorization Framework

| Category | Definition | Count (Est) | Action |
|----------|------------|-------------|--------|
| **universal** | Exists globally (Doctor, Teacher, Engineer) | ~400 | Keep |
| **adapted** | Exists but different context (Lawyer, Accountant) | ~200 | Edit context |
| **us_only** | Doesn't exist in MENA (Physician Assistant) | ~100 | Hide |
| **pending** | Needs review | ~61 | Triage |

---

## Next Steps

1. **Immediate:** Download ESCO Arabic dataset
2. **This week:** Create career categorization for 761 O*NET careers
3. **Decision gate:** Review categorized list before filtering

---

## Open Questions for User

1. Should we hide `us_only` careers or delete them?
2. What's the minimum viable career count for launch? (300? 400?)
3. Should we add ESCO careers now or post-launch?
