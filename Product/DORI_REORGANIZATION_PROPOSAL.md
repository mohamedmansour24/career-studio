# Dori Folder Reorganization Proposal

## Executive Summary

The Dori project folder contains ~1,980 files with significant duplication, unclear versioning, and mixed content types. This proposal outlines a clean, scalable structure.

---

## Current State Analysis

### Folder Inventory
| Folder | Files | Status |
|--------|-------|--------|
| Career Studio - Dori | 858 | **Primary** |
| Career Studio - Dori 2 | 385 | Partial backup (45% of main) |
| Interns_s work 2 | 182 | Archive |
| Interns_s work 3 | 469 | Archive (largest) |
| Interns_s work 4 | 50 | Archive (incomplete) |
| Students.Inc | 33 | UI mockups |
| Root files | 2 | Reddit research |

### Key Problems

1. **Duplicate structures** - Two nearly identical main folders
2. **Unclear archives** - Three intern folders with no date/status indicators
3. **Deep nesting** - 8+ levels with repeated "Copy" folders
4. **Mixed naming** - Arabic notes embedded in folder names
5. **No data separation** - Source data mixed with documentation
6. **System artifacts** - 111 .DS_Store files

---

## Proposed Structure

```
Dori/
├── 01_SOURCE_DATA/
│   ├── Excel_Databases/          # All .xlsx master files
│   ├── Research_and_Surveys/     # Market research data
│   └── Archived_Data/            # Old snapshots
│
├── 02_BUSINESS_MODEL/
│   ├── Market_Analysis/
│   │   ├── Emirates/
│   │   └── Regional/
│   ├── Customer_Segments/
│   │   ├── Students/
│   │   ├── Parents/
│   │   ├── Education_Providers/
│   │   ├── Fresh_Graduates/
│   │   ├── Career_Counselors/
│   │   └── NGOs/
│   ├── Business_Elements/        # Canvas, financials, policies
│   └── Quests_and_Gamification/
│
├── 03_CONTENT_DEVELOPMENT/
│   ├── Educational_Programs/
│   │   ├── Career_Profiles/
│   │   │   ├── Completed/
│   │   │   └── In_Progress/
│   │   ├── Major_Profiles/
│   │   └── Assessments/
│   ├── Writing_Lab/
│   │   ├── Blog_Content/
│   │   │   ├── Arabic/
│   │   │   └── English/
│   │   ├── Job_Descriptions/
│   │   ├── Biographies/
│   │   ├── Career_Roadmaps/
│   │   ├── Interview_Content/
│   │   ├── Skills_and_Competencies/
│   │   ├── Book_Summaries/
│   │   └── Social_Media_Posts/
│   ├── Page_Content/
│   │   ├── Homepage/
│   │   ├── Assessments_Page/
│   │   ├── Career_Library_Page/
│   │   └── Majors_Library_Page/
│   └── New_Content_Pipeline/
│
├── 04_RESEARCH_AND_INTERVIEWS/
│   ├── Customer_Discovery/
│   │   ├── School_Counselor_Interviews/
│   │   ├── Student_Interviews/
│   │   └── Parent_Interviews/
│   └── Market_Research/
│
├── 05_CONTENT_INTERN_WORK/
│   ├── Active_Team_Assignments/
│   │   ├── Writers_Program/
│   │   │   ├── Current_Batch/
│   │   │   │   ├── Team_Duo/
│   │   │   │   ├── Team_Tres/
│   │   │   │   └── Team_Unus/
│   │   │   └── Previous_Batches/
│   │   └── Translators_Program/
│   ├── Performance_Management/
│   ├── Tracking_and_Points/
│   └── Orientation_and_Training/
│
├── 06_UI_DESIGN_AND_MOCKUPS/
│   ├── Landing_Page/
│   ├── Assessment_Flows/
│   ├── Career_Library/
│   ├── Majors_Library/
│   ├── Components_and_Assets/
│   └── Design_System/
│
├── 07_ARCHIVES/
│   ├── ARCHIVE_Interns_Batch_2_2024/
│   ├── ARCHIVE_Interns_Batch_3_2024/
│   ├── ARCHIVE_Interns_Batch_4_2024/
│   ├── Deprecated_Content/
│   └── Backup_Snapshots/
│
├── 08_DOCUMENTATION/
│   ├── PROJECT_OVERVIEW.md
│   ├── FOLDER_STRUCTURE_GUIDE.md
│   ├── NAMING_CONVENTIONS.md
│   ├── DATABASE_SCHEMA.docx
│   └── Process_Documentation/
│
└── README.md
```

---

## Migration Plan

### Phase 1: Consolidation (Day 1-2)
1. Compare `Career Studio - Dori` vs `Career Studio - Dori 2`
2. Merge unique files from Folder 2 → Folder 1
3. Delete `Career Studio - Dori 2` after merge

### Phase 2: Archive Intern Work (Day 2-3)
1. Rename intern folders with dates:
   - `Interns_s work 2` → `ARCHIVE_Interns_Batch_2_2024`
   - `Interns_s work 3` → `ARCHIVE_Interns_Batch_3_2024`
   - `Interns_s work 4` → `ARCHIVE_Interns_Batch_4_2024`
2. Create manifest files for each archive
3. Move to `07_ARCHIVES/`

### Phase 3: Data Extraction (Day 3-4)
1. Move all `.xlsx` files to `01_SOURCE_DATA/Excel_Databases/`
2. Move research data to `01_SOURCE_DATA/Research_and_Surveys/`
3. Rename with clear context

### Phase 4: Content Reorganization (Day 4-5)
1. Move business model content → `02_BUSINESS_MODEL/`
2. Move content development → `03_CONTENT_DEVELOPMENT/`
3. Move research/interviews → `04_RESEARCH_AND_INTERVIEWS/`
4. Move UI mockups → `06_UI_DESIGN_AND_MOCKUPS/`

### Phase 5: Documentation (Day 5)
1. Create README files for each section
2. Create navigation guide
3. Delete all `.DS_Store` files

---

## File Migration Reference

| Current Path | New Path |
|--------------|----------|
| `Career Studio - Dori/Business model/` | `02_BUSINESS_MODEL/` |
| `Career Studio - Dori/Content Development/` | `03_CONTENT_DEVELOPMENT/` |
| `Career Studio - Dori/Customer Discovery/` | `04_RESEARCH_AND_INTERVIEWS/` |
| `Students.Inc/` | `06_UI_DESIGN_AND_MOCKUPS/` |
| `Interns_s work 2,3,4/` | `07_ARCHIVES/ARCHIVE_Interns_Batch_*` |
| `*.xlsx` (root) | `01_SOURCE_DATA/` |

---

## Naming Conventions

### Folders
- Use `PascalCase_With_Underscores`: `Career_Profiles`, `Market_Analysis`
- No embedded status: Use subfolders like `Completed/`, `In_Progress/`
- No Arabic inline notes: Translate to English folder names

### Files
- Use `snake_case`: `career_profile_software_engineer.docx`
- No date suffixes for active work
- Version in metadata, not filename

### Languages
- Separate by subfolder: `/Arabic/` and `/English/`
- Not mixed in same folder

---

## Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| Max folder depth | 8+ levels | 5 levels |
| Duplicate folders | 2 main + 3 intern | 0 |
| .DS_Store files | 111 | 0 |
| Time to find file | 5-10 min | <2 min |
| New member onboarding | Hours | 30 min |

---

## Quick Reference

| Looking for... | Go to... |
|----------------|----------|
| Customer personas | `02_BUSINESS_MODEL/Customer_Segments/` |
| Career descriptions | `03_CONTENT_DEVELOPMENT/Educational_Programs/Career_Profiles/` |
| Blog content | `03_CONTENT_DEVELOPMENT/Writing_Lab/Blog_Content/` |
| UI mockups | `06_UI_DESIGN_AND_MOCKUPS/` |
| Market data | `01_SOURCE_DATA/` or `04_RESEARCH_AND_INTERVIEWS/` |
| Old intern work | `07_ARCHIVES/ARCHIVE_Interns_Batch_*/` |
| Database schema | `08_DOCUMENTATION/` |
