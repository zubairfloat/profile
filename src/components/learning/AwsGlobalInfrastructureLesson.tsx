"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Blocks,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  Hospital,
  Layers3,
  Monitor,
  Network,
  RadioTower,
  RefreshCcw,
  Route,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RegionId = "us-east-1" | "us-west-2" | "eu-west-1" | "eu-central-1" | "ap-south-1" | "ap-southeast-1";
type RequestStepId = "browser" | "route53" | "cloudfront" | "alb" | "az" | "ec2" | "database" | "response";
type BuilderComponent = "Users" | "Route53" | "CloudFront" | "ALB" | "EC2" | "Lambda" | "RDS" | "S3" | "CloudWatch";
type DisasterRecoveryStrategy = [name: string, cost: string, description: string, nodes: string[]];
type QuizQuestion = [question: string, options: string[], answer: number, explanation: string];

const regions: Array<{
  id: RegionId;
  continent: string;
  label: string;
  x: number;
  y: number;
  azs: number;
  users: string;
  workloads: string[];
  latency: string;
}> = [
  { id: "us-east-1", continent: "North America", label: "N. Virginia", x: 24, y: 39, azs: 6, users: "US East, Canada, Latin America", workloads: ["enterprise APIs", "AI platforms", "commerce"], latency: "20-80ms" },
  { id: "us-west-2", continent: "North America", label: "Oregon", x: 15, y: 37, azs: 4, users: "US West and Pacific users", workloads: ["media", "gaming", "SaaS"], latency: "25-90ms" },
  { id: "eu-west-1", continent: "Europe", label: "Ireland", x: 47, y: 33, azs: 3, users: "UK and Western Europe", workloads: ["regulated apps", "analytics", "web apps"], latency: "20-70ms" },
  { id: "eu-central-1", continent: "Europe", label: "Frankfurt", x: 52, y: 36, azs: 3, users: "Central Europe", workloads: ["finance", "ERP", "commerce"], latency: "15-60ms" },
  { id: "ap-south-1", continent: "Asia", label: "Mumbai", x: 68, y: 52, azs: 3, users: "India, Pakistan, Sri Lanka", workloads: ["mobile APIs", "streaming", "marketplaces"], latency: "30-110ms" },
  { id: "ap-southeast-1", continent: "Asia", label: "Singapore", x: 76, y: 62, azs: 3, users: "Southeast Asia", workloads: ["fintech", "travel", "regional apps"], latency: "25-95ms" },
];

const requestJourney: Array<{ id: RequestStepId; name: string; icon: typeof Cloud; detail: string }> = [
  { id: "browser", name: "Browser", icon: User, detail: "A user enters your domain or opens the app." },
  { id: "route53", name: "Route 53", icon: Route, detail: "DNS translates the domain into the best AWS endpoint." },
  { id: "cloudfront", name: "CloudFront", icon: RadioTower, detail: "The edge checks whether it can serve cached content nearby." },
  { id: "alb", name: "Load Balancer", icon: Router, detail: "Traffic is spread across healthy application targets." },
  { id: "az", name: "AZ A", icon: Layers3, detail: "A healthy Availability Zone receives the request." },
  { id: "ec2", name: "EC2", icon: Server, detail: "The application server handles business logic." },
  { id: "database", name: "Database", icon: Database, detail: "Persistent data is read or written." },
  { id: "response", name: "Response", icon: Check, detail: "The result travels back to the browser." },
];

const drStrategies: DisasterRecoveryStrategy[] = [
  ["Backup Restore", "Lowest cost", "Restore from backups when needed", ["Backup vault", "Restore Region"]],
  ["Pilot Light", "Small core running", "Keep minimum services ready", ["DNS", "Core DB", "Scale apps"]],
  ["Warm Standby", "Scaled-down copy", "Run a smaller live environment", ["Primary", "Standby", "Promote"]],
  ["Multi Region", "Regional failover", "Route users to another Region", ["Region A", "Health check", "Region B"]],
  ["Active Active", "Always live", "Serve traffic from multiple Regions", ["Users", "Region A", "Region B"]],
];

const enterpriseServices = [
  ["Users", "Global visitors reaching the storefront", "Free", "Internal users, partners", "Customers browsing products and checkout"],
  ["CloudFront", "Global CDN and edge cache", "Data transfer and requests", "Fastly, Akamai", "Serve static assets and cached pages"],
  ["Next.js", "Frontend rendering and user experience", "Compute and hosting cost", "Static S3 site, SPA", "Product, cart, checkout, account UI"],
  ["API Gateway", "Managed API entry point", "Per request", "ALB, AppSync", "Secure API routing and throttling"],
  ["Lambda", "Serverless business logic", "Invocations and duration", "EC2, ECS", "Checkout, webhooks, background tasks"],
  ["SQS", "Queue for async work", "Requests", "EventBridge, Kafka", "Order processing and retries"],
  ["RDS", "Relational database", "Instance and storage", "Aurora, DynamoDB", "Orders, customers, payments"],
  ["CloudWatch", "Logs, metrics, alarms", "Ingest and retention", "Datadog, New Relic", "Production monitoring"],
  ["SNS", "Notifications and fanout", "Publish and delivery", "EventBridge", "Emails, alerts, downstream updates"],
];

const comparisonCards = [
  ["Region", "Availability Zone", "Geographic area", "Separate data center group inside a Region"],
  ["Edge Location", "CloudFront", "Physical cache site", "CDN service that uses edge locations"],
  ["EC2", "Lambda", "Virtual server you manage", "Function that runs without server management"],
  ["S3", "EBS", "Object storage for files", "Block disk for EC2 instances"],
];

const quizQuestions: QuizQuestion[] = [
  ["What keeps an app online if one data center fails?", ["Single EC2 instance", "Multiple Availability Zones", "One S3 bucket"], 1, "Multi-AZ design lets traffic shift to healthy zones."],
  ["What serves cached files closer to users?", ["CloudFront", "RDS", "IAM"], 0, "CloudFront uses edge locations to reduce latency."],
  ["What is a Region?", ["A geographic AWS area", "A firewall rule", "A billing alert"], 0, "Regions are geographic areas that contain Availability Zones."],
  ["Why use Local Zones?", ["Lower city-level latency", "Store passwords", "Replace DNS"], 0, "Local Zones bring selected AWS services closer to a city."],
  ["What is Outposts?", ["AWS hardware in your location", "A CDN cache", "A JavaScript framework"], 0, "Outposts extends AWS infrastructure into an on-premises site."],
];

function SectionHeader({ badge, title, description, icon: Icon }: { badge: string; title: string; description: string; icon: typeof Cloud }) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        <Icon className="mr-2 h-3.5 w-3.5" />
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline tracking-normal">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function GlowArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0.45 }}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className={cn("flex items-center justify-center text-primary", vertical ? "h-8" : "w-8")}
    >
      {vertical ? <ArrowDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </motion.div>
  );
}

function CloudNode({ label, active, icon: Icon }: { label: string; active?: boolean; icon: typeof Cloud }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative rounded-lg border p-4 text-center transition",
        active ? "border-primary/60 bg-primary/15 shadow-[0_0_30px_hsl(var(--primary)/0.25)]" : "border-white/10 bg-background/55"
      )}
    >
      <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
      <p className="text-sm font-semibold">{label}</p>
      {active ? <motion.span layoutId="active-pulse" className="absolute inset-0 rounded-lg border border-primary/40" /> : null}
    </motion.div>
  );
}

function AnimatedFlow({ items, activeIndex = -1 }: { items: Array<{ label: string; icon: typeof Cloud }>; activeIndex?: number }) {
  const flowStyle = { "--count": items.length } as CSSProperties & Record<"--count", number>;

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--count),minmax(0,1fr))]" style={flowStyle}>
      {items.map((item, index) => (
        <div key={item.label} className="flex flex-col items-center gap-3 md:flex-row">
          <CloudNode label={item.label} icon={item.icon} active={index === activeIndex} />
          {index < items.length - 1 ? (
            <>
              <div className="hidden md:block"><GlowArrow /></div>
              <div className="md:hidden"><GlowArrow vertical /></div>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function RequestAnimation() {
  const [step, setStep] = useState(0);
  const items = [
    { label: "User", icon: User },
    { label: "Internet", icon: Network },
    { label: "AWS Backbone", icon: Workflow },
    { label: "AWS Region", icon: Globe2 },
    { label: "Availability Zone", icon: Layers3 },
    { label: "Application", icon: Monitor },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Global Infrastructure"
        icon={Globe2}
        title="What is AWS Global Infrastructure?"
        description="It is the worldwide system of Regions, Availability Zones, edge locations, fiber networks, and services that lets applications run close to users and stay resilient."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={items} activeIndex={step} />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setStep((current) => (current + 1) % items.length)} className="rounded-full">
              Advance Request
            </Button>
            <Button onClick={() => setStep(0)} variant="outline" className="rounded-full border-white/10">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <p className="text-sm text-muted-foreground">Active layer: {items[step].label}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function WorldMap({ selected, onSelect }: { selected: RegionId; onSelect: (region: RegionId) => void }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-background/55 p-4">
      <svg viewBox="0 0 100 62" className="h-[320px] w-full">
        <defs>
          <linearGradient id="mapGlow" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path d="M7 22 C15 12 28 14 35 23 C30 30 18 33 8 28 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M43 21 C51 14 61 18 64 27 C59 34 47 34 41 29 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M64 31 C77 20 93 26 94 42 C86 55 69 53 60 43 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        <path d="M48 39 C57 41 58 55 50 59 C43 54 42 45 48 39 Z" fill="url(#mapGlow)" stroke="rgba(255,255,255,.18)" />
        {regions.map((region) => (
          <g key={region.id}>
            <motion.circle
              cx={region.x}
              cy={region.y}
              r={selected === region.id ? 3.8 : 2.4}
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="0.6"
              className="cursor-pointer"
              onClick={() => onSelect(region.id)}
              animate={{ opacity: selected === region.id ? [1, 0.55, 1] : 0.78 }}
              transition={{ duration: 1.4, repeat: selected === region.id ? Infinity : 0 }}
            />
            <text x={region.x + 3} y={region.y - 2} fill="rgba(255,255,255,.78)" fontSize="2.6">{region.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RegionVisualizer() {
  const [selected, setSelected] = useState<RegionId>("ap-south-1");
  const region = regions.find((item) => item.id === selected) ?? regions[0];
  const byContinent = regions.reduce<Record<string, typeof regions>>((acc, item) => {
    acc[item.continent] = [...(acc[item.continent] ?? []), item];
    return acc;
  }, {});

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Regions"
        icon={Globe2}
        title="Interactive AWS Region Map"
        description="A Region is a geographic AWS area. Click a Region to zoom into where users are, how many Availability Zones it has, and what workloads fit there."
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <WorldMap selected={selected} onSelect={setSelected} />
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <motion.div key={region.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">{region.continent}</Badge>
              <h3 className="mt-3 text-3xl font-headline">{region.id}</h3>
              <p className="text-sm text-muted-foreground">{region.label}</p>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Availability Zones" value={`${region.azs}`} />
              <Metric label="Typical Latency" value={region.latency} />
            </div>
            <VisualNote title="Nearby users" text={region.users} />
            <div className="flex flex-wrap gap-2">
              {region.workloads.map((workload) => (
                <Badge key={workload} variant="outline" className="border-white/10 bg-background/50">{workload}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Object.entries(byContinent).map(([continent, items]) => (
          <Card key={continent} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader><CardTitle className="text-lg">{continent}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Button key={item.id} size="sm" variant={selected === item.id ? "default" : "outline"} onClick={() => setSelected(item.id)} className="rounded-full border-white/10">
                  {item.id}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-headline text-primary">{value}</p>
    </div>
  );
}

function VisualNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/50 p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function AvailabilityZoneVisualizer() {
  const [failed, setFailed] = useState(false);
  const zones = ["AZ A", "AZ B", "AZ C"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Availability Zones"
        icon={Layers3}
        title="Animated Multi-AZ Region"
        description="Availability Zones are separate data center groups inside a Region. Multi-AZ architecture keeps traffic moving when one zone fails."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <p className="mb-5 text-center font-headline text-2xl">AWS Region</p>
            <div className="grid gap-4 lg:grid-cols-3">
              {zones.map((zone) => {
                const isFailed = failed && zone === "AZ B";
                return (
                  <motion.div
                    key={zone}
                    animate={{ opacity: isFailed ? 0.55 : 1, y: isFailed ? 8 : 0 }}
                    className={cn("rounded-lg border p-5", isFailed ? "border-red-300/50 bg-red-500/15" : "border-white/10 bg-background/55")}
                  >
                    <h3 className="text-center text-xl font-semibold">{zone}</h3>
                    <div className="mt-5 grid gap-3">
                      <CloudNode label="EC2" icon={Server} active={!isFailed && failed} />
                      <CloudNode label="Database" icon={Database} active={!isFailed && failed} />
                    </div>
                    {isFailed ? <p className="mt-4 text-center text-sm text-red-100">Unavailable</p> : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <CloudNode label="Traffic to AZ A" icon={Route} active={failed} />
            <CloudNode label={failed ? "AZ B failed" : "Traffic to AZ B"} icon={AlertTriangle} active={!failed} />
            <CloudNode label="Traffic to AZ C" icon={Route} active={failed} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setFailed(true)} className="rounded-full">Simulate AZ Failure</Button>
            <Button onClick={() => setFailed(false)} variant="outline" className="rounded-full border-white/10">Recover AZ</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function EdgeLocationVisualizer() {
  const [cached, setCached] = useState(false);
  const flow = cached
    ? [{ label: "User Pakistan", icon: User }, { label: "Edge Dubai", icon: RadioTower }, { label: "Cached Response", icon: Zap }]
    : [{ label: "User Pakistan", icon: User }, { label: "Edge Dubai", icon: RadioTower }, { label: "CloudFront Cache", icon: Cloud }, { label: "Region Mumbai", icon: Globe2 }];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Edge Locations"
        icon={RadioTower}
        title="CloudFront CDN Animation"
        description="The first request may reach the origin Region. The next request can be served directly from the nearby edge location."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={flow} activeIndex={cached ? 2 : 3} />
          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="First Request" value="600ms" />
            <Metric label="Second Request" value={cached ? "40ms" : "Waiting"} />
          </div>
          <Button onClick={() => setCached((current) => !current)} className="rounded-full">
            {cached ? "Show First Request" : "Serve From Edge"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function InfrastructureComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="AWS Backbone"
        icon={Workflow}
        title="Public Internet vs AWS Backbone"
        description="Public internet routes can be random and congested. AWS Backbone uses private fiber and optimized paths between AWS infrastructure."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          ["Public Internet", "Random routes", "Congested", "Slow", "border-red-300/35 bg-red-500/10"],
          ["AWS Backbone", "Private fiber", "Optimized", "Fast", "border-primary/35 bg-primary/10"],
        ].map(([title, one, two, three, tone]) => (
          <Card key={title} className={cn("border backdrop-blur-xl", tone)}>
            <CardContent className="space-y-5 p-6">
              <h3 className="text-2xl font-headline">{title}</h3>
              <AnimatedFlow
                items={[
                  { label: one, icon: Network },
                  { label: two, icon: Activity },
                  { label: three, icon: Gauge },
                ]}
                activeIndex={2}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LocalZonesOutposts() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader badge="Local Zones" icon={Building2} title="City-level Infrastructure" description="Local Zones place selected AWS services closer to a city when milliseconds matter." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "User", icon: User }, { label: "Local Zone", icon: Building2 }, { label: "Region", icon: Globe2 }]} activeIndex={1} />
              <div className="grid gap-3 sm:grid-cols-2">
                {["Gaming", "Video Editing", "Media Streaming", "Medical Imaging"].map((item) => (
                  <CloudNode key={item} label={item} icon={Monitor} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader badge="Outposts" icon={Hospital} title="Hybrid Cloud Animation" description="Outposts brings AWS-managed hardware into a customer location while syncing with AWS Cloud." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "Hospital", icon: Hospital }, { label: "Outposts Rack", icon: Server }, { label: "AWS Cloud", icon: Cloud }, { label: "Backup", icon: HardDrive }]} activeIndex={2} />
              <VisualNote title="Why it exists" text="Use Outposts when low latency, data residency, or local system dependencies require AWS-style infrastructure on premises." />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function RequestJourney() {
  const [active, setActive] = useState(0);
  const item = requestJourney[active];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Request Journey" icon={Route} title="Step-by-step Request Animation" description="Click through a full web request from browser to database and back." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={requestJourney.map((step) => ({ label: step.name, icon: step.icon }))} activeIndex={active} />
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-5">
            <item.icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActive((current) => Math.min(current + 1, requestJourney.length - 1))} className="rounded-full">Next Step</Button>
            <Button onClick={() => setActive(0)} variant="outline" className="rounded-full border-white/10">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FailureSimulation() {
  const [crashed, setCrashed] = useState(false);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="High Availability" icon={ShieldCheck} title="Single AZ vs Multi-AZ Failure Simulator" description="Crash an Availability Zone and compare what happens when the app has only one zone versus multiple healthy zones." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Single AZ</h3>
            <AnimatedFlow items={[{ label: "Single AZ", icon: Layers3 }, { label: crashed ? "Failure" : "Running", icon: crashed ? AlertTriangle : Check }, { label: crashed ? "Offline" : "Application", icon: Monitor }]} activeIndex={crashed ? 2 : 1} />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Multi AZ</h3>
            <AnimatedFlow items={[{ label: "AZ A", icon: Layers3 }, { label: crashed ? "AZ B Failed" : "AZ B", icon: crashed ? AlertTriangle : Layers3 }, { label: "AZ C", icon: Layers3 }, { label: "Running", icon: Check }]} activeIndex={crashed ? 3 : 1} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => setCrashed(true)} className="rounded-full">Crash AZ</Button>
        <Button onClick={() => setCrashed(false)} variant="outline" className="rounded-full border-white/10">Recover</Button>
      </div>
    </section>
  );
}

function DisasterRecovery() {
  const [active, setActive] = useState(0);
  const strategy = drStrategies[active];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Disaster Recovery" icon={RefreshCcw} title="Recovery Strategy Diagrams" description="Disaster recovery plans trade cost, speed, and complexity. Explore each strategy as a small architecture." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-2">
          {drStrategies.map((item, index) => (
            <Button key={item[0]} onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="justify-start rounded-lg border-white/10">
              {item[0]}
            </Button>
          ))}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{strategy[1]}</Badge>
              <h3 className="mt-3 text-3xl font-headline">{strategy[0]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{strategy[2]}</p>
            </div>
            <AnimatedFlow items={strategy[3].map((label) => ({ label, icon: label.includes("Region") ? Globe2 : label.includes("Backup") ? HardDrive : Cloud }))} activeIndex={1} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ArchitectureBuilder() {
  const [selected, setSelected] = useState<BuilderComponent[]>(["Users", "Route53", "CloudFront"]);
  const components: BuilderComponent[] = ["Users", "Route53", "CloudFront", "ALB", "EC2", "Lambda", "RDS", "S3", "CloudWatch"];
  const score = Math.min(100, 35 + selected.length * 7 + (selected.includes("CloudWatch") ? 10 : 0) + (selected.includes("CloudFront") ? 8 : 0));
  const latency = Math.max(35, 220 - selected.length * 12 - (selected.includes("CloudFront") ? 60 : 0));
  const availability = Math.min(99.99, 96 + selected.length * 0.32 + (selected.includes("ALB") ? 1.2 : 0));
  const cost = 25 + selected.length * 14 + (selected.includes("RDS") ? 40 : 0);

  function toggle(component: BuilderComponent) {
    setSelected((current) => current.includes(component) ? current.filter((item) => item !== component) : [...current, component]);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Architecture Playground" icon={Blocks} title="Build an AWS Architecture" description="Choose components, connect services visually, and watch score, latency, availability, and cost estimates change." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-2 p-5">
            {components.map((component) => (
              <motion.button
                key={component}
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(component)}
                className={cn("rounded-lg border p-3 text-left text-sm", selected.includes(component) ? "border-primary/45 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}
              >
                {component}
              </motion.button>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={selected.map((label) => ({ label, icon: label === "Users" ? Users : label === "RDS" ? Database : label === "CloudWatch" ? Activity : Cloud }))} activeIndex={selected.length - 1} />
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Score" value={`${score}/100`} />
              <Metric label="Latency" value={`${latency}ms`} />
              <Metric label="Availability" value={`${availability.toFixed(2)}%`} />
              <Metric label="Cost" value={`$${cost}/mo`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function EnterpriseArchitecture() {
  const [active, setActive] = useState(enterpriseServices[0]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Enterprise Architecture" icon={Workflow} title="Clickable Production Architecture" description="Click a service to see its purpose, pricing model, alternatives, and real-world usage." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <AnimatedFlow items={enterpriseServices.map(([label]) => ({ label, icon: label === "RDS" ? Database : label === "CloudWatch" ? Activity : label === "Users" ? Users : Cloud }))} activeIndex={enterpriseServices.findIndex((item) => item[0] === active[0])} />
            <div className="mt-6 flex flex-wrap gap-2">
              {enterpriseServices.map((service) => (
                <Button key={service[0]} size="sm" onClick={() => setActive(service)} variant={active[0] === service[0] ? "default" : "outline"} className="rounded-full border-white/10">
                  {service[0]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-3xl font-headline">{active[0]}</h3>
            <VisualNote title="Purpose" text={active[1]} />
            <VisualNote title="Pricing" text={active[2]} />
            <VisualNote title="Alternatives" text={active[3]} />
            <VisualNote title="Real-world usage" text={active[4]} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function VisualComparisons() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Visual Comparisons" icon={Sparkles} title="Common AWS Concepts Compared" description="These pairs are easier to understand side by side." />
      <div className="grid gap-5 md:grid-cols-2">
        {comparisonCards.map(([left, right, leftText, rightText]) => (
          <Card key={`${left}-${right}`} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_1fr]">
              <CloudNode label={left} icon={Cloud} />
              <div className="flex items-center justify-center text-xs font-semibold text-primary">VS</div>
              <CloudNode label={right} icon={Cloud} />
              <p className="text-sm leading-6 text-muted-foreground sm:col-span-1">{leftText}</p>
              <div />
              <p className="text-sm leading-6 text-muted-foreground sm:col-span-1">{rightText}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InteractiveQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = useMemo(() => quizQuestions.reduce((count, question, index) => count + (answers[index] === question[2] ? 1 : 0), 0), [answers]);
  const complete = answered === quizQuestions.length;

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Interactive Quiz" icon={Check} title="Infrastructure Quiz" description="Answers animate green or red, and the progress bar fills as you complete the quiz." />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-background">
        <motion.div className="h-full bg-primary" animate={{ width: `${(answered / quizQuestions.length) * 100}%` }} />
      </div>
      {complete ? (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center gap-2">
          {Array.from({ length: 18 }).map((_, index) => (
            <motion.span key={index} initial={{ y: -20, opacity: 1 }} animate={{ y: 90, opacity: 0 }} transition={{ duration: 1.2, delay: index * 0.03 }} className="h-2 w-2 rounded-full bg-primary" />
          ))}
        </div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map(([question, options, answer, explanation], questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <Card key={question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <p className="font-semibold">{question}</p>
                {options.map((option, optionIndex) => {
                  const selectedAnswer = selected === optionIndex;
                  const correctAnswer = answer === optionIndex;
                  return (
                    <motion.button
                      key={option}
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      animate={selectedAnswer ? { scale: [1, 1.02, 1] } : {}}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm",
                        selectedAnswer && correctAnswer && "border-primary/50 bg-primary/10 text-primary",
                        selectedAnswer && !correctAnswer && "border-red-300/40 bg-red-500/10 text-red-100",
                        !selectedAnswer && "border-white/10 bg-background/50"
                      )}
                    >
                      {option}
                    </motion.button>
                  );
                })}
                {selected !== undefined ? <p className="rounded-lg border border-white/10 bg-background/50 p-3 text-sm text-muted-foreground">{explanation}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Score: {correct} / {quizQuestions.length}</p>
    </section>
  );
}

function InteractiveTimeline() {
  const steps = ["Cloud Basics", "Infrastructure", "Compute", "Storage", "Networking", "Security", "Serverless", "Containers", "Monitoring", "Architecture", "Solutions Architect"];
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Learning Roadmap" icon={Route} title="Animated AWS Roadmap" description="This lesson sits at the infrastructure layer after cloud basics and before service deep dives." />
      <Card className="border-border/60 bg-card/45 p-6 backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className={cn("rounded-lg border p-4 text-center text-sm font-semibold", step === "Infrastructure" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function CloudDiagram() {
  const [active, setActive] = useState(0);
  const items = [
    { label: "Users", icon: Users },
    { label: "Edge Location", icon: RadioTower },
    { label: "AWS Region", icon: Globe2 },
    { label: "Availability Zones", icon: Layers3 },
    { label: "Application", icon: Monitor },
    { label: "Database", icon: Database },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Final Visual Summary" icon={Cloud} title="Infrastructure in One Picture" description="Click through the final diagram and trace how global infrastructure moves a user request toward an application and database." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={items} activeIndex={active} />
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Button key={item.label} size="sm" onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="rounded-full border-white/10">
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function AwsGlobalInfrastructureLesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Globe2 className="mr-2 h-3.5 w-3.5" />
            AWS Infrastructure
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            AWS Global <span className="gradient-text">Infrastructure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Learn Regions, Availability Zones, edge locations, AWS Backbone, Local Zones, Outposts, and resilient global architecture through visual simulations.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Regions", "Availability Zones", "Edge Locations", "High Availability"].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} className="rounded-lg border border-white/10 bg-card/45 px-4 py-5 backdrop-blur-xl">
                <Sparkles className="mx-auto mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <RequestAnimation />
      <RegionVisualizer />
      <AvailabilityZoneVisualizer />
      <EdgeLocationVisualizer />
      <InfrastructureComparison />
      <LocalZonesOutposts />
      <RequestJourney />
      <FailureSimulation />
      <DisasterRecovery />
      <ArchitectureBuilder />
      <EnterpriseArchitecture />
      <VisualComparisons />
      <InteractiveQuiz />
      <InteractiveTimeline />
      <CloudDiagram />
    </div>
  );
}
