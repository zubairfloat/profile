"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Coffee,
  MousePointerClick,
  ShoppingCart,
  Timer,
  Utensils,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RuntimeArchitectureVisualizer } from "./event-loop/RuntimeArchitectureVisualizer";
import { EventLoopSimulator } from "./event-loop/EventLoopSimulator";
import { RuntimeTimeline } from "./event-loop/RuntimeTimeline";
import { QueueExplorer } from "./event-loop/QueueExplorer";
import { PromiseVsTimeoutBattle } from "./event-loop/PromiseVsTimeoutBattle";
import { AsyncAwaitVisualizer } from "./event-loop/AsyncAwaitVisualizer";
import { EventLoopQuiz } from "./event-loop/EventLoopQuiz";
import { EnterpriseExamples } from "./event-loop/EnterpriseExamples";

const interviewQuestions = [
  {
    question: "What is the Event Loop?",
    answer:
      "The Event Loop is JavaScript's scheduler. JavaScript can run only one thing at a time, so the Event Loop keeps checking: Is the Call Stack empty? If yes, it moves waiting work into the stack. It always handles Microtasks first, like Promise callbacks, then Macrotasks, like setTimeout and click events.",
  },
  {
    question: "What is the Call Stack?",
    answer:
      "The Call Stack is the place where JavaScript runs the current work. When a function starts, it goes on the stack. When it finishes, it leaves the stack. The Event Loop does not run queued callbacks while the stack is busy.",
  },
  {
    question:
      "What is the difference between Microtask Queue and Callback Queue?",
    answer:
      "The Microtask Queue is the high-priority queue. Promise.then, catch, finally, queueMicrotask, and await continuations go there. The Callback Queue, also called Macrotask Queue, contains work like setTimeout, setInterval, and user events. When the stack becomes empty, JavaScript drains all Microtasks first, then runs a Macrotask.",
  },
  {
    question: "Why does Promise execute before setTimeout?",
    answer:
      "Because Promise callbacks go to the Microtask Queue, and setTimeout callbacks go to the Macrotask Queue. After synchronous code finishes, the Event Loop runs all Microtasks first. That is why Promise logs before setTimeout, even when setTimeout uses 0 milliseconds.",
  },
  {
    question: "How does Async/Await work internally?",
    answer:
      "Async/Await is syntactic sugar over Promises. When you await a Promise, the function execution pauses and returns a Promise. The code after await is wrapped in a microtask and executed after the awaited Promise resolves. This maintains the same queue priority as direct Promise usage but with cleaner syntax.",
  },
  {
    question: "What happens when the Call Stack is not empty?",
    answer:
      "The Event Loop waits. If the stack is full of long synchronous work, queued callbacks, clicks, timers, and UI updates cannot run yet. This is why heavy loops can freeze a page.",
  },
];

const beginnerFlow = [
  "Run synchronous code on the Call Stack.",
  "Send slow work like fetch, timers, and events to Browser APIs.",
  "When async work is ready, place its callback in the right queue.",
  "Wait until the Call Stack becomes empty.",
  "Run all Microtasks first, such as Promise callbacks.",
  "Run one Macrotask next, such as setTimeout or a click handler.",
  "Repeat the cycle so the UI stays responsive.",
];

const analogyCards = [
  {
    title: "Restaurant",
    icon: Utensils,
    map: [
      "Chef = JavaScript Engine",
      "Kitchen Counter = Call Stack",
      "Kitchen Staff = Browser APIs",
      "Waiting Area = Queues",
      "Manager = Event Loop",
    ],
    text:
      "The chef does not wait 20 minutes for pizza. Staff handles slow work in the background, and the manager brings it back when the counter is free.",
  },
  {
    title: "Coffee Shop",
    icon: Coffee,
    map: ["Espresso runs now", "Croissant waits briefly", "Pizza waits longer"],
    text:
      "Fast work finishes first. Slow work waits outside the main counter, then returns when JavaScript is free.",
  },
];

const easyExamples = [
  {
    title: "E-commerce Product Load",
    icon: ShoppingCart,
    code: `console.log("Load Header");

fetch("/api/products").then(() => {
  console.log("Products Loaded");
});

console.log("Load Footer");`,
    output: ["Load Header", "Load Footer", "Products Loaded"],
    explanation:
      "The API request runs in the background. JavaScript continues rendering the page, then handles the products when the response is ready.",
  },
  {
    title: "React Button Click",
    icon: MousePointerClick,
    code: `button.onclick = () => {
  console.log("Button Clicked");
};

console.log("App Ready");`,
    output: ["App Ready", "Button Clicked after user clicks"],
    explanation:
      "The click callback waits until the user clicks. The browser queues it, and the Event Loop runs it when the stack is empty.",
  },
  {
    title: "setTimeout Reminder",
    icon: Timer,
    code: `console.log("Start");

setTimeout(() => {
  console.log("Reminder");
}, 5000);

console.log("Continue Working");`,
    output: ["Start", "Continue Working", "Reminder"],
    explanation:
      "setTimeout is like setting a reminder. JavaScript does not stop working while the timer waits.",
  },
  {
    title: "Checkout Page",
    icon: ShoppingCart,
    code: `console.log("Validate Payment");

fetch("/create-order").then(() => {
  console.log("Order Created");
  console.log("Redirect to Thank You Page");
});

console.log("Show Loading Spinner");`,
    output: ["Validate Payment", "Show Loading Spinner", "Order Created", "Redirect to Thank You Page"],
    explanation:
      "The spinner appears immediately while the order API runs in the background. The UI does not freeze.",
  },
];

const simpleDefinitions = [
  {
    title: "Call Stack",
    desc: "Where JavaScript runs the current line or function.",
  },
  {
    title: "Browser APIs",
    desc: "Background helpers for timers, network requests, DOM events, and more.",
  },
  {
    title: "Microtask Queue",
    desc: "High-priority queue for Promise callbacks and await continuations.",
  },
  {
    title: "Macrotask Queue",
    desc: "Queue for timers, user events, and other callbacks.",
  },
  {
    title: "Event Loop",
    desc: "The checker that moves queued work to the stack when the stack is empty.",
  },
];

const eventLoopFlowDiagram = `                 JavaScript Runtime

        +----------------------+
        |      Call Stack      |
        +----------+-----------+
                   |
          Is Stack Empty?
                   |
                  Yes
                   |
             Event Loop
                   |
        +----------+-----------+
        |                      |
        v                      v
 Microtask Queue        Macrotask Queue
(Promise, await)   (setTimeout, Events)
        |                      |
        +----------+-----------+
                   |
                   v
             Execute Callback`;

export function EventLoopLesson() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [diagramCopied, setDiagramCopied] = useState(false);

  async function copyDiagram() {
    await navigator.clipboard.writeText(eventLoopFlowDiagram);
    setDiagramCopied(true);
    setTimeout(() => setDiagramCopied(false), 1400);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute left-1/2 top-24 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" /> */}

      <div className="container mx-auto pb-16 pt-28">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/5"
          >
            <Zap className="mr-2 h-3.5 w-3.5" />
            Interactive Learning
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
            JavaScript <span className="gradient-text">Event Loop</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript stays responsive while handling timers,
            API requests, promises, and user interactions.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            The Event Loop continuously checks whether the Call Stack is empty.
            When it is free, JavaScript runs pending Microtasks first, then
            Macrotasks, so slow work does not freeze the page.
          </p>

        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
              Beginner Mental Model
            </Badge>
            <h2 className="mb-3 text-3xl font-bold">What is the Event Loop?</h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
              JavaScript is single-threaded, which means it executes one piece
              of code at a time. The Event Loop is the mechanism that lets
              JavaScript continue working while slow operations happen in the
              background. When those operations are ready, the Event Loop brings
              their callbacks back only when the Call Stack is empty.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {simpleDefinitions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
              >
                <p className="font-semibold text-primary">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
              Visual Diagram
            </Badge>
            <h2 className="mb-3 text-3xl font-bold">Event Loop Flow</h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
              Use this diagram as the simple mental picture: the Event Loop
              waits for the Call Stack to become empty, runs Microtasks first,
              then handles Macrotasks.
            </p>
          </div>

          <Card className="overflow-hidden rounded-lg border-white/10 bg-card/45 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-white/10">
              <CardTitle className="text-xl">Event Loop Flow Diagram</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={copyDiagram}
                className="shrink-0 border-white/10"
                aria-label="Copy event loop flow diagram"
              >
                {diagramCopied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="overflow-auto bg-black/70 p-6 font-code text-[11px] leading-5 text-white sm:p-8 sm:text-sm md:text-base">
                <code>{eventLoopFlowDiagram}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
              Step-by-Step Flow
            </Badge>
            <h2 className="mb-3 text-3xl font-bold">How JavaScript Decides What Runs Next</h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
              Keep this order in your head. First synchronous code runs. Then,
              when the stack is empty, Microtasks run before Macrotasks.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            {beginnerFlow.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="relative rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                {index < beginnerFlow.length - 1 ? (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary xl:block" />
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
              Real-World Analogies
            </Badge>
            <h2 className="mb-3 text-3xl font-bold">Think of It Like a Restaurant</h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
              The chef does not pause the entire restaurant for one slow order.
              JavaScript works the same way: slow work is handled outside the
              Call Stack, then returned through queues.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {analogyCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.text}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {card.map.map((item) => (
                      <div key={item} className="rounded-lg border border-white/10 bg-background/60 p-3 text-xs text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-10">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
              Easy Examples
            </Badge>
            <h2 className="mb-3 text-3xl font-bold">Event Loop in Real Apps</h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
              These are the scenarios you see in product work: loading products,
              button clicks, timers, checkout APIs, and UI loading states.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {easyExamples.map((example, index) => {
              const Icon = example.icon;
              return (
                <motion.article
                  key={example.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-headline font-bold">{example.title}</h3>
                  </div>
                  <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
                    <code>{example.code}</code>
                  </pre>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-3 text-xs uppercase tracking-widest text-primary">Output</p>
                    <div className="space-y-2">
                      {example.output.map((line) => (
                        <div key={line} className="flex gap-2 font-code text-xs text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {example.explanation}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 rounded-lg border border-primary/20 bg-primary/5 p-8 backdrop-blur-xl"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-background/50 text-primary">
            Interview Answer
          </Badge>
          <h2 className="mb-4 text-3xl font-bold">30-Second Interview Answer</h2>
          <p className="text-sm leading-8 text-muted-foreground">
            JavaScript is single-threaded and executes synchronous code using
            the Call Stack. When it sees asynchronous operations like fetch,
            setTimeout, or user events, the browser handles those operations in
            the background. Once the Call Stack becomes empty, the Event Loop
            first processes all pending Microtasks, such as Promise callbacks,
            and then processes Macrotasks, such as setTimeout callbacks. This
            keeps applications responsive without blocking the main thread.
          </p>
        </motion.section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="visualizer" className="mb-20">
          <TabsList className="mb-8 grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent">
            <TabsTrigger
              value="visualizer"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger
              value="simulator"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Simulator
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="explorer"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Explorer
            </TabsTrigger>
            <TabsTrigger
              value="battle"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Promise vs Timeout
            </TabsTrigger>
            <TabsTrigger
              value="async"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Async/Await
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Quiz
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="text-xs sm:text-sm data-[state=active]:bg-primary/20 border border-primary/20"
            >
              Examples
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="visualizer" className="space-y-8">
              <RuntimeArchitectureVisualizer />
            </TabsContent>

            <TabsContent value="simulator" className="space-y-8">
              <EventLoopSimulator />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-8">
              <RuntimeTimeline />
            </TabsContent>

            <TabsContent value="explorer" className="space-y-8">
              <QueueExplorer />
            </TabsContent>

            <TabsContent value="battle" className="space-y-8">
              <PromiseVsTimeoutBattle />
            </TabsContent>

            <TabsContent value="async" className="space-y-8">
              <AsyncAwaitVisualizer />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-8">
              <EventLoopQuiz />
            </TabsContent>

            <TabsContent value="examples" className="space-y-8">
              <EnterpriseExamples />
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Interview Questions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-12">
            <h2 className="mb-3 text-3xl font-bold">Interview Questions</h2>
            <p className="text-muted-foreground">
              Master these fundamental questions about the Event Loop that
              appear in technical interviews.
            </p>
          </div>

          <div className="space-y-3">
            {interviewQuestions.map((qa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "border-white/10 backdrop-blur-xl transition-all cursor-pointer hover:border-primary/30 hover:bg-primary/5",
                    expandedQuestion === index &&
                      "border-primary/30 bg-primary/5",
                  )}
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === index ? null : index,
                    )
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-semibold">
                        {qa.question}
                      </CardTitle>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 flex-shrink-0 text-primary transition-transform",
                          expandedQuestion === index && "rotate-180",
                        )}
                      />
                    </div>
                  </CardHeader>

                  {expandedQuestion === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="pt-0 text-sm text-muted-foreground leading-relaxed">
                        {qa.answer}
                      </CardContent>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Takeaways */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center backdrop-blur-xl"
        >
          <h3 className="mb-4 text-2xl font-bold">Key Takeaways</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Single-threaded", desc: "One call stack at a time" },
              { title: "Non-blocking", desc: "Async operations via APIs" },
              { title: "Queue priority", desc: "Microtasks before Macrotasks" },
              { title: "Collaborative", desc: "Browser controls rendering" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg bg-background/40 p-4"
              >
                <p className="mb-2 font-semibold text-primary">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
