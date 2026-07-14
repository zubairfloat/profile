import type {
  CheatSheetItem,
  NetworkingSection,
  NetworkingTopic,
  QuizQuestion,
  ServiceComparison,
} from "./types/networking.types";

export const networkingSections: NetworkingSection[] = [
  {
    id: "global-networking",
    title: "Global Infrastructure and Basic Networking",
    intro:
      "Start with the map. AWS is global, Regions are geographic locations, Availability Zones are independent buildings, and a VPC is your private network inside AWS.",
  },
  {
    id: "vpc-vpn-gateways",
    title: "VPC, VPN and Gateway Services",
    intro:
      "Learn which gateway opens a VPC to the public Internet and which gateway helps encrypted private office traffic enter AWS.",
  },
  {
    id: "subnets-firewalls",
    title: "Subnets, Network ACLs and Security Groups",
    intro:
      "Understand where packets travel and how AWS networking controls decide whether traffic is allowed.",
  },
  {
    id: "edge-networking",
    title: "Edge Networking Services",
    intro:
      "Route users with Route 53, cache content with CloudFront, and improve global application paths with Global Accelerator.",
  },
  {
    id: "connectivity",
    title: "AWS Connectivity Services",
    intro:
      "Connect employees, offices, data centers, VPCs, private services, private subnets, and APIs using the right AWS service.",
  },
];

export const networkingTopics: NetworkingTopic[] = [
  {
    id: "aws-cloud",
    sectionId: "global-networking",
    name: "AWS Cloud",
    category: "Global infrastructure",
    definition:
      "The AWS Cloud is the full worldwide collection of AWS data centers, networks, Regions, Availability Zones, Edge Locations, and services.",
    why:
      "Companies use it to avoid buying physical hardware, launch faster, scale globally, and pay for what they use.",
    how:
      "AWS operates infrastructure around the world. You choose where to run your workload based on latency, compliance, service availability, pricing, and disaster-recovery needs.",
    analogy: "AWS Cloud = the whole world.",
    useCase:
      "A Netflix-style streaming app can serve global users from cloud infrastructure instead of building data centers in every country.",
    architecture: ["User", "AWS Global Network", "Region", "Availability Zone", "VPC"],
    examTip: "Cloud Practitioner questions often test why cloud is useful: agility, elasticity, global reach, reliability, and pay-as-you-go pricing.",
    checks: [{ question: "What does the AWS Cloud represent?", answer: "The worldwide AWS infrastructure and services." }],
  },
  {
    id: "regions",
    sectionId: "global-networking",
    name: "AWS Regions",
    category: "Global infrastructure",
    definition: "A Region is a separate geographical location where AWS operates multiple Availability Zones.",
    why:
      "Regions let you place applications closer to users, meet compliance needs, control costs, and design disaster recovery.",
    how:
      "You select a Region such as us-east-1 or eu-west-1 when creating many AWS resources. Not every service or price is identical in every Region.",
    analogy: "Region = a city.",
    useCase:
      "A banking application may choose a Region based on data residency rules, not only user distance.",
    architecture: ["AWS Cloud", "Region A", "AZ A", "AZ B", "AZ C"],
    examTip: "Region selection depends on latency, compliance, service availability, pricing, and disaster recovery.",
    checks: [{ question: "What is an AWS Region?", answer: "A geographic AWS location containing multiple Availability Zones." }],
  },
  {
    id: "availability-zones",
    sectionId: "global-networking",
    name: "Availability Zones",
    category: "Global infrastructure",
    definition:
      "An Availability Zone is one or more discrete data centers with independent power, networking, and cooling inside a Region.",
    why:
      "AZs help applications stay available if one facility has a problem.",
    how:
      "You deploy resources across multiple AZs. AWS connects AZs in a Region with high-bandwidth, low-latency networking.",
    analogy: "Availability Zone = an independent building.",
    useCase:
      "An e-commerce application can run web servers in two AZs so checkout still works if one AZ has an issue.",
    architecture: ["Region", "Availability Zone A", "Availability Zone B", "Availability Zone C"],
    examTip: "Multiple AZs are a common answer for high availability.",
    checks: [{ question: "Why use more than one AZ?", answer: "To improve availability and fault tolerance." }],
  },
  {
    id: "vpc",
    sectionId: "global-networking",
    name: "Amazon VPC",
    category: "Networking",
    definition: "Amazon VPC is a logically isolated private network that you define inside AWS.",
    why:
      "A VPC gives you control over IP ranges, subnets, route tables, gateways, and network security boundaries.",
    how:
      "You create subnets inside the VPC, attach gateways when needed, and use route tables to decide where traffic goes.",
    analogy: "VPC = a private office.",
    useCase:
      "A hospital can place patient databases and internal APIs inside a private VPC network.",
    architecture: ["AWS Region", "VPC", "Public Subnet", "Private Subnet", "Database"],
    examTip: "If the question says isolated private network in AWS, think Amazon VPC.",
    checks: [{ question: "What does a VPC isolate?", answer: "Your AWS network resources." }],
  },
  {
    id: "subnets",
    sectionId: "global-networking",
    name: "Subnets",
    category: "Networking",
    definition: "A subnet is a smaller network segment inside a VPC.",
    why:
      "Subnets organize resources by availability zone, access level, and purpose.",
    how:
      "Each subnet lives in one Availability Zone and uses a route table to control traffic paths.",
    analogy: "Subnet = a room or department inside the office.",
    useCase:
      "A retail app can place load balancers in public subnets and databases in private subnets.",
    architecture: ["VPC", "Public Subnet", "Private Subnet"],
    examTip: "A subnet is public because its route table has a route to an Internet Gateway.",
    checks: [{ question: "Where does a subnet exist?", answer: "Inside a VPC and in one Availability Zone." }],
  },
  {
    id: "public-subnet",
    sectionId: "global-networking",
    name: "Public Subnet",
    category: "Networking",
    definition: "A public subnet is a subnet whose route table sends Internet-bound traffic to an Internet Gateway.",
    why:
      "Internet-facing resources such as load balancers and public web servers need a controlled public entry point.",
    how:
      "The route table needs a route to an Internet Gateway. The resource may also need a public IPv4 address or Elastic IP and suitable security rules.",
    analogy: "Public Subnet = reception or storefront.",
    useCase:
      "A customer-facing web tier for an e-commerce site usually belongs in public subnets across multiple AZs.",
    architecture: ["Internet", "Internet Gateway", "Public Subnet", "Application Load Balancer"],
    examTip: "Internet Gateway alone does not automatically make a subnet public; the route table matters.",
    checks: [{ question: "What makes a subnet public?", answer: "A route table route to an Internet Gateway." }],
  },
  {
    id: "private-subnet",
    sectionId: "global-networking",
    name: "Private Subnet",
    category: "Networking",
    definition: "A private subnet does not allow direct inbound access from the public Internet.",
    why:
      "Sensitive resources such as databases, internal APIs, and backend workers should not be directly exposed.",
    how:
      "A private subnet has no direct route for public inbound traffic. It may still initiate outbound IPv4 Internet access through a NAT Gateway.",
    analogy: "Private Subnet = secure vault or storage room.",
    useCase:
      "A production RDS database for a banking app should normally run in private subnets.",
    architecture: ["Application Servers", "Private Subnet", "Amazon RDS Database"],
    examTip: "Production databases normally belong in private subnets.",
    checks: [{ question: "Can a private subnet use a NAT Gateway for outbound updates?", answer: "Yes." }],
  },
  {
    id: "internet-gateway",
    sectionId: "global-networking",
    name: "Internet Gateway",
    category: "Gateway",
    definition: "An Internet Gateway connects a VPC to the public Internet.",
    why:
      "Public websites and Internet-facing applications need a path for public customer traffic.",
    how:
      "Attach it to a VPC and add routes from public subnet route tables. Security Groups and Network ACLs still control allowed traffic.",
    analogy: "Internet Gateway = public front door or main entrance gate.",
    useCase:
      "A Mattress Firm-style retail site can use an Internet Gateway path for public shoppers reaching the load balancer.",
    architecture: ["Internet", "Internet Gateway", "Public Subnet", "Web Server"],
    examTip: "Public customer traffic normally uses an Internet Gateway, not a Virtual Private Gateway.",
    checks: [{ question: "What connects a VPC to the public Internet?", answer: "Internet Gateway." }],
  },
  {
    id: "vpn",
    sectionId: "vpc-vpn-gateways",
    name: "VPN",
    category: "Hybrid connectivity",
    definition: "A VPN is an encrypted tunnel over the public Internet.",
    why:
      "Companies use VPNs when approved private traffic needs to travel securely between users, offices, data centers, and AWS.",
    how:
      "Traffic is encrypted before it crosses the Internet and decrypted at the trusted endpoint on the other side.",
    analogy: "VPN = secure underground tunnel.",
    useCase:
      "A corporate office connects internal staff to private AWS application servers without exposing those servers publicly.",
    architecture: ["Corporate Office", "Encrypted VPN Tunnel", "AWS Gateway", "Private VPC Resources"],
    examTip: "If the clue says encrypted tunnel over the Internet, think VPN.",
    checks: [{ question: "What does a VPN provide?", answer: "An encrypted tunnel over the public Internet." }],
  },
  {
    id: "virtual-private-gateway",
    sectionId: "vpc-vpn-gateways",
    name: "Virtual Private Gateway",
    category: "Hybrid connectivity",
    definition: "A Virtual Private Gateway is the AWS-side gateway for Site-to-Site VPN connectivity.",
    why:
      "It lets approved corporate network traffic reach a VPC through an encrypted VPN tunnel.",
    how:
      "The tunnel runs over the public Internet between the customer gateway and the AWS-side Virtual Private Gateway.",
    analogy: "Virtual Private Gateway = secure AWS-side gate where the tunnel ends.",
    useCase:
      "A hospital headquarters can connect its office network to private AWS resources with Site-to-Site VPN.",
    architecture: ["Corporate Office", "VPN Tunnel", "Virtual Private Gateway", "VPC"],
    examTip: "Virtual Private Gateway is for private VPN connectivity, not normal public website traffic.",
    checks: [{ question: "Where is the Virtual Private Gateway?", answer: "On the AWS side of a Site-to-Site VPN." }],
  },
  {
    id: "network-traffic-packets",
    sectionId: "subnets-firewalls",
    name: "Network Traffic and Packets",
    category: "Networking basics",
    definition:
      "Network traffic is data moving across a network. A packet is a small unit of that data with addressing information.",
    why:
      "AWS networking controls inspect or route packets so applications receive allowed traffic and reject unwanted traffic.",
    how:
      "A request is split into packets. Each packet follows routes and passes through controls such as Network ACLs and Security Groups.",
    analogy: "Packet = a labeled envelope moving through checkpoints.",
    useCase:
      "When a shopper opens a retail website, request packets travel from the browser through the Internet to AWS resources.",
    architecture: ["Customer", "Internet", "Route Table", "Network ACL", "Security Group", "EC2"],
    examTip: "Cloud Practitioner questions may describe packet filtering with subnet-level or resource-level keywords.",
    checks: [{ question: "What is a packet?", answer: "A small unit of network data with addressing information." }],
  },
  {
    id: "network-acl",
    sectionId: "subnets-firewalls",
    name: "Network ACL",
    category: "Network security",
    definition: "A Network ACL is a subnet-level firewall that evaluates inbound and outbound packets separately.",
    why:
      "It provides an extra stateless checkpoint at the subnet boundary.",
    how:
      "Rules are processed in rule-number order. Network ACLs support allow and deny rules. Custom Network ACLs initially deny traffic until rules are configured.",
    analogy: "Network ACL = airport immigration that checks every direction.",
    useCase:
      "An enterprise can add subnet-level deny rules for unwanted IP ranges.",
    architecture: ["Internet", "Internet Gateway", "Network ACL", "Subnet", "EC2"],
    examTip: "Network ACL = subnet level, stateless, allow and deny rules.",
    checks: [{ question: "Which AWS firewall is stateless?", answer: "Network ACL." }],
  },
  {
    id: "security-group",
    sectionId: "subnets-firewalls",
    name: "Security Group",
    category: "Network security",
    definition: "A Security Group is a stateful firewall for supported resources and network interfaces.",
    why:
      "It controls which traffic can reach resources such as EC2 instances and load balancers.",
    how:
      "Security Groups use allow rules only. Unmatched traffic is implicitly denied. Return traffic for an allowed request is automatically allowed.",
    analogy: "Security Group = a guard at an individual office who remembers you.",
    useCase:
      "Allow HTTPS to an application load balancer and allow database traffic only from app servers.",
    architecture: ["Subnet", "Security Group", "EC2 Instance"],
    examTip: "Security Group = resource level, stateful, allow rules only.",
    checks: [{ question: "Which firewall automatically allows return traffic?", answer: "Security Group." }],
  },
  {
    id: "shared-responsibility-networking",
    sectionId: "subnets-firewalls",
    name: "AWS Shared Responsibility for Networking",
    category: "Security responsibility",
    definition:
      "AWS secures the global cloud infrastructure, while customers configure their own network access rules inside AWS.",
    why:
      "Many exam questions test who is responsible for network configuration mistakes.",
    how:
      "AWS manages physical data centers, hardware, and backbone networking. Customers manage VPC design, route tables, Security Groups, Network ACLs, public IP use, and subnet exposure.",
    analogy: "AWS owns the building security; you decide who can enter your office rooms.",
    useCase:
      "If a database is accidentally placed in a public subnet with open rules, that configuration is the customer's responsibility.",
    architecture: ["AWS Responsibility", "Cloud Infrastructure", "Customer Responsibility", "VPC Configuration"],
    examTip: "Network rules, route tables, public exposure, and firewall configuration are customer responsibilities.",
    checks: [{ question: "Who configures Security Group rules?", answer: "The AWS customer." }],
  },
  {
    id: "dns",
    sectionId: "edge-networking",
    name: "DNS",
    category: "Internet fundamentals",
    definition: "DNS translates human-friendly domain names into addresses or resource targets that browsers can reach.",
    why:
      "Users type names such as example.com, but networks need a destination address or endpoint.",
    how:
      "A DNS resolver asks authoritative DNS records for the target, then the browser connects to the returned destination.",
    analogy: "DNS = phone book of the Internet.",
    useCase:
      "A hospital patient portal uses DNS so patients can visit a simple domain instead of memorizing technical endpoints.",
    architecture: ["User enters a domain", "DNS Resolver", "DNS Records", "Application Endpoint"],
    examTip: "If the question asks for domain name resolution, think DNS or Route 53.",
    checks: [{ question: "What does DNS translate?", answer: "Domain names into reachable addresses or targets." }],
  },
  {
    id: "route-53",
    sectionId: "edge-networking",
    name: "Amazon Route 53",
    category: "DNS",
    definition: "Amazon Route 53 is AWS's DNS service for domain registration, DNS resolution, routing, and health checks.",
    why:
      "Users remember names like example.com, but browsers need IP addresses or AWS resource targets.",
    how:
      "Route 53 uses AWS global DNS infrastructure to return the correct record or route users to healthy endpoints.",
    analogy: "Route 53 = phone book of the Internet.",
    useCase:
      "Route users to an Application Load Balancer, CloudFront distribution, S3 website endpoint, or another DNS target.",
    architecture: ["User enters domain", "DNS Resolver", "Route 53", "AWS Resource", "Application"],
    examTip: "Route 53 is DNS and routing; it is not a caching CDN like CloudFront.",
    checks: [{ question: "Which service provides AWS DNS?", answer: "Amazon Route 53." }],
  },
  {
    id: "cloudfront",
    sectionId: "edge-networking",
    name: "Amazon CloudFront",
    category: "Content delivery",
    definition: "Amazon CloudFront is a content delivery network that delivers static and dynamic web content through Edge Locations.",
    why:
      "It reduces latency for users and can reduce load on the origin by caching content closer to users.",
    how:
      "On a cache hit, the Edge Location returns content immediately. On a cache miss, CloudFront retrieves it from the origin such as S3, ALB, or EC2.",
    analogy: "CloudFront = local warehouse.",
    useCase:
      "A streaming application can deliver videos, images, JavaScript, CSS, downloads, and APIs closer to global users.",
    architecture: ["Customer", "Route 53", "CloudFront", "Nearest Edge Location", "Origin"],
    examTip: "If the question says cache content near users, choose CloudFront.",
    checks: [{ question: "What does CloudFront use to serve users closer to them?", answer: "Edge Locations." }],
  },
  {
    id: "global-accelerator",
    sectionId: "edge-networking",
    name: "AWS Global Accelerator",
    category: "Global networking",
    definition: "AWS Global Accelerator improves performance and availability for global applications using the AWS global network.",
    why:
      "Dynamic, non-cacheable traffic such as gaming, APIs, financial apps, and multi-Region apps may need faster routing and failover.",
    how:
      "It uses static anycast IP addresses and routes users to healthy regional endpoints through the AWS network.",
    analogy: "Global Accelerator = AWS express highway.",
    useCase:
      "A gaming application can route players to healthy regional endpoints with low-latency paths.",
    architecture: ["User", "Static Anycast IP", "AWS Global Network", "Healthy Regional Endpoint"],
    examTip: "Global Accelerator does not cache content.",
    checks: [{ question: "Which service improves dynamic global application traffic without caching?", answer: "AWS Global Accelerator." }],
  },
  {
    id: "client-vpn",
    sectionId: "connectivity",
    name: "AWS Client VPN",
    category: "Remote access",
    definition: "AWS Client VPN is a managed client-based VPN service for secure individual user access.",
    why: "Remote employees may need secure access from a laptop to private AWS resources.",
    how: "A user connects with VPN client software, then reaches authorized VPC resources through the encrypted connection.",
    analogy: "Client VPN = one employee connects to AWS.",
    useCase: "A remote developer securely connects to private admin tools inside a VPC.",
    architecture: ["Employee Laptop", "AWS Client VPN", "VPC", "Private Resource"],
    examTip: "Individual remote users point to Client VPN.",
    checks: [{ question: "Which service is best for individual remote employee VPN access?", answer: "AWS Client VPN." }],
  },
  {
    id: "site-to-site-vpn",
    sectionId: "connectivity",
    name: "AWS Site-to-Site VPN",
    category: "Hybrid connectivity",
    definition: "AWS Site-to-Site VPN connects an on-premises network to AWS using encrypted tunnels over the Internet.",
    why: "An entire office, branch, headquarters, or data center may need private access to AWS.",
    how: "It normally uses a customer gateway on the customer side and an AWS-side gateway such as a Virtual Private Gateway or Transit Gateway.",
    analogy: "Site-to-Site VPN = the whole office connects to AWS.",
    useCase: "A branch office connects staff systems to private AWS application servers.",
    architecture: ["Corporate Office", "Encrypted VPN Tunnel", "AWS Gateway", "VPC"],
    examTip: "Entire office over encrypted Internet tunnel = Site-to-Site VPN.",
    checks: [{ question: "Which VPN connects a whole office network to AWS?", answer: "AWS Site-to-Site VPN." }],
  },
  {
    id: "privatelink",
    sectionId: "connectivity",
    name: "AWS PrivateLink",
    category: "Private connectivity",
    definition: "AWS PrivateLink provides private connectivity to supported services through VPC endpoints.",
    why: "Services can be accessed privately without exposing traffic to the public Internet.",
    how: "Traffic stays on the AWS network. AWS offers different VPC endpoint types depending on the service.",
    analogy: "PrivateLink = a private hallway between services.",
    useCase: "A SaaS provider exposes a private API to customers without public Internet exposure.",
    architecture: ["VPC", "VPC Endpoint", "PrivateLink", "Supported Service"],
    examTip: "Private access to a supported service without public Internet often points to a VPC endpoint or PrivateLink-based endpoint.",
    checks: [{ question: "Does every private S3 connection specifically use PrivateLink?", answer: "No. Endpoint type depends on the service." }],
  },
  {
    id: "direct-connect",
    sectionId: "connectivity",
    name: "AWS Direct Connect",
    category: "Hybrid connectivity",
    definition: "AWS Direct Connect is a dedicated network connection between an on-premises environment and AWS.",
    why: "It provides more consistent network performance for hybrid-cloud workloads and large data transfers.",
    how: "Traffic uses a dedicated path instead of the public Internet. Direct Connect does not automatically encrypt traffic, so VPN can be used with it when encryption is required.",
    analogy: "Direct Connect = a private dedicated highway to AWS.",
    useCase: "An enterprise data center transfers large datasets to AWS with predictable bandwidth.",
    architecture: ["Data Center", "Dedicated Connection", "AWS Direct Connect", "VPC"],
    examTip: "Dedicated high-bandwidth connection = Direct Connect.",
    checks: [{ question: "Is Direct Connect automatically encrypted by itself?", answer: "No." }],
  },
  {
    id: "transit-gateway",
    sectionId: "connectivity",
    name: "AWS Transit Gateway",
    category: "Network hub",
    definition: "AWS Transit Gateway acts as a central hub for connecting multiple VPCs and on-premises networks.",
    why: "It simplifies complex point-to-point network designs in enterprises with many VPCs.",
    how: "VPCs and hybrid connections attach to Transit Gateway, then routing is managed centrally.",
    analogy: "Transit Gateway = a central traffic roundabout.",
    useCase: "A company with development, production, analytics, and shared-services VPCs connects them through one hub.",
    architecture: ["VPC A", "Transit Gateway", "VPC B", "Data Center"],
    examTip: "Many VPCs through one central hub = Transit Gateway.",
    checks: [{ question: "Which service is a central hub for many VPCs?", answer: "AWS Transit Gateway." }],
  },
  {
    id: "nat-gateway",
    sectionId: "connectivity",
    name: "NAT Gateway",
    category: "Outbound connectivity",
    definition: "A NAT Gateway lets private subnet resources initiate outbound IPv4 Internet connections.",
    why: "Private EC2 instances may need to download updates without accepting inbound public Internet connections.",
    how: "A public NAT Gateway sits in a public subnet. The private subnet route table sends outbound traffic to NAT Gateway, which then uses an Internet Gateway.",
    analogy: "NAT Gateway = one-way exit for private resources.",
    useCase: "Private app servers download operating system patches while staying unreachable from public inbound traffic.",
    architecture: ["Private EC2 Instance", "Private Route Table", "NAT Gateway in Public Subnet", "Internet Gateway", "Internet"],
    examTip: "NAT Gateway is not a firewall. Security Groups and Network ACLs still control traffic.",
    checks: [{ question: "Can the public Internet initiate connections directly through NAT Gateway to private EC2?", answer: "No." }],
  },
  {
    id: "api-gateway",
    sectionId: "connectivity",
    name: "Amazon API Gateway",
    category: "Application service",
    definition: "Amazon API Gateway is a managed service for creating, publishing, securing, throttling, and monitoring APIs.",
    why: "Developers need a managed front door for REST, HTTP, and WebSocket APIs.",
    how: "API Gateway can integrate with Lambda and other backends. It is not a traditional network gateway like Internet Gateway or NAT Gateway.",
    analogy: "API Gateway = the managed front door for APIs.",
    useCase: "A React or mobile app calls API Gateway, which invokes Lambda and stores data in DynamoDB.",
    architecture: ["React or Mobile Client", "Amazon API Gateway", "AWS Lambda", "Amazon DynamoDB"],
    examTip: "API backed by Lambda usually points to API Gateway.",
    checks: [{ question: "Is API Gateway a replacement for Internet Gateway?", answer: "No." }],
  },
];

export const packetJourney = [
  {
    label: "Customer",
    detail: "The user sends a request to your public application.",
  },
  {
    label: "Internet Gateway",
    detail: "The VPC has a public Internet path when the public subnet route table points here.",
  },
  {
    label: "Network ACL",
    detail: "The subnet-level stateless checkpoint evaluates inbound packets.",
  },
  {
    label: "Security Group",
    detail: "The resource-level stateful guard checks whether this traffic is allowed.",
  },
  {
    label: "EC2 Instance",
    detail: "The packet reaches the instance only if routing and security rules allow it.",
  },
];

export const serviceComparisons: ServiceComparison[] = [
  {
    id: "sg-nacl",
    title: "Security Group versus Network ACL",
    columns: ["Feature", "Security Group", "Network ACL"],
    rows: [
      ["Scope", "Resource or network-interface level", "Subnet level"],
      ["Stateful", "Yes", "No"],
      ["Allow rules", "Yes", "Yes"],
      ["Explicit deny rules", "No", "Yes"],
      ["Return traffic", "Automatically allowed for established traffic", "Must be allowed separately"],
      ["Common analogy", "Security guard at an individual office", "Security checkpoint at the main entrance"],
    ],
  },
  {
    id: "igw-vgw",
    title: "Internet Gateway versus Virtual Private Gateway",
    columns: ["Internet Gateway", "Virtual Private Gateway"],
    rows: [
      ["Connects a VPC to the public Internet", "Connects a VPN or private network to a VPC"],
      ["Used for public traffic", "Used for encrypted private traffic"],
      ["Commonly used by websites and public applications", "Commonly used by corporate offices and data centers"],
    ],
  },
  {
    id: "client-site-vpn",
    title: "Client VPN versus Site-to-Site VPN",
    columns: ["Client VPN", "Site-to-Site VPN"],
    rows: [
      ["One employee connects to AWS", "The whole office connects to AWS"],
      ["Client-based managed VPN", "Network-to-network VPN"],
      ["Best for remote workers", "Best for branch offices and data centers"],
    ],
  },
  {
    id: "vpn-direct-connect",
    title: "VPN versus Direct Connect",
    columns: ["VPN", "Direct Connect"],
    rows: [
      ["Encrypted tunnel over the public Internet", "Dedicated network path to AWS"],
      ["Fast to set up and commonly lower cost", "More consistent performance for large hybrid workloads"],
      ["Internet-based connectivity", "Does not use the public Internet for the dedicated path"],
    ],
  },
  {
    id: "edge-services",
    title: "Route 53 versus CloudFront versus Global Accelerator",
    columns: ["Feature", "Route 53", "CloudFront", "Global Accelerator"],
    rows: [
      ["Service type", "DNS", "CDN", "Global network traffic accelerator"],
      ["Main purpose", "Resolve names and route traffic", "Cache and deliver content near users", "Improve availability and network performance"],
      ["Caching", "No", "Yes", "No"],
      ["Best for", "Domains and DNS routing", "Images, video, CSS, JavaScript, downloads, APIs", "Gaming, APIs, financial applications, multi-Region apps"],
      ["Failover", "DNS health checks and policies", "Not its primary purpose", "Fast endpoint health-based failover"],
    ],
  },
  {
    id: "nat-igw",
    title: "NAT Gateway versus Internet Gateway",
    columns: ["NAT Gateway", "Internet Gateway"],
    rows: [
      ["Outbound-only Internet exit for private resources", "Public Internet connectivity for a VPC"],
      ["Lives in a public subnet", "Attached to the VPC"],
      ["Not a firewall", "Not a firewall"],
    ],
  },
  {
    id: "public-private-subnet",
    title: "Public Subnet versus Private Subnet",
    columns: ["Public Subnet", "Private Subnet"],
    rows: [
      ["Route table has route to Internet Gateway", "No direct inbound public Internet route"],
      ["Good for load balancers and public web servers", "Good for databases, internal APIs, backend services"],
      ["Resources may need public IPs and security rules", "Can use NAT Gateway for outbound updates"],
    ],
  },
];

export const cheatSheet: CheatSheetItem[] = [
  ["AWS Cloud", "Worldwide AWS infrastructure and services."],
  ["Region", "Geographic AWS location with multiple Availability Zones."],
  ["Availability Zone", "One or more discrete data centers with independent infrastructure."],
  ["VPC", "Logically isolated private network in AWS."],
  ["Subnet", "Smaller network segment inside a VPC."],
  ["Public Subnet", "Subnet with a route to an Internet Gateway."],
  ["Private Subnet", "Subnet without direct inbound public Internet access."],
  ["Internet Gateway", "Gateway that connects a VPC to the public Internet."],
  ["Virtual Private Gateway", "AWS-side gateway for Site-to-Site VPN."],
  ["VPN", "Encrypted tunnel over the Internet."],
  ["Client VPN", "Secure VPN access for individual users."],
  ["Site-to-Site VPN", "Encrypted VPN from an office or data center to AWS."],
  ["Network ACL", "Stateless subnet-level firewall."],
  ["Security Group", "Stateful resource-level firewall."],
  ["NAT Gateway", "Outbound-only IPv4 Internet exit for private subnet resources."],
  ["AWS PrivateLink", "Private service connectivity through VPC endpoints."],
  ["AWS Direct Connect", "Dedicated network connection to AWS."],
  ["AWS Transit Gateway", "Central hub for many VPCs and on-premises networks."],
  ["Amazon API Gateway", "Managed front door for APIs."],
  ["Amazon Route 53", "AWS DNS and traffic routing service."],
  ["Amazon CloudFront", "CDN for delivering content through Edge Locations."],
  ["AWS Global Accelerator", "Global traffic accelerator for performance and availability."],
  ["Edge Location", "AWS site near users for edge services such as CloudFront."],
].map(([term, definition]) => ({ term, definition }));

export const memoryMap: CheatSheetItem[] = [
  ["AWS Cloud", "Whole world"],
  ["Region", "City"],
  ["Availability Zone", "Independent building"],
  ["VPC", "Private office"],
  ["Subnet", "Room or department"],
  ["Public Subnet", "Reception"],
  ["Private Subnet", "Vault"],
  ["Internet Gateway", "Public entrance"],
  ["Virtual Private Gateway", "Secure VPN entrance"],
  ["VPN", "Encrypted tunnel"],
  ["Security Group", "Stateful resource guard"],
  ["Network ACL", "Stateless subnet checkpoint"],
  ["NAT Gateway", "Outbound-only Internet exit"],
  ["PrivateLink", "Private hallway"],
  ["Direct Connect", "Dedicated private highway"],
  ["Transit Gateway", "Central networking hub"],
  ["API Gateway", "Front door for APIs"],
  ["Route 53", "Phone book"],
  ["CloudFront", "Nearby content warehouse"],
  ["Global Accelerator", "AWS express highway"],
].map(([term, definition]) => ({ term, definition }));

const options = (correct: string, wrong: string[]): QuizQuestion["options"] => [
  { id: "a", text: correct },
  { id: "b", text: wrong[0], whyIncorrect: `${wrong[0]} is useful, but it does not match this scenario.` },
  { id: "c", text: wrong[1], whyIncorrect: `${wrong[1]} is a different AWS networking concept.` },
  { id: "d", text: wrong[2], whyIncorrect: `${wrong[2]} solves a different problem.` },
];

export const networkingQuiz: QuizQuestion[] = [
  ["q1", "A company needs an isolated private network in AWS.", "Amazon VPC", "CloudFront", "Route 53", "API Gateway", "Amazon VPC", "isolated private network"],
  ["q2", "A customer-facing web server needs public Internet access.", "Public subnet with a route to an Internet Gateway", "Private subnet only", "Network ACL only", "Transit Gateway", "Public subnet", "public Internet access"],
  ["q3", "A production database must not be directly exposed to the Internet.", "Private subnet", "Public subnet", "Internet Gateway", "Global Accelerator", "Private subnet", "database not exposed"],
  ["q4", "A VPC must communicate with the public Internet.", "Internet Gateway", "Virtual Private Gateway", "Client VPN", "PrivateLink", "Internet Gateway", "public Internet"],
  ["q5", "A company requires a subnet-level stateless firewall.", "Network ACL", "Security Group", "NAT Gateway", "Route 53", "Network ACL", "subnet-level stateless"],
  ["q6", "A company requires a stateful resource-level firewall.", "Security Group", "Network ACL", "Internet Gateway", "Direct Connect", "Security Group", "stateful resource-level"],
  ["q7", "Remote employees need secure individual access to AWS.", "AWS Client VPN", "AWS Site-to-Site VPN", "Direct Connect", "Transit Gateway", "AWS Client VPN", "individual remote employees"],
  ["q8", "An entire corporate office needs encrypted connectivity to AWS.", "AWS Site-to-Site VPN", "AWS Client VPN", "CloudFront", "Route 53", "AWS Site-to-Site VPN", "entire office encrypted"],
  ["q9", "A company needs a dedicated high-bandwidth connection to AWS.", "AWS Direct Connect", "AWS Site-to-Site VPN", "Internet Gateway", "NAT Gateway", "AWS Direct Connect", "dedicated high-bandwidth"],
  ["q10", "A private EC2 instance must download updates without accepting inbound Internet connections.", "NAT Gateway", "Internet Gateway only", "Route 53", "CloudFront", "NAT Gateway", "private outbound updates"],
  ["q11", "A company needs private access to a supported AWS service without traversing the public Internet.", "A suitable VPC endpoint or AWS PrivateLink-based endpoint", "Internet Gateway", "Global Accelerator", "Route 53", "AWS PrivateLink", "private access supported service"],
  ["q12", "A company needs to connect many VPCs through one central hub.", "AWS Transit Gateway", "NAT Gateway", "CloudFront", "API Gateway", "AWS Transit Gateway", "central hub many VPCs"],
  ["q13", "A developer needs to create and secure an API backed by Lambda.", "Amazon API Gateway", "Internet Gateway", "Virtual Private Gateway", "Direct Connect", "Amazon API Gateway", "API backed by Lambda"],
  ["q14", "A company wants global DNS resolution and traffic routing.", "Amazon Route 53", "CloudFront", "NAT Gateway", "Security Group", "Amazon Route 53", "DNS resolution"],
  ["q15", "A company wants to cache images, CSS, JavaScript, and videos near global users.", "Amazon CloudFront", "Route 53", "Global Accelerator", "Direct Connect", "Amazon CloudFront", "cache near users"],
  ["q16", "A gaming application needs low-latency dynamic traffic and rapid health-based failover.", "AWS Global Accelerator", "CloudFront", "NAT Gateway", "Client VPN", "AWS Global Accelerator", "dynamic traffic failover"],
  ["q17", "Which service is the AWS-side gate where a Site-to-Site VPN tunnel ends?", "Virtual Private Gateway", "Internet Gateway", "API Gateway", "NAT Gateway", "Virtual Private Gateway", "AWS-side VPN gate"],
  ["q18", "Which service is not a traditional network gateway and is used for REST, HTTP, and WebSocket APIs?", "Amazon API Gateway", "Internet Gateway", "NAT Gateway", "Virtual Private Gateway", "Amazon API Gateway", "REST HTTP WebSocket"],
  ["q19", "Which service uses Edge Locations and can return cached content on a cache hit?", "Amazon CloudFront", "Amazon VPC", "AWS Direct Connect", "AWS Client VPN", "Amazon CloudFront", "Edge Locations cache"],
  ["q20", "Which firewall supports explicit deny rules?", "Network ACL", "Security Group", "Route 53", "CloudFront", "Network ACL", "explicit deny"],
  ["q21", "Which firewall uses allow rules only and implicitly denies unmatched traffic?", "Security Group", "Network ACL", "Transit Gateway", "Direct Connect", "Security Group", "allow rules only"],
  ["q22", "Which service is best described as a local phone book for domain names?", "Amazon Route 53", "CloudFront", "Global Accelerator", "PrivateLink", "Amazon Route 53", "phone book"],
  ["q23", "Which service is a private dedicated highway to AWS but does not automatically encrypt traffic by itself?", "AWS Direct Connect", "AWS Site-to-Site VPN", "Client VPN", "Route 53", "AWS Direct Connect", "dedicated path not automatically encrypted"],
  ["q24", "Which component commonly sits in a public subnet and allows private resources to initiate outbound IPv4 Internet access?", "NAT Gateway", "Private database", "Virtual Private Gateway", "Network ACL", "NAT Gateway", "outbound-only private resources"],
  ["q25", "Which AWS concept is one or more discrete data centers with independent power, networking, and cooling?", "Availability Zone", "Region", "VPC", "Edge Location", "Availability Zone", "independent data centers"],
].map(([id, question, correct, wrong1, wrong2, wrong3, relatedService, examKeyword]) => ({
  id,
  question,
  options: options(correct, [wrong1, wrong2, wrong3]),
  correctOptionId: "a",
  explanation: `${correct} is the best Cloud Practitioner answer because the keyword is "${examKeyword}".`,
  relatedService,
  examKeyword,
}));
