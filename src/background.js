import { translate, translateBatch, translateStream, ApiError } from "./lib/providers.js";
import { getSettings } from "./lib/defaults.js";
import { LANGUAGES } from "./lib/languages.js";

const MENU_ID = "wraithspeak-page";
const pickLang = (settings, code) =>
  LANGUAGES.some((l) => l.code === code) ? code : settings.targetLang;
const errText = (e) => (e instanceof ApiError ? e.message : "Something went wrong.");

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "translate") {
    (async () => {
      try {
        const settings = await getSettings();
        const result = await translate({ ...settings, targetLang: pickLang(settings, msg.targetLang) }, msg.text);
        sendResponse({ ok: true, ...result });
      } catch (e) {
        sendResponse({ ok: false, error: errText(e) });
      }
    })();
    return true; // async response
  }
  if (msg?.type === "translateBatch") {
    (async () => {
      try {
        const settings = await getSettings();
        const result = await translateBatch({ ...settings, targetLang: pickLang(settings, msg.targetLang) }, msg.texts);
        sendResponse({ ok: true, ...result });
      } catch (e) {
        sendResponse({ ok: false, error: errText(e) });
      }
    })();
    return true;
  }
  if (msg?.type === "languages") {
    sendResponse({ languages: LANGUAGES.map(({ code, name }) => ({ code, name })) });
    return;
  }
  if (msg?.type === "openOptions") {
    chrome.runtime.openOptionsPage();
  }
});

/* ---------- Streaming selection translation (long-lived port) ---------- */

// Best-effort cache: the service worker may be killed at any time, so this is only a speed-up.
const selCache = new Map();
const SEL_CACHE_MAX = 40;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "translateStream") return;
  const ctrl = new AbortController();
  let gone = false;
  port.onDisconnect.addListener(() => { gone = true; ctrl.abort(); });
  const send = (m) => { if (gone) return; try { port.postMessage(m); } catch { gone = true; } };
  port.onMessage.addListener(async (msg) => {
    if (msg?.type !== "translate") return;
    try {
      const settings = await getSettings();
      const s = { ...settings, targetLang: pickLang(settings, msg.targetLang) };
      const key = [s.provider, s.providers?.[s.provider]?.model || "", s.targetLang, msg.text].join("\u0001");
      const hit = selCache.get(key);
      if (hit) return send({ type: "done", ...hit });
      const res = await translateStream(s, msg.text, (text) => send({ type: "delta", text }), ctrl.signal);
      selCache.set(key, res);
      if (selCache.size > SEL_CACHE_MAX) selCache.delete(selCache.keys().next().value);
      send({ type: "done", ...res });
    } catch (e) {
      send({ type: "error", error: errText(e) });
    }
  });
});

/* ---------- Full-page translation triggers ---------- */

async function flagFailure(tabId) {
  try {
    await chrome.action.setBadgeText({ tabId, text: "!" });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#b42318" });
    setTimeout(() => chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {}), 2500);
  } catch {}
}

const pingTop = (tabId) => chrome.tabs.sendMessage(tabId, { type: "pageState" }, { frameId: 0 });

// Tabs opened before the extension was installed or reloaded have no content script yet:
// inject it on demand (allowed by activeTab / host access), then ask again.
async function pageState(tabId) {
  try { return await pingTop(tabId); } catch {}
  try {
    await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, files: ["content.js"] });
    return await pingTop(tabId);
  } catch { return null; }
}

// Toggle: the top frame decides whether this is "start" or "stop"; every frame follows.
// Returns "started" | "stopped" | "disabled" | "unavailable".
async function togglePage(tab) {
  if (!tab?.id) return "unavailable";
  const settings = await getSettings();
  if (!settings.features.page) {
    chrome.tabs.sendMessage(tab.id, { type: "pageCmd", action: "disabled" }, { frameId: 0 }).catch(() => {});
    return "disabled";
  }
  const state = await pageState(tab.id);
  if (!state) { flagFailure(tab.id); return "unavailable"; }
  const action = state.active ? "stop" : "start";
  await chrome.tabs.sendMessage(tab.id, { type: "pageCmd", action }).catch(() => {});
  return action === "start" ? "started" : "stopped";
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "pageStatus") {
    pageState(msg.tabId).then((s) => sendResponse({ active: !!s?.active, reachable: !!s }));
    return true;
  }
  if (msg?.type === "togglePage") {
    chrome.tabs.get(msg.tabId).then(togglePage).then((status) => sendResponse({ status }), () => sendResponse({ status: "unavailable" }));
    return true;
  }
});

chrome.commands.onCommand.addListener(async (name) => {
  if (name !== "toggle-page") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  togglePage(tab);
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ID) togglePage(tab);
});

// The right-click entry exists only while the full-page feature is on.
async function syncMenu() {
  const { features } = await getSettings();
  await chrome.contextMenus.removeAll();
  if (features.page) {
    chrome.contextMenus.create({ id: MENU_ID, title: "Translate this page with Wraith Translate", contexts: ["page"] });
  }
}
chrome.runtime.onInstalled.addListener(syncMenu);
chrome.runtime.onStartup.addListener(syncMenu);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.settings) syncMenu();
});
