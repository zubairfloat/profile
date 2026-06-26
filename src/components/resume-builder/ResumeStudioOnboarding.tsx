"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Building2,
  Copy,
  Download,
  FileText,
  Gauge,
  Plus,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  analyzeResume,
  careerRoles,
  experienceLevels,
  generateStudioResume,
  getMissingSkills,
  targetCompanies,
} from "@/lib/resume-studio-generator";
import type { ResumeStore } from "@/types/resume-builder";

const styleCards = [
  { id: "modern-ats", name: "Modern ATS", description: "Modern hierarchy with ATS-safe structure.", icon: FileText },
  { id: "professional-ats", name: "Professional ATS", description: "Recruiter-friendly single column format.", icon: Gauge },
  { id: "timeline-resume", name: "Timeline Resume", description: "Career progression with strong chronology.", icon: Star },
  { id: "executive", name: "Executive Resume", description: "Leadership, architecture, and strategic impact.", icon: BadgeCheck },
  { id: "sidebar-resume", name: "Sidebar Resume", description: "Two-column resume with scan-friendly sidebar.", icon: FileText },
  { id: "google-style", name: "Google Style", description: "Scale, metrics, engineering depth.", icon: Target },
  { id: "microsoft-style", name: "Microsoft Style", description: "Enterprise, consulting, cloud architecture.", icon: BriefcaseBusiness },
  { id: "amazon-style", name: "Amazon Style", description: "Ownership, STAR, customer obsession.", icon: Building2 },
  { id: "software-engineer", name: "Software Engineer", description: "Balanced technical impact and delivery.", icon: FileText },
  { id: "frontend-developer", name: "Frontend Developer", description: "UI craft, accessibility, and performance.", icon: FileText },
  { id: "react-developer", name: "React Developer", description: "React architecture and component systems.", icon: FileText },
  { id: "full-stack-developer", name: "Full Stack Developer", description: "Frontend, APIs, data, and cloud delivery.", icon: FileText },
  { id: "ai-engineer", name: "AI Engineer", description: "LLMs, RAG, agents, and AI systems.", icon: Bot },
  { id: "devops-engineer", name: "DevOps Engineer", description: "Cloud automation and release reliability.", icon: Building2 },
  { id: "minimal-resume", name: "Minimal Resume", description: "Simple typography with premium spacing.", icon: Star },
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1 text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={cn("h-4 w-4", index < value ? "fill-current" : "opacity-30")} />
      ))}
    </div>
  );
}

export function ResumeStudioOnboarding({
  store,
  onDownload,
  onOpenEditor,
}: {
  store: ResumeStore;
  onDownload: () => void;
  onOpenEditor: () => void;
}) {
  const [roleId, setRoleId] = useState("frontend-developer");
  const [levelId, setLevelId] = useState("7-10");
  const [companyId, setCompanyId] = useState("google");
  const [styleId, setStyleId] = useState("modern-developer");
  const [studioStep, setStudioStep] = useState(0);
  const [drafts, setDrafts] = useState(["Resume 1"]);
  const analysis = analyzeResume(store);
  const missingSkills = getMissingSkills(roleId, companyId);

  function generateResume() {
    store.loadResume(generateStudioResume({ roleId, levelId, companyId, templateId: styleId }));
    setStudioStep(4);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {["Who are you?", "Experience", "Target Company", "Resume Style"].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStudioStep(index)}
            className={cn(
              "rounded-lg border border-white/10 bg-card/45 p-4 text-left backdrop-blur-xl transition-colors hover:border-primary/40",
              studioStep === index && "border-primary/60 bg-primary/10",
            )}
          >
            <p className="text-xs font-semibold uppercase text-muted-foreground">Step {index + 1}</p>
            <p className="mt-1 font-semibold">{label}</p>
          </button>
        ))}
      </div>

      {studioStep === 0 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {careerRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setRoleId(role.id)}
              className={cn(
                "rounded-lg border border-white/10 bg-card/45 p-5 text-left shadow-xl shadow-black/10 backdrop-blur-xl transition-colors hover:border-primary/40",
                roleId === role.id && "border-primary/60 bg-primary/10",
              )}
            >
              <Rocket className="mb-4 h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{role.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/10">{role.salaryRange}</Badge>
                <Badge className="bg-primary/20 text-primary">{role.demandLevel}</Badge>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{role.skills.join(" · ")}</p>
            </button>
          ))}
        </motion.section>
      )}

      {studioStep === 1 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-5">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setLevelId(level.id)}
              className={cn(
                "rounded-lg border border-white/10 bg-card/45 p-6 text-left backdrop-blur-xl transition-colors hover:border-primary/40",
                levelId === level.id && "border-primary/60 bg-primary/10",
              )}
            >
              <p className="text-4xl font-bold text-primary">{level.label}</p>
              <p className="mt-2 font-semibold">{level.years}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{level.description}</p>
            </button>
          ))}
        </motion.section>
      )}

      {studioStep === 2 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {targetCompanies.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => setCompanyId(company.id)}
              className={cn(
                "rounded-lg border border-white/10 bg-card/45 p-5 text-left backdrop-blur-xl transition-colors hover:border-primary/40",
                companyId === company.id && "border-primary/60 bg-primary/10",
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-background/60 font-bold text-primary">
                {company.name.slice(0, 2)}
              </div>
              <h3 className="text-lg font-bold">{company.name}</h3>
              <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Hiring Style</p>
              <p className="text-sm leading-6">{company.hiringStyle}</p>
              <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Resume Preference</p>
              <p className="text-sm leading-6">{company.resumePreference}</p>
              <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Interview Focus</p>
              <p className="text-sm leading-6">{company.interviewFocus}</p>
            </button>
          ))}
        </motion.section>
      )}

      {studioStep === 3 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-3">
          {styleCards.map((style) => {
            const Icon = style.icon;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setStyleId(style.id)}
                className={cn(
                  "rounded-lg border border-white/10 bg-card/45 p-5 text-left backdrop-blur-xl transition-colors hover:border-primary/40",
                  styleId === style.id && "border-primary/60 bg-primary/10",
                )}
              >
                <Icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold">{style.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{style.description}</p>
              </button>
            );
          })}
        </motion.section>
      )}

      <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Generate a complete resume instantly</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              The studio writes your summary, skills, enterprise projects, experience bullets, ATS keywords, education, certifications, and company-specific focus.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateResume} size="lg" className="rounded-full font-semibold">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Resume
            </Button>
            <Button onClick={onOpenEditor} variant="outline" size="lg" className="rounded-full border-white/10">
              Edit Studio
            </Button>
            <Button onClick={onDownload} variant="outline" size="lg" className="rounded-full border-white/10">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">ATS Resume Analyzer</h2>
              <p className="text-sm text-muted-foreground">Live score based on summary, keywords, skills, projects, and impact.</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{analysis.score}%</p>
              <p className="text-xs text-muted-foreground">ATS Score</p>
            </div>
          </div>
          <Progress value={analysis.score} />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["Formatting", analysis.formatting],
              ["Keywords", analysis.keywords],
              ["Projects", analysis.projects],
              ["Summary", analysis.summary],
              ["Skills", analysis.skills],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="mb-2 text-sm font-semibold">{label}</p>
                <Stars value={value as number} />
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {analysis.improvements.map((item) => (
              <p key={item} className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
          <h2 className="text-2xl font-bold">Missing Skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">Click + to add company-specific keywords.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => store.addSkillToCategory("ATS Keywords", skill)}
                className="rounded-full border border-white/10 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Plus className="mr-1 inline h-3.5 w-3.5" />
                {skill}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-white/10 bg-background/50 p-4">
            <h3 className="font-semibold">Company Specific Focus</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {targetCompanies.find((company) => company.id === companyId)?.resumePreference}
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-bold">My Resumes</h2>
          <div className="mt-4 space-y-2">
            {drafts.map((draft, index) => (
              <div key={draft} className="flex items-center justify-between rounded-md border border-white/10 bg-background/50 p-3 text-sm">
                <span>{draft}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDrafts((items) => [...items, `${draft} Copy`])}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDrafts((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full rounded-full" onClick={() => setDrafts((items) => [...items, `Resume ${items.length + 1}`])}>
            Create Resume
          </Button>
        </section>

        <section className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-bold">Studio Dashboard</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["Templates", "9 premium styles"],
              ["ATS Score", `${analysis.score}%`],
              ["Downloads", "PDF · Print · Share"],
              ["Interview Prep", "Generated from resume"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-background/50 p-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-primary">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-bold">Interview Preparation</h2>
          <div className="mt-4 space-y-2 text-sm">
            {["Behavior Questions", "Technical Questions", "React Questions", "Node Questions", "System Design Questions", "Company Questions"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-background/50 p-3">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
