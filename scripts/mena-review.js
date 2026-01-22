/**
 * MENA Content Validation Script
 * 
 * Reviews all 761 careers and categorizes them for MENA relevance:
 * - universal: Career exists globally with same core function
 * - adapted: Career exists but needs MENA context/notes
 * - us_only: Career doesn't exist or apply in MENA
 * - pending: Needs expert review
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Known US-only careers (don't exist in MENA)
const US_ONLY_PATTERNS = [
    // US Healthcare specific
    /physician assistant/i,
    /chiropractor/i,
    /nurse practitioner/i,
    /nurse anesthetist/i,
    /certified nursing assistant/i,
    /licensed practical nurse/i,
    /home health aide/i,
    /medicare/i,
    /medicaid/i,

    // US Government/Law Enforcement
    /corrections officer/i,
    /correctional/i,
    /state trooper/i,
    /sheriff/i,
    /deputy/i,
    /bailiff/i,
    /probation officer/i,
    /parole officer/i,
    /border patrol/i,
    /customs officer/i,
    /tsa/i,
    /irs agent/i,
    /irs/i,
    /social security/i,
    /postal service/i,
    /usps/i,

    // US Military specific
    /military/i,
    /army/i,
    /navy/i,
    /air force/i,
    /marine/i,
    /coast guard/i,
    /national guard/i,

    // US Legal system specific
    /public defender/i,
    /district attorney/i,
    /state attorney/i,
    /immigration judge/i,

    // US Education specific
    /school counselor/i, // Different role in MENA

    // US specific trades/roles
    /union/i,
];

// Universal careers (exist globally)
const UNIVERSAL_PATTERNS = [
    // Engineering
    /software engineer/i,
    /software developer/i,
    /civil engineer/i,
    /mechanical engineer/i,
    /electrical engineer/i,
    /chemical engineer/i,
    /industrial engineer/i,
    /petroleum engineer/i,
    /aerospace engineer/i,
    /biomedical engineer/i,
    /environmental engineer/i,
    /architect/i,

    // IT/Tech
    /data scientist/i,
    /data analyst/i,
    /web developer/i,
    /network administrator/i,
    /database administrator/i,
    /cybersecurity/i,
    /information security/i,
    /it manager/i,
    /systems analyst/i,
    /ux designer/i,
    /ui designer/i,
    /graphic designer/i,
    /mobile developer/i,
    /devops/i,
    /cloud/i,

    // Healthcare (doctors/nurses exist globally)
    /physician/i,
    /doctor/i,
    /surgeon/i,
    /dentist/i,
    /pharmacist/i,
    /nurse(?! practitioner| anesthetist)/i,
    /registered nurse/i,
    /radiologist/i,
    /anesthesiologist/i,
    /cardiologist/i,
    /dermatologist/i,
    /pediatrician/i,
    /psychiatrist/i,
    /psychologist/i,
    /physical therapist/i,
    /occupational therapist/i,
    /speech therapist/i,
    /optometrist/i,
    /veterinarian/i,
    /lab technician/i,
    /medical technologist/i,

    // Business/Finance
    /accountant/i,
    /financial analyst/i,
    /investment banker/i,
    /actuary/i,
    /economist/i,
    /auditor/i,
    /management consultant/i,
    /business analyst/i,
    /project manager/i,
    /product manager/i,
    /operations manager/i,
    /marketing manager/i,
    /sales manager/i,
    /hr manager/i,
    /ceo/i,
    /cfo/i,
    /cto/i,
    /entrepreneur/i,

    // Education
    /teacher/i,
    /professor/i,
    /lecturer/i,
    /principal/i,
    /dean/i,
    /librarian/i,
    /tutor/i,

    // Creative/Media
    /journalist/i,
    /editor/i,
    /writer/i,
    /photographer/i,
    /videographer/i,
    /animator/i,
    /artist/i,
    /musician/i,
    /actor/i,
    /director/i,
    /producer/i,
    /broadcaster/i,

    // Science/Research
    /scientist/i,
    /researcher/i,
    /biologist/i,
    /chemist/i,
    /physicist/i,
    /geologist/i,
    /environmental scientist/i,
    /marine biologist/i,

    // Trades (exist globally)
    /electrician/i,
    /plumber/i,
    /carpenter/i,
    /welder/i,
    /mechanic/i,
    /hvac/i,
    /construction/i,
    /mason/i,
    /painter/i,

    // Service Industry
    /chef/i,
    /cook/i,
    /hotel manager/i,
    /restaurant manager/i,
    /pilot/i,
    /flight attendant/i,
    /travel agent/i,
];

// Careers that need adaptation notes
const ADAPTED_CAREERS = {
    "lawyer": "Legal system in MENA countries is based on Sharia law or civil law, not common law. Licensing requirements differ by country.",
    "attorney": "Legal system in MENA countries is based on Sharia law or civil law, not common law. Licensing requirements differ by country.",
    "paralegal": "Legal system differs in MENA. Role may have different scope and requirements.",
    "accountant": "MENA uses IFRS standards. Some countries have specific local requirements (e.g., Saudi SOCPA certification).",
    "cpa": "CPA is US-specific. MENA equivalents include SOCPA (Saudi), CMA, ACCA, or CA certifications.",
    "real estate agent": "Real estate licensing and market structure varies significantly across MENA countries.",
    "insurance agent": "Insurance industry structure and products differ in MENA. Islamic insurance (Takaful) is common.",
    "financial advisor": "Financial advisory services may be regulated differently. Islamic finance considerations apply.",
    "stockbroker": "Stock markets and brokerage regulations vary by MENA country.",
    "police officer": "Law enforcement structure differs by country. Role exists but under different systems.",
    "firefighter": "Role exists in MENA but organizational structure may differ.",
    "emt": "Emergency medical services structure varies. Role may have different certification requirements.",
    "social worker": "Social work profession exists but may have different scope and cultural considerations.",
    "therapist": "Mental health services exist but cultural attitudes and availability vary across MENA.",
    "counselor": "Counseling profession exists but may have different scope in educational vs. clinical settings.",
};

async function reviewCareers() {
    console.log("=== MENA Content Validation ===\n");

    // Fetch all careers
    console.log("Fetching all careers...");
    const { data: careers, error } = await supabase
        .from("careers")
        .select("id, title_en, slug, description_en")
        .order("title_en");

    if (error) {
        console.error("Error fetching careers:", error);
        return;
    }

    console.log(`Found ${careers.length} careers to review\n`);

    const results = {
        universal: [],
        adapted: [],
        us_only: [],
        pending: []
    };

    // Review each career
    for (const career of careers) {
        const title = career.title_en.toLowerCase();
        let category = "pending";
        let notes = null;

        // Check for US-only patterns first
        for (const pattern of US_ONLY_PATTERNS) {
            if (pattern.test(career.title_en)) {
                category = "us_only";
                notes = "Career does not exist or is not recognized in MENA region.";
                break;
            }
        }

        // If not US-only, check for universal patterns
        if (category === "pending") {
            for (const pattern of UNIVERSAL_PATTERNS) {
                if (pattern.test(career.title_en)) {
                    category = "universal";
                    break;
                }
            }
        }

        // Check for adapted careers
        if (category === "pending" || category === "universal") {
            for (const [keyword, note] of Object.entries(ADAPTED_CAREERS)) {
                if (title.includes(keyword)) {
                    category = "adapted";
                    notes = note;
                    break;
                }
            }
        }

        results[category].push({
            id: career.id,
            title: career.title_en,
            slug: career.slug,
            notes: notes
        });
    }

    // Print summary
    console.log("=== Review Summary ===");
    console.log(`Universal: ${results.universal.length}`);
    console.log(`Adapted: ${results.adapted.length}`);
    console.log(`US Only: ${results.us_only.length}`);
    console.log(`Pending: ${results.pending.length}`);

    // Update database
    console.log("\n=== Updating Database ===\n");

    let updated = 0;
    const now = new Date().toISOString();

    for (const [category, items] of Object.entries(results)) {
        for (const item of items) {
            const { error } = await supabase
                .from("careers")
                .update({
                    mena_relevance: category,
                    mena_notes: item.notes,
                    reviewed_at: now,
                    reviewed_by: "automated_review_v1"
                })
                .eq("id", item.id);

            if (error) {
                console.error(`Error updating ${item.title}:`, error.message);
            } else {
                updated++;
            }
        }
        console.log(`Updated ${items.length} careers as "${category}"`);
    }

    console.log(`\nTotal updated: ${updated}/${careers.length}`);

    // Print detailed lists
    console.log("\n=== US-Only Careers (to exclude) ===");
    for (const item of results.us_only) {
        console.log(`- ${item.title}`);
    }

    console.log("\n=== Adapted Careers (need context) ===");
    for (const item of results.adapted) {
        console.log(`- ${item.title}: ${item.notes}`);
    }

    console.log("\n=== Pending Careers (need manual review) ===");
    for (const item of results.pending.slice(0, 50)) {
        console.log(`- ${item.title}`);
    }
    if (results.pending.length > 50) {
        console.log(`  ... and ${results.pending.length - 50} more`);
    }
}

reviewCareers().catch(console.error);
