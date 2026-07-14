"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Blocks,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  Hospital,
  Layers3,
  Monitor,
  Network,
  RadioTower,
  RefreshCcw,
  Route,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RegionId = "us-east-1" | "us-west-2" | "eu-west-1" | "eu-central-1" | "ap-south-1" | "ap-southeast-1";
type RequestStepId = "browser" | "route53" | "cloudfront" | "alb" | "az" | "ec2" | "database" | "response";
type BuilderComponent = "Users" | "Route53" | "CloudFront" | "ALB" | "EC2" | "Lambda" | "RDS" | "S3" | "CloudWatch";
type DisasterRecoveryStrategy = [name: string, cost: string, description: string, nodes: string[]];
type QuizQuestion = [question: string, options: string[], answer: number, explanation: string];
type LearningCard = {
  title: string;
  explanation: string;
  why: string;
  examples: string[];
  memory: string;
  examTip: string;
  scenario: string;
  diagram: string[];
  check: string;
  answer: string;
};
type ExtendedQuestion = {
  question: string;
  options: Array<{ label: string; explanation: string }>;
  answer: number;
  topic: string;
};

const regions: Array<{
  id: RegionId;
  continent: string;
  label: string;
  x: number;
  y: number;
  azs: number;
  users: string;
  workloads: string[];
  latency: string;
}> = [
  { id: "us-east-1", continent: "North America", label: "N. Virginia", x: 24, y: 39, azs: 6, users: "US East, Canada, Latin America", workloads: ["enterprise APIs", "AI platforms", "commerce"], latency: "20-80ms" },
  { id: "us-west-2", continent: "North America", label: "Oregon", x: 15, y: 37, azs: 4, users: "US West and Pacific users", workloads: ["media", "gaming", "SaaS"], latency: "25-90ms" },
  { id: "eu-west-1", continent: "Europe", label: "Ireland", x: 47, y: 33, azs: 3, users: "UK and Western Europe", workloads: ["regulated apps", "analytics", "web apps"], latency: "20-70ms" },
  { id: "eu-central-1", continent: "Europe", label: "Frankfurt", x: 52, y: 36, azs: 3, users: "Central Europe", workloads: ["finance", "ERP", "commerce"], latency: "15-60ms" },
  { id: "ap-south-1", continent: "Asia", label: "Mumbai", x: 68, y: 52, azs: 3, users: "India, Pakistan, Sri Lanka", workloads: ["mobile APIs", "streaming", "marketplaces"], latency: "30-110ms" },
  { id: "ap-southeast-1", continent: "Asia", label: "Singapore", x: 76, y: 62, azs: 3, users: "Southeast Asia", workloads: ["fintech", "travel", "regional apps"], latency: "25-95ms" },
];

const requestJourney: Array<{ id: RequestStepId; name: string; icon: typeof Cloud; detail: string }> = [
  { id: "browser", name: "Browser", icon: User, detail: "A user enters your domain or opens the app." },
  { id: "route53", name: "Route 53", icon: Route, detail: "DNS translates the domain into the best AWS endpoint." },
  { id: "cloudfront", name: "CloudFront", icon: RadioTower, detail: "The edge checks whether it can serve cached content nearby." },
  { id: "alb", name: "Load Balancer", icon: Router, detail: "Traffic is spread across healthy application targets." },
  { id: "az", name: "AZ A", icon: Layers3, detail: "A healthy Availability Zone receives the request." },
  { id: "ec2", name: "EC2", icon: Server, detail: "The application server handles business logic." },
  { id: "database", name: "Database", icon: Database, detail: "Persistent data is read or written." },
  { id: "response", name: "Response", icon: Check, detail: "The result travels back to the browser." },
];

const drStrategies: DisasterRecoveryStrategy[] = [
  ["Backup Restore", "Lowest cost", "Restore from backups when needed", ["Backup vault", "Restore Region"]],
  ["Pilot Light", "Small core running", "Keep minimum services ready", ["DNS", "Core DB", "Scale apps"]],
  ["Warm Standby", "Scaled-down copy", "Run a smaller live environment", ["Primary", "Standby", "Promote"]],
  ["Multi Region", "Regional failover", "Route users to another Region", ["Region A", "Health check", "Region B"]],
  ["Active Active", "Always live", "Serve traffic from multiple Regions", ["Users", "Region A", "Region B"]],
];

const enterpriseServices = [
  ["Users", "Global visitors reaching the storefront", "Free", "Internal users, partners", "Customers browsing products and checkout"],
  ["CloudFront", "Global CDN and edge cache", "Data transfer and requests", "Fastly, Akamai", "Serve static assets and cached pages"],
  ["Next.js", "Frontend rendering and user experience", "Compute and hosting cost", "Static S3 site, SPA", "Product, cart, checkout, account UI"],
  ["API Gateway", "Managed API entry point", "Per request", "ALB, AppSync", "Secure API routing and throttling"],
  ["Lambda", "Serverless business logic", "Invocations and duration", "EC2, ECS", "Checkout, webhooks, background tasks"],
  ["SQS", "Queue for async work", "Requests", "EventBridge, Kafka", "Order processing and retries"],
  ["RDS", "Relational database", "Instance and storage", "Aurora, DynamoDB", "Orders, customers, payments"],
  ["CloudWatch", "Logs, metrics, alarms", "Ingest and retention", "Datadog, New Relic", "Production monitoring"],
  ["SNS", "Notifications and fanout", "Publish and delivery", "EventBridge", "Emails, alerts, downstream updates"],
];

const comparisonCards = [
  ["Region", "Availability Zone", "Geographic area", "Separate data center group inside a Region"],
  ["Edge Location", "CloudFront", "Physical cache site", "CDN service that uses edge locations"],
  ["EC2", "Lambda", "Virtual server you manage", "Function that runs without server management"],
  ["S3", "EBS", "Object storage for files", "Block disk for EC2 instances"],
];

const quizQuestions: QuizQuestion[] = [
  ["What keeps an app online if one data center fails?", ["Single EC2 instance", "Multiple Availability Zones", "One S3 bucket"], 1, "Multi-AZ design lets traffic shift to healthy zones."],
  ["What serves cached files closer to users?", ["CloudFront", "RDS", "IAM"], 0, "CloudFront uses edge locations to reduce latency."],
  ["What is a Region?", ["A geographic AWS area", "A firewall rule", "A billing alert"], 0, "Regions are geographic areas that contain Availability Zones."],
  ["Why use Local Zones?", ["Lower city-level latency", "Store passwords", "Replace DNS"], 0, "Local Zones bring selected AWS services closer to a city."],
  ["What is Outposts?", ["AWS hardware in your location", "A CDN cache", "A JavaScript framework"], 0, "Outposts extends AWS infrastructure into an on-premises site."],
];

const regionSelectionCards: LearningCard[] = [
  {
    title: "Compliance",
    explanation: "Compliance means following laws, regulations, contracts, and data residency requirements when choosing where data lives.",
    why: "Some workloads must keep data in a specific country or legal area. The closest Region is not always the correct Region if the law says otherwise.",
    examples: ["GDPR may require careful handling of European customer data.", "Hospitals may need patient data stored under healthcare rules.", "Government workloads may require approved Regions.", "A banking app serving German customers may choose Frankfurt."],
    memory: "Compliance = Follow the law.",
    examTip: "If the question mentions law, residency, government, healthcare, or GDPR, compliance is usually the first Region-selection factor.",
    scenario: "A bank launches in Germany and must keep regulated customer records under local rules. Which factor matters most?",
    diagram: ["Business requirement", "Compliance rule", "Allowed AWS Region", "Workload deployment"],
    check: "A hospital must store patient data under strict local rules. Which Region-selection factor is most important?",
    answer: "Compliance.",
  },
  {
    title: "Proximity and Latency",
    explanation: "Proximity means placing workloads close to users so requests travel a shorter distance and feel faster.",
    why: "Distance affects latency. Gaming, streaming, checkout, and mobile APIs become frustrating when every request travels too far.",
    examples: ["PUBG-style games need low latency for players.", "Netflix-style video apps benefit from nearby delivery paths.", "Mattress Firm-style retail users need fast browsing and checkout.", "A social media app in India may choose Mumbai for Indian users."],
    memory: "Proximity = Stay close to users.",
    examTip: "If the question says users experience delay or need low latency, choose the Region closest to users when compliance allows it.",
    scenario: "A gaming startup has most players in India and Pakistan. It needs lower latency for gameplay APIs.",
    diagram: ["Users", "Nearest AWS Region", "Application", "Fast response"],
    check: "Which factor helps reduce user delay?",
    answer: "Proximity or latency.",
  },
  {
    title: "Feature Availability",
    explanation: "Feature availability means confirming that the AWS service or feature you need exists in the Region you want to use.",
    why: "AWS services do not always launch in every Region at the same time. New AI, analytics, and specialized services may start in selected Regions first.",
    examples: ["A startup using a new AI service may need a Region where that service is available.", "A team may choose one Region for core services and another for a specific advanced service.", "A product launch can be delayed if the chosen Region lacks a required capability."],
    memory: "Feature Availability = Does this Region support the AWS service?",
    examTip: "If the scenario says a service is unavailable in a Region, feature availability becomes the deciding factor.",
    scenario: "A company wants to use a newly released AI service, but it is only available in selected Regions.",
    diagram: ["Required AWS service", "Regional availability check", "Supported Region", "Deployment"],
    check: "Why should you check service availability before choosing a Region?",
    answer: "Because not every AWS service or feature is available in every Region.",
  },
  {
    title: "Pricing",
    explanation: "Pricing means comparing service costs across Regions because the same resource can have different prices depending on location.",
    why: "Startups and cost-sensitive teams may save money by choosing a Region that meets requirements at a lower cost.",
    examples: ["A startup may compare EC2, RDS, and data transfer prices before launch.", "A global app may balance latency and cost.", "Non-regulated internal tools may use a lower-cost Region if performance is acceptable."],
    memory: "Pricing = Compare costs.",
    examTip: "If multiple Regions meet compliance, latency, and service needs, pricing can be the tie-breaker.",
    scenario: "A startup can host in two compliant Regions with similar latency and service support, but one costs less.",
    diagram: ["Architecture estimate", "Region price comparison", "Budget decision", "Launch"],
    check: "When should pricing influence Region selection?",
    answer: "After compliance, latency, and feature requirements are satisfied.",
  },
];

const infrastructureArchitectureCards: LearningCard[] = [
  {
    title: "High Availability",
    explanation: "High Availability means designing an application so it continues working when one component fails.",
    why: "Production systems should survive server or Availability Zone problems without going fully offline.",
    examples: ["A banking app runs across multiple Availability Zones.", "A food delivery app keeps ordering online during a server issue.", "Black Friday traffic is routed to healthy targets."],
    memory: "High Availability = Keep running.",
    examTip: "For high availability inside one Region, deploy across multiple Availability Zones.",
    scenario: "An e-commerce site must stay online if one data center group has a problem.",
    diagram: ["Users", "Load Balancer", "EC2 in AZ A", "EC2 in AZ B"],
    check: "What AWS design commonly improves high availability in one Region?",
    answer: "Multi-AZ deployment.",
  },
  {
    title: "Agility",
    explanation: "Agility is the ability to launch, change, and experiment quickly without waiting for physical hardware.",
    why: "Teams can try ideas, create environments, and release products faster.",
    examples: ["A startup creates a test environment in minutes.", "Amazon-style teams experiment with new services.", "Developers quickly create a demo stack."],
    memory: "Agility = Move fast.",
    examTip: "If the scenario emphasizes speed of innovation or experimentation, think agility.",
    scenario: "A team wants to test a product idea this afternoon without buying servers.",
    diagram: ["Idea", "AWS resources", "Test environment", "Feedback"],
    check: "Which cloud benefit helps teams experiment quickly?",
    answer: "Agility.",
  },
  {
    title: "Elasticity",
    explanation: "Elasticity means automatically adding or removing capacity as demand changes.",
    why: "Applications can handle spikes without permanently paying for peak capacity.",
    examples: ["Black Friday traffic scales out.", "A gaming launch adds servers during peak hours.", "A food delivery app scales during dinner time."],
    memory: "Elasticity = Stretch and shrink.",
    examTip: "If demand changes and capacity adjusts automatically, the answer is elasticity.",
    scenario: "A retail app has ten times normal traffic for one weekend and then returns to normal.",
    diagram: ["Normal traffic", "Scale out", "Traffic spike handled", "Scale in"],
    check: "What cloud concept means capacity grows and shrinks with demand?",
    answer: "Elasticity.",
  },
  {
    title: "CloudFront and Caching",
    explanation: "CloudFront is a content delivery network that uses Edge Locations to deliver content closer to users.",
    why: "Caching reduces latency and can reduce load on the origin application.",
    examples: ["Netflix-style thumbnails load from nearby edge caches.", "A gaming site serves downloads faster.", "A retail site caches images, CSS, and JavaScript."],
    memory: "CloudFront = Nearby content shelf.",
    examTip: "If the question says cache content near global users, choose CloudFront.",
    scenario: "A media site has global users and wants images and videos to load faster.",
    diagram: ["Internet Users", "Edge Location", "AWS Region", "Availability Zones"],
    check: "Which AWS service uses Edge Locations for content delivery?",
    answer: "Amazon CloudFront.",
  },
];

const awsInteractionCards: LearningCard[] = [
  {
    title: "AWS Management Console",
    explanation: "The AWS Management Console is the graphical web interface for creating and managing AWS resources.",
    why: "It is beginner-friendly and useful for learning, visual checks, and one-off administrative tasks.",
    examples: ["A developer creates an S3 bucket from the browser.", "An administrator checks EC2 instance health.", "A student explores AWS services visually."],
    memory: "Console = Click.",
    examTip: "If the scenario says graphical interface or browser-based management, choose Console.",
    scenario: "A new developer wants to manually inspect services and learn the AWS interface.",
    diagram: ["Developer", "Browser", "AWS Console", "AWS resources"],
    check: "Which AWS tool is browser-based and graphical?",
    answer: "AWS Management Console.",
  },
  {
    title: "AWS CLI",
    explanation: "The AWS CLI is a command-line tool for managing AWS resources by typing commands.",
    why: "It is useful for scripting, repeatable operations, administration, and automation.",
    examples: ["An administrator starts and stops EC2 instances with scripts.", "A team uploads files to S3 from a terminal.", "Operations teams automate routine changes."],
    memory: "CLI = Type.",
    examTip: "If the scenario says shell script, terminal, or command automation, choose AWS CLI.",
    scenario: "An administrator wants a repeatable script that lists S3 buckets every morning.",
    diagram: ["Admin", "Terminal command", "AWS CLI", "AWS API"],
    check: "Which tool is best for command-line scripting?",
    answer: "AWS CLI.",
  },
  {
    title: "AWS SDK",
    explanation: "The AWS SDK lets application code interact with AWS services using programming languages.",
    why: "Applications need to call AWS services programmatically, such as uploading files or sending messages.",
    examples: ["A Node.js app uploads profile images to S3.", "A backend writes records to DynamoDB.", "A Python app calls AWS AI services."],
    memory: "SDK = Code.",
    examTip: "If application code needs to call AWS, choose SDK.",
    scenario: "A Node.js application needs to upload user files directly to Amazon S3 from backend code.",
    diagram: ["Application code", "AWS SDK", "AWS API", "S3"],
    check: "Which tool should application code use to call AWS services?",
    answer: "AWS SDK.",
  },
  {
    title: "AWS CloudFormation",
    explanation: "AWS CloudFormation is Infrastructure as Code. It creates AWS resources from YAML or JSON templates.",
    why: "Templates make deployments repeatable, version-controlled, automated, and easier to roll back.",
    examples: ["A startup creates identical dev, staging, and production stacks.", "A DevOps team deploys VPC, EC2, RDS, and Load Balancer together.", "A disaster recovery plan recreates infrastructure in another Region."],
    memory: "CloudFormation = Blueprint.",
    examTip: "If the scenario says template, YAML, JSON, repeatable deployment, rollback, or Infrastructure as Code, choose CloudFormation.",
    scenario: "A DevOps team wants one version-controlled template to recreate the same application stack many times.",
    diagram: ["Developer", "YAML Template", "CloudFormation", "VPC", "EC2", "RDS", "Load Balancer"],
    check: "Which AWS service provisions resources from YAML or JSON templates?",
    answer: "AWS CloudFormation.",
  },
];

const regionSelectionRows = [
  ["Compliance", "Data may need to stay in a specific legal area.", "GDPR in Europe, hospitals, government workloads, German banking data."],
  ["Proximity", "Closer Regions usually reduce latency.", "PUBG-style gaming, Netflix-style streaming, Mattress Firm-style retail users."],
  ["Feature Availability", "Some AWS services launch only in selected Regions.", "AI services or advanced analytics available in limited Regions."],
  ["Pricing", "AWS prices can vary by Region.", "A startup compares costs after compliance and latency are satisfied."],
];

const infrastructureComparisonRows = [
  ["High Availability", "Keeps systems running during failures.", "Multi-AZ load-balanced app."],
  ["Agility", "Helps teams launch and change quickly.", "Create test environments in minutes."],
  ["Elasticity", "Adds and removes capacity with demand.", "Black Friday scaling."],
];

const locationComparisonRows = [
  ["Region", "Geographic AWS area.", "Choose based on compliance, latency, services, pricing."],
  ["Availability Zone", "One or more physically separate data centers in a Region.", "Use multiple AZs for high availability."],
  ["Edge Location", "Nearby edge site used by services such as CloudFront.", "Cache content closer to global users."],
];

const toolComparisonRows = [
  ["Console", "Click", "Graphical management and learning", "Developer manually creates a test bucket."],
  ["CLI", "Type", "Scripting and automation", "Admin runs repeatable terminal commands."],
  ["SDK", "Code", "Applications calling AWS", "Node.js app uploads files to S3."],
  ["CloudFormation", "Blueprint", "Infrastructure as Code", "DevOps deploys VPC, EC2, RDS, and ALB from YAML."],
];

const situationRows = [
  ["Explore AWS visually", "AWS Management Console"],
  ["Automate repeatable admin tasks", "AWS CLI"],
  ["Let app code interact with AWS", "AWS SDK"],
  ["Provision repeatable infrastructure", "AWS CloudFormation"],
  ["Version control infrastructure changes", "AWS CloudFormation"],
  ["Run commands in CI/CD scripts", "AWS CLI or CloudFormation"],
];

const extendedQuestions: ExtendedQuestion[] = [
  {
    question: "A company must store European customer data according to GDPR requirements. Which Region-selection factor matters most?",
    options: [
      { label: "Compliance", explanation: "Correct. Legal and data residency requirements are compliance concerns." },
      { label: "Pricing", explanation: "Pricing matters later, but it cannot override legal requirements." },
      { label: "Elasticity", explanation: "Elasticity is capacity adjustment, not legal placement." },
      { label: "Caching", explanation: "Caching improves latency, not compliance." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "A gaming app has players in India and Pakistan and needs lower latency. Which factor should guide Region selection?",
    options: [
      { label: "Proximity to users", explanation: "Correct. Placing workloads closer to users reduces network delay." },
      { label: "IAM policy size", explanation: "IAM policy size does not choose Regions." },
      { label: "S3 bucket naming", explanation: "Bucket naming is unrelated to latency." },
      { label: "CloudFormation rollback", explanation: "Rollback is not a latency factor." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "A team needs an AWS AI service that is only available in selected Regions. Which factor is this?",
    options: [
      { label: "Feature Availability", explanation: "Correct. Not all services are available in every Region." },
      { label: "High Availability", explanation: "High availability is about uptime, not service launch locations." },
      { label: "Agility", explanation: "Agility is speed of experimentation." },
      { label: "Edge caching", explanation: "Edge caching is CloudFront behavior." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "After compliance, latency, and services all fit, a startup compares Region costs. Which factor is being evaluated?",
    options: [
      { label: "Pricing", explanation: "Correct. AWS prices can vary by Region." },
      { label: "Availability Zone count", explanation: "AZ count affects resilience, not direct price comparison." },
      { label: "DNS routing", explanation: "DNS routing is not the cost factor." },
      { label: "SDK selection", explanation: "SDKs are for application code." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "What does an AWS Region contain?",
    options: [
      { label: "Multiple Availability Zones", explanation: "Correct. A Region is a geographic area with multiple AZs." },
      { label: "Only one server", explanation: "A Region is much larger than one server." },
      { label: "Only one Edge Location", explanation: "Edge Locations are separate edge sites." },
      { label: "Only one IAM user", explanation: "IAM users are identities, not infrastructure." },
    ],
    answer: 0,
    topic: "Regions",
  },
  {
    question: "What is an Availability Zone?",
    options: [
      { label: "One or more physically separate data centers in a Region", explanation: "Correct. AZs have independent infrastructure and are connected with high-speed networking." },
      { label: "A billing report", explanation: "Billing reports are not infrastructure locations." },
      { label: "A command-line tool", explanation: "The command-line tool is AWS CLI." },
      { label: "A CDN service", explanation: "CloudFront is the CDN service." },
    ],
    answer: 0,
    topic: "Availability Zones",
  },
  {
    question: "How is high availability commonly achieved inside one AWS Region?",
    options: [
      { label: "Deploy across multiple Availability Zones", explanation: "Correct. Multi-AZ designs reduce impact from one AZ failure." },
      { label: "Use one EC2 instance", explanation: "One instance is a single point of failure." },
      { label: "Disable load balancing", explanation: "Load balancing helps distribute traffic." },
      { label: "Store all resources in one subnet", explanation: "One subnet does not provide AZ-level resilience." },
    ],
    answer: 0,
    topic: "High Availability",
  },
  {
    question: "What protects against a full Regional failure?",
    options: [
      { label: "Multi-Region architecture", explanation: "Correct. Multi-Region designs can fail over outside the affected Region." },
      { label: "One Availability Zone", explanation: "One AZ does not protect against Regional failure." },
      { label: "One EBS volume", explanation: "One volume is not Regional failover." },
      { label: "One Security Group", explanation: "Security Groups filter traffic but do not provide Regional recovery." },
    ],
    answer: 0,
    topic: "Multi-Region",
  },
  {
    question: "Which AWS locations are used by CloudFront to cache content near users?",
    options: [
      { label: "Edge Locations", explanation: "Correct. CloudFront uses Edge Locations." },
      { label: "IAM groups", explanation: "IAM groups organize identities." },
      { label: "EBS snapshots", explanation: "Snapshots are backups, not cache sites." },
      { label: "CloudFormation stacks", explanation: "Stacks manage resources from templates." },
    ],
    answer: 0,
    topic: "Edge Locations",
  },
  {
    question: "A retail site needs images, CSS, and JavaScript cached near global users. Which service should it use?",
    options: [
      { label: "Amazon CloudFront", explanation: "Correct. CloudFront is the CDN service for content delivery." },
      { label: "AWS CLI", explanation: "CLI is a command-line tool." },
      { label: "AWS SDK", explanation: "SDK is for application code." },
      { label: "Amazon RDS", explanation: "RDS is a relational database service." },
    ],
    answer: 0,
    topic: "CloudFront",
  },
  {
    question: "What cloud benefit means launching resources quickly without waiting for hardware procurement?",
    options: [
      { label: "Agility", explanation: "Correct. Agility is moving and experimenting quickly." },
      { label: "Encryption", explanation: "Encryption protects data." },
      { label: "Caching", explanation: "Caching stores content closer to users." },
      { label: "Data residency", explanation: "Data residency is compliance placement." },
    ],
    answer: 0,
    topic: "Agility",
  },
  {
    question: "What cloud concept means capacity can grow during Black Friday and shrink afterward?",
    options: [
      { label: "Elasticity", explanation: "Correct. Elasticity adds and removes capacity as demand changes." },
      { label: "Compliance", explanation: "Compliance is following rules and laws." },
      { label: "CloudFormation", explanation: "CloudFormation provisions infrastructure from templates." },
      { label: "Route table", explanation: "Route tables control network routes." },
    ],
    answer: 0,
    topic: "Elasticity",
  },
  {
    question: "Which tool is the graphical browser-based way to manage AWS?",
    options: [
      { label: "AWS Management Console", explanation: "Correct. The Console is graphical and browser-based." },
      { label: "AWS CLI", explanation: "CLI is command-line based." },
      { label: "AWS SDK", explanation: "SDK is for code." },
      { label: "CloudFormation", explanation: "CloudFormation is IaC, not the graphical UI." },
    ],
    answer: 0,
    topic: "AWS tools",
  },
  {
    question: "Which AWS tool is best for scripting administrative tasks from a terminal?",
    options: [
      { label: "AWS CLI", explanation: "Correct. CLI is best for command-line scripting." },
      { label: "AWS Console", explanation: "Console is graphical and manual." },
      { label: "Edge Location", explanation: "Edge Locations serve edge traffic." },
      { label: "Availability Zone", explanation: "AZ is a data center group." },
    ],
    answer: 0,
    topic: "AWS CLI",
  },
  {
    question: "A Node.js application needs to upload files to S3 from backend code. Which tool should it use?",
    options: [
      { label: "AWS SDK", explanation: "Correct. SDKs let application code call AWS services." },
      { label: "AWS Console", explanation: "Console is for people clicking in a browser." },
      { label: "CloudFront", explanation: "CloudFront is a CDN." },
      { label: "Availability Zone", explanation: "AZ is infrastructure location." },
    ],
    answer: 0,
    topic: "AWS SDK",
  },
  {
    question: "Which AWS service is Infrastructure as Code and uses YAML or JSON templates?",
    options: [
      { label: "AWS CloudFormation", explanation: "Correct. CloudFormation provisions resources from YAML or JSON templates." },
      { label: "AWS Management Console", explanation: "Console is graphical management." },
      { label: "Amazon CloudFront", explanation: "CloudFront is content delivery." },
      { label: "Amazon EC2", explanation: "EC2 is virtual servers." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "Why does CloudFormation help with disaster recovery?",
    options: [
      { label: "It can recreate infrastructure from version-controlled templates", explanation: "Correct. Templates can be reused to rebuild environments." },
      { label: "It caches images near users", explanation: "CloudFront does caching." },
      { label: "It replaces all backups", explanation: "Backups are still needed for data." },
      { label: "It is only a billing tool", explanation: "CloudFormation provisions infrastructure." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "What is a CloudFormation stack?",
    options: [
      { label: "A collection of AWS resources managed as one unit", explanation: "Correct. A stack groups resources created from a template." },
      { label: "A single user password", explanation: "Passwords are identity data." },
      { label: "A CDN cache point", explanation: "Edge Locations are cache points." },
      { label: "A command-line profile only", explanation: "CLI profiles are separate from stacks." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "A DevOps team wants repeatable dev, staging, and production environments. Which service fits best?",
    options: [
      { label: "AWS CloudFormation", explanation: "Correct. IaC templates create repeatable environments." },
      { label: "AWS Console only", explanation: "Manual clicking is less repeatable." },
      { label: "Edge Location", explanation: "Edge Locations do not provision environments." },
      { label: "CloudFront only", explanation: "CloudFront is CDN, not full environment provisioning." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "Which template formats does CloudFormation support?",
    options: [
      { label: "YAML and JSON", explanation: "Correct. CloudFormation templates can be written in YAML or JSON." },
      { label: "PNG and JPG", explanation: "Those are image formats." },
      { label: "MP3 and MP4", explanation: "Those are media formats." },
      { label: "CSV only", explanation: "CSV is not the CloudFormation template format." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "What helps roll back infrastructure changes when deployment fails?",
    options: [
      { label: "CloudFormation rollback", explanation: "Correct. CloudFormation can roll back stack changes." },
      { label: "Edge caching", explanation: "Caching does not roll back infrastructure." },
      { label: "A nearby Region", explanation: "Region proximity does not roll back a failed deployment." },
      { label: "Manual screenshots", explanation: "Screenshots are not automated rollback." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "A company wants to manage infrastructure changes in Git. Which approach supports this best?",
    options: [
      { label: "Infrastructure as Code with CloudFormation", explanation: "Correct. Templates can be committed to version control." },
      { label: "Only manual Console clicks", explanation: "Manual clicks are hard to version control." },
      { label: "Only cached files", explanation: "Caching is unrelated to infrastructure definitions." },
      { label: "Only a single AZ", explanation: "A single AZ is not version control." },
    ],
    answer: 0,
    topic: "IaC",
  },
  {
    question: "What is the main difference between SDK and CLI?",
    options: [
      { label: "SDK is used inside application code; CLI is used from a terminal", explanation: "Correct. SDK = code, CLI = typed commands." },
      { label: "SDK is a Region; CLI is an Availability Zone", explanation: "Neither is an infrastructure location." },
      { label: "SDK caches content; CLI stores databases", explanation: "This confuses unrelated services." },
      { label: "SDK is only for billing", explanation: "SDKs call many AWS services from code." },
    ],
    answer: 0,
    topic: "AWS tools",
  },
  {
    question: "What is the best tool for a beginner visually creating a test EC2 instance?",
    options: [
      { label: "AWS Management Console", explanation: "Correct. The Console is easiest for visual manual learning." },
      { label: "CloudFormation only", explanation: "CloudFormation is better for repeatable IaC." },
      { label: "SDK only", explanation: "SDK is for code integrations." },
      { label: "CloudFront", explanation: "CloudFront is content delivery." },
    ],
    answer: 0,
    topic: "AWS tools",
  },
  {
    question: "A startup wants automated CI/CD infrastructure deployment. Which tool is most aligned?",
    options: [
      { label: "CloudFormation", explanation: "Correct. CloudFormation templates fit CI/CD automation." },
      { label: "Manual Console", explanation: "Manual clicking is not ideal for CI/CD." },
      { label: "Edge Location", explanation: "Edge Locations serve users, not deployment automation." },
      { label: "RDS snapshot only", explanation: "A snapshot is not an IaC deployment pipeline." },
    ],
    answer: 0,
    topic: "CI/CD",
  },
  {
    question: "Which architecture protects against an Availability Zone failure?",
    options: [
      { label: "Load balancer with EC2 instances in multiple AZs", explanation: "Correct. Traffic can shift to healthy AZs." },
      { label: "One EC2 instance in one AZ", explanation: "That is a single point of failure." },
      { label: "One private IP address only", explanation: "A private IP does not provide HA." },
      { label: "One manual backup only", explanation: "Backups help recovery, but do not keep the app immediately available." },
    ],
    answer: 0,
    topic: "High Availability",
  },
  {
    question: "Which architecture is better for Regional disaster recovery?",
    options: [
      { label: "Multi-Region deployment", explanation: "Correct. Another Region can take over if one Region is unavailable." },
      { label: "Single-AZ deployment", explanation: "Single AZ cannot protect against Regional failure." },
      { label: "One local browser cache", explanation: "Browser cache is not Regional recovery." },
      { label: "One security group rule", explanation: "Security rules do not provide Regional failover." },
    ],
    answer: 0,
    topic: "Multi-Region",
  },
  {
    question: "Which AWS infrastructure layer is closest to the user for content delivery?",
    options: [
      { label: "Edge Location", explanation: "Correct. Edge Locations are closer to users for services such as CloudFront." },
      { label: "A distant database only", explanation: "Databases are not edge cache locations." },
      { label: "A CloudFormation template", explanation: "Templates define infrastructure." },
      { label: "An IAM password", explanation: "Passwords are identity data." },
    ],
    answer: 0,
    topic: "Edge Locations",
  },
  {
    question: "What is the best first factor when selecting a Region for government workloads?",
    options: [
      { label: "Compliance", explanation: "Correct. Government workloads often have strict location and regulatory requirements." },
      { label: "Only lowest price", explanation: "Price cannot override compliance." },
      { label: "Only UI color", explanation: "UI color is irrelevant." },
      { label: "Only local laptop speed", explanation: "Laptop speed does not decide AWS Region compliance." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "A social media app mainly serves users in India. If compliance and features are satisfied, what Region factor is likely important?",
    options: [
      { label: "Proximity", explanation: "Correct. Choosing a closer Region helps reduce latency." },
      { label: "CloudFormation syntax only", explanation: "Syntax does not decide user latency." },
      { label: "Explicit deny rules", explanation: "That relates to Network ACLs." },
      { label: "Root account usage", explanation: "Root account usage is a security topic." },
    ],
    answer: 0,
    topic: "Region selection",
  },
  {
    question: "Which CloudFormation benefit helps recover from failed deployments?",
    options: [
      { label: "Rollback", explanation: "Correct. CloudFormation can roll back failed stack operations." },
      { label: "Lower latency by itself", explanation: "CloudFormation does not automatically reduce user latency." },
      { label: "Explicit deny for packets", explanation: "Network ACLs provide deny rules." },
      { label: "Content caching", explanation: "CloudFront provides caching." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "Which service creates resources automatically from a template?",
    options: [
      { label: "AWS CloudFormation", explanation: "Correct. It reads templates and provisions resources." },
      { label: "Amazon CloudFront", explanation: "CloudFront delivers content." },
      { label: "AWS Management Console only", explanation: "The Console is a UI, not template automation." },
      { label: "Edge Location", explanation: "Edge Locations are infrastructure sites." },
    ],
    answer: 0,
    topic: "CloudFormation",
  },
  {
    question: "Which statement is accurate?",
    options: [
      { label: "Regions contain multiple Availability Zones", explanation: "Correct. This is a core AWS infrastructure fact." },
      { label: "Availability Zones contain multiple Regions", explanation: "The relationship is reversed." },
      { label: "CloudFormation is a CDN", explanation: "CloudFormation is Infrastructure as Code." },
      { label: "CLI is a browser-only graphical tool", explanation: "CLI is command-line based." },
    ],
    answer: 0,
    topic: "Global Infrastructure",
  },
];

function SectionHeader({ badge, title, description, icon: Icon }: { badge: string; title: string; description: string; icon: typeof Cloud }) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        <Icon className="mr-2 h-3.5 w-3.5" />
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline tracking-normal">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function GlowArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0.45 }}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className={cn("flex items-center justify-center text-primary", vertical ? "h-8" : "w-8")}
    >
      {vertical ? <ArrowDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </motion.div>
  );
}

function CloudNode({ label, active, icon: Icon }: { label: string; active?: boolean; icon: typeof Cloud }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative rounded-lg border p-4 text-center transition",
        active ? "border-primary/60 bg-primary/15 shadow-[0_0_30px_hsl(var(--primary)/0.25)]" : "border-white/10 bg-background/55"
      )}
    >
      <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
      <p className="text-sm font-semibold">{label}</p>
      {active ? <motion.span layoutId="active-pulse" className="absolute inset-0 rounded-lg border border-primary/40" /> : null}
    </motion.div>
  );
}

function AnimatedFlow({ items, activeIndex = -1 }: { items: Array<{ label: string; icon: typeof Cloud }>; activeIndex?: number }) {
  const flowStyle = { "--count": items.length } as CSSProperties & Record<"--count", number>;

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--count),minmax(0,1fr))]" style={flowStyle}>
      {items.map((item, index) => (
        <div key={item.label} className="flex flex-col items-center gap-3 md:flex-row">
          <CloudNode label={item.label} icon={item.icon} active={index === activeIndex} />
          {index < items.length - 1 ? (
            <>
              <div className="hidden md:block"><GlowArrow /></div>
              <div className="md:hidden"><GlowArrow vertical /></div>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function RequestAnimation() {
  const [step, setStep] = useState(0);
  const items = [
    { label: "User", icon: User },
    { label: "Internet", icon: Network },
    { label: "AWS Backbone", icon: Workflow },
    { label: "AWS Region", icon: Globe2 },
    { label: "Availability Zone", icon: Layers3 },
    { label: "Application", icon: Monitor },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Global Infrastructure"
        icon={Globe2}
        title="What is AWS Global Infrastructure?"
        description="It is the worldwide system of Regions, Availability Zones, edge locations, fiber networks, and services that lets applications run close to users and stay resilient."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={items} activeIndex={step} />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setStep((current) => (current + 1) % items.length)} className="rounded-full">
              Advance Request
            </Button>
            <Button onClick={() => setStep(0)} variant="outline" className="rounded-full border-white/10">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <p className="text-sm text-muted-foreground">Active layer: {items[step].label}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function WorldMap({ selected, onSelect }: { selected: RegionId; onSelect: (region: RegionId) => void }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-background/55 p-4">
      <svg viewBox="0 0 100 62" className="h-[320px] w-full">
        <defs>
          <linearGradient id="mapGlow" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path d="M7 22 C15 12 28 14 35 23 C30 30 18 33 8 28 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M43 21 C51 14 61 18 64 27 C59 34 47 34 41 29 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M64 31 C77 20 93 26 94 42 C86 55 69 53 60 43 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M48 39 C57 41 58 55 50 59 C43 54 42 45 48 39 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        {regions.map((region) => (
          <g key={region.id}>
            <motion.circle
              cx={region.x}
              cy={region.y}
              r={selected === region.id ? 3.8 : 2.4}
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="0.6"
              className="cursor-pointer"
              onClick={() => onSelect(region.id)}
              animate={{ opacity: selected === region.id ? [1, 0.55, 1] : 0.78 }}
              transition={{ duration: 1.4, repeat: selected === region.id ? Infinity : 0 }}
            />
            <text x={region.x + 3} y={region.y - 2} fill="rgba(255,255,255,.78)" fontSize="2.6">{region.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RegionVisualizer() {
  const [selected, setSelected] = useState<RegionId>("ap-south-1");
  const region = regions.find((item) => item.id === selected) ?? regions[0];
  const byContinent = regions.reduce<Record<string, typeof regions>>((acc, item) => {
    acc[item.continent] = [...(acc[item.continent] ?? []), item];
    return acc;
  }, {});

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Regions"
        icon={Globe2}
        title="Interactive AWS Region Map"
        description="A Region is a geographic AWS area. Click a Region to zoom into where users are, how many Availability Zones it has, and what workloads fit there."
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <WorldMap selected={selected} onSelect={setSelected} />
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <motion.div key={region.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">{region.continent}</Badge>
              <h3 className="mt-3 text-3xl font-headline">{region.id}</h3>
              <p className="text-sm text-muted-foreground">{region.label}</p>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Availability Zones" value={`${region.azs}`} />
              <Metric label="Typical Latency" value={region.latency} />
            </div>
            <VisualNote title="Nearby users" text={region.users} />
            <div className="flex flex-wrap gap-2">
              {region.workloads.map((workload) => (
                <Badge key={workload} variant="outline" className="border-white/10 bg-background/50">{workload}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Object.entries(byContinent).map(([continent, items]) => (
          <Card key={continent} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader><CardTitle className="text-lg">{continent}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Button key={item.id} size="sm" variant={selected === item.id ? "default" : "outline"} onClick={() => setSelected(item.id)} className="rounded-full border-white/10">
                  {item.id}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-headline text-primary">{value}</p>
    </div>
  );
}

function VisualNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function AvailabilityZoneVisualizer() {
  const [failed, setFailed] = useState(false);
  const zones = ["AZ A", "AZ B", "AZ C"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Availability Zones"
        icon={Layers3}
        title="Animated Multi-AZ Region"
        description="Availability Zones are separate data center groups inside a Region. Multi-AZ architecture keeps traffic moving when one zone fails."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <p className="mb-5 text-center font-headline text-2xl">AWS Region</p>
            <div className="grid gap-4 lg:grid-cols-3">
              {zones.map((zone) => {
                const isFailed = failed && zone === "AZ B";
                return (
                  <motion.div
                    key={zone}
                    animate={{ opacity: isFailed ? 0.55 : 1, y: isFailed ? 8 : 0 }}
                    className={cn("rounded-lg border p-5", isFailed ? "border-red-300/50 bg-red-500/15" : "border-white/10 bg-background/55")}
                  >
                    <h3 className="text-center text-xl font-semibold">{zone}</h3>
                    <div className="mt-5 grid gap-3">
                      <CloudNode label="EC2" icon={Server} active={!isFailed && failed} />
                      <CloudNode label="Database" icon={Database} active={!isFailed && failed} />
                    </div>
                    {isFailed ? <p className="mt-4 text-center text-sm text-red-100">Unavailable</p> : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <CloudNode label="Traffic to AZ A" icon={Route} active={failed} />
            <CloudNode label={failed ? "AZ B failed" : "Traffic to AZ B"} icon={AlertTriangle} active={!failed} />
            <CloudNode label="Traffic to AZ C" icon={Route} active={failed} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setFailed(true)} className="rounded-full">Simulate AZ Failure</Button>
            <Button onClick={() => setFailed(false)} variant="outline" className="rounded-full border-white/10">Recover AZ</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function EdgeLocationVisualizer() {
  const [cached, setCached] = useState(false);
  const flow = cached
    ? [{ label: "User Pakistan", icon: User }, { label: "Edge Dubai", icon: RadioTower }, { label: "Cached Response", icon: Zap }]
    : [{ label: "User Pakistan", icon: User }, { label: "Edge Dubai", icon: RadioTower }, { label: "CloudFront Cache", icon: Cloud }, { label: "Region Mumbai", icon: Globe2 }];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Edge Locations"
        icon={RadioTower}
        title="CloudFront CDN Animation"
        description="The first request may reach the origin Region. The next request can be served directly from the nearby edge location."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={flow} activeIndex={cached ? 2 : 3} />
          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="First Request" value="600ms" />
            <Metric label="Second Request" value={cached ? "40ms" : "Waiting"} />
          </div>
          <Button onClick={() => setCached((current) => !current)} className="rounded-full">
            {cached ? "Show First Request" : "Serve From Edge"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function InfrastructureComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="AWS Backbone"
        icon={Workflow}
        title="Public Internet vs AWS Backbone"
        description="Public internet routes can be random and congested. AWS Backbone uses private fiber and optimized paths between AWS infrastructure."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          ["Public Internet", "Random routes", "Congested", "Slow", "border-red-300/35 bg-red-500/10"],
          ["AWS Backbone", "Private fiber", "Optimized", "Fast", "border-primary/35 bg-primary/10"],
        ].map(([title, one, two, three, tone]) => (
          <Card key={title} className={cn("border backdrop-blur-xl", tone)}>
            <CardContent className="space-y-5 p-6">
              <h3 className="text-2xl font-headline">{title}</h3>
              <AnimatedFlow
                items={[
                  { label: one, icon: Network },
                  { label: two, icon: Activity },
                  { label: three, icon: Gauge },
                ]}
                activeIndex={2}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LocalZonesOutposts() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader badge="Local Zones" icon={Building2} title="City-level Infrastructure" description="Local Zones place selected AWS services closer to a city when milliseconds matter." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "User", icon: User }, { label: "Local Zone", icon: Building2 }, { label: "Region", icon: Globe2 }]} activeIndex={1} />
              <div className="grid gap-3 sm:grid-cols-2">
                {["Gaming", "Video Editing", "Media Streaming", "Medical Imaging"].map((item) => (
                  <CloudNode key={item} label={item} icon={Monitor} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader badge="Outposts" icon={Hospital} title="Hybrid Cloud Animation" description="Outposts brings AWS-managed hardware into a customer location while syncing with AWS Cloud." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "Hospital", icon: Hospital }, { label: "Outposts Rack", icon: Server }, { label: "AWS Cloud", icon: Cloud }, { label: "Backup", icon: HardDrive }]} activeIndex={2} />
              <VisualNote title="Why it exists" text="Use Outposts when low latency, data residency, or local system dependencies require AWS-style infrastructure on premises." />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function RequestJourney() {
  const [active, setActive] = useState(0);
  const item = requestJourney[active];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Request Journey" icon={Route} title="Step-by-step Request Animation" description="Click through a full web request from browser to database and back." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={requestJourney.map((step) => ({ label: step.name, icon: step.icon }))} activeIndex={active} />
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-5">
            <item.icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActive((current) => Math.min(current + 1, requestJourney.length - 1))} className="rounded-full">Next Step</Button>
            <Button onClick={() => setActive(0)} variant="outline" className="rounded-full border-white/10">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FailureSimulation() {
  const [crashed, setCrashed] = useState(false);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="High Availability" icon={ShieldCheck} title="Single AZ vs Multi-AZ Failure Simulator" description="Crash an Availability Zone and compare what happens when the app has only one zone versus multiple healthy zones." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Single AZ</h3>
            <AnimatedFlow items={[{ label: "Single AZ", icon: Layers3 }, { label: crashed ? "Failure" : "Running", icon: crashed ? AlertTriangle : Check }, { label: crashed ? "Offline" : "Application", icon: Monitor }]} activeIndex={crashed ? 2 : 1} />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Multi AZ</h3>
            <AnimatedFlow items={[{ label: "AZ A", icon: Layers3 }, { label: crashed ? "AZ B Failed" : "AZ B", icon: crashed ? AlertTriangle : Layers3 }, { label: "AZ C", icon: Layers3 }, { label: "Running", icon: Check }]} activeIndex={crashed ? 3 : 1} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => setCrashed(true)} className="rounded-full">Crash AZ</Button>
        <Button onClick={() => setCrashed(false)} variant="outline" className="rounded-full border-white/10">Recover</Button>
      </div>
    </section>
  );
}

function DisasterRecovery() {
  const [active, setActive] = useState(0);
  const strategy = drStrategies[active];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Disaster Recovery" icon={RefreshCcw} title="Recovery Strategy Diagrams" description="Disaster recovery plans trade cost, speed, and complexity. Explore each strategy as a small architecture." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-2">
          {drStrategies.map((item, index) => (
            <Button key={item[0]} onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="justify-start rounded-lg border-white/10">
              {item[0]}
            </Button>
          ))}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{strategy[1]}</Badge>
              <h3 className="mt-3 text-3xl font-headline">{strategy[0]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{strategy[2]}</p>
            </div>
            <AnimatedFlow items={strategy[3].map((label) => ({ label, icon: label.includes("Region") ? Globe2 : label.includes("Backup") ? HardDrive : Cloud }))} activeIndex={1} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ArchitectureBuilder() {
  const [selected, setSelected] = useState<BuilderComponent[]>(["Users", "Route53", "CloudFront"]);
  const components: BuilderComponent[] = ["Users", "Route53", "CloudFront", "ALB", "EC2", "Lambda", "RDS", "S3", "CloudWatch"];
  const score = Math.min(100, 35 + selected.length * 7 + (selected.includes("CloudWatch") ? 10 : 0) + (selected.includes("CloudFront") ? 8 : 0));
  const latency = Math.max(35, 220 - selected.length * 12 - (selected.includes("CloudFront") ? 60 : 0));
  const availability = Math.min(99.99, 96 + selected.length * 0.32 + (selected.includes("ALB") ? 1.2 : 0));
  const cost = 25 + selected.length * 14 + (selected.includes("RDS") ? 40 : 0);

  function toggle(component: BuilderComponent) {
    setSelected((current) => current.includes(component) ? current.filter((item) => item !== component) : [...current, component]);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Architecture Playground" icon={Blocks} title="Build an AWS Architecture" description="Choose components, connect services visually, and watch score, latency, availability, and cost estimates change." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-2 p-5">
            {components.map((component) => (
              <motion.button
                key={component}
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(component)}
                className={cn("rounded-lg border p-3 text-left text-sm", selected.includes(component) ? "border-primary/45 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}
              >
                {component}
              </motion.button>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={selected.map((label) => ({ label, icon: label === "Users" ? Users : label === "RDS" ? Database : label === "CloudWatch" ? Activity : Cloud }))} activeIndex={selected.length - 1} />
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Score" value={`${score}/100`} />
              <Metric label="Latency" value={`${latency}ms`} />
              <Metric label="Availability" value={`${availability.toFixed(2)}%`} />
              <Metric label="Cost" value={`$${cost}/mo`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function EnterpriseArchitecture() {
  const [active, setActive] = useState(enterpriseServices[0]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Enterprise Architecture" icon={Workflow} title="Clickable Production Architecture" description="Click a service to see its purpose, pricing model, alternatives, and real-world usage." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <AnimatedFlow items={enterpriseServices.map(([label]) => ({ label, icon: label === "RDS" ? Database : label === "CloudWatch" ? Activity : label === "Users" ? Users : Cloud }))} activeIndex={enterpriseServices.findIndex((item) => item[0] === active[0])} />
            <div className="mt-6 flex flex-wrap gap-2">
              {enterpriseServices.map((service) => (
                <Button key={service[0]} size="sm" onClick={() => setActive(service)} variant={active[0] === service[0] ? "default" : "outline"} className="rounded-full border-white/10">
                  {service[0]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-3xl font-headline">{active[0]}</h3>
            <VisualNote title="Purpose" text={active[1]} />
            <VisualNote title="Pricing" text={active[2]} />
            <VisualNote title="Alternatives" text={active[3]} />
            <VisualNote title="Real-world usage" text={active[4]} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function VisualComparisons() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Visual Comparisons" icon={Sparkles} title="Common AWS Concepts Compared" description="These pairs are easier to understand side by side." />
      <div className="grid gap-5 md:grid-cols-2">
        {comparisonCards.map(([left, right, leftText, rightText]) => (
          <Card key={`${left}-${right}`} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_1fr]">
              <CloudNode label={left} icon={Cloud} />
              <div className="flex items-center justify-center text-xs font-semibold text-primary">VS</div>
              <CloudNode label={right} icon={Cloud} />
              <p className="text-sm leading-6 text-muted-foreground sm:col-span-1">{leftText}</p>
              <div />
              <p className="text-sm leading-6 text-muted-foreground sm:col-span-1">{rightText}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InteractiveQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = useMemo(() => quizQuestions.reduce((count, question, index) => count + (answers[index] === question[2] ? 1 : 0), 0), [answers]);
  const complete = answered === quizQuestions.length;

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Interactive Quiz" icon={Check} title="Infrastructure Quiz" description="Answers animate green or red, and the progress bar fills as you complete the quiz." />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-background">
        <motion.div className="h-full bg-primary" animate={{ width: `${(answered / quizQuestions.length) * 100}%` }} />
      </div>
      {complete ? (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center gap-2">
          {Array.from({ length: 18 }).map((_, index) => (
            <motion.span key={index} initial={{ y: -20, opacity: 1 }} animate={{ y: 90, opacity: 0 }} transition={{ duration: 1.2, delay: index * 0.03 }} className="h-2 w-2 rounded-full bg-primary" />
          ))}
        </div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map(([question, options, answer, explanation], questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <Card key={question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <p className="font-semibold">{question}</p>
                {options.map((option, optionIndex) => {
                  const selectedAnswer = selected === optionIndex;
                  const correctAnswer = answer === optionIndex;
                  return (
                    <motion.button
                      key={option}
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      animate={selectedAnswer ? { scale: [1, 1.02, 1] } : {}}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm",
                        selectedAnswer && correctAnswer && "border-primary/50 bg-primary/10 text-primary",
                        selectedAnswer && !correctAnswer && "border-red-300/40 bg-red-500/10 text-red-100",
                        !selectedAnswer && "border-white/10 bg-background/50"
                      )}
                    >
                      {option}
                    </motion.button>
                  );
                })}
                {selected !== undefined ? <p className="rounded-lg border border-white/10 bg-background/50 p-3 text-sm text-muted-foreground">{explanation}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Score: {correct} / {quizQuestions.length}</p>
    </section>
  );
}

function InteractiveTimeline() {
  const steps = ["Cloud Basics", "Infrastructure", "Compute", "Storage", "Networking", "Security", "Serverless", "Containers", "Monitoring", "Architecture", "Solutions Architect"];
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Learning Roadmap" icon={Route} title="Animated AWS Roadmap" description="This lesson sits at the infrastructure layer after cloud basics and before service deep dives." />
      <Card className="border-border/60 bg-card/45 p-6 backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className={cn("rounded-lg border p-4 text-center text-sm font-semibold", step === "Infrastructure" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function CloudDiagram() {
  const [active, setActive] = useState(0);
  const items = [
    { label: "Users", icon: Users },
    { label: "Edge Location", icon: RadioTower },
    { label: "AWS Region", icon: Globe2 },
    { label: "Availability Zones", icon: Layers3 },
    { label: "Application", icon: Monitor },
    { label: "Database", icon: Database },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Final Visual Summary" icon={Cloud} title="Infrastructure in One Picture" description="Click through the final diagram and trace how global infrastructure moves a user request toward an application and database." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={items} activeIndex={active} />
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Button key={item.label} size="sm" onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="rounded-full border-white/10">
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SimpleFlow({ steps }: { steps: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-background/50 p-4">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium">
              {step}
            </div>
            {index < steps.length - 1 ? <ChevronRight className="h-4 w-4 text-primary" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningCardView({ card }: { card: LearningCard }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-headline">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.explanation}</p>
          </div>
          <Button variant="outline" className="rounded-full border-white/10" onClick={() => setOpen((current) => !current)}>
            {open ? "Hide details" : "Expand details"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <VisualNote title="Why it matters" text={card.why} />
          <VisualNote title="Memory trick" text={card.memory} />
          <VisualNote title="Exam tip" text={card.examTip} />
          <VisualNote title="Scenario example" text={card.scenario} />
        </div>

        <SimpleFlow steps={card.diagram} />

        {open ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-white/10 bg-background/50 p-4">
              <p className="font-semibold">Real-world examples</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {card.examples.map((example) => (
                  <li key={example}>- {example}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="font-semibold text-primary">Knowledge check</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.check}</p>
              <p className="mt-3 rounded-lg border border-white/10 bg-background/50 p-3 text-sm">{card.answer}</p>
            </div>
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-primary/10 text-primary">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-white/10">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3 leading-6 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CheatSheetGrid({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {items.map(([label, text]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
            <p className="font-semibold">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RegionSelectionSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Region Selection"
        icon={Globe2}
        title="Choosing the Right AWS Region"
        description="Region selection is a business and technical decision. Start with compliance, then consider latency, service availability, and pricing."
      />
      <div className="space-y-6">
        {regionSelectionCards.map((card) => (
          <LearningCardView key={card.title} card={card} />
        ))}
        <ComparisonTable title="Region Selection Factors" columns={["Factor", "Why It Matters", "Real-World Example"]} rows={regionSelectionRows} />
        <CheatSheetGrid
          title="Region Selection Cheat Sheet"
          items={[
            ["Compliance", "Follow the law before optimizing for convenience."],
            ["Proximity", "Stay close to users to reduce latency."],
            ["Feature Availability", "Confirm the Region supports the AWS service you need."],
            ["Pricing", "Compare costs after the other requirements are satisfied."],
          ]}
        />
      </div>
    </section>
  );
}

function HighlyAvailableArchitecturesSection() {
  const [activeDiagram, setActiveDiagram] = useState<"az" | "edge">("az");

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Highly Available Architectures"
        icon={ShieldCheck}
        title="AWS Global Infrastructure and Resilient Design"
        description="Use Regions, Availability Zones, Edge Locations, CloudFront, and scaling patterns to build apps that stay fast and available."
      />
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          {infrastructureArchitectureCards.map((card) => (
            <LearningCardView key={card.title} card={card} />
          ))}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              <Button variant={activeDiagram === "az" ? "default" : "outline"} onClick={() => setActiveDiagram("az")} className="rounded-full border-white/10">
                Multi-AZ Flow
              </Button>
              <Button variant={activeDiagram === "edge" ? "default" : "outline"} onClick={() => setActiveDiagram("edge")} className="rounded-full border-white/10">
                Edge Flow
              </Button>
            </div>
            {activeDiagram === "az" ? (
              <SimpleFlow steps={["Users", "Load Balancer", "EC2 in AZ A", "EC2 in AZ B"]} />
            ) : (
              <SimpleFlow steps={["Internet Users", "Edge Location", "AWS Region", "Availability Zones"]} />
            )}
          </CardContent>
        </Card>
        <ComparisonTable title="High Availability vs Agility vs Elasticity" columns={["Concept", "Meaning", "Example"]} rows={infrastructureComparisonRows} />
        <ComparisonTable title="Region vs Availability Zone vs Edge Location" columns={["Layer", "Meaning", "Exam Use"]} rows={locationComparisonRows} />
        <CheatSheetGrid
          title="Infrastructure Cheat Sheet"
          items={[
            ["High Availability", "Keep the application running during failures."],
            ["Agility", "Launch and change quickly."],
            ["Elasticity", "Scale out and in with demand."],
            ["Region", "Geographic AWS area containing multiple AZs."],
            ["Availability Zone", "One or more physically separate data centers."],
            ["Edge Location", "Site used by services such as CloudFront."],
          ]}
        />
      </div>
    </section>
  );
}

function CloudFormationAndToolsSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Ways to Interact with AWS"
        icon={Workflow}
        title="Console, CLI, SDK, and CloudFormation"
        description="AWS gives different tools for different jobs: click for visual management, type for automation, code for applications, and templates for infrastructure."
      />
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          {awsInteractionCards.map((card) => (
            <LearningCardView key={card.title} card={card} />
          ))}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="font-headline text-2xl">CloudFormation Workflow</h3>
            <SimpleFlow steps={["Developer", "YAML Template", "CloudFormation", "VPC", "EC2", "RDS", "Load Balancer"]} />
            <pre className="overflow-x-auto rounded-lg border border-white/10 bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
{`Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      ImageId: ami-1234567890abcdef0

  AppBucket:
    Type: AWS::S3::Bucket`}
            </pre>
          </CardContent>
        </Card>
        <ComparisonTable title="Console vs CLI vs SDK vs CloudFormation" columns={["Tool", "Memory Trick", "Best For", "Example"]} rows={toolComparisonRows} />
        <ComparisonTable title="Situation to Best Tool" columns={["Situation", "Best Tool"]} rows={situationRows} />
        <CheatSheetGrid
          title="AWS Interaction Cheat Sheet"
          items={[
            ["Console", "Click: browser-based graphical management."],
            ["CLI", "Type: command-line scripting and automation."],
            ["SDK", "Code: application code calls AWS APIs."],
            ["CloudFormation", "Blueprint: repeatable Infrastructure as Code with YAML or JSON."],
          ]}
        />
      </div>
    </section>
  );
}

function ExtendedAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = useMemo(
    () => extendedQuestions.reduce((count, question, index) => count + (answers[index] === question.answer ? 1 : 0), 0),
    [answers]
  );

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Final Assessment"
        icon={Check}
        title="Module 4 Extended Practice Questions"
        description="Practice Region selection, high availability, elasticity, Regions, Availability Zones, CloudFront, CloudFormation, Console, CLI, SDK, and Infrastructure as Code."
      />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-background">
        <motion.div className="h-full bg-primary" animate={{ width: `${(answered / extendedQuestions.length) * 100}%` }} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {extendedQuestions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <Card key={question.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Question {questionIndex + 1}</Badge>
                  <Badge variant="secondary">{question.topic}</Badge>
                </div>
                <p className="font-semibold leading-7">{question.question}</p>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = question.answer === optionIndex;
                  return (
                    <button
                      key={option.label}
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm transition-colors",
                        isSelected && isCorrect && "border-primary/50 bg-primary/10 text-primary",
                        isSelected && !isCorrect && "border-red-300/40 bg-red-500/10 text-red-100",
                        !isSelected && "border-white/10 bg-background/50 hover:border-primary/30"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
                {selected !== undefined ? (
                  <div className="space-y-2 rounded-lg border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
                    {question.options.map((option, optionIndex) => (
                      <p key={`${question.question}-${option.label}`}>
                        <span className="font-semibold text-foreground">{optionIndex === question.answer ? "Correct" : "Incorrect"}:</span> {option.explanation}
                      </p>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold">Score: {correct} / {extendedQuestions.length}</p>
          <Button variant="outline" className="rounded-full border-white/10" onClick={() => setAnswers({})}>
            Reset Assessment
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function ExtendedModule4Sections() {
  return (
    <>
      <RegionSelectionSection />
      <HighlyAvailableArchitecturesSection />
      <CloudFormationAndToolsSection />
      <ExtendedAssessment />
    </>
  );
}

export function AwsGlobalInfrastructureLesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Globe2 className="mr-2 h-3.5 w-3.5" />
            AWS Infrastructure
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            AWS Global <span className="gradient-text">Infrastructure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Learn Regions, Availability Zones, edge locations, AWS Backbone, Local Zones, Outposts, and resilient global architecture through visual simulations.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Regions", "Availability Zones", "Edge Locations", "High Availability"].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} className="rounded-lg border border-white/10 bg-card/45 px-4 py-5 backdrop-blur-xl">
                <Sparkles className="mx-auto mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <RequestAnimation />
      <RegionVisualizer />
      <AvailabilityZoneVisualizer />
      <EdgeLocationVisualizer />
      <InfrastructureComparison />
      <LocalZonesOutposts />
      <RequestJourney />
      <FailureSimulation />
      <DisasterRecovery />
      <ArchitectureBuilder />
      <EnterpriseArchitecture />
      <VisualComparisons />
      <InteractiveQuiz />
      <InteractiveTimeline />
      <CloudDiagram />
      <ExtendedModule4Sections />
    </div>
  );
}
