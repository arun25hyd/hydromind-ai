---
name: session-skill
version: v3.0
date: 2026-05-01
description: >
  Session orientation skill for Claude working on the HydroMind AI project with Arun
  (Crane Supervisor / Hydraulic Systems Specialist, EnerMech, Abu Dhabi).
  MUST be loaded at START of every session before any code, file, or git operation.
  Triggers: ANY HydroMind task, coding request, file edit, git push, KB entry,
  Android app build, page redesign, or backend change.
---

# Claude Session Skill — HydroMind AI Project v3.0

---

## RULE 0 — LOAD THIS FIRST, ALWAYS

Before writing a single line of code:
1. Read this file fully
2. State exact files to touch
3. ONE question only if critical parameter unknown
4. Execute — no guessing, no repeating

---

## RULE 1 — EXECUTION PROTOCOL (NON-NEGOTIABLE)

INSPECT → PLAN → EXECUTE → VERIFY LIVE → COMMIT

| Step | Action | Tool |
|---|---|---|
| INSPECT | Read actual file structure — grep shell/nav/div counts | Desktop Commander:start_process |
| PLAN | State changes + files + risks to Arun before touching anything | Text |
| EXECUTE | Single clean pass — never patch a broken patch | Python script via start_process |
| VERIFY LIVE | Browser screenshot of every changed page | Claude in Chrome |
| COMMIT | Only after live browser confirms page loads correctly | git add -A && push |

NEVER claim done without browser screenshot.
NEVER edit without reading full file structure first.
NEVER patch a patch — restore from clean Downloads source if broken.

---

## RULE 2 — REPEAT MISTAKES REGISTRY (NEVER REPEAT THESE)

| # | Mistake | Correct Behaviour |
|---|---|---|
| 1 | Edit HTML without reading structure | grep shell/nav/div layout before any edit |
| 2 | Nav regex consuming closing shell div | Only replace nav tag contents — assert div count unchanged |
| 3 | Claim "fixed" without browser screenshot | Browser screenshot is the ONLY acceptable proof |
| 4 | Patching broken patches | Restore from clean Downloads source, patch minimally |
| 5 | Changing hero grid for ad slots | Add ads as position:fixed or outside grid — never change grid |
| 6 | window.claude.complete() on live site | Use mailto: or Supabase — claude.complete works in Claude artifacts only |
| 7 | Assuming all pages have same structure | Shell pages vs scroll pages — always check before editing |
| 8 | Using bash_tool for Mac filesystem | Container /mnt ≠ Mac — always use Desktop Commander for Mac |
| 9 | Not waiting for Vercel deploy before checking | Wait 15-20s then browser verify |
| 10 | Not counting divs after regex edit | Count shell open/close divs before AND after every regex |
| 11 | Multiple questions to Arun | Max ONE question |
| 12 | Saying "done" without browser screenshot | Screenshot = only proof. No screenshot = not done. |
| 13 | Re-doing tasks Arun confirmed with 👍 | If Arun said 👍 — never touch it again |
| 14 | Long preamble before acting | Act first, brief explanation after |
| 15 | Adding new CSS without checking existing classes | grep existing CSS before writing new rules |

---

## RULE 3 — PROJECT STATE (May 1, 2026)

### Platform URLs
| Service | URL |
|---|---|
| Frontend (live) | https://hydromindai.com |
| Backend | https://hydromind-backend.onrender.com |
| Supabase | frqefpoheewbornozvhc |

### Mac File Paths (EXACT)
| Item | Path |
|---|---|
| Frontend root | /Users/admin/Desktop/HydroMind-Platform/web-frontend |
| Backend root | /Users/admin/Desktop/HydroMind-Platform/backend |
| Android app | /Users/admin/HydroMind-Platform/android-app |
| Skills root | /Users/admin/Desktop/HydroMind-Platform/web-frontend/skills |
| Session skill | /Users/admin/Desktop/HydroMind-Platform/web-frontend/skills/claude-session-skill/SKILL.md |

### Git Remotes
| Repo | Remote |
|---|---|
| Frontend (Vercel) | arun25hyd/hydromind-ai |
| Backend (Render) | arun25hyd/hydromind-backend |

### Clean Source HTML Files in Downloads (RESTORE FROM HERE IF PAGE BROKEN)
| Deployed name | Downloads source |
|---|---|
| index.html | HydroMind .html |
| ai_advisor.html | AI Advisor.html |
| crane_diagnostic.html | Crane Diagnostic.html |
| system_design.html | System Design .html |
| knowledge_base.html | Knowledge  Base.html |
| pricing.html | Pricing (1).html |

GOLDEN RULE: If a page is broken or blank — restore from Downloads source. Never patch a broken patch.

### KB State (May 1, 2026)
- KB1–KB47: OEM manuals
- KB48: Fukushima IHI — PENDING
- KB49–KB86: Hydraulic textbooks, crane standards, seals, wire rope, rigging
- SKILL.md: 6,533 lines | v2.13 | Next KB: KB87

---

## RULE 4 — HTML PAGE STRUCTURES (CRITICAL — READ BEFORE EVERY EDIT)

### SHELL LAYOUT pages — nav MUST be INSIDE the shell div:
- ai_advisor.html
- crane_diagnostic.html
- system_design.html

Correct structure:
```
<body>
  <div class="bg-wrap"><canvas id="bgCanvas"></canvas></div>
  <div class="shell">              ← ALL content inside here
    <nav class="nav">...</nav>
    <div class="mobile-menu" id="mobileMenu OR mm">...</div>
    <div class="ticker">...</div>
    <div class="main">...</div>
  </div><!-- /shell -->            ← IF CONSUMED → PAGE GOES COMPLETELY BLANK
</body>
```

DANGER: crane_diagnostic.html uses id="mm" NOT id="mobileMenu".
DANGER: If the closing </div><!--/shell--> is eaten by regex → page shows only black particle background.
VERIFY: After any edit grep for closing shell comment: grep "shell" filename.html

### SCROLL LAYOUT pages — normal scroll, no shell:
- index.html
- knowledge_base.html
- pricing.html
- privacy.html
- disclaimer.html

---

## RULE 5 — SAFE NAV REPLACEMENT TEMPLATE (use this exactly)

```python
import re

with open(fname, 'r') as f:
    html = f.read()

# Count BEFORE
shell_before = html.count('<div class="shell">')
mm_before = html.count('class="mobile-menu"') + html.count('id="mm"')

# Replace ONLY nav tag — narrow pattern, count=1
html = re.sub(r'<nav\b[^>]*>.*?</nav>', NEW_NAV_HTML, html, count=1, flags=re.DOTALL)

# ASSERT — if these fail, ABORT and restore from source
assert html.count('<div class="shell">') == shell_before, "SHELL BROKEN — ABORT"
assert (html.count('class="mobile-menu"') + html.count('id="mm"')) == mm_before, "MOBILE MENU BROKEN — ABORT"

with open(fname, 'w') as f:
    f.write(html)
```

---

## RULE 6 — UNIFIED NAV HTML (same structure all pages — only class="active" changes)

```html
<nav class="nav">
  <a class="nav-logo" href="index.html">
    <div class="nav-logo-icon">HM</div>
    <span class="nav-logo-text">HYDRO<b>MIND</b>.AI</span>
  </a>
  <div class="nav-links">
    <a href="index.html">Home</a>
    <a href="ai_advisor.html">AI Advisor</a>
    <a href="crane_diagnostic.html">Crane Diagnostic</a>
    <a href="system_design.html">System Design</a>
    <a href="knowledge_base.html">Knowledge Base</a>
    <a href="pricing.html">Pricing</a>
  </div>
  <div class="nav-r">
    <span class="badge badge-green"><span class="dot-pulse"></span> AI ONLINE</span>
    <button class="btn-login" onclick="openAuth('login')">Login</button>
    <button class="btn-pro" onclick="openAuth('register');selectPlan('pro')">Get Pro →</button>
  </div>
  <button class="nav-toggle" onclick="document.getElementById('mobileMenu').classList.toggle('open')">
    <span></span><span></span><span></span>
  </button>
</nav>
```

Active page link gets: class="active"
Logo icon MUST show: HM — never H. or H or blank.

---

## RULE 7 — DESIGN SYSTEM (May 1, 2026)

| Token | Value |
|---|---|
| Primary orange | #FF6B1A / var(--o) |
| Orange 2 | #FF9A4A / var(--o2) |
| Background | #080A0C / var(--bg) |
| Surface | #0D1014 / var(--bg2) |
| Card | #131820 / var(--bg3) |
| Border | rgba(255,255,255,0.07) / var(--b) |
| Text primary | #EEF0F4 / var(--t) |
| Text muted | #8A919E / var(--td) |
| Green | #34D399 / var(--green) |
| Blue | #60A5FA / var(--blue) |
| Font sans | Space Grotesk |
| Font mono | Space Mono |

Active nav: color:var(--o); background:rgba(255,107,26,.12); font-weight:700
Gold and cyan: FULLY ELIMINATED — never reintroduce.

---

## RULE 8 — SITE STATUS (May 1, 2026)

All 8 pages working live:
- index.html ✅ — animated circuit v4.0
- ai_advisor.html ✅ — full shell layout, chat working
- crane_diagnostic.html ✅ — PLC sequence, instrument bar
- system_design.html ✅ — 12-step wizard
- knowledge_base.html ✅ — 45+ docs loading
- pricing.html ✅ — feedback mailto:support@hydromindai.com
- privacy.html ✅
- disclaimer.html ✅

Pending items:
- Ad slots hero (left/right) — safe implementation without touching grid
- Ad slots KB (left/right) — same
- Login → nav update post-auth — onclick wired, needs live confirm
- /pages/* redirects — live in vercel.json

---

## RULE 9 — ANDROID APP STATE

| Item | Value |
|---|---|
| Package | com.hydromind.app |
| EAS account | arun25hyd |
| App path | /Users/admin/HydroMind-Platform/android-app |
| versionCode | 35 (set on EAS remote) |
| Build | In progress — started May 1 08:32 AM |
| Build ID | a7521b1e-fb66-458c-bf09-5003dafb784f |
| Next step | Build complete → Internal Testing → Production |

HydroFit (com.hydrofit.app): /Users/admin/hydrofit — EAS build deferred.

---

## RULE 10 — GIT WORKFLOW (exact)

```bash
cd /Users/admin/Desktop/HydroMind-Platform/web-frontend
git branch           # MUST confirm main
git add -A
git commit -m "fix: description"
git push origin main
# Wait 20 seconds
# Open browser → screenshot every changed page
# Only then report done to Arun
```

---

## RULE 11 — BROWSER VERIFICATION PROTOCOL (MANDATORY AFTER EVERY PUSH)

```
1. Claude in Chrome: list_connected_browsers → select_browser → tabs_context_mcp
2. navigate to EVERY changed page URL
3. wait 4-5 seconds per page
4. screenshot — check ALL of:
   ✓ Nav bar visible at top
   ✓ Correct page active in orange
   ✓ Logo shows HM
   ✓ Page content visible — NOT blank dark screen
   ✓ No layout broken
5. If blank → check shell div, restore from source
6. ONLY after all pages pass → report done to Arun
```

---

## RULE 12 — TOOL SELECTION

| Task | Correct Tool |
|---|---|
| Read file on Mac | Desktop Commander:read_file |
| Run command on Mac | Desktop Commander:start_process |
| Edit file on Mac | Desktop Commander:start_process (Python) |
| Browse live site | Claude in Chrome |
| Read uploaded file | view /mnt/user-data/uploads/ |
| Run bash in container | bash_tool |

Container /mnt ≠ Mac filesystem. NEVER confuse them.

---

## RULE 13 — HYDRAULIC TROUBLESHOOTING PROTOCOL

1. Identify: System type → Architecture → Suspect component
2. Check: KB entry for that model first (KB01–KB86)
3. Diagnose: Pressure → Flow → Temperature → Case drain
4. Isolate: Upstream vs downstream of suspect
5. Test: Specific gauge points or signal measurements
6. Conclude: Root cause + corrective action + parts list

Architecture types:
- Closed loop hydraulic: pilot joystick → pump swash direct, no electronics
- Electronic closed loop: PLC → amplifier → prop valve → swash → motor A/B, brake DCV
- Open loop pilot DCV: constant flow pump → DCV → motor/cylinder → tank, CBVs at 110-130% load

OEM tools: Liebherr=LiDAT | Rexroth=BODAS | Danfoss=PLUS+1 | Eaton=gauges only

---

## RULE 14 — COMMUNICATION STYLE

- 👍 from Arun = task complete — NEVER redo it
- Arun corrects directly — accept immediately, no defence, no excuses
- Short responses unless code/tables required
- Lead with action, not preamble
- ONE question max per response
- Engineering tone: precise, direct, no waffle
- Never say "done" without browser screenshot proof

---

## RULE 15 — SELF-CHECK BEFORE EVERY EDIT

Before touching any file answer all these:
- Read full file structure (not just target lines)?
- Counted shell div open/close?
- Using clean source or patching broken patch?
- Will verify live in browser before reporting done?
- Correct tool: Mac=Desktop Commander, Container=bash_tool?
- Regex narrow enough — not consuming surrounding divs?

If ANY is NO — stop and fix first.

---

## Version Control

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-04-04 | Initial |
| v2.0 | 2026-04-19 | KB71-86, hero v2, advisor 8 modes, Android versionCode 35 |
| v3.0 | 2026-05-01 | CRITICAL UPDATE: shell layout rules, safe nav template, browser verify mandatory, May 1 site state, full mistake registry from today's failures |
