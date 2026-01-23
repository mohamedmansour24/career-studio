/**
 * MENA Content Validation Script - Pass 2
 * 
 * More comprehensive patterns to reduce pending count.
 * Reviews careers and categorizes them for MENA relevance.
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// US-only careers (expanded patterns)
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
    /deputy sheriff/i,
    /bailiff/i,
    /probation officer/i,
    /parole officer/i,
    /border patrol/i,
    /customs officer/i,
    /tsa/i,
    /irs agent/i,
    /social security/i,
    /postal service/i,
    /usps/i,

    // US Military specific - but not marine engineer
    /\b(us |u\.s\. )?(army|navy|air force|marines?|coast guard|national guard)\b/i,

    // US Legal system specific
    /public defender/i,
    /district attorney/i,
    /state attorney/i,
    /immigration judge/i,
];

// Universal careers - expanded significantly
const UNIVERSAL_PATTERNS = [
    // Engineering (all types)
    /engineer/i,
    /architect/i,
    /surveyor/i,
    /drafter/i,
    /technician/i,
    /technologist/i,

    // IT/Tech
    /software/i,
    /developer/i,
    /programmer/i,
    /data scientist/i,
    /data analyst/i,
    /web/i,
    /network/i,
    /database/i,
    /cyber/i,
    /security analyst/i,
    /it manager/i,
    /systems analyst/i,
    /computer/i,
    /digital/i,
    /cloud/i,
    /devops/i,
    /information technology/i,

    // Healthcare 
    /physician/i,
    /doctor/i,
    /surgeon/i,
    /dentist/i,
    /pharmacist/i,
    /nurse(?! practitioner| anesthetist| aide)/i,
    /radiologist/i,
    /anesthesiologist/i,
    /cardiologist/i,
    /dermatologist/i,
    /pediatrician/i,
    /psychiatrist/i,
    /psychologist/i,
    /optometrist/i,
    /ophthalmologist/i,
    /veterinarian/i,
    /lab technician/i,
    /medical/i,
    /clinical/i,
    /healthcare/i,
    /health care/i,
    /dietitian/i,
    /nutritionist/i,
    /audiologist/i,
    /speech/i,
    /pathologist/i,
    /epidemiologist/i,
    /biostatistician/i,

    // Business/Finance/Management
    /accountant/i,
    /auditor/i,
    /financial/i,
    /investment/i,
    /actuary/i,
    /economist/i,
    /analyst/i,
    /consultant/i,
    /manager/i,
    /director/i,
    /executive/i,
    /ceo/i,
    /cfo/i,
    /cto/i,
    /coo/i,
    /president/i,
    /officer/i,
    /administrator/i,
    /coordinator/i,
    /supervisor/i,
    /planner/i,
    /strategist/i,
    /buyer/i,
    /purchaser/i,
    /procurement/i,
    /logistics/i,
    /supply chain/i,
    /operations/i,
    /human resources/i,
    /hr /i,
    /recruiter/i,
    /talent/i,
    /training/i,
    /sales/i,
    /marketing/i,
    /advertising/i,
    /public relations/i,
    /communications/i,
    /brand/i,
    /product/i,
    /project/i,
    /program/i,
    /business/i,
    /entrepreneur/i,

    // Education
    /teacher/i,
    /professor/i,
    /lecturer/i,
    /instructor/i,
    /educator/i,
    /principal/i,
    /dean/i,
    /librarian/i,
    /tutor/i,
    /postsecondary/i,
    /academic/i,

    // Creative/Media/Arts
    /journalist/i,
    /editor/i,
    /writer/i,
    /author/i,
    /reporter/i,
    /photographer/i,
    /videographer/i,
    /animator/i,
    /artist/i,
    /designer/i,
    /musician/i,
    /actor/i,
    /director/i,
    /producer/i,
    /broadcaster/i,
    /curator/i,
    /archivist/i,
    /creative/i,
    /media/i,
    /entertainment/i,
    /film/i,
    /television/i,
    /radio/i,
    /content/i,

    // Science/Research
    /scientist/i,
    /researcher/i,
    /biologist/i,
    /chemist/i,
    /physicist/i,
    /geologist/i,
    /geographer/i,
    /astronomer/i,
    /meteorologist/i,
    /environmental/i,
    /marine/i,
    /oceanographer/i,
    /ecologist/i,
    /zoologist/i,
    /botanist/i,
    /microbiologist/i,
    /geneticist/i,
    /biochemist/i,
    /statistician/i,
    /mathematician/i,
    /laboratory/i,
    /research/i,

    // Trades & Manufacturing
    /electrician/i,
    /plumber/i,
    /carpenter/i,
    /welder/i,
    /mechanic/i,
    /hvac/i,
    /construction/i,
    /mason/i,
    /painter/i,
    /roofer/i,
    /installer/i,
    /repairer/i,
    /maintenance/i,
    /machinist/i,
    /operator/i,
    /assembler/i,
    /fabricator/i,
    /inspector/i,
    /quality/i,
    /manufacturing/i,
    /production/i,
    /industrial/i,
    /factory/i,
    /plant/i,
    /warehouse/i,
    /forklift/i,
    /crane/i,
    /driver/i,
    /pilot/i,
    /captain/i,
    /sailor/i,

    // Service Industry
    /chef/i,
    /cook/i,
    /baker/i,
    /barista/i,
    /bartender/i,
    /waiter/i,
    /waitress/i,
    /server/i,
    /host/i,
    /hotel/i,
    /restaurant/i,
    /hospitality/i,
    /concierge/i,
    /housekeeper/i,
    /janitor/i,
    /cleaner/i,
    /custodian/i,
    /flight attendant/i,
    /travel/i,
    /tour/i,
    /event/i,
    /wedding/i,

    // Agriculture & Environment
    /farmer/i,
    /agricultural/i,
    /farm/i,
    /rancher/i,
    /fisherman/i,
    /forester/i,
    /logger/i,
    /landscaper/i,
    /groundskeeper/i,
    /gardener/i,
    /horticultur/i,
    /animal/i,
    /veterinary/i,
    /wildlife/i,
    /conservation/i,

    // Legal & Compliance
    /lawyer/i,
    /attorney/i,
    /paralegal/i,
    /legal/i,
    /judge/i,
    /arbitrator/i,
    /mediator/i,
    /compliance/i,
    /regulatory/i,

    // Security & Emergency
    /security/i,
    /guard/i,
    /firefighter/i,
    /emergency/i,
    /paramedic/i,
    /emt/i,
    /dispatcher/i,
    /police/i,  // General police exists in MENA
    /detective/i,
    /investigator/i,

    // Real Estate & Property
    /real estate/i,
    /property/i,
    /appraiser/i,
    /assessor/i,
    /broker/i,
    /agent/i,

    // Sports & Fitness
    /coach/i,
    /trainer/i,
    /athlete/i,
    /sports/i,
    /fitness/i,
    /physical education/i,
    /referee/i,
    /umpire/i,

    // Personal Services
    /hairdresser/i,
    /hairstylist/i,
    /barber/i,
    /cosmetologist/i,
    /esthetician/i,
    /makeup/i,
    /manicurist/i,
    /massage/i,
    /spa/i,
    /personal care/i,

    // Others that are universal
    /interpreter/i,
    /translator/i,
    /linguist/i,
    /sign language/i,
    /urban planner/i,
    /city planner/i,
    /social/i,
    /community/i,
    /clergy/i,
    /religious/i,
    /imam/i,
    /minister/i,
    /chaplain/i,
    /funeral/i,
    /mortician/i,
];

// Careers that need adaptation notes
const ADAPTED_CAREERS = {
    "lawyer": "Legal system in MENA countries is based on Sharia law or civil law. Licensing requirements differ by country.",
    "attorney": "Legal system in MENA countries is based on Sharia law or civil law. Licensing requirements differ by country.",
    "paralegal": "Legal system differs in MENA. Role may have different scope and requirements.",
    "accountant": "MENA uses IFRS standards. Some countries have specific local requirements (e.g., Saudi SOCPA).",
    "auditor": "Auditing standards may follow IFRS. Local certifications may be required.",
    "cpa": "CPA is US-specific. MENA equivalents include SOCPA (Saudi), CMA, ACCA, or CA.",
    "real estate": "Real estate licensing and market structure varies across MENA countries.",
    "insurance": "Insurance differs in MENA. Islamic insurance (Takaful) is common.",
    "financial advisor": "Financial advisory may be regulated differently. Islamic finance considerations apply.",
    "broker": "Securities and real estate brokerage regulations vary by MENA country.",
    "police": "Law enforcement structure differs by country. Role exists but under different systems.",
    "firefighter": "Role exists in MENA but organizational structure may differ.",
    "emt": "Emergency medical services structure varies. Different certification requirements.",
    "paramedic": "Emergency medical services structure varies. Different certification requirements.",
    "social worker": "Social work exists but may have different scope and cultural considerations.",
    "therapist": "Therapy services exist but cultural attitudes and availability vary across MENA.",
    "counselor": "Counseling exists but may have different scope in educational vs. clinical settings.",
    "bartender": "Alcohol service restricted in many MENA countries. Role limited to hotels/specific venues.",
    "sommelier": "Wine service restricted in many MENA countries. Role limited to hotels/specific venues.",
    "gaming": "Gambling prohibited in most MENA countries. Role not applicable.",
    "casino": "Gambling prohibited in most MENA countries. Role not applicable.",
};

async function reviewCareers() {
    console.log("=== MENA Content Validation - Pass 2 ===\n");

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

        // Check for US-only patterns first (these are strict)
        for (const pattern of US_ONLY_PATTERNS) {
            if (pattern.test(career.title_en)) {
                category = "us_only";
                notes = "Career does not exist or is not recognized in MENA region.";
                break;
            }
        }

        // Check for adapted careers (before universal, as some universal patterns are broad)
        if (category !== "us_only") {
            for (const [keyword, note] of Object.entries(ADAPTED_CAREERS)) {
                if (title.includes(keyword)) {
                    category = "adapted";
                    notes = note;
                    break;
                }
            }
        }

        // If not adapted or US-only, check for universal patterns
        if (category === "pending") {
            for (const pattern of UNIVERSAL_PATTERNS) {
                if (pattern.test(career.title_en)) {
                    category = "universal";
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
                    reviewed_by: "automated_review_v2"
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

    if (results.pending.length > 0) {
        console.log("\n=== Pending Careers (need manual review) ===");
        for (const item of results.pending) {
            console.log(`- ${item.title}`);
        }
    }

    // Generate summary for HACKING.md
    console.log("\n\n=== SUMMARY FOR HACKING.md ===");
    console.log(`
## MENA Content Validation Results

**Review Date:** ${new Date().toISOString().split('T')[0]}
**Reviewed By:** Automated review v2

### Summary
| Category | Count | % of Total |
|----------|-------|------------|
| Universal | ${results.universal.length} | ${((results.universal.length / careers.length) * 100).toFixed(1)}% |
| Adapted | ${results.adapted.length} | ${((results.adapted.length / careers.length) * 100).toFixed(1)}% |
| US Only | ${results.us_only.length} | ${((results.us_only.length / careers.length) * 100).toFixed(1)}% |
| Pending | ${results.pending.length} | ${((results.pending.length / careers.length) * 100).toFixed(1)}% |
| **Total** | **${careers.length}** | **100%** |

### US-Only Exclusions (${results.us_only.length})
${results.us_only.map(i => `- ${i.title}`).join('\n')}

### Adapted Careers (${results.adapted.length})
${results.adapted.map(i => `- **${i.title}**: ${i.notes}`).join('\n')}

### Pending for Expert Review (${results.pending.length})
${results.pending.map(i => `- ${i.title}`).join('\n')}
`);
}

reviewCareers().catch(console.error);
