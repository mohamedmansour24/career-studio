# Career Studio - Business Case

**Date:** January 2026
**Owner:** CTO/Product Manager
**Version:** 1.0

---

## Executive Summary

Career Studio is a bilingual (English/Arabic) career exploration platform targeting students in Saudi Arabia and UAE. This business case justifies continued investment based on validated market opportunity, competitive positioning, and achievable financial projections.

**Investment Ask:** Continued development resources for 12 months
**Expected Return:** $300K ARR by end of Year 1, path to $1M ARR by Year 2
**Key Risks:** User acquisition cost, school sales cycle, content quality

---

## 1. Problem Statement

### The Problem

Students in MENA lack adequate career guidance:
- Career decisions made at age 15 with minimal information
- School counselors overloaded (7-8 sessions at peak times)
- No dedicated bilingual career exploration platform exists
- Government tools serve only nationals, not international school students

### Evidence (Validated)

| Assumption | Status | Evidence |
|------------|--------|----------|
| Students lack guidance | VALIDATED | Counselor interviews confirm career guidance is secondary to crisis management |
| Counselors need tools | VALIDATED | Using PowerPoint, WhatsApp, YouTube - no dedicated platform |
| Parents anxious | VALIDATED | "Is my daughter in trouble? No? Then I'm not coming" - avoidance until crisis |
| Decisions made too late | VALIDATED | "Choice driven by circumstance at age 15" - user story |

### Market Impact

- Youth unemployment in Saudi Arabia: 29% (ages 15-24)
- University dropout rates linked to major-career mismatch
- Vision 2030 emphasizes skills development and employment

---

## 2. Market Opportunity

### Total Addressable Market (TAM)

| Segment | Population | Source |
|---------|------------|--------|
| K-12 students in Saudi Arabia | 6.2M | Ministry of Education |
| K-12 students in UAE | 1.1M | KHDA/ADEK |
| University students (both) | 1.5M | Estimated |
| **Total TAM** | **8.8M students** | |

### Serviceable Addressable Market (SAM)

| Segment | Population | Rationale |
|---------|------------|-----------|
| Private school students (Saudi) | 620K | 10% of K-12 |
| Private school students (UAE) | 770K | 70% of K-12 |
| International curriculum students | 400K | English-medium schools |
| **Total SAM** | **~800K students** | |

### Serviceable Obtainable Market (SOM) - Year 1

| Segment | Target | Revenue Potential |
|---------|--------|-------------------|
| B2C Premium users | 3,000 | $150K |
| B2B School students | 5,000 | $50K |
| **Year 1 SOM** | **8,000 paying users** | **$200K ARR** |

---

## 3. Competitive Advantage

### Market Gap

From competitive analysis of 15+ platforms:

| Category | Competition Level | Opportunity |
|----------|------------------|-------------|
| Job boards | High | Different focus (placement vs exploration) |
| Government career portals | Medium | Nationals only, basic UX |
| EdTech (learning) | Medium | Adjacent, not competing |
| **Career exploration** | **Very Low** | **Primary opportunity** |

### Differentiation

| Factor | Career Studio | Alternatives |
|--------|---------------|--------------|
| Bilingual (AR/EN) | Native design | Add-on or none |
| Student-focused | Primary | Secondary |
| MENA career content | Local + O*NET depth | US-centric or shallow |
| Assessment integration | Planned (RIASEC+) | Limited Arabic tools |
| B2B for schools | Primary channel | Not served |

### Competitive Moat

1. **Content depth** - 761 careers, 519 majors with local context
2. **Bilingual quality** - Not translated, designed bilingual
3. **First mover** - No direct competitor in MENA career exploration
4. **School relationships** - B2B creates switching costs

---

## 4. Solution

### Product Overview

A web platform enabling students to:
- Explore 700+ careers with detailed profiles
- Browse 500+ university majors
- Take interest/personality assessments
- Plan career-major-education pathways
- Compare careers and make informed decisions

### Key Features (MVP → Full)

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Career/major browsing, basic search, bilingual | Feb 2026 |
| **V1** | Assessments, user accounts, saves | Apr 2026 |
| **V2** | B2B dashboard, school tools | Aug 2026 |
| **V3** | AI advisor, parent dashboard | Nov 2026 |

### Technology Stack

- Next.js 16 (React 19)
- Supabase (PostgreSQL)
- Vercel (hosting)
- Stripe (payments)

**Rationale:** Modern, scalable, cost-effective. No vendor lock-in.

---

## 5. Business Model

### Revenue Streams

| Stream | Model | Price Point | % of Revenue (Y1) |
|--------|-------|-------------|-------------------|
| B2C Premium | Subscription | $49/year | 60% |
| B2B Schools | Per-student license | $12/student/year | 40% |

### Unit Economics

**B2C:**
| Metric | Value | Notes |
|--------|-------|-------|
| ARPU | $49/year | Annual subscription |
| Gross Margin | 85% | Hosting + payment fees |
| CAC | $10 (target) | Content marketing focus |
| LTV | $100 | 2-year average retention |
| LTV:CAC | 10:1 | Healthy ratio |

**B2B:**
| Metric | Value | Notes |
|--------|-------|-------|
| ACV | $3,000 | 250 students × $12 |
| Gross Margin | 80% | Support costs higher |
| CAC | $500 (target) | Direct sales |
| LTV | $7,500 | 2.5-year average contract |
| LTV:CAC | 15:1 | Strong B2B economics |

---

## 6. Financial Projections

### Year 1 (2026)

| Quarter | Users | B2C Revenue | B2B Revenue | Total Revenue | Costs | Net |
|---------|-------|-------------|-------------|---------------|-------|-----|
| Q1 | 5,000 | $2K | $0 | $2K | $10K | -$8K |
| Q2 | 20,000 | $15K | $7K | $22K | $25K | -$3K |
| Q3 | 50,000 | $50K | $30K | $80K | $40K | $40K |
| Q4 | 100,000 | $80K | $70K | $150K | $50K | $100K |
| **Year 1** | | **$147K** | **$107K** | **$254K** | **$125K** | **$129K** |

### Year 2 (2027) - Projection

| Metric | Target | Growth |
|--------|--------|--------|
| Registered users | 300,000 | 3x |
| B2C subscribers | 10,000 | 3.3x |
| B2B school students | 25,000 | 5x |
| Total ARR | $800K | 3.1x |

### Year 3 (2028) - Projection

| Metric | Target | Growth |
|--------|--------|--------|
| Registered users | 700,000 | 2.3x |
| B2C subscribers | 25,000 | 2.5x |
| B2B school students | 75,000 | 3x |
| Total ARR | $2M | 2.5x |

---

## 7. Go-to-Market Strategy

### Phase 1: Launch & Traction (Q1 2026)

| Channel | Tactic | Target |
|---------|--------|--------|
| SEO | Career content ranking | 1,000 organic users/month |
| Social | TikTok/Instagram for students | 5,000 followers |
| Referral | User invite program | 500 referrals |

### Phase 2: Growth (Q2-Q3 2026)

| Channel | Tactic | Target |
|---------|--------|--------|
| Content | Blog, videos, guides | 10,000 organic users/month |
| Partnerships | University career centers | 5 partnerships |
| B2B Sales | School pilot program | 10 pilot schools |

### Phase 3: Scale (Q4 2026+)

| Channel | Tactic | Target |
|---------|--------|--------|
| Paid acquisition | Google Ads, Meta | $5 CAC |
| B2B Sales | Full sales motion | 50 paying schools |
| Expansion | Saudi Arabia launch | 50% of new users |

---

## 8. Investment Requirements

### Costs by Category

| Category | Monthly | Annual | Notes |
|----------|---------|--------|-------|
| Infrastructure | $300 | $3,600 | Supabase, Vercel, etc. |
| Tools & Software | $200 | $2,400 | Analytics, email, etc. |
| Marketing | $1,500 | $18,000 | Content, ads, events |
| Content | $2,000 | $24,000 | Arabic translation, videos |
| **Total** | **$4,000** | **$48,000** | |

### Resource Requirements

| Role | Current | Q2 | Q4 | Notes |
|------|---------|----|----|-------|
| PM/CTO | 1 | 1 | 1 | Existing |
| Development | AI agents | AI agents | AI agents | No headcount |
| Content | 0 | 0.5 | 1 | Freelance → FT |
| Marketing | 0 | 0.5 | 1 | Freelance → FT |
| Sales (B2B) | 0 | 0 | 1 | Hire for scale |

---

## 9. Risk Assessment

### High-Impact Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user adoption | Medium | High | Strong SEO, content quality |
| Schools won't pay | Medium | High | Prove B2C value first, pilot program |
| Content quality issues | Medium | Medium | Review process, user feedback |
| Competitor entry | Low | High | Move fast, build brand/relationships |

### External Dependencies

| Dependency | Risk Level | Contingency |
|------------|------------|-------------|
| Supabase reliability | Low | Standard SLA, backup procedures |
| Stripe availability | Low | Alternative processors available |
| School budget cycles | Medium | Align sales with academic year |
| Economic conditions | Medium | B2C focus if B2B softens |

---

## 10. Success Metrics

### Key Performance Indicators

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Registered users | 5,000 | 20,000 | 50,000 | 100,000 |
| Monthly Active Users | 1,500 | 8,000 | 20,000 | 40,000 |
| B2C Paying | 50 | 600 | 1,500 | 3,000 |
| B2B Schools | 0 | 5 | 10 | 50 |
| MRR | $250 | $4,250 | $10,000 | $27,500 |
| NPS | - | >30 | >40 | >50 |

### Milestones

| Date | Milestone | Validation |
|------|-----------|------------|
| Feb 2026 | MVP Launch | Product works, users engage |
| Apr 2026 | 10K users | Organic growth validated |
| Jun 2026 | First $5K MRR | Revenue model validated |
| Aug 2026 | First paying school | B2B model validated |
| Dec 2026 | $27K MRR | Scale trajectory proven |

---

## 11. Recommendation

### Decision: Proceed with Development

**Rationale:**
1. Market gap validated - no direct competitor
2. Problem validated - user research confirms need
3. Technical foundation solid - codebase audit passed
4. Financial projections achievable - conservative assumptions
5. Risk manageable - clear mitigations identified

### Investment Request

| Item | Amount | Purpose |
|------|--------|---------|
| Infrastructure (12 months) | $3,600 | Hosting, database |
| Marketing (12 months) | $18,000 | Growth, content |
| Content development | $24,000 | Translation, videos |
| Contingency (20%) | $9,000 | Buffer |
| **Total Year 1** | **$55,000** | |

### Expected Return

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Investment | $55K | $100K | $150K |
| Revenue | $254K | $800K | $2M |
| Net Income | $129K | $500K | $1.2M |
| ROI | 234% | 500% | 800% |

---

## Appendix A: Competitive Analysis Reference

See: `Product/Strategy/COMPETITIVE_ANALYSIS.md`

## Appendix B: Pricing Strategy Reference

See: `Product/Strategy/PRICING_STRATEGY.md`

## Appendix C: User Research Reference

See: `Product/Research/COUNSELOR_INTERVIEW_SYNTHESIS.md`
See: `Product/Research/USER_PERSONAS.md`

---

*This business case is based on current assumptions and will be updated as market validation progresses.*
