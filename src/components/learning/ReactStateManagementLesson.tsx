"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Check,
  ChevronDown,
  Clipboard,
  Database,
  GitBranch,
  Layers3,
  MousePointerClick,
  Network,
  RefreshCcw,
  Route,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Split,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type StateScope = "local" | "lifted" | "context" | "server" | "external";
type StoreMode = "context" | "zustand" | "redux";

const stateScopes = [
  {
    id: "local",
    title: "Local State",
    description: "Keep state inside the component when only that component needs it.",
    icon: Boxes,
    examples: ["input draft", "menu open", "hovered row"],
  },
  {
    id: "lifted",
    title: "Lifted State",
    description: "Move state to the nearest shared parent when siblings need to coordinate.",
    icon: GitBranch,
    examples: ["selected tab", "wizard step", "cart drawer"],
  },
  {
    id: "context",
    title: "Context State",
    description: "Share relatively stable values across a subtree without prop drilling.",
    icon: Share2,
    examples: ["theme", "locale", "current user"],
  },
  {
    id: "server",
    title: "Server State",
    description: "Treat remote data as cached, async, and owned outside the client tree.",
    icon: Database,
    examples: ["products", "orders", "inventory"],
  },
  {
    id: "external",
    title: "External Store",
    description: "Use a dedicated store for complex client state with many readers and writers.",
    icon: Network,
    examples: ["checkout", "builder", "dashboard"],
  },
] satisfies Array<{
  id: StateScope;
  title: string;
  description: string;
  icon: typeof Boxes;
  examples: string[];
}>;

const codeExamples = [
  {
    title: "Local State",
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
    title: "Lifted State",
    code: `function CheckoutShell() {
  const [step, setStep] = useState("shipping");

  return (
    <>
      <CheckoutTabs step={step} onStepChange={setStep} />
      <CheckoutPanel step={step} />
    </>
  );
}`,
  },
  {
    title: "Context",
    code: `const CurrencyContext = createContext("USD");

function Price({ amount }) {
  const currency = useContext(CurrencyContext);
  return <span>{formatMoney(amount, currency)}</span>;
}`,
  },
  {
    title: "Reducer",
    code: `function cartReducer(state, action) {
  switch (action.type) {
    case "lineAdded":
      return { ...state, lines: [...state.lines, action.line] };
    case "lineRemoved":
      return { ...state, lines: state.lines.filter((line) => line.id !== action.id) };
    default:
      return state;
  }
}`,
  },
  {
    title: "External Store",
    code: `const useCheckoutStore = create((set) => ({
  shippingMethod: null,
  setShippingMethod: (method) => set({ shippingMethod: method }),
}));`,
  },
];

const quizQuestions = [
  {
    question: "Where should state live by default?",
    options: ["As local as possible", "Always in Redux", "Always in Context"],
    answer: 0,
    explanation: "Local state has the smallest blast radius. Move it outward only when another component actually needs it.",
  },
  {
    question: "When is Context a good fit?",
    options: ["Stable cross-tree values", "High-frequency text input", "Every API response"],
    answer: 0,
    explanation: "Context is great for values like theme, locale, auth identity, or configuration. Frequently changing values can re-render too much of the tree.",
  },
  {
    question: "What is server state?",
    options: ["Remote data cached on the client", "A CSS variable", "Only form field state"],
    answer: 0,
    explanation: "Server state comes from outside React, can be stale, needs loading and error states, and usually benefits from a cache.",
  },
  {
    question: "When should you consider an external store?",
    options: ["Many distant components coordinate complex state", "One button toggles open", "A value never changes"],
    answer: 0,
    explanation: "External stores help when updates come from many places and prop drilling or Context providers become hard to reason about.",
  },
];

const interviewQuestions = [
  {
    question: "How do you decide where React state should live?",
    answer: "Start with the component that owns the interaction. If siblings need the same value, lift it to their nearest shared parent. Use Context for stable cross-tree values, a server-state cache for remote data, and an external store for complex shared client workflows.",
  },
  {
    question: "What is the difference between client state and server state?",
    answer: "Client state is owned by the browser session, such as form drafts or UI toggles. Server state is owned by a backend, can become stale, and needs fetching, caching, invalidation, loading states, and error handling.",
  },
  {
    question: "Why can Context become a performance problem?",
    answer: "When a provider value changes, every consumer under that provider can re-render. For high-frequency updates, split providers, memoize values, or use an external store with selectors.",
  },
  {
    question: "When is useReducer better than useState?",
    answer: "useReducer is useful when state transitions have named events, multiple fields change together, or the next state depends on a clear domain action.",
  },
  {
    question: "How do Zustand and Redux differ conceptually?",
    answer: "Both centralize shared state. Redux emphasizes explicit actions, reducers, middleware, and dev tooling. Zustand is smaller and selector-focused, with direct store actions and less ceremony.",
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
            <Route className="h-4 w-4 shrink-0 text-primary md:rotate-90" />
          )}
        </div>
      ))}
    </div>
  );
}

function ComponentNode({
  name,
  value,
  active,
  muted,
}: {
  name: string;
  value: string;
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
          {value}
        </Badge>
      </div>
    </motion.div>
  );
}

function StoreComparison({ mode }: { mode: StoreMode }) {
  const rows = {
    context: [
      ["Best for", "Stable subtree values"],
      ["Update style", "Provider value changes"],
      ["Risk", "Broad consumer re-renders"],
    ],
    zustand: [
      ["Best for", "Shared client workflows"],
      ["Update style", "Store actions and selectors"],
      ["Risk", "Too many hidden writes"],
    ],
    redux: [
      ["Best for", "Large auditable state machines"],
      ["Update style", "Actions and reducers"],
      ["Risk", "Boilerplate for small flows"],
    ],
  }[mode];

  return (
    <div className="grid gap-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function ReactStateManagementLesson() {
  const [scope, setScope] = useState<StateScope>("local");
  const [quantity, setQuantity] = useState(1);
  const [selectedStep, setSelectedStep] = useState("shipping");
  const [currency, setCurrency] = useState("USD");
  const [storeMode, setStoreMode] = useState<StoreMode>("context");
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const activeScope = stateScopes.find((item) => item.id === scope) ?? stateScopes[0];
  const ActiveIcon = activeScope.icon;
  const complexityScore = useMemo(() => {
    const scoreByScope: Record<StateScope, number> = {
      local: 18,
      lifted: 38,
      context: 52,
      server: 74,
      external: 86,
    };

    return scoreByScope[scope];
  }, [scope]);

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(34,197,94,0.14),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(133,118,237,0.15),transparent_34%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
            React Architecture
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                State <span className="gradient-text">Management</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Learn where state should live, when to lift it, when Context helps, and when a dedicated store or server-state cache is the cleaner tool.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["Local", "Lift", "Share", "Cache", "Store"]} active={stateScopes.findIndex((item) => item.id === scope)} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {stateScopes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setScope(item.id)}
                  className={cn(
                    "h-full w-full rounded-lg border border-white/10 bg-card/45 p-5 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-primary/30",
                    scope === item.id && "border-primary/50 bg-primary/10",
                  )}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  <div className="mt-5 space-y-2">
                    {item.examples.map((example) => (
                      <div key={example} className="rounded-md border border-white/10 bg-background/45 px-3 py-2 font-code text-xs text-muted-foreground">
                        {example}
                      </div>
                    ))}
                  </div>
                </button>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="decision" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-5">
            {[
              ["decision", "Decision"],
              ["patterns", "Patterns"],
              ["stores", "Stores"],
              ["commerce", "Commerce"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="decision" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">State Placement Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Choose a scope and see the ownership and sharing tradeoff.</p>
                  </div>
                  <Button onClick={() => setQuantity((value) => value + 1)} className="rounded-full font-semibold">
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Update example
                  </Button>
                </div>

                <div className="mb-6 rounded-lg border border-white/10 bg-background/45 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <ActiveIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{activeScope.title}</h3>
                      <p className="text-sm text-muted-foreground">{activeScope.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <ComponentNode name="Owner" value={scope === "local" ? "Component" : scope === "lifted" ? "Parent" : "Provider"} active />
                    <ComponentNode name="Readers" value={scope === "local" ? "1" : scope === "external" ? "many" : "shared"} active={scope !== "local"} />
                    <ComponentNode name="Writes" value={quantity.toString()} active={quantity > 1} />
                  </div>
                </div>

                <FlowRail steps={["Who owns it?", "Who reads it?", "Who writes it?", "How often?", "What can fail?"]} active={Math.min(4, Math.floor(complexityScore / 20))} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Complexity Meter</h3>
                <div className="rounded-lg border border-white/10 bg-background/50 p-5">
                  <p className="text-sm text-muted-foreground">Current choice</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{activeScope.title}</p>
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Coordination cost</span>
                      <span className="font-semibold text-primary">{complexityScore}%</span>
                    </div>
                    <Progress value={complexityScore} />
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  The best state management choice is usually the simplest one that matches ownership, sharing, update frequency, and failure modes.
                </p>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassPanel className="p-6">
                <RefreshCcw className="mb-4 h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">useState</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Best for direct UI state: form fields, toggles, counters, selection, and small pieces of isolated interaction.
                </p>
              </GlassPanel>
              <GlassPanel className="p-6">
                <Split className="mb-4 h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">useReducer</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Best when transitions have names and rules, like cart actions, multi-step forms, or state machines.
                </p>
              </GlassPanel>
              <GlassPanel className="p-6">
                <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Derived State</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Prefer calculating values from existing state instead of storing duplicate values that can drift out of sync.
                </p>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">State Flow Example</h2>
              <FlowRail steps={["User action", "Event handler", "State update", "Render", "UI reflects state"]} active={quantity % 5} />
            </GlassPanel>
          </TabsContent>

          <TabsContent value="stores" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Store Selector</h2>
                <div className="grid gap-2">
                  {[
                    ["context", "Context", Share2],
                    ["zustand", "Zustand", Zap],
                    ["redux", "Redux", Layers3],
                  ].map(([value, label, Icon]) => (
                    <Button
                      key={value as string}
                      variant={storeMode === value ? "default" : "outline"}
                      onClick={() => setStoreMode(value as StoreMode)}
                      className="min-h-11 justify-start rounded-md border-white/10"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label as string}
                    </Button>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Comparison</h2>
                <StoreComparison mode={storeMode} />
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Server State Boundary</h2>
              <div className="grid gap-4 md:grid-cols-4">
                {["Fetch", "Cache", "Revalidate", "Invalidate"].map((step, index) => (
                  <div key={step} className="rounded-lg border border-white/10 bg-background/50 p-5">
                    <Database className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-semibold">{step}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Step {index + 1}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="commerce" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Checkout State</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Step state is shared by tabs and panel.</p>
                  </div>
                  <Button
                    onClick={() => setSelectedStep((value) => (value === "shipping" ? "payment" : "shipping"))}
                    className="rounded-full"
                  >
                    {selectedStep}
                  </Button>
                </div>
                <div className="space-y-3">
                  <ComponentNode name="Checkout Shell" value="owns step" active />
                  <ComponentNode name="Checkout Tabs" value={selectedStep} active />
                  <ComponentNode name="Checkout Panel" value={selectedStep} active />
                  <ComponentNode name="Order Summary" value="server state" muted />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Currency Context</h2>
                    <p className="mt-1 text-sm text-muted-foreground">A stable provider value feeds price displays.</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrency((value) => (value === "USD" ? "PKR" : "USD"))}
                    className="rounded-full border-white/10"
                  >
                    {currency}
                  </Button>
                </div>
                <div className="space-y-3">
                  <ComponentNode name="Currency Provider" value={currency} active />
                  <ComponentNode name="Product Price" value={currency === "USD" ? "$49" : "Rs 13,600"} active />
                  <ComponentNode name="Cart Total" value={currency === "USD" ? "$98" : "Rs 27,200"} active />
                  <ComponentNode name="Search Box" value="unrelated" muted />
                </div>
              </GlassPanel>
            </div>
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
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">State Management Mental Model</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {["Keep state local first", "Lift only when shared", "Cache server data", "Use stores for workflows"].map((takeaway) => (
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
