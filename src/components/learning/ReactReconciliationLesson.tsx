"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronDown,
  Clipboard,
  Fingerprint,
  GitCompare,
  KeyRound,
  Layers3,
  ListTree,
  MousePointerClick,
  Repeat2,
  Route,
  ScanSearch,
  Shuffle,
  Sparkles,
  Split,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const reconciliationRules = [
  {
    title: "Element Type",
    description: "Same type keeps the existing component instance. A different type replaces that subtree.",
    icon: Fingerprint,
    flow: ["<Product />", "same type", "preserve state"],
  },
  {
    title: "Keys",
    description: "Keys let React match siblings across renders even when their order changes.",
    icon: KeyRound,
    flow: ["id: A", "id: B", "move safely"],
  },
  {
    title: "Props",
    description: "Changed props update an existing DOM node or component without remounting the whole branch.",
    icon: GitCompare,
    flow: ["old props", "compare", "patch"],
  },
  {
    title: "Position",
    description: "Without stable keys, React falls back to position, which can attach state to the wrong item.",
    icon: Route,
    flow: ["index 0", "index 1", "state follows slot"],
  },
];

const phases = [
  "Update scheduled",
  "Render next tree",
  "Match by type",
  "Match children by key",
  "Build effect list",
  "Commit mutations",
];

const codeExamples = [
  {
    title: "Same Type",
    code: `// React preserves the Counter component state.
function App({ label }) {
  return <Counter label={label} />;
}`,
  },
  {
    title: "Different Type",
    code: `// React unmounts Counter and mounts Summary.
function App({ checkedOut }) {
  return checkedOut ? <Summary /> : <Counter />;
}`,
  },
  {
    title: "Stable Keys",
    code: `items.map((item) => (
  <CartLine key={item.id} item={item} />
));`,
  },
  {
    title: "Index Keys",
    code: `// Risky when items can be inserted, deleted, or sorted.
items.map((item, index) => (
  <CartLine key={index} item={item} />
));`,
  },
  {
    title: "Reset State",
    code: `// Changing the key intentionally remounts the form.
<CheckoutForm key={customerId} customerId={customerId} />`,
  },
];

const quizQuestions = [
  {
    question: "What does React compare first during reconciliation?",
    options: ["Element type", "CSS classes", "Network timing"],
    answer: 0,
    explanation: "React first checks whether the element type is the same. Different types cause the old subtree to be replaced.",
  },
  {
    question: "Why are stable keys important?",
    options: ["They preserve sibling identity", "They minify JSX", "They prevent all renders"],
    answer: 0,
    explanation: "Stable keys let React match the same logical item across renders, even when siblings move.",
  },
  {
    question: "What can happen with index keys in a sortable list?",
    options: ["State can follow the position", "React stops rendering", "The browser disables events"],
    answer: 0,
    explanation: "Index keys identify positions, not records. After insertion or sorting, local state can appear on the wrong row.",
  },
  {
    question: "How can you intentionally reset component state?",
    options: ["Change its key", "Add a CSS class", "Wrap it in a fragment"],
    answer: 0,
    explanation: "A new key tells React this is a different component identity, so React remounts it with fresh state.",
  },
];

const interviewQuestions = [
  {
    question: "What is React reconciliation?",
    answer: "Reconciliation is React's process for comparing the previous render tree with the next render tree, deciding which component instances can be preserved, and preparing the minimal DOM mutations for the commit phase.",
  },
  {
    question: "How does React decide whether to preserve state?",
    answer: "React preserves state when a component remains the same type at the same keyed position in the tree. Change the type or key and React treats it as a new identity.",
  },
  {
    question: "What role do keys play?",
    answer: "Keys identify siblings. They help React match old and new children by stable identity instead of only by array position.",
  },
  {
    question: "Why are random keys bad?",
    answer: "Random keys change every render, so React remounts the children every time. That loses local state and creates unnecessary DOM work.",
  },
  {
    question: "Does reconciliation mean React updates the DOM immediately?",
    answer: "No. Reconciliation happens during render work. Actual DOM mutations happen later in the commit phase.",
  },
];

type DemoMode = "props" | "type" | "keys";

function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
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
      style={{ "--step-count": steps.length } as React.CSSProperties}
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

function TreeNode({
  label,
  state,
}: {
  label: string;
  state?: "same" | "changed" | "mounted" | "removed";
}) {
  return (
    <motion.div
      layout
      animate={{
        x: state === "changed" ? [0, 5, 0] : 0,
        opacity: state === "removed" ? 0.45 : 1,
      }}
      className={cn(
        "rounded-md border border-white/10 bg-background/55 px-4 py-3 text-sm",
        state === "same" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
        state === "changed" && "border-primary/60 bg-primary/10 text-primary",
        state === "mounted" && "border-sky-400/50 bg-sky-400/10 text-sky-100",
        state === "removed" && "border-rose-400/40 bg-rose-400/10 text-rose-100",
      )}
    >
      {label}
    </motion.div>
  );
}

function ReconciliationTree({ mode, next }: { mode: DemoMode; next: boolean }) {
  const tree = useMemo(() => {
    if (mode === "type") {
      return next
        ? [
            ["ProductPage", "same"],
            ["  SummaryPanel", "mounted"],
            ["  CartTotal", "same"],
          ]
        : [
            ["ProductPage", "same"],
            ["  CartEditor", "removed"],
            ["  CartTotal", "same"],
          ];
    }

    if (mode === "keys") {
      return next
        ? [
            ["CartList", "same"],
            ["  key=b  Keyboard", "same"],
            ["  key=a  Monitor", "same"],
            ["  key=c  Mouse", "mounted"],
          ]
        : [
            ["CartList", "same"],
            ["  key=a  Monitor", "same"],
            ["  key=b  Keyboard", "same"],
          ];
    }

    return next
      ? [
          ["ProductCard", "same"],
          ["  Image", "same"],
          ["  Price prop: $89", "changed"],
          ["  AddButton", "same"],
        ]
      : [
          ["ProductCard", "same"],
          ["  Image", "same"],
          ["  Price prop: $99", "changed"],
          ["  AddButton", "same"],
        ];
  }, [mode, next]);

  return (
    <div className="space-y-3">
      {tree.map(([label, state]) => (
        <TreeNode key={label} label={label} state={state as "same" | "changed" | "mounted" | "removed"} />
      ))}
    </div>
  );
}

export function ReactReconciliationLesson() {
  const [mode, setMode] = useState<DemoMode>("props");
  const [tick, setTick] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const activeStep = tick === 0 ? -1 : (tick - 1) % phases.length;
  const next = tick > 0;
  const operationLabel = mode === "props" ? "Patch prop" : mode === "type" ? "Replace subtree" : "Move by key";

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_76%_10%,rgba(16,185,129,0.11),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(133,118,237,0.16),transparent_34%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <ScanSearch className="mr-2 h-3.5 w-3.5" />
            React Internals
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                React <span className="gradient-text">Reconciliation</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Learn how React compares old and new trees, preserves component identity, uses keys, and decides which DOM changes to commit.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["Old Tree", "Next Tree", "Diff", "Commit"]} active={Math.max(0, activeStep % 4)} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reconciliationRules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <motion.article
                key={rule.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <GlassPanel className="h-full p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{rule.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{rule.description}</p>
                  <div className="mt-5 space-y-2">
                    {rule.flow.map((item) => (
                      <div key={item} className="rounded-md border border-white/10 bg-background/45 px-3 py-2 font-code text-xs text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="visualizer" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-4">
            {[
              ["visualizer", "Visualizer"],
              ["keys", "Keys"],
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
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Tree Diff Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Switch scenarios to see what React preserves, patches, mounts, or removes.</p>
                  </div>
                  <Button onClick={() => setTick((value) => value + 1)} className="rounded-full font-semibold">
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Reconcile
                  </Button>
                </div>

                <div className="mb-6 grid gap-2 sm:grid-cols-3">
                  {[
                    ["props", "Prop change", GitCompare],
                    ["type", "Type change", Split],
                    ["keys", "Keyed list", Shuffle],
                  ].map(([value, label, Icon]) => (
                    <Button
                      key={value as string}
                      variant={mode === value ? "default" : "outline"}
                      onClick={() => {
                        setMode(value as DemoMode);
                        setTick(0);
                      }}
                      className="min-h-11 rounded-md border-white/10"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label as string}
                    </Button>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
                  <div>
                    <Badge variant="outline" className="mb-3 border-white/10">Previous render</Badge>
                    <ReconciliationTree mode={mode} next={false} />
                  </div>
                  <div className="flex h-full items-center justify-center">
                    <Badge className="rounded-full bg-primary/20 px-5 py-2 text-primary">{operationLabel}</Badge>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3 border-white/10">Next render</Badge>
                    <ReconciliationTree mode={mode} next={next} />
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Commit Summary</h3>
                <div className="grid gap-4">
                  {[
                    ["Preserved nodes", mode === "type" ? 2 : mode === "keys" ? 3 : 3],
                    ["Patched nodes", mode === "props" && next ? 1 : 0],
                    ["Mounted nodes", mode !== "props" && next ? 1 : 0],
                    ["Removed nodes", mode === "type" && next ? 1 : 0],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/50 p-4">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <motion.span key={`${label}-${value}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary">
                        {value}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Reconciliation Phases</h2>
              <FlowRail steps={phases} active={activeStep} />
            </GlassPanel>
          </TabsContent>

          <TabsContent value="keys" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Stable Keys</h2>
                </div>
                <div className="space-y-3">
                  {["sku-42 Monitor", "sku-17 Keyboard", "sku-88 Mouse"].map((item, index) => (
                    <TreeNode key={item} label={`key=${item}`} state={index === 2 ? "mounted" : "same"} />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  React tracks each row by product identity. Sorting, inserting, or filtering can move DOM nodes without mixing up row state.
                </p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <ListTree className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Index Keys</h2>
                </div>
                <div className="space-y-3">
                  {["index=0 Keyboard", "index=1 Monitor", "index=2 Mouse"].map((item) => (
                    <TreeNode key={item} label={item} state="changed" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  React tracks slots instead of records. In editable lists, an input value or local toggle can appear to jump to another item.
                </p>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Key Mental Model</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Use IDs", "Prefer database IDs, slugs, or stable product SKUs."],
                  ["Avoid randomness", "Math.random() remounts children on every render."],
                  ["Change keys on purpose", "A new key is useful when you want fresh local state."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-white/10 bg-background/50 p-5">
                    <Sparkles className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["Preserve State", "Keep the same type and key when toggling views that should remember local state.", Repeat2],
                ["Reset State", "Change the key when switching users, documents, or checkout sessions should start fresh.", KeyRound],
                ["Measure First", "Reconciliation is efficient, but expensive component render logic still needs profiling.", ScanSearch],
              ].map(([title, description, Icon]) => (
                <GlassPanel key={title as string} className="p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">{title as string}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description as string}</p>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Render vs Commit</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-background/50 p-5">
                  <p className="mb-2 font-semibold text-primary">Render phase</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    React calls components, builds the next tree, and reconciles it with the previous tree. This work should stay pure.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-background/50 p-5">
                  <p className="mb-2 font-semibold text-primary">Commit phase</p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    React applies DOM mutations, attaches refs, and runs layout effects. This is when the browser-visible update happens.
                  </p>
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
            <h2 className="text-2xl font-bold">Reconciliation Mental Model</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {["Type decides replacement", "Key decides sibling identity", "Props decide patches", "Commit updates the DOM"].map((takeaway) => (
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
