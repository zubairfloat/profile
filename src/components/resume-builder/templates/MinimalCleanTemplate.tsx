import type { ResumeData } from "@/types/resume-builder";
import { BaseResumeTemplate } from "./BaseResumeTemplate";

export function MinimalCleanTemplate({ resume }: { resume: ResumeData }) {
  return <BaseResumeTemplate resume={resume} variant="minimal" />;
}
