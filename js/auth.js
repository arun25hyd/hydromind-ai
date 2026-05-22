/* ================================================================
   HydroMind.AI — Auth & Sidebar v3.0
   Single source of truth for all auth, session, sidebar rendering
   ================================================================ */
const ADMIN_EMAIL = 'arun25hyd@gmail.com';
const HM_SESSION  = 'hm_session';
const HM_USERS    = 'hm_users';
const HM_HISTORY  = 'hm_history';

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
    b.style.background=on?'rgba(0,212,255,.08)':'transparent';
    b.style.color=on?'#00d4ff':'rgba(200,216,232,.35)';
    b.style.borderBottom=on?'2px solid #00d4ff':'2px solid transparent';
    b.classList.toggle('active',on);
  });
}
function _authErr(msg){
  const el=document.getElementById('hmAuthError');
  if(el){el.textContent=msg;el.style.display='block';}
}

/* ── Login ── */
function doLogin(){
  const email=(document.getElementById('hmLoginEmail')?.value||'').trim().toLowerCase();
  const pass=(document.getElementById('hmLoginPass')?.value||'');
  if(!email||!pass){_authErr('Please fill in both fields.');return;}
  const users=hmGetUsers();
  if(!users[email]){_authErr('No account found. Please register first.');return;}
  const storedPass=users[email].pass;
  const inputPass=btoa(unescape(encodeURIComponent(pass)));
  if(storedPass!==inputPass){_authErr('Incorrect password.');return;}
  const user={...users[email],email};
  hmSaveSession(user);
  closeAuthModal();
  hmOnLogin(user);
}

/* ── Register ── */
function doRegister(){
  const first=(document.getElementById('hmRegFirst')?.value||'').trim();
  const last=(document.getElementById('hmRegLast')?.value||'').trim();
  const email=(document.getElementById('hmRegEmail')?.value||'').trim().toLowerCase();
  const pass=(document.getElementById('hmRegPass')?.value||'');
  if(!first||!email||!pass){_authErr('Please fill in all required fields.');return;}
  if(pass.length<6){_authErr('Password must be at least 6 characters.');return;}
  const users=hmGetUsers();
  if(users[email]){_authErr('Account already exists. Please login.');return;}
  const isAdmin=(email===ADMIN_EMAIL);
  // Read selected plan from dropdown (set by selectPlan() on pricing page)
  const planSel=document.getElementById('hmRegPlan');
  const selectedPlan=planSel?planSel.value:'Free';
  const plan=isAdmin?'Admin':selectedPlan;
  const data={first,last,email,pass:btoa(unescape(encodeURIComponent(pass))),plan,isAdmin,joined:new Date().toLocaleDateString()};
  hmSaveUser(email,data);
  const user={...data};
  hmSaveSession(user);
  closeAuthModal();
  hmOnLogin(user);
  // Show welcome message after registration
  setTimeout(()=>{
    const name=first;
    const welcomeEl=document.createElement('div');
    welcomeEl.style.cssText='position:fixed;top:90px;right:1.5rem;z-index:9999;background:linear-gradient(135deg,rgba(200,165,80,.15),rgba(139,105,20,.1));border:1px solid rgba(200,165,80,.35);border-radius:10px;padding:1rem 1.35rem;font-family:Outfit,sans-serif;font-size:.9rem;color:#f0ebe0;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:fadeInDown .3s ease;';
    welcomeEl.innerHTML='<div style="font-family:Syne,sans-serif;font-weight:800;font-size:1rem;color:#c8a550;margin-bottom:.3rem;">Welcome, '+name+'! ✓</div><div style="font-size:.82rem;color:rgba(220,210,195,.65);line-height:1.5;">Your '+plan+' account is ready.<br>Start with the AI Advisor.</div>';
    document.body.appendChild(welcomeEl);
    setTimeout(()=>welcomeEl.remove(),5000);
  },300);
}

/* ── Forgot ── */
function doForgot(){
  const email=(document.getElementById('hmForgotEmail')?.value||'').trim().toLowerCase();
  if(!email){_authErr('Please enter your email.');return;}
  const users=hmGetUsers();
  const ok=document.getElementById('hmForgotOk');
  if(!ok)return;
  if(!users[email]){
    ok.textContent='⚠️ No account found with this email.';
    ok.style.cssText='display:block;background:rgba(245,200,66,.07);border:1px solid rgba(245,200,66,.25);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#f5c842;margin-bottom:.85rem;';
  } else {
    ok.textContent='✅ Reset link sent — check your inbox.';
    ok.style.cssText='display:block;background:rgba(61,214,140,.07);border:1px solid rgba(61,214,140,.2);border-radius:7px;padding:.7rem 1rem;font-size:.82rem;color:#3dd68c;margin-bottom:.85rem;';
    setTimeout(()=>ok.style.display='none',6000);
  }
}

/* ── Logout ── */
function doLogout(){
  if(!confirm('Sign out of HydroMind.AI?'))return;
  hmClearSession();
  window.location.reload();
}

/* ── After login ── */
function hmOnLogin(user){
  window._hmUser=user;
  _updateNavbar(user);
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
    if(av){av.textContent=(user.first||user.email).slice(0,2).toUpperCase();av.style.background='#f97316';}
    if(nm)nm.textContent=(user.first||user.email.split('@')[0]);
    if(pl){
      pl.textContent=user.plan;
      pl.style.color=user.isAdmin?'#f97316':(user.plan==='Pro'||user.plan==='Enterprise')?'#22c55e':'#f97316';
      pl.style.background=user.isAdmin?'rgba(249,115,22,.15)':(user.plan==='Pro'||user.plan==='Enterprise')?'rgba(34,197,94,.1)':'rgba(249,115,22,.1)';
    }
  }
  if(user.isAdmin){
    const cta=document.getElementById('hmNavCta');
    if(cta&&!document.getElementById('hmAdminLink')){
      const a=document.createElement('a');
      a.id='hmAdminLink';a.className='btn-outline';
      a.style.cssText='padding:5px 14px;font-size:.78rem;border-radius:5px;border:1px solid rgba(249,115,22,.4);color:#f97316;text-decoration:none;font-family:"Barlow Condensed",sans-serif;font-weight:600;letter-spacing:.5px;';
      a.textContent='⚙ Admin';
      a.href=window.location.pathname.includes('/pages/')?'admin.html':'pages/admin.html';
      cta.insertBefore(a,cta.firstChild);
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
    pl.style.background=user.isAdmin?'rgba(249,115,22,.15)':(user.plan==='Pro'||user.plan==='Enterprise')?'rgba(34,197,94,.1)':'rgba(249,115,22,.08)';
    pl.style.color=user.isAdmin?'#f97316':(user.plan==='Pro'||user.plan==='Enterprise')?'#22c55e':'#f97316';
  }
  // Add edit button
  const pc=document.querySelector('.hm-profile-card');
  if(pc&&!document.getElementById('hmProfEditBtn')){
    const btn=document.createElement('button');
    btn.id='hmProfEditBtn';btn.title='Edit Profile';btn.innerHTML='✎';
    btn.style.cssText='position:absolute;top:8px;right:8px;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.2);border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#f97316;font-size:.8rem;transition:.18s;';
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

/* ── Init ── */
function hmInit(){
  const overlay=document.getElementById('hmAuthOverlay');
  if(overlay)overlay.addEventListener('click',e=>{if(e.target===overlay)closeAuthModal();});
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
