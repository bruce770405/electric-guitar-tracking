/* ============================================================
   Extras：儀表板 / 練功日誌 / 目標 / 曲目庫 / 匯出入
   依賴 Store、PLANS。提供 renderExtras() 給引擎初始化呼叫。
   ============================================================ */
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function todayStr(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

/* ---------- 統計計算 ---------- */
function calcStats(){
  const logs=Store.list("logs");
  let totalMin=0; const days=new Set();
  logs.forEach(l=>{ totalMin+=Number(l.minutes)||0; if(l.date)days.add(l.date); });
  // streak：從今天往回連續有日誌的天數
  let streak=0; const d=new Date();
  for(;;){
    const ds=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    if(days.has(ds)){streak++; d.setDate(d.getDate()-1);}
    else if(streak===0 && ds===todayStr()){ d.setDate(d.getDate()-1); } // 今天還沒記也不中斷
    else break;
  }
  // 本週(近7天)時數
  let weekMin=0; const now=new Date();
  logs.forEach(l=>{ if(!l.date)return; const diff=(now-new Date(l.date))/86400000; if(diff<7&&diff>=-1) weekMin+=Number(l.minutes)||0; });
  return {totalMin,streak,weekMin,dayCount:days.size,logCount:logs.length};
}
function fmtMin(m){ if(m<60)return m+" 分"; const h=Math.floor(m/60),mm=m%60; return h+" 時"+(mm?mm+" 分":""); }

/* ---------- 儀表板 ---------- */
function renderDashboard(){
  const root=document.getElementById("dash"); if(!root)return;
  const s=calcStats();
  let h=`<div class="stat-grid">
    <div class="stat"><div class="stat-num">🔥 ${s.streak}</div><div class="stat-lbl">連續練習天數</div></div>
    <div class="stat"><div class="stat-num">${fmtMin(s.totalMin)}</div><div class="stat-lbl">累積總時數</div></div>
    <div class="stat"><div class="stat-num">${fmtMin(s.weekMin)}</div><div class="stat-lbl">本週(近7天)</div></div>
    <div class="stat"><div class="stat-num">${s.logCount}</div><div class="stat-lbl">日誌篇數</div></div>
  </div>`;
  // 各計畫進度
  h+=`<h3 class="sec-h">📈 計畫進度</h3>`;
  Object.values(PLANS).forEach(pl=>{
    let total=0,done=0;
    pl.phases.forEach((p,pi)=>p.weeks.forEach((w,wi)=>w.tasks.forEach((t,ti)=>{
      total++; if(Store.isChecked(pl.id, pl.id+"__p"+pi+"__w"+wi+"__t"+ti))done++;
    })));
    const pct=total?Math.round(done/total*100):0;
    const active=(pl.id===CURRENT_PLAN)?' style="border-color:var(--accent)"':'';
    h+=`<div class="dash-plan"${active} onclick="switchPlan('${pl.id}');switchTab('plan')">
      <div class="dash-plan-top"><b>${esc(pl.name)}</b><span>${done}/${total} (${pct}%)</span></div>
      <div class="mini-track"><div class="mini-fill" style="width:${pct}%"></div></div>
      <div class="dash-plan-desc">${esc(pl.desc||"")}</div>
    </div>`;
  });
  // 目標摘要
  const goals=Store.list("goals");
  const gdone=goals.filter(g=>g.done).length;
  h+=`<h3 class="sec-h">🎯 我的目標 <span class="sec-sub">${gdone}/${goals.length}</span></h3>`;
  h+=`<div class="add-row"><input id="goalInput" placeholder="新增一個目標，例如：學會 Hotel California solo"><button class="add-btn" onclick="addGoal()">＋</button></div>`;
  h+=`<div id="goalList">`+goals.map(g=>
    `<div class="li"><label><input type="checkbox" ${g.done?"checked":""} onchange="toggleGoal('${g.id}',this.checked)"><span class="${g.done?'done':''}">${esc(g.text)}</span></label><button class="del" onclick="delItem('goals','${g.id}')">✕</button></div>`
  ).join("")+`</div>`;
  // 備份
  h+=`<h3 class="sec-h">備份 / 還原</h3>
    <div class="backup-row">
      <button class="btn-plain wide" onclick="Store.download()">匯出備份</button>
      <button class="btn-plain wide" onclick="document.getElementById('importFile').click()">匯入備份</button>
      <input type="file" id="importFile" accept="application/json" style="display:none" onchange="doImport(this)">
    </div>
    <p class="hint">換裝置時：在舊裝置匯出，傳到新裝置後匯入即可還原全部進度。</p>`;
  root.innerHTML=h;
}
function addGoal(){const i=document.getElementById("goalInput");const v=i.value.trim();if(!v)return;Store.add("goals",{text:v,done:false});i.value="";renderDashboard();}
function toggleGoal(id,ch){Store.update("goals",id,{done:ch});renderDashboard();}
function delItem(name,id){Store.remove(name,id);renderDashboard();renderSongs&&renderSongs();}

function doImport(input){
  const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{Store.importJSON(r.result);alert("✅ 匯入成功！");location.reload();}
    catch(e){alert("❌ 匯入失敗：檔案格式錯誤");}};
  r.readAsText(f);
}

/* ---------- 練功日誌 ---------- */
function renderLogs(){
  const root=document.getElementById("logsBody"); if(!root)return;
  const logs=[...Store.list("logs")].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  let h=`<div class="log-form">
    <div class="log-form-row">
      <label>日期<input type="date" id="logDate" value="${todayStr()}"></label>
      <label>時長(分)<input type="number" id="logMin" min="0" placeholder="30"></label>
      <label>BPM<input type="number" id="logBpm" min="0" placeholder="選填"></label>
    </div>
    <label>主題<input id="logTopic" placeholder="例如：爬格子、Am五聲音階、推弦"></label>
    <label>心得 / 卡關<textarea id="logNote" rows="2" placeholder="今天的感受、遇到的問題…"></textarea></label>
    <button class="add-btn wide" onclick="addLog()">＋ 新增今日紀錄</button>
  </div>`;
  h+=`<div class="log-list">`;
  if(!logs.length) h+=`<p class="hint" style="text-align:center">還沒有任何紀錄，練完吉他來記一筆吧 🎸</p>`;
  logs.forEach(l=>{
    h+=`<div class="log-item">
      <div class="log-item-head">
        <span class="log-date">${esc(l.date)}</span>
        <span class="log-meta">${l.minutes?esc(l.minutes)+"分":""}${l.bpm?" · "+esc(l.bpm)+"BPM":""}</span>
        <button class="del" onclick="delLog('${l.id}')">✕</button>
      </div>
      ${l.topic?`<div class="log-topic">${esc(l.topic)}</div>`:""}
      ${l.note?`<div class="log-note">${esc(l.note)}</div>`:""}
    </div>`;
  });
  h+=`</div>`;
  root.innerHTML=h;
}
function addLog(){
  const date=document.getElementById("logDate").value||todayStr();
  const minutes=document.getElementById("logMin").value;
  const bpm=document.getElementById("logBpm").value;
  const topic=document.getElementById("logTopic").value.trim();
  const note=document.getElementById("logNote").value.trim();
  if(!minutes&&!topic&&!note){alert("至少填一項內容吧！");return;}
  Store.add("logs",{date,minutes,bpm,topic,note});
  renderLogs(); renderDashboard();
}
function delLog(id){ if(confirm("刪除這筆紀錄？")){Store.remove("logs",id);renderLogs();renderDashboard();} }

/* ---------- 曲目庫 ---------- */
const SONG_STATUS={want:"💡 想學",wip:"🔧 練習中",done:"✅ 完成"};
function renderSongs(){
  const root=document.getElementById("songsBody"); if(!root)return;
  const songs=Store.list("songs");
  let h=`<div class="add-row">
    <input id="songName" placeholder="歌名 / 曲目">
    <button class="add-btn" onclick="addSong()">＋</button>
  </div>`;
  if(!songs.length) h+=`<p class="hint" style="text-align:center">把想練的歌加進來，逐步攻克 🎵</p>`;
  ["wip","want","done"].forEach(st=>{
    const arr=songs.filter(s=>s.status===st);
    if(!arr.length)return;
    h+=`<h3 class="sec-h">${SONG_STATUS[st]} <span class="sec-sub">${arr.length}</span></h3>`;
    arr.forEach(s=>{
      h+=`<div class="song-item">
        <div class="song-main">
          <b>${esc(s.name)}</b>
          ${s.note?`<div class="song-note">${esc(s.note)}</div>`:""}
        </div>
        <select onchange="setSongStatus('${s.id}',this.value)">
          ${Object.keys(SONG_STATUS).map(k=>`<option value="${k}" ${k===s.status?"selected":""}>${SONG_STATUS[k]}</option>`).join("")}
        </select>
        <button class="del" onclick="delSong('${s.id}')">✕</button>
      </div>`;
    });
  });
  root.innerHTML=h;
}
function addSong(){const i=document.getElementById("songName");const v=i.value.trim();if(!v)return;Store.add("songs",{name:v,status:"want",note:""});i.value="";renderSongs();}
function setSongStatus(id,st){Store.update("songs",id,{status:st});renderSongs();}
function delSong(id){Store.remove("songs",id);renderSongs();}

/* ---------- 計畫切換器 ---------- */
function renderPlanSwitcher(){
  const el=document.getElementById("planSwitcher"); if(!el)return;
  const ids=Object.keys(PLANS);
  if(ids.length<=1){el.innerHTML="";return;}
  el.innerHTML=`計畫：<select onchange="switchPlan(this.value);switchTab('plan')">`+
    ids.map(id=>`<option value="${id}" ${id===CURRENT_PLAN?"selected":""}>${esc(PLANS[id].name)}</option>`).join("")+`</select>`;
}

/* ---------- 統一初始化 ---------- */
function renderExtras(){
  renderPlanSwitcher();
  renderDashboard();
  renderLogs();
  renderSongs();
}

/* ---------- App 啟動（最後載入，確保所有函式就緒）---------- */
function initApp(){
  if(typeof renderPlan==="function") renderPlan();
  renderExtras();
}
initApp();
