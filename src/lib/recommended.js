// Model recommendations shown on the Settings page (★ marks and the "Recommended" chips).
// Numbers come from the speed test in the README ("Choosing a model"); keep both in sync.
// An item matches a model by exact `id` (a leading "models/" is ignored) or by a `match` RegExp.
export const REC = {
  "9router": [
    { id: "gemini/gemini-3.5-flash-lite", note: "Fastest in our test (about 1 s)" },
    { id: "kr/claude-haiku-4.5", note: "Good alternative (1.5–3 s)" },
    { id: "gemini/gemini-3.1-flash-lite-preview", note: "2–4 s" }
  ],
  // Custom (OpenAI-compatible), keyed by preset id from lib/presets.js.
  custom: {
    gemini: [{ id: "gemini-3.5-flash-lite", label: "gemini-3.5-flash-lite", note: "Same model as the fastest 9router result" }]
  },
  claude: [{ match: /^claude-haiku-4-5/, label: "Claude Haiku 4.5", note: "Fastest Claude tier" }]
};

export const TIP =
  "Translation needs no reasoning: pick a small, fast model (flash-lite, mini, haiku). Reasoning models can take several seconds before the first word.";

const norm = (s) => String(s).replace(/^models\//, "");

export function recFor(provider, preset) {
  if (provider === "custom") return REC.custom[preset] || [];
  return REC[provider] || [];
}

export function findModel(item, models) {
  return models.find((m) => (item.match ? item.match.test(norm(m.id)) : norm(m.id) === item.id)) || null;
}
