"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Database,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StorageTopic = {
  id: string;
  title: string;
  category: string;
  definition: string;
  why: string;
  examples: string[];
  goodFor: string[];
  notGoodFor?: string[];
  memory: string;
  examTip: string;
  diagram: string[];
};

type QuizQuestion = {
  question: string;
  options: Array<{ label: string; explanation: string }>;
  answer: number;
  topic: string;
};

const storageTopics: StorageTopic[] = [
  {
    id: "storage-categories",
    title: "AWS Storage Categories",
    category: "Overview",
    definition:
      "AWS provides different storage services because applications store data in different ways: blocks, objects, files, hybrid storage, and disaster recovery copies.",
    why:
      "A database, a photo upload feature, a shared company folder, and a disaster recovery plan all need different storage behavior.",
    examples: [
      "Laptop SSD maps to block storage.",
      "Google Drive or Dropbox maps to object storage.",
      "Shared office folders map to file storage.",
      "A local office connected to cloud storage maps to hybrid storage.",
    ],
    goodFor: ["Choosing the right storage service", "Cloud Practitioner exam comparisons", "Architecture decisions"],
    memory: "AWS storage is like your computer: hard drive, cloud drive, shared folders, and backups.",
    examTip: "Match the workload first: operating system, images, shared files, hybrid office storage, or recovery.",
    diagram: ["Application need", "Storage category", "AWS storage service", "Data stored safely"],
  },
  {
    id: "amazon-ebs",
    title: "Amazon EBS",
    category: "Block Storage",
    definition:
      "Amazon Elastic Block Store is persistent block storage for EC2 instances. Think of it as a permanent virtual hard drive.",
    why:
      "EC2 needs durable disk storage for operating systems, applications, databases, logs, and low-latency workloads.",
    examples: [
      "An EC2 instance runs Linux or Windows from an EBS root volume.",
      "A MySQL database stores data on EBS.",
      "A stopped EC2 instance can keep its EBS volume and later attach it again.",
    ],
    goodFor: ["Operating systems", "Databases", "Applications", "Logs", "Low-latency disk access"],
    notGoodFor: ["Shared access across many Linux servers at the same time", "Object-style photo buckets"],
    memory: "EBS = Permanent hard drive for EC2.",
    examTip: "If the question says persistent block storage for EC2 or database disk, choose Amazon EBS.",
    diagram: ["EC2 Instance", "Amazon EBS Volume", "Operating System", "Application Data"],
  },
  {
    id: "instance-store",
    title: "Amazon EC2 Instance Store",
    category: "Temporary Block Storage",
    definition:
      "EC2 Instance Store is temporary block storage physically attached to the host server running certain EC2 instances.",
    why:
      "It provides very high performance for temporary data that can be recreated if the instance stops or the host changes.",
    examples: [
      "A shopping site stores temporary product cache.",
      "A video processing app writes temporary rendering files before saving the final video to S3.",
      "A machine learning job stores temporary training files while processing data.",
    ],
    goodFor: ["Cache", "Buffers", "Scratch files", "Temporary logs", "Image or video processing", "Temporary ML datasets"],
    notGoodFor: ["Production databases", "Customer records", "Financial transactions", "Medical records", "Photos that cannot be recreated"],
    memory: "Instance Store = Whiteboard. Fast, local, and erased later.",
    examTip: "Instance Store is temporary. Do not choose it for important business data or databases.",
    diagram: ["EC2 Running", "Instance Store", "Temporary Data", "Data lost after stop or termination"],
  },
  {
    id: "amazon-s3",
    title: "Amazon S3",
    category: "Object Storage",
    definition:
      "Amazon Simple Storage Service stores data as objects. Each object includes the file, metadata, and a unique key.",
    why:
      "Object storage is ideal for massive scale storage such as images, videos, documents, backups, logs, static websites, and datasets.",
    examples: [
      "An Instagram-style app stores millions of photos in S3.",
      "A company stores nightly database backups in S3.",
      "A website stores logo.png, banner.jpg, product images, and videos in S3.",
      "A marketing agency stores campaign assets by client using prefixes such as Client-A/Images, Client-A/Videos, and Client-B/Designs.",
      "Frequently used campaign files stay in S3 Standard while older campaigns move to Glacier storage classes with lifecycle rules.",
      "Clients receive public URLs when allowed, temporary pre-signed URLs for secure sharing, or CloudFront URLs for global delivery.",
    ],
    goodFor: [
      "Images",
      "Videos",
      "Documents",
      "Backups",
      "Logs",
      "Static websites",
      "Big data",
      "Machine learning datasets",
      "URL-based file sharing",
      "Lifecycle policies and storage classes",
    ],
    notGoodFor: ["Operating systems", "Databases requiring block storage", "Low-latency mounted disk access"],
    memory: "S3 = Cloud Warehouse for objects: store, organize, secure, share, and archive files.",
    examTip: "If the question says images, videos, static files, unlimited storage, buckets, storage classes, archive old files, or URL sharing, choose S3.",
    diagram: ["Marketing Assets", "S3 Bucket", "Client Prefixes", "Storage Classes", "Secure URLs"],
  },
  {
    id: "amazon-efs",
    title: "Amazon EFS",
    category: "File Storage",
    definition:
      "Amazon Elastic File System is a managed shared Linux file system that multiple EC2 instances can access at the same time.",
    why:
      "Some applications need shared folders, not separate disks or object buckets.",
    examples: [
      "A WordPress fleet has three EC2 instances sharing images, plugins, and themes.",
      "Multiple Linux application servers need the same shared files.",
      "Storage automatically grows from GBs to TBs as files are added, without provisioning capacity in advance.",
      "All EC2 instances mount the same file system using NFS and see the same uploaded files.",
    ],
    goodFor: ["Shared Linux files", "Multiple EC2 instances", "NFS workloads", "Auto-growing shared storage", "Serverless managed file storage"],
    notGoodFor: ["Windows-native shared drives", "Temporary local cache", "Object storage buckets"],
    memory: "EFS = Elastic File System: Elastic, File system, Shared by multiple EC2 instances.",
    examTip: "If the question says shared file system, multiple EC2 instances, Linux, NFS, automatic scaling, or no capacity planning, choose EFS.",
    diagram: ["EC2 Instance 1", "EC2 Instance 2", "EC2 Instance 3", "Amazon EFS"],
  },
  {
    id: "amazon-fsx",
    title: "Amazon FSx",
    category: "Specialized File Storage",
    definition:
      "Amazon FSx provides managed specialized file systems such as Windows File Server, Lustre, NetApp ONTAP, and OpenZFS.",
    why:
      "Enterprise applications may require a specific file system, Windows compatibility, high-performance Lustre, or existing storage features.",
    examples: [
      "A company with Active Directory keeps Windows shared-drive behavior using FSx for Windows File Server.",
      "A high-performance computing workload uses FSx for Lustre.",
    ],
    goodFor: ["Windows file shares", "Enterprise workloads", "Lustre", "NetApp ONTAP", "OpenZFS"],
    memory: "FSx = Specialized managed file systems.",
    examTip: "If the question mentions Windows shared folders or specialized file systems, choose FSx.",
    diagram: ["Enterprise Application", "Amazon FSx", "Specialized File System", "Shared Access"],
  },
  {
    id: "storage-gateway",
    title: "AWS Storage Gateway",
    category: "Hybrid Storage",
    definition:
      "AWS Storage Gateway connects on-premises environments to AWS storage so local systems can use cloud-backed storage.",
    why:
      "Many companies cannot move everything to AWS immediately, but still want cloud durability, backups, and gradual migration.",
    examples: [
      "A hospital keeps local patient-record systems while copying data to Amazon S3.",
      "An office file share appears local to employees but stores data in AWS.",
      "A manufacturing company keeps frequently used engineering drawings cached locally while storing the full dataset in AWS.",
      "Existing on-premises applications continue using familiar storage access while AWS provides virtually unlimited cloud-backed storage.",
    ],
    goodFor: ["Hybrid storage", "On-premises backup", "Gradual cloud adoption", "Cloud-backed local storage", "Local cache with AWS storage"],
    memory: "Storage Gateway = Bridge to the Cloud.",
    examTip: "If the question says on-premises, hybrid storage, local cache, existing file shares, or Amazon S3 integration, choose AWS Storage Gateway.",
    diagram: ["On-Premises Applications", "AWS Storage Gateway", "Local Cache", "AWS Cloud Storage"],
  },
  {
    id: "elastic-disaster-recovery",
    title: "AWS Elastic Disaster Recovery",
    category: "Disaster Recovery",
    definition:
      "AWS Elastic Disaster Recovery continuously replicates source servers into AWS so they can be recovered after an outage or disaster.",
    why:
      "If a data center fails because of fire, flood, hardware loss, or ransomware, the business needs a faster recovery path.",
    examples: [
      "A bank loses a data center due to flooding and recovers servers in AWS.",
      "A company keeps replication running so recovery takes minutes or hours instead of weeks.",
    ],
    goodFor: ["Server replication", "Disaster recovery", "Business continuity", "On-premises recovery to AWS"],
    memory: "Elastic Disaster Recovery = Standby recovery copy in AWS.",
    examTip: "If the question says recover servers after a disaster, choose AWS Elastic Disaster Recovery.",
    diagram: ["On-Premises Server", "Continuous Replication", "AWS", "Recover Quickly"],
  },
  {
    id: "ebs-snapshots",
    title: "Amazon EBS Snapshots",
    category: "Backup and Restore",
    definition:
      "An EBS Snapshot is a point-in-time backup of an EBS volume. It captures the volume data at a specific moment.",
    why:
      "Snapshots protect against accidental deletion, disk corruption, software bugs, hardware issues, and disaster recovery needs.",
    examples: [
      "Take a snapshot before changing a database.",
      "Restore a failed volume by creating a new EBS volume from a snapshot.",
      "Copy a snapshot to another Region for disaster recovery.",
      "Create multiple volumes from one snapshot for testing or scaling.",
    ],
    goodFor: ["Backups", "Restore", "Cloning volumes", "Cross-Region migration", "Disaster recovery"],
    memory: "EBS Snapshot = Camera photo of your EBS volume.",
    examTip: "The first snapshot is full. Later snapshots are incremental and store only changed blocks.",
    diagram: ["EBS Volume", "Snapshot", "Amazon S3", "New EBS Volume", "Attach to EC2"],
  },
  {
    id: "data-lifecycle-manager",
    title: "Amazon Data Lifecycle Manager",
    category: "Snapshot Automation",
    definition:
      "Amazon Data Lifecycle Manager automates EBS snapshot creation, retention, deletion, archive, copy, and sharing policies.",
    why:
      "Manually backing up hundreds of volumes is error-prone. DLM acts like a backup scheduler.",
    examples: [
      "A company snapshots 500 EC2 servers every night.",
      "A bank keeps daily backups for 90 days and copies snapshots to another Region.",
      "Old snapshots are deleted automatically to reduce costs.",
    ],
    goodFor: ["Automated snapshot schedules", "Retention policies", "Cross-Region copy", "Snapshot archive", "Fast Snapshot Restore"],
    memory: "DLM = Snapshot scheduler.",
    examTip: "If the question asks what automates EBS snapshots, choose Amazon Data Lifecycle Manager.",
    diagram: ["DLM Policy", "Target Volumes", "Schedule", "Snapshots", "Retention and Cleanup"],
  },
  {
    id: "shared-responsibility-storage",
    title: "Shared Responsibility for Storage",
    category: "Security and Operations",
    definition:
      "AWS manages the storage infrastructure, but customers manage their data, permissions, encryption choices, backups, and recovery plans.",
    why:
      "Cloud Practitioner questions often test who is responsible for storage configuration and data protection.",
    examples: [
      "AWS replaces failed physical disks for S3 and EBS infrastructure.",
      "Customers decide snapshot schedules and delete old backups.",
      "Customers configure IAM permissions and encryption settings for sensitive data.",
    ],
    goodFor: ["Exam responsibility questions", "Backup planning", "Security decisions"],
    memory: "AWS protects the storage platform; you protect your data and settings.",
    examTip: "AWS does not automatically back up every EBS volume unless you configure automation.",
    diagram: ["AWS manages hardware", "Customer manages data", "IAM", "Encryption", "Backups"],
  },
];

const storageComparisonRows = [
  ["Amazon EBS", "Block storage", "Persistent", "Operating systems, databases, application disks"],
  ["EC2 Instance Store", "Block storage", "Temporary", "Cache, buffers, scratch data, temporary processing"],
  ["Amazon S3", "Object storage", "Persistent", "Images, videos, documents, backups, logs"],
  ["Amazon EFS", "File storage", "Persistent", "Shared Linux file systems for multiple EC2 instances"],
  ["Amazon FSx", "File storage", "Persistent", "Windows file shares and specialized enterprise file systems"],
  ["AWS Storage Gateway", "Hybrid storage", "Persistent cloud-backed storage", "Connecting on-premises storage to AWS"],
  ["AWS Elastic Disaster Recovery", "Disaster recovery", "Continuous replication", "Recovering servers after disasters"],
];

const scenarioComparisonRows = [
  ["Object storage, unlimited scale, URL sharing", "Amazon S3"],
  ["Persistent block storage for EC2", "Amazon EBS"],
  ["Shared elastic Linux file storage", "Amazon EFS"],
  ["Managed Windows or specialized file systems", "Amazon FSx"],
  ["Hybrid cloud storage with local cache", "AWS Storage Gateway"],
  ["Low-cost archival object storage", "S3 Glacier storage classes"],
];

const ebsVsInstanceStoreRows = [
  ["Persistent", "Yes", "No"],
  ["Physical location", "Network-attached AWS block storage", "Physically attached to EC2 host"],
  ["Survives stop", "Yes", "No"],
  ["Snapshots", "Yes", "No"],
  ["Cost", "Separate EBS pricing", "Included with supported EC2 instances"],
  ["Best for", "Operating systems, databases, applications", "Cache, buffers, scratch data"],
];

const snapshotCheatSheet = [
  ["What is it?", "Point-in-time backup of an EBS volume"],
  ["First snapshot", "Full copy of used data"],
  ["Later snapshots", "Incremental changed blocks only"],
  ["Stored in", "Amazon S3 managed by AWS"],
  ["Can restore data?", "Yes"],
  ["Can create multiple volumes?", "Yes"],
  ["Supports cross-Region copy?", "Yes"],
  ["Automated by", "Amazon Data Lifecycle Manager"],
];

const storageQuestions: QuizQuestion[] = [
  {
    question: "A marketing agency needs to store large collections of images, videos, and design files with virtually unlimited capacity, secure URL sharing, client/project organization, and storage classes for archive assets. Which service is best?",
    options: [
      { label: "Amazon S3", explanation: "Correct. S3 is object storage with virtually unlimited scale, high durability, URL and pre-signed URL sharing, prefixes for organization, lifecycle policies, storage classes, and security controls." },
      { label: "Amazon EBS", explanation: "EBS is persistent block storage for EC2 instances, not internet-scale media file storage and sharing." },
      { label: "Amazon FSx", explanation: "FSx provides managed file systems for Windows, Lustre, NetApp, or OpenZFS, not object storage for large URL-shared media collections." },
      { label: "Amazon EFS", explanation: "EFS is shared Linux file storage using NFS, not object storage for URL-based file sharing and storage classes." },
    ],
    answer: 0,
    topic: "S3",
  },
  {
    question: "Which statement best describes AWS Storage Gateway?",
    options: [
      { label: "A hybrid cloud storage solution that provides on-premises applications with access to virtually unlimited cloud storage", explanation: "Correct. Storage Gateway connects on-premises applications with AWS storage and can provide local cache for low-latency access." },
      { label: "A migration tool that automatically transfers all on-premises data to the cloud", explanation: "Storage Gateway is ongoing hybrid access, not just a one-time automatic migration service." },
      { label: "A virtual private network that creates secure connections between a data center and AWS", explanation: "That describes AWS Site-to-Site VPN, not Storage Gateway." },
      { label: "A physical hardware appliance that must be installed in a data center", explanation: "Storage Gateway can run as a VM, on supported hardware, or as an AWS-managed appliance. Its main purpose is hybrid storage access, not simply being physical hardware." },
    ],
    answer: 0,
    topic: "Storage Gateway",
  },
  {
    question: "Which statement best describes Amazon EFS?",
    options: [
      { label: "A fully managed, elastic file system that scales automatically as files are added and removed", explanation: "Correct. EFS is serverless, elastic file storage for Linux workloads and can be mounted by multiple EC2 instances." },
      { label: "A fixed-capacity file storage system that requires manual scaling and management", explanation: "EFS scales automatically, so you do not provision fixed file-system capacity in advance." },
      { label: "A block storage service that provides volumes to attach to a single Amazon EC2 instance", explanation: "That describes Amazon EBS, not EFS." },
      { label: "An object storage service designed for long-term archival of rarely accessed data", explanation: "That describes S3 Glacier storage classes, not EFS." },
    ],
    answer: 0,
    topic: "EFS",
  },
  {
    question: "Which AWS storage service is best for a MySQL database running on EC2?",
    options: [
      { label: "Amazon EBS", explanation: "Correct. EBS is persistent block storage suitable for databases." },
      { label: "EC2 Instance Store", explanation: "Instance Store is temporary and not suitable for important database data." },
      { label: "Amazon S3", explanation: "S3 is object storage, not a mounted database disk." },
      { label: "AWS Storage Gateway", explanation: "Storage Gateway connects on-premises storage to AWS." },
    ],
    answer: 0,
    topic: "EBS",
  },
  {
    question: "Which storage should be used for temporary cache that can be recreated?",
    options: [
      { label: "EC2 Instance Store", explanation: "Correct. Instance Store is fast temporary block storage." },
      { label: "Amazon EFS", explanation: "EFS is shared persistent file storage." },
      { label: "Amazon FSx", explanation: "FSx is for specialized managed file systems." },
      { label: "EBS Snapshot", explanation: "A snapshot is a backup, not live cache storage." },
    ],
    answer: 0,
    topic: "Instance Store",
  },
  {
    question: "A company stores product images, videos, and backups at massive scale. Which service fits best?",
    options: [
      { label: "Amazon S3", explanation: "Correct. S3 is object storage for files, media, backups, logs, and datasets." },
      { label: "EC2 Instance Store", explanation: "Instance Store is temporary local storage." },
      { label: "Amazon EBS only", explanation: "EBS is block storage for EC2 disks." },
      { label: "AWS CLI", explanation: "CLI is a tool, not a storage service." },
    ],
    answer: 0,
    topic: "S3",
  },
  {
    question: "Three Linux EC2 instances need to share the same WordPress files. Which service is best?",
    options: [
      { label: "Amazon EFS", explanation: "Correct. EFS is shared Linux file storage accessible by multiple EC2 instances." },
      { label: "EC2 Instance Store", explanation: "Instance Store is local to an EC2 host and temporary." },
      { label: "Amazon EBS Snapshot", explanation: "A snapshot is a backup, not a shared file system." },
      { label: "AWS Elastic Disaster Recovery", explanation: "DRS is for disaster recovery replication." },
    ],
    answer: 0,
    topic: "EFS",
  },
  {
    question: "A company needs Windows shared-drive compatibility with Active Directory. Which service should it consider?",
    options: [
      { label: "Amazon FSx for Windows File Server", explanation: "Correct. FSx supports Windows file server workloads." },
      { label: "Amazon EFS", explanation: "EFS is Linux/NFS-focused shared storage." },
      { label: "EC2 Instance Store", explanation: "Instance Store is temporary local storage." },
      { label: "Amazon S3 Glacier", explanation: "Glacier is archival object storage, not Windows file sharing." },
    ],
    answer: 0,
    topic: "FSx",
  },
  {
    question: "Which service connects on-premises storage systems to AWS cloud storage?",
    options: [
      { label: "AWS Storage Gateway", explanation: "Correct. Storage Gateway bridges on-premises storage and AWS." },
      { label: "Amazon EBS", explanation: "EBS is block storage for EC2." },
      { label: "Amazon EFS", explanation: "EFS is shared Linux file storage." },
      { label: "EC2 Instance Store", explanation: "Instance Store is temporary local EC2 storage." },
    ],
    answer: 0,
    topic: "Storage Gateway",
  },
  {
    question: "Which service helps recover servers in AWS after a data center disaster?",
    options: [
      { label: "AWS Elastic Disaster Recovery", explanation: "Correct. DRS continuously replicates servers into AWS for recovery." },
      { label: "Amazon S3 only", explanation: "S3 stores objects but does not automatically recreate servers." },
      { label: "Amazon FSx", explanation: "FSx is managed file storage." },
      { label: "EBS volume resize", explanation: "Resizing a volume is not disaster recovery replication." },
    ],
    answer: 0,
    topic: "Disaster Recovery",
  },
  {
    question: "What is an Amazon EBS Snapshot?",
    options: [
      { label: "A point-in-time backup of an EBS volume", explanation: "Correct. A snapshot captures EBS volume data at a specific point." },
      { label: "A temporary cache disk", explanation: "That describes Instance Store use cases." },
      { label: "A Windows shared folder", explanation: "That is closer to FSx for Windows File Server." },
      { label: "A command-line tool", explanation: "AWS CLI is the command-line tool." },
    ],
    answer: 0,
    topic: "EBS Snapshots",
  },
  {
    question: "Where are EBS snapshots stored?",
    options: [
      { label: "Amazon S3, managed by AWS", explanation: "Correct. Snapshots are stored in S3 and redundantly within the Region." },
      { label: "Only inside the original EC2 instance", explanation: "Snapshots are separate from the EC2 instance." },
      { label: "Only on the Instance Store", explanation: "Instance Store is temporary host-attached storage." },
      { label: "Only in a local laptop", explanation: "Snapshots are AWS-managed backups." },
    ],
    answer: 0,
    topic: "EBS Snapshots",
  },
  {
    question: "After the first EBS snapshot, what do later snapshots store?",
    options: [
      { label: "Only changed blocks", explanation: "Correct. Later snapshots are incremental." },
      { label: "A full copy every time", explanation: "The first snapshot is full; later ones store changed blocks." },
      { label: "Only IAM permissions", explanation: "Snapshots store volume data blocks, not IAM permissions." },
      { label: "Only database passwords", explanation: "Snapshots are block-level backups." },
    ],
    answer: 0,
    topic: "Incremental snapshots",
  },
  {
    question: "Which service automates EBS snapshot schedules and retention?",
    options: [
      { label: "Amazon Data Lifecycle Manager", explanation: "Correct. DLM automates snapshot policies." },
      { label: "Amazon CloudFront", explanation: "CloudFront is a CDN." },
      { label: "Amazon Route 53", explanation: "Route 53 is DNS." },
      { label: "Amazon EFS", explanation: "EFS is shared file storage." },
    ],
    answer: 0,
    topic: "DLM",
  },
  {
    question: "Who is responsible for deciding how often to create EBS snapshots?",
    options: [
      { label: "The customer", explanation: "Correct. Customers configure backup schedules manually or with DLM." },
      { label: "AWS automatically for every EBS volume", explanation: "AWS does not automatically back up every EBS volume unless configured." },
      { label: "Only Amazon S3 users", explanation: "Snapshot scheduling is an EBS backup responsibility." },
      { label: "Only the physical disk vendor", explanation: "AWS manages hardware; customers manage backup policy." },
    ],
    answer: 0,
    topic: "Shared responsibility",
  },
];

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-background/50 p-4">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium">
              {step}
            </div>
            {index < steps.length - 1 ? <ArrowRight className="h-4 w-4 text-primary" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StorageTopicCard({ topic }: { topic: StorageTopic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id={topic.id} className="scroll-mt-28 space-y-4">
      <div>
        <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
          {topic.category}
        </Badge>
        <h3 className="font-headline text-2xl font-bold md:text-3xl">{topic.title}</h3>
      </div>
      <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
        <CardContent className="space-y-5 p-5 md:p-6">
          <div className="space-y-4 text-sm leading-7 text-muted-foreground">
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">What it is</p>
              <p>{topic.definition}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="font-semibold text-foreground">Why it matters</p>
              <p>{topic.why}</p>
            </div>
            <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
              <p className="font-semibold">Memory trick</p>
              <p>{topic.memory}</p>
            </div>
            <div className="rounded-lg border border-warning/20 bg-warning/10 p-4 text-warning">
              <p className="font-semibold">Exam tip</p>
              <p>{topic.examTip}</p>
            </div>
          </div>

          <Flow steps={topic.diagram} />

          <Button variant="outline" className="rounded-full border-white/10" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Hide examples" : "Show examples and use cases"}
          </Button>

          {expanded ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-background/40 p-4">
                <p className="font-semibold">Real-world examples</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {topic.examples.map((example) => (
                    <li key={example}>- {example}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-4">
                <p className="font-semibold">Good for</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {topic.goodFor.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                {topic.notGoodFor ? (
                  <>
                    <p className="mt-4 font-semibold">Not good for</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                      {topic.notGoodFor.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function ComparisonTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-primary/10 text-primary">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-white/10">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3 leading-6 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SnapshotTimeline() {
  return (
    <Card className="border-white/10 bg-card/55 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Incremental Snapshot Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Flow steps={["Snapshot 1: 100 GB", "Snapshot 2: +5 GB", "Snapshot 3: +2 GB", "Each appears complete"]} />
        <p className="text-sm leading-7 text-muted-foreground">
          The first snapshot copies all used blocks. Later snapshots store only changed
          blocks, which helps backups complete faster and reduces storage cost. AWS manages
          dependencies automatically when snapshots are deleted.
        </p>
      </CardContent>
    </Card>
  );
}

function StorageQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = useMemo(
    () => storageQuestions.reduce((count, question, index) => count + (answers[index] === question.answer ? 1 : 0), 0),
    [answers]
  );

  return (
    <section className="space-y-5">
      <div>
        <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
          Exam Practice
        </Badge>
        <h3 className="font-headline text-2xl font-bold md:text-3xl">Cloud Practitioner Storage Quiz</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Practice the common storage clues: persistent block storage, temporary cache,
          object storage, shared file systems, hybrid storage, disaster recovery, snapshots,
          and DLM automation.
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-background">
        <div className="h-full bg-primary transition-all" style={{ width: `${(answered / storageQuestions.length) * 100}%` }} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {storageQuestions.map((question, questionIndex) => {
          const selected = answers[questionIndex];

          return (
            <Card key={question.question} className="border-white/10 bg-card/55 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Question {questionIndex + 1}
                  </Badge>
                  <Badge variant="secondary">{question.topic}</Badge>
                </div>
                <p className="font-semibold leading-7">{question.question}</p>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = question.answer === optionIndex;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSelected && isCorrect && "border-success/50 bg-success/10 text-success",
                        isSelected && !isCorrect && "border-destructive/40 bg-destructive/10 text-destructive",
                        !isSelected && "border-white/10 bg-background/50 hover:border-primary/30"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
                {selected !== undefined ? (
                  <div className="space-y-2 rounded-lg border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
                    {question.options.map((option, optionIndex) => (
                      <p key={`${question.question}-${option.label}`}>
                        <span className="font-semibold text-foreground">
                          {optionIndex === question.answer ? "Correct" : "Incorrect"}:
                        </span>{" "}
                        {option.explanation}
                      </p>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold">Score: {correct} / {storageQuestions.length}</p>
          <Button variant="outline" className="rounded-full border-white/10" onClick={() => setAnswers({})}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Quiz
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export function Module6Storage() {
  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              AWS Certified Cloud Practitioner
            </Badge>
            <Badge variant="secondary">Module 6</Badge>
          </div>
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            AWS Storage Services
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Learn block storage, object storage, file storage, hybrid storage, disaster
            recovery, EBS snapshots, and Data Lifecycle Manager with practical examples and
            exam-ready comparisons.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,820px)] lg:justify-center">
        <aside className="lg:self-start">
          <Card className="border-white/10 bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Storage Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {storageTopics.map((topic, index) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => document.getElementById(topic.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-background/40 p-3 text-left text-sm leading-5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="mt-0.5 text-xs font-semibold">{index + 1}</span>
                  <span>{topic.title}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        <div className="w-full max-w-[820px] space-y-10">
          {storageTopics.map((topic) => (
            <StorageTopicCard key={topic.id} topic={topic} />
          ))}

          <ComparisonTable
            title="AWS Storage Categories"
            columns={["AWS Service", "Storage Type", "Persistence", "Best For"]}
            rows={storageComparisonRows}
          />
          <ComparisonTable
            title="Amazon EBS vs EC2 Instance Store"
            columns={["Feature", "Amazon EBS", "EC2 Instance Store"]}
            rows={ebsVsInstanceStoreRows}
          />
          <ComparisonTable
            title="Scenario to AWS Storage Service"
            columns={["Requirement", "AWS Service"]}
            rows={scenarioComparisonRows}
          />
          <SnapshotTimeline />
          <ComparisonTable
            title="EBS Snapshot Quick Cheat Sheet"
            columns={["Feature", "Amazon EBS Snapshot"]}
            rows={snapshotCheatSheet}
          />
          <Card className="border-success/20 bg-success/10">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-success">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-headline text-2xl font-bold">Storage Exam Memory Map</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["EBS", "Permanent hard drive for EC2"],
                  ["Instance Store", "Temporary whiteboard storage"],
                  ["S3", "Cloud Dropbox for objects"],
                  ["EFS", "Shared Linux network drive"],
                  ["FSx", "Specialized enterprise file systems"],
                  ["Storage Gateway", "Bridge from office storage to AWS"],
                  ["Elastic Disaster Recovery", "Recover servers after disasters"],
                  ["DLM", "Snapshot scheduler"],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/40 p-4">
                    <p className="font-semibold">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <StorageQuiz />
        </div>
      </div>
    </div>
  );
}
