"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Trophy,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cheatSheet,
  memoryMap,
  networkingQuiz,
  networkingSections,
  networkingTopics,
  packetJourney,
  serviceComparisons,
} from "./networking-content";
import type { NetworkingTopic, QuizQuestion } from "./types/networking.types";

type NavItem = {
  id: string;
  label: string;
  eyebrow?: string;
};

type QuestionOption = {
  id: string;
  label: string;
  explanation: string;
};

type AwsQuestion = {
  id: string;
  question: string;
  options: QuestionOption[];
  correctOptionId: string;
  correctExplanation: string;
  examClue: string;
  realWorldExample: string;
  relatedService: string;
};

type CheckedAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  relatedService: string;
};

const topicOrder = [
  "aws-cloud",
  "regions",
  "availability-zones",
  "vpc",
  "subnets",
  "public-subnet",
  "private-subnet",
  "internet-gateway",
  "vpn",
  "virtual-private-gateway",
  "network-traffic-packets",
  "network-acl",
  "security-group",
  "shared-responsibility-networking",
  "dns",
  "route-53",
  "cloudfront",
  "global-accelerator",
  "client-vpn",
  "site-to-site-vpn",
  "privatelink",
  "direct-connect",
  "transit-gateway",
  "nat-gateway",
  "api-gateway",
];

const comparisonDetails = [
  {
    id: "public-private-subnet",
    title: "Public Subnet vs Private Subnet",
    purpose: "Choose where public and private application layers should live.",
    scope: "Subnet route-table behavior inside a VPC.",
    trafficType: "Public subnet supports public-facing paths; private subnet protects internal traffic.",
    internetUsage: "Public subnet routes to Internet Gateway; private subnet can use NAT Gateway for outbound-only access.",
    state: "Not stateful or stateless firewalls; they are network placement patterns.",
    bestUse: "Load balancers in public subnets, databases in private subnets.",
    analogy: "Reception versus secure vault.",
    clue: "Public route to Internet Gateway versus no direct inbound Internet access.",
    mistake: "Thinking a subnet is public just because an Internet Gateway exists.",
  },
  {
    id: "igw-vgw",
    title: "Internet Gateway vs Virtual Private Gateway",
    purpose: "Choose public Internet access or private VPN entry.",
    scope: "Gateway attached to a VPC or used as AWS-side VPN endpoint.",
    trafficType: "Public customer traffic versus encrypted corporate network traffic.",
    internetUsage: "Internet Gateway is for public Internet paths; Virtual Private Gateway terminates VPN tunnels.",
    state: "Neither is a firewall.",
    bestUse: "Websites use Internet Gateway; offices use VPN with Virtual Private Gateway.",
    analogy: "Public front door versus secure AWS-side tunnel gate.",
    clue: "Public website traffic or Site-to-Site VPN.",
    mistake: "Using Virtual Private Gateway for normal public website access.",
  },
  {
    id: "sg-nacl",
    title: "Security Group vs Network ACL",
    purpose: "Control allowed network traffic at different layers.",
    scope: "Security Group is resource/interface level; Network ACL is subnet level.",
    trafficType: "Both can filter inbound and outbound traffic.",
    internetUsage: "Both can protect Internet-facing and private resources.",
    state: "Security Group is stateful; Network ACL is stateless.",
    bestUse: "Security Groups for EC2 or load balancers; NACLs for subnet boundary rules.",
    analogy: "Office guard who remembers you versus immigration checkpoint.",
    clue: "Stateful/resource-level or stateless/subnet-level.",
    mistake: "Expecting Security Groups to support explicit deny rules.",
  },
  {
    id: "client-site-vpn",
    title: "Client VPN vs Site-to-Site VPN",
    purpose: "Choose individual remote access or full office connectivity.",
    scope: "Single device/user versus entire on-premises network.",
    trafficType: "Encrypted VPN traffic.",
    internetUsage: "Both use encrypted tunnels over the Internet.",
    state: "Connectivity services, not firewalls.",
    bestUse: "Remote employees use Client VPN; branches use Site-to-Site VPN.",
    analogy: "One employee tunnel versus whole office tunnel.",
    clue: "Individual user or entire corporate office.",
    mistake: "Choosing Client VPN for a complete data center connection.",
  },
  {
    id: "vpn-direct-connect",
    title: "VPN vs Direct Connect",
    purpose: "Choose encrypted Internet tunnel or dedicated network path.",
    scope: "Hybrid connectivity between external networks and AWS.",
    trafficType: "Private hybrid-cloud traffic.",
    internetUsage: "VPN travels over Internet; Direct Connect uses a dedicated path.",
    state: "Connectivity services, not packet firewalls.",
    bestUse: "VPN for secure quick setup; Direct Connect for consistent high bandwidth.",
    analogy: "Secure tunnel versus private dedicated highway.",
    clue: "Encrypted tunnel or dedicated connection.",
    mistake: "Assuming Direct Connect automatically encrypts traffic.",
  },
  {
    id: "nat-igw",
    title: "NAT Gateway vs Internet Gateway",
    purpose: "Choose outbound-only private access or public Internet connectivity.",
    scope: "NAT Gateway sits in a public subnet; Internet Gateway attaches to a VPC.",
    trafficType: "Private subnet outbound IPv4 traffic versus public inbound/outbound paths.",
    internetUsage: "NAT Gateway uses Internet Gateway to reach the Internet.",
    state: "Neither is a security firewall.",
    bestUse: "Private EC2 updates use NAT Gateway; public web access uses Internet Gateway.",
    analogy: "One-way exit versus public entrance.",
    clue: "Private subnet needs outbound Internet access.",
    mistake: "Using Internet Gateway alone for a private instance outbound-only pattern.",
  },
  {
    id: "edge-services",
    title: "Route 53 vs CloudFront vs Global Accelerator",
    purpose: "Choose DNS routing, content delivery, or global traffic acceleration.",
    scope: "Global DNS, Edge Locations, and AWS global network paths.",
    trafficType: "Name resolution, cacheable content, or dynamic application traffic.",
    internetUsage: "All help public users reach applications, but in different ways.",
    state: "Not stateful or stateless firewalls.",
    bestUse: "Domains use Route 53, static/media content uses CloudFront, dynamic low-latency apps use Global Accelerator.",
    analogy: "Phone book, local warehouse, express highway.",
    clue: "DNS, cache near users, or dynamic failover.",
    mistake: "Thinking Global Accelerator caches content like CloudFront.",
  },
];

const navGroups: { heading: string; items: NavItem[] }[] = [
  {
    heading: "AWS Global Infrastructure",
    items: [
      { id: "aws-cloud", label: "AWS Cloud" },
      { id: "regions", label: "AWS Region" },
      { id: "availability-zones", label: "Availability Zone" },
      { id: "vpc", label: "Amazon VPC" },
      { id: "subnets", label: "Subnet" },
      { id: "public-subnet", label: "Public Subnet" },
      { id: "private-subnet", label: "Private Subnet" },
      { id: "internet-gateway", label: "Internet Gateway" },
    ],
  },
  {
    heading: "VPC, VPN and Gateway Services",
    items: [
      { id: "vpn", label: "VPN" },
      { id: "virtual-private-gateway", label: "Virtual Private Gateway" },
      { id: "comparison-igw-vgw", label: "Internet Gateway vs Virtual Private Gateway" },
    ],
  },
  {
    heading: "Network Security",
    items: [
      { id: "network-traffic-packets", label: "Network Traffic and Packets" },
      { id: "network-acl", label: "Network ACL" },
      { id: "security-group", label: "Security Group" },
      { id: "packet-journey", label: "Packet Journey" },
      { id: "comparison-sg-nacl", label: "Security Group vs Network ACL" },
      { id: "shared-responsibility-networking", label: "AWS Shared Responsibility for Networking" },
    ],
  },
  {
    heading: "Edge Networking Services",
    items: [
      { id: "dns", label: "DNS" },
      { id: "route-53", label: "Amazon Route 53" },
      { id: "cloudfront", label: "Amazon CloudFront" },
      { id: "global-accelerator", label: "AWS Global Accelerator" },
      { id: "comparison-edge-services", label: "Route 53 vs CloudFront vs Global Accelerator" },
    ],
  },
  {
    heading: "AWS Connectivity Services",
    items: [
      { id: "client-vpn", label: "AWS Client VPN" },
      { id: "site-to-site-vpn", label: "AWS Site-to-Site VPN" },
      { id: "comparison-client-site-vpn", label: "Client VPN vs Site-to-Site VPN" },
      { id: "privatelink", label: "AWS PrivateLink" },
      { id: "direct-connect", label: "AWS Direct Connect" },
      { id: "comparison-vpn-direct-connect", label: "VPN vs Direct Connect" },
      { id: "transit-gateway", label: "AWS Transit Gateway" },
      { id: "nat-gateway", label: "NAT Gateway" },
      { id: "api-gateway", label: "Amazon API Gateway" },
    ],
  },
  {
    heading: "Interactive Learning",
    items: [
      { id: "packet-journey-visualizer", label: "Packet Journey Visualizer" },
      { id: "service-comparison-tool", label: "Service Comparison Tool" },
      { id: "scenario-based-questions", label: "Scenario-Based Questions" },
      { id: "final-assessment", label: "Final Assessment" },
      { id: "quick-cheat-sheet", label: "Quick Cheat Sheet" },
      { id: "memory-map", label: "Memory Map" },
    ],
  },
];

function shuffleQuestions(questions: AwsQuestion[]) {
  return [...questions].sort(() => 0.5 - Math.random()).slice(0, 20);
}

function getComparison(id: string) {
  return comparisonDetails.find((item) => item.id === id) ?? comparisonDetails[0];
}

function toAwsQuestion(question: QuizQuestion): AwsQuestion {
  return {
    id: question.id,
    question: question.question,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.text,
      explanation:
        option.id === question.correctOptionId
          ? question.explanation
          : option.whyIncorrect ?? "This option solves a different AWS networking problem.",
    })),
    correctOptionId: question.correctOptionId,
    correctExplanation: question.explanation,
    examClue: question.examKeyword,
    realWorldExample: `In a real AWS workload, ${question.relatedService} is selected when the scenario keyword is "${question.examKeyword}".`,
    relatedService: question.relatedService,
  };
}

function topicCheckQuestion(topic: NetworkingTopic): AwsQuestion {
  const check = topic.checks[0];
  const distractors = ["Amazon Route 53", "AWS Direct Connect", "Security Group"].filter(
    (item) => item !== check.answer
  );

  return {
    id: `${topic.id}-knowledge-check`,
    question: check.question,
    options: [
      {
        id: "a",
        label: check.answer,
        explanation: `${check.answer} is correct for this topic because it directly matches ${topic.name}.`,
      },
      {
        id: "b",
        label: distractors[0],
        explanation: `${distractors[0]} is an AWS service, but it does not answer this ${topic.name} knowledge check.`,
      },
      {
        id: "c",
        label: distractors[1],
        explanation: `${distractors[1]} solves a different networking scenario.`,
      },
      {
        id: "d",
        label: distractors[2],
        explanation: `${distractors[2]} is not the best match for this question.`,
      },
    ],
    correctOptionId: "a",
    correctExplanation: `${check.answer} is correct. ${topic.examTip}`,
    examClue: topic.examTip,
    realWorldExample: topic.useCase,
    relatedService: topic.name,
  };
}

function SectionShell({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-module5-nav className="scroll-mt-28 space-y-5">
      <div>
        {eyebrow ? (
          <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
            {eyebrow}
          </Badge>
        ) : null}
        <h3 className="font-headline text-2xl font-bold md:text-3xl">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ArchitectureDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-background/50 p-4">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium">
              {step}
            </div>
            {index < steps.length - 1 ? <ArrowRight className="h-4 w-4 text-primary" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function AwsQuestionCard({
  question,
  number,
  total,
  onChecked,
  onNext,
  nextLabel = "Next Question",
  isLast = false,
}: {
  question: AwsQuestion;
  number?: number;
  total?: number;
  onChecked?: (answer: CheckedAnswer) => void;
  onNext?: () => void;
  nextLabel?: string;
  isLast?: boolean;
}) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);
  const isCorrect = selectedOptionId === question.correctOptionId;

  function checkAnswer() {
    if (!selectedOptionId) return;

    setIsChecked(true);
    onChecked?.({
      questionId: question.id,
      selectedOptionId,
      isCorrect,
      relatedService: question.relatedService,
    });
  }

  return (
    <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {number && total ? (
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              Question {number} of {total}
            </Badge>
          ) : null}
          <Badge variant="secondary">{question.relatedService}</Badge>
          <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
            Clue: {question.examClue}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-7">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3" role="radiogroup" aria-label={question.question}>
          {question.options.map((option) => {
            const selected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={isChecked}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected ? "border-primary/40 bg-primary/10" : "border-white/10 bg-background/40 hover:border-primary/30"
                } ${isChecked ? "cursor-default" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={checkAnswer} disabled={!selectedOptionId || isChecked}>
            Check Answer
          </Button>
          {isChecked && onNext ? (
            <Button type="button" variant={isLast ? "secondary" : "default"} onClick={onNext}>
              {nextLabel}
              {!isLast ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>
          ) : null}
        </div>

        <div className="sr-only" aria-live="polite">
          {isChecked ? `${isCorrect ? "Correct" : "Incorrect"}. ${question.correctExplanation}` : ""}
        </div>

        {isChecked && selectedOption && correctOption ? (
          <div
            className={`rounded-lg border p-5 text-sm leading-7 ${
              isCorrect ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"
            }`}
          >
            <div className="mb-4 flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <p className="font-semibold text-foreground">{isCorrect ? "Correct" : "Incorrect"}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-semibold text-foreground">Selected answer</p>
                <p>{selectedOption.label}</p>
                <p className="mt-2">{selectedOption.explanation}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Correct answer</p>
                <p>{correctOption.label}</p>
                <p className="mt-2">{question.correctExplanation}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">Exam clue</p>
              <p>{question.examClue}</p>
              <p className="mt-3 font-semibold text-foreground">Real-world example</p>
              <p>{question.realWorldExample}</p>
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-semibold text-foreground">Why each option is correct or incorrect</p>
              {question.options.map((option) => (
                <div key={`${question.id}-${option.id}-explanation`} className="rounded-lg border border-white/10 bg-background/40 p-3">
                  <p className="font-medium text-foreground">
                    {option.label} {option.id === question.correctOptionId ? "(correct)" : "(incorrect)"}
                  </p>
                  <p>{option.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function QuizRunner({
  questions,
  title,
  badge,
  onRetry,
  retryLabel = "Retry Questions",
}: {
  questions: AwsQuestion[];
  title: string;
  badge: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<CheckedAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const activeQuestion = questions[activeIndex];
  const score = answers.filter((answer) => answer.isCorrect).length;
  const weakTopics = Array.from(
    new Set(answers.filter((answer) => !answer.isCorrect).map((answer) => answer.relatedService))
  );

  function handleChecked(answer: CheckedAnswer) {
    setAnswers((current) => {
      const withoutCurrent = current.filter((item) => item.questionId !== answer.questionId);
      return [...withoutCurrent, answer];
    });
  }

  function handleNext() {
    if (activeIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setActiveIndex((index) => index + 1);
  }

  function retry() {
    setAnswers([]);
    setActiveIndex(0);
    setIsFinished(false);
    onRetry?.();
  }

  if (isFinished) {
    return (
      <Card className="border-success/20 bg-success/10">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-success">
            <Trophy className="h-5 w-5" />
            <h4 className="font-headline text-2xl font-bold">{title} Complete</h4>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">{score}/{questions.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-2xl font-bold text-success">{score}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-sm text-muted-foreground">Incorrect</p>
              <p className="text-2xl font-bold text-destructive">{questions.length - score}</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-background/40 p-4 text-sm leading-7 text-muted-foreground">
            <p className="font-semibold text-foreground">Weak AWS topics</p>
            <p>{weakTopics.length ? weakTopics.join(", ") : "No weak topics in this attempt."}</p>
          </div>
          <Button type="button" variant="outline" onClick={retry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {retryLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-headline text-xl font-bold">{title}</h4>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
          {badge}
        </Badge>
      </div>
      <AwsQuestionCard
        key={activeQuestion.id}
        question={activeQuestion}
        number={activeIndex + 1}
        total={questions.length}
        onChecked={handleChecked}
        onNext={handleNext}
        nextLabel={activeIndex === questions.length - 1 ? "Finish" : "Next Question"}
        isLast={activeIndex === questions.length - 1}
      />
    </div>
  );
}

function TopicCard({ topic }: { topic: NetworkingTopic }) {
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  return (
    <SectionShell id={topic.id} eyebrow={topic.category} title={topic.name}>
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="space-y-6 p-5 text-sm leading-7 text-muted-foreground md:p-6">
          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">What it is</p>
              <p>{topic.definition}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">Why it is needed</p>
              <p>{topic.why}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">How it works</p>
              <p>{topic.how}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">Real-world example</p>
              <p>{topic.useCase}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
              <p className="font-semibold">Memory trick</p>
              <p>{topic.analogy}</p>
            </div>
            <div className="rounded-lg border border-warning/20 bg-warning/10 p-4 text-warning">
              <p className="font-semibold">Exam tip</p>
              <p>{topic.examTip}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-primary/20 focus-visible:ring-primary"
              onClick={() => setShowArchitecture((value) => !value)}
            >
              Show architecture
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showArchitecture ? "rotate-180" : ""}`} />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-primary/20 focus-visible:ring-primary"
              onClick={() => setShowCheck((value) => !value)}
            >
              Test my knowledge
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showCheck ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showArchitecture ? <ArchitectureDiagram steps={topic.architecture} /> : null}
          {showCheck ? (
            <AwsQuestionCard
              key={`${topic.id}-check`}
              question={topicCheckQuestion(topic)}
              onNext={() => setShowCheck(false)}
              nextLabel="Done"
              isLast
            />
          ) : null}
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function PacketJourney() {
  return (
    <SectionShell id="packet-journey" eyebrow="Network Security" title="Packet Journey">
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="space-y-5 p-6">
          <ArchitectureDiagram steps={["Customer", "Internet", "Internet Gateway", "Network ACL", "Subnet", "Security Group", "EC2 Instance"]} />
          <p className="text-sm leading-7 text-muted-foreground">
            A packet first needs routing to reach the VPC. The Network ACL checks traffic at
            the subnet boundary, then the Security Group checks access to the specific
            resource. Security Groups are stateful; Network ACLs are stateless.
          </p>
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function PacketJourneyVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const step = packetJourney[activeStep];

  return (
    <SectionShell id="packet-journey-visualizer" eyebrow="Interactive Learning" title="Packet Journey Visualizer">
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-3 md:grid-cols-5">
            {packetJourney.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-lg border p-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  index === activeStep
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/10 bg-background/40 text-muted-foreground hover:border-primary/30"
                }`}
                aria-current={index === activeStep ? "step" : undefined}
              >
                <span className="block text-xs font-semibold">Step {index + 1}</span>
                <span className="mt-1 block font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-primary">{step.label}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.detail}</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setActiveStep((value) => Math.max(value - 1, 0))} disabled={activeStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button type="button" onClick={() => setActiveStep((value) => Math.min(value + 1, packetJourney.length - 1))} disabled={activeStep === packetJourney.length - 1}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function ComparisonSummary({ comparison }: { comparison: (typeof comparisonDetails)[number] }) {
  return (
    <SectionShell id={`comparison-${comparison.id}`} eyebrow="Comparison" title={comparison.title}>
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="grid gap-3 p-6 text-sm leading-7 text-muted-foreground md:grid-cols-2">
          {[
            ["Main purpose", comparison.purpose],
            ["Scope", comparison.scope],
            ["Traffic type", comparison.trafficType],
            ["Internet usage", comparison.internetUsage],
            ["Stateful or stateless", comparison.state],
            ["Best use case", comparison.bestUse],
            ["Real-world analogy", comparison.analogy],
            ["Cloud Practitioner exam clue", comparison.clue],
            ["Common mistake", comparison.mistake],
          ].map(([label, value]) => (
            <div key={`${comparison.id}-${label}`} className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function ComparisonTool() {
  const [activeComparison, setActiveComparison] = useState(comparisonDetails[0].id);
  const comparison = comparisonDetails.find((item) => item.id === activeComparison) ?? comparisonDetails[0];
  const table = serviceComparisons.find((item) => item.id === activeComparison);

  return (
    <SectionShell id="service-comparison-tool" eyebrow="Interactive Learning" title="Service Comparison Tool">
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            {comparisonDetails.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={item.id === activeComparison ? "default" : "outline"}
                onClick={() => setActiveComparison(item.id)}
              >
                {item.title}
              </Button>
            ))}
          </div>
          <ComparisonSummary comparison={comparison} />
          {table ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-primary/10 text-primary">
                  <tr>
                    {table.columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, index) => (
                    <tr key={`${table.id}-${index}`} className="border-t border-white/10">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function QuickGrid({ id, title, items }: { id: string; title: string; items: { term: string; definition: string }[] }) {
  return (
    <SectionShell id={id} eyebrow="Review" title={title}>
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={`${title}-${item.term}`} className="rounded-lg border border-white/10 bg-background/40 p-4">
                <p className="font-semibold text-foreground">{item.term}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.definition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function TopicNavigation({
  activeId,
  isOpen,
  onToggle,
  onNavigate,
}: {
  activeId: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}) {
  return (
    <Card className="border-white/10 bg-card/80 backdrop-blur-xl">
      <CardHeader className="p-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between text-left lg:pointer-events-none"
        >
          <CardTitle className="text-lg">Topic Navigation</CardTitle>
          <ChevronDown className={`h-5 w-5 transition-transform lg:hidden ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </CardHeader>
      <CardContent className={`${isOpen ? "block" : "hidden"} space-y-5 p-4 pt-0 lg:block`}>
        {navGroups.map((group) => (
          <div key={group.heading} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.heading}</p>
            {group.items.map((item, index) => {
              const isActive = activeId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/10 bg-background/40 text-muted-foreground hover:border-primary/30"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="mt-0.5 text-xs font-semibold">{index + 1}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function Module5Networking() {
  const orderedTopics = useMemo(
    () =>
      topicOrder
        .map((id) => networkingTopics.find((topic) => topic.id === id))
        .filter((topic): topic is NetworkingTopic => Boolean(topic)),
    []
  );
  const scenarioQuestions = useMemo(() => networkingQuiz.map(toAwsQuestion), []);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AwsQuestion[]>(() =>
    networkingQuiz.slice(0, 20).map(toAwsQuestion)
  );
  const [activeNavId, setActiveNavId] = useState(navGroups[0].items[0].id);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setAssessmentQuestions(shuffleQuestions(networkingQuiz.map(toAwsQuestion)));
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-module5-nav]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveNavId(visible.target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNavId(id);
    setNavOpen(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              AWS Certified Cloud Practitioner
            </Badge>
            <Badge variant="secondary">60-90 minutes</Badge>
          </div>
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Module 5: AWS Networking and Content Delivery
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Learn AWS networking in simple English: Regions, Availability Zones, VPCs,
            subnets, gateways, firewalls, edge services, private connectivity, and exam
            scenarios.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,820px)] lg:justify-center">
        <aside className="lg:self-start">
          <TopicNavigation
            activeId={activeNavId}
            isOpen={navOpen}
            onToggle={() => setNavOpen((value) => !value)}
            onNavigate={navigateTo}
          />
        </aside>

        <div className="w-full max-w-[820px] space-y-10">
          {networkingSections.map((section) => (
            <section key={section.id} className="space-y-3">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                {section.title}
              </Badge>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{section.intro}</p>
            </section>
          ))}

          {orderedTopics.map((topic) => {
            const afterCards =
              topic.id === "virtual-private-gateway" ? (
                <ComparisonSummary key="igw-vgw" comparison={getComparison("igw-vgw")} />
              ) : topic.id === "security-group" ? (
                <>
                  <PacketJourney key="packet-journey" />
                  <ComparisonSummary key="sg-nacl" comparison={getComparison("sg-nacl")} />
                </>
              ) : topic.id === "global-accelerator" ? (
                <ComparisonSummary key="edge-services" comparison={getComparison("edge-services")} />
              ) : topic.id === "site-to-site-vpn" ? (
                <ComparisonSummary key="client-site-vpn" comparison={getComparison("client-site-vpn")} />
              ) : topic.id === "direct-connect" ? (
                <ComparisonSummary key="vpn-direct-connect" comparison={getComparison("vpn-direct-connect")} />
              ) : null;

            return (
              <div key={topic.id} className="space-y-8">
                <TopicCard topic={topic} />
                {afterCards}
              </div>
            );
          })}

          <PacketJourneyVisualizer />
          <ComparisonTool />

          <SectionShell id="scenario-based-questions" eyebrow="Interactive Learning" title="Scenario-Based Questions">
            <QuizRunner questions={scenarioQuestions} title="Scenario-Based Practice" badge="25 questions" />
          </SectionShell>

          <SectionShell id="final-assessment" eyebrow="Interactive Learning" title="Final Assessment">
            <QuizRunner
              key={assessmentQuestions.map((question) => question.id).join("-")}
              questions={assessmentQuestions}
              title="Final Assessment"
              badge="20 randomized questions"
              onRetry={() => setAssessmentQuestions(shuffleQuestions(networkingQuiz.map(toAwsQuestion)))}
              retryLabel="Retry Assessment"
            />
          </SectionShell>

          <QuickGrid id="quick-cheat-sheet" title="Quick Cheat Sheet" items={cheatSheet} />
          <QuickGrid id="memory-map" title="Memory Map" items={memoryMap} />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="font-semibold">Cloud Practitioner exam reminder</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Read the keywords first: public Internet, private subnet, subnet-level,
                  stateful, DNS, cache, dedicated connection, individual user, whole office,
                  or central hub.
                </p>
              </div>
              <Badge variant="secondary">Beginner friendly</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
