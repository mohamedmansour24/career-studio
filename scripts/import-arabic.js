#!/usr/bin/env node
/**
 * Import Arabic content for careers and tasks from Job activities.xlsx
 * Updates title_ar and description_ar for careers, and title_ar for tasks
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
const ARABIC_FILE = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/Job activities.xlsx';

async function importArabicContent() {
    console.log('Reading Arabic content...');

    const workbook = XLSX.readFile(ARABIC_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // 'English ' sheet has all data
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} rows with Arabic content`);

    // Get all careers from database
    const { data: careers } = await supabase
        .from('careers')
        .select('id, title_en');

    // Create lookup by title (case-insensitive, trimmed)
    const careerMap = {};
    for (const career of careers || []) {
        const key = career.title_en.toLowerCase().trim();
        careerMap[key] = career.id;
    }
    console.log(`Loaded ${Object.keys(careerMap).length} careers from database`);

    let careersUpdated = 0;
    let tasksUpdated = 0;
    let errors = 0;

    for (const row of rows) {
        const englishTitle = (row['Job Title'] || '').toString().trim();
        const arabicTitle = (row['Ar- Job title '] || row['Ar- Job title'] || '').toString().trim();
        const arabicActivities = (row['Ar- Job Activities'] || '').toString().trim();

        if (!englishTitle || !arabicTitle) {
            continue;
        }

        // Find career ID
        const careerLookupKey = englishTitle.toLowerCase().trim();
        let careerId = careerMap[careerLookupKey];

        if (!careerId) {
            // Try partial match
            const matched = Object.keys(careerMap).find(k =>
                k.includes(careerLookupKey) || careerLookupKey.includes(k)
            );
            if (matched) {
                careerId = careerMap[matched];
            }
        }

        if (!careerId) {
            continue;
        }

        // Update career with Arabic title
        const { error: careerError } = await supabase
            .from('careers')
            .update({ title_ar: arabicTitle })
            .eq('id', careerId);

        if (careerError) {
            console.error(`Error updating career "${englishTitle}":`, careerError.message);
            errors++;
            continue;
        }
        careersUpdated++;

        // Update tasks with Arabic content
        if (arabicActivities) {
            const arabicTasksList = arabicActivities
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            // Get existing tasks for this career
            const { data: existingTasks } = await supabase
                .from('career_tasks')
                .select('id, title_en')
                .eq('career_id', careerId)
                .order('order_index', { ascending: true });

            // Match Arabic tasks to English tasks by order
            if (existingTasks && existingTasks.length > 0) {
                for (let i = 0; i < Math.min(existingTasks.length, arabicTasksList.length); i++) {
                    const { error: taskError } = await supabase
                        .from('career_tasks')
                        .update({ title_ar: arabicTasksList[i] })
                        .eq('id', existingTasks[i].id);

                    if (!taskError) {
                        tasksUpdated++;
                    }
                }
            }
        }

        if (careersUpdated % 50 === 0) {
            console.log(`Updated ${careersUpdated} careers, ${tasksUpdated} tasks...`);
        }
    }

    console.log(`\nCompleted: ${careersUpdated} careers updated, ${tasksUpdated} tasks updated, ${errors} errors`);

    // Verify Arabic content
    const { data: sampleCareer } = await supabase
        .from('careers')
        .select('title_en, title_ar')
        .not('title_ar', 'is', null)
        .limit(3);
    console.log('\nSample careers with Arabic titles:', sampleCareer);

    return { careersUpdated, tasksUpdated };
}

// Run if called directly
if (require.main === module) {
    importArabicContent()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('Import failed:', err);
            process.exit(1);
        });
}

module.exports = { importArabicContent };
