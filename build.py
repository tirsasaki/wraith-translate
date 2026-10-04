#!/usr/bin/env python3
"""Builds browser packages from src/ into dist/.

  chromium/  Chrome, Edge, Brave, Opera, Vivaldi, Arc (Manifest V3 service worker)
  firefox/   Firefox 128+ (Manifest V3 background script + gecko settings)

Usage: python3 build.py
"""
import json, shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).parent
SRC, DIST = ROOT / "src", ROOT / "dist"
GECKO_ID = "wraith-translate@tirsasaki"

def firefox_manifest(m):
    m = json.loads(json.dumps(m))
    m["background"] = {"scripts": [m["background"]["service_worker"]], "type": "module"}
    m["browser_specific_settings"] = {
        "gecko": {
            "id": GECKO_ID,
            "strict_min_version": "128.0",
            "data_collection_permissions": {"required": ["websiteContent"]},
        }
    }
    return m

TARGETS = {"chromium": lambda m: m, "firefox": firefox_manifest}

def main():
    base = json.loads((SRC / "manifest.json").read_text())
    version = base["version"]
    shutil.rmtree(DIST, ignore_errors=True)
    for name, tweak in TARGETS.items():
        out = DIST / name
        shutil.copytree(SRC, out)
        (out / "manifest.json").write_text(json.dumps(tweak(base), indent=2) + "\n")
        zpath = DIST / f"wraith-translate-{name}-v{version}.zip"
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for f in sorted(out.rglob("*")):
                if f.is_file():
                    z.write(f, f.relative_to(out))
        print("built", zpath.relative_to(ROOT))

if __name__ == "__main__":
    main()
