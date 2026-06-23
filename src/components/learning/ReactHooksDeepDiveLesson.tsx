"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Box,
  Brain,
  Check,
  ChevronDown,
  Clipboard,
  Component,
  Cpu,
  GitBranch,
  Layers3,
  MousePointerClick,
  RefreshCcw,
  Route,
  ShieldCheck,
  TimerReset,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const hookConcepts = [
  {
    title: "useState",
    description: "Stores local component state and schedules a re-render when the setter receives a new value.",
    flow: ["Initial value", "Setter call", "Render scheduled", "UI updated"],
    icon: RefreshCcw,
  },
  {
    title: "useEffect",
    description: "Runs side effects after React commits UI, with dependencies deciding when the effect runs again.",
    flow: ["Render", "Commit", "Effect runs", "Cleanup before next run"],
    icon: Zap,
  },
  {
    title: "useMemo",
    description: "Caches expensive computed values until one of the listed dependencies changes.",
    flow: ["Dependencies checked", "Cache hit", "Skip calculation", "Return value"],
    icon: Cpu,
  },
  {
    title: "useCallback",
    description: "Keeps function references stable so memoized children can safely skip unnecessary renders.",
    flow: ["Create callback", "Track deps", "Stable reference", "Child skips"],
    icon: GitBranch,
  },
  {
    title: "useRef",
    description: "Persists mutable values across renders without causing a re-render when the value changes.",
    flow: ["Create ref", "Mutate current", "No render", "Value persists"],
    icon: Box,
  },
  {
    title: "Custom Hooks",
    description: "Extract reusable stateful logic into functions that compose built-in hooks behind a clean API.",
    flow: ["Name with use", "Compose hooks", "Return state/actions", "Reuse logic"],
    icon: Layers3,
  },
];

const lifecycleSteps = [
  "Component called",
  "Hooks read in order",
  "JSX returned",
  "DOM committed",
  "Effects run",
  "Cleanup on change",
];

const codeExamples = [
  {
    title: "useState",
    code: `function QuantityStepper() {
  const [quantity, setQuantity] = useState(1);

  return (
    <button onClick={() => setQuantity(quantity + 1)}>
      Quantity: {quantity}
    </button>
  );
}`,
  },
  {
    title: "useEffect",
    code: `function InventoryStatus({ sku }) {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    let active = true;

    fetchStock(sku).then((result) => {
      if (active) setStock(result);
    });

    return () => {
      active = false;
    };
  }, [sku]);

  return <p>{stock ?? "Checking..."}</p>;
}`,
  },
  {
    title: "useMemo",
    code: `const cartTotal = useMemo(() => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}, [items]);`,
  },
  {
    title: "useCallback",
    code: `const onAddToCart = useCallback((sku) => {
  analytics.track("add_to_cart", { sku });
  addLineItem(sku);
}, [analytics, addLineItem]);`,
  },
  {
    title: "useRef",
    code: `function SearchBox() {
  const inputRef = useRef(null);

  return (
    <button onClick={() => inputRef.current?.focus()}>
      Focus search
    </button>
  );
}`,
  },
  {
    title: "Custom Hook",
    code: `function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
  },
];

const quizQuestions = [
  {
    question: "Why must hooks run in the same order?",
    options: ["React stores hook state by call position", "Hooks are browser APIs", "It improves CSS loading"],
    answer: 0,
    explanation: "React associates each hook call with a slot in the component. Conditional hook calls shift those slots and break state matching.",
  },
  {
    question: "When does useEffect run?",
    options: ["After commit", "Before the component function", "Only during build"],
    answer: 0,
    explanation: "Effects run after React commits the UI. Cleanup runs before the next effect execution or unmount.",
  },
  {
    question: "What does useRef do?",
    options: ["Stores mutable values without re-rendering", "Always triggers render", "Replaces props"],
    answer: 0,
    explanation: "Updating ref.current does not schedule a render, which makes refs useful for DOM handles and instance-like values.",
  },
  {
    question: "When should you use useMemo?",
    options: ["For expensive derived values", "For every variable", "For event handlers only"],
    answer: 0,
    explanation: "useMemo is best when recomputing a derived value is meaningfully expensive or when referential stability matters.",
  },
  {
    question: "What does useCallback cache?",
    options: ["A function reference", "A rendered DOM node", "A context provider"],
    answer: 0,
    explanation: "useCallback returns the same function reference until its dependencies change.",
  },
];

const interviewQuestions = [
  {
    question: "What are React Hooks?",
    answer: "Hooks are functions that let components use React features such as state, effects, refs, memoization, and context without class components.",
  },
  {
    question: "What are the Rules of Hooks?",
    answer: "Only call hooks at the top level of React components or custom hooks, and never call them inside loops, conditions, nested functions, or ordinary JavaScript functions.",
  },
  {
    question: "What is the difference between useState and useRef?",
    answer: "useState stores render state and schedules UI updates. useRef stores mutable values that persist across renders without causing another render.",
  },
  {
    question: "What problem does useEffect solve?",
    answer: "useEffect synchronizes a component with systems outside React, such as network requests, subscriptions, timers, browser APIs, and analytics.",
  },
  {
    question: "How do dependency arrays work?",
    answer: "React compares each dependency with its previous value. If any dependency changed, React runs the memo, callback, or effect again.",
  },
  {
    question: "When should you create a custom hook?",
    answer: "Create a custom hook when multiple components need the same stateful behavior, or when extracting logic makes one component easier to understand.",
  },
  {
    question: "How do useMemo and useCallback differ?",
    answer: "useMemo caches the result of a calculation. useCallback caches a function reference, which is useful when passing handlers to memoized children.",
  },
  {
    question: "Why can stale closures happen?",
    answer: "A closure captures values from the render where it was created. If dependencies are missing, callbacks or effects can keep reading older values.",
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

function FlowRail({ steps, active = -1 }: { steps: string[]; active?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]" style={{ "--step-count": steps.length } as CSSProperties}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3 md:flex-col">
          <motion.div
            animate={{
              scale: active === index ? 1.05 : 1,
              borderColor: active === index ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)",
            }}
            className={cn(
              "flex min-h-16 w-full items-center justify-center rounded-lg border bg-background/50 px-3 text-center text-sm font-semibold",
              active === index && "bg-primary/15 text-primary shadow-lg shadow-primary/15",
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

function HookStateSlot({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <motion.div
      animate={{ scale: active ? [1, 1.04, 1] : 1 }}
      className={cn(
        "rounded-lg border border-white/10 bg-background/55 p-4",
        active && "border-primary/60 bg-primary/10",
      )}
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-code text-sm font-semibold text-foreground">{value}</p>
    </motion.div>
  );
}

function ComponentNode({
  name,
  description,
  active,
  muted,
}: {
  name: string;
  description: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <motion.div
      animate={{
        scale: active ? [1, 1.03, 1] : 1,
        boxShadow: active ? "0 0 28px rgba(133,118,237,0.25)" : "0 0 0 rgba(0,0,0,0)",
      }}
      className={cn(
        "rounded-lg border border-white/10 bg-background/55 p-4",
        active && "border-primary/60 bg-primary/10",
        muted && "opacity-55",
      )}
    >
      <p className="font-semibold">{name}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export function ReactHooksDeepDiveLesson() {
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState(false);
  const [effectRuns, setEffectRuns] = useState(0);
  const [memoRuns, setMemoRuns] = useState(1);
  const [parentRenders, setParentRenders] = useState(0);
  const [refClicks, setRefClicks] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const renderRef = useRef(1);
  renderRef.current += 1;

  const subtotal = quantity * 149;
  const discount = coupon ? 25 : 0;
  const activeStep = (quantity + effectRuns + parentRenders) % lifecycleSteps.length;
  const memoSavings = Math.min(92, 35 + memoRuns * 9 + parentRenders * 3);
  const callbackSkips = parentRenders;

  const derivedTotal = useMemo(() => subtotal - discount, [subtotal, discount]);

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(133,118,237,0.18),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(34,197,94,0.1),transparent_28%),radial-gradient(circle_at_50%_95%,rgba(92,140,240,0.16),transparent_35%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Brain className="mr-2 h-3.5 w-3.5" />
            React Hooks
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                React Hooks <span className="gradient-text">Deep Dive</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Master useState, useEffect, useMemo, useCallback, useRef, and custom hooks through live visualizations of state slots, dependency arrays, effects, and render behavior.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["State", "Effect", "Memo", "Ref"]} active={activeStep % 4} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hookConcepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <motion.article
                key={concept.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel className="h-full p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{concept.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{concept.description}</p>
                  <div className="mt-5 grid gap-2">
                    {concept.flow.map((step) => (
                      <div key={step} className="rounded-md border border-white/10 bg-background/45 px-3 py-2 font-code text-xs text-muted-foreground">
                        {step}
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="state" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-6">
            {[
              ["state", "State"],
              ["effects", "Effects"],
              ["memo", "Memoization"],
              ["refs", "Refs"],
              ["custom", "Custom Hooks"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="state" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">useState Slot Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">React preserves hook values by call order across renders.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setQuantity((value) => value + 1)} className="rounded-full">
                      <MousePointerClick className="mr-2 h-4 w-4" />
                      Add Quantity
                    </Button>
                    <Button variant="outline" onClick={() => setCoupon((value) => !value)} className="rounded-full border-white/10">
                      Toggle Coupon
                    </Button>
                  </div>
                </div>
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                  <HookStateSlot label="Hook slot 1" value={`quantity = ${quantity}`} active />
                  <HookStateSlot label="Hook slot 2" value={`coupon = ${coupon ? "true" : "false"}`} active={coupon} />
                  <HookStateSlot label="Derived value" value={`total = $${derivedTotal}`} active />
                </div>
                <FlowRail steps={lifecycleSteps} active={activeStep} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Render Snapshot</h3>
                <div className="grid gap-4">
                  {[
                    ["Quantity", quantity],
                    ["Subtotal", `$${subtotal}`],
                    ["Discount", `$${discount}`],
                    ["Render Count", renderRef.current],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/50 p-4">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <motion.span key={String(value)} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary">
                        {value}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">useEffect Timeline</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Effects run after commit, then cleanup before the next run.</p>
                  </div>
                  <Button onClick={() => setEffectRuns((value) => value + 1)} className="rounded-full">
                    <TimerReset className="mr-2 h-4 w-4" />
                    Change SKU
                  </Button>
                </div>
                <FlowRail steps={["Render SKU", "Commit UI", "Cleanup old effect", "Run new effect", "Sync inventory"]} active={effectRuns ? effectRuns % 5 : -1} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Dependency Array</h2>
                <div className="grid gap-3">
                  <HookStateSlot label="dependency 1" value={`sku = MF-${100 + effectRuns}`} active={effectRuns > 0} />
                  <HookStateSlot label="dependency 2" value="storeId = web" />
                  <HookStateSlot label="effect executions" value={`${effectRuns} runs`} active={effectRuns > 0} />
                </div>
                <p className="mt-5 rounded-lg border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
                  If a dependency changes, React schedules the cleanup and runs the effect again after the next commit.
                </p>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="memo" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">useMemo</h2>
                <Button onClick={() => setMemoRuns((value) => value + 1)} className="mb-5 rounded-full">
                  Recalculate Items
                </Button>
                <div className="space-y-4">
                  <HookStateSlot label="expensive calculation" value={`${memoRuns} executions`} active={memoRuns > 1} />
                  <HookStateSlot label="cached total" value={`$${derivedTotal}`} />
                  <Progress value={memoSavings} />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">useCallback</h2>
                <Button onClick={() => setParentRenders((value) => value + 1)} className="mb-5 rounded-full">
                  Parent Re-render
                </Button>
                <div className="space-y-3">
                  <ComponentNode name="Regular Button" description={`${parentRenders + 1} renders from new handler identity`} active={parentRenders > 0} />
                  <ComponentNode name="Memoized Button" description={`${callbackSkips} skipped renders from stable callback`} muted={parentRenders > 0} />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">Stale Closure Detector</h2>
                <div className="space-y-3">
                  <ComponentNode name="Missing dependency" description="Callback may read an old value from a previous render." active={parentRenders > 0} />
                  <ComponentNode name="Complete dependency array" description="Callback refreshes when its captured values change." />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Memoization Dashboard</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  ["Parent Renders", parentRenders],
                  ["Callback Skips", callbackSkips],
                  ["Memo Runs", memoRuns],
                  ["Derived Total", `$${derivedTotal}`],
                  ["Savings Score", `${memoSavings}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <motion.p key={String(value)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-3xl font-bold text-primary">
                      {value}
                    </motion.p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="refs" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">useRef Mutable Value</h2>
                <Button onClick={() => setRefClicks((value) => value + 1)} className="mb-5 rounded-full">
                  Mutate Ref-like Counter
                </Button>
                <div className="grid gap-4 md:grid-cols-2">
                  <HookStateSlot label="ref.current" value={`${refClicks} mutations`} active={refClicks > 0} />
                  <HookStateSlot label="scheduled renders" value="0 from ref mutation" />
                </div>
                <p className="mt-5 rounded-lg border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
                  Refs are perfect for focus handles, timers, previous values, and mutable integration details that should not repaint the UI by themselves.
                </p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">DOM Handle Pattern</h2>
                <FlowRail steps={["Create ref", "Attach to element", "Read current", "Focus or measure"]} active={refClicks % 4} />
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-8">
            <GlassPanel className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Custom Hook Architecture</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-4">
                {[
                  ["useCart", "Owns line items, totals, quantity updates, coupon state."],
                  ["useInventory", "Synchronizes SKU and store availability with cleanup."],
                  ["useProductAnalytics", "Provides stable tracking callbacks."],
                  ["useDebouncedValue", "Extracts input timing logic for search and filters."],
                ].map(([name, description], index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-white/10 bg-background/50 p-4"
                  >
                    <Route className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-semibold">{name}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Enterprise Product Page Hooks</h2>
              <div className="space-y-3">
                <ComponentNode name="ProductPage" description="Composes hooks and passes stable outputs to sections." active />
                <div className="ml-6 grid gap-3 md:grid-cols-3">
                  <ComponentNode name="usePricing" description="Memoized price, discounts, tax estimates." />
                  <ComponentNode name="useDeliveryPromise" description="Effect-driven delivery date synchronization." />
                  <ComponentNode name="useRecommendations" description="Cached recommendation query and analytics callback." />
                </div>
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
                  <Component className="h-5 w-5 text-primary" />
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
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Hooks Mental Model</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {["Hooks are ordered slots", "Effects synchronize systems", "Refs persist without repaint", "Custom hooks package behavior"].map((takeaway) => (
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
