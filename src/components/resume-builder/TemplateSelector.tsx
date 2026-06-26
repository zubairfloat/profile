"use client";

import { BadgeCheck, Bot, BriefcaseBusiness, Code2, FileText, Search, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeTemplate } from "@/types/resume-builder";

const templates: Array<{
  id: ResumeTemplate;
  name: string;
  description: string;
  icon: typeof Code2;
}> = [
  {
    id: "modern-ats",
    name: "Modern ATS",
    description: "Modern hierarchy with ATS-safe sections.",
    icon: FileText,
  },
  {
    id: "professional-ats",
    name: "Professional ATS",
    description: "Recruiter-friendly single column layout.",
    icon: BadgeCheck,
  },
  {
    id: "timeline-resume",
    name: "Timeline Resume",
    description: "Chronological layout with stronger career flow.",
    icon: Sparkles,
  },
  {
    id: "executive",
    name: "Executive Resume",
    description: "Leadership, strategy, and senior impact.",
    icon: Users,
  },
  {
    id: "sidebar-resume",
    name: "Sidebar Resume",
    description: "Sidebar contact and skill layout.",
    icon: BriefcaseBusiness,
  },
  {
    id: "google-style",
    name: "Google Style",
    description: "Impact, scale, architecture, and metrics.",
    icon: Search,
  },
  {
    id: "microsoft-style",
    name: "Microsoft Style",
    description: "Enterprise delivery, cloud, and collaboration.",
    icon: BriefcaseBusiness,
  },
  {
    id: "amazon-style",
    name: "Amazon Style",
    description: "Ownership, customer obsession, and STAR impact.",
    icon: BadgeCheck,
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Balanced technical depth and delivery impact.",
    icon: Code2,
  },
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    description: "UI craft, performance, accessibility, and design systems.",
    icon: Code2,
  },
  {
    id: "react-developer",
    name: "React Developer",
    description: "React architecture, hooks, state, and components.",
    icon: Code2,
  },
  {
    id: "full-stack-developer",
    name: "Full Stack Developer",
    description: "Frontend, APIs, database, and cloud delivery.",
    icon: Code2,
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    description: "LLMs, RAG, agents, and AI product systems.",
    icon: Bot,
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    description: "Cloud, CI/CD, reliability, and automation.",
    icon: BriefcaseBusiness,
  },
  {
    id: "minimal-resume",
    name: "Minimal Resume",
    description: "Simple typography-focused resume.",
    icon: Sparkles,
  },
  {
    id: "modern-developer",
    name: "Modern Developer",
    description: "Clean two-column layout for technical resumes.",
    icon: Code2,
  },
  {
    id: "ats-professional",
    name: "ATS Professional",
    description: "Single-column layout for job applications.",
    icon: FileText,
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Typography-focused and simple.",
    icon: Sparkles,
  },
  {
    id: "senior-engineer",
    name: "Senior Engineer",
    description: "Highlights leadership and architecture.",
    icon: BadgeCheck,
  },
  {
    id: "enterprise-consultant",
    name: "Enterprise Consultant",
    description: "Built for consulting and client impact.",
    icon: BriefcaseBusiness,
  },
];

export function TemplateSelector({
  selectedTemplate,
  onSelect,
}: {
  selectedTemplate: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {templates.map((template) => {
        const Icon = template.icon;
        const selected = selectedTemplate === template.id;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "rounded-lg border border-white/10 bg-background/55 p-4 text-left transition-colors hover:border-primary/40",
              selected && "border-primary/60 bg-primary/10",
            )}
          >
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <p className="font-semibold">{template.name}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}
