"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  Component,
  Database,
  FileCode2,
  GitBranch,
  Layers3,
  MousePointerClick,
  PackageOpen,
  RefreshCcw,
  Route,
  Search,
  ShieldAlert,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Split,
  ToggleLeft,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ExampleMode = "loading" | "products" | "cart" | "checkout" | "storage" | "debounce";

const conceptCards = [
  {
    title: "What is a Custom Hook?",
    description: "A custom hook is a function that starts with use and reuses React stateful logic.",
    icon: Sparkles,
    points: ["starts with use", "can call hooks", "returns useful values"],
  },
  {
    title: "Why Custom Hooks Matter",
    description: "They keep components smaller and make business logic reusable across the app.",
    icon: Layers3,
    points: ["less duplicate code", "clearer components", "shared behavior"],
  },
  {
    title: "Naming Rule: useSomething",
    description: "The use prefix tells React and lint tools that this function follows hook rules.",
    icon: Code2,
    points: ["useCart", "useProducts", "useDebounce"],
  },
  {
    title: "Reusable Logic",
    description: "A hook can manage state, effects, events, validation, storage, or API fetching.",
    icon: RefreshCcw,
    points: ["forms", "APIs", "checkout"],
  },
  {
    title: "Separation of UI and Logic",
    description: "The hook owns behavior. The component owns markup, layout, and visual design.",
    icon: Split,
    points: ["hook returns data", "component renders UI", "clean boundary"],
  },
];

const codeExamples = [
  {
    title: "useToggle",
    code: `function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((current) => !current);
  }, []);

  return { value, setValue, toggle };
}`,
  },
  {
    title: "useDebounce",
    code: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    title: "useLocalStorage",
    code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
  },
  {
    title: "useProducts",
    code: `function useProducts(categoryId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchProducts(categoryId));
      setError(null);
    } catch (reason) {
      setError(reason);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}`,
  },
  {
    title: "useCart",
    code: `function useCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((current) => addOrIncrease(current, product));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) => updateLineQuantity(current, id, quantity));
  }, []);

  const cartTotal = useMemo(() => getCartTotal(items), [items]);
  const itemCount = useMemo(() => getItemCount(items), [items]);

  return { items, addItem, removeItem, updateQuantity, cartTotal, itemCount };
}`,
  },
  {
    title: "useCheckoutForm",
    code: `function useCheckoutForm() {
  const [values, setValues] = useState(initialCheckoutValues);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => validateCheckout(values), [values]);

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }, []);

  const submit = useCallback(async () => {
    if (Object.keys(errors).length > 0) return;
    await placeOrder(values);
  }, [errors, values]);

  return { values, errors, touched, setField, submit };
}`,
  },
];

const enterpriseHooks = [
  ["useCart", "Header, Mini Cart, Cart Page, Checkout", "Keeps cart actions and totals reusable."],
  ["useCheckout", "Checkout shell and step panels", "Coordinates shipping, payment, validation, and submit flow."],
  ["usePayment", "Payment section", "Hides provider setup, tokenization, errors, and retry state."],
  ["useInventory", "PDP, PLP, Cart", "Shares stock checks and low-inventory messages."],
  ["useProductSearch", "Search bar and autocomplete", "Debounces search and manages result state."],
  ["useAnalytics", "Product, cart, checkout events", "Keeps tracking calls consistent and testable."],
  ["useRecommendations", "PDP and cart cross-sell", "Manages loading, fallback, and personalized data."],
];

const commonMistakes = [
  "Putting UI inside hook",
  "Returning too much data",
  "Making one hook do everything",
  "Ignoring cleanup",
  "Calling hooks conditionally",
  "Not memoizing returned functions when needed",
  "Mixing business logic with component UI",
];

const quizQuestions = [
  {
    question: "What is a Custom Hook?",
    options: ["A reusable hook function", "A CSS class", "A React route"],
    answer: 0,
    explanation: "A custom hook is a JavaScript function that starts with use and reuses stateful React logic.",
  },
  {
    question: "Why do we create Custom Hooks?",
    options: ["To extract repeated stateful logic", "To replace JSX", "To avoid components"],
    answer: 0,
    explanation: "Custom hooks reduce duplicate logic and keep components focused on rendering UI.",
  },
  {
    question: "Where should hooks be called?",
    options: ["At the top level", "Inside conditions", "Inside loops"],
    answer: 0,
    explanation: "Hooks must run in the same order every render, so call them at the top level of components or other hooks.",
  },
  {
    question: "What is a good useDebounce use case?",
    options: ["Product search autocomplete", "Static footer text", "A plain number format"],
    answer: 0,
    explanation: "Debounce is useful when user input changes quickly, such as product search autocomplete.",
  },
];

const interviewQuestions = [
  {
    question: "What is a Custom Hook?",
    answer: "A custom hook is a reusable function that starts with use and can call React hooks inside it. It lets you share stateful logic without copying it across components.",
  },
  {
    question: "Why do we create Custom Hooks?",
    answer: "We create custom hooks to remove repeated stateful logic, keep components smaller, make behavior easier to test, and reuse business flows across screens.",
  },
  {
    question: "What are the Rules of Hooks?",
    answer: "Only call hooks at the top level of React components or custom hooks. Do not call hooks inside loops, conditions, nested callbacks, or normal utility functions.",
  },
  {
    question: "Can Custom Hooks return JSX?",
    answer: "They can technically return anything, but custom hooks should usually return data and actions. Keep UI in components so logic and presentation stay separate.",
  },
  {
    question: "Difference between utility function and Custom Hook?",
    answer: "A utility function is plain JavaScript and cannot call React hooks. A custom hook can use useState, useEffect, useMemo, and other hooks to manage React behavior.",
  },
  {
    question: "How do Custom Hooks improve scalability?",
    answer: "They create clear reusable modules for business logic, such as carts, checkout, inventory, analytics, and search. Teams can improve one hook without rewriting every component.",
  },
  {
    question: "How would you design useCart for an ecommerce app?",
    answer: "I would return items, itemCount, cartTotal, addItem, removeItem, updateQuantity, loading or sync status, and clearCart. I would keep UI outside the hook and memoize expensive totals and stable actions.",
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

function MetricRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string | number;
  active?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg border border-white/10 bg-background/50 p-4", active && "border-primary/50 bg-primary/10")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <motion.span key={`${label}-${value}`} initial={{ scale: 0.84 }} animate={{ scale: 1 }} className="font-semibold text-primary">
        {value}
      </motion.span>
    </div>
  );
}

function ExamplePanel({ mode }: { mode: ExampleMode }) {
  const data = {
    loading: {
      title: "Simple Example: useLoading",
      icon: RefreshCcw,
      what: "useLoading keeps loading state and start/stop helpers in one place.",
      why: "Multiple components often repeat the same loading state. A hook removes that copy-paste.",
      when: "Use it when several flows need the same loading behavior.",
      avoid: "Do not create it for a single tiny component if it makes code harder to read.",
      enterprise: "Buttons, checkout submit, product import, and admin tools can share the same loading pattern.",
      before: `function ProductGrid() {
  const [loading, setLoading] = useState(false);
}

function CheckoutButton() {
  const [loading, setLoading] = useState(false);
}`,
      after: `function useLoading() {
  const [loading, setLoading] = useState(false);
  return {
    loading,
    start: () => setLoading(true),
    stop: () => setLoading(false),
  };
}`,
    },
    products: {
      title: "API Fetching Hook: useProducts",
      icon: Database,
      what: "useProducts returns loading, error, data, and refetch for product listing data.",
      why: "The component can focus on showing products instead of fetch mechanics.",
      when: "Use it for PLP data, filtered product lists, or admin catalog screens.",
      avoid: "Do not hide every cache rule inside one hook if the app needs a real server-state library.",
      enterprise: "A commerce PLP can reuse useProducts for category pages, search results, and merchandising previews.",
      before: `const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);`,
      after: `const { data, loading, error, refetch } = useProducts(categoryId);`,
    },
    cart: {
      title: "Cart Hook Example: useCart",
      icon: ShoppingCart,
      what: "useCart returns cart actions, cartTotal, and itemCount.",
      why: "Header, Mini Cart, Cart Page, and Checkout need the same cart logic.",
      when: "Use it when cart behavior must be reused across many commerce surfaces.",
      avoid: "Do not return every internal detail. Return only what screens need.",
      enterprise: "A shared cart hook keeps quantity updates and totals consistent across the shopping journey.",
      before: `// Each component repeats add, remove, totals, and count logic.`,
      after: `const {
  addItem,
  removeItem,
  updateQuantity,
  cartTotal,
  itemCount,
} = useCart();`,
    },
    checkout: {
      title: "Checkout Form Hook: useCheckoutForm",
      icon: FileCode2,
      what: "useCheckoutForm manages customer info, validation, touched fields, and submit.",
      why: "Checkout forms have many fields and rules. A hook keeps those rules together.",
      when: "Use it for multi-step checkout, profile forms, or enterprise account creation.",
      avoid: "Do not put visual layout or input JSX inside the hook.",
      enterprise: "Checkout sections can share validation while each section keeps its own UI.",
      before: `// Customer info, touched state, validation, and submit
// all live inside one large component.`,
      after: `const {
  values,
  errors,
  touched,
  setField,
  submit,
} = useCheckoutForm();`,
    },
    storage: {
      title: "Local Storage Hook: useLocalStorage",
      icon: PackageOpen,
      what: "useLocalStorage syncs a state value with browser localStorage.",
      why: "It helps persist cart drafts, theme, recently viewed products, and preferences.",
      when: "Use it for small client-only values that can survive refresh.",
      avoid: "Do not store secrets, payment data, or large server-owned records.",
      enterprise: "Recently viewed products can survive navigation without becoming global server state.",
      before: `const saved = localStorage.getItem("theme");
localStorage.setItem("theme", theme);`,
      after: `const [theme, setTheme] = useLocalStorage("theme", "dark");`,
    },
    debounce: {
      title: "Debounce Hook: useDebounce",
      icon: Search,
      what: "useDebounce waits until a value stops changing before returning it.",
      why: "It prevents search from firing on every keystroke.",
      when: "Use it for product search autocomplete, filters, and typeahead.",
      avoid: "Do not debounce actions that must happen immediately, like checkout submit.",
      enterprise: "A product search box can wait 300ms before requesting suggestions.",
      before: `// Calls search API on every key press.
searchProducts(query);`,
      after: `const debouncedQuery = useDebounce(query, 300);
const results = useProductSearch(debouncedQuery);`,
    },
  }[mode];
  const Icon = data.icon;

  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{data.title}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["What it is", data.what],
          ["Why we use it", data.why],
          ["When to use it", data.when],
          ["When not to use it", data.avoid],
          ["Enterprise example", data.enterprise],
          ["Interview explanation", "A custom hook hides reusable behavior behind a clear API so components stay focused on UI."],
        ].map(([label, text]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-background/50 p-4">
            <p className="text-xs font-semibold uppercase text-primary">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10">
          <div className="border-b border-white/10 px-4 py-3 font-code text-xs text-rose-100">Before</div>
          <pre className="overflow-auto p-4 text-xs leading-6 text-slate-200">
            <code>{data.before}</code>
          </pre>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10">
          <div className="border-b border-white/10 px-4 py-3 font-code text-xs text-emerald-100">After</div>
          <pre className="overflow-auto p-4 text-xs leading-6 text-slate-200">
            <code>{data.after}</code>
          </pre>
        </div>
      </div>
    </GlassPanel>
  );
}

export function ReactCustomHooksLesson() {
  const [mode, setMode] = useState<ExampleMode>("loading");
  const [hookCalls, setHookCalls] = useState(1);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const activeStep = Math.min(4, (hookCalls - 1) % 5);
  const reuseScore = useMemo(() => Math.min(96, 42 + hookCalls * 9), [hookCalls]);

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
              <h1 className="max-w-5xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                Custom <span className="gradient-text">Hooks</span>
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold">
                Learn how to extract reusable React logic into clean, scalable hooks.
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                A practical guide to building reusable business logic with custom hooks for forms, APIs, carts, checkout flows, and enterprise applications.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["Component", "Custom Hook", "State", "Data + Actions", "UI"]} active={activeStep} />
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

        <Tabs defaultValue="examples" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-5">
            {[
              ["examples", "Examples"],
              ["visualizer", "Visualizer"],
              ["enterprise", "Enterprise"],
              ["mistakes", "Rules"],
              ["quiz", "Quiz + Code"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-11 border border-white/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="examples" className="space-y-8">
            <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
              {[
                ["loading", "useLoading", RefreshCcw],
                ["products", "useProducts", Database],
                ["cart", "useCart", ShoppingCart],
                ["checkout", "useCheckoutForm", FileCode2],
                ["storage", "useLocalStorage", PackageOpen],
                ["debounce", "useDebounce", Search],
              ].map(([value, label, Icon]) => (
                <Button
                  key={value as string}
                  variant={mode === value ? "default" : "outline"}
                  onClick={() => setMode(value as ExampleMode)}
                  className="min-h-11 rounded-md border-white/10 px-2 text-xs"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label as string}
                </Button>
              ))}
            </div>
            <ExamplePanel mode={mode} />
          </TabsContent>

          <TabsContent value="visualizer" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Interactive Hook Flow</h2>
                    <p className="mt-2 text-sm text-muted-foreground">A component calls a hook. The hook owns logic and returns data plus actions.</p>
                  </div>
                  <Button onClick={() => setHookCalls((value) => value + 1)} className="rounded-full font-semibold">
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Call Hook
                  </Button>
                </div>
                <FlowRail steps={["Component", "Calls Custom Hook", "Hook Manages State", "Returns Data + Actions", "Component Renders UI"]} active={activeStep} />
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Hook Health</h3>
                <div className="space-y-3">
                  <MetricRow label="Hook calls" value={hookCalls} active />
                  <MetricRow label="Components using logic" value={Math.min(7, hookCalls + 1)} active />
                  <MetricRow label="Duplicate blocks removed" value={Math.min(12, hookCalls * 2)} active />
                  <MetricRow label="Reusable actions" value={mode === "cart" ? 4 : 3} active />
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reuse score</span>
                    <span className="font-semibold text-primary">{reuseScore}%</span>
                  </div>
                  <Progress value={reuseScore} />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Separation of UI and Logic</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <Component className="mb-3 h-6 w-6 text-primary" />
                  <p className="font-semibold">Component</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Renders markup, layout, buttons, forms, and user-facing UI.</p>
                </div>
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <GitBranch className="mb-3 h-6 w-6 text-emerald-100" />
                  <p className="font-semibold">Custom Hook</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Owns state, effects, validation, storage, and reusable actions.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-background/50 p-5">
                  <ToggleLeft className="mb-3 h-6 w-6 text-primary" />
                  <p className="font-semibold">Returned API</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Returns the smallest useful set of data and functions.</p>
                </div>
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {enterpriseHooks.map(([name, usedIn, reason]) => (
                <GlassPanel key={name} className="p-6">
                  <ShoppingCart className="mb-4 h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">{name}</h2>
                  <div className="mt-4 rounded-lg border border-white/10 bg-background/50 p-4">
                    <p className="text-xs font-semibold uppercase text-primary">Where used</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{usedIn}</p>
                  </div>
                  <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs font-semibold uppercase text-emerald-100">Why</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{reason}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mistakes" className="space-y-8">
            <GlassPanel className="p-6">
              <h2 className="mb-5 text-3xl font-bold">Hook Rules</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  "Hooks must start with use",
                  "Hooks must run at top level",
                  "Do not call hooks inside loops",
                  "Do not call hooks inside conditions",
                  "Do not call hooks inside normal functions",
                ].map((rule) => (
                  <div key={rule} className="rounded-lg border border-white/10 bg-background/50 p-4 text-sm font-semibold">
                    <Zap className="mb-3 h-5 w-5 text-primary" />
                    {rule}
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-3xl font-bold">Common Mistakes</h2>
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
            <Boxes className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Final Checklist</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Extract repeated stateful logic",
              "Keep UI outside hooks",
              "Keep hooks focused",
              "Use clear names",
              "Return only what the component needs",
              "Add cleanup when using effects",
              "Test important hooks",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-background/45 p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
