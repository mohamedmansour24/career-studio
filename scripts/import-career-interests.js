#!/usr/bin/env node
/**
 * Import career-interest category mappings from the Dori Excel file
 * File: Career Profiles.xlsx → Interests sheet
 * Creates entries in career_interest_categories junction table
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// File path - use original Career Profiles.xlsx which has Interests sheet
const CAREERS_FILE = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/Career Profiles.xlsx';

// RIASEC mapping from Data Value numbers to category keys
const RIASEC_MAP = {
    1: 'realistic',
    2: 'investigative',
    3: 'artistic',
    4: 'social',
    5: 'enterprising',
    6: 'conventional'
};

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function importCareerInterests() {
    console.log('Reading interests data...');
    console.log('File:', CAREERS_FILE);

    const workbook = XLSX.readFile(CAREERS_FILE);

    if (!workbook.SheetNames.includes('Interests')) {
        console.error('Interests sheet not found!');
        process.exit(1);
    }

    const sheet = workbook.Sheets['Interests'];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} interest mappings`);

    // Get all interest categories from database
    const { data: categories } = await supabase
        .from('interest_categories')
        .select('id, key');

    const categoryMap = {};
    for (const cat of categories || []) {
        categoryMap[cat.key] = cat.id;
    }
    console.log('Category map:', categoryMap);

    // Get all careers from database
    const { data: careers } = await supabase
        .from('careers')
        .select('id, title_en, slug');

    // Create lookup by title (case-insensitive, trimmed)
    const careerMap = {};
    for (const career of careers || []) {
        const key = career.title_en.toLowerCase().trim();
        careerMap[key] = career.id;
    }
    console.log(`Loaded ${Object.keys(careerMap).length} careers from database`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const processed = new Set(); // Track unique career-category pairs

    for (const row of rows) {
        const careerTitle = row['Career Title'];
        const dataValue = row['Data Value'];

        if (!careerTitle || dataValue === undefined || dataValue === 0) {
            skipped++;
            continue;
        }

        // Get RIASEC category key
        const categoryKey = RIASEC_MAP[dataValue];
        if (!categoryKey) {
            skipped++;
            continue;
        }

        // Find career ID
        const careerLookupKey = careerTitle.toLowerCase().trim();
        const careerId = careerMap[careerLookupKey];

        if (!careerId) {
            // Try without punctuation
            const cleanKey = careerLookupKey.replace(/[^\w\s]/g, '');
            const matched = Object.keys(careerMap).find(k => k.replace(/[^\w\s]/g, '') === cleanKey);
            if (matched) {
                careerMap[careerLookupKey] = careerMap[matched]; // Cache for future
            } else {
                skipped++;
                continue;
            }
        }

        const categoryId = categoryMap[categoryKey];
        if (!categoryId) {
            console.error(`Category not found for key: ${categoryKey}`);
            errors++;
            continue;
        }

        const finalCareerId = careerMap[careerLookupKey];
        const pairKey = `${finalCareerId}-${categoryId}`;

        // Skip duplicates
        if (processed.has(pairKey)) {
            continue;
        }
        processed.add(pairKey);

        const { error } = await supabase
            .from('career_interest_categories')
            .insert({
                career_id: finalCareerId,
                category_id: categoryId
            });

        if (error) {
            console.error(`Error linking career "${careerTitle}" to ${categoryKey}:`, error.message);
            errors++;
            continue;
        }

        inserted++;

        if (inserted % 200 === 0) {
            console.log(`Inserted ${inserted} mappings...`);
        }
    }

    console.log(`\nCompleted: ${inserted} mappings inserted, ${skipped} skipped, ${errors} errors`);

    // Get final count
    const { count } = await supabase
        .from('career_interest_categories')
        .select('*', { count: 'exact', head: true });
    console.log(`career_interest_categories in database: ${count}`);

    return inserted;
}

// Run if called directly
if (require.main === module) {
    importCareerInterests()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('Import failed:', err);
            process.exit(1);
        });
}

module.exports = { importCareerInterests };
