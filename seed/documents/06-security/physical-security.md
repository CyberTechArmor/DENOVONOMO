# Physical Security (Cameras, Access Control)

## What Is This?

Physical security in a healthcare environment encompasses the technologies, policies, and procedures that protect the physical infrastructure, equipment, and spaces where protected health information (PHI) exists and patient care occurs. For a primary care practice, this includes video surveillance, electronic access control systems, server room and network closet security, workstation positioning and protection, medication storage security, and visitor management.

The HIPAA Security Rule explicitly addresses physical safeguards in 45 CFR 164.310, requiring covered entities to implement policies and procedures to limit physical access to electronic information systems and the facilities in which they are housed, while ensuring that properly authorized access is allowed. The physical safeguards standard includes four categories:

- **Facility Access Controls (164.310(a)(1))**: Policies and procedures to limit physical access to electronic information systems. This includes addressable specifications for contingency operations, facility security plan, access control and validation procedures, and maintenance records.
- **Workstation Use (164.310(b))**: Policies and procedures that specify the proper functions to be performed and the physical attributes of the surroundings of a workstation that accesses ePHI. This includes screen positioning to prevent unauthorized viewing and workstation placement in secure areas.
- **Workstation Security (164.310(c))**: Physical safeguards for all workstations that access ePHI, to restrict access to authorized users. This includes cable locks, secured areas, and automatic screen locks.
- **Device and Media Controls (164.310(d)(1))**: Policies and procedures governing the receipt and removal of hardware and electronic media containing ePHI. This includes disposal, media re-use, accountability, and data backup and storage.

Physical security also serves broader purposes beyond HIPAA compliance: protecting controlled substances (DEA requirements), ensuring employee and patient safety (OSHA), deterring theft and vandalism, and providing evidence for investigations. For primary care practices, physical security must balance accessibility (patients need to enter freely during business hours) with protection (unauthorized individuals should not access clinical areas, medication storage, or IT infrastructure).

## Why Does a Primary Care Practice Need This?

Physical security breaches in primary care settings are more common than most practice leaders recognize. They range from petty theft of equipment to targeted theft of prescription pads, controlled substances, and devices containing ePHI. A stolen laptop without encryption can trigger a HIPAA breach notification affecting thousands of patients. An unsecured server closet can allow an unauthorized individual to access the physical infrastructure supporting your entire practice.

Specific risks that physical security addresses in primary care:

- **Device theft**: Laptops, tablets, and mobile devices are valuable and portable. If they contain unencrypted ePHI, theft triggers breach notification requirements. OCR has settled multiple cases involving stolen unencrypted devices, including a $1.5 million settlement with a cancer care group and a $3.9 million settlement with a health system, both involving stolen laptops.
- **Unauthorized facility access**: After-hours break-ins, tailgating into secure areas, and unauthorized individuals wandering into clinical or administrative spaces all create risk for data theft, medication theft, and patient safety.
- **Workplace violence**: Healthcare workers experience workplace violence at rates four times higher than workers in other industries (BLS data). Cameras, access control, and panic buttons contribute to staff safety.
- **Controlled substance security**: DEA regulations require specific physical security measures for controlled substances. Cameras and access control support compliance and deter diversion.
- **Visitor and patient safety**: Monitoring common areas helps prevent incidents and provides evidence when they occur. Custody disputes, restraining order violations, and disruptive patients are realities of primary care.

## How to Decide If You Need It

Every practice needs physical security. The question is what level of investment matches your risk profile. Consider these factors:

- **Location and crime environment**: Practices in high-crime areas or isolated locations need more robust physical security.
- **Operating hours**: Practices operating evening or weekend hours, or in shared buildings with other tenants, face different risks than standard 8-5 operations.
- **Controlled substance volume**: Practices prescribing or dispensing controlled substances need enhanced physical security for DEA compliance.
- **Current incidents**: If you have experienced theft, break-ins, workplace violence, or unauthorized access, your current physical security is insufficient.
- **Building ownership vs. lease**: Owned buildings offer more flexibility for security investments. Leased spaces may require landlord coordination and may have existing building security to leverage.
- **IT infrastructure location**: On-premise servers and network equipment need physical protection. Cloud-based practices have less physical IT infrastructure to protect but still need to secure workstations and network equipment.

## Order of Operations

1. **Conduct a physical security assessment** (Weeks 1-2): Walk through your facility systematically. Identify all entry points, ePHI locations, IT infrastructure locations, medication storage, and areas with privacy concerns. Note current controls and gaps.
2. **Address immediate high-risk gaps** (Weeks 2-4): Install locks on server closets, secure workstations, ensure doors to clinical and administrative areas lock properly.
3. **Deploy video surveillance** (Weeks 4-8): Install cameras at entry/exit points, parking areas, medication storage, server rooms, and common areas. Avoid cameras in patient care areas where privacy is expected.
4. **Implement electronic access control** (Weeks 6-12): Replace or supplement key-based locks with electronic access control for sensitive areas. This provides audit trails of who accessed what areas and when.
5. **Configure workstation security** (Weeks 4-8): Implement cable locks for portable equipment, position screens away from public view, install privacy screens where needed.
6. **Develop policies and procedures** (Weeks 8-12): Document facility access policies, visitor management procedures, device handling rules, and incident response procedures.
7. **Train workforce** (Weeks 10-14): Train all staff on physical security procedures including visitor management, tailgating prevention, device security, and incident reporting.
8. **Implement ongoing monitoring** (Month 4+): Regularly review access logs and camera footage (or at minimum, ensure they are retained). Conduct periodic walkthroughs. Update policies as the environment changes.

## Options by Practice Size

### Small Practice (1-3 Providers)

- **Budget**: $2,000-$10,000 initial; $50-$200/month ongoing.
- **Cameras**: 4-8 cameras covering entries/exits, reception, parking, and server closet. Ubiquiti Protect (UniFi cameras) offers excellent value at $150-$400/camera with no monthly fees (NVR required, $300-$500). Alternatively, cloud-managed Verkada starts at $200-$400/camera plus $100-$200/camera/year for licensing.
- **Access control**: Smart locks on server closet and medication storage at minimum. Schlage or Yale commercial smart locks ($200-$400 each) with code management. Full access control system may not be justified at this scale.
- **Workstation security**: Cable locks ($30-$50 each), privacy screens ($30-$80 each), automatic screen lock policy.
- **Recommendation**: Ubiquiti Protect cameras for cost-effective self-managed surveillance plus smart locks on critical areas. Focus on the basics: lock the server closet, secure devices, position screens properly.

### Medium Practice (4-15 Providers)

- **Budget**: $10,000-$50,000 initial; $200-$1,000/month ongoing.
- **Cameras**: 12-30 cameras. Verkada provides excellent cloud-managed surveillance with good healthcare features (people detection, license plate recognition, environmental sensors). $200-$600/camera plus $100-$200/camera/year. Alternatively, Ubiquiti Protect at larger scale with dedicated NVR.
- **Access control**: Electronic access control on external doors and sensitive internal areas (medication rooms, server rooms, records storage). Consider Verkada Access Control for integration with cameras, Openpath (Motorola), or Kisi ($5-$10/door/month cloud-managed plus $500-$1,500/door hardware).
- **Workstation security**: Cable locks, privacy screens, secure mounting for tablets and workstations in exam rooms.
- **Visitor management**: Digital visitor management system like Envoy ($100-$300/month) or SwipedOn for patient-facing environments.
- **Recommendation**: Verkada for integrated camera and access control with cloud management, reducing the need for local infrastructure and IT management. Implement card-based or mobile-based access control for all staff with audit logging.

### Large Practice (15+ Providers)

- **Budget**: $50,000-$200,000 initial; $1,000-$5,000/month ongoing.
- **Cameras**: 30-100+ cameras with analytics. Enterprise solutions from Verkada, Milestone (on-premise VMS), or Genetec. Consider AI-powered analytics for proactive alerting.
- **Access control**: Enterprise access control system covering all exterior and interior sensitive areas. Integration with HR systems for automated provisioning/deprovisioning. Visitor management integrated with access control. Consider biometric access for highest-security areas (server rooms, pharmacy).
- **Environmental monitoring**: Temperature and humidity monitoring for server rooms, medication storage, and vaccine refrigerators. Integrated with alerting systems.
- **Security operations**: Consider a monitored alarm system with 24/7 central station monitoring. Integrate cameras with alarm system for visual verification.
- **Recommendation**: Comprehensive physical security program managed by a security integrator. Integrate physical access control with logical access management (badge tap for computer login using Imprivata or similar). Multi-site management from a single platform.

## Options Analysis

### Cloud-Managed Solutions

Modern cloud-managed physical security platforms that provide cameras, access control, and environmental monitoring from a single dashboard.

- **Verkada**: Cloud-managed cameras and access control with on-device processing, cloud storage, and centralized management. No NVR/DVR required. Strong in healthcare market. Cameras $200-$600 each plus $100-$200/camera/year licensing. Access control $500-$1,500/door plus $100-$200/door/year.
- **Rhombus**: Cloud-managed cameras with AI analytics. Growing competitor to Verkada. $200-$500/camera plus monthly licensing.
- **Eagle Eye Networks**: Cloud-based VMS that works with existing camera hardware. Good for practices wanting to keep existing cameras. $10-$30/camera/month.

**Pros**: No local server infrastructure, remote management, automatic updates, scalable, professional monitoring options, AI analytics.
**Cons**: Ongoing subscription costs, dependent on internet connectivity, data sovereignty considerations, vendor lock-in.

### On-Premise Solutions

Traditional on-premise camera systems with local recording and management.

- **Ubiquiti Protect**: Excellent value prosumer/small business platform. High-quality cameras ($150-$400 each) with local NVR ($300-$2,000). No monthly fees. Good mobile app. Limited to Ubiquiti ecosystem.
- **Hikvision**: Large range of cameras at low price points ($50-$300 each). Requires NVR. Some security concerns about Chinese government connections have led to federal procurement bans, though private sector use continues.
- **Axis Communications**: Premium on-premise cameras known for image quality and reliability. $300-$1,500 per camera. Often paired with Milestone VMS.
- **Milestone XProtect**: Enterprise video management software for on-premise deployments. Supports multi-vendor cameras. Free version for up to 8 cameras; commercial versions start at $50/camera.

**Pros**: No monthly fees (after initial purchase), full local control, no internet dependency for local recording, potentially lower long-term cost.
**Cons**: Requires local infrastructure (NVR, storage, network), IT management burden, manual updates, limited remote access without additional configuration, capacity planning required.

### Access Control Systems

- **Openpath (Motorola)**: Cloud-managed access control with mobile credentials and key cards. Good for multi-site practices. $5-$15/door/month.
- **Kisi**: Cloud-managed access control designed for modern workplaces. $5-$10/door/month plus hardware.
- **Brivo**: Cloud-managed access control with strong integration ecosystem. $10-$20/door/month.
- **Verkada Access Control**: Integrated with Verkada cameras. Single management platform. Pricing bundled with camera licensing.
- **Traditional systems (Lenel, S2, AMAG)**: Enterprise on-premise access control systems. Higher cost, requires local management, but fully featured for large deployments.

**Pros** (cloud-managed): Audit trails, remote management, integration with identity management, mobile credentials, scalable.
**Cons**: Monthly costs, dependent on internet, hardware investment, installation requires professional integrator.

### Managed Security Services

Engaging a security integrator or managed security company to design, install, and monitor your physical security.

- **Pros**: Professional design, proper installation, 24/7 monitoring available, maintenance included, compliance expertise.
- **Cons**: Most expensive option, potential for over-engineering, monthly monitoring fees, equipment may be leased rather than owned.
- **Cost**: $1,000-$5,000/month for managed services plus equipment costs.
- **Best for**: Large practices and multi-site operations requiring professional-grade physical security.

## Vendor Landscape

**Camera Systems:**
- **Verkada**: Cloud-native. Strong healthcare market presence. Excellent management interface. Premium pricing. $200-$600/camera + $100-$200/camera/year.
- **Ubiquiti Protect**: Best value for self-managed. Excellent image quality. No monthly fees. Requires UniFi ecosystem. $150-$400/camera + $300-$2,000 NVR.
- **Hikvision**: Lowest price point. Wide range of cameras. Federal procurement ban (private sector OK). Potential supply chain risk concerns. $50-$300/camera.
- **Axis Communications**: Premium quality and reliability. On-premise focused. Strong integrator ecosystem. $300-$1,500/camera.
- **Rhombus**: Cloud-managed competitor to Verkada. Growing market share. $200-$500/camera + monthly licensing.

**Access Control:**
- **Verkada Access Control**: Best choice if using Verkada cameras (unified platform). Cloud-managed.
- **Openpath (Motorola)**: Strong cloud-managed option. Good mobile credential experience. Growing healthcare adoption.
- **Kisi**: Modern, developer-friendly. Good API. Popular with technology-forward organizations.
- **Brivo**: Established cloud access control player. Large integrator network.

**Integrated Security:**
- **ADT Commercial/Everon**: Large-scale security integrator with healthcare experience. Design, install, and monitor.
- **Securitas**: Global security company with technology integration services.
- **Local security integrators**: Often provide the best service for small-medium practices. Look for healthcare experience and manufacturer certifications.

## Compliance & Regulatory Notes

- **HIPAA Physical Safeguards**: 164.310 requires facility access controls, workstation use and security policies, and device/media controls. Documentation of physical safeguard policies must be retained for six years.
- **Camera placement and privacy**: Do not place cameras in examination rooms, restrooms, or any area where patients have a reasonable expectation of privacy. Common areas, entrances, hallways, and exterior areas are appropriate.
- **Video recording retention**: HIPAA does not specify video retention periods, but if video footage captures ePHI (e.g., a visible computer screen), it is subject to HIPAA rules. Configure cameras to avoid capturing screen content where possible.
- **DEA requirements**: Practices with controlled substance storage must comply with DEA physical security requirements (21 CFR 1301.71-1301.76). This includes locked storage, limited access, and alarm systems for specific schedule drugs.
- **ADA compliance**: Access control systems must not impede access for individuals with disabilities. Ensure card readers and entry mechanisms are ADA-compliant in terms of height and operation.
- **State privacy laws**: Some states have specific requirements for video surveillance in workplaces and healthcare settings. Check state law before installing cameras in work areas.
- **OSHA workplace safety**: OSHA requires employers to provide a safe workplace. Physical security measures contribute to OSHA compliance, particularly regarding workplace violence prevention.
- **Building codes and fire safety**: Electronic access control on egress points must comply with fire codes. Doors must release on fire alarm activation. Consult your local fire marshal.
- **Evidence preservation**: If cameras capture an incident (theft, assault, unauthorized access), footage may be needed as evidence. Implement a hold/preservation process for relevant footage.

## Common Mistakes

1. **Unsecured server closet**: The most common physical security failing in small practices. Your server closet, network switches, and patch panels need a locked door. A janitor's closet with a padlock is better than an open rack in a hallway.
2. **Cameras with no monitoring or review**: Installing cameras and never reviewing footage is security theater. At minimum, review footage after reported incidents. Better, implement motion alerts for after-hours activity.
3. **Key-only access control**: Physical keys cannot be audited, are easily duplicated, and are expensive to rekey when an employee leaves. Electronic access control provides accountability and easy credential revocation.
4. **Visible screens in public areas**: Workstation screens visible from waiting rooms, hallways, or check-in windows expose ePHI. Position screens perpendicular to traffic or install privacy screens.
5. **No visitor management**: Allowing non-patients to wander freely through clinical and administrative areas is a physical security and HIPAA risk. Implement a visitor sign-in process and escort policy.
6. **Ignoring after-hours security**: Many breaches occur after hours. Ensure your physical security is appropriate for off-hours, including alarm systems, after-hours access control, and exterior lighting.
7. **Not rekeying/recredentialing after employee departure**: When an employee leaves, their physical access must be revoked immediately. For key-based systems, this means rekeying, which is expensive and often neglected. Electronic access control makes this trivial.
8. **Insufficient camera storage**: Most practices underestimate storage needs. Plan for at minimum 30 days of continuous recording, ideally 90 days. Cloud solutions handle this automatically; on-premise requires capacity planning.
9. **Neglecting environmental monitoring**: Server rooms without temperature and humidity monitoring risk equipment failure. A $50 sensor and free alerting can prevent thousands in equipment damage.
10. **Over-investing in perimeter without addressing interior**: Focusing all physical security on exterior doors while leaving medication rooms, server closets, and records storage unsecured misallocates resources.

## Recommended Implementation Timeline

| Phase | Timeline | Activities | Estimated Cost (Small) | Estimated Cost (Medium) |
|-------|----------|------------|----------------------|------------------------|
| **Phase 1: Assessment** | Weeks 1-2 | Physical security walkthrough, identify entry points, ePHI locations, high-risk areas, current controls | $0-$500 | $500-$2,000 |
| **Phase 2: Quick Wins** | Weeks 2-4 | Lock server closet, install cable locks on devices, position screens, install privacy screens, set up screen lock policies | $500-$2,000 | $1,000-$5,000 |
| **Phase 3: Camera Installation** | Weeks 4-8 | Select and install camera system, configure recording, set up remote access, test coverage | $1,500-$5,000 | $5,000-$20,000 |
| **Phase 4: Access Control** | Weeks 6-12 | Install electronic access control on exterior doors and sensitive areas, issue credentials, configure schedules | $500-$3,000 | $3,000-$15,000 |
| **Phase 5: Policies & Training** | Weeks 10-14 | Document physical security policies, train staff on visitor management, device handling, incident reporting | $500-$1,000 | $1,000-$3,000 |
| **Ongoing Operations** | Monthly | Review access logs, maintain camera system, update access credentials, conduct periodic walkthroughs | $50-$200/mo | $200-$1,000/mo |

**Total initial investment**: $3,000-$11,500 (small) | $10,500-$45,000 (medium)
**Ongoing monthly cost**: $50-$200 (small) | $200-$1,000 (medium)
**Annual ongoing cost**: $600-$2,400 (small) | $2,400-$12,000 (medium)

Physical security improvements can often be implemented incrementally and should be prioritized based on your SRA findings. Start with the quick wins (locking the server closet, securing devices) while planning the larger investments (camera and access control systems). The server closet lock should happen this week; the full camera and access control deployment should be completed within three months.
