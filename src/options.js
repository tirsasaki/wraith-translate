import { LANGUAGES } from "./lib/languages.js";
import { PRESETS } from "./lib/presets.js";
import { PROVIDERS, listModels, translate, ApiError } from "./lib/providers.js";
import { getSettings } from "./lib/defaults.js";
import { recFor, findModel, TIP } from "./lib/recommended.js";

const $ = (id) => document.getElementById(id);
let state;

/* Form elements for OpenAI-style providers (9router and Custom). */
const OPENAI_UI = {
  "9router": { base: "r-base", key: "r-key", model: "r-model", load: "r-load", status: "r-status" },
  custom: { base: "u-base", key: "u-key", model: "u-model", load: "u-load", status: "u-status" }
};

/* ---------- Tab ---------- */
function showTab(name) {
  for (const t of ["settings", "docs"]) {
    $("tab-" + t).setAttribute("aria-selected", String(t === name));
    $("panel-" + t).hidden = t !== name;
  }
}
$("tab-settings").onclick = () => showTab("settings");
$("tab-docs").onclick = () => showTab("docs");
if (location.hash.startsWith("#d-")) showTab("docs");
document.querySelectorAll(".doc nav a").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
  })
);

/* ---------- UI helpers ---------- */
function setStatus(el, msg, kind = "") {
  el.textContent = msg;
  el.className = "status" + (kind ? " " + kind : "");
}

function showPane(provider) {
  document.querySelectorAll(".pane").forEach((p) => (p.hidden = p.dataset.pane !== provider));
}

/* ---------- Recommended models ---------- */
const REC_UI = {
  "9router": { box: "r-rec", model: "r-model" },
  custom: { box: "u-rec", model: "u-model" },
  claude: { box: "c-rec", model: "c-model" }
};
const lastModels = {}; // provider -> models from the last successful load
const presetOf = (provider) => (provider === "custom" ? $("u-preset").value : "");
const isRecommended = (provider) => (m) => recFor(provider, presetOf(provider)).some((it) => findModel(it, [m]));

function renderRec(provider) {
  const ui = REC_UI[provider];
  const box = $(ui.box);
  box.textContent = "";
  const items = recFor(provider, presetOf(provider));
  const models = lastModels[provider] || [];
  if (items.length) {
    const lead = document.createElement("p");
    lead.className = "lead";
    lead.textContent = "★ Recommended for speed";
    const chips = document.createElement("div");
    chips.className = "chips";
    for (const it of items) {
      const m = findModel(it, models);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.disabled = !m;
      b.title = m ? "Use this model" : "Not in your model list yet. Connect to refresh it.";
      b.append(it.label || it.id);
      const note = document.createElement("small");
      note.textContent = it.note;
      b.append(note);
      b.onclick = () => { if (m) $(ui.model).value = m.id; };
      chips.append(b);
    }
    box.append(lead, chips);
  }
  const tip = document.createElement("p");
  tip.className = "tip";
  tip.textContent = TIP;
  box.append(tip);
}

function fillModels(select, models, selected, isRec = () => false) {
  select.textContent = "";
  if (!models.length) {
    select.append(new Option("No models found", ""));
    return;
  }
  const groups = new Map();
  for (const m of models) {
    const g = m.group || "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(m);
  }
  for (const [g, items] of groups) {
    const parent = g ? Object.assign(document.createElement("optgroup"), { label: g }) : select;
    for (const m of items) parent.append(new Option((isRec(m) ? "★ " : "") + m.label, m.id));
    if (g) select.append(parent);
  }
  const ids = models.map((m) => m.id);
  select.value = ids.includes(selected) ? selected : ids[0];
}

async function ensureOrigin(baseUrl) {
  let u;
  try { u = new URL(baseUrl); } catch { throw new ApiError("Invalid base URL."); }
  const pattern = `${u.protocol}//${u.hostname}/*`;
  if (await chrome.permissions.contains({ origins: [pattern] })) return;
  const ok = await chrome.permissions.request({ origins: [pattern] });
  if (!ok) throw new ApiError("Permission to access this address was denied.");
}

function readForm() {
  const provider = document.querySelector("input[name=provider]:checked").value;
  const openai = (p) => ({
    baseUrl: $(OPENAI_UI[p].base).value.trim(),
    apiKey: $(OPENAI_UI[p].key).value.trim(),
    model: $(OPENAI_UI[p].model).value
  });
  return {
    provider,
    targetLang: $("lang").value,
    features: { selection: $("f-selection").checked, page: $("f-page").checked },
    page: { mode: document.querySelector("input[name=pagemode]:checked").value, lazy: $("f-lazy").checked },
    providers: {
      "9router": openai("9router"),
      custom: { preset: $("u-preset").value, ...openai("custom") },
      claude: { apiKey: $("c-key").value.trim(), model: $("c-model").value },
      deepl: { apiKey: $("d-key").value.trim() }
    }
  };
}

const MODE_HINTS = {
  replace: "Text is swapped in place and the page layout is kept.",
  bilingual: "The translation is added under each paragraph, next to the original."
};

function syncPageOptions() {
  const on = $("f-page").checked;
  $("page-opts").classList.toggle("off", !on);
  $("page-opts").querySelectorAll("input").forEach((i) => (i.disabled = !on));
  $("pm-hint").textContent = MODE_HINTS[document.querySelector("input[name=pagemode]:checked").value];
}

function updateDeeplHint() {
  const k = $("d-key").value.trim();
  $("d-plan").textContent = !k
    ? "Free-plan keys end in :fx and are detected automatically."
    : k.endsWith(":fx") ? "Free plan detected (api-free.deepl.com)." : "Pro plan detected (api.deepl.com).";
}

/* ---------- Load models ---------- */
async function loadOpenAI(provider, gesture) {
  const ui = OPENAI_UI[provider];
  const st = $(ui.status);
  const btn = $(ui.load);
  const label = PROVIDERS[provider].label;
  btn.disabled = true;
  setStatus(st, "Connecting…");
  try {
    const cfg = readForm().providers[provider];
    if (gesture) await ensureOrigin(cfg.baseUrl);
    const models = await listModels(provider, cfg);
    lastModels[provider] = models;
    fillModels($(ui.model), models, state.providers[provider].model, isRecommended(provider));
    renderRec(provider);
    setStatus(
      st,
      models.length ? `${models.length} model${models.length === 1 ? "" : "s"} available in ${label}.` : `Connected, but ${label} returned no models.`,
      models.length ? "ok" : "err"
    );
  } catch (e) {
    setStatus(st, e instanceof ApiError ? e.message : "Connection failed.", "err");
  } finally {
    btn.disabled = false;
  }
}

async function loadClaude() {
  const st = $("c-status");
  const btn = $("c-load");
  btn.disabled = true;
  setStatus(st, "Loading models…");
  try {
    const models = await listModels("claude", readForm().providers.claude);
    lastModels.claude = models;
    fillModels($("c-model"), models, state.providers.claude.model, isRecommended("claude"));
    renderRec("claude");
    setStatus(st, `${models.length} model${models.length === 1 ? "" : "s"} available.`, "ok");
  } catch (e) {
    setStatus(st, e instanceof ApiError ? e.message : "Failed to load models.", "err");
  } finally {
    btn.disabled = false;
  }
}

/* ---------- Save and test ---------- */
function missingField(form) {
  const p = form.provider;
  const c = form.providers[p];
  if (p === "9router" || p === "custom") {
    if (!c.baseUrl) return "Enter a base URL.";
    if (!c.model) return "Choose a model first (click Connect).";
    return "";
  }
  if (p === "claude") {
    if (!c.apiKey) return "Enter your Claude API key.";
    if (!c.model) return "Choose a model first (click Load models).";
    return "";
  }
  return c.apiKey ? "" : "Enter your DeepL API key.";
}

async function save() {
  const out = $("save-status");
  const form = readForm();
  try {
    if (form.provider === "9router" || form.provider === "custom") {
      const base = form.providers[form.provider].baseUrl;
      if (base) await ensureOrigin(base);
    }
  } catch (e) {
    return setStatus(out, e.message, "err");
  }
  const miss = missingField(form);
  if (miss) return setStatus(out, miss, "err");
  await chrome.storage.local.set({ settings: form });
  state = form;
  setStatus(out, "Settings saved.", "ok");
  setTimeout(() => setStatus(out, ""), 2500);
}

async function test() {
  const box = $("test-out");
  const btn = $("test");
  btn.disabled = true;
  box.className = "test-out show";
  box.textContent = "Translating…";
  try {
    const form = readForm();
    if (form.provider === "9router" || form.provider === "custom") await ensureOrigin(form.providers[form.provider].baseUrl);
    const r = await translate(form, "Hello, this is a quick connection test.");
    box.textContent = `${PROVIDERS[r.provider].label} → ${r.langName}\n\n${r.text}`;
  } catch (e) {
    box.className = "test-out show err";
    box.textContent = e instanceof ApiError ? e.message : "Something went wrong.";
  } finally {
    btn.disabled = false;
  }
}

/* ---------- Site access (Firefox asks for it explicitly; Chromium grants it at install) ---------- */
const ALL_SITES = { origins: ["https://*/*", "http://*/*"] };
async function checkAccess() {
  let ok = true;
  if (!/Firefox\//.test(navigator.userAgent)) return; // Chromium grants this at install time
  try { ok = await chrome.permissions.contains(ALL_SITES); } catch {}
  $("access-notice").hidden = ok;
}

/* ---------- Init ---------- */
// Show the installed version (read from the manifest, so it always matches the loaded build).
try {
  const v = chrome.runtime.getManifest().version;
  const el = $("ver");
  el.textContent = "v" + v;
  el.hidden = false;
} catch {}

async function init() {
  checkAccess();
  $("grant-access").onclick = async () => {
    try { await chrome.permissions.request(ALL_SITES); } catch {}
    checkAccess();
  };
  try { chrome.permissions.onAdded.addListener(checkAccess); chrome.permissions.onRemoved.addListener(checkAccess); } catch {}
  state = await getSettings();
  for (const l of LANGUAGES) $("lang").append(new Option(l.name, l.code));
  $("lang").value = state.targetLang;
  for (const p of PRESETS) $("u-preset").append(new Option(p.name, p.id));
  $("u-preset").value = state.providers.custom.preset || "other";

  $("f-selection").checked = state.features.selection;
  $("f-page").checked = state.features.page;
  $("f-lazy").checked = state.page.lazy;
  document.querySelector(`input[name=pagemode][value="${state.page.mode}"]`).checked = true;
  $("f-page").addEventListener("change", syncPageOptions);
  document.querySelectorAll("input[name=pagemode]").forEach((r) => r.addEventListener("change", syncPageOptions));
  syncPageOptions();

  document.querySelector(`input[name=provider][value="${state.provider}"]`).checked = true;
  showPane(state.provider);

  $("r-base").value = state.providers["9router"].baseUrl;
  $("r-key").value = state.providers["9router"].apiKey;
  $("u-base").value = state.providers.custom.baseUrl;
  $("u-key").value = state.providers.custom.apiKey;
  $("c-key").value = state.providers.claude.apiKey;
  $("d-key").value = state.providers.deepl.apiKey;
  updateDeeplHint();

  // Show the saved model while the fresh list loads.
  const seed = (selId, model) => model && fillModels($(selId), [{ id: model, label: model.replace(/^models\//, ""), group: "" }], model);
  seed("r-model", state.providers["9router"].model);
  seed("u-model", state.providers.custom.model);
  seed("c-model", state.providers.claude.model);

  for (const p of Object.keys(REC_UI)) renderRec(p);
  document.querySelectorAll("input[name=provider]").forEach((r) => r.addEventListener("change", () => showPane(r.value)));
  document.querySelectorAll("[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = $(b.dataset.toggle);
      const show = i.type === "password";
      i.type = show ? "text" : "password";
      b.textContent = show ? "Hide" : "Show";
    })
  );

  $("u-preset").addEventListener("change", () => {
    const p = PRESETS.find((x) => x.id === $("u-preset").value);
    if (p && p.baseUrl) $("u-base").value = p.baseUrl;
    $("u-model").textContent = "";
    $("u-model").append(new Option("Connect to load models", ""));
    lastModels.custom = [];
    renderRec("custom");
    setStatus($("u-status"), "");
  });
  $("u-base").addEventListener("input", () => {
    const match = PRESETS.find((x) => x.baseUrl && x.baseUrl === $("u-base").value.trim());
    $("u-preset").value = match ? match.id : "other";
  });

  $("d-key").addEventListener("input", updateDeeplHint);
  $("r-load").onclick = () => loadOpenAI("9router", true);
  $("u-load").onclick = () => loadOpenAI("custom", true);
  $("c-load").onclick = loadClaude;
  $("save").onclick = save;
  $("test").onclick = test;

  // Refresh model lists automatically when a config already exists.
  if (state.providers["9router"].baseUrl && state.providers["9router"].model) loadOpenAI("9router", false);
  if (state.providers.custom.baseUrl && state.providers.custom.model) loadOpenAI("custom", false);
  if (state.providers.claude.apiKey && state.providers.claude.model) loadClaude();
}
init();
