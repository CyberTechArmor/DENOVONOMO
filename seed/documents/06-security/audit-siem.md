# Audit Logging & SIEM

## What Is This?

Audit logging is the systematic recording of events and activities within information systems that create, access, modify, or transmit electronic protected health information (ePHI). A Security Information and Event Management (SIEM) system aggregates, correlates, and analyzes these audit logs from across your IT environment to detect security threats, support compliance, and provide forensic evidence when incidents occur.

The HIPAA Security Rule mandates audit controls (45 CFR 164.312(b)) as a required implementation specification: "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information." This means every system that touches ePHI must generate audit logs, and you must have the ability to review and analyze those logs.

**Audit logging** at its most basic captures the who, what, when, where, and how of system activity:
- **Who**: Which user account performed the action (unique user identification).
- **What**: What action was taken (login, logout, record access, record modification, deletion, export, print, failed login attempt).
- **When**: The exact date and time of the action.
- **Where**: Which system, application, or workstation was used.
- **How**: The method of access (local, remote, API, etc.).

**SIEM (Security Information and Event Management)** takes audit logging several steps further. A SIEM platform collects log data from multiple sources (EHR, servers, firewalls, endpoints, cloud services, identity providers), normalizes the data into a common format, correlates events across sources to identify patterns, applies detection rules to identify potential threats, and generates alerts for investigation. Modern SIEM platforms incorporate User and Entity Behavior Analytics (UEBA) that use machine learning to establish baselines of normal behavior and flag anomalies.

For primary care practices, the audit logging and SIEM spectrum ranges from basic EHR audit log review (minimum compliance) to enterprise SIEM with 24/7 monitoring (comprehensive security operations). The appropriate level depends on your practice size, risk profile, and resources.

## Why Does a Primary Care Practice Need This?

Audit logging serves three essential functions in a healthcare environment:

**Compliance**: The HIPAA Security Rule requires audit controls. OCR expects you to be able to demonstrate that you can track who accessed what patient data, when, and from where. In a compliance audit or breach investigation, your audit logs are the evidence that either supports or undermines your compliance claims.

**Breach detection**: The average time to detect a healthcare data breach is 329 days (IBM Cost of a Data Breach Report). Many breaches are discovered only when a patient complains about identity theft or an insurer flags suspicious claims. Proactive audit log monitoring can detect breaches in hours or days rather than months. The cost difference is enormous: breaches detected in under 200 days cost an average of $3.93 million less than those taking longer.

**Insider threat detection**: The most common source of healthcare data breaches is not external hackers but internal workforce members. Employee snooping in medical records (accessing records of coworkers, celebrities, neighbors, or family members without a treatment reason) is a pervasive problem. Without audit log monitoring, these inappropriate accesses go undetected indefinitely. Proactive monitoring detects patterns such as an employee accessing 50 records in a day when their normal baseline is 15, accessing records of patients not on their schedule, or accessing records outside working hours.

**Forensic support**: When an incident does occur, audit logs provide the forensic evidence needed to determine the scope and impact. Without comprehensive logs, a forensic investigation may be unable to determine which records were accessed, making it impossible to conduct the four-factor breach risk assessment required by HIPAA and potentially requiring notification of all patients rather than a targeted group.

## How to Decide If You Need It

You need audit logging. It is a required HIPAA standard. The decision is about how sophisticated your log management and analysis capability needs to be.

Assessment questions:

- **Can you pull EHR access logs?** If you cannot currently generate a report showing who accessed a specific patient's record, you have a fundamental gap. Most EHRs have built-in audit logging; the question is whether you know how to access and use it.
- **Do you review audit logs?** Generating logs without reviewing them is security theater. If no one has looked at your EHR audit logs in the past six months, you are meeting the letter of the requirement but not the spirit.
- **Do you have logs from non-EHR systems?** Your firewall, email system, Active Directory, and cloud services all generate security-relevant logs. If you only monitor EHR logs, you have a partial view.
- **Can you correlate events across systems?** A suspicious login from an unusual location to your VPN, followed by access to your EHR, followed by a large file download from your email: this pattern is invisible if you cannot correlate logs across systems.
- **Who monitors your logs?** If the answer is "no one" or "our MSP checks sometimes," you have a monitoring gap that delays breach detection.

## Order of Operations

1. **Inventory log sources** (Week 1): Identify every system that generates security-relevant logs: EHR, practice management, email/Microsoft 365, Active Directory/Entra ID, firewalls, VPN, endpoints, wireless access points, and cloud services.
2. **Verify EHR audit logging** (Weeks 1-2): Confirm that your EHR's audit logging is enabled and properly configured. Generate test reports to verify you can track user access to patient records.
3. **Establish basic log review procedures** (Weeks 2-4): Define who will review logs, what they should look for, and how frequently. Start with weekly EHR audit log review for anomalies.
4. **Centralize log collection** (Weeks 4-8): For practices moving beyond basic monitoring, implement a log aggregation solution that collects logs from multiple sources into a single platform.
5. **Implement detection rules** (Weeks 6-10): Configure alerts for high-risk events: failed login attempts (brute force), after-hours access, large data exports, administrative privilege changes, and access anomalies.
6. **Establish response procedures** (Weeks 8-10): Define what happens when an alert fires. Who investigates? What constitutes a security incident? When does investigation escalate to incident response?
7. **Implement ongoing monitoring** (Month 3+): Establish the cadence and responsibility for log review and alert investigation. Document the process and train responsible staff.
8. **Tune and optimize** (Ongoing): Refine detection rules to reduce false positives, add new data sources as the environment evolves, and update alert thresholds based on operational experience.

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $0-$300/month for audit logging and monitoring.
- **Approach**: Leverage built-in EHR audit logging as the primary compliance tool. Add Microsoft 365 audit log review if using M365. Your MSP should be monitoring firewall and endpoint logs as part of their service.
- **EHR audit logging**: Use your EHR's built-in audit report to conduct monthly reviews. Look for: access outside business hours, access by users not scheduled with the patient, large volume access by a single user, failed login patterns.
- **M365 audit logging**: Enable Unified Audit Log in Microsoft 365 (enabled by default in most plans). Review for suspicious email access, unusual sign-in activity, and data download anomalies. Microsoft provides 90 days of audit log retention (180 days with E5).
- **Monitoring**: Rely on MSP for firewall and endpoint alert monitoring. Supplement with a lightweight cloud SIEM like Blumira ($0 for free tier with limited capabilities, $144/month for small team tier).
- **Recommendation**: At minimum, schedule monthly EHR audit log reviews and verify your MSP is monitoring security alerts from your firewall and endpoint protection. This satisfies the basic HIPAA requirement and catches the most obvious insider threats.

### Medium Practice (4-15 Providers)

- **Budget**: $300-$2,000/month.
- **Approach**: Implement a cloud SIEM or managed SIEM that aggregates logs from your EHR, Microsoft 365, firewall, Active Directory/Entra ID, and endpoint protection.
- **SIEM options**: Blumira ($500-$1,500/month), Arctic Wolf ($1,000-$3,000/month as managed SIEM/SOC), or Microsoft Sentinel (consumption-based pricing, $100-$1,000+/month depending on log volume).
- **EHR monitoring**: Automated EHR audit log analysis using the SIEM or a dedicated tool. Configure alerts for anomalous access patterns.
- **Proactive monitoring**: Weekly log review by IT or compliance staff. Automated alerts for critical events with defined investigation procedures.
- **Recommendation**: Deploy a cloud SIEM like Blumira for cost-effective log aggregation and automated detection. If your MSP provides managed SOC services, evaluate whether their SIEM coverage meets your needs.

### Large Practice (15+ Providers)

- **Budget**: $2,000-$10,000/month.
- **Approach**: Enterprise SIEM with comprehensive log collection, advanced analytics, and either internal or managed SOC monitoring.
- **SIEM options**: Microsoft Sentinel (enterprise-grade, consumption-based), Splunk Cloud ($1,500-$5,000+/month depending on data volume), Elastic Security (open source core with commercial features), or managed SIEM/SOC from providers like Arctic Wolf, Fortified Health Security, or Secureworks.
- **Compliance**: Automated compliance reporting for HIPAA audit log requirements. Dashboard visibility into access patterns, anomalies, and incident metrics.
- **Staffing**: At least a part-time security analyst to review alerts and investigate incidents, or a managed SOC service providing 24/7 monitoring.
- **Recommendation**: Enterprise SIEM with managed SOC monitoring. Microsoft Sentinel is the best value for Microsoft-centric environments. Consider a healthcare-specialized MSSP like Fortified Health Security for healthcare-aware monitoring and compliance.

## Options Analysis

### EHR Built-In Audit Logging Only

Use your EHR's native audit log capabilities without additional tools.

- **Pros**: No additional cost, already generating data, satisfies the basic HIPAA audit control requirement if reviewed regularly.
- **Cons**: Limited to EHR data only, no correlation with other system activity, manual review is time-consuming and inconsistent, no automated alerting, reactive rather than proactive.
- **Cost**: $0 additional.
- **Best for**: Small practices as a starting point. Should not be the long-term strategy for any practice.

### Cloud SIEM (Self-Managed)

Deploy a cloud-based SIEM platform and manage it internally or through your MSP.

- **Blumira**: Purpose-built for SMBs and MSPs. Pre-built detection rules, automated threat response, cloud-native. Free tier available. Paid tiers from $144-$2,000+/month. Very fast deployment.
- **Microsoft Sentinel**: Enterprise SIEM built on Azure. Pay-per-GB ingestion pricing. Deep integration with Microsoft 365 and Entra ID. Powerful but requires expertise to configure and manage. $100-$5,000+/month.
- **Elastic Security**: Open source SIEM built on Elasticsearch. Powerful but complex. Free self-managed or Elastic Cloud managed service ($95+/month).
- **Wazuh**: Open source security monitoring. Free self-hosted. Requires significant expertise. Cloud-hosted options available.

**Pros**: Comprehensive visibility, automated detection, compliance reporting, scalable.
**Cons**: Requires expertise to configure and manage, ongoing tuning needed, cost scales with data volume, alert fatigue without proper tuning.

### Managed SIEM/SOC

Outsource log monitoring and analysis to a managed security operations center.

- **Arctic Wolf**: Leading managed SIEM/SOC provider. Concierge Security Team model. $1,000-$5,000/month. Includes log collection, monitoring, and investigation.
- **Fortified Health Security**: Healthcare-specialized managed security. SIEM, EDR monitoring, and compliance support. $2,000-$8,000/month.
- **Secureworks**: Dell-backed managed security with Taegis XDR platform. $1,500-$5,000/month.
- **Huntress**: While primarily an endpoint detection platform, provides human-reviewed managed threat detection that serves as a lightweight SOC alternative. $3-$5/endpoint/month.

**Pros**: 24/7 expert monitoring, no internal security analyst needed, investigation and escalation included, compliance reporting, vendor manages tuning and updates.
**Cons**: Highest cost, less control, dependent on vendor quality, potential alert escalation overload.

### Open Source SIEM

Self-hosted open source platforms for log management and analysis.

- **Wazuh**: Comprehensive open source security platform with SIEM, EDR, and compliance modules. Free. Active community. Docker-based deployment.
- **Elastic (ELK) Stack**: Elasticsearch, Logstash, Kibana with Elastic Security features. Powerful and flexible. Free self-hosted. Requires significant expertise.
- **OSSIM (AlienVault Open Source)**: Open source SIEM. Basic but functional. AT&T Cybersecurity discontinued the open source version; community forks may be available.

**Pros**: No licensing cost, customizable, avoid vendor lock-in.
**Cons**: Requires significant expertise to deploy, configure, and maintain. No vendor support unless using commercial tiers. Compliance documentation burden on you. Staffing cost to maintain often exceeds commercial licensing.
**Best for**: Large practices with dedicated security engineering staff. Not recommended for most primary care environments.

## Vendor Landscape

**Cloud SIEM:**
- **Blumira**: Best for small-medium healthcare practices. Fast deployment, pre-built healthcare detections, affordable. Free-$2,000+/mo.
- **Microsoft Sentinel**: Best for Microsoft-centric environments with internal expertise. Consumption-based pricing. $100-$5,000+/mo.
- **Splunk Cloud**: Market leader in log analytics. Powerful but expensive and complex. $1,500-$5,000+/mo for small deployments.
- **Sumo Logic**: Cloud-native analytics platform. Good alternative to Splunk. $300-$3,000+/mo.

**Managed SIEM/SOC:**
- **Arctic Wolf**: Leading managed security platform for SMBs. Concierge model. $1,000-$5,000/mo.
- **Fortified Health Security**: Healthcare-focused managed security. Strong compliance alignment. $2,000-$8,000/mo.
- **Secureworks (Taegis)**: Enterprise-grade managed XDR. $1,500-$5,000/mo.
- **Todyl**: Growing managed security platform for SMBs. Competitive pricing. $500-$2,000/mo.

**EHR Audit Tools:**
- **Protenus**: AI-powered healthcare compliance analytics. Automated EHR audit log analysis for privacy monitoring. Used by health systems. Premium pricing.
- **FairWarning (now Imprivata)**: Patient privacy monitoring for EHR access. Detects snooping and inappropriate access patterns. $1,000-$5,000/mo depending on size.
- **EHR-native audit reports**: Every certified EHR includes audit logging capabilities. Leverage these before investing in additional tools.

## Compliance & Regulatory Notes

- **HIPAA Audit Controls (164.312(b), Required)**: Must implement mechanisms to record and examine activity in information systems containing ePHI. This is a required specification with no addressable alternative.
- **Log retention**: HIPAA requires documentation retention for six years. Audit logs that constitute compliance documentation should be retained accordingly. Many SIEM platforms have retention limits; ensure your log retention policy meets the six-year requirement for relevant logs.
- **Access report capability**: You must be able to produce an access report for any patient's record showing who accessed it, when, and what they did. This capability is essential for breach investigations and patient complaints.
- **Audit log integrity**: Logs must be protected from modification or deletion. Implement write-once or immutable log storage. If an attacker can modify audit logs, they can cover their tracks.
- **MIPS/Promoting Interoperability**: While not a specific PI measure, audit logging supports the security risk analysis requirement and demonstrates mature security practices.
- **Recognized security practices**: Active security monitoring through SIEM aligns with NIST CSF Detect function and qualifies as a recognized security practice under the 2021 HITECH amendment, potentially mitigating OCR enforcement actions.
- **State requirements**: Some states have specific audit trail requirements for health information access. California's CMIA requires maintaining audit trails of electronic health record access.
- **HITRUST CSF**: If pursuing HITRUST certification, comprehensive audit logging and monitoring is a significant control category. SIEM deployment strengthens HITRUST audit readiness.

## Common Mistakes

1. **Generating logs but never reviewing them**: This is the most common failure. Audit logs that no one reads provide zero security value and minimal compliance value. Establish a review cadence and assign responsibility.
2. **Only monitoring the EHR**: Your EHR is one system among many. Email compromise, VPN intrusion, firewall breaches, and endpoint compromise all happen outside the EHR. Comprehensive monitoring requires multiple log sources.
3. **Insufficient log retention**: Default log retention in many systems is 30-90 days. If a breach is not discovered for 6 months (common in healthcare), those logs are gone. Configure retention to meet the 6-year HIPAA requirement for relevant compliance logs and at minimum 12 months for security investigation logs.
4. **No baseline for normal behavior**: Without understanding normal access patterns, you cannot identify anomalies. Establish baselines for user activity (records accessed per day, hours of access, access locations) before you can detect deviations.
5. **Alert fatigue**: Configuring too many alerts with too low a threshold results in alert fatigue where security staff ignore or dismiss alerts. Start with a small number of high-fidelity alerts and expand gradually.
6. **Not monitoring privileged accounts**: Administrative accounts (IT staff, system accounts, EHR superusers) have the most access and create the most risk. Enhanced monitoring of privileged activity should be a priority.
7. **Assuming the MSP monitors everything**: Clarify exactly what your MSP monitors, how they respond to alerts, and what their reporting cadence is. Many MSPs generate alerts but do not investigate them.
8. **Ignoring audit log integrity**: If audit logs can be modified or deleted by users or attackers, their evidentiary value is compromised. Ensure logs are forwarded to a secure, separate system and protected from tampering.
9. **No documented procedures for log review**: Without documented procedures, log review is inconsistent and may miss critical indicators. Create a checklist of what to look for during each review cycle.
10. **Treating SIEM deployment as the finish line**: Deploying a SIEM is the beginning, not the end. Ongoing tuning, rule development, and response procedure refinement are essential for the SIEM to deliver value.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small) | Estimated Cost (Medium) |
|-------|----------|------------|----------------------|------------------------|
| **Phase 1: EHR Audit Logging** | Weeks 1-2 | Verify EHR audit logging configuration, generate test reports, establish monthly review schedule | $0 | $0-$500 |
| **Phase 2: Log Source Inventory** | Weeks 2-3 | Identify all log sources (M365, firewall, VPN, endpoints, etc.), document current retention settings | $0 | $0-$500 |
| **Phase 3: Basic Monitoring** | Weeks 3-6 | Implement weekly/monthly log review process, define what to look for, assign responsibility, document procedures | $0-$200 | $500-$1,000 |
| **Phase 4: Log Aggregation** | Weeks 6-10 | Deploy cloud SIEM or managed SIEM, connect log sources, configure initial detection rules | $0-$500/mo ongoing | $500-$2,000/mo ongoing |
| **Phase 5: Detection Tuning** | Weeks 10-16 | Tune alert thresholds, reduce false positives, establish baselines, develop high-priority detection rules | Included in monthly | $500-$1,000 one-time |
| **Phase 6: Operational Maturity** | Month 4+ | Refine review processes, integrate with incident response plan, regular reporting to practice leadership | Included in monthly | Included in monthly |

**Total initial investment**: $0-$700 (small) | $1,000-$3,000 (medium)
**Ongoing monthly cost**: $0-$500 (small) | $500-$3,000 (medium)
**Annual cost**: $0-$6,000 (small) | $6,000-$36,000 (medium)

Start with EHR audit log review this week. It costs nothing and satisfies the most fundamental HIPAA requirement. Build toward centralized log management over the next 2-3 months. The gap between "no monitoring" and "basic monitoring" is enormous; the gap between "basic monitoring" and "enterprise SIEM" is incremental. Get the basics right first.
