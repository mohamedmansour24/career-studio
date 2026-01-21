/**
 * Career Studio - Data Import Script
 *
 * Imports careers and majors from Excel files into Supabase
 *
 * Usage:
 *   node scripts/import-data.js
 *
 * Prerequisites:
 *   - Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables
 *   - npm install xlsx @supabase/supabase-js dotenv
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const DORI_PATH = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT';
const CAREERS_FILE = path.join(DORI_PATH, 'Career_Profiles', 'Career Profiles 2.xlsx');
const MAJORS_FILE = path.join(DORI_PATH, 'Major_Profiles', 'Majors.xlsx');

// Supabase client with service key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function mapJobZoneToEducation(jobZone) {
  const mapping = {
    1: 'less_than_high_school',
    2: 'high_school',
    3: 'some_college',
    4: 'bachelors',
    5: 'masters'
  };
  return mapping[jobZone] || 'unknown_or_other';
}

function mapLevelToScale(value) {
  // Assuming numeric scale, map to low/medium/high
  const num = parseFloat(value);
  if (isNaN(num)) return 'medium';
  if (num <= 33) return 'low';
  if (num <= 66) return 'medium';
  return 'high';
}

// Seed data
const INTEREST_CATEGORIES = [
  { key: 'realistic', title_en: 'Realistic', title_ar: 'واقعي', order_index: 1 },
  { key: 'investigative', title_en: 'Investigative', title_ar: 'استقصائي', order_index: 2 },
  { key: 'artistic', title_en: 'Artistic', title_ar: 'فني', order_index: 3 },
  { key: 'social', title_en: 'Social', title_ar: 'اجتماعي', order_index: 4 },
  { key: 'enterprising', title_en: 'Enterprising', title_ar: 'ريادي', order_index: 5 },
  { key: 'conventional', title_en: 'Conventional', title_ar: 'تقليدي', order_index: 6 }
];

const WORK_DIMENSIONS = [
  { key: 'hazard', title_en: 'Hazard Exposure', title_ar: 'التعرض للمخاطر', order_index: 1 },
  { key: 'physical_activity', title_en: 'Physical Activity', title_ar: 'النشاط البدني', order_index: 2 },
  { key: 'decision_making', title_en: 'Decision Making', title_ar: 'اتخاذ القرارات', order_index: 3 },
  { key: 'time_pressure', title_en: 'Time Pressure', title_ar: 'ضغط الوقت', order_index: 4 }
];

// Import functions
async function seedInterestCategories() {
  console.log('Seeding interest categories...');

  for (const category of INTEREST_CATEGORIES) {
    const { error } = await supabase
      .from('interest_categories')
      .upsert(category, { onConflict: 'key' });

    if (error) {
      console.error(`Error inserting category ${category.key}:`, error.message);
    }
  }

  console.log(`Seeded ${INTEREST_CATEGORIES.length} interest categories`);
}

async function seedWorkDimensions() {
  console.log('Seeding work dimensions...');

  for (const dimension of WORK_DIMENSIONS) {
    const { error } = await supabase
      .from('work_dimensions')
      .upsert(dimension, { onConflict: 'key' });

    if (error) {
      console.error(`Error inserting dimension ${dimension.key}:`, error.message);
    }
  }

  console.log(`Seeded ${WORK_DIMENSIONS.length} work dimensions`);
}

async function importCareers() {
  console.log('Reading careers file...');

  const workbook = XLSX.readFile(CAREERS_FILE);
  const sheet = workbook.Sheets['Sheet1'];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`Found ${rows.length} careers to import`);

  let imported = 0;
  let errors = 0;

  for (const row of rows) {
    const title = row['title'] || '';
    if (!title) continue;

    const slug = slugify(title);
    const description = row['description'] || '';

    const career = {
      slug: slug,
      title_en: title,
      intro_en: truncate(description, 300),
      description_en: description,
      personality_summary_en: null // To be filled later
    };

    const { data, error } = await supabase
      .from('careers')
      .upsert(career, { onConflict: 'slug' })
      .select('id')
      .single();

    if (error) {
      console.error(`Error importing career "${title}":`, error.message);
      errors++;
      continue;
    }

    const careerId = data.id;

    // Import tasks
    const tasks = row['tasks'];
    if (tasks) {
      const taskList = tasks.split(/[.;]/).filter(t => t.trim().length > 5);
      for (let i = 0; i < taskList.length && i < 10; i++) {
        const taskText = taskList[i].trim();
        if (taskText) {
          await supabase
            .from('career_tasks')
            .upsert({
              career_id: careerId,
              title_en: taskText,
              order_index: i
            }, { onConflict: 'career_id,order_index', ignoreDuplicates: true });
        }
      }
    }

    // Import education stats from Job Zone
    const jobZone = row['Job Zone '] || row['Job Zone'];
    if (jobZone) {
      const level = mapJobZoneToEducation(parseInt(jobZone));
      await supabase
        .from('career_education_stats')
        .upsert({
          career_id: careerId,
          level: level,
          percent: 100,
          source_name: 'O*NET'
        }, { ignoreDuplicates: true });
    }

    imported++;

    if (imported % 100 === 0) {
      console.log(`Imported ${imported} careers...`);
    }
  }

  console.log(`Completed: ${imported} careers imported, ${errors} errors`);
  return imported;
}

async function importMajors() {
  console.log('Reading majors file...');

  const workbook = XLSX.readFile(MAJORS_FILE);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`Found ${rows.length} majors to import`);

  let imported = 0;
  let errors = 0;

  for (const row of rows) {
    // Try different column names
    const title = row['Name'] || row['title'] || row['Title'] || '';
    if (!title) continue;

    const slug = slugify(title);
    const description = row['Description'] || row['description'] || '';

    const major = {
      slug: slug,
      title_en: title,
      intro_en: truncate(description, 300),
      description_en: description
    };

    const { data, error } = await supabase
      .from('majors')
      .upsert(major, { onConflict: 'slug' })
      .select('id')
      .single();

    if (error) {
      console.error(`Error importing major "${title}":`, error.message);
      errors++;
      continue;
    }

    imported++;

    if (imported % 100 === 0) {
      console.log(`Imported ${imported} majors...`);
    }
  }

  console.log(`Completed: ${imported} majors imported, ${errors} errors`);
  return imported;
}

async function getImportStats() {
  const { count: careersCount } = await supabase
    .from('careers')
    .select('*', { count: 'exact', head: true });

  const { count: majorsCount } = await supabase
    .from('majors')
    .select('*', { count: 'exact', head: true });

  const { count: tasksCount } = await supabase
    .from('career_tasks')
    .select('*', { count: 'exact', head: true });

  const { count: categoriesCount } = await supabase
    .from('interest_categories')
    .select('*', { count: 'exact', head: true });

  return {
    careers: careersCount,
    majors: majorsCount,
    tasks: tasksCount,
    categories: categoriesCount
  };
}

// Main import function
async function main() {
  console.log('=== Career Studio Data Import ===\n');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Careers file:', CAREERS_FILE);
  console.log('Majors file:', MAJORS_FILE);
  console.log('');

  try {
    // Test connection
    const { error: testError } = await supabase.from('careers').select('id').limit(1);
    if (testError) {
      console.error('Failed to connect to Supabase:', testError.message);
      process.exit(1);
    }
    console.log('Connected to Supabase successfully\n');

    // Get initial stats
    console.log('Initial database state:');
    const initialStats = await getImportStats();
    console.log(initialStats);
    console.log('');

    // Run imports
    await seedInterestCategories();
    await seedWorkDimensions();
    await importCareers();
    await importMajors();

    // Get final stats
    console.log('\nFinal database state:');
    const finalStats = await getImportStats();
    console.log(finalStats);

    console.log('\n=== Import Complete ===');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  importCareers,
  importMajors,
  seedInterestCategories,
  seedWorkDimensions
};
