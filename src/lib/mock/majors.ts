export type Major = {
  slug: string;
  title: string;
  intro: string;        // short preview
  description: string;  // long description for Intro tab
  bucket: "artistic" | "social" | "enterprising" | "investigative" | "conventional" | "realistic";
};

export const majors: Major[] = [
  {
    slug: "nursing",
    title: "Nursing",
    intro: "Prepare to provide patient-centered care across clinical and community settings.",
    description:
      "Nursing programs prepare students to deliver safe, effective care and collaborate in healthcare teams.\n\nYou’ll study anatomy, physiology, pharmacology, and clinical practice. Many programs include clinical placements and licensure preparation.\n\nGraduates often pursue RN licensure and can specialize in areas like pediatrics, emergency care, or critical care.",
    bucket: "social",
  },
  {
    slug: "computer-science",
    title: "Computer Science",
    intro: "Study computation, software systems, and algorithms that power modern technology.",
    description:
      "Computer Science focuses on programming, algorithms, systems, and problem solving.\n\nYou’ll learn how to design software, understand data structures, work with databases, and reason about computational efficiency.\n\nGraduates work in software engineering, data science, machine learning, and many other fields.",
    bucket: "investigative",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    intro: "Learn visual communication through typography, layout, and brand systems.",
    description:
      "Graphic Design is the practice of communicating ideas through visual form.\n\nStudents learn typography, layout, branding, and digital design tools. Projects often include posters, interfaces, and identity systems.\n\nGraduates work in branding, product design, marketing, and content creation.",
    bucket: "artistic",
  },
];
