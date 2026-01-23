# Full Database Audit Report

**Date:** January 23, 2026  
**From:** Database Team  
**To:** CTO/PM  
**Subject:** Complete Supabase Database Inventory

---

## Executive Summary

**39 tables audited** | **17 with data** | **22 empty** | **0 missing**

### Critical Finding
**97% of career content is missing.** Only 19 of 761 careers have intro/description content.

---

## Table Inventory by Category

### Content Tables (Core Entities)
| Table | Rows | Status |
|-------|------|--------|
| careers | 761 | ✅ Has rows (but 97% missing content) |
| majors | 512 | ✅ Has rows (50% have content) |
| skills | 0 | ❌ Empty - CRITICAL |
| assets | 0 | ❌ Empty |

### Career Junction Tables
| Table | Rows | Status |
|-------|------|--------|
| career_tasks | 6,649 | ✅ Good (~9 per career) |
| career_interest_categories | 1,081 | ✅ RIASEC linked |
| career_skills | 0 | ❌ Empty - blocked by skills |
| career_majors | 0 | ❌ Empty - no links |
| career_stages | 0 | ❌ Empty |
| career_specializations | 0 | ❌ Empty |
| career_education_stats | 0 | ❌ Empty |
| career_work_glance | 0 | ❌ Empty |
| career_character_assets | 0 | ❌ Empty |

### Major Junction Tables
| Table | Rows | Status |
|-------|------|--------|
| major_interest_categories | 257 | ✅ RIASEC linked |
| major_classes | 0 | ❌ Empty |
| major_skills | 0 | ❌ Empty |

### Reference Tables
| Table | Rows | Status |
|-------|------|--------|
| interest_categories | 6 | ✅ RIASEC complete |
| work_dimensions | 4 | ✅ Populated |
| countries | 13 | ✅ MENA countries |

### V2 Backbone (Future Use)
| Table | Rows | Status |
|-------|------|--------|
| occupations | 114 | ✅ ISCO backbone |
| sources | 2 | ✅ Metadata |
| data_runs | 2 | ✅ Metadata |
| quality_checks | 2 | ✅ Metadata |

### Staging (O*NET Import)
| Table | Rows | Status |
|-------|------|--------|
| onet_* (5 tables) | - | ✅ Has staged data |

---

## Detailed Field Coverage

### careers table (761 rows)
| Field | Populated | Missing | Coverage |
|-------|-----------|---------|----------|
| slug | 761 | 0 | **100%** ✅ |
| title_en | 761 | 0 | **100%** ✅ |
| title_ar | 556 | 205 | 73% |
| **intro_en** | **19** | **742** | **2%** ❌ |
| intro_ar | 0 | 761 | 0% ❌ |
| **description_en** | **19** | **742** | **2%** ❌ |
| description_ar | 0 | 761 | 0% ❌ |
| personality_summary_en | 0 | 761 | 0% ❌ |

### majors table (512 rows)
| Field | Populated | Missing | Coverage |
|-------|-----------|---------|----------|
| title_en | 512 | 0 | **100%** ✅ |
| title_ar | 0 | 512 | 0% ❌ |
| intro_en | 257 | 255 | 50% |
| description_en | 257 | 255 | 50% |

### career_tasks table (6,649 rows)
| Field | Coverage |
|-------|----------|
| title_en | **100%** ✅ |
| title_ar | 49% ⚠️ |

---

## Import Priority Recommendation

| Priority | Data Gap | Impact | Source |
|----------|----------|--------|--------|
| **P0** | careers.intro_en/description_en | 97% missing | Need Dori source |
| **P0** | skills table | 0 rows, blocks career_skills | Need creation |
| **P1** | career_majors links | 0 rows | Need mapping |
| **P1** | majors.title_ar | 0% | Need translation |
| **P2** | career_education_stats | 0 rows | Nice to have |
| **P2** | career_work_glance | 0 rows | Nice to have |
| **P3** | assets, character_assets | 0 rows | Cosmetic |

---

## Data Sources Available

1. **Dori Excel Files** - May contain career content (intro, description)
2. **O*NET Staged Data** - Skills/elements available but not published
3. **Original CSV** - Titles only, no content

---

## Recommended Next Steps

1. **Locate career content source** - Check Dori files for descriptions
2. **Create skills table entries** - Define hard/soft skills
3. **Generate career-major links** - From degree requirements
4. **Import Arabic translations** - From Dori if available

---

**Database Team Status:** Awaiting content source identification before import.
