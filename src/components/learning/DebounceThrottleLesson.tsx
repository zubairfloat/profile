"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Check,
  Clipboard,
  Code2,
  Gauge,
  MousePointer2,
  Search,
  ShoppingCart,
  TimerReset,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const codeExamples = [
  {
    title: "Basic debounce implementation",
    description: "Runs once after the user stops triggering the event.",
    code: `function debounce(fn, delay = 500) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
  },
  {
    title: "Advanced debounce implementation",
    description: "Adds leading, cancel, and flush behavior for production interfaces.",
    code: `function debounce(fn, delay = 500, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let result;
  const leading = Boolean(options.leading);

  function invoke() {
    result = fn.apply(lastThis, lastArgs);
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function debounced(...args) {
    const shouldCallNow = leading && !timeoutId;
    lastArgs = args;
    lastThis = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (!leading) invoke();
    }, delay);

    if (shouldCallNow) return invoke();
    return result;
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  debounced.flush = () => {
    if (!timeoutId) return result;
    clearTimeout(timeoutId);
    timeoutId = undefined;
    return invoke();
  };

  return debounced;
}`,
  },
  {
    title: "Basic throttle implementation",
    description: "Runs at most once per interval while events continue firing.",
    code: `function throttle(fn, interval = 500) {
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastRun >= interval) {
      lastRun = now;
      fn.apply(this, args);
    }
  };
}`,
  },
  {
    title: "Advanced throttle implementation",
    description: "Supports leading and trailing calls so the final event is not lost.",
    code: `function throttle(fn, interval = 500, options = {}) {
  let lastRun = 0;
  let timeoutId;
  let lastArgs;
  let lastThis;
  const leading = options.leading !== false;
  const trailing = options.trailing !== false;

  function invoke(time) {
    lastRun = time;
    timeoutId = undefined;
    fn.apply(lastThis, lastArgs);
    lastArgs = undefined;
    lastThis = undefined;
  }

  return function throttled(...args) {
    const now = Date.now();
    if (!lastRun && !leading) lastRun = now;

    const remaining = interval - (now - lastRun);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > interval) {
      if (timeoutId) clearTimeout(timeoutId);
      invoke(now);
      return;
    }

    if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => invoke(Date.now()), remaining);
    }
  };
}`,
  },
];

const interviewQuestions = [
  {
    question: "What is the difference between debounce and throttle?",
    answer:
      "Debounce waits for a quiet period and then runs once with the final event. Throttle runs at a fixed maximum frequency while events keep happening. Debounce is about final intent; throttle is about steady, controlled updates.",
  },
  {
    question: "When should debounce be used?",
    answer:
      "Use debounce when intermediate events are noise and only the final value matters. Search autocomplete, product search, address lookup, autosave, and expensive validation are common examples.",
  },
  {
    question: "When should throttle be used?",
    answer:
      "Use throttle when the UI or analytics system needs periodic updates during continuous activity. Infinite scroll, resize handling, mouse tracking, scroll-depth analytics, and checkout telemetry are good fits.",
  },
  {
    question: "Can debounce be implemented using throttle?",
    answer:
      "You can approximate pieces of one with the other, but they solve different timing contracts. A trailing-only throttle may look debounce-like in some cases, yet debounce resets the entire wait window after every event, while throttle preserves a fixed execution cadence.",
  },
];

function MetricCard({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  tone?: "primary" | "accent" | "muted";
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/45 p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mt-2 text-3xl font-headline font-bold",
          tone === "primary" && "text-primary",
          tone === "accent" && "text-accent",
          tone === "muted" && "text-foreground"
        )}
      >
        {value}
      </motion.p>
    </div>
  );
}

function DebounceDemo() {
  const [query, setQuery] = useState("");
  const [keystrokes, setKeystrokes] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [pending, setPending] = useState(false);
  const [lastQuery, setLastQuery] = useState("No request yet");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setKeystrokes((count) => count + 1);
    setPending(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setApiCalls((count) => count + 1);
        setLastQuery(value);
      }
      setPending(false);
    }, 500);
  }

  const savedRequests = Math.max(keystrokes - apiCalls, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-5 w-5 text-primary" />
            Search input debounce
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            value={query}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="Type h, he, hel, hell, hello..."
            className="h-12 border-white/10 bg-background/60 text-base"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Keystrokes Count" value={keystrokes} />
            <MetricCard label="API Calls Count" value={apiCalls} tone="accent" />
            <MetricCard label="Saved Requests" value={savedRequests} tone="primary" />
            <MetricCard label="Pause Behavior" value="500ms" tone="muted" />
          </div>
          <div className="rounded-lg border border-white/10 bg-background/45 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">API executes only after typing stops</p>
              <Badge className={cn("bg-secondary text-secondary-foreground", pending && "bg-primary text-primary-foreground")}>
                {pending ? "Waiting..." : "Settled"}
              </Badge>
            </div>
            <p className="mt-3 font-code text-sm text-foreground">GET /api/products?q={lastQuery}</p>
          </div>
        </CardContent>
      </Card>

      <Timeline
        title="Debounce visual timeline"
        description="Each keypress resets the timer. The function executes once after the final pause."
        steps={["User Types", "User Types", "User Types", "Waiting...", "Execute Once"]}
        activeIndexes={[4]}
      />
    </div>
  );
}

function ThrottleDemo() {
  const [events, setEvents] = useState(0);
  const [executions, setExecutions] = useState(0);
  const [mode, setMode] = useState("Scroll Event Simulation");
  const [isRunning, setIsRunning] = useState(false);
  const lastRunRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      setEvents((count) => count + 1);

      if (now - lastRunRef.current >= 500) {
        lastRunRef.current = now;
        setExecutions((count) => count + 1);
      }
    }, 80);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const ignored = Math.max(events - executions, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MousePointer2 className="h-5 w-5 text-primary" />
            {mode}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {["Scroll Event Simulation", "Resize Event Simulation", "Mouse Move Simulation"].map((item) => (
              <Button
                key={item}
                variant={mode === item ? "default" : "outline"}
                onClick={() => setMode(item)}
                className="rounded-full border-white/10"
              >
                {item.replace(" Event Simulation", "")}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setIsRunning((value) => !value)} className="rounded-full">
              {isRunning ? "Pause Simulation" : "Start Simulation"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEvents(0);
                setExecutions(0);
                lastRunRef.current = 0;
              }}
              className="rounded-full border-white/10"
            >
              Reset
            </Button>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              Executes once every fixed 500ms interval
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Events Fired" value={events} />
            <MetricCard label="Events Ignored" value={ignored} tone="primary" />
            <MetricCard label="Executions" value={executions} tone="accent" />
            <MetricCard label="Execution Frequency" value="2/sec" tone="muted" />
          </div>
          <div className="relative h-24 overflow-hidden rounded-lg border border-white/10 bg-background/45">
            <motion.div
              animate={{ x: isRunning ? ["0%", "92%", "0%"] : "0%" }}
              transition={{ duration: 2.4, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }}
              className="absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Activity className="h-5 w-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Timeline
        title="Throttle visual timeline"
        description="The first event executes, noisy events are ignored, and execution resumes on the next interval."
        steps={["Execute", "Ignore", "Ignore", "Execute", "Ignore", "Execute"]}
        activeIndexes={[0, 3, 5]}
      />
    </div>
  );
}

function Timeline({
  title,
  description,
  steps,
  activeIndexes,
}: {
  title: string;
  description: string;
  steps: string[];
  activeIndexes: number[];
}) {
  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TimerReset className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-8 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-px bg-white/10" />
          <div className="relative grid gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step, index) => {
              const active = activeIndexes.includes(index);
              return (
                <motion.div
                  key={`${step}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="text-center"
                >
                  <div
                    className={cn(
                      "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/10 bg-background text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <p className="font-code text-[10px] uppercase text-muted-foreground md:text-xs">
                    {step}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CodeBlock({ example }: { example: (typeof codeExamples)[number] }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-xl">{example.title}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{example.description}</p>
        </div>
        <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 border-white/10">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
          <code>{example.code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export function DebounceThrottleLesson() {
  const overview = useMemo(
    () => [
      {
        icon: Search,
        title: "What is Debouncing?",
        text: "Debouncing delays execution until events stop for a configured pause. It is ideal when only the user's final intent matters.",
      },
      {
        icon: Gauge,
        title: "What is Throttling?",
        text: "Throttling limits execution frequency while events continue firing. It keeps expensive work predictable during continuous activity.",
      },
      {
        icon: Zap,
        title: "When should each be used?",
        text: "Use debounce for search, product lookup, address lookup, and API requests. Use throttle for infinite scroll, resize, mouse tracking, and analytics events.",
      },
    ],
    []
  );

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
            JavaScript Performance
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
            Debouncing vs <span className="gradient-text">Throttling</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Two of the most important JavaScript performance optimization techniques.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {overview.map((item) => (
            <Card key={item.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-headline font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="debounce" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-lg border border-white/10 bg-background/60 p-1 md:w-[420px]">
            <TabsTrigger value="debounce" className="rounded-md">Debouncing</TabsTrigger>
            <TabsTrigger value="throttle" className="rounded-md">Throttling</TabsTrigger>
          </TabsList>
          <TabsContent value="debounce">
            <DebounceDemo />
          </TabsContent>
          <TabsContent value="throttle">
            <ThrottleDemo />
          </TabsContent>
        </Tabs>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
            <Code2 className="mr-2 h-3.5 w-3.5" />
            Code Examples
          </Badge>
          <h2 className="text-4xl font-headline">Copy-ready implementations</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {codeExamples.map((example) => (
            <CodeBlock key={example.title} example={example} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="h-6 w-6 text-primary" />
                Real World Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                "Debouncing: Search Autocomplete",
                "Debouncing: Product Search",
                "Debouncing: Address Lookup",
                "Debouncing: API Requests",
                "Throttling: Infinite Scroll",
                "Throttling: Window Resize",
                "Throttling: Mouse Tracking",
                "Throttling: Analytics Events",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-background/40 p-4 text-sm leading-6 text-muted-foreground">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Enterprise eCommerce Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["Product Search", "Apply debounce so catalog search, suggestions, pricing, and inventory requests wait for the shopper's final query."],
                ["Scroll Tracking", "Apply throttle so product listing engagement is measured without flooding analytics pipelines."],
                ["Checkout Analytics", "Apply throttle so shipping, payment, and validation events stay observable without slowing checkout."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-background/40 p-5">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 pt-10">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
            Common Interview Questions
          </Badge>
          <h2 className="text-4xl font-headline">Questions with detailed answers</h2>
        </div>
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
    </div>
  );
}
