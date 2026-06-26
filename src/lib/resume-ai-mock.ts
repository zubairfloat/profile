export function improveSummary(summary: string) {
  if (!summary.trim()) {
    return "Senior Full Stack JavaScript Developer with experience building scalable React, Next.js, and Node.js applications for enterprise commerce platforms, with a focus on clean architecture, performance, and measurable business impact.";
  }

  return `Developed scalable ${summary.replace(/\.$/, "")}, with reusable components, optimized performance, clear engineering practices, and improved user experience across enterprise workflows.`;
}

export function rewriteSummary(summary: string) {
  return `${summary || "Experienced software engineer"} with a strong record of delivering reliable, scalable, and user-focused software. Skilled at turning business goals into clean technical solutions, improving performance, and collaborating across product, design, and engineering teams.`;
}

export function makeSeniorSummary(summary: string) {
  return `${summary || "Senior software engineer"} with senior-level ownership across architecture, delivery, mentoring, and production quality. Experienced in leading complex initiatives, improving engineering standards, and delivering measurable business outcomes for enterprise applications.`;
}

export function companySummaryVersion(company: "Google" | "Amazon" | "Microsoft", summary: string) {
  const focus = {
    Google: "scale, architecture, measurable impact, and engineering depth",
    Amazon: "ownership, customer obsession, operational excellence, and quantified outcomes",
    Microsoft: "enterprise architecture, cloud delivery, consulting, collaboration, and customer value",
  }[company];

  return `${summary || "Experienced software engineer"} with a strong focus on ${focus}. Delivered reliable software systems, improved product quality, and partnered with cross-functional teams to solve complex business problems.`;
}

export function shortenSummary(summary: string) {
  return summary
    ? summary.split(".").filter(Boolean).slice(0, 2).join(". ") + "."
    : "Software engineer focused on scalable applications, clean architecture, and measurable product impact.";
}

export function makeTechnicalSummary(summary: string) {
  return `${summary || "Software engineer"} Experienced with React, Next.js, TypeScript, Node.js, API integrations, testing, CI/CD, performance optimization, accessibility, and production debugging.`;
}

export function generateExperienceBullets(role?: string) {
  const focus = role?.trim() || "software engineer";
  return [
    `Delivered production-ready features as a ${focus}, improving application reliability and user experience.`,
    "Built reusable components and service integrations that reduced delivery time across multiple product flows.",
    "Collaborated with cross-functional teams to translate business requirements into maintainable technical solutions.",
  ].join("\n");
}

export function quantifyExperienceBullets(role?: string) {
  const focus = role?.trim() || "software engineer";
  return [
    `Delivered scalable features as a ${focus}, improving feature delivery speed by 30%.`,
    "Improved Lighthouse score by 35% through render optimization, lazy loading, and asset improvements.",
    "Reduced API latency by 25% by optimizing request flow, caching strategy, and service boundaries.",
    "Built reusable design system components used across 8+ product workflows.",
    "Increased checkout completion by simplifying critical user journeys and improving form reliability.",
    "Collaborated with product, design, QA, and backend teams to ship high-quality releases on schedule.",
  ].join("\n");
}

export function improveProjectDescription(description: string) {
  if (!description.trim()) {
    return "Built a scalable application with reusable React components, clean API integration, responsive UI, and performance-focused architecture for real-world users.";
  }

  return `${description.replace(/\.$/, "")}. Improved the solution with reusable architecture, clear data flow, responsive UI, and production-focused performance practices.`;
}

export function generateEnterpriseProject() {
  return {
    name: "Enterprise Ecommerce Platform",
    role: "Lead Engineer",
    techStack: "Next.js, TypeScript, Stripe, Redis, Vercel",
    description:
      "Built enterprise-scale ecommerce platform supporting millions of users with high-performance checkout, optimized shopping experience, resilient integrations, and scalable frontend architecture.",
    achievements:
      "Designed modular architecture for product listing, cart, checkout, and payment workflows.\nImproved checkout performance and reduced user friction with optimized forms and lazy-loaded sections.\nDelivered reusable commerce components, analytics events, and accessibility improvements across multiple pages.",
  };
}

export function seniorProjectVersion(description: string) {
  return `${description || "Built a production-ready platform"}. Led architecture decisions, aligned teams around reusable patterns, improved performance, and delivered measurable business impact through scalable engineering practices.`;
}

export function suggestMissingSkills() {
  return ["GraphQL", "Storybook", "Playwright", "Design Systems", "Accessibility", "Webpack", "Module Federation"];
}

export const skillSuggestions = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  Backend: ["Node.js", "Express", "NestJS", "REST APIs"],
  Database: ["MongoDB", "PostgreSQL", "MySQL"],
  Cloud: ["AWS", "Vercel", "Docker"],
  Testing: ["Jest", "React Testing Library", "Cypress"],
  AI: ["Prompt Engineering", "RAG", "AI Agents"],
};
