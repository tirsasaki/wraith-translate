# Privacy Policy — Wraith Translate

_Last updated: 2026-10-04_

Wraith Translate is a browser extension that translates text you select and whole web pages. This policy explains what data the extension handles and where it goes.

## Summary
- The extension has **no servers of its own**. The developer does not receive, collect, store, or sell your data.
- There is **no analytics, tracking, advertising, or telemetry**.
- Text is sent **only to the translation provider you configure** (for example your own 9router, an OpenAI-compatible service, Anthropic Claude, or DeepL), and only when you ask for a translation.

## What data is handled

| Data | Purpose | Where it goes |
|---|---|---|
| Text you select on a page | Translated when you click the translate button | Sent to your chosen provider |
| Text of the current page | Translated when you start a full-page translation (with "Translate as you scroll", only text near the screen is sent) | Sent to your chosen provider |
| Settings (provider, base URL, model, target language, feature switches) | Remember your configuration | Stored locally in your browser (`storage.local`) |
| API keys you enter | Authenticate with your chosen provider | Stored locally in your browser (`storage.local`), not synced to any account; sent only to the provider they belong to |

The extension does not read your browsing history, does not collect personal information, and does not send anything to the developer.

## Third-party providers
When you request a translation, the text is sent directly from your browser to the provider you selected. That provider's own terms and privacy policy apply to the text it receives:
- 9router or any OpenAI-compatible service you configure (including local services such as Ollama or LM Studio, where data stays on your machine or network)
- Anthropic (Claude) — https://www.anthropic.com/legal/privacy
- DeepL — https://www.deepl.com/privacy

Do not translate confidential text through a provider you do not trust.

## Permissions
- **Access to websites**: to show the selection button and tooltip and to read the text you want translated.
- **storage**: to save your settings locally.
- **activeTab, scripting**: to prepare the current tab for page translation when you click the icon, use the shortcut, or use the context menu.
- **contextMenus**: to add the "Translate this page" menu item.
- **Provider addresses** (Anthropic, DeepL, localhost, and optional addresses you approve): to send translation requests.

## Security
Translations are displayed as plain text, not HTML. API calls are made by the extension's background service worker, so keys are never exposed to web pages. You can delete all stored data at any time by removing the extension or clearing its data.

## Children
The extension is not directed at children and does not knowingly collect information from anyone.

## Changes
If this policy changes, the updated version will be published in this repository with a new date.

## Contact
Open an issue in this repository.
