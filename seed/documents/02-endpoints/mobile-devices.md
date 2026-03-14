# Mobile Devices & Tablets

## What Is This?

Mobile devices and tablets in a primary care practice include iPads, Microsoft Surface devices, Android tablets, and smartphones used by clinical and administrative staff for patient care activities, clinical documentation, point-of-care reference, patient education, and telehealth. These are distinct from the fixed clinical workstations in exam rooms -- mobile devices travel with the provider or are handed to the patient.

The most common clinical use cases for mobile devices in primary care include: provider rounding with a tablet for bedside documentation (in practices with observation or skilled nursing components), patient intake via a handed tablet, clinical photography (dermatology, wound documentation), point-of-care reference apps (UpToDate, Epocrates, DynaMed), telehealth visits from non-standard locations, patient education (showing diagrams, videos, discharge instructions), and electronic signature capture for consent forms.

Mobile Device Management (MDM) is the software layer that makes mobile devices viable in healthcare. MDM platforms like Jamf (for Apple devices), Microsoft Intune, VMware Workspace ONE, or Mosyle allow IT administrators to enforce security policies, deploy and update apps, remotely wipe lost or stolen devices, and ensure HIPAA compliance across a fleet of devices.

## Why Does a Primary Care Practice Need This?

Mobile devices fill gaps that fixed workstations cannot address:

**Clinical mobility.** Providers who move between exam rooms, procedure rooms, and their office benefit from a tablet that travels with them. Rather than logging into a different workstation in each room (which takes 15-30 seconds per login, hundreds of times per week), a provider can carry their active session on a tablet.

**Patient intake and forms.** Handing a patient an iPad to complete intake questionnaires, medication reconciliation, and consent forms is more efficient and accurate than paper forms. The data flows directly into the EHR without manual transcription, eliminating handwriting legibility issues and data entry errors.

**Clinical photography.** Documenting skin lesions, wounds, surgical sites, and physical findings with a device that has a quality camera and can attach images directly to the patient chart is a significant clinical documentation improvement over phone-camera-email-upload workflows that create HIPAA headaches.

**Telehealth flexibility.** While most telehealth happens from fixed workstations, a provider may need to conduct a telehealth visit from a location without a fixed workstation -- a consultation room, their home, or while covering another site.

**Patient education.** Showing a patient a 3D anatomy model, a medication side-effect profile, or a post-procedure care video on a tablet during the visit improves patient engagement and comprehension.

## How to Decide If You Need It

**You need mobile devices if:**
- Providers want to carry their EHR session between rooms
- You want digital patient intake (handed tablets for questionnaires and consent)
- You do clinical photography for dermatology, wound care, or other documentation
- You need flexibility for telehealth from non-standard locations
- Patient education materials are part of your care model

**You may not need mobile devices if:**
- Every location where providers work has a fixed workstation
- Patient intake is handled by front desk data entry or a self-check-in kiosk
- Clinical photography is not part of your workflow
- Telehealth is conducted exclusively from fixed workstations

**How many devices?** For clinical use, one tablet per provider is typical. For patient intake, one tablet per 2-3 exam rooms is standard (patients use them for 5-10 minutes at the start of a visit). For shared patient education, 2-3 tablets per practice is usually sufficient.

## Order of Operations

1. **Define use cases.** List exactly how mobile devices will be used -- clinical documentation, patient intake, photography, education, telehealth, or some combination. Each use case drives different hardware and software requirements.
2. **Choose a platform.** iPad (iPadOS) vs. Microsoft Surface (Windows) vs. Android. This is a critical decision that affects app availability, MDM options, and long-term management.
3. **Select an MDM platform.** This must be in place before deploying any devices. Do not deploy unmanaged mobile devices in a healthcare setting.
4. **Configure security policies.** Passcode requirements, encryption enforcement, automatic screen lock, remote wipe capability, app restriction, and network access policies.
5. **Select and deploy apps.** EHR mobile app (most major EHR vendors offer iOS/Android apps), clinical reference apps, camera/photography apps with HIPAA-compliant storage, and telehealth apps.
6. **Procure hardware.** Standardize on one model to simplify management, case selection, and peripheral compatibility.
7. **Enroll devices in MDM.** Configure via Apple Business Manager (ABM) / Automated Device Enrollment for zero-touch setup of iPads, or Autopilot for Surface/Windows devices.
8. **Deploy with protective cases.** Medical environments are hard on devices. Invest in quality cases from the start.
9. **Establish a charging and storage plan.** Where do devices charge overnight? Where are patient intake tablets stored between uses? A charging station or cart keeps devices organized and ready.

## Options by Practice Size

**Solo / 1-2 Providers (2-5 tablets):**
- iPad (10th generation) or iPad Air ($350-600 each)
- Apple Business Manager + Jamf Now or Mosyle Business MDM ($2-4/device/month)
- OtterBox Defender or Griffin Survivor case ($40-70 each)
- Per-device total: $450-750
- Practice total: $900-3,750

**Small Group / 3-5 Providers (5-12 tablets):**
- iPad Air or iPad Pro 11" ($600-1,100 each) for provider clinical use
- iPad (10th gen) ($350-450 each) for patient intake
- Jamf Pro or Microsoft Intune MDM ($4-8/device/month)
- Consider Compulocks or Maclocks enclosure for patient intake tablets ($80-150)
- Per-device total: $500-1,300
- Practice total: $2,500-15,600

**Medium Group / 6-15 Providers (12-30 tablets):**
- Standardize on iPad Air for clinical, iPad (standard) for patient use
- Jamf Pro for comprehensive Apple fleet management ($8-12/device/month)
- Charging cart for patient intake tablets (Bretford or Ergotron, $800-2,000)
- Dedicated clinical photography workflow with HIPAA-compliant image capture
- Per-device total: $500-1,300
- Practice total: $6,000-39,000

## Options Analysis

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **iPad (iPadOS)** | Best app ecosystem for healthcare, superior EHR app support, excellent camera, strong MDM via ABM/Jamf, long update lifecycle (5-6 years), patients familiar with the interface | No native Windows app support (must use web or Citrix), more expensive than Android, no file system flexibility | Most primary care practices -- clinical documentation, patient intake, photography |
| **Microsoft Surface Pro** | Full Windows -- runs any EHR client natively, full Office suite, pen input for handwriting, can replace a laptop | Heavier, shorter battery life, more complex management, more expensive, slower to boot | Practices with Windows-only EHR that requires local client, providers who want laptop replacement |
| **Microsoft Surface Go** | Smaller/lighter than Surface Pro, still runs Windows, lower cost | Underpowered for heavy EHR clients, small screen, mediocre battery life | Budget Windows tablet for light tasks |
| **Android Tablets (Samsung Galaxy Tab)** | Lower cost, flexible, good Samsung Knox MDM | Fragmented app ecosystem, fewer healthcare-optimized apps, EHR vendor support often iOS-first | Patient intake only, cost-sensitive practices |
| **Rugged Tablets (Panasonic Toughbook, Zebra)** | Extremely durable, waterproof, drop-proof | Very expensive ($2,000-4,000), heavy, often running older OS versions | Home health, mobile clinics, not typical for office-based primary care |

**MDM Platform Comparison:**

| MDM | Best For | Pricing | Key Strengths |
|-----|----------|---------|---------------|
| **Jamf Pro** | Apple-only fleets | $8-12/device/month | Deepest Apple integration, healthcare-specific features, zero-touch deployment |
| **Jamf Now** | Small Apple fleets (<25 devices) | $2-4/device/month | Simple, low-cost, adequate for basic management |
| **Microsoft Intune** | Mixed Apple/Windows/Android | $6-10/device/month (often included in Microsoft 365 Business Premium) | Cross-platform, integrated with Azure AD, good for Surface devices |
| **VMware Workspace ONE** | Large mixed fleets | $4-10/device/month | Enterprise-grade, strong conditional access, complex but powerful |
| **Mosyle Business** | Apple fleets, education-influenced | $1-3/device/month | Very affordable, good feature set, gaining healthcare traction |

## Vendor Landscape

**Hardware:**
- **Apple iPad**: iPad 10th generation ($349-449), iPad Air M2 ($599-749), iPad Pro 11" M4 ($999-1,199). For most clinical use, the iPad Air hits the sweet spot of performance, camera quality, and cost.
- **Microsoft Surface**: Surface Go 4 ($599-899), Surface Pro 10 ($1,099-2,599). Choose Surface only if Windows app compatibility is required.
- **Samsung Galaxy Tab**: Galaxy Tab A9+ ($219-329), Galaxy Tab S9 ($799-1,199). Primarily for patient-facing intake applications.

**Cases and Enclosures:**
- **OtterBox Defender**: Standard rugged case for clinical environments ($50-80).
- **Griffin Survivor**: Medical-grade, antimicrobial options available ($40-70).
- **Compulocks / Maclocks**: Enclosures for patient intake (wall mount, desk mount, floor stand), with security lock ($80-250).
- **Bouncepad**: Premium patient-facing tablet enclosures with customizable branding ($150-300).

**Clinical Photography:**
- Most practices use the iPad's built-in camera with a HIPAA-compliant capture workflow via the EHR's mobile app or a dedicated clinical photography app (Modica by PhotoExam, VECTRA by Canfield).
- **Avoid** using personal smartphones for clinical photography unless they are enrolled in MDM with a HIPAA-compliant workflow. Photos taken on personal devices are extremely difficult to manage from a HIPAA perspective.

## Compliance & Regulatory Notes

- **MDM is non-negotiable for HIPAA compliance.** Every mobile device that accesses ePHI must be enrolled in an MDM platform that enforces encryption, passcode requirements, remote wipe, and access controls. An unmanaged iPad accessing the EHR is a HIPAA violation waiting for an audit.
- **Encryption** (45 CFR 164.312(a)(2)(iv)): All iPads and iPhones are encrypted by default when a passcode is set. Surface devices should have BitLocker enabled. Android devices should have device encryption verified and enforced via MDM.
- **Remote wipe** (45 CFR 164.310(d)(2)(iii)): Mandatory capability for any device that may contain or access ePHI. Must be testable and tested.
- **Automatic screen lock**: 2-5 minute timeout for devices used in clinical settings. Enforced via MDM policy.
- **BYOD (Bring Your Own Device)**: If providers use personal devices, MDM must manage at least the work profile/container. Jamf and Intune support "user enrollment" / "work profile" modes that separate personal and work data. However, practice-owned devices are always preferable for HIPAA compliance and simplicity.
- **Clinical photography consent**: If using devices for clinical photography, patients must sign a photography consent form. The consent should specify how images will be used (clinical documentation, not marketing), where they will be stored (EHR), and who can access them. State laws vary on photography consent requirements.
- **Lost/stolen device procedure**: You must have a documented procedure for what happens when a device is lost or stolen, including immediate remote wipe, breach risk assessment, and potential OCR notification. This is where MDM proves its value.

## Common Mistakes

1. **Deploying devices without MDM.** This is the single biggest mistake. Practices hand out iPads without any management, and when a device is lost, there is no way to wipe it, no way to verify encryption was active, and a potential breach notification to OCR.
2. **Allowing personal devices without a BYOD policy.** Providers will use their personal phones to access the EHR patient portal, take clinical photos, and text about patients. Without a formal BYOD policy and MDM enrollment, this is an uncontrolled HIPAA risk.
3. **Using personal camera apps for clinical photography.** Photos taken with the native camera app on a personal phone live in the camera roll, sync to iCloud/Google Photos, and are nearly impossible to control. Use the EHR's mobile photo capture feature or a dedicated clinical photography app that stores images directly in the patient chart.
4. **No charging plan.** Dead batteries make tablets useless. Establish a nightly charging routine and a designated charging station. Label devices by room assignment.
5. **Buying the cheapest tablets.** A $150 Amazon Fire tablet is not a clinical device. It lacks MDM support, has a mediocre camera, and will be slow within a year. The iPad (standard model) at $349 is the real floor for clinical-grade mobile devices.
6. **Not budgeting for cases.** Medical environments involve frequent hand-offs, counter drops, and cleaning with harsh disinfectants. A $50 case prevents a $400-1,000 replacement. Antimicrobial cases are available and appropriate for clinical settings.
7. **Ignoring app update management.** EHR mobile apps frequently release updates that fix bugs and address security vulnerabilities. MDM should be configured to push app updates automatically or flag devices with outdated apps.

## Recommended Implementation Timeline

**Weeks 1-2: Planning and Procurement**
- Define use cases and required apps
- Select platform (iPad recommended for most practices)
- Set up Apple Business Manager (or Microsoft Autopilot)
- Select and procure MDM platform
- Order devices, cases, and charging infrastructure

**Weeks 3-4: MDM Configuration**
- Configure MDM security policies (passcode, encryption, auto-lock, remote wipe)
- Set up app deployment (EHR mobile app, clinical reference apps, telehealth apps)
- Configure network access (Wi-Fi profiles, VPN if needed)
- Create device enrollment profiles

**Week 5: Device Setup and Testing**
- Enroll devices in MDM via zero-touch enrollment
- Verify policy enforcement (test passcode requirement, test remote wipe on a test device)
- Install and test EHR access on each device
- Test clinical photography workflow end-to-end
- Set up charging stations

**Week 6: Training and Rollout**
- Train providers on EHR mobile app, clinical photography workflow, and telehealth mobile use
- Train front desk/MA staff on patient intake tablet workflow
- Distribute devices with cases and login credentials
- Distribute documentation for lost/stolen device reporting procedures

**Ongoing:**
- Monthly MDM compliance review (all devices enrolled, policies enforced, apps updated)
- Quarterly: verify remote wipe capability works on a test device
- Annual hardware assessment -- plan replacement at year 4-5 for iPads, year 3-4 for Android
- Immediately: remote wipe and report any lost or stolen device per your incident response plan
