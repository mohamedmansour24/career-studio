# Career Studio - Assumption Map

## Product Context

**Product**: Bilingual (EN/AR) career exploration platform for MENA region
**Assets**: 761 careers, 519 majors, Holland's RIASEC model, assessment framework
**Target Market**: Saudi Arabia, UAE, MENA

---

## Assumption Categories

### A. PROBLEM ASSUMPTIONS

| ID | Assumption | Risk | Confidence | Evidence Needed | Status |
|----|------------|------|------------|-----------------|--------|
| P1 | Students in MENA lack clear career guidance and make uninformed decisions | High | **HIGH** | User interviews, market data | **VALIDATED** - Counselors confirm academic issues dominate; career guidance is secondary |
| P2 | Parents are anxious about their children's career choices and seek guidance | High | **HIGH** | Parent interviews, survey data | **VALIDATED** - User stories + counselor feedback: "Is my daughter in trouble? No? Then I'm not coming" |
| P3 | School counselors lack adequate tools/resources for career guidance | Medium | **HIGH** | Counselor interviews | **VALIDATED** - Using PowerPoint, WhatsApp, YouTube; no dedicated platform |
| P4 | Existing career platforms don't serve Arabic speakers well | High | Medium | Competitive analysis | PENDING - Web research hit rate limits |
| P5 | Career decisions are made too late (university selection time) | Medium | **HIGH** | User research | **VALIDATED** - User story: "choice driven more by circumstance than careful thought" at age 15 |

### B. SOLUTION ASSUMPTIONS

| ID | Assumption | Risk | Confidence | Evidence Needed | Status |
|----|------------|------|------------|-----------------|--------|
| S1 | A bilingual platform with 761 careers provides sufficient coverage | Medium | Medium | User testing, content gap analysis | PENDING |
| S2 | Holland's RIASEC interest model resonates with MENA users | Medium | Low | User testing | PENDING |
| S3 | Career-major linking helps users make better education decisions | Medium | Medium | User feedback | PENDING |
| S4 | Personality/interest assessments are a key differentiator | High | Low | Competitive analysis, user value | PENDING |
| S5 | Visual career profiles (characters, charts) increase engagement | Low | Medium | Analytics | PENDING |
| S6 | **NEW**: Student self-service reduces counselor burden | Medium | **HIGH** | Counselor feedback | **VALIDATED** - Counselors overloaded (7-8 sessions at peak) |
| S7 | **NEW**: Position as "career exploration" not "counseling" to reduce stigma | High | **HIGH** | Counselor interviews | **VALIDATED** - "Some students not convinced of guidance (stigma)" |

### C. MARKET ASSUMPTIONS

| ID | Assumption | Risk | Confidence | Evidence Needed |
|----|------------|------|------------|-----------------|
| M1 | Private schools in UAE/Saudi have budget for career guidance tools | High | Low | School interviews, pricing research |
| M2 | Parents will pay for career guidance subscriptions | High | Low | WTP surveys |
| M3 | Market size is large enough (100K+ potential users) | Medium | Low | TAM/SAM analysis |
| M4 | Saudi Vision 2030 creates favorable regulatory environment | Low | High | Policy research |
| M5 | EdTech adoption in MENA is accelerating post-COVID | Low | High | Market reports |

### D. BUSINESS MODEL ASSUMPTIONS

| ID | Assumption | Risk | Confidence | Evidence Needed |
|----|------------|------|------------|-----------------|
| B1 | B2B (schools) is more viable than B2C (direct to parents/students) | High | Low | Sales experiments |
| B2 | Freemium model can drive adoption before conversion | Medium | Low | Industry benchmarks |
| B3 | Schools will pay $X per student per year | High | Low | Pricing experiments |
| B4 | Customer acquisition cost is sustainable | High | Low | Marketing experiments |
| B5 | Content can be maintained/updated cost-effectively | Medium | Medium | Operational planning |

### E. COMPETITIVE ASSUMPTIONS

| ID | Assumption | Risk | Confidence | Evidence Needed |
|----|------------|------|------------|-----------------|
| C1 | No dominant bilingual career platform exists in MENA | High | Low | Competitive research |
| C2 | Global platforms (LinkedIn, etc.) don't serve this use case | Medium | Medium | Feature comparison |
| C3 | Local competitors lack depth of career/major content | Medium | Low | Content comparison |
| C4 | Assessment integration is a moat | Medium | Low | Competitive analysis |

---

## Risk Prioritization Matrix

```
                    HIGH IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │  P1, P4, S4        │  M1, M2, B1, B3    │
    │  (Validate first)  │  (Critical risks)  │
    │                    │                    │
────┼────────────────────┼────────────────────┼────
    │                    │                    │
    │  S2, S3, P3        │  M3, B4, C1        │
    │  (Monitor)         │  (Research needed) │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW IMPACT
         LOW UNCERTAINTY      HIGH UNCERTAINTY
```

---

## Riskiest Assumptions (Priority Order)

### RA1: Problem-Solution Fit
**Assumption**: Students/parents in MENA struggle with career decisions AND a bilingual career exploration platform addresses this need.
**Test**: User interviews (10 students, 10 parents, 5 counselors)
**Success Criteria**: 7/10 express clear pain point, 6/10 show interest in solution

### RA2: Willingness to Pay
**Assumption**: Schools OR parents will pay for career guidance tools at sustainable price.
**Test**: Pricing surveys, pilot with 3-5 schools
**Success Criteria**: >50% express WTP at $X/student/year OR $Y/family/year

### RA3: Competitive Differentiation
**Assumption**: No adequate bilingual career platform exists in MENA market.
**Test**: Comprehensive competitive analysis
**Success Criteria**: Confirm gap in bilingual, MENA-focused, content-rich solutions

### RA4: Content Sufficiency
**Assumption**: 761 careers + 519 majors provides adequate coverage for target users.
**Test**: Content gap analysis against user needs, coverage of MENA job market
**Success Criteria**: >80% of common career questions answerable

---

## Existing Evidence from Dori (SYNTHESIZED Jan 2026)

### Research Synthesis Completed

| Research | Status | Key Findings | Location |
|----------|--------|--------------|----------|
| **Counselor Interviews** | 3/6 completed | Tools gap, stigma, overload, parent resistance | `Product/Research/COUNSELOR_INTERVIEW_SYNTHESIS.md` |
| **User Stories** | Extracted | Parent anxiety, graduate confusion, mid-career shift | `Product/Research/USER_PERSONAS.md` |
| **Contact Database** | 40 contacts | Saudi, Egypt, Jordan counselors | `Dori/02_BUSINESS_MODEL/.../End users- Master.xlsx` |

### Validated Findings

**From Counselor Interviews:**
1. **Tools Gap**: Counselors use PowerPoint, WhatsApp, YouTube - no dedicated career platform
2. **Stigma Issue**: "Some students not convinced of guidance" - position as exploration, not counseling
3. **Workload**: 7-8 sessions at peak times; need self-service tools
4. **Parent Resistance**: "Is my daughter in trouble? No? Then I'm not coming"
5. **Arabic Content Needed**: Counselors reference Arabic psychology books
6. **Schools with Strong Counseling**: Omareyeh, King's Academy, IB schools, IAA - target market

**From User Stories:**
1. **Uninformed Decisions**: "choice driven more by circumstance than careful thought" at age 15
2. **Parent Anxiety**: Overwhelmed by career options, lack reliable information
3. **Time Pressure**: Trigger = high school ending, university selection approaching
4. **Personalization Desired**: Parents want guidance tailored to their child

### Customer Segments Confirmed
Based on research synthesis:
- **P0 B2B**: School Counselors (end users), School Administrators (decision influencers)
- **P0 B2C**: Parents of high school students (payers)
- **P1 B2C**: Students 14-20 (end users via freemium)
- **P2**: Fresh Graduates, Mid-career Professionals
- **P3**: University Counseling Centers, NGOs

### Content Assets Verified
- 761 careers with: titles, descriptions, tasks, skills, education stats, work dimensions
- 519 majors with: descriptions, typical courses, career links
- 11 skill categories with educational content
- Assessment frameworks (interests, personality, work values)
- UI mockups for all major flows

---

## Research Needed

| Research Type | Method | Priority |
|---------------|--------|----------|
| Competitive Analysis | Web research, feature comparison | P0 |
| Market Sizing | TAM/SAM calculation, govt data | P0 |
| User Interviews | 10 students, 10 parents, 5 counselors | P1 |
| Pricing Research | WTP surveys, school budget research | P1 |
| Content Gap Analysis | Compare careers to MENA job market | P2 |

---

## Next Steps

1. **Run competitive research** - Identify and analyze MENA career platforms
2. **Calculate market size** - TAM/SAM for UAE/Saudi
3. **Validate RA1** - User problem interviews
4. **Validate RA2** - Pricing/WTP research
5. **Create product strategy** - Based on validated assumptions
