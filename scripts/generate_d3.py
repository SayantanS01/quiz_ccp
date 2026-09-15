#!/usr/bin/env python3
"""
Domain 3 Generator: Exactly 221 Questions on Cloud Technology & Services (CP-352 to CP-572).
Covers:
- AWS Global Infrastructure: Regions, AZs, Edge Locations, Local Zones, Wavelength, Outposts
- Compute: EC2 instance families, purchasing models (On-Demand, Spot, Reserved, Savings Plans, Dedicated)
- Containers & Serverless: ECS, EKS, ECR, Fargate, Lambda
- Auto Scaling & Elastic Load Balancing: ALB, NLB, GLB, Scaling policies, Launch Templates
- Networking: VPC, Subnets, Route Tables, IGW, NAT Gateway, Security Groups, NACLs, Peering, Transit Gateway, Direct Connect, VPN, Route 53, CloudFront
- Storage: S3 classes, Lifecycle, Versioning, Object Lock, EBS types, Instance Store, EFS, FSx
- Databases: RDS, Aurora, DynamoDB, ElastiCache, Redshift, DocumentDB, Neptune, QLDB, DMS
- Management, Monitoring & Automation: CloudWatch, CloudTrail, Config, Systems Manager, CloudFormation, Elastic Beanstalk, X-Ray
- Application Integration: SQS, SNS, EventBridge, Step Functions, SES, MQ
"""

import json

def get_d3_questions():
    questions = []

    def q(num, text, q_type, req, options, explanation, topic, diff, tags, mod):
        code = f"CP-{num:03d}"
        questions.append({
            "id": f"cp-d3-{num}",
            "questionCode": code,
            "questionText": text,
            "type": q_type,
            "requiredSelections": req,
            "options": [{"label": o[0], "text": o[1], "isCorrect": o[2]} for o in options],
            "explanation": explanation,
            "domain": "Cloud Technology and Services",
            "domainId": 3,
            "topic": topic,
            "difficulty": diff,
            "tags": tags,
            "sourceModule": mod,
            "status": "APPROVED"
        })

    # -------------------------------------------------------------
    # 1. Global Infrastructure (CP-352 to CP-375) - 24 questions
    # -------------------------------------------------------------
    q(352, "What is an AWS Region?", "SINGLE_SELECT", 1, [
        ["A", "A single physical data center located in a major metropolitan city", False],
        ["B", "A physical geographical location in the world with multiple isolated Availability Zones connected by low-latency networks", True],
        ["C", "A virtual private network endpoint used exclusively for edge content caching", False],
        ["D", "A collection of edge servers distributed within a single country", False]
    ], "An AWS Region is a physical geographical location around the world where AWS clusters data centers. Each Region consists of multiple (at least 3 in modern regions), isolated, and physically separated Availability Zones connected via low-latency, redundant fiber networks.", "Global Infrastructure", "EASY", ["Region", "Global Infrastructure"], "Module 3")

    q(353, "Which statement best describes an AWS Availability Zone (AZ)?", "SINGLE_SELECT", 1, [
        ["A", "A collection of edge locations within a continent used to deliver DNS records", False],
        ["B", "One or more discrete physical data centers with redundant power, networking, and connectivity within an AWS Region", True],
        ["C", "A logical grouping of AWS accounts for consolidated organization billing", False],
        ["D", "A geographic boundary defining national data sovereignty compliance", False]
    ], "An Availability Zone (AZ) consists of one or more discrete physical data centers, each with independent, redundant power, cooling, and physical security, housed in separate facilities within an AWS Region.", "Global Infrastructure", "EASY", ["Availability Zone", "Global Infrastructure"], "Module 3")

    q(354, "A company requires single-digit millisecond latency for mobile edge computing applications connected via 5G networks. Which AWS service or deployment model is designed for this?", "SINGLE_SELECT", 1, [
        ["A", "AWS Wavelength", True],
        ["B", "AWS Snowcone", False],
        ["C", "AWS Direct Connect", False],
        ["D", "Amazon Route 53", False]
    ], "AWS Wavelength brings AWS compute and storage services to the edge of telecommunications carriers' 5G networks, enabling developers to build applications that deliver ultra-low latency to mobile devices and end users.", "Global Infrastructure", "HARD", ["Wavelength", "5G", "Low Latency"], "Module 3")

    q(355, "Which AWS infrastructure offering allows customers to run AWS compute, storage, and database services natively on-premises in their own corporate data centers?", "SINGLE_SELECT", 1, [
        ["A", "AWS Local Zones", False],
        ["B", "AWS Outposts", True],
        ["C", "Amazon CloudFront", False],
        ["D", "AWS Direct Connect", False]
    ], "AWS Outposts brings native AWS services, infrastructure, and operating models to virtually any data center, co-location space, or on-premises facility for a truly consistent hybrid experience.", "Global Infrastructure", "MEDIUM", ["Outposts", "Hybrid"], "Module 3")

    q(356, "What is an AWS Local Zone?", "SINGLE_SELECT", 1, [
        ["A", "A specialized AWS Region located exclusively outside North America", False],
        ["B", "An extension of an AWS Region that places compute, storage, and database services closer to large populations and industry centers", True],
        ["C", "A local software cache deployed on an on-premises physical server", False],
        ["D", "An isolated corporate subnet configured without an Internet Gateway", False]
    ], "AWS Local Zones place compute, storage, database, and other select AWS services closer to end-users in large population, industry, and IT centers where no AWS Region currently exists, achieving single-digit millisecond latency.", "Global Infrastructure", "MEDIUM", ["Local Zones", "Low Latency"], "Module 3")

    q(357, "Which factors should guide the selection of an AWS Region for deploying workloads? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Proximity to end users to minimize network latency", True],
        ["B", "Legal and regulatory compliance requirements regarding data residency", True],
        ["C", "Ensuring that the root account password never expires", False],
        ["D", "Guaranteeing that EC2 Spot instances will never be interrupted", False],
        ["E", "The exact number of IAM users registered in the account", False]
    ], "Key factors when choosing an AWS Region include: 1) Proximity to end users (reducing latency), 2) Compliance and data residency laws (legal requirements), 3) Service availability (some services roll out in specific regions first), and 4) Cost variation across regions.", "Global Infrastructure", "MEDIUM", ["Region Selection", "Compliance", "Latency"], "Module 3")

    q(358, "What component of AWS Global Infrastructure delivers content with lower latency by caching copies of data closer to global users?", "SINGLE_SELECT", 1, [
        ["A", "Edge Locations (Point of Presence)", True],
        ["B", "AWS Transit Gateways", False],
        ["C", "Virtual Private Gateways", False],
        ["D", "Customer Gateways", False]
    ], "Edge Locations (Points of Presence) are global data centers maintained by AWS and utilized by services like Amazon CloudFront and Route 53 to cache and distribute content closer to end-users worldwide with minimal latency.", "Global Infrastructure", "EASY", ["Edge Location", "CloudFront"], "Module 3")

    q(359, "How are Availability Zones within the same AWS Region interconnected?", "SINGLE_SELECT", 1, [
        ["A", "Via the public Internet through IPSec VPN tunnels", False],
        ["B", "Via high-speed, high-bandwidth, fully redundant, low-latency dedicated optical networking", True],
        ["C", "Via satellite links with 1-second transit delays", False],
        ["D", "Through on-premises customer switching hubs", False]
    ], "All Availability Zones in an AWS Region are interconnected with high-bandwidth, low-latency networking over fully redundant, dedicated metro-fiber loops, enabling synchronous replication and fault-tolerant architectures.", "Global Infrastructure", "MEDIUM", ["Availability Zone", "Networking"], "Module 3")

    q(360, "Which AWS services operate globally without requiring you to select a specific geographic Region in the AWS Management Console? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Amazon EC2", False],
        ["B", "AWS IAM (Identity and Access Management)", True],
        ["C", "Amazon CloudFront", True],
        ["D", "Amazon EBS", False],
        ["E", "Amazon RDS", False]
    ], "AWS IAM, Amazon CloudFront, Amazon Route 53, and AWS WAF (global) are global services whose administrative consoles and core endpoints do not require regional scoping, whereas EC2, EBS, and RDS are strictly regional.", "Global Infrastructure", "MEDIUM", ["Global Services", "IAM", "CloudFront"], "Module 3")

    q(361, "What is the primary advantage of deploying an application across multiple Availability Zones in a single Region?", "SINGLE_SELECT", 1, [
        ["A", "Eliminating all data transfer costs completely", False],
        ["B", "High availability and fault tolerance against localized physical data center failures", True],
        ["C", "Automatic zero-downtime database schema migrations", False],
        ["D", "Decreasing software licensing fees by 50%", False]
    ], "Deploying across multiple AZs ensures that if a localized issue (power outage, flooding, hardware failure) strikes one data center/AZ, workloads seamlessly continue running in the remaining operational AZs without catastrophic outage.", "Global Infrastructure", "EASY", ["Multi-AZ", "High Availability"], "Module 3")

    q(362, "What is the minimum number of Availability Zones present in any standard modern AWS Region?", "SINGLE_SELECT", 1, [
        ["A", "1", False],
        ["B", "2", False],
        ["C", "3", True],
        ["D", "5", False]
    ], "Every standard modern AWS Region consists of a minimum of three isolated and physically separated Availability Zones (some historical older regions launched with two, but the standard architecture requires at least three).", "Global Infrastructure", "MEDIUM", ["AZ Count", "Architecture"], "Module 3")

    q(363, "Which statement regarding data replication between AWS Regions is accurate?", "SINGLE_SELECT", 1, [
        ["A", "AWS automatically replicates all customer data across every global region by default", False],
        ["B", "No customer data is replicated outside a chosen Region unless explicitly configured by the customer", True],
        ["C", "AWS stores encrypted backups in an undisclosed global region without user consent", False],
        ["D", "Replication between regions is forbidden by AWS security policy", False]
    ], "AWS will never replicate or move customer data outside of the customer's explicitly chosen Region without the customer's explicit command or configuration (e.g., S3 Cross-Region Replication). Customer data residency is strictly respected.", "Global Infrastructure", "MEDIUM", ["Data Sovereignty", "Replication"], "Module 3")

    q(364, "What is a Regional Edge Cache in Amazon CloudFront?", "SINGLE_SELECT", 1, [
        ["A", "An on-premises storage appliance shipped to branch offices", False],
        ["B", "A caching tier located between CloudFront Edge Locations and the origin server for less-frequently accessed content", True],
        ["C", "A local tape drive library for archival compliance", False],
        ["D", "A cold storage Glacier vault embedded within an EC2 subnet", False]
    ], "Regional Edge Caches are CloudFront points located between your origin server and Edge Locations. They have larger cache capacities to retain content longer, preventing edge locations from needing to query the origin server as often.", "Global Infrastructure", "HARD", ["CloudFront", "Regional Edge Cache"], "Module 3")

    q(365, "Which AWS infrastructure resource is physically closest to the end user for accelerating DNS queries and static web assets?", "SINGLE_SELECT", 1, [
        ["A", "Availability Zone", False],
        ["B", "Edge Location", True],
        ["C", "Outpost", False],
        ["D", "Primary Region", False]
    ], "Edge Locations are distributed across hundreds of major population centers worldwide to bring DNS resolution (Route 53) and cached content (CloudFront) as physically close to end users as possible.", "Global Infrastructure", "EASY", ["Edge Location", "DNS"], "Module 3")

    q(366, "What technology enables AWS Regions to be isolated while sharing a private global backbone?", "SINGLE_SELECT", 1, [
        ["A", "The AWS global network backbone, constructed with private fiber links independent of the public Internet", True],
        ["B", "Public Tor relays", False],
        ["C", "Commercial satellite broadcast networks", False],
        ["D", "Municipal copper telephone wiring", False]
    ], "AWS owns and operates a purpose-built, highly available, redundant private fiber global network backbone that carries inter-region and edge-to-region traffic without traversing the public Internet.", "Global Infrastructure", "MEDIUM", ["AWS Backbone", "Global Network"], "Module 3")

    q(367, "When designing a disaster recovery architecture with an RPO of hours, which deployment model provides geographical separation across thousands of miles?", "SINGLE_SELECT", 1, [
        ["A", "Multi-AZ within us-east-1", False],
        ["B", "Multi-Region (e.g., us-east-1 and us-west-2)", True],
        ["C", "Single AZ with RAID-1 EBS volumes", False],
        ["D", "Single instance store with local snapshots", False]
    ], "Multi-Region deployments provide geographic resilience against regional disasters (such as massive natural disasters or geopolitical events affecting an entire state or country).", "Global Infrastructure", "MEDIUM", ["Multi-Region", "Disaster Recovery"], "Module 3")

    q(368, "Why does AWS assign letters (e.g., us-east-1a, us-east-1b) independently across different customer accounts?", "SINGLE_SELECT", 1, [
        ["A", "To prevent all customers from launching resources into the exact same physical data center and exhausting physical capacity", True],
        ["B", "Because the letters represent different pricing tiers", False],
        ["C", "To enforce different levels of IAM encryption per account", False],
        ["D", "To restrict certain accounts from using high-performance instances", False]
    ], "To distribute resources evenly across the physical data centers in a Region, AWS independently maps AZ letter identifiers (us-east-1a) to physical AZ IDs (e.g., use1-az1) for each customer account.", "Global Infrastructure", "HARD", ["AZ Mapping", "AZ ID"], "Module 3")

    q(369, "If an enterprise needs to comply with strict national data residency laws requiring healthcare records to remain inside Germany, what should they do?", "SINGLE_SELECT", 1, [
        ["A", "Deploy workloads solely in the Europe (Frankfurt) AWS Region (eu-central-1)", True],
        ["B", "Encrypt data in us-east-1 and save keys in a German bank", False],
        ["C", "Use any Region because AWS automatically routes data based on the passport of the account owner", False],
        ["D", "Deploy only in AWS GovCloud (US)", False]
    ], "Choosing the specific AWS Region located in the required jurisdiction (e.g., eu-central-1 in Frankfurt, Germany) ensures data remains physically resident in that country to satisfy regulatory and legal requirements.", "Global Infrastructure", "EASY", ["Data Sovereignty", "Germany", "Compliance"], "Module 3")

    q(370, "What capability allows an administrator to identify the true physical data center mapping across multiple AWS accounts in an organization?", "SINGLE_SELECT", 1, [
        ["A", "AZ ID (e.g., use1-az1)", True],
        ["B", "VPC Subnet CIDR", False],
        ["C", "AMI ID", False],
        ["D", "IAM Role ARN", False]
    ], "AZ IDs (e.g., use1-az1) are consistent physical identifiers across all accounts, allowing administrators to coordinate shared resources and balance workloads across identical physical infrastructure across accounts.", "Global Infrastructure", "HARD", ["AZ ID", "Multi-Account"], "Module 3")

    q(371, "Which statement is TRUE regarding fault isolation between AWS Regions?", "SINGLE_SELECT", 1, [
        ["A", "AWS Regions are completely autonomous and isolated from each other to prevent cascade failures", True],
        ["B", "An outage in one Region will immediately shut down all compute resources in adjacent Regions", False],
        ["C", "Regions share the same physical power grid and local telecommunications providers", False],
        ["D", "AWS Regions cannot communicate with each other under any circumstances", False]
    ], "AWS Regions are intentionally engineered to be autonomous and completely isolated from other Regions to maximize fault tolerance and ensure localized failures cannot cascade globally.", "Global Infrastructure", "MEDIUM", ["Fault Isolation", "Autonomous"], "Module 3")

    q(372, "What is the primary function of AWS Points of Presence (PoPs)?", "SINGLE_SELECT", 1, [
        ["A", "Hosting primary relational database write replicas", False],
        ["B", "Delivering cached data and accelerating traffic to applications via CloudFront and Route 53", True],
        ["C", "Replacing on-premises SAN arrays", False],
        ["D", "Providing physical desks for AWS engineers", False]
    ], "Points of Presence (PoPs) consist of Edge Locations and Regional Edge Caches designed to cache content, terminate TLS connections closer to clients, and speed up global delivery.", "Global Infrastructure", "EASY", ["PoP", "Points of Presence"], "Module 3")

    q(373, "An online gaming company wants to reduce latency for real-time mobile gameplay in major cities. Which AWS service embeds compute within mobile telco 5G networks?", "SINGLE_SELECT", 1, [
        ["A", "AWS Wavelength", True],
        ["B", "Amazon S3 Glacier", False],
        ["C", "AWS Glue", False],
        ["D", "AWS Step Functions", False]
    ], "AWS Wavelength provides compute and storage within 5G telecommunication networks, offering single-digit millisecond latency for mobile edge applications like interactive streaming and cloud gaming.", "Global Infrastructure", "MEDIUM", ["Wavelength", "Gaming", "5G"], "Module 3")

    q(374, "Which statement is true regarding AWS Global Infrastructure availability zones?", "SINGLE_SELECT", 1, [
        ["A", "An AZ is always a single server rack in a shared colocation facility", False],
        ["B", "AZs in a Region are located within meaningful geographic distance to protect against localized disasters, while maintaining low-latency connectivity", True],
        ["C", "All AZs globally are situated within 5 miles of Seattle, Washington", False],
        ["D", "An AZ cannot contain more than 10 virtual machines simultaneously", False]
    ], "AZs are separated by meaningful physical distance (often miles apart) to prevent concurrent disruptions from local floods, fires, or power failures, yet close enough for low-latency (<2 ms) synchronous replication.", "Global Infrastructure", "MEDIUM", ["AZ Distance", "Resilience"], "Module 3")

    q(375, "Which AWS service utilizes AWS Edge Locations to protect web applications against Distributed Denial of Service (DDoS) attacks?", "SINGLE_SELECT", 1, [
        ["A", "AWS Shield", True],
        ["B", "AWS Cloud9", False],
        ["C", "AWS DataSync", False],
        ["D", "Amazon Inspector", False]
    ], "AWS Shield and AWS WAF inspect and mitigate DDoS attacks globally at edge locations before malicious traffic ever reaches your backend servers or applications in your VPC.", "Global Infrastructure", "MEDIUM", ["AWS Shield", "DDoS", "Edge"], "Module 3")

    # -------------------------------------------------------------
    # 2. Compute: EC2, Families, Pricing Models (CP-376 to CP-405) - 30 questions
    # -------------------------------------------------------------
    q(376, "What is Amazon EC2 (Elastic Compute Cloud)?", "SINGLE_SELECT", 1, [
        ["A", "A web service that provides secure, resizable compute capacity (virtual servers) in the cloud", True],
        ["B", "A managed relational database engine supporting MySQL and PostgreSQL", False],
        ["C", "A serverless object storage solution for hosting audio files", False],
        ["D", "A hardware firewall appliance shipped to corporate branch offices", False]
    ], "Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the AWS Cloud, allowing users to launch virtual servers (instances), manage networking and storage, and scale up or down dynamically.", "Compute Services", "EASY", ["EC2", "Compute"], "Module 4")

    q(377, "Which EC2 instance type family is best suited for workloads requiring high memory capacity such as in-memory databases and large enterprise caches?", "SINGLE_SELECT", 1, [
        ["A", "Compute Optimized (C family)", False],
        ["B", "Memory Optimized (R and X families)", True],
        ["C", "Storage Optimized (I and D families)", False],
        ["D", "Accelerated Computing (P and G families)", False]
    ], "Memory Optimized instances (such as R6g, R5, X2gd) are engineered to deliver fast performance for workloads that process large data sets in memory, such as Redis caches and in-memory databases.", "Compute Services", "EASY", ["EC2 Families", "Memory Optimized"], "Module 4")

    q(378, "Which EC2 instance family is designed for compute-intensive workloads such as batch processing, media transcoding, and high-performance web servers?", "SINGLE_SELECT", 1, [
        ["A", "Compute Optimized (C family)", True],
        ["B", "General Purpose (M and T families)", False],
        ["C", "Storage Optimized (H and I families)", False],
        ["D", "Memory Optimized (R family)", False]
    ], "Compute Optimized instances (C family, e.g., C6g, C5) feature high-performance processors and provide cost-effective compute performance for compute-bound applications.", "Compute Services", "EASY", ["EC2 Families", "Compute Optimized"], "Module 4")

    q(379, "Which EC2 instance family uses hardware accelerators or GPUs to perform graphics rendering, machine learning inference, and financial modeling?", "SINGLE_SELECT", 1, [
        ["A", "Accelerated Computing (P and G families)", True],
        ["B", "General Purpose (T4g family)", False],
        ["C", "Compute Optimized (C6i family)", False],
        ["D", "Storage Optimized (Im4gn family)", False]
    ], "Accelerated Computing instances (e.g., P4, G5) utilize graphics processing units (GPUs) or dedicated hardware accelerators to accelerate machine learning, scientific computing, and graphic-intensive tasks.", "Compute Services", "MEDIUM", ["Accelerated Computing", "GPU"], "Module 4")

    q(380, "Which EC2 purchasing option provides the greatest cost discount (up to 90%) in exchange for instances that can be reclaimed by AWS with a 2-minute warning?", "SINGLE_SELECT", 1, [
        ["A", "On-Demand Instances", False],
        ["B", "Spot Instances", True],
        ["C", "Reserved Instances", False],
        ["D", "Dedicated Hosts", False]
    ], "EC2 Spot Instances let you take advantage of unused EC2 capacity in the AWS cloud at steep discounts (up to 90% compared to On-Demand prices), but they can be interrupted when AWS needs the capacity back.", "Compute Services", "EASY", ["Spot Instances", "Pricing"], "Module 4")

    q(381, "A company has unpredictable, short-term workloads that cannot be interrupted and must run without upfront commitments or long-term contracts. Which pricing option is best?", "SINGLE_SELECT", 1, [
        ["A", "Spot Instances", False],
        ["B", "On-Demand Instances", True],
        ["C", "3-Year Standard Reserved Instances", False],
        ["D", "EC2 Savings Plans", False]
    ], "On-Demand Instances let you pay for compute capacity by the second or hour without long-term commitments or upfront fees, making them ideal for short-term, irregular, or unpredictable workloads that cannot be interrupted.", "Compute Services", "MEDIUM", ["On-Demand", "Pricing"], "Module 4")

    q(382, "A company has a steady-state web backend running continuously 24/7 with predictable baseline compute usage for the next 3 years. Which options provide cost savings? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "EC2 Savings Plans", True],
        ["B", "Reserved Instances (RIs)", True],
        ["C", "Spot Instances", False],
        ["D", "On-Demand Instances", False],
        ["E", "Dedicated Hosts without commitment", False]
    ], "Both Savings Plans and Reserved Instances (1-year or 3-year commitments) offer significant discounts (up to 72%) for steady-state, predictable baseline workloads in exchange for committing to a consistent usage amount.", "Compute Services", "MEDIUM", ["Savings Plans", "Reserved Instances"], "Module 4")

    q(383, "What is a major advantage of EC2 Compute Savings Plans over Standard Reserved Instances?", "SINGLE_SELECT", 1, [
        ["A", "Savings Plans apply automatically across instance families, operating systems, regions, and even to AWS Fargate and Lambda", True],
        ["B", "Savings Plans are completely free of charge and require zero payment commitment", False],
        ["C", "Savings Plans guarantee that hardware components will never fail", False],
        ["D", "Savings Plans allow unlimited instances to be launched without service limits", False]
    ], "Compute Savings Plans provide high flexibility: they offer up to 66% discount and automatically apply to EC2 instance usage regardless of instance family, size, OS, tenancy, or Region, as well as AWS Fargate and AWS Lambda.", "Compute Services", "MEDIUM", ["Savings Plans", "Flexibility"], "Module 4")

    q(384, "An enterprise has strict regulatory licensing terms that require software to run on physical, dedicated server hardware where socket and core counts are visible. Which option satisfies this?", "SINGLE_SELECT", 1, [
        ["A", "EC2 Dedicated Hosts", True],
        ["B", "EC2 Spot Instances", False],
        ["C", "Multi-Tenant On-Demand Instances", False],
        ["D", "Amazon LightSail", False]
    ], "EC2 Dedicated Hosts provide a physical server dedicated entirely to your use, giving visibility and control over instance placement at the host level, which helps satisfy Bring-Your-Own-License (BYOL) compliance requirements.", "Compute Services", "MEDIUM", ["Dedicated Hosts", "Licensing"], "Module 4")

    q(385, "What is the difference between EC2 Dedicated Instances and EC2 Dedicated Hosts?", "SINGLE_SELECT", 1, [
        ["A", "Dedicated Hosts provide physical server visibility (sockets/cores) and host-level licensing control; Dedicated Instances run on single-tenant hardware without host control", True],
        ["B", "Dedicated Instances are free while Dedicated Hosts are paid", False],
        ["C", "Dedicated Instances are only deployed in local zones", False],
        ["D", "There is no difference between them", False]
    ], "Dedicated Instances run on hardware dedicated to a single customer account at the instance level. Dedicated Hosts also provide dedicated hardware but add physical server visibility, host socket/core control, and BYOL license support.", "Compute Services", "HARD", ["Dedicated Instances", "Dedicated Hosts"], "Module 4")

    q(386, "What is an Amazon Machine Image (AMI)?", "SINGLE_SELECT", 1, [
        ["A", "A template that contains the software configuration (operating system, application server, and applications) required to launch an EC2 instance", True],
        ["B", "A photo album service for storing high-resolution JPEG files", False],
        ["C", "A real-time screenshot capture tool for auditing server desktops", False],
        ["D", "A hardware accelerator card plugged into an on-premises workstation", False]
    ], "An AMI is a master image template providing the information required to launch an EC2 instance, including the operating system, pre-installed software packages, configurations, and storage volume mappings.", "Compute Services", "EASY", ["AMI", "EC2 Template"], "Module 4")

    q(387, "Which sources can you use to obtain an Amazon Machine Image (AMI)? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "AWS Marketplace (commercial and open-source AMIs packaged by third parties)", True],
        ["B", "Custom AMIs created from existing configured EC2 instances", True],
        ["C", "Direct download links from unverified public peer-to-peer torrents", False],
        ["D", "Importing physical hard drives via postal courier without validation", False],
        ["E", "Extracting images from AWS IAM policies", False]
    ], "AMIs can be AWS-provided (quickstart), customized by creating an image from your own configured EC2 instance, purchased/subscribed to via the AWS Marketplace, or shared by other AWS accounts.", "Compute Services", "MEDIUM", ["AMI Sources", "Marketplace"], "Module 4")

    q(388, "What happens when an Amazon EC2 instance backed by an EBS root volume is stopped?", "SINGLE_SELECT", 1, [
        ["A", "The instance shuts down, compute charges stop, and data on the EBS root volume persists", True],
        ["B", "The instance and all attached EBS volumes are permanently deleted", False],
        ["C", "The instance continues incurring full compute hourly rates", False],
        ["D", "The instance is automatically migrated to another AWS Region", False]
    ], "When an EBS-backed instance is stopped, compute (CPU/RAM) billing ceases immediately. Data on the attached EBS root volume remains intact, and standard EBS volume storage fees continue to apply.", "Compute Services", "MEDIUM", ["EC2 Stop", "EBS Persistence"], "Module 4")

    q(389, "What happens to data stored on an EC2 Instance Store volume when the EC2 instance is stopped or terminated?", "SINGLE_SELECT", 1, [
        ["A", "The data is permanently lost because instance store is ephemeral temporary storage", True],
        ["B", "The data is automatically archived to S3 Glacier Deep Archive", False],
        ["C", "The data is moved to an EBS volume without charge", False],
        ["D", "The data remains accessible upon restart", False]
    ], "Instance Store volumes provide temporary, ephemeral block storage directly attached to the host server. When the instance is stopped, hibernated, or terminated, all data on the instance store volume is permanently lost.", "Compute Services", "MEDIUM", ["Instance Store", "Ephemeral"], "Module 4")

    q(390, "Which feature allows an EC2 instance to preserve its in-memory (RAM) state across stopping and starting, speeding up application boot time?", "SINGLE_SELECT", 1, [
        ["A", "EC2 Hibernation", True],
        ["B", "EC2 Reboot", False],
        ["C", "Auto Scaling cooldown", False],
        ["D", "Elastic IP reassignment", False]
    ], "EC2 Hibernation saves the contents from the instance memory (RAM) to your Amazon EBS root volume before stopping. Upon starting, the RAM contents are reloaded, allowing the instance to resume where it left off.", "Compute Services", "MEDIUM", ["Hibernation", "EC2 RAM"], "Module 4")

    q(391, "Which EC2 pricing model is the most economical for fault-tolerant background data processing tasks that can be stopped and resumed at any time?", "SINGLE_SELECT", 1, [
        ["A", "Spot Instances", True],
        ["B", "Dedicated Hosts", False],
        ["C", "On-Demand Instances", False],
        ["D", "Multi-Region Reserved Instances", False]
    ], "Spot Instances provide up to 90% savings over On-Demand rates, making them the most cost-effective option for stateless, flexible, or interruptible workloads like big data batch jobs and containerized rendering.", "Compute Services", "EASY", ["Spot", "Cost Savings"], "Module 4")

    q(392, "What is the purpose of EC2 User Data?", "SINGLE_SELECT", 1, [
        ["A", "To execute bootstrap configuration scripts automatically during the initial launch of the instance", True],
        ["B", "To store customer billing credit card information securely", False],
        ["C", "To record the username and password of the system administrator", False],
        ["D", "To track user web browsing history across sessions", False]
    ], "EC2 User Data allows you to pass shell scripts or cloud-init directives to an EC2 instance at launch time to automate configuration tasks, package installations, and updates during boot.", "Compute Services", "MEDIUM", ["User Data", "Bootstrapping"], "Module 4")

    q(393, "Which AWS service is designed for users who want to deploy a simple website or application with a bundled monthly pricing plan that includes compute, storage, and networking?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Lightsail", True],
        ["B", "AWS Outposts", False],
        ["C", "Amazon EKS", False],
        ["D", "AWS Step Functions", False]
    ], "Amazon Lightsail is an easy-to-use cloud platform that provides virtual private servers, storage, databases, and networking at a low, predictable monthly price, ideal for simple websites and beginner projects.", "Compute Services", "EASY", ["Lightsail", "Simple Compute"], "Module 4")

    q(394, "What is an Elastic IP address in Amazon EC2?", "SINGLE_SELECT", 1, [
        ["A", "A static, public IPv4 address allocated to your account that can be rapidly remapped between instances in the same Region", True],
        ["B", "A dynamic private IP address assigned by your home ISP", False],
        ["C", "A free domain name registered through Route 53", False],
        ["D", "An IPv6 address reserved exclusively for database clusters", False]
    ], "An Elastic IP address is a reserved static public IPv4 address designed for dynamic cloud computing. You can mask instance failures by rapidly remapping the address to another replacement instance in your VPC.", "Compute Services", "MEDIUM", ["Elastic IP", "Networking"], "Module 4")

    q(395, "When an EC2 instance with a default public IP is stopped and started again, what happens to its public IPv4 address?", "SINGLE_SELECT", 1, [
        ["A", "The old public IP is released, and a new public IP is assigned from the AWS pool", True],
        ["B", "The instance retains the exact same public IP permanently without charge", False],
        ["C", "The instance is automatically converted into an Elastic IP", False],
        ["D", "Public IP addresses cannot be changed once assigned", False]
    ], "By default, an auto-assigned public IPv4 address is released when an EC2 instance is stopped or terminated. A new public IP is assigned when the instance starts again. To keep a persistent IP, an Elastic IP must be used.", "Compute Services", "MEDIUM", ["Public IP", "Lifecycle"], "Module 4")

    q(396, "Which tool provides visual recommendations for selecting the optimal EC2 instance types and sizes based on historical machine learning utilization data?", "SINGLE_SELECT", 1, [
        ["A", "AWS Compute Optimizer", True],
        ["B", "AWS X-Ray", False],
        ["C", "AWS Secrets Manager", False],
        ["D", "AWS Shield", False]
    ], "AWS Compute Optimizer uses machine learning to analyze historical resource utilization metrics (from CloudWatch) and recommends optimal AWS resources (EC2 instance types, EBS volumes, Lambda memory) to reduce costs and improve performance.", "Compute Services", "MEDIUM", ["Compute Optimizer", "Right-Sizing"], "Module 4")

    q(397, "How does AWS calculate billing for EC2 instances running Linux distributions?", "SINGLE_SELECT", 1, [
        ["A", "Per-second billing with a 60-second minimum", True],
        ["B", "Per-day billing rounded up to the nearest week", False],
        ["C", "Flat annual fee regardless of usage", False],
        ["D", "Per-megabyte of RAM consumed per hour", False]
    ], "AWS provides per-second billing for EC2 instances launched with open-source Linux distributions (such as Amazon Linux and Ubuntu), with a 60-second minimum duration.", "Compute Services", "MEDIUM", ["Billing", "Per-Second"], "Module 4")

    q(398, "Which of the following is an example of horizontal scaling for Amazon EC2?", "SINGLE_SELECT", 1, [
        ["A", "Adding more EC2 instances behind an Application Load Balancer to handle increased web traffic", True],
        ["B", "Changing an EC2 instance type from t3.micro to m5.2xlarge", False],
        ["C", "Upgrading an EBS volume from 100 GB to 1 TB", False],
        ["D", "Attaching a secondary network interface card to a single server", False]
    ], "Horizontal scaling (scaling out) involves adding more compute instances to distribute the load across multiple servers. Changing the instance type to a larger size is vertical scaling (scaling up).", "Compute Services", "EASY", ["Horizontal Scaling", "Auto Scaling"], "Module 4")

    q(399, "What is vertical scaling in the context of Amazon EC2 compute?", "SINGLE_SELECT", 1, [
        ["A", "Upgrading or downgrading the instance size or family (e.g., from t3.small to c5.xlarge) to allocate more CPU and RAM to a single machine", True],
        ["B", "Deploying replicas across three different continents", False],
        ["C", "Splitting an application into microservices", False],
        ["D", "Adding 10 additional servers to an Auto Scaling group", False]
    ], "Vertical scaling (scaling up/down) means resizing a single instance by changing its instance type to one with more or fewer CPUs, memory, network capacity, or storage.", "Compute Services", "EASY", ["Vertical Scaling", "Instance Resizing"], "Module 4")

    q(400, "Which EC2 instance purchase option allows you to exchange attributes (such as instance family, operating system, or tenancy) during the term?", "SINGLE_SELECT", 1, [
        ["A", "Convertible Reserved Instances", True],
        ["B", "Standard Reserved Instances", False],
        ["C", "Spot Fleet Instances", False],
        ["D", "On-Demand Instances", False]
    ], "Convertible Reserved Instances allow you to exchange the RI for another Convertible RI with a different instance family, OS, tenancy, or payment option, offering flexibility as architecture requirements change.", "Compute Services", "MEDIUM", ["Convertible RI", "Flexibility"], "Module 4")

    q(401, "What is the primary benefit of AWS Graviton processors used in modern EC2 instance families (e.g., c7g, m7g, t4g)?", "SINGLE_SELECT", 1, [
        ["A", "Superior price-performance engineered on 64-bit ARM architecture compared to traditional x86 processors", True],
        ["B", "Ability to run legacy 16-bit MS-DOS binaries natively", False],
        ["C", "Completely eliminating the need for an operating system", False],
        ["D", "Guaranteeing zero latency regardless of user distance", False]
    ], "AWS Graviton processors are custom-built by AWS using 64-bit ARM Neoverse cores to deliver up to 40% better price-performance over comparable x86-based instances for a wide variety of cloud workloads.", "Compute Services", "MEDIUM", ["Graviton", "ARM", "Price Performance"], "Module 4")

    q(402, "Which EC2 feature allows you to automatically recover an instance to a healthy physical host if the underlying physical hardware degrades?", "SINGLE_SELECT", 1, [
        ["A", "Amazon EC2 Instance Auto-Recovery", True],
        ["B", "Amazon Inspector remediation", False],
        ["C", "AWS Artifact audit", False],
        ["D", "AWS Cost Anomaly Detection", False]
    ], "EC2 Auto-Recovery automatically recovers supported instances if an underlying hardware failure occurs, preserving the instance ID, private and public IP addresses, Elastic IPs, and EBS volume attachments.", "Compute Services", "HARD", ["Auto-Recovery", "Hardware Failure"], "Module 4")

    q(403, "A development team wants to launch a batch job every night at 2 AM that takes 45 minutes to execute. If it fails or is cancelled, it can be safely re-run without issue. Which pricing model is most cost-effective?", "SINGLE_SELECT", 1, [
        ["A", "Spot Instances", True],
        ["B", "Dedicated Host with 3-year upfront payment", False],
        ["C", "Standard Reserved Instance", False],
        ["D", "Multi-AZ On-Demand cluster", False]
    ], "Because the workload is stateless, restartable, and runs during off-peak hours, Spot Instances will save up to 90% in compute costs compared to On-Demand.", "Compute Services", "MEDIUM", ["Spot", "Batch Processing"], "Module 4")

    q(404, "Which statement is true regarding the termination protection setting on an EC2 instance?", "SINGLE_SELECT", 1, [
        ["A", "It prevents accidental termination of the instance via the AWS Management Console, CLI, or API", True],
        ["B", "It prevents the operating system from crashing due to software errors", False],
        ["C", "It disables all SSH access permanently", False],
        ["D", "It stops AWS from shutting down the instance during billing disputes", False]
    ], "Enabling termination protection on an EC2 instance prevents it from being accidentally terminated by an administrator using the AWS Management Console, AWS CLI, or API calls until the protection is explicitly disabled.", "Compute Services", "EASY", ["Termination Protection", "EC2"], "Module 4")

    q(405, "What key pair component is stored by AWS when you create an EC2 key pair for SSH authentication?", "SINGLE_SELECT", 1, [
        ["A", "The public key only; the user downloads and retains the private key", True],
        ["B", "Both the public key and private key in plain text", False],
        ["C", "The private key only; the user keeps the public key", False],
        ["D", "AWS does not store either key component", False]
    ], "AWS stores only the public key component of an EC2 key pair and injects it into the instance metadata at launch. The user must securely download and store the private key file (.pem or .ppk) on their local machine.", "Compute Services", "MEDIUM", ["Key Pair", "SSH", "Security"], "Module 4")

    # -------------------------------------------------------------
    # 3. Containers & Serverless (CP-406 to CP-430) - 25 questions
    # -------------------------------------------------------------
    q(406, "What is AWS Lambda?", "SINGLE_SELECT", 1, [
        ["A", "A serverless, event-driven compute service that lets you run code without provisioning or managing servers", True],
        ["B", "A managed physical blade server rack installed in your office", False],
        ["C", "A relational database storage engine", False],
        ["D", "A domain name registrar service", False]
    ], "AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time consumed (down to the millisecond) when your code executes in response to events.", "Serverless", "EASY", ["Lambda", "Serverless"], "Module 4")

    q(407, "What is the maximum execution execution timeout for a single AWS Lambda function invocation?", "SINGLE_SELECT", 1, [
        ["A", "15 minutes (900 seconds)", True],
        ["B", "60 seconds", False],
        ["C", "2 hours", False],
        ["D", "24 hours", False]
    ], "The maximum configurable execution duration (timeout) for an AWS Lambda function invocation is 15 minutes (900 seconds). For tasks exceeding 15 minutes, AWS Step Functions, ECS, or EC2 should be used.", "Serverless", "MEDIUM", ["Lambda", "Timeout"], "Module 4")

    q(408, "How does AWS calculate charges for AWS Lambda executions?", "SINGLE_SELECT", 1, [
        ["A", "Based on the number of requests and the duration calculated in milliseconds, multiplied by the allocated memory size", True],
        ["B", "A flat monthly subscription fee of $50 per function", False],
        ["C", "Based on the number of lines of source code in the function", False],
        ["D", "Based on the number of developers with access to the AWS account", False]
    ], "AWS Lambda pricing is determined by: 1) The number of requests/invocations, and 2) The duration of execution measured in milliseconds, weighted by the amount of memory (MB) allocated to the function.", "Serverless", "MEDIUM", ["Lambda", "Pricing"], "Module 4")

    q(409, "Which AWS service is a managed container orchestration service compatible with Docker containers?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Elastic Container Service (Amazon ECS)", True],
        ["B", "Amazon Simple Email Service (SES)", False],
        ["C", "Amazon DynamoDB", False],
        ["D", "AWS Systems Manager", False]
    ], "Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service that helps you easily deploy, manage, and scale containerized applications using Docker containers.", "Containers", "EASY", ["ECS", "Containers"], "Module 4")

    q(410, "Which AWS service is a managed container service that makes it easy to run Kubernetes on AWS without needing to install and operate your own Kubernetes control plane?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Elastic Kubernetes Service (Amazon EKS)", True],
        ["B", "Amazon Elastic Block Store (EBS)", False],
        ["C", "Amazon Redshift", False],
        ["D", "AWS AppSync", False]
    ], "Amazon Elastic Kubernetes Service (Amazon EKS) is a managed service that you can use to run Kubernetes on AWS and on-premises data centers without needing to maintain your own Kubernetes control plane or nodes.", "Containers", "EASY", ["EKS", "Kubernetes"], "Module 4")

    q(411, "What is AWS Fargate?", "SINGLE_SELECT", 1, [
        ["A", "A serverless compute engine for containers that works with both Amazon ECS and Amazon EKS, eliminating the need to manage EC2 instances", True],
        ["B", "A physical gateway device for connecting corporate LANs", False],
        ["C", "A relational database proxy service", False],
        ["D", "An interactive code repository hosting service", False]
    ], "AWS Fargate is a serverless, pay-as-you-go compute engine that lets you build applications without managing servers. Fargate runs containers for Amazon ECS and EKS without requiring you to manage EC2 instances or cluster capacity.", "Containers", "MEDIUM", ["Fargate", "Serverless Containers"], "Module 4")

    q(412, "Where can Docker container images be stored, managed, and retrieved within AWS?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Elastic Container Registry (Amazon ECR)", True],
        ["B", "Amazon S3 Glacier Flexible Retrieval", False],
        ["C", "AWS Artifact", False],
        ["D", "Amazon FSx for Lustre", False]
    ], "Amazon Elastic Container Registry (Amazon ECR) is a fully managed container registry that makes it easy for developers to store, manage, share, and deploy container images and artifacts anywhere.", "Containers", "EASY", ["ECR", "Container Registry"], "Module 4")

    q(413, "Which of the following are serverless services on AWS? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "AWS Lambda", True],
        ["B", "Amazon DynamoDB", True],
        ["C", "Amazon EC2", False],
        ["D", "Amazon RDS for Oracle", False],
        ["E", "Amazon EMR with master node clusters", False]
    ], "AWS Lambda and Amazon DynamoDB are classic serverless services that automatically scale, offer built-in high availability, and do not require provisioning, patching, or managing servers.", "Serverless", "MEDIUM", ["Serverless", "Lambda", "DynamoDB"], "Module 4")

    q(414, "Which event source can directly trigger an AWS Lambda function execution? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "An object being uploaded to an Amazon S3 bucket", True],
        ["B", "A message arriving in an Amazon Simple Queue Service (SQS) queue", True],
        ["C", "A monthly PDF billing invoice generated in the billing console", False],
        ["D", "A user viewing their AWS Cost Explorer chart in a browser", False],
        ["E", "A manual reboot of a home office broadband router", False]
    ], "AWS Lambda can be natively triggered by events from over 200 AWS services, including S3 bucket uploads, DynamoDB streams, SQS messages, SNS notifications, API Gateway HTTP requests, and EventBridge events.", "Serverless", "MEDIUM", ["Lambda Triggers", "S3", "SQS"], "Module 4")

    q(415, "What is the primary operational difference between running Amazon ECS on EC2 launch type versus ECS on AWS Fargate?", "SINGLE_SELECT", 1, [
        ["A", "With EC2 launch type you manage the underlying OS patching and server fleet; with Fargate AWS manages all server infrastructure serverlessly", True],
        ["B", "EC2 launch type only supports Python, while Fargate only supports Java", False],
        ["C", "Fargate requires purchasing physical hardware upfront", False],
        ["D", "EC2 launch type does not support Docker containers", False]
    ], "With ECS on EC2, you maintain and patch the virtual servers in the cluster. With AWS Fargate, you simply specify CPU and memory requirements and AWS runs the containers serverlessly without server management.", "Containers", "MEDIUM", ["ECS", "Fargate", "Management"], "Module 4")

    q(416, "What is an AWS Lambda layer?", "SINGLE_SELECT", 1, [
        ["A", "A distribution mechanism for libraries, custom runtimes, and other function dependencies to promote code reuse across multiple functions", True],
        ["B", "A physical cooling rack inside an AWS data center", False],
        ["C", "An encryption barrier between public and private subnets", False],
        ["D", "A virtual private cloud peering connection", False]
    ], "A Lambda layer is a .zip file archive that can contain additional code, libraries, pre-compiled binaries, or custom runtimes. Layers let you share common code across multiple Lambda functions without bloating deployment packages.", "Serverless", "HARD", ["Lambda Layers", "Reusability"], "Module 4")

    q(417, "Which AWS service is an interactive visual workflow service used to orchestrate serverless architectures and coordinate multiple AWS Lambda functions?", "SINGLE_SELECT", 1, [
        ["A", "AWS Step Functions", True],
        ["B", "AWS CodeBuild", False],
        ["C", "Amazon CloudWatch", False],
        ["D", "AWS App2Container", False]
    ], "AWS Step Functions is a low-code visual workflow service used to orchestrate AWS services (such as AWS Lambda, Amazon ECS, and Amazon DynamoDB) into business processes and distributed state machines.", "Serverless", "EASY", ["Step Functions", "Orchestration"], "Module 4")

    q(418, "Which compute model requires the customer to manage zero operating system patches, zero hardware updates, and zero server provisioning?", "SINGLE_SELECT", 1, [
        ["A", "Serverless compute (e.g., AWS Lambda, AWS Fargate)", True],
        ["B", "Infrastructure as a Service (e.g., Amazon EC2)", False],
        ["C", "On-premises dedicated bare metal servers", False],
        ["D", "Co-located server hosting in a private facility", False]
    ], "In the serverless compute model (Lambda, Fargate), AWS handles all operating system maintenance, security patching, hardware provisioning, capacity scaling, and high availability.", "Serverless", "EASY", ["Serverless Model", "Shared Responsibility"], "Module 4")

    q(419, "A company wants to convert their legacy monolithic application into microservices packaged as container images. Which AWS services can manage the container deployments? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Amazon Elastic Container Service (Amazon ECS)", True],
        ["B", "Amazon Elastic Kubernetes Service (Amazon EKS)", True],
        ["C", "Amazon Simple Storage Service (Amazon S3)", False],
        ["D", "AWS Direct Connect", False],
        ["E", "Amazon Route 53 Resolver", False]
    ], "Amazon ECS and Amazon EKS are AWS's two primary container orchestration services designed to deploy, run, and scale containerized microservices across cloud infrastructure.", "Containers", "MEDIUM", ["Microservices", "ECS", "EKS"], "Module 4")

    q(420, "What is an AWS Lambda cold start?", "SINGLE_SELECT", 1, [
        ["A", "The initialization latency that occurs when a new execution environment is provisioned to handle an invocation for an inactive function", True],
        ["B", "Shutting down servers during winter weather conditions", False],
        ["C", "Starting an EC2 instance from an unformatted EBS volume", False],
        ["D", "Restoring a database snapshot from cold tape storage", False]
    ], "A cold start is the brief setup time that occurs when Lambda downloads your code, starts the container runtime, and initializes your code before executing an invocation on a freshly created execution environment.", "Serverless", "HARD", ["Cold Start", "Lambda"], "Module 4")

    q(421, "Which feature of AWS Lambda eliminates cold start latency for critical production applications requiring consistent single-digit millisecond response times?", "SINGLE_SELECT", 1, [
        ["A", "Provisioned Concurrency", True],
        ["B", "Elastic Load Balancing health checks", False],
        ["C", "Auto Scaling simple policies", False],
        ["D", "S3 Transfer Acceleration", False]
    ], "Provisioned Concurrency initializes a requested number of execution environments in advance so that they are prepared to respond immediately to function invocations with zero cold start latency.", "Serverless", "HARD", ["Provisioned Concurrency", "Lambda"], "Module 4")

    q(422, "Can AWS Lambda functions run inside a private Amazon VPC to access private RDS databases and internal services?", "SINGLE_SELECT", 1, [
        ["A", "Yes, by configuring VPC connectivity (subnets and security groups) in the Lambda function configuration", True],
        ["B", "No, Lambda is strictly a public service and cannot connect to private VPC resources", False],
        ["C", "Only if the database is open to 0.0.0.0/0 on the public Internet", False],
        ["D", "Only when running on Dedicated EC2 Hosts", False]
    ], "Lambda functions can be configured to connect to private subnets within your Amazon VPC, allowing secure access to internal resources like Amazon RDS databases, ElastiCache clusters, and private API endpoints.", "Serverless", "MEDIUM", ["Lambda VPC", "Private Networking"], "Module 4")

    q(423, "Which container runtime is standardly supported by Amazon Elastic Container Service (ECS)?", "SINGLE_SELECT", 1, [
        ["A", "Docker", True],
        ["B", "VMware vSphere hypervisor", False],
        ["C", "Microsoft Hyper-V hardware virtualization", False],
        ["D", "VirtualBox desktop manager", False]
    ], "Amazon ECS is built to orchestrate Docker containers and OCI-compliant container formats, allowing standardized container packaging and execution.", "Containers", "EASY", ["Docker", "ECS"], "Module 4")

    q(424, "What is a Task Definition in Amazon Elastic Container Service (Amazon ECS)?", "SINGLE_SELECT", 1, [
        ["A", "A text blueprint in JSON format that describes one or more containers (images, CPU, memory, ports) that form your application", True],
        ["B", "A daily checklist for system administrators logged in Jira", False],
        ["C", "A firewall rule defining inbound TCP traffic permissions", False],
        ["D", "An AWS IAM user credential policy", False]
    ], "An ECS Task Definition is a text blueprint in JSON format that details the containers that make up your application, including Docker image URLs, CPU and memory allocation, environment variables, and port mappings.", "Containers", "MEDIUM", ["Task Definition", "ECS Blueprint"], "Module 4")

    q(425, "Which AWS service allows developers to write and test AWS Lambda functions directly within a browser-based Integrated Development Environment (IDE)?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cloud9", True],
        ["B", "AWS CodeCommit", False],
        ["C", "Amazon CloudWatch Logs", False],
        ["D", "Amazon QuickSight", False]
    ], "AWS Cloud9 is a cloud-based Integrated Development Environment (IDE) that lets you write, run, and debug code with just a browser. It comes prepackaged with essential tools for popular programming languages and AWS serverless development.", "Development", "EASY", ["Cloud9", "IDE"], "Module 4")

    q(426, "Which architectural pattern is best exemplified by AWS Lambda processing images immediately as they are uploaded to Amazon S3?", "SINGLE_SELECT", 1, [
        ["A", "Event-driven architecture", True],
        ["B", "Monolithic client-server architecture", False],
        ["C", "Synchronous blocking batch loop", False],
        ["D", "Peer-to-peer file sharing protocol", False]
    ], "Event-driven architecture uses events to trigger and communicate between decoupled services. S3 notifying Lambda upon an S3 PutObject event is a textbook event-driven serverless design.", "Serverless", "EASY", ["Event-Driven", "Architecture"], "Module 4")

    q(427, "What is the maximum execution memory that can be allocated to an individual AWS Lambda function?", "SINGLE_SELECT", 1, [
        ["A", "10,240 MB (10 GB)", True],
        ["B", "1,024 MB (1 GB)", False],
        ["C", "512 MB", False],
        ["D", "64 GB", False]
    ], "AWS Lambda functions can be allocated between 128 MB and 10,240 MB (10 GB) of memory in 1 MB increments. Lambda allocates CPU power proportionally to the amount of memory selected.", "Serverless", "HARD", ["Lambda Memory", "Specs"], "Module 4")

    q(428, "How does AWS Lambda automatically provide high availability?", "SINGLE_SELECT", 1, [
        ["A", "By running execution environments across multiple Availability Zones in the chosen Region automatically", True],
        ["B", "By duplicating code onto client mobile devices", False],
        ["C", "By demanding the customer configure three standby EC2 servers", False],
        ["D", "By restricting functions to run only during daytime hours", False]
    ], "AWS Lambda is architected with built-in high availability across multiple Availability Zones in each AWS Region. Customers do not need to configure multi-AZ failover or redundant standby nodes.", "Serverless", "MEDIUM", ["High Availability", "Lambda Multi-AZ"], "Module 4")

    q(429, "Which AWS service is a managed pub/sub messaging and mobile push notification service that can trigger Lambda functions?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Simple Notification Service (SNS)", True],
        ["B", "Amazon Route 53", False],
        ["C", "Amazon Aurora", False],
        ["D", "AWS Storage Gateway", False]
    ], "Amazon SNS is a fully managed pub/sub messaging service. When a message is published to an SNS topic, it can be fanned out to thousands of subscribers, including triggering AWS Lambda functions.", "Serverless", "EASY", ["SNS", "PubSub", "Trigger"], "Module 4")

    q(430, "What is the primary advantage of containers compared to traditional virtual machines?", "SINGLE_SELECT", 1, [
        ["A", "Containers share the host OS kernel and are lightweight, fast to spin up, and use fewer system resources than full virtual machines", True],
        ["B", "Containers include an entire separate guest operating system inside every container", False],
        ["C", "Containers are physical hardware cards inserted into PCIe slots", False],
        ["D", "Containers eliminate all software vulnerabilities automatically", False]
    ], "Containers package application code, configurations, and dependencies while sharing the host operating system kernel. This makes them significantly lighter, faster to boot, and more portable than traditional VMs.", "Containers", "EASY", ["Containers vs VMs", "Benefits"], "Module 4")

    # -------------------------------------------------------------
    # 4. Auto Scaling & Load Balancing (CP-431 to CP-450) - 20 questions
    # -------------------------------------------------------------
    q(431, "What is the primary purpose of an Amazon EC2 Auto Scaling group?", "SINGLE_SELECT", 1, [
        ["A", "Automatically adjusting the number of EC2 instances up or down to maintain steady performance at the lowest possible cost", True],
        ["B", "Automatically increasing the credit limit of your corporate credit card", False],
        ["C", "Automatically updating domain name registrations every 30 days", False],
        ["D", "Deleting database backups after 24 hours", False]
    ], "Amazon EC2 Auto Scaling helps you maintain application availability and allows you to dynamically add or remove EC2 instances according to conditions you define (demand, schedule, or metrics).", "Elasticity & Scaling", "EASY", ["Auto Scaling", "Elasticity"], "Module 4")

    q(432, "Which scaling policy type adjusts Auto Scaling capacity to keep a specific metric (like average CPU utilization) at a specified target value (e.g., 60%)?", "SINGLE_SELECT", 1, [
        ["A", "Target Tracking Scaling Policy", True],
        ["B", "Simple Scaling Policy", False],
        ["C", "Step Scaling Policy", False],
        ["D", "Scheduled Scaling Policy", False]
    ], "Target tracking scaling policies automatically adjust the capacity of your Auto Scaling group to maintain a target metric value (like keeping average aggregate CPU utilization at 60% or ALB request count per target at 1,000).", "Elasticity & Scaling", "MEDIUM", ["Target Tracking", "Auto Scaling"], "Module 4")

    q(433, "A company experiences predictable spikes in e-commerce traffic every Friday at 6 PM. Which EC2 Auto Scaling strategy is best suited to handle this known schedule?", "SINGLE_SELECT", 1, [
        ["A", "Scheduled Scaling", True],
        ["B", "Predictive Scaling with zero history", False],
        ["C", "Manual rebooting of servers", False],
        ["D", "Dynamic scaling based on disk space", False]
    ], "Scheduled scaling allows you to set up your own scaling schedule based on predictable, recurring traffic patterns (such as weekly batch jobs or weekend retail promotions).", "Elasticity & Scaling", "MEDIUM", ["Scheduled Scaling", "Predictable Load"], "Module 4")

    q(434, "Which Elastic Load Balancer (ELB) type operates at the application layer (Layer 7) and supports path-based and host-based routing for HTTP and HTTPS traffic?", "SINGLE_SELECT", 1, [
        ["A", "Application Load Balancer (ALB)", True],
        ["B", "Network Load Balancer (NLB)", False],
        ["C", "Gateway Load Balancer (GWLB)", False],
        ["D", "Classic Load Balancer (CLB legacy)", False]
    ], "Application Load Balancer (ALB) operates at Layer 7 of the OSI model and supports advanced request routing based on URL paths (/api, /images), host headers, HTTP methods, and query strings.", "Load Balancing", "EASY", ["ALB", "Layer 7"], "Module 4")

    q(435, "Which Elastic Load Balancer type operates at the transport layer (Layer 4), is capable of handling millions of requests per second with ultra-low latency, and supports static IP addresses?", "SINGLE_SELECT", 1, [
        ["A", "Network Load Balancer (NLB)", True],
        ["B", "Application Load Balancer (ALB)", False],
        ["C", "Gateway Load Balancer (GWLB)", False],
        ["D", "Route 53 latency policy", False]
    ], "Network Load Balancer (NLB) operates at Layer 4 (TCP, UDP, TLS), offers ultra-high throughput with ultra-low latency, and provides a static IP per Availability Zone (or supports Elastic IPs).", "Load Balancing", "MEDIUM", ["NLB", "Layer 4", "Ultra-Low Latency"], "Module 4")

    q(436, "Which load balancer is specifically designed to deploy, scale, and manage third-party virtual appliances such as firewalls, intrusion detection systems, and deep packet inspection systems?", "SINGLE_SELECT", 1, [
        ["A", "Gateway Load Balancer (GWLB)", True],
        ["B", "Application Load Balancer (ALB)", False],
        ["C", "Network Load Balancer (NLB)", False],
        ["D", "AWS Direct Connect gateway", False]
    ], "Gateway Load Balancer (GWLB) operates at Layer 3/4 and enables you to deploy, scale, and manage third-party virtual appliances such as next-generation firewalls (NGFW) and intrusion detection/prevention systems (IDS/IPS).", "Load Balancing", "HARD", ["GWLB", "Virtual Appliances"], "Module 4")

    q(437, "What mechanism does Elastic Load Balancing use to verify whether registered targets (EC2 instances or containers) are operational before routing client traffic to them?", "SINGLE_SELECT", 1, [
        ["A", "Health Checks", True],
        ["B", "IAM policy audits", False],
        ["C", "AWS Trusted Advisor cost reports", False],
        ["D", "AWS Billing alerts", False]
    ], "Elastic Load Balancing periodically performs health checks against registered targets. If a target fails consecutive health checks, the load balancer stops routing traffic to that unhealthy target until it becomes healthy again.", "Load Balancing", "EASY", ["Health Checks", "ELB"], "Module 4")

    q(438, "What are the three core capacity parameters configured on an Amazon EC2 Auto Scaling group?", "SINGLE_SELECT", 1, [
        ["A", "Minimum capacity, Maximum capacity, and Desired capacity", True],
        ["B", "Primary capacity, Secondary capacity, and Standby capacity", False],
        ["C", "Single capacity, Double capacity, and Triple capacity", False],
        ["D", "Local capacity, Regional capacity, and Global capacity", False]
    ], "An EC2 Auto Scaling group is defined by: 1) Minimum capacity (lowest instance count permitted), 2) Maximum capacity (upper ceiling to cap cost), and 3) Desired capacity (target instance count maintained during normal operation).", "Elasticity & Scaling", "MEDIUM", ["Auto Scaling Capacity", "Desired Capacity"], "Module 4")

    q(439, "What is an EC2 Launch Template?", "SINGLE_SELECT", 1, [
        ["A", "A version-controlled specification that defines instance configuration details (AMI ID, instance type, key pair, security groups, block device mapping) used by Auto Scaling", True],
        ["B", "A paper questionnaire mailed to AWS support to request hardware", False],
        ["C", "A CloudWatch alarm that alerts on disk saturation", False],
        ["D", "A pricing spreadsheet used by financial controllers", False]
    ], "A Launch Template specifies instance configuration information. It supports versioning, allows partial parameter definitions, and is the modern replacement for legacy Launch Configurations in EC2 Auto Scaling.", "Elasticity & Scaling", "MEDIUM", ["Launch Template", "Auto Scaling"], "Module 4")

    q(440, "What happens when an EC2 instance in an Auto Scaling group fails an ELB health check?", "SINGLE_SELECT", 1, [
        ["A", "The Auto Scaling group marks the instance as unhealthy, terminates it, and launches a healthy replacement instance", True],
        ["B", "The instance is placed in hibernation for 30 days", False],
        ["C", "The entire VPC is deleted automatically", False],
        ["D", "AWS sends an engineer to replace the physical RAM in the server", False]
    ], "When ELB health check integration is enabled on an Auto Scaling group, if an instance fails ELB health checks, the Auto Scaling group terminates the unhealthy instance and launches a new healthy replacement to maintain desired capacity.", "Elasticity & Scaling", "MEDIUM", ["Auto Scaling Self-Healing", "ELB Health Check"], "Module 4")

    q(441, "What is the purpose of Auto Scaling Cooldown periods?", "SINGLE_SELECT", 1, [
        ["A", "To ensure that the Auto Scaling group does not launch or terminate additional instances before the previous scaling activity takes effect and metrics stabilize", True],
        ["B", "To cool down server CPUs with chilled water in the data center", False],
        ["C", "To allow administrators to take a mandatory break during exams", False],
        ["D", "To prevent billing invoices from being generated", False]
    ], "A cooldown period is a configurable amount of time during which the Auto Scaling group suspends additional scaling activities, ensuring the group doesn't overcompensate before newly launched instances stabilize.", "Elasticity & Scaling", "MEDIUM", ["Cooldown", "Auto Scaling"], "Module 4")

    q(442, "How does an Application Load Balancer distribute traffic across multiple Availability Zones?", "SINGLE_SELECT", 1, [
        ["A", "By registering targets across subnets in multiple AZs and using cross-zone load balancing to route traffic evenly", True],
        ["B", "By duplicating every single incoming HTTP packet to all instances in parallel", False],
        ["C", "By routing traffic only to the AZ that has the lowest ambient room temperature", False],
        ["D", "By sending all traffic to one AZ until that data center experiences a physical blackout", False]
    ], "When an ALB is configured across multiple Availability Zones, cross-zone load balancing ensures requests are distributed evenly across all registered targets in all enabled AZs, maximizing fault tolerance and resilience.", "Load Balancing", "MEDIUM", ["Cross-Zone", "ALB"], "Module 4")

    q(443, "Which load balancer feature directs a user's consecutive requests to the same target instance for session state persistence?", "SINGLE_SELECT", 1, [
        ["A", "Sticky Sessions (Session Affinity)", True],
        ["B", "Connection Draining", False],
        ["C", "Path-Based Routing", False],
        ["D", "DNS Round-Robin", False]
    ], "Sticky Sessions (Session Affinity) binds a user's session to a specific target instance behind the load balancer using HTTP cookies, ensuring stateful session data stored in server memory remains reachable by the user.", "Load Balancing", "MEDIUM", ["Sticky Sessions", "Session Affinity"], "Module 4")

    q(444, "What is Connection Draining (Deregistration Delay) in Elastic Load Balancing?", "SINGLE_SELECT", 1, [
        ["A", "A feature that allows in-flight requests to complete before an instance is de-registered or terminated", True],
        ["B", "Flushing unused network cables in the data center", False],
        ["C", "Disconnecting database connection pools during backup windows", False],
        ["D", "Immediately dropping all user connections when an instance is marked unhealthy", False]
    ], "Connection Draining (Deregistration Delay) ensures that the load balancer stops sending new requests to de-registering instances while allowing existing, in-flight requests to complete gracefully within a specified timeout.", "Load Balancing", "HARD", ["Connection Draining", "ELB"], "Module 4")

    q(445, "Which Auto Scaling feature uses machine learning to forecast future compute traffic based on past patterns and provisions capacity ahead of anticipated spikes?", "SINGLE_SELECT", 1, [
        ["A", "Predictive Scaling", True],
        ["B", "Manual Scaling", False],
        ["C", "Simple Scaling", False],
        ["D", "Step Scaling", False]
    ], "Predictive Scaling uses machine learning models to analyze historical traffic patterns and forecast upcoming capacity needs, scheduling instance scaling actions ahead of time so capacity is ready before traffic arrives.", "Elasticity & Scaling", "MEDIUM", ["Predictive Scaling", "Machine Learning"], "Module 4")

    q(446, "Can an Auto Scaling group span across multiple AWS Regions?", "SINGLE_SELECT", 1, [
        ["A", "No, an Auto Scaling group can span multiple Availability Zones within a single Region, but cannot span multiple Regions", True],
        ["B", "Yes, a single Auto Scaling group automatically spans all global AWS regions", False],
        ["C", "Only if AWS Organizations consolidated billing is active", False],
        ["D", "Yes, if configured through AWS Route 53", False]
    ], "An EC2 Auto Scaling group is a regional construct: it can span multiple Availability Zones within the same AWS Region, but it cannot span multiple separate AWS Regions.", "Elasticity & Scaling", "MEDIUM", ["Auto Scaling Scope", "Regional"], "Module 4")

    q(447, "Which protocol types are supported by an Application Load Balancer?", "SINGLE_SELECT", 1, [
        ["A", "HTTP, HTTPS, gRPC, and WebSockets", True],
        ["B", "Raw TCP and UDP exclusively", False],
        ["C", "FTP and SMTP email transmission only", False],
        ["D", "BGP and ICMP ping packets exclusively", False]
    ], "Application Load Balancer is engineered for application traffic and natively supports HTTP, HTTPS, WebSockets, and gRPC protocols at Layer 7 of the OSI stack.", "Load Balancing", "MEDIUM", ["ALB Protocols", "Layer 7"], "Module 4")

    q(448, "Which load balancer should you use if your application requires a single fixed, static public IP address for clients with strict firewall whitelisting?", "SINGLE_SELECT", 1, [
        ["A", "Network Load Balancer (NLB)", True],
        ["B", "Application Load Balancer (ALB)", False],
        ["C", "Classic Load Balancer (CLB)", False],
        ["D", "Amazon Route 53 failover record", False]
    ], "Network Load Balancers provide a static IP address per Availability Zone (and support assigning Elastic IPs). In contrast, ALBs only provide DNS names whose IP addresses change dynamically.", "Load Balancing", "HARD", ["NLB", "Static IP"], "Module 4")

    q(449, "How do Auto Scaling and Elastic Load Balancing combine to support the Reliability pillar of the AWS Well-Architected Framework?", "SINGLE_SELECT", 1, [
        ["A", "ELB distributes traffic across healthy targets while Auto Scaling replaces failed instances and scales capacity to match demand", True],
        ["B", "They convert all relational databases into flat text files automatically", False],
        ["C", "They eliminate the requirement for data encryption at rest", False],
        ["D", "They guarantee 100% discount on all compute costs", False]
    ], "Together, ELB routes traffic only to healthy instances across multiple AZs while Auto Scaling automatically detects failures, replaces unhealthy instances, and dynamically scales capacity, delivering high availability and fault tolerance.", "Elasticity & Scaling", "EASY", ["Reliability", "ELB", "Auto Scaling"], "Module 4")

    q(450, "What is an Auto Scaling Lifecycle Hook?", "SINGLE_SELECT", 1, [
        ["A", "A feature that pauses the launch or termination of an instance to perform custom actions (like log extraction or software setup) before entering or exiting service", True],
        ["B", "A phishing detection tool in Amazon GuardDuty", False],
        ["C", "A webhook that notifies billing controllers when invoices are overdue", False],
        ["D", "A hardware clip for rack-mounting servers in Outposts", False]
    ], "Lifecycle Hooks let you pause an instance as it launches or terminates, allowing you to perform custom actions (e.g., installing software, running health scripts, or backing up state/logs) before the instance is put in service or destroyed.", "Elasticity & Scaling", "HARD", ["Lifecycle Hooks", "Auto Scaling"], "Module 4")

    # -------------------------------------------------------------
    # 5. Networking & Content Delivery (CP-451 to CP-480) - 30 questions
    # -------------------------------------------------------------
    q(451, "What is an Amazon Virtual Private Cloud (Amazon VPC)?", "SINGLE_SELECT", 1, [
        ["A", "A logically isolated virtual network dedicated to your AWS account within the AWS cloud", True],
        ["B", "A physical cable connecting your office router to an AWS data center", False],
        ["C", "A software development kit for building mobile apps", False],
        ["D", "A public file storage repository open to all Internet users", False]
    ], "Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define, with complete control over IP addressing, subnets, and routing.", "Networking", "EASY", ["VPC", "Networking"], "Module 6")

    q(452, "What distinguishes a public subnet from a private subnet in an Amazon VPC?", "SINGLE_SELECT", 1, [
        ["A", "A public subnet has a direct route to an Internet Gateway (IGW) in its route table; a private subnet does not", True],
        ["B", "Public subnets use IPv6, while private subnets use IPv4", False],
        ["C", "Public subnets do not support EC2 instances", False],
        ["D", "Private subnets are located outside the AWS Region", False]
    ], "A public subnet is a subnet whose associated route table contains a default route (0.0.0.0/0) pointing to an Internet Gateway (IGW). A private subnet lacks a direct route to the Internet Gateway, isolating its instances from inbound Internet traffic.", "Networking", "EASY", ["Public Subnet", "Private Subnet", "IGW"], "Module 6")

    q(453, "Which component enables instances in a private subnet to initiate outbound traffic to the Internet (for software updates) while preventing the Internet from initiating inbound connections?", "SINGLE_SELECT", 1, [
        ["A", "NAT Gateway (or NAT Instance)", True],
        ["B", "Internet Gateway (IGW)", False],
        ["C", "Customer Gateway", False],
        ["D", "Virtual Private Gateway", False]
    ], "A Network Address Translation (NAT) Gateway is placed in a public subnet to allow instances in private subnets to send outbound requests to the Internet (e.g., OS updates) while blocking external inbound connections.", "Networking", "MEDIUM", ["NAT Gateway", "Outbound Internet"], "Module 6")

    q(454, "What is the primary difference between a Security Group and a Network Access Control List (NACL)?", "SINGLE_SELECT", 1, [
        ["A", "Security Groups operate at the instance level and are stateful; NACLs operate at the subnet level and are stateless", True],
        ["B", "Security Groups operate at the subnet level; NACLs operate at the account root level", False],
        ["C", "Security Groups support deny rules; NACLs only support allow rules", False],
        ["D", "Security Groups are stateless; NACLs are stateful", False]
    ], "Security Groups act as a virtual firewall for individual instances and are stateful (return traffic is automatically allowed). Network ACLs act at the subnet boundary, are stateless (inbound and outbound rules must be explicitly defined), and evaluate numbered allow/deny rules in order.", "Networking", "MEDIUM", ["Security Group", "NACL", "Stateful"], "Module 6")

    q(455, "Which statement is true about Security Group rules?", "SINGLE_SELECT", 1, [
        ["A", "They allow you to specify allow rules only; you cannot write explicit deny rules", True],
        ["B", "They evaluate deny rules before allow rules", False],
        ["C", "They block all outbound traffic by default and cannot be changed", False],
        ["D", "They are evaluated strictly in sequential numerical rule order", False]
    ], "Security Groups only support ALLOW rules. All traffic not explicitly allowed is denied by default. To explicitly deny traffic from a specific IP address, you must use a Network ACL (NACL).", "Networking", "MEDIUM", ["Security Group Rules", "Allow Only"], "Module 6")

    q(456, "What is Amazon Route 53?", "SINGLE_SELECT", 1, [
        ["A", "A highly available and scalable cloud Domain Name System (DNS) web service", True],
        ["B", "A physical highway navigation device provided by AWS", False],
        ["C", "An automated road freight tracking system", False],
        ["D", "A hardware router deployed at branch offices", False]
    ], "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. It translates human-friendly names (like www.example.com) into numeric IP addresses (like 192.0.2.1).", "Networking", "EASY", ["Route 53", "DNS"], "Module 6")

    q(457, "Which Route 53 routing policy routes user requests to the AWS endpoint that provides the lowest network latency for the end user?", "SINGLE_SELECT", 1, [
        ["A", "Latency Routing Policy", True],
        ["B", "Failover Routing Policy", False],
        ["C", "Weighted Routing Policy", False],
        ["D", "Geolocation Routing Policy", False]
    ], "Route 53 Latency-based routing directs traffic to the AWS Region that provides the lowest round-trip network latency for the user, based on worldwide network measurements.", "Networking", "MEDIUM", ["Route 53", "Latency Routing"], "Module 6")

    q(458, "Which Route 53 routing policy allows you to route traffic based on the geographic location of your users (by country or continent)?", "SINGLE_SELECT", 1, [
        ["A", "Geolocation Routing Policy", True],
        ["B", "Multivalue Answer Routing Policy", False],
        ["C", "Simple Routing Policy", False],
        ["D", "IP-based Routing Policy", False]
    ], "Geolocation routing lets you choose the resources that serve your traffic based on the geographic location of your users (continent, country, or US state), ideal for localized content or licensing compliance.", "Networking", "MEDIUM", ["Route 53", "Geolocation"], "Module 6")

    q(459, "What is Amazon CloudFront?", "SINGLE_SELECT", 1, [
        ["A", "A fast, secure Content Delivery Network (CDN) service that securely delivers data, videos, applications, and APIs to global customers with low latency", True],
        ["B", "A weather forecasting tool used by meteorological agencies", False],
        ["C", "A desktop file explorer client for Windows", False],
        ["D", "A physical server shipped to customer premises for cold storage", False]
    ], "Amazon CloudFront is a fast Content Delivery Network (CDN) service that caches and delivers static and dynamic content through a worldwide network of edge locations, accelerating delivery and reducing load on origin servers.", "Networking", "EASY", ["CloudFront", "CDN"], "Module 6")

    q(460, "Which AWS service establishes a dedicated, private physical network connection from an on-premises data center directly to AWS, bypassing the public Internet entirely?", "SINGLE_SELECT", 1, [
        ["A", "AWS Direct Connect", True],
        ["B", "AWS Site-to-Site VPN", False],
        ["C", "Amazon Route 53 Resolver", False],
        ["D", "AWS Global Accelerator", False]
    ], "AWS Direct Connect links your internal on-premises network to an AWS Direct Connect location over a standard Ethernet fiber-optic cable, bypassing the public Internet to deliver consistent performance, higher bandwidth, and reduced data egress costs.", "Networking", "MEDIUM", ["Direct Connect", "Dedicated Connection"], "Module 6")

    q(461, "What is the primary difference between AWS Direct Connect and AWS Site-to-Site VPN?", "SINGLE_SELECT", 1, [
        ["A", "Direct Connect is a dedicated private physical circuit bypassing the Internet; Site-to-Site VPN creates an encrypted IPsec tunnel over the public Internet", True],
        ["B", "Site-to-Site VPN requires 6 months of physical cable construction; Direct Connect is instant software", False],
        ["C", "Direct Connect is free, while Site-to-Site VPN costs millions of dollars per month", False],
        ["D", "There is no functional difference between them", False]
    ], "AWS Site-to-Site VPN creates an encrypted IPSec connection over the public Internet that can be set up in minutes. AWS Direct Connect establishes a dedicated, non-Internet physical telecommunications circuit providing higher throughput and predictable latency.", "Networking", "MEDIUM", ["Direct Connect vs VPN", "Comparison"], "Module 6")

    q(462, "What is a VPC Peering connection?", "SINGLE_SELECT", 1, [
        ["A", "A networking connection between two VPCs that enables you to route traffic between them using private IPv4 or IPv6 addresses", True],
        ["B", "A public video conference channel between AWS customer support engineers", False],
        ["C", "A shared root account between two distinct companies", False],
        ["D", "A hardware bridge connecting two consumer laptops via USB", False]
    ], "A VPC peering connection is a networking connection between two VPCs that enables you to route traffic between them using private IPv4 or IPv6 addresses. Instances in either VPC can communicate with each other as if they are within the same network.", "Networking", "MEDIUM", ["VPC Peering", "Private Networking"], "Module 6")

    q(463, "Is VPC peering transitive?", "SINGLE_SELECT", 1, [
        ["A", "No, VPC peering is non-transitive (if VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A cannot communicate with VPC C through B)", True],
        ["B", "Yes, all VPC peering connections automatically route traffic across all other peered VPCs globally", False],
        ["C", "Only if both VPCs are in the same Availability Zone", False],
        ["D", "Yes, provided the CIDR blocks are completely identical", False]
    ], "VPC Peering does NOT support transitive routing. If VPC A is connected to VPC B, and VPC B is connected to VPC C, you cannot route traffic from VPC A to VPC C through VPC B; you must create an explicit peering connection between A and C (or use AWS Transit Gateway).", "Networking", "HARD", ["VPC Peering", "Non-Transitive"], "Module 6")

    q(464, "Which service acts as a central cloud router hub to connect hundreds of VPCs and on-premises networks together without complex point-to-point peering meshes?", "SINGLE_SELECT", 1, [
        ["A", "AWS Transit Gateway", True],
        ["B", "Internet Gateway", False],
        ["C", "NAT Instance", False],
        ["D", "Amazon CloudFront", False]
    ], "AWS Transit Gateway connects thousands of VPCs and on-premises networks through a central hub. This simplifies network topology and eliminates the need for complex, pairwise point-to-point VPC peering connections.", "Networking", "MEDIUM", ["Transit Gateway", "Hub and Spoke"], "Module 6")

    q(465, "What is AWS Global Accelerator?", "SINGLE_SELECT", 1, [
        ["A", "A networking service that improves the availability and performance of applications by directing user traffic through the AWS global private network using static Anycast IP addresses", True],
        ["B", "A hardware overclocking utility for EC2 CPU processors", False],
        ["C", "A startup incubator funding grant provided by Amazon", False],
        ["D", "A continuous delivery pipeline automation server", False]
    ], "AWS Global Accelerator uses AWS's global network backbone to route traffic from users to your application endpoints via two static Anycast IP addresses, providing up to 60% performance improvement and fast regional failover.", "Networking", "HARD", ["Global Accelerator", "Anycast"], "Module 6")

    q(466, "What is an AWS VPC Endpoint?", "SINGLE_SELECT", 1, [
        ["A", "A private virtual device that enables private connections between your VPC and supported AWS services without requiring an Internet Gateway or NAT Gateway", True],
        ["B", "A physical termination box at the boundary of a data center", False],
        ["C", "A wireless access point for office employees", False],
        ["D", "A software agent installed on mobile phones", False]
    ], "VPC Endpoints allow you to privately connect your VPC to supported AWS services (like Amazon S3, DynamoDB) and VPC endpoint services powered by AWS PrivateLink without requiring an Internet Gateway, NAT device, VPN connection, or AWS Direct Connect.", "Networking", "MEDIUM", ["VPC Endpoint", "PrivateLink"], "Module 6")

    q(467, "What are the two types of VPC Endpoints?", "SINGLE_SELECT", 1, [
        ["A", "Interface Endpoints (powered by PrivateLink with an ENI) and Gateway Endpoints (used for S3 and DynamoDB)", True],
        ["B", "Public Endpoints and Commercial Endpoints", False],
        ["C", "Hardware Endpoints and Virtual Endpoints", False],
        ["D", "Encrypted Endpoints and Unencrypted Endpoints", False]
    ], "The two types of VPC Endpoints are: 1) Gateway Endpoints (free, target routes in route tables for Amazon S3 and DynamoDB), and 2) Interface Endpoints (elastic network interfaces with private IP addresses powered by AWS PrivateLink for most other AWS services).", "Networking", "HARD", ["VPC Endpoint Types", "Gateway Endpoint", "Interface Endpoint"], "Module 6")

    q(468, "What does CIDR notation (e.g., 10.0.0.0/16) represent in an Amazon VPC?", "SINGLE_SELECT", 1, [
        ["A", "The Classless Inter-Domain Routing range of private IPv4 addresses allocated to the VPC", True],
        ["B", "The geographic coordinate of the physical data center", False],
        ["C", "The monthly dollar budget allocated to the network team", False],
        ["D", "The version number of the AWS management API", False]
    ], "Classless Inter-Domain Routing (CIDR) notation defines the range of private IPv4 addresses available to resources within the VPC (e.g., /16 provides 65,536 available IP addresses).", "Networking", "MEDIUM", ["CIDR", "IP Addressing"], "Module 6")

    q(469, "How many IP addresses does AWS reserve for internal networking purposes in every VPC subnet?", "SINGLE_SELECT", 1, [
        ["A", "5 IP addresses (first 4 and the last 1 in the subnet range)", True],
        ["B", "0 IP addresses (all are available to the customer)", False],
        ["C", "10 IP addresses", False],
        ["D", "1 IP address", False]
    ], "In every VPC subnet, AWS reserves the first four IP addresses and the last IP address (e.g., .0 Network, .1 Router, .2 DNS, .3 Future use, and .255 Broadcast), making them unavailable for customer instance assignment.", "Networking", "HARD", ["Reserved IPs", "VPC Subnet"], "Module 6")

    q(470, "What is the primary function of VPC Flow Logs?", "SINGLE_SELECT", 1, [
        ["A", "To capture information about the IP address traffic going to and from network interfaces in your VPC for monitoring, troubleshooting, and security audits", True],
        ["B", "To measure the physical temperature of network switches", False],
        ["C", "To record video streams of administrators logging into the console", False],
        ["D", "To automatically compress image files uploaded to S3", False]
    ], "VPC Flow Logs enables you to capture information about the IP traffic going to and from network interfaces in your VPC. Flow log data can be published to Amazon CloudWatch Logs, Amazon S3, or Amazon Kinesis Data Firehose for analysis.", "Networking", "MEDIUM", ["VPC Flow Logs", "Security"], "Module 6")

    q(471, "Which Route 53 record type allows you to map a root domain (zone apex, e.g., example.com) directly to an AWS resource like an Application Load Balancer or CloudFront distribution?", "SINGLE_SELECT", 1, [
        ["A", "Alias Record", True],
        ["B", "CNAME Record", False],
        ["C", "PTR Record", False],
        ["D", "TXT Record", False]
    ], "Route 53 Alias records are AWS-specific extensions to DNS that let you map zone apex domain names directly to AWS resources (ALBs, CloudFront, S3 buckets) while automatically recognizing IP address changes and avoiding DNS query charges.", "Networking", "MEDIUM", ["Alias Record", "Route 53", "Zone Apex"], "Module 6")

    q(472, "Why cannot standard DNS CNAME records be used at the zone apex (e.g., example.com)?", "SINGLE_SELECT", 1, [
        ["A", "DNS standards (RFC) forbid CNAME records at the root domain level, which is why Route 53 Alias records are used", True],
        ["B", "AWS billing rules impose a penalty on CNAME records", False],
        ["C", "CNAME records only work on local internal networks", False],
        ["D", "CNAME records do not support HTTPS encryption", False]
    ], "Under DNS RFC specifications, a CNAME record cannot coexist with other record types (like SOA and NS records) at the zone apex (root domain). Route 53 Alias records solve this problem by resolving natively at the apex.", "Networking", "HARD", ["CNAME", "Zone Apex", "DNS Standards"], "Module 6")

    q(473, "Which service provides origin shielding and caching to protect your origin servers from high traffic volumes?", "SINGLE_SELECT", 1, [
        ["A", "Amazon CloudFront", True],
        ["B", "AWS Snowball Edge", False],
        ["C", "Amazon QuickSight", False],
        ["D", "AWS Budgets", False]
    ], "Amazon CloudFront acts as a caching reverse proxy. When content is cached at edge locations and regional edge caches, requests are served directly from the cache, shielding the origin server from traffic spikes.", "Networking", "EASY", ["CloudFront", "Origin Shield"], "Module 6")

    q(474, "An application needs to block incoming requests originating from specific malicious IP addresses identified during a security scan. Which VPC feature can implement explicit DENY rules?", "SINGLE_SELECT", 1, [
        ["A", "Network Access Control List (NACL)", True],
        ["B", "Security Group", False],
        ["C", "NAT Gateway", False],
        ["D", "Internet Gateway", False]
    ], "Network ACLs support numbered rules that evaluate allow and deny statements in order. To explicitly block a specific IP address or CIDR block, you add a DENY rule to the inbound NACL table.", "Networking", "MEDIUM", ["NACL", "Deny Rule"], "Module 6")

    q(475, "What is a Customer Gateway in an AWS Site-to-Site VPN connection?", "SINGLE_SELECT", 1, [
        ["A", "An anchor on the on-premises side of the VPN connection (a physical appliance or software application)", True],
        ["B", "The AWS-managed VPN endpoint inside the VPC", False],
        ["C", "A retail store checkout counter for AWS hardware", False],
        ["D", "A billing portal for corporate customers", False]
    ], "In an AWS Site-to-Site VPN, the Customer Gateway is the physical device or software appliance on your on-premises side of the connection. The Virtual Private Gateway (or Transit Gateway) is the anchor on the AWS side.", "Networking", "MEDIUM", ["Customer Gateway", "VPN"], "Module 6")

    q(476, "What is an AWS Virtual Private Gateway (VGW)?", "SINGLE_SELECT", 1, [
        ["A", "The VPN concentrator on the AWS side of a Site-to-Site VPN or Direct Connect connection attached to your VPC", True],
        ["B", "An email spam filter on AWS", False],
        ["C", "A dedicated physical firewall shipped to corporate offices", False],
        ["D", "A web browser extension developed by AWS", False]
    ], "A Virtual Private Gateway (VGW) is the virtual VPN concentrator attached to your VPC that serves as the AWS target endpoint for Site-to-Site VPN connections and AWS Direct Connect virtual interfaces.", "Networking", "MEDIUM", ["Virtual Private Gateway", "VPN"], "Module 6")

    q(477, "Which Route 53 health checking feature can automatically redirect traffic away from an unhealthy server to a healthy standby server in another region?", "SINGLE_SELECT", 1, [
        ["A", "DNS Failover Routing with Route 53 Health Checks", True],
        ["B", "EBS volume snapshot cloning", False],
        ["C", "IAM credential cycling", False],
        ["D", "S3 standard versioning", False]
    ], "Route 53 DNS Failover uses periodic health checks against your application endpoints. If the primary endpoint fails health checks, Route 53 automatically updates DNS responses to route users to a healthy backup endpoint.", "Networking", "MEDIUM", ["Route 53", "DNS Failover"], "Module 6")

    q(478, "What does AWS PrivateLink provide?", "SINGLE_SELECT", 1, [
        ["A", "Private, secure connectivity between VPCs, supported AWS services, and on-premises networks without exposing traffic to the public Internet", True],
        ["B", "A free Wi-Fi hotspot in Amazon fulfillment centers", False],
        ["C", "An encrypted peer-to-peer file sharing protocol", False],
        ["D", "A social networking service for cloud architects", False]
    ], "AWS PrivateLink provides private connectivity between VPCs, AWS services, and on-premises networks using interface VPC endpoints and private IP addresses, ensuring traffic never traverses the public Internet.", "Networking", "MEDIUM", ["PrivateLink", "Security"], "Module 6")

    q(479, "Which AWS network service can be paired with Amazon CloudFront to inspect HTTP/HTTPS web requests and block SQL injection and Cross-Site Scripting (XSS) attacks?", "SINGLE_SELECT", 1, [
        ["A", "AWS WAF (Web Application Firewall)", True],
        ["B", "AWS Shield Advanced without rules", False],
        ["C", "AWS Direct Connect", False],
        ["D", "Amazon Route 53 Resolver", False]
    ], "AWS WAF is a web application firewall that lets you monitor HTTP/HTTPS requests forwarded to Amazon CloudFront, Application Load Balancers, or API Gateway, and block attacks such as SQL injection and cross-site scripting (XSS).", "Networking", "EASY", ["WAF", "Web Application Firewall", "CloudFront"], "Module 6")

    q(480, "What is an Internet Gateway (IGW) in Amazon VPC?", "SINGLE_SELECT", 1, [
        ["A", "A horizontally scaled, redundant, highly available VPC component that enables communication between instances in your VPC and the Internet", True],
        ["B", "A physical modem plugged into an EC2 server", False],
        ["C", "An encryption appliance that terminates SSH sessions", False],
        ["D", "A software proxy installed inside the operating system", False]
    ], "An Internet Gateway (IGW) is a horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the Internet without availability risks or bandwidth constraints.", "Networking", "EASY", ["Internet Gateway", "VPC"], "Module 6")

    # -------------------------------------------------------------
    # 6. Storage: S3, EBS, EFS, FSx (CP-481 to CP-510) - 30 questions
    # -------------------------------------------------------------
    q(481, "What type of storage is Amazon Simple Storage Service (Amazon S3)?", "SINGLE_SELECT", 1, [
        ["A", "Object storage", True],
        ["B", "Block storage", False],
        ["C", "File system storage", False],
        ["D", "Tape physical drive", False]
    ], "Amazon S3 is an object storage service that stores data as objects within buckets, providing industry-leading scalability, data availability, security, and performance.", "Storage Services", "EASY", ["S3", "Object Storage"], "Module 5")

    q(482, "What is the designed durability of objects stored in Amazon S3 Standard?", "SINGLE_SELECT", 1, [
        ["A", "99.999999999% (11 9's)", True],
        ["B", "99.9%", False],
        ["C", "95.0%", False],
        ["D", "99.99%", False]
    ], "Amazon S3 Standard is designed to deliver 99.999999999% (11 nines) of data durability over a given year by redundantly storing data across multiple physically separated Availability Zones.", "Storage Services", "EASY", ["S3 Durability", "11 Nines"], "Module 5")

    q(483, "Which Amazon S3 storage class is best suited for data with unknown or changing access patterns, automatically shifting objects between access tiers without operational overhead or retrieval fees?", "SINGLE_SELECT", 1, [
        ["A", "S3 Intelligent-Tiering", True],
        ["B", "S3 Standard-IA", False],
        ["C", "S3 One Zone-IA", False],
        ["D", "S3 Glacier Deep Archive", False]
    ], "Amazon S3 Intelligent-Tiering is the only cloud storage class that delivers automatic cost savings by moving objects between frequent, infrequent, and archive access tiers when access patterns change, with zero retrieval fees.", "Storage Services", "MEDIUM", ["S3 Intelligent-Tiering", "Cost Optimization"], "Module 5")

    q(484, "Which S3 storage class provides the lowest-cost storage in AWS for long-term data retention and compliance archives that can tolerate retrieval times of 9 to 12 hours?", "SINGLE_SELECT", 1, [
        ["A", "Amazon S3 Glacier Deep Archive", True],
        ["B", "Amazon S3 Standard", False],
        ["C", "Amazon S3 One Zone-IA", False],
        ["D", "Amazon S3 Express One Zone", False]
    ], "S3 Glacier Deep Archive is Amazon S3's lowest-cost storage tier, designed for long-term retention and digital preservation of data that is accessed once or twice a year, with retrieval times typically within 12 hours.", "Storage Services", "EASY", ["S3 Glacier Deep Archive", "Archival"], "Module 5")

    q(485, "A company wants to store secondary, easily reproducible backup data at a lower cost than S3 Standard-IA. They do not require multi-AZ redundancy. Which storage class is suitable?", "SINGLE_SELECT", 1, [
        ["A", "Amazon S3 One Zone-IA", True],
        ["B", "Amazon S3 Glacier Instant Retrieval", False],
        ["C", "Amazon S3 Standard", False],
        ["D", "Amazon Elastic File System", False]
    ], "S3 One Zone-IA stores data in a single Availability Zone at a 20% lower cost than S3 Standard-IA. It is ideal for reproducible data or secondary copies that do not require multi-AZ resilience against physical disaster.", "Storage Services", "MEDIUM", ["S3 One Zone-IA", "Single AZ"], "Module 5")

    q(486, "What is the maximum size of a single object that can be stored in an Amazon S3 bucket?", "SINGLE_SELECT", 1, [
        ["A", "5 Terabytes (5 TB)", True],
        ["B", "5 Gigabytes (5 GB)", False],
        ["C", "100 Terabytes", False],
        ["D", "Unlimited size for a single object", False]
    ], "The total volume of data and number of objects in an S3 bucket are unlimited, but individual Amazon S3 objects can range in size from a minimum of 0 bytes up to a maximum of 5 TB.", "Storage Services", "MEDIUM", ["S3 Object Size", "5 TB"], "Module 5")

    q(487, "Which Amazon S3 feature enables you to automatically transition objects between storage classes or expire them after a defined period of time?", "SINGLE_SELECT", 1, [
        ["A", "S3 Lifecycle Policies", True],
        ["B", "S3 Versioning", False],
        ["C", "S3 Object Lock", False],
        ["D", "S3 Batch Operations", False]
    ], "S3 Lifecycle management rules automatically transition objects between different storage classes (e.g., Standard to Standard-IA after 30 days, then to Glacier after 90 days) or expire/delete them to optimize storage costs over time.", "Storage Services", "EASY", ["S3 Lifecycle", "Automation"], "Module 5")

    q(488, "What does Amazon S3 Versioning do?", "SINGLE_SELECT", 1, [
        ["A", "Keeps multiple historical variants of an object in the same bucket, protecting against accidental overwrites or deletions", True],
        ["B", "Upgrades the software version of your EC2 instances", False],
        ["C", "Automatically edits source code repositories", False],
        ["D", "Translates document text into multiple foreign languages", False]
    ], "S3 Versioning preserves, retrieves, and restores every version of every object stored in your Amazon S3 bucket, allowing easy recovery from unintended user actions and application failures.", "Storage Services", "EASY", ["S3 Versioning", "Data Protection"], "Module 5")

    q(489, "Which S3 feature enforces Write Once, Read Many (WORM) storage to prevent objects from being deleted or overwritten for a fixed retention period or indefinitely?", "SINGLE_SELECT", 1, [
        ["A", "S3 Object Lock", True],
        ["B", "S3 Cross-Origin Resource Sharing (CORS)", False],
        ["C", "S3 Multipart Upload", False],
        ["D", "S3 Event Notifications", False]
    ], "S3 Object Lock enables you to store objects using a WORM model. It prevents an object from being deleted or overwritten for a fixed amount of time or indefinitely, helping satisfy regulatory compliance (like SEC Rule 17a-4).", "Storage Services", "MEDIUM", ["S3 Object Lock", "WORM", "Compliance"], "Module 5")

    q(490, "What type of storage is Amazon Elastic Block Store (Amazon EBS)?", "SINGLE_SELECT", 1, [
        ["A", "Persistent block-level storage designed for use with Amazon EC2 instances", True],
        ["B", "Object storage accessed exclusively over public HTTP REST APIs", False],
        ["C", "Shared distributed cloud network file system for thousands of Linux instances", False],
        ["D", "Magnetic tape library for long-term cold storage", False]
    ], "Amazon EBS provides block-level storage volumes for use with EC2 instances. EBS volumes behave like raw, unformatted physical hard drives or SSDs that can be formatted with any file system.", "Storage Services", "EASY", ["EBS", "Block Storage"], "Module 5")

    q(491, "Can a standard Amazon EBS volume be attached to an EC2 instance in a different Availability Zone from where the volume was created?", "SINGLE_SELECT", 1, [
        ["A", "No, an EBS volume is locked to a specific Availability Zone and can only be attached to instances in that same AZ", True],
        ["B", "Yes, standard EBS volumes can be attached to instances in any AZ or Region", False],
        ["C", "Only if the instance is a Spot Instance", False],
        ["D", "Yes, through AWS Direct Connect", False]
    ], "An EBS volume is physically located in a specific Availability Zone where it is automatically replicated to protect from component failure. To attach it to an EC2 instance, the instance must reside in that exact same AZ.", "Storage Services", "MEDIUM", ["EBS AZ Scope", "AZ Locked"], "Module 5")

    q(492, "How can you migrate or copy an Amazon EBS volume to another Availability Zone or another AWS Region?", "SINGLE_SELECT", 1, [
        ["A", "Take an EBS snapshot (stored in S3), copy the snapshot to the target AZ or Region, and create a new EBS volume from it", True],
        ["B", "Use an FTP connection between the two physical servers", False],
        ["C", "Unplug the physical hard drive and mail it via AWS Snowball", False],
        ["D", "EBS volumes cannot be moved or copied under any circumstances", False]
    ], "EBS Snapshots are point-in-time backups saved to Amazon S3. You can copy snapshots to other Availability Zones or other Regions, and then restore new EBS volumes from those snapshots in the target location.", "Storage Services", "MEDIUM", ["EBS Snapshot", "Volume Migration"], "Module 5")

    q(493, "What is the primary difference between Amazon EBS and EC2 Instance Store?", "SINGLE_SELECT", 1, [
        ["A", "EBS is persistent independent block storage that survives instance stops; Instance Store is temporary ephemeral storage that is wiped when the instance stops", True],
        ["B", "Instance store persists data forever, whereas EBS deletes all data upon instance reboot", False],
        ["C", "EBS is free of charge, while Instance Store is billed per gigabyte per minute", False],
        ["D", "Instance store is an object storage service accessed via REST APIs", False]
    ], "EBS volumes persist independently of the life of an EC2 instance. Instance Store is physically attached to the host computer, providing ultra-low latency, but is ephemeral—data is permanently lost when the instance is stopped or terminated.", "Storage Services", "MEDIUM", ["EBS vs Instance Store", "Persistence"], "Module 5")

    q(494, "Which Amazon EBS volume type is designed for mission-critical, I/O intensive database workloads requiring sub-millisecond latency and sustained IOPS performance?", "SINGLE_SELECT", 1, [
        ["A", "Provisioned IOPS SSD (io2 / io1)", True],
        ["B", "Throughput Optimized HDD (st1)", False],
        ["C", "Cold HDD (sc1)", False],
        ["D", "General Purpose SSD (gp2)", False]
    ], "Provisioned IOPS SSD (io2 Block Express and io1) volumes are engineered to meet the needs of I/O-intensive workloads, particularly mission-critical database workloads sensitive to storage performance and consistency.", "Storage Services", "MEDIUM", ["EBS Volume Types", "Provisioned IOPS"], "Module 5")

    q(495, "Which Amazon EBS volume type offers the lowest-cost HDD storage for infrequently accessed, throughput-oriented big data workloads and log processing?", "SINGLE_SELECT", 1, [
        ["A", "Cold HDD (sc1)", True],
        ["B", "General Purpose SSD (gp3)", False],
        ["C", "Provisioned IOPS SSD (io2)", False],
        ["D", "EBS Magnetic (standard)", False]
    ], "Cold HDD (sc1) volumes provide the lowest-cost magnetic storage for throughput-oriented workloads with large datasets and infrequent access, such as big data cold storage and log consolidation.", "Storage Services", "HARD", ["EBS Volume Types", "Cold HDD"], "Module 5")

    q(496, "What is Amazon Elastic File System (Amazon EFS)?", "SINGLE_SELECT", 1, [
        ["A", "A serverless, fully managed, scalable Network File System (NFS) that can be mounted concurrently by hundreds of Linux EC2 instances across multiple AZs", True],
        ["B", "A Windows-only SMB file server requiring active directory management", False],
        ["C", "A local SSD drive physically connected to an individual motherboard", False],
        ["D", "A cold tape archival service", False]
    ], "Amazon EFS provides a simple, serverless, set-and-forget elastic file system using the NFSv4 protocol. It automatically grows and shrinks as files are added and removed and can be mounted concurrently by thousands of Linux instances.", "Storage Services", "EASY", ["EFS", "Shared File Storage"], "Module 5")

    q(497, "What is the key architectural difference between Amazon EBS and Amazon EFS regarding multi-instance concurrency?", "SINGLE_SELECT", 1, [
        ["A", "Standard EBS volumes are typically mounted by a single instance in a single AZ; EFS can be mounted simultaneously by hundreds of instances across multiple AZs", True],
        ["B", "EBS can be mounted by thousands of instances globally; EFS is strictly locked to one single instance", False],
        ["C", "EFS cannot store files larger than 1 megabyte", False],
        ["D", "EBS is managed file storage, while EFS is raw block storage", False]
    ], "Amazon EBS is block storage designed primarily for a single instance in a single AZ. Amazon EFS is managed file storage (NFS) that can be shared concurrently across hundreds of compute instances running in multiple Availability Zones.", "Storage Services", "MEDIUM", ["EBS vs EFS", "Concurrency"], "Module 5")

    q(498, "Which AWS managed file storage service is optimized for Windows-based applications requiring native SMB protocol support and full Microsoft Active Directory integration?", "SINGLE_SELECT", 1, [
        ["A", "Amazon FSx for Windows File Server", True],
        ["B", "Amazon Elastic File System (EFS)", False],
        ["C", "Amazon S3 Express One Zone", False],
        ["D", "AWS DataSync", False]
    ], "Amazon FSx for Windows File Server provides fully managed shared storage built on Windows Server, delivering full compatibility with Windows SMB protocols, Active Directory integration, NTFS permissions, and DFS.", "Storage Services", "MEDIUM", ["FSx for Windows", "SMB", "Active Directory"], "Module 5")

    q(499, "Which AWS storage service is designed for compute-intensive workloads such as High Performance Computing (HPC), machine learning training, and financial modeling requiring sub-millisecond latency and hundreds of gigabytes per second throughput?", "SINGLE_SELECT", 1, [
        ["A", "Amazon FSx for Lustre", True],
        ["B", "Amazon S3 Glacier Flexible Retrieval", False],
        ["C", "AWS Storage Gateway Volume Gateway", False],
        ["D", "Amazon EBS Cold HDD", False]
    ], "Amazon FSx for Lustre is optimized for fast processing of workloads such as machine learning, high performance computing (HPC), video processing, and financial modeling, delivering million-level IOPS and sub-millisecond latencies.", "Storage Services", "MEDIUM", ["FSx for Lustre", "HPC"], "Module 5")

    q(500, "What is AWS Storage Gateway?", "SINGLE_SELECT", 1, [
        ["A", "A hybrid cloud storage service that gives on-premises applications access to virtually unlimited AWS cloud storage (S3, EBS, Glacier)", True],
        ["B", "A physical revolving turnstile for entering an AWS data center", False],
        ["C", "A web browser plugin for downloading PDFs", False],
        ["D", "A dedicated fiber optic line replacing local telecommunications", False]
    ], "AWS Storage Gateway is a hybrid cloud storage service that connects on-premises software appliances with cloud-based storage, providing seamless and secure data integration between your on-premises IT environment and AWS.", "Storage Services", "MEDIUM", ["Storage Gateway", "Hybrid Storage"], "Module 5")

    q(501, "What are the three primary types of AWS Storage Gateway?", "SINGLE_SELECT", 1, [
        ["A", "S3 File Gateway, Volume Gateway (Stored & Cached volumes), and Tape Gateway", True],
        ["B", "Block Gateway, Container Gateway, and Serverless Gateway", False],
        ["C", "Database Gateway, Compute Gateway, and Monitoring Gateway", False],
        ["D", "Public Gateway, Private Gateway, and Hybrid Gateway", False]
    ], "AWS Storage Gateway offers: 1) S3 File Gateway (file interface to S3), 2) Volume Gateway (cached or stored block volumes backed by EBS snapshots), and 3) Tape Gateway (virtual tape library replacing physical tape drives with S3 Glacier).", "Storage Services", "HARD", ["Storage Gateway Types", "Hybrid"], "Module 5")

    q(502, "Which AWS Snow Family appliance allows you to transfer up to 80 Terabytes of on-premises data to AWS via a ruggedized physical shipping container?", "SINGLE_SELECT", 1, [
        ["A", "AWS Snowball Edge Storage Optimized", True],
        ["B", "AWS Snowcone (8 TB)", False],
        ["C", "AWS Snowmobile (up to 100 PB)", False],
        ["D", "AWS Direct Connect", False]
    ], "AWS Snowball Edge Storage Optimized provides up to 80 TB of usable block storage or S3-compatible object storage in a tamper-resistant, secure physical appliance shipped to your location for offline bulk data transfer.", "Storage Services", "EASY", ["Snowball Edge", "Snow Family"], "Module 5")

    q(503, "Which member of the AWS Snow Family is designed to migrate exabyte-scale data sets (up to 100 Petabytes per unit) using a 45-foot ruggedized shipping container pulled by a semi-trailer truck?", "SINGLE_SELECT", 1, [
        ["A", "AWS Snowmobile", True],
        ["B", "AWS Snowball Edge", False],
        ["C", "AWS Snowcone", False],
        ["D", "AWS Outposts", False]
    ], "AWS Snowmobile is an exabyte-scale data migration service used to move extremely large amounts of data to AWS. A 45-foot long ruggedized shipping container pulled by a semi-trailer truck can transfer up to 100 PB per Snowmobile.", "Storage Services", "EASY", ["Snowmobile", "Exabyte Scale"], "Module 5")

    q(504, "Which AWS Snow Family device is the smallest and most portable, weighing only 4.5 lbs and capable of being deployed in edge or disconnected tactical environments?", "SINGLE_SELECT", 1, [
        ["A", "AWS Snowcone", True],
        ["B", "AWS Snowball", False],
        ["C", "AWS Snowmobile", False],
        ["D", "AWS Storage Gateway", False]
    ], "AWS Snowcone is the smallest member of the AWS Snow Family of edge computing, edge storage, and data transfer devices, weighing 4.5 lbs (2.1 kg) with 8 TB of usable storage.", "Storage Services", "EASY", ["Snowcone", "Edge Device"], "Module 5")

    q(505, "What is S3 Transfer Acceleration?", "SINGLE_SELECT", 1, [
        ["A", "A feature that speeds up long-distance uploads to S3 buckets by routing traffic through AWS Edge Locations over the AWS private network backbone", True],
        ["B", "A tool that physically overclocks hard disk rotational speeds in data centers", False],
        ["C", "A paid expedited delivery service for Snowball appliances", False],
        ["D", "A compression utility that reduces image file sizes by 90%", False]
    ], "Amazon S3 Transfer Acceleration enables fast, easy, and secure transfers of files over long distances between your client and an S3 bucket by routing uploads through Amazon CloudFront's globally distributed Edge Locations.", "Storage Services", "MEDIUM", ["S3 Transfer Acceleration", "Edge"], "Module 5")

    q(506, "Which S3 feature allows you to replicate objects automatically across different AWS accounts and different AWS Regions for disaster recovery?", "SINGLE_SELECT", 1, [
        ["A", "Cross-Region Replication (CRR)", True],
        ["B", "Same-Region Replication (SRR)", False],
        ["C", "S3 Select", False],
        ["D", "S3 Storage Lens", False]
    ], "S3 Cross-Region Replication (CRR) automatically copies objects asynchronously across S3 buckets in different AWS Regions, enabling disaster recovery, compliance, and latency-optimized access for globally distributed users.", "Storage Services", "EASY", ["S3 CRR", "Cross-Region Replication"], "Module 5")

    q(507, "Can Amazon S3 host a static website containing HTML, CSS, JavaScript, and client-side scripts?", "SINGLE_SELECT", 1, [
        ["A", "Yes, S3 natively supports static website hosting without requiring web servers like Apache or NGINX", True],
        ["B", "No, S3 can only store binary backups and raw media files", False],
        ["C", "Only if an EC2 instance is running inside the S3 bucket", False],
        ["D", "Yes, but it requires writing server-side PHP scripts", False]
    ], "Amazon S3 can host static websites (HTML, images, CSS, client-side JavaScript). Static websites do not require server-side technologies (such as PHP, Python, or ASP.NET) and scale automatically to handle millions of visitors.", "Storage Services", "EASY", ["S3 Static Website", "Serverless Hosting"], "Module 5")

    q(508, "What is an S3 Bucket Policy?", "SINGLE_SELECT", 1, [
        ["A", "A resource-based IAM policy attached directly to an S3 bucket that grants permissions to the bucket and its objects", True],
        ["B", "A billing contract signed when creating an AWS account", False],
        ["C", "A legal disclaimer shown to website visitors", False],
        ["D", "A firewall rule configured on a virtual router", False]
    ], "An S3 Bucket Policy is a resource-based policy written in JSON format that you attach directly to an S3 bucket to specify which principals (users, accounts, or services) are allowed or denied actions on the bucket.", "Storage Services", "MEDIUM", ["S3 Bucket Policy", "Resource-Based Policy"], "Module 5")

    q(509, "Which feature in Amazon S3 provides centralized organization-wide visibility into object storage usage, activity trends, and cost-optimization recommendations?", "SINGLE_SELECT", 1, [
        ["A", "Amazon S3 Storage Lens", True],
        ["B", "Amazon S3 Inventory", False],
        ["C", "AWS Artifact", False],
        ["D", "AWS Systems Manager", False]
    ], "Amazon S3 Storage Lens is a cloud storage analytics feature that delivers organization-wide visibility into object storage usage and activity trends, and provides actionable recommendations to optimize costs and security.", "Storage Services", "MEDIUM", ["S3 Storage Lens", "Analytics"], "Module 5")

    q(510, "What is the primary benefit of EBS Elastic Volumes?", "SINGLE_SELECT", 1, [
        ["A", "You can increase volume size, adjust performance (IOPS), and change volume types dynamically on the fly with zero downtime", True],
        ["B", "They stretch physically across multiple server racks using rubber bands", False],
        ["C", "They automatically delete older files when capacity reaches 90%", False],
        ["D", "They are 100% free of charge regardless of volume size", False]
    ], "EBS Elastic Volumes allow you to dynamically modify volume size, IOPS capacity, and volume type on live production volumes without detaching the volume or restarting the EC2 instance, ensuring continuous operations.", "Storage Services", "MEDIUM", ["EBS Elastic Volumes", "Dynamic Sizing"], "Module 5")

    # -------------------------------------------------------------
    # 7. Databases (CP-511 to CP-535) - 25 questions
    # -------------------------------------------------------------
    q(511, "What is Amazon RDS (Relational Database Service)?", "SINGLE_SELECT", 1, [
        ["A", "A managed web service that makes it easy to set up, operate, and scale relational databases in the AWS cloud", True],
        ["B", "A key-value document store for gaming leaderboards", False],
        ["C", "A graph database for mapping social network friendships", False],
        ["D", "A blockchain ledger service for cryptocurrency transactions", False]
    ], "Amazon Relational Database Service (Amazon RDS) makes it easy to set up, operate, and scale relational databases in the cloud, automating time-consuming administrative tasks such as hardware provisioning, database setup, patching, and backups.", "Databases", "EASY", ["RDS", "Relational Database"], "Module 5")

    q(512, "Which relational database engines are supported by Amazon RDS? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "PostgreSQL", True],
        ["B", "MySQL", True],
        ["C", "Apache Cassandra", False],
        ["D", "MongoDB", False],
        ["E", "Redis", False]
    ], "Amazon RDS natively supports six commercial and open-source database engines: Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, and Microsoft SQL Server.", "Databases", "EASY", ["RDS Engines", "PostgreSQL", "MySQL"], "Module 5")

    q(513, "What is Amazon Aurora?", "SINGLE_SELECT", 1, [
        ["A", "An AWS-built MySQL and PostgreSQL-compatible relational database engine built for the cloud that offers up to 5x the throughput of standard MySQL", True],
        ["B", "A cold object storage tier for photos", False],
        ["C", "A real-time text-to-speech AI engine", False],
        ["D", "A virtual private network gateway for branch offices", False]
    ], "Amazon Aurora is a fully managed relational database engine designed for the cloud that is fully compatible with MySQL and PostgreSQL. It delivers up to 5x the throughput of standard MySQL and 3x the throughput of standard PostgreSQL.", "Databases", "EASY", ["Aurora", "Relational Engine"], "Module 5")

    q(514, "How does Amazon Aurora achieve high durability and fault tolerance for stored database data?", "SINGLE_SELECT", 1, [
        ["A", "By maintaining 6 copies of data across 3 Availability Zones automatically", True],
        ["B", "By storing a single copy on a magnetic tape in Virginia", False],
        ["C", "By asking the customer to run manual export scripts daily", False],
        ["D", "By relying on local instance store volumes exclusively", False]
    ], "Amazon Aurora storage is distributed across a fleet of storage nodes, maintaining six copies of your data across three Availability Zones. It continuously backs up your data to Amazon S3 with 99.999999999% durability.", "Databases", "MEDIUM", ["Aurora Storage", "Multi-AZ Replication"], "Module 5")

    q(515, "What is the primary purpose of an Amazon RDS Multi-AZ deployment?", "SINGLE_SELECT", 1, [
        ["A", "High availability and automatic failover in the event of hardware or AZ disruption", True],
        ["B", "Scaling read performance for global analytical queries", False],
        ["C", "Reducing monthly database billing costs by 50%", False],
        ["D", "Providing a public IP address for external web developers", False]
    ], "RDS Multi-AZ deployments synchronously replicate data to a standby database instance in a different Availability Zone. In the event of an infrastructure failure or maintenance, RDS automatically fails over to the standby instance with zero administrative intervention.", "Databases", "EASY", ["RDS Multi-AZ", "High Availability"], "Module 5")

    q(516, "What is the primary purpose of an Amazon RDS Read Replica?", "SINGLE_SELECT", 1, [
        ["A", "Scaling read-heavy database workloads horizontally and offloading reporting queries from the primary database", True],
        ["B", "Providing synchronous automated disaster failover", False],
        ["C", "Encrypting database backups with customer managed keys", False],
        ["D", "Reducing storage volume size automatically", False]
    ], "RDS Read Replicas asynchronously replicate data from the primary DB instance to scale read throughput horizontally for read-heavy database workloads and reporting queries, freeing up the primary instance for write operations.", "Databases", "EASY", ["RDS Read Replica", "Read Scalability"], "Module 5")

    q(517, "What type of database is Amazon DynamoDB?", "SINGLE_SELECT", 1, [
        ["A", "A fully managed NoSQL key-value and document database service", True],
        ["B", "A relational database supporting standard SQL joins and stored procedures", False],
        ["C", "A columnar data warehouse for enterprise business intelligence", False],
        ["D", "A flat text file hosted on an S3 static web bucket", False]
    ], "Amazon DynamoDB is a fully managed NoSQL key-value and document database service that delivers single-digit millisecond performance at any scale, with built-in security, backup and restore, and in-memory caching.", "Databases", "EASY", ["DynamoDB", "NoSQL"], "Module 5")

    q(518, "Which Amazon DynamoDB feature provides a fully managed, in-memory cache that reduces read response times from milliseconds to microseconds?", "SINGLE_SELECT", 1, [
        ["A", "DynamoDB Accelerator (DAX)", True],
        ["B", "Amazon ElastiCache", False],
        ["C", "Amazon Aurora Replicas", False],
        ["D", "AWS Glue Data Catalog", False]
    ], "DynamoDB Accelerator (DAX) is a fully managed, highly available, in-memory cache for Amazon DynamoDB that delivers up to a 10x performance improvement—from milliseconds to microseconds—even at millions of requests per second.", "Databases", "MEDIUM", ["DAX", "DynamoDB Cache", "Microsecond"], "Module 5")

    q(519, "Which AWS service is an in-memory data store and cache service supporting Redis and Memcached engines for fast sub-millisecond retrieval of session data?", "SINGLE_SELECT", 1, [
        ["A", "Amazon ElastiCache", True],
        ["B", "Amazon Redshift", False],
        ["C", "Amazon Neptune", False],
        ["D", "AWS DataSync", False]
    ], "Amazon ElastiCache is a fully managed in-memory data store and caching service compatible with Redis and Memcached engines, enabling applications to retrieve frequently accessed data with sub-millisecond latency.", "Databases", "EASY", ["ElastiCache", "Redis", "In-Memory"], "Module 5")

    q(520, "What is Amazon Redshift?", "SINGLE_SELECT", 1, [
        ["A", "A fast, fully managed, petabyte-scale cloud data warehouse service optimized for complex analytical queries (OLAP)", True],
        ["B", "An in-memory key-value database for real-time mobile chat", False],
        ["C", "A lightweight relational database for basic WordPress blogs", False],
        ["D", "A message queuing service for microservices", False]
    ], "Amazon Redshift is a fast, scalable, fully managed cloud data warehouse that makes it simple and cost-effective to analyze all your data across your data warehouse and data lake using standard SQL and business intelligence tools.", "Databases", "EASY", ["Redshift", "Data Warehouse", "OLAP"], "Module 5")

    q(521, "Which AWS service helps migrate relational databases, non-relational databases, and data warehouses to AWS with minimal application downtime?", "SINGLE_SELECT", 1, [
        ["A", "AWS Database Migration Service (AWS DMS)", True],
        ["B", "AWS Server Migration Service (AWS SMS)", False],
        ["C", "AWS DataSync", False],
        ["D", "AWS Snowball Edge", False]
    ], "AWS Database Migration Service (AWS DMS) helps migrate databases to AWS quickly and securely. The source database remains fully operational during the migration, minimizing downtime to applications that rely on the database.", "Databases", "EASY", ["DMS", "Database Migration"], "Module 5")

    q(522, "When migrating from an on-premises Oracle database to an open-source PostgreSQL database on Amazon Aurora, which tool helps convert the database schema and stored procedures?", "SINGLE_SELECT", 1, [
        ["A", "AWS Schema Conversion Tool (AWS SCT)", True],
        ["B", "AWS Systems Manager Run Command", False],
        ["C", "AWS CloudFormation", False],
        ["D", "AWS X-Ray", False]
    ], "The AWS Schema Conversion Tool (AWS SCT) makes heterogeneous database migrations predictable by automatically converting the source database schema and a majority of the database code (views, stored procedures, and functions) to the target database format.", "Databases", "MEDIUM", ["SCT", "Schema Conversion"], "Module 5")

    q(523, "Which AWS fully managed database service is optimized for storing and navigating highly connected data sets, such as social graphs, fraud detection networks, and knowledge graphs?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Neptune", True],
        ["B", "Amazon DocumentDB", False],
        ["C", "Amazon Timestream", False],
        ["D", "Amazon RDS for SQL Server", False]
    ], "Amazon Neptune is a fast, reliable, fully managed graph database service that makes it easy to build and run applications that work with highly connected datasets, supporting popular graph query models like Apache TinkerPop Gremlin and SPARQL.", "Databases", "MEDIUM", ["Neptune", "Graph Database"], "Module 5")

    q(524, "Which AWS managed database service is compatible with MongoDB workloads, allowing developers to store, query, and index JSON document data?", "SINGLE_SELECT", 1, [
        ["A", "Amazon DocumentDB (with MongoDB compatibility)", True],
        ["B", "Amazon Redshift", False],
        ["C", "Amazon Quantum Ledger Database (QLDB)", False],
        ["D", "Amazon Keyspaces", False]
    ], "Amazon DocumentDB (with MongoDB compatibility) is a scalable, highly durable, and fully managed document database service designed for storing, querying, and indexing JSON data with Apache 2.0 open-source MongoDB API compatibility.", "Databases", "MEDIUM", ["DocumentDB", "MongoDB"], "Module 5")

    q(525, "Which AWS managed database service provides an immutable, cryptographically verifiable transaction log owned by a central trusted authority?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Quantum Ledger Database (Amazon QLDB)", True],
        ["B", "Amazon DynamoDB", False],
        ["C", "Amazon Managed Blockchain", False],
        ["D", "Amazon Aurora Serverless", False]
    ], "Amazon QLDB is a fully managed ledger database that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority, ideal for tracking financial transactions and audit trails.", "Databases", "MEDIUM", ["QLDB", "Ledger", "Immutable"], "Module 5")

    q(526, "Which AWS database service is purpose-built for collecting, storing, and processing time-series data such as IoT sensor metrics and industrial telemetry at scale?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Timestream", True],
        ["B", "Amazon RDS", False],
        ["C", "Amazon SimpleDB", False],
        ["D", "Amazon Keyspaces", False]
    ], "Amazon Timestream is a fast, scalable, and serverless time series database service for IoT and operational applications that makes it easy to store and analyze trillions of events per day up to 1,000 times faster and at 1/10th the cost of relational databases.", "Databases", "MEDIUM", ["Timestream", "Time Series", "IoT"], "Module 5")

    q(527, "Which AWS database service is a managed, scalable, and serverless Apache Cassandra-compatible database service?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Keyspaces (for Apache Cassandra)", True],
        ["B", "Amazon Redshift Spectrum", False],
        ["C", "Amazon ElastiCache for Memcached", False],
        ["D", "Amazon DynamoDB Streams", False]
    ], "Amazon Keyspaces (for Apache Cassandra) is a scalable, highly available, and managed Apache Cassandra-compatible database service. You can run Cassandra workloads on AWS using the same Cassandra application code and developer tools.", "Databases", "HARD", ["Keyspaces", "Cassandra"], "Module 5")

    q(528, "In the AWS Shared Responsibility Model for Amazon RDS, which task is the responsibility of AWS? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Applying operating system patches to the database server host", True],
        ["B", "Performing underlying hardware maintenance and power management", True],
        ["C", "Designing database tables and defining relational foreign key constraints", False],
        ["D", "Authoring optimized SQL SELECT and INSERT queries", False],
        ["E", "Managing application user authentication passwords inside the database", False]
    ], "Under the Shared Responsibility Model for RDS, AWS manages the underlying hardware, power, facility, physical infrastructure, operating system installation, and OS/DB engine security patching. The customer is responsible for schema design, queries, and data.", "Databases", "MEDIUM", ["RDS Shared Responsibility", "Managed Service"], "Module 5")

    q(529, "What happens during an automated failover of an Amazon RDS Multi-AZ deployment?", "SINGLE_SELECT", 1, [
        ["A", "RDS flips the canonical DNS name record of the DB instance to point to the standby DB instance in the secondary AZ", True],
        ["B", "The application must change its database connection string IP address in code manually", False],
        ["C", "All database tables are dropped and rebuilt from S3 backup archives", False],
        ["D", "The primary instance is moved to an on-premises data center", False]
    ], "During failover, Amazon RDS automatically flips the canonical DNS name record (CNAME) of the DB instance to point to the standby DB instance in the secondary AZ, allowing the application to reconnect without code modifications.", "Databases", "HARD", ["RDS Failover", "DNS Endpoint"], "Module 5")

    q(530, "What is Amazon Aurora Serverless?", "SINGLE_SELECT", 1, [
        ["A", "An on-demand, autoscaling configuration for Amazon Aurora where the database automatically starts up, scales compute capacity up or down based on application demand, and shuts down when idle", True],
        ["B", "A database that does not store any data", False],
        ["C", "A database that only runs on customer mobile devices", False],
        ["D", "A free version of MySQL that has no security encryption", False]
    ], "Amazon Aurora Serverless is an on-demand, autoscaling configuration for Amazon Aurora. It automatically starts up, shuts down, and scales capacity up or down based on your application's needs, billing only for database capacity consumed.", "Databases", "MEDIUM", ["Aurora Serverless", "Autoscaling"], "Module 5")

    q(531, "Which Amazon DynamoDB feature allows you to replicate tables automatically across multiple AWS Regions for global high availability and local low-latency reads?", "SINGLE_SELECT", 1, [
        ["A", "DynamoDB Global Tables", True],
        ["B", "DynamoDB Streams", False],
        ["C", "DynamoDB Local", False],
        ["D", "DynamoDB Point-in-Time Recovery", False]
    ], "DynamoDB Global Tables builds upon DynamoDB's global footprint to provide fully managed, multi-Region, and multi-active replication, delivering fast local read and write performance for massive global applications.", "Databases", "MEDIUM", ["Global Tables", "DynamoDB Multi-Region"], "Module 5")

    q(532, "What is Amazon DynamoDB Point-in-Time Recovery (PITR)?", "SINGLE_SELECT", 1, [
        ["A", "Continuous automatic backups that allow you to restore table data to any single second in the past 35 days", True],
        ["B", "A tool that restores code commits from Git history", False],
        ["C", "A billing refund feature for unused capacity", False],
        ["D", "A snapshot tool that only runs on New Year's Day", False]
    ], "Point-in-time recovery (PITR) provides continuous backups of your DynamoDB table data. When enabled, you can restore that table to any point in time from the past 35 days down to the exact second.", "Databases", "MEDIUM", ["DynamoDB PITR", "Backup"], "Module 5")

    q(533, "A business intelligence team needs to run complex aggregation queries across petabytes of historical sales data once a week. Which database engine is purpose-built for this workload?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Redshift", True],
        ["B", "Amazon DynamoDB", False],
        ["C", "Amazon ElastiCache for Memcached", False],
        ["D", "Amazon RDS for MariaDB with micro instance", False]
    ], "Amazon Redshift is a columnar OLAP data warehouse engineered for complex analytical aggregations across huge datasets (terabytes to petabytes), whereas OLTP engines like RDS or DynamoDB are designed for row-based transactional operations.", "Databases", "MEDIUM", ["Redshift", "OLAP", "Analytics"], "Module 5")

    q(534, "Which AWS service is an interactive query service that makes it easy to analyze data directly in Amazon S3 using standard SQL without needing to load the data into a database?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Athena", True],
        ["B", "Amazon Redshift", False],
        ["C", "Amazon Aurora", False],
        ["D", "Amazon DocumentDB", False]
    ], "Amazon Athena is a serverless interactive query service that makes it simple to analyze data directly in Amazon S3 using standard SQL. You pay only for the queries that you run (per TB of data scanned).", "Databases", "EASY", ["Athena", "Serverless SQL", "S3 Query"], "Module 5")

    q(535, "What is the primary benefit of columnar data storage used by Amazon Redshift compared to traditional row-oriented storage used by Amazon RDS?", "SINGLE_SELECT", 1, [
        ["A", "Columnar storage drastically reduces disk I/O requirements by reading only the specific columns referenced in an analytical SQL query", True],
        ["B", "Columnar storage eliminates the need for primary keys in web shopping carts", False],
        ["C", "Columnar storage allows data to be edited directly in Microsoft Word", False],
        ["D", "Columnar storage prevents data from being stored on hard drives", False]
    ], "Columnar storage organizes data on disk by columns rather than rows. For analytical queries that calculate aggregates (e.g., SUM or AVG) across a few columns over millions of rows, columnar storage only reads relevant columns, drastically reducing I/O.", "Databases", "HARD", ["Columnar Storage", "Redshift", "OLAP vs OLTP"], "Module 5")

    # -------------------------------------------------------------
    # 8. Management, Monitoring & Automation (CP-536 to CP-555) - 20 questions
    # -------------------------------------------------------------
    q(536, "What is Amazon CloudWatch?", "SINGLE_SELECT", 1, [
        ["A", "A monitoring and management service that collects operational metrics, logs, and alarms from AWS resources and applications", True],
        ["B", "A physical digital wristwatch shipped to AWS developers", False],
        ["C", "A security camera streaming service for smart homes", False],
        ["D", "A video conferencing client for team standups", False]
    ], "Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS, hybrid, and on-premises applications and infrastructure resources through metrics, logs, and automated alarms.", "Management & Monitoring", "EASY", ["CloudWatch", "Monitoring"], "Module 7")

    q(537, "What is AWS CloudTrail?", "SINGLE_SELECT", 1, [
        ["A", "A governance and auditing service that records account activity and API calls made across your AWS infrastructure", True],
        ["B", "A guided nature walking tour organized by Amazon", False],
        ["C", "A network routing protocol replacing BGP", False],
        ["D", "A billing forecast spreadsheet tool", False]
    ], "AWS CloudTrail records AWS account activity and tracks API calls made via the Management Console, AWS SDKs, and command-line tools. It provides event history of actions taken (who did what, when, and from where).", "Management & Monitoring", "EASY", ["CloudTrail", "Auditing", "Governance"], "Module 7")

    q(538, "What is the key difference between Amazon CloudWatch and AWS CloudTrail?", "SINGLE_SELECT", 1, [
        ["A", "CloudWatch focuses on resource performance metrics and application logs; CloudTrail focuses on API call auditing and user activity tracking", True],
        ["B", "CloudWatch is only used for billing, while CloudTrail is only used for databases", False],
        ["C", "CloudWatch records video of users, while CloudTrail is a text chat tool", False],
        ["D", "There is no difference between the two services", False]
    ], "Amazon CloudWatch monitors resource performance, system health, operational metrics (CPU, disk, network), and application logs. AWS CloudTrail audits management and API activity, recording who made API calls, from which IP, and at what time.", "Management & Monitoring", "EASY", ["CloudWatch vs CloudTrail", "Comparison"], "Module 7")

    q(539, "An engineer needs to receive an SMS or email notification whenever an EC2 instance's CPU utilization exceeds 85% for five consecutive minutes. Which combination of services achieves this?", "SINGLE_SELECT", 1, [
        ["A", "Amazon CloudWatch Alarm and Amazon Simple Notification Service (Amazon SNS)", True],
        ["B", "AWS CloudTrail and AWS Artifact", False],
        ["C", "AWS Direct Connect and Amazon S3 Glacier", False],
        ["D", "AWS Systems Manager and AWS Snowcone", False]
    ], "You configure a CloudWatch Alarm to evaluate the CPUUtilization metric against an 85% threshold over a 5-minute period. When the alarm transitions to ALARM state, it publishes a notification to an Amazon SNS topic, sending an email or SMS.", "Management & Monitoring", "MEDIUM", ["CloudWatch Alarm", "SNS", "Notifications"], "Module 7")

    q(540, "What is AWS Config?", "SINGLE_SELECT", 1, [
        ["A", "A service that enables you to assess, audit, and evaluate the configurations of your AWS resources and monitor compliance against rules", True],
        ["B", "A text editor for writing Python scripts", False],
        ["C", "A service for ordering server hardware from third parties", False],
        ["D", "An automated code compiler for C++", False]
    ], "AWS Config continuously monitors and records your AWS resource configurations and allows you to automate the evaluation of recorded configurations against desired configurations and compliance rules.", "Management & Monitoring", "MEDIUM", ["AWS Config", "Compliance", "Governance"], "Module 7")

    q(541, "An auditor needs to verify whether all Amazon S3 buckets in an AWS account have server-side encryption enabled at all times. Which AWS service can continuously evaluate this compliance rule?", "SINGLE_SELECT", 1, [
        ["A", "AWS Config", True],
        ["B", "AWS X-Ray", False],
        ["C", "Amazon CloudWatch Synthetics", False],
        ["D", "Amazon Route 53", False]
    ], "AWS Config provides managed rules (such as s3-bucket-server-side-encryption-enabled) that continuously evaluate the configuration settings of AWS resources and flag non-compliant resources in real time.", "Management & Monitoring", "MEDIUM", ["AWS Config Rules", "S3 Encryption"], "Module 7")

    q(542, "What is AWS CloudFormation?", "SINGLE_SELECT", 1, [
        ["A", "An Infrastructure as Code (IaC) service that lets you model, provision, and manage AWS and third-party resources using JSON or YAML templates", True],
        ["B", "A meteorological storm warning service", False],
        ["C", "A drag-and-drop website design builder", False],
        ["D", "A tool for configuring home broadband routers", False]
    ], "AWS CloudFormation allows you to treat Infrastructure as Code (IaC). You describe all your desired AWS resources (EC2, VPC, S3) in a declarative JSON or YAML template, and CloudFormation provisions and configures them reliably and repeatably.", "Management & Monitoring", "EASY", ["CloudFormation", "IaC", "Templates"], "Module 7")

    q(543, "What is a CloudFormation Stack?", "SINGLE_SELECT", 1, [
        ["A", "A collection of AWS resources that you can manage as a single unified unit, created, updated, or deleted via a CloudFormation template", True],
        ["B", "A physical stack of server blades in a server rack", False],
        ["C", "A list of customer credit card transactions", False],
        ["D", "A memory buffer inside the CPU", False]
    ], "A CloudFormation Stack is a collection of AWS resources that you manage as a single unit. You can create, update, or delete a collection of resources by creating, updating, or deleting stacks using CloudFormation templates.", "Management & Monitoring", "MEDIUM", ["CloudFormation Stack", "IaC"], "Module 7")

    q(544, "What is AWS Elastic Beanstalk?", "SINGLE_SELECT", 1, [
        ["A", "A Platform as a Service (PaaS) that makes it easy to deploy, run, and scale web applications and services without configuring underlying infrastructure", True],
        ["B", "A serverless distributed database engine", False],
        ["C", "An agricultural forecasting software tool", False],
        ["D", "A hardware network switch installed in corporate data centers", False]
    ], "AWS Elastic Beanstalk is an easy-to-use Platform as a Service (PaaS) for deploying and scaling web applications and services developed with Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker on familiar servers like Apache and Nginx.", "Management & Monitoring", "EASY", ["Elastic Beanstalk", "PaaS"], "Module 7")

    q(545, "How does AWS Elastic Beanstalk differ from AWS CloudFormation?", "SINGLE_SELECT", 1, [
        ["A", "Beanstalk focuses specifically on deploying application code (PaaS) with automated environment provisioning; CloudFormation provides low-level Infrastructure as Code control across virtually all AWS resources", True],
        ["B", "Beanstalk requires writing JSON templates; CloudFormation is only managed via phone calls", False],
        ["C", "CloudFormation cannot create EC2 instances", False],
        ["D", "Beanstalk is only for offline mobile apps", False]
    ], "Elastic Beanstalk is a Platform as a Service designed for web developers to deploy code without worrying about infrastructure provisioning. CloudFormation is an Infrastructure as Code engine providing granular control over all AWS resource definitions.", "Management & Monitoring", "MEDIUM", ["Beanstalk vs CloudFormation", "PaaS vs IaC"], "Module 7")

    q(546, "What is AWS Systems Manager (SSM)?", "SINGLE_SELECT", 1, [
        ["A", "A centralized operations hub for visibility and control of your AWS resources, automating operational tasks and patch management across cloud and on-premises servers", True],
        ["B", "A human resources portal for hiring Amazon employees", False],
        ["C", "A computer motherboard firmware update tool", False],
        ["D", "A physical inventory barcode scanner", False]
    ], "AWS Systems Manager gives you visibility and control of your infrastructure on AWS. It provides a unified user interface so you can view operational data from multiple AWS services and automate operational tasks across your resources.", "Management & Monitoring", "MEDIUM", ["Systems Manager", "SSM", "Operations"], "Module 7")

    q(547, "Which capability of AWS Systems Manager allows administrators to securely manage EC2 instances through an interactive one-click browser-based shell or CLI without opening inbound SSH ports or managing bastion hosts?", "SINGLE_SELECT", 1, [
        ["A", "Session Manager", True],
        ["B", "Run Command", False],
        ["C", "Patch Manager", False],
        ["D", "Inventory", False]
    ], "Systems Manager Session Manager provides secure and auditable instance management without needing to open inbound ports, maintain bastion hosts, or manage SSH keys. Connections are routed over HTTPS via the SSM Agent.", "Management & Monitoring", "MEDIUM", ["Session Manager", "SSH Alternative"], "Module 7")

    q(548, "Which capability of AWS Systems Manager provides secure, hierarchical storage for configuration data management and secrets management (such as database passwords and API keys)?", "SINGLE_SELECT", 1, [
        ["A", "AWS Systems Manager Parameter Store", True],
        ["B", "AWS Key Management Service (AWS KMS) console", False],
        ["C", "AWS CloudTrail insights", False],
        ["D", "Amazon S3 Glacier Vault", False]
    ], "Systems Manager Parameter Store provides secure, hierarchical storage for configuration data management and secrets management. You can store data such as passwords, database strings, and license codes as plain text or encrypted data.", "Management & Monitoring", "MEDIUM", ["Parameter Store", "SSM", "Configuration"], "Module 7")

    q(549, "What is AWS X-Ray?", "SINGLE_SELECT", 1, [
        ["A", "A service that helps developers analyze and debug distributed applications, such as those built using a microservices architecture", True],
        ["B", "A medical imaging archive for radiological DICOM scans", False],
        ["C", "A physical scanner for baggage at AWS data centers", False],
        ["D", "A network penetration testing tool", False]
    ], "AWS X-Ray helps developers analyze and debug production, distributed applications, such as those built using a microservices architecture. It generates end-to-end service maps showing request paths and latency bottlenecks.", "Management & Monitoring", "EASY", ["X-Ray", "Distributed Tracing", "Microservices"], "Module 7")

    q(550, "What is the AWS Health Dashboard (Personal Health Dashboard)?", "SINGLE_SELECT", 1, [
        ["A", "A dashboard that provides personalized alerts and guidance when AWS is experiencing events that may affect your specific account resources", True],
        ["B", "A wearable fitness monitor integration service", False],
        ["C", "An employee medical insurance claim portal", False],
        ["D", "A global list showing whether general public websites are online", False]
    ], "The AWS Health Dashboard (formerly Personal Health Dashboard) provides personalized information about events that can affect your specific AWS account and resources, alerting you to performance disruptions or scheduled maintenance.", "Management & Monitoring", "EASY", ["Health Dashboard", "Personal Health Dashboard"], "Module 7")

    q(551, "How does the AWS Health Dashboard differ from the general AWS Service Health Dashboard?", "SINGLE_SELECT", 1, [
        ["A", "The Service Health Dashboard displays the general status of AWS services globally; the Personal Health Dashboard displays events that specifically impact your account's provisioned resources", True],
        ["B", "The Personal Health Dashboard costs $10,000/month; the Service Health Dashboard is free", False],
        ["C", "The Service Health Dashboard requires an Enterprise Support plan", False],
        ["D", "There is no difference between them", False]
    ], "The AWS Service Health Dashboard displays the general operational status of all AWS services across all public Regions worldwide. The AWS Health Dashboard (Personal) gives proactive, targeted notifications tailored to your specific account resources.", "Management & Monitoring", "MEDIUM", ["Service Health vs Personal Health", "Comparison"], "Module 7")

    q(552, "What is AWS OpsWorks?", "SINGLE_SELECT", 1, [
        ["A", "A configuration management service that provides managed instances of Chef and Puppet to automate server configuration using code", True],
        ["B", "An enterprise email and calendar server", False],
        ["C", "A desktop publishing application", False],
        ["D", "A video rendering pipeline for Hollywood films", False]
    ], "AWS OpsWorks is a configuration management service that helps you use Chef and Puppet to configure and operate applications in your cloud enterprise, automating server deployment, patching, and configuration management.", "Management & Monitoring", "MEDIUM", ["OpsWorks", "Chef", "Puppet"], "Module 7")

    q(553, "Which AWS service allows you to define application infrastructure in familiar programming languages such as TypeScript, Python, Java, and C#, generating CloudFormation templates automatically?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cloud Development Kit (AWS CDK)", True],
        ["B", "AWS Serverless Application Model (AWS SAM)", False],
        ["C", "AWS CodeStar", False],
        ["D", "AWS App Mesh", False]
    ], "The AWS Cloud Development Kit (AWS CDK) is an open-source software development framework to define cloud application resources using familiar programming languages (TypeScript, Python, Java, C#), synthesizing them into CloudFormation.", "Management & Monitoring", "MEDIUM", ["CDK", "Infrastructure as Code"], "Module 7")

    q(554, "What is CloudWatch Logs Insights?", "SINGLE_SELECT", 1, [
        ["A", "An interactive query engine that allows you to search and analyze log data stored in Amazon CloudWatch Logs using a purpose-built query language", True],
        ["B", "A service that posts system logs to public social media accounts", False],
        ["C", "A tool that converts system logs into audio podcasts", False],
        ["D", "An encryption service for physical tape drives", False]
    ], "CloudWatch Logs Insights enables you to interactively search and analyze your log data in Amazon CloudWatch Logs. You can perform queries with aggregations, filters, and regular expressions to quickly troubleshoot operational issues.", "Management & Monitoring", "MEDIUM", ["Logs Insights", "CloudWatch", "Troubleshooting"], "Module 7")

    q(555, "What type of CloudWatch metric is NOT collected by default from Amazon EC2 instances unless a CloudWatch agent is installed inside the operating system?", "SINGLE_SELECT", 1, [
        ["A", "Memory (RAM) utilization and available disk space", True],
        ["B", "CPU utilization", False],
        ["C", "Network bytes in and network bytes out", False],
        ["D", "Disk read/write bytes for instance hypervisor metrics", False]
    ], "Hypervisor-level metrics like CPU utilization, network traffic, and disk I/O are tracked by default. Internal OS metrics such as memory (RAM) consumption and disk space utilization require the CloudWatch unified agent inside the guest OS.", "Management & Monitoring", "HARD", ["CloudWatch Metrics", "RAM Utilization", "Agent"], "Module 7")

    # -------------------------------------------------------------
    # 9. Application Integration & Messaging (CP-556 to CP-572) - 17 questions
    # -------------------------------------------------------------
    q(556, "What is Amazon Simple Queue Service (Amazon SQS)?", "SINGLE_SELECT", 1, [
        ["A", "A fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications", True],
        ["B", "A real-time live video streaming server", False],
        ["C", "A database engine for storing employee phone numbers", False],
        ["D", "A physical printer spooler for AWS offices", False]
    ], "Amazon SQS is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications. Messages are stored reliably until processed and deleted by consumer applications.", "Application Integration", "EASY", ["SQS", "Decoupling", "Message Queue"], "Module 8")

    q(557, "What is the primary difference between SQS Standard queues and SQS FIFO queues?", "SINGLE_SELECT", 1, [
        ["A", "Standard queues offer nearly unlimited throughput with best-effort ordering and at-least-once delivery; FIFO queues guarantee exact First-In-First-Out ordering and exactly-once processing", True],
        ["B", "Standard queues cost $1,000 per message; FIFO queues are free", False],
        ["C", "FIFO queues only support video files", False],
        ["D", "Standard queues delete messages immediately after receipt without consumer processing", False]
    ], "SQS Standard queues provide unlimited throughput, best-effort ordering, and at-least-once delivery. SQS FIFO (First-In, First-Out) queues guarantee that messages are delivered exactly once and processed in the exact order that they are sent.", "Application Integration", "MEDIUM", ["SQS FIFO", "SQS Standard", "Message Ordering"], "Module 8")

    q(558, "What is the purpose of the Visibility Timeout in Amazon SQS?", "SINGLE_SELECT", 1, [
        ["A", "The period of time during which SQS prevents other consumers from receiving and processing a message that has already been retrieved by one consumer", True],
        ["B", "The time it takes for an administrator's screen to turn off due to inactivity", False],
        ["C", "The duration an S3 object remains public on the web", False],
        ["D", "The timeout before an EC2 instance is terminated during billing audits", False]
    ], "When a consumer receives a message from an SQS queue, the message remains in the queue while the consumer processes it. The Visibility Timeout prevents other consumers from seeing and processing the same message concurrently.", "Application Integration", "MEDIUM", ["SQS", "Visibility Timeout"], "Module 8")

    q(559, "What is an SQS Dead-Letter Queue (DLQ)?", "SINGLE_SELECT", 1, [
        ["A", "A designated queue to which messages are automatically moved if consumer applications fail to process them successfully after a maximum number of attempts", True],
        ["B", "A queue that stores unroutable postal letters sent to Amazon headquarters", False],
        ["C", "A queue used exclusively for deleted user accounts", False],
        ["D", "An archived queue stored in cold tape storage", False]
    ], "A Dead-Letter Queue (DLQ) is a queue that other source queues can target to isolate messages that cannot be processed successfully (poison pill messages) after a designated maximum number of receive attempts.", "Application Integration", "MEDIUM", ["Dead-Letter Queue", "DLQ", "SQS"], "Module 8")

    q(560, "What is Amazon Simple Notification Service (Amazon SNS)?", "SINGLE_SELECT", 1, [
        ["A", "A fully managed pub/sub messaging and notification service for both application-to-application (A2A) and application-to-person (A2P) communication", True],
        ["B", "A desktop push notification blocker for web browsers", False],
        ["C", "A hardware bell installed in corporate security rooms", False],
        ["D", "A social networking mobile app", False]
    ], "Amazon SNS is a fully managed pub/sub service. Publishers send messages to topics, and subscribers (such as AWS Lambda, Amazon SQS, HTTP endpoints, mobile SMS, email) receive notifications instantly.", "Application Integration", "EASY", ["SNS", "PubSub", "Notifications"], "Module 8")

    q(561, "How does Amazon SQS differ from Amazon SNS in terms of message delivery communication patterns?", "SINGLE_SELECT", 1, [
        ["A", "SQS uses a pull-based (polling) message queue model; SNS uses a push-based publisher/subscriber fan-out model", True],
        ["B", "SQS sends messages to mobile phones; SNS is strictly an on-premises database", False],
        ["C", "SNS requires consumers to continually poll for new messages", False],
        ["D", "There is no architectural difference between them", False]
    ], "SQS uses a pull model where consumers actively poll the queue to retrieve and delete messages. SNS uses a push model where messages published to a topic are immediately fanned out and pushed to all registered subscribers.", "Application Integration", "MEDIUM", ["SQS vs SNS", "Pull vs Push"], "Module 8")

    q(562, "What is the SNS Fanout architectural pattern?", "SINGLE_SELECT", 1, [
        ["A", "A message published to an SNS topic is replicated and pushed to multiple subscribed Amazon SQS queues for parallel, asynchronous processing by independent microservices", True],
        ["B", "Spreading hardware cooling fans across multiple server racks", False],
        ["C", "Distributing customer support tickets to overseas call centers", False],
        ["D", "Broadcasting unencrypted passwords to all IAM users", False]
    ], "The Fanout pattern occurs when a message published to an SNS topic is immediately distributed to multiple SQS queues in parallel. This enables decoupled microservices to perform different processing tasks simultaneously on the same message.", "Application Integration", "MEDIUM", ["Fanout", "SNS", "SQS", "Decoupling"], "Module 8")

    q(563, "What is Amazon EventBridge?", "SINGLE_SELECT", 1, [
        ["A", "A serverless event bus service that makes it easy to connect applications using data from your own applications, integrated SaaS applications, and AWS services", True],
        ["B", "A physical suspension bridge constructed near Amazon facilities", False],
        ["C", "A software protocol for connecting Bluetooth speakers", False],
        ["D", "A calendar scheduling assistant for executive meetings", False]
    ], "Amazon EventBridge is a serverless event bus that ingests data from your applications, third-party SaaS partners (like Datadog, Zendesk, Salesforce), and AWS services, routing events to targets based on declarative rules.", "Application Integration", "MEDIUM", ["EventBridge", "Event Bus", "Serverless"], "Module 8")

    q(564, "Which AWS service is an open-source compatible managed message broker for Apache ActiveMQ and RabbitMQ, helping companies migrate legacy message queues without rewriting application code?", "SINGLE_SELECT", 1, [
        ["A", "Amazon MQ", True],
        ["B", "Amazon SQS", False],
        ["C", "Amazon Kinesis", False],
        ["D", "Amazon SimpleDB", False]
    ], "Amazon MQ is a managed message broker service for Apache ActiveMQ and RabbitMQ. It makes it easy to migrate message brokers to the cloud without rewriting your messaging code by supporting industry-standard protocols (JMS, NMS, AMQP, STOMP, MQTT).", "Application Integration", "MEDIUM", ["Amazon MQ", "ActiveMQ", "RabbitMQ"], "Module 8")

    q(565, "What is Amazon Simple Email Service (Amazon SES)?", "SINGLE_SELECT", 1, [
        ["A", "A cost-effective, flexible, and scalable email service that enables developers to send transactional, marketing, or mass email communications", True],
        ["B", "An internal corporate webmail client replacing Microsoft Outlook", False],
        ["C", "An email spam filter deployed on physical office servers", False],
        ["D", "A paper postal mailing service managed by Amazon", False]
    ], "Amazon Simple Email Service (Amazon SES) is an email platform that provides an easy, cost-effective way for you to send and receive email using your own email addresses and domains for transactional and marketing messages.", "Application Integration", "EASY", ["SES", "Email Service"], "Module 8")

    q(566, "What is Amazon Kinesis Data Streams?", "SINGLE_SELECT", 1, [
        ["A", "A massively scalable and durable real-time data streaming service that can capture gigabytes of data per second from hundreds of thousands of sources", True],
        ["B", "A water cooling monitoring system in data centers", False],
        ["C", "A file compression format used for S3 archives", False],
        ["D", "A desktop tool for converting audio files", False]
    ], "Amazon Kinesis Data Streams is a scalable real-time streaming service that continuously captures gigabytes of data per second from hundreds of thousands of sources (such as financial transactions, IoT telemetry, social media feeds, and clickstreams).", "Application Integration", "MEDIUM", ["Kinesis", "Data Streams", "Real-Time"], "Module 8")

    q(567, "Which member of the Amazon Kinesis family easily captures, transforms, and automatically loads streaming data into Amazon S3, Amazon Redshift, and OpenSearch with minimal configuration?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Data Firehose (formerly Kinesis Data Firehose)", True],
        ["B", "Amazon Kinesis Video Streams", False],
        ["C", "AWS Glue DataBrew", False],
        ["D", "Amazon SQS FIFO", False]
    ], "Amazon Data Firehose is the easiest way to reliably load streaming data into data lakes, warehouses, and analytics services. It captures, transforms, and loads streaming data into Amazon S3, Amazon Redshift, and OpenSearch automatically.", "Application Integration", "MEDIUM", ["Data Firehose", "Kinesis", "ETL Loading"], "Module 8")

    q(568, "What is AWS AppSync?", "SINGLE_SELECT", 1, [
        ["A", "A fully managed enterprise GraphQL and Pub/Sub API service that simplifies application development by connecting applications to data and events", True],
        ["B", "A file synchronization client for syncing desktop folders with S3", False],
        ["C", "An automatic smartphone battery charging station", False],
        ["D", "A tool for merging Git branches across accounts", False]
    ], "AWS AppSync is a fully managed service that makes it easy to develop GraphQL and real-time Pub/Sub APIs that connect applications to data sources (such as Amazon DynamoDB, AWS Lambda, and HTTP APIs).", "Application Integration", "HARD", ["AppSync", "GraphQL"], "Module 8")

    q(569, "What is Amazon API Gateway?", "SINGLE_SELECT", 1, [
        ["A", "A fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure RESTful and WebSocket APIs at any scale", True],
        ["B", "A physical gateway turnstile in an office reception area", False],
        ["C", "A domain name registrar for registering .com domains", False],
        ["D", "A hardware firewall appliance for home internet connections", False]
    ], "Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. It acts as the 'front door' for applications to access data, business logic, or backend services.", "Application Integration", "EASY", ["API Gateway", "REST", "WebSocket"], "Module 8")

    q(570, "How does Amazon SQS Long Polling reduce application costs compared to Short Polling?", "SINGLE_SELECT", 1, [
        ["A", "Long polling allows the SQS service to wait up to 20 seconds for a message to arrive in the queue before sending an empty response, eliminating empty responses and reducing API call charges", True],
        ["B", "Long polling compresses message sizes by 99%", False],
        ["C", "Long polling allows messages to be sent for free on weekends", False],
        ["D", "Long polling deletes all messages without reading them", False]
    ], "Long polling helps reduce the cost of using SQS by eliminating empty responses when there are no messages available and reducing false empty responses. It allows the receive call to wait up to 20 seconds for messages to arrive.", "Application Integration", "HARD", ["Long Polling", "SQS Cost"], "Module 8")

    q(571, "Which AWS service is designed for business-to-consumer (B2C) communication, allowing marketers and developers to engage customers across channels like email, SMS, push notifications, and voice?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Pinpoint", True],
        ["B", "AWS Direct Connect", False],
        ["C", "AWS Shield", False],
        ["D", "AWS Systems Manager", False]
    ], "Amazon Pinpoint is a multichannel marketing communication service that you can use to send targeted, personalized messages to customers over channels like email, SMS, mobile push, and in-app messaging.", "Application Integration", "MEDIUM", ["Pinpoint", "Customer Engagement"], "Module 8")

    q(572, "What is the primary benefit of loose coupling in distributed cloud architectures achieved through messaging services like SQS and SNS?", "SINGLE_SELECT", 1, [
        ["A", "Components function independently so that a failure or latency spike in one component does not cascade and crash the entire system", True],
        ["B", "It guarantees that software code never requires testing", False],
        ["C", "It eliminates all software licensing fees completely", False],
        ["D", "It forces all servers to run the identical operating system version", False]
    ], "Loose coupling ensures that components of a system have minimal dependencies on each other. If one component fails or slows down, messages buffer safely in queues, preventing cascading system-wide crashes.", "Application Integration", "EASY", ["Loose Coupling", "Decoupling", "Well-Architected"], "Module 8")

    return questions

if __name__ == "__main__":
    qs = get_d3_questions()
    print(f"Total Domain 3 Questions Generated: {len(qs)}")
    # Verify codes
    expected = [f"CP-{i:03d}" for i in range(352, 573)]
    actual = [q["questionCode"] for q in qs]
    assert len(qs) == 221, f"Expected 221 questions, got {len(qs)}"
    assert expected == actual, "Question codes mismatch!"
    print("All 221 Domain 3 question codes (CP-352 to CP-572) verified successfully!")
