# Career Studio - MVP Scope Definition

## MVP Philosophy

**Goal**: Launch the smallest product that validates core assumptions while delivering real value.

**Approach**:
- Leverage existing codebase (Next.js app is 80% built)
- Use existing content (761 careers, 519 majors ready)
- Focus on core browse/explore flow
- Defer assessments to post-MVP

---

## MVP Feature Set

### Tier 1: Must Have (Launch Blockers)

| Feature | Status | Work Needed |
|---------|--------|-------------|
| **Landing Page** | Built | Minor copy updates |
| **Career Library** | Built | Connect to live data |
| **Career Profile Page** | Built | Connect to live data |
| **Major Library** | Built | Connect to live data |
| **Major Profile Page** | Built | Connect to live data |
| **Interest Filter (RIASEC)** | Built | Verify data mapping |
| **Bilingual Toggle (EN/AR)** | Built | Verify all content |
| **Mobile Responsive** | Built | QA testing |
| **Basic SEO** | Partial | Meta tags, sitemap |

### Tier 2: Should Have (Week 1 Post-Launch)

| Feature | Status | Work Needed |
|---------|--------|-------------|
| **Search** | Not built | Implement search bar |
| **Career Comparison** | Mockups exist | Build UI + logic |
| **Save/Bookmark Careers** | Not built | Requires auth |
| **User Authentication** | Not built | Supabase auth setup |
| **Basic Analytics** | Not built | Add tracking |

### Tier 3: Nice to Have (Month 1 Post-Launch)

| Feature | Status | Work Needed |
|---------|--------|-------------|
| **Interest Assessment** | Framework exists | Build quiz UI |
| **User Profile/Dashboard** | Not built | Design + build |
| **Email Capture/Newsletter** | UI exists | Backend integration |
| **Share Career** | Not built | Social sharing |

### Tier 4: Defer (Post-Validation)

| Feature | Reason to Defer |
|---------|-----------------|
| Personality Assessment | Complex, validate interest first |
| Work Values Assessment | Complex, validate interest first |
| AI Recommendations | Requires user data, expensive |
| School Admin Dashboard | B2B feature, after B2C validation |
| Blog | Content marketing, not core value |
| Chat/Support | Operational overhead |

---

## Technical Requirements for MVP

### Database
- [ ] Populate Supabase with 761 careers from Career Profiles 2.xlsx
- [ ] Populate Supabase with 519 majors from Majors.xlsx
- [ ] Verify all relationship tables (career_skills, career_majors, etc.)
- [ ] Seed interest_categories with RIASEC data
- [ ] Seed work_dimensions with dimension data

### Frontend
- [ ] Verify all pages render correctly with live data
- [ ] Test bilingual toggle on all pages
- [ ] Mobile responsiveness QA
- [ ] Performance optimization (images, lazy loading)
- [ ] Error handling for missing data

### Infrastructure
- [ ] Production Supabase instance
- [ ] Vercel deployment configured
- [ ] Domain setup (careerstudio.com or similar)
- [ ] SSL certificate
- [ ] Basic monitoring (uptime, errors)

### Content
- [ ] Review 50 random careers for quality
- [ ] Verify Arabic translations on 20 careers
- [ ] Update landing page copy
- [ ] Create 404 and error pages

---

## MVP Launch Checklist

### Pre-Launch (Week -1)
- [ ] All Tier 1 features working
- [ ] Data import complete and verified
- [ ] QA complete on major user flows
- [ ] Performance acceptable (<3s page load)
- [ ] Analytics installed
- [ ] Error tracking installed

### Launch Day
- [ ] DNS propagated
- [ ] SSL working
- [ ] Smoke test all pages
- [ ] Monitor for errors
- [ ] Announce on social media

### Post-Launch (Week 1)
- [ ] Monitor user behavior
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Begin Tier 2 features

---

## User Flows for MVP

### Flow 1: Career Exploration
```
Landing Page → Career Library → Filter by Interest →
Career Card → Career Profile → View Tasks/Skills/Education
```

### Flow 2: Major Exploration
```
Landing Page → Major Library → Filter by Interest →
Major Card → Major Profile → View Courses → Linked Careers
```

### Flow 3: Career-Major Connection
```
Career Profile → Education Section → Linked Majors →
Major Profile → Related Careers
```

---

## Content Scope for MVP

### Careers (761 total)
- All careers imported to database
- Minimum fields required:
  - title_en (required)
  - title_ar (preferred)
  - intro_en (required)
  - description_en (required)
  - tasks (at least 3)
  - skills (at least 3)
  - job_zone (education level)

### Majors (519 total)
- All majors imported to database
- Minimum fields required:
  - title_en (required)
  - title_ar (preferred)
  - intro_en (required)
  - description_en (required)

### Interest Categories (6 total)
- Realistic
- Investigative
- Artistic
- Social
- Enterprising
- Conventional

---

## Success Metrics for MVP

### Week 1 Targets
| Metric | Target |
|--------|--------|
| Unique visitors | 500 |
| Pages per session | 3+ |
| Bounce rate | <60% |
| Careers viewed | 1,000 |

### Month 1 Targets
| Metric | Target |
|--------|--------|
| Registered users | 1,000 |
| Returning visitors | 30% |
| Careers viewed | 10,000 |
| Feedback submissions | 50 |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Data import errors | Thorough validation scripts |
| Arabic content gaps | Prioritize EN, add AR incrementally |
| Performance issues | Optimize images, add caching |
| Low traffic | Prepare content marketing plan |

---

## Timeline Estimate

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Data Import | 2-3 days | Populated database |
| QA & Bug Fixes | 2-3 days | Stable application |
| Content Review | 2-3 days | Verified content quality |
| Launch Prep | 1-2 days | Production deployment |
| **Total** | **1-2 weeks** | **MVP Launch** |

---

## Out of Scope (Explicit Exclusions)

- User authentication (MVP is public browse-only)
- Payment processing
- Admin dashboard
- Content management system
- Mobile apps (web-only)
- Email notifications
- Social features
