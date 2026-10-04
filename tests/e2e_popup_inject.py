import json, threading, http.server, time, sys, tempfile, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def _s(self,b,c="application/json"):
        self.send_response(200); self.send_header("Content-Type",c); self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Access-Control-Allow-Headers","*"); self.end_headers(); self.wfile.write(b.encode())
    def do_OPTIONS(self): self._s("")
    def do_GET(self): self._s("<html><body><h1>Hello world</h1><p>Some text</p></body></html>","text/html")
    def do_POST(self):
        n=int(self.headers.get("Content-Length",0)); b=json.loads(self.rfile.read(n)); u=b["messages"][-1]["content"]; sy=b["messages"][0]["content"]
        out=json.dumps(["[ID] "+t for t in json.loads(u)]) if "JSON array" in sy else "[ID] "+u
        self._s(json.dumps({"choices":[{"message":{"content":out}}]}))
srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),H); port=srv.server_address[1]; threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f"http://127.0.0.1:{port}"; fails=[]
def check(n,c):
    print(("PASS " if c else "FAIL ")+n); (not c) and fails.append(n)
def run(ext, prof, inject_expected):
    with sync_playwright() as pw:
        ctx=pw.chromium.launch_persistent_context(tempfile.mkdtemp(),headless=False,args=["--headless=new",f"--disable-extensions-except={ext}",f"--load-extension={ext}","--no-sandbox"])
        time.sleep(2); sw=ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event("serviceworker"); eid=sw.url.split('/')[2]
        s={"provider":"9router","targetLang":"id","features":{"selection":True,"page":True},"page":{"mode":"replace","lazy":False},"providers":{"9router":{"baseUrl":base+"/v1","apiKey":"","model":"m"}}}
        sw.evaluate("s=>chrome.storage.local.set({settings:s})",s)
        pg=ctx.new_page(); pg.goto(base+"/x"); pg.wait_for_timeout(500)
        # popup page: use as extension page, ask background directly for the real tab
        pop=ctx.new_page(); pop.goto(f"chrome-extension://{eid}/popup.html"); pop.wait_for_timeout(500)
        errs=[]; pop.on("pageerror",lambda e:errs.append(str(e)))
        tid=sw.evaluate("async b=>(await chrome.tabs.query({url:b+'/*'}))[0].id",base)
        r=pop.evaluate("t=>chrome.runtime.sendMessage({type:'pageStatus',tabId:t})",tid)
        check(f"{inject_expected}: reachable (injected if needed)", r["reachable"] and r["active"] is False)
        r=pop.evaluate("t=>chrome.runtime.sendMessage({type:'togglePage',tabId:t})",tid)
        check(f"{inject_expected}: toggle started", r["status"]=="started"); pg.wait_for_timeout(1500)
        check(f"{inject_expected}: translated", pg.inner_text("h1").startswith("[ID]"))
        r=pop.evaluate("t=>chrome.runtime.sendMessage({type:'togglePage',tabId:t})",tid)
        check(f"{inject_expected}: toggle stopped", r["status"]=="stopped"); pg.wait_for_timeout(300)
        check(f"{inject_expected}: restored", pg.inner_text("h1")=="Hello world")
        # popup UI
        pop.screenshot(path=str(OUT/f"popup_{inject_expected}.png"))
        pop.select_option("#lang","ja"); pop.uncheck("#f-selection",force=True); pop.wait_for_timeout(300)
        st=sw.evaluate("()=>chrome.storage.local.get('settings')")["settings"]
        check("popup saves language + toggle", st["targetLang"]=="ja" and st["features"]["selection"] is False and st["provider"]=="9router")
        check("popup no js errors", not errs)
        ctx.close()
HERE=Path(__file__).parent
DIST=HERE.parent/"dist"/"chromium"
OUT=HERE/"out"; OUT.mkdir(exist_ok=True)
# Second run: same extension without manifest content_scripts, to prove on-demand injection works.
tmp=Path(tempfile.mkdtemp())/"nocs"; shutil.copytree(DIST,tmp)
m=json.loads((tmp/"manifest.json").read_text()); del m["content_scripts"]; (tmp/"manifest.json").write_text(json.dumps(m))
run(str(DIST),"-","with-content-script")
run(str(tmp),"-","injection-only")
print("FAILS",fails); sys.exit(1 if fails else 0)
