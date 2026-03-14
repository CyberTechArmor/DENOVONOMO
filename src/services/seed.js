'use strict';

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');

// ---------------------------------------------------------------------------
// Category mapping from seed/documents/ directory structure
// ---------------------------------------------------------------------------
const CATEGORIES = {
  '01-network': {
    category: 'Network & Infrastructure',
    subcategories: {
      'internet-circuits': 'Internet Circuits & ISPs',
      'firewall-security-appliances': 'Firewall & Security Appliances',
      'switches-cabling': 'Switches & Cabling',
      'wireless-networking': 'Wireless Networking',
      'vpn-remote-access': 'VPN & Remote Access',
      'network-monitoring': 'Network Monitoring',
      'sd-wan': 'SD-WAN',
    },
  },
  '02-endpoints': {
    category: 'Endpoints & Workstations',
    subcategories: {
      'clinical-workstations': 'Clinical Workstations',
      'admin-workstations': 'Administrative Workstations',
      'thin-clients': 'Thin Clients & VDI',
      'mobile-devices': 'Mobile Devices & Tablets',
      'printers-scanners': 'Printers & Scanners',
      'monitors-peripherals': 'Monitors & Peripherals',
      'endpoint-management': 'Endpoint Management & MDM',
    },
  },
  '03-ehr': {
    category: 'EHR & Practice Management',
    subcategories: {
      'ehr-selection': 'EHR Selection',
      'practice-management': 'Practice Management',
      'patient-scheduling': 'Patient Scheduling',
      'medical-billing': 'Medical Billing',
      'revenue-cycle': 'Revenue Cycle Management',
      'clinical-documentation': 'Clinical Documentation',
      'e-prescribing': 'E-Prescribing',
    },
  },
  '04-clinical-devices': {
    category: 'Clinical Devices & Equipment',
    subcategories: {
      'vital-signs-monitors': 'Vital Signs Monitors',
      'diagnostic-equipment': 'Diagnostic Equipment',
      'point-of-care-testing': 'Point-of-Care Testing',
      'imaging-equipment': 'Imaging Equipment',
      'medical-device-integration': 'Medical Device Integration',
    },
  },
  '05-telephony': {
    category: 'Telephony & Communications',
    subcategories: {
      'voip-phone-systems': 'VoIP Phone Systems',
      'call-center': 'Call Center & IVR',
      'fax-solutions': 'Fax Solutions',
      'unified-communications': 'Unified Communications',
      'paging-intercom': 'Paging & Intercom',
    },
  },
  '06-security': {
    category: 'Security & Compliance',
    subcategories: {
      'endpoint-protection': 'Endpoint Protection & EDR',
      'email-security': 'Email Security',
      'identity-access': 'Identity & Access Management',
      'hipaa-compliance': 'HIPAA Compliance Tools',
      'security-training': 'Security Awareness Training',
      'vulnerability-management': 'Vulnerability Management',
      'siem-logging': 'SIEM & Log Management',
      'physical-security': 'Physical Security & Cameras',
    },
  },
  '07-data': {
    category: 'Data & Backup',
    subcategories: {
      'backup-disaster-recovery': 'Backup & Disaster Recovery',
      'cloud-storage': 'Cloud Storage',
      'data-classification': 'Data Classification',
      'database-management': 'Database Management',
    },
  },
  '08-patient-facing': {
    category: 'Patient-Facing Technology',
    subcategories: {
      'patient-portal': 'Patient Portal',
      'check-in-kiosks': 'Check-in Kiosks',
      'digital-signage': 'Digital Signage',
      'patient-wifi': 'Patient Wi-Fi',
      'telehealth-platform': 'Telehealth Platform',
      'patient-engagement': 'Patient Engagement Tools',
    },
  },
  '09-admin': {
    category: 'Administrative & Operations',
    subcategories: {
      'payroll-hr': 'Payroll & HR',
      'accounting-software': 'Accounting Software',
      'office-productivity': 'Office Productivity Suite',
      'document-management': 'Document Management',
      'project-management': 'Project Management',
      'credentialing': 'Credentialing & Enrollment',
    },
  },
  '10-integration': {
    category: 'Integration & Interoperability',
    subcategories: {
      'hl7-fhir': 'HL7 & FHIR Integration',
      'api-management': 'API Management',
      'health-information-exchange': 'Health Information Exchange',
      'lab-interfaces': 'Lab Interfaces',
      'imaging-interfaces': 'Imaging Interfaces (DICOM)',
      'referral-management': 'Referral Management',
    },
  },
  '11-remote': {
    category: 'Remote & Hybrid Work',
    subcategories: {
      'remote-desktop': 'Remote Desktop & VDI',
      'collaboration-tools': 'Collaboration Tools',
      'remote-monitoring': 'Remote Monitoring & Management',
      'home-office-setup': 'Home Office Setup',
    },
  },
  '12-ai': {
    category: 'AI & Emerging Technology',
    subcategories: {
      'ambient-scribes': 'Ambient Clinical Scribes',
      'clinical-decision-support': 'Clinical Decision Support',
      'predictive-analytics': 'Predictive Analytics',
      'chatbots-virtual-assistants': 'Chatbots & Virtual Assistants',
      'image-analysis': 'AI Image Analysis',
    },
  },
};

// ---------------------------------------------------------------------------
// seedDocuments - read markdown files from seed/documents/ and insert them
// ---------------------------------------------------------------------------
async function seedDocuments(adminUserId) {
  const { rows } = await pool.query('SELECT COUNT(*) FROM documents');
  if (parseInt(rows[0].count, 10) > 0) {
    console.log('[seed] Documents already exist – skipping document seed.');
    return;
  }

  const seedDir = path.join(__dirname, '../../seed/documents');
  if (!fs.existsSync(seedDir)) {
    console.log('[seed] No seed/documents directory found – skipping.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let globalSortOrder = 0;
    const dirEntries = fs.readdirSync(seedDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const dirEntry of dirEntries) {
      const dirName = dirEntry.name;
      const mapping = CATEGORIES[dirName];
      if (!mapping) {
        console.warn(`[seed] Unknown directory "${dirName}" – skipping.`);
        continue;
      }

      const categoryDir = path.join(seedDir, dirName);
      const mdFiles = fs.readdirSync(categoryDir)
        .filter((f) => f.endsWith('.md'))
        .sort();

      for (const mdFile of mdFiles) {
        const filePath = path.join(categoryDir, mdFile);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Derive slug from filename without extension
        const slug = mdFile.replace(/\.md$/, '');

        // Derive subcategory from slug if it exists in the mapping
        const subcategory = mapping.subcategories[slug] || null;

        // Extract title from first markdown heading, fallback to slug
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        globalSortOrder += 10;

        const docId = uuidv4();
        const versionId = uuidv4();

        // Insert document (without current_version_id yet)
        await client.query(
          `INSERT INTO documents (id, slug, title, category, subcategory, sort_order, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [docId, slug, title, mapping.category, subcategory, globalSortOrder]
        );

        // Insert the initial approved version
        await client.query(
          `INSERT INTO document_versions (id, document_id, version_number, content_md, change_summary, author_id, status, reviewed_by, reviewed_at)
           VALUES ($1, $2, 1, $3, $4, $5, 'approved', $5, NOW())`,
          [versionId, docId, content, 'Initial seed content', adminUserId]
        );

        // Link document to its current version
        await client.query(
          `UPDATE documents SET current_version_id = $1 WHERE id = $2`,
          [versionId, docId]
        );

        console.log(`[seed] Seeded document: ${slug} (${mapping.category})`);
      }
    }

    await client.query('COMMIT');
    console.log('[seed] Document seeding complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Error seeding documents:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// seedReferencePricing - populate reference_pricing with realistic data
// ---------------------------------------------------------------------------
async function seedReferencePricing() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM reference_pricing');
  if (parseInt(rows[0].count, 10) > 0) {
    console.log('[seed] Reference pricing already exists – skipping.');
    return;
  }

  const pricingData = [
    // =========================================================================
    // 01 - Network & Infrastructure
    // =========================================================================
    { category: 'Network & Infrastructure', subcategory: 'Internet Circuits & ISPs', item_key: 'comcast-business-internet', vendor_name: 'Comcast Business', product_name: 'Business Internet 300', cost_monthly_low: 100, cost_monthly_high: 200, notes: '300 Mbps download, static IP available', source: 'Comcast Business website' },
    { category: 'Network & Infrastructure', subcategory: 'Internet Circuits & ISPs', item_key: 'att-fiber-business', vendor_name: 'AT&T', product_name: 'AT&T Business Fiber', cost_monthly_low: 160, cost_monthly_high: 350, notes: 'Symmetrical fiber 500Mbps-1Gbps with SLA', source: 'AT&T Business website' },
    { category: 'Network & Infrastructure', subcategory: 'Internet Circuits & ISPs', item_key: 'spectrum-business-internet', vendor_name: 'Spectrum Business', product_name: 'Spectrum Business Internet', cost_monthly_low: 65, cost_monthly_high: 165, notes: '200-600 Mbps, no data caps', source: 'Spectrum Business website' },
    { category: 'Network & Infrastructure', subcategory: 'Internet Circuits & ISPs', item_key: 'dedicated-mpls-circuit', vendor_name: 'Various', product_name: 'Dedicated MPLS/DIA Circuit', cost_monthly_low: 500, cost_monthly_high: 2000, notes: 'Dedicated internet access with SLA, 100Mbps-1Gbps', source: 'Industry estimates' },

    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'fortinet-40f', vendor_name: 'Fortinet', product_name: 'FortiGate 40F', cost_onetime_low: 400, cost_onetime_high: 800, cost_annual_low: 200, cost_annual_high: 400, notes: 'Next-gen firewall for small practices, FortiGuard UTM bundle', source: 'Fortinet partner pricing' },
    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'fortinet-60f', vendor_name: 'Fortinet', product_name: 'FortiGate 60F', cost_onetime_low: 600, cost_onetime_high: 1200, cost_annual_low: 300, cost_annual_high: 600, notes: 'Next-gen firewall for medium practices with SD-WAN', source: 'Fortinet partner pricing' },
    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'opnsense-protectli', vendor_name: 'OPNsense / Protectli', product_name: 'OPNsense on Protectli VP2420', cost_onetime_low: 300, cost_onetime_high: 700, notes: 'Open-source firewall on dedicated appliance, no recurring fees', source: 'Protectli.com' },
    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'pfsense-netgate', vendor_name: 'Netgate', product_name: 'pfSense+ on Netgate 4100', cost_onetime_low: 400, cost_onetime_high: 900, cost_annual_low: 0, cost_annual_high: 129, notes: 'Open-source based firewall with optional support contract', source: 'Netgate store' },
    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'managed-firewall-msp', vendor_name: 'Various MSPs', product_name: 'Managed Firewall Service', cost_monthly_low: 150, cost_monthly_high: 500, notes: 'Fully managed firewall with monitoring, patching, log review', source: 'MSP industry averages' },
    { category: 'Network & Infrastructure', subcategory: 'Firewall & Security Appliances', item_key: 'sonicwall-tz270', vendor_name: 'SonicWall', product_name: 'SonicWall TZ270', cost_onetime_low: 400, cost_onetime_high: 700, cost_annual_low: 300, cost_annual_high: 550, notes: 'Entry-level NGFW with TotalSecure bundle', source: 'SonicWall partner pricing' },

    { category: 'Network & Infrastructure', subcategory: 'Switches & Cabling', item_key: 'ubiquiti-usw-24-poe', vendor_name: 'Ubiquiti', product_name: 'UniFi USW-24-PoE', cost_onetime_low: 400, cost_onetime_high: 600, notes: '24-port PoE managed switch, no licensing fees', source: 'Ubiquiti store' },
    { category: 'Network & Infrastructure', subcategory: 'Switches & Cabling', item_key: 'meraki-ms120-24p', vendor_name: 'Cisco Meraki', product_name: 'Meraki MS120-24P', cost_onetime_low: 1000, cost_onetime_high: 1800, cost_annual_low: 200, cost_annual_high: 400, notes: '24-port PoE cloud-managed switch with required licensing', source: 'Meraki pricing' },
    { category: 'Network & Infrastructure', subcategory: 'Switches & Cabling', item_key: 'structured-cabling-per-drop', vendor_name: 'Various', product_name: 'Cat6a Structured Cabling (per drop)', cost_onetime_low: 150, cost_onetime_high: 350, notes: 'Installed and certified Cat6a drop including patch panel termination', source: 'Low-voltage contractor estimates' },

    { category: 'Network & Infrastructure', subcategory: 'Wireless Networking', item_key: 'ubiquiti-u6-pro', vendor_name: 'Ubiquiti', product_name: 'UniFi U6-Pro Access Point', cost_onetime_low: 100, cost_onetime_high: 200, notes: 'Wi-Fi 6 AP, no recurring license, per AP', source: 'Ubiquiti store' },
    { category: 'Network & Infrastructure', subcategory: 'Wireless Networking', item_key: 'meraki-mr36', vendor_name: 'Cisco Meraki', product_name: 'Meraki MR36 Access Point', cost_onetime_low: 300, cost_onetime_high: 500, cost_annual_low: 150, cost_annual_high: 300, notes: 'Cloud-managed Wi-Fi 6 AP with required licensing, per AP', source: 'Meraki pricing' },
    { category: 'Network & Infrastructure', subcategory: 'Wireless Networking', item_key: 'aruba-instant-on', vendor_name: 'HPE Aruba', product_name: 'Aruba Instant On AP22', cost_onetime_low: 100, cost_onetime_high: 180, notes: 'Cloud-managed Wi-Fi 6 AP, no recurring fees, per AP', source: 'HPE Aruba store' },

    // =========================================================================
    // 02 - Endpoints & Workstations
    // =========================================================================
    { category: 'Endpoints & Workstations', subcategory: 'Clinical Workstations', item_key: 'clinical-workstation-desktop', vendor_name: 'Dell / HP / Lenovo', product_name: 'Clinical Desktop Workstation', cost_onetime_low: 800, cost_onetime_high: 1500, notes: 'i5/Ryzen 5, 16GB RAM, 512GB SSD, Windows 11 Pro', source: 'Dell/HP business pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Clinical Workstations', item_key: 'clinical-workstation-aio', vendor_name: 'HP / Lenovo', product_name: 'Clinical All-in-One Workstation', cost_onetime_low: 1000, cost_onetime_high: 2000, notes: '24" AIO with i5, 16GB RAM – saves desk space in exam rooms', source: 'HP/Lenovo business pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Clinical Workstations', item_key: 'clinical-laptop', vendor_name: 'Dell / HP / Lenovo', product_name: 'Clinical Laptop (Provider)', cost_onetime_low: 1000, cost_onetime_high: 2500, notes: '14" laptop, i7, 16-32GB RAM for providers on the move', source: 'Dell/HP business pricing' },

    { category: 'Endpoints & Workstations', subcategory: 'Administrative Workstations', item_key: 'admin-workstation-desktop', vendor_name: 'Dell / HP / Lenovo', product_name: 'Administrative Desktop', cost_onetime_low: 600, cost_onetime_high: 1200, notes: 'i5, 16GB RAM, 256GB SSD, Windows 11 Pro', source: 'Dell/HP business pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Administrative Workstations', item_key: 'front-desk-workstation', vendor_name: 'Dell / HP / Lenovo', product_name: 'Front Desk Workstation', cost_onetime_low: 700, cost_onetime_high: 1300, notes: 'Desktop + dual-monitor stand for scheduling/check-in', source: 'Dell/HP business pricing' },

    { category: 'Endpoints & Workstations', subcategory: 'Thin Clients & VDI', item_key: 'dell-wyse-thin-client', vendor_name: 'Dell', product_name: 'Dell Wyse 5070 Thin Client', cost_onetime_low: 300, cost_onetime_high: 600, notes: 'Thin client for VDI/Citrix environments', source: 'Dell business pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Thin Clients & VDI', item_key: 'igel-os-thin-client', vendor_name: 'IGEL', product_name: 'IGEL UD3 with IGEL OS', cost_onetime_low: 400, cost_onetime_high: 700, cost_annual_low: 50, cost_annual_high: 100, notes: 'Secure thin client with centralized management', source: 'IGEL partner pricing' },

    { category: 'Endpoints & Workstations', subcategory: 'Mobile Devices & Tablets', item_key: 'ipad-clinical', vendor_name: 'Apple', product_name: 'iPad (10th gen) for Clinical Use', cost_onetime_low: 350, cost_onetime_high: 600, notes: 'iPad with case and Apple Business Manager enrollment', source: 'Apple Business pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Mobile Devices & Tablets', item_key: 'samsung-tablet-clinical', vendor_name: 'Samsung', product_name: 'Samsung Galaxy Tab A9+', cost_onetime_low: 250, cost_onetime_high: 400, notes: 'Android tablet for patient intake and clinical workflows', source: 'Samsung Business pricing' },

    { category: 'Endpoints & Workstations', subcategory: 'Printers & Scanners', item_key: 'network-laser-printer', vendor_name: 'HP / Brother', product_name: 'Network Laser Printer (B&W)', cost_onetime_low: 300, cost_onetime_high: 600, notes: 'Duty cycle 10k+ pages/month, network-ready', source: 'HP/Brother pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Printers & Scanners', item_key: 'document-scanner', vendor_name: 'Fujitsu / Brother', product_name: 'Document Scanner (Duplex)', cost_onetime_low: 300, cost_onetime_high: 700, notes: 'High-speed duplex scanner for medical records', source: 'Fujitsu/Brother pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Printers & Scanners', item_key: 'label-printer', vendor_name: 'Dymo / Zebra', product_name: 'Label Printer (Patient Labels)', cost_onetime_low: 100, cost_onetime_high: 400, notes: 'Thermal label printer for wristbands/specimen labels', source: 'Dymo/Zebra pricing' },

    { category: 'Endpoints & Workstations', subcategory: 'Monitors & Peripherals', item_key: 'clinical-monitor-24', vendor_name: 'Dell / HP', product_name: '24" Clinical Monitor', cost_onetime_low: 150, cost_onetime_high: 300, notes: '24" IPS display, VESA mountable', source: 'Dell/HP pricing' },
    { category: 'Endpoints & Workstations', subcategory: 'Monitors & Peripherals', item_key: 'dual-monitor-arm', vendor_name: 'Ergotron / AmazonBasics', product_name: 'Dual Monitor Arm', cost_onetime_low: 50, cost_onetime_high: 200, notes: 'VESA-compatible desk-mount arm for dual monitors', source: 'Ergotron/Amazon pricing' },

    // =========================================================================
    // 03 - EHR & Practice Management
    // =========================================================================
    { category: 'EHR & Practice Management', subcategory: 'EHR Selection', item_key: 'athenahealth-ehr', vendor_name: 'athenahealth', product_name: 'athenaOne', cost_monthly_low: 200, cost_monthly_high: 400, notes: 'Cloud-based EHR+PM+RCM, per provider/month, percentage of collections model also available', source: 'athenahealth sales' },
    { category: 'EHR & Practice Management', subcategory: 'EHR Selection', item_key: 'eclinicalworks-ehr', vendor_name: 'eClinicalWorks', product_name: 'eClinicalWorks EHR', cost_monthly_low: 250, cost_monthly_high: 500, notes: 'Full EHR suite per provider/month, on-prem or cloud', source: 'eClinicalWorks sales' },
    { category: 'EHR & Practice Management', subcategory: 'EHR Selection', item_key: 'nextgen-ehr', vendor_name: 'NextGen Healthcare', product_name: 'NextGen Enterprise EHR', cost_monthly_low: 300, cost_monthly_high: 600, notes: 'Specialty-configurable EHR per provider/month', source: 'NextGen sales' },
    { category: 'EHR & Practice Management', subcategory: 'EHR Selection', item_key: 'drchrono-ehr', vendor_name: 'DrChrono', product_name: 'DrChrono EHR', cost_monthly_low: 150, cost_monthly_high: 400, notes: 'iPad-friendly EHR for small practices, per provider/month', source: 'DrChrono website' },
    { category: 'EHR & Practice Management', subcategory: 'EHR Selection', item_key: 'openemr', vendor_name: 'OpenEMR', product_name: 'OpenEMR (Self-Hosted)', cost_onetime_low: 0, cost_onetime_high: 0, cost_monthly_low: 50, cost_monthly_high: 300, notes: 'Open-source EHR, costs are hosting/support, consulting for setup $5k-15k typical', source: 'OpenEMR community' },

    { category: 'EHR & Practice Management', subcategory: 'Medical Billing', item_key: 'kareo-billing', vendor_name: 'Kareo (Tebra)', product_name: 'Kareo Billing', cost_monthly_low: 125, cost_monthly_high: 375, notes: 'Cloud-based billing per provider/month', source: 'Kareo/Tebra pricing' },
    { category: 'EHR & Practice Management', subcategory: 'Medical Billing', item_key: 'advancedmd-billing', vendor_name: 'AdvancedMD', product_name: 'AdvancedMD Billing', cost_monthly_low: 250, cost_monthly_high: 500, notes: 'Full RCM suite per provider/month', source: 'AdvancedMD pricing' },

    { category: 'EHR & Practice Management', subcategory: 'Patient Scheduling', item_key: 'zocdoc-provider', vendor_name: 'Zocdoc', product_name: 'Zocdoc for Providers', cost_monthly_low: 200, cost_monthly_high: 400, notes: 'Online scheduling + patient acquisition per provider/month', source: 'Zocdoc provider website' },

    { category: 'EHR & Practice Management', subcategory: 'E-Prescribing', item_key: 'surescripts-epcs', vendor_name: 'Surescripts/DrFirst', product_name: 'EPCS (Electronic Prescribing for Controlled Substances)', cost_monthly_low: 30, cost_monthly_high: 100, notes: 'Per-provider add-on if not included in EHR, includes identity proofing', source: 'DrFirst pricing' },

    // =========================================================================
    // 04 - Clinical Devices & Equipment
    // =========================================================================
    { category: 'Clinical Devices & Equipment', subcategory: 'Vital Signs Monitors', item_key: 'welch-allyn-spot-vital', vendor_name: 'Welch Allyn (Hillrom)', product_name: 'Welch Allyn Spot Vital Signs 4400', cost_onetime_low: 2000, cost_onetime_high: 4000, notes: 'Connected vital signs monitor with EHR integration', source: 'Hillrom pricing' },
    { category: 'Clinical Devices & Equipment', subcategory: 'Vital Signs Monitors', item_key: 'masimo-pulse-ox', vendor_name: 'Masimo', product_name: 'Masimo Rad-97 Pulse Oximeter', cost_onetime_low: 1500, cost_onetime_high: 3500, notes: 'Clinical-grade pulse oximetry with connectivity', source: 'Masimo distributor pricing' },

    { category: 'Clinical Devices & Equipment', subcategory: 'Diagnostic Equipment', item_key: 'ekg-machine', vendor_name: 'GE / Welch Allyn', product_name: '12-Lead ECG/EKG Machine', cost_onetime_low: 2000, cost_onetime_high: 8000, notes: 'Interpretive 12-lead with PC connectivity and EHR integration', source: 'Medical equipment distributors' },
    { category: 'Clinical Devices & Equipment', subcategory: 'Diagnostic Equipment', item_key: 'spirometer', vendor_name: 'NDD / nSpire', product_name: 'Office Spirometer', cost_onetime_low: 1500, cost_onetime_high: 4000, notes: 'PFT spirometer with PC integration', source: 'Medical equipment distributors' },

    { category: 'Clinical Devices & Equipment', subcategory: 'Point-of-Care Testing', item_key: 'clia-waived-analyzer', vendor_name: 'Abbott / Siemens', product_name: 'CLIA-Waived Point-of-Care Analyzer', cost_onetime_low: 2000, cost_onetime_high: 10000, notes: 'Basic chemistry/UA/glucose analyzer, per-test supply costs additional', source: 'Abbott/Siemens distributors' },

    { category: 'Clinical Devices & Equipment', subcategory: 'Medical Device Integration', item_key: 'device-integration-engine', vendor_name: 'Capsule / Cerner', product_name: 'Medical Device Integration Engine', cost_onetime_low: 5000, cost_onetime_high: 25000, cost_annual_low: 2000, cost_annual_high: 8000, notes: 'Middleware for connecting medical devices to EHR', source: 'Vendor estimates' },

    // =========================================================================
    // 05 - Telephony & Communications
    // =========================================================================
    { category: 'Telephony & Communications', subcategory: 'VoIP Phone Systems', item_key: 'ringcentral-mvp', vendor_name: 'RingCentral', product_name: 'RingCentral MVP', cost_monthly_low: 20, cost_monthly_high: 35, notes: 'Per user/month, cloud PBX with messaging/video/phone', source: 'RingCentral pricing page' },
    { category: 'Telephony & Communications', subcategory: 'VoIP Phone Systems', item_key: '8x8-xseries', vendor_name: '8x8', product_name: '8x8 X-Series', cost_monthly_low: 24, cost_monthly_high: 44, notes: 'Per user/month, UCaaS platform', source: '8x8 pricing page' },
    { category: 'Telephony & Communications', subcategory: 'VoIP Phone Systems', item_key: 'nextiva-voip', vendor_name: 'Nextiva', product_name: 'Nextiva Business Phone', cost_monthly_low: 18, cost_monthly_high: 40, notes: 'Per user/month, cloud business phone with auto-attendant', source: 'Nextiva pricing page' },
    { category: 'Telephony & Communications', subcategory: 'VoIP Phone Systems', item_key: '3cx-onprem', vendor_name: '3CX', product_name: '3CX Phone System (Self-Hosted)', cost_annual_low: 0, cost_annual_high: 1500, notes: 'Free for up to 10 users, paid plans for larger deployments. SIP trunk costs additional.', source: '3CX pricing page' },
    { category: 'Telephony & Communications', subcategory: 'VoIP Phone Systems', item_key: 'voip-desk-phone', vendor_name: 'Poly / Yealink', product_name: 'VoIP Desk Phone (per unit)', cost_onetime_low: 80, cost_onetime_high: 300, notes: 'IP desk phone, ranges from basic to executive model', source: 'Poly/Yealink pricing' },

    { category: 'Telephony & Communications', subcategory: 'Fax Solutions', item_key: 'sfax-hipaa-fax', vendor_name: 'Scrypt (sFax)', product_name: 'sFax HIPAA-Compliant eFax', cost_monthly_low: 30, cost_monthly_high: 80, notes: 'Cloud fax with HIPAA BAA, per account (200-1000 pages included)', source: 'sFax pricing page' },
    { category: 'Telephony & Communications', subcategory: 'Fax Solutions', item_key: 'etherfax', vendor_name: 'etherFAX', product_name: 'etherFAX Cloud Fax', cost_monthly_low: 15, cost_monthly_high: 50, notes: 'HIPAA-compliant cloud fax per line', source: 'etherFAX pricing' },

    { category: 'Telephony & Communications', subcategory: 'Call Center & IVR', item_key: 'talkdesk-contact-center', vendor_name: 'Talkdesk', product_name: 'Talkdesk CX Cloud', cost_monthly_low: 75, cost_monthly_high: 125, notes: 'Per agent/month, AI-powered contact center with IVR', source: 'Talkdesk pricing' },

    // =========================================================================
    // 06 - Security & Compliance
    // =========================================================================
    { category: 'Security & Compliance', subcategory: 'Endpoint Protection & EDR', item_key: 'sentinelone-edr', vendor_name: 'SentinelOne', product_name: 'SentinelOne Singularity', cost_monthly_low: 3, cost_monthly_high: 8, notes: 'Per endpoint/month, AI-powered EDR', source: 'SentinelOne partner pricing' },
    { category: 'Security & Compliance', subcategory: 'Endpoint Protection & EDR', item_key: 'crowdstrike-falcon', vendor_name: 'CrowdStrike', product_name: 'CrowdStrike Falcon Go', cost_monthly_low: 5, cost_monthly_high: 15, notes: 'Per endpoint/month, cloud-native EDR', source: 'CrowdStrike pricing' },
    { category: 'Security & Compliance', subcategory: 'Endpoint Protection & EDR', item_key: 'microsoft-defender-business', vendor_name: 'Microsoft', product_name: 'Microsoft Defender for Business', cost_monthly_low: 3, cost_monthly_high: 5, notes: 'Per user/month, built into M365 Business Premium', source: 'Microsoft 365 pricing' },
    { category: 'Security & Compliance', subcategory: 'Endpoint Protection & EDR', item_key: 'bitdefender-gravityzone', vendor_name: 'Bitdefender', product_name: 'Bitdefender GravityZone Business Security', cost_monthly_low: 2, cost_monthly_high: 6, notes: 'Per endpoint/month, cloud-managed AV/EDR', source: 'Bitdefender MSP pricing' },

    { category: 'Security & Compliance', subcategory: 'Email Security', item_key: 'proofpoint-essentials', vendor_name: 'Proofpoint', product_name: 'Proofpoint Essentials', cost_monthly_low: 2, cost_monthly_high: 5, notes: 'Per user/month, email threat protection + DLP', source: 'Proofpoint channel pricing' },
    { category: 'Security & Compliance', subcategory: 'Email Security', item_key: 'mimecast-email', vendor_name: 'Mimecast', product_name: 'Mimecast Email Security', cost_monthly_low: 3, cost_monthly_high: 7, notes: 'Per user/month, comprehensive email security gateway', source: 'Mimecast pricing' },

    { category: 'Security & Compliance', subcategory: 'Identity & Access Management', item_key: 'azure-ad-p1', vendor_name: 'Microsoft', product_name: 'Microsoft Entra ID P1', cost_monthly_low: 6, cost_monthly_high: 6, notes: 'Per user/month, SSO + conditional access + MFA (included in M365 Business Premium)', source: 'Microsoft pricing' },
    { category: 'Security & Compliance', subcategory: 'Identity & Access Management', item_key: 'duo-mfa', vendor_name: 'Cisco Duo', product_name: 'Duo Security MFA', cost_monthly_low: 3, cost_monthly_high: 9, notes: 'Per user/month, multi-factor authentication', source: 'Duo pricing page' },
    { category: 'Security & Compliance', subcategory: 'Identity & Access Management', item_key: 'jumpcloud-directory', vendor_name: 'JumpCloud', product_name: 'JumpCloud Directory Platform', cost_monthly_low: 7, cost_monthly_high: 15, notes: 'Per user/month, cloud directory + SSO + MDM', source: 'JumpCloud pricing' },

    { category: 'Security & Compliance', subcategory: 'HIPAA Compliance Tools', item_key: 'compliancy-group', vendor_name: 'Compliancy Group', product_name: 'The Guard HIPAA Compliance', cost_monthly_low: 200, cost_monthly_high: 400, notes: 'All-in-one HIPAA compliance software + coaching', source: 'Compliancy Group website' },
    { category: 'Security & Compliance', subcategory: 'HIPAA Compliance Tools', item_key: 'accountable-hq', vendor_name: 'Accountable HQ', product_name: 'Accountable HIPAA Compliance', cost_monthly_low: 50, cost_monthly_high: 200, notes: 'HIPAA compliance platform for small practices', source: 'Accountable HQ pricing' },

    { category: 'Security & Compliance', subcategory: 'Security Awareness Training', item_key: 'knowbe4-training', vendor_name: 'KnowBe4', product_name: 'KnowBe4 Security Awareness Training', cost_annual_low: 10, cost_annual_high: 25, notes: 'Per user/year, phishing simulation + training library', source: 'KnowBe4 pricing' },

    { category: 'Security & Compliance', subcategory: 'Vulnerability Management', item_key: 'rapid7-insightvm', vendor_name: 'Rapid7', product_name: 'Rapid7 InsightVM', cost_annual_low: 15, cost_annual_high: 30, notes: 'Per asset/year, vulnerability scanning and management', source: 'Rapid7 pricing' },

    { category: 'Security & Compliance', subcategory: 'Physical Security & Cameras', item_key: 'verkada-cameras', vendor_name: 'Verkada', product_name: 'Verkada Cloud Camera System', cost_onetime_low: 400, cost_onetime_high: 1200, cost_annual_low: 200, cost_annual_high: 300, notes: 'Per camera, cloud-managed with 30-365 day retention', source: 'Verkada pricing' },
    { category: 'Security & Compliance', subcategory: 'Physical Security & Cameras', item_key: 'ubiquiti-protect-cameras', vendor_name: 'Ubiquiti', product_name: 'UniFi Protect Camera System', cost_onetime_low: 200, cost_onetime_high: 500, notes: 'Per camera, self-hosted NVR (no recurring), requires UDM Pro/NVR', source: 'Ubiquiti store' },

    // =========================================================================
    // 07 - Data & Backup
    // =========================================================================
    { category: 'Data & Backup', subcategory: 'Backup & Disaster Recovery', item_key: 'veeam-backup', vendor_name: 'Veeam', product_name: 'Veeam Backup & Replication', cost_monthly_low: 5, cost_monthly_high: 15, notes: 'Per workload/month, on-prem + cloud backup', source: 'Veeam MSP pricing' },
    { category: 'Data & Backup', subcategory: 'Backup & Disaster Recovery', item_key: 'datto-siris', vendor_name: 'Datto', product_name: 'Datto SIRIS BDR', cost_monthly_low: 200, cost_monthly_high: 600, notes: 'Per appliance/month, includes cloud DR and instant virt', source: 'Datto MSP pricing' },
    { category: 'Data & Backup', subcategory: 'Backup & Disaster Recovery', item_key: 'acronis-cyber-protect', vendor_name: 'Acronis', product_name: 'Acronis Cyber Protect Cloud', cost_monthly_low: 3, cost_monthly_high: 10, notes: 'Per workload/month, backup + security integrated', source: 'Acronis MSP pricing' },

    { category: 'Data & Backup', subcategory: 'Cloud Storage', item_key: 'microsoft-365-business', vendor_name: 'Microsoft', product_name: 'Microsoft 365 Business Premium', cost_monthly_low: 22, cost_monthly_high: 22, notes: 'Per user/month, includes 1TB OneDrive + Exchange + Teams + Entra ID P1 + Defender', source: 'Microsoft 365 pricing' },
    { category: 'Data & Backup', subcategory: 'Cloud Storage', item_key: 'google-workspace-business', vendor_name: 'Google', product_name: 'Google Workspace Business Plus', cost_monthly_low: 18, cost_monthly_high: 18, notes: 'Per user/month, includes 5TB Drive + Vault + enhanced security', source: 'Google Workspace pricing' },
    { category: 'Data & Backup', subcategory: 'Cloud Storage', item_key: 'box-healthcare', vendor_name: 'Box', product_name: 'Box Business (Healthcare)', cost_monthly_low: 15, cost_monthly_high: 35, notes: 'Per user/month, HIPAA-compliant cloud storage with BAA', source: 'Box healthcare pricing' },

    // =========================================================================
    // 08 - Patient-Facing Technology
    // =========================================================================
    { category: 'Patient-Facing Technology', subcategory: 'Patient Portal', item_key: 'ehr-patient-portal', vendor_name: 'Various (EHR-Integrated)', product_name: 'EHR-Integrated Patient Portal', cost_monthly_low: 0, cost_monthly_high: 100, notes: 'Often included with EHR subscription; some charge per provider', source: 'EHR vendor pricing' },
    { category: 'Patient-Facing Technology', subcategory: 'Patient Portal', item_key: 'bridge-patient-portal', vendor_name: 'Bridge', product_name: 'Bridge Patient Portal', cost_monthly_low: 500, cost_monthly_high: 1500, notes: 'Per practice/month, standalone portal with EHR integration', source: 'Bridge pricing' },

    { category: 'Patient-Facing Technology', subcategory: 'Check-in Kiosks', item_key: 'phreesia-intake', vendor_name: 'Phreesia', product_name: 'Phreesia Patient Intake Platform', cost_monthly_low: 500, cost_monthly_high: 1500, notes: 'Per practice, includes tablets + software + payment processing', source: 'Phreesia sales' },
    { category: 'Patient-Facing Technology', subcategory: 'Check-in Kiosks', item_key: 'clearwave-checkin', vendor_name: 'Clearwave', product_name: 'Clearwave Patient Check-In', cost_monthly_low: 400, cost_monthly_high: 1200, notes: 'Per practice, self-service kiosk + eligibility verification', source: 'Clearwave sales' },

    { category: 'Patient-Facing Technology', subcategory: 'Telehealth Platform', item_key: 'doxy-me', vendor_name: 'Doxy.me', product_name: 'Doxy.me Telehealth', cost_monthly_low: 0, cost_monthly_high: 50, notes: 'Free basic tier; $35-50/month pro per provider with waiting room/branding', source: 'Doxy.me pricing' },
    { category: 'Patient-Facing Technology', subcategory: 'Telehealth Platform', item_key: 'zoom-healthcare', vendor_name: 'Zoom', product_name: 'Zoom for Healthcare', cost_monthly_low: 15, cost_monthly_high: 25, notes: 'Per host/month, HIPAA-compliant with BAA, waiting room features', source: 'Zoom healthcare pricing' },

    { category: 'Patient-Facing Technology', subcategory: 'Digital Signage', item_key: 'digital-signage-display', vendor_name: 'Samsung / LG', product_name: 'Waiting Room Digital Display', cost_onetime_low: 300, cost_onetime_high: 800, notes: 'Commercial-grade display with media player', source: 'Samsung/LG commercial pricing' },

    { category: 'Patient-Facing Technology', subcategory: 'Patient Engagement Tools', item_key: 'luma-health', vendor_name: 'Luma Health', product_name: 'Luma Health Patient Engagement', cost_monthly_low: 300, cost_monthly_high: 800, notes: 'Per practice/month, automated reminders + recalls + reviews + referrals', source: 'Luma Health sales' },
    { category: 'Patient-Facing Technology', subcategory: 'Patient Engagement Tools', item_key: 'solutionreach', vendor_name: 'Solutionreach', product_name: 'Solutionreach Patient Engagement', cost_monthly_low: 300, cost_monthly_high: 600, notes: 'Per practice/month, reminders + recalls + surveys + reputation', source: 'Solutionreach pricing' },

    // =========================================================================
    // 09 - Administrative & Operations
    // =========================================================================
    { category: 'Administrative & Operations', subcategory: 'Payroll & HR', item_key: 'adp-run-payroll', vendor_name: 'ADP', product_name: 'ADP RUN Payroll', cost_monthly_low: 50, cost_monthly_high: 150, notes: 'Base platform fee + $6-12/employee/month', source: 'ADP pricing page' },
    { category: 'Administrative & Operations', subcategory: 'Payroll & HR', item_key: 'gusto-payroll', vendor_name: 'Gusto', product_name: 'Gusto Payroll + HR', cost_monthly_low: 40, cost_monthly_high: 80, notes: 'Base fee + $6-12/person/month, includes benefits admin', source: 'Gusto pricing page' },
    { category: 'Administrative & Operations', subcategory: 'Payroll & HR', item_key: 'paychex-flex', vendor_name: 'Paychex', product_name: 'Paychex Flex Payroll', cost_monthly_low: 39, cost_monthly_high: 150, notes: 'Base fee + per employee, includes tax filing and direct deposit', source: 'Paychex pricing' },

    { category: 'Administrative & Operations', subcategory: 'Accounting Software', item_key: 'quickbooks-online', vendor_name: 'Intuit', product_name: 'QuickBooks Online Plus', cost_monthly_low: 50, cost_monthly_high: 100, notes: 'Cloud accounting with class tracking for multi-location', source: 'QuickBooks pricing' },
    { category: 'Administrative & Operations', subcategory: 'Accounting Software', item_key: 'xero-accounting', vendor_name: 'Xero', product_name: 'Xero Growing Plan', cost_monthly_low: 42, cost_monthly_high: 78, notes: 'Cloud accounting with unlimited users', source: 'Xero pricing' },

    { category: 'Administrative & Operations', subcategory: 'Office Productivity Suite', item_key: 'microsoft-365-apps', vendor_name: 'Microsoft', product_name: 'Microsoft 365 Business Basic', cost_monthly_low: 6, cost_monthly_high: 12, notes: 'Per user/month, Teams + web Office apps + 1TB OneDrive', source: 'Microsoft 365 pricing' },
    { category: 'Administrative & Operations', subcategory: 'Office Productivity Suite', item_key: 'google-workspace-starter', vendor_name: 'Google', product_name: 'Google Workspace Business Starter', cost_monthly_low: 6, cost_monthly_high: 12, notes: 'Per user/month, Gmail + Drive + Meet', source: 'Google Workspace pricing' },

    { category: 'Administrative & Operations', subcategory: 'Credentialing & Enrollment', item_key: 'medallion-credentialing', vendor_name: 'Medallion', product_name: 'Medallion Provider Credentialing', cost_onetime_low: 200, cost_onetime_high: 600, notes: 'Per provider, credentialing + payer enrollment automation', source: 'Medallion pricing' },
    { category: 'Administrative & Operations', subcategory: 'Credentialing & Enrollment', item_key: 'caqh-proview', vendor_name: 'CAQH', product_name: 'CAQH ProView', cost_onetime_low: 0, cost_onetime_high: 0, notes: 'Free for providers, universal credentialing data repository', source: 'CAQH website' },

    // =========================================================================
    // 10 - Integration & Interoperability
    // =========================================================================
    { category: 'Integration & Interoperability', subcategory: 'HL7 & FHIR Integration', item_key: 'mirth-connect', vendor_name: 'NextGen (Mirth)', product_name: 'Mirth Connect Integration Engine', cost_onetime_low: 0, cost_onetime_high: 0, cost_annual_low: 0, cost_annual_high: 10000, notes: 'Open-source free; commercial support/cloud from $5k-10k/year', source: 'NextGen Connect pricing' },
    { category: 'Integration & Interoperability', subcategory: 'HL7 & FHIR Integration', item_key: 'rhapsody-engine', vendor_name: 'Rhapsody (Lyniate)', product_name: 'Rhapsody Integration Engine', cost_annual_low: 10000, cost_annual_high: 50000, notes: 'Enterprise integration engine for complex multi-system environments', source: 'Rhapsody/Lyniate sales' },

    { category: 'Integration & Interoperability', subcategory: 'Lab Interfaces', item_key: 'quest-ehr-interface', vendor_name: 'Quest Diagnostics', product_name: 'Quest Care360 EHR Interface', cost_onetime_low: 0, cost_onetime_high: 2000, notes: 'One-time interface setup fee; often free with volume commitment', source: 'Quest Diagnostics provider services' },
    { category: 'Integration & Interoperability', subcategory: 'Lab Interfaces', item_key: 'labcorp-ehr-interface', vendor_name: 'Labcorp', product_name: 'Labcorp Beacon EHR Interface', cost_onetime_low: 0, cost_onetime_high: 2000, notes: 'Electronic lab order/result interface setup', source: 'Labcorp provider services' },

    { category: 'Integration & Interoperability', subcategory: 'Health Information Exchange', item_key: 'commonwell-hie', vendor_name: 'CommonWell Health Alliance', product_name: 'CommonWell HIE Subscription', cost_annual_low: 0, cost_annual_high: 5000, notes: 'Often included via EHR vendor; standalone fees vary by volume', source: 'CommonWell website' },

    { category: 'Integration & Interoperability', subcategory: 'Referral Management', item_key: 'referralmd', vendor_name: 'ReferralMD', product_name: 'ReferralMD Platform', cost_monthly_low: 200, cost_monthly_high: 600, notes: 'Per practice/month, referral tracking + fax digitization', source: 'ReferralMD pricing' },

    // =========================================================================
    // 11 - Remote & Hybrid Work
    // =========================================================================
    { category: 'Remote & Hybrid Work', subcategory: 'Remote Desktop & VDI', item_key: 'citrix-workspace', vendor_name: 'Citrix (Cloud Software Group)', product_name: 'Citrix DaaS (Desktop as a Service)', cost_monthly_low: 15, cost_monthly_high: 40, notes: 'Per user/month, virtual desktop delivery from cloud', source: 'Citrix pricing' },
    { category: 'Remote & Hybrid Work', subcategory: 'Remote Desktop & VDI', item_key: 'windows-365-cloud-pc', vendor_name: 'Microsoft', product_name: 'Windows 365 Cloud PC', cost_monthly_low: 28, cost_monthly_high: 66, notes: 'Per user/month, dedicated cloud PC, 2vCPU/8GB to 4vCPU/16GB', source: 'Microsoft Windows 365 pricing' },

    { category: 'Remote & Hybrid Work', subcategory: 'Remote Monitoring & Management', item_key: 'connectwise-rmm', vendor_name: 'ConnectWise', product_name: 'ConnectWise Automate RMM', cost_monthly_low: 3, cost_monthly_high: 8, notes: 'Per endpoint/month via MSP, remote monitoring + patch management', source: 'ConnectWise MSP pricing' },
    { category: 'Remote & Hybrid Work', subcategory: 'Remote Monitoring & Management', item_key: 'datto-rmm', vendor_name: 'Datto', product_name: 'Datto RMM', cost_monthly_low: 2, cost_monthly_high: 6, notes: 'Per endpoint/month via MSP, remote monitoring + scripting + patching', source: 'Datto MSP pricing' },
    { category: 'Remote & Hybrid Work', subcategory: 'Remote Monitoring & Management', item_key: 'ninja-rmm', vendor_name: 'NinjaOne', product_name: 'NinjaOne RMM', cost_monthly_low: 3, cost_monthly_high: 7, notes: 'Per endpoint/month, cloud RMM with integrated remote access', source: 'NinjaOne pricing' },

    { category: 'Remote & Hybrid Work', subcategory: 'Collaboration Tools', item_key: 'microsoft-teams', vendor_name: 'Microsoft', product_name: 'Microsoft Teams', cost_monthly_low: 0, cost_monthly_high: 12, notes: 'Free basic or included in M365; premium features $4-12/user/month', source: 'Microsoft pricing' },
    { category: 'Remote & Hybrid Work', subcategory: 'Collaboration Tools', item_key: 'slack-business', vendor_name: 'Slack (Salesforce)', product_name: 'Slack Business+', cost_monthly_low: 7, cost_monthly_high: 12, notes: 'Per user/month, HIPAA-compliant on Enterprise Grid plan', source: 'Slack pricing' },

    // =========================================================================
    // 12 - AI & Emerging Technology
    // =========================================================================
    { category: 'AI & Emerging Technology', subcategory: 'Ambient Clinical Scribes', item_key: 'nuance-dax', vendor_name: 'Microsoft (Nuance)', product_name: 'Nuance DAX Copilot', cost_monthly_low: 200, cost_monthly_high: 400, notes: 'Per provider/month, ambient AI clinical documentation', source: 'Nuance/Microsoft sales' },
    { category: 'AI & Emerging Technology', subcategory: 'Ambient Clinical Scribes', item_key: 'abridge-ambient', vendor_name: 'Abridge', product_name: 'Abridge AI Medical Scribe', cost_monthly_low: 150, cost_monthly_high: 350, notes: 'Per provider/month, real-time ambient AI notes integrated with EHR', source: 'Abridge sales' },
    { category: 'AI & Emerging Technology', subcategory: 'Ambient Clinical Scribes', item_key: 'suki-ai', vendor_name: 'Suki AI', product_name: 'Suki AI Assistant', cost_monthly_low: 200, cost_monthly_high: 400, notes: 'Per provider/month, voice-driven AI assistant for documentation', source: 'Suki pricing' },
    { category: 'AI & Emerging Technology', subcategory: 'Ambient Clinical Scribes', item_key: 'deepscribe', vendor_name: 'DeepScribe', product_name: 'DeepScribe Ambient AI Scribe', cost_monthly_low: 200, cost_monthly_high: 350, notes: 'Per provider/month, specialty-trained ambient documentation', source: 'DeepScribe sales' },

    { category: 'AI & Emerging Technology', subcategory: 'Clinical Decision Support', item_key: 'epocrates-cds', vendor_name: 'Epocrates (Athena)', product_name: 'Epocrates Clinical Decision Support', cost_annual_low: 0, cost_annual_high: 175, notes: 'Free basic; premium $175/year/provider, drug interactions + formulary', source: 'Epocrates pricing' },

    { category: 'AI & Emerging Technology', subcategory: 'Chatbots & Virtual Assistants', item_key: 'hyro-ai', vendor_name: 'Hyro', product_name: 'Hyro AI Phone Agent', cost_monthly_low: 500, cost_monthly_high: 2000, notes: 'Per practice/month, AI-powered phone answering + scheduling', source: 'Hyro sales' },

    { category: 'AI & Emerging Technology', subcategory: 'Predictive Analytics', item_key: 'jvion-predictive', vendor_name: 'Jvion', product_name: 'Jvion CORE Predictive Analytics', cost_monthly_low: 500, cost_monthly_high: 2000, notes: 'Per practice/month, patient risk scoring + preventive recommendations', source: 'Jvion sales' },
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of pricingData) {
      await client.query(
        `INSERT INTO reference_pricing
         (item_key, category, subcategory, vendor_name, product_name,
          cost_onetime_low, cost_onetime_high, cost_monthly_low, cost_monthly_high,
          cost_annual_low, cost_annual_high, notes, source, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, TRUE)`,
        [
          item.item_key,
          item.category,
          item.subcategory,
          item.vendor_name,
          item.product_name,
          item.cost_onetime_low || null,
          item.cost_onetime_high || null,
          item.cost_monthly_low || null,
          item.cost_monthly_high || null,
          item.cost_annual_low || null,
          item.cost_annual_high || null,
          item.notes,
          item.source,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`[seed] Seeded ${pricingData.length} reference pricing entries.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Error seeding reference pricing:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// seedDecisionTemplates - write the decision-templates.json file
// ---------------------------------------------------------------------------
async function seedDecisionTemplates() {
  const templatePath = path.join(__dirname, '../../seed/decision-templates.json');
  if (fs.existsSync(templatePath)) {
    console.log('[seed] decision-templates.json already exists – skipping.');
    return;
  }

  // The template JSON is maintained as a separate file.
  // If it doesn't exist, create a minimal placeholder.
  // In practice, the canonical file is committed to the repo.
  console.log('[seed] decision-templates.json should be committed to the repository.');
  console.log('[seed] See seed/decision-templates.json for the full decision tree.');
}

// ---------------------------------------------------------------------------
// Main seed runner
// ---------------------------------------------------------------------------
async function runSeed(adminUserId) {
  if (!adminUserId) {
    throw new Error('adminUserId is required for seeding (document author reference)');
  }

  console.log('[seed] Starting database seed...');
  await seedDocuments(adminUserId);
  await seedReferencePricing();
  await seedDecisionTemplates();
  console.log('[seed] Seeding complete.');
}

module.exports = {
  runSeed,
  seedDocuments,
  seedReferencePricing,
  seedDecisionTemplates,
  CATEGORIES,
};
