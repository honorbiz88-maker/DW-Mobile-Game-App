const TIER_NAMES = ['Novice', 'Intermediate', 'Pro', 'Commercial', 'Heavy-Duty', 'Master'];

const RIG_TIERS = [
  { tier: 1, name: 'Tier 1: Novice Roadside Van', img: 'assets/rig-t1.png', color: '#cbd5e1', perk: 'Standard highway response rig.' },
  { tier: 2, name: 'Tier 2: Intermediate Utility Pickup', img: 'assets/rig-t2.png', color: '#38bdf8', perk: '+12% Base Payouts & Twin Strobes.' },
  { tier: 3, name: 'Tier 3: Pro Extended Tire Truck', img: 'assets/rig-t3.png', color: '#f59e0b', perk: '+24% Payouts & Onboard Tire Rack.' },
  { tier: 4, name: 'Tier 4: Commercial Dually Rig', img: 'assets/rig-t4.png', color: '#a855f7', perk: '+36% Payouts & Dual-Wheel Lift.' },
  { tier: 5, name: 'Tier 5: Heavy-Duty Fleet Rescue Box', img: 'assets/rig-t5.png', color: '#ef4444', perk: '+48% Payouts & Fleet Priority.' },
  { tier: 6, name: 'Tier 6: Master Apex Syndicate Flagship', img: 'assets/rig-t6.png', color: '#fde047', perk: '+65% Payouts & Maximum Corridor Prestige.' }
];

const ZONES = [
  { id: 'i285', hub: 'HUB 1 · ATLANTA METRO', name: 'I-285 North Perimeter', mult: 1.0, unlockRep: 0, desc: 'Steady commuter flats and shoulder punctures.' },
  { id: 'i75', hub: 'HUB 1 · ATLANTA METRO', name: 'I-75 Downtown Connector', mult: 1.15, unlockRep: 120, desc: 'High-traffic SUV and commercial van calls.' },
  { id: 'i20', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-20 West Freight Corridor', mult: 1.35, unlockRep: 300, desc: 'Box trucks and heavy-duty highway blowouts.' },
  { id: 'i85', hub: 'HUB 2 · GEORGIA FREIGHT', name: 'I-85 Gwinnett Logistics', mult: 1.5, unlockRep: 550, desc: 'Distribution hub semi-trailers & duals.' },
  { id: 'sav', hub: 'HUB 3 · COASTAL PORTS', name: 'Savannah Port Terminal', mult: 1.75, unlockRep: 900, desc: '18-wheeler port containers and VIP contracts.' },
  { id: 'i95', hub: 'HUB 4 · SOUTHEAST EXPRESS', name: 'I-95 Coastal Freightway', mult: 2.0, unlockRep: 1400, desc: 'Long-haul interstate emergency fleet rescues.' },
  { id: 'i10', hub: 'HUB 5 · GULF CORRIDOR', name: 'I-10 Heavy Haul Turnpike', mult: 2.3, unlockRep: 2000, desc: 'High-payout commercial multi-axle dispatches.' },
  { id: 'apex', hub: 'HUB 6 · APEX SYNDICATE', name: 'Apex Night-Shift Priority Grid', mult: 2.75, unlockRep: 3000, desc: 'Elite executive & heavy fleet rescue network.' }
];

const VEHICLES = [
  { id: 'sedan', label: 'COMMUTER SEDAN', heavy: false, targetPsi: 35, bodyColor: '#64748b', img: 'assets/veh-sedan.png' },
  { id: 'suv', label: 'FAMILY SUV', heavy: false, targetPsi: 36, bodyColor: '#475569', img: 'assets/veh-suv.png' },
  { id: 'pickup', label: 'LIFTED 4X4 PICKUP', heavy: false, targetPsi: 40, bodyColor: '#b91c1c', img: 'assets/veh-pickup.png' },
  { id: 'boxtruck', label: 'COMMERCIAL BOX TRUCK', heavy: true, targetPsi: 95, bodyColor: '#cbd5e1', img: 'assets/veh-boxtruck.png' },
  { id: 'semi', label: '18-WHEELER TRACTOR', heavy: true, targetPsi: 105, bodyColor: '#1d4ed8', img: 'assets/veh-semi.png' }
];

// STRICT CORE RULE: center_nail => Plug Only; all other damage => Tire Swap Only
const DAMAGES = [
  { key: 'center_nail', title: 'Center-Tread Nail Puncture', action: 'plug', fileKey: 'nail', desc: 'Clean steel nail embedded in center tread crown.' },
  { key: 'bulge', title: 'Sidewall Impact Bulge', action: 'swap', fileKey: 'bulge', desc: 'Ruptured internal cords causing a dangerous sidewall bubble.' },
  { key: 'blowout', title: 'High-Speed Sidewall Blowout', action: 'swap', fileKey: 'blowout', desc: 'Violently blown sidewall casing. Unpatchable.' },
  { key: 'gash', title: 'Outer Shoulder Curb Gash', action: 'swap', fileKey: 'gash', desc: 'Deep slash across outer tire shoulder.' },
  { key: 'shredded', title: 'Shredded / Delaminated Tread', action: 'swap', fileKey: 'shredded', desc: 'Separated tread strips and exposed steel belts.' }
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
  zoneId: 'i285',
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

function loadState() {
  try {
    const raw = localStorage.getItem('delwin_v4_save');
    if (raw) Object.assign(state, JSON.parse(raw));
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
    <svg viewBox="0 0 280 90" width="265" height="86">
      <path d="M24 68 L24 44 L66 40 L98 18 L194 18 L224 40 L256 46 L256 68 Z" fill="${veh.bodyColor}" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="102,23 188,23 210,39 82,39" fill="#0f172a" opacity="0.85"/>
      <path d="M106 68 A34 34 0 0 1 174 68 Z" fill="#090c12" stroke="#f59e0b" stroke-width="2"/>
    </svg>`;
}

function renderTireSVG(job) {
  const dmg = job.dmg.key;
  let dmgLayer = '';
  if (!job.fixed) {
    if (dmg === 'center_nail') {
      dmgLayer = `
        <circle cx="65" cy="14" r="11" fill="rgba(239,68,68,0.28)" stroke="#ef4444" stroke-width="2"/>
        <line x1="65" y1="3" x2="65" y2="18" stroke="#e2e8f0" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="60" y1="3" x2="70" y2="3" stroke="#f8fafc" stroke-width="3"/>`;
    } else if (dmg === 'bulge') {
      dmgLayer = `
        <ellipse cx="18" cy="72" rx="12" ry="18" fill="#334155" stroke="#ef4444" stroke-width="2.5"/>
        <text x="18" y="75" text-anchor="middle" fill="#fecaca" font-size="9" font-weight="900">!</text>`;
    } else if (dmg === 'blowout') {
      dmgLayer = `
        <polygon points="12,56 26,64 16,74 28,84 10,88 6,70" fill="#ef4444" stroke="#fecaca" stroke-width="1.5"/>`;
    } else if (dmg === 'gash') {
      dmgLayer = `
        <line x1="22" y1="24" x2="40" y2="42" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round"/>`;
    } else if (dmg === 'shredded') {
      dmgLayer = `
        <path d="M22 22 L12 12 M44 10 L40 2 M86 10 L92 2 M108 24 L118 16" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>`;
    }
  }
  return `
    <svg viewBox="0 0 130 130" width="130" height="130">
      <circle cx="65" cy="65" r="56" fill="#111827" stroke="${job.fixed ? '#10b981' : '#334155'}" stroke-width="6"/>
      <circle cx="65" cy="65" r="46" fill="none" stroke="#1f2937" stroke-width="6" stroke-dasharray="8 6"/>
      <circle cx="65" cy="65" r="32" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="65" cy="65" r="11" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
      ${dmgLayer}
    </svg>`;
}

function updateHUD() {
  document.getElementById('hud-cash').textContent = state.cash;
  document.getElementById('hud-tokens').textContent = state.tokens;
  document.getElementById('drawer-parts').textContent = `${state.parts} ⚙️`;
  const avg = (state.ratings.reduce((a, b) => a + b, 0) / state.ratings.length).toFixed(1);
  document.getElementById('drawer-rating').textContent = `${avg} ★`;
  const z = getZone();
  document.getElementById('drawer-zone').textContent = z.name;
  document.getElementById('dispatch-zone-label').textContent = `${z.name.toUpperCase()} (${z.mult}x)`;
  document.getElementById('dispatch-boost-label').textContent =
    state.surgeJobs > 0 ? `2X SURGE ACTIVE (${state.surgeJobs} LEFT)` : 'ACTIVATE 2X SURGE';
  document.getElementById('stock-plugs').textContent = state.plugs;
  document.getElementById('stock-tires').textContent = state.tires;
}

function goPage(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const nav = document.getElementById(`nav-${pageId}`);
  if (nav) nav.classList.add('active');
  if (pageId === 'garage') renderGarage();
  if (pageId === 'league') renderLeague();
  if (pageId === 'zones') renderZones();
  if (pageId === 'bay') renderBay();
}

function toggleDrawer(open) {
  document.getElementById('drawer-backdrop').classList.toggle('hidden', !open);
  document.getElementById('menu-drawer').classList.toggle('hidden', !open);
}

function toggleSound() {
  const on = SoundFX.toggle();
  document.getElementById('sound-toggle-btn').textContent = `🔊 Mechanical Audio: ${on ? 'ON' : 'OFF'}`;
}

function generateJob(vip = false) {
  const z = getZone();
  const pool = z.id === 'i285' ? VEHICLES.slice(0, 3) : VEHICLES;
  const veh = pool[Math.floor(Math.random() * pool.length)];
  const dmg = DAMAGES[Math.floor(Math.random() * DAMAGES.length)];
  const mile = Math.floor(Math.random() * 65) + 4;
  const rigBonus = 1 + (getRigTier() - 1) * 0.12;
  const basePay = Math.round((veh.heavy ? 135 : 75) * z.mult * rigBonus * (vip ? 1.5 : 1));
  return {
    id: 'job_' + Math.random().toString(36).slice(2, 8),
    title: `${z.name.split(' ')[0]} Mile ${mile} — Stranded ${veh.label.split(' ')[1]}`,
    veh,
    dmg,
    pay: basePay,
    vip,
    snipeCost: vip ? 2 : 0
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
        <span>Target: ${j.veh.targetPsi} PSI</span>
        <span>${j.veh.heavy ? 'Heavy-Duty Commercial' : 'Passenger Bay'}</span>
      </div>
      <button class="primary-btn" onclick="acceptJob('${j.id}')">
        ${j.vip ? `SNIPE DISPATCH (${j.snipeCost} ⚡)` : 'ACCEPT & ROLL RIG'}
      </button>
    </div>
  `).join('');
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
      goPage('shop');
      return;
    }
    state.tokens -= job.snipeCost;
  }
  state.jobs = state.jobs.filter((j) => j.id !== jobId);
  state.activeJob = {
    ...job,
    step: 1,
    chocked: false,
    liftPct: 0,
    lugsRemoved: [],
    scanned: false,
    fixed: false,
    psi: 12,
    torqueIdx: 0,
    penalties: 0
  };
  saveState();
  updateHUD();
  renderJobs();
  goPage('bay');
}

// INTERACTIVE 6-STEP PLAYABLE TUTORIAL CALL
function startTutorial() {
  state.activeJob = {
    id: 'tut_call',
    isTutorial: true,
    title: 'I-285 Mile 14 — Guided Training Call',
    veh: VEHICLES[0],
    dmg: DAMAGES[0], // Center-Tread Nail => Plug Only
    pay: 80,
    vip: false,
    snipeCost: 0,
    step: 1,
    chocked: false,
    liftPct: 0,
    lugsRemoved: [],
    scanned: false,
    fixed: false,
    psi: 14,
    torqueIdx: 0,
    penalties: 0
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
  if (job.step === 1 && !job.chocked) {
    return { stepLabel: 'TRAINING 1/6', text: 'First, tap SET WHEEL CHOCKS so the vehicle cannot roll while lifted.' };
  }
  if (job.step === 1 && job.chocked) {
    return { stepLabel: 'TRAINING 2/6', text: 'Chocks locked! Now tap PUMP FLOOR JACK until the wheel lifts to 100%.' };
  }
  if (job.step === 2) {
    return { stepLabel: 'TRAINING 3/6', text: 'Tap the glowing lug nuts on the wheel (or IMPACT NEXT LUG) to spin all 5 off.' };
  }
  if (job.step === 3 && !job.scanned) {
    return { stepLabel: 'TRAINING 4/6', text: 'Tap SCAN TIRE TREAD & SIDEWALL to inspect the damage.' };
  }
  if (job.step === 3 && job.scanned) {
    return { stepLabel: 'TRAINING 4/6', text: 'Nail is dead-center in the tread! Tap PLUG PUNCTURE (never swap a center nail).' };
  }
  if (job.step === 4) {
    return { stepLabel: 'TRAINING 5/6', text: 'Pump air into the green 33–37 PSI target band, then tap LOCK PRESSURE.' };
  }
  return { stepLabel: 'TRAINING 6/6', text: `Torque lugs in star order (1→3→5→2→4). Tap Lug #${STAR_ORDER[job.torqueIdx]} next!` };
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

function renderBay() {
  const job = state.activeJob;
  document.getElementById('bay-empty').classList.toggle('hidden', !!job);
  document.getElementById('bay-active').classList.toggle('hidden', !job);
  if (!job) return;

  // Tutorial Banner
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
        <span class="badge">${coach.stepLabel} · REWARD: +25 ⚡</span>
        <button class="ghost-btn" style="padding:3px 8px;font-size:11px;" onclick="skipTutorial()">Skip</button>
      </div>
      <p>${coach.text}</p>`;
  } else {
    tutEl.className = 'hidden';
  }

  document.getElementById('bay-veh-tag').textContent = job.veh.label;
  document.getElementById('bay-job-title').textContent = job.title;
  const finalPay = job.pay * (state.surgeJobs > 0 ? 2 : 1);
  document.getElementById('bay-payout').textContent = `$${finalPay}`;

  // Vehicle & Tire Visual Layers (PNG with custom SVG fallback)
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
  tireFb.innerHTML = renderTireSVG(job);
  tireImg.src = getTireSpritePath(job);

  // Chock & Lift State
  document.getElementById('stage-chock').classList.toggle('set', job.chocked);
  document.getElementById('jack-arm').style.height = `${10 + Math.round(job.liftPct * 0.34)}px`;
  const lifted = job.liftPct >= 100;
  document.getElementById('stage-chassis').classList.toggle('lifted', lifted);
  document.getElementById('stage-wheel-wrap').classList.toggle('lifted', lifted);
  document.getElementById('scan-beam').classList.toggle('hidden', !(job.step === 3 && !job.scanned));

  // Step Pills
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`sp-${i}`);
    el.className = 'sp' + (job.step === i ? ' active' : job.step > i ? ' done' : '');
  }

  // Lug Ring & Star Lines
  const lugRing = document.getElementById('lug-ring');
  lugRing.innerHTML = LUG_COORDS.map((l) => {
    const isRemoved = job.lugsRemoved.includes(l.id) && job.step < 5;
    const isTorqued = job.step === 5 && STAR_ORDER.slice(0, job.torqueIdx).includes(l.id);
    const pulseLug = job.isTutorial && (
      (job.step === 2 && !isRemoved) ||
      (job.step === 5 && STAR_ORDER[job.torqueIdx] === l.id)
    );
    return `<button class="lug-btn ${isRemoved ? 'removed' : ''} ${isTorqued ? 'torqued' : ''} ${pulseLug ? 'tut-pulse' : ''}"
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

  // Dynamic Step Controls
  const ctrl = document.getElementById('bay-controls');
  if (job.step === 1) {
    ctrl.innerHTML = `
      <strong>Step 1: Secure & Raise Vehicle (${job.liftPct}%)</strong>
      <div class="ctrl-grid-2">
        <button class="secondary-btn ${job.isTutorial && !job.chocked ? 'tut-pulse' : ''}" onclick="setChocks()">
          ${job.chocked ? '✓ CHOCKS SET' : '1. SET WHEEL CHOCKS'}
        </button>
        <button class="primary-btn ${job.isTutorial && job.chocked ? 'tut-pulse' : ''}" onclick="pumpJack()">
          2. PUMP FLOOR JACK
        </button>
      </div>`;
  } else if (job.step === 2) {
    ctrl.innerHTML = `
      <strong>Step 2: Spin Off All 5 Lug Nuts (${job.lugsRemoved.length}/5)</strong>
      <p style="font-size:12px;color:var(--muted);">Tap each lug nut on the wheel hub or use auto-impact.</p>
      <button class="primary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="removeNextLug()">IMPACT NEXT LUG NUT</button>`;
  } else if (job.step === 3) {
    if (!job.scanned) {
      ctrl.innerHTML = `
        <strong>Step 3: Inspect Tire Damage</strong>
        <p style="font-size:12px;color:var(--muted);">Run diagnostic laser scan before choosing Plug or Swap.</p>
        <button class="primary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="runScan()">SCAN TIRE TREAD & SIDEWALL</button>`;
    } else {
      ctrl.innerHTML = `
        <div style="background:#090c12;padding:10px;border-radius:10px;border:1px solid var(--border);">
          <strong style="color:var(--amber);font-size:13px;">DIAGNOSIS: ${job.dmg.title}</strong>
          <p style="font-size:12px;color:var(--muted);margin-top:3px;">${job.dmg.desc}</p>
        </div>
        <div class="ctrl-grid-2">
          <button class="secondary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="performRepair('plug')">PLUG PUNCTURE (${state.plugs})</button>
          <button class="primary-btn" onclick="performRepair('swap')">SWAP NEW TIRE (${state.tires})</button>
        </div>
        <button class="ghost-btn" onclick="droneDrop()">🚁 Drone Tire Drop (3 ⚡)</button>`;
    }
  } else if (job.step === 4) {
    const t = job.veh.targetPsi;
    const inSpec = Math.abs(job.psi - t) <= 2;
    const fillPct = Math.min(100, Math.round((job.psi / (t + 20)) * 100));
    const bandLeft = Math.round(((t - 2) / (t + 20)) * 100);
    const bandWidth = Math.max(8, Math.round((4 / (t + 20)) * 100));
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
        <button class="primary-btn ${job.isTutorial && !inSpec ? 'tut-pulse' : ''}" onclick="adjustPsi(6)">INFLATE (+6 PSI)</button>
      </div>
      <button class="primary-btn ${job.isTutorial && inSpec ? 'tut-pulse' : ''}" onclick="lockPsi()">LOCK PRESSURE & CONTINUE</button>`;
  } else if (job.step === 5) {
    const nextLug = STAR_ORDER[job.torqueIdx];
    ctrl.innerHTML = `
      <strong>Step 5: Star-Pattern Torque (${job.torqueIdx}/5) — Next: Lug #${nextLug}</strong>
      <p style="font-size:12px;color:var(--muted);">Sequence: 1 → 3 → 5 → 2 → 4. Tap Lug #${nextLug} on the wheel or press Torque.</p>
      <button class="primary-btn ${job.isTutorial ? 'tut-pulse' : ''}" onclick="tapLug(${nextLug})">TORQUE LUG #${nextLug} TO SPEC</button>`;
  }
}

function setChocks() {
  const job = state.activeJob;
  if (!job || job.chocked) return;
  job.chocked = true;
  dismissAlert();
  SoundFX.chock();
  renderBay();
}

function pumpJack() {
  const job = state.activeJob;
  if (!job) return;
  if (!job.chocked) {
    showAlert('SAFETY ALERT', 'Set rubber wheel chocks before raising the hydraulic floor jack!');
    return;
  }
  dismissAlert();
  SoundFX.jack();
  const boost = 25 + state.tools.jack.level * 4;
  job.liftPct = Math.min(100, job.liftPct + boost);
  if (job.liftPct >= 100) job.step = 2;
  renderBay();
}

function removeNextLug() {
  const job = state.activeJob;
  if (!job || job.step !== 2) return;
  const rem = [1, 2, 3, 4, 5].find((id) => !job.lugsRemoved.includes(id));
  if (rem) tapLug(rem);
}

function tapLug(id) {
  const job = state.activeJob;
  if (!job) return;
  if (job.step === 2) {
    if (!job.lugsRemoved.includes(id)) {
      job.lugsRemoved.push(id);
      SoundFX.impact();
      if (job.lugsRemoved.length >= 5) job.step = 3;
      renderBay();
    }
  } else if (job.step === 5) {
    const expected = STAR_ORDER[job.torqueIdx];
    if (id !== expected) {
      if (!job.isTutorial) job.penalties += 10;
      showAlert('STAR-PATTERN SEQUENCE ERROR', `Follow crisscross torque order: tap Lug #${expected} next!`);
      return;
    }
    dismissAlert();
    SoundFX.torqueClick();
    job.torqueIdx++;
    if (job.torqueIdx >= 5) completeJob();
    else renderBay();
  }
}

function runScan() {
  const job = state.activeJob;
  if (!job) return;
  SoundFX.scan();
  job.scanned = true;
  renderBay();
}

function performRepair(choice) {
  const job = state.activeJob;
  if (!job) return;

  if (job.dmg.action === 'plug' && choice !== 'plug') {
    if (!job.isTutorial) job.penalties += 15;
    showAlert(
      'UNNECESSARY TIRE SWAP',
      'Center-tread nail punctures are ALWAYS Plug Only. Do not waste a new tire!'
    );
    return;
  }
  if (job.dmg.action === 'swap' && choice !== 'swap') {
    if (!job.isTutorial) job.penalties += 25;
    showAlert(
      'UNSAFE REPAIR REJECTED',
      `${job.dmg.title} cannot be plugged safely. You MUST perform a full Tire Swap!`
    );
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
    if (!job.isTutorial && state.tires <= 0) {
      showAlert('OUT OF REPLACEMENT TIRES', 'Use Drone Tire Drop (3 ⚡) below or restock tires.');
      return;
    }
    if (!job.isTutorial) state.tires--;
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
  if (state.tokens < 3) {
    goPage('shop');
    return;
  }
  state.tokens -= 3;
  state.tires += 1;
  SoundFX.success();
  updateHUD();
  renderBay();
}

function adjustPsi(delta) {
  const job = state.activeJob;
  if (!job) return;
  SoundFX.air();
  job.psi = Math.max(0, Math.min(130, job.psi + delta));
  renderBay();
}

function lockPsi() {
  const job = state.activeJob;
  if (!job) return;
  const t = job.veh.targetPsi;
  if (Math.abs(job.psi - t) > 2) {
    showAlert('PSI OUT OF SPEC', `Calibrate pressure between ${t - 2} and ${t + 2} PSI before torquing lugs.`);
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
    if (firstTime) state.tokens += 25;
    state.activeJob = null;
    saveState();
    updateHUD();
    openModal(`
      <span class="badge">TRAINING COMPLETE</span>
      <h3>Certified DelWin Technician!</h3>
      <p style="font-size:13px;color:var(--muted);">
        You mastered wheel chocking, lug removal, center-nail plug diagnostics, PSI calibration, and star-pattern torquing.
      </p>
      <div style="background:#090c12;padding:12px;border-radius:10px;text-align:center;color:var(--amber);font-weight:900;">
        ${firstTime ? '+25 DISPATCH TOKENS (⚡) CREDITED!' : 'TRAINING PRACTICE COMPLETE'}
      </div>
      <button class="primary-btn" onclick="closeModal(); goPage('dispatch');">ENTER LIVE DISPATCH</button>
    `);
    return;
  }

  const mult = state.surgeJobs > 0 ? 2 : 1;
  if (state.surgeJobs > 0) state.surgeJobs--;
  const gross = job.pay * mult;
  const net = Math.max(25, gross - job.penalties);
  const repGain = Math.round(35 * getZone().mult);
  const gotPart = Math.random() < 0.35;

  state.cash += net;
  state.rep += repGain;
  if (gotPart) state.parts += 1;
  state.ratings.push(job.penalties === 0 ? 5.0 : 4.2);
  if (state.ratings.length > 20) state.ratings.shift();
  state.activeJob = null;

  if (state.jobs.length < 2) refreshJobs();
  saveState();
  updateHUD();

  openModal(`
    <span class="badge">DIGITAL CUSTOMER INVOICE</span>
    <h3>${job.title}</h3>
    <div style="background:#090c12;padding:12px;border-radius:10px;font-size:13px;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;justify-content:space-between;"><span>Service Payout:</span><strong style="color:var(--green);">+$${gross}</strong></div>
      <div style="display:flex;justify-content:space-between;"><span>Protocol Deductions:</span><strong style="color:var(--red);">-$${job.penalties}</strong></div>
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
  } else if (type === 'tire' && state.cash >= 45) {
    state.cash -= 45;
    state.tires += 1;
    SoundFX.torqueClick();
  }
  saveState();
  updateHUD();
}

function renderGarage() {
  const rigTier = getRigTier();
  const rig = RIG_TIERS[rigTier - 1];
  document.getElementById('rig-name').textContent = rig.name;
  document.getElementById('rig-tier-badge').textContent = `TIER ${rigTier} / 6`;
  const rigImg = document.getElementById('rig-img');
  const rigFb = document.getElementById('rig-fallback');
  rigImg.style.display = 'block';
  rigFb.style.display = 'none';
  rigFb.innerHTML = renderRigSVG(rig);
  rigImg.src = rig.img;
  document.getElementById('rig-perk').textContent = rig.perk;

  const list = document.getElementById('tool-list');
  list.innerHTML = Object.entries(state.tools).map(([key, tool]) => {
    const tierIdx = Math.min(6, Math.floor((tool.level - 1) / 4) + 1);
    const tierLabel = TIER_NAMES[tierIdx - 1];
    const isMax = tool.level >= 24;
    const needsPart = !isMax && tool.level % 4 === 0;
    const cost = Math.round(tool.baseCost * Math.pow(1.22, tool.level - 1));
    const imgPath = `assets/${tool.prefix}-t${tierIdx}.png`;
    return `
      <div class="item-card">
        <div class="tool-row">
          <div class="tool-thumb">
            <img src="${imgPath}" alt="${tool.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
            <span style="display:none;">${tool.icon}</span>
          </div>
          <div style="flex:1;">
            <span class="badge">${tierLabel.toUpperCase()} · LVL ${tool.level}/24</span>
            <h3 style="font-size:14px;margin-top:4px;">${tool.name}</h3>
          </div>
        </div>
        <button class="primary-btn" ${isMax ? 'disabled' : ''} onclick="upgradeTool('${key}')">
          ${isMax ? 'MAXED OUT' : `UPGRADE ($${cost}${needsPart ? ' + 1 ⚙️' : ''})`}
        </button>
      </div>`;
  }).join('');
}

function upgradeTool(key) {
  const tool = state.tools[key];
  if (!tool || tool.level >= 24) return;
  const needsPart = tool.level % 4 === 0;
  const cost = Math.round(tool.baseCost * Math.pow(1.22, tool.level - 1));
  if (state.cash < cost) return;
  if (needsPart && state.parts < 1) return;
  state.cash -= cost;
  if (needsPart) state.parts -= 1;
  tool.level += 1;
  SoundFX.success();
  saveState();
  updateHUD();
  renderGarage();
}

function renderLeague() {
  document.getElementById('league-rep').textContent = state.rep;
  const rivals = [
    { name: 'ApexTow_ATL', rep: 1450 },
    { name: 'NightShift_Mike', rep: 920 },
    { name: 'I285_RoadKing', rep: 540 },
    { name: 'PeachState_Duals', rep: 280 },
    { name: 'Southside_Rescue', rep: 110 },
    { name: 'YOU (DelWin Mobile)', rep: state.rep, isYou: true }
  ].sort((a, b) => b.rep - a.rep);

  const myRank = rivals.findIndex((r) => r.isYou) + 1;
  document.getElementById('league-rank').textContent = `#${myRank}`;
  document.getElementById('leaderboard-list').innerHTML = rivals.map((r, idx) => `
    <div class="item-card" style="${r.isYou ? 'border-color:var(--amber);' : ''}">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>#${idx + 1} ${r.name}</strong>
        <span style="color:var(--amber);font-weight:800;">${r.rep} REP</span>
      </div>
    </div>
  `).join('');
}

function renderZones() {
  document.getElementById('zone-list').innerHTML = ZONES.map((z) => {
    const unlocked = state.rep >= z.unlockRep;
    const active = state.zoneId === z.id;
    return `
      <div class="item-card" style="${active ? 'border-color:var(--amber);' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="badge">${z.hub} · ${z.mult}x</span>
            <h3 style="font-size:15px;margin-top:4px;">${z.name}</h3>
          </div>
          <strong>${unlocked ? (active ? 'ACTIVE' : 'OPEN') : `${z.unlockRep} REP`}</strong>
        </div>
        <p style="font-size:12px;color:var(--muted);">${z.desc}</p>
        <button class="primary-btn" ${!unlocked || active ? 'disabled' : ''} onclick="selectZone('${z.id}')">
          ${active ? 'DEPLOYED HERE' : unlocked ? 'DEPLOY TO ZONE' : `REQUIRES ${z.unlockRep} REP`}
        </button>
      </div>`;
  }).join('');
}

function selectZone(id) {
  state.zoneId = id;
  SoundFX.torqueClick();
  saveState();
  updateHUD();
  refreshJobs();
  goPage('dispatch');
}

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
      if (type === 'tokens') state.tokens += 8;
      if (type === 'restock') { state.plugs += 4; state.tires += 2; }
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
    <h3>+${amount} Dispatch Tokens (⚡)</h3>
    <p style="font-size:13px;color:var(--muted);">Demo pack (${price}) credited to your DelWin Mobile account.</p>
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

// INIT
loadState();
if (!state.jobs || state.jobs.length === 0) refreshJobs();
else renderJobs();
updateHUD();
if (!state.tutorialDone) startTutorial();
