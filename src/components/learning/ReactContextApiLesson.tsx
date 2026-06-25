"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clipboard,
  Database,
  Lock,
  MessageSquareWarning,
  Moon,
  MousePointerClick,
  Network,
  PackageOpen,
  RefreshCcw,
  Route,
  Scale,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Table2,
  Timer,
  User,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type VisualMode = "without" | "with";
type PlaygroundTheme = "dark" | "light";

const conceptCards = [
  {
    title: "What is Context API?",
    description: "Context lets components share data without passing props through every level.",
    icon: Share2,
    flow: ["App", "Context Provider", "Any Child"],
  },
  {
    title: "Why Context API?",
    description: "It removes prop drilling for shared values like user, theme, language, and cart summary.",
    icon: Network,
    flow: ["Provider", "Shared value", "Direct read"],
  },
  {
    title: "When Should You Use Context?",
    description: "Use it for values many components need but do not change every keystroke.",
    icon: ShieldCheck,
    flow: ["Theme", "Auth", "Settings"],
  },
  {
    title: "When NOT to Use Context?",
    description: "Do not use Context for small local state like one input, one modal, or one component toggle.",
    icon: MessageSquareWarning,
    flow: ["Input state", "Modal open", "Local UI"],
  },
];

const codeExamples = [
  {
    title: "Create Context",
    code: `const ThemeContext = createContext(null);`,
  },
  {
    title: "Create Provider",
    code: `function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}`,
  },
  {
    title: "useContext",
    code: `function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>{theme}</button>;
}`,
  },
  {
    title: "Theme Context",
    code: `const ThemeContext = createContext("dark");

function Footer() {
  const theme = useContext(ThemeContext);
  return <footer data-theme={theme} />;
}`,
  },
  {
    title: "Auth Context",
    code: `function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((profile) => setUser(profile), []);
  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}`,
  },
  {
    title: "Cart Context",
    code: `function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, cartTotal, setItems }}>
      {children}
    </CartContext.Provider>
  );
}`,
  },
  {
    title: "Context + useReducer",
    code: `function cartReducer(state, action) {
  switch (action.type) {
    case "addItem":
      return { ...state, items: addOrIncrease(state.items, action.item) };
    case "removeItem":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    default:
      return state;
  }
}`,
  },
  {
    title: "Split Context Architecture",
    code: `<AuthProvider>
  <ThemeProvider>
    <LanguageProvider>
      <CartProvider>{children}</CartProvider>
    </LanguageProvider>
  </ThemeProvider>
</AuthProvider>`,
  },
];

const mistakes = [
  ["Putting everything into one Context", "Split Auth, Cart, Theme, and Language into focused providers."],
  ["Using Context for every state", "Keep form inputs, modal open state, and local UI state inside components."],
  ["Large Context objects", "Return only the values consumers really need."],
  ["Creating Provider inside component", "Place providers high enough and keep their identity stable."],
  ["Passing new object every render", "Memoize provider values when needed."],
  ["Ignoring memoization", "Use useMemo and useCallback for provider values that change often."],
];

const interviewQuestions = [
  {
    question: "What is Context API?",
    answer: "Context API is React's built-in way to share a value with many components without manually passing props through every level.",
  },
  {
    question: "Why was Context API introduced?",
    answer: "It was introduced to solve prop drilling for shared app values such as theme, auth user, language, and settings.",
  },
  {
    question: "What is Prop Drilling?",
    answer: "Prop drilling means passing a prop through many intermediate components that do not use it, only so a deep child can receive it.",
  },
  {
    question: "Difference between Context and Redux?",
    answer: "Context shares values through the component tree. Redux Toolkit is a full state management solution with actions, reducers, dev tools, middleware, and stronger patterns for complex global business state.",
  },
  {
    question: "Can Context replace Redux?",
    answer: "Sometimes for simple shared state. It should not replace Redux Toolkit for very complex enterprise state, audit-heavy workflows, or state that needs advanced debugging.",
  },
  {
    question: "What causes Context re-renders?",
    answer: "When a provider value changes, components that consume that context can re-render.",
  },
  {
    question: "How do you optimize Context performance?",
    answer: "Split contexts, memoize provider values, keep state close to where it is used, and avoid putting high-frequency values into broad providers.",
  },
  {
    question: "When should Context NOT be used?",
    answer: "Avoid Context for local component state, form field state, one modal toggle, or values that update on every keystroke.",
  },
  {
    question: "Why split Contexts?",
    answer: "Split contexts reduce the number of subscribers affected by each update. A theme change should not re-render cart-only consumers.",
  },
];

const timeline = [
  {
    year: "2013",
    title: "React Released",
    createdBy: "Facebook, now Meta",
    problem: "Traditional MVC frameworks became difficult to maintain.",
    introduced: ["Component architecture", "One-way data flow", "Virtual DOM"],
    tradeoff: "Local state was enough for small applications.",
  },
  {
    year: "2014",
    title: "Flux Architecture",
    createdBy: "Facebook",
    problem: "Large apps had data flowing in many directions.",
    introduced: ["Action", "Dispatcher", "Store", "View"],
    tradeoff: "Predictable flow, but too much boilerplate for small apps.",
  },
  {
    year: "2015",
    title: "Redux",
    createdBy: "Dan Abramov and Andrew Clark",
    problem: "Apps needed predictable global state management.",
    introduced: ["Single store", "Actions", "Reducers", "Immutable state"],
    tradeoff: "Great DevTools and enterprise patterns, but verbose.",
  },
  {
    year: "2016",
    title: "MobX",
    createdBy: "Michel Weststrate",
    problem: "Redux required too much boilerplate.",
    introduced: ["Observable state", "Automatic tracking", "Reactive updates"],
    tradeoff: "Very little code, but less predictable in very large apps.",
  },
  {
    year: "2018",
    title: "React Context API",
    createdBy: "React Team",
    problem: "Developers needed simple shared state like theme, auth, and language.",
    introduced: ["Provider", "Consumer", "useContext", "No prop drilling"],
    tradeoff: "Built in and simple, but consumers re-render when values change.",
  },
  {
    year: "2019",
    title: "Redux Toolkit",
    createdBy: "Redux Team",
    problem: "Classic Redux was too verbose.",
    introduced: ["Less boilerplate", "Immer", "Better defaults", "Slices"],
    tradeoff: "Modern Redux standard for enterprise apps.",
  },
  {
    year: "2020",
    title: "Zustand",
    createdBy: "Poimandres Team",
    problem: "Developers wanted Redux simplicity without Redux complexity.",
    introduced: ["Tiny API", "Minimal boilerplate", "Selectors", "Great performance"],
    tradeoff: "Popular for Next.js and modern React projects.",
  },
  {
    year: "2021+",
    title: "Jotai, Recoil, Valtio",
    createdBy: "React ecosystem",
    problem: "Some apps needed smaller atom-based pieces of state.",
    introduced: ["Atoms", "Fine-grained updates", "Reactive graphs"],
    tradeoff: "Useful for complex shared state with isolated updates.",
  },
];

const libraryRows = [
  ["React Context API", "React Team", "2018", "Low", "Good for stable values", "Easy", "Medium", "Theme, auth, language"],
  ["Redux Toolkit", "Redux Team", "2019", "Medium", "Strong", "Medium", "High", "Large enterprise state"],
  ["Zustand", "Poimandres", "2020", "Low", "Strong", "Easy", "High", "Lightweight global state"],
  ["MobX", "Michel Weststrate", "2016", "Low", "Strong", "Easy", "Medium", "Highly reactive apps"],
  ["Jotai", "Poimandres", "2021+", "Low", "Strong", "Medium", "Medium", "Atom-based state"],
  ["Recoil", "Meta", "2021+", "Medium", "Good", "Medium", "Medium", "Graph-like shared state"],
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

function MetricCard({
  label,
  value,
  active,
}: {
  label: string;
  value: string | number;
  active?: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-white/10 bg-background/50 p-4", active && "border-primary/50 bg-primary/10")}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <motion.p key={`${label}-${value}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-2xl font-bold text-primary">
        {value}
      </motion.p>
    </div>
  );
}

function IconCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-5">
      <Icon className="mb-3 h-6 w-6 text-primary" />
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

export function ReactContextApiLesson() {
  const [visualMode, setVisualMode] = useState<VisualMode>("without");
  const [theme, setTheme] = useState<PlaygroundTheme>("dark");
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState(2);
  const [step, setStep] = useState(0);
  const [expandedCode, setExpandedCode] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const rerenderCount = visualMode === "without" ? 5 : 2;
  const playgroundScore = useMemo(() => Math.min(98, 48 + cartItems * 7 + (loggedIn ? 15 : 0) + (theme === "light" ? 8 : 0)), [cartItems, loggedIn, theme]);

  const copyCode = async (index: number) => {
    await navigator.clipboard.writeText(codeExamples[index].code);
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(133,118,237,0.15),transparent_34%)]" />

      <div className="container mx-auto px-4 pb-20 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Share2 className="mr-2 h-3.5 w-3.5" />
            React State Sharing
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                Context <span className="gradient-text">API</span>
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold">
                Share data across your React application without prop drilling.
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Learn how Context API helps manage shared application state like authentication, themes, shopping carts, and user preferences while understanding its performance implications.
              </p>
            </div>
            <GlassPanel className="p-5">
              <FlowRail steps={["App", "Provider", "Value", "Consumer", "UI"]} active={step % 5} />
            </GlassPanel>
          </div>
        </motion.section>

        <section className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {conceptCards.map((concept, index) => {
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
                    {concept.flow.map((item) => (
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
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2 lg:grid-cols-6">
            {[
              ["visualizer", "Visualizer"],
              ["demos", "Demos"],
              ["performance", "Performance"],
              ["history", "History"],
              ["compare", "Compare"],
              ["quiz", "Code + Interview"],
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
                    <h2 className="text-3xl font-bold">Prop Drilling Visualizer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">See how Context removes props from intermediate components.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={visualMode === "without" ? "default" : "outline"} onClick={() => setVisualMode("without")} className="rounded-full border-white/10">
                      Without Context
                    </Button>
                    <Button variant={visualMode === "with" ? "default" : "outline"} onClick={() => setVisualMode("with")} className="rounded-full border-white/10">
                      With Context
                    </Button>
                  </div>
                </div>
                <FlowRail
                  steps={visualMode === "without" ? ["App", "Header", "Layout", "Sidebar", "UserCard"] : ["Provider", "UserCard"]}
                  active={visualMode === "without" ? 4 : 1}
                />
                <div className="mt-6 grid gap-3 md:grid-cols-5">
                  {(visualMode === "without" ? ["App prop", "Header prop", "Layout prop", "Sidebar prop", "UserCard reads"] : ["Provider owns", "UserCard reads"]).map((item) => (
                    <div key={item} className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center text-sm font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Create Context Steps</h3>
                <FlowRail steps={["Create Context", "Create Provider", "Wrap Application", "Consume Context", "Update UI"]} active={step % 5} />
                <Button onClick={() => setStep((value) => value + 1)} className="mt-5 w-full rounded-full">
                  <MousePointerClick className="mr-2 h-4 w-4" />
                  Animate Step
                </Button>
              </GlassPanel>
            </div>
          </TabsContent>

          <TabsContent value="demos" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Theme Context Demo</h2>
                    <p className="mt-1 text-sm text-muted-foreground">ThemeProvider updates Navbar, Sidebar, and Footer.</p>
                  </div>
                  <Button onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} className="rounded-full">
                    {theme === "dark" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    {theme}
                  </Button>
                </div>
                <div className="space-y-3">
                  {["ThemeProvider", "Navbar", "Sidebar", "Footer"].map((item) => (
                    <MetricCard key={item} label={item} value={theme} active />
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Authentication Context Demo</h2>
                    <p className="mt-1 text-sm text-muted-foreground">AuthContext stores user, login, and logout.</p>
                  </div>
                  <Button onClick={() => setLoggedIn((value) => !value)} className="rounded-full">
                    <Lock className="mr-2 h-4 w-4" />
                    {loggedIn ? "Logout" : "Login"}
                  </Button>
                </div>
                <FlowRail steps={loggedIn ? ["Guest", "Login", "Authenticated User", "Logout"] : ["Guest", "Login", "Authenticated User", "Logout"]} active={loggedIn ? 2 : 0} />
                <p className="mt-5 rounded-lg border border-white/10 bg-background/50 p-4 text-sm text-muted-foreground">
                  Current user: <span className="font-semibold text-primary">{loggedIn ? "Authenticated Customer" : "Guest"}</span>
                </p>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Shopping Cart Context Playground</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Header, Mini Cart, Cart Page, and Checkout read cart context.</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setCartItems((value) => value + 1)} className="rounded-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => setCartItems((value) => Math.max(0, value - 1))} className="rounded-full border-white/10">
                    Remove
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {["Header", "Mini Cart", "Cart Page", "Checkout"].map((item) => (
                  <MetricCard key={item} label={item} value={`${cartItems} items`} active />
                ))}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-5">
                <MetricCard label="Cart Items" value={cartItems} active />
                <MetricCard label="Item Count" value={cartItems} active />
                <MetricCard label="Cart Total" value={`$${cartItems * 49}`} active />
                <MetricCard label="Coupons" value={cartItems > 2 ? "SAVE10" : "none"} active={cartItems > 2} />
                <MetricCard label="Delivery" value={cartItems > 0 ? "standard" : "none"} active={cartItems > 0} />
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <GlassPanel className="p-6">
                <h2 className="mb-5 text-3xl font-bold">Context Performance Visualizer</h2>
                <p className="mb-5 text-sm leading-7 text-muted-foreground">
                  When a context value changes, all subscribed components can re-render. Split contexts so unrelated consumers stay quiet.
                </p>
                <div className="grid gap-3 md:grid-cols-4">
                  {["Header", "Sidebar", "Profile", "Cart"].map((item, index) => (
                    <MetricCard key={item} label={item} value={`${visualMode === "without" ? cartItems + index + 1 : index < 2 ? cartItems + 1 : 1} renders`} active={visualMode === "without" || index < 2} />
                  ))}
                </div>
              </GlassPanel>
              <GlassPanel className="p-6">
                <h3 className="mb-5 text-2xl font-bold">Split Context Result</h3>
                <MetricCard label="One AppContext" value={`${rerenderCount} consumers`} active={visualMode === "without"} />
                <div className="mt-3">
                  <MetricCard label="Split Contexts" value="2 consumers" active={visualMode === "with"} />
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Playground health</span>
                    <span className="font-semibold text-primary">{playgroundScore}%</span>
                  </div>
                  <Progress value={playgroundScore} />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Context + useReducer</h2>
              <FlowRail steps={["Dispatch", "Reducer", "State Update", "Provider", "Components Update"]} active={step % 5} />
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-4">
              <IconCard icon={ShoppingCart} title="Shopping Cart" text="Items, coupons, totals, and delivery method." />
              <IconCard icon={User} title="Authentication" text="Customer, addresses, and membership." />
              <IconCard icon={PackageOpen} title="Checkout" text="Shipping, billing, delivery, and payment." />
              <IconCard icon={Moon} title="Theme" text="Dark, light, and high contrast mode." />
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Common Mistakes</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {mistakes.map(([title, fix]) => (
                  <div key={title} className="rounded-lg border border-white/10 bg-background/50 p-4">
                    <MessageSquareWarning className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{fix}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <GlassPanel className="p-6">
              <h2 className="mb-6 text-3xl font-bold">History of React State Management</h2>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={`${item.year}-${item.title}`}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-lg border border-white/10 bg-background/50 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <Badge className="mb-3 bg-primary/20 text-primary">{item.year}</Badge>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Created by: {item.createdBy}</p>
                      </div>
                      <Timer className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.problem}</p>
                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      {item.introduced.map((entry) => (
                        <div key={entry} className="rounded-md border border-white/10 bg-card/45 px-3 py-2 text-xs font-semibold">
                          {entry}
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.tradeoff}</p>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="compare" className="space-y-8">
            <GlassPanel className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <Table2 className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Context vs Redux Toolkit vs Zustand</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-separate border-spacing-y-2 text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      {["Tool", "Learning Curve", "Performance", "Boilerplate", "Best For", "Enterprise Apps", "When to Use"].map((head) => (
                        <th key={head} className="px-3 py-2 font-semibold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Context API", "Easy", "Good for stable values", "Low", "Theme, auth, language", "Medium", "Simple shared state"],
                      ["Redux Toolkit", "Medium", "Strong", "Medium", "Large business state", "High", "Complex enterprise workflows"],
                      ["Zustand", "Easy", "Strong", "Low", "Light global state", "High", "Modern app state with less ceremony"],
                    ].map((row) => (
                      <tr key={row[0]} className="bg-background/50">
                        {row.map((cell) => (
                          <td key={cell} className="border-y border-white/10 px-3 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Today's Recommendation</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      {["Library", "Created By", "Year", "Boilerplate", "Performance", "Learning Curve", "Enterprise Ready", "Best Use Cases"].map((head) => (
                        <th key={head} className="px-3 py-2 font-semibold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {libraryRows.map((row) => (
                      <tr key={row[0]} className="bg-background/50">
                        {row.map((cell) => (
                          <td key={cell} className="border-y border-white/10 px-3 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>

            <div className="grid gap-4 md:grid-cols-3">
              <IconCard icon={Moon} title="Only theme or auth?" text="Use Context API." />
              <IconCard icon={ShoppingCart} title="Shopping cart?" text="Use Context API or Zustand." />
              <IconCard icon={Scale} title="Large enterprise dashboard?" text="Use Redux Toolkit." />
              <IconCard icon={Zap} title="Medium React app?" text="Use Zustand." />
              <IconCard icon={RefreshCcw} title="Highly reactive app?" text="Use MobX." />
              <IconCard icon={Database} title="Server data?" text="Use TanStack Query with local React state." />
            </div>

            <GlassPanel className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Enterprise Commerce Stack</h2>
              <FlowRail steps={["Theme: Context", "Auth: Context", "Cart: Zustand", "Server State: TanStack Query", "Forms: React Hook Form"]} active={4} />
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                There is no single best state tool. Modern enterprise apps usually combine tools based on the problem: local state for local UI, Context for shared UI state, Redux Toolkit for complex business state, Zustand for lightweight global state, TanStack Query for server data, and React Hook Form for forms.
              </p>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
              <GlassPanel className="p-6">
                <h2 className="mb-6 text-3xl font-bold">Code Examples</h2>
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
                  <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-6 text-slate-200">
                    <code>{codeExamples[expandedCode].code}</code>
                  </pre>
                </div>
              </GlassPanel>

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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
