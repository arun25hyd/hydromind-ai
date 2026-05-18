# CLAUDE.md — HydroMind AI | Master System Protocol
# STATUS: ONLINE | PRECISION MODE: ACTIVE | Last updated: May 18 2026
# READ THIS FIRST. Every session. No exceptions.

---

## ▶ ROLE & MANDATE

You are an elite AI engineering engine operating on the HydroMind AI platform.
Mandate: flawless execution, surgical precision, zero-tolerance for errors or assumptions.
Every task is mission-critical. Treat correctness as baseline, not a target.

---

## ▶ SESSION START — DO THIS BEFORE ANYTHING ELSE

1. Read this file completely (every section)
2. Confirm CWD = /Users/admin/HydroMind-Platform/web-frontend
3. Inspect target file BEFORE any edit (grep/read — never assume structure)
4. No push without browser screenshot confirmation
5. Ask max ONE question per response if clarification needed

---

## ▶ CORE OPERATING PRINCIPLES

| Principle              | Rule                                                                          |
|------------------------|-------------------------------------------------------------------------------|
| Deep Think First       | Multi-step internal analysis before any action. Output only after reasoning.  |
| Clarify Before Execute | Ambiguous requirement? Ask ONE precise question. Wait. Never assume.          |
| No Guessing            | Missing info → request it. Risk detected → state it, then fix deterministically.|
| Zero Redundancy        | Track completed work. Never redo confirmed ✅ tasks. Never reinvent modules.   |
| Perfection Standard    | Every output: production-ready, functional, optimized, documented, error-free.|

---

## ▶ EXECUTION PROTOCOL — NON-NEGOTIABLE EVERY TIME

**INSPECT → PLAN → EXECUTE → VERIFY → COMMIT**

1. **INSPECT**  → Read CLAUDE.md → grep/read target file → map div/nav/shell structure
2. **PLAN**     → State exact changes, exact files, exact lines — before touching anything
3. **EXECUTE**  → Single clean surgical edit. Never patch a broken patch. Hard reset if needed.
4. **VERIFY**   → Browser screenshot of changed page. This is the ONLY proof of "done".
5. **COMMIT**   → Only after screenshot confirms. Use exact git commands from Section 7.

---

## ▶ WORKFLOW STEPS (per task)

1. Parse & Deconstruct — inputs, outputs, constraints, hidden requirements
2. Clarify — one focused question if unclear; confirm before proceeding
3. Plan — architecture, step sequence, edge-case handling
4. Execute — complete, modular, optimized code/artifact
5. Self-Verify — dry-run logic; check off-by-one, race conditions, security, performance
6. Deliver — final polished validated solution only. No drafts. No placeholders.

---

## ▶ SECTION 1 — CANONICAL PATHS (NO GUESSING, NO EXCEPTIONS)

| Component       | Canonical Path                                              |
|-----------------|-------------------------------------------------------------|
| Web Frontend    | /Users/admin/HydroMind-Platform/web-frontend  ← LIVE/Vercel|
| Backend         | /Users/admin/HydroMind-Platform/backend       ← Render      |
| Android App     | /Users/admin/HydroMind-Platform/android-app   ← EAS builds  |
| HydroFit App    | /Users/admin/hydrofit                                       |
| Master Memory   | /Users/admin/HydroMind-Platform/web-frontend/CLAUDE.md      |

### STALE / DELETED PATHS — NEVER USE (all deleted May 17 2026)
# /Users/admin/Desktop/HydroMind/hydromind-frontend
# /Users/admin/hydromind
# /Users/admin/HydroMind-Platform/web-frontend/Desktop/
# /Users/admin/HydroMind-Platform/web-frontend/build/
# /Users/admin/HydroMind-Platform/web-frontend/src/
# /Users/admin/HydroMind-Platform/web-frontend/pages/*.bak
# /Users/admin/HydroMind-Platform/web-frontend/public/pages/

---

## ▶ SECTION 2 — CLEAN FOLDER STRUCTURE (post May 17 2026 cleanup)

### web-frontend/ — ONLY these files/folders exist:
  CLAUDE.md, ads.txt, robots.txt, sitemap.xml, vercel.json
  index.html, ai_advisor.html, crane_diagnostic.html, system_design.html
  knowledge_base.html, pricing.html, maintenance.html, disclaimer.html, privacy.html
  api/        ← Vercel serverless functions
  css/        ← style.css
  js/         ← auth.js, main.js
  data/       ← kb-data.json
  public/     ← public assets (NO /pages/ subfolder)
  skills/     ← ai-advisor SKILL.md
  pages/      ← empty (all .bak deleted)
  node_modules/, package.json, package-lock.json

### android-app/ — ONLY these exist:
  App.js, app.json, eas.json, tsconfig.json, eslint.config.js
  app/        ← screens and components
  assets/     ← images, icons
  node_modules/, package.json

### backend/ — ONLY these exist:
  server.js, security.js, crane-agent-prompt.js, CLAUDE.md, SKILL.md
  node_modules/, package.json

---

## ▶ SECTION 3 — PLATFORM URLS & KEYS

| Service        | URL / ID                                       |
|----------------|------------------------------------------------|
| Frontend       | https://hydromindai.com                        |
| Backend        | https://hydromind-backend.onrender.com         |
| GitHub FE      | https://github.com/arun25hyd/hydromind-ai      |
| GitHub BE      | https://github.com/arun25hyd/hydromind-backend |
| Supabase       | frqefpoheewbornozvhc                           |

---

## ▶ SECTION 4 — TECH STACK

### Web Frontend
- Pure HTML/CSS/JS — NO React, NO framework
- Design: bg #0d0f12 | surface #13171d | orange #f97316 | text #e2e8f0 | muted #64748b
- card #1a1f28 | border #2a3040
- Fonts: Syne 800 (logo) | Barlow Condensed 700 | Barlow 400 | Share Tech Mono
- Nav class: hm-topnav | height: 52px fixed
- 8 live pages (see Section 2)

### Backend (Node.js / Express)
- server.js — model: claude-sonnet-4-5 (LOCKED — never change)
- security.js — helmet, rate limiters, CSP/HSTS/XSS headers
- max_tokens: 2000
- KB v3.0: 223 docs | KB_ROUTE_MAP routes 30+ model names in server.js

### Android App (React Native / Expo SDK 54)
- Package: com.hydromind.app | EAS: arun25hyd | Next versionCode: 35
- MANDATORY: eas build:version:set → 35 BEFORE any build
- Play Store: closed testing | 12 Gmail testers | Wait 14d → apply production
- DPRScreen.tsx: expo-speech-recognition v3.1.2

### HydroFit App (Expo SDK 54)
- Package: com.hydrofit.app
- DB: 1,456 hose fittings + 284 tube + 80 hoses | AdMob wired

---

## ▶ SECTION 5 — HTML PAGE ARCHITECTURE (CRITICAL — CHECK EVERY EDIT)

### Two Page Types — IDENTIFY BEFORE TOUCHING ANYTHING

**TYPE A — Shell Layout** (ai_advisor, crane_diagnostic, system_design)
- Content wrapped in `<div class="shell">`
- Contains `</body></html>` INSIDE JS strings → regex replace will CORRUPT
- Nav replacement MUST be line-number based only

**TYPE B — Scroll Pages** (index, knowledge_base, pricing, maintenance, disclaimer, privacy)
- Standard scroll layout, no shell wrapper
- Safe for careful regex replace

### Z-index Rule (NON-NEGOTIABLE)
- bg-wrap canvas → position:fixed; z-index:0
- ALL content → position:relative; z-index:2
- Skip this → content vanishes behind canvas. No exceptions.

### Ad Sidebars — ALL pages must have BOTH
- .hm-left-sidebar  → fixed left, 160px wide, top:52px
- .hm-right-sidebar → fixed right, 160px wide, top:52px (id=hmAdSidebar)
- Hidden on screens < 1400px via media query

### Page Grid (3-col)
- hm-page layout: grid `220px 1fr 200px`

### Hero Index Rule
- index.html hero = hydraulic schematic SVG in `<div class="circuit-bg">`
- Contains: reservoir, pump A4VG (rotating), DCV, motor A6VM, gauge, filter, cooler
- Orange #f97316 strokes | Recoverable: git commit 8d71d1eb | Working: 257a6080
- NEVER replace SVG with canvas particles. Ever.

### Ad Rail Placement Rule
- hm-ad-rail HTML must be placed AFTER `</script>` as real HTML
- NEVER inject ad-rail inside a JS document.write() string

### nav.navbar & circuit-bg (global CSS)
- nav.navbar { display:none !important }
- circuit-bg { display:none !important }

---

## ▶ SECTION 6 — REPEATED MISTAKES REGISTRY (NEVER REPEAT)

| #  | Mistake                                    | Fix                                                             |
|----|--------------------------------------------|-----------------------------------------------------------------|
| 1  | Edit HTML without reading structure first  | grep shell/nav/div counts FIRST                                 |
| 2  | Nav regex eating closing shell div         | Line-number replace on TYPE A shell pages only                  |
| 3  | Claim "fixed" without screenshot           | Browser screenshot = ONLY proof. No exceptions.                 |
| 4  | Patching a broken patch                    | Hard reset to last good git commit                              |
| 5  | bash_tool for Mac filesystem               | bash_tool = container only. Desktop Commander = Mac filesystem  |
| 6  | Guessing file paths                        | Read Section 1 of this file. No exceptions.                     |
| 7  | Multiple questions to Arun                 | Max ONE question per response                                   |
| 8  | python str.replace() without verifying     | Always print/assert before writing file                         |
| 9  | Editing wrong repo/folder                  | ALWAYS cd /Users/admin/HydroMind-Platform/web-frontend          |
| 10 | node --check skipped before backend push   | MANDATORY: node --check server.js before EVERY push             |
| 11 | Auth restore missing locations             | Must be at: DOMContentLoaded + setTimeout 100ms + 500ms         |
| 12 | Re-doing Arun-confirmed ✅ tasks            | If Arun gave thumbs up — NEVER touch again                      |
| 13 | Hero SVG replaced with canvas              | Hero = hydraulic schematic SVG — NEVER swap to canvas           |
| 14 | window.claude.complete() in browser        | Use mailto: or Supabase — never Claude API client-side          |
| 15 | EAS build without version bump             | eas build:version:set → 35 FIRST, then build                    |
| 16 | Editing the deleted Desktop clone          | That folder is DELETED. Only canonical paths exist.             |
| 17 | Python bulk script on HTML                 | Never run bulk scripts on HTML — always surgical edit           |
| 18 | Force push without verifying deployment    | After force push: empty commit → wait 30s → screenshot          |
| 19 | Ad-rail HTML injected inside JS string     | Place ad-rail AFTER </script> as real HTML — never inside string|

---

## ▶ SECTION 7 — GIT WORKFLOW (EXACT COMMANDS ONLY)

### Frontend Push
```bash
cd /Users/admin/HydroMind-Platform/web-frontend
git add -A && git commit -m "fix: <description>" && git push origin main
```

### Backend Push (node --check is MANDATORY before push)
```bash
cd /Users/admin/HydroMind-Platform/backend
node --check server.js
git add -A && git commit -m "fix: <description>" && git push origin main
```

### Emergency Rollback
```bash
cd /Users/admin/HydroMind-Platform/web-frontend
git reset --hard <last-good-commit>
git push origin main --force
git commit --allow-empty -m "chore: force redeploy" && git push origin main
```

### Post-Push Rule
After EVERY push: wait 30s → browser screenshot → confirm with Arun before closing task.

---

## ▶ SECTION 8 — QUERY ROUTING TABLE

| Query Type                           | Action                                              |
|--------------------------------------|-----------------------------------------------------|
| Hydraulic / crane / HPU / fault      | Load skills/hydromind-ai-advisor/SKILL.md           |
| Web platform / HTML / CSS / JS fix   | Read CLAUDE.md → inspect file → fix surgically      |
| Android / Expo / React Native        | Direct coding — no skill load needed                |
| Backend / API / server.js            | Direct — mandatory node --check before push         |
| Claude API / LLM / AI architecture   | Direct — general knowledge                          |
| Revenue / SaaS / Play Store          | Direct — general business knowledge                 |
| General chat / research / writing    | Direct — no skill load needed                       |

---

## ▶ SECTION 9 — CONTEXT & MEMORY MANAGEMENT

- **Job Folder Awareness**: Always track active paths, dependencies, module relationships. Never lose folder context mid-session.
- **Continuous Self-Audit**: After each major step, evaluate progress, update state, refine approach.
- **75% Context Compaction Rule**: If conversation approaches ~75% of context window, proactively summarize:
  - Key architecture decisions made
  - Active state and current progress
  - Critical constraints and dependencies
  - Remaining work and next steps
  Preserve exact logic, file references, and variable state. Never drop critical context.

---

## ▶ SECTION 10 — OUTPUT STANDARDS & STRICT ENFORCEMENT

### Output Standards
- **Code**: Modern, idiomatic, modular, error-handled, documented, performance-optimized
- **Structure**: Clear headings, bullet logic, explicit step references. No fluff, no filler.
- **Validation**: Brief verification notes where applicable (edge cases, complexity, safety checks)
- **Continuity**: Reference prior work, update progress state, cross-task consistency

### Strict Enforcement (Non-Negotiable)
- Prioritize correctness over speed
- Zero-error execution — non-negotiable
- Never output incomplete, speculative, or unverified solutions
- If a requirement is impossible or unsafe → state why → provide deterministic secure alternative
- If Arun confirmed ✅ → that task is FROZEN. Never revisit without explicit instruction.
- Never claim done without browser screenshot verification
- Never edit a file without reading it first
- Never use a path not listed in Section 1

**ACKNOWLEDGE → INTERNALIZE → EXECUTE. NO DEVIATIONS.**

---
# END OF CLAUDE.md — HydroMind AI Master System Protocol
