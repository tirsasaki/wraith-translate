export const DEFAULTS = {
  provider: "9router",
  targetLang: "id",
  // Which translation features are active.
  features: { selection: true, page: true },
  // Full-page options. mode: "replace" swaps text in place, "bilingual" adds the
  // translation under each original block. lazy: translate only what scrolls into view.
  page: { mode: "replace", lazy: true },
  providers: {
    "9router": { baseUrl: "http://localhost:20128/v1", apiKey: "", model: "" },
    custom: { preset: "openai", baseUrl: "https://api.openai.com/v1", apiKey: "", model: "" },
    claude: { apiKey: "", model: "" },
    deepl: { apiKey: "" }
  }
};

export async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return {
    ...DEFAULTS,
    ...(settings || {}),
    features: { ...DEFAULTS.features, ...(settings?.features || {}) },
    page: { ...DEFAULTS.page, ...(settings?.page || {}) },
    providers: {
      "9router": { ...DEFAULTS.providers["9router"], ...(settings?.providers?.["9router"] || {}) },
      custom: { ...DEFAULTS.providers.custom, ...(settings?.providers?.custom || {}) },
      claude: { ...DEFAULTS.providers.claude, ...(settings?.providers?.claude || {}) },
      deepl: { ...DEFAULTS.providers.deepl, ...(settings?.providers?.deepl || {}) }
    }
  };
}

// True when the selected provider has everything it needs to translate.
export function isConfigured(settings) {
  const c = settings.providers?.[settings.provider] || {};
  if (settings.provider === "9router" || settings.provider === "custom") return !!(c.baseUrl && c.model);
  if (settings.provider === "claude") return !!(c.apiKey && c.model);
  if (settings.provider === "deepl") return !!c.apiKey;
  return false;
}
