# Patient Wi-Fi

## What Is This?

Patient Wi-Fi is a dedicated wireless network provided for patients and visitors in a healthcare facility, physically and logically separated from the practice's clinical and administrative networks. This is not simply sharing your office Wi-Fi password with patients --- it is a purposefully designed, isolated network segment that provides internet access to patient devices while maintaining strict separation from systems that handle electronic health records, billing data, medical devices, and other HIPAA-regulated information.

The technical foundation is network segmentation, typically achieved through VLANs (Virtual Local Area Networks) configured on managed switches and wireless access points. The patient Wi-Fi VLAN has its own IP address range, firewall rules, and internet gateway --- entirely walled off from the clinical VLAN where your EHR, printers, medical devices, and workstations operate. A captive portal (the splash page that appears when you connect to a Wi-Fi network at a coffee shop or hotel) provides terms of use acceptance, optional branding, and can collect basic analytics on usage.

Bandwidth management is equally important. A patient streaming Netflix in the waiting room should not degrade the network performance that clinicians depend on for EHR access, telehealth calls, or electronic prescribing. Quality of Service (QoS) rules prioritize clinical traffic over patient traffic, and bandwidth caps per device (typically 5--15 Mbps per device) prevent any single user from monopolizing the connection.

Patient Wi-Fi also increasingly serves operational purposes: powering patient check-in tablets, supporting patient-facing digital signage, enabling patients to complete digital intake forms on their own devices, and providing connectivity for remote patient monitoring devices.

## Why Does a Primary Care Practice Need This?

**Patient expectations.** Free Wi-Fi is a baseline expectation in nearly every public-facing business. A 2023 survey found that 74% of patients expect free Wi-Fi in medical waiting rooms, and 23% would consider it a negative factor in their experience if unavailable. For practices competing on patient experience, Wi-Fi is table stakes.

**Digital check-in and intake support.** If you have deployed or plan to deploy mobile check-in (Phreesia, Clearwave, Yosi Health), patients need Wi-Fi to complete intake on their personal devices. Without patient Wi-Fi, mobile check-in only works for patients with cellular data --- and cellular signal strength inside medical buildings is often poor due to building materials and equipment shielding.

**Network security mandate.** Practices that share their clinical Wi-Fi network with patients --- even with a "guest" password --- create a serious HIPAA security vulnerability. Any device on the same network segment as your EHR could potentially intercept traffic, scan for open ports, or exploit unpatched systems. HIPAA's Security Rule requires practices to implement technical safeguards to protect ePHI, which effectively mandates network segmentation when offering patient Wi-Fi.

**Operational device support.** Waiting room TVs, digital signage displays, patient education kiosks, and connected medical devices in exam rooms (blood pressure cuffs, scales, pulse oximeters) may need network connectivity. A dedicated patient/device VLAN keeps these off the clinical network.

**Reduced cellular data burden.** Patients in your waiting room attempting to use their phones for entertainment, communication, or health app access consume cellular data. Poor cellular signal leads to frustrated patients. Wi-Fi provides a better experience and reduces complaints about wait times.

## How to Decide If You Need It

You need patient Wi-Fi if:

- You offer or plan to offer mobile/tablet-based patient check-in or digital intake
- You currently share your clinical Wi-Fi password with patients (this must stop --- it is a security liability)
- Patient wait times average more than 10 minutes and you want to improve the waiting experience
- You have patient-facing devices (check-in tablets, digital signage, education kiosks) that need network connectivity
- Your building has poor cellular signal, and patients complain about connectivity
- You operate in a competitive market where patient experience differentiators matter

You can defer if:

- Your practice has near-zero wait times (direct-to-room workflows)
- Your building has excellent cellular signal throughout
- You do not use and do not plan to use any patient-facing digital tools
- You are in a shared office building where the building management provides guest Wi-Fi

Even practices that defer patient Wi-Fi should implement network segmentation to isolate any non-clinical devices (personal staff phones, break room smart TVs, IoT devices) from the clinical network.

## Order of Operations

1. **Assess current network infrastructure.** Document your current network topology: internet connection speed, modem, router, switches (managed or unmanaged), wireless access points, and any existing VLANs. If you have unmanaged switches or consumer-grade routers, you will need hardware upgrades to support VLANs.

2. **Determine bandwidth requirements.** Your internet connection must support both clinical and patient traffic. Clinical operations typically require 25--50 Mbps for a small practice; patient Wi-Fi adds 25--100 Mbps depending on patient volume. A practice with 50 simultaneous patient devices needs at least 100 Mbps total; 200--500 Mbps is recommended for comfort.

3. **Upgrade internet service if needed.** If your current plan is below 200 Mbps, consider upgrading. Business fiber (where available) provides 200--1,000 Mbps for $100--$300/month. Ensure your ISP provides a static IP if you need VPN or remote access capabilities.

4. **Implement managed network equipment.** VLANs require managed switches and enterprise-grade wireless access points. UniFi (Ubiquiti) provides excellent value for small-mid practices. Meraki (Cisco) is the premium option with cloud management. Aruba Instant On bridges the gap.

5. **Configure VLANs.** Create at minimum three VLANs: (1) Clinical/administrative network for EHR workstations, printers, and clinical devices; (2) Patient Wi-Fi for guest internet access; (3) Management VLAN for network equipment administration. More sophisticated setups add VLANs for VoIP phones, medical devices, and staff personal devices.

6. **Set up captive portal.** Configure a captive portal splash page that displays terms of acceptable use and requires acceptance before granting internet access. Include your practice name/logo for branding. Do not require personal information (name, email) for connection --- this creates HIPAA complications.

7. **Configure bandwidth controls.** Implement QoS rules prioritizing clinical VLAN traffic. Set per-device bandwidth caps on the patient VLAN (5--15 Mbps per device). Consider content filtering to block bandwidth-heavy categories (video streaming may or may not be appropriate depending on your bandwidth capacity).

8. **Test and verify isolation.** Before going live, verify that devices on the patient VLAN cannot reach any resources on the clinical VLAN. Test from a personal device connected to patient Wi-Fi: can you ping EHR servers, access shared printers, or see clinical workstations? If yes, your segmentation is incomplete.

## Options by Practice Size

**Solo/Small Practice (1 location, <2,000 sq ft)**
UniFi Express or UniFi Gateway Lite ($100--$200), 1--2 UniFi access points ($100--$150 each), and a managed switch ($50--$150). Total hardware: $350--$700. Internet: 200 Mbps business plan ($80--$150/month). No ongoing software fees (UniFi is self-managed). Configuration: IT consultant for 2--4 hours ($200--$600).

**Small Group (1--2 locations, 2,000--5,000 sq ft each)**
UniFi Dream Machine Pro or Meraki MX67 ($400--$700 gateway), 2--4 access points per location ($100--$300 each), managed PoE switches ($200--$400 each). Total hardware: $1,000--$3,000 per location. Internet: 300--500 Mbps per location ($150--$250/month). UniFi is free to manage; Meraki requires licensing at $150--$400/year per device.

**Medium Group (3--5 locations)**
Meraki or Aruba Instant On for centralized cloud management across sites. Meraki MX security appliance ($700--$1,200 per site), MR access points ($300--$600 each, 3--6 per location), MS switches ($400--$800 each). Meraki licensing: $150--$400/device/year. Total: $3,000--$8,000 per location hardware plus $2,000--$5,000/year licensing per location. Internet: 500 Mbps--1 Gbps per location.

**Large Group (5+ locations)**
Enterprise Meraki, Aruba, or Fortinet deployment with centralized network operations center (NOC) monitoring. Managed service provider (MSP) may handle deployment and monitoring for $500--$2,000/month per location. Total hardware: $5,000--$15,000 per location.

## Options Analysis

| Platform | Best For | Cloud Management | VLAN Support | Captive Portal | Cost Level |
|----------|----------|-----------------|-------------|----------------|-----------|
| **Ubiquiti UniFi** | Small-mid practices | Yes (self-hosted or cloud) | Full | Built-in | Low ($100--$300/AP) |
| **Cisco Meraki** | Multi-site, managed | Yes (cloud-native) | Full | Built-in | High ($300--$600/AP + licensing) |
| **Aruba Instant On** | Small-mid practices | Yes (cloud-native) | Full | Built-in | Medium ($200--$400/AP) |
| **TP-Link Omada** | Budget-conscious | Yes (cloud or local) | Full | Built-in | Low ($80--$200/AP) |
| **Fortinet FortiAP** | Security-focused | Yes (via FortiGate) | Full | Built-in | Medium-High |
| **Consumer mesh (eero, Orbi)** | Not recommended | Limited | No/limited | No | Low |

**Consumer-grade mesh systems (eero, Google Nest WiFi, Orbi) are not appropriate** for healthcare environments. They lack VLAN support, proper captive portal functionality, and the security controls required for HIPAA-compliant network segmentation. Do not use consumer equipment in a clinical setting, regardless of practice size.

## Vendor Landscape

**Ubiquiti (UniFi)** has become the de facto standard for small to mid-size healthcare practices. Their product line --- gateways, switches, access points, and cameras --- provides enterprise-grade features at 30--50% of the cost of Cisco or Aruba. UniFi's management interface is intuitive, VLAN configuration is straightforward, and the built-in captive portal handles patient Wi-Fi requirements. The primary limitation is support --- Ubiquiti provides community forums rather than enterprise-grade technical support, so practices should rely on their IT consultant or MSP for troubleshooting.

**Cisco Meraki** is the enterprise standard for multi-site healthcare organizations. Meraki's cloud-based dashboard provides centralized management, monitoring, and alerting across all locations from a single pane of glass. Network analytics show client usage patterns, application-level traffic analysis, and real-time health monitoring. The trade-off is cost: Meraki hardware is 2--3x the price of UniFi, and requires annual licensing ($150--$400/device/year) that makes the hardware non-functional if licensing lapses.

**Aruba Instant On** (by HPE) bridges the gap between UniFi and Meraki. It offers cloud management, VLAN support, and captive portal at a mid-range price point. Aruba's Instant On line targets small businesses and is simpler to configure than their enterprise products while maintaining professional-grade capabilities.

**Managed Service Providers (MSPs)** are the most practical solution for practices without in-house IT. A healthcare-focused MSP handles network design, equipment procurement, configuration, monitoring, and support for $300--$1,500/month depending on complexity. When evaluating MSPs, verify healthcare experience, HIPAA compliance understanding, and willingness to sign a BAA.

## Compliance & Regulatory Notes

**HIPAA Security Rule.** The Security Rule requires covered entities to implement technical safeguards to protect ePHI, including access controls and transmission security. Offering Wi-Fi access to patients on the same network as clinical systems violates these requirements. Network segmentation via VLANs, with firewall rules preventing cross-VLAN traffic, is the accepted solution.

**HIPAA risk analysis.** Your HIPAA risk analysis (required annually) must address patient Wi-Fi if implemented. Document the network architecture, VLAN configuration, firewall rules, and bandwidth controls. Demonstrate that clinical systems are inaccessible from the patient network.

**Captive portal and data collection.** If your captive portal collects any patient information (name, email, date of birth), that information may constitute PHI in a healthcare context. The safest approach is a simple terms-of-use acceptance with no data collection. If you collect data for analytics or marketing, ensure HIPAA compliance and appropriate consent.

**Content filtering and liability.** While not legally required, content filtering on patient Wi-Fi is advisable. Block categories that create liability exposure (explicit content, malware sites, illegal content). If minors use the waiting room, CIPA (Children's Internet Protection Act) considerations may apply if you receive E-Rate funding (unlikely for private practices but relevant for some FQHCs).

**Terms of acceptable use.** The captive portal should present terms that disclaim practice liability for data transmitted over the patient network, advise users that the network is not private, and prohibit illegal activity. Have your attorney review the terms.

**FCC compliance.** Wi-Fi equipment must comply with FCC regulations for unlicensed spectrum use. Commercial equipment from the vendors listed above is FCC-certified. Do not modify equipment settings beyond manufacturer specifications (e.g., boosting transmit power beyond legal limits).

## Common Mistakes

**Sharing the clinical Wi-Fi password with patients.** This is the most common and most dangerous mistake. It creates a direct HIPAA vulnerability. Implement proper network segmentation before offering any Wi-Fi access to patients.

**Using consumer-grade equipment.** Consumer routers and mesh systems lack VLAN support, captive portals, and proper security controls. Even if they work initially, they cannot provide the segmentation required for healthcare compliance.

**Insufficient bandwidth allocation.** Practices that install patient Wi-Fi on a 50 Mbps internet connection and then wonder why the EHR is slow are experiencing the predictable consequence of insufficient bandwidth. Ensure your total bandwidth supports both clinical and patient traffic with headroom. 200 Mbps minimum is recommended; 500 Mbps or more for larger practices.

**No bandwidth caps per device.** Without per-device bandwidth limits, one patient streaming 4K video consumes 25+ Mbps, degrading the experience for all other users and potentially impacting clinical operations. Cap patient devices at 5--15 Mbps each.

**Forgetting to test network isolation.** VLANs are only effective if firewall rules enforce isolation. After configuration, perform penetration testing from the patient network to verify that clinical resources are unreachable. Repeat this test after any network changes.

**Neglecting physical security of network equipment.** Network switches and access points in patient-accessible areas must be physically secured. A patient who can access a network switch port could potentially bypass Wi-Fi segmentation. Mount access points on ceilings or high walls, and place switches in locked network closets.

**No monitoring or maintenance plan.** Networks degrade over time: firmware vulnerabilities are discovered, access points fail, interference patterns change. Establish monthly monitoring and quarterly firmware update cycles. If using an MSP, ensure network monitoring is included in the service agreement.

## Recommended Implementation Timeline

**Week 1:** Assess current network infrastructure. Document topology, equipment, internet speed, and any existing VLANs. Identify gaps (unmanaged switches, consumer equipment, insufficient bandwidth).

**Week 2:** Design target network architecture. Define VLAN structure, IP address schemes, firewall rules, bandwidth allocation, and captive portal configuration. If using an MSP or IT consultant, engage them for design review.

**Week 3:** Procure equipment and upgrade internet service if needed. Order access points, managed switches, and gateway/firewall. Schedule internet upgrade installation if required.

**Week 4:** Install and configure equipment. Mount access points, rack switches, configure VLANs, set up captive portal, implement QoS rules. This typically requires 4--8 hours of on-site IT work for a single location.

**Week 5:** Test and validate. Verify VLAN isolation (patient network cannot reach clinical network). Test captive portal functionality on multiple device types (iOS, Android, Windows, Mac). Measure bandwidth allocation and QoS enforcement. Conduct a basic security scan from the patient network.

**Week 6:** Go live. Post Wi-Fi network name and connection instructions in waiting areas. Brief front-desk staff on patient Wi-Fi availability and basic troubleshooting (restart the access point, direct patients to the captive portal).

**Ongoing:** Monthly monitoring of network health and usage patterns. Quarterly firmware updates for all network equipment. Annual HIPAA risk analysis update to include patient Wi-Fi documentation. Semi-annual penetration testing of network segmentation.
