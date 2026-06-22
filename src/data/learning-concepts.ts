import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Hexagon,
  Network,
  Server,
} from "lucide-react";

export type LearningCategoryId =
  | "javascript"
  | "react"
  | "nextjs"
  | "nodejs"
  | "nestjs"
  | "typescript"
  | "system-design"
  | "aws"
  | "ai-engineering"
  | "agentic-ai"
  | "d365-commerce";

export type LearningConcept = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: LearningCategoryId;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  tags: string[];
  featured: boolean;
  available: boolean;
  content?: {
    subtitle: string;
  };
};

export type LearningCategory = {
  id: LearningCategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const learningCategories: LearningCategory[] = [
  {
    id: "javascript",
    title: "JavaScript",
    description: "Runtime behavior, browser performance, async flow, and language internals.",
    icon: Code2,
  },
  {
    id: "react",
    title: "React",
    description: "Rendering, hooks, composition, state architecture, and product UI patterns.",
    icon: Boxes,
  },
  {
    id: "nextjs",
    title: "Next.js",
    description: "App Router, caching, streaming, server boundaries, and production delivery.",
    icon: Network,
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Runtime internals, APIs, streams, async I/O, services, and production backend patterns.",
    icon: Server,
  },
  {
    id: "nestjs",
    title: "NestJS",
    description: "Modules, providers, controllers, dependency injection, guards, pipes, and scalable APIs.",
    icon: Hexagon,
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Type modeling, narrowing, generics, and safer application contracts.",
    icon: FileCode2,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalability, reliability, data movement, queues, caches, and tradeoffs.",
    icon: Database,
  },
  {
    id: "aws",
    title: "AWS",
    description: "Cloud architecture, compute, storage, networking, serverless, observability, and deployments.",
    icon: Cloud,
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    description: "RAG, evaluations, prompt systems, safety, and production AI workflows.",
    icon: BrainCircuit,
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    description: "Agents, tools, planning loops, memory, observability, and MCP-style systems.",
    icon: Bot,
  },
  {
    id: "d365-commerce",
    title: "D365 Commerce",
    description: "Commerce modules, CRT integrations, payments, checkout, and retail operations.",
    icon: Cpu,
  },
];

export const learningConcepts: LearningConcept[] = [
  {
    id: "js-debounce-throttle",
    slug: "debouncing-vs-throttling",
    title: "Debouncing vs Throttling",
    description:
      "Understand when to delay execution and when to limit execution frequency in modern JavaScript applications.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "8 minutes",
    tags: ["JavaScript", "Performance", "Frontend"],
    featured: true,
    available: true,
    content: {
      subtitle: "Two of the most important JavaScript performance optimization techniques.",
    },
  },
  {
    id: "js-event-loop",
    slug: "event-loop",
    title: "Event Loop",
    description:
      "Visualize how JavaScript schedules callbacks, microtasks, macrotasks, and rendering.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "15 minutes",
    tags: ["JavaScript", "Async", "Runtime"],
    featured: true,
    available: true,
    content: {
      subtitle: "Understand asynchronous JavaScript through interactive visualizations.",
    },
  },
  {
    id: "js-call-stack",
    slug: "call-stack",
    title: "Call Stack",
    description:
      "See how function calls create execution frames and why recursive code can overflow.",
    category: "javascript",
    difficulty: "Beginner",
    readTime: "12 minutes",
    tags: ["JavaScript", "Runtime", "Execution"],
    featured: true,
    available: true,
    content: {
      subtitle: "Understand how JavaScript executes functions one frame at a time.",
    },
  },
  {
    id: "js-closures",
    slug: "closures",
    title: "Closures",
    description:
      "Understand lexical scope, preserved state, callbacks, factories, and closure pitfalls.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "14 minutes",
    tags: ["JavaScript", "Scope", "State"],
    featured: true,
    available: true,
    content: {
      subtitle:
        "Master lexical scope, persistent state, private variables, and one of JavaScript's most powerful concepts.",
    },
  },
  {
    id: "js-hoisting",
    slug: "hoisting",
    title: "Hoisting",
    description:
      "Learn how declarations are prepared before execution and why var, let, const, and functions differ.",
    category: "javascript",
    difficulty: "Beginner",
    readTime: "Coming soon",
    tags: ["JavaScript", "Scope"],
    featured: false,
    available: false,
  },
  {
    id: "js-promises",
    slug: "promises",
    title: "Promises",
    description:
      "Follow promise states, chaining, error paths, and microtask execution from first principles.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "13 minutes",
    tags: ["JavaScript", "Async", "Promises"],
    featured: true,
    available: true,
    content: {
      subtitle:
        "Understand asynchronous programming, promise states, chaining, and error handling.",
    },
  },
  {
    id: "js-async-await",
    slug: "async-await",
    title: "Async Await",
    description:
      "Turn promise chains into readable flows while preserving cancellation and error handling discipline.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "13 minutes",
    tags: ["JavaScript", "Async", "Promises"],
    featured: true,
    available: true,
    content: {
      subtitle:
        "Write asynchronous JavaScript that looks synchronous and is easier to maintain.",
    },
  },
  {
    id: "js-memory-management",
    slug: "memory-management",
    title: "Memory Management",
    description:
      "Explore references, garbage collection, leaks, detached DOM nodes, and performance debugging.",
    category: "javascript",
    difficulty: "Advanced",
    readTime: "16 minutes",
    tags: ["JavaScript", "Performance", "Runtime"],
    featured: true,
    available: true,
    content: {
      subtitle:
        "Understand how JavaScript allocates memory, garbage collection works, and how to prevent memory leaks in production applications.",
    },
  },
  {
    id: "js-execution-context",
    slug: "execution-context",
    title: "Execution Context",
    description:
      "Break down creation and execution phases, scope chains, this binding, and variable environments.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "Coming soon",
    tags: ["JavaScript", "Runtime"],
    featured: false,
    available: false,
  },
  {
    id: "js-prototype-chain",
    slug: "prototype-chain",
    title: "Prototype Chain",
    description:
      "Trace property lookup through prototypes, constructors, classes, and inheritance mechanics.",
    category: "javascript",
    difficulty: "Intermediate",
    readTime: "Coming soon",
    tags: ["JavaScript", "Objects"],
    featured: false,
    available: false,
  },
];

export function getConceptsByCategory(category: LearningCategoryId) {
  return learningConcepts.filter((concept) => concept.category === category);
}

export function getLearningConceptBySlug(slug: string) {
  return learningConcepts.find((concept) => concept.slug === slug);
}
