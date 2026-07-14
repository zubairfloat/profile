"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Check,
  Clipboard,
  Network,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ecommerceDiagram = `Main E-commerce Application
|
|-- Header and Navigation
|-- Product Search
|-- Product Details
|-- Cart
|-- Checkout
|-- Payment
|-- Order Confirmation

Micro Frontend split:

Host Application
|
|-- Search Remote
|-- Product Remote
|-- Cart Remote
|-- Checkout Remote
|-- Payment Remote`;

const completeArchitectureDiagram = `                         User
                          |
                          v
                  Host Application
            (Main Website / Shell / Container)
                          |
        -----------------------------------------
        |                   |                   |
        v                   v                   v
 Product Remote        Cart Remote       Checkout Remote
        |                   |                   |
        v                   v                   v
  ProductCard             Cart           CheckoutForm
        ^                   ^                   ^
        |                   |                   |
        -----------------------------------------
                          |
                  Shared Dependencies
       (React, React DOM, Design System,
        Authentication, Analytics, Redux)`;

const shoppingMallDiagram = `                Shopping Mall
                     |
     ----------------+----------------
     |               |               |
 Nike Store      Apple Store     Starbucks
     |               |               |
 Different Team  Different Team  Different Team`;

const amazonHostDiagram = `              Amazon Website (Host)
                     |
      ---------------+---------------
      |              |              |
   Product        Cart         Checkout
   Remote        Remote         Remote`;

const keyTerms = [
  ["Host application", "The shell or container app that loads remote features."],
  ["Remote application", "An independently deployed app that exposes modules."],
  ["Exposed module", "A component, route, function, or module made available to other apps."],
  ["Shared dependency", "A library like React or a design system shared between host and remotes."],
];

const mallMappings = [
  ["Shopping Mall", "Host Application"],
  ["Nike Store", "Remote Application"],
  ["Products inside Nike Store", "Exposed Modules"],
  ["Electricity, Internet, Security", "Shared Dependencies"],
];

const hostResponsibilities = [
  "Login",
  "Authentication",
  "Navigation",
  "Layout",
  "Header",
  "Footer",
  "Global theme",
  "Error handling",
  "Routing",
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

function DiagramPanel({ title, diagram }: { title: string; diagram: string }) {
  const [copied, setCopied] = useState(false);

  async function copyDiagram() {
    await navigator.clipboard.writeText(diagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-lg border border-border bg-slate-950 p-4 text-slate-100 shadow-sm dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-code text-xs uppercase tracking-widest text-slate-400">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={copyDiagram}
          className="h-8 w-8 text-slate-300 hover:bg-white/10 hover:text-white"
          aria-label={`Copy ${title} diagram`}
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-code text-sm leading-7">{diagram}</pre>
    </div>
  );
}

function ArchitectureOverview() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Lesson 1"
        icon={Network}
        title="Explain Micro Frontend Architecture Using Module Federation"
        description="Micro frontends divide one large frontend into independently developed, deployed, and owned business features."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Simple Definition</h3>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              A Micro Frontend architecture divides one large frontend application
              into multiple smaller frontend applications. Each smaller app can
              have its own repository, team, deployment pipeline, and business
              feature.
            </p>
            <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-muted-foreground">
              Module Federation is a Webpack feature that allows one JavaScript
              application to load code from another independently deployed
              application at runtime.
            </p>
          </CardContent>
        </Card>
        <DiagramPanel title="E-commerce split" diagram={ecommerceDiagram} />
      </div>
    </section>
  );
}
function KeyTerms() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Main Terms"
        icon={Boxes}
        title="Host, Remote, Exposed Module, Shared Dependency"
        description="These four terms make most Module Federation interview answers easier to structure."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {keyTerms.map(([title, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-code text-sm font-bold text-primary">
              {index + 1}
            </div>
            <h3 className="text-xl font-headline font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
function ShoppingMallAnalogy() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real-World Analogy"
        icon={Boxes}
        title="Think of a Shopping Mall"
        description="A shopping mall does not own every shop. Different companies own different stores, but customers experience one connected place."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <DiagramPanel title="Shopping mall analogy" diagram={shoppingMallDiagram} />
            <div className="grid gap-3">
              {mallMappings.map(([realWorld, moduleFederation]) => (
                <div key={realWorld} className="flex flex-col gap-1 rounded-lg border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">{realWorld}</p>
                  <ArrowRight className="hidden h-4 w-4 text-primary sm:block" />
                  <p className="font-code text-sm text-primary">{moduleFederation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Host Application</h3>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              The Host is the main application users open first. It acts like the
              container or shell that loads features from other applications
              when needed.
            </p>
            <DiagramPanel title="Amazon host example" diagram={amazonHostDiagram} />
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {hostResponsibilities.map((item) => (
                <div key={item} className="rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CompleteArchitecture() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Complete Architecture"
        icon={Network}
        title="Complete Architecture"
        description="The user enters the host application. The host loads independent remotes. All apps share critical dependencies such as React, auth, analytics, and the design system."
      />
      <DiagramPanel title="Complete Module Federation architecture" diagram={completeArchitectureDiagram} />
    </section>
  );
}

export function MicroFrontendModuleFederationLesson() {
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
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Interview Preparation
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            Micro Frontends with <span className="gradient-text">Module Federation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Prepare a senior-level answer for architecture interviews with
            clear analogies, architecture diagrams, key terms, and real-world
            module federation examples.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Level", "Advanced"],
              ["Focus", "Architecture"],
              ["Practice", "Interview Answer"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <ArchitectureOverview />
      <ShoppingMallAnalogy />
      <CompleteArchitecture />
      <KeyTerms />
    </div>
  );
}
