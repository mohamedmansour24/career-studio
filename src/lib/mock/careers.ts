export type Career = {
  slug: string;
  title: string;
  intro: string;        // short preview (1–2 lines)
  description: string;  // full text for the Intro section
  bucket: "artistic" | "social" | "enterprising" | "investigative" | "conventional" | "realistic";
  characters?: { male?: string; female?: string };
};

export const careers: Career[] = [
  {
    slug: "registered-nurse",
    title: "Registered Nurse",
    intro: "Provide patient care, coordinate treatment, and guide patients through recovery.",
    description:
      "Registered nurses (RNs) provide and coordinate patient care, educate patients and the public about health conditions, and offer advice and emotional support to patients and their families.\n\nThey work in hospitals, physicians’ offices, home healthcare services, and nursing care facilities. Day-to-day responsibilities often include monitoring patient health, administering medications, operating medical equipment, documenting care, collaborating with physicians and specialists, and helping patients understand treatment plans.\n\nRNs may specialize in areas like pediatrics, emergency care, oncology, or critical care depending on training and workplace needs.",
    bucket: "social",
  },
  {
    slug: "ai-ml",
    title: "Artificial Intelligence & Machine Learning",
    intro: "Build systems that learn from data to automate decisions and improve products.",
    description:
      "AI & ML roles focus on building models that recognize patterns in data and make predictions or decisions. Work includes data preparation, model training and evaluation, deployment, monitoring, and iteration.\n\nDepending on the team, you might build recommendation systems, natural language tools, computer vision models, or automation pipelines.\n\nStrong foundations in statistics, software engineering, and experimentation are common requirements.",
    bucket: "investigative",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    intro: "Create visual systems that communicate ideas clearly across brand and product.",
    description:
      "Graphic designers create visual concepts to communicate ideas that inspire, inform, and captivate audiences. Work includes layout, typography, branding systems, and asset creation for digital and print.\n\nDesigners often collaborate with marketing, product, and content teams, and iterate based on feedback and constraints.",
    bucket: "artistic",
  },
  {
    slug: "content-writer",
    title: "Content Writer",
    intro: "Write content that educates, persuades, and supports product and brand goals.",
    description:
      "Content writers plan, draft, and refine written material for websites, blogs, campaigns, and product experiences. Work includes research, outlining, stakeholder alignment, editing, and performance iteration.\n\nGreat writing here is structured, audience-aware, and consistent with the brand voice.",
    bucket: "artistic",
  },
];
