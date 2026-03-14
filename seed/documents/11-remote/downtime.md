# Downtime Procedures & Offline Access

## What Is This?

Downtime procedures are the documented plans, processes, and tools a primary care practice uses to continue delivering patient care when its electronic health record (EHR), practice management system, or other critical IT systems are unavailable. This can result from planned downtime (scheduled maintenance, upgrades, data migration), unplanned downtime (hardware failure, software crashes, network outages, power loss), cybersecurity incidents (ransomware attacks, which have become the most common cause of extended healthcare downtime), or third-party outages (cloud EHR vendor service disruptions, internet provider failures).

For a primary care practice that has become entirely dependent on its EHR for clinical documentation, medication prescribing, lab ordering, patient scheduling, and billing, even a few hours of downtime can be operationally devastating. Without a downtime plan, providers cannot access patient histories, medication lists, or allergies. Scheduling staff cannot see appointments. Billing cannot process claims. Lab results cannot be received. Prescriptions cannot be sent electronically.

Downtime procedures typically include three phases: **preparation** (having backup tools, supplies, and documentation ready before downtime occurs), **operations during downtime** (paper-based workflows, backup access to critical data, patient communication), and **recovery** (entering data captured during downtime back into electronic systems, reconciling paper records with electronic records, and resuming normal operations).

The frequency and duration of EHR downtime varies significantly by deployment model. On-premises EHR systems may experience 4-12 hours of planned downtime per year for upgrades plus occasional unplanned outages. Cloud-based EHR systems (athenahealth, eClinicalWorks cloud, etc.) typically guarantee 99.5-99.9% uptime, which still allows for 4.4-43.8 hours of downtime per year. And ransomware attacks -- the nightmare scenario -- can result in days to weeks of complete system unavailability.

## Why Does a Primary Care Practice Need This?

**Patient safety during outages.** When the EHR is down and a patient presents with chest pain, the provider needs access to the patient's medication list, allergies, and medical history. Prescribing without knowing current medications risks dangerous drug interactions. Treating without knowing allergies risks anaphylaxis. Downtime procedures that provide access to critical patient data -- even in read-only, offline format -- are fundamentally about patient safety.

**Operational continuity protects revenue.** A primary care practice generates approximately $2,000-$4,000 per provider per half-day clinic session. Canceling a half-day of appointments for 5 providers due to an unplanned outage costs $10,000-$20,000 in lost revenue -- and the patients still need to be seen, creating a rescheduling burden that cascades for weeks. Practices with effective downtime procedures can continue seeing patients during outages, capturing data on paper and entering it into the system after recovery.

**Ransomware is the existential threat.** Healthcare is the most targeted industry for ransomware, and primary care practices are not immune. In 2023, the average healthcare ransomware recovery time was 3-4 weeks. Practices without downtime procedures face an impossible choice during a ransomware event: close entirely for weeks (potentially bankrupting the practice) or try to operate with no systems and no plan (risking patient safety and creating documentation chaos). A downtime plan specifically addressing extended outages is essential.

**Regulatory requirements.** The HIPAA Security Rule requires a contingency plan (45 CFR 164.308(a)(7)) that includes a data backup plan, a disaster recovery plan, and an emergency mode operation plan. Having no downtime procedures is itself a HIPAA violation, regardless of whether an outage occurs.

**Cloud dependency creates new vulnerabilities.** As practices move to cloud-based EHRs, they become dependent on internet connectivity and the cloud vendor's infrastructure. A severed internet connection, a DNS outage, or a cloud provider issue can make the EHR inaccessible even though nothing is wrong at the practice. Downtime procedures must address these cloud-specific failure modes.

## How to Decide If You Need It

Every practice needs downtime procedures. There is no threshold below which downtime planning is optional. The question is the level of sophistication:

- **Every practice** needs: paper chart forms for documentation during downtime, current patient medication lists accessible offline, a documented communication plan (who to call when systems go down), and a basic recovery process (how to enter paper-captured data into the EHR).
- **Practices with on-premises EHR** additionally need: server monitoring and alerting, UPS (uninterruptible power supply) for servers and network equipment, backup internet connectivity, and local backup of critical data.
- **Practices with cloud EHR** additionally need: backup internet connectivity (cellular failover or second ISP), offline access to the patient schedule, and a plan for extended vendor outages.
- **All practices** should have a specific plan for ransomware/cybersecurity events, which differ from routine outages in duration, scope, and legal/regulatory implications.

## Order of Operations

1. **Risk assessment.** Identify all systems critical to practice operations. For each, determine: what happens if it is unavailable for 1 hour? 4 hours? 1 day? 1 week? Prioritize systems by operational impact.
2. **Develop paper-based backup workflows.** Create standardized paper forms that mirror your EHR documentation workflow: patient encounter form, medication reconciliation form, lab order form, prescription pad (some states still allow paper prescriptions for non-controlled substances), referral form, and patient demographics/insurance form.
3. **Establish offline data access.** Implement a mechanism for accessing critical patient data during downtime: regular export of patient summaries, continuity of care documents (CCDs), or a downtime viewer application that provides read-only access to key clinical data.
4. **Prepare supplies.** Stock a "downtime kit" at each location: printed patient schedules (refreshed daily), paper forms, prescription pads, printed medication lists or access to a downtime viewer, staff contact list, vendor support contact information, and charge capture forms.
5. **Document communication procedures.** Define the communication chain: who identifies that a downtime event has occurred, who is notified, how patients are informed, and how the practice decides whether to continue seeing patients, redirect patients, or close.
6. **Define recovery procedures.** Document how to re-enter paper-captured data into the EHR after systems are restored. Assign responsibility for data entry. Establish the expected timeline for recovery data entry (target: same day as system restoration for clinical data, 48 hours for billing data).
7. **Train staff.** All staff must know their role during downtime. Conduct at minimum one downtime drill per year.
8. **Test regularly.** Test downtime procedures at least annually. Some practices conduct quarterly drills. Test should be realistic: actually use the paper forms, actually access the downtime viewer, actually practice the recovery data entry process.

## Options by Practice Size

**Solo/Small Practice (1-5 providers):**
Printed daily patient schedules, paper encounter forms, downtime medication reference (daily-refreshed patient summary printouts or basic downtime viewer), cellular hotspot as backup internet, manual charge capture forms. Budget: $50-$200/month (primarily backup internet).

**Mid-Size Group (6-15 providers):**
Downtime viewer application (from EHR vendor or third-party), automated daily export of patient summaries, backup internet (cellular failover or dual ISP), UPS for critical network equipment, printed and digital downtime procedures manual, annual downtime drill. Budget: $200-$800/month.

**Large Group (16+ providers, multiple locations):**
Comprehensive downtime system with read-only database access, backup communication systems, redundant internet at all locations, generator backup at primary location, documented recovery procedures by role, quarterly downtime drills, and ransomware-specific incident response plan. Budget: $500-$2,000/month.

## Options Analysis

**EHR Vendor Downtime Viewers (included with EHR or $50-$200/month add-on):**
Most EHR vendors provide downtime viewer applications that run on local workstations and provide read-only access to a cached copy of patient data during EHR outages. Epic's BCA (Business Continuity Access), athenahealth's downtime reporting, and eClinicalWorks' downtime access module are examples. Data is typically refreshed every 4-24 hours to a local server or workstation. Strengths: provided by the EHR vendor (best integration with your specific system), access to patient demographics, medications, allergies, problem lists, and recent notes, familiar data format for clinical staff. Weaknesses: data is only as current as the last refresh cycle, requires local infrastructure (a server or designated workstation) to host the cached data, cloud-based EHRs may have limited downtime viewer options, does not support documentation (read-only).

**Printed Patient Summaries (cost of paper and printer):**
Daily printing of patient summaries (medication list, allergy list, problem list, insurance information) for all scheduled patients. This is the most basic and universally reliable downtime reference. Strengths: no technology dependency, immediately available, no training required, works regardless of the cause of downtime. Weaknesses: only covers scheduled patients (walk-ins and emergencies without summaries), data is only current as of the print time, significant paper waste, time-consuming to print daily for large practices, does not scale well beyond 50-75 patients per day.

**Automated CCD/CCDA Export ($0-$300/month):**
Automated nightly export of Continuity of Care Documents (CCDs) or C-CDAs for all active patients to a local server, USB drive, or separate cloud storage. These standardized clinical document summaries contain demographics, medications, allergies, problems, procedures, and recent lab results. Strengths: comprehensive clinical summary in a standardized format, can be stored on a laptop that operates independently of the practice network, covers the entire patient panel (not just scheduled patients). Weaknesses: requires infrastructure to automate the export, documents can be lengthy and difficult to navigate quickly during a patient encounter, requires a viewer application or web browser to display.

**Backup Internet (Cellular Failover: $50-$150/month; Dual ISP: $100-$300/month):**
A secondary internet connection that activates when the primary connection fails. Cellular failover devices (Cradlepoint, Peplink, Cisco Meraki with cellular) provide automatic switchover to 4G/5G cellular data. Dual ISP configurations use two wired internet providers with automatic or manual failover. Strengths: addresses the most common cause of cloud EHR "downtime" (internet failure, not EHR failure), automatic failover minimizes disruption, cellular is independent of wired infrastructure (different failure modes). Weaknesses: cellular bandwidth is limited and may not support the full practice at full speed, dual ISP adds monthly cost, failover may not be seamless (brief interruption during switchover).

**UPS (Uninterruptible Power Supply) ($200-$2,000 per unit):**
Battery backup devices that keep critical equipment running during power outages. Essential for servers, network switches, firewalls, and at least one workstation per location. Enterprise UPS units (APC Smart-UPS, CyberPower) provide 15-60 minutes of runtime, buying time to shut down gracefully or for generator activation. Strengths: protects against the most common cause of abrupt system failures, prevents data corruption from unclean shutdowns, provides time to initiate downtime procedures orderly. Weaknesses: limited runtime without generator, batteries must be replaced every 3-5 years, does not help with software or network failures.

**Paper Documentation Kits ($50-$200 to create):**
Pre-printed paper forms designed to capture the same data elements as the EHR during downtime. A well-designed kit includes: new patient intake form (demographics, insurance, allergies, medications), encounter documentation form (vitals, chief complaint, HPI, exam findings, assessment/plan), prescription form, lab order form, referral form, charge capture form, and patient discharge instructions templates. Strengths: universally reliable, no technology dependency, can be used by all staff, inexpensive. Weaknesses: data must be manually entered into the EHR after recovery (time-consuming and error-prone), clinical documentation on paper is typically less thorough than electronic, charge capture on paper increases billing errors, forms require periodic updating to match EHR workflow changes.

## Vendor Landscape

Downtime planning is not a product category with a competitive vendor landscape in the way that EHR or billing systems are. Instead, downtime capabilities are primarily provided by EHR vendors (downtime viewers), infrastructure vendors (UPS manufacturers, backup internet providers), and managed service providers (MSPs that configure and maintain downtime infrastructure).

The most significant development in downtime planning is the growing threat of healthcare ransomware. Incident response firms (CrowdStrike, Mandiant, Palo Alto Unit 42) provide ransomware response services, but their engagement fees ($200-$500/hour) and response times make proactive planning essential. Cyber insurance is a critical component -- policies specifically covering healthcare cyber events, including business interruption coverage, ransom payments (controversial but available), and forensic investigation costs, typically run $5,000-$50,000/year in premiums for a primary care practice depending on size, revenue, and security posture.

Backup and disaster recovery (BDR) appliances from Datto, Veeam, and Acronis provide automated, image-level backups of on-premises servers that can be instantly virtualized during an outage. For practices with on-premises infrastructure, a BDR appliance ($200-$500/month) is a critical downtime tool that can bring a failed server back online as a virtual machine in minutes rather than hours or days.

## Compliance & Regulatory Notes

**HIPAA Contingency Plan (45 CFR 164.308(a)(7)):** The Security Rule requires a contingency plan that includes:
- Data backup plan: Procedures to create and maintain retrievable exact copies of ePHI.
- Disaster recovery plan: Procedures to restore any loss of data.
- Emergency mode operation plan: Procedures to enable continuation of critical business processes for the protection of ePHI while operating in emergency mode.
- Testing and revision: Periodic testing and revision of contingency plans.
- Applications and data criticality analysis: Assessment of the relative criticality of applications and data.

**Prescription Regulations During Downtime:** E-prescribing is mandated in many states and by Medicare Part D. During EHR downtime, prescribing reverts to paper or phone orders. Most states still allow paper prescriptions for non-controlled substances. Controlled substance prescriptions must comply with state-specific requirements -- some states require wet-ink prescriptions on tamper-resistant prescription pads (the practice must maintain these pads for downtime use). EPCS (Electronic Prescribing for Controlled Substances) cannot be used during EHR downtime.

**Documentation Timeliness:** CMS and most payers expect clinical documentation to be completed contemporaneously with the encounter. During downtime, paper documentation satisfies this requirement, but the subsequent electronic entry should be completed as soon as systems are restored. Delayed documentation entry increases the risk of errors and may create issues with timely filing requirements for claims.

**State Reporting:** Some mandated reporting (immunization registry submissions, syndromic surveillance, reportable conditions) may be delayed during downtime. Most state reporting systems accommodate reasonable delays, but practices should catch up on mandatory reporting promptly after recovery.

**Breach Notification:** If the downtime event involves a security breach (ransomware, unauthorized access), HIPAA breach notification requirements (60-day notification to individuals, HHS, and potentially media for breaches affecting 500+ individuals) apply. Engage legal counsel immediately for any cybersecurity-related downtime event.

## Common Mistakes

1. **Having a plan but never testing it.** A downtime plan that exists only on paper (or worse, only on the server that went down) is not a plan. Annual drills, even if abbreviated, reveal gaps that cannot be identified through documentation review alone.

2. **Not printing daily patient schedules.** The most basic downtime preparation -- printing the daily schedule with patient demographics, phone numbers, and insurance information -- is free and takes minutes. Yet many practices do not do this, leaving them unable to even contact patients during an outage.

3. **Forgetting about prescriptions during downtime.** If the EHR goes down mid-clinic, providers may need to issue prescriptions. Without access to medication lists and without e-prescribing capability, prescription errors are a real risk. Downtime medication references and paper prescription pads must be available.

4. **Not planning for data re-entry.** The most time-consuming phase of downtime is not the outage itself but the recovery -- entering all paper-captured data back into the EHR. Practices that do not plan for this discover that it takes 2-3 times longer to enter the data than it took to capture it, creating a backlog that can take days to clear for even a few hours of downtime.

5. **Assuming cloud EHR means no downtime.** Cloud EHR systems still experience outages -- from vendor issues, internet failures, DNS problems, and cloud provider incidents. Additionally, a ransomware attack on the practice can render workstations unusable even though the cloud EHR is fine. Plan for all failure modes, not just server failures.

6. **Not having backup internet.** For practices on cloud-based EHRs, internet connectivity IS the EHR. An internet outage equals an EHR outage. A cellular failover device ($50-$150/month) is cheap insurance against the most common cause of cloud EHR access disruption.

7. **Storing the downtime plan only electronically.** If the plan is on a SharePoint site or a shared drive and the network is down, the plan is inaccessible. Maintain printed copies of downtime procedures in every department and at every location, plus copies accessible on personal smartphones (a PDF sent to key staff members' personal email).

## Recommended Implementation Timeline

**Weeks 1-2: Risk Assessment**
Identify all critical systems and their downtime impact. Review past downtime events and their consequences. Assess current downtime readiness (do you have paper forms? Prescription pads? Backup internet? UPS?).

**Weeks 3-4: Procedure Development**
Write downtime procedures for each phase: detection (how do you know systems are down?), notification (who gets called?), operation (how do you continue patient care?), and recovery (how do you restore normal operations and enter data?). Develop role-specific instructions: provider, MA, front desk, billing, lab, management.

**Weeks 5-6: Supplies and Infrastructure**
Create paper documentation kits. Print and distribute downtime procedures. Procure UPS units for critical equipment. Set up backup internet if not already in place. Obtain paper prescription pads. Request downtime viewer from EHR vendor.

**Weeks 7-8: Training and First Drill**
Train all staff on downtime procedures. Conduct a tabletop drill (walk through the procedures verbally without actually taking systems down) to identify gaps. Address gaps and revise procedures.

**Month 3: Live Drill**
Conduct a limited live drill: during a low-volume period, simulate a 1-hour downtime event. Staff use paper forms, access the downtime viewer, and practice the recovery data entry process. Debrief and document lessons learned.

**Ongoing: Maintenance**
Print daily patient schedules. Refresh downtime viewer data per schedule (if applicable). Replace UPS batteries on schedule. Conduct annual downtime drills. Update procedures when workflows change. Review and revise the plan after any actual downtime event, incorporating lessons learned.
