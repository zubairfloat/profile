import type { CareerRole, ExperienceLevel, ResumeData, ResumeTemplate, TargetCompany } from "@/types/resume-builder";

export const careerRoles: CareerRole[] = [
  { id: "frontend-developer", title: "Frontend Developer", description: "Builds polished user interfaces with React and modern CSS.", salaryRange: "$75k - $135k", skills: ["React", "TypeScript", "Tailwind CSS"], demandLevel: "Very High" },
  { id: "react-developer", title: "React Developer", description: "Specializes in scalable React applications and component systems.", salaryRange: "$80k - $145k", skills: ["React", "Redux Toolkit", "Testing"], demandLevel: "Very High" },
  { id: "nextjs-developer", title: "Next.js Developer", description: "Builds production web apps with App Router, caching, and SSR.", salaryRange: "$90k - $155k", skills: ["Next.js", "React", "Vercel"], demandLevel: "Very High" },
  { id: "full-stack-js", title: "Full Stack JavaScript", description: "Owns frontend, backend APIs, data flow, and deployments.", salaryRange: "$95k - $165k", skills: ["React", "Node.js", "PostgreSQL"], demandLevel: "Very High" },
  { id: "backend-developer", title: "Backend Developer", description: "Designs APIs, services, authentication, and data systems.", salaryRange: "$85k - $150k", skills: ["Node.js", "REST APIs", "PostgreSQL"], demandLevel: "High" },
  { id: "nodejs-developer", title: "Node.js Developer", description: "Builds scalable JavaScript services and backend integrations.", salaryRange: "$85k - $155k", skills: ["Node.js", "Express", "NestJS"], demandLevel: "High" },
  { id: "nestjs-developer", title: "NestJS Developer", description: "Creates enterprise APIs with modular backend architecture.", salaryRange: "$90k - $160k", skills: ["NestJS", "TypeScript", "Microservices"], demandLevel: "High" },
  { id: "software-engineer", title: "Software Engineer", description: "Builds reliable software systems across product and platform teams.", salaryRange: "$85k - $160k", skills: ["System Design", "Testing", "APIs"], demandLevel: "Very High" },
  { id: "senior-software-engineer", title: "Senior Software Engineer", description: "Leads technical delivery, architecture, mentoring, and complex features.", salaryRange: "$130k - $220k", skills: ["Architecture", "Leadership", "Performance"], demandLevel: "Elite" },
  { id: "principal-engineer", title: "Principal Engineer", description: "Owns platform direction, architecture standards, and cross-team impact.", salaryRange: "$170k - $280k", skills: ["Architecture", "Strategy", "Scalability"], demandLevel: "Elite" },
  { id: "engineering-manager", title: "Engineering Manager", description: "Leads teams, delivery, engineering culture, and stakeholder alignment.", salaryRange: "$150k - $260k", skills: ["Leadership", "Planning", "Hiring"], demandLevel: "High" },
  { id: "ai-engineer", title: "AI Engineer", description: "Builds AI product features using LLMs, RAG, evals, and agents.", salaryRange: "$130k - $240k", skills: ["OpenAI API", "RAG", "Evaluations"], demandLevel: "Elite" },
  { id: "prompt-engineer", title: "Prompt Engineer", description: "Designs prompt systems, workflows, and model behavior patterns.", salaryRange: "$90k - $170k", skills: ["Prompt Engineering", "LLMs", "Evaluation"], demandLevel: "High" },
  { id: "agentic-ai-engineer", title: "Agentic AI Engineer", description: "Builds tool-using AI agents and production automation workflows.", salaryRange: "$140k - $250k", skills: ["AI Agents", "MCP", "RAG"], demandLevel: "Elite" },
  { id: "cloud-engineer", title: "Cloud Engineer", description: "Designs cloud infrastructure, deployments, networking, and observability.", salaryRange: "$100k - $175k", skills: ["AWS", "Docker", "CI/CD"], demandLevel: "Very High" },
  { id: "aws-engineer", title: "AWS Engineer", description: "Builds and operates AWS cloud systems and serverless platforms.", salaryRange: "$105k - $185k", skills: ["AWS", "Lambda", "CloudWatch"], demandLevel: "Very High" },
  { id: "devops-engineer", title: "DevOps Engineer", description: "Automates delivery pipelines, infrastructure, monitoring, and releases.", salaryRange: "$105k - $185k", skills: ["Docker", "Kubernetes", "GitHub Actions"], demandLevel: "Very High" },
  { id: "mobile-developer", title: "Mobile Developer", description: "Builds native and cross-platform mobile app experiences.", salaryRange: "$85k - $155k", skills: ["React Native", "Mobile UX", "APIs"], demandLevel: "High" },
  { id: "product-manager", title: "Product Manager", description: "Owns product strategy, roadmap, discovery, and measurable outcomes.", salaryRange: "$110k - $210k", skills: ["Roadmaps", "Analytics", "Stakeholders"], demandLevel: "High" },
  { id: "ui-ux-designer", title: "UI UX Designer", description: "Designs user journeys, polished interfaces, and research-backed product flows.", salaryRange: "$85k - $160k", skills: ["Figma", "Research", "Design Systems"], demandLevel: "High" },
  { id: "qa-engineer", title: "QA Engineer", description: "Ensures product quality through manual testing, automation, and release checks.", salaryRange: "$70k - $130k", skills: ["Test Plans", "Automation", "Regression"], demandLevel: "High" },
  { id: "business-analyst", title: "Business Analyst", description: "Connects business requirements with product, engineering, and delivery teams.", salaryRange: "$75k - $140k", skills: ["Requirements", "Process Mapping", "Stakeholders"], demandLevel: "High" },
  { id: "qa-automation", title: "QA Automation Engineer", description: "Creates reliable test automation and release confidence systems.", salaryRange: "$75k - $135k", skills: ["Playwright", "Cypress", "CI/CD"], demandLevel: "High" },
  { id: "data-engineer", title: "Data Engineer", description: "Builds pipelines, warehouses, and reliable data products.", salaryRange: "$105k - $190k", skills: ["SQL", "Pipelines", "Cloud"], demandLevel: "Very High" },
  { id: "machine-learning-engineer", title: "Machine Learning Engineer", description: "Ships ML models, data pipelines, evaluation, and model services.", salaryRange: "$130k - $240k", skills: ["Python", "MLOps", "Model Serving"], demandLevel: "Elite" },
  { id: "d365-commerce-developer", title: "Dynamics 365 Commerce Developer", description: "Builds commerce modules, checkout flows, payments, and integrations.", salaryRange: "$95k - $175k", skills: ["D365 Commerce", "React", "CRT"], demandLevel: "High" },
  { id: "d365-consultant", title: "Dynamics 365 Consultant", description: "Delivers enterprise commerce strategy, implementation, and client outcomes.", salaryRange: "$115k - $210k", skills: ["D365", "Consulting", "Integrations"], demandLevel: "Very High" },
];

export const experienceLevels: ExperienceLevel[] = [
  { id: "0-1", label: "0-1", years: "0-1 years", description: "Junior or career starter with strong projects." },
  { id: "2-3", label: "2-3", years: "2-3 years", description: "Growing engineer with production delivery." },
  { id: "4-6", label: "4-6", years: "4-6 years", description: "Mid to senior contributor with ownership." },
  { id: "7-10", label: "7-10", years: "7-10 years", description: "Senior engineer with architecture and mentorship." },
  { id: "10+", label: "10+", years: "10+ years", description: "Principal, lead, consultant, or manager track." },
];

export const targetCompanies: TargetCompany[] = [
  { id: "google", name: "Google", hiringStyle: "Data-driven and engineering depth", resumePreference: "Impact, scale, architecture, metrics", interviewFocus: "Algorithms, system design, leadership" },
  { id: "microsoft", name: "Microsoft", hiringStyle: "Enterprise, collaboration, and customer value", resumePreference: "Architecture, consulting, delivery impact", interviewFocus: "System design, behavioral, cloud" },
  { id: "amazon", name: "Amazon", hiringStyle: "Ownership and customer obsession", resumePreference: "STAR stories, metrics, operational impact", interviewFocus: "Leadership principles, scale, design" },
  { id: "meta", name: "Meta", hiringStyle: "Speed, product impact, and scale", resumePreference: "Execution, performance, experimentation", interviewFocus: "Product architecture, coding, impact" },
  { id: "netflix", name: "Netflix", hiringStyle: "Autonomy and senior judgment", resumePreference: "Ownership, reliability, product quality", interviewFocus: "Architecture, culture, tradeoffs" },
  { id: "apple", name: "Apple", hiringStyle: "Craft, quality, and user experience", resumePreference: "Polish, detail, reliability", interviewFocus: "UX, quality, technical depth" },
  { id: "openai", name: "OpenAI", hiringStyle: "AI systems and product thinking", resumePreference: "LLMs, RAG, agents, safety, evaluation", interviewFocus: "AI architecture, product judgment, systems" },
  { id: "stripe", name: "Stripe", hiringStyle: "Developer experience and reliability", resumePreference: "APIs, payments, quality, metrics", interviewFocus: "API design, systems, product quality" },
  { id: "airbnb", name: "Airbnb", hiringStyle: "Product craft and marketplace scale", resumePreference: "UX, platform thinking, experimentation", interviewFocus: "Frontend depth, design systems, product" },
  { id: "shopify", name: "Shopify", hiringStyle: "Commerce and merchant impact", resumePreference: "Commerce, payments, platform impact", interviewFocus: "Product engineering, architecture" },
  { id: "uber", name: "Uber", hiringStyle: "Scale, reliability, operations", resumePreference: "Distributed systems, metrics, uptime", interviewFocus: "System design, coding, ownership" },
  { id: "any-company", name: "Any Company", hiringStyle: "Balanced professional screening", resumePreference: "Clear impact, skills, projects, metrics", interviewFocus: "Role fit, technical depth, delivery" },
];

const roleSkillMap: Record<string, Record<string, string[]>> = {
  default: {
    Frontend: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "Accessibility", "Performance Optimization"],
    Backend: ["Node.js", "REST APIs", "Authentication", "GraphQL"],
    Database: ["MongoDB", "PostgreSQL", "MySQL"],
    Cloud: ["AWS", "Docker", "Vercel", "CI/CD", "GitHub Actions"],
    Testing: ["Jest", "React Testing Library", "Playwright", "Cypress"],
  },
  "ai-engineer": {
    AI: ["Prompt Engineering", "AI Agents", "RAG", "MCP", "OpenAI API", "Evaluations"],
    Frontend: ["React", "Next.js", "TypeScript"],
    Backend: ["Node.js", "Python APIs", "Vector Databases"],
    Cloud: ["AWS", "Docker", "Vercel"],
  },
  "d365-commerce-developer": {
    Commerce: ["Dynamics 365 Commerce", "CRT", "Checkout", "Payments", "Retail SDK"],
    Frontend: ["React", "Next.js", "TypeScript"],
    Backend: ["Node.js", "APIs", "Integrations"],
    Cloud: ["Azure", "CI/CD", "Monitoring"],
  },
};

const templateByStyle: Record<string, ResumeTemplate> = {
  "modern-developer": "modern-developer",
  "ats-professional": "ats-professional",
  "enterprise-consultant": "enterprise-consultant",
  minimal: "minimal-clean",
  executive: "executive",
  "google-style": "google-style",
  "amazon-style": "amazon-style",
  "microsoft-style": "microsoft-style",
  "ai-engineer": "ai-engineer",
  "modern-ats": "modern-ats",
  "professional-ats": "professional-ats",
  "timeline-resume": "timeline-resume",
  "sidebar-resume": "sidebar-resume",
  "software-engineer": "software-engineer",
  "frontend-developer": "frontend-developer",
  "react-developer": "react-developer",
  "full-stack-developer": "full-stack-developer",
  "devops-engineer": "devops-engineer",
  "minimal-resume": "minimal-resume",
};

function yearsText(level: ExperienceLevel) {
  const parts = level.id.split("-");
  return level.id === "10+" ? "10+" : parts[parts.length - 1] ?? "5";
}

function companyFocus(company: TargetCompany) {
  if (company.id === "google") return "impact, architecture, scale, leadership, and measurable engineering outcomes";
  if (company.id === "amazon") return "ownership, customer obsession, operational excellence, STAR stories, and metrics";
  if (company.id === "microsoft") return "enterprise delivery, consulting, architecture, cloud integration, and collaboration";
  if (company.id === "openai") return "AI systems, LLM products, RAG, prompt engineering, agents, and evaluation";
  return "business impact, technical depth, scalable delivery, and measurable product outcomes";
}

export function generateStudioResume({
  roleId,
  levelId,
  companyId,
  templateId,
}: {
  roleId: string;
  levelId: string;
  companyId: string;
  templateId: string;
}): ResumeData {
  const role = careerRoles.find((item) => item.id === roleId) ?? careerRoles[0];
  const level = experienceLevels.find((item) => item.id === levelId) ?? experienceLevels[2];
  const company = targetCompanies.find((item) => item.id === companyId) ?? targetCompanies[targetCompanies.length - 1] ?? targetCompanies[0]!;
  const years = yearsText(level);
  const skillGroups = roleSkillMap[role.id] ?? roleSkillMap.default;
  const focus = companyFocus(company);
  const isAI = role.id.includes("ai") || templateId === "ai-engineer";
  const isConsultant = role.id.includes("d365") || templateId === "enterprise-consultant";

  return {
    personalInfo: {
      fullName: "Muhammad Zubair Rizwan",
      jobTitle: role.title,
      email: "zubair.rizwan@example.com",
      phone: "+92 300 0000000",
      location: "Karachi, Pakistan",
      linkedin: "linkedin.com/in/muhammad-zubair-rizwan-69a355180",
      github: "github.com/zubairfloat",
      portfolio: "zubairrizwan.dev",
    },
    summary: `${role.title} with ${years}+ years of experience building enterprise-scale solutions using ${role.skills.join(", ")} and modern cloud technologies. Experienced in ${focus}, with a strong track record of shipping reliable products, improving performance, and collaborating with cross-functional teams.`,
    experience: [
      {
        id: "studio-exp-1",
        company: "ABC Technologies",
        jobTitle: role.title,
        location: "Remote",
        startDate: level.id === "0-1" ? "2024" : "2020",
        endDate: "Present",
        currentlyWorking: true,
        description: [
          `Developed scalable ${role.title.toLowerCase()} solutions for enterprise customers using ${role.skills.join(", ")}.`,
          "Improved Lighthouse performance score by 35% through code splitting, image optimization, and render optimization.",
          "Built reusable design system components that reduced feature delivery time across multiple product teams.",
          "Reduced API latency by improving data fetching patterns, caching strategy, and backend integration flow.",
          `Delivered company-ready resume outcomes focused on ${focus}.`,
          "Collaborated with product, design, QA, and backend teams to ship reliable customer-facing features.",
          "Improved customer experience by simplifying critical user journeys and removing friction from key workflows.",
        ].join("\n"),
      },
      {
        id: "studio-exp-2",
        company: isConsultant ? "Enterprise Commerce Client" : "Digital Product Studio",
        jobTitle: level.id === "0-1" ? "Junior Software Engineer" : "Software Engineer",
        location: "Hybrid",
        startDate: level.id === "0-1" ? "2023" : "2018",
        endDate: level.id === "0-1" ? "2024" : "2020",
        currentlyWorking: false,
        description: [
          "Built production-ready web application features with strong attention to accessibility, maintainability, and testing.",
          "Created reusable API integration patterns and improved error handling for customer-facing workflows.",
          "Partnered with stakeholders to translate business requirements into clean technical solutions.",
          "Contributed automated tests and release checks that improved deployment confidence.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        id: "studio-project-1",
        name: "Enterprise Ecommerce Platform",
        role: "Lead Engineer",
        techStack: "Next.js, TypeScript, Stripe, Redis, Vercel",
        url: "",
        description:
          "Built enterprise-scale ecommerce platform supporting high-traffic shopping experiences with performant product discovery, resilient checkout, and optimized user journeys.",
        achievements:
          "Designed modular architecture for product listing, cart, checkout, and payment flows.\nImproved checkout completion by reducing friction and optimizing load performance.\nDelivered reusable commerce components with measurable performance and accessibility improvements.",
      },
      {
        id: "studio-project-2",
        name: isAI ? "AI Learning Hub" : "Analytics Dashboard",
        role: isAI ? "AI Product Engineer" : "Frontend Architect",
        techStack: isAI ? "Next.js, OpenAI API, RAG, AI Agents" : "React, TypeScript, Recharts, REST APIs",
        url: "",
        description: isAI
          ? "Created an AI-assisted learning platform with interactive lessons, generated guidance, and structured learning flows."
          : "Built a dashboard for executive reporting, product analytics, and operational decision-making.",
        achievements: isAI
          ? "Integrated prompt workflows, reusable AI helpers, and evaluation-ready content patterns.\nImproved learning engagement through visual modules and practical examples."
          : "Reduced reporting time by centralizing metrics and improving dashboard performance.\nCreated reusable chart components and role-based data views.",
      },
      {
        id: "studio-project-3",
        name: "Inventory Management Platform",
        role: "Full Stack Developer",
        techStack: "React, Node.js, PostgreSQL, Docker",
        url: "",
        description:
          "Built inventory workflows for stock visibility, product operations, and fulfillment coordination across multiple teams.",
        achievements:
          "Improved inventory accuracy with real-time validation and clearer operational workflows.\nCreated API integrations and dashboards used by internal business teams.",
      },
    ],
    education: [
      {
        id: "studio-education-1",
        institution: "University of Karachi",
        degree: "Bachelor's Degree",
        fieldOfStudy: "Computer Science",
        startYear: "2012",
        endYear: "2016",
        grade: "",
      },
    ],
    skills: Object.entries(skillGroups).map(([name, skills], index) => ({
      id: `studio-skill-${index}`,
      name,
      skills,
    })),
    certifications: [
      {
        id: "studio-cert-1",
        name: isAI ? "AI Engineering Professional Certificate" : "Microsoft Certified: Azure Fundamentals",
        issuer: isAI ? "Professional Learning Program" : "Microsoft",
        year: "2025",
        credentialUrl: "",
      },
      {
        id: "studio-cert-2",
        name: isConsultant ? "Dynamics 365 Commerce Functional Consultant" : "Advanced React Architecture",
        issuer: isConsultant ? "Microsoft" : "Frontend Masters",
        year: "2024",
        credentialUrl: "",
      },
    ],
    selectedTemplate: templateByStyle[templateId] ?? "modern-developer",
    currentStep: 0,
    targetRole: role.title,
    targetCompany: company.name,
    experienceLevel: level.years,
    atsKeywords: [
      ...role.skills,
      "Architecture",
      "Performance Optimization",
      "Accessibility",
      "Testing",
      "CI/CD",
      company.name,
    ],
    sectionOrder: ["summary", "skills", "experience", "projects", "education", "certifications"],
    theme: {
      accentColor: company.id === "amazon" ? "#ff9900" : company.id === "microsoft" ? "#0078d4" : company.id === "google" ? "#2563eb" : "#2563eb",
      fontFamily: templateId === "minimal" ? "Georgia" : "Inter",
      borderRadius: templateId.includes("ats") ? 2 : 8,
      headerStyle: templateId === "sidebar-resume" ? "sidebar" : templateId === "executive" ? "executive" : templateId === "minimal" ? "centered" : "classic",
      sidebarWidth: templateId === "sidebar-resume" || templateId === "modern-developer" ? 34 : 28,
      paperMargin: templateId.includes("ats") ? 28 : 34,
      lineHeight: templateId === "minimal" ? 1.55 : 1.45,
      showIcons: templateId === "modern-developer" || templateId === "sidebar-resume",
    },
    extraSections: [
      {
        id: "studio-extra-achievements",
        title: "Achievements",
        content: "Improved Core Web Vitals by 35%, reduced bundle size by 28%, and helped standardize reusable frontend architecture across multiple enterprise workflows.",
      },
    ],
  };
}

export const projectLibrary = [
  ["Enterprise CRM", "Built a role-based CRM platform with lead tracking, customer notes, reporting dashboards, and secure account management.", "React, Node.js, PostgreSQL", "Reduced sales operations time by 32%."],
  ["Hospital Management System", "Created patient registration, appointment scheduling, billing, and staff workflow modules.", "Next.js, NestJS, MySQL", "Improved appointment visibility and reduced manual coordination."],
  ["Inventory System", "Delivered stock tracking, warehouse operations, reorder alerts, and product movement dashboards.", "React, Node.js, PostgreSQL", "Improved inventory accuracy by 24%."],
  ["E-commerce Platform", "Built product discovery, cart, checkout, payments, and customer account experiences.", "Next.js, Stripe, Redis", "Improved checkout completion by 18%."],
  ["Payment Gateway", "Integrated secure payment flows, retries, reconciliation, and transaction reporting.", "Node.js, Stripe, Webhooks", "Reduced failed payment handling time by 40%."],
  ["Analytics Dashboard", "Created executive dashboards with KPI tracking, filters, and real-time operational reports.", "React, Recharts, REST APIs", "Reduced reporting time by 50%."],
  ["Banking Application", "Built secure account dashboards, transactions, alerts, and support workflows.", "React, TypeScript, Auth", "Improved task completion and customer self-service."],
  ["ERP System", "Designed modules for procurement, approvals, finance workflows, and audit trails.", "Next.js, NestJS, PostgreSQL", "Improved process transparency across teams."],
  ["AI SaaS Platform", "Built AI workflows for content generation, document analysis, and user productivity.", "Next.js, OpenAI API, RAG", "Reduced manual drafting time by 60%."],
  ["Restaurant Management", "Created ordering, reservations, kitchen workflow, and reporting modules.", "React, Node.js, MySQL", "Improved operational visibility for managers."],
  ["Booking System", "Built availability search, booking flows, payment capture, and cancellation workflows.", "Next.js, APIs, Stripe", "Reduced booking friction and support requests."],
  ["Order Management", "Designed order lifecycle tracking, fulfillment status, and customer notifications.", "React, Node.js, Queues", "Improved fulfillment accuracy by 22%."],
  ["Headless Commerce", "Built composable storefront architecture with CMS, checkout, search, and payments.", "Next.js, Commerce APIs, Vercel", "Improved launch speed for new storefronts."],
  ["POS System", "Created retail point-of-sale workflows, product lookup, promotions, and payment capture.", "React, D365 Commerce, APIs", "Improved cashier workflow reliability."],
  ["Customer Portal", "Built account management, support tickets, invoices, and self-service workflows.", "Next.js, TypeScript, REST APIs", "Reduced support workload by 30%."],
].map(([name, description, technologies, impact], index) => ({
  id: `library-project-${index}`,
  name,
  description,
  technologies,
  impact,
  architecture: "Modular frontend, typed API layer, reusable components, observability hooks, and secure data access.",
  responsibilities: "Owned discovery, implementation, testing, performance tuning, and stakeholder demos.",
  businessValue: "Improved operational efficiency, product reliability, and user experience for business-critical workflows.",
}));

export function analyzeResume(resume: ResumeData) {
  const skillCount = resume.skills.reduce((count, category) => count + category.skills.length, 0);
  const hasMetrics = [...resume.experience.map((item) => item.description), ...resume.projects.map((item) => item.achievements)].join(" ").match(/\d|%|reduced|improved|increased/i);
  const score = Math.min(
    98,
    48 +
      (resume.summary ? 10 : 0) +
      (resume.experience.length > 0 ? 12 : 0) +
      (resume.projects.length > 0 ? 10 : 0) +
      (skillCount >= 10 ? 10 : skillCount) +
      (hasMetrics ? 8 : 0),
  );

  return {
    score,
    formatting: resume.selectedTemplate === "ats-professional" ? 5 : 4,
    keywords: skillCount >= 12 ? 5 : 4,
    projects: resume.projects.length >= 2 ? 5 : 3,
    summary: resume.summary.length > 140 ? 5 : 4,
    skills: skillCount >= 14 ? 5 : 4,
    improvements: [
      score < 90 ? "Add more measurable achievements with numbers or percentages." : "Resume has strong measurable impact.",
      skillCount < 14 ? "Add missing role-specific skills from the suggestions panel." : "Skills section is strong for ATS scanning.",
      resume.projects.length < 3 ? "Add one more project with architecture, responsibilities, and metrics." : "Projects show strong technical depth.",
    ],
  };
}

export function getMissingSkills(roleId: string, companyId: string) {
  if (roleId.includes("frontend") || companyId === "google") {
    return ["GraphQL", "Storybook", "Playwright", "Design Systems", "Accessibility", "Webpack", "Module Federation"];
  }
  if (companyId === "openai" || roleId.includes("ai")) {
    return ["RAG", "Vector Databases", "Prompt Evaluation", "OpenAI API", "AI Agents", "MCP"];
  }
  if (companyId === "amazon") {
    return ["Operational Excellence", "Ownership", "Customer Obsession", "Distributed Systems", "Metrics"];
  }
  return ["System Design", "Testing", "CI/CD", "Observability", "Performance Optimization"];
}
