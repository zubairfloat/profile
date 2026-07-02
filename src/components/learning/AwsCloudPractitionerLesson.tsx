"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Cloud,
  Construction,
  Database,
  Globe2,
  Layers3,
  Network,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Server,
  Sparkles,
  Star,
  Timer,
  XCircle,
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
import { awsQuizzes, type AwsQuiz } from "@/data/aws-quizzes";
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

const week2Objectives = [
  "Understand AWS compute services and when to use EC2, Lambda, ECS, and EKS.",
  "Compare storage services across object, block, file, and archive storage.",
  "Explain relational databases, NoSQL databases, and Aurora's AWS-native advantages.",
  "Understand VPC, subnets, route tables, gateways, firewalls, and Elastic IPs.",
  "Build a mental model of how AWS services work together in a modern application.",
];

const week2Modules = [
  {
    title: "Module 1: Compute Services",
    icon: Server,
    summary:
      "Compute services provide the processing power to run applications. EC2 gives full virtual server control, Lambda runs code without server management, and ECS/EKS run containerized workloads.",
    sections: [
      "Amazon EC2 is a virtual server in the cloud. Use it for web apps, REST APIs, Node.js servers, React SSR apps, enterprise systems, legacy apps, and custom software.",
      "AWS Lambda runs code when triggered. It is excellent for APIs, automation, scheduled jobs, notifications, file processing, image resizing, and mobile backends.",
      "Amazon ECS is AWS-native container orchestration for Docker applications and microservices.",
      "Amazon EKS is AWS managed Kubernetes. ECS is simpler and AWS-focused; EKS is more powerful, Kubernetes-based, and multi-cloud friendly.",
    ],
    comparison: [
      ["EC2", "Long-running apps, full OS control, custom software"],
      ["Lambda", "Event-driven tasks, short-lived workloads, automatic scaling"],
      ["ECS", "AWS-native Docker orchestration"],
      ["EKS", "Managed Kubernetes for advanced container platforms"],
    ],
  },
  {
    title: "Module 2: Storage Services",
    icon: Database,
    summary:
      "AWS storage services differ by how data is accessed. S3 stores objects, EBS acts like an EC2 disk, EFS is shared file storage, and Glacier is long-term archive storage.",
    sections: [
      "Amazon S3 stores objects such as images, videos, PDFs, backups, static websites, logs, and data lake files.",
      "Amazon EBS is block storage attached to an EC2 instance. Think of it as the hard drive for a virtual server.",
      "Amazon EFS is a shared file system that multiple EC2 instances can access simultaneously.",
      "Amazon S3 Glacier is designed for long-term archive storage with lower cost and slower retrieval.",
    ],
    comparison: [
      ["S3", "Object storage for photos, videos, files, backups"],
      ["EBS", "Block storage for EC2 disks, boot volumes, databases"],
      ["EFS", "File storage shared by multiple servers"],
      ["Glacier", "Archive storage for long-term backups and compliance"],
    ],
  },
  {
    title: "Module 3: Database Services",
    icon: Layers3,
    summary:
      "AWS database services include managed relational databases, serverless NoSQL, and AWS cloud-native high-performance relational databases.",
    sections: [
      "Amazon RDS is a managed relational database service supporting MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server. AWS handles backups, updates, monitoring, and failover.",
      "Amazon DynamoDB is a serverless NoSQL database for key-value access patterns, user sessions, shopping carts, gaming, IoT, and mobile apps.",
      "Amazon Aurora is AWS's cloud-native relational database compatible with MySQL and PostgreSQL, offering higher performance, replication, fault tolerance, and availability.",
    ],
    comparison: [
      ["RDS", "Traditional SQL applications like e-commerce, ERP, CRM, banking"],
      ["DynamoDB", "Massive scale, low latency, serverless NoSQL"],
      ["Aurora", "High-performance SQL workloads with AWS-native reliability"],
    ],
  },
  {
    title: "Module 4: Networking",
    icon: Network,
    summary:
      "Networking connects AWS resources securely. A VPC is your private network, subnets divide it, gateways connect it, and firewalls control access.",
    sections: [
      "Amazon VPC is your private network inside AWS. Most applications run inside a VPC.",
      "Public subnets host internet-accessible resources such as load balancers and public web servers. Private subnets host internal resources such as databases and backend APIs.",
      "Internet Gateway enables internet access for public subnets. NAT Gateway allows private resources to reach the internet outbound only.",
      "Security Groups are stateful instance-level firewalls. Network ACLs are stateless subnet-level firewalls.",
      "Elastic IP is a static public IPv4 address that can be remapped when a stable public IP is required.",
    ],
    comparison: [
      ["VPC", "Private AWS network"],
      ["Public Subnet", "Internet-accessible resources"],
      ["Private Subnet", "Internal resources such as databases"],
      ["Security Group", "Stateful firewall at instance level"],
      ["Network ACL", "Stateless firewall at subnet level"],
    ],
  },
];

const week2ExamTips = [
  "EC2 = virtual machine you manage.",
  "Lambda = serverless, event-driven compute.",
  "ECS = AWS-native container orchestration.",
  "EKS = managed Kubernetes.",
  "S3 = object storage. EBS = block storage. EFS = shared file storage. Glacier = archive storage.",
  "RDS and Aurora are relational. DynamoDB is serverless NoSQL.",
  "VPC is your private network. Public subnets face the internet; private subnets stay internal.",
  "Internet Gateway enables public internet access. NAT Gateway enables outbound-only access from private subnets.",
  "Security Groups are stateful instance firewalls. Network ACLs are stateless subnet firewalls.",
  "Elastic IP gives a stable public IPv4 address.",
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

type QuizMode = "practice" | "exam";

function InteractiveAwsQuiz({
  quiz,
  checklistItems,
}: {
  quiz: AwsQuiz;
  checklistItems: string[];
}) {
  const storageKey = `aws-learning-progress:${quiz.id}`;
  const [mode, setMode] = useState<QuizMode>("practice");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});
  const [visibleExplanations, setVisibleExplanations] = useState<Record<string, boolean>>({});
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [secondsLeft, setSecondsLeft] = useState(quiz.durationMinutes * 60);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [hasLoadedSavedProgress, setHasLoadedSavedProgress] = useState(false);

  const activeQuestion = quiz.questions[activeIndex];
  const answeredCount = Object.keys(submittedAnswers).length;
  const completedSectionCount = Object.values(completedSections).filter(Boolean).length;
  const totalProgressItems = checklistItems.length + quiz.questions.length;
  const completedProgressItems = completedSectionCount + answeredCount;
  const progressPercent = Math.round((completedProgressItems / totalProgressItems) * 100);
  const correctCount = quiz.questions.filter(
    (question) => submittedAnswers[question.id] === question.correctAnswer
  ).length;
  const wrongCount = answeredCount - correctCount;
  const scorePercent = answeredCount
    ? Math.round((correctCount / quiz.questions.length) * 100)
    : 0;
  const isCompleted = progressPercent === 100;
  const minutesTaken = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  const weakTopics = quiz.questions
    .filter((question) => submittedAnswers[question.id] && submittedAnswers[question.id] !== question.correctAnswer)
    .map((question) => question.topic);
  const uniqueWeakTopics = Array.from(new Set(weakTopics));

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setHasLoadedSavedProgress(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        selectedAnswers?: Record<string, string>;
        submittedAnswers?: Record<string, string>;
        completedSections?: Record<string, boolean>;
        activeIndex?: number;
        mode?: QuizMode;
        startedAt?: number;
        examSubmitted?: boolean;
      };
      setSelectedAnswers(parsed.selectedAnswers ?? {});
      setSubmittedAnswers(parsed.submittedAnswers ?? {});
      setCompletedSections(parsed.completedSections ?? {});
      setActiveIndex(parsed.activeIndex ?? 0);
      setMode(parsed.mode ?? "practice");
      setStartedAt(parsed.startedAt ?? Date.now());
      setExamSubmitted(parsed.examSubmitted ?? false);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedSavedProgress(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hasLoadedSavedProgress) return;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        selectedAnswers,
        submittedAnswers,
        completedSections,
        activeIndex,
        mode,
        startedAt,
        examSubmitted,
        completed: isCompleted,
        percentage: progressPercent,
        quizScore: scorePercent,
        lastOpened: new Date().toISOString(),
        timeSpent: minutesTaken,
      })
    );
  }, [
    activeIndex,
    completedSections,
    examSubmitted,
    hasLoadedSavedProgress,
    isCompleted,
    minutesTaken,
    mode,
    progressPercent,
    scorePercent,
    selectedAnswers,
    startedAt,
    storageKey,
    submittedAnswers,
  ]);

  useEffect(() => {
    if (mode !== "exam" || examSubmitted) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          const allSelected = quiz.questions.reduce<Record<string, string>>((answers, question) => {
            answers[question.id] = selectedAnswers[question.id] ?? "";
            return answers;
          }, {});
          setSubmittedAnswers(allSelected);
          setExamSubmitted(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [examSubmitted, mode, quiz.questions, selectedAnswers]);

  const submitCurrentAnswer = () => {
    const selected = selectedAnswers[activeQuestion.id];
    if (!selected) return;

    setSubmittedAnswers((current) => ({
      ...current,
      [activeQuestion.id]: selected,
    }));
    setVisibleExplanations((current) => ({
      ...current,
      [activeQuestion.id]: true,
    }));
  };

  const submitExam = () => {
    const allSelected = quiz.questions.reduce<Record<string, string>>((answers, question) => {
      answers[question.id] = selectedAnswers[question.id] ?? "";
      return answers;
    }, {});
    setSubmittedAnswers(allSelected);
    setVisibleExplanations(
      quiz.questions.reduce<Record<string, boolean>>((visible, question) => {
        visible[question.id] = true;
        return visible;
      }, {})
    );
    setExamSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setVisibleExplanations({});
    setCompletedSections({});
    setActiveIndex(0);
    setSecondsLeft(quiz.durationMinutes * 60);
    setStartedAt(Date.now());
    setExamSubmitted(false);
    window.localStorage.removeItem(storageKey);
  };

  const moveSelection = (direction: 1 | -1) => {
    const currentIndex = activeQuestion.options.findIndex(
      (option) => option.id === selectedAnswers[activeQuestion.id]
    );
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + activeQuestion.options.length) % activeQuestion.options.length;
    setSelectedAnswers((current) => ({
      ...current,
      [activeQuestion.id]: activeQuestion.options[nextIndex].id,
    }));
  };

  const submittedAnswer = submittedAnswers[activeQuestion.id];
  const selectedAnswer = selectedAnswers[activeQuestion.id];
  const isCorrect = submittedAnswer === activeQuestion.correctAnswer;
  const canReveal = mode === "practice" ? Boolean(submittedAnswer) : examSubmitted;
  const timeLabel = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
              Interactive Quiz
            </Badge>
            <h2 className="text-3xl font-headline font-bold">{quiz.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complete the reading checklist and answer every question to finish the lesson.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === "practice" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setMode("practice")}
            >
              Practice Mode
            </Button>
            <Button
              type="button"
              variant={mode === "exam" ? "default" : "outline"}
              className="rounded-full border-white/10"
              onClick={() => {
                setMode("exam");
                setExamSubmitted(false);
                setSecondsLeft(quiz.durationMinutes * 60);
              }}
            >
              Exam Mode
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Lesson Progress</p>
            <p className="mt-1 text-2xl font-headline font-bold">{progressPercent}%</p>
            <Progress value={progressPercent} className="mt-3" />
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-1 text-2xl font-headline font-bold">
              {completedProgressItems}/{totalProgressItems}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="mt-1 text-2xl font-headline font-bold">
              {correctCount}/{quiz.questions.length} ({scorePercent}%)
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">{mode === "exam" ? "Timer" : "Readiness"}</p>
            <p className="mt-1 text-2xl font-headline font-bold">
              {mode === "exam" ? timeLabel : scorePercent >= 70 ? "Pass" : "Needs Improvement"}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-white/10 bg-background/50 p-4">
          <p className="mb-3 text-sm font-semibold text-primary">Lesson Checklist</p>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {checklistItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCompletedSections((current) => ({
                    ...current,
                    [item]: !current[item],
                  }))
                }
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  completedSections[item]
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-card/45 text-muted-foreground hover:border-primary/30"
                )}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-lg border border-white/10 bg-background/50 p-3">
            <p className="mb-3 px-2 text-sm font-semibold text-primary">Questions</p>
            <div className="space-y-2">
              {quiz.questions.map((question, index) => {
                const completed = Boolean(submittedAnswers[question.id]);
                const current = index === activeIndex;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                      completed && "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
                      current && !completed && "border-primary/40 bg-primary/10 text-primary",
                      !current && !completed && "border-white/10 bg-card/45 text-muted-foreground"
                    )}
                  >
                    Question {index + 1}
                    {completed ? <CheckCircle2 className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <motion.div
            key={activeQuestion.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg border border-white/10 bg-background/50 p-5"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                {activeQuestion.topic}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                {activeQuestion.difficulty}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                {activeIndex + 1}/{quiz.questions.length}
              </Badge>
            </div>

            <h3 className="text-2xl font-headline font-bold leading-tight">
              {activeQuestion.question}
            </h3>

            <div
              className="mt-5 space-y-3"
              role="radiogroup"
              aria-label={activeQuestion.question}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  moveSelection(1);
                }
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  moveSelection(-1);
                }
              }}
            >
              {activeQuestion.options.map((option) => {
                const selected = selectedAnswer === option.id;
                const submitted = submittedAnswer === option.id;
                const correct = activeQuestion.correctAnswer === option.id;
                return (
                  <motion.label
                    key={option.id}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border bg-card/45 p-4 transition-colors",
                      selected && "border-primary/40 bg-primary/10",
                      canReveal && correct && "border-emerald-400/40 bg-emerald-500/10",
                      canReveal && submitted && !correct && "border-red-400/40 bg-red-500/10",
                      !selected && "border-white/10 hover:border-primary/30"
                    )}
                  >
                    <input
                      type="radio"
                      name={activeQuestion.id}
                      value={option.id}
                      checked={selected}
                      disabled={mode === "practice" && Boolean(submittedAnswer)}
                      onChange={() =>
                        setSelectedAnswers((current) => ({
                          ...current,
                          [activeQuestion.id]: option.id,
                        }))
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="font-code text-primary">{option.id}.</span>{" "}
                      {option.text}
                    </span>
                  </motion.label>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {mode === "practice" ? (
                <Button
                  type="button"
                  className="rounded-full"
                  disabled={!selectedAnswer || Boolean(submittedAnswer)}
                  onClick={submitCurrentAnswer}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-full"
                  disabled={examSubmitted}
                  onClick={submitExam}
                >
                  Submit Exam
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10"
                disabled={!canReveal}
                onClick={() =>
                  setVisibleExplanations((current) => ({
                    ...current,
                    [activeQuestion.id]: !current[activeQuestion.id],
                  }))
                }
              >
                Show Explanation
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10"
                onClick={() => setActiveIndex((current) => Math.min(current + 1, quiz.questions.length - 1))}
              >
                Next Question
              </Button>
              <Button type="button" variant="outline" className="rounded-full border-white/10" onClick={resetQuiz}>
                Reset Quiz
              </Button>
              <Button type="button" variant="outline" className="rounded-full border-white/10" onClick={resetQuiz}>
                Retake Quiz
              </Button>
            </div>

            <AnimatePresence>
              {canReveal && visibleExplanations[activeQuestion.id] ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className={cn(
                    "mt-6 rounded-lg border p-5",
                    isCorrect
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-red-400/30 bg-red-500/10"
                  )}
                >
                  <div className="mb-4 flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-300" />
                    )}
                    <div>
                      <p className="text-xl font-headline font-bold">
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      {!isCorrect ? (
                        <p className="text-sm text-muted-foreground">
                          Correct answer: {activeQuestion.correctAnswer}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {activeQuestion.explanation}
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {activeQuestion.options.map((option) => (
                      <div key={option.id} className="rounded-lg border border-white/10 bg-background/60 p-3">
                        <p className="font-semibold">Why {option.id} {option.id === activeQuestion.correctAnswer ? "is correct" : "is wrong"}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {activeQuestion.whyWrong[option.id]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-background/60 p-3">
                      <p className="font-semibold text-primary">Real-world example</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeQuestion.realWorldExample}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-background/60 p-3">
                      <p className="font-semibold text-primary">AWS exam tip</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeQuestion.examTip}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-background/60 p-3">
                      <p className="font-semibold text-primary">Memory trick</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeQuestion.memoryHack}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-background/60 p-3">
                      <p className="font-semibold text-primary">Interview question</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeQuestion.interviewQuestion}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-white/10 bg-background/60 p-3">
                    <p className="font-semibold text-primary">Common beginner mistake</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeQuestion.beginnerMistake}</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="border-white/10 bg-background/50">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Detailed Review</p>
              <p className="mt-2 text-2xl font-headline font-bold">Overall Score {scorePercent}%</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Time taken: {minutesTaken} min. Correct: {correctCount}. Wrong: {wrongCount}.
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-background/50">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Weak Topics</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {uniqueWeakTopics.length ? uniqueWeakTopics.join(", ") : "No weak topics yet."}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Suggested next lesson: {quiz.suggestedNextLesson}
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-background/50">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Exam Readiness</p>
              <div className="mt-2 flex gap-1 text-primary">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className={cn("h-5 w-5", scorePercent >= (star + 1) * 20 && "fill-primary")}
                  />
                ))}
              </div>
              <p className="mt-2 text-2xl font-headline font-bold">{scorePercent}%</p>
              <p className="text-sm text-muted-foreground">{quiz.readinessLabel}</p>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative mt-6 overflow-hidden rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-6 text-center"
            >
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 18 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 150, opacity: [0, 1, 0], rotate: 180 }}
                    transition={{ delay: index * 0.04, duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
                    className="absolute top-0 h-2 w-2 rounded-sm bg-primary"
                    style={{ left: `${(index * 17) % 100}%` }}
                  />
                ))}
              </div>
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
              <h3 className="mt-4 text-3xl font-headline font-bold">Lesson Completed!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Excellent work! You are now ready for the next lesson.
              </p>
              <Button className="mt-5 rounded-full">
                Continue to Next Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function AwsCloudPractitionerLesson() {
  const [activeWeek, setActiveWeek] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const selectedWeek = awsLearningRoadmap.find((week) => week.week === activeWeek);
  const completedLessonCount = 0;
  const week1QuizQuestionCount = awsQuizzes["week-1-cloud-fundamentals"].questions.length;
  const week2 = awsLearningRoadmap.find((week) => week.week === "Week 2");
  const week2TotalMinutes =
    week2?.lessons.reduce(
      (total, lesson) => total + Number.parseInt(lesson.duration, 10),
      0
    ) ?? 0;

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
                              {completedLessonCount}/{week1QuizQuestionCount} Lessons Completed
                            </p>
                          </div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60">
                            <Timer className="h-7 w-7 text-primary" />
                          </div>
                        </div>
                        <Progress value={(completedLessonCount / week1QuizQuestionCount) * 100} />
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

            <InteractiveAwsQuiz
              quiz={awsQuizzes["week-1-cloud-fundamentals"]}
              checklistItems={[
                "Read Hero",
                "Read Architecture Diagram",
                "Read Service Map",
                "Read Cloud Comparison",
                "Read Lesson Modules",
                "Read Service Models",
                "Read Exam Tips",
              ]}
            />
          </div>
              </motion.div>
            ) : selectedWeek?.week === "Week 2" ? (
              <motion.div
                ref={detailRef}
                key="week-2-content"
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
                    Week 2: AWS Cloud Practitioner
                  </Badge>
                  <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                    <div>
                      <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
                        Core AWS <span className="gradient-text">Services</span>
                      </h1>
                      <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Learn the most important AWS services that appear frequently in
                        the Cloud Practitioner exam: compute, storage, databases,
                        networking, and how they work together in real applications.
                      </p>
                    </div>

                    <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Week 2 Progress</p>
                            <p className="mt-1 text-3xl font-headline font-bold">
                              0/{week2?.lessons.length ?? 0} Lessons Completed
                            </p>
                          </div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60">
                            <Server className="h-7 w-7 text-primary" />
                          </div>
                        </div>
                        <Progress value={0} />
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          Estimated study time: {week2TotalMinutes} minutes. Focus on
                          what each service does, when to use it, and the exam comparison points.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                  {week2Objectives.map((objective, index) => (
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

                <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                  <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h2 className="text-3xl font-headline font-bold">How Core Services Fit Together</h2>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        A typical AWS application receives traffic from the internet,
                        enters a VPC through an Internet Gateway, uses public subnets for
                        load balancers or web servers, and keeps databases in private subnets.
                      </p>
                      <div className="mt-6 space-y-3">
                        {[
                          "Internet",
                          "Internet Gateway",
                          "VPC",
                          "Public Subnet: Load Balancer + EC2",
                          "Private Subnet: RDS + application data",
                          "Managed service access: DynamoDB or S3",
                        ].map((step, index) => (
                          <div key={step} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs text-primary">
                              {index + 1}
                            </div>
                            <div className="flex-1 rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm">
                              {step}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h2 className="text-3xl font-headline font-bold">Service Map</h2>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Compute", "EC2, Lambda, ECS, EKS"],
                          ["Storage", "S3, EBS, EFS, Glacier"],
                          ["Database", "RDS, DynamoDB, Aurora"],
                          ["Networking", "VPC, Subnets, Gateways, Firewalls"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-white/10 bg-background/60 p-4">
                            <p className="font-semibold text-primary">{label}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-12">
                  <h2 className="mb-5 text-3xl font-headline font-bold">Week 2 Modules</h2>
                  <div className="grid gap-5">
                    {week2Modules.map((module, index) => {
                      const Icon = module.icon;

                      return (
                        <motion.article
                          key={module.title}
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
                        >
                          <div className="mb-5 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-headline font-bold">{module.title}</h3>
                              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                {module.summary}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="space-y-3">
                              {module.sections.map((section) => (
                                <div key={section} className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
                                  {section}
                                </div>
                              ))}
                            </div>
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                              <p className="mb-3 text-sm font-semibold text-primary">Exam Comparison</p>
                              <div className="space-y-3">
                                {module.comparison.map(([label, detail]) => (
                                  <div key={label} className="rounded-lg border border-white/10 bg-background/60 p-3">
                                    <p className="font-semibold">{label}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h2 className="text-3xl font-headline font-bold">Week 2 Exam Tips</h2>
                      <div className="mt-6 space-y-4">
                        {week2ExamTips.map((tip) => (
                          <div key={tip} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <InteractiveAwsQuiz
                    quiz={awsQuizzes["week-2-core-services"]}
                    checklistItems={[
                      "Read Hero",
                      "Read Architecture Diagram",
                      "Read Service Map",
                      "Read Compute Section",
                      "Read Storage Section",
                      "Read Database Section",
                      "Read Networking Section",
                      "Read Exam Tips",
                    ]}
                  />
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
