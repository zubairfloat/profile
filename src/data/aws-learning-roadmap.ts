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
    lessons: [
      {
        id: "amazon-ec2",
        slug: "amazon-ec2",
        title: "Amazon EC2",
        description:
          "Learn virtual servers, instance types, operating system control, and when EC2 is the right compute choice.",
        difficulty: "Beginner",
        duration: "18 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-lambda",
        slug: "aws-lambda",
        title: "AWS Lambda",
        description:
          "Understand serverless, event-driven compute, automatic scaling, triggers, and pay-per-execution pricing.",
        difficulty: "Beginner",
        duration: "16 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-ecs",
        slug: "amazon-ecs",
        title: "Amazon ECS",
        description:
          "Learn AWS-native container orchestration for Docker applications, APIs, and microservices.",
        difficulty: "Intermediate",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-eks",
        slug: "amazon-eks",
        title: "Amazon EKS",
        description:
          "Understand AWS managed Kubernetes and how it compares with ECS for container workloads.",
        difficulty: "Intermediate",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-s3",
        slug: "amazon-s3",
        title: "Amazon S3",
        description:
          "Learn object storage for images, videos, backups, static websites, data lakes, and logs.",
        difficulty: "Beginner",
        duration: "15 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-ebs",
        slug: "amazon-ebs",
        title: "Amazon EBS",
        description:
          "Understand block storage attached to EC2 instances, boot volumes, databases, and application disks.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-efs",
        slug: "amazon-efs",
        title: "Amazon EFS",
        description:
          "Learn shared file storage that multiple EC2 instances can access at the same time.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-s3-glacier",
        slug: "amazon-s3-glacier",
        title: "Amazon S3 Glacier",
        description:
          "Understand low-cost archive storage for compliance records, old backups, and long-term retention.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-rds",
        slug: "amazon-rds",
        title: "Amazon RDS",
        description:
          "Learn managed relational databases for MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server.",
        difficulty: "Beginner",
        duration: "14 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-dynamodb",
        slug: "amazon-dynamodb",
        title: "Amazon DynamoDB",
        description:
          "Understand serverless NoSQL, key-value access patterns, millisecond latency, and automatic scaling.",
        difficulty: "Beginner",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-aurora",
        slug: "amazon-aurora",
        title: "Amazon Aurora",
        description:
          "Learn AWS cloud-native relational database performance, replication, and high availability benefits.",
        difficulty: "Intermediate",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-vpc",
        slug: "amazon-vpc",
        title: "Amazon VPC",
        description:
          "Understand your private AWS network, subnets, routing, gateways, firewalls, and public IPs.",
        difficulty: "Intermediate",
        duration: "20 min",
        status: "Not Started",
        available: true,
      },
    ],
    plannedTopics: ["EC2", "S3", "VPC", "Lambda", "RDS", "EBS", "CloudFront", "ECS", "EKS"],
  },
  {
    week: "Week 3",
    title: "Security + Monitoring",
    description:
      "Identity, monitoring, audit logging, encryption, and security services that are heavily tested.",
    estimatedHours: "6-9 hours",
    lessons: [
      {
        id: "shared-responsibility-security",
        slug: "shared-responsibility-security",
        title: "Shared Responsibility Security",
        description:
          "Understand security of the cloud versus security in the cloud for exam scenarios.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-iam",
        slug: "aws-iam",
        title: "AWS IAM",
        description:
          "Learn how IAM controls who can access AWS resources and what actions they can perform.",
        difficulty: "Beginner",
        duration: "14 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "iam-users-groups-roles",
        slug: "iam-users-groups-roles",
        title: "IAM Users, Groups, and Roles",
        description:
          "Compare long-term identities, grouped permissions, and temporary role-based access.",
        difficulty: "Beginner",
        duration: "16 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "iam-policies-least-privilege",
        slug: "iam-policies-least-privilege",
        title: "IAM Policies + Least Privilege",
        description:
          "Understand JSON permission documents and why users should only receive required permissions.",
        difficulty: "Intermediate",
        duration: "14 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "mfa",
        slug: "mfa",
        title: "Multi-Factor Authentication",
        description:
          "Learn why MFA protects root and administrator accounts with a second verification factor.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "amazon-cloudwatch",
        slug: "amazon-cloudwatch",
        title: "Amazon CloudWatch",
        description:
          "Monitor metrics, logs, dashboards, alarms, and application health in real time.",
        difficulty: "Beginner",
        duration: "14 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-cloudtrail",
        slug: "aws-cloudtrail",
        title: "AWS CloudTrail",
        description:
          "Track AWS API activity, user actions, source IPs, changed resources, and audit logs.",
        difficulty: "Beginner",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-kms",
        slug: "aws-kms",
        title: "AWS KMS",
        description:
          "Understand encryption key management, managed keys, customer managed keys, and rotation.",
        difficulty: "Intermediate",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "data-encryption",
        slug: "data-encryption",
        title: "Data at Rest + Data in Transit",
        description:
          "Compare stored data encryption with network data protection using HTTPS, TLS, SSL, and VPN.",
        difficulty: "Beginner",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
    ],
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
      "Pricing models, cost controls, support plans, Well-Architected design, global infrastructure, architecture patterns, and final exam preparation.",
    estimatedHours: "6-8 hours",
    lessons: [
      {
        id: "aws-billing-cost-management",
        slug: "aws-billing-cost-management",
        title: "Billing & Cost Management",
        description:
          "Understand pay-as-you-go pricing and the core tools for estimating, analyzing, and controlling AWS spend.",
        difficulty: "Beginner",
        duration: "16 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-pricing-calculator",
        slug: "aws-pricing-calculator",
        title: "AWS Pricing Calculator",
        description:
          "Estimate future monthly costs for EC2, S3, RDS, and other AWS services before deployment.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-cost-explorer",
        slug: "aws-cost-explorer",
        title: "AWS Cost Explorer",
        description:
          "Analyze actual AWS spending, service costs, trends, forecasts, and historical usage.",
        difficulty: "Beginner",
        duration: "10 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-budgets",
        slug: "aws-budgets",
        title: "AWS Budgets",
        description:
          "Set spending limits and receive alerts when costs approach or exceed thresholds.",
        difficulty: "Beginner",
        duration: "8 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "aws-support-plans",
        slug: "aws-support-plans",
        title: "AWS Support Plans",
        description:
          "Compare Basic, Developer, Business, and Enterprise support for real exam scenarios.",
        difficulty: "Beginner",
        duration: "14 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "well-architected-framework",
        slug: "well-architected-framework",
        title: "Well-Architected Framework",
        description:
          "Learn the six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.",
        difficulty: "Intermediate",
        duration: "18 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "global-infrastructure",
        slug: "global-infrastructure",
        title: "AWS Global Infrastructure",
        description:
          "Understand Regions, Availability Zones, Edge Locations, Local Zones, and multi-AZ reliability.",
        difficulty: "Beginner",
        duration: "18 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "typical-aws-architecture",
        slug: "typical-aws-architecture",
        title: "AWS Architecture Patterns",
        description:
          "Compare three-tier, serverless, high availability, static website, hybrid, and microservices patterns.",
        difficulty: "Intermediate",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "hands-on-labs",
        slug: "hands-on-labs",
        title: "Hands-On Labs",
        description:
          "Practice EC2, S3, IAM, CloudWatch, RDS, VPC, and Security Groups in the AWS Free Tier.",
        difficulty: "Beginner",
        duration: "20 min",
        status: "Not Started",
        available: true,
      },
      {
        id: "exam-readiness",
        slug: "exam-readiness",
        title: "Exam Readiness",
        description:
          "Review final exam topics, practice question strategy, recommended resources, and readiness criteria.",
        difficulty: "Beginner",
        duration: "12 min",
        status: "Not Started",
        available: true,
      },
    ],
    plannedTopics: [
      "Pricing Models",
      "Pricing",
      "Cost Explorer",
      "Budgets",
      "Billing Dashboard",
      "Trusted Advisor",
      "Well Architected Framework",
      "Global Infrastructure",
      "Architectural Patterns",
      "Practice Exams",
    ],
  },
];
