// app.js — โค้ดควบคุมการทำงานของแอปทั้งหมด

const $ = id => document.getElementById(id);

/* ============== ตัวสลับหน้าจอกลาง (ใช้ร่วมกับแถบเมนูล่างแบบแอป) ============== */
const ALL_SCREENS = ['roadmap','lesson','examscreen','fitnessscreen','dashboardscreen','vocabScreen','storescreen'];
const SCREEN_NAV_MAP = { roadmap:'roadmap', lesson:'roadmap', examscreen:'exam', fitnessscreen:'fitness', dashboardscreen:'home', vocabScreen:'roadmap', storescreen:'store' };
function showScreen(id){
  ALL_SCREENS.forEach(s=>{ const el = $(s); if(el) el.classList.toggle('active', s===id); });
  const navKey = SCREEN_NAV_MAP[id];
  document.querySelectorAll('#bottomNav .navbtn').forEach(b=> b.classList.toggle('active', b.dataset.nav===navKey));
  const extras = $('roadmapExtras');
  if(extras) extras.classList.toggle('hide', id !== 'roadmap');
  if(typeof renderExamDatePill === 'function') renderExamDatePill();
  window.scrollTo({top:0, behavior:'instant'});
}
function goRoadmapTab(){
  stopExamTimer(); stopStopwatch(); if(typeof stopVocabTimer==='function') stopVocabTimer();
  renderRoadmap();
  showScreen('roadmap');
}
function goExamTab(){
  openExamScreen(loadTrackPref() || 'อำนวยการ');
}

/* ============== theme switcher (กลางคืน/มืด/กลางวัน) ============== */
const THEME_KEY = 'appThemePref';
function loadThemePref(){ return localStorage.getItem(THEME_KEY) || 'dark'; }
function saveThemePref(v){ localStorage.setItem(THEME_KEY, v); }
function applyTheme(theme){
  if(theme === 'dark'){ document.documentElement.removeAttribute('data-theme'); }
  else{ document.documentElement.setAttribute('data-theme', theme); }
  document.querySelectorAll('#themeBtns .icbtn').forEach(b=>{
    b.classList.toggle('active', b.dataset.theme === theme);
  });
  saveThemePref(theme);
}
document.querySelectorAll('#themeBtns .icbtn').forEach(b=>{
  b.addEventListener('click', ()=> applyTheme(b.dataset.theme));
});
applyTheme(loadThemePref());

/* ============== ปรับความสว่างหน้าจอ (เหมือนสไลด์ปรับแสงมือถือ) ============== */
const BRIGHT_KEY = 'appBrightnessPref';
function loadBrightPref(){ const v = parseInt(localStorage.getItem(BRIGHT_KEY), 10); return isNaN(v) ? 100 : v; }
function saveBrightPref(v){ localStorage.setItem(BRIGHT_KEY, String(v)); }
function applyBrightness(pct){
  document.documentElement.style.setProperty('--user-brightness', (pct / 100).toFixed(2));
  saveBrightPref(pct);
}
const brightSlider = $('brightSlider');
if(brightSlider){
  brightSlider.value = loadBrightPref();
  applyBrightness(brightSlider.value);
  brightSlider.addEventListener('input', ()=> applyBrightness(brightSlider.value));
}

/* ============== เปลี่ยนภาษา UI (ไทย/อังกฤษ/จีน/ญี่ปุ่น) ==============
   หมายเหตุ: แปลเฉพาะข้อความหน้าจอหลัก (ปุ่ม/หัวข้อ/ป้ายกำกับ) เท่านั้น
   เนื้อหาบทเรียนและคลังข้อสอบยังคงเป็นภาษาไทย เพราะเป็นเนื้อหาสำหรับสอบข้าราชการไทยโดยเฉพาะ
   (เช่น ข้อสอบวัดความสามารถภาษาไทย/กฎหมายไทย การแปลจะทำให้ข้อสอบเสียความหมาย/ใช้ติวจริงไม่ได้) */
const LANG_KEY = 'appLangPref';
const TRANSLATIONS = {
  appTitle:        { en:'Police Exam & Math Prep', zh:'警考与数学备考', ja:'警察試験＆数学対策' },
  appSubtitle:      { en:'Step-by-step from the basics — every subject you need for the exam', zh:'从基础开始循序渐进，涵盖考试所需全部科目', ja:'基礎から順を追って、試験に必要な全科目を網羅' },
  tabMath:          { en:'Math', zh:'数学', ja:'数学' },
  tabThai:          { en:'Thai', zh:'泰语', ja:'タイ語' },
  tabEng:           { en:'English', zh:'英语', ja:'英語' },
  tabLaw:           { en:'Law', zh:'法律', ja:'法律' },
  tabSocial:        { en:'Social', zh:'社会', ja:'社会' },
  tabComputer:      { en:'Computer', zh:'计算机', ja:'コンピュータ' },
  tabPoliceBasic:   { en:'Police Basics', zh:'警务基础', ja:'警察基礎知識' },
  toolFlash:        { en:'Review Lessons (Flashcards)', zh:'复习课程（速记卡）', ja:'レッスン復習（フラッシュカード）' },
  toolFitness:      { en:'Fitness Training', zh:'体能训练', ja:'体力トレーニング' },
  toolDashboard:    { en:'Summary / Countdown', zh:'总结/倒计时', ja:'サマリー／カウントダウン' },
  safetyTitle:      { en:'Privacy & Safety (read before use)', zh:'隐私与安全（使用前必读）', ja:'安全性について（利用前にお読みください）' },
  trackLabel:       { en:'Choose your exam track (for the special police lessons & exam bank below)', zh:'选择报考序列（用于下方专属警考课程与题库）', ja:'受験コースを選択（下記の警察特別レッスンと問題バンク用）' },
  trackAdmin:       { en:'Administrative Track', zh:'行政序列', ja:'事務系コース' },
  trackCrime:       { en:'Crime Suppression Track', zh:'治安打击序列', ja:'犯罪鎮圧コース' },
  examNavAdmin:     { en:'Admin Track Exam Bank', zh:'行政序列题库', ja:'事務系コース問題バンク' },
  examNavCrime:     { en:'Crime Suppression Exam Bank', zh:'治安打击序列题库', ja:'犯罪鎮圧コース問題バンク' },
  progressLabel:    { en:'Progress', zh:'学习进度', ja:'進捗' },
  backToRoadmap:    { en:'Back to Roadmap', zh:'返回内容地图', ja:'ロードマップに戻る' },
  examCatFilterLabel:{ en:'Subject categories to draw from (tap to toggle)', zh:'抽题科目分类（点击切换）', ja:'出題する科目カテゴリー（タップで切替）' },
  examCountLabel:   { en:'Number of questions (type your own, 10–300)', zh:'题目数量（可自定义 10-300 题）', ja:'問題数（10〜300問で自由入力可）' },
  examDurLabel:     { en:'Exam duration (minutes) — type your own, 5–300', zh:'考试时间（分钟）— 可自定义 5-300 分钟', ja:'試験時間（分）— 5〜300分で自由入力可' },
  examShuffleBtn:   { en:'Shuffle New Set', zh:'重新抽题', ja:'新しいセットをシャッフル' },
  examTimerBtn:     { en:'Start Timer', zh:'开始计时', ja:'タイマー開始' },
  fitnessH2:        { en:'Physical Fitness Training', zh:'体能训练', ja:'体力トレーニング' },
  fitnessP:         { en:'For those preparing for the Crime Suppression track exam (and other tracks with a fitness test) — running, push-ups, sit-ups', zh:'适用于备考治安打击序列（及其他有体能测试的序列）— 跑步、俯卧撑、仰卧起坐', ja:'犯罪鎮圧コース（体力試験のある他コースも含む）受験者向け — ランニング、腕立て伏せ、腹筋' },
  dashboardH2:      { en:'Overall Summary & Exam Countdown', zh:'总体总结与考试倒计时', ja:'総合サマリー＆試験カウントダウン' },
  dashboardP:       { en:"An overview of your progress and accuracy in each subject", zh:'各科目学习进度与准确率总览', ja:'各科目の進捗と正答率の概要' },
  fcHint:           { en:'Tap the card to see the answer', zh:'点击卡片查看答案', ja:'カードをタップして答えを見る' },
  fcPrev:           { en:'Previous', zh:'上一个', ja:'前へ' },
  fcFlip:           { en:'Flip Card', zh:'翻转卡片', ja:'カードを裏返す' },
  fcNext:           { en:'Next', zh:'下一个', ja:'次へ' },
  dataBackupLabel:  { en:'Backup / Restore Data (progress, exam scores, exam date)', zh:'备份/恢复数据（学习进度、考试成绩、考试日期）', ja:'データのバックアップ／復元（進捗・試験結果・試験日）' },
  dataExportBtn:    { en:'Export Backup File', zh:'导出备份文件', ja:'バックアップを書き出す' },
  dataImportBtn:    { en:'Import Backup File', zh:'导入备份文件', ja:'バックアップを読み込む' },
  dataBackupMsg:    { en:'All data is stored only in this browser\'s Local Storage. Clearing your cache or switching devices/browsers will erase it unless you back it up first. We recommend exporting a backup periodically.', zh:'所有数据仅保存在本浏览器的 Local Storage 中。清除缓存或更换设备/浏览器将导致数据丢失，请提前导出备份。建议定期导出备份。', ja:'すべてのデータはこのブラウザのLocal Storageにのみ保存されています。キャッシュを消去したり端末・ブラウザを変更すると、事前にバックアップしない限りデータは消えます。定期的にバックアップの書き出しをおすすめします。' },
  toolVocab:        { en:'Vocab Matching Game', zh:'词汇配对游戏', ja:'単語マッチングゲーム' },
  vocabH2:          { en:'EN-TH Vocab Matching Game', zh:'英泰词汇配对游戏', ja:'英タイ単語マッチングゲーム' },
  vocabP:           { en:'Common government-exam and police-specific terms — match them all as fast as you can', zh:'常见于公务员考试及警务专用词汇 — 尽快全部配对完成', ja:'公務員試験や警察専門用語 — できるだけ速くすべてマッチさせよう' },
};
// เก็บข้อความไทยต้นฉบับไว้ก่อน เพื่อใช้สลับกลับตอนเลือก "TH"
const THAI_ORIGINALS = {};
document.querySelectorAll('[data-i18n]').forEach(el=>{
  THAI_ORIGINALS[el.dataset.i18n] = THAI_ORIGINALS[el.dataset.i18n] ?? el.textContent;
});
function applyLanguage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    if(lang === 'th' || !TRANSLATIONS[key] || !TRANSLATIONS[key][lang]){
      el.textContent = THAI_ORIGINALS[key] ?? el.textContent;
    } else {
      el.textContent = TRANSLATIONS[key][lang];
    }
  });
  document.querySelectorAll('#langBtns .langbtn').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  localStorage.setItem(LANG_KEY, lang);
}
document.querySelectorAll('#langBtns .langbtn').forEach(b=>{
  b.addEventListener('click', ()=> applyLanguage(b.dataset.lang));
});
applyLanguage(localStorage.getItem(LANG_KEY) || 'th');

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
      ${q.choices.map((c,ci)=>`<button class="echoice" data-eqi="${i}" data-eci="${ci}"><span class="etext">${c}</span><span class="eicon ic-correct">✓</span><span class="eicon ic-wrong">✗</span></button>`).join('')}
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
      logActivity(1);
      logCatAnswer(currentExamTrack, q.cat || MATH_CAT, ci === q.correct);
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

function openExamScreen(track, presetCats){
  const avail = getAvailableCats(track);
  currentExamCats = (presetCats && presetCats.length) ? presetCats.filter(c=>avail.includes(c)) : avail;
  if(currentExamCats.length === 0) currentExamCats = avail;
  renderCatFilterChips(track);
  renderExamScreen(track, buildExamQuestions(track, getExamCount(), currentExamCats));
  updateExamTimeHint();
  resetExamTimerUI();
  showScreen('examscreen');
}
$('goExamAdmin').addEventListener('click', ()=> openExamScreen('อำนวยการ'));
$('goExamCrime').addEventListener('click', ()=> openExamScreen('ปราบปราม'));
$('examBackBtn').addEventListener('click', ()=>{
  stopExamTimer();
  goRoadmapTab();
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
      logActivity(1);
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

  showScreen('lesson');
}

function closeLesson(){
  renderRoadmap();
  showScreen('roadmap');
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
  renderFitChecklist();
  showScreen('fitnessscreen');
}
$('fitnessBackBtn').addEventListener('click', ()=>{
  stopStopwatch();
  goRoadmapTab();
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
  showScreen('dashboardscreen');
}
$('dashboardBackBtn').addEventListener('click', goRoadmapTab);
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
  renderExamDatePill();
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
  renderStreak();
  renderWeakPoints();
}

/* ============== สำรอง/กู้คืนข้อมูล (Export / Import) ==============
   รวมข้อมูลทั้งหมดที่ผู้ใช้สะสมไว้ (ความคืบหน้าบทเรียน, คะแนนสอบ, สายที่เลือก, วันสอบ,
   และค่ากำหนดหน้าจอ) เป็นไฟล์ JSON เดียว ให้ดาวน์โหลดเก็บไว้ แล้วนำกลับมาใช้ในเครื่อง/เบราว์เซอร์อื่นได้
   ทำงานฝั่ง client ล้วนๆ ไม่มีการส่งข้อมูลออกไปที่ไหนทั้งสิ้น */
const BACKUP_KEYS = [
  STORAGE_KEY, EXAM_RESULT_KEY, EXAM_DATE_KEY, TRACK_KEY,
  THEME_KEY, BRIGHT_KEY, LANG_KEY, 'fitnessTestResults'
];
function exportBackup(){
  const payload = { app:'ติวสอบตำรวจ & คณิตศาสตร์', exportedAt: new Date().toISOString(), data:{} };
  BACKUP_KEYS.forEach(k=>{
    const v = localStorage.getItem(k);
    if(v !== null) payload.data[k] = v;
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `police-math-prep-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('ส่งออกไฟล์สำรองแล้ว ⬇️');
}
function importBackup(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const payload = JSON.parse(reader.result);
      const data = payload && payload.data;
      if(!data || typeof data !== 'object') throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
      // นำเข้าเฉพาะคีย์ที่แอปรู้จักเท่านั้น ป้องกันไฟล์แปลกปลอมเขียนทับ localStorage คีย์อื่น
      let restored = 0;
      BACKUP_KEYS.forEach(k=>{
        if(Object.prototype.hasOwnProperty.call(data, k)){
          localStorage.setItem(k, data[k]);
          restored++;
        }
      });
      if(restored === 0){ showToast('ไม่พบข้อมูลที่นำเข้าได้ในไฟล์นี้'); return; }
      showToast('นำเข้าข้อมูลสำเร็จ กำลังโหลดหน้าใหม่... ✅');
      setTimeout(()=> window.location.reload(), 900);
    } catch(e){
      showToast('ไฟล์นี้ใช้ไม่ได้ กรุณาเลือกไฟล์สำรองที่ส่งออกจากแอปนี้');
    }
  };
  reader.onerror = () => showToast('อ่านไฟล์ไม่สำเร็จ');
  reader.readAsText(file);
}
if($('dataExportBtn')) $('dataExportBtn').addEventListener('click', exportBackup);
if($('dataImportBtn')) $('dataImportBtn').addEventListener('click', ()=> $('dataImportInput').click());
if($('dataImportInput')) $('dataImportInput').addEventListener('change', (e)=>{
  const file = e.target.files && e.target.files[0];
  if(file) importBackup(file);
  e.target.value = '';
});

/* ============== Activity Log (พื้นฐานสำหรับ Streak + Heatmap) ==============
   บันทึกจำนวนข้อที่ตอบต่อวันใน localStorage (ไม่เก็บว่าตอบถูกหรือผิด แค่ "มีกิจกรรม")
   เรียกใช้จากทุกจุดที่ผู้ใช้ตอบคำถาม: ข้อสอบ, แบบฝึกหัดท้ายบท, โจทย์ประจำวัน */
const ACTIVITY_KEY = 'activityLog';
function loadActivityLog(){
  try{ return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || {}; }catch(e){ return {}; }
}
function todayKey(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function dateKeyOf(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function logActivity(n){
  n = n || 1;
  const log = loadActivityLog();
  const key = todayKey();
  log[key] = (log[key] || 0) + n;
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
}

/* ============== สถิติความแม่นยำแยกหมวดหมู่ (สำหรับฟีเจอร์จุดที่ควรพัฒนา) ==============
   เก็บแยกตามสาย (อำนวยการ/ปราบปราม) แล้วแยกตามหมวดวิชาอีกชั้น */
const CATSTATS_KEY = 'catStats';
function loadCatStats(){
  try{ return JSON.parse(localStorage.getItem(CATSTATS_KEY)) || {}; }catch(e){ return {}; }
}
function logCatAnswer(track, cat, correct){
  if(!track || !cat) return;
  const stats = loadCatStats();
  if(!stats[track]) stats[track] = {};
  if(!stats[track][cat]) stats[track][cat] = {correct:0, total:0};
  stats[track][cat].total++;
  if(correct) stats[track][cat].correct++;
  localStorage.setItem(CATSTATS_KEY, JSON.stringify(stats));
}
function mergeCatStats(stats){
  const merged = {};
  Object.values(stats).forEach(trackStats=>{
    Object.entries(trackStats).forEach(([cat,s])=>{
      if(!merged[cat]) merged[cat] = {correct:0, total:0};
      merged[cat].correct += s.correct;
      merged[cat].total += s.total;
    });
  });
  return merged;
}

/* ============== Dashboard: สตรีค + ปฏิทินความเข้มข้น (Heatmap) ============== */
function computeStreak(log){
  let streak = 0;
  const d = new Date();
  d.setHours(0,0,0,0);
  if(!log[dateKeyOf(d)]) d.setDate(d.getDate()-1); // วันนี้ยังไม่ทำ ไม่ตัดสตรีค เริ่มเช็คจากเมื่อวาน
  while(log[dateKeyOf(d)]){
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}
function computeBestStreak(log){
  const days = Object.keys(log).filter(k=>log[k] > 0).sort();
  if(days.length === 0) return 0;
  let best = 1, cur = 1;
  for(let i=1;i<days.length;i++){
    const prev = new Date(days[i-1] + 'T00:00:00');
    const now = new Date(days[i] + 'T00:00:00');
    const diff = Math.round((now - prev) / 86400000);
    cur = (diff === 1) ? cur+1 : 1;
    if(cur > best) best = cur;
  }
  return best;
}
function renderHeatmap(log){
  const grid = $('heatmapGrid');
  if(!grid) return;
  const totalDays = 91; // ประมาณ 3 เดือนย้อนหลัง
  const today = new Date();
  today.setHours(0,0,0,0);
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));
  start.setDate(start.getDate() - start.getDay()); // เลื่อนไปวันอาทิตย์ก่อนหน้า เพื่อให้ตารางเรียงเป็นสัปดาห์สวยงาม

  let maxV = 0;
  const cells = [];
  const cursor = new Date(start);
  while(cursor <= today){
    const key = dateKeyOf(cursor);
    const v = log[key] || 0;
    if(v > maxV) maxV = v;
    cells.push({date:new Date(cursor), key, v});
    cursor.setDate(cursor.getDate()+1);
  }
  function levelClass(v){
    if(v <= 0) return '';
    if(maxV <= 1) return 'l4';
    const ratio = v / maxV;
    if(ratio > .75) return 'l4';
    if(ratio > .5) return 'l3';
    if(ratio > .25) return 'l2';
    return 'l1';
  }
  grid.innerHTML = cells.map(c=>{
    const future = c.date > today;
    return `<div class="heat-cell ${levelClass(c.v)}" title="${c.key}: ${c.v} ข้อ"${future ? ' style="visibility:hidden;"' : ''}></div>`;
  }).join('');
}
function renderStreak(){
  const log = loadActivityLog();
  const streak = computeStreak(log);
  const best = computeBestStreak(log);
  if($('streakNum')) $('streakNum').textContent = streak;
  if($('streakBestLabel')) $('streakBestLabel').textContent = `สถิติสูงสุด ${best} วัน`;
  renderHeatmap(log);
}

/* ============== Dashboard: จุดที่ควรพัฒนา (Weak Points) ============== */
let currentWeakTrack = 'อำนวยการ';
function renderWeakPoints(){
  const list = $('weakPointsList');
  if(!list) return;
  const stats = loadCatStats();
  const trackStats = currentWeakTrack === 'all' ? mergeCatStats(stats) : (stats[currentWeakTrack] || {});
  const rows = Object.entries(trackStats)
    .map(([cat,s])=>({cat, total:s.total, pct: s.total ? Math.round(s.correct/s.total*100) : 0}))
    .filter(r => r.total >= 3) // ต้องมีข้อมูลพอสมควรถึงจะวิเคราะห์ได้แม่นๆ
    .sort((a,b)=> a.pct - b.pct)
    .slice(0,3);
  if(rows.length === 0){
    list.innerHTML = '<div class="dashempty">ยังไม่มีข้อมูลพอ — ลองทำข้อสอบเพิ่มอีกนิดนะ (อย่างน้อย 3 ข้อต่อหมวด)</div>';
    return;
  }
  list.innerHTML = rows.map(r=>`
    <div class="weakitem">
      <div class="weakinfo">
        <div class="weakcat">${r.cat}</div>
        <div class="weakpct">แม่นยำ ${r.pct}% (${r.total} ข้อ)</div>
      </div>
      <button class="weakbtn" data-weakcat="${r.cat}">ฝึกหมวดนี้เพิ่ม</button>
    </div>
  `).join('');
  list.querySelectorAll('[data-weakcat]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const cat = btn.dataset.weakcat;
      const track = (currentWeakTrack === 'all') ? 'อำนวยการ' : currentWeakTrack;
      openExamScreen(track, [cat]);
    });
  });
}
if($('weakTabs')){
  $('weakTabs').querySelectorAll('.weaktab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      currentWeakTrack = btn.dataset.track;
      $('weakTabs').querySelectorAll('.weaktab').forEach(b=> b.classList.toggle('active', b===btn));
      renderWeakPoints();
    });
  });
}

/* ============== โจทย์ประจำวัน (Daily Challenge) ==============
   สุ่มโจทย์คณิต/ตรรกะ 10 ข้อ ครั้งแรกที่เข้าแอปในแต่ละวัน ชุดเดิมคงอยู่ตลอดวันนั้น
   ทำในโมดัลแยกจากหน้าคลังข้อสอบหลัก ไม่ปนกับสถิติ catStats ของคลังข้อสอบ */
const DAILY_KEY = 'dailyChallenge';
let dailyAnswers = {};
function loadDailyChallengeRaw(){
  try{ return JSON.parse(localStorage.getItem(DAILY_KEY)) || null; }catch(e){ return null; }
}
function saveDailyChallengeRaw(obj){ localStorage.setItem(DAILY_KEY, JSON.stringify(obj)); }
function getOrCreateDailyChallenge(){
  const key = todayKey();
  let dc = loadDailyChallengeRaw();
  if(!dc || dc.date !== key){
    dc = { date:key, questions: generateUniqueMathQuestions(10, []), answers:{}, done:false };
    saveDailyChallengeRaw(dc);
  }
  return dc;
}
function updateDailyBanner(){
  const title = $('dailyBannerTitle');
  const sub = $('dailyBannerSub');
  if(!title || !sub) return;
  const dc = getOrCreateDailyChallenge();
  const answered = Object.keys(dc.answers).length;
  if(dc.done){
    const correct = Object.entries(dc.answers).filter(([qi,ci])=> dc.questions[qi].correct === ci).length;
    title.textContent = '✅ ทำโจทย์ประจำวันแล้ว';
    sub.textContent = `วันนี้ได้ ${correct}/${dc.questions.length} ข้อ — พรุ่งนี้มีชุดใหม่`;
  } else if(answered > 0){
    title.textContent = '🔥 โจทย์ประจำวัน — ทำต่อ';
    sub.textContent = `ทำไปแล้ว ${answered}/${dc.questions.length} ข้อ`;
  } else {
    title.textContent = 'โจทย์ประจำวันนี้';
    sub.textContent = `${dc.questions.length} ข้อ คณิต/ตรรกะ — แตะเพื่อเริ่มทำ`;
  }
}
function renderDailyChallenge(){
  const dc = getOrCreateDailyChallenge();
  dailyAnswers = Object.assign({}, dc.answers);
  const qs = dc.questions;
  const answeredCount = Object.keys(dailyAnswers).length;
  $('dailyProgress').textContent = `ตอบไปแล้ว ${answeredCount}/${qs.length} ข้อ`;
  if(answeredCount >= qs.length){
    const correct = Object.entries(dailyAnswers).filter(([qi,ci])=> qs[qi].correct === ci).length;
    $('dailyList').style.display = 'none';
    $('dailyDoneBox').style.display = 'block';
    $('ddScoreText').textContent = `${correct}/${qs.length} ข้อถูก`;
    return;
  }
  $('dailyList').style.display = 'block';
  $('dailyDoneBox').style.display = 'none';
  $('dailyList').innerHTML = qs.map((q,i)=>`
    <div class="examq">
      <div class="eqhead"><span class="eqnum">ข้อที่ ${i+1}</span></div>
      <div class="eqtext">${q.q}</div>
      ${q.choices.map((c,ci)=>`<button class="echoice" data-dqi="${i}" data-dci="${ci}"><span class="etext">${c}</span><span class="eicon ic-correct">✓</span><span class="eicon ic-wrong">✗</span></button>`).join('')}
      <div class="eexplain" data-deexplain="${i}">${q.explain}</div>
    </div>
  `).join('');
  document.querySelectorAll('#dailyList .echoice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const qi = parseInt(btn.dataset.dqi);
      const ci = parseInt(btn.dataset.dci);
      if(dailyAnswers[qi] !== undefined) return;
      dailyAnswers[qi] = ci;
      const q = qs[qi];
      logActivity(1);
      document.querySelectorAll(`#dailyList .echoice[data-dqi="${qi}"]`).forEach(b=>{
        const bci = parseInt(b.dataset.dci);
        if(bci === q.correct) b.classList.add('correct');
        else if(bci === ci) b.classList.add('wrong');
      });
      const exp = document.querySelector(`[data-deexplain="${qi}"]`);
      if(exp) exp.classList.add('show');
      const dc2 = loadDailyChallengeRaw() || dc;
      dc2.answers = dailyAnswers;
      if(Object.keys(dailyAnswers).length >= qs.length) dc2.done = true;
      saveDailyChallengeRaw(dc2);
      updateDailyBanner();
      $('dailyProgress').textContent = `ตอบไปแล้ว ${Object.keys(dailyAnswers).length}/${qs.length} ข้อ`;
      if(Object.keys(dailyAnswers).length >= qs.length){
        setTimeout(()=> renderDailyChallenge(), 700);
      }
    });
  });
}
function openDailyChallenge(){
  renderDailyChallenge();
  $('dailyOverlay').classList.add('show');
}
function closeDailyChallenge(){
  $('dailyOverlay').classList.remove('show');
}
if($('dailyClose')) $('dailyClose').addEventListener('click', closeDailyChallenge);
if($('dailyOverlay')) $('dailyOverlay').addEventListener('click', (e)=>{ if(e.target.id==='dailyOverlay') closeDailyChallenge(); });
updateDailyBanner();

/* ============== เกมจับคู่คำศัพท์ EN-TH (Vocab Matching Game) ==============
   สุ่ม 8 คู่จาก VOCAB_BANK ต่อรอบ จับเวลานับขึ้น เก็บสถิติเวลาที่ดีที่สุดไว้ใน localStorage */
let vocabPairs = [];
let vocabCards = [];
let vocabSelected = [];
let vocabMatchedCount = 0;
let vocabStartTime = 0;
let vocabTimerInterval = null;
let vocabTimerSeconds = 0;
const VOCAB_BEST_KEY = 'vocabBestTimeSec';

function formatVocabTime(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}
function loadVocabBest(){
  const v = parseInt(localStorage.getItem(VOCAB_BEST_KEY), 10);
  return isNaN(v) ? null : v;
}
function saveVocabBestIfBetter(sec){
  const cur = loadVocabBest();
  if(cur === null || sec < cur){ localStorage.setItem(VOCAB_BEST_KEY, String(sec)); return true; }
  return false;
}
function renderVocabBest(){
  const best = loadVocabBest();
  if($('vocabBest')) $('vocabBest').textContent = best === null ? '--:--' : formatVocabTime(best);
}
function stopVocabTimer(){
  if(vocabTimerInterval){ clearInterval(vocabTimerInterval); vocabTimerInterval = null; }
}
function startVocabTimer(){
  stopVocabTimer();
  vocabStartTime = Date.now();
  vocabTimerSeconds = 0;
  if($('vocabTimer')) $('vocabTimer').textContent = '00:00';
  vocabTimerInterval = setInterval(()=>{
    vocabTimerSeconds = Math.floor((Date.now() - vocabStartTime) / 1000);
    if($('vocabTimer')) $('vocabTimer').textContent = formatVocabTime(vocabTimerSeconds);
  }, 250);
}
function newVocabRound(){
  const pool = shuffleArray(VOCAB_BANK).slice(0,8);
  vocabPairs = pool;
  vocabMatchedCount = 0;
  vocabSelected = [];
  if($('vocabMatched')) $('vocabMatched').textContent = '0/' + pool.length;
  const cards = [];
  pool.forEach((p,i)=>{
    cards.push({key:'en'+i, text:p.en, type:'en', pairId:i, matched:false});
    cards.push({key:'th'+i, text:p.th, type:'th', pairId:i, matched:false});
  });
  vocabCards = shuffleArray(cards);
  renderVocabGrid();
  startVocabTimer();
}
function renderVocabGrid(){
  const grid = $('vocabGrid');
  if(!grid) return;
  grid.innerHTML = vocabCards.map(c=>`<div class="vocab-card${c.matched?' matched':''}" data-vkey="${c.key}">${c.text}</div>`).join('');
  grid.querySelectorAll('.vocab-card').forEach(el=>{
    el.addEventListener('click', ()=> handleVocabCardClick(el.dataset.vkey));
  });
}
function handleVocabCardClick(key){
  const card = vocabCards.find(c=>c.key===key);
  if(!card || card.matched) return;
  if(vocabSelected.includes(key)) return;
  if(vocabSelected.length >= 2) return;
  vocabSelected.push(key);
  const el = document.querySelector(`.vocab-card[data-vkey="${key}"]`);
  if(el) el.classList.add('selected');
  if(vocabSelected.length === 2){
    const [k1,k2] = vocabSelected;
    const c1 = vocabCards.find(c=>c.key===k1);
    const c2 = vocabCards.find(c=>c.key===k2);
    if(c1.pairId === c2.pairId && c1.type !== c2.type){
      c1.matched = true; c2.matched = true;
      vocabMatchedCount++;
      if($('vocabMatched')) $('vocabMatched').textContent = vocabMatchedCount + '/' + vocabPairs.length;
      setTimeout(()=>{
        vocabSelected = [];
        renderVocabGrid();
        if(vocabMatchedCount >= vocabPairs.length) finishVocabRound();
      }, 250);
    } else {
      const el1 = document.querySelector(`.vocab-card[data-vkey="${k1}"]`);
      const el2 = document.querySelector(`.vocab-card[data-vkey="${k2}"]`);
      if(el1) el1.classList.add('wrong');
      if(el2) el2.classList.add('wrong');
      setTimeout(()=>{
        vocabSelected = [];
        renderVocabGrid();
      }, 550);
    }
  }
}
function finishVocabRound(){
  stopVocabTimer();
  const isBest = saveVocabBestIfBetter(vocabTimerSeconds);
  showToast(isBest ? `จับคู่ครบแล้ว! สถิติใหม่ ${formatVocabTime(vocabTimerSeconds)} 🏆` : `จับคู่ครบแล้ว! ใช้เวลา ${formatVocabTime(vocabTimerSeconds)} 🎉`);
  renderVocabBest();
}
function openVocabGame(){
  renderVocabBest();
  newVocabRound();
  showScreen('vocabScreen');
}
if($('vocabBackBtn')){
  $('vocabBackBtn').addEventListener('click', ()=>{
    stopVocabTimer();
    goRoadmapTab();
  });
}
if($('vocabShuffleBtn')) $('vocabShuffleBtn').addEventListener('click', ()=> newVocabRound());

/* ============== ร้านค้า / คลังไฟล์เอกสาร ==============
   รายการไฟล์ (STORE_ITEMS) อยู่ในไฟล์ store-data.js แยกต่างหากแล้ว
   เพิ่ม/แก้ไฟล์เอกสารได้ที่นั่นโดยไม่ต้องยุ่งกับไฟล์นี้เลย — รองรับไฟล์เยอะๆ และเพิ่มเรื่อยๆ ได้สบาย */
let storeActiveCat = 'ทั้งหมด';
function storeCategories(){
  const set = new Set(['ทั้งหมด']);
  STORE_ITEMS.forEach(it=> set.add(it.category || 'ทั่วไป'));
  return [...set];
}
function renderStoreCatTabs(){
  const wrap = $('storeCatTabs');
  if(!wrap) return;
  const cats = storeCategories();
  if(cats.length <= 2){ wrap.innerHTML=''; wrap.style.display='none'; return; } // ไม่ต้องโชว์แท็บถ้ามีหมวดเดียว
  wrap.style.display='';
  wrap.innerHTML = cats.map(c=>
    `<button type="button" class="store-cattab${c===storeActiveCat?' active':''}" onclick="storeSelectCat('${c.replace(/'/g,"\\'")}')">${c}</button>`
  ).join('');
}
function storeSelectCat(cat){
  storeActiveCat = cat;
  renderStoreCatTabs();
  renderStoreList();
}
function renderStoreList(){
  const list = $('storeList');
  if(!list) return;
  if(!STORE_ITEMS.length){ list.innerHTML = '<div class="dashempty">ยังไม่มีเอกสารในขณะนี้</div>'; return; }
  const q = ($('storeSearch') && $('storeSearch').value || '').trim().toLowerCase();
  let items = STORE_ITEMS.map((it,ii)=>({...it, _idx:ii, category: it.category || 'ทั่วไป'}));
  if(storeActiveCat !== 'ทั้งหมด') items = items.filter(it=> it.category === storeActiveCat);
  if(q) items = items.filter(it=>
    it.title.toLowerCase().includes(q) || it.files.some(f=> (f.label||'').toLowerCase().includes(q))
  );
  if(!items.length){ list.innerHTML = '<div class="dashempty">ไม่พบเอกสารที่ค้นหา</div>'; return; }

  const extColor = {PDF:'#C6482A', DOC:'#2E76B5', XLS:'#3F8F5F'};
  const cardHtml = (item)=>`
    <div class="store-card">
      <div class="store-top">
        <div class="store-thumb">${item.icon||'📄'}</div>
        <div class="store-info">
          <span class="store-badge${item.badge && item.badge!=='ฟรี!' ? ' paid':''}">${item.badge||'ฟรี!'}</span>
          <div class="store-title">${item.title}</div>
        </div>
      </div>
      <div class="store-files">
        ${item.files.map((f,fi)=>`<button type="button" class="store-file" onclick="openPdfViewer(${item._idx},${fi})">
          <span class="sf-ic" style="background:${extColor[f.ext]||'#767D84'}">${f.ext}</span>
          <span class="sf-name">${f.label}</span>
          <span class="sf-view">เปิดดู ›</span>
        </button>`).join('')}
      </div>
    </div>`;

  // โหมด "ทั้งหมด" + ไม่ได้ค้นหา → จัดกลุ่มตามหมวดให้ดูง่ายเวลามีไฟล์เยอะ
  if(storeActiveCat === 'ทั้งหมด' && !q){
    const groups = {};
    items.forEach(it=>{ (groups[it.category] = groups[it.category]||[]).push(it); });
    list.innerHTML = Object.keys(groups).map(cat=>
      `<div class="store-grouphead">${cat}</div>${groups[cat].map(cardHtml).join('')}`
    ).join('');
  } else {
    list.innerHTML = items.map(cardHtml).join('');
  }
}
function openStoreScreen(){
  storeActiveCat = 'ทั้งหมด';
  if($('storeSearch')) $('storeSearch').value = '';
  renderStoreCatTabs();
  renderStoreList();
  showScreen('storescreen');
}
if($('storeBackBtn')) $('storeBackBtn').addEventListener('click', goRoadmapTab);
if($('storeSearch')) $('storeSearch').addEventListener('input', renderStoreList);

/* ============== ตัวดูไฟล์ในแอป (เปิด PDF โดยไม่ออกจากแอป) ==============
   หมายเหตุสำคัญ: เว็บแอป/PWA ไม่มีสิทธิ์เข้าถึงระบบเพียงพอจะ "บล็อกการแคปหน้าจอ" ได้จริง
   แบบแอปธรรมชาติ (เช่น FLAG_SECURE บน Android) — ที่ทำได้คือกันเบื้องต้น: ปิดลากเลือก/คัดลอก,
   ปิดเมนูคลิกขวา/กดค้าง, ใส่ลายน้ำทับเนื้อหา และซ่อนปุ่มดาวน์โหลดถ้าตั้งไว้ว่าไม่ให้โหลด
   คนที่ตั้งใจแคปหน้าจอจริงๆ ยังแคปได้อยู่ ทำได้แค่ลดความสะดวกและทิ้งร่องรอยลายน้ำไว้ */
let pdfGuardActive = false;
function buildPdfWatermark(text){
  const wm = $('pdfWatermark');
  if(!wm) return;
  wm.innerHTML = '';
  for(let i=0;i<24;i++){ const s=document.createElement('span'); s.textContent=text; wm.appendChild(s); }
}
function openPdfViewer(itemIndex, fileIndex){
  const item = STORE_ITEMS[itemIndex];
  const file = item && item.files[fileIndex];
  if(!file) return;
  if(file.href === '#'){ showToast('ยังไม่ได้แนบไฟล์นี้ — ใส่ path ที่ STORE_ITEMS ใน store-data.js'); return; }
  $('pdfTitle').textContent = `${item.title} · ${file.label}`;
  $('pdfFrame').src = file.href;
  const dlBtn = $('pdfDlBtn');
  if(file.downloadable){
    dlBtn.style.display = '';
    dlBtn.href = file.href;
    dlBtn.setAttribute('download', file.label || '');
  } else {
    dlBtn.style.display = 'none';
    dlBtn.removeAttribute('href');
  }
  buildPdfWatermark('ห้ามแจกจ่าย · ' + (item.title||''));
  $('pdfOverlay').classList.add('show');
  pdfGuardActive = true;
  document.body.style.overflow = 'hidden';
}
function closePdfViewer(){
  $('pdfOverlay').classList.remove('show');
  $('pdfFrame').src = '';
  pdfGuardActive = false;
  $('pdfBlurguard').classList.remove('show');
  document.body.style.overflow = '';
}
if($('pdfCloseBtn')) $('pdfCloseBtn').addEventListener('click', closePdfViewer);
if($('pdfBody')) $('pdfBody').addEventListener('contextmenu', e=> e.preventDefault());
if($('storeList')) $('storeList').addEventListener('contextmenu', e=> e.preventDefault());
// กันเบื้องต้นตอนสลับแอป/มินิไมซ์ขณะเปิดไฟล์อยู่ (ไม่ใช่การจับภาพหน้าจอโดยตรง แต่ลดโอกาสเห็นเนื้อหาตอนสลับหน้าจอ/บันทึกหน้าจอ)
document.addEventListener('visibilitychange', ()=>{
  if(!pdfGuardActive) return;
  $('pdfBlurguard').classList.toggle('show', document.hidden);
});

/* ============== ฝึกพละ: เช็คลิสต์ผ่าน/ไม่ผ่านรายท่า ==============
   ใช้เกณฑ์ชุดเดียวกับตารางเกณฑ์คะแนนด้านบน (ผ่าน/ดี/ดีมาก) ผู้ใช้กรอกผลที่ทำได้ล่าสุด
   ระบบจะบอกว่าอยู่ระดับไหน และคำนวณ % ความพร้อมโดยรวม (ผ่านเกณฑ์กี่ท่าจากทั้งหมด) */
const FIT_TESTS = [
  {id:'run1000', name:'วิ่ง 1,000 เมตร', unit:'วินาที', hint:'กรอกเวลาที่ทำได้ (วินาที) เช่น 4:30 = 270', better:'lower', tiers:{pass:270, good:240, great:210}, fmt:'time'},
  {id:'pushup', name:'ดันพื้น (1 นาที)', unit:'ครั้ง', hint:'จำนวนครั้งที่ทำได้ใน 1 นาที', better:'higher', tiers:{pass:22, good:32, great:42}, fmt:'num'},
  {id:'situp', name:'ลุกนั่ง (1 นาที)', unit:'ครั้ง', hint:'จำนวนครั้งที่ทำได้ใน 1 นาที', better:'higher', tiers:{pass:25, good:35, great:45}, fmt:'num'}
];
const FIT_RESULT_KEY = 'fitnessTestResults';
function loadFitResults(){ try{ return JSON.parse(localStorage.getItem(FIT_RESULT_KEY)) || {}; }catch(e){ return {}; } }
function saveFitResults(r){ localStorage.setItem(FIT_RESULT_KEY, JSON.stringify(r)); }
function fitTier(test, value){
  const t = test.tiers;
  if(test.better === 'lower'){
    if(value <= t.great) return 'great';
    if(value <= t.good) return 'good';
    if(value <= t.pass) return 'pass';
    return 'fail';
  } else {
    if(value >= t.great) return 'great';
    if(value >= t.good) return 'good';
    if(value >= t.pass) return 'pass';
    return 'fail';
  }
}
function fitTierLabel(tier){
  return {pass:'ผ่านเกณฑ์', good:'ระดับดี', great:'ระดับดีมาก', fail:'ยังไม่ผ่าน'}[tier] || 'ยังไม่ทดสอบ';
}
function formatFitTime(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}
function renderFitReadyRing(results){
  const passed = FIT_TESTS.filter(t=>{
    const r = results[t.id];
    return r && r.tier !== 'fail';
  }).length;
  const total = FIT_TESTS.length;
  const pct = total ? Math.round(passed/total*100) : 0;
  return `<div class="fitreadywrap">
    <div class="fitring" style="--fitpct:${pct}"><span>${passed}/${total}<small>ผ่านเกณฑ์</small></span></div>
    <div class="fitreadytext">ความพร้อม <b>${pct}%</b> — กรอกผลการทดสอบล่าสุดของแต่ละท่าด้านล่าง ระบบจะบอกว่าอยู่ระดับผ่าน/ดี/ดีมาก ตามเกณฑ์ในตารางด้านบน</div>
  </div>`;
}
function renderFitChecklist(){
  const wrap = $('fitScheduleList');
  if(!wrap) return;
  const results = loadFitResults();
  let html = renderFitReadyRing(results);
  html += FIT_TESTS.map(t=>{
    const r = results[t.id];
    const statusClass = r ? r.tier : '';
    const statusText = r ? `${fitTierLabel(r.tier)} · ${t.fmt==='time' ? formatFitTime(r.value) : r.value+' '+t.unit}` : 'ยังไม่ทดสอบ';
    return `<div class="fittest" data-fit-id="${t.id}">
      <div class="fthead">
        <div><div class="ftname">${t.name}</div><div class="ftcriteria">${t.hint}</div></div>
        <div class="ftstatus ${statusClass}">${statusText}</div>
      </div>
      <div class="ftrow">
        <input type="number" min="0" placeholder="${t.fmt==='time' ? 'วินาที เช่น 270' : 'จำนวนครั้ง'}" class="fitInput" data-fit-input="${t.id}" value="${r ? r.value : ''}">
        <button data-fit-save="${t.id}">บันทึกผล</button>
      </div>
    </div>`;
  }).join('');
  wrap.innerHTML = html;
  wrap.querySelectorAll('[data-fit-save]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.fitSave;
      const test = FIT_TESTS.find(t=>t.id===id);
      const input = wrap.querySelector(`[data-fit-input="${id}"]`);
      const val = parseFloat(input.value);
      if(isNaN(val) || val < 0){ showToast('กรุณากรอกตัวเลขให้ถูกต้อง'); return; }
      const results2 = loadFitResults();
      results2[id] = { value: val, tier: fitTier(test, val), date: new Date().toISOString() };
      saveFitResults(results2);
      logActivity(1);
      renderFitChecklist();
      showToast('บันทึกผลการทดสอบแล้ว 💪');
    });
  });
}

/* ============== แถบเมนูล่าง + ป้ายนับถอยหลังวันสอบแบบค้างทุกหน้า ============== */
function renderExamDatePill(){
  const pill = $('examDatePill');
  if(!pill) return;
  const savedDate = localStorage.getItem(EXAM_DATE_KEY);
  pill.classList.remove('urgent','set');
  if(!savedDate){ pill.textContent = 'ยังไม่กำหนดวันสอบ'; return; }
  const target = new Date(savedDate + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diffDays = Math.round((target - today) / 86400000);
  if(diffDays > 0){
    pill.textContent = `อีก ${diffDays} วันสอบ`;
    pill.classList.add(diffDays <= 14 ? 'urgent' : 'set');
  } else if(diffDays === 0){
    pill.textContent = 'วันนี้คือวันสอบ!';
    pill.classList.add('urgent');
  } else {
    pill.textContent = 'วันสอบผ่านไปแล้ว';
  }
}

/* ============== คู่มือติดตั้งแอปลงหน้าจอโฮม ============== */
if($('openInstallGuideBtn')) $('openInstallGuideBtn').addEventListener('click', ()=> $('installOverlay').classList.add('show'));
if($('installCloseBtn')) $('installCloseBtn').addEventListener('click', ()=> $('installOverlay').classList.remove('show'));
if($('installOverlay')) $('installOverlay').addEventListener('click', (e)=>{ if(e.target.id==='installOverlay') $('installOverlay').classList.remove('show'); });
document.querySelectorAll('.install-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.install-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    $('stepsIos').classList.toggle('show', tab.dataset.plat==='ios');
    $('stepsAndroid').classList.toggle('show', tab.dataset.plat==='android');
  });
});

/* ============== ลงทะเบียน Service Worker (ใช้งานออฟไลน์ได้หลังโหลดครั้งแรก) ============== */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{ /* เงียบไว้ถ้าลงทะเบียนไม่สำเร็จ ไม่กระทบการใช้งานปกติ */ });
  });
}

renderExamDatePill();
renderRoadmap();

