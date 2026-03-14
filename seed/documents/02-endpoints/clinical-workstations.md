# Clinical Workstations & Displays

## What Is This?

Clinical workstations are the computers used by physicians, nurse practitioners, physician assistants, and nurses in exam rooms, provider offices, and nursing stations to access the EHR, review lab results, place orders, write prescriptions, document encounters, and conduct telehealth visits. The "workstation" encompasses the computer itself (desktop, mini PC, all-in-one, or thin client), one or two monitors, a keyboard, a mouse, and potentially a webcam and headset for telehealth.

In primary care, the clinical workstation is where providers spend 50-70% of their working day. The quality, speed, and ergonomic configuration of these machines directly impacts provider satisfaction, documentation efficiency, and ultimately patient throughput. A slow workstation that takes 8 seconds to load a patient chart instead of 2 seconds costs a provider 20-30 minutes per day in accumulated wait time -- time that could be spent with patients.

Displays are equally important. Dual-monitor setups have become the standard in primary care because clinicians need to view the patient chart on one screen while entering orders, viewing imaging, or referencing clinical decision support on the other. Medical-grade displays (meeting DICOM standards) are necessary only for diagnostic imaging interpretation, which most primary care practices refer out. Standard commercial-grade IPS displays are appropriate for the vast majority of primary care EHR use.

## Why Does a Primary Care Practice Need This?

Every clinical provider needs a workstation wherever they see patients or document care. The typical primary care practice needs workstations in:

- **Each exam room** (the most critical location -- this is where chart review, documentation, order entry, and e-prescribing happen)
- **Provider offices** (for inbox management, result review, patient messaging, and administrative work between patients)
- **Nursing stations** (for vital signs entry, medication administration documentation, and triage)
- **Lab/procedure areas** (for specimen labeling, POCT result entry, and procedure documentation)

The form factor of the workstation matters. Exam rooms are space-constrained, and a traditional tower desktop with a separate monitor takes up valuable counter or desk space. Mini PCs (Intel NUC, Lenovo ThinkCentre Tiny, Dell OptiPlex Micro) or all-in-one computers offer a much smaller footprint. Thin clients (devices that connect to a remote desktop session on a server) offer the smallest footprint and easiest management, but require server infrastructure to support them.

Display quality and size directly affect provider ergonomics and satisfaction. Too-small monitors (under 22 inches) force providers to squint at dense EHR interfaces. Too-large monitors (over 27 inches) in a small exam room create viewing distance problems. The sweet spot for most exam room setups is 23-24 inch IPS displays, ideally two of them mounted on adjustable arms.

## How to Decide If You Need It

Every practice needs clinical workstations -- the decision is about form factor, quantity, and display configuration.

**How many workstations?** Count: one per exam room + one per provider office + one per nursing station + one per lab area + 10-15% spare inventory for rapid replacement. A five-provider practice with ten exam rooms, five offices, two nursing stations, and one lab needs approximately 18-20 workstations.

**Dual monitors?** In nearly all cases, yes. The productivity gain from dual monitors is well-documented in healthcare IT literature. The exception is very small exam rooms where a single 27-inch monitor may be preferable to two 23-inch monitors due to space constraints.

**Mini PC vs. AIO vs. Thin Client?**
- Choose **mini PCs** if you want local processing power, flexibility in monitor choice, and straightforward management. This is the most common choice for primary care.
- Choose **all-in-ones** if you want the cleanest possible appearance with the fewest cables. Trade-off: if the display fails, the whole unit goes to the shop; if the computer fails, you lose the display too.
- Choose **thin clients** if you have (or plan to deploy) VDI infrastructure (Citrix, VMware Horizon, Microsoft AVD). Trade-offs: requires server infrastructure, depends on network reliability, but offers centralized management and security advantages.

## Order of Operations

1. **Assess workstation count** by mapping every clinical location where a computer is needed.
2. **Determine form factor** based on physical space, IT infrastructure, and management preferences.
3. **Standardize on a single vendor and model** wherever possible. Managing five different PC models from three vendors is a support nightmare.
4. **Specify displays** -- 23-24 inch IPS panels, VESA-mountable, with monitor arms for exam rooms.
5. **Plan mounting and cable management** -- wall-mounted monitor arms with integrated cable channels keep counters clear and prevent infection control issues.
6. **Order and stage** -- build a standard image, install the EHR client, configure printers, and test before deploying to exam rooms.
7. **Deploy during off-hours** to avoid disrupting patient care.
8. **Establish a spare pool** -- keep 2-3 pre-imaged workstations ready for immediate swap if a unit fails during clinic hours.

## Options by Practice Size

**Solo / 1-2 Providers (4-8 workstations):**
- Dell OptiPlex Micro 7020 or Lenovo ThinkCentre M75q Tiny ($600-900 each)
- Intel Core i5 / AMD Ryzen 5, 16 GB RAM, 256 GB NVMe SSD
- Dell P2422H or HP E24 G5 23.8" IPS monitors ($180-250 each, two per station)
- Ergotron LX dual monitor arm ($250-350 per station)
- Webcam: Logitech C920s or C930e ($70-100)
- Per-station total: $1,300-2,000
- Practice total: $5,200-16,000

**Small Group / 3-5 Providers (12-20 workstations):**
- Same hardware as above, but consider Dell ProSupport Plus or Lenovo Premier Support for next-business-day on-site service ($50-100/unit/year)
- Volume pricing from Dell or Lenovo typically yields 5-10% discount
- Per-station total: $1,300-2,000
- Practice total: $15,600-40,000

**Medium Group / 6-15 Providers (25-60 workstations):**
- Consider thin clients if you have VDI infrastructure: Dell Wyse 5070 or HP t640 ($300-500 each)
- VDI server infrastructure adds $15,000-40,000 but reduces per-endpoint management burden
- Or continue with mini PCs at scale with enterprise imaging tools (SCCM, PDQ Deploy, Intune)
- Per-station total: $800-2,000 (thin client) or $1,300-2,000 (mini PC)
- Practice total: $20,000-120,000

## Options Analysis

| Option | Pros | Cons | Cost/Station | Best For |
|--------|------|------|-------------|----------|
| **Mini PC + Dual Monitors** | Flexible, powerful, independent monitor replacement, easy to swap | More cables, requires local management, takes counter space | $1,300-2,000 | Most primary care practices |
| **All-in-One (AIO)** | Clean appearance, fewer cables, integrated webcam | Entire unit replaced if display or PC fails, limited upgradeability, often overpriced | $1,200-2,500 | Practices prioritizing aesthetics |
| **Thin Client + Dual Monitors** | Centralized management, long lifespan (7-10 years), small/silent/cool, enhanced security | Requires VDI server infrastructure, network dependency, upfront infrastructure cost | $800-1,500 + VDI infrastructure | Medium-large practices with IT staff |
| **Standard Desktop Tower** | Maximum expandability, easy to service, lowest cost | Large footprint, noise, poor fit for exam rooms | $800-1,400 | Provider offices and back-office only |
| **Laptop + Docking Station** | Portable, providers can work from home, single device | Smaller screen when undocked, theft risk, higher cost, more fragile | $1,500-2,500 | Providers who split time between locations |

**Display Recommendations:**
- **Standard clinical use (EHR, charting):** 23-24 inch IPS, 1920x1080 (Full HD). Dell P2422H, HP E24 G5, Lenovo ThinkVision T24i. $180-250 each.
- **Enhanced clinical use (some imaging review):** 24-27 inch IPS, 2560x1440 (QHD). Dell P2723QE, HP E27 G5. $300-450 each. Useful if providers review X-rays or ultrasound images in the EHR but do not make primary diagnostic reads.
- **Diagnostic imaging (rare in primary care):** DICOM-calibrated medical displays from Barco, EIZO, or Sony. $1,500-5,000+ each. Only needed if your providers make primary diagnostic reads on imaging.

## Vendor Landscape

**Computer Hardware:**
- **Dell** (OptiPlex Micro/Small Form Factor, Latitude laptops): Most popular in healthcare SMB. Strong ProSupport warranty program. EPEAT Gold certification for healthcare procurement requirements.
- **HP** (ProDesk Mini, EliteDesk): Comparable to Dell. HP Care Pack warranty. Strong in enterprise healthcare.
- **Lenovo** (ThinkCentre Tiny/Small, ThinkPad laptops): Often 5-10% less expensive than Dell/HP for equivalent specs. ThinkPad keyboards widely regarded as superior. Reliable Premier Support.
- **Apple** (Mac Mini, iMac): Viable only if your EHR has a native macOS client or is fully web-based. Most EHR vendors do not support macOS natively. Mac Mini M-series is excellent hardware but compatibility is the barrier.

**Monitor Arms:**
- **Ergotron** (LX series): Industry standard for healthcare. Medical-grade versions available with antimicrobial coating. $250-400 per dual arm.
- **Humanscale** (M8, M/Connect): Premium quality, excellent cable management. $300-500.
- **AmazonBasics / Vivo**: Budget options ($30-80) that work adequately for non-height-adjustable installations. Not recommended for exam rooms where frequent adjustment is needed.

**Thin Client / VDI:**
- **Citrix Virtual Apps and Desktops**: Market leader in healthcare VDI. Strong Epic/Cerner ecosystem.
- **VMware Horizon**: Enterprise-grade, strong security features.
- **Microsoft Azure Virtual Desktop (AVD)**: Cloud-hosted VDI, no on-prem server needed, growing rapidly.

## Compliance & Regulatory Notes

- **Automatic screen lock** (45 CFR 164.312(a)(2)(iii)): Workstations must lock after a period of inactivity. Standard in healthcare is 5-10 minutes. Configure via Group Policy or MDM.
- **Workstation security** (45 CFR 164.310(c)): Physical safeguards to prevent unauthorized access. Cable locks in public areas, screen privacy filters in locations visible to non-staff, and positioning monitors so patient data is not visible to other patients.
- **Workstation use policy** (45 CFR 164.310(b)): Written policies specifying who can access workstations, prohibited activities (personal use, USB drives), and handling of workstation in shared spaces.
- **Encryption** (45 CFR 164.312(a)(2)(iv)): Full disk encryption (BitLocker for Windows, FileVault for macOS) on all workstations. This is especially critical for laptops that may leave the premises.
- **Privacy screens**: Not a HIPAA requirement per se, but a reasonable and inexpensive safeguard. 3M privacy filters ($30-50 per monitor) are standard in exam rooms where patients or visitors might see other patients' data.

## Common Mistakes

1. **Buying consumer-grade PCs.** Consumer PCs (Dell Inspiron, HP Pavilion) come with consumer-grade warranties (mail-in, 1 year), consumer-grade components (non-ECC RAM, lower-quality capacitors), and Windows Home (which cannot join a domain). Business-class PCs cost $100-200 more and last 2 years longer.
2. **Undersizing RAM.** 8 GB was adequate in 2018. Modern EHR clients running in Chrome alongside other clinical applications (e-prescribing, PDMP, lab portals) routinely consume 10-12 GB. Specify 16 GB minimum; 32 GB for workstations running heavy imaging or reporting workloads.
3. **Single monitors in exam rooms.** The productivity cost of constant window-switching on a single monitor is substantial. Dual monitors are a $200-400 investment per station that pays for itself within weeks in provider time savings.
4. **No monitor arms.** Monitors sitting on a desk/counter take up valuable workspace and cannot be positioned ergonomically. Wall-mounted or desk-clamp monitor arms free the counter and allow providers to adjust viewing angle and height. This is an ergonomic and infection control issue -- countertops are easier to clean without monitor stands.
5. **No standardization.** Maintaining five different PC models with different driver sets, BIOS versions, and hardware configurations multiplies support burden. Standardize on one model and buy in batches.
6. **No spare inventory.** When a workstation fails during a clinic session, the provider cannot see patients until it is replaced. Keep 2-3 pre-imaged spares on site for immediate hot-swap. The failed unit goes to the bench; the spare is deployed in under 10 minutes.
7. **Ignoring webcams for telehealth.** Telehealth is not going away. Every exam room workstation should have a quality webcam (Logitech C920s or better) and a decent headset, even if telehealth is not used today.

## Recommended Implementation Timeline

**Weeks 1-2: Planning**
- Count workstation locations and map cable/power requirements
- Select form factor, vendor, and model
- Specify display size and mounting hardware
- Obtain quotes and place orders

**Weeks 3-5: Procurement and Staging**
- Receive hardware (typical lead time 1-3 weeks for standard configurations)
- Build standard OS image with EHR client, printers, and configurations
- Image all workstations and perform burn-in testing (run for 48 hours under load)
- Label each unit with asset tag and assigned location

**Weeks 6-7: Deployment**
- Install monitor arms and cable management in exam rooms (can be done during regular hours if rooms are rotated)
- Deploy workstations during evening/weekend to avoid disrupting patient care
- Connect peripherals (keyboard, mouse, webcam, badge reader)
- Test EHR access, printing, and clinical device connectivity at each station

**Week 8: Validation and Training**
- Have each provider and clinical staff member test their workstation during a non-patient session
- Adjust monitor arm positions, configure display preferences, verify dual-monitor layout
- Place spare workstations in the IT closet with deployment instructions for on-site staff

**Ongoing:**
- Monthly: Windows updates (schedule during off-hours)
- Annually: Review workstation performance, plan replacements for units approaching 5-year mark
- Hardware refresh cycle: 4-5 years for mini PCs/desktops, 7-10 years for thin clients
