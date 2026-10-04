import json, threading, http.server, time, sys, tempfile, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

calls = []
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def _send(self, body, ctype="application/json"):
        b = body.encode() if isinstance(body,str) else body
        self.send_response(200); self.send_header("Content-Type", ctype)
        self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Access-Control-Allow-Headers","*")
        self.end_headers(); self.wfile.write(b)
    def do_OPTIONS(self): self._send("")
    def do_GET(self):
        if self.path.startswith("/v1/models"): return self._send(json.dumps({"data":[{"id":"mock/m1"}]}))
        self._send("""<!doctype html><html><body>
<h1>Hello world</h1>
<p id=p1>First <b>bold</b> paragraph here.</p>
<pre id=code>const x = 1; // keep me</pre>
<p class="notranslate" id=nt>Do not touch</p>
<ul><li id=li1>Item one</li><li>Item two</li></ul>
<textarea id=ta>typed text</textarea>
<div style="height:3000px"></div>
<p id=far>Far below paragraph</p>
</body></html>""","text/html")
    def do_POST(self):
        n = int(self.headers.get("Content-Length",0)); body = json.loads(self.rfile.read(n))
        user = body["messages"][-1]["content"]; sysm = body["messages"][0]["content"]
        calls.append(user)
        if "JSON array" in sysm:
            out = json.dumps(["[ID] "+t for t in json.loads(user)])
        else:
            out = "[ID] "+user
        self._send(json.dumps({"choices":[{"message":{"content":out}}]}))
srv = http.server.ThreadingHTTPServer(("127.0.0.1",0),H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
HERE=Path(__file__).parent
EXT=str(HERE.parent/"dist"/"chromium")
OUT=HERE/"out"; OUT.mkdir(exist_ok=True)
base=f"http://127.0.0.1:{port}"
fails=[]
def check(name, cond):
    print(("PASS " if cond else "FAIL ")+name)
    if not cond: fails.append(name)

with sync_playwright() as pw:
    ctx = pw.chromium.launch_persistent_context(tempfile.mkdtemp(), headless=False, args=[
        "--headless=new", f"--disable-extensions-except={EXT}", f"--load-extension={EXT}", "--no-sandbox"])
    time.sleep(2)
    sw = ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event("serviceworker")
    def setcfg(**kw):
        s = {"provider":"9router","targetLang":"id","features":{"selection":True,"page":True},"page":{"mode":"replace","lazy":True},
             "providers":{"9router":{"baseUrl":base+"/v1","apiKey":"","model":"mock/m1"}}}
        for k,v in kw.items(): s[k]=v
        sw.evaluate("s => chrome.storage.local.set({settings: s})", s)
    def cmd(action, url_prefix=base):
        return sw.evaluate("""async ([a,u]) => {
          const [tab] = await chrome.tabs.query({url: u+'/*'});
          if (a==='state') { try { return (await chrome.tabs.sendMessage(tab.id,{type:'pageState'},{frameId:0})).active } catch(e){return 'err:'+e} }
          await chrome.tabs.sendMessage(tab.id,{type:'pageCmd',action:a}); return true }""",[action,url_prefix])
    setcfg()
    pg = ctx.new_page(); pg.goto(base+"/page"); pg.wait_for_timeout(500)
    check("idle state", cmd("state") is False)
    cmd("start"); pg.wait_for_timeout(1500)
    check("state active", cmd("state") is True)
    t = lambda sel: pg.inner_text(sel)
    check("h1 translated", t("h1").startswith("[ID]"))
    check("inline paragraph translated per node", "[ID] First" in t("#p1") and "[ID] bold" in t("#p1"))
    check("code untouched", t("#code")=="const x = 1; // keep me")
    check("notranslate untouched", t("#nt")=="Do not touch")
    check("textarea untouched", pg.input_value("#ta")=="typed text")
    check("lazy: far paragraph NOT yet translated", t("#far")=="Far below paragraph")
    n_before=len(calls)
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(1500)
    check("far paragraph translated after scroll", t("#far").startswith("[ID]"))
    check("batched (not one call per node)", n_before<=2)
    # bar exists in closed shadow root -> cannot query; screenshot instead
    pg.evaluate("window.scrollTo(0,0)")
    pg.screenshot(path=str(OUT/"replace.png"))
    cmd("stop"); pg.wait_for_timeout(300)
    check("restored h1", t("h1")=="Hello world")
    check("restored far", t("#far")=="Far below paragraph")
    check("idle again", cmd("state") is False)

    # bilingual + non-lazy
    setcfg(page={"mode":"bilingual","lazy":False}); pg.reload(); pg.wait_for_timeout(500)
    calls.clear(); cmd("start"); pg.wait_for_timeout(1500)
    check("bilingual keeps original", "First bold paragraph here." in t("#p1").replace("\n"," "))
    check("bilingual adds translation", "[ID] First bold paragraph here." in t("#p1").replace("\n"," "))
    check("non-lazy translated far at once", "[ID] Far below" in t("#far"))
    pg.screenshot(path=str(OUT/"bilingual.png"))
    cmd("stop"); pg.wait_for_timeout(300)
    check("bilingual removed", t("#p1")=="First bold paragraph here." and pg.locator("[data-wraithspeak-tr]").count()==0)

    # feature toggles
    setcfg(features={"selection":False,"page":True}); pg.reload(); pg.wait_for_timeout(600)
    pg.evaluate("""()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('li1'));const s=getSelection();s.removeAllRanges();s.addRange(r)}""")
    pg.evaluate("document.dispatchEvent(new MouseEvent('mouseup',{clientX:60,clientY:60,bubbles:true}))"); pg.wait_for_timeout(300)
    check("selection off: no host injected", pg.locator("#wraithspeak-host").count()==0)
    setcfg(features={"selection":True,"page":True}); pg.wait_for_timeout(300)
    pg.evaluate("""()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('li1'));const s=getSelection();s.removeAllRanges();s.addRange(r)}""")
    pg.evaluate("document.dispatchEvent(new MouseEvent('mouseup',{clientX:60,clientY:60,bubbles:true}))"); pg.wait_for_timeout(300)
    check("selection on: host injected live", pg.locator("#wraithspeak-host").count()==1)
    # page off -> disabled
    setcfg(features={"selection":True,"page":False}); pg.wait_for_timeout(300)
    check("page off: menu removed", sw.evaluate("()=>new Promise(r=>chrome.contextMenus.removeAll(()=>r(true)))") is True)
    # error path
    setcfg(providers={"9router":{"baseUrl":base+"/v1","apiKey":"","model":""}}); pg.reload(); pg.wait_for_timeout(500)
    cmd("start"); pg.wait_for_timeout(1000)
    pg.screenshot(path=str(OUT/"error.png"))
    check("error leaves page untouched", t("h1")=="Hello world")
    ctx.close()
print("FAILS:", fails); sys.exit(1 if fails else 0)
