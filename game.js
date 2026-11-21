/* ==========================================================================
   DELWIN MOBILE: ROADSIDE TIRE RESCUE — GAME ENGINE (game.js)
   Exact DOM Alignment with index.html (#page-dispatch, #page-bay, #page-garage,
   #page-zones, #page-league, #job-list, #bay-stage, #lug-ring, #tool-list, etc.)
   Includes:
   - Shoulder Traffic Pass-By Alerts & Windblast Hazards
   - Seized / Swollen Lug Oil Soak
   - Stubborn Tire Bead Seater
   - Full 5-Step Repair Bay + Security Wheel Locks + Lower Jack Stowage
   - 6-Tier Rig Progression, 24 Georgia Zones, Weekly League & Clean-Streak Gear
   ========================================================================== */

'use strict';

const STORAGE_KEY = 'delwin_mobile_tire_rescue_v2026_11';

const RIG_TIERS = [
  { level: 1, name: 'Service Sedan',      badge: 'TIER 1', cargoMax: 2,  cost: 0,     perk: 'Base dispatch speed • 2 tire capacity',     img: 'assets/rig_t1.png', icon: '🚗' },
  { level: 2, name: 'Roadside SUV',       badge: 'TIER 2', cargoMax: 4,  cost: 450,   perk: '+12% payout speed • 4 tire capacity',       img: 'assets/rig_t2.png', icon: '🚙' },
  { level: 3, name: 'Utility Pickup',     badge: 'TIER 3', cargoMax: 6,  cost: 1200,  perk: 'Fast penetrating oil • 6 tire capacity',    img: 'assets/rig_t3.png', icon: '🛻' },
  { level: 4, name: 'Sprinter Tire Van',  badge: 'TIER 4', cargoMax: 10, cost: 2800,  perk: 'Commercial van access • 10 tire capacity',  img: 'assets/rig_t4.png', icon: '🚐' },
  { level: 5, name: 'Dually Flatbed',     badge: 'TIER 5', cargoMax: 14, cost: 6000,  perk: 'Heavy truck service • 14 tire capacity',    img: 'assets/rig_t5.png', icon: '🚚' },
  { level: 6, name: 'Heavy Fleet Rig',    badge: 'TIER 6', cargoMax: 20, cost: 12500, perk: 'Max fleet multiplier • 20 tire capacity',   img: 'assets/rig_t6.png', icon: '🚛' }
];

const ZONES = [
  { id: 1,  name: 'I-285 NORTH PERIMETER',        mult: 1.00, minRep: 0,    trafficRate: 0.05 },
  { id: 2,  name: 'LAWRENCEVILLE HWY / LILBURN',  mult: 1.08, minRep: 40,   trafficRate: 0.05 },
  { id: 3,  name: 'I-85 SPAGHETTI JUNCTION',      mult: 1.15, minRep: 90,   trafficRate: 0.07 },
  { id: 4,  name: 'DECATUR / STONE MTN FWY',      mult: 1.22, minRep: 150,  trafficRate: 0.06 },
  { id: 5,  name: 'NORCROSS / PEACHTREE IND.',    mult: 1.30, minRep: 220,  trafficRate: 0.06 },
  { id: 6,  name: 'DULUTH / GWINNETT PLACE',      mult: 1.38, minRep: 300,  trafficRate: 0.06 },
  { id: 7,  name: 'MIDTOWN CONNECTOR I-75/85',    mult: 1.46, minRep: 400,  trafficRate: 0.08 },
  { id: 8,  name: 'PERIMETER / SANDY SPRINGS',    mult: 1.54, minRep: 520,  trafficRate: 0.07 },
  { id: 9,  name: 'BUCKHEAD / GA-400 CORRIDOR',   mult: 1.62, minRep: 650,  trafficRate: 0.07 },
  { id: 10, name: 'I-20 EAST / CONYERS',          mult: 1.70, minRep: 800,  trafficRate: 0.07 },
  { id: 11, name: 'HARTSFIELD AIRPORT I-85 S',    mult: 1.80, minRep: 980,  trafficRate: 0.08 },
  { id: 12, name: 'MARIETTA / I-75 NORTH',        mult: 1.90, minRep: 1180, trafficRate: 0.07 },
  { id: 13, name: 'ALPHARETTA / WINDWARD',        mult: 2.00, minRep: 1400, trafficRate: 0.07 },
  { id: 14, name: 'BUFORD / MALL OF GEORGIA',     mult: 2.12, minRep: 1650, trafficRate: 0.07 },
  { id: 15, name: 'LITHONIA / INDUSTRIAL BLVD',   mult: 2.24, minRep: 1920, trafficRate: 0.08 },
  { id: 16, name: 'SMYRNA / VININGS I-285 W',     mult: 2.36, minRep: 2220, trafficRate: 0.08 },
  { id: 17, name: 'KENNESAW / BARRETT PKWY',      mult: 2.50, minRep: 2550, trafficRate: 0.07 },
  { id: 18, name: 'MCDONOUGH / I-75 LOGISTICS',   mult: 2.65, minRep: 2900, trafficRate: 0.09 },
  { id: 19, name: 'DOUGLASVILLE / I-20 WEST',     mult: 2.80, minRep: 3300, trafficRate: 0.08 },
  { id: 20, name: 'GAINESVILLE / I-985 NORTH',    mult: 2.95, minRep: 3750, trafficRate: 0.08 },
  { id: 21, name: 'NEWNAN / I-85 SOUTH FREIGHT',  mult: 3.12, minRep: 4250, trafficRate: 0.09 },
  { id: 22, name: 'CARTERSVILLE / HWY 411',       mult: 3.30, minRep: 4800, trafficRate: 0.08 },
  { id: 23, name: 'COVINGTON / I-20 EASTBOUND',   mult: 3.50, minRep: 5400, trafficRate: 0.09 },
  { id: 24, name: 'METRO FREIGHT MEGA-CORRIDOR',  mult: 3.75, minRep: 6100, trafficRate: 0.10 }
];

const VEHICLES = [
  { id: 'sedan',    name: 'Compact Sedan',      targetPsi: 35, basePay: 65,  heavy: false, minRig: 1, img: 'assets/veh_sedan.png', icon: '🚗' },
  { id: 'suv',      name: 'Midsize SUV',        targetPsi: 38, basePay: 80,  heavy: false, minRig: 1, img: 'assets/veh_suv.png',   icon: '🚙' },
  { id: 'pickup',   name: '1500 Crew Pickup',   targetPsi: 42, basePay: 95,  heavy: false, minRig: 2, img: 'assets/veh_truck.png', icon: '🛻' },
  { id: 'sprinter', name: 'Delivery Van',       targetPsi: 55, basePay: 120, heavy: true,  minRig: 3, img: 'assets/veh_van.png',   icon: '🚐' },
  { id: 'boxtruck', name: '26ft Box Truck',     targetPsi: 85, basePay: 165, heavy: true,  minRig: 4, img: 'assets/veh_box.png',   icon: '🚚' },
  { id: 'semi',     name: '18-Wheeler Tractor', targetPsi: 105,basePay: 230, heavy: true,  minRig: 5, img: 'assets/veh_semi.png',  icon: '🚛' }
];

const DAMAGE_TYPES = [
  { id: 'nail',     label: 'Center Tread Nail Puncture',      action: 'plug', desc: 'Clean puncture in center tread crown — safe to plug.' },
  { id: 'screw',    label: 'Tread Groove Sheet-Metal Screw', action: 'plug', desc: 'Single puncture inside repairable belt zone — plug approved.' },
  { id: 'sidewall', label: 'Sidewall Pinch / Bubble',         action: 'swap', desc: 'Structural sidewall failure — DO NOT PLUG. Full tire swap required.' },
  { id: 'blowout',  label: 'Shredded Belt Blowout',           action: 'swap', desc: 'Tread separation & exposed steel cords — full replacement required.' }
];

const STAR_ORDER = [0, 2, 4, 1, 3];

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
  surgeCount: 0,
  leaguePoints: 0,
  tutorialDone: false,
  tutorialStep: 0,
  tools: {
    jack:   { label: 'Hydraulic Floor Jack', level: 1, max: 12 },
    impact: { label: 'Pneumatic Impact Gun', level: 1, max: 12 },
    comp:   { label: 'High-Flow Compressor', level: 1, max: 12 },
    torque: { label: 'Digital Torque Wrench', level: 1, max: 12 }
  },
  boardJobs: [],
  activeJob: null
};

let state = loadState();
let bayTimerInterval = null;
let psiHoldInterval = null;

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

function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function showToast(msg) {
  let el = document.getElementById('game-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'game-toast';
    el.style.cssText = [
      'position:fixed;bottom:84px;left:50%;transform:translateX(-50%);',
      'background:#0f172a;color:#f8fafc;border:1px solid #38bdf8;',
      'padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;',
      'z-index:9999;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.5);',
      'max-width:90vw;text-align:center;'
    ].join('');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 2400);
}

function showDiagAlert(title, msg) {
  const box = document.getElementById('diag-alert');
  if (!box) {
    showToast(`${title}: ${msg}`);
    return;
  }
  box.classList.remove('hidden');
  box.style.display = 'block';
  setTxt('diag-alert-title', title);
  setTxt('diag-alert-msg', msg);
}

function hideDiagAlert() {
  const box = document.getElementById('diag-alert');
  if (box) {
    box.classList.add('hidden');
    box.style.display = 'none';
  }
}

/* ==========================================================================
   JOB GENERATION (WITH SEIZED LUGS & SECURITY WHEEL LOCKS)
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
  const surgeMult = (state.surgeCount >= 3) ? 2.0 : 1.0;
  const payout = Math.round(veh.basePay * z.mult * condMult * vipMult * surgeMult);
  const repReward = Math.round((14 + z.id * 2) * condMult * (isVip ? 1.3 : 1.0));
  const timeLimit = isTutorial ? 180 : Math.max(55, 95 - Math.floor(z.id * 1.1));

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

    // Step 1: Cones -> Chocks -> Jack
    step: 1,
    conesSet: false,
    chocksSet: false,
    jackPumps: 0,
    jackPumpsNeeded: 4,
    jackRaised: false,

    // Step 2: Wheel Lock + Seized Oil Soak + 5 Lugs
    hasLock,
    lockKeyApplied: !hasLock,
    seizedLugs,
    oilAppliedLugs: [],
    oilSoakingUntil: 0,
    lugsOff: [false, false, false, false, false],
    wheelOff: false,

    // Step 3: Scan & Repair
    inspected: false,
    repaired: false,

    // Step 4: PSI & Stubborn Bead
    psi: 12,
    unseatedBead: false,

    // Step 5: Star Torque & Lower Jack
    lugsTorqued: [false, false, false, false, false],
    torquedCount: 0,
    jackLowered: false,

    // Hazard #1: Shoulder Traffic Pass-By
    trafficAlertText: '',
    trafficAlertUntil: 0
  };
}

function refreshDispatchBoard(force = false) {
  if (!force && Array.isArray(state.boardJobs) && state.boardJobs.length >= 3) return;
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
    if (stage && stage.parentNode === bayActive) bayActive.insertBefore(banner, stage);
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
    showDiagAlert(
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
  hideDiagAlert();

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
    showDiagAlert(
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
  hideDiagAlert();

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
    showToast('Finish your active roadside call in the Repair Bay first!');
    switchView('bay');
    return;
  }
  const idx = state.boardJobs.findIndex(j => j.id === jobId);
  if (idx === -1) return;
  const job = state.boardJobs.splice(idx, 1)[0];
  state.activeJob = job;
  hideDiagAlert();
  saveState();
  startBayTimer();
  switchView('bay');
  renderAll();
}

function startTutorialJob() {
  state.activeJob = createJob({ isTutorial: true });
  state.tutorialStep = 1;
  hideDiagAlert();
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

      const z = getZone();
      const passRate = z.trafficRate || 0.06;
      if (job.timeLeft < job.timeLimit - 6 && Math.random() < passRate) {
        triggerShoulderPassBy(job);
      }

      if (job.timeLeft <= 0) {
        addBayPenalty(job, 20, 'Response SLA timer expired', 10);
        showDiagAlert('DISPATCH SLA EXPIRED (-$20 / -10 REP)', 'Customer wait threshold exceeded. Complete the repair cleanly to salvage payout!');
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
  hideDiagAlert();
  if (job.isTutorial && state.tutorialStep === 1) state.tutorialStep = 2;
  saveState();
  renderBay();
}

function handleSetChocks() {
  const job = state.activeJob;
  if (!job || job.chocksSet) return;
  job.chocksSet = true;
  hideDiagAlert();
  saveState();
  renderBay();
}

function handlePumpJack() {
  const job = state.activeJob;
  if (!job || job.jackRaised) return;

  if (!job.conesSet || !job.chocksSet) {
    addBayPenalty(job, 12, 'Safety violation: Lifted vehicle before setting cones & wheel chocks', 6);
    showDiagAlert(
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
  hideDiagAlert();
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
    showDiagAlert(
      'SECURITY WHEEL LOCK (-$10 / -5 REP)',
      'Engage the 🔑 WHEEL LOCK KEY ADAPTER before impacting lugs off!'
    );
    renderBay();
    return;
  }

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
  const beam = document.getElementById('scan-beam');
  if (beam) {
    beam.classList.remove('hidden');
    setTimeout(() => beam.classList.add('hidden'), 900);
  }
  saveState();
  renderBay();
}

function performRepair(choice) {
  const job = state.activeJob;
  if (!job || !job.wheelOff || job.repaired) return;

  if (!job.inspected) {
    showDiagAlert('INSPECT TIRE FIRST', 'Run the Tire Tread & Sidewall Scan before choosing Plug vs. Swap.');
    return;
  }

  if (choice !== job.dmg.action) {
    addBayPenalty(job, 18, `Misdiagnosed ${job.dmg.label} (chose ${choice.toUpperCase()} instead of ${job.dmg.action.toUpperCase()})`, 9);
    showDiagAlert(
      'WRONG REPAIR METHOD (-$18 / -9 REP)',
      `${job.dmg.desc}`
    );
    renderBay();
    return;
  }

  if (choice === 'plug') {
    if (state.plugsInCargo <= 0) {
      showDiagAlert('OUT OF PLUG KITS', 'Restock Plug Kits in the Garage tab!');
      return;
    }
    state.plugsInCargo -= 1;
    job.unseatedBead = false;
  } else {
    if (state.tiresInCargo <= 0) {
      showDiagAlert('OUT OF SPARE TIRES', 'Load replacement tires into your rig cargo in the Garage tab!');
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
  hideDiagAlert();
  if (job.isTutorial && state.tutorialStep === 4) state.tutorialStep = 5;
  saveState();
  renderBay();
}

function applyPsiTick(delta) {
  const job = state.activeJob;
  if (!job || job.step !== 4) return;

  if (job.unseatedBead && delta > 0) {
    stopHoldPsi();
    job.psi = Math.min(14, job.psi + 1);
    updateLivePsiMeter(job);
    showDiagAlert(
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
    showDiagAlert('BEAD NOT SEATED', 'Tap 💥 BLAST AIR BEAD SEATER first so the tire seals onto the rim.');
    return;
  }

  const diff = Math.abs(job.psi - job.veh.targetPsi);
  if (diff > 2) {
    addBayPenalty(job, 10, `PSI off OEM spec (${job.psi} vs ${job.veh.targetPsi} PSI)`, 5);
    showDiagAlert(
      'PSI OUT OF SPEC (-$10 / -5 REP)',
      `Calibrate within ±2 PSI of ${job.veh.targetPsi} PSI before locking pressure.`
    );
    renderBay();
    return;
  }

  job.step = 5;
  hideDiagAlert();
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
    showDiagAlert(
      'STAR TORQUE SEQUENCE ERROR (-$9 / -4 REP)',
      `Follow the highlighted star-pattern lug (#${expectedIdx + 1}) to prevent rotor warp!`
    );
    renderBay();
    return;
  }

  job.lugsTorqued[idx] = true;
  job.torquedCount += 1;
  hideDiagAlert();
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

  if (state.surgeCount >= 3) {
    state.surgeCount = 0;
  } else {
    state.surgeCount += 1;
  }

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
   SHOP, RIG UPGRADES, CARGO & ZONES
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
    showToast(`Need ${gearCost} ⚙️ Gold Gears to upgrade ${tool.label}.`);
    return;
  }
  state.goldGears -= gearCost;
  tool.level += 1;
  showToast(`⚙️ Upgraded ${tool.label} to Lv.${tool.level}!`);
  saveState();
  renderAll();
}

function selectZone(zoneId) {
  const target = ZONES.find(z => z.id === zoneId);
  if (!target) return;
  if (state.rep < target.minRep) {
    showToast(`Requires ${target.minRep} REP to unlock ${target.name}.`);
    return;
  }
  state.zoneId = zoneId;
  refreshDispatchBoard(true);
  saveState();
  switchView('dispatch');
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
   VIEW NAVIGATION (EXACT #page-* + .hidden / .active ALIGNMENT)
   ========================================================================== */
function switchView(viewName) {
  const pages = document.querySelectorAll('.page, [id^="page-"]');
  pages.forEach(p => {
    const isMatch = p.id === `page-${viewName}`;
    p.classList.toggle('active', isMatch);
    p.classList.toggle('hidden', !isMatch);
    p.style.display = isMatch ? '' : 'none';
  });

  document.querySelectorAll('.nav-btn, [data-nav]').forEach(btn => {
    const target = btn.getAttribute('data-nav');
    if (target) btn.classList.toggle('active', target === viewName);
  });

  const drawer = document.getElementById('menu-drawer');
  if (drawer) drawer.classList.add('hidden');

  if (viewName === 'bay') renderBay();
  if (viewName === 'garage') renderGarage();
  if (viewName === 'zones') renderZones();
  if (viewName === 'league') renderLeague();
}

/* ==========================================================================
   RENDER FUNCTIONS BOUND TO EXACT index.html ELEMENT IDS
   ========================================================================== */
function renderTopHud() {
  const z = getZone();
  setTxt('hud-cash', `$${state.cash.toLocaleString()}`);
  setTxt('hud-gears', `${state.goldGears}`);
  setTxt('hud-tokens', `${state.tokens}`);
  setTxt('hud-rep', `${state.rep}`);
  setTxt('dispatch-zone-label', `${z.name} (${z.mult}x)`);
  setTxt('stock-plugs', `${state.plugsInCargo}`);
  setTxt('stock-tires', `${state.tiresInCargo}`);

  const surgeEl = document.getElementById('surge-pill') || document.querySelector('.surge-badge, .surge-pill');
  if (surgeEl) {
    surgeEl.textContent = state.surgeCount >= 3 ? '2X SURGE ACTIVE!' : `2X SURGE (${state.surgeCount}/3)`;
  }
}

function renderDispatch() {
  const list = document.getElementById('job-list');
  if (!list) return;
  refreshDispatchBoard(false);

  const tutBanner = !state.tutorialDone
    ? `<div class="job-card" style="border:1px solid #38bdf8;background:rgba(56,189,248,0.12);border-radius:12px;padding:12px;margin-bottom:10px;">
         <div style="font-weight:800;color:#7dd3fc;">🎓 NEW OPERATOR ORIENTATION</div>
         <div style="font-size:12px;color:#cbd5e1;margin:4px 0 8px;">Run the 6-step roadside training call for +3 Gold Gears.</div>
         <button type="button" class="primary-btn" data-action="start-tutorial" style="width:100%;">START TRAINING CALL</button>
       </div>`
    : '';

  const cards = state.boardJobs.map(j => {
    const condBadge = j.cond === 'rain' ? '🌧️ RAIN +25%' : (j.cond === 'night' ? '🌙 NIGHT +18%' : '☀️ CLEAR');
    const vipBadge = j.isVip ? '<span style="color:#facc15;font-weight:800;">★ VIP FLEET</span> • ' : '';
    const hazardHints = [
      j.hasLock ? '🔑 Wheel Lock' : '',
      j.seizedLugs.length ? `🛢️ ${j.seizedLugs.length} Seized Lug${j.seizedLugs.length > 1 ? 's' : ''}` : ''
    ].filter(Boolean).join(' • ');

    return `
      <div class="job-card" style="border:1px solid #1e293b;border-radius:12px;padding:12px;margin-bottom:10px;background:#0f172a;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${vipBadge}${j.veh.icon} ${j.veh.name}</strong>
          <span style="color:#34d399;font-weight:900;">+$${j.payout}</span>
        </div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;">
          ${condBadge} • Target ${j.veh.targetPsi} PSI • +${j.repReward} REP
        </div>
        ${hazardHints ? `<div style="font-size:11px;color:#fbbf24;margin-top:4px;">${hazardHints}</div>` : ''}
        <button type="button" class="primary-btn" style="margin-top:10px;width:100%;" data-action="accept-job" data-job-id="${j.id}">
          DISPATCH TO CALL
        </button>
      </div>
    `;
  }).join('');

  list.innerHTML = tutBanner + cards;
}

function renderBayStageVisuals(job) {
  const vehImg = document.getElementById('stage-veh-img');
  const vehFb = document.getElementById('stage-veh-fallback');
  if (vehImg && vehFb) {
    vehImg.src = job.veh.img;
    vehImg.onerror = () => { vehImg.style.display = 'none'; vehFb.style.display = 'block'; vehFb.textContent = job.veh.icon; };
    vehImg.onload = () => { vehImg.style.display = 'block'; vehFb.style.display = 'none'; };
  }

  const chockEl = document.getElementById('stage-chock');
  if (chockEl) chockEl.classList.toggle('hidden', !job.chocksSet);

  const jackEl = document.getElementById('stage-jack');
  if (jackEl) jackEl.classList.toggle('lifted', !!job.jackRaised);

  const chassisEl = document.getElementById('stage-chassis');
  if (chassisEl) chassisEl.style.transform = job.jackRaised ? 'translateY(-14px)' : 'translateY(0px)';

  const wheelWrap = document.getElementById('stage-wheel-wrap');
  if (wheelWrap) wheelWrap.style.opacity = (job.step === 3 && !job.repaired) ? '0.35' : '1';

  const lugRing = document.getElementById('lug-ring');
  if (lugRing) {
    lugRing.innerHTML = [0, 1, 2, 3, 4].map(idx => {
      const off = job.lugsOff[idx];
      const torqued = job.lugsTorqued[idx];
      const seized = job.seizedLugs.includes(idx);
      const cls = torqued ? 'lug torqued' : (off ? 'lug off' : (seized ? 'lug seized' : 'lug'));
      return `<span class="${cls}" data-lug="${idx}" title="Lug #${idx + 1}"></span>`;
    }).join('');
  }
}

function renderBay() {
  const job = state.activeJob;
  const emptyEl = document.getElementById('bay-empty');
  const activeEl = document.getElementById('bay-active');
  if (!emptyEl || !activeEl) return;

  if (!job) {
    emptyEl.classList.remove('hidden');
    emptyEl.style.display = '';
    activeEl.classList.add('hidden');
    activeEl.style.display = 'none';
    return;
  }

  emptyEl.classList.add('hidden');
  emptyEl.style.display = 'none';
  activeEl.classList.remove('hidden');
  activeEl.style.display = '';

  const condTag = job.cond === 'rain' ? '🌧️ RAIN' : (job.cond === 'night' ? '🌙 NIGHT' : '☀️ DAY');
  setTxt('bay-veh-tag', `${condTag} • ${job.zoneName}`);
  setTxt('bay-job-title', `${job.veh.name} (${job.veh.targetPsi} PSI)`);
  setTxt('bay-payout', `+$${Math.max(20, job.payout - (job.penaltyCash || 0))}`);

  renderBayTimerOnly();
  updateShoulderTrafficBanner(job);
  renderBayStageVisuals(job);

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
  const rig = getRig();
  const nextRig = RIG_TIERS[state.rigLevel] || null;

  setTxt('rig-name', rig.name);
  setTxt('rig-tier-badge', rig.badge);
  setTxt('rig-perk', `${rig.perk} • Cargo: ${state.tiresInCargo} Tires, ${state.plugsInCargo} Plugs`);

  const rigImg = document.getElementById('rig-img');
  const rigFb = document.getElementById('rig-fallback');
  if (rigImg && rigFb) {
    rigImg.src = rig.img;
    rigImg.onerror = () => { rigImg.style.display = 'none'; rigFb.style.display = 'block'; rigFb.textContent = rig.icon; };
    rigImg.onload = () => { rigImg.style.display = 'block'; rigFb.style.display = 'none'; };
  }

  const toolList = document.getElementById('tool-list');
  if (!toolList) return;

  const toolRows = Object.entries(state.tools).map(([key, t]) => {
    const cost = 2 + Math.floor(t.level / 2);
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid #1e293b;border-radius:10px;margin-bottom:8px;background:#0f172a;">
        <div>
          <strong>${t.label}</strong>
          <div style="font-size:11px;color:#94a3b8;">Level ${t.level} / ${t.max}</div>
        </div>
        <button type="button" class="primary-btn" data-action="upgrade-tool" data-tool="${key}" ${t.level >= t.max ? 'disabled' : ''}>
          ${t.level >= t.max ? 'MAXED' : `UPGRADE (${cost} ⚙️)`}
        </button>
      </div>
    `;
  }).join('');

  toolList.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <button type="button" class="primary-btn" data-action="restock-tire">🛞 +1 TIRE ($35)</button>
      <button type="button" class="primary-btn" data-action="restock-plug">🩹 +4 PLUGS ($20)</button>
    </div>
    ${nextRig
      ? `<button type="button" class="primary-btn" style="width:100%;margin-bottom:10px;background:#0284c7;" data-action="upgrade-rig">
           🚚 UPGRADE TO ${nextRig.name.toUpperCase()} ($${nextRig.cost.toLocaleString()})
         </button>`
      : ''}
    ${toolRows}
    <button type="button" class="primary-btn" style="width:100%;background:#1d4ed8;" data-action="watch-ad">
      📺 SPONSORED SUPPLY DROP (+$75 & +3 ⚙️)
    </button>
  `;
}

function renderZones() {
  const list = document.getElementById('zone-list');
  if (!list) return;

  list.innerHTML = ZONES.map(z => {
    const unlocked = state.rep >= z.minRep;
    const isCurrent = state.zoneId === z.id;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid ${isCurrent ? '#38bdf8' : '#1e293b'};border-radius:12px;margin-bottom:8px;background:#0f172a;">
        <div>
          <strong style="font-size:13px;">${z.id}. ${z.name}</strong>
          <div style="font-size:11px;color:#94a3b8;">Payout ${z.mult.toFixed(2)}x • Req ${z.minRep} REP</div>
        </div>
        <button type="button" class="primary-btn" data-action="select-zone" data-zone-id="${z.id}" ${!unlocked || isCurrent ? 'disabled' : ''}>
          ${isCurrent ? 'ACTIVE' : (unlocked ? 'DEPLOY' : `🔒 ${z.minRep} REP`)}
        </button>
      </div>
    `;
  }).join('');
}

function renderLeague() {
  const tierName = state.rep >= 2500 ? 'MASTER FLEET CAPTAIN' : (state.rep >= 800 ? 'GOLD DISPATCHER' : (state.rep >= 200 ? 'SILVER TECH' : 'BRONZE ROOKIE'));
  setTxt('league-tier-name', tierName);
  setTxt('league-rep', `${state.leaguePoints} PTS`);
  setTxt('league-rank', `#${Math.max(1, 25 - Math.floor(state.leaguePoints / 40))}`);

  const board = document.getElementById('leaderboard-list');
  if (!board) return;

  const rivals = [
    { name: 'Peachtree Express Tire', pts: 1420 },
    { name: 'I-285 Night Rescue',     pts: 980 },
    { name: 'DelWin Mobile (You)',    pts: state.leaguePoints, isYou: true },
    { name: 'Gwinnett Roadside Pro',  pts: 410 },
    { name: 'Southside Fleet Fix',    pts: 190 }
  ].sort((a, b) => b.pts - a.pts);

  board.innerHTML = rivals.map((r, i) => `
    <div style="display:flex;justify-content:space-between;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:${r.isYou ? 'rgba(56,189,248,0.16)' : '#0f172a'};border:1px solid ${r.isYou ? '#38bdf8' : '#1e293b'};">
      <span><strong>#${i + 1}</strong> ${r.name}</span>
      <span style="font-weight:800;color:#facc15;">${r.pts} PTS</span>
    </div>
  `).join('');
}

function renderAll() {
  renderTopHud();
  renderDispatch();
  renderBay();
  renderGarage();
  renderZones();
  renderLeague();
}

/* ==========================================================================
   DELEGATED MOBILE-FIRST INPUT HANDLERS (TABS, DRAWER & ALL BUTTONS)
   ========================================================================== */
document.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-nav]');
  if (navBtn) {
    e.preventDefault();
    switchView(navBtn.getAttribute('data-nav'));
    return;
  }

  const menuToggle = e.target.closest('#menu-btn, [data-action="toggle-menu"]');
  if (menuToggle) {
    const drawer = document.getElementById('menu-drawer');
    if (drawer) drawer.classList.toggle('hidden');
    return;
  }

  const actBtn = e.target.closest('[data-action]');
  if (!actBtn) return;

  const action = actBtn.getAttribute('data-action');
  switch (action) {
    case 'dismiss-alert':   hideDiagAlert(); break;
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
    case 'select-zone':     selectZone(Number(actBtn.getAttribute('data-zone-id'))); break;
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
