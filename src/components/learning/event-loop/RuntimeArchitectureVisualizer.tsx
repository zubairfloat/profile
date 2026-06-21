"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QueueItem = {
  id: string;
  label: string;
  type: "sync" | "promise" | "timeout";
};

export function RuntimeArchitectureVisualizer() {
  const [callStack, setCallStack] = useState<QueueItem[]>([
    { id: "1", label: "main()", type: "sync" },
  ]);
  const [webAPIs, setWebAPIs] = useState<QueueItem[]>([]);
  const [microtaskQueue, setMicrotaskQueue] = useState<QueueItem[]>([]);
  const [callbackQueue, setCallbackQueue] = useState<QueueItem[]>([]);
  const [animatingItem, setAnimatingItem] = useState<string | null>(null);

  const simulateExecution = () => {
    // Add promise to microtask
    setAnimatingItem("promise");
    setTimeout(() => {
      setMicrotaskQueue((prev) => [...prev, { id: "2", label: "Promise.then()", type: "promise" }]);
      setAnimatingItem(null);
    }, 300);

    // Add timeout to web APIs
    setTimeout(() => {
      setAnimatingItem("timeout");
      setWebAPIs((prev) => [...prev, { id: "3", label: "setTimeout()", type: "timeout" }]);
      setAnimatingItem(null);
    }, 600);

    // Simulate web API completing
    setTimeout(() => {
      setWebAPIs((prev) => prev.filter((item) => item.id !== "3"));
      setCallbackQueue((prev) => [...prev, { id: "3", label: "setTimeout callback", type: "timeout" }]);
    }, 1500);

    // Process microtask
    setTimeout(() => {
      setAnimatingItem("2");
      setMicrotaskQueue((prev) => prev.filter((item) => item.id !== "2"));
      setAnimatingItem(null);
    }, 2000);

    // Process callback
    setTimeout(() => {
      setAnimatingItem("3");
      setCallbackQueue((prev) => prev.filter((item) => item.id !== "3"));
      setAnimatingItem(null);
    }, 2500);

    // Clear call stack
    setTimeout(() => {
      setCallStack((prev) => prev.slice(0, -1));
    }, 3000);
  };

  const resetVisualization = () => {
    setCallStack([{ id: "1", label: "main()", type: "sync" }]);
    setWebAPIs([]);
    setMicrotaskQueue([]);
    setCallbackQueue([]);
    setAnimatingItem(null);
  };

  const renderQueueItem = (item: QueueItem, queue: string) => {
    const colors = {
      sync: "bg-blue-500/20 border-blue-500/50 text-blue-300",
      promise: "bg-purple-500/20 border-purple-500/50 text-purple-300",
      timeout: "bg-orange-500/20 border-orange-500/50 text-orange-300",
    };

    return (
      <motion.div
        key={item.id}
        layoutId={`item-${item.id}`}
        className={`rounded-md border px-3 py-2 text-xs font-mono ${colors[item.type]}`}
        animate={
          animatingItem === item.id
            ? { scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.3 }}
      >
        {item.label}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Runtime Architecture</h2>
        <p className="mb-8 text-muted-foreground">
          Visual representation of how the Event Loop orchestrates asynchronous code execution.
        </p>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Left side: Call Stack and Web APIs */}
          <div className="space-y-4">
            {/* Call Stack */}
            <Card className="border-white/10 bg-background/40 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <CardTitle className="text-sm font-semibold">Call Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {callStack.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Empty</p>
                  ) : (
                    callStack.map((item) => renderQueueItem(item, "callStack"))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Web APIs */}
            <Card className="border-white/10 bg-background/40 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <CardTitle className="text-sm font-semibold">Web APIs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {webAPIs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Idle</p>
                  ) : (
                    webAPIs.map((item) => renderQueueItem(item, "webAPIs"))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Event Loop and Queues */}
          <div className="space-y-4">
            {/* Event Loop */}
            <Card className="border-primary/40 bg-primary/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Event Loop</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Checks Call Stack → Microtasks → Rendering → Macrotasks
                </p>
              </CardContent>
            </Card>

            {/* Microtask Queue */}
            <Card className="border-white/10 bg-background/40 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <CardTitle className="text-sm font-semibold">Microtask Queue</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {microtaskQueue.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Empty</p>
                  ) : (
                    microtaskQueue.map((item) => renderQueueItem(item, "microtask"))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Callback Queue */}
            <Card className="border-white/10 bg-background/40 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <CardTitle className="text-sm font-semibold">Callback Queue</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {callbackQueue.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Empty</p>
                  ) : (
                    callbackQueue.map((item) => renderQueueItem(item, "callback"))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={simulateExecution} className="rounded-full">
            <Zap className="mr-2 h-4 w-4" />
            Simulate Execution
          </Button>
          <Button onClick={resetVisualization} variant="outline" className="rounded-full">
            Reset
          </Button>
        </div>
      </div>

      {/* Explanation */}
      <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            • <strong>Call Stack</strong>: Executes synchronous code. Only one function at a time.
          </p>
          <p>
            • <strong>Web APIs</strong>: Handles asynchronous operations like setTimeout, fetch, and events.
          </p>
          <p>
            • <strong>Microtask Queue</strong>: Higher priority. Contains Promise callbacks and queueMicrotask.
          </p>
          <p>
            • <strong>Callback Queue</strong>: Lower priority. Contains setTimeout, setInterval callbacks.
          </p>
          <p>
            • <strong>Event Loop</strong>: Continuously checks if Call Stack is empty, then processes queues in
            order.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
