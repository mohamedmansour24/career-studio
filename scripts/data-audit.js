/**
 * Data Completeness Audit Script
 * Checks careers and majors for missing data before production launch
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function runAudit() {
    console.log("=== Data Completeness Audit ===");
    console.log("Date:", new Date().toISOString().split("T")[0]);
    console.log("");

    // 1. Career Core Fields Audit
    console.log("## 1. Career Core Fields\n");
    const { data: careers } = await supabase
        .from("careers")
        .select("id, title_en, title_ar, intro_en, intro_ar, description_en, description_ar, mena_relevance")
        .neq("mena_relevance", "us_only");

    const careerStats = {
        total: careers.length,
        missing_ar_title: careers.filter(c => !c.title_ar).length,
        missing_ar_intro: careers.filter(c => !c.intro_ar).length,
        missing_en_desc: careers.filter(c => !c.description_en).length,
        missing_ar_desc: careers.filter(c => !c.description_ar).length,
    };

    console.log(`Total Approved Careers: ${careerStats.total}`);
    console.log(`Missing Arabic Title: ${careerStats.missing_ar_title} (${(careerStats.missing_ar_title / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Missing Arabic Intro: ${careerStats.missing_ar_intro} (${(careerStats.missing_ar_intro / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Missing English Desc: ${careerStats.missing_en_desc} (${(careerStats.missing_en_desc / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Missing Arabic Desc: ${careerStats.missing_ar_desc} (${(careerStats.missing_ar_desc / careerStats.total * 100).toFixed(1)}%)`);

    // 2. Career Related Data
    console.log("\n## 2. Career Related Data\n");

    const { data: tasks } = await supabase.from("career_tasks").select("career_id");
    const { data: skills } = await supabase.from("career_skills").select("career_id");
    const { data: careerMajors } = await supabase.from("career_majors").select("career_id");
    const { data: eduStats } = await supabase.from("career_education_stats").select("career_id");
    const { data: workGlance } = await supabase.from("career_work_glance").select("career_id");

    const careerIds = new Set(careers.map(c => c.id));

    const taskCareerIds = new Set(tasks?.map(t => t.career_id) || []);
    const skillCareerIds = new Set(skills?.map(s => s.career_id) || []);
    const majorCareerIds = new Set(careerMajors?.map(m => m.career_id) || []);
    const eduCareerIds = new Set(eduStats?.map(e => e.career_id) || []);
    const workCareerIds = new Set(workGlance?.map(w => w.career_id) || []);

    const careersWithTasks = [...careerIds].filter(id => taskCareerIds.has(id)).length;
    const careersWithSkills = [...careerIds].filter(id => skillCareerIds.has(id)).length;
    const careersWithMajors = [...careerIds].filter(id => majorCareerIds.has(id)).length;
    const careersWithEdu = [...careerIds].filter(id => eduCareerIds.has(id)).length;
    const careersWithWork = [...careerIds].filter(id => workCareerIds.has(id)).length;

    console.log(`Careers with Tasks: ${careersWithTasks}/${careerStats.total} (${(careersWithTasks / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Careers with Skills: ${careersWithSkills}/${careerStats.total} (${(careersWithSkills / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Careers with Linked Majors: ${careersWithMajors}/${careerStats.total} (${(careersWithMajors / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Careers with Education Stats: ${careersWithEdu}/${careerStats.total} (${(careersWithEdu / careerStats.total * 100).toFixed(1)}%)`);
    console.log(`Careers with Work Glance: ${careersWithWork}/${careerStats.total} (${(careersWithWork / careerStats.total * 100).toFixed(1)}%)`);

    console.log(`\nTotal Tasks: ${tasks?.length || 0}`);
    console.log(`Total Skills Assignments: ${skills?.length || 0}`);
    console.log(`Total Career-Major Links: ${careerMajors?.length || 0}`);

    // 3. Majors Audit
    console.log("\n## 3. Majors Data\n");
    const { data: majors } = await supabase
        .from("majors")
        .select("id, title_en, title_ar, intro_en, intro_ar, description_en, description_ar");

    const majorStats = {
        total: majors?.length || 0,
        missing_ar_title: majors?.filter(m => !m.title_ar).length || 0,
        missing_ar_intro: majors?.filter(m => !m.intro_ar).length || 0,
        missing_en_desc: majors?.filter(m => !m.description_en).length || 0,
        missing_ar_desc: majors?.filter(m => !m.description_ar).length || 0,
    };

    console.log(`Total Majors: ${majorStats.total}`);
    console.log(`Missing Arabic Title: ${majorStats.missing_ar_title} (${majorStats.total > 0 ? (majorStats.missing_ar_title / majorStats.total * 100).toFixed(1) : 0}%)`);
    console.log(`Missing Arabic Intro: ${majorStats.missing_ar_intro} (${majorStats.total > 0 ? (majorStats.missing_ar_intro / majorStats.total * 100).toFixed(1) : 0}%)`);
    console.log(`Missing English Desc: ${majorStats.missing_en_desc} (${majorStats.total > 0 ? (majorStats.missing_en_desc / majorStats.total * 100).toFixed(1) : 0}%)`);

    // 4. Major Related Data
    console.log("\n## 4. Major Related Data\n");
    const { data: majorClasses } = await supabase.from("major_classes").select("major_id");
    const { data: majorSkills } = await supabase.from("major_skills").select("major_id");

    const majorIds = new Set(majors?.map(m => m.id) || []);
    const classesWithMajors = new Set(majorClasses?.map(c => c.major_id) || []);
    const skillsWithMajors = new Set(majorSkills?.map(s => s.major_id) || []);

    const majorsWithClasses = [...majorIds].filter(id => classesWithMajors.has(id)).length;
    const majorsWithSkills = [...majorIds].filter(id => skillsWithMajors.has(id)).length;

    console.log(`Majors with Classes: ${majorsWithClasses}/${majorStats.total} (${majorStats.total > 0 ? (majorsWithClasses / majorStats.total * 100).toFixed(1) : 0}%)`);
    console.log(`Majors with Skills: ${majorsWithSkills}/${majorStats.total} (${majorStats.total > 0 ? (majorsWithSkills / majorStats.total * 100).toFixed(1) : 0}%)`);
    console.log(`Total Major Classes: ${majorClasses?.length || 0}`);

    // 5. Skills Table
    console.log("\n## 5. Skills Table\n");
    const { data: allSkills } = await supabase.from("skills").select("id, name_en, name_ar, type");
    console.log(`Total Skills Defined: ${allSkills?.length || 0}`);
    if (allSkills && allSkills.length > 0) {
        const hardSkills = allSkills.filter(s => s.type === "hard").length;
        const softSkills = allSkills.filter(s => s.type === "soft").length;
        const missingAr = allSkills.filter(s => !s.name_ar).length;
        console.log(`Hard Skills: ${hardSkills}`);
        console.log(`Soft Skills: ${softSkills}`);
        console.log(`Missing Arabic Name: ${missingAr}`);
    }

    // 6. Sample careers with missing data
    console.log("\n## 6. Sample Careers Missing Related Data\n");
    const careersNoTasks = careers.filter(c => !taskCareerIds.has(c.id)).slice(0, 10);
    console.log("First 10 careers without tasks:");
    careersNoTasks.forEach(c => console.log(`  - ${c.title_en}`));

    // Summary
    console.log("\n=== AUDIT SUMMARY ===\n");
    console.log("| Data Type | Has Data | Missing | Coverage |");
    console.log("|-----------|----------|---------|----------|");
    console.log(`| Career Tasks | ${careersWithTasks} | ${careerStats.total - careersWithTasks} | ${(careersWithTasks / careerStats.total * 100).toFixed(1)}% |`);
    console.log(`| Career Skills | ${careersWithSkills} | ${careerStats.total - careersWithSkills} | ${(careersWithSkills / careerStats.total * 100).toFixed(1)}% |`);
    console.log(`| Career-Major Links | ${careersWithMajors} | ${careerStats.total - careersWithMajors} | ${(careersWithMajors / careerStats.total * 100).toFixed(1)}% |`);
    console.log(`| Arabic Titles | ${careerStats.total - careerStats.missing_ar_title} | ${careerStats.missing_ar_title} | ${((careerStats.total - careerStats.missing_ar_title) / careerStats.total * 100).toFixed(1)}% |`);
    console.log(`| Arabic Intros | ${careerStats.total - careerStats.missing_ar_intro} | ${careerStats.missing_ar_intro} | ${((careerStats.total - careerStats.missing_ar_intro) / careerStats.total * 100).toFixed(1)}% |`);

    console.log("\n=== RECOMMENDED IMPORT PRIORITY ===");
    console.log("1. [P0] Tasks - Critical for user understanding");
    console.log("2. [P0] Skills - Critical for career matching");
    console.log("3. [P1] Career-Major Links - Important for navigation");
    console.log("4. [P2] Arabic Translations - Important for bilingual");
    console.log("5. [P3] Education Stats - Nice to have");
}

runAudit().catch(console.error);
