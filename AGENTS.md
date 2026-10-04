# AGENTS.md — Wraith Translate

Browser extension (Manifest V3) that translates **selected text** and **whole pages** via 9router, any OpenAI-compatible API, Claude, or DeepL. No frameworks, no bundler, no runtime dependencies: plain ES modules and vanilla JS.

## Golden rules
1. **Edit only `src/`.** `dist/` is generated; never edit it.
2. **`src/manifest.json` is the Chromium manifest.** The Firefox manifest is derived in `build.py` (`firefox_manifest()`): `background.scripts` instead of `service_worker`, plus `browser_specific_settings.gecko`. Add new manifest keys to `src/manifest.json`; touch `build.py` only for Firefox-specific differences.
3. Build with `python3 build.py` → `dist/chromium`, `dist/firefox`, and a zip for each. Bump `version` in `src/manifest.json` for releases.
4. Use the `chrome.*` namespace everywhere (works in Chromium and Firefox MV3). Do not use `browser.*`.
5. User-visible product name is **Wraith Translate**. Internal identifiers keep the old lowercase `wraithspeak` (`#wraithspeak-host`, `data-wraithspeak-tr`, `window.__wraithspeak`); don't rename them casually.
6. Never put API keys in the page DOM or content script. All network calls happen in the service worker (or the options page for model lists/tests).

## File map (`src/`)
| File | Role |
|---|---|
| `manifest.json` | Permissions, popup, shortcut (`toggle-page`, Alt+W), content script on all URLs/frames |
| `background.js` | Service worker. Handles `translate`, `translateBatch`, `languages`, `openOptions`, `pageStatus`, `togglePage`; shortcut + context menu; injects `content.js` on demand |
| `content.js` | Runs in every page/frame. Selection button + tooltip, and the full-page translator + bottom bar. UI lives in a **closed Shadow DOM** (`#wraithspeak-host`) |
| `popup.html/css/js` | Toolbar popup: translate/restore page, target language, feature toggles, "Open settings" |
| `options.html/css/js` | Settings tab (features, provider, language) and Docs tab. Opens in a tab |
| `lib/providers.js` | All API calls. `translate()` (single), `translateBatch()` (page), `listModels()`; `complete()` is the shared LLM call |
| `lib/defaults.js` | `DEFAULTS`, `getSettings()` (deep-merges saved settings over defaults), `isConfigured()` |
| `lib/languages.js` | Target languages + DeepL codes |
| `lib/presets.js` | OpenAI-compatible service presets (base URLs) |

## Settings shape (`chrome.storage.local["settings"]`)
```js
{
  provider: "9router" | "custom" | "claude" | "deepl",
  targetLang: "id",                       // code from lib/languages.js
  features: { selection: true, page: true },
  page: { mode: "replace" | "bilingual", lazy: true },
  providers: { "9router": {baseUrl, apiKey, model}, custom: {preset, baseUrl, apiKey, model},
               claude: {apiKey, model}, deepl: {apiKey} }
}
```
Adding a setting: (1) default in `lib/defaults.js` **and** merge it in `getSettings()`; (2) form control in `options.html`, read in `readForm()`, fill in `init()` of `options.js`; (3) content script mirrors flags in `applySettings()` (its defaults are duplicated there because content scripts can't import modules); (4) document it in the Docs tab of `options.html`.

## Message protocol
| From → To | `type` | Notes |
|---|---|---|
| content → bg | `translate` `{text, targetLang?}` | Selection tooltip. Reply `{ok, text, langName, langCode, provider, detected?}` or `{ok:false, error}` |
| content → bg | `translateBatch` `{texts[], targetLang?}` | Page translation. Reply `{ok, texts[]}` same length/order |
| content → bg | `languages`, `openOptions` | |
| popup → bg | `pageStatus` `{tabId}` → `{active, reachable}` | Injects `content.js` if the tab has none |
| popup → bg | `togglePage` `{tabId}` → `{status}` | `started` / `stopped` / `disabled` / `unavailable` |
| bg → tab | `pageState` (top frame only) | Top frame is the source of truth for "is the page translated?" |
| bg → tab | `pageCmd` `{action: "start" \| "stop" \| "disabled"}` | Broadcast to **all frames**; each frame acts on itself. Only the top frame draws the bar |

Entry points that call `togglePage`: popup button, `Alt+W` command, context-menu item.

## Full-page translation (content.js, section "Full-page translation")
- `page` (module variable) is the live session, `null` when idle. Holds `seen` (WeakSet of text nodes), `groups` (element → pending units), `queue`, `cache` (text → translation), `done`, `failed`, `inflight`.
- `scan(root)` walks text nodes with a `TreeWalker`, skipping `SKIP_TAGS`, `translate="no"`, `.notranslate`, contenteditable, hidden elements, our own output (`data-wraithspeak-tr`), and text with no letters.
- **Unit** = one text node (`replace` mode, keeps the layout) or one block-level ancestor (`bilingual` mode, translation appended as a `<span data-wraithspeak-tr>` inside the block).
- `lazy: true` → `IntersectionObserver` (700px margin) queues a unit only when near the viewport; a debounced scroll listener re-scans for new content. `lazy: false` → everything queued at once.
- `pump()` keeps up to `PARALLEL` (3) requests in flight; `takeBatch()` builds batches of ≤30 unique strings / ≤2500 chars and resolves cache hits locally.
- On error: `page.error` is set, pumping stops, the bar shows Retry (re-queues `page.failed`) and Settings.
- `stopPage()` restores every `nodeValue`, removes inserted spans, disconnects observers.

## Batch translation protocol (lib/providers.js)
- DeepL: native array in, array out.
- LLM providers: system prompt asks for a JSON array of the same length; `parseArray()` tolerates code fences. If the reply is malformed, `llmBatch()` **halves the batch recursively** down to single strings (single strings use the plain prompt, no JSON).
- `MAX_BATCH_CHARS` guards the background; selection translation is capped by `MAX_CHARS` (5000).

## Common tasks
- **Add a provider:** entry in `PROVIDERS`, a branch in `complete()` (LLM) or a dedicated function like `deeplTranslate()`, `host_permissions` in `src/manifest.json`, radio + pane in `options.html`, wiring in `options.js` (`readForm`, `missingField`, `init`), `isConfigured()` in `lib/defaults.js`, docs.
- **Add a language:** one line in `lib/languages.js` (include the DeepL code).
- **Change the look of the page bar/tooltip:** CSS string inside `content.js` (`root.innerHTML`).
- **Change the prompt:** `systemPrompt()` / `batchPrompt()` in `lib/providers.js`.

## Browser differences
- Firefox needs the user to grant site access (banner in Settings, `checkAccess()` in `options.js`, shown only when the UA contains `Firefox/`). `ensureOrigin()` therefore asks even for `localhost`.
- On-demand injection (`scripting.executeScript`) relies on `activeTab` (popup click, shortcut, context menu) so it works without all-sites access.
- Safari is not built (needs Xcode `safari-web-extension-converter`).

## Testing
Needs Python + Playwright with Chromium: `pip install playwright`. Run after `python3 build.py`:
```
python3 tests/e2e_page.py           # replace/bilingual/lazy/restore, notranslate+code skipped, feature toggles, error path
python3 tests/e2e_popup_inject.py   # popup settings save, togglePage, on-demand injection (manifest without content_scripts)
```
Both start a local mock OpenAI server, load `dist/chromium` in headless Chromium, and print `PASS`/`FAIL`. Screenshots go to `tests/out/`. Firefox is only linted: `npx web-ext lint -s dist/firefox`. Manual scenarios are in `README.md` (English) and `README.id.md` (Indonesian); keep both READMEs in sync.

## Gotchas
- `content.js` is a classic script (no `import`); it can't share code with `lib/`.
- The service worker can be killed at any time: keep no state in `background.js` globals.
- The content script is injected into **all frames**; sub-frames translate silently (no bar).
- `chrome.permissions.request` must run from a user gesture (button click handlers in `options.js`).
- Replace mode translates text node by node, so sentences split by inline tags (`<b>`, `<a>`) are translated in pieces. Bilingual mode translates whole blocks and reads better.
