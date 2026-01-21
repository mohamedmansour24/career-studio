-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type = ANY (ARRAY['background'::text, 'character'::text])),
  storage_path text,
  external_url text,
  alt_en text,
  alt_ar text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT assets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.career_character_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  asset_id uuid NOT NULL,
  variant text NOT NULL CHECK (variant = ANY (ARRAY['male'::text, 'female'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_character_assets_pkey PRIMARY KEY (id),
  CONSTRAINT career_character_assets_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id),
  CONSTRAINT career_character_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id)
);
CREATE TABLE public.career_education_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['phd'::text, 'masters'::text, 'bachelors'::text, 'associate'::text, 'some_college'::text, 'high_school'::text, 'less_than_high_school'::text, 'unknown_or_other'::text])),
  percent numeric NOT NULL CHECK (percent >= 0::numeric AND percent <= 100::numeric),
  source_name text NOT NULL DEFAULT 'CareerOneStop'::text,
  source_url text,
  year integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_education_stats_pkey PRIMARY KEY (id),
  CONSTRAINT career_education_stats_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.career_interest_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  category_id uuid NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  CONSTRAINT career_interest_categories_pkey PRIMARY KEY (id),
  CONSTRAINT career_interest_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.interest_categories(id),
  CONSTRAINT career_interest_categories_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.career_majors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  major_id uuid NOT NULL,
  note_en text,
  note_ar text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_majors_pkey PRIMARY KEY (id),
  CONSTRAINT career_majors_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id),
  CONSTRAINT career_majors_major_id_fkey FOREIGN KEY (major_id) REFERENCES public.majors(id)
);
CREATE TABLE public.career_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  importance integer CHECK (importance >= 1 AND importance <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_skills_pkey PRIMARY KEY (id),
  CONSTRAINT career_skills_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id),
  CONSTRAINT career_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.career_specializations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  name_en text NOT NULL,
  name_ar text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_specializations_pkey PRIMARY KEY (id),
  CONSTRAINT career_specializations_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.career_stages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_stages_pkey PRIMARY KEY (id),
  CONSTRAINT career_stages_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.career_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  title_en text NOT NULL,
  title_ar text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT career_tasks_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);
CREATE TABLE public.career_work_glance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL,
  dimension_id uuid NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT career_work_glance_pkey PRIMARY KEY (id),
  CONSTRAINT career_work_glance_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id),
  CONSTRAINT career_work_glance_dimension_id_fkey FOREIGN KEY (dimension_id) REFERENCES public.work_dimensions(id)
);
CREATE TABLE public.careers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text,
  intro_en text NOT NULL,
  intro_ar text,
  personality_summary_en text,
  personality_summary_ar text,
  background_asset_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  description_en text,
  description_ar text,
  CONSTRAINT careers_pkey PRIMARY KEY (id),
  CONSTRAINT careers_background_asset_id_fkey FOREIGN KEY (background_asset_id) REFERENCES public.assets(id)
);
CREATE TABLE public.interest_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE CHECK (key = ANY (ARRAY['artistic'::text, 'social'::text, 'enterprising'::text, 'investigative'::text, 'conventional'::text, 'realistic'::text])),
  title_en text NOT NULL,
  title_ar text,
  order_index integer NOT NULL DEFAULT 0,
  CONSTRAINT interest_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.major_classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  major_id uuid NOT NULL,
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT major_classes_pkey PRIMARY KEY (id),
  CONSTRAINT major_classes_major_id_fkey FOREIGN KEY (major_id) REFERENCES public.majors(id)
);
CREATE TABLE public.major_interest_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  major_id uuid NOT NULL,
  category_id uuid NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  CONSTRAINT major_interest_categories_pkey PRIMARY KEY (id),
  CONSTRAINT major_interest_categories_major_id_fkey FOREIGN KEY (major_id) REFERENCES public.majors(id),
  CONSTRAINT major_interest_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.interest_categories(id)
);
CREATE TABLE public.major_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  major_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  importance integer CHECK (importance >= 1 AND importance <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT major_skills_pkey PRIMARY KEY (id),
  CONSTRAINT major_skills_major_id_fkey FOREIGN KEY (major_id) REFERENCES public.majors(id),
  CONSTRAINT major_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.majors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text,
  intro_en text NOT NULL,
  intro_ar text,
  background_asset_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  description_en text,
  description_ar text,
  CONSTRAINT majors_pkey PRIMARY KEY (id),
  CONSTRAINT majors_background_asset_id_fkey FOREIGN KEY (background_asset_id) REFERENCES public.assets(id)
);
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  type text NOT NULL CHECK (type = ANY (ARRAY['hard'::text, 'soft'::text])),
  description_en text,
  description_ar text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.work_dimensions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT work_dimensions_pkey PRIMARY KEY (id)
);