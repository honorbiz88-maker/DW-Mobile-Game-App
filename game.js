/* ==========================================================================
   DELWIN MOBILE: ROADSIDE TIRE RESCUE — GAME ENGINE (game.js)
   Includes:
   - 6-Tier Progressive Rig & Cargo System
   - 24-Zone Georgia & Interstate Map + Dynamic Night Shift / Rain Conditions
   - 6-Step Interactive Tutorial
   - 5-Step Repair Bay (Cones/Chocks/Jack, Lug Removal + Security Lock + Seized Oil Soak,
     Plug vs. Tire Swap Diagnostics, PSI Calibration + Stubborn Bead Seater,
     Star-Pattern Torquing + Lower Jack Stowage)
   - Shoulder Traffic Pass-By Alerts & Perimeter Safety Hazards
   - Weekly League, VIP Commercial Contracts, Clean-Streak Gold Gear & Rewarded Ads
   ========================================================================== */

'use strict';

const STORAGE_KEY = 'delwin_mobile_tire_rescue_v2026_11';

const RIG_TIERS = [
  { level: 1, name: 'Tier 1: Service Sedan',      cargoMax: 2,  cost: 0,     speedBonus: 1.00, icon: '🚗' },
  { level: 2, name: 'Tier 2: Roadside SUV',       cargoMax: 4,  cost: 450,   speedBonus: 1.12, icon: '🚙' },
  { level: 3, name: 'Tier 3: Utility Pickup',     cargoMax: 6,  cost: 1200,  speedBonus: 1.25, icon: '🛻' },
  { level: 4, name: 'Tier 4: Sprinter Tire Van',  cargoMax: 10, cost: 2800,  speedBonus: 1.40, icon: '🚐' },
  { level: 5, name: 'Tier 5: Dually Flatbed',     cargoMax: 14, cost: 6000,  speedBonus: 1.55, icon: '🚚' },
  { level: 6, name: 'Tier 6: Heavy Fleet Rig',    cargoMax: 20, cost: 12500, speedBonus: 1.75, icon: '🚛' }
];

const ZONES = [
  { id: 1,  name: 'I-285 Tucker / Northlake',     mult: 1.00, minRep: 0,    trafficRate: 0.05 },
  { id: 2,  name: 'Lawrenceville Hwy / Lilburn',  mult: 1.08, minRep: 40,   trafficRate: 0.05 },
  { id: 3,  name: 'I-85 Spaghetti Junction',      mult: 1.15, minRep: 90,   trafficRate: 0.07 },
  { id: 4,  name: 'Decatur / Stone Mountain Fwy', mult: 1.22, minRep: 150,  trafficRate: 0.06 },
  { id: 5,  name: 'Norcross / Peachtree Ind.',    mult: 1.30, minRep: 220,  trafficRate: 0.06 },
  { id: 6,  name: 'Duluth / Gwinnett Place',      mult: 1.38, minRep: 300,  trafficRate: 0.06 },
  { id: 7,  name: 'Midtown Connector I-75/85',    mult: 1.46, minRep: 400,  trafficRate: 0.08 },
  { id: 8,  name: 'Perimeter / Sandy Springs',    mult: 1.54, minRep: 520,  trafficRate: 0.07 },
  { id: 9,  name: 'Buckhead / GA-400 Corridor',   mult: 1.62, minRep: 650,  trafficRate: 0.07 },
  { id: 10, name: 'I-20 East / Conyers',          mult: 1.70, minRep: 800,  trafficRate: 0.07 },
  { id: 11, name: 'Hartsfield Airport I-85 S',    mult: 1.80, minRep: 980,  trafficRate: 0.08 },
  { id: 12, name: 'Marietta / I-75 North',        mult: 1.90, minRep: 1180, trafficRate: 0.07 },
  { id: 13, name: 'Alpharetta / Windward',        mult: 2.00, minRep: 1400, trafficRate: 0.07 },
  { id: 14, name: 'Buford / Mall of Georgia',     mult: 2.12, minRep: 1650, trafficRate: 0.07 },
  { id: 15, name: 'Lithonia / Industrial Blvd',   mult: 2.24, minRep: 1920, trafficRate: 0.08 },
  { id: 16, name: 'Smyrna / Vinings I-285 W',     mult: 2.36, minRep: 2220, trafficRate: 0.08 },
  { id: 17, name: 'Kennesaw / Barrett Pkwy',      mult: 2.50, minRep: 2550, trafficRate: 0.07 },
  { id: 18, name: 'McDonough / I-75 Logistics',   mult: 2.65, minRep: 2900, trafficRate: 0.09 },
  { id: 19, name: 'Douglasville / I-20 West',     mult: 2.80, minRep: 3300, trafficRate: 0.08 },
  { id: 20, name: 'Gainesville / I-985 North',    mult: 2.95, minRep: 3750, trafficRate: 0.08 },
  { id: 21, name: 'Newnan / I-85 South Freight',  mult: 3.12, minRep: 4250, trafficRate: 0.09 },
  { id: 22, name: 'Cartersville / Hwy 411',       mult: 3.30, minRep: 4800, trafficRate: 0.08 },
  { id: 23, name: 'Covington / I-20 Eastbound',   mult: 3.50, minRep: 5400, trafficRate: 0.09 },
  { id: 24, name: 'Metro Freight Mega-Corridor',  mult: 3.75, minRep: 6100, trafficRate: 0.10 }
];

const VEHICLES = [
  { id: 'sedan',    name: 'Compact Sedan',      targetPsi: 35, basePay: 65,  heavy: false, minRig: 1 },
  { id: 'suv',      name: 'Midsize SUV',        targetPsi: 38, basePay: 80,  heavy: false, minRig: 1 },
  { id: 'pickup',   name: '1500 Crew Pickup',   targetPsi: 42, basePay: 95,  heavy: false, minRig: 2 },
  { id: 'sprinter', name: 'Delivery Van',       targetPsi: 55, basePay: 120, heavy: true,  minRig: 3 },
  { id: 'boxtruck', name: '26ft Box Truck',     targetPsi: 85, basePay: 165, heavy: true,  minRig: 4 },
  { id: 'semi',     name: '18-Wheeler Tractor', targetPsi: 105,basePay: 230, heavy: true,  minRig: 5 }
];

const DAMAGE_TYPES = [
  { id: 'nail',     label: 'Center Tread Nail Puncture', action: 'plug', desc: 'Clean puncture in center tread crown — safe to plug.' },
  { id: 'screw',    label: 'Tread Groove Sheet-Metal Screw', action: 'plug', desc: 'Single puncture inside repairable belt zone — plug approved.' },
  { id: 'sidewall', label: 'Sidewall Pinch / Bubble',    action: 'swap', desc: 'Structural sidewall failure — DO NOT PLUG. Full tire swap required.' },
  { id: 'blowout',  label: 'Shredded Belt Blowout',      action: 'swap', desc: 'Tread separation & exposed steel cords — full replacement required.' }
];

const STAR_ORDER = [0, 2, 4, 1, 3]; // 5-lug star torque pattern

const DEFAULT_STATE = {
  cash: 180,
  goldGears: 5,
  tokens: 3,
  rep: 0,
  rigLevel: 1,
  zoneId: 1,
  tiresInCargo: 2,
  plugsInCargo: 4,
  cleanStreak: 0,
  jobsCompleted: 0,
  leaguePoints: 0,
  tutorialDone: false,
  tutorialStep: 0,
  tools: {
    jack:   { level: 1, max: 12, baseCost: 110 },
    impact: { level: 1, max: 12, baseCost: 130 },
    comp:   { level: 1, max: 12, baseCost: 125 },
    torque: { level: 1, max: 12, baseCost: 120 }
  },
  boardJobs: [],
  activeJob: null
};

let state = loadState();
let bayTimerInterval = null;
let psiHoldInterval = null;
let uiAlert = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      tools: {
        ...structuredClone(DEFAULT_STATE.tools),
        ...(parsed.tools || {})
      }
    };
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function getRig() {
  return RIG_TIERS[Math.min(RIG_TIERS.length - 1, Math.max(0, state.rigLevel - 1))];
}

function getZone() {
  return ZONES.find(z => z.id === state.zoneId) || ZONES[0];
}

function showToast(msg) {
  let el = document.getElementById('game-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'game-toast';
    el.style.cssText = [
      'position:fixed;bottom:76px;left:50%;transform:translateX(-50%);',
      'background:#0f172a;color:#f8fafc;border:1px solid #38bdf8;',
      'padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;',
      'z-index:9999;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.45);',
      'max-width:90vw;text-align:center;'
    ].join('');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 2400);
}

function showAlert(title, body) {
  uiAlert = { title, body };
  renderAlertBanner();
}

function dismissAlert() {
  uiAlert = null;
  renderAlertBanner();
}

function renderAlertBanner() {
  const bayActive = document.getElementById('bay-active');
  if (!bayActive) return;
  let box = document.getElementById('bay-alert-box');
  if (!uiAlert) {
    if (box) box.remove();
    return;
  }
  if (!box) {
    box = document.createElement('div');
    box.id = 'bay-alert-box';
    box.style.cssText = [
      'background:rgba(220,38,38,0.18);border:1px solid #ef4444;color:#fee2e2;',
      'padding:10px 12px;border-radius:10px;margin-bottom:8px;font-size:12px;'
    ].join('');
    bayActive.prepend(box);
  }
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <strong>⚠️ ${uiAlert.title}</strong>
      <button type="button" data-action="dismiss-alert"
        style="background:transparent;border:1px solid #fca5a5;color:#fee2e2;border-radius:6px;padding:2px 6px;font-size:11px;cursor:pointer;">
        OK
      </button>
    </div>
    <div style="margin-top:4px;line-height:1.35;">${uiAlert.body}</div>
  `;
}

/* ==========================================================================
   JOB GENERATION (WITH SEIZED LUGS, SECURITY LOCKS & CONDITIONS)
   ========================================================================== */
function createJob(options = {}) {
  const z = getZone();
  const isTutorial = !!options.isTutorial;
  const availableVehicles = VEHICLES.filter(v => v.minRig <= state.rigLevel);
  const veh = isTutorial
    ? VEHICLES[0]
    : availableVehicles[Math.floor(Math.random() * availableVehicles.length)];

  const dmg = isTutorial
    ? DAMAGE_TYPES[0]
    : DAMAGE_TYPES[Math.floor(Math.random() * DAMAGE_TYPES.length)];

  const rollCond = Math.random();
  const cond = isTutorial ? 'day' : (rollCond < 0.25 ? 'rain' : (rollCond < 0.50 ? 'night' : 'day'));
  const isVip = !isTutorial && (options.vip || Math.random() < 0.22);

  const condMult = cond === 'rain' ? 1.25 : (cond === 'night' ? 1.18 : 1.0);
  const vipMult = isVip ? 1.35 : 1.0;
  const payout = Math.round(veh.basePay * z.mult * condMult * vipMult);
  const repReward = Math.round((14 + z.id * 2) * condMult * (isVip ? 1.3 : 1.0));
  const timeLimit = isTutorial ? 180 : Math.max(55, 95 - Math.floor(z.id * 1.1));

  // Security Wheel Lock on mid/high zones or VIP calls
  const hasLock = !isTutorial && (isVip || z.id >= 3) && Math.random() < 0.42;

  // Hazard #2: Seized / Swollen Lug Nuts (0 to 2 lugs)
  const seizedLugs = [];
  if (!isTutorial) {
    const baseSeizedChance = 0.28 + (z.mult >= 1.4 ? 0.14 : 0) + (cond === 'rain' ? 0.15 : 0);
    if (Math.random() < baseSeizedChance) {
      const count = Math.random() < 0.35 ? 2 : 1;
      while (seizedLugs.length < count) {
        const idx = Math.floor(Math.random() * 5);
        if (!seizedLugs.includes(idx)) seizedLugs.push(idx);
      }
    }
  }

  return {
    id: 'job_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
    isTutorial,
    isVip,
    zoneName: z.name,
    veh,
    dmg,
    cond,
    payout,
    repReward,
    timeLimit,
    timeLeft: timeLimit,
    penalties: [],
    penaltyCash: 0,
    penaltyRep: 0,

    // Step 1: Perimeter & Lift
    step: 1,
    conesSet: false,
    chocksSet: false,
    jackPumps: 0,
    jackPumpsNeeded: 4,
    jackRaised: false,

    // Step 2: Lug Removal + Security Lock + Seized Oil Soak
    hasLock,
    lockKeyApplied: !hasLock,
    seizedLugs,
    oilAppliedLugs: [],
    oilSoakingUntil: 0,
    lugsOff: [false, false, false, false, false],
    wheelOff: false,

    // Step 3: Diagnostics & Repair
    inspected: false,
    repaired: false,

    // Step 4: PSI Inflation + Stubborn Tire Bead
    psi: 12,
    unseatedBead: false,

    // Step 5: Star Torque + Lower Jack Stowage
    lugsTorqued: [false, false, false, false, false],
    torquedCount: 0,
    jackLowered: false,

    // Hazard #1: Shoulder Traffic Alert State
    trafficAlertText: '',
    trafficAlertUntil: 0
  };
}

function refreshDispatchBoard(force = false) {
  if (!force && state.boardJobs && state.boardJobs.length >= 3) return;
  state.boardJobs = [
    createJob({ vip: false }),
    createJob({ vip: false }),
    createJob({ vip: Math.random() < 0.45 })
  ];
  saveState();
}

function addBayPenalty(job, cashAmt, reason, repAmt = 4) {
  if (!job || job.isTutorial) return;
  job.penaltyCash = (job.penaltyCash || 0) + cashAmt;
  job.penaltyRep = (job.penaltyRep || 0) + repAmt;
  job.penalties.push({ cash: cashAmt, rep: repAmt, reason });
}

/* ==========================================================================
   HAZARD #1: SHOULDER TRAFFIC PASS-BY ALERTS
   ========================================================================== */
function ensureTrafficAlertUI() {
  const bayActive = document.getElementById('bay-active');
  if (!bayActive) return null;
  let banner = document.getElementById('shoulder-traffic-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'shoulder-traffic-banner';
    banner.style.cssText = [
      'display:none;',
      'padding:8px 10px;',
      'border-radius:10px;',
      'font-size:12px;',
      'font-weight:800;',
      'margin-bottom:8px;',
      'border:1px solid #f97316;',
      'background:rgba(249, 115, 22, 0.14);',
      'color:#ffedd5;'
    ].join('');
    const stage = document.getElementById('bay-stage');
    if (stage) bayActive.insertBefore(banner, stage);
    else bayActive.prepend(banner);
  }
  return banner;
}

function triggerShoulderPassBy(job) {
  if (!job || job.isTutorial || job.jackLowered) return;
  const z = getZone();
  const isHeavyPass = (z.mult >= 1.5) || (job.veh && job.veh.heavy) || Math.random() < 0.45;
  const passLabel = isHeavyPass ? '🚛 SEMI PASS-BY WIND GUST!' : '🚗 HIGH-SPEED LANE PASS-BY!';

  job.trafficAlertText = passLabel;
  job.trafficAlertUntil = Date.now() + 3400;

  const stage = document.getElementById('bay-stage');
  if (stage) {
    stage.style.transition = 'transform 0.12s ease';
    stage.style.transform = 'translateX(-4px)';
    setTimeout(() => { if (stage) stage.style.transform = 'translateX(4px)'; }, 120);
    setTimeout(() => { if (stage) stage.style.transform = 'translateX(0px)'; }, 240);
  }

  if (!job.conesSet) {
    const penCash = isHeavyPass ? 15 : 10;
    const penRep = isHeavyPass ? 8 : 5;
    addBayPenalty(job, penCash, `Shoulder Hazard: ${passLabel.replace(/[^\w\s-]/g, '').trim()} without cones`, penRep);
    showAlert(
      `SHOULDER PASS-BY HAZARD (-$${penCash} / -${penRep} REP)`,
      'Traffic roared past on the shoulder while cones were down! Tap 1. SET CONES to protect your work zone.'
    );
  }
  renderBay();
}

function updateShoulderTrafficBanner(job) {
  const banner = ensureTrafficAlertUI();
  if (!banner) return;
  if (!job || job.isTutorial || !job.trafficAlertText || Date.now() > (job.trafficAlertUntil || 0)) {
    banner.style.display = 'none';
    return;
  }
  const safePerimeter = !!job.conesSet;
  banner.style.display = 'flex';
  banner.style.justifyContent = 'space-between';
  banner.style.alignItems = 'center';
  banner.style.borderColor = safePerimeter ? '#10b981' : '#ef4444';
  banner.style.background = safePerimeter ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.18)';
  banner.style.color = safePerimeter ? '#d1fae5' : '#fecaca';
  banner.innerHTML = `
    <span>${job.trafficAlertText}</span>
    <span>${safePerimeter ? '🛡️ CONES BLOCKING' : '⚠️ NO CONES!'}</span>
  `;
}

/* ==========================================================================
   HAZARD #2: SEIZED / SWOLLEN LUG OIL SOAK
   ========================================================================== */
function hasSeizedLugs(job) {
  return !!(job && Array.isArray(job.seizedLugs) && job.seizedLugs.length > 0);
}

function sprayPenetratingOil() {
  const job = state.activeJob;
  if (!job || !hasSeizedLugs(job)) return;

  const targetIdx = job.seizedLugs.shift();
  if (!job.oilAppliedLugs) job.oilAppliedLugs = [];
  job.oilAppliedLugs.push(targetIdx);

  const soakMs = (state.rigLevel >= 3 || state.tools.impact.level >= 5) ? 600 : 1400;
  job.oilSoakingUntil = Date.now() + soakMs;
  dismissAlert();

  showToast(`🛢️ Penetrating oil applied to Lug #${targetIdx + 1} (${(soakMs / 1000).toFixed(1)}s soak)...`);
  renderBay();

  setTimeout(() => {
    if (state.activeJob && state.activeJob.id === job.id) {
      renderBay();
    }
  }, soakMs + 40);
}

function checkSeizedLugBeforeRemove(job, idx) {
  if (!job) return true;
  if (job.oilSoakingUntil && Date.now() < job.oilSoakingUntil) {
    showToast('⏳ Let penetrating oil soak for a split second...');
    return false;
  }
  if (Array.isArray(job.seizedLugs) && job.seizedLugs.includes(idx)) {
    addBayPenalty(job, 8, `Socket slipped on seized/swollen Lug #${idx + 1} — spray penetrating oil first`, 4);
    showAlert(
      'SEIZED / SWOLLEN LUG NUT (-$8 / -4 REP)',
      `Lug #${idx + 1} is rusted/swollen! Tap "🛢️ PENETRATING OIL SOAK" before impacting it loose.`
    );
    renderBay();
    return false;
  }
  return true;
}

/* ==========================================================================
   HAZARD #3: STUBBORN TIRE BEAD SEATING
   ========================================================================== */
function blastTireBead() {
  const job = state.activeJob;
  if (!job || !job.unseatedBead) return;

  job.unseatedBead = false;
  job.psi = Math.max(job.psi, 18);
  dismissAlert();

  const wrap = document.getElementById('stage-wheel-wrap');
  if (wrap) {
    wrap.style.transition = 'transform 0.1s ease';
    wrap.style.transform = 'translateX(-50%) scale(1.07)';
    setTimeout(() => {
      if (wrap) wrap.style.transform = 'translateX(-50%) scale(1)';
    }, 140);
  }

  showToast('💥 Cheetah air burst seated tire bead onto rim!');
  renderBay();
}

/* ==========================================================================
   BAY WORKFLOW & 5-STEP MECHANICS
   ========================================================================== */
function acceptJob(jobId) {
  if (state.activeJob) {
    showToast('Finish your active roadside call in the Bay first!');
    switchView('bay');
    return;
  }
  const idx = state.boardJobs.findIndex(j => j.id === jobId);
  if (idx === -1) return;
  const job = state.boardJobs.splice(idx, 1)[0];
  state.activeJob = job;
  uiAlert = null;
  saveState();
  startBayTimer();
  switchView('bay');
  renderAll();
}

function startTutorialJob() {
  state.activeJob = createJob({ isTutorial: true });
  state.tutorialStep = 1;
  uiAlert = null;
  saveState();
  startBayTimer();
  switchView('bay');
  renderAll();
}

function startBayTimer() {
  clearInterval(bayTimerInterval);
  bayTimerInterval = setInterval(() => {
    const job = state.activeJob;
    if (!job) {
      clearInterval(bayTimerInterval);
      return;
    }
    if (!job.isTutorial && job.timeLeft > 0) {
      job.timeLeft -= 1;

      // Trigger periodic shoulder traffic pass-bys after first 6 seconds
      const z = getZone();
      const passRate = z.trafficRate || 0.06;
      if (job.timeLeft < job.timeLimit - 6 && Math.random() < passRate) {
        triggerShoulderPassBy(job);
      }

      if (job.timeLeft <= 0) {
        addBayPenalty(job, 20, 'Response SLA timer expired', 10);
        showAlert('DISPATCH SLA EXPIRED (-$20 / -10 REP)', 'Customer wait threshold exceeded. Complete the repair cleanly to salvage payout!');
      }
      renderBayTimerOnly();
    }
  }, 1000);
}

function renderBayTimerOnly() {
  const job = state.activeJob;
  const el = document.getElementById('bay-timer');
  if (el && job) {
    el.textContent = job.isTutorial ? 'TUTORIAL' : `${Math.max(0, job.timeLeft)}s`;
  }
}

function handleSetCones() {
  const job = state.activeJob;
  if (!job || job.conesSet) return;
  job.conesSet = true;
  dismissAlert();
  if (job.isTutorial && state.tutorialStep === 1) state.tutorialStep = 2;
  saveState();
  renderBay();
}

function handleSetChocks() {
  const job = state.activeJob;
  if (!job || job.chocksSet) return;
  job.chocksSet = true;
  dismissAlert();
  saveState();
  renderBay();
}

function handlePumpJack() {
  const job = state.activeJob;
  if (!job || job.jackRaised) return;

  if (!job.conesSet || !job.chocksSet) {
    addBayPenalty(job, 12, 'OSHA / Safety violation: Lifted vehicle before setting cones & wheel chocks', 6);
    showAlert(
      'SAFETY PROTOCOL VIOLATION (-$12 / -6 REP)',
      'Always deploy Safety Cones AND Wheel Chocks before raising the hydraulic floor jack!'
    );
    renderBay();
    return;
  }

  const pumpPower = state.tools.jack.level >= 7 ? 2 : 1;
  job.jackPumps = Math.min(job.jackPumpsNeeded, job.jackPumps + pumpPower);
  if (job.jackPumps >= job.jackPumpsNeeded) {
    job.jackRaised = true;
    job.step = 2;
    if (job.isTutorial && state.tutorialStep === 2) state.tutorialStep = 3;
  }
  saveState();
  renderBay();
}

function handleApplyLockKey() {
  const job = state.activeJob;
  if (!job || !job.jackRaised || job.lockKeyApplied) return;
  job.lockKeyApplied = true;
  dismissAlert();
  showToast('🔑 Security wheel-lock key engaged!');
  saveState();
  renderBay();
}

function handleRemoveLug(idx) {
  const job = state.activeJob;
  if (!job || !job.jackRaised || job.wheelOff) return;
  if (job.lugsOff[idx]) return;

  if (!job.lockKeyApplied) {
    addBayPenalty(job, 10, 'Attempted impact on keyed security lug without lock adapter', 5);
    showAlert(
      'SECURITY WHEEL LOCK (-$10 / -5 REP)',
      'Engage the 🔑 WHEEL LOCK KEY ADAPTER before impacting lugs off!'
    );
    renderBay();
    return;
  }

  // Hazard #2 check: Seized / Swollen Lug
  if (!checkSeizedLugBeforeRemove(job, idx)) return;

  job.lugsOff[idx] = true;
  if (job.lugsOff.every(Boolean)) {
    job.wheelOff = true;
    job.step = 3;
    if (job.isTutorial && state.tutorialStep === 3) state.tutorialStep = 4;
  }
  saveState();
  renderBay();
}

function handleInspectTire() {
  const job = state.activeJob;
  if (!job || !job.wheelOff || job.inspected) return;
  job.inspected = true;
  saveState();
  renderBay();
}

function performRepair(choice) {
  const job = state.activeJob;
  if (!job || !job.wheelOff || job.repaired) return;

  if (!job.inspected) {
    showAlert('INSPECT TIRE FIRST', 'Run the Tire Tread & Sidewall Scan before choosing Plug vs. Swap.');
    return;
  }

  if (choice !== job.dmg.action) {
    addBayPenalty(job, 18, `Misdiagnosed ${job.dmg.label} (chose ${choice.toUpperCase()} instead of ${job.dmg.action.toUpperCase()})`, 9);
    showAlert(
      'WRONG REPAIR METHOD (-$18 / -9 REP)',
      `${job.dmg.desc}`
    );
    renderBay();
    return;
  }

  if (choice === 'plug') {
    if (state.plugsInCargo <= 0) {
      showAlert('OUT OF PLUG KITS', 'Restock Plug Kits in the Truck / Shop tab or watch a supply drop!');
      return;
    }
    state.plugsInCargo -= 1;
    job.unseatedBead = false;
  } else {
    if (state.tiresInCargo <= 0) {
      showAlert('OUT OF SPARE TIRES', 'Load replacement tires into your rig cargo in the Truck / Shop tab!');
      return;
    }
    state.tiresInCargo -= 1;

    // Hazard #3: Stubborn Tire Bead on Swapped Tires
    const compLvl = (state.tools && state.tools.comp) ? state.tools.comp.level : 1;
    const beadChance = job.veh.heavy ? 0.55 : (job.veh.id === 'pickup' || job.veh.id === 'suv' ? 0.40 : 0.25);
    const autoSeatedByProComp = !job.veh.heavy && compLvl >= 9;
    job.unseatedBead = !job.isTutorial && !autoSeatedByProComp && (Math.random() < beadChance);
    if (job.unseatedBead) {
      job.psi = 10;
    }
  }

  job.repaired = true;
  job.step = 4;
  dismissAlert();
  if (job.isTutorial && state.tutorialStep === 4) state.tutorialStep = 5;
  saveState();
  renderBay();
}

function applyPsiTick(delta) {
  const job = state.activeJob;
  if (!job || job.step !== 4) return;

  // Hazard #3 check: Unseated bead leaks air until blasted with bead seater
  if (job.unseatedBead && delta > 0) {
    stopHoldPsi();
    job.psi = Math.min(14, job.psi + 1);
    updateLivePsiMeter(job);
    showAlert(
      'AIR LEAKING AT RIM FLANGE',
      'Tire bead is not seated against the wheel rim! Tap 💥 BLAST AIR BEAD SEATER before inflating.'
    );
    renderBay();
    return;
  }

  const speedBonus = Math.ceil(state.tools.comp.level / 4);
  job.psi = Math.max(5, Math.min(job.veh.targetPsi + 15, job.psi + delta * speedBonus));
  updateLivePsiMeter(job);
}

function startHoldPsi(delta) {
  stopHoldPsi();
  applyPsiTick(delta);
  psiHoldInterval = setInterval(() => applyPsiTick(delta), 110);
}

function stopHoldPsi() {
  clearInterval(psiHoldInterval);
  psiHoldInterval = null;
}

function updateLivePsiMeter(job) {
  const readout = document.getElementById('psi-live-readout');
  if (readout && job) {
    readout.textContent = `${job.psi} / ${job.veh.targetPsi} PSI`;
  }
}

function handleLockPsi() {
  const job = state.activeJob;
  if (!job || job.step !== 4) return;
  stopHoldPsi();

  if (job.unseatedBead) {
    showAlert('BEAD NOT SEATED', 'Tap 💥 BLAST AIR BEAD SEATER first so the tire seals onto the rim.');
    return;
  }

  const diff = Math.abs(job.psi - job.veh.targetPsi);
  if (diff > 2) {
    addBayPenalty(job, 10, `PSI off OEM spec (${job.psi} vs ${job.veh.targetPsi} PSI)`, 5);
    showAlert(
      `PSI OUT OF SPEC (-$10 / -5 REP)`,
      `Calibrate within ±2 PSI of ${job.veh.targetPsi} PSI before locking pressure.`
    );
    renderBay();
    return;
  }

  job.step = 5;
  dismissAlert();
  if (job.isTutorial && state.tutorialStep === 5) state.tutorialStep = 6;
  saveState();
  renderBay();
}

function handleTorqueLug(idx) {
  const job = state.activeJob;
  if (!job || job.step !== 5 || job.lugsTorqued[idx]) return;

  const expectedIdx = STAR_ORDER[job.torquedCount];
  if (idx !== expectedIdx) {
    addBayPenalty(job, 9, `Out-of-sequence torque on Lug #${idx + 1} (expected Lug #${expectedIdx + 1})`, 4);
    showAlert(
      'STAR TORQUE SEQUENCE ERROR (-$9 / -4 REP)',
      `Follow the highlighted star-pattern lug (#${expectedIdx + 1}) to prevent rotor warp!`
    );
    renderBay();
    return;
  }

  job.lugsTorqued[idx] = true;
  job.torquedCount += 1;
  dismissAlert();
  saveState();
  renderBay();
}

function handleLowerJackAndComplete() {
  const job = state.activeJob;
  if (!job || job.step !== 5 || job.torquedCount < 5) return;

  job.jackLowered = true;
  clearInterval(bayTimerInterval);

  const cleanJob = (job.penaltyCash || 0) === 0;
  const finalCash = Math.max(20, job.payout - (job.penaltyCash || 0));
  const finalRep = Math.max(4, job.repReward - (job.penaltyRep || 0));

  state.cash += finalCash;
  state.rep += finalRep;
  state.jobsCompleted += 1;
  state.leaguePoints += finalRep + (cleanJob ? 15 : 0);

  if (job.isTutorial) {
    state.tutorialDone = true;
    state.tutorialStep = 6;
    state.goldGears += 3;
    showToast('🎓 Tutorial Complete! +3 Bonus Gold Gears awarded!');
  } else if (cleanJob) {
    state.cleanStreak += 1;
    if (state.cleanStreak % 3 === 0) {
      state.goldGears += 2;
      showToast(`🔥 ${state.cleanStreak}-Job Clean Streak! +2 Gold Gears earned!`);
    } else {
      showToast(`✅ Clean Service! +$${finalCash} | +${finalRep} REP`);
    }
  } else {
    state.cleanStreak = 0;
    showToast(`⚠️ Job Closed with Penalties: +$${finalCash} | +${finalRep} REP`);
  }

  state.activeJob = null;
  refreshDispatchBoard(true);
  saveState();
  switchView('dispatch');
  renderAll();
}

/* ==========================================================================
   SHOP, RIG UPGRADES, CARGO & REWARDED ADS
   ========================================================================== */
function restockCargo(type) {
  const rig = getRig();
  const totalCargo = state.tiresInCargo + Math.ceil(state.plugsInCargo / 4);
  if (totalCargo >= rig.cargoMax) {
    showToast(`Rig cargo full (${rig.cargoMax} slots max). Upgrade Rig Tier for more capacity!`);
    return;
  }
  if (type === 'tire') {
    const cost = 35;
    if (state.cash < cost) return showToast('Not enough cash ($35 needed).');
    state.cash -= cost;
    state.tiresInCargo += 1;
    showToast('🛞 Loaded +1 Replacement Tire into rig.');
  } else if (type === 'plug') {
    const cost = 20;
    if (state.cash < cost) return showToast('Not enough cash ($20 needed).');
    state.cash -= cost;
    state.plugsInCargo += 4;
    showToast('🩹 Loaded +4 Heavy-Duty Tire Plugs.');
  }
  saveState();
  renderAll();
}

function upgradeRig() {
  if (state.rigLevel >= RIG_TIERS.length) return;
  const nextRig = RIG_TIERS[state.rigLevel];
  if (state.cash < nextRig.cost) {
    showToast(`Need $${nextRig.cost} cash to unlock ${nextRig.name}.`);
    return;
  }
  state.cash -= nextRig.cost;
  state.rigLevel += 1;
  showToast(`🚚 Upgraded to ${nextRig.name} (${nextRig.cargoMax} Cargo Slots)!`);
  saveState();
  renderAll();
}

function upgradeTool(toolKey) {
  const tool = state.tools[toolKey];
  if (!tool || tool.level >= tool.max) return;
  const gearCost = 2 + Math.floor(tool.level / 2);
  if (state.goldGears < gearCost) {
    showToast(`Need ${gearCost} ⚙️ Gold Gears to upgrade ${toolKey.toUpperCase()}.`);
    return;
  }
  state.goldGears -= gearCost;
  tool.level += 1;
  showToast(`⚙️ Upgraded ${toolKey.toUpperCase()} to Lv.${tool.level}!`);
  saveState();
  renderAll();
}

function changeZone(delta) {
  const nextId = state.zoneId + delta;
  const target = ZONES.find(z => z.id === nextId);
  if (!target) return;
  if (state.rep < target.minRep) {
    showToast(`Requires ${target.minRep} REP to unlock ${target.name}.`);
    return;
  }
  state.zoneId = nextId;
  refreshDispatchBoard(true);
  saveState();
  renderAll();
}

function claimRewardedAdSupply() {
  state.goldGears += 3;
  state.cash += 75;
  showToast('📺 Sponsored Supply Drop: +$75 Cash & +3 ⚙️ Gold Gears!');
  saveState();
  renderAll();
}

/* ==========================================================================
   VIEW NAVIGATION & RENDERING
   ========================================================================== */
function switchView(viewName) {
  document.querySelectorAll('[data-view]').forEach(sec => {
    sec.style.display = (sec.getAttribute('data-view') === viewName) ? 'block' : 'none';
  });
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === viewName);
  });
  if (viewName === 'bay') renderBay();
}

function renderTopHud() {
  const rig = getRig();
  const z = getZone();
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('hud-cash', `$${state.cash.toLocaleString()}`);
  setTxt('hud-gears', `${state.goldGears}`);
  setTxt('hud-rep', `${state.rep} REP`);
  setTxt('hud-streak', `${state.cleanStreak}🔥`);
  setTxt('hud-rig', `${rig.icon} ${rig.name}`);
  setTxt('hud-zone', `Zone ${z.id}: ${z.name} (${z.mult.toFixed(2)}x)`);
  setTxt('hud-cargo', `Tires: ${state.tiresInCargo} | Plugs: ${state.plugsInCargo} (Cap ${rig.cargoMax})`);
}

function renderDispatch() {
  const list = document.getElementById('dispatch-list');
  if (!list) return;
  refreshDispatchBoard(false);

  const tutBanner = !state.tutorialDone
    ? `<div style="background:rgba(56,189,248,0.14);border:1px solid #38bdf8;border-radius:12px;padding:12px;margin-bottom:10px;">
         <strong>🎓 New Operator Orientation</strong>
         <div style="font-size:12px;margin:4px 0 8px;">Run the 6-step roadside training call for +3 Gold Gears.</div>
         <button type="button" class="primary-btn" data-action="start-tutorial">START TRAINING CALL</button>
       </div>`
    : '';

  const cards = state.boardJobs.map(j => {
    const condBadge = j.cond === 'rain' ? '🌧️ RAIN (+25%)' : (j.cond === 'night' ? '🌙 NIGHT (+18%)' : '☀️ CLEAR');
    const vipBadge = j.isVip ? '<span style="color:#facc15;font-weight:800;">★ VIP FLEET</span> • ' : '';
    const hazardHints = [
      j.hasLock ? '🔑 Wheel Lock' : '',
      j.seizedLugs.length ? `🛢️ ${j.seizedLugs.length} Seized Lug${j.seizedLugs.length > 1 ? 's' : ''}` : ''
    ].filter(Boolean).join(' • ');

    return `
      <div class="job-card" style="border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:10px;background:#0f172a;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${vipBadge}${j.veh.name}</strong>
          <span style="color:#34d399;font-weight:800;">+$${j.payout}</span>
        </div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;">
          ${condBadge} • Target ${j.veh.targetPsi} PSI • +${j.repReward} REP
        </div>
        ${hazardHints ? `<div style="font-size:11px;color:#fbbf24;margin-top:4px;">${hazardHints}</div>` : ''}
        <button type="button" class="primary-btn" style="margin-top:8px;width:100%;" data-action="accept-job" data-job-id="${j.id}">
          DISPATCH TO CALL
        </button>
      </div>
    `;
  }).join('');

  list.innerHTML = tutBanner + cards;
}

function renderBay() {
  const job = state.activeJob;
  const emptyEl = document.getElementById('bay-empty');
  const activeEl = document.getElementById('bay-active');
  if (!emptyEl || !activeEl) return;

  if (!job) {
    emptyEl.style.display = 'block';
    activeEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  activeEl.style.display = 'block';

  renderAlertBanner();
  updateShoulderTrafficBanner(job);
  renderBayTimerOnly();

  const headerEl = document.getElementById('bay-job-title');
  if (headerEl) {
    const condTag = job.cond === 'rain' ? '🌧️ RAIN' : (job.cond === 'night' ? '🌙 NIGHT' : '☀️ DAY');
    headerEl.textContent = `${job.veh.name} • ${condTag} • ${job.veh.targetPsi} PSI`;
  }

  const ctrl = document.getElementById('bay-controls');
  if (!ctrl) return;

  // STEP 1: Cones -> Chocks -> Hydraulic Jack
  if (job.step === 1) {
    ctrl.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        <strong>Step 1: Roadside Safety & Lift</strong> (Deploy cones first to block traffic windblast!)
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <button type="button" class="primary-btn" data-action="set-cones" ${job.conesSet ? 'disabled' : ''}>
          ${job.conesSet ? '✅ CONES SET' : '1. SET CONES'}
        </button>
        <button type="button" class="primary-btn" data-action="set-chocks" ${job.chocksSet ? 'disabled' : ''}>
          ${job.chocksSet ? '✅ CHOCKS SET' : '2. WHEEL CHOCKS'}
        </button>
      </div>
      <button type="button" class="primary-btn" style="width:100%;" data-action="pump-jack">
        3. PUMP HYDRAULIC JACK (${job.jackPumps}/${job.jackPumpsNeeded})
      </button>
    `;
    return;
  }

  // STEP 2: Security Wheel Lock + Penetrating Oil Soak + 5-Lug Removal
  if (job.step === 2) {
    const seizedCount = hasSeizedLugs(job) ? job.seizedLugs.length : 0;
    const isSoaking = job.oilSoakingUntil && Date.now() < job.oilSoakingUntil;

    const lockBtn = !job.lockKeyApplied
      ? `<button type="button" class="primary-btn" data-action="apply-lock-key"
           style="width:100%;margin-bottom:8px;background:#7c3aed;border-color:#c4b5fd;">
           🔑 ENGAGE SECURITY WHEEL LOCK KEY
         </button>`
      : '';

    const oilBtn = seizedCount > 0
      ? `<button type="button" class="primary-btn" data-action="spray-oil"
           style="width:100%;margin-bottom:8px;background:#b45309;border-color:#fde047;">
           🛢️ PENETRATING OIL SOAK (${seizedCount} SEIZED LUG${seizedCount > 1 ? 'S' : ''})
         </button>`
      : '';

    const soakStatus = isSoaking
      ? `<div style="font-size:12px;color:#fde047;margin-bottom:6px;font-weight:700;">⏳ Penetrating oil soaking into threads...</div>`
      : '';

    const lugButtons = job.lugsOff.map((off, idx) => {
      const isSeized = job.seizedLugs.includes(idx);
      const label = off
        ? `✅ #${idx + 1}`
        : (isSeized ? `🛢️ #${idx + 1} RUST` : `🔩 LUG #${idx + 1}`);
      return `
        <button type="button" class="primary-btn" data-action="remove-lug" data-idx="${idx}" ${off ? 'disabled' : ''}
          style="${isSeized && !off ? 'border-color:#facc15;color:#fef08a;' : ''}">
          ${label}
        </button>
      `;
    }).join('');

    ctrl.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        <strong>Step 2: Remove 5 Lug Nuts</strong>
      </div>
      ${lockBtn}
      ${oilBtn}
      ${soakStatus}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${lugButtons}
      </div>
    `;
    return;
  }

  // STEP 3: Damage Inspection & Plug vs. Tire Swap
  if (job.step === 3) {
    const diagInfo = job.inspected
      ? `<div style="background:#1e293b;padding:10px;border-radius:10px;margin-bottom:8px;font-size:12px;">
           <strong>Diagnosis: ${job.dmg.label}</strong>
           <div style="color:#cbd5e1;margin-top:4px;">${job.dmg.desc}</div>
         </div>`
      : `<button type="button" class="primary-btn" style="width:100%;margin-bottom:8px;" data-action="inspect-tire">
           🔍 SCAN TREAD & SIDEWALL DAMAGE
         </button>`;

    ctrl.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        <strong>Step 3: Diagnose & Service Tire</strong>
      </div>
      ${diagInfo}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button type="button" class="primary-btn" data-action="repair-plug">
          🩹 PLUG PUNCTURE (${state.plugsInCargo})
        </button>
        <button type="button" class="primary-btn" data-action="repair-swap">
          🛞 SWAP NEW TIRE (${state.tiresInCargo})
        </button>
      </div>
    `;
    return;
  }

  // STEP 4: Stubborn Tire Bead Seater + PSI Inflation
  if (job.step === 4) {
    const beadBlastHtml = job.unseatedBead
      ? `<button type="button" class="primary-btn" data-action="blast-bead"
           style="width:100%;background:#ea580c;border-color:#fdba74;margin-bottom:8px;">
           💥 BLAST AIR BEAD SEATER (SEAT TIRE ON RIM)
         </button>`
      : '';

    ctrl.innerHTML = `
      ${beadBlastHtml}
      <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">
        <strong>Step 4: Calibrate Pressure (±2 PSI of ${job.veh.targetPsi} PSI)</strong>
      </div>
      <div id="psi-live-readout" style="font-size:18px;font-weight:900;text-align:center;margin:6px 0;color:#38bdf8;">
        ${job.psi} / ${job.veh.targetPsi} PSI
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <button type="button" class="primary-btn" data-hold-psi="-1">➖ BLEED AIR</button>
        <button type="button" class="primary-btn" data-hold-psi="1">➕ HOLD INFLATE</button>
      </div>
      <button type="button" class="primary-btn" style="width:100%;" data-action="lock-psi">
        ✅ LOCK OEM PRESSURE
      </button>
    `;
    return;
  }

  // STEP 5: Star-Pattern Torquing + Lower Jack Stowage
  if (job.step === 5) {
    const nextStarLug = STAR_ORDER[job.torquedCount];
    const allTorqued = job.torquedCount >= 5;

    const torqueBtns = job.lugsTorqued.map((done, idx) => {
      const isNext = !allTorqued && idx === nextStarLug;
      return `
        <button type="button" class="primary-btn" data-action="torque-lug" data-idx="${idx}" ${done ? 'disabled' : ''}
          style="${isNext ? 'border:2px solid #34d399;box-shadow:0 0 10px rgba(52,211,153,0.4);' : ''}">
          ${done ? `✅ #${idx + 1}` : (isNext ? `⭐ #${idx + 1}` : `🔩 #${idx + 1}`)}
        </button>
      `;
    }).join('');

    const lowerBtn = allTorqued
      ? `<button type="button" class="primary-btn" style="width:100%;margin-top:8px;background:#059669;" data-action="lower-jack">
           ⬇️ LOWER JACK, STOW CONES & COLLECT PAYOUT
         </button>`
      : '';

    ctrl.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        <strong>Step 5: Star-Pattern Torque (${job.torquedCount}/5)</strong>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${torqueBtns}
      </div>
      ${lowerBtn}
    `;
  }
}

function renderGarage() {
  const el = document.getElementById('garage-panel');
  if (!el) return;
  const rig = getRig();
  const nextRig = RIG_TIERS[state.rigLevel] || null;

  const toolRows = Object.entries(state.tools).map(([key, t]) => {
    const cost = 2 + Math.floor(t.level / 2);
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1e293b;">
        <div>
          <strong style="text-transform:uppercase;">${key}</strong>
          <div style="font-size:11px;color:#94a3b8;">Level ${t.level} / ${t.max}</div>
        </div>
        <button type="button" class="primary-btn" data-action="upgrade-tool" data-tool="${key}" ${t.level >= t.max ? 'disabled' : ''}>
          ${t.level >= t.max ? 'MAXED' : `UPGRADE (${cost} ⚙️)`}
        </button>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div style="padding:12px;border:1px solid #334155;border-radius:12px;margin-bottom:10px;background:#0f172a;">
      <strong>${rig.icon} ${rig.name}</strong>
      <div style="font-size:12px;color:#94a3b8;margin:4px 0 8px;">
        Cargo Capacity: ${rig.cargoMax} slots • Speed Multiplier: ${rig.speedBonus.toFixed(2)}x
      </div>
      ${nextRig
        ? `<button type="button" class="primary-btn" style="width:100%;" data-action="upgrade-rig">
             UPGRADE TO ${nextRig.name.toUpperCase()} ($${nextRig.cost.toLocaleString()})
           </button>`
        : '<div style="color:#34d399;font-size:12px;font-weight:700;">★ MAX FLEET RIG UNLOCKED</div>'}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <button type="button" class="primary-btn" data-action="restock-tire">
        🛞 +1 TIRE ($35)
      </button>
      <button type="button" class="primary-btn" data-action="restock-plug">
        🩹 +4 PLUGS ($20)
      </button>
    </div>

    <div style="padding:12px;border:1px solid #334155;border-radius:12px;margin-bottom:10px;background:#0f172a;">
      <div style="font-weight:800;margin-bottom:6px;">⚙️ Gold Gear Tool Upgrades</div>
      ${toolRows}
    </div>

    <button type="button" class="primary-btn" style="width:100%;background:#1d4ed8;" data-action="watch-ad">
      📺 WATCH SPONSORED SUPPLY DROP (+$75 & +3 ⚙️)
    </button>
  `;
}

function renderAll() {
  renderTopHud();
  renderDispatch();
  renderBay();
  renderGarage();
}

/* ==========================================================================
   DELEGATED MOBILE-FIRST INPUT HANDLERS
   ========================================================================== */
document.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-nav]');
  if (navBtn) {
    switchView(navBtn.getAttribute('data-nav'));
    return;
  }

  const actBtn = e.target.closest('[data-action]');
  if (!actBtn) return;

  const action = actBtn.getAttribute('data-action');
  switch (action) {
    case 'dismiss-alert':   dismissAlert(); break;
    case 'start-tutorial':  startTutorialJob(); break;
    case 'accept-job':      acceptJob(actBtn.getAttribute('data-job-id')); break;
    case 'set-cones':       handleSetCones(); break;
    case 'set-chocks':      handleSetChocks(); break;
    case 'pump-jack':       handlePumpJack(); break;
    case 'apply-lock-key':  handleApplyLockKey(); break;
    case 'spray-oil':       sprayPenetratingOil(); break;
    case 'remove-lug':      handleRemoveLug(Number(actBtn.getAttribute('data-idx'))); break;
    case 'inspect-tire':    handleInspectTire(); break;
    case 'repair-plug':     performRepair('plug'); break;
    case 'repair-swap':     performRepair('swap'); break;
    case 'blast-bead':      blastTireBead(); break;
    case 'lock-psi':        handleLockPsi(); break;
    case 'torque-lug':      handleTorqueLug(Number(actBtn.getAttribute('data-idx'))); break;
    case 'lower-jack':      handleLowerJackAndComplete(); break;
    case 'restock-tire':    restockCargo('tire'); break;
    case 'restock-plug':    restockCargo('plug'); break;
    case 'upgrade-rig':     upgradeRig(); break;
    case 'upgrade-tool':    upgradeTool(actBtn.getAttribute('data-tool')); break;
    case 'watch-ad':        claimRewardedAdSupply(); break;
    case 'zone-prev':       changeZone(-1); break;
    case 'zone-next':       changeZone(1); break;
    case 'refresh-board':   refreshDispatchBoard(true); renderDispatch(); break;
  }
});

document.addEventListener('pointerdown', (e) => {
  const holdBtn = e.target.closest('[data-hold-psi]');
  if (holdBtn) {
    startHoldPsi(Number(holdBtn.getAttribute('data-hold-psi')));
  }
});

['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
  document.addEventListener(evt, stopHoldPsi);
});

window.addEventListener('DOMContentLoaded', () => {
  refreshDispatchBoard(false);
  if (state.activeJob) startBayTimer();
  switchView('dispatch');
  renderAll();
});
