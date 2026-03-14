# Health Information Exchange

## What Is This?

Health Information Exchange (HIE) refers to both the process of electronically sharing patient health information across different healthcare organizations and the organizations that facilitate this sharing. When a patient visits an emergency department, sees a specialist, is discharged from a hospital, or receives care at an urgent care center, the clinical data generated during those encounters can flow back to the primary care provider through HIE -- enabling comprehensive, coordinated care based on a complete picture of the patient's health interactions across the care continuum.

HIE operates at three levels. **Query-based exchange** allows providers to search for and retrieve patient records from other participating organizations on demand (like pulling records from a hospital before a follow-up visit). **Directed exchange** pushes specific clinical documents (such as referral responses, discharge summaries, or care plans) from one provider to another, similar to secure email but using standardized clinical document formats. **Consumer-mediated exchange** empowers patients to manage and share their own health information across providers.

The national HIE infrastructure is organized around two major frameworks: **Carequality** and **CommonWell Health Alliance**. Carequality is a public-private collaborative that establishes a common interoperability framework enabling network-to-network data exchange. CommonWell Health Alliance, founded by EHR vendors (Cerner/Oracle Health, athenahealth, Allscripts/Veradigm, and others -- notably not Epic), provides services including record locator, patient linking, and data retrieval. Epic's Care Everywhere operates through Carequality. In late 2022, Carequality and CommonWell announced bidirectional data exchange, effectively linking these two networks and dramatically expanding the reach of either framework.

Additionally, most states operate state-level HIEs (also called Health Information Networks or HINs) that serve as regional data exchanges, often with state funding and sometimes with mandated participation. The Trusted Exchange Framework and Common Agreement (TEFCA), launched by the ONC in late 2023, establishes a nationwide floor for interoperability through Qualified Health Information Networks (QHINs) like eHealth Exchange, KONZA, MedAllies, and others.

## Why Does a Primary Care Practice Need This?

**Care coordination requires visibility into external encounters.** Primary care physicians serve as the patient's medical home, but patients receive care across many settings. When a patient visits the ED on a Saturday night, the PCP needs to know by Monday. When a specialist orders new medications or imaging, the PCP needs these results in the chart. Without HIE, this information arrives by fax (unreliably), by patient report (incompletely), or not at all.

**Reducing redundant testing and imaging.** When a PCP cannot see that a patient already had labs drawn at the ED visit last week, they may reorder the same tests -- wasting money and patient time. HIE-connected practices report reductions in duplicate testing of 10-25%, representing both cost savings and reduced patient burden.

**Hospital discharge follow-up.** Timely post-discharge follow-up is a critical quality measure and a key factor in preventing readmissions. HIE-delivered hospital discharge notifications (ADT alerts) enable practices to proactively schedule follow-up visits within 48-72 hours of discharge rather than waiting for the patient to call or, worse, learning about the hospitalization at the next scheduled visit months later. CMS reimburses Transitional Care Management (TCM) services at $175-$275 per encounter, but this revenue depends on knowing about the discharge promptly.

**Quality reporting and value-based care.** Many quality measures and value-based contract requirements depend on data that originates outside the practice. Hospital admission rates, ED utilization, specialist follow-through, and medication adherence data all come from external sources. HIE provides access to this data, supporting quality measurement and care gap identification.

**Patient safety.** Complete medication lists prevent drug interactions. Knowledge of recent procedures prevents contraindicated interventions. Access to allergy information prevents adverse reactions. HIE contributes directly to patient safety by reducing information gaps.

## How to Decide If You Need It

Every primary care practice benefits from HIE participation. The question is not whether to participate but how to participate most effectively given your EHR platform and local HIE landscape:

- If your EHR is connected to Carequality or CommonWell (most major EHRs are), you already have some level of HIE capability. The decision is whether to actively use it and whether to supplement it with state HIE participation.
- If your state mandates HIE participation (New York, Connecticut, and others have mandated connection to state HIE networks), compliance is non-negotiable.
- If your patient population frequently receives care at hospitals and EDs that use different EHR systems, HIE is particularly valuable for care coordination.
- If you are participating in value-based contracts (ACO, PCMH, shared savings), HIE data is essential for population health management and quality reporting.
- If your practice is in a rural area where patients travel to distant hospitals and specialists, HIE bridges the geographic information gap.

Practices that operate within a closed health system where all care is delivered on the same EHR platform (e.g., an Epic-on-Epic environment) derive less incremental value from external HIE, as intra-system data sharing is already handled natively.

## Order of Operations

1. **Assess your EHR's HIE capabilities.** Contact your EHR vendor to understand which HIE networks your system already connects to (Carequality, CommonWell, state HIE). Determine whether these connections are active or require configuration.
2. **Identify your state HIE.** Research your state's health information exchange network. Determine participation requirements (mandatory vs. voluntary), costs, services offered (ADT alerts, query-based exchange, clinical document exchange), and the enrollment process.
3. **Enable existing connections.** If your EHR supports Carequality or CommonWell but the connection is not active, work with your EHR vendor to enable it. This may involve configuration, testing, and patient matching setup.
4. **Enroll in your state HIE.** If your state has an operational HIE, complete the enrollment process. This typically involves a participation agreement, technical onboarding, patient consent configuration (opt-in vs. opt-out, depending on state law), and interface testing.
5. **Configure ADT alerting.** Prioritize receiving hospital admission and discharge notifications (ADT alerts) for your patient panel. This is the highest-value HIE use case for primary care.
6. **Train staff on workflow integration.** Define how HIE data will be used in clinical workflows: who reviews incoming data, how it is reconciled with the EHR record, and how it triggers follow-up actions (post-discharge calls, care gap outreach).
7. **Monitor and optimize.** Track HIE utilization metrics: how often are external records queried, how many ADT alerts are received and acted upon, and what percentage of hospital discharges result in timely follow-up.

## Options by Practice Size

**Solo/Small Practice (1-5 providers):**
Enable EHR-native HIE connections (Carequality/CommonWell). Enroll in state HIE if available and affordable. Focus on ADT alert reception. Budget: $0-$200/month (many state HIEs are free or low-cost for small practices).

**Mid-Size Group (6-15 providers):**
EHR-native HIE plus active state HIE participation. Configure ADT alerts with practice-specific routing (alerts to the patient's assigned PCP). Integrate HIE data into care coordination workflows and quality reporting. Budget: $200-$1,000/month.

**Large Group (16+ providers, multiple locations):**
Comprehensive HIE strategy including EHR-native connections, state HIE, and potentially direct enrollment as a Carequality or CommonWell implementer for maximum control. Population health analytics integrated with HIE data. Budget: $500-$3,000/month.

## Options Analysis

**Carequality (No direct cost to practices; accessed through EHR):**
A public-private collaborative that enables nationwide health information exchange through a network of networks. Practices access Carequality through their EHR vendor's connection. Epic, Oracle Health, athenahealth, and other major EHRs participate. Strengths: broadest reach for query-based exchange (connected to most hospitals and health systems via Epic Care Everywhere and other EHR connections), no additional cost to the practice beyond EHR fees, national scope. Weaknesses: not a service you contract with directly (your EHR is the intermediary), query-based exchange requires provider initiative to look up records, data quality depends on the sending organization, patient matching across organizations is imperfect.

**CommonWell Health Alliance (No direct cost to practices; accessed through EHR):**
A vendor-backed interoperability network providing record locator, patient linking, and document query services. Participating EHR vendors include Oracle Health, athenahealth, Veradigm (Allscripts), and others. Strengths: strong patient linking and record locator services, growing network, integrated with many EHR platforms. Weaknesses: historically limited by Epic's non-participation (Epic uses Carequality instead), though the Carequality-CommonWell bridge largely resolves this, document-based exchange may not capture structured discrete data as well as direct interfaces.

**State HIEs (Costs vary widely: $0-$500/month for practices):**
Most states operate health information exchange networks. Notable examples include the Statewide Health Information Network of New York (SHIN-NY), the Indiana Health Information Exchange (IHIE), Chesapeake Regional Information System for our Patients (CRISP) in Maryland, and Colorado Regional Health Information Organization (CORHIO). Strengths: strong local and regional data coverage (often includes data from community hospitals, behavioral health, post-acute care, and other providers that may not participate in national networks), ADT alerting services, may include public health reporting capabilities, often subsidized or free for small practices. Weaknesses: geographic coverage limited to the state (plus adjacent state agreements in some cases), variable maturity and service levels across states, enrollment and technical onboarding can be time-consuming, some state HIEs have limited EHR integration.

**TEFCA / QHINs (Emerging, costs TBD):**
The Trusted Exchange Framework and Common Agreement (TEFCA), coordinated by the ONC through the Recognized Coordinating Entity (The Sequoia Project), establishes a nationwide framework for interoperability through Qualified Health Information Networks (QHINs). Designated QHINs include eHealth Exchange, KONZA, MedAllies, Health Gorilla, Epic Nexus, and the CommonWell-Carequality interoperability. Strengths: establishes a national floor for interoperability with standardized trust and governance, will eventually simplify the HIE landscape, supports multiple exchange purposes (treatment, payment, public health, individual access). Weaknesses: still early in deployment (most QHINs became operational in 2024-2025), practice-level impact is still emerging, access typically through existing EHR or HIE connections rather than direct practice enrollment.

**Bamboo Health (formerly PatientPing + Appriss Health) ($200-$1,000/month):**
A care collaboration platform specializing in real-time ADT notifications and care coordination. When a patient on your panel is admitted, discharged, or transferred at a participating facility, Bamboo Health sends an alert. Used by ACOs, health plans, and practice networks for care coordination. Strengths: strong ADT alerting focused specifically on care transitions, wide hospital network, integration with care management workflows, real-time notifications. Weaknesses: supplemental to rather than a replacement for HIE, additional cost beyond EHR and HIE fees, value depends on the density of participating facilities in your market.

## Vendor Landscape

The HIE landscape is undergoing a significant transformation driven by TEFCA, the maturation of FHIR-based exchange, and the convergence of national networks. The historical fragmentation -- where practices might need to participate in multiple networks to achieve reasonable data coverage -- is gradually resolving as Carequality, CommonWell, and TEFCA create broader connectivity.

For primary care practices, the most actionable trend is that EHR vendors are doing more of the HIE heavy lifting. If your EHR is current and well-configured, you likely have access to a significant and growing pool of external clinical data without needing separate HIE contracts. The key is ensuring these capabilities are activated and integrated into your clinical workflows.

Payer-based data exchange is an emerging complement to traditional provider-to-provider HIE. Under TEFCA's payment purpose of use and CMS's Interoperability and Prior Authorization final rule (CMS-0057-F), payers are increasingly required to make claims and clinical data available to providers through standardized APIs. This will eventually give primary care practices access to a more complete picture of their patients' healthcare utilization across all settings.

## Compliance & Regulatory Notes

**Patient Consent:** HIE consent models vary by state. Some states use opt-out models (patients are included in HIE by default and must actively opt out), while others use opt-in models (patients must consent to inclusion). A few states have granular consent requirements allowing patients to control which data is shared and with whom. Your practice must understand and comply with your state's consent model.

**HIPAA and HIE:** HIE participation is permitted under HIPAA's Treatment, Payment, and Healthcare Operations (TPO) provisions. A BAA with the HIE organization is required. The minimum necessary standard applies -- you should access only the information needed for the patient's care.

**Information Blocking:** Under the 21st Century Cures Act, healthcare providers must not engage in information blocking -- practices that unreasonably prevent access, exchange, or use of electronic health information. Refusing to participate in reasonable HIE, imposing unreasonable fees, or implementing technology that restricts interoperability can constitute information blocking. Eight exceptions define what practices are considered reasonable (privacy, security, feasibility, etc.).

**TEFCA Compliance:** As TEFCA matures, practices will access it through their EHR or HIE connections. Direct TEFCA compliance obligations for individual practices are minimal, but practices should be aware that TEFCA's "Required Exchange" provisions will eventually require responses to queries from other TEFCA participants.

**42 CFR Part 2:** Substance use disorder treatment records receive special federal protection under Part 2. HIE of SUD data requires specific patient consent beyond standard HIPAA consent. Practices receiving HIE data should be aware that Part 2 data may carry re-disclosure restrictions.

## Common Mistakes

1. **Having HIE capabilities but never using them.** Many practices are technically connected to HIE networks through their EHR but never query for external records or act on incoming data. Connection without workflow integration provides no value.

2. **Not configuring ADT alerts.** ADT alerts (admission, discharge, transfer notifications) are the highest-value HIE service for primary care. If your HIE or EHR offers ADT alerting, configure it to deliver alerts for your patient panel to the appropriate care team member.

3. **Not reconciling HIE data.** Receiving an external medication list or problem list is not the same as incorporating it into your patient's chart. Establish workflow for reviewing and reconciling incoming HIE data, particularly medications, allergies, and diagnoses.

4. **Ignoring patient matching issues.** HIE relies on accurate patient matching across organizations. If your patient demographic data (name, date of birth, address, SSN, phone) is incomplete or inconsistent, matching rates will be poor. Maintain clean demographic data and use MPI (Master Patient Index) features.

5. **Assuming HIE replaces direct communication.** HIE supplements but does not replace direct provider-to-provider communication. A complex patient returning from a hospital stay still benefits from a phone call between the discharging hospitalist and the PCP, in addition to the electronic data exchange.

6. **Not training providers on available data.** Clinicians may not know how to access external records through the EHR or may not realize that ADT alerts are available. Training and workflow design are essential for adoption.

## Recommended Implementation Timeline

**Weeks 1-2: Assessment**
Identify current HIE capabilities within your EHR. Research your state HIE options. Determine which hospitals and health systems in your market participate in which networks. Assess patient consent requirements for your state.

**Weeks 3-4: Activation**
Enable EHR-native HIE connections (Carequality, CommonWell) if not already active. Begin state HIE enrollment if applicable. Contact your EHR vendor for configuration assistance.

**Weeks 5-8: Technical Onboarding**
Complete state HIE enrollment and technical setup. Configure ADT alert routing. Test data query and document retrieval with connected organizations. Validate patient matching accuracy.

**Weeks 9-10: Workflow Design**
Define clinical workflows for using HIE data: who reviews ADT alerts, how are external records incorporated into the chart, what triggers a post-discharge outreach call, how is medication reconciliation performed with external data. Document these workflows and assign responsibilities.

**Weeks 11-12: Training and Go-Live**
Train clinical staff on accessing and using HIE data within the EHR. Train care coordinators on ADT alert management. Go live with active HIE utilization.

**Months 4-6: Optimization**
Monitor utilization metrics. Survey providers on the value and usability of HIE data. Address data quality or patient matching issues. Expand HIE data use to population health and quality reporting workflows.

**Ongoing: Continuous Improvement**
Monitor HIE network growth in your market. Stay informed on TEFCA developments. Reassess HIE strategy annually as the national interoperability landscape evolves. Track the impact of HIE on care coordination outcomes (post-discharge follow-up rates, duplicate testing reduction, care gap closure).
