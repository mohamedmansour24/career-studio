# Career Studio - Developer Guide

## Overview

Career Studio is a bilingual (English/Arabic) career exploration platform built with Next.js 16 and Supabase. It helps users discover careers and majors using Holland's Interest Model (RIASEC).

## Tech Stack

- **Frontend**: Next.js 16.1.2, React 19, TypeScript 5, Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Montserrat (EN), Cairo (AR)

## Project Structure

```
/src
├── app/                    # Next.js App Router
│   ├── careers/           # Career pages
│   │   ├── page.tsx       # Library (list view)
│   │   └── [slug]/        # Detail view
│   ├── majors/            # Major pages (same structure)
│   └── blog/              # Blog (placeholder)
├── components/
│   ├── landing/           # Homepage components
│   ├── library/           # List view components
│   ├── profile/           # Detail page components
│   └── site/              # Layout (Navbar, Footer, etc.)
├── context/
│   └── LanguageContext.tsx  # EN/AR with RTL support
└── lib/
    ├── supabase/client.ts   # Database client
    └── mappers/             # Data transformers
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CAREER STUDIO ERD                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │     assets       │
                              ├──────────────────┤
                              │ id (PK)          │
                              │ type             │◄─────────────────────────┐
                              │ storage_path     │                          │
                              │ external_url     │                          │
                              │ alt_en/ar        │                          │
                              └──────────────────┘                          │
                                      ▲                                     │
                                      │                                     │
                    ┌─────────────────┴─────────────────┐                   │
                    │                                   │                   │
        ┌───────────┴───────────┐           ┌──────────┴────────┐          │
        │career_character_assets│           │                   │          │
        ├───────────────────────┤           │                   │          │
        │ id (PK)               │           │                   │          │
        │ career_id (FK)────────┼───┐       │                   │          │
        │ asset_id (FK)         │   │       │                   │          │
        │ variant (male/female) │   │       │                   │          │
        └───────────────────────┘   │       │                   │          │
                                    │       │                   │          │
                                    ▼       │                   │          │
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│ interest_categories│      │     careers       │      │      majors       │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ id (PK)           │◄──┐  │ id (PK)           │  ┌──►│ id (PK)           │
│ key (unique)      │   │  │ slug (unique)     │  │   │ slug (unique)     │
│ title_en/ar       │   │  │ title_en/ar       │  │   │ title_en/ar       │
│ order_index       │   │  │ intro_en/ar       │  │   │ intro_en/ar       │
└───────────────────┘   │  │ description_en/ar │  │   │ description_en/ar │
        ▲               │  │ personality_*     │  │   │ background_asset_id│──┘
        │               │  │ background_asset_id│──┘   └───────────────────┘
        │               │  └───────────────────┘              ▲  ▲  ▲
        │               │          │  │  │  │  │              │  │  │
        │               │          │  │  │  │  │              │  │  │
        │    ┌──────────┴──────────┘  │  │  │  └──────────────┼──┼──┼────────┐
        │    │  ┌─────────────────────┘  │  └───────┐         │  │  │        │
        │    │  │  ┌─────────────────────┘          │         │  │  │        │
        │    │  │  │                                │         │  │  │        │
        │    ▼  ▼  ▼                                ▼         │  │  │        │
        │ ┌─────────────────────┐          ┌──────────────┐   │  │  │        │
        │ │career_interest_cat. │          │ career_majors│   │  │  │        │
        │ ├─────────────────────┤          ├──────────────┤   │  │  │        │
        │ │ career_id (FK)      │          │ career_id(FK)│───┘  │  │        │
        └─┤ category_id (FK)    │          │ major_id(FK) │──────┘  │        │
          │ order_index         │          │ note_en/ar   │         │        │
          └─────────────────────┘          └──────────────┘         │        │
                                                                    │        │
┌───────────────────┐      ┌───────────────────┐      ┌─────────────┴───────┐
│      skills       │      │  career_skills    │      │major_interest_cat.  │
├───────────────────┤      ├───────────────────┤      ├─────────────────────┤
│ id (PK)           │◄─────┤ skill_id (FK)     │      │ major_id (FK)       │
│ name_en/ar        │      │ career_id (FK)    │      │ category_id (FK)────┼──► interest_categories
│ type (hard/soft)  │      │ importance (1-5)  │      │ order_index         │
│ description_en/ar │      └───────────────────┘      └─────────────────────┘
└───────────────────┘
        ▲              ┌───────────────────┐      ┌───────────────────┐
        │              │   career_tasks    │      │  career_stages    │
        │              ├───────────────────┤      ├───────────────────┤
        │              │ career_id (FK)────┼──┐   │ career_id (FK)────┼──┐
        │              │ title_en/ar       │  │   │ title_en/ar       │  │
        │              │ order_index       │  │   │ description_en/ar │  │
        │              └───────────────────┘  │   │ order_index       │  │
        │                                     │   └───────────────────┘  │
        │              ┌───────────────────┐  │                          │
        │              │career_specializ.  │  │   ┌───────────────────┐  │
        │              ├───────────────────┤  │   │career_education_st│  │
        │              │ career_id (FK)────┼──┤   ├───────────────────┤  │
        │              │ name_en/ar        │  │   │ career_id (FK)────┼──┤
        │              │ order_index       │  │   │ level             │  │
        │              └───────────────────┘  │   │ percent           │  │
        │                                     │   │ source_name/url   │  │
        │              ┌───────────────────┐  │   │ year              │  │
        │              │ career_work_glance│  │   └───────────────────┘  │
┌───────┴───────────┐  ├───────────────────┤  │                          │
│   major_skills    │  │ career_id (FK)────┼──┴──────────────────────────┘
├───────────────────┤  │ dimension_id (FK)─┼──┐
│ major_id (FK)     │  │ level (low/med/hi)│  │
│ skill_id (FK)     │  └───────────────────┘  │
│ importance (1-5)  │                         │
└───────────────────┘  ┌───────────────────┐  │
                       │  work_dimensions  │  │
┌───────────────────┐  ├───────────────────┤  │
│   major_classes   │  │ id (PK)           │◄─┘
├───────────────────┤  │ key (unique)      │
│ major_id (FK)     │  │ title_en/ar       │
│ title_en/ar       │  │ order_index       │
│ description_en/ar │  └───────────────────┘
│ video_url         │
│ order_index       │
└───────────────────┘
```

---

### Table Reference

#### Core Tables

##### `careers`
The main careers table. Each career has a unique slug for URL routing.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `slug` | text | URL-friendly identifier (unique) |
| `title_en` | text | English title (required) |
| `title_ar` | text | Arabic title |
| `intro_en` | text | Short introduction (required) |
| `intro_ar` | text | Arabic introduction |
| `description_en` | text | Full description |
| `description_ar` | text | Arabic description |
| `personality_summary_en` | text | Personality fit description |
| `personality_summary_ar` | text | Arabic personality summary |
| `background_asset_id` | uuid | FK to `assets` for background image |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

##### `majors`
Academic majors/programs. Structure mirrors `careers`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `slug` | text | URL-friendly identifier (unique) |
| `title_en` | text | English title (required) |
| `title_ar` | text | Arabic title |
| `intro_en` | text | Short introduction (required) |
| `intro_ar` | text | Arabic introduction |
| `description_en` | text | Full description |
| `description_ar` | text | Arabic description |
| `background_asset_id` | uuid | FK to `assets` |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

##### `interest_categories`
Holland's RIASEC interest model (6 fixed categories).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `key` | text | One of: `realistic`, `investigative`, `artistic`, `social`, `enterprising`, `conventional` |
| `title_en` | text | Display name in English |
| `title_ar` | text | Display name in Arabic |
| `order_index` | int | Display order |

##### `skills`
Reusable skills shared by careers and majors.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name_en` | text | Skill name in English |
| `name_ar` | text | Skill name in Arabic |
| `type` | text | `hard` or `soft` |
| `description_en` | text | Skill description |
| `description_ar` | text | Arabic description |

##### `work_dimensions`
Work characteristic dimensions (e.g., "Travel Required", "Team vs Solo").

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `key` | text | Unique identifier |
| `title_en` | text | Display name |
| `title_ar` | text | Arabic name |
| `order_index` | int | Display order |

##### `assets`
Stores image references (can be Supabase storage or external URLs).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `type` | text | `background` or `character` |
| `storage_path` | text | Supabase storage path |
| `external_url` | text | External image URL |
| `alt_en` | text | Alt text (English) |
| `alt_ar` | text | Alt text (Arabic) |

---

#### Career Relationship Tables

##### `career_interest_categories`
Links careers to Holland interest categories (many-to-many).

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `category_id` | uuid | FK to `interest_categories` |
| `order_index` | int | Priority order (lower = more relevant) |

##### `career_skills`
Links careers to required skills with importance rating.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `skill_id` | uuid | FK to `skills` |
| `importance` | int | 1-5 scale (5 = most important) |

##### `career_tasks`
Job responsibilities/duties for a career.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `title_en` | text | Task description (English) |
| `title_ar` | text | Task description (Arabic) |
| `order_index` | int | Display order |

##### `career_education_stats`
Education level distribution with source attribution.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `level` | text | See education levels below |
| `percent` | numeric | 0-100 percentage |
| `source_name` | text | Data source (default: "CareerOneStop") |
| `source_url` | text | Source URL |
| `year` | int | Data year |

**Education Levels:**
- `phd`
- `masters`
- `bachelors`
- `associate`
- `some_college`
- `high_school`
- `less_than_high_school`
- `unknown_or_other`

##### `career_work_glance`
Work characteristics for quick overview.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `dimension_id` | uuid | FK to `work_dimensions` |
| `level` | text | `low`, `medium`, or `high` |

##### `career_majors`
Links careers to relevant majors.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `major_id` | uuid | FK to `majors` |
| `note_en` | text | Optional context (e.g., "preferred") |
| `note_ar` | text | Arabic note |

##### `career_stages`
Career progression/growth stages.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `title_en` | text | Stage title (e.g., "Junior", "Senior") |
| `title_ar` | text | Arabic title |
| `description_en` | text | Stage description |
| `description_ar` | text | Arabic description |
| `order_index` | int | Progression order |

##### `career_specializations`
Specialization paths within a career.

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `name_en` | text | Specialization name |
| `name_ar` | text | Arabic name |
| `order_index` | int | Display order |

##### `career_character_assets`
Character illustrations for career profiles (gender variants).

| Column | Type | Description |
|--------|------|-------------|
| `career_id` | uuid | FK to `careers` |
| `asset_id` | uuid | FK to `assets` |
| `variant` | text | `male` or `female` |

---

#### Major Relationship Tables

##### `major_interest_categories`
Links majors to Holland interest categories.

| Column | Type | Description |
|--------|------|-------------|
| `major_id` | uuid | FK to `majors` |
| `category_id` | uuid | FK to `interest_categories` |
| `order_index` | int | Priority order |

##### `major_skills`
Skills developed through this major.

| Column | Type | Description |
|--------|------|-------------|
| `major_id` | uuid | FK to `majors` |
| `skill_id` | uuid | FK to `skills` |
| `importance` | int | 1-5 scale |

##### `major_classes`
Sample classes/courses within a major.

| Column | Type | Description |
|--------|------|-------------|
| `major_id` | uuid | FK to `majors` |
| `title_en` | text | Class name |
| `title_ar` | text | Arabic name |
| `description_en` | text | Class description |
| `description_ar` | text | Arabic description |
| `video_url` | text | Optional lecture video link |
| `order_index` | int | Display order |

---

### Common Patterns

#### Bilingual Fields
All user-facing text has `_en` and `_ar` variants:
```sql
title_en text NOT NULL,
title_ar text,  -- nullable for gradual translation
```

#### Ordering
Tables with ordered items use `order_index`:
```sql
order_index integer NOT NULL DEFAULT 0
```

#### Timestamps
Most tables include:
```sql
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
```

#### UUIDs
All primary keys use `uuid` with auto-generation:
```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
```

---

### Example Queries

#### Fetch career with all relations
```sql
SELECT
  c.*,
  -- Interest categories
  (
    SELECT json_agg(ic.* ORDER BY cic.order_index)
    FROM career_interest_categories cic
    JOIN interest_categories ic ON ic.id = cic.category_id
    WHERE cic.career_id = c.id
  ) as interests,
  -- Skills
  (
    SELECT json_agg(json_build_object(
      'skill', s.*,
      'importance', cs.importance
    ) ORDER BY cs.importance DESC)
    FROM career_skills cs
    JOIN skills s ON s.id = cs.skill_id
    WHERE cs.career_id = c.id
  ) as skills,
  -- Tasks
  (
    SELECT json_agg(ct.* ORDER BY ct.order_index)
    FROM career_tasks ct
    WHERE ct.career_id = c.id
  ) as tasks
FROM careers c
WHERE c.slug = 'software-engineer';
```

#### List careers by interest category
```sql
SELECT c.*
FROM careers c
JOIN career_interest_categories cic ON cic.career_id = c.id
JOIN interest_categories ic ON ic.id = cic.category_id
WHERE ic.key = 'investigative'
ORDER BY cic.order_index;
```

#### Get education stats for a career
```sql
SELECT level, percent, source_name, year
FROM career_education_stats
WHERE career_id = '<uuid>'
ORDER BY percent DESC;
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## Deployment

The app is designed for Vercel deployment with Supabase as the backend.

---

## Data Source

### Dori Project

**Location**: `/Users/mohamedmansour/PARA/Projects/Dori`
**Status**: READ-ONLY source repository

The Dori folder contains years of curated content that populates the Career Studio database:

| Data | Records | Source File |
|------|---------|-------------|
| Careers | 19,266 | `Career Profiles.xlsx` |
| Majors | 519 | `Majors.xlsx` |
| Job Activities (bilingual) | 2,600+ | `Job activities.xlsx` |
| Skills | 11 categories | `Skills List.xlsx` + docs |

See `DATA_INVENTORY.md` for complete mapping and import instructions.

### Key Files

```
Dori/
├── Career Profiles.xlsx    # PRIMARY - All career data
├── Majors.xlsx             # PRIMARY - All major data
├── Job activities.xlsx     # Bilingual EN/AR tasks
├── Career Studio - Dori/   # Supporting content
│   ├── Content Development/
│   └── Assessments/
└── Students.Inc/           # UI mockups (687 images)
```

### Data Import Priority

1. **Phase 1**: careers, career_tasks, majors, major_classes
2. **Phase 2**: career_majors links, skills mapping
3. **Phase 3**: work_dimensions, interest_categories, education_stats
4. **Phase 4**: character assets, background images
