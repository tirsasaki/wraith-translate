# Store listing text (copy into Chrome Web Store / Firefox Add-ons / Edge Add-ons)

## Name
Wraith Translate

## Summary
- **Firefox (max 250 chars):** Translate selected text or a whole web page with your own AI: 9router, OpenAI-compatible APIs, Claude, or DeepL. Replace text in place or show both languages. No tracking, no servers of our own.
- **Chrome (max 132 chars):** Translate selected text or whole pages with 9router, OpenAI-compatible APIs, Claude, or DeepL. No tracking.

## Description
Wraith Translate translates what you read, using the AI or translation service you choose.

**Translate selected text**
Select text on any page, click the small button next to it, and read the translation in a tooltip. Copy it, or re-translate into another language from the same tooltip.

**Translate a full page**
Click the toolbar icon (or press Alt+W, or use the right-click menu) to translate the whole page.
• Replace text: translations replace the original in place and keep the page layout.
• Show both: the translation appears under each paragraph, so you can compare.
• Translate as you scroll: only the text near your screen is sent, which saves time and cost on long pages.
A small bar lets you switch language, flip between original and translation, retry on errors, or restore the page.

**Bring your own provider**
• 9router (OpenAI-compatible AI gateway, local or remote)
• Any OpenAI-compatible service: OpenAI, OpenRouter, Groq, Google Gemini, DeepSeek, Mistral, Together AI, Ollama, LM Studio
• Claude (Anthropic)
• DeepL (Free and Pro)

**Control and privacy**
• Turn selected-text translation and full-page translation on or off in Settings.
• 16 target languages; the source language is detected automatically.
• No analytics, no ads, no developer servers. Text goes only to the provider you configure, and only when you ask for a translation. API keys stay in your browser.
• Code blocks, form fields, and elements marked translate="no" are left untouched.

You need your own provider: for example a DeepL API Free key, an OpenAI-compatible endpoint, a Claude API key, or a local 9router/Ollama server. Usage costs follow your provider.

Open source: see the project repository for the source code and documentation.

## Category suggestions
- Firefox: Language Support (or Productivity)
- Chrome / Edge: Productivity (or Tools)

## Version notes (1.3.1)
Initial release: translate selected text and whole pages with 9router, OpenAI-compatible APIs, Claude, and DeepL. Replace/bilingual page modes, translate-as-you-scroll, toolbar popup, shortcut (Alt+W), and settings to turn each feature on or off.

## Notes to reviewer
Wraith Translate has no backend and needs no account. It requires a translation provider configured by the user in the Settings page (opens automatically after install).

How to test quickly:
1. Open Settings, choose **DeepL**, paste a DeepL API Free key (keys ending in :fx), click Save settings, then Test translation. (Alternatively use any OpenAI-compatible endpoint: choose Custom, pick a preset, paste a key, click Connect, choose a model.)
2. Select text on any web page, click the small button that appears, and the translation shows in a tooltip.
3. Click the toolbar icon → "Translate this page" to translate the whole page; "Show original page" restores it.

Permission justification:
- Access to all websites (content script): shows the selection button/tooltip and reads the text the user asks to translate. It runs only on user action for translation; no data is sent without a click.
- activeTab + scripting: injects the content script on demand into the current tab when the user clicks the icon, uses the shortcut, or the context menu (tabs opened before install).
- contextMenus: "Translate this page" item.
- storage: saves settings locally. API keys are stored in storage.local only.
- Host permissions api.anthropic.com, api.deepl.com, api-free.deepl.com, localhost/127.0.0.1: translation requests to the providers the user chooses. Other provider addresses are requested at runtime as optional permissions.

The code is not minified, bundled, or obfuscated; the package contains the plain source files. Data-collection declaration: the extension transmits website content (selected/page text) to the user-selected provider, only on user request.

## Chrome Web Store: single purpose
Translate text the user selects, or the current web page, using a translation provider the user configures.

## Chrome Web Store: data usage disclosures
- Collects: **Website content** (text the user chooses to translate) — transmitted to the user's chosen provider only.
- Not collected: personally identifiable information, health, financial, authentication information (API keys stay local and are sent only to their own provider), personal communications, location, web history, user activity.
- Certifications: data is not sold to third parties; not used for purposes unrelated to the single purpose; not used for creditworthiness or lending.
- Privacy policy URL: link to `PRIVACY.md` in the repository (e.g. `https://github.com/<user>/<repo>/blob/main/PRIVACY.md`).

## Screenshots to prepare (1280×800 or 640×400)
1. Tooltip translating a selection
2. Full page in "Replace text" mode
3. "Show both" mode
4. Toolbar popup
5. Settings page (features and provider)
