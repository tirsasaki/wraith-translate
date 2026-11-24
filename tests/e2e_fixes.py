"""Regression tests for the 1.4.1 fixes:
display:contents text (lazy mode), bar language before the first reply, bar language change reaching
iframes, "incomplete" note on truncated selection replies, selection cache keyed by base URL, and
context-menu sync under rapid settings changes.
The page bar and tooltip live in a closed Shadow DOM, so they are reached through CDP (pierce)."""
import json, re, threading, http.server, time, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

state = {"delay": 0}
calls = []
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, body, ctype="application/json"):
        b = body.encode() if isinstance(body, str) else body
        self.send_response(200); self.send_header("Content-Type", ctype)
        self.send_header("Access-Control-Allow-Origin", "*"); self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers(); self.wfile.write(b)
    def do_OPTIONS(self): self._send("")
    def do_GET(self):
        if "/models" in self.path: return self._send(json.dumps({"data": [{"id": "mock/m1"}]}))
        if self.path.startswith("/frame"):
            return self._send("<!doctype html><html><body><p id=fp>Frame paragraph</p></body></html>", "text/html")
        self._send("""<!doctype html><html><body>
<h1 id=h>Hello world</h1>
<div style="display:contents" id=dc>Contents wrapper text</div>
<div style="display:contents;visibility:hidden" id=dch>Hidden contents text</div>
<p id=sel>Pick this sentence</p>
<p id=long>LONGTEXT sentence here</p>
<iframe id=f src="/frame" style="width:400px;height:120px"></iframe>
<div style="height:3000px"></div>
<section><div style="display:contents" id=fardc>Far contents text</div></section>
</body></html>""", "text/html")
    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n))
        user = body["messages"][-1]["content"]; sysm = body["messages"][0]["content"]
        lang = re.search(r"into ([A-Z][a-z]+)", sysm).group(1)
        tag = f"[{lang}{'@alt' if self.path.startswith('/alt') else ''}] "
        calls.append(user)
        if state["delay"]: time.sleep(state["delay"])
        finish = "stop"
        if "JSON array" in sysm:
            out = json.dumps([tag + t for t in json.loads(user)])
        else:
            out = tag + user
            if "LONGTEXT" in user: finish = "length"
        self._send(json.dumps({"choices": [{"message": {"content": out}, "finish_reason": finish}]}))

srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
EXT = str(Path(__file__).parent.parent / "dist" / "chromium")
base = f"http://127.0.0.1:{port}"
fails = []
def check(name, cond):
    print(("PASS " if cond else "FAIL ") + name)
    if not cond: fails.append(name)

with sync_playwright() as pw:
    ctx = pw.chromium.launch_persistent_context(tempfile.mkdtemp(), headless=False, args=[
        "--headless=new", f"--disable-extensions-except={EXT}", f"--load-extension={EXT}", "--no-sandbox"])
    time.sleep(2)
    sw = ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event("serviceworker")
    console_msgs = []
    ctx.on("console", lambda m: console_msgs.append(m.text))

    def setcfg(**kw):
        s = {"provider": "9router", "targetLang": "ja", "features": {"selection": True, "page": True},
             "page": {"mode": "replace", "lazy": True},
             "providers": {"9router": {"baseUrl": base + "/v1", "apiKey": "", "model": "mock/m1"}}}
        s.update(kw)
        sw.evaluate("s => chrome.storage.local.set({settings: s})", s)
    def cmd(action):
        return sw.evaluate("""async ([a,u]) => {
          const [tab] = await chrome.tabs.query({url: u+'/*'});
          if (a==='state') { try { return (await chrome.tabs.sendMessage(tab.id,{type:'pageState'},{frameId:0})).active } catch(e){return 'err:'+e} }
          await chrome.tabs.sendMessage(tab.id,{type:'pageCmd',action:a}); return true }""", [action, base + "/main"])

    pg = ctx.new_page()
    cdp = ctx.new_cdp_session(pg)
    def shadow(fn):
        """Runs fn(shadowRoot) in the page and returns its value."""
        doc = cdp.send("DOM.getDocument", {"depth": -1, "pierce": True})
        def find(n):
            attrs = n.get("attributes", [])
            if "id" in attrs and attrs[attrs.index("id") + 1] == "wraithspeak-host": return n
            for c in n.get("children", []):
                r = find(c)
                if r: return r
        host = find(doc["root"])
        if not host or not host.get("shadowRoots"): return None
        obj = cdp.send("DOM.resolveNode", {"backendNodeId": host["shadowRoots"][0]["backendNodeId"]})
        r = cdp.send("Runtime.callFunctionOn", {"objectId": obj["object"]["objectId"],
                                                "functionDeclaration": f"function() {{ return ({fn})(this); }}",
                                                "returnByValue": True})
        return r["result"].get("value")
    t = lambda sel: pg.inner_text(sel)
    frame_text = lambda: pg.frame_locator("#f").locator("#fp").inner_text()

    # --- display:contents + lazy mode
    setcfg()
    pg.goto(base + "/main"); pg.wait_for_timeout(600)
    cmd("start"); pg.wait_for_timeout(1500)
    check("h1 translated (Japanese)", t("#h").startswith("[Japanese]"))
    check("display:contents text translated", t("#dc").startswith("[Japanese]"))
    check("display:contents + visibility:hidden skipped", pg.eval_on_selector("#dch", "e => e.textContent") == "Hidden contents text")
    check("iframe translated", frame_text().startswith("[Japanese]"))
    check("far display:contents not yet translated (lazy)", pg.eval_on_selector("#fardc", "e => e.textContent") == "Far contents text")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(1500)
    check("far display:contents translated after scroll", t("#fardc").startswith("[Japanese]"))
    pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(200)

    # --- bar language change reaches the iframe
    shadow("r => { const s = r.querySelector('.plang'); s.value = 'de'; s.dispatchEvent(new Event('change')); }")
    pg.wait_for_timeout(1800)
    check("bar language change: top frame in German", t("#h").startswith("[German]"))
    check("bar language change: iframe in German", frame_text().startswith("[German]"))
    cmd("stop"); pg.wait_for_timeout(300)
    check("stop restores top + iframe", t("#h") == "Hello world" and frame_text() == "Frame paragraph")

    # --- bar shows the saved language while the first batch is still in flight
    state["delay"] = 2
    pg.reload(); pg.wait_for_timeout(600)
    cmd("start"); pg.wait_for_timeout(500)
    v = shadow("r => { const s = r.querySelector('.plang'); return [s.hidden, s.value]; }")
    check("bar language before first reply = saved target (ja)", v == [False, "ja"])
    pg.wait_for_timeout(2500)
    state["delay"] = 0
    cmd("stop"); pg.wait_for_timeout(300)

    # --- selection: truncated reply is labelled; cache is keyed by base URL
    def select_and_translate(el_id):
        pg.evaluate("""id => { const r = document.createRange(); r.selectNodeContents(document.getElementById(id));
          const s = getSelection(); s.removeAllRanges(); s.addRange(r); }""", el_id)
        box = pg.eval_on_selector("#" + el_id, "e => { const b = e.getBoundingClientRect(); return [b.left + 20, b.top + 5]; }")
        pg.evaluate("([x,y]) => document.dispatchEvent(new MouseEvent('mouseup', {clientX:x, clientY:y, bubbles:true}))", box)
        pg.wait_for_timeout(200)
        shadow("r => r.querySelector('.btn').click()")
        pg.wait_for_timeout(1200)
        return shadow("r => [r.querySelector('.body').textContent, r.querySelector('.meta').textContent]")
    body, meta = select_and_translate("long")
    check("truncated selection: text shown", body.startswith("[Japanese] LONGTEXT"))
    check("truncated selection: meta says incomplete", "incomplete" in meta)
    body, meta = select_and_translate("sel")
    check("normal selection: no incomplete note", body == "[Japanese] Pick this sentence" and "incomplete" not in meta)
    setcfg(providers={"9router": {"baseUrl": base + "/alt/v1", "apiKey": "", "model": "mock/m1"}})
    pg.wait_for_timeout(300)
    body, _ = select_and_translate("sel")
    check("selection cache: new base URL is not served from cache", body == "[Japanese@alt] Pick this sentence")

    # --- context menu: rapid toggles end in the right state without duplicate-id errors
    errs = sw.evaluate("""async () => {
      for (let i = 0; i < 6; i++) {
        const { settings } = await chrome.storage.local.get('settings');
        chrome.storage.local.set({ settings: { ...settings, features: { ...settings.features, page: i % 2 === 1 } } });
      }
      await new Promise(r => setTimeout(r, 800));
      // page ended ON: the item must exist exactly once (update succeeds, a second create fails).
      const exists = await new Promise(r => chrome.contextMenus.update('wraithspeak-page', {}, () => r(!chrome.runtime.lastError)));
      return { exists };
    }""")
    check("context menu present after rapid toggles", errs["exists"] is True)
    check("no duplicate-id menu errors", not [m for m in console_msgs if "duplicate id" in m.lower()])
    ctx.close()
print("FAILS:", fails); sys.exit(1 if fails else 0)
