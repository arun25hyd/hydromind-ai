#!/usr/bin/env python3
"""
inject_ad_sidebar.py
Injects a fixed right-side ad sidebar into HydroMind pages that lack one.
Run from: /Users/admin/HydroMind-Platform/web-frontend/
"""

import os

PAGES = [
    "ai_advisor.html",
    "crane_diagnostic.html",
    "pricing.html",
    "system_design.html",
    "knowledge_base.html",
    "privacy.html",
    "disclaimer.html",
]

AD_SIDEBAR_HTML = """
<!-- ── FIXED RIGHT AD SIDEBAR ── -->
<style>
#hm-ad-rail{
  position:fixed;top:72px;right:0;width:120px;height:calc(100vh - 84px);
  display:flex;flex-direction:column;gap:12px;align-items:center;
  padding:12px 8px;z-index:90;pointer-events:none;
}
.hm-ad-unit{
  width:108px;background:rgba(249,115,22,.04);
  border:1px dashed rgba(249,115,22,.2);border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:10px 6px;pointer-events:auto;
  font-family:'Space Mono',monospace;gap:5px;
}
.hm-ad-unit svg{opacity:.25;}
.hm-ad-unit-label{font-size:8px;color:#404855;text-transform:uppercase;letter-spacing:.06em;}
.hm-ad-unit-size{font-size:7.5px;color:#404855;opacity:.7;}
.hm-ad-unit-link{
  font-size:8px;color:rgba(249,115,22,.4);text-decoration:none;
  letter-spacing:.04em;margin-top:4px;display:block;
}
.hm-ad-unit-link:hover{color:rgba(249,115,22,.8);}
@media(max-width:1200px){#hm-ad-rail{display:none;}}
</style>
<div id="hm-ad-rail">
  <div class="hm-ad-unit" style="min-height:240px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    <span class="hm-ad-unit-label">Advertisement</span>
    <span class="hm-ad-unit-size">120×240</span>
    <a href="pricing.html" class="hm-ad-unit-link">Advertise →</a>
  </div>
  <div class="hm-ad-unit" style="min-height:240px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    <span class="hm-ad-unit-label">Advertisement</span>
    <span class="hm-ad-unit-size">120×240</span>
    <a href="pricing.html" class="hm-ad-unit-link">Advertise →</a>
  </div>
</div>
<!-- ── /FIXED RIGHT AD SIDEBAR ── -->
"""

SENTINEL = "<!-- hm-ad-rail-injected -->"

base_dir = os.path.dirname(os.path.abspath(__file__))

for page in PAGES:
    path = os.path.join(base_dir, page)
    if not os.path.exists(path):
        print(f"SKIP (not found): {page}")
        continue

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if SENTINEL in content:
        print(f"SKIP (already injected): {page}")
        continue

    if "</body>" not in content:
        print(f"SKIP (no </body>): {page}")
        continue

    # Inject before last </body>
    inject = SENTINEL + "\n" + AD_SIDEBAR_HTML
    content = content.replace("</body>", inject + "\n</body>", 1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"OK: {page}")

print("\nDone.")
