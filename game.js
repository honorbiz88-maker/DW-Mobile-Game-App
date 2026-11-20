 const TIER_NAMES = ['Novice', 'Intermediate', 'Pro', 'Commercial', 'Heavy-Duty', 'Master'];

const RIG_TIERS = [
  { tier: 1, name: 'Tier 1: Novice Roadside Van', img: 'assets/rig-t1.png', color: '#cbd5e1', req: 'Starting Rig', perk: 'Standard highway response rig (+0% Payout Bonus).' },
  { tier: 2, name: 'Tier 2: Intermediate Utility Pickup', img: 'assets/rig-t2.png', color: '#38bdf8', req: 'All 4 Tools Lvl 5+', perk: '+12% Base Payouts & Twin Amber Strobes.' },
  { tier: 3, name: 'Tier 3: Pro Extended Tire Truck', img: 'assets/rig-t3.png', color: '#f59e0b', req: 'All 4 Tools Lvl 9+', perk: '+24% Base Payouts & Exterior Spare Tire Rack.' },
  { tier: 4, name: 'Tier 4: Commercial Dually Rig', img: 'assets/rig-t4.png', color: '#a855f7', req: 'All 4 Tools Lvl 13+', perk: '+36% Base Payouts & Dual-Wheel Hydraulic Lift.' },
  { tier: 5, name: 'Tier 5: Heavy-Duty Fleet Rescue Box', img: 'assets/rig-t5.png', color: '#ef4444', req: 'All 4 Tools Lvl 17+', perk: '+48% Base Payouts & Commercial Fleet Priority.' },
  { tier: 6, name: 'Tier 6: Master Apex Syndicate Flagship', img: 'assets/rig-t6.png', color: '#fde047', req: 'All 4 Tools Lvl 21+', perk: '+65% Base Payouts & Maximum Corridor Prestige.' }
];

// ALL 6 REGIONAL HUBS & ALL 24 HIGHWAY ZONES
const ZONES = [
  // HUB 1: ATLANTA METRO
  { id: 'z1', hub: 'HUB 1 · ATLANTA METRO', name: 'I-285 North Perimeter', mult: 1.0, unlockRep: 0, desc: 'Steady commuter flats and shoulder punctures.' },
  { id: 'z2', hub: 'HUB 1 · ATLANTA METRO', name: 'I-75 Downtown Connector', mult: 1.08, unlockRep: 60, desc: 'High-density commuter & SUV roadside calls.' },
  { id: 'z3', hub: 'HUB 1 · ATLANTA METRO', name: 'GA-400 Buckhead Express', mult: 1.15, unlockRep: 130, desc: 'Luxury sedans and evening rush-hour flats.' },
  { id: 'z4', hub: 'HUB 1 · ATLANTA METRO', name: 'I-285 Airport South Loop', mult: 1.22, unlockRep: 210, desc: 'Shuttle vans, pickups, and cargo sprinters.' },
  // HUB 2: GEORGIA FREIGHT
  { id: 'z5', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-20 West Freight Corridor', mult: 1.3, unlockRep: 300, desc: 'Commercial box trucks and highway blowouts.' },
  { id: 'z6', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-85 Gwinnett Logistics', mult: 1.38, unlockRep: 410, desc: 'Distribution hub semi-trailers & duals.' },
  { id: 'z7', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-75 Macon Bypass', mult: 1.46, unlockRep: 540, desc: 'Long-haul freight and heavy pickup rescues.' },
  { id: 'z8', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-16 Central Freightway', mult: 1.55, unlockRep: 680, desc: 'High-speed interstate retread delaminations.' },
  // HUB 3: COASTAL PORTS
  { id: 'z9', hub: 'HUB 3 · COASTAL PORTS', name: 'Savannah Port Gate 1', mult: 1.65, unlockRep: 850, desc: '18-wheeler port containers and dock gashes.' },
  { id: 'z10', hub: 'HUB 3 · COASTAL PORTS', name: 'Talmadge Bridge Approach', mult: 1.75, unlockRep: 1040, desc: 'Heavy container tractor-trailers.' },
  { id: 'z11', hub: 'HUB 3 · COASTAL PORTS', name: 'Brunswick Auto Terminal', mult: 1.85, unlockRep: 1250, desc: 'Fleet carriers and multi-axle haulers.' },
  { id: 'z12', hub: 'HUB 3 · COASTAL PORTS', name: 'Pooler Logistics Park', mult: 1.95, unlockRep: 1480, desc: '24/7 commercial warehouse dispatch grid.' },
  // HUB 4: SOUTHEAST EXPRESS
  { id: 'z13', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-95 Coastal Freightway', mult: 2.05, unlockRep: 1750, desc: 'Interstate night-shift emergency fleet calls.' },
  { id: 'z14', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-26 Charleston Spur', mult: 2.15, unlockRep: 2050, desc: 'Port-to-inland heavy commercial rigs.' },
  { id: 'z15', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-77 Charlotte Corridor', mult: 2.25, unlockRep: 2380, desc: 'High-speed regional freight & VIP calls.' },
  { id: 'z16', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-40 Piedmont Ridge', mult: 2.35, unlockRep: 2740, desc: 'Steep-grade heavy truck tire blowouts.' },
  // HUB 5: GULF CORRIDOR
  { id: 'z17', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-10 Jacksonville Interchange', mult: 2.45, unlockRep: 3150, desc: 'Cross-country 18-wheeler hub.' },
  { id: 'z18', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-65 Mobile Bayway', mult: 2.55, unlockRep: 3600, desc: 'Coastal bridge heavy-duty rescue.' },
  { id: 'z19', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-10 Baton Rouge Refinery', mult: 2.68, unlockRep: 4100, desc: 'Industrial tanker & commercial fleet calls.' },
  { id: 'z20', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-45 Houston Ship Channel', mult: 2.8, unlockRep: 4650, desc: 'Maximum-volume freight tire emergencies.' },
  // HUB 6: APEX SYNDICATE
  { id: 'z21', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Night-Shift Sector A', mult: 2.95, unlockRep: 5300, desc: 'Executive fleet & high-priority contracts.' },
  { id: 'z22', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Heavy Convoy Lane', mult: 3.1, unlockRep: 6000, desc: 'Multi-rig commercial rescue operations.' },
  { id: 'z23', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Interstate Command', mult: 3.3, unlockRep: 6800, desc: 'Elite zero-margin-for-error dispatches.' },
  { id: 'z24', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Pinnacle Terminal', mult: 3.5, unlockRep: 7700, desc: 'Top-tier syndicate payouts across all classes.' }
];

const VEHICLES = [
  { id: 'sedan', label: 'COMMUTER SEDAN', heavy: false, targetPsi: 35, bodyColor: '#64748b', img: 'assets/veh-sedan.png' },
  { id: 'suv', label: 'FAMILY SUV', heavy: false, targetPsi: 36, bodyColor: '#475569', img: 'assets/veh-suv.png' },
  { id: 'pickup', label: 'LIFTED 4X4 PICKUP', heavy: false, targetPsi: 40, bodyColor: '#b91c1c', img: 'assets/veh-pickup.png' },
  { id: 'boxtruck', label: 'COMMERCIAL BOX TRUCK', heavy: true, targetPsi: 95, bodyColor: '#cbd5e1', img: 'assets/veh-boxtruck.png' },
  { id: 'semi', label: '18-WHEELER TRACTOR', heavy: true, targetPsi: 105, bodyColor: '#1d4ed8', img: 'assets/veh-semi.png' }
];

const DAMAGES = [
  {
    key: 'center_nail',
    title: 'Center-Tread Nail Puncture',
    action: 'plug',
    fileKey: 'nail',
    verdict: 'REPAIRABLE · PLUG ONLY',
    desc: 'Steel nail embedded cleanly in center tread crown. Safe to ream & vulcanize plug.'
  },
  {
    key: 'bulge',
    title: 'Sidewall Impact Bulge',
    action: 'swap',
    fileKey: 'bulge',
    verdict: 'UNREPAIRABLE · TIRE SWAP ONLY',
    desc: 'Internal sidewall cords ruptured. Bubble will blow at highway speed—must swap tire.'
  },
  {
    key: 'blowout',
    title: 'High-Speed Sidewall Blowout',
    action: 'swap',
    fileKey: 'blowout',
    verdict: 'UNREPAIRABLE · TIRE SWAP ONLY',
    desc: 'Violently ruptured sidewall casing with exposed steel plies. Full tire swap required.'
  },
  {
    key: 'gash',
    title: 'Outer Shoulder Curb Gash',
    action: 'swap',
    fileKey: 'gash',
    verdict: 'UNREPAIRABLE · TIRE SWAP ONLY',
    desc: 'Deep structural slash across the non-repairable outer shoulder. Must swap tire.'
  },
  {
    key: 'shredded',
    title: 'Shredded / Delaminated Tread',
    action: 'swap',
    fileKey: 'shredded',
    verdict: 'UNREPAIRABLE · TIRE SWAP ONLY',
    desc: 'Separated tread strips and frayed steel belts. Full tire swap required.'
  }
];

const LUG_COORDS = [
  { id: 1, x: 50, y: 24 },
  { id: 2, x: 75, y: 42 },
  { id: 3, x: 65, y: 72 },
  { id: 4, x: 35, y: 72 },
  { id: 5, x: 25, y: 42 }
];
const STAR_ORDER = [1, 3, 5, 2, 4];

let state = {
  cash: 125,
  tokens: 15,
  parts: 0,
  rep: 0,
  zoneId: 'z1',
  surgeJobs: 0,
  plugs: 4,
  tires: 2,
  ratings: [5, 5, 5, 5, 5],
  tutorialDone: false,
  tools: {
    impact: { name: 'Pneumatic Impact Wrench', level: 1, baseCost: 60, prefix: 'tool-impact', icon: '🔫' },
    jack: { name: 'Hydraulic Floor Jack', level: 1, baseCost: 55, prefix: 'tool-jack', icon: '🏗️' },
    comp: { name: 'Portable Air Compressor', level: 1, baseCost: 65, prefix: 'tool-comp', icon: '💨' },
    radar: { name: 'Dispatch GPS Radar', level: 1, baseCost: 75, prefix: 'tool-radar', icon: '📡' }
  },
  jobs: [],
  activeJob: null
};

let previewRigTier = null;
let previewToolTiers = {};

function loadState() {
  try {
    const raw = localStorage.getItem('delwin_v4_save');
    if (raw) Object.assign(state, JSON.parse(raw));
    if (!ZONES.some((z) => z.id === state.zoneId)) state.zoneId = 'z1';
  } catch (e) {}
}

function saveState() {
  try { localStorage.setItem('delwin_v4_save', JSON.stringify(state)); } catch (e) {}
}

function getRigTier() {
  const minLvl = Math.min(...Object.values(state.tools).map((t) => t.level));
  return Math.min(6, Math.floor((minLvl - 1) / 4) + 1);
}

function getZone() {
  return ZONES.find((z) => z.id === state.zoneId) || ZONES[0];
}

function renderRigSVG(tierObj) {
  return `
    <svg viewBox="0 0 260 95" width="240" height="88">
      <ellipse cx="130" cy="86" rx="108" ry="6" fill="rgba(0,0,0,0.6)"/>
      <rect x="32" y="26" width="136" height="44" rx="8" fill="#1e293b" stroke="${tierObj.color}" stroke-width="2.5"/>
      <path d="M168 34 L212 34 L228 52 L228 70 L168 70 Z" fill="#0f172a" stroke="${tierObj.color}" stroke-width="2.5"/>
      <polygon points="174,38 206,38 218,51 174,51" fill="#38bdf8" opacity="0.45"/>
      <rect x="85" y="18" width="38" height="7" rx="3" fill="#f59e0b"/>
      <text x="52" y="53" fill="#f59e0b" font-size="13" font-weight="900" font-family="sans-serif">DELWIN T${tierObj.tier}</text>
      <circle cx="68" cy="73" r="14" fill="#090c12" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="68" cy="73" r="6" fill="${tierObj.color}"/>
      <circle cx="196" cy="73" r="14" fill="#090c12" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="196" cy="73" r="6" fill="${tierObj.color}"/>
    </svg>`;
}

function renderVehicleSVG(veh) {
  return `
    <svg viewBox="0 0 280 90" width="275" height="90">
      <path d="M24 68 L24 44 L66 40 L98 18 L194 18 L224 40 L256 46 L256 68 Z" fill="${veh.bodyColor}" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="102,23 188,23 210,39 82,39" fill="#0f172a" opacity="0.85"/>
      <path d="M104 68 A36 36 0 0 1 176 68 Z" fill="#090c12" stroke="#f59e0b" stroke-width="2.2"/>
    </svg>`;
}

function renderTireSVG(job, size = 130) {
  const dmg = job.dmg.key;
  let dmgLayer = '';
  if (!job.fixed) {
    if (dmg === 'center_nail') {
      dmgLayer = `
        <circle cx="65" cy="14" r="12" fill="rgba(239,68,68,0.3)" stroke="#ef4444" stroke-width="2"/>
        <line x1="65" y1="2" x2="65" y2="18" stroke="#f8fafc" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="59" y1="2" x2="71" y2="2" stroke="#f8fafc" stroke-width="3"/>`;
    } else if (dmg === 'bulge') {
      dmgLayer = `
        <ellipse cx="17" cy="70" rx="13" ry="19" fill="#334155" stroke="#ef4444" stroke-width="2.5"/>
        <text x="17" y="74" text-anchor="middle" fill="#fecaca" font-size="10" font-weight="900">!</text>`;
    } else if (dmg === 'blowout') {
      dmgLayer = `
        <polygon points="12,54 27,63 15,74 28,85 10,89 5,69" fill="#ef4444" stroke="#fecaca" stroke-width="1.5"/>`;
    } else if (dmg === 'gash') {
      dmgLayer = `
        <line x1="20" y1="22" x2="42" y2="44" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>`;
    } else if (dmg === 'shredded') {
      dmgLayer = `
        <path d="M22 22 L11 11 M44 10 L40 1 M86 10 L92 1 M108 24 L119 15" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>`;
    }
  }
  return `
    <svg viewBox="0 0 130 130" width="${size}" height="${size}">
      <circle cx="65" cy="65" r="56" fill="#111827" stroke="${job.fixed ? '#10b981' : '#334155'}" stroke-width="6"/>
      <circle cx="65" cy="65" r="46" fill="none" stroke="#1f2937" stroke-width="6" stroke-dasharray="8 6"/>
      <circle cx="65" cy="65" r="32" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="65" cy="65" r="11" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
      ${dmgLayer}
    </svg>`;
}
