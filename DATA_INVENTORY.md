# Career Studio - Data Inventory

## Source: Dori Project

**Location**: `/Users/mohamedmansour/PARA/Projects/Dori`
**Size**: 8.72 GB
**Files**: 1,980 total
**Status**: READ-ONLY source - Do not modify original files

---

## Executive Summary

| Data Type | Records | Source File | Import Ready |
|-----------|---------|-------------|--------------|
| Careers | 761 | **Career Profiles 2.xlsx** (PRIMARY) | Yes |
| Majors | 519 | Majors.xlsx | Yes |
| Job Activities | 2,600+ | Job activities.xlsx | Yes |
| Skills | 11 categories | Skills List.xlsx + docs | Partial |
| Interests | 2,623 | Career Profiles.xlsx (Interests sheet) | Needs mapping |
| Work Dimensions | 4 types | Career Profiles 2.xlsx columns | Needs decoding |

---

## Folder Structure (Reorganized)

```
Dori/
├── 01_SOURCE_DATA/              # Raw data files (56K)
│   └── Research_and_Surveys/    # Reddit research data
│
├── 02_BUSINESS_MODEL/           # Business strategy (2.8M)
│   ├── Market_Analysis/
│   ├── Customer_Segments/
│   └── Business_Elements/
│
├── 03_CONTENT_DEVELOPMENT/      # Core content (716M)
│   ├── Career_Profiles/         # Career data & Excel files
│   │   └── Career Profiles 2.xlsx  # PRIMARY - 761 careers
│   ├── Major_Profiles/          # Major data
│   │   └── Majors.xlsx          # PRIMARY - 519 majors
│   ├── Assessments/             # Assessment content
│   └── Writing_Lab/             # Writing samples, skills content
│       └── Skills_and_Competencies/  # 11 skill topics
│
├── 04_RESEARCH_AND_INTERVIEWS/  # Customer research (720K)
│   └── Customer_Discovery/
│
├── 05_CONTENT_INTERN_WORK/      # Intern program (1.3G)
│   ├── Active_Team_Assignments/
│   └── Performance_Management/
│
├── 06_UI_DESIGN_AND_MOCKUPS/    # Design assets (205M)
│
├── 07_ARCHIVES/                 # Historical content (8.7G)
│   ├── ARCHIVE_Interns_Batch_2-4/
│   └── ARCHIVE_Career_Studio_Dori_Original/
│
└── 08_DOCUMENTATION/            # Process docs (312K)
```

---

## Primary Data Files

### 1. Career Profiles.xlsx (PRIMARY)

**Location**: `Dori/Career Profiles.xlsx`
**Records**: 19,266 rows
**Sheets**: Career Profiles, Interests (2,623 rows), Work Values, Majors, Subjects, Ref

#### Schema:

| Column | Maps To | Notes |
|--------|---------|-------|
| Alternative Title | `careers.title_en` | Primary career name |
| Description | `careers.description_en` | 500+ word descriptions |
| Tasks | `career_tasks.title_en` | Multi-task per career |
| Soft Skills | `career_skills` (type=soft) | Encoded - needs mapping |
| Hard Skills | `career_skills` (type=hard) | Encoded - needs mapping |
| Job Zone | `career_education_stats.level` | 1-5 scale → education level |
| Majors | `career_majors` | Related majors list |
| Typical Industries | - | Industry categories |
| Hazard | `career_work_glance` | Risk level indicator |
| Physical Activity | `career_work_glance` | Activity level |
| Decision Making | `career_work_glance` | Autonomy level |
| Time Pressure | `career_work_glance` | Stress indicator |

#### Sample Careers:
- Accountants, Auditors, Acupuncturists
- Acute Care Nurses, Agricultural Equipment Operators
- 100+ career families covered

---

### 2. Majors.xlsx (PRIMARY)

**Location**: `Dori/Majors.xlsx`
**Records**: 519 rows
**Sheets**: Majors - Master, Majors, Arabic, Hasan, Fatima, Database

#### Schema:

| Column | Maps To | Notes |
|--------|---------|-------|
| Status | - | active/inactive filter |
| Language Code | - | EN or AR indicator |
| Name | `majors.title_en/ar` | Major/program name |
| Typical Subjects | `major_classes` | Course list |
| Description | `majors.description_en/ar` | 200-400 words |
| Typical Careers | `career_majors` | Reverse link to careers |
| In Demand | - | Boolean flag |
| College Life | - | Student experience |
| Skills Acquired | `major_skills` | Competencies list |

#### Sample Majors:
- Accounting, Organizational Behavior Studies
- Operations Management, Engineering disciplines
- 500+ programs covered

---

### 3. Job activities.xlsx (BILINGUAL)

**Location**: `Dori/Job activities.xlsx`
**Records**: 2,600+ activity entries
**Languages**: Full English/Arabic

#### Schema:

| Column | Maps To | Notes |
|--------|---------|-------|
| Job Title | `careers.title_en` | Parent career |
| AR-Job Activities | `career_tasks.title_ar` | Arabic task |
| Career Description | `careers.description_ar` | Arabic description |
| Activity Details | `career_tasks.title_en` | English task (50-100 words) |

**Import Priority**: HIGH - This provides bilingual task data

---

### 4. Skills List.xlsx

**Location**: `Dori/Skills List.xlsx`
**Records**: 17 rows (sparse)
**Status**: Needs expansion from Educational Content docs

#### Documented Skills (from Ed Programs folder):

| Skill | Type | Has Content |
|-------|------|-------------|
| Communication | soft | Yes - multi-audience |
| Leadership | soft | Yes - multi-audience |
| Professionalism | soft | Yes |
| Collaboration & Team-Work | soft | Yes |
| Critical Thinking | soft | Yes |
| Time Management | soft | Yes |
| Public Speaking | soft | Yes |
| Learning | soft | Yes |
| Networking | soft | Yes |
| Arabic Writing | hard | Yes |
| Work Values | soft | Yes |

---

## Work Dimensions Mapping

Career Profiles.xlsx contains 4 work dimension columns that map to `career_work_glance`:

| Source Column | Dimension Key | Level Mapping |
|---------------|---------------|---------------|
| Physical Activity | `physical_activity` | Scale → low/medium/high |
| Decision Making | `decision_making` | Scale → low/medium/high |
| Time Pressure | `time_pressure` | Scale → low/medium/high |
| Hazard | `hazard` | Scale → low/medium/high |

**TODO**: Determine exact scale (1-3? 1-5? 1-10?) and map to low/medium/high

---

## Interest Categories Mapping

**Source**: Career Profiles.xlsx → Interests sheet (2,623 rows)

Maps to Holland's RIASEC model in `interest_categories`:

| Holland Code | Key | Expected in Data |
|--------------|-----|------------------|
| R | realistic | Yes |
| I | investigative | Yes |
| A | artistic | Yes |
| S | social | Yes |
| E | enterprising | Yes |
| C | conventional | Yes |

**TODO**: Verify Interest sheet structure and mapping logic

---

## Education Level Mapping

**Source**: Job Zone column in Career Profiles.xlsx

| Job Zone | Maps To | Description |
|----------|---------|-------------|
| 1 | less_than_high_school | Little preparation |
| 2 | high_school | Some preparation |
| 3 | some_college / associate | Medium preparation |
| 4 | bachelors | Considerable preparation |
| 5 | masters / phd | Extensive preparation |

---

## Bilingual Coverage

| Content Type | English | Arabic | Coverage |
|--------------|---------|--------|----------|
| Career Descriptions | 100% | ~80% | Good |
| Career Tasks | 100% | 100% | Complete |
| Major Descriptions | 100% | ~60% | Partial |
| Skills | 100% | ~50% | Partial |
| UI Content | 100% | 100% | Complete |

---

## Supporting Assets

### UI/UX Mockups (Students.Inc/)
- 687 JPG/PNG files
- Career Library, Major Library designs
- Assessment interfaces
- Report templates
- Landing page designs

### Writing Samples (Writing Lab/)
- Biographies, Blogs, Interviews
- Job Descriptions (EN/AR parallel)
- Road Maps (career pathways)
- Social Media Posts

### Business Documentation
- Customer personas (6 segments)
- Market analysis (UAE focus)
- Financial models
- Partner/NGO databases

---

## Import Priority Matrix

### Phase 1: Core Data (CRITICAL)
1. `Career Profiles.xlsx` → careers, career_tasks
2. `Majors.xlsx` → majors, major_classes
3. `Job activities.xlsx` → career_tasks (AR), careers (AR descriptions)

### Phase 2: Relationships
4. Extract career-major links from both files
5. Map skills from descriptions → skills table
6. Link career_skills and major_skills

### Phase 3: Enrichment
7. Work dimensions (decode scales)
8. Interest categories (map RIASEC)
9. Education stats (Job Zone → levels)

### Phase 4: Assets
10. Character images (need to source/create)
11. Background images (from mockups)

---

## Data Quality Notes

### Strengths
- Comprehensive career coverage (19K+ entries)
- Rich descriptions (500+ words per career)
- Strong bilingual foundation
- Detailed task breakdowns

### Gaps to Address
- Skills encoded as IDs - need decoding
- Work dimension scales need normalization
- Some Arabic translations incomplete
- No character assets in data (need creation)
- Interest mapping unclear

### Duplicates to Resolve
- Career Profiles.xlsx vs Career Profiles 2.xlsx
- Multiple Intern work folders (consolidate best content)

---

## Next Steps

1. **Validate Data**: Sample 10-20 careers end-to-end
2. **Decode Skills**: Map skill IDs to names
3. **Normalize Scales**: Define work dimension thresholds
4. **Create Import Scripts**: ETL pipeline for Supabase
5. **Fill Gaps**: Identify missing Arabic translations
6. **Asset Creation**: Source/create character illustrations

---

## File Checksums (for integrity)

Run before any import:
```bash
md5 "Dori/Career Profiles.xlsx"
md5 "Dori/Majors.xlsx"
md5 "Dori/Job activities.xlsx"
```

Store checksums to detect any accidental modifications.
