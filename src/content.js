(() => {
  if (window.__wraithspeak) return;
  window.__wraithspeak = true;

  const LABELS = { "9router": "9router", custom: "OpenAI-compatible", claude: "Claude", deepl: "DeepL" };

  const host = document.createElement("div");
  host.id = "wraithspeak-host";
  host.style.cssText = "all:initial;position:absolute;top:0;left:0;width:0;height:0;z-index:2147483647;";
  const root = host.attachShadow({ mode: "closed" });

  root.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .btn {
        position: absolute; width: 28px; height: 28px; border-radius: 8px; border: 1px solid #e4e4e7;
        background: #fff; color: #18181b; cursor: pointer; display: none; align-items: center;
        justify-content: center; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,.14); padding: 0;
      }
      .btn:hover { background: #f4f4f5; }
      .btn.show { display: flex; }
      .tip {
        position: absolute; display: none; width: 360px; max-width: calc(100vw - 16px);
        background: #fff; color: #18181b; border: 1px solid #e4e4e7; border-radius: 12px;
        box-shadow: 0 8px 28px rgba(0,0,0,.16); font-size: 14px; line-height: 1.55;
      }
      .tip.show { display: block; }
      .head { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px 0; color: #71717a; font-size: 12px; }
      .body { padding: 6px 12px 10px; white-space: pre-wrap; overflow-wrap: anywhere; }
      .body.err { color: #b42318; }
      .body.load { color: #71717a; }
      .foot { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-top: 1px solid #f0f0f2; font-size: 12px; color: #71717a; }
      .spacer { flex: 1; }
      select, button.act {
        height: 26px; font-size: 12px; color: #18181b; background: #fff; border: 1px solid #e4e4e7;
        border-radius: 8px; cursor: pointer;
      }
      select { padding: 0 22px 0 8px; max-width: 150px; appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='6' fill='none' stroke='%2371717a' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 1l3.5 3.5L8 1'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 8px center; }
      button.act { padding: 0 10px; }
      select:hover, button.act:hover { background: #f4f4f5; }
      button.act.dark { background: #18181b; color: #fff; border-color: #18181b; }
      button.act.dark:hover { background: #2b2b30; }
      .x { background: transparent; border: 0; color: #71717a; font-size: 18px; line-height: 1; padding: 0 2px; cursor: pointer; }
      .x:hover { color: #18181b; }
      [hidden] { display: none !important; }
      .bar {
        position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); display: none; align-items: center;
        gap: 8px; max-width: calc(100vw - 16px); padding: 6px 8px 6px 12px; background: #fff; color: #18181b;
        border: 1px solid #e4e4e7; border-radius: 999px; box-shadow: 0 8px 28px rgba(0,0,0,.18); font-size: 12.5px;
      }
      .bar.show { display: flex; }
      .bar .msg { color: #52525b; overflow-wrap: anywhere; }
      .bar.err .msg { color: #b42318; }
      .bar.busy .msg::before {
        content: ""; display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%;
        background: #18181b; animation: pulse 1s ease-in-out infinite;
      }
      @keyframes pulse { 50% { opacity: .2; } }
      @media (prefers-reduced-motion: reduce) { .bar.busy .msg::before { animation: none; } }
      .bar select { max-width: 130px; }
    </style>
    <button class="btn" title="Translate with Wraith Translate" aria-label="Translate">文</button>
    <div class="tip" role="dialog" aria-label="Translation">
      <div class="head"><span class="meta">Wraith Translate</span><button class="x" aria-label="Close">×</button></div>
      <div class="body load"></div>
      <div class="foot">
        <span class="to">Translate to</span>
        <select class="lang" aria-label="Translate to language"></select>
        <span class="spacer"></span>
        <button class="act dark settings" hidden>Open settings</button>
        <button class="act copy">Copy</button>
      </div>
    </div>
    <div class="bar" role="status">
      <span class="msg"></span>
      <select class="plang" aria-label="Translate page to language" hidden></select>
      <button class="act dark retry" hidden>Retry</button>
      <button class="act psettings" hidden>Settings</button>
      <button class="act toggle" hidden>Original</button>
      <button class="x pclose" aria-label="Close and restore the page">×</button>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const btn = $(".btn"), tip = $(".tip"), meta = $(".meta"), body = $(".body");
  const bar = $(".bar"), barMsg = $(".bar .msg"), barLang = $(".plang"), barRetry = $(".retry"),
    barSettings = $(".psettings"), barToggle = $(".toggle"), barClose = $(".pclose");
  const langSel = $(".lang"), toLabel = $(".to"), copyBtn = $(".copy"), settingsBtn = $(".settings"), closeBtn = $(".x");

  // Feature flags mirror the saved settings (defaults match lib/defaults.js).
  let cfg = { selection: true, page: true, mode: "replace", lazy: true };
  const applySettings = (st) => {
    cfg = {
      selection: st?.features?.selection !== false,
      page: st?.features?.page !== false,
      mode: st?.page?.mode === "bilingual" ? "bilingual" : "replace",
      lazy: st?.page?.lazy !== false
    };
    if (!cfg.selection) { btn.classList.remove("show"); tip.classList.remove("show"); }
    if (!cfg.page && page) stopPage();
  };
  try {
    chrome.storage.local.get("settings", (r) => { if (!chrome.runtime.lastError) applySettings(r?.settings); });
    chrome.storage.onChanged.addListener((ch, area) => { if (area === "local" && ch.settings) applySettings(ch.settings.newValue); });
  } catch {}

  let currentText = "";
  let currentPt = null;
  let lastResult = "";
  let token = 0;
  let languages = null;

  const attach = () => { if (!host.isConnected) document.documentElement.appendChild(host); };

  function hideAll() {
    btn.classList.remove("show");
    tip.classList.remove("show");
    token++;
  }

  function selectionPoint(e) {
    const sel = window.getSelection();
    let rect = null;
    try {
      if (sel && sel.rangeCount) {
        const rs = sel.getRangeAt(0).getClientRects();
        if (rs.length) rect = rs[rs.length - 1];
      }
    } catch {}
    if (rect && (rect.width || rect.height)) {
      return { x: rect.right + window.scrollX, y: rect.bottom + window.scrollY, top: rect.top + window.scrollY };
    }
    if (e && typeof e.clientX === "number") {
      return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY + 12, top: e.clientY + window.scrollY };
    }
    return null;
  }

  function onSelect(e) {
    if (!cfg.selection) return;
    if (e && e.composedPath && e.composedPath().includes(host)) return;
    setTimeout(() => {
      const text = (window.getSelection()?.toString() || "").trim();
      if (!text) return;
      const pt = selectionPoint(e);
      if (!pt) return;
      attach();
      currentText = text;
      currentPt = pt;
      tip.classList.remove("show");
      btn.style.left = pt.x + 4 + "px";
      btn.style.top = pt.y + 6 + "px";
      btn.classList.add("show");
    }, 10);
  }

  document.addEventListener("mouseup", onSelect, true);
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") return hideAll();
    if (e.shiftKey || e.key === "a" || e.key === "A") onSelect(e);
  }, true);
  document.addEventListener("mousedown", (e) => {
    if (e.composedPath && e.composedPath().includes(host)) return;
    hideAll();
  }, true);

  btn.addEventListener("mousedown", (e) => e.preventDefault());
  closeBtn.addEventListener("click", hideAll);
  settingsBtn.addEventListener("click", () => chrome.runtime.sendMessage({ type: "openOptions" }));

  /* ---- Layout: never an inner scrollbar; the popup grows with the text ---- */
  function showTip() {
    const pt = currentPt;
    if (!pt) return;
    tip.classList.add("show");
    const h = tip.offsetHeight;
    const w = tip.offsetWidth;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const below = pt.y + 8;
    const above = pt.top - h - 8;
    const fitsBelow = below - window.scrollY + h < vh - 8;
    const fitsAbove = above - window.scrollY > 8;
    const top = fitsBelow || !fitsAbove ? below : above;
    const left = Math.min(Math.max(8 + window.scrollX, pt.x - 20), window.scrollX + vw - w - 8);
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  function render(kind, text, metaText) {
    body.className = "body " + kind;
    body.textContent = text;
    meta.textContent = metaText;
    const isErr = kind === "err";
    settingsBtn.hidden = !isErr;
    copyBtn.hidden = kind !== "";
    if (kind === "") lastResult = text;
    showTip();
  }

  function fillLanguages(selected) {
    if (!languages || !languages.length) {
      langSel.hidden = true;
      toLabel.hidden = true;
      return;
    }
    if (!langSel.options.length) {
      for (const l of languages) langSel.append(new Option(l.name, l.code));
    }
    if (selected) langSel.value = selected;
  }

  function loadLanguages(cb) {
    if (languages) return cb();
    try {
      chrome.runtime.sendMessage({ type: "languages" }, (res) => {
        languages = (!chrome.runtime.lastError && res?.languages) || [];
        cb();
      });
    } catch { languages = []; cb(); }
  }

  /* ---- Translate (optionally into a language other than the saved one) ---- */
  function run(targetLang) {
    const my = ++token;
    render("load", "Translating…", "Wraith Translate");
    const fail = (m) => render("err", m, "Wraith Translate");
    try {
      chrome.runtime.sendMessage({ type: "translate", text: currentText, targetLang }, (res) => {
        if (my !== token) return;
        if (chrome.runtime.lastError || !res) return fail("Extension was updated. Reload this page and try again.");
        if (!res.ok) return fail(res.error);
        loadLanguages(() => {
          if (my !== token) return;
          fillLanguages(res.langCode);
          const src = res.detected ? `${res.detected} → ` : "";
          render("", res.text, `${LABELS[res.provider] || res.provider} · ${src}${res.langName}`);
        });
      });
    } catch {
      fail("Extension was updated. Reload this page and try again.");
    }
  }

  btn.addEventListener("click", () => {
    btn.classList.remove("show");
    loadLanguages(() => fillLanguages());
    run(undefined);
  });

  langSel.addEventListener("change", () => run(langSel.value));

  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(lastResult); copyBtn.textContent = "Copied"; }
    catch { copyBtn.textContent = "Copy failed"; }
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  });
  /* ================= Full-page translation ================= */
  const isTop = window === window.top;
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "SVG", "CANVAS",
    "CODE", "PRE", "KBD", "SAMP", "TEMPLATE", "IFRAME", "OBJECT", "MATH"]);
  const MARK = "data-wraithspeak-tr";
  const BATCH_ITEMS = 30, BATCH_CHARS = 2500, PARALLEL = 3;
  let page = null; // null = idle; otherwise the live session

  function setBar(kind, text, opts = {}) {
    if (!isTop) return;
    attach();
    bar.className = "bar show" + (kind ? " " + kind : "");
    barMsg.textContent = text;
    barRetry.hidden = !opts.retry;
    barSettings.hidden = !opts.settings;
    barToggle.hidden = !opts.toggle;
    barLang.hidden = !opts.lang || !languages?.length;
    barClose.hidden = !!opts.noClose;
    if (opts.toggle) barToggle.textContent = page?.showing ? "Original" : "Translation";
    if (page?.langCode && !barLang.hidden) barLang.value = page.langCode;
  }
  const hideBar = () => bar.classList.remove("show");

  function updateBar() {
    if (!isTop || !page) return;
    if (page.error) return setBar("err", page.error, { retry: true, settings: true });
    const busy = page.inflight > 0 || page.queue.length > 0;
    const label = page.langName ? `Translated to ${page.langName}` : "Translating…";
    setBar(busy ? "busy" : "", busy ? "Translating…" : label, { toggle: true, lang: true });
  }

  function skippedElement(el) {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      if (SKIP_TAGS.has(e.tagName.toUpperCase()) || e.hasAttribute(MARK) || e.isContentEditable) return true;
      if (e.getAttribute("translate") === "no" || e.classList.contains("notranslate")) return true;
    }
    return false;
  }

  function visible(el) {
    try { return el.checkVisibility ? el.checkVisibility({ checkVisibilityCSS: true }) : el.getClientRects().length > 0; }
    catch { return true; }
  }

  // Nearest ancestor that renders as a block (what a reader sees as one paragraph).
  function blockOf(el, displayCache) {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      let d = displayCache.get(e);
      if (d === undefined) { d = getComputedStyle(e).display; displayCache.set(e, d); }
      if (d !== "inline" && d !== "contents") return e;
    }
    return document.body;
  }

  // Finds text not yet tracked and returns units ready to be observed/queued.
  function scan(root) {
    const found = [];
    const skipCache = new Map(), visCache = new Map(), dispCache = new Map();
    const bilingual = page.mode === "bilingual";
    const blocks = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (page.seen.has(n)) continue;
      const raw = n.nodeValue;
      const trimmed = raw.trim();
      if (trimmed.length < 2 || !/\p{L}/u.test(trimmed)) continue;
      const el = n.parentElement;
      if (!el) continue;
      let skip = skipCache.get(el);
      if (skip === undefined) { skip = skippedElement(el); skipCache.set(el, skip); }
      if (skip) continue;
      let vis = visCache.get(el);
      if (vis === undefined) { vis = visible(el); visCache.set(el, vis); }
      if (!vis) continue;
      page.seen.add(n);
      if (bilingual) {
        const b = blockOf(el, dispCache);
        if (page.seenBlocks.has(b)) continue;
        if (!blocks.has(b)) blocks.set(b, []);
        blocks.get(b).push(n);
      } else {
        const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
        found.push({ kind: "node", el, node: n, orig: raw, lead, trail, text: trimmed, tr: null });
      }
    }
    for (const [b, nodes] of blocks) {
      const text = nodes.map((x) => x.nodeValue).join("").replace(/\s+/g, " ").trim();
      if (text.length < 2) continue;
      page.seenBlocks.add(b);
      found.push({ kind: "block", el: b, text, tr: null, out: null });
    }
    return found;
  }

  function track(units) {
    if (!units.length) return;
    if (!page.lazy) { page.queue.push(...units); return pump(); }
    for (const u of units) {
      let list = page.groups.get(u.el);
      if (!list) { list = []; page.groups.set(u.el, list); page.io.observe(u.el); }
      list.push(u);
    }
  }

  function onIntersect(entries) {
    if (!page) return;
    let any = false;
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      page.io.unobserve(en.target);
      const list = page.groups.get(en.target);
      page.groups.delete(en.target);
      if (list) { page.queue.push(...list); any = true; }
    }
    if (any) pump();
  }

  function paint(u) {
    if (u.tr == null) return;
    if (u.kind === "node") {
      if (u.node.isConnected) u.node.nodeValue = page.showing ? u.lead + u.tr + u.trail : u.orig;
    } else {
      if (!u.out) {
        u.out = document.createElement("span");
        u.out.setAttribute(MARK, "");
        u.out.style.cssText = "display:block;margin:.3em 0 0;padding:0 0 0 .6em;border-left:2px solid #a1a1aa;" +
          "font-size:.95em;font-weight:normal;font-style:normal;opacity:.85;white-space:pre-wrap;";
        u.out.textContent = u.tr;
        u.el.appendChild(u.out);
      }
      u.out.style.display = page.showing ? "block" : "none";
    }
  }

  function setTr(u, t) { u.tr = t; page.done.push(u); paint(u); }

  function takeBatch() {
    const items = [], byText = new Map();
    let chars = 0;
    while (page.queue.length) {
      const u = page.queue[0];
      const hit = page.cache.get(u.text);
      if (hit !== undefined) { page.queue.shift(); setTr(u, hit); continue; }
      let it = byText.get(u.text);
      if (!it) {
        if (items.length && (items.length >= BATCH_ITEMS || chars + u.text.length > BATCH_CHARS)) break;
        it = { text: u.text, units: [] };
        byText.set(u.text, it);
        items.push(it);
        chars += u.text.length;
      }
      it.units.push(page.queue.shift());
    }
    return items;
  }

  function pump() {
    while (page && !page.error && page.inflight < PARALLEL) {
      const items = takeBatch();
      if (!items.length) break;
      send(items);
    }
    updateBar();
  }

  function send(items) {
    const sess = page;
    sess.inflight++;
    const fail = (m) => {
      sess.error = m;
      for (const it of items) sess.failed.push(...it.units);
    };
    const done = (res) => {
      sess.inflight--;
      if (sess !== page) return;
      if (!res) fail("Extension was updated. Reload this page and try again.");
      else if (!res.ok) fail(res.error);
      else {
        sess.langName = res.langName;
        sess.langCode = res.langCode;
        items.forEach((it, i) => {
          sess.cache.set(it.text, res.texts[i]);
          for (const u of it.units) setTr(u, res.texts[i]);
        });
      }
      pump();
    };
    try {
      chrome.runtime.sendMessage({ type: "translateBatch", texts: items.map((i) => i.text), targetLang: sess.lang }, (res) => {
        done(chrome.runtime.lastError ? null : res);
      });
    } catch { done(null); }
  }

  function startPage(lang) {
    if (page || !cfg.page || !document.body) return;
    page = {
      mode: cfg.mode, lazy: cfg.lazy, lang, langName: "", langCode: lang || "",
      seen: new WeakSet(), seenBlocks: new WeakSet(), groups: new Map(), queue: [], failed: [], done: [], cache: new Map(),
      inflight: 0, error: "", showing: true, io: null, timer: 0
    };
    page.io = new IntersectionObserver(onIntersect, { rootMargin: "700px 0px" });
    loadLanguages(() => { if (page) fillBarLanguages(); });
    track(scan(document.body));
    // Pick up content added later (infinite scroll, lazy sections) once scrolling settles.
    page.onScroll = () => {
      clearTimeout(page.timer);
      page.timer = setTimeout(() => { if (page && !page.error) track(scan(document.body)); }, 700);
    };
    window.addEventListener("scroll", page.onScroll, { passive: true });
    updateBar();
  }

  function stopPage() {
    if (!page) return;
    const p = page;
    page = null;
    p.io.disconnect();
    clearTimeout(p.timer);
    window.removeEventListener("scroll", p.onScroll);
    for (const u of p.done) {
      if (u.kind === "node") { if (u.node.isConnected) u.node.nodeValue = u.orig; }
      else u.out?.remove();
    }
    hideBar();
  }

  function fillBarLanguages() {
    if (!languages?.length) return;
    if (!barLang.options.length) for (const l of languages) barLang.append(new Option(l.name, l.code));
    updateBar();
  }

  barClose.addEventListener("click", () => (page ? stopPage() : hideBar()));
  barSettings.addEventListener("click", () => chrome.runtime.sendMessage({ type: "openOptions" }));
  barRetry.addEventListener("click", () => {
    if (!page) return;
    page.error = "";
    page.queue.unshift(...page.failed);
    page.failed = [];
    pump();
  });
  barToggle.addEventListener("click", () => {
    if (!page) return;
    page.showing = !page.showing;
    page.done.forEach(paint);
    updateBar();
  });
  barLang.addEventListener("change", () => {
    const code = barLang.value;
    stopPage();
    startPage(code);
  });

  try {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg?.type === "pageState") { sendResponse({ active: !!page }); return; }
      if (msg?.type !== "pageCmd") return;
      if (msg.action === "start") startPage();
      else if (msg.action === "stop") stopPage();
      else if (msg.action === "disabled" && isTop) {
        setBar("err", "Full-page translation is turned off in settings.", { settings: true });
      }
    });
  } catch {}
})();
