# Wireless Infrastructure

## What Is This?

Wireless infrastructure encompasses the access points (APs), controllers, management platforms, and configuration that provide WiFi connectivity throughout a healthcare practice. In a modern primary care office, wireless is not a convenience—it is a critical utility. Clinical tablets, mobile workstations, medical devices, VoIP handsets, patient check-in kiosks, and guest internet access all depend on reliable, secure, and properly segmented wireless networking.

Healthcare wireless is fundamentally different from the WiFi you set up at home. A consumer access point from Best Buy broadcasts a single network, has no segmentation capability, provides no centralized management, and cannot handle the device density or security requirements of a clinical environment. Healthcare wireless requires:

- **Multiple SSIDs mapped to separate VLANs** (clinical, medical devices, guest, corporate)
- **Enterprise-grade authentication** (WPA3-Enterprise with 802.1X/RADIUS for clinical networks)
- **Quality of Service (QoS)** to prioritize VoIP and clinical traffic over guest streaming
- **Centralized management** for consistent configuration, firmware updates, and monitoring across all APs
- **Appropriate density planning** to handle the number of concurrent devices in each area
- **RF engineering** to minimize interference and dead spots

The access point is just the radio. The real value is in the architecture: how the wireless integrates with your wired network, how traffic is segmented, how devices authenticate, and how the whole system is managed over time.

## Why Does a Primary Care Practice Need This?

The trend in clinical IT is unmistakably toward wireless and mobile. Consider the wireless-dependent workflows in a modern primary care practice:

- **Tablets and mobile workstations** — Providers increasingly use iPads or laptop carts that roam between exam rooms. These need seamless WiFi with no disconnects during room transitions.
- **Medical devices** — Wireless vitals machines, portable EKGs, point-of-care testing devices, and smart scales that push data directly to the EHR via WiFi.
- **VoIP phones** — Wireless VoIP handsets (e.g., Spectralink, Cisco 840) for clinical staff who move throughout the office.
- **Patient check-in** — Tablets at the front desk or in the waiting room for patient intake and consent forms.
- **Guest WiFi** — Patients expect WiFi in the waiting room. This must be completely isolated from clinical systems.
- **IoT devices** — Smart thermostats, security cameras, digital signage—these need network access but must be segmented away from clinical traffic.

Poor wireless performance directly impacts clinical workflows. When a provider's tablet disconnects while entering a note, when a vitals machine cannot push data to the EHR, when a VoIP call drops mid-conversation—these are not just annoyances, they are workflow disruptions that slow patient throughput and frustrate staff.

## How to Decide If You Need It

If you are building or renovating a practice, wireless infrastructure should be designed alongside wired infrastructure from day one. There is no modern primary care practice that does not need wireless.

The decision points are:

1. **How many concurrent wireless devices?** Count every device: provider tablets, nursing tablets, mobile workstations, medical devices, phones, IoT, patient devices on guest WiFi. A typical exam room may have 3-5 wireless devices. A 10-exam-room practice easily has 40-60 clinical devices plus 20-30 patient devices on guest WiFi.

2. **What are the coverage requirements?** Every clinical area needs strong, reliable signal. This includes exam rooms, nursing stations, provider offices, labs, imaging rooms, and common areas. Do not forget storage rooms that may house wireless medical equipment chargers.

3. **What is the construction type?** Drywall and drop ceilings are transparent to WiFi. Concrete block, brick, and metal framing significantly attenuate signal. Older buildings with plaster-and-lath walls can be surprisingly challenging. A site survey is essential.

4. **What is the management model?** Do you have IT staff who will manage the wireless, or will this be handled by an MSP? This affects vendor selection significantly.

## Order of Operations

1. **Wireless site survey** — Before purchasing a single access point, conduct a predictive site survey (using tools like Ekahau or NetSpot) or an active survey of the physical space. This determines AP count, placement, channel assignments, and power levels.
2. **Design SSID and VLAN plan** — Define which SSIDs you will broadcast, what VLAN each maps to, authentication method for each, and QoS policies.
3. **Select vendor and model** — Based on survey results, management requirements, and budget.
4. **Install wired infrastructure first** — Every AP needs a wired Ethernet connection (Cat6) and PoE from a managed switch. APs must be cabled before they can be deployed.
5. **Physical AP installation** — Mount APs in surveyed locations. Ceiling mount is standard. Ensure proper orientation (most APs radiate downward and outward from a ceiling mount position).
6. **Configure management platform** — Set up the controller (hardware or cloud), import AP inventory, apply SSID/VLAN configuration, set channel plans, and configure security policies.
7. **Validate and optimize** — Walk the entire space with a survey tool, verify coverage in every room, check for dead spots, validate roaming between APs, test throughput, confirm VLAN segmentation.
8. **Client testing** — Connect representative devices (provider tablet, medical device, VoIP phone, guest device) and validate connectivity, authentication, and appropriate VLAN assignment for each.
9. **Document** — Record AP locations on floor plan, channel assignments, SSID-to-VLAN mapping, authentication configuration, and management credentials.
10. **Ongoing monitoring** — Monitor AP health, client connectivity, channel utilization, and interference. Set alerts for AP failures.

## Options by Practice Size

### Small Practice (1-3 Providers)

A small practice in a 1,500-3,000 sq ft space typically needs 2-3 access points. One in the clinical area, one covering the front office and waiting room, and possibly one in back-office areas. Three SSIDs are standard: clinical (WPA3-Enterprise), medical devices (WPA3-Personal with a strong PSK on a dedicated VLAN), and guest (open or captive portal, isolated VLAN).

**Recommended options:**
- Ubiquiti UniFi U6 Pro (2-3 units): {{price:ubiquiti-u6-pro}} each, managed via free UniFi Controller
- Meraki MR46 (2-3 units): {{price:meraki-mr46}} each including 3-year license
- Aruba Instant On AP25 (2-3 units): {{price:aruba-instant-on-ap25}} each, cloud-managed, no license fee

**Total wireless budget:** {{price:wireless-small}} for equipment.

### Medium Practice Group (4-15 Providers)

A medium practice in 5,000-15,000 sq ft needs 5-15 access points depending on layout and construction. Consider a dedicated wireless controller (or cloud management platform) for centralized management. Band steering and client load balancing become important with higher device density.

**Recommended options:**
- Ubiquiti UniFi U6 Enterprise or U7 Pro (5-15 units): {{price:ubiquiti-u6-enterprise}} each, managed via UniFi Controller on a Cloud Key or self-hosted
- Meraki MR46 or MR56 (5-15 units): {{price:meraki-mr56}} each including 3-year license
- Aruba AP-535 or AP-635 (5-15 units): {{price:aruba-ap535}} each, managed via Aruba Central

**Total wireless budget:** {{price:wireless-medium}} for equipment and licensing.

### Large Practice Group (15+ Providers)

Large practices and multi-site organizations need enterprise wireless with centralized management across sites, advanced RF management, and potentially wireless intrusion prevention (WIPS). A dedicated wireless architect or consultant should design the system.

**Recommended options:**
- Aruba AP-635 with Aruba Central management: {{price:aruba-ap635}} each — Aruba's RF management is best-in-class for dense healthcare environments
- Meraki MR56 or MR57 with enterprise licensing: {{price:meraki-mr57}} each including license
- Ruckus R750 or R850: {{price:ruckus-r750}} each — exceptional performance in high-density environments
- Ubiquiti UniFi U7 Pro with dedicated controller: {{price:ubiquiti-u7-pro}} each — significant cost savings but less enterprise management

**Total wireless budget:** {{price:wireless-large}} for equipment and licensing per site.

## Options Analysis

### Off-the-Shelf / SaaS

**Meraki MR Series** — Cloud-managed wireless with zero-touch provisioning. The Meraki dashboard provides excellent visibility into wireless health, client connectivity, and usage patterns.

- **Pros:** Simplest management, automatic firmware updates, excellent analytics, integrates with Meraki switches and firewalls, good HIPAA compliance reporting
- **Cons:** Highest cost (perpetual licensing), APs become non-functional if license lapses, limited RF tuning compared to Aruba, vendor lock-in
- **Best for:** Practices wanting simplicity and single-vendor management, willing to pay the premium

**Aruba Instant On** — HPE's small business wireless line, cloud-managed with no licensing fees. A strong middle ground between consumer and enterprise.

- **Pros:** No licensing fees, solid performance, good cloud management, reasonable price
- **Cons:** Fewer features than full Aruba (no RADIUS support on Instant On, limited VLAN capabilities), not suitable for complex healthcare deployments
- **Best for:** Very small practices with simple wireless needs

### Open Source / Self-Hosted

**Ubiquiti UniFi** — The most popular "prosumer" wireless platform, widely used in small and medium healthcare practices. UniFi provides a powerful management interface, enterprise features (VLANs, RADIUS, band steering), and no ongoing licensing fees.

- **Pros:** Excellent price-performance ratio, no licensing fees, good management UI, large community, frequent hardware refreshes, integrates with UniFi switches and gateways
- **Cons:** Firmware quality can be inconsistent (always wait 2-4 weeks before deploying new firmware), support is community-based (no enterprise support contract), occasional cloud management outages, less sophisticated RF management than Aruba or Ruckus
- **Best for:** Cost-conscious practices with capable IT support, small to medium deployments

**Configuration note for UniFi in healthcare:** Run the UniFi Controller on a dedicated Cloud Key Gen2 Plus or self-hosted on a local server—do not rely solely on Ubiquiti's cloud hosting for a healthcare environment. You need the controller available even if the internet is down, and you want local control over your management platform.

### Managed Service Provider

Most MSPs include wireless management as part of their network management contract. The MSP selects, deploys, and manages the wireless infrastructure.

- **Pros:** Expert deployment, ongoing management, troubleshooting support
- **Cons:** MSP may choose equipment based on their margin rather than your needs, vendor lock-in to MSP's preferred platform
- **Key requirement:** Ensure the practice owns the hardware and has administrative access to the management platform, even if the MSP handles day-to-day operations.

### Custom / Hybrid

The ideal approach for medium and large practices: engage a wireless specialist for the initial site survey and design, deploy enterprise-grade hardware (Aruba or Ubiquiti), and then either manage in-house or contract ongoing management to an MSP.

Critical: **Always get a professional wireless site survey before deployment.** The $1,500-3,000 cost of a proper survey pays for itself by avoiding the $5,000-10,000 cost of re-doing a failed wireless deployment.

## Vendor Landscape

| Vendor | Product Line | Strengths | Weaknesses | Price Point |
|--------|-------------|-----------|------------|-------------|
| **Ubiquiti** | UniFi U6/U7 series | Best price-performance, no licensing, good UI | Community support only, occasional firmware issues | $ |
| **Meraki (Cisco)** | MR series | Simplest cloud management, excellent analytics | Expensive licensing, APs brick without license | $$$$ |
| **Aruba (HPE)** | AP-500/600 series, Instant On | Best RF management, enterprise-grade, strong healthcare presence | Complex management (full Aruba), higher cost | $$-$$$ |
| **Ruckus (CommScope)** | R550/R750/R850 | Best-in-class dense environment performance, patented antenna technology | Higher cost, management platform transitions, ownership changes | $$$ |
| **Aruba Instant On** | AP22/AP25 | No licensing fees, simple cloud management | Limited features, no RADIUS on Instant On | $$ |
| **TP-Link Omada** | EAP series | Very low cost, improving management platform | Less proven in healthcare, limited enterprise features | $ |

**My honest recommendation by practice size:**
- **Small (1-3 providers):** Ubiquiti UniFi U6 Pro or Aruba Instant On AP25
- **Medium (4-15 providers):** Ubiquiti UniFi U6 Enterprise or Aruba AP-535
- **Large (15+ providers):** Aruba AP-635 with Aruba Central or Ruckus R750

## Compliance & Regulatory Notes

**HIPAA and Wireless:**

- **Encryption is mandatory.** All wireless networks carrying ePHI must use WPA3-Enterprise (preferred) or WPA2-Enterprise with AES encryption at minimum. WPA2-Personal (PSK) is acceptable for medical device networks where devices do not support 802.1X, but the PSK must be strong (20+ random characters) and rotated at least annually.

- **Network segmentation.** Guest WiFi must be on a completely separate VLAN from clinical systems, with firewall rules preventing any cross-traffic. Medical device WiFi should be on its own VLAN. This is not optional—it is a fundamental HIPAA requirement for "reasonable and appropriate" safeguards.

- **802.1X/RADIUS authentication** for the clinical wireless network provides individual user authentication, audit trail of who connected when, and the ability to immediately revoke access when an employee departs. This is significantly more secure than a shared password (PSK).

- **Wireless Intrusion Prevention (WIPS)** — Larger practices should enable WIPS to detect rogue access points (e.g., an employee plugging in a personal WiFi hotspot) and unauthorized clients. Meraki, Aruba, and Ruckus all include WIPS capabilities. Rogue AP detection is specifically relevant to HIPAA §164.312(a)(1) access controls.

- **Logging** — Wireless association and disassociation events, authentication successes and failures, and rogue AP detections should all be logged and retained. Forward wireless logs to your syslog server alongside firewall logs.

**FCC compliance:** All commercial access points sold in the US are FCC certified. Do not modify antenna configurations or power levels beyond manufacturer specifications. Do not use access points imported from other regulatory regions.

## Common Mistakes

1. **Installing APs without a site survey.** Guessing at AP placement leads to dead spots, excessive interference from overlapping coverage, and wasted money on too many or too few APs. A proper survey costs $1,500-3,000 and is worth every dollar.

2. **Using consumer-grade access points.** A Netgear Nighthawk or Linksys Velvet mesh system has no place in a healthcare practice. These devices lack VLAN support, enterprise authentication, centralized management, and the RF management needed for a clinical environment.

3. **Single SSID with no segmentation.** Broadcasting one WiFi network for everything—providers, patients, medical devices—is a security violation and a performance problem. Implement separate SSIDs mapped to separate VLANs.

4. **Too many SSIDs.** Conversely, every SSID consumes airtime for beacon frames. More than 3-4 SSIDs per AP degrades performance. Consolidate where possible using RADIUS-assigned VLANs (one SSID, dynamically assigned to different VLANs based on user credentials).

5. **Shared passwords (PSK) for clinical networks.** When someone leaves the practice, that password should be changed across all devices. With a shared PSK on 50 devices, this is operationally impossible. Use 802.1X/RADIUS for clinical WiFi.

6. **Ignoring 5 GHz and 6 GHz bands.** Many practices deploy APs but leave most clients on the congested 2.4 GHz band. Configure band steering to push capable devices to 5 GHz or 6 GHz (WiFi 6E). Disable 2.4 GHz on the clinical SSID if all clinical devices support 5 GHz.

7. **Mounting APs in wrong locations.** APs mounted in closets, behind metal ductwork, or in corner rooms provide poor coverage. APs should be ceiling-mounted in open areas for optimal omnidirectional coverage. Consult the site survey.

8. **Not planning for PoE power budgets.** WiFi 6 and 6E access points can draw 25-30 watts each under load. Ensure your PoE switches have sufficient power budget for all connected APs plus phones and cameras. An oversubscribed PoE switch will shut down ports when the power budget is exceeded.

9. **Neglecting firmware updates.** Wireless access points need firmware updates for security patches and performance improvements. Establish a quarterly update cycle. Test on one AP first before rolling out to all.

10. **No monitoring after deployment.** A wireless network that worked perfectly on day one may develop problems as the environment changes (new equipment, construction, furniture rearrangement). Implement ongoing monitoring and periodic re-surveys.

## Recommended Implementation Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| **Site Survey** | 2-5 days | Professional wireless site survey with heat mapping; document AP count and placement |
| **Design** | 1 week | SSID/VLAN plan, authentication architecture, QoS policies, vendor/model selection |
| **Procurement** | 1-2 weeks | Order APs, PoE switches (if needed), controller hardware |
| **Cabling** | 1-2 weeks | Run Cat6 to each AP location (coordinate with structured cabling project) |
| **AP Installation** | 1-3 days | Physical mounting, cable termination, power verification |
| **Configuration** | 2-3 days | Controller setup, SSID configuration, VLAN mapping, security policies, RADIUS integration |
| **Validation** | 2-3 days | Post-deployment survey, coverage verification, roaming testing, throughput testing, VLAN isolation testing |
| **Client Onboarding** | 1 week | Connect all wireless devices, configure 802.1X on managed devices, distribute medical device PSKs |

**Total: 4-8 weeks** from survey to full production. The site survey and cabling are often the longest phases. If cabling is being done as part of a larger network build-out, the wireless timeline can be compressed.

**Critical dependency:** The wired network (switches, VLANs, DHCP, RADIUS server) must be in place before wireless deployment. Do not attempt to deploy wireless before the wired backbone is ready.
