"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Boxes,
  Check,
  ChevronRight,
  Clipboard,
  Cloud,
  Code2,
  Coins,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Play,
  RadioTower,
  Route,
  Server,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Terminal,
  User,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type InfrastructureKey = "region" | "az" | "edge" | "local" | "outposts";
type ArchitectureMode = "static" | "serverless" | "commerce";

const stats = ["300+ AWS Services", "Global Regions", "Availability Zones", "Edge Locations", "Enterprise Ready"];

const traditionalVsCloud = [
  {
    title: "Traditional Data Center",
    icon: Server,
    tone: "border-red-300/30 bg-red-500/10 text-red-100",
    points: ["Buy servers", "Maintain hardware", "Manual scaling", "High upfront cost", "Long setup time"],
  },
  {
    title: "AWS Cloud",
    icon: Cloud,
    tone: "border-primary/35 bg-primary/10 text-primary",
    points: ["Rent resources", "Pay as you go", "Auto scaling", "Global availability", "Fast deployment"],
  },
];

const whyAws = [
  ["Faster Deployment", "Launch environments in minutes instead of waiting for hardware."],
  ["Global Scale", "Serve users from many parts of the world with AWS infrastructure."],
  ["Pay-as-you-go Pricing", "Pay for resources as you use them and reduce upfront cost."],
  ["Security", "Use identity, encryption, logging, and network controls from day one."],
  ["Reliability", "Design apps across multiple data centers for better uptime."],
  ["Managed Services", "Let AWS handle backups, patching, scaling, and operations for common services."],
  ["High Availability", "Keep applications running when one server or data center has trouble."],
  ["Disaster Recovery", "Recover systems using backups, replicas, and multi-region plans."],
];

const infrastructure = {
  region: {
    title: "Region",
    label: "us-east-1",
    icon: Globe2,
    description: "A Region is a geographic area, such as us-east-1 or eu-west-1, where AWS runs groups of data centers.",
    use: "Choose a Region close to your users, required by your compliance rules, or connected to services you need.",
    example: "A US retail site might start in us-east-1 and later add eu-west-1 for European customers.",
  },
  az: {
    title: "Availability Zone",
    label: "us-east-1a",
    icon: Layers3,
    description: "An Availability Zone is a separate data center location inside a Region.",
    use: "Use multiple Availability Zones when your app must stay online if one data center has a problem.",
    example: "Run two app servers in different Availability Zones behind one load balancer.",
  },
  edge: {
    title: "Edge Location",
    label: "CloudFront edge",
    icon: RadioTower,
    description: "An Edge Location is a nearby CDN location that serves cached content to users faster.",
    use: "Use Edge Locations through CloudFront for images, videos, frontend files, and cached API responses.",
    example: "A customer in Dubai can load product images from a nearby edge instead of the origin Region.",
  },
  local: {
    title: "Local Zone",
    label: "Low latency metro",
    icon: Network,
    description: "A Local Zone places selected AWS services closer to a specific city or metro area.",
    use: "Use it for workloads that need very low latency near a city, like media editing or realtime apps.",
    example: "A streaming workflow can process video closer to creators in a specific metro area.",
  },
  outposts: {
    title: "Outposts",
    label: "AWS on-premises",
    icon: Boxes,
    description: "Outposts brings AWS-managed hardware into your own data center.",
    use: "Use it when data or latency requirements force part of the workload to stay on premises.",
    example: "A hospital can keep sensitive systems locally while using AWS-style operations.",
  },
} satisfies Record<InfrastructureKey, {
  title: string;
  label: string;
  icon: typeof Cloud;
  description: string;
  use: string;
  example: string;
}>;

const serviceMap = [
  {
    category: "Compute",
    icon: Server,
    text: "Compute runs your application code, virtual machines, containers, and serverless functions.",
    example: "Host a backend API, worker, or image processor.",
    services: ["EC2", "Lambda", "ECS", "EKS"],
  },
  {
    category: "Storage",
    icon: HardDrive,
    text: "Storage keeps files, disks, backups, shared folders, and archived data.",
    example: "Store product images, user uploads, reports, and backups.",
    services: ["S3", "EBS", "EFS", "Glacier"],
  },
  {
    category: "Database",
    icon: Database,
    text: "Databases store structured, key-value, relational, and cached application data.",
    example: "Store users, orders, carts, sessions, and product catalogs.",
    services: ["RDS", "DynamoDB", "Aurora", "ElastiCache"],
  },
  {
    category: "Networking",
    icon: Network,
    text: "Networking connects users, apps, private resources, DNS, and traffic routing.",
    example: "Route a domain to a global storefront and secure private APIs.",
    services: ["VPC", "Route 53", "CloudFront", "Load Balancer"],
  },
  {
    category: "Security",
    icon: ShieldCheck,
    text: "Security controls who can access resources, how secrets are protected, and what activity is logged.",
    example: "Give a Lambda permission to read one table without exposing access keys.",
    services: ["IAM", "KMS", "Secrets Manager", "CloudTrail"],
  },
  {
    category: "Monitoring",
    icon: Activity,
    text: "Monitoring shows logs, metrics, traces, alarms, and application health.",
    example: "Alert the team when API errors or latency increase.",
    services: ["CloudWatch", "X-Ray"],
  },
];

const architectureSteps: Record<ArchitectureMode, Array<{ name: string; detail: string; icon: typeof Cloud }>> = {
  static: [
    { name: "User Browser", detail: "Customer opens your app.", icon: User },
    { name: "Route 53", detail: "DNS sends the domain to AWS.", icon: Route },
    { name: "CloudFront", detail: "CDN serves content close to users.", icon: RadioTower },
    { name: "S3 / Next.js App", detail: "Static files or frontend app are delivered.", icon: Cloud },
    { name: "API Gateway", detail: "API requests enter a managed endpoint.", icon: Network },
    { name: "Lambda", detail: "Backend code runs only when called.", icon: Zap },
    { name: "DynamoDB", detail: "Fast serverless database stores data.", icon: Database },
    { name: "CloudWatch", detail: "Logs and metrics show system health.", icon: Activity },
  ],
  serverless: [
    { name: "Frontend", detail: "React or Next.js interface.", icon: Cloud },
    { name: "API Gateway", detail: "Managed public API endpoint.", icon: Network },
    { name: "Lambda", detail: "Runs business logic without servers.", icon: Zap },
    { name: "DynamoDB", detail: "Stores users, events, or orders.", icon: Database },
  ],
  commerce: [
    { name: "Customer", detail: "Opens the online store.", icon: ShoppingCart },
    { name: "CloudFront", detail: "Fast global delivery.", icon: RadioTower },
    { name: "Next.js Storefront", detail: "Product, cart, and checkout UI.", icon: Cloud },
    { name: "API Gateway", detail: "Routes API calls safely.", icon: Network },
    { name: "Commerce APIs", detail: "Pricing, inventory, cart, and order logic.", icon: Workflow },
    { name: "Database", detail: "Stores catalog, carts, and orders.", icon: Database },
    { name: "Payment Provider", detail: "Authorizes payment securely.", icon: LockKeyhole },
    { name: "Order Confirmation", detail: "Emails, queues, and async events.", icon: Check },
  ],
};

const computeRows = [
  ["EC2", "Backend servers and full control", "Pay for running instances", "Medium", "Hosting a Node.js API"],
  ["Lambda", "Small event-driven tasks", "Pay per request and duration", "Low", "Payment webhook or image processing"],
  ["ECS", "Containerized applications", "Pay for compute behind containers", "Medium", "Containerized Node.js APIs"],
  ["EKS", "Kubernetes workloads", "Cluster and compute cost", "High", "Large platform running Kubernetes"],
];

const storageCards = [
  ["S3", "Store files, images, videos, logs, backups, and static website assets.", "Use S3 for product images in an eCommerce app."],
  ["EBS", "Disk storage attached to EC2, like a hard drive for one virtual server.", "Use EBS for a server that needs persistent disk data."],
  ["EFS", "Shared file system that multiple servers can read and write.", "Use EFS when several EC2 instances need the same files."],
  ["Glacier", "Very cheap long-term backup storage for data you rarely open.", "Move old backups to Glacier using lifecycle rules."],
];

const networkingFlow = ["Domain", "Route 53", "CloudFront", "Load Balancer", "EC2 / API"];
const securityFlow = ["User", "Group", "Policy", "Permission", "AWS Resource"];

const costRules = [
  "Stop unused EC2 instances",
  "Use S3 lifecycle policies",
  "Use CloudFront caching",
  "Use Lambda for occasional workloads",
  "Set billing alerts",
  "Use Savings Plans for predictable workloads",
];

const costMistakes = [
  "Leaving resources running",
  "Overusing large instances",
  "No monitoring",
  "Public data transfer surprises",
  "No cleanup strategy",
];

const beginnerMistakes = [
  ["Using root account", "The root account has too much power for daily work."],
  ["No MFA", "A stolen password is much worse without multi-factor authentication."],
  ["Public S3 bucket", "Private files can become visible to the internet."],
  ["Hardcoded AWS keys", "Keys in code can leak through repos, logs, or screenshots."],
  ["Wrong region", "Latency, cost, and compliance can all be affected."],
  ["No cost alerts", "You may not notice unexpected usage until the bill arrives."],
  ["No monitoring", "Problems stay hidden until users complain."],
  ["Opening all ports", "Security groups should allow only required traffic."],
  ["Not using IAM roles", "Roles avoid long-lived keys on servers and functions."],
  ["Not tagging resources", "Tags help with ownership, cost tracking, and cleanup."],
];

const roadmap = [
  "Cloud Basics",
  "IAM",
  "EC2",
  "S3",
  "VPC",
  "Databases",
  "Lambda",
  "CloudFront",
  "Monitoring",
  "Security",
  "Architecture",
  "Solutions Architect",
];

const codeExamples = [
  {
    title: "AWS CLI Configure",
    code: `aws configure

# AWS Access Key ID
# AWS Secret Access Key
# Default region name: us-east-1
# Default output format: json`,
  },
  {
    title: "Upload File to S3",
    code: `aws s3 cp ./product-image.jpg s3://my-store-assets/products/

aws s3 ls s3://my-store-assets/products/`,
  },
  {
    title: "Simple Lambda Handler",
    code: `export const handler = async (event) => {
  const orderId = event.pathParameters?.orderId;

  return {
    statusCode: 200,
    body: JSON.stringify({ orderId, status: "confirmed" }),
  };
};`,
  },
  {
    title: "Basic IAM Policy",
    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-store-assets/*"
    }
  ]
}`,
  },
  {
    title: "Simple CloudFormation",
    code: `Resources:
  ProductImagesBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-store-product-images
      VersioningConfiguration:
        Status: Enabled`,
  },
];

const quizQuestions = [
  {
    question: "What is an AWS Region?",
    options: ["A geographic area that contains AWS data centers", "A single server", "A password policy"],
    answer: 0,
    explanation: "A Region is a geographic area like us-east-1 or eu-west-1.",
  },
  {
    question: "What is an Availability Zone?",
    options: ["A separate data center area inside a Region", "A CDN cache", "A billing dashboard"],
    answer: 0,
    explanation: "An Availability Zone is isolated from other zones in the same Region.",
  },
  {
    question: "Which AWS service stores files?",
    options: ["S3", "IAM", "Route 53"],
    answer: 0,
    explanation: "S3 stores objects such as files, images, backups, and static assets.",
  },
  {
    question: "Which service runs code without managing servers?",
    options: ["Lambda", "EBS", "CloudTrail"],
    answer: 0,
    explanation: "Lambda runs functions when events happen, without you managing servers.",
  },
  {
    question: "What does IAM control?",
    options: ["Who can access what", "Image resizing only", "Database indexes only"],
    answer: 0,
    explanation: "IAM controls identities, permissions, users, groups, roles, and policies.",
  },
  {
    question: "Why use CloudFront?",
    options: ["To deliver content faster from edge locations", "To create passwords", "To attach disks to EC2"],
    answer: 0,
    explanation: "CloudFront is a CDN that caches and serves content closer to users.",
  },
  {
    question: "What is least privilege?",
    options: ["Give only the permissions required", "Give every user admin access", "Disable all logs"],
    answer: 0,
    explanation: "Least privilege means every user or service gets only the access it needs.",
  },
];

const interviewQuestions = [
  ["What is AWS?", "AWS is Amazon Web Services. It is a cloud platform where teams can rent compute, storage, databases, networking, security, analytics, and many managed services."],
  ["What is cloud computing?", "Cloud computing means using computing resources from a provider instead of buying and managing physical servers yourself."],
  ["Difference between Region and Availability Zone?", "A Region is a geographic area. An Availability Zone is a separate data center location inside that Region."],
  ["What is EC2?", "EC2 is a virtual machine in the cloud. Use it when you need server control, custom software, or long-running backend services."],
  ["What is S3?", "S3 is object storage for files such as images, videos, logs, backups, and static frontend assets."],
  ["What is IAM?", "IAM controls access. It defines which users, roles, and services can perform actions on AWS resources."],
  ["What is Lambda?", "Lambda runs code without managing servers. It is good for APIs, background jobs, webhooks, and event-driven tasks."],
  ["What is CloudFront?", "CloudFront is a content delivery network. It serves cached content from edge locations near users."],
  ["What is VPC?", "A VPC is your private network inside AWS. It contains subnets, routes, security groups, and network boundaries."],
  ["What is Route 53?", "Route 53 is AWS DNS. It maps domain names like example.com to AWS resources."],
  ["What is Auto Scaling?", "Auto Scaling automatically adds or removes compute capacity based on demand."],
  ["What is CloudWatch?", "CloudWatch collects logs, metrics, alarms, and dashboards so teams can monitor applications."],
  ["Difference between serverless and EC2?", "With EC2 you manage virtual servers. With serverless, AWS manages the servers and you focus on code and events."],
  ["How would you host a frontend app on AWS?", "Build the frontend, store static assets in S3, serve them through CloudFront, and point the domain using Route 53."],
  ["How would you design a basic eCommerce architecture on AWS?", "Use CloudFront for delivery, S3 for assets, API Gateway and Lambda for APIs, DynamoDB or RDS for data, IAM for access, and CloudWatch for monitoring."],
];

const finalChecklist = [
  "AWS provides cloud services",
  "Regions are geographic areas",
  "Availability Zones are separate data centers",
  "EC2 runs virtual servers",
  "S3 stores files",
  "Lambda runs code without servers",
  "IAM controls access",
  "VPC controls networking",
  "CloudFront improves speed",
  "CloudWatch monitors applications",
];

function SectionHeader({
  badge,
  title,
  description,
  icon: Icon,
}: {
  badge: string;
  title: string;
  description?: string;
  icon?: typeof Cloud;
}) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        {Icon ? <Icon className="mr-2 h-3.5 w-3.5" /> : null}
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline tracking-normal">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function FlowLine({ items }: { items: string[] }) {
  const flowStyle = { "--flow-count": items.length } as CSSProperties & Record<"--flow-count", number>;

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--flow-count),minmax(0,1fr))]" style={flowStyle}>
      {items.map((item, index) => (
        <div key={item} className="flex flex-col items-center gap-3 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="flex min-h-20 w-full items-center justify-center rounded-lg border border-white/10 bg-background/55 p-4 text-center text-sm font-semibold"
          >
            {item}
          </motion.div>
          {index < items.length - 1 ? <ChevronRight className="hidden h-5 w-5 shrink-0 text-primary md:block" /> : null}
          {index < items.length - 1 ? <ArrowDown className="h-5 w-5 shrink-0 text-primary md:hidden" /> : null}
        </div>
      ))}
    </div>
  );
}

function CopyCodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/10 p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button size="icon" variant="ghost" onClick={copyCode} className="h-9 w-9 rounded-lg">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <pre className="overflow-auto bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

function CloudDefinition() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Cloud Basics"
        icon={Cloud}
        title="What is Cloud Computing?"
        description="Cloud computing means renting computing power, storage, databases, and networking from providers like AWS instead of buying and managing physical servers."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {traditionalVsCloud.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={cn("rounded-lg border p-6 backdrop-blur-xl", card.tone)}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-background/40">
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-headline font-bold">{card.title}</h3>
            <div className="mt-5 grid gap-3">
              {card.points.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-lg border border-white/10 bg-background/35 p-3 text-sm">
                  <Check className="h-4 w-4 shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      <Card className="mt-6 border-border/60 bg-card/45 p-6 backdrop-blur-xl">
        <FlowLine items={["Physical Servers", "Virtual Servers", "Cloud Services", "AWS"]} />
      </Card>
    </section>
  );
}

function WhyAws() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Why AWS"
        icon={Sparkles}
        title="Why Companies Use AWS"
        description="AWS helps teams move faster, serve global users, and operate systems without owning every piece of hardware themselves."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {whyAws.map(([title, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="rounded-lg border border-border/60 bg-card/45 p-5 backdrop-blur-xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.article>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-primary/25 bg-primary/10 p-5 text-sm leading-7 text-muted-foreground">
        <span className="font-semibold text-foreground">Enterprise example: </span>
        A retail company can launch an eCommerce site globally without buying servers in every country. It can use CloudFront for speed, S3 for images, Lambda for APIs, and CloudWatch for monitoring.
      </div>
    </section>
  );
}

function InfrastructureVisualizer() {
  const [selected, setSelected] = useState<InfrastructureKey>("region");
  const item = infrastructure[selected];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Global Infrastructure"
        icon={Globe2}
        title="AWS Global Infrastructure Visualizer"
        description="AWS is built from Regions, Availability Zones, Edge Locations, and special extension options. Pick each piece to see what it does."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {(Object.keys(infrastructure) as InfrastructureKey[]).map((key) => {
            const option = infrastructure[key];
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={cn(
                  "rounded-lg border p-4 text-left transition",
                  selected === key ? "border-primary/50 bg-primary/10" : "border-white/10 bg-card/45 hover:bg-card/65"
                )}
              >
                <div className="flex items-center gap-3">
                  <option.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{option.title}</p>
                    <p className="text-xs text-muted-foreground">{option.label}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{item.label}</Badge>
                <h3 className="mt-2 text-2xl font-headline">{item.title}</h3>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">What is it?</p>
                <p className="mt-2 text-sm leading-6">{item.description}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Why use it?</p>
                <p className="mt-2 text-sm leading-6">{item.use}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Example</p>
                <p className="mt-2 text-sm leading-6">{item.example}</p>
              </div>
            </div>
            <FlowLine items={["User", "Edge Location", "AWS Region", "Availability Zone", "Application"]} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ServiceMap() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Service Map"
        icon={Boxes}
        title="Core AWS Service Map"
        description="Start by grouping services by job: compute runs code, storage keeps files, networking routes traffic, security protects access, and monitoring shows health."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {serviceMap.map((group, index) => (
          <motion.article
            key={group.category}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-border/60 bg-card/45 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                <group.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-headline">{group.category}</h3>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{group.text}</p>
            <p className="mt-3 text-sm leading-6 text-foreground">{group.example}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.services.map((service) => (
                <Badge key={service} variant="outline" className="border-white/10 bg-background/50">
                  {service}
                </Badge>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  const [mode, setMode] = useState<ArchitectureMode>("static");
  const steps = architectureSteps[mode];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Architecture"
        icon={Workflow}
        title="Interactive AWS Architecture Diagram"
        description="Switch between common beginner architectures and follow the request from the user to AWS services."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            {[
              ["static", "Web App"],
              ["serverless", "Serverless API"],
              ["commerce", "eCommerce"],
            ].map(([value, label]) => (
              <Button
                key={value}
                onClick={() => setMode(value as ArchitectureMode)}
                variant={mode === value ? "default" : "outline"}
                className="rounded-full border-white/10"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={`${mode}-${step.name}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="relative rounded-lg border border-white/10 bg-background/50 p-5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold">{step.name}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ComputeAndStorage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10">
        <div>
          <SectionHeader
            badge="Compute"
            icon={Server}
            title="Compute Services Explained"
            description="Compute is where your code runs. EC2 gives you virtual machines, Lambda runs functions, and ECS/EKS run containers."
          />
          <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b border-white/10 bg-background/50 text-left text-muted-foreground">
                  <tr>
                    {["Service", "Best For", "Pricing", "Complexity", "Example Use Case"].map((heading) => (
                      <th key={heading} className="p-4 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {computeRows.map((row) => (
                    <tr key={row[0]} className="border-b border-white/10 last:border-0">
                      {row.map((cell, index) => (
                        <td key={cell} className={cn("p-4", index === 0 && "font-semibold text-primary")}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div>
          <SectionHeader
            badge="Storage"
            icon={HardDrive}
            title="Storage Services Explained"
            description="Storage keeps the data your application needs: files, disks, shared folders, and long-term backups."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {storageCards.map(([title, text, example]) => (
              <Card key={title} className="border-border/60 bg-card/45 backdrop-blur-xl">
                <CardContent className="p-5">
                  <h3 className="text-xl font-headline text-primary">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                  <p className="mt-4 rounded-lg border border-white/10 bg-background/50 p-3 text-sm">{example}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkingAndSecurity() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader
            badge="Networking"
            icon={Network}
            title="Networking Basics"
            description="Networking decides how users reach your app and how AWS resources talk to each other privately."
          />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-5 p-6">
              {[
                ["VPC", "Private network in AWS."],
                ["Subnet", "Smaller network inside a VPC."],
                ["Security Group", "Firewall for AWS resources."],
                ["Route 53", "DNS service for domains."],
                ["CloudFront", "CDN for faster delivery."],
                ["Load Balancer", "Distributes traffic to multiple servers."],
              ].map(([name, text]) => (
                <div key={name} className="rounded-lg border border-white/10 bg-background/50 p-4">
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
              <FlowLine items={networkingFlow} />
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader
            badge="Security"
            icon={ShieldCheck}
            title="Security Basics"
            description="IAM controls who can access what. Start with least privilege: give only the permissions required."
          />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-5 p-6">
              <FlowLine items={securityFlow} />
              {[
                "Do not use the root user for daily work.",
                "Enable MFA on important accounts.",
                "Use roles instead of hardcoded credentials.",
                "Never expose secret keys in code, logs, or public repos.",
              ].map((rule) => (
                <div key={rule} className="flex gap-3 rounded-lg border border-white/10 bg-background/50 p-4 text-sm">
                  <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {rule}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ServerlessEnterpriseExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10">
        <div>
          <SectionHeader
            badge="Serverless"
            icon={Zap}
            title="Serverless Example"
            description="Serverless is useful when you want AWS to manage the servers, scale automatically, and charge mainly when code runs."
          />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <FlowLine items={["Frontend", "API Gateway", "Lambda", "DynamoDB"]} />
              <div className="grid gap-4 md:grid-cols-4">
                {["No server management", "Auto scaling", "Pay only when code runs", "Great for APIs and background jobs"].map((benefit) => (
                  <div key={benefit} className="rounded-lg border border-white/10 bg-background/50 p-4 text-sm">
                    <Check className="mb-3 h-4 w-4 text-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <SectionHeader
            badge="Enterprise Example"
            icon={ShoppingCart}
            title="Enterprise eCommerce Architecture"
            description="A customer opens an online store. AWS services deliver the frontend, run APIs, store data, process events, and monitor the journey."
          />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <FlowLine items={["Customer", "CloudFront", "Next.js Storefront", "API Gateway", "Commerce APIs", "Database", "Payment Provider", "Order Confirmation"]} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["CloudFront", "Fast global delivery"],
                  ["S3", "Static assets"],
                  ["Lambda", "API logic"],
                  ["RDS / DynamoDB", "Data storage"],
                  ["CloudWatch", "Monitoring"],
                  ["SNS / SQS", "Async events"],
                ].map(([service, purpose]) => (
                  <div key={service} className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="font-semibold text-primary">{service}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{purpose}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CostMistakesRoadmap() {
  return (
    <section className="container mx-auto px-4 py-10">
      <Tabs defaultValue="cost" className="space-y-8">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4">
          <TabsTrigger value="cost" className="rounded-md">Cost</TabsTrigger>
          <TabsTrigger value="mistakes" className="rounded-md">Mistakes</TabsTrigger>
          <TabsTrigger value="roadmap" className="rounded-md">Roadmap</TabsTrigger>
          <TabsTrigger value="summary" className="rounded-md">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="cost">
          <SectionHeader badge="Cost Optimization" icon={Coins} title="Simple Cost Rules" description="AWS cost is manageable when you clean up unused resources, cache traffic, monitor spending, and match services to workload patterns." />
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="grid gap-3 p-6">
                {costRules.map((rule) => (
                  <div key={rule} className="flex items-center gap-3 rounded-lg border border-white/10 bg-background/50 p-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {rule}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="grid gap-3 p-6">
                {costMistakes.map((mistake) => (
                  <div key={mistake} className="flex items-center gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
                    <AlertTriangle className="h-4 w-4" />
                    {mistake}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="mistakes">
          <SectionHeader badge="Beginner Mistakes" icon={AlertTriangle} title="Common Beginner Mistakes" description="Most early AWS problems come from broad permissions, public resources, missing monitoring, or forgetting cost controls." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {beginnerMistakes.map(([title, text]) => (
              <Card key={title} className="border-border/60 bg-card/45 backdrop-blur-xl">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="roadmap">
          <SectionHeader badge="Roadmap" icon={Route} title="AWS Learning Roadmap" description="Learn AWS in layers. This lesson is the foundation before deep-diving into individual services." />
          <Card className="border-border/60 bg-card/45 p-6 backdrop-blur-xl">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {roadmap.map((step) => (
                <div
                  key={step}
                  className={cn(
                    "rounded-lg border p-4 text-center text-sm font-semibold",
                    step === "Cloud Basics" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/50"
                  )}
                >
                  {step === "Cloud Basics" ? "AWS Cloud Fundamentals" : step}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <SectionHeader badge="Final Summary" icon={Check} title="What You Should Remember" description="These are the core building blocks to keep in your head after this lesson." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-3 p-6 md:grid-cols-2">
              {finalChecklist.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-background/50 p-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CodeExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Code Examples"
        icon={Code2}
        title="Copy-ready Beginner AWS Examples"
        description="These examples are intentionally small. They show the shape of common AWS operations without hiding the basics."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {codeExamples.map((example) => (
          <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
        ))}
      </div>
    </section>
  );
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => quizQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers]
  );

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Quiz"
        icon={Play}
        title="Check Your AWS Fundamentals"
        description="Pick an answer and get immediate feedback. The goal is recognition, not memorizing every AWS service."
      />
      <div className="mb-5 rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm">
        Score: {correctCount} correct out of {answeredCount} answered
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <Card key={question.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-5">
                <p className="font-semibold">{question.question}</p>
                <div className="mt-4 grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const isCorrect = question.answer === optionIndex;
                    return (
                      <button
                        key={option}
                        onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                        className={cn(
                          "rounded-lg border p-3 text-left text-sm transition",
                          isSelected && isCorrect && "border-primary/50 bg-primary/10 text-primary",
                          isSelected && !isCorrect && "border-red-300/35 bg-red-500/10 text-red-100",
                          !isSelected && "border-white/10 bg-background/50 hover:bg-background/70"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {selected !== undefined ? (
                  <p className="mt-4 rounded-lg border border-white/10 bg-background/50 p-3 text-sm leading-6 text-muted-foreground">
                    {question.explanation}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interview Prep"
        icon={Terminal}
        title="Beginner AWS Interview Questions"
        description="Short, practical answers for the questions you will hear when someone checks your AWS fundamentals."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {interviewQuestions.map(([question, answer]) => (
          <Card key={question} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-5">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AwsCloudFundamentalsLesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl text-center"
        >
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Cloud className="mr-2 h-3.5 w-3.5" />
            AWS Cloud
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            AWS Cloud <span className="gradient-text">Fundamentals</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Learn the building blocks of modern cloud architecture.
          </p>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
            Understand how AWS helps companies run applications without managing physical servers, using compute, storage, networking, databases, security, and global infrastructure.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="rounded-lg border border-white/10 bg-card/45 px-4 py-5 backdrop-blur-xl"
              >
                <Gauge className="mx-auto mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{stat}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <CloudDefinition />
      <WhyAws />
      <InfrastructureVisualizer />
      <ServiceMap />
      <ArchitectureDiagram />
      <ComputeAndStorage />
      <NetworkingAndSecurity />
      <ServerlessEnterpriseExamples />
      <CostMistakesRoadmap />
      <CodeExamples />
      <Quiz />
      <InterviewQuestions />
    </div>
  );
}
