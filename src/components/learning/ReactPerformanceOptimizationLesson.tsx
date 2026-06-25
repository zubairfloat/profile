"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Check,
  ChevronDown,
  Clipboard,
  Cpu,
  Gauge,
  Image,
  Layers3,
  ListFilter,
  MousePointerClick,
  PackageOpen,
  RefreshCcw,
  Route,
  Scissors,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Split,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type OptimizationMode = "memo" | "memoValue" | "callback";
type ScaleMode = "context" | "virtualization" | "splitting" | "images" | "state";

const conceptCards = [
  {
    title: "Why React Performance Matters",
    description: "Fast pages feel smooth, keep users focused, and protect revenue on large commerce flows.",
    icon: Gauge,
    points: ["better input response", "less CPU work", "higher conversion"],
  },
  {
    title: "What Causes Slow React Apps",
    description: "Slow apps often re-render too much, calculate too much, load too much, or render too many DOM nodes.",
    icon: ShieldAlert,
    points: ["wide state updates", "heavy components", "large bundles"],
  },
  {
    title: "What Is a Re-render",
    description: "A re-render means React calls your component again to calculate the next UI.",
    icon: RefreshCcw,
    points: ["state changed", "props changed", "context changed"],
  },
  {
    title: "What Is Expensive Rendering",
    description: "Rendering becomes expensive when component logic, lists, charts, images, or nested trees take real time.",
    icon: Cpu,
    points: ["large lists", "heavy math", "complex children"],
  },
  {
    title: "What Is Memoization",
    description: "Memoization remembers a previous result so React can skip safe repeated work.",
    icon: Boxes,
    points: ["React.memo", "useMemo", "useCallback"],
  },
];

const codeExamples = [
  {
    title: "React.memo Before",
    code: `function ProductCard({ product }) {
  return <article>{product.name}</article>;
}

// Parent state changes re-render ProductCard too.`,
  },
  {
    title: "React.memo After",
    code: `const ProductCard = React.memo(function ProductCard({ product }) {
  return <article>{product.name}</article>;
});

// ProductCard can skip re-render when props are unchanged.`,
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
    code: `const handleAddToCart = useCallback((sku) => {
  addLineItem(sku);
}, [addLineItem]);

return <ProductCard onAddToCart={handleAddToCart} />;`,
  },
  {
    title: "Context Split",
    code: `<AuthContext.Provider value={authValue}>
  <CartContext.Provider value={cartValue}>
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  </CartContext.Provider>
</AuthContext.Provider>`,
  },
  {
    title: "Code Splitting",
    code: `const CheckoutPanel = dynamic(() => import("./CheckoutPanel"), {
  loading: () => <CheckoutSkeleton />,
});

const Recommendations = React.lazy(() => import("./Recommendations"));`,
  },
  {
    title: "next/image",
    code: `<Image
  src={product.image}
  alt={product.name}
  width={640}
  height={640}
  sizes="(min-width: 1024px) 25vw, 50vw"
/>`,
  },
];

const quizQuestions = [
  {
    question: "What causes a React component to re-render?",
    options: ["State, props, or context changes", "Only CSS changes", "Only browser resize"],
    answer: 0,
    explanation: "React re-renders when state changes, a parent passes new props, or a consumed context value changes.",
  },
  {
    question: "What does React.memo do?",
    options: ["Skips rendering when props are unchanged", "Caches API responses", "Downloads smaller images"],
    answer: 0,
    explanation: "React.memo lets a component skip rendering when its props are shallowly equal to the previous props.",
  },
  {
    question: "When should you use useMemo?",
    options: ["For expensive derived values", "For every variable", "To replace state"],
    answer: 0,
    explanation: "useMemo is useful when recalculating a value costs enough to matter or when stable identity is needed.",
  },
  {
    question: "How do you optimize very large lists?",
    options: ["Virtualization or pagination", "Render all rows twice", "Put every row in Context"],
    answer: 0,
    explanation: "Large lists should render only the visible window, or use pagination and server-side filtering.",
  },
];

const interviewQuestions = [
  {
    question: "What causes React re-renders?",
    answer: "A component re-renders when its state changes, its parent gives it new props, or a context value it reads changes. External store subscriptions can also trigger renders.",
  },
  {
    question: "What is React.memo?",
    answer: "React.memo wraps a component and lets React skip rendering it when its props have not changed. It is useful for heavy child components with stable props.",
  },
  {
    question: "Difference between React.memo and useMemo?",
    answer: "React.memo memoizes a component render decision. useMemo memoizes the result of a calculation inside a component.",
  },
  {
    question: "Difference between useMemo and useCallback?",
    answer: "useMemo returns a cached value. useCallback returns a cached function reference, which helps memoized children avoid re-rendering.",
  },
  {
    question: "When should you avoid memoization?",
    answer: "Avoid it for cheap components, unstable props, simple calculations, or code that has not been measured as slow. Memoization adds complexity and comparison work.",
  },
  {
    question: "How do you optimize large lists?",
    answer: "Use pagination, virtualization, server-side filtering, stable keys, memoized rows, and lazy-loaded images. Do not render hundreds or thousands of heavy cards at once.",
  },
  {
    question: "How do you optimize a slow checkout page?",
    answer: "Keep form state close to each section, memoize heavy summary/payment panels, split context providers, lazy-load optional flows, and measure typing responsiveness with the Profiler.",
  },
  {
    question: "How do you find performance issues in React?",
    answer: "Use React DevTools Profiler, browser performance tools, render counters, production monitoring, and bundle analysis. Measure first, then optimize the slowest path.",
  },
];

const commonMistakes = [
  "Using useMemo everywhere",
  "Using useCallback everywhere",
  "Memoizing cheap components",
  "Passing new objects as props",
  "Putting all state in global store",
  "Rendering large lists without virtualization",
  "Not using React DevTools Profiler",
];

const enterpriseExamples = [
  {
    title: "Product Detail Page",
    problem: "Changing quantity re-renders reviews and recommendations.",
    solution: "Keep quantity state local and memoize heavy reviews and recommendations.",
  },
  {
    title: "Cart Page",
    problem: "Changing one item quantity re-renders all cart items.",
    solution: "Memoize CartItem and update only the changed line item.",
  },
  {
    title: "Product Listing Page",
    problem: "Rendering 500 products slows the page.",
    solution: "Use pagination, virtualization, lazy images, and server-side filtering.",
  },
  {
    title: "Checkout Page",
    problem: "Typing customer info re-renders payment and delivery sections.",
    solution: "Split form sections and isolate state where each field is used.",
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

function RenderNode({
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
          {renders} renders
        </Badge>
      </div>
    </motion.div>
  );
}

function ExplanationCard({
  title,
  what,
  why,
  when,
  avoid,
  mistake,
  interview,
}: {
  title: string;
  what: string;
  why: string;
  when: string;
  avoid: string;
  mistake: string;
  interview: string;
}) {
  return (
    <GlassPanel className="p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          ["What it is", what],
          ["Why use it", why],
          ["When to use it", when],
          ["When not to use it", avoid],
          ["Common mistake", mistake],
          ["Interview explanation", interview],
        ].map(([label, text]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
            <p className="text-xs font-semibold uppercase text-primary">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function ScalePanel({ mode }: { mode: ScaleMode }) {
  const content = {
    context: {
      title: "Context Performance",
      icon: Split,
      before: "One provider value contains user, login, logout, cart, and theme.",
      after: "Split AuthContext, CartContext, and ThemeContext so updates stay focused.",
      metric: "Fewer subscribed components re-render",
    },
    virtualization: {
      title: "List Virtualization",
      icon: ListFilter,
      before: "Render 1000 product cards on the PLP.",
      after: "Render only the visible product cards plus a small buffer.",
      metric: "1000 cards becomes about 24 visible cards",
    },
    splitting: {
      title: "Code Splitting and Lazy Loading",
      icon: Scissors,
      before: "Load checkout, dashboard, and recommendations on the first page load.",
      after: "Load each heavy section only when the user needs it.",
      metric: "Smaller first bundle",
    },
    images: {
      title: "Image and Asset Optimization",
      icon: Image,
      before: "Use huge unoptimized gallery images and background images.",
      after: "Use next/image, correct sizes, and lazy loading below the fold.",
      metric: "Faster PDP and PLP image loading",
    },
    state: {
      title: "State Management Performance",
      icon: Layers3,
      before: "Put modal state, input state, cart state, and filters in one global store.",
      after: "Keep UI state local and share only real app data globally.",
      metric: "Smaller update blast radius",
    },
  }[mode];
  const Icon = content.icon;

  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{content.title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4">
          <p className="text-xs font-semibold uppercase text-rose-200">Before</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.before}</p>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-xs font-semibold uppercase text-emerald-200">After</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.after}</p>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <p className="text-xs font-semibold uppercase text-primary">Result</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.metric}</p>
        </div>
      </div>
    </GlassPanel>
  );
}

export function ReactPerformanceOptimizationLesson() {
  const [quantity, setQuantity] = useState(1);
  const [optimized, setOptimized] = useState(false);
  const [mode, setMode] = useState<OptimizationMode>("memo");
  const [scaleMode, setScaleMode] = useState<ScaleMode>("context");
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const totalRenders = optimized ? quantity + 8 : quantity * 6 + 6;
  const avoidedRenders = optimized ? quantity * 4 : 0;
  const savedCalculations = optimized ? quantity * 3 : 0;
  const bundleImprovement = optimized ? 38 : 8;
  const memoizedComponents = optimized ? 5 : 0;
  const performanceScore = Math.min(98, 48 + avoidedRenders * 4 + bundleImprovement);

  const expensiveCalculationRuns = useMemo(() => {
    return optimized ? Math.max(1, Math.ceil(quantity / 3)) : quantity;
  }, [optimized, quantity]);

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
            <Gauge className="mr-2 h-3.5 w-3.5" />
            Advanced React
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                React Performance <span className="gradient-text">Optimization</span>
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold">
                Learn how to reduce unnecessary renders and make React applications faster.
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                A practical visual guide to React.memo, useMemo, useCallback, lazy loading, code splitting, virtualization, context optimization, and real-world enterprise performance patterns.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["Measure", "Render", "Memoize", "Split", "Ship"]} active={optimized ? 4 : Math.min(3, quantity % 5)} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {conceptCards.map((concept, index) => {
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
                  <div className="mt-5 space-y-2">
                    {concept.points.map((point) => (
                      <div key={point} className="rounded-md border border-white/10 bg-background/45 px-3 py-2 font-code text-xs text-muted-foreground">
                        {point}
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </motion.article>
            );
          })}
        </section>

        <Tabs defaultValue="render-demo" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-6">
            {[
              ["render-demo", "Render Demo"],
              ["memo", "Memo APIs"],
              ["scale", "Scale"],
              ["dashboard", "Dashboard"],
              ["enterprise", "Enterprise"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="render-demo" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Interactive Render Problem Demo</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Only quantity and total should update. Heavy page sections should stay quiet.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setQuantity((value) => value + 1)} className="rounded-full font-semibold">
                      <MousePointerClick className="mr-2 h-4 w-4" />
                      Quantity {quantity}
                    </Button>
                    <Button variant="outline" onClick={() => setOptimized((value) => !value)} className="rounded-full border-white/10">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {optimized ? "Optimized" : "Unoptimized"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <RenderNode name="ProductPage" renders={quantity + 1} active />
                  <div className="ml-5 space-y-3">
                    <RenderNode name="ProductInfo" renders={optimized ? 1 : quantity + 1} active={!optimized} muted={optimized} />
                    <RenderNode name="Price" renders={quantity + 1} active />
                    <RenderNode name="Inventory" renders={optimized ? 1 : quantity + 1} active={!optimized} muted={optimized} />
                    <RenderNode name="Reviews" renders={optimized ? 1 : quantity + 1} active={!optimized} muted={optimized} />
                    <RenderNode name="Recommendations" renders={optimized ? 1 : quantity + 1} active={!optimized} muted={optimized} />
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">What Changed?</h3>
                <div className="grid gap-4">
                  {[
                    ["Quantity", quantity],
                    ["Total renders", totalRenders],
                    ["Avoided renders", avoidedRenders],
                    ["Heavy sections skipped", optimized ? 4 : 0],
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
          </TabsContent>

          <TabsContent value="memo" className="space-y-8">
            <div className="grid gap-2 md:grid-cols-3">
              {[
                ["memo", "React.memo", Boxes],
                ["memoValue", "useMemo", Cpu],
                ["callback", "useCallback", Zap],
              ].map(([value, label, Icon]) => (
                <Button
                  key={value as string}
                  variant={mode === value ? "default" : "outline"}
                  onClick={() => setMode(value as OptimizationMode)}
                  className="min-h-11 rounded-md border-white/10"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label as string}
                </Button>
              ))}
            </div>

            {mode === "memo" && (
              <ExplanationCard
                title="React.memo"
                what="React.memo prevents a component from re-rendering when its props have not changed."
                why="Use it to protect heavy child components from unrelated parent updates."
                when="Use it for expensive components that receive stable props, such as ProductCard, Reviews, or Recommendations."
                avoid="Do not use it for tiny components or when props always change."
                mistake="Passing new objects or inline functions makes props look different every render."
                interview="React.memo memoizes the component render decision using shallow prop comparison."
              />
            )}
            {mode === "memoValue" && (
              <ExplanationCard
                title="useMemo"
                what="useMemo remembers the result of an expensive calculation."
                why="Use it so a large cart total, filtered list, or chart data calculation does not run on every render."
                when="Use it when the calculation is expensive or when a stable object/array helps memoized children."
                avoid="Do not use it for simple math or every variable."
                mistake="Adding the wrong dependency list can return stale results."
                interview="useMemo caches a computed value until one dependency changes."
              />
            )}
            {mode === "callback" && (
              <ExplanationCard
                title="useCallback"
                what="useCallback remembers a function reference."
                why="Use it when a memoized child receives a function prop and should not re-render because the function identity changed."
                when="Use it for handlers passed to React.memo children, such as handleAddToCart."
                avoid="Do not wrap every function. It adds dependency work and can make code harder to read."
                mistake="Forgetting dependencies creates callbacks that use old state or props."
                interview="useCallback is useMemo for functions: it returns the same function reference until dependencies change."
              />
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">Before</h2>
                <RenderNode name="ProductCard" renders={quantity + 1} active />
                <RenderNode name="Reviews" renders={quantity + 1} active />
                <RenderNode name="Cart total calculation" renders={quantity} active />
              </GlassPanel>
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-2xl font-bold">After</h2>
                <RenderNode name="ProductCard" renders={mode === "memo" ? 1 : quantity + 1} muted={mode === "memo"} />
                <RenderNode name="Reviews" renders={mode === "callback" ? 1 : quantity + 1} muted={mode === "callback"} />
                <RenderNode name="Cart total calculation" renders={mode === "memoValue" ? expensiveCalculationRuns : quantity} muted={mode === "memoValue"} />
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="scale" className="space-y-8">
            <div className="grid gap-2 md:grid-cols-5">
              {[
                ["context", "Context", Split],
                ["virtualization", "Virtualization", ListFilter],
                ["splitting", "Code Splitting", PackageOpen],
                ["images", "Images", Image],
                ["state", "State", Layers3],
              ].map(([value, label, Icon]) => (
                <Button
                  key={value as string}
                  variant={scaleMode === value ? "default" : "outline"}
                  onClick={() => setScaleMode(value as ScaleMode)}
                  className="min-h-11 rounded-md border-white/10 text-xs"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label as string}
                </Button>
              ))}
            </div>
            <ScalePanel mode={scaleMode} />

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Large List Visualizer</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-5">
                  <p className="font-semibold">Without virtualization</p>
                  <p className="mt-3 text-4xl font-bold text-rose-100">1000</p>
                  <p className="mt-2 text-sm text-muted-foreground">product cards rendered</p>
                </div>
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="font-semibold">With virtualization</p>
                  <p className="mt-3 text-4xl font-bold text-emerald-100">24</p>
                  <p className="mt-2 text-sm text-muted-foreground">visible product cards rendered</p>
                </div>
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <GlassPanel className="p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Performance Dashboard</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Toggle optimized mode in the render demo to improve these numbers.</p>
                </div>
                <Button onClick={() => setOptimized((value) => !value)} className="rounded-full">
                  <Activity className="mr-2 h-4 w-4" />
                  {optimized ? "Optimized" : "Unoptimized"}
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                {[
                  ["Total Renders", totalRenders],
                  ["Avoided Renders", avoidedRenders],
                  ["Calculations Saved", savedCalculations],
                  ["Bundle Improvement", `${bundleImprovement}%`],
                  ["Memoized", memoizedComponents],
                  ["Score", `${performanceScore}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <motion.p key={`${label}-${value}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-3xl font-bold text-primary">
                      {value}
                    </motion.p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Performance Score</span>
                  <span className="font-semibold text-primary">{performanceScore}%</span>
                </div>
                <Progress value={performanceScore} />
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {enterpriseExamples.map((example) => (
                <GlassPanel key={example.title} className="p-6">
                  <ShoppingCart className="mb-4 h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">{example.title}</h2>
                  <div className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-4">
                    <p className="text-xs font-semibold uppercase text-rose-200">Problem</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{example.problem}</p>
                  </div>
                  <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs font-semibold uppercase text-emerald-200">Solution</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{example.solution}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Common Mistakes</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {commonMistakes.map((mistake) => (
                  <div key={mistake} className="rounded-lg border border-white/10 bg-background/50 p-4 text-sm font-semibold">
                    <ShieldAlert className="mb-3 h-5 w-5 text-primary" />
                    {mistake}
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
            <Search className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Final Checklist</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Use React.memo when props do not change.",
              "Use useMemo for expensive calculations.",
              "Use useCallback when passing functions to memoized children.",
              "Use virtualization for large lists.",
              "Use code splitting for large pages.",
              "Keep state close to where it is needed.",
              "Measure first, then optimize.",
            ].map((takeaway) => (
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
