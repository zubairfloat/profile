"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "../FormControls";
import { generateEnterpriseProject, improveProjectDescription, seniorProjectVersion } from "@/lib/resume-ai-mock";
import type { ProjectEntry } from "@/types/resume-builder";

export function ProjectsStep({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: {
  entries: ProjectEntry[];
  onAdd: () => void;
  onUpdate: (id: string, value: Partial<ProjectEntry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {entries.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/15 bg-background/40 p-6 text-sm text-muted-foreground">
          Projects are powerful for developers. Add production work, portfolio projects, or learning projects with real impact.
        </div>
      )}
      {entries.map((entry, index) => (
        <div key={entry.id} className="rounded-lg border border-white/10 bg-background/45 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Project {index + 1}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project Name" value={entry.name} onChange={(event) => onUpdate(entry.id, { name: event.target.value })} />
            <Field label="Role" value={entry.role} onChange={(event) => onUpdate(entry.id, { role: event.target.value })} />
            <Field label="Tech Stack" value={entry.techStack} onChange={(event) => onUpdate(entry.id, { techStack: event.target.value })} />
            <Field label="Project URL" value={entry.url} onChange={(event) => onUpdate(entry.id, { url: event.target.value })} />
          </div>
          <div className="mt-4 grid gap-4">
            <TextField label="Description" value={entry.description} onChange={(event) => onUpdate(entry.id, { description: event.target.value })} />
            <TextField label="Key Achievements" value={entry.achievements} onChange={(event) => onUpdate(entry.id, { achievements: event.target.value })} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, generateEnterpriseProject())} className="rounded-full border-white/10">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate New Project
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: improveProjectDescription(entry.description) })} className="rounded-full border-white/10">
                Improve
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: improveProjectDescription(entry.description) })} className="rounded-full border-white/10">
                Rewrite
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, { description: seniorProjectVersion(entry.description) })} className="rounded-full border-white/10">
                Senior Version
              </Button>
              <Button type="button" variant="outline" onClick={() => onUpdate(entry.id, generateEnterpriseProject())} className="rounded-full border-white/10">
                Enterprise Version
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" onClick={onAdd} className="rounded-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
}
