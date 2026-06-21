"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Step = {
  id: number;
  title: string;
  description: string;
  callStack: string[];
  webAPIs: string[];
  microtaskQueue: string[];
  callbackQueue: string[];
  console: string[];
  explanation: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: 'main() Execution',
    description: 'Code starts executing',
    callStack: ["main()"],
    webAPIs: [],
    microtaskQueue: [],
    callbackQueue: [],
    console: [],
    explanation: 'The JavaScript engine calls main() and pushes it to the Call Stack.',
  },
  {
    id: 2,
    title: 'console.log("Start")',
    description: 'First synchronous operation',
    callStack: ["main()", "console.log"],
    webAPIs: [],
    microtaskQueue: [],
    callbackQueue: [],
    console: ["Start"],
    explanation: 'Synchronous code executes immediately. Output: "Start"',
  },
  {
    id: 3,
    title: 'Promise Registered',
    description: 'Promise.resolve().then() queued',
    callStack: ["main()"],
    webAPIs: [],
    microtaskQueue: ["Promise.then()"],
    callbackQueue: [],
    console: ["Start"],
    explanation: 'Promise callbacks are added to the Microtask Queue immediately.',
  },
  {
    id: 4,
    title: 'setTimeout Registered',
    description: 'setTimeout(0) sent to Web API',
    callStack: ["main()"],
    webAPIs: ["setTimeout(0)"],
    microtaskQueue: ["Promise.then()"],
    callbackQueue: [],
    console: ["Start"],
    explanation: 'setTimeout is delegated to Web APIs. Even with 0ms delay, it goes to Callback Queue.',
  },
  {
    id: 5,
    title: 'console.log("End")',
    description: 'Second synchronous operation',
    callStack: ["main()", "console.log"],
    webAPIs: ["setTimeout(0)"],
    microtaskQueue: ["Promise.then()"],
    callbackQueue: [],
    console: ["Start", "End"],
    explanation: 'Synchronous code continues. Output: "End"',
  },
  {
    id: 6,
    title: 'Call Stack Empty',
    description: 'main() completes',
    callStack: [],
    webAPIs: [],
    microtaskQueue: ["Promise.then()"],
    callbackQueue: [],
    console: ["Start", "End"],
    explanation: 'main() execution completes. Call Stack is now empty. Event Loop checks Microtask Queue.',
  },
  {
    id: 7,
    title: 'Timer Complete',
    description: 'setTimeout timer fires',
    callStack: [],
    webAPIs: [],
    microtaskQueue: ["Promise.then()"],
    callbackQueue: ["setTimeout callback"],
    console: ["Start", "End"],
    explanation: 'Web API timer completes. Callback is moved to Callback Queue.',
  },
  {
    id: 8,
    title: 'Microtask Executed',
    description: 'Promise callback runs',
    callStack: [],
    webAPIs: [],
    microtaskQueue: [],
    callbackQueue: ["setTimeout callback"],
    console: ["Start", "End", "Promise"],
    explanation: 'Event Loop processes Microtask Queue first. Output: "Promise"',
  },
  {
    id: 9,
    title: 'Callback Executed',
    description: 'setTimeout callback runs',
    callStack: [],
    webAPIs: [],
    microtaskQueue: [],
    callbackQueue: [],
    console: ["Start", "End", "Promise", "Timeout"],
    explanation: 'After Microtask Queue is empty, Event Loop processes Callback Queue. Output: "Timeout"',
  },
];

export function EventLoopSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const step = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAutoPlay(false);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        nextStep();
      } else {
        setIsAutoPlay(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAutoPlay, currentStep]);

  return (
    <div className="space-y-8">
      {/* Code Example */}
      <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Example Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-sm">
            <pre className="text-green-300">
              {`console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise");
});

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Step Visualization */}
      <Card className="border-white/10 bg-card/45 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Step {currentStep + 1} of {steps.length}</CardTitle>
            <Badge variant="outline">{step.title}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-sm text-muted-foreground">{step.description}</p>

          {/* Queue Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Call Stack */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <h4 className="mb-2 text-xs font-semibold text-blue-300">CALL STACK</h4>
              <div className="space-y-1">
                {step.callStack.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Empty</p>
                ) : (
                  step.callStack.map((item, i) => (
                    <motion.div
                      key={i}
                      layoutId={`stack-${i}`}
                      className="rounded bg-blue-500/20 px-2 py-1 text-xs font-mono text-blue-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ↳ {item}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Web APIs */}
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <h4 className="mb-2 text-xs font-semibold text-green-300">WEB APIS</h4>
              <div className="space-y-1">
                {step.webAPIs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Idle</p>
                ) : (
                  step.webAPIs.map((item, i) => (
                    <motion.div
                      key={i}
                      className="rounded bg-green-500/20 px-2 py-1 text-xs font-mono text-green-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ↳ {item}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Microtask Queue */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <h4 className="mb-2 text-xs font-semibold text-purple-300">MICROTASK QUEUE</h4>
              <div className="space-y-1">
                {step.microtaskQueue.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Empty</p>
                ) : (
                  step.microtaskQueue.map((item, i) => (
                    <motion.div
                      key={i}
                      className="rounded bg-purple-500/20 px-2 py-1 text-xs font-mono text-purple-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ↳ {item}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Callback Queue */}
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
              <h4 className="mb-2 text-xs font-semibold text-orange-300">CALLBACK QUEUE</h4>
              <div className="space-y-1">
                {step.callbackQueue.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Empty</p>
                ) : (
                  step.callbackQueue.map((item, i) => (
                    <motion.div
                      key={i}
                      className="rounded bg-orange-500/20 px-2 py-1 text-xs font-mono text-orange-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ↳ {item}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <h4 className="mb-2 text-xs font-semibold text-green-300">CONSOLE OUTPUT</h4>
            <div className="space-y-1 font-mono text-xs text-green-300">
              {step.console.length === 0 ? (
                <p className="text-muted-foreground italic">No output yet</p>
              ) : (
                step.console.map((log, i) => (
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

          {/* Explanation */}
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={previousStep} disabled={currentStep === 0} variant="outline" className="rounded-full">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1} className="rounded-full">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          variant={isAutoPlay ? "default" : "outline"}
          className="rounded-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {isAutoPlay ? "Playing..." : "Auto Play"}
        </Button>
        <Button onClick={reset} variant="outline" className="rounded-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Expected Output */}
      <Card className="border-green-500/30 bg-green-500/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm">Expected Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded bg-black/40 p-3 font-mono text-xs text-green-300">
            <div>Start</div>
            <div>End</div>
            <div>Promise</div>
            <div>Timeout</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
