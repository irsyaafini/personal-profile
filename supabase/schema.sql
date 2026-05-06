-- ============================================================
-- EPIDEMIO PORTFOLIO - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── PROFILE TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Dr. Sarah Chen',
  title TEXT NOT NULL DEFAULT 'Epidemiologist & Public Health Researcher',
  subtitle TEXT DEFAULT 'MPH, PhD Candidate | Infectious Disease Surveillance',
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  location TEXT,
  linkedin_url TEXT,
  orcid_id TEXT,
  years_experience INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── RESEARCH PROJECTS TABLE ────────────────────────────────
CREATE TABLE IF NOT EXISTS research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  dataset_info TEXT,
  findings TEXT,
  visualization_data JSONB,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'published')),
  year INT DEFAULT EXTRACT(YEAR FROM now()),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── PUBLICATIONS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  journal TEXT NOT NULL,
  year INT NOT NULL,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  link TEXT,
  abstract TEXT,
  citation_count INT DEFAULT 0,
  publication_type TEXT DEFAULT 'journal' CHECK (publication_type IN ('journal', 'conference', 'book_chapter', 'report')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── MESSAGES TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profile: public read
CREATE POLICY "Public can read profile"
  ON profile FOR SELECT TO anon, authenticated USING (true);

-- Profile: admin full access
CREATE POLICY "Admin full access on profile"
  ON profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Research: public read
CREATE POLICY "Public can read research"
  ON research_projects FOR SELECT TO anon, authenticated USING (true);

-- Research: admin full access
CREATE POLICY "Admin full access on research"
  ON research_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Publications: public read
CREATE POLICY "Public can read publications"
  ON publications FOR SELECT TO anon, authenticated USING (true);

-- Publications: admin full access
CREATE POLICY "Admin full access on publications"
  ON publications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Messages: public insert only
CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Messages: admin full access
CREATE POLICY "Admin full access on messages"
  ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── SEED DATA ──────────────────────────────────────────────

INSERT INTO profile (name, title, subtitle, bio, email, location, years_experience)
VALUES (
  'Dr. Sarah Chen',
  'Epidemiologist & Public Health Researcher',
  'MPH, PhD Candidate | Infectious Disease Surveillance',
  'Dedicated epidemiologist with 8+ years of experience in infectious disease surveillance, outbreak investigation, and population-based research. My work bridges rigorous statistical analysis with actionable public health policy.',
  'sarah.chen@epidemio.org',
  'Geneva, Switzerland',
  8
) ON CONFLICT DO NOTHING;

INSERT INTO research_projects (title, description, dataset_info, findings, visualization_data, tags, status, year)
VALUES
(
  'COVID-19 Transmission Dynamics in Urban Settings',
  'A comprehensive analysis of SARS-CoV-2 transmission patterns across 12 major metropolitan areas, examining the role of population density, mobility, and intervention timing.',
  'Dataset: WHO COVID-19 Global Data, n=2.4M cases, 2020-2023',
  'Found 3.2x higher R0 in areas with >15,000 ppl/km². Early NPIs reduced transmission by 67% within 14 days.',
  '[
    {"name":"Jan 2021","cases":45000,"deaths":892,"recovered":38000},
    {"name":"Apr 2021","cases":82000,"deaths":1340,"recovered":71000},
    {"name":"Jul 2021","cases":67000,"deaths":890,"recovered":61000},
    {"name":"Oct 2021","cases":95000,"deaths":1560,"recovered":85000},
    {"name":"Jan 2022","cases":180000,"deaths":2100,"recovered":165000},
    {"name":"Apr 2022","cases":92000,"deaths":980,"recovered":85000},
    {"name":"Jul 2022","cases":55000,"deaths":560,"recovered":51000}
  ]',
  ARRAY['COVID-19','Urban Health','Transmission','R0'],
  'completed',
  2022
),
(
  'Dengue Fever Seasonality and Climate Correlates',
  'Multi-year surveillance study mapping dengue fever incidence against climate variables (rainfall, temperature, humidity) in Southeast Asia.',
  'Dataset: WHO SEARO Dengue Reports + ERA5 Climate Data, 2015-2023',
  'Temperature 26-32°C combined with rainfall >200mm/month increases dengue risk by 4.1x (95% CI: 3.2-5.3).',
  '[
    {"name":"Jan","dengue_cases":1200,"rainfall":45,"temperature":28},
    {"name":"Feb","dengue_cases":980,"rainfall":38,"temperature":29},
    {"name":"Mar","dengue_cases":1450,"rainfall":55,"temperature":31},
    {"name":"Apr","dengue_cases":2100,"rainfall":180,"temperature":32},
    {"name":"May","dengue_cases":3400,"rainfall":280,"temperature":31},
    {"name":"Jun","dengue_cases":4200,"rainfall":320,"temperature":30},
    {"name":"Jul","dengue_cases":3800,"rainfall":290,"temperature":29},
    {"name":"Aug","dengue_cases":2900,"rainfall":240,"temperature":29},
    {"name":"Sep","dengue_cases":2200,"rainfall":195,"temperature":30},
    {"name":"Oct","dengue_cases":1800,"rainfall":120,"temperature":30},
    {"name":"Nov","dengue_cases":1400,"rainfall":75,"temperature":29},
    {"name":"Dec","dengue_cases":1100,"rainfall":50,"temperature":28}
  ]',
  ARRAY['Dengue','Climate','Southeast Asia','Seasonality'],
  'published',
  2023
);

INSERT INTO publications (title, authors, journal, year, doi, link, citation_count, publication_type)
VALUES
(
  'Estimating the Basic Reproduction Number of SARS-CoV-2 in Urban Environments: A Systematic Review',
  'Chen S, Martinez R, Patel A, Liu J',
  'The Lancet Infectious Diseases',
  2023,
  '10.1016/S1473-3099(23)00XXX-X',
  'https://doi.org/10.1016/S1473-3099(23)00XXX-X',
  42,
  'journal'
),
(
  'Climate-Driven Dengue Transmission: Projections for 2030 Under SSP Scenarios',
  'Chen S, Wong KH, Ramirez C',
  'Nature Climate Change',
  2022,
  '10.1038/s41558-022-XXXX-X',
  'https://doi.org/10.1038/s41558-022-XXXX-X',
  87,
  'journal'
),
(
  'Digital Syndromic Surveillance Systems: A Global Assessment of Implementation Gaps',
  'Chen S, Abubakar I, van Zandvoort K',
  'Bulletin of the World Health Organization',
  2021,
  '10.2471/BLT.21.XXXXXX',
  'https://doi.org/10.2471/BLT.21.XXXXXX',
  35,
  'journal'
);
