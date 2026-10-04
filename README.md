<div align="center">

🌐 **English** · [Bahasa Indonesia](README.id.md)

<img src="src/icons/icon128.png" alt="Wraith Translate" width="96" height="96">

# Wraith Translate

**Select text or translate a whole page, right in your browser.**

A Manifest V3 browser extension for **Chrome, Edge, Brave, Opera, Vivaldi, Arc, and Firefox** that works with **9router**, **OpenAI-compatible** services (OpenAI, OpenRouter, Groq, Gemini, DeepSeek, Ollama, and more), **Claude**, and **DeepL**.

</div>

---

## Table of contents
- [Features](#features)
- [Browser support](#browser-support)
- [Installation](#installation)
- [Provider setup](#provider-setup)
- [Usage](#usage)
- [Settings](#settings)
- [Permissions and privacy](#permissions-and-privacy)
- [Project structure](#project-structure)
- [Build](#build)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Contributing](#contributing)

## Features
- **Translate selected text**: select text, click the small button next to it, and the result appears in a tooltip (with a Copy button and a *Translate to* menu for other languages that does not change your saved setting).
- **Translate a full page** with two display modes:
  - **Replace text**: text is swapped in place and the page layout is kept.
  - **Show both**: the translation is added under each paragraph while the original stays visible.
- **Translate as you scroll** (lazy): only text near the screen is sent to your provider; the rest is translated as you reach it. Saves time and cost on long pages.
- **Toolbar popup**: click the extension icon for a *Translate this page* / *Show original page* button, target language, feature switches, and *Open settings*.
- **On-page bar**: progress, language switcher, an *Original/Translation* toggle, Retry on errors, and a close button that restores the page.
- **Shortcut and context menu**: `Alt+W` and *Translate this page with Wraith Translate*.
- **4 provider types**: 9router, Custom (OpenAI-compatible), Claude, DeepL. Only the selected provider is used; settings for the others stay saved.
- **16 target languages**: Indonesian, English, Japanese, Korean, Chinese (Simplified), Arabic, Spanish, French, German, Portuguese (Brazil), Russian, Italian, Dutch, Turkish, Polish, Ukrainian. The source language is detected automatically.
- **Batching and caching**: text is sent in groups and identical strings are translated once. If a model breaks the reply format, the batch is split automatically until it works.
- **Page-safe**: code (`<pre>`, `<code>`), form fields, `translate="no"` / `class="notranslate"` elements, and hidden elements are left alone.

## Browser support

| Browser | Package | Status |
|---|---|---|
| Chrome, Edge, Brave, Opera, Vivaldi, Arc | `wraith-translate-chromium-v*.zip` | Tested on Chromium |
| Firefox 128+ | `wraith-translate-firefox-v*.zip` | Passes `web-ext lint`; not yet tested in a real Firefox |
| Safari (macOS/iOS) | not built | Needs Xcode: `xcrun safari-web-extension-converter dist/chromium` |

## Installation

### Chrome, Edge, Brave, Opera, Vivaldi, Arc
1. Extract `wraith-translate-chromium-v*.zip` into a folder (or run the [build](#build) and use `dist/chromium`).
2. Open the extensions page: `chrome://extensions` (`edge://extensions`, `brave://extensions`, `opera://extensions`, `vivaldi://extensions`).
3. Turn on **Developer mode**, click **Load unpacked**, and choose the extracted folder.
4. The settings page opens automatically. Pick a provider, enter its details, click **Save settings**, then **Test translation**.

After changing code, click the reload icon on the extension card, then reload the tab you are testing.

### Firefox (128 or newer)
1. Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → choose `manifest.json` from `dist/firefox` (or the zip). Temporary add-ons are removed when Firefox closes.
2. For a permanent install, sign the package at [addons.mozilla.org](https://addons.mozilla.org) (the *unlisted* channel is enough), or use Firefox Developer Edition / Nightly with `xpinstall.signatures.required` set to `false`.
3. Open the settings page and click **Allow access** on the banner so the selection button works on all sites. (Page translation from the popup works without this permission.)

## Provider setup

### 9router
1. Make sure 9router is running and at least one AI connection is active in its dashboard.
2. **Base URL**: for example `http://localhost:20128/v1` (or your server address).
3. **API key**: from the 9router dashboard (leave empty if auth is off).
4. Click **Connect**. Models are loaded from `GET {baseUrl}/models` and grouped by the prefix before `/`.
5. Pick a model and **Save settings**.

Translations go to `POST {baseUrl}/chat/completions` with an `Authorization: Bearer …` header. For any address other than `localhost` / `127.0.0.1`, the browser asks for access when you click Connect or Save.

### Custom (OpenAI-compatible)
Choose a **Service** preset, or *Other* and type your own Base URL.

| Preset | Base URL |
|---|---|
| OpenAI | `https://api.openai.com/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| DeepSeek | `https://api.deepseek.com/v1` |
| Mistral | `https://api.mistral.ai/v1` |
| Together AI | `https://api.together.xyz/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| LM Studio (local) | `http://localhost:1234/v1` |

If Ollama answers with 403, start it with `OLLAMA_ORIGINS=chrome-extension://*`. Some services do not offer `/models`; check that service's documentation.

### Claude
Create an API key in the Anthropic Console, paste it into **API key**, click **Load models** (`GET https://api.anthropic.com/v1/models`), pick a model, and save. Translations use `POST /v1/messages`. Smaller models are usually faster and cheaper for short translations.

### DeepL
Paste your authentication key. Keys ending in `:fx` automatically use `api-free.deepl.com`; all others use `api.deepl.com`. There is no model choice. When the quota runs out you get error 456.

### Choosing a provider

| | 9router | Custom | Claude | DeepL |
|---|---|---|---|---|
| Type | Gateway to many AI models | Language model, per service | Language model | Translation engine |
| Model choice | From your 9router | From the service | From your account | None |
| Speed | Depends on model | Depends on service | Fast to medium | Very fast |
| Context and style | Good | Good | Very good | Limited, consistent |
| Cost | Follows the backing provider | Follows the service | Pay per token | Free tier with limits, or Pro |

> Speed tip: language models write the result token by token, so they are slower than DeepL. Choose a small, fast model (*flash*, *mini*, *haiku* variants) and avoid *reasoning* models for translation.

## Usage

### Selected text
1. Select text on a web page.
2. Click the **文** button that appears near the selection.
3. Read the result in the tooltip. Press `Esc` or click elsewhere to close it. Each translation is limited to **5,000 characters**.

### Full page
- Click the extension icon → **Translate this page**, or
- right-click → **Translate this page with Wraith Translate**, or
- press **`Alt+W`** (change it at `chrome://extensions/shortcuts` / `about:addons` → Manage Extension Shortcuts).

To restore the page: popup → **Show original page**, the × on the bar, or `Alt+W` again.

## Settings
Settings page (**Settings** tab; *Open settings* button in the popup):

| Setting | Effect |
|---|---|
| Translate selected text | Off hides the selection button everywhere |
| Translate full page | Off disables the popup button, shortcut, and context menu, and restores any translated page |
| Page display | *Replace text* or *Show both* (applies to the next page translation) |
| Translate as you scroll | On: translate near-screen text only. Off: translate everything at once |
| Provider and target language | See [Provider setup](#provider-setup) |

Feature changes apply to open tabs immediately, without a reload. The **Docs** tab contains full documentation inside the extension.

## Permissions and privacy

| Permission | Why |
|---|---|
| `storage` | Saves your settings in this browser |
| `activeTab`, `scripting` | Prepares the current tab for page translation (icon click, shortcut, context menu) |
| `contextMenus` | Adds *Translate this page* to the right-click menu |
| All sites (content script) | Selection button, tooltip, and in-page text translation |
| `api.anthropic.com`, `api.deepl.com`, `api-free.deepl.com` | Calls the Claude and DeepL APIs |
| `localhost`, `127.0.0.1` | Local 9router or local model server |
| Optional per-address access | Requested only when 9router/Custom uses another address |

- Selected text is sent only to the provider you chose, and only after you click the translate button. Page text is sent only after you start a page translation.
- API keys are stored in `chrome.storage.local` on this device (not synced to your browser account). Keys never enter the web page: all API calls are made by the service worker.
- Translations are rendered as plain text, not HTML, and the source text is treated as data rather than instructions, to reduce prompt-injection risk from web pages. Do not translate confidential text through a provider you do not trust.

## Project structure

```
.
├── src/                    extension code (the Chromium manifest is the source of truth)
│   ├── manifest.json
│   ├── background.js       service worker: translate, shortcut, menu, script injection
│   ├── content.js          selection button, tooltip, page translator, bar (Shadow DOM)
│   ├── popup.html/css/js   toolbar popup
│   ├── options.html/css/js settings page + documentation
│   ├── lib/
│   │   ├── providers.js    API calls (single + batch)
│   │   ├── defaults.js     defaults and settings reader
│   │   ├── languages.js    language list + DeepL codes
│   │   └── presets.js      OpenAI-compatible service presets
│   └── icons/              16, 48, 128 px
├── build.py                builds dist/chromium, dist/firefox, and zips
├── tests/                  end-to-end tests (Playwright + Chromium)
├── AGENTS.md               architecture guide for developers / AI assistants
└── dist/                   build output (generated, do not edit)
```

Architecture in short: `content.js` sends `translate` / `translateBatch` messages to `background.js`, which reads the settings and calls `lib/providers.js`. Message flow, the batch protocol, and how to add providers, languages, or settings are documented in [`AGENTS.md`](AGENTS.md).

## Build
No runtime dependencies or bundler. Requires Python 3:

```bash
python3 build.py
```

Output:
```
dist/chromium/                              folder ready for Load unpacked
dist/firefox/                               folder ready for Load Temporary Add-on
dist/wraith-translate-chromium-v<ver>.zip
dist/wraith-translate-firefox-v<ver>.zip
```
The Firefox manifest is derived automatically from `src/manifest.json` (background script + `browser_specific_settings.gecko`). Bump `version` in `src/manifest.json` for each release. Firefox lint: `npx web-ext lint -s dist/firefox`.

## Testing
Automated tests use a local mock OpenAI server and headless Chromium:

```bash
pip install playwright
python3 build.py
python3 tests/e2e_page.py            # replace/bilingual/lazy/restore, code and notranslate skipped, feature toggles, error path
python3 tests/e2e_popup_inject.py    # popup saves settings, togglePage, on-demand script injection
```
Test screenshots are saved to `tests/out/`.

<details>
<summary>Manual test scenarios</summary>

1. 9router: Connect, the model list appears, pick one, save, *Test translation* succeeds.
2. Select a sentence on a normal page: the button appears, click it, and the tooltip shows the full result with no inner scrollbar.
3. Select text inside a `<textarea>`: the button still appears.
4. Use the *Translate to* menu in the tooltip: the same text is re-translated into that language and the saved target language is unchanged. `Esc` or clicking elsewhere closes the tooltip.
5. Use a wrong API key: the tooltip shows a 401/403 message and an *Open settings* button.
6. Stop 9router, then translate: a "Cannot reach…" message appears.
7. Select more than 5,000 characters: a "Text is too long" message appears.
8. Switch to Custom (choose a preset, Connect), Claude, and DeepL; repeat step 2.
9. On `chrome://extensions` the button does not appear (expected).
10. Reload the extension without reloading the tab: an "Extension was updated" message appears.
11. Turn off *Translate selected text*, Save, reload a tab: selecting text shows no button; the popup button still translates the page.
12. Turn off *Translate full page*, Save: the context menu entry disappears and the popup button is disabled.
13. Translate a long article with *Replace text*: visible text changes, code blocks stay untouched, scrolling translates the rest. *Show original page* restores everything.
14. *Show both* mode: the translation appears under each paragraph; the bar's *Original* button hides/shows it.
15. Wrong API key during page translation: the bar shows the error with Retry and Settings.
16. Click the icon on a tab opened before installing/reloading the extension: the popup opens and translation still works.
17. Click the icon on `chrome://extensions`: the popup says the page can't be translated; *Open settings* still works.

</details>

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Selection button does not appear | Reload the tab after installing or updating. Check that the page is not `chrome://`, the Web Store, or the built-in PDF viewer. On Firefox, click **Allow access** in Settings. |
| Red ! on the icon / "Couldn't reach this page" | The page cannot run extensions (`chrome://`, Web Store, PDF viewer) or it blocks scripts. If it still fails, reload the tab. |
| "Cannot reach…" | 9router or the local service is not running, the Base URL is wrong, or address access was not granted. Click Connect again and approve the permission. |
| 401 / 403 | The API key is wrong, expired, or lacks access to that model. |
| 404 | The Base URL does not end in `/v1`, or the model is gone. Reload the model list. |
| 429 | Rate limit reached. Wait a moment or switch models. |
| 456 (DeepL) | Monthly character quota used up. |
| Empty model list | No AI connected in 9router, or the key cannot read the model list. |
| Result includes extra commentary | Some small models ignore instructions. Choose a different model. |
| Translation is slow | Language models write token by token; pick a small/fast model, avoid reasoning models, or use DeepL. |
| Page only partly translated | Code, form fields, and hidden elements are skipped on purpose. Turn off *Translate as you scroll* to translate everything at once, or press Retry after an error. |
| "Extension was updated" | Reload the tab you are on. |

## Limitations
- *Replace text* mode translates piece by piece, so sentences split by inline tags (`<b>`, `<a>`) are translated separately. *Show both* translates whole blocks and reads more naturally.
- Content loaded after translation starts (infinite scroll) is translated once scrolling settles; constantly changing dynamic content may trigger repeated translations.
- Translations are not streamed; the result appears once the full reply arrives.
- Firefox has not been tested in a real browser yet; Safari is not built.

## Contributing
Edit only `src/`, run `python3 build.py`, then run the tests above. Full rules and guidance (file map, message protocol, how to add a provider, language, or setting, common pitfalls) are in [`AGENTS.md`](AGENTS.md).
