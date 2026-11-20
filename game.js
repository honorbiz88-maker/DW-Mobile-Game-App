const TIER_NAMES = ['Novice', 'Intermediate', 'Pro', 'Commercial', 'Heavy-Duty', 'Master'];

const RIG_TIERS = [
  { tier: 1, name: 'Tier 1: Novice Roadside Van', img: 'assets/rig-t1.png', perk: 'Standard highway response rig.' },
  { tier: 2, name: 'Tier 2: Intermediate Utility Pickup', img: 'assets/rig-t2.png', perk: '+10% Base Payouts & Twin Strobes.' },
  { tier: 3, name: 'Tier 3: Pro Extended Tire Truck', img: 'assets/rig-t3.png', perk: '+20% Payouts & Onboard Tire Rack.' },
  { tier: 4, name: 'Tier 4: Commercial Dually Rig', img: 'assets/rig-t4.png', perk: '+30% Payouts & Dual-Wheel Lift.' },
  { tier: 5, name: 'Tier 5: Heavy-Duty Fleet Rescue Box', img: 'assets/rig-t5.png', perk: '+45% Payouts & Fleet Priority.' },
  { tier: 6, name: 'Tier 6: Master Apex Syndicate Flagship', img: 'assets/rig-t6.png', perk: '+65% Payouts & Maximum Corridor Prestige.' }
];

const ZONES = [
  { id: 'i285', name: 'I-285 North Perimeter', mult: 1.0, unlockRep: 0, desc: 'Steady commuter flats and shoulder punctures.' },
  { id: 'i75', name: 'I-75 Downtown Connector', mult: 1.25, unlockRep: 150, desc: 'High-traffic SUV and commercial van calls.' },
  { id: 'i20', name: 'I-20 Freight Corridor', mult: 1.5, unlockRep: 400, desc: 'Box trucks and heavy-duty highway blowouts.' },
  { id: 'sav', name: 'Savannah Port Terminal', mult: 1.85, unlockRep: 850, desc: '18-wheeler duals and VIP fleet contracts.' }
];

const VEHICLES = [
  { id: 'sedan', label: 'COMMUTER SEDAN', heavy: false, targetPsi: 35, img: 'assets/veh-sedan.png' },
  { id: 'suv', label: 'FAMILY SUV', heavy: false, targetPsi: 36, img: 'assets/veh-suv.png' },
  { id: 'pickup', label: 'LIFTED 4X4 PICKUP', heavy: false, targetPsi: 40, img: 'assets/veh-pickup.png' },
  { id: 'boxtruck', label: 'COMMERCIAL BOX TRUCK', heavy: true, targetPsi: 95, img: 'assets/veh-boxtruck.png' },
  { id: 'semi', label: '18-WHEELER TRACTOR', heavy: true, targetPsi: 105, img: 'assets/veh-semi.png' }
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
        <span>${j.veh.heavy ? 'Heavy-Duty 10-Lug' : 'Passenger 5-Lug'}</span>
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

  document.getElementById('bay-veh-tag').textContent = job.veh.label;
  document.getElementById('bay-job-title').textContent = job.title;
  const finalPay = job.pay * (state.surgeJobs > 0 ? 2 : 1);
  document.getElementById('bay-payout').textContent = `$${finalPay}`;

  // Vehicle & Tire Visual Layers
  const vehImg = document.getElementById('stage-veh-img');
  vehImg.style.display = 'block';
  document.getElementById('stage-veh-fallback').style.display = 'none';
  vehImg.src = job.veh.img;
  document.getElementById('stage-veh-name').textContent = `${job.veh.label} WHEEL WELL`;

  const tireImg = document.getElementById('stage-tire-img');
  tireImg.style.display = 'block';
  document.getElementById('stage-tire-fallback').style.display = 'none';
  tireImg.src = getTireSpritePath(job);

  const marker = document.getElementById('damage-marker');
  marker.className = 'damage-marker' + (job.fixed ? ' healthy' : job.dmg.action === 'swap' ? ' sidewall' : '');

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
    return `<button class="lug-btn ${isRemoved ? 'removed' : ''} ${isTorqued ? 'torqued' : ''}"
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
        <button class="secondary-btn" onclick="setChocks()">${job.chocked ? '✓ CHOCKS SET' : '1. SET WHEEL CHOCKS'}</button>
        <button class="primary-btn" onclick="pumpJack()">2. PUMP FLOOR JACK</button>
      </div>`;
  } else if (job.step === 2) {
    ctrl.innerHTML = `
      <strong>Step 2: Spin Off All 5 Lug Nuts (${job.lugsRemoved.length}/5)</strong>
      <p style="font-size:12px;color:var(--muted);">Tap each lug nut on the wheel hub or use auto-impact.</p>
      <button class="primary-btn" onclick="removeNextLug()">IMPACT NEXT LUG NUT</button>`;
  } else if (job.step === 3) {
    if (!job.scanned) {
      ctrl.innerHTML = `
        <strong>Step 3: Inspect Tire Damage</strong>
        <p style="font-size:12px;color:var(--muted);">Run diagnostic laser scan before choosing Plug or Swap.</p>
        <button class="primary-btn" onclick="runScan()">SCAN TIRE TREAD & SIDEWALL</button>`;
    } else {
      ctrl.innerHTML = `
        <div style="background:#090c12;padding:10px;border-radius:10px;border:1px solid var(--border);">
          <strong style="color:var(--amber);font-size:13px;">DIAGNOSIS: ${job.dmg.title}</strong>
          <p style="font-size:12px;color:var(--muted);margin-top:3px;">${job.dmg.desc}</p>
        </div>
        <div class="ctrl-grid-2">
          <button class="secondary-btn" onclick="performRepair('plug')">PLUG PUNCTURE (${state.plugs})</button>
          <button class="primary-btn" onclick="performRepair('swap')">SWAP NEW TIRE (${state.tires})</button>
        </div>
        <button class="ghost-btn" onclick="droneDrop()">🚁 Drone Tire Drop (3 ⚡)</button>`;
    }
  } else if (job.step === 4) {
    const t = job.veh.targetPsi;
    ctrl.innerHTML = `
      <strong>Step 4: Calibrate Air Pressure (Target: ${t - 2}–${t + 2} PSI)</strong>
      <div class="psi-meter"><div class="psi-val">${job.psi} PSI</div></div>
      <div class="ctrl-grid-2">
        <button class="secondary-btn" onclick="adjustPsi(-3)">BLEED AIR (-3)</button>
        <button class="primary-btn" onclick="adjustPsi(6)">INFLATE (+6 PSI)</button>
      </div>
      <button class="primary-btn" onclick="lockPsi()">LOCK PRESSURE & CONTINUE</button>`;
  } else if (job.step === 5) {
    const nextLug = STAR_ORDER[job.torqueIdx];
    ctrl.innerHTML = `
      <strong>Step 5: Star-Pattern Torque (${job.torqueIdx}/5) — Next: Lug #${nextLug}</strong>
      <p style="font-size:12px;color:var(--muted);">Sequence: 1 → 3 → 5 → 2 → 4. Tap Lug #${nextLug} on the wheel or press Torque.</p>
      <button class="primary-btn" onclick="tapLug(${nextLug})">TORQUE LUG #${nextLug} TO SPEC</button>`;
  }
}

function setChocks() {
  const job = state.activeJob;
  if (!job || job.chocked) return;
  job.chocked = true;
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
      job.penalties += 10;
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

  // STRICT RULE ENFORCEMENT
  if (job.dmg.action === 'plug' && choice !== 'plug') {
    job.penalties += 15;
    showAlert(
      'UNNECESSARY TIRE SWAP',
      'Center-tread nail punctures are ALWAYS Plug Only. Do not waste a new tire!'
    );
    return;
  }
  if (job.dmg.action === 'swap' && choice !== 'swap') {
    job.penalties += 25;
    showAlert(
      'UNSAFE REPAIR REJECTED',
      `${job.dmg.title} cannot be plugged safely. You MUST perform a full Tire Swap!`
    );
    return;
  }

  if (choice === 'plug') {
    if (state.plugs <= 0) {
      showAlert('OUT OF PLUGS', 'Restock vulcanized tire plugs from Dispatch or watch a 30s Supply Drop Ad.');
      return;
    }
    state.plugs--;
    SoundFX.impact();
  } else {
    if (state.tires <= 0) {
      showAlert('OUT OF REPLACEMENT TIRES', 'Use Drone Tire Drop (3 ⚡) below or restock tires.');
      return;
    }
    state.tires--;
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
  rigImg.style.display = 'block';
  document.getElementById('rig-fallback').style.display = 'none';
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
    { name: 'ApexTow_ATL', rep: 1120 },
    { name: 'NightShift_Mike', rep: 780 },
    { name: 'I285_RoadKing', rep: 490 },
    { name: 'PeachState_Duals', rep: 260 },
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
            <span class="badge">${z.mult}x PAYOUT MULTIPLIER</span>
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

function startTutorial() {
  openModal(`
    <span class="badge">QUICK FIELD BRIEFING (+25 ⚡)</span>
    <h3>DelWin Mobile Field Rules</h3>
    <p style="font-size:13px;color:var(--muted);line-height:1.45;">
      1. <strong>Chock & Lift</strong> before removing lugs.<br/>
      2. <strong>Center-Tread Nail = Plug Only.</strong><br/>
      3. <strong>Bulge, Blowout, Gash, or Shredded = Tire Swap Only.</strong><br/>
      4. <strong>Calibrate PSI</strong> and torque lugs in star order (<strong>1→3→5→2→4</strong>).
    </p>
    <button class="primary-btn" onclick="finishTutorial()">CLAIM +25 ⚡ & START SHIFT</button>
  `);
}

function finishTutorial() {
  if (!state.tutorialDone) {
    state.tutorialDone = true;
    state.tokens += 25;
    saveState();
    updateHUD();
  }
  SoundFX.success();
  closeModal();
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

