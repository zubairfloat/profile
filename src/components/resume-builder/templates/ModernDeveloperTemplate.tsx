import type { ResumeData } from "@/types/resume-builder";
import { BaseResumeTemplate } from "./BaseResumeTemplate";

export function ModernDeveloperTemplate({ resume }: { resume: ResumeData }) {
  return <BaseResumeTemplate resume={resume} variant="modern" />;
}
