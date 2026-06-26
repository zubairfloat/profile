import type { ResumeData } from "@/types/resume-builder";
import { BaseResumeTemplate } from "./BaseResumeTemplate";

export function ATSProfessionalTemplate({ resume }: { resume: ResumeData }) {
  return <BaseResumeTemplate resume={resume} variant="ats" />;
}
