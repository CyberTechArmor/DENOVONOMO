# Telehealth

## What Is This?

Telehealth in primary care is the delivery of clinical services through live audio-video encounters between a provider and a patient who are not in the same physical location. While telehealth technically encompasses a broader range of remote health services (including remote patient monitoring, store-and-forward asynchronous consultation, and mobile health apps), this document focuses on synchronous video visits --- the most common and clinically relevant telehealth modality for primary care practices.

The technology stack includes a video platform (the patient-provider interface), integration with the EHR (for scheduling, documentation, and billing), a virtual waiting room, screen sharing for patient education, and increasingly, peripheral device integration for remote physical assessment. Platforms range from standalone HIPAA-compliant video tools like Doxy.me, to enterprise telehealth platforms like Amwell and Teladoc Health, to EHR-integrated video built into athenahealth, Epic, eClinicalWorks, and other major EHR systems.

COVID-19 transformed telehealth from a niche service to a core delivery modality. At the pandemic peak, telehealth represented 40% of primary care visits. Post-pandemic, it has stabilized at 15--25% of primary care volume, with significant variation by patient population and geography. CMS has extended most telehealth flexibilities through 2025 and is expected to make many permanent, though the regulatory landscape continues to evolve.

Reimbursement for telehealth visits in primary care has reached near-parity with in-person visits for most payers. Medicare reimburses telehealth E/M visits (99211--99215) at the same rate as in-person visits when conducted via audio-video. Most commercial payers follow suit, though policies vary. Audio-only visits (telephone) are reimbursed at lower rates and face ongoing coverage uncertainty.

## Why Does a Primary Care Practice Need This?

**Patient access and convenience.** Patients with transportation barriers, mobility limitations, childcare responsibilities, or inflexible work schedules benefit enormously from video visits. For practices in rural areas, telehealth extends access without requiring patients to drive hours for a 15-minute visit. Even in urban settings, telehealth reduces the total time investment of a medical visit from 2--3 hours (travel, parking, waiting, visit, travel) to 15--20 minutes.

**Revenue generation and schedule optimization.** Telehealth visits generate near-identical revenue to in-person visits (same E/M codes, same RVUs, same reimbursement for most payers) with lower overhead --- no exam room utilization, no medical supplies, reduced front-desk processing. Practices that block dedicated telehealth time slots report 10--20% increases in provider productivity because telehealth visits have lower no-show rates (8--12% vs. 15--20% for in-person) and more efficient scheduling.

**Chronic disease management.** The sweet spot for primary care telehealth is chronic disease follow-up: diabetes check-ins, hypertension medication management, mental health follow-ups, and post-hospitalization visits. These encounters often require conversation and medication adjustment, not physical examination, making them ideal for video.

**Competitive necessity.** Large health systems and direct-to-consumer telehealth companies (Teladoc, Amazon Clinic, Cerebral) have established patient expectations for virtual care access. Independent primary care practices that do not offer telehealth risk losing patients --- particularly younger patients --- to competitors who do.

**Practice resilience.** COVID-19 demonstrated that practices without telehealth capability were unable to maintain patient contact and revenue during disruptions. Weather events, building issues, staff illness, and future pandemics all create scenarios where telehealth maintains continuity of care and practice revenue.

## How to Decide If You Need It

Telehealth is no longer a "if you need it" decision for most primary care practices --- it is standard of care. The question is how much to invest and what platform to use.

You should implement a robust telehealth program if:

- You manage chronic conditions (diabetes, hypertension, mental health) that benefit from frequent, low-acuity follow-ups
- Your patient population includes individuals with transportation barriers or long travel times
- Your no-show rate for in-person visits exceeds 12%
- You want to extend after-hours access without maintaining evening/weekend clinic hours
- You are part of a value-based care arrangement where access and follow-up frequency improve outcomes
- You want to attract and retain younger patient demographics

A minimal telehealth setup may suffice if:

- Your practice is procedure-heavy (dermatology, orthopedics with injections) where most visits require hands-on examination
- Your entire patient population has limited technology access or strong preference for in-person care
- Your state's telehealth regulations are particularly restrictive

## Order of Operations

1. **Understand your state's telehealth regulations.** Requirements vary significantly: some states require an initial in-person visit before telehealth, some restrict prescribing via telehealth, and some mandate specific informed consent. The Center for Connected Health Policy maintains a state-by-state telehealth policy database.

2. **Assess payer telehealth policies.** Review telehealth coverage policies for your top 10 payers. Determine which CPT codes are covered, whether place-of-service codes differ, and whether any payers require specific platform certifications.

3. **Evaluate platform options.** Decide between standalone, EHR-integrated, or hybrid approaches. If your EHR has a competent telehealth module, start there. If not, a standalone platform like Doxy.me requires minimal setup.

4. **Obtain telehealth consent templates.** Develop or obtain a telehealth informed consent form addressing: the nature of telehealth, technology requirements, privacy risks, the right to refuse, emergency protocols, and state-specific requirements.

5. **Configure billing workflows.** Set up telehealth-specific billing: appropriate place-of-service codes (POS 10 for patient at home, POS 02 for telehealth at a distant site), modifier 95 or GT as required by payers, and audio-only codes (99441--99443) for telephone visits where applicable.

6. **Train providers on virtual clinical skills.** Telehealth encounters require different skills than in-person visits: camera positioning, lighting, patient engagement techniques, remote physical assessment guidance, and managing technology failures.

7. **Create patient-facing instructions.** Develop simple, clear instructions for patients on how to access a telehealth visit: technology requirements, testing the connection before the visit, where to go for the visit link, and what to do if the connection fails.

8. **Launch with a defined subset of visit types.** Start with chronic disease follow-ups and medication management visits --- low-acuity encounters where telehealth works best. Expand to additional visit types based on provider and patient feedback.

## Options by Practice Size

**Solo/Small Practice (1--2 providers)**
Doxy.me (free tier for basic video; $35/month/provider for Professional with waiting room, screen share, and patient queue). Alternatively, your EHR's built-in video if available. Minimal hardware investment: a webcam ($50--$150), ring light ($25--$50), and headset ($30--$80). Budget: $0--$50/month per provider.

**Small Group (3--5 providers)**
Doxy.me Professional ($35/provider/month), Zoom for Healthcare ($15--$22/user/month), or EHR-integrated telehealth. Group waiting room management and basic scheduling integration. Budget: $50--$150/provider/month.

**Medium Group (6--15 providers)**
EHR-integrated telehealth (athenahealth Telehealth, Epic Video Visit, eClinicalWorks TeleMedicine) or an enterprise standalone like Amwell ($200--$500/provider/month). Integrated scheduling, documentation, and billing. Virtual triage workflows. Budget: $100--$500/provider/month.

**Large Group (15+ providers)**
Enterprise telehealth platform fully integrated with EHR. Amwell, Teladoc Health (for white-label solutions), or Microsoft Teams for Healthcare (with EHR integration via third-party connectors). Centralized scheduling, quality monitoring, and patient experience analytics. Budget: $200--$600/provider/month.

## Options Analysis

| Platform | Best For | HIPAA Compliant | EHR Integration | Wait Room | Screen Share | Monthly Cost |
|----------|----------|----------------|----------------|-----------|-------------|-------------|
| **Doxy.me** | Solo/small, simplicity | Yes (BAA included) | None (standalone) | Yes (paid) | Yes (paid) | Free--$35/provider |
| **Zoom for Healthcare** | All sizes | Yes (BAA available) | Limited (API) | Yes | Yes | $15--$22/user |
| **athena Telehealth** | athena users | Yes (native) | Full (native) | Yes | Limited | Included/add-on |
| **Epic Video Visit** | Epic users | Yes (native) | Full (native) | Yes | Yes | Included |
| **eCW TeleMedicine** | eCW users | Yes (native) | Full (native) | Yes | Yes | Add-on module |
| **Amwell** | Enterprise | Yes | Good (major EHRs) | Yes | Yes | $200--$500/provider |
| **Doximity Dialer Video** | Quick adoption | Yes | None | No | No | Free for providers |
| **Microsoft Teams (Healthcare)** | M365 organizations | Yes (BAA available) | Via connectors | Yes | Yes | $12.50--$22/user |

## Vendor Landscape

**Doxy.me** dominates the small practice market through its free tier and extreme simplicity --- no downloads, no accounts required for patients, just a web link. The provider gets a personal room URL (doxy.me/dryourname), sends it to the patient, and the patient clicks to join. Doxy.me's deliberate simplicity (no integration, no scheduling, no EHR connection) is both its strength (zero friction to start) and its limitation (no workflow automation for growing practices).

**Zoom for Healthcare** leverages Zoom's ubiquity and user familiarity. Most patients have used Zoom and understand the interface, reducing technology barriers. Zoom's healthcare offering includes BAA execution, HIPAA-compliant settings, waiting rooms, and some EHR integrations (via API and third-party connectors). Pricing is competitive at $15--$22/user/month.

**EHR-integrated telehealth** is the default recommendation for practices that want workflow efficiency. athenahealth's telehealth module, Epic's Video Visit, eClinicalWorks TeleMedicine, and NextGen Virtual Visits embed video within the clinical workflow: scheduling, check-in, video, documentation, and billing all happen in the EHR. The trade-off is that EHR-native video quality and features sometimes lag behind dedicated platforms.

**Doximity Dialer Video** offers free HIPAA-compliant video calls using Doximity's physician network. It is extremely simple (call from a browser, patient does not need an app) but lacks scheduling integration, waiting rooms, and practice branding. Useful as a backup or for ad hoc video calls.

**Amwell and Teladoc Health** target enterprise-scale telehealth programs with white-label platforms, sophisticated scheduling, patient triage, multi-specialty support, and analytics. These are overkill for small practices but appropriate for large groups and health systems building branded virtual care programs.

**Emerging trends:** AI-powered pre-visit symptom collection (patients describe symptoms to an AI chatbot before the video visit, giving the provider a structured summary), peripheral device integration (Bluetooth stethoscopes, otoscopes, and dermatoscopes that patients use at home during the video visit), asynchronous telehealth (patient submits photos and questionnaires, provider responds within hours without a live video call), and AI scribes that automatically document the telehealth encounter.

## Compliance & Regulatory Notes

**State licensure.** Providers must be licensed in the state where the patient is physically located at the time of the telehealth encounter. Interstate telehealth requires licensure in each state or participation in an interstate compact (IMLC for physicians, ASWB for social workers, PSYPACT for psychologists). The IMLC now includes 40+ states.

**Prescribing via telehealth.** The Ryan Haight Act restricts prescribing controlled substances via telehealth without an initial in-person examination. COVID-era flexibilities allowed telehealth prescribing of controlled substances without an in-person visit, but the DEA's permanent telehealth prescribing rules (finalized in late 2024/early 2025) reintroduce some requirements. Non-controlled substances can be prescribed via telehealth without restrictions in most states.

**Informed consent.** Most states require documented telehealth-specific informed consent. Elements typically include: explanation of telehealth, potential risks (technology failure, privacy limitations), the right to refuse, emergency protocols, and acknowledgment that some conditions require in-person evaluation. Some states allow verbal consent documented in the chart; others require a signed form.

**HIPAA compliance.** The telehealth platform must be HIPAA-compliant with a signed BAA. FaceTime, Skype, standard Zoom (non-healthcare version), and Google Meet (without Workspace healthcare add-on) are not HIPAA-compliant and should not be used. CMS waived HIPAA telehealth enforcement during COVID-19, but that waiver has ended.

**Medicare telehealth rules.** Post-pandemic permanent rules are still evolving. As of 2025, Medicare covers telehealth for established patients (initial visits may require in-person), reimburses at in-person rates for audio-video visits, and covers audio-only visits for mental health and certain E/M services. Geographic and originating site restrictions have been largely eliminated but may return. Monitor CMS rulemaking closely.

**Place-of-service coding.** Use POS 10 (Telehealth Provided in Patient's Home) for most telehealth visits. Use POS 02 (Telehealth Provided Other than in Patient's Home) when the patient is at a remote clinical site. Some payers require modifier 95 on telehealth claims; others do not. Verify with each payer.

## Common Mistakes

**Using non-compliant platforms.** Standard FaceTime, WhatsApp video, Facebook Messenger, or consumer Zoom are not HIPAA-compliant. The COVID-era enforcement discretion has ended. Use only platforms with BAAs and HIPAA-compliant configurations.

**Poor provider setup.** Providers conducting telehealth from dimly lit rooms, with backlighting (window behind them), unprofessional backgrounds, or laptop cameras angled up their nostrils create a subpar patient experience. Invest in basic setup: ring light ($25), eye-level camera ($50--$150), professional or blurred background, and a quiet space.

**Not verifying patient identity and location.** At the start of every telehealth visit, verify the patient's identity (name, date of birth) and physical location (state, for licensure compliance, and address, for emergency response if needed). Document both in the chart.

**Failing to establish an emergency protocol.** If a patient experiences a medical emergency during a telehealth visit, the provider must be able to direct emergency services to the patient's location. Confirm the patient's address at the start of each visit and know how to contact local EMS in the patient's area (or simply instruct the patient to call 911).

**Not training patients on the technology.** A significant portion of telehealth visit time is wasted on technical troubleshooting. Send patients a technology check link 24 hours before the visit. Provide clear, simple instructions with screenshots. Have a phone number patients can call if the video connection fails.

**Underutilizing telehealth for chronic care.** Many practices offer telehealth only for acute visits (sick calls, URIs) and miss the higher-value application: chronic disease management. Quarterly diabetes check-ins, monthly mental health follow-ups, and hypertension medication management are ideal telehealth use cases that improve outcomes and generate consistent revenue.

**Not billing appropriately.** Some practices under-code telehealth visits out of uncertainty about what is covered. Telehealth E/M codes (99211--99215) are reimbursed at the same rate as in-person visits for most payers. Bill the appropriate level based on medical decision-making complexity, just as you would for an in-person visit.

## Recommended Implementation Timeline

**Weeks 1--2:** Research state telehealth regulations and payer policies. Review licensure requirements, consent rules, and prescribing restrictions. Contact top 5 payers to confirm telehealth coverage and billing requirements.

**Weeks 3--4:** Select platform. If using EHR-integrated telehealth, work with your EHR vendor to enable and configure the module. If using standalone (Doxy.me, Zoom for Healthcare), create accounts and configure settings. Purchase hardware (webcams, ring lights, headsets).

**Week 5:** Configure billing. Set up telehealth-specific place-of-service codes, modifiers, and charge capture in your PMS. Create telehealth appointment types in your scheduling system.

**Week 6:** Develop consent forms and patient instructions. Create telehealth-specific informed consent. Build patient-facing instructions (how to join a video visit, technology requirements, what to expect).

**Week 7:** Provider training. Train providers on video visit technique: camera setup, lighting, patient engagement, remote assessment skills, documentation, and emergency protocols. Conduct mock visits with staff playing patients.

**Week 8:** Staff training. Train schedulers on identifying telehealth-appropriate visit types, sending video visit links, and troubleshooting common patient technology issues. Train billing staff on telehealth coding.

**Weeks 9--10:** Pilot launch. Start with 2--4 telehealth visits per provider per day, focusing on chronic disease follow-ups and medication management. Gather provider and patient feedback.

**Weeks 11--12:** Expand. Increase telehealth slots based on demand and provider comfort. Add visit types (annual wellness visit components, behavioral health, post-surgical follow-up). Refine scheduling templates to include dedicated telehealth blocks.

**Weeks 13--16:** Optimize. Analyze completion rates (percentage of scheduled telehealth visits completed), patient satisfaction, billing accuracy, and reimbursement rates. Adjust workflows, consent processes, and patient instructions based on findings.

**Ongoing:** Monthly review of telehealth utilization and revenue. Quarterly payer policy updates. Annual regulatory review (state laws and CMS rules evolve frequently). Continuous provider training as platform features and clinical applications expand.
