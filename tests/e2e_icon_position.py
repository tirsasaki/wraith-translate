"""Selection icon must float right above the selected word (double-click) / release point (drag)."""
import threading, http.server, time, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

TEXT = ("Everyone's first VPS purchase looks the same: sort by price, pick the cheapest 4 GB plan, deploy, feel clever. "
        "Then comes the migration at 1 a.m. — the \"unmetered\" bandwidth that throttles after 2 TB, the kernel you cannot "
        "upgrade because the host runs containers, the support ticket that ages like milk. A VPS is infrastructure. "
        "Buy it like infrastructure.")

class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        b = (f'<!doctype html><html><body style="margin:0;font:20px/1.6 Georgia,serif"><article style="max-width:640px;margin:60px auto">'
             f'<p id=p>{TEXT}</p><div style="height:2000px"></div></article></body></html>').encode()
        self.send_response(200); self.send_header("Content-Type", "text/html"); self.end_headers(); self.wfile.write(b)

srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
EXT = str(Path(__file__).parent.parent / "dist" / "chromium")
fails = []
def check(n, c):
    print(("PASS " if c else "FAIL ") + n)
    if not c: fails.append(n)

def icon_box(pg):
    pts = pg.evaluate("""()=>{const o=[];for(let y=0;y<innerHeight;y+=2)for(let x=0;x<innerWidth;x+=2){
        const e=document.elementFromPoint(x,y);if(e&&e.id==='wraithspeak-host')o.push([x,y])}return o}""")
    if not pts: return None
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return min(xs), max(xs), min(ys), max(ys)

def word_rect(pg, word):
    return pg.evaluate("""(w)=>{const t=document.getElementById('p').firstChild;const i=t.nodeValue.indexOf(w);
        const r=document.createRange();r.setStart(t,i);r.setEnd(t,i+w.length);const b=r.getBoundingClientRect();
        return {l:b.left,t:b.top,r:b.right,b:b.bottom}}""", word)

with sync_playwright() as pw:
    ctx = pw.chromium.launch_persistent_context(tempfile.mkdtemp(), headless=False, args=[
        "--headless=new", f"--disable-extensions-except={EXT}", f"--load-extension={EXT}", "--no-sandbox"])
    time.sleep(2)
    pg = ctx.new_page(); pg.goto(f"http://127.0.0.1:{port}/"); time.sleep(1)

    # 1) double-click "unmetered": icon centered above that word, not at the end of the paragraph
    w = word_rect(pg, "unmetered")
    pg.mouse.dblclick((w["l"] + w["r"]) / 2, (w["t"] + w["b"]) / 2); time.sleep(0.5)
    check("double-click selected 'unmetered'", pg.evaluate("getSelection().toString()") == "unmetered")
    b = icon_box(pg)
    check("icon shown", b is not None)
    if b:
        cx = (b[0] + b[1]) / 2
        check("icon horizontally centered on the word", abs(cx - (w["l"] + w["r"]) / 2) < 12)
        check("icon sits above the word (not overlapping it)", b[3] <= w["t"] and w["t"] - b[3] < 24)
    pg.screenshot(path=str(Path(__file__).parent / "icon_dblclick.png"))

    # 2) double-click the last word: icon must follow it, not jump elsewhere
    pg.mouse.click(5, 5); time.sleep(0.2)
    last = pg.evaluate("""()=>{const t=document.getElementById('p').firstChild;const i=t.nodeValue.lastIndexOf('infrastructure');
        const r=document.createRange();r.setStart(t,i);r.setEnd(t,i+14);const b=r.getBoundingClientRect();return {l:b.left,t:b.top,r:b.right,b:b.bottom}}""")
    pg.mouse.dblclick((last["l"] + last["r"]) / 2, (last["t"] + last["b"]) / 2); time.sleep(0.5)
    b = icon_box(pg)
    check("icon above last word 'infrastructure'", b is not None and abs((b[0]+b[1])/2 - (last["l"]+last["r"])/2) < 12 and b[3] <= last["t"])

    # 3) drag-select; icon near release point, above the line
    pg.mouse.click(5, 5); time.sleep(0.2)
    w = word_rect(pg, "bandwidth")
    y = (w["t"] + w["b"]) / 2
    pg.mouse.move(w["l"], y); pg.mouse.down(); pg.mouse.move(w["r"], y, steps=6); pg.mouse.up(); time.sleep(0.5)
    b = icon_box(pg)
    check("drag: icon above release point", b is not None and abs((b[0]+b[1])/2 - w["r"]) < 30 and b[3] <= w["t"])

    # 4) after scrolling
    pg.mouse.click(5, 5); pg.evaluate("window.scrollTo(0, 40)"); time.sleep(0.3)
    w = word_rect(pg, "unmetered")
    pg.mouse.dblclick((w["l"] + w["r"]) / 2, (w["t"] + w["b"]) / 2); time.sleep(0.5)
    b = icon_box(pg)
    check("scrolled page: icon above word", b is not None and b[3] <= w["t"] and abs((b[0]+b[1])/2 - (w["l"]+w["r"])/2) < 12)
    ctx.close()
print("FAILS:", fails) if fails else print("ALL PASS")
