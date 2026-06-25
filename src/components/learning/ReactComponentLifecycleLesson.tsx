"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Check,
  ChevronDown,
  Clipboard,
  Component,
  Hourglass,
  Layers3,
  MousePointerClick,
  Power,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trash2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type LifecyclePhase = "mount" | "update" | "unmount";

const lifecycleConcepts = [
  {
    phase: "mount",
    title: "Mount",
    description: "React creates the component instance, renders JSX, commits DOM nodes, then runs effects.",
    icon: Sparkles,
    flow: ["Create", "Render", "Commit", "Effect"],
  },
  {
    phase: "update",
    title: "Update",
    description: "State, props, or context changes schedule a new render and commit only the changed output.",
    icon: RefreshCcw,
    flow: ["Change", "Render", "Diff", "Commit"],
  },
  {
    phase: "unmount",
    title: "Unmount",
    description: "React removes the component and runs cleanup functions for subscriptions, timers, and listeners.",
    icon: Trash2,
    flow: ["Cleanup", "Detach refs", "Remove DOM", "Done"],
  },
] satisfies Array<{
  phase: LifecyclePhase;
  title: string;
  description: string;
  icon: typeof Sparkles;
  flow: string[];
}>;

const effectTimeline = [
  "Render component",
  "Commit DOM",
  "Run layout effects",
  "Browser paints",
  "Run effects",
  "Cleanup before next run",
];

const codeExamples = [
  {
    title: "Mount Effect",
    code: `function ProductView({ productId }) {
  useEffect(() => {
    analytics.track("product_viewed", { productId });
  }, [productId]);

  return <ProductDetails productId={productId} />;
}`,
  },
  {
    title: "Cleanup",
    code: `function InventoryTicker({ sku }) {
  useEffect(() => {
    const id = window.setInterval(() => {
      refreshInventory(sku);
    }, 5000);

    return () => window.clearInterval(id);
  }, [sku]);
}`,
  },
  {
    title: "Subscription",
    code: `function OrderStatus({ orderId }) {
  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, setStatus);
    return unsubscribe;
  }, [orderId]);
}`,
  },
  {
    title: "Layout Effect",
    code: `function Tooltip() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    positionTooltip(rect);
  }, []);

  return <div ref={ref}>Details</div>;
}`,
  },
  {
    title: "Key Remount",
    code: `// Changing key creates a fresh component lifecycle.
<CheckoutForm key={customerId} customerId={customerId} />`,
  },
];

const quizQuestions = [
  {
    question: "When does useEffect run?",
    options: ["After React commits UI", "Before render starts", "During module import"],
    answer: 0,
    explanation: "useEffect runs after React has committed the UI update. It is meant for synchronizing with systems outside React.",
  },
  {
    question: "What should cleanup functions handle?",
    options: ["Timers, subscriptions, and listeners", "CSS class names only", "Static imports"],
    answer: 0,
    explanation: "Cleanup prevents stale subscriptions, duplicate listeners, pending timers, and updates from obsolete async work.",
  },
  {
    question: "What triggers an update lifecycle?",
    options: ["State, props, or context changes", "Only page refresh", "Only CSS changes"],
    answer: 0,
    explanation: "React updates a component when its state changes, its parent passes new props, or a context value it reads changes.",
  },
  {
    question: "How can you intentionally remount a component?",
    options: ["Change its key", "Rename a variable", "Add a comment"],
    answer: 0,
    explanation: "A different key tells React to treat the component as a new identity, so old state is discarded and mount logic runs again.",
  },
];

const interviewQuestions = [
  {
    question: "What are the main React lifecycle phases?",
    answer: "The practical lifecycle is mount, update, and unmount. During mount React creates and commits the UI. During update it re-renders and commits changes. During unmount it removes the UI and runs cleanup.",
  },
  {
    question: "How do hooks map to lifecycle behavior?",
    answer: "useEffect handles after-commit synchronization and cleanup. useLayoutEffect runs after DOM mutation but before paint. useState and props changes drive update cycles.",
  },
  {
    question: "Why should effects return cleanup functions?",
    answer: "Cleanup releases resources created by the effect, such as subscriptions, event listeners, intervals, observers, and async guards.",
  },
  {
    question: "What is the difference between render and commit?",
    answer: "Render calculates the next UI tree and should be pure. Commit applies DOM changes, updates refs, and runs effect lifecycles.",
  },
  {
    question: "Why can React run effects more than once in development?",
    answer: "React Strict Mode can intentionally remount components and re-run effects in development to reveal unsafe side effects and missing cleanup.",
  },
];

function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-card/45 shadow-2xl shadow-black/20 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FlowRail({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div
      className="grid gap-3 md:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]"
      style={{ "--step-count": steps.length } as CSSProperties}
    >
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3 md:flex-col">
          <motion.div
            animate={{ scale: active === index ? 1.05 : 1 }}
            className={cn(
              "flex min-h-16 w-full items-center justify-center rounded-lg border border-white/10 bg-background/50 px-3 text-center text-sm font-semibold",
              active === index && "border-primary/60 bg-primary/15 text-primary",
            )}
          >
            {step}
          </motion.div>
          {index < steps.length - 1 && (
            <ArrowDown className="h-4 w-4 shrink-0 text-primary md:rotate-[-90deg]" />
          )}
        </div>
      ))}
    </div>
  );
}

function LifecycleNode({
  name,
  detail,
  active,
  muted,
}: {
  name: string;
  detail: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <motion.div
      animate={{ scale: active ? [1, 1.03, 1] : 1 }}
      className={cn(
        "rounded-lg border border-white/10 bg-background/55 p-4",
        active && "border-primary/60 bg-primary/10",
        muted && "opacity-55",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{name}</p>
        <Badge variant="outline" className="border-white/10 bg-background/60">
          {detail}
        </Badge>
      </div>
    </motion.div>
  );
}

export function ReactComponentLifecycleLesson() {
  const [phase, setPhase] = useState<LifecyclePhase>("mount");
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const currentPhase = lifecycleConcepts.find((item) => item.phase === phase) ?? lifecycleConcepts[0];
  const CurrentIcon = currentPhase.icon;
  const activeStep = useMemo(() => {
    if (!mounted) return 2;
    if (phase === "mount") return 0;
    if (phase === "update") return 1;
    return 2;
  }, [mounted, phase]);

  const cleanupScore = mounted ? Math.min(90, 35 + count * 9) : 100;

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(34,197,94,0.11),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(133,118,237,0.15),transparent_34%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Activity className="mr-2 h-3.5 w-3.5" />
            React Runtime
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                Component <span className="gradient-text">Lifecycle</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Understand how components mount, update, unmount, run effects, clean up resources, and preserve predictable UI behavior.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["Mount", "Update", "Unmount"]} active={activeStep} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-3">
          {lifecycleConcepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <motion.article
                key={concept.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <button
                  onClick={() => {
                    setPhase(concept.phase);
                    if (concept.phase !== "unmount") setMounted(true);
                  }}
                  className={cn(
                    "h-full w-full rounded-lg border border-white/10 bg-card/45 p-5 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-primary/30",
                    phase === concept.phase && "border-primary/50 bg-primary/10",
                  )}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{concept.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{concept.description}</p>
                  <div className="mt-5 space-y-2">
                    {concept.flow.map((step) => (
                      <div key={step} className="rounded-md border border-white/10 bg-background/45 px-3 py-2 font-code text-xs text-muted-foreground">
                        {step}
                      </div>
                    ))}
                  </div>
                </button>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="visualizer" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-4">
            {[
              ["visualizer", "Visualizer"],
              ["effects", "Effects"],
              ["patterns", "Patterns"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="visualizer" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Lifecycle Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Trigger updates and unmounts to see where effects and cleanup fit.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        setMounted(true);
                        setPhase("update");
                        setCount((value) => value + 1);
                      }}
                      className="rounded-full font-semibold"
                    >
                      <MousePointerClick className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMounted((value) => !value);
                        setPhase(mounted ? "unmount" : "mount");
                      }}
                      className="rounded-full border-white/10"
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {mounted ? "Unmount" : "Mount"}
                    </Button>
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-white/10 bg-background/45 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <CurrentIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{currentPhase.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentPhase.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <LifecycleNode name="ProductCard" detail={mounted ? "mounted" : "removed"} active={mounted} muted={!mounted} />
                    <LifecycleNode name="Render count" detail={`${count + 1}`} active={count > 0 && mounted} />
                    <LifecycleNode name="Effect status" detail={mounted ? "active" : "cleaned"} active={mounted} muted={!mounted} />
                  </div>
                </div>

                <FlowRail steps={currentPhase.flow} active={mounted ? Math.min(3, count % 4) : 0} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Resource Health</h3>
                <div className="rounded-lg border border-white/10 bg-background/50 p-5">
                  <p className="text-sm text-muted-foreground">Cleanup readiness</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{cleanupScore}%</p>
                  <div className="mt-5">
                    <Progress value={cleanupScore} />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <LifecycleNode name="Interval" detail={mounted ? "running" : "cleared"} active={mounted} muted={!mounted} />
                  <LifecycleNode name="Subscription" detail={mounted ? "listening" : "unsubscribed"} active={mounted} muted={!mounted} />
                  <LifecycleNode name="DOM listener" detail={mounted ? "attached" : "removed"} active={mounted} muted={!mounted} />
                </div>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-8">
            <GlassPanel className="p-6">
              <h2 className="mb-5 text-3xl font-bold">Effect Timing</h2>
              <FlowRail steps={effectTimeline} active={mounted ? Math.min(effectTimeline.length - 1, count % effectTimeline.length) : 5} />
            </GlassPanel>

            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <Zap className="mb-4 h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">useEffect</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Runs after commit and paint for most side effects: requests, analytics, subscriptions, timers, and browser APIs.
                </p>
              </GlassPanel>
              <GlassPanel className="p-6">
                <Hourglass className="mb-4 h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">useLayoutEffect</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Runs after DOM mutation but before the browser paints, which is useful for layout reads and synchronous positioning.
                </p>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["Keep render pure", "Do calculations during render, but do not start subscriptions, timers, or mutations there.", Component],
                ["Clean every setup", "If an effect subscribes, starts a timer, or attaches a listener, return a matching cleanup.", ShieldCheck],
                ["Use keys carefully", "Changing a key intentionally resets state and starts a fresh mount lifecycle.", TimerReset],
              ].map(([title, description, Icon]) => (
                <GlassPanel key={title as string} className="p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">{title as string}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description as string}</p>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Class Lifecycle Mapping</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["componentDidMount", "useEffect(..., [])"],
                  ["componentDidUpdate", "useEffect(..., [deps])"],
                  ["componentWillUnmount", "effect cleanup return"],
                ].map(([classMethod, hookPattern]) => (
                  <div key={classMethod} className="rounded-lg border border-white/10 bg-background/50 p-5">
                    <p className="font-code text-sm text-primary">{classMethod}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{hookPattern}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
              <GlassPanel className="p-6">
                <h2 className="mb-6 text-3xl font-bold">Interactive Quiz</h2>
                <div className="space-y-5">
                  {quizQuestions.map((quiz, quizIndex) => (
                    <div key={quiz.question} className="rounded-lg border border-white/10 bg-background/45 p-4">
                      <p className="mb-3 font-semibold">{quizIndex + 1}. {quiz.question}</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        {quiz.options.map((option, optionIndex) => {
                          const selected = selectedAnswer[quizIndex] === optionIndex;
                          const correct = selected && optionIndex === quiz.answer;
                          return (
                            <button
                              key={option}
                              onClick={() => setSelectedAnswer((answers) => ({ ...answers, [quizIndex]: optionIndex }))}
                              className={cn(
                                "min-h-12 rounded-md border border-white/10 bg-card/55 px-3 text-left text-sm transition-colors",
                                selected && "border-primary/50 bg-primary/10",
                                correct && "border-emerald-400/60 bg-emerald-400/10 text-emerald-100",
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {selectedAnswer[quizIndex] !== undefined && (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{quiz.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Code Examples</h2>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {codeExamples.map((example, index) => (
                    <Button
                      key={example.title}
                      variant={expandedCode === index ? "default" : "outline"}
                      onClick={() => setExpandedCode(index)}
                      className="h-auto min-h-11 rounded-md border-white/10 px-3 text-xs"
                    >
                      {example.title}
                    </Button>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <p className="font-code text-xs text-muted-foreground">{codeExamples[expandedCode].title}</p>
                    <Button size="sm" variant="ghost" onClick={() => copyCode(expandedCode)} className="h-8 px-2">
                      {copiedCode === expandedCode ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-6 text-slate-200">
                    <code>{codeExamples[expandedCode].code}</code>
                  </pre>
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-3xl font-bold">Interview Questions</h2>
              <div className="space-y-3">
                {interviewQuestions.map((item, index) => (
                  <Card
                    key={item.question}
                    onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                    className={cn(
                      "cursor-pointer border-white/10 bg-background/45 transition-colors hover:border-primary/30",
                      expandedQuestion === index && "border-primary/40 bg-primary/10",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-base">{item.question}</CardTitle>
                        <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", expandedQuestion === index && "rotate-180")} />
                      </div>
                    </CardHeader>
                    {expandedQuestion === index && (
                      <CardContent className="pt-0 text-sm leading-7 text-muted-foreground">
                        {item.answer}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>
        </Tabs>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-lg border border-primary/20 bg-primary/10 p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Lifecycle Mental Model</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {["Render stays pure", "Commit touches the DOM", "Effects sync outside systems", "Cleanup prevents leaks"].map((takeaway) => (
              <div key={takeaway} className="rounded-lg border border-white/10 bg-background/45 p-4 text-sm font-semibold">
                {takeaway}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
