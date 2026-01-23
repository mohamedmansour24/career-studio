/**
 * Expert Review Agent - MENA Career Categorization
 * Reviews 154 pending careers and categorizes them.
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Expert categorization based on MENA labor market knowledge
const EXPERT_DECISIONS = {
    // UNIVERSAL - These careers exist globally
    universal: [
        "Actuaries",
        "Acupuncturists",
        "Air Traffic Controllers",
        "Anthropologist",
        "Archeologists",
        "Automotive and Watercraft Service Attendant",
        "Baggage Porter and Bellhop",
        "Boilermakers",
        "Butcher and Meat Cutter",
        "Cartographer and Photogrammetrist",
        "Cashiers",
        "Childcare Workers",
        "Choreographers",
        "Coil Winder, Taper, and Finisher",
        "Commercial Divers",
        "Compensation and Benefits specialists",
        "Cost Estimators",
        "Courier and Messenger",
        "Customer Service Representatives",
        "Cutter and Trimmer, Hand",
        "Dancers",
        "Data Entry Keyers",
        "Dental Assistants",
        "Dental Hygienists",
        "Dental Lab Tech*",
        "Dishwasher",
        "Document Management Specialists",
        "Earth Drillers, Except Oil and Gas",
        "Ergonomist",
        "Etchers and Engravers",
        "Exercise Physiologist",
        "Fabric and Apparel Patternmaker",
        "Fast Food and Counter Workers",
        "Floor Layers, Except Carpet, Wood, and Hard Tiles",
        "Floor Sanders and Finishers",
        "Food Batchmakers",
        "Food Preparation Workers",
        "Foundry Mold and Coremakers",
        "Freight Forwarders",
        "Fundraisers",
        "Furniture Finishers",
        "Gem and Diamond Workers",
        "Glass Blower, Molder, Bender, and Finisher",
        "Glazier",
        "Grinding and Polishing Workers, Hand",
        "Hand Sewers",
        "Health Informatics Specialists",
        "Hearing Aid Specialist",
        "Historian",
        "Hydrologist",
        "Immunologist",
        "Insulation Worker, Floor, Ceiling, and Wall",
        "Interviewers, Except Eligibility and Loan",
        "Iron Worker*",
        "Jeweler and Precious Stone and Metal Worker",
        "Laborers and Freight, Stock, and Material Movers, Hand",
        "Landscaping and Groundskeeping Worker",
        "Laundry and Dry-Cleaning Worker",
        "Layout Worker, Metal and Plastic",
        "Library Assistants, Clerical",
        "Logisticians",
        "Machine Feeder and Offbearer",
        "Meat, Poultry, and Fish Cutter and Trimmer",
        "Midwives",
        "Millwright",
        "Model",
        "Model Maker, Metal and Plastic",
        "Model Maker, Wood",
        "Molders, Shapers, and Casters, Except Metal and Plastic",
        "Nannies",
        "Neurologist",
        "New Accounts Clerk",
        "News Anchor*",
        "Non-Destructive Testing Specialist",
        "Nursing Assistants",
        "Occupational Health and Safety Specialist",
        "Occupational Therapy Assistants",
        "Online Merchants",
        "Opticians, Dispensing",
        "Orthodontist",
        "Orthoptist",
        "Orthotists and Prosthetists",
        "Packers and Packagers, Hand",
        "Painting, Coating, and Decorating Workers",
        "Paperhangers",
        "Parking Attendants",
        "Passenger Attendants",
        "Patient Transporter*",
        "Patternmakers, Metal and Plastic",
        "Patternmakers, Wood",
        "Pest Control Workers",
        "Phlebotomists",
        "Pipelayers",
        "Podiatrist",
        "Pourers and Casters, Metal",
        "Pressers, Textile, Garment, and Related Materials",
        "Print Binding and Finishing Workers",
        "Proofreaders and Copy Markers",
        "Prosthodontists",
        "Public Safety Telecommunicator",
        "Receptionists and Information Clerks",
        "Recycling and Reclamation Worker",
        "Reinforcing Iron and Rebar Worker",
        "Residential Advisors",
        "Rigger",
        "Rock Splitter, Quarry",
        "Sculptor",
        "Segmental Paver",
        "Shampooer",
        "Sheet Metal Worker",
        "Shipping, Receiving, and Inventory Clerks",
        "Skincare Specialists",
        "Slaughterer and Meat Packer",
        "Sociologist",
        "Statistical Assistants",
        "Stockers and Order Fillers",
        "Surgical Assistant",
        "Sustainability Specialists",
        "Tailors, Dressmaker, and Custom Sewer",
        "Tank Car, Truck, and Ship Loader",
        "Taper",
        "Technical Support Specialist*",
        "Telemarketer",
        "Teller",
        "Terrazzo Worker and Finisher",
        "Tile and Stone Setter",
        "Tire Builder",
        "Tool and Die Maker",
        "Tool Grinder, Filer, and Sharpener",
        "Treasurer*",
        "Tree Trimmer and Pruner",
        "Upholsterer",
        "Urologists",
        "Ushers, Lobby Attendants, and Ticket Takers",
        "Visual Merchandiser*",
        "Water Resource Specialist",
        "Wellhead Pumper",
        "Meter Reader, Utilities",
        "Roustabout, Oil and Gas", // Oil & gas is major in MENA
    ],

    // ADAPTED - Exist in MENA but need context
    adapted: [
        { title: "Amusement and Recreation Attendants", notes: "Entertainment venues may operate differently in conservative MENA regions. Role exists in hotels and family entertainment centers." },
        { title: "Bridge and Lock Tender", notes: "Infrastructure-specific. Limited waterway infrastructure in most MENA countries except Egypt (Suez Canal operations)." },
        { title: "Embalmers", notes: "Islamic burial practices differ. Role limited to non-Muslim communities and medical/forensic contexts." },
        { title: "Explosives Workers, Ordnance Handling Experts, and Blasters", notes: "Heavily regulated. Used in mining and construction. Requires special licensing in all jurisdictions." },
        { title: "Hazardous Materials Removal Worker", notes: "Environmental regulations and certifications differ by MENA country. Growing field due to industrial development." },
        { title: "Judicial Law Clerks", notes: "Court systems differ. Role exists but structure varies between Sharia, civil, and mixed law systems." },
        { title: "Pesticide Handlers, Sprayers, and Applicators, Vegetation", notes: "Agricultural role exists. Approved chemicals and regulations vary by country." },
        { title: "Tax Preparer", notes: "Tax systems vary significantly across MENA. Some countries (UAE, Bahrain) have no income tax. VAT specialists are more relevant." },
    ],

    // US-ONLY - Don't exist or aren't licensed in MENA
    us_only: [
        { title: "Fallers", notes: "Logging industry is minimal in MENA due to limited forests. Role specific to North American forestry." },
        { title: "Fish and Game Wardens", notes: "US-specific wildlife law enforcement structure. Conservation roles exist but under different frameworks." },
        { title: "Log Grader and Scaler", notes: "Logging industry is minimal in MENA. Role specific to forestry-heavy regions." },
        { title: "Parking Enforcement Workers", notes: "Municipal parking enforcement structured differently. Often handled by general security or police." },
        { title: "Roof Bolter, Mining", notes: "Very specialized US mining role. Mining techniques and regulations differ in MENA." },
        { title: "Tax Examiner*", notes: "Government tax examination structure differs. Some MENA countries have no income tax." },
        { title: "Fishing and Hunting Workers", notes: "Commercial fishing exists but recreational hunting industry is very limited in MENA." },
    ],
};

async function expertReview() {
    console.log("=== Expert Review Agent: MENA Career Categorization ===\n");
    console.log("Date:", new Date().toISOString().split("T")[0]);
    console.log("");

    const now = new Date().toISOString();
    const reviewer = "Expert Review Agent";

    let stats = { universal: 0, adapted: 0, us_only: 0, failed: 0 };

    // Update UNIVERSAL careers
    console.log("Processing UNIVERSAL careers...");
    for (const title of EXPERT_DECISIONS.universal) {
        const { error, count } = await supabase
            .from("careers")
            .update({
                mena_relevance: "universal",
                mena_notes: null,
                reviewed_at: now,
                reviewed_by: reviewer,
            })
            .ilike("title_en", title)
            .eq("mena_relevance", "pending");

        if (error) {
            console.log(`  ✗ Failed: ${title} - ${error.message}`);
            stats.failed++;
        } else {
            stats.universal++;
        }
    }
    console.log(`  ✓ Updated ${stats.universal} universal careers`);

    // Update ADAPTED careers
    console.log("\nProcessing ADAPTED careers...");
    for (const item of EXPERT_DECISIONS.adapted) {
        const { error } = await supabase
            .from("careers")
            .update({
                mena_relevance: "adapted",
                mena_notes: item.notes,
                reviewed_at: now,
                reviewed_by: reviewer,
            })
            .ilike("title_en", item.title)
            .eq("mena_relevance", "pending");

        if (error) {
            console.log(`  ✗ Failed: ${item.title} - ${error.message}`);
            stats.failed++;
        } else {
            stats.adapted++;
        }
    }
    console.log(`  ✓ Updated ${stats.adapted} adapted careers`);

    // Update US_ONLY careers
    console.log("\nProcessing US_ONLY careers...");
    for (const item of EXPERT_DECISIONS.us_only) {
        const { error } = await supabase
            .from("careers")
            .update({
                mena_relevance: "us_only",
                mena_notes: item.notes,
                reviewed_at: now,
                reviewed_by: reviewer,
            })
            .ilike("title_en", item.title)
            .eq("mena_relevance", "pending");

        if (error) {
            console.log(`  ✗ Failed: ${item.title} - ${error.message}`);
            stats.failed++;
        } else {
            stats.us_only++;
        }
    }
    console.log(`  ✓ Updated ${stats.us_only} us_only careers`);

    // Check remaining pending
    const { data: remaining } = await supabase
        .from("careers")
        .select("title_en")
        .eq("mena_relevance", "pending")
        .order("title_en");

    // Get final counts
    const { data: allCareers } = await supabase.from("careers").select("mena_relevance");
    const finalCounts = { universal: 0, adapted: 0, us_only: 0, pending: 0 };
    allCareers.forEach((c) => {
        if (finalCounts[c.mena_relevance] !== undefined) finalCounts[c.mena_relevance]++;
    });

    console.log("\n=== EXPERT REVIEW COMPLETE ===\n");
    console.log("This Session:");
    console.log(`  Universal: +${stats.universal}`);
    console.log(`  Adapted: +${stats.adapted}`);
    console.log(`  US Only: +${stats.us_only}`);
    console.log(`  Failed: ${stats.failed}`);

    console.log("\nFinal Database Counts:");
    console.log(`  Universal: ${finalCounts.universal}`);
    console.log(`  Adapted: ${finalCounts.adapted}`);
    console.log(`  US Only: ${finalCounts.us_only}`);
    console.log(`  Pending: ${finalCounts.pending}`);
    console.log(`  Total: ${allCareers.length}`);

    if (remaining && remaining.length > 0) {
        console.log(`\n⚠️ ${remaining.length} careers still pending:`);
        remaining.forEach((c) => console.log(`  - ${c.title_en}`));
    } else {
        console.log("\n✅ All careers have been reviewed!");
    }
}

expertReview().catch(console.error);
