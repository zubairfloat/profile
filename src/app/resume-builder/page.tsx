import type { Metadata } from "next";
import { ResumeBuilderPage } from "@/components/resume-builder/ResumeBuilderPage";

export const metadata: Metadata = {
  title: "AI Career Resume Studio | Zubair Rizwan",
  description:
    "Generate an ATS-ready developer resume in under 60 seconds with AI-style onboarding, live preview, ATS scoring, templates, and PDF export.",
};

export default function Page() {
  return <ResumeBuilderPage />;
}
