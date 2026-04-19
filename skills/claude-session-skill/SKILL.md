---
name: session-skill
version: v2.0
date: 2026-04-19
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
| INSPECT | Read the actual file before editing it | `view` or `Desktop Commander:read_file` |
| PLAN | State: what changes, which files, what commands | Plain text to Arun |
| EXECUTE | Write/edit code — clean, non-repetitive | `str_replace`, `create_file`, `bash_tool` |
| VERIFY | Run audit script or check output | `bash_tool` |
| COMMIT | `git add -A`, commit with message, push | `bash_tool` |

**NEVER** edit a file without reading it first.
**NEVER** run `git add .` from home directory root — always use explicit paths.
**NEVER** repeat a step confirmed complete (👍) in this session.

---

## RULE 2 — NEVER DO THESE (Repeat Mistakes Registry)

| # | Mistake | Correct Behaviour |
|---|---|---|
| 1 | Edit HTML without reading it first | Always `view` file before any edit |
| 2 | Run `git add .` from `~` or wrong directory | Always `cd` to repo root first, use `git add -A` |
| 3 | Assume a page has 3-col layout without checking | Audit the grid class before adding sidebars |
| 4 | Apply blind regex across multiple files | Run targeted `sed` only after `grep` confirms match |
| 5 | Re-build something Arun confirmed with 👍 | Check session history — if confirmed, skip it |
| 6 | Guess KB number without checking SKILL.md | Read SKILL.md version control table first |
| 7 | Write new CSS without checking existing style.css classes | `grep` style.css for class before adding new |
| 8 | Push to wrong branch | Always verify with `git branch` before push |
| 9 | Forget to copy final file to `/mnt/user-data/outputs/` | Always present_files at end of task |
| 10 | Write long preamble before acting | Act first, explain after |
| 11 | Use `nav.navbar` or `circuit-bg` classes | BANNED — use `hm-topnav` only |
| 12 | Remove or overwrite hm-left-sidebar or hm-right-sidebar | MANDATORY on every page |
| 13 | Use gold or cyan colors | Eliminated — use orange #f97316 only |
| 14 | Ask multiple questions | Max ONE question if truly needed |
| 15 | Use `localStorage` or `sessionStorage` in artifacts | Not supported — use React state |

---

## RULE 3 — PROJECT STATE (as of Apr 19, 2026)

### Platform URLs
| Service | URL |
|---|---|
| Frontend | https://hydromindai.com |
| Backend | https://hydromind-backend.onrender.com |
| Crane Diagnostic | https://hydromindai.com/crane-diagnostic.html |
| AI Advisor | https://hydromindai.com/pages/advisor.html |
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
| SKILL.md (master) | `/Users/admin/Desktop/HydroMind/SKILL.md` |
| Session skill | `/Users/admin/skills/claude-session-skill/SKILL.md` |
| Android app | `/Users/admin/hydromind` |
| HydroFit app | `/Users/admin/hydrofit` |
| Claude Code | `/Users/admin/.npm-global/bin/claude` |

### Backend State
- Build tag: `text-only-v7.0`
- AI Advisor: TEXT ONLY (images removed deliberately)
- KB_ROUTE_MAP in server.js: routes 30+ model names to KB docs
- Security: security.js with rate limiters, helmet, input validation
- Backend keep-alive: self-ping every 10 minutes

### KB State (SKILL.md v2.13) — UPDATED Apr 19, 2026
- **KB1–KB47:** OEM manuals (Rexroth, Danfoss, Parker, Liebherr, etc.)
- **KB48:** Fukushima IHI — PENDING (manual not uploaded)
- **KB49–KB70:** Previous sessions (IFPS, Rohner IHC, Rexroth BRX, field cases)
- **KB71–KB75:** Rexroth Hydraulic Trainer Vol.1–4, Vol.6
- **KB76:** Zhang & Qin — Basics of Hydraulic Systems
- **KB77:** Cundiff — Fluid Power Circuits & Controls
- **KB78:** Cylinder Design Calculation Reference (Lamé, Barlow, material selection)
- **KB79:** Blackburn — Fluid Power Control (MIT Press, servo theory)
- **KB80:** Verschoof — Cranes Design Practice & Maintenance
- **KB81:** DNVGL-ST-0378 — Offshore and Platform Lifting Appliances
- **KB82:** ISO 4413 — Hydraulic Fluid Power General Rules
- **KB83:** Shapiro — Cranes and Derricks 4th Edition
- **KB84:** Flitney — Seals and Sealing Handbook 6th Edition
- **KB85:** AISI — Wire Rope Users Manual (WRTB)
- **KB86:** MacDonald — Handbook of Rigging
- **SKILL.md:** 6,533 lines | v2.13 | Next KB: KB87
- **Total scope:** Hydraulics + Crane structural + Seals + Wire rope + Rigging + Standards

### Frontend State — UPDATED Apr 19, 2026
- **index.html hero:** Redesigned v2 — 2-column layout, live AI demo panel, 8 capability pills
- **advisor.html:** 8 modes (hyd/elec/crane/struct/seal/rig/fluid/calc), expanded system prompt KB71-86
- **Chat history:** Fixed — addChatToHistory() + updateChatHistory() now called in advisor.html
- **Stats bar:** 6 cells — 86 KB Entries · 6,033 Lines · 48+ OEM Manuals · 24/7 · v7.0 · Free

### Android App State
| Item | Value |
|---|---|
| Package | `com.hydromind.app` |
| EAS account | `arun25hyd` |
| Next versionCode | **35** (run `eas build:version:set` first) |
| EAS quota | EXHAUSTED — resets **May 1, 2026** |
| Play Store | Closed Testing active — 12 Gmail testers invited |
| Production track | Application submitted April 19, 2026 (14-day review) |

HydroFit (`com.hydrofit.app`): same EAS account, same May 1 wait. DB: 1456 hose + 284 tube + 80 hoses. Expo SDK 54. AdMob wired.

---

## RULE 4 — PAGE STRUCTURE (MANDATORY on every HTML page)

```
(1) hm-topnav        — nav 52px fixed
(2) hm-left-sidebar  — profile / chat-history / quick-links / ad-slot
(3) hm-main-content  — content between sidebars
(4) hm-right-sidebar (id=hmAdSidebar) — orange-themed ad placeholders
```

3-col grid: `hm-page` → `grid: 220px 1fr 200px`
Pages/ subfolder: use `../` prefix for all root links and assets
Banned: `nav.navbar display:none!important` | `circuit-bg display:none!important`

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
| Logo font | Syne 800 |
| Heading font | Barlow Condensed 700 |
| Body font | Barlow 400 |
| Mono font | Share Tech Mono |

Gold and cyan: FULLY ELIMINATED — never reintroduce.

---

## RULE 6 — ANDROID APP STATE

- Next build: versionCode **35** — always run `eas build:version:set` FIRST
- EAS quota exhausted — wait May 1, 2026
- DPRScreen.tsx: real voice recording via expo-speech-recognition v3.1.2

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

---

## RULE 8 — KB ENTRY WORKFLOW

1. Read SKILL.md tail — confirm next KB number (KB87 is next)
2. Extract source: `pdftotext -layout` or `extract-text` for docx
3. Build entry: Source → Publisher → Scope → Structured sections with formulas and tables
4. Append to SKILL.md in chunks of 25-30 lines (Desktop Commander write_file append)
5. Copy SKILL.md to backend and frontend skills folder
6. Git commit + push both repos

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
5. Test      : Specific gauge points or signal measurements
6. Conclude  : Root cause + corrective action + parts
```

**Architecture quick-ref:**
| Type | Description |
|---|---|
| Closed loop (hydraulic) | Pilot joystick → pump swash direct, no electronics |
| Electronic closed loop | PLC → amplifier → prop valve → swash → motor A/B, separate brake DCV |
| Open loop + pilot DCV | Constant flow pump → DCV → motor/cylinder → tank, CBVs at 110–130% load |

**OEM diagnostic tools:**
| OEM | Tool |
|---|---|
| Liebherr | LiDAT software |
| Rexroth | BODAS service tool |
| Danfoss | PLUS+1 Service Tool |
| Eaton | Pressure gauges only |

---

## RULE 11 — PENDING TASKS (as of Apr 19, 2026)

| Priority | Task | Status |
|---|---|---|
| 1 | Upload Fukushima IHI manual → complete KB48 | ⏳ Waiting on manual |
| 2 | EAS build versionCode 35 | ⏳ Wait May 1, 2026 |
| 3 | Fix left sidebar grid on pricing.html + feedback.html | ⏳ Pending |
| 4 | Fix pages/knowledge.html sidebar positioning | ⏳ Pending |
| 5 | HydroFit EAS build May 1 | ⏳ Pending |
| 6 | Play Store production track — 14-day review (submitted Apr 19) | ⏳ In review |

---

## RULE 12 — COMMUNICATION STYLE

- 👍 from Arun = task complete — never redo it
- Arun corrects directly — accept immediately, no defence
- Short responses unless code/tables required
- Lead with action, not preamble
- ONE question max — never a list
- Engineering tone: precise, direct, no waffle
- After task: state what was done + what is next (1 line each)

---

## RULE 13 — SELF-CHECK BEFORE EVERY RESPONSE

Before acting, verify internally:
- [ ] Have I read the file I am about to edit?
- [ ] Is this task already confirmed done (👍) this session?
- [ ] Am I using the correct tool — Mac vs container?
- [ ] Am I on the correct git branch?
- [ ] Does this page have all 4 mandatory layout elements?
- [ ] Am I introducing gold/cyan/banned classes?
- [ ] Is my response concise — under 10 lines unless code/tables needed?

If any answer is NO — fix it before executing.

---

## RULE 14 — PAGES STILL NEEDING WORK

| Page | Issue | Action Required |
|---|---|---|
| `pricing.html` | Left sidebar grid broken | Fix hm-page 3-col: 220px 1fr 200px |
| `pages/feedback.html` | Left sidebar grid broken | Same grid fix |
| `pages/knowledge.html` | Sidebar positioning off | Verify and fix alignment |
| `knowledge.html` (root) | Audit needed | Check full 4-element structure |

Always inspect with `Desktop Commander:read_file` before touching any of these.

---

## Version Control

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-04-04 | Initial — 14 rules, mistakes registry, full project state |
| v1.1 | 2026-04-06 | Minor updates |
| v2.0 | 2026-04-19 | Major update — KB71-KB86 complete, hero v2 redesign, advisor 8 modes, chat history fix, Android versionCode 35, session skill path corrected |
