/**
 * Quick table count script
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const tables = [
    "careers", "majors", "skills", "assets",
    "interest_categories", "work_dimensions",
    "career_tasks", "career_skills", "career_majors",
    "career_stages", "career_specializations",
    "career_education_stats", "career_work_glance",
    "career_interest_categories", "career_character_assets",
    "major_classes", "major_skills", "major_interest_categories",
    "sources", "data_runs", "quality_checks", "occupations"
];

async function listTables() {
    console.log("=== Tables in Supabase ===\n");
    let found = 0;
    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });
        if (error) {
            console.log(table + ": (table not found)");
        } else {
            console.log(table + ": " + count + " rows");
            found++;
        }
    }
    console.log("\nTotal tables found: " + found);
}

listTables();
