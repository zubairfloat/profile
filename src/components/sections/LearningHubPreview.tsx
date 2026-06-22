"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Braces,
  Gauge,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const learningStats = [
  { label: "Years Experience", value: "9+" },
  { label: "Concepts Explained", value: "25+" },
  { label: "Technology Domains", value: "10+" },
  { label: "Enterprise Users Impacted", value: "Thousands" },
];

const conceptCategories = [
  {
    title: "JavaScript Fundamentals",
    icon: Braces,
    concepts: ["Event Loop", "Call Stack", "Execution Context", "Closures", "Hoisting", "Scope Chain"],
  },
  {
    title: "Performance Optimization",
    icon: Gauge,
    concepts: ["Debouncing", "Throttling", "Memoization", "Lazy Loading", "Code Splitting"],
  },
  {
    title: "React & Next.js",
    icon: Layers3,
    concepts: ["Virtual DOM", "Reconciliation", "React Rendering", "Server Components", "Hydration"],
  },
  {
    title: "System Design",
    icon: Network,
    concepts: ["Caching", "CDN", "Load Balancing", "Microservices", "Message Queues"],
  },
  {
    title: "Advanced Engineering",
    icon: ShieldCheck,
    concepts: ["Design Patterns", "Authentication", "Security", "Scalability", "Architecture Decisions"],
  },
];

const featuredConcepts = [
  {
    title: "JavaScript Event Loop",
    href: "/learning/event-loop",
    description: "See how the call stack, queues, promises, and rendering cooperate inside the runtime.",
    tags: ["Async", "Runtime", "Promises"],
    frames: ["Call Stack", "Microtasks", "Callback Queue"],
  },
  {
    title: "Call Stack",
    href: "/learning/call-stack",
    description: "Step through function execution, stack frames, recursion, and stack overflow visually.",
    tags: ["Execution", "Frames", "Recursion"],
    frames: ["main()", "first()", "second()", "third()"],
  },
  {
    title: "Debouncing vs Throttling",
    href: "/learning/debouncing-vs-throttling",
    description: "Learn when to delay execution and when to limit frequency in production interfaces.",
    tags: ["Performance", "UX", "Frontend"],
    frames: ["User Input", "Timer", "Execute Once"],
  },
];

export function LearningHubPreview() {
  return (
    <section id="learning-hub" className="relative overflow-hidden py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
              <BookOpenCheck className="mr-2 h-3.5 w-3.5" />
              Developer Learning Hub
            </Badge>
            <h2 className="text-4xl font-headline leading-tight tracking-normal lg:text-6xl">
              Interactive engineering lessons built from real enterprise experience.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              I teach JavaScript runtime behavior, frontend architecture, performance optimization,
              system design, and modern web development through visual simulations instead of static notes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {learningStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
                <p className="text-3xl font-headline font-bold gradient-text">{stat.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-5">
          {conceptCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-lg border border-white/10 bg-card/40 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold leading-tight">{category.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.concepts.map((concept, conceptIndex) => (
                    <span
                      key={concept}
                      className={cn(
                        "rounded-full border px-3 py-1 font-code text-[11px] text-muted-foreground",
                        conceptIndex < 2 ? "border-primary/20 bg-primary/5 text-primary" : "border-white/10 bg-background/50"
                      )}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredConcepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link href={concept.href} className="block h-full">
                <Card className="group h-full overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        Featured Concept
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold">{concept.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{concept.description}</p>

                    <div className="mt-6 flex min-h-32 flex-col justify-end gap-2 rounded-lg border border-white/10 bg-background/55 p-4">
                      {concept.frames.map((frame, frameIndex) => (
                        <motion.div
                          key={frame}
                          animate={{ x: [0, frameIndex === concept.frames.length - 1 ? 5 : 0, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, delay: frameIndex * 0.2 }}
                          className={cn(
                            "rounded-lg border px-3 py-2 font-code text-xs",
                            frameIndex === concept.frames.length - 1
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-white/10 bg-card/60 text-muted-foreground"
                          )}
                        >
                          {frame}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {concept.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-background/50 px-3 py-1 font-code text-[11px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-widest">Built for visual learners</p>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Explore interactive lessons that explain real-world engineering concepts with runnable examples,
              animations, and interview-ready explanations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full font-semibold">
              <Link href="/learning">
                Open Learning Hub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/10 font-semibold">
              <a href="#contact">Discuss Mentorship</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
