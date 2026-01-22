/**
 * Import tasks from Career Profiles 2.xlsx
 * Tasks are newline-separated in the 'tasks' column
 */

const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const CAREERS_FILE = '/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/Career Profiles 2.xlsx';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function importTasks() {
    console.log('Reading careers file...');
    const workbook = XLSX.readFile(CAREERS_FILE);
    const sheet = workbook.Sheets['Sheet1'];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} careers`);

    let totalTasks = 0;
    let careersWithTasks = 0;

    for (const row of rows) {
        const title = row['title'];
        const tasksRaw = row['tasks'];

        if (!title || !tasksRaw) continue;

        // Get career ID by title
        const { data: career } = await supabase
            .from('careers')
            .select('id')
            .eq('title_en', title)
            .single();

        if (!career) {
            // console.log(`Career not found: ${title}`);
            continue;
        }

        // Split tasks by newline
        const tasks = tasksRaw
            .split('\n')
            .map(t => t.trim())
            .filter(t => t.length > 5);

        if (tasks.length === 0) continue;

        careersWithTasks++;

        // Insert tasks
        for (let i = 0; i < tasks.length && i < 15; i++) {
            const { error } = await supabase.from('career_tasks').insert({
                career_id: career.id,
                title_en: tasks[i],
                order_index: i
            });

            if (!error) totalTasks++;
        }

        if (careersWithTasks % 100 === 0) {
            console.log(`Processed ${careersWithTasks} careers, ${totalTasks} tasks...`);
        }
    }

    console.log(`\nCompleted: ${totalTasks} tasks imported for ${careersWithTasks} careers`);

    // Verify
    const { count } = await supabase.from('career_tasks').select('*', { count: 'exact', head: true });
    console.log('Tasks in database:', count);
}

importTasks().catch(console.error);
