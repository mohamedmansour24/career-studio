-- ============================================================
-- Career Studio MENA Data Architecture - Production Schema v2.1.1
-- ============================================================
-- This is the COMPLETE, consolidated schema ready for Supabase deployment.
-- Incorporates all P0/P1 fixes from architecture reviews.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- REFERENCE TABLES
-- ============================================================

-- Countries reference table
CREATE TABLE IF NOT EXISTS public.countries (
    iso2 text NOT NULL PRIMARY KEY,
    iso3 text UNIQUE,
    name_en text NOT NULL,
    name_ar text,
    region text CHECK (region IN ('GCC','Levant','North Africa','Other MENA','Global')),
    currency_code text,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Data sources registry
CREATE TABLE IF NOT EXISTS public.sources (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    source_type text NOT NULL CHECK (source_type IN (
        'taxonomy', 'job_board', 'government', 'survey', 'manual', 'enrichment'
    )),
    url text,
    license_type text,
    license_notes text,
    country_scope text[],
    retrieved_at timestamptz,
    snapshot_path text,
    version_tag text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Data pipeline runs log
CREATE TABLE IF NOT EXISTS public.data_runs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    run_type text NOT NULL CHECK (run_type IN (
        'backbone_import', 'overlay_import', 'signal_refresh', 
        'curation_generate', 'quality_check', 'enrichment_import'
    )),
    source_ids uuid[],
    input_checksum text,
    output_tables text[],
    records_processed integer,
    records_inserted integer,
    records_updated integer,
    records_failed integer,
    quality_score numeric,
    status text NOT NULL CHECK (status IN ('running','success','failed','partial')),
    error_log jsonb,
    started_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz
);

-- ============================================================
-- LAYER 1: CANONICAL BACKBONE (ISCO/ISCED imported directly)
-- ============================================================

-- ISCO-08 Occupation Codes (primary backbone)
CREATE TABLE IF NOT EXISTS public.occupations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    isco_code text NOT NULL UNIQUE,
    title_en text NOT NULL,
    description_en text,
    isco_unit_group text,
    isco_minor_group text,
    isco_sub_major_group text,
    isco_major_group text,
    source_id uuid REFERENCES sources(id),
    last_refreshed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occupations_isco ON occupations(isco_code);
CREATE INDEX IF NOT EXISTS idx_occupations_isco_groups ON occupations(isco_major_group, isco_minor_group);

-- Occupation change log (Model A: history tracking)
CREATE TABLE IF NOT EXISTS public.occupation_change_log (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    field_changed text NOT NULL,
    old_value text,
    new_value text,
    change_source_id uuid REFERENCES sources(id),
    data_run_id uuid REFERENCES data_runs(id),
    changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_occ_changelog_occupation ON occupation_change_log(occupation_id);

-- External occupation ID mappings (O*NET, ESCO, SSCO, etc.)
-- v2.1.1 FIX #2: Proper ambiguity handling with two flags
CREATE TABLE IF NOT EXISTS public.occupation_external_ids (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    scheme text NOT NULL,
    external_id text NOT NULL,
    external_title text,
    mapping_method text CHECK (mapping_method IN (
        'official_crosswalk', 'exact_code', 'title_match', 
        'fuzzy_match', 'manual_review'
    )),
    mapping_confidence numeric CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
    is_primary boolean NOT NULL DEFAULT false,  -- Primary mapping for this external_id
    is_primary_for_occupation boolean NOT NULL DEFAULT false,  -- Preferred external for this occupation
    source_id uuid REFERENCES sources(id),
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    -- Allow multiple candidate mappings for same external code
    CONSTRAINT occupation_external_ids_unique UNIQUE (scheme, external_id, occupation_id)
);
CREATE INDEX IF NOT EXISTS idx_occ_ext_occupation ON occupation_external_ids(occupation_id);
CREATE INDEX IF NOT EXISTS idx_occ_ext_scheme ON occupation_external_ids(scheme, external_id);
-- Exactly one primary mapping per external code (deterministic lookup)
CREATE UNIQUE INDEX IF NOT EXISTS idx_occ_ext_primary_external
    ON occupation_external_ids(scheme, external_id)
    WHERE is_primary = true;
-- One preferred external ID per occupation+scheme (display purposes)
CREATE UNIQUE INDEX IF NOT EXISTS idx_occ_ext_primary_occupation
    ON occupation_external_ids(occupation_id, scheme)
    WHERE is_primary_for_occupation = true;

-- ISCED-F 2013 Major/Field Codes
CREATE TABLE IF NOT EXISTS public.majors_canonical (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    isced_code text NOT NULL UNIQUE,
    title_en text NOT NULL,
    description_en text,
    isced_narrow_field text,
    isced_broad_field text,
    source_id uuid REFERENCES sources(id),
    last_refreshed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_majors_isced ON majors_canonical(isced_code);

-- Major external IDs (university codes, ministry lists)
CREATE TABLE IF NOT EXISTS public.major_external_ids (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
    scheme text NOT NULL,
    external_id text NOT NULL,
    external_label text,
    country_code text REFERENCES countries(iso2),
    mapping_confidence numeric CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
    is_primary boolean DEFAULT true,
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT major_external_ids_unique UNIQUE (scheme, external_id)
);
CREATE INDEX IF NOT EXISTS idx_major_ext_canonical ON major_external_ids(major_canonical_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_major_ext_primary
    ON major_external_ids(major_canonical_id, scheme)
    WHERE is_primary = true;

-- Skill/Knowledge Concepts (internal canonical table)
CREATE TABLE IF NOT EXISTS public.skill_concepts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    concept_type text NOT NULL CHECK (concept_type IN ('skill', 'knowledge', 'ability', 'tool')),
    label_en text NOT NULL,
    description_en text,
    category text,
    source_id uuid REFERENCES sources(id),
    last_refreshed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- External skill ID mappings
CREATE TABLE IF NOT EXISTS public.skill_external_ids (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_concept_id uuid NOT NULL REFERENCES skill_concepts(id),
    scheme text NOT NULL,
    external_id text NOT NULL,
    external_label text,
    mapping_confidence numeric CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT skill_external_ids_unique UNIQUE (scheme, external_id)
);
CREATE INDEX IF NOT EXISTS idx_skill_ext_concept ON skill_external_ids(skill_concept_id);

-- Skill mappings (cross-scheme relationships)
CREATE TABLE IF NOT EXISTS public.skill_mappings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    from_scheme text NOT NULL,
    from_external_id text NOT NULL,
    to_scheme text NOT NULL,
    to_external_id text NOT NULL,
    mapping_method text,
    mapping_confidence numeric,
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Occupation-Skill ratings (from O*NET as enrichment)
CREATE TABLE IF NOT EXISTS public.occupation_skill_ratings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    skill_concept_id uuid NOT NULL REFERENCES skill_concepts(id),
    importance_value numeric CHECK (importance_value >= 0 AND importance_value <= 5),
    level_value numeric CHECK (level_value >= 0 AND level_value <= 7),
    n_respondents integer,
    data_date date,
    source_id uuid REFERENCES sources(id),
    data_run_id uuid REFERENCES data_runs(id),
    CONSTRAINT occ_skill_unique UNIQUE (occupation_id, skill_concept_id)
);
CREATE INDEX IF NOT EXISTS idx_occ_skill_occupation ON occupation_skill_ratings(occupation_id);

-- Occupation Tasks (from O*NET as enrichment)
CREATE TABLE IF NOT EXISTS public.occupation_tasks_enrichment (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    task_id_source integer,
    task_text_en text NOT NULL,
    task_type text,
    incumbents_responding integer,
    data_date date,
    source_id uuid REFERENCES sources(id),
    data_run_id uuid REFERENCES data_runs(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    -- Idempotency: unique per occupation + source + task_id
    CONSTRAINT occupation_tasks_idempotent UNIQUE (occupation_id, source_id, task_id_source)
);
CREATE INDEX IF NOT EXISTS idx_occ_tasks_occupation ON occupation_tasks_enrichment(occupation_id);
-- Fallback idempotency for tasks without task_id_source
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_text_idempotent 
    ON occupation_tasks_enrichment(occupation_id, source_id, md5(task_text_en))
    WHERE task_id_source IS NULL;

-- Occupation Interest Ratings (RIASEC from O*NET)
CREATE TABLE IF NOT EXISTS public.occupation_interest_enrichment (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    interest_key text NOT NULL CHECK (interest_key IN 
        ('realistic','investigative','artistic','social','enterprising','conventional')),
    interest_value numeric NOT NULL,
    data_date date,
    source_id uuid REFERENCES sources(id),
    data_run_id uuid REFERENCES data_runs(id),
    CONSTRAINT occ_interest_unique UNIQUE (occupation_id, interest_key)
);

-- Major ↔ Occupation stable links (guidance structure)
CREATE TABLE IF NOT EXISTS public.major_occupation_links (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    link_type text DEFAULT 'direct' CHECK (link_type IN (
        'direct', 'related', 'transferable', 'advanced'
    )),
    relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
    rationale text,
    mapping_method text CHECK (mapping_method IN (
        'official_curriculum', 'labor_data', 'expert_review', 'inferred', 'manual'
    )),
    mapping_confidence numeric DEFAULT 0.8,
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT major_occupation_links_unique UNIQUE (major_canonical_id, occupation_id)
);
CREATE INDEX IF NOT EXISTS idx_mol_major ON major_occupation_links(major_canonical_id);
CREATE INDEX IF NOT EXISTS idx_mol_occupation ON major_occupation_links(occupation_id);

-- ============================================================
-- LAYER 2: ARAB & NATIONAL OVERLAYS
-- ============================================================

-- Arabic normalization function
CREATE OR REPLACE FUNCTION public.normalize_arabic(input text) 
RETURNS text AS $$
BEGIN
    RETURN regexp_replace(
        regexp_replace(
            regexp_replace(
                regexp_replace(
                    regexp_replace(
                        input,
                        '[ًٌٍَُِّْ]', '', 'g'
                    ),
                    'أ|إ|آ', 'ا', 'g'
                ),
                'ى', 'ي', 'g'
            ),
            'ة', 'ة', 'g'  -- Keep taa marbuta distinct (v2.1.1 tweak)
        ),
        '\s+', ' ', 'g'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ASCO mappings
CREATE TABLE IF NOT EXISTS public.asco_mappings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    asco_code text NOT NULL UNIQUE,
    asco_title_ar text NOT NULL,
    asco_title_en text,
    mapping_method text NOT NULL CHECK (mapping_method IN (
        'official_mapping', 'exact_code_match', 'title_match', 
        'synonym_match', 'fuzzy_match', 'manual_review'
    )),
    mapping_confidence numeric NOT NULL CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
    reviewed_by uuid,
    reviewed_at timestamptz,
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asco_occupation ON asco_mappings(occupation_id);

-- National occupation overlays (multi-system per country)
CREATE TABLE IF NOT EXISTS public.national_occupation_overlays (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    country_code text NOT NULL REFERENCES countries(iso2),
    classification_system text NOT NULL,
    national_code text,
    national_title_ar text NOT NULL,
    national_title_en text,
    is_primary boolean DEFAULT false,
    mapping_confidence numeric DEFAULT 0.8,
    is_in_demand boolean DEFAULT false,
    notes text,
    source_id uuid REFERENCES sources(id),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT national_overlays_unique UNIQUE (occupation_id, country_code, classification_system)
);
CREATE INDEX IF NOT EXISTS idx_nat_overlay_country ON national_occupation_overlays(country_code, is_primary);

-- Arabic occupation synonyms
CREATE TABLE IF NOT EXISTS public.occupation_synonyms (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    synonym_ar text NOT NULL,
    synonym_ar_normalized text NOT NULL,
    synonym_en text,
    country_code text REFERENCES countries(iso2),
    synonym_type text CHECK (synonym_type IN ('official', 'common', 'colloquial', 'transliteration')),
    source_id uuid REFERENCES sources(id),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_synonyms_ar_trgm ON occupation_synonyms 
    USING gin(synonym_ar_normalized gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_synonyms_en_trgm ON occupation_synonyms 
    USING gin(synonym_en gin_trgm_ops);

-- Major overlays
CREATE TABLE IF NOT EXISTS public.major_overlays (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
    country_code text REFERENCES countries(iso2),
    title_ar text NOT NULL,
    title_en text,
    local_program_name text,
    source_id uuid REFERENCES sources(id),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Skill translations
CREATE TABLE IF NOT EXISTS public.skill_translations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_concept_id uuid NOT NULL REFERENCES skill_concepts(id),
    name_ar text NOT NULL,
    name_ar_normalized text NOT NULL,
    description_ar text,
    country_code text REFERENCES countries(iso2),
    source_id uuid REFERENCES sources(id)
);
CREATE INDEX IF NOT EXISTS idx_skill_trans_trgm ON skill_translations 
    USING gin(name_ar_normalized gin_trgm_ops);

-- ============================================================
-- LAYER 3: MARKET SIGNALS
-- ============================================================

-- Industries (normalized reference)
CREATE TABLE IF NOT EXISTS public.industries (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en text NOT NULL UNIQUE,
    name_ar text,
    parent_id uuid REFERENCES industries(id),
    naics_code text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Employers (normalized reference)
CREATE TABLE IF NOT EXISTS public.employers (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    country_code text REFERENCES countries(iso2),
    industry_id uuid REFERENCES industries(id),
    website text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Market demand signals
CREATE TABLE IF NOT EXISTS public.market_demand (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    country_code text NOT NULL REFERENCES countries(iso2),
    period_start date NOT NULL,
    period_end date NOT NULL,
    postings_count integer,
    median_salary numeric,
    currency_code text DEFAULT 'USD',
    pay_period text DEFAULT 'monthly' CHECK (pay_period IN ('hourly','monthly','annual')),
    median_salary_usd_ppp numeric,
    demand_level text CHECK (demand_level IN ('very_low','low','medium','high','very_high')),
    growth_yoy_percent numeric,
    top_industries text[],  -- Keep for v1 (fast reads)
    top_employers text[],
    source_id uuid REFERENCES sources(id),
    snapshot_version text NOT NULL,
    data_run_id uuid REFERENCES data_runs(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT market_demand_unique UNIQUE (occupation_id, country_code, period_start, snapshot_version)
);
CREATE INDEX IF NOT EXISTS idx_demand_country_period ON market_demand(country_code, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_demand_occupation ON market_demand(occupation_id);

-- Demand ↔ Industry join table
CREATE TABLE IF NOT EXISTS public.demand_industries (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    market_demand_id uuid NOT NULL REFERENCES market_demand(id) ON DELETE CASCADE,
    industry_id uuid NOT NULL REFERENCES industries(id),
    rank_order integer,
    CONSTRAINT demand_industries_unique UNIQUE (market_demand_id, industry_id)
);

-- Demand ↔ Employer join table
CREATE TABLE IF NOT EXISTS public.demand_employers (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    market_demand_id uuid NOT NULL REFERENCES market_demand(id) ON DELETE CASCADE,
    employer_id uuid NOT NULL REFERENCES employers(id),
    rank_order integer,
    CONSTRAINT demand_employers_unique UNIQUE (market_demand_id, employer_id)
);

-- Trending skills
-- v2.1.1 FIX #3: Include snapshot_version in idempotency
CREATE TABLE IF NOT EXISTS public.trending_skills (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_concept_id uuid REFERENCES skill_concepts(id),
    skill_name_raw text,
    country_code text NOT NULL REFERENCES countries(iso2),
    period_start date NOT NULL,
    period_end date NOT NULL,
    mention_count integer,
    growth_percent numeric,
    source_id uuid REFERENCES sources(id),
    snapshot_version text NOT NULL,
    data_run_id uuid REFERENCES data_runs(id),
    CONSTRAINT trending_skills_idempotent 
        UNIQUE (country_code, period_start, period_end, source_id, skill_concept_id, snapshot_version)
);
-- Fallback for unmapped skills
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_raw_idempotent
    ON trending_skills(country_code, period_start, period_end, source_id, snapshot_version, skill_name_raw)
    WHERE skill_concept_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_trending_country ON trending_skills(country_code, period_start DESC);

-- Major-career demand signals
CREATE TABLE IF NOT EXISTS public.major_career_demand (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
    occupation_id uuid NOT NULL REFERENCES occupations(id),
    country_code text REFERENCES countries(iso2),
    employment_rate numeric,
    relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
    data_year integer,
    source_id uuid REFERENCES sources(id)
);

-- ============================================================
-- GOVERNANCE & PROVENANCE
-- ============================================================

-- Quality checks registry
CREATE TABLE IF NOT EXISTS public.quality_checks (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id uuid REFERENCES data_runs(id),
    check_name text NOT NULL,
    check_category text NOT NULL CHECK (check_category IN (
        'coverage', 'freshness', 'consistency', 'language', 'mapping', 'uniqueness'
    )),
    severity text NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    expected_value text,
    actual_value text,
    passed boolean NOT NULL,
    details jsonb,
    checked_at timestamptz NOT NULL DEFAULT now()
);

-- Mapping review queue
CREATE TABLE IF NOT EXISTS public.mapping_review_queue (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mapping_type text NOT NULL CHECK (mapping_type IN (
        'isco_onet', 'asco_isco', 'national_occupation', 
        'skill_esco', 'skill_onet', 'major_isced'
    )),
    source_code text NOT NULL,
    source_title text,
    proposed_target_id uuid,
    proposed_target_code text,
    proposed_target_title text,
    confidence numeric NOT NULL,
    auto_mapped boolean DEFAULT true,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','deferred')),
    reviewed_by uuid,
    reviewed_at timestamptz,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON mapping_review_queue(status) WHERE status = 'pending';

-- Curation releases
CREATE TABLE IF NOT EXISTS public.curation_releases (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    release_tag text NOT NULL UNIQUE,
    description text,
    data_run_id uuid REFERENCES data_runs(id),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','deprecated')),
    careers_count integer,
    majors_count integer,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_releases_status ON curation_releases(status) WHERE status = 'active';

-- ============================================================
-- LAYER 4: CURATED CONTENT (Extensions to existing tables)
-- Run these after base tables exist
-- ============================================================

-- Career Kits (versioned curated bundles)
CREATE TABLE IF NOT EXISTS public.career_kits (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    career_id uuid NOT NULL,  -- FK added after careers table exists
    release_id uuid REFERENCES curation_releases(id),
    version_tag text NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','active','superseded')),
    kit_data jsonb NOT NULL,
    -- Queryable extracted columns
    has_pathways boolean DEFAULT false,
    has_proof_tasks boolean DEFAULT false,
    has_arabic_title boolean DEFAULT false,
    has_arabic_tasks boolean DEFAULT false,
    confidence_score numeric,
    last_updated_at timestamptz,
    evidence_window_start date,
    evidence_window_end date,
    primary_skills text[],
    -- Metadata
    generated_from_run_id uuid REFERENCES data_runs(id),
    published_at timestamptz,
    superseded_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT career_kits_unique UNIQUE (career_id, version_tag)
);
CREATE INDEX IF NOT EXISTS idx_kits_career_status ON career_kits(career_id, status);
CREATE INDEX IF NOT EXISTS idx_kits_release ON career_kits(release_id);
CREATE INDEX IF NOT EXISTS idx_kits_queryable ON career_kits(has_arabic_title, confidence_score);

-- v2.1.1 FIX #1: Partial unique index for one active kit per career
CREATE UNIQUE INDEX IF NOT EXISTS idx_career_kits_one_active
    ON career_kits(career_id)
    WHERE status = 'active';

-- v2.1.1 FIX #1: BEFORE trigger for active kit enforcement
CREATE OR REPLACE FUNCTION public.enforce_single_active_kit()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure NEW.id exists in BEFORE INSERT
    IF NEW.id IS NULL THEN
        NEW.id := gen_random_uuid();
    END IF;

    IF NEW.status = 'active' THEN
        -- Supersede any existing active kit BEFORE constraint enforcement
        UPDATE public.career_kits
            SET status = 'superseded',
                superseded_at = now()
        WHERE career_id = NEW.career_id
            AND id IS DISTINCT FROM NEW.id
            AND status = 'active';

        -- Update the denormalized pointer (if careers table has current_kit_id)
        UPDATE public.careers
            SET current_kit_id = NEW.id
        WHERE id = NEW.career_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_single_active_kit ON public.career_kits;
CREATE TRIGGER trg_enforce_single_active_kit
    BEFORE INSERT OR UPDATE OF status ON public.career_kits
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION public.enforce_single_active_kit();

-- Arabic normalization trigger
CREATE OR REPLACE FUNCTION public.normalize_arabic_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'occupation_synonyms' AND NEW.synonym_ar IS NOT NULL THEN
        NEW.synonym_ar_normalized := public.normalize_arabic(NEW.synonym_ar);
    END IF;
    IF TG_TABLE_NAME = 'skill_translations' AND NEW.name_ar IS NOT NULL THEN
        NEW.name_ar_normalized := public.normalize_arabic(NEW.name_ar);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalize_synonyms ON public.occupation_synonyms;
CREATE TRIGGER trg_normalize_synonyms
    BEFORE INSERT OR UPDATE ON public.occupation_synonyms
    FOR EACH ROW EXECUTE FUNCTION public.normalize_arabic_trigger();

DROP TRIGGER IF EXISTS trg_normalize_skill_trans ON public.skill_translations;
CREATE TRIGGER trg_normalize_skill_trans
    BEFORE INSERT OR UPDATE ON public.skill_translations
    FOR EACH ROW EXECUTE FUNCTION public.normalize_arabic_trigger();

-- ============================================================
-- SEED DATA: Countries
-- ============================================================

INSERT INTO public.countries (iso2, iso3, name_en, name_ar, region, currency_code) VALUES
    ('SA', 'SAU', 'Saudi Arabia', 'المملكة العربية السعودية', 'GCC', 'SAR'),
    ('AE', 'ARE', 'United Arab Emirates', 'الإمارات العربية المتحدة', 'GCC', 'AED'),
    ('QA', 'QAT', 'Qatar', 'قطر', 'GCC', 'QAR'),
    ('KW', 'KWT', 'Kuwait', 'الكويت', 'GCC', 'KWD'),
    ('BH', 'BHR', 'Bahrain', 'البحرين', 'GCC', 'BHD'),
    ('OM', 'OMN', 'Oman', 'عُمان', 'GCC', 'OMR'),
    ('JO', 'JOR', 'Jordan', 'الأردن', 'Levant', 'JOD'),
    ('LB', 'LBN', 'Lebanon', 'لبنان', 'Levant', 'LBP'),
    ('EG', 'EGY', 'Egypt', 'مصر', 'North Africa', 'EGP'),
    ('MA', 'MAR', 'Morocco', 'المغرب', 'North Africa', 'MAD'),
    ('TN', 'TUN', 'Tunisia', 'تونس', 'North Africa', 'TND'),
    ('DZ', 'DZA', 'Algeria', 'الجزائر', 'North Africa', 'DZD'),
    ('US', 'USA', 'United States', 'الولايات المتحدة', 'Global', 'USD')
ON CONFLICT (iso2) DO NOTHING;
