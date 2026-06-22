"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BookOpenCheck,
  Boxes,
  Check,
  Clipboard,
  Code2,
  Database,
  EyeOff,
  KeyRound,
  Layers3,
  Lock,
  MemoryStick,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const closureCode = `function outer() {
  let count = 0;

  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();

counter();
counter();
counter();`;

const bankCode = `function createBankAccount() {
  let balance = 1000;

  return {
    deposit(amount) {
      balance += amount;
    },
    getBalance() {
      return balance;
    }
  };
}`;

const codeExamples = [
  {
    title: "Basic Closure",
    code: `function outer() {
  const message = "Hello from outer";

  return function inner() {
    return message;
  };
}

const readMessage = outer();
readMessage();`,
  },
  {
    title: "Counter Closure",
    code: `function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2`,
  },
  {
    title: "Private Variables",
    code: `function createUserSession(token) {
  let authToken = token;

  return {
    refresh(nextToken) {
      authToken = nextToken;
    },
    getAuthHeader() {
      return \`Bearer \${authToken}\`;
    },
  };
}`,
  },
  {
    title: "Memoization Closure",
    code: `function memoize(fn) {
  const cache = new Map();

  return function memoized(input) {
    if (cache.has(input)) return cache.get(input);

    const result = fn(input);
    cache.set(input, result);
    return result;
  };
}`,
  },
  {
    title: "Advanced Factory Function",
    code: `function createApiClient(baseUrl) {
  const headers = new Map();

  return {
    setHeader(key, value) {
      headers.set(key, value);
    },
    get(path) {
      return fetch(\`\${baseUrl}\${path}\`, {
        headers: Object.fromEntries(headers),
      });
    },
  };
}`,
  },
];

const realWorldExamples = [
  {
    title: "React Hooks",
    icon: Boxes,
    text: "Hooks rely on closures so callbacks and effects can remember values from the render where they were created.",
  },
  {
    title: "Event Handlers",
    icon: Workflow,
    text: "Click handlers remember variables from setup time, even when the user clicks much later.",
  },
  {
    title: "API Request Caching",
    icon: Database,
    text: "A cache map can live in a closure so callers reuse data without exposing the cache directly.",
  },
  {
    title: "Shopping Cart State",
    icon: ShoppingCart,
    text: "Cart items can be protected in a closure while public methods add, remove, and total items.",
  },
  {
    title: "Authentication Tokens",
    icon: KeyRound,
    text: "Token managers can hide sensitive values and expose only safe methods for headers or refresh flows.",
  },
];

const commerceExamples = [
  {
    title: "Cart Management",
    code: `function createCart() {
  let items = [];
}`,
    state: "items[] stays private while add/remove methods control mutation.",
  },
  {
    title: "Coupon State",
    code: `function createCouponManager() {
  let activeCoupons = [];
}`,
    state: "activeCoupons[] persists across checkout steps without becoming global state.",
  },
  {
    title: "Checkout Session",
    code: `function createCheckoutSession() {
  let checkoutData = {};
}`,
    state: "checkoutData can be encapsulated behind validation and submit methods.",
  },
];

const quizQuestions = [
  {
    question: "What is a Closure?",
    options: [
      "A function that remembers variables from its outer lexical scope.",
      "A variable declared with const.",
      "A browser rendering phase.",
      "A Promise callback queue.",
    ],
    correct: "A function that remembers variables from its outer lexical scope.",
    explanation: "A closure forms when an inner function keeps access to variables from the scope where it was created.",
  },
  {
    question: "Why does count persist?",
    options: [
      "Because count is global.",
      "Because inner() closes over outer()'s lexical environment.",
      "Because JavaScript copies count into localStorage.",
      "Because return statements freeze variables.",
    ],
    correct: "Because inner() closes over outer()'s lexical environment.",
    explanation: "outer() has finished, but the returned inner() function still references its environment.",
  },
  {
    question: "Can closures cause memory leaks?",
    options: [
      "Yes, if long-lived closures keep references to large or unused objects.",
      "No, closures are always garbage collected immediately.",
      "Only in CSS animations.",
      "Only when using TypeScript.",
    ],
    correct: "Yes, if long-lived closures keep references to large or unused objects.",
    explanation: "Closures are powerful, but retained references can prevent garbage collection.",
  },
  {
    question: "How do React hooks use closures?",
    options: [
      "They let callbacks and effects capture values from a render.",
      "They disable lexical scope.",
      "They convert functions into classes.",
      "They run outside JavaScript.",
    ],
    correct: "They let callbacks and effects capture values from a render.",
    explanation: "Hooks and callbacks often close over props and state from the render that created them.",
  },
];

const interviewQuestions = [
  {
    question: "What is Closure?",
    answer:
      "A closure is created when a function keeps access to variables from its outer lexical scope after that outer function has finished executing. The function carries its surrounding environment with it.",
  },
  {
    question: "What is Lexical Scope?",
    answer:
      "Lexical scope means variable access is determined by where functions are written in the source code. Inner functions can read variables from parent scopes because of their placement in the code.",
  },
  {
    question: "How do Closures work?",
    answer:
      "When an inner function references outer variables, JavaScript preserves the referenced lexical environment. If the inner function is returned or stored, that environment remains alive for future calls.",
  },
  {
    question: "Can Closures cause memory leaks?",
    answer:
      "Yes. If a closure is kept alive by an event listener, cache, timer, or global reference, anything it references may stay in memory. Clean up listeners and avoid capturing large unused objects.",
  },
  {
    question: "How are Closures used in React?",
    answer:
      "React callbacks, effects, memoized functions, and custom hooks all use closures. They capture props, state, and helper functions from the render where they were created, which is why dependency arrays matter.",
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
  icon?: typeof Sparkles;
}) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        {Icon ? <Icon className="mr-2 h-3.5 w-3.5" /> : null}
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline tracking-normal">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function CodePanel({ code, activeLine }: { code: string; activeLine?: number }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      {code.split("\n").map((line, index) => {
        const lineNumber = index + 1;
        return (
          <div
            key={`${lineNumber}-${line}`}
            className={cn(
              "-mx-2 grid grid-cols-[2rem_1fr] rounded px-2",
              lineNumber === activeLine && "bg-primary/15 text-foreground"
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
  const cards = useMemo(
    () => [
      {
        icon: Sparkles,
        title: "What is a Closure?",
        text: "A closure is created when a function remembers variables from its outer lexical scope.",
      },
      {
        icon: Layers3,
        title: "Lexical Scope",
        text: "Inner functions can access parent variables because scope is determined by where code is written.",
      },
      {
        icon: Lock,
        title: "Why Closures Matter",
        text: "Closures enable state persistence, encapsulation, private variables, factory functions, and React hooks.",
      },
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="rounded-lg border border-border/60 bg-card/45 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            <div className="mt-6 rounded-lg border border-white/10 bg-background/50 p-4">
              <div className="flex items-center gap-2 font-code text-xs text-muted-foreground">
                <span>outer()</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>inner()</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="text-primary">remembered state</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ScopeBox({
  title,
  values,
  active,
  children,
}: {
  title: string;
  values: string[];
  active?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-lg border p-4",
        active ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/50"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="outline" className="border-white/10 bg-background/50">
          scope
        </Badge>
      </div>
      <div className="space-y-2">
        {values.map((value) => (
          <div key={value} className="rounded-lg border border-white/10 bg-card/45 px-3 py-2 font-code text-xs text-muted-foreground">
            {value}
          </div>
        ))}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </motion.div>
  );
}

function ClosureVisualizer() {
  const [count, setCount] = useState(0);
  const activeLine = count === 0 ? 9 : count >= 3 ? 13 : 10 + count;

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Runtime Visualizer"
        icon={MemoryStick}
        title="Interactive Closure Visualizer"
        description="Call the returned inner function and watch it keep access to count after outer() has already completed."
      />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Code2 className="h-5 w-5 text-primary" />
              Closure code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CodePanel code={closureCode} activeLine={activeLine} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setCount((value) => Math.min(value + 1, 3))} disabled={count >= 3} className="rounded-full">
                Call counter()
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCount(0)} className="rounded-full border-white/10">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Layers3 className="h-5 w-5 text-primary" />
              Scope chain and memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScopeBox title="Global Scope" values={["outer: function", "counter: inner()"]} active={count === 0} />
            <ScopeBox title="outer Scope" values={["count: preserved in closure memory"]} active={count > 0}>
              <motion.div
                key={count}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg border border-primary/30 bg-primary/10 p-4"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Animated memory box</p>
                <p className="mt-2 text-5xl font-headline font-bold text-primary">{count}</p>
              </motion.div>
            </ScopeBox>
            <ScopeBox title="inner Scope" values={["count++", `return ${count || "count"}`]} active={count > 0} />
            <p className="rounded-lg border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
              outer() finished, but counter still points to inner(). Because inner() references count, JavaScript keeps that lexical environment alive.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PrivateVariableDemo() {
  const [balance, setBalance] = useState(1000);
  const [attempted, setAttempted] = useState(false);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Private State"
        icon={EyeOff}
        title="Private Variable Demo"
        description="Closures let you hide variables and expose only controlled methods for interacting with state."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Banknote className="h-5 w-5 text-primary" />
              Bank account factory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodePanel code={bankCode} activeLine={attempted ? 2 : 6} />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-background/55">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Hidden closure variable</p>
                  <p className="font-code text-lg text-primary">balance = {balance}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[100, 250, 500].map((amount) => (
                <Button key={amount} onClick={() => setBalance((value) => value + amount)} className="rounded-full">
                  Deposit ${amount}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setAttempted(true)} className="w-full rounded-full border-white/10">
              Try account.balance
            </Button>
            <div className={cn("rounded-lg border p-4", attempted ? "border-destructive/40 bg-destructive/10" : "border-white/10 bg-background/50")}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Direct access result</p>
              <p className="mt-2 font-code text-sm">
                {attempted ? "undefined // balance is not a public property" : "Click to test direct access"}
              </p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              The returned object can deposit and read balance, but outside code cannot mutate the balance variable directly.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ExamplesSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Applications"
        icon={Sparkles}
        title="Real World Closure Patterns"
        description="Closures appear everywhere in modern JavaScript applications, especially in UI state, async work, and module factories."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {realWorldExamples.map((example, index) => {
          const Icon = example.icon;
          return (
            <motion.article
              key={example.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{example.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{example.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function CommerceExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Enterprise eCommerce"
        icon={ShoppingCart}
        title="Commerce Closure Examples"
        description="Factory functions can encapsulate cart, coupon, and checkout state behind deliberate APIs."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {commerceExamples.map((example) => (
          <Card key={example.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-headline font-bold">{example.title}</h3>
              <div className="mt-5">
                <CodePanel code={example.code} />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{example.state}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
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
        icon={BookOpenCheck}
        title="Check Your Closure Model"
        description="Test lexical scope, persistent state, memory risk, and React closure behavior."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map((quiz, index) => {
          const selected = answers[index];
          return (
            <Card key={quiz.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{quiz.question}</h3>
                <div className="mt-5 grid gap-2">
                  {quiz.options.map((option) => {
                    const chosen = selected === option;
                    const correct = option === quiz.correct;
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                        className={cn(
                          "h-auto justify-start whitespace-normal rounded-lg border-white/10 px-4 py-3 text-left",
                          chosen && correct && "border-primary/50 bg-primary/10 text-primary",
                          chosen && !correct && "border-destructive/50 bg-destructive/10 text-red-100"
                        )}
                      >
                        {chosen ? correct ? <Check className="mr-2 h-4 w-4 shrink-0" /> : <X className="mr-2 h-4 w-4 shrink-0" /> : null}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {selected ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{quiz.explanation}</p> : null}
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
        title="Closures Interview Prep"
        description="Detailed answers for the closure questions that show up in frontend and full-stack interviews."
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

export function ClosuresLesson() {
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
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            JavaScript Scope
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            <span className="gradient-text">Closures</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Master lexical scope, persistent state, private variables, and one of JavaScript&apos;s most powerful concepts.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Understand how functions remember variables from their outer scope even after execution has completed.
          </p>
        </motion.div>
      </section>

      <ConceptOverview />

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="visualizer" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4">
            <TabsTrigger value="visualizer" className="rounded-md">Visualizer</TabsTrigger>
            <TabsTrigger value="private" className="rounded-md">Private State</TabsTrigger>
            <TabsTrigger value="examples" className="rounded-md">Examples</TabsTrigger>
            <TabsTrigger value="code" className="rounded-md">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="visualizer">
            <ClosureVisualizer />
          </TabsContent>
          <TabsContent value="private">
            <PrivateVariableDemo />
          </TabsContent>
          <TabsContent value="examples" className="space-y-10">
            <ExamplesSection />
            <CommerceExamples />
          </TabsContent>
          <TabsContent value="code">
            <section className="container mx-auto px-4 py-10">
              <SectionHeader
                badge="Code Examples"
                icon={Code2}
                title="Copy-ready Closure Examples"
                description="Practice closures through counters, private variables, memoization, and factory functions."
              />
              <div className="grid gap-6 lg:grid-cols-2">
                {codeExamples.map((example) => (
                  <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>

      <Quiz />
      <InterviewQuestions />
    </div>
  );
}
