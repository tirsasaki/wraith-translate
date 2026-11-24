# Manual test scenarios

17 checks that complement the automated tests in this folder. Run them before a release, on Chromium and on Firefox (140+). Indonesian version: [`MANUAL.id.md`](MANUAL.id.md).

## Setup

1. Build: `python3 build.py`.
2. Load the extension:
   - **Chromium:** `chrome://extensions` → Developer mode → **Load unpacked** → `dist/chromium`.
   - **Firefox:** `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → `dist/firefox/manifest.json`. Then click **Allow access** on the banner in Settings.
3. Have at least one working provider. 9router running locally (`http://localhost:20128/v1`) is the default. Scenario 8 also needs an OpenAI-compatible key, a Claude key, and a DeepL key.
4. Use a normal article page (for example a Wikipedia article) that has headings, paragraphs, and code blocks.

Each scenario lists the steps and then the **expected** result. Write down the browser, the version, and any scenario that fails.

## Settings

1. **9router setup.** In Settings, choose 9router, click **Connect**, pick a model, then click **Save settings** and **Test translation**.
   **Expected:** the model list appears after Connect, and the test shows a translation.

## Selected text

2. **Basic selection.** Select a sentence on a normal page and click the 文 button.
   **Expected:** the button appears just above the selection. The tooltip shows the whole result with no inner scrollbar.

3. **Text field.** Select text inside a `<textarea>`.
   **Expected:** the button still appears.

4. **Other language and closing.** In the tooltip, change the **Translate to** menu. Then press `Esc`, and on another translation click elsewhere on the page.
   **Expected:** the same text is translated again into the chosen language, and the target language saved in Settings does not change. `Esc` and clicking elsewhere both close the tooltip.

5. **Wrong API key.** Save a wrong API key, then translate a selection.
   **Expected:** the tooltip shows a 401/403 message and an **Open settings** button.

6. **Provider unreachable.** Stop 9router, then translate a selection.
   **Expected:** a "Cannot reach…" message appears.

7. **Too long.** Select more than 5,000 characters and translate.
   **Expected:** a "Text is too long" message appears.

8. **Other providers.** Switch to Custom (choose a preset, click **Connect**), then Claude (**Load models**), then DeepL. Save each one and repeat scenario 2.
   **Expected:** each provider translates the selection. The tooltip header shows the provider's name.

9. **Browser page.** Select text on `chrome://extensions` (Firefox: `about:addons`).
   **Expected:** the button does not appear. Extensions cannot run on these pages.

10. **Extension reloaded.** Reload the extension on the extensions page without reloading the tab, then translate a selection in that tab.
    **Expected:** an "Extension was updated. Reload this page and try again." message appears.

## Feature switches

11. **Selection off.** In Settings, turn off **Translate selected text**, save, and reload a tab.
    **Expected:** selecting text shows no button. The popup's **Translate this page** button still works.

12. **Full page off.** Turn off **Translate full page** and save.
    **Expected:** the right-click entry "Translate this page with Wraith Translate" disappears, and the popup's page button is disabled.

## Full-page translation

13. **Replace mode.** Choose **Replace text**, keep **Translate as you scroll** on, and translate a long article from the popup.
    **Expected:** visible text changes and code blocks stay untouched. Scrolling down translates the rest. **Show original page** in the popup (or `Alt+W`) restores everything.

14. **Show both mode.** Choose **Show both** and translate the page.
    **Expected:** the translation appears under each paragraph. The **Original** button in the bottom bar hides and shows the translations.

15. **Error during page translation.** Save a wrong API key and translate the page.
    **Expected:** the page text is not changed. The bottom bar shows the error with **Retry** and **Settings** buttons.

## Popup

16. **Tab opened before install.** Open a tab, then install or reload the extension. In that tab, without reloading it, click the toolbar icon and **Translate this page**.
    **Expected:** the popup opens and the page is translated. The content script is injected on demand.

17. **Page that can't be translated.** Click the toolbar icon on `chrome://extensions`.
    **Expected:** the popup says this page can't be translated. **Open settings** still works.
