"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Field } from "../FormControls";
import type { PersonalInfo } from "@/types/resume-builder";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  jobTitle: z.string().min(1, "Job title is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
  github: z.string(),
  portfolio: z.string(),
});

export function PersonalInfoStep({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (value: Partial<PersonalInfo>) => void;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    values: value,
  });

  useEffect(() => {
    const subscription = watch((formValue) => onChange(formValue as Partial<PersonalInfo>));
    return () => subscription.unsubscribe();
  }, [onChange, watch]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Full Name" placeholder="Muhammad Zubair Rizwan" error={errors.fullName?.message} {...register("fullName")} />
      <Field label="Job Title" placeholder="Senior Full Stack Developer" error={errors.jobTitle?.message} {...register("jobTitle")} />
      <Field label="Email" placeholder="name@email.com" error={errors.email?.message} {...register("email")} />
      <Field label="Phone" placeholder="+92 300 0000000" {...register("phone")} />
      <Field label="Location" placeholder="Karachi, Pakistan" {...register("location")} />
      <Field label="LinkedIn" placeholder="linkedin.com/in/username" {...register("linkedin")} />
      <Field label="GitHub" placeholder="github.com/username" {...register("github")} />
      <Field label="Portfolio Website" placeholder="yourdomain.dev" {...register("portfolio")} />
    </div>
  );
}
