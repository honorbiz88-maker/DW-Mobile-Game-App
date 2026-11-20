const TIER_NAMES = ['Novice', 'Intermediate', 'Pro', 'Commercial', 'Heavy-Duty', 'Master'];

const RIG_TIERS = [
  { tier: 1, name: 'Tier 1: Novice Roadside Van', img: 'assets/rig-t1.png', color: '#cbd5e1', req: 'Starting Rig', mult: 1.00, perk: 'Standard highway response rig (1.00x Payouts).' },
  { tier: 2, name: 'Tier 2: Intermediate Utility Pickup', img: 'assets/rig-t2.png', color: '#38bdf8', req: 'All 4 Tools Lvl 5+', mult: 1.15, perk: '1.15x Base Payouts & Twin Amber Strobes.' },
  { tier: 3, name: 'Tier 3: Pro Extended Tire Truck', img: 'assets/rig-t3.png', color: '#f59e0b', req: 'All 4 Tools Lvl 9+', mult: 1.32, perk: '1.32x Base Payouts & Exterior Spare Tire Rack.' },
  { tier: 4, name: 'Tier 4: Commercial Dually Rig', img: 'assets/rig-t4.png', color: '#a855f7', req: 'All 4 Tools Lvl 13+', mult: 1.52, perk: '1.52x Base Payouts & Dual-Wheel Hydraulic Lift.' },
  { tier: 5, name: 'Tier 5: Heavy-Duty Fleet Rescue Box', img: 'assets/rig-t5.png', color: '#ef4444', req: 'All 4 Tools Lvl 17+', mult: 1.75, perk: '1.75x Base Payouts & Commercial Fleet Priority.' },
  { tier: 6, name: 'Tier 6: Master Apex Syndicate Flagship', img: 'assets/rig-t6.png', color: '#fde047', req: 'All 4 Tools Lvl 21+', mult: 2.00, perk: '2.00x Base Payouts & Maximum Corridor Prestige.' }
];

// Tuned 24-Zone / 6-Hub REP curve: ~8-12 clean jobs per early zone, scaling smoothly to 22,500 REP
const ZONES = [
  { id: 'z1', hub: 'HUB 1 · ATLANTA METRO', name: 'I-285 North Perimeter', mult: 1.00, unlockRep: 0, desc: 'Steady commuter flats and shoulder punctures.' },
  { id: 'z2', hub: 'HUB 1 · ATLANTA METRO', name: 'I-75 Downtown Connector', mult: 1.12, unlockRep: 350, desc: 'High-density commuter & SUV roadside calls.' },
  { id: 'z3', hub: 'HUB 1 · ATLANTA METRO', name: 'GA-400 Buckhead Express', mult: 1.24, unlockRep: 850, desc: 'Luxury sedans and evening rush-hour flats.' },
  { id: 'z4', hub: 'HUB 1 · ATLANTA METRO', name: 'I-285 Airport South Loop', mult: 1.36, unlockRep: 1500, desc: 'Shuttle vans, pickups, and cargo sprinters.' },
  { id: 'z5', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-20 West Freight Corridor', mult: 1.50, unlockRep: 2300, desc: 'Commercial box trucks and highway blowouts.' },
  { id: 'z6', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-85 Gwinnett Logistics', mult: 1.64, unlockRep: 3250, desc: 'Distribution hub semi-trailers & duals.' },
  { id: 'z7', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-75 Macon Bypass', mult: 1.78, unlockRep: 4350, desc: 'Long-haul freight and heavy pickup rescues.' },
  { id: 'z8', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-16 Central Freightway', mult: 1.92, unlockRep: 5600, desc: 'High-speed interstate retread delaminations.' },
  { id: 'z9', hub: 'HUB 3 · COASTAL PORTS', name: 'Savannah Port Gate 1', mult: 2.08, unlockRep: 7000, desc: '18-wheeler port containers and dock gashes.' },
  { id: 'z10', hub: 'HUB 3 · COASTAL PORTS', name: 'Talmadge Bridge Approach', mult: 2.24, unlockRep: 8550, desc: 'Heavy container tractor-trailers.' },
  { id: 'z11', hub: 'HUB 3 · COASTAL PORTS', name: 'Brunswick Auto Terminal', mult: 2.40, unlockRep: 10250, desc: 'Fleet carriers and multi-axle haulers.' },
  { id: 'z12', hub: 'HUB 3 · COASTAL PORTS', name: 'Pooler Logistics Park', mult: 2.58, unlockRep: 12100, desc: '24/7 commercial warehouse dispatch grid.' },
  { id: 'z13', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-95 Coastal Freightway', mult: 2.76, unlockRep: 14100, desc: 'Interstate night-shift emergency fleet calls.' },
  { id: 'z14', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-26 Charleston Spur', mult: 2.94, unlockRep: 16250, desc: 'Port-to-inland heavy commercial rigs.' },
  { id: 'z15', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-77 Charlotte Corridor', mult: 3.12, unlockRep: 18550, desc: 'High-speed regional freight & VIP calls.' },
  { id: 'z16', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-40 Piedmont Ridge', mult: 3.30, unlockRep: 21000, desc: 'Steep-grade heavy truck tire blowouts.' },
  { id: 'z17', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-10 Jacksonville Interchange', mult: 3.50, unlockRep: 23650, desc: 'Cross-country 18-wheeler hub.' },
  { id: 'z18', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-65 Mobile Bayway', mult: 3.70, unlockRep: 26500, desc: 'Coastal bridge heavy-duty rescue.' },
  { id: 'z19', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-10 Baton Rouge Refinery', mult: 3.90, unlockRep: 29550, desc: 'Industrial tanker & commercial fleet calls.' },
  { id: 'z20', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-45 Houston Ship Channel', mult: 4.12, unlockRep: 32800, desc: 'Maximum-volume freight tire emergencies.' },
  { id: 'z21', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Night-Shift Sector A', mult: 4.35, unlockRep: 36300, desc: 'Executive fleet & high-priority contracts.' },
  { id: 'z22', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Heavy Convoy Lane', mult: 4.60, unlockRep: 40000, desc: 'Multi-rig commercial rescue operations.' },
  { id: 'z23', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Interstate Command', mult: 4.85, unlockRep: 44000, desc: 'Elite zero-margin-for-error dispatches.' },
  { id: 'z24', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Pinnacle Terminal', mult: 5.15, unlockRep: 48500, desc: 'Top-tier syndicate payouts across all classes.' }
];

const VEHICLES = [
  { id: 'sedan', label: 'COMMUTER SEDAN', heavy: false, basePay: 75, targetPsi: 35, timeSec: 85, bodyColor: '#64748b', img: 'assets/veh-sedan.png' },
  { id: 'suv', label: 'FAMILY SUV', heavy: false, basePay: 88, targetPsi: 36, timeSec: 80, bodyColor: '#475569', img: 'assets/veh-suv.png' },
  { id: 'pickup', label: 'LIFTED 4X4 PICKUP', heavy: false, basePay: 100, targetPsi: 40, timeSec: 75, bodyColor: '#b91c1c', img: 'assets/veh-pickup.png' },
  { id: 'boxtruck', label: 'COMMERCIAL BOX TRUCK', heavy: true, basePay: 155, targetPsi: 95, timeSec: 95, bodyColor: '#cbd5e1', img: 'assets/veh-boxtruck.png' },
  { id: 'semi', label: '18-WHEELER TRACTOR', heavy: true, basePay: 195, targetPsi: 105, timeSec: 105, bodyColor: '#1d4ed8', img: 'assets/veh-semi.png' }
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

// BALANCED DUAL-CURRENCY CONTRACTS:
// Contracts pay Cash + REP + 1-2 Dispatch Tokens (⚡) or 1 Gold Tool Part (⚙️) on elite contracts.
const CONTRACT_POOL = [
  { id: 'c_clean4', title: 'Zero-Penalty Streak', desc: 'Complete 4 calls with $0 protocol or safety penalties.', type: 'clean_streak', target: 4, rewardCash: 185, rewardTokens: 2, rewardPart: 0, rewardRep: 95 },
  { id: 'c_plug3', title: 'Crown Plug Specialist', desc: 'Properly plug 3 center-tread nail punctures.', type: 'plugs', target: 3, rewardCash: 150, rewardTokens: 1, rewardPart: 0, rewardRep: 80 },
  { id: 'c_swap3', title: 'Casing Replacement Pro', desc: 'Complete 3 tire swaps (Standard or Heavy-Duty).', type: 'swaps', target: 3, rewardCash: 210, rewardTokens: 2, rewardPart: 0, rewardRep: 105 },
  { id: 'c_fast3', title: 'Rapid Highway Response', desc: 'Finish 3 calls with ≥45% SLA timer remaining.', type: 'fast', target: 3, rewardCash: 225, rewardTokens: 2, rewardPart: 1, rewardRep: 120 },
  { id: 'c_heavy2', title: 'Commercial Fleet Rescue', desc: 'Service 2 Box Trucks or 18-Wheelers with HD tires.', type: 'heavy', target: 2, rewardCash: 280, rewardTokens: 3, rewardPart: 1, rewardRep: 145 }
];

const LUG_COORDS = [
  { id: 1, x: 50, y: 24 },
  { id: 2, x: 75, y: 42 },
  { id: 3, x: 65, y: 72 },
  { id: 4, x: 35, y: 72 },
  { id: 5, x: 25, y: 42 }
];
const STAR_ORDER = [1, 3, 5, 2, 4];

const AVATAR_PRESETS = ['🛞', '🚛', '🔧', '⚡', '🏆', '🔥', '🛡️', '👑'];

let state = {
  bizName: 'DelWin Mobile Tire Rescue',
  avatarEmoji: '🛞',
  avatarImg: '',
  cash: 140,
  tokens: 8,
  parts: 0,
  rep: 0,
  streak: 0,
  jobsCompleted: 0,
  zoneId: 'z1',
  surgeJobs: 0,
  plugs: 4,
  stdTires: 2,
  hdTires: 1,
  ratings: [5.0, 5.0, 5.0, 5.0, 5.0],
  tutorialDone: false,
  contract: {
    id: 'c_clean4',
    title: 'Zero-Penalty Streak',
    desc: 'Complete 4 calls with $0 protocol or safety penalties.',
    type: 'clean_streak',
    target: 4,
    progress: 0,
    rewardCash: 185,
    rewardTokens: 2,
    rewardPart: 0,
    rewardRep: 95
  },
  tools: {
    impact: { name: 'Pneumatic Impact Wrench', level: 1, baseCost: 75, prefix: 'tool-impact', icon: '🔫' },
    jack: { name: 'Hydraulic Floor Jack', level: 1, baseCost: 70, prefix: 'tool-jack', icon: '🏗️' },
    comp: { name: 'Portable Air Compressor', level: 1, baseCost: 80, prefix: 'tool-comp', icon: '💨' },
    radar: { name: 'Dispatch GPS Radar', level: 1, baseCost: 90, prefix: 'tool-radar', icon: '📡' }
  },
  jobs: [],
  activeJob: null
};

let previewRigTier = null;
let previewToolTiers = {};
let bayTimerInterval = null;
let spinClearTimeout = null;

function loadState() {
  try {
    const raw = localStorage.getItem('delwin_v4_save');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate legacy single `tires` inventory to `stdTires` cleanly
      if (typeof parsed.tires === 'number' && typeof parsed.stdTires !== 'number') {
        parsed.stdTires = parsed.tires;
      }
      Object.assign(state, parsed);
    }
    if (!ZONES.some((z) => z.id === state.zoneId)) state.zoneId = 'z1';
    if (!state.contract) rollNewContract();
    if (!state.bizName) state.bizName = 'DelWin Mobile Tire Rescue';
    if (!state.avatarEmoji) state.avatarEmoji = '🛞';
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

function getRatingAvg() {
  return state.ratings.reduce((a, b) => a + b, 0) / state.ratings.length;
}

function injectCustomStyles() {
  if (document.getElementById('delwin-v42-styles')) return;
  const st = document.createElement('style');
  st.id = 'delwin-v42-styles';
  st.textContent = `
    .stage-cones {
      position: absolute; bottom: 28px; right: 16px;
      display: flex; gap: 6px; z-index: 6;
      opacity: 0.25; transition: all 0.25s ease;
    }
    .stage-cones.set { opacity: 1; transform: scale(1.06); }
    .cone-item {
      width: 12px; height: 18px;
      background: linear-gradient(180deg, #f97316 0%, #f97316 42%, #f8fafc 42%, #f8fafc 64%, #f97316 64%);
      clip-path: polygon(35% 0%, 65% 0%, 95% 100%, 5% 100%);
      border-bottom: 2px solid #090c12;
    }
    .stage-cones.set .cone-item { box-shadow: 0 0 8px rgba(249, 115, 22, 0.7); }
    .ctrl-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .profile-pill {
      display: flex; align-items: center; gap: 8px;
      background: #0f172a; border: 1px solid var(--border);
      padding: 8px 10px; border-radius: 10px; margin-bottom: 8px;
    }
    .profile-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: #1e293b; border: 1.5px solid var(--amber);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; overflow: hidden; flex-shrink: 0;
    }
    .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .emoji-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; }
    .emoji-opt {
      padding: 8px; font-size: 20px; border-radius: 8px;
      background: #0f172a; border: 1px solid var(--border); cursor: pointer;
    }
    .emoji-opt.active { border-color: var(--amber); background: #1e293b; }
  `;
  document.head.appendChild(st);
}

// --- PLAYER PROFILE & BUSINESS NAME EDITOR ---
function renderProfileCard() {
  const drawer = document.getElementById('menu-drawer');
  if (!drawer) return;
  let card = document.getElementById('biz-profile-card');
  if (!card) {
    card = document.createElement('div');
    card.id = 'biz-profile-card';
    const header = drawer.querySelector('.drawer-header');
    if (header && header.nextSibling) drawer.insertBefore(card, header.nextSibling);
    else drawer.prepend(card);
  }
  const avatarHtml = state.avatarImg
    ? `<img src="${state.avatarImg}" alt="Logo" />`
    : `<span>${state.avatarEmoji}</span>`;
  card.innerHTML = `
    <div class="profile-pill">
      <div class="profile-avatar">${avatarHtml}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${state.bizName}</div>
        <div style="font-size:11px;color:var(--amber);">Tier ${getRigTier()} Operator · ${state.rep} REP</div>
      </div>
      <button class="ghost-btn" style="padding:4px 8px;font-size:11px;" onclick="toggleDrawer(false); openProfileEditor();">Edit</button>
    </div>`;
}

function openProfileEditor() {
  const presetBtns = AVATAR_PRESETS.map((em) =>
    `<button type="button" class="emoji-opt ${!state.avatarImg && state.avatarEmoji === em ? 'active' : ''}" onclick="selectAvatarEmoji('${em}')">${em}</button>`
  ).join('');
  openModal(`
    <span class="badge">COMPANY IDENTITY</span>
    <h3>Edit Business Name & Logo</h3>
    <label style="font-size:12px;color:var(--muted);">Business / Fleet Name</label>
    <input id="edit-biz-input" type="text" maxlength="28" value="${state.bizName.replace(/"/g, '&quot;')}"
      style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:#090c12;color:var(--text);font-weight:700;" />
    <label style="font-size:12px;color:var(--muted);margin-top:4px;">Choose Fleet Badge</label>
    <div class="emoji-grid">${presetBtns}</div>
    <label style="font-size:12px;color:var(--muted);">Or Upload Custom Logo / Photo</label>
    <input type="file" accept="image/*" onchange="handleAvatarUpload(event)" style="font-size:12px;color:var(--muted);" />
    <div class="ctrl-grid-2" style="margin-top:6px;">
      <button class="secondary-btn" onclick="closeModal()">CANCEL</button>
      <button class="primary-btn" onclick="saveProfileEdits()">SAVE PROFILE</button>
    </div>
  `);
}

function selectAvatarEmoji(em) {
  state.avatarEmoji = em;
  state.avatarImg = '';
  openProfileEditor();
}

function handleAvatarUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 96, 96);
      state.avatarImg = canvas.toDataURL('image/jpeg', 0.8);
      saveState();
      renderProfileCard();
      if (document.getElementById('page-league').classList.contains('active')) renderLeague();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function saveProfileEdits() {
  const inp = document.getElementById('edit-biz-input');
  if (inp && inp.value.trim()) {
    state.bizName = inp.value.trim();
  }
  saveState();
  updateHUD();
  if (document.getElementById('page-league').classList.contains('active')) renderLeague();
  closeModal();
}

// --- CONTRACTS ---
function rollNewContract() {
  const currentId = state.contract ? state.contract.id : '';
  const options = CONTRACT_POOL.filter((c) => c.id !== currentId);
  const pick = options[Math.floor(Math.random() * options.length)];
  state.contract = { ...pick, progress: 0 };
}

function claimContract() {
  const c = state.contract;
  if (!c || c.progress < c.target) return;
  SoundFX.success();
  const zMult = getZone().mult;
  const cashWon = Math.round(c.rewardCash * zMult);
  const repWon = Math.round(c.rewardRep * zMult);
  state.cash += cashWon;
  state.tokens += c.rewardTokens;
  state.parts += c.rewardPart || 0;
  state.rep += repWon;
  rollNewContract();
  saveState();
  updateHUD();
  renderContractBanner();
  openModal(`
    <span class="badge">DELWIN MOBILE CONTRACT CLEARED</span>
    <h3>${c.title}</h3>
    <div style="background:#090c12;padding:12px;border-radius:10px;font-size:13px;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;justify-content:space-between;"><span>Contract Cash Bonus:</span><strong style="color:var(--green);">+$${cashWon}</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Dispatch Tokens:</span><strong style="color:var(--amber);">+${c.rewardTokens} ⚡</strong></div>
      ${c.rewardPart ? `<div style="display:flex;justify-content:space-between;"><span>Gold Tool Part:</span><strong style="color:var(--amber);">+${c.rewardPart} ⚙️</strong></div>` : ''}
      <div style="display:flex;justify-content:space-between;"><span>Corridor Reputation:</span><strong style="color:var(--blue);">+${repWon} REP</strong></div>
    </div>
    <button class="primary-btn" onclick="closeModal()">NEXT CONTRACT ASSIGNED</button>
  `);
}

function renderContractBanner() {
  const dispatchPage = document.getElementById('page-dispatch');
  if (!dispatchPage) return;
  let box = document.getElementById('delwin-contract-card');
  if (!box) {
    box = document.createElement('div');
    box.id = 'delwin-contract-card';
    box.className = 'item-card';
    box.style.borderColor = 'var(--amber)';
    const jobList = document.getElementById('job-list');
    dispatchPage.insertBefore(box, jobList);
  }
  const c = state.contract;
  const ready = c.progress >= c.target;
  const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
  const zMult = getZone().mult;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="badge">📋 CONTRACT</span>
      <strong style="font-size:12px;color:var(--amber);">
        $${Math.round(c.rewardCash * zMult)} + ${c.rewardTokens}⚡${c.rewardPart ? ` + ${c.rewardPart}⚙️` : ''}
      </strong>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
      <strong style="font-size:14px;">${c.title}</strong>
      <span style="font-size:12px;font-weight:800;color:${ready ? 'var(--green)' : 'var(--muted)'};">${c.progress}/${c.target}</span>
    </div>
    <p style="font-size:12px;color:var(--muted);">${c.desc}</p>
    <div style="height:6px;background:#090c12;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${pct}%;background:${ready ? 'var(--green)' : 'var(--amber)'};"></div>
    </div>
    ${ready ? `<button class="primary-btn" onclick="claimContract()">CLAIM CONTRACT REWARD</button>` : ''}
  `;
}

// --- SVG FALLBACKS ---
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

// --- INVENTORY & HUD (Standard + Heavy-Duty Tires) ---
function renderStockBar() {
  const bar = document.querySelector('.stock-bar');
  if (!bar) return;
  bar.className = 'stock-bar ctrl-grid-3';
  bar.style.display = 'grid';
  bar.style.gridTemplateColumns = '1fr 1fr 1fr';
  bar.style.gap = '6px';
  bar.innerHTML = `
    <button class="stock-btn" onclick="buyStock('plug')" style="font-size:11px;padding:8px 4px;">
      Plugs: <strong>${state.plugs}</strong><br><span style="color:var(--amber);">+3 ($20)</span>
    </button>
    <button class="stock-btn" onclick="buyStock('std')" style="font-size:11px;padding:8px 4px;">
      Std Tires: <strong>${state.stdTires}</strong><br><span style="color:var(--amber);">+1 ($45)</span>
    </button>
    <button class="stock-btn" onclick="buyStock('hd')" style="font-size:11px;padding:8px 4px;">
      HD Tires: <strong>${state.hdTires}</strong><br><span style="color:var(--amber);">+1 ($95)</span>
    </button>`;
}

function updateHUD() {
  document.getElementById('hud-cash').textContent = state.cash;
  document.getElementById('hud-tokens').textContent = state.tokens;
  document.getElementById('drawer-parts').textContent = `${state.parts} ⚙️`;
  const avg = getRatingAvg().toFixed(1);
  document.getElementById('drawer-rating').textContent = `${avg} ★`;
  const z = getZone();
  document.getElementById('drawer-zone').textContent = z.name;
  document.getElementById('dispatch-zone-label').textContent = `${z.name.toUpperCase()} (${z.mult}x)`;
  document.getElementById('dispatch-boost-label').textContent =
    state.surgeJobs > 0 ? `2X SURGE ACTIVE (${state.surgeJobs} LEFT)` : 'ACTIVATE 2X SURGE';
  renderStockBar();
  renderContractBanner();
  renderProfileCard();
}

function goPage(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const nav = document.getElementById(`nav-${pageId}`);
  if (nav) nav.classList.add('active');
  if (pageId === 'dispatch') renderContractBanner();
  if (pageId === 'garage') {
    previewRigTier = getRigTier();
    renderGarage();
  }
  if (pageId === 'league') renderLeague();
  if (pageId === 'zones') renderZones();
  if (pageId === 'bay') renderBay();
}

function toggleDrawer(open) {
  renderProfileCard();
  document.getElementById('drawer-backdrop').classList.toggle('hidden', !open);
  document.getElementById('menu-drawer').classList.toggle('hidden', !open);
}

function toggleSound() {
  const on = SoundFX.toggle();
  document.getElementById('sound-toggle-btn').textContent = `🔊 Mechanical Audio: ${on ? 'ON' : 'OFF'}`;
}

// --- DISPATCH & JOB GENERATION ---
function generateJob(vip = false) {
  const z = getZone();
  const pool = z.id === 'z1' ? VEHICLES.slice(0, 3) : VEHICLES;
  const veh = pool[Math.floor(Math.random() * pool.length)];
  const dmg = DAMAGES[Math.floor(Math.random() * DAMAGES.length)];
  const mile = Math.floor(Math.random() * 65) + 4;
  const rig = RIG_TIERS[getRigTier() - 1];
  const ratingBonus = getRatingAvg() >= 4.7 ? 1.08 : 1.0;
  // Balanced VIP multiplier (1.65x) so spending 4 Dispatch Tokens has clear ROI
  const basePay = Math.round(veh.basePay * z.mult * rig.mult * ratingBonus * (vip ? 1.65 : 1));
  const radarBonusSec = (state.tools.radar.level - 1) * 2;
  const timeLimit = veh.timeSec + radarBonusSec;
  return {
    id: 'job_' + Math.random().toString(36).slice(2, 8),
    title: `${z.name.split(' ')[0]} Mile ${mile} — Stranded ${veh.label.split(' ')[1]}`,
    veh,
    dmg,
    pay: basePay,
    timeLimit,
    vip,
    snipeCost: vip ? 4 : 0
  };
}

function refreshJobs() {
  state.jobs = [generateJob(false), generateJob(false), generateJob(false), generateJob(true)];
  renderJobs();
}

function renderJobs() {
  const wrap = document.getElementById('job-list');
  wrap.innerHTML = state.jobs.map((j) => `
    <div class="job-card ${j.vip ? 'vip' : ''}">
      <div class="job-top">
        <div>
          <span class="badge">${j.vip ? '⚡ VIP COMMERCIAL SNIPE' : j.veh.label}</span>
          <h3 style="font-size:14px;margin-top:5px;">${j.title}</h3>
        </div>
        <div class="job-pay">$${j.pay}${state.surgeJobs > 0 ? ' (2x)' : ''}</div>
      </div>
      <div class="job-meta">
        <span>${j.veh.heavy ? '🛞 Heavy-Duty Tire' : '🛞 Standard Tire'} · ${j.veh.targetPsi} PSI</span>
        <span>⏱️ SLA: ${j.timeLimit}s</span>
      </div>
      <button class="primary-btn" onclick="acceptJob('${j.id}')">
        ${j.vip ? `SNIPE DISPATCH (${j.snipeCost} ⚡)` : 'ACCEPT & ROLL RIG'}
      </button>
    </div>
  `).join('');
}

// --- LIVE COUNTDOWN TIMER (Always initialized & ticking cleanly) ---
function startBayTimer() {
  if (bayTimerInterval) clearInterval(bayTimerInterval);
  bayTimerInterval = setInterval(() => {
    const job = state.activeJob;
    if (!job || job.isTutorial) return;
    if (typeof job.timeLeft !== 'number' || isNaN(job.timeLeft)) {
      job.timeLeft = job.timeLimit || job.veh.timeSec || 85;
    }
    if (job.timeLeft > 0) {
      job.timeLeft -= 1;
      const timerEl = document.getElementById('bay-timer-badge');
      if (timerEl) {
        timerEl.textContent = `⏱️ ${job.timeLeft}s`;
        timerEl.style.color = job.timeLeft <= 20 ? '#ef4444' : '#f59e0b';
      }
      if (job.timeLeft === 0) {
        addBayPenalty(job, 25, 'SLA Response Timeout: Exceeded dispatch window');
        showAlert('SLA TIMER EXPIRED (-$25)', 'Dispatch response window expired! Finish the repair immediately to avoid further rating loss.');
        renderBay();
      }
    }
  }, 1000);
}

function acceptJob(jobId) {
  if (state.activeJob) {
    goPage('bay');
    return;
  }
  const job = state.jobs.find((j) => j.id === jobId);
  if (!job) return;
  if (job.vip) {
    if (state.tokens < job.snipeCost) {
      showAlert('INSUFFICIENT TOKENS', `VIP Commercial Snipe requires ${job.snipeCost} ⚡ Dispatch Tokens.`);
      goPage('shop');
      return;
    }
    state.tokens -= job.snipeCost;
  }
  state.jobs = state.jobs.filter((j) => j.id !== jobId);
  const startSec = job.timeLimit || job.veh.timeSec || 85;
  state.activeJob = {
    ...job,
    timeLimit: startSec,
    timeLeft: startSec,
    step: 1,
    conesSet: false,
    chocked: false,
    liftPct: 0,
    lugsRemoved: [],
    lastSpunLug: null,
    scanned: false,
    fixed: false,
    psi: 12,
    torqueIdx: 0,
    penalties: 0,
    penaltyLog: []
  };
  saveState();
  updateHUD();
  renderJobs();
  startBayTimer();
  goPage('bay');
}

function startTutorial() {
  state.activeJob = {
    id: 'tut_call',
    isTutorial: true,
    title: 'I-285 Mile 14 — Guided Training Call',
    veh: VEHICLES[0],
    dmg: DAMAGES[0],
    pay: 80,
    timeLimit: 120,
    timeLeft: 120,
    vip: false,
    snipeCost: 0,
    step: 1,
    conesSet: false,
    chocked: false,
    liftPct: 0,
    lugsRemoved: [],
    lastSpunLug: null,
    scanned: false,
    fixed: false,
    psi: 14,
    torqueIdx: 0,
    penalties: 0,
    penaltyLog: []
  };
  dismissAlert();
  goPage('bay');
}

function skipTutorial() {
  state.tutorialDone = true;
  state.activeJob = null;
  saveState();
  updateHUD();
  goPage('dispatch');
}

function getTutorialCoaching(job) {
  if (job.step === 1 && !job.conesSet) {
    return { stepLabel: 'TRAINING 1/7', text: 'Tap DEPLOY TRAFFIC CONES first to secure your highway work perimeter.' };
  }
  if (job.step === 1 && !job.chocked) {
    return { stepLabel: 'TRAINING 2/7', text: 'Tap SET WHEEL CHOCKS next to lock the opposite wheels before jacking.' };
  }
  if (job.step === 1 && job.chocked) {
    return { stepLabel: 'TRAINING 3/7', text: 'Tap PUMP FLOOR JACK to raise the hydraulic lift arm and vehicle body.' };
  }
  if (job.step === 2) {
    return { stepLabel: 'TRAINING 4/7', text: 'Tap each of the 5 glowing lug nuts directly on the wheel hub to spin them off.' };
  }
  if (job.step === 3 && !job.scanned) {
    return { stepLabel: 'TRAINING 5/7', text: 'Tap SCAN TIRE TREAD & SIDEWALL to inspect the damage.' };
  }
  if (job.step === 3 && job.scanned) {
    return { stepLabel: 'TRAINING 5/7', text: 'Center-tread nail detected! Tap PLUG PUNCTURE (never swap a center nail).' };
  }
  if (job.step === 4) {
    return { stepLabel: 'TRAINING 6/7', text: 'Inflate air into the green 33–37 PSI target band, then tap LOCK PRESSURE.' };
  }
  return { stepLabel: 'TRAINING 7/7', text: `Tap Lug #${STAR_ORDER[job.torqueIdx]} directly on the wheel hub (Star Order: 1→3→5→2→4).` };
}

function addBayPenalty(job, amount, reason) {
  if (!job || job.isTutorial) return;
  job.penalties += amount;
  if (!job.penaltyLog) job.penaltyLog = [];
  job.penaltyLog.push({ reason, amount });
}

function showAlert(title, msg) {
  SoundFX.error();
  document.getElementById('diag-alert-title').textContent = title;
  document.getElementById('diag-alert-msg').textContent = msg;
  document.getElementById('diag-alert').classList.remove('hidden');
}

function dismissAlert() {
  document.getElementById('diag-alert').classList.add('hidden');
}

function getTireSpritePath(job) {
  const prefix = job.veh.heavy ? 'assets/bay-hd-tire-' : 'assets/bay-tire-';
  const suffix = job.fixed ? 'good.png' : `${job.dmg.fileKey}.png`;
  return prefix + suffix;
}

// --- 5-STEP REPAIR BAY ---
function renderBay() {
  const job = state.activeJob;
  document.getElementById('bay-empty').classList.toggle('hidden', !!job);
  document.getElementById('bay-active').classList.toggle('hidden', !job);
  if (!job) return;

  // Guard against saved legacy jobs missing timeLeft
  if (typeof job.timeLeft !== 'number' || isNaN(job.timeLeft)) {
    job.timeLimit = job.timeLimit || job.veh.timeSec || 85;
    job.timeLeft = job.timeLimit;
    if (!job.isTutorial) startBayTimer();
  }

  let tutEl = document.getElementById('tut-coach-box');
  if (!tutEl) {
    tutEl = document.createElement('div');
    tutEl.id = 'tut-coach-box';
    const bayActive = document.getElementById('bay-active');
    bayActive.insertBefore(tutEl, bayActive.firstChild);
  }
  if (job.isTutorial) {
    const coach = getTutorialCoaching(job);
    tutEl.className = 'tut-banner';
    tutEl.innerHTML = `
      <div class="tut-banner-top">
        <span class="badge">${coach.stepLabel} · REWARD: +12 ⚡</span>
        <button class="ghost-btn" style="padding:3px 8px;font-size:11px;" onclick="skipTutorial()">Skip</button>
      </div>
      <p>${coach.text}</p>`;
  } else {
    tutEl.className = 'hidden';
  }

  document.getElementById('bay-veh-tag').textContent = job.veh.label;
  document.getElementById('bay-job-title').textContent = job.title;
  const finalPay = job.pay * (state.surgeJobs > 0 ? 2 : 1);
  const payoutBox = document.getElementById('bay-payout');
  payoutBox.innerHTML = `
    <div>$${finalPay}${job.penalties > 0 ? ` <span style="font-size:11px;color:var(--red);">(-$${job.penalties})</span>` : ''}</div>
    <div id="bay-timer-badge" style="font-size:12px;font-weight:800;color:${job.isTutorial ? '#38bdf8' : job.timeLeft <= 20 ? '#ef4444' : '#f59e0b'};">
      ${job.isTutorial ? 'TRAINING' : `⏱️ ${job.timeLeft}s`}
    </div>`;

  const stage = document.getElementById('bay-stage');
  if (!document.getElementById('mag-tray')) {
    const tray = document.createElement('div');
    tray.id = 'mag-tray';
    tray.className = 'mag-tray';
    tray.textContent = 'MAG TRAY';
    stage.appendChild(tray);
  }
  if (!document.getElementById('stage-cones')) {
    const cones = document.createElement('div');
    cones.id = 'stage-cones';
    cones.className = 'stage-cones';
    cones.innerHTML = '<div class="cone-item"></div><div class="cone-item"></div><div class="cone-item"></div>';
    stage.appendChild(cones);
  }
  document.getElementById('stage-cones').classList.toggle('set', !!job.conesSet);

  const jackBox = document.getElementById('stage-jack');
  if (!jackBox.querySelector('.jack-saddle')) {
    const saddle = document.createElement('div');
    saddle.className = 'jack-saddle';
    jackBox.insertBefore(saddle, jackBox.firstChild);
  }

  const vehImg = document.getElementById('stage-veh-img');
  const vehFb = document.getElementById('stage-veh-fallback');
  vehImg.style.display = 'block';
  vehFb.style.display = 'none';
  vehFb.innerHTML = renderVehicleSVG(job.veh);
  vehImg.src = job.veh.img;

  const tireImg = document.getElementById('stage-tire-img');
  const tireFb = document.getElementById('stage-tire-fallback');
  tireImg.style.display = 'block';
  tireFb.style.display = 'none';
  tireFb.innerHTML = renderTireSVG(job, 132);
  tireImg.src = getTireSpritePath(job);

  const liftPx = Math.round((job.liftPct / 100) * 26);
  const wheelLiftPx = Math.round((job.liftPct / 100) * 16);
  document.getElementById('stage-chock').classList.toggle('set', job.chocked);
  document.getElementById('jack-arm').style.height = `${12 + Math.round((job.liftPct / 100) * 44)}px`;
  document.getElementById('stage-chassis').style.transform = `translateX(-50%) translateY(-${liftPx}px)`;
  document.getElementById('stage-wheel-wrap').style.transform = `translateX(-50%) translateY(-${wheelLiftPx}px)`;
  document.getElementById('scan-beam').classList.toggle('hidden', !(job.step === 3 && !job.scanned));

  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`sp-${i}`);
    el.className = 'sp' + (job.step === i ? ' active' : job.step > i ? ' done' : '');
  }

  const canSpin = job.step === 2 || job.step === 5;
  const lugRing = document.getElementById('lug-ring');
  lugRing.innerHTML = LUG_COORDS.map((l) => {
    const isRemoved = job.lugsRemoved.includes(l.id) && job.step < 5;
    const isTorqued = job.step === 5 && STAR_ORDER.slice(0, job.torqueIdx).includes(l.id);
    const isSpinning = canSpin && job.lastSpunLug === l.id;
    const pulseLug = job.isTutorial && (
      (job.step === 2 && !isRemoved) ||
      (job.step === 5 && STAR_ORDER[job.torqueIdx] === l.id)
    );
    return `<button class="lug-btn ${isRemoved ? 'removed' : ''} ${isTorqued ? 'torqued' : ''} ${isSpinning ? 'spinning' : ''} ${pulseLug ? 'tut-pulse' : ''}"
      style="left:${l.x}%;top:${l.y}%;"
      onclick="tapLug(${l.id})">${l.id}</button>`;
  }).join('');

  const svg = document.getElementById('star-lines-svg');
  if (job.step === 5 && job.torqueIdx > 1) {
    const pts = STAR_ORDER.slice(0, job.torqueIdx).map((id) => {
      const c = LUG_COORDS.find((x) => x.id === id);
      return `${(c.x / 100) * 120},${(c.y / 100) * 120}`;
    }).join(' ');
    svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />`;
  } else {
    svg.innerHTML = '';
  }

  const ctrl = document.getElementById('bay-controls');
  if (job.step === 1) {
    ctrl.innerHTML = `
      <strong>Step 1: Highway Perimeter & Lift (${job.liftPct}%)</strong>
      <div class="ctrl-grid-3">
        <button class="secondary-btn ${job.isTutorial && !job.conesSet ? 'tut-pulse' : ''}" onclick="setCones()" style="font-size:11px;padding:9px 4px;">
          ${job.conesSet ? '✓ CONES SET' : '1. SET CONES'}
        </button>
        <button class="secondary-btn ${job.isTutorial && job.conesSet && !job.chocked ? 'tut-pulse' : ''}" onclick="setChocks()" style="font-size:11px;padding:9px 4px;">
          ${job.chocked ? '✓ CHOCKED' : '2. CHOCKS'}
        </button>
        <button class="primary-btn ${job.isTutorial && job.conesSet && job.chocked ? 'tut-pulse' : ''}" onclick="pumpJack()" style="font-size:11px;padding:9px 4px;">
          3. PUMP JACK
        </button>
      </div>`;
  } else if (job.step === 2) {
    ctrl.innerHTML = `
      <strong>Step 2: Unbolt All 5 Lugs on Wheel (${job.lugsRemoved.length}/5)</strong>
      <p style="font-size:12px;color:var(--muted);">Tap each lug nut directly on the wheel hub to spin it off into the magnetic tray.</p>`;
  } else if (job.step === 3) {
    if (!job.scanned) {
      ctrl.innerHTML = `
        <strong>Step 3: Inspect Tire Damage</strong>
        <p style="font-size:12px;color:var(--muted);">Run diagnostic laser scan to reveal correlated tire damage visual.</p>
        <button class="primary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="runScan()">SCAN TIRE TREAD & SIDEWALL</button>`;
    } else {
      const tireSprite = getTireSpritePath(job);
      const swapLabel = job.veh.heavy
        ? `SWAP HD TIRE (${state.hdTires})`
        : `SWAP STD TIRE (${state.stdTires})`;
      ctrl.innerHTML = `
        <div class="diag-scan-card">
          <div class="diag-tire-preview">
            <img src="${tireSprite}" alt="${job.dmg.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
            <div style="display:none;">${renderTireSVG(job, 72)}</div>
          </div>
          <div>
            <span class="badge">${job.dmg.verdict}</span>
            <strong style="color:var(--text);font-size:13px;display:block;margin-top:4px;">${job.dmg.title}</strong>
            <p style="font-size:11px;color:var(--muted);margin-top:2px;">${job.dmg.desc}</p>
          </div>
        </div>
        <div class="ctrl-grid-2">
          <button class="secondary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="performRepair('plug')">PLUG PUNCTURE (${state.plugs})</button>
          <button class="primary-btn" onclick="performRepair('swap')">${swapLabel}</button>
        </div>
        <button class="ghost-btn" onclick="droneDrop()">🚁 Drone ${job.veh.heavy ? 'HD' : 'Std'} Tire Drop (${job.veh.heavy ? 5 : 3} ⚡)</button>`;
    }
  } else if (job.step === 4) {
    const t = job.veh.targetPsi;
    const inSpec = Math.abs(job.psi - t) <= 2;
    const fillPct = Math.min(100, Math.round((job.psi / (t + 20)) * 100));
    const bandLeft = Math.round(((t - 2) / (t + 20)) * 100);
    const bandWidth = Math.max(8, Math.round((4 / (t + 20)) * 100));
    const psiStep = 4 + Math.floor((state.tools.comp.level - 1) / 3);
    ctrl.innerHTML = `
      <strong>Step 4: Calibrate Air Pressure (Target: ${t - 2}–${t + 2} PSI)</strong>
      <div class="psi-meter">
        <div class="psi-val">${job.psi} PSI</div>
        <div class="psi-bar-track">
          <div class="psi-target-band" style="left:${bandLeft}%;width:${bandWidth}%;"></div>
          <div class="psi-fill" style="width:${fillPct}%;"></div>
        </div>
      </div>
      <div class="ctrl-grid-2">
        <button class="secondary-btn" onclick="adjustPsi(-3)">BLEED AIR (-3)</button>
        <button class="primary-btn ${job.isTutorial && !inSpec ? 'tut-pulse' : ''}" onclick="adjustPsi(${psiStep})">INFLATE (+${psiStep} PSI)</button>
      </div>
      <button class="primary-btn ${job.isTutorial && inSpec ? 'tut-pulse' : ''}" onclick="lockPsi()">LOCK PRESSURE & CONTINUE</button>`;
  } else if (job.step === 5) {
    ctrl.innerHTML = `
      <strong>Step 5: Star-Pattern Torque (${job.torqueIdx}/5)</strong>
      <p style="font-size:12px;color:var(--muted);">Tap the lugs directly on the wheel in crisscross star order: <strong>1 → 3 → 5 → 2 → 4</strong>.</p>`;
  }
}

function setCones() {
  const job = state.activeJob;
  if (!job || job.conesSet) return;
  job.conesSet = true;
  job.lastSpunLug = null;
  dismissAlert();
  SoundFX.chock();
  renderBay();
}

function setChocks() {
  const job = state.activeJob;
  if (!job) return;
  if (!job.conesSet) {
    addBayPenalty(job, 10, 'DOT Safety Violation: Worked shoulder without traffic cones');
    showAlert('DOT CONE ALERT (-$10)', 'Deploy reflective highway traffic cones before chocking or lifting on the shoulder!');
    renderBay();
    return;
  }
  if (job.chocked) return;
  job.chocked = true;
  job.lastSpunLug = null;
  dismissAlert();
  SoundFX.chock();
  renderBay();
}

function pumpJack() {
  const job = state.activeJob;
  if (!job) return;
  if (!job.conesSet) {
    addBayPenalty(job, 10, 'DOT Safety Violation: Lifted without traffic cones');
    showAlert('DOT CONE ALERT (-$10)', 'Deploy highway traffic cones first to protect your roadside bay!');
    renderBay();
    return;
  }
  if (!job.chocked) {
    addBayPenalty(job, 15, 'OSHA Safety Violation: Lifted without wheel chocks');
    showAlert('OSHA SAFETY VIOLATION (-$15)', 'Set rubber wheel chocks before raising the hydraulic floor jack!');
    renderBay();
    return;
  }
  dismissAlert();
  SoundFX.jack();
  const boost = 25 + state.tools.jack.level * 4;
  job.liftPct = Math.min(100, job.liftPct + boost);
  if (job.liftPct >= 100) job.step = 2;
  renderBay();
}

function triggerLugSpin(job, id) {
  job.lastSpunLug = id;
  if (spinClearTimeout) clearTimeout(spinClearTimeout);
  spinClearTimeout = setTimeout(() => {
    if (state.activeJob) state.activeJob.lastSpunLug = null;
  }, 460);
}

function tapLug(id) {
  const job = state.activeJob;
  if (!job) return;
  if (job.step === 1) {
    addBayPenalty(job, 10, 'Protocol Error: Impacted lugs before vehicle was lifted');
    showAlert('LIFT VEHICLE FIRST (-$10)', 'Deploy cones, set chocks, and pump the hydraulic jack to 100% before unbolting lugs.');
    renderBay();
    return;
  }
  if (job.step === 2) {
    if (!job.lugsRemoved.includes(id)) {
      job.lugsRemoved.push(id);
      triggerLugSpin(job, id);
      SoundFX.impact();
      if (job.lugsRemoved.length >= 5) {
        job.lastSpunLug = null;
        job.step = 3;
      }
      renderBay();
    }
  } else if (job.step === 5) {
    const expected = STAR_ORDER[job.torqueIdx];
    if (id !== expected) {
      addBayPenalty(job, 12, 'Torque Sequence Error: Out-of-order lug torquing');
      showAlert('STAR-PATTERN SEQUENCE ERROR (-$12)', 'Wrong lug! Follow crisscross star torque sequence (1 → 3 → 5 → 2 → 4).');
      renderBay();
      return;
    }
    dismissAlert();
    SoundFX.torqueClick();
    triggerLugSpin(job, id);
    job.torqueIdx++;
    if (job.torqueIdx >= 5) completeJob();
    else renderBay();
  }
}

function runScan() {
  const job = state.activeJob;
  if (!job) return;
  job.lastSpunLug = null;
  SoundFX.scan();
  job.scanned = true;
  renderBay();
}

function performRepair(choice) {
  const job = state.activeJob;
  if (!job) return;
  job.lastSpunLug = null;

  if (job.dmg.action === 'plug' && choice !== 'plug') {
    addBayPenalty(job, 20, 'Diagnostic Error: Swapped repairable center-nail tire');
    showAlert(
      'UNNECESSARY TIRE SWAP (-$20)',
      'Center-tread nail punctures are ALWAYS Plug Only. Do not waste a new tire!'
    );
    renderBay();
    return;
  }
  if (job.dmg.action === 'swap' && choice !== 'swap') {
    addBayPenalty(job, 30, 'Safety Violation: Attempted to plug unrepairable casing');
    showAlert(
      'UNSAFE REPAIR REJECTED (-$30)',
      `${job.dmg.title} cannot be plugged safely. You MUST perform a full Tire Swap!`
    );
    renderBay();
    return;
  }

  if (choice === 'plug') {
    if (!job.isTutorial && state.plugs <= 0) {
      showAlert('OUT OF PLUGS', 'Restock vulcanized tire plugs from Dispatch or watch a 30s Supply Drop Ad.');
      return;
    }
    if (!job.isTutorial) state.plugs--;
    SoundFX.impact();
  } else {
    if (job.veh.heavy) {
      if (!job.isTutorial && state.hdTires <= 0) {
        showAlert('OUT OF HEAVY-DUTY TIRES', 'Commercial trucks require Heavy-Duty Tires! Use Drone Drop below or restock HD Tires.');
        return;
      }
      if (!job.isTutorial) state.hdTires--;
    } else {
      if (!job.isTutorial && state.stdTires <= 0) {
        showAlert('OUT OF STANDARD TIRES', 'Use Drone Tire Drop below or restock Standard Tires on Dispatch.');
        return;
      }
      if (!job.isTutorial) state.stdTires--;
    }
    SoundFX.impact();
    const wrap = document.getElementById('stage-wheel-wrap');
    wrap.classList.add('swapping');
    setTimeout(() => wrap.classList.remove('swapping'), 320);
  }

  dismissAlert();
  job.fixed = true;
  job.step = 4;
  updateHUD();
  renderBay();
}

function droneDrop() {
  const job = state.activeJob;
  if (!job) return;
  const cost = job.veh.heavy ? 5 : 3;
  if (state.tokens < cost) {
    showAlert('INSUFFICIENT TOKENS', `Drone ${job.veh.heavy ? 'Heavy-Duty' : 'Standard'} Tire Drop costs ${cost} ⚡.`);
    goPage('shop');
    return;
  }
  state.tokens -= cost;
  if (job.veh.heavy) state.hdTires += 1;
  else state.stdTires += 1;
  SoundFX.success();
  updateHUD();
  renderBay();
}

function adjustPsi(delta) {
  const job = state.activeJob;
  if (!job) return;
  job.lastSpunLug = null;
  SoundFX.air();
  job.psi = Math.max(0, Math.min(130, job.psi + delta));
  if (job.psi > job.veh.targetPsi + 10) {
    addBayPenalty(job, 15, 'Over-Inflation Hazard: Exceeded safe PSI threshold');
    showAlert('OVER-INFLATION HAZARD (-$15)', `Pressure spiked above ${job.veh.targetPsi + 10} PSI! Bleed air immediately.`);
  }
  renderBay();
}

function lockPsi() {
  const job = state.activeJob;
  if (!job) return;
  job.lastSpunLug = null;
  const t = job.veh.targetPsi;
  if (Math.abs(job.psi - t) > 2) {
    addBayPenalty(job, 12, 'PSI Calibration Error: Locked pressure out of spec');
    showAlert('PSI OUT OF SPEC (-$12)', `Calibrate pressure between ${t - 2} and ${t + 2} PSI before torquing lugs.`);
    renderBay();
    return;
  }
  dismissAlert();
  SoundFX.torqueClick();
  job.step = 5;
  renderBay();
}

function completeJob() {
  const job = state.activeJob;
  SoundFX.success();

  if (job.isTutorial) {
    const firstTime = !state.tutorialDone;
    state.tutorialDone = true;
    if (firstTime) state.tokens += 12;
    state.activeJob = null;
    saveState();
    updateHUD();
    openModal(`
      <span class="badge">TRAINING COMPLETE</span>
      <h3>Certified DelWin Technician!</h3>
      <p style="font-size:13px;color:var(--muted);">
        You mastered traffic cones, wheel chocks, lug removal, center-nail plug diagnostics, PSI calibration, and star-pattern torquing.
      </p>
      <div style="background:#090c12;padding:12px;border-radius:10px;text-align:center;color:var(--amber);font-weight:900;">
        ${firstTime ? '+12 DISPATCH TOKENS (⚡) CREDITED!' : 'TRAINING PRACTICE COMPLETE'}
      </div>
      <button class="primary-btn" onclick="closeModal(); goPage('dispatch');">ENTER LIVE DISPATCH</button>
    `);
    return;
  }

  const mult = state.surgeJobs > 0 ? 2 : 1;
  if (state.surgeJobs > 0) state.surgeJobs--;
  const gross = job.pay * mult;
  const isFast = job.timeLeft >= Math.round(job.timeLimit * 0.45);
  const speedBonus = isFast ? Math.round(job.pay * 0.2) : 0;
  const totalDeductions = job.penalties;
  const net = Math.max(25, gross + speedBonus - totalDeductions);
  // Balanced REP pacing: ~32-45 REP per job in Zone 1 so unlocking Zone 2 (350 REP) takes ~9-11 calls
  const repGain = Math.round((30 + (isFast ? 12 : 0)) * getZone().mult);
  // Gold Tool Parts drop at 25% rate on clean jobs (or via Elite Contracts / Shop)
  const gotPart = totalDeductions === 0 && Math.random() < 0.25;

  state.cash += net;
  state.rep += repGain;
  state.jobsCompleted = (state.jobsCompleted || 0) + 1;
  if (totalDeductions === 0) state.streak = (state.streak || 0) + 1;
  else state.streak = 0;
  if (gotPart) state.parts += 1;

  if (state.contract && state.contract.progress < state.contract.target) {
    const ct = state.contract.type;
    if (ct === 'clean_streak' && totalDeductions === 0) state.contract.progress += 1;
    if (ct === 'plugs' && job.dmg.action === 'plug') state.contract.progress += 1;
    if (ct === 'swaps' && job.dmg.action === 'swap') state.contract.progress += 1;
    if (ct === 'fast' && isFast) state.contract.progress += 1;
    if (ct === 'heavy' && job.veh.heavy) state.contract.progress += 1;
  }

  const jobRating = totalDeductions === 0 ? 5.0 : Math.max(3.5, 4.8 - totalDeductions * 0.02);
  state.ratings.push(jobRating);
  if (state.ratings.length > 20) state.ratings.shift();
  state.activeJob = null;

  if (state.jobs.length < 2) refreshJobs();
  saveState();
  updateHUD();

  const logHtml = (job.penaltyLog || []).map((p) =>
    `<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--red);"><span>• ${p.reason}</span><span>-$${p.amount}</span></div>`
  ).join('');

  openModal(`
    <span class="badge">DIGITAL CUSTOMER INVOICE</span>
    <h3>${job.title}</h3>
    <div style="background:#090c12;padding:12px;border-radius:10px;font-size:13px;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;justify-content:space-between;"><span>Base Service Payout:</span><strong style="color:var(--green);">+$${gross}</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Fast-Response Bonus:</span><strong style="color:var(--blue);">+$${speedBonus}</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Bay & SLA Deductions:</span><strong style="color:var(--red);">-$${totalDeductions}</strong></div>
      ${logHtml}
      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:6px;"><span>Net Collected:</span><strong style="color:var(--green);">$${net}</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Corridor Reputation:</span><strong style="color:var(--amber);">+${repGain} REP</strong></div>
      ${gotPart ? `<div style="color:var(--amber);font-weight:800;">+1 Gold Tool Part Found (⚙️)</div>` : ''}
    </div>
    <button class="primary-btn" onclick="closeModal(); goPage('dispatch');">RETURN TO DISPATCH</button>
  `);
}

function buyStock(type) {
  if (type === 'plug' && state.cash >= 20) {
    state.cash -= 20;
    state.plugs += 3;
    SoundFX.torqueClick();
  } else if (type === 'std' && state.cash >= 45) {
    state.cash -= 45;
    state.stdTires += 1;
    SoundFX.torqueClick();
  } else if (type === 'hd' && state.cash >= 95) {
    state.cash -= 95;
    state.hdTires += 1;
    SoundFX.torqueClick();
  } else {
    showAlert('INSUFFICIENT CASH', 'Complete a dispatch call to earn cash for restocking supplies.');
    return;
  }
  saveState();
  updateHUD();
}

// --- GARAGE & TOOL UPGRADES ---
function stepRigPreview(delta) {
  const current = previewRigTier || getRigTier();
  previewRigTier = Math.max(1, Math.min(6, current + delta));
  SoundFX.torqueClick();
  renderGarage();
}

function stepToolPreview(key, delta) {
  const tool = state.tools[key];
  const ownedTier = Math.min(6, Math.floor((tool.level - 1) / 4) + 1);
  const current = previewToolTiers[key] || ownedTier;
  previewToolTiers[key] = Math.max(1, Math.min(6, current + delta));
  SoundFX.torqueClick();
  renderGarage();
}

function renderGarage() {
  const ownedRigTier = getRigTier();
  if (!previewRigTier) previewRigTier = ownedRigTier;
  const rig = RIG_TIERS[previewRigTier - 1];
  const isOwned = previewRigTier <= ownedRigTier;

  const heroTop = document.querySelector('.rig-hero-top');
  heroTop.innerHTML = `
    <div>
      <span class="badge">${isOwned ? 'UNLOCKED SERVICE RIG' : `LOCKED · ${rig.req.toUpperCase()}`}</span>
      <h3 style="font-size:15px;margin-top:4px;">${rig.name}</h3>
    </div>
    <div class="carousel-nav">
      <button class="arrow-btn" ${previewRigTier <= 1 ? 'disabled' : ''} onclick="stepRigPreview(-1)">◀</button>
      <span class="tier-pill">T${previewRigTier}/6</span>
      <button class="arrow-btn" ${previewRigTier >= 6 ? 'disabled' : ''} onclick="stepRigPreview(1)">▶</button>
    </div>`;

  const rigImg = document.getElementById('rig-img');
  const rigFb = document.getElementById('rig-fallback');
  rigImg.style.display = 'block';
  rigFb.style.display = 'none';
  rigFb.innerHTML = renderRigSVG(rig);
  rigImg.src = rig.img;
  document.getElementById('rig-perk').textContent = `${rig.perk} (${rig.req})`;

  const list = document.getElementById('tool-list');
  list.innerHTML = Object.entries(state.tools).map(([key, tool]) => {
    const ownedTier = Math.min(6, Math.floor((tool.level - 1) / 4) + 1);
    const viewTier = previewToolTiers[key] || ownedTier;
    const viewTierLabel = TIER_NAMES[viewTier - 1];
    const isMax = tool.level >= 24;
    const needsPart = !isMax && tool.level % 4 === 0;
    const cost = Math.round(tool.baseCost * Math.pow(1.26, tool.level - 1));
    const imgPath = `assets/${tool.prefix}-t${viewTier}.png`;
    const isPreviewingFuture = viewTier > ownedTier;

    return `
      <div class="item-card">
        <div class="tool-row">
          <div class="tool-thumb">
            <img src="${imgPath}" alt="${tool.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
            <span style="display:none;">${tool.icon}</span>
          </div>
          <div style="flex:1;min-width:0;">
            <span class="badge">
              ${isPreviewingFuture ? `PREVIEW T${viewTier}: ${viewTierLabel.toUpperCase()}` : `OWNED LVL ${tool.level}/24 · ${TIER_NAMES[ownedTier - 1].toUpperCase()}`}
            </span>
            <h3 style="font-size:14px;margin-top:4px;">${tool.name}</h3>
          </div>
          <div class="carousel-nav">
            <button class="arrow-btn" ${viewTier <= 1 ? 'disabled' : ''} onclick="stepToolPreview('${key}', -1)">◀</button>
            <button class="arrow-btn" ${viewTier >= 6 ? 'disabled' : ''} onclick="stepToolPreview('${key}', 1)">▶</button>
          </div>
        </div>
        <button class="primary-btn" ${isMax ? 'disabled' : ''} onclick="upgradeTool('${key}')">
          ${isMax ? 'MAXED OUT (LVL 24)' : `UPGRADE TO LVL ${tool.level + 1} ($${cost}${needsPart ? ' + 1 ⚙️' : ''})`}
        </button>
      </div>`;
  }).join('');
}

function upgradeTool(key) {
  const tool = state.tools[key];
  if (!tool || tool.level >= 24) return;
  const needsPart = tool.level % 4 === 0;
  const cost = Math.round(tool.baseCost * Math.pow(1.26, tool.level - 1));
  if (state.cash < cost) {
    showAlert('INSUFFICIENT CASH', `Need $${cost} to upgrade ${tool.name}.`);
    return;
  }
  if (needsPart && state.parts < 1) {
    showAlert('GOLD TOOL PART REQUIRED', 'Tier breakthrough upgrades (Lvl 4→5, 8→9, etc.) require 1 ⚙️ Gold Tool Part from clean jobs, Elite Contracts, or the Shop.');
    return;
  }
  state.cash -= cost;
  if (needsPart) state.parts -= 1;
  tool.level += 1;
  const newOwnedTier = Math.min(6, Math.floor((tool.level - 1) / 4) + 1);
  previewToolTiers[key] = newOwnedTier;
  previewRigTier = getRigTier();
  SoundFX.success();
  saveState();
  updateHUD();
  renderGarage();
}

// --- TUNED LEADERBOARD MATH (Dynamic Division Scaling Across 0 to 50,000+ REP) ---
function renderLeague() {
  document.getElementById('league-rep').textContent = state.rep;

  const divisionIndex = Math.min(5, Math.floor(state.rep / 3000));
  const divisionNames = [
    'BRONZE ROADSIDE DIVISION',
    'SILVER METRO DIVISION',
    'GOLD FREIGHT DIVISION',
    'PLATINUM PORT DIVISION',
    'DIAMOND EXPRESS DIVISION',
    'APEX SYNDICATE DIVISION'
  ];

  // Rivals scale dynamically around the player's current REP tier so climbing feels competitive and fair
  const anchor = Math.max(0, divisionIndex * 3000);
  const rivals = [
    { name: 'Southside_Rescue', avatar: '🔧', rep: anchor + 180 },
    { name: 'PeachState_Duals', avatar: '🛞', rep: anchor + 540 },
    { name: 'I285_RoadKing', avatar: '🚛', rep: anchor + 1150 },
    { name: 'NightShift_Mike', avatar: '⚡', rep: anchor + 1950 },
    { name: 'ApexTow_ATL', avatar: '👑', rep: anchor + 2850 },
    {
      name: `${state.bizName} (YOU)`,
      avatar: state.avatarEmoji,
      avatarImg: state.avatarImg,
      rep: state.rep,
      isYou: true
    }
  ].sort((a, b) => b.rep - a.rep);

  const myRank = rivals.findIndex((r) => r.isYou) + 1;
  document.getElementById('league-rank').textContent = `#${myRank}`;

  const headerBanner = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span class="badge">${divisionNames[divisionIndex]}</span>
      <button class="ghost-btn" style="padding:4px 8px;font-size:11px;" onclick="openProfileEditor()">Edit Name/Logo</button>
    </div>`;

  document.getElementById('leaderboard-list').innerHTML = headerBanner + rivals.map((r, idx) => {
    const iconHtml = r.avatarImg
      ? `<img src="${r.avatarImg}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;" />`
      : `<span style="margin-right:6px;">${r.avatar}</span>`;
    return `
      <div class="item-card" style="${r.isYou ? 'border-color:var(--amber);background:#172033;' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>#${idx + 1} ${iconHtml}${r.name}</strong>
          <span style="color:var(--amber);font-weight:800;">${r.rep.toLocaleString()} REP</span>
        </div>
      </div>`;
  }).join('');
}

// --- 24 ZONES / 6 HUBS ---
function renderZones() {
  let currentHub = '';
  let html = '';
  ZONES.forEach((z, idx) => {
    if (z.hub !== currentHub) {
      currentHub = z.hub;
      html += `<div class="hub-group-title">${currentHub}</div>`;
    }
    const unlocked = state.rep >= z.unlockRep;
    const active = state.zoneId === z.id;
    html += `
      <div class="item-card" style="${active ? 'border-color:var(--amber);' : !unlocked ? 'opacity:0.78;' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="badge">ZONE ${idx + 1}/24 · ${z.mult.toFixed(2)}x PAYOUT</span>
            <h3 style="font-size:15px;margin-top:4px;">${z.name}</h3>
          </div>
          <strong style="color:${unlocked ? 'var(--green)' : 'var(--muted)'};">
            ${unlocked ? (active ? 'ACTIVE' : 'OPEN') : `🔒 ${z.unlockRep.toLocaleString()} REP`}
          </strong>
        </div>
        <p style="font-size:12px;color:var(--muted);">${z.desc}</p>
        <button class="primary-btn" ${!unlocked || active ? 'disabled' : ''} onclick="selectZone('${z.id}')">
          ${active ? 'DEPLOYED HERE' : unlocked ? 'DEPLOY TO ZONE' : `UNLOCKS AT ${z.unlockRep.toLocaleString()} REP (YOU: ${state.rep.toLocaleString()})`}
        </button>
      </div>`;
  });
  document.getElementById('zone-list').innerHTML = html;
}

function selectZone(id) {
  state.zoneId = id;
  SoundFX.torqueClick();
  saveState();
  updateHUD();
  refreshJobs();
  goPage('dispatch');
}

// --- REWARDED ADS & DUAL-CURRENCY SHOP (Clear Separation: ⚡ Tactical Tokens vs ⚙️ Gold Tool Parts) ---
function watchRewardedAd(type) {
  openModal(`
    <span class="badge">SPONSORED TRANSMISSION</span>
    <h3>30s Roadside Partner Ad</h3>
    <p style="font-size:13px;color:var(--muted);">Simulating 30-second rewarded sponsor video...</p>
    <div id="ad-timer" style="font-size:28px;font-weight:900;color:var(--amber);text-align:center;">3</div>
  `);
  let sec = 3;
  const iv = setInterval(() => {
    sec--;
    const el = document.getElementById('ad-timer');
    if (el) el.textContent = sec;
    if (sec <= 0) {
      clearInterval(iv);
      if (type === 'surge') state.surgeJobs += 3;
      if (type === 'tokens') state.tokens += 5;
      if (type === 'restock') { state.plugs += 4; state.stdTires += 2; state.hdTires += 1; }
      SoundFX.success();
      saveState();
      updateHUD();
      closeModal();
      goPage('dispatch');
    }
  }, 800);
}

function buyTokenPack(amount, price, parts = 0) {
  state.tokens += amount;
  state.parts += parts;
  SoundFX.success();
  saveState();
  updateHUD();
  openModal(`
    <span class="badge">DISPATCH CREDIT APPLIED</span>
    <h3>+${amount} Dispatch Tokens (⚡)${parts > 0 ? ` & +${parts} Gold Part (⚙️)` : ''}</h3>
    <p style="font-size:13px;color:var(--muted);">Demo pack (${price}) credited to ${state.bizName}.</p>
    <button class="primary-btn" onclick="closeModal()">CONTINUE</button>
  `);
}

function openModal(html) {
  document.getElementById('modal-card').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function resetSave() {
  localStorage.removeItem('delwin_v4_save');
  location.reload();
}

injectCustomStyles();
loadState();
if (!state.jobs || state.jobs.length === 0) refreshJobs();
else renderJobs();
updateHUD();
if (state.activeJob && !state.activeJob.isTutorial) startBayTimer();
if (!state.tutorialDone) startTutorial();
