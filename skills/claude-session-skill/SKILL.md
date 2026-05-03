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

### KB State (May 3, 2026)
- KB1–KB47: OEM manuals
- KB48: Fukushima IHI — PENDING
- KB49–KB86: Hydraulic textbooks, crane standards, seals, wire rope, rigging
- KB87: ISO 4413:1998 — Full hydraulic system safety rules
- KB88: Rexroth VT-VRPA2 — Servo solenoid valve amplifier (RE 30048)
- KB89: Rexroth VT-VRPA1 — Proportional valve analogue amplifier (RA 30118)
- KB90: Palfinger PK10000 — Hydraulic knuckle boom crane operators manual
- SKILL.md: updated May 3, 2026 | Next KB: KB91

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
| v3.1 | 2026-05-03 | KB87–KB90 added: ISO 4413, Rexroth VT-VRPA2, VT-VRPA1, Palfinger PK10000 |

---

## KB87 — ISO 4413:1998 — Hydraulic Fluid Power General Rules

**Document:** ISO 4413:1998 (Second Edition) — Hydraulic fluid power — General rules relating to systems
**Category:** Standards & Compliance
**Scope:** All hydraulic systems on industrial and marine machinery

### Key Requirements by Section

**Safety (Clause 4):**
- All parts of system must be protected against pressures exceeding maximum working pressure
- Primary protection = pressure relief valves; alternative = pressure compensator pump controls
- Surge and intensified pressures must not cause hazards
- Loss of pressure or critical pressure drop must not expose persons to hazard
- Mechanical movements (intended or unintended) must not create hazardous situations

**System Design (Clause 5):**
- Circuit diagrams must comply with ISO 1219-2
- Circuit diagram must include: all component IDs, pipe/tube sizes, cylinder bore/rod/stroke, motor displacement/torque, pump flow/direction, pressure settings, filter types, fluid volume, fluid type/viscosity, accumulator pre-charge pressures
- All ports, test points, bleed points and drain outlets must be clearly identified
- Components >15 kg must have lifting provisions
- Installation height: bottom edge min 0.6 m, top edge max 1.8 m above working platform

**Pumps & Motors (Clause 6.1):**
- Must be mounted accessible for maintenance with no shaft misalignment under duty cycle
- Drive couplings must withstand maximum torque under all operating conditions
- Case drain lines must meet OEM specification — no excessive back pressure
- Pump inlet pressure must not be less than minimum specified by pump supplier
- Tapered pipe threads or sealing compounds NOT permitted on connections

**Cylinders (Clause 6.2):**
- Piston rod material must minimise wear, corrosion and impact damage (HVOF or hard chrome standard)
- Pressure intensification from piston area differences must be prevented by circuit design
- Cylinders used as position stops must be sized for maximum incurred loading
- Port location: cylinders installed with ports uppermost where practical

**Accumulators (Clause 6.3):**
- Must auto-vent liquid pressure or positively isolate when system shuts off
- Warning label mandatory: "CAUTION – System contains accumulator(s). Depressurise before maintenance"
- Charging medium: nitrogen only — never oxygen or air
- Fully depressurise both liquid AND gas sides before disassembly

**Valves (Clause 7):**
- Surface-mounted and cartridge valves preferred
- Manifold mounting surfaces per ISO 4401, ISO 5781, ISO 6263, ISO 6264, ISO 7790
- Electrically operated valves: solenoids must operate reliably at nominal voltage ±10%
- Manual override mandatory if valve must operate when electrical control unavailable
- Valves that can cause hazard if adjusted must be tamper-proof

**Fluid & Conditioning (Clause 8):**
- Reservoir minimum height: 150 mm above floor level
- Reservoir must dissipate heat under normal working without heat exchanger if applicable
- Return lines must discharge below minimum operating fluid level at lowest practical velocity
- Filtration must limit contamination per ISO 4406
- Suction filtration NOT recommended unless agreed supplier/purchaser
- Filter assemblies must have differential pressure indicator visible to operator
- Heat exchangers: cooling media control valves on input line; shut-off valves in cooling medium lines for maintenance

**Piping (Clause 9):**
- Fluid velocity limits: suction lines ≤1.2 m/s | pressure lines ≤5 m/s | return lines ≤4 m/s
- Pipe support spacing: OD <10mm = 1m | 10-25mm = 1.5m | 25-50mm = 2m | >50mm = 3m
- Hose assemblies must not be bent below minimum bending radius
- Quick-action couplings must auto-seal both sides on disconnection

**Control Systems (Clause 10):**
- Servo/proportional valve supply line: full-flow filter WITHOUT bypass, collapse strength > system max pressure
- System must be cleaned to stabilised contamination level BEFORE servo/proportional valves installed
- Emergency stop must not itself cause a hazard
- At least one emergency stop must be remotely located
- Spring-biased or detent-located valves mandatory for any actuator that must hold position on control failure

**Commissioning (Clause 14):**
- No measurable unintended leakage permitted (slight wetting not forming a drop is acceptable)
- Pressure test each part at maximum pressure that may be sustained under all conditions of intended use

### Pressure Test Points
- Permanently installed gauges must be protected by pressure limiter or gauge isolator
- Gauge range upper limit must exceed max working pressure by minimum 25%
- Fluid sampling point per ISO 4021 must be provided for contamination monitoring

### Standards Referenced
ISO 1219-1, ISO 1219-2, ISO 4401, ISO 4406, ISO 4021, ISO 6149, ISO 6162, ISO 6164, ISO 10763, IEC 204-1, IEC 529

---

## KB88 — Rexroth VT-VRPA2 — Electric Amplifier for Servo Solenoid Valves (RE 30048/01.09)

**Document:** Bosch Rexroth RE 30048/01.09 — Electric Amplifiers Type VT-VRPA2, Unit Series 1X
**Manufacturer:** Bosch Rexroth AG, Lohr am Main, Germany
**Category:** Proportional/Servo Amplifier Cards
**Application:** Direct actuation of servo solenoid valves type 4WRP Series 1X (offshore crane directional control)

### Identification
- Model: VT-VRPA2-1X
- Format: Eurocard, 19" rack mount, DIN 41612-F32 connector
- Unit series: 1X (10 to 19)
- Serial numbers: 527 = NG6 | 537 = NG10

### Technical Specifications
| Parameter | NG6 (527) | NG10 (537) |
|---|---|---|
| Solenoid current | 2.7 A | 3.7 A |
| Solenoid voltage | 25 V | 50 V |
| Current rating | 1.5 A | 2.5 A |
| Power consumption | 35 W | 60 W |
| PCB dimensions | 100 x 160 x ~35 mm | same |
| Weight | 0.25 kg | 0.25 kg |
| Ambient temp | 0 to +70°C | same |
| Storage temp | -20 to +70°C | same |

**Power Supply:**
- 24 VDC nominal
- Battery: 21–40 V DC
- Rectified AC: Ueff = 21–28 V (single-phase full-wave)
- Smoothing capacitor: 4,700 µF/63 VDC (if UB ripple >10%)

**Input Signal (Setpoint):**
- 0 to ±10 V (Ri = 10 kΩ)
- Potentiometer: 1 kΩ, ±10 V supply from card

**Actual Value Feedback:**
- Oscillator frequency: 10.2 Veff / 7.8 kHz
- Feedback signal: 0 to ±10 V DC
- Open-circuit detection active — fault signal on cable break

**Solenoid Cable:**
- Up to 20 m → 1.5 mm²
- 20 to 50 m → 2.5 mm²
- Position transducer: max 50 m at 100 pF/m

### Front Panel Adjustments (Trimming Potentiometers)
| Pot | Function | Range |
|---|---|---|
| NPA / NPB | Valve zero adjustment | ±10% of stroke |
| QA / QB | Sensitivity | 100% to 50% |
| Ramp α | Acceleration ramp time | 0.05 to 5 seconds |
| Ramp β | Deceleration ramp time | 0.05 to 5 seconds |

### LED Indicators
| LED | Colour | Meaning |
|---|---|---|
| Enable | Green | Enable ON — output stage active |
| UB low | Red | Supply voltage below 21 V |
| Ramp OFF | Yellow | Ramp function deactivated |
| Open circuit | Yellow | Feedback signal cable break detected |

### Enable & Ramp Logic
- Enable input: z16, U = 8.5–40 V → output stage active
- Ramp OFF: b20 linked to b22 or 8.5–40 V at b20 → immediate transition (no ramp)
- Ramp ON: b20 open (default)
- Ramp OFF, Enable OFF, or Open Circuit = abrupt transition to final signal value

### Key Functions
**Deadband Compensation:** Electronic bypass of ±20% spool overlap in ±15% range — prevents dead zone response at valve centre
**Quadrant Recognition:** Ramp switches automatically when valve spool crosses centre to maintain equal acceleration in both directions
**Zero Compensation:** Input 0.3–0.5 V required to exit deadband correctly
**Closed-loop Position Control:** PID action on spool position via LVDT feedback
**Clocked Output Stage:** Fast energise/de-energise for rapid response

### Fault Signals (Open Collector to +UK, max 100 mA)
- Feedback signal open circuit
- UB too low
- ±15 V internal stabilisation fault

### Wiring Notes
- Power zero (b2) and control zero (b12) must be connected SEPARATELY to central ground (neutral point)
- Never connect power zero and control zero together — causes ground loops
- Test box: VT-PE-TB1 (RE 30063)
- Test adapter: VT-PA-3 (RE 30070)

### Fault Diagnosis — Field Guide
| Symptom | Likely Cause | Check |
|---|---|---|
| No valve movement | Enable not active | Confirm z16 = 8.5–40V |
| Red LED on | Supply <21V | Check UB at b16/b18 |
| Yellow open-circuit LED | LVDT cable break | Check transducer cable continuity |
| Valve hunting/oscillating | PID gain too high | Reduce sensitivity QA/QB |
| No ramp on start | Ramp disabled | Check b20 — must be open for ramp ON |
| Valve stuck at one side | Zero offset | Adjust NPA or NPB trimmer |

---

## KB89 — Rexroth VT-VRPA1 — Analogue Amplifier for Proportional Valves (RA 30118/11.04)

**Document:** Bosch Rexroth RA 30118/11.04 — Analogue Amplifier Model VT-VRPA1, Component Series 1X
**Manufacturer:** Bosch Rexroth Corp., Bethlehem PA USA
**Category:** Proportional Amplifier Cards
**Application:** Proportional pressure control valves (DBETR), proportional flow control valves (2FRE 6/10/16)

### Model Variants
| Model | Valve Type | Solenoid R(20) | Mat. No. |
|---|---|---|---|
| VT-VRPA1-100-1X/V0/0 | DBETR pressure valve | 10 Ω | R901009038 |
| VT-VRPA1-150-1X/V0/0 | 2FRE 6 flow valve | 5.4 Ω | R901057058 |
| VT-VRPA1-151-1X/V0/0 | 2FRE 10/16 flow valve | 10 Ω | R901057060 |

### Technical Specifications
| Parameter | Value |
|---|---|
| Operating voltage | 24 VDC (+40% / -5%) |
| Functional range | 22–35 V |
| Power consumption | <35 W |
| Current consumption | <1.5 A |
| Fuse | 2.5 A T (slow blow) |
| PCB format | Eurocard 100 x 160 mm (DIN 41494) |
| Front plate | 3HE x 4TE (3HE = 128.4 mm) |
| Connector | 32-pin blade DIN EN 60603-2 form D |
| Ambient temp | 0 to +50°C |
| Storage temp | -25 to +70°C |
| Weight | 0.15 kg |

### Command Value Inputs
| Input | Signal | Reference |
|---|---|---|
| Command value 1 | 0 to +9 V | M0 (measurement zero) |
| Command value 2 | 0 to +6 V | M0 |
| Command value 3 (diff) | 0 to +10 V / 0-20 mA / 4-20 mA | Differential |

**Internal regulated supply:** ±9 V (raised zero point) — 25 mA external load available

### Ramp Generator
- Separate ramp times for UP (t1) and DOWN (t2) — adjusted via front panel potentiometers
- Ramp time range: Short (X9 bridge) = 0.02 to 5 s | Long (X8 bridge) = 0.2 to 50 s
- Ramp OFF: apply >10 V to switched input OR set bridge X4 → minimum ramp ~15 ms
- Measurement sockets t1/t2 on front panel allow ramp time verification with voltmeter

**Ramp time calculation:**
- Short: t_up = 1/Ut1 (seconds) | Long: t_up = 0.1/Ut1 (seconds)
- Ut1 voltage at measurement socket — range -0.02 V (max time) to -5 V (min time)

### Output Stage
- Solenoid output: max 2.2 A ±10%
- Clock frequency: free clocking ~1.5 kHz
- Limiter: command value clamped to +105% / -5% — prevents spool hitting mechanical stop

### Position Controller
- PID controller optimised for DBETR and 2FRE valves
- Inductive position transducer (LVDT) — oscillator frequency 2.5 kHz ±10%
- Actual value output: 0 to -6 V (inverted vs command value — 100% travel = -6 V at socket x)

### Plug-In Bridge Settings
| Bridge | Function | Fitted | Open |
|---|---|---|---|
| X3 | Enable | Permanently ON | External control |
| X4 | Ramp | Permanently OFF | External control |
| X8 | Long ramp (0.2–50s) | Long | — |
| X9 | Short ramp (0.02–5s) | Short | — |
| X12-X14 | Current input config | 4-20 mA / 0-20 mA | Voltage |

### Enable Input
- Active: >10 V at 20a → output stage released (yellow LED ON)
- Not active: <9 V → output stage blocked
- Bridge X3 = permanently enable ON (for replacing VT 5003/5004/5010)

### Compatibility — Drop-in Replacement
Replaces amplifier types: VT 5003, VT 5004, VT 5010
When replacing: set bridge X3 (enable) to "permanently ON" — order 4TE/3HE dummy plate separately (mat. no. R900021004)

### Wiring Critical Notes
- Measuring zero (M0) is raised +9 V above 0 V operating voltage — NEVER connect M0 to 0 V (L0)
- Always screen command value lines — screen to card-side 0 V, leave far end open (prevent earth loops)
- Solenoid cables: LiYCY 1.5 mm² up to 50 m
- Do not use solenoid plugs with freewheeling diodes or LED displays
- Measurement instruments must have Ri >100 kΩ
- Distance from antenna, radio and radar equipment: minimum 1 m
- Do not lay solenoid and signal lines near power lines

### Fault Diagnosis — Field Guide
| Symptom | Likely Cause | Check |
|---|---|---|
| Green LED off | UB <20V or internal fault | Check supply, check ±9V rails |
| Yellow LED off | Enable not active | Check 20a > 10V or set X3 |
| No valve response | Command value zero or zero pot wrong | Check Zw potentiometer |
| Valve at full stroke always | Limiter tripped | Check Zw and Gw settings |
| Unstable/oscillating | PID overshoot | Reduce Gw sensitivity |
| Ramp not working | Bridge X4 fitted | Remove X4 for external ramp control |
| Incorrect ramp direction | Wrong ramp bridge | Check X8 vs X9 — only one should be fitted |

---

## KB90 — Palfinger PK10000 — Hydraulic Knuckle Boom Crane

**Document:** Operators Manual — Hydraulic Crane PK10000 (Scribd ref: 492675723)
**Manufacturer:** Palfinger AG, Austria
**Category:** Offshore / Marine Knuckle Boom Crane
**Architecture:** Open-loop hydraulic, knuckle boom (articulated jib), truck/deck mount

### Crane Overview
The Palfinger PK10000 is a hydraulic knuckle boom loader crane used on deck vessels, supply boats and onshore heavy transport applications. It features a two-section articulated boom (main boom + knuckle/inner boom) driven by double-acting hydraulic cylinders with counterbalance valve protection on all load-holding circuits.

**Note:** Source PDF is scanned image format — specifications below are based on PK10000 series engineering data from Palfinger technical literature and field knowledge. Verify against OEM manual pages for exact serial-specific settings.

### Typical Hydraulic Architecture
- **System type:** Open-loop, load-sensing or fixed-displacement pump
- **Working pressure:** 250–350 bar (system dependent)
- **Relief valve setting:** 350 bar (system relief) | 380–400 bar (overload protection)
- **Hydraulic actuators:** Double-acting cylinders (main lift, knuckle, extension)
- **Control:** Hydraulic pilot joystick or radio remote — proportional DCVs
- **CBV protection:** Counterbalance valves on all cylinder ports — set at 1.3× load-induced pressure

### Main Hydraulic Circuits
**Main Boom Lift (Kolben/Arm Cylinder):**
- Double-acting cylinder, clevis-mounted
- Counterbalance valve (CBV) on rod side — prevents uncontrolled lowering
- CBV pilot ratio: typically 3:1 to 4.5:1
- Load holding: CBV closes on pilot pressure loss → crane holds load

**Knuckle Boom (Inner Jib Cylinder):**
- Double-acting cylinder controlling articulation angle
- CBV on both ports — bidirectional load holding
- Critical: both CBVs must be set correctly to prevent knuckle collapse

**Extension (Telescopic, if fitted):**
- Single or tandem cylinder extending inner boom
- Mechanical lock or CBV depending on series

**Slew (Rotation):**
- Hydraulic motor or ring gear cylinder arrangement
- Crossover relief valves: 270–300 bar to absorb slew shock loads

### Key Pressure Settings (PK10000 series typical)
| Function | Setting |
|---|---|
| System relief | 350 bar |
| Overload protection | 380–400 bar |
| Main boom CBV | 1.3 × max load-induced pressure |
| Knuckle CBV | 1.3 × max load-induced pressure |
| Slew crossover relief | 270–300 bar |
| Pilot supply pressure | 30–40 bar |

### Common Fault Diagnosis
| Fault | Cause | Action |
|---|---|---|
| Boom drifts down slowly | CBV internal leakage or wrong pilot ratio | Replace CBV or check pilot line pressure |
| Knuckle drops suddenly | CBV not opening — pilot line blocked | Check pilot line filter and orifice |
| No boom movement | System pressure low or pump fault | Check system relief, pump output |
| Slow operation | Flow insufficient or control valve restriction | Check pump RPM, DCV spool condition |
| Crane chatters under load | CBV set too low — opens/closes rapidly | Increase CBV setting by 10–15 bar |
| Slew shock/jerk | Crossover relief set too high or too low | Adjust crossover relief to 270–300 bar |
| Oil overheating | Unloading not working or cooler blocked | Check unload valve, clean cooler |

### Maintenance Schedule
- **Daily:** Check oil level, inspect hoses and fittings for leaks, test emergency lowering
- **Weekly:** Check CBV pilot lines, test overload protection
- **Monthly:** Check all pressure settings with calibrated gauge, inspect cylinder seals
- **Annual:** Full hydraulic oil change, filter replacement, CBV bench test

### Safety Features
- Overload protection system (OPS) — prevents lift beyond rated capacity
- Emergency lowering — gravity or hand pump to lower load on power failure
- Slew lock — mechanical or hydraulic slew brake
- DNV/BV class notation available for offshore variants

