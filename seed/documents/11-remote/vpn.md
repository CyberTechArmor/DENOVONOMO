# VPN & Remote Access

## What Is This?

A Virtual Private Network (VPN) creates an encrypted tunnel between a remote user's device and the practice's network, allowing staff to securely access clinical and administrative systems from outside the office. When a physician checks lab results from home, a billing specialist works remotely on claims, or a practice manager accesses financial reports from a conference, a VPN ensures that the data traversing the public internet is encrypted and that the remote user is authenticated before accessing practice resources.

Remote access in a healthcare context extends beyond VPN to encompass the complete framework for secure off-site connectivity: VPN tunnels for network-level access, remote desktop solutions for accessing specific workstations, cloud application access controls, multi-factor authentication (MFA), device management policies, and session management rules. VPN is the foundational technology, but a complete remote access strategy addresses all the ways practice staff interact with systems and data outside the physical office.

For primary care practices, remote access has evolved from a convenience (physicians reviewing charts from home occasionally) to an operational necessity. Telehealth requires providers to access the EHR from home or satellite locations. After-hours on-call responsibilities require access to patient records. Billing and administrative staff may work remotely part-time or full-time. Practice managers and owners need financial and operational data access from anywhere. The COVID-19 pandemic accelerated this shift dramatically, and the hybrid work model has become permanent for many healthcare administrative roles.

There are two primary VPN architectures relevant to primary care practices. **Site-to-site VPN** connects two fixed locations (e.g., a main office and a satellite clinic) through a persistent encrypted tunnel between their network routers or firewalls. **Remote access VPN** connects individual users to the practice network from variable locations through VPN client software on their devices. Most primary care practices need remote access VPN for staff connectivity and may also use site-to-site VPN for multi-location networking.

## Why Does a Primary Care Practice Need This?

**HIPAA Security Rule compliance.** The HIPAA Security Rule requires encryption of ePHI in transit (45 CFR 164.312(e)(1)). When staff access patient data remotely over the internet, VPN provides the encryption that satisfies this requirement. While some cloud-based EHRs use HTTPS encryption natively (and this may be sufficient for accessing that specific application), practices that maintain any on-premises systems, file shares, or applications containing PHI need VPN for remote access.

**Protecting against data interception.** Without VPN, data transmitted between a remote user and the practice network travels across the open internet, potentially traversing public Wi-Fi networks, ISP infrastructure, and multiple routing hops -- any of which could be monitored by malicious actors. VPN encryption ensures that even if network traffic is intercepted, the data is unreadable.

**Network access control.** VPN provides a gatekeeping function. Before a remote user can access practice network resources, the VPN system authenticates their identity (username/password plus MFA), verifies their device meets security requirements (endpoint compliance checking), and can enforce policies about what resources they can access once connected. This is a critical layer of defense against unauthorized access.

**Supporting telehealth and hybrid work.** Telehealth visits require providers to access the EHR, imaging, lab results, and other clinical systems in real-time during the patient encounter. This must work reliably and securely from the provider's home or other remote location. Similarly, administrative staff working remotely need secure access to practice management, billing, and communication systems.

**Multi-location connectivity.** Practices with multiple office locations need secure networking between sites. A site-to-site VPN connects the locations through encrypted tunnels over the internet, providing a cost-effective alternative to expensive leased-line connections (MPLS) while maintaining security.

## How to Decide If You Need It

You need VPN or equivalent secure remote access if any of the following apply:

- Any staff member accesses practice systems containing PHI from outside the physical office.
- Providers conduct telehealth visits from home or other locations.
- You have on-call providers who need remote EHR access.
- Administrative staff work remotely (even occasionally).
- Your practice has multiple physical locations.
- Your IT support provider needs remote access for management and troubleshooting.

If your practice is entirely cloud-based (cloud EHR, cloud practice management, no on-premises servers or file shares), and all applications are accessed via HTTPS through a web browser, a traditional VPN may not be strictly necessary -- the HTTPS encryption provides transit encryption for each application independently. However, even cloud-centric practices benefit from VPN because it provides an additional security layer, enables network-level access controls, and supports access to any resources that are not cloud-based (network printers, on-premises lab interfaces, local file shares).

## Order of Operations

1. **Assess remote access requirements.** Identify who needs remote access, what systems they need to access, from what devices, and how frequently. Categorize by role: providers (EHR, imaging, telehealth), billing (PM system, clearinghouse), management (financial systems, reports), IT (all systems for support).
2. **Evaluate current security posture.** Confirm that MFA is already implemented for all remote-capable systems. Assess endpoint security on devices that will be used remotely. Review existing firewall and network security.
3. **Choose VPN architecture.** For most primary care practices, a VPN built into the existing firewall/UTM device is the most practical approach. If you already have a Fortinet, SonicWall, or Meraki firewall, it likely includes VPN capability.
4. **Implement MFA.** If not already in place, implement multi-factor authentication for all VPN connections. This is non-negotiable for healthcare remote access. VPN without MFA provides encryption but inadequate authentication.
5. **Deploy VPN.** Configure the VPN server (typically on the firewall), deploy VPN client software to authorized devices, create user accounts, and test connectivity.
6. **Establish policies.** Document remote access policies: who is authorized, what devices are permitted, what security requirements apply (device encryption, screen lock, antivirus), and what activities are prohibited (accessing PHI from public locations without privacy screens, using personal devices without MDM enrollment).
7. **Train users.** Train all remote access users on VPN connection procedures, security requirements, and incident reporting.
8. **Monitor and maintain.** Monitor VPN connection logs for anomalies. Keep VPN software updated. Review access policies annually.

## Options by Practice Size

**Solo/Small Practice (1-5 providers, fewer than 15 staff):**
VPN functionality built into the existing firewall (FortiGate, SonicWall TZ, Meraki MX). 5-15 concurrent VPN users. MFA through the firewall vendor's authentication service or a separate MFA provider (Duo, Microsoft Authenticator). Budget: $0-$100/month beyond existing firewall costs (VPN is typically included).

**Mid-Size Group (6-15 providers, 15-50 staff):**
Firewall-integrated VPN with dedicated VPN licenses (if required). Formal remote access policies. Device management (MDM) for practice-owned remote devices. Budget: $100-$500/month including VPN licensing, MFA, and monitoring.

**Large Group (16+ providers, 50+ staff, multiple locations):**
Enterprise VPN with site-to-site tunnels between locations, remote access VPN for staff, Zero Trust Network Access (ZTNA) for granular application-level access, and comprehensive endpoint management. Budget: $500-$2,000/month.

## Options Analysis

**Fortinet FortiGate VPN (included with FortiGate firewall, $0-$50/month additional for SSL VPN licenses):**
FortiGate firewalls include both IPsec and SSL VPN capabilities. FortiClient is the endpoint VPN client (free for basic VPN, $2-$4/endpoint/month for full endpoint protection suite). Fortinet also offers ZTNA (Zero Trust Network Access) through FortiClient and FortiGate for practices moving beyond traditional VPN. Strengths: integrated with the firewall (no separate VPN appliance), strong performance, FortiClient combines VPN with endpoint protection, ZTNA capability for advanced deployments, widely supported by MSPs. Weaknesses: FortiClient licensing adds cost if using the full EPP/ZTNA features, requires Fortinet firewall ecosystem, configuration complexity for advanced features.

**WireGuard (Free, open-source):**
A modern, lightweight VPN protocol known for its simplicity, speed, and small codebase. WireGuard uses state-of-the-art cryptography (Curve25519, ChaCha20, Poly1305) and is built into the Linux kernel. Available for Windows, macOS, iOS, Android, and Linux. Strengths: exceptionally fast (outperforms OpenVPN and IPsec in most benchmarks), minimal attack surface due to small codebase (~4,000 lines vs. OpenVPN's ~100,000), modern cryptography, easy to configure, excellent mobile performance (handles network transitions seamlessly). Weaknesses: relatively new (may not satisfy auditors looking for established protocols), limited commercial support, does not provide user-level authentication natively (requires wrapper solution like Tailscale or integration with identity provider), less feature-rich than commercial VPN solutions.

**OpenVPN (Community Edition: free; Access Server: $15/connection/month or ~$180/connection/year):**
The most widely deployed open-source VPN solution. OpenVPN Community Edition is free and highly configurable. OpenVPN Access Server adds a web-based management interface, LDAP/RADIUS/SAML authentication integration, and per-user access policies. Strengths: proven, mature, extensively audited, flexible configuration, widely supported by MSPs and consultants, Access Server simplifies management significantly, strong authentication integration. Weaknesses: slower than WireGuard, Community Edition requires command-line configuration expertise, SSL/TLS-based protocol can be slower on mobile networks, codebase is large and complex.

**Tailscale ($0 for personal/3 users, $6/user/month for business, custom for enterprise):**
A managed VPN solution built on WireGuard that simplifies deployment by handling key management, authentication, and network configuration through a cloud-based coordination service. Devices authenticate through existing identity providers (Google Workspace, Microsoft 365, Okta) and can communicate directly (peer-to-peer) through NAT traversal. Strengths: dramatically simpler than traditional VPN deployment, uses existing identity provider for authentication, WireGuard performance, zero-configuration NAT traversal (works through most firewalls without port forwarding), excellent for distributed teams. Weaknesses: SaaS dependency (Tailscale's coordination servers must be available for initial connections), relatively new in healthcare, HIPAA compliance must be confirmed (Tailscale offers a BAA on business and enterprise plans), less familiar to traditional MSPs.

**Cisco AnyConnect / Meraki Client VPN ($2-$5/user/month as part of Meraki licensing):**
Enterprise VPN from Cisco, available both as standalone AnyConnect (on ASA or Firepower firewalls) and as Meraki Client VPN (on Meraki MX appliances). Strengths: enterprise-proven, strong compliance posture, excellent management and visibility through Meraki dashboard, integrates with Cisco's security ecosystem (Duo MFA, Umbrella DNS security). Weaknesses: higher cost than open-source alternatives, Meraki licensing model requires ongoing subscription, AnyConnect client can be resource-heavy.

**SonicWall VPN (included with SonicWall firewall):**
SonicWall firewalls include Global VPN Client (IPsec) and NetExtender (SSL VPN) capabilities. Strengths: integrated with SonicWall firewall, adequate for small to mid-size practices, licensing included with the firewall. Weaknesses: SonicWall client software has a mixed reputation for reliability, less feature-rich than Fortinet or Cisco for VPN specifically.

## Vendor Landscape

The VPN market is in a transitional period. Traditional network-level VPN (IPsec and SSL VPN through firewalls) remains the standard for most healthcare organizations, but the industry is moving toward Zero Trust Network Access (ZTNA), which provides application-level access rather than network-level access. Instead of putting a remote user "on the network" with broad access, ZTNA grants access only to specific applications after verifying the user's identity, device health, and authorization for each requested resource.

Major ZTNA solutions include Zscaler Private Access ($10-$20/user/month), Cloudflare Access ($7/user/month), Palo Alto Prisma Access ($10-$15/user/month), and Fortinet ZTNA (included with FortiClient ZTNA licenses). For most primary care practices, traditional VPN remains sufficient and ZTNA adds unnecessary complexity and cost. However, larger groups with complex remote access requirements and high security needs should evaluate ZTNA.

The emergence of WireGuard-based solutions (Tailscale, Netmaker, Firezone) represents a significant simplification of VPN deployment. These solutions eliminate much of the configuration complexity that has historically made VPN deployment a specialized IT task. For practices with limited IT resources, these managed WireGuard solutions offer an attractive balance of security and simplicity.

## Compliance & Regulatory Notes

**HIPAA Security Rule - Transmission Security (45 CFR 164.312(e)(1)):** Requires encryption of ePHI transmitted over electronic communications networks. VPN satisfies this requirement for network-level access. For application-level access (e.g., cloud EHR accessed via HTTPS), the application's own encryption may suffice, but defense-in-depth principles favor layering VPN with application-level encryption.

**HIPAA Security Rule - Access Controls (45 CFR 164.312(a)(1)):** Requires unique user identification, emergency access procedures, automatic logoff, and encryption. VPN systems must enforce individual user authentication (no shared VPN accounts), support automatic session termination after inactivity, and encrypt all transmitted data.

**Multi-Factor Authentication:** While HIPAA does not explicitly mandate MFA, it is considered a best practice and is effectively required by the cybersecurity standards that HIPAA references. HHS has issued guidance strongly recommending MFA for remote access. OCR investigations of breaches involving remote access without MFA typically result in findings of non-compliance.

**Device Security:** HIPAA requires safeguards for workstations used to access ePHI, including those used remotely. This includes device encryption, screen lock, antivirus, operating system patching, and physical controls. Remote access policies should address minimum device security standards.

**Logging and Monitoring:** VPN connection logs (who connected, when, from where, for how long) are part of the audit trail required by HIPAA. Retain VPN logs for a minimum of 6 years consistent with HIPAA record retention requirements.

## Common Mistakes

1. **VPN without MFA.** A VPN protected only by username and password is a breach waiting to happen. Stolen credentials are the most common attack vector in healthcare breaches. MFA is non-negotiable for all VPN connections.

2. **Split tunneling without understanding the implications.** Split tunneling allows remote users to access the internet directly for non-practice traffic while simultaneously connected to the practice VPN. This improves performance but means the user's device is simultaneously connected to the practice network and the open internet, creating a potential attack path. Full tunneling (all traffic goes through the VPN) is more secure but can be slower. Evaluate the tradeoff based on your risk assessment.

3. **Not revoking access promptly when employees depart.** VPN credentials for former employees must be disabled immediately upon separation. Include VPN access revocation in your offboarding checklist.

4. **Using personal devices without security requirements.** If staff connect to the VPN from personal devices, those devices must meet minimum security standards (current OS, encryption, antivirus, screen lock). Without these requirements, a compromised personal device becomes a conduit to the practice network.

5. **Not updating VPN software.** VPN server and client software must be kept current. VPN vulnerabilities are actively exploited -- the Fortinet VPN vulnerability (CVE-2023-27997) and Pulse Secure/Ivanti vulnerabilities (CVE-2023-46805) resulted in numerous healthcare breaches.

6. **Overcomplicating the solution.** Small practices do not need enterprise VPN infrastructure. A properly configured firewall with built-in VPN, MFA, and clear policies is sufficient. Avoid buying complexity you do not need.

## Recommended Implementation Timeline

**Weeks 1-2: Assessment**
Document remote access requirements by role. Inventory current remote access methods. Assess existing firewall VPN capabilities. Evaluate MFA readiness.

**Weeks 3-4: Design**
Select VPN approach (firewall-integrated, standalone, or managed service). Design access policies: who can connect, from what devices, to what resources. Select MFA method (push notification, TOTP, hardware token).

**Weeks 5-6: Implementation**
Configure VPN on the firewall or deploy the selected VPN solution. Set up MFA integration. Create user accounts. Configure access policies and logging.

**Weeks 7-8: Testing and Rollout**
Test with a pilot group of 2-3 users across different roles and device types. Verify connectivity to all required systems. Validate MFA workflow. Address performance or compatibility issues.

**Week 9: Training and Go-Live**
Distribute VPN client software and MFA enrollment instructions. Train all remote access users on connection procedures and security requirements. Document and distribute the remote access policy.

**Ongoing: Maintenance**
Monitor VPN connection logs weekly. Apply security patches to VPN infrastructure promptly. Review and update access policies quarterly. Revoke access immediately upon employee departure. Conduct annual review of remote access needs and security posture.
