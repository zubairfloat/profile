"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Cloud,
  Construction,
  Database,
  Globe2,
  GraduationCap,
  HardDrive,
  Layers3,
  Network,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Server,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { awsLearningRoadmap } from "@/data/aws-learning-roadmap";
import { cn } from "@/lib/utils";

const objectives = [
  "Understand what cloud computing means in AWS terms.",
  "Compare traditional on-premises hosting with cloud hosting.",
  "Identify the main benefits of cloud computing.",
  "Recognize public, private, and hybrid cloud models.",
  "Understand IaaS, PaaS, and SaaS service models.",
  "Explain high availability, scalability, elasticity, fault tolerance, and disaster recovery.",
  "Understand the AWS shared responsibility model.",
];

const handsOnTasks = [
  "Launch an EC2 instance",
  "Create an S3 bucket",
  "Upload files to S3",
  "Create IAM users",
  "Create IAM roles",
  "Explore CloudWatch",
  "Create an RDS instance",
  "Create a VPC",
  "Create Security Groups",
];

const practiceResources = [
  "AWS Skill Builder",
  "FreeCodeCamp AWS Cloud Practitioner course",
  "Andrew Brown's AWS Cloud Practitioner course",
  "Stephane Maarek's AWS Cloud Practitioner course",
  "Neal Davis' practice exams",
  "Tutorials Dojo",
  "Whizlabs",
  "ExamTopics for discussion, not memorization",
];

const dailyStudyPlan = [
  ["20 min", "Review yesterday's topics"],
  ["40 min", "Learn a new AWS service"],
  ["20 min", "Hands-on practice in AWS Free Tier"],
  ["30 min", "Practice exam questions"],
  ["10 min", "Make revision notes"],
];

const applicationFlow = [
  "User",
  "CloudFront",
  "Application Load Balancer",
  "EC2 / Lambda",
  "RDS / DynamoDB",
  "S3 for images and files",
  "CloudWatch logs and metrics",
];

const lessons = [
  {
    title: "What is Cloud Computing?",
    icon: Cloud,
    body:
      "Cloud computing means using IT resources over the internet instead of buying and managing physical servers yourself. With AWS, you can launch compute, storage, networking, databases, security, analytics, and AI services whenever your project needs them.",
    examTip: "Cloud computing is on-demand access to technology resources with pay-as-you-go pricing.",
  },
  {
    title: "Benefits of Cloud Computing",
    icon: Zap,
    body:
      "AWS helps you avoid large upfront hardware purchases, scale when traffic changes, deploy globally, improve reliability, and move faster. You pay for what you use and can experiment without waiting weeks for infrastructure.",
    examTip: "Remember the business benefits: agility, elasticity, global reach, and cost optimization.",
  },
  {
    title: "Types of Cloud",
    icon: Layers3,
    body:
      "Public cloud runs on infrastructure owned by a provider like AWS. Private cloud is dedicated to one organization. Hybrid cloud connects on-premises systems with cloud services.",
    examTip: "AWS is a public cloud provider, but it supports hybrid patterns through services like VPN, Direct Connect, and Outposts.",
  },
  {
    title: "Cloud Service Models",
    icon: Server,
    body:
      "IaaS gives you the most control over servers, networking, and storage. PaaS manages more of the platform for you so you can focus on code. SaaS is complete software delivered to users.",
    examTip: "EC2 is IaaS. Elastic Beanstalk is closer to PaaS. A hosted business app is SaaS.",
  },
  {
    title: "High Availability",
    icon: Globe2,
    body:
      "High availability keeps an application running even when part of the system has problems. In AWS, this often means deploying across multiple Availability Zones and removing single points of failure.",
    examTip: "For the exam, associate high availability with multiple Availability Zones.",
  },
  {
    title: "Scalability",
    icon: ArrowRight,
    body:
      "Scalability means a system can handle more work by adding resources. Vertical scaling increases the power of one resource. Horizontal scaling adds more resources, such as more EC2 instances.",
    examTip: "Horizontal scaling is usually preferred for cloud-native applications.",
  },
  {
    title: "Elasticity",
    icon: RefreshCcw,
    body:
      "Elasticity means resources can automatically grow and shrink based on demand. If your portfolio gets a sudden traffic spike, AWS can add capacity and then remove it when traffic drops.",
    examTip: "Elasticity is scaling automatically in response to real demand.",
  },
  {
    title: "Fault Tolerance",
    icon: ShieldCheck,
    body:
      "Fault tolerance means the application continues working even when a component fails. This is stronger than basic high availability because the system is designed to survive failures with minimal disruption.",
    examTip: "Think backup components, redundancy, and automatic failover.",
  },
  {
    title: "Disaster Recovery",
    icon: RotateCcw,
    body:
      "Disaster recovery is the plan for restoring systems after a major outage or data loss event. AWS supports backup and restore, pilot light, warm standby, and multi-site strategies.",
    examTip: "Disaster recovery focuses on recovery after a serious incident.",
  },
  {
    title: "Shared Responsibility Model",
    icon: Database,
    body:
      "AWS is responsible for security of the cloud, including the physical facilities, hardware, and managed infrastructure. Customers are responsible for security in the cloud, including data, identities, access, and configuration.",
    examTip: "AWS secures the cloud. You secure what you put in the cloud.",
  },
];

const serviceModels = [
  {
    model: "IaaS",
    name: "Infrastructure as a Service",
    awsExample: "Amazon EC2",
    youManage: "Operating system, runtime, application, data",
    awsManages: "Physical data center, servers, networking, virtualization",
  },
  {
    model: "PaaS",
    name: "Platform as a Service",
    awsExample: "AWS Elastic Beanstalk",
    youManage: "Application code and data",
    awsManages: "Platform, runtime, operating system, scaling foundations",
  },
  {
    model: "SaaS",
    name: "Software as a Service",
    awsExample: "Hosted software application",
    youManage: "User settings and business data",
    awsManages: "Most infrastructure and application operations",
  },
];

const examTips = [
  "Cloud computing removes the need to guess capacity far in advance.",
  "Pay-as-you-go means you pay for consumed resources instead of buying hardware upfront.",
  "High availability commonly uses multiple Availability Zones.",
  "Scalability is the ability to handle growth. Elasticity is automatic scaling up and down.",
  "Fault tolerance keeps working through failures. Disaster recovery restores after major failures.",
  "In shared responsibility, AWS handles security of the cloud and the customer handles security in the cloud.",
];

const quizQuestions = [
  {
    question: "What is the best definition of cloud computing?",
    options: [
      "Buying servers for a private data center",
      "Using IT resources over the internet with on-demand access",
      "Installing software only on one office computer",
      "Replacing every developer with automation",
    ],
    answer: 1,
  },
  {
    question: "Which AWS service is the clearest IaaS example?",
    options: ["Amazon EC2", "AWS Lambda", "Amazon QuickSight", "Amazon WorkMail"],
    answer: 0,
  },
  {
    question: "What does elasticity mean?",
    options: [
      "A system is always running at maximum size",
      "Resources automatically adjust to demand",
      "A company owns all physical servers",
      "Data is stored only in one location",
    ],
    answer: 1,
  },
  {
    question: "Which design best supports high availability?",
    options: [
      "One server in one location",
      "Multiple Availability Zones",
      "Manual deployment only",
      "No backups",
    ],
    answer: 1,
  },
  {
    question: "In the shared responsibility model, what is the customer responsible for?",
    options: [
      "Physical AWS data center security",
      "AWS global fiber network",
      "Data, identities, access, and configuration",
      "Hardware replacement inside AWS facilities",
    ],
    answer: 2,
  },
  {
    question: "Which cloud model combines on-premises systems with cloud services?",
    options: ["Public cloud", "Private cloud", "Hybrid cloud", "Offline cloud"],
    answer: 2,
  },
  {
    question: "What is vertical scaling?",
    options: [
      "Adding more instances",
      "Increasing the size or power of one resource",
      "Using multiple accounts",
      "Deleting unused resources",
    ],
    answer: 1,
  },
  {
    question: "Which phrase best matches disaster recovery?",
    options: [
      "Preventing all possible user mistakes",
      "Restoring systems after a major incident",
      "Writing application code faster",
      "Choosing a database name",
    ],
    answer: 1,
  },
  {
    question: "What is a major cloud cost benefit?",
    options: [
      "Large upfront hardware purchases are required",
      "You pay only for resources you use",
      "Every workload becomes free",
      "You must overprovision forever",
    ],
    answer: 1,
  },
  {
    question: "What does AWS mean by security of the cloud?",
    options: [
      "Customer IAM passwords",
      "Customer application code",
      "AWS physical facilities and global infrastructure",
      "Customer database rows",
    ],
    answer: 2,
  },
];

export function AwsCloudPractitionerLesson() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeWeek, setActiveWeek] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const selectedWeek = awsLearningRoadmap.find((week) => week.week === activeWeek);
  const completedLessonCount = 0;
  const score = useMemo(
    () =>
      quizQuestions.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0
      ),
    [answers]
  );

  useEffect(() => {
    if (!activeWeek) return;

    const scrollTimer = window.setTimeout(() => {
      detailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [activeWeek]);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute left-1/2 top-24 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <Button asChild variant="outline" className="mb-8 rounded-full border-white/10">
            <Link href="/learning/certifications/aws">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AWS Certifications
            </Link>
          </Button>

          <div className="mb-12">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
                  <CalendarDays className="mr-2 h-3.5 w-3.5" />
                  Learning Roadmap
                </Badge>
                <h2 className="text-3xl font-headline font-bold">2-4 Week Certification Flow</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Follow this order before going deep into services. The path starts with
                  fundamentals, then moves into core AWS services, security, monitoring,
                  billing, and architecture.
                </p>
              </div>
              <Badge variant="secondary" className="w-fit bg-secondary/70">
                1.5-2 hours per day
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {awsLearningRoadmap.map((item, index) => {
                const isSelected = activeWeek === item.week;

                return (
                  <motion.button
                    key={item.week}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveWeek(item.week)}
                    className={cn(
                      "group flex h-full flex-col rounded-lg border bg-card/45 p-6 text-left backdrop-blur-xl transition-colors",
                      isSelected
                        ? "border-primary/45 bg-primary/10 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                        : "border-white/10 hover:border-primary/35 hover:bg-primary/5"
                    )}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        {item.week}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:text-primary",
                          isSelected && "rotate-180 text-primary"
                        )}
                      />
                    </div>
                    <h3 className="text-2xl font-headline font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                        {item.estimatedHours}
                      </Badge>
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        {item.lessons.length ? `${item.lessons.length} lessons` : "Coming Soon"}
                      </Badge>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedWeek?.week === "Week 1" ? (
              <motion.div
                ref={detailRef}
                key="week-1-content"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="scroll-mt-24"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mb-10 rounded-lg border border-white/10 bg-card/35 p-8 backdrop-blur-xl"
                >
                  <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Week 1: AWS Cloud Practitioner
                  </Badge>
                  <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                    <div>
                      <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
                        Cloud <span className="gradient-text">Fundamentals</span>
                      </h1>
                      <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Start your AWS certification path by learning what cloud computing is,
                        why companies use it, and how AWS expects you to think about reliability,
                        scale, recovery, and security responsibility.
                      </p>
                    </div>

                    <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Practice Progress</p>
                            <p className="mt-1 text-3xl font-headline font-bold">
                              {completedLessonCount}/{quizQuestions.length} Lessons Completed
                            </p>
                          </div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60">
                            <Timer className="h-7 w-7 text-primary" />
                          </div>
                        </div>
                        <Progress value={(completedLessonCount / quizQuestions.length) * 100} />
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          Estimated lesson time: 35 minutes. Read the concepts first, then use
                          the quiz to check exam readiness.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {objectives.map((objective, index) => (
              <motion.div
                key={objective}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {objective}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-3xl font-headline font-bold">Traditional vs Cloud</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  In traditional hosting, you buy servers, estimate capacity, maintain
                  hardware, and wait for procurement. In cloud hosting, AWS provides
                  resources on demand so you can launch quickly and scale when needed.
                </p>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                    <p className="font-semibold">Traditional data center</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Buy hardware, install servers, manage physical capacity.
                    </p>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                    <p className="font-semibold text-primary">AWS cloud</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Request resources, deploy globally, pay for usage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-3xl font-headline font-bold">Portfolio Example</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Imagine your portfolio launches a new AI resume feature and traffic
                  suddenly grows. On-premises hosting might run out of capacity. With AWS,
                  you can scale compute, add managed storage, use backups, and serve
                  visitors from global infrastructure.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  {["Visitors", "Load Balancer", "EC2 Fleet", "Database"].map((step, index) => (
                    <div key={step} className="relative rounded-lg border border-white/10 bg-background/60 p-4 text-center">
                      <p className="text-sm font-semibold">{step}</p>
                      {index < 3 ? (
                        <ArrowRight className="mx-auto mt-3 hidden h-4 w-4 text-primary md:block" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="mb-5 text-3xl font-headline font-bold">Lesson Modules</h2>
            <Accordion type="single" collapsible defaultValue="module-0" className="rounded-lg border border-white/10 bg-card/35 px-5 backdrop-blur-xl">
              {lessons.map((lesson, index) => {
                const Icon = lesson.icon;
                return (
                  <AccordionItem key={lesson.title} value={`module-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </span>
                        <span>
                          Lesson {index + 1}: {lesson.title}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">
                      <p>{lesson.body}</p>
                      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-foreground">
                        <span className="font-semibold text-primary">Exam tip: </span>
                        {lesson.examTip}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {serviceModels.map((model) => (
              <Card key={model.model} className="border-white/10 bg-card/45 backdrop-blur-xl">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
                    {model.model}
                  </Badge>
                  <h3 className="text-2xl font-headline font-bold">{model.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    <span className="text-foreground">AWS example:</span> {model.awsExample}
                  </p>
                  <div className="mt-5 space-y-3 text-sm leading-6">
                    <p>
                      <span className="text-foreground">You manage:</span>{" "}
                      <span className="text-muted-foreground">{model.youManage}</span>
                    </p>
                    <p>
                      <span className="text-foreground">AWS manages:</span>{" "}
                      <span className="text-muted-foreground">{model.awsManages}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-3xl font-headline font-bold">Key Exam Tips</h2>
                <div className="mt-6 space-y-4">
                  {examTips.map((tip) => (
                    <div key={tip} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-headline font-bold">Practice Quiz</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Score: {score}/{quizQuestions.length}
                    </p>
                  </div>
                  <Button variant="outline" className="w-fit rounded-full border-white/10" onClick={() => setAnswers({})}>
                    Reset Quiz
                  </Button>
                </div>

                <div className="mt-6 space-y-5">
                  {quizQuestions.map((question, questionIndex) => (
                    <div key={question.question} className="rounded-lg border border-white/10 bg-background/50 p-4">
                      <p className="font-semibold">
                        {questionIndex + 1}. {question.question}
                      </p>
                      <div className="mt-4 grid gap-2">
                        {question.options.map((option, optionIndex) => {
                          const selected = answers[questionIndex] === optionIndex;
                          const answered = answers[questionIndex] !== undefined;
                          const correct = optionIndex === question.answer;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setAnswers((current) => ({
                                  ...current,
                                  [questionIndex]: optionIndex,
                                }))
                              }
                              className={cn(
                                "rounded-lg border border-white/10 bg-card/45 px-4 py-3 text-left text-sm transition-all hover:border-primary/30 hover:bg-primary/5",
                                selected && "border-primary/40 bg-primary/10",
                                answered && correct && "border-emerald-400/40 bg-emerald-500/10",
                                answered && selected && !correct && "border-red-400/40 bg-red-500/10"
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
              </motion.div>
            ) : selectedWeek ? (
              <motion.div
                ref={detailRef}
                key={selectedWeek.week}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Card className="border-dashed border-primary/20 bg-primary/5 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-background/60">
                          <Construction className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 border-primary/20 bg-background/60 text-primary">
                            {selectedWeek.week}
                          </Badge>
                          <h2 className="text-3xl font-headline font-bold">
                            {selectedWeek.title}
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                            Lessons Coming Soon. This week is selected and ready for future lessons.
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit border-primary/20 bg-background/60 text-primary">
                        {selectedWeek.estimatedHours}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {selectedWeek.plannedTopics.map((topic) => (
                        <div
                          key={topic}
                          className="rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm text-muted-foreground"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
