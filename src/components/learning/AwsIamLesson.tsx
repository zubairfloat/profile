"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDown,
  Check,
  ChevronRight,
  Clipboard,
  Cloud,
  Code2,
  Database,
  Eye,
  Github,
  KeyRound,
  Layers3,
  Lock,
  LockKeyhole,
  RefreshCcw,
  Route,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  User,
  UserCheck,
  UserCog,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UserId = "ahmed" | "ali" | "sarah" | "admin";
type PolicyField = "Version" | "Sid" | "Effect" | "Action" | "Resource" | "Condition";
type SimulatorRequest = "read-s3" | "delete-s3" | "launch-ec2" | "delete-rds";
type EvaluationStep = "authenticated" | "explicit-deny" | "allow" | "implicit-deny" | "decision";

const floatingIcons = [Lock, Cloud, ShieldCheck, UserCheck, KeyRound];

const iamTerms = [
  ["Identity", "A person or workload that signs in or makes a request."],
  ["Authentication", "Proves who the principal is."],
  ["Authorization", "Checks what the principal can do."],
  ["Permission", "An allowed or denied action on a resource."],
  ["Principal", "The user, role, application, or service making the request."],
];

const writtenLessons = {
  basics: {
    title: "How to think about IAM",
    paragraphs: [
      "IAM is the front door and the rules engine for AWS. Every meaningful AWS request has a caller, an action, and a target resource. IAM answers three questions: who is making the request, are they really who they claim to be, and are they allowed to perform this action on this resource?",
      "The most important mental model is default deny. A principal starts with no access. Access appears only when a policy explicitly allows it, and it disappears immediately if an explicit deny applies. This is why IAM feels strict at first: it is designed to make unsafe access harder to create by accident.",
      "In production, IAM is not just an account settings page. It is part of system design. It decides how developers deploy code, how Lambda reads a table, how EC2 downloads files, how CI/CD assumes roles, and how teams prove who changed what during an incident.",
    ],
    bullets: ["Start from no access", "Grant only required actions", "Prefer roles and temporary sessions", "Use MFA for human access"],
  },
  auth: {
    title: "Why the distinction matters",
    paragraphs: [
      "Authentication and authorization are separate checks. A user can successfully sign in and still be blocked from deleting a database. That is expected behavior. Signing in proves identity; it does not automatically grant meaningful AWS permissions.",
      "This separation is what lets companies give many people access to the same AWS account while keeping responsibilities isolated. A developer might view logs, a finance user might view billing, and a deployment role might update Lambda functions. They are all authenticated, but each is authorized differently.",
    ],
    bullets: ["Authentication: identity proof", "Authorization: permission decision", "MFA strengthens authentication", "Policies shape authorization"],
  },
  usersGroups: {
    title: "Users and groups in real teams",
    paragraphs: [
      "IAM users are best understood as named identities. They are useful for learning, legacy workflows, and some machine users, but modern AWS environments usually prefer federation, IAM Identity Center, and roles for day-to-day human access.",
      "Groups reduce repetitive permission work. Instead of attaching the same policy to Ahmed, Ali, and Sarah separately, attach it to Developers once. When a new developer joins, adding them to the group gives them the same baseline permissions. When policy changes, everyone in the group receives the update.",
      "Groups are not a replacement for careful permission design. A group should describe a job function, not a convenience bucket. Good names are things like Developers, ReadOnlyAudit, SecurityReviewers, and BillingViewers.",
    ],
    bullets: ["Use groups for job functions", "Avoid shared users", "Remove users promptly", "Review group membership regularly"],
  },
  groups: {
    title: "How group inheritance should feel",
    paragraphs: [
      "A group is a permission distribution tool. It is not an identity that signs in, and it is not something an application assumes. Its job is to collect users who need the same baseline access and attach policies once at the group level.",
      "This is useful when teams grow. If five developers need read-only S3 and CloudWatch access, the group keeps that rule consistent. If the security team later tightens the policy, the change happens in one place instead of five user profiles.",
      "Groups should stay simple. AWS IAM groups cannot contain other groups, so nested org charts do not belong here. For advanced workforce access, teams usually move toward IAM Identity Center, permission sets, and account assignments.",
    ],
    bullets: ["Groups contain users only", "Policies attached to groups affect every member", "Use names that match job responsibilities", "Keep privileged groups small"],
  },
  policies: {
    title: "Reading policies like a security engineer",
    paragraphs: [
      "A policy statement is a sentence written in JSON. Effect says allow or deny. Action says what API call is being attempted. Resource says what object, bucket, role, queue, table, or service the action applies to. Condition adds context such as MFA, source IP, VPC endpoint, request tag, or secure transport.",
      "The dangerous parts of a policy are usually broad actions and broad resources. Action star means every action for that service. Resource star means every resource that action can touch. Sometimes a star is required by AWS for specific actions, but it should be a deliberate choice, not a habit.",
      "When debugging policies, read them from the request backward: What action is the caller trying? What resource ARN is involved? Which identity, group, role, boundary, session, or resource policy could affect the decision? Then look for explicit deny before looking for allow.",
    ],
    bullets: ["Effect controls allow or deny", "Action maps to AWS API calls", "Resource scopes the target", "Condition adds context"],
  },
  roles: {
    title: "Why roles are the production default",
    paragraphs: [
      "A role is not a password-based user. It is an assumable identity. Something trusted assumes the role, AWS STS creates temporary credentials, and those credentials expire. This is why roles are safer for EC2, Lambda, ECS, EKS, GitHub Actions, and cross-account access.",
      "Roles have two sides. The trust policy answers who can assume the role. The permission policy answers what the role can do after it is assumed. New AWS learners often configure one side and forget the other, which causes either access denied errors or overly broad trust.",
      "Temporary credentials reduce blast radius. If a session token leaks, it stops working after expiration. That is still serious, but it is much safer than a long-term access key that remains valid for months.",
    ],
    bullets: ["Trust policy: who can assume", "Permission policy: what it can do", "STS issues temporary credentials", "Sessions should be short and scoped"],
  },
  evaluation: {
    title: "The permission decision in plain English",
    paragraphs: [
      "IAM does not search for the friendliest policy. It evaluates the full context and follows strict rules. Explicit deny wins first. If there is no explicit deny, IAM looks for a matching allow. If no matching allow exists, the request is denied by default.",
      "This means many access denied errors are not caused by a deny statement. They are caused by missing allow statements, incorrect resource ARNs, missing conditions, permission boundaries, service control policies, or session policies that narrow the final permissions.",
      "A practical debugging workflow is to identify the exact action from the error, identify the exact resource ARN, confirm the principal, then inspect every policy layer that can affect the request.",
    ],
    bullets: ["Explicit deny always wins", "No allow means implicit deny", "Boundaries can limit allowed actions", "Resource policies can also participate"],
  },
  crossAccountMfa: {
    title: "Enterprise access patterns",
    paragraphs: [
      "Cross-account access is common in mature AWS environments. Companies often separate production, staging, security, logging, and shared services into different accounts. Instead of creating duplicate users everywhere, they let trusted identities assume roles across account boundaries.",
      "MFA is a separate but equally important control for human access. A password is something a user knows. MFA adds something they have, such as an authenticator app, hardware key, or device approval. If the password leaks, the attacker still cannot complete the login without the second factor.",
    ],
    bullets: ["Use account separation for blast radius", "Trust specific roles, not everyone", "Require MFA for privileged actions", "Log role assumptions with CloudTrail"],
  },
  bestPractices: {
    title: "What good IAM looks like",
    paragraphs: [
      "Good IAM is boring in the best way. People have named identities. Daily access uses federation or roles. Production actions require MFA or approved automation. Workloads never store hardcoded keys. Policies are narrow enough that a mistake in one service does not become a full account compromise.",
      "You do not need perfect IAM on day one, but you do need a path toward better IAM. Start by removing root usage, enabling MFA, deleting unused users and keys, replacing static credentials with roles, and reviewing high-risk policies such as AdministratorAccess and wildcard permissions.",
    ],
    bullets: ["Review access regularly", "Prefer federation for people", "Prefer roles for workloads", "Monitor with CloudTrail and Access Analyzer"],
  },
  architecture: {
    title: "IAM as an architecture layer",
    paragraphs: [
      "In a real platform, IAM connects the human workflow and the runtime workflow. A developer authenticates through company identity. CI/CD receives temporary deployment access through OIDC. Applications receive service permissions through execution roles. Observability tools get read access without write access.",
      "This is why IAM belongs in architecture diagrams. It is not just security configuration after the app is built. The architecture should show which component assumes which role, which service can call another service, and which permissions are intentionally denied.",
    ],
    bullets: ["Map every principal", "Document every role assumption", "Separate deploy-time and runtime permissions", "Keep auditability visible"],
  },
};

const iamUsers = {
  ahmed: {
    name: "Ahmed",
    credentials: "Console password and one access key",
    console: "Enabled",
    policies: ["AmazonS3ReadOnlyAccess"],
    groups: ["Developers"],
    mfa: "Enabled",
    keyAge: "42 days",
  },
  ali: {
    name: "Ali",
    credentials: "Console password",
    console: "Enabled",
    policies: ["PowerUserAccess"],
    groups: ["Developers"],
    mfa: "Enabled",
    keyAge: "No active keys",
  },
  sarah: {
    name: "Sarah",
    credentials: "Access key for local CLI",
    console: "Disabled",
    policies: ["CloudWatchReadOnlyAccess"],
    groups: ["Developers", "Monitoring"],
    mfa: "Required",
    keyAge: "88 days",
  },
  admin: {
    name: "Admin",
    credentials: "Break-glass console login",
    console: "Restricted",
    policies: ["AdministratorAccess"],
    groups: ["Admins"],
    mfa: "Hardware MFA",
    keyAge: "No active keys",
  },
} satisfies Record<UserId, {
  name: string;
  credentials: string;
  console: string;
  policies: string[];
  groups: string[];
  mfa: string;
  keyAge: string;
}>;

const policyJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadProductImages",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::store-assets/*",
      "Condition": {
        "Bool": { "aws:SecureTransport": "true" }
      }
    }
  ]
}`;

const policyFields: Record<PolicyField, string> = {
  Version: "The policy language version. Most policies use 2012-10-17.",
  Sid: "A statement identifier that helps humans understand the policy block.",
  Effect: "Allow grants permission. Deny blocks permission and wins over Allow.",
  Action: "The API operations this statement covers, such as s3:GetObject.",
  Resource: "The AWS resource ARN the action applies to.",
  Condition: "Optional rules that must be true, such as requiring HTTPS or MFA.",
};

const simulatorRequests = {
  "read-s3": {
    label: "Read S3 Object",
    action: "s3:GetObject",
    outcome: "granted",
    why: "The Developers group allows read access to the store-assets bucket.",
  },
  "delete-s3": {
    label: "Delete S3 Bucket",
    action: "s3:DeleteBucket",
    outcome: "denied",
    why: "No policy allows bucket deletion, so IAM returns implicit deny.",
  },
  "launch-ec2": {
    label: "Launch EC2",
    action: "ec2:RunInstances",
    outcome: "granted",
    why: "The Admin role allows EC2 launch actions for this environment.",
  },
  "delete-rds": {
    label: "Delete RDS",
    action: "rds:DeleteDBInstance",
    outcome: "denied",
    why: "An explicit deny blocks destructive database deletion.",
  },
} satisfies Record<SimulatorRequest, {
  label: string;
  action: string;
  outcome: "granted" | "denied";
  why: string;
}>;

const evaluationSteps: Array<{ id: EvaluationStep; label: string; detail: string }> = [
  { id: "authenticated", label: "Is user authenticated?", detail: "IAM first checks that the caller is a known principal with valid credentials." },
  { id: "explicit-deny", label: "Explicit Deny?", detail: "Any matching Deny stops the request immediately." },
  { id: "allow", label: "Allow?", detail: "IAM looks for an Allow in identity, resource, boundary, or session policies." },
  { id: "implicit-deny", label: "Implicit Deny?", detail: "If there is no Allow, the request is denied by default." },
  { id: "decision", label: "Decision", detail: "The result is AccessGranted or AccessDenied." },
];

const codeExamples = [
  {
    title: "Basic IAM Policy JSON",
    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "cloudwatch:GetMetricData",
      "Resource": "*"
    }
  ]
}`,
    explanation: "Allows one CloudWatch read action. Keep Action narrow whenever possible.",
    mistakes: "Avoid starting with Action: * unless you are creating a temporary learning sandbox.",
    best: "Add exact actions and resources after you know the workflow.",
  },
  {
    title: "S3 Read Only Policy",
    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::store-assets",
        "arn:aws:s3:::store-assets/*"
      ]
    }
  ]
}`,
    explanation: "Lets a principal list a bucket and read objects from it.",
    mistakes: "ListBucket applies to the bucket ARN, while GetObject applies to object ARNs.",
    best: "Use bucket-specific ARNs instead of allowing every S3 bucket.",
  },
  {
    title: "EC2 Full Access Policy",
    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    }
  ]
}`,
    explanation: "Useful for a controlled lab, but too broad for most production users.",
    mistakes: "Do not attach broad EC2 access to every developer.",
    best: "Restrict by account, region, tags, and required EC2 actions.",
  },
  {
    title: "Cross Account Trust Policy",
    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111122223333:root" },
      "Action": "sts:AssumeRole"
    }
  ]
}`,
    explanation: "Lets trusted Account A assume a role in Account B.",
    mistakes: "Trusting an entire external account without conditions can be risky.",
    best: "Use external IDs, specific role ARNs, and least-privilege permissions.",
  },
  {
    title: "AssumeRole Example",
    code: `const command = new AssumeRoleCommand({
  RoleArn: "arn:aws:iam::444455556666:role/DeployRole",
  RoleSessionName: "github-actions-deploy"
});

const response = await stsClient.send(command);`,
    explanation: "Application code requests temporary credentials for a role.",
    mistakes: "Never log the returned access key, secret key, or session token.",
    best: "Use short sessions and scoped role permissions.",
  },
  {
    title: "AWS CLI Login",
    code: `aws configure sso

aws sso login --profile developer

aws sts get-caller-identity --profile developer`,
    explanation: "SSO avoids long-term access keys on developer laptops.",
    mistakes: "Do not share local profiles or credentials between people.",
    best: "Use IAM Identity Center or federation for human access.",
  },
  {
    title: "STS AssumeRole",
    code: `aws sts assume-role \\
  --role-arn arn:aws:iam::444455556666:role/ReadOnlyAuditRole \\
  --role-session-name audit-session`,
    explanation: "Returns temporary credentials for a trusted role.",
    mistakes: "Do not paste temporary credentials into source code.",
    best: "Export them only for the current terminal session or use profiles.",
  },
  {
    title: "Terraform IAM User",
    code: `resource "aws_iam_user" "developer" {
  name = "developer-ahmed"
  tags = {
    Team = "Platform"
  }
}`,
    explanation: "Creates an IAM user through infrastructure as code.",
    mistakes: "Avoid creating long-term access keys unless absolutely required.",
    best: "Prefer roles, SSO, and temporary credentials for regular access.",
  },
  {
    title: "CloudFormation IAM Role",
    code: `Resources:
  AppRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole`,
    explanation: "Creates a Lambda service role with a trust policy.",
    mistakes: "A role needs both a trust policy and permission policies.",
    best: "Attach only the permissions the Lambda function needs.",
  },
];

const bestPractices = [
  "Least Privilege",
  "Enable MFA",
  "Rotate Keys",
  "Use Roles",
  "Avoid Root User",
  "Temporary Credentials",
  "IAM Access Analyzer",
];

const mistakes = [
  ["AdministratorAccess Everywhere", "Too many principals can change everything.", "One leaked user can take over the account.", "Create scoped roles for each job."],
  ["Root User for Daily Work", "Root bypasses normal guardrails.", "A root compromise is account-level damage.", "Lock root away and enable MFA."],
  ["Long-term Access Keys", "Static keys can leak and live too long.", "Attackers reuse keys from repos or laptops.", "Use SSO, roles, and STS sessions."],
  ["Shared Accounts", "No clear audit trail.", "You cannot prove who did what.", "Give every person a unique identity."],
  ["Wildcard Permissions", "Actions and resources are too broad.", "Small mistakes become account-wide risk.", "Scope actions, resources, regions, and tags."],
];

const comparisons = [
  ["IAM User", "IAM Role", "Long-term identity for a person or workload.", "Assumable identity with temporary credentials."],
  ["IAM Group", "IAM Policy", "Collection of users.", "Document that defines permissions."],
  ["Authentication", "Authorization", "Who are you?", "What can you do?"],
  ["Permanent Credentials", "Temporary Credentials", "Long-lived keys that require rotation.", "Short-lived sessions that expire automatically."],
  ["Root User", "IAM User", "Account owner with unrestricted power.", "Scoped identity for daily work."],
];

const quizQuestions = [
  ["Who should use IAM Roles?", ["AWS services, workloads, and temporary access flows", "Only root users", "Only billing teams"], 0, "Roles are ideal for services, applications, federation, and cross-account access."],
  ["Why avoid using the Root User?", ["It has unrestricted account power", "It cannot log in", "It only reads S3"], 0, "The root user should be locked away and used only for rare account tasks."],
  ["What is least privilege?", ["Give only required permissions", "Give everyone admin", "Disable MFA"], 0, "Least privilege limits blast radius when something goes wrong."],
  ["Can an IAM Group contain another Group?", ["No", "Yes", "Only in another account"], 0, "IAM groups contain users, not other groups."],
  ["What wins if Allow and Explicit Deny both match?", ["Explicit Deny", "Allow", "Oldest policy"], 0, "Explicit Deny always wins."],
  ["What proves who a user is?", ["Authentication", "Authorization", "CloudWatch"], 0, "Authentication verifies identity."],
  ["What decides if an action is allowed?", ["Authorization", "A username only", "A billing alarm"], 0, "Authorization evaluates permissions."],
  ["Why use MFA?", ["Adds a second proof of identity", "Deletes unused users", "Stores S3 files"], 0, "MFA protects accounts even when a password is stolen."],
  ["What service issues temporary credentials?", ["STS", "S3", "Route 53"], 0, "AWS Security Token Service issues temporary credentials."],
  ["What should Lambda use to access DynamoDB?", ["Execution role", "Hardcoded access key", "Root password"], 0, "Lambda should use an IAM role with scoped permissions."],
];

const enterpriseServices = [
  ["Developer", "Human identity starts the deployment workflow.", "IAM requires a unique identity and MFA for accountability."],
  ["IAM", "Central policy engine for authentication and authorization.", "Every AWS request is evaluated against IAM controls."],
  ["GitHub Actions", "External CI system requests deployment access.", "OIDC avoids storing AWS keys in GitHub secrets."],
  ["OIDC", "Federated trust proves the workflow identity.", "IAM can trust a specific repo, branch, or environment."],
  ["IAM Role", "Temporary deployment permissions.", "The role limits what automation can change."],
  ["EKS", "Runs containerized workloads.", "IAM controls cluster and workload permissions."],
  ["Lambda", "Runs serverless jobs.", "Execution roles grant only required service access."],
  ["S3", "Stores artifacts and assets.", "Bucket access should be scoped by role and path."],
  ["CloudWatch", "Collects logs and metrics.", "Read and write permissions are controlled by IAM."],
  ["SNS", "Sends deployment or incident notifications.", "Publish access should be limited to approved topics."],
];

function SectionHeader({
  badge,
  title,
  description,
  icon: Icon,
}: {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
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
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className={cn("flex items-center justify-center text-primary", vertical ? "h-8" : "w-8")}
    >
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

function CopyCodeBlock({ example }: { example: typeof codeExamples[number] }) {
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
          <VisualNote title="Common mistake" text={example.mistakes} danger />
          <VisualNote title="Best practice" text={example.best} />
        </div>
      </CardContent>
    </Card>
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

function WrittenLesson({
  title,
  paragraphs,
  bullets,
}: {
  title: string;
  paragraphs: string[];
  bullets: string[];
}) {
  return (
    <Card className="border-border/60 bg-card/35 backdrop-blur-xl">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
            Written Guide
          </Badge>
          <h3 className="text-2xl font-headline">{title}</h3>
          <div className="mt-4 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex gap-3 rounded-lg border border-white/10 bg-background/50 p-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function IamIntroDiagram() {
  const [step, setStep] = useState(0);
  const nodes = [
    { label: "Developer", icon: User },
    { label: "IAM Login", icon: LockKeyhole },
    { label: "Authentication", icon: UserCheck },
    { label: "Authorization", icon: ShieldCheck },
    { label: "AWS Resource", icon: Cloud },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="IAM Basics"
        icon={Shield}
        title="What is IAM?"
        description="IAM is the AWS security system that controls who can access AWS resources and what actions they are allowed to perform."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={nodes} activeIndex={step} />
          <div className="grid gap-3 md:grid-cols-5">
            {iamTerms.map(([term, detail], index) => (
              <button
                key={term}
                onClick={() => setStep(Math.min(index, nodes.length - 1))}
                className={cn("rounded-lg border p-4 text-left", step === Math.min(index, nodes.length - 1) ? "border-primary/45 bg-primary/10" : "border-white/10 bg-background/50")}
              >
                <p className="font-semibold">{term}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setStep((current) => (current + 1) % nodes.length)} className="rounded-full">Animate Login</Button>
            <Button onClick={() => setStep(0)} variant="outline" className="rounded-full border-white/10">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.basics} />
      </div>
    </section>
  );
}

function AuthComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Core Difference"
        icon={UserCheck}
        title="Authentication vs Authorization"
        description="Authentication proves identity. Authorization checks permissions."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Authentication</h3>
            <p className="text-lg text-primary">Who are you?</p>
            <AnimatedFlow items={[{ label: "Username", icon: User }, { label: "Password", icon: Lock }, { label: "MFA", icon: KeyRound }, { label: "Verified", icon: Check }]} activeIndex={3} />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <h3 className="text-2xl font-headline">Authorization</h3>
            <p className="text-lg text-primary">What are you allowed to do?</p>
            <AnimatedFlow items={[{ label: "Read S3", icon: Check }, { label: "Launch EC2", icon: Check }, { label: "Delete RDS", icon: X, danger: true }]} activeIndex={1} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.auth} />
      </div>
    </section>
  );
}

function IamUsersVisualizer() {
  const [selected, setSelected] = useState<UserId>("ahmed");
  const [rotated, setRotated] = useState(false);
  const user = iamUsers[selected];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="IAM Users"
        icon={Users}
        title="IAM Users Explorer"
        description="An IAM user is a named identity. Click each user to inspect credentials, console access, policies, groups, MFA, and key rotation status."
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <FlowNode label="AWS Account" icon={Cloud} active />
            <GlowArrow vertical />
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(iamUsers) as UserId[]).map((id) => (
                <button key={id} onClick={() => setSelected(id)} className={cn("rounded-lg border p-4 text-left", selected === id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/50")}>
                  <User className="mb-2 h-5 w-5 text-primary" />
                  <p className="font-semibold">{iamUsers[id].name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Selected user</Badge>
                <h3 className="mt-2 text-3xl font-headline">{user.name}</h3>
              </div>
              <Button onClick={() => setRotated(true)} className="rounded-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Rotate Keys
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <VisualNote title="Credentials" text={user.credentials} />
              <VisualNote title="Console Access" text={user.console} />
              <VisualNote title="MFA Status" text={user.mfa} />
              <VisualNote title="Access Key Age" text={rotated ? "Rotated just now" : user.keyAge} />
              <VisualNote title="Attached Policies" text={user.policies.join(", ")} />
              <VisualNote title="Groups" text={user.groups.join(", ")} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.usersGroups} />
      </div>
    </section>
  );
}

function IamGroupsVisualizer() {
  const [developers, setDevelopers] = useState(["Ahmed", "Ali", "Sarah"]);
  const candidate = developers.includes("Maya") ? "Remove Maya" : "Add Maya";

  function toggleMaya() {
    setDevelopers((current) => current.includes("Maya") ? current.filter((name) => name !== "Maya") : [...current, "Maya"]);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="IAM Groups"
        icon={Users}
        title="Group Policy Inheritance"
        description="Attach a policy to a group once, and every member receives those permissions automatically."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-5">
              <h3 className="text-2xl font-headline">Developers</h3>
              <Badge variant="outline" className="mt-3 border-white/10 bg-background/50">Policy: S3ReadOnly + CloudWatchRead</Badge>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {developers.map((name) => <FlowNode key={name} label={name} icon={User} />)}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/50 p-5">
              <h3 className="text-2xl font-headline">Admins</h3>
              <Badge variant="outline" className="mt-3 border-red-300/25 bg-red-500/10 text-red-100">Policy: AdministratorAccess</Badge>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["John", "Lisa"].map((name) => <FlowNode key={name} label={name} icon={UserCog} />)}
              </div>
            </div>
          </div>
          <Button onClick={toggleMaya} className="rounded-full">{candidate}</Button>
        </CardContent>
      </Card>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.groups} />
      </div>
    </section>
  );
}

function PolicyVisualizer() {
  const [field, setField] = useState<PolicyField>("Effect");
  const [action, setAction] = useState<"read" | "delete">("read");
  const allowed = action === "read";

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="IAM Policies"
        icon={Code2}
        title="Policy JSON Visualizer"
        description="A policy is a JSON document. Click each field and watch how IAM turns statements into an Allow or Deny decision."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
              <code>{policyJson}</code>
            </pre>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(policyFields) as PolicyField[]).map((key) => (
                <Button key={key} size="sm" onClick={() => setField(key)} variant={field === key ? "default" : "outline"} className="rounded-full border-white/10">
                  {key}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <VisualNote title={field} text={policyFields[field]} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setAction("read")} variant={action === "read" ? "default" : "outline"} className="rounded-full border-white/10">Test S3:GetObject</Button>
              <Button onClick={() => setAction("delete")} variant={action === "delete" ? "default" : "outline"} className="rounded-full border-white/10">Test Delete Bucket</Button>
            </div>
            <AnimatedFlow
              items={[
                { label: allowed ? "Allow" : "No Allow", icon: allowed ? Check : X, danger: !allowed },
                { label: allowed ? "S3:GetObject" : "Delete Bucket", icon: action === "read" ? Eye : AlertTriangle, danger: !allowed },
                { label: "Bucket", icon: Database },
                { label: allowed ? "Allowed" : "Denied", icon: allowed ? Check : X, danger: !allowed },
              ]}
              activeIndex={3}
            />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.policies} />
      </div>
    </section>
  );
}

function RolesAndTemporaryCredentials() {
  const [timeline, setTimeline] = useState(1);
  const timelineLabels = ["Create", "Valid", "Expire"];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10">
        <div>
          <SectionHeader badge="IAM Roles" icon={ShieldCheck} title="Role Assumption Animation" description="Roles are identities that can be assumed by AWS services, users, or external systems. They produce temporary credentials." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
              <AnimatedFlow items={[{ label: "EC2", icon: Server }, { label: "Assume Role", icon: ShieldCheck }, { label: "Temporary Credentials", icon: KeyRound }, { label: "Access S3", icon: Database }]} activeIndex={2} />
              <AnimatedFlow items={[{ label: "Lambda", icon: Zap }, { label: "Role", icon: ShieldCheck }, { label: "DynamoDB", icon: Database }]} activeIndex={1} />
              <AnimatedFlow items={[{ label: "Developer", icon: User }, { label: "Assume Admin Role", icon: UserCog }, { label: "Temporary Access", icon: Timer }]} activeIndex={2} />
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader badge="Temporary Credentials" icon={Timer} title="Credential Lifetime Timeline" description="Temporary credentials are safer because they expire automatically and can be scoped to one role session." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={timelineLabels.map((label, index) => ({ label, icon: index === 2 ? Timer : KeyRound, danger: timeline === 2 && index === 2 }))} activeIndex={timeline} />
              <div className="grid gap-3 md:grid-cols-3">
                {timelineLabels.map((label, index) => (
                  <button key={label} onClick={() => setTimeline(index)} className={cn("rounded-lg border p-4 text-left", timeline === index ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/50")}>
                    <p className="font-semibold">{label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{index === 0 ? "STS issues scoped session keys." : index === 1 ? "The workload can call allowed AWS APIs." : "The session stops working automatically."}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <WrittenLesson {...writtenLessons.roles} />
    </section>
  );
}

function PermissionSimulator() {
  const [request, setRequest] = useState<SimulatorRequest>("read-s3");
  const selected = simulatorRequests[request];
  const granted = selected.outcome === "granted";

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Permission Simulator" icon={Workflow} title="Live Permission Evaluation Playground" description="Select a request and watch how identity, group, role, policies, and request context produce a decision." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(simulatorRequests) as SimulatorRequest[]).map((key) => (
              <Button key={key} onClick={() => setRequest(key)} variant={request === key ? "default" : "outline"} className="rounded-full border-white/10">
                {simulatorRequests[key].label}
              </Button>
            ))}
          </div>
          <AnimatedFlow
            items={[
              { label: "IAM User", icon: User },
              { label: "Group", icon: Users },
              { label: "Role", icon: ShieldCheck },
              { label: "Policies", icon: Code2 },
              { label: selected.action, icon: Route },
              { label: granted ? "Granted" : "Denied", icon: granted ? Check : X, danger: !granted },
            ]}
            activeIndex={5}
          />
          <VisualNote title={granted ? "Permission Granted" : "Permission Denied"} text={selected.why} danger={!granted} />
        </CardContent>
      </Card>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.evaluation} />
      </div>
    </section>
  );
}

function EvaluationFlow() {
  const [active, setActive] = useState(0);
  const step = evaluationSteps[active];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Policy Evaluation" icon={Route} title="IAM Evaluation Flow" description="IAM starts from deny by default. Authentication, explicit deny, allow, and implicit deny all shape the final decision." />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <AnimatedFlow items={evaluationSteps.map((item) => ({ label: item.label, icon: item.id === "decision" ? Check : Shield }))} activeIndex={active} />
          <VisualNote title={step.label} text={step.detail} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActive((current) => Math.min(current + 1, evaluationSteps.length - 1))} className="rounded-full">Next Step</Button>
            <Button onClick={() => setActive(0)} variant="outline" className="rounded-full border-white/10">Reset</Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.evaluation} />
      </div>
    </section>
  );
}

function CrossAccountAndMfa() {
  const [attack, setAttack] = useState(false);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader badge="Cross Account Access" icon={Workflow} title="Trust Relationship Visualized" description="Account A can access Account B only when Account B trusts a role assumption from Account A." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={[{ label: "Account A", icon: Cloud }, { label: "Assume Role", icon: ShieldCheck }, { label: "Account B", icon: Cloud }, { label: "Access Resource", icon: Database }]} activeIndex={1} />
              <VisualNote title="Trust policy" text="The target role defines who can assume it. The permission policy defines what the session can do." />
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader badge="MFA" icon={KeyRound} title="Multi Factor Authentication" description="MFA adds a second proof of identity after the password." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow
                items={attack
                  ? [{ label: "Password stolen", icon: ShieldAlert, danger: true }, { label: "No MFA code", icon: X, danger: true }, { label: "Access Denied", icon: Lock, danger: true }]
                  : [{ label: "Password", icon: Lock }, { label: "MFA Code", icon: KeyRound }, { label: "Access Granted", icon: Check }]}
                activeIndex={2}
              />
              <Button onClick={() => setAttack((current) => !current)} className="rounded-full">
                {attack ? "Show Normal Login" : "Simulate Stolen Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.crossAccountMfa} />
      </div>
    </section>
  );
}

function EnterpriseExamples() {
  const examples = [
    [{ label: "Developer", icon: User }, { label: "EC2", icon: Server }, { label: "Role", icon: ShieldCheck }, { label: "S3", icon: Database }],
    [{ label: "GitHub Actions", icon: Github }, { label: "OIDC", icon: KeyRound }, { label: "IAM Role", icon: ShieldCheck }, { label: "Deploy App", icon: Cloud }],
    [{ label: "Lambda", icon: Zap }, { label: "Role", icon: ShieldCheck }, { label: "DynamoDB", icon: Database }, { label: "CloudWatch", icon: Eye }],
    [{ label: "ECS", icon: Layers3 }, { label: "Role", icon: ShieldCheck }, { label: "Secrets Manager", icon: LockKeyhole }],
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Enterprise Examples" icon={Cloud} title="Production IAM Scenarios" description="IAM appears in every production architecture: servers, CI/CD, serverless functions, containers, data, secrets, and monitoring." />
      <div className="grid gap-5 lg:grid-cols-2">
        {examples.map((items, index) => (
          <Card key={index} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-5">
              <AnimatedFlow items={items} activeIndex={items.findIndex((item) => item.label.includes("Role"))} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BestPracticesAndMistakes() {
  const [completed, setCompleted] = useState<string[]>(bestPractices.slice(0, 3));
  const [activeMistake, setActiveMistake] = useState(mistakes[0]);

  function toggle(item: string) {
    setCompleted((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10">
        <div>
          <SectionHeader badge="Best Practices" icon={Check} title="Animated IAM Checklist" description="Strong IAM posture comes from small habits repeated everywhere." />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {bestPractices.map((item) => {
              const done = completed.includes(item);
              return (
                <button key={item} onClick={() => toggle(item)} className={cn("rounded-lg border p-4 text-left transition", done ? "border-primary/45 bg-primary/10 text-primary" : "border-white/10 bg-card/45")}>
                  <motion.div animate={done ? { scale: [1, 1.12, 1] } : {}} className="mb-3">
                    <Check className="h-5 w-5" />
                  </motion.div>
                  <p className="font-semibold">{item}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <SectionHeader badge="Common Mistakes" icon={AlertTriangle} title="Interactive IAM Mistake Cards" description="Hover or click a mistake to reveal the problem, risk, and correct solution." />
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-3">
              {mistakes.map((mistake) => (
                <button key={mistake[0]} onMouseEnter={() => setActiveMistake(mistake)} onClick={() => setActiveMistake(mistake)} className={cn("rounded-lg border p-4 text-left", activeMistake[0] === mistake[0] ? "border-red-300/45 bg-red-500/10 text-red-100" : "border-white/10 bg-card/45")}>
                  <X className="mb-2 h-5 w-5" />
                  <p className="font-semibold">{mistake[0]}</p>
                </button>
              ))}
            </div>
            <Card className="border-red-300/25 bg-red-500/10 backdrop-blur-xl">
              <CardContent className="grid gap-3 p-5">
                <VisualNote title="Problem" text={activeMistake[1]} danger />
                <VisualNote title="Risk" text={activeMistake[2]} danger />
                <VisualNote title="Correct solution" text={activeMistake[3]} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.bestPractices} />
      </div>
    </section>
  );
}

function VisualComparisons() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Visual Comparisons" icon={Sparkles} title="IAM Concepts Side by Side" description="These comparisons make the most common IAM interview and architecture terms easier to separate." />
      <div className="grid gap-5 md:grid-cols-2">
        {comparisons.map(([left, right, leftText, rightText]) => (
          <Card key={`${left}-${right}`} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_1fr]">
              <FlowNode label={left} icon={Shield} />
              <div className="flex items-center justify-center text-xs font-semibold text-primary">VS</div>
              <FlowNode label={right} icon={ShieldCheck} />
              <p className="text-sm leading-6 text-muted-foreground">{leftText}</p>
              <div />
              <p className="text-sm leading-6 text-muted-foreground">{rightText}</p>
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

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Interactive Quiz" icon={Check} title="IAM Knowledge Check" description="Choose an answer, see the animation, and learn why the result is right or wrong." />
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-background">
        <motion.div className="h-full bg-primary" animate={{ width: `${(answered / quizQuestions.length) * 100}%` }} />
      </div>
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
                    <motion.button
                      key={option}
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm",
                        isSelected && isCorrect && "border-primary/50 bg-primary/10 text-primary",
                        isSelected && !isCorrect && "border-red-300/40 bg-red-500/10 text-red-100",
                        !isSelected && "border-white/10 bg-background/50"
                      )}
                    >
                      {option}
                    </motion.button>
                  );
                })}
                {selected !== undefined ? <VisualNote title={selected === answer ? "Correct" : "Not quite"} text={explanation} danger={selected !== answer} /> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Score: {correct} / {quizQuestions.length}</p>
    </section>
  );
}

function EnterpriseArchitecture() {
  const [active, setActive] = useState(enterpriseServices[0]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Enterprise Architecture" icon={Workflow} title="Clickable IAM Architecture" description="IAM is the control layer behind human access, CI/CD access, workload access, observability, and notifications." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-6 p-6">
            <AnimatedFlow items={enterpriseServices.map(([label]) => ({ label, icon: label === "Developer" ? User : label === "GitHub Actions" ? Github : label === "RDS" ? Database : label === "Lambda" ? Zap : Cloud }))} activeIndex={enterpriseServices.findIndex((item) => item[0] === active[0])} />
            <div className="flex flex-wrap gap-2">
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
            <VisualNote title="Why IAM is required" text={active[2]} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <WrittenLesson {...writtenLessons.architecture} />
      </div>
    </section>
  );
}

function CodeExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Code Examples" icon={Code2} title="Production-ready IAM Examples" description="Each copyable block includes a short explanation, a mistake to avoid, and a best practice." />
      <div className="grid gap-6">
        {codeExamples.map((example) => <CopyCodeBlock key={example.title} example={example} />)}
      </div>
    </section>
  );
}

function RoadmapAndSummary() {
  const [active, setActive] = useState(2);
  const roadmap = ["Cloud Fundamentals", "Global Infrastructure", "IAM", "VPC", "EC2", "S3", "RDS", "Lambda", "CloudFormation", "Monitoring", "Solutions Architect"];
  const summary = [
    { label: "User", icon: User },
    { label: "Authentication", icon: UserCheck },
    { label: "IAM", icon: Shield },
    { label: "Authorization", icon: ShieldCheck },
    { label: "Policy", icon: Code2 },
    { label: "AWS Service", icon: Cloud },
    { label: "Access Granted", icon: Check },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10">
        <div>
          <SectionHeader badge="Learning Roadmap" icon={Route} title="AWS Security Learning Path" description="IAM sits right after cloud fundamentals and global infrastructure because every AWS service relies on access control." />
          <Card className="border-border/60 bg-card/45 p-6 backdrop-blur-xl">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {roadmap.map((step) => (
                <div key={step} className={cn("rounded-lg border p-4 text-center text-sm font-semibold", step === "IAM" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/50")}>
                  {step}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <SectionHeader badge="Final Visual Summary" icon={Sparkles} title="IAM in One Flow" description="Click any box to trace how identity, authentication, IAM, policies, and authorization produce secure AWS access." />
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
              <AnimatedFlow items={summary} activeIndex={active} />
              <div className="flex flex-wrap gap-2">
                {summary.map((item, index) => (
                  <Button key={item.label} size="sm" onClick={() => setActive(index)} variant={active === index ? "default" : "outline"} className="rounded-full border-white/10">
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function AwsIamLesson() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-72 max-w-5xl">
          {floatingIcons.map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 4 + index * 0.35, repeat: Infinity, delay: index * 0.3 }}
              className="absolute rounded-lg border border-white/10 bg-card/35 p-3 text-primary backdrop-blur-xl"
              style={{ left: `${12 + index * 19}%`, top: `${index % 2 === 0 ? 12 : 48}%` }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto max-w-5xl text-center">
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">Beginner</Badge>
            <Badge variant="outline" className="rounded-full border-white/10 bg-background/50 px-4 py-1">20-25 min</Badge>
            <Badge variant="outline" className="rounded-full border-white/10 bg-background/50 px-4 py-1">AWS</Badge>
            <Badge variant="outline" className="rounded-full border-white/10 bg-background/50 px-4 py-1">Security</Badge>
          </div>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            IAM <span className="gradient-text">(Identity and Access Management)</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Control who can access AWS resources and what actions they are allowed to perform.
          </p>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
            Learn how AWS secures cloud environments using Users, Groups, Roles, Policies, MFA, and temporary credentials through interactive visualizations.
          </p>
          <div className="mx-auto mt-8 h-2 max-w-xl overflow-hidden rounded-full bg-background">
            <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "22%" }} transition={{ duration: 1.1 }} />
          </div>
        </motion.div>
      </section>

      <IamIntroDiagram />
      <AuthComparison />
      <IamUsersVisualizer />
      <IamGroupsVisualizer />
      <PolicyVisualizer />
      <RolesAndTemporaryCredentials />
      <PermissionSimulator />
      <EvaluationFlow />
      <CrossAccountAndMfa />
      <EnterpriseExamples />
      <BestPracticesAndMistakes />
      <VisualComparisons />
      <InteractiveQuiz />
      <EnterpriseArchitecture />
      <CodeExamples />
      <RoadmapAndSummary />
    </div>
  );
}
