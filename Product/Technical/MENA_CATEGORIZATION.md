# Career MENA Relevance Categorization

**Date:** January 22, 2026
**Purpose:** Categorize 761 O*NET careers for MENA market relevance

---

## Categorization Framework

### Categories

| Category | Code | Definition | Action |
|----------|------|------------|--------|
| **Universal** | `universal` | Career exists globally with same job function | Keep as-is |
| **Adapted** | `adapted` | Career exists but context differs (regulations, titles, industries) | Keep, add MENA notes |
| **US-Only** | `us_only` | Career doesn't exist or isn't licensed in MENA | Hide from catalog |
| **Pending** | `pending` | Requires expert review | Queue for review |

---

## Automatic Categorization Rules

### Rule 1: US-Only Indicators (→ `us_only`)
Careers containing these keywords or matching these patterns:

**US-Specific Licensing:**
- Physician Assistants (not licensed in most MENA)
- Nurse Practitioners (limited in MENA)
- Chiropractors (not regulated in most MENA)
- Licensed Professional Counselors (US certification)

**US-Specific Roles:**
- State/Federal government roles
- Medicare/Medicaid specific
- IRS/Tax-specific (US tax system)
- Social Security Administration

**US Industry Patterns:**
- `typical_industries` containing "Federal", "State government"
- Alternative titles referencing US certifications (CPA, LCSW)

### Rule 2: Universal Indicators (→ `universal`)
Careers matching these patterns:

**Global Professions:**
- Engineers (all types)
- Doctors/Physicians (general)
- Nurses (general)
- Teachers (all levels)
- Accountants (general)
- Software Developers
- Architects
- Scientists (all types)
- Pilots
- Chefs/Cooks

**STEM Occupations:**
- Any career with "Engineer", "Scientist", "Researcher", "Developer"

**Service Occupations:**
- Hospitality roles
- Retail roles
- Administrative roles

### Rule 3: Adapted Indicators (→ `adapted`)
Careers needing context modification:

**Legal/Regulatory:**
- Lawyers (need MENA legal context)
- Judges (different court systems)
- Police (different structures)

**Healthcare (Licensed):**
- Pharmacists (different regulations)
- Dentists (different licensing)

**Finance:**
- Financial Advisors (Islamic banking context)
- Insurance roles (Takaful context)

---

## Sample Categorization (First 50)

| ID | Career | Category | Reasoning |
|----|--------|----------|-----------|
| 1 | Accountants and Auditors | `universal` | Global profession |
| 2 | Actors | `universal` | Entertainment exists globally |
| 3 | Actuaries | `universal` | Insurance industry global |
| 4 | Acupuncturists | `adapted` | Less common in MENA |
| 5 | Acute Care Nurses | `universal` | Healthcare global |
| 6 | Adapted Physical Education Specialists | `adapted` | Different system |
| 7 | Adhesive Bonding Machine Operators | `universal` | Manufacturing global |
| 8 | Administrative Services Managers | `universal` | Business global |
| 9 | Adult Basic Education Instructors | `adapted` | Different education systems |
| 10 | Advertising and Promotions Managers | `universal` | Marketing global |
| 11 | Advertising Sales Agents | `universal` | Sales global |
| 12 | Aerospace Engineers | `universal` | STEM global |
| 13 | Agents and Business Managers (Artists) | `universal` | Entertainment global |
| 14 | Agricultural Engineers | `universal` | Agriculture exists |
| 15 | Agricultural Equipment Operators | `universal` | Agriculture exists |
| 16 | Agricultural Inspectors | `adapted` | Different government |
| 17 | Agricultural Sciences Teachers | `universal` | Education global |
| 18 | Agricultural Technicians | `universal` | Agriculture exists |
| 19 | Air Traffic Controllers | `universal` | Aviation global |
| 20 | Aircraft Cargo Handling Supervisors | `universal` | Logistics global |

---

## Implementation SQL

```sql
-- Add MENA relevance column
ALTER TABLE careers 
ADD COLUMN IF NOT EXISTS mena_relevance TEXT 
DEFAULT 'pending'
CHECK (mena_relevance IN ('universal', 'adapted', 'us_only', 'pending'));

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_careers_mena_relevance 
ON careers(mena_relevance);

-- Update query to only show MENA-relevant careers
-- WHERE mena_relevance IN ('universal', 'adapted')
```

---

## Bulk Categorization Strategy

### Phase 1: Automatic (Day 1)
Apply rule-based categorization using keywords and patterns.

**Estimated Distribution:**
- `universal`: ~400 careers (52%)
- `adapted`: ~200 careers (26%)
- `us_only`: ~100 careers (13%)
- `pending`: ~61 careers (8%)

### Phase 2: Manual Review (Day 2-3)
Expert review of `pending` careers.

### Phase 3: Contextual Updates (Week 2)
Add MENA-specific notes to `adapted` careers.

---

## ESCO Integration Plan

After launch, enrich with ESCO Arabic data:

1. **Match by occupation title** (fuzzy matching)
2. **Import Arabic translations** for all matched careers
3. **Import skills data** for matched careers
4. **Add new MENA-specific careers** from ESCO not in O*NET

---

## Priority Careers for Launch

Focus on careers most searched by MENA students:

1. Medical (Doctor, Nurse, Dentist, Pharmacist)
2. Engineering (Civil, Mechanical, Electrical, Software)
3. Business (Marketing, Finance, Management)
4. Technology (Software, Data, Cybersecurity)
5. Education (Teacher, Professor)
6. Creative (Architect, Designer, Artist)
7. Legal (Lawyer - adapted for MENA)
8. Healthcare (various)
9. Government (adapted for MENA context)
10. Hospitality (Hotel, Tourism, Events)
