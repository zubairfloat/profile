import type { ResumeData } from "@/types/resume-builder";
import { BaseResumeTemplate } from "./BaseResumeTemplate";

export function SeniorEngineerTemplate({ resume }: { resume: ResumeData }) {
  return <BaseResumeTemplate resume={resume} variant="senior" />;
}
