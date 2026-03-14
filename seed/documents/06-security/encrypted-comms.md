# Encrypted Communications

## What Is This?

Encrypted communications in a healthcare context encompasses the technologies and practices that protect the confidentiality of electronic messages containing protected health information (PHI) as they travel between senders and recipients. This includes encrypted email, secure messaging platforms, encrypted text messaging, secure file transfer, and HIPAA-compliant fax alternatives.

The HIPAA Security Rule requires covered entities to implement technical security measures to guard against unauthorized access to ePHI that is being transmitted over an electronic communications network (45 CFR 164.312(e)(1)). While encryption is technically an "addressable" specification rather than a "required" one, the practical reality is that encryption of ePHI in transit is the standard of care and a near-universal expectation by OCR, cyber insurers, and business partners.

The key technologies in this space include:

- **Encrypted Email**: Solutions that encrypt email messages and attachments containing PHI so that only the intended recipient can read them. Methods include TLS (Transport Layer Security) for server-to-server encryption, portal-based encryption (recipient retrieves the message from a secure web portal), and standards-based encryption (S/MIME or PGP). Modern healthcare email encryption solutions like Paubox use TLS verification with fallback to portal delivery, providing seamless encryption without requiring recipients to log into portals.
- **Secure Messaging**: Purpose-built platforms for clinical communication that provide encryption, message expiration, remote wipe, and audit logging. These replace unsecured text messaging between clinical staff and are distinct from patient-facing secure messaging through patient portals.
- **Encrypted File Transfer**: Secure methods for sharing documents, images, and large files containing PHI. This includes SFTP, secure cloud storage with access controls, and purpose-built healthcare file sharing platforms.
- **Secure Fax**: While traditional analog fax is not covered by the HIPAA Security Rule (it is not electronic transmission in the Security Rule's definition), digital fax and fax-to-email services are. Cloud fax solutions that encrypt transmissions and provide audit trails are increasingly replacing analog fax machines.

## Why Does a Primary Care Practice Need This?

Primary care practices communicate PHI constantly: referral letters to specialists, lab results to patients, prior authorization documents to payers, clinical notes to attorneys (with authorization), and care coordination messages to other providers. Much of this communication occurs via email, which by default is not encrypted and transmits in cleartext across the internet.

Unencrypted email containing PHI is one of the most common HIPAA violations. OCR has settled multiple cases involving unencrypted email transmission of PHI, with penalties ranging from $50,000 to $2.7 million. Beyond regulatory risk, unencrypted email is a frequent vector for data breaches. Email accounts are compromised through phishing, and if those accounts contain unencrypted PHI in sent or received messages, the breach scope can be enormous.

Secure messaging is equally important for clinical operations. The prevalence of personal cell phone text messaging for clinical communication is a significant and widespread HIPAA risk. When a provider texts a nurse about a patient's lab result using standard SMS, that message is unencrypted, stored on personal devices, and completely outside the practice's control. Secure messaging platforms replace this risky behavior with a HIPAA-compliant alternative that is nearly as convenient.

Patients also expect secure communication. The 21st Century Cures Act and patient portal requirements have increased patient engagement through electronic channels. Patients want to communicate with their providers electronically, and you need a secure way to facilitate that communication beyond the patient portal.

## How to Decide If You Need It

Every practice that sends or receives PHI electronically needs encrypted communications. The questions are what solutions you need and how urgently.

Assess your current state:

- **Email encryption**: Does your current email system encrypt messages containing PHI? If you are using standard Gmail, Outlook, or a basic email provider without encryption, you have a gap.
- **Staff text messaging**: Are providers and staff texting patient information on personal devices? If yes, this is a high-priority risk to address.
- **Fax volume**: How much PHI do you transmit via fax? If significant, evaluate whether your fax process is secure and whether a cloud fax solution could improve security and workflow.
- **File sharing**: How do you share large files containing PHI (imaging, documents, spreadsheets)? If you are using personal cloud storage (Dropbox, Google Drive without BAA) or USB drives, you have a gap.
- **Patient communication**: Beyond your patient portal, how do patients communicate with your practice electronically? Is that channel encrypted?

## Order of Operations

1. **Assess current communication patterns** (Week 1): Map how PHI flows via email, text, fax, and file sharing. Identify the highest-volume and highest-risk communication channels.
2. **Implement email encryption** (Weeks 2-4): This is typically the highest priority and easiest win. Solutions like Paubox can be deployed in hours.
3. **Deploy secure messaging** (Weeks 3-6): Replace unsecured text messaging with a HIPAA-compliant secure messaging platform.
4. **Address fax security** (Weeks 4-8): Evaluate your fax workflow and consider cloud fax solutions if you have significant fax volume.
5. **Secure file sharing** (Weeks 4-8): Implement a HIPAA-compliant file sharing solution for large documents and images.
6. **Train workforce** (Weeks 6-8): Train all staff on new communication tools, acceptable use policies, and why unsecured channels are prohibited for PHI.
7. **Update policies** (Weeks 6-8): Update communication and privacy policies to reflect new tools and expectations. Include sanctions for using unsecured channels for PHI.
8. **Monitor compliance** (Ongoing): Periodically audit communication channels for PHI transmitted outside approved secure channels.

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $50-$200/month for encrypted communications.
- **Email**: Paubox Email Suite ($29/user/month for Standard, less for annual plans) or Microsoft 365 with built-in encryption ($12.50-$22/user/month, encryption included in Business Premium).
- **Secure messaging**: OhMD (free tier for basic, $150-$300/month for teams), Halo Health, or Microsoft Teams (included in M365).
- **Fax**: eFax HIPAA ($18-$35/month), SRFax ($7-$15/month), or RingCentral HIPAA-compliant plan.
- **Recommendation**: Start with email encryption (biggest risk) and address secure messaging as a fast follow. At this size, Microsoft 365 Business Premium provides email encryption plus Teams for secure messaging, offering good value consolidation.

### Medium Practice (4-15 Providers)

- **Budget**: $200-$1,000/month.
- **Email**: Paubox Email Suite Plus ($49/user/month, includes inbound security) or Virtru for Google Workspace/Microsoft 365 ($7-$10/user/month add-on). Microsoft 365 E3/E5 with Azure Information Protection for Microsoft-centric shops.
- **Secure messaging**: TigerConnect ($10-$20/user/month, purpose-built for healthcare), Halo Health ($8-$15/user/month), or Microsoft Teams with compliance configuration.
- **Fax**: Cloud fax integrated with EHR where possible. Consensus/j2 Global enterprise fax ($200-$500/month), or EHR-integrated fax from vendors like Updox.
- **Recommendation**: Deploy dedicated email encryption (Paubox or Virtru) for simplicity and reliability. Implement TigerConnect or similar for clinical messaging. Consolidate fax to cloud-based solution.

### Large Practice (15+ Providers)

- **Budget**: $1,000-$5,000/month.
- **Email**: Enterprise email encryption integrated with DLP (Data Loss Prevention). Microsoft 365 E5 with Purview Information Protection, or Proofpoint Email Protection with encryption module.
- **Secure messaging**: TigerConnect Enterprise, Cisco Webex with healthcare compliance, or Microsoft Teams with advanced compliance and DLP policies.
- **Fax**: Enterprise cloud fax with EHR integration, audit logging, and centralized management.
- **Recommendation**: Implement a comprehensive communication governance strategy that covers all channels. Deploy DLP policies to prevent PHI from leaving through unencrypted channels. Consider a unified communications platform that provides encrypted messaging, video, voice, and collaboration in a single compliant solution.

## Options Analysis

### Off-the-Shelf Email Encryption

Purpose-built HIPAA email encryption solutions that integrate with your existing email provider.

- **Paubox**: Seamless encryption with no portal requirement for recipients. TLS verification with fallback. Integrates with Microsoft 365, Google Workspace. Standard ($29/user/month), Plus ($49/user/month adds inbound threat protection), Premium ($69/user/month adds DLP). Annual plans reduce cost 15-20%.
- **Virtru**: End-to-end encryption add-on for Gmail and Outlook. Recipients open encrypted messages via Virtru Secure Reader. $7-$10/user/month. Strong access controls and revocation capabilities.
- **Zix (now part of OpenText)**: Long-established healthcare email encryption. Portal-based delivery. $5-$8/user/month. Acquired by OpenText; product direction uncertain.
- **LuxSci**: HIPAA-compliant email hosting with built-in encryption. Good for practices wanting a fully HIPAA-compliant email infrastructure. $10-$40/user/month.

**Pros**: Purpose-built for healthcare, easy deployment, reliable encryption, vendor manages compliance complexity.
**Cons**: Per-user subscription cost, may require recipient interaction (portal-based solutions), another vendor relationship to manage.

### Microsoft 365 Built-In Encryption

Microsoft 365 includes several encryption capabilities depending on license level.

- **Office 365 Message Encryption (OME)**: Included in E3/E5 and Business Premium. Encrypts messages and attachments. Recipients receive a link to view in a web portal or can authenticate with Microsoft/Google credentials.
- **S/MIME**: Certificate-based encryption between Outlook users. Complex to manage, primarily useful for organization-to-organization encryption.
- **Sensitivity labels with Azure Information Protection**: Available in E5 and as add-on. Allows users to classify and protect messages and documents based on sensitivity.
- **Microsoft Purview Message Encryption**: Enhanced encryption with additional controls like revocation and templates.

**Pros**: No additional vendor, integrated with existing Microsoft environment, cost included in subscription, strong compliance features in E5 tier.
**Cons**: Portal-based delivery can frustrate external recipients, requires E3+ or Business Premium, less seamless than Paubox-style solutions, configuration complexity.

### Secure Messaging Platforms

Purpose-built clinical communication platforms.

- **TigerConnect**: Market leader in healthcare secure messaging. Role-based messaging, delivery confirmation, message lifecycle management, integration with EHR and scheduling systems. Used by many health systems. $10-$20/user/month.
- **Halo Health (now part of symplr)**: Strong clinical communication and collaboration platform. Good integration capabilities. $8-$15/user/month.
- **OhMD**: Combines patient communication and clinical team messaging. Two-way texting with patients over a HIPAA-compliant channel. Free basic tier; paid plans $150-$300/month for small teams.
- **Imprivata Cortext**: Part of the Imprivata identity platform. Good for organizations already using Imprivata for authentication. $8-$15/user/month.
- **Microsoft Teams**: Not purpose-built for clinical messaging but can be configured for HIPAA compliance with appropriate DLP policies, retention settings, and BAA (included in Microsoft BAA for qualifying licenses). Included in Microsoft 365 subscriptions.

**Pros**: Replace dangerous SMS-based clinical communication, audit trails, message lifecycle management, integration with clinical workflows.
**Cons**: Adoption challenges (staff prefer familiar texting), additional cost, another application to manage, training required.

### Open Source

Options like Signal (encrypted messaging) or self-hosted email servers with encryption.

- **Pros**: No licensing cost, strong encryption, transparent code.
- **Cons**: No BAA available from Signal (though the encryption is excellent, the organizational compliance framework is not designed for healthcare), self-hosted solutions require significant expertise, no vendor support, compliance documentation burden entirely on you.
- **Best for**: Not recommended for most primary care practices. The compliance and support risks outweigh the cost savings.

## Vendor Landscape

**Email Encryption:**
- **Paubox**: Best-in-class for healthcare email encryption. Seamless experience for senders and recipients. Strong reputation. $29-$69/user/month.
- **Virtru**: Strong encryption with good usability. Better for organizations needing granular access controls and content protection beyond email. $7-$10/user/month.
- **Microsoft 365**: Good enough for many practices, especially those already on E3/E5. No additional cost but less polished encryption experience.
- **Proofpoint**: Enterprise-grade email security with encryption. Overkill for small practices but strong for large organizations. $3-$8/user/month.

**Secure Messaging:**
- **TigerConnect**: Market leader. Best integration ecosystem. Premium pricing justified for clinical environments. $10-$20/user/month.
- **OhMD**: Best for practices wanting combined patient and clinical messaging. Good value. Free-$300/month.
- **Microsoft Teams**: Best value if already in the Microsoft ecosystem. Requires compliance configuration. Included in M365.

**Cloud Fax:**
- **eFax/j2 Global**: HIPAA-compliant plans available. Widely used. $18-$35/month for basic plans.
- **SRFax**: HIPAA-compliant, affordable, API-available. Good for small practices. $7-$15/month.
- **RingCentral**: HIPAA-compliant unified communications including fax. Good if consolidating phone and fax. $20-$45/user/month.
- **Updox**: Healthcare-specific communication platform including fax, integrated with many EHRs. Contact for pricing.

## Compliance & Regulatory Notes

- **Encryption is "addressable" but expected**: While the Security Rule lists encryption as an addressable specification, OCR has made clear through enforcement actions that the absence of encryption for ePHI in transit requires strong documented justification for an alternative measure. In practice, encryption is expected.
- **TLS version matters**: TLS 1.0 and 1.1 are deprecated and no longer considered secure. Ensure your email encryption uses TLS 1.2 or higher. Opportunistic TLS (encrypting when available) is better than nothing but does not guarantee encryption.
- **BAA requirements**: You need a BAA with any email provider, messaging platform, cloud fax service, or file sharing service that processes or stores PHI. Gmail and Microsoft 365 offer BAAs under qualifying license plans; consumer versions do not.
- **Patient communication consent**: Communicating with patients via email or text requires their consent and understanding of the risks. Document consent and provide patients the option to opt out.
- **State laws**: Some states have additional requirements for electronic communication of health information. California, Texas, and New York have particularly strict rules.
- **21st Century Cures Act**: Blocking patient access to their health information through electronic means may constitute information blocking. Ensure your encrypted communication infrastructure supports rather than impedes patient access.
- **Text messaging prohibition is not HIPAA-explicit**: HIPAA does not specifically mention text messaging, but unencrypted SMS clearly fails the transmission security requirements. Joint Commission and CMS have also weighed in against unencrypted texting for orders and clinical communication.

## Common Mistakes

1. **Relying on the "this email is confidential" disclaimer**: A confidentiality notice appended to an unencrypted email provides zero technical protection. It is legally meaningless for HIPAA purposes.
2. **Using personal email for clinical communication**: Providers using Gmail or Yahoo personal accounts for patient-related email is a common and serious violation. All clinical email must go through your practice's encrypted email system.
3. **Assuming TLS means you are encrypted**: Opportunistic TLS only works if both the sender's and recipient's email servers support it. If the recipient's server does not support TLS, the message is sent unencrypted without notification. Solutions like Paubox verify TLS and fall back to secure portal delivery.
4. **Not encrypting internal email**: PHI sent between staff within the same organization still traverses network infrastructure. Ensure internal email is also encrypted, especially if you use cloud email.
5. **Allowing standard SMS for clinical communication**: This is one of the most pervasive HIPAA risks in primary care. Even "I just texted a quick question" represents unencrypted PHI on personal devices outside your control.
6. **Not configuring email DLP**: Without Data Loss Prevention rules, staff can email PHI to anyone without triggering encryption. Configure DLP rules to detect and encrypt messages containing PHI patterns (SSN, MRN, clinical terms).
7. **Forgetting about attachments**: Encrypting the email body but attaching an unencrypted spreadsheet of patient data defeats the purpose. Ensure your solution encrypts attachments as well.
8. **No retention or archival policy**: Encrypted email still needs retention management. PHI in email is subject to HIPAA retention requirements and legal hold obligations.
9. **Ignoring the fax machine**: The fax machine in the hallway is still transmitting PHI. While analog fax has a HIPAA carve-out, fax-to-email and cloud fax are electronic transmissions subject to the Security Rule.
10. **Choosing encryption that frustrates recipients**: If your encryption solution is so burdensome that referring physicians refuse to use it, you have solved a compliance problem by creating a care coordination problem. Prioritize seamless solutions.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small/5 users) | Estimated Cost (Medium/20 users) |
|-------|----------|------------|-------------------------------|----------------------------------|
| **Phase 1: Email Encryption** | Weeks 1-2 | Deploy email encryption solution, configure DNS records, test delivery to common recipients | $150-$350/mo ongoing | $500-$1,400/mo ongoing |
| **Phase 2: Secure Messaging** | Weeks 2-4 | Select and deploy secure messaging platform, configure user accounts, set message policies | $0-$200/mo ongoing | $200-$400/mo ongoing |
| **Phase 3: Cloud Fax** | Weeks 3-6 | Evaluate fax volume, deploy cloud fax solution, port fax numbers if needed, test with common recipients | $20-$50/mo ongoing | $50-$200/mo ongoing |
| **Phase 4: Policy & Training** | Weeks 4-6 | Update acceptable use policies, train staff on new tools, communicate expectations about unsecured channels | $500-$1,000 one-time | $1,000-$3,000 one-time |
| **Phase 5: DLP Configuration** | Weeks 6-8 | Configure DLP rules to detect PHI in outbound email, test and tune rules | $0 (if using M365) | $0-$500 one-time |
| **Ongoing** | Monthly | Monitor encrypted vs. unencrypted email volumes, audit messaging compliance, review DLP reports | Included in monthly | Included in monthly |

**Total monthly cost**: $170-$600 (small) | $750-$2,000 (medium)
**Annual cost**: $2,500-$8,200 (small) | $10,000-$27,000 (medium)

Email encryption should be one of the first security controls you implement. It is fast to deploy, relatively inexpensive, and addresses one of the most common HIPAA compliance gaps in primary care practices. Start with email encryption this week and deploy secure messaging within the month.
