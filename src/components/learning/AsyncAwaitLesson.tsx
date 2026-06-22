"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  CreditCard,
  Database,
  Loader2,
  PackageCheck,
  Play,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Timer,
  UserCheck,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type RuntimeStep = {
  label: string;
  line: number;
  stack: string[];
  microtasks: string[];
  console: string[];
  explanation: string;
};

const simulatorCode = `async function getData() {
  console.log("Start");

  await fetchProducts();

  console.log("End");
}

getData();`;

const runtimeSteps: RuntimeStep[] = [
  {
    label: "Call async function",
    line: 9,
    stack: ["main()", "getData()"],
    microtasks: [],
    console: [],
    explanation: "getData() enters the call stack like any other function and starts executing synchronously.",
  },
  {
    label: "Log Start",
    line: 2,
    stack: ["main()", "getData()"],
    microtasks: [],
    console: ["Start"],
    explanation: "Code before the first await runs immediately on the current call stack.",
  },
  {
    label: "Hit await",
    line: 4,
    stack: ["main()"],
    microtasks: ["resume getData()"],
    console: ["Start"],
    explanation: "await pauses getData(), returns control to the caller, and schedules continuation after the Promise resolves.",
  },
  {
    label: "Promise resolves",
    line: 4,
    stack: [],
    microtasks: ["resume getData()"],
    console: ["Start"],
    explanation: "The async operation has completed. The continuation waits in the Microtask Queue.",
  },
  {
    label: "Microtask resumes",
    line: 6,
    stack: ["getData()"],
    microtasks: [],
    console: ["Start"],
    explanation: "The Event Loop picks the microtask, pushing getData() back so execution can continue after await.",
  },
  {
    label: "Log End",
    line: 6,
    stack: ["getData()"],
    microtasks: [],
    console: ["Start", "End"],
    explanation: "The code after await now runs, making async code read top-to-bottom while still being non-blocking.",
  },
  {
    label: "Complete",
    line: 7,
    stack: [],
    microtasks: [],
    console: ["Start", "End"],
    explanation: "getData() completes and its returned Promise resolves.",
  },
];

const codeExamples = [
  {
    title: "Basic Async Await",
    code: `async function loadProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();
  return products;
}`,
  },
  {
    title: "Error Handling",
    code: `async function loadProducts() {
  try {
    const products = await fetchProducts();
    renderProducts(products);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoadingState();
  }
}`,
  },
  {
    title: "Parallel Execution",
    code: `async function loadDashboard() {
  const userPromise = fetchUser();
  const ordersPromise = fetchOrders();
  const recommendationsPromise = fetchRecommendations();

  const user = await userPromise;
  const orders = await ordersPromise;
  const recommendations = await recommendationsPromise;

  return { user, orders, recommendations };
}`,
  },
  {
    title: "Promise.all + Async Await",
    code: `async function loadPDP() {
  const [product, inventory, reviews] = await Promise.all([
    fetchProduct(),
    fetchInventory(),
    fetchReviews(),
  ]);

  return { product, inventory, reviews };
}`,
  },
  {
    title: "Advanced Patterns",
    code: `async function withRetry(operation, retries = 2) {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    await wait(300);
    return withRetry(operation, retries - 1);
  }
}`,
  },
];

const realWorldExamples = [
  { title: "Login", icon: UserCheck, text: "Validate credentials, fetch profile data, and redirect after authentication succeeds." },
  { title: "Search", icon: Search, text: "Await product results and update loading, empty, success, or error states clearly." },
  { title: "Checkout", icon: ShoppingCart, text: "Coordinate address validation, tax, shipping, payment, and order placement." },
  { title: "Inventory Lookup", icon: Database, text: "Load stock data before enabling add-to-cart or pickup choices." },
  { title: "Payment Processing", icon: CreditCard, text: "Use try/catch around authorization to display recoverable payment errors." },
];

const ecommerceExamples = [
  ["Load PDP Data", "Fetch product, inventory, reviews, recommendations, and pricing in a predictable async flow."],
  ["Validate Inventory", "Await availability before checkout moves forward."],
  ["Place Order", "Submit checkout data and handle success or rejection from the order service."],
  ["Fetch Recommendations", "Load personalized recommendations after user and product context are ready."],
  ["Checkout Submission", "Combine validation, payment authorization, and confirmation with explicit error paths."],
];

const interviewQuestions = [
  {
    question: "What is Async/Await?",
    answer:
      "Async/await is syntax built on top of Promises. async functions always return a Promise, and await pauses the function until a Promise settles, making asynchronous code easier to read.",
  },
  {
    question: "How does Await work?",
    answer:
      "await pauses the current async function, lets the call stack continue, and resumes the function later through the microtask queue when the awaited Promise settles.",
  },
  {
    question: "Difference between Promises and Async/Await?",
    answer:
      "Promises are the underlying abstraction for async results. Async/await is syntax that makes Promise chains look like sequential code while preserving Promise behavior.",
  },
  {
    question: "Can Async/Await block the Event Loop?",
    answer:
      "await itself does not block the event loop. It pauses only the async function. Heavy synchronous work before or after await can still block the event loop.",
  },
  {
    question: "When should Promise.all be used?",
    answer:
      "Use Promise.all when independent async operations can run in parallel and the next step needs all of their results. It is usually faster than awaiting each request one by one.",
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

function CodePanel({ code, activeLine }: { code: string; activeLine?: number }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      {code.split("\n").map((line, index) => {
        const lineNumber = index + 1;
        return (
          <div
            key={`${lineNumber}-${line}`}
            className={cn(
              "-mx-2 grid grid-cols-[2rem_1fr] rounded px-2",
              lineNumber === activeLine && "bg-primary/15 text-foreground"
            )}
          >
            <span className="select-none text-muted-foreground/70">{lineNumber}</span>
            <code>{line || " "}</code>
          </div>
        );
      })}
    </pre>
  );
}

function ConceptOverview() {
  const cards = useMemo(
    () => [
      {
        icon: Zap,
        title: "Async Function",
        text: "An async function always returns a Promise and lets you use await inside its body.",
      },
      {
        icon: Timer,
        title: "Await Keyword",
        text: "await pauses the async function until a Promise settles, then resumes from the next line.",
      },
      {
        icon: ShieldCheck,
        title: "Error Handling",
        text: "try/catch turns async failures into readable control flow for success, failure, and cleanup states.",
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
            <div className="mt-6 rounded-lg border border-white/10 bg-background/50 p-4 font-code text-xs text-muted-foreground">
              {index === 0 ? "async function task() {}" : index === 1 ? "await fetchProducts()" : "try { await task() } catch {}"}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function RuntimeBox({ title, items, active }: { title: string; items: string[]; active?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-4", active ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/50")}>
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="space-y-2">
        {items.length ? (
          items.map((item) => (
            <motion.div
              key={item}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-white/10 bg-card/55 px-3 py-2 font-code text-xs"
            >
              {item}
            </motion.div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-5 text-center text-sm text-muted-foreground">
            Empty
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutionSimulator() {
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const step = runtimeSteps[stepIndex];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= runtimeSteps.length - 1) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Runtime Visualizer"
        icon={Workflow}
        title="Visual Execution Simulator"
        description="Watch await pause the async function, resume through the Microtask Queue, and keep the Event Loop free."
      />
      <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="border-b border-white/10 bg-background/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setRunning(true)} disabled={running || stepIndex === runtimeSteps.length - 1} className="rounded-full">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
              <Button
                variant="outline"
                onClick={() => setStepIndex((value) => Math.min(value + 1, runtimeSteps.length - 1))}
                className="rounded-full border-white/10"
              >
                Next Step
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRunning(false);
                  setStepIndex(0);
                }}
                className="rounded-full border-white/10"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Badge variant="outline" className="ml-auto border-primary/20 bg-primary/5 text-primary">
                Step {stepIndex + 1} of {runtimeSteps.length}
              </Badge>
            </div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
            <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
              <CodePanel code={simulatorCode} activeLine={step.line} />
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <RuntimeBox title="Call Stack" items={step.stack} active={step.stack.length > 0} />
                <RuntimeBox title="Microtask Queue" items={step.microtasks} active={step.microtasks.length > 0} />
                <RuntimeBox title="Event Loop" items={["checks stack", "runs microtasks"]} active={step.microtasks.length > 0 && step.stack.length === 0} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Console Output</p>
                  <div className="mt-3 min-h-16 font-code text-sm text-primary">
                    {step.console.length ? step.console.map((item) => <p key={item}>{item}</p>) : <span className="text-muted-foreground">No output yet</span>}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Current Explanation</p>
                  <h4 className="mt-2 font-semibold">{step.label}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SequentialParallelDemo() {
  const [mode, setMode] = useState<"sequential" | "parallel">("sequential");
  const steps = ["fetchUser()", "fetchOrders()", "fetchRecommendations()"];
  const totalTime = mode === "sequential" ? "1,800ms" : "650ms";

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Execution Timing"
        icon={Timer}
        title="Sequential vs Parallel Demo"
        description="Sequential awaits wait one by one. Promise.all starts independent work together and awaits the combined result."
      />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setMode("sequential")} variant={mode === "sequential" ? "default" : "outline"} className="rounded-full border-white/10">
                Sequential
              </Button>
              <Button onClick={() => setMode("parallel")} variant={mode === "parallel" ? "default" : "outline"} className="rounded-full border-white/10">
                Parallel
              </Button>
            </div>
            <CodePanel
              code={
                mode === "sequential"
                  ? `await fetchUser();
await fetchOrders();
await fetchRecommendations();`
                  : `await Promise.all([
  fetchUser(),
  fetchOrders(),
  fetchRecommendations(),
]);`
              }
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-white/10 bg-background/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-code text-sm">{step}</span>
                    <span className="text-xs text-muted-foreground">{mode === "sequential" ? `${(index + 1) * 600}ms` : "starts now"}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                    <motion.div
                      key={`${mode}-${step}`}
                      initial={{ width: "0%" }}
                      whileInView={{ width: mode === "sequential" ? `${35 + index * 20}%` : `${85 - index * 12}%` }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, delay: mode === "sequential" ? index * 0.22 : 0 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Approximate total time</p>
              <p className="mt-2 text-4xl font-headline font-bold text-primary">{totalTime}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ErrorHandlingVisualizer() {
  const [path, setPath] = useState<"success" | "failure">("success");
  const flow = path === "success" ? ["try", "await fetchProducts()", "render products"] : ["try", "await fetchProducts()", "catch(error)", "console.log(error)"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Failure Recovery"
        icon={ShieldCheck}
        title="Error Handling Visualizer"
        description="try/catch gives async code an explicit success path and failure path."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPath("success")} variant={path === "success" ? "default" : "outline"} className="rounded-full border-white/10">
              Success Path
            </Button>
            <Button onClick={() => setPath("failure")} variant={path === "failure" ? "default" : "outline"} className="rounded-full border-white/10">
              Failure Path
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {flow.map((item, index) => (
              <motion.div
                key={`${path}-${item}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  "rounded-lg border p-5 text-center font-code text-sm",
                  item.includes("catch") || item.includes("error")
                    ? "border-destructive/45 bg-destructive/10 text-red-200"
                    : "border-primary/35 bg-primary/10 text-primary"
                )}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <CodePanel
            code={`try {
  await fetchProducts();
} catch (error) {
  console.log(error);
}`}
          />
        </CardContent>
      </Card>
    </section>
  );
}

function LoadingStateDemo() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  function loadProducts(next: "success" | "error") {
    setState("loading");
    window.setTimeout(() => setState(next), 850);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="UI State"
        icon={PackageCheck}
        title="Loading State Demo"
        description="Async/await makes loading, success, error, and retry states easier to model in UI code."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-background/50 p-6 text-center">
              {state === "loading" ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" /> : null}
              {state === "success" ? <Check className="mx-auto h-10 w-10 text-primary" /> : null}
              {state === "error" ? <AlertCircle className="mx-auto h-10 w-10 text-red-200" /> : null}
              {state === "idle" ? <PackageCheck className="mx-auto h-10 w-10 text-muted-foreground" /> : null}
              <p className="mt-4 text-xl font-semibold capitalize">{state}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {state === "idle" && "Ready to load product data."}
                {state === "loading" && "Awaiting fetchProducts()."}
                {state === "success" && "Products loaded successfully."}
                {state === "error" && "Request failed. The user can retry."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => loadProducts("success")} disabled={state === "loading"} className="rounded-full">
                Load Products
              </Button>
              <Button onClick={() => loadProducts("error")} disabled={state === "loading"} variant="outline" className="rounded-full border-white/10">
                Simulate Error
              </Button>
              <Button onClick={() => setState("idle")} variant="outline" className="rounded-full border-white/10">
                Retry
              </Button>
            </div>
          </div>
          <CodePanel
            code={`async function loadProducts() {
  setStatus("loading");

  try {
    const products = await fetchProducts();
    setProducts(products);
    setStatus("success");
  } catch {
    setStatus("error");
  }
}`}
          />
        </CardContent>
      </Card>
    </section>
  );
}

function ExampleCards() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Applications"
        icon={Sparkles}
        title="Real World Async/Await Patterns"
        description="Readable asynchronous control flow is especially useful in product, checkout, auth, and data-heavy interfaces."
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

function EcommerceExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Enterprise eCommerce"
        icon={ShoppingCart}
        title="Commerce Async/Await Examples"
        description="Async/await gives checkout and product flows clear success, failure, and cleanup points."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {ecommerceExamples.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
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

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Common Interview Questions"
        title="Async/Await Interview Prep"
        description="Detailed answers for async functions, await behavior, promises, event loop behavior, and parallel execution."
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

export function AsyncAwaitLesson() {
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
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Modern JavaScript
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            Async / <span className="gradient-text">Await</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Write asynchronous JavaScript that looks synchronous and is easier to maintain.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Master readable asynchronous programming and understand what happens behind the scenes.
          </p>
        </motion.div>
      </section>

      <ConceptOverview />

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="runtime" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4">
            <TabsTrigger value="runtime" className="rounded-md">Runtime</TabsTrigger>
            <TabsTrigger value="patterns" className="rounded-md">Patterns</TabsTrigger>
            <TabsTrigger value="loading" className="rounded-md">Loading UI</TabsTrigger>
            <TabsTrigger value="code" className="rounded-md">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="runtime">
            <ExecutionSimulator />
          </TabsContent>
          <TabsContent value="patterns" className="space-y-10">
            <SequentialParallelDemo />
            <ErrorHandlingVisualizer />
          </TabsContent>
          <TabsContent value="loading">
            <LoadingStateDemo />
          </TabsContent>
          <TabsContent value="code">
            <section className="container mx-auto px-4 py-10">
              <SectionHeader
                badge="Code Examples"
                icon={Code2}
                title="Copy-ready Async/Await Examples"
                description="Practice basic async functions, error handling, parallel execution, Promise.all, and retry patterns."
              />
              <div className="grid gap-6 lg:grid-cols-2">
                {codeExamples.map((example) => (
                  <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>

      <ExampleCards />
      <EcommerceExamples />
      <InterviewQuestions />
    </div>
  );
}
