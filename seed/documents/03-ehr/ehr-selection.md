# EHR Selection & Implementation

## What Is This?

An Electronic Health Record (EHR) system is the central nervous system of a modern primary care practice. It replaces paper charts with a digital record of every patient encounter, lab result, medication, allergy, immunization, problem list entry, and clinical note your practice produces. But a modern EHR is far more than a digital filing cabinet — it is a workflow engine that drives scheduling, documentation, ordering, prescribing, billing, reporting, and patient communication.

EHR selection is the single most consequential technology decision a primary care practice will make. The system you choose will shape how your clinicians document, how your staff operates, how you bill, how you communicate with patients, and how you report quality measures for the next 5-10 years. Switching EHRs after implementation is extraordinarily painful and expensive, so getting this right the first time is paramount.

The EHR market for ambulatory primary care has consolidated significantly over the past decade. A handful of dominant cloud-based platforms now serve the majority of small-to-mid-size practices, while Epic has expanded downmarket from its health-system roots into larger independent groups. Open source options like OpenEMR exist but require significant technical investment. Each platform brings trade-offs in usability, interoperability, cost, and ecosystem depth.

## Why Does a Primary Care Practice Need This?

The short answer is that you cannot legally and practically operate a primary care practice in the United States without one. Meaningful Use (now Promoting Interoperability) incentive and penalty programs, MIPS/APM quality reporting, e-prescribing mandates (including EPCS for controlled substances in most states), information blocking rules under the 21st Century Cures Act, and payer requirements for claims submission all effectively mandate EHR use.

Beyond compliance, a well-implemented EHR directly impacts:

- **Revenue**: Proper documentation supports accurate coding. Integrated charge capture reduces missed charges. Payer quality incentives (MIPS bonuses, shared savings) require structured data that only an EHR can provide.
- **Clinical quality**: Clinical decision support, preventive care reminders, drug interaction checking, and population health dashboards all depend on structured EHR data.
- **Operational efficiency**: Integrated scheduling, check-in workflows, referral management, and patient communication tools reduce manual work and phone calls.
- **Patient satisfaction**: Online scheduling, patient portal access to records and results, secure messaging, and pre-visit digital intake all run through the EHR ecosystem.
- **Risk management**: Legible, timestamped, auditable documentation is your best malpractice defense.

## How to Decide If You Need It

If you are starting a new practice, you need an EHR before you see your first patient. There is no viable "paper first, digital later" path in 2025+. The question is not whether to implement an EHR — it is which one to choose and how to implement it well.

If you are an existing practice considering a switch, the calculus is different. EHR migrations are expensive ($20,000-$150,000+ depending on practice size), disruptive (expect 20-40% productivity drops for 4-8 weeks), and risky (data migration is never perfect). You should switch only if your current system has fundamental deficiencies that cannot be resolved: vendor end-of-life, critical interoperability gaps, unsustainable costs, or workflow problems that are measurably costing you revenue or quality scores.

## Order of Operations

1. **Define requirements** (4-6 weeks): Survey your providers and staff. What are the must-haves vs. nice-to-haves? Document workflows for scheduling, check-in, documentation, ordering, prescribing, referral management, billing, and reporting.
2. **Shortlist vendors** (2-3 weeks): Based on practice size, specialty, budget, and integration requirements, narrow to 3-4 candidates.
3. **Request demos and proposals** (3-4 weeks): Insist on workflow-based demos using your actual scenarios, not canned presentations. Get detailed pricing including implementation, training, interfaces, and ongoing costs.
4. **Check references** (2 weeks): Speak with 3-5 practices of similar size and specialty for each finalist. Ask about go-live experience, ongoing support quality, and total cost of ownership.
5. **Negotiate and contract** (2-4 weeks): Negotiate pricing, SLAs, data ownership/portability clauses, and exit terms. Have a healthcare IT attorney review the contract.
6. **Implementation and build** (8-16 weeks): Configure templates, order sets, user roles, scheduling templates, interfaces, and practice-specific workflows.
7. **Data migration** (runs in parallel, 4-8 weeks): Extract, transform, and load data from your current system. Plan what migrates (demographics, problems, medications, allergies at minimum) vs. what gets scanned as documents.
8. **Training** (2-4 weeks): Provider and staff training. Plan for role-based training — front desk, clinical staff, providers, and billing each need different curricula.
9. **Go-live** (1-2 weeks): Plan for reduced patient volume (50-75% of normal). Have super-users and vendor support on-site. Run extended hours the first week.
10. **Optimization** (ongoing, intensive for 8-12 weeks post go-live): Template refinement, workflow adjustments, additional training based on real-world experience.

## Options by Practice Size

### Small Practice (1-3 Providers)

Cloud-based, all-in-one platforms dominate this segment. You want minimal IT overhead, bundled PM/billing, and predictable monthly costs. The best options are:

- **athenahealth**: Market leader for small practices. Cloud-native, strong revenue cycle services, good interoperability. $350-500/provider/month for EHR+PM+RCM. The "percentage of collections" pricing model (around 4-8% of collections) can be attractive for startups but expensive at scale.
- **Tebra (formerly Kareo + PatientPop)**: Lower cost entry point ($250-400/provider/month), good for very small practices. Less robust clinical content than athena.
- **eClinicalWorks**: Large market share, aggressive pricing ($300-500/provider/month), but has had significant regulatory issues (DOJ settlement) and mixed user satisfaction scores.
- **DrChrono (acquired by EverHealth)**: iPad-first design, good for tech-forward small practices. $350-500/provider/month.

At this size, do not overcomplicate. Pick a well-supported cloud platform with integrated PM, sign a reasonable contract term (avoid 5+ year lock-ins), and focus your energy on configuration and training rather than extensive customization.

### Medium Practice (4-15 Providers)

At this size, you need more sophisticated reporting, role-based workflows, and potentially multi-location support. Integration requirements grow as you add lab interfaces, imaging, and possibly multiple specialties.

- **athenahealth**: Scales well to this size. The revenue cycle management services become particularly valuable as billing complexity grows.
- **NextGen Healthcare**: Strong in multi-specialty groups. Good reporting and population health tools. $350-600/provider/month for cloud, with on-premise options still available.
- **Greenway Health (Intergy)**: Solid mid-market option with good clinical content for primary care. $300-500/provider/month.
- **eClinicalWorks**: Price-competitive at this tier. V12 cloud platform is a significant improvement over legacy versions.
- **ModMed**: If you have procedural specialties in the group, ModMed's specialty-specific modules are strong. Less primary-care-focused.

At this size, you should also evaluate whether you need a dedicated IT resource (internal or managed service provider) to handle EHR administration, interface management, and optimization.

### Large Practice (15+ Providers)

Larger groups have more options but also more complex requirements: enterprise reporting, advanced population health, multi-facility scheduling, robust API ecosystems, and potentially health information exchange participation.

- **Epic (Community Connect or Hosted)**: The gold standard for large groups, especially those affiliated with health systems. Epic Community Connect partnerships with local hospitals can reduce costs significantly. Direct Epic licensing starts around $500-800/provider/month but total cost of ownership is higher. Epic's interoperability (Care Everywhere network), patient portal (MyChart), and analytics tools are best-in-class.
- **Oracle Health (Cerner)**: Strong in hospital-affiliated groups. The Oracle acquisition has introduced uncertainty but the ambulatory platform remains viable.
- **athenahealth**: Continues to serve groups of this size well, particularly with the athenaOne platform.
- **NextGen Healthcare**: Enterprise edition supports complex multi-location, multi-specialty groups.
- **MEDITECH Expanse**: If hospital-affiliated, MEDITECH's ambulatory module has improved significantly in the Expanse platform.

At this size, budget for a dedicated implementation team: project manager, clinical informaticist, technical lead, and training coordinator. Plan for 6-12 month implementations.

## Options Analysis

### Off-the-Shelf Cloud (SaaS)

**Examples**: athenahealth, eClinicalWorks Cloud, NextGen Office, Tebra

- **Pros**: Lowest IT overhead, automatic updates, predictable costs, fast deployment (8-12 weeks), vendor-managed infrastructure and security.
- **Cons**: Limited customization, dependent on vendor roadmap, data portability concerns, recurring costs never end.
- **Best for**: Small to medium practices without dedicated IT staff.
- **Typical cost**: $250-600/provider/month, plus implementation fees of $2,000-10,000/provider.

### On-Premise / Server-Based

**Examples**: NextGen Enterprise (legacy), Greenway Prime Suite (legacy), GE Centricity (end-of-life)

- **Pros**: More control over data and customization, potentially lower long-term cost for large groups.
- **Cons**: Requires IT infrastructure and staff, responsible for backups/DR/security, slower updates, increasingly obsolete model. Most vendors are sunsetting on-premise versions.
- **Typical cost**: $15,000-50,000+ initial license per provider, plus $3,000-8,000/year maintenance, plus hardware and IT staffing.
- **Recommendation**: Avoid for new implementations. The market has decisively moved to cloud.

### Open Source

**Examples**: OpenEMR, OpenMRS, LibreHealth

- **Pros**: No license fees, full source code access, active community, highly customizable.
- **Cons**: Requires significant technical expertise to implement and maintain, limited vendor support, certification challenges (ONC certification is complex and expensive for open source), fewer integrated services (RCM, patient portal, etc.), interface development falls on you.
- **Typical cost**: $0 licensing, but $30,000-100,000+ in implementation, customization, and ongoing technical staffing.
- **Best for**: Practices with strong technical resources, unique workflow requirements, or international/FQHC settings. Not recommended for typical US primary care practices unless you have a dedicated developer.

### Enterprise Platform (Epic, Oracle Health)

- **Pros**: Best-in-class functionality, massive interoperability networks, comprehensive ecosystem, strong analytics.
- **Cons**: Highest cost, longest implementation timelines (6-18 months), requires dedicated informatics staff, complex contractual terms.
- **Typical cost**: $500-800/provider/month or equivalent capital plus maintenance, with implementation costs of $50,000-250,000+ depending on scope.
- **Best for**: Large groups (20+ providers), health system affiliates, organizations with long-term growth plans.

## Vendor Landscape

The ambulatory EHR market as of 2025 is dominated by a few major players:

| Vendor | Market Position | Strengths | Weaknesses |
|--------|----------------|-----------|------------|
| **athenahealth** | #1 in small/mid ambulatory | Cloud-native, strong RCM, good interoperability | Cost at scale, customization limits |
| **Epic** | #1 overall (hospital + ambulatory) | Functionality depth, MyChart, Care Everywhere | Cost, complexity, requires informatics staff |
| **Oracle Health (Cerner)** | #2 in hospital-affiliated | Large install base, integrated with Oracle cloud | Uncertain roadmap post-acquisition |
| **eClinicalWorks** | Large ambulatory market share | Price-competitive, feature-rich | DOJ history, mixed satisfaction, support issues |
| **NextGen Healthcare** | Strong mid-market | Multi-specialty support, good reporting | Aging UI in some modules, inconsistent support |
| **Greenway Health** | Mid-market primary care | Solid clinical content, loyal user base | Smaller company, limited R&D budget |
| **Tebra** | Small practice/startup | Low cost entry, modern UX | Less mature clinical features, limited scalability |
| **ModMed** | Specialty-focused | Excellent specialty templates | Weak in primary care specifically |
| **DrChrono/EverHealth** | Small practice | Modern mobile-first design | Limited enterprise features |

**Key trends**: AI-assisted documentation (ambient listening, auto-coding), FHIR-based interoperability mandates, and patient engagement platform convergence are reshaping the market. Every major vendor is integrating or partnering with ambient clinical documentation tools (Nuance DAX, Abridge, Nabla, Suki).

## Compliance & Regulatory Notes

- **ONC Certification**: Your EHR must be ONC-certified (check the CHPL — Certified Health IT Product List). This is required for Promoting Interoperability participation and MIPS reporting.
- **Promoting Interoperability (PI)**: CMS requires eligible clinicians to report PI measures using certified EHR technology. Failure results in a -9% MIPS adjustment (as of 2025 performance year).
- **21st Century Cures Act / Information Blocking**: You must provide patients electronic access to their health information without unreasonable barriers. Your EHR must support standardized APIs (FHIR US Core).
- **HIPAA**: EHR vendors must sign a Business Associate Agreement (BAA). Ensure the BAA covers all modules and services, including cloud hosting, patient portal, and any analytics tools.
- **State e-prescribing mandates**: Most states now require e-prescribing, and many require EPCS for controlled substances. Your EHR must support EPCS (Surescripts network).
- **Data retention**: State laws vary on medical record retention (typically 7-10 years for adults, longer for minors). Ensure your contract addresses data retention and portability if you leave the vendor.
- **Meaningful Use attestation**: While the "Meaningful Use" brand is retired, the underlying requirements persist in Promoting Interoperability. Your EHR must support required measures.

## Common Mistakes

1. **Choosing based on demos alone**: Demos are sales tools. Always check references with similar practices, review KLAS/Black Book scores, and if possible, do a site visit to a live practice.
2. **Underbudgeting training**: The #1 predictor of EHR satisfaction is training quality. Budget 8-16 hours of provider training and 16-24 hours of staff training. Do not rely on self-paced e-learning alone.
3. **Skipping workflow analysis**: Implementing an EHR on top of broken workflows digitizes the dysfunction. Map current and desired workflows before configuration.
4. **Ignoring total cost of ownership**: The monthly subscription is just the start. Add implementation fees, interface costs ($2,000-10,000 per interface), training, hardware, productivity loss during go-live, and optimization consulting.
5. **Over-customizing at go-live**: Start with vendor-recommended configurations and standard templates. Customize iteratively based on real usage, not theoretical preferences.
6. **Neglecting data migration planning**: Decide early what data migrates discretely (structured), what migrates as scanned documents, and what stays in the legacy system (with read-only access). Test migration data quality thoroughly.
7. **Going live without a contingency plan**: Have downtime procedures documented and tested. Know how to register patients, document encounters, and process prescriptions if the system goes down.
8. **Signing long-term contracts without exit clauses**: Negotiate data portability — you need your data in a standard format (CCDA, CSV extracts) if you ever leave. Avoid contracts longer than 3 years without favorable renewal terms.
9. **Failing to designate physician champions**: Each site needs at least one provider who is deeply trained, bought-in, and available to support peers during and after go-live.
10. **Ignoring integration requirements**: Before signing, confirm the EHR can interface with your labs, imaging centers, pharmacy networks, immunization registries, and health information exchanges. Get interface costs in writing.

## Recommended Implementation Timeline

### New Practice (No Existing EHR)

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Vendor selection | 6-10 weeks | Requirements, demos, references, contracting |
| Implementation/build | 8-12 weeks | Configuration, templates, interfaces, testing |
| Training | 2-3 weeks | Role-based training, go-live rehearsal |
| Go-live | 1 week | Reduced volume, on-site support |
| Optimization | 8-12 weeks | Ongoing refinement, additional training |
| **Total** | **4-7 months** | |

### Existing Practice (EHR Migration)

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Vendor selection | 8-12 weeks | Requirements, demos, references, contracting |
| Implementation/build | 10-16 weeks | Configuration, templates, interfaces, data migration planning |
| Data migration | 4-8 weeks (parallel) | Extract, transform, validate, test load |
| Training | 3-4 weeks | Unlearning old workflows is harder than learning new ones |
| Go-live | 1-2 weeks | Reduced volume, legacy system parallel access |
| Optimization | 12-16 weeks | Longer optimization needed for migrations |
| **Total** | **6-12 months** | |

**Critical path items**: Interface development and data migration are almost always the longest-lead items and most common causes of go-live delays. Start them as early as contractually possible. Lab and pharmacy interfaces in particular can take 8-12 weeks from order to go-live due to third-party dependencies (Surescripts, Quest/LabCorp credentialing).
