# Immunization Registry Reporting

## What Is This?

Immunization registry reporting is the electronic transmission of vaccination administration data from a primary care practice to a state or jurisdictional Immunization Information System (IIS). Every U.S. state, the District of Columbia, and several territories maintain an IIS --- a confidential, population-based database that records all immunization doses administered to persons within the jurisdiction. These registries go by different names: CAIR in California, NYSIIS in New York, ImmTrac2 in Texas, GRITS in Georgia, and so on.

The technical backbone is HL7 messaging, specifically HL7 v2.5.1 VXU (Vaccine Update) messages for sending immunization data to the registry and HL7 v2.5.1 QBP/RSP (Query By Parameter / Response) messages for querying a patient's immunization history. The CDC's HL7 Implementation Guide for Immunization Messaging provides the national standard, though each state layer on their own requirements, code sets, and transport mechanisms.

Bidirectional connectivity means your practice can both send immunization records to the IIS and query the IIS to retrieve a patient's complete immunization history from all contributing providers. This is clinically essential --- when a new patient presents, querying the IIS prevents duplicate vaccinations and identifies gaps in immunization schedules that previous providers may have addressed.

Reporting methods range from direct HL7 interfaces (automated, real-time or batch), to web-based data entry portals (manual), to flat file uploads (semi-automated). The method depends on your EHR's capabilities, your state's IIS technology, and your practice volume.

## Why Does a Primary Care Practice Need This?

**It is legally required in most states.** As of 2025, 48 states and D.C. mandate immunization reporting for children, and an increasing number extend mandates to adult immunizations. Failure to report can result in fines, loss of participation in the Vaccines for Children (VFC) program, and regulatory action.

**VFC program compliance.** Practices enrolled in the Vaccines for Children program --- which provides free vaccines for eligible children --- must report all VFC-funded doses to the state IIS. VFC compliance audits specifically examine IIS reporting, and discrepancies between vaccine inventory and IIS records can trigger program removal.

**Clinical decision support.** Bidirectional IIS connectivity enables your EHR to pull a patient's complete vaccination history, including doses administered by other providers, pharmacies, health departments, and schools. This eliminates reliance on patient recall (notoriously inaccurate for immunizations) and prevents both missed doses and unnecessary revaccination.

**MIPS and quality reporting.** CMS MIPS includes immunization-related quality measures (childhood immunization status, influenza immunization, pneumococcal vaccination). Accurate IIS data supports measure calculation and attestation.

**Public health value.** During outbreaks (measles, pertussis, COVID-19), public health agencies rely on IIS data to assess community immunity levels, identify under-immunized populations, and coordinate response. Your reporting contributes to population-level surveillance.

**Meaningful Use / Promoting Interoperability.** ONC's Promoting Interoperability program requires eligible providers to demonstrate immunization registry reporting as a measure. This directly affects Medicare and Medicaid incentive payments.

## How to Decide If You Need It

This is not optional for the vast majority of primary care practices. The decision is not whether to report, but how.

You must implement IIS reporting if:
- Your state mandates immunization reporting (check your state immunization program website)
- You participate in the VFC program
- You administer any vaccines (including influenza, COVID-19, shingles, pneumococcal)
- You participate in MIPS Promoting Interoperability
- You want complete immunization records for patients transferring from other providers

The only practices that might defer are those that refer all vaccinations to pharmacies or health departments and never administer vaccines on-site --- an increasingly rare scenario in primary care.

The real decision is the level of automation: manual web portal entry (appropriate for very low-volume practices administering fewer than 50 doses per month), flat file batch upload (moderate volume, 50--200 doses per month), or direct HL7 interface (high volume, over 200 doses per month, or any practice wanting bidirectional query capability).

## Order of Operations

1. **Register with your state IIS.** Contact your state immunization program to obtain IIS access credentials, facility identifiers, and provider PINs. This often requires completing enrollment forms, signing data use agreements, and designating an IIS site coordinator.

2. **Determine your EHR's IIS interface capabilities.** Contact your EHR vendor and ask specifically: Does your system support HL7 v2.5.1 VXU messaging to [your state's IIS]? Is bidirectional query (QBP/RSP) supported? What is the transport mechanism (SOAP web service, SFTP, direct connection)? Is there an additional module cost?

3. **Engage your state's IIS onboarding process.** Most state IIS programs have a formal onboarding workflow that includes test message submission, data validation, and certification before production connectivity is approved. This process takes 4--12 weeks depending on the state.

4. **Configure vaccine administration workflows.** Ensure your EHR captures all required data elements for IIS reporting: vaccine product (CVX code), manufacturer (MVX code), lot number, expiration date, administration site, route, dose volume, administering provider, VIS (Vaccine Information Statement) publication date, and VFC eligibility status.

5. **Submit test messages.** Work with your EHR vendor and state IIS to submit test HL7 messages. The state will validate message format, content, and code set compliance. Expect 2--5 rounds of testing.

6. **Go live with production reporting.** Begin submitting real immunization data. Monitor acknowledgment messages (ACK) for rejections or errors.

7. **Enable bidirectional query.** Once outbound reporting is stable, activate immunization history query functionality. This allows clinical staff to pull patient immunization histories into the EHR during encounters.

8. **Train staff.** Ensure nurses, MAs, and providers understand the documentation requirements. Incomplete data entry (missing lot numbers, incorrect CVX codes) causes IIS rejections.

## Options by Practice Size

**Solo/Small Practice (1--2 providers, <20 vaccines/week)**
Manual web portal entry may be sufficient if volume is very low. However, even small practices benefit from automated EHR-to-IIS interfaces, which most modern EHRs support at no additional cost. If your EHR does not support direct IIS connectivity, use the state's batch upload tool with flat file exports.

**Small Group (3--5 providers, 20--80 vaccines/week)**
Automated HL7 interface is strongly recommended. Most EHRs (athenahealth, eClinicalWorks, NextGen, Practice Fusion) include IIS reporting as a standard feature. Budget $0--$500 for setup and testing. Designate one staff member as the IIS coordinator to monitor submission acknowledgments.

**Medium Group (6--15 providers, 80--300 vaccines/week)**
Automated bidirectional HL7 interface is essential. Ensure real-time (per-event) or daily batch submissions. Implement quality checks: weekly reconciliation of vaccines administered versus IIS submissions. Budget $500--$2,000 for setup and validation. Some EHRs charge $100--$300/month for the interface module.

**Large Group / Pediatric-Heavy Practice (15+ providers, 300+ vaccines/week)**
Enterprise-grade bidirectional interface with real-time submission. Consider integration engines (Mirth Connect, Rhapsody) if your EHR's native interface is unreliable. Implement automated error monitoring and correction workflows. Assign dedicated staff to IIS reconciliation. Budget $2,000--$5,000 for setup; $200--$500/month ongoing for interface maintenance.

## Options Analysis

| Approach | Volume Fit | Automation | Bidirectional | Cost | Effort |
|----------|-----------|------------|---------------|------|--------|
| **State web portal (manual)** | <50 doses/mo | None | Yes (manual query) | Free | High (staff time) |
| **Flat file batch upload** | 50--200 doses/mo | Partial | No | $0--$200 setup | Medium |
| **EHR-native HL7 interface** | Any volume | Full | Usually yes | $0--$300/mo | Low (after setup) |
| **Integration engine (Mirth/Rhapsody)** | High volume, multi-site | Full | Yes | $500--$2,000/mo | Medium |
| **Third-party IIS gateway (STChealth, Envision)** | Multi-state practices | Full | Yes | $300--$1,000/mo | Low-Medium |

**EHR-Specific Notes:**
- **athenahealth:** Includes IIS reporting in standard subscription. Supports bidirectional for most states. Onboarding managed by athena's interface team.
- **Epic:** Robust IIS connectivity through Care Everywhere and standard immunization module. Bidirectional supported for all major state IISs.
- **eClinicalWorks:** IIS reporting available; bidirectional support varies by state. May require additional configuration fees ($500--$1,500).
- **NextGen:** IIS interfaces available as add-on module. Implementation involves NextGen's interoperability team.
- **Practice Fusion:** Basic IIS reporting included. Limited bidirectional capabilities.

## Vendor Landscape

The IIS vendor landscape is unusual because the "customers" are state governments, not practices. Each state IIS is built and operated by a contracted vendor. The dominant IIS platform vendors are:

- **STChealth:** Operates IIS platforms for approximately 20 states including Arizona, Colorado, and others. Also offers a provider-side gateway service for multi-state reporting.
- **Envision Technology Partners (formerly HLN Consulting):** Provides the open-source IIS platform (OSIIS) used by several states. Offers provider connectivity services.
- **Scientific Technologies Corporation (STC):** Not to be confused with STChealth; provides IIS technology for several jurisdictions.
- **Deloitte:** Operates IIS platforms for large states including New York and Massachusetts.

On the provider side, your EHR vendor is typically your IIS connectivity partner. For practices needing to report across multiple states (multi-location groups), third-party IIS gateway services from STChealth or Envision can consolidate reporting through a single interface, avoiding the need to establish separate connections to each state IIS.

Integration engine vendors like Rhapsody International and NextGen (Mirth Connect, open-source) provide middleware for practices needing custom HL7 message routing, transformation, or multi-destination delivery.

## Compliance & Regulatory Notes

**State mandates vary significantly.** Some states require reporting within 24 hours of administration; others allow up to 14 days or 30 days. Some mandate all ages; others only require reporting for children under 18. Research your specific state requirements through the CDC's IIS website or your state immunization program.

**Consent and opt-out provisions.** Some states allow patients (or parents/guardians) to opt out of IIS inclusion. When a patient opts out, you must flag the record appropriately and suppress IIS transmission. Your EHR should support this workflow.

**VFC compliance.** The Vaccines for Children program requires accurate reporting of VFC-eligible doses. Misrepresenting eligibility status (e.g., reporting a privately insured patient's vaccine as VFC-funded) can result in program removal and fraud allegations. Ensure front-desk and clinical staff verify VFC eligibility at each visit.

**HIPAA considerations.** IIS reporting is considered a public health activity and falls under HIPAA's public health exception (45 CFR 164.512(b)). Patient authorization is not required for IIS reporting. However, IIS queries (pulling patient data from the registry) must be performed for treatment purposes and documented accordingly.

**Promoting Interoperability.** For MIPS-eligible providers, immunization registry reporting requires demonstrating active engagement with the IIS --- not just submitting data, but receiving and processing acknowledgments. Simply turning on the interface without monitoring is insufficient.

**COVID-19 specific requirements.** Many states implemented emergency rules requiring COVID-19 vaccination reporting within 24--72 hours, including to both state IIS and federal systems (CDC's IZ Gateway). While the emergency phase has passed, enhanced COVID-19 reporting requirements may persist in some jurisdictions.

## Common Mistakes

**Not verifying CVX and MVX codes.** Using outdated or incorrect vaccine product codes (CVX) and manufacturer codes (MVX) is the single most common cause of IIS rejection. The CDC updates these code sets regularly. Ensure your EHR's vaccine formulary uses current codes.

**Missing lot numbers and expiration dates.** Many IIS platforms reject messages with missing lot numbers. Train staff to scan vaccine vial barcodes (2D barcodes containing NDC, lot, and expiration) rather than manually entering this information.

**Failing to monitor acknowledgments.** Submitting HL7 messages is only half the process. ACK messages from the IIS indicate whether each submission was accepted, rejected, or accepted with warnings. Practices that never review ACKs may discover months later that 30% of their submissions were rejected.

**Not querying the IIS for new patients.** The bidirectional query capability is underused. Querying the IIS at new patient visits and annual wellness visits prevents duplicate vaccinations and identifies immunization gaps from doses administered elsewhere.

**Treating IIS reporting as a one-time setup.** State IIS platforms undergo updates, HL7 specification changes, and connectivity changes. Designate a staff member to monitor IIS communications and maintain the interface.

**Ignoring IIS data for quality measure reporting.** IIS data can supplement your EHR data for MIPS immunization quality measures. If a vaccine was administered by a pharmacy and reported to the IIS, querying and importing that data into your EHR strengthens your quality measure performance.

## Recommended Implementation Timeline

**Weeks 1--2:** Register with your state IIS program. Complete enrollment forms, obtain facility and provider identifiers, sign data use agreements, and designate an IIS site coordinator.

**Weeks 3--4:** Contact your EHR vendor to initiate IIS interface setup. Confirm HL7 version support, transport mechanism, and any module costs. Request the state-specific interface configuration guide.

**Weeks 5--8:** Configure vaccine administration workflows in your EHR. Validate CVX/MVX code sets are current. Configure VFC eligibility capture. Set up barcode scanning for lot number/expiration capture if not already in place.

**Weeks 9--12:** Submit test messages to the state IIS. Work through validation errors with your EHR vendor and state IIS team. Expect 2--4 rounds of test-fix-retest cycles. Most states have a formal certification process.

**Weeks 13--14:** Go live with production outbound reporting. Monitor ACK messages daily for the first two weeks to identify and resolve rejection patterns.

**Weeks 15--18:** Enable bidirectional query (if supported by your state and EHR). Train clinical staff on immunization history query workflows. Integrate IIS query into new patient intake and annual wellness visit protocols.

**Week 19--20:** Conduct a reconciliation audit. Compare vaccines administered in your EHR during the first month of production reporting against IIS records. Investigate and resolve discrepancies.

**Ongoing:** Monthly ACK monitoring, quarterly CVX/MVX code set updates, annual VFC compliance review, and staff retraining as needed.
