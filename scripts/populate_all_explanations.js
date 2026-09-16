const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Comprehensive AWS service knowledge base for CLF-C02
const AWS_SERVICE_KNOWLEDGE = {
  'Redshift': 'Amazon Redshift is AWS’s fully managed, petabyte-scale data warehouse service designed for large-scale analytics and BI workloads.',
  'GuardDuty': 'Amazon GuardDuty is an intelligent threat detection service that continuously monitors AWS accounts and workloads for malicious activity and unauthorized behavior using machine learning and threat intelligence feeds.',
  'IAM': 'AWS Identity and Access Management (IAM) controls authentication and authorization for users, groups, and roles with fine-grained access policies.',
  'Billing Dashboard': 'The AWS Billing Dashboard provides an overview of month-to-date spending, top service costs, and forecasted usage.',
  'MFA': 'Multi-Factor Authentication (MFA) requires two or more independent credentials before granting access, significantly hardening account security.',
  'CloudTrail': 'AWS CloudTrail tracks governance, compliance, and auditing by recording account activities and API calls across your AWS infrastructure.',
  'CloudWatch': 'Amazon CloudWatch is a monitoring and observability service that collects operational metrics, logs, and triggers automated alarm responses.',
  'S3': 'Amazon Simple Storage Service (Amazon S3) provides industry-leading object storage with 99.999999999% (11 9s) durability, fine-grained lifecycle management, and high availability.',
  'EC2': 'Amazon Elastic Compute Cloud (Amazon EC2) provides resizable compute capacity via virtual servers (instances) in the cloud with full administrative OS control.',
  'Lambda': 'AWS Lambda is a serverless, event-driven compute service that executes code without provisioning or managing servers, scaling automatically with demand.',
  'RDS': 'Amazon Relational Database Service (Amazon RDS) manages setup, automated backups, patching, and multi-AZ failover for popular relational database engines.',
  'DynamoDB': 'Amazon DynamoDB is a fully managed, serverless NoSQL key-value and document database delivering single-digit millisecond latency at any scale.',
  'VPC': 'Amazon Virtual Private Cloud (Amazon VPC) provisions logically isolated virtual networks where you define subnets, route tables, and network gateways.',
  'Shield': 'AWS Shield provides managed Distributed Denial of Service (DDoS) protection for perimeter web applications, with Shield Standard included at no extra cost.',
  'WAF': 'AWS WAF is a web application firewall that inspects web traffic and blocks common web exploits like SQL injection and cross-site scripting (XSS).',
  'Cost Explorer': 'AWS Cost Explorer provides interactive visual analytics, filtering, and 12-month historical trends with future cost forecasting.',
  'Budgets': 'AWS Budgets enables you to establish custom spending thresholds and alerts via email or Amazon SNS when actual or forecasted costs exceed your targets.',
  'Trusted Advisor': 'AWS Trusted Advisor scans your AWS environment against five pillars: Cost Optimization, Performance, Security, Fault Tolerance, and Service Quotas.',
  'CloudFront': 'Amazon CloudFront is a fast content delivery network (CDN) that delivers data, videos, applications, and APIs globally with low latency using edge locations.',
  'Route 53': 'Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service with health checking and flexible routing policies.',
  'KMS': 'AWS Key Management Service (AWS KMS) makes it easy to create, manage, and control cryptographic keys used to encrypt data across AWS services.',
  'Secrets Manager': 'AWS Secrets Manager enables you to rotate, manage, and retrieve database credentials, API keys, and other secrets throughout their lifecycle.',
  'Artifact': 'AWS Artifact is the central portal for on-demand access to AWS compliance documentation, SOC reports, PCI packages, and security agreements.',
  'Pricing Calculator': 'The AWS Pricing Calculator is a web-based planning tool to estimate costs for planned workloads before provisioning resources.',
  'Organizations': 'AWS Organizations allows consolidated billing and centralized governance across multiple AWS accounts with Service Control Policies (SCPs).',
  'Config': 'AWS Config continually assesses, audits, and evaluates configurations of your AWS resources against compliance rules.',
  'Inspector': 'Amazon Inspector is an automated vulnerability management service that scans EC2 instances, container images, and Lambda functions for software vulnerabilities.',
  'Macie': 'Amazon Macie uses machine learning to automatically discover, classify, and protect sensitive data such as personally identifiable information (PII) in Amazon S3.',
  'SQS': 'Amazon Simple Queue Service (Amazon SQS) is a fully managed message queuing service for decoupling and scaling microservices and distributed systems.',
  'SNS': 'Amazon Simple Notification Service (Amazon SNS) is a fully managed pub/sub messaging service for application-to-application and application-to-person notifications.',
  'ECS': 'Amazon Elastic Container Service (Amazon ECS) is a highly scalable, high-performance container orchestration service that supports Docker containers.',
  'EKS': 'Amazon Elastic Kubernetes Service (Amazon EKS) runs Kubernetes control plane instances across multiple Availability Zones to ensure high availability.',
  'Fargate': 'AWS Fargate is a serverless compute engine for containers that works with both ECS and EKS, eliminating the need to manage EC2 server instances.',
  'Direct Connect': 'AWS Direct Connect establishes a dedicated, private physical network connection from your premises to AWS for consistent throughput and reduced network costs.',
  'Storage Gateway': 'AWS Storage Gateway connects an on-premises software appliance with cloud-based storage to provide seamless hybrid storage integration.',
  'Support Plans': 'AWS offers Basic, Developer, Business, Enterprise On-Ramp, and Enterprise Support plans, with varying SLAs, Technical Account Manager (TAM) access, and advisory support.',
  'Shared Responsibility': 'Under the AWS Shared Responsibility Model, AWS is responsible for security OF the cloud (physical infrastructure, hardware, hypervisors), while the customer is responsible for security IN the cloud (customer data, IAM, OS, network configuration, firewall rules).'
};

function generateDetailedExplanation(question) {
  const correctOptions = question.options.filter(o => o.isCorrect);
  const correctText = correctOptions.map(o => `"${o.text}"`).join(' and ');
  const topic = question.topic || 'AWS Architecture';
  const domain = question.domain || 'Cloud Concepts';

  // Find matching knowledge
  let specificKnowledge = '';
  for (const [key, desc] of Object.entries(AWS_SERVICE_KNOWLEDGE)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(question.questionText) || correctOptions.some(o => regex.test(o.text))) {
      specificKnowledge = desc;
      break;
    }
  }

  if (!specificKnowledge) {
    specificKnowledge = `In the ${domain} domain, understanding ${topic} principles ensures that architectural choices align with the AWS Well-Architected Framework and CLF-C02 examination objectives.`;
  }

  const explanation = `Correct answer: ${correctText}. ${specificKnowledge} This solution directly addresses the stated scenario requirement while adhering to official AWS Certified Cloud Practitioner best practices.`;

  return explanation;
}

function generateOptionExplanation(option, isCorrect, question) {
  const topic = question.topic || 'this concept';
  if (isCorrect) {
    return `Correct: ${option.text} accurately fulfills the requirement for ${topic} in accordance with AWS best practices.`;
  } else {
    return `Incorrect: ${option.text} does not meet the specific criteria outlined for ${topic} in this scenario.`;
  }
}

async function main() {
  console.log('🚀 Starting explanation generation for all questions in database...');

  // 1. Fetch questions that need explanation
  const questions = await prisma.question.findMany({
    where: {
      OR: [
        { explanation: 'No explanation provided.' },
        { explanation: '' }
      ]
    },
    include: {
      options: true
    }
  });

  console.log(`Found ${questions.length} questions requiring explanations.`);

  let updatedCount = 0;
  const batchSize = 50;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);

    await Promise.all(batch.map(async (q) => {
      const newExplanation = generateDetailedExplanation(q);

      // Update question
      await prisma.question.update({
        where: { id: q.id },
        data: { explanation: newExplanation }
      });

      // Update options
      for (const opt of q.options) {
        const optExpl = generateOptionExplanation(opt, opt.isCorrect, q);
        await prisma.questionOption.update({
          where: { id: opt.id },
          data: { explanation: optExpl }
        });
      }
      updatedCount++;
    }));

    console.log(`Progress: ${updatedCount} / ${questions.length} questions updated...`);
  }

  console.log(`\n🎉 Successfully generated and saved explanations for all ${updatedCount} questions!`);

  // Verify
  const remaining = await prisma.question.count({
    where: {
      OR: [
        { explanation: 'No explanation provided.' },
        { explanation: '' }
      ]
    }
  });
  console.log(`Remaining questions without explanation: ${remaining}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
