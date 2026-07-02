export type AwsQuizOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type AwsQuizQuestion = {
  id: string;
  question: string;
  options: AwsQuizOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  whyWrong: Record<"A" | "B" | "C" | "D", string>;
  examTip: string;
  memoryHack: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topic: string;
  realWorldExample: string;
  interviewQuestion: string;
  beginnerMistake: string;
};

export type AwsQuiz = {
  id: string;
  title: string;
  durationMinutes: number;
  suggestedNextLesson: string;
  readinessLabel: string;
  questions: AwsQuizQuestion[];
};

export const awsQuizzes: Record<string, AwsQuiz> = {
  "week-1-cloud-fundamentals": {
    id: "week-1-cloud-fundamentals",
    title: "Cloud Fundamentals Quiz",
    durationMinutes: 12,
    suggestedNextLesson: "Core AWS Services",
    readinessLabel: "Cloud Practitioner Ready",
    questions: [
      {
        id: "cloud-definition",
        question: "What is the best definition of cloud computing?",
        options: [
          { id: "A", text: "Buying physical servers for your office" },
          { id: "B", text: "Using IT resources over the internet on demand" },
          { id: "C", text: "Installing software only on one computer" },
          { id: "D", text: "Replacing every application with automation" },
        ],
        correctAnswer: "B",
        explanation:
          "Cloud computing provides on-demand access to compute, storage, databases, and other IT resources over the internet with pay-as-you-go pricing.",
        whyWrong: {
          A: "Buying physical servers is traditional on-premises infrastructure, not cloud computing.",
          B: "This is correct because cloud resources are delivered on demand over the internet.",
          C: "Local software installation does not describe scalable cloud resources.",
          D: "Automation can be part of cloud operations, but it is not the definition of cloud computing.",
        },
        examTip: "Look for phrases like on-demand, over the internet, scalable, and pay as you go.",
        memoryHack: "Cloud = rent technology when needed instead of owning hardware.",
        difficulty: "Beginner",
        topic: "Cloud Concepts",
        realWorldExample:
          "A startup launches servers in minutes for a campaign instead of waiting weeks to buy hardware.",
        interviewQuestion: "Why would a company move from on-premises servers to AWS?",
        beginnerMistake: "Thinking cloud always means cheaper; it means flexible and pay-per-use when managed well.",
      },
      {
        id: "iaas-example",
        question: "Which AWS service is the clearest IaaS example?",
        options: [
          { id: "A", text: "Amazon EC2" },
          { id: "B", text: "Amazon QuickSight" },
          { id: "C", text: "AWS Skill Builder" },
          { id: "D", text: "Amazon WorkMail" },
        ],
        correctAnswer: "A",
        explanation:
          "Amazon EC2 provides virtual machines where you manage the operating system, runtime, software, and application.",
        whyWrong: {
          A: "This is correct because EC2 gives infrastructure-level virtual server control.",
          B: "QuickSight is an analytics/business intelligence service, not IaaS.",
          C: "Skill Builder is a training platform, not infrastructure.",
          D: "WorkMail is managed email software, closer to SaaS.",
        },
        examTip: "EC2 almost always maps to IaaS in Cloud Practitioner questions.",
        memoryHack: "EC2 = Elastic Compute = virtual computer.",
        difficulty: "Beginner",
        topic: "Service Models",
        realWorldExample: "You install Node.js and host a Next.js app on an EC2 instance.",
        interviewQuestion: "What responsibilities do you keep when using EC2?",
        beginnerMistake: "Assuming AWS patches your EC2 operating system automatically in every case.",
      },
      {
        id: "elasticity",
        question: "What does elasticity mean in cloud computing?",
        options: [
          { id: "A", text: "Resources stay at maximum capacity all the time" },
          { id: "B", text: "Resources automatically adjust to demand" },
          { id: "C", text: "Every workload runs without internet access" },
          { id: "D", text: "Data is stored only in one Availability Zone" },
        ],
        correctAnswer: "B",
        explanation:
          "Elasticity means resources can scale out and in automatically as demand rises and falls.",
        whyWrong: {
          A: "Keeping maximum capacity wastes money and is the opposite of elastic behavior.",
          B: "This is correct because elasticity follows actual demand.",
          C: "Internet access is a networking topic, not elasticity.",
          D: "Single-AZ storage is not elasticity and may reduce availability.",
        },
        examTip: "Elasticity is automatic scaling up and down; scalability is the ability to handle growth.",
        memoryHack: "Elastic stretches and shrinks.",
        difficulty: "Beginner",
        topic: "Cloud Benefits",
        realWorldExample: "An ecommerce site adds capacity during a sale and removes it afterward.",
        interviewQuestion: "How is elasticity different from scalability?",
        beginnerMistake: "Using scalability and elasticity as exact synonyms.",
      },
      {
        id: "high-availability",
        question: "Which design best supports high availability on AWS?",
        options: [
          { id: "A", text: "One server in one Availability Zone" },
          { id: "B", text: "Multiple Availability Zones" },
          { id: "C", text: "No backup strategy" },
          { id: "D", text: "Manual deployment only" },
        ],
        correctAnswer: "B",
        explanation:
          "High availability reduces single points of failure, often by deploying across multiple Availability Zones.",
        whyWrong: {
          A: "One server in one AZ is a single point of failure.",
          B: "This is correct because multiple AZs improve resilience.",
          C: "No backups increase risk and do not improve availability.",
          D: "Manual deployment does not make a system highly available.",
        },
        examTip: "If the exam says high availability, think multiple AZs.",
        memoryHack: "HA = Have Another zone.",
        difficulty: "Beginner",
        topic: "Reliability",
        realWorldExample: "A load balancer sends traffic to EC2 instances in two Availability Zones.",
        interviewQuestion: "Why is multi-AZ deployment important?",
        beginnerMistake: "Confusing Regions and Availability Zones.",
      },
      {
        id: "shared-responsibility",
        question: "In the shared responsibility model, what is the customer responsible for?",
        options: [
          { id: "A", text: "AWS physical data center security" },
          { id: "B", text: "AWS global network hardware" },
          { id: "C", text: "Data, identity, access, and configuration" },
          { id: "D", text: "Replacing failed AWS servers" },
        ],
        correctAnswer: "C",
        explanation:
          "AWS is responsible for security of the cloud. Customers are responsible for security in the cloud, including data and configuration.",
        whyWrong: {
          A: "Physical data center security is AWS responsibility.",
          B: "The global network hardware is AWS responsibility.",
          C: "This is correct because customers manage data, identities, access, and many configurations.",
          D: "Hardware replacement inside AWS facilities is AWS responsibility.",
        },
        examTip: "AWS secures the cloud; you secure what you put in the cloud.",
        memoryHack: "Of the cloud = AWS. In the cloud = customer.",
        difficulty: "Beginner",
        topic: "Security",
        realWorldExample: "AWS protects the data center, but you configure IAM and S3 bucket access.",
        interviewQuestion: "Give examples of customer responsibilities in AWS.",
        beginnerMistake: "Assuming AWS is responsible for all security settings.",
      },
      {
        id: "hybrid-cloud",
        question: "Which cloud model combines on-premises systems with cloud services?",
        options: [
          { id: "A", text: "Public cloud" },
          { id: "B", text: "Private cloud" },
          { id: "C", text: "Hybrid cloud" },
          { id: "D", text: "Offline cloud" },
        ],
        correctAnswer: "C",
        explanation:
          "Hybrid cloud connects on-premises infrastructure with cloud services, often during migration or enterprise integration.",
        whyWrong: {
          A: "Public cloud is provider-owned cloud infrastructure such as AWS.",
          B: "Private cloud is dedicated to one organization but does not necessarily combine on-prem and public cloud.",
          C: "This is correct because hybrid cloud blends on-premises and cloud environments.",
          D: "Offline cloud is not a standard cloud deployment model.",
        },
        examTip: "Hybrid means a mix of on-premises plus cloud.",
        memoryHack: "Hybrid car uses two systems; hybrid cloud uses two environments.",
        difficulty: "Beginner",
        topic: "Cloud Models",
        realWorldExample: "A bank keeps legacy systems on-premises while using AWS for analytics.",
        interviewQuestion: "Why do enterprises use hybrid cloud during migration?",
        beginnerMistake: "Thinking hybrid means using two AWS Regions.",
      },
      {
        id: "vertical-scaling",
        question: "What is vertical scaling?",
        options: [
          { id: "A", text: "Adding more instances" },
          { id: "B", text: "Increasing the size or power of one resource" },
          { id: "C", text: "Using multiple accounts" },
          { id: "D", text: "Deleting unused resources" },
        ],
        correctAnswer: "B",
        explanation:
          "Vertical scaling means making one resource larger, such as moving an EC2 instance to a bigger instance type.",
        whyWrong: {
          A: "Adding more instances is horizontal scaling.",
          B: "This is correct because vertical scaling increases capacity of a single resource.",
          C: "Multiple accounts are an organizational strategy, not scaling.",
          D: "Deleting unused resources is cost cleanup, not scaling.",
        },
        examTip: "Vertical = bigger machine. Horizontal = more machines.",
        memoryHack: "Vertical scaling grows upward.",
        difficulty: "Beginner",
        topic: "Scalability",
        realWorldExample: "Changing an EC2 instance from t3.small to t3.large.",
        interviewQuestion: "Compare vertical and horizontal scaling.",
        beginnerMistake: "Calling Auto Scaling vertical scaling when it adds more instances.",
      },
      {
        id: "disaster-recovery",
        question: "Which phrase best describes disaster recovery?",
        options: [
          { id: "A", text: "Preventing all user mistakes" },
          { id: "B", text: "Restoring systems after a major incident" },
          { id: "C", text: "Writing application code faster" },
          { id: "D", text: "Choosing a database name" },
        ],
        correctAnswer: "B",
        explanation:
          "Disaster recovery is the plan and process for restoring applications and data after a serious outage or failure.",
        whyWrong: {
          A: "DR reduces impact but does not prevent every user mistake.",
          B: "This is correct because DR focuses on recovery after disruption.",
          C: "Developer velocity is not disaster recovery.",
          D: "Naming a database is unrelated to recovery planning.",
        },
        examTip: "DR questions often mention backup and restore, pilot light, warm standby, or multi-site.",
        memoryHack: "Disaster recovery = recover from disaster.",
        difficulty: "Beginner",
        topic: "Reliability",
        realWorldExample: "Restoring an application from backups after a database failure.",
        interviewQuestion: "What is the difference between high availability and disaster recovery?",
        beginnerMistake: "Thinking backups alone are a complete disaster recovery strategy.",
      },
      {
        id: "pay-as-you-go",
        question: "What is a major cloud cost benefit?",
        options: [
          { id: "A", text: "Large upfront hardware purchases are required" },
          { id: "B", text: "You pay only for resources you use" },
          { id: "C", text: "Every workload becomes free" },
          { id: "D", text: "You must overprovision forever" },
        ],
        correctAnswer: "B",
        explanation:
          "AWS pricing is commonly pay-as-you-go, helping teams avoid large upfront hardware purchases and reduce unused capacity.",
        whyWrong: {
          A: "Avoiding large upfront purchases is a cloud benefit.",
          B: "This is correct because cloud pricing aligns cost with consumption.",
          C: "Cloud is not free; poor usage can still become expensive.",
          D: "Elasticity helps avoid permanent overprovisioning.",
        },
        examTip: "Cost questions often reward pay-as-you-go and right-sizing.",
        memoryHack: "Use it, pay for it. Stop it, stop paying for many resources.",
        difficulty: "Beginner",
        topic: "Billing",
        realWorldExample: "Stopping unused development EC2 instances after work hours.",
        interviewQuestion: "How does pay-as-you-go change infrastructure planning?",
        beginnerMistake: "Leaving resources running and expecting AWS to be automatically cheap.",
      },
      {
        id: "security-of-cloud",
        question: "What does AWS mean by security of the cloud?",
        options: [
          { id: "A", text: "Customer IAM passwords" },
          { id: "B", text: "Customer application code" },
          { id: "C", text: "AWS physical facilities and global infrastructure" },
          { id: "D", text: "Customer database rows" },
        ],
        correctAnswer: "C",
        explanation:
          "Security of the cloud means AWS protects the infrastructure that runs AWS services, including facilities, hardware, and global infrastructure.",
        whyWrong: {
          A: "Customer IAM passwords are customer responsibility.",
          B: "Application code is customer responsibility.",
          C: "This is correct because AWS secures the underlying cloud infrastructure.",
          D: "Customer data is customer responsibility to classify, protect, and configure.",
        },
        examTip: "The phrase of the cloud points to AWS responsibility.",
        memoryHack: "AWS owns the building; you own your belongings inside it.",
        difficulty: "Beginner",
        topic: "Security",
        realWorldExample: "AWS controls physical access to data centers; you control IAM access to your app.",
        interviewQuestion: "What is one AWS responsibility and one customer responsibility?",
        beginnerMistake: "Assuming AWS manages your users, passwords, and app data automatically.",
      },
    ],
  },
  "week-2-core-services": {
    id: "week-2-core-services",
    title: "Core AWS Services Quiz",
    durationMinutes: 15,
    suggestedNextLesson: "Security + Monitoring",
    readinessLabel: "Core Services Ready",
    questions: [
      {
        id: "ec2-vs-lambda",
        question: "What is the main difference between Amazon EC2 and AWS Lambda?",
        options: [
          { id: "A", text: "EC2 is object storage; Lambda is block storage" },
          { id: "B", text: "EC2 gives virtual servers you manage; Lambda runs code without managing servers" },
          { id: "C", text: "EC2 only runs databases; Lambda only runs containers" },
          { id: "D", text: "EC2 is serverless; Lambda requires OS patching" },
        ],
        correctAnswer: "B",
        explanation:
          "EC2 provides virtual machines with operating system control. Lambda abstracts servers and runs code in response to events.",
        whyWrong: {
          A: "EC2 and Lambda are compute services, not storage services.",
          B: "This is correct: EC2 is server-based compute; Lambda is serverless event-driven compute.",
          C: "EC2 can run many workloads, and Lambda is not a container orchestration service.",
          D: "This reverses the responsibilities; Lambda is serverless, EC2 requires more management.",
        },
        examTip: "Choose EC2 for control and long-running workloads; choose Lambda for event-driven short tasks.",
        memoryHack: "EC2 = elastic computer. Lambda = function on demand.",
        difficulty: "Beginner",
        topic: "Compute",
        realWorldExample: "Run a full Next.js server on EC2, but resize uploaded images with Lambda.",
        interviewQuestion: "When would you choose Lambda over EC2?",
        beginnerMistake: "Using Lambda for every backend even when the process is long-running.",
      },
      {
        id: "ecs-vs-eks",
        question: "When would you choose ECS instead of EKS?",
        options: [
          { id: "A", text: "When you want simpler AWS-native container orchestration" },
          { id: "B", text: "When you need to manage Kubernetes control plane yourself" },
          { id: "C", text: "When you need object storage" },
          { id: "D", text: "When you need a managed relational database" },
        ],
        correctAnswer: "A",
        explanation:
          "ECS is AWS-native and simpler to operate for many container workloads. EKS is managed Kubernetes and usually more complex.",
        whyWrong: {
          A: "This is correct because ECS is simpler and AWS-native.",
          B: "EKS is Kubernetes-based; AWS manages the EKS control plane.",
          C: "Object storage is Amazon S3, not ECS.",
          D: "Managed relational database is RDS or Aurora, not ECS.",
        },
        examTip: "ECS = AWS containers. EKS = Kubernetes on AWS.",
        memoryHack: "ECS has C for Containers; EKS has K for Kubernetes.",
        difficulty: "Intermediate",
        topic: "Compute",
        realWorldExample: "A team already using AWS can deploy Docker APIs on ECS with less Kubernetes overhead.",
        interviewQuestion: "How do ECS and EKS differ?",
        beginnerMistake: "Thinking ECS and EKS are the same service with different names.",
      },
      {
        id: "storage-types",
        question: "Which mapping is correct for S3, EBS, and EFS?",
        options: [
          { id: "A", text: "S3 = block, EBS = file, EFS = object" },
          { id: "B", text: "S3 = object, EBS = block, EFS = file" },
          { id: "C", text: "S3 = file, EBS = object, EFS = archive" },
          { id: "D", text: "S3 = database, EBS = network, EFS = compute" },
        ],
        correctAnswer: "B",
        explanation:
          "S3 stores objects, EBS provides block storage for EC2, and EFS provides shared file storage.",
        whyWrong: {
          A: "This swaps the storage types incorrectly.",
          B: "This is correct and is a very common exam comparison.",
          C: "S3 is object storage, and Glacier is archive storage.",
          D: "These are storage services, not database, network, or compute categories.",
        },
        examTip: "Memorize object/block/file: S3/EBS/EFS.",
        memoryHack: "S3 stores Stuff, EBS is a Block disk, EFS is a File system.",
        difficulty: "Beginner",
        topic: "Storage",
        realWorldExample: "Store user images in S3, EC2 boot disk in EBS, and shared uploads in EFS.",
        interviewQuestion: "Explain when to use S3, EBS, and EFS.",
        beginnerMistake: "Trying to attach S3 as an EC2 boot disk.",
      },
      {
        id: "archive-storage",
        question: "Which AWS storage service is best for long-term archival?",
        options: [
          { id: "A", text: "Amazon S3 Glacier" },
          { id: "B", text: "Amazon EBS" },
          { id: "C", text: "Amazon EFS" },
          { id: "D", text: "Amazon EC2" },
        ],
        correctAnswer: "A",
        explanation:
          "S3 Glacier is designed for low-cost long-term archives where retrieval can be slower.",
        whyWrong: {
          A: "This is correct for compliance archives, old backups, and long-term records.",
          B: "EBS is block storage for EC2, not low-cost archive storage.",
          C: "EFS is shared file storage, not archive storage.",
          D: "EC2 is compute, not storage.",
        },
        examTip: "Archive and lowest-cost long-term storage usually points to Glacier.",
        memoryHack: "Glacier = cold storage.",
        difficulty: "Beginner",
        topic: "Storage",
        realWorldExample: "A company archives seven-year financial records in Glacier.",
        interviewQuestion: "Why not use EBS for long-term archives?",
        beginnerMistake: "Choosing S3 Standard or EBS for rarely accessed long-term records.",
      },
      {
        id: "rds-vs-dynamodb",
        question: "What is the difference between Amazon RDS and DynamoDB?",
        options: [
          { id: "A", text: "RDS is relational; DynamoDB is NoSQL" },
          { id: "B", text: "RDS is object storage; DynamoDB is file storage" },
          { id: "C", text: "RDS is serverless compute; DynamoDB is a virtual machine" },
          { id: "D", text: "RDS is for DNS; DynamoDB is for networking" },
        ],
        correctAnswer: "A",
        explanation:
          "RDS is managed relational SQL database. DynamoDB is managed NoSQL key-value/document database.",
        whyWrong: {
          A: "This is correct and is the central exam distinction.",
          B: "Neither service is object or file storage.",
          C: "Neither service is compute.",
          D: "DNS and networking are unrelated to these database services.",
        },
        examTip: "SQL schema and joins suggest RDS/Aurora; massive key-value scale suggests DynamoDB.",
        memoryHack: "R in RDS = relational. Dynamo = fast NoSQL.",
        difficulty: "Beginner",
        topic: "Database",
        realWorldExample: "Use RDS for orders and payments; use DynamoDB for shopping cart sessions.",
        interviewQuestion: "When would DynamoDB be a better fit than RDS?",
        beginnerMistake: "Using DynamoDB when the app needs complex relational joins.",
      },
      {
        id: "aurora",
        question: "Why might you choose Amazon Aurora over a standard RDS engine?",
        options: [
          { id: "A", text: "Aurora is AWS cloud-native with high performance and replication" },
          { id: "B", text: "Aurora is a static public IP address" },
          { id: "C", text: "Aurora stores files in buckets" },
          { id: "D", text: "Aurora is Kubernetes orchestration" },
        ],
        correctAnswer: "A",
        explanation:
          "Aurora is AWS's cloud-native relational database compatible with MySQL and PostgreSQL, designed for performance and availability.",
        whyWrong: {
          A: "This is correct because Aurora improves performance, replication, fault tolerance, and availability.",
          B: "A static public IP is Elastic IP.",
          C: "Bucket object storage is S3.",
          D: "Kubernetes orchestration is EKS.",
        },
        examTip: "Aurora = relational database optimized for AWS cloud.",
        memoryHack: "Aurora is the upgraded AWS-native RDS-style engine.",
        difficulty: "Intermediate",
        topic: "Database",
        realWorldExample: "A high-traffic ecommerce app uses Aurora for a resilient SQL database.",
        interviewQuestion: "How is Aurora related to MySQL and PostgreSQL?",
        beginnerMistake: "Thinking Aurora is NoSQL like DynamoDB.",
      },
      {
        id: "vpc-purpose",
        question: "What is the purpose of an Amazon VPC?",
        options: [
          { id: "A", text: "It is your private network inside AWS" },
          { id: "B", text: "It stores objects such as images and PDFs" },
          { id: "C", text: "It runs serverless functions" },
          { id: "D", text: "It archives old backups" },
        ],
        correctAnswer: "A",
        explanation:
          "A VPC is a logically isolated private network where AWS resources such as EC2 instances and databases can run.",
        whyWrong: {
          A: "This is correct: VPC is your private AWS network.",
          B: "Object storage is S3.",
          C: "Serverless functions are Lambda.",
          D: "Archive storage is S3 Glacier.",
        },
        examTip: "VPC questions are networking questions.",
        memoryHack: "VPC = Virtual Private Cloud network.",
        difficulty: "Beginner",
        topic: "Networking",
        realWorldExample: "Your web servers and databases run in subnets inside one VPC.",
        interviewQuestion: "Why place application resources inside a VPC?",
        beginnerMistake: "Thinking every AWS managed service runs directly inside your VPC by default.",
      },
      {
        id: "subnets",
        question: "What is the difference between a public subnet and a private subnet?",
        options: [
          { id: "A", text: "Public subnets can route to the internet; private subnets do not allow direct inbound internet access" },
          { id: "B", text: "Private subnets are always outside a VPC" },
          { id: "C", text: "Public subnets are only for databases" },
          { id: "D", text: "There is no difference" },
        ],
        correctAnswer: "A",
        explanation:
          "Public subnets have a route to an Internet Gateway for internet-facing resources. Private subnets are for internal resources.",
        whyWrong: {
          A: "This is correct and is essential for VPC design.",
          B: "Subnets exist inside a VPC.",
          C: "Databases are usually private, not public.",
          D: "The routing and exposure are different.",
        },
        examTip: "Load balancers often live in public subnets; databases usually live in private subnets.",
        memoryHack: "Public faces people; private protects data.",
        difficulty: "Beginner",
        topic: "Networking",
        realWorldExample: "Put an Application Load Balancer in public subnets and RDS in private subnets.",
        interviewQuestion: "Why should databases usually be in private subnets?",
        beginnerMistake: "Putting databases in public subnets for convenience.",
      },
      {
        id: "nat-gateway",
        question: "Why is a NAT Gateway used?",
        options: [
          { id: "A", text: "To let private subnet resources access the internet outbound without direct inbound exposure" },
          { id: "B", text: "To store static website files" },
          { id: "C", text: "To manage Kubernetes pods" },
          { id: "D", text: "To replace IAM policies" },
        ],
        correctAnswer: "A",
        explanation:
          "NAT Gateway lets resources in private subnets initiate outbound internet connections while remaining unreachable directly from the internet.",
        whyWrong: {
          A: "This is correct and is the main NAT Gateway exam purpose.",
          B: "Static website files are commonly stored in S3.",
          C: "Kubernetes pods are managed by EKS/Kubernetes.",
          D: "IAM policies control permissions, not network routing.",
        },
        examTip: "Private subnet needs updates from the internet? Think NAT Gateway.",
        memoryHack: "NAT = private goes out, public cannot come in.",
        difficulty: "Intermediate",
        topic: "Networking",
        realWorldExample: "A private EC2 instance downloads OS patches through a NAT Gateway.",
        interviewQuestion: "How does NAT Gateway protect private resources?",
        beginnerMistake: "Using an Internet Gateway directly for private subnet resources.",
      },
      {
        id: "security-group-vs-nacl",
        question: "What is the difference between a Security Group and a Network ACL?",
        options: [
          { id: "A", text: "Security Groups are stateful instance firewalls; NACLs are stateless subnet firewalls" },
          { id: "B", text: "Security Groups store objects; NACLs run functions" },
          { id: "C", text: "Security Groups are databases; NACLs are containers" },
          { id: "D", text: "They are identical" },
        ],
        correctAnswer: "A",
        explanation:
          "Security Groups apply at the instance level and are stateful. Network ACLs apply at the subnet level and are stateless.",
        whyWrong: {
          A: "This is correct and commonly tested.",
          B: "Neither service is storage or compute.",
          C: "Neither service is database or container orchestration.",
          D: "They differ by level, rule behavior, and statefulness.",
        },
        examTip: "Security Group = instance + stateful. NACL = subnet + stateless.",
        memoryHack: "SG guards the server; NACL guards the network lane.",
        difficulty: "Intermediate",
        topic: "Networking",
        realWorldExample: "Allow HTTPS on a web EC2 Security Group, and use NACLs for subnet-level guardrails.",
        interviewQuestion: "Why must return traffic be considered with NACLs?",
        beginnerMistake: "Forgetting NACLs are stateless.",
      },
      {
        id: "elastic-ip",
        question: "What is an Elastic IP?",
        options: [
          { id: "A", text: "A static public IPv4 address you can allocate to AWS resources" },
          { id: "B", text: "A shared file system" },
          { id: "C", text: "A managed NoSQL database" },
          { id: "D", text: "A container orchestration service" },
        ],
        correctAnswer: "A",
        explanation:
          "Elastic IP is a static public IPv4 address that can be remapped to another resource if needed.",
        whyWrong: {
          A: "This is correct for stable public IP use cases.",
          B: "A shared file system is EFS.",
          C: "Managed NoSQL database is DynamoDB.",
          D: "Container orchestration is ECS or EKS.",
        },
        examTip: "Stable public IPv4 address points to Elastic IP.",
        memoryHack: "Elastic IP = IP that can move to another instance.",
        difficulty: "Beginner",
        topic: "Networking",
        realWorldExample: "A legacy partner allowlists your fixed Elastic IP for API calls.",
        interviewQuestion: "When would you need a fixed public IP in AWS?",
        beginnerMistake: "Allocating Elastic IPs and leaving them unused, which can create cost.",
      },
    ],
  },
};
