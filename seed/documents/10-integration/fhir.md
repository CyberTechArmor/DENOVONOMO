# FHIR API Strategy

## What Is This?

FHIR (Fast Healthcare Interoperability Resources, pronounced "fire") is a modern standard for exchanging healthcare information electronically, developed by HL7 International. Unlike its predecessor HL7 v2, which uses cryptic pipe-delimited message segments, FHIR uses contemporary web technologies -- RESTful APIs, JSON, and XML -- that align with how the broader software industry builds integrations. FHIR organizes healthcare data into "Resources" (Patient, Observation, MedicationRequest, Encounter, Condition, etc.) that can be created, read, updated, and searched through standard HTTP operations.

For a primary care practice, FHIR matters because it is the foundation of a regulatory mandate. The 21st Century Cures Act and its implementing regulations (ONC's Interoperability Final Rule and CMS's Interoperability and Patient Access Final Rule) require that certified EHR technology support FHIR-based APIs -- specifically the US Core Implementation Guide based on FHIR R4. This means your EHR vendor must provide FHIR APIs that enable patients to access their health data through third-party apps, other healthcare providers to query your system for treatment purposes, and authorized applications to read (and increasingly write) clinical data.

The practical implication is that FHIR is not something a primary care practice needs to "implement" in the way you implement a new software system. Rather, FHIR is a capability embedded in your EHR that you need to understand, enable where required, govern appropriately, and leverage strategically for integrations and care improvement.

FHIR R4, released in 2019, is the normative (stable) version required by US regulations. FHIR R5 was released in 2023 but has not yet been mandated. SMART on FHIR (Substitutable Medical Applications and Reusable Technologies) is a companion specification that enables secure, authorized access to FHIR APIs -- it is the mechanism by which third-party applications authenticate and are granted access to clinical data.

## Why Does a Primary Care Practice Need This?

**Regulatory compliance.** The 21st Century Cures Act requires healthcare providers to make electronic health information available through standardized APIs without information blocking. Certified EHR technology must support FHIR R4 APIs using the US Core Implementation Guide. CMS requires that payers provide FHIR-based Patient Access APIs, Provider Directory APIs, and Prior Authorization APIs. Practices that obstruct or fail to support data access through these APIs risk information blocking penalties (up to $1 million per violation for health IT developers, and potential CMS enforcement for providers).

**Patient data access.** Patients have the right to access their health information, and FHIR APIs make this practical through patient-facing apps. Apple Health, Google Health Connect, and numerous consumer health apps can connect to your EHR's FHIR API to give patients access to their clinical data (lab results, medications, allergies, immunizations, visit summaries). Supporting this capability is both a regulatory requirement and a patient satisfaction factor.

**Third-party application integration.** The FHIR API on your EHR is a gateway for connecting specialty applications -- clinical decision support tools, population health platforms, remote patient monitoring systems, quality reporting tools, and clinical research platforms. Rather than requiring custom interface development for each new application, FHIR provides a standardized way for these tools to access and contribute clinical data.

**Payer integration is moving to FHIR.** CMS's Interoperability and Prior Authorization Final Rule (CMS-0057-F, effective 2026-2027) requires payers to implement FHIR-based Prior Authorization APIs that will dramatically streamline the prior authorization process. Eventually, practices will submit prior auth requests and receive decisions through FHIR APIs rather than fax and phone. Understanding FHIR positions your practice to adopt these efficiencies as they become available.

**Future-proofing.** Healthcare IT is moving toward FHIR as the universal integration language. Practices that understand and leverage FHIR will be better positioned to adopt new technologies, switch vendors, participate in data exchange networks, and meet evolving regulatory requirements.

## How to Decide If You Need It

You do not need to decide whether to adopt FHIR -- it is already embedded in your certified EHR. The decisions you need to make are:

1. **Is your EHR's FHIR API properly enabled and configured?** Contact your EHR vendor to confirm that FHIR R4 APIs are active, that patient-facing SMART on FHIR app connections are supported, and that the API is properly registered with the ONC's CHPL (Certified Health IT Product List).

2. **Do you have a governance framework for third-party app access?** When a patient connects a third-party app to your EHR via FHIR, or when a vendor requests API access, you need policies governing who can connect, what data they can access, and how you manage ongoing authorization.

3. **Are there integration opportunities you should pursue via FHIR?** If you are evaluating new clinical tools (CDS, remote monitoring, population health), check whether they can integrate via your EHR's FHIR API rather than requiring a custom interface. FHIR-based integrations are typically faster and cheaper to implement.

4. **Are you prepared for payer FHIR APIs?** As payer FHIR APIs come online (Patient Access API, Provider Directory API, Prior Authorization API), your practice management and EHR systems should be ready to connect.

## Order of Operations

1. **Understand your current FHIR capabilities.** Contact your EHR vendor and request documentation of their FHIR R4 API capabilities, supported resources, and SMART on FHIR implementation. Review their listing on the ONC CHPL.
2. **Enable patient access.** Ensure that patients can connect third-party apps to access their health data through your EHR's FHIR API. This is a regulatory requirement. Test the patient app connection workflow.
3. **Establish API governance.** Develop policies for managing third-party application access to your EHR's API. Define approval processes, data access scope, security requirements, and revocation procedures.
4. **Inventory integration opportunities.** Review your current and planned integrations. Identify which ones could be implemented or improved using FHIR APIs rather than traditional HL7v2 interfaces or custom connections.
5. **Engage with FHIR-based services.** As payer FHIR APIs, TEFCA FHIR-based exchange, and other FHIR services become available, evaluate and adopt them to improve operational efficiency.
6. **Monitor regulatory developments.** FHIR requirements are evolving. Stay informed about new CMS and ONC rules that may affect your FHIR obligations and opportunities.

## Options by Practice Size

**Solo/Small Practice (1-5 providers):**
Rely entirely on your EHR vendor's FHIR implementation. Ensure patient access APIs are enabled. No additional FHIR investment needed. Budget: $0 beyond EHR fees.

**Mid-Size Group (6-15 providers):**
EHR vendor's FHIR capabilities plus strategic use of FHIR-based integrations for new clinical applications. Consider engaging a health IT consultant for FHIR strategy development. Budget: $0-$500/month for FHIR-based application subscriptions.

**Large Group (16+ providers):**
Active FHIR integration strategy. May deploy a FHIR server or integration platform (Azure Health Data Services, Google Cloud Healthcare API, AWS HealthLake) for data aggregation and analytics. Dedicated IT/integration staff with FHIR expertise. Budget: $500-$5,000/month for FHIR infrastructure and applications.

## Options Analysis

**EHR Vendor-Provided FHIR APIs (included in EHR subscription):**
Every certified EHR must provide FHIR R4 APIs. Epic (FHIR R4 via Epic on FHIR), athenahealth (FHIR R4 API), Oracle Health/Cerner (FHIR R4 via Millennium), eClinicalWorks (FHIR API), and other certified EHRs all provide FHIR endpoints. Strengths: no additional cost, maintained by the EHR vendor, certified to meet regulatory requirements, integrated with the EHR's data model and security framework. Weaknesses: vendor controls the scope and pace of FHIR development, some vendors offer broader FHIR resource coverage than others, write-back (creating or updating data via FHIR) is more limited than read access, vendor-specific extensions may limit true portability.

**SMART on FHIR Applications (varies by application):**
A growing ecosystem of applications built to connect to any EHR's FHIR API using the SMART on FHIR standard. Examples include CDS Hooks-based clinical decision support, patient-facing apps, growth chart apps (like PediTools), and research data collection tools. Strengths: EHR-agnostic (works with any FHIR-enabled EHR), rapidly growing ecosystem, standard authentication/authorization, embedded in clinical workflow. Weaknesses: limited to data available through the EHR's FHIR API, application quality varies, practices must evaluate each application's privacy and security practices.

**Azure Health Data Services (consumption-based, approximately $0.06-$1.50 per API operation):**
Microsoft's managed FHIR service within Azure. Provides a FHIR R4 server, data conversion services (HL7v2 to FHIR, C-CDA to FHIR), and integration with Azure analytics and AI services. Strengths: enterprise-grade FHIR server without infrastructure management, strong data analytics and AI integration, HIPAA-compliant, supports bulk data operations. Weaknesses: requires Azure expertise, consumption-based pricing can be unpredictable, primarily relevant for larger organizations aggregating data from multiple sources.

**Google Cloud Healthcare API (consumption-based, similar pricing to Azure):**
Google's managed healthcare data platform providing FHIR R4 store, HL7v2 store, DICOM store, and integration with Google's analytics and machine learning tools. Strengths: strong machine learning and analytics capabilities, scalable, good FHIR implementation. Weaknesses: requires Google Cloud expertise, healthcare market presence smaller than Azure's, data governance concerns in Google ecosystem.

**AWS HealthLake ($0.55/GB stored, $0.05 per 1000 read requests):**
Amazon's managed FHIR-based data store designed for healthcare data aggregation and analytics. Includes automated data normalization, natural language processing for unstructured clinical notes, and integration with AWS analytics services. Strengths: strong NLP capabilities for clinical text, integrated with broad AWS ecosystem, managed infrastructure. Weaknesses: AWS healthcare market penetration is growing but trails Azure, requires AWS expertise, pricing model for large data volumes can be expensive.

**Redox ($500-$5,000/month depending on connections and volume):**
A health data integration platform that normalizes healthcare data exchange through a universal API, including FHIR. Redox maintains pre-built connections to hundreds of EHR systems and translates between legacy formats (HL7v2) and modern standards (FHIR). Strengths: abstracts away EHR-specific FHIR implementation differences, pre-built EHR connections, strong developer experience, faster integration deployment. Weaknesses: adds a middleware layer and associated cost, less direct than native EHR FHIR API access, pricing per connection can be expensive for practices with many integrations.

## Vendor Landscape

The FHIR ecosystem is maturing rapidly. The major EHR vendors have invested significantly in their FHIR capabilities, with Epic generally leading in breadth and depth of FHIR resource support. The US Core Implementation Guide (currently version 6.1 based on FHIR R4) defines the minimum data set that all certified EHRs must support, but many vendors go beyond this minimum.

The SMART on FHIR application ecosystem is growing but still nascent compared to consumer app stores. The most active areas include clinical decision support (CDS Hooks), patient engagement, research data collection, and population health analytics. Epic's App Orchard (now Showroom), athenahealth's Marketplace, and Cerner's Code Console provide platforms for SMART on FHIR application distribution.

Bulk FHIR (FHIR Bulk Data Access) is an important emerging capability that allows authorized applications to export large datasets (entire patient populations) for analytics, quality reporting, and research. CMS requires payers to support Bulk FHIR for Provider Access APIs, and EHR vendors are implementing Bulk FHIR export capabilities. For primary care practices participating in ACOs or value-based contracts, Bulk FHIR will become an important tool for population health analytics.

The Davinci Project, an HL7 initiative, is developing FHIR implementation guides specifically for payer-provider exchange. Key Davinci implementation guides include Prior Authorization Support (PAS), Coverage Requirements Discovery (CRD), Documentation Templates and Rules (DTR), and Member Attribution List. These will define how prior authorization, benefits verification, and other payer interactions work via FHIR APIs.

## Compliance & Regulatory Notes

**Information Blocking Rule (45 CFR Part 171):** Healthcare providers must not engage in practices that unreasonably prevent access, exchange, or use of electronic health information. Eight exceptions define reasonable restrictions: privacy, security, infeasibility, health IT performance, content and manner, fees, licensing, and other. Practices must support patient-facing FHIR API access and should not unreasonably restrict FHIR-based data exchange for treatment purposes.

**Patient Access API (CMS-9115-F):** CMS requires health plans (not providers directly) to maintain FHIR-based Patient Access APIs. However, practices benefit from this requirement as patients can share payer data (claims, prior authorizations, provider directory) back to their providers through FHIR-based apps.

**Prior Authorization API (CMS-0057-F):** Effective for plan years beginning January 1, 2026 (for Medicare Advantage, Medicaid, CHIP, and Marketplace plans), payers must implement FHIR-based Prior Authorization APIs. This will enable EHRs and practice management systems to submit and track prior authorizations electronically through standardized APIs, reducing the current manual, fax-based process.

**HIPAA and FHIR:** FHIR APIs must comply with HIPAA security requirements. SMART on FHIR's OAuth 2.0-based authentication satisfies many HIPAA access control requirements, but practices must still manage API access governance, audit logging, and appropriate use monitoring. When patients connect third-party apps, the practice's HIPAA obligations end at the point of authorized data release -- the third-party app is not necessarily a covered entity or business associate.

**USCDI (United States Core Data for Interoperability):** ONC defines the minimum data set that must be available through FHIR APIs via the USCDI. USCDI v1 was required from 2022, USCDI v3 is required for 2025 certified EHR versions, and USCDI v4 expands the data set further. Practices should ensure their EHR is current with USCDI requirements.

## Common Mistakes

1. **Ignoring FHIR because it seems too technical.** Practice leaders often dismiss FHIR as an IT concern. While the technical implementation is handled by the EHR vendor, the strategic implications -- patient data access, integration strategy, regulatory compliance, and payer interoperability -- are leadership decisions.

2. **Not enabling patient-facing FHIR access.** Some practices, concerned about patient-facing data access (worrying about patient anxiety from seeing results, or about third-party app privacy), delay enabling patient FHIR API access. This is a regulatory requirement, not an option. Work with your EHR vendor to ensure it is properly configured.

3. **Failing to establish API governance.** When a third-party vendor requests FHIR API access to your EHR, who approves it? What data can they access? How is access revoked? Without governance, you risk unauthorized data access or, conversely, blocking legitimate integrations.

4. **Over-investing in FHIR infrastructure.** Small and mid-size primary care practices do not need their own FHIR server, cloud data platform, or integration engine for FHIR. Your EHR vendor provides the FHIR API -- use it. Additional FHIR infrastructure is only warranted for large organizations with complex data aggregation needs.

5. **Confusing FHIR with a complete integration strategy.** FHIR does not replace all other integration mechanisms. HL7v2 remains essential for lab interfaces, NCPDP for pharmacy, X12 for claims, and Direct messaging for clinical document exchange. FHIR is additive, not a wholesale replacement.

6. **Not preparing for payer FHIR APIs.** The Prior Authorization FHIR APIs (CMS-0057-F) will transform prior authorization workflows beginning in 2026. Practices that are not engaging with their EHR and practice management vendors about FHIR-based prior auth readiness will miss the efficiency gains.

## Recommended Implementation Timeline

**Weeks 1-2: Assessment**
Contact your EHR vendor to understand current FHIR R4 capabilities. Review which FHIR resources are supported, whether patient-facing SMART on FHIR app connections are enabled, and what third-party integrations are available through the EHR's FHIR API. Confirm USCDI version support.

**Weeks 3-4: Enable Patient Access**
Ensure patient-facing FHIR API access is properly configured. Test the patient experience by connecting a test account to a SMART on FHIR app (Apple Health is a common test). Verify that appropriate clinical data is accessible.

**Weeks 5-6: Governance Framework**
Develop a simple FHIR API governance policy covering: who can request API access, what approval process is required, what data elements are accessible, how access is monitored and audited, and how access is revoked. This need not be complex for small practices -- a one-page policy suffices.

**Months 3-6: Strategic Integration Evaluation**
When evaluating new clinical tools or platforms, prioritize those that integrate via FHIR. Evaluate whether any current integrations could be improved by migrating to FHIR-based connections. Monitor your EHR vendor's FHIR roadmap.

**Months 6-12: Payer API Preparation**
Engage with your EHR and practice management vendors about their plans for supporting payer FHIR APIs (Prior Authorization, Provider Directory, Patient Access). Identify which payers in your market are implementing FHIR APIs and assess readiness for connection.

**Ongoing: Monitor and Evolve**
Stay informed on ONC and CMS rulemaking affecting FHIR requirements. Monitor USCDI version updates. Evaluate new SMART on FHIR applications as the ecosystem grows. Participate in your EHR vendor's FHIR user community or advisory groups.
