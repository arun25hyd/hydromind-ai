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
    welcomeEl.style.cssText='position:fixed;top:80px;right:1.5rem;z-index:9999;background:#fff;border:1px solid var(--accent-glow);border-radius:12px;padding:14px 18px;font-family:Inter,sans-serif;font-size:13px;color:var(--text1);max-width:280px;box-shadow:0 8px 32px rgba(8,145,178,0.15);';
    welcomeEl.innerHTML='<div style="font-weight:800;font-size:14px;color:var(--accent);margin-bottom:4px;">Welcome, '+name+'! ✓</div><div style="font-size:12px;color:var(--text2);line-height:1.5;">Your '+plan+' account is ready.<br>Start with the AI Advisor.</div>';
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

/* ── Inject auth modal HTML ── */
function _injectAuthModal(){
  if(document.getElementById('hmAuthOverlay'))return;
  const el=document.createElement('div');
  el.id='hmAuthOverlay';
  el.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);z-index:9999;align-items:center;justify-content:center;';
  el.innerHTML=`
  <div style="background:#fff;border:1px solid var(--border-md);border-radius:16px;width:100%;max-width:400px;margin:0 20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.18);">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px 0;">
      <div style="display:flex;gap:4px;">
        <button id="hmTab_login" onclick="switchAuthTab('login')" style="padding:8px 18px;border:none;border-bottom:2px solid var(--accent);background:var(--accent-dim);color:var(--accent);font-weight:700;font-size:13px;border-radius:8px 8px 0 0;cursor:pointer;font-family:inherit;">Log In</button>
        <button id="hmTab_register" onclick="switchAuthTab('register')" style="padding:8px 18px;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--text2);font-weight:600;font-size:13px;border-radius:8px 8px 0 0;cursor:pointer;font-family:inherit;">Register</button>
      </div>
      <button onclick="closeAuthModal()" style="background:none;border:none;font-size:20px;color:var(--text3);cursor:pointer;padding:4px 8px;line-height:1;">×</button>
    </div>
    <div style="padding:24px;">
      <div id="hmAuthError" style="display:none;background:var(--danger-dim);border:1px solid var(--danger);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--danger);margin-bottom:14px;"></div>

      <!-- Login panel -->
      <div id="hmPanel_login">
        <div style="margin-bottom:14px;">
          <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Email Address</label>
          <input id="hmLoginEmail" type="email" placeholder="engineer@company.com" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:14px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'">
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Password</label>
          <input id="hmLoginPass" type="password" placeholder="••••••••" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:14px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'" onkeydown="if(event.key==='Enter')doLogin()">
        </div>
        <button onclick="doLogin()" style="width:100%;padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 0.15s;" onmouseover="this.style.background='var(--accent-hover)'" onmouseout="this.style.background='var(--accent)'">Log In</button>
        <div style="text-align:center;margin-top:12px;"><button onclick="switchAuthTab('forgot')" style="background:none;border:none;font-size:12.5px;color:var(--accent);cursor:pointer;font-family:inherit;">Forgot password?</button></div>
      </div>

      <!-- Register panel -->
      <div id="hmPanel_register" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">First Name *</label>
            <input id="hmRegFirst" type="text" placeholder="James" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:13px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'">
          </div>
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Last Name</label>
            <input id="hmRegLast" type="text" placeholder="McAllister" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:13px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'">
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Email Address *</label>
          <input id="hmRegEmail" type="email" placeholder="engineer@company.com" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:14px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'">
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Password * (min 6 chars)</label>
          <input id="hmRegPass" type="password" placeholder="••••••••" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:14px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'" onkeydown="if(event.key==='Enter')doRegister()">
        </div>
        <button onclick="doRegister()" style="width:100%;padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;" onmouseover="this.style.background='var(--accent-hover)'" onmouseout="this.style.background='var(--accent)'">Create Account</button>
      </div>

      <!-- Forgot panel -->
      <div id="hmPanel_forgot" style="display:none;">
        <p style="font-size:13.5px;color:var(--text2);margin-bottom:14px;line-height:1.6;">Enter your email and we'll send a password reset link.</p>
        <div id="hmForgotOk" style="display:none;margin-bottom:14px;"></div>
        <div style="margin-bottom:14px;">
          <label style="font-size:11.5px;font-weight:600;color:var(--text2);display:block;margin-bottom:5px;">Email Address</label>
          <input id="hmForgotEmail" type="email" placeholder="engineer@company.com" style="width:100%;padding:10px 13px;border:1.5px solid var(--border-md);border-radius:8px;font-size:14px;color:var(--text1);outline:none;box-sizing:border-box;font-family:inherit;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border-md)'">
        </div>
        <button onclick="doForgot()" style="width:100%;padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Send Reset Link</button>
        <div style="text-align:center;margin-top:12px;"><button onclick="switchAuthTab('login')" style="background:none;border:none;font-size:12.5px;color:var(--text2);cursor:pointer;font-family:inherit;">← Back to login</button></div>
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
  chip.innerHTML=`<div id="hmNavAvatar" style="width:26px;height:26px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;">${(user.first||user.email).slice(0,2).toUpperCase()}</div><span id="hmNavName" style="font-size:13px;font-weight:600;color:var(--text1);">${user.first||user.email.split('@')[0]}</span><span id="hmNavPlan" style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--success-dim);color:var(--success);">${user.plan}</span>`;
  chip.title='Click to log out';
  chip.onclick=doLogout;
  navRight.appendChild(chip);
}

/* ── Init ── */
function hmInit(){
  _injectAuthModal();
  _wireAuthButtons();
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
