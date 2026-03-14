# Network Design & Architecture

## What Is This?

Network design and architecture refers to the deliberate planning, topology selection, and implementation of the entire data communications infrastructure that connects every device, system, and service in a primary care practice. This encompasses the physical layer (cabling, switches, patch panels), the logical layer (VLANs, subnets, routing), the security layer (firewalls, segmentation, access control), and the management layer (monitoring, documentation, change control).

A well-designed network is invisible to clinical staff. A poorly designed one becomes the single largest source of frustration, downtime, and compliance risk in a practice. The network is not just "the internet"—it is the foundation on which your EHR, phone system, imaging, patient check-in, credit card processing, and every other digital workflow depends.

Think of network design as the blueprint for a building. You would never start construction without architectural drawings, structural engineering, and a clear plan for plumbing and electrical. Yet healthcare practices routinely build their IT infrastructure ad hoc—plugging in consumer-grade routers, daisy-chaining switches, and hoping for the best. The result is an environment that is fragile, insecure, and nearly impossible to troubleshoot when things go wrong.

## Why Does a Primary Care Practice Need This?

Every modern primary care practice is a technology-dependent operation. Consider what runs on your network on a typical day:

- **EHR access** for every provider, nurse, and medical assistant—often cloud-hosted, meaning every click is a network transaction
- **E-prescribing** with real-time checks against state PDMP databases
- **Lab interfaces** (HL7/FHIR) transmitting orders and results
- **Medical device connectivity**—vitals machines, EKGs, spirometers pushing data to the EHR
- **VoIP phone systems** that require quality-of-service (QoS) guarantees to avoid garbled calls
- **Patient check-in kiosks and tablets** on a segregated network
- **Credit card terminals** requiring PCI-DSS compliant segmentation
- **Imaging** (if applicable)—even basic X-ray DICOM files are 10-50 MB each
- **Backups and replication** running in the background
- **Guest/patient WiFi** that must be completely isolated from clinical systems

When the network goes down, the practice stops. Providers cannot access charts. Prescriptions cannot be sent. Lab results do not arrive. Phones may not ring. Revenue stops while fixed costs continue. For a mid-size practice generating $15,000-30,000 per day in revenue, even a two-hour outage is a $4,000-8,000 loss before you account for patient dissatisfaction and rescheduling costs.

Beyond uptime, HIPAA's Security Rule explicitly requires that covered entities implement technical safeguards including access controls, audit controls, integrity controls, and transmission security. A flat, unsegmented, undocumented network makes compliance with these requirements essentially impossible to demonstrate to an auditor.

## How to Decide If You Need It

You do not "decide" whether you need network design—you need it. The decision is how much rigor and investment to apply. Ask yourself:

1. **Can you produce a current network diagram?** If not, you have a documentation problem at minimum.
2. **Do you have separate VLANs** for clinical systems, medical devices, VoIP, guest WiFi, and payment processing? If not, you have a segmentation problem.
3. **Do you know the make, model, firmware version, and configuration** of every switch, router, and access point? If not, you have a management problem.
4. **Has your network been professionally assessed in the last 24 months?** If not, you likely have latent problems.
5. **Are you experiencing intermittent connectivity issues, slow EHR performance, or dropped VoIP calls?** These are symptoms of design problems, not just equipment problems.

If you are opening a new practice, relocating, or renovating, you have a golden opportunity to design the network correctly from the start. The cost difference between doing it right during construction versus retrofitting later is typically 3-5x.

## Order of Operations

Network design and deployment should follow this sequence:

1. **Needs assessment and site survey** — Document the physical space, count endpoints, identify critical systems, determine bandwidth requirements. Walk every room.
2. **Architecture design** — Create logical and physical network diagrams. Define VLAN scheme, IP addressing plan, and security zones. This should be a written document, not just a mental model.
3. **Structured cabling** — Run cable before anything else. This is a construction activity. See the cabling guide for details.
4. **Core infrastructure deployment** — Install firewall, core switch(es), and patch panels. Configure VLANs, routing, DHCP, and DNS.
5. **Wireless deployment** — Install and configure access points after the wired backbone is in place. Perform a wireless site survey.
6. **Endpoint connection** — Connect workstations, printers, phones, medical devices to appropriate network segments.
7. **Testing and validation** — Test every drop, verify VLAN segmentation, confirm internet failover, validate QoS for VoIP, run speed tests from every clinical area.
8. **Documentation** — Update network diagrams, IP address inventory, configuration backups, and credential vault. This is not optional.
9. **Monitoring deployment** — Implement network monitoring (SNMP, syslog, uptime checks) so you know about problems before users report them.
10. **Ongoing management** — Firmware updates, configuration reviews, quarterly security assessments, and annual penetration testing.

## Options by Practice Size

### Small Practice (1-3 Providers)

A small practice typically has 5-15 network endpoints (workstations, printers, phones, medical devices). The network can usually be served from a single MDF closet with one firewall, one or two managed switches, and two to three wireless access points.

**Typical architecture:**
- Single firewall/router (e.g., FortiGate 40F or Meraki MX67)
- One 24-port or 48-port managed PoE switch
- 2-3 wireless access points
- Single internet circuit with cellular failover
- 3-4 VLANs (clinical, VoIP, medical devices, guest)

**Budget range:** {{price:network-design-small}} for equipment, plus {{price:network-cabling-small}} for cabling, plus design/installation labor.

### Medium Practice Group (4-15 Providers)

Medium practices typically have 25-75 endpoints, possibly across multiple suites or floors. You will likely need a core-distribution switching architecture, dedicated server/network closet with proper cooling, and redundant internet circuits.

**Typical architecture:**
- Business-class firewall with full UTM licensing (FortiGate 60F/80F or Meraki MX75)
- Core switch (Layer 3 capable) plus access-layer switches per closet
- 5-15 wireless access points with centralized management
- Dual internet circuits with SD-WAN or automatic failover
- 5-6 VLANs minimum (clinical, VoIP, medical devices, management, guest, IoT)
- On-site UPS protecting all network equipment

**Budget range:** {{price:network-design-medium}} for equipment, plus cabling and labor.

### Large Practice Group (15+ Providers)

Large practices and multi-site organizations need enterprise-grade design with redundancy at every layer, dedicated IT staff or a managed services partner, and formal change management processes.

**Typical architecture:**
- Enterprise firewall cluster (FortiGate 100F+ or Palo Alto PA-400 series) with HA pair
- Stacked core switches with redundant uplinks
- Distributed access-layer switching with PoE++ for high-power devices
- 15-40+ wireless access points with wireless controller or cloud management
- Redundant internet circuits from diverse carriers, SD-WAN overlay
- Site-to-site VPN or MPLS for multi-location connectivity
- Dedicated management VLAN and out-of-band access
- Network access control (NAC) for device authentication

**Budget range:** {{price:network-design-large}} for equipment per site, plus significant cabling, labor, and ongoing management costs.

## Options Analysis

### Off-the-Shelf / SaaS

**Meraki (Cisco)** is the most common "off-the-shelf" option for healthcare practices. The entire stack (firewall, switches, access points) is managed through a single cloud dashboard. Configuration is template-driven and relatively approachable.

- **Pros:** Single-pane-of-glass management, excellent dashboard, automatic firmware updates, good compliance reporting, low barrier to entry for less technical staff.
- **Cons:** Expensive ongoing licensing (hardware becomes a brick if licenses lapse), limited deep customization, vendor lock-in, less granular control than enterprise alternatives.
- **Typical cost:** {{price:meraki-mx67}} for MX67 firewall + 3-year license; {{price:meraki-ms120-24p}} for MS120-24P switch + license; {{price:meraki-mr46}} per MR46 access point + license.

### Open Source / Self-Hosted

For practices with technical staff or a technically proficient MSP, open-source solutions can deliver enterprise-grade functionality at significantly lower cost. OPNsense or pfSense on a Protectli Vault appliance provides firewall/routing, paired with Ubiquiti UniFi for switching and wireless.

- **Pros:** No ongoing licensing fees, deep configurability, strong community support, excellent price-performance ratio, no vendor lock-in.
- **Cons:** Requires more technical expertise, no single vendor support contract, firmware updates require manual validation, you own the complexity.
- **Typical cost:** {{price:opnsense-protectli}} for OPNsense on Protectli VP2420; {{price:ubiquiti-usw-pro-24-poe}} for UniFi switch; {{price:ubiquiti-u6-pro}} per U6 Pro access point.

### Managed Service Provider

Many practices outsource their entire network to a managed service provider (MSP). The MSP designs, deploys, monitors, and maintains the network for a monthly fee.

- **Pros:** Expertise on demand, 24/7 monitoring, someone else handles firmware updates and troubleshooting, predictable monthly cost, compliance support.
- **Cons:** Variable quality (MSP market ranges from excellent to terrible), loss of direct control, potential for slow response times, contracts can be difficult to exit, you are dependent on their documentation practices.
- **Typical cost:** {{price:msp-monthly-small}} per month for small practice; {{price:msp-monthly-medium}} per month for medium practice. Usually includes monitoring, patching, and basic support; larger projects billed separately.

### Custom / Hybrid

Most well-run practices end up with a hybrid approach: professionally designed network using a mix of commercial and open-source components, with either in-house IT or a trusted MSP handling ongoing management. This gives you the best balance of cost, control, and expertise.

The key is that regardless of who manages it, the practice should own the network documentation and have administrative credentials in escrow. Never let your MSP be the sole holder of your firewall passwords.

## Vendor Landscape

| Vendor | Strengths | Weaknesses | Best For |
|--------|-----------|------------|----------|
| **Cisco Meraki** | Cloud management, ease of use, single dashboard | Expensive licensing, limited customization, hardware bricks without license | Practices wanting simplicity, willing to pay premium |
| **Ubiquiti UniFi** | Excellent price-performance, good UI, no licensing fees | Less enterprise support, occasional firmware issues, limited L3 features | Cost-conscious practices with capable IT support |
| **Aruba (HPE)** | Enterprise-grade wireless, excellent RF management, strong healthcare presence | Complex configuration, higher cost, less intuitive management | Larger practices needing best-in-class wireless |
| **Fortinet** | Best-in-class firewalls, integrated security fabric, strong UTM | Switching/wireless less mature than firewall products, licensing complexity | Practices prioritizing security, often mixed with other vendors for switching/wireless |
| **Ruckus (CommScope)** | Outstanding wireless performance in dense environments | Higher cost, less intuitive management, recent ownership changes | High-density clinical environments |
| **SonicWall** | Solid mid-market firewalls, good TotalSecure bundles | Management interface feels dated, less comprehensive than Fortinet | Budget-conscious practices needing reliable firewall |

**Realistic vendor combinations seen in well-run practices:**
- Fortinet firewall + Ubiquiti switching and wireless (excellent value)
- Meraki full stack (simplicity premium)
- Fortinet firewall + Aruba wireless + HPE switching (enterprise-grade)
- OPNsense firewall + Ubiquiti switching and wireless (maximum value)

## Compliance & Regulatory Notes

**HIPAA Security Rule** (45 CFR Part 164, Subpart C) requires covered entities to implement:

- **Access controls** (§164.312(a)) — Network segmentation, VLANs, and firewall rules ensure that only authorized systems can reach ePHI. A flat network where the guest WiFi can reach the EHR server is a violation waiting to be found.
- **Audit controls** (§164.312(b)) — Your network equipment must generate and retain logs. Firewall logs, switch port authentication logs, wireless association logs—these are your audit trail.
- **Integrity controls** (§164.312(c)) — Network-level protections against data alteration in transit. This includes IPS/IDS capabilities on your firewall.
- **Transmission security** (§164.312(e)) — Encryption of ePHI in transit. While most modern EHR traffic is TLS-encrypted at the application layer, your network design should not rely solely on this. VPN tunnels for site-to-site traffic, WPA3-Enterprise for wireless, and encrypted management protocols (SSH, HTTPS) are all expected.

**HIPAA does not prescribe specific technologies.** It requires "reasonable and appropriate" safeguards. But an OCR auditor will expect to see network segmentation, access controls, logging, and encryption. A consumer-grade router from Best Buy with no VLANs and default credentials is not "reasonable and appropriate" for a covered entity.

**PCI-DSS** applies if you process credit cards. The network segment handling payment transactions must be isolated and meet PCI requirements. This is another reason VLANs are not optional.

**State regulations** vary. Some states (Texas, California, Massachusetts) have additional data protection requirements that may affect network design. Check with your compliance officer or attorney.

## Common Mistakes

1. **Flat network with no segmentation.** The single most common and most dangerous mistake. Every device on one subnet means a compromised guest laptop can potentially reach your EHR database. Implement VLANs from day one.

2. **Consumer-grade equipment.** Home routers, unmanaged switches, and consumer access points have no place in a healthcare environment. They lack the management, logging, and security features required for compliance.

3. **No documentation.** If your network is not documented, it is not managed. You need current diagrams, IP address assignments, VLAN maps, and configuration backups. When your IT person leaves or your MSP relationship ends, this documentation is your lifeline.

4. **Single point of failure on the internet circuit.** If your one cable modem goes down, your cloud-hosted EHR is unreachable. Every practice should have at least a cellular failover; medium and large practices need dual ISP circuits.

5. **Neglecting firmware updates.** Network equipment firmware updates patch security vulnerabilities. Running three-year-old firmware on your firewall is like running an unpatched Windows XP machine. Establish a quarterly patching cycle at minimum.

6. **Over-reliance on the MSP without oversight.** Trust but verify. Request quarterly network health reports. Ensure you have administrative access to all equipment. Keep your own copy of documentation. MSP relationships end, sometimes abruptly.

7. **Undersized switching infrastructure.** Buying the cheapest 24-port unmanaged switch because "we only have 20 devices" ignores future growth, PoE requirements for access points and phones, and the need for managed features like VLANs and port security.

8. **Ignoring wireless design.** Dropping access points in random locations without a site survey leads to dead spots, interference, and poor performance. Wireless is radio frequency engineering—it matters where APs are placed, what channels they use, and how much power they transmit.

9. **No out-of-band management plan.** When the network is down, how do you access the firewall to troubleshoot? A cellular-connected management port or a dedicated management laptop with a console cable should be part of your plan.

10. **Designing for today instead of 3-5 years out.** Run more cable drops than you think you need. Buy switches with room to grow. Design your VLAN and IP scheme with expansion in mind. The marginal cost of over-provisioning during initial build-out is trivial compared to retrofitting later.

## Recommended Implementation Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| **Assessment & Design** | 2-4 weeks | Site survey, requirements gathering, architecture design, vendor selection, quoting |
| **Procurement** | 1-3 weeks | Equipment ordering and staging (lead times vary; Meraki and Fortinet typically ship in 1-2 weeks) |
| **Cabling** | 1-2 weeks | Structured cabling installation (coordinate with any construction/renovation) |
| **Core Deployment** | 1-2 weeks | Firewall, switches, VLAN configuration, internet circuit activation |
| **Wireless Deployment** | 3-5 days | AP installation, wireless survey, channel optimization |
| **Endpoint Migration** | 1-2 weeks | Connect workstations, phones, printers, medical devices; validate each |
| **Testing & Validation** | 3-5 days | Comprehensive testing, failover testing, performance validation |
| **Documentation & Training** | 1 week | Finalize documentation, train staff on basics, hand off to ongoing management |

**Total for a new build:** 8-14 weeks from assessment to production. For an existing practice migration, add 2-4 weeks for parallel running and cutover planning.

**For a small practice:** The timeline compresses to 4-6 weeks total, as there is less complexity in every phase.

**Critical path items:** Cabling and internet circuit provisioning are the most common delays. Order internet circuits 6-8 weeks in advance—carrier provisioning is notoriously slow. Start cabling as soon as the space is ready for low-voltage work.
