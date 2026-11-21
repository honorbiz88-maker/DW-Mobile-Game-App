// DelWin Mobile: Roadside Tire Rescue — Gameplay Mechanics Update
// Includes:
// 1. Dynamic Roadside Conditions (Clear, Night Shift + Floodlights, Georgia Downpour)
// 2. Rig Tier Cargo Capacity Limits (Std Tires, HD Tires, Plug Kits)
// 3. Security Wheel Lock Keys + Final Lower Jack & Stow Cones Checkpoint

const RIG_TIERS = [
  { tier: 1, name: "DelWin Rapid Cargo Van", cost: 0, capStd: 3, capHd: 1, capPlugs: 6, speedBonus: 1.0 },
  { tier: 2, name: "Utility Roadside Pickup", cost: 450, capStd: 4, capHd: 2, capPlugs: 8, speedBonus: 1.1 },
  { tier: 3, name: "Dual-Rear Service Truck", cost: 1100, capStd: 6, capHd: 3, capPlugs: 12, speedBonus: 1.2 },
  { tier: 4, name: "Heavy Flatbed Rescue", cost: 2400, capStd: 8, capHd: 4, capPlugs: 16, speedBonus: 1.35 },
  { tier: 5, name: "Commercial Box Fleet Rig", cost: 4800, capStd: 12, capHd: 6, capPlugs: 25, speedBonus: 1.5 }
];

const STAR_ORDER = [0, 2, 4, 1, 3]; // 5-lug star tightening pattern

const state = {
  cash: 350,
  rep: 100,
  streak: 0,
  jobsCompleted: 0,
  rigTier: 1,
  toolTier: 1,
  cargo: {
    stdTires: 2,
    hdTires: 1,
    plugs: 4
  },
  jobs: [],
  activeJob: null,
  timerInterval: null
};

const VEHICLES = [
  { name: "2023 Commuter Sedan", type: "std", targetPsi: 35, basePay: 95, lockChance: 0.15 },
  { name: "Luxury Crossover SUV", type: "std", targetPsi: 38, basePay: 125, lockChance: 0.45 },
  { name: "GA-400 Executive Coupe", type: "std", targetPsi: 36, basePay: 140, lockChance: 0.55 },
  { name: "Commercial Sprinter Van", type: "hd", targetPsi: 55, basePay: 185, lockChance: 0.25 },
  { name: "26ft Box Delivery Truck", type: "hd", targetPsi: 85, basePay: 240, lockChance: 0.20 }
];

const LOCATIONS = [
  "I-285 Perimeter West",
  "I-75 / I-85 Downtown Connector",
  "GA-400 Buckhead Express",
  "I-20 Eastbound Shoulder",
  "Peachtree Industrial Blvd"
];

const CONDITIONS = [
  { id: "clear", label: "☀️ CLEAR DAY", mult: 1.0, tagClass: "" },
  { id: "night", label: "🌙 NIGHT SHIFT (+20%)", mult: 1.2, tagClass: "night" },
  { id: "rain", label: "🌧️ GA DOWNPOUR (+35%)", mult: 1.35, tagClass: "rain" }
];

function getRigSpec() {
  return RIG_TIERS[state.rigTier - 1];
}

function formatMoney(n) {
  return `$${Math.round(n)}`;
}

function vibrate(ms = 25) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function showFloatingFeedback(msg, color = "#f59e0b") {
  const el = document.getElementById("floating-feedback");
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.textContent = "";
  }, 1400);
}

function updateHUD() {
  document.getElementById("hud-cash").textContent = formatMoney(state.cash);
  document.getElementById("hud-rep").textContent = state.rep;
  document.getElementById("hud-streak").textContent = state.streak;

  const rig = getRigSpec();
  const strip = document.getElementById("dispatch-cargo-strip");
  if (strip) {
    strip.innerHTML = `
      <span>🚛 <strong>T${rig.tier}</strong></span>
      <span>🛞 Std: <strong>${state.cargo.stdTires}/${rig.capStd}</strong></span>
      <span>🚚 HD: <strong>${state.cargo.hdTires}/${rig.capHd}</strong></span>
      <span>🩹 Plugs: <strong>${state.cargo.plugs}/${rig.capPlugs}</strong></span>
    `;
  }
}

function generateJobs() {
  state.jobs = [];
  for (let i = 0; i < 4; i++) {
    const v = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const cond = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    const needsReplacement = Math.random() < 0.55;
    const hasWheelLock = Math.random() < v.lockChance;
    const lockIndex = hasWheelLock ? Math.floor(Math.random() * 5) : -1;

    const payout = Math.round(
      (v.basePay + (needsReplacement ? 45 : 0) + (hasWheelLock ? 20 : 0)) * cond.mult
    );

    state.jobs.push({
      id: `job-${Date.now()}-${i}`,
      vehicle: v.name,
      tireClass: v.type,
      targetPsi: v.targetPsi,
      location: loc,
      condition: cond,
      repairMode: needsReplacement ? "replace" : "plug",
      hasWheelLock,
      lockIndex,
      payout,
      timeLimit: needsReplacement ? 75 : 55
    });
  }
  renderDispatchBoard();
}

function renderDispatchBoard() {
  updateHUD();
  const list = document.getElementById("job-list");
  list.innerHTML = "";

  state.jobs.forEach((job) => {
    const hasStock =
      job.repairMode === "plug"
        ? state.cargo.plugs > 0
        : job.tireClass === "hd"
        ? state.cargo.hdTires > 0
        : state.cargo.stdTires > 0;

    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-top">
        <div>
          <div class="job-title">${job.vehicle}</div>
          <div class="muted">${job.location}</div>
        </div>
        <div class="job-pay">${formatMoney(job.payout)}</div>
      </div>
      <div class="job-tags">
        <span class="tag">${job.repairMode === "plug" ? "🩹 Puncture Plug" : "🛞 Full Tire Swap"}</span>
        <span class="tag ${job.tireClass === "hd" ? "hd" : ""}">${job.tireClass === "hd" ? "🚚 HD Tire" : "🚗 Std Tire"}</span>
        <span class="tag ${job.condition.tagClass}">${job.condition.label}</span>
        ${job.hasWheelLock ? `<span class="tag lock">🔑 Security Wheel Lock</span>` : ""}
      </div>
      <button class="btn-primary" data-accept="${job.id}">
        ${hasStock ? "Accept Dispatch" : "⚠️ Low Cargo — Accept (Emergency Drop Available)"}
      </button>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll("[data-accept]").forEach((btn) => {
    btn.addEventListener("click", () => startJob(btn.dataset.accept));
  });
}

function startJob(jobId) {
  const job = state.jobs.find((j) => j.id === jobId);
  if (!job) return;

  state.activeJob = {
    ...job,
    timeLeft: job.timeLimit,
    selectedTool: "jack",
    conesPlaced: false,
    floodlightsOn: false,
    jackedUp: false,
    lockKeyApplied: !job.hasWheelLock,
    lugsRemoved: [false, false, false, false, false],
    tireFixed: false,
    psi: Math.max(8, Math.round(job.targetPsi * 0.3)),
    starStep: 0,
    tpmsDone: false,
    readyToDropJack: false,
    penalties: 0
  };

  document.getElementById("job-list").classList.add("hidden");
  document.getElementById("repair-bay").classList.remove("hidden");

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (!state.activeJob) return;
    state.activeJob.timeLeft = Math.max(0, state.activeJob.timeLeft - 1);
    document.getElementById("bay-timer").textContent = `00:${String(state.activeJob.timeLeft).padStart(2, "0")}`;
    if (state.activeJob.timeLeft === 0) {
      state.activeJob.penalties += 15;
      showFloatingFeedback("⏰ Overtime Penalty -$15", "#ef4444");
      state.activeJob.timeLeft = 15;
    }
  }, 1000);

  renderRepairBay();
}

function getNextStepPrompt(aj) {
  if (!aj.conesPlaced) return "Step 1: Place Safety Cones (+Safety)";
  if (aj.condition.id === "night" && !aj.floodlightsOn) return "⚠️ Night Shift: Turn ON LED Floodlights!";
  if (!aj.jackedUp) return "Step 2: Raise vehicle with Hydraulic Jack";
  if (aj.repairMode === "replace") {
    if (!aj.tireFixed) {
      if (aj.hasWheelLock && !aj.lockKeyApplied) {
        return `Step 3: Use Lock Key Socket on Lug #${aj.lockIndex + 1}`;
      }
      if (aj.lugsRemoved.some((v) => !v)) {
        return "Step 3: Remove all 5 lug nuts with Impact Wrench";
      }
      return "Step 4: Mount Spare Tire from cargo";
    }
  } else if (!aj.tireFixed) {
    return "Step 3: Repair puncture using Plug Kit";
  }

  if (aj.psi < aj.targetPsi) {
    return `Step 5: Inflate tire to ${aj.targetPsi} PSI`;
  }

  if (aj.repairMode === "replace" && aj.starStep < 5) {
    const nextLug = STAR_ORDER[aj.starStep] + 1;
    return `Step 6: Torque Lug #${nextLug} in Star Pattern (${aj.starStep}/5)`;
  }

  if (!aj.tpmsDone) {
    return "Step 7: Calibrate sensor with TPMS Reset";
  }

  return "✅ Complete: Tap LOWER JACK & STOW CONES below!";
}

function renderRepairBay() {
  const aj = state.activeJob;
  if (!aj) return;

  const badge = document.getElementById("bay-condition-badge");
  badge.className = `cond-badge ${aj.condition.id}`;
  badge.textContent = aj.condition.label;

  document.getElementById("bay-vehicle-title").textContent = `${aj.vehicle} — ${aj.location}`;
  document.getElementById("bay-issue-desc").textContent =
    aj.repairMode === "plug"
      ? `Tread Puncture • Target ${aj.targetPsi} PSI`
      : `Blowout Replacement (${aj.tireClass.toUpperCase()}) • Target ${aj.targetPsi} PSI`;

  const stage = document.getElementById("road-stage");
  const darkness = document.getElementById("darkness-overlay");
  const weather = document.getElementById("weather-overlay");

  stage.classList.toggle("night-mode", aj.condition.id === "night");
  stage.classList.toggle("floodlit", aj.floodlightsOn);
  darkness.classList.toggle("hidden", !(aj.condition.id === "night" && !aj.floodlightsOn));
  weather.classList.toggle("raining", aj.condition.id === "rain");

  const floodBtn = document.getElementById("btn-floodlights");
  floodBtn.textContent = `🔦 LED Floodlights: ${aj.floodlightsOn ? "ON" : "OFF"}`;
  floodBtn.classList.toggle("active", aj.floodlightsOn);

  const conesBtn = document.getElementById("btn-cones");
  conesBtn.textContent = aj.conesPlaced ? "✅ Cones Deployed" : "⚠️ Place Cones";
  conesBtn.classList.toggle("active", aj.conesPlaced);

  const hub = document.getElementById("wheel-hub");
  hub.classList.toggle("jacked", aj.jackedUp);

  const tireRing = document.getElementById("tire-ring");
  tireRing.className = `tire-ring ${aj.tireFixed ? "repaired" : "damaged"}`;

  document.querySelectorAll(".lug-node").forEach((node) => {
    const idx = Number(node.dataset.lug);
    node.className = "lug-node";
    if (idx === aj.lockIndex) {
      node.classList.add(aj.lockKeyApplied ? "unlocked-security" : "security-lock");
    }
    if (aj.repairMode === "replace" && !aj.tireFixed && aj.lugsRemoved[idx]) {
      node.classList.add("removed");
    }
    if (aj.tireFixed && aj.psi >= aj.targetPsi && aj.repairMode === "replace") {
      const torquedSoFar = STAR_ORDER.slice(0, aj.starStep);
      if (torquedSoFar.includes(idx)) node.classList.add("torqued");
      if (aj.starStep < 5 && STAR_ORDER[aj.starStep] === idx) node.classList.add("star-next");
    }
  });

  document.getElementById("step-tracker").textContent = getNextStepPrompt(aj);
  document.getElementById("psi-current").textContent = aj.psi;
  document.getElementById("psi-target").textContent = aj.targetPsi;
  document.getElementById("psi-fill").style.width = `${Math.min(100, (aj.psi / aj.targetPsi) * 100)}%`;

  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === aj.selectedTool);
  });

  const allStepsReady =
    aj.jackedUp &&
    aj.tireFixed &&
    aj.psi >= aj.targetPsi &&
    (aj.repairMode === "plug" || aj.starStep >= 5) &&
    aj.tpmsDone;

  const dropBtn = document.getElementById("btn-lower-jack");
  dropBtn.classList.toggle("hidden", !allStepsReady);
}

function handleToolUse(tool) {
  const aj = state.activeJob;
  if (!aj) return;
  aj.selectedTool = tool;

  const isDarkPenalty = aj.condition.id === "night" && !aj.floodlightsOn;

  if (tool === "jack") {
    if (!aj.conesPlaced) {
      aj.penalties += 10;
      showFloatingFeedback("⚠️ Safety Violation! Place Cones First (-$10)", "#ef4444");
      vibrate(60);
    }
    if (!aj.jackedUp) {
      aj.jackedUp = true;
      showFloatingFeedback("🏗️ Vehicle Raised!", "#10b981");
      vibrate(30);
    }
  } else if (tool === "plug") {
    if (!aj.jackedUp) {
      showFloatingFeedback("Raise vehicle on jack first!", "#ef4444");
    } else if (aj.repairMode !== "plug") {
      showFloatingFeedback("Sidewall blowout! Needs Spare Tire swap.", "#ef4444");
    } else if (!aj.tireFixed) {
      if (state.cargo.plugs <= 0) {
        showFloatingFeedback("Out of Plug Kits! Use Emergency Drop.", "#ef4444");
      } else {
        state.cargo.plugs -= 1;
        aj.tireFixed = true;
        showFloatingFeedback("🩹 Puncture Sealed!", "#10b981");
        vibrate(35);
      }
    }
  } else if (tool === "newtire") {
    if (!aj.jackedUp) {
      showFloatingFeedback("Raise vehicle on jack first!", "#ef4444");
    } else if (aj.repairMode !== "replace") {
      showFloatingFeedback("Simple puncture — use Plug Kit to save tire!", "#f59e0b");
    } else if (aj.lugsRemoved.some((v) => !v)) {
      showFloatingFeedback("Remove all 5 lug nuts first!", "#ef4444");
    } else if (!aj.tireFixed) {
      const neededKey = aj.tireClass === "hd" ? "hdTires" : "stdTires";
      if (state.cargo[neededKey] <= 0) {
        showFloatingFeedback(`No ${aj.tireClass.toUpperCase()} Tire in cargo! Use Emergency Drop.`, "#ef4444");
      } else {
        state.cargo[neededKey] -= 1;
        aj.tireFixed = true;
        showFloatingFeedback("🛞 Fresh Tire Mounted!", "#10b981");
        vibrate(40);
      }
    }
  } else if (tool === "inflator") {
    if (!aj.tireFixed) {
      showFloatingFeedback("Patch or replace tire before inflating!", "#ef4444");
    } else if (aj.psi < aj.targetPsi) {
      const boost = isDarkPenalty ? 5 : 9 + state.toolTier * 2;
      aj.psi = Math.min(aj.targetPsi, aj.psi + boost);
      showFloatingFeedback(`💨 Inflating... ${aj.psi} PSI`, "#38bdf8");
      vibrate(20);
    }
  } else if (tool === "tpms") {
    if (aj.psi < aj.targetPsi || (aj.repairMode === "replace" && aj.starStep < 5)) {
      showFloatingFeedback("Finish torquing & inflation before TPMS reset!", "#ef4444");
    } else if (!aj.tpmsDone) {
      aj.tpmsDone = true;
      showFloatingFeedback(
        aj.condition.id === "rain" ? "📡 Wet Sensor Synced!" : "📡 TPMS Calibrated!",
        "#10b981"
      );
      vibrate(30);
    }
  }

  updateHUD();
  renderRepairBay();
}

function handleLugTap(lugIdx) {
  const aj = state.activeJob;
  if (!aj) return;

  if (!aj.jackedUp) {
    showFloatingFeedback("Raise vehicle with Hydraulic Jack first!", "#ef4444");
    return;
  }

  const isDarkPenalty = aj.condition.id === "night" && !aj.floodlightsOn;

  if (aj.repairMode === "replace" && !aj.tireFixed) {
    if (aj.selectedTool === "lockkey") {
      if (lugIdx === aj.lockIndex && !aj.lockKeyApplied) {
        aj.lockKeyApplied = true;
        showFloatingFeedback("🔑 Security Key Adapter Seated!", "#38bdf8");
        vibrate(30);
      } else {
        showFloatingFeedback("Select Impact Wrench to spin lugs!", "#f59e0b");
      }
      renderRepairBay();
      return;
    }

    if (aj.selectedTool !== "impact") {
      showFloatingFeedback("Equip Impact Wrench or Lock Key Socket!", "#ef4444");
      return;
    }

    if (lugIdx === aj.lockIndex && !aj.lockKeyApplied) {
      aj.timeLeft = Math.max(0, aj.timeLeft - 5);
      showFloatingFeedback("CLANG! Use Lock Key Socket first (-5s)", "#ef4444");
      vibrate([40, 30, 40]);
      renderRepairBay();
      return;
    }

    if (aj.condition.id === "rain" && Math.random() < 0.25) {
      showFloatingFeedback("🌧️ Wet Socket Slip! Tap firmly again.", "#93c5fd");
      vibrate(25);
      return;
    }

    if (isDarkPenalty && Math.random() < 0.35) {
      showFloatingFeedback("🔦 Too dark! Turn on LED Floodlights.", "#a5b4fc");
      return;
    }

    if (!aj.lugsRemoved[lugIdx]) {
      aj.lugsRemoved[lugIdx] = true;
      showFloatingFeedback(`🔩 Lug #${lugIdx + 1} Removed`, "#10b981");
      vibrate(25);
    }
    renderRepairBay();
    return;
  }

  if (aj.repairMode === "replace" && aj.tireFixed && aj.psi >= aj.targetPsi && aj.starStep < 5) {
    if (aj.selectedTool !== "torque") {
      showFloatingFeedback("Equip Torque Wrench for Star Pattern!", "#ef4444");
      return;
    }

    const expectedLug = STAR_ORDER[aj.starStep];
    if (lugIdx === expectedLug) {
      aj.starStep += 1;
      showFloatingFeedback(`🔧 CLICK! Star Torque (${aj.starStep}/5)`, "#10b981");
      vibrate(35);
    } else {
      aj.penalties += 5;
      showFloatingFeedback(`❌ Wrong Order! Tap Lug #${expectedLug + 1} (-$5)`, "#ef4444");
      vibrate(50);
    }
    renderRepairBay();
  }
}

function finishJobWithJackDrop() {
  const aj = state.activeJob;
  if (!aj) return;

  clearInterval(state.timerInterval);
  aj.jackedUp = false;
  aj.conesPlaced = false;
  vibrate([30, 40, 60]);

  const speedBonus = aj.timeLeft > 15 ? 20 : 0;
  const streakBonus = state.streak * 5;
  const totalEarned = Math.max(25, aj.payout + speedBonus + streakBonus - aj.penalties);

  state.cash += totalEarned;
  state.rep += 5;
  state.streak += 1;
  state.jobsCompleted += 1;

  document.getElementById("sum-title").textContent = "⬇️ Jack Lowered & Cones Stowed!";
  document.getElementById("sum-breakdown").innerHTML = `
    <div>Vehicle: <strong>${aj.vehicle}</strong></div>
    <div>Condition: <strong>${aj.condition.label}</strong></div>
    <div>Base + Hazard Pay: <strong>${formatMoney(aj.payout)}</strong></div>
    <div>Speed & Streak Bonus: <strong>+${formatMoney(speedBonus + streakBonus)}</strong></div>
    <div>Penalties: <strong>-${formatMoney(aj.penalties)}</strong></div>
    <hr style="border-color:#30363d;margin:8px 0;">
    <div style="font-size:16px;color:#10b981;">Net Payout: <strong>${formatMoney(totalEarned)}</strong></div>
  `;

  state.jobs = state.jobs.filter((j) => j.id !== aj.id);
  state.activeJob = null;

  document.getElementById("repair-bay").classList.add("hidden");
  document.getElementById("job-list").classList.remove("hidden");
  document.getElementById("summary-modal").classList.remove("hidden");

  if (state.jobs.length === 0) generateJobs();
  else renderDispatchBoard();
}

function renderGarage() {
  const currentRig = getRigSpec();
  const nextRig = RIG_TIERS[state.rigTier];
  const showcase = document.getElementById("rig-showcase");

  showcase.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div>
        <span class="tag">TIER ${currentRig.tier} RIG</span>
        <h3 style="margin-top:4px;font-size:15px;">${currentRig.name}</h3>
      </div>
      <div style="text-align:right;font-size:12px;color:var(--amber);">
        Speed ${currentRig.speedBonus}x
      </div>
    </div>
    <div class="cargo-strip" style="margin-bottom:10px;">
      <span>🛞 Std Cap: <strong>${currentRig.capStd}</strong></span>
      <span>🚚 HD Cap: <strong>${currentRig.capHd}</strong></span>
      <span>🩹 Plug Cap: <strong>${currentRig.capPlugs}</strong></span>
    </div>
    ${
      nextRig
        ? `<button id="btn-upgrade-rig" class="btn-primary" ${state.cash < nextRig.cost ? "disabled" : ""}>
            Upgrade to ${nextRig.name} (${formatMoney(nextRig.cost)})
          </button>`
        : `<div class="muted" style="text-align:center;color:var(--green);">★ Max Fleet Rig Unlocked</div>`
    }
  `;

  const upBtn = document.getElementById("btn-upgrade-rig");
  if (upBtn && nextRig) {
    upBtn.addEventListener("click", () => {
      if (state.cash >= nextRig.cost) {
        state.cash -= nextRig.cost;
        state.rigTier += 1;
        updateHUD();
        renderGarage();
      }
    });
  }

  const toolsDiv = document.getElementById("tool-upgrades");
  const toolCost = state.toolTier * 220;
  toolsDiv.innerHTML = `
    <div class="card">
      <div class="job-top">
        <div>
          <div class="job-title">Pro Pneumatic & Inflator Kit (Tier ${state.toolTier})</div>
          <div class="muted">Faster PSI fill rate & tighter torque response</div>
        </div>
      </div>
      <button id="btn-upgrade-tools" class="btn-primary" style="margin-top:8px;" ${
        state.cash < toolCost ? "disabled" : ""
      }>
        Upgrade Tools (${formatMoney(toolCost)})
      </button>
    </div>
  `;

  document.getElementById("btn-upgrade-tools").addEventListener("click", () => {
    if (state.cash >= toolCost) {
      state.cash -= toolCost;
      state.toolTier += 1;
      updateHUD();
      renderGarage();
    }
  });
}

function renderDepot() {
  const rig = getRigSpec();
  const totalUsed = state.cargo.stdTires + state.cargo.hdTires + state.cargo.plugs;
  const totalCap = rig.capStd + rig.capHd + rig.capPlugs;
  document.getElementById("depot-cap-badge").textContent = `Cargo: ${totalUsed}/${totalCap}`;

  const items = [
    {
      key: "stdTires",
      name: "Standard All-Season Tire",
      desc: "Fits Sedans, Coupes & Crossovers",
      price: 45,
      cur: state.cargo.stdTires,
      max: rig.capStd
    },
    {
      key: "hdTires",
      name: "Heavy-Duty Commercial Tire",
      desc: "Fits Sprinter Vans & Box Trucks",
      price: 85,
      cur: state.cargo.hdTires,
      max: rig.capHd
    },
    {
      key: "plugs",
      name: "Vulcanized Plug & Seal Kit",
      desc: "Repairs standard tread punctures",
      price: 15,
      cur: state.cargo.plugs,
      max: rig.capPlugs
    }
  ];

  const container = document.getElementById("depot-items");
  container.innerHTML = "";

  items.forEach((it) => {
    const isFull = it.cur >= it.max;
    const canBuy = !isFull && state.cash >= it.price;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="job-top">
        <div>
          <div class="job-title">${it.name}</div>
          <div class="muted">${it.desc} • Cargo: <strong>${it.cur}/${it.max}</strong></div>
        </div>
        <div class="job-pay">${formatMoney(it.price)}</div>
      </div>
      <button class="btn-primary" data-buy="${it.key}" ${!canBuy ? "disabled" : ""}>
        ${isFull ? "Rig Cargo Full (Upgrade Rig for More)" : `Load into Rig (${formatMoney(it.price)})`}
      </button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.buy;
      const item = items.find((x) => x.key === k);
      if (item && state.cash >= item.price && state.cargo[k] < item.max) {
        state.cash -= item.price;
        state.cargo[k] += 1;
        updateHUD();
        renderDepot();
      }
    });
  });
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById(`tab-${tab}`).classList.add("active");
    if (tab === "dispatch") renderDispatchBoard();
    if (tab === "garage") renderGarage();
    if (tab === "depot") renderDepot();
  });
});

document.getElementById("btn-refresh-board").addEventListener("click", generateJobs);

document.getElementById("btn-floodlights").addEventListener("click", () => {
  if (!state.activeJob) return;
  state.activeJob.floodlightsOn = !state.activeJob.floodlightsOn;
  vibrate(20);
  renderRepairBay();
});

document.getElementById("btn-cones").addEventListener("click", () => {
  if (!state.activeJob || state.activeJob.conesPlaced) return;
  state.activeJob.conesPlaced = true;
  showFloatingFeedback("⚠️ Safety Perimeter Secured!", "#10b981");
  vibrate(25);
  renderRepairBay();
});

document.getElementById("btn-emergency-drop").addEventListener("click", () => {
  const aj = state.activeJob;
  if (!aj) return;
  if (state.cash < 95) {
    showFloatingFeedback("Not enough cash for Emergency Drop ($95)!", "#ef4444");
    return;
  }
  state.cash -= 95;
  if (aj.repairMode === "plug") state.cargo.plugs += 1;
  else if (aj.tireClass === "hd") state.cargo.hdTires += 1;
  else state.cargo.stdTires += 1;

  updateHUD();
  showFloatingFeedback("🚁 Emergency Supply Delivered!", "#38bdf8");
});

document.querySelectorAll(".tool-btn").forEach((btn) => {
  btn.addEventListener("click", () => handleToolUse(btn.dataset.tool));
});

document.querySelectorAll(".lug-node").forEach((node) => {
  node.addEventListener("click", () => handleLugTap(Number(node.dataset.lug)));
});

document.getElementById("btn-lower-jack").addEventListener("click", finishJobWithJackDrop);

document.getElementById("btn-abort-job").addEventListener("click", () => {
  clearInterval(state.timerInterval);
  state.activeJob = null;
  state.streak = 0;
  document.getElementById("repair-bay").classList.add("hidden");
  document.getElementById("job-list").classList.remove("hidden");
  renderDispatchBoard();
});

document.getElementById("btn-close-summary").addEventListener("click", () => {
  document.getElementById("summary-modal").classList.add("hidden");
});

// Init
generateJobs();
