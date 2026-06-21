"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PromiseVsTimeoutBattle() {
  const [started, setStarted] = useState(false);
  const [promiseWon, setPromiseWon] = useState<boolean | null>(null);

  const runBattle = () => {
    setStarted(true);
    setPromiseWon(null);

    setTimeout(() => {
      setPromiseWon(true);
    }, 1500);
  };

  const reset = () => {
    setStarted(false);
    setPromiseWon(null);
  };

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Promise vs setTimeout Battle</h2>
        <p className="mb-8 text-muted-foreground">
          Watch how Microtask Queue (Promise) always beats Callback Queue (setTimeout).
        </p>

        {/* Code Example */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Promise */}
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
            <p className="mb-3 text-xs font-semibold text-purple-300 uppercase">Promise</p>
            <div className="overflow-x-auto rounded bg-black/40 p-3 font-mono text-xs text-purple-300">
              <pre>{`Promise.resolve()
  .then(() => {
    console.log("Promise");
  });`}</pre>
            </div>
          </div>

          {/* setTimeout */}
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
            <p className="mb-3 text-xs font-semibold text-orange-300 uppercase">setTimeout</p>
            <div className="overflow-x-auto rounded bg-black/40 p-3 font-mono text-xs text-orange-300">
              <pre>{`setTimeout(() => {
  console.log("Timeout");
}, 0);`}</pre>
            </div>
          </div>
        </div>

        {/* Battle Visualization */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Promise Side */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Microtask Queue</p>
            <motion.div
              initial={{ x: 0, opacity: 0.5 }}
              animate={started ? { x: [0, 20, 0], opacity: 1 } : { x: 0, opacity: 0.5 }}
              transition={{
                duration: 1,
                delay: promiseWon ? 0 : 0.3,
                repeat: started && promiseWon === null ? 2 : 0,
              }}
              className="rounded-lg border border-purple-500/50 bg-purple-500/20 p-6 text-center"
            >
              <div className="text-3xl font-bold text-purple-300">⚡</div>
              <p className="mt-2 font-semibold">Promise.then()</p>
              <p className="text-xs text-muted-foreground mt-1">Higher Priority</p>
            </motion.div>
          </div>

          {/* setTimeout Side */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Callback Queue</p>
            <motion.div
              initial={{ x: 0, opacity: 0.5 }}
              animate={started ? { x: [0, -20, 0], opacity: 1 } : { x: 0, opacity: 0.5 }}
              transition={{
                duration: 1,
                delay: promiseWon ? 0.5 : 0,
                repeat: started && promiseWon === null ? 2 : 0,
              }}
              className="rounded-lg border border-orange-500/50 bg-orange-500/20 p-6 text-center"
            >
              <div className="text-3xl font-bold text-orange-300">⏱</div>
              <p className="mt-2 font-semibold">setTimeout()</p>
              <p className="text-xs text-muted-foreground mt-1">Lower Priority</p>
            </motion.div>
          </div>
        </div>

        {/* Result */}
        {promiseWon !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center"
          >
            <p className="mb-2 text-lg font-bold text-green-400">🎉 Promise Wins!</p>
            <p className="text-sm text-muted-foreground">
              Reason: Microtask Queue has higher priority than Callback Queue.
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={runBattle} disabled={started && promiseWon === null} className="rounded-full">
            <Zap className="mr-2 h-4 w-4" />
            Start Battle
          </Button>
          <Button onClick={reset} variant="outline" className="rounded-full">
            Reset
          </Button>
        </div>
      </Card>

      {/* Explanation */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Why Promise Always Wins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong>Event Loop Priority:</strong> When the Call Stack is empty, the Event Loop follows this order:
          </p>
          <ol className="ml-4 list-inside list-decimal space-y-2">
            <li>Call Stack (synchronous code)</li>
            <li>Microtask Queue (Promises, async/await)</li>
            <li>Rendering (if needed)</li>
            <li>Callback Queue (setTimeout, setInterval)</li>
          </ol>
          <p>
            <strong>Result:</strong> Even though both Promise and setTimeout have delays, the Promise callback is
            processed first because it uses the Microtask Queue, which has higher priority.
          </p>
        </CardContent>
      </Card>

      {/* Real World Example */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Real-World Implications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground mb-1">Use Promises for:</p>
            <p className="ml-4">• API responses, database queries, reactive updates</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Use setTimeout for:</p>
            <p className="ml-4">• Debouncing, throttling, UI batch updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
