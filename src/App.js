import { useState, useEffect, useRef, useCallback } from "react";

// ── CONSTANTS ──────────────────────────────────────────────
const API = process.env.REACT_APP_BACKEND_URL || "https://hydromind-backend.onrender.com";
const ADMIN_EMAILS = ["arun25hyd@proton.me", "arun25hyd@gmail.com"];
const HM_SESSION  = "hm_session";
const HM_USERS    = "hm_users";
const HM_HISTORY  = "hm_history";

// ── COLORS ─────────────────────────────────────────────────
const C = {
  navy:    "#020b18",
  navy2:   "#041428",
  steel:   "#0a2540",
  blue:    "#0d4f8c",
  cyan:    "#00d4ff",
  gold:    "#c8a550",
  goldY:   "#f5c842",
  white:   "#e8f4ff",
  muted:   "#6b8fa8",
  text2:   "rgba(200,216,232,.65)",
  text3:   "rgba(200,216,232,.38)",
  border:  "rgba(0,212,255,.12)",
  green:   "#3dd68c",
  red:     "#e24b4a",
};

// ── STORAGE HELPERS ────────────────────────────────────────
const getSession  = () => { try { return JSON.parse(localStorage.getItem(HM_SESSION)) || null; } catch { return null; } };
const saveSession = (u) => localStorage.setItem(HM_SESSION, JSON.stringify(u));
const clearSession= () => localStorage.removeItem(HM_SESSION);
const getUsers    = () => { try { return JSON.parse(localStorage.getItem(HM_USERS)) || {}; } catch { return {}; } };
const saveUser    = (e,d) => { const u = getUsers(); u[e] = d; localStorage.setItem(HM_USERS, JSON.stringify(u)); };
const getHistory  = () => { try { return JSON.parse(localStorage.getItem(HM_HISTORY)) || []; } catch { return []; } };
const addHistory  = (title, mode, messages) => {
  const h = getHistory();
  const id = Date.now();
  h.unshift({ id, title: (title||"").slice(0,52), mode, date: new Date().toLocaleDateString(), messages: messages||[] });
  if (h.length > 60) h.pop();
  localStorage.setItem(HM_HISTORY, JSON.stringify(h));
  return id;
};
const updateHistory = (id, messages) => {
  const h = getHistory();
  const e = h.find(x => x.id === id);
  if (e) { e.messages = messages; localStorage.setItem(HM_HISTORY, JSON.stringify(h)); }
};

// ── CALCULATOR HELPERS ─────────────────────────────────────
const fmt = (n, dec=2) => (!isFinite(n)||isNaN(n)||n<=0) ? "—" : parseFloat(n.toFixed(dec)).toString();

// ── CIRCUIT SVG BACKGROUND ─────────────────────────────────
function CircuitBg() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <defs>
          <radialGradient id="cbg" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#001830"/>
            <stop offset="100%" stopColor="#020b18"/>
          </radialGradient>
          <marker id="harr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>
        <rect width="1400" height="900" fill="url(#cbg)"/>
        <rect x="60" y="500" width="90" height="110" rx="4" fill="none" stroke="#00d4ff" strokeWidth="1" opacity=".28"/>
        <rect x="60" y="555" width="90" height="55" fill="rgba(0,212,255,.04)"/>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".3" x="105" y="516" textAnchor="middle">RESERVOIR</text>
        <line x1="105" y1="500" x2="105" y2="420" stroke="#00d4ff" strokeWidth=".8" opacity=".12"/>
        <line x1="105" y1="420" x2="240" y2="420" stroke="#00d4ff" strokeWidth=".8" opacity=".12"/>
        <rect x="210" y="280" width="110" height="40" rx="5" fill="none" stroke="#00d4ff" strokeWidth=".9" opacity=".32"/>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".32" x="265" y="296" textAnchor="middle">ELEC. MOTOR</text>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".22" x="265" y="309" textAnchor="middle">45 kW  1500 rpm</text>
        <circle cx="330" cy="380" r="46" fill="none" stroke="#00d4ff" strokeWidth="1.2" opacity=".45"/>
        <circle cx="330" cy="380" r="40" fill="rgba(0,212,255,.03)"/>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".38" x="330" y="440" textAnchor="middle">PUMP A4VG</text>
        <line x1="376" y1="380" x2="620" y2="380" stroke="#00d4ff" strokeWidth=".8" opacity=".12"/>
        <text fontFamily="monospace" fontSize="9" fill="#f5c842" opacity=".4" x="495" y="370" textAnchor="middle">HP  285 bar</text>
        <rect x="620" y="356" width="118" height="48" rx="4" fill="none" stroke="#00d4ff" strokeWidth="1.1" opacity=".5"/>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".38" x="679" y="418" textAnchor="middle">DCV 4/3 WE6</text>
        <circle cx="900" cy="545" r="46" fill="none" stroke="#00d4ff" strokeWidth="1.2" opacity=".45"/>
        <text fontFamily="monospace" fontSize="9" fill="#00d4ff" opacity=".35" x="900" y="604" textAnchor="middle">MOTOR A6VM</text>
        <rect x="575" y="648" width="50" height="24" rx="3" fill="none" stroke="#00d4ff" strokeWidth=".9" opacity=".38"/>
        <text fontFamily="monospace" fontSize="8" fill="#00d4ff" opacity=".35" x="600" y="640" textAnchor="middle">FILTER</text>
        <rect x="760" y="648" width="62" height="24" rx="4" fill="none" stroke="#00d4ff" strokeWidth=".9" opacity=".38"/>
        <text fontFamily="monospace" fontSize="8" fill="#00d4ff" opacity=".35" x="791" y="640" textAnchor="middle">COOLER</text>
        <text fontFamily="monospace" fontSize="10" fill="#00d4ff" opacity=".06" x="700" y="840" textAnchor="middle" letterSpacing="3">HYDRAULIC CIRCUIT — ISO 1219-1 — HydroMind.AI</text>
      </svg>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────
function Navbar({ user, onLogin, onLogout, currentPage, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "AI Advisor", page: "advisor" },
    { label: "⚙ System Design", page: "design" },
    { label: "Knowledge Base", page: "knowledge" },
    { label: "News", page: "news" },
    { label: "⚡ Electrical", page: "electrical", gold: true },
    { label: "Calculator", page: "calculator" },
    { label: "Pricing", page: "pricing" },
    { label: "Feedback", page: "feedback" },
  ];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(2,11,24,.97)" : "rgba(2,11,24,.85)",
      backdropFilter:"blur(12px)",
      borderBottom:`1px solid ${C.border}`,
      transition:"background .3s",
    }}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:".6rem",cursor:"pointer"}} onClick={() => setPage("home")}>
          <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${C.cyan}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{position:"absolute",inset:3,borderRadius:"50%",border:`1px solid rgba(0,212,255,.3)`}}/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1rem",color:C.cyan}}>H</span>
          </div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:".92rem",color:C.white,letterSpacing:".08em"}}>
              HYDROMIND<span style={{color:C.cyan}}>.AI</span>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".52rem",color:C.text3,letterSpacing:".1em",textTransform:"uppercase"}}>Hydraulic Intelligence</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={{display:"flex",alignItems:"center",gap:".15rem",flexWrap:"wrap"}}>
          {navLinks.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)} style={{
              background:"none",border:"none",cursor:"pointer",padding:"6px 10px",
              fontFamily:"'DM Sans',sans-serif",fontSize:".8rem",
              color: currentPage===l.page ? C.cyan : l.gold ? C.goldY : C.text2,
              borderBottom: currentPage===l.page ? `2px solid ${C.cyan}` : "2px solid transparent",
              transition:"color .2s",
            }}>{l.label}</button>
          ))}
        </div>

        {/* Auth */}
        <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
          {user ? (
            <div style={{display:"flex",alignItems:"center",gap:".5rem",background:"rgba(0,212,255,.06)",border:`1px solid rgba(0,212,255,.15)`,borderRadius:8,padding:"5px 10px",cursor:"pointer"}} onClick={onLogout}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00d4ff,#0050aa)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".78rem",color:"#fff"}}>
                {(user.first||user.email).slice(0,2).toUpperCase()}
              </div>
              <span style={{fontSize:".82rem",color:C.white,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {user.first||user.email.split("@")[0]}
              </span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",padding:"2px 8px",borderRadius:100,background:"rgba(0,212,255,.1)",color:C.cyan}}>{user.plan}</span>
            </div>
          ) : (
            <>
              <button onClick={() => onLogin("login")} style={{background:"none",border:`1px solid rgba(0,212,255,.3)`,borderRadius:6,padding:"7px 16px",color:C.cyan,fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",cursor:"pointer"}}>Login</button>
              <button onClick={() => onLogin("register")} style={{background:"linear-gradient(135deg,#00d4ff,#0070cc)",border:"none",borderRadius:6,padding:"7px 16px",color:"#000",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".82rem",cursor:"pointer"}}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── AUTH MODAL ─────────────────────────────────────────────
function AuthModal({ tab: initialTab, onClose, onSuccess }) {
  const [tab, setTab] = useState(initialTab || "login");
  const [error, setError] = useState("");
  const [forgotOk, setForgotOk] = useState("");
  const [form, setForm] = useState({ email:"", pass:"", first:"", last:"", plan:"Free", forgotEmail:"" });

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const doLogin = () => {
    if (!form.email || !form.pass) { setError("Please fill in both fields."); return; }
    const users = getUsers();
    const email = form.email.trim().toLowerCase();
    if (!users[email]) { setError("No account found. Please register first."); return; }
    if (users[email].pass !== btoa(unescape(encodeURIComponent(form.pass)))) { setError("Incorrect password."); return; }
    const user = { ...users[email], email };
    saveSession(user);
    onSuccess(user);
  };

  const doRegister = () => {
    if (!form.first || !form.email || !form.pass) { setError("Please fill in all required fields."); return; }
    if (form.pass.length < 6) { setError("Password must be at least 6 characters."); return; }
    const email = form.email.trim().toLowerCase();
    const users = getUsers();
    if (users[email]) { setError("Account already exists. Please login."); return; }
    const isAdmin = ADMIN_EMAILS.includes(email);
    const plan = isAdmin ? "Admin" : form.plan;
    const data = { first:form.first, last:form.last, email, pass:btoa(unescape(encodeURIComponent(form.pass))), plan, isAdmin, joined:new Date().toLocaleDateString() };
    saveUser(email, data);
    const user = { ...data };
    saveSession(user);
    onSuccess(user);
  };

  const doForgot = () => {
    const email = form.forgotEmail.trim().toLowerCase();
    if (!email) { setError("Please enter your email."); return; }
    const users = getUsers();
    setForgotOk(users[email] ? "✅ Reset link sent — check your inbox." : "⚠️ No account found with this email.");
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(1,6,16,.92)",backdropFilter:"blur(12px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{background:"rgba(6,18,40,.98)",border:`1px solid rgba(0,212,255,.22)`,borderRadius:16,width:"100%",maxWidth:420,margin:"0 1.25rem",overflow:"hidden"}}>
        {/* Tabs */}
        <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.border}`,padding:"0 1rem"}}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex:1,background:"none",border:"none",borderBottom:`2px solid ${tab===t?C.cyan:"transparent"}`,
              padding:"14px 0",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".88rem",
              color:tab===t?C.cyan:"rgba(200,216,232,.35)",cursor:"pointer",textTransform:"capitalize",transition:".2s"
            }}>{t}</button>
          ))}
          <button onClick={onClose} style={{background:"none",border:"none",color:C.text3,fontSize:"1.3rem",cursor:"pointer",padding:"0 .5rem"}}>×</button>
        </div>

        <div style={{padding:"1.5rem"}}>
          {error && <div style={{background:"rgba(226,75,74,.08)",border:"1px solid rgba(226,75,74,.25)",borderRadius:7,padding:".7rem 1rem",fontSize:".82rem",color:C.red,marginBottom:".9rem"}}>{error}</div>}

          {tab === "login" && (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:C.white,marginBottom:".25rem"}}>Welcome Back</div>
              <div style={{fontSize:".82rem",color:C.text2,marginBottom:"1.25rem"}}>Sign in to your HydroMind.AI account</div>
              <AuthField label="Email Address" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="your@email.com"/>
              <AuthField label="Password" type="password" value={form.pass} onChange={v=>set("pass",v)} placeholder="Your password" onEnter={doLogin}/>
              <button onClick={() => { setTab("forgot"); setError(""); }} style={{background:"none",border:"none",color:C.cyan,fontSize:".8rem",cursor:"pointer",marginBottom:"1rem",padding:0}}>Forgot password?</button>
              <AuthBtn label="Sign In" onClick={doLogin}/>
              <div style={{textAlign:"center",fontSize:".82rem",color:C.text3,marginTop:".75rem"}}>No account? <button onClick={() => setTab("register")} style={{background:"none",border:"none",color:C.cyan,cursor:"pointer",fontSize:".82rem"}}>Register free</button></div>
            </>
          )}

          {tab === "register" && (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:C.white,marginBottom:".25rem"}}>Create Account</div>
              <div style={{fontSize:".82rem",color:C.text2,marginBottom:"1.25rem"}}>14-day free trial — no card required</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
                <AuthField label="First Name *" value={form.first} onChange={v=>set("first",v)} placeholder="Arun"/>
                <AuthField label="Last Name" value={form.last} onChange={v=>set("last",v)} placeholder="Tiwari"/>
              </div>
              <AuthField label="Work Email *" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="your@email.com"/>
              <AuthField label="Password * (min 6)" type="password" value={form.pass} onChange={v=>set("pass",v)} placeholder="Min 6 characters" onEnter={doRegister}/>
              <div style={{marginBottom:"1rem"}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".63rem",textTransform:"uppercase",letterSpacing:".07em",color:C.text3,display:"block",marginBottom:5}}>Select Plan</label>
                <select value={form.plan} onChange={e=>set("plan",e.target.value)} style={{width:"100%",background:"rgba(2,10,22,.85)",border:`1px solid rgba(0,212,255,.16)`,borderRadius:8,padding:"10px 13px",fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",color:C.white,outline:"none",cursor:"pointer"}}>
                  <option value="Free">Free — Basic access</option>
                  <option value="Basic">Basic — $29/month</option>
                  <option value="Pro">Pro — $79/month</option>
                  <option value="Enterprise">Enterprise — $199/month</option>
                </select>
              </div>
              <AuthBtn label="Create Account" onClick={doRegister}/>
              <div style={{textAlign:"center",fontSize:".82rem",color:C.text3,marginTop:".75rem"}}>Have an account? <button onClick={() => setTab("login")} style={{background:"none",border:"none",color:C.cyan,cursor:"pointer",fontSize:".82rem"}}>Sign in</button></div>
            </>
          )}

          {tab === "forgot" && (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:C.white,marginBottom:".25rem"}}>Reset Password</div>
              <div style={{fontSize:".82rem",color:C.text2,marginBottom:"1.25rem"}}>Enter your registered email address</div>
              <AuthField label="Registered Email" type="email" value={form.forgotEmail} onChange={v=>set("forgotEmail",v)} placeholder="your@email.com"/>
              {forgotOk && <div style={{background:"rgba(61,214,140,.07)",border:"1px solid rgba(61,214,140,.2)",borderRadius:7,padding:".7rem 1rem",fontSize:".82rem",color:C.green,marginBottom:".9rem"}}>{forgotOk}</div>}
              <AuthBtn label="Send Reset Link" onClick={doForgot} cyan/>
              <div style={{textAlign:"center",marginTop:".75rem"}}><button onClick={() => setTab("login")} style={{background:"none",border:"none",color:C.cyan,cursor:"pointer",fontSize:".82rem"}}>← Back to Login</button></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, type="text", value, onChange, placeholder, onEnter }) {
  return (
    <div style={{marginBottom:".9rem"}}>
      <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".63rem",textTransform:"uppercase",letterSpacing:".07em",color:C.text3,display:"block",marginBottom:5}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onKeyDown={e => e.key==="Enter" && onEnter && onEnter()}
        style={{width:"100%",background:"rgba(2,10,22,.85)",border:`1px solid rgba(0,212,255,.16)`,borderRadius:8,padding:"10px 13px",fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",color:C.white,outline:"none",boxSizing:"border-box"}}/>
    </div>
  );
}

function AuthBtn({ label, onClick, cyan }) {
  return (
    <button onClick={onClick} style={{width:"100%",background:cyan?"linear-gradient(135deg,#00d4ff,#0090cc)":"linear-gradient(135deg,#00d4ff,#0070cc)",border:"none",borderRadius:8,padding:12,color:"#000",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".92rem",cursor:"pointer"}}>
      {label}
    </button>
  );
}

// ── LEFT SIDEBAR ───────────────────────────────────────────
function LeftSidebar({ user, onLogin, onLogout, setPage }) {
  const history = getHistory();
  const modeIcons = { hyd:"⚙️", elec:"⚡", crane:"🏗️", fluid:"🛢️", calc:"📐" };

  return (
    <div style={{width:200,minWidth:200,background:"rgba(4,14,32,.92)",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:".75rem",height:"100vh",position:"sticky",top:60,overflowY:"auto"}}>
      {user ? (
        <>
          <div style={{background:"rgba(0,212,255,.04)",border:`1px solid rgba(0,212,255,.12)`,borderRadius:10,padding:".85rem",marginBottom:".75rem",position:"relative"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#00d4ff,#0050aa)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".9rem",color:"#fff",marginBottom:".4rem"}}>
              {(user.first||user.email).slice(0,2).toUpperCase()}
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".88rem",color:C.white}}>{[user.first,user.last].filter(Boolean).join(" ")||user.email.split("@")[0]}</div>
            <div style={{fontSize:".72rem",color:C.text3,marginBottom:".35rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",padding:"2px 8px",borderRadius:100,background:user.isAdmin?"rgba(245,200,66,.12)":"rgba(0,212,255,.08)",color:user.isAdmin?C.goldY:C.cyan}}>{user.plan}</span>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".08em",color:C.text3,marginBottom:".4rem"}}>Chat History</div>
          {history.length === 0
            ? <div style={{fontSize:".72rem",color:C.text3,textAlign:"center",padding:".75rem"}}>No history yet</div>
            : history.slice(0,10).map(h => (
              <div key={h.id} style={{display:"flex",alignItems:"center",gap:".4rem",padding:".45rem .5rem",borderRadius:6,cursor:"pointer",marginBottom:2,transition:".15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:".8rem"}}>{modeIcons[h.mode]||"💬"}</span>
                <span style={{fontSize:".72rem",color:C.text2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title}</span>
              </div>
            ))
          }
          <div style={{marginTop:".75rem"}}>
            <SidebarLink label="AI Advisor" icon="🤖" onClick={() => setPage("advisor")}/>
            <SidebarLink label="Knowledge Base" icon="📚" onClick={() => setPage("knowledge")}/>
            <SidebarLink label="Industry News" icon="📰" onClick={() => setPage("news")}/>
            <SidebarLink label="Upgrade Plan" icon="💳" onClick={() => setPage("pricing")}/>
          </div>
          <div style={{marginTop:"auto",paddingTop:".75rem"}}>
            <button onClick={onLogout} style={{width:"100%",background:"rgba(226,75,74,.08)",border:"1px solid rgba(226,75,74,.2)",borderRadius:7,padding:"8px",color:C.red,fontFamily:"'DM Sans',sans-serif",fontSize:".8rem",cursor:"pointer"}}>Sign Out</button>
          </div>
        </>
      ) : (
        <>
          <div style={{marginBottom:".75rem"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".08em",color:C.text3,marginBottom:".5rem"}}>Quick Links</div>
            <SidebarLink label="AI Advisor" icon="🤖" onClick={() => setPage("advisor")}/>
            <SidebarLink label="Knowledge Base" icon="📚" onClick={() => setPage("knowledge")}/>
            <SidebarLink label="Industry News" icon="📰" onClick={() => setPage("news")}/>
            <SidebarLink label="Upgrade Plan" icon="💳" onClick={() => setPage("pricing")}/>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".58rem",textTransform:"uppercase",letterSpacing:".1em",color:C.text3,paddingBottom:".45rem",borderBottom:`1px solid ${C.border}`,marginBottom:".5rem"}}>Sponsored</div>
          <div style={{background:"rgba(200,165,80,.03)",border:"1px dashed rgba(200,165,80,.12)",borderRadius:6,minHeight:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",color:C.text3,fontFamily:"'JetBrains Mono',monospace",fontSize:".58rem",textTransform:"uppercase",letterSpacing:".04em",marginBottom:".5rem"}}>
            <div style={{fontSize:".9rem",opacity:.22,marginBottom:4}}>📢</div>Advertisement
          </div>
          <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:".5rem"}}>
            <button onClick={() => onLogin("login")} style={{background:"none",border:`1px solid rgba(0,212,255,.3)`,borderRadius:6,padding:"8px",color:C.cyan,fontFamily:"'DM Sans',sans-serif",fontSize:".8rem",cursor:"pointer"}}>Login</button>
            <button onClick={() => onLogin("register")} style={{background:"linear-gradient(135deg,#00d4ff,#0070cc)",border:"none",borderRadius:6,padding:"8px",color:"#000",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".8rem",cursor:"pointer"}}>Register Free</button>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarLink({ label, icon, onClick }) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:".4rem",padding:".45rem .5rem",borderRadius:6,cursor:"pointer",marginBottom:2,transition:".15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,.06)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <span style={{fontSize:".8rem"}}>{icon}</span>
      <span style={{fontSize:".78rem",color:C.text2}}>{label}</span>
    </div>
  );
}

// ── RIGHT AD SIDEBAR ───────────────────────────────────────
function RightSidebar({ user }) {
  const isPaid = user && (user.isAdmin || user.plan === "Pro" || user.plan === "Enterprise");
  if (isPaid) {
    return (
      <div style={{width:200,minWidth:200,background:"rgba(4,14,32,.92)",borderLeft:`1px solid ${C.border}`,padding:".75rem",height:"100vh",position:"sticky",top:60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"rgba(61,214,140,.06)",border:"1px solid rgba(61,214,140,.2)",borderRadius:8,padding:".75rem",textAlign:"center"}}>
          <div style={{fontSize:"1.2rem"}}>🎉</div>
          <p style={{fontSize:".68rem",color:C.green,margin:".25rem 0 0",lineHeight:1.4}}>Ad-free<br/>{user.plan}</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{width:200,minWidth:200,background:"rgba(4,14,32,.92)",borderLeft:`1px solid ${C.border}`,padding:".75rem",height:"100vh",position:"sticky",top:60,overflowY:"auto",display:"flex",flexDirection:"column",gap:".55rem"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".58rem",textTransform:"uppercase",letterSpacing:".1em",color:C.text3,paddingBottom:".5rem",borderBottom:`1px solid ${C.border}`}}>Sponsored</div>
      <AdBlock height={195} label="Advertisement" size="200×195"/>
      <div style={{background:"rgba(0,212,255,.04)",border:`1px solid rgba(0,212,255,.11)`,borderRadius:6,padding:".65rem .6rem",textAlign:"center"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".56rem",color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>Partner</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:".9rem",fontWeight:700,color:C.cyan,margin:".15rem 0 .2rem"}}>Your Brand</div>
        <div style={{fontSize:".65rem",color:C.text2,lineHeight:1.4}}>Reach hydraulic engineers worldwide.</div>
      </div>
      <AdBlock height={110} label="Banner Ad" size="200×110"/>
      <AdBlock height={62} label="Link Ad"/>
      <div style={{marginTop:"auto",paddingTop:".55rem",borderTop:`1px solid ${C.border}`,textAlign:"center"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".57rem",color:"rgba(0,212,255,.4)",textTransform:"uppercase",letterSpacing:".05em",cursor:"pointer"}}>Advertise here →</span>
      </div>
    </div>
  );
}

function AdBlock({ height, label, size }) {
  return (
    <div style={{background:"rgba(0,212,255,.03)",border:"1px dashed rgba(0,212,255,.14)",borderRadius:6,height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",color:C.text3,fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".04em"}}>
      <div style={{fontSize:".9rem",opacity:.22,marginBottom:4}}>📢</div>
      {label}{size && <><br/>{size}</>}
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────
function HomePage({ onLogin, setPage }) {
  return (
    <div>
      {/* Hero */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",padding:"100px 2rem 80px",textAlign:"center",overflow:"hidden"}}>
        <div style={{position:"relative",zIndex:2,maxWidth:780,margin:"0 auto"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".82rem",color:C.goldY,letterSpacing:".12em",marginBottom:"1.4rem"}}>
            ✦ AI-POWERED HYDRAULIC INTELLIGENCE PLATFORM ✦
          </div>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(2.2rem,7vw,4.5rem)",fontWeight:800,lineHeight:1.05,color:C.white,marginBottom:"1.4rem"}}>
            AI Intelligence for<br/><span style={{color:C.cyan}}>Hydraulic Systems</span>
          </h1>
          <p style={{fontSize:"1.05rem",color:C.text2,maxWidth:560,margin:"0 auto 2.5rem",lineHeight:1.85}}>
            Expert AI advisor for hydraulic systems, offshore cranes, and HPUs — backed by 33+ indexed OEM manuals and real offshore field cases.
          </p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"3rem"}}>
            <button onClick={() => setPage("advisor")} style={{background:"linear-gradient(135deg,#00d4ff,#0070cc)",border:"none",borderRadius:8,padding:"14px 36px",fontSize:"1rem",color:"#000",fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer"}}>Start Free Trial</button>
            <button onClick={() => setPage("knowledge")} style={{background:"none",border:`1px solid rgba(0,212,255,.4)`,borderRadius:8,padding:"14px 32px",fontSize:"1rem",color:C.cyan,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>Knowledge Base</button>
          </div>
          {/* Social proof */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".85rem",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center"}}>
              {["AT","MR","SK","JA"].map((i,idx) => (
                <div key={i} style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${["#c026d3,#9333ea","#00d4ff,#0050aa","#3dd68c,#0a7a44","#f5c842,#c17d0a"][idx]})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".82rem",color:idx===3?"#000":"#fff",border:`2px solid ${C.navy}`,marginRight:idx<3?-7:0,zIndex:5-idx}}>
                  {i}
                </div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:700,color:C.white}}>1,200+ Engineers</div>
              <div style={{fontSize:".75rem",color:"rgba(200,216,232,.45)"}}>using HydroMind.AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{background:"rgba(4,14,32,.92)",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"1.75rem 0"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 2rem",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",textAlign:"center"}}>
          {[["33+","OEM Manuals"],["KB33","Knowledge Base"],["24/7","AI Available"],["v2.0","Latest Version"]].map(([val,lbl]) => (
            <div key={lbl}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:800,color:C.cyan}}>{val}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:C.text3}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Electrical Section */}
      <section style={{padding:"5rem 2rem",background:"rgba(3,10,24,.6)"}} id="electrical">
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",maxWidth:620,margin:"0 auto 3rem"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",textTransform:"uppercase",letterSpacing:".12em",color:C.goldY,marginBottom:".75rem"}}>⚡ Electrical &amp; PLC Intelligence</div>
            <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(1.4rem,4vw,2.2rem)",fontWeight:800,color:C.white}}>Electrical · PLC · Sensor · VFD<br/><span style={{color:C.goldY}}>Fault Diagnosis</span></h2>
            <p style={{color:C.text2,marginTop:"1rem"}}>HydroMind covers the full electrical and PLC interface of hydraulic systems — solenoids, sensors, drives, and fieldbus networks.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.25rem"}}>
            {[
              {icon:"💻",title:"PLC Fault Codes",desc:"Siemens S7-300/400/1200, Allen Bradley ControlLogix, Omron CJ/CS. Fault code lookup, I/O diagnostics, ladder logic guidance."},
              {icon:"⚡",title:"Solenoid Diagnostics",desc:"Coil resistance testing (20–40Ω for 24VDC), current draw measurement, manual override, wiring verification."},
              {icon:"📈",title:"Pressure & Flow Sensors",desc:"4–20mA and 0–10V transducer calibration, zero/span adjustment, wiring checks, fault isolation."},
              {icon:"⚙️",title:"VFD / Inverter Faults",desc:"Danfoss FC, ABB ACS, Siemens SINAMICS fault codes. Overcurrent, overvoltage, earth fault diagnosis."},
              {icon:"🔗",title:"CAN Bus & Fieldbus",desc:"CANopen, Profibus, Modbus RTU/TCP diagnostics. Node fault isolation, communication timeout troubleshooting."},
              {icon:"📄",title:"Upload Electrical Manuals",desc:"Upload PLC programs, electrical schematics, or VFD manuals and ask HydroMind AI to reference them in answers."},
            ].map(({icon,title,desc}) => (
              <div key={title} style={{background:"rgba(5,15,35,.8)",border:"1px solid rgba(245,200,66,.15)",borderRadius:12,padding:"1.5rem",cursor:"pointer",transition:".2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,200,66,.4)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(245,200,66,.15)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{width:42,height:42,borderRadius:10,background:"rgba(245,200,66,.08)",border:"1px solid rgba(245,200,66,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:"1rem"}}>{icon}</div>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.1rem",color:C.white,marginBottom:".5rem"}}>{title}</h3>
                <p style={{fontSize:".84rem",color:C.text2,lineHeight:1.6,marginBottom:"1rem"}}>{desc}</p>
                <button onClick={() => setPage("advisor")} style={{background:"none",border:"none",color:C.goldY,fontSize:".82rem",cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>Ask AI →</button>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"2.5rem"}}>
            <button onClick={() => setPage("advisor")} style={{background:"linear-gradient(135deg,#c49000,#f5c842)",border:"none",borderRadius:8,padding:"13px 32px",color:"#000",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"1rem",cursor:"pointer"}}>⚡ Open Electrical/PLC Advisor</button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section style={{padding:"5rem 2rem"}} id="calculator">
        <div style={{maxWidth:950,margin:"0 auto"}}>
          <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 2.5rem"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",textTransform:"uppercase",letterSpacing:".12em",color:C.cyan,marginBottom:".75rem"}}>📐 Engineering Calculator</div>
            <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(1.4rem,4vw,2.2rem)",fontWeight:800,color:C.white}}>Hydraulic &amp; Electrical<br/><span style={{color:C.cyan}}>Engineering Calculator</span></h2>
          </div>
          <Calculator/>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:"rgba(2,8,18,.98)",borderTop:`1px solid ${C.border}`,padding:"3rem 2rem 1.5rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"2rem",marginBottom:"2rem",flexWrap:"wrap"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".75rem"}}>
                <div style={{width:30,height:30,borderRadius:"50%",border:`2px solid ${C.cyan}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:".9rem",color:C.cyan}}>H</span>
                </div>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:".92rem",color:C.white}}>HYDROMIND<span style={{color:C.cyan}}>.AI</span></span>
              </div>
              <p style={{fontSize:".84rem",color:C.text2,lineHeight:1.6}}>AI-powered hydraulic intelligence for offshore crane supervisors and hydraulic technicians.</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(61,214,140,.06)",border:"1px solid rgba(61,214,140,.2)",borderRadius:100,padding:"4px 12px",marginTop:".75rem"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block"}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:C.green}}>AI Online — KB v2.0</span>
              </div>
            </div>
            {[
              {h:"Platform",links:[["AI Advisor","advisor"],["Knowledge Base","knowledge"],["Industry News","news"],["Calculator","calculator"]]},
              {h:"Company",links:[["Pricing","pricing"],["Feedback","feedback"],["Privacy Policy","privacy"],["Disclaimer","disclaimer"]]},
              {h:"Contact",links:[["arun25hyd@gmail.com",""],["Abu Dhabi, UAE",""]]}
            ].map(({h,links}) => (
              <div key={h}>
                <h5 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".92rem",color:C.white,marginBottom:".75rem",letterSpacing:".05em"}}>{h}</h5>
                <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
                  {links.map(([l]) => <span key={l} style={{fontSize:".84rem",color:C.text2,cursor:"pointer",transition:".15s"}}>{l}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"1.25rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
            <span style={{fontSize:".8rem",color:C.text3}}>© 2026 HydroMind.AI — All rights reserved</span>
            <div style={{display:"flex",gap:"1rem"}}>
              {["Privacy Policy","Disclaimer"].map(l => <span key={l} style={{fontSize:".8rem",color:C.text3,cursor:"pointer"}}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── CALCULATOR ─────────────────────────────────────────────
function Calculator() {
  const [activeTab, setActiveTab] = useState("cylinder");
  const [unit, setUnit] = useState("iso");
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [elecMode, setElecMode] = useState("ohm");
  const [elecPhase, setElecPhase] = useState(1);

  const set = (k,v) => setInputs(p => ({...p,[k]:v}));
  const gv = (k) => parseFloat(inputs[k])||0;
  const setR = (obj) => setResults(p => ({...p,...obj}));

  const tabs = [
    {id:"cylinder",label:"⚙ Cylinder"},
    {id:"pump",label:"⚙ Pump"},
    {id:"motor",label:"⚙ Motor"},
    {id:"pdrop",label:"⚙ Pressure Drop"},
    {id:"piping",label:"⚙ Piping"},
    {id:"elec",label:"⚡ Electrical",gold:true},
  ];

  const headers = {
    cylinder:"// Cylinder Calculator — Force · Area · Speed · Volume",
    pump:"// Pump Calculator — Flow Rate · Power · Torque",
    motor:"// Motor Calculator — Torque · Speed · Power",
    pdrop:"// Pressure Drop Calculator — Pipe",
    piping:"// Piping Calculator — Velocity · Reynolds",
    elec:"// Electrical Calculator — Ohm's Law · Power · Solenoid · 4-20mA",
  };

  const calc = useCallback(() => {
    if (activeTab === "cylinder") {
      let bore=gv("c_bore"), rod=gv("c_rod"), stroke=gv("c_stroke"), press=gv("c_press"), flow=gv("c_flow");
      if(unit==="imp"){bore*=25.4;rod*=25.4;stroke*=25.4;press/=14.5038;flow/=0.26417;}
      const Ab=Math.PI*(bore/2)**2/100, Ar=Math.PI*((bore/2)**2-(rod/2)**2)/100;
      const Fext=press*Ab/10, Fret=press*Ar/10;
      const vext=flow&&Ab?(flow/Ab)*10:0, vret=flow&&Ar?(flow/Ar)*10:0;
      const Vext=Ab*stroke/1000, Vret=Ar*stroke/1000;
      if(unit==="imp") setR({boreArea:fmt(Ab*0.155,3),rodArea:fmt(Ar*0.155,3),extForce:fmt(Fext*224.809,0),retForce:fmt(Fret*224.809,0),extSpd:fmt(vext*0.03937,2),retSpd:fmt(vret*0.03937,2),extVol:fmt(Vext*0.26417,3),retVol:fmt(Vret*0.26417,3)});
      else setR({boreArea:fmt(Ab,2),rodArea:fmt(Ar,2),extForce:fmt(Fext,2),retForce:fmt(Fret,2),extSpd:fmt(vext,1),retSpd:fmt(vret,1),extVol:fmt(Vext,3),retVol:fmt(Vret,3)});
    } else if (activeTab === "pump") {
      const disp=gv("p_disp"),rpm=gv("p_rpm"),voleff=(gv("p_voleff")||95),press=gv("p_press"),meff=90;
      const Q=(disp>0&&rpm>0)?(disp*rpm*(voleff/100))/1000:0;
      const P=(Q>0&&press>0)?(press*Q)/600:0;
      const T=(disp>0&&press>0)?(disp*press)/(20*Math.PI)/(meff/100):0;
      setR({pumpFlow:fmt(unit==="imp"?Q*0.26417:Q,2),pumpHpow:fmt(unit==="imp"?P*1.34102:P,2),pumpIpow:fmt(unit==="imp"?P*1.34102/(meff/100):P/(meff/100),2),pumpTorq:fmt(unit==="imp"?T*0.73756:T,1)});
    } else if (activeTab === "motor") {
      let p=gv("m_press"),q=gv("m_flow");
      const disp=gv("m_disp"),meff=(gv("m_meff")||90);
      if(unit==="imp"){p/=14.5038;q/=0.26417;}
      const T=(disp>0&&p>0)?(disp*p*(meff/100))/(20*Math.PI):0;
      const n=(disp>0&&q>0)?(q*1000)/disp:0;
      const P=(p>0&&q>0)?(p*q)/600:0;
      setR({motTorq:fmt(unit==="imp"?T*0.73756:T,1),motRpm:fmt(n,0),motPow:fmt(unit==="imp"?P*1.34102:P,2),motEff:fmt(meff,0)});
    } else if (activeTab === "pdrop") {
      let flow=gv("pd_flow"),diam=gv("pd_diam");
      const len=gv("pd_len"),visc=(gv("pd_visc")||46),dens=(gv("pd_dens")||870);
      if(unit==="imp"){flow/=0.26417;diam*=25.4;}
      const r=diam/2000,Q=flow/60000;
      const v=r>0?Q/(Math.PI*r**2):0;
      const mu=visc/1000000,Re=(dens*v*(diam/1000))/mu;
      const f=Re>0&&Re<2300?64/Re:Re>=2300?0.316/Re**0.25:0;
      const dP=(len>0&&r>0)?(f*len*(diam/1000)*dens*v**2)/(2*(diam/1000)*100000):0;
      setR({pdVel:fmt(unit==="imp"?v*3.28084:v,2),pdRe:fmt(Re,0),pdBar:fmt(unit==="imp"?dP*14.5038:dP,3),pdFlow:fmt(flow,1)});
    } else if (activeTab === "piping") {
      let flow=gv("pp_flow"),diam=gv("pp_diam");
      const visc=(gv("pp_visc")||46),dens=(gv("pp_dens")||870);
      if(unit==="imp"){flow/=0.26417;diam*=25.4;}
      const r=diam/2000,Q=flow/60000,A=r>0?Math.PI*r**2:0;
      const v=A>0?Q/A:0,mu=visc/1000000;
      const Re=(dens*v*(diam/1000))/mu;
      const regime=Re<2300?"Laminar":Re<4000?"Transition":"Turbulent";
      setR({ppVel:fmt(unit==="imp"?v*3.28084:v,2),ppArea:fmt(unit==="imp"?A*1550:A*10000,1),ppRe:fmt(Re,0),ppRegime:regime,ppRegimeColor:Re<2300?C.green:Re<4000?C.goldY:C.red});
    } else if (activeTab === "elec") {
      if(elecMode==="ohm"){
        const V=gv("el_volt"),I=gv("el_curr"),R=gv("el_res");
        let cV=V,cI=I,cR=R;
        if(V>0&&I>0){cR=V/I;}else if(V>0&&R>0){cI=V/R;}else if(I>0&&R>0){cV=I*R;}
        const cP=cV*cI;
        setR({elR1:fmt(cV,2),elR2:fmt(cI,3),elR3:fmt(cR,2),elR4:fmt(cP,2)});
      } else if(elecMode==="power"){
        const V=gv("el_pvolt"),I=gv("el_pcurr"),pf=(gv("el_pf")||1);
        if(V>0&&I>0){const f=elecPhase===3?Math.sqrt(3):1,S=V*I*f,P=S*Math.min(pf,1);setR({elR1:fmt(P,1),elR2:fmt(S,1),elR3:fmt(elecPhase===3?S/(Math.sqrt(3)*V):S/V,3),elR4:fmt(Math.min(pf,1),3)});}
      } else if(elecMode==="sol"){
        const V=(gv("el_svolt")||24),R=gv("el_sres");
        if(R>0){const I=V/R,P=V*I;let status="— CHECK",col=C.goldY;
          if(R<5){status="⚠ SHORTED";col=C.red;}else if(R>5000){status="✗ OPEN";col=C.red;}else if(R>=20&&R<=40&&V<=30){status="✓ OK 24VDC";col=C.green;}else if(R>=200&&R<=400&&V>30&&V<=130){status="✓ OK 110VAC";col=C.green;}
          setR({elR1:fmt(I,3),elR2:fmt(P,2),elSolStatus:status,elSolColor:col,elSolRange:V<=30?"20–40 Ω":"200–400 Ω"});}
      } else if(elecMode==="sensor"){
        const min=gv("el_smin"),max=(gv("el_smax")||400),mA=gv("el_sma");
        if(mA>=4&&mA<=20&&max>min){const pct=((mA-4)/16)*100,val=min+((mA-4)/16)*(max-min);setR({elR1:fmt(val,1),elR2:fmt(pct,1),elR3:fmt(min,0),elR4:fmt(max,0)});}
      }
    }
  }, [activeTab, inputs, unit, elecMode, elecPhase]);

  useEffect(() => { calc(); }, [calc]);

  const iStyle = {width:"100%",background:"rgba(2,10,22,.85)",border:`1px solid rgba(0,212,255,.16)`,borderRadius:8,padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:".85rem",color:C.white,outline:"none",boxSizing:"border-box"};
  const lStyle = {fontFamily:"'JetBrains Mono',monospace",fontSize:".63rem",textTransform:"uppercase",letterSpacing:".07em",color:C.text3,display:"block",marginBottom:4};
  const rCard = (label, val, unit2) => (
    <div key={label} style={{background:"rgba(0,212,255,.04)",border:`1px solid rgba(0,212,255,.1)`,borderRadius:8,padding:".75rem",textAlign:"center"}}>
      <div style={{fontSize:".68rem",color:C.text3,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.4rem",color:C.cyan}}>{val||"—"}</div>
      <div style={{fontSize:".65rem",color:C.text3}}>{unit2}</div>
    </div>
  );

  return (
    <div style={{background:"rgba(5,15,35,.95)",border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"rgba(3,10,24,.98)",borderBottom:`1px solid ${C.border}`,padding:".85rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".6rem"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",textTransform:"uppercase",letterSpacing:".1em",color:C.cyan}}>{headers[activeTab]}</span>
        <div style={{display:"flex",gap:".5rem"}}>
          <div style={{display:"flex",background:"rgba(0,212,255,.06)",border:`1px solid rgba(0,212,255,.18)`,borderRadius:6,overflow:"hidden"}}>
            {["iso","imp"].map(u => (
              <button key={u} onClick={() => {setUnit(u);setInputs({});setResults({});}} style={{padding:"4px 13px",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",border:"none",cursor:"pointer",transition:".2s",background:unit===u?"rgba(0,212,255,.15)":"transparent",color:unit===u?C.cyan:C.text3}}>{u.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => {setInputs({});setResults({});}} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",color:C.text3,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 12px",cursor:"pointer"}}>Reset</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:".5rem",padding:".75rem 1.5rem",flexWrap:"wrap",borderBottom:`1px solid ${C.border}`}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => {setActiveTab(t.id);setInputs({});setResults({});}} style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${activeTab===t.id?(t.gold?"rgba(245,200,66,.5)":"rgba(0,212,255,.4)"):C.border}`,background:activeTab===t.id?(t.gold?"rgba(245,200,66,.08)":"rgba(0,212,255,.08)"):"transparent",color:activeTab===t.id?(t.gold?C.goldY:C.cyan):C.text2,fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",cursor:"pointer",transition:".2s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div style={{padding:"1.5rem"}}>
        {activeTab === "cylinder" && (
          <>
            <CalcRow>
              <CalcField><label style={lStyle}>Bore Diameter (mm)</label><input style={iStyle} type="number" placeholder="0" value={inputs.c_bore||""} onChange={e=>set("c_bore",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Rod Diameter (mm)</label><input style={iStyle} type="number" placeholder="0" value={inputs.c_rod||""} onChange={e=>set("c_rod",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Stroke (mm)</label><input style={iStyle} type="number" placeholder="0" value={inputs.c_stroke||""} onChange={e=>set("c_stroke",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Working Pressure (bar)</label><input style={iStyle} type="number" placeholder="0" value={inputs.c_press||""} onChange={e=>set("c_press",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Flow Rate (L/min)</label><input style={iStyle} type="number" placeholder="0" value={inputs.c_flow||""} onChange={e=>set("c_flow",e.target.value)}/></CalcField>
              <CalcField/>
            </CalcRow>
            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
              {rCard("Bore Area",results.boreArea,"cm²")}
              {rCard("Rod Area",results.rodArea,"cm²")}
              {rCard("Extend Force",results.extForce,"kN")}
              {rCard("Retract Force",results.retForce,"kN")}
              {rCard("Extend Speed",results.extSpd,"mm/s")}
              {rCard("Retract Speed",results.retSpd,"mm/s")}
              {rCard("Extend Vol.",results.extVol,"L")}
              {rCard("Retract Vol.",results.retVol,"L")}
            </div>
          </>
        )}

        {activeTab === "pump" && (
          <>
            <CalcRow>
              <CalcField><label style={lStyle}>Displacement (cc/rev)</label><input style={iStyle} type="number" placeholder="0" value={inputs.p_disp||""} onChange={e=>set("p_disp",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Speed (rpm)</label><input style={iStyle} type="number" placeholder="1500" value={inputs.p_rpm||""} onChange={e=>set("p_rpm",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Vol. Efficiency (%)</label><input style={iStyle} type="number" placeholder="95" value={inputs.p_voleff||""} onChange={e=>set("p_voleff",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Pressure (bar)</label><input style={iStyle} type="number" placeholder="0" value={inputs.p_press||""} onChange={e=>set("p_press",e.target.value)}/></CalcField>
            </CalcRow>
            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
              {rCard("Flow Rate",results.pumpFlow,"L/min")}
              {rCard("Hyd. Power",results.pumpHpow,"kW")}
              {rCard("Input Power",results.pumpIpow,"kW")}
              {rCard("Shaft Torque",results.pumpTorq,"Nm")}
            </div>
          </>
        )}

        {activeTab === "motor" && (
          <>
            <CalcRow>
              <CalcField><label style={lStyle}>Displacement (cc/rev)</label><input style={iStyle} type="number" placeholder="0" value={inputs.m_disp||""} onChange={e=>set("m_disp",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Pressure (bar)</label><input style={iStyle} type="number" placeholder="0" value={inputs.m_press||""} onChange={e=>set("m_press",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Flow Rate (L/min)</label><input style={iStyle} type="number" placeholder="0" value={inputs.m_flow||""} onChange={e=>set("m_flow",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Mech. Efficiency (%)</label><input style={iStyle} type="number" placeholder="90" value={inputs.m_meff||""} onChange={e=>set("m_meff",e.target.value)}/></CalcField>
            </CalcRow>
            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
              {rCard("Output Torque",results.motTorq,"Nm")}
              {rCard("Speed",results.motRpm,"rpm")}
              {rCard("Power",results.motPow,"kW")}
              {rCard("Mech. Eff.",results.motEff,"%")}
            </div>
          </>
        )}

        {activeTab === "pdrop" && (
          <>
            <CalcRow>
              <CalcField><label style={lStyle}>Flow Rate (L/min)</label><input style={iStyle} type="number" placeholder="0" value={inputs.pd_flow||""} onChange={e=>set("pd_flow",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Pipe Diameter (mm)</label><input style={iStyle} type="number" placeholder="0" value={inputs.pd_diam||""} onChange={e=>set("pd_diam",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Pipe Length (m)</label><input style={iStyle} type="number" placeholder="0" value={inputs.pd_len||""} onChange={e=>set("pd_len",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Viscosity (cSt)</label><input style={iStyle} type="number" placeholder="46" value={inputs.pd_visc||""} onChange={e=>set("pd_visc",e.target.value)}/></CalcField>
            </CalcRow>
            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
              {rCard("Velocity",results.pdVel,"m/s")}
              {rCard("Reynolds No.",results.pdRe,"—")}
              {rCard("Pressure Drop",results.pdBar,"bar")}
              {rCard("Flow Input",results.pdFlow,"L/min")}
            </div>
          </>
        )}

        {activeTab === "piping" && (
          <>
            <CalcRow>
              <CalcField><label style={lStyle}>Flow Rate (L/min)</label><input style={iStyle} type="number" placeholder="0" value={inputs.pp_flow||""} onChange={e=>set("pp_flow",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Pipe Bore (mm)</label><input style={iStyle} type="number" placeholder="0" value={inputs.pp_diam||""} onChange={e=>set("pp_diam",e.target.value)}/></CalcField>
            </CalcRow>
            <CalcRow>
              <CalcField><label style={lStyle}>Viscosity (cSt)</label><input style={iStyle} type="number" placeholder="46" value={inputs.pp_visc||""} onChange={e=>set("pp_visc",e.target.value)}/></CalcField>
              <CalcField><label style={lStyle}>Fluid Density (kg/m³)</label><input style={iStyle} type="number" placeholder="870" value={inputs.pp_dens||""} onChange={e=>set("pp_dens",e.target.value)}/></CalcField>
            </CalcRow>
            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
              {rCard("Velocity",results.ppVel,"m/s")}
              {rCard("Pipe Area",results.ppArea,"mm²")}
              {rCard("Reynolds No.",results.ppRe,"—")}
              <div style={{background:"rgba(0,212,255,.04)",border:`1px solid rgba(0,212,255,.1)`,borderRadius:8,padding:".75rem",textAlign:"center"}}>
                <div style={{fontSize:".68rem",color:C.text3,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:".05em"}}>Flow Regime</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.2rem",color:results.ppRegimeColor||C.cyan}}>{results.ppRegime||"—"}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "elec" && (
          <>
            <div style={{display:"flex",gap:".5rem",marginBottom:"1rem",flexWrap:"wrap"}}>
              {["ohm","power","sol","sensor"].map(m => (
                <button key={m} onClick={() => {setElecMode(m);setResults({});}} style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${elecMode===m?"rgba(245,200,66,.4)":C.border}`,background:elecMode===m?"rgba(245,200,66,.08)":"transparent",color:elecMode===m?C.goldY:C.text2,fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",cursor:"pointer",transition:".2s"}}>
                  {{ohm:"Ohm's Law",power:"Power",sol:"Solenoid",sensor:"4-20mA"}[m]}
                </button>
              ))}
            </div>

            {elecMode === "ohm" && (
              <CalcRow>
                <CalcField><label style={lStyle}>Voltage (V)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_volt||""} onChange={e=>set("el_volt",e.target.value)}/></CalcField>
                <CalcField><label style={lStyle}>Current (A)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_curr||""} onChange={e=>set("el_curr",e.target.value)}/></CalcField>
                <CalcField><label style={lStyle}>Resistance (Ω)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_res||""} onChange={e=>set("el_res",e.target.value)}/></CalcField>
              </CalcRow>
            )}

            {elecMode === "power" && (
              <>
                <CalcRow>
                  <CalcField><label style={lStyle}>Voltage (V)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_pvolt||""} onChange={e=>set("el_pvolt",e.target.value)}/></CalcField>
                  <CalcField><label style={lStyle}>Current (A)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_pcurr||""} onChange={e=>set("el_pcurr",e.target.value)}/></CalcField>
                  <CalcField><label style={lStyle}>Power Factor</label><input style={iStyle} type="number" placeholder="0.85" value={inputs.el_pf||""} onChange={e=>set("el_pf",e.target.value)}/></CalcField>
                </CalcRow>
                <div style={{display:"flex",gap:".5rem",marginBottom:"1rem"}}>
                  {[1,3].map(ph => (
                    <button key={ph} onClick={() => setElecPhase(ph)} style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${elecPhase===ph?"rgba(0,212,255,.4)":C.border}`,background:elecPhase===ph?"rgba(0,212,255,.08)":"transparent",color:elecPhase===ph?C.cyan:C.text2,fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",cursor:"pointer"}}>
                      {ph===1?"1φ Single":"3φ Three"}
                    </button>
                  ))}
                </div>
              </>
            )}

            {elecMode === "sol" && (
              <>
                <div style={{background:"rgba(245,200,66,.05)",border:"1px solid rgba(245,200,66,.15)",borderRadius:7,padding:".8rem",marginBottom:"1rem",fontSize:".8rem",color:C.text2,lineHeight:1.6}}>
                  ⚡ <strong style={{color:C.goldY}}>Solenoid coil check:</strong> 24VDC = 20–40Ω | 110VAC = 200–400Ω | Open circuit (&gt;5kΩ) = failed coil | Short (&lt;5Ω) = shorted
                </div>
                <CalcRow>
                  <CalcField><label style={lStyle}>Supply Voltage (V)</label><input style={iStyle} type="number" placeholder="24" value={inputs.el_svolt||""} onChange={e=>set("el_svolt",e.target.value)}/></CalcField>
                  <CalcField><label style={lStyle}>Measured Resistance (Ω)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_sres||""} onChange={e=>set("el_sres",e.target.value)}/></CalcField>
                </CalcRow>
              </>
            )}

            {elecMode === "sensor" && (
              <CalcRow>
                <CalcField><label style={lStyle}>Sensor Range Min (bar)</label><input style={iStyle} type="number" placeholder="0" value={inputs.el_smin||""} onChange={e=>set("el_smin",e.target.value)}/></CalcField>
                <CalcField><label style={lStyle}>Sensor Range Max (bar)</label><input style={iStyle} type="number" placeholder="400" value={inputs.el_smax||""} onChange={e=>set("el_smax",e.target.value)}/></CalcField>
                <CalcField><label style={lStyle}>Measured mA Signal</label><input style={iStyle} type="number" placeholder="12.0" value={inputs.el_sma||""} onChange={e=>set("el_sma",e.target.value)}/></CalcField>
              </CalcRow>
            )}

            <div style={{height:1,background:C.border,margin:"1rem 0"}}/>
            {elecMode === "sol" ? (
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                {rCard("Current",results.elR1,"A")}
                {rCard("Power",results.elR2,"W")}
                <div style={{background:"rgba(0,212,255,.04)",border:`1px solid rgba(0,212,255,.1)`,borderRadius:8,padding:".75rem",textAlign:"center"}}>
                  <div style={{fontSize:".68rem",color:C.text3,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase"}}>Status</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:results.elSolColor||C.cyan}}>{results.elSolStatus||"—"}</div>
                </div>
                {rCard("Nominal Range",results.elSolRange,"")}
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                {rCard(elecMode==="sensor"?"Calc. Value":elecMode==="power"?"Active Power (W)":"Voltage",results.elR1,elecMode==="sensor"?"bar":"V")}
                {rCard(elecMode==="sensor"?"Scale (%)":elecMode==="power"?"Apparent (VA)":"Current",results.elR2,elecMode==="sensor"?"%":"A")}
                {rCard(elecMode==="power"?"Current":"Resistance",results.elR3,elecMode==="power"?"A":"Ω")}
                {rCard(elecMode==="sensor"?"Range Min":elecMode==="power"?"Power Factor":"Power",results.elR4,elecMode==="sensor"?"bar":elecMode==="power"?"cosφ":"W")}
              </div>
            )}
          </>
        )}
      </div>

      {/* Formula Footer */}
      <div style={{padding:".75rem 1.5rem",borderTop:`1px solid ${C.border}`,background:"rgba(0,212,255,.02)"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:C.text3}}>
          {{cylinder:"F = p × A  |  v = Q / A  |  A = π × d² / 4",pump:"Q = (Vg × n × ηv) / 1000  |  P = p × Q / 600",motor:"T = (Vg × p × ηm) / (20π)  |  n = Q × 1000 / Vg",pdrop:"ΔP = f × L/D × ρv²/2  |  Re = ρvD/μ",piping:"v = Q / A  |  Re = ρ × v × d / μ",elec:"V = I × R  |  P = V × I × cosφ  |  4-20mA: EU = EUmin + (mA-4)/16 × Range"}[activeTab]}
        </span>
      </div>
    </div>
  );
}

function CalcRow({ children }) {
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${children.length||2},1fr)`,gap:".75rem",marginBottom:".75rem"}}>{children}</div>;
}
function CalcField({ children }) {
  return <div>{children}</div>;
}

// ── AI CHAT DASHBOARD ──────────────────────────────────────
function ChatDashboard({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("hyd");
  const [sessionId, setSessionId] = useState(null);
  const endRef = useRef(null);

  const modes = [
    { id:"hyd",   label:"⚙ Hydraulic",  color:C.cyan   },
    { id:"elec",  label:"⚡ Electrical", color:C.goldY  },
    { id:"crane", label:"🏗 Crane",      color:C.green  },
    { id:"fluid", label:"🛢 Fluid",      color:"#a78bfa"},
    { id:"design",label:"📐 Design",     color:"#fb923c"},
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:"user", content:input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message:input.trim(), mode, history:messages.slice(-10), user_email: user?.email||"guest" }),
      });
      const data = await res.json();
      const assistantMsg = { role:"assistant", content: data.response||data.answer||"No response received." };
      const updated = [...newMsgs, assistantMsg];
      setMessages(updated);
      if (!sessionId) {
        const id = addHistory(input.trim(), mode, updated);
        setSessionId(id);
      } else {
        updateHistory(sessionId, updated);
      }
    } catch (err) {
      setMessages(p => [...p, { role:"assistant", content:"⚠️ Connection error. Please check your network and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 60px)",background:"rgba(2,8,20,.98)"}}>
      {/* Mode Selector */}
      <div style={{background:"rgba(4,14,32,.95)",borderBottom:`1px solid ${C.border}`,padding:".6rem 1.5rem",display:"flex",gap:".5rem",alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:C.text3,marginRight:".25rem"}}>Mode:</span>
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{padding:"4px 14px",borderRadius:100,border:`1px solid ${mode===m.id?m.color:"rgba(0,212,255,.12)"}`,background:mode===m.id?`rgba(${m.color==="#00d4ff"?"0,212,255":m.color==="#f5c842"?"245,200,66":m.color==="#3dd68c"?"61,214,140":"161,139,251"},.08)`:"transparent",color:mode===m.id?m.color:C.text2,fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",cursor:"pointer",transition:".2s"}}>
            {m.label}
          </button>
        ))}
        <div style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:C.text3}}>
          {user ? `${user.first||user.email} · ${user.plan}` : "Guest Mode"}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
        {messages.length === 0 && (
          <div style={{textAlign:"center",margin:"auto",maxWidth:500}}>
            <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🤖</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1.6rem",color:C.white,marginBottom:".5rem"}}>HydroMind AI Advisor</div>
            <div style={{fontSize:".9rem",color:C.text2,lineHeight:1.7,marginBottom:"1.5rem"}}>Expert hydraulic systems AI backed by 33+ OEM manuals, offshore field cases, and real-time web search.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",justifyContent:"center"}}>
              {["How do I adjust A4VG pump neutral pressure?","Why is my hoist speed slow?","Rexroth DCV solenoid not shifting","Case drain pressure limit for A6VM"].map(q => (
                <button key={q} onClick={() => setInput(q)} style={{background:"rgba(0,212,255,.06)",border:`1px solid rgba(0,212,255,.2)`,borderRadius:8,padding:".6rem .9rem",color:C.cyan,fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",cursor:"pointer",transition:".2s",textAlign:"left"}}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{display:"flex",gap:".75rem",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role === "assistant" && (
              <div style={{width:32,height:32,minWidth:32,borderRadius:"50%",background:"linear-gradient(135deg,#00d4ff,#0050aa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem"}}>🤖</div>
            )}
            <div style={{maxWidth:"75%",background:m.role==="user"?"linear-gradient(135deg,rgba(0,112,204,.4),rgba(0,80,170,.3))":"rgba(5,20,45,.9)",border:`1px solid ${m.role==="user"?"rgba(0,212,255,.25)":"rgba(0,212,255,.1)"}`,borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:".9rem 1rem",fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",color:C.white,lineHeight:1.7,whiteSpace:"pre-wrap"}}>
              {m.content}
            </div>
            {m.role === "user" && (
              <div style={{width:32,height:32,minWidth:32,borderRadius:"50%",background:"linear-gradient(135deg,#c026d3,#9333ea)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".8rem",color:"#fff"}}>
                {user ? (user.first||user.email).slice(0,2).toUpperCase() : "U"}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:".75rem",alignItems:"center"}}>
            <div style={{width:32,height:32,minWidth:32,borderRadius:"50%",background:"linear-gradient(135deg,#00d4ff,#0050aa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem"}}>🤖</div>
            <div style={{background:"rgba(5,20,45,.9)",border:`1px solid rgba(0,212,255,.1)`,borderRadius:"12px 12px 12px 4px",padding:".9rem 1.2rem"}}>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i => <div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.cyan,animation:"pulse 1.4s ease-in-out infinite",animationDelay:`${i*0.2}s`,opacity:.6}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"1rem 1.5rem",borderTop:`1px solid ${C.border}`,background:"rgba(4,14,32,.95)"}}>
        <div style={{display:"flex",gap:".75rem",alignItems:"flex-end",maxWidth:900,margin:"0 auto"}}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Ask about hydraulic systems, cranes, HPUs, fault diagnosis..."
            rows={1}
            style={{flex:1,background:"rgba(2,10,22,.9)",border:`1px solid rgba(0,212,255,.2)`,borderRadius:10,padding:"12px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:".92rem",color:C.white,outline:"none",resize:"none",lineHeight:1.5,maxHeight:120,overflowY:"auto"}}
          />
          <button onClick={send} disabled={!input.trim()||loading} style={{background:input.trim()&&!loading?"linear-gradient(135deg,#00d4ff,#0070cc)":"rgba(0,212,255,.1)",border:`1px solid rgba(0,212,255,.2)`,borderRadius:10,padding:"12px 20px",color:input.trim()&&!loading?"#000":C.text3,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:".9rem",cursor:input.trim()&&!loading?"pointer":"not-allowed",transition:".2s",whiteSpace:"nowrap"}}>
            {loading ? "..." : "Send →"}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:".5rem",fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",color:C.text3}}>
          Press Enter to send · Shift+Enter for new line · Backed by 33+ OEM manuals
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );
}

// ── PLACEHOLDER PAGES ──────────────────────────────────────
function PlaceholderPage({ title, icon, desc }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 60px)",padding:"2rem",textAlign:"center"}}>
      <div>
        <div style={{fontSize:"3rem",marginBottom:"1rem"}}>{icon}</div>
        <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"2rem",color:C.white,marginBottom:".5rem"}}>{title}</h1>
        <p style={{color:C.text2,fontSize:"1rem"}}>{desc}</p>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => getSession());
  const [page, setPage] = useState("home");
  const [authModal, setAuthModal] = useState(null);

  const handleLogin = (tab) => setAuthModal(tab);
  const handleLogout = () => {
    if (window.confirm("Sign out of HydroMind.AI?")) {
      clearSession();
      setUser(null);
    }
  };
  const handleAuthSuccess = (u) => {
    setUser(u);
    setAuthModal(null);
  };

  const renderPage = () => {
    switch (page) {
      case "home":      return <HomePage onLogin={handleLogin} setPage={setPage}/>;
      case "advisor":   return <ChatDashboard user={user}/>;
      case "design":    return <ChatDashboard user={user}/>;
      case "calculator":return <div style={{padding:"100px 2rem 2rem",maxWidth:950,margin:"0 auto"}}><Calculator/></div>;
      case "knowledge": return <PlaceholderPage title="Knowledge Base" icon="📚" desc="33+ indexed OEM manuals — Rexroth, Danfoss, Parker and more."/>;
      case "news":      return <PlaceholderPage title="Industry News" icon="📰" desc="Latest hydraulic systems and offshore crane industry news."/>;
      case "pricing":   return <PlaceholderPage title="Pricing Plans" icon="💳" desc="Free, Basic, Pro and Enterprise plans available."/>;
      case "feedback":  return <PlaceholderPage title="Feedback" icon="💬" desc="Help us improve HydroMind AI — your feedback matters."/>;
      case "electrical":return <ChatDashboard user={user}/>;
      default:          return <HomePage onLogin={handleLogin} setPage={setPage}/>;
    }
  };

  const showSidebars = page !== "advisor" && page !== "design" && page !== "electrical";

  return (
    <div style={{minHeight:"100vh",background:C.navy,color:C.white,position:"relative"}}>
      <CircuitBg/>

      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} currentPage={page} setPage={setPage}/>

      <div style={{paddingTop:60,display:"flex",position:"relative",zIndex:1}}>
        {showSidebars && (
          <LeftSidebar user={user} onLogin={handleLogin} onLogout={handleLogout} setPage={setPage}/>
        )}

        <main style={{flex:1,minWidth:0,overflowX:"hidden"}}>
          {renderPage()}
        </main>

        {showSidebars && <RightSidebar user={user}/>}
      </div>

      {authModal && (
        <AuthModal tab={authModal} onClose={() => setAuthModal(null)} onSuccess={handleAuthSuccess}/>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020b18; color: #e8f4ff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,.2); }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,.2); border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: rgba(200,216,232,.25); }
        select option { background: #041428; color: #e8f4ff; }
      `}</style>
    </div>
  );
}
