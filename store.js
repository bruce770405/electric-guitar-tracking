/* ============================================================
   Store：統一 localStorage 儲存層（含匯出/匯入備份）
   單一 key "egTracker" 存所有資料，schema 版本化。
   ============================================================ */
const Store = (function(){
  const KEY = "egTracker";
  const VERSION = 1;

  const defaults = () => ({
    version: VERSION,
    activePlan: "plan-6m",
    progress: {},   // { [planId]: { [taskId]: true } }
    logs: [],       // [{id,date,minutes,bpm,topic,note}]
    goals: [],      // [{id,text,done}]
    songs: [],      // [{id,name,status,note}]  status: want|wip|done
  });

  let cache = null;

  function read(){
    if(cache) return cache;
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw){ cache = defaults(); return cache; }
      const data = JSON.parse(raw);
      // 合併預設，補齊缺欄位
      cache = Object.assign(defaults(), data);
      // 巢狀補齊
      cache.progress = cache.progress || {};
      cache.logs = cache.logs || [];
      cache.goals = cache.goals || [];
      cache.songs = cache.songs || [];
      return cache;
    }catch(e){
      console.warn("Store 讀取失敗，重置", e);
      cache = defaults(); return cache;
    }
  }

  function write(){
    try{ localStorage.setItem(KEY, JSON.stringify(cache)); }
    catch(e){ console.error("Store 寫入失敗", e); }
  }

  // ---- 進度 ----
  function getProgress(planId){
    const d = read();
    return d.progress[planId] || (d.progress[planId] = {});
  }
  function setTask(planId, taskId, checked){
    const p = getProgress(planId);
    if(checked) p[taskId] = true; else delete p[taskId];
    write();
  }
  function isChecked(planId, taskId){
    return !!getProgress(planId)[taskId];
  }
  function clearProgress(planId){
    read().progress[planId] = {}; write();
  }

  // ---- 設定 ----
  function getActivePlan(){ return read().activePlan; }
  function setActivePlan(id){ read().activePlan = id; write(); }

  // ---- 通用 list CRUD（logs/goals/songs）----
  function list(name){ return read()[name]; }
  function add(name, item){
    item.id = item.id || (Date.now().toString(36)+Math.random().toString(36).slice(2,6));
    read()[name].push(item); write(); return item.id;
  }
  function update(name, id, patch){
    const arr = read()[name];
    const it = arr.find(x=>x.id===id);
    if(it){ Object.assign(it, patch); write(); }
  }
  function remove(name, id){
    const d = read();
    d[name] = d[name].filter(x=>x.id!==id);
    cache = d; write();
  }

  // ---- 匯出 / 匯入 ----
  function exportJSON(){
    return JSON.stringify(read(), null, 2);
  }
  function download(){
    const blob = new Blob([exportJSON()], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    a.href = url; a.download = `guitar-tracker-backup-${stamp}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }
  function importJSON(text){
    const data = JSON.parse(text); // 失敗會丟錯由呼叫端接
    cache = Object.assign(defaults(), data);
    cache.progress = cache.progress||{}; cache.logs=cache.logs||[];
    cache.goals=cache.goals||[]; cache.songs=cache.songs||[];
    write();
    return true;
  }
  function resetAll(){ cache = defaults(); write(); }

  return { read, getProgress, setTask, isChecked, clearProgress,
    getActivePlan, setActivePlan,
    list, add, update, remove,
    exportJSON, download, importJSON, resetAll };
})();
