# Payment Processing (PCI)

## What Is This?

Payment processing in a primary care practice encompasses every system and workflow involved in collecting payments from patients: credit card terminals at the front desk, online payment portals, mobile payment acceptance, payment plan management, and the underlying merchant services that move money from the patient's bank to the practice's bank. The "PCI" in the title refers to the Payment Card Industry Data Security Standard (PCI DSS) --- a set of security requirements that every organization accepting credit card payments must follow.

Healthcare payment processing has unique complexities beyond retail payment collection. Copays must be collected at the time of service, deductibles and coinsurance must be estimated and communicated, outstanding balances from prior visits need to be presented and collected, and payment plans for larger amounts require management. The intersection of HIPAA (protecting health information) and PCI DSS (protecting payment card data) creates a dual compliance burden that general-purpose payment processors may not fully address.

The market has evolved significantly. Dedicated healthcare payment platforms like InstaMed (now part of J.P. Morgan), Rectangle Health (formerly RectoPay), and CollBox handle the full patient payment lifecycle from estimation through collection to reconciliation. General-purpose processors like Square for Healthcare and Stripe (with healthcare-specific configurations) offer simpler setups at lower cost. EHR-integrated payment modules from athenahealth, Epic, and others embed payment collection within the clinical workflow.

Typical costs include per-transaction fees (2.5--3.5% of the transaction amount plus $0.10--$0.30 per transaction), monthly platform fees ($0--$100/month), and terminal hardware ($200--$600 per device). For a practice collecting $50,000/month in patient payments, processing fees total $1,250--$1,750/month.

## Why Does a Primary Care Practice Need This?

**Patient financial responsibility is growing.** High-deductible health plans now cover 55% of employer-sponsored insured workers. Average deductibles exceed $1,700 for individual coverage. Patients are responsible for a larger share of their healthcare costs than ever, and practices that cannot efficiently collect patient payments face growing revenue leakage.

**Time-of-service collection is the most effective collection method.** Industry data consistently shows that the probability of collecting a patient payment drops precipitously after the patient leaves the office: 70--90% collection rate at point of service, 50--60% within 30 days of statement, 30--40% at 60 days, and below 20% at 90+ days. Efficient payment processing that makes it easy to pay at check-out is the single highest-ROI revenue cycle investment.

**Patient expectations have shifted.** Patients accustomed to paying for everything via smartphone, contactless tap, and online portals expect the same convenience from their healthcare providers. A practice that only accepts cash and checks (or one that requires patients to call during business hours to pay by phone) frustrates patients and depresses collection rates.

**Regulatory compliance is mandatory.** Any practice that accepts credit or debit card payments must comply with PCI DSS. Non-compliance risks fines ($5,000--$100,000/month from card brands), increased transaction fees, and liability for fraud if a data breach occurs. PCI compliance is not optional --- it is a condition of accepting card payments.

**Reconciliation and reporting.** Modern payment platforms provide detailed reconciliation reporting: payments received by date, method, payer, and patient, with automatic posting to the practice management system. Without this automation, billing staff spend hours daily matching payments to patient accounts manually.

## How to Decide If You Need It

Every practice that accepts patient payments needs a payment processing solution. The questions are: how sophisticated does it need to be, and should you use a healthcare-specific platform or a general-purpose processor?

You need a healthcare-specific payment platform if:

- Patient payment collections exceed $20,000/month
- You want to offer payment plans for large balances (deductibles, procedures)
- You need payment collection integrated with your EHR or practice management system
- You want to offer online bill pay through a patient portal
- You process payments across multiple locations and need consolidated reporting
- You collect payments through patient check-in kiosks

A general-purpose processor may suffice if:

- You are a solo practice with straightforward payment collection (copays at checkout)
- Patient payment volume is low (under $10,000/month)
- Your PMS/EHR has a basic integrated payment module that meets your needs
- You do not need payment plans or advanced patient billing features

## Order of Operations

1. **Assess current payment workflows.** Document how payments are currently collected: front desk, phone, mail, online. Calculate your time-of-service collection rate, average days to collect patient balances, and total patient A/R. Identify the percentage of payments by method (cash, check, credit card, online).

2. **Determine integration requirements.** Identify your EHR/PMS and check which payment processors have certified integrations. Payment posting that requires manual entry defeats much of the purpose of modern payment processing.

3. **Evaluate PCI compliance requirements.** Complete a PCI Self-Assessment Questionnaire (SAQ) to determine your current compliance status and what changes are needed. Most practices qualify for SAQ B-IP or SAQ C, which are simpler than the full SAQ D.

4. **Select processor and terminal hardware.** Choose a processor that integrates with your PMS, supports the payment methods your patients prefer (chip, tap, mobile wallet, online), and offers transparent pricing.

5. **Implement card-on-file policies.** Configure the system to securely store patient payment methods (card-on-file) for future charges. This requires explicit patient consent and PCI-compliant tokenization (the actual card number is never stored by the practice).

6. **Configure payment estimation.** Integrate eligibility verification with payment estimation so front-desk staff can tell patients their estimated out-of-pocket cost before services are rendered. This is increasingly required by the No Surprises Act.

7. **Set up online payment portal.** Enable patients to pay online via a practice-branded web page or patient portal integration. Send electronic statements with embedded payment links.

8. **Configure payment plans.** For balances above a threshold (typically $200--$500), offer structured payment plans. Some platforms automate recurring charges on card-on-file.

9. **Train staff on PCI compliance.** Staff who handle payment cards must understand PCI requirements: never write down card numbers, never store card data on paper or in unencrypted files, and always use the terminal for card processing.

## Options by Practice Size

**Solo Practice (1 provider, <$15,000/month patient payments)**
Square for Healthcare ($0/month, 2.6% + $0.10/transaction in person) or your EHR's integrated payment module. One Square Terminal ($299 one-time) or a PMS-integrated terminal. Online payment via Square Invoices. Budget: $300--$500/month in processing fees.

**Small Group (2--5 providers, $15,000--$60,000/month)**
Rectangle Health ($50--$100/month platform fee plus 2.5--3.0% transaction fees), InstaMed, or your PMS-integrated payment solution. 2--4 terminals. Card-on-file capability. Online bill pay. Budget: $500--$2,000/month total cost.

**Medium Group (6--15 providers, $60,000--$200,000/month)**
InstaMed (J.P. Morgan), Rectangle Health, or Waystar payment module. Multi-terminal deployment, payment plan management, card-on-file, online portal, and patient financing options. Negotiate volume-based transaction rates (2.2--2.7%). Budget: $1,500--$6,000/month.

**Large Group (15+ providers, $200,000+/month)**
Enterprise healthcare payment platform: InstaMed, Rectangle Health, or Navicure (Waystar) with full RCM integration. Centralized payment operations, consolidated reporting, patient financing partnerships (CareCredit, Prosper Healthcare Lending), and dedicated account management. Negotiate rates below 2.5%. Budget: $5,000--$15,000/month.

## Options Analysis

| Platform | Best For | EHR Integration | Card-on-File | Online Pay | Payment Plans | Pricing Model |
|----------|----------|----------------|-------------|-----------|---------------|--------------|
| **InstaMed (J.P. Morgan)** | Mid-large practices | Excellent (70+ PMS) | Yes | Yes | Yes | Custom (volume-based) |
| **Rectangle Health** | Small-mid practices | Good (major PMS) | Yes | Yes | Yes | $50--$100/mo + % |
| **Square for Healthcare** | Solo/small | Limited (API) | Yes | Yes | Basic | 2.6% + $0.10 |
| **Stripe** | Tech-savvy practices | API-based | Yes | Yes | Custom | 2.9% + $0.30 online |
| **PaySimple** | Small practices | Moderate | Yes | Yes | Yes | $50/mo + % |
| **athena Collect** | athena users | Native | Yes | Yes | Yes | Included/add-on |
| **Epic MyChart Billing** | Epic users | Native | Yes | Yes | Yes | Included |
| **Waystar Payment** | Waystar RCM users | Integrated | Yes | Yes | Yes | Bundled with RCM |
| **CareCredit** | Patient financing | N/A (financing) | N/A | Patient-facing | Yes (6--60 mo) | 0% to patient; 5--15% merchant fee |

## Vendor Landscape

**InstaMed** (acquired by J.P. Morgan in 2019) is the largest healthcare-specific payment platform, processing over $350 billion in healthcare payments annually. Their platform connects providers, payers, and patients in a single network, enabling electronic payment and remittance across the entire revenue cycle. InstaMed's strength is enterprise-scale integration with major EHR/PMS platforms, comprehensive reporting, and the backing of J.P. Morgan's banking infrastructure. Pricing is custom and volume-dependent.

**Rectangle Health** (formerly RectoPay) targets the small to mid-market with a user-friendly platform that integrates payment collection with patient engagement. Their Practice Management Bridge product overlays on existing PMS systems, adding payment processing without requiring a full PMS replacement. Pricing is more transparent than InstaMed, with a monthly platform fee plus competitive transaction rates.

**Square for Healthcare** entered the healthcare market by offering HIPAA-compliant payment processing at transparent pricing (2.6% + $0.10 in-person, 2.9% + $0.30 online). Square's hardware is well-designed and affordable ($299 for the Square Terminal). The limitation is integration --- Square does not have deep PMS integrations, so payment posting may require manual steps. Best for small practices with simple workflows.

**CareCredit** (Synchrony Health) and **Prosper Healthcare Lending** are patient financing platforms, not payment processors. They provide patients with credit lines specifically for healthcare expenses, with promotional 0% APR periods (6--24 months). The practice receives full payment upfront minus a merchant discount fee (typically 5--15% depending on the financing term). These are complementary to, not replacements for, payment processing.

**Emerging trends:** Contactless payment adoption (Apple Pay, Google Pay) has accelerated post-COVID-19, with 40% of in-person healthcare payments now using contactless methods. Automated patient payment estimation using AI and real-time benefits verification is reducing surprise bills. Text-to-pay (sending a payment link via SMS) shows higher conversion rates than email statements.

## Compliance & Regulatory Notes

**PCI DSS compliance is mandatory.** Every practice accepting credit cards must comply with PCI DSS. The standard has four levels based on transaction volume; most practices fall into Level 4 (fewer than 20,000 e-commerce transactions or up to 1 million total transactions annually). Level 4 requires completing an annual Self-Assessment Questionnaire (SAQ) and quarterly network vulnerability scans if processing through internet-connected systems.

**SAQ type matters.** Practices using standalone payment terminals that connect directly to the processor (not through the practice network) can qualify for SAQ B, the simplest questionnaire. Practices using IP-connected terminals qualify for SAQ B-IP or SAQ C. Practices that store, process, or transmit cardholder data on their own systems face the much more burdensome SAQ D. Use point-to-point encryption (P2PE) validated terminals to minimize PCI scope.

**Never store card numbers.** PCI DSS prohibits storing full card numbers, CVV codes, or PIN data after authorization. Card-on-file functionality must use tokenization, where the processor stores the actual card number and returns a token that represents it. The practice never has access to the actual card number.

**HIPAA-PCI intersection.** When payment information is associated with clinical data (e.g., a payment for a specific medical service), it may constitute PHI. Payment processors handling both payment and health data must comply with both PCI DSS and HIPAA. Ensure your processor signs a BAA and maintains HIPAA compliance in addition to PCI compliance.

**No Surprises Act.** Practices must provide good-faith cost estimates for uninsured or self-pay patients. Payment estimation tools should support this requirement. For insured patients, while not strictly required for all services, providing payment estimates at check-in reduces billing disputes and improves collection rates.

**State-specific payment rules.** Some states regulate payment plan interest rates, surcharging for credit card use (permitted in most states but prohibited in a few), and automated recurring charges. Review state regulations before implementing surcharges or payment plan terms.

## Common Mistakes

**Not collecting at time of service.** The single most impactful change a practice can make is collecting copays, deductibles, and outstanding balances before the patient leaves. Every dollar not collected at checkout costs $0.10--$0.25 in statement and collection costs to collect later, if it is collected at all.

**Ignoring PCI compliance.** Many practices accept credit cards without completing the required annual SAQ or implementing required security controls. This creates liability in the event of a breach and can result in non-compliance fines. PCI compliance is not complex for most practices --- complete the SAQ annually and use P2PE terminals.

**Writing down credit card numbers.** Staff who take credit card numbers over the phone and write them on paper (or enter them into a spreadsheet) create a PCI violation and a security risk. Use a virtual terminal for phone payments where the staff member enters the card number directly into the processor's secure interface.

**Not implementing card-on-file.** Practices that collect a copay at checkout but then send a statement for the remaining balance weeks later miss the highest-probability collection moment. With card-on-file and patient consent, the practice can charge the remaining balance once adjudication is complete, dramatically improving collection rates.

**Using personal Venmo, Zelle, or Cash App for patient payments.** These peer-to-peer payment platforms are not designed for business use, do not provide PCI compliance, cannot generate proper receipts, and create reconciliation nightmares. Use only business-grade payment processing.

**Failing to reconcile daily.** End-of-day payment reconciliation (matching terminal batch totals to PMS payment entries) should be a daily ritual. Discrepancies caught at end of day take 5 minutes to resolve; discrepancies discovered at month-end take hours.

**Not offering multiple payment methods.** Patients who want to pay but can only pay via a method you do not accept will not pay at checkout. Accept chip cards, contactless/tap, mobile wallets (Apple Pay, Google Pay), online portal, and text-to-pay at minimum.

## Recommended Implementation Timeline

**Weeks 1--2:** Assess current payment workflows. Document collection rates, payment methods accepted, current processor, PCI compliance status, and staff payment handling procedures. Calculate patient A/R and average days to collect.

**Weeks 3--4:** Evaluate payment platforms. Demo 2--3 options (one healthcare-specific, one general-purpose, one EHR-native if available). Assess PMS integration depth, terminal hardware, online payment capabilities, and pricing transparency.

**Weeks 5--6:** Select platform and negotiate contract. Verify PCI compliance and HIPAA compliance. Execute BAA. Order terminal hardware. Begin PMS integration setup.

**Weeks 7--8:** Install terminals and configure integration. Set up payment posting rules in PMS. Configure card-on-file consent workflows. Build online payment portal. Set up merchant deposit account if changing processors.

**Week 9:** Staff training. Train all front-desk staff on terminal operation, card-on-file enrollment, payment plan setup, and PCI handling procedures (no writing down card numbers, no storing card data). Train billing staff on reconciliation and reporting.

**Week 10:** Go live. Process payments through the new system. Run daily reconciliation. Monitor for integration issues (payments not posting, incorrect amounts, duplicate charges).

**Weeks 11--12:** Optimize. Implement payment estimation at check-in. Enable text-to-pay for outstanding balances. Set up automated patient statement workflows through the payment platform.

**Weeks 13--16:** Add payment plans and patient financing (CareCredit enrollment if desired). Implement card-on-file balance collection for post-adjudication charges. Complete first PCI SAQ with the new system configuration.

**Ongoing:** Daily payment reconciliation, monthly collection rate reporting, annual PCI SAQ completion, quarterly review of transaction fees and processor pricing, and ongoing staff training on PCI compliance.
