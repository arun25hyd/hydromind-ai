/* ================================================================
   HydroMind.AI — Auth & Sidebar v3.0
   Single source of truth for all auth, session, sidebar rendering
   ================================================================ */
const ADMIN_EMAIL = 'arun25hyd@gmail.com';
const HM_SESSION  = 'hm_session';
const HM_USERS    = 'hm_users';
const HM_HISTORY  = 'hm_history';
const HM_TOKEN    = 'hm_token';
const HM_AUTH_API = 'https://hydromind-backend.onrender.com/api/auth';

/* ── Token storage (JWT from backend) ── */
function hmGetToken(){ try{return localStorage.getItem(HM_TOKEN)||null;}catch{return null;} }
function hmSaveToken(t){ try{localStorage.setItem(HM_TOKEN,t);}catch(e){} }
function hmClearToken(){ try{localStorage.removeItem(HM_TOKEN);}catch(e){} }

/* ── Storage ── */
function hmGetSession(){ try{return JSON.parse(localStorage.getItem(HM_SESSION))||null;}catch{return null;} }
function hmSaveSession(u){ localStorage.setItem(HM_SESSION,JSON.stringify(u)); }
function hmClearSession(){ localStorage.removeItem(HM_SESSION); }
function hmGetUsers()    { try{return JSON.parse(localStorage.getItem(HM_USERS))||{};}catch{return {};} }
function hmSaveUser(e,d) { const u=hmGetUsers(); u[e]=d; localStorage.setItem(HM_USERS,JSON.stringify(u)); }
function hmGetHistory()  { try{return JSON.parse(localStorage.getItem(HM_HISTORY))||[];}catch{return [];} }
function addChatToHistory(title,mode,messages){
  const h=hmGetHistory();
  const id=Date.now();
  h.unshift({id,title:(title||'').slice(0,52),mode,date:new Date().toLocaleDateString(),messages:messages||[]});
  if(h.length>60)h.pop();
  localStorage.setItem(HM_HISTORY,JSON.stringify(h));
  return id;
}
function updateChatHistory(id,messages){
  const h=hmGetHistory();
  const entry=h.find(e=>e.id===id);
  if(entry){entry.messages=messages;localStorage.setItem(HM_HISTORY,JSON.stringify(h));}
}

/* ── Auth modal ── */
function openAuthModal(tab){
  const o=document.getElementById('hmAuthOverlay');
  if(!o)return;
  o.style.display='flex';
  document.body.style.overflow='hidden';
  switchAuthTab(tab||'login');
  ['hmLoginEmail','hmLoginPass','hmRegFirst','hmRegLast','hmRegEmail','hmRegPass','hmForgotEmail']
    .forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const e=document.getElementById('hmAuthError');if(e){e.style.display='none';e.textContent='';}
  const ok=document.getElementById('hmForgotOk');if(ok)ok.style.display='none';
}
function closeAuthModal(){
  const o=document.getElementById('hmAuthOverlay');
  if(o)o.style.display='none';
  document.body.style.overflow='';
}
function switchAuthTab(tab){
  ['login','register','forgot'].forEach(t=>{
    const p=document.getElementById('hmPanel_'+t);
    if(p)p.style.display=(t===tab)?'block':'none';
  });
  ['login','register'].forEach(t=>{
    const b=document.getElementById('hmTab_'+t);if(!b)return;
    const on=(t===tab);
    b.style.background=on?'rgba(6,182,212,0.12)':'transparent';
    b.style.color=on?'#22d3ee':'#7fb3c8';
    b.style.borderBottom=on?'2px solid #06b6d4':'2px solid transparent';
    b.classList.toggle('active',on);
  });
}
function _authErr(msg){
  const el=document.getElementById('hmAuthError');
  if(el){el.textContent=msg;el.style.display='block';}
}

/* ── Login (backend Supabase auth) ── */
async function doLogin(){
  const email=(document.getElementById('hmLoginEmail')?.value||'').trim().toLowerCase();
  const pass=(document.getElementById('hmLoginPass')?.value||'');
  if(!email||!pass){_authErr('Please fill in both fields.');return;}
  const btn=document.getElementById('hmLoginBtn');
  const origTxt=btn?btn.textContent:'';
  if(btn){btn.disabled=true;btn.textContent='Signing in…';}
  _authErr('');
  try{
    const res=await fetch(HM_AUTH_API+'/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password:pass})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok){
      const msg = data.error || 'Invalid email or password.';
      _authErr(msg);
      /* Show "Register instead" hint when credentials are wrong */
      const errEl = document.getElementById('hmAuthError');
      if(errEl){
        errEl.innerHTML = msg +
          '<br><span style="font-size:11.5px;color:#94a3b8;display:block;margin-top:6px;">' +
          'New to HydroMind? <a href="#" onclick="event.preventDefault();openAuthModal(\'register\');" ' +
          'style="color:#22d3ee;text-decoration:none;font-weight:700;">Create a free account →</a></span>';
      }
      if(btn){btn.disabled=false;btn.textContent=origTxt;}
      return;
    }
    if(data.token)hmSaveToken(data.token);
    const u=data.user||{};
    const isAdmin=(u.email===ADMIN_EMAIL);
    const user={
      first:(u.name||'').split(' ')[0]||'',
      last:(u.name||'').split(' ').slice(1).join(' ')||'',
      email:u.email||email,
      plan:isAdmin?'Admin':(u.isPremium?'Pro':'Free'),
      isAdmin,
      id:u.id
    };
    hmSaveSession(user);
    closeAuthModal();
    hmOnLogin(user);
  }catch(err){
    _authErr('Connection error — the server may be waking up. Please wait 30 seconds and try again.');
    if(btn){btn.disabled=false;btn.textContent=origTxt;}
  }
}

/* ── Register (backend Supabase auth) ── */
async function doRegister(){
  const first=(document.getElementById('hmRegFirst')?.value||'').trim();
  const last=(document.getElementById('hmRegLast')?.value||'').trim();
  const email=(document.getElementById('hmRegEmail')?.value||'').trim().toLowerCase();
  const pass=(document.getElementById('hmRegPass')?.value||'');
  if(!first||!email||!pass){_authErr('Please fill in all required fields.');return;}
  if(pass.length<6){_authErr('Password must be at least 6 characters.');return;}
  const btn=document.getElementById('hmRegBtn');
  const origTxt=btn?btn.textContent:'';
  if(btn){btn.disabled=true;btn.textContent='Creating account…';}
  _authErr('');
  const fullName=(first+(last?' '+last:'')).trim();
  try{
    const res=await fetch(HM_AUTH_API+'/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:fullName,email,password:pass})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok){
      _authErr(data.error||'Could not create account. Please try again.');
      if(btn){btn.disabled=false;btn.textContent=origTxt;}
      return;
    }
    if(data.token)hmSaveToken(data.token);
    const u=data.user||{};
    const isAdmin=(u.email===ADMIN_EMAIL);
    const plan=isAdmin?'Admin':(u.isPremium?'Pro':'Free');
    const user={first,last,email:u.email||email,plan,isAdmin,id:u.id,joined:new Date().toLocaleDateString()};
    hmSaveSession(user);
    closeAuthModal();
    hmOnLogin(user);
    setTimeout(()=>{
      const welcomeEl=document.createElement('div');
      welcomeEl.style.cssText='position:fixed;top:80px;right:1.5rem;z-index:9999;background:#fff;border:1px solid var(--accent-glow);border-radius:12px;padding:14px 18px;font-family:Inter,sans-serif;font-size:13px;color:var(--text1);max-width:280px;box-shadow:0 8px 32px rgba(8,145,178,0.15);';
      welcomeEl.innerHTML='<div style="font-weight:800;font-size:14px;color:var(--accent);margin-bottom:4px;">Welcome, '+first+'! ✓</div><div style="font-size:12px;color:var(--text2);line-height:1.5;">Your '+plan+' account is ready.<br>Start with the AI Advisor.</div>';
      document.body.appendChild(welcomeEl);
      setTimeout(()=>welcomeEl.remove(),5000);
    },300);
  }catch(err){
    _authErr('Connection error — the server may be waking up. Please wait 30 seconds and try again.');
    if(btn){btn.disabled=false;btn.textContent=origTxt;}
  }
}

/* ── Forgot (backend) ── */
async function doForgot(){
  const email=(document.getElementById('hmForgotEmail')?.value||'').trim().toLowerCase();
  if(!email){_authErr('Please enter your email.');return;}
  const ok=document.getElementById('hmForgotOk');
  if(!ok)return;
  ok.textContent='Sending…';
  ok.style.cssText='display:block;background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.25);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#22d3ee;margin-bottom:.85rem;';
  try{
    const res=await fetch(HM_AUTH_API+'/forgot-password',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    const data=await res.json().catch(()=>({}));
    ok.textContent=(data&&data.message)?('✅ '+data.message):'✅ If this email is registered, a reset link has been sent.';
    ok.style.cssText='display:block;background:rgba(61,214,140,.07);border:1px solid rgba(61,214,140,.2);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#3dd68c;margin-bottom:.85rem;';
    setTimeout(()=>ok.style.display='none',8000);
  }catch(err){
    ok.textContent='⚠️ Connection error — the server may be waking up. Try again in 30 seconds.';
    ok.style.cssText='display:block;background:rgba(245,200,66,.07);border:1px solid rgba(245,200,66,.25);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#f5c842;margin-bottom:.85rem;';
  }
}

/* ── Logout ── */
function doLogout(){
  if(!confirm('Sign out of HydroMind.AI?'))return;
  hmClearSession();
  hmClearToken();
  window.location.reload();
}

/* ── After login ── */
function hmOnLogin(user){
  window._hmUser=user;
  _updateNavbar(user);
  _injectNavUserChip(user);
  _updateLeftSidebar(user);
  _updateRightSidebar(user);
  const lb=document.getElementById('hmLogoutBtn');if(lb)lb.style.display='block';
  window.dispatchEvent(new CustomEvent('hm:login',{detail:user}));
}

/* ── Navbar ── */
function _updateNavbar(user){
  const login=document.getElementById('hmNavLogin');
  const reg  =document.getElementById('hmNavRegister');
  const chip =document.getElementById('hmNavUser');
  if(login)login.style.display='none';
  if(reg)  reg.style.display  ='none';
  document.querySelectorAll('#hmMobLogin,#hmMobRegister').forEach(el=>el&&(el.style.display='none'));
  if(chip){
    chip.style.display='flex';
    const av=document.getElementById('hmNavAvatar');
    const nm=document.getElementById('hmNavName');
    const pl=document.getElementById('hmNavPlan');
    if(av){av.textContent=(user.first||user.email).slice(0,2).toUpperCase();av.style.background='linear-gradient(135deg,#0e7490,#06b6d4)';}
    if(nm)nm.textContent=(user.first||user.email.split('@')[0]);
    if(pl){
      pl.textContent=user.isAdmin?'Admin':user.plan;
      pl.style.color=user.isAdmin?'#06b6d4':(user.plan==='Pro'||user.plan==='Enterprise')?'#22c55e':'#06b6d4';
      pl.style.background=user.isAdmin?'rgba(6,182,212,.15)':(user.plan==='Pro'||user.plan==='Enterprise')?'rgba(34,197,94,.1)':'rgba(6,182,212,.1)';
    }
  }
}

/* ── Left sidebar ── */
function _updateLeftSidebar(user){
  const noAuth =document.getElementById('hmSidebarNoAuth');
  const profile=document.getElementById('hmSidebarProfile');
  const history=document.getElementById('hmSidebarHistory');
  const links  =document.getElementById('hmSidebarLinks');
  if(noAuth) noAuth.style.display ='none';
  if(profile)profile.style.display='block';
  if(history)history.style.display='block';
  if(links)  links.style.display  ='block';
  const av=document.getElementById('hmProfAvatar');
  const nm=document.getElementById('hmProfName');
  const em=document.getElementById('hmProfEmail');
  const pl=document.getElementById('hmProfPlan');
  if(av)av.textContent=(user.first||user.email).slice(0,2).toUpperCase();
  if(nm)nm.textContent=[user.first,user.last].filter(Boolean).join(' ')||user.email.split('@')[0];
  if(em)em.textContent=user.email;
  if(pl){
    pl.textContent=user.plan;
    pl.style.background=user.isAdmin?'rgba(6,182,212,.15)':(user.plan==='Pro'||user.plan==='Enterprise')?'rgba(34,197,94,.1)':'rgba(6,182,212,.08)';
    pl.style.color=user.isAdmin?'#06b6d4':(user.plan==='Pro'||user.plan==='Enterprise')?'#22c55e':'#06b6d4';
  }
  // Add edit button
  const pc=document.querySelector('.hm-profile-card');
  if(pc&&!document.getElementById('hmProfEditBtn')){
    const btn=document.createElement('button');
    btn.id='hmProfEditBtn';btn.title='Edit Profile';btn.innerHTML='✎';
    btn.style.cssText='position:absolute;top:8px;right:8px;background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.2);border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#06b6d4;font-size:.8rem;transition:.18s;';
    btn.onclick=openProfileEdit;pc.appendChild(btn);
  }
  _renderHistory();
}

function _renderHistory(){
  const c=document.getElementById('hmHistoryList');if(!c)return;
  const hist=hmGetHistory();
  if(!hist.length){c.innerHTML='<div style="font-size:.72rem;color:var(--text3);text-align:center;padding:.75rem;">No history yet</div>';return;}
  const icons={hyd:'⚙️',elec:'⚡',crane:'🏗️',fluid:'🛢️',calc:'📐'};
  const tags ={hyd:'Hyd',elec:'Elec',crane:'Crane',fluid:'Oil',calc:'Calc'};
  const cols ={hyd:'tag-hyd',elec:'tag-elec',crane:'tag-crane',fluid:'tag-hyd',calc:'tag-calc'};
  const groups={hyd:[],elec:[],calc:[],other:[]};
  hist.forEach(h=>{
    if(['hyd','crane','fluid'].includes(h.mode))groups.hyd.push(h);
    else if(h.mode==='elec')groups.elec.push(h);
    else if(h.mode==='calc')groups.calc.push(h);
    else groups.other.push(h);
  });
  const rg=(label,icon,items)=>{
    if(!items.length)return'';
    return`<div class="hm-hist-group"><div class="hm-hist-label">${icon} ${label}</div>${
      items.slice(0,5).map(h=>`<div class="hm-hist-item" onclick="loadChat(${h.id})"><span class="hm-hist-icon">${icons[h.mode]||'💬'}</span><span class="hm-hist-text">${h.title}</span><span class="hm-hist-tag ${cols[h.mode]||'tag-hyd'}">${tags[h.mode]||''}</span></div>`).join('')
    }</div>`;
  };
  c.innerHTML=rg('Hydraulic','🔧',groups.hyd)+rg('Electrical','⚡',groups.elec)+rg('Calculator','📐',groups.calc)+rg('Other','💬',groups.other);
}

function loadChat(id){
  const isPages=window.location.pathname.includes('/pages/');
  const base=isPages?'advisor.html':'pages/advisor.html';
  window.location.href=base+'?loadchat='+id;
}

/* ── Right sidebar ── */
function _updateRightSidebar(user){
  const sidebar=document.getElementById('hmAdSidebar');
  const badge  =document.getElementById('hmNoAdBadge');
  if(!sidebar)return;
  const isPaid=user&&(user.isAdmin||user.plan==='Pro'||user.plan==='Enterprise');
  ['hmAd1','hmAd2','hmAd3','hmAd4','hmAd5','hmAdTitle'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.style.display=isPaid?'none':'';
  });
  if(badge)badge.style.display=isPaid?'block':'none';
}

/* ── Profile edit ── */
function openProfileEdit(){
  const user=hmGetSession();if(!user)return;
  const ex=document.getElementById('hmProfileEditModal');if(ex)ex.remove();
  const modal=document.createElement('div');
  modal.id='hmProfileEditModal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(1,6,16,.92);backdrop-filter:blur(12px);z-index:10000;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML=`<div style="background:rgba(6,18,40,.98);border:1px solid rgba(0,212,255,.22);border-radius:16px;width:100%;max-width:400px;margin:0 1.25rem;overflow:hidden;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.5rem;border-bottom:1px solid rgba(0,212,255,.12);">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:700;color:#e8f4ff;">Edit Profile</div>
      <button onclick="document.getElementById('hmProfileEditModal').remove()" style="background:none;border:none;color:rgba(200,216,232,.4);font-size:1.2rem;cursor:pointer;">×</button>
    </div>
    <div style="padding:1.5rem;">
      <div style="margin-bottom:.9rem;"><label style="font-family:'JetBrains Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.07em;color:rgba(200,216,232,.4);display:block;margin-bottom:5px;">First Name</label><input type="text" id="editFirst" value="${user.first||''}" style="width:100%;background:rgba(2,10,22,.85);border:1px solid rgba(0,212,255,.16);border-radius:8px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#e8f4ff;outline:none;box-sizing:border-box;"></div>
      <div style="margin-bottom:.9rem;"><label style="font-family:'JetBrains Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.07em;color:rgba(200,216,232,.4);display:block;margin-bottom:5px;">Last Name</label><input type="text" id="editLast" value="${user.last||''}" style="width:100%;background:rgba(2,10,22,.85);border:1px solid rgba(0,212,255,.16);border-radius:8px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#e8f4ff;outline:none;box-sizing:border-box;"></div>
      <div style="margin-bottom:.9rem;"><label style="font-family:'JetBrains Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.07em;color:rgba(200,216,232,.4);display:block;margin-bottom:5px;">Email (read-only)</label><input type="email" value="${user.email}" readonly style="width:100%;background:rgba(2,10,22,.5);border:1px solid rgba(0,212,255,.08);border-radius:8px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:rgba(200,216,232,.4);outline:none;box-sizing:border-box;cursor:not-allowed;"></div>
      <div style="margin-bottom:1.5rem;"><label style="font-family:'JetBrains Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.07em;color:rgba(200,216,232,.4);display:block;margin-bottom:5px;">New Password (leave blank to keep current)</label><input type="password" id="editPass" placeholder="Enter new password" style="width:100%;background:rgba(2,10,22,.85);border:1px solid rgba(0,212,255,.16);border-radius:8px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#e8f4ff;outline:none;box-sizing:border-box;"></div>
      <div id="editMsg" style="display:none;background:rgba(61,214,140,.07);border:1px solid rgba(61,214,140,.2);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#3dd68c;margin-bottom:.9rem;"></div>
      <button onclick="saveProfileEdit()" style="width:100%;background:linear-gradient(135deg,#00d4ff,#0070cc);border:none;border-radius:8px;padding:12px;color:#000;font-family:'DM Sans',sans-serif;font-weight:600;font-size:.92rem;cursor:pointer;">Save Changes</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function saveProfileEdit(){
  const user=hmGetSession();if(!user)return;
  const first=document.getElementById('editFirst')?.value.trim()||user.first;
  const last =document.getElementById('editLast')?.value.trim()||user.last;
  const pass =document.getElementById('editPass')?.value;
  const msg  =document.getElementById('editMsg');
  if(pass&&pass.length<6){if(msg){msg.textContent='Password must be at least 6 characters.';msg.style.color='#e24b4a';msg.style.display='block';}return;}
  const users=hmGetUsers();
  if(users[user.email]){users[user.email].first=first;users[user.email].last=last;if(pass)users[user.email].pass=btoa(unescape(encodeURIComponent(pass)));localStorage.setItem(HM_USERS,JSON.stringify(users));}
  const updated={...user,first,last};if(pass)updated.pass=btoa(unescape(encodeURIComponent(pass)));
  hmSaveSession(updated);
  const nm=document.getElementById('hmProfName');if(nm)nm.textContent=[first,last].filter(Boolean).join(' ');
  const av=document.getElementById('hmProfAvatar');if(av)av.textContent=first.slice(0,2).toUpperCase();
  const navNm=document.getElementById('hmNavName');if(navNm)navNm.textContent=first;
  if(msg){msg.textContent='✓ Profile updated!';msg.style.color='#3dd68c';msg.style.display='block';}
  setTimeout(()=>{const m=document.getElementById('hmProfileEditModal');if(m)m.remove();},1800);
}


/* ── Active navbar link ── */
function hmSetActiveNav() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-link').forEach(a => {
    const rawHref = a.getAttribute('href') || '';
    // Skip anchor links like #calculator, #electrical - they are not pages
    if (rawHref.startsWith('#')) return;
    const href = rawHref.split('/').pop().split('#')[0] || 'index.html';
    const isActive = href === page ||
      (page === '' && href === 'index.html') ||
      (page === 'index.html' && href === 'index.html');
    // Reset - remove active class
    a.classList.remove('active');
    // Reset gold color (but keep Electrical yellow untouched)
    if (a.style.color === 'var(--gold)' || a.style.color === 'rgb(200, 165, 80)') {
      a.style.color = '';
    }
    if (isActive) {
      a.classList.add('active');
      a.style.color = 'var(--gold)';
    }
  });
}

/* ── Inject auth modal HTML — Dark Theme v4.0 ── */
function _injectAuthModal(){
  if(document.getElementById('hmAuthOverlay'))return;
  const INP='width:100%;padding:10px 13px;border:1.5px solid rgba(6,182,212,0.22);border-radius:8px;font-size:13.5px;color:#e2f0f5;background:#0d1720;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color 0.15s;';
  const el=document.createElement('div');
  el.id='hmAuthOverlay';
  el.style.cssText='display:none;position:fixed;inset:0;background:rgba(8,15,20,0.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:9999;align-items:center;justify-content:center;';
  el.innerHTML=`
  <div style="background:#111d2a;border:1px solid rgba(6,182,212,0.30);border-radius:20px;width:100%;max-width:420px;margin:0 20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.7),0 0 32px rgba(6,182,212,0.08);">
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(6,182,212,0.12);background:#0d1720;">
      <div style="display:flex;gap:4px;">
        <button id="hmTab_login" onclick="switchAuthTab('login')" style="padding:7px 18px;border:none;border-bottom:2px solid #06b6d4;background:rgba(6,182,212,0.10);color:#22d3ee;font-weight:700;font-size:13px;border-radius:7px 7px 0 0;cursor:pointer;font-family:inherit;transition:all 0.15s;">Log In</button>
        <button id="hmTab_register" onclick="switchAuthTab('register')" style="padding:7px 18px;border:none;border-bottom:2px solid transparent;background:transparent;color:#7fb3c8;font-weight:600;font-size:13px;border-radius:7px 7px 0 0;cursor:pointer;font-family:inherit;transition:all 0.15s;">Register</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:6px;height:6px;background:#10b981;border-radius:50%;"></div>
        <span style="font-size:10px;font-weight:600;color:#10b981;">HydroMind.AI</span>
        <button onclick="closeAuthModal()" style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.20);border-radius:50%;width:26px;height:26px;font-size:15px;color:#ef4444;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-left:8px;line-height:1;font-family:inherit;">×</button>
      </div>
    </div>
    <!-- Body -->
    <div style="padding:22px;">
      <div id="hmAuthError" style="display:none;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.30);border-radius:8px;padding:10px 14px;font-size:13px;color:#ef4444;margin-bottom:14px;"></div>

      <!-- LOGIN -->
      <div id="hmPanel_login">
        <div style="margin-bottom:14px;">
          <label for="hmLoginEmail" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Email Address</label>
          <input id="hmLoginEmail" type="email" placeholder="engineer@company.com" style="${INP}" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'">
        </div>
        <div style="margin-bottom:20px;">
          <label for="hmLoginPass" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Password</label>
          <div style="position:relative;">
            <input id="hmLoginPass" type="password" placeholder="Enter your password" style="${INP};padding-right:42px;" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'" onkeydown="if(event.key==='Enter')doLogin()">
            <span onclick="(function(b){var i=document.getElementById('hmLoginPass');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈'})(this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;user-select:none;line-height:1;" title="Show/hide password">👁</span>
          </div>
        </div>
        <button id="hmLoginBtn" onclick="doLogin()" style="width:100%;padding:12px;background:linear-gradient(135deg,#06b6d4,#0e7490);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity 0.15s;box-shadow:0 2px 12px rgba(6,182,212,0.25);" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">Log In →</button>
        <div style="text-align:center;margin-top:14px;">
          <button onclick="switchAuthTab('forgot')" style="background:none;border:none;font-size:12px;color:#06b6d4;cursor:pointer;font-family:inherit;">Forgot password?</button>
        </div>
      </div>

      <!-- REGISTER -->
      <div id="hmPanel_register" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label for="hmRegFirst" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">First Name *</label>
            <input id="hmRegFirst" type="text" placeholder="James" style="${INP}" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'">
          </div>
          <div>
            <label for="hmRegLast" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Last Name</label>
            <input id="hmRegLast" type="text" placeholder="McAllister" style="${INP}" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'">
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <label for="hmRegEmail" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Email Address *</label>
          <input id="hmRegEmail" type="email" placeholder="engineer@company.com" style="${INP}" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'">
        </div>
        <div style="margin-bottom:20px;">
          <label for="hmRegPass" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Password * (min 6 chars)</label>
          <div style="position:relative;">
            <input id="hmRegPass" type="password" placeholder="Create a password" style="${INP};padding-right:42px;" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'" onkeydown="if(event.key==='Enter')doRegister()">
            <span onclick="(function(b){var i=document.getElementById('hmRegPass');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈'})(this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;user-select:none;line-height:1;" title="Show/hide password">👁</span>
          </div>
        </div>
        <button id="hmRegBtn" onclick="doRegister()" style="width:100%;padding:12px;background:linear-gradient(135deg,#06b6d4,#0e7490);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity 0.15s;box-shadow:0 2px 12px rgba(6,182,212,0.25);" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">Create Account →</button>
        <div style="text-align:center;margin-top:12px;font-size:11.5px;color:#3d6478;">Free tier · No credit card needed</div>
      </div>

      <!-- FORGOT -->
      <div id="hmPanel_forgot" style="display:none;">
        <p style="font-size:13px;color:#7fb3c8;margin-bottom:16px;line-height:1.65;">Enter your registered email and we'll send you a reset link.</p>
        <div id="hmForgotOk" style="display:none;margin-bottom:14px;"></div>
        <div style="margin-bottom:18px;">
          <label for="hmForgotEmail" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7fb3c8;display:block;margin-bottom:6px;">Email Address</label>
          <input id="hmForgotEmail" type="email" placeholder="engineer@company.com" style="${INP}" onfocus="this.style.borderColor='#06b6d4';this.style.boxShadow='0 0 0 3px rgba(6,182,212,0.12)'" onblur="this.style.borderColor='rgba(6,182,212,0.22)';this.style.boxShadow='none'">
        </div>
        <button onclick="doForgot()" style="width:100%;padding:12px;background:linear-gradient(135deg,#06b6d4,#0e7490);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity 0.15s;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">Send Reset Link</button>
        <div style="text-align:center;margin-top:14px;">
          <button onclick="switchAuthTab('login')" style="background:none;border:none;font-size:12px;color:#7fb3c8;cursor:pointer;font-family:inherit;">← Back to login</button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.addEventListener('click',e=>{if(e.target===el)closeAuthModal();});
}

/* ── Wire all login/register buttons ── */
function _wireAuthButtons(){
  // Wire "Log In" buttons (btn-ghost in nav)
  document.querySelectorAll('a.btn-ghost, button.btn-ghost').forEach(btn=>{
    if((btn.textContent||'').trim()==='Log In'){
      btn.addEventListener('click',e=>{e.preventDefault();openAuthModal('login');});
    }
  });
  // Wire "Register" buttons
  document.querySelectorAll('a.btn-secondary, button.btn-secondary').forEach(btn=>{
    if((btn.textContent||'').trim()==='Register'){
      btn.addEventListener('click',e=>{e.preventDefault();openAuthModal('register');});
    }
  });
  // Wire "Get Pro" / "Get Pro Now" buttons
  document.querySelectorAll('a.btn-primary').forEach(btn=>{
    const t=(btn.textContent||'').trim();
    if(t.includes('Get Pro')&&!btn.getAttribute('data-no-modal')){
      btn.addEventListener('click',e=>{e.preventDefault();openAuthModal('register');});
    }
  });
}

/* ── Logged-in nav: swap Login/GetPro with avatar chip ── */
function _injectNavUserChip(user){
  const navRight=document.querySelector('.nav-right');
  if(!navRight)return;
  // Remove existing login/getpro buttons
  navRight.querySelectorAll('a.btn-ghost, a.btn-primary').forEach(b=>{
    if((b.textContent||'').includes('Log In')||(b.textContent||'').includes('Get Pro'))b.remove();
  });
  if(document.getElementById('hmNavUser'))return;
  const chip=document.createElement('div');
  chip.id='hmNavUser';
  chip.style.cssText='display:flex;align-items:center;gap:8px;background:var(--accent-dim);border:1px solid var(--accent-glow);border-radius:20px;padding:4px 12px 4px 4px;cursor:pointer;';
  chip.innerHTML=`<div id="hmNavAvatar" style="width:26px;height:26px;background:linear-gradient(135deg,#0e7490,#06b6d4);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;">${(user.first||user.email).slice(0,2).toUpperCase()}</div><span id="hmNavName" style="font-size:13px;font-weight:600;color:var(--text1);">${user.first||user.email.split('@')[0]}</span>${user.isAdmin?`<span id="hmNavPlan" style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:rgba(6,182,212,.15);color:#06b6d4;">Admin</span>`:`<span id="hmNavPlan" style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--success-dim);color:var(--success);">${user.plan}</span>`}`;
  chip.title='Click to log out';
  chip.onclick=doLogout;
  navRight.appendChild(chip);
}

/* ── Accessibility helper: connect controls with usable labels ── */
function hmImproveA11yLabels(){
  document.querySelectorAll('.field').forEach((field, index)=>{
    const label=field.querySelector('label');
    const control=field.querySelector('input, textarea, select');
    if(!label||!control)return;
    if(!control.id)control.id='hm-field-'+index;
    label.setAttribute('for',control.id);
    if(!control.getAttribute('aria-label')){
      control.setAttribute('aria-label',(label.textContent||'').trim());
    }
  });

  document.querySelectorAll('input, textarea, select').forEach((control, index)=>{
    if(control.type==='hidden')return;
    if(control.getAttribute('aria-label')||control.getAttribute('aria-labelledby'))return;
    const wrap=control.closest('label');
    const labelText=wrap&&(wrap.textContent||'').replace(/\s+/g,' ').trim();
    const fallback=labelText||control.placeholder||control.name||control.id||('HydroMind field '+(index+1));
    control.setAttribute('aria-label',fallback);
  });

  document.querySelectorAll('button').forEach((button, index)=>{
    if(button.getAttribute('aria-label')||button.getAttribute('aria-labelledby'))return;
    const text=(button.textContent||'').replace(/\s+/g,' ').trim();
    const title=button.getAttribute('title');
    button.setAttribute('aria-label',text||title||('HydroMind action '+(index+1)));
  });
}

/* ── Init ── */
function hmInit(){
  _injectAuthModal();
  _wireAuthButtons();
  hmImproveA11yLabels();
  // Mobile nav toggle
  const toggle=document.getElementById('navToggle');
  const mobileNav=document.getElementById('navMobile');
  if(toggle&&mobileNav)toggle.onclick=()=>mobileNav.classList.toggle('open');
  hmSetActiveNav();
  const user=hmGetSession();
  if(user)hmOnLogin(user);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',hmInit);}
else{hmInit();}
