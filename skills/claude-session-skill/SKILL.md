name: session-skill
version: v1.1
date: 2026-04-06
description: >
  Session orientation skill for Claude working on the HydroMind AI project with Arun
  (Crane Supervisor / Hydraulic Systems Specialist, EnerMech, Abu Dhabi). Load this
  skill at the START of every session before any code, file, or git operation.
  Eliminates repeated tasks, wrong path guesses, and tool misuse.
  Triggers: ANY HydroMind task, coding request, file edit, git push, KB entry,
  Android app build, page redesign, or backend change.
---

# Claude Session Skill — HydroMind AI Project

---

## RULE 0 — LOAD THIS FIRST, ALWAYS

Before writing a single line of code or running any command:
1. Read this file fully
2. Confirm which task is being requested
3. State the exact files you will touch
4. Ask Arun ONE question if and only if a critical parameter is unknown
5. Then execute — no guessing, no repeating

---

## RULE 1 — ABSOLUTE EXECUTION PROTOCOL

```
INSPECT → PLAN → EXECUTE → VERIFY → COMMIT
```

| Step | Action | Tool |
|---|---|---|
| INSPECT | Read the actual file before editing it | `Desktop Commander:read_file` |
| PLAN | State: what changes, which files, what commands | Plain text to Arun |
| EXECUTE | Write/edit code — clean, non-repetitive | `Desktop Commander:edit_block` |
| VERIFY | `curl` live URL or `grep` file to confirm change | `Desktop Commander:start_process` |
| COMMIT | `git add -A`, commit with message, push | `Desktop Commander:start_process` |

**NEVER** edit a file without reading it first.
**NEVER** run `git add .` from home directory — always `cd` to repo root, use `git add -A`.
**NEVER** repeat a step confirmed complete (👍) in this session.
**NEVER** guess what is in a live file — always `curl` or `grep` to confirm before editing.

---

## RULE 2 — NEVER DO THESE (Repeat Mistakes Registry)

| # | Mistake | Correct Behaviour |
|---|---|---|
| 1 | Edit HTML without reading it first | Always `Desktop Commander:read_file` before any edit |
| 2 | Run `git add .` from `~` or wrong directory | Always `cd` to repo root first, use `git add -A` |
| 3 | Assume a page has 3-col layout without checking | Audit grid class before touching sidebars |
| 4 | Apply blind regex across multiple files | Run targeted `sed` only after `grep` confirms match |
| 5 | Re-build something Arun confirmed with 👍 | Check session history — if confirmed, skip it |
| 6 | Guess KB number without checking SKILL.md table | Read SKILL.md version control table first |
| 7 | Write new CSS without checking existing classes | `grep` style.css for class before adding new |
| 8 | Push to wrong branch | Always verify with `git branch` before push |
| 9 | Forget to copy final file to `/mnt/user-data/outputs/` | Always present_files at end of task |
| 10 | Write long preamble before acting | Act first, explain after |
| 11 | Use `nav.navbar` or old circuit-bg on pages | BANNED — use `hm-topnav` only |
| 12 | Remove hm-left-sidebar or hm-right-sidebar | MANDATORY on every page |
| 13 | Use gold or cyan colors | Fully eliminated — orange #f97316 only |
| 14 | Ask multiple questions | Max ONE question per response |
| 15 | Use `localStorage` or `sessionStorage` in artifacts | Not supported — use React state |
| 16 | Place canvas/animated BG outside hero section at fixed/body level | Body background blocks it — see RULE 16 |
| 17 | Change `body { background }` or `hm-main-content { z-index }` | These break the whole site layout |
| 18 | Guess what is live on server without checking | Always `curl -sL URL \| grep pattern` to confirm first |
| 19 | Replace original SVG schematic with canvas particle animation | index.html hero uses HYDRAULIC SCHEMATIC SVG — restore from git if lost |

---

## RULE 3 — PROJECT STATE (as of Apr 6, 2026)

### Platform URLs
| Service | URL |
|---|---|
| Frontend live | https://hydromindai.com |
| Backend live | https://hydromind-backend.onrender.com |
| Crane Diagnostic | https://hydromindai.com/crane-diagnostic.html |
| Supabase project | frqefpoheewbornozvhc |

### Git Repositories
| Repo | Remote |
|---|---|
| Frontend (Vercel) | arun25hyd/hydromind-ai |
| Backend (Render) | arun25hyd/hydromind-backend |

### Mac File Paths (EXACT — never guess)
| Item | Path |
|---|---|
| Frontend root | `/Users/admin/Desktop/HydroMind/hydromind-frontend` |
| Backend root | `/Users/admin/Desktop/HydroMind/hydromind-backend` |
| SKILL.md (hydraulic KB) | `/Users/admin/Desktop/HydroMind/SKILL.md` |
| Session skill | `/Users/admin/Desktop/HydroMind/skills/claude-session-skill/SKILL.md` |
| Android app | `/Users/admin/hydromind` |
| HydroFit app | `/Users/admin/hydrofit` |
| Claude Code | `/Users/admin/.npm-global/bin/claude` v2.1.90 |

### Backend State
- Build tag: `text-only-v7.0`
- AI Advisor: TEXT ONLY (no images — removed deliberately)
- KB_ROUTE_MAP in server.js routes 30+ model names to KB docs
- Security: security.js, helmet, rate limiters, input validation

### KB State
- KB1–KB57: COMPLETE (KB57 = Parker HY14-2533 sandwich valves)
- Total KB documents indexed: 223
- knowledge.html: rebuilt with all 57 entries, fully public, no auth wall
- pages/knowledge.html: admin gate removed, loads Supabase for all users

---

## RULE 4 — PAGE STRUCTURE (MANDATORY — every HTML page)

Every page MUST have ALL FOUR:
```
(1) hm-topnav        — 52px fixed nav
(2) hm-left-sidebar  — profile / chat / quick-links / ad-slot
(3) hm-main-content  — content area between sidebars
(4) hm-right-sidebar (id=hmAdSidebar) — orange-themed ad placeholders
```

3-col grid: `hm-page` → `grid: 220px 1fr 200px`
Pages in `/pages/` subfolder: use `../` prefix for root links.
Banned: `nav.navbar display:none!important`

---

## RULE 5 — DESIGN SYSTEM (never deviate)

| Token | Value |
|---|---|
| Primary orange | `#f97316` |
| Background | `#0d0f12` |
| Surface | `#13171d` |
| Card | `#1a1f28` |
| Border | `#2a3040` |
| Text primary | `#e2e8f0` |
| Text muted | `#64748b` |
| Font: Logo | Syne 800 |
| Font: Headings | Barlow Condensed 700 |
| Font: Body | Barlow 400 |
| Font: Mono | Share Tech Mono |

Gold and cyan: FULLY ELIMINATED — never reintroduce.

---

## RULE 6 — ANDROID APP STATE (Apr 6, 2026)

| Item | Value |
|---|---|
| Package | `com.hydromind.app` |
| EAS account | `arun25hyd` (Starter $19/mo) |
| Next valid versionCode | **35** |
| Last attempted | versionCodes 32–34 used/rejected |
| EAS quota | EXHAUSTED — resets **May 1, 2026** |
| Play Store | Closed Testing — 12 Gmail testers collected |
| Target Production date | April 19, 2026 (after 14-day testing period) |
| Next action | `eas build:version:set` → 35, then build from `/Users/admin/hydromind` |

`appVersionSource: "remote"` in eas.json — EAS controls versioning, NOT app.json.
Always run `eas build:version:set` before building. Always run from `/Users/admin/hydromind`.

HydroFit (`com.hydrofit.app`): same EAS account, May 1 wait.
Pending: run `scripts/gen_hose_fittings.py` after downloading `hydrofit_entries.json`.

---

## RULE 7 — GIT WORKFLOW (exact commands)

```bash
# Frontend
cd /Users/admin/Desktop/HydroMind/hydromind-frontend
git branch           # verify first
git add -A
git commit -m "feat: <description>"
git push origin main

# Backend
cd /Users/admin/Desktop/HydroMind/hydromind-backend
git branch
git add -A
git commit -m "fix: <description>"
git push origin main
```

Never push from home directory. After Vercel push verify https://hydromindai.com within 60s.
Always `curl -sL https://hydromindai.com/ | grep pattern` to confirm live deployment.

---

## RULE 8 — KB ENTRY WORKFLOW

1. Read SKILL.md version control table — confirm next KB number (KB49 is next)
2. Extract PDF: `pdftotext -layout <file.pdf> <file.txt>`
3. Build entry: Model → Manufacturer → Type → Architecture → Pump → Motor → DCV → Pressures → Faults → Maintenance
4. Append to SKILL.md with version bump
5. Update version control table at bottom of SKILL.md

---

## RULE 9 — TOOL SELECTION

| Task | Tool |
|---|---|
| Read file on Mac | `Desktop Commander:read_file` |
| Edit file on Mac | `Desktop Commander:edit_block` |
| Run terminal on Mac | `Desktop Commander:start_process` |
| Read file in container | `view` |
| Edit file in container | `str_replace` or `create_file` |
| Run bash in container | `bash_tool` |
| Search past sessions | `conversation_search` |
| Current web data | `web_search` → `web_fetch` |

Do NOT use `bash_tool` for Mac filesystem.
Do NOT use Desktop Commander for container filesystem.

---

## RULE 10 — HYDRAULIC / CRANE TROUBLESHOOTING PROTOCOL

```
1. Identify  : System type → Architecture → Suspect component
2. Check     : KB entry for that model first
3. Diagnose  : Pressure → Flow → Temperature → Case drain
4. Isolate   : Upstream vs downstream of suspect
5. Test      : Gauge points or signal measurements
6. Conclude  : Root cause + corrective action + parts
```

Architecture quick-ref:
| Type | Description |
|---|---|
| Closed loop (hydraulic) | Pilot joystick → pump swash direct, no electronics |
| Electronic closed loop | PLC → amplifier → prop valve → swash → motor A/B, separate brake DCV |
| Open loop + pilot DCV | Constant flow pump → DCV → motor/cylinder → tank, CBVs at 110–130% load |

OEM tools: Liebherr=LiDAT | Rexroth=BODAS | Danfoss=PLUS+1 | Eaton=gauges only

---

## RULE 11 — PENDING TASKS (Apr 11, 2026)

| Priority | Task | Status |
|---|---|---|
| 1 | AdSense review request — submit via AdSense → Sites → Request review | ⏳ Awaiting Arun action |
| 2 | EAS build versionCode 35 → upload AAB | ⏳ Wait May 1, 2026 |
| 3 | Fix left sidebar grid on pricing.html + feedback.html | ⏳ Pending |
| 4 | HydroFit: run gen_hose_fittings.py | ⏳ Pending |

---

## RULE 12 — COMMUNICATION STYLE

- 👍 from Arun = task complete — never redo it
- Arun corrects directly — accept, no defence
- Short responses unless code/tables required
- Lead with action, not preamble
- ONE question max if truly needed
- Engineering tone: precise, direct, no waffle
- After task: what was done + what is next (1 line each)

---

## RULE 13 — SELF-CHECK BEFORE EVERY RESPONSE

- [ ] Have I read the file I am about to edit?
- [ ] Is this task already confirmed done (👍) this session?
- [ ] Am I using the correct tool — Mac vs container?
- [ ] Am I on the correct git branch?
- [ ] Does this page have all 4 mandatory layout elements?
- [ ] Am I introducing gold/cyan/banned classes?
- [ ] Have I verified what is actually live before editing?

If any answer is NO — fix it before executing.

---

## RULE 14 — PAGES STILL NEEDING WORK

| Page | Issue | Action Required |
|---|---|---|
| `pricing.html` | Left sidebar grid broken | Fix hm-page 3-col: 220px 1fr 200px |
| `pages/feedback.html` | Left sidebar grid broken | Same grid fix |
| `pages/knowledge.html` | Sidebar positioning off | Verify and fix alignment |

Always inspect with `Desktop Commander:read_file` before touching any of these.

---

## RULE 15 — INDEX.HTML HERO BACKGROUND (CRITICAL — DO NOT BREAK AGAIN)

The `index.html` homepage hero background is a **hydraulic schematic SVG animation**.
It is NOT a canvas particle animation.

### What it contains:
- `<div class="circuit-bg">` wrapping a full SVG
- Reservoir, electric motor, pump (A4VG with rotating vane), HP pressure line
- Pressure gauge with oscillating needle, DCV 4/3 WE6 with blinking solenoid
- Hydraulic motor (A6VM), return line, filter, cooler
- ISO 1219-1 label at bottom
- All strokes in orange `#f97316` (updated from original cyan)

### CSS required in style.css:
```css
.circuit-bg { position:fixed; top:0; left:0; width:100vw; height:100vh;
  pointer-events:none; z-index:0; overflow:hidden; }
.circuit-bg svg { width:100%; height:100%; }
@keyframes flow-dash   { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
@keyframes flow-dash-r { from{stroke-dashoffset:0} to{stroke-dashoffset:60} }
.c-trace      { stroke-dasharray:12 8; animation:flow-dash   2.5s linear infinite; }
.c-trace-r    { stroke-dasharray:12 8; animation:flow-dash-r 2.5s linear infinite; }
.c-trace-slow { stroke-dasharray:12 8; animation:flow-dash   5s   linear infinite; }
```

### If the schematic disappears:
1. Check git: `git show 8d71d1eb:index.html | sed -n '26,94p'` — original is in that commit
2. NEVER replace with a canvas particle/node animation — that is wrong
3. NEVER put canvas at `position:fixed` behind body — body background blocks it
4. NEVER change `body { background }` to transparent — breaks all other pages
5. NEVER change `hm-main-content { z-index }` — breaks stacking order

### Confirmed working commit: `257a6080`

---

## Version Control

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-04-04 | Initial — 14 rules, mistakes registry, full project state |
| v1.1 | 2026-04-06 | Added rules 15–19 from animated BG incident. Updated Android versionCode to 35, Play Store status, pending tasks. Added curl verification step to git workflow. Circuit-bg preservation rule added. |
| v1.2 | 2026-04-11 | AdSense fixes: ads.txt moved to repo root (not public/). knowledge.html redirect removed from vercel.json. pages/knowledge.html admin gate removed — KB open to all users. knowledge.html rebuilt with 57 KB entries (KB01–KB57), SEO meta, schema markup, public crawlable. Crane diagnostic Path A/B/C font size increased (ac-title: 1rem orange, ac-desc: .85rem). KB now goes to KB57. |
