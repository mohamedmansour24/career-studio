#!/usr/bin/env node
/**
 * Import major-interest category mappings
 * Strategy: Derive from the "Typical Careers" column in the Majors sheet
 * and map to interest categories via career_interest_categories
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

// File path
const MAJORS_FILE = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/Career Profiles.xlsx';

async function importMajorInterests() {
    console.log('Reading majors data...');

    const workbook = XLSX.readFile(MAJORS_FILE);

    // Note: sheet name has trailing space
    if (!workbook.SheetNames.includes('Majors ')) {
        console.error('Majors sheet not found!');
        process.exit(1);
    }

    const sheet = workbook.Sheets['Majors '];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} major rows`);

    // Get all interest categories from database
    const { data: categories } = await supabase
        .from('interest_categories')
        .select('id, key');

    const categoryMap = {};
    for (const cat of categories || []) {
        categoryMap[cat.key] = cat.id;
    }
    console.log('Categories:', Object.keys(categoryMap));

    // Get all majors from database
    const { data: majors } = await supabase
        .from('majors')
        .select('id, title_en');

    // Create lookup by title (case-insensitive, trimmed)
    const majorMap = {};
    for (const major of majors || []) {
        const key = major.title_en.toLowerCase().trim();
        majorMap[key] = major.id;
    }
    console.log(`Loaded ${Object.keys(majorMap).length} majors from database`);

    // Get all career-interest mappings to derive major interests
    const { data: careerInterests } = await supabase
        .from('career_interest_categories')
        .select('career_id, category_id');

    // Build career -> category lookup
    const careerCategoryMap = {};
    for (const ci of careerInterests || []) {
        if (!careerCategoryMap[ci.career_id]) {
            careerCategoryMap[ci.career_id] = new Set();
        }
        careerCategoryMap[ci.career_id].add(ci.category_id);
    }

    // Get all careers for title matching
    const { data: careers } = await supabase
        .from('careers')
        .select('id, title_en');

    const careerByTitle = {};
    for (const career of careers || []) {
        const key = career.title_en.toLowerCase().trim();
        careerByTitle[key] = career.id;
    }

    let inserted = 0;
    let skipped = 0;
    const processed = new Set();

    for (const row of rows) {
        const majorName = (row['Name '] || row['Name'] || '').toString().trim();
        const typicalCareers = (row['Typical Careers'] || '').toString();

        if (!majorName) {
            skipped++;
            continue;
        }

        // Find major ID
        const majorLookupKey = majorName.toLowerCase().trim();
        const majorId = majorMap[majorLookupKey];

        if (!majorId) {
            skipped++;
            continue;
        }

        // Extract career names from "Typical Careers" column
        // Split by newlines, commas, and common separators
        const careerNames = typicalCareers
            .split(/[\n,;]+/)
            .map(s => s.replace(/^[-•*]\s*/, '').trim())
            .filter(s => s.length > 3);

        // Find matching careers and their interest categories
        const categoryIds = new Set();

        for (const careerName of careerNames) {
            const careerKey = careerName.toLowerCase().trim();

            // Try exact match first, then partial match
            let careerId = careerByTitle[careerKey];

            if (!careerId) {
                // Try partial match
                const matched = Object.keys(careerByTitle).find(k =>
                    k.includes(careerKey) || careerKey.includes(k)
                );
                if (matched) {
                    careerId = careerByTitle[matched];
                }
            }

            if (careerId && careerCategoryMap[careerId]) {
                for (const catId of careerCategoryMap[careerId]) {
                    categoryIds.add(catId);
                }
            }
        }

        // If no categories found from careers, assign to a default category based on name
        if (categoryIds.size === 0) {
            // Simple heuristics based on major name
            const name = majorName.toLowerCase();
            if (name.includes('art') || name.includes('design') || name.includes('music') || name.includes('theater')) {
                categoryIds.add(categoryMap['artistic']);
            } else if (name.includes('social') || name.includes('education') || name.includes('psychology') || name.includes('nursing')) {
                categoryIds.add(categoryMap['social']);
            } else if (name.includes('business') || name.includes('management') || name.includes('marketing') || name.includes('entrepreneur')) {
                categoryIds.add(categoryMap['enterprising']);
            } else if (name.includes('science') || name.includes('research') || name.includes('biology') || name.includes('chemistry') || name.includes('physics')) {
                categoryIds.add(categoryMap['investigative']);
            } else if (name.includes('accounting') || name.includes('finance') || name.includes('admin')) {
                categoryIds.add(categoryMap['conventional']);
            } else if (name.includes('engineering') || name.includes('mechanic') || name.includes('technical')) {
                categoryIds.add(categoryMap['realistic']);
            } else {
                // Default to investigative for academic majors
                categoryIds.add(categoryMap['investigative']);
            }
        }

        // Insert mappings for this major
        for (const categoryId of categoryIds) {
            const pairKey = `${majorId}-${categoryId}`;

            if (processed.has(pairKey)) {
                continue;
            }
            processed.add(pairKey);

            const { error } = await supabase
                .from('major_interest_categories')
                .insert({
                    major_id: majorId,
                    category_id: categoryId
                });

            if (error) {
                console.error(`Error linking major "${majorName}" to category:`, error.message);
                continue;
            }

            inserted++;
        }

        if (inserted > 0 && inserted % 100 === 0) {
            console.log(`Inserted ${inserted} mappings...`);
        }
    }

    console.log(`\nCompleted: ${inserted} mappings inserted, ${skipped} majors skipped`);

    // Get final count
    const { count } = await supabase
        .from('major_interest_categories')
        .select('*', { count: 'exact', head: true });
    console.log(`major_interest_categories in database: ${count}`);

    return inserted;
}

// Run if called directly
if (require.main === module) {
    importMajorInterests()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('Import failed:', err);
            process.exit(1);
        });
}

module.exports = { importMajorInterests };
