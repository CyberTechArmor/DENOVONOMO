# Internet Circuits & Redundancy

## What Is This?

Internet circuits are the physical and logical connections that link a primary care practice to the broader internet, enabling access to cloud-hosted EHR systems, telehealth platforms, e-prescribing services, health information exchanges (HIEs), claims clearinghouses, and patient communication tools. In modern healthcare IT, the internet connection is the single most critical piece of infrastructure -- when it goes down, virtually everything stops.

Redundancy refers to having more than one internet connection from more than one provider, so that if one circuit fails, the practice can continue operating. This is not a luxury in healthcare; it is a practical necessity. A fifteen-minute outage during a busy clinic day can cascade into canceled appointments, delayed prescriptions, and frustrated patients. A multi-hour outage can create genuine patient safety issues if clinicians cannot access medication histories or allergy records.

The key technologies involved include business-grade fiber optic circuits, cable broadband, fixed wireless, SD-WAN (Software-Defined Wide Area Networking) for intelligent traffic routing across multiple circuits, and automatic failover mechanisms that switch traffic to a backup connection without manual intervention.

## Why Does a Primary Care Practice Need This?

Every core workflow in a modern primary care practice depends on reliable internet connectivity. Cloud-hosted EHR systems like athenahealth, eClinicalWorks cloud, and Practice Fusion are entirely inaccessible without an internet connection. Even on-premises EHR installations typically require internet access for e-prescribing (via Surescripts), lab result delivery, claims submission, and Meaningful Use / Promoting Interoperability reporting.

Telehealth, which now accounts for 10-20% of primary care visits in many practices, demands sustained bandwidth with low latency and jitter. A single video visit consumes 2-4 Mbps; a practice running four simultaneous telehealth sessions needs dedicated bandwidth that a consumer-grade connection often cannot reliably provide.

Beyond clinical operations, VoIP phone systems (increasingly standard in medical offices) ride on the internet connection. When your internet goes down, your phones go down too -- and patients cannot reach you.

HIPAA does not explicitly require internet redundancy, but the Security Rule's contingency planning requirements (45 CFR 164.308(a)(7)) mandate that covered entities establish procedures for continuing critical business processes during emergencies. An internet outage is the most common "emergency" a practice will face, and having no backup is a weak position during an OCR audit.

## How to Decide If You Need It

Every practice needs a primary business-grade internet circuit. The question is whether you need a redundant second circuit. Consider these factors:

**You almost certainly need dual ISP if:** you use a cloud-hosted EHR, you run telehealth, your phone system is VoIP, you have more than two providers seeing patients simultaneously, or your payer contracts include timely filing deadlines that an extended outage could jeopardize.

**You might defer redundancy if:** you are a solo practitioner with an on-premises EHR that has local caching, you maintain a paper-based backup workflow that staff actually practice, and you can tolerate occasional half-day outages.

For bandwidth sizing, a reasonable formula is: 5 Mbps base + 2 Mbps per concurrent user + 4 Mbps per concurrent telehealth session + 25% headroom. A five-provider practice with two concurrent telehealth sessions and fifteen concurrent users needs roughly 5 + 30 + 8 + 11 = 54 Mbps downstream minimum. Upstream matters more than most practices realize -- uploading imaging studies, telehealth video, and cloud backups all demand upstream bandwidth. Symmetric fiber (equal upload and download speeds) is strongly preferred.

## Order of Operations

1. **Assess current and projected bandwidth needs** using the formula above. Account for growth over the 3-year contract term.
2. **Survey available ISPs** at your physical address. Use BroadbandNow or contact providers directly. Fiber availability varies enormously by location.
3. **Select a primary circuit** -- business-grade fiber if available, business cable if not.
4. **Select a secondary circuit from a different provider** using different last-mile infrastructure (e.g., fiber primary + cable secondary, or fiber primary + fixed wireless secondary). Two circuits from the same provider sharing the same conduit provide no meaningful redundancy.
5. **Deploy an SD-WAN appliance or dual-WAN firewall** to manage failover and load balancing. This device sits between your ISP connections and your internal network.
6. **Configure failover policies** -- determine which traffic is critical (EHR, e-prescribing, VoIP) and which can be deprioritized or dropped during a failover event.
7. **Test failover** by physically disconnecting the primary circuit and verifying that all critical systems remain operational on the secondary.
8. **Document the configuration** and establish monitoring alerts so you know immediately when a circuit fails, even if failover is working.

## Options by Practice Size

**Solo / 1-2 Providers (fewer than 10 users):**
- Primary: 100/100 Mbps business fiber ($200-350/month) or 200/20 Mbps business cable ($150-250/month)
- Secondary: 4G/5G cellular failover via a device like Cradlepoint or Peplink ($50-100/month data plan + $500-1,200 hardware)
- Total monthly: $250-450

**Small Group / 3-5 Providers (10-25 users):**
- Primary: 200/200 Mbps business fiber ($300-500/month)
- Secondary: 100/10 Mbps business cable from a different ISP ($150-250/month)
- SD-WAN appliance: Meraki MX67 or Fortinet FortiGate 40F ($500-1,500 hardware + licensing)
- Total monthly: $450-750 plus amortized hardware

**Medium Group / 6-15 Providers (25-75 users):**
- Primary: 500/500 Mbps or 1 Gbps dedicated fiber ($500-1,200/month)
- Secondary: 200/200 Mbps business fiber from a different ISP ($300-500/month)
- SD-WAN: Meraki MX85, Fortinet FortiGate 60F, or managed SD-WAN service ($1,500-4,000 hardware)
- Total monthly: $800-1,700 plus amortized hardware

## Options Analysis

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Business Fiber (symmetric)** | Lowest latency, highest reliability, symmetric speeds ideal for telehealth and cloud EHR | Not available everywhere, higher cost than cable, installation can take 30-90 days | Primary circuit for any practice where available |
| **Business Cable** | Widely available, lower cost, fast download speeds | Asymmetric (poor upload), shared neighborhood bandwidth, less reliable than fiber | Secondary circuit or primary where fiber unavailable |
| **Fixed Wireless (point-to-point)** | Available in underserved areas, can be symmetric, no dependence on underground infrastructure | Weather-sensitive, requires line of sight, latency higher than fiber | Secondary circuit in rural areas |
| **Cellular Failover (4G/5G)** | Fast deployment, no infrastructure needed, works anywhere with cell coverage | Data caps, variable latency, shared cell tower bandwidth | Emergency failover for small practices |
| **Starlink Business** | Available nearly everywhere, decent speeds (100-200 Mbps) | Variable latency (25-60ms), weather sensitivity, not yet proven for healthcare-critical applications | Last-resort option for very rural practices |

**SD-WAN vs. Dual-WAN Firewall:** SD-WAN appliances (Meraki, Fortinet, Cisco Viptela, VMware VeloCloud) offer application-aware routing, meaning they can detect that your EHR is slow on one circuit and automatically move that traffic to the other. A basic dual-WAN firewall (pfSense, Ubiquiti) can do simple failover but lacks application intelligence. For practices running cloud EHR and telehealth, SD-WAN is worth the premium.

## Vendor Landscape

**Fiber ISPs (regional availability varies):** AT&T Business Fiber, Comcast Business (Metro Ethernet), Lumen (CenturyLink) Business, Spectrum Enterprise, Crown Castle/Lightower, local/regional fiber providers (often the best value and service).

**Cable ISPs:** Comcast Business, Spectrum Business, Cox Business, WOW Business.

**SD-WAN / Failover Hardware:** Cisco Meraki MX series (strong cloud management, popular with MSPs), Fortinet FortiGate (best value for security + SD-WAN combined), Peplink Balance series (excellent multi-WAN bonding), Cradlepoint (best-in-class cellular failover), Draytek Vigor (budget-friendly dual-WAN).

**Managed SD-WAN Services:** Many MSPs offer managed SD-WAN as a service for $200-500/month, which includes the hardware, monitoring, and management. This is often the right choice for practices without dedicated IT staff.

## Compliance & Regulatory Notes

- **HIPAA Security Rule** requires encryption of ePHI in transit. All internet circuits should terminate into a firewall that enforces VPN or TLS encryption for any traffic containing patient data. The circuit itself does not need to be "HIPAA compliant" -- the encryption layer on top of it does.
- **Business Associate Agreements** are not required with ISPs under current OCR guidance, because ISPs are considered "mere conduits" for encrypted data (the Conduit Exception). However, if your ISP provides managed firewall or security services, a BAA may be required for those services.
- **Contingency planning** (45 CFR 164.308(a)(7)) requires documented procedures for operating during an internet outage. Even with dual ISP, you should have a written downtime procedure.
- **E-prescribing for controlled substances (EPCS)** requires internet connectivity. If you cannot e-prescribe due to an outage, you may need to issue paper prescriptions for Schedule II-V medications, which creates workflow and compliance complications.

## Common Mistakes

1. **Buying two circuits from the same provider** (or two providers sharing the same last-mile infrastructure). When Comcast's underground conduit gets cut, both your Comcast business and your Comcast residential circuits go down simultaneously.
2. **Choosing residential-grade internet** to save $50/month. Business circuits come with SLAs (typically 99.9% uptime guarantees), priority repair dispatch (4-hour response vs. "sometime this week"), and static IP addresses needed for VPN and security configurations.
3. **Ignoring upload speed.** A 500/20 cable connection has phenomenal download speed but will choke on four simultaneous telehealth sessions, cloud backup uploads, or large imaging file transfers.
4. **No automatic failover.** Having a second circuit that requires someone to manually unplug and replug cables is not redundancy -- it is a plan that fails at 2 AM and on weekends.
5. **Not testing failover regularly.** Failover configurations can break silently. Schedule quarterly failover tests where you physically disconnect the primary circuit and verify all critical systems work.
6. **Overlooking the modem/ONT as a single point of failure.** If both circuits come into the same rack and share a power strip that someone unplugs, your redundancy is meaningless. Ensure independent power paths.
7. **Signing long-term contracts without exit clauses.** ISP contracts of 24-36 months are normal, but ensure you can exit if the provider fails to meet SLA commitments.

## Recommended Implementation Timeline

**Weeks 1-2: Assessment and Survey**
- Document current bandwidth usage and calculate projected needs
- Survey all available ISPs at your location; request formal quotes
- Identify whether fiber is available or can be extended to your building

**Weeks 3-4: Contract Negotiation and Ordering**
- Select primary and secondary ISPs; negotiate rates (always negotiate -- listed prices are starting points)
- Sign contracts; schedule installation dates
- Order SD-WAN or dual-WAN firewall hardware

**Weeks 5-10: Installation (Fiber Lead Times)**
- Fiber installation can take 30-90 days if construction is required. Cable and fixed wireless are typically 1-2 weeks.
- Coordinate with your landlord or building management for any conduit or wiring needs
- Have your IT team or MSP on-site for circuit turn-up and testing

**Week 11: Configuration**
- Install and configure SD-WAN or dual-WAN firewall
- Configure failover policies, QoS (Quality of Service) for VoIP and EHR traffic
- Set up monitoring and alerting

**Week 12: Testing and Documentation**
- Conduct full failover test during a low-volume period
- Document the configuration, IP addresses, ISP support contact numbers, and escalation procedures
- Train staff on what to expect during a failover event (brief interruption, possible VoIP reconnection)
- Update your HIPAA contingency plan to reflect the new infrastructure

**Ongoing:**
- Quarterly failover tests
- Annual bandwidth reassessment
- Monitor circuit utilization monthly -- if you are consistently above 70% utilization, it is time to upgrade
