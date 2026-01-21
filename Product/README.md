# Career Studio - Product

This folder contains all product management artifacts.

## Folder Structure

```
Product/
├── Strategy/       # Product strategy, vision, positioning
├── Research/       # Market research, competitive analysis, user research
├── Roadmap/        # Product roadmap, release planning
├── Launch/         # Go-to-market plans, launch checklists
├── Assets/         # Marketing assets, presentations
├── careers_for_review.csv          # Career data for review (761 careers)
└── DORI_REORGANIZATION_PROPOSAL.md # Proposed folder structure for Dori
```

## Data for Review

### careers_for_review.csv

**761 careers** extracted from `Career Profiles 2.xlsx` (primary source).

| Column | Description |
|--------|-------------|
| id | Unique identifier |
| title | Primary career name |
| alternative_title | Alternative/related titles |
| description | Full career description |
| tasks | Key responsibilities |
| soft_skill | Required soft skills |
| hard_skill | Required hard/technical skills |
| job_zone | Education level (1-5 scale) |
| majors | Related majors/degrees |
| typical_industries | Common industries |
| in_demand | Demand indicator |
| hazard | Hazard level |
| physical_activity | Physical activity level |
| decision_making | Decision making level |
| time_pressure | Time pressure level |

**Job Zone Scale:**
- 1 = Little/no preparation (< high school)
- 2 = Some preparation (high school)
- 3 = Medium preparation (some college/associate)
- 4 = Considerable preparation (bachelor's)
- 5 = Extensive preparation (master's/PhD)

## Market Research Sources

### MIS System
**Location**: `/Users/mohamedmansour/PARA/Projects/04_MIS`

AI-augmented market research tool for Career Studio market analysis. Use for:
- PESTEL analysis (Political, Economic, Social, Technological, Environmental, Legal)
- Competitive research
- Customer discovery synthesis
- Evidence-based validation

**CLI**: `04_MIS/03_mis/` - Run `mis project create career_studio` to start

## Product Activities Framework

As PM, activities cover:

### Strategic (Insight → Analysis → Direction)
- [ ] Market research (MENA EdTech landscape)
- [ ] Customer research (user interviews)
- [ ] Competitive research (competitor mapping)
- [ ] Segmentation (target user profiles)
- [ ] Positioning (differentiation)
- [ ] Product strategy document
- [ ] Roadmap v1

### Inbound (Deliver)
- [x] Product discovery (codebase + data review)
- [ ] Requirements documentation
- [ ] Design & build oversight
- [ ] Operational readiness

### Outbound (Sell)
- [ ] Launch plan
- [ ] Product promotion strategy
- [ ] Marketing content
