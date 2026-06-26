"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, TextField } from "../FormControls";
import { generateExperienceBullets, quantifyExperienceBullets } from "@/lib/resume-ai-mock";
import type { ExperienceEntry } from "@/types/resume-builder";

export function ExperienceStep({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: {
  entries: ExperienceEntry[];
  onAdd: () => void;
  onUpdate: (id: string, value: Partial<ExperienceEntry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {entries.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/15 bg-background/40 p-6 text-sm text-muted-foreground">
          Add at least one experience, or add a strong project if you are early in your career.
        </div>
      )}
      {entries.map((entry, index) => (
        <div key={entry.id} className="rounded-lg border border-white/10 bg-background/45 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Experience {index + 1}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company Name" value={entry.company} onChange={(event) => onUpdate(entry.id, { company: event.target.value })} />
            <Field label="Job Title" value={entry.jobTitle} onChange={(event) => onUpdate(entry.id, { jobTitle: event.target.value })} />
            <Field label="Location" value={entry.location} onChange={(event) => onUpdate(entry.id, { location: event.target.value })} />
            <Field label="Start Date" value={entry.startDate} onChange={(event) => onUpdate(entry.id, { startDate: event.target.value })} />
            <Field label="End Date" value={entry.endDate} disabled={entry.currentlyWorking} onChange={(event) => onUpdate(entry.id, { endDate: event.target.value })} />
            <label className="flex items-center gap-3 rounded-md border border-white/10 bg-background/50 p-3 text-sm">
              <Checkbox checked={entry.currentlyWorking} onCheckedChange={(checked) => onUpdate(entry.id, { currentlyWorking: Boolean(checked) })} />
              Currently Working
            </label>
          </div>
          <div className="mt-4 space-y-3">
            <TextField
              label="Description / Bullet Points"
              value={entry.description}
              onChange={(event) => onUpdate(entry.id, { description: event.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: generateExperienceBullets(entry.jobTitle) })} className="rounded-full border-white/10">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Bullet Points
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: quantifyExperienceBullets(entry.jobTitle) })} className="rounded-full border-white/10">
                <Sparkles className="mr-2 h-4 w-4" />
                Quantify Achievements
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: quantifyExperienceBullets(entry.jobTitle) })} className="rounded-full border-white/10">
                Rewrite
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: quantifyExperienceBullets(entry.jobTitle) })} className="rounded-full border-white/10">
                Improve
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" onClick={onAdd} className="rounded-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
}
