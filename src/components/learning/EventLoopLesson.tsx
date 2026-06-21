"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, ChevronDown } from "lucide-react";
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
      "The Event Loop is the core mechanism that allows JavaScript to perform non-blocking asynchronous operations despite being single-threaded. It continuously checks the Call Stack and, when the stack is empty, processes tasks from the Microtask Queue (Promises, queueMicrotask) and then the Callback Queue (setTimeout, setInterval, I/O operations).",
  },
  {
    question: "What is the Call Stack?",
    answer:
      "The Call Stack is a data structure that keeps track of function calls during code execution. When a function is called, it's added to the top of the stack. When it returns, it's removed from the stack. The Event Loop only processes queued tasks when the Call Stack is completely empty.",
  },
  {
    question: "What is the difference between Microtask Queue and Callback Queue?",
    answer:
      "The Microtask Queue has higher priority and includes Promise callbacks (then/catch/finally) and queueMicrotask calls. It executes after the Call Stack is empty but before the Callback Queue. The Callback Queue (also called Task Queue or Macrotask Queue) contains setTimeout, setInterval, and I/O operations. It executes one task at a time, then checks for microtasks again.",
  },
  {
    question: "Why does Promise execute before setTimeout?",
    answer:
      "Because Promises use the Microtask Queue, which has higher priority than the Callback Queue used by setTimeout. The execution order is: 1) Call Stack, 2) Microtask Queue, 3) Rendering, 4) Callback Queue. This is why Promise.resolve().then() always executes before setTimeout(..., 0).",
  },
  {
    question: "How does Async/Await work internally?",
    answer:
      "Async/Await is syntactic sugar over Promises. When you await a Promise, the function execution pauses and returns a Promise. The code after await is wrapped in a microtask and executed after the awaited Promise resolves. This maintains the same queue priority as direct Promise usage but with cleaner syntax.",
  },
  {
    question: "What happens when the Call Stack is not empty?",
    answer:
      "When the Call Stack is not empty, the Event Loop waits and does not process any queued tasks. Only synchronous code continues executing. This is why blocking operations (long while loops, synchronous calculations) can freeze the UI - the Event Loop cannot process user interactions, network responses, or visual updates until the stack clears.",
  },
];

export function EventLoopLesson() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute left-1/2 top-24 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            <Zap className="mr-2 h-3.5 w-3.5" />
            Interactive Learning
          </Badge>

          <h1 className="mb-4 text-5xl font-bold leading-tight lg:text-6xl">
            JavaScript Event Loop
          </h1>

          <p className="mx-auto mb-6 max-w-3xl text-xl text-muted-foreground">
            Understand how JavaScript handles asynchronous operations behind the scenes.
          </p>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground/80">
            Explore Call Stack, Web APIs, Microtasks, Callback Queues, Promises, Async/Await, and real-world
            enterprise examples through interactive visualizations.
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            15 minute read
          </div>
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
              Master these fundamental questions about the Event Loop that appear in technical interviews.
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
                    expandedQuestion === index && "border-primary/30 bg-primary/5"
                  )}
                  onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-semibold">{qa.question}</CardTitle>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 flex-shrink-0 text-primary transition-transform",
                          expandedQuestion === index && "rotate-180"
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
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="rounded-lg bg-background/40 p-4">
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
