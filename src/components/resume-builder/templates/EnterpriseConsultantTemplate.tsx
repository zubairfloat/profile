import type { ResumeData } from "@/types/resume-builder";
import { BaseResumeTemplate } from "./BaseResumeTemplate";

export function EnterpriseConsultantTemplate({ resume }: { resume: ResumeData }) {
  return <BaseResumeTemplate resume={resume} variant="consultant" />;
}
