// app.js — โค้ดควบคุมการทำงานของแอปทั้งหมด

const $ = id => document.getElementById(id);

/* ============== police track picker ============== */
const TRACK_KEY = 'policeTrackPref';
function loadTrackPref(){ return localStorage.getItem(TRACK_KEY) || ''; }
function saveTrackPref(v){ localStorage.setItem(TRACK_KEY, v); }
function renderTrackPicker(){
  const pref = loadTrackPref();
  $('trackAdmin').classList.toggle('active', pref==='อำนวยการ');
  $('trackCrime').classList.toggle('active', pref==='ปราบปราม');
  const banner = $('trackBanner');
  if(pref){
    banner.classList.add('show');
    banner.innerHTML = `🚓 กำลังติวสำหรับสาย<b>${pref}</b> — เนื้อหาคณิตศาสตร์/ความสามารถทั่วไปในข้อสอบจริงเหมือนกันทั้งสองสาย ต่างกันที่วิชาอื่น (เช่น ปราบปรามมีสอบสมรรถภาพร่างกายเพิ่ม) บทติวตำรวจด้านล่างใช้ได้กับทั้งสองสาย`;
  } else {
    banner.classList.remove('show');
  }
}
document.getElementById('trackAdmin').addEventListener('click', ()=>{
  saveTrackPref(loadTrackPref()==='อำนวยการ' ? '' : 'อำนวยการ');
  renderTrackPicker();
});
document.getElementById('trackCrime').addEventListener('click', ()=>{
  saveTrackPref(loadTrackPref()==='ปราบปราม' ? '' : 'ปราบปราม');
  renderTrackPicker();
});
renderTrackPicker();

/* ============== คลังข้อสอบแยกสาย (มัลติเพิลชอยส์ พร้อมเฉลย + จับเวลา) ============== */

/* จัดหมวดหมู่วิชาให้ข้อสอบแต่ละข้อ (โจทย์ที่สุ่มสร้างจะมี q.cat = MATH_CAT ติดมาอยู่แล้ว
   ส่วนข้อในคลังความรู้ EXAM_BANK ไม่มีหมวดกำกับไว้ จึงจัดหมวดแบบฮิวริสติกจากคำสำคัญในโจทย์ครั้งเดียวตอนโหลด) */
const CAT_THAI = 'ภาษาไทย';
const CAT_POLICE = 'ตำรวจ (ยศ/ระเบียบ)';
const CAT_LAW = 'กฎหมาย/กระบวนการยุติธรรม';
function classifyKnowledgeQuestion(qText){
  const thaiStrong = ['คำราชาศัพท์','สำนวนไทย','สะกดถูกต้อง','พจนานุกรม','ทำหน้าที่ใดในประโยค'];
  const police = ['ยศตำรวจ','ร้อยตำรวจ','ข้าราชการตำรวจ','ชั้นสัญญาบัตร','ชั้นประทวน','พลตำรวจ','ดาบตำรวจ','นายตำรวจ','สำนักงานตำรวจแห่งชาติ'];
  const law = ['กฎหมาย','คดีอาญา','โจทก์','จำเลย','อายุความ','กรรมสิทธิ์','ประจักษ์พยาน','สันนิษฐาน','ผู้บริสุทธิ์','ประมวลกฎหมาย','หมายจับ','หมายค้น','กระบวนการยุติธรรม','ความผิดซึ่งหน้า'];
  if(thaiStrong.some(k=>qText.includes(k))) return CAT_THAI;
  if(police.some(k=>qText.includes(k))) return CAT_POLICE;
  if(law.some(k=>qText.includes(k))) return CAT_LAW;
  if(/"[^"]+"\s*กับ\s*"[^"]+"/.test(qText)) return CAT_THAI;
  return MATH_CAT;
}
Object.keys(EXAM_BANK).forEach(track=>{
  EXAM_BANK[track].forEach(q=>{ if(!q.cat) q.cat = classifyKnowledgeQuestion(q.q); });
});

const EXAM_RESULT_KEY = 'examResults';
function loadExamResults(){ try{ return JSON.parse(localStorage.getItem(EXAM_RESULT_KEY)) || {}; }catch(e){ return {}; } }
function saveExamResult(track, correct, total){
  const results = loadExamResults();
  results[track] = { correct, total, pct: Math.round(correct/total*100), date: new Date().toISOString() };
  localStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(results));
}
let examAnswers = {};
let currentExamTrack = '';
let currentExamQuestions = [];
let currentExamCats = [];
let examTimerInterval = null;
let examTimerSecondsLeft = 0;
let examTimerRunning = false;

function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

// รายชื่อหมวดหมู่ทั้งหมดที่อาจปรากฏในคลังข้อสอบสายหนึ่งๆ (คำนวณจากข้อมูลจริง + หมวดคณิตที่สุ่มสร้างได้ไม่จำกัด)
function getAvailableCats(track){
  const cats = new Set([MATH_CAT]);
  (EXAM_BANK[track] || []).forEach(q => cats.add(q.cat));
  // เรียงให้ MATH_CAT ขึ้นก่อนเสมอ ตามด้วยหมวดอื่นๆ ตามลำดับที่พบ
  return [MATH_CAT, ...[...cats].filter(c => c !== MATH_CAT)];
}

// สร้างชุดข้อสอบจำลอง: ผสมโจทย์คณิตศาสตร์/เชิงเหตุผลที่สุ่มสร้างใหม่ทุกครั้ง (ไม่ซ้ำแทบไม่จำกัด)
// เข้ากับข้อความรู้จริงในคลัง EXAM_BANK[track] (สุ่มหยิบแบบไม่ซ้ำภายในชุดเดียวกัน)
// selectedCats: หมวดหมู่ที่ผู้ใช้เลือกไว้ — ถ้าไม่ระบุหรือว่างเปล่า ใช้ทุกหมวด
// สัดส่วนประมาณ 55% โจทย์คำนวณ/เชิงเหตุผล : 45% ความรู้ทั่วไป/กฎหมาย/ภาษาไทย ใกล้เคียงข้อสอบจริง (เมื่อเลือกทั้งสองกลุ่ม)
function buildExamQuestions(track, total, selectedCats){
  total = total || 150;
  const allCats = getAvailableCats(track);
  const cats = (selectedCats && selectedCats.length) ? selectedCats : allCats;
  const useMath = cats.includes(MATH_CAT);
  const knowledgeCats = cats.filter(c => c !== MATH_CAT);

  const knowledgePool = shuffleArray((EXAM_BANK[track] || []).filter(q => knowledgeCats.includes(q.cat)));

  if(!useMath){
    // เฉพาะหมวดความรู้ (ไม่มีคณิต) — หยิบเท่าที่มีในคลัง (สร้างเพิ่มเองไม่ได้)
    return shuffleArray(knowledgePool.slice(0, Math.min(total, knowledgePool.length)));
  }
  if(knowledgeCats.length === 0){
    // เฉพาะคณิตศาสตร์/ตรรกะ — สุ่มสร้างทั้งหมด
    return shuffleArray(generateUniqueMathQuestions(total, []));
  }

  const mathCount = Math.round(total * 0.55);
  let knowledgeCount = total - mathCount;
  const knowledgeQs = knowledgePool.slice(0, Math.min(knowledgeCount, knowledgePool.length));
  const deficit = knowledgeCount - knowledgeQs.length; // ถ้าคลังความรู้มีไม่พอ ให้เติมด้วยโจทย์คำนวณแทน

  // กันไม่ให้โจทย์ที่สุ่มสร้างซ้ำข้อความเดียวกับข้อในคลังความรู้ที่หยิบมาแล้ว
  const knowledgeTexts = knowledgeQs.map(q => q.q);
  const generated = generateUniqueMathQuestions(mathCount + deficit, knowledgeTexts);

  return shuffleArray([...generated, ...knowledgeQs]);
}

// เรนเดอร์ชิปเลือกหมวดหมู่วิชาสำหรับสุ่มข้อสอบ (ให้เลือกได้ว่าจะเอาหมวดไหนบ้าง)
function renderCatFilterChips(track){
  const el = $('examCatFilter');
  if(!el) return;
  const cats = getAvailableCats(track);
  el.innerHTML = cats.map(c=>`<button type="button" class="examcatchip${currentExamCats.includes(c)?' active':''}" data-cat="${c}">${c}</button>`).join('');
  el.querySelectorAll('.examcatchip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const cat = btn.dataset.cat;
      if(currentExamCats.includes(cat)){
        if(currentExamCats.length <= 1){ showToast('ต้องเลือกอย่างน้อย 1 หมวดหมู่'); return; }
        currentExamCats = currentExamCats.filter(c=>c!==cat);
      } else {
        currentExamCats = [...currentExamCats, cat];
      }
      btn.classList.toggle('active');
      renderExamScreen(currentExamTrack, buildExamQuestions(currentExamTrack, getExamCount(), currentExamCats));
      showToast('ปรับหมวดหมู่แล้ว สุ่มชุดใหม่ให้อัตโนมัติ');
    });
  });
}

function renderExamScreen(track, questions){
  currentExamTrack = track;
  currentExamQuestions = questions || EXAM_BANK[track] || [];
  const qs = currentExamQuestions;
  examAnswers = {};
  $('examDone').classList.remove('show');
  $('examTag').textContent = 'คลังข้อสอบ · สาย' + track;
  $('examTitle').textContent = 'ชุดฝึกจำลอง สาย' + track;
  $('examSub').textContent = `รวม ${qs.length} ข้อ คละหัวข้อตามหมวดที่เลือกไว้ (ชุดฝึกจำลองแนวข้อสอบ ไม่ใช่ข้อสอบจริงที่รั่วไหลออกมา) — โจทย์คำนวณจะถูกสุ่มสร้างใหม่ทุกครั้งที่กดสุ่มชุดข้อสอบใหม่ กดปุ่มด้านล่างเพื่อสุ่มชุดใหม่หรือจับเวลาได้เลย`;
  $('examList').innerHTML = qs.map((q,i)=>`
    <div class="examq">
      <div class="eqhead"><span class="eqnum">ข้อที่ ${i+1}</span><span class="eqcat">${q.cat || ''}</span></div>
      <div class="eqtext">${q.q}</div>
      ${q.choices.map((c,ci)=>`<button class="echoice" data-eqi="${i}" data-eci="${ci}">${c}</button>`).join('')}
      <div class="eexplain" data-eexplain="${i}">${q.explain}</div>
    </div>
  `).join('');
  document.querySelectorAll('.echoice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const qi = parseInt(btn.dataset.eqi);
      const ci = parseInt(btn.dataset.eci);
      if(examAnswers[qi] !== undefined) return;
      examAnswers[qi] = ci;
      const q = qs[qi];
      document.querySelectorAll(`.echoice[data-eqi="${qi}"]`).forEach(b=>{
        const bci = parseInt(b.dataset.eci);
        if(bci === q.correct) b.classList.add('correct');
        else if(bci === ci) b.classList.add('wrong');
      });
      document.querySelector(`[data-eexplain="${qi}"]`).classList.add('show');
      updateExamScore(qs);
    });
  });
  updateExamScore(qs);
}
function updateExamScore(questions){
  const answered = Object.keys(examAnswers).length;
  const correct = Object.entries(examAnswers).filter(([qi,ci])=>questions[qi].correct===ci).length;
  const el = $('examScore');
  if(answered===0){
    el.textContent = 'ยังไม่ได้ตอบข้อไหนเลย — เลือกคำตอบที่ใช่ได้เลย';
  } else if(answered < questions.length){
    el.innerHTML = `ตอบไปแล้ว ${answered}/${questions.length} ข้อ — ตอบถูก <b>${correct}</b> ข้อ`;
  } else {
    el.innerHTML = `ทำครบแล้ว! ได้คะแนน <b>${correct}/${questions.length}</b> (${Math.round(correct/questions.length*100)}%)`;
    finishExam(correct, questions.length, false);
  }
}
function finishExam(correct, total, timedOut){
  stopExamTimer();
  saveExamResult(currentExamTrack, correct, total);
  $('edScoreText').textContent = `${correct}/${total} (${Math.round(correct/total*100)}%)`;
  $('edLabelText').textContent = timedOut ? '⏰ หมดเวลา! นี่คือคะแนนล่าสุดของคุณ — บันทึกลง Dashboard แล้ว' : '🎉 ทำครบทุกข้อแล้ว — บันทึกลง Dashboard แล้ว';
  $('examDone').classList.add('show');
}
/* ---------- จำนวนข้อ + เวลาสอบ: กำหนดเองได้อิสระ พร้อมปุ่มลัดค่าที่นิยมใช้จริง ---------- */
function getExamCount(){
  const el = $('examCountInput');
  let v = el ? parseInt(el.value) : 100;
  if(isNaN(v) || v < 1) v = 100;
  v = Math.max(10, Math.min(300, v));
  if(el) el.value = v;
  return v;
}
function getExamDuration(){
  const el = $('examDurInput');
  let v = el ? parseInt(el.value) : 150;
  if(isNaN(v) || v < 1) v = 150;
  v = Math.max(5, Math.min(300, v));
  if(el) el.value = v;
  return v;
}
// จังหวะเวลาสอบอ้างอิงข้อสอบราชการ/ตำรวจทั่วไปโดยประมาณ (เช่น ก.พ. ภาค ก 100 ข้อ/180 นาที)
// เฉลี่ยราว 1.5-2 นาทีต่อข้อสำหรับข้อสอบผสมความสามารถทั่วไป — ใช้เป็นตัวเลขแนะนำเท่านั้น ไม่ใช่เกณฑ์ทางการ
function updateExamTimeHint(){
  const hint = $('examTimeHint');
  if(!hint) return;
  const count = getExamCount();
  const suggested = Math.max(5, Math.round(count * 1.6 / 5) * 5);
  hint.innerHTML = `⏱️ อ้างอิงจังหวะข้อสอบราชการ/ตำรวจทั่วไป (ประมาณ 1.5–2 นาที/ข้อ เช่น ก.พ. ภาค ก 100 ข้อ/180 นาที) — ${count} ข้อ ≈ <b>${suggested} นาที</b> <button type="button" id="applyTimeHintBtn">ใช้ค่านี้</button> <span class="hintcaveat">(ตัวเลขแนะนำคร่าวๆ เท่านั้น เวลาจริงให้ยึดตามประกาศสอบ)</span>`;
  const btn = $('applyTimeHintBtn');
  if(btn) btn.addEventListener('click', ()=>{
    $('examDurInput').value = suggested;
    showToast('ตั้งเวลาแนะนำแล้ว');
  });
}
function rebuildExamFromControls(msg){
  if(!currentExamTrack) return;
  renderExamScreen(currentExamTrack, buildExamQuestions(currentExamTrack, getExamCount(), currentExamCats));
  updateExamTimeHint();
  if(msg) showToast(msg);
}
if($('examCountInput')){
  $('examCountInput').addEventListener('change', ()=> rebuildExamFromControls('ปรับจำนวนข้อแล้ว สุ่มชุดใหม่ให้อัตโนมัติ'));
}
if($('examCountChips')){
  $('examCountChips').querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $('examCountInput').value = btn.dataset.v;
      rebuildExamFromControls('ปรับจำนวนข้อแล้ว สุ่มชุดใหม่ให้อัตโนมัติ');
    });
  });
}
if($('examDurInput')){
  $('examDurInput').addEventListener('change', ()=> getExamDuration());
}
if($('examDurChips')){
  $('examDurChips').querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $('examDurInput').value = btn.dataset.v;
      getExamDuration();
      showToast('ปรับเวลาสอบแล้ว');
    });
  });
}

function openExamScreen(track){
  currentExamCats = getAvailableCats(track);
  renderCatFilterChips(track);
  renderExamScreen(track, buildExamQuestions(track, getExamCount(), currentExamCats));
  updateExamTimeHint();
  resetExamTimerUI();
  $('roadmap').classList.remove('active');
  $('lesson').classList.remove('active');
  $('examscreen').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}
$('goExamAdmin').addEventListener('click', ()=> openExamScreen('อำนวยการ'));
$('goExamCrime').addEventListener('click', ()=> openExamScreen('ปราบปราม'));
$('examBackBtn').addEventListener('click', ()=>{
  stopExamTimer();
  $('examscreen').classList.remove('active');
  $('roadmap').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
});
$('examShuffleBtn').addEventListener('click', ()=>{
  rebuildExamFromControls('สุ่มชุดข้อสอบใหม่แล้ว ไม่ซ้ำชุดเดิม 🔀');
  window.scrollTo({top:0, behavior:'smooth'});
});
function formatTime(sec){
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = sec%60;
  if(h>0) return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}
function resetExamTimerUI(){
  stopExamTimer();
  const big = $('examTimerBig');
  big.classList.remove('show','warn');
  $('examTimerBtn').textContent = '▶ เริ่มจับเวลา';
  $('examTimerBtn').classList.remove('on');
}
function stopExamTimer(){
  if(examTimerInterval){ clearInterval(examTimerInterval); examTimerInterval = null; }
  examTimerRunning = false;
}
function startExamTimer(){
  const minutes = getExamDuration();
  examTimerSecondsLeft = minutes*60;
  examTimerRunning = true;
  const big = $('examTimerBig');
  big.classList.add('show');
  big.textContent = formatTime(examTimerSecondsLeft);
  $('examTimerBtn').textContent = '■ หยุดจับเวลา';
  $('examTimerBtn').classList.add('on');
  examTimerInterval = setInterval(()=>{
    examTimerSecondsLeft--;
    big.textContent = formatTime(Math.max(0,examTimerSecondsLeft));
    if(examTimerSecondsLeft <= 60) big.classList.add('warn');
    if(examTimerSecondsLeft <= 0){
      stopExamTimer();
      $('examTimerBtn').textContent = '▶ เริ่มจับเวลา';
      $('examTimerBtn').classList.remove('on');
      document.querySelectorAll('.echoice').forEach(b=>b.disabled = true);
      const correct = Object.entries(examAnswers).filter(([qi,ci])=>currentExamQuestions[qi].correct===ci).length;
      finishExam(correct, currentExamQuestions.length, true);
      showToast('⏰ หมดเวลาแล้ว!');
    }
  }, 1000);
}
$('examTimerBtn').addEventListener('click', ()=>{
  if(examTimerRunning){ resetExamTimerUI(); showToast('ยกเลิกการจับเวลา'); }
  else { startExamTimer(); }
});

/* ============== state / storage ============== */
const STORAGE_KEY = 'mathRoadmapProgress';
function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ return {}; }
}
function saveProgress(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
let progress = loadProgress();
let currentIdx = 0;
let currentSubject = 'math';

function getCurrentTopics(){
  if(currentSubject === 'math') return TOPICS;
  return OTHER_TOPICS[currentSubject] || [];
}

function updateProgressBar(){
  const topics = getCurrentTopics();
  const done = topics.filter(t=>progress[t.id]).length;
  $('progText').textContent = done + ' / ' + topics.length + ' บท';
  $('progFill').style.width = (topics.length ? Math.round(done/topics.length*100) : 0) + '%';
}

function renderRoadmap(){
  let html = '';
  let lastSection = null;
  const topics = getCurrentTopics();
  topics.forEach((t,i)=>{
    if(t.section && t.section !== lastSection){
      html += `<div class="section-label">
        <div class="sl-icon">🚓</div>
        <div>
          <div class="sl-text">${t.section}</div>
          <div class="sl-sub">ใช้ติวได้ทั้งสายอำนวยการและสายปราบปราม (เนื้อหาข้อสอบเหมือนกัน)</div>
        </div>
      </div>`;
      lastSection = t.section;
    }
    const isDone = !!progress[t.id];
    const policeClass = t.section ? ' police' : '';
    html += `<div class="node${isDone?' done':''}${policeClass}" data-idx="${i}">
      <div class="dot"><span>${i+1}</span></div>
      <div class="card">
        <div class="ntitle">${t.title}</div>
        <div class="nsub">${t.sub}</div>
        <span class="ntag">${t.tag || 'บทเรียน'}</span>
      </div>
    </div>`;
  });
  $('rmapList').innerHTML = html || `<div class="nsub">ยังไม่มีเนื้อหาในวิชานี้</div>`;
  document.querySelectorAll('.node').forEach(n=>{
    n.addEventListener('click', ()=> openLesson(parseInt(n.dataset.idx)));
  });
  updateProgressBar();
}

function showToast(msg){
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 1600);
}

function renderStepsHtml(steps){
  return steps.map((s,i)=>{
    const calcHtml = s.c ? `<span class="calc">${s.c.replace(/\n/g,'<br>')}</span>` : '';
    return `<div class="step"><div class="snum">${i+1}</div><div class="stxt">${s.t}${calcHtml}</div></div>`;
  }).join('');
}

/* คำตอบอาจเป็นตัวเลขหรือข้อความ (วิชาไทย/อังกฤษ/กฎหมาย/สังคม) — เช็คให้ถูกทั้งสองแบบ */
function normalizeText(s){
  return String(s).trim().toLowerCase().replace(/\s+/g,' ');
}
function checkAnswer(userInput, correctAnswer){
  if(typeof correctAnswer === 'number'){
    const val = parseFloat(userInput);
    if(isNaN(val)) return {ok:false, invalidNumber:true};
    return {ok: Math.abs(val - correctAnswer) < 0.001};
  }
  if(String(userInput).trim() === ''){ return {ok:false, invalidNumber:false}; }
  return {ok: normalizeText(userInput) === normalizeText(correctAnswer)};
}

function openLesson(idx){
  currentIdx = idx;
  const t = getCurrentTopics()[idx];
  $('lTag').textContent = t.tag || t.title;
  $('lTitle').textContent = t.title;
  $('lSub').textContent = t.sub;
  $('lExplain').innerHTML = t.explain.map(e=>`<li>${e}</li>`).join('');
  $('exProblem').textContent = (t.example && t.example.problem) ? t.example.problem : t.practice[0].q;
  $('exSteps').innerHTML = (t.example && t.example.steps) ? renderStepsHtml(t.example.steps) : `<div class="step"><div class="snum">1</div><div class="stxt">${t.practice[0].hint || 'ลองทบทวนหลักการด้านบน แล้วตอบในแบบฝึกหัดด้านล่างได้เลย'}</div></div>`;
  $('exAnswer').textContent = (t.example && t.example.answer) ? t.example.answer : t.practice[0].a;
  $('lTip').innerHTML = (t.tip && t.tip.length) ? t.tip.map(p=>`<p>${p}</p>`).join('') : '<p>ไม่มีเทคนิคเพิ่มเติมสำหรับบทนี้</p>';
  $('lPractice').innerHTML = t.practice.map((q,i)=>{
    const isNumeric = typeof q.a === 'number';
    return `
    <div class="q" data-qi="${i}">
      <div class="q-text">${i+1}. ${q.q}</div>
      <div class="q-row">
        <input type="text" inputmode="${isNumeric?'decimal':'text'}" placeholder="พิมพ์คำตอบ" data-qinput="${i}">
        <button data-qcheck="${i}">ตรวจคำตอบ</button>
      </div>
      <button class="q-hintbtn" data-qhintbtn="${i}">💡 ยังไม่รู้จะตอบยังไง? ดูคำใบ้ก่อน</button>
      <div class="q-hintbox" data-qhintbox="${i}">${q.hint||'ลองทบทวนหลักการด้านบนอีกครั้งนะ'}</div>
      <div class="q-fb" data-qfb="${i}"></div>
    </div>
  `;}).join('');

  document.querySelectorAll('[data-qhintbtn]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = btn.dataset.qhintbtn;
      const box = document.querySelector(`[data-qhintbox="${i}"]`);
      const showing = box.classList.toggle('show');
      btn.textContent = showing ? '💡 ซ่อนคำใบ้' : '💡 ยังไม่รู้จะตอบยังไง? ดูคำใบ้ก่อน';
    });
  });

  document.querySelectorAll('[data-qcheck]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = parseInt(btn.dataset.qcheck);
      const q = t.practice[i];
      const input = document.querySelector(`[data-qinput="${i}"]`);
      const fb = document.querySelector(`[data-qfb="${i}"]`);
      const result = checkAnswer(input.value, q.a);
      if(!result.ok && result.invalidNumber){
        fb.className='q-fb no'; fb.textContent='พิมพ์คำตอบเป็นตัวเลขก่อนนะ'; return;
      }
      if(result.ok){
        fb.className='q-fb ok'; fb.textContent='ถูกต้อง! 🎉';
      } else {
        fb.className='q-fb no'; fb.textContent='ยังไม่ใช่ ลองอีกครั้ง — คำใบ้: ' + (q.hint||'');
      }
    });
  });

  const isDone = !!progress[t.id];
  const doneBtn = $('doneBtn');
  doneBtn.textContent = isDone ? '✓ เรียนจบบทนี้แล้ว' : '✓ ทำเครื่องหมายว่าเรียนจบบทนี้';
  doneBtn.classList.toggle('isdone', isDone);

  $('prevBtn').disabled = idx===0;
  $('nextBtn').disabled = idx===getCurrentTopics().length-1;

  $('roadmap').classList.remove('active');
  $('lesson').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}

function closeLesson(){
  $('lesson').classList.remove('active');
  $('roadmap').classList.add('active');
  renderRoadmap();
  window.scrollTo({top:0, behavior:'instant'});
}

/* ---------- ระบบสลับวิชา ---------- */
function switchSubject(sub, btnEl){
  currentSubject = sub;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if(btnEl) btnEl.classList.add('active');
  currentIdx = 0;
  renderRoadmap();
}

/* ---------- ระบบ Flashcards (โมดัลจริง ไม่ใช้ alert) ---------- */
let fcCards = [];
let fcIdx = 0;
let fcFlipped = false;
function buildFcCards(){
  return getCurrentTopics().map(t => ({
    front: t.title,
    back: t.sub || (t.explain && t.explain[0]) || ''
  }));
}
function renderFcCard(){
  if(fcCards.length === 0){
    $('fcCount').textContent = 'ยังไม่มีเนื้อหา';
    $('fcText').innerHTML = 'วิชานี้ยังไม่มีบทเรียนให้ทบทวน ลองสลับไปวิชาอื่นดูนะ';
    $('fcCard').classList.remove('flipped');
    $('fcPrev').disabled = true; $('fcNext').disabled = true; $('fcFlip').disabled = true;
    return;
  }
  $('fcFlip').disabled = false;
  $('fcCount').textContent = `การ์ด ${fcIdx+1}/${fcCards.length}`;
  const card = fcCards[fcIdx];
  $('fcText').innerHTML = fcFlipped ? card.back : card.front;
  $('fcCard').classList.toggle('flipped', fcFlipped);
  $('fcPrev').disabled = fcIdx === 0;
  $('fcNext').disabled = fcIdx === fcCards.length - 1;
}
function openFlashcards(){
  fcCards = buildFcCards();
  fcIdx = 0;
  fcFlipped = false;
  renderFcCard();
  $('fcOverlay').classList.add('show');
}
function closeFlashcards(){
  $('fcOverlay').classList.remove('show');
}
$('fcClose').addEventListener('click', closeFlashcards);
$('fcOverlay').addEventListener('click', (e)=>{ if(e.target.id==='fcOverlay') closeFlashcards(); });
$('fcCard').addEventListener('click', ()=>{ fcFlipped = !fcFlipped; renderFcCard(); });
$('fcFlip').addEventListener('click', ()=>{ fcFlipped = !fcFlipped; renderFcCard(); });
$('fcPrev').addEventListener('click', ()=>{ if(fcIdx>0){ fcIdx--; fcFlipped=false; renderFcCard(); } });
$('fcNext').addEventListener('click', ()=>{ if(fcIdx<fcCards.length-1){ fcIdx++; fcFlipped=false; renderFcCard(); } });

/* ============== Event Listeners หลัก ============== */
$('backBtn').addEventListener('click', closeLesson);
$('prevBtn').addEventListener('click', ()=>{ if(currentIdx>0) openLesson(currentIdx-1); });
$('nextBtn').addEventListener('click', ()=>{ if(currentIdx<getCurrentTopics().length-1) openLesson(currentIdx+1); });
$('doneBtn').addEventListener('click', ()=>{
  const t = getCurrentTopics()[currentIdx];
  progress[t.id] = !progress[t.id];
  saveProgress(progress);
  const isDone = !!progress[t.id];
  $('doneBtn').textContent = isDone ? '✓ เรียนจบบทนี้แล้ว' : '✓ ทำเครื่องหมายว่าเรียนจบบทนี้';
  $('doneBtn').classList.toggle('isdone', isDone);
  updateProgressBar();
  if(isDone) showToast('บันทึกความคืบหน้าแล้ว 🎉');
});

/* ============== ฝึกสมรรถภาพร่างกาย (Fitness) ============== */
const FIT_SCHEDULE = [
  {name:'สัปดาห์ 1-2', target:'วิ่งเบาๆ 1-1.5 กม. 3 วัน/สัปดาห์ + ดันพื้น/ลุกนั่ง 2 เซต x 10 ครั้ง'},
  {name:'สัปดาห์ 3-4', target:'วิ่ง 1.5-2 กม. 3-4 วัน/สัปดาห์ + ดันพื้น/ลุกนั่ง 2 เซต x 15 ครั้ง'},
  {name:'สัปดาห์ 5-6', target:'วิ่งจับเวลา 1,000 ม. ทุก 3 วัน + ดันพื้น/ลุกนั่ง 3 เซต x 20 ครั้ง'},
  {name:'สัปดาห์ 7', target:'วิ่ง 1,000 ม. แบบจับเวลาเต็มรูปแบบ 2 ครั้ง/สัปดาห์ + ฝึกท่าดันพื้น/ลุกนั่งแบบทดสอบจริง'},
  {name:'สัปดาห์ 8', target:'ลดปริมาณ เน้นฟอร์มและความเร็ว เตรียมร่างกายให้พร้อมที่สุดก่อนวันสอบจริง'}
];
function renderFitSchedule(){
  $('fitScheduleList').innerHTML = FIT_SCHEDULE.map(w=>`
    <div class="fitweek"><span class="fwname">${w.name}</span><span class="fwtarget">${w.target}</span></div>
  `).join('');
}
function openFitnessScreen(){
  renderFitSchedule();
  $('roadmap').classList.remove('active');
  $('lesson').classList.remove('active');
  $('examscreen').classList.remove('active');
  $('dashboardscreen').classList.remove('active');
  $('fitnessscreen').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}
$('fitnessBackBtn').addEventListener('click', ()=>{
  stopStopwatch();
  $('fitnessscreen').classList.remove('active');
  $('roadmap').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
});

/* ---------- stopwatch ---------- */
let swElapsedMs = 0;
let swStartTime = 0;
let swInterval = null;
let swRunning = false;
let swLapCount = 0;
function formatSw(ms){
  const totalCs = Math.floor(ms/100);
  const m = Math.floor(totalCs/600);
  const s = Math.floor((totalCs%600)/10);
  const cs = totalCs%10;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+cs;
}
function tickStopwatch(){
  const now = Date.now();
  $('swDisplay').textContent = formatSw(swElapsedMs + (now - swStartTime));
}
function startStopwatch(){
  swRunning = true;
  swStartTime = Date.now();
  $('swStartBtn').textContent = 'หยุดชั่วคราว';
  swInterval = setInterval(tickStopwatch, 100);
}
function pauseStopwatch(){
  swRunning = false;
  swElapsedMs += Date.now() - swStartTime;
  clearInterval(swInterval);
  $('swStartBtn').textContent = 'เริ่มต่อ';
}
function stopStopwatch(){
  swRunning = false;
  clearInterval(swInterval);
}
function resetStopwatch(){
  stopStopwatch();
  swElapsedMs = 0;
  swLapCount = 0;
  $('swDisplay').textContent = '00:00.0';
  $('swStartBtn').textContent = 'เริ่ม';
  $('swLaps').innerHTML = '';
}
$('swStartBtn').addEventListener('click', ()=>{
  if(swRunning) pauseStopwatch();
  else startStopwatch();
});
$('swResetBtn').addEventListener('click', resetStopwatch);
$('swLapBtn').addEventListener('click', ()=>{
  if(!swRunning) return;
  swLapCount++;
  const now = Date.now();
  const total = swElapsedMs + (now - swStartTime);
  const row = document.createElement('div');
  row.className = 'swlap';
  row.innerHTML = `<span>รอบที่ ${swLapCount}</span><span>${formatSw(total)}</span>`;
  $('swLaps').prepend(row);
});

/* ============== Dashboard: สรุปผล + นับถอยหลัง ============== */
const EXAM_DATE_KEY = 'policeExamDate';
function openDashboardScreen(){
  renderDashboard();
  $('roadmap').classList.remove('active');
  $('lesson').classList.remove('active');
  $('examscreen').classList.remove('active');
  $('fitnessscreen').classList.remove('active');
  $('dashboardscreen').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}
$('dashboardBackBtn').addEventListener('click', ()=>{
  $('dashboardscreen').classList.remove('active');
  $('roadmap').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
});
function renderCountdown(){
  const savedDate = localStorage.getItem(EXAM_DATE_KEY);
  const wrap = $('countdownWrap');
  if(!savedDate){
    wrap.innerHTML = '<div class="dashempty">ยังไม่ได้ตั้งวันสอบ — เลือกวันที่ด้านล่างแล้วกดบันทึก</div>';
    return;
  }
  const target = new Date(savedDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffDays = Math.round((target - today) / 86400000);
  if(diffDays > 0){
    wrap.innerHTML = `<div class="countdownnum">${diffDays}</div><div class="countdownlabel">วัน ก่อนถึงวันสอบ (${savedDate})</div>`;
  } else if(diffDays === 0){
    wrap.innerHTML = `<div class="countdownnum">วันนี้!</div><div class="countdownlabel">คือวันสอบ — สู้ๆ นะครับ 💪</div>`;
  } else {
    wrap.innerHTML = `<div class="countdownnum">✓</div><div class="countdownlabel">วันสอบ (${savedDate}) ผ่านไปแล้ว</div>`;
  }
  $('examDateInput').value = savedDate;
}
$('examDateSaveBtn').addEventListener('click', ()=>{
  const val = $('examDateInput').value;
  if(!val){ showToast('กรุณาเลือกวันที่ก่อน'); return; }
  localStorage.setItem(EXAM_DATE_KEY, val);
  renderCountdown();
  showToast('บันทึกวันสอบแล้ว 📆');
});
function renderDashLessonProgress(){
  const subjects = [
    {key:'math', label:'📐 คณิตศาสตร์', topics:TOPICS},
    {key:'thai', label:'📖 ภาษาไทย', topics:OTHER_TOPICS.thai},
    {key:'eng', label:'🔤 ภาษาอังกฤษ', topics:OTHER_TOPICS.eng},
    {key:'law', label:'⚖️ กฎหมาย', topics:OTHER_TOPICS.law},
    {key:'social', label:'🌏 สังคม', topics:OTHER_TOPICS.social}
  ];
  $('dashLessonProgress').innerHTML = subjects.map(s=>{
    const done = s.topics.filter(t=>progress[t.id]).length;
    const total = s.topics.length;
    const pct = total ? Math.round(done/total*100) : 0;
    return `<div class="dashrow">
      <div class="drtop"><b>${s.label}</b><span>${done}/${total} บท (${pct}%)</span></div>
      <div class="dashbar"><div class="dashbar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}
function renderDashExamAccuracy(){
  const results = loadExamResults();
  const tracks = ['อำนวยการ','ปราบปราม'];
  const rows = tracks.map(track=>{
    const r = results[track];
    if(!r) return `<div class="dashrow"><div class="drtop"><b>สาย${track}</b><span>ยังไม่ได้ทำ</span></div><div class="dashbar"><div class="dashbar-fill amber" style="width:0%"></div></div></div>`;
    return `<div class="dashrow">
      <div class="drtop"><b>สาย${track}</b><span>${r.correct}/${r.total} (${r.pct}%)</span></div>
      <div class="dashbar"><div class="dashbar-fill amber" style="width:${r.pct}%"></div></div>
    </div>`;
  }).join('');
  $('dashExamAccuracy').innerHTML = rows;
}
function renderDashboard(){
  renderCountdown();
  renderDashLessonProgress();
  renderDashExamAccuracy();
}

renderRoadmap();

