# CLAUDE.md — HydroMind AI | Master System Protocol v3.0
# STATUS: ONLINE | PRECISION MODE: ACTIVE | Last updated: May 30 2026
# READ THIS FIRST. Every session. No exceptions.

---

## ▶ ROLE & MANDATE

Elite AI engineering engine for HydroMind AI platform.
Mandate: flawless execution, zero errors, no excuses, no apologies — results only.
Every task is mission-critical. Screenshot = only proof of done. Never claim fixed without seeing it.

---

## ▶ SESSION START — MANDATORY CHECKLIST (every session, no skip)

1. Read this entire file
2. Confirm CWD = /Users/Apple/Documents/HydroMind-Platform/web-frontend
3. Check git status — know current branch and last commit
4. Inspect target file BEFORE any edit (read/grep — never assume structure)
5. Take browser screenshot AFTER any push to verify
6. Never push more than once without a verified screenshot in between

---

## ▶ CORE OPERATING PRINCIPLES

| Principle          | Rule                                                                        |
|--------------------|-----------------------------------------------------------------------------|
| No Assumptions     | Never guess file structure — read it first                                  |
| No Patch-on-Patch  | Broken? Hard reset to last good commit. Never patch a broken patch.         |
| Screenshot First   | Browser screenshot = only proof of "done". curl is insufficient.            |
| One Push Per Fix   | One change, one push, one screenshot verify. Never batch unverified changes.|
| No Excuses         | Arun wants results, not explanations. Deliver or escalate honestly.         |
| Browser Available  | Claude in Chrome is connected — USE IT to verify live pages directly.       |
| Read Before Edit   | Always read the full file or at minimum the target section before any edit. |

---

## ▶ EXECUTION PROTOCOL — NON-NEGOTIABLE

**INSPECT → PLAN → EXECUTE → VERIFY → COMMIT**

1. INSPECT  → Read CLAUDE.md → read actual file → identify exact structure
2. PLAN     → State exactly what changes, exactly which files, exact lines
3. EXECUTE  → Single clean edit. If structure is damaged, git reset first.
4. VERIFY   → Browser screenshot via Claude in Chrome. Check every changed page.
5. COMMIT   → Only after screenshot confirms correct. Exact git commands below.

---

## ▶ SECTION 1 — CANONICAL PATHS (NO GUESSING, NO EXCEPTIONS)

| Component       | Canonical Path                                               |
|-----------------|--------------------------------------------------------------|
| Web Frontend    | /Users/Apple/Documents/HydroMind-Platform/web-frontend       |
| Backend         | /Users/Apple/Documents/HydroMind-Platform/backend            |
| Android App     | /Users/Apple/Documents/HydroMind-Platform/android-app        |
| CLAUDE.md       | /Users/Apple/Documents/HydroMind-Platform/CLAUDE.md          |
| SKILL.md        | /Users/Apple/Documents/HydroMind-Platform/SKILL.md           |
| web CLAUDE.md   | /Users/Apple/Documents/HydroMind-Platform/web-frontend/CLAUDE.md |

### DEAD PATHS — NEVER USE
# /Users/admin/  ← OLD MACBOOK — DOES NOT EXIST ON NEW MACHINE
# All /Users/admin/ paths are dead. Always /Users/Apple/

---

## ▶ SECTION 2 — DESIGN SYSTEM v2.0 (May 30 2026)

### CSS Variables (from css/hm-design.css — global stylesheet)
```
--bg:         #08090b
--surface:    #0f1117
--card:       #14171f
--border:     rgba(255,255,255,0.07)
--border-md:  rgba(255,255,255,0.12)
--orange:     #f97316
--green:      #22c55e
--text1:      #f1f3f6
--text2:      #8891a4
--text3:      #4b5568
--nav-h:      60px
--sb-w:       160px    ← sidebar width
--sans:       'Inter'
--mono:       'Space Mono'
```

### Layout (PRECISE — never guess)
- Sidebar: `160px` wide, `position:fixed`, `top:60px`, `height:calc(100vh - 60px)`
- Sidebars visible: `≥1280px` only — hidden via `@media (max-width:1279px)`
- Body: `padding-left:160px; padding-right:160px` (applied in hm-design.css)
- Nav height: `60px`, `width:100vw`, `margin-left:calc(-1 * 160px)` (spans full viewport)
- Shell pages: body `display:flex; flex-direction:column; height:100vh; overflow:hidden`
- The `.shell` div fills remaining height via `flex:1; min-height:0; overflow:hidden`

---

## ▶ SECTION 3 — HTML PAGE ARCHITECTURE

### TWO PAGE TYPES — IDENTIFY BEFORE TOUCHING ANYTHING

#### TYPE A — Shell Pages (fixed height, 3-column flex layout)
Files: ai_advisor.html, crane_diagnostic.html, system_design.html
- Body is flex column, shell fills viewport height
- Shell has 3 columns: left-panel | main-area | right-panel
- DO NOT add margin/padding to .shell — it kills the 3-col layout
- Nav is sticky, shell-ticker is below nav, shell fills remaining height

#### TYPE B — Scroll Pages (standard document flow)
Files: index.html, knowledge_base.html, pricing.html, privacy.html, disclaimer.html
- Standard scroll layout
- Body has padding-left/right from hm-design.css (160px each)
- .page wrapper, .container, sections use standard flow
- Footer at bottom via margin-top:auto

### HTML Structure (every page must have exactly these, in this order):
```html
<body>
  <aside class="hm-sidebar-left">...</aside>   ← position:fixed, CSS-only
  <aside class="hm-sidebar-right">...</aside>  ← position:fixed, CSS-only
  <nav class="hm-nav" id="hmNav">...</nav>     ← sticky, full viewport width
  <div class="shell-ticker">...</div>          ← shell pages only
  <div class="shell">...</div>                 ← shell pages only
  <div class="hm-page">...</div>               ← scroll pages only
  <footer class="hm-footer">...</footer>       ← all pages
  <div id="hmAuthOverlay">...</div>            ← all pages
  <script src="js/auth.js"></script>           ← all pages
</body>
```

### SIDEBAR RULES (hard lessons — never repeat)
1. Sidebars are `<aside>` elements, NOT `<div>` — semantic HTML
2. Position is controlled entirely by `css/hm-design.css` — NO inline position:fixed
3. No JavaScript injects the sidebars — they are static HTML at body level
4. No `hm-sidebar-offset` CSS block ever — that was the broken approach
5. Each page has exactly 1 left sidebar and 1 right sidebar — verify with grep

### NAV RULES
1. Nav is `width:100vw; margin-left:calc(-1 * var(--content-pl))` — spans full viewport
2. Nav has `position:sticky; top:0; z-index:200`
3. Shell pages: body overflow is hidden — nav is flex-shrink:0
4. ONE nav per page — verify after any shell page edit

---

## ▶ SECTION 4 — TECH STACK

### Web Frontend
- Pure HTML/CSS/JS — NO React, NO framework
- Global CSS: css/hm-design.css (v2.0) — import first in every page
- Fonts: Inter (body/headings) + Space Mono (code/labels/mono)
- Auth: js/auth.js — handles login, register, session, sidebar user display
- KB data: data/kb-data.json

### Backend
- server.js — model: claude-sonnet-4-5 (LOCKED)
- node --check server.js BEFORE every backend push (mandatory)

### Android
- versionCode: 44 (next build)
- Package: com.hydromind.app | EAS: arun25hyd

---

## ▶ SECTION 5 — FATAL MISTAKES REGISTRY (never repeat any of these)

| # | Mistake | Correct Action |
|---|---------|----------------|
| 1 | Editing without reading file structure first | Always read/grep before touch |
| 2 | Using inline `position:fixed!important` to fight CSS | Fix the CSS, not the symptom |
| 3 | Adding `hm-sidebar-offset` CSS block to patch body padding | Use body padding in global CSS |
| 4 | Adding `margin-left:150px` to `.shell` — kills 3-col layout | Shell uses padding, not margin |
| 5 | Patching a patch: applying new fix on top of broken code | Hard reset to last known good commit |
| 6 | Claiming "fixed" without browser screenshot | NEVER. Screenshot = only proof. |
| 7 | Pushing the omelette/artifact preview code to production | Strip all `data-omelette-injected` before push |
| 8 | Multiple rounds of incremental CSS fixes on live site | Full redesign from scratch with clean CSS |
| 9 | Using /Users/admin/ paths on new MacBook | All paths: /Users/Apple/ |
| 10 | `head` command failing — macOS BSD head is different | Use `python3 -c "..."` for quick operations |
| 11 | Duplicate nav inside shell page (from bak2 extraction) | After shell extraction, remove inner nav.nav |
| 12 | Shell pages: body padding overrides from hm-design.css collide with shell overflow | Shell pages override: body{height:100vh;overflow:hidden} |
| 13 | Not using Claude in Chrome to verify — guessing from curl | Always use browser to verify live pages |
| 14 | `bash_tool` for Mac filesystem operations | Desktop Commander MCP only for Mac files |
| 15 | Bulk Python regex on HTML — damages structure | Surgical targeted replacements only |
| 16 | Claiming confirmed ✅ tasks need re-doing | Never redo Arun-confirmed tasks |

---

## ▶ SECTION 6 — PLATFORM URLS

| Service     | URL                                         |
|-------------|---------------------------------------------|
| Frontend    | https://hydromindai.com                     |
| Backend     | https://hydromind-backend.onrender.com      |
| GitHub FE   | https://github.com/arun25hyd/hydromind-ai   |
| GitHub BE   | https://github.com/arun25hyd/hydromind-backend |
| Supabase    | frqefpoheewbornozvhc                        |

---

## ▶ SECTION 7 — GIT WORKFLOW (EXACT COMMANDS)

### Frontend
```bash
cd /Users/Apple/Documents/HydroMind-Platform/web-frontend
git add -A && git commit -m "fix: description" && git push origin main
```

### Backend (ALWAYS node --check first)
```bash
cd /Users/Apple/Documents/HydroMind-Platform/backend
node --check server.js
git add -A && git commit -m "fix: description" && git push origin main
```

### Emergency rollback
```bash
cd /Users/Apple/Documents/HydroMind-Platform/web-frontend
git reset --hard <last-good-commit>
git push origin main --force
git commit --allow-empty -m "chore: force redeploy" && git push origin main
```

### After every push
Wait 65 seconds → Claude in Chrome browser screenshot → confirm with Arun

---

## ▶ SECTION 8 — VERIFICATION PROTOCOL

After every single push:
1. Use Claude in Chrome (deviceId: 9fe113fe-7ad7-495c-9172-f361594b26a5)
2. Navigate to the changed page
3. Hard refresh: cmd+shift+r
4. Wait 4 seconds for full load
5. Take screenshot
6. Report exactly what is visible — no assumptions

If page looks wrong:
1. Check git log — confirm push went through
2. Check Vercel deployment in logs if needed
3. Hard refresh again (browser may have cached old version)
4. NEVER claim fixed without seeing it

---

## ▶ SECTION 9 — APP BANNER PLACEMENT (v2.0 rule)

- Homepage hero section: YES — with QR code, app description, Google Play link
- Pricing page: YES — CTA section at bottom only
- AI Advisor sidebar: NO
- Other pages: NO
- All sidebars: "YOUR AD HERE" placeholder boxes only (3 per side)
