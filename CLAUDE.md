# CLAUDE.md — HydroMind AI Master Memory File
# Single source of truth. Read this before any HydroMind coding task.
# Last updated: May 2026

---

## 1. CANONICAL FILE PATHS (EXACT — NO GUESSING)

### Active Web Frontend (USE THIS — has git token)
/Users/admin/HydroMind-Platform/web-frontend

### Backend
/Users/admin/HydroMind-Platform/backend

### Android App
/Users/admin/hydromind

### HydroFit App
/Users/admin/hydrofit

### SKILL files (live agent path)
/Users/admin/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/79127e5e-8536-4092-8009-a9f6a4eb6153/0977525d-7d10-490d-becf-d09f9b5769e0/skills/

### STALE PATHS — NEVER USE THESE
# /Users/admin/Desktop/HydroMind/hydromind-frontend  ← OLD COPY
# /Users/admin/HydroMind-Platform/docs/old-user-skills  ← OLD COPY
# /Users/admin/HydroMind-Platform/web-frontend/Desktop/... ← GHOST PATH

---

## 2. PLATFORM URLS

| Service | URL |
|---|---|
| Frontend (live) | https://hydromindai.com |
| Backend | https://hydromind-backend.onrender.com |
| GitHub repo | https://github.com/arun25hyd/hydromind-ai |
| Supabase project | frqefpoheewbornozvhc |

---

## 3. TECH STACK

### Web Frontend
- Pure HTML/CSS/JS (no framework) — 8 pages
- Design: bg #0d0f12, surface #13171d, orange #f97316
- Pages: index.html, ai_advisor.html, crane_diagnostic.html, system_design.html,
         knowledge_base.html, pricing.html, maintenance.html, disclaimer.html

### Backend (Node.js / Express)
- File: server.js
- Model: claude-sonnet-4-5 (locked — do NOT change)
- Max tokens: 2000
- Security: helmet, rate limiters, CSP/HSTS/XSS headers

### Android App (React Native / Expo)
- SDK: Expo 54
- Package: com.hydromind.app
- EAS account: arun25hyd
- Next versionCode: 35 (always set via `eas build:version:set` first)
- Play Store: Closed testing active — 12 Gmail testers

### HydroFit App
- Package: com.hydrofit.app
- Expo SDK 54
- DB: 1,456 hose fittings + 284 tube fittings + 80 hoses

---

## 4. HTML PAGE ARCHITECTURE — CRITICAL

### Two page types exist — ALWAYS CHECK BEFORE EDITING:

**TYPE A — Shell Layout pages** (ai_advisor, crane_diagnostic, system_design)
- Wrap content in `<div class="shell">`
- Has `</body></html>` INSIDE JS strings (for iframe/print export)
- Real `</body>` is at line 893 (crane_diagnostic) and 1669 (system_design)
- Nav replacement MUST be line-number based — NOT regex (will eat shell closing div)

**TYPE B — Scroll pages** (index, knowledge_base, pricing, maintenance, disclaimer)
- Standard scroll layout — no shell wrapper
- Safe to use regex nav replacement

### Z-index Rule (NON-NEGOTIABLE)
- `bg-wrap` canvas = `position:fixed; z-index:0`
- ALL content sections need `position:relative; z-index:2`
- Forgetting this = content disappears behind canvas

### Standard Page Layout (all pages must have):
1. `hm-topnav` (52px fixed top)
2. `hm-left-sidebar`
3. `hm-right-sidebar` (hmAdSidebar)
4. `hm-main-content`

---

## 5. REPEATED MISTAKES REGISTRY — NEVER REPEAT

| # | Mistake | Fix |
|---|---|---|
| 1 | Edit HTML without reading structure first | grep shell/nav/div counts FIRST |
| 2 | Nav regex consuming closing shell div | Line-number based replace on shell pages |
| 3 | Claim "fixed" without browser screenshot | Screenshot = only proof |
| 4 | Patching broken patch | Restore from /Users/admin/Downloads/ clean source |
| 5 | Using bash_tool for Mac filesystem | bash_tool = container only. Use Desktop Commander for Mac |
| 6 | Guessing file paths | Read CLAUDE.md section 1 first |
| 7 | Multiple questions to Arun | Max ONE question per response |
| 8 | python str.replace() returning unchanged | Always verify with assert or print before writing |
| 9 | Editing stale Desktop copy | ALWAYS use /Users/admin/HydroMind-Platform/web-frontend |
| 10 | node --check skipped before backend push | ALWAYS run node --check server.js before git push |
| 11 | Auth restore not in 3 places | Auth restore script runs at: DOMContentLoaded + setTimeout 100ms + setTimeout 500ms |
| 12 | Re-doing tasks Arun confirmed ✅ | If Arun gave 👍 — NEVER touch it again |
| 13 | index.html hero SVG replaced with canvas | Hero is hydraulic schematic SVG in <div class="circuit-bg"> — NEVER replace |
| 14 | window.claude.complete() on live site | Use mailto: or Supabase — not claude API in browser |
| 15 | EAS build without version set | Always: eas build:version:set → 35 FIRST, then build |

---

## 6. GIT WORKFLOW (EXACT COMMANDS)

### Frontend
```bash
cd /Users/admin/HydroMind-Platform/web-frontend
git add -A && git commit -m "fix: description" && git push origin main
```

### Backend
```bash
cd /Users/admin/HydroMind-Platform/backend
node --check server.js   # MANDATORY before push
git add -A && git commit -m "fix: description" && git push origin main
```

### After push: wait 20s → browser verify → screenshot to Arun

---

## 7. QUERY ROUTING — WHAT TO LOAD

| Query Type | Action |
|---|---|
| Hydraulic fault / crane / KB / HPU | Load hydromind-ai-advisor SKILL.md |
| Web platform bug / page fix / HTML | Read this CLAUDE.md → inspect actual file → fix |
| Android / Expo / React Native | Direct coding — no skill needed |
| AI building / Claude API / LLM | Direct — general AI knowledge |
| Money / monetisation / SaaS / Play Store | Direct — general business knowledge |
| General chat / writing / research | Direct — no skill needed |

---

## 8. EXECUTION PROTOCOL (NON-NEGOTIABLE)

INSPECT → PLAN → CONFIRM → EXECUTE → VERIFY → COMMIT

1. INSPECT: Read actual file — count divs, grep structure
2. PLAN: State exactly what will change + which files
3. CONFIRM: If risky, one sentence to Arun before acting
4. EXECUTE: Single clean pass — never patch a broken patch
5. VERIFY: Browser screenshot of changed page
6. COMMIT: Only after browser confirms correct

NEVER claim done without browser screenshot.
NEVER edit without reading file structure first.
NEVER guess a file path — check CLAUDE.md section 1.

