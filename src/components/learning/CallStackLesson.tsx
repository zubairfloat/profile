"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  ServerCog,
  SkipBack,
  SkipForward,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StackStep = {
  label: string;
  line: number;
  stack: string[];
  console: string[];
  explanation: string;
  phase: "push" | "execute" | "pop";
};

const simulatorCode = `function third() {
  console.log("Third");
}

function second() {
  third();
}

function first() {
  second();
}

first();`;

const simulatorSteps: StackStep[] = [
  {
    label: "Program starts",
    line: 12,
    stack: ["main()"],
    console: [],
    explanation: "JavaScript creates the global execution context. In this lesson we label it main().",
    phase: "push",
  },
  {
    label: "first() is called",
    line: 12,
    stack: ["main()", "first()"],
    console: [],
    explanation: "Calling first() pushes a new stack frame above main(). first() is now the active function.",
    phase: "push",
  },
  {
    label: "second() is called",
    line: 9,
    stack: ["main()", "first()", "second()"],
    console: [],
    explanation: "first() pauses at its current line while second() gets its own execution context.",
    phase: "push",
  },
  {
    label: "third() is called",
    line: 5,
    stack: ["main()", "first()", "second()", "third()"],
    console: [],
    explanation: "second() calls third(), so third() becomes the top frame and runs next.",
    phase: "push",
  },
  {
    label: "Console output",
    line: 2,
    stack: ["main()", "first()", "second()", "third()"],
    console: ['"Third"'],
    explanation: "The active frame executes console.log. The stack has not popped yet because third() is still finishing.",
    phase: "execute",
  },
  {
    label: "third() returns",
    line: 3,
    stack: ["main()", "first()", "second()"],
    console: ['"Third"'],
    explanation: "third() completes, so its stack frame is removed. Control returns to second().",
    phase: "pop",
  },
  {
    label: "second() returns",
    line: 6,
    stack: ["main()", "first()"],
    console: ['"Third"'],
    explanation: "second() has no more work. Its frame pops and JavaScript resumes first().",
    phase: "pop",
  },
  {
    label: "first() returns",
    line: 10,
    stack: ["main()"],
    console: ['"Third"'],
    explanation: "first() completes, leaving only the global frame.",
    phase: "pop",
  },
  {
    label: "Program ends",
    line: 12,
    stack: [],
    console: ['"Third"'],
    explanation: "The global script is done. The call stack is empty and JavaScript can move on to queued work.",
    phase: "pop",
  },
];

const playgroundExamples = [
  {
    title: "Nested Function Calls",
    code: `function login() {
  loadProfile();
}

function loadProfile() {
  loadOrders();
}

function loadOrders() {
  console.log("Orders Loaded");
}

login();`,
    stack: ["main()", "login()", "loadProfile()", "loadOrders()"],
    output: '"Orders Loaded"',
    note: "Each nested call waits for the deeper function to finish before it can return.",
  },
  {
    title: "Simple Execution",
    code: `function greet() {
  console.log("Hello");
}

greet();`,
    stack: ["main()", "greet()"],
    output: '"Hello"',
    note: "A single function call creates one frame, executes, and immediately pops.",
  },
  {
    title: "Recursion",
    code: `function count(n) {
  if (n === 0) return;
  count(n - 1);
}

count(5);`,
    stack: ["main()", "count(5)", "count(4)", "count(3)", "count(2)", "count(1)", "count(0)"],
    output: "base case reached",
    note: "Recursive calls keep adding frames until the base case starts the return chain.",
  },
];

const codeExamples = [
  {
    title: "Basic Example",
    code: `function greet() {
  console.log("Hello");
}

greet();`,
  },
  {
    title: "Nested Calls",
    code: `function first() {
  second();
}

function second() {
  third();
}

function third() {
  console.log("Done");
}

first();`,
  },
  {
    title: "Recursion Example",
    code: `function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5);`,
  },
];

const interviewQuestions = [
  {
    question: "What is the Call Stack?",
    answer:
      "The Call Stack is the runtime structure JavaScript uses to track active function calls. The function at the top is executing right now, and lower frames are waiting for control to return.",
  },
  {
    question: "What is a Stack Frame?",
    answer:
      "A Stack Frame is the execution context created for a function call. It contains the function's local variables, parameters, return position, and the information needed to resume the caller.",
  },
  {
    question: "Why is JavaScript single threaded?",
    answer:
      "The JavaScript execution thread runs one stack frame at a time. Browsers and Node.js can delegate async work elsewhere, but JavaScript code itself returns to the call stack before the next callback runs.",
  },
  {
    question: "What causes Stack Overflow?",
    answer:
      "Stack overflow happens when too many frames are pushed without returning. Infinite recursion and recursion with a missing or unreachable base case are common causes.",
  },
  {
    question: "How does recursion affect the Call Stack?",
    answer:
      "Every recursive call adds another frame. When the base case is reached, frames pop in reverse order, which is why recursive results unwind from the deepest call back to the first call.",
  },
  {
    question: "Explain LIFO in JavaScript.",
    answer:
      "LIFO means Last In, First Out. The most recently called function sits at the top of the stack and must finish before the caller beneath it can continue.",
  },
];

const realWorldExamples: { title: string; frames: string[] }[] = [
  { title: "Login Flow", frames: ["login()", "validateUser()", "fetchProfile()", "renderDashboard()"] },
  { title: "Add To Cart", frames: ["addToCart()", "validateInventory()", "calculatePrice()", "updateCart()"] },
  { title: "Checkout Flow", frames: ["placeOrder()", "validatePayment()", "createOrder()", "sendConfirmation()"] },
  { title: "Search Flow", frames: ["search()", "fetchProducts()", "renderResults()"] },
];

const commerceExamples: { title: string; frames: string[] }[] = [
  { title: "Mattress Firm Product Page", frames: ["loadPDP()", "fetchProduct()", "fetchInventory()", "renderPDP()"] },
  { title: "Checkout Validation", frames: ["submitOrder()", "validateAddress()", "validatePayment()", "createOrder()"] },
  { title: "Order Confirmation", frames: ["getOrder()", "fetchOrderDetails()", "renderConfirmation()"] },
];

const quizQuestions = [
  {
    question: "What data structure does the Call Stack use?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correct: "Stack",
    explanation: "The call stack uses LIFO behavior: the newest function call exits first.",
  },
  {
    question: "What happens when a function is called?",
    options: ["A callback queue is cleared.", "A new Stack Frame is pushed onto the Call Stack.", "The browser paints immediately.", "All variables are deleted."],
    correct: "A new Stack Frame is pushed onto the Call Stack.",
    explanation: "Each function call receives its own execution context at the top of the stack.",
  },
  {
    question: "What causes a Stack Overflow?",
    options: ["Too many nested function calls or infinite recursion.", "A resolved Promise.", "A finished console.log.", "A normal return statement."],
    correct: "Too many nested function calls or infinite recursion.",
    explanation: "If frames keep piling up without returning, the runtime reaches its stack limit.",
  },
  {
    question: "Which function exits first?",
    options: ["main()", "first()", "second()", "They exit together."],
    correct: "second()",
    explanation: "With main() -> first() -> second(), second() is last in and first out.",
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
  icon?: typeof Layers3;
}) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        {Icon ? <Icon className="mr-2 h-3.5 w-3.5" /> : null}
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function StackFrame({ name, index, active, danger }: { name: string; index: number; active?: boolean; danger?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn(
        "relative rounded-lg border px-4 py-3 font-code text-sm shadow-lg",
        danger
          ? "border-destructive/60 bg-destructive/15 text-red-100 shadow-destructive/10"
          : active
            ? "border-primary/60 bg-primary/20 text-primary shadow-primary/10"
            : "border-white/10 bg-background/65 text-foreground"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{name}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">#{index + 1}</span>
      </div>
    </motion.div>
  );
}

function StackVisualizer({ frames, danger = false, height = "min-h-[290px]" }: { frames: string[]; danger?: boolean; height?: string }) {
  return (
    <div className={cn("flex flex-col justify-end gap-2 rounded-lg border border-white/10 bg-background/55 p-4", height)}>
      <AnimatePresence initial={false}>
        {[...frames].map((frame, index) => {
          const originalIndex = frames.length - 1 - index;
          return (
            <StackFrame
              key={`${frame}-${originalIndex}`}
              name={frame}
              index={originalIndex}
              active={originalIndex === frames.length - 1}
              danger={danger && originalIndex > 4}
            />
          );
        }).reverse()}
      </AnimatePresence>
      {frames.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-muted-foreground">
          Empty call stack
        </div>
      ) : null}
      <div className="mt-3 border-t border-white/10 pt-3 text-center font-code text-[11px] uppercase tracking-widest text-muted-foreground">
        Stack bottom
      </div>
    </div>
  );
}

function CodePanel({ code, activeLine }: { code: string; activeLine?: number }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      {code.split("\n").map((line, index) => {
        const lineNumber = index + 1;
        const active = lineNumber === activeLine;
        return (
          <div
            key={`${lineNumber}-${line}`}
            className={cn(
              "-mx-2 grid grid-cols-[2rem_1fr] rounded px-2",
              active && "bg-primary/15 text-foreground"
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
  const overview = useMemo(
    () => [
      {
        icon: Layers3,
        title: "What is the Call Stack?",
        text: "The Call Stack is a LIFO data structure used by JavaScript to track currently executing functions.",
        visual: ["main()", "getUser()", "fetchOrders()"],
      },
      {
        icon: ServerCog,
        title: "Stack Frames",
        text: "Every function call creates a new execution context called a Stack Frame.",
        visual: ["main()", "getUser()", "fetchOrders()"],
      },
      {
        icon: Workflow,
        title: "Why It Matters",
        text: "The Call Stack tells JavaScript which function is running, which function should execute next, and where execution should return.",
        visual: ["running", "return path", "next frame"],
      },
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {overview.map((item, cardIndex) => (
          <Card key={item.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-headline font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              <div className="mt-6 space-y-2">
                {item.visual.map((frame, index) => (
                  <motion.div
                    key={frame}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: cardIndex * 0.08 + index * 0.06 }}
                    className={cn(
                      "rounded-lg border border-white/10 bg-background/55 px-4 py-3 font-code text-sm",
                      index === item.visual.length - 1 && "border-primary/40 bg-primary/10 text-primary"
                    )}
                  >
                    {frame}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CallStackSimulator() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = simulatorSteps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / simulatorSteps.length) * 100);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStepIndex((current) => {
        if (current >= simulatorSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1300);

    return () => clearInterval(timer);
  }, [isPlaying]);

  function reset() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Runtime Visualizer"
        icon={Terminal}
        title="Interactive Call Stack Visualizer"
        description="Step through function calls as frames are pushed, executed, and popped from the stack."
      />
      <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="border-b border-white/10 bg-background/40 p-4">
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-background">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setIsPlaying(true)} disabled={isPlaying || stepIndex === simulatorSteps.length - 1} className="rounded-full">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
              <Button variant="outline" onClick={() => setIsPlaying(false)} disabled={!isPlaying} className="rounded-full border-white/10">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button
                variant="outline"
                onClick={() => setStepIndex((value) => Math.min(value + 1, simulatorSteps.length - 1))}
                className="rounded-full border-white/10"
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Next Step
              </Button>
              <Button
                variant="outline"
                onClick={() => setStepIndex((value) => Math.max(value - 1, 0))}
                className="rounded-full border-white/10"
              >
                <SkipBack className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-full border-white/10">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Badge variant="outline" className="ml-auto border-primary/20 bg-primary/5 text-primary">
                Step {stepIndex + 1} of {simulatorSteps.length}
              </Badge>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">Code</h3>
                <Badge variant="secondary" className="bg-secondary/70">
                  Execution line {step.line}
                </Badge>
              </div>
              <CodePanel code={simulatorCode} activeLine={step.line} />
            </div>

            <div className="grid gap-5 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Call Stack</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-white/10",
                      step.phase === "push" && "border-primary/30 bg-primary/5 text-primary",
                      step.phase === "pop" && "border-accent/30 bg-accent/5 text-accent"
                    )}
                  >
                    {step.phase}
                  </Badge>
                </div>
                <StackVisualizer frames={step.stack} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-background/55 p-4">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Console Output</p>
                  <div className="min-h-16 font-code text-sm text-primary">
                    {step.console.length ? step.console.map((item) => <p key={item}>{item}</p>) : <span className="text-muted-foreground">No output yet</span>}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-background/55 p-4">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Current Explanation</p>
                  <h4 className="font-semibold">{step.label}</h4>
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

function Playground() {
  const [active, setActive] = useState(0);
  const [code, setCode] = useState(playgroundExamples[0].code);
  const example = playgroundExamples[active];

  function chooseExample(index: number) {
    setActive(index);
    setCode(playgroundExamples[index].code);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Editable Playground"
        icon={Code2}
        title="Call Stack Playground"
        description="Switch examples, edit the code, and compare the expected stack shape for common execution patterns."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Code2 className="h-5 w-5 text-primary" />
              Editable code examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {playgroundExamples.map((item, index) => (
                <Button
                  key={item.title}
                  variant={active === index ? "default" : "outline"}
                  onClick={() => chooseExample(index)}
                  className="rounded-full border-white/10"
                >
                  {item.title}
                </Button>
              ))}
            </div>
            <Textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="min-h-[330px] resize-y border-white/10 bg-background/70 font-code text-xs leading-6"
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Layers3 className="h-5 w-5 text-primary" />
              Expected stack visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <StackVisualizer frames={example.stack} height="min-h-[330px]" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Output</p>
                <p className="mt-2 font-code text-sm text-primary">{example.output}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Execution note</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{example.note}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function StackOverflowSimulator() {
  const [depth, setDepth] = useState(1);
  const [running, setRunning] = useState(false);
  const stack = ["main()", ...Array.from({ length: depth }, (_, index) => `infinite() #${index + 1}`)];
  const limitReached = depth >= 8;

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setDepth((current) => {
        if (current >= 8) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 420);

    return () => clearInterval(timer);
  }, [running]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Failure Mode"
        icon={AlertTriangle}
        title="Stack Overflow Visualization"
        description="Watch infinite recursion keep pushing frames until the runtime reaches its stack limit."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recursive code with no exit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CodePanel
              code={`function infinite() {
  infinite();
}

infinite();`}
              activeLine={limitReached ? 2 : 5}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setRunning(true)} disabled={running || limitReached} className="rounded-full">
                <Play className="mr-2 h-4 w-4" />
                Grow Stack
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRunning(false);
                  setDepth(1);
                }}
                className="rounded-full border-white/10"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            <div
              className={cn(
                "rounded-lg border p-4",
                limitReached
                  ? "border-destructive/50 bg-destructive/15"
                  : "border-white/10 bg-background/50"
              )}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Runtime state</p>
              <p className={cn("mt-2 text-lg font-semibold", limitReached && "text-red-200")}>
                {limitReached ? "Stack Limit Reached: Stack Overflow" : "Frames are still growing"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-5">
            <StackVisualizer frames={stack} danger={limitReached} height="min-h-[520px]" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RuntimeTimeline() {
  const steps = [
    "main()",
    "first()",
    "second()",
    "third()",
    "console.log()",
    "third() exits",
    "second() exits",
    "first() exits",
    "main() exits",
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, 1200);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Runtime Timeline"
        icon={Workflow}
        title="Function Execution Timeline"
        description="The active step moves forward as execution dives into nested calls and then unwinds back out."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-3 md:grid-cols-9">
            {steps.map((step, index) => (
              <motion.button
                key={step}
                onClick={() => setActive(index)}
                animate={{ y: active === index ? -6 : 0 }}
                className={cn(
                  "relative min-h-28 rounded-lg border p-3 text-center transition-colors",
                  active === index
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-white/10 bg-background/50 text-muted-foreground"
                )}
              >
                <span className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background font-code text-xs">
                  {index + 1}
                </span>
                <span className="block font-code text-xs leading-5">{step}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ExecutionFlow() {
  const flow = ["main()", "first()", "second()", "third()", "return", "second()", "first()", "main()"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Execution Flow"
        icon={ArrowDown}
        title="Function Execution Flow"
        description="Calls move downward into deeper frames. Returns move back up to the caller that was waiting."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {flow.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={cn(
                    "flex min-h-20 flex-1 items-center justify-center rounded-lg border px-4 text-center font-code text-sm",
                    item === "return"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-white/10 bg-background/55"
                  )}
                >
                  {item}
                </motion.div>
                {index < flow.length - 1 ? (
                  index < 3 ? <ArrowRight className="hidden h-5 w-5 text-primary md:block" /> : <ArrowLeft className="hidden h-5 w-5 text-accent md:block" />
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ExampleFlows() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real Systems"
        icon={Sparkles}
        title="Real World Call Stacks"
        description="Even product workflows are just layers of function calls entering and exiting the stack."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Application flows</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {realWorldExamples.map((item) => (
              <FlowCard key={item.title} title={item.title} frames={item.frames} />
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Enterprise Commerce Examples</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {commerceExamples.map((item) => (
              <FlowCard key={item.title} title={item.title} frames={item.frames} compact />
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FlowCard({ title, frames, compact = false }: { title: string; frames: string[]; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/45 p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className={cn("mt-4 grid gap-2", compact && "md:grid-cols-2")}>
        {frames.map((frame, index) => (
          <div key={frame} className="flex items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-card/55 px-3 py-2 font-code text-xs text-muted-foreground">
              {frame}
            </div>
            {index < frames.length - 1 ? <ArrowDown className="h-4 w-4 text-primary" /> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Each function enters the stack, delegates work to the next frame, then exits when the nested work returns.
      </p>
    </div>
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

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Quiz"
        title="Check Your Understanding"
        description="Lock in LIFO behavior, stack frames, recursion, and overflow with quick feedback."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map((quiz, index) => {
          const selected = answers[index];
          const isCorrect = selected === quiz.correct;

          return (
            <Card key={quiz.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-5 flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    Q{index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{quiz.question}</h3>
                </div>
                <div className="grid gap-2">
                  {quiz.options.map((option) => {
                    const chosen = selected === option;
                    const correctOption = option === quiz.correct;
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                        className={cn(
                          "h-auto justify-start whitespace-normal rounded-lg border-white/10 px-4 py-3 text-left",
                          chosen && correctOption && "border-primary/50 bg-primary/10 text-primary",
                          chosen && !correctOption && "border-destructive/50 bg-destructive/10 text-red-100"
                        )}
                      >
                        {chosen ? (
                          correctOption ? <Check className="mr-2 h-4 w-4 shrink-0" /> : <X className="mr-2 h-4 w-4 shrink-0" />
                        ) : null}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {selected ? (
                  <p className={cn("mt-4 text-sm leading-6", isCorrect ? "text-primary" : "text-muted-foreground")}>
                    {quiz.explanation}
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
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Common Interview Questions"
        title="Questions with Detailed Answers"
        description="Use these answers to explain the call stack clearly in interviews and code reviews."
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

export function CallStackLesson() {
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
            <ServerCog className="mr-2 h-3.5 w-3.5" />
            JavaScript Runtime
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
            Call <span className="gradient-text">Stack</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript executes functions one frame at a time.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Explore stack frames, execution contexts, nested function calls, recursion, and stack overflow through interactive visualizations.
          </p>
        </motion.div>
      </section>

      <ConceptOverview />

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="simulator" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4">
            <TabsTrigger value="simulator" className="rounded-md">Visualizer</TabsTrigger>
            <TabsTrigger value="playground" className="rounded-md">Playground</TabsTrigger>
            <TabsTrigger value="overflow" className="rounded-md">Overflow</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-md">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="simulator">
            <CallStackSimulator />
          </TabsContent>
          <TabsContent value="playground">
            <Playground />
          </TabsContent>
          <TabsContent value="overflow">
            <StackOverflowSimulator />
          </TabsContent>
          <TabsContent value="timeline" className="space-y-10">
            <RuntimeTimeline />
            <ExecutionFlow />
          </TabsContent>
        </Tabs>
      </section>

      <ExampleFlows />

      <section className="container mx-auto px-4 py-10">
        <SectionHeader
          badge="Code Examples"
          icon={Code2}
          title="Copy-ready Call Stack Examples"
          description="Use these snippets to practice simple calls, nested calls, and recursion."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {codeExamples.map((example) => (
            <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
          ))}
        </div>
      </section>

      <Quiz />
      <InterviewQuestions />
    </div>
  );
}
