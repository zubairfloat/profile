import { z } from "zod";

export const budgetOptions = [
  "Under $500",
  "$500-1000",
  "$1000-5000",
  "$5000+",
] as const;

export const timelineOptions = [
  "ASAP",
  "1 Week",
  "1 Month",
  "Flexible",
] as const;

export const serviceOptions = [
  "Frontend Development",
  "Full Stack Development",
  "React",
  "Next.js",
  "Node.js",
  "AI Engineering",
  "Resume Builder",
  "Mentorship",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().max(40, "Phone number is too long.").optional(),
  company: z.string().trim().max(120, "Company name is too long.").optional(),
  country: z.string().trim().max(80, "Country is too long.").optional(),
  budget: z.enum(budgetOptions, {
    required_error: "Select a project budget.",
  }),
  timeline: z.enum(timelineOptions, {
    required_error: "Select a timeline.",
  }),
  service: z.enum(serviceOptions, {
    required_error: "Select a service.",
  }),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(3000, "Message must be 3000 characters or less."),
  honeypot: z.string().max(0, "Spam protection triggered.").optional(),
  startedAt: z.coerce.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactMessageRecord = Omit<ContactFormValues, "honeypot" | "startedAt"> & {
  id?: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
  ip?: string;
  browser?: string;
  operatingSystem?: string;
  referrer?: string;
  userAgent?: string;
  emailSent?: boolean;
  autoReplySent?: boolean;
};
