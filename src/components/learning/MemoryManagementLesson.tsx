"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Boxes,
  Check,
  Clipboard,
  Code2,
  Cpu,
  Database,
  Gauge,
  Layers3,
  MemoryStick,
  PackageCheck,
  Play,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
  Video,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const codeExamples = [
  {
    title: "Stack Example",
    code: `const age = 30;
const active = true;
const name = "Zubair";`,
  },
  {
    title: "Heap Example",
    code: `const user = {
  name: "Zubair",
  role: "Developer",
};`,
  },
  {
    title: "Reference Example",
    code: `const user = { name: "Zubair" };
const admin = user;

admin.name = "Admin";
console.log(user.name); // "Admin"`,
  },
  {
    title: "Garbage Collection Example",
    code: `let user = {
  name: "Zubair",
};

user = null; // object can be collected`,
  },
  {
    title: "Memory Leak Example",
    code: `const cache = [];

setInterval(() => {
  cache.push(new Array(10000));
}, 1000);`,
  },
  {
    title: "React Cleanup Example",
    code: `useEffect(() => {
  const interval = setInterval(() => {}, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);`,
  },
];

const quizQuestions = [
  {
    question: "Where are Objects stored?",
    options: ["Stack Memory", "Heap Memory", "CSSOM", "Microtask Queue"],
    correct: "Heap Memory",
    explanation: "Objects, arrays, and functions are allocated in heap memory and referenced from variables.",
  },
  {
    question: "Where are Primitive Values stored?",
    options: ["Heap Memory only", "Stack Memory", "DOM Tree", "Network Cache"],
    correct: "Stack Memory",
    explanation: "Primitive values and execution contexts are commonly represented in stack memory.",
  },
  {
    question: "What triggers Garbage Collection?",
    options: ["When objects become unreachable.", "Every console.log call.", "Every React render.", "Only when the browser closes."],
    correct: "When objects become unreachable.",
    explanation: "Garbage collectors reclaim memory when values can no longer be reached from active roots.",
  },
  {
    question: "What causes Memory Leaks?",
    options: ["Unused references that remain reachable.", "Using const.", "Returning a primitive.", "Calling JSON.parse."],
    correct: "Unused references that remain reachable.",
    explanation: "A leak happens when memory is no longer needed but still reachable, so GC cannot free it.",
  },
  {
    question: "Can Closures cause Memory Leaks?",
    options: ["Yes, if large objects remain referenced.", "No, closures never retain memory.", "Only in Node.js.", "Only with var."],
    correct: "Yes, if large objects remain referenced.",
    explanation: "Long-lived closures can retain large lexical environments if they keep references alive.",
  },
];

const realWorldExamples = [
  { title: "React Component Memory", icon: Boxes, text: "Clean up intervals, observers, subscriptions, and async work in useEffect cleanup." },
  { title: "Search Autocomplete", icon: Search, text: "Cancel stale requests and release old result references during rapid input." },
  { title: "WebSocket Connections", icon: Wifi, text: "Close sockets on unmount so listeners and buffers do not stay alive." },
  { title: "File Upload", icon: PackageCheck, text: "Release file references, object URLs, and progress listeners after upload completion." },
  { title: "Video Streaming", icon: Video, text: "Destroy unused buffers and media references when users leave playback surfaces." },
];

const commerceExamples = [
  ["Product Listing Page", "Thousands of products require virtualization to avoid rendering and retaining too many nodes."],
  ["Product Recommendation Engine", "Caches need eviction so stale personalized data does not grow forever."],
  ["Shopping Cart", "Remove stale cart items and temporary calculations when sessions change."],
  ["Checkout Session", "Destroy temporary checkout state after order completion or abandonment."],
  ["Order History", "Pagination keeps memory pressure low when users have large purchase histories."],
];

const interviewQuestions = [
  {
    question: "What is Memory Management?",
    answer:
      "Memory management is how JavaScript allocates memory for values, tracks references during execution, and releases unreachable memory through garbage collection.",
  },
  {
    question: "Difference between Stack and Heap?",
    answer:
      "The stack stores primitive values, function calls, and execution context data. The heap stores objects, arrays, and functions, while stack variables often hold references to heap values.",
  },
  {
    question: "How does Garbage Collection work?",
    answer:
      "The garbage collector starts from active roots like global variables and the call stack, marks reachable objects, and frees memory for objects that cannot be reached.",
  },
  {
    question: "What is Mark and Sweep?",
    answer:
      "Mark and Sweep is a GC strategy where reachable objects are marked during traversal, then unmarked unreachable objects are swept and their memory is reclaimed.",
  },
  {
    question: "What causes Memory Leaks?",
    answer:
      "Leaks are caused by references that remain reachable after the app no longer needs them, such as forgotten event listeners, timers, caches, detached DOM nodes, or retained closures.",
  },
  {
    question: "Can Closures cause Memory Leaks?",
    answer:
      "Yes. A closure can keep large arrays, DOM nodes, or service objects alive if the closure itself remains referenced by a listener, timer, cache, or global variable.",
  },
  {
    question: "How do you detect Memory Leaks?",
    answer:
      "Use browser performance tools, heap snapshots, allocation timelines, detached node tracking, and repeated interaction tests to watch memory grow without returning to baseline.",
  },
  {
    question: "How do React applications leak memory?",
    answer:
      "React apps often leak memory through missing useEffect cleanup, subscriptions that stay active, timers, observers, stale async updates, cached data, or object URLs that are never revoked.",
  },
  {
    question: "How does Chrome DevTools help analyze memory?",
    answer:
      "Chrome DevTools provides heap snapshots, allocation instrumentation, performance recordings, detached DOM node inspection, and comparison tools to identify retained objects.",
  },
  {
    question: "What is the difference between Shallow Copy and Deep Copy?",
    answer:
      "A shallow copy copies only the top-level container and keeps nested object references shared. A deep copy creates new nested objects so changes do not affect the original graph.",
  },
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
  icon?: typeof Sparkles;
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

function CodePanel({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

function ConceptOverview() {
  const cards = useMemo(
    () => [
      {
        icon: Zap,
        title: "Memory Allocation",
        text: "Memory is automatically allocated when variables are created, objects are instantiated, and functions are declared.",
        flow: ['let name = "Zubair"', "Memory Allocated"],
      },
      {
        icon: Activity,
        title: "Memory Usage",
        text: "JavaScript uses memory during execution for variables, objects, arrays, functions, and closures.",
        flow: ["Variables", "Objects", "Closures"],
      },
      {
        icon: Trash2,
        title: "Memory Release",
        text: "Unused memory is automatically cleaned by the Garbage Collector when values become unreachable.",
        flow: ["Object", "No References", "Garbage Collector", "Memory Freed"],
      },
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="rounded-lg border border-border/60 bg-card/45 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            <div className="mt-6 space-y-2">
              {item.flow.map((step, stepIndex) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="rounded-lg border border-white/10 bg-background/55 px-3 py-2 font-code text-xs text-muted-foreground">
                    {step}
                  </div>
                  {stepIndex < item.flow.length - 1 ? <ArrowRight className="h-4 w-4 text-primary" /> : null}
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function StackHeapVisualizer() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Runtime Memory"
        icon={Layers3}
        title="Stack vs Heap Visualizer"
        description="Primitive values and function calls live on the stack. Objects, arrays, and functions live in the heap and are reached by references."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Stack Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["age: 30", 'name: "Zubair"', "active: true", "user: ref -> heap"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={cn(
                  "rounded-lg border px-4 py-3 font-code text-sm",
                  item.includes("ref") ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-background/55"
                )}
              >
                {item}
              </motion.div>
            ))}
            <p className="pt-3 text-sm leading-6 text-muted-foreground">
              Stores primitive values, function calls, and execution context data.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Heap Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-lg border border-primary/40 bg-primary/10 p-5"
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Referenced object</p>
              <CodePanel code={`const user = {
  name: "Zubair",
  role: "Developer",
};`} />
            </motion.div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Stores objects, arrays, and functions. The stack keeps the reference arrow to this heap object.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MemoryVisualizer() {
  const [usage, setUsage] = useState(0);
  const [gcCount, setGcCount] = useState(0);
  const risk = usage >= 80 ? "High" : usage >= 50 ? "Medium" : "Low";

  function allocate() {
    setUsage((value) => Math.min(value + 20, 100));
  }

  function release() {
    setUsage((value) => Math.max(value - 30, 0));
    setGcCount((value) => value + 1);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Simulator"
        icon={MemoryStick}
        title="Interactive Memory Visualizer"
        description="Allocate memory with a simulated large users array, then release references and watch garbage collection lower usage."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <CodePanel code={`const users = new Array(1000);`} />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Memory Usage</span>
              <span className="font-code text-sm text-primary">{usage}%</span>
            </div>
            <div className="h-5 overflow-hidden rounded-full border border-white/10 bg-background">
              <motion.div
                animate={{ width: `${usage}%` }}
                transition={{ duration: 0.4 }}
                className={cn("h-full rounded-full", usage >= 80 ? "bg-destructive" : "bg-primary")}
              />
            </div>
            <div className="mt-3 grid grid-cols-6 text-center font-code text-[10px] text-muted-foreground">
              {[0, 20, 40, 60, 80, 100].map((item) => <span key={item}>{item}%</span>)}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="Garbage Collections" value={gcCount} />
            <Metric label="Objects Created" value={usage / 20 * 1000} />
            <Metric label="Memory Leak Risk" value={risk} danger={risk === "High"} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={allocate} className="rounded-full">
              <Play className="mr-2 h-4 w-4" />
              Allocate Memory
            </Button>
            <Button onClick={release} variant="outline" className="rounded-full border-white/10">
              <Trash2 className="mr-2 h-4 w-4" />
              Release Memory
            </Button>
            <Button
              onClick={() => {
                setUsage(0);
                setGcCount(0);
              }}
              variant="outline"
              className="rounded-full border-white/10"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Metric({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("mt-2 text-3xl font-headline font-bold text-primary", danger && "text-red-200")}
      >
        {value}
      </motion.p>
    </div>
  );
}

function ReferenceVisualizer() {
  const [name, setName] = useState("Zubair");

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Shared References"
        icon={ArrowRight}
        title="Reference Visualizer"
        description="Objects are assigned by reference. user and admin can point to the same heap object."
      />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <CodePanel code={`const user = { name: "Zubair" };
const admin = user;

admin.name = "Admin";`} />
            <Button onClick={() => setName("Admin")} className="rounded-full">
              Run admin.name = "Admin"
            </Button>
            <Button onClick={() => setName("Zubair")} variant="outline" className="rounded-full border-white/10">
              Reset Reference
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="space-y-3">
                {["user", "admin"].map((label) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4 font-code text-sm">
                    {label} ref
                  </div>
                ))}
              </div>
              <ArrowRight className="mx-auto h-8 w-8 text-primary" />
              <motion.div
                key={name}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-lg border border-primary/40 bg-primary/10 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Heap Object</p>
                <p className="mt-3 font-code text-lg text-primary">{`{ name: "${name}" }`}</p>
              </motion.div>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Because both variables reference the same object, changing admin.name changes what user.name sees too.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function GarbageCollectionVisualizer() {
  const [active, setActive] = useState(0);
  const reachable = ["Object Created", "Reachable", "Referenced", "Active"];
  const unreachable = ["Object Unreachable", "Marked", "Swept", "Deleted"];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 4), 1200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Mark and Sweep"
        icon={Trash2}
        title="Garbage Collection Visualizer"
        description="Reachable objects stay active. Unreachable objects are marked, swept, and deleted."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <GcFlow title="Reachable Path" steps={reachable} active={active} tone="primary" />
        <GcFlow title="Unreachable Path" steps={unreachable} active={active} tone="danger" />
      </div>
    </section>
  );
}

function GcFlow({ title, steps, active, tone }: { title: string; steps: string[]; active: number; tone: "primary" | "danger" }) {
  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div key={step}>
            <motion.div
              animate={{ scale: active === index ? 1.02 : 1 }}
              className={cn(
                "rounded-lg border px-4 py-3 text-center font-code text-sm",
                active === index && tone === "primary" && "border-primary/50 bg-primary/10 text-primary",
                active === index && tone === "danger" && "border-destructive/50 bg-destructive/10 text-red-200",
                active !== index && "border-white/10 bg-background/50 text-muted-foreground"
              )}
            >
              {step}
            </motion.div>
            {index < steps.length - 1 ? <ArrowDown className="mx-auto my-2 h-4 w-4 text-primary" /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LeakDetector() {
  const leaks = [
    ["Event Listener Leak", "window.addEventListener(...)", "Component removed, listener still exists."],
    ["Detached DOM Node", "DOM removed", "Reference still stored in JavaScript."],
    ["Large Array", "const hugeData = []", "Push 100000 records and never clear."],
    ["Closure Leak", "return function() { return hugeArray.length }", "Array remains in memory through closure."],
  ];
  const [active, setActive] = useState(0);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Leak Detector"
        icon={AlertTriangle}
        title="Memory Leak Detector"
        description="Explore common production leaks and why garbage collection cannot reclaim reachable values."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-2 p-6">
            {leaks.map(([title], index) => (
              <Button
                key={title}
                onClick={() => setActive(index)}
                variant={active === index ? "default" : "outline"}
                className="h-auto justify-start rounded-lg border-white/10 px-4 py-3"
              >
                {title}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Detected leak</p>
              <h3 className="mt-2 text-2xl font-headline font-bold text-red-200">{leaks[active][0]}</h3>
              <p className="mt-3 font-code text-sm text-red-100">{leaks[active][1]}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/50 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Why it leaks</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{leaks[active][2]}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Timeline() {
  const steps = ["Create Object", "Use Object", "Reference Removed", "GC Scheduled", "Memory Freed"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Memory Timeline"
        icon={Activity}
        title="Object Memory Timeline"
        description="Most memory stories follow a lifecycle from allocation to use to eventual release."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="grid gap-4 p-6 md:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-white/10 bg-background/50 p-4 text-center"
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-code text-xs text-primary">
                {index + 1}
              </div>
              <p className="font-code text-xs text-muted-foreground">{step}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function PerformanceMonitor() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1400);
    return () => window.clearInterval(timer);
  }, []);

  const heap = 42 + (tick % 4) * 9;
  const objectsCreated = 1800 + tick * 120;
  const objectsDeleted = 900 + tick * 75;
  const risk = heap > 65 ? "Medium" : "Low";

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Performance Monitor"
        icon={Gauge}
        title="Interactive Memory Dashboard"
        description="Monitor heap usage, object churn, garbage collections, and leak risk like a production debugging surface."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="grid gap-3 p-6 md:grid-cols-3 lg:grid-cols-6">
          <Metric label="Current Memory" value={`${heap} MB`} />
          <Metric label="Heap Usage" value={`${heap}%`} danger={heap > 65} />
          <Metric label="Garbage Collections" value={Math.floor(tick / 2) + 3} />
          <Metric label="Objects Created" value={objectsCreated} />
          <Metric label="Objects Deleted" value={objectsDeleted} />
          <Metric label="Memory Leak Risk" value={risk} danger={risk !== "Low"} />
        </CardContent>
      </Card>
    </section>
  );
}

function ExamplesSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Production Patterns"
        icon={Sparkles}
        title="Real World Memory Examples"
        description="Production memory issues often come from long-lived UI surfaces, active connections, retained files, and oversized caches."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {realWorldExamples.map((example, index) => {
          const Icon = example.icon;
          return (
            <motion.article
              key={example.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{example.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{example.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function CommerceExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Enterprise eCommerce"
        icon={ShoppingCart}
        title="Commerce Memory Examples"
        description="Commerce experiences must manage large product lists, cached data, checkout state, and long-running user sessions carefully."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {commerceExamples.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Quiz"
        icon={Check}
        title="Check Your Memory Model"
        description="Test stack, heap, references, garbage collection, leaks, and closure retention."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map((quiz, index) => {
          const selected = answers[index];
          return (
            <Card key={quiz.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{quiz.question}</h3>
                <div className="mt-5 grid gap-2">
                  {quiz.options.map((option) => {
                    const chosen = selected === option;
                    const correct = option === quiz.correct;
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                        className={cn(
                          "h-auto justify-start whitespace-normal rounded-lg border-white/10 px-4 py-3 text-left",
                          chosen && correct && "border-primary/50 bg-primary/10 text-primary",
                          chosen && !correct && "border-destructive/50 bg-destructive/10 text-red-100"
                        )}
                      >
                        {chosen ? correct ? <Check className="mr-2 h-4 w-4 shrink-0" /> : <X className="mr-2 h-4 w-4 shrink-0" /> : null}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {selected ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{quiz.explanation}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function CopyCodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 border-white/10">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <CodePanel code={code} />
      </CardContent>
    </Card>
  );
}

function CodeExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Code Examples"
        icon={Code2}
        title="Copy-ready Memory Examples"
        description="Practice stack values, heap objects, references, garbage collection, leaks, and React cleanup."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {codeExamples.map((example) => (
          <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
        ))}
      </div>
    </section>
  );
}

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Common Interview Questions"
        title="Memory Management Interview Prep"
        description="Detailed answers for runtime memory, GC, leaks, React cleanup, DevTools, and object copying."
      />
      <div className="grid gap-4">
        {interviewQuestions.map((item, index) => (
          <Card key={item.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  Q{index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function MemoryManagementLesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Cpu className="mr-2 h-3.5 w-3.5" />
            JavaScript Runtime
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            Memory <span className="gradient-text">Management</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript allocates memory, garbage collection works, and how to prevent memory leaks in production applications.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Learn how JavaScript allocates, tracks, and frees memory behind the scenes to build faster and more reliable applications.
          </p>
        </motion.div>
      </section>

      <ConceptOverview />

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="memory" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-5">
            <TabsTrigger value="memory" className="rounded-md">Memory</TabsTrigger>
            <TabsTrigger value="references" className="rounded-md">References</TabsTrigger>
            <TabsTrigger value="gc" className="rounded-md">GC</TabsTrigger>
            <TabsTrigger value="leaks" className="rounded-md">Leaks</TabsTrigger>
            <TabsTrigger value="code" className="rounded-md">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="memory" className="space-y-10">
            <StackHeapVisualizer />
            <MemoryVisualizer />
            <PerformanceMonitor />
          </TabsContent>
          <TabsContent value="references">
            <ReferenceVisualizer />
          </TabsContent>
          <TabsContent value="gc" className="space-y-10">
            <GarbageCollectionVisualizer />
            <Timeline />
          </TabsContent>
          <TabsContent value="leaks">
            <LeakDetector />
          </TabsContent>
          <TabsContent value="code">
            <CodeExamples />
          </TabsContent>
        </Tabs>
      </section>

      <ExamplesSection />
      <CommerceExamples />
      <Quiz />
      <InterviewQuestions />
    </div>
  );
}
