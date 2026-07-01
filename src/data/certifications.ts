import type { LucideIcon } from "lucide-react";
import { Bot, BrainCircuit, Cloud, Hexagon } from "lucide-react";

export type CertificationProviderId =
  | "aws"
  | "microsoft"
  | "azure"
  | "anthropic"
  | "google";

export type CertificationLesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  available: boolean;
  href: string;
  tags: string[];
};

export type CertificationProvider = {
  id: CertificationProviderId;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  lessons: CertificationLesson[];
};

export const certificationProviders: CertificationProvider[] = [
  {
    id: "aws",
    title: "AWS",
    description: "Cloud Practitioner, Solutions Architect, developer, and cloud foundations learning paths.",
    icon: Cloud,
    href: "/learning/certifications/aws",
    lessons: [
      {
        id: "aws-cloud-practitioner",
        slug: "cloud-practitioner",
        title: "AWS Cloud Practitioner",
        description:
          "Start with cloud fundamentals, service models, high availability, elasticity, disaster recovery, and shared responsibility.",
        difficulty: "Beginner",
        readTime: "35 minutes",
        available: true,
        href: "/learning/certifications/aws/cloud-practitioner",
        tags: ["AWS", "CLF-C02", "Cloud Fundamentals"],
      },
    ],
  },
  {
    id: "microsoft",
    title: "Microsoft",
    description: "Microsoft fundamentals and role-based certification learning paths.",
    icon: Hexagon,
    href: "/learning/certifications/microsoft",
    lessons: [],
  },
  {
    id: "azure",
    title: "Azure",
    description: "Azure fundamentals, administrator, developer, and architecture certification tracks.",
    icon: Cloud,
    href: "/learning/certifications/azure",
    lessons: [],
  },
  {
    id: "anthropic",
    title: "Anthropic",
    description: "AI safety, Claude, prompt engineering, and applied AI certification preparation.",
    icon: BrainCircuit,
    href: "/learning/certifications/anthropic",
    lessons: [],
  },
  {
    id: "google",
    title: "Google",
    description: "Google Cloud, AI, data, and professional cloud certification learning paths.",
    icon: Bot,
    href: "/learning/certifications/google",
    lessons: [],
  },
];

export function getCertificationProvider(providerId: string) {
  return certificationProviders.find((provider) => provider.id === providerId);
}
