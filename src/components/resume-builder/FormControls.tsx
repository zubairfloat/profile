"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} className="border-white/10 bg-background/60" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </label>
  );
}

export function TextField({
  label,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="space-y-2">
      <Label>{label}</Label>
      <Textarea {...props} className="min-h-28 border-white/10 bg-background/60" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </label>
  );
}
