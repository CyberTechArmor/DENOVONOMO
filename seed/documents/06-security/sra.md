# Security Risk Assessment (SRA)

## What Is This?

A Security Risk Assessment (SRA) is a systematic evaluation of your organization's security posture as it relates to the protection of electronic protected health information (ePHI). It is the foundational requirement of the HIPAA Security Rule (45 CFR 164.308(a)(1)(ii)(A)) and the single most important compliance activity a healthcare organization performs. The SRA identifies where ePHI lives, how it moves, what threatens it, what vulnerabilities exist, what controls are in place, and what residual risk remains.

The SRA is not a one-time checklist. It is a comprehensive, organization-wide analysis that must be reviewed and updated regularly, at minimum annually, and whenever significant changes occur in your environment such as a new EHR implementation, office relocation, addition of telehealth services, or a security incident. The output of an SRA is a documented risk register that catalogs identified risks, rates their likelihood and impact, describes current mitigating controls, and assigns a risk level. This risk register then drives your risk management plan, which prioritizes and schedules remediation activities.

For primary care practices, the SRA serves a dual purpose. First, it satisfies the HIPAA Security Rule requirement and provides the foundation for your entire security compliance program. Second, it is a prerequisite for the Promoting Interoperability (PI) category of MIPS (Merit-Based Incentive Payment System). CMS requires an attestation that a security risk analysis was conducted or reviewed during the reporting period as a base score requirement for PI. Without this attestation, your practice receives zero points for the entire PI category, which can result in a negative Medicare payment adjustment of up to 9%.

The distinction between a genuine risk assessment and a superficial checklist exercise is critical. OCR has repeatedly stated that checking boxes on a form does not constitute a risk analysis. A valid SRA must be thorough, covering all ePHI regardless of medium or location; it must identify and evaluate reasonably anticipated threats and vulnerabilities; it must assess the likelihood and potential impact of each identified risk; and it must be documented and retained for at least six years.

## Why Does a Primary Care Practice Need This?

The SRA is the cornerstone of HIPAA Security Rule compliance. Without a current, comprehensive SRA, you fundamentally cannot comply with the Security Rule because you do not know what risks you face and therefore cannot manage them. This is not a theoretical argument; it is the most commonly cited deficiency in OCR enforcement actions.

In practical terms, the SRA is needed for three primary reasons:

**Legal obligation**: The Security Rule requires it. Full stop. OCR has settled enforcement cases against practices of all sizes for failure to conduct an SRA. The Cottage Health settlement ($3 million), the Cardionet settlement ($2.5 million), and numerous smaller settlements against individual practices all cite failure to conduct an adequate risk analysis as a primary deficiency.

**MIPS/Promoting Interoperability requirement**: CMS requires attestation that a security risk analysis was performed or reviewed during the MIPS reporting period. This is a yes/no gate for the entire PI category. With PI weighted at 25% of the final MIPS score, losing this category entirely has severe financial consequences. For a practice billing $500,000 in Medicare Part B charges, a 9% negative adjustment is $45,000 annually.

**Practical protection**: A well-conducted SRA reveals real vulnerabilities before threat actors exploit them. Practices that have conducted thorough SRAs and implemented remediation plans are materially more resilient against ransomware, phishing, insider threats, and accidental exposure. The SRA is not bureaucratic theater when done properly; it is the roadmap for protecting your practice and your patients.

## How to Decide If You Need It

Every covered entity needs an SRA. The question is not whether but how urgently and how comprehensively. Use these criteria to assess your situation:

- **Never conducted an SRA**: You are out of compliance today. This should be your top IT priority.
- **SRA older than 12 months without review or update**: You need to, at minimum, review and update your existing SRA.
- **Significant environment changes since last SRA**: New EHR, new office location, new telehealth platform, major staffing changes, move to cloud-based systems, or any other significant change to how ePHI is created, stored, or transmitted triggers a review.
- **Security incident since last SRA**: Any breach, ransomware attack, phishing compromise, or other security incident should trigger an SRA review and update.
- **Approaching MIPS reporting deadline**: If your PI attestation period is ending and you have not completed or reviewed your SRA, you need to act immediately.

## Order of Operations

1. **Define scope and assemble team** (Week 1): Identify who will conduct the SRA (internal team, external consultant, or hybrid). Define the organizational scope, all locations, systems, and business functions that create, receive, maintain, or transmit ePHI.
2. **Inventory ePHI assets and data flows** (Weeks 2-3): Catalog every system, application, device, and medium that contains ePHI. Map how ePHI flows between systems, providers, patients, payers, and business associates. This inventory is the foundation of the assessment.
3. **Identify threats and vulnerabilities** (Weeks 3-4): Using the asset inventory, systematically identify reasonably anticipated threats (what could go wrong) and vulnerabilities (weaknesses that could be exploited). Use a framework like NIST SP 800-30 to structure this analysis.
4. **Assess current controls** (Weeks 4-5): For each asset and data flow, document what security controls are currently in place. This includes technical controls (encryption, access controls, audit logging), administrative controls (policies, training, procedures), and physical controls (facility security, device management).
5. **Determine likelihood and impact** (Week 5-6): For each threat-vulnerability pair, assess the likelihood of occurrence and the potential impact to the organization if it were to occur. Use a consistent rating scale (e.g., low/medium/high or 1-5 numeric scale).
6. **Calculate and prioritize risk** (Week 6): Combine likelihood and impact ratings to determine a risk level for each identified risk. Prioritize risks from highest to lowest.
7. **Document findings and create risk register** (Weeks 6-7): Compile all findings into a formal risk register document. Include risk descriptions, ratings, current controls, and recommended actions.
8. **Develop risk management plan** (Weeks 7-8): Create a plan that addresses each identified risk through mitigation (implementing additional controls), acceptance (documenting the decision to accept the residual risk), transfer (shifting risk through insurance or BAAs), or avoidance (eliminating the risk-creating activity).

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $2,000-$5,000 using self-service tools; $5,000-$12,000 with consultant assistance.
- **Approach**: The HHS SRA Tool (free) is designed specifically for small-to-medium practices and walks you through the assessment process with guided questions. Supplement with a half-day consultant engagement to review findings and help develop the risk management plan.
- **Scope**: Typically 5-15 workstations, 1 cloud EHR, cloud email, 1-2 networked printers, 1-3 mobile devices, 1-2 locations.
- **Timeline**: 4-6 weeks for initial SRA; 2-3 weeks for annual review.
- **Documentation**: The HHS SRA Tool generates a report. Supplement with a simple risk management plan in a spreadsheet format showing risk, priority, planned action, responsible person, and timeline.
- **Staffing**: Practice manager or office manager leads with provider involvement for clinical workflow questions. External consultant for technical assessment if no internal IT resource.

### Medium Practice (4-15 Providers)

- **Budget**: $5,000-$15,000 annually.
- **Approach**: Consider a compliance platform with built-in SRA tools (Compliancy Group, HIPAA One) or engage a consultant who specializes in ambulatory practices. The HHS SRA Tool is still viable but may become unwieldy with the more complex environment.
- **Scope**: 20-75 workstations, multiple clinical systems, potentially on-premise servers, multiple locations, more diverse workforce, medical devices, telehealth platforms.
- **Timeline**: 6-10 weeks for initial SRA; 4-6 weeks for annual review.
- **Documentation**: Formal risk register in compliance platform or dedicated spreadsheet. Risk management plan with assigned owners, budgets, and quarterly review schedule.
- **Staffing**: Compliance coordinator or designated staff member leads the SRA process. IT staff or MSP provides technical input. Clinical leadership participates in workflow assessment.

### Large Practice (15+ Providers)

- **Budget**: $15,000-$50,000 annually.
- **Approach**: Engage a specialized healthcare security firm (Clearwater, Coalfire, or healthcare-focused MSSP) for at least the initial assessment. Use enterprise SRA platforms like Clearwater's IRM|Analysis or RADAR from RADAR Inc. for ongoing management.
- **Scope**: 75-300+ workstations, complex network architecture, multiple EHR instances, integration engines, data warehouse, numerous business associates, research data (if applicable), multiple service lines.
- **Timeline**: 8-16 weeks for initial SRA; 6-10 weeks for annual review.
- **Documentation**: Enterprise risk register in dedicated GRC (Governance, Risk, Compliance) platform. Formal risk committee reviews and approves findings. Board-level risk reporting.
- **Staffing**: Dedicated compliance/security staff or vCISO leads the process. Cross-functional SRA team includes IT, clinical, compliance, and administrative leadership.

## Options Analysis

### HHS SRA Tool (Free, Self-Service)

The Office of the National Coordinator (ONC) and OCR developed the Security Risk Assessment Tool specifically to help small and medium-sized healthcare providers conduct their SRA. It is available as a Windows desktop application and an iPad app.

- **Pros**: Free, specifically designed for healthcare, aligns directly with HIPAA requirements, generates a report, endorsed by HHS.
- **Cons**: Can be time-consuming (20-40 hours for initial completion), does not automatically assess technical controls, requires significant healthcare IT knowledge to answer questions accurately, user interface is dated, does not include automated vulnerability scanning.
- **Cost**: Free (software); $0-$5,000 for staff time and potential consultant review.
- **Best for**: Small practices with a knowledgeable practice manager or IT resource who can dedicate time to the process.

### Compliance Platform SRA Modules

Platforms like Compliancy Group, HIPAA One (Intraprise Health), and Accountable include SRA modules integrated with their broader compliance management tools.

- **Pros**: Integrated with policy management and training tracking, guided workflow, ongoing tracking of remediation activities, evidence repository, audit-ready reports.
- **Cons**: Annual subscription cost, templates still require customization, varying depth of technical assessment, some platforms are more checkbox-oriented than risk-focused.
- **Cost**: $3,000-$15,000/year (SRA included in platform subscription).
- **Best for**: Small to medium practices seeking an integrated compliance management approach.

### Consultant-Led SRA

Engaging a healthcare security consultant to conduct or guide the SRA provides expert analysis and credibility.

- **Pros**: Expert identification of risks you would miss, credible in OCR investigations, can include technical vulnerability assessment, provides actionable recommendations, defensible methodology.
- **Cons**: Most expensive option, quality varies significantly, may not understand your specific practice workflows, requires practice participation and access.
- **Cost**: $5,000-$15,000 (small practice); $15,000-$35,000 (medium); $25,000-$75,000+ (large).
- **Best for**: Initial SRA for any practice, annual SRA for medium-to-large practices, and any practice that has experienced a security incident.

### Enterprise GRC Platforms

Tools like Clearwater's IRM|Analysis, RADAR, LogicGate, or ServiceNow GRC provide comprehensive risk management platforms.

- **Pros**: Sophisticated risk quantification, continuous monitoring, integration with vulnerability scanners, executive reporting dashboards, scale to complex environments.
- **Cons**: Expensive, require trained operators, overkill for small practices, significant implementation effort.
- **Cost**: $20,000-$150,000+/year.
- **Best for**: Large practices and health systems with dedicated compliance/security staff.

## Vendor Landscape

**SRA Tools:**
- **HHS SRA Tool**: Free. Adequate for small practices. Available at healthit.gov.
- **Clearwater IRM|Analysis**: Industry-leading healthcare risk analysis platform. Used by health systems and large practices. $20,000-$100,000+/year.
- **RADAR Inc. (RADAR)**: Mid-market risk assessment platform. Growing presence in ambulatory space. $5,000-$25,000/year.
- **Compliancy Group**: Integrated SRA within broader compliance platform. Good for small-to-medium practices. $4,000-$12,000/year.
- **HIPAA One (Intraprise Health)**: Strong SRA tool used by both practices and consultants. $3,000-$10,000/year.

**Consulting Firms:**
- **Clearwater**: Premier healthcare security advisory firm. Deep expertise. National presence. Premium pricing.
- **tw-Security**: Tom Walsh-led firm focused on practical healthcare security. Excellent for ambulatory practices. Midwest-based but serves nationally.
- **Coalfire**: Large cybersecurity firm with dedicated healthcare practice. Good for multi-framework assessments.
- **CynergisTek (now Clearwater)**: Acquired by Clearwater in 2022. Strong ambulatory practice experience.
- **Regional healthcare IT consultants**: Often provide the best value for small practices. Verify healthcare-specific SRA experience and methodology.

**Vulnerability Assessment Add-Ons:**
- **Tenable Nessus**: Industry-standard vulnerability scanner. Can supplement SRA with technical findings. $3,500-$7,000/year.
- **Qualys**: Cloud-based vulnerability management. Good integration with SRA processes. $2,000-$10,000/year.
- **Rapid7 InsightVM**: Vulnerability management with risk scoring. $5,000-$20,000/year.

## Compliance & Regulatory Notes

- **MIPS Promoting Interoperability base requirement**: A security risk analysis or review must be conducted during the performance period. This must address the security of ePHI created or maintained by certified EHR technology (CEHRT). It is an all-or-nothing requirement; failure means zero PI points.
- **OCR enforcement emphasis**: Failure to conduct an adequate risk analysis is cited in the majority of OCR resolution agreements and civil money penalty cases. This is the single most important compliance activity to get right.
- **No safe harbor for tool choice**: OCR does not endorse or require any specific SRA tool or methodology. The HHS SRA Tool is a resource, not a mandated approach. What matters is that the assessment is thorough, organization-wide, and documented.
- **Retention requirement**: SRA documentation must be retained for at least six years per the Security Rule's documentation requirements (45 CFR 164.316(b)(2)).
- **Risk analysis vs. gap assessment**: A gap assessment (comparing your controls to HIPAA requirements) is not the same as a risk analysis (identifying threats, vulnerabilities, likelihood, and impact). OCR has specifically noted this distinction. A gap assessment can be a component of your risk analysis but does not satisfy the requirement alone.
- **Business associate scope**: While you are not responsible for conducting your business associates' SRAs, you should verify through your BAA process that they conduct their own risk analyses. Your SRA should assess risks related to BA relationships from your perspective.
- **Meaningful Use legacy**: If you participated in the EHR Incentive Program (Meaningful Use), you should have been conducting SRAs since your first reporting period. OCR and CMS have coordinated enforcement, and attestation to conducting an SRA while not actually completing one constitutes a false claim.

## Common Mistakes

1. **Using a checklist instead of a risk analysis**: Checking off HIPAA requirements does not constitute a risk analysis. You must identify specific threats and vulnerabilities to your specific environment and assess likelihood and impact.
2. **Limiting scope to the EHR**: The SRA must cover all ePHI, not just what is in your EHR. This includes email, fax servers, billing systems, patient communication platforms, medical devices, mobile devices, voicemail, and backup media.
3. **Conducting the SRA once and never updating**: The SRA must be reviewed and updated at least annually and whenever significant changes occur. A stale SRA is a compliance gap.
4. **Not involving clinical staff**: IT staff understand technical controls but may not understand clinical workflows. Clinical staff know where ePHI actually flows, and their input is essential for a complete assessment.
5. **Treating the SRA as an IT project**: The SRA is an organizational risk management activity that happens to involve technology. It should be owned by the compliance function with IT as a critical contributor, not the other way around.
6. **Completing the assessment without a remediation plan**: The SRA identifies risks. Without a documented risk management plan that addresses those risks, the assessment is incomplete.
7. **Accepting all risks without justification**: Risk acceptance is a valid response, but it requires documented justification from an appropriate authority. You cannot simply accept all risks because remediation is inconvenient or expensive.
8. **Using the SRA tool output as your complete documentation**: The HHS SRA Tool generates a report, but that report alone may not constitute sufficient documentation. Supplement with your asset inventory, data flow diagrams, risk management plan, and any supporting analysis.
9. **Attesting to MIPS PI without actually completing the SRA**: This is a false attestation that can trigger fraud investigations and repayment demands. CMS and OCR coordinate on this.
10. **Outsourcing and disengaging**: If you hire a consultant, you still need to participate actively. The consultant does not know your practice operations; they need your input to conduct an accurate assessment.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small) | Estimated Cost (Medium) |
|-------|----------|------------|----------------------|------------------------|
| **Phase 1: Preparation** | Weeks 1-2 | Select SRA approach/tool, assemble team, define scope, gather documentation (network diagrams, system inventory, current policies) | $500-$1,000 | $2,000-$5,000 |
| **Phase 2: Asset Inventory** | Weeks 2-3 | Catalog all ePHI systems, map data flows, identify all locations where ePHI is stored/transmitted | $500-$1,500 | $2,000-$5,000 |
| **Phase 3: Threat & Vulnerability Identification** | Weeks 3-5 | Identify threats, assess vulnerabilities, evaluate current controls, conduct technical vulnerability scan if applicable | $1,000-$3,000 | $3,000-$10,000 |
| **Phase 4: Risk Determination** | Weeks 5-6 | Assess likelihood and impact, calculate risk levels, prioritize findings | $500-$1,000 | $1,000-$3,000 |
| **Phase 5: Documentation** | Weeks 6-7 | Compile risk register, document methodology, finalize SRA report | $500-$1,000 | $1,000-$3,000 |
| **Phase 6: Risk Management Plan** | Weeks 7-8 | Develop remediation plan with priorities, owners, timelines, and budgets | $500-$1,500 | $1,000-$3,000 |
| **Annual Review** | Annually, 2-4 weeks | Review and update SRA, assess new threats, evaluate environment changes, update risk management plan | $2,000-$5,000/yr | $5,000-$15,000/yr |

**Total initial investment**: $3,500-$9,000 (small, self-directed) | $10,000-$29,000 (medium, consultant-assisted)
**Ongoing annual cost**: $2,000-$5,000 (small) | $5,000-$15,000 (medium)

The SRA should be your first compliance activity if you have never completed one, and it should be reviewed and updated before your MIPS reporting period ends each year. Schedule it early in the reporting year so you have time to implement remediation activities that also support your PI attestation.
