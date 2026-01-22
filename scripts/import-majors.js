#!/usr/bin/env node
/**
 * Import majors from the Dori Excel file
 * File: Majors.xlsx
 * Sheet: Majors - Master
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// File path
const MAJORS_FILE = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Major_Profiles/Majors.xlsx';

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

async function importMajors() {
    console.log('Reading majors file...');
    console.log('File:', MAJORS_FILE);

    const workbook = XLSX.readFile(MAJORS_FILE);
    // Use the first sheet which is "Majors - Master"
    const sheetName = workbook.SheetNames[0];
    console.log('Using sheet:', sheetName);

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} majors to import`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of rows) {
        // Column mapping based on actual file structure
        const name = row['name'] || '';
        const status = row['status'] || '';

        // Skip if no name or not active
        if (!name) {
            skipped++;
            continue;
        }

        const slug = slugify(name);
        const description = row['description'] || '';
        const typicalSubjects = row['typical_subjects'] || '';
        const typicalCareers = row['typical_careers'] || '';
        const collegeLife = row['College Life'] || '';
        const skillsAcquired = row['Skills Acquired'] || '';
        const inDemand = row['in_demand'] === 'Yes';

        // Create intro from first paragraph of description
        const intro = truncate(description.split('\n')[0], 300);

        const major = {
            slug: slug,
            title_en: name.trim(),
            intro_en: intro,
            description_en: description
        };

        const { data, error } = await supabase
            .from('majors')
            .upsert(major, { onConflict: 'slug' })
            .select('id')
            .single();

        if (error) {
            console.error(`Error importing major "${name}":`, error.message);
            errors++;
            continue;
        }

        imported++;

        if (imported % 100 === 0) {
            console.log(`Imported ${imported} majors...`);
        }
    }

    console.log(`\nCompleted: ${imported} majors imported, ${skipped} skipped, ${errors} errors`);

    // Get final count
    const { count } = await supabase
        .from('majors')
        .select('*', { count: 'exact', head: true });
    console.log(`Majors in database: ${count}`);

    return imported;
}

// Run if called directly
if (require.main === module) {
    importMajors()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('Import failed:', err);
            process.exit(1);
        });
}

module.exports = { importMajors };
