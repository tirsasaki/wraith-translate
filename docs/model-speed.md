# Choosing a model: speed test

[← Back to README](../README.md#choosing-a-model)

Translation needs no reasoning, so the best models are **small and fast**. In **Settings**, recommended models are marked with **★** and offered as one-click buttons under the model list (the recommendations live in `src/lib/recommended.js`).

Here is a speed test, so you do not have to repeat it. Setup: models reached through [9router](https://github.com/decolua/9router) on a local PC, one prompt (`Translate to Indonesian: CachyOS Dethroned SteamOS on Steam — Desktop Linux Gaming Has a New Center of Gravity`), streaming on, two runs each, on 2026-10-04. Times are seconds until the **first word / until finished**, measured with `curl`.

| Model | Run 1 | Run 2 | Verdict |
|---|---|---|---|
| `gemini/gemini-3.5-flash-lite` | 0.87 / 1.21 | 0.83 / 1.14 | 🥇 **Fastest and steady. Recommended.** |
| `kr/claude-haiku-4.5` | 3.03 / 3.04 | 1.47 / 1.47 | 👍 Good alternative |
| `gemini/gemini-3.1-flash-lite-preview` | 3.63 / 3.89 | 2.02 / 2.37 | 👌 OK |
| `kr/deepseek-3.2` | 2.22 / 2.22 | 8.43 / 8.43 | ⚠️ Uneven |
| `ag/gemini-3.8-flash-low` | 2.66 / 3.39 | 6.17 / 7.20 | ⚠️ Uneven |
| `ag/gemini-3-flash` | 8.94 / 9.54 | 12.47 / 12.75 | 🐌 Slow: avoid |
| `gemini/gemma-4-31b-it` | 22.44 / 24.18 | 27.95 / 59.49 | 🐌 Very slow: avoid |
| `ag/gemini-3.5-flash-extra-low` | n/a | n/a | ❌ Discontinued (see below) |
| `cx/gpt-5.4-mini` | n/a | n/a | ❔ HTTP 400 on this request, not measured |

**What the test showed**

- **The model decides the speed, not the extension.** Once the first word arrives, a short translation finishes in about half a second. The wait is before the first word, and it differs a lot between models and routes.
- **Asking for less thinking did not help here.** On `ag/gemini-3-flash`, `reasoning_effort` values `none`, `minimal`, `low`, and the default all stayed between 4.6 and 12.5 s until the first word, because 9router reports that setting as unsupported for those models. The extension still sends the lightest setting each model accepts (and remembers it), but picking a fast model is what works.
- **A discontinued model can look like success.** `ag/gemini-3.5-flash-extra-low` answered in 0.09 s with HTTP 200, but the "translation" was the message *"Gemini 3.5 Flash is no longer available…"*. If a result looks too fast to be true, read the output.
- A "lite" model is the fastest but may sound less polished on long or nuanced text. If so, `kr/claude-haiku-4.5` (or a Claude Haiku through the Claude provider) is the next step up.

> [!NOTE]
> This is one prompt, two runs, one machine and network, through one gateway. Model names and availability change often, and results vary with load and location. Treat the ranking as a guide and repeat the test with your own models.

<details>
<summary><b>Run the speed test yourself</b></summary>

```bash
KEY="YOUR_9ROUTER_KEY"            # leave out the Authorization header if your gateway has no auth
URL=http://localhost:20128/v1/chat/completions
for M in gemini/gemini-3.5-flash-lite kr/claude-haiku-4.5 YOUR/OTHER-MODEL; do
  echo "== $M"
  for i in 1 2; do
    curl -s -o /dev/null -w "status=%{http_code} first-word=%{time_starttransfer}s total=%{time_total}s\n" $URL \
      -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
      -d "{\"model\":\"$M\",\"stream\":true,\"max_tokens\":80,\"messages\":[{\"role\":\"user\",\"content\":\"Translate to Indonesian: CachyOS Dethroned SteamOS on Steam — Desktop Linux Gaming Has a New Center of Gravity\"}]}"
  done
done
```

`first-word` is what you feel as "waiting". `status` should be `200`; otherwise the model is not available to you. Add `"reasoning_effort":"low"` to the JSON to see whether your model reacts to it.

</details>
