# SAFER Guides Self-Assessment

## What Is This?

The Safety Assurance Factors for EHR Resilience (SAFER) Guides are a set of nine self-assessment checklists developed by the Office of the National Coordinator for Health Information Technology (ONC) to help healthcare organizations evaluate and optimize the safety of their electronic health record (EHR) systems. Originally published in 2014 and updated periodically, the SAFER Guides address a critical but often overlooked dimension of healthcare IT: that EHR systems, while designed to improve patient safety, can themselves introduce new safety risks if improperly configured, implemented, or used.

The nine SAFER Guides cover:

1. **High Priority Practices**: Foundational safety practices every organization should implement first.
2. **Organizational Responsibilities**: Governance, leadership, and organizational commitment to EHR safety.
3. **Contingency Planning**: Preparations for EHR downtime, data loss, and system unavailability.
4. **System Configuration**: Safe configuration of the EHR including CDS alerts, order sets, and default settings.
5. **System Interfaces**: Safe management of data exchanges between the EHR and other systems.
6. **Patient Identification**: Practices to ensure correct patient matching and prevent wrong-patient errors.
7. **Computerized Provider Order Entry (CPOE)**: Safe configuration and use of electronic ordering.
8. **Test Results Reporting and Follow-up**: Ensuring test results are received, reviewed, and acted upon.
9. **Clinician Communication**: Safe electronic communication between providers.

Each guide contains a series of recommended practices presented as self-assessment items. For each item, the organization rates whether the practice is fully implemented, partially implemented, or not implemented. The guides do not have a pass/fail threshold; they are designed as improvement tools that help organizations identify gaps and prioritize safety enhancements.

For primary care practices, the SAFER Guides are particularly relevant because primary care is where EHR-related safety issues most commonly manifest. Missed test results, incorrect patient identification, misconfigured clinical decision support alerts, and poor downtime planning can all lead to patient harm. The SAFER Guides provide a structured, evidence-based framework for identifying and addressing these risks before they cause harm.

## Why Does a Primary Care Practice Need This?

EHR-related patient safety events are more common than most clinicians realize. Studies have estimated that EHR-related safety events occur in 1-5% of all encounters, with a subset resulting in significant patient harm. In primary care, the most common EHR safety risks include:

- **Missed test results**: Lab and imaging results that are received by the EHR but never reviewed by the ordering provider, leading to delayed diagnoses or missed follow-up.
- **Wrong-patient errors**: Orders, notes, or prescriptions entered into the wrong patient's chart due to similar names, adjacent chart selection, or failure to verify patient identity.
- **Alert fatigue**: Excessive or poorly configured clinical decision support alerts that providers dismiss reflexively, including alerts for genuine drug interactions or allergy contraindications.
- **Copy-forward errors**: Duplicated or outdated clinical documentation carried forward from previous encounters, leading to incorrect clinical assumptions.
- **Downtime unpreparedness**: Inability to continue safe patient care when the EHR is unavailable due to system failure, network outage, or cyberattack.

The SAFER Guides address each of these risks systematically. While they are not legally mandated, they represent a recognized standard of care for EHR safety. In a malpractice case involving an EHR-related safety event, a plaintiff's attorney will certainly ask what the practice did to assess and mitigate EHR safety risks. Having completed a SAFER Guides assessment and acted on the findings provides evidence of due diligence.

Additionally, the SAFER Guides complement and integrate with your Security Risk Assessment. While the SRA focuses on confidentiality, integrity, and availability of ePHI from a security perspective, the SAFER Guides focus on clinical safety implications of EHR use. Together, they provide a comprehensive view of EHR-related risks.

ONC has also signaled that the SAFER Guides may become more formally integrated into certification requirements and quality programs in future rulemaking, making early adoption a strategic advantage.

## How to Decide If You Need It

While the SAFER Guides are not currently a regulatory mandate, every practice using an EHR should conduct a SAFER assessment. Consider these triggers for prioritization:

- **New EHR implementation or major upgrade**: The highest-risk period for EHR safety events is during and immediately after a system transition. A SAFER assessment during implementation planning catches configuration and workflow risks before go-live.
- **History of EHR-related safety events**: If your practice has experienced missed test results, wrong-patient incidents, or medication errors linked to EHR use, a SAFER assessment will help identify systemic issues.
- **Provider complaints about alert fatigue**: When providers routinely override or complain about clinical decision support alerts, the System Configuration guide will help you rationalize your alert strategy.
- **No documented downtime procedures**: If your practice does not have written procedures for continuing care when the EHR is unavailable, the Contingency Planning guide is essential.
- **Upcoming SRA or compliance review**: Integrating a SAFER assessment into your annual SRA process adds clinical safety perspective to your risk management program.
- **Health system or ACO affiliation requirements**: Some health systems and ACOs are beginning to require SAFER Guides completion as part of their quality and safety programs.

## Order of Operations

1. **Obtain the SAFER Guides** (Day 1): Download all nine guides from the ONC website (healthit.gov). They are free and available in PDF and Word formats.
2. **Assemble the assessment team** (Week 1): Include at minimum a physician champion, the EHR administrator or superuser, the practice manager, and an IT representative. Each guide touches different aspects of operations.
3. **Start with High Priority Practices** (Weeks 1-2): Complete the High Priority Practices guide first as it establishes the most critical safety foundations.
4. **Complete remaining guides in priority order** (Weeks 2-8): Address the guides most relevant to your identified risks. For most primary care practices, the priority order after High Priority Practices is: Test Results Reporting, Patient Identification, System Configuration, Contingency Planning, CPOE, Clinician Communication, Organizational Responsibilities, and System Interfaces.
5. **Document findings** (Ongoing): For each recommended practice, document your current state, any identified gaps, and your assessment of risk.
6. **Develop improvement plan** (Weeks 8-10): Prioritize identified gaps by risk and feasibility. Create an action plan with owners, timelines, and resources needed.
7. **Implement improvements** (Months 3-12): Execute the improvement plan, starting with the highest-risk items.
8. **Integrate with annual SRA** (Ongoing): Include SAFER Guides review in your annual SRA process to maintain continuity and ensure EHR safety remains part of your risk management program.

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $0-$2,000 (guides are free; cost is primarily staff time).
- **Approach**: Provider and practice manager complete the assessment together over 2-4 sessions. Focus on the four most impactful guides: High Priority Practices, Test Results Reporting, Patient Identification, and Contingency Planning.
- **Time commitment**: 8-16 hours total for initial assessment; 4-8 hours for annual review.
- **Integration**: Add SAFER findings to your SRA risk register as clinical safety risks. This enriches your overall risk management program at minimal additional cost.
- **Challenges**: Limited ability to modify EHR configuration in cloud-hosted environments. Work with your EHR vendor on configuration changes identified through the assessment.

### Medium Practice (4-15 Providers)

- **Budget**: $2,000-$8,000 (staff time plus potential consultant engagement).
- **Approach**: Form a small safety committee (physician champion, EHR administrator, practice manager, nurse lead) to complete all nine guides. Consider engaging an EHR consultant or your EHR vendor's optimization team to help address configuration findings.
- **Time commitment**: 20-40 hours total for initial assessment; 10-20 hours for annual review.
- **Integration**: Formal EHR safety program that feeds into both quality improvement and compliance programs. Quarterly review of safety metrics.
- **Challenges**: Multiple provider workflows may require tailored assessments. Multi-site practices need to assess each location's unique factors.

### Large Practice (15+ Providers)

- **Budget**: $8,000-$25,000 (dedicated staff time, potential consultant engagement, EHR optimization resources).
- **Approach**: Dedicated quality/safety team completes all nine guides with input from each department or specialty. Integrate with existing patient safety reporting and quality improvement infrastructure.
- **Time commitment**: 40-80 hours total for initial assessment; 20-40 hours for annual review.
- **Integration**: Part of a formal clinical informatics governance program. Feed findings into the same risk register and governance processes used for other patient safety initiatives.
- **Challenges**: Complexity of EHR configuration across multiple specialties and workflows. Need for change management when implementing configuration changes that affect provider workflows.

## Options Analysis

### Self-Directed Assessment

Complete the SAFER Guides internally using the free ONC materials and your own staff.

- **Pros**: No additional cost beyond staff time, builds internal expertise, can be completed at your own pace, providers involved directly understand the risks.
- **Cons**: May miss issues due to lack of external perspective, time-consuming, staff may lack expertise to assess some technical items, no external validation.
- **Cost**: $0 software; 8-80 hours staff time depending on practice size.
- **Best for**: Small practices with engaged provider leadership and knowledgeable EHR administrators.

### EHR Vendor Optimization Services

Many EHR vendors offer optimization reviews that include safety-related configuration assessment. These may align with SAFER Guides recommendations even if not explicitly labeled as SAFER assessments.

- **Pros**: Deep knowledge of the specific EHR platform, can implement configuration changes directly, may be included in support agreements or available at moderate cost.
- **Cons**: Focus limited to their own product, may not address workflow and organizational issues, potential conflicts of interest (unlikely to identify fundamental design limitations).
- **Cost**: $0-$10,000 depending on vendor and scope. Some vendors include periodic optimization reviews in maintenance contracts.
- **Best for**: Practices due for an EHR optimization review, especially after major version upgrades.

### Clinical Informatics Consultant

Engage a clinical informatics specialist or healthcare IT safety consultant to facilitate the assessment.

- **Pros**: Expert perspective, experience across multiple organizations and EHR platforms, can identify systemic issues, credible recommendations for configuration changes.
- **Cons**: Expensive, may not be available locally, still requires significant practice participation, follow-through on recommendations remains the practice's responsibility.
- **Cost**: $5,000-$20,000 depending on scope and practice complexity.
- **Best for**: Practices with a history of EHR safety events, those implementing a new EHR, and large practices seeking comprehensive assessment.

### Integrated Safety and Compliance Approach

Combine the SAFER Guides assessment with your annual SRA, treating EHR clinical safety as a component of your broader risk management program.

- **Pros**: Efficient use of resources, comprehensive risk view, single governance process, avoids duplicative effort.
- **Cons**: May not give clinical safety sufficient attention if overshadowed by security/compliance focus, requires broader expertise on the assessment team.
- **Cost**: Incremental to SRA cost (add 10-25% to SRA budget).
- **Best for**: All practice sizes. This is the recommended approach for ongoing management.

## Vendor Landscape

The SAFER Guides themselves are free from ONC. The vendor landscape here relates to tools and services that support the assessment and remediation process.

**EHR Vendors with Safety/Optimization Services:**
- **Epic**: MyChart and EHR optimization consulting through Epic's Professional Services. Comprehensive but expensive. Primarily for Epic clients in larger organizations.
- **Oracle Health (Cerner)**: Optimization services available through Oracle Health consulting. Millennium platform has configuration tools for safety practices.
- **eClinicalWorks**: Offers optimization reviews through their Professional Services team. V12+ includes improved safety configuration options.
- **athenahealth**: Cloud-based model means athenaClinicals configuration is more standardized. Network insights provide safety benchmarking.
- **NextGen**: Offers optimization services. NextGen Office (cloud) and NextGen Enterprise have different safety configuration capabilities.

**Clinical Informatics Consultants:**
- **Galen Healthcare Solutions**: EHR optimization and clinical informatics consulting. Works across multiple platforms.
- **Nordic Consulting**: Primarily Epic-focused but has broad clinical informatics expertise.
- **Divurgent**: Healthcare IT consulting with clinical optimization services.
- **Tegria (now part of Elevance Health)**: Clinical informatics and EHR safety consulting.

**Patient Safety Organizations (PSOs):**
- **ECRI Institute**: Leading patient safety organization with extensive EHR safety research and guidance. Membership includes access to safety analysis tools and benchmarking.
- **ISMP (Institute for Safe Medication Practices)**: Focused on medication safety, including EHR-related medication error prevention.
- **PSO membership**: Reporting EHR safety events to a federally listed PSO provides legal protections for the reported data while contributing to industry learning.

## Compliance & Regulatory Notes

- **Not currently mandated**: The SAFER Guides are voluntary self-assessment tools, not regulatory requirements. However, they represent recognized best practices and may be cited as a standard of care.
- **ONC Certification requirements**: While the SAFER Guides themselves are not certification requirements, many of the safety capabilities they assess (CDS configuration, audit logging, patient matching) are requirements of ONC Health IT Certification. Certified EHR Technology should support most SAFER-recommended capabilities.
- **Integration with SRA**: The HIPAA Security Rule requires assessment of risks to ePHI integrity and availability, which overlaps with SAFER Guides on contingency planning, system interfaces, and system configuration. Including SAFER findings in your SRA strengthens your compliance posture.
- **MIPS Quality measures**: Several MIPS quality measures relate to patient safety domains covered by the SAFER Guides, including medication reconciliation, follow-up on diagnostic testing, and care coordination. SAFER-guided improvements can support quality measure performance.
- **Joint Commission and accreditation**: If your practice is accredited, patient safety standards from accrediting bodies align with SAFER Guides recommendations. The assessment can support your accreditation compliance documentation.
- **Malpractice risk management**: Insurers and risk management programs increasingly recognize EHR safety as a liability domain. Documenting SAFER Guides completion may support risk management credits or favorable underwriting.
- **Recognized Security Practices**: While the SAFER Guides are not specifically listed as recognized security practices under the 2021 HITECH amendment, demonstrating a comprehensive approach to EHR safety (including the SAFER Guides) supports the broader narrative of a mature security and safety program.

## Common Mistakes

1. **Treating the assessment as an IT exercise**: The SAFER Guides are fundamentally about clinical safety. Completing them without meaningful clinician involvement misses the point and most of the risk.
2. **Completing the assessment without acting on findings**: The assessment itself has no value if identified gaps are not addressed. The improvement plan is the real deliverable.
3. **Focusing only on technology**: Many SAFER recommendations address workflow, training, and organizational culture. A purely technical approach misses critical safety dimensions.
4. **Ignoring the Contingency Planning guide**: Downtime preparedness is often the weakest area for primary care practices and the one most likely to cause widespread patient safety issues when an incident occurs.
5. **Not revisiting after EHR changes**: Major EHR upgrades, module activations, or workflow changes can introduce new safety risks. Re-assess after significant changes.
6. **Assessing in isolation**: The SAFER Guides are most valuable when findings are integrated with your SRA, quality improvement program, and incident reporting system.
7. **Assuming cloud EHR eliminates safety risks**: Cloud-hosted EHRs eliminate some infrastructure risks but do not eliminate configuration, workflow, or human factor risks. Most SAFER recommendations apply regardless of deployment model.
8. **Provider dismissiveness**: Some providers view EHR safety assessments as administrative burden. Frame the assessment in terms of malpractice risk reduction and clinical workflow improvement to gain buy-in.
9. **Not involving nursing and support staff**: MAs, nurses, and front desk staff interact with the EHR differently than providers and encounter different safety risks. Include them in the assessment.
10. **Skipping the System Interfaces guide**: Practices with lab interfaces, radiology interfaces, HIE connections, or other system integrations often overlook interface-related safety risks. Interface failures can silently lose data.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small) | Estimated Cost (Medium) |
|-------|----------|------------|----------------------|------------------------|
| **Phase 1: Preparation** | Week 1 | Download SAFER Guides, identify assessment team, schedule assessment sessions, gather EHR configuration documentation | $0 | $500-$1,000 |
| **Phase 2: High Priority Assessment** | Weeks 1-2 | Complete High Priority Practices guide, identify critical gaps, implement any immediate safety fixes | $0-$500 | $500-$2,000 |
| **Phase 3: Core Guides Assessment** | Weeks 2-6 | Complete Test Results, Patient Identification, System Configuration, and Contingency Planning guides | $0-$500 | $1,000-$3,000 |
| **Phase 4: Remaining Guides** | Weeks 6-8 | Complete CPOE, Clinician Communication, Organizational Responsibilities, and System Interfaces guides | $0-$500 | $1,000-$2,000 |
| **Phase 5: Improvement Planning** | Weeks 8-10 | Prioritize gaps, develop improvement plan, assign owners, establish timelines and budgets | $0-$500 | $500-$2,000 |
| **Phase 6: Implementation** | Months 3-12 | Execute improvement plan, implement EHR configuration changes, update workflows, conduct training | $500-$3,000 | $3,000-$15,000 |
| **Annual Review** | Annually, 2-4 weeks | Review and update assessment, evaluate progress on improvement plan, assess new risks from EHR changes | $0-$1,000/yr | $1,000-$5,000/yr |

**Total initial investment**: $500-$5,000 (small) | $6,500-$25,000 (medium)
**Ongoing annual cost**: $0-$1,000 (small) | $1,000-$5,000 (medium)

The SAFER Guides assessment is one of the highest-value, lowest-cost safety activities a primary care practice can undertake. The guides are free, the process is straightforward, and the findings directly improve patient safety and reduce liability. Schedule your first assessment within the next quarter and integrate it into your annual SRA review cycle going forward.
