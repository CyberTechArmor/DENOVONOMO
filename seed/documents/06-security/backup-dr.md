# Backup & Disaster Recovery

## What Is This?

Backup and Disaster Recovery (BDR) encompasses the strategies, technologies, and processes that protect your practice's data and systems from loss and enable recovery when catastrophic events occur. In a healthcare context, BDR is not merely an IT best practice; it is a HIPAA Security Rule requirement and a fundamental component of patient safety.

**Backup** is the process of creating copies of your data and system configurations so they can be restored if the originals are lost, corrupted, or rendered inaccessible. The gold standard is the 3-2-1 backup strategy: maintain at least three copies of your data, on two different types of media, with one copy stored off-site. Modern interpretations add a "1-0" to make it 3-2-1-1-0: one copy air-gapped or immutable, with zero errors verified through regular restoration testing.

**Disaster Recovery (DR)** is the broader plan and capability for restoring IT systems and operations after a disruptive event. DR extends beyond data backup to include system recovery, network restoration, application failover, and the processes for returning to normal operations. DR planning addresses questions like: How quickly can you restore your EHR after a ransomware attack? Can you continue seeing patients if your building is destroyed by a tornado? What happens to your data if your cloud vendor experiences a catastrophic failure?

Two critical metrics define your DR requirements:

- **Recovery Time Objective (RTO)**: The maximum acceptable time your systems can be down before the impact becomes unacceptable. For a primary care EHR, an RTO might be 4 hours; for a phone system, it might be 1 hour; for historical financial records, it might be 72 hours.
- **Recovery Point Objective (RPO)**: The maximum acceptable amount of data loss measured in time. An RPO of 1 hour means you can tolerate losing at most the last hour of data. For clinical data, RPO should be as close to zero as feasible.

The HIPAA Security Rule addresses backup and recovery through several standards: the Data Backup Plan (164.308(a)(7)(ii)(A), required), Disaster Recovery Plan (164.308(a)(7)(ii)(B), required), Emergency Mode Operation Plan (164.308(a)(7)(ii)(C), required), and Testing and Revision Procedures (164.308(a)(7)(ii)(D), addressable). These requirements mandate not just having backups but having a documented plan for how you will recover operations and protect ePHI during and after an emergency.

## Why Does a Primary Care Practice Need This?

Data loss and system unavailability are not hypothetical risks for primary care practices. They are near-certainties over a long enough timeline. The threats include:

- **Ransomware**: The most pressing threat. Ransomware encrypts your data and systems, making them unusable. Without adequate backups, you face paying a ransom (with no guarantee of recovery) or losing your data permanently. Practices without immutable backups have paid ransoms ranging from $10,000 to $500,000 and still lost data.
- **Hardware failure**: Hard drives fail. Servers fail. The mean time between failure (MTBF) for enterprise hard drives is 1-1.5 million hours, but that is a statistical average. Your specific drive could fail tomorrow. RAID protects against individual drive failure but not against controller failure, fire, or theft.
- **Human error**: Accidental deletion of files, databases, or configurations. A well-meaning staff member can cause more damage in 30 seconds than most attackers.
- **Natural disasters**: Fires, floods, tornadoes, hurricanes, and earthquakes can destroy physical infrastructure. Off-site and cloud backups are your protection.
- **Software corruption**: EHR database corruption, failed updates, or software bugs can render systems unusable. Point-in-time recovery capability allows you to restore to a pre-corruption state.
- **Cloud vendor failure**: Even cloud-based EHRs can experience outages or data loss. While rare, cloud vendor failures do occur, and your BAA with the vendor should address their backup responsibilities. You should still understand what your practice would do during an extended cloud outage.

The financial impact of unrecoverable data loss on a primary care practice is catastrophic. Beyond the immediate cost of recovery efforts, a practice that loses its patient records may face malpractice exposure for inability to document past care, loss of patient trust, inability to bill for services already rendered, and potential closure. Multiple practices have permanently closed following ransomware attacks when backups were inadequate.

## How to Decide If You Need It

You need backup and disaster recovery. This is non-negotiable. The decisions are about the scope, sophistication, and investment level appropriate for your practice. Assess your current state:

- **Do you have any backup at all?** If your only copy of data is on the device or server where it lives, you are one hardware failure away from catastrophe.
- **Are backups tested?** When was the last time you actually restored data from a backup and verified it worked? Untested backups are unreliable.
- **Are backups off-site?** If your backup is a USB drive sitting next to the server, a fire or theft takes both. Off-site or cloud backup is essential.
- **Are backups immutable?** If ransomware can reach your backup files and encrypt them too (via network share, compromised credentials), your backups are not protecting you against the primary threat.
- **Do you have a documented DR plan?** If your server dies today, does anyone know the sequence of steps to restore operations? Is that knowledge in someone's head or in a written plan?
- **What is your effective RTO?** How long would it actually take to restore your EHR and resume operations today? If you do not know, you have not tested.

## Order of Operations

1. **Inventory critical systems and data** (Week 1): Identify every system and data set that needs backup protection. Prioritize by criticality: EHR database, patient documents, financial data, email, configuration files.
2. **Define RTO and RPO for each system** (Week 1-2): Work with clinical and administrative leadership to determine acceptable downtime and data loss thresholds for each critical system.
3. **Assess current backup state** (Week 2): Document what is currently being backed up, how, where, and how often. Test a restoration from existing backups.
4. **Design backup architecture** (Weeks 2-4): Based on RTO/RPO requirements, design a 3-2-1-1-0 backup architecture. Select backup technology and off-site/cloud storage.
5. **Implement backup solution** (Weeks 4-8): Deploy backup agents, configure backup schedules, establish off-site replication, configure immutable storage.
6. **Test restoration** (Weeks 8-10): Perform full restoration tests for each critical system. Document the process and the actual RTO achieved.
7. **Develop DR plan** (Weeks 8-12): Write a comprehensive disaster recovery plan covering various scenarios (ransomware, hardware failure, facility loss, cloud outage).
8. **Train staff on DR procedures** (Weeks 12-14): Ensure key staff know their roles in a disaster recovery scenario. Practice manager, IT contact, and clinical leadership should all understand the plan.
9. **Establish ongoing testing schedule** (Month 4+): Schedule and execute regular backup restoration tests (monthly recommended for critical systems, quarterly minimum).

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $100-$500/month for BDR.
- **Cloud-based EHR**: If your EHR is cloud-hosted (athenahealth, eClinicalWorks cloud, etc.), the vendor handles EHR database backup under your BAA. Your responsibility is backing up local data: documents, images, financial files, local application data, and email.
- **Backup solution**: Microsoft 365 backup for email (built-in retention plus third-party backup like Veeam Backup for Microsoft 365 or Spanning at $2-$4/user/month). Local data backup using Acronis Cyber Protect Cloud ($2-$5/workstation/month through MSP) or Veeam through your MSP.
- **Immutable backup**: Cloud backup with immutability enabled (Wasabi Hot Cloud Storage at $7/TB/month with immutability, or Backblaze B2 at $6/TB/month).
- **DR**: For cloud EHR practices, DR is primarily about workstation and network recovery. Maintain a documented plan for what happens if your office is inaccessible (can providers access the cloud EHR from home?) and what happens if your internet connection fails (backup internet via cellular failover).
- **Recommendation**: Leverage your MSP's BDR stack. Verify that backups include immutable off-site copies and that they perform regular test restorations. Get proof.

### Medium Practice (4-15 Providers)

- **Budget**: $500-$2,000/month for BDR.
- **On-premise components**: Practices with on-premise servers need image-based backup that can restore entire server environments. Datto SIRIS ($200-$600/month depending on storage) or Veeam Backup & Replication ($500-$2,000/year licensing plus cloud storage) are the standard options.
- **Cloud backup**: Datto, Veeam Cloud Connect, Acronis Cyber Protect Cloud, or Druva for cloud-native backup with immutability.
- **M365 backup**: Third-party M365 backup is essential. Microsoft's native retention is not a true backup solution. Veeam Backup for Microsoft 365, AvePoint, or Spanning at $2-$5/user/month.
- **DR testing**: Quarterly DR tests with documented results. Datto SIRIS allows screenshot verification of backup integrity and instant virtualization for rapid recovery.
- **Recommendation**: Datto SIRIS for practices with on-premise servers (best-in-class BDR appliance with cloud replication and instant virtualization). Veeam for practices wanting more flexibility and lower cost with a capable MSP.

### Large Practice (15+ Providers)

- **Budget**: $2,000-$10,000/month for BDR.
- **Enterprise BDR**: Veeam Backup & Replication Enterprise with cloud tier to AWS/Azure/Wasabi. Cohesity DataProtect or Rubrik for larger environments needing policy-based management and global deduplication.
- **DR site**: Consider a warm or hot DR site capability using cloud-based disaster recovery (Zerto, Azure Site Recovery, or AWS CloudEndure). This enables rapid failover of critical systems to cloud infrastructure.
- **Immutable and air-gapped backup**: Enterprise immutable storage (AWS S3 Object Lock, Azure Immutable Blob Storage, or dedicated immutable backup appliance). Consider air-gapped backups using rotating offline media for highest-value data.
- **DR orchestration**: Automated DR runbooks that sequence recovery of interdependent systems. Zerto or Veeam Orchestrator for automated failover and failback.
- **Recommendation**: Comprehensive BDR program with enterprise backup software, cloud-based DR capability, immutable storage, and quarterly DR exercises. Engage a BDR specialist to design the architecture.

## Options Analysis

### Business-Grade BDR Appliances

Purpose-built backup and disaster recovery appliances that combine local backup with cloud replication.

- **Datto SIRIS**: Market-leading BDR appliance for SMBs. Image-based backup with instant local and cloud virtualization. Automatic screenshot verification. Cloud replication to Datto's secure cloud. $200-$800/month including appliance and cloud storage. Channel-only (sold through MSPs).
- **Axcient x360Recover**: Datto competitor with similar capabilities. Direct-to-cloud option available. $150-$500/month. Growing market share.
- **Unitrends**: Enterprise-grade BDR appliance. Good for larger on-premise environments. $200-$1,000/month.

**Pros**: All-in-one solution, local backup for fast recovery, cloud replication for off-site protection, instant virtualization for rapid RTO, automated testing.
**Cons**: Higher monthly cost, channel-only distribution (requires MSP), proprietary cloud storage, vendor lock-in.

### Software-Based Backup

Backup software deployed on your infrastructure with your choice of storage targets.

- **Veeam Backup & Replication**: Industry standard for virtualized environments. Supports VMware, Hyper-V, physical servers, NAS, cloud workloads, and M365. Community Edition free for up to 10 workloads. Licensed versions $500-$5,000+/year. Cloud storage is separate.
- **Acronis Cyber Protect Cloud**: Combines backup with cybersecurity features. Good MSP platform. $2-$7/workstation/month through MSP.
- **Nakivo Backup & Replication**: Cost-effective alternative to Veeam. Good feature set at lower price point. $200-$2,000/year depending on scope.

**Pros**: Flexible storage targets, potentially lower cost, avoid vendor lock-in on storage, more control over architecture.
**Cons**: Requires more expertise to design and manage, separate storage costs, more complex monitoring.

### Cloud-Native Backup

Backup services designed for cloud-first environments.

- **Druva**: SaaS-based backup for endpoints, M365, and cloud workloads. No infrastructure to manage. $3-$8/user/month.
- **Veeam Backup for Microsoft 365**: Purpose-built M365 backup. Self-hosted or Veeam-hosted options. $2-$4/user/month.
- **Spanning (by Kaseya)**: M365 and Google Workspace backup. Simple, affordable. $4-$6/user/month.
- **AvePoint**: M365 backup with strong compliance features. $3-$6/user/month.

**Pros**: No infrastructure to manage, automatic scaling, simple deployment, good for cloud-first practices.
**Cons**: Dependent on internet connectivity, may not cover on-premise systems, per-user pricing can add up.

### Managed BDR Services

Fully managed backup and disaster recovery provided by an MSP or specialized BDR provider.

**Pros**: Expert management, 24/7 monitoring, regular test restorations, compliance documentation, single point of accountability.
**Cons**: Highest cost, dependent on MSP quality, less direct control, potential complacency in understanding your own recovery procedures.
**Cost**: $500-$3,000/month depending on environment size and RTO/RPO requirements.
**Best for**: Any practice without internal IT expertise to manage BDR. This is the majority of primary care practices.

## Vendor Landscape

**BDR Appliances:**
- **Datto SIRIS**: Dominant in the MSP channel. Best-in-class for SMB BDR. Reliable cloud replication. $200-$800/mo.
- **Axcient x360Recover**: Strong Datto alternative. Competitive pricing. Direct-to-cloud option. $150-$500/mo.
- **Unitrends**: Good for larger environments. More enterprise-focused. $200-$1,000/mo.

**Backup Software:**
- **Veeam**: Industry standard. Broadest workload support. Strong community. Free to $5,000+/yr.
- **Acronis Cyber Protect**: Backup + security integration. Good MSP platform. $2-$7/workstation/mo.
- **Commvault**: Enterprise backup. Overkill for most primary care. $$$$.

**Cloud Storage for Backup:**
- **Wasabi**: S3-compatible hot cloud storage with immutability. $6.99/TB/month. No egress fees. Excellent value for backup targets.
- **Backblaze B2**: S3-compatible cloud storage. $6/TB/month. Simple pricing. Immutability available.
- **AWS S3**: Object Lock for immutability. More complex pricing. $23/TB/month for standard tier. Best for practices already in AWS.
- **Azure Blob Storage**: Immutable blob storage. Good for Microsoft-centric environments. $18-$46/TB/month depending on tier.

**M365 Backup:**
- **Veeam Backup for M365**: Most popular. Self-hosted or Veeam-hosted. $2-$4/user/mo.
- **AvePoint**: Strong compliance features. $3-$6/user/mo.
- **Spanning (Kaseya)**: Simple and affordable. $4-$6/user/mo.

## Compliance & Regulatory Notes

- **HIPAA Data Backup Plan (required)**: 164.308(a)(7)(ii)(A) requires establishing and implementing procedures to create and maintain retrievable exact copies of ePHI.
- **HIPAA Disaster Recovery Plan (required)**: 164.308(a)(7)(ii)(B) requires establishing and implementing procedures to restore any loss of data.
- **HIPAA Emergency Mode Operation Plan (required)**: 164.308(a)(7)(ii)(C) requires establishing procedures to enable continuation of critical business processes for protection of ePHI while operating in emergency mode.
- **HIPAA Testing and Revision (addressable)**: 164.308(a)(7)(ii)(D) requires implementing procedures for periodic testing and revision of contingency plans.
- **Backup encryption**: Backup data containing ePHI must be encrypted both in transit and at rest. All modern backup solutions support AES-256 encryption. Encryption keys must be managed securely and separately from the backup data.
- **Retention requirements**: HIPAA requires documentation retention for six years. Medical record retention varies by state (typically 7-10 years for adults, longer for minors). Ensure backup retention policies satisfy both HIPAA and state requirements.
- **BAA for cloud backup providers**: Any cloud storage provider holding backup data containing ePHI must have a signed BAA. Verify BAA availability before selecting a cloud storage provider.
- **Ransomware and breach notification**: If ransomware encrypts ePHI but your immutable backups allow full recovery with no data exfiltration, you may still need to conduct a breach risk assessment per the four-factor test (45 CFR 164.402). Encryption by ransomware is a security incident and potentially a breach.
- **MIPS Promoting Interoperability**: While not directly a PI measure, the security risk analysis required for PI base score should address backup and DR risks. Demonstrating a robust BDR program supports your SRA.

## Common Mistakes

1. **Backing up to the same physical device**: A USB drive plugged into the server is not an adequate backup. If the server is stolen, the drive goes with it. If ransomware encrypts the server, it encrypts the attached drive too.
2. **Never testing restorations**: The most dangerous assumption in IT is that backups are working. Test monthly. Document the test. Verify the data. A backup you have never restored is a hope, not a plan.
3. **Not protecting against ransomware specifically**: Modern ransomware actively seeks and destroys backups. Your backup strategy must include immutable copies that cannot be encrypted, deleted, or modified by ransomware even if it has administrative credentials.
4. **Relying solely on the EHR vendor for backup**: Your cloud EHR vendor backs up their systems, but they typically will not restore your data to a specific point in time upon request. Understand their RPO, their data recovery process, and what happens if they experience a catastrophic failure. Read the BAA carefully.
5. **No M365 backup**: Microsoft 365 retention policies are not backups. Microsoft's shared responsibility model explicitly states that data protection is the customer's responsibility. A deleted email or SharePoint document may not be recoverable after Microsoft's retention period expires.
6. **Ignoring RTO**: Many practices focus on backup (preventing data loss) without considering recovery time. A backup that takes 72 hours to restore when your practice needs the EHR within 4 hours is inadequate.
7. **No DR plan documentation**: When a disaster occurs, stress is high and thinking is impaired. Without a written plan with step-by-step procedures, critical steps will be missed and recovery will take longer.
8. **Single point of knowledge**: If only one person (the IT guy, the MSP engineer) knows how to restore your systems, you have a single point of failure for your entire recovery capability. Document procedures and cross-train.
9. **Ignoring network recovery**: Restoring servers is useless if your network infrastructure (firewall configuration, switch settings, WiFi configuration) is not also backed up and recoverable.
10. **Not accounting for clinical workflow during downtime**: Your DR plan should include clinical downtime procedures: paper-based documentation, medication reference access, emergency contact information, and procedures for retroactive data entry when systems are restored.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small) | Estimated Cost (Medium) |
|-------|----------|------------|----------------------|------------------------|
| **Phase 1: Assessment** | Weeks 1-2 | Inventory critical systems, define RTO/RPO, assess current backup state, test existing backups | $0-$500 | $500-$2,000 |
| **Phase 2: Design** | Weeks 2-4 | Design 3-2-1-1-0 backup architecture, select solutions, plan implementation | $0-$500 | $500-$2,000 |
| **Phase 3: Implementation** | Weeks 4-8 | Deploy backup solution, configure schedules, establish cloud replication, enable immutability | $500-$2,000 + monthly ongoing | $2,000-$8,000 + monthly ongoing |
| **Phase 4: Testing** | Weeks 8-10 | Full restoration test of each critical system, document actual RTO/RPO achieved, identify and fix gaps | $0-$500 | $500-$2,000 |
| **Phase 5: DR Plan** | Weeks 10-14 | Write DR plan, develop downtime procedures, identify recovery team and responsibilities | $500-$1,500 | $1,000-$5,000 |
| **Phase 6: Training & Tabletop** | Weeks 14-16 | Train staff on DR procedures, conduct tabletop exercise, refine plan based on exercise findings | $500-$1,000 | $1,000-$3,000 |
| **Ongoing Operations** | Monthly | Test backups, review backup logs, quarterly DR plan review, annual tabletop exercise | $100-$500/mo | $500-$2,000/mo |

**Total initial investment**: $1,500-$5,500 (small) | $5,000-$22,000 (medium)
**Ongoing monthly cost**: $200-$700 (small) | $700-$3,000 (medium)
**Annual ongoing cost**: $2,400-$8,400 (small) | $8,400-$36,000 (medium)

Backup and disaster recovery should be implemented early in your IT program and validated regularly. If you do not currently have tested, immutable, off-site backups, this should be your top IT priority alongside MFA. Ransomware does not wait for your implementation timeline.
