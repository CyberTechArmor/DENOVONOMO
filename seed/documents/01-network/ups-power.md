# UPS / Power Protection

## What Is This?

An Uninterruptible Power Supply (UPS) is a battery-backed power device that provides emergency power to connected equipment when utility power fails, fluctuates, or degrades. A UPS does three essential things:

1. **Battery backup** — Provides runtime on battery power during an outage, allowing systems to continue operating or shut down gracefully.
2. **Power conditioning** — Cleans the incoming power signal, removing surges, sags, brownouts, electrical noise, and harmonic distortion that can damage sensitive electronics.
3. **Surge protection** — Absorbs voltage spikes from lightning strikes, utility switching events, and heavy equipment cycling on and off (common in medical office buildings that share circuits with imaging equipment, elevators, or HVAC systems).

In a healthcare practice, the UPS protects the equipment that cannot afford to lose power: your firewall, switches, wireless controller, server (if on-premises), phone system, and potentially clinical workstations in critical areas. Without UPS protection, a momentary power flicker—common in commercial buildings—can reboot your firewall, drop your VoIP calls, disconnect your cloud EHR sessions, and corrupt data on any local servers.

UPS systems come in three topologies:

**Standby (Offline):** The cheapest type. Equipment runs on utility power normally; the UPS switches to battery only when it detects an outage. The switchover takes 5-12 milliseconds. Adequate for home use but the transfer time can cause sensitive equipment to hiccup. Not recommended for healthcare network infrastructure.

**Line-Interactive:** The most common type for small and medium healthcare installations. A continuously running autotransformer regulates voltage without switching to battery, and the battery engages only during a full outage. Transfer time is 2-4 milliseconds—fast enough that virtually all IT equipment rides through without disruption. Provides good power conditioning. This is the sweet spot for most practices.

**Online (Double-Conversion):** The gold standard. Equipment runs on battery power 100% of the time—the incoming utility power charges the batteries while the inverter continuously supplies clean power to the equipment. Zero transfer time. Perfect power conditioning. Used for critical infrastructure: servers, core network equipment, and medical devices that cannot tolerate any power variation. More expensive and generates more heat than line-interactive.

## Why Does a Primary Care Practice Need This?

Power quality in commercial office buildings is worse than most people realize. The utility grid delivers power that routinely includes:

- **Momentary outages** (less than 1 second) — Happen multiple times per month in most areas. Without a UPS, your firewall reboots, dropping all network connections for 3-5 minutes while it restarts.
- **Brownouts** — Sustained low voltage, especially during peak summer demand. Equipment running on low voltage draws more current, generates more heat, and can fail prematurely.
- **Surges** — Voltage spikes from lightning, utility switching, or large motors (elevators, compressors, medical imaging equipment) cycling on. A single surge can destroy a switch, firewall, or server power supply.
- **Electrical noise** — Harmonic distortion from fluorescent lighting, variable-speed drives, and other equipment on shared circuits.

The impact on a healthcare practice is concrete:

- **Firewall reboot** — 3-5 minutes of complete network outage. Every cloud EHR session drops. Every phone call disconnects. Every pending lab order is interrupted.
- **Switch reboot** — All wired devices lose connectivity. PoE devices (phones, access points, cameras) lose power.
- **Server crash** — If you have an on-premises server, an unclean shutdown risks data corruption, especially if a write operation was in progress.
- **Medical device disruption** — Some medical devices lose calibration or require restart procedures after a power interruption.

A UPS costing {{price:ups-1500va}} eliminates these risks for your network closet. It is one of the highest-ROI investments in healthcare IT.

## How to Decide If You Need It

Every network closet (MDF and IDF) in a healthcare practice must have UPS protection. This is not optional. The only decisions are:

1. **What topology?** Line-interactive for most applications. Online/double-conversion for critical servers and medical devices.
2. **How much capacity?** Measured in VA (volt-amps) or watts. Must exceed the total power draw of all connected equipment.
3. **How much runtime?** How many minutes do you need equipment to run on battery? Enough to ride through a typical outage (5-15 minutes) or enough to run until a generator starts (30-60 seconds)?
4. **Do you need a generator?** A UPS provides minutes of runtime. If you need hours of backup, you need a generator with the UPS bridging the gap until the generator starts.

**Generator consideration:** For practices where uptime is truly critical (urgent care, practices with in-office procedures, high-volume practices), a natural gas or propane generator provides hours or days of backup power. The UPS bridges the 10-30 second gap between utility failure and generator startup. Generator installation is a separate topic but should be considered alongside UPS planning. Typical cost: {{price:generator-small}} for a small practice, {{price:generator-medium}} for a medium practice.

## Order of Operations

1. **Inventory protected equipment** — List every device that will connect to UPS power: firewall, switches, access point PoE switches, server, phone system, critical workstations. Record the wattage or VA rating of each.
2. **Calculate total load** — Sum the wattage of all protected equipment. Add 20% for headroom.
3. **Determine runtime requirements** — Minimum: 10 minutes to ride through brief outages and allow graceful shutdown. Ideal: 20-30 minutes for longer outages.
4. **Select UPS topology and size** — Use vendor sizing tools (APC, CyberPower, and Eaton all have online calculators) to match load and runtime to a specific model.
5. **Plan physical installation** — Rack-mount units for server racks, tower units for small closets. Verify the UPS fits in the intended location and the floor can support the weight (larger UPS units are heavy—a 3000VA unit can weigh 80+ lbs).
6. **Install and configure** — Connect equipment to UPS outlets, connect UPS management interface to the network, configure shutdown scripts for servers, configure alert notifications.
7. **Test** — Pull the power cord from the wall and verify: equipment stays running, alerts fire, runtime matches expectations. Do this during a maintenance window, not during clinic hours.
8. **Document** — Record what is connected to each UPS outlet, runtime specifications, battery replacement schedule, and vendor support contact.
9. **Maintain** — Batteries degrade over time. Replace UPS batteries every 3-5 years, or sooner if the UPS reports battery health issues. Test UPS functionality quarterly.

## Options by Practice Size

### Small Practice (1-3 Providers)

A small practice typically has one network closet with a firewall, one switch, and possibly a small server or NVR. Total load is usually 200-500 watts.

**Recommended:**
- APC Smart-UPS 1500VA (SMT1500RM2U) — rack mount, line-interactive: {{price:ups-apc-1500va}}
- CyberPower PR1500RT2U — rack mount, line-interactive: {{price:ups-cyberpower-1500va}}
- Eaton 5P 1550VA — rack mount, line-interactive: {{price:ups-eaton-1550va}}

Any of these provides 15-25 minutes of runtime for a 300-watt load. Network management card (for SNMP monitoring and alerts) is often an add-on: {{price:ups-network-card}}.

**For critical clinical workstations:** Small tower UPS units at individual workstations: APC Back-UPS Pro 1500VA (BX1500M) at {{price:ups-workstation}} each. These provide 5-10 minutes of runtime—enough to save work and wait for power to return.

### Medium Practice Group (4-15 Providers)

Medium practices may have an MDF with heavier equipment (larger firewall, multiple switches, a server) and possibly one or two IDF closets. Total load per closet may be 500-1,500 watts.

**Recommended for MDF:**
- APC Smart-UPS 2200VA or 3000VA (SMT2200RM2U / SMT3000RM2U): {{price:ups-apc-3000va}}
- CyberPower PR3000RT2U: {{price:ups-cyberpower-3000va}}
- Eaton 5PX 3000VA: {{price:ups-eaton-3000va}}

**Recommended for IDFs:**
- APC Smart-UPS 1500VA: {{price:ups-apc-1500va}} each

**Total UPS budget:** {{price:ups-medium}} for a typical medium practice.

### Large Practice Group (15+ Providers)

Large practices with server rooms, multiple closets, and critical uptime requirements should consider online (double-conversion) UPS for the primary server room/MDF and line-interactive for IDFs.

**Recommended for server room/MDF:**
- APC Smart-UPS Online SRT 5000VA (SRT5KRMXLT): {{price:ups-apc-5000va-online}}
- Eaton 9PX 6000VA: {{price:ups-eaton-6000va}}
- With extended battery packs for 30-60 minute runtime: add {{price:ups-extended-battery}} per battery pack

**Total UPS budget:** {{price:ups-large}} for a typical large practice, not including generator.

## Options Analysis

### Off-the-Shelf / SaaS

UPS systems are physical devices—there is no SaaS option. The three major vendors dominate the market:

**APC (Schneider Electric)** — The market leader. Smart-UPS line is the de facto standard for IT infrastructure. Excellent management software (PowerChute), well-supported, widely available replacement batteries.
- **Pros:** Ubiquitous, excellent track record, easy battery replacement, strong management features, available everywhere
- **Cons:** Premium pricing, proprietary batteries (aftermarket options available but use genuine for warranty)
- **Best for:** Any practice wanting the most proven, widely-supported option

**CyberPower** — Strong value alternative with excellent price-performance. The Professional Rackmount (PR) series is well-suited for healthcare network closets.
- **Pros:** Significantly lower cost than APC at similar specs, good management software (PowerPanel), compatible battery sizes
- **Cons:** Slightly less established brand, fewer management integrations, less aftermarket support ecosystem
- **Best for:** Cost-conscious practices, IDFs, workstation protection

**Eaton** — Enterprise-grade UPS with excellent build quality. The 5P/5PX line is excellent for healthcare. Less consumer presence but strong in commercial/healthcare.
- **Pros:** Outstanding build quality, excellent online (double-conversion) options, strong enterprise management (Intelligent Power Manager), very good customer support
- **Cons:** Higher price than CyberPower, less widely available at retail, fewer battery replacement options
- **Best for:** Practices with critical uptime requirements, server rooms, environments needing double-conversion

### Open Source / Self-Hosted

**NUT (Network UPS Tools)** — Open-source UPS monitoring and management software that runs on Linux. Supports hundreds of UPS models via USB or SNMP. Can trigger automated server shutdown when battery runs low.

- **Pros:** Free, supports nearly all UPS brands, integrates with Linux servers and Proxmox, highly configurable
- **Cons:** Requires Linux expertise, no GUI management (CLI and config files), no vendor support
- **Best for:** Practices running Proxmox or Linux servers who want automated UPS-triggered shutdown

**apcupsd** — Open-source daemon specifically for APC UPS management. Simpler than NUT, well-documented.

### Managed Service Provider

Most MSPs include UPS monitoring in their managed services agreement, receiving alerts when a UPS switches to battery, has a failed battery, or has other issues. The practice typically purchases the UPS hardware, and the MSP manages the monitoring and battery replacement schedule.

### Custom / Hybrid

The standard approach: purchase UPS hardware directly (APC or CyberPower for best value), install network management cards for remote monitoring, and either self-monitor or have your MSP monitor. Battery replacement is straightforward and can be done by any competent IT person.

## Vendor Landscape

| Vendor | Series | Topology | Healthcare Fit | Typical Cost (1500VA) |
|--------|--------|----------|----------------|----------------------|
| **APC (Schneider)** | Smart-UPS SMT | Line-interactive | Excellent — industry standard | {{price:ups-apc-1500va}} |
| **APC (Schneider)** | Smart-UPS Online SRT | Online double-conversion | Excellent — critical systems | {{price:ups-apc-1500va-online}} |
| **CyberPower** | PR series | Line-interactive | Very good — excellent value | {{price:ups-cyberpower-1500va}} |
| **CyberPower** | OL series | Online double-conversion | Very good | {{price:ups-cyberpower-1500va-online}} |
| **Eaton** | 5P/5PX | Line-interactive | Excellent — premium build quality | {{price:ups-eaton-1550va}} |
| **Eaton** | 9PX | Online double-conversion | Excellent — enterprise | {{price:ups-eaton-1500va-online}} |
| **Tripp Lite** | SmartPro | Line-interactive | Adequate — lower tier | {{price:ups-tripplite-1500va}} |

## Compliance & Regulatory Notes

**HIPAA does not specifically mandate UPS systems.** However, the HIPAA Security Rule requires:

- **§164.310(a)(2)(ii) Facility Security Plan** — You must have policies and procedures to safeguard equipment from "unauthorized physical access, tampering, and theft." Power protection is part of safeguarding equipment.

- **§164.308(a)(7) Contingency Plan** — You must have a data backup plan, disaster recovery plan, and emergency mode operation plan. UPS systems are a fundamental component of disaster recovery and emergency operations. If your plan says "systems will remain operational during brief power outages," you need UPS to deliver on that promise.

- **§164.312(a)(2)(ii) Emergency Access Procedure** — Systems containing ePHI must be accessible during emergencies. A power outage is an emergency. UPS keeps systems running.

**Practical compliance note:** During a HIPAA audit or risk assessment, "What happens when the power goes out?" is a standard question. The correct answer involves UPS for immediate protection and a documented procedure for extended outages (generator, graceful shutdown procedures, paper-based fallback processes).

**Electrical code:** UPS installation must comply with NEC Article 480 (storage batteries) and local electrical codes. Large UPS systems (5000VA+) may require dedicated circuits and should be installed by a licensed electrician. Ensure adequate ventilation—UPS batteries generate heat, especially during charging and discharge cycles.

## Common Mistakes

1. **No UPS at all.** The most common and most inexcusable mistake. A $500 UPS protects $10,000-50,000 worth of network equipment and prevents costly downtime. There is no valid reason to skip this.

2. **Undersized UPS.** A UPS that is loaded to 90% of capacity provides minimal runtime and wears out batteries faster. Size for 60-70% of rated capacity to allow for growth and optimal battery life.

3. **Connecting non-essential equipment to the UPS.** Monitors, desk lamps, space heaters, and personal devices should not be on UPS power. Every watt of non-essential load reduces runtime for critical equipment. Most UPS units have both "battery + surge" and "surge only" outlets—use them appropriately.

4. **Never testing the UPS.** A UPS that has not been tested may not work when you need it. The batteries may be dead, the inverter may have failed, or the connected equipment may not handle the switchover. Test annually by pulling the utility power plug during a maintenance window.

5. **Ignoring battery replacement.** UPS batteries have a finite lifespan (3-5 years typically). The UPS will usually alert when batteries are degraded, but many practices ignore these warnings for months or years. A UPS with dead batteries is a surge protector, not a UPS.

6. **No network management card.** Without a network management card (or USB connection to a server running monitoring software), the UPS cannot send alerts when it switches to battery, when batteries are failing, or when load is too high. Install the management card and configure email alerts.

7. **Daisy-chaining power strips to UPS.** Plugging a power strip into a UPS is a fire hazard and violates the UPS warranty and electrical code. Use the UPS outlets directly, or use a PDU (power distribution unit) rated for UPS use in rack installations.

8. **Placing UPS in a sealed, unventilated closet.** UPS batteries generate heat, especially during charging and discharge. A closet that reaches 95F will dramatically shorten battery life (every 15F above 77F cuts battery life roughly in half). Ensure adequate ventilation or cooling in the UPS location.

9. **No graceful shutdown procedure.** If the outage outlasts the UPS runtime, servers should shut down cleanly before the batteries are exhausted. Configure automatic shutdown via PowerChute (APC), PowerPanel (CyberPower), or NUT (Linux). An unclean server shutdown risks data corruption.

10. **Forgetting about IDF closets.** The MDF gets a UPS, but the IDF closet with a 24-port PoE switch powering 15 phones and 3 access points gets nothing. When power flickers, the MDF stays up but half the practice loses phones and WiFi. Every closet with network equipment needs UPS protection.

## Recommended Implementation Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| **Load Assessment** | 1-2 days | Inventory all equipment to be protected; record wattage; calculate total load per closet |
| **UPS Selection & Procurement** | 1-2 weeks | Size UPS units; order hardware including network management cards and any additional battery packs |
| **Installation** | 1 day per closet | Rack-mount or place UPS; connect equipment; install network management card; configure IP and monitoring |
| **Configuration** | 1 day | Configure alerts (email, SNMP traps); set up automatic shutdown for servers; label UPS outlets |
| **Testing** | 1 day | Simulate power failure; verify runtime; validate alerts fire; confirm graceful shutdown works |
| **Documentation** | 1 day | Record UPS model, serial, install date, battery replacement date, connected equipment, alert recipients |

**Total: 2-4 weeks** from assessment to production. UPS installation is one of the simplest and fastest infrastructure projects, yet one of the most impactful.

**Maintenance schedule:**
- **Monthly:** Check UPS status LEDs or management interface; verify no alarms
- **Quarterly:** Run a brief self-test (most UPS units have a self-test button or can be triggered via management software)
- **Annually:** Perform a full discharge test during a maintenance window; verify all alerts and shutdown procedures work
- **Every 3-5 years:** Replace batteries (APC RBC series makes this tool-free in most models)
