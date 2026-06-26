"use client";

import { forwardRef } from "react";
import type { ResumeData } from "@/types/resume-builder";
import { ATSProfessionalTemplate } from "./templates/ATSProfessionalTemplate";
import { EnterpriseConsultantTemplate } from "./templates/EnterpriseConsultantTemplate";
import { MinimalCleanTemplate } from "./templates/MinimalCleanTemplate";
import { ModernDeveloperTemplate } from "./templates/ModernDeveloperTemplate";
import { SeniorEngineerTemplate } from "./templates/SeniorEngineerTemplate";

export const ResumePreview = forwardRef<HTMLDivElement, { resume: ResumeData }>(
  function ResumePreview({ resume }, ref) {
    const Template = {
      "modern-developer": ModernDeveloperTemplate,
      "ats-professional": ATSProfessionalTemplate,
      "minimal-clean": MinimalCleanTemplate,
      "senior-engineer": SeniorEngineerTemplate,
      "enterprise-consultant": EnterpriseConsultantTemplate,
      executive: SeniorEngineerTemplate,
      "google-style": ATSProfessionalTemplate,
      "amazon-style": ATSProfessionalTemplate,
      "microsoft-style": EnterpriseConsultantTemplate,
      "ai-engineer": ModernDeveloperTemplate,
      "modern-ats": ATSProfessionalTemplate,
      "professional-ats": ATSProfessionalTemplate,
      "timeline-resume": SeniorEngineerTemplate,
      "sidebar-resume": ModernDeveloperTemplate,
      "software-engineer": SeniorEngineerTemplate,
      "frontend-developer": ModernDeveloperTemplate,
      "react-developer": ModernDeveloperTemplate,
      "full-stack-developer": EnterpriseConsultantTemplate,
      "devops-engineer": ATSProfessionalTemplate,
      "minimal-resume": MinimalCleanTemplate,
    }[resume.selectedTemplate];

    return (
      <div ref={ref} className="mx-auto w-full max-w-[820px] overflow-hidden rounded-lg bg-white">
        <Template resume={resume} />
      </div>
    );
  },
);
