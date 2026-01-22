-- ============================================================
-- Career Studio Migration: Extend existing tables for v2.1.1
-- ============================================================
-- Run this AFTER schema_v2.sql creates the new tables
-- This script adds canonical references to existing careers/majors/skills
-- ============================================================

-- Add canonical references to careers
ALTER TABLE public.careers 
    ADD COLUMN IF NOT EXISTS occupation_id uuid REFERENCES occupations(id),
    ADD COLUMN IF NOT EXISTS content_status text DEFAULT 'active' 
        CHECK (content_status IN ('draft','review','active','deprecated')),
    ADD COLUMN IF NOT EXISTS last_curated_at timestamptz,
    ADD COLUMN IF NOT EXISTS content_confidence numeric DEFAULT 0.8,
    ADD COLUMN IF NOT EXISTS country_scope text[] DEFAULT ARRAY['MENA'],
    ADD COLUMN IF NOT EXISTS primary_source_id uuid REFERENCES sources(id),
    ADD COLUMN IF NOT EXISTS current_kit_id uuid REFERENCES career_kits(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_careers_occupation ON careers(occupation_id);
CREATE INDEX IF NOT EXISTS idx_careers_status ON careers(content_status) WHERE content_status = 'active';
CREATE INDEX IF NOT EXISTS idx_careers_current_kit ON careers(current_kit_id);

-- Add canonical references to majors
ALTER TABLE public.majors
    ADD COLUMN IF NOT EXISTS major_canonical_id uuid REFERENCES majors_canonical(id),
    ADD COLUMN IF NOT EXISTS content_status text DEFAULT 'active'
        CHECK (content_status IN ('draft','review','active','deprecated')),
    ADD COLUMN IF NOT EXISTS last_curated_at timestamptz,
    ADD COLUMN IF NOT EXISTS country_scope text[] DEFAULT ARRAY['MENA'],
    ADD COLUMN IF NOT EXISTS primary_source_id uuid REFERENCES sources(id),
    ADD COLUMN IF NOT EXISTS current_kit_id uuid;  -- FK when major_kits exists

CREATE INDEX IF NOT EXISTS idx_majors_canonical ON majors(major_canonical_id);

-- Add canonical references to skills
ALTER TABLE public.skills
    ADD COLUMN IF NOT EXISTS skill_concept_id uuid REFERENCES skill_concepts(id),
    ADD COLUMN IF NOT EXISTS source_id uuid REFERENCES sources(id);

CREATE INDEX IF NOT EXISTS idx_skills_canonical ON skills(skill_concept_id);

-- Add provenance to career_tasks
ALTER TABLE public.career_tasks
    ADD COLUMN IF NOT EXISTS source_task_id uuid REFERENCES occupation_tasks_enrichment(id),
    ADD COLUMN IF NOT EXISTS source_ref_type text CHECK (source_ref_type IN ('onet','asco','manual')),
    ADD COLUMN IF NOT EXISTS confidence_score numeric DEFAULT 1.0;

-- Add country scope to career_education_stats
ALTER TABLE public.career_education_stats
    ADD COLUMN IF NOT EXISTS country_code text DEFAULT 'US' REFERENCES countries(iso2),
    ADD COLUMN IF NOT EXISTS evidence_window_start date,
    ADD COLUMN IF NOT EXISTS evidence_window_end date;

-- Create FK for career_kits.career_id (now that careers exists)
ALTER TABLE public.career_kits
    ADD CONSTRAINT career_kits_career_fk 
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE;

-- ============================================================
-- Mark migration complete
-- ============================================================
INSERT INTO public.data_runs (run_type, status, records_processed, completed_at)
VALUES ('backbone_import', 'success', 0, now());

SELECT 'Migration to v2.1.1 schema complete' as status;
