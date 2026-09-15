#!/usr/bin/env python3
"""
Domain 4 Generator: Exactly 78 Questions on Billing, Pricing & Support (CP-573 to CP-650).
Covers:
- AWS Free Tier types (Always Free, 12 Months Free, Trials)
- Pricing Fundamentals (Pay-as-you-go, Volume Discounts, Savings Plans/RIs)
- Data Transfer pricing (Inbound vs Outbound, Inter-Region)
- AWS Pricing Calculator (Estimating architecture costs)
- AWS Cost Explorer, AWS Budgets, AWS Cost & Usage Report (CUR), Cost Allocation Tags
- AWS Cost Anomaly Detection, AWS Billing Conductor
- AWS Organizations & Consolidated Billing (Volume tiering, RI/SP sharing, SCPs)
- AWS Support Plans (Basic, Developer, Business, Enterprise On-Ramp, Enterprise)
- AWS Trusted Advisor (5 pillars, core vs full checks)
- AWS Marketplace (Third-party software, billing consolidation, licensing)
- Service Quotas (Viewing and requesting limit increases)
- AWS Health Dashboard vs Service Health Dashboard
"""

import json

def get_d4_questions():
    questions = []

    def q(num, text, q_type, req, options, explanation, topic, diff, tags, mod):
        code = f"CP-{num:03d}"
        questions.append({
            "id": f"cp-d4-{num}",
            "questionCode": code,
            "questionText": text,
            "type": q_type,
            "requiredSelections": req,
            "options": [{"label": o[0], "text": o[1], "isCorrect": o[2]} for o in options],
            "explanation": explanation,
            "domain": "Billing, Pricing and Support",
            "domainId": 4,
            "topic": topic,
            "difficulty": diff,
            "tags": tags,
            "sourceModule": mod,
            "status": "APPROVED"
        })

    # -------------------------------------------------------------
    # 1. AWS Free Tier & Pricing Fundamentals (CP-573 to CP-590) - 18 questions
    # -------------------------------------------------------------
    q(573, "What are the three distinct types of offers available under the AWS Free Tier?", "SINGLE_SELECT", 1, [
        ["A", "Always Free, 12 Months Free, and Short-Term Trials", True],
        ["B", "Bronze, Silver, and Gold Free", False],
        ["C", "Developer, Business, and Enterprise Free", False],
        ["D", "Public, Private, and Hybrid Free", False]
    ], "The AWS Free Tier consists of three distinct types of offers: 1) Always Free (offers that do not expire, such as DynamoDB 25 GB, Lambda 1M requests), 2) 12 Months Free (available for 12 months following initial signup, e.g., 750 hours/month of t2/t3.micro EC2), and 3) Short-Term Trials (trial periods activated upon service enablement).", "Free Tier", "EASY", ["Free Tier", "Always Free", "12 Months Free"], "Module 10")

    q(574, "Which AWS service is an example of an 'Always Free' offer in the AWS Free Tier?", "SINGLE_SELECT", 1, [
        ["A", "AWS Lambda (first 1 million requests per month free)", True],
        ["B", "Amazon EC2 m5.large instances", False],
        ["C", "Amazon Redshift petabyte clusters", False],
        ["D", "AWS Direct Connect 10 Gbps dedicated circuits", False]
    ], "AWS Lambda includes 1 million free requests and 3.2 million seconds of compute time per month as an 'Always Free' tier offer that does not expire after 12 months.", "Free Tier", "EASY", ["Always Free", "Lambda"], "Module 10")

    q(575, "What is a core characteristic of the '12 Months Free' tier offer for new AWS accounts?", "SINGLE_SELECT", 1, [
        ["A", "It begins the day you sign up for an AWS account and expires exactly 12 months later", True],
        ["B", "It automatically renews every calendar year for life", False],
        ["C", "It requires signing an upfront 3-year non-disclosure contract", False],
        ["D", "It is only available to educational universities", False]
    ], "12 Months Free tier benefits (such as 750 hours/month of EC2 Linux/Windows t2.micro or t3.micro instances and 5 GB of S3 standard storage) are valid for exactly 12 months starting from initial AWS account creation.", "Free Tier", "EASY", ["12 Months Free", "Eligibility"], "Module 10")

    q(576, "What is the primary pricing model of AWS cloud computing?", "SINGLE_SELECT", 1, [
        ["A", "Pay-as-you-go (pay only for the individual services you consume without long-term contracts)", True],
        ["B", "Flat mandatory $500 monthly membership subscription", False],
        ["C", "Fixed 5-year hardware lease agreements", False],
        ["D", "Per-employee payroll tax calculation", False]
    ], "AWS provides a pay-as-you-go approach for pricing for over 200 cloud services. With AWS you pay only for the individual services you need, for as long as you use them, and without requiring long-term contracts or complex licensing.", "Pricing Fundamentals", "EASY", ["Pay-As-You-Go", "Pricing"], "Module 10")

    q(577, "Which fundamental pricing principle of AWS allows customers to lower costs as their data storage or service consumption grows?", "SINGLE_SELECT", 1, [
        ["A", "Pay less by using more (tiered volume discounts)", True],
        ["B", "Pay more to get faster customer support responses", False],
        ["C", "Pay flat rate regardless of scale", False],
        ["D", "Pay upfront penalties for high bandwidth", False]
    ], "'Pay less by using more' means AWS provides tiered volume discounts. For services like Amazon S3, storage pricing per gigabyte decreases as your total stored volume reaches higher tiers (e.g., first 50 TB, next 450 TB, over 500 TB).", "Pricing Fundamentals", "EASY", ["Volume Discounts", "Tiered Pricing"], "Module 10")

    q(578, "Which direction of network data transfer is typically FREE of charge across virtually all AWS services?", "SINGLE_SELECT", 1, [
        ["A", "Inbound data transfer from the Internet into AWS", True],
        ["B", "Outbound data transfer from AWS to the Internet", False],
        ["C", "Inter-region data transfer across oceans", False],
        ["D", "Data transfer out to on-premises networks over VPN", False]
    ], "Inbound data transfer from the Internet into AWS resources is completely free across all AWS services. AWS charges for outbound data transfer to the Internet (Data Transfer OUT) after the initial 100 GB/month free tier allowance.", "Pricing Fundamentals", "EASY", ["Data Transfer", "Inbound Free"], "Module 10")

    q(579, "Which network data transfer scenario incurs data transfer charges? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Transferring data outbound from an Amazon EC2 instance to the public Internet", True],
        ["B", "Transferring data between two EC2 instances located in different AWS Regions", True],
        ["C", "Uploading files from a corporate laptop into an Amazon S3 bucket (inbound)", False],
        ["D", "Transferring data between an EC2 instance and an S3 bucket within the exact same AWS Region", False],
        ["E", "Inbound network traffic arriving through an Internet Gateway", False]
    ], "Data transfer outbound to the Internet and inter-region data transfer (moving data between two different AWS Regions) incur standard data egress fees. Inbound traffic and same-region S3 transfers are free.", "Pricing Fundamentals", "MEDIUM", ["Data Transfer Costs", "Outbound", "Inter-Region"], "Module 10")

    q(580, "Which tool should an architect use to model and estimate the expected monthly cost of a proposed multi-tier AWS architecture before creating any resources?", "SINGLE_SELECT", 1, [
        ["A", "AWS Pricing Calculator", True],
        ["B", "AWS Cost Explorer", False],
        ["C", "AWS Budgets", False],
        ["D", "AWS Systems Manager", False]
    ], "The AWS Pricing Calculator is a web-based planning tool that allows you to create cost estimates for your proposed architecture use cases on AWS before deploying any resources, with shareable summary links.", "Cost Management Tools", "EASY", ["Pricing Calculator", "Cost Estimation"], "Module 10")

    q(581, "What was the previous name of the AWS tool replaced by the AWS Pricing Calculator?", "SINGLE_SELECT", 1, [
        ["A", "AWS Simple Monthly Calculator", True],
        ["B", "AWS Total Cost of Ownership (TCO) Calculator", False],
        ["C", "AWS Billing Manager", False],
        ["D", "AWS Cost Matrix", False]
    ], "The AWS Pricing Calculator is the modern, interactive replacement for the retired AWS Simple Monthly Calculator, providing granular estimates for newer AWS instance types and services.", "Cost Management Tools", "MEDIUM", ["Pricing Calculator", "Simple Monthly Calculator"], "Module 10")

    q(582, "Which pricing principle rewards customers who commit to consistent compute usage (e.g., measured in $/hour) for a 1-year or 3-year period?", "SINGLE_SELECT", 1, [
        ["A", "Save when you commit (Savings Plans and Reserved Instances)", True],
        ["B", "Pay-as-you-go On-Demand", False],
        ["C", "Always Free tier", False],
        ["D", "Dynamic Spot bidding", False]
    ], "'Save when you commit' allows customers to achieve savings of up to 72% over On-Demand rates by committing to a consistent amount of compute usage (e.g., $10/hour) for a 1-year or 3-year term via Savings Plans or Reserved Instances.", "Pricing Fundamentals", "EASY", ["Commitment", "Savings Plans", "Reserved"], "Module 10")

    q(583, "How does AWS achieve economies of scale that enable frequent price reductions for customers?", "SINGLE_SELECT", 1, [
        ["A", "As hundreds of thousands of customers use AWS, AWS can procure hardware at massive scale and pass the resulting cost savings back to customers as lower prices", True],
        ["B", "By charging customers hidden monthly maintenance fees", False],
        ["C", "By reducing the durability of stored customer data", False],
        ["D", "By eliminating 24/7 technical customer support", False]
    ], "As AWS grows, the scale of infrastructure and operations creates massive economies of scale. AWS continuously optimizes operational efficiencies and passes those savings back to customers in the form of lower pricing.", "Pricing Fundamentals", "EASY", ["Economies of Scale", "Cloud Economics"], "Module 10")

    q(584, "Under the AWS Free Tier, how many hours per month of Amazon EC2 t2.micro (or t3.micro in regions where t2 is unavailable) are included for the first 12 months?", "SINGLE_SELECT", 1, [
        ["A", "750 hours per month (enough to run one instance continuously 24/7)", True],
        ["B", "100 hours per month", False],
        ["C", "50 hours per month", False],
        ["D", "24 hours per month", False]
    ], "The AWS Free Tier includes 750 hours of Linux and 750 hours of Windows t2.micro/t3.micro instances each month for 12 months, which is sufficient to keep a single instance running continuously all month.", "Free Tier", "MEDIUM", ["Free Tier Hours", "750 Hours"], "Module 10")

    q(585, "Which storage amount is provided free per month for the first 12 months under the AWS Free Tier for Amazon S3 Standard?", "SINGLE_SELECT", 1, [
        ["A", "5 GB of standard storage, 20,000 GET requests, and 2,000 PUT requests", True],
        ["B", "100 GB of standard storage", False],
        ["C", "1 TB of standard storage", False],
        ["D", "500 MB of standard storage", False]
    ], "The S3 Free Tier offer includes 5 GB of Amazon S3 standard storage, 20,000 GET requests, and 2,000 PUT requests per month for 12 months following initial AWS account registration.", "Free Tier", "MEDIUM", ["S3 Free Tier", "5 GB"], "Module 10")

    q(586, "What is a 'Short-Term Trial' in the AWS Free Tier?", "SINGLE_SELECT", 1, [
        ["A", "A free trial that activates when a specific service is first used, lasting for a defined period or until a usage quota is met", True],
        ["B", "A 1-hour phone consultation with an AWS sales executive", False],
        ["C", "A trial that requires paying a non-refundable deposit", False],
        ["D", "A trial only available during Amazon Prime Day", False]
    ], "Short-Term Trials are free trial offers that activate on the day you first start using a specific service (e.g., 30 days of Amazon Inspector or Amazon GuardDuty free), regardless of when your AWS account was originally created.", "Free Tier", "MEDIUM", ["Short-Term Trials", "Service Trial"], "Module 10")

    q(587, "What happens if a customer exceeds the free usage tier limits within a given month?", "SINGLE_SELECT", 1, [
        ["A", "Standard pay-as-you-go On-Demand service rates apply to any usage exceeding the free tier allowance", True],
        ["B", "The entire AWS account is suspended and all instances are terminated", False],
        ["C", "AWS issues a warning fine of $500", False],
        ["D", "The account is permanently converted to an Enterprise Support agreement", False]
    ], "If your resource usage exceeds the monthly Free Tier limits, your account is simply charged standard pay-as-you-go service rates for the additional usage beyond the free tier limits.", "Free Tier", "EASY", ["Free Tier Overage", "Pay-As-You-Go"], "Module 10")

    q(588, "Does Amazon RDS include free tier hours during the first 12 months of account registration?", "SINGLE_SELECT", 1, [
        ["A", "Yes, 750 hours per month of db.t2.micro/db.t3.micro/db.t4g.micro Single-AZ instance usage with 20 GB of general purpose SSD storage", True],
        ["B", "No, Amazon RDS is strictly a paid enterprise service with no free tier", False],
        ["C", "Only for Oracle Enterprise Edition clusters", False],
        ["D", "Yes, but only for multi-AZ Aurora clusters", False]
    ], "The RDS Free Tier provides 750 hours per month of db.t2.micro/db.t3.micro/db.t4g.micro Single-AZ instance usage running MySQL, MariaDB, or PostgreSQL, along with 20 GB of general-purpose SSD storage and 20 GB of automated backup storage.", "Free Tier", "MEDIUM", ["RDS Free Tier", "750 Hours"], "Module 10")

    q(589, "Which AWS pricing concept describes a customer paying an upfront amount to lock in lower hourly rates on Reserved Instances?", "SINGLE_SELECT", 1, [
        ["A", "Payment options: All Upfront, Partial Upfront, and No Upfront", True],
        ["B", "Debit, Credit, or Cryptocurrency", False],
        ["C", "Fixed, Variable, and Floating rates", False],
        ["D", "Weekly, Monthly, and Annual cash payments", False]
    ], "Reserved Instances and Savings Plans offer three payment options: All Upfront (greatest discount), Partial Upfront (balanced discount), and No Upfront (smaller discount paid entirely monthly).", "Pricing Fundamentals", "MEDIUM", ["Payment Options", "All Upfront", "Partial Upfront"], "Module 10")

    q(590, "Why is data transfer between two Amazon EC2 instances in different Availability Zones within the same Region billed, while data transfer in the same AZ using private IPs is free?", "SINGLE_SELECT", 1, [
        ["A", "Traffic between AZs traverses the redundant inter-AZ optical metro backbone, incurring modest inter-AZ networking charges ($0.01/GB each direction)", True],
        ["B", "AWS penalizes multi-AZ architecture to encourage single AZ deployments", False],
        ["C", "Inter-AZ traffic requires satellite communication links", False],
        ["D", "The AWS console imposes an administrative fee on cross-AZ routes", False]
    ], "Data transfer between EC2 instances in different Availability Zones within the same Region incurs standard inter-AZ data transfer fees ($0.01 per GB in and out) for crossing AZ network boundaries.", "Pricing Fundamentals", "HARD", ["Inter-AZ Data Transfer", "Costs"], "Module 10")

    # -------------------------------------------------------------
    # 2. Billing & Cost Management Tools (CP-591 to CP-615) - 25 questions
    # -------------------------------------------------------------
    q(591, "What is AWS Cost Explorer?", "SINGLE_SELECT", 1, [
        ["A", "A tool that enables you to visualize, understand, and manage your AWS costs and usage over time, including forecasting future spend up to 12 months", True],
        ["B", "An IDE plugin for debugging Java applications", False],
        ["C", "A security vulnerability assessment scanner", False],
        ["D", "A hardware barcode reader for warehouse assets", False]
    ], "AWS Cost Explorer provides an easy-to-use interface that lets you visualize, understand, and manage your AWS costs and usage over time. It creates custom reports and forecasts spending up to 12 months into the future.", "Cost Management Tools", "EASY", ["Cost Explorer", "Visualization", "Forecasting"], "Module 10")

    q(592, "What is the primary function of AWS Budgets?", "SINGLE_SELECT", 1, [
        ["A", "To set custom cost and usage limits that trigger automated email or SNS alerts when actual or forecasted spend exceeds your defined thresholds", True],
        ["B", "To negotiate lower hardware prices directly with Amazon suppliers", False],
        ["C", "To automatically liquidate underperforming company stock", False],
        ["D", "To restrict employees from browsing social media during work hours", False]
    ], "AWS Budgets allows you to track and set custom budgets for costs, usage, reservations, and Savings Plans. You receive alerts (via SNS or email) when actual or forecasted metrics exceed your threshold.", "Cost Management Tools", "EASY", ["AWS Budgets", "Alerts", "Thresholds"], "Module 10")

    q(593, "How does AWS Budgets differ from AWS Cost Explorer?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cost Explorer is designed for historical visualization and forecasting; AWS Budgets is designed for setting proactive alerts and automated actions when spending limits are reached", True],
        ["B", "AWS Budgets is only for educational accounts; Cost Explorer is for commercial enterprises", False],
        ["C", "Cost Explorer cannot display past data; Budgets cannot send alerts", False],
        ["D", "There is no difference between the two tools", False]
    ], "Cost Explorer is an analytics tool used to visualize and analyze historical spending patterns and project future costs. AWS Budgets is a proactive governance tool used to define targets and trigger alerts when costs or usage exceed limits.", "Cost Management Tools", "MEDIUM", ["Cost Explorer vs Budgets", "Proactive vs Historical"], "Module 10")

    q(594, "What is the most detailed and comprehensive source of AWS billing and usage data available, delivering raw CSV or Parquet files to an Amazon S3 bucket?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cost and Usage Report (AWS CUR)", True],
        ["B", "AWS Monthly Billing Summary PDF", False],
        ["C", "AWS Trusted Advisor Report", False],
        ["D", "Amazon CloudWatch Metrics Export", False]
    ], "The AWS Cost and Usage Report (CUR) is the single most comprehensive dataset of AWS cost and usage available. It lists usage for each service category used by an account and its IAM users in hourly or daily line items delivered to S3.", "Cost Management Tools", "MEDIUM", ["CUR", "Cost and Usage Report"], "Module 10")

    q(595, "What are Cost Allocation Tags in AWS?", "SINGLE_SELECT", 1, [
        ["A", "Key-value labels attached to AWS resources used to organize, track, and categorize resource costs on your AWS billing reports", True],
        ["B", "Physical RFID security badges worn by datacenter employees", False],
        ["C", "Discount coupons distributed via marketing newsletters", False],
        ["D", "DNS records used to route internal microservices", False]
    ], "Cost Allocation Tags are metadata key-value pairs (e.g., Environment: Production, CostCenter: 1042) that you attach to AWS resources. Once activated in the Billing console, AWS organizes cost data by tags on billing reports and Cost Explorer.", "Cost Management Tools", "EASY", ["Cost Allocation Tags", "Metadata"], "Module 10")

    q(596, "What are the two categories of Cost Allocation Tags available in AWS?", "SINGLE_SELECT", 1, [
        ["A", "AWS-Generated Tags (e.g., aws:createdBy) and User-Defined Tags (e.g., Project: Alpha)", True],
        ["B", "Public Tags and Private Tags", False],
        ["C", "Hardware Tags and Software Tags", False],
        ["D", "Encrypted Tags and Plaintext Tags", False]
    ], "Cost Allocation Tags consist of: 1) AWS-Generated Tags (prefixed with 'aws:' such as aws:createdBy, automatically applied by AWS), and 2) User-Defined Tags (created and applied directly by users, e.g., CostCenter, Owner, Environment).", "Cost Management Tools", "MEDIUM", ["Tag Categories", "User-Defined", "AWS-Generated"], "Module 10")

    q(597, "Before Cost Allocation Tags appear on AWS billing reports or in AWS Cost Explorer, what mandatory step must be taken by an administrator?", "SINGLE_SELECT", 1, [
        ["A", "The tags must be explicitly activated in the AWS Billing and Cost Management console", True],
        ["B", "The AWS account must be upgraded to Enterprise Support", False],
        ["C", "All EC2 instances must be rebooted", False],
        ["D", "A formal request ticket must be submitted to AWS Premium Support", False]
    ], "Creating a tag on a resource does not automatically make it appear on billing statements. An administrator must explicitly activate the tag as a Cost Allocation Tag in the Billing and Cost Management console.", "Cost Management Tools", "HARD", ["Tag Activation", "Billing Console"], "Module 10")

    q(598, "What is AWS Cost Anomaly Detection?", "SINGLE_SELECT", 1, [
        ["A", "A machine learning service that continuously monitors cost and usage to identify anomalous spending and root causes automatically", True],
        ["B", "A tool that detects corrupted hard drive sectors on EBS volumes", False],
        ["C", "A security scanner that finds infected JavaScript files", False],
        ["D", "A tool that spots counterfeit credit cards during signup", False]
    ], "AWS Cost Anomaly Detection uses advanced machine learning models to identify unexpected spending spikes and detect cost anomalies across your AWS accounts, identifying the root cause service and alerting administrators.", "Cost Management Tools", "MEDIUM", ["Cost Anomaly Detection", "Machine Learning"], "Module 10")

    q(599, "What is AWS Billing Conductor?", "SINGLE_SELECT", 1, [
        ["A", "A customizable billing service that allows enterprises and AWS Solution Providers to customize, model, and allocate pro forma billing rates for internal business units or end customers", True],
        ["B", "A musical orchestration tool built for Amazon Studios", False],
        ["C", "A physical electrical cable routing device inside server chassis", False],
        ["D", "A credit scoring tool used for corporate credit card applications", False]
    ], "AWS Billing Conductor is a fully managed service that provides a customizable billing engine to model the billing relationship between you and your customers or internal business units, generating customized pro-forma invoices.", "Cost Management Tools", "HARD", ["Billing Conductor", "Pro Forma Invoices"], "Module 10")

    q(600, "What action can AWS Budgets automatically trigger when a budget threshold is exceeded (AWS Budget Actions)?", "SINGLE_SELECT", 1, [
        ["A", "Apply an IAM policy, attach a Service Control Policy, or stop specific EC2 or RDS instances", True],
        ["B", "Delete the customer's AWS root account permanently", False],
        ["C", "Automatically charge the customer's secondary credit card", False],
        ["D", "Cancel the company's Internet service provider contract", False]
    ], "AWS Budget Actions allow you to configure automated or semi-automated responses when a budget limit is breached, such as applying a restrictive IAM policy to prevent new resources, or stopping specific EC2 or RDS instances.", "Cost Management Tools", "MEDIUM", ["Budget Actions", "Automation"], "Module 10")

    q(601, "Which tool provides visual recommendations for purchasing Reserved Instances and Savings Plans based on past usage history?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cost Explorer recommendations", True],
        ["B", "AWS CloudFormation designer", False],
        ["C", "Amazon GuardDuty findings", False],
        ["D", "AWS Systems Manager Run Command", False]
    ], "AWS Cost Explorer provides personalized recommendations for purchasing Reserved Instances and Savings Plans by analyzing your historical compute usage over the past 30 or 60 days to calculate potential savings.", "Cost Management Tools", "MEDIUM", ["Cost Explorer Recommendations", "Savings"], "Module 10")

    q(602, "What is the minimum granularity at which AWS Cost and Usage Report (CUR) can break down usage data?", "SINGLE_SELECT", 1, [
        ["A", "Hourly", True],
        ["B", "Per-second", False],
        ["C", "Monthly only", False],
        ["D", "Yearly", False]
    ], "AWS Cost and Usage Reports can be generated with either hourly or daily granularity, providing itemized breakdown of costs, usage quantities, resource IDs, and cost allocation tags.", "Cost Management Tools", "MEDIUM", ["CUR Granularity", "Hourly"], "Module 10")

    q(603, "A company wants to query its raw AWS Cost and Usage Reports (CUR) stored in Amazon S3 using standard SQL syntax. Which combination of services provides this capability serverlessly?", "SINGLE_SELECT", 1, [
        ["A", "Amazon Athena and Amazon S3", True],
        ["B", "AWS Snowcone and Amazon DynamoDB", False],
        ["C", "AWS Direct Connect and Amazon Lightsail", False],
        ["D", "AWS Systems Manager and AWS Artifact", False]
    ], "By delivering the AWS Cost and Usage Report in Parquet format to an S3 bucket and integrating it with the AWS Glue Data Catalog, you can run serverless SQL queries against your detailed billing records using Amazon Athena.", "Cost Management Tools", "MEDIUM", ["CUR", "Athena", "SQL Billing Analysis"], "Module 10")

    q(604, "Which metric can be tracked using AWS Budgets? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Cost budgets (tracking total dollar expenditures)", True],
        ["B", "Usage budgets (tracking usage amounts for specific services like EC2 hours or S3 GB)", True],
        ["C", "Room temperature in AWS server rooms", False],
        ["D", "Typing speed of remote developers", False],
        ["E", "Number of email spam messages received by employees", False]
    ], "AWS Budgets supports: 1) Cost budgets (dollar spend), 2) Usage budgets (measure unit usage, e.g., gigabytes or instance hours), 3) RI utilization and coverage budgets, and 4) Savings Plans utilization and coverage budgets.", "Cost Management Tools", "MEDIUM", ["Budget Types", "Cost and Usage"], "Module 10")

    q(605, "What is an AWS Credit in billing?", "SINGLE_SELECT", 1, [
        ["A", "A promotional or service credit applied directly to an AWS account invoice to offset eligible service charges", True],
        ["B", "A loan provided by Amazon Bank to purchase physical servers", False],
        ["C", "A virtual cryptocurrency token traded on decentralized exchanges", False],
        ["D", "A rating score assessing customer creditworthiness", False]
    ], "AWS Credits are promotional codes or goodwill credits applied to your AWS account balance that automatically offset eligible AWS service charges on your monthly bill until the credit balance or expiration date is reached.", "Cost Management Tools", "EASY", ["AWS Credits", "Promotional"], "Module 10")

    q(606, "Which tool allows you to view your current estimated monthly billing charges directly on the AWS Management Console dashboard?", "SINGLE_SELECT", 1, [
        ["A", "AWS Billing and Cost Management Dashboard", True],
        ["B", "AWS CodeCommit Console", False],
        ["C", "Amazon Route 53 Dashboard", False],
        ["D", "AWS Certificate Manager", False]
    ], "The AWS Billing and Cost Management dashboard gives a high-level summary of your current estimated charges, month-to-date spending, highest-spend services, and budget tracking widgets.", "Cost Management Tools", "EASY", ["Billing Dashboard", "Overview"], "Module 10")

    q(607, "Can AWS Cost Explorer forecast costs for unreleased AWS services that your account has never deployed?", "SINGLE_SELECT", 1, [
        ["A", "No, Cost Explorer forecasts future spend based solely on the account's historical usage data patterns", True],
        ["B", "Yes, Cost Explorer uses psychic machine learning to predict any future software release", False],
        ["C", "Yes, if an enterprise contract is signed", False],
        ["D", "Only for Amazon S3 storage classes", False]
    ], "AWS Cost Explorer's forecasting algorithm relies on historical spending and consumption models over past months. It cannot forecast costs for services or architectures that have zero historical usage data.", "Cost Management Tools", "MEDIUM", ["Cost Explorer Forecasting", "Limitations"], "Module 10")

    q(608, "What is the maximum forecasting horizon available in AWS Cost Explorer?", "SINGLE_SELECT", 1, [
        ["A", "Up to 12 months into the future", True],
        ["B", "Up to 10 years", False],
        ["C", "7 days only", False],
        ["D", "30 days only", False]
    ], "AWS Cost Explorer provides cost and usage forecasts up to 12 months into the future based on past usage patterns and linear regression modeling.", "Cost Management Tools", "MEDIUM", ["Cost Explorer Horizon", "12 Months"], "Module 10")

    q(609, "How can a company receive an alert when their AWS bill is forecasted to exceed $5,000 by the end of the current month?", "SINGLE_SELECT", 1, [
        ["A", "Create an AWS Budget with a forecasted spend threshold of $5,000 and configure an email notification", True],
        ["B", "Call Amazon headquarters every morning on the telephone", False],
        ["C", "Set up an IAM password expiration policy", False],
        ["D", "Reboot all EC2 instances once weekly", False]
    ], "AWS Budgets allows you to set an alert based on forecasted spend. If current consumption trends indicate that the monthly total will exceed the $5,000 threshold, AWS Budgets sends an alert before the overrun occurs.", "Cost Management Tools", "MEDIUM", ["Forecasted Budget", "Alerts"], "Module 10")

    q(610, "Which AWS service provides an aggregated view of resource tags across multiple AWS services and AWS accounts?", "SINGLE_SELECT", 1, [
        ["A", "AWS Resource Groups & Tag Editor", True],
        ["B", "AWS Systems Manager Session Manager", False],
        ["C", "AWS Shield Advanced", False],
        ["D", "Amazon Inspector", False]
    ], "AWS Resource Groups and Tag Editor lets you search, view, and edit tags across hundreds of AWS resources simultaneously across multiple regions in your account.", "Cost Management Tools", "MEDIUM", ["Tag Editor", "Resource Groups"], "Module 10")

    q(611, "Which AWS pricing model is best suited for an application that runs 24/7 with steady, unchanging compute requirements over a 3-year production lifecycle?", "SINGLE_SELECT", 1, [
        ["A", "Compute Savings Plans or Standard Reserved Instances with 3-year commitment", True],
        ["B", "On-Demand Instances with zero upfront payment", False],
        ["C", "Spot Instances with dynamic bid prices", False],
        ["D", "Short-term trial licenses", False]
    ], "For continuous, steady-state baseline workloads with a 3-year timeline, a 3-year Savings Plan or Reserved Instance offers the maximum available cost discount (up to 72%) compared to paying On-Demand rates.", "Pricing Fundamentals", "EASY", ["Commitment Discount", "3-Year"], "Module 10")

    q(612, "What is the primary purpose of AWS Purchase Order Management in the Billing console?", "SINGLE_SELECT", 1, [
        ["A", "To configure and manage enterprise Purchase Orders (POs) and map them to AWS electronic billing invoices", True],
        ["B", "To purchase office furniture from Amazon.com", False],
        ["C", "To place bulk orders for AWS server racks", False],
        ["D", "To order promotional t-shirts for AWS conferences", False]
    ], "AWS Purchase Order Management allows enterprise finance departments to define, track, and manage corporate Purchase Orders (POs) directly in the AWS Billing console so that invoices automatically reflect corresponding PO numbers.", "Cost Management Tools", "HARD", ["Purchase Orders", "Enterprise Billing"], "Module 10")

    q(613, "How does AWS calculate charges for Amazon EBS gp3 volumes?", "SINGLE_SELECT", 1, [
        ["A", "Based on provisioned storage capacity (GB-month), with baseline IOPS (3,000) and throughput (125 MB/s) included free, charging only for provisioned performance above those baselines", True],
        ["B", "Based on the number of files saved on the disk", False],
        ["C", "A flat fee of $10 per volume regardless of size", False],
        ["D", "Only when instances are turned off", False]
    ], "Amazon EBS gp3 volumes provide 3,000 baseline IOPS and 125 MB/s throughput included free with storage capacity (GB-months). Additional IOPS and throughput can be scaled independently and billed per unit.", "Cost Management Tools", "HARD", ["EBS gp3 Pricing", "IOPS"], "Module 10")

    q(614, "Which billing tool sends daily, weekly, or monthly automated budget email reports to designated stakeholders without requiring them to log in to the AWS console?", "SINGLE_SELECT", 1, [
        ["A", "AWS Budget Reports", True],
        ["B", "AWS Systems Manager Patch Manager", False],
        ["C", "AWS CloudTrail Event History", False],
        ["D", "Amazon Route 53 Resolver", False]
    ], "AWS Budget Reports allows you to create scheduled email reports that automatically deliver the status of your existing budgets to corporate stakeholders (e.g., department managers) on a daily, weekly, or monthly cadence.", "Cost Management Tools", "MEDIUM", ["Budget Reports", "Stakeholder Communication"], "Module 10")

    q(615, "Are there fees for using AWS Cost Explorer or AWS Budgets?", "SINGLE_SELECT", 1, [
        ["A", "AWS Cost Explorer is free to access via the console; your first 2 budgets in AWS Budgets are free ($0.02 per day per active budget thereafter)", True],
        ["B", "Both tools cost $1,000 per month flat fee", False],
        ["C", "Cost Explorer costs $50 per click in the UI", False],
        ["D", "Both services are strictly prohibited on free tier accounts", False]
    ], "Accessing the AWS Cost Explorer UI is completely free. With AWS Budgets, your first two action-enabled budgets are completely free, and each additional active budget costs just $0.02 per day (about $0.60 per month).", "Cost Management Tools", "MEDIUM", ["Cost Explorer Pricing", "Budgets Pricing"], "Module 10")

    # -------------------------------------------------------------
    # 3. AWS Organizations & Consolidated Billing (CP-616 to CP-628) - 13 questions
    # -------------------------------------------------------------
    q(616, "What is AWS Organizations?", "SINGLE_SELECT", 1, [
        ["A", "An account management service that enables you to consolidate multiple AWS accounts into an organization that you centrally manage and govern", True],
        ["B", "A labor union representing cloud engineers", False],
        ["C", "A public directory of Fortune 500 companies", False],
        ["D", "A charity foundation run by AWS", False]
    ], "AWS Organizations helps you centrally manage and govern your environment as you grow and scale your AWS resources. It provides consolidated billing, access control, compliance policies, and automated account provisioning.", "Organizations & Governance", "EASY", ["Organizations", "Governance"], "Module 12")

    q(617, "What is Consolidated Billing in AWS Organizations?", "SINGLE_SELECT", 1, [
        ["A", "A billing feature that combines the usage and charges of all member accounts into a single monthly bill paid by the management account", True],
        ["B", "A feature that divides an invoice into 12 equal monthly installments", False],
        ["C", "A policy that deletes invoices after payment", False],
        ["D", "A tool that converts AWS bills into foreign currencies", False]
    ], "Consolidated billing aggregates the charges from all member accounts in an organization onto one single, consolidated monthly bill that is paid by the primary management account.", "Organizations & Governance", "EASY", ["Consolidated Billing", "Single Bill"], "Module 12")

    q(618, "What financial benefit does Consolidated Billing provide when multiple member accounts store large amounts of data in Amazon S3?", "SINGLE_SELECT", 1, [
        ["A", "S3 volume tiering aggregates storage across all linked accounts, allowing the organization to reach cheaper per-GB tiers faster", True],
        ["B", "S3 becomes 100% free for all member accounts", False],
        ["C", "AWS refunds 50% of the S3 cost at the end of each year", False],
        ["D", "S3 data is automatically mirrored to competitor cloud providers", False]
    ], "Consolidated billing combines the storage usage of all accounts in the organization. This allows the combined usage to qualify for higher-volume discount tiers on services like Amazon S3 and data transfer faster than individual accounts could alone.", "Organizations & Governance", "MEDIUM", ["Volume Tiering", "S3 Tiering", "Discounts"], "Module 12")

    q(619, "Can Reserved Instances and Savings Plans purchased by one account in an organization share discounts with other member accounts?", "SINGLE_SELECT", 1, [
        ["A", "Yes, RI and Savings Plans discount sharing is enabled across accounts in consolidated billing by default (unless explicitly turned off)", True],
        ["B", "No, discounts are strictly locked to the specific account that purchased them", False],
        ["C", "Only if both accounts have root passwords shared", False],
        ["D", "Only between accounts in different AWS Regions", False]
    ], "By default, the cost benefits of Reserved Instances and Savings Plans are shared across all linked accounts in an AWS Organization, maximizing utilization and ensuring excess reserved capacity isn't wasted.", "Organizations & Governance", "MEDIUM", ["RI Sharing", "Savings Plans Sharing"], "Module 12")

    q(620, "What is the role of the Management Account (formerly Master Account) in AWS Organizations?", "SINGLE_SELECT", 1, [
        ["A", "The central administrative account that creates the organization, invites member accounts, pays the consolidated bill, and manages policies", True],
        ["B", "A temporary account deleted after 30 days", False],
        ["C", "An account used exclusively by third-party auditors", False],
        ["D", "A public account accessible to anyone on the Internet", False]
    ], "The management account is the primary account that owns the organization. It pays the consolidated monthly bill, creates or invites member accounts, and manages organizational policies like Service Control Policies (SCPs).", "Organizations & Governance", "MEDIUM", ["Management Account", "Organizations"], "Module 12")

    q(621, "What are Service Control Policies (SCPs) in AWS Organizations?", "SINGLE_SELECT", 1, [
        ["A", "Organization policies used to specify the maximum permissions boundary for member accounts and Organizational Units (OUs)", True],
        ["B", "Scripts that automatically restart failed EC2 instances", False],
        ["C", "Corporate code-of-conduct guidelines for remote employees", False],
        ["D", "DNS routing rules configured in Amazon Route 53", False]
    ], "Service Control Policies (SCPs) are JSON policy documents that define the maximum permissions that can be granted to IAM identities within member accounts or Organizational Units (OUs) in an organization.", "Organizations & Governance", "MEDIUM", ["SCPs", "Service Control Policies", "Governance"], "Module 12")

    q(622, "Do Service Control Policies (SCPs) grant permissions to users or roles by themselves?", "SINGLE_SELECT", 1, [
        ["A", "No, SCPs only set guardrails (filters) on maximum allowed permissions; an IAM policy inside the account must still grant permissions", True],
        ["B", "Yes, attaching an SCP gives full administrative permissions automatically", False],
        ["C", "Yes, SCPs replace the need for IAM policies entirely", False],
        ["D", "Only when applied to the root account", False]
    ], "SCPs act as guardrails or filters. They never grant permissions on their own; they only specify the maximum permissions available. An IAM policy attached to a user or role inside the account is still required to grant actual access.", "Organizations & Governance", "HARD", ["SCPs Guardrails", "Permissions Boundary"], "Module 12")

    q(623, "Can a Service Control Policy (SCP) restrict actions taken by the Management Account of an AWS Organization?", "SINGLE_SELECT", 1, [
        ["A", "No, SCPs do not apply to the Management Account; they only apply to member accounts and Organizational Units", True],
        ["B", "Yes, SCPs apply equally to the Management Account and all member accounts", False],
        ["C", "Only if the root password has 20 characters", False],
        ["D", "Yes, if configured by AWS Support", False]
    ], "Service Control Policies (SCPs) do NOT affect users or roles in the management account. They apply only to member accounts in the organization, which is why production workloads should never run in the management account.", "Organizations & Governance", "HARD", ["SCP Exception", "Management Account"], "Module 12")

    q(624, "Which capability in the AWS Billing and Cost Management console allows administrators to view and manage tax registration numbers (TRN) centrally across all linked accounts in an organization?", "SINGLE_SELECT", 1, [
        ["A", "AWS Tax Settings", True],
        ["B", "AWS Artifact", False],
        ["C", "AWS Systems Manager", False],
        ["D", "AWS License Manager", False]
    ], "AWS Tax Settings in the Billing and Cost Management console enables customers to view, manage, and edit tax registration numbers (TRNs), tax exemptions, and business legal addresses across multiple linked accounts in an AWS Organization centrally.", "Organizations & Governance", "HARD", ["Tax Settings", "Organizations", "Consolidated Billing"], "Module 12")

    q(625, "Which AWS service works with AWS Organizations to centrally govern, set up, and enforce security and compliance standards across a multi-account environment using predefined landing zones?", "SINGLE_SELECT", 1, [
        ["A", "AWS Control Tower", True],
        ["B", "AWS CodePipeline", False],
        ["C", "Amazon CloudWatch", False],
        ["D", "AWS DataSync", False]
    ], "AWS Control Tower provides the easiest way to set up and govern a secure, multi-account AWS environment (a landing zone) based on best practices, orchestrating AWS Organizations, IAM Identity Center, and AWS Config.", "Organizations & Governance", "MEDIUM", ["Control Tower", "Landing Zone", "Multi-Account"], "Module 12")

    q(626, "How does Consolidated Billing handle multiple member accounts that each have a separate AWS Free Tier allowance?", "SINGLE_SELECT", 1, [
        ["A", "Free Tier limits are shared across the organization as if all accounts were a single account (meaning only one 750-hour EC2 allowance for the organization)", True],
        ["B", "Every member account receives an independent free tier allowance that stacks multiplicatively", False],
        ["C", "Free Tier is completely disabled when consolidated billing is activated", False],
        ["D", "Member accounts are charged double standard rates", False]
    ], "For billing purposes, AWS treats all accounts in an organization as if they were a single account. Therefore, free tier limits (e.g., 750 hours/month of EC2 micro instances) apply once across the entire organization, not per member account.", "Organizations & Governance", "HARD", ["Free Tier Sharing", "Consolidated Billing"], "Module 12")

    q(627, "Which service enables you to securely share AWS resources (such as VPC subnets, Transit Gateways, and Route 53 Resolver rules) across accounts in your AWS Organization?", "SINGLE_SELECT", 1, [
        ["A", "AWS Resource Access Manager (AWS RAM)", True],
        ["B", "AWS Systems Manager", False],
        ["C", "AWS Direct Connect", False],
        ["D", "Amazon Simple Queue Service", False]
    ], "AWS Resource Access Manager (AWS RAM) helps you securely share your resources across AWS accounts, within your organization or organizational units (OUs), eliminating the need to create duplicate resources in multiple accounts.", "Organizations & Governance", "MEDIUM", ["AWS RAM", "Resource Sharing"], "Module 12")

    q(628, "What is the recommended best practice regarding running production application workloads in the AWS Organizations Management Account?", "SINGLE_SELECT", 1, [
        ["A", "Do not run production workloads in the management account; isolate them in dedicated member accounts", True],
        ["B", "Run all corporate workloads exclusively in the management account for ease of access", False],
        ["C", "Share the management account root credentials with all contractors", False],
        ["D", "Disable MFA on the management account", False]
    ], "AWS strongly recommends using the management account solely for administrative, governance, and billing functions. Workloads should always be separated into dedicated member accounts to limit blast radius and maintain security guardrails.", "Organizations & Governance", "MEDIUM", ["Best Practice", "Management Account Isolation"], "Module 12")

    # -------------------------------------------------------------
    # 4. AWS Support Plans & Trusted Advisor (CP-629 to CP-645) - 17 questions
    # -------------------------------------------------------------
    q(629, "What are the four primary tiers of AWS Support available to customers?", "SINGLE_SELECT", 1, [
        ["A", "Basic, Developer, Business, and Enterprise (plus Enterprise On-Ramp)", True],
        ["B", "Free, Silver, Gold, and Platinum", False],
        ["C", "Standard, Premium, Ultimate, and Extreme", False],
        ["D", "Community, Individual, Corporate, and Government", False]
    ], "The official AWS Support plans are: Basic (included for all accounts), Developer (for experimenting/prototyping), Business (for production workloads), Enterprise On-Ramp, and Enterprise (for mission-critical workloads).", "AWS Support Plans", "EASY", ["Support Plans", "Tiers"], "Module 10")

    q(630, "Which features are included with the Basic Support plan that is provided to all AWS customers at no additional cost? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "24/7 access to customer service, documentation, whitepapers, and support forums", True],
        ["B", "Access to the 7 core AWS Trusted Advisor checks and the AWS Health Dashboard", True],
        ["C", "A designated Technical Account Manager (TAM) assigned to the company", False],
        ["D", "15-minute response times for mission-critical production outages", False],
        ["E", "Phone and chat access to Cloud Support Engineers for technical architecture advice", False]
    ], "Basic Support includes 24/7 access to customer service (billing and account assistance), technical whitepapers, documentation, support forums, the AWS Health Dashboard, and 7 core Trusted Advisor checks. It does not include technical support cases.", "AWS Support Plans", "MEDIUM", ["Basic Support", "Free Tier"], "Module 10")

    q(631, "Which is the lowest AWS Support plan that provides access to Cloud Support Engineers 24 hours a day, 7 days a week via phone, chat, and email?", "SINGLE_SELECT", 1, [
        ["A", "Business Support Plan", True],
        ["B", "Developer Support Plan", False],
        ["C", "Basic Support Plan", False],
        ["D", "Free Tier Support", False]
    ], "The Business Support plan is the lowest tier that provides 24/7 access to Cloud Support Engineers via phone, web chat, and email for an unlimited number of contacts and cases. The Developer plan only provides business-hours email access.", "AWS Support Plans", "EASY", ["Business Support", "24/7 Support"], "Module 10")

    q(632, "Which AWS Support plan provides business-hours email access to Cloud Support Associates for 1 primary contact?", "SINGLE_SELECT", 1, [
        ["A", "Developer Support Plan", True],
        ["B", "Basic Support Plan", False],
        ["C", "Enterprise Support Plan", False],
        ["D", "Enterprise On-Ramp Plan", False]
    ], "The Developer Support plan is designed for early development or prototyping on AWS. It provides business-hours email access to Cloud Support Associates for one primary contact, with general guidance response times under 24 hours.", "AWS Support Plans", "EASY", ["Developer Support", "Business Hours"], "Module 10")

    q(633, "Which AWS Support plan includes a designated Technical Account Manager (TAM) who provides proactive architectural reviews and ongoing operational guidance?", "SINGLE_SELECT", 1, [
        ["A", "Enterprise Support Plan", True],
        ["B", "Business Support Plan", False],
        ["C", "Developer Support Plan", False],
        ["D", "Basic Support Plan", False]
    ], "Enterprise Support provides a designated Technical Account Manager (TAM) who serves as your primary technical point of contact, providing proactive guidance, Well-Architected reviews, and operational planning.", "AWS Support Plans", "EASY", ["Enterprise Support", "TAM", "Technical Account Manager"], "Module 10")

    q(634, "What is the response time for a 'Production system down' case under the AWS Business Support plan?", "SINGLE_SELECT", 1, [
        ["A", "Less than 1 hour", True],
        ["B", "Less than 15 minutes", False],
        ["C", "Less than 4 hours", False],
        ["D", "Less than 24 hours", False]
    ], "Under the Business Support plan, the guaranteed initial response time SLA for a 'Production system down' severity case is less than 1 hour (Enterprise plan provides < 15 minutes for 'Business-critical system down').", "AWS Support Plans", "MEDIUM", ["SLA", "Business Support", "1 Hour Response"], "Module 10")

    q(635, "What is the response time target for a 'Business-critical system down' case under the Enterprise Support plan?", "SINGLE_SELECT", 1, [
        ["A", "Less than 15 minutes", True],
        ["B", "Less than 1 hour", False],
        ["C", "Less than 30 minutes", False],
        ["D", "Less than 2 hours", False]
    ], "Under the Enterprise Support plan, AWS commits to an initial response time of less than 15 minutes (24/7) for 'Business-critical system down' severity cases.", "AWS Support Plans", "MEDIUM", ["Enterprise SLA", "15 Minutes"], "Module 10")

    q(636, "Which team included with Enterprise Support assists customers with billing, invoice inquiries, and account management best practices?", "SINGLE_SELECT", 1, [
        ["A", "AWS Concierge Support Team", True],
        ["B", "AWS Red Team", False],
        ["C", "AWS Data Pipeline specialists", False],
        ["D", "AWS Hardware Replacement Crew", False]
    ], "The AWS Support Concierge is a senior customer service partner assigned to Enterprise Support customers, dedicated to analyzing billing structures, payment methods, consolidated billing, and account operational best practices.", "AWS Support Plans", "MEDIUM", ["Concierge Support", "Enterprise"], "Module 10")

    q(637, "What is AWS Infrastructure Event Management (IEM)?", "SINGLE_SELECT", 1, [
        ["A", "A structured program that provides architectural guidance and real-time operational support during critical planned events like product launches or marketing promotions", True],
        ["B", "A party planning committee for tech conferences", False],
        ["C", "An automated tool that reboots server racks during lightning storms", False],
        ["D", "An insurance policy reimbursing lost e-commerce revenue", False]
    ], "Infrastructure Event Management (IEM) is a short-term engagement offering architectural reviews, capacity planning, and real-time support during planned high-profile events (e.g., product launches, Black Friday sales). Included with Enterprise Support.", "AWS Support Plans", "MEDIUM", ["IEM", "Infrastructure Event Management"], "Module 10")

    q(638, "What is AWS Trusted Advisor?", "SINGLE_SELECT", 1, [
        ["A", "An automated online tool that analyzes your AWS environment and provides real-time recommendations across five pillars to help follow AWS best practices", True],
        ["B", "A legal advisor hired to draft corporate contracts", False],
        ["C", "A personal career mentor assigned to junior cloud developers", False],
        ["D", "A hardware tester evaluating server motherboards", False]
    ], "AWS Trusted Advisor is an online tool that acts like your customized cloud advisor, inspecting your AWS environment and making recommendations to help reduce costs, increase performance, improve security, and monitor service quotas.", "Trusted Advisor", "EASY", ["Trusted Advisor", "Best Practices"], "Module 10")

    q(639, "What are the five core pillars evaluated by AWS Trusted Advisor?", "SINGLE_SELECT", 1, [
        ["A", "Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits (Service Quotas)", True],
        ["B", "Compute, Storage, Database, Networking, and Analytics", False],
        ["C", "HTML, CSS, JavaScript, Python, and SQL", False],
        ["D", "Confidentiality, Integrity, Availability, Durability, and Velocity", False]
    ], "AWS Trusted Advisor evaluates your AWS infrastructure against five core categories: 1) Cost Optimization, 2) Performance, 3) Security, 4) Fault Tolerance, and 5) Service Limits (Service Quotas).", "Trusted Advisor", "EASY", ["Trusted Advisor Pillars", "5 Pillars"], "Module 10")

    q(640, "Which AWS Support plans grant access to the FULL suite of AWS Trusted Advisor checks?", "SINGLE_SELECT", 1, [
        ["A", "Business, Enterprise On-Ramp, and Enterprise Support plans", True],
        ["B", "Basic and Developer Support plans only", False],
        ["C", "Developer Support only", False],
        ["D", "Full checks are unavailable to any commercial customer", False]
    ], "Customers with Business, Enterprise On-Ramp, or Enterprise Support plans receive access to all AWS Trusted Advisor checks. Basic and Developer plans have access only to 7 core security and service limit checks.", "Trusted Advisor", "MEDIUM", ["Trusted Advisor Access", "Full Suite"], "Module 10")

    q(641, "What color indicators are used in the AWS Trusted Advisor dashboard to signify check status?", "SINGLE_SELECT", 1, [
        ["A", "Green (no problem detected), Yellow (investigation recommended), and Red (action recommended)", True],
        ["B", "Blue, Purple, and Orange", False],
        ["C", "Black, White, and Grey", False],
        ["D", "Gold, Silver, and Bronze", False]
    ], "AWS Trusted Advisor uses standard color indicators: Green checkmark (OK, no problem detected), Yellow exclamation (investigation recommended), and Red exclamation (action recommended to resolve a potential risk).", "Trusted Advisor", "EASY", ["Trusted Advisor Status", "Green Yellow Red"], "Module 10")

    q(642, "Which recommendation would be categorized under the 'Cost Optimization' pillar in AWS Trusted Advisor?", "SINGLE_SELECT", 1, [
        ["A", "Unassociated Elastic IP addresses and idle EC2 instances", True],
        ["B", "MFA not enabled on the root account", False],
        ["C", "EBS volume IOPS saturation", False],
        ["D", "Service limit nearing 80% capacity", False]
    ], "The Cost Optimization pillar inspects for resource waste, such as unattached Elastic IP addresses (which incur charges when idle), idle Amazon RDS instances, underutilized EC2 instances, and unattached EBS volumes.", "Trusted Advisor", "MEDIUM", ["Cost Optimization Check", "Idle Resources"], "Module 10")

    q(643, "Which recommendation would be categorized under the 'Security' pillar in AWS Trusted Advisor?", "SINGLE_SELECT", 1, [
        ["A", "Amazon S3 bucket permissions that allow unrestricted public read/write access", True],
        ["B", "EC2 instance CPU utilization below 10%", False],
        ["C", "EBS snapshots older than 30 days", False],
        ["D", "VPC peering connections with low throughput", False]
    ], "The Security pillar alerts you to security vulnerabilities, including S3 buckets with open public access, unrestricted security group ports (0.0.0.0/0 on port 22 or 3389), and missing MFA on the root account.", "Trusted Advisor", "EASY", ["Security Check", "Public S3"], "Module 10")

    q(644, "What is the AWS Health Dashboard?", "SINGLE_SELECT", 1, [
        ["A", "A tool providing relevant and timely information about the health of AWS services that are directly impacting your specific account resources", True],
        ["B", "A health insurance calculator for tech workers", False],
        ["C", "A pedometer app tracking steps taken by server engineers", False],
        ["D", "An automated scanner for office building air quality", False]
    ], "The AWS Health Dashboard gives you personalized visibility into the performance and availability of the AWS services you are using, showing scheduled maintenance notifications and active service incidents affecting your resources.", "AWS Support Plans", "EASY", ["Health Dashboard", "Incident Visibility"], "Module 10")

    q(645, "Which AWS Support plan provides access to consultative architectural reviews such as Well-Architected Reviews conducted by AWS Solutions Architects?", "SINGLE_SELECT", 1, [
        ["A", "Enterprise Support Plan", True],
        ["B", "Developer Support Plan", False],
        ["C", "Basic Support Plan", False],
        ["D", "Trial Support Plan", False]
    ], "Enterprise Support includes proactive consultative architectural reviews, operational health checks, and Well-Architected framework reviews led by your designated Technical Account Manager (TAM).", "AWS Support Plans", "MEDIUM", ["Well-Architected Review", "Enterprise TAM"], "Module 10")

    # -------------------------------------------------------------
    # 5. AWS Marketplace & Service Quotas (CP-646 to CP-650) - 5 questions
    # -------------------------------------------------------------
    q(646, "What is the AWS Marketplace?", "SINGLE_SELECT", 1, [
        ["A", "A curated digital catalog of thousands of third-party software products from Independent Software Vendors (ISVs) that run natively on AWS", True],
        ["B", "An online grocery delivery store run by Amazon Fresh", False],
        ["C", "A consumer flea market for used computer monitors", False],
        ["D", "An auction site for bidding on domain names", False]
    ], "AWS Marketplace is a curated digital catalog with thousands of software listings from independent software vendors (ISVs), making it easy to find, test, buy, and deploy software (AMIs, SaaS, containers) that runs on AWS.", "Marketplace", "EASY", ["Marketplace", "ISV", "Third-Party Software"], "Module 10")

    q(647, "How does billing work for third-party software purchased through the AWS Marketplace?", "SINGLE_SELECT", 1, [
        ["A", "Software licensing fees are consolidated directly onto your regular monthly AWS billing invoice", True],
        ["B", "You must mail physical paper checks directly to the software vendor's headquarters", False],
        ["C", "Third-party software cannot be billed on AWS", False],
        ["D", "Billing is only processed through cryptocurrency escrow accounts", False]
    ], "AWS Marketplace simplifies software procurement by consolidating software charges onto your regular monthly AWS bill, allowing you to pay using your existing AWS payment terms and contracts.", "Marketplace", "EASY", ["Consolidated Invoicing", "Marketplace Billing"], "Module 10")

    q(648, "Which licensing models are supported for software products deployed through the AWS Marketplace? (Select TWO)", "MULTI_SELECT", 2, [
        ["A", "Bring Your Own License (BYOL) to leverage existing enterprise software investments", True],
        ["B", "Pay-as-you-go hourly or annual subscriptions billed through AWS", True],
        ["C", "Compulsory 99-year irrevocable land lease contracts", False],
        ["D", "Barter exchange of consumer electronics", False],
        ["E", "Unlicensed peer-to-peer torrent sharing", False]
    ], "AWS Marketplace supports flexible consumption models including Pay-as-you-go (hourly, monthly, or annual subscriptions) and Bring Your Own License (BYOL) where you reuse your pre-existing software licenses in AWS.", "Marketplace", "MEDIUM", ["BYOL", "Marketplace Licensing"], "Module 10")

    q(649, "What is AWS Service Quotas (formerly Service Limits)?", "SINGLE_SELECT", 1, [
        ["A", "An AWS service that enables you to view and manage your resource usage quotas (service limits) across AWS services from a central location", True],
        ["B", "A government trade quota on imported semiconductors", False],
        ["C", "A monthly limit on the number of emails an employee can send", False],
        ["D", "A restriction on the number of coffee cups allowed in server rooms", False]
    ], "AWS Service Quotas allows you to view and manage your default resource quotas (such as maximum number of VPCs per Region or EC2 vCPUs) from a central console, and request quota increases programmatically or with a few clicks.", "Governance & Limits", "EASY", ["Service Quotas", "Limits", "Increase Requests"], "Module 10")

    q(650, "How can an administrator increase an adjustable service quota (such as the number of VPCs allowed in an AWS Region from 5 to 10)?", "SINGLE_SELECT", 1, [
        ["A", "Submit a quota increase request via the AWS Service Quotas console or AWS Support", True],
        ["B", "Create a second root user account inside the same VPC", False],
        ["C", "Reboot the AWS management console web browser tab", False],
        ["D", "Service quotas are physically hardwired and cannot be increased under any circumstances", False]
    ], "Adjustable service quotas can be easily increased by requesting an increase via the AWS Service Quotas console or by opening a service limit increase case with AWS Support. Requests are reviewed and typically approved quickly.", "Governance & Limits", "EASY", ["Quota Increase", "Service Quotas Console"], "Module 10")

    return questions

if __name__ == "__main__":
    qs = get_d4_questions()
    print(f"Total Domain 4 Questions Generated: {len(qs)}")
    expected = [f"CP-{i:03d}" for i in range(573, 651)]
    actual = [q["questionCode"] for q in qs]
    assert len(qs) == 78, f"Expected 78 questions, got {len(qs)}"
    assert expected == actual, "Question codes mismatch!"
    print("All 78 Domain 4 question codes (CP-573 to CP-650) verified successfully!")
