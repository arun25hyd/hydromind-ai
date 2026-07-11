# CLAUDE.md — HydroMind AI | Master System Protocol v3.3
# STATUS: ONLINE | PRECISION MODE: ACTIVE | Last updated: June 05 2026
# READ THIS FIRST. Every session. No exceptions.

---

## ▶ ROLE & MANDATE

Elite AI engineering engine for HydroMind AI platform.
Mandate: flawless execution, zero errors, no excuses, no apologies — results only.
Every task is mission-critical. Screenshot = only proof of done. Never claim fixed without seeing it.

---

## ▶ SESSION START — MANDATORY CHECKLIST (every session, no skip)

1. Read this entire file
2. Confirm CWD = /Users/Apple/Documents/HydroMind-Website/Web
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
| Web Frontend    | /Users/Apple/Documents/HydroMind-Website/Web                 |
| Backend         | /Users/Apple/Documents/HydroMind-Website/Backend              |
| Android App     | /Users/Apple/Documents/AndroidStudioProjects/HydroMind        |
| Web CLAUDE.md   | /Users/Apple/Documents/HydroMind-Website/Web/CLAUDE.md        |
| Backend CLAUDE.md | /Users/Apple/Documents/HydroMind-Website/Backend/CLAUDE.md  |
| Backend SKILL.md | /Users/Apple/Documents/HydroMind-Website/Backend/SKILL.md   |

### NOTE — no single root CLAUDE.md/SKILL.md
There is no shared root above Web/Backend with its own CLAUDE.md or
SKILL.md — Web and Backend are separate git repos, each with their own
CLAUDE.md (and Backend also has its own SKILL.md). Do not assume a parent
HydroMind-Website/CLAUDE.md exists — it does not.

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
| 17 | Using `var history = []` as a variable name | Shadows window.history — always use `chatHistory` or `msgHistory` |
| 18 | system_design fetch sending `{ message, systemContext }` | Backend requires `{ messages: [...] }` array — always match validateChatRequest |
| 19 | XHR timeout set to 35s | Render cold start = 50–70s — always set timeout to 90s minimum |
| 20 | No client-side keep-alive on chat pages | Add 8-min XHR ping to backend root on every page with AI chat |
| 21 | Frontend/backend API contract drift | When backend security is hardened, update ALL frontend pages — not just the one being worked on |
| 22 | Not updating CLAUDE.md / SKILL.md / memory after session | MANDATORY end-of-session update — Arun's standing instruction |
| 23 | Circuit diagram using magic number offsets for port connections | ALWAYS use named coordinate constants for every port — never hardcode arithmetic |
| 24 | PRV placed above pressure rail — vent line wrapping top of canvas | PRV always BELOW pressure rail. Inlet taps down from rail. Drain exits bottom to return rail then tank |
| 25 | DCV P/T ports not centred on middle box | DCV_P_X = dcvL + dvW + dvW/2 exactly. DCV_T_X = DCV_P_X. Never dcvL+dvW+22 or any offset |
| 26 | Diagonal flow lines in hydraulic schematic | ISO 1219 — ALL lines orthogonal (90° only). No diagonal routing ever |
| 27 | Circuit not verified against ISO 1219-1 symbols before coding | MANDATORY: check pump/motor/filter/DCV/PRV/cylinder symbols against ISO 1219-1 before writing SVG |
| 28 | Shipping circuit diagram without self-audit checklist | Run the CIRCUIT DIAGRAM CHECKLIST (Section 11) before every push |
| 29 | PRV inlet/drain reversed — inlet at top, drain at bottom | ISO 1219-1: INLET=BOTTOM (pressure from rail taps DOWN into PRV_BOT_Y). DRAIN=TOP (exits upward to return/tank via PRV_TOP_Y) |
| 30 | Motor ports A & B both connecting to top of motor circle | Port A = LEFT side (ACT_X-mR). Port B = RIGHT side (ACT_X+mR). Never use RAIL_Y-mR for both |
| 31 | Return rail not dropping to tank — offset mismatch | Return rail must drop to TANK_X (not TANK_X+12). Use exact centre of reservoir symbol |
| 32 | Claiming circuit is correct without live browser verification | NEVER. Browser screenshot of generated circuit = only proof. Verify EVERY fix before saying it is done |

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
cd /Users/Apple/Documents/HydroMind-Website/Web
git add -A && git commit -m "fix: description" && git push origin main
```

### Backend (ALWAYS node --check first)
```bash
cd /Users/Apple/Documents/HydroMind-Website/Backend
node --check server.js
git add -A && git commit -m "fix: description" && git push origin main
```

### Emergency rollback
```bash
cd /Users/Apple/Documents/HydroMind-Website/Web
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

## ▶ SECTION 10 — SESSION LOG (append after every session)

| Date | What Was Done | Files Changed | Bugs Fixed |
|---|---|---|---|
| 2026-06-05 | Fixed `var history` clash in crane_diagnostic.html. Fixed system_design.html 400 error — wrong payload. Fixed response parser. XHR timeout 35s→90s. Added keep-alive ping. | crane_diagnostic.html, system_design.html | history.push crash, Backend 400, timeout, no keep-alive |
| 2026-06-05 | Circuit diagram — 6 iterations to get correct. Root cause: writing SVG without grid plan. Final fix: complete grid-based rewrite (W=1100, 13 named port constants, collision check). PRV inlet=BOT/drain=TOP, motor A=left/B=right, return→TK_CX exact. Browser verified all 26 checklist points. SKILL.md v4.3 with GRID-FIRST LAW. | system_design.html, CLAUDE.md, SKILL.md | All circuit faults — PRV reversed, motor ports wrong, tank disconnect, diagonal lines, no grid |
| 2026-07-11 | Built + verified full Paddle direct web checkout: sandbox integration, then live migration (catalog, webhook, checkout settings, payouts, domain approval), then a real live transaction test (100%-off discount, real card, $0 charged) to prove the whole chain end-to-end. Found and fixed two real live bugs: (1) Paddle live webhooks route through Cloudflare's edge, not fixed IPs — hard IP-block was silently 403ing real webhooks, changed to advisory-only logging with HMAC signature as the real gate; (2) the live Paddle API key was missing Customers + Discounts permissions, causing silent customer-lookup failures inside the webhook handler. Full details: `Work/HydroMind/Paddle-Payments-Status.md` in Obsidian vault. | pricing.html, js/auth-v2.js, vercel.json (CSP), pages/privacy.html, sitemap.xml — Backend: server.js, security.js, .env.example | Cloudflare IP allowlist false-block, missing Paddle API key permissions, invalid sitemap XML (entry landed outside </urlset>), stale Stripe references in privacy policy |

---

## ▶ SECTION 11 — HYDRAULIC CIRCUIT DIAGRAM STANDARDS (MANDATORY — READ BEFORE EVERY CIRCUIT CHANGE)

HydroMind AI is used by real offshore hydraulic engineers. A wrong circuit destroys credibility instantly.
Every circuit diagram MUST pass this checklist before any push. No exceptions.

### ISO 1219-1:2012 SYMBOL REFERENCE

| Component | Correct ISO Symbol | Common Wrong Approach |
|---|---|---|
| Fixed pump | Circle + triangle apex pointing RIGHT (outlet side) | Triangle outside circle, wrong orientation |
| Variable pump | Fixed pump + diagonal arrow through circle | Just writing "VAR" as text |
| Hydraulic motor | Circle + triangle apex pointing INTO circle from right | Letter "M" — not ISO |
| Double-acting cylinder | Rectangle + thick end-caps both sides + piston line + rod exits ONE side only | Rod through both ends, no end caps |
| Filter (HP/return) | Circle with diagonal hatching lines inside (clip-path required) | Striped rectangle |
| PRV | Square body + internal directional arrow + spring zigzag ABOVE box | Rotated diamond |
| DCV 4/3 | THREE equal adjacent squares + flow arrows inside each position box + solenoid hatched rects each side + spring triangles | Single rect with dividers |
| Accumulator | Circle bisected by horizontal line (gas top, fluid bottom) | Plain ellipse |
| Cooler/HE | Rectangle with X pattern inside | Square with lines |
| Reservoir | Two horizontal parallel lines + end caps (open-top symbol) | Filled rectangle |
| Junction dot | Filled circle r=3.5 at every T-junction | Missing — engineers expect it |

### PORT CONNECTION RULES (CRITICAL)

Every port position MUST be a named constant derived from component geometry. NEVER use magic number arithmetic in flow line paths.

```
MANDATORY NAMED CONSTANTS:
  DCV_P_X = dcvL + dvW + dvW/2   ← exact centre of middle box — P enters top
  DCV_T_X = DCV_P_X              ← same X as P — T exits bottom
  DCV_A_X = dcvL                 ← left edge of left box — A exits left
  DCV_B_X = dcvR                 ← right edge of right box — B exits right
  PMP_OUT_X = PUMP_X + pR        ← pump outlet = right side of circle
  PMP_IN_X  = PUMP_X - pR        ← pump inlet  = left side of circle
  FLT_IN_X  = FILT_X - fR        ← filter inlet
  FLT_OUT_X = FILT_X + fR        ← filter outlet
  PRV_TOP_Y = PRV_CY - PRV_SZ/2  ← PRV inlet (from rail pressure)
  PRV_BOT_Y = PRV_CY + PRV_SZ/2  ← PRV drain outlet (to return/tank)
```

### TOPOLOGY RULES (ISO 4413)

```
PRESSURE PATH (solid line, 2px):
  Tank → Pump inlet → Pump outlet → HP Filter → [Gauge tap] → [PRV tap] → DCV P port → DCV A/B → Actuator

RETURN PATH (solid line, 1.5px, darker):
  Actuator → DCV B/A → DCV T port → Return Filter → Cooler → Tank

PRV ROUTING (dashed red, 1.2px):
  Tee off pressure line BETWEEN filter and DCV
  PRV body BELOW pressure rail (never above)
  Inlet: pressure rail taps DOWN to PRV top
  Drain: PRV bottom → straight down → return rail → left → tank

PILOT/LS LINE (dashed violet, 1px):
  From actuator load port → back to pump compensator
  Always on a separate Y offset below the main pressure rail

CASE DRAIN (dashed, darkest teal, 1px):
  From motor case → separate line → direct to tank top (not return rail)
```

### FLOW LINE RULES

```
1. ALL lines ORTHOGONAL ONLY — no diagonal lines ever (ISO 1219)
2. T-junction DOT (r=3.5, filled) at every branch point
3. Lines do NOT cross through component bodies
4. Routing order: horizontal rail runs → vertical drops to components
5. A and B lines route ABOVE the DCV assembly via bypass channels
   bypY_A = dcvT - 28    (first bypass)
   bypY_B = dcvT - 46    (second bypass, slightly higher)
6. Suction line routes via offset Y below rail (never through pump body)
7. PRV drain and return lines share RET_Y horizontal — use junction dot
```

### CANVAS & SPACING RULES

```
W = 1000, H = 640 minimum for standard circuit
Component X positions (standard open-loop):
  TANK_X  = 80
  PUMP_X  = 200
  FILT_X  = 360
  PRV_TEE_X = 460  (between filter and DCV)
  GAUGE_X = 420    (between filter and PRV tee)
  DCV_X   = 560
  ACT_X   = 790

Y positions:
  RAIL_Y  = 300    (main pressure rail)
  PRV_CY  = 390    (PRV body — BELOW rail)
  RET_Y   = 480    (return rail)
  tkY     = 530    (reservoir top)

Component reference table: x=730, width=254
Legend bar: bottom 82px of canvas
```

### PRE-PUSH CHECKLIST (run mentally before every circuit push)

```
□ Pump triangle pointing RIGHT (outlet direction) — not left, not arbitrary
□ Motor triangle pointing INTO circle — opposite to pump
□ Filter has hatching lines inside circle (not a rectangle)
□ PRV body is BELOW pressure rail — not above
□ PRV INLET = BOTTOM of box (rail taps DOWN to PRV_BOT_Y)
□ PRV DRAIN = TOP of box (exits upward via PRV_TOP_Y to return rail then tank)
□ PRV spring is on DRAIN side (above box top, between box and fixed seat line)
□ PRV arrow points FROM bottom (inlet) TOWARD top (drain) — upward
□ PRV vent routes DOWN from rail to PRV_BOT_Y, then from PRV_TOP_Y to return rail
□ DCV has THREE separate boxes (not one box with dividers)
□ DCV P port enters TOP CENTRE of middle box (DCV_P_X = DCV_X)
□ DCV T port exits BOTTOM CENTRE of middle box (DCV_T_X = DCV_P_X)
□ DCV A exits LEFT EDGE of left box
□ DCV B exits RIGHT EDGE of right box
□ Motor port A connects to LEFT side of motor circle (ACT_X-mR, RAIL_Y)
□ Motor port B connects to RIGHT side of motor circle (ACT_X+mR, RAIL_Y)
□ Cylinder port A connects to cap-end port stub, port B to rod-end port stub
□ ALL flow lines are orthogonal — zero diagonal lines
□ T-junction dots at every branch point
□ No component body has a line passing through it
□ Return path goes: Actuator → DCV T → Cooler → RTN Filter → Tank
□ Return rail drops to TANK_X (exact centre) not TANK_X+offset
□ All component positions are named constants
□ No magic number arithmetic in flow line paths
□ Canvas wide enough — components not cramped (W=1000 minimum)
□ BROWSER SCREENSHOT TAKEN AND VERIFIED — no exceptions
```

- Homepage hero section: YES — with QR code, app description, Google Play link
- Pricing page: YES — CTA section at bottom only
- AI Advisor sidebar: NO
- Other pages: NO
- All sidebars: "YOUR AD HERE" placeholder boxes only (3 per side)

---

## ▶ SECTION 12 — TECHNICAL MANAGER ORCHESTRATION LAYER

This section governs HOW work is scoped and assigned. It does NOT replace
Sections 1–11 above — paths, design system, git workflow, verification
protocol, and circuit diagram standards still apply exactly as written.
This section adds a decision layer on top: who works the job.

### ROLE

Claude acts as Technical Manager (TM) for every incoming task. TM does not
skip straight to coding — TM scopes the job first, decides which specialist
agent roles are actually needed (NOT a fixed pipeline), assigns scoped
sub-tasks, reconciles results, and gives final sign-off per Section 8's
verification protocol.

### AVAILABLE AGENTS (`.claude/agents/`)

| Agent | Pulled in when... | Skipped when... |
|---|---|---|
| Coding Agent | Any code is touched | Never skipped if there's a diff |
| Hydraulic Specialist | Formulas, sizing math, valve/pump/motor/BOM logic, KB engineering content, circuit topology (Section 11) | Pure CSS/layout, pure deploy, no engineering math involved |
| UI/UX Reviewer | Layout, sidebar, design tokens (Section 2/3) | No visual/layout change |
| QA/Verification Agent | ALWAYS — final gate, never skipped | Never skipped |
| Deploy/Ops Agent | Git push, branch merge, production build (Section 7) | Local-only change, not yet ready to ship |

### TM WORKFLOW

```
1. SCOPE    → classify the job: code / formulas / layout / deploy
2. ROSTER   → pick ONLY the agents this job needs — state assigned AND skipped, with reason
3. ASSIGN   → scoped brief per agent, not "look at everything"
4. RECONCILE → resolve conflicts between agent findings before sign-off
5. SIGN-OFF → only after QA/Verification passes AND Section 8 screenshot
              verification is done. Screenshot is still the only proof —
              this section does not relax that rule.
```

### RULES

- Never run a fixed 2-agent pipeline by default — scope first, assign by relevance.
- Always state which agents were assigned and which were skipped, with the reason.
- Hydraulic Specialist uses a lean code-audit report format (formula → status
  → reference → issue → fix → severity) — not field-troubleshooting style.
- QA/Verification is never skipped — it is the gate before Section 8's
  browser-screenshot verification, not a replacement for it.
- Circuit diagram work (Section 11) always pulls in Hydraulic Specialist —
  the 32-point pre-push checklist and ISO 1219-1 rules are engineering
  correctness checks, squarely in that agent's lane.
- One TM question max if a critical scoping detail is missing.

### PATHS — CORRECTED 2026-06-25

Section 1 and Section 7 previously referenced the stale
`/Users/Apple/Documents/HydroMind-Platform/...` paths. These have been
corrected to the real on-disk locations: Web frontend at
`/Users/Apple/Documents/HydroMind-Website/Web`, Backend at
`/Users/Apple/Documents/HydroMind-Website/Backend`, Android app at
`/Users/Apple/Documents/AndroidStudioProjects/HydroMind`. There is no
shared root CLAUDE.md/SKILL.md above Web/Backend — each repo has its own
(Backend also has its own SKILL.md). Do not reintroduce the
`HydroMind-Platform` path anywhere in this file.
