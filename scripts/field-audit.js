/**
 * Detailed Field-Level Audit for Careers Table
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function auditCareers() {
    console.log("=== Careers Table Field-Level Audit ===\n");

    const { data: careers, error } = await supabase
        .from("careers")
        .select("*")
        .neq("mena_relevance", "us_only");

    if (error) {
        console.log("Error:", error);
        return;
    }

    const total = careers.length;
    console.log("Total approved careers:", total);
    console.log("");

    // Check each field
    const fields = [
        "slug",
        "title_en",
        "title_ar",
        "intro_en",
        "intro_ar",
        "description_en",
        "description_ar",
        "personality_summary_en",
        "personality_summary_ar",
        "background_asset_id",
        "occupation_id",
        "content_status",
        "content_confidence",
        "mena_relevance",
        "mena_notes",
    ];

    console.log("| Field | Has Data | Empty/Null | Coverage |");
    console.log("|-------|----------|------------|----------|");

    for (const field of fields) {
        const hasData = careers.filter(c => {
            const val = c[field];
            if (val === null || val === undefined) return false;
            if (typeof val === "string" && val.trim() === "") return false;
            return true;
        }).length;

        const empty = total - hasData;
        const coverage = ((hasData / total) * 100).toFixed(1);

        console.log(`| ${field} | ${hasData} | ${empty} | ${coverage}% |`);
    }

    // Sample a career with data
    console.log("\n=== Sample Career (first with title_en) ===");
    const sample = careers.find(c => c.title_en);
    if (sample) {
        console.log("Title:", sample.title_en);
        console.log("Slug:", sample.slug);
        console.log("Intro EN:", sample.intro_en ? sample.intro_en.substring(0, 100) + "..." : "(empty)");
        console.log("Intro AR:", sample.intro_ar || "(empty)");
        console.log("Description EN:", sample.description_en ? sample.description_en.substring(0, 100) + "..." : "(empty)");
        console.log("Personality EN:", sample.personality_summary_en || "(empty)");
    }

    // Check majors too
    console.log("\n=== Majors Table Field-Level Audit ===\n");
    const { data: majors } = await supabase.from("majors").select("*");

    if (majors) {
        const mTotal = majors.length;
        console.log("Total majors:", mTotal);
        console.log("");

        const mFields = ["slug", "title_en", "title_ar", "intro_en", "intro_ar", "description_en", "description_ar"];

        console.log("| Field | Has Data | Empty/Null | Coverage |");
        console.log("|-------|----------|------------|----------|");

        for (const field of mFields) {
            const hasData = majors.filter(m => {
                const val = m[field];
                if (val === null || val === undefined) return false;
                if (typeof val === "string" && val.trim() === "") return false;
                return true;
            }).length;

            const empty = mTotal - hasData;
            const coverage = ((hasData / mTotal) * 100).toFixed(1);

            console.log(`| ${field} | ${hasData} | ${empty} | ${coverage}% |`);
        }
    }
}

auditCareers().catch(console.error);
