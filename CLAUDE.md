# CLAUDE.md — HydroMind AI Master Memory File
# Single source of truth. Read this FIRST before any HydroMind task.
# Last updated: May 17 2026 — post cleanup session

---

## ⚠️ SESSION START CHECKLIST — DO THIS BEFORE ANYTHING ELSE

1. Read this file completely
2. Confirm working directory = /Users/admin/HydroMind-Platform/web-frontend
3. Never edit any file without running grep/read on it first
4. Never push without browser screenshot confirmation

---

## 1. CANONICAL FILE PATHS — EXACT, NO GUESSING, NO EXCEPTIONS

### Web Frontend (LIVE — Vercel deploys from here)
/Users/admin/HydroMind-Platform/web-frontend

### Backend (Node.js — Render deploys from here)
/Users/admin/HydroMind-Platform/backend

### Android App (Expo — EAS builds from here)
/Users/admin/HydroMind-Platform/android-app

### HydroFit App
/Users/admin/hydrofit

### STALE / DELETED PATHS — THESE NO LONGER EXIST — NEVER USE
# /Users/admin/Desktop/HydroMind/hydromind-frontend  ← DELETED May 17 2026
# /Users/admin/hydromind                              ← WRONG, use android-app
# /Users/admin/HydroMind-Platform/web-frontend/Desktop/  ← DELETED
# /Users/admin/HydroMind-Platform/web-frontend/build/    ← DELETED
# /Users/admin/HydroMind-Platform/web-frontend/src/      ← DELETED
# /Users/admin/HydroMind-Platform/web-frontend/pages/*.bak ← ALL DELETED
# /Users/admin/HydroMind-Platform/web-frontend/public/pages/ ← DELETED

---

## 2. CLEAN FOLDER STRUCTURE (after May 17 2026 cleanup)

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
  pages/      ← empty (all .bak files deleted)
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

## 3. PLATFORM URLS

| Service     | URL                                      |
|-------------|------------------------------------------|
| Frontend    | https://hydromindai.com                  |
| Backend     | https://hydromind-backend.onrender.com   |
| GitHub (FE) | https://github.com/arun25hyd/hydromind-ai |
| Supabase    | frqefpoheewbornozvhc                     |

---

## 4. TECH STACK

### Web Frontend
- Pure HTML/CSS/JS — NO React, NO framework
- Design: bg #0d0f12, surface #13171d, orange #f97316
- 8 live pages (listed in section 2 above)
- Nav height: 52px fixed

### Backend (Node.js / Express)
- server.js — model: claude-sonnet-4-5 (LOCKED — never change)
- Max tokens: 2000
- Security: helmet, rate limiters, CSP/HSTS/XSS via security.js

### Android App (React Native / Expo SDK 54)
- Package: com.hydromind.app
- EAS account: arun25hyd
- Next versionCode: 35
- ALWAYS run: eas build:version:set → 35 BEFORE any build
- Play Store: closed testing, 12 Gmail testers

### HydroFit App (Expo SDK 54)
- Package: com.hydrofit.app
- DB: 1,456 hose + 284 tube + 80 hose fittings

---

## 5. HTML PAGE ARCHITECTURE — CRITICAL

### Two page types — CHECK BEFORE EVERY EDIT:

TYPE A — Shell Layout (ai_advisor, crane_diagnostic, system_design)
- Content wrapped in <div class="shell">
- Contains </body></html> INSIDE JS strings — do NOT use regex replace
- Nav replacement MUST be line-number based

TYPE B — Scroll pages (index, knowledge_base, pricing, maintenance, disclaimer, privacy)
- Standard scroll layout, no shell wrapper
- Safe for regex replace

### Z-index Rule (NON-NEGOTIABLE)
- bg-wrap canvas = position:fixed; z-index:0
- ALL content = position:relative; z-index:2
- Forgetting this = content vanishes behind canvas

### Ad Sidebars (all pages must have both)
- .hm-left-sidebar  — fixed left, 160px, top:52px
- .hm-right-sidebar — fixed right, 160px, top:52px (id=hmAdSidebar)
- Hidden on screens < 1400px via media query

---

## 6. REPEATED MISTAKES REGISTRY — NEVER REPEAT

| #  | Mistake                                   | Fix                                                        |
|----|-------------------------------------------|------------------------------------------------------------|
| 1  | Edit HTML without reading structure first | grep shell/nav/div counts FIRST                            |
| 2  | Nav regex eating closing shell div        | Line-number replace on shell pages                         |
| 3  | Claim "fixed" without screenshot          | Browser screenshot = only proof                            |
| 4  | Patching a broken patch                   | Hard reset to last good git commit                         |
| 5  | bash_tool for Mac filesystem              | bash_tool = container only. Use Desktop Commander for Mac  |
| 6  | Guessing file paths                       | Read CLAUDE.md section 1 — no exceptions                  |
| 7  | Multiple questions to Arun                | Max ONE question per response                              |
| 8  | python str.replace() not verifying        | Always print/assert before writing file                    |
| 9  | Editing wrong repo/folder                 | ALWAYS cd /Users/admin/HydroMind-Platform/web-frontend     |
| 10 | node --check skipped before backend push  | MANDATORY: node --check server.js before every push        |
| 11 | Auth restore missing locations            | Must be at: DOMContentLoaded + setTimeout 100ms + 500ms    |
| 12 | Re-doing Arun-confirmed ✅ tasks           | If Arun gave thumbs up — NEVER touch again                 |
| 13 | Hero SVG replaced with canvas             | Hero = hydraulic schematic SVG in .circuit-bg — NEVER swap |
| 14 | window.claude.complete() in browser       | Use mailto: or Supabase — never Claude API client-side     |
| 15 | EAS build without version bump            | eas build:version:set → 35 FIRST, then build               |
| 16 | Edited stale Desktop clone (May 17 2026)  | That folder is DELETED. Only canonical paths exist now.    |
| 17 | Python script damaged pricing.html        | Never run bulk scripts on HTML — edit surgically           |
| 18 | Force push without verifying deployment   | After force push: empty commit → wait 30s → screenshot     |
| 19 | hm-ad-rail HTML injected inside JS string | ad-rail broke out of document.write() string in system_design + crane_diagnostic — ALWAYS place ad rail AFTER </script> as real HTML, never inside a JS string |

---

## 7. GIT WORKFLOW (EXACT COMMANDS)

### Frontend
```bash
cd /Users/admin/HydroMind-Platform/web-frontend
git add -A && git commit -m "fix: description" && git push origin main
```

### Backend
```bash
cd /Users/admin/HydroMind-Platform/backend
node --check server.js
git add -A && git commit -m "fix: description" && git push origin main
```

### Emergency rollback
```bash
cd /Users/admin/HydroMind-Platform/web-frontend
git reset --hard <last-good-commit>
git push origin main --force
git commit --allow-empty -m "chore: force redeploy" && git push origin main
```

### After every push: wait 30s → browser screenshot → confirm with Arun

---

## 8. QUERY ROUTING

| Query type                          | Action                                              |
|-------------------------------------|-----------------------------------------------------|
| Hydraulic / crane / HPU / fault     | Load skills/hydromind-ai-advisor/SKILL.md           |
| Web platform / HTML / CSS / JS fix  | Read this CLAUDE.md → inspect file → fix            |
| Android / Expo / React Native       | Direct coding — no skill needed                     |
| Backend / API / server.js           | Direct — always node --check before push            |
| AI / Claude API / LLM               | Direct — general knowledge                          |
| Money / SaaS / Play Store           | Direct — general business knowledge                 |
| General chat / research / writing   | Direct — no skill needed                            |

---

## 9. EXECUTION PROTOCOL — NON-NEGOTIABLE EVERY TIME

INSPECT → PLAN → EXECUTE → VERIFY → COMMIT

1. INSPECT  : Read CLAUDE.md → grep actual file → count divs/structure
2. PLAN     : State exactly what changes, which files, which lines
3. EXECUTE  : Single clean surgical edit — never patch a broken patch
4. VERIFY   : Browser screenshot of the changed page — no exceptions
5. COMMIT   : Only after screenshot confirms correct result

NEVER claim done without a browser screenshot.
NEVER edit without reading the file first.
NEVER use a path not listed in Section 1.
NEVER run bulk Python/regex scripts on HTML files.
