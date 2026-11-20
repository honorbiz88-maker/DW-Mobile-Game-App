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
  { id: 'sedan', label: 'COMMUTER SEDAN', heavy: false, targetPsi: 35, bodyColor: '#64
