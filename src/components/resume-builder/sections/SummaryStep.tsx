"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "../FormControls";
import {
  companySummaryVersion,
  improveSummary,
  makeSeniorSummary,
  makeTechnicalSummary,
  rewriteSummary,
  shortenSummary,
} from "@/lib/resume-ai-mock";

export function SummaryStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const actions: Array<[string, () => string]> = [
    ["Improve", () => improveSummary(value)],
    ["Rewrite", () => rewriteSummary(value)],
    ["Make Senior", () => makeSeniorSummary(value)],
    ["Google Version", () => companySummaryVersion("Google", value)],
    ["Amazon Version", () => companySummaryVersion("Amazon", value)],
    ["Microsoft Version", () => companySummaryVersion("Microsoft", value)],
    ["Shorter", () => shortenSummary(value)],
    ["More Technical", () => makeTechnicalSummary(value)],
  ];

  return (
    <div className="space-y-4">
      <TextField
        label="Professional Summary"
        placeholder="Senior Full Stack JavaScript Developer with experience building React, Next.js, and enterprise commerce applications."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {!value.trim() && <p className="text-sm text-muted-foreground">Recommended: add a short summary that explains your role, strengths, and impact.</p>}
      <div className="flex flex-wrap gap-2">
        {actions.map(([label, action]) => (
          <Button key={label} type="button" onClick={() => onChange(action())} className="rounded-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
