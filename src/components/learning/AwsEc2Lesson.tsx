"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Check,
  ChevronRight,
  Clipboard,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  KeyRound,
  Layers3,
  Lock,
  Monitor,
  Network,
  Play,
  RefreshCcw,
  Route,
  Router,
  Scale,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VmId = "vm1" | "vm2" | "vm3" | "vm4";
type LaunchStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Port = 22 | 80 | 443;
type PricingKey = "ondemand" | "reserved" | "spot" | "savings" | "dedicated";
type BuilderComponent = "EC2" | "Load Balancer" | "Security Group" | "CloudWatch" | "RDS" | "S3" | "VPC" | "Auto Scaling";

const stats = ["Millions of EC2 Instances", "600+ Instance Types", "Multiple Pricing Models", "Auto Scaling", "Enterprise Ready"];
const floatingIcons = [Server, Cpu, HardDrive, Network, Cloud];

const navItems = [
  ["what-is-ec2", "What is EC2?"],
  ["virtual-machines", "Virtual Machines"],
  ["architecture", "EC2 Architecture"],
  ["launch", "Launching an Instance"],
  ["instance-types", "Instance Types"],
  ["ami", "AMI"],
  ["ebs", "EBS Storage"],
  ["security-groups", "Security Groups"],
  ["key-pairs", "Key Pairs"],
  ["elastic-ip", "Elastic IP"],
  ["auto-scaling", "Auto Scaling"],
  ["load-balancer", "Load Balancer"],
  ["pricing", "Pricing Models"],
  ["monitoring", "Monitoring"],
  ["enterprise", "Enterprise Architecture"],
  ["playground", "Interactive Playground"],
  ["best-practices", "Best Practices"],
  ["interview", "Interview Questions"],
  ["quiz", "Quiz"],
  ["summary", "Summary"],
];

const vmDetails = {
  vm1: { name: "VM 1", cpu: "2 vCPU", ram: "4 GB", storage: "40 GB EBS", os: "Amazon Linux 2023" },
  vm2: { name: "VM 2", cpu: "4 vCPU", ram: "16 GB", storage: "100 GB EBS", os: "Ubuntu Server" },
  vm3: { name: "VM 3", cpu: "8 vCPU", ram: "32 GB", storage: "250 GB EBS", os: "Windows Server" },
  vm4: { name: "VM 4", cpu: "16 vCPU", ram: "64 GB", storage: "NVMe Instance Store", os: "Red Hat Enterprise Linux" },
} satisfies Record<VmId, { name: string; cpu: string; ram: string; storage: string; os: string }>;

const instanceTypes = [
  ["General Purpose", "Balanced CPU, memory, and networking", "Web apps, APIs, small databases", "Moderate", "t3, m7i, m8g"],
  ["Compute Optimized", "High CPU performance", "Batch jobs, gaming servers, CPU-heavy APIs", "Moderate to high", "c7i, c8g"],
  ["Memory Optimized", "Large RAM capacity", "In-memory cache, analytics, SAP, large DBs", "High", "r7i, x2idn"],
  ["Storage Optimized", "High local disk throughput", "Search, log processing, data warehouses", "High", "i4i, d3"],
  ["GPU Instances", "GPU acceleration", "AI training, rendering, video processing", "Very high", "g5, p5"],
  ["High Performance Computing", "Fast networking and CPU", "Scientific simulation, financial modeling", "High", "hpc7a"],
];

const pricingModels: Record<PricingKey, { title: string; pricing: string; flexibility: string; use: string; pros: string; cons: string }> = {
  ondemand: {
    title: "On Demand",
    pricing: "Pay by second or hour with no commitment.",
    flexibility: "Highest flexibility.",
    use: "Short-term workloads, experiments, unpredictable traffic.",
    pros: "Simple and commitment-free.",
    cons: "More expensive for steady production workloads.",
  },
  reserved: {
    title: "Reserved Instances",
    pricing: "Commit to 1 or 3 years for discount.",
    flexibility: "Low to medium flexibility.",
    use: "Predictable servers that run all year.",
    pros: "Good savings for stable usage.",
    cons: "Commitment can be wasteful if architecture changes.",
  },
  spot: {
    title: "Spot",
    pricing: "Use spare capacity at deep discount.",
    flexibility: "Interruptible.",
    use: "Batch jobs, CI workers, fault-tolerant processing.",
    pros: "Lowest price.",
    cons: "Instances can be reclaimed by AWS.",
  },
  savings: {
    title: "Savings Plans",
    pricing: "Commit to hourly spend for discount.",
    flexibility: "More flexible than many reservations.",
    use: "Modern production environments with predictable spend.",
    pros: "Discounts across instance families or compute services.",
    cons: "Still requires usage commitment.",
  },
  dedicated: {
    title: "Dedicated Hosts",
    pricing: "Pay for physical host capacity.",
    flexibility: "Specialized.",
    use: "License compliance, strict isolation, regulated workloads.",
    pros: "Physical host visibility and control.",
    cons: "More operational and cost complexity.",
  },
};

const enterpriseServices = [
  ["Users", "Customers or internal users send requests.", "No direct EC2 cost.", "Use CloudFront and DNS close to users.", "Global SaaS users accessing a production app."],
  ["CloudFront", "Caches static content and accelerates delivery.", "Requests and data transfer.", "Cache images, scripts, and public files.", "Serve frontend assets before traffic reaches EC2."],
  ["Load Balancer", "Distributes traffic to healthy instances.", "Hourly and LCU usage.", "Use health checks and target groups.", "Route traffic across multiple Availability Zones."],
  ["Auto Scaling Group", "Adds or removes EC2 instances.", "No extra ASG charge; pay for instances.", "Scale on CPU, requests, or scheduled demand.", "Handle campaign traffic without manual resizing."],
  ["EC2", "Runs application servers.", "Instance, storage, data transfer.", "Use roles, patching, monitoring, and immutable builds.", "Host Node.js, Java, .NET, Python, or Nginx workloads."],
  ["RDS", "Stores relational application data.", "Instance, storage, backup, IO.", "Use Multi-AZ and backups.", "Store orders, customers, and transactions."],
  ["S3", "Stores files, backups, and static assets.", "Storage, requests, transfer.", "Use lifecycle policies and bucket policies.", "Store uploads, logs, exports, and artifacts."],
  ["CloudWatch", "Monitors logs, metrics, alarms.", "Metric, log, alarm ingestion.", "Alert before users notice problems.", "CPU, disk, status checks, and app logs."],
  ["SNS", "Sends operational notifications.", "Publish and delivery.", "Notify teams on alarms.", "Send incident alerts when CPU or health checks fail."],
];

const codeExamples = [
  {
    title: "AWS CLI Launch EC2",
    code: `aws ec2 run-instances \\
  --image-id ami-0123456789abcdef0 \\
  --instance-type t3.micro \\
  --key-name app-key \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --iam-instance-profile Name=AppServerRole`,
    explanation: "Launches one EC2 instance with an AMI, instance type, key pair, security group, subnet, and IAM role.",
    best: "Use an IAM instance profile instead of storing AWS keys on the server.",
    mistake: "Launching into the wrong subnet or security group can expose the instance or block all access.",
    use: "Automated provisioning in a controlled learning or operations script.",
  },
  {
    title: "SSH into EC2",
    code: `chmod 400 app-key.pem

ssh -i app-key.pem ec2-user@203.0.113.10`,
    explanation: "Uses your private key to authenticate to a Linux EC2 instance.",
    best: "Restrict SSH to your IP or use AWS Systems Manager Session Manager.",
    mistake: "Never commit private keys to source control.",
    use: "Emergency access, learning labs, or low-level troubleshooting.",
  },
  {
    title: "Create Security Group",
    code: `aws ec2 create-security-group \\
  --group-name web-sg \\
  --description "Allow web traffic" \\
  --vpc-id vpc-0123456789abcdef0

aws ec2 authorize-security-group-ingress \\
  --group-id sg-0123456789abcdef0 \\
  --protocol tcp \\
  --port 443 \\
  --cidr 0.0.0.0/0`,
    explanation: "Creates a firewall-like security group and allows HTTPS traffic.",
    best: "Open public inbound ports only when the workload truly needs them.",
    mistake: "Opening SSH to 0.0.0.0/0 invites brute-force attempts.",
    use: "Public web server or load balancer target access control.",
  },
  {
    title: "Attach EBS Volume",
    code: `aws ec2 attach-volume \\
  --volume-id vol-0123456789abcdef0 \\
  --instance-id i-0123456789abcdef0 \\
  --device /dev/sdf`,
    explanation: "Attaches persistent block storage to a running EC2 instance.",
    best: "Snapshot important EBS volumes and encrypt sensitive data.",
    mistake: "Instance termination can delete root volumes if delete-on-termination is enabled.",
    use: "Add application data storage or separate logs from root disk.",
  },
  {
    title: "Auto Scaling Group",
    code: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name web-asg \\
  --launch-template LaunchTemplateName=web-template \\
  --min-size 2 \\
  --max-size 6 \\
  --desired-capacity 2 \\
  --vpc-zone-identifier subnet-a,subnet-b`,
    explanation: "Creates a group that keeps a desired number of EC2 instances running.",
    best: "Deploy across multiple Availability Zones.",
    mistake: "Scaling without health checks can keep broken instances in service.",
    use: "Production web tier that must survive instance failure.",
  },
  {
    title: "Terraform EC2",
    code: `resource "aws_instance" "web" {
  ami                    = "ami-0123456789abcdef0"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  iam_instance_profile   = aws_iam_instance_profile.web.name

  tags = {
    Name = "web-01"
  }
}`,
    explanation: "Defines an EC2 instance with infrastructure as code.",
    best: "Use modules and variables for repeatable environments.",
    mistake: "Hardcoding AMI IDs across regions can break deployments.",
    use: "Version-controlled infrastructure for teams.",
  },
  {
    title: "CloudFormation EC2",
    code: `Resources:
  WebInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0123456789abcdef0
      InstanceType: t3.micro
      SecurityGroupIds:
        - !Ref WebSecurityGroup
      IamInstanceProfile: !Ref WebInstanceProfile`,
    explanation: "Creates an EC2 instance through CloudFormation.",
    best: "Prefer launch templates and Auto Scaling Groups for production.",
    mistake: "Single standalone instances are fragile for critical apps.",
    use: "Simple labs, demos, or controlled internal services.",
  },
  {
    title: "User Data Script",
    code: `#!/bin/bash
yum update -y
yum install -y nginx
systemctl enable nginx
systemctl start nginx
echo "Hello from EC2" > /usr/share/nginx/html/index.html`,
    explanation: "Runs once at first boot to install and start Nginx.",
    best: "Keep user data short and move complex setup into AMIs or config management.",
    mistake: "Secrets in user data can be exposed through instance metadata or logs.",
    use: "Bootstrap web servers or install lightweight agents.",
  },
  {
    title: "Install Nginx on EC2",
    code: `sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx`,
    explanation: "Installs and starts Nginx on an Amazon Linux EC2 instance.",
    best: "Automate installation through user data, AMIs, or deployment tooling.",
    mistake: "Installing manually on every server creates configuration drift.",
    use: "Learning, troubleshooting, or validating a base image.",
  },
];

const bestPractices = ["Use IAM Roles", "Enable Monitoring", "Multi-AZ", "Auto Scaling", "Backups", "Security Groups", "Patch Regularly", "Least Privilege"];

const mistakes = [
  ["Opening Port 22 to Everyone", "SSH is exposed to the entire internet.", "Brute-force attempts and key scanning increase.", "Limit SSH to trusted IPs or use Session Manager."],
  ["No Backups", "EBS and app data are not recoverable.", "A deletion or failure can become permanent data loss.", "Use snapshots, AMIs, and tested restore plans."],
  ["No Auto Scaling", "Capacity stays fixed during traffic changes.", "Users see slow pages or downtime.", "Use Auto Scaling Groups and health checks."],
  ["Large Instance for Small Workload", "Oversized compute burns money.", "Monthly cost grows without performance benefit.", "Measure CPU and memory, then right-size."],
  ["Using Root User", "Root has too much power for daily work.", "Compromise can impact the whole account.", "Use IAM users, roles, SSO, and MFA."],
  ["No Monitoring", "Failures stay hidden.", "Incidents last longer and are harder to diagnose.", "Use CloudWatch metrics, logs, alarms, and dashboards."],
];

const interviewQuestions = [
  ["What is EC2?", "EC2 is Amazon Elastic Compute Cloud. It lets you rent virtual servers in AWS, choose the operating system, configure CPU and memory, attach storage, and run applications."],
  ["What is the difference between EC2 and Lambda?", "EC2 gives you server control and long-running compute. Lambda runs short-lived functions without managing servers. Use EC2 when you need OS control, custom runtimes, persistent processes, or special networking."],
  ["What is an AMI?", "An AMI is a template used to launch EC2 instances. It contains the operating system, optional software, configuration, and metadata needed to create a server."],
  ["What is EBS?", "EBS is persistent block storage for EC2. It behaves like a virtual disk attached to an instance and can survive instance stop/start cycles."],
  ["Difference between EBS and Instance Store?", "EBS is network-attached persistent storage. Instance Store is physically attached temporary storage that is lost when the instance stops or terminates."],
  ["What is a Security Group?", "A security group is a stateful virtual firewall for EC2 resources. It controls allowed inbound and outbound traffic by protocol, port, and source or destination."],
  ["What is Auto Scaling?", "Auto Scaling automatically adjusts the number of EC2 instances based on demand, health, schedule, or metrics."],
  ["What is an Application Load Balancer?", "An ALB distributes HTTP and HTTPS traffic across healthy targets such as EC2 instances, containers, or IP addresses."],
  ["What is an Elastic IP?", "An Elastic IP is a static public IPv4 address that can remain the same even when an instance is stopped or replaced."],
  ["How do you secure EC2?", "Use IAM roles, least privilege security groups, patching, encrypted EBS volumes, MFA for access, Session Manager where possible, monitoring, backups, and private subnets for non-public workloads."],
  ["What are EC2 pricing models?", "Common EC2 pricing models include On Demand, Reserved Instances, Spot Instances, Savings Plans, and Dedicated Hosts."],
  ["How do you monitor EC2?", "Use CloudWatch metrics, CloudWatch Agent for memory and disk, status checks, logs, alarms, dashboards, and SNS notifications."],
];

const quizQuestions = [
  ["What does EC2 provide?", ["Virtual servers in AWS", "Object storage only", "DNS only"], 0, "EC2 provides virtual machines called instances."],
  ["What stores persistent block data for EC2?", ["EBS", "Route 53", "IAM"], 0, "EBS volumes are persistent block storage for EC2."],
  ["What controls inbound ports for EC2?", ["Security Group", "AMI", "Savings Plan"], 0, "Security groups work like virtual firewalls."],
  ["Which port is commonly used for SSH?", ["22", "80", "443"], 0, "SSH commonly uses TCP port 22."],
  ["What is an AMI used for?", ["Launching instances from an image", "Caching web pages", "Sending email"], 0, "An AMI is a launch template for the operating system and base software."],
  ["What service distributes traffic across EC2 instances?", ["Application Load Balancer", "EBS", "CloudTrail"], 0, "An ALB routes traffic to healthy targets."],
  ["What adjusts instance count based on demand?", ["Auto Scaling", "Elastic IP", "Key Pair"], 0, "Auto Scaling adds or removes instances based on policies."],
  ["What pricing option can be interrupted?", ["Spot", "On Demand", "Dedicated Host only"], 0, "Spot uses spare AWS capacity and can be interrupted."],
  ["Why use an IAM role on EC2?", ["Avoid hardcoded AWS keys", "Make SSH public", "Disable monitoring"], 0, "Instance roles provide temporary credentials to applications."],
  ["What happens to a normal public IP after stop/start?", ["It can change", "It is always reserved", "It becomes private"], 0, "Normal public IPv4 addresses can change after stop/start."],
  ["What keeps a public IP stable?", ["Elastic IP", "EBS", "AMI"], 0, "Elastic IP is a static public IPv4 address."],
  ["What metric often triggers scale out?", ["High CPU", "Tag name", "AMI ID"], 0, "CPU utilization is a common scaling signal."],
  ["What should protect production web apps from one instance failure?", ["Load balancer and Auto Scaling", "One large instance", "Root login"], 0, "A load balancer and Auto Scaling group improve availability."],
  ["What should you do before patching critical EC2 workloads?", ["Plan backups or AMIs", "Open all ports", "Delete CloudWatch"], 0, "Backups and rollback plans reduce patch risk."],
  ["What should be avoided in user data?", ["Secrets", "Package installs", "Startup commands"], 0, "Secrets in user data can be exposed."],
];

function SectionHeader({ badge, title, description, icon: Icon }: { badge: string; title: string; description: string; icon: LucideIcon }) {
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
    <motion.div animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.3, repeat: Infinity }} className={cn("flex items-center justify-center text-primary", vertical ? "h-8" : "w-8")}>
      {vertical ? <ArrowDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </motion.div>
  );
}

function FlowNode({ label, icon: Icon, active, danger }: { label: string; icon: LucideIcon; active?: boolean; danger?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative rounded-lg border p-4 text-center transition",
        active && "border-primary/60 bg-primary/15 shadow-[0_0_28px_hsl(var(--primary)/0.22)]",
        danger && "border-red-300/45 bg-red-500/10 text-red-100",
        !active && !danger && "border-white/10 bg-background/55"
      )}
    >
      <Icon className={cn("mx-auto mb-2 h-6 w-6", danger ? "text-red-100" : "text-primary")} />
      <p className="text-sm font-semibold">{label}</p>
    </motion.div>
  );
}

function AnimatedFlow({ items, activeIndex = -1 }: { items: Array<{ label: string; icon: LucideIcon; danger?: boolean }>; activeIndex?: number }) {
  const flowStyle = { "--count": items.length } as CSSProperties & Record<"--count", number>;

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(var(--count),minmax(0,1fr))]" style={flowStyle}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex flex-col items-center gap-3 md:flex-row">
          <FlowNode label={item.label} icon={item.icon} active={activeIndex === index} danger={item.danger} />
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

function VisualNote({ title, text, danger }: { title: string; text: string; danger?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-4", danger ? "border-red-300/25 bg-red-500/10" : "border-white/10 bg-background/50")}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function CodeExample({ example }: { example: typeof codeExamples[number] }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/10 p-4">
        <CardTitle className="text-base">{example.title}</CardTitle>
        <Button size="icon" variant="ghost" onClick={copyCode} className="h-9 w-9 rounded-lg">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.2fr_0.8fr]">
        <pre className="overflow-auto bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
          <code>{example.code}</code>
        </pre>
        <div className="grid gap-3 border-t border-white/10 p-4 lg:border-l lg:border-t-0">
          <VisualNote title="Explanation" text={example.explanation} />
          <VisualNote title="Best practice" text={example.best} />
          <VisualNote title="Common mistake" text={example.mistake} danger />
          <VisualNote title="Real-world use case" text={example.use} />
        </div>
      </CardContent>
    </Card>
  );
}

function StickyLessonNav() {
  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-auto rounded-lg border border-white/10 bg-card/35 p-3 backdrop-blur-xl xl:block">
      <p className="mb-3 px-2 text-xs uppercase tracking-widest text-muted-foreground">Lesson</p>
      <div className="grid gap-1">
        {navItems.map(([id, label], index) => (
          <a key={id} href={`#${id}`} className="rounded-md px-3 py-2 text-xs text-muted-foreground transition hover:bg-primary/10 hover:text-primary">
            {index + 1}. {label}
          </a>
        ))}
      </div>
    </aside>
  );
}

function WhatIsEc2() {
  return (
    <section id="what-is-ec2" className="scroll-mt-24 py-10">
      <SectionHeader badge="EC2 Basics" icon={Server} title="What is EC2?" description="EC2 allows you to rent virtual computers in the cloud instead of buying and maintaining physical servers." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={[{ label: "Physical Server", icon: Server }, { label: "Virtual Machine", icon: Cpu }, { label: "EC2 Instance", icon: Cloud }, { label: "Application", icon: Monitor }]} activeIndex={2} />
          <div className="grid gap-4 md:grid-cols-3">
            <VisualNote title="What is it?" text="An EC2 instance is a virtual machine running in AWS. You choose the CPU, memory, operating system, network, and storage." />
            <VisualNote title="Why use it?" text="It gives you server-level control without buying hardware, waiting for data center capacity, or manually replacing failed machines." />
            <VisualNote title="Real-world example" text="A team can run a Node.js API on EC2 behind a load balancer and scale it during seasonal traffic." />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function VirtualMachineVisualization() {
  const [selected, setSelected] = useState<VmId>("vm1");
  const vm = vmDetails[selected];

  return (
    <section id="virtual-machines" className="scroll-mt-24 py-10">
      <SectionHeader badge="Virtual Machines" icon={Cpu} title="Inside an AWS Data Center" description="A physical server can host multiple isolated virtual machines. Each EC2 instance receives virtual CPU, memory, storage, networking, and an operating system." />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
              <p className="mb-5 text-center text-2xl font-headline">AWS Data Center - Physical Server</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(vmDetails) as VmId[]).map((id) => (
                  <button key={id} onClick={() => setSelected(id)} className={cn("rounded-lg border p-6 text-center transition", selected === id ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/55")}>
                    <Server className="mx-auto mb-3 h-7 w-7" />
                    <p className="font-semibold">{vmDetails[id].name}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-3xl font-headline">{vm.name}</h3>
            <VisualNote title="CPU" text={vm.cpu} />
            <VisualNote title="RAM" text={vm.ram} />
            <VisualNote title="Storage" text={vm.storage} />
            <VisualNote title="Operating System" text={vm.os} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Ec2Architecture() {
  const [active, setActive] = useState(0);
  const flow = [
    { label: "User", icon: Users },
    { label: "Route 53", icon: Route },
    { label: "Load Balancer", icon: Router },
    { label: "EC2 Instance", icon: Server },
    { label: "Database", icon: Database },
    { label: "Response", icon: Check },
  ];

  return (
    <section id="architecture" className="scroll-mt-24 py-10">
      <SectionHeader badge="Architecture" icon={Workflow} title="EC2 Request Flow" description="A production EC2 app usually sits behind DNS, a load balancer, security groups, and a database." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={flow} activeIndex={active} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActive((current) => (current + 1) % flow.length)} className="rounded-full">Advance Request</Button>
            <Button onClick={() => setActive(0)} variant="outline" className="rounded-full border-white/10">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function LaunchWizard() {
  const [step, setStep] = useState<LaunchStep>(0);
  const [instanceType, setInstanceType] = useState("t3.micro");
  const [storage, setStorage] = useState(30);
  const base = instanceType === "t3.micro" ? 8 : instanceType === "m7i.large" ? 70 : 140;
  const cost = base + storage * 0.1;
  const steps = ["Choose Region", "Choose AMI", "Choose Instance Type", "Configure Storage", "Configure Security Group", "Create Key Pair", "Launch Instance"];

  return (
    <section id="launch" className="scroll-mt-24 py-10">
      <SectionHeader badge="Launch Wizard" icon={Play} title="Launch an EC2 Instance" description="Walk through the major choices behind every EC2 launch and see the estimated monthly cost change." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={steps.map((label) => ({ label, icon: label.includes("Storage") ? HardDrive : label.includes("Security") ? Shield : label.includes("Key") ? KeyRound : Cloud }))} activeIndex={step} />
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-lg border border-white/10 bg-background/50 p-5">
              <h3 className="text-xl font-semibold">{steps[step]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step === 0 && "Choose a Region close to users and compliant with data requirements."}
                {step === 1 && "Choose an AMI such as Amazon Linux, Ubuntu, Windows, or a hardened custom image."}
                {step === 2 && "Choose compute capacity that matches the workload instead of guessing too large."}
                {step === 3 && "Choose EBS storage size, type, encryption, and delete-on-termination behavior."}
                {step === 4 && "Open only required ports. Public web apps usually need 443, not broad SSH access."}
                {step === 5 && "Create or select a key pair for Linux SSH access, or use Session Manager."}
                {step === 6 && "Launch the instance, then monitor health, cost, and security posture."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => setStep((current) => (current >= 6 ? 6 : ((current + 1) as LaunchStep)))} className="rounded-full">Next Step</Button>
                <Button onClick={() => setStep(0)} variant="outline" className="rounded-full border-white/10"><RefreshCcw className="mr-2 h-4 w-4" />Reset</Button>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-sm font-semibold">Instance Type</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["t3.micro", "m7i.large", "c7i.xlarge"].map((type) => (
                    <Button key={type} size="sm" onClick={() => setInstanceType(type)} variant={instanceType === type ? "default" : "outline"} className="rounded-full border-white/10">{type}</Button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-sm font-semibold">Storage: {storage} GB</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[30, 100, 250].map((size) => (
                    <Button key={size} size="sm" onClick={() => setStorage(size)} variant={storage === size ? "default" : "outline"} className="rounded-full border-white/10">{size} GB</Button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Estimated monthly cost</p>
                <p className="mt-2 text-4xl font-headline text-primary">${cost.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function InstanceTypes() {
  return (
    <section id="instance-types" className="scroll-mt-24 py-10">
      <SectionHeader badge="Instance Types" icon={Cpu} title="Choose the Right EC2 Family" description="Instance families are tuned for different workload shapes. Start with the workload, then choose CPU, memory, storage, GPU, and network capacity." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {instanceTypes.map(([title, spec, use, price, example]) => (
          <Card key={title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-4 p-5">
              <Cpu className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-headline">{title}</h3>
              <VisualNote title="CPU and memory" text={spec} />
              <VisualNote title="Best use cases" text={use} />
              <VisualNote title="Pricing" text={price} />
              <VisualNote title="Enterprise example" text={example} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AmiAndStorage() {
  const [storageMode, setStorageMode] = useState<"ebs" | "instance">("ebs");

  return (
    <>
      <section id="ami" className="scroll-mt-24 py-10">
        <SectionHeader badge="AMI" icon={HardDrive} title="Amazon Machine Images" description="An AMI is the image used to launch an EC2 instance. It can include an operating system, software, security hardening, and configuration." />
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={[{ label: "AMI", icon: HardDrive }, { label: "Operating System", icon: Monitor }, { label: "Installed Software", icon: Code2 }, { label: "Configuration", icon: Workflow }, { label: "Launch EC2", icon: Server }]} activeIndex={4} />
            <div className="grid gap-3 md:grid-cols-4">
              {["Ubuntu", "Amazon Linux", "Windows Server", "Red Hat"].map((ami) => <FlowNode key={ami} label={ami} icon={Monitor} />)}
            </div>
          </CardContent>
        </Card>
      </section>
      <section id="ebs" className="scroll-mt-24 py-10">
        <SectionHeader badge="EBS Storage" icon={HardDrive} title="Persistent Storage for EC2" description="EBS volumes are network-attached disks that can persist independently from an EC2 instance." />
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={[{ label: "EC2", icon: Server }, { label: "EBS Volume", icon: HardDrive }, { label: "Persistent Storage", icon: Database }]} activeIndex={1} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStorageMode("ebs")} variant={storageMode === "ebs" ? "default" : "outline"} className="rounded-full border-white/10">EBS</Button>
              <Button onClick={() => setStorageMode("instance")} variant={storageMode === "instance" ? "default" : "outline"} className="rounded-full border-white/10">Instance Store</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <VisualNote title="Persistence" text={storageMode === "ebs" ? "Persists after stop/start and can be snapshotted." : "Temporary. Data is lost when the instance stops or terminates."} />
              <VisualNote title="Performance" text={storageMode === "ebs" ? "Choose gp3, io2, throughput, and IOPS based on workload." : "Very fast local disk for temporary data."} />
              <VisualNote title="Cost" text={storageMode === "ebs" ? "Pay for provisioned storage and performance." : "Included with supported instance types."} />
              <VisualNote title="Use cases" text={storageMode === "ebs" ? "Boot volumes, app data, databases, logs." : "Cache, buffers, scratch data, temporary processing."} />
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function SecurityGroups() {
  const [openPorts, setOpenPorts] = useState<Port[]>([443]);
  const ports: Array<{ port: Port; label: string }> = [{ port: 22, label: "SSH" }, { port: 80, label: "HTTP" }, { port: 443, label: "HTTPS" }];

  function toggle(port: Port) {
    setOpenPorts((current) => current.includes(port) ? current.filter((item) => item !== port) : [...current, port]);
  }

  return (
    <section id="security-groups" className="scroll-mt-24 py-10">
      <SectionHeader badge="Security Groups" icon={Shield} title="EC2 Firewall Animation" description="Security groups control which traffic can reach an EC2 instance. Keep inbound access as narrow as possible." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={[{ label: "Internet", icon: Globe2 }, { label: "Security Group", icon: Shield }, { label: "EC2", icon: Server }]} activeIndex={1} />
          <div className="grid gap-3 md:grid-cols-3">
            {ports.map(({ port, label }) => {
              const open = openPorts.includes(port);
              return (
                <button key={port} onClick={() => toggle(port)} className={cn("rounded-lg border p-5 text-left", open ? "border-primary/45 bg-primary/10 text-primary" : "border-red-300/30 bg-red-500/10 text-red-100")}>
                  {open ? <Check className="mb-3 h-5 w-5" /> : <X className="mb-3 h-5 w-5" />}
                  <p className="font-semibold">{port} {label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{open ? "Allowed" : "Denied"}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function KeyPairsAndElasticIp() {
  const [elastic, setElastic] = useState(false);

  return (
    <>
      <section id="key-pairs" className="scroll-mt-24 py-10">
        <SectionHeader badge="Key Pairs" icon={KeyRound} title="SSH Authentication" description="A key pair lets you authenticate to Linux instances without password login." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "Private Key", icon: KeyRound }, { label: "Authentication", icon: Lock }, { label: "EC2", icon: Server }, { label: "Access Granted", icon: Check }]} activeIndex={3} />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <VisualNote title="Password Login" text="Easy to guess, reuse, leak, and brute force. Usually disabled for Linux EC2." danger />
              <VisualNote title="SSH Key Login" text="Uses private/public key cryptography. Safer when private keys are protected and rotated." />
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="elastic-ip" className="scroll-mt-24 py-10">
        <SectionHeader badge="Elastic IP" icon={Globe2} title="Stable Public IP Address" description="Normal public IPs can change after stop/start. Elastic IPs stay the same until you release them." />
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={elastic ? [{ label: "Elastic IP", icon: Globe2 }, { label: "Stop Instance", icon: Server }, { label: "IP Stays Same", icon: Check }] : [{ label: "Normal Public IP", icon: Globe2 }, { label: "Stop Instance", icon: Server }, { label: "IP Changes", icon: AlertTriangle, danger: true }]} activeIndex={2} />
            <Button onClick={() => setElastic((current) => !current)} className="rounded-full">{elastic ? "Show Normal Public IP" : "Use Elastic IP"}</Button>
            <VisualNote title="Real-world scenario" text="Use Elastic IP when an allowlist, legacy integration, or emergency failover process requires a stable public IPv4 address." />
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function AutoScalingSimulator() {
  const [traffic, setTraffic] = useState(100);
  const instances = traffic > 500 ? 4 : traffic > 250 ? 2 : 1;
  const cpu = Math.min(95, Math.round(traffic / instances / 7));

  return (
    <section id="auto-scaling" className="scroll-mt-24 py-10">
      <SectionHeader badge="Auto Scaling" icon={Scale} title="Traffic Simulator" description="Auto Scaling adds instances when demand grows and removes them when demand drops." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={[{ label: `${traffic} Users`, icon: Users }, { label: `${instances} EC2`, icon: Server }, { label: `${cpu}% CPU`, icon: Gauge, danger: cpu > 80 }, { label: "Auto Scaling", icon: Scale }, { label: `${instances} Running`, icon: Check }]} activeIndex={cpu > 80 ? 3 : 4} />
          <div className="flex flex-wrap gap-2">
            {[100, 300, 700].map((value) => <Button key={value} onClick={() => setTraffic(value)} variant={traffic === value ? "default" : "outline"} className="rounded-full border-white/10">{value} Users</Button>)}
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {Array.from({ length: instances }).map((_, index) => <FlowNode key={index} label={`EC2 ${index + 1}`} icon={Server} active />)}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-background">
            <motion.div className={cn("h-full", cpu > 80 ? "bg-red-400" : "bg-primary")} animate={{ width: `${cpu}%` }} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function LoadBalancerSection() {
  const [failed, setFailed] = useState(false);
  const targets = ["EC2 A", "EC2 B", "EC2 C"];

  return (
    <section id="load-balancer" className="scroll-mt-24 py-10">
      <SectionHeader badge="Load Balancer" icon={Router} title="Distribute Requests Across EC2" description="An Application Load Balancer sends traffic to healthy EC2 instances and avoids failed targets." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={[{ label: "Users", icon: Users }, { label: "Application Load Balancer", icon: Router }, { label: failed ? "EC2 B Failed" : "EC2 Targets", icon: failed ? AlertTriangle : Server, danger: failed }]} activeIndex={1} />
          <div className="grid gap-3 md:grid-cols-3">
            {targets.map((target) => {
              const bad = failed && target === "EC2 B";
              return <FlowNode key={target} label={bad ? `${target} Offline` : target} icon={bad ? X : Server} active={!bad} danger={bad} />;
            })}
          </div>
          <Button onClick={() => setFailed((current) => !current)} className="rounded-full">{failed ? "Recover EC2 B" : "Simulate Server Failure"}</Button>
        </CardContent>
      </Card>
    </section>
  );
}

function PricingModels() {
  const [selected, setSelected] = useState<PricingKey>("ondemand");
  const model = pricingModels[selected];

  return (
    <section id="pricing" className="scroll-mt-24 py-10">
      <SectionHeader badge="Pricing" icon={Gauge} title="EC2 Pricing Models" description="EC2 cost depends on instance family, region, storage, data transfer, and pricing model." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-2">
          {(Object.keys(pricingModels) as PricingKey[]).map((key) => <Button key={key} onClick={() => setSelected(key)} variant={selected === key ? "default" : "outline"} className="justify-start rounded-lg border-white/10">{pricingModels[key].title}</Button>)}
        </div>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <h3 className="text-3xl font-headline md:col-span-2">{model.title}</h3>
            <VisualNote title="Pricing" text={model.pricing} />
            <VisualNote title="Flexibility" text={model.flexibility} />
            <VisualNote title="Best use cases" text={model.use} />
            <VisualNote title="Pros" text={model.pros} />
            <VisualNote title="Cons" text={model.cons} danger />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MonitoringDashboard() {
  const [cpu, setCpu] = useState(62);
  const metrics = [
    ["CPU", cpu],
    ["Memory", 54],
    ["Disk", 41],
    ["Network", 68],
    ["Status Checks", 100],
  ] as const;

  return (
    <section id="monitoring" className="scroll-mt-24 py-10">
      <SectionHeader badge="Monitoring" icon={Activity} title="CloudWatch Dashboard" description="Monitor EC2 health with CPU, memory, disk, network, status checks, logs, dashboards, and alarms." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setCpu(62)} variant={cpu === 62 ? "default" : "outline"} className="rounded-full border-white/10">Normal CPU</Button>
            <Button onClick={() => setCpu(88)} variant={cpu === 88 ? "default" : "outline"} className="rounded-full border-white/10">Spike CPU</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {metrics.map(([name, value]) => (
              <div key={name} className="rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-sm font-semibold">{name}</p>
                <div className="mt-3 h-24 rounded-lg border border-white/10 bg-background/70 p-2">
                  <motion.div className={cn("mt-auto rounded-t", name === "CPU" && value > 80 ? "bg-red-400" : "bg-primary")} animate={{ height: `${value}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{value}%</p>
              </div>
            ))}
          </div>
          {cpu > 80 ? <VisualNote title="CloudWatch Alarm" text="CPU exceeded 80%. Notify SNS, scale out, or investigate application load." danger /> : null}
        </CardContent>
      </Card>
    </section>
  );
}

function EnterpriseArchitecture() {
  const [active, setActive] = useState(enterpriseServices[0]);

  return (
    <section id="enterprise" className="scroll-mt-24 py-10">
      <SectionHeader badge="Enterprise Architecture" icon={Workflow} title="Production EC2 Architecture" description="Click each service to understand purpose, pricing, best practice, and enterprise usage." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={enterpriseServices.map(([label]) => ({ label, icon: label === "Users" ? Users : label === "EC2" ? Server : label === "RDS" ? Database : label === "CloudWatch" ? Activity : Cloud }))} activeIndex={enterpriseServices.findIndex((item) => item[0] === active[0])} />
            <div className="flex flex-wrap gap-2">
              {enterpriseServices.map((service) => <Button key={service[0]} size="sm" onClick={() => setActive(service)} variant={active[0] === service[0] ? "default" : "outline"} className="rounded-full border-white/10">{service[0]}</Button>)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-3xl font-headline">{active[0]}</h3>
            <VisualNote title="Purpose" text={active[1]} />
            <VisualNote title="Pricing" text={active[2]} />
            <VisualNote title="Best practice" text={active[3]} />
            <VisualNote title="Enterprise example" text={active[4]} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfrastructurePlayground() {
  const [selected, setSelected] = useState<BuilderComponent[]>(["VPC", "EC2", "Security Group"]);
  const components: BuilderComponent[] = ["EC2", "Load Balancer", "Security Group", "CloudWatch", "RDS", "S3", "VPC", "Auto Scaling"];
  const cost = 35 + selected.length * 18 + (selected.includes("RDS") ? 60 : 0);
  const availability = Math.min(99, 75 + selected.length * 2.2 + (selected.includes("Load Balancer") ? 7 : 0) + (selected.includes("Auto Scaling") ? 8 : 0));
  const scalability = Math.min(100, 30 + selected.length * 7 + (selected.includes("Auto Scaling") ? 25 : 0));
  const security = Math.min(100, 35 + selected.length * 5 + (selected.includes("Security Group") ? 20 : 0) + (selected.includes("CloudWatch") ? 10 : 0));

  function toggle(component: BuilderComponent) {
    setSelected((current) => current.includes(component) ? current.filter((item) => item !== component) : [...current, component]);
  }

  return (
    <section id="playground" className="scroll-mt-24 py-10">
      <SectionHeader badge="Playground" icon={Layers3} title="Build EC2 Infrastructure" description="Choose components and watch estimated cost, availability, scalability, and security change." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-2 p-5">
            {components.map((component) => <motion.button key={component} drag dragSnapToOrigin onClick={() => toggle(component)} className={cn("rounded-lg border p-3 text-left text-sm", selected.includes(component) ? "border-primary/45 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}>{component}</motion.button>)}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={selected.map((label) => ({ label, icon: label === "EC2" ? Server : label === "RDS" ? Database : label === "CloudWatch" ? Activity : Cloud }))} activeIndex={selected.length - 1} />
            <div className="grid gap-3 sm:grid-cols-4">
              <VisualNote title="Estimated Cost" text={`$${cost}/mo`} />
              <VisualNote title="Availability" text={`${availability.toFixed(1)}%`} />
              <VisualNote title="Scalability" text={`${scalability}/100`} />
              <VisualNote title="Security" text={`${security}/100`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function BestPracticesAndMistakes() {
  const [done, setDone] = useState<string[]>(bestPractices.slice(0, 3));
  const [activeMistake, setActiveMistake] = useState(mistakes[0]);

  function toggle(item: string) {
    setDone((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  return (
    <>
      <section id="best-practices" className="scroll-mt-24 py-10">
        <SectionHeader badge="Best Practices" icon={Check} title="Production EC2 Checklist" description="Reliable EC2 environments are patched, monitored, backed up, least-privilege, and built across failure boundaries." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {bestPractices.map((item) => {
            const complete = done.includes(item);
            return <button key={item} onClick={() => toggle(item)} className={cn("rounded-lg border p-4 text-left transition", complete ? "border-primary/45 bg-primary/10 text-primary" : "border-white/10 bg-card/45")}><Check className="mb-3 h-5 w-5" /><p className="font-semibold">{item}</p></button>;
          })}
        </div>
      </section>
      <section id="mistakes" className="scroll-mt-24 py-10">
        <SectionHeader badge="Common Mistakes" icon={AlertTriangle} title="EC2 Mistakes to Avoid" description="Most EC2 problems come from broad network access, weak recovery planning, poor sizing, or missing monitoring." />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3">
            {mistakes.map((mistake) => <button key={mistake[0]} onMouseEnter={() => setActiveMistake(mistake)} onClick={() => setActiveMistake(mistake)} className={cn("rounded-lg border p-4 text-left", activeMistake[0] === mistake[0] ? "border-red-300/45 bg-red-500/10 text-red-100" : "border-white/10 bg-card/45")}><X className="mb-2 h-5 w-5" /><p className="font-semibold">{mistake[0]}</p></button>)}
          </div>
          <Card className="border-red-300/25 bg-red-500/10 backdrop-blur-xl">
            <CardContent className="grid gap-3 p-5">
              <VisualNote title="Problem" text={activeMistake[1]} danger />
              <VisualNote title="Impact" text={activeMistake[2]} danger />
              <VisualNote title="Solution" text={activeMistake[3]} />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function InterviewQuestions() {
  return (
    <section id="interview" className="scroll-mt-24 py-10">
      <SectionHeader badge="Interview Prep" icon={Terminal} title="EC2 Interview Questions" description="Detailed beginner-friendly answers for common EC2 interview and architecture conversations." />
      <div className="grid gap-4 lg:grid-cols-2">
        {interviewQuestions.map(([question, answer]) => (
          <Card key={question} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-5">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
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
    <section id="quiz" className="scroll-mt-24 py-10">
      <SectionHeader badge="Interactive Quiz" icon={Check} title="EC2 Knowledge Check" description="Answer each question and get immediate visual feedback, explanations, progress, and score." />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-background">
        <motion.div className="h-full bg-primary" animate={{ width: `${(answered / quizQuestions.length) * 100}%` }} />
      </div>
      {complete ? <div className="mb-5 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">Quiz complete. Score: {correct} / {quizQuestions.length}</div> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map(([question, options, answer, explanation], questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <Card key={question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <p className="font-semibold">{question}</p>
                {options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = answer === optionIndex;
                  return (
                    <motion.button key={option} onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))} animate={isSelected ? { scale: [1, 1.02, 1] } : {}} className={cn("w-full rounded-lg border p-3 text-left text-sm", isSelected && isCorrect && "border-primary/50 bg-primary/10 text-primary", isSelected && !isCorrect && "border-red-300/40 bg-red-500/10 text-red-100", !isSelected && "border-white/10 bg-background/50")}>{option}</motion.button>
                  );
                })}
                {selected !== undefined ? <VisualNote title={selected === answer ? "Correct" : "Not quite"} text={explanation} danger={selected !== answer} /> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">Score: {correct} / {quizQuestions.length}</p>
        <Button onClick={() => setAnswers({})} variant="outline" className="rounded-full border-white/10">Restart</Button>
      </div>
    </section>
  );
}

function CodeExamples() {
  return (
    <section id="code" className="scroll-mt-24 py-10">
      <SectionHeader badge="Code Examples" icon={Code2} title="Copy-ready EC2 Examples" description="Production-oriented command and infrastructure examples with explanation, best practice, mistake, and use case." />
      <div className="grid gap-6">
        {codeExamples.map((example) => <CodeExample key={example.title} example={example} />)}
      </div>
    </section>
  );
}

function VisualSummary() {
  const [active, setActive] = useState(2);
  const summary = [
    { label: "Users", icon: Users },
    { label: "Load Balancer", icon: Router },
    { label: "EC2", icon: Server },
    { label: "Auto Scaling", icon: Scale },
    { label: "Database", icon: Database },
    { label: "Storage", icon: HardDrive },
    { label: "Monitoring", icon: Activity },
  ];

  return (
    <section id="summary" className="scroll-mt-24 py-10">
      <SectionHeader badge="Visual Summary" icon={Sparkles} title="EC2 in One Infographic" description="Click through the final diagram to review how EC2 fits into a scalable cloud architecture." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={summary} activeIndex={active} />
          <div className="flex flex-wrap gap-2">
            {summary.map((item, index) => <Button key={item.label} size="sm" onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="rounded-full border-white/10">{item.label}</Button>)}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function AwsEc2Lesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-72 max-w-5xl">
          {floatingIcons.map((Icon, index) => (
            <motion.div key={index} animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }} transition={{ duration: 4 + index * 0.35, repeat: Infinity, delay: index * 0.25 }} className="absolute rounded-lg border border-white/10 bg-card/35 p-3 text-primary backdrop-blur-xl" style={{ left: `${11 + index * 19}%`, top: `${index % 2 === 0 ? 10 : 50}%` }}>
              <Icon className="h-6 w-6" />
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Server className="mr-2 h-3.5 w-3.5" />
            AWS Compute
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            Amazon EC2 <span className="gradient-text">(Elastic Compute Cloud)</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Launch secure, scalable virtual servers in the AWS Cloud.
          </p>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
            Learn how EC2 powers millions of enterprise applications by providing scalable virtual machines with complete control over operating systems, networking, storage, and security.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <motion.div key={stat} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} className="rounded-lg border border-white/10 bg-card/45 px-4 py-5 backdrop-blur-xl">
                <Gauge className="mx-auto mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{stat}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto grid gap-8 px-4 xl:grid-cols-[240px_1fr]">
        <StickyLessonNav />
        <div className="min-w-0">
          <WhatIsEc2 />
          <VirtualMachineVisualization />
          <Ec2Architecture />
          <LaunchWizard />
          <InstanceTypes />
          <AmiAndStorage />
          <SecurityGroups />
          <KeyPairsAndElasticIp />
          <AutoScalingSimulator />
          <LoadBalancerSection />
          <PricingModels />
          <MonitoringDashboard />
          <EnterpriseArchitecture />
          <InfrastructurePlayground />
          <BestPracticesAndMistakes />
          <InterviewQuestions />
          <InteractiveQuiz />
          <CodeExamples />
          <VisualSummary />
        </div>
      </div>
    </div>
  );
}
