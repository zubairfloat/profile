"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "../FormControls";
import type { EducationEntry } from "@/types/resume-builder";

export function EducationStep({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: {
  entries: EducationEntry[];
  onAdd: () => void;
  onUpdate: (id: string, value: Partial<EducationEntry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {entries.map((entry, index) => (
        <div key={entry.id} className="rounded-lg border border-white/10 bg-background/45 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Education {index + 1}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Institution" value={entry.institution} onChange={(event) => onUpdate(entry.id, { institution: event.target.value })} />
            <Field label="Degree" value={entry.degree} onChange={(event) => onUpdate(entry.id, { degree: event.target.value })} />
            <Field label="Field of Study" value={entry.fieldOfStudy} onChange={(event) => onUpdate(entry.id, { fieldOfStudy: event.target.value })} />
            <Field label="Grade" value={entry.grade} onChange={(event) => onUpdate(entry.id, { grade: event.target.value })} />
            <Field label="Start Year" value={entry.startYear} onChange={(event) => onUpdate(entry.id, { startYear: event.target.value })} />
            <Field label="End Year" value={entry.endYear} onChange={(event) => onUpdate(entry.id, { endYear: event.target.value })} />
          </div>
        </div>
      ))}
      <Button type="button" onClick={onAdd} className="rounded-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}
