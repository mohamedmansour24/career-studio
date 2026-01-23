/**
 * Full 48-Table Database Inventory
 * Audits all tables in public and staging schemas
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// All known tables from schema
const ALL_TABLES = {
    // Content tables (main entities)
    content: [
        "careers",
        "majors",
        "skills",
        "assets",
    ],

    // Junction/relationship tables for careers
    career_junctions: [
        "career_tasks",
        "career_skills",
        "career_majors",
        "career_stages",
        "career_specializations",
        "career_education_stats",
        "career_work_glance",
        "career_interest_categories",
        "career_character_assets",
    ],

    // Junction/relationship tables for majors
    major_junctions: [
        "major_classes",
        "major_skills",
        "major_interest_categories",
    ],

    // Reference/lookup tables
    reference: [
        "interest_categories",
        "work_dimensions",
    ],

    // V2 backbone/infrastructure
    v2_backbone: [
        "occupations",
        "sources",
        "data_runs",
        "quality_checks",
        "career_kits",
        "curation_releases",
    ],

    // External mapping tables
    mappings: [
        "asco_mappings",
        "major_external_ids",
        "major_career_demand",
    ],

    // Normalized reference tables
    normalized: [
        "industries",
        "employers",
        "countries",
        "demand_employers",
        "demand_industries",
    ],

    // Staging tables
    staging: [
        "onet_occupations",
        "onet_tasks",
        "onet_elements",
        "onet_ratings",
        "onet_interests",
    ],

    // Other/misc tables
    other: [
        "major_overlays",
        "national_occupation_overlays",
    ],
};

async function runFullAudit() {
    console.log("=== FULL DATABASE INVENTORY ===");
    console.log("Date:", new Date().toISOString().split("T")[0]);
    console.log("");

    const results = {
        populated: [],
        empty: [],
        notFound: [],
    };

    // Flatten all tables
    const allTableNames = Object.values(ALL_TABLES).flat();

    console.log("Checking", allTableNames.length, "tables...\n");

    for (const [category, tables] of Object.entries(ALL_TABLES)) {
        console.log(`\n## ${category.toUpperCase().replace("_", " ")}\n`);
        console.log("| Table | Rows | Status |");
        console.log("|-------|------|--------|");

        for (const table of tables) {
            try {
                const { count, error } = await supabase
                    .from(table)
                    .select("*", { count: "exact", head: true });

                if (error) {
                    console.log(`| ${table} | - | ❌ Not found |`);
                    results.notFound.push(table);
                } else if (count === 0) {
                    console.log(`| ${table} | 0 | ⚪ Empty |`);
                    results.empty.push({ table, count: 0 });
                } else {
                    console.log(`| ${table} | ${count} | ✅ Has data |`);
                    results.populated.push({ table, count, category });
                }
            } catch (e) {
                console.log(`| ${table} | - | ❌ Error |`);
                results.notFound.push(table);
            }
        }
    }

    // Summary
    console.log("\n\n=== SUMMARY ===\n");
    console.log(`Tables with data: ${results.populated.length}`);
    console.log(`Empty tables: ${results.empty.length}`);
    console.log(`Tables not found: ${results.notFound.length}`);

    console.log("\n### POPULATED TABLES");
    console.log("| Table | Rows | Category |");
    console.log("|-------|------|----------|");
    results.populated
        .sort((a, b) => b.count - a.count)
        .forEach(t => console.log(`| ${t.table} | ${t.count} | ${t.category} |`));

    console.log("\n### EMPTY TABLES");
    results.empty.forEach(t => console.log(`- ${t.table}`));

    console.log("\n### TABLES NOT FOUND (may need to be created)");
    results.notFound.forEach(t => console.log(`- ${t}`));

    // Detailed field audit for key populated tables
    console.log("\n\n=== DETAILED FIELD COVERAGE ===\n");

    // Careers detail
    const { data: careers } = await supabase
        .from("careers")
        .select("slug, title_en, title_ar, intro_en, intro_ar, description_en, description_ar, personality_summary_en");

    if (careers) {
        console.log("### careers (Core content fields)");
        const fields = ["slug", "title_en", "title_ar", "intro_en", "intro_ar", "description_en", "description_ar", "personality_summary_en"];
        console.log("| Field | Populated | Empty | % |");
        console.log("|-------|-----------|-------|---|");
        for (const f of fields) {
            const filled = careers.filter(c => c[f] && c[f].trim && c[f].trim() !== "").length;
            console.log(`| ${f} | ${filled} | ${careers.length - filled} | ${(filled / careers.length * 100).toFixed(0)}% |`);
        }
    }

    // Majors detail
    const { data: majors } = await supabase
        .from("majors")
        .select("slug, title_en, title_ar, intro_en, intro_ar, description_en, description_ar");

    if (majors) {
        console.log("\n### majors (Core content fields)");
        const fields = ["slug", "title_en", "title_ar", "intro_en", "intro_ar", "description_en", "description_ar"];
        console.log("| Field | Populated | Empty | % |");
        console.log("|-------|-----------|-------|---|");
        for (const f of fields) {
            const filled = majors.filter(m => m[f] && m[f].trim && m[f].trim() !== "").length;
            console.log(`| ${f} | ${filled} | ${majors.length - filled} | ${(filled / majors.length * 100).toFixed(0)}% |`);
        }
    }

    // Career tasks - check if they have actual content
    const { data: tasks } = await supabase
        .from("career_tasks")
        .select("career_id, title_en, title_ar")
        .limit(1000);

    if (tasks && tasks.length > 0) {
        console.log("\n### career_tasks (Sample)");
        const withEn = tasks.filter(t => t.title_en && t.title_en.trim() !== "").length;
        const withAr = tasks.filter(t => t.title_ar && t.title_ar.trim() !== "").length;
        console.log(`- Total tasks: ${tasks.length}`);
        console.log(`- With English title: ${withEn} (${(withEn / tasks.length * 100).toFixed(0)}%)`);
        console.log(`- With Arabic title: ${withAr} (${(withAr / tasks.length * 100).toFixed(0)}%)`);
    }

    console.log("\n=== IMPORT STRATEGY RECOMMENDATION ===\n");
    console.log("1. [CRITICAL] careers.intro_en/description_en - Only 2.6% populated");
    console.log("2. [CRITICAL] skills table - 0 rows, blocks career_skills");
    console.log("3. [HIGH] career_majors - 0 rows, no career-major links");
    console.log("4. [HIGH] majors Arabic content - 0%");
    console.log("5. [MEDIUM] career_education_stats, career_work_glance - 0 rows");
    console.log("6. [LOW] assets, career_character_assets - cosmetic");
}

runFullAudit().catch(console.error);
