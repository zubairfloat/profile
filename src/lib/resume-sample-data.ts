import type { ResumeData } from "@/types/resume-builder";

export const sampleDeveloperResume: ResumeData = {
  personalInfo: {
    fullName: "Muhammad Zubair Rizwan",
    jobTitle: "Principal Consultant - Digital Commerce",
    email: "zubair.rizwan@example.com",
    phone: "+92 300 0000000",
    location: "Karachi, Pakistan",
    linkedin: "linkedin.com/in/muhammad-zubair-rizwan-69a355180",
    github: "github.com/zubairfloat",
    portfolio: "zubairrizwan.dev",
  },
  summary:
    "Senior Full Stack JavaScript Developer with experience in React, Next.js, Node.js, and enterprise commerce platforms.",
  experience: [
    {
      id: "sample-exp-1",
      company: "Systems Limited",
      jobTitle: "Principal Consultant",
      location: "Karachi, Pakistan",
      startDate: "2021",
      endDate: "Present",
      currentlyWorking: true,
      description:
        "Led enterprise digital commerce implementations using React, Next.js, TypeScript, and Dynamics 365 Commerce.\nDesigned scalable frontend architecture, reusable modules, and integration patterns for high-traffic commerce workflows.\nCollaborated with business and engineering teams to deliver reliable, customer-focused product experiences.",
    },
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Enterprise Commerce Platform",
      role: "Lead Frontend Engineer",
      techStack: "React, Next.js, TypeScript, Dynamics 365 Commerce",
      url: "",
      description:
        "Built scalable commerce modules, checkout flows, and product discovery experiences for enterprise customers.",
      achievements:
        "Improved UI consistency, reduced repeated implementation work, and delivered reusable frontend patterns for multiple commerce journeys.",
    },
    {
      id: "sample-project-2",
      name: "AI Learning Hub",
      role: "Creator",
      techStack: "Next.js, React, Framer Motion, TypeScript",
      url: "",
      description:
        "Created interactive learning modules for JavaScript, React, and software engineering concepts.",
      achievements:
        "Designed visual lessons, quizzes, and real-world examples to make advanced engineering topics easier to understand.",
    },
    {
      id: "sample-project-3",
      name: "Resume Builder",
      role: "Full Stack Developer",
      techStack: "Next.js, React Hook Form, Zod, TypeScript",
      url: "",
      description:
        "Built a professional ATS-friendly resume builder with live preview, templates, persistence, and PDF export.",
      achievements:
        "Enabled developers to create polished resumes quickly with reusable sections and smart suggestions.",
    },
  ],
  education: [
    {
      id: "sample-education-1",
      institution: "University of Karachi",
      degree: "Bachelor's Degree",
      fieldOfStudy: "Computer Science",
      startYear: "2012",
      endYear: "2016",
      grade: "",
    },
  ],
  skills: [
    { id: "sample-skill-1", name: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { id: "sample-skill-2", name: "Backend", skills: ["Node.js", "NestJS", "REST APIs"] },
    { id: "sample-skill-3", name: "Commerce", skills: ["Dynamics 365 Commerce", "Checkout", "Payments"] },
    { id: "sample-skill-4", name: "Cloud", skills: ["AWS", "Vercel", "Docker"] },
    { id: "sample-skill-5", name: "Tools", skills: ["Git", "Datadog", "CI/CD"] },
  ],
  certifications: [
    {
      id: "sample-cert-1",
      name: "Microsoft Certified: Dynamics 365 Fundamentals",
      issuer: "Microsoft",
      year: "2024",
      credentialUrl: "",
    },
  ],
  selectedTemplate: "modern-developer",
  currentStep: 0,
  targetRole: "Principal Consultant - Digital Commerce",
  targetCompany: "Any Company",
  experienceLevel: "9+ years",
  atsKeywords: ["React", "Next.js", "TypeScript", "Node.js", "Dynamics 365 Commerce", "Enterprise Architecture"],
  sectionOrder: ["summary", "skills", "experience", "projects", "education", "certifications"],
  theme: {
    accentColor: "#2563eb",
    fontFamily: "Inter",
    borderRadius: 8,
    headerStyle: "classic",
    sidebarWidth: 34,
    paperMargin: 32,
    lineHeight: 1.45,
    showIcons: false,
  },
  extraSections: [],
};
