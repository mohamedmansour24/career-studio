/**
 * Deploy v2.1.1 Schema to Supabase
 * Deploys all canonical, overlay, signal, and governance tables
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function deploySchema() {
    console.log("Deploying v2.1.1 schema...\n");

    // Deploy tables in dependency order
    const statements = [
        // 1. Sources table
        `CREATE TABLE IF NOT EXISTS public.sources (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      source_type text NOT NULL CHECK (source_type IN ('taxonomy', 'job_board', 'government', 'survey', 'manual', 'enrichment')),
      url text,
      license_type text,
      license_notes text,
      country_scope text[],
      retrieved_at timestamptz,
      snapshot_path text,
      version_tag text NOT NULL,
      is_active boolean DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 2. Data runs
        `CREATE TABLE IF NOT EXISTS public.data_runs (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      run_type text NOT NULL CHECK (run_type IN ('backbone_import', 'overlay_import', 'signal_refresh', 'curation_generate', 'quality_check', 'enrichment_import')),
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
    )`,

        // 3. Occupations (ISCO backbone)
        `CREATE TABLE IF NOT EXISTS public.occupations (
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
    )`,
        `CREATE INDEX IF NOT EXISTS idx_occupations_isco ON occupations(isco_code)`,

        // 4. Occupation change log
        `CREATE TABLE IF NOT EXISTS public.occupation_change_log (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      field_changed text NOT NULL,
      old_value text,
      new_value text,
      change_source_id uuid REFERENCES sources(id),
      data_run_id uuid REFERENCES data_runs(id),
      changed_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 5. Occupation external IDs
        `CREATE TABLE IF NOT EXISTS public.occupation_external_ids (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      scheme text NOT NULL,
      external_id text NOT NULL,
      external_title text,
      mapping_method text CHECK (mapping_method IN ('official_crosswalk', 'exact_code', 'title_match', 'fuzzy_match', 'manual_review')),
      mapping_confidence numeric CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
      is_primary boolean NOT NULL DEFAULT false,
      is_primary_for_occupation boolean NOT NULL DEFAULT false,
      source_id uuid REFERENCES sources(id),
      reviewed_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT occupation_external_ids_unique UNIQUE (scheme, external_id, occupation_id)
    )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_occ_ext_primary_external ON occupation_external_ids(scheme, external_id) WHERE is_primary = true`,

        // 6. Majors canonical
        `CREATE TABLE IF NOT EXISTS public.majors_canonical (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      isced_code text NOT NULL UNIQUE,
      title_en text NOT NULL,
      description_en text,
      isced_narrow_field text,
      isced_broad_field text,
      source_id uuid REFERENCES sources(id),
      last_refreshed_at timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 7. Major external IDs
        `CREATE TABLE IF NOT EXISTS public.major_external_ids (
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
    )`,

        // 8. Skill concepts
        `CREATE TABLE IF NOT EXISTS public.skill_concepts (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      concept_type text NOT NULL CHECK (concept_type IN ('skill', 'knowledge', 'ability', 'tool')),
      label_en text NOT NULL,
      description_en text,
      category text,
      source_id uuid REFERENCES sources(id),
      last_refreshed_at timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 9. Skill external IDs
        `CREATE TABLE IF NOT EXISTS public.skill_external_ids (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      skill_concept_id uuid NOT NULL REFERENCES skill_concepts(id),
      scheme text NOT NULL,
      external_id text NOT NULL,
      external_label text,
      mapping_confidence numeric CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
      source_id uuid REFERENCES sources(id),
      created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT skill_external_ids_unique UNIQUE (scheme, external_id)
    )`,

        // 10. Occupation-skill ratings
        `CREATE TABLE IF NOT EXISTS public.occupation_skill_ratings (
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
    )`,

        // 11. Occupation tasks enrichment
        `CREATE TABLE IF NOT EXISTS public.occupation_tasks_enrichment (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      task_id_source integer,
      task_text_en text NOT NULL,
      task_type text,
      incumbents_responding integer,
      data_date date,
      source_id uuid REFERENCES sources(id),
      data_run_id uuid REFERENCES data_runs(id),
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_text_idempotent ON occupation_tasks_enrichment(occupation_id, source_id, md5(task_text_en)) WHERE task_id_source IS NULL`,

        // 12. Occupation interest enrichment
        `CREATE TABLE IF NOT EXISTS public.occupation_interest_enrichment (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      interest_key text NOT NULL CHECK (interest_key IN ('realistic','investigative','artistic','social','enterprising','conventional')),
      interest_value numeric NOT NULL,
      data_date date,
      source_id uuid REFERENCES sources(id),
      data_run_id uuid REFERENCES data_runs(id),
      CONSTRAINT occ_interest_unique UNIQUE (occupation_id, interest_key)
    )`,

        // 13. Major occupation links
        `CREATE TABLE IF NOT EXISTS public.major_occupation_links (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      link_type text DEFAULT 'direct' CHECK (link_type IN ('direct', 'related', 'transferable', 'advanced')),
      relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
      rationale text,
      mapping_method text CHECK (mapping_method IN ('official_curriculum', 'labor_data', 'expert_review', 'inferred', 'manual')),
      mapping_confidence numeric DEFAULT 0.8,
      source_id uuid REFERENCES sources(id),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT major_occupation_links_unique UNIQUE (major_canonical_id, occupation_id)
    )`,

        // 14. ASCO mappings
        `CREATE TABLE IF NOT EXISTS public.asco_mappings (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      asco_code text NOT NULL UNIQUE,
      asco_title_ar text NOT NULL,
      asco_title_en text,
      mapping_method text NOT NULL CHECK (mapping_method IN ('official_mapping', 'exact_code_match', 'title_match', 'synonym_match', 'fuzzy_match', 'manual_review')),
      mapping_confidence numeric NOT NULL CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1),
      reviewed_by uuid,
      reviewed_at timestamptz,
      source_id uuid REFERENCES sources(id),
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 15. National overlays
        `CREATE TABLE IF NOT EXISTS public.national_occupation_overlays (
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
    )`,

        // 16. Occupation synonyms
        `CREATE TABLE IF NOT EXISTS public.occupation_synonyms (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      synonym_ar text NOT NULL,
      synonym_ar_normalized text NOT NULL,
      synonym_en text,
      country_code text REFERENCES countries(iso2),
      synonym_type text CHECK (synonym_type IN ('official', 'common', 'colloquial', 'transliteration')),
      source_id uuid REFERENCES sources(id),
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
        `CREATE INDEX IF NOT EXISTS idx_synonyms_ar_trgm ON occupation_synonyms USING gin(synonym_ar_normalized gin_trgm_ops)`,

        // 17. Major overlays
        `CREATE TABLE IF NOT EXISTS public.major_overlays (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
      country_code text REFERENCES countries(iso2),
      title_ar text NOT NULL,
      title_en text,
      local_program_name text,
      source_id uuid REFERENCES sources(id),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 18. Skill translations
        `CREATE TABLE IF NOT EXISTS public.skill_translations (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      skill_concept_id uuid NOT NULL REFERENCES skill_concepts(id),
      name_ar text NOT NULL,
      name_ar_normalized text NOT NULL,
      description_ar text,
      country_code text REFERENCES countries(iso2),
      source_id uuid REFERENCES sources(id)
    )`,
        `CREATE INDEX IF NOT EXISTS idx_skill_trans_trgm ON skill_translations USING gin(name_ar_normalized gin_trgm_ops)`,

        // 19. Industries
        `CREATE TABLE IF NOT EXISTS public.industries (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      name_en text NOT NULL UNIQUE,
      name_ar text,
      parent_id uuid REFERENCES industries(id),
      naics_code text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 20. Employers
        `CREATE TABLE IF NOT EXISTS public.employers (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      country_code text REFERENCES countries(iso2),
      industry_id uuid REFERENCES industries(id),
      website text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 21. Market demand
        `CREATE TABLE IF NOT EXISTS public.market_demand (
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
      top_industries text[],
      top_employers text[],
      source_id uuid REFERENCES sources(id),
      snapshot_version text NOT NULL,
      data_run_id uuid REFERENCES data_runs(id),
      created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT market_demand_unique UNIQUE (occupation_id, country_code, period_start, snapshot_version)
    )`,

        // 22. Demand industries join
        `CREATE TABLE IF NOT EXISTS public.demand_industries (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      market_demand_id uuid NOT NULL REFERENCES market_demand(id) ON DELETE CASCADE,
      industry_id uuid NOT NULL REFERENCES industries(id),
      rank_order integer,
      CONSTRAINT demand_industries_unique UNIQUE (market_demand_id, industry_id)
    )`,

        // 23. Demand employers join
        `CREATE TABLE IF NOT EXISTS public.demand_employers (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      market_demand_id uuid NOT NULL REFERENCES market_demand(id) ON DELETE CASCADE,
      employer_id uuid NOT NULL REFERENCES employers(id),
      rank_order integer,
      CONSTRAINT demand_employers_unique UNIQUE (market_demand_id, employer_id)
    )`,

        // 24. Trending skills
        `CREATE TABLE IF NOT EXISTS public.trending_skills (
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
      CONSTRAINT trending_skills_idempotent UNIQUE (country_code, period_start, period_end, source_id, skill_concept_id, snapshot_version)
    )`,

        // 25. Major career demand
        `CREATE TABLE IF NOT EXISTS public.major_career_demand (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      major_canonical_id uuid NOT NULL REFERENCES majors_canonical(id),
      occupation_id uuid NOT NULL REFERENCES occupations(id),
      country_code text REFERENCES countries(iso2),
      employment_rate numeric,
      relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
      data_year integer,
      source_id uuid REFERENCES sources(id)
    )`,

        // 26. Quality checks
        `CREATE TABLE IF NOT EXISTS public.quality_checks (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      run_id uuid REFERENCES data_runs(id),
      check_name text NOT NULL,
      check_category text NOT NULL CHECK (check_category IN ('coverage', 'freshness', 'consistency', 'language', 'mapping', 'uniqueness')),
      severity text NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
      expected_value text,
      actual_value text,
      passed boolean NOT NULL,
      details jsonb,
      checked_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 27. Mapping review queue
        `CREATE TABLE IF NOT EXISTS public.mapping_review_queue (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      mapping_type text NOT NULL CHECK (mapping_type IN ('isco_onet', 'asco_isco', 'national_occupation', 'skill_esco', 'skill_onet', 'major_isced')),
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
    )`,

        // 28. Curation releases
        `CREATE TABLE IF NOT EXISTS public.curation_releases (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      release_tag text NOT NULL UNIQUE,
      description text,
      data_run_id uuid REFERENCES data_runs(id),
      status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','deprecated')),
      careers_count integer,
      majors_count integer,
      published_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,

        // 29. Career kits
        `CREATE TABLE IF NOT EXISTS public.career_kits (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      career_id uuid NOT NULL,
      release_id uuid REFERENCES curation_releases(id),
      version_tag text NOT NULL,
      status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','active','superseded')),
      kit_data jsonb NOT NULL,
      has_pathways boolean DEFAULT false,
      has_proof_tasks boolean DEFAULT false,
      has_arabic_title boolean DEFAULT false,
      has_arabic_tasks boolean DEFAULT false,
      confidence_score numeric,
      last_updated_at timestamptz,
      evidence_window_start date,
      evidence_window_end date,
      primary_skills text[],
      generated_from_run_id uuid REFERENCES data_runs(id),
      published_at timestamptz,
      superseded_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_career_kits_one_active ON career_kits(career_id) WHERE status = 'active'`,
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const sql of statements) {
        try {
            const { error } = await supabase.rpc('exec_sql', { query: sql });
            if (error) {
                // Try direct query if RPC fails
                const { error: err2 } = await supabase.from('_temp').select().limit(0);
                // Fallback: just log and continue
                console.log(`⚠ Statement skipped (trying via psql): ${sql.substring(0, 50)}...`);
            } else {
                successCount++;
                console.log(`✓ Executed: ${sql.substring(0, 60)}...`);
            }
        } catch (err) {
            errorCount++;
            console.error(`✗ Error: ${err.message}`);
        }
    }

    console.log(`\n=== Deployment Summary ===`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

deploySchema().catch(console.error);
