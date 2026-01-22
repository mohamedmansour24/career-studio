/**
 * O*NET Enrichment Pipeline - Stage 1 & 2: Acquire & Stage
 * 
 * This script loads O*NET data into staging tables using RPC helper functions.
 * It does NOT publish to public tables - that requires mapping review.
 * 
 * Pipeline: Acquire → Stage → Map → Publish
 * This script handles: Acquire + Stage
 */
const { createClient } = require("@supabase/supabase-js");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const ONET_DATA_PATH = "/Users/mohamedmansour/PARA/Projects/Dori/db_27_1_excel";

async function acquireAndStage() {
    console.log("=== O*NET Enrichment Pipeline: Acquire & Stage ===\n");

    // Step 1: ACQUIRE - Register O*NET as an enrichment source
    console.log("STAGE 1: ACQUIRE\n");
    console.log("1.1 Registering O*NET source...");

    const { data: sourceData, error: sourceError } = await supabase
        .from("sources")
        .upsert({
            name: "O*NET Database 27.1",
            source_type: "enrichment",
            url: "https://www.onetcenter.org/database.html",
            license_type: "CC BY-NC-SA 4.0",
            license_notes: "US-origin enrichment data, non-commercial use",
            country_scope: ["US"],
            version_tag: "27.1",
            snapshot_path: ONET_DATA_PATH,
            retrieved_at: new Date().toISOString(),
            is_active: true
        }, { onConflict: "name" })
        .select()
        .single();

    if (sourceError) {
        console.error("Error registering source:", sourceError);
        throw sourceError;
    }

    const sourceId = sourceData.id;
    console.log(`    Source ID: ${sourceId}`);
    console.log(`    Country scope: US (enrichment only)\n`);

    // Step 1.2: Create data run
    console.log("1.2 Creating data run...");
    const { data: runData } = await supabase
        .from("data_runs")
        .insert({
            run_type: "enrichment_import",
            source_ids: [sourceId],
            status: "running",
            records_processed: 0
        })
        .select()
        .single();

    console.log(`    Run ID: ${runData.id}\n`);

    // Step 2: STAGE - Load O*NET files into staging tables
    console.log("STAGE 2: STAGE (Load into staging.*)\n");

    const stats = {
        occupations: { loaded: 0, failed: 0 },
        tasks: { loaded: 0, failed: 0 },
        elements: { loaded: 0, failed: 0 },
        interests: { loaded: 0, failed: 0 }
    };

    // Clear staging tables first
    console.log("2.0 Clearing staging tables...");
    await supabase.rpc("truncate_staging").catch(e => console.log("    Note: truncate_staging not available, tables may have existing data"));

    // 2.1 Load Occupations
    console.log("2.1 Loading occupations...");
    const occFile = path.join(ONET_DATA_PATH, "Occupation Data.xlsx");
    if (fs.existsSync(occFile)) {
        const workbook = XLSX.readFile(occFile);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const occupations = data.map(row => ({
            code: row["O*NET-SOC Code"],
            title: row["Title"],
            desc: row["Description"]
        })).filter(o => o.code);

        console.log(`    Found ${occupations.length} occupations in file`);

        // Insert using RPC helper (batched manually)
        for (const occ of occupations) {
            const { error } = await supabase.rpc("insert_staging_occupation", {
                p_code: occ.code,
                p_title: occ.title,
                p_desc: occ.desc || null
            });
            if (error) {
                stats.occupations.failed++;
            } else {
                stats.occupations.loaded++;
            }
        }
        console.log(`    ✓ Loaded ${stats.occupations.loaded} occupations, ${stats.occupations.failed} failed`);
    } else {
        console.log(`    ✗ File not found: ${occFile}`);
    }

    // 2.2 Load Tasks
    console.log("2.2 Loading tasks...");
    const taskFile = path.join(ONET_DATA_PATH, "Task Statements.xlsx");
    if (fs.existsSync(taskFile)) {
        const workbook = XLSX.readFile(taskFile);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const tasks = data.map(row => ({
            code: row["O*NET-SOC Code"],
            task_id: row["Task ID"] ? parseInt(row["Task ID"]) : null,
            text: row["Task"],
            type: row["Task Type"] || "Core"
        })).filter(t => t.code && t.text);

        console.log(`    Found ${tasks.length} tasks in file`);

        // Insert in batches to be faster
        let batchCount = 0;
        for (const task of tasks) {
            const { error } = await supabase.rpc("insert_staging_task", {
                p_code: task.code,
                p_task_id: task.task_id,
                p_text: task.text,
                p_type: task.type
            });
            if (error) {
                stats.tasks.failed++;
            } else {
                stats.tasks.loaded++;
            }
            batchCount++;
            if (batchCount % 1000 === 0) {
                console.log(`    ... ${batchCount} tasks processed`);
            }
        }
        console.log(`    ✓ Loaded ${stats.tasks.loaded} tasks, ${stats.tasks.failed} failed`);
    } else {
        console.log(`    ✗ File not found: ${taskFile}`);
    }

    // 2.3 Load Elements (Skills/Knowledge/Abilities)
    console.log("2.3 Loading skill elements...");
    const elementFiles = [
        { file: "Content Model Reference.xlsx", type: null }  // Contains all element definitions
    ];

    const cmrFile = path.join(ONET_DATA_PATH, "Content Model Reference.xlsx");
    if (fs.existsSync(cmrFile)) {
        const workbook = XLSX.readFile(cmrFile);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Filter to skills, knowledge, abilities (1.A, 2.A, etc)
        const elements = data.filter(row => {
            const id = row["Element ID"];
            return id && (id.startsWith("1.A") || id.startsWith("2.A") || id.startsWith("2.B") || id.startsWith("2.C"));
        }).map(row => {
            const id = row["Element ID"];
            let type = "skill";
            if (id.startsWith("2.C")) type = "knowledge";
            else if (id.startsWith("1.A")) type = "ability";

            return {
                id: id,
                name: row["Element Name"],
                type: type,
                desc: row["Description"]
            };
        });

        console.log(`    Found ${elements.length} elements in file`);

        for (const elem of elements) {
            const { error } = await supabase.rpc("insert_staging_element", {
                p_id: elem.id,
                p_name: elem.name,
                p_type: elem.type,
                p_desc: elem.desc || null
            });
            if (error) {
                stats.elements.failed++;
            } else {
                stats.elements.loaded++;
            }
        }
        console.log(`    ✓ Loaded ${stats.elements.loaded} elements, ${stats.elements.failed} failed`);
    } else {
        console.log(`    ✗ File not found: ${cmrFile}`);
    }

    // 2.4 Load Interests
    console.log("2.4 Loading interests...");
    const interestFile = path.join(ONET_DATA_PATH, "Interests.xlsx");
    if (fs.existsSync(interestFile)) {
        const workbook = XLSX.readFile(interestFile);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Map O*NET interest elements to RIASEC keys
        const interestKeyMap = {
            "1.B.1.a": "realistic",
            "1.B.1.b": "investigative",
            "1.B.1.c": "artistic",
            "1.B.1.d": "social",
            "1.B.1.e": "enterprising",
            "1.B.1.f": "conventional"
        };

        const interests = data
            .filter(row => row["Element ID"] && interestKeyMap[row["Element ID"]] && row["Scale ID"] === "OI")
            .map(row => ({
                code: row["O*NET-SOC Code"],
                key: interestKeyMap[row["Element ID"]],
                value: parseFloat(row["Data Value"] || 0),
                date: row["Date"] || null
            }))
            .filter(i => i.code && i.key);

        console.log(`    Found ${interests.length} interest ratings in file`);

        let batchCount = 0;
        for (const interest of interests) {
            const { error } = await supabase.rpc("insert_staging_interest", {
                p_code: interest.code,
                p_key: interest.key,
                p_value: interest.value,
                p_date: interest.date
            });
            if (error) {
                stats.interests.failed++;
            } else {
                stats.interests.loaded++;
            }
            batchCount++;
            if (batchCount % 1000 === 0) {
                console.log(`    ... ${batchCount} interests processed`);
            }
        }
        console.log(`    ✓ Loaded ${stats.interests.loaded} interests, ${stats.interests.failed} failed`);
    } else {
        console.log(`    ✗ File not found: ${interestFile}`);
    }

    // Step 3: Update data run and log quality metrics
    console.log("\n3. Completing data run...");

    const totalLoaded = stats.occupations.loaded + stats.tasks.loaded +
        stats.elements.loaded + stats.interests.loaded;
    const totalFailed = stats.occupations.failed + stats.tasks.failed +
        stats.elements.failed + stats.interests.failed;

    await supabase
        .from("data_runs")
        .update({
            status: totalFailed === 0 ? "success" : "partial",
            records_processed: totalLoaded + totalFailed,
            records_inserted: totalLoaded,
            records_failed: totalFailed,
            completed_at: new Date().toISOString()
        })
        .eq("id", runData.id);

    // Log quality checks
    console.log("4. Logging quality checks...");
    await supabase.from("quality_checks").insert([
        {
            run_id: runData.id,
            check_name: "O*NET occupations staged",
            check_category: "coverage",
            severity: "HIGH",
            expected_value: "≥900 occupations",
            actual_value: `${stats.occupations.loaded} occupations`,
            passed: stats.occupations.loaded >= 900,
            details: stats.occupations
        },
        {
            run_id: runData.id,
            check_name: "O*NET tasks staged",
            check_category: "coverage",
            severity: "MEDIUM",
            expected_value: "≥15000 tasks",
            actual_value: `${stats.tasks.loaded} tasks`,
            passed: stats.tasks.loaded >= 15000,
            details: stats.tasks
        },
        {
            run_id: runData.id,
            check_name: "O*NET elements staged",
            check_category: "coverage",
            severity: "MEDIUM",
            expected_value: "≥100 elements",
            actual_value: `${stats.elements.loaded} elements`,
            passed: stats.elements.loaded >= 100,
            details: stats.elements
        }
    ]);

    console.log("\n=== Staging Summary ===");
    console.log(`Occupations: ${stats.occupations.loaded} loaded, ${stats.occupations.failed} failed`);
    console.log(`Tasks: ${stats.tasks.loaded} loaded, ${stats.tasks.failed} failed`);
    console.log(`Elements: ${stats.elements.loaded} loaded, ${stats.elements.failed} failed`);
    console.log(`Interests: ${stats.interests.loaded} loaded, ${stats.interests.failed} failed`);
    console.log(`Total: ${totalLoaded} loaded, ${totalFailed} failed`);

    console.log("\n=== NEXT STEP ===");
    console.log("Run the O*NET → ISCO mapping script to propose mappings.");
    console.log("Only after mappings are approved can enrichment be published to public.*");
}

acquireAndStage().catch(console.error);
