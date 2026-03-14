# E-Prescribing & EPCS

## What Is This?

Electronic prescribing (e-prescribing) is the computer-based generation, transmission, and filling of prescription orders, replacing traditional handwritten or faxed prescriptions. E-prescribing uses the Surescripts network — the national health information network that connects prescribers, pharmacies, and pharmacy benefit managers (PBMs) — to transmit prescriptions electronically from your EHR directly to the patient's pharmacy of choice.

Electronic Prescribing for Controlled Substances (EPCS) is a specific, more heavily regulated subset of e-prescribing that allows providers to electronically prescribe Schedule II-V controlled substances. EPCS was enabled by a 2010 DEA interim final rule (21 CFR Part 1311) that established strict requirements for identity proofing, two-factor authentication, and audit trails. What was once optional is now mandatory in most states.

The distinction matters because while basic e-prescribing is straightforward (it is simply a feature of your EHR connected to Surescripts), EPCS requires additional identity proofing, hardware or software authentication tokens, and ongoing compliance procedures that represent a separate implementation effort and cost.

A related concept is prescription benefit checking — the ability to check a patient's formulary, copay information, and prior authorization requirements at the point of prescribing. This is increasingly integrated into e-prescribing workflows through Surescripts' Real-Time Prescription Benefit (RTPB) service, which CMS now requires for Part D prescribers under the Cures Act.

## Why Does a Primary Care Practice Need This?

### Legal Mandate

As of 2025, nearly every state requires e-prescribing for controlled substances (EPCS), and federal law requires it for Medicare Part D prescribers under the SUPPORT Act (effective January 1, 2021, with enforcement ramping up). The patchwork of state laws means you need to comply with the strictest applicable requirement. States like New York (EPCS mandate since 2016) and many others have had mandates in effect for years.

For non-controlled substances, e-prescribing has been effectively mandatory for Medicare prescribers since the Meaningful Use era. While you can technically still hand-write prescriptions in some situations, the practical, regulatory, and workflow reasons to prescribe electronically are overwhelming.

### Patient Safety

E-prescribing with clinical decision support provides drug-drug interaction checking, drug-allergy checking, duplicate therapy alerts, and dosing guidance at the point of prescribing. Legibility issues (a longstanding source of medication errors with handwritten prescriptions) are eliminated entirely. The Surescripts network also provides medication history, allowing prescribers to see what other medications the patient is taking across all prescribers — critical for primary care where patients often see multiple specialists.

### Operational Efficiency

E-prescribing eliminates phone calls and faxes to pharmacies for new prescriptions. Refill requests come through the EHR electronically, reducing phone volume. Prior authorization workflows are increasingly integrated (electronic prior authorization, or ePA, is growing rapidly). Prescription routing is faster — patients can arrive at the pharmacy and find their prescription ready, improving satisfaction.

### Revenue Protection

CMS penalizes eligible clinicians who fail to e-prescribe. Under MIPS, the Promoting Interoperability performance category includes e-prescribing measures. Failure to meet thresholds can result in negative payment adjustments.

## How to Decide If You Need It

You need e-prescribing. This is not a choice — it is a legal and practical requirement for any prescribing provider in a US primary care practice.

The decisions you need to make are:

1. **EPCS implementation**: If your state mandates EPCS (most do), you must implement it. Even if your state has not yet mandated it, implement EPCS proactively — the trend is clear and the DEA's position increasingly favors electronic prescribing for controlled substances.

2. **Authentication method**: EPCS requires two-factor authentication at the time of signing a controlled substance prescription. You need to choose between hardware tokens (USB key or smart card), software tokens (smartphone app), or biometric solutions.

3. **Identity proofing provider**: Before a provider can use EPCS, they must undergo identity proofing that meets NIST SP 800-63 Identity Assurance Level 2 (IAL2) requirements. This is done through a credential service provider (CSP) approved by the DEA.

## Order of Operations

1. **Verify EHR EPCS certification** (1 week): Confirm your EHR is certified for EPCS under DEA requirements. All major EHRs support EPCS, but you need to verify the specific module is included in your subscription and activated.
2. **Select identity proofing/authentication vendor** (1-2 weeks): Choose your credential service provider and authentication method. Your EHR vendor likely has preferred partners.
3. **Provider identity proofing** (1-3 weeks per provider): Each prescribing provider must complete identity proofing individually. This involves document verification, knowledge-based authentication, and often a video or in-person verification step.
4. **Token/authenticator setup** (1-2 days per provider): Once identity-proofed, each provider sets up their two-factor authentication method (token enrollment).
5. **EHR configuration** (1-2 weeks): Enable EPCS in the EHR, configure controlled substance workflows, set up audit logging, designate two individuals for the logical access controls (the DEA requires at least two individuals to approve EPCS access).
6. **Pharmacy network verification** (1 week): Confirm your Surescripts connection routes prescriptions correctly to local pharmacies, including mail-order pharmacies.
7. **Testing** (1 week): Test both controlled and non-controlled prescriptions to several pharmacies. Verify cancellation and change workflows.
8. **Provider training** (1-2 days): Train providers on the EPCS signing workflow, what to do if their token is lost or unavailable, and how to handle EPCS exceptions (when paper prescriptions are still permitted).
9. **Go-live** (1 day): Enable EPCS for all identity-proofed providers.
10. **Ongoing compliance** (continuous): Monitor audit logs, manage token lifecycle (replacements, deactivations for departing providers), and re-proof providers as required.

## Options by Practice Size

### Small Practice (1-3 Providers)

Keep it simple. Use your EHR's built-in EPCS module with the vendor's recommended authentication partner. The most common and cost-effective approach is:

- **EHR-integrated EPCS** with a **software token** (smartphone app): Lowest cost, easiest to manage. Providers approve controlled substance prescriptions by entering a PIN and approving a push notification on their phone.
- **Identity proofing through Exostar or ID.me**: These are the most commonly used CSPs for EPCS. Your EHR vendor will guide you to their preferred partner. Cost is typically $50-150 per provider for initial proofing.
- **Total incremental cost**: $100-300 per provider initial setup, plus $0-50/provider/month ongoing (many EHRs include EPCS at no additional monthly cost; some charge $25-50/provider/month).

At this size, the biggest challenge is simply getting each provider through the identity proofing process, which can be finicky (knowledge-based authentication questions are sometimes obscure, and document verification can fail on the first attempt).

### Medium Practice (4-15 Providers)

Same basic approach as small, but with more attention to operational management:

- **Designate an EPCS administrator**: Someone needs to manage token lifecycle — new provider setup, lost token procedures, departing provider deactivation. At this size, this is typically the practice manager or office manager.
- **Standardize on one authentication method**: Do not let different providers use different token types. Standardize on either software tokens (recommended for most) or hardware tokens (for providers who resist smartphone use).
- **Budget for provider onboarding**: Each new provider who joins the practice needs identity proofing and token setup before they can prescribe controlled substances. Build this into your credentialing/onboarding workflow with a 2-3 week lead time.

### Large Practice (15+ Providers)

At this scale, EPCS management becomes a meaningful operational function:

- **Enterprise token management**: Consider hardware token solutions (like Exostar SAFE-BioPharma tokens or YubiKey-based solutions) that can be centrally managed. Software tokens work well but require each provider to have a compatible smartphone with the authenticator app.
- **Automated identity proofing**: Some CSPs offer enterprise pricing and streamlined proofing for large groups. Negotiate volume pricing.
- **Integration with provider onboarding/offboarding**: EPCS activation and deactivation must be part of your formal credentialing and termination checklists. DEA regulations require prompt deactivation of EPCS privileges for providers who leave the organization.
- **Audit log review**: Assign responsibility for periodic EPCS audit log review. The DEA requires that EPCS audit logs be available and reviewed.

## Options Analysis

### Software Tokens (Smartphone App)

**Examples**: Exostar SAFE Identity Authenticator, ID.me Authenticator, Imprivata Confirm ID (mobile), DrFirst rcopia Mobile

- **Pros**: No hardware to purchase or manage, convenient (providers always have their phone), lowest cost, easy replacement (reinstall app on new phone).
- **Cons**: Requires a compatible smartphone, provider must have phone accessible during prescribing, lost phone requires re-enrollment, some providers object to using personal phones for work.
- **Typical cost**: $0-50/provider for setup, $0-25/provider/month ongoing (often bundled with EHR).
- **Best for**: Most practices of any size.

### Hardware Tokens (USB Key, Smart Card)

**Examples**: YubiKey, Exostar SAFE hardware tokens, USB cryptographic tokens

- **Pros**: Dedicated device, does not require smartphone, strong security, long battery life (USB keys are passive).
- **Cons**: Physical device to manage (lost tokens need replacement), cost per token ($25-75 each), must be physically present at workstation.
- **Typical cost**: $25-75 per token, plus $50-150/provider for identity proofing, replacement tokens at same cost.
- **Best for**: Providers who do not want to use smartphones, or environments where smartphones are restricted.

### Biometric Authentication

**Examples**: Imprivata Confirm ID with fingerprint, facial recognition solutions

- **Pros**: Nothing to carry or remember, fast authentication, cannot be lost or forgotten.
- **Cons**: Requires biometric hardware at each workstation ($100-300/device), higher implementation complexity, privacy concerns, not all EHRs support biometric EPCS signing.
- **Typical cost**: $100-300 per workstation for biometric readers, plus $50-150/provider/month for Imprivata or similar platform.
- **Best for**: Large practices or health systems that already use Imprivata for workstation authentication.

### DEA-Approved Credential Service Providers

The major CSPs for EPCS identity proofing include:

- **Exostar**: The most widely used CSP for EPCS. Partners with most major EHR vendors. Identity proofing costs $50-125/provider. Offers both software and hardware tokens.
- **ID.me**: Growing in EPCS space, also widely used for government identity verification. Competitive pricing at $50-100/provider.
- **Imprivata**: Enterprise-focused. Offers Confirm ID for EPCS with biometric and software token options. Higher cost but integrates with broader Imprivata identity platform. $100-200/provider setup plus monthly fees.
- **DrFirst**: Provides EPCS services through its rcopia platform. If your EHR uses DrFirst for e-prescribing infrastructure (many smaller EHRs do), EPCS identity proofing is available through them.
- **Exostar/LexisNexis**: LexisNexis provides the knowledge-based authentication component used by several CSPs.

## Vendor Landscape

| Vendor | Role | Strengths | Weaknesses | Cost |
|--------|------|-----------|------------|------|
| **Surescripts** | Network | Dominant e-prescribing network, connects all parties | Monopoly position, limited competition | Costs are passed through by EHR vendors |
| **Exostar** | CSP + Tokens | Most widely integrated, reliable | Identity proofing can be slow, UI is dated | $50-125/provider proofing |
| **ID.me** | CSP | Modern UX, fast proofing process | Newer to EPCS, less EHR integration depth | $50-100/provider proofing |
| **Imprivata** | CSP + Enterprise Auth | Enterprise features, biometric support | Expensive, complex implementation | $100-200/provider + monthly |
| **DrFirst (rcopia)** | E-prescribing platform | Integrated EPCS + e-prescribing, formulary checking | Adds intermediary between EHR and Surescripts | Varies by EHR partner |
| **DoseSpot** | E-prescribing platform | Popular with smaller EHRs, API-first | EPCS add-on can be clunky | $50-100/provider/month |

**Key market trend**: Real-Time Prescription Benefit (RTPB) checking is becoming standard. Surescripts RTPB allows prescribers to see a patient's specific formulary coverage, copay, and cheaper therapeutic alternatives at the point of prescribing. CMS requires RTPB for Medicare Part D, and commercial payers are increasingly supporting it. Ensure your e-prescribing platform supports RTPB.

Electronic prior authorization (ePA) is the next frontier. The Surescripts ePA service and CMS's Prior Authorization Rule (CMS-0057) are pushing toward automated, electronic prior authorization workflows integrated into the prescribing process. This will significantly reduce the prior authorization burden that currently costs practices an average of 14 hours per physician per week (per AMA surveys).

## Compliance & Regulatory Notes

- **DEA 21 CFR Part 1311**: The foundational regulation for EPCS. Requires identity proofing to NIST IAL2, two-factor authentication for each controlled substance prescription, logical access controls (two individuals must approve new EPCS practitioners), and comprehensive audit logging.
- **State EPCS mandates**: As of 2025, the vast majority of states require EPCS. Some states (e.g., New York, Maine, Connecticut, Virginia) have had mandates for years. Others have more recent mandates with varying exception provisions. Check your state pharmacy board and medical board for current requirements.
- **SUPPORT Act (federal)**: Requires e-prescribing for Medicare Part D controlled substances. Violations can result in penalties, though CMS has implemented a graduated enforcement approach.
- **Audit log requirements**: DEA requires that EPCS applications maintain audit logs that record every action involving controlled substance prescriptions. Logs must be available for DEA inspection. Review audit logs periodically and retain them for 2+ years (check your state for specific retention requirements).
- **Provider departure procedures**: When a provider leaves your practice, you must promptly deactivate their EPCS credentials. The DEA requires that access be revoked when a provider is no longer authorized to prescribe on behalf of your practice.
- **Lost or compromised tokens**: You must have a procedure for handling lost, stolen, or compromised authentication tokens. This includes immediate token deactivation, incident documentation, and provider re-proofing or re-enrollment.
- **Prescription Drug Monitoring Programs (PDMPs)**: Most states require prescribers to check the state PDMP before prescribing controlled substances (especially opioids). Many EHRs now integrate PDMP queries into the prescribing workflow. Ensure your e-prescribing workflow includes PDMP checking where required.

## Common Mistakes

1. **Delaying EPCS implementation**: Some practices procrastinate on EPCS because the identity proofing process seems burdensome. Meanwhile, their providers are writing paper prescriptions for controlled substances, which is illegal in most states. Prioritize EPCS during EHR implementation — it should go live simultaneously with or within 30 days of EHR go-live.
2. **Not budgeting time for identity proofing failures**: Knowledge-based authentication (KBA) questions during identity proofing fail on the first attempt for a surprising number of providers (20-30%). This is because KBA relies on credit bureau and public records data, which may have discrepancies. Budget for multiple attempts and alternative proofing methods.
3. **Single point of failure for EPCS access controls**: DEA requires two individuals to approve EPCS access for each provider. If one of those individuals leaves the practice, you must designate a replacement before you can onboard new EPCS prescribers. Know who your two designated individuals are at all times.
4. **Not testing pharmacy routing**: E-prescriptions can fail to route correctly to pharmacies, especially independent pharmacies, mail-order pharmacies, and specialty pharmacies. Test routing to the pharmacies your patients commonly use before go-live.
5. **Ignoring formulary checking**: If your e-prescribing platform supports RTPB, enable it. Prescribing a non-formulary medication results in pharmacy callbacks, prior authorization delays, and patient frustration — all of which are avoidable if you check formulary status before sending.
6. **Forgetting to deactivate departing providers**: When a provider leaves your practice, deactivating their EPCS credentials should be on the termination checklist alongside deactivating EHR access. Failure to do so creates a compliance and liability risk.
7. **Not having a downtime procedure for EPCS**: When the EPCS system is unavailable (EHR outage, token malfunction), providers need to know the fallback procedure. In most states, a paper prescription with a wet signature is still permissible as a backup for controlled substances, but providers need to know the requirements (e.g., in some states, the paper prescription must indicate that the electronic system was unavailable).
8. **Overlooking mid-level provider EPCS**: Nurse practitioners and physician assistants who prescribe controlled substances also need EPCS setup, including identity proofing and authentication. Do not overlook mid-levels in your EPCS rollout planning.

## Recommended Implementation Timeline

### EPCS Implementation (with New EHR)

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Verify EHR EPCS capability | 1 week | Confirm module availability and cost |
| Select CSP and authentication method | 1 week | Choose identity proofing vendor and token type |
| Provider identity proofing | 2-4 weeks | Each provider completes proofing individually — start early |
| EHR EPCS configuration | 1-2 weeks | Enable module, configure access controls, audit logging |
| Token enrollment | 1-2 days per provider | Set up authenticator app or hardware token |
| Testing | 1 week | Test controlled substance prescriptions to multiple pharmacies |
| Training | 1-2 days | EPCS workflow, exception procedures, PDMP integration |
| Go-live | 1 day | Enable for all proofed providers |
| **Total** | **4-8 weeks** | Start identity proofing as early as possible |

### Adding EPCS to Existing E-Prescribing

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Select CSP and auth method | 1 week | Coordinate with EHR vendor for recommended partners |
| Identity proofing | 2-4 weeks | All prescribing providers |
| EHR configuration | 1 week | Enable EPCS module, designate access control individuals |
| Token enrollment + training | 1 week | Combined for efficiency |
| Go-live | 1 day | Switch from paper to electronic controlled substance prescriptions |
| **Total** | **4-6 weeks** | |

**Critical path**: Identity proofing is always the bottleneck. Start this process the moment your EHR contract is signed. Some providers will fail their first proofing attempt and need to retry or use alternative methods, adding 1-2 weeks. Plan accordingly and do not let EPCS delay your EHR go-live — providers without completed EPCS proofing can use paper prescriptions for controlled substances as a temporary bridge (verify state law allows this exception).
