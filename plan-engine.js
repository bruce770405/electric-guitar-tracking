/* ============================================================
   引擎：渲染計畫頁 / 教學頁 / SVG 圖示 / 分頁與跳轉
   ============================================================ */
const TAGNAME={skill:"技巧",theory:"樂理",song:"練習曲",record:"錄音"};
const STRINGS=["1(e)","2(B)","3(G)","4(D)","5(A)","6(E)"]; // 由細到粗，s=1..6

/* ---------- 分頁 ---------- */
function switchTab(p){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.page===p));
  document.querySelectorAll('.page').forEach(pg=>pg.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ============================================================
   SVG 指板圖 (左手)
   spec:{startFret,frets,dots:[{s,f,l,c,t}]}
   s:弦 1(細)~6(粗)  f:絕對格號  l:標籤  c:顏色  t:記號
   ============================================================ */
function fretboardSVG(spec){
  const W=460,H=210,padL=42,padT=28,padR=26,padB=26;
  const nFrets=spec.frets, startF=spec.startFret;
  const gridW=W-padL-padR, gridH=H-padT-padB;
  const fw=gridW/nFrets;          // 每格寬
  const sh=gridH/5;               // 弦間距(6弦5間隔)
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:480px">`;
  // 背板
  s+=`<rect x="${padL}" y="${padT}" width="${gridW}" height="${gridH}" fill="#f3e6cf" stroke="#b8946a" rx="3"/>`;
  // 起始格若為1，畫粗弦枕
  if(startF===1){s+=`<rect x="${padL-4}" y="${padT}" width="5" height="${gridH}" fill="#444"/>`;}
  // 琴衍(縱線)
  for(let i=0;i<=nFrets;i++){
    const x=padL+i*fw;
    s+=`<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT+gridH}" stroke="#9a9a9a" stroke-width="${i===0?3:2}"/>`;
  }
  // 弦(橫線) s=1 在最上(細)
  for(let i=0;i<6;i++){
    const y=padT+i*sh;
    s+=`<line x1="${padL}" y1="${y}" x2="${padL+gridW}" y2="${y}" stroke="#7a5c3a" stroke-width="${1+i*0.4}"/>`;
  }
  // 把位點(常見3,5,7,9,12格)
  const inlay=[3,5,7,9,12,15,17];
  for(let f=startF;f<startF+nFrets;f++){
    if(inlay.includes(f)){
      const x=padL+(f-startF+0.5)*fw;
      if(f===12){
        s+=`<circle cx="${x}" cy="${padT+sh*1.5}" r="4" fill="#cbb89a"/>`;
        s+=`<circle cx="${x}" cy="${padT+sh*3.5}" r="4" fill="#cbb89a"/>`;
      }else{
        s+=`<circle cx="${x}" cy="${padT+gridH/2}" r="4" fill="#cbb89a"/>`;
      }
    }
  }
  // 格號標示
  for(let f=startF;f<startF+nFrets;f++){
    const x=padL+(f-startF+0.5)*fw;
    s+=`<text x="${x}" y="${H-8}" font-size="11" fill="#8a6d49" text-anchor="middle">${f}</text>`;
  }
  // 弦名(左側)
  for(let i=0;i<6;i++){
    s+=`<text x="${padL-22}" y="${padT+i*sh+4}" font-size="10" fill="#8a6d49" text-anchor="middle">${STRINGS[i].charAt(STRINGS[i].length-2)}</text>`;
  }
  // 空弦(○)/不彈(✕) 標記：marks={弦號:"o"|"x"|"f"}
  if(spec.marks){
    for(let str=1;str<=6;str++){
      const m=spec.marks[str];
      if(m!=="o"&&m!=="x")continue;
      const y=padT+(str-1)*sh;
      const mx=padL-10;
      if(m==="o"){
        s+=`<circle cx="${mx}" cy="${y}" r="5" fill="none" stroke="#2e7d32" stroke-width="2"/>`;
      }else{
        s+=`<text x="${mx}" y="${y+4}" font-size="13" fill="#c62828" text-anchor="middle" font-weight="bold">✕</text>`;
      }
    }
  }
  // 音點
  (spec.dots||[]).forEach(d=>{
    const yi=d.s-1;                       // s=1 →最上
    const y=padT+yi*sh;
    const x=padL+(d.f-startF+0.5)*fw;
    const col=d.c||"#1565c0";
    const r=12;
    // 記號處理
    if(d.t==="ghost"){
      s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="3 3"/>`;
    }else{
      s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
    }
    if(d.l){s+=`<text x="${x}" y="${y+4}" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">${d.l}</text>`;}
    // 技巧記號（上方小標）
    const mk={bend:"↑",bendH:"½↑",ho:"H",po:"P",sl:"／",vib:"〰",root:"R",bar:"⎺"};
    if(d.t&&mk[d.t]&&d.t!=="ghost"){
      s+=`<text x="${x+r+2}" y="${y-r+4}" font-size="12" fill="${col}" font-weight="bold">${mk[d.t]}</text>`;
    }
  });
  s+=`</svg>`;
  return s;
}

/* ============================================================
   SVG 撥弦/刷弦圖 (右手)
   spec:{beats:[{b拍名,d方向 D/U/-,m悶音,a重音,lab}]}
   D=下撥↓ U=上撥↑ -=空刷 m=悶音(虛框) a=重音(粗)
   ============================================================ */
function strumSVG(spec){
  const beats=spec.beats||[];
  const n=beats.length;
  const cw=Math.max(46, Math.min(60, 460/n)); // 每拍寬
  const W=cw*n+20, H=130, topY=30, arrowTop=44, arrowBot=92, labY=116;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">`;
  // 基準線
  s+=`<line x1="10" y1="${arrowTop-8}" x2="${W-10}" y2="${arrowTop-8}" stroke="#ccc" stroke-width="1"/>`;
  s+=`<line x1="10" y1="${arrowBot+8}" x2="${W-10}" y2="${arrowBot+8}" stroke="#ccc" stroke-width="1"/>`;
  beats.forEach((bt,i)=>{
    const cx=10+cw*i+cw/2;
    const isBeat=/^[0-9]$/.test(bt.b); // 正拍
    // 拍名
    s+=`<text x="${cx}" y="${topY}" font-size="13" fill="${isBeat?'#222':'#999'}" text-anchor="middle" font-weight="${isBeat?'bold':'normal'}">${bt.b}</text>`;
    const sw=bt.a?4:2.4;             // 重音粗
    const col=bt.m?"#e65100":(bt.a?"#c62828":"#1565c0");
    if(bt.d==="D"){
      // 下箭頭 ↓
      s+=`<line x1="${cx}" y1="${arrowTop}" x2="${cx}" y2="${arrowBot}" stroke="${col}" stroke-width="${sw}" ${bt.m?'stroke-dasharray="4 3"':''}/>`;
      s+=`<polygon points="${cx-5},${arrowBot-7} ${cx+5},${arrowBot-7} ${cx},${arrowBot}" fill="${col}"/>`;
    }else if(bt.d==="U"){
      // 上箭頭 ↑
      s+=`<line x1="${cx}" y1="${arrowTop}" x2="${cx}" y2="${arrowBot}" stroke="${col}" stroke-width="${sw}" ${bt.m?'stroke-dasharray="4 3"':''}/>`;
      s+=`<polygon points="${cx-5},${arrowTop+7} ${cx+5},${arrowTop+7} ${cx},${arrowTop}" fill="${col}"/>`;
    }else{
      // 空刷 —
      s+=`<text x="${cx}" y="${(arrowTop+arrowBot)/2+5}" font-size="18" fill="#bbb" text-anchor="middle">—</text>`;
    }
    // 悶音標記 X
    if(bt.m){s+=`<text x="${cx+9}" y="${arrowTop+6}" font-size="11" fill="#e65100" font-weight="bold">✕</text>`;}
    if(bt.a){s+=`<text x="${cx}" y="${arrowBot+22}" font-size="11" fill="#c62828" text-anchor="middle" font-weight="bold">＞</text>`;}
    if(bt.lab){s+=`<text x="${cx}" y="${labY}" font-size="9" fill="#777" text-anchor="middle">${bt.lab}</text>`;}
  });
  s+=`</svg>`;
  return s;
}

function diagramHTML(d){
  if(!d)return"";
  const svg = d.type==="fretboard"?fretboardSVG(d):strumSVG(d);
  return `<div class="diagram">${svg}<div class="diagram-cap">${d.caption||""}</div></div>`;
}

/* ============================================================
   渲染：計畫頁
   ============================================================ */
let CURRENT_PLAN = (typeof Store!=="undefined") ? Store.getActivePlan() : "plan-6m";
if(typeof PLANS==="undefined" || !PLANS[CURRENT_PLAN]) CURRENT_PLAN="plan-6m";
function planPhases(){ return PLANS[CURRENT_PLAN].phases; }
// 穩定 taskId：planId__phaseIdx__weekIdx__taskIdx
function taskKey(pi,wi,ti){ return CURRENT_PLAN+"__p"+pi+"__w"+wi+"__t"+ti; }

const phasesRoot=document.getElementById('phases');
function renderPlan(){
phasesRoot.innerHTML="";
planPhases().forEach((p,pi)=>{
  const ph=document.createElement('div');ph.className='phase';
  ph.innerHTML=`<div class="phase-head">
      <span class="phase-badge">${p.badge}</span>
      <div class="phase-title"><h3>${p.month} ${p.title}</h3><span>${p.sub}</span></div>
      <span class="phase-mini" id="pm${pi}"></span>
      <span class="arrow">▶</span>
    </div><div class="phase-body"><div class="phase-inner"></div></div>`;
  const inner=ph.querySelector('.phase-inner');
  p.weeks.forEach((wk,wi)=>{
    const wd=document.createElement('div');wd.className='week';
    let html=`<h4>${wk.w}</h4>`;
    wk.tasks.forEach((t,ti)=>{
      const [type,text,hand,lid]=t;
      const key=taskKey(pi,wi,ti);
      const checked=(typeof Store!=="undefined" && Store.isChecked(CURRENT_PLAN,key))?"checked":"";
      const handBadge = hand==="L"?`<span class="hand hand-L">✋左</span>`:hand==="R"?`<span class="hand hand-R">🤚右</span>`:"";
      const learn = lid?`<button class="learn-btn" onclick="gotoLesson('${lid}')">📖 教學</button>`:"";
      html+=`<div class="task"><input type="checkbox" id="${key}" data-p="${pi}" ${checked}>
        <span class="lbl"><span class="tag t-${type}">${TAGNAME[type]}</span><span class="txt">${text}</span>${handBadge}${learn}</span></div>`;
    });
    wd.innerHTML=html;inner.appendChild(wd);
  });
  ph.querySelector('.phase-head').onclick=()=>ph.classList.toggle('open');
  phasesRoot.appendChild(ph);
});
if(phasesRoot.firstChild)phasesRoot.firstChild.classList.add('open');
// 綁定勾選 → 存 Store + 更新進度
phasesRoot.querySelectorAll('input[type=checkbox]').forEach(b=>{
  b.addEventListener('change',()=>{
    if(typeof Store!=="undefined") Store.setTask(CURRENT_PLAN,b.id,b.checked);
    updatePlanProgress();
    if(typeof renderDashboard==="function") renderDashboard();
  });
});
updatePlanProgress();
}
// 進度條/各階段統計
function updatePlanProgress(){
  const boxes=[...phasesRoot.querySelectorAll('input[type=checkbox]')];
  const done=boxes.filter(b=>b.checked).length,total=boxes.length;
  const pct=total?Math.round(done/total*100):0;
  const fill=document.getElementById('fill'); if(fill)fill.style.width=pct+'%';
  const pt=document.getElementById('ptext'); if(pt)pt.textContent=done+" / "+total+" ("+pct+"%)";
  planPhases().forEach((p,pi)=>{
    const pb=boxes.filter(b=>b.dataset.p==pi);
    const pd=pb.filter(b=>b.checked).length;
    const e=document.getElementById('pm'+pi);if(e)e.textContent=pd+"/"+pb.length;
  });
}
// 切換計畫
function switchPlan(planId){
  if(!PLANS[planId])return;
  CURRENT_PLAN=planId;
  if(typeof Store!=="undefined") Store.setActivePlan(planId);
  renderPlan();
  if(typeof renderDashboard==="function") renderDashboard();
}

/* ============================================================
   渲染：教學頁
   ============================================================ */
const lessonsRoot=document.getElementById('lessons');
const lessonOrder=Object.keys(LESSONS);
// 反向索引：由 THEORY.relatedLesson 建立 lessonId -> [theoryId]
const lessonToTheory={};
if(typeof THEORY!=="undefined"){
  Object.keys(THEORY).forEach(tid=>{
    (THEORY[tid].relatedLesson||[]).forEach(lid=>{
      (lessonToTheory[lid]=lessonToTheory[lid]||[]).push(tid);
    });
  });
}
lessonOrder.forEach(key=>{
  const L=LESSONS[key];
  const el=document.createElement('div');
  el.className='lesson';el.id='lesson-'+key;
  el.dataset.search=(L.title+" "+L.cat+" "+L.intro).toLowerCase();
  const pill = L.hand==="L"?`<span class="pill pill-L">✋ 左手</span>`:L.hand==="R"?`<span class="pill pill-R">🤚 右手</span>`:`<span class="pill" style="background:#37474f;color:#b0bec5">🧠 概念</span>`;
  let body=`<div class="lesson-inner">`;
  body+=`<p>${L.intro}</p>`;
  // 主圖
  body+=diagramHTML(L.diagram);
  if(L.diagram){
    if(L.diagram.type==="fretboard"){
      body+=`<div class="legend"><span><span class="dot" style="background:#c62828"></span>根音</span><span><span class="dot" style="background:#1565c0"></span>音/指法</span><span><span class="dot" style="background:#4caf50"></span>搥弦H</span><span><span class="dot" style="background:#ff9800"></span>滑音／</span><span>↑推弦 〰顫音</span></div>`;
    }else{
      body+=`<div class="legend"><span style="color:#1565c0">↓下撥 ↑上撥</span><span style="color:#e65100">✕ 悶音cutting(虛線)</span><span style="color:#c62828">＞重音</span><span>— 空刷</span></div>`;
    }
  }
  // 額外圖
  (L.extra||[]).forEach(d=>{
    if(d.groupTitle){ body+=`<h4 class="grp-title">${d.groupTitle}</h4>`; if(d.groupDesc)body+=`<p class="grp-desc">${d.groupDesc}</p>`; }
    body+=diagramHTML(d);
    if(d.note){ body+=`<div class="diagram-note">💡 ${d.note}</div>`; }
    if(d.legend){
      if(d.type==="fretboard"){
        body+=`<div class="legend"><span><span class="dot" style="background:#c62828"></span>根音</span><span><span class="dot" style="background:#1565c0"></span>音/指法</span><span>○空弦 ✕不彈</span></div>`;
      }else{
        body+=`<div class="legend"><span style="color:#1565c0">↓下撥 ↑上撥</span><span style="color:#e65100">✕ 悶音(虛線)</span><span style="color:#c62828">＞重音</span><span>— 空刷</span></div>`;
      }
    }
  });
  // 段落
  (L.sections||[]).forEach(sec=>{
    body+=`<h4>${sec.h}</h4><ul>`;
    sec.list.forEach(li=>body+=`<li>${li}</li>`);
    body+=`</ul>`;
  });
  (L.cues||[]).forEach(c=>body+=`<div class="cue"><b>✅ 要訣：</b>${c}</div>`);
  (L.warns||[]).forEach(w=>body+=`<div class="warn"><b>⚠️ 易錯：</b>${w}</div>`);
  // 相關樂理補充連結
  const relT=lessonToTheory[key]||[];
  if(relT.length){
    body+=`<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span style="font-size:.85em;color:var(--muted)">🎼 樂理補充：</span>`;
    relT.forEach(tid=>{
      body+=`<button class="learn-btn" style="border-color:var(--purple);color:#ce93d8" onclick="gotoTheory('${tid}')">🔗 ${THEORY[tid].title}</button>`;
    });
    body+=`</div>`;
  }
  body+=`</div>`;
  el.innerHTML=`<div class="lesson-head">${pill}<h3>${L.title}</h3><span style="font-size:.78em;color:var(--muted)">${L.cat}</span><span class="arrow">▶</span></div><div class="lesson-body">${body}</div>`;
  el.querySelector('.lesson-head').onclick=()=>el.classList.toggle('open');
  lessonsRoot.appendChild(el);
});

/* 從計畫頁跳到教學 */
function gotoLesson(key){
  switchTab('lessons');
  const el=document.getElementById('lesson-'+key);
  if(!el)return;
  // 收合其他、展開目標
  document.querySelectorAll('#lessons .lesson').forEach(l=>l.classList.remove('open'));
  el.classList.add('open');
  setTimeout(()=>{el.scrollIntoView({behavior:'smooth',block:'start'});
    el.style.boxShadow='0 0 0 2px var(--accent)';
    setTimeout(()=>el.style.boxShadow='',1600);},120);
}

/* 教學搜尋 */
function filterLessons(){
  const q=document.getElementById('lessonSearch').value.trim().toLowerCase();
  let shown=0;
  document.querySelectorAll('#lessons .lesson').forEach(l=>{
    const hit=!q||l.dataset.search.includes(q);
    l.style.display=hit?'':'none';if(hit)shown++;
  });
  document.getElementById('noResult').style.display=shown?'none':'block';
}

/* ============================================================
   渲染：樂理頁
   ============================================================ */
// 反向索引：theoryId 也可連回技巧 lesson
const theoryToLesson={};
if(typeof THEORY!=="undefined"){
  Object.keys(THEORY).forEach(tid=>{theoryToLesson[tid]=THEORY[tid].relatedLesson||[];});
}
const theoryRoot=document.getElementById('theory');
if(theoryRoot && typeof THEORY!=="undefined"){
  Object.keys(THEORY).forEach(tid=>{
    const T=THEORY[tid];
    const el=document.createElement('div');
    el.className='lesson';el.id='theory-'+tid;
    let txt=T.title+" "+T.cat;
    (T.body||[]).forEach(b=>{txt+=" "+(b.h||"")+" "+(b.p||"")+" "+((b.list||[]).join(" "));});
    el.dataset.search=txt.toLowerCase();
    let body=`<div class="lesson-inner">`;
    (T.body||[]).forEach(sec=>{
      if(sec.h)body+=`<h4>${sec.h}</h4>`;
      if(sec.p)body+=`<p>${sec.p}</p>`;
      if(sec.list){body+=`<ul>`;sec.list.forEach(li=>body+=`<li>${li}</li>`);body+=`</ul>`;}
      if(sec.diagram){body+=diagramHTML(sec.diagram);}
    });
    (T.diagrams||[]).forEach(d=>{body+=diagramHTML(d);});
    // 連回技巧教學
    const relL=theoryToLesson[tid]||[];
    if(relL.length){
      body+=`<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span style="font-size:.85em;color:var(--muted)">🎸 相關技巧：</span>`;
      relL.forEach(lid=>{
        if(typeof LESSONS!=="undefined"&&LESSONS[lid])
          body+=`<button class="learn-btn" onclick="gotoLesson('${lid}')">📖 ${LESSONS[lid].title}</button>`;
      });
      body+=`</div>`;
    }
    body+=`</div>`;
    const pill=`<span class="pill" style="background:#4a148c;color:#ce93d8">🎼 樂理</span>`;
    el.innerHTML=`<div class="lesson-head">${pill}<h3>${T.title}</h3><span style="font-size:.78em;color:var(--muted)">${T.cat}</span><span class="arrow">▶</span></div><div class="lesson-body">${body}</div>`;
    el.querySelector('.lesson-head').onclick=()=>el.classList.toggle('open');
    theoryRoot.appendChild(el);
  });
}

/* 跳到樂理 */
function gotoTheory(tid){
  switchTab('theory');
  const el=document.getElementById('theory-'+tid);
  if(!el)return;
  document.querySelectorAll('#theory .lesson').forEach(l=>l.classList.remove('open'));
  el.classList.add('open');
  setTimeout(()=>{el.scrollIntoView({behavior:'smooth',block:'start'});
    el.style.boxShadow='0 0 0 2px var(--purple)';
    setTimeout(()=>el.style.boxShadow='',1600);},120);
}

/* 樂理搜尋 */
function filterTheory(){
  const q=document.getElementById('theorySearch').value.trim().toLowerCase();
  let shown=0;
  document.querySelectorAll('#theory .lesson').forEach(l=>{
    const hit=!q||l.dataset.search.includes(q);
    l.style.display=hit?'':'none';if(hit)shown++;
  });
  document.getElementById('noResultT').style.display=shown?'none':'block';
}

/* ============================================================
   初始化
   ============================================================ */
function resetAll(){
  if(confirm("確定要清除「目前計畫」的勾選進度嗎？(日誌/目標/曲目不受影響)")){
    if(typeof Store!=="undefined") Store.clearProgress(CURRENT_PLAN);
    renderPlan();
    if(typeof renderDashboard==="function") renderDashboard();
  }
}
// 初始化集中在最後載入的 extras.js 的 initApp() 內呼叫

