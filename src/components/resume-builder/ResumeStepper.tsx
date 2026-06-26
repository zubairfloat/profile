"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const resumeSteps = [
  "Personal",
  "Summary",
  "Experience",
  "Projects",
  "Education",
  "Skills",
  "Certifications",
  "Templates",
  "Preview",
];

export function ResumeStepper({
  currentStep,
  completionScore,
  onStepChange,
}: {
  currentStep: number;
  completionScore: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">Resume Completion</span>
        <span className="font-semibold text-primary">{completionScore}%</span>
      </div>
      <Progress value={completionScore} />
      <div className="mt-5 grid grid-cols-3 gap-2 md:grid-cols-5 xl:grid-cols-9">
        {resumeSteps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => onStepChange(index)}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center rounded-md border border-white/10 bg-background/50 px-2 text-center text-xs transition-colors",
              currentStep === index && "border-primary/60 bg-primary/10 text-primary",
              currentStep > index && "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
            )}
          >
            <span className="mb-1 flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
              {currentStep > index ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}
