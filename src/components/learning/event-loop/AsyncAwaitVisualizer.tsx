"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Start execution", code: "async function run() {", console: ["← Execution paused here"] },
  { label: "Log '1'", code: '  console.log("1");', console: ["← Execution paused here", "1"] },
  { label: "Hit await", code: "  await Promise.resolve();", console: ["← Execution paused, waiting for Promise"] },
  { label: "Continue after await", code: '  console.log("2");', console: ["← Resumed from Microtask Queue", "2"] },
  { label: "Function returns", code: "}", console: ["← Function completed"] },
];

export function AsyncAwaitVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const runVisualization = () => {
    setCurrentStep(0);
    setLogs([]);

    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === 1) {
          setLogs(["1"]);
        } else if (index === 3) {
          setLogs(["1", "2"]);
        } else if (index === 4) {
          setLogs(["1", "3", "2"]);
        }
      }, (index + 1) * 800);
    });
  };

  const reset = () => {
    setCurrentStep(0);
    setLogs([]);
  };

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Async/Await Visualizer</h2>
        <p className="mb-8 text-muted-foreground">
          See how async/await works internally with Promises and the Microtask Queue.
        </p>

        {/* Code Example */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Async/Await Code</p>
            <div className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-xs text-green-300">
              <pre>{`async function run() {
  console.log("1");

  await Promise.resolve();

  console.log("2");
}

run();
console.log("3");`}</pre>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Output</p>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 font-mono text-xs text-green-300 h-full">
              {logs.length === 0 ? (
                <p className="text-muted-foreground italic">No output yet</p>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    &gt; {log}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Step Visualization */}
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Execution Steps</p>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`rounded-lg border p-4 transition-all ${
                  currentStep > index
                    ? "border-green-500/50 bg-green-500/10"
                    : currentStep === index
                      ? "border-primary/50 bg-primary/10"
                      : "border-white/10 bg-background/40"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep > index
                        ? "bg-green-500 text-white"
                        : currentStep === index
                          ? "border-2 border-primary bg-primary/20"
                          : "border-2 border-white/20"
                    }`}
                    animate={currentStep === index ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    {currentStep > index ? "✓" : index + 1}
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{step.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">{step.code}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={runVisualization} className="rounded-full">
            <Play className="mr-2 h-4 w-4" />
            Run Visualization
          </Button>
          <Button onClick={reset} variant="outline" className="rounded-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Explanation */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>How Async/Await Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground mb-2">Step 1: Synchronous Execution</p>
            <p className="ml-4">run() is called and starts executing synchronously. console.log("1") outputs "1".</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Step 2: Pause at await</p>
            <p className="ml-4">
              When await is reached, the async function pauses. The Promise is added to the Microtask Queue.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Step 3: Execute Synchronous Code</p>
            <p className="ml-4">
              console.log("3") is still in the Call Stack, so it executes before any microtasks.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Step 4: Resume from Microtask Queue</p>
            <p className="ml-4">
              When the Call Stack is empty, the Event Loop processes the Microtask Queue. The async function resumes
              and console.log("2") executes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
