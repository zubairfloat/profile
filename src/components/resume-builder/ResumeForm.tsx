"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "./TemplateSelector";
import { CertificationsStep } from "./sections/CertificationsStep";
import { EducationStep } from "./sections/EducationStep";
import { ExperienceStep } from "./sections/ExperienceStep";
import { PersonalInfoStep } from "./sections/PersonalInfoStep";
import { ProjectsStep } from "./sections/ProjectsStep";
import { SkillsStep } from "./sections/SkillsStep";
import { SummaryStep } from "./sections/SummaryStep";
import { sampleDeveloperResume } from "@/lib/resume-sample-data";
import type { ResumeStore } from "@/types/resume-builder";

const stepTitles = [
  ["Personal Information", "Add your contact details and professional links."],
  ["Professional Summary", "Write a short, clear summary for recruiters."],
  ["Work Experience", "Add your roles, impact, and bullet points."],
  ["Projects", "Show real work, tech stack, and achievements."],
  ["Education", "Add degrees, institutions, and grades if useful."],
  ["Skills", "Group skills so recruiters can scan them quickly."],
  ["Certifications", "Add optional certifications and credentials."],
  ["Template Selection", "Choose a resume design that matches your target role."],
  ["Live Preview", "Review your resume before downloading the PDF."],
];

function getFriendlyWarning(store: ResumeStore) {
  if (!store.personalInfo.fullName || !store.personalInfo.jobTitle) return "Full name and job title are required.";
  if (!store.personalInfo.email.includes("@")) return "Use a valid email address.";
  if (!store.summary.trim()) return "A summary is recommended.";
  if (!store.skills.some((category) => category.skills.length > 0)) return "At least one skill is recommended.";
  if (store.experience.length === 0 && store.projects.length === 0) return "Add at least one experience or project.";
  return "";
}

export function ResumeForm({ store }: { store: ResumeStore }) {
  const [title, subtitle] = stepTitles[store.currentStep] ?? stepTitles[0];
  const warning = getFriendlyWarning(store);

  return (
    <div className="rounded-lg border border-white/10 bg-card/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Step {store.currentStep + 1} of {stepTitles.length}</p>
          <h2 className="mt-1 text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => store.loadResume(sampleDeveloperResume)} className="rounded-full border-white/10">
            <Sparkles className="mr-2 h-4 w-4" />
            Load Sample Developer Resume
          </Button>
          <Button type="button" variant="ghost" onClick={store.resetResume} className="rounded-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Resume
          </Button>
        </div>
      </div>

      {warning && (
        <div className="mb-5 rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
          {warning}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={store.currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {store.currentStep === 0 && <PersonalInfoStep value={store.personalInfo} onChange={store.updatePersonalInfo} />}
          {store.currentStep === 1 && <SummaryStep value={store.summary} onChange={store.updateSummary} />}
          {store.currentStep === 2 && (
            <ExperienceStep
              entries={store.experience}
              onAdd={store.addExperience}
              onUpdate={store.updateExperience}
              onRemove={store.removeExperience}
            />
          )}
          {store.currentStep === 3 && (
            <ProjectsStep
              entries={store.projects}
              onAdd={store.addProject}
              onUpdate={store.updateProject}
              onRemove={store.removeProject}
            />
          )}
          {store.currentStep === 4 && (
            <EducationStep
              entries={store.education}
              onAdd={store.addEducation}
              onUpdate={store.updateEducation}
              onRemove={store.removeEducation}
            />
          )}
          {store.currentStep === 5 && (
            <SkillsStep
              categories={store.skills}
              onAddCategory={() => store.addSkillCategory()}
              onUpdate={store.updateSkills}
              onAddSkill={store.addSkillToCategory}
            />
          )}
          {store.currentStep === 6 && (
            <CertificationsStep
              entries={store.certifications}
              onAdd={store.addCertification}
              onUpdate={store.updateCertification}
              onRemove={store.removeCertification}
            />
          )}
          {store.currentStep === 7 && <TemplateSelector selectedTemplate={store.selectedTemplate} onSelect={store.setTemplate} />}
          {store.currentStep === 8 && (
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-6">
              <h3 className="text-xl font-bold">Your resume preview is ready.</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Review the live preview, switch templates if needed, then download your professional PDF.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
        <Button type="button" variant="outline" onClick={store.previousStep} disabled={store.currentStep === 0} className="rounded-full border-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="button" onClick={store.nextStep} disabled={store.currentStep === stepTitles.length - 1} className="rounded-full">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
