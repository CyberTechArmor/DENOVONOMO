# Document Management

## What Is This?

Document management in a primary care practice refers to the systems and workflows for capturing, storing, indexing, retrieving, and integrating clinical and administrative documents into the electronic health record. Despite the promise of a paperless office, primary care practices still deal with significant volumes of paper and electronic documents that arrive outside of structured EHR data feeds: faxed referral letters, specialist consultation reports, hospital discharge summaries, insurance forms, patient-completed paper forms, outside records from transferring patients, legal documents (advance directives, power of attorney), and historical paper charts.

A document management system (DMS) — whether standalone or embedded within your EHR — provides the infrastructure to scan paper documents, import electronic documents (PDF, TIFF, Word), index them with metadata (patient identifier, document type, date, provider), route them for review, and attach them to the correct patient's chart in the EHR. The quality of your document management directly impacts clinical workflow, patient safety (missed consultation reports are a leading cause of diagnostic errors), compliance (record completeness), and operational efficiency.

Most modern EHR systems include basic document management capabilities — scanning, importing, indexing, and attaching documents to patient records. However, the depth and usability of these built-in tools varies widely. Some practices supplement EHR-native document management with standalone scanning solutions, intelligent document recognition (ICR/OCR), or third-party document management platforms.

## Why Does a Primary Care Practice Need This?

### Clinical Completeness and Safety

The patient chart must tell a complete story. When a specialist sends a consultation report via fax, that report needs to be in the patient's chart before their next visit with you. When a hospital sends a discharge summary, it must be routed to the PCP for review and follow-up. Studies consistently show that missed or delayed review of incoming clinical documents contributes to diagnostic errors and care coordination failures. A systematic document management workflow ensures nothing falls through the cracks.

### Operational Efficiency

Without a structured document workflow, incoming documents pile up in fax inboxes, on desks, and in email attachments. Staff spend time searching for documents, providers waste time tracking down results, and critical information arrives too late to affect care decisions. A well-designed document workflow cuts this waste by routing documents to the right place with minimal manual handling.

### Compliance and Legal Requirements

Medical records retention laws require that you maintain complete patient records for 7-10+ years (varies by state, longer for minors). This includes all documents received from outside sources. HIPAA requires that you protect the confidentiality of all patient documents. If you are involved in legal proceedings, your document management system must be able to produce a complete chart on request.

### Transition from Paper

If you are a new practice receiving transferred patient records, or an existing practice that transitioned from paper to EHR, you have a backlog of historical paper records. A document management strategy defines what gets scanned and indexed, what gets summarized and entered as discrete data, and what stays in paper storage.

## How to Decide If You Need It

Every practice needs document management capability. The decision points are:

**Your EHR's built-in document management is sufficient if:**
- Your EHR has a functional scanning/importing module with reasonable indexing and routing
- Your incoming document volume is manageable (under 50-100 documents/day for a small practice)
- You do not have a large historical paper chart backlog to digitize
- Your EHR vendor's document module integrates cleanly with the clinical chart

**Consider a standalone DMS or enhanced scanning solution if:**
- Your EHR's document management is clunky, slow, or limited in indexing capabilities
- You have a large paper chart backlog to scan (thousands of charts)
- You need advanced features: OCR (optical character recognition) for text searchability, ICR (intelligent character recognition) for data extraction, automated routing rules, batch scanning
- You handle high volumes of incoming faxes and need automated fax-to-chart routing

**Consider outsourced scanning services if:**
- You have a massive paper chart backlog (5,000+ charts) and limited staff to scan
- You are consolidating records from multiple acquired practices
- You want a one-time project completed quickly

## Order of Operations

1. **Assess incoming document volume and types** (1 week): Catalog the types and volumes of documents flowing into your practice — faxes, mail, patient-provided documents, electronic documents from external systems.
2. **Evaluate EHR document management capabilities** (1 week): Test your EHR's scanning, importing, indexing, and routing tools. Identify gaps.
3. **Design document workflow** (2 weeks): For each document type, define: how it arrives, who scans/imports it, what metadata is captured (document type, date, provider), who reviews it, and where it is filed in the chart.
4. **Select scanning hardware** (1 week): Choose a document scanner appropriate for your volume. Desktop scanners ($300-800) for low volume, departmental scanners ($1,000-3,000) for moderate volume, production scanners ($3,000-10,000+) for high volume or bulk scanning projects.
5. **Configure document types and routing** (2-3 weeks): Set up document type categories in the EHR (lab report, consultation, hospital record, insurance, legal, imaging, correspondence). Configure routing rules (e.g., all documents tagged "lab" route to the ordering provider's inbox).
6. **Establish indexing standards** (1 week): Create a document naming and indexing standard that all staff follow. Consistency in document type classification is critical for retrieval.
7. **Train staff** (1 week): Train scanning, indexing, and routing workflows. Emphasize the importance of correct patient matching (scanning a document into the wrong chart is a serious error).
8. **Address paper chart backlog** (variable): If applicable, develop a plan for historical paper charts — scan on demand (when patient has an upcoming appointment), scan proactively (batch scanning project), or summarize key data and scan selectively.
9. **Integrate cloud fax** (1-2 weeks): If using cloud fax (SRFax, mFax, eFax), configure direct routing of incoming faxes to the EHR document management module. This eliminates the print-scan cycle.
10. **Ongoing management** (continuous): Monitor document queues daily. Unrouted or unreviewed documents should be escalated. Run monthly audits on indexing accuracy and document completion.

## Options by Practice Size

### Small Practice (1-3 Providers)

Keep it simple. Use your EHR's built-in document management with a basic desktop scanner.

- **Scanner**: Fujitsu ScanSnap iX1600 ($350-450) or Brother ADS-2700W ($300-400). These desktop scanners handle 25-35 pages per minute with duplex scanning and are more than adequate for a small practice.
- **EHR document module**: Configure document types, enable cloud fax integration if available, and establish a simple workflow: scan/import, index (patient + document type + date), route to provider inbox for review.
- **Cloud fax integration**: Route incoming faxes directly to your EHR as unindexed documents, eliminating paper printing of faxes. (See the Fax document for more detail.)
- **Budget**: $300-500 for scanner, $0-100/month for cloud fax integration, staff time for workflow setup.

### Medium Practice (4-15 Providers)

Higher volume requires more organized workflow and potentially a dedicated scanning station.

- **Scanner**: Fujitsu fi-8170 ($800-1,200) or Canon imageFORMULA DR-M260 ($900-1,300). Departmental-grade scanners with 60+ page-per-minute speed, larger feeders, and better durability for daily use.
- **Dedicated scanning role**: Assign document scanning and indexing to a specific staff member or role (often front desk or medical records). At 100+ documents/day, this can consume 2-4 hours of staff time.
- **Cloud fax with auto-routing**: Use a cloud fax solution that auto-routes incoming faxes to patient charts based on cover sheet data or manual indexing. mFax and SRFax offer EHR integrations for this purpose.
- **OCR capability**: Enable OCR on scanned documents so that text within scanned images is searchable. Many scanners and some EHR document modules include OCR.
- **Budget**: $800-1,500 for scanner(s), $100-300/month for cloud fax, $0-500/month for additional document management tools if needed.

### Large Practice (15+ Providers)

High-volume document handling may justify a standalone DMS or advanced document workflow automation.

- **Production scanner**: Fujitsu fi-7900 ($5,000-8,000) or Kodak Alaris S3100 ($4,000-6,000) for bulk scanning. Multiple scanning stations across locations.
- **Standalone DMS**: Consider platforms like Hyland OnBase, DocuWare, or Laserfiche that provide advanced document management with automated classification, OCR, workflow routing, and retention management. These integrate with EHRs via API or HL7.
- **Intelligent document recognition**: Advanced OCR/ICR that can automatically identify document types, extract patient identifiers, and route documents to the correct chart with minimal human intervention. Vendors like ABBYY, Kofax (Tungsten Automation), and Hyland offer healthcare-specific document recognition.
- **Outsourced scanning for backlog**: If consolidating practices or digitizing a large paper archive, use a medical records scanning service. Costs typically run $0.08-0.15 per page, plus indexing ($0.03-0.10 per page). A 10,000-chart backlog might cost $15,000-50,000 to scan and index professionally.
- **Budget**: $5,000-20,000 for scanning hardware, $500-3,000/month for DMS platform, $15,000-50,000+ for backlog scanning projects.

## Options Analysis

### EHR-Integrated Document Management

**Examples**: athenahealth document management, Epic Scan and Attach, NextGen document management

- **Pros**: No additional system to manage, documents are directly in the clinical chart, single search interface, included in EHR cost.
- **Cons**: Features may be basic (limited OCR, simple routing, minimal automation), scanning interface may be clunky, limited workflow customization.
- **Typical cost**: Included in EHR subscription.
- **Best for**: Small to medium practices with moderate document volumes.

### Standalone Document Management System

**Examples**: Hyland OnBase, DocuWare, Laserfiche, M-Files

- **Pros**: Advanced features (OCR, ICR, workflow automation, retention management), handles high volumes efficiently, can serve enterprise document needs beyond clinical (HR, contracts, compliance).
- **Cons**: Additional system and vendor to manage, requires EHR integration, higher cost, more complex implementation.
- **Typical cost**: $500-3,000/month for cloud-based, or $10,000-50,000+ license for on-premise plus annual maintenance.
- **Best for**: Large practices with high document volumes or complex document workflow requirements.

### Outsourced Scanning Services

**Examples**: Iron Mountain, Access Information Management, local medical records scanning companies

- **Pros**: Fast turnaround for large backlog projects, professional scanning quality, frees staff from scanning duties.
- **Cons**: Cost per page adds up for large volumes, chain-of-custody considerations (HIPAA), quality depends on vendor, must still index/import into EHR.
- **Typical cost**: $0.08-0.25 per page including scanning and basic indexing.
- **Best for**: One-time or periodic bulk scanning projects (practice acquisitions, historical chart conversion).

### Hybrid Approach

Most practices end up with a hybrid: EHR-integrated document management for day-to-day scanning and importing, cloud fax for incoming fax documents, and outsourced scanning for any large backlog projects. This is the most practical approach for the majority of practices.

## Vendor Landscape

### Scanners

| Vendor/Model | Type | Speed | Best For | Cost |
|-------------|------|-------|----------|------|
| **Fujitsu ScanSnap iX1600** | Desktop | 40 ppm | Small practice, front desk | $350-450 |
| **Brother ADS-4900W** | Desktop/workgroup | 60 ppm | Medium practice | $600-800 |
| **Fujitsu fi-8170** | Departmental | 70 ppm | Medium to large practice | $800-1,200 |
| **Canon DR-M260** | Departmental | 60 ppm | Medium practice | $900-1,300 |
| **Kodak Alaris S3060** | Production | 60 ppm | Large practice, bulk projects | $3,000-5,000 |

### Document Management Platforms

| Platform | Type | Strengths | Cost |
|----------|------|-----------|------|
| **Hyland OnBase** | Enterprise DMS | Healthcare-specific, robust, widely used in health systems | $1,000-5,000/month |
| **DocuWare** | Cloud DMS | Good SMB solution, workflow automation | $300-1,000/month |
| **Laserfiche** | Enterprise DMS | Strong government/healthcare presence, good automation | $500-2,000/month |
| **M-Files** | AI-powered DMS | Intelligent metadata classification | $500-1,500/month |
| **EHR-integrated modules** | Built-in | No additional system, seamless chart integration | Included in EHR |

## Compliance & Regulatory Notes

- **HIPAA Security Rule**: Scanned documents containing PHI must be stored with appropriate access controls, encryption, and audit logging. Physical scanning stations should be positioned to prevent unauthorized viewing of documents during scanning.
- **Medical records retention**: State laws govern how long you must retain medical records (typically 7-10 years for adults from the last encounter, longer for minors — often until age 21 plus the state's standard retention period). Your document management system must support retention periods and prevent premature deletion.
- **Chain of custody**: When using outsourced scanning services, ensure the vendor signs a BAA and has appropriate security certifications (SOC 2 is ideal). Documents containing PHI must be tracked during transport and scanning, and destroyed after successful digitization (with attestation).
- **Document integrity**: Scanned documents should be stored in a format that prevents unauthorized alteration (PDF/A is the recommended archival format). Your DMS or EHR should log all document access and modifications.
- **Original document disposition**: Once paper documents are scanned and verified, you need a policy for retaining or destroying the originals. Some states require retaining original documents for a period after scanning. Consult your state medical board and legal counsel. Many practices retain originals for 30-90 days after scanning as a safety net, then shred them.
- **Patient access**: Under the 21st Century Cures Act, patients have the right to access their medical records, including scanned documents. Your patient portal or records release process must include scanned documents.
- **Legal admissibility**: Scanned medical records are generally legally admissible in most jurisdictions, provided you can demonstrate a consistent scanning process, quality verification, and chain-of-custody procedures. Document your scanning policies and procedures in writing.

## Common Mistakes

1. **Scanning documents into the wrong patient chart**: This is a patient safety issue. Implement a verification step — the scanner operator should verify the patient name and date of birth on the document against the chart they are scanning into. Use barcode label sheets printed from the EHR and placed on documents before scanning to automate patient matching where possible.
2. **Inconsistent document type classification**: If one staff member indexes a consultation report as "letter" and another indexes it as "consultation," documents become hard to find. Create a standardized document type list and train all staff to use it consistently.
3. **Not routing documents for provider review**: Scanning a document into the chart is not sufficient — someone must review it. Consultation reports, hospital records, and abnormal results must be routed to a provider's inbox for review and action. Unreviewed documents represent unaddressed clinical information and significant liability.
4. **Scanning everything at maximum resolution**: Scanning at 600 dpi color when 300 dpi black-and-white is sufficient wastes storage space and slows scanning. Use 300 dpi black-and-white for text documents, 300 dpi color for documents with color-significant content (photographs, highlighted annotations).
5. **No process for document queue management**: Incoming documents queue up in fax inboxes, email, and physical trays. Without a defined workflow and responsible individual, queues grow indefinitely. Assign a document queue owner and set a standard: all incoming documents scanned, indexed, and routed within 24 hours.
6. **Ignoring cloud fax integration**: Practices that print incoming faxes and then re-scan them into the EHR are performing unnecessary double handling. Cloud fax solutions deliver incoming faxes directly as electronic images that can be imported into the EHR without printing.
7. **Deferring paper chart backlog indefinitely**: Practices that converted from paper to EHR often have thousands of paper charts in storage. The common plan of "we'll scan them as patients come in" works slowly but leads to years of dual systems. Make a conscious decision: scan on demand, batch scan proactively, or accept that legacy paper charts will be accessed from physical storage (with appropriate retention and eventually destruction policies).
8. **Not enabling OCR**: Scanned documents without OCR are just images — you cannot search the text within them. Most modern scanners and many EHR document modules support OCR. Enable it by default so that scanned document content is text-searchable.

## Recommended Implementation Timeline

### Document Management Setup (with New EHR)

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Document workflow design | 1-2 weeks | Define document types, routing rules, responsibilities |
| Scanner procurement and setup | 1-2 weeks | Purchase, install, configure scanning software/drivers |
| EHR document module configuration | 1-2 weeks | Create document types, routing rules, user permissions |
| Cloud fax integration | 1-2 weeks | Connect cloud fax to EHR document module |
| Staff training | 1 week | Scanning, indexing, routing, quality checks |
| Go-live | With EHR go-live | Begin scanning and importing live documents |
| Backlog scanning project (if applicable) | 4-16 weeks | Batch scanning of historical charts — can extend beyond go-live |
| **Total** | **4-8 weeks** (excluding backlog) | |

### Standalone DMS Implementation

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Vendor selection | 3-4 weeks | Evaluate platforms, check EHR integration |
| EHR integration | 4-6 weeks | API or HL7 integration for document attachment |
| Configuration | 2-4 weeks | Document types, workflows, retention rules, OCR setup |
| Hardware setup | 1-2 weeks | Scanners, workstations, network configuration |
| Staff training | 1-2 weeks | New workflows, system usage |
| Pilot | 2-4 weeks | Single location or department |
| Full rollout | 2-4 weeks | All locations |
| **Total** | **12-20 weeks** | |

**Practical tip**: Document management is unglamorous but essential. It rarely gets the attention it deserves during EHR implementation because it does not seem as urgent as clinical workflows, billing, or prescribing. Resist this tendency — a well-designed document workflow from day one prevents a growing backlog of unprocessed documents that eventually becomes an unmanageable problem and a clinical liability.
