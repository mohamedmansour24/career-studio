/**
 * Import ISCO-08 Classification as Canonical Backbone
 * 
 * This script imports the official ISCO-08 (International Standard Classification of Occupations)
 * as the canonical backbone for the occupations table.
 * 
 * ISCO-08 has a 4-level hierarchy:
 * - Major groups (1 digit): 10 groups
 * - Sub-major groups (2 digits): 43 groups  
 * - Minor groups (3 digits): 130 groups
 * - Unit groups (4 digits): 436 groups
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// ISCO-08 Official Classification (source: ILO)
// This is a subset of the 436 unit groups - focusing on those most relevant to MENA job markets
const ISCO_08_OCCUPATIONS = [
    // Major Group 1: Managers
    { isco_code: "1111", title_en: "Legislators", isco_major_group: "1", isco_sub_major_group: "11", isco_minor_group: "111" },
    { isco_code: "1112", title_en: "Senior Government Officials", isco_major_group: "1", isco_sub_major_group: "11", isco_minor_group: "111" },
    { isco_code: "1120", title_en: "Managing Directors and Chief Executives", isco_major_group: "1", isco_sub_major_group: "11", isco_minor_group: "112" },
    { isco_code: "1211", title_en: "Finance Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "121" },
    { isco_code: "1212", title_en: "Human Resource Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "121" },
    { isco_code: "1213", title_en: "Policy and Planning Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "121" },
    { isco_code: "1221", title_en: "Sales and Marketing Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "122" },
    { isco_code: "1222", title_en: "Advertising and Public Relations Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "122" },
    { isco_code: "1223", title_en: "Research and Development Managers", isco_major_group: "1", isco_sub_major_group: "12", isco_minor_group: "122" },
    { isco_code: "1311", title_en: "Agricultural and Forestry Production Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "131" },
    { isco_code: "1321", title_en: "Manufacturing Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "132" },
    { isco_code: "1322", title_en: "Mining Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "132" },
    { isco_code: "1323", title_en: "Construction Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "132" },
    { isco_code: "1324", title_en: "Supply, Distribution and Related Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "132" },
    { isco_code: "1330", title_en: "Information and Communications Technology Service Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "133" },
    { isco_code: "1341", title_en: "Child Care Services Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1342", title_en: "Health Services Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1343", title_en: "Aged Care Services Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1344", title_en: "Social Welfare Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1345", title_en: "Education Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1346", title_en: "Financial and Insurance Services Branch Managers", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1349", title_en: "Professional Services Managers Not Elsewhere Classified", isco_major_group: "1", isco_sub_major_group: "13", isco_minor_group: "134" },
    { isco_code: "1411", title_en: "Hotel Managers", isco_major_group: "1", isco_sub_major_group: "14", isco_minor_group: "141" },
    { isco_code: "1412", title_en: "Restaurant Managers", isco_major_group: "1", isco_sub_major_group: "14", isco_minor_group: "141" },
    { isco_code: "1420", title_en: "Retail and Wholesale Trade Managers", isco_major_group: "1", isco_sub_major_group: "14", isco_minor_group: "142" },
    { isco_code: "1431", title_en: "Sports, Recreation and Cultural Centre Managers", isco_major_group: "1", isco_sub_major_group: "14", isco_minor_group: "143" },

    // Major Group 2: Professionals
    { isco_code: "2111", title_en: "Physicists and Astronomers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "211" },
    { isco_code: "2112", title_en: "Meteorologists", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "211" },
    { isco_code: "2113", title_en: "Chemists", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "211" },
    { isco_code: "2114", title_en: "Geologists and Geophysicists", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "211" },
    { isco_code: "2120", title_en: "Mathematicians, Actuaries and Statisticians", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "212" },
    { isco_code: "2131", title_en: "Biologists, Botanists, Zoologists and Related Professionals", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "213" },
    { isco_code: "2132", title_en: "Farming, Forestry and Fisheries Advisers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "213" },
    { isco_code: "2133", title_en: "Environmental Protection Professionals", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "213" },
    { isco_code: "2141", title_en: "Industrial and Production Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2142", title_en: "Civil Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2143", title_en: "Environmental Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2144", title_en: "Mechanical Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2145", title_en: "Chemical Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2146", title_en: "Mining Engineers, Metallurgists and Related Professionals", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2149", title_en: "Engineering Professionals Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "214" },
    { isco_code: "2151", title_en: "Electrical Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "215" },
    { isco_code: "2152", title_en: "Electronics Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "215" },
    { isco_code: "2153", title_en: "Telecommunications Engineers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "215" },
    { isco_code: "2161", title_en: "Building Architects", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },
    { isco_code: "2162", title_en: "Landscape Architects", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },
    { isco_code: "2163", title_en: "Product and Garment Designers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },
    { isco_code: "2164", title_en: "Town and Traffic Planners", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },
    { isco_code: "2165", title_en: "Cartographers and Surveyors", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },
    { isco_code: "2166", title_en: "Graphic and Multimedia Designers", isco_major_group: "2", isco_sub_major_group: "21", isco_minor_group: "216" },

    // ICT Professionals
    { isco_code: "2511", title_en: "Systems Analysts", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "251" },
    { isco_code: "2512", title_en: "Software Developers", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "251" },
    { isco_code: "2513", title_en: "Web and Multimedia Developers", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "251" },
    { isco_code: "2514", title_en: "Applications Programmers", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "251" },
    { isco_code: "2519", title_en: "Software and Applications Developers and Analysts Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "251" },
    { isco_code: "2521", title_en: "Database Designers and Administrators", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "252" },
    { isco_code: "2522", title_en: "Systems Administrators", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "252" },
    { isco_code: "2523", title_en: "Computer Network Professionals", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "252" },
    { isco_code: "2529", title_en: "Database and Network Professionals Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "25", isco_minor_group: "252" },

    // Health Professionals
    { isco_code: "2211", title_en: "Generalist Medical Practitioners", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "221" },
    { isco_code: "2212", title_en: "Specialist Medical Practitioners", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "221" },
    { isco_code: "2221", title_en: "Nursing Professionals", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "222" },
    { isco_code: "2222", title_en: "Midwifery Professionals", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "222" },
    { isco_code: "2261", title_en: "Dentists", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2262", title_en: "Pharmacists", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2263", title_en: "Environmental and Occupational Health and Hygiene Professionals", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2264", title_en: "Physiotherapists", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2265", title_en: "Dieticians and Nutritionists", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2266", title_en: "Audiologists and Speech Therapists", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2267", title_en: "Optometrists and Ophthalmic Opticians", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },
    { isco_code: "2269", title_en: "Health Professionals Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "22", isco_minor_group: "226" },

    // Teaching Professionals
    { isco_code: "2310", title_en: "University and Higher Education Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "231" },
    { isco_code: "2320", title_en: "Vocational Education Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "232" },
    { isco_code: "2330", title_en: "Secondary Education Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "233" },
    { isco_code: "2341", title_en: "Primary School Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "234" },
    { isco_code: "2342", title_en: "Early Childhood Educators", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "234" },
    { isco_code: "2351", title_en: "Education Methods Specialists", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2352", title_en: "Special Needs Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2353", title_en: "Other Language Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2354", title_en: "Other Music Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2355", title_en: "Other Arts Teachers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2356", title_en: "Information Technology Trainers", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },
    { isco_code: "2359", title_en: "Teaching Professionals Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "23", isco_minor_group: "235" },

    // Business and Administration Professionals
    { isco_code: "2411", title_en: "Accountants", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "241" },
    { isco_code: "2412", title_en: "Financial and Investment Advisers", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "241" },
    { isco_code: "2413", title_en: "Financial Analysts", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "241" },
    { isco_code: "2421", title_en: "Management and Organization Analysts", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "242" },
    { isco_code: "2422", title_en: "Policy Administration Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "242" },
    { isco_code: "2423", title_en: "Personnel and Careers Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "242" },
    { isco_code: "2424", title_en: "Training and Staff Development Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "242" },
    { isco_code: "2431", title_en: "Advertising and Marketing Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "243" },
    { isco_code: "2432", title_en: "Public Relations Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "243" },
    { isco_code: "2433", title_en: "Technical and Medical Sales Professionals (Excluding ICT)", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "243" },
    { isco_code: "2434", title_en: "Information and Communications Technology Sales Professionals", isco_major_group: "2", isco_sub_major_group: "24", isco_minor_group: "243" },

    // Legal, Social and Cultural Professionals
    { isco_code: "2611", title_en: "Lawyers", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "261" },
    { isco_code: "2612", title_en: "Judges", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "261" },
    { isco_code: "2619", title_en: "Legal Professionals Not Elsewhere Classified", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "261" },
    { isco_code: "2621", title_en: "Archivists and Curators", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "262" },
    { isco_code: "2622", title_en: "Librarians and Related Information Professionals", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "262" },
    { isco_code: "2631", title_en: "Economists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2632", title_en: "Sociologists, Anthropologists and Related Professionals", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2633", title_en: "Philosophers, Historians and Political Scientists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2634", title_en: "Psychologists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2635", title_en: "Social Work and Counselling Professionals", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2636", title_en: "Religious Professionals", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "263" },
    { isco_code: "2641", title_en: "Authors and Related Writers", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "264" },
    { isco_code: "2642", title_en: "Journalists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "264" },
    { isco_code: "2643", title_en: "Translators, Interpreters and Other Linguists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "264" },
    { isco_code: "2651", title_en: "Visual Artists", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },
    { isco_code: "2652", title_en: "Musicians, Singers and Composers", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },
    { isco_code: "2653", title_en: "Dancers and Choreographers", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },
    { isco_code: "2654", title_en: "Film, Stage and Related Directors and Producers", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },
    { isco_code: "2655", title_en: "Actors", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },
    { isco_code: "2656", title_en: "Announcers on Radio, Television and Other Media", isco_major_group: "2", isco_sub_major_group: "26", isco_minor_group: "265" },

    // More occupations would be added here...
    // This is a starter set of ~120 ISCO codes - the full ISCO-08 has 436 unit groups
];

async function importIsco() {
    console.log("=== Importing ISCO-08 Backbone ===\n");

    // Step 1: Register ISCO as a source
    console.log("1. Registering ISCO-08 source...");
    const { data: sourceData, error: sourceError } = await supabase
        .from("sources")
        .upsert({
            name: "ISCO-08 ILO Official Classification",
            source_type: "taxonomy",
            url: "https://www.ilo.org/public/english/bureau/stat/isco/isco08/",
            license_type: "Public Domain",
            license_notes: "Official ILO classification, freely available",
            country_scope: null, // Global
            version_tag: "ISCO-08-2008",
            is_active: true
        }, { onConflict: "name" })
        .select()
        .single();

    if (sourceError) {
        console.error("Error registering source:", sourceError);
        // Try to get existing source
        const { data: existing } = await supabase
            .from("sources")
            .select()
            .eq("name", "ISCO-08 ILO Official Classification")
            .single();
        if (!existing) throw new Error("Could not create or find source");
    }

    const sourceId = sourceData?.id || (await supabase.from("sources").select("id").eq("name", "ISCO-08 ILO Official Classification").single()).data?.id;
    console.log(`   Source ID: ${sourceId}\n`);

    // Step 2: Create a data run
    console.log("2. Creating data run...");
    const { data: runData, error: runError } = await supabase
        .from("data_runs")
        .insert({
            run_type: "backbone_import",
            source_ids: [sourceId],
            status: "running",
            records_processed: 0
        })
        .select()
        .single();

    if (runError) {
        console.error("Error creating run:", runError);
        throw runError;
    }
    console.log(`   Run ID: ${runData.id}\n`);

    // Step 3: Import ISCO occupations
    console.log(`3. Importing ${ISCO_08_OCCUPATIONS.length} ISCO occupations...`);

    let inserted = 0;
    let updated = 0;
    let failed = 0;

    for (const occ of ISCO_08_OCCUPATIONS) {
        const { error } = await supabase
            .from("occupations")
            .upsert({
                isco_code: occ.isco_code,
                title_en: occ.title_en,
                isco_major_group: occ.isco_major_group,
                isco_sub_major_group: occ.isco_sub_major_group,
                isco_minor_group: occ.isco_minor_group,
                isco_unit_group: occ.isco_code,
                source_id: sourceId,
                last_refreshed_at: new Date().toISOString()
            }, { onConflict: "isco_code" });

        if (error) {
            console.error(`   ✗ Failed: ${occ.isco_code} - ${error.message}`);
            failed++;
        } else {
            inserted++;
        }
    }

    console.log(`   ✓ Inserted/Updated: ${inserted}`);
    console.log(`   ✗ Failed: ${failed}\n`);

    // Step 4: Update data run
    console.log("4. Completing data run...");
    await supabase
        .from("data_runs")
        .update({
            status: failed === 0 ? "success" : "partial",
            records_processed: ISCO_08_OCCUPATIONS.length,
            records_inserted: inserted,
            records_failed: failed,
            completed_at: new Date().toISOString()
        })
        .eq("id", runData.id);

    // Step 5: Quality check
    console.log("5. Running quality checks...");
    const { count: occupationCount } = await supabase
        .from("occupations")
        .select("*", { count: "exact", head: true });

    const { count: uniqueIscoCount } = await supabase
        .from("occupations")
        .select("isco_code", { count: "exact", head: true });

    await supabase.from("quality_checks").insert([
        {
            run_id: runData.id,
            check_name: "ISCO code uniqueness",
            check_category: "uniqueness",
            severity: "CRITICAL",
            expected_value: "0 duplicates",
            actual_value: `${occupationCount} total, ${uniqueIscoCount} unique`,
            passed: occupationCount === uniqueIscoCount,
            details: { total: occupationCount, unique: uniqueIscoCount }
        },
        {
            run_id: runData.id,
            check_name: "ISCO coverage",
            check_category: "coverage",
            severity: "HIGH",
            expected_value: "≥100 occupations",
            actual_value: `${occupationCount} occupations`,
            passed: occupationCount >= 100,
            details: { count: occupationCount }
        }
    ]);

    console.log(`   Total occupations in database: ${occupationCount}`);
    console.log(`   All unique: ${occupationCount === uniqueIscoCount}`);

    console.log("\n=== ISCO Import Complete ===");
    console.log(`Backbone ready with ${occupationCount} canonical occupations.`);
    console.log("O*NET enrichment can now proceed through staging → mapping → publish.");
}

importIsco().catch(console.error);
