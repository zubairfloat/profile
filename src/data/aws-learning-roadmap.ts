export type AwsRoadmapLesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  status: "Completed" | "In Progress" | "Not Started" | "Coming Soon";
  available: boolean;
};

export type AwsRoadmapWeek = {
  week: string;
  title: string;
  description: string;
  estimatedHours: string;
  lessons: AwsRoadmapLesson[];
  plannedTopics: string[];
};

export const awsLearningRoadmap: AwsRoadmapWeek[] = [
  {
    week: "Week 1",
    title: "Cloud Fundamentals",
    description:
      "Learn the cloud basics first before touching AWS services, then understand why companies move from on-premises infrastructure to AWS.",
    estimatedHours: "8-10 hours",
    plannedTopics: [],
    lessons: [
      {
        id: "what-is-cloud-computing",
        slug: "what-is-cloud-computing",
        title: "What is Cloud Computing?",
        description:
          "Understand cloud computing, on-demand resources, and why companies move away from physical servers.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "In Progress",
        available: true,
      },
      {
        id: "benefits-of-cloud",
        slug: "benefits-of-cloud",
        title: "Benefits of Cloud",
        description:
          "Learn pay-as-you-go pricing, agility, global reach, reliability, security, and speed.",
        difficulty: "Beginner",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "types-of-cloud",
        slug: "types-of-cloud",
        title: "Types of Cloud",
        description:
          "Compare public, private, and hybrid cloud models at a certification-friendly level.",
        difficulty: "Beginner",
        duration: "9 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "public-cloud",
        slug: "public-cloud",
        title: "Public Cloud",
        description:
          "See how AWS provides shared cloud infrastructure with isolated customer environments.",
        difficulty: "Beginner",
        duration: "7 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "private-cloud",
        slug: "private-cloud",
        title: "Private Cloud",
        description:
          "Understand dedicated cloud environments and when organizations choose private cloud patterns.",
        difficulty: "Beginner",
        duration: "7 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "hybrid-cloud",
        slug: "hybrid-cloud",
        title: "Hybrid Cloud",
        description:
          "Learn how on-premises systems can connect with AWS for migration and enterprise workloads.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "cloud-service-models",
        slug: "cloud-service-models",
        title: "Cloud Service Models",
        description:
          "Build the mental model for IaaS, PaaS, and SaaS before comparing individual services.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "iaas",
        slug: "iaas",
        title: "IaaS",
        description:
          "Learn Infrastructure as a Service and why Amazon EC2 is the classic exam example.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "paas",
        slug: "paas",
        title: "PaaS",
        description:
          "Understand managed platforms that let developers focus more on application code.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "saas",
        slug: "saas",
        title: "SaaS",
        description:
          "Learn Software as a Service and how it differs from managing infrastructure or platforms.",
        difficulty: "Beginner",
        duration: "7 min",
        status: "Not Started",
        available: true,
      },
    ],
  },
  {
    week: "Week 2",
    title: "Core AWS Services",
    description:
      "Compute, storage, databases, and networking services that appear in almost every exam.",
    estimatedHours: "8-12 hours",
    lessons: [],
    plannedTopics: ["EC2", "S3", "VPC", "Lambda", "RDS", "EBS", "CloudFront", "ECS", "EKS"],
  },
  {
    week: "Week 3",
    title: "Security + Monitoring",
    description:
      "Identity, monitoring, audit logging, encryption, and security services that are heavily tested.",
    estimatedHours: "6-9 hours",
    lessons: [],
    plannedTopics: [
      "IAM",
      "CloudWatch",
      "CloudTrail",
      "AWS Config",
      "KMS",
      "Secrets Manager",
      "Organizations",
      "GuardDuty",
    ],
  },
  {
    week: "Week 4",
    title: "Billing + Architecture",
    description:
      "Cost tools, support plans, trusted guidance, and Well-Architected design thinking.",
    estimatedHours: "6-8 hours",
    lessons: [],
    plannedTopics: [
      "Pricing",
      "Cost Explorer",
      "Budgets",
      "Trusted Advisor",
      "Well Architected Framework",
      "Architectural Patterns",
    ],
  },
];
