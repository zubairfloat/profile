"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Check,
  ChevronDown,
  Clipboard,
  Cpu,
  GitCompare,
  Gauge,
  Layers3,
  MousePointerClick,
  RefreshCcw,
  RotateCcw,
  Route,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const concepts = [
  {
    title: "Initial Render",
    description: "A component mounts, React calls the render function, creates a Virtual DOM tree, then commits real DOM nodes.",
    flow: ["Component", "Render Function", "Virtual DOM", "Real DOM"],
    icon: Sparkles,
  },
  {
    title: "Re-render",
    description: "React runs a component again when state, props, or subscribed context values change.",
    flow: ["State Update", "Component Re-render", "Virtual DOM Update"],
    icon: RefreshCcw,
  },
  {
    title: "Virtual DOM",
    description: "React builds a lightweight description of the UI so it can calculate the smallest useful DOM update.",
    flow: ["Faster Updates", "Better Performance", "Minimal DOM Work"],
    icon: Layers3,
  },
  {
    title: "Reconciliation",
    description: "React compares the previous tree with the new tree, finds differences, and commits only changed nodes.",
    flow: ["Old Tree", "Diffing", "New Tree", "Changed Nodes Only"],
    icon: GitCompare,
  },
];

const renderSteps = [
  "Button Click",
  "State Change",
  "Component Re-render",
  "Virtual DOM Created",
  "Diffing",
  "Real DOM Updated",
];

const quizQuestions = [
  {
    question: "What triggers a React re-render?",
    options: ["State, props, or context changes", "Only browser repaint", "Only route changes"],
    answer: 0,
    explanation: "React re-renders a component when its own state changes, when a parent passes new props, or when a context value it consumes changes.",
  },
  {
    question: "What is the Virtual DOM?",
    options: ["A lightweight UI tree", "A browser API", "A CSS optimization"],
    answer: 0,
    explanation: "The Virtual DOM is React's in-memory representation of what the UI should look like.",
  },
  {
    question: "What is reconciliation?",
    options: ["Comparing old and new trees", "Downloading JavaScript", "Running CSS animations"],
    answer: 0,
    explanation: "Reconciliation is React's process for comparing the previous render output with the next output.",
  },
  {
    question: "Why use React.memo?",
    options: ["To skip equal-prop child renders", "To replace state", "To force all children to render"],
    answer: 0,
    explanation: "React.memo lets React skip rendering a component when its props are referentially equal.",
  },
  {
    question: "Difference between useMemo and useCallback?",
    options: ["useMemo caches values, useCallback caches functions", "They are identical", "useCallback caches JSX only"],
    answer: 0,
    explanation: "useMemo stores an expensive computed value; useCallback stores a stable function reference.",
  },
];

const codeExamples = [
  {
    title: "Basic Render",
    code: `function ProductTitle() {
  return <h1>Premium Mattress</h1>;
}`,
  },
  {
    title: "State Update",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
  },
  {
    title: "Props Update",
    code: `function ProductPage() {
  const [price, setPrice] = useState(100);

  return <Price amount={price} />;
}`,
  },
  {
    title: "Context Update",
    code: `const ThemeContext = createContext("dark");

function Header() {
  const theme = useContext(ThemeContext);
  return <header data-theme={theme} />;
}`,
  },
  {
    title: "React.memo",
    code: `const Reviews = memo(function Reviews({ productId }) {
  return <ReviewList productId={productId} />;
});`,
  },
  {
    title: "useMemo",
    code: `const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);`,
  },
  {
    title: "useCallback",
    code: `const onQuantityChange = useCallback((id, quantity) => {
  updateCartLine(id, quantity);
}, [updateCartLine]);`,
  },
  {
    title: "Custom Hook",
    code: `function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}`,
  },
];

const interviewQuestions = [
  {
    question: "What is React Rendering?",
    answer: "React rendering is the process of calling components to produce a UI description. React then compares that output with the previous output and commits the needed DOM changes.",
  },
  {
    question: "What causes a re-render?",
    answer: "A re-render happens when local state changes, parent props change, a consumed context value changes, or an external store subscription notifies React.",
  },
  {
    question: "What is Virtual DOM?",
    answer: "It is a lightweight object tree that describes UI. React uses it to reason about changes before touching browser DOM nodes.",
  },
  {
    question: "What is Reconciliation?",
    answer: "Reconciliation is React's comparison process. It matches element types and keys, identifies changed subtrees, and prepares updates for the commit phase.",
  },
  {
    question: "What is Diffing?",
    answer: "Diffing is the tree comparison step. React compares old and new children, props, and keys to determine what changed.",
  },
  {
    question: "What is React.memo?",
    answer: "React.memo wraps a component so React can skip its render when props are unchanged by shallow comparison.",
  },
  {
    question: "Difference between React.memo and useMemo?",
    answer: "React.memo memoizes a component render decision. useMemo memoizes a computed value inside a component.",
  },
  {
    question: "Difference between useMemo and useCallback?",
    answer: "useMemo returns a cached value. useCallback returns a cached function reference, which helps memoized children avoid unnecessary renders.",
  },
  {
    question: "Why are unnecessary re-renders bad?",
    answer: "They consume CPU, run calculations again, create more objects, and can delay input responsiveness on large pages.",
  },
  {
    question: "How do you optimize React performance?",
    answer: "Keep state local, split components by update frequency, use keys correctly, memoize expensive work, stabilize callbacks for memoized children, and measure before optimizing.",
  },
];

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

function FlowRail({ steps, active = -1 }: { steps: string[]; active?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]" style={{ "--step-count": steps.length } as React.CSSProperties}>
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

function MiniTree({
  price,
  changed,
}: {
  price: number;
  changed?: string[];
}) {
  const nodes = [
    { id: "ProductPage", level: 0 },
    { id: "ProductInfo", level: 1 },
    { id: `Price $${price}`, level: 1, match: "price" },
    { id: "Inventory", level: 1 },
  ];

  return (
    <div className="space-y-3">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          animate={{ x: changed?.includes(node.match ?? "") ? [0, 4, 0] : 0 }}
          className={cn(
            "rounded-md border border-white/10 bg-background/55 px-4 py-3 text-sm",
            node.level && "ml-7",
            changed?.includes(node.match ?? "") && "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
          )}
        >
          {node.id}
        </motion.div>
      ))}
    </div>
  );
}

function ComponentNode({
  name,
  renders,
  active,
  muted,
}: {
  name: string;
  renders: number;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <motion.div
      animate={{
        scale: active ? [1, 1.04, 1] : 1,
        boxShadow: active ? "0 0 28px rgba(133,118,237,0.28)" : "0 0 0 rgba(0,0,0,0)",
      }}
      className={cn(
        "rounded-lg border border-white/10 bg-background/55 p-4",
        active && "border-primary/60 bg-primary/10",
        muted && "opacity-55",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{name}</p>
        <Badge variant="outline" className="border-white/10 bg-background/60">
          {renders} renders
        </Badge>
      </div>
    </motion.div>
  );
}

export function ReactRenderingLesson() {
  const [count, setCount] = useState(0);
  const [parentTick, setParentTick] = useState(0);
  const [price, setPrice] = useState(100);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [memoDemo, setMemoDemo] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const activeStep = count === 0 ? -1 : (count - 1) % renderSteps.length;
  const parentRenders = parentTick + price + memoDemo + quantity;
  const totalRenders = count + parentTick * 3 + memoDemo * 2 + quantity + (price === 90 ? 2 : 0);
  const skippedRenders = memoDemo + (quantity > 1 ? 3 : 0);
  const performanceScore = Math.max(58, 96 - totalRenders + skippedRenders * 2);
  const expensiveRuns = useMemo(() => memoDemo + 1, [memoDemo]);

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(133,118,237,0.18),transparent_30%),radial-gradient(circle_at_80%_5%,rgba(34,197,94,0.1),transparent_28%),radial-gradient(circle_at_50%_95%,rgba(92,140,240,0.16),transparent_35%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Cpu className="mr-2 h-3.5 w-3.5" />
            React Internals
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                React <span className="gradient-text">Rendering</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Learn how React decides what to render, when to re-render, and how it efficiently updates the DOM using the Virtual DOM and reconciliation process.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["State", "Render", "Diff", "Commit"]} active={activeStep % 4} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <motion.article
                key={concept.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <GlassPanel className="h-full p-5">
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
                </GlassPanel>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="simulator" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-6">
            {[
              ["simulator", "Simulator"],
              ["updates", "Updates"],
              ["vdom", "Virtual DOM"],
              ["optimize", "Optimization"],
              ["commerce", "Commerce"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="simulator" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Interactive Rendering Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">A counter render from event to DOM commit.</p>
                  </div>
                  <Button onClick={() => setCount((value) => value + 1)} className="rounded-full font-semibold">
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Increment
                  </Button>
                </div>
                <div className="mb-8 rounded-lg border border-white/10 bg-black/35 p-4 font-code text-sm">
                  <p className="text-muted-foreground">function Counter() {" {"}</p>
                  <p className="pl-4 text-primary">const [count, setCount] = useState({count});</p>
                  <p className="pl-4 text-emerald-300">console.log("Counter Rendered");</p>
                  <p className="pl-4">return &lt;button&gt;Count: {count}&lt;/button&gt;;</p>
                  <p className="text-muted-foreground">{"}"}</p>
                </div>
                <FlowRail steps={renderSteps} active={activeStep} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Live Output</h3>
                <div className="grid gap-4">
                  {[
                    ["State Value", count],
                    ["Render Count", count + 1],
                    ["Virtual DOM Updates", count],
                    ["DOM Updates", count],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/50 p-4">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <motion.span key={value} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary">
                        {value}
                      </motion.span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 font-code text-xs text-emerald-200">
                  {Array.from({ length: Math.min(count + 1, 6) }).map((_, index) => (
                    <p key={index}>&gt; Counter Rendered</p>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Render Count Tracker</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Parent and child components pulse when their render count changes.</p>
                </div>
                <Button variant="outline" onClick={() => setParentTick((value) => value + 1)} className="rounded-full border-white/10">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Parent State Change
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <ComponentNode name="Parent Component" renders={parentTick + 1} active={parentTick > 0} />
                <ComponentNode name="Counter Component" renders={count + 1} active={count > 0} />
                <ComponentNode name="Child Component" renders={parentTick + 1} active={parentTick > 0} />
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="updates" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Parent vs Child Re-render Demo</h2>
                <Button onClick={() => setParentTick((value) => value + 1)} className="mb-5 rounded-full">
                  Trigger Parent Render
                </Button>
                <div className="space-y-3">
                  <ComponentNode name="App" renders={parentRenders + 1} active={parentTick > 0} />
                  <div className="ml-6 space-y-3">
                    <ComponentNode name="ProductPage" renders={parentTick + 1} active={parentTick > 0} />
                    <ComponentNode name="ProductInfo" renders={parentTick + 1} active={parentTick > 0} />
                    <ComponentNode name="Price" renders={price === 90 ? 2 : 1} active={price === 90} />
                    <ComponentNode name="Inventory" renders={1} muted />
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Props Update Visualizer</h2>
                <div className="mb-5 flex gap-3">
                  <Button onClick={() => setPrice(90)} className="rounded-full">Set price $90</Button>
                  <Button variant="outline" onClick={() => setPrice(100)} className="rounded-full border-white/10">Reset $100</Button>
                </div>
                <FlowRail steps={["Parent Re-render", "Child Receives New Props", "Child Re-render"]} active={price === 90 ? 2 : -1} />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <MiniTree price={100} />
                  <MiniTree price={price} changed={price === 90 ? ["price"] : []} />
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">State Update Visualizer</h2>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">Previous State</p>
                    <p className="mt-2 text-2xl font-bold">{Math.max(count - 1, 0)}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">Current State</p>
                    <p className="mt-2 text-2xl font-bold text-primary">{count}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">Render Trigger</p>
                    <p className="mt-2 font-semibold">setCount</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">DOM Update</p>
                    <p className="mt-2 font-semibold">Text node</p>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Context Update Visualizer</h2>
                <Button onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} className="mb-5 rounded-full">
                  Toggle Theme Context
                </Button>
                <FlowRail steps={["Theme Context", "Header", "Sidebar", "Footer"]} active={theme === "light" ? 3 : -1} />
                <p className="mt-5 rounded-lg border border-white/10 bg-background/50 p-4 text-sm text-muted-foreground">
                  Current context value: <span className="font-semibold text-primary">{theme}</span>. Subscribed components re-render; unrelated components stay quiet.
                </p>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="vdom" className="space-y-8">
            <GlassPanel className="p-6">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Virtual DOM Visualizer</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Previous tree and next tree side by side, with the changed node highlighted.</p>
                </div>
                <Button onClick={() => setPrice((value) => (value === 100 ? 90 : 100))} className="rounded-full">
                  <GitCompare className="mr-2 h-4 w-4" />
                  Diff Price
                </Button>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <MiniTree price={100} />
                <div className="flex items-center justify-center">
                  <Badge className="rounded-full bg-primary/20 px-5 py-2 text-primary">Diffing</Badge>
                </div>
                <MiniTree price={price} changed={price === 90 ? ["price"] : []} />
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-3xl font-bold">Reconciliation Animation</h2>
              <FlowRail steps={["State Change", "Render Phase", "Virtual DOM", "Diffing", "Reconciliation", "Commit Phase", "DOM Update"]} active={activeStep} />
            </GlassPanel>
          </TabsContent>

          <TabsContent value="optimize" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">React.memo Visualizer</h2>
                <Button onClick={() => setMemoDemo((value) => value + 1)} className="mb-5 rounded-full">Parent State Change</Button>
                <div className="space-y-3">
                  <ComponentNode name="Regular Child" renders={memoDemo + 1} active={memoDemo > 0} />
                  <ComponentNode name="Memoized Child" renders={1} muted={memoDemo > 0} />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">useMemo Visualizer</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4">
                    <p className="text-sm text-muted-foreground">Without useMemo</p>
                    <p className="mt-2 text-2xl font-bold">{memoDemo + parentTick + 1} runs</p>
                  </div>
                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm text-muted-foreground">With useMemo</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-200">{expensiveRuns} runs</p>
                  </div>
                  <Progress value={Math.min(90, 40 + memoDemo * 8)} />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-xl font-bold">useCallback Visualizer</h2>
                <div className="space-y-3">
                  <ComponentNode name="Button without useCallback" renders={memoDemo + 1} active={memoDemo > 0} />
                  <ComponentNode name="Button with useCallback" renders={1} muted={memoDemo > 0} />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Performance Dashboard</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  ["Total Renders", totalRenders],
                  ["Skipped Renders", skippedRenders],
                  ["DOM Updates", count + (price === 90 ? 1 : 0) + quantity],
                  ["Virtual DOM Updates", totalRenders - skippedRenders],
                  ["Memoized Components", 3],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <motion.p key={value} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-3xl font-bold text-primary">
                      {value}
                    </motion.p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Performance Score</span>
                  <span className="font-semibold text-primary">{performanceScore}%</span>
                </div>
                <Progress value={performanceScore} />
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="commerce" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Shopping Cart Example</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Changing quantity updates only cart item and total.</p>
                  </div>
                  <Button onClick={() => setQuantity((value) => value + 1)} className="rounded-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Quantity {quantity}
                  </Button>
                </div>
                <div className="space-y-3">
                  <ComponentNode name="Cart Page" renders={1} muted={quantity > 1} />
                  <ComponentNode name="Cart Items" renders={quantity} active={quantity > 1} />
                  <ComponentNode name="Coupon Section" renders={1} muted={quantity > 1} />
                  <ComponentNode name="Cart Total" renders={quantity} active={quantity > 1} />
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Product Detail Page Example</h2>
                <div className="grid gap-3">
                  <ComponentNode name="Product Images" renders={1} muted={quantity > 1} />
                  <ComponentNode name="Product Details" renders={quantity} active={quantity > 1} />
                  <ComponentNode name="Inventory" renders={quantity} active={quantity > 1} />
                  <ComponentNode name="Reviews" renders={1} muted />
                  <ComponentNode name="Recommendations" renders={1} muted />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Enterprise Commerce Architecture</h2>
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  ["Price Component", "Price promotion changed", price === 90],
                  ["Inventory Component", "Store availability changed", quantity > 1],
                  ["Delivery Component", "Zip code dependency", false],
                  ["Recommendation Component", "Memoized data", false],
                  ["Reviews Component", "Static query result", false],
                ].map(([title, why, active]) => (
                  <div key={title as string} className={cn("rounded-lg border border-white/10 bg-background/50 p-4", active && "border-primary/60 bg-primary/10")}>
                    <Route className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{why}</p>
                    <Badge variant="outline" className="mt-4 border-white/10">
                      {active ? "Re-rendered" : "Skipped"}
                    </Badge>
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
                  <Gauge className="h-5 w-5 text-primary" />
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
            <h2 className="text-2xl font-bold">Rendering Mental Model</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {["Render is calculation", "Reconciliation finds changes", "Commit touches the DOM", "Optimization skips safe work"].map((takeaway) => (
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
