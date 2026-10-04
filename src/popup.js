import { getSettings, isConfigured } from "./lib/defaults.js";
import { LANGUAGES } from "./lib/languages.js";

const $ = (id) => document.getElementById(id);
let tab = null;
let settings;

const setNote = (text, err = false) => {
  $("note").textContent = text;
  $("note").className = "note" + (err ? " err" : "");
};
const canRun = (url) => /^https?:\/\//i.test(url || "");

async function save(patch) {
  settings = await getSettings();
  settings = { ...settings, ...patch(settings) };
  await chrome.storage.local.set({ settings });
}

async function refreshPageButton() {
  const btn = $("page-btn");
  btn.classList.remove("alt");
  if (!settings.features.page) {
    btn.disabled = true;
    btn.textContent = "Translate this page";
    return setNote("Full-page translation is turned off.");
  }
  if (!canRun(tab?.url)) {
    btn.disabled = true;
    btn.textContent = "Translate this page";
    return setNote("This page can't be translated (browser or store page).", true);
  }
  btn.disabled = false;
  const st = await chrome.runtime.sendMessage({ type: "pageStatus", tabId: tab.id }).catch(() => null);
  if (st?.active) {
    btn.textContent = "Show original page";
    btn.classList.add("alt");
  } else {
    btn.textContent = "Translate this page";
  }
  if (!isConfigured(settings)) setNote("Set up a provider in settings first.", true);
  else setNote("");
}

async function init() {
  settings = await getSettings();
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  for (const l of LANGUAGES) $("lang").append(new Option(l.name, l.code));
  $("lang").value = settings.targetLang;
  $("f-selection").checked = settings.features.selection;
  $("f-page").checked = settings.features.page;

  $("lang").addEventListener("change", () => save(() => ({ targetLang: $("lang").value })));
  $("f-selection").addEventListener("change", () =>
    save((s) => ({ features: { ...s.features, selection: $("f-selection").checked } })));
  $("f-page").addEventListener("change", async () => {
    await save((s) => ({ features: { ...s.features, page: $("f-page").checked } }));
    refreshPageButton();
  });
  $("open-settings").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });
  $("page-btn").addEventListener("click", async () => {
    $("page-btn").disabled = true;
    const r = await chrome.runtime.sendMessage({ type: "togglePage", tabId: tab.id }).catch(() => null);
    const status = r?.status;
    if (status === "started" || status === "stopped") return window.close();
    $("page-btn").disabled = false;
    setNote(status === "disabled" ? "Full-page translation is turned off." : "Couldn't reach this page. Reload the tab and try again.", true);
  });

  await refreshPageButton();
}
init();
