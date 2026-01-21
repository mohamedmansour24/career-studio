export const mockCareerProfile = {
  salary: "$10,000 - $20,000",
  inDemand: true,
  introLong:
    "This is where the full career description will live.\n\n" +
    "It can be multiple paragraphs and will scroll inside the content card.\n\n" +
    "Later we will pull this from Supabase (careers.intro_en or a new field like description_en if you choose).",
  tasks: [
    "Assess patient conditions and record medical histories.",
    "Administer medications and treatments.",
    "Monitor patient health and interpret vital signs.",
    "Educate patients and families on care plans.",
    "Collaborate with doctors and other healthcare staff.",
  ],
  skills: {
    hard: ["Patient assessment", "Medication administration", "Clinical documentation", "Care coordination"],
    soft: ["Communication", "Empathy", "Attention to detail", "Teamwork"],
  },
  educationSlices: [
    { label: "Bachelor’s", percent: 42 },
    { label: "Associate", percent: 28 },
    { label: "Some College", percent: 12 },
    { label: "High School", percent: 8 },
    { label: "Master’s", percent: 6 },
    { label: "PhD", percent: 2 },
    { label: "Less than HS", percent: 1 },
    { label: "Unknown/Other", percent: 1 },
  ],
  workAtAGlance: [
    { label: "Responsibility", level: "high" as const },
    { label: "Physical Activity", level: "medium" as const },
    { label: "Decision Making", level: "high" as const },
    { label: "Time Pressure", level: "high" as const },
    { label: "Competitiveness", level: "low" as const },
    { label: "Repetition", level: "medium" as const },
  ],
};
