<div align="center">

<img src="assets/logo-512.png" alt="Wraith Translate logo: a cyan ghost with a translation speech bubble" width="148" height="148">

# Wraith Translate <img src="https://img.shields.io/badge/version-1.4.0-5DE0FF?style=flat-square&labelColor=1B1A2E" alt="version 1.4.0" align="top">

<sub>🌐 **English** &nbsp;·&nbsp; [Bahasa Indonesia](README.id.md)</sub>

### Select text or translate a whole page, right in your browser.

A lightweight, bring-your-own-AI translator for the browser.<br>
No account. No backend. No tracking. Just your text and the provider you trust.

<br>

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-A78BFA?style=for-the-badge&labelColor=1B1A2E)](src/manifest.json)
[![Zero dependencies](https://img.shields.io/badge/runtime_deps-0-5DE0FF?style=for-the-badge&labelColor=1B1A2E)](#build)
[![Languages](https://img.shields.io/badge/target_languages-16-A78BFA?style=for-the-badge&labelColor=1B1A2E)](#features)

<sub>**Works with**</sub><br>
![9router](https://img.shields.io/badge/9router-5DE0FF?style=flat-square&labelColor=1B1A2E)
![OpenAI-compatible](https://img.shields.io/badge/OpenAI--compatible-A78BFA?style=flat-square&labelColor=1B1A2E)
![Claude](https://img.shields.io/badge/Claude-5DE0FF?style=flat-square&labelColor=1B1A2E)
![DeepL](https://img.shields.io/badge/DeepL-A78BFA?style=flat-square&labelColor=1B1A2E)
![Ollama](https://img.shields.io/badge/Ollama-5DE0FF?style=flat-square&labelColor=1B1A2E)

<a href="https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/"><img src="https://img.shields.io/badge/Firefox-Get_the_add--on-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white&labelColor=1B1A2E" alt="Get the add-on for Firefox"></a>
<a href="#installation"><img src="https://img.shields.io/badge/Edge-in_review-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white&labelColor=1B1A2E" alt="Edge add-on is in review"></a>
<a href="#installation"><img src="https://img.shields.io/badge/Chrome-manual_install-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=1B1A2E" alt="Install manually on Chrome"></a>

<sub>**Runs on** &nbsp;Chrome · Edge · Brave · Opera · Vivaldi · Arc · Firefox 140+</sub>

<br>

[**Features**](#features) &nbsp;•&nbsp;
[**Install**](#installation) &nbsp;•&nbsp;
[**Providers**](#provider-setup) &nbsp;•&nbsp;
[**Usage**](#usage) &nbsp;•&nbsp;
[**Privacy**](#permissions-and-privacy) &nbsp;•&nbsp;
[**Troubleshooting**](#troubleshooting) &nbsp;•&nbsp;
[**Develop**](#build)

</div>

<br>

---

<a id="features"></a>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔤 Selection translate
Select text, click the small **文** button, and read the result in a tooltip. Includes a **Copy** button and a *Translate to* menu that never changes your saved language. The translation **streams in** as the model writes it.

</td>
<td width="50%" valign="top">

### 📄 Whole-page translate
Two display modes:
- **Replace text**: swaps text in place, layout stays intact.
- **Show both**: adds the translation under each paragraph, original stays visible.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📜 Translate as you scroll
Only text near the screen is sent to your provider; the rest is translated as you reach it. Saves time and cost on long pages.

</td>
<td width="50%" valign="top">

### 🧰 Popup, bar, shortcut
Toolbar popup, an on-page bar with progress, language switcher, *Original/Translation* toggle and Retry. Press **`Alt+W`** or use the right-click menu.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 4 provider types
**9router**, **Custom (OpenAI-compatible)**, **Claude**, **DeepL**. Only the selected provider is used; settings for the others stay saved.

</td>
<td width="50%" valign="top">

### 🌍 16 target languages
Indonesian, English, Japanese, Korean, Chinese (Simplified), Arabic, Spanish, French, German, Portuguese (Brazil), Russian, Italian, Dutch, Turkish, Polish, Ukrainian. Source language is detected automatically.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚡ Fast and resilient
Page text goes out in small parallel batches (12 strings, 5 at a time, on-screen text first) and identical strings are translated once. Rate-limit and server errors are retried with backoff, and a batch the model garbles is split automatically.

</td>
<td width="50%" valign="top">

### 🛡️ Page-safe
Code (`<pre>`, `<code>`), form fields, `translate="no"` / `class="notranslate"` elements, and hidden elements are left alone.

</td>
</tr>
</table>

## 🌐 Browser support

| Browser | Package | Status |
|---|---|---|
| Chrome, Brave, Opera, Vivaldi, Arc | `wraith-translate-chromium-v*.zip` | ✅ Tested on Chromium; manual install (Load unpacked) |
| Edge | `wraith-translate-chromium-v*.zip` | ⏳ Edge Add-ons listing is in review; manual install for now |
| Firefox 140+ | [Firefox Add-ons (official)](https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/) or `wraith-translate-firefox-v*.zip` | ✅ Listed on addons.mozilla.org; passes `web-ext lint` |
| Safari (macOS/iOS) | not built | ⚠️ Needs Xcode: `xcrun safari-web-extension-converter dist/chromium` |

<a id="installation"></a>

## 📦 Installation

<details open>
<summary><b>Chrome, Edge, Brave, Opera, Vivaldi, Arc</b></summary>

1. Extract `wraith-translate-chromium-v*.zip` into a folder (or run the [build](#build) and use `dist/chromium`).
2. Open the extensions page: `chrome://extensions` (`edge://extensions`, `brave://extensions`, `opera://extensions`, `vivaldi://extensions`).
3. Turn on **Developer mode**, click **Load unpacked**, and choose the extracted folder.
4. The settings page opens automatically. Pick a provider, enter its details, click **Save settings**, then **Test translation**.

> [!TIP]
> After changing code, click the reload icon on the extension card, then reload the tab you are testing.

</details>

<details open>
<summary><b>Firefox (140 or newer)</b></summary>

1. Open the official add-on page: **[Wraith Translate on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/)**.
2. Click **Add to Firefox** and confirm the permissions prompt. Updates arrive automatically.
3. Open the settings page, pick a provider, enter its details, click **Save settings**, then **Test translation**.
4. Click **Allow access** on the banner in Settings so the selection button works on all sites. (Page translation from the popup works without this permission.)

<details>
<summary>Install from source instead (for development)</summary>

Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → choose `manifest.json` from `dist/firefox` (or the zip). Temporary add-ons are removed when Firefox closes.

</details>

</details>

<a id="provider-setup"></a>

## 🔑 Provider setup

<details open>
<summary><b>9router</b></summary>

1. Make sure 9router is running and at least one AI connection is active in its dashboard.
2. **Base URL**: for example `http://localhost:20128/v1` (or your server address).
3. **API key**: from the 9router dashboard (leave empty if auth is off).
4. Click **Connect**. Models are loaded from `GET {baseUrl}/models` and grouped by the prefix before `/`.
5. Pick a model and **Save settings**.

Translations go to `POST {baseUrl}/chat/completions` with an `Authorization: Bearer …` header. For any address other than `localhost` / `127.0.0.1`, the browser asks for access when you click Connect or Save.

</details>

<details>
<summary><b>Custom (OpenAI-compatible)</b></summary>

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

</details>

<details>
<summary><b>Claude</b></summary>

Create an API key in the Anthropic Console, paste it into **API key**, click **Load models** (`GET https://api.anthropic.com/v1/models`), pick a model, and save. Translations use `POST /v1/messages`. Smaller models are usually faster and cheaper for short translations.

</details>

<details>
<summary><b>DeepL</b></summary>

Paste your authentication key. Keys ending in `:fx` automatically use `api-free.deepl.com`; all others use `api.deepl.com`. There is no model choice. When the quota runs out you get error 456.

</details>

### Which provider should I pick?

| | 9router | Custom | Claude | DeepL |
|---|---|---|---|---|
| **Type** | Gateway to many AI models | Language model, per service | Language model | Translation engine |
| **Model choice** | From your 9router | From the service | From your account | None |
| **Speed** | Depends on model | Depends on service | Fast to medium | Very fast |
| **Context and style** | Good | Good | Very good | Limited, consistent |
| **Cost** | Follows the backing provider | Follows the service | Pay per token | Free tier with limits, or Pro |

> [!TIP]
> Language models write the result token by token, so they are slower than DeepL. Choose a small, fast model (*flash*, *mini*, *haiku* variants) and avoid *reasoning* models for translation. Measured results are in [Choosing a model](#choosing-a-model).

<a id="choosing-a-model"></a>

### 🏁 Choosing a model

Translation needs no reasoning, so the best models are **small and fast** (*flash*, *lite*, *mini*, *haiku*). In **Settings**, recommended models are marked with **★** and offered as one-click buttons under the model list (the list lives in `src/lib/recommended.js`).

In our speed test, `gemini/gemini-3.5-flash-lite` was fastest and steadiest (about 1 s to finish), `kr/claude-haiku-4.5` was a good alternative, and reasoning-heavy or large models took 10 s or more. The model decides the speed, not the extension. Full results, caveats, and a script to repeat the test: **[docs/model-speed.md](docs/model-speed.md)**.

<a id="usage"></a>

## 🚀 Usage

### Selected text
1. Select text on a web page.
2. Click the **文** button that appears near the selection.
3. Read the result in the tooltip. Press `Esc` or click elsewhere to close it. Each translation is limited to **5,000 characters**.

### Full page

| Method | How |
|---|---|
| Toolbar | Click the extension icon → **Translate this page** |
| Right-click | **Translate this page with Wraith Translate** |
| Shortcut | **`Alt+W`** (change it at `chrome://extensions/shortcuts` / `about:addons` → Manage Extension Shortcuts) |

To restore the page: popup → **Show original page**, the **×** on the bar, or `Alt+W` again.

## ⚙️ Settings

Open the **Settings** tab (or *Open settings* in the popup):

| Setting | Effect |
|---|---|
| Translate selected text | Off hides the selection button everywhere |
| Translate full page | Off disables the popup button, shortcut, and context menu, and restores any translated page |
| Page display | *Replace text* or *Show both* (applies to the next page translation) |
| Translate as you scroll | On: translate near-screen text only. Off: translate everything at once |
| Provider, model, and target language | See [Provider setup](#provider-setup). Recommended models are marked ★ and offered as one-click buttons, see [Choosing a model](#choosing-a-model) |

Feature changes apply to open tabs immediately, without a reload. The **Docs** tab contains full documentation inside the extension.

<a id="permissions-and-privacy"></a>

## 🔒 Permissions and privacy

| Permission | Why |
|---|---|
| `storage` | Saves your settings in this browser |
| `activeTab`, `scripting` | Prepares the current tab for page translation (icon click, shortcut, context menu) |
| `contextMenus` | Adds *Translate this page* to the right-click menu |
| All sites (content script) | Selection button, tooltip, and in-page text translation |
| `api.anthropic.com`, `api.deepl.com`, `api-free.deepl.com` | Calls the Claude and DeepL APIs |
| `localhost`, `127.0.0.1` | Local 9router or local model server |
| Optional per-address access | Requested only when 9router/Custom uses another address |

- 📤 Selected text is sent **only to the provider you chose**, and only after you click the translate button. Page text is sent only after you start a page translation.
- 🗝️ API keys are stored in `chrome.storage.local` on this device (not synced to your browser account). Keys never enter the web page: all API calls are made by the service worker.
- 🧱 Translations are rendered as plain text, not HTML, and the source text is treated as data rather than instructions, to reduce prompt-injection risk from web pages.

> [!WARNING]
> Do not translate confidential text through a provider you do not trust. Read the full [privacy policy](PRIVACY.md).

<a id="troubleshooting"></a>

## 🩺 Troubleshooting

<details>
<summary><b>Open the symptom table</b></summary>

<br>

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
| Translation is slow | Usually the model, not the extension. Pick a model marked ★ in Settings, avoid reasoning models, or use DeepL. See [Choosing a model](#choosing-a-model). |
| Page only partly translated | Code, form fields, and hidden elements are skipped on purpose. Turn off *Translate as you scroll* to translate everything at once, or press Retry after an error. |
| "Extension was updated" | Reload the tab you are on. |

</details>

## 📌 Limitations

- *Replace text* mode translates piece by piece, so sentences split by inline tags (`<b>`, `<a>`) are translated separately. *Show both* translates whole blocks and reads more naturally.
- Content loaded after translation starts (infinite scroll) is translated once scrolling settles; constantly changing dynamic content may trigger repeated translations.
- Selected-text translations stream in as the model writes them. Full-page translation fills in per batch (a batch appears once its whole reply arrives).
- Firefox has no automated tests (it is linted and checked manually); Safari is not built.

## 🧩 Architecture

`content.js` (selection button, tooltip, page translator) talks to `background.js` (service worker), which reads the settings and calls `lib/providers.js` for 9router, OpenAI-compatible services, Claude, or DeepL. The file map, message flow, batch protocol, and how to add a provider, language, or setting are in [`AGENTS.md`](AGENTS.md).

<a id="build"></a>

## 🛠️ Build

No runtime dependencies or bundler. Requires Python 3:

```bash
python3 build.py
```

```
dist/chromium/                              folder ready for Load unpacked
dist/firefox/                               folder ready for Load Temporary Add-on
dist/wraith-translate-chromium-v<ver>.zip
dist/wraith-translate-firefox-v<ver>.zip
```

The Firefox manifest is derived automatically from `src/manifest.json` (background script + `browser_specific_settings.gecko`). Bump `version` in `src/manifest.json` for each release. Firefox lint: `npx web-ext lint -s dist/firefox`.

<a id="testing"></a>

## 🧪 Testing

Automated tests use a local mock OpenAI server and headless Chromium:

```bash
pip install playwright
python3 build.py
python3 tests/e2e_page.py            # replace/bilingual/lazy/restore, code and notranslate skipped, feature toggles, error path
python3 tests/e2e_popup_inject.py    # popup saves settings, togglePage, on-demand script injection
```

Test screenshots are saved to `tests/out/`.

Manual test scenarios (17 checks) are in [`tests/MANUAL.md`](tests/MANUAL.md).

## 🤝 Contributing

Edit only `src/`, run `python3 build.py`, then run the tests above. Full rules and guidance (file map, message protocol, how to add a provider, language, or setting, common pitfalls) are in [`AGENTS.md`](AGENTS.md).

> [!NOTE]
> Keep `README.md` and `README.id.md` in sync when you change documentation.

<br>

---

<div align="center">

<img src="assets/logo.svg" alt="Wraith Translate" width="44" height="44">

<sub>**Wraith Translate** · v1.4.0 · Translate quietly, like a ghost 👻</sub>

</div>
