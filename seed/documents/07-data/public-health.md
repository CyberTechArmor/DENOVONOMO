# Public Health & Syndromic Surveillance

## What Is This?

Public health reporting and syndromic surveillance encompass the electronic systems and processes by which primary care practices transmit clinical and laboratory data to public health agencies for disease monitoring, outbreak detection, and population health tracking. This category covers two primary data flows:

**Electronic Laboratory Reporting (ELR)** is the automated transmission of reportable laboratory results from healthcare providers (or their reference labs) to state and local public health departments. When a patient tests positive for chlamydia, hepatitis C, influenza, or any of the 100+ conditions on your state's reportable conditions list, that result must be transmitted to public health authorities. ELR automates what was historically a fax-and-phone-call process, using HL7 v2.5.1 ORU (Observation Result) messages or increasingly FHIR-based electronic case reporting.

**Syndromic surveillance** is the near-real-time collection of pre-diagnostic health data --- chief complaints, presenting symptoms, vital signs, discharge diagnoses, and demographic information --- from emergency departments, urgent care facilities, and increasingly primary care practices. This data feeds the CDC's National Syndromic Surveillance Program (NSSP) and state/local BioSense platforms, enabling early detection of disease outbreaks, bioterrorism events, and environmental health threats before confirmatory diagnoses are available.

A third emerging pathway is **Electronic Case Reporting (eCR)**, which uses the HL7 FHIR-based eICR (electronic Initial Case Report) standard to automatically trigger case reports to public health when specific conditions are documented in the EHR. The Association of Public Health Laboratories (APHL) operates the AIMS platform (formerly the Digital Bridge) that routes eICR documents from EHRs to the appropriate public health jurisdiction.

## Why Does a Primary Care Practice Need This?

**Legal obligation.** Every state has mandatory disease reporting laws. Providers who fail to report notifiable conditions face penalties ranging from citations to fines ($100--$500 per unreported case in some states) to, in extreme cases, license action. While historically enforced loosely, increasing EHR-based automation has made non-reporting more visible to public health authorities.

**Promoting Interoperability compliance.** CMS MIPS Promoting Interoperability includes public health reporting measures. Eligible providers must demonstrate active engagement with public health registries, including syndromic surveillance reporting and electronic case reporting. Failure reduces MIPS composite scores and can trigger negative payment adjustments.

**Outbreak response.** COVID-19 exposed how dependent public health infrastructure is on provider-level reporting. Practices with functioning ELR and syndromic surveillance connections contributed real-time data that informed masking guidance, vaccine distribution, and school closure decisions. Those without automated reporting faced overwhelming manual reporting burdens.

**Professional responsibility.** Timely disease reporting enables contact tracing, outbreak containment, and public health interventions that protect your patients and community. A reported case of measles in your practice triggers contact tracing that can prevent dozens of additional cases.

**Quality of care.** Bidirectional public health connectivity (where available) allows practices to receive alerts about community disease trends, patient-specific exposure notifications, and updated public health guidance relevant to their patient population.

## How to Decide If You Need It

Like immunization registry reporting, public health reporting is largely mandatory, not optional. The decision is about implementation approach and level of automation.

**You must implement ELR if:**
- You order laboratory tests that include reportable conditions (virtually every primary care practice)
- Your state mandates electronic reporting (most do)
- You participate in MIPS Promoting Interoperability

**Note on ELR:** Many practices rely on their reference laboratory (Quest, Labcorp, regional labs) to handle ELR directly with public health. This is common and acceptable in most states --- the lab reports the result to public health, not the ordering provider. However, for point-of-care tests (rapid strep, rapid flu, rapid COVID, urinalysis) performed and resulted in your office, the reporting obligation falls on the practice.

**You should implement syndromic surveillance if:**
- Your state requires it for ambulatory settings (increasingly common)
- You operate urgent care or walk-in services
- You participate in MIPS Promoting Interoperability (syndromic surveillance is a reporting measure)
- You want to contribute to community health monitoring

**You should implement eCR if:**
- Your EHR supports the eICR standard (Epic, Cerner/Oracle Health, athenahealth, and others have implemented or are implementing eCR)
- You want to automate case reporting and reduce manual reporting burden
- Your state's public health department accepts eICR (most do via the APHL AIMS platform)

## Order of Operations

1. **Identify your state's reportable conditions list and reporting requirements.** Contact your state epidemiologist's office or health department website. Obtain the current list of reportable conditions, required data elements, reporting timelines (immediate, 24-hour, 5-day), and accepted electronic reporting methods.

2. **Assess reference lab coverage.** Contact Quest, Labcorp, or your regional reference lab to confirm they are reporting ELR results for your practice directly to your state/local public health department. Obtain written confirmation and understand what conditions and result types they cover.

3. **Identify point-of-care test reporting gaps.** List all CLIA-waived and moderate-complexity tests performed in your office. Cross-reference with the reportable conditions list. Common gaps: rapid influenza, rapid COVID-19 antigen, rapid strep (GAS), urine drug screens, rapid HIV, and pregnancy tests (reportable in some jurisdictions for congenital syphilis screening workflows).

4. **Contact your EHR vendor.** Determine what public health reporting modules are available: ELR, syndromic surveillance, eCR. Understand costs, implementation timelines, and state-specific readiness.

5. **Register with your state/local health department.** Enroll in ELR and syndromic surveillance programs. Obtain test facility identifiers and endpoint connection details.

6. **Implement and test ELR for point-of-care tests.** If your reference lab covers ELR for send-out tests, focus your ELR implementation on the point-of-care testing gap. Submit test messages, validate formatting, and obtain production approval.

7. **Implement syndromic surveillance.** Configure your EHR to transmit ADT (admission-discharge-transfer) or equivalent encounter-level data to the state's syndromic surveillance system. This typically uses HL7 v2.5.1 ADT messages sent via SFTP or web service.

8. **Enable eCR (if available).** Activate your EHR's electronic case reporting module. The RCTC (Reportable Condition Trigger Codes) value set maintained by APHL defines which diagnoses and lab results trigger automatic eICR generation.

9. **Train providers on manual reporting obligations.** Despite automation, some conditions require immediate phone notification to public health (e.g., suspected bioterrorism agents, measles, plague, anthrax). Ensure providers know which conditions require immediate verbal reporting and have the health department's 24/7 contact number posted.

## Options by Practice Size

**Solo/Small Practice (1--2 providers)**
Rely on reference lab ELR for send-out tests. For point-of-care tests, use your state health department's web portal for manual case reporting if volume is low (fewer than 10 reportable results per month). If your EHR supports eCR, enable it --- the automation eliminates manual reporting entirely. Budget: $0--$200/month.

**Small Group (3--5 providers)**
Enable EHR-native ELR for point-of-care tests and eCR if available. Register for syndromic surveillance if required by your state or for MIPS credit. Budget: $0--$500 for setup; ongoing costs typically included in EHR subscription.

**Medium Group (6--15 providers, multiple sites)**
Automated ELR, syndromic surveillance, and eCR across all sites. Use an integration engine (Mirth Connect, Rhapsody) if sites use different EHRs or if the EHR's native public health modules are inadequate. Budget: $500--$2,000 setup; $200--$500/month ongoing if using middleware.

**Large Group (15+ providers)**
Enterprise public health reporting infrastructure with centralized monitoring. Automated ELR, syndromic surveillance, and eCR with dashboards tracking submission success rates and rejection patterns. Assign a public health reporting coordinator. Budget: $2,000--$5,000 setup; $500--$1,500/month ongoing.

## Options Analysis

| Reporting Type | Standard | Transport | EHR Support | Effort Level |
|---------------|----------|-----------|-------------|-------------|
| **ELR (via reference lab)** | HL7 ORU | Lab handles | N/A --- lab responsibility | None for practice |
| **ELR (point-of-care)** | HL7 v2.5.1 ORU | SFTP, web service | Most major EHRs | Medium setup |
| **Syndromic surveillance** | HL7 v2.5.1 ADT | SFTP, web service to BioSense/NSSP | Epic, Cerner, athena, eCW | Medium setup |
| **eCR (electronic case reporting)** | HL7 FHIR eICR/RR | APHL AIMS platform | Epic, Cerner, athena (expanding) | Low setup (EHR-managed) |
| **Manual web portal** | State-specific forms | Browser | N/A | High (per-case staff time) |

**eCR is the future direction** and dramatically simplifies compliance. Rather than maintaining separate ELR and case reporting interfaces, eCR automatically generates and routes case reports based on trigger codes embedded in your EHR's clinical documentation. If your EHR supports eCR, prioritize its activation over building separate ELR interfaces for point-of-care tests.

## Vendor Landscape

Public health reporting is primarily an EHR-vendor and government-infrastructure story rather than a commercial software market.

**EHR vendors with strong public health modules:**
- **Epic:** Comprehensive public health reporting suite including ELR, syndromic surveillance, eCR, and immunization reporting. Generally included in Epic subscription. Epic's community connect and hosted models handle connectivity.
- **Oracle Health (Cerner):** Robust public health reporting through their Public Health Reporting module. eCR support through the APHL AIMS integration.
- **athenahealth:** ELR and immunization reporting included. Syndromic surveillance and eCR capabilities expanding. athena manages most state-specific interface requirements.
- **eClinicalWorks:** ELR and public health reporting available. Implementation varies by state. May require additional configuration fees.

**Integration middleware:**
- **Mirth Connect / NextGen Connect:** Open-source integration engine widely used for public health message routing. Free software, but requires technical expertise to configure and maintain.
- **Rhapsody:** Commercial integration engine with healthcare-specific modules for public health reporting. $1,000--$3,000/month.

**Government platforms:**
- **APHL AIMS Platform:** Routes eCR documents from EHRs to appropriate jurisdictional public health departments. No cost to providers --- funded by CDC.
- **CDC NSSP BioSense Platform:** Receives syndromic surveillance data from providers via state intermediaries. No direct cost to providers.
- **NEDSS (National Electronic Disease Surveillance System):** Used by many state health departments to receive and manage case reports. State-operated.

**Emerging:**
- **CareEvolution:** Provides public health data management and connectivity services, particularly for eCR routing and COVID-19 reporting.
- **Audacious Inquiry (now part of Gainwell Technologies):** Offers public health alerting and connectivity services through health information exchange platforms.

## Compliance & Regulatory Notes

**Mandatory reporting timelines are non-negotiable.** Conditions classified as "immediately reportable" (anthrax, botulism, plague, smallpox, measles, polio) require verbal notification to public health within hours, not days. Electronic reporting does not substitute for immediate phone reporting of these conditions.

**HIPAA permits public health reporting.** Under 45 CFR 164.512(b), covered entities may disclose PHI to public health authorities for disease surveillance, investigation, and intervention without patient authorization. Providers should not withhold reportable information due to HIPAA concerns --- the law explicitly authorizes this disclosure.

**Promoting Interoperability measures.** For MIPS Year 2025 and beyond, public health reporting measures include: (1) Immunization Registry Reporting, (2) Electronic Case Reporting, (3) Public Health Registry Reporting, (4) Syndromic Surveillance Reporting, and (5) Clinical Data Registry Reporting. Providers must demonstrate active engagement with at least two public health measures.

**State variation is significant.** Reportable conditions lists, reporting timelines, data format requirements, and accepted transport mechanisms vary by state. Multi-state practices must comply with each state's requirements independently. Some conditions are reportable in one state but not another.

**COVID-19 legacy requirements.** Many states implemented COVID-19-specific reporting requirements (laboratory results within 24 hours, case demographics, vaccination status) that may persist as permanent additions to reportable conditions frameworks. Check your state's current requirements.

**42 CFR Part 2 intersection.** If your practice provides substance abuse treatment, certain lab results (e.g., drug screens ordered as part of substance abuse treatment) may be subject to 42 CFR Part 2 protections that restrict disclosure even for public health purposes, unless the patient consents or a court order is obtained. This is a narrow but important exception.

## Common Mistakes

**Assuming your reference lab handles all ELR.** Reference labs report the tests they perform, not your point-of-care tests. Rapid flu, rapid strep, rapid COVID, and other CLIA-waived tests performed in your office are your reporting responsibility. This gap is the most common source of non-compliance.

**Not monitoring ELR message acknowledgments.** Like immunization reporting, ELR submissions generate acknowledgment messages. Practices that never check ACKs may operate for months with rejected submissions, creating reportable condition gaps that surface during public health investigations.

**Confusing syndromic surveillance with ELR.** These are separate data flows serving different purposes. Syndromic surveillance transmits encounter-level demographic and chief complaint data for trend detection. ELR transmits specific laboratory results for case-based disease reporting. Both may be required; one does not substitute for the other.

**Failing to update reportable conditions lists.** States periodically add and remove conditions from their reportable lists. Ensure your EHR's trigger codes and staff awareness are updated at least annually.

**Over-relying on automation.** Automated eCR and ELR are excellent but cannot replace clinical judgment. A provider who suspects a novel pathogen or unusual cluster must report to public health even if the EHR does not auto-generate a case report. Train providers to recognize when manual reporting is needed.

**Not establishing a relationship with your local health department.** Your local epidemiologist is a resource, not just a regulatory authority. Establishing a working relationship before an outbreak streamlines communication, provides access to local disease intelligence, and makes compliance assistance available when you need it.

## Recommended Implementation Timeline

**Weeks 1--2:** Obtain your state's reportable conditions list and reporting requirements. Identify your reference lab's ELR coverage. Inventory all point-of-care tests and cross-reference with reportable conditions.

**Weeks 3--4:** Contact your EHR vendor to assess available public health reporting modules (ELR, syndromic surveillance, eCR). Determine costs, state-specific readiness, and implementation timelines.

**Weeks 5--6:** Register with your state/local health department for electronic reporting programs. Complete enrollment forms and data use agreements. Obtain facility identifiers and connection parameters.

**Weeks 7--10:** Implement ELR for point-of-care reportable tests. Submit test messages, validate against state requirements, and achieve production certification. If eCR is available through your EHR, initiate activation --- eCR may cover point-of-care ELR obligations and eliminate the need for a separate ELR interface.

**Weeks 11--14:** Implement syndromic surveillance reporting. Configure ADT message generation in your EHR, establish connectivity to your state's BioSense node, submit test messages, and go live.

**Weeks 15--16:** Train clinical staff on reporting obligations. Post the state's immediately reportable conditions list and health department contact numbers in clinical areas. Brief providers on manual reporting triggers.

**Weeks 17--20:** Monitor all public health reporting channels for acknowledgments and rejections. Resolve errors. Conduct a 30-day reconciliation comparing reportable results in your EHR against confirmed submissions to public health.

**Ongoing:** Quarterly review of reportable conditions list updates, annual staff retraining, monthly monitoring of submission success rates, and participation in state/local health department preparedness exercises when invited.
