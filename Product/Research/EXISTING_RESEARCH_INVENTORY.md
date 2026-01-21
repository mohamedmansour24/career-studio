# Existing Research Inventory

## Overview

Significant customer research already exists in the Dori folder. This document catalogs available research assets.

---

## 1. Customer Discovery: Counselor Interviews (6)

**Location**: `Dori/04_RESEARCH_AND_INTERVIEWS/Customer_Discovery/Counselor_Interviews/`

**Purpose**: Understanding school counselor needs, challenges, and tool requirements

| Interviewee | File | Notes |
|-------------|------|-------|
| Alia Alsalami | Alia Alsalami.docx | School counselor |
| Fardous | Fardous.docx | School counselor |
| Kamal | Kamal_.docx | School counselor |
| Mariana | Mariana_.docx | School counselor |
| Sulaiman | Sulaiman.docx | School counselor (large file) |
| Vani Balaji | Vani Balaji.docx | School counselor |

**Action Required**: Extract and synthesize key insights from these interviews:
- Pain points in career guidance
- Current tools/resources used
- Gaps in available solutions
- Willingness to adopt new tools
- Budget and decision-making process

---

## 2. Career Interviews (135+)

**Location**: `Dori/07_ARCHIVES/*/Writing Lab/Interviews/`

**Purpose**: Career content for platform (day-in-life stories, career insights)

### Categories

**Student Interviews** (by major/career interest):
- Agronomy
- Computer Science
- Medicine
- Sociology
- Human Nutrition & Dietetics
- Specialized Translation
- Financial Markets
- And more...

**Employee Interviews** (by profession):
- iOS Team Leader
- English Teacher
- Biomedical Engineer
- Courier
- Administrative Assistant
- Interior Designer
- Research Assistant
- Carpenter
- Business Developer
- Translator
- And more...

**Languages**:
- English interviews: ~60%
- Arabic interviews: ~40%

**Action Required**:
- Catalog all interviews by career/major
- Extract key quotes for career profiles
- Identify which careers have interview content

---

## 3. Customer Segment Research

**Location**: `Dori/02_BUSINESS_MODEL/Customer Segments/`

### Available Documents

| Segment | Documents |
|---------|-----------|
| **Education Providers > Private Schools > Counselors** | Survey.docx, Customer Persona - template.docx |
| **Parents** | Customer Profile.docx, Market Size_.docx, Vision.docx, User Story_.docx |
| **Fresh Graduates** | User Story.docx, Prompt.docx |
| **Mid-career Professionals** | User Story.docx |
| **NGOs** | Market Size.docx |

**Action Required**: Extract personas and user stories for product strategy

---

## 4. Interview Guides & Templates

**Location**: Various

| Document | Location | Purpose |
|----------|----------|---------|
| Interview Checklist | Writing Lab/Interviews/Guide/ | Interview methodology |
| The art of interviewing | Orientation_and_Training/Guides/Profiling/ | Interviewer training |
| Customer Persona template | Customer Segments/.../Counselors/ | Persona documentation |
| Survey template | Customer Segments/.../Counselors/ | Survey design |

---

## 5. Major/University Choice Research

**Location**: `Dori/04_RESEARCH_AND_INTERVIEWS/Customer_Discovery/Major_Uni Choice Interview_.docx`

**Purpose**: Understanding how students choose their university major

---

## 6. Counselor Contact Database

**Location**: `Dori/02_BUSINESS_MODEL/Customer Segments/Education Providers/Private Schools/End Users/End users- Master.xlsx`

**Sheet**: Counselors (40 contacts)

| Column | Description |
|--------|-------------|
| Name | Counselor name |
| Country | Saudi Arabia, Egypt, Jordan |
| Job Title | Role |
| Booked | Interview scheduled |
| Showed | Attended interview |
| Notes | Interview notes |
| Recommend | Referrals |

**Value**: Ready contact list for future outreach and research

---

## 7. Financial Model

**Location**: `Dori/02_BUSINESS_MODEL/Business_Elements/Financial Model_.xlsx`

**Sheets**:
- Assumptions (73 rows) - Marketing funnel assumptions
- Growth Model (71 rows) - Growth projections

**Contains**: Social media reach assumptions, conversion rates, funnel metrics

---

## Research Summary

| Research Type | Status | Quantity |
|---------------|--------|----------|
| Counselor Interviews | Complete | 6 interviews |
| Counselor Contacts | Database | 40 contacts (Saudi, Egypt, Jordan) |
| Career Interviews | Complete | 135+ interviews |
| Customer Personas | Partial | Templates exist |
| User Stories | Partial | Some segments done |
| Market Sizing | Partial | Parents, NGOs done |
| Financial Model | Exists | Assumptions + Growth model |
| Survey Design | Template | Ready to deploy |

---

## Gap Analysis

### What We Have
- Qualitative counselor interviews (B2B customer)
- Career content interviews (platform content)
- Basic customer segment documentation
- Interview methodology

### What We Still Need
- Student interviews (end user perspective)
- Parent interviews (B2C payer perspective)
- Quantitative survey data (larger sample)
- Willingness-to-pay research
- Competitive user research (what they use today)

---

## Next Steps

1. **Extract counselor interview insights** - Synthesize into product requirements
2. **Catalog career interviews** - Map to career profiles in database
3. **Extract personas and user stories** - Incorporate into strategy docs
4. **Conduct additional research** - Fill gaps identified above

---

## File Access Note

The interview files are in .docx format. To extract content:
- Use pandoc: `pandoc file.docx -o file.txt`
- Or open in Word/Google Docs
- Or use python-docx library
