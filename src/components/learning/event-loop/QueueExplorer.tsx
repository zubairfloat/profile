"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const queues = [
  {
    id: "call-stack",
    title: "Call Stack",
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-500/10",
    contains: ["function calls", "execution frames", "local variables"],
    priority: "Highest",
    processedBy: "JavaScript Engine",
    description:
      "A LIFO (Last In First Out) data structure that tracks function execution. When a function is called, it's pushed onto the stack. When it returns, it's popped off.",
  },
  {
    id: "microtask",
    title: "Microtask Queue",
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500/50",
    bgColor: "bg-purple-500/10",
    contains: ["Promise.then/catch/finally", "queueMicrotask()", "async/await continuations"],
    priority: "High (after stack)",
    processedBy: "Event Loop",
    description:
      "Higher priority queue for asynchronous operations. Executes after the Call Stack is empty but before rendering and macrotasks.",
  },
  {
    id: "callback",
    title: "Callback Queue",
    color: "from-orange-500 to-orange-600",
    borderColor: "border-orange-500/50",
    bgColor: "bg-orange-500/10",
    contains: ["setTimeout callbacks", "setInterval callbacks", "I/O operations"],
    priority: "Low (after microtasks)",
    processedBy: "Event Loop",
    description:
      "Also called Task Queue or Macrotask Queue. Lower priority queue for callbacks. One task is executed per event loop iteration.",
  },
  {
    id: "web-apis",
    title: "Web APIs",
    color: "from-green-500 to-green-600",
    borderColor: "border-green-500/50",
    bgColor: "bg-green-500/10",
    contains: ["setTimeout/setInterval", "fetch/XMLHttpRequest", "DOM events", "requestAnimationFrame"],
    priority: "External",
    processedBy: "Browser",
    description:
      "Browser APIs that handle asynchronous operations outside JavaScript's main thread. They move tasks to appropriate queues when complete.",
  },
];

export function QueueExplorer() {
  const [selectedQueue, setSelectedQueue] = useState(0);
  const queue = queues[selectedQueue];

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Queue Explorer</h2>
        <p className="mb-8 text-muted-foreground">
          Understand the different queues and where various operations get executed.
        </p>

        {/* Queue Selector */}
        <div className="mb-8 grid gap-3 md:grid-cols-4">
          {queues.map((q, index) => (
            <motion.div key={q.id} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => setSelectedQueue(index)}
                variant={selectedQueue === index ? "default" : "outline"}
                className={`w-full rounded-lg ${selectedQueue === index ? "bg-primary" : ""}`}
              >
                {q.title}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Selected Queue Details */}
        <motion.div
          key={queue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className={`rounded-lg border-2 ${queue.borderColor} ${queue.bgColor} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${queue.color}`} />
              <div>
                <h3 className="text-2xl font-bold">{queue.title}</h3>
                <p className="text-sm text-muted-foreground">Click to explore details</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed">{queue.description}</p>
          </div>

          {/* Grid Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Priority</p>
              <p className="text-lg font-bold">{queue.priority}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Processed By</p>
              <p className="text-lg font-bold">{queue.processedBy}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Contains</p>
              <p className="text-sm">{queue.contains.length} types</p>
            </div>
          </div>

          {/* Contains */}
          <div className="rounded-lg border border-white/10 bg-background/40 p-6">
            <h4 className="mb-4 font-semibold">Contains</h4>
            <div className="space-y-2">
              {queue.contains.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-lg bg-background/40 p-3"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Execution Flow Diagram */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold">Execution Flow</h3>
        <div className="space-y-4">
          {[
            { step: "1", label: "Call Stack", desc: "Execute synchronous code" },
            { step: "2", label: "Is Stack Empty?", desc: "Check if more sync code" },
            { step: "3", label: "Microtask Queue", desc: "Execute all microtasks" },
            { step: "4", label: "Rendering", desc: "Update DOM if needed" },
            { step: "5", label: "Callback Queue", desc: "Execute one macrotask" },
            { step: "6", label: "Repeat", desc: "Go back to step 1" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary bg-primary/20 text-xs font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {i < 5 && <ChevronRight className="mt-1 h-5 w-5 text-primary/50" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
