# AI Governance & Ethics

## What Is This?

AI governance in healthcare is the framework of policies, processes, oversight structures, and accountability mechanisms that a primary care practice establishes to ensure that artificial intelligence tools are adopted, deployed, monitored, and retired responsibly. As AI permeates healthcare IT -- from ambient clinical documentation and coding assistance to predictive analytics and conversational patient interfaces -- practices face decisions with implications for patient safety, clinical quality, regulatory compliance, financial performance, and ethical integrity.

AI governance addresses a set of interconnected questions: Which AI tools should we adopt and which should we decline? How do we validate that an AI tool performs accurately and fairly before deploying it in clinical workflows? Who is accountable when an AI tool produces an incorrect or harmful output? How do we monitor AI performance over time and detect degradation? How do we ensure that AI tools do not perpetuate or amplify existing biases in healthcare? How do we maintain transparency with patients about AI's role in their care? And how do we balance the efficiency gains of AI against the risks of over-reliance?

For a primary care practice, AI governance does not need to resemble the elaborate governance frameworks of large health systems with dedicated AI ethics committees, institutional review boards, and chief AI officers. But it does need to exist in a form proportionate to the practice's AI usage. A practice using ambient documentation, AI-assisted coding, a conversational AI phone system, and predictive analytics is making AI-influenced decisions that affect patient care, billing, communication, and resource allocation -- each of these deserves intentional governance rather than ad hoc adoption.

The governance challenge is intensified by the speed of AI development. Healthcare AI capabilities are advancing faster than regulatory frameworks, clinical validation processes, and organizational readiness. Practices that adopt AI without governance frameworks risk regulatory penalties, patient harm, financial exposure, and reputational damage. Practices that refuse to adopt AI due to governance concerns risk falling behind on efficiency, provider satisfaction, and competitive positioning. Governance is the mechanism for navigating between these risks.

## Why Does a Primary Care Practice Need This?

**Patient safety requires AI oversight.** AI-generated clinical notes may contain errors. AI coding suggestions may not accurately reflect the clinical encounter. AI-powered triage may inappropriately classify symptom severity. AI predictive models may fail to identify high-risk patients or may flag low-risk patients inappropriately. Each of these failures has direct patient care implications. Governance ensures that human oversight is maintained, that AI outputs are validated, and that errors are detected and corrected before they cause harm.

**Liability and accountability are unclear and evolving.** When an AI tool generates an incorrect clinical note that leads to a treatment error, who is liable? The provider who signed the note? The AI vendor? The practice that selected and deployed the tool? Current malpractice law holds the signing provider accountable, but the legal landscape is evolving. A governance framework that documents the practice's AI selection process, validation activities, monitoring procedures, and provider responsibilities provides a defensible position regardless of how liability law develops.

**Regulatory requirements are emerging.** While no comprehensive federal AI regulation exists for healthcare as of 2025, the regulatory landscape is active. The FDA regulates AI/ML-based Software as a Medical Device (SaMD). CMS is evaluating AI's role in coding and billing compliance. ONC's Health IT Certification Program increasingly addresses AI-enabled features in certified EHRs. The EU's AI Act (effective 2024-2026) classifies healthcare AI as high-risk with specific transparency and oversight requirements -- affecting practices that use tools from EU-based vendors. State-level AI regulations are proliferating (Colorado, Illinois, California). A governance framework positions the practice to comply with current and emerging requirements.

**Bias in healthcare AI is documented and consequential.** The most well-known example is the Optum algorithm (identified in a 2019 Science paper) that used healthcare spending as a proxy for health needs, resulting in Black patients being systematically assigned lower risk scores than equally sick white patients because Black patients historically had less spent on their care. While this example involved a health plan algorithm, the lesson applies broadly: AI models trained on historical healthcare data inherit the biases present in that data. Primary care practices that deploy predictive models, risk stratification tools, or clinical decision support without evaluating for bias risk perpetuating health disparities.

**Organizational trust and adoption depend on governance.** Providers who do not trust AI outputs will not use AI tools effectively -- they will either ignore the AI (wasting the investment) or disengage from oversight (creating safety risk). A governance framework that includes provider involvement in AI selection, transparent performance data, clear escalation procedures for concerns, and defined accountability builds the trust necessary for effective AI adoption.

## How to Decide If You Need It

If your practice uses any AI tool that influences clinical decisions, patient communication, billing, or operational management, you need AI governance. The threshold is low because the impact is high.

Specifically, you need a governance framework if:
- You use or plan to use ambient clinical documentation (AI generates clinical notes).
- You use or plan to use AI-assisted coding or billing (AI suggests billing codes).
- You use or plan to use conversational AI for patient communication (AI interacts with patients).
- You use or plan to use predictive analytics to stratify patients or prioritize interventions.
- You use or plan to use clinical decision support tools powered by AI/ML.

The governance framework should be proportionate to your AI footprint. A practice using a single AI tool (ambient documentation) needs a simpler framework than a practice using five AI tools across clinical, administrative, and patient communication functions.

Even if you currently use no AI tools, developing a basic governance framework now (an AI evaluation checklist, a policy on provider review of AI outputs) prepares you for the AI adoption that is increasingly inevitable in primary care.

## Order of Operations

1. **Inventory current AI usage.** List every AI-powered tool currently in use or under evaluation. For each tool, document: what it does, what data it accesses, what decisions it influences, who the vendor is, and who in the practice is responsible for it.
2. **Assign governance responsibility.** Designate a person (practice manager, physician leader, compliance officer) as the AI governance lead. This person does not need AI technical expertise -- they need organizational authority and a commitment to systematic oversight.
3. **Develop an AI adoption evaluation framework.** Create a checklist or evaluation rubric that must be completed before any new AI tool is adopted. This should cover: clinical validity (is there evidence the tool works?), bias evaluation (has the tool been tested for disparate impact across demographics?), regulatory status (is the tool FDA-cleared or exempt?), privacy and security (BAA, data handling, encryption), integration requirements, and financial model.
4. **Establish provider review policies.** For any AI tool that generates clinical content (notes, coding, orders, recommendations), establish a clear policy that providers must review, edit as necessary, and approve AI outputs before they become part of the medical record or trigger billing.
5. **Implement monitoring.** Define how AI tool performance will be monitored: accuracy audits (sampling AI outputs and comparing to expert human review), bias monitoring (checking for disparate performance across patient demographics), and user feedback collection (systematic provider and staff input on AI tool performance).
6. **Create an incident response process.** Define what happens when an AI tool produces a clearly incorrect or harmful output: how is it reported, who investigates, what corrective actions are available, and when is the tool suspended pending investigation?
7. **Establish transparency practices.** Define how patients are informed about AI's role in their care. At minimum: ambient documentation (inform patients that AI assists with note-taking), conversational AI (disclose at the beginning of the interaction), and clinical decision support (document in the medical record when AI recommendations influence clinical decisions).
8. **Review and update regularly.** AI governance is not a one-time exercise. Review the governance framework annually, after any AI-related incident, and whenever new AI tools are adopted or existing tools are significantly updated.

## Options by Practice Size

**Solo/Small Practice (1-5 providers):**
A simple AI governance policy (1-3 pages) covering: AI tool inventory, provider review requirements, patient transparency, incident reporting, and annual review. The practice owner or manager serves as the governance lead. Budget: $0 (staff time only).

**Mid-Size Group (6-15 providers):**
Documented AI governance framework including evaluation criteria, monitoring protocols, and incident response. A designated AI governance lead with quarterly review meetings. Vendor management policies for AI tools. Budget: $0-$500/month (primarily staff time, possibly consultant assistance for framework development).

**Large Group (16+ providers):**
Formal AI governance committee (physician champion, compliance officer, IT lead, operations representative). Comprehensive AI evaluation rubric. Ongoing monitoring program with quarterly performance audits. Patient communication strategy for AI transparency. Budget: $500-$2,000/month (staff time, consultant fees, monitoring tools).

## Options Analysis

**Internal Governance Framework (DIY) ($0):**
The practice develops its own AI governance policies and procedures using publicly available frameworks and guidance. Resources include the AMA's Physician Innovation Network guidance on AI, the American Medical Informatics Association (AMIA) AI ethics guidelines, the WHO guidance on AI in healthcare, and the National Academy of Medicine's AI code of conduct. Strengths: no cost, fully customized to the practice, builds internal governance capability. Weaknesses: requires someone with the knowledge and time to develop the framework, may not address all compliance requirements, lacks external validation.

**Coalition for Health AI (CHAI) Framework (Free):**
CHAI is a multi-stakeholder organization developing standards and guidelines for trustworthy AI in healthcare. Their framework addresses AI evaluation, deployment, monitoring, and organizational governance. The CHAI Assurance Standards Lab provides model evaluation tools and standards. Strengths: developed by healthcare AI experts, comprehensive, evolving with the field, free to access. Weaknesses: designed for health systems and may require adaptation for primary care practices, still developing (not all components are finalized).

**NIST AI Risk Management Framework (Free):**
The National Institute of Standards and Technology's AI RMF provides a voluntary framework for managing AI risks across any industry. While not healthcare-specific, it provides a structured approach to AI governance covering: govern, map, measure, and manage. Strengths: comprehensive, government-backed, widely referenced in emerging AI regulations, free. Weaknesses: not healthcare-specific, requires adaptation for clinical context, may be more detailed than a primary care practice needs.

**Consulting Firms (Healthcare AI Governance Advisory) ($5,000-$25,000 for framework development):**
Healthcare consulting firms (Deloitte, PwC, KPMG, Chartis) and specialized health IT consultants offer AI governance advisory services, including framework development, risk assessment, and implementation support. Strengths: expert guidance, tailored to the practice, addresses compliance requirements. Weaknesses: expensive, external dependency, the practice must still maintain the framework ongoing.

**AI Monitoring and Audit Tools (Emerging category, $500-$5,000/month):**
A nascent category of tools designed to monitor AI model performance in production. Companies like Arthur AI, Fiddler AI, and WhyLabs provide model monitoring platforms that track accuracy, bias, data drift, and performance degradation. Primarily designed for organizations that develop their own AI models, but potentially relevant for larger healthcare organizations using multiple AI tools. Strengths: automated monitoring, bias detection, performance alerting. Weaknesses: designed for AI developers (not healthcare practices), expensive, overkill for practices using vendor-provided AI tools (the vendor should be monitoring their own models).

## Vendor Landscape

AI governance in healthcare is at an inflection point. The industry recognizes the need for governance but has not yet converged on standards, tools, or organizational structures. Several developments are shaping the landscape:

The AMA has been active in developing physician-facing AI guidance, including principles for augmented intelligence that emphasize: design for physician authority, transparency, bias mitigation, and protection against conflicts of interest. These principles provide a useful lens for evaluating AI tools.

The FDA's approach to AI/ML-based SaMD is evolving through the Predetermined Change Control Plan framework, which allows AI tools to update their algorithms within pre-approved boundaries without requiring new regulatory clearance for each update. For primary care practices, the key distinction is whether an AI tool is FDA-regulated (clinical decision support that autonomously drives action) or FDA-exempt (clinical decision support that presents information for provider review). Most AI tools used in primary care (ambient documentation, coding, conversational AI) fall outside FDA regulation because they support rather than replace clinical decisions.

The Office of the National Coordinator (ONC) is addressing AI through the Health IT Certification Program. Certified EHRs that incorporate AI features must meet certification criteria that address transparency, data quality, and functionality. This provides a baseline level of AI governance for tools embedded in certified EHR platforms.

Health equity organizations, including the National Health Council, American Public Health Association, and specific communities represented by organizations like the National Medical Association, are driving attention to AI bias in healthcare. Practices should expect that AI equity evaluation will become a standard component of AI governance frameworks and potentially a regulatory requirement.

## Compliance & Regulatory Notes

**FDA Regulation of AI/ML in Healthcare:** The FDA regulates AI/ML-based Software as a Medical Device (SaMD) when the tool is intended for clinical decision-making. However, the 21st Century Cures Act excludes certain clinical decision support from FDA regulation if it: (1) is not intended to acquire, process, or analyze a medical image or signal; (2) displays, analyzes, or prints medical information already available through the EHR; (3) is intended for healthcare professionals; and (4) allows the professional to independently review the basis of the recommendation. Most current primary care AI tools (ambient documentation, coding, conversational AI) meet these exemption criteria. Clinical prediction models and triage AI may fall closer to the regulatory line.

**CMS and AI Billing Compliance:** CMS has not issued specific rules about AI-assisted coding, but existing fraud and abuse laws apply. If AI coding systematically produces inaccurate codes (particularly if they trend toward upcoding), the practice faces False Claims Act liability regardless of whether a human or AI selected the code. The provider who signs the claim is responsible for its accuracy.

**State AI Regulations:** Colorado's AI Act (SB 21-169, effective 2026) requires deployers of high-risk AI systems to implement risk management policies, conduct impact assessments, disclose AI use, and protect consumer rights. Other states (California, Illinois, New York) are developing healthcare-specific AI regulations. Monitor state-level developments relevant to your jurisdiction.

**Informed Consent and AI Disclosure:** No federal law currently requires explicit patient consent for AI-assisted clinical documentation or AI-influenced clinical decisions (beyond general informed consent for treatment). However, best practice and emerging state requirements favor transparency. Document your AI disclosure practices in your policies and be prepared for evolving requirements.

**HIPAA and AI Tools:** All AI tools that process PHI are business associates requiring BAAs. AI vendors that train their models on your practice's patient data must have data use agreements specifying whether the data is used only for your practice's purposes or also for model improvement. Understand and control how your patient data is used by AI vendors.

## Common Mistakes

1. **Adopting AI without a governance framework.** The most common and most consequential mistake. Each AI tool adopted without evaluation, monitoring, and accountability policies creates unmanaged risk. Develop governance before or simultaneously with AI adoption, not after.

2. **Assuming the AI vendor handles governance.** AI vendors are responsible for their product's technical performance. The practice is responsible for how the product is used in clinical care, how outputs are validated, and how patients are informed. Vendor governance and practice governance are complementary, not substitutional.

3. **Not monitoring for bias.** If your AI-powered no-show model or risk stratification tool performs differently across racial or socioeconomic groups, you are potentially contributing to health disparities through your technology choices. Request demographic performance data from vendors and monitor your own outcomes.

4. **Over-trusting AI outputs.** AI tools present outputs with a confidence and consistency that can create an illusion of infallibility. Providers who review AI-generated notes may become progressively less thorough in their review as they find the notes consistently acceptable. This "automation complacency" is a well-documented human factors risk. Combat it through periodic auditing, error-injection exercises, and ongoing training.

5. **Under-communicating with patients.** Patients have a right to know when AI plays a role in their care. Most patients are comfortable with AI assistance when informed transparently. Discovering AI involvement without prior disclosure damages trust. Err toward transparency.

6. **Failing to plan for AI tool failure or retirement.** AI vendors go out of business, pivot their products, or discontinue features. Your governance framework should include contingency plans for any AI tool becoming unavailable. What is the fallback workflow if ambient documentation stops working mid-clinic? What is the backup process if the conversational AI goes offline?

7. **Not engaging clinical leadership.** AI governance that is purely an IT or administrative function lacks clinical credibility and misses clinical risk factors. At least one physician must be actively involved in AI governance decisions, particularly for tools that influence clinical documentation, decision-making, and patient communication.

## Recommended Implementation Timeline

**Month 1: Inventory and Assessment**
List all current AI tools in use or under evaluation. For each, document the function, vendor, data accessed, clinical impact, and current oversight mechanisms. Identify gaps in current governance.

**Month 2: Framework Development**
Develop a proportionate AI governance framework. Key components: AI tool evaluation checklist (to be used before adopting any new AI tool), provider review policy (requirements for human oversight of AI clinical outputs), transparency policy (how patients are informed about AI), monitoring plan (how AI performance is tracked), and incident response procedure (what happens when AI fails).

**Month 3: Policy Approval and Communication**
Review the framework with clinical and administrative leadership. Obtain formal approval. Communicate the framework to all staff, emphasizing that governance supports (not impedes) AI adoption. Distribute the AI evaluation checklist to anyone involved in technology purchasing decisions.

**Months 4-6: Retroactive Evaluation**
Apply the governance framework retroactively to existing AI tools. For each tool currently in use: validate performance through a sampling audit, assess for bias if applicable, verify that provider review policies are being followed, confirm patient transparency practices, and update vendor agreements (BAAs, data use agreements) as needed.

**Months 7-12: Monitoring Implementation**
Implement ongoing monitoring for all AI tools: quarterly accuracy audits for clinical AI (ambient documentation, coding), monthly review of conversational AI performance metrics, semi-annual bias assessment for predictive models, and ongoing collection of provider and patient feedback.

**Ongoing: Annual Governance Review**
Review and update the governance framework annually. Assess: Have new AI tools been adopted? Have existing tools changed significantly? Have regulatory requirements evolved? Have any AI-related incidents occurred? Is the monitoring program detecting issues effectively? Update policies, procedures, and evaluation criteria as needed.
