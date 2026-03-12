import { useState, useEffect, useRef, useCallback } from "react";

// ── CONSTANTS ──────────────────────────────────────────────
const API = process.env.REACT_APP_BACKEND_URL || "https://hydromind-backend.onrender.com";

const ADMIN_EMAILS = ["arun25hyd@proton.me", "arun25hyd@gmail.com"];

const COLORS = {
  navy:     "#020b18",
  navy2:    "#041428",
  steel:    "#0a2540",
  blue:     "#0d4f8c",
  cyan:     "#1a9fd4",
  gold:     "#c8921a",
  goldLt:   "#f0b429",
  goldBrt:  "#ffd166",
  white:    "#e8f4fd",
  muted:    "#6b8fa8",
};

// ── GLOBAL STYLES injected once ──
const GlobalStyle = () => {
  useEffect(() => {
    const id = "hydromind-global";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Rajdhani', sans-serif; background: #020b18; color: #e8f4fd; overflow-x: hidden; }
      :root {
        --navy:#020b18; --navy2:#041428; --steel:#0a2540; --blue:#0d4f8c;
        --cyan:#1a9fd4; --gold:#c8921a; --gold-light:#f0b429; --gold-bright:#ffd166;
        --white:#e8f4fd; --muted:#6b8fa8;
        --border:rgba(200,146,26,0.25);
        --glow:0 0 30px rgba(200,146,26,0.3);
      }
      @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.6)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      .fadeUp-1{animation:fadeUp 0.8s 0.1s ease both}
      .fadeUp-2{animation:fadeUp 0.8s 0.3s ease both}
      .fadeUp-3{animation:fadeUp 0.8s 0.5s ease both}
      .fadeUp-4{animation:fadeUp 0.8s 0.7s ease both}
      .fadeUp-5{animation:fadeUp 0.8s 0.9s ease both}
      .typing-cursor{display:inline-block;width:2px;height:1em;background:var(--cyan);margin-left:2px;animation:blink 1s infinite;vertical-align:text-bottom}
      .badge-dot{width:6px;height:6px;background:var(--cyan);border-radius:50%;animation:pulse 2s infinite;display:inline-block}
      .reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
      .reveal.visible{opacity:1;transform:none}
      .gold-divider{width:60px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light));margin:1.2rem 0}
      ::-webkit-scrollbar{width:6px}
      ::-webkit-scrollbar-track{background:#020b18}
      ::-webkit-scrollbar-thumb{background:rgba(200,146,26,0.3);border-radius:3px}
      textarea,input{background:rgba(255,255,255,0.04);border:1px solid rgba(26,159,212,0.2);color:#e8f4fd;outline:none;font-family:'Rajdhani',sans-serif}
      textarea:focus,input:focus{border-color:rgba(200,146,26,0.5)}
      .chat-msg-enter{animation:fadeUp 0.3s ease both}
      @media(max-width:900px){
        .hide-mobile{display:none!important}
        .grid-2{grid-template-columns:1fr!important}
        .grid-3{grid-template-columns:1fr 1fr!important}
      }
      @media(max-width:600px){
        .grid-3{grid-template-columns:1fr!important}
        .grid-5{grid-template-columns:1fr 1fr!important}
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ── HYDRAULIC SCHEMATIC BACKGROUND ──────────────────────────
const HydraulicBackground = () => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouse);

    const VW = 1400, VH = 900;
    const sx = (x) => (x / VW) * canvas.width;
    const sy = (y) => (y / VH) * canvas.height;
    const ss = (s) => s * Math.min(canvas.width / VW, canvas.height / VH);

    const C = {
      gold:"#c8921a", goldLt:"#f0b429", goldLine:"rgba(200,146,26,0.55)",
      goldDim:"rgba(200,146,26,0.18)", cyan:"#1a9fd4", cyanLine:"rgba(26,159,212,0.5)",
      cyanDim:"rgba(26,159,212,0.15)", pipeFill:"rgba(26,159,212,0.07)",
      red:"#e84040", redDim:"rgba(232,64,64,0.6)", muted:"rgba(107,143,168,0.7)",
      white:"rgba(232,244,253,0.9)",
    };

    function polyLine(pts, color, width, dash) {
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = ss(width || 1.5);
      if (dash) ctx.setLineDash(dash);
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(sx(pts[0][0]), sy(pts[0][1]));
      for (let i = 1; i < pts.length; i++) ctx.lineTo(sx(pts[i][0]), sy(pts[i][1]));
      ctx.stroke();
      ctx.restore();
    }

    function circle(x, y, r, strokeC, fillC, lw) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx(x), sy(y), ss(r), 0, Math.PI * 2);
      if (fillC) { ctx.fillStyle = fillC; ctx.fill(); }
      if (strokeC) { ctx.strokeStyle = strokeC; ctx.lineWidth = ss(lw || 1.5); ctx.stroke(); }
      ctx.restore();
    }

    function text(str, x, y, color, size, align) {
      ctx.save();
      ctx.font = `${ss(size || 10)}px 'Share Tech Mono',monospace`;
      ctx.fillStyle = color; ctx.textAlign = align || "center";
      ctx.fillText(str, sx(x), sy(y));
      ctx.restore();
    }

    function drawPump(x, y, r, angle) {
      circle(x, y, r, C.goldLine, C.cyanDim, 2);
      ctx.save();
      ctx.translate(sx(x), sy(y)); ctx.rotate(angle || 0);
      ctx.fillStyle = C.goldLt;
      ctx.beginPath();
      ctx.moveTo(ss(-r * 0.55), ss(-r * 0.3));
      ctx.lineTo(ss(r * 0.55), 0);
      ctx.lineTo(ss(-r * 0.55), ss(r * 0.3));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawGauge(x, y, r, pressure) {
      circle(x, y, r, C.goldLine, "rgba(4,20,40,0.7)", 1.5);
      for (let i = 0; i < 9; i++) {
        const ang = -Math.PI * 0.8 + (i / 8) * Math.PI * 1.6;
        ctx.save();
        ctx.strokeStyle = i > 5 ? C.red : C.goldLt; ctx.lineWidth = ss(1);
        ctx.beginPath();
        ctx.moveTo(sx(x + Math.cos(ang) * r * 0.7), sy(y + Math.sin(ang) * r * 0.7));
        ctx.lineTo(sx(x + Math.cos(ang) * r * 0.9), sy(y + Math.sin(ang) * r * 0.9));
        ctx.stroke(); ctx.restore();
      }
      const nAng = -Math.PI * 0.8 + pressure * Math.PI * 1.6;
      ctx.save();
      ctx.strokeStyle = pressure > 0.7 ? C.red : C.goldLt;
      ctx.lineWidth = ss(1.5); ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(sx(x), sy(y));
      ctx.lineTo(sx(x + Math.cos(nAng) * r * 0.65), sy(y + Math.sin(nAng) * r * 0.65));
      ctx.stroke(); ctx.restore();
      circle(x, y, r * 0.12, C.gold, C.goldLt, 1);
    }

    const PIPES = [
      { pts:[[190,750],[285,750],[285,615],[420,615],[560,615],[560,750]], color:C.cyanLine, w:3 },
      { pts:[[560,750],[600,750],[740,750],[740,680],[760,680],[760,550],[740,550]], color:C.goldLine, w:3 },
      { pts:[[460,735],[460,680],[380,680],[380,520],[460,520]], color:C.cyanLine, w:2.5 },
      { pts:[[460,430],[460,370],[900,370],[900,820],[160,820],[160,750]], color:C.cyanLine, w:2 },
      { pts:[[440,615],[440,820],[820,820]], color:C.redDim, w:1.5, dash:true },
      { pts:[[950,300],[1250,300],[1250,700],[950,700],[950,300]], color:"rgba(200,146,26,0.12)", w:1.2 },
      { pts:[[1100,300],[1100,700]], color:"rgba(26,159,212,0.10)", w:1 },
      { pts:[[50,200],[50,600],[130,600],[130,200],[50,200]], color:"rgba(26,159,212,0.09)", w:1 },
    ];

    const PARTICLE_PIPES = [
      { pts:[[190,750],[285,750],[285,615],[420,615],[560,615],[560,750]], color:C.cyan, r:3.5, speed:0.18 },
      { pts:[[560,750],[740,750],[740,680],[760,680],[760,550],[740,550]], color:C.goldLt, r:3, speed:0.22 },
      { pts:[[460,735],[460,680],[380,680],[380,520],[460,520]], color:C.cyan, r:2.5, speed:0.16 },
      { pts:[[460,430],[460,370],[900,370],[900,820],[160,820],[160,750]], color:C.cyanLine, r:2, speed:0.12 },
    ];

    const particles = [];
    PARTICLE_PIPES.forEach((pp) => {
      const count = 5;
      for (let i = 0; i < count; i++) {
        particles.push({ pts:pp.pts, t:i/count, speed:pp.speed*(0.8+Math.random()*0.4), color:pp.color, r:pp.r*(0.6+Math.random()*0.7), tail:[] });
      }
    });

    function pathPos(pts, t) {
      const total = pts.reduce((acc, _, i) => {
        if (i === 0) return 0;
        const dx = pts[i][0]-pts[i-1][0], dy = pts[i][1]-pts[i-1][1];
        return acc + Math.sqrt(dx*dx+dy*dy);
      }, 0);
      let target = t * total;
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i][0]-pts[i-1][0], dy = pts[i][1]-pts[i-1][1];
        const seg = Math.sqrt(dx*dx+dy*dy);
        if (target <= seg) return [pts[i-1][0]+dx*(target/seg), pts[i-1][1]+dy*(target/seg)];
        target -= seg;
      }
      return pts[pts.length-1];
    }

    let t = 0;
    function draw() {
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const vg = ctx.createRadialGradient(canvas.width*0.5,canvas.height*0.5,canvas.height*0.1,canvas.width*0.5,canvas.height*0.5,canvas.height*0.9);
      vg.addColorStop(0, "rgba(2,11,24,0)"); vg.addColorStop(1, "rgba(2,11,24,0.6)");
      ctx.fillStyle = vg; ctx.fillRect(0,0,canvas.width,canvas.height);

      const ox = (mouseRef.current.x - 0.5) * 8, oy = (mouseRef.current.y - 0.5) * 5;
      ctx.save();
      ctx.translate(sx(ox), sy(oy));

      // Pipes
      PIPES.forEach(p => {
        polyLine(p.pts, p.color, p.w||1.5, p.dash ? [ss(5),ss(5)] : undefined);
        if (!p.dash && p.w >= 2) polyLine(p.pts, C.pipeFill, (p.w||2)*2.5);
      });

      // Junctions
      [[285,615],[560,615],[460,370],[900,370],[900,820],[160,820]].forEach(j => circle(j[0],j[1],4,null,C.goldLt));

      // Symbols
      drawPump(285, 750, 32, t * 1.2);
      const p1 = 0.45 + Math.sin(t * 0.9) * 0.15;
      const p2 = 0.60 + Math.sin(t * 0.7 + 1) * 0.18;
      drawGauge(300, 615, 22, p1);
      drawGauge(680, 615, 22, p2);

      // Tank
      ctx.save();
      ctx.strokeStyle = C.goldLine; ctx.lineWidth = ss(2);
      ctx.fillStyle = "rgba(26,159,212,0.1)";
      ctx.strokeRect(sx(100),sy(710),ss(90),ss(80));
      ctx.fillRect(sx(100),sy(710),ss(90),ss(80));
      ctx.restore();
      text("TANK", 145, 755, C.cyan, 9);

      // Pressure readings
      text(`${(180+Math.sin(t*0.9)*35).toFixed(0)} bar`, 300, 597, C.goldLt, 8);
      text(`${(240+Math.sin(t*0.7+1)*50).toFixed(0)} bar`, 680, 597, p2>0.7?C.red:C.goldLt, 8);
      text(p2 <= 0.78 ? "● SYSTEM OK" : "● OVER-PRESSURE", 700, 780, p2<=0.78?"rgba(40,202,65,0.7)":C.red, 9);

      // Background labels
      text("HP LINE", 420, 602, C.gold, 8);
      text("RETURN", 650, 358, C.muted, 8);
      text("SUCTION", 237, 762, C.cyan, 8);

      // Particles
      particles.forEach(p => {
        p.t = (p.t + p.speed * 0.003) % 1;
        const pos = pathPos(p.pts, p.t);
        p.tail.push([...pos]);
        if (p.tail.length > 6) p.tail.shift();
        if (p.tail.length > 1) {
          for (let i = 1; i < p.tail.length; i++) {
            ctx.save(); ctx.globalAlpha = (i/p.tail.length)*0.35;
            ctx.strokeStyle = p.color; ctx.lineWidth = ss(p.r*0.7); ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(sx(p.tail[i-1][0]),sy(p.tail[i-1][1]));
            ctx.lineTo(sx(p.tail[i][0]),sy(p.tail[i][1]));
            ctx.stroke(); ctx.restore();
          }
        }
        circle(pos[0], pos[1], p.r, null, p.color);
      });

      // Piston animation
      const pist = Math.sin(t * 0.9) * 20;
      ctx.save();
      ctx.strokeStyle = C.goldLt; ctx.lineWidth = ss(3); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sx(550),sy(480)); ctx.lineTo(sx(550+pist),sy(480));
      ctx.stroke(); ctx.restore();
      circle(550+pist, 480, 5, C.gold, C.goldLt, 1.5);

      // Watermark
      ctx.save(); ctx.globalAlpha = 0.04;
      ctx.font = `bold ${ss(70)}px 'Orbitron',monospace`;
      ctx.fillStyle = C.gold; ctx.textAlign = "center";
      ctx.fillText("HYDRAULIC", sx(700), sy(460));
      ctx.fillText("SCHEMATIC", sx(700), sy(550));
      ctx.restore();

      ctx.restore();
      t += 0.012;
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />
  );
};

// ── GRID OVERLAY ──
const GridOverlay = () => (
  <div style={{
    position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:1, pointerEvents:"none",
    backgroundImage:"linear-gradient(rgba(26,159,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,159,212,0.04) 1px,transparent 1px)",
    backgroundSize:"60px 60px"
  }} />
);

// ── NAV ──────────────────────────────────────────────────────
const Nav = ({ onFeedback, onLaunch }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth" }); };

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 5%", height:"70px",
      background: scrolled ? "rgba(2,11,24,0.97)" : "rgba(2,11,24,0.85)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(200,146,26,0.25)",
      transition:"background 0.3s"
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
        <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
          <circle cx="20" cy="20" r="18" stroke="#c8921a" strokeWidth="1.5" opacity="0.5"/>
          <circle cx="20" cy="20" r="12" stroke="#1a9fd4" strokeWidth="1" opacity="0.6"/>
          <path d="M12 20 C12 14 28 14 28 20 C28 26 12 26 12 20Z" fill="none" stroke="#c8921a" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="3" fill="#f0b429"/>
          <line x1="20" y1="2" x2="20" y2="8" stroke="#1a9fd4" strokeWidth="1.5"/>
          <line x1="20" y1="32" x2="20" y2="38" stroke="#1a9fd4" strokeWidth="1.5"/>
          <line x1="2" y1="20" x2="8" y2="20" stroke="#1a9fd4" strokeWidth="1.5"/>
          <line x1="32" y1="20" x2="38" y2="20" stroke="#1a9fd4" strokeWidth="1.5"/>
        </svg>
        <span style={{ fontFamily:"'Orbitron',monospace", fontSize:"1.15rem", fontWeight:700, letterSpacing:"0.05em" }}>
          Hydro<span style={{ color:"#f0b429" }}>Mind</span> AI
        </span>
      </div>

      {/* Links */}
      <ul className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:"2rem", listStyle:"none" }}>
        {[["modes","How It Works"],["ai-advisor","AI Advisor"],["features","Features"],["calculators","Calculators"],["pricing","Pricing"]].map(([id,label]) => (
          <li key={id}>
            <button onClick={() => scrollTo(id)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Rajdhani',sans-serif", fontSize:"0.9rem", fontWeight:600,
              letterSpacing:"0.08em", textTransform:"uppercase", color:"#6b8fa8",
              transition:"color 0.3s", padding:0
            }}
              onMouseEnter={e=>e.target.style.color="#f0b429"}
              onMouseLeave={e=>e.target.style.color="#6b8fa8"}
            >{label}</button>
          </li>
        ))}
        <li>
          <button onClick={onLaunch} style={{
            fontFamily:"'Orbitron',monospace", fontSize:"0.72rem", fontWeight:600,
            letterSpacing:"0.1em", textTransform:"uppercase", color:"#020b18",
            background:"linear-gradient(135deg,#c8921a,#f0b429)",
            padding:"8px 20px", borderRadius:"3px", border:"none", cursor:"pointer",
            transition:"all 0.3s", boxShadow:"0 0 20px rgba(200,146,26,0.4)"
          }}
            onMouseEnter={e=>{e.target.style.boxShadow="0 0 35px rgba(200,146,26,0.7)";e.target.style.transform="translateY(-1px)"}}
            onMouseLeave={e=>{e.target.style.boxShadow="0 0 20px rgba(200,146,26,0.4)";e.target.style.transform="none"}}
          >Launch App</button>
        </li>
      </ul>
    </nav>
  );
};

// ── HERO ─────────────────────────────────────────────────────
const Hero = ({ onLaunch }) => {
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth" }); };
  return (
    <section style={{ position:"relative", zIndex:10, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"70px 5% 0", textAlign:"center" }}>
      <div style={{ maxWidth:"900px" }}>
        <div className="fadeUp-1" style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a9fd4", border:"1px solid rgba(26,159,212,0.4)", padding:"6px 16px", borderRadius:"2px", marginBottom:"2rem", background:"rgba(26,159,212,0.05)" }}>
          <span className="badge-dot"></span>
          AI-Powered Hydraulic Intelligence Platform
        </div>

        <h1 className="fadeUp-2" style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(2.4rem,5.5vw,4.8rem)", fontWeight:900, lineHeight:1.05, marginBottom:"1.5rem" }}>
          <span style={{ color:"#e8f4fd" }}>Hydraulic AI Advisor</span><br/>
          <span style={{ background:"linear-gradient(135deg,#c8921a 0%,#ffd166 50%,#1a9fd4 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Design. Diagnose. Solve.</span>
        </h1>

        <p className="fadeUp-3" style={{ fontSize:"1.15rem", fontWeight:400, color:"#6b8fa8", lineHeight:1.7, maxWidth:"640px", margin:"0 auto 2.5rem" }}>
          Built for <strong style={{color:"#1a9fd4"}}>hydraulic system designers</strong> and <strong style={{color:"#1a9fd4"}}>field troubleshooters</strong>. Ask HydroMind AI to design your complete hydraulic system — or diagnose any fault — using deep OEM knowledge, ISO schematics, and live web search.
        </p>

        <div className="fadeUp-4" style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => scrollTo("modes")} style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#020b18", background:"linear-gradient(135deg,#c8921a,#f0b429)", padding:"14px 32px", borderRadius:"3px", border:"none", cursor:"pointer", transition:"all 0.3s", boxShadow:"0 0 30px rgba(200,146,26,0.4)" }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 0 50px rgba(200,146,26,0.7)"}}
            onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow="0 0 30px rgba(200,146,26,0.4)"}}>
            See How It Works
          </button>
          <button onClick={onLaunch} style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.78rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#1a9fd4", background:"transparent", padding:"14px 32px", borderRadius:"3px", border:"1px solid rgba(26,159,212,0.4)", cursor:"pointer", transition:"all 0.3s" }}
            onMouseEnter={e=>{e.target.style.background="rgba(26,159,212,0.1)";e.target.style.borderColor="#1a9fd4";e.target.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor="rgba(26,159,212,0.4)";e.target.style.transform="none"}}>
            Launch AI Advisor
          </button>
        </div>

        <div className="fadeUp-5" style={{ display:"flex", justifyContent:"center", gap:"3rem", marginTop:"4rem", paddingTop:"3rem", borderTop:"1px solid rgba(200,146,26,0.15)", flexWrap:"wrap" }}>
          {[["2","Expert AI Modes"],["KB","+ Web Search"],["OEM","Grade Knowledge"],["24/7","AI Availability"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <span style={{ fontFamily:"'Orbitron',monospace", fontSize:"2rem", fontWeight:700, color:"#f0b429", display:"block", lineHeight:1 }}>{n}</span>
              <span style={{ fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b8fa8", marginTop:"0.4rem", display:"block" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── HOW IT WORKS ─────────────────────────────────────────────
const HowItWorks = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1});
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="modes" ref={ref} style={{ position:"relative", zIndex:10, background:"linear-gradient(180deg,transparent,rgba(4,20,40,0.7),transparent)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"100px 5%" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c8921a", marginBottom:"1rem" }}>// HOW HYDROMIND AI WORKS</div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, lineHeight:1.15 }}>Two Powerful AI Modes.<br/>One Platform.</h2>
        </div>

        <div className="reveal grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", marginBottom:"3rem" }}>
          {/* Designer */}
          <div style={{ background:"rgba(4,20,40,0.8)", border:"1px solid rgba(200,146,26,0.4)", borderRadius:"8px", padding:"2.5rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"3px", background:"linear-gradient(90deg,#c8921a,#f0b429)" }}/>
            <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🔩</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.7rem", letterSpacing:"0.15em", color:"#c8921a", marginBottom:"0.5rem" }}>MODE 01</div>
            <h3 style={{ fontFamily:"'Orbitron',monospace", fontSize:"1.2rem", fontWeight:700, color:"#f0b429", marginBottom:"1rem" }}>System Designer</h3>
            <p style={{ fontSize:"0.95rem", color:"#6b8fa8", lineHeight:1.7, marginBottom:"1.5rem" }}>Enter your system parameters — load, pressure, flow, speed — and HydroMind AI designs your complete hydraulic circuit with preferred make selection.</p>
            <div style={{ borderTop:"1px solid rgba(200,146,26,0.15)", paddingTop:"1.2rem" }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"#c8921a", marginBottom:"0.8rem" }}>AI SELECTS FOR YOU:</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem" }}>
                {["Hydraulic Pump","Electric Motor","Pipeline Sizes","Oil Tank & Volume","Oil Filters","Control Valves","Heat Exchanger","Accumulators"].map(item => (
                  <div key={item} style={{ fontSize:"0.85rem", color:"#e8f4fd", display:"flex", gap:"6px", alignItems:"center" }}>
                    <span style={{ color:"#f0b429" }}>◆</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:"1.2rem", padding:"0.8rem", background:"rgba(200,146,26,0.06)", border:"1px solid rgba(200,146,26,0.2)", borderRadius:"4px" }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"#6b8fa8", lineHeight:1.6 }}>
                📌 AI asks: <span style={{color:"#f0b429"}}>"Which make — Rexroth, Eaton, Parker, Bosch, Sauer Danfoss?"</span><br/>
                KB first → web if not found → full BOM + specs<br/>
                <span style={{color:"#c8921a"}}>📐 Then draws ISO hydraulic schematic — PDF/PNG export</span>
              </div>
            </div>
          </div>

          {/* Troubleshooter */}
          <div style={{ background:"rgba(4,20,40,0.8)", border:"1px solid rgba(26,159,212,0.4)", borderRadius:"8px", padding:"2.5rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"3px", background:"linear-gradient(90deg,#1a9fd4,#5dd4f8)" }}/>
            <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🔧</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.7rem", letterSpacing:"0.15em", color:"#1a9fd4", marginBottom:"0.5rem" }}>MODE 02</div>
            <h3 style={{ fontFamily:"'Orbitron',monospace", fontSize:"1.2rem", fontWeight:700, color:"#5dd4f8", marginBottom:"1rem" }}>Troubleshooter</h3>
            <p style={{ fontSize:"0.95rem", color:"#6b8fa8", lineHeight:1.7, marginBottom:"1.5rem" }}>Ask any hydraulic fault, theory, or setting question. HydroMind AI searches KB first — and the web if needed — for precise, actionable answers.</p>
            <div style={{ borderTop:"1px solid rgba(26,159,212,0.15)", paddingTop:"1.2rem" }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"#1a9fd4", marginBottom:"0.8rem" }}>EXAMPLE QUESTIONS:</div>
              {["What is Pascal's Law and how does it apply?","How do I set a counterbalance valve (CBV)?","How do I check accumulator pre-charge pressure?","A4VG90 charge pressure low — causes?","Show me a closed-loop winch schematic from KB."].map(q => (
                <div key={q} style={{ fontSize:"0.85rem", color:"#e8f4fd", display:"flex", gap:"8px", marginBottom:"0.5rem" }}>
                  <span style={{color:"#1a9fd4",flexShrink:0}}>›</span><span>{q}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1.2rem", padding:"0.8rem", background:"rgba(26,159,212,0.06)", border:"1px solid rgba(26,159,212,0.2)", borderRadius:"4px" }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"#6b8fa8", lineHeight:1.6 }}>
                🔍 Priority: <span style={{color:"#5dd4f8"}}>KB (instant)</span> → <span style={{color:"#f0b429"}}>Web (if not in KB)</span> → Structured answer + source
              </div>
            </div>
          </div>
        </div>

        {/* AI Logic Flow */}
        <div className="reveal" style={{ padding:"2rem", background:"rgba(4,20,40,0.6)", border:"1px solid rgba(200,146,26,0.15)", borderRadius:"8px" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", color:"#c8921a", letterSpacing:"0.15em", marginBottom:"1.2rem", textAlign:"center" }}>// AI DECISION LOGIC</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, flexWrap:"wrap" }}>
            {[
              { icon:"💬", label:"USER QUERY", sub:"" },
              { arrow:true },
              { icon:"📚", label:"SEARCH KB", sub:"OEM Manuals\nSchematics\nTheory", color:"rgba(200,146,26,0.08)", border:"rgba(200,146,26,0.2)", textColor:"#f0b429" },
              { arrow:true },
              { icon:"🌐", label:"WEB SEARCH", sub:"If not in KB\nLatest specs\nNew products", color:"rgba(26,159,212,0.08)", border:"rgba(26,159,212,0.2)", textColor:"#1a9fd4" },
              { arrow:true },
              { icon:"📐", label:"DRAW SCHEMATIC", sub:"ISO standard\nAuto-generated\nPDF/PNG", color:"rgba(200,146,26,0.06)", border:"rgba(200,146,26,0.25)", textColor:"#f0b429" },
              { arrow:true },
              { icon:"✅", label:"ANSWER", sub:"Structured\nSourced\nActionable", color:"rgba(4,20,40,0.8)", border:"rgba(200,146,26,0.3)", textColor:"#f0b429" },
            ].map((item, i) => item.arrow ? (
              <div key={i} style={{ color:"#c8921a", fontSize:"1.2rem", padding:"0 0.5rem" }}>→</div>
            ) : (
              <div key={i} style={{ textAlign:"center", padding:"0.8rem 1rem", background:item.color||"transparent", border:item.border?`1px solid ${item.border}`:"none", borderRadius:"4px" }}>
                <div style={{fontSize:"1.1rem"}}>{item.icon}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.6rem", color:item.textColor||"#e8f4fd", marginTop:"0.3rem" }}>{item.label}</div>
                {item.sub && <div style={{ fontSize:"0.68rem", color:"#6b8fa8", marginTop:"0.2rem", whiteSpace:"pre-line" }}>{item.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── AI ADVISOR DEMO ───────────────────────────────────────────
const ChatDemo = ({ mode }) => {
  const isDesigner = mode === "designer";
  const msgs = isDesigner ? [
    { role:"user", avatar:"SD", text:<>I need a hydraulic power unit. Load: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>5000 kg</span>, speed: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>0.05 m/s</span>, pressure: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>200 bar</span>, 2 cylinders double-acting.</> },
    { role:"ai", avatar:"HM", text:<><span style={{color:"#f0b429",fontWeight:600}}>📐 Design parameters received.</span> Calculated:<br/>Flow: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>12.6 LPM</span> | Power: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>4.2 kW</span><br/><br/>Which make do you prefer?<br/><span style={{color:"#f0b429"}}>Rexroth / Eaton / Parker / Bosch / Sauer Danfoss</span></> },
    { role:"user", avatar:"SD", text:"Rexroth preferred." },
    { role:"ai", avatar:"HM", text:<><span style={{color:"#f0b429",fontWeight:600}}>✅ Rexroth BOM from KB:</span><br/>Pump: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>A10VO18</span> | Motor: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>5.5kW/1450rpm</span><br/>Tank: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>40L</span> | Filter: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>RFM BN/HC 110</span><br/>Lines: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>HP 12mm / Return 16mm</span><span className="typing-cursor"/></>, typing:true },
  ] : [
    { role:"user", avatar:"AT", text:"How do I check accumulator pre-charge pressure on a crane hydraulic system?" },
    { role:"ai", avatar:"HM", text:<><span style={{color:"#f0b429",fontWeight:600}}>📚 Found in KB — Accumulator Procedure:</span><br/><br/>1. Isolate HPU, release system pressure to <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>0 bar</span><br/>2. Remove gas valve cap (N₂ side)<br/>3. Connect nitrogen gauge — read pre-charge<br/>4. Typical: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>60–70%</span> of min. working pressure<br/>5. Top up with dry N₂ only — <span style={{color:"#e84040"}}>never oxygen</span></> },
    { role:"user", avatar:"AT", text:"What is Pascal's Law?" },
    { role:"ai", avatar:"HM", text:<><span style={{color:"#f0b429",fontWeight:600}}>📚 KB — Hydraulic Theory:</span> Pressure applied to a confined fluid transmits equally in all directions. Formula: <span style={{color:"#1a9fd4",fontFamily:"monospace"}}>P = F / A</span>. Basis of all hydraulic force multiplication.<span className="typing-cursor"/></>, typing:true },
  ];

  return (
    <div style={{ background:"rgba(4,20,40,0.8)", border:`1px solid ${isDesigner?"rgba(200,146,26,0.4)":"rgba(26,159,212,0.4)"}`, borderRadius:"8px", overflow:"hidden", boxShadow:`0 0 30px ${isDesigner?"rgba(200,146,26,0.15)":"rgba(26,159,212,0.15)"}` }}>
      <div style={{ background:"rgba(10,37,64,0.9)", padding:"12px 18px", display:"flex", alignItems:"center", gap:"10px", borderBottom:`1px solid ${isDesigner?"rgba(200,146,26,0.25)":"rgba(26,159,212,0.25)"}`, borderLeft:`3px solid ${isDesigner?"#c8921a":"#1a9fd4"}` }}>
        <div style={{display:"flex",gap:"5px"}}>
          {["#ff5f57","#ffbd2e","#28ca41"].map(c=><span key={c} style={{width:"10px",height:"10px",borderRadius:"50%",background:c,display:"inline-block"}}/>)}
        </div>
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"#6b8fa8" }}>{isDesigner?"🔩 SYSTEM DESIGNER MODE":"🔧 TROUBLESHOOTER MODE"}</span>
      </div>
      <div style={{ padding:"18px", minHeight:"300px", display:"flex", flexDirection:"column", gap:"14px" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", flexDirection: m.role==="user"?"row":"row" }}>
            <div style={{ width:"30px", height:"30px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, flexShrink:0, fontFamily:"'Orbitron',monospace", background: m.role==="user"?"linear-gradient(135deg,#0d4f8c,#1a9fd4)":"linear-gradient(135deg,#c8921a,#f0b429)", color: m.role==="user"?"white":"#020b18" }}>{m.avatar}</div>
            <div style={{ background: m.role==="user"?"rgba(13,79,140,0.3)":"rgba(200,146,26,0.1)", border:`1px solid ${m.role==="user"?"rgba(26,159,212,0.2)":"rgba(200,146,26,0.2)"}`, borderRadius: m.role==="user"?"2px 8px 8px 8px":"8px 2px 8px 8px", padding:"10px 14px", fontSize:"0.88rem", lineHeight:1.6, color:"#e8f4fd", maxWidth:"88%" }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${isDesigner?"rgba(200,146,26,0.2)":"rgba(26,159,212,0.2)"}`, display:"flex", gap:"10px" }}>
        <div style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(26,159,212,0.2)", borderRadius:"4px", padding:"8px 14px", fontSize:"0.88rem", color:"#6b8fa8" }}>{isDesigner?"Describe your hydraulic system...":"Ask any hydraulic question..."}</div>
        <button style={{ background:"linear-gradient(135deg,#c8921a,#f0b429)", border:"none", borderRadius:"4px", padding:"8px 16px", color:"#020b18", fontFamily:"'Orbitron',monospace", fontSize:"0.68rem", fontWeight:700, cursor:"pointer" }}>{isDesigner?"DESIGN":"ASK"}</button>
      </div>
    </div>
  );
};

const AiAdvisor = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1});
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="ai-advisor" ref={ref} style={{ position:"relative", zIndex:10 }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"100px 5%" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c8921a", marginBottom:"1rem" }}>// AI ADVISOR IN ACTION</div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700 }}>See HydroMind AI at Work</h2>
        </div>

        <div className="reveal grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", marginBottom:"2rem" }}>
          <ChatDemo mode="designer"/>
          <ChatDemo mode="troubleshooter"/>
        </div>

        {/* KB info bar */}
        <div className="reveal grid-5" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1rem" }}>
          {[["📖","OEM MANUALS","Rexroth, Eaton,\nLiebherr, Favco"],["📐","ISO SCHEMATICS","Open/closed loop,\ncrane circuits"],["⚗️","THEORY & LAWS","Pascal, Bernoulli,\nvalve theory"],["🔍","FAULT LIBRARY","Symptoms, causes,\nremedies"],["✏️","AI SCHEMATIC","AI draws circuit\nPDF / PNG export",true]].map(([icon,label,sub,highlight])=>(
            <div key={label} style={{ padding:"1rem", background:"rgba(4,20,40,0.7)", border:`1px solid ${highlight?"rgba(200,146,26,0.4)":"rgba(200,146,26,0.2)"}`, borderRadius:"6px", textAlign:"center", boxShadow:highlight?"0 0 20px rgba(200,146,26,0.1)":"none" }}>
              <div style={{fontSize:"1.4rem",marginBottom:"0.4rem"}}>{icon}</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.62rem",color:"#f0b429",letterSpacing:"0.08em"}}>{label}</div>
              <div style={{fontSize:"0.75rem",color:"#6b8fa8",marginTop:"0.3rem",whiteSpace:"pre-line"}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FEATURES ─────────────────────────────────────────────────
const Features = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1});
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const features = [
    ["🔩","System Designer AI","Input your parameters — AI designs the complete hydraulic circuit with pump, motor, tank, filters, pipelines and valves. Preferred make selection included."],
    ["🔧","Fault Troubleshooter","Ask any fault question — AI searches KB first, then web. Covers Liebherr LiDAT, Favco, Rexroth, Eaton, Sauer Danfoss systems."],
    ["📐","AI Schematic Drawing","AI generates complete ISO hydraulic schematics — open loop, closed loop, crane circuits. Downloadable as PDF or PNG with correct symbols."],
    ["📚","Knowledge Base (KB)","OEM manuals, ISO schematic examples, hydraulic theory, CBV/accumulator/relief valve procedures — all searchable by AI."],
    ["🌐","Live Web Search","When KB doesn't have the answer — AI searches the web for latest component specs, datasheets, and technical bulletins automatically."],
    ["🔢","9 Engineering Calculators","Flow rate, pressure drop, pump power, cylinder force, heat load, relief valve sizing — SI and Imperial dual-unit support."],
    ["⚡","Electrical & PLC Advisor","Proportional valve amplifier card setup, Rexroth / Eaton / Sauer Danfoss parameters, PLC fault logic and LiDAT support."],
    ["📋","Maintenance Reports","Auto-generate professional DPR and maintenance reports. Export-ready for site supervisors and asset managers."],
    ["📡","Industry News Feed","Latest hydraulic engineering innovations, offshore crane updates, and technology news — curated and summarised by AI."],
  ];

  return (
    <section id="features" ref={ref} style={{ position:"relative", zIndex:10 }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"100px 5%" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"4rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c8921a", marginBottom:"1rem" }}>// PLATFORM CAPABILITIES</div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700 }}>Everything a Hydraulic Engineer Needs</h2>
        </div>
        <div className="reveal grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }}>
          {features.map(([icon,title,desc]) => (
            <div key={title} className="reveal" style={{ background:"rgba(4,20,40,0.6)", border:"1px solid rgba(200,146,26,0.15)", borderRadius:"6px", padding:"2rem", position:"relative", overflow:"hidden", transition:"all 0.4s", cursor:"default" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(200,146,26,0.4)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.4)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(200,146,26,0.15)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
              <div style={{position:"absolute",top:0,left:0,width:"100%",height:"2px",background:"linear-gradient(90deg,transparent,#c8921a,transparent)",opacity:0,transition:"opacity 0.4s"}} className="card-top-line"/>
              <span style={{fontSize:"2rem",display:"block",marginBottom:"1.2rem"}}>{icon}</span>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.88rem",fontWeight:700,letterSpacing:"0.05em",color:"#f0b429",marginBottom:"0.8rem"}}>{title}</div>
              <div style={{fontSize:"0.92rem",color:"#6b8fa8",lineHeight:1.65}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── CALCULATORS ───────────────────────────────────────────────
const Calculators = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1});
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const calcs = [["01","Flow Rate","LPM / GPM converter"],["02","Pressure Drop","Line loss calculator"],["03","Cylinder Force","Bore & rod sizing"],["04","Pump Power","kW / HP output"],["05","Heat Load","Cooler sizing"],["06","Relief Valve","Cracking pressure"],["07","Pipe Velocity","Flow velocity check"],["08","Oil Volume","Tank sizing"],["09","Motor Torque","Nm / lb-ft output"]];

  return (
    <section id="calculators" ref={ref} style={{ position:"relative", zIndex:10, background:"linear-gradient(180deg,transparent,rgba(13,79,140,0.08),transparent)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"100px 5%" }}>
        <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }}>
          <div className="reveal">
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c8921a", marginBottom:"1rem" }}>// ENGINEERING CALCULATORS</div>
            <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(1.8rem,3.5vw,2.6rem)", fontWeight:700, lineHeight:1.15 }}>Precision Calculations.<br/>Field-Ready Results.</h2>
            <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#c8921a,#f0b429)",margin:"1.5rem 0"}}/>
            <p style={{fontSize:"1.1rem",color:"#6b8fa8",lineHeight:1.7}}>9 dedicated hydraulic engineering calculators — built for real site conditions. All results in SI and Imperial units simultaneously.</p>
          </div>
          <div className="reveal" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem" }}>
            {calcs.map(([num,name,detail]) => (
              <div key={num} style={{ background:"rgba(4,20,40,0.7)", border:"1px solid rgba(26,159,212,0.15)", borderRadius:"6px", padding:"1rem 1.2rem", display:"flex", alignItems:"center", gap:"1rem", transition:"all 0.3s", cursor:"default" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(26,159,212,0.5)";e.currentTarget.style.background="rgba(13,79,140,0.2)";e.currentTarget.style.transform="translateX(4px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(26,159,212,0.15)";e.currentTarget.style.background="rgba(4,20,40,0.7)";e.currentTarget.style.transform="none"}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.2rem",fontWeight:900,color:"rgba(200,146,26,0.3)",minWidth:"32px"}}>{num}</div>
                <div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"0.95rem",fontWeight:600,color:"#e8f4fd"}}>{name}</div>
                  <div style={{fontSize:"0.78rem",color:"#6b8fa8"}}>{detail}</div>
                </div>
                <span style={{color:"#1a9fd4",marginLeft:"auto",opacity:0,transition:"opacity 0.3s"}} className="calc-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── PRICING ───────────────────────────────────────────────────
const Pricing = ({ onLaunch }) => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1});
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} style={{ position:"relative", zIndex:10 }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"100px 5%" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c8921a", marginBottom:"1rem" }}>// ACCESS PLANS</div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700 }}>Simple, Transparent Pricing</h2>
        </div>
        <div className="reveal grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", maxWidth:"800px", margin:"0 auto" }}>
          {/* Free */}
          <div style={{ background:"rgba(4,20,40,0.7)", border:"1px solid rgba(200,146,26,0.2)", borderRadius:"8px", padding:"2.5rem", textAlign:"center" }}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#6b8fa8",marginBottom:"1rem"}}>Free Access</div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"3rem",fontWeight:900,color:"#f0b429",lineHeight:1}}><sup style={{fontSize:"1.2rem"}}>$</sup>0</div>
            <div style={{fontSize:"0.85rem",color:"#6b8fa8",margin:"0.3rem 0 2rem"}}>Forever free</div>
            <ul style={{listStyle:"none",textAlign:"left",marginBottom:"2rem"}}>
              {["3 AI queries/day (both modes)","Troubleshooter — KB search","Basic hydraulic calculators","Industry news feed",].map(f=>(
                <li key={f} style={{fontSize:"0.92rem",color:"#e8f4fd",padding:"6px 0",display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{color:"#c8921a",fontSize:"0.5rem"}}>◆</span>{f}
                </li>
              ))}
              {["System Designer AI","Web search fallback","AI Schematic Drawing","Full schematic library"].map(f=>(
                <li key={f} style={{fontSize:"0.92rem",color:"#6b8fa8",padding:"6px 0",display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{color:"#6b8fa8",fontSize:"0.5rem"}}>◆</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={onLaunch} style={{display:"block",width:"100%",padding:"12px",fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#1a9fd4",background:"transparent",border:"1px solid rgba(26,159,212,0.4)",borderRadius:"3px",cursor:"pointer",transition:"all 0.3s"}}
              onMouseEnter={e=>{e.target.style.background="rgba(26,159,212,0.1)";e.target.style.borderColor="#1a9fd4"}}
              onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor="rgba(26,159,212,0.4)"}}>
              Get Started Free
            </button>
          </div>
          {/* Premium */}
          <div style={{ background:"rgba(4,20,40,0.7)", border:"1px solid #c8921a", borderRadius:"8px", padding:"2.5rem", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 0 30px rgba(200,146,26,0.3)" }}>
            <div style={{position:"absolute",top:"14px",right:"-24px",background:"linear-gradient(135deg,#c8921a,#f0b429)",color:"#020b18",fontFamily:"'Orbitron',monospace",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.1em",padding:"4px 30px",transform:"rotate(35deg)",transformOrigin:"center"}}>MOST POPULAR</div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#6b8fa8",marginBottom:"1rem"}}>Premium Access</div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"3rem",fontWeight:900,color:"#f0b429",lineHeight:1}}><sup style={{fontSize:"1.2rem"}}>$</sup>59</div>
            <div style={{fontSize:"0.85rem",color:"#6b8fa8",margin:"0.3rem 0 2rem"}}>One-time payment — lifetime access</div>
            <ul style={{listStyle:"none",textAlign:"left",marginBottom:"2rem"}}>
              {["Unlimited AI queries — both modes","System Designer AI — full BOM output","AI Hydraulic Schematic Drawing","Troubleshooter — KB + web search","All 9 engineering calculators","Full ISO schematic library (KB)","Electrical & PLC advisor","Maintenance report generation","Priority feature updates"].map(f=>(
                <li key={f} style={{fontSize:"0.92rem",color:"#e8f4fd",padding:"6px 0",display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{color:"#c8921a",fontSize:"0.5rem"}}>◆</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={onLaunch} style={{display:"block",width:"100%",padding:"12px",fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#020b18",background:"linear-gradient(135deg,#c8921a,#f0b429)",border:"none",borderRadius:"3px",cursor:"pointer",transition:"all 0.3s",boxShadow:"0 0 20px rgba(200,146,26,0.3)"}}
              onMouseEnter={e=>{e.target.style.boxShadow="0 0 40px rgba(200,146,26,0.6)";e.target.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.target.style.boxShadow="0 0 20px rgba(200,146,26,0.3)";e.target.style.transform="none"}}>
              Unlock Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── FEEDBACK MODAL ────────────────────────────────────────────
const FeedbackModal = ({ onClose }) => {
  const [rating, setRating]   = useState(0);
  const [category, setCat]    = useState("");
  const [message, setMsg]     = useState("");
  const [email, setEmail]     = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(false);

  const submit = () => {
    if (!message.trim()) { setError(true); return; }
    setError(false);
    setSuccess(true);
    setTimeout(() => { onClose(); setSuccess(false); setRating(0); setCat(""); setMsg(""); setEmail(""); }, 2200);
  };

  const ratings = [["★","Poor"],["★★","Fair"],["★★★","Good"],["★★★★","Great"],["★★★★★","Excellent"]];
  const cats    = ["AI Accuracy","Feature Request","Bug Report","KB Content","General"];

  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:999,background:"rgba(2,11,24,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:"rgba(4,20,40,0.97)",border:"1px solid rgba(200,146,26,0.25)",borderRadius:"10px",padding:"2.5rem",maxWidth:"500px",width:"90%",position:"relative",boxShadow:"0 0 60px rgba(200,146,26,0.2)" }}>
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"3px",background:"linear-gradient(90deg,#c8921a,#f0b429,#1a9fd4)",borderRadius:"10px 10px 0 0"}}/>
        <button onClick={onClose} style={{position:"absolute",top:"14px",right:"16px",background:"none",border:"none",color:"#6b8fa8",fontSize:"1.3rem",cursor:"pointer"}}>✕</button>

        <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.65rem",letterSpacing:"0.2em",color:"#c8921a",marginBottom:"0.5rem"}}>// USER FEEDBACK</div>
        <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:"1.1rem",fontWeight:700,color:"#e8f4fd",marginBottom:"0.4rem"}}>Share Your Feedback</h3>
        <p style={{fontSize:"0.88rem",color:"#6b8fa8",marginBottom:"1.5rem",lineHeight:1.6}}>Help us improve HydroMind AI. Your input shapes the next version.</p>

        {/* Rating */}
        <div style={{marginBottom:"1.2rem"}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:"#6b8fa8",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>HOW WOULD YOU RATE HYDROMIND AI?</div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            {ratings.map(([stars,label],i) => (
              <button key={i} onClick={()=>setRating(i+1)} style={{ flex:1,padding:"8px 4px",background:rating===i+1?"rgba(200,146,26,0.2)":"rgba(200,146,26,0.06)",border:`1px solid ${rating===i+1?"#c8921a":"rgba(200,146,26,0.2)"}`,borderRadius:"4px",color:rating===i+1?"#f0b429":"#6b8fa8",fontFamily:"'Orbitron',monospace",fontSize:"0.6rem",cursor:"pointer",transition:"all 0.2s" }}>
                {stars}<br/>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{marginBottom:"1.2rem"}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:"#6b8fa8",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>FEEDBACK TYPE</div>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
            {cats.map(c => (
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"6px 14px",background:category===c?"rgba(26,159,212,0.15)":"rgba(26,159,212,0.06)",border:`1px solid ${category===c?"#1a9fd4":"rgba(26,159,212,0.2)"}`,borderRadius:"3px",color:category===c?"#1a9fd4":"#6b8fa8",fontFamily:"'Rajdhani',sans-serif",fontSize:"0.85rem",fontWeight:600,cursor:"pointer",transition:"all 0.2s" }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{marginBottom:"1.2rem"}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:"#6b8fa8",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>YOUR MESSAGE</div>
          <textarea value={message} onChange={e=>{setMsg(e.target.value);setError(false)}} placeholder="Describe your experience, suggestion or issue..." style={{ width:"100%",minHeight:"90px",background:"rgba(255,255,255,0.04)",border:`1px solid ${error?"rgba(232,64,64,0.6)":"rgba(26,159,212,0.2)"}`,borderRadius:"4px",padding:"10px 12px",color:"#e8f4fd",fontSize:"0.9rem",lineHeight:1.5,resize:"vertical" }}/>
          {error && <div style={{fontSize:"0.78rem",color:"#e84040",marginTop:"4px"}}>Message is required.</div>}
        </div>

        {/* Email */}
        <div style={{marginBottom:"1.5rem"}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:"#6b8fa8",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>EMAIL (OPTIONAL)</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com — for follow-up only" style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(26,159,212,0.2)",borderRadius:"4px",padding:"9px 12px",color:"#e8f4fd",fontSize:"0.9rem" }}/>
        </div>

        <button onClick={submit} style={{ width:"100%",padding:"13px",background:"linear-gradient(135deg,#c8921a,#f0b429)",border:"none",borderRadius:"4px",color:"#020b18",fontFamily:"'Orbitron',monospace",fontSize:"0.78rem",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.3s",boxShadow:"0 0 20px rgba(200,146,26,0.3)" }}
          onMouseEnter={e=>e.target.style.boxShadow="0 0 40px rgba(200,146,26,0.6)"}
          onMouseLeave={e=>e.target.style.boxShadow="0 0 20px rgba(200,146,26,0.3)"}>
          SUBMIT FEEDBACK
        </button>

        {success && (
          <div style={{marginTop:"1rem",padding:"0.8rem",background:"rgba(40,202,65,0.1)",border:"1px solid rgba(40,202,65,0.3)",borderRadius:"4px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.8rem",color:"#28ca41",letterSpacing:"0.08em"}}>
            ✅ THANK YOU — FEEDBACK RECEIVED
          </div>
        )}
      </div>
    </div>
  );
};

// ── FOOTER ────────────────────────────────────────────────────
const Footer = ({ onFeedback }) => (
  <footer style={{ position:"relative",zIndex:10,borderTop:"1px solid rgba(200,146,26,0.25)",padding:"3rem 5%",background:"rgba(2,11,24,0.9)" }}>
    <div style={{ maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1.5rem" }}>
      <div style={{fontSize:"0.85rem",color:"#6b8fa8"}}>
        © 2026 <strong style={{color:"#f0b429"}}>HydroMind AI</strong> — hydromindai.com<br/>
        <span style={{fontSize:"0.78rem"}}>Hydraulic AI Advisor — Design & Troubleshoot, powered by KB + Web Intelligence</span>
      </div>
      <ul style={{display:"flex",gap:"2rem",listStyle:"none"}}>
        {[["Privacy","#"],["Terms","#"]].map(([label,href])=>(
          <li key={label}><a href={href} style={{fontSize:"0.85rem",color:"#6b8fa8",textDecoration:"none",transition:"color 0.3s",letterSpacing:"0.05em"}} onMouseEnter={e=>e.target.style.color="#f0b429"} onMouseLeave={e=>e.target.style.color="#6b8fa8"}>{label}</a></li>
        ))}
        <li>
          <button onClick={onFeedback} style={{background:"none",border:"none",fontSize:"0.85rem",color:"#f0b429",cursor:"pointer",letterSpacing:"0.05em",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>💬 Feedback</button>
        </li>
      </ul>
    </div>
  </footer>
);

// ── LAUNCH APP MODAL (Login / Register) ──────────────────────
const LaunchModal = ({ onClose }) => {
  const [view, setView]       = useState("login"); // login | register | forgot
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text:"", type:"" });

  const reset = () => { setMsg({text:"",type:""}); };

  const handleLogin = async () => {
    if (!email || !password) { setMsg({text:"Email and password required.",type:"error"}); return; }
    setLoading(true); reset();
    try {
      const res = await fetch(`${API}/api/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setMsg({ text:`✅ Welcome back${data.user?.name ? ", "+data.user.name : ""}! Redirecting...`, type:"success" });
      setTimeout(() => { onClose(); window.location.reload(); = `${API.replace("/api","")}`; }, 1500);
    } catch(e) { setMsg({text:e.message,type:"error"}); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) { setMsg({text:"All fields required.",type:"error"}); return; }
    setLoading(true); reset();
    try {
      const res = await fetch(`${API}/api/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMsg({ text:"✅ Account created! You can now sign in.", type:"success" });
      setTimeout(() => setView("login"), 1600);
    } catch(e) { setMsg({text:e.message,type:"error"}); }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email) { setMsg({text:"Email required.",type:"error"}); return; }
    setLoading(true); reset();
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg({ text:"✅ Reset link sent! Check your inbox.", type:"success" });
    } catch(e) { setMsg({text:e.message,type:"error"}); }
    setLoading(false);
  };

  const inputStyle = { width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(26,159,212,0.25)",borderRadius:"4px",padding:"11px 14px",color:"#e8f4fd",fontSize:"0.95rem",marginBottom:"1rem",outline:"none" };
  const btnStyle   = { width:"100%",padding:"13px",background:"linear-gradient(135deg,#c8921a,#f0b429)",border:"none",borderRadius:"4px",color:"#020b18",fontFamily:"'Orbitron',monospace",fontSize:"0.78rem",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",marginTop:"0.5rem",opacity:loading?0.7:1 };
  const linkStyle  = { background:"none",border:"none",color:"#1a9fd4",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:"0.9rem",textDecoration:"underline",padding:0 };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:999,background:"rgba(2,11,24,0.88)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"rgba(4,20,40,0.97)",border:"1px solid rgba(200,146,26,0.3)",borderRadius:"10px",padding:"2.5rem",maxWidth:"420px",width:"90%",position:"relative",boxShadow:"0 0 60px rgba(200,146,26,0.2)"}}>
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"3px",background:"linear-gradient(90deg,#c8921a,#f0b429,#1a9fd4)",borderRadius:"10px 10px 0 0"}}/>
        <button onClick={onClose} style={{position:"absolute",top:"14px",right:"16px",background:"none",border:"none",color:"#6b8fa8",fontSize:"1.3rem",cursor:"pointer"}}>✕</button>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.2rem",fontWeight:700}}>Hydro<span style={{color:"#f0b429"}}>Mind</span> AI</div>
          <div style={{fontSize:"0.8rem",color:"#6b8fa8",marginTop:"0.3rem"}}>
            {view==="login"?"Sign in to your account":view==="register"?"Create your account":"Reset your password"}
          </div>
        </div>

        {view==="register" && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" style={inputStyle}/>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle}/>
        {(view==="login"||view==="register") && <input value={password} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={inputStyle}/>}

        {msg.text && (
          <div style={{padding:"0.7rem",borderRadius:"4px",marginBottom:"1rem",fontSize:"0.88rem",background:msg.type==="success"?"rgba(40,202,65,0.1)":"rgba(232,64,64,0.1)",border:`1px solid ${msg.type==="success"?"rgba(40,202,65,0.3)":"rgba(232,64,64,0.3)"}`,color:msg.type==="success"?"#28ca41":"#e84040"}}>{msg.text}</div>
        )}

        <button onClick={view==="login"?handleLogin:view==="register"?handleRegister:handleForgot} style={btnStyle} disabled={loading}>
          {loading?"PROCESSING...":(view==="login"?"SIGN IN":view==="register"?"CREATE ACCOUNT":"SEND RESET LINK")}
        </button>

        <div style={{marginTop:"1.2rem",textAlign:"center",fontSize:"0.9rem",color:"#6b8fa8"}}>
          {view==="login" && <>
            <button style={linkStyle} onClick={()=>{setView("forgot");reset();}}>Forgot password?</button>
            <span style={{margin:"0 0.5rem"}}>·</span>
            <button style={linkStyle} onClick={()=>{setView("register");reset();}}>Create account</button>
          </>}
          {view==="register" && <button style={linkStyle} onClick={()=>{setView("login");reset();}}>Already have an account? Sign in</button>}
          {view==="forgot"   && <button style={linkStyle} onClick={()=>{setView("login");reset();}}>← Back to sign in</button>}
        </div>
      </div>
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────────
export default function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLaunch,   setShowLaunch]   = useState(false);

  // Check URL for password reset token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset")) setShowLaunch(true);
  }, []);

  return (
    <>
      <GlobalStyle/>
      <HydraulicBackground/>
      <GridOverlay/>

      <Nav onFeedback={() => setShowFeedback(true)} onLaunch={() => setShowLaunch(true)}/>
      <Hero onLaunch={() => setShowLaunch(true)}/>
      <HowItWorks/>
      <AiAdvisor/>
      <Features/>
      <Calculators/>
      <Pricing onLaunch={() => setShowLaunch(true)}/>
      <Footer onFeedback={() => setShowFeedback(true)}/>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)}/>}
      {showLaunch   && <LaunchModal   onClose={() => setShowLaunch(false)}/>}
    </>
  );
}
