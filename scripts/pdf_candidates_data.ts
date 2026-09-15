// Candidate questions generated from the 12 AWS Cloud Practitioner PDF Learning Modules
// Modules: 01 (Intro), 02 (Compute), 03 (Global Infra), 04 (Networking),
//          05 (Storage & DB), 06 (Security), 07 (Monitoring), 08 (Pricing & Support),
//          09 (Migration & Innovation), 10 (Cloud Journey / Well-Architected),
//          11 (Exam Basics), 12 (Final Assessment)

export interface CandidateQuestion {
  questionCode: string;
  questionText: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  requiredSelections: number;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
  domain: string;
  domainId: number;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  sourceModule: string;
  source: string;
  concept: string;
}

export const PDF_CANDIDATE_QUESTIONS: CandidateQuestion[] = [
  {
    "questionCode": "PDF-M01-001",
    "questionText": "What is the primary benefit of the 'trade upfront expense for variable expense' cloud computing advantage?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Eliminating the need to manage software licenses",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Paying only for computing resources as they are consumed",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Deploying applications globally in minutes",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Removing the need for a corporate IT department",
        "isCorrect": false
      }
    ],
    "explanation": "Trading upfront expense for variable expense allows organizations to avoid massive capital investments in data centers and instead pay only for what they consume as an operational expense.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Cloud Advantages",
    "difficulty": "EASY",
    "tags": [
      "Cloud Economics",
      "Module 1"
    ],
    "sourceModule": "Module 1 - Introduction to Amazon Web Services",
    "source": "Module 01",
    "concept": "Variable Expense"
  },
  {
    "questionCode": "PDF-M01-002",
    "questionText": "An online retail store experiences massive traffic spikes during a holiday sale and traffic lulls during the summer. They want to automatically adjust their server capacity to match these patterns without paying for idle resources. Which AWS benefit does this represent?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Stop guessing capacity",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Go global in minutes",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Increase speed and agility",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Massive economies of scale",
        "isCorrect": false
      }
    ],
    "explanation": "The ability to scale up and down automatically means the customer no longer has to 'guess capacity' and provision for peak loads permanently.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Cloud Advantages",
    "difficulty": "MEDIUM",
    "tags": [
      "Agility",
      "Elasticity",
      "Module 1"
    ],
    "sourceModule": "Module 1 - Introduction to Amazon Web Services",
    "source": "Module 01",
    "concept": "Stop Guessing Capacity"
  },
  {
    "questionCode": "PDF-M01-003",
    "questionText": "A healthcare organization is required to keep its most sensitive patient records in a physically isolated, on-premises data center, but wants to use AWS for its public-facing appointment website. Which cloud deployment model is MOST appropriate?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Private cloud",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Community cloud",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Hybrid cloud",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Public cloud",
        "isCorrect": false
      }
    ],
    "explanation": "A hybrid deployment connects infrastructure and applications between cloud-based resources and existing resources that are not located in the cloud (such as on-premises data centers).",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Deployment Models",
    "difficulty": "MEDIUM",
    "tags": [
      "Hybrid Cloud",
      "Module 1"
    ],
    "sourceModule": "Module 1 - Introduction to Amazon Web Services",
    "source": "Module 01",
    "concept": "Hybrid Deployment"
  },
  {
    "questionCode": "PDF-M01-004",
    "questionText": "Which cloud computing model requires the customer to manage the operating system, database, and applications, while the cloud provider manages the underlying hardware and hypervisor?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Infrastructure as a Service (IaaS)",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Platform as a Service (PaaS)",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Software as a Service (SaaS)",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Function as a Service (FaaS)",
        "isCorrect": false
      }
    ],
    "explanation": "IaaS provides the most flexibility and control, giving the customer access to networking features, computers (virtual or on dedicated hardware), and data storage space. The customer is responsible for patching and managing the OS and applications.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Service Models",
    "difficulty": "EASY",
    "tags": [
      "IaaS",
      "Module 1"
    ],
    "sourceModule": "Module 1 - Introduction to Amazon Web Services",
    "source": "Module 01",
    "concept": "IaaS vs PaaS"
  },
  {
    "questionCode": "PDF-M01-005",
    "questionText": "A startup is deciding between deploying an application on Amazon EC2 (IaaS) or AWS Elastic Beanstalk (PaaS). Which of the following is a primary benefit of choosing the PaaS solution?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Full administrative access to the underlying hardware",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Reduced operational overhead since AWS manages the OS and runtime environment",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "The ability to run custom hypervisors",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Lower overall cost because PaaS is always cheaper than IaaS",
        "isCorrect": false
      }
    ],
    "explanation": "PaaS removes the need for organizations to manage the underlying infrastructure (usually hardware and operating systems) and allows them to focus on the deployment and management of their applications.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Service Models",
    "difficulty": "HARD",
    "tags": [
      "PaaS",
      "IaaS vs PaaS",
      "Module 1"
    ],
    "sourceModule": "Module 1 - Introduction to Amazon Web Services",
    "source": "Module 01",
    "concept": "PaaS Benefits"
  },
  {
    "questionCode": "PDF-M02-001",
    "questionText": "What AWS service provides resizable virtual computing capacity in the cloud?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Lambda",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Elastic Compute Cloud (Amazon EC2)",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Amazon Elastic Container Service (Amazon ECS)",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Fargate",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon EC2 provides secure, resizable compute capacity in the cloud as virtual servers.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Compute",
    "difficulty": "EASY",
    "tags": [
      "EC2",
      "Module 2"
    ],
    "sourceModule": "Module 2 - Compute in the Cloud",
    "source": "Module 02",
    "concept": "EC2 Overview"
  },
  {
    "questionCode": "PDF-M02-002",
    "questionText": "A developer wants to run a short-lived microservice that executes code only when triggered by an S3 event. The developer does not want to provision or manage any servers. Which service should they use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon EC2",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Lambda",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Amazon Lightsail",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Outposts",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Serverless",
    "difficulty": "MEDIUM",
    "tags": [
      "Lambda",
      "Serverless",
      "Module 2"
    ],
    "sourceModule": "Module 2 - Compute in the Cloud",
    "source": "Module 02",
    "concept": "Lambda Application"
  },
  {
    "questionCode": "PDF-M02-003",
    "questionText": "Which Amazon EC2 pricing model offers the MOST significant discount (up to 90%) for fault-tolerant, flexible workloads that can be interrupted?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "On-Demand Instances",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Reserved Instances",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Spot Instances",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Dedicated Hosts",
        "isCorrect": false
      }
    ],
    "explanation": "Spot Instances allow you to request spare Amazon EC2 computing capacity for up to 90% off the On-Demand price. They can be interrupted by AWS with a 2-minute warning, making them ideal for fault-tolerant workloads.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Pricing Models",
    "difficulty": "MEDIUM",
    "tags": [
      "Pricing",
      "Spot Instances",
      "Module 2"
    ],
    "sourceModule": "Module 2 - Compute in the Cloud",
    "source": "Module 02",
    "concept": "Spot Instances"
  },
  {
    "questionCode": "PDF-M02-004",
    "questionText": "An enterprise is migrating a legacy database to AWS. The software vendor requires that the database run on a physical server with a visible, specific physical CPU socket count for licensing purposes. Which EC2 option MUST the enterprise use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "On-Demand Instances",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Dedicated Instances",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Dedicated Hosts",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Savings Plans",
        "isCorrect": false
      }
    ],
    "explanation": "Dedicated Hosts provide a physical EC2 server dedicated for your use, which allows you to use eligible software licenses from vendors such as Microsoft and Oracle that are bound to sockets, cores, or VMs.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Compute Pricing",
    "difficulty": "HARD",
    "tags": [
      "Dedicated Hosts",
      "Licensing",
      "Module 2"
    ],
    "sourceModule": "Module 2 - Compute in the Cloud",
    "source": "Module 02",
    "concept": "Dedicated Hosts"
  },
  {
    "questionCode": "PDF-M02-005",
    "questionText": "When comparing AWS Elastic Beanstalk and AWS CloudFormation, which statement accurately describes the primary difference in their use cases?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Elastic Beanstalk is a serverless database, while CloudFormation is a compute service.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Elastic Beanstalk focuses on simplifying application deployment, while CloudFormation provides complete infrastructure-as-code control over almost all AWS resources.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Elastic Beanstalk uses JSON/YAML templates, while CloudFormation only supports Python.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Elastic Beanstalk is used for billing management, while CloudFormation is used for monitoring.",
        "isCorrect": false
      }
    ],
    "explanation": "Elastic Beanstalk is a PaaS tool focused on quickly deploying web applications, hiding infrastructure complexity. CloudFormation is an Infrastructure-as-Code (IaC) tool that provides granular control over provisioning and managing a vast array of AWS services via templates.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Management and Governance",
    "difficulty": "HARD",
    "tags": [
      "Elastic Beanstalk",
      "CloudFormation",
      "Service Comparison",
      "Module 2"
    ],
    "sourceModule": "Module 2 - Compute in the Cloud",
    "source": "Module 02",
    "concept": "Beanstalk vs CloudFormation"
  },
  {
    "questionCode": "PDF-M03-001",
    "questionText": "What AWS architectural concept consists of one or more discrete data centers with redundant power, networking, and connectivity in an AWS Region?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Edge Location",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Availability Zone",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Outpost",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Local Zone",
        "isCorrect": false
      }
    ],
    "explanation": "An Availability Zone (AZ) consists of one or more discrete data centers, each with redundant power, networking, and connectivity, housed in separate facilities.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Global Infrastructure",
    "difficulty": "EASY",
    "tags": [
      "Availability Zone",
      "Module 3"
    ],
    "sourceModule": "Module 3 - Global Infrastructure and Reliability",
    "source": "Module 03",
    "concept": "Availability Zones"
  },
  {
    "questionCode": "PDF-M03-002",
    "questionText": "A media company wants to cache large video files close to their viewers in Europe, Asia, and South America to reduce latency and buffering. Which AWS global infrastructure component should they leverage?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Regions",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Availability Zones",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Edge Locations",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS Direct Connect locations",
        "isCorrect": false
      }
    ],
    "explanation": "Edge Locations are endpoints for AWS used for caching content via Amazon CloudFront. They are globally distributed to deliver content with lower latency to end users.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Content Delivery",
    "difficulty": "MEDIUM",
    "tags": [
      "Edge Locations",
      "CloudFront",
      "Module 3"
    ],
    "sourceModule": "Module 3 - Global Infrastructure and Reliability",
    "source": "Module 03",
    "concept": "Edge Locations"
  },
  {
    "questionCode": "PDF-M03-003",
    "questionText": "A global banking application requires the HIGHEST level of availability and must survive a disaster that impacts an entire geographic area (like a major hurricane or earthquake). How should the architect deploy the application?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Across multiple data centers within a single Availability Zone",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Across multiple Availability Zones within a single AWS Region",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Across multiple AWS Regions",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Using a single large EC2 instance with regular EBS snapshots",
        "isCorrect": false
      }
    ],
    "explanation": "For extreme high availability and disaster recovery against geographic-scale disasters, architectures must span multiple AWS Regions. A single Region could technically be impacted by a massive, catastrophic regional event.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "High Availability",
    "difficulty": "HARD",
    "tags": [
      "Disaster Recovery",
      "Multi-Region",
      "Module 3"
    ],
    "sourceModule": "Module 3 - Global Infrastructure and Reliability",
    "source": "Module 03",
    "concept": "Multi-Region HA"
  },
  {
    "questionCode": "PDF-M03-004",
    "questionText": "Which service uses Edge Locations to cache content and deliver it to end-users at high speeds?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon CloudFront",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Amazon S3 Transfer Acceleration",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "AWS Global Accelerator",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Amazon Route 53",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon CloudFront is a Content Delivery Network (CDN) service that caches and delivers data, videos, applications, and APIs to customers globally with low latency via Edge Locations.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Networking and Content Delivery",
    "difficulty": "EASY",
    "tags": [
      "CloudFront",
      "Module 3"
    ],
    "sourceModule": "Module 3 - Global Infrastructure and Reliability",
    "source": "Module 03",
    "concept": "CloudFront Overview"
  },
  {
    "questionCode": "PDF-M03-005",
    "questionText": "When provisioning resources using AWS services, how can a customer ensure that their data remains entirely within the borders of a specific country to satisfy strict local compliance laws?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Enable AWS Shield Advanced",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Select an AWS Region located entirely within that country and deploy data only to that Region",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Configure Edge Locations to strictly route traffic within the country",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Use AWS IAM to restrict geographic access based on user IP addresses",
        "isCorrect": false
      }
    ],
    "explanation": "AWS allows customers to choose exactly which Region(s) their data is stored in. AWS will not replicate or move data out of a Region unless the customer explicitly configures it to do so, thus enabling data sovereignty compliance.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Data Sovereignty",
    "difficulty": "MEDIUM",
    "tags": [
      "Compliance",
      "Regions",
      "Module 3"
    ],
    "sourceModule": "Module 3 - Global Infrastructure and Reliability",
    "source": "Module 03",
    "concept": "Data Residency"
  },
  {
    "questionCode": "PDF-M04-001",
    "questionText": "What AWS service enables you to launch resources into a logically isolated virtual network that you define?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Direct Connect",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Route 53",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon Virtual Private Cloud (Amazon VPC)",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS Transit Gateway",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Networking",
    "difficulty": "EASY",
    "tags": [
      "VPC",
      "Module 4"
    ],
    "sourceModule": "Module 4 - Networking",
    "source": "Module 04",
    "concept": "VPC Basics"
  },
  {
    "questionCode": "PDF-M04-002",
    "questionText": "A startup is designing a secure architecture. They want their EC2 web servers to be accessible from the internet, but their database servers MUST NOT be accessible from the internet. Which VPC configuration is MOST appropriate?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Place all servers in a public subnet and use Security Groups to block the internet from reaching the databases.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Place the web servers in a public subnet and the database servers in a private subnet.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Place all servers in a private subnet and attach an Internet Gateway to the database servers only.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Use AWS Transit Gateway to route internet traffic directly to the web servers and block all database traffic.",
        "isCorrect": false
      }
    ],
    "explanation": "A standard and secure architecture places internet-facing resources (like web servers) in a public subnet (which has a route to an Internet Gateway), and backend resources (like databases) in a private subnet (which has no route to the Internet Gateway).",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Networking",
    "difficulty": "MEDIUM",
    "tags": [
      "Subnets",
      "Architecture",
      "Module 4"
    ],
    "sourceModule": "Module 4 - Networking",
    "source": "Module 04",
    "concept": "Public vs Private Subnets"
  },
  {
    "questionCode": "PDF-M04-003",
    "questionText": "Which VPC component acts as a stateful virtual firewall at the instance level to control inbound and outbound traffic?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Network Access Control List (NACL)",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Route Table",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Security Group",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Internet Gateway",
        "isCorrect": false
      }
    ],
    "explanation": "A Security Group acts as a virtual firewall for your EC2 instances to control inbound and outbound traffic. It operates at the instance level and is stateful (if you allow an incoming request, the response is automatically allowed).",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Network Security",
    "difficulty": "EASY",
    "tags": [
      "Security Group",
      "Module 4"
    ],
    "sourceModule": "Module 4 - Networking",
    "source": "Module 04",
    "concept": "Security Groups"
  },
  {
    "questionCode": "PDF-M04-004",
    "questionText": "When evaluating network security controls within a VPC, what is a key difference between a Security Group and a Network Access Control List (Network ACL)?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Security groups support 'deny' rules, while Network ACLs only support 'allow' rules.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Security groups operate at the subnet level, while Network ACLs operate at the instance level.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Security groups are stateful, while Network ACLs are stateless.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Security groups require an Internet Gateway, while Network ACLs do not.",
        "isCorrect": false
      }
    ],
    "explanation": "Security groups are stateful (return traffic is automatically allowed). Network ACLs are stateless (return traffic must be explicitly allowed by rules). Furthermore, Security Groups operate at the instance level, and NACLs operate at the subnet level.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Network Security",
    "difficulty": "HARD",
    "tags": [
      "Comparison",
      "Security Group vs NACL",
      "Module 4"
    ],
    "sourceModule": "Module 4 - Networking",
    "source": "Module 04",
    "concept": "SG vs NACL"
  },
  {
    "questionCode": "PDF-M04-005",
    "questionText": "An enterprise has multiple branch offices worldwide and wants to connect all of their on-premises networks and their AWS VPCs through a single, centrally managed hub. Which AWS service should they use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "VPC Peering",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Transit Gateway",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Direct Connect",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS PrivateLink",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Transit Gateway connects VPCs and on-premises networks through a central hub, simplifying network management and minimizing the number of peering connections required.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Networking",
    "difficulty": "MEDIUM",
    "tags": [
      "Transit Gateway",
      "Architecture",
      "Module 4"
    ],
    "sourceModule": "Module 4 - Networking",
    "source": "Module 04",
    "concept": "Transit Gateway"
  },
  {
    "questionCode": "PDF-M05-001",
    "questionText": "Which AWS service is a highly durable, scalable object storage service commonly used for data lakes, backups, and static website hosting?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon Elastic Block Store (Amazon EBS)",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Elastic File System (Amazon EFS)",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon Simple Storage Service (Amazon S3)",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Amazon DynamoDB",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon S3 is an object storage service offering industry-leading scalability, data availability, security, and performance. It is used widely for backups, data lakes, and static hosting.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Storage",
    "difficulty": "EASY",
    "tags": [
      "S3",
      "Module 5"
    ],
    "sourceModule": "Module 5 - Storage and Databases",
    "source": "Module 05",
    "concept": "S3 Basics"
  },
  {
    "questionCode": "PDF-M05-002",
    "questionText": "A developer needs a fast, flexible NoSQL database service for a serverless application. The database must handle massive scale with single-digit millisecond latency. Which service is MOST appropriate?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon RDS",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Redshift",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon DynamoDB",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Amazon Aurora",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon DynamoDB is a key-value and document database (NoSQL) that delivers single-digit millisecond performance at any scale.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Databases",
    "difficulty": "MEDIUM",
    "tags": [
      "DynamoDB",
      "NoSQL",
      "Module 5"
    ],
    "sourceModule": "Module 5 - Storage and Databases",
    "source": "Module 05",
    "concept": "DynamoDB Application"
  },
  {
    "questionCode": "PDF-M05-003",
    "questionText": "A company is comparing Amazon EBS, Amazon EFS, and Amazon S3. They need block storage that can be attached to a single EC2 instance as a highly performant root volume for an operating system. Which storage type MUST they choose?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon S3",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon EFS",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon EBS",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Amazon Glacier",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon EBS provides block-level storage volumes for use with Amazon EC2 instances. It acts essentially as an unformatted hard drive attached to a specific instance.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Storage",
    "difficulty": "HARD",
    "tags": [
      "Storage Comparison",
      "EBS",
      "Module 5"
    ],
    "sourceModule": "Module 5 - Storage and Databases",
    "source": "Module 05",
    "concept": "S3 vs EBS vs EFS"
  },
  {
    "questionCode": "PDF-M05-004",
    "questionText": "An analytics team needs a fully managed data warehouse service in AWS to query petabytes of structured data using standard SQL. Which service should they use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon RDS",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Redshift",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Amazon Athena",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Glue",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon Redshift is a fast, fully managed cloud data warehouse that makes it simple and cost-effective to analyze all your data using standard SQL and existing Business Intelligence (BI) tools.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Analytics",
    "difficulty": "MEDIUM",
    "tags": [
      "Redshift",
      "Data Warehouse",
      "Module 5"
    ],
    "sourceModule": "Module 5 - Storage and Databases",
    "source": "Module 05",
    "concept": "Redshift"
  },
  {
    "questionCode": "PDF-M05-005",
    "questionText": "Which Amazon S3 storage class is the MOST cost-effective option for archiving data that must be retained for compliance but is rarely accessed, with a retrieval time of 12 hours being acceptable?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "S3 Standard",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "S3 Intelligent-Tiering",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "S3 Standard-IA (Infrequent Access)",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "S3 Glacier Deep Archive",
        "isCorrect": true
      }
    ],
    "explanation": "S3 Glacier Deep Archive provides the lowest cost storage for data that is rarely accessed and where retrieval times of 12 hours are acceptable. It is designed for long-term retention and digital preservation.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Storage Pricing",
    "difficulty": "HARD",
    "tags": [
      "S3 Storage Classes",
      "Pricing",
      "Module 5"
    ],
    "sourceModule": "Module 5 - Storage and Databases",
    "source": "Module 05",
    "concept": "S3 Glacier"
  },
  {
    "questionCode": "PDF-M06-001",
    "questionText": "According to the AWS Shared Responsibility Model, which of the following is an AWS responsibility?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Configuring IAM user passwords",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Securing the physical hardware in the AWS data centers",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Encrypting customer data stored in Amazon S3",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Patching the guest operating system on Amazon EC2 instances",
        "isCorrect": false
      }
    ],
    "explanation": "Under the Shared Responsibility Model, AWS is responsible for 'security OF the cloud', which includes protecting the physical global infrastructure (hardware, software, networking, and facilities). The customer is responsible for 'security IN the cloud'.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Shared Responsibility Model",
    "difficulty": "EASY",
    "tags": [
      "Shared Responsibility",
      "Module 6"
    ],
    "sourceModule": "Module 6 - Security",
    "source": "Module 06",
    "concept": "AWS Responsibility"
  },
  {
    "questionCode": "PDF-M06-002",
    "questionText": "A security administrator needs to grant an EC2 instance the ability to securely read files from an S3 bucket. According to security best practices, what is the MOST secure approach?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Create an IAM user with S3 read permissions and embed the access keys directly into the EC2 instance's code.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Make the S3 bucket publicly readable to allow the EC2 instance access.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Create an IAM role with S3 read permissions and attach the role to the EC2 instance.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Use the AWS account root user credentials on the EC2 instance.",
        "isCorrect": false
      }
    ],
    "explanation": "IAM roles are designed so that your applications can securely make API requests from your instances, without requiring you to manage the security credentials (access keys) manually.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "IAM",
    "difficulty": "MEDIUM",
    "tags": [
      "IAM Role",
      "Best Practices",
      "Module 6"
    ],
    "sourceModule": "Module 6 - Security",
    "source": "Module 06",
    "concept": "IAM Roles for EC2"
  },
  {
    "questionCode": "PDF-M06-003",
    "questionText": "Which AWS IAM component should you use to group together users who perform the same job function and require the same permissions?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "IAM User",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "IAM Role",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "IAM Group",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "IAM Policy",
        "isCorrect": false
      }
    ],
    "explanation": "An IAM group is a collection of IAM users. Groups let you specify permissions for multiple users, which can make it easier to manage the permissions for those users.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "IAM",
    "difficulty": "EASY",
    "tags": [
      "IAM Groups",
      "Module 6"
    ],
    "sourceModule": "Module 6 - Security",
    "source": "Module 06",
    "concept": "IAM Groups"
  },
  {
    "questionCode": "PDF-M06-004",
    "questionText": "A finance organization is undergoing a strict compliance audit. The auditors request proof that AWS infrastructure adheres to specific security frameworks, such as SOC 2 and ISO 27001. Which AWS service provides these compliance reports?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS CloudTrail",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Config",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "AWS Artifact",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS Inspector",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Artifact is a central resource for compliance-related information that matters to you. It provides on-demand access to AWS security and compliance reports and select online agreements.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Compliance",
    "difficulty": "MEDIUM",
    "tags": [
      "Artifact",
      "Compliance",
      "Module 6"
    ],
    "sourceModule": "Module 6 - Security",
    "source": "Module 06",
    "concept": "AWS Artifact"
  },
  {
    "questionCode": "PDF-M06-005",
    "questionText": "When defending an application against Layer 3 and Layer 4 Distributed Denial of Service (DDoS) attacks, which two services are commonly compared, and which one provides advanced protection for EC2, ELB, CloudFront, and Route 53 at a premium cost?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS WAF vs AWS Shield; AWS WAF provides the advanced Layer 4 DDoS protection.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Shield Standard vs AWS Shield Advanced; AWS Shield Advanced provides the premium advanced protection.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Inspector vs AWS GuardDuty; AWS GuardDuty provides the DDoS protection.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Security Groups vs Network ACLs; Security Groups provide the premium DDoS protection.",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Shield is specifically designed for DDoS protection. Shield Standard is free and automatic. Shield Advanced provides premium, elevated protection against large and sophisticated DDoS attacks.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Network Security",
    "difficulty": "HARD",
    "tags": [
      "DDoS",
      "Shield",
      "Comparison",
      "Module 6"
    ],
    "sourceModule": "Module 6 - Security",
    "source": "Module 06",
    "concept": "Shield Standard vs Advanced"
  },
  {
    "questionCode": "PDF-M07-001",
    "questionText": "Which AWS service is used to monitor AWS resources and applications in real-time, providing metrics like CPU utilization and network traffic?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS CloudTrail",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon CloudWatch",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Config",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Trusted Advisor",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon CloudWatch is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers. It collects performance and operational data in the form of logs, metrics, and events.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Monitoring",
    "difficulty": "EASY",
    "tags": [
      "CloudWatch",
      "Module 7"
    ],
    "sourceModule": "Module 7 - Monitoring and Analytics",
    "source": "Module 07",
    "concept": "CloudWatch Basics"
  },
  {
    "questionCode": "PDF-M07-002",
    "questionText": "A cloud administrator discovers that several critical EC2 instances were unexpectedly terminated. They need to identify exactly which IAM user made the API call to terminate the instances and exactly what time it occurred. Which AWS service provides this audit history?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon CloudWatch",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS CloudTrail",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Identity and Access Management (IAM)",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Systems Manager",
        "isCorrect": false
      }
    ],
    "explanation": "AWS CloudTrail logs all API activity within an AWS account, recording exactly who made a request, when it was made, and from what IP address, making it the primary service for governance, compliance, and operational and risk auditing.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Logging and Monitoring",
    "difficulty": "MEDIUM",
    "tags": [
      "CloudTrail",
      "Auditing",
      "Module 7"
    ],
    "sourceModule": "Module 7 - Monitoring and Analytics",
    "source": "Module 07",
    "concept": "CloudTrail Application"
  },
  {
    "questionCode": "PDF-M07-003",
    "questionText": "An organization wants to enforce a rule that all Amazon S3 buckets must have encryption enabled. They want an automated system to constantly monitor bucket configurations and flag any bucket that is non-compliant. Which service should they use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS CloudTrail",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Macie",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "AWS Config",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS Trusted Advisor",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Config is a service that enables you to assess, audit, and evaluate the configurations of your AWS resources. You can create rules (like requiring S3 encryption) and Config will automatically evaluate resources against those rules.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Compliance",
    "difficulty": "HARD",
    "tags": [
      "Config",
      "Compliance",
      "Module 7"
    ],
    "sourceModule": "Module 7 - Monitoring and Analytics",
    "source": "Module 07",
    "concept": "AWS Config"
  },
  {
    "questionCode": "PDF-M07-004",
    "questionText": "What is the primary difference between Amazon CloudWatch and AWS CloudTrail?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "CloudWatch is used to provision resources; CloudTrail is used to delete them.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "CloudWatch monitors resource performance metrics (like CPU usage); CloudTrail audits API calls and user activity.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "CloudWatch is free; CloudTrail always requires a premium subscription.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "CloudWatch audits API calls and user activity; CloudTrail monitors resource performance metrics.",
        "isCorrect": false
      }
    ],
    "explanation": "CloudWatch focuses on WHAT is happening with system performance and health (metrics, logs, alarms). CloudTrail focuses on WHO made changes in the environment (API call history).",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Monitoring",
    "difficulty": "HARD",
    "tags": [
      "CloudWatch vs CloudTrail",
      "Comparison",
      "Module 7"
    ],
    "sourceModule": "Module 7 - Monitoring and Analytics",
    "source": "Module 07",
    "concept": "CloudWatch vs CloudTrail"
  },
  {
    "questionCode": "PDF-M07-005",
    "questionText": "Which service acts as your automated cloud expert, providing recommendations to help you follow AWS best practices regarding cost optimization, performance, security, and fault tolerance?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Trusted Advisor",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "AWS Config",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon GuardDuty",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Personal Health Dashboard",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Trusted Advisor acts like a customized cloud expert, analyzing your AWS environment and providing recommendations to help you provision your resources by following best practices across 5 pillars.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Optimization",
    "difficulty": "EASY",
    "tags": [
      "Trusted Advisor",
      "Module 7"
    ],
    "sourceModule": "Module 7 - Monitoring and Analytics",
    "source": "Module 07",
    "concept": "Trusted Advisor"
  },
  {
    "questionCode": "PDF-M08-001",
    "questionText": "What are the three fundamental drivers of cost with AWS?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Compute, Storage, and Outbound Data Transfer",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Compute, Database, and Inbound Data Transfer",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Storage, Security, and Outbound Data Transfer",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Networking, Database, and Physical Space",
        "isCorrect": false
      }
    ],
    "explanation": "In general, the three fundamental drivers of cost with AWS are compute, storage, and outbound data transfer. Inbound data transfer is generally free.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Cost Drivers",
    "difficulty": "EASY",
    "tags": [
      "Pricing Basics",
      "Module 8"
    ],
    "sourceModule": "Module 8 - Pricing and Support",
    "source": "Module 08",
    "concept": "Cost Drivers"
  },
  {
    "questionCode": "PDF-M08-002",
    "questionText": "A finance team wants to visualize their AWS spending over the last 6 months, forecast future spending, and group their costs by specific projects using resource tags. Which AWS tool should they use?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Budgets",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Cost Explorer",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Pricing Calculator",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Cost & Usage Report",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Cost Explorer has an easy-to-use interface that lets you visualize, understand, and manage your AWS costs and usage over time, including viewing historical data and forecasting future costs.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Cost Management",
    "difficulty": "MEDIUM",
    "tags": [
      "Cost Explorer",
      "Module 8"
    ],
    "sourceModule": "Module 8 - Pricing and Support",
    "source": "Module 08",
    "concept": "Cost Explorer"
  },
  {
    "questionCode": "PDF-M08-003",
    "questionText": "A startup has a strict monthly IT budget of $500. The CTO wants to receive an email alert automatically if their forecasted AWS spending for the current month exceeds this limit. Which service is MOST appropriate?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Cost Explorer",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Budgets",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Amazon CloudWatch billing alarms",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Organizations",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Budgets gives you the ability to set custom budgets that alert you when your costs or usage exceed (or are forecasted to exceed) your budgeted amount.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Cost Management",
    "difficulty": "MEDIUM",
    "tags": [
      "Budgets",
      "Alerts",
      "Module 8"
    ],
    "sourceModule": "Module 8 - Pricing and Support",
    "source": "Module 08",
    "concept": "AWS Budgets"
  },
  {
    "questionCode": "PDF-M08-004",
    "questionText": "Which AWS Support plan provides 24x7 phone, email, and chat access to Cloud Support Engineers, and includes a designated Technical Account Manager (TAM)?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Basic Support",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Developer Support",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Business Support",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Enterprise Support",
        "isCorrect": true
      }
    ],
    "explanation": "The Enterprise Support plan is the highest tier, providing 24x7 technical support and crucially, a designated Technical Account Manager (TAM) to proactively monitor your environment and assist with best practices.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Support Plans",
    "difficulty": "EASY",
    "tags": [
      "Support Plans",
      "Enterprise",
      "Module 8"
    ],
    "sourceModule": "Module 8 - Pricing and Support",
    "source": "Module 08",
    "concept": "Enterprise Support"
  },
  {
    "questionCode": "PDF-M08-005",
    "questionText": "An enterprise has 15 different AWS accounts belonging to different departments. They want to centrally manage billing for all these accounts, combine their usage to receive volume pricing discounts, and centrally apply IAM policies to accounts. Which service enables this?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Cost Explorer",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Control Tower",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "AWS Organizations",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS IAM Identity Center",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Organizations allows you to centrally manage and govern multiple accounts. It provides Consolidated Billing (allowing volume discounts across accounts) and Service Control Policies (SCPs) to govern account-level permissions.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Consolidated Billing",
    "difficulty": "HARD",
    "tags": [
      "Organizations",
      "Consolidated Billing",
      "Module 8"
    ],
    "sourceModule": "Module 8 - Pricing and Support",
    "source": "Module 08",
    "concept": "AWS Organizations"
  },
  {
    "questionCode": "PDF-M09-001",
    "questionText": "What AWS service acts as a comprehensive framework to help companies plan and execute mass migrations of thousands of workloads to AWS?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Migration Hub",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Application Discovery Service",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "AWS Cloud Adoption Framework (AWS CAF)",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS Snowball",
        "isCorrect": false
      }
    ],
    "explanation": "The AWS Cloud Adoption Framework (AWS CAF) organizes guidance into six perspectives (Business, People, Governance, Platform, Security, Operations) to help organizations plan and manage their migration to the cloud.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Migration",
    "difficulty": "EASY",
    "tags": [
      "CAF",
      "Module 9"
    ],
    "sourceModule": "Module 9 - Migration and Innovation",
    "source": "Module 09",
    "concept": "AWS CAF"
  },
  {
    "questionCode": "PDF-M09-002",
    "questionText": "A media company has 500 Terabytes of archival video footage stored on-premises. They need to migrate this data to Amazon S3. Their current internet connection is slow and would take years to upload this data over the network. Which AWS service is MOST appropriate for this migration?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Direct Connect",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Snowball Edge",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS DataSync",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Amazon S3 Transfer Acceleration",
        "isCorrect": false
      }
    ],
    "explanation": "The AWS Snow Family (like Snowball Edge) provides physical devices that are shipped to your data center. You load data locally onto the device at high speeds, ship it back to AWS, and AWS uploads it directly into S3, bypassing slow internet connections.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Migration and Data Transfer",
    "difficulty": "MEDIUM",
    "tags": [
      "Snowball",
      "Migration",
      "Module 9"
    ],
    "sourceModule": "Module 9 - Migration and Innovation",
    "source": "Module 09",
    "concept": "Snow Family Application"
  },
  {
    "questionCode": "PDF-M09-003",
    "questionText": "When considering the six common migration strategies (the 6 Rs), which strategy involves moving an application to the cloud exactly as-is without making any changes to its architecture?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Refactoring",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Replatforming",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Rehosting",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Repurchasing",
        "isCorrect": false
      }
    ],
    "explanation": "Rehosting (also known as 'lift-and-shift') involves moving applications to AWS without making any changes to take advantage of cloud capabilities.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Migration",
    "difficulty": "MEDIUM",
    "tags": [
      "6 Rs",
      "Rehosting",
      "Module 9"
    ],
    "sourceModule": "Module 9 - Migration and Innovation",
    "source": "Module 09",
    "concept": "Rehosting"
  },
  {
    "questionCode": "PDF-M09-004",
    "questionText": "A team decides to move from a legacy commercial database license to Amazon Aurora to save costs and modernize their application architecture. Which of the 6 Rs of migration does this represent?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Retiring",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Rehosting",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Refactoring / Re-architecting",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Retaining",
        "isCorrect": false
      }
    ],
    "explanation": "Refactoring (or Re-architecting) involves reimagining how the application is architected and developed, typically using cloud-native features like serverless or managed databases (like Aurora) to improve performance, scale, or cost.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Migration",
    "difficulty": "HARD",
    "tags": [
      "6 Rs",
      "Refactoring",
      "Module 9"
    ],
    "sourceModule": "Module 9 - Migration and Innovation",
    "source": "Module 09",
    "concept": "Refactoring"
  },
  {
    "questionCode": "PDF-M09-005",
    "questionText": "Which AWS Cloud Adoption Framework (AWS CAF) perspective focuses on ensuring the organization's IT strategy aligns directly with its overarching business goals?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "People Perspective",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Operations Perspective",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Business Perspective",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Governance Perspective",
        "isCorrect": false
      }
    ],
    "explanation": "The Business Perspective in AWS CAF ensures that IT aligns with business needs and that IT investments link directly to key business results.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Migration",
    "difficulty": "EASY",
    "tags": [
      "CAF",
      "Business Perspective",
      "Module 9"
    ],
    "sourceModule": "Module 9 - Migration and Innovation",
    "source": "Module 09",
    "concept": "CAF Business"
  },
  {
    "questionCode": "PDF-M10-001",
    "questionText": "Which framework provides a set of best practices and design principles to help customers design and evaluate cloud architectures?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "AWS Cloud Adoption Framework",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Well-Architected Framework",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Shared Responsibility Model",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Acceptable Use Policy",
        "isCorrect": false
      }
    ],
    "explanation": "The AWS Well-Architected Framework helps cloud architects build secure, high-performing, resilient, and efficient infrastructure for their applications and workloads based on six pillars.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Well-Architected Framework",
    "difficulty": "EASY",
    "tags": [
      "Well-Architected",
      "Module 10"
    ],
    "sourceModule": "Module 10 - The Cloud Journey",
    "source": "Module 10",
    "concept": "Well-Architected Basics"
  },
  {
    "questionCode": "PDF-M10-002",
    "questionText": "An architecture team is reviewing their environment to ensure they are selecting the right instance types for their workloads and continually monitoring to avoid over-provisioning. Which pillar of the AWS Well-Architected Framework does this align with?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Reliability",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Security",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Performance Efficiency",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Cost Optimization",
        "isCorrect": true
      }
    ],
    "explanation": "The Cost Optimization pillar focuses on avoiding unneeded costs. Key topics include understanding and controlling where money is being spent, selecting the most appropriate and right number of resource types, analyzing spend over time, and scaling to meet business needs without overspending.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Well-Architected Framework",
    "difficulty": "MEDIUM",
    "tags": [
      "Cost Optimization",
      "Well-Architected",
      "Module 10"
    ],
    "sourceModule": "Module 10 - The Cloud Journey",
    "source": "Module 10",
    "concept": "Cost Optimization Pillar"
  },
  {
    "questionCode": "PDF-M10-003",
    "questionText": "A design decision is made to automatically recover a failing database instance in a secondary Availability Zone without manual intervention. Which AWS Well-Architected pillar heavily emphasizes this ability to recover from infrastructure or service disruptions?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Operational Excellence",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Security",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Reliability",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Performance Efficiency",
        "isCorrect": false
      }
    ],
    "explanation": "The Reliability pillar encompasses the ability of a workload to perform its intended function correctly and consistently when it's expected to. This includes the ability to operate and test the workload through its total lifecycle, recovering from failures automatically.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Well-Architected Framework",
    "difficulty": "MEDIUM",
    "tags": [
      "Reliability",
      "Well-Architected",
      "Module 10"
    ],
    "sourceModule": "Module 10 - The Cloud Journey",
    "source": "Module 10",
    "concept": "Reliability Pillar"
  },
  {
    "questionCode": "PDF-M10-004",
    "questionText": "Which two pillars of the AWS Well-Architected Framework work closely together to ensure a workload is appropriately sized (not too large and not too small) for the current demand? (Choose TWO)",
    "type": "MULTI_SELECT",
    "requiredSelections": 2,
    "options": [
      {
        "label": "A",
        "text": "Security",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Performance Efficiency",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Cost Optimization",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Operational Excellence",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Sustainability",
        "isCorrect": false
      }
    ],
    "explanation": "Performance Efficiency focuses on using IT and computing resources efficiently to meet system requirements (scaling out rather than just up, selecting right instance types). Cost Optimization ensures you are not paying for more than you need. They balance each other.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Well-Architected Framework",
    "difficulty": "HARD",
    "tags": [
      "Well-Architected",
      "Multiple Pillars",
      "Module 10"
    ],
    "sourceModule": "Module 10 - The Cloud Journey",
    "source": "Module 10",
    "concept": "Balancing Pillars"
  },
  {
    "questionCode": "PDF-M10-005",
    "questionText": "Under the Operational Excellence pillar, which principle suggests that teams should continually evaluate and refine procedures based on small, reversible modifications?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Make frequent, small, reversible changes",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Perform operations as code",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Anticipate failure",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Learn from all operational failures",
        "isCorrect": false
      }
    ],
    "explanation": "Making frequent, small, reversible changes is a design principle of the Operational Excellence pillar. It encourages teams to design workloads that allow components to be updated regularly without major disruptions.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Well-Architected Framework",
    "difficulty": "HARD",
    "tags": [
      "Operational Excellence",
      "Design Principles",
      "Module 10"
    ],
    "sourceModule": "Module 10 - The Cloud Journey",
    "source": "Module 10",
    "concept": "Design Principles"
  },
  {
    "questionCode": "PDF-M11-001",
    "questionText": "Which AWS domain represents the largest percentage (approximately 32-34%) of the AWS Certified Cloud Practitioner exam?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Cloud Concepts",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Security and Compliance",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Cloud Technology and Services",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Billing, Pricing and Support",
        "isCorrect": false
      }
    ],
    "explanation": "Cloud Technology and Services is the largest domain on the CLF-C02 exam, covering compute, storage, networking, databases, and various managed services.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Exam Guide",
    "difficulty": "EASY",
    "tags": [
      "Exam Prep",
      "Module 11"
    ],
    "sourceModule": "Module 11 - AWS Certified Cloud Practitioner Basics",
    "source": "Module 11",
    "concept": "Exam Structure"
  },
  {
    "questionCode": "PDF-M11-002",
    "questionText": "The AWS Certified Cloud Practitioner exam utilizes both scored and unscored questions. Why does AWS include unscored questions on the exam?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "To give candidates bonus points if they answer them correctly.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "To test the testing software in a live environment.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "To gather statistical data on new questions to evaluate their fairness for use as scored questions on future exams.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "To intentionally lower candidate scores to enforce a strict passing rate.",
        "isCorrect": false
      }
    ],
    "explanation": "Exams include 15 unscored questions that are placed throughout the exam to gather statistical information. This ensures new questions are fair and valid before they are used as scored questions in the future.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Exam Guide",
    "difficulty": "MEDIUM",
    "tags": [
      "Exam Rules",
      "Module 11"
    ],
    "sourceModule": "Module 11 - AWS Certified Cloud Practitioner Basics",
    "source": "Module 11",
    "concept": "Unscored Questions"
  },
  {
    "questionCode": "PDF-M11-003",
    "questionText": "On the AWS Certified Cloud Practitioner exam, what is the passing score scaled out of 1000?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "500",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "600",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "700",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "800",
        "isCorrect": false
      }
    ],
    "explanation": "The passing score for the foundational AWS Certified Cloud Practitioner exam is 700 (scaled score out of 1000).",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "Exam Guide",
    "difficulty": "EASY",
    "tags": [
      "Passing Score",
      "Module 11"
    ],
    "sourceModule": "Module 11 - AWS Certified Cloud Practitioner Basics",
    "source": "Module 11",
    "concept": "Exam Scoring"
  },
  {
    "questionCode": "PDF-M11-004",
    "questionText": "A candidate is preparing for the exam and wants to understand how the Shared Responsibility Model is tested. Which domain explicitly covers the Shared Responsibility Model and AWS IAM concepts?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Domain 1: Cloud Concepts",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Domain 2: Security and Compliance",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Domain 3: Cloud Technology and Services",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Domain 4: Billing, Pricing and Support",
        "isCorrect": false
      }
    ],
    "explanation": "The Shared Responsibility Model, AWS IAM, compliance, and core security services fall directly under Domain 2: Security and Compliance.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Exam Guide",
    "difficulty": "MEDIUM",
    "tags": [
      "Exam Domains",
      "Module 11"
    ],
    "sourceModule": "Module 11 - AWS Certified Cloud Practitioner Basics",
    "source": "Module 11",
    "concept": "Domain 2 Content"
  },
  {
    "questionCode": "PDF-M11-005",
    "questionText": "If a candidate is asked to identify which AWS service helps estimate the cost of an architecture solution before it is built, which domain does this knowledge primarily map to?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Domain 1: Cloud Concepts",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Domain 2: Security and Compliance",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Domain 3: Cloud Technology and Services",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Domain 4: Billing, Pricing and Support",
        "isCorrect": true
      }
    ],
    "explanation": "Tools like the AWS Pricing Calculator, Cost Explorer, and AWS Budgets are explicitly tested under Domain 4: Billing, Pricing, and Support.",
    "domain": "Billing, Pricing and Support",
    "domainId": 4,
    "topic": "Exam Guide",
    "difficulty": "MEDIUM",
    "tags": [
      "Exam Domains",
      "Module 11"
    ],
    "sourceModule": "Module 11 - AWS Certified Cloud Practitioner Basics",
    "source": "Module 11",
    "concept": "Domain 4 Content"
  },
  {
    "questionCode": "PDF-M12-001",
    "questionText": "Which service should an administrator use to quickly provision a preconfigured, managed virtual private server (VPS) with a fixed monthly price?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon EC2",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Lightsail",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Lambda",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "AWS Elastic Beanstalk",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon Lightsail is an easy-to-use virtual private server (VPS) provider that offers you everything needed to build an application or website for a low, predictable monthly price.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Compute",
    "difficulty": "EASY",
    "tags": [
      "Lightsail",
      "Module 12"
    ],
    "sourceModule": "Module 12 - Final Assessment",
    "source": "Module 12",
    "concept": "Amazon Lightsail"
  },
  {
    "questionCode": "PDF-M12-002",
    "questionText": "An application requires a globally distributed database that provides consistent single-digit millisecond latency, handles millions of requests per second, and offers a flexible schema. Which AWS service is the BEST choice?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon RDS for PostgreSQL",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Amazon Aurora",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon DynamoDB",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Amazon Redshift",
        "isCorrect": false
      }
    ],
    "explanation": "DynamoDB is a serverless, NoSQL, fully managed database that delivers single-digit millisecond performance at any scale, making it ideal for flexible schema applications requiring immense throughput.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Databases",
    "difficulty": "MEDIUM",
    "tags": [
      "DynamoDB",
      "Application",
      "Module 12"
    ],
    "sourceModule": "Module 12 - Final Assessment",
    "source": "Module 12",
    "concept": "DynamoDB Application"
  },
  {
    "questionCode": "PDF-M12-003",
    "questionText": "A team wants to deploy a containerized application in AWS without having to provision or manage the underlying EC2 instances that host the containers. Which compute option should they choose?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon ECS with an EC2 launch type",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Fargate",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "AWS Lambda",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Amazon EKS with managed node groups",
        "isCorrect": false
      }
    ],
    "explanation": "AWS Fargate is a serverless compute engine for containers that works with both Amazon ECS and EKS. Fargate removes the need to provision and manage servers, letting you specify and pay for resources per application.",
    "domain": "Cloud Technology and Services",
    "domainId": 3,
    "topic": "Compute",
    "difficulty": "HARD",
    "tags": [
      "Containers",
      "Fargate",
      "Module 12"
    ],
    "sourceModule": "Module 12 - Final Assessment",
    "source": "Module 12",
    "concept": "AWS Fargate"
  },
  {
    "questionCode": "PDF-M12-004",
    "questionText": "Which service helps you protect sensitive data by using machine learning and pattern matching to discover and protect personally identifiable information (PII) stored in Amazon S3?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Amazon GuardDuty",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "AWS Shield",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Amazon Macie",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "AWS KMS",
        "isCorrect": false
      }
    ],
    "explanation": "Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data (like PII) in AWS.",
    "domain": "Security and Compliance",
    "domainId": 2,
    "topic": "Data Protection",
    "difficulty": "MEDIUM",
    "tags": [
      "Macie",
      "Security",
      "Module 12"
    ],
    "sourceModule": "Module 12 - Final Assessment",
    "source": "Module 12",
    "concept": "Amazon Macie"
  },
  {
    "questionCode": "PDF-M12-005",
    "questionText": "When architecting a solution for high availability across different physical locations, what is the MOST cost-effective and standard approach within a single geographic region?",
    "type": "SINGLE_SELECT",
    "requiredSelections": 1,
    "options": [
      {
        "label": "A",
        "text": "Deploying resources across multiple Edge Locations",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Deploying resources across multiple Availability Zones",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Deploying resources across multiple AWS Regions",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Deploying resources in a Local Zone",
        "isCorrect": false
      }
    ],
    "explanation": "Deploying across multiple Availability Zones (AZs) within the same Region is the standard best practice for achieving high availability and fault tolerance against localized data center failures.",
    "domain": "Cloud Concepts",
    "domainId": 1,
    "topic": "High Availability",
    "difficulty": "MEDIUM",
    "tags": [
      "Availability Zones",
      "Architecture",
      "Module 12"
    ],
    "sourceModule": "Module 12 - Final Assessment",
    "source": "Module 12",
    "concept": "Multi-AZ Architecture"
  }
];
