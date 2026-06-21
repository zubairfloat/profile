"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const timelineEvents = [
  { label: "Start", icon: "▶", color: "from-blue-500 to-blue-600" },
  { label: "Promise Registered", icon: "◆", color: "from-purple-500 to-purple-600" },
  { label: "Timer Registered", icon: "⏱", color: "from-orange-500 to-orange-600" },
  { label: "Main Function Complete", icon: "■", color: "from-cyan-500 to-cyan-600" },
  { label: "Microtask Executed", icon: "✓", color: "from-green-500 to-green-600" },
  { label: "Callback Executed", icon: "→", color: "from-yellow-500 to-yellow-600" },
  { label: "Finished", icon: "★", color: "from-pink-500 to-pink-600" },
];

export function RuntimeTimeline() {
  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Execution Timeline</h2>
        <p className="mb-8 text-muted-foreground">
          Visual representation of the order in which different parts of the code execute.
        </p>

        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {/* Timeline events */}
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Timeline dot */}
                <motion.div
                  className={`absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-background bg-gradient-to-br ${event.color} flex items-center justify-center text-lg font-bold text-white shadow-lg`}
                  whileHover={{ scale: 1.2 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  {event.icon}
                </motion.div>

                {/* Content card */}
                <motion.div
                  className="rounded-lg border border-white/10 bg-background/40 p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.label}</h3>
                    <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <h3 className="mb-4 font-semibold">Timeline Legend</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Synchronous Code", desc: "Executes immediately in Call Stack" },
            { label: "Microtask Queue", desc: "Promises, queueMicrotask (higher priority)" },
            { label: "Web APIs", desc: "Handles async operations (setTimeout, fetch)" },
            { label: "Callback Queue", desc: "setTimeout/setInterval callbacks (lower priority)" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-white/5 bg-background/20 p-3"
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="border-primary/30 bg-primary/10 p-6 backdrop-blur-xl">
        <h3 className="mb-4 font-semibold">Key Insight</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Event Loop ensures that while JavaScript is single-threaded, it can handle concurrent operations
          through careful scheduling. The order is always: ① Call Stack, ② Microtask Queue, ③ Rendering, ④
          Callback Queue, then repeat.
        </p>
      </Card>
    </div>
  );
}
