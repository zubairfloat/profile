"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "../FormControls";
import type { CertificationEntry } from "@/types/resume-builder";

export function CertificationsStep({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: {
  entries: CertificationEntry[];
  onAdd: () => void;
  onUpdate: (id: string, value: Partial<CertificationEntry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {entries.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/15 bg-background/40 p-6 text-sm text-muted-foreground">
          Certifications are optional. If you do not have any, this section will stay hidden in the resume preview.
        </div>
      )}
      {entries.map((entry, index) => (
        <div key={entry.id} className="rounded-lg border border-white/10 bg-background/45 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Certification {index + 1}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Certification Name" value={entry.name} onChange={(event) => onUpdate(entry.id, { name: event.target.value })} />
            <Field label="Issuer" value={entry.issuer} onChange={(event) => onUpdate(entry.id, { issuer: event.target.value })} />
            <Field label="Year" value={entry.year} onChange={(event) => onUpdate(entry.id, { year: event.target.value })} />
            <Field label="Credential URL" value={entry.credentialUrl} onChange={(event) => onUpdate(entry.id, { credentialUrl: event.target.value })} />
          </div>
        </div>
      ))}
      <Button type="button" onClick={onAdd} className="rounded-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  );
}
