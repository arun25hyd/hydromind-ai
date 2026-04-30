#!/usr/bin/env python3
"""Patch HydroMind pages - run from web-frontend directory"""
import re, shutil, os

BASE = '/Users/admin/HydroMind-Platform/web-frontend/pages'

# ═══════════════════════════════════════════════════════════
# PATCH 1: AI Advisor — add ad slots to both sidebars
# ═══════════════════════════════════════════════════════════
ai_file = os.path.join(BASE, 'AI Advisor.html')
shutil.copy(ai_file, ai_file + '.bak')
src = open(ai_file, 'r', encoding='utf-8').read()

AD_CSS = """
/* ── AD SLOTS ── */
.ad-slot{
  margin:12px 10px;border-radius:10px;
  border:1px dashed rgba(255,107,26,.2);
  background:rgba(255,107,26,.03);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:6px;padding:14px 10px;text-align:center;flex-shrink:0;
}
.ad-slot-label{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--tm)}
.ad-slot-inner{width:100%;min-height:120px;border-radius:7px;background:var(--bg3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center}
.ad-slot-inner span{font-size:10px;color:var(--tm);font-family:var(--mono);text-align:center;line-height:1.6}
.ad-slot-banner{width:100%;height:52px;border-radius:7px;background:var(--bg3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;margin-top:6px}
.ad-slot-banner span{font-size:10px;color:var(--tm);font-family:var(--mono)}
"""

# Insert ad CSS before </style>
src = src.replace('</style>\n</head>', AD_CSS + '</style>\n</head>', 1)

# Fix sidebar to scroll
src = src.replace(
    'display:flex;flex-direction:column;background:rgba(13,16,20,.96);overflow:hidden;\n}',
    'display:flex;flex-direction:column;background:rgba(13,16,20,.96);overflow:hidden;overflow-y:auto;\n}'
)


LEFT_AD = """
    <!-- LEFT SIDEBAR AD SLOT -->
    <div class="ad-slot" style="margin-top:auto">
      <div class="ad-slot-label">Sponsored</div>
      <div class="ad-slot-inner"><span>Advertisement<br>250 × 250</span></div>
      <div class="ad-slot-banner"><span>Banner 250 × 60</span></div>
    </div>
  </aside>"""

# Find the ctx-tags closing div + </aside>
# Search for the formulas ctx-tag line followed by </div> and </aside>
old_aside = """      <span class="ctx-tag" onclick="toggleCtx(this)" data-ctx="formulas">Formulas</span>
    </div>
  </aside>"""
new_aside = """      <span class="ctx-tag" onclick="toggleCtx(this)" data-ctx="formulas">Formulas</span>
    </div>""" + LEFT_AD

if old_aside in src:
    src = src.replace(old_aside, new_aside)
    print("Left sidebar ad slot: OK")
else:
    print("WARNING: left sidebar pattern not found")

RIGHT_AD = """
  <!-- RIGHT PANEL AD SLOT -->
  <div class="ad-slot" style="padding:16px 10px">
    <div class="ad-slot-label">Sponsored</div>
    <div class="ad-slot-inner" style="min-height:180px"><span>Advertisement<br>250 × 200</span></div>
    <div class="ad-slot-banner"><span>Banner 250 × 60</span></div>
  </div>

</div><!-- /main -->"""

# Find end of right panel
old_end = '</div>\n\n</div><!-- /main -->'
if old_end in src:
    src = src.replace(old_end, RIGHT_AD, 1)
    print("Right panel ad slot: OK")
else:
    print("WARNING: right panel end pattern not found, trying alternate...")
    old_end2 = '  </div>\n\n</div><!-- /main -->'
    if old_end2 in src:
        src = src.replace(old_end2, RIGHT_AD, 1)
        print("Right panel ad slot (alt): OK")
    else:
        print("ERROR: could not find end pattern")

open(ai_file, 'w', encoding='utf-8').write(src)
print("AI Advisor saved:", len(src), "chars")
