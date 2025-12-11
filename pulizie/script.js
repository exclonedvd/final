// script.js - Turni Pulizie Bottega del Caffè (Firebase + scadenze)

// ========================== COSTANTI BASE ==========================
const BASE_TASKS = [
  // 1 SETTIMANA
  { id: "sett-cambio-carta-teglie", name: "Cambio carta teglie", interval: "settimana" },
  { id: "sett-bagno", name: "Bagno (compreso mensola)", interval: "settimana" },
  { id: "sett-ragnatele-polvere", name: "Ragnatele/polvere (anche serranda)", interval: "settimana" },
  { id: "sett-interno-mobiletti-banco", name: "Interno mobiletti dietro al bancone", interval: "settimana" },
  { id: "sett-sopra-mobiletti-bicchieri", name: "Sopra ai mobiletti (bicchieri, mensole, alzatine)", interval: "settimana" },
  { id: "sett-frighi-latte-bevande", name: "Frighi del latte/crodini/succhi/bevande", interval: "settimana" },
  { id: "sett-bidoni-spazzatura", name: "Bidoni spazzatura e dietro (anche umido vicino al sale)", interval: "settimana" },
  { id: "sett-cimitero-coppette", name: "Cimitero coppette", interval: "settimana" },
  { id: "sett-muro-fianchi-gelateria", name: "Muro di fianco alla gelateria", interval: "settimana" },
  { id: "sett-sotto-lavello-lavastoviglie", name: "Sotto al lavello di fianco alla lavastoviglie", interval: "settimana" },
  { id: "sett-vassoi-rotondi", name: "Vassoi rotondi sopra alla lavastoviglie", interval: "settimana" },
  { id: "sett-contenitore-sopra-bancone", name: "Contenitore sopra bancone (acqua e asporto)", interval: "settimana" },

  // 1 MESE
  { id: "mese-palude", name: "Palude", interval: "mese" },
  { id: "mese-forni", name: "Forni", interval: "mese" },
  { id: "mese-teglie-portateglie", name: "Teglie (anche portateglie)", interval: "mese" },
  { id: "mese-microonde", name: "Microonde", interval: "mese" },
  { id: "mese-fornetto-toast", name: "Fornetto toast", interval: "mese" },
  { id: "mese-mensole-magazzino", name: "Mensole magazzino (all'entrata)", interval: "mese" },
  { id: "mese-mensole-bibite", name: "Mensole bibite/crodini (sopra freezer a pozzetto)", interval: "mese" },
  { id: "mese-mensola-vicino-forni", name: "Mensola vicino ai forni (fornetto)", interval: "mese" },
  { id: "mese-lavello-retro", name: "Lavello retro", interval: "mese" },
  { id: "mese-sotto-ripiano-produzione", name: "Sotto al ripiano per produzione", interval: "mese" },
  { id: "mese-sotto-forni", name: "Sotto ai forni (macchina per lavare a terra)", interval: "mese" },
  { id: "mese-angoli-pavimenti-magazzino", name: "Angoli pavimenti magazzino", interval: "mese" },
  { id: "mese-acido-citrico-lavastoviglie", name: "Acido citrico in lavastoviglie", interval: "mese" },
  { id: "mese-sbattigruppi", name: "Sbattigruppi", interval: "mese" },
  { id: "mese-sotto-cassa-fili", name: "Sotto cassa (fili)", interval: "mese" },
  { id: "mese-sotto-cassa", name: "Sotto cassa", interval: "mese" },
  { id: "mese-frigorifero-retro", name: "Frigorifero retro (salumi)", interval: "mese" },
  { id: "mese-sgrassare-muri-visibili", name: "Sgrassare muri visibili", interval: "mese" },
  { id: "mese-bancone-mensola-marroni", name: "Bancone e mensola (marroni)", interval: "mese" },
  { id: "mese-vetrina-gelati", name: "Vetrina gelati (dentro)", interval: "mese" },
  { id: "mese-dietro-frighi-bevande", name: "Dietro ai 2 frighi bevande (fuori)", interval: "mese" },
  { id: "mese-sopra-frighi-bevande", name: "Sopra ai 2 frighi bevande (polvere)", interval: "mese" },
  { id: "mese-sopra-frigo-freezer-colonna", name: "Sopra al frigo e freezer a colonna (retro)", interval: "mese" },
  { id: "mese-macchina-caffe", name: "Sopra e sotto alla macchina del caffè", interval: "mese" },
  { id: "mese-porte", name: "Porte", interval: "mese" },
  { id: "mese-sgrassare-sedie-tavoli", name: "Sgrassare sedie e tavoli", interval: "mese" },
  { id: "mese-macchina-ghiaccio", name: "Macchina del ghiaccio", interval: "mese" },
  { id: "mese-macchina-ginseng", name: "Macchina del ginseng", interval: "mese" },
  { id: "mese-motorino-golosino", name: "Motorino sotto gelato golosino", interval: "mese" },

  // 2 MESI
  { id: "due-mesi-sgrassare-muri-non-visibili", name: "Sgrassare muri non visibili (es. dietro al freezer)", interval: "due-mesi" },
  { id: "due-mesi-sbrinare-freezer-colonna", name: "Sbrinare freezer a colonna", interval: "due-mesi" },
  { id: "due-mesi-sbrinare-freezer-gelati", name: "Sbrinare freezer gelati", interval: "due-mesi" },
  { id: "due-mesi-sbrinare-freezer-pozzetto-grande", name: "Sbrinare freezer a pozzetto (quello grande)", interval: "due-mesi" },
  { id: "due-mesi-sbrinare-freezer-pozzetto-piccolo", name: "Sbrinare freezer a pozzetto (quello piccolo)", interval: "due-mesi" },

  // 1 ANNO
  { id: "anno-piccionaia", name: "Piccionaia", interval: "anno" },
  { id: "anno-armadietti", name: "Armadietti", interval: "anno" },
  { id: "anno-sotto-pedana", name: "Sotto alla pedana", interval: "anno" },
  { id: "anno-condizionatori-motori-frigo", name: "Condizionatori e motori frigo (aspirare con aspirapolvere)", interval: "anno" }
];

// Stato globale condiviso
const STATE = {
  employees: [],
  assignments: {},
  completed: [],
  customTasks: [],
  dueAdjustments: {}, // taskId -> giorni di posticipo cumulativo
  fixedOnly: {}, // { "Nome": [taskId, ...] } dipendenti fuori turnazione
  taskNotes: {}, // taskId -> string
  assignmentRules: {}, // { "Mario": { exclude: [taskId], prefer: [taskId] } }
  settings: {
    theme: "light",
    monthlyStandardDay: null
  },
  lastSyncAt: null
};

const FS_COLLECTION = "turni";
const FS_DOCUMENT = "state";
const LS_STATE_KEY = "turni-global-state";
const LS_PENDING_STATE_KEY = "turni-pending-state";
const SETTINGS_PASSWORD = "030198";
const SETTINGS_AUTH_KEY = "turni-settings-auth";
const NOTIFY_KEY = "turni-last-notify-date";
const MAX_COMPLETED_ENTRIES = 1000;

// ========================== UTILITY GENERALI ==========================

function intervalToLabel(interval) {
  if (interval === "settimana") return "1 settimana";
  if (interval === "mese") return "1 mese";
  if (interval === "due-mesi") return "2 mesi";
  if (interval === "anno") return "1 anno";
  return interval;
}

function addIntervalCalendar(date, interval) {
  const d = new Date(date);

  if (interval === "settimana") {
    d.setDate(d.getDate() + 7);
    return d;
  }

  if (interval === "mese") {
    const standardDay = STATE.settings && STATE.settings.monthlyStandardDay;
    if (standardDay && standardDay >= 1 && standardDay <= 28) {
      const next = new Date(d);
      next.setMonth(next.getMonth() + 1);
      next.setDate(standardDay);
      return next;
    }
    d.setMonth(d.getMonth() + 1);
    return d;
  }

  if (interval === "due-mesi") {
    d.setMonth(d.getMonth() + 2);
    return d;
  }

  if (interval === "anno") {
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }

  d.setMonth(d.getMonth() + 1);
  return d;
}

function formatDateItalian(d) {
  try {
    return d.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch (e) {
    return String(d);
  }
}

function formatDateTimeItalian(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return isoString;
  }
}
function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const safe = (v === null || v === undefined) ? "" : v;
    const s = safe.toString().replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))
  ];
  return lines.join("\n");
}

function downloadTextFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function getAllTasks() {
  return BASE_TASKS.concat(STATE.customTasks || []);
}


function pruneCompletedList(list) {
  const arr = Array.isArray(list) ? list.slice() : [];
  if (arr.length <= MAX_COMPLETED_ENTRIES) return arr;

  // Ordina per completedAt crescente (fallback su 0 se non valido)
  arr.sort((a, b) => {
    const ta = a && a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const tb = b && b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return ta - tb;
  });

  return arr.slice(Math.max(0, arr.length - MAX_COMPLETED_ENTRIES));
}

function normalizeStateAfterLoad() {
  STATE.employees = Array.isArray(STATE.employees) ? STATE.employees : [];
  STATE.assignments = STATE.assignments && typeof STATE.assignments === "object" ? STATE.assignments : {};
  STATE.completed = pruneCompletedList(STATE.completed || []);
  STATE.customTasks = Array.isArray(STATE.customTasks) ? STATE.customTasks : [];
  STATE.dueAdjustments = STATE.dueAdjustments && typeof STATE.dueAdjustments === "object" ? STATE.dueAdjustments : {};
  STATE.fixedOnly = STATE.fixedOnly && typeof STATE.fixedOnly === "object" ? STATE.fixedOnly : {};
  STATE.taskNotes = STATE.taskNotes && typeof STATE.taskNotes === "object" ? STATE.taskNotes : {};
  STATE.assignmentRules = STATE.assignmentRules && typeof STATE.assignmentRules === "object" ? STATE.assignmentRules : {};
  STATE.settings = STATE.settings && typeof STATE.settings === "object"
    ? { theme: "light", monthlyStandardDay: null, ...STATE.settings }
    : { theme: "light", monthlyStandardDay: null };
}

function getLatestCompletionMap() {
  const latestByTask = {};
  for (const c of STATE.completed || []) {
    if (!c.taskId || !c.completedAt) continue;
    const tId = c.taskId;
    const time = new Date(c.completedAt).getTime();
    if (!latestByTask[tId] || time > latestByTask[tId]) {
      latestByTask[tId] = time;
    }
  }
  return latestByTask;
}

function computeDueDate(task, refDate) {
  const today = new Date(refDate || new Date());
  today.setHours(0, 0, 0, 0);

  const latestByTask = getLatestCompletionMap();
  const lastTime = latestByTask[task.id] || null;

  let baseDate;
  if (lastTime) {
    const lastDate = new Date(lastTime);
    baseDate = addIntervalCalendar(lastDate, task.interval);
  } else {
    // mai fatto -> consideriamo oggi come scadenza base
    baseDate = today;
  }
  baseDate.setHours(0, 0, 0, 0);

  const adjDays = (STATE.dueAdjustments && STATE.dueAdjustments[task.id]) || 0;
  if (adjDays) {
    baseDate = new Date(baseDate.getTime() + adjDays * 24 * 60 * 60 * 1000);
    baseDate.setHours(0, 0, 0, 0);
  }

  return baseDate;
}

function isTaskDue(task, referenceDate) {
  const today = new Date(referenceDate || new Date());
  today.setHours(0, 0, 0, 0);
  const dueDate = computeDueDate(task, today);
  return dueDate <= today;
}

// ========================== FIRESTORE + LOCALE ==========================

function hasDb() {
  try {
    return typeof firebase !== "undefined" &&
      firebase.apps &&
      firebase.apps.length > 0 &&
      typeof db !== "undefined";
  } catch (e) {
    console.error("Errore controllo db", e);
    return false;
  }
}

function loadStateFromLocal() {
  const raw = localStorage.getItem(LS_STATE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      STATE.employees = parsed.employees || [];
      STATE.assignments = parsed.assignments || {};
      STATE.completed = parsed.completed || [];
      STATE.customTasks = parsed.customTasks || [];
      STATE.dueAdjustments = parsed.dueAdjustments || {};
      STATE.fixedOnly = parsed.fixedOnly || {};
      STATE.taskNotes = parsed.taskNotes || {};
      STATE.assignmentRules = parsed.assignmentRules || {};
      STATE.settings = parsed.settings || STATE.settings || { theme: "light", monthlyStandardDay: null };
      STATE.lastSyncAt = parsed.lastSyncAt || STATE.lastSyncAt || null;
      normalizeStateAfterLoad();
    }
  } catch (e) {
    console.error("Errore parse stato locale", e);
  }
}

function saveStateToLocal() {
  // Mantieni lo stato locale coerente con quello Firestore
  STATE.completed = pruneCompletedList(STATE.completed || []);

  const toSave = {
    employees: STATE.employees || [],
    assignments: STATE.assignments || {},
    completed: STATE.completed || [],
    customTasks: STATE.customTasks || [],
    dueAdjustments: STATE.dueAdjustments || {},
    fixedOnly: STATE.fixedOnly || {},
    taskNotes: STATE.taskNotes || {},
    assignmentRules: STATE.assignmentRules || {},
    settings: STATE.settings || { theme: "light", monthlyStandardDay: null },
    lastSyncAt: STATE.lastSyncAt || null
  };

  try {
    localStorage.setItem(LS_STATE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Errore salvataggio stato locale", e);
  }
}

async function loadStateFromFirestore() {
  if (!hasDb()) {
    console.warn("Firestore non disponibile, uso solo stato locale.");
    loadStateFromLocal();
    applyTheme();
    return;
  }
  try {
    const ref = db.collection(FS_COLLECTION).doc(FS_DOCUMENT);
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data() || {};
      STATE.employees = Array.isArray(data.employees) ? data.employees : [];
      STATE.assignments = data.assignments && typeof data.assignments === "object" ? data.assignments : {};
      STATE.completed = Array.isArray(data.completed) ? data.completed : [];
      STATE.customTasks = Array.isArray(data.customTasks) ? data.customTasks : [];
      STATE.dueAdjustments = data.dueAdjustments && typeof data.dueAdjustments === "object" ? data.dueAdjustments : {};
      STATE.fixedOnly = data.fixedOnly && typeof data.fixedOnly === "object" ? data.fixedOnly : {};
      STATE.taskNotes = data.taskNotes && typeof data.taskNotes === "object" ? data.taskNotes : {};
      STATE.assignmentRules = data.assignmentRules && typeof data.assignmentRules === "object" ? data.assignmentRules : {};
      STATE.settings = data.settings && typeof data.settings === "object"
        ? { ...STATE.settings, ...data.settings }
        : { ...STATE.settings };
      STATE.lastSyncAt = data.lastSyncAt || null;
    } else {
      STATE.employees = [];
      STATE.assignments = {};
      STATE.completed = [];
      STATE.customTasks = [];
      STATE.dueAdjustments = {};
      STATE.fixedOnly = {};
      STATE.fixedOnly = {};
      STATE.taskNotes = {};
      STATE.assignmentRules = {};
      STATE.settings = { theme: "light", monthlyStandardDay: null };
      STATE.lastSyncAt = null;
    }
    normalizeStateAfterLoad();
    saveStateToLocal();
    applyTheme();
  } catch (e) {
    console.error("Errore lettura Firestore", e);
    loadStateFromLocal();
    applyTheme();
  }
}
async function saveStateToFirestore() {
  saveStateToLocal();

  if (!hasDb()) {
    console.warn("Firestore non disponibile, salvo solo locale.");
    return;
  }

  try {
    const ref = db.collection(FS_COLLECTION).doc(FS_DOCUMENT);

    // Evita crescita infinita del documento
    STATE.completed = pruneCompletedList(STATE.completed || []);

    const payload = {
      employees: STATE.employees || [],
      assignments: STATE.assignments || {},
      completed: STATE.completed || [],
      customTasks: STATE.customTasks || [],
      dueAdjustments: STATE.dueAdjustments || {},
    fixedOnly: STATE.fixedOnly || {},
      taskNotes: STATE.taskNotes || {},
      assignmentRules: STATE.assignmentRules || {},
      settings: STATE.settings || { theme: "light", monthlyStandardDay: null },
      lastSyncAt: new Date().toISOString()
    };

    await ref.set(payload);

    STATE.lastSyncAt = payload.lastSyncAt;
    localStorage.removeItem(LS_PENDING_STATE_KEY);
    saveStateToLocal();
    renderSyncStatus();
  } catch (e) {
    console.error("Errore salvataggio Firestore", e);

    try {
      const pending = {
        state: {
          employees: STATE.employees || [],
          assignments: STATE.assignments || {},
          completed: STATE.completed || [],
          customTasks: STATE.customTasks || [],
          dueAdjustments: STATE.dueAdjustments || {},
    fixedOnly: STATE.fixedOnly || {},
      taskNotes: STATE.taskNotes || {},
          assignmentRules: STATE.assignmentRules || {},
          settings: STATE.settings || { theme: "light", monthlyStandardDay: null }
        },
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(LS_PENDING_STATE_KEY, JSON.stringify(pending));
    } catch (_) {}

    renderSyncStatus();
  }
}
async function flushPendingStateIfAny() {
  if (!navigator.onLine) return;

  const raw = localStorage.getItem(LS_PENDING_STATE_KEY);
  if (!raw) return;

  try {
    const pending = JSON.parse(raw);
    if (pending && pending.state) {
      Object.assign(STATE, pending.state);
      await saveStateToFirestore();
    }
  } catch (e) {
    console.warn("Pending state non valido", e);
  }
}

function ensureSyncIndicatorExists() {
  let el = document.getElementById("sync-indicator");
  if (el) return el;

  const header = document.querySelector(".app-header");
  if (!header) return null;

  el = document.createElement("div");
  el.id = "sync-indicator";
  el.className = "sync-indicator";
  header.appendChild(el);
  return el;
}

function renderSyncStatus() {
  const el = ensureSyncIndicatorExists();
  if (!el) return;

  const online = navigator.onLine;
  const pending = !!localStorage.getItem(LS_PENDING_STATE_KEY);

  let text = online ? "🟢 Online" : "🟠 Offline";
  if (online && pending) text = "⏳ In attesa di sync";

  const last = STATE.lastSyncAt
    ? " • Ultimo sync: " + formatDateTimeItalian(STATE.lastSyncAt)
    : "";

  el.textContent = text + last;
}

async function ensureStateLoaded() {
  if (window.__turniStateLoaded) return;
  window.__turniStateLoaded = true;
  await loadStateFromFirestore();
}

// ========================== SPLASH & MODAL POPUP ==========================

function hideSplash() {
  const el = document.getElementById("splash");
  if (el) el.classList.add("splash-hidden");
}

function showModalDialog(options) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("app-modal");
    const titleEl = document.getElementById("modal-title");
    const msgEl = document.getElementById("modal-message");
    const okBtn = document.getElementById("modal-ok-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");

    if (!overlay || !titleEl || !msgEl || !okBtn || !cancelBtn) {
      // Fallback ai popup del browser
      if (options.mode === "confirm") {
        const res = window.confirm(options.message || "");
        resolve(res);
      } else {
        window.alert(options.message || "");
        resolve(true);
      }
      return;
    }

    const title = options.title || (options.mode === "confirm" ? "Conferma" : "Avviso");
    const message = options.message || "";

    titleEl.textContent = title;
    msgEl.textContent = message;

    if (options.mode === "confirm") {
      cancelBtn.style.display = "";
    } else {
      cancelBtn.style.display = "none";
    }

    const closeModal = (result) => {
      overlay.classList.add("modal-hidden");
      okBtn.onclick = null;
      cancelBtn.onclick = null;
      resolve(result);
    };

    okBtn.onclick = () => closeModal(true);
    cancelBtn.onclick = () => closeModal(false);

    overlay.classList.remove("modal-hidden");
  });
}

function showAlert(message, title) {
  return showModalDialog({ mode: "alert", message, title });
}

function showConfirm(message, title) {
  return showModalDialog({ mode: "confirm", message, title });
}


function showPrompt(message, title, inputOptions) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("app-modal");
    const titleEl = document.getElementById("modal-title");
    const msgEl = document.getElementById("modal-message");
    const okBtn = document.getElementById("modal-ok-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");

    const opts = inputOptions || {};

    if (!overlay || !titleEl || !msgEl || !okBtn || !cancelBtn) {
      const res = window.prompt(message || "");
      resolve(res);
      return;
    }

    titleEl.textContent = title || "Inserimento";

    msgEl.innerHTML = "";

    const textEl = document.createElement("div");
    textEl.textContent = message || "";
    textEl.style.marginBottom = "0.5rem";
    msgEl.appendChild(textEl);

    const input = document.createElement("input");
    input.type = opts.type || "text";
    input.className = "modal-input";
    input.placeholder = opts.placeholder || "";
    if (opts.value != null) input.value = String(opts.value);

    msgEl.appendChild(input);

    cancelBtn.style.display = "";

    const cleanup = () => {
      okBtn.onclick = null;
      cancelBtn.onclick = null;
      input.onkeydown = null;
    };

    const closeModal = (value) => {
      overlay.classList.add("modal-hidden");
      cleanup();
      resolve(value);
    };

    okBtn.onclick = () => closeModal(input.value);
    cancelBtn.onclick = () => closeModal(null);

    input.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        okBtn.click();
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        cancelBtn.click();
      }
    };

    overlay.classList.remove("modal-hidden");
    setTimeout(() => input.focus(), 0);
  });
}


// ========================== PROTEZIONE IMPOSTAZIONI ==========================

async function ensureSettingsAuth() {
  try {
    const ok = localStorage.getItem(SETTINGS_AUTH_KEY);
    if (ok === "true") return true;
  } catch (e) {
    console.error("Errore lettura auth", e);
  }

  for (let i = 0; i < 3; i++) {
    const input = await showPrompt(
      "Inserisci la password per accedere alle impostazioni:",
      "Accesso alle impostazioni",
      { type: "password", placeholder: "Password" }
    );

    if (input === null) {
      window.location.href = "index.html";
      return false;
    }

    if (input === SETTINGS_PASSWORD) {
      try {
        localStorage.setItem(SETTINGS_AUTH_KEY, "true");
      } catch (_) {}
      return true;
    }

    await showAlert("Password errata. Riprova.", "Accesso negato");
  }

  window.location.href = "index.html";
  return false;
}

// ========================== LAVORI PERSONALIZZATI ==========================


function renderCustomTasksList() {
  const listEl = document.getElementById("custom-task-list");
  if (!listEl) return;

  const tasks = STATE.customTasks || [];
  listEl.innerHTML = "";

  if (!tasks.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessun lavoro personalizzato aggiunto.";
    listEl.appendChild(p);
    return;
  }

  tasks.forEach((t) => {
    const row = document.createElement("div");
    row.className = "custom-task-item";

    const left = document.createElement("span");
    left.textContent = t.name + " (" + intervalToLabel(t.interval) + ")";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "secondary";
    delBtn.textContent = "Rimuovi";
    delBtn.addEventListener("click", async () => {
      STATE.customTasks = (STATE.customTasks || []).filter((x) => x.id !== t.id);
      await saveStateToFirestore();
      renderCustomTasksList();
      showAlert("Lavoro personalizzato rimosso.");
    });

    row.appendChild(left);
    row.appendChild(delBtn);
    listEl.appendChild(row);
  });
}

function setupCustomTasksForm() {
  const nameInput = document.getElementById("custom-task-name");
  const intervalSelect = document.getElementById("custom-task-interval");
  const addBtn = document.getElementById("add-custom-task-btn");
  if (!nameInput || !intervalSelect || !addBtn) return;

  addBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const interval = intervalSelect.value;

    if (!name) {
      showAlert("Inserisci il nome del lavoro.");
      return;
    }

    const newTask = {
      id: "custom-" + Date.now(),
      name,
      interval
    };
    STATE.customTasks = (STATE.customTasks || []).concat([newTask]);
    await saveStateToFirestore();

    nameInput.value = "";
    renderCustomTasksList();
    showAlert("Lavoro personalizzato aggiunto.");
  });

  renderCustomTasksList();
}

// ========================== IMPOSTAZIONI ==========================

function renderEmployeesTextArea() {
  const textarea = document.getElementById("employees-input");
  if (!textarea) return;
  textarea.value = (STATE.employees || []).join("\n");
}

function parseRulesLines(text) {
  const map = {};
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const tasks = getAllTasks();

  function nameToId(name) {
    const n = name.toLowerCase();
    const exact = tasks.find((t) => t.name.toLowerCase() === n);
    if (exact) return exact.id;

    const partial = tasks.filter((t) => t.name.toLowerCase().includes(n));
    if (partial.length === 1) return partial[0].id;

    return null;
  }

  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length < 2) continue;
    const employee = parts[0].trim();
    const rest = parts.slice(1).join(":").trim();
    if (!employee || !rest) continue;

    const items = rest
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const ids = items.map(nameToId).filter(Boolean);

    map[employee] = ids;
  }

  return map;
}

function mergeAssignmentRules(excludeMap, preferMap) {
  const merged = {};
  const names = new Set([...Object.keys(excludeMap), ...Object.keys(preferMap)]);
  names.forEach((n) => {
    merged[n] = {
      exclude: excludeMap[n] || [],
      prefer: preferMap[n] || []
    };
  });
  return merged;
}

function renderRulesTextAreas() {
  const ex = document.getElementById("rules-exclude");
  const pr = document.getElementById("rules-prefer");
  if (!ex || !pr) return;

  const rules = STATE.assignmentRules || {};
  const tasks = getAllTasks();
  const excludeLines = [];
  const preferLines = [];

  for (const [name, r] of Object.entries(rules)) {
    if (r.exclude && r.exclude.length) {
      const names = r.exclude.map((id) => {
        const t = tasks.find((x) => x.id === id);
        return t ? t.name : id;
      });
      excludeLines.push(`${name}: ${names.join(", ")}`);
    }
    if (r.prefer && r.prefer.length) {
      const names = r.prefer.map((id) => {
        const t = tasks.find((x) => x.id === id);
        return t ? t.name : id;
      });
      preferLines.push(`${name}: ${names.join(", ")}`);
    }
  }

  ex.value = excludeLines.join("\n");
  pr.value = preferLines.join("\n");
}

function renderFixedOnlyTextArea() {
  const ta = document.getElementById("fixed-only-input");
  if (!ta) return;

  const map = STATE.fixedOnly || {};
  const tasks = getAllTasks();
  const lines = [];

  for (const [name, ids] of Object.entries(map)) {
    if (!Array.isArray(ids) || !ids.length) continue;

    const names = ids.map((id) => {
      const t = tasks.find((x) => x.id === id);
      return t ? t.name : id;
    });

    lines.push(`${name}: ${names.join(", ")}`);
  }

  ta.value = lines.join("\n");
}



function getTaskNote(taskId) {
  const notes = STATE.taskNotes || {};
  return notes[taskId] || "";
}

function renderNotesTextArea() {
  const ta = document.getElementById("notes-input");
  if (!ta) return;

  const tasks = getAllTasks();
  const notes = STATE.taskNotes || {};

  const lines = [];

  for (const [taskId, note] of Object.entries(notes)) {
    if (!note) continue;
    const t = tasks.find((x) => x.id === taskId);
    const name = t ? t.name : taskId;
    lines.push(`${name}: ${note}`);
  }

  ta.value = lines.join("\n");
}

function parseNotesLines(text) {
  const map = {};
  const tasks = getAllTasks();
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const nameToIds = (name) => {
    const n = name.toLowerCase();
    return tasks.filter((t) => t.name.toLowerCase() === n).map((t) => t.id);
  };

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const rawName = line.slice(0, idx).trim();
    const note = line.slice(idx + 1).trim();
    if (!rawName || !note) continue;

    const exactIds = nameToIds(rawName);
    if (exactIds.length === 1) {
      map[exactIds[0]] = note;
      continue;
    }

    // Fallback: prova match parziale univoco
    const n = rawName.toLowerCase();
    const partial = tasks.filter((t) => t.name.toLowerCase().includes(n));
    if (partial.length === 1) {
      map[partial[0].id] = note;
      continue;
    }

    // Se ambiguo/non trovato, ignoro la riga per evitare associazioni sbagliate
  }

  return map;
}



function applyTheme() {
  const theme = (STATE.settings && STATE.settings.theme) || "light";
  const effective =
    theme === "auto"
      ? window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  document.body.setAttribute("data-theme", effective);
}

function setupThemeControls() {
  const sel = document.getElementById("theme-select");
  if (!sel) return;

  sel.value = (STATE.settings && STATE.settings.theme) || "light";

  sel.addEventListener("change", async () => {
    STATE.settings = STATE.settings || {};
    STATE.settings.theme = sel.value;
    applyTheme();
    await saveStateToFirestore();
  });
}

function setupMonthlyStandardDayControl() {
  const input = document.getElementById("monthly-standard-day");
  if (!input) return;

  input.value = (STATE.settings && STATE.settings.monthlyStandardDay) || "";

  input.addEventListener("change", async () => {
    const v = parseInt(input.value, 10);
    STATE.settings = STATE.settings || {};

    if (!v) {
      STATE.settings.monthlyStandardDay = null;
    } else {
      STATE.settings.monthlyStandardDay = Math.max(1, Math.min(28, v));
      input.value = STATE.settings.monthlyStandardDay;
    }

    await saveStateToFirestore();
  });
}
async function initSettingsPage() {
  if (!(await ensureSettingsAuth())) return;

  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  renderSyncStatus();

  renderEmployeesTextArea();
  setupCustomTasksForm();
  renderRulesTextAreas();
  renderFixedOnlyTextArea();
  renderNotesTextArea();
  setupThemeControls();
  setupMonthlyStandardDayControl();

  const saveEmployeesBtn = document.getElementById("save-employees-btn");
  const assignBtn = document.getElementById("assign-btn");
  const assignDueBtn = document.getElementById("assign-due-btn");
  const resetBtn = document.getElementById("reset-all-btn");

  if (saveEmployeesBtn) {
    saveEmployeesBtn.addEventListener("click", async () => {
      const raw = document.getElementById("employees-input").value;
      const list = raw
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      STATE.employees = list;
      await saveStateToFirestore();
      showAlert("Dipendenti salvati.");
    });
  }

  if (assignBtn) {
    assignBtn.addEventListener("click", async () => {
      const raw = document.getElementById("employees-input").value;
      const list = raw
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      if (!list.length) {
        showAlert("Inserisci almeno un dipendente prima di distribuire i turni.");
        return;
      }

      STATE.employees = list;
      STATE.assignments = assignTasksWithFixedOnly(list);
      await saveStateToFirestore();
      showAlert("Lavori assegnati in modo equo (con pesi per frequenza) tra i dipendenti.");
    });
  }

  if (assignDueBtn) {
    assignDueBtn.addEventListener("click", async () => {
      const raw = document.getElementById("employees-input").value;
      const list = raw
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      if (!list.length) {
        showAlert("Inserisci almeno un dipendente prima di distribuire i turni.");
        return;
      }

      STATE.employees = list;
      STATE.assignments = assignDueTasksWithFixedOnly(list);
      await saveStateToFirestore();
      showAlert("Assegnati solo i lavori attualmente in scadenza o in ritardo.");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      const ok = await showConfirm(
        "ATTENZIONE!\n\n" +
          "Questo resetterà per tutti i dispositivi:\n" +
          "• elenco dipendenti\n" +
          "• assegnazioni dei lavori\n" +
          "• lavori completati\n" +
          "• lavori personalizzati\n" +
          "• eventuali posticipi di scadenza\n• regole di assegnazione\n• note dei lavori\n\n" +
          "Sei sicuro di voler continuare?",
        "Reset totale"
      );
      if (!ok) return;

      STATE.employees = [];
      STATE.assignments = {};
      STATE.completed = [];
      STATE.customTasks = [];
      STATE.dueAdjustments = {};
      STATE.fixedOnly = {};

      await saveStateToFirestore();

      renderEmployeesTextArea();
      renderCustomTasksList();

      showAlert("Tutti i dati sono stati resettati.");
    });
  }

  const saveRulesBtn = document.getElementById("save-rules-btn");
  if (saveRulesBtn) {
    saveRulesBtn.addEventListener("click", async () => {
      const exEl = document.getElementById("rules-exclude");
      const exText = exEl && exEl.value ? exEl.value : "";
      const prEl = document.getElementById("rules-prefer");
      const prText = prEl && prEl.value ? prEl.value : "";

      const excludeMap = parseRulesLines(exText);
      const preferMap = parseRulesLines(prText);

      STATE.assignmentRules = mergeAssignmentRules(excludeMap, preferMap);
      await saveStateToFirestore();
      showAlert("Regole di assegnazione salvate.");
    });
  }

  const saveFixedOnlyBtn = document.getElementById("save-fixed-only-btn");
  if (saveFixedOnlyBtn) {
    saveFixedOnlyBtn.addEventListener("click", async () => {
      const ta = document.getElementById("fixed-only-input");
      const text = ta && ta.value ? ta.value : "";

      const map = parseRulesLines(text);
      STATE.fixedOnly = map;

      // Assicura che i nomi esistano anche nell'elenco dipendenti
      const current = Array.isArray(STATE.employees) ? STATE.employees.slice() : [];
      const set = new Set(current);

      Object.keys(map).forEach((name) => {
        if (!set.has(name)) {
          current.push(name);
          set.add(name);
        }
      });

      STATE.employees = current;

      await saveStateToFirestore();
      renderEmployeesTextArea();
      renderFixedOnlyTextArea();
      showAlert("Assegnazioni fisse salvate.");
    });
  }


  const saveNotesBtn = document.getElementById("save-notes-btn");
  if (saveNotesBtn) {
    saveNotesBtn.addEventListener("click", async () => {
      const ta = document.getElementById("notes-input");
      const text = ta && ta.value ? ta.value : "";
      STATE.taskNotes = parseNotesLines(text);
      await saveStateToFirestore();
      showAlert("Note dei lavori salvate.");
    });
  }

}

// ========================== ASSEGNAZIONE TURNI ==========================

function intervalWeight(interval) {
  if (interval === "settimana") return 4;
  if (interval === "mese") return 2;
  if (interval === "due-mesi") return 1;
  if (interval === "anno") return 0.5;
  return 1;
}


function getFixedOnlyMap() {
  return STATE.fixedOnly && typeof STATE.fixedOnly === "object" ? STATE.fixedOnly : {};
}

function buildLockedTaskAssignments() {
  const locked = {};
  const fixed = getFixedOnlyMap();

  for (const [name, ids] of Object.entries(fixed)) {
    if (!Array.isArray(ids) || !ids.length) continue;
    for (const id of ids) locked[id] = name;
  }

  return locked;
}

function getRotatingEmployees(list) {
  const fixed = getFixedOnlyMap();
  const fixedNames = new Set(
    Object.entries(fixed)
      .filter(([, ids]) => Array.isArray(ids) && ids.length)
      .map(([name]) => name)
  );

  return (list || []).filter((name) => !fixedNames.has(name));
}

function assignTasksWithFixedOnly(allEmployees) {
  const locked = buildLockedTaskAssignments();
  const rotating = getRotatingEmployees(allEmployees);

  const tasks = getAllTasks().filter((t) => !locked[t.id]);
  const base = assignTasksWeighted(rotating, tasks);

  return { ...base, ...locked };
}

function assignDueTasksWithFixedOnly(allEmployees) {
  const locked = buildLockedTaskAssignments();
  const rotating = getRotatingEmployees(allEmployees);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = getAllTasks().filter((t) => isTaskDue(t, today) && !locked[t.id]);
  const base = assignOnlyDueTasksWeighted(rotating, tasks);

  return { ...(STATE.assignments || {}), ...base, ...locked };
}

function getRulesFor(name) {
  const r = (STATE.assignmentRules && STATE.assignmentRules[name]) || {};
  return {
    exclude: Array.isArray(r.exclude) ? r.exclude : [],
    prefer: Array.isArray(r.prefer) ? r.prefer : []
  };
}

function assignTasksWeighted(employees, tasksOverride) {
  const assignments = {};
  if (!employees || !employees.length) return assignments;

  const load = {};
  employees.forEach((e) => (load[e] = 0));

  const tasks = (tasksOverride ? tasksOverride.slice() : getAllTasks().slice())
    .sort((a, b) => intervalWeight(b.interval) - intervalWeight(a.interval));

  for (const task of tasks) {
    const candidates = employees.filter((name) => {
      const rules = getRulesFor(name);
      return !rules.exclude.includes(task.id);
    });

    const usable = candidates.length ? candidates : employees;

    const preferred = usable.filter((name) => getRulesFor(name).prefer.includes(task.id));
    const pool = preferred.length ? preferred : usable;

    let best = pool[0];
    for (const name of pool) {
      if (load[name] < load[best]) best = name;
    }

    assignments[task.id] = best;
    load[best] += intervalWeight(task.interval);
  }

  return assignments;
}

function assignOnlyDueTasksWeighted(employees, tasksOverride) {
  const result = { ...(STATE.assignments || {}) };
  if (!employees || !employees.length) return result;

  const load = {};
  employees.forEach((e) => (load[e] = 0));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = (tasksOverride ? tasksOverride.slice() : getAllTasks().filter((t) => isTaskDue(t, today)))
    .slice()
    .sort((a, b) => intervalWeight(b.interval) - intervalWeight(a.interval));

  for (const task of tasks) {
    const candidates = employees.filter((name) => {
      const rules = getRulesFor(name);
      return !rules.exclude.includes(task.id);
    });

    const usable = candidates.length ? candidates : employees;

    const preferred = usable.filter((name) => getRulesFor(name).prefer.includes(task.id));
    const pool = preferred.length ? preferred : usable;

    let best = pool[0];
    for (const name of pool) {
      if (load[name] < load[best]) best = name;
    }

    result[task.id] = best;
    load[best] += intervalWeight(task.interval);
  }

  return result;
}

function assignTasksFairly(employees) {
  const assignments = {};
  if (!employees.length) return assignments;
  let idx = 0;
  for (const task of getAllTasks()) {
    assignments[task.id] = employees[idx % employees.length];
    idx++;
  }
  return assignments;
}

// ========================== PAGINA DA FARE ==========================

function createTaskElement(task, assignee) {
  const employees = STATE.employees || [];

  const item = document.createElement("div");
  item.className = "task-item";
  item.dataset.taskId = task.id;

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.name;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const badgeInterval = document.createElement("span");
  badgeInterval.className = "badge badge-interval";
  badgeInterval.textContent = intervalToLabel(task.interval);
  meta.appendChild(badgeInterval);

  const dueDate = computeDueDate(task);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueMid = new Date(dueDate);
  dueMid.setHours(0, 0, 0, 0);

  const badgeStatus = document.createElement("span");
  badgeStatus.className = "badge badge-status";
  if (dueMid.getTime() === today.getTime()) {
    badgeStatus.textContent = "Scade oggi (" + formatDateItalian(dueDate) + ")";
  } else if (dueMid < today) {
    const diffDays = Math.round((today - dueMid) / (24 * 60 * 60 * 1000));
    badgeStatus.textContent = diffDays === 1
      ? "Scaduto da 1 giorno"
      : "Scaduto da " + diffDays + " giorni";
  } else {
    badgeStatus.textContent = "Scadenza: " + formatDateItalian(dueDate);
  }
  meta.appendChild(badgeStatus);

  if (assignee) {
    const badgeAssignee = document.createElement("span");
    badgeAssignee.className = "badge badge-assignee";
    badgeAssignee.textContent = "Assegnato a: " + assignee;
    meta.appendChild(badgeAssignee);
  } else {
    const noAssignee = document.createElement("span");
    noAssignee.className = "badge badge-assignee";
    noAssignee.textContent = "Nessun dipendente assegnato";
    noAssignee.style.background = "#fee2e2";
    noAssignee.style.color = "#b91c1c";
    meta.appendChild(noAssignee);
  }

  const controls = document.createElement("div");
  controls.className = "task-controls";

  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = employees.length
    ? "Chi ha fatto il lavoro?"
    : "Aggiungi dipendenti in Impostazioni";
  select.appendChild(defaultOption);

  for (const emp of employees) {
    const opt = document.createElement("option");
    opt.value = emp;
    opt.textContent = emp;
    select.appendChild(opt);
  }

  const completeButton = document.createElement("button");
  completeButton.textContent = "Segna completato";
  completeButton.className = "secondary";
  completeButton.disabled = !employees.length;

  completeButton.addEventListener("click", async () => {
    const performer = select.value;
    if (!performer) {
      showAlert("Seleziona il dipendente che ha fatto il lavoro.");
      return;
    }
    await markTaskCompleted(task, assignee, performer);
  });

  controls.appendChild(select);
  controls.appendChild(completeButton);

  item.appendChild(title);

  const noteText = getTaskNote(task.id);
  if (noteText) {
    const note = document.createElement("div");
    note.className = "task-note";
    note.textContent = noteText;
    item.appendChild(note);
  }

  item.appendChild(meta);
  item.appendChild(controls);

  return item;
}

function getTodoFilters() {
  const qEl = document.getElementById("todo-search");
  const empEl = document.getElementById("todo-filter-employee");
  const intEl = document.getElementById("todo-filter-interval");
  const q = (qEl && qEl.value ? qEl.value : "").trim().toLowerCase();
  const emp = empEl && empEl.value ? empEl.value : "";
  const interval = intEl && intEl.value ? intEl.value : "";
  return { q, emp, interval };
}

function taskMatchesTodoFilters(task, assignee) {
  const { q, emp, interval } = getTodoFilters();

  if (interval && task.interval !== interval) return false;
  if (emp && assignee !== emp) return false;

  if (q) {
    const hay = (task.name + " " + (assignee || "")).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function setupTodoFilters() {
  const empSel = document.getElementById("todo-filter-employee");
  if (empSel) {
    empSel.innerHTML =
      '<option value="">Tutti</option>' +
      (STATE.employees || []).map((e) => `<option value="${e}">${e}</option>`).join("");
  }

  ["todo-search", "todo-filter-employee", "todo-filter-interval"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", renderTasksDue);
    el.addEventListener("change", renderTasksDue);
  });
}
function renderTasksDue() {
  const containers = {
    settimana: document.getElementById("list-settimana"),
    mese: document.getElementById("list-mese"),
    "due-mesi": document.getElementById("list-due-mesi"),
    anno: document.getElementById("list-anno")
  };

  if (!containers.settimana && !containers.mese && !containers["due-mesi"] && !containers.anno) {
    return;
  }

  Object.values(containers).forEach((el) => {
    if (el) el.innerHTML = "";
  });

  const today = new Date();

  for (const task of getAllTasks()) {
    if (!isTaskDue(task, today)) continue;

    const assignee = (STATE.assignments || {})[task.id] || "";
    if (!taskMatchesTodoFilters(task, assignee)) continue;

    const container = containers[task.interval];
    if (!container) continue;
    const el = createTaskElement(task, assignee);
    container.appendChild(el);
  }

  for (const [interval, container] of Object.entries(containers)) {
    if (!container) continue;
    if (!container.children.length) {
      const empty = document.createElement("p");
      empty.className = "hint small";
      empty.textContent = "Nessun lavoro in scadenza per questo intervallo.";
      container.appendChild(empty);
    }
  }
}

async function initTodoPage() {
  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  setupTodoFilters();
  renderTasksDue();
  renderSyncStatus();

  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      const allButtons = document.querySelectorAll(".tab-button");
      const allContents = document.querySelectorAll(".tab-content");

      allButtons.forEach((b) => {
        b.classList.toggle("active", b.dataset.tab === tabName);
      });
      allContents.forEach((content) => {
        content.classList.toggle("active", content.id === "tab-" + tabName);
      });
    });
  });

  window.addEventListener("online", async () => {
    await flushPendingStateIfAny();
    renderSyncStatus();
  });
  window.addEventListener("offline", () => {
    renderSyncStatus();
  });
}

// ========================== PAGINA COMPLETATI ==========================


function getCompletedFilters() {
  const qEl = document.getElementById("completed-search");
  const rangeEl = document.getElementById("completed-filter-range");
  const groupEl = document.getElementById("completed-group-toggle");

  const q = (qEl && qEl.value ? qEl.value : "").trim().toLowerCase();
  const range = rangeEl && rangeEl.value ? rangeEl.value : "all";
  const group = groupEl && groupEl.checked ? true : false;

  return { q, range, group };
}

function filterCompletedItems(items) {
  const f = getCompletedFilters();
  const now = new Date();

  let out = items.slice();

  if (f.range === "30") {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    out = out.filter((c) => c.completedAt && new Date(c.completedAt) >= cutoff);
  } else if (f.range === "90") {
    const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    out = out.filter((c) => c.completedAt && new Date(c.completedAt) >= cutoff);
  }

  if (f.q) {
    out = out.filter((c) => {
      const hay = ((c.taskName || "") + " " + (c.performedBy || "") + " " + (c.assignedTo || "")).toLowerCase();
      return hay.includes(f.q);
    });
  }

  return out;
}

function setupCompletedFilters() {
  const ids = ["completed-search", "completed-filter-range", "completed-group-toggle"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", renderCompletedList);
    el.addEventListener("change", renderCompletedList);
  });
}
function renderCompletedList() {
  const list = document.getElementById("completed-list");
  if (!list) return;

  list.innerHTML = "";

  const completedRaw = STATE.completed || [];

  if (!completedRaw.length) {
    const empty = document.createElement("p");
    empty.className = "hint small";
    empty.textContent = "Nessun lavoro completato ancora.";
    list.appendChild(empty);
    return;
  }

  const filtered = filterCompletedItems(completedRaw);

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "hint small";
    empty.textContent = "Nessun completamento corrisponde ai filtri.";
    list.appendChild(empty);
    return;
  }

  const f = getCompletedFilters();

  const sorted = filtered.slice().sort((a, b) => {
    const da = new Date(a.completedAt || 0).getTime();
    const db = new Date(b.completedAt || 0).getTime();
    return db - da;
  });

  if (f.group) {
    const groups = {};
    sorted.forEach((it) => {
      const key = it.taskName || "Senza nome";
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    });

    Object.keys(groups).sort().forEach((taskName) => {
      const h = document.createElement("div");
      h.className = "completed-group-title";
      h.textContent = taskName;
      list.appendChild(h);

      groups[taskName].forEach((item) => {
        list.appendChild(createCompletedItemElement(item));
      });
    });

    return;
  }

  for (const item of sorted) {
    list.appendChild(createCompletedItemElement(item));
  }
}

function createCompletedItemElement(item) {
  const div = document.createElement("div");
  div.className = "completed-item";

  const title = document.createElement("div");
  title.className = "completed-title";
  title.textContent = item.taskName;

  const meta = document.createElement("div");
  meta.className = "completed-meta";

  const spanInterval = document.createElement("span");
  spanInterval.textContent = "Intervallo: " + (item.intervalLabel || item.interval || "");

  const spanAssign = document.createElement("span");
  spanAssign.textContent = "Assegnato a: " + (item.assignedTo || "non specificato");

  const spanPerf = document.createElement("span");
  spanPerf.textContent = "Eseguito da: " + (item.performedBy || "non specificato");

  const spanDate = document.createElement("span");
  spanDate.textContent = "Data: " + formatDateTimeItalian(item.completedAt);

  const spanLate = document.createElement("span");
  if (typeof item.lateByDays === "number" && item.lateByDays > 0) {
    spanLate.textContent = "Ritardo: " + item.lateByDays + " gg";
  } else {
    spanLate.textContent = "Ritardo: 0 gg";
  }

  meta.appendChild(spanInterval);
  meta.appendChild(spanAssign);
  meta.appendChild(spanPerf);
  meta.appendChild(spanDate);
  meta.appendChild(spanLate);

  const actions = document.createElement("div");
  actions.className = "completed-actions";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "secondary";
  removeBtn.textContent = "Rimuovi da completati";
  removeBtn.addEventListener("click", () => {
    removeCompletion(item);
  });

  actions.appendChild(removeBtn);

  div.appendChild(title);
  div.appendChild(meta);
  div.appendChild(actions);

  return div;
}

function initManualCompletion() {
  const sel = document.getElementById("manual-task-select");
  if (!sel) return;

  sel.innerHTML = "";
  getAllTasks().forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name + " (" + intervalToLabel(t.interval) + ")";
    sel.appendChild(opt);
  });

  const btn = document.getElementById("manual-add-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const taskId = sel.value;
    const performer = document.getElementById("manual-performer").value.trim();
    const assigned = document.getElementById("manual-assigned").value.trim();
    const date = document.getElementById("manual-date").value;

    if (!taskId || !performer || !date) {
      showAlert("Compila almeno lavoro, eseguito da e data.");
      return;
    }

    const task = getAllTasks().find((t) => t.id === taskId);
    if (!task) {
      showAlert("Lavoro non trovato.");
      return;
    }

    const completed = STATE.completed || [];
    const completedAt = new Date(date).toISOString();
    const dueAtDate = computeDueDate(task, new Date(date));
    const dueAt = dueAtDate.toISOString();

    const d0 = new Date(date);
    d0.setHours(0, 0, 0, 0);
    const dDue = new Date(dueAt);
    dDue.setHours(0, 0, 0, 0);
    const lateByDays = Math.max(0, Math.round((d0 - dDue) / (24 * 60 * 60 * 1000)));

    completed.push({
      taskId: task.id,
      taskName: task.name,
      interval: task.interval,
      intervalLabel: intervalToLabel(task.interval),
      assignedTo: assigned || null,
      performedBy: performer,
      dueAt,
      lateByDays,
      completedAt
    });
    STATE.completed = pruneCompletedList(completed);

    // reset posticipo perché abbiamo registrato un completamento
    if (STATE.dueAdjustments) {
      delete STATE.dueAdjustments[task.id];
    }

    await saveStateToFirestore();
    renderCompletedList();
    showAlert("Lavoro aggiunto allo storico.");
  });
}

async function initCompletedPage() {
  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  initManualCompletion();
  setupCompletedFilters();
  renderCompletedList();
  renderSyncStatus();

  window.addEventListener("online", async () => {
    await flushPendingStateIfAny();
    renderSyncStatus();
  });
  window.addEventListener("offline", () => {
    renderSyncStatus();
  });
}

// ========================== HOME ==========================

function countDueTasks() {
  const today = new Date();
  let count = 0;
  for (const task of getAllTasks()) {
    if (isTaskDue(task, today)) count++;
  }
  return count;
}

function updateHomeSummary() {
  const spanDue = document.getElementById("count-due");
  const spanTotal = document.getElementById("count-completed-total");
  if (!spanDue && !spanTotal) return;

  const completed = STATE.completed || [];
  const dueCount = countDueTasks();
  const totalCount = completed.length;

  if (spanDue) spanDue.textContent = String(dueCount);
  if (spanTotal) spanTotal.textContent = String(totalCount);
}

function maybeNotifyDueTasks() {
  // notifica al massimo una volta al giorno
  try {
    const last = localStorage.getItem(NOTIFY_KEY);
    const todayStr = new Date().toISOString().slice(0, 10);
    if (last === todayStr) return;
    localStorage.setItem(NOTIFY_KEY, todayStr);
  } catch (e) {
    console.error("Notify storage error", e);
  }

  const entries = getScadenzeEntries();
  if (!entries.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const late = [];
  const todayDue = [];

  for (const e of entries) {
    const d = new Date(e.dueDate);
    d.setHours(0, 0, 0, 0);

    if (d < today) {
      late.push(e);
    } else if (d.getTime() === today.getTime()) {
      todayDue.push(e);
    }
  }

  if (!late.length && !todayDue.length) return;

  let msg = "";
  if (late.length) {
    msg += `Hai ${late.length} lavoro/i in RITARDO.\n`;
  }
  if (todayDue.length) {
    msg += `Hai ${todayDue.length} lavoro/i che SCADONO OGGI.`;
  }

  showAlert(msg.trim(), "Promemoria turni");
}


function getTasksDueToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = getAllTasks();
  const out = [];

  for (const task of tasks) {
    const due = computeDueDate(task, today);
    const d = new Date(due);
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === today.getTime()) {
      out.push(task);
    }
  }

  return out;
}

function renderTodaySection() {
  const box = document.getElementById("today-list");
  const bulkBtn = document.getElementById("today-complete-all-btn");
  if (!box) return;

  const tasks = getTasksDueToday();
  box.innerHTML = "";

  if (!tasks.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessun lavoro scade oggi.";
    box.appendChild(p);
    if (bulkBtn) bulkBtn.disabled = true;
    return;
  }

  if (bulkBtn) bulkBtn.disabled = false;

  tasks.forEach((task) => {
    const assignee = (STATE.assignments || {})[task.id] || "";
    const row = document.createElement("div");
    row.className = "today-row";

    const name = document.createElement("span");
    name.textContent = task.name;

    const who = document.createElement("span");
    who.className = "badge badge-assignee";
    who.textContent = assignee ? assignee : "Da assegnare";

    row.appendChild(name);
    row.appendChild(who);

    box.appendChild(row);
  });
}

async function completeAllTodayTasks() {
  const tasks = getTasksDueToday();
  const employees = STATE.employees || [];
  if (!tasks.length) return;

  if (!employees.length) {
    showAlert("Aggiungi dipendenti prima di segnare completamenti.");
    return;
  }

  for (const task of tasks) {
    const assignee = (STATE.assignments || {})[task.id] || "";
    const performer = assignee && employees.indexOf(assignee) !== -1 ? assignee : employees[0];
    await markTaskCompleted(task, assignee, performer);
  }
}

function renderDailyWorkloadByPerson() {
  const box = document.getElementById("daily-workload");
  if (!box) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employees = STATE.employees || [];
  const assignments = STATE.assignments || {};
  const tasks = getAllTasks();

  const map = {};
  employees.forEach((e) => (map[e] = []));

  const unassigned = [];

  tasks.forEach((task) => {
    const due = computeDueDate(task, today);
    const d = new Date(due);
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === today.getTime()) {
      const assignee = assignments[task.id];
      if (assignee && map[assignee]) {
        map[assignee].push(task);
      } else {
        unassigned.push(task);
      }
    }
  });

  box.innerHTML = "";

  if (!employees.length && !unassigned.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessun dato disponibile.";
    box.appendChild(p);
    return;
  }

  employees.forEach((name) => {
    const items = map[name] || [];
    const row = document.createElement("div");
    row.className = "workload-row";

    const label = document.createElement("div");
    label.className = "workload-name";
    label.textContent = name;

    const count = document.createElement("div");
    count.className = "workload-count";
    count.textContent = items.length + " lavori";

    row.appendChild(label);
    row.appendChild(count);

    if (items.length) {
      const ul = document.createElement("ul");
      ul.className = "workload-list";
      items.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t.name;
        ul.appendChild(li);
      });
      row.appendChild(ul);
    }

    box.appendChild(row);
  });

  if (unassigned.length) {
    const sep = document.createElement("div");
    sep.className = "completed-group-title";
    sep.textContent = "Da assegnare";
    box.appendChild(sep);

    const ul = document.createElement("ul");
    ul.className = "workload-list";
    unassigned.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t.name;
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }
}
async function initHomePage() {
  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  updateHomeSummary();
  maybeNotifyDueTasks();
  renderTodaySection();
  renderDailyWorkloadByPerson();
  renderSyncStatus();

  const bulkBtn = document.getElementById("today-complete-all-btn");
  if (bulkBtn) {
    bulkBtn.addEventListener("click", async () => {
      const ok = await showConfirm("Vuoi segnare come completati tutti i lavori che scadono oggi?", "Completa lavori di oggi");
      if (!ok) return;
      await completeAllTodayTasks();
      renderTodaySection();
      renderDailyWorkloadByPerson();
    });
  }

  window.addEventListener("online", async () => {
    await flushPendingStateIfAny();
    renderSyncStatus();
  });
  window.addEventListener("offline", () => {
    renderSyncStatus();
  });
}

// ========================== SCADENZE ==========================

function getScadenzeEntries() {
  const entries = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignments = STATE.assignments || {};

  for (const task of getAllTasks()) {
    const dueDate = computeDueDate(task, today);
    const assignee = assignments[task.id] || null;

    entries.push({
      taskId: task.id,
      taskName: task.name,
      interval: task.interval,
      intervalLabel: intervalToLabel(task.interval),
      assignee,
      dueDate
    });
  }

  entries.sort((a, b) => a.dueDate - b.dueDate);
  return entries;
}

async function postponeTask(taskId, days) {
  await ensureStateLoaded();
  if (!STATE.dueAdjustments) STATE.dueAdjustments = {};
  STATE.dueAdjustments[taskId] = (STATE.dueAdjustments[taskId] || 0) + days;
  await saveStateToFirestore();

  // aggiorna viste
  renderTasksDue();
  renderAllScadenzeViews();
  updateHomeSummary();

  showAlert("Scadenza posticipata di " + days + " giorni.");
}

function createScadenzaItem(entry) {
  const div = document.createElement("div");
  div.className = "scadenza-item";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = entry.taskName;

  const meta = document.createElement("div");
  meta.className = "scadenza-meta";

  const badgeInterval = document.createElement("span");
  badgeInterval.className = "badge badge-interval";
  badgeInterval.textContent = entry.intervalLabel;
  meta.appendChild(badgeInterval);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(entry.dueDate);
  due.setHours(0, 0, 0, 0);

  const badgeStatus = document.createElement("span");
  badgeStatus.className = "badge badge-status";

  if (due.getTime() === today.getTime()) {
    badgeStatus.classList.add("badge-today");
    badgeStatus.textContent = "Scade oggi (" + formatDateItalian(due) + ")";
  } else if (due < today) {
    badgeStatus.classList.add("badge-overdue");
    const diffDays = Math.round((today - due) / (24 * 60 * 60 * 1000));
    badgeStatus.textContent =
      diffDays === 1
        ? "Scaduto da 1 giorno (" + formatDateItalian(due) + ")"
        : "Scaduto da " + diffDays + " giorni (" + formatDateItalian(due) + ")";
  } else {
    const diffDays = Math.round((due - today) / (24 * 60 * 60 * 1000));
    if (diffDays === 1) {
      badgeStatus.classList.add("badge-soon");
      badgeStatus.textContent = "Scade domani (" + formatDateItalian(due) + ")";
    } else if (diffDays <= 3) {
      badgeStatus.classList.add("badge-soon");
      badgeStatus.textContent = "Scade tra " + diffDays + " giorni (" + formatDateItalian(due) + ")";
    } else {
      badgeStatus.classList.add("badge-ok");
      badgeStatus.textContent = "Scade tra " + diffDays + " giorni (" + formatDateItalian(due) + ")";
    }
  }
  meta.appendChild(badgeStatus);

  if (entry.assignee) {
    const badgeAssignee = document.createElement("span");
    badgeAssignee.className = "badge badge-assignee";
    badgeAssignee.textContent = "Assegnato a: " + entry.assignee;
    meta.appendChild(badgeAssignee);
  }

  const postponeRow = document.createElement("div");
  postponeRow.className = "scadenze-postpone-buttons";

  const label = document.createElement("span");
  label.className = "hint small";
  label.textContent = "Posticipa:";
  postponeRow.appendChild(label);

  [1, 3, 7, 30].forEach((days) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary";
    btn.textContent = "+" + days + "g";
    btn.addEventListener("click", () => {
      postponeTask(entry.taskId, days);
    });
    postponeRow.appendChild(btn);
  });

  div.appendChild(title);

  const noteText = getTaskNote(entry.taskId);
  if (noteText) {
    const note = document.createElement("div");
    note.className = "task-note";
    note.textContent = noteText;
    div.appendChild(note);
  }

  div.appendChild(meta);
  div.appendChild(postponeRow);
  return div;
}

function renderScadenzeList(entries) {
  const container = document.getElementById("scad-view-list");
  if (!container) return;
  container.innerHTML = "";

  if (!entries.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessuna scadenza trovata.";
    container.appendChild(p);
    return;
  }

  entries.forEach((e) => {
    container.appendChild(createScadenzaItem(e));
  });
}

function renderScadenzeByIntervals(entries) {
  const container = document.getElementById("scad-view-intervals");
  if (!container) return;
  container.innerHTML = "";

  if (!entries.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessuna scadenza trovata.";
    container.appendChild(p);
    return;
  }

  const groups = {
    settimana: [],
    mese: [],
    "due-mesi": [],
    anno: []
  };

  entries.forEach((e) => {
    groups[e.interval] = groups[e.interval] || [];
    groups[e.interval].push(e);
  });

  for (const interval of ["settimana", "mese", "due-mesi", "anno"]) {
    const list = groups[interval] || [];
    if (!list.length) continue;

    const title = document.createElement("div");
    title.className = "scadenze-group-title";
    title.textContent = intervalToLabel(interval).toUpperCase();
    container.appendChild(title);

    list.forEach((e) => {
      container.appendChild(createScadenzaItem(e));
    });
  }
}

function renderScadenzeDashboard(entries) {
  const container = document.getElementById("scad-view-dashboard");
  if (!container) return;
  container.innerHTML = "";

  if (!entries.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessuna scadenza trovata.";
    container.appendChild(p);
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = {
    late: [],
    today: [],
    three: [],
    seven: [],
    future: []
  };

  entries.forEach((e) => {
    const d = new Date(e.dueDate);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / (24 * 60 * 60 * 1000));

    if (d < today) buckets.late.push(e);
    else if (diff === 0) buckets.today.push(e);
    else if (diff <= 3) buckets.three.push(e);
    else if (diff <= 7) buckets.seven.push(e);
    else buckets.future.push(e);
  });

  const sections = [
    { key: "late", label: "In ritardo" },
    { key: "today", label: "Scadono oggi" },
    { key: "three", label: "Entro 3 giorni" },
    { key: "seven", label: "Entro 7 giorni" },
    { key: "future", label: "Più avanti" }
  ];

  sections.forEach((sec) => {
    const list = buckets[sec.key];
    if (!list || !list.length) return;

    const title = document.createElement("div");
    title.className = "scadenze-group-title";
    title.textContent = sec.label;
    container.appendChild(title);

    list.forEach((e) => {
      container.appendChild(createScadenzaItem(e));
    });
  });
}

function getScadFilters() {
  const qEl = document.getElementById("scad-search");
  const empEl = document.getElementById("scad-filter-employee");
  const intEl = document.getElementById("scad-filter-interval");
  const q = (qEl && qEl.value ? qEl.value : "").trim().toLowerCase();
  const emp = empEl && empEl.value ? empEl.value : "";
  const interval = intEl && intEl.value ? intEl.value : "";
  return { q, emp, interval };
}

function filterScadEntries(entries) {
  const { q, emp, interval } = getScadFilters();
  return entries.filter((e) => {
    if (interval && e.interval !== interval) return false;
    if (emp && e.assignee !== emp) return false;
    if (q) {
      const hay = (e.taskName + " " + (e.assignee || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function setupScadFilters(entriesProvider) {
  const empSel = document.getElementById("scad-filter-employee");
  if (empSel) {
    empSel.innerHTML =
      '<option value="">Tutti</option>' +
      (STATE.employees || []).map((e) => `<option value="${e}">${e}</option>`).join("");
  }

  const rerender = () => {
    const entries = entriesProvider();
    renderScadenzeList(filterScadEntries(entries));
  };

  ["scad-search", "scad-filter-employee", "scad-filter-interval"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", rerender);
    el.addEventListener("change", rerender);
  });

  // prima render
  const entries = entriesProvider();
  renderScadenzeList(filterScadEntries(entries));
}
function renderAllScadenzeViews() {
  const entries = getScadenzeEntries();
  renderScadenzeByIntervals(entries);
  renderScadenzeDashboard(entries);
  if (document.getElementById("scad-search")) {
    setupScadFilters(() => entries);
  } else {
    renderScadenzeList(entries);
  }
}

async function initScadenzePage() {
  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  renderAllScadenzeViews();
  renderSyncStatus();

  const buttons = document.querySelectorAll(".scad-tab-button");
  const views = {
    list: document.getElementById("scad-view-list"),
    intervals: document.getElementById("scad-view-intervals"),
    dashboard: document.getElementById("scad-view-dashboard")
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      Object.entries(views).forEach(([name, el]) => {
        if (!el) return;
        el.classList.toggle("active", name === view);
      });
    });
  });

  window.addEventListener("online", async () => {
    await flushPendingStateIfAny();
    renderSyncStatus();
  });
  window.addEventListener("offline", () => {
    renderSyncStatus();
  });
}

// ========================== COMPLETAMENTO / POSTICIPO ==========================

async function markTaskCompleted(task, assignedTo, performedBy) {
  await ensureStateLoaded();


  const completed = STATE.completed || [];

  const dueAtDate = computeDueDate(task, new Date());
  const dueAtIso = dueAtDate.toISOString();
  const completedAtIso = new Date().toISOString();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueD = new Date(dueAtIso);
  dueD.setHours(0, 0, 0, 0);
  const lateByDays = Math.max(0, Math.round((today - dueD) / (24 * 60 * 60 * 1000)));

  completed.push({
    taskId: task.id,
    taskName: task.name,
    interval: task.interval,
    intervalLabel: intervalToLabel(task.interval),
    assignedTo: assignedTo || null,
    performedBy,
    dueAt: dueAtIso,
    lateByDays,
    completedAt: completedAtIso
  });
  STATE.completed = pruneCompletedList(completed);

  const employees = STATE.employees || [];
  const assignments = STATE.assignments || {};

  let nextAssigned = assignedTo || null;

  if (employees.length) {
    if (!assignedTo && performedBy) {
      nextAssigned = performedBy;
    }

    if (nextAssigned) {
      const idx = employees.indexOf(nextAssigned);
      if (idx !== -1) {
        if (performedBy === nextAssigned) {
          const nextIdx = (idx + 1) % employees.length;
          nextAssigned = employees[nextIdx];
        }
      }
    }
  }

  if (nextAssigned) {
    assignments[task.id] = nextAssigned;
    STATE.assignments = assignments;
  }

  // reset eventuale posticipo perché il lavoro è stato eseguito
  if (STATE.dueAdjustments) {
    delete STATE.dueAdjustments[task.id];
  }

  await saveStateToFirestore();

  renderCompletedList();
  renderTasksDue();
  updateHomeSummary();
  renderAllScadenzeViews();
}

async function removeCompletion(item) {
  await ensureStateLoaded();

  STATE.completed = (STATE.completed || []).filter((c) => {
    return !(
      c.taskId === item.taskId &&
      c.completedAt === item.completedAt &&
      c.performedBy === item.performedBy
    );
  });

  await saveStateToFirestore();

  renderCompletedList();
  if (document.getElementById("list-settimana")) {
    renderTasksDue();
  }
  if (document.getElementById("count-due")) {
    updateHomeSummary();
  }
  renderAllScadenzeViews();

  showAlert("Lavoro rimosso dai completati. Se è di nuovo in scadenza, lo ritrovi in 'Da Fare'.");
}

function lastNDays(dateIso, n) {
  const d = new Date(dateIso);
  const now = new Date();
  const cutoff = new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  return d >= cutoff;
}

function renderStats() {
  const completed = STATE.completed || [];

  const summary = document.getElementById("stats-summary");
  const byEmp = document.getElementById("stats-by-employee");
  const lateBox = document.getElementById("stats-late");

  if (!summary || !byEmp || !lateBox) return;

  const last30 = completed.filter((c) => c.completedAt && lastNDays(c.completedAt, 30));

  summary.innerHTML = "";
  const p1 = document.createElement("p");
  p1.className = "hint";
  p1.textContent = `Completamenti totali registrati: ${completed.length}. Ultimi 30 giorni: ${last30.length}.`;
  summary.appendChild(p1);

  const counts = {};
  last30.forEach((c) => {
    const name = c.performedBy || "Sconosciuto";
    counts[name] = (counts[name] || 0) + 1;
  });

  byEmp.innerHTML = "";
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!rows.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Nessun completamento negli ultimi 30 giorni.";
    byEmp.appendChild(p);
  } else {
    rows.forEach(([name, n]) => {
      const div = document.createElement("div");
      div.className = "stat-row";
      div.textContent = `${name}: ${n}`;
      byEmp.appendChild(div);
    });
  }

  const lateBy = {};
  const lateCount = {};

  completed.forEach((c) => {
    if (typeof c.lateByDays !== "number") return;
    const name = c.performedBy || "Sconosciuto";
    lateBy[name] = (lateBy[name] || 0) + c.lateByDays;
    lateCount[name] = (lateCount[name] || 0) + 1;
  });

  lateBox.innerHTML = "";
  const lateRows = Object.keys(lateBy)
    .map((name) => {
      const avg = lateBy[name] / (lateCount[name] || 1);
      return [name, avg];
    })
    .sort((a, b) => b[1] - a[1]);

  if (!lateRows.length) {
    const p = document.createElement("p");
    p.className = "hint small";
    p.textContent = "Dati ritardo non disponibili.";
    lateBox.appendChild(p);
  } else {
    lateRows.forEach(([name, avg]) => {
      const div = document.createElement("div");
      div.className = "stat-row";
      div.textContent = `${name}: ${avg.toFixed(1)} giorni medi di ritardo`;
      lateBox.appendChild(div);
    });
  }
}

function setupExportButtons() {
  const csvBtn = document.getElementById("export-csv-btn");
  const jsonBtn = document.getElementById("export-json-btn");

  if (csvBtn) {
    csvBtn.addEventListener("click", () => {
      const rows = (STATE.completed || []).map((c) => ({
        taskId: c.taskId,
        taskName: c.taskName,
        interval: c.interval,
        assignedTo: c.assignedTo || "",
        performedBy: c.performedBy || "",
        dueAt: c.dueAt || "",
        lateByDays: typeof c.lateByDays === "number" ? c.lateByDays : "",
        completedAt: c.completedAt || ""
      }));

      const csv = toCSV(rows);
      downloadTextFile("turni-completati.csv", csv, "text/csv");
    });
  }

  if (jsonBtn) {
    jsonBtn.addEventListener("click", () => {
      const json = JSON.stringify(STATE.completed || [], null, 2);
      downloadTextFile("turni-completati.json", json, "application/json");
    });
  }
}

async function initStatsPage() {
  await ensureStateLoaded();
  applyTheme();
  await flushPendingStateIfAny();
  renderStats();
  setupExportButtons();
  renderSyncStatus();

  window.addEventListener("online", async () => {
    await flushPendingStateIfAny();
    renderSyncStatus();
  });
  window.addEventListener("offline", () => {
    renderSyncStatus();
  });
}

// ========================== INIZIALIZZAZIONE PAGINE ==========================

document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body ? document.body.dataset.page : null;
  let p = null;

  if (pageType === "settings") {
    p = initSettingsPage();
  } else if (pageType === "todo") {
    p = initTodoPage();
  } else if (pageType === "completed") {
    p = initCompletedPage();
  } else if (pageType === "home") {
    p = initHomePage();
  } else if (pageType === "scadenze") {
    p = initScadenzePage();
  } else {
    if (document.getElementById("employees-input")) {
      p = initSettingsPage();
    } else if (document.getElementById("completed-list")) {
      p = initCompletedPage();
    } else if (document.getElementById("list-settimana")) {
      p = initTodoPage();
    } else if (document.getElementById("count-due")) {
      p = initHomePage();
    } else if (document.getElementById("scad-view-list")) {
      p = initScadenzePage();
    } else if (document.body && document.body.getAttribute("data-page") === "stats") {
      p = initStatsPage();
    }
  }

  if (p && typeof p.finally === "function") {
    p.finally(hideSplash);
  } else {
    hideSplash();
  }
});