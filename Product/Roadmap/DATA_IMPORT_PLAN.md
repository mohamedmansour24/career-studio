# Career Studio - Data Import Plan

## Overview

Import content from Dori Excel files into Supabase database.

---

## Source Files

| File | Location | Records | Priority |
|------|----------|---------|----------|
| Career Profiles 2.xlsx | `Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/` | 761 | P0 |
| Majors.xlsx | `Dori/03_CONTENT_DEVELOPMENT/Major_Profiles/` | 519 | P0 |
| Job activities.xlsx | `Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/` | 2,600+ | P1 |
| Skills (from careers) | Extracted from Career Profiles | TBD | P1 |

---

## Target Schema

### Phase 1: Core Tables

```sql
-- 1. careers (761 records)
INSERT INTO careers (slug, title_en, title_ar, intro_en, intro_ar, description_en, description_ar, personality_summary_en)

-- 2. majors (519 records)
INSERT INTO majors (slug, title_en, title_ar, intro_en, intro_ar, description_en, description_ar)

-- 3. interest_categories (6 records - seed data)
INSERT INTO interest_categories (key, title_en, title_ar, order_index)

-- 4. work_dimensions (4+ records - seed data)
INSERT INTO work_dimensions (key, title_en, title_ar, order_index)
```

### Phase 2: Relationship Tables

```sql
-- 5. career_tasks (from tasks column, split by delimiter)
INSERT INTO career_tasks (career_id, title_en, title_ar, order_index)

-- 6. career_interest_categories (map careers to RIASEC)
INSERT INTO career_interest_categories (career_id, category_id, order_index)

-- 7. career_work_glance (from hazard, physical_activity, etc.)
INSERT INTO career_work_glance (career_id, dimension_id, level)

-- 8. career_education_stats (from job_zone)
INSERT INTO career_education_stats (career_id, level, percent)

-- 9. skills (extract unique skills from careers)
INSERT INTO skills (name_en, name_ar, type)

-- 10. career_skills (link careers to skills)
INSERT INTO career_skills (career_id, skill_id, importance)
```

### Phase 3: Links

```sql
-- 11. career_majors (link careers to majors)
INSERT INTO career_majors (career_id, major_id)

-- 12. major_interest_categories
INSERT INTO major_interest_categories (major_id, category_id, order_index)
```

---

## Field Mapping: Careers

| Source Column | Target Column | Transform |
|---------------|---------------|-----------|
| id | - | Generate UUID |
| title | title_en | Direct |
| title | slug | Slugify (lowercase, hyphens) |
| alternative_title | - | Store in metadata or skip |
| description | description_en | Direct |
| description | intro_en | First 200 chars |
| tasks | career_tasks | Split by delimiter, create rows |
| soft_skill | career_skills | Parse, link to skills table |
| hard_skill | career_skills | Parse, link to skills table |
| Job Zone | career_education_stats | Map 1-5 to education levels |
| hazard | career_work_glance | Map to low/medium/high |
| physical_activity | career_work_glance | Map to low/medium/high |
| decision_making | career_work_glance | Map to low/medium/high |
| time_pressure | career_work_glance | Map to low/medium/high |
| majors | career_majors | Parse, link to majors table |
| typical_industries | - | Store in metadata or skip |
| In demand | - | Add boolean field? |

---

## Field Mapping: Majors

| Source Column | Target Column | Transform |
|---------------|---------------|-----------|
| - | id | Generate UUID |
| Name | title_en | Direct |
| Name | slug | Slugify |
| Description | description_en | Direct |
| Description | intro_en | First 200 chars |
| Typical Subjects | major_classes | Parse, create rows |
| Typical Careers | career_majors | Reverse link |
| Skills Acquired | major_skills | Parse, link |
| In Demand | - | Add boolean field? |

---

## Seed Data

### interest_categories (6 records)

```json
[
  {"key": "realistic", "title_en": "Realistic", "title_ar": "واقعي", "order_index": 1},
  {"key": "investigative", "title_en": "Investigative", "title_ar": "استقصائي", "order_index": 2},
  {"key": "artistic", "title_en": "Artistic", "title_ar": "فني", "order_index": 3},
  {"key": "social", "title_en": "Social", "title_ar": "اجتماعي", "order_index": 4},
  {"key": "enterprising", "title_en": "Enterprising", "title_ar": "ريادي", "order_index": 5},
  {"key": "conventional", "title_en": "Conventional", "title_ar": "تقليدي", "order_index": 6}
]
```

### work_dimensions (4 records)

```json
[
  {"key": "hazard", "title_en": "Hazard Exposure", "title_ar": "التعرض للمخاطر", "order_index": 1},
  {"key": "physical_activity", "title_en": "Physical Activity", "title_ar": "النشاط البدني", "order_index": 2},
  {"key": "decision_making", "title_en": "Decision Making", "title_ar": "اتخاذ القرارات", "order_index": 3},
  {"key": "time_pressure", "title_en": "Time Pressure", "title_ar": "ضغط الوقت", "order_index": 4}
]
```

---

## Import Order

```
1. Seed interest_categories (6 records)
2. Seed work_dimensions (4 records)
3. Import careers (761 records)
4. Import majors (519 records)
5. Extract & import skills (from career soft/hard skills)
6. Import career_tasks (split from tasks column)
7. Import career_interest_categories (needs mapping logic)
8. Import career_work_glance (from dimension columns)
9. Import career_education_stats (from Job Zone)
10. Import career_skills (link careers to skills)
11. Import career_majors (link careers to majors)
12. Import major_interest_categories
```

---

## Validation Checks

### Pre-Import
- [ ] All required fields present in source
- [ ] No duplicate slugs
- [ ] Valid data types

### Post-Import
- [ ] Record counts match source
- [ ] All foreign keys valid
- [ ] Sample records display correctly in app
- [ ] Arabic content renders properly

---

## Scripts Needed

```
scripts/
├── import-seed-data.ts      # Interest categories, work dimensions
├── import-careers.ts        # Main careers import
├── import-majors.ts         # Main majors import
├── import-career-tasks.ts   # Split and import tasks
├── import-skills.ts         # Extract and import skills
├── import-relationships.ts  # All link tables
├── validate-import.ts       # Post-import validation
└── utils/
    ├── slugify.ts           # Create URL slugs
    ├── parse-skills.ts      # Parse skill strings
    └── map-education.ts     # Job Zone to education level
```

---

## Rollback Plan

1. Export current Supabase data before import
2. Use transactions for imports
3. Keep source Excel files unchanged
4. Document any manual fixes

---

## Timeline

| Task | Duration | Dependencies |
|------|----------|--------------|
| Build import scripts | 1 day | Schema finalized |
| Seed data import | 30 min | Scripts ready |
| Careers import | 2-4 hours | Seed data done |
| Majors import | 1-2 hours | Careers done |
| Relationship imports | 2-4 hours | Careers + Majors done |
| Validation | 2-4 hours | All imports done |
| **Total** | **2-3 days** | |
