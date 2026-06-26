"use client";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "../FormControls";
import { skillSuggestions, suggestMissingSkills } from "@/lib/resume-ai-mock";
import type { SkillCategory } from "@/types/resume-builder";

export function SkillsStep({
  categories,
  onAddCategory,
  onUpdate,
  onAddSkill,
}: {
  categories: SkillCategory[];
  onAddCategory: () => void;
  onUpdate: (id: string, value: Partial<SkillCategory>) => void;
  onAddSkill: (category: string, skill: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="font-semibold">Smart Skill Suggestions</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="mb-4 rounded-full"
          onClick={() => suggestMissingSkills().forEach((skill) => onAddSkill("ATS Keywords", skill))}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Suggest Missing Skills
        </Button>
        <div className="space-y-3">
          {Object.entries(skillSuggestions).map(([category, skills]) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{category}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onAddSkill(category, skill)}
                    className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="rounded-lg border border-white/10 bg-background/45 p-4">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <Field label="Category" value={category.name} onChange={(event) => onUpdate(category.id, { name: event.target.value })} />
            <Field
              label="Skills"
              value={category.skills.join(", ")}
              placeholder="React, Next.js, TypeScript"
              onChange={(event) =>
                onUpdate(category.id, {
                  skills: event.target.value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ))}

      <Button type="button" onClick={onAddCategory} className="rounded-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Skill Category
      </Button>
    </div>
  );
}
