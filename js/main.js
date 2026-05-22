/* ================================================================
   HydroMind.AI — main.js v3.0
   Calculator: Cylinder, Pump, Motor, Pressure Drop, Piping, Electrical
   All 6 tabs fully working with ISO/Imperial toggle
   ================================================================ */

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

/* ── Mobile nav scroll hide ── */
let lastY = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const y = window.scrollY;
  nav.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
  lastY = y;
}, { passive: true });

/* ── FAQ accordion ── */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const body = item?.querySelector('.faq-body');
  if (!body) return;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    const b = i.querySelector('.faq-body');
    if (b) b.style.maxHeight = '0';
  });
  if (!open) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

/* ================================================================
   CALCULATOR — 6 modules
   ================================================================ */

const CALC_HEADERS = {
  cylinder: '// Cylinder Calculator — Force · Area · Speed · Volume',
  pump:     '// Pump Calculator — Flow Rate · Power · Torque',
  motor:    '// Motor Calculator — Torque · Speed · Power',
  pdrop:    '// Pressure Drop Calculator — Orifice / Pipe',
  piping:   '// Piping Calculator — Velocity · Reynolds Number',
  elec:     '// Electrical Calculator — Ohm\'s Law · Power · Solenoid · 4-20mA'
};
const CALC_FORMULAS = {
  cylinder: 'F = p × A  |  v = Q / A  |  A = π × d² / 4',
  pump:     'Q = (Vg × n × ηv) / 1000  |  P = p × Q / 600',
  motor:    'T = (Vg × p × ηm) / (20π)  |  n = Q × 1000 / Vg',
  pdrop:    'ΔP = 8μLQ / (π r⁴)  |  v = Q / A',
  piping:   'v = Q / A  |  Re = ρ × v × d / μ',
  elec:     'V = I × R  |  P = V × I × cosφ  |  4-20mA: EU = EUmin + (mA-4)/16 × Range'
};

let calcUnitSystem = 'iso';
let elecMode  = 'ohm';
let elecPhase = 1;
let pumpMode  = 'flow';

/* ── Switch calculator tab ── */
function switchCalc(type, btn) {
  document.querySelectorAll('.calc-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('calc-' + type);
  if (panel) panel.style.display = 'block';
  if (btn)   btn.classList.add('active');
  const hdr = document.getElementById('calcHeader');
  const fml = document.getElementById('calcFormula');
  if (hdr) hdr.textContent = CALC_HEADERS[type] || '';
  if (fml) fml.textContent = CALC_FORMULAS[type] || '';
  resetCalc();
}

function resetCalc() {
  document.querySelectorAll('.calc-input').forEach(i => i.value = '');
  document.querySelectorAll('.calc-result-val').forEach(v => v.textContent = '—');
}

/* ── Unit system toggle ── */
function setCalcUnit(system) {
  calcUnitSystem = system;
  const iso = document.getElementById('unitISO');
  const imp = document.getElementById('unitIMP');
  if (iso) { iso.style.background = system==='iso'?'rgba(0,212,255,.18)':'transparent'; iso.style.color = system==='iso'?'var(--cyan)':'var(--text3)'; }
  if (imp) { imp.style.background = system==='imp'?'rgba(0,212,255,.18)':'transparent'; imp.style.color = system==='imp'?'var(--cyan)':'var(--text3)'; }
  // Update unit labels
  const ISO = { length:'mm', pressure:'bar', flow:'L/min', force:'kN', speed:'mm/s', power:'kW', torque:'Nm', area:'cm²', disp:'cc/rev' };
  const IMP = { length:'in',  pressure:'psi', flow:'gpm',  force:'lbf',speed:'in/s',  power:'HP',  torque:'ft·lb',area:'in²',disp:'in³/rev' };
  const L = system==='iso' ? ISO : IMP;
  const map = [
    ['cyl-bore','length'],['cyl-rod','length'],['cyl-stroke','length'],['cyl-press','pressure'],['cyl-flow','flow'],
    ['pump-press','pressure'],['mot-press','pressure'],['mot-flow','flow'],
    ['pd-flow','flow'],['pd-diam','length'],['pipe-flow','flow'],['pipe-diam','length']
  ];
  map.forEach(([id,type]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const sp = el.closest('.calc-input-wrap')?.querySelector('.calc-unit');
    if (sp) sp.textContent = L[type]||'';
  });
  resetCalc();
}

/* ── Helper functions ── */
function fmt(n, dec=2) {
  if (!isFinite(n)||isNaN(n)) return '—';
  return parseFloat(n.toFixed(dec)).toString();
}
function gv(id) { return parseFloat(document.getElementById(id)?.value)||0; }
function setR(id, val, dec=2) {
  const el = document.getElementById(id);
  if (el) el.textContent = (!isFinite(val)||isNaN(val)||val<=0) ? '—' : fmt(val,dec);
}

/* ── CYLINDER ── */
function calcCylinder() {
  let bore   = gv('cyl-bore');
  let rod    = gv('cyl-rod');
  let stroke = gv('cyl-stroke');
  let press  = gv('cyl-press');
  let flow   = gv('cyl-flow');
  if (calcUnitSystem==='imp') { bore*=25.4; rod*=25.4; stroke*=25.4; press/=14.5038; flow/=0.26417; }
  const Ab = Math.PI*(bore/2)**2/100;
  const Ar = Math.PI*((bore/2)**2-(rod/2)**2)/100;
  const Fext = press*Ab/10;
  const Fret = press*Ar/10;
  const vext = flow ? (flow/Ab)*10 : 0;
  const vret = flow ? (flow/Ar)*10 : 0;
  const Vext = Ab*stroke/1000;
  const Vret = Ar*stroke/1000;
  const Qpump= vext>0 ? flow : 0;
  if (calcUnitSystem==='imp') {
    setR('res-bore-area', Ab*0.155, 3);
    setR('res-rod-area',  Ar*0.155, 3);
    setR('res-ext-force', Fext*224.809, 0);
    setR('res-ret-force', Fret*224.809, 0);
    setR('res-ext-spd',   vext*0.03937, 2);
    setR('res-ret-spd',   vret*0.03937, 2);
    setR('res-ext-vol',   Vext*0.26417, 3);
    setR('res-ret-vol',   Vret*0.26417, 3);
  } else {
    setR('res-bore-area', Ab, 2);
    setR('res-rod-area',  Ar, 2);
    setR('res-ext-force', Fext, 2);
    setR('res-ret-force', Fret, 2);
    setR('res-ext-spd',   vext, 1);
    setR('res-ret-spd',   vret, 1);
    setR('res-ext-vol',   Vext, 3);
    setR('res-ret-vol',   Vret, 3);
  }
}

/* ── PUMP ── */
function setPumpMode(mode, btn) {
  pumpMode = mode;
  document.querySelectorAll('[id^="pump-mode-"]').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function calcPump() {
  const disp   = gv('pump-disp');
  const rpm    = gv('pump-rpm');
  const voleff = gv('pump-voleff')||95;
  const press  = gv('pump-press');
  const mecheff= 90;
  let Q=0, P=0, T=0;
  if (disp>0&&rpm>0) Q = (disp*rpm*(voleff/100))/1000;
  if (Q>0&&press>0)  P = (press*Q)/600;
  if (disp>0&&press>0) T = (disp*press)/(20*Math.PI)/(mecheff/100);
  setR('res-pump-flow',  calcUnitSystem==='imp'?Q*0.26417:Q, 2);
  setR('res-pump-hpow',  calcUnitSystem==='imp'?P*1.34102:P, 2);
  setR('res-pump-ipow',  calcUnitSystem==='imp'?P*1.34102/(mecheff/100):P/(mecheff/100), 2);
  setR('res-pump-torq',  calcUnitSystem==='imp'?T*0.73756:T, 1);
}

/* ── MOTOR ── */
function calcMotor() {
  const disp   = gv('mot-disp');
  const press  = gv('mot-press');
  const flow   = gv('mot-flow');
  const mecheff= gv('mot-meff')||90;
  let p=press, q=flow;
  if (calcUnitSystem==='imp') { p/=14.5038; q/=0.26417; }
  const T = (disp>0&&p>0) ? (disp*p*(mecheff/100))/(20*Math.PI) : 0;
  const n = (disp>0&&q>0) ? (q*1000)/disp : 0;
  const P = (p>0&&q>0) ? (p*q)/600 : 0;
  setR('res-mot-torq', calcUnitSystem==='imp'?T*0.73756:T, 1);
  setR('res-mot-rpm',  n, 0);
  setR('res-mot-pow',  calcUnitSystem==='imp'?P*1.34102:P, 2);
  setR('res-mot-eff',  mecheff, 0);
}

/* ── PRESSURE DROP ── */
function calcPdrop() {
  let flow = gv('pd-flow');
  let diam = gv('pd-diam');
  const len  = gv('pd-len');
  const visc = gv('pd-visc')||46;
  const dens = gv('pd-dens')||870;
  if (calcUnitSystem==='imp') { flow/=0.26417; diam*=25.4; }
  const r   = diam/2000;
  const Q   = flow/60000;
  const v   = r>0 ? Q/(Math.PI*r**2) : 0;
  const mu  = visc/1000000;
  const Re  = (dens*v*(diam/1000))/mu;
  const f   = Re>0&&Re<2300 ? 64/Re : (Re>=2300 ? 0.316/Re**0.25 : 0);
  const dP  = (len>0&&r>0) ? (f*len*(diam/1000)*dens*v**2)/(2*(diam/1000)*100000) : 0;
  setR('res-pd-vel', calcUnitSystem==='imp'?v*3.28084:v, 2);
  setR('res-pd-re',  Re, 0);
  const pdEl = document.getElementById('res-pd-bar');
  if (pdEl) pdEl.textContent = (!isFinite(dP)||isNaN(dP)||dP<=0) ? '—' : (calcUnitSystem==='imp'?fmt(dP*14.5038,2):fmt(dP,3));
  const flowEl = document.getElementById('res-pd-flow');
  if (flowEl) flowEl.textContent = fmt(flow,1);
}

/* ── PIPING ── */
function calcPiping() {
  let flow = gv('pipe-flow');
  let diam = gv('pipe-diam');
  const visc = gv('pipe-visc')||46;
  const dens = gv('pipe-dens')||870;
  if (calcUnitSystem==='imp') { flow/=0.26417; diam*=25.4; }
  const r = diam/2000;
  const Q = flow/60000;
  const A = r>0 ? Math.PI*r**2 : 0;
  const v = A>0 ? Q/A : 0;
  const mu= visc/1000000;
  const Re=(dens*v*(diam/1000))/mu;
  const regime = Re<2300?'Laminar':Re<4000?'Transition':'Turbulent';
  setR('res-pipe-vel',  calcUnitSystem==='imp'?v*3.28084:v, 2);
  setR('res-pipe-area', calcUnitSystem==='imp'?A*1550:A*10000, 1);
  setR('res-pipe-re',   Re, 0);
  const regEl = document.getElementById('res-pipe-regime');
  if (regEl) {
    regEl.textContent = regime;
    regEl.style.color = Re<2300?'#3dd68c':Re<4000?'#f5c842':'#e24b4a';
  }
}

/* ── ELECTRICAL ── */
function setElecMode(mode, btn) {
  elecMode = mode;
  document.querySelectorAll('[id^="elec-mode-"]').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  ['ohm','power','sol','sensor'].forEach(m => {
    const p = document.getElementById('elec-panel-'+m);
    if (p) p.style.display = m===mode?'block':'none';
  });
  // Reset results
  ['elec-r1','elec-r2','elec-r3','elec-r4'].forEach(id=>{
    const el=document.getElementById(id); if(el)el.textContent='—';
  });
  calcElec();
}
function setPhase(n, btn) {
  elecPhase=n;
  document.querySelectorAll('[id^="el-ph"]').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  calcElec();
}
function calcElec() {
  if (elecMode==='ohm') {
    const V=gv('el-volt'), I=gv('el-curr'), R=gv('el-res');
    let cV=V,cI=I,cR=R,cP=0;
    if(V>0&&I>0)      {cR=V/I;     cP=V*I;}
    else if(V>0&&R>0) {cI=V/R;     cP=V*cI;}
    else if(I>0&&R>0) {cV=I*R;     cP=cV*I;}
    setR('elec-r1',cV,2); setR('elec-r2',cI,3); setR('elec-r3',cR,2); setR('elec-r4',cP,2);
  }
  else if (elecMode==='power') {
    const V=gv('el-pvolt'),I=gv('el-pcurr'),pf=gv('el-pf')||1;
    if(V<=0||I<=0) return;
    const factor=elecPhase===3?Math.sqrt(3):1;
    const S=V*I*factor, P=S*Math.min(pf,1);
    setR('elec-r1',P,1); setR('elec-r2',S,1);
    setR('elec-r3',elecPhase===3?S/(Math.sqrt(3)*V):S/V,3);
    setR('elec-r4',Math.min(pf,1),3);
  }
  else if (elecMode==='sol') {
    const V=gv('el-svolt')||24, R=gv('el-sres');
    if(R<=0) return;
    const I=V/R, P=V*I;
    setR('elec-r1',I,3); setR('elec-r2',P,2);
    const sEl=document.getElementById('elec-r3');
    if(sEl){
      let status='— CHECK',col='#f5c842';
      if(R<5)                               {status='⚠ SHORTED'; col='#e24b4a';}
      else if(R>5000)                       {status='✗ OPEN';    col='#e24b4a';}
      else if(R>=20&&R<=40&&V<=30)          {status='✓ OK 24VDC';col='#3dd68c';}
      else if(R>=200&&R<=400&&V>30&&V<=130) {status='✓ OK 110VAC';col='#3dd68c';}
      sEl.textContent=status; sEl.style.color=col; sEl.style.fontSize='.75rem';
    }
    const rEl=document.getElementById('elec-r4');
    if(rEl) rEl.textContent=V<=30?'20–40 Ω':'200–400 Ω';
  }
  else if (elecMode==='sensor') {
    const min=gv('el-smin'), max=gv('el-smax')||400, mA=gv('el-sma');
    if(mA<3.5||mA>20.5||max<=min) return;
    const pct=((mA-4)/16)*100;
    const val=min+((mA-4)/16)*(max-min);
    setR('elec-r1',val,1); setR('elec-r2',Math.max(0,Math.min(100,pct)),1);
    setR('elec-r3',min,0); setR('elec-r4',max,0);
  }
}
