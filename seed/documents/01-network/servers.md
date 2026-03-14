# Server & On-Premises Infrastructure

## What Is This?

Server and on-premises infrastructure encompasses the physical computing hardware, virtualization platforms, storage systems, and supporting equipment (UPS, rack, cooling) that a primary care practice deploys in its own facility rather than relying entirely on cloud services. This includes tower or rack-mount servers from manufacturers like Dell, HPE, and Lenovo, along with the hypervisor software (Proxmox VE, VMware ESXi, Microsoft Hyper-V) that allows a single physical server to run multiple virtual machines for different functions.

The role of on-premises servers has shifted dramatically over the past decade. Where a practice once needed local servers for its EHR database, email, file storage, and practice management system, many of these workloads have migrated to the cloud. However, certain functions still benefit from or require local infrastructure: Active Directory domain controllers, local DNS/DHCP, print servers, on-premises EHR databases (for systems like eClinicalWorks, Amazing Charts, or legacy Centricity), local backup repositories, clinical device interface engines, and imaging PACS archives.

The "cloud vs. on-prem" decision is rarely all-or-nothing. Most modern primary care practices operate in a hybrid model where some workloads run locally and others run in the cloud.

## Why Does a Primary Care Practice Need This?

Several scenarios make on-premises server infrastructure necessary or strongly preferable:

**On-premises EHR deployments.** If your EHR runs on a local database (SQL Server, MySQL, or PostgreSQL), you need a server to host it. Systems like eClinicalWorks V11 on-prem, Amazing Charts, Practice Partner, or legacy Centricity require local server infrastructure. Even some "cloud" EHRs maintain local components -- athenahealth's Collector agent, for instance, runs locally for device integration.

**Clinical device integration.** Many medical devices (ECG machines, spirometers, vital signs monitors, lab analyzers) connect to interface engines running on local servers. Mirth Connect, Rhapsody, or vendor-specific integration services often need a local host to receive HL7 or serial data from devices before forwarding results to the EHR.

**Active Directory and network services.** Practices with more than 10-15 workstations benefit significantly from centralized user management via Active Directory (or its open-source equivalent). This provides single sign-on, group policy enforcement, centralized password management, and HIPAA-compliant audit logging.

**Local backup and disaster recovery.** Even when primary backups go to the cloud, a local backup copy enables much faster recovery. Restoring 500 GB of EHR data from the cloud over a 200 Mbps connection takes 5-6 hours; restoring from a local NAS takes 20-30 minutes.

**Performance and latency.** Some workflows -- particularly those involving large imaging files, pathology slides, or database-intensive EHR operations -- perform measurably better when the server is on the local network rather than across an internet connection.

## How to Decide If You Need It

**You likely need on-premises servers if:**
- Your EHR is an on-premises deployment
- You have more than 15 workstations and need centralized management
- You run clinical devices that require local interface engines
- You maintain in-office imaging with a local PACS
- You need a local backup target for rapid recovery

**You can likely go fully cloud if:**
- Your EHR is cloud-hosted (athenahealth, Practice Fusion, DrChrono)
- You have fewer than 10-15 workstations
- Your clinical devices integrate directly with the cloud EHR
- You use a cloud identity provider (Azure AD / Entra ID, Google Workspace)
- You are comfortable with cloud-only backup

**The hybrid middle ground (most common):** A single modest server running Active Directory, DHCP, DNS, a local backup repository, and an interface engine, while your EHR, email, file storage, and practice management run in the cloud.

## Order of Operations

1. **Inventory your workloads.** List every application and service currently running locally. Identify which must remain local, which can migrate to cloud, and which are candidates for either.
2. **Size the server.** Total up CPU, RAM, and storage requirements for the workloads that will stay local. Add 30-50% headroom for growth and virtualization overhead.
3. **Choose a virtualization platform.** For healthcare, the practical choices are Proxmox VE (open-source, no licensing cost), VMware ESXi (industry standard, $500-2,000/year licensing), or Microsoft Hyper-V (included with Windows Server, $1,000-6,000 for OS licensing).
4. **Select hardware.** Purchase from a tier-one vendor (Dell, HPE, Lenovo) with a 3-5 year warranty including next-business-day on-site parts replacement.
5. **Plan for redundancy.** At minimum: RAID storage (RAID 1 for OS, RAID 5 or 10 for data), redundant power supplies, and a UPS with at least 30 minutes of runtime.
6. **Install and configure.** Build the server, install the hypervisor, create VMs, migrate or install workloads, and configure backup.
7. **Establish monitoring.** Use tools like PRTG, Zabbix, or the vendor's built-in management (Dell iDRAC, HPE iLO) to monitor hardware health, disk space, and performance.
8. **Document everything.** Server configurations, IP addresses, admin credentials (stored in a password manager), backup schedules, and recovery procedures.

## Options by Practice Size

**Solo / 1-2 Providers (fewer than 10 users):**
- Consider going fully cloud if your EHR supports it
- If a local server is needed: Dell PowerEdge T150 or HPE ProLiant ML30 Gen11 tower server ($1,500-3,000)
- 32 GB RAM, 2x 1TB SSD in RAID 1, Intel Xeon E-2400 series
- Proxmox VE (free) or Windows Server Essentials
- UPS: APC Smart-UPS 1500VA ($400-600)
- Total: $2,500-5,000

**Small Group / 3-5 Providers (10-25 users):**
- Dell PowerEdge T350 or HPE ProLiant ML110 Gen11 tower ($3,000-6,000)
- 64 GB RAM, 4x 1TB SSD in RAID 10, Intel Xeon E-2400 series
- VMware ESXi or Proxmox VE with 2-3 VMs (AD/DC, interface engine, backup)
- Separate NAS for backup: Synology DS1621+ ($800-1,200 + drives)
- UPS: APC Smart-UPS 2200VA ($700-1,000)
- Total: $5,000-10,000

**Medium Group / 6-15 Providers (25-75 users):**
- Dell PowerEdge R750xs or HPE ProLiant DL380 Gen11 rack server ($8,000-15,000)
- 128-256 GB RAM, 8x SSD in RAID 10, dual Intel Xeon Scalable processors
- Consider a two-node cluster for high availability
- VMware vSphere Standard or Proxmox VE cluster
- Dedicated backup server or appliance (Veeam + repository, $3,000-8,000)
- 42U rack enclosure ($800-2,000), PDUs, patch panels
- UPS: APC Smart-UPS 3000VA or rack-mount UPS ($1,500-3,000)
- Total: $15,000-35,000

## Options Analysis

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Fully Cloud** | No hardware to maintain, no upfront capital, automatic updates, accessible from anywhere | Monthly recurring cost, dependent on internet, less control, potential latency | Small practices with cloud EHR |
| **Single Tower Server** | Simple, quiet, no rack needed, affordable, easy to manage | Single point of failure, limited expandability | Solo-small group with modest needs |
| **Rack Server** | Enterprise-grade reliability, expandable, redundant components, remote management (iDRAC/iLO) | Noise, heat, requires dedicated space, higher cost | Medium groups, on-prem EHR |
| **Two-Node HA Cluster** | Eliminates server as single point of failure, live migration during maintenance | Significantly higher cost and complexity, requires shared storage or replication | Larger groups where downtime is unacceptable |
| **Micro Server / NUC** | Ultra-compact, silent, low power, inexpensive ($300-800) | Not enterprise-grade, limited redundancy, consumer-grade components | Edge cases: single-purpose interface engines, small DHCP/DNS only |

**Virtualization Platform Comparison:**

| Platform | License Cost | Strengths | Weaknesses |
|----------|-------------|-----------|------------|
| **Proxmox VE** | Free (support subscriptions optional, $100-400/year/server) | No licensing cost, KVM-based, excellent web UI, good ZFS support, active community | Smaller commercial ecosystem, fewer enterprise integrations |
| **VMware ESXi / vSphere** | $500-2,000+/year per server | Industry standard, massive ecosystem, best enterprise features, broadest hardware support | Broadcom acquisition created licensing uncertainty and price increases, requires vCenter for full features |
| **Microsoft Hyper-V** | Included with Windows Server ($1,000-6,000 for OS license) | Tight Windows integration, included with Windows Server, System Center management | Weaker Linux VM support, less flexible than VMware/Proxmox, Hyper-V Server free edition discontinued |

## Vendor Landscape

**Server Hardware:**
- **Dell PowerEdge** -- T-series (tower) and R-series (rack). Most popular in SMB healthcare. Strong iDRAC remote management. ProSupport Plus warranty recommended ($300-800/year).
- **HPE ProLiant** -- ML-series (tower) and DL-series (rack). Excellent iLO remote management. Strong in healthcare vertical. Comparable to Dell in reliability.
- **Lenovo ThinkSystem** -- ST-series (tower) and SR-series (rack). Often 10-15% less expensive than Dell/HPE for equivalent specs. XClarity management.
- **Supermicro** -- Lower cost, popular with Proxmox users. Less polished management tools. Consider only if you have experienced IT staff.

**Backup Software:**
- **Veeam Backup & Replication** -- Industry leader, Community Edition free for up to 10 VMs. Paid editions $500-2,000/year.
- **Acronis Cyber Protect** -- Combined backup and security. Popular with MSPs. $50-80/workload/year.
- **Synology Active Backup** -- Free with Synology NAS hardware. Solid for SMB.

**Management and Monitoring:**
- Dell iDRAC / HPE iLO: Built-in hardware management with remote console, hardware health monitoring, and remote power control.
- PRTG Network Monitor: Free for up to 100 sensors. Excellent for SMB server and network monitoring.

## Compliance & Regulatory Notes

- **Physical security** (45 CFR 164.310): Servers must be in a locked room or cabinet with access limited to authorized personnel. A server under a desk in an unlocked office is a HIPAA violation waiting to happen.
- **Encryption at rest** (45 CFR 164.312(a)(2)(iv)): ePHI stored on servers should be encrypted. Use BitLocker (Windows), LUKS (Linux), or self-encrypting drives (SEDs). This is listed as "addressable" in HIPAA, meaning you must implement it or document why you chose not to -- and "it was too hard" is not an acceptable reason.
- **Audit logging** (45 CFR 164.312(b)): Servers hosting ePHI must log access attempts. Active Directory provides this for Windows environments. Ensure logs are retained for at least 6 years (HIPAA retention requirement).
- **Backup and recovery** (45 CFR 164.308(a)(7)): Backups must be tested regularly. A backup that has never been restored is not a backup -- it is a hope.
- **Disposal** (45 CFR 164.310(d)(2)(i)): When servers are decommissioned, drives must be securely wiped (NIST 800-88 guidelines) or physically destroyed. Obtain certificates of destruction.

## Common Mistakes

1. **Buying consumer-grade hardware.** A Dell Inspiron desktop or a gaming PC running Windows 11 is not a server. Enterprise servers have ECC RAM (error-correcting), redundant power supplies, hot-swap drives, remote management, and 3-5 year warranties with on-site service. The $500 you save buying consumer hardware will cost you $5,000 in downtime when it fails.
2. **No UPS.** Power fluctuations corrupt databases. A brief outage can cause filesystem damage that takes hours to repair. Every server needs a UPS with sufficient runtime to allow graceful shutdown, and the UPS should be connected via USB for automatic shutdown signaling.
3. **Running without RAID.** A single drive failure should never take down a practice. RAID 1 (mirroring) is the minimum; RAID 10 is preferred for performance-critical workloads. Always keep a hot spare drive on the shelf.
4. **Ignoring firmware and patch management.** Server firmware (BIOS, RAID controller, NIC) and OS patches need regular updates. Unpatched servers are the number-one vector for ransomware in healthcare.
5. **No monitoring.** If a RAID drive fails and nobody notices, you are running on a degraded array. If a second drive fails, you lose data. Monitoring with automatic alerts is essential.
6. **Over-buying.** A five-provider practice does not need a $40,000 two-node VMware cluster. Right-size the infrastructure to actual workloads and growth projections.
7. **Under-buying RAM.** RAM is the single most impactful spec for virtualized environments. Buy more than you think you need -- it is far cheaper than a forklift upgrade later.

## Recommended Implementation Timeline

**Weeks 1-2: Assessment and Planning**
- Inventory all applications and services; determine what stays on-prem vs. cloud
- Size CPU, RAM, and storage requirements
- Select virtualization platform
- Obtain quotes from Dell, HPE, and/or Lenovo (or through your MSP)

**Weeks 3-4: Procurement**
- Order server hardware (typical lead time 1-3 weeks for in-stock configurations, 4-8 weeks for custom builds)
- Order UPS, rack (if needed), and backup storage
- Procure software licenses (Windows Server, VMware, backup software)

**Weeks 5-6: Build and Configuration**
- Receive and rack/place hardware
- Install hypervisor
- Create virtual machines and install operating systems
- Configure storage, networking, and backup

**Weeks 7-8: Migration and Testing**
- Migrate workloads from old hardware or configure new services
- Configure monitoring and alerting
- Perform full backup and test restore
- Document all configurations and procedures

**Week 9: Go-Live and Validation**
- Cut over to new server infrastructure
- Monitor closely for one week
- Verify all integrations (EHR, clinical devices, backup) are functioning
- Conduct a fire drill: simulate a drive failure, test UPS shutdown, verify backup restore

**Ongoing:**
- Monthly OS patching (schedule a maintenance window)
- Quarterly firmware updates
- Annual backup restore test
- Plan for hardware refresh at year 4-5 (before warranty expires)
