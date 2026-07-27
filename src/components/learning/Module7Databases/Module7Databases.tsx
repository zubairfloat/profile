"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Database,
  GitBranch,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DatabaseTopic = {
  id: string;
  title: string;
  category: string;
  definition: string;
  why: string;
  examples: string[];
  goodFor: string[];
  memory: string;
  examTip: string;
};

type QuizQuestion = {
  question: string;
  options: Array<{ label: string; explanation: string }>;
  answer: number;
  topic: string;
};

const databaseTopics: DatabaseTopic[] = [
  {
    id: "relational-databases",
    title: "Relational Databases",
    category: "Structured Data",
    definition:
      "A relational database stores structured data in tables made of rows and columns. Tables connect through keys and are queried with SQL.",
    why:
      "Relationships, consistency, and transactions matter when an application works with customers, products, orders, and payments.",
    examples: [
      "A Students table connects to Classes through a class ID.",
      "An online store separates customers, products, orders, and payments into related tables.",
      "SELECT, INSERT, UPDATE, and DELETE are common SQL operations.",
    ],
    goodFor: ["Structured business data", "Transactions", "SQL queries", "Strong data relationships"],
    memory: "Relational = tables + relationships + SQL.",
    examTip: "Choose a relational service when the scenario emphasizes tables, SQL, joins, or structured transactions.",
  },
  {
    id: "amazon-documentdb",
    title: "Amazon DocumentDB",
    category: "Document Database",
    definition:
      "Amazon DocumentDB is a fully managed document database service compatible with MongoDB workloads. It stores flexible, JSON-like documents instead of fixed rows and columns.",
    why:
      "Different records can have different attributes, which avoids forcing changing or nested data into many empty relational columns.",
    examples: [
      "A product catalog stores RAM and storage for a laptop, but size and color for a T-shirt.",
      "User profiles can contain optional preferences without changing a table schema.",
      "Existing MongoDB applications can often migrate with minimal code changes.",
    ],
    goodFor: ["JSON-like documents", "Flexible schemas", "Product catalogs", "Content management", "MongoDB-compatible applications"],
    memory: "DocumentDB = documents, JSON, and MongoDB compatibility.",
    examTip: "Keywords such as MongoDB, JSON documents, semi-structured data, and flexible schema point to DocumentDB.",
  },
  {
    id: "aws-backup",
    title: "AWS Backup",
    category: "Backup Management",
    definition:
      "AWS Backup is a centralized service for creating, scheduling, monitoring, and restoring backups across supported AWS services.",
    why:
      "It replaces fragmented backup processes with shared policies, retention rules, compliance controls, and one dashboard.",
    examples: [
      "One backup plan protects RDS, EBS, EFS, DynamoDB, and DocumentDB resources.",
      "Daily backups are retained for 30 days and copied to a second Region.",
      "Backup jobs and restore points are monitored centrally for compliance reporting.",
    ],
    goodFor: ["Centralized backup policies", "Cross-Region disaster recovery", "Compliance", "Automated retention", "Multi-service backup management"],
    memory: "AWS Backup = one place for all supported AWS backups.",
    examTip: "If the problem is fragmented backups across multiple AWS services, choose AWS Backup.",
  },
  {
    id: "amazon-neptune",
    title: "Amazon Neptune",
    category: "Graph Database",
    definition:
      "Amazon Neptune is a fully managed graph database designed to store and query highly connected data and the relationships between entities.",
    why:
      "Graph queries can follow connections efficiently when relationships are more important than rows, columns, or individual documents.",
    examples: [
      "A social network finds friends of friends and shared interests.",
      "A bank follows transaction relationships to identify possible fraud patterns.",
      "A recommendation engine connects customers, products, and purchases.",
    ],
    goodFor: ["Social networks", "Fraud detection", "Recommendations", "Knowledge graphs", "Network topology"],
    memory: "Neptune = a network of relationships.",
    examTip: "Friends, recommendations, fraud paths, and connected entities are strong Neptune clues.",
  },
  {
    id: "database-responsibility",
    title: "Shared Responsibility for Databases",
    category: "Operations and Security",
    definition:
      "AWS manages more of the infrastructure as a database service becomes more managed, while customers remain responsible for data, access, configuration, and appropriate use.",
    why:
      "The exam tests whether you can distinguish a managed database from software installed and maintained on EC2.",
    examples: [
      "For Amazon RDS, AWS manages provisioning, infrastructure, patching, and automated backups; you manage schema, queries, indexes, and users.",
      "For a database installed on EC2, you manage the database software, operating system, patches, backups, monitoring, and scaling.",
      "For any database, customers still protect data and configure IAM, network access, and encryption settings appropriately.",
    ],
    goodFor: ["Choosing managed services", "Reducing operations", "Security responsibility questions", "Database migration decisions"],
    memory: "Fully managed: just use it. Managed: use and tune it. Unmanaged: build and maintain it.",
    examTip: "AWS secures the cloud; the customer secures data, identities, permissions, and configuration in the cloud.",
  },
];

const comparisonRows = [
  ["Amazon RDS", "Relational SQL", "Structured transactions and business data"],
  ["Amazon Aurora", "High-performance relational", "Mission-critical relational workloads"],
  ["Amazon DynamoDB", "Key-value / NoSQL", "High-scale, low-latency applications"],
  ["Amazon DocumentDB", "Document", "Flexible JSON documents and MongoDB workloads"],
  ["Amazon Neptune", "Graph", "Highly connected relationships"],
  ["Amazon ElastiCache", "In-memory cache", "Speeding up repeated reads"],
  ["AWS Backup", "Backup management", "Centralized backup policies across services"],
];

const responsibilityRows = [
  ["Fully managed", "Servers, storage, scaling, patching, monitoring", "Data, access, permissions, and service configuration"],
  ["Managed (Amazon RDS)", "Infrastructure, OS, installation, backups, patching", "Schema, queries, indexes, users, and tuning"],
  ["Unmanaged (MySQL on EC2)", "Physical infrastructure and virtual machine", "OS, database, security, backups, patches, scaling, and monitoring"],
];

const databaseQuestions: QuizQuestion[] = [
  {
    question: "A company needs a MongoDB-compatible database for flexible JSON-like product documents. Which service fits best?",
    options: [
      { label: "Amazon DocumentDB", explanation: "Correct. DocumentDB is a managed document database compatible with MongoDB workloads." },
      { label: "Amazon Neptune", explanation: "Neptune is optimized for relationships and graph queries." },
      { label: "Amazon RDS", explanation: "RDS is a managed relational database service for structured SQL data." },
      { label: "AWS Backup", explanation: "AWS Backup centralizes backups; it is not an application database." },
    ],
    answer: 0,
    topic: "DocumentDB",
  },
  {
    question: "What main problem does AWS Backup solve?",
    options: [
      { label: "Fragmented backup approaches across AWS services", explanation: "Correct. AWS Backup centralizes policies, schedules, monitoring, and restores across supported services." },
      { label: "Slow network connectivity between Regions", explanation: "Networking services address connectivity; AWS Backup does not improve network performance." },
      { label: "High costs of on-demand compute", explanation: "Savings Plans and Reserved Instances address compute pricing, not AWS Backup." },
      { label: "Complex machine learning model development", explanation: "Machine learning development is not the purpose of AWS Backup." },
    ],
    answer: 0,
    topic: "AWS Backup",
  },
  {
    question: "Which database is designed for friend networks, recommendation engines, and fraud relationship patterns?",
    options: [
      { label: "Amazon Neptune", explanation: "Correct. Neptune is a managed graph database optimized for highly connected data." },
      { label: "Amazon DocumentDB", explanation: "DocumentDB stores flexible JSON-like documents rather than focusing on relationship traversal." },
      { label: "Amazon S3", explanation: "S3 is object storage for files and objects, not a graph database." },
      { label: "Amazon EBS", explanation: "EBS is block storage for EC2, not a database engine." },
    ],
    answer: 0,
    topic: "Neptune",
  },
  {
    question: "A team wants to reduce database administration so developers can focus on product features. Which choice is usually best?",
    options: [
      { label: "A managed database service", explanation: "Correct. Managed services let AWS handle much of provisioning, patching, backups, and infrastructure operations." },
      { label: "A database installed on EC2", explanation: "Self-hosting gives control but leaves more maintenance with the customer." },
      { label: "A larger EC2 instance only", explanation: "More compute does not remove database administration responsibilities." },
      { label: "An object storage bucket", explanation: "Object storage does not replace a transactional database for application queries." },
    ],
    answer: 0,
    topic: "Shared Responsibility",
  },
  {
    question: "Which statement is correct about a database installed directly on Amazon EC2?",
    options: [
      { label: "The customer manages the OS, database, patches, backups, and monitoring", explanation: "Correct. This is an unmanaged database pattern; AWS provides the infrastructure and virtual machine." },
      { label: "AWS automatically optimizes all database queries", explanation: "Query optimization remains the customer's responsibility." },
      { label: "AWS manages every database backup by default", explanation: "The customer must design and configure backups for software installed on EC2." },
      { label: "The database is fully serverless", explanation: "An EC2-hosted database runs on a customer-managed virtual machine." },
    ],
    answer: 0,
    topic: "Shared Responsibility",
  },
];

const memoryMap: Array<{ icon: typeof Database; label: string; text: string }> = [
  { icon: Database, label: "RDS", text: "Tables, SQL, and structured transactions" },
  { icon: Archive, label: "DocumentDB", text: "MongoDB-compatible JSON documents" },
  { icon: GitBranch, label: "Neptune", text: "Relationships, connections, and graph queries" },
  { icon: ShieldCheck, label: "AWS Backup", text: "Centralized backup management across services" },
  { icon: CheckCircle2, label: "Responsibility", text: "AWS manages the cloud; customers manage data and access" },
];

function TopicCard({ topic }: { topic: DatabaseTopic }) {
  return (
    <Card id={topic.id} className="scroll-mt-8 border-white/10 bg-card/70 backdrop-blur-xl">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
            {topic.category}
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Exam concept</span>
        </div>
        <CardTitle className="font-headline text-2xl">{topic.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/90">{topic.definition}</p>
        <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
          <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Why it matters: </span>{topic.why}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Real-world examples</h4>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              {topic.examples.map((example) => <li key={example} className="flex gap-2"><span className="text-primary">•</span><span>{example}</span></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Good for</h4>
            <div className="flex flex-wrap gap-2">
              {topic.goodFor.map((item) => <Badge key={item} variant="secondary" className="bg-secondary/70">{item}</Badge>)}
            </div>
          </div>
        </div>
        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
          <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Memory: </span>{topic.memory}</p>
          <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Exam tip: </span>{topic.examTip}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <Card className="overflow-hidden border-white/10 bg-card/70 backdrop-blur-xl">
      <CardHeader><CardTitle className="font-headline text-2xl">{title}</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-primary/10 text-foreground">
            <tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-t border-white/10"><td className="px-4 py-3 font-semibold">{row[0]}</td>{row.slice(1).map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`} className="px-4 py-3 leading-6 text-muted-foreground">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function DatabaseQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const correct = useMemo(() => databaseQuestions.reduce((score, question, index) => score + (answers[index] === question.answer ? 1 : 0), 0), [answers]);

  return (
    <section className="space-y-5">
      <div>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Practice quiz</Badge>
        <h3 className="mt-3 font-headline text-2xl font-bold">Module 7 Knowledge Check</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Select an answer to see why each option is right or wrong.</p>
      </div>
      {databaseQuestions.map((question, questionIndex) => {
        const selected = answers[questionIndex];
        return (
          <Card key={question.question} className="border-white/10 bg-card/70">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3"><p className="font-semibold leading-6">{questionIndex + 1}. {question.question}</p><Badge variant="secondary" className="shrink-0">{question.topic}</Badge></div>
              <div className="grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = optionIndex === question.answer;
                  return <button key={option.label} type="button" onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))} className={`rounded-lg border p-3 text-left text-sm transition-colors ${isSelected ? (isCorrect ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10") : "border-white/10 bg-background/30 hover:border-primary/30"}`}><span className="mr-2 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>{option.label}{isSelected ? <span className="mt-2 block border-t border-white/10 pt-2 text-xs leading-5 text-muted-foreground">{option.explanation}</span> : null}</button>;
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Card className="border-primary/20 bg-primary/5"><CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><p className="font-semibold">Score: {correct} / {databaseQuestions.length}</p><Button variant="outline" className="rounded-full border-white/10" onClick={() => setAnswers({})}><RefreshCcw className="mr-2 h-4 w-4" />Reset Quiz</Button></CardContent></Card>
    </section>
  );
}

export function Module7Databases() {
  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">AWS Certified Cloud Practitioner</Badge><Badge variant="secondary">Module 7</Badge></div>
          <h2 className="font-headline text-3xl font-bold md:text-4xl">AWS Database Services</h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Learn relational and document databases, graph workloads, centralized backups, and the shared responsibility model through simple explanations, practical scenarios, and exam-ready comparisons.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,820px)] lg:justify-center">
        <aside className="lg:self-start"><Card className="border-white/10 bg-card/80 backdrop-blur-xl"><CardHeader><CardTitle className="text-lg">Database Topics</CardTitle></CardHeader><CardContent className="space-y-2">{databaseTopics.map((topic, index) => <button key={topic.id} type="button" onClick={() => document.getElementById(topic.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-background/40 p-3 text-left text-sm leading-5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className="mt-0.5 text-xs font-semibold">{index + 1}</span><span>{topic.title}</span></button>)}</CardContent></Card></aside>
        <div className="w-full max-w-[820px] space-y-10">
          {databaseTopics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
          <ComparisonTable title="Choose the Right Database Service" columns={["AWS Service", "Database Type", "Best For"]} rows={comparisonRows} />
          <ComparisonTable title="Database Shared Responsibility" columns={["Setup", "AWS manages", "Customer manages"]} rows={responsibilityRows} />
          <Card className="border-success/20 bg-success/10"><CardContent className="space-y-4 p-6"><div className="flex items-center gap-2 text-success"><ShieldCheck className="h-5 w-5" /><h3 className="font-headline text-2xl font-bold">Module 7 Memory Map</h3></div><div className="grid gap-3 md:grid-cols-2">{memoryMap.map(({ icon: MemoryIcon, label, text }) => <div key={label} className="flex gap-3 rounded-lg border border-white/10 bg-background/40 p-4"><MemoryIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" /><div><p className="font-semibold">{label}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}</div></CardContent></Card>
          <DatabaseQuiz />
        </div>
      </div>
    </div>
  );
}
