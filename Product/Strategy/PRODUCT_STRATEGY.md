# Career Studio - Product Strategy

**Version**: 0.1 (Draft)
**Date**: January 2026
**Status**: Preliminary - Research gaps marked [RESEARCH NEEDED]

---

## 1. Executive Summary

Career Studio is a bilingual (English/Arabic) career exploration platform targeting students in the MENA region, primarily Saudi Arabia and UAE. The platform helps students and parents make informed career and education decisions through comprehensive career profiles, major information, and personality-based assessments.

**Key Differentiators**:
- Bilingual EN/AR content designed for MENA
- 761 careers + 519 majors with deep content
- Holland's RIASEC interest model localized for Arab culture
- Career-major linking for education pathway planning
- Assessment suite (personality, interests, work values)

---

## 2. Market Context

### 2.1 Market Drivers

Based on initial research:

| Driver | Impact | Confidence |
|--------|--------|------------|
| **Saudi Vision 2030** | Education reform, workforce nationalization (Saudization) driving career guidance need | High |
| **Youth Population** | 60%+ of MENA population under 30, high career decision volume | High |
| **EdTech Adoption** | Post-COVID acceleration, MENA EdTech growing rapidly | High |
| **Skills Gap** | Mismatch between graduate skills and job market needs | Medium |
| **Parental Involvement** | Arab culture = high family influence on career decisions | High |

### 2.2 Market Size [RESEARCH NEEDED]

**Preliminary Estimates** (to be validated):

| Metric | Saudi Arabia | UAE | Combined |
|--------|--------------|-----|----------|
| High School Students | ~1.5M | ~300K | ~1.8M |
| Private School Students | ~500K | ~200K | ~700K |
| Annual University Admissions | ~350K | ~50K | ~400K |

**TAM Calculation** [TO BE VALIDATED]:
- Total addressable students (age 15-22): ~5M in Saudi + UAE
- At $10/student/year: $50M TAM

**SAM Calculation**:
- Private/international school segment: ~700K students
- At $20/student/year (premium): $14M SAM

### 2.3 Competitive Landscape

**Based on initial web research**:

| Competitor Type | Players | Bilingual? | Career Content Depth |
|-----------------|---------|------------|---------------------|
| **MENA Job Boards** | Bayt.com, Naukrigulf | Partial | Job listings, not career exploration |
| **Global Platforms** | LinkedIn, Indeed | English-only | Professional-focused, not students |
| **EdTech (MENA)** | Noon Academy, Almentor | Arabic | Academic focus, not career guidance |
| **Govt Portals** | Saudi HRDF, UAE careers | Bilingual | Government jobs, limited exploration |
| **Assessment Tools** | Various | Mostly English | Not localized for MENA |

**Gap Identified**: No comprehensive bilingual career exploration platform designed specifically for MENA students with:
- Deep career content (not just job listings)
- Major/education pathway linking
- Localized assessments
- Arabic-first design

---

## 3. Target Customers

### 3.1 Primary Segments

Based on Dori customer segment analysis:

#### Segment A: Private School Students (B2B2C)
- **Profile**: Students in private/international schools in UAE/Saudi
- **Age**: 15-18 (Grades 10-12)
- **Pain Point**: Choosing university major without understanding career outcomes
- **Decision Maker**: School administration (budget), counselors (evaluation), parents (influence)
- **Willingness to Pay**: School pays; parents expect value

#### Segment B: Parents of High Schoolers (B2C)
- **Profile**: Middle-to-upper class parents, often expats or educated locals
- **Pain Point**: Anxiety about child's future, want informed career guidance
- **Behavior**: Actively seek resources, willing to pay for child's success
- **Willingness to Pay**: $50-200/year for comprehensive guidance

#### Segment C: University-Bound Students (B2C)
- **Profile**: 17-19 year olds making major/university decisions
- **Pain Point**: Major selection is overwhelming, unclear career outcomes
- **Behavior**: Self-research, peer influence, family input
- **Willingness to Pay**: Lower; freemium conversion opportunity

### 3.2 Secondary Segments

| Segment | Use Case | Priority |
|---------|----------|----------|
| Fresh Graduates | Career pivots, job search | P2 |
| Career Counselors | Tool for student guidance | P2 |
| Mid-career Professionals | Career change exploration | P3 |
| NGOs/Government | Workforce development programs | P3 |

### 3.3 Ideal Customer Profile (ICP)

**Primary ICP**: Private international school in UAE/Saudi
- Student population: 500-2000
- Bilingual curriculum (English + Arabic)
- Has career counseling program
- Budget for EdTech tools
- Decision maker: Principal or Head of Student Services

---

## 4. Product Vision

### 4.1 Vision Statement

> **"Empower every Arab student to discover their path with confidence."**

Career Studio will be the trusted platform where students in the Arab world explore careers, understand education pathways, and make informed decisions about their future - in their language, with their cultural context.

### 4.2 Mission

Help 1 million MENA students make better career decisions by 2030.

### 4.3 Strategic Pillars

1. **Content Depth**: Comprehensive, accurate, bilingual career and major information
2. **Personalization**: Assessment-driven recommendations based on personality and interests
3. **Accessibility**: Arabic-first design, mobile-friendly, affordable pricing
4. **Trust**: Data-backed insights, transparent methodology, no bias

---

## 5. Product Offering

### 5.1 Core Features (MVP)

Based on existing codebase and content:

| Feature | Description | Content Available |
|---------|-------------|-------------------|
| **Career Library** | Browse 761 careers by interest category | Yes - ready |
| **Career Profiles** | Detailed career pages with tasks, skills, education, work dimensions | Yes - ready |
| **Major Library** | Browse 519 majors by interest category | Yes - ready |
| **Major Profiles** | Major details with courses, career links | Yes - ready |
| **Interest Filter** | Holland's RIASEC model filtering | Yes - implemented |
| **Bilingual Toggle** | EN/AR language switch with RTL | Yes - implemented |
| **Career-Major Links** | See which majors lead to which careers | Yes - data exists |

### 5.2 Differentiating Features (Post-MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| **Interest Assessment** | Quiz to identify Holland code | Framework exists |
| **Personality Assessment** | Big Five traits mapping | Framework exists |
| **Work Values Assessment** | Values-career matching | Framework exists |
| **Career Comparison** | Side-by-side career comparison | UI mockups exist |
| **Saved Careers** | Bookmarking and tracking | Not built |
| **Career Matches** | AI-powered recommendations | Not built |

### 5.3 Content Assets

| Asset | Quantity | Languages | Quality |
|-------|----------|-----------|---------|
| Careers | 761 | EN (100%), AR (~80%) | High |
| Majors | 519 | EN (100%), AR (~60%) | High |
| Skills | 11 categories | EN, partial AR | Medium |
| Tasks per Career | 5-30 | EN, AR | High |
| Education Stats | Per career | EN | High |
| Work Dimensions | 4 types | EN | High |

---

## 6. Business Model

### 6.1 Revenue Model Options

| Model | Description | Pros | Cons |
|-------|-------------|------|------|
| **B2B SaaS (Schools)** | Annual license per student | Predictable revenue, bulk sales | Longer sales cycle |
| **B2C Subscription** | Monthly/annual family subscription | Direct relationship, faster iteration | Higher CAC, churn risk |
| **Freemium** | Free basic, paid premium features | Acquisition, viral potential | Conversion rates uncertain |
| **B2B2C Hybrid** | Schools pay, students access | Best of both | Complexity |

### 6.2 Recommended Model: B2B2C Hybrid

**Phase 1 (MVP Launch)**:
- Freemium B2C to build user base and validate
- Free: Career/major browsing, basic profiles
- Premium ($5/month): Assessments, saved careers, full profiles

**Phase 2 (Post-Validation)**:
- B2B school licenses ($10-20/student/year)
- School dashboard for counselors
- Bulk discounts for 500+ students

### 6.3 Pricing [RESEARCH NEEDED]

**Preliminary Pricing** (to be validated with WTP research):

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Browse careers/majors, basic profiles |
| **Student** | $5/month | Assessments, full profiles, saved careers |
| **Family** | $10/month | Multi-child, parent dashboard |
| **School** | $15/student/year | Full access, counselor tools, analytics |

---

## 7. Go-to-Market Strategy

### 7.1 Launch Market

**Primary**: UAE (Dubai, Abu Dhabi)
- Higher English proficiency
- Tech-savvy population
- Private school concentration
- Faster sales cycles

**Secondary**: Saudi Arabia (Riyadh, Jeddah)
- Larger market
- Vision 2030 alignment
- Requires more Arabic content
- Longer relationship-building

### 7.2 Launch Phases

**Phase 1: Soft Launch (Month 1-2)**
- Launch freemium B2C product
- Target: 1,000 registered users
- Channels: Social media, school counselor outreach
- Goal: Validate product-market fit

**Phase 2: School Pilots (Month 3-4)**
- Partner with 5-10 private schools for pilot
- Free access in exchange for feedback
- Goal: Validate B2B model, gather testimonials

**Phase 3: Paid Launch (Month 5-6)**
- Enable paid subscriptions
- Convert pilot schools to paid
- Goal: First paying customers, validate pricing

### 7.3 Customer Acquisition Channels

| Channel | Target Segment | Cost | Priority |
|---------|----------------|------|----------|
| School counselor outreach | B2B | Low | P0 |
| Parent Facebook groups | B2C | Low | P0 |
| SEO (Arabic career queries) | B2C | Low | P1 |
| Instagram/TikTok content | Students | Medium | P1 |
| School conferences/events | B2B | Medium | P2 |
| Paid ads (Meta, Google) | B2C | High | P3 |

---

## 8. Success Metrics

### 8.1 North Star Metric

**"Careers Explored per Active User"** - Measures engagement depth

### 8.2 Key Metrics by Phase

**Phase 1 (Soft Launch)**:
| Metric | Target |
|--------|--------|
| Registered users | 1,000 |
| Weekly active users | 300 |
| Careers viewed per user | 5+ |
| Assessment completions | 200 |

**Phase 2 (School Pilots)**:
| Metric | Target |
|--------|--------|
| Pilot schools | 5-10 |
| Students activated | 2,000 |
| Counselor NPS | 40+ |
| Student NPS | 30+ |

**Phase 3 (Paid Launch)**:
| Metric | Target |
|--------|--------|
| Paying users (B2C) | 100 |
| Paying schools (B2B) | 3 |
| Monthly recurring revenue | $5,000 |
| Churn rate | <10% |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low WTP in MENA | Medium | High | Freemium model, school subsidies |
| Content not localized enough | Medium | High | Native Arabic speakers review all content |
| Schools slow to adopt | High | Medium | Start B2C, use as proof for B2B |
| Competition from global players | Low | Medium | Double down on Arabic, MENA context |
| Content maintenance burden | Medium | Medium | Community contributions, AI augmentation |

---

## 10. Research Gaps

The following require additional research before finalizing strategy:

| Gap | Research Method | Priority |
|-----|-----------------|----------|
| Market size validation | Government data, industry reports | P0 |
| Competitive deep-dive | Feature comparison, user interviews | P0 |
| Willingness to pay | Surveys, pricing experiments | P0 |
| User pain points | Interviews (students, parents, counselors) | P1 |
| Content gap analysis | Compare to MENA job market | P1 |
| School budget cycles | School administrator interviews | P2 |

---

## 11. Immediate Next Steps

1. **Complete competitive analysis** - Deep-dive on Bayt, MENA EdTech players
2. **Conduct user interviews** - 10 students, 10 parents, 5 counselors
3. **Validate pricing** - WTP surveys with target segments
4. **Define MVP scope** - Feature prioritization based on this strategy
5. **Create roadmap** - Quarterly milestones for 2026

---

## Appendix: Sources

- Web search: MENA EdTech market trends (HolonIQ 2024 MENA EdTech 50)
- Web search: Saudi Vision 2030 education initiatives
- Dori folder: Customer segment analysis, user stories
- Career Studio codebase: Feature inventory
- Career Profiles 2.xlsx: Content inventory

*Note: Strategy to be refined after completing research gaps*
