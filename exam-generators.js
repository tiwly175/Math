// exam-generators.js — ตัวสร้างโจทย์คณิตศาสตร์/เชิงเหตุผลแบบสุ่ม (ไม่ซ้ำแทบไม่จำกัด)
// หลักการ: สุ่มตัวเลข/เงื่อนไขใหม่ทุกครั้งที่เรียก แล้วให้โค้ดคำนวณเฉลยเอง (ไม่มีเฉลยผิดจากคนพิมพ์)

const MATH_CAT = 'คณิตศาสตร์ & ตรรกะ';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// สร้างตัวเลือก 4 ข้อจากค่าที่ถูกต้อง + ค่าที่ผิดที่ให้มา แล้วสลับตำแหน่ง
function makeChoices(correctVal, wrongVals, formatFn) {
  formatFn = formatFn || (v => String(v));
  let vals = [correctVal, ...wrongVals].filter((v, i, a) => a.indexOf(v) === i);
  let guard = 0;
  while (vals.length < 4 && guard < 20) {
    guard++;
    const delta = Math.max(1, Math.round(Math.abs(correctVal) * 0.07)) * (vals.length + 1);
    const cand = correctVal + (guard % 2 === 0 ? delta : -delta);
    if (!vals.includes(cand)) vals.push(cand);
  }
  vals = vals.slice(0, 4);
  // Fisher-Yates shuffle
  for (let i = vals.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [vals[i], vals[j]] = [vals[j], vals[i]];
  }
  const correct = vals.indexOf(correctVal);
  return { choices: vals.map(formatFn), correct };
}

const fmtNum = v => v.toLocaleString('th-TH');

// ---------- 1. หารเท่าๆ กัน ----------
function gen_divide() {
  const y = randInt(3, 12);
  const q = randInt(10, 80);
  const x = y * q;
  const { choices, correct } = makeChoices(q, [q + y, q - y > 0 ? q - y : q + 2 * y, q + Math.ceil(y / 2)],
    v => `${fmtNum(v)} แผ่น`);
  return {
    q: `เอกสารกอง ${fmtNum(x)} แผ่น แบ่งให้เจ้าหน้าที่ ${y} คนเท่าๆ กัน คนละกี่แผ่น`,
    choices, correct,
    explain: `${fmtNum(x)} ÷ ${y} = ${q} แผ่นต่อคน`
  };
}

// ---------- 2. เปอร์เซ็นต์เงินเดือนขึ้น ----------
function gen_percent_increase() {
  const base = randInt(100, 300) * 100; // multiple of 100
  const p = pick([2, 4, 5, 8, 10, 12, 15, 20]);
  const inc = base * p / 100;
  const newVal = base + inc;
  const { choices, correct } = makeChoices(newVal, [base - inc, base + inc * 2, base + inc / 2],
    v => `${fmtNum(Math.round(v))} บาท`);
  return {
    q: `เงินเดือน ${fmtNum(base)} บาท ได้ปรับขึ้น ${p}% เงินเดือนใหม่เท่าไร`,
    choices, correct,
    explain: `${fmtNum(base)}×${(1 + p / 100).toFixed(2)} = ${fmtNum(newVal)} บาท (เพิ่มขึ้น ${fmtNum(base)}×${p / 100}=${fmtNum(inc)})`
  };
}

// ---------- 3. สัดส่วนอย่างต่ำ ----------
function gen_ratio() {
  const g = randInt(2, 7);
  let a, b;
  do { a = randInt(2, 9); b = randInt(2, 9); } while (a === b || gcd(a, b) !== 1);
  const x = g * a, y = g * b;
  const correctStr = `${a} : ${b}`;
  const wrongs = [`${b} : ${a}`, `${a + 1} : ${b}`, `${a} : ${b + 1}`];
  let vals = [correctStr, ...wrongs].filter((v, i, arr) => arr.indexOf(v) === i);
  while (vals.length < 4) vals.push(`${a + vals.length} : ${b}`);
  vals = vals.slice(0, 4);
  for (let i = vals.length - 1; i > 0; i--) { const j = randInt(0, i);[vals[i], vals[j]] = [vals[j], vals[i]]; }
  const correct = vals.indexOf(correctStr);
  return {
    q: `ชุดปฏิบัติงาน A มีเจ้าหน้าที่ ${x} คน ชุด B มี ${y} คน สัดส่วน A ต่อ B แบบอย่างต่ำคือเท่าไร`,
    choices: vals, correct,
    explain: `ห.ร.ม. ของ ${x} กับ ${y} คือ ${g} → ${x}÷${g} : ${y}÷${g} = ${a}:${b}`
  };
}

// ---------- 4. ค่าเฉลี่ย ----------
function gen_average(depth) {
  depth = depth || 0;
  const avg = randInt(20, 90);
  const d1 = randInt(-15, 15), d2 = randInt(-15, 15);
  const a = avg + d1, b = avg + d2, c = 3 * avg - a - b;
  // กัน stack overflow: ถ้าสุ่มไม่ผ่านเงื่อนไขติดกันหลายครั้ง ให้บังคับใช้ค่าที่การันตีว่า c>=1 แทนการเรียกซ้ำไม่จำกัด
  if (c < 1) {
    if (depth < 20) return gen_average(depth + 1);
    const a2 = avg, b2 = avg, c2 = avg; // fallback ปลอดภัย: ทั้งสามเดือนเท่ากับค่าเฉลี่ยพอดี
    const { choices, correct } = makeChoices(avg, [avg + 5, avg - 5, avg + 3],
      v => `${fmtNum(v)} เรื่อง`);
    return {
      q: `สถิติรับเรื่องร้องเรียน เดือนที่ 1 มี ${a2} เรื่อง เดือนที่ 2 มี ${b2} เรื่อง เดือนที่ 3 มี ${c2} เรื่อง เฉลี่ยเดือนละกี่เรื่อง`,
      choices, correct,
      explain: `(${a2}+${b2}+${c2})÷3 = ${a2 + b2 + c2}÷3 = ${avg} เรื่อง`
    };
  }
  const { choices, correct } = makeChoices(avg, [avg + 5, avg - 5, Math.round((a + b) / 2)],
    v => `${fmtNum(v)} เรื่อง`);
  return {
    q: `สถิติรับเรื่องร้องเรียน เดือนที่ 1 มี ${a} เรื่อง เดือนที่ 2 มี ${b} เรื่อง เดือนที่ 3 มี ${c} เรื่อง เฉลี่ยเดือนละกี่เรื่อง`,
    choices, correct,
    explain: `(${a}+${b}+${c})÷3 = ${a + b + c}÷3 = ${avg} เรื่อง`
  };
}

// ---------- 5. ลำดับเรขาคณิต ----------
function gen_geometric_seq() {
  const r = pick([2, 3]);
  const a1 = randInt(2, 9);
  const terms = [a1, a1 * r, a1 * r * r, a1 * r * r * r];
  const next = a1 * Math.pow(r, 4);
  const { choices, correct } = makeChoices(next, [next + terms[3], next - terms[2], terms[3] * (r - 1)], fmtNum);
  return {
    q: `ลำดับจำนวนเอกสารที่เพิ่มขึ้นแต่ละสัปดาห์ ${terms.join(', ')}, ... สัปดาห์ถัดไปจะมีกี่ฉบับ`,
    choices, correct,
    explain: `ลำดับเรขาคณิต คูณ ${r} ทุกครั้ง (r=${r}) → ${terms[3]}×${r} = ${next}`
  };
}

// ---------- 6. ลำดับเลขคณิต ----------
function gen_arithmetic_seq() {
  const d = randInt(2, 9);
  const a1 = randInt(1, 20);
  const terms = [a1, a1 + d, a1 + 2 * d, a1 + 3 * d];
  const next = a1 + 4 * d;
  const { choices, correct } = makeChoices(next, [next + d, next - d, next + 2 * d], fmtNum);
  return {
    q: `ลำดับจำนวนคดีที่รับแจ้งแต่ละวัน ${terms.join(', ')}, ... วันถัดไปจะมีกี่คดี`,
    choices, correct,
    explain: `ลำดับเลขคณิต บวกเพิ่มทีละ ${d} ทุกครั้ง → ${terms[3]}+${d} = ${next}`
  };
}

// ---------- 7. ตรรกะเชิงเหตุผล (modus ponens / tollens) ----------
const LOGIC_SUBJECTS = [
  ['พนักงานทุกคน', 'ต้องผ่านการอบรม', 'สมชาย', 'เป็นพนักงาน'],
  ['เจ้าหน้าที่ทุกนายที่เข้าเวรกลางคืน', 'ต้องสวมเสื้อกั๊กสะท้อนแสง', 'ดาบตำรวจสมหญิง', 'เข้าเวรกลางคืน'],
  ['ผู้ต้องสงสัยทุกคนที่ถูกจับกุม', 'ต้องได้รับแจ้งสิทธิ', 'นายเอ', 'ถูกจับกุม'],
  ['รถสายตรวจทุกคันที่ออกปฏิบัติการ', 'ต้องมีวิทยุสื่อสาร', 'รถสายตรวจคันที่ 12', 'ออกปฏิบัติการ'],
  ['เอกสารราชการทุกฉบับ', 'ต้องมีเลขที่หนังสือกำกับ', 'บันทึกข้อความฉบับนี้', 'เป็นเอกสารราชการ']
];
function gen_logic() {
  const [ruleSubj, rulePred, caseSubj, caseFact] = pick(LOGIC_SUBJECTS);
  const conclusion = `${caseSubj}${rulePred}`;
  const wrongs = [`${caseSubj}ไม่ต้อง${rulePred.replace('ต้อง', '')}`, 'สรุปไม่ได้', `${caseSubj}อาจจะ${rulePred.replace('ต้อง', '')}หรือไม่ก็ได้`];
  let vals = [conclusion, ...wrongs];
  for (let i = vals.length - 1; i > 0; i--) { const j = randInt(0, i);[vals[i], vals[j]] = [vals[j], vals[i]]; }
  const correct = vals.indexOf(conclusion);
  return {
    q: `"${ruleSubj}${rulePred}" และ "${caseSubj}${caseFact}" สรุปได้ว่าอะไร`,
    choices: vals, correct,
    explain: `ใช้กฎ Modus Ponens: เงื่อนไข "${caseSubj}${caseFact}" เป็นจริง และกฎ "${ruleSubj}${rulePred}" เป็นจริง → สรุปว่า ${conclusion} ได้แน่นอน`
  };
}

// ---------- 8. ร้อยละของเสีย/ผิดพลาด ----------
function gen_percent_defect() {
  const total = randInt(2, 20) * 100; // multiple of 100
  const p = pick([1, 2, 3, 4, 5, 6, 8, 10]);
  const defect = total * p / 100;
  const { choices, correct } = makeChoices(defect, [defect * 2, defect / 2, total * (p + 1) / 100],
    v => `${fmtNum(v)} แผ่น`);
  return {
    q: `เอกสารราชการพิมพ์ผิด ${p}% จากทั้งหมด ${fmtNum(total)} แผ่น มีกี่แผ่นที่พิมพ์ผิด`,
    choices, correct,
    explain: `${fmtNum(total)}×${p}% = ${fmtNum(total)}×${p}/100 = ${fmtNum(defect)} แผ่น`
  };
}

// ---------- 9. ความเร็ว-ระยะทาง-เวลา ----------
function gen_speed_distance() {
  const speed = randInt(4, 12) * 10; // 40-120
  const time = randInt(1, 6);
  const dist = speed * time;
  const { choices, correct } = makeChoices(dist, [dist + speed, dist - speed > 0 ? dist - speed : dist + 2 * speed, speed + time],
    v => `${fmtNum(v)} กม.`);
  return {
    q: `รถสายตรวจวิ่งด้วยความเร็วคงที่ ${speed} กม./ชม. เป็นเวลา ${time} ชั่วโมง จะไปได้ระยะทางกี่กิโลเมตร`,
    choices, correct,
    explain: `ระยะทาง = ความเร็ว×เวลา = ${speed}×${time} = ${fmtNum(dist)} กม.`
  };
}

// ---------- 10. งาน-คน-เวลา ----------
function gen_work_rate() {
  const n = randInt(2, 6);
  const daysAlone = n * randInt(2, 8);
  const daysTogether = daysAlone / n;
  const { choices, correct } = makeChoices(daysTogether, [daysTogether + 1, daysTogether * 2, daysAlone - daysTogether],
    v => `${fmtNum(v)} วัน`);
  return {
    q: `งานชิ้นหนึ่ง เจ้าหน้าที่ 1 คน ทำคนเดียวเสร็จใน ${daysAlone} วัน ถ้ามีเจ้าหน้าที่ทำงานอัตราเท่ากัน ${n} คนช่วยกันทำ จะเสร็จใน กี่วัน`,
    choices, correct,
    explain: `${daysAlone}÷${n} = ${daysTogether} วัน`
  };
}

// ---------- 11. ห.ร.ม. / ค.ร.น. ----------
function gen_hcf_lcm() {
  const askLCM = Math.random() < 0.5;
  const g = randInt(2, 6);
  let a, b;
  do { a = randInt(2, 9); b = randInt(2, 9); } while (a === b || gcd(a, b) !== 1);
  const x = g * a, y = g * b;
  const hcf = g;
  const lcm = g * a * b;
  const answer = askLCM ? lcm : hcf;
  const { choices, correct } = makeChoices(answer, [answer + g, answer - g > 0 ? answer - g : answer + 2 * g, x * y], fmtNum);
  return {
    q: askLCM ? `ค.ร.น. ของ ${x} และ ${y} คือเท่าไร` : `ห.ร.ม. ของ ${x} และ ${y} คือเท่าไร`,
    choices, correct,
    explain: askLCM ? `${x} = ${g}×${a}, ${y} = ${g}×${b} → ค.ร.น. = ${g}×${a}×${b} = ${lcm}` : `${x} และ ${y} มีตัวประกอบร่วมมากที่สุดคือ ${g}`
  };
}

// ---------- 12. เวลาเข้าเวร ----------
function gen_shift_duration() {
  const startH = randInt(0, 20);
  const durH = randInt(2, 10);
  const endH = (startH + durH) % 24;
  const fmtT = h => `${String(h).padStart(2, '0')}:00 น.`;
  const { choices, correct } = makeChoices(durH, [durH + 1, durH - 1 > 0 ? durH - 1 : durH + 2, 24 - durH],
    v => `${v} ชั่วโมง`);
  return {
    q: `เจ้าหน้าที่เข้าเวรตั้งแต่เวลา ${fmtT(startH)} ถึง ${fmtT(endH)}${endH < startH ? ' (ของวันถัดไป)' : ''} รวมเข้าเวรกี่ชั่วโมง`,
    choices, correct,
    explain: `จาก ${fmtT(startH)} ถึง ${fmtT(endH)} รวม ${durH} ชั่วโมง`
  };
}

// ---------- 13. ส่วนลดราคา (ร้อยละลด) ----------
function gen_percent_decrease() {
  const base = randInt(200, 2000) * 10; // multiple of 10
  const p = pick([5, 10, 15, 20, 25, 30, 40]);
  const disc = base * p / 100;
  const after = base - disc;
  const { choices, correct } = makeChoices(after, [base + disc, after + disc / 2, after - disc / 2],
    v => `${fmtNum(Math.round(v))} บาท`);
  return {
    q: `อุปกรณ์ราคา ${fmtNum(base)} บาท ลดราคา ${p}% ต้องจ่ายเงินกี่บาท`,
    choices, correct,
    explain: `ส่วนลด = ${fmtNum(base)}×${p}% = ${fmtNum(disc)} บาท → ราคาที่ต้องจ่าย = ${fmtNum(base)}-${fmtNum(disc)} = ${fmtNum(after)} บาท`
  };
}

// ---------- 14. โจทย์อายุ ----------
function gen_age_problem() {
  const childAge = randInt(5, 15);
  const k = randInt(2, 4);
  const parentAge = childAge * k;
  const future = randInt(2, 10);
  const parentFuture = parentAge + future;
  const childFuture = childAge + future;
  const { choices, correct } = makeChoices(parentFuture, [parentFuture + future, childFuture * k, parentAge - future > 0 ? parentAge - future : parentAge + future * 2],
    v => `${fmtNum(v)} ปี`);
  return {
    q: `ปัจจุบันหัวหน้างานมีอายุเป็น ${k} เท่าของลูกน้องฝึกหัดที่อายุ ${childAge} ปี อีก ${future} ปีข้างหน้า หัวหน้างานจะอายุกี่ปี`,
    choices, correct,
    explain: `ปัจจุบันหัวหน้างานอายุ ${childAge}×${k} = ${parentAge} ปี → อีก ${future} ปี = ${parentAge}+${future} = ${parentFuture} ปี`
  };
}

// ---------- 15. กำไร/ขาดทุนร้อยละ ----------
function gen_profit_loss() {
  const cost = randInt(50, 500) * 10;
  const isProfit = Math.random() < 0.5;
  const p = pick([5, 10, 12, 15, 20, 25]);
  const diff = cost * p / 100;
  const sell = isProfit ? cost + diff : cost - diff;
  const { choices, correct } = makeChoices(p, [p + 5, p - 5 > 0 ? p - 5 : p + 10, Math.round(diff / cost * 1000) / 10 + (isProfit ? 5 : -5)],
    v => `${v}%`);
  return {
    q: `ซื้อของมาราคาทุน ${fmtNum(cost)} บาท นำไปขายที่ราคา ${fmtNum(sell)} บาท ${isProfit ? 'กำไร' : 'ขาดทุน'}คิดเป็นร้อยละเท่าไรของทุน`,
    choices, correct,
    explain: `${isProfit ? 'กำไร' : 'ขาดทุน'} = ${fmtNum(Math.abs(sell - cost))} บาท → (${fmtNum(Math.abs(sell - cost))}÷${fmtNum(cost)})×100 = ${p}%`
  };
}

// ---------- 16. พื้นที่/เส้นรอบรูปสี่เหลี่ยมผืนผ้า ----------
function gen_area_rect() {
  const w = randInt(4, 20);
  const l = randInt(w + 2, 40);
  const askArea = Math.random() < 0.5;
  const area = w * l;
  const perimeter = 2 * (w + l);
  const answer = askArea ? area : perimeter;
  const unitLabel = askArea ? 'ตร.ม.' : 'ม.';
  const { choices, correct } = makeChoices(answer, [answer + w, answer - w > 0 ? answer - w : answer + l, answer + l],
    v => `${fmtNum(v)} ${unitLabel}`);
  return {
    q: `ที่ดินรูปสี่เหลี่ยมผืนผ้า กว้าง ${w} เมตร ยาว ${l} เมตร มี${askArea ? 'พื้นที่' : 'ความยาวเส้นรอบรูป'}เท่าไร`,
    choices, correct,
    explain: askArea ? `พื้นที่ = กว้าง×ยาว = ${w}×${l} = ${area} ตร.ม.` : `เส้นรอบรูป = 2×(กว้าง+ยาว) = 2×(${w}+${l}) = ${perimeter} ม.`
  };
}

// ---------- 17. ลำดับกำลังสอง/รูปแบบพิเศษ ----------
function gen_series_squares() {
  const start = randInt(1, 6);
  const terms = [0, 1, 2, 3].map(i => (start + i) * (start + i));
  const next = (start + 4) * (start + 4);
  const { choices, correct } = makeChoices(next, [next + 2 * (start + 4) - 1, next - (start + 4), terms[3] + (terms[3] - terms[2])], fmtNum);
  return {
    q: `ลำดับต่อไปนี้เกิดจากรูปแบบใดรูปแบบหนึ่ง ${terms.join(', ')}, ... พจน์ถัดไปคือเท่าไร`,
    choices, correct,
    explain: `แต่ละพจน์คือ (${start}+n)² เมื่อ n=0,1,2,3,... → พจน์ถัดไป (${start + 4})² = ${next}`
  };
}

// ---------- 18. แปลงหน่วยเวลา/ระยะทาง ----------
function gen_unit_convert() {
  const kind = pick(['hm', 'ms', 'kmm']);
  let q, answer, unit, explain;
  if (kind === 'hm') {
    const h = randInt(1, 8), m = randInt(1, 59);
    answer = h * 60 + m; unit = 'นาที';
    q = `เวลา ${h} ชั่วโมง ${m} นาที คิดเป็นกี่นาที`;
    explain = `${h}×60+${m} = ${answer} นาที`;
  } else if (kind === 'ms') {
    const m = randInt(2, 20);
    answer = m * 60; unit = 'วินาที';
    q = `เวลา ${m} นาที คิดเป็นกี่วินาที`;
    explain = `${m}×60 = ${answer} วินาที`;
  } else {
    const km = randInt(1, 20), m2 = randInt(1, 999);
    answer = km * 1000 + m2; unit = 'เมตร';
    q = `ระยะทาง ${km} กิโลเมตร ${m2} เมตร คิดเป็นกี่เมตร`;
    explain = `${km}×1000+${m2} = ${answer} เมตร`;
  }
  const { choices, correct } = makeChoices(answer, [answer + 10, answer - 10 > 0 ? answer - 10 : answer + 20, Math.round(answer * 1.1)],
    v => `${fmtNum(v)} ${unit}`);
  return { q, choices, correct, explain };
}

// ---------- 19. จัดเวรยาม/สลับตำแหน่ง (การเรียงสับเปลี่ยนอย่างง่าย) ----------
function gen_permutation_simple() {
  const n = randInt(3, 6);
  function factorial(x) { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; }
  const answer = factorial(n);
  const { choices, correct } = makeChoices(answer, [answer / n, n * n, factorial(n - 1)], fmtNum);
  return {
    q: `มีเจ้าหน้าที่ ${n} คน ต้องจัดเข้าเวรเรียงลำดับกันทั้งหมด ${n} ผลัดโดยไม่ซ้ำคนในแต่ละผลัด มีวิธีจัดเรียงได้ทั้งหมดกี่แบบ`,
    choices, correct,
    explain: `จำนวนวิธีเรียงสับเปลี่ยนของ ${n} คน = ${n}! = ${Array.from({ length: n }, (_, i) => n - i).join('×')} = ${answer} แบบ`
  };
}

// ---------- 20. ความน่าจะเป็นอย่างง่าย (จับสลาก) ----------
function gen_probability_simple() {
  const total = randInt(6, 20);
  const target = randInt(1, total - 1);
  function g(a, b) { return b === 0 ? a : g(b, a % b); }
  const d = g(target, total);
  const num = target / d, den = total / d;
  const correctStr = `${num}/${den}`;
  const wrongs = [`${target}/${total}` === correctStr ? `${den}/${num}` : `${target}/${total}`, `${num + 1}/${den}`, `${num}/${den + 1}`];
  let vals = [correctStr, ...wrongs].filter((v, i, a) => a.indexOf(v) === i);
  while (vals.length < 4) vals.push(`${num}/${den + vals.length}`);
  vals = vals.slice(0, 4);
  for (let i = vals.length - 1; i > 0; i--) { const j = randInt(0, i);[vals[i], vals[j]] = [vals[j], vals[i]]; }
  const correct = vals.indexOf(correctStr);
  return {
    q: `กล่องใบหนึ่งมีสลาก ${total} ใบ เป็นสลากรางวัล ${target} ใบ หยิบสลาก 1 ใบแบบสุ่ม ความน่าจะเป็นที่จะหยิบได้สลากรางวัลคือเท่าไร`,
    choices: vals, correct,
    explain: `ความน่าจะเป็น = ${target}/${total} ทำเป็นเศษส่วนอย่างต่ำ (ห.ร.ม.=${d}) = ${num}/${den}`
  };
}

// ---------- 21. คะแนนเฉลี่ยถ่วงน้ำหนัก ----------
function gen_weighted_average() {
  const n1 = randInt(10, 30), n2 = randInt(10, 30);
  const avg1 = randInt(50, 90), avg2 = randInt(50, 90);
  const total = n1 * avg1 + n2 * avg2;
  const combinedAvg = Math.round(total / (n1 + n2));
  const { choices, correct } = makeChoices(combinedAvg, [Math.round((avg1 + avg2) / 2), combinedAvg + 3, combinedAvg - 3],
    v => `${fmtNum(v)} คะแนน`);
  return {
    q: `ห้องอบรม A มีผู้เข้าอบรม ${n1} คน คะแนนเฉลี่ย ${avg1} คะแนน ห้อง B มี ${n2} คน คะแนนเฉลี่ย ${avg2} คะแนน คะแนนเฉลี่ยรวมของทั้งสองห้องคือเท่าไร (ปัดเศษ)`,
    choices, correct,
    explain: `รวมคะแนน = ${n1}×${avg1}+${n2}×${avg2} = ${total} → เฉลี่ย = ${total}÷(${n1}+${n2}) ≈ ${combinedAvg} คะแนน`
  };
}

const MATH_GENERATORS = [
  gen_divide, gen_percent_increase, gen_ratio, gen_average,
  gen_geometric_seq, gen_arithmetic_seq, gen_logic, gen_percent_defect,
  gen_speed_distance, gen_work_rate, gen_hcf_lcm, gen_shift_duration,
  gen_percent_decrease, gen_age_problem, gen_profit_loss, gen_area_rect,
  gen_series_squares, gen_unit_convert, gen_permutation_simple,
  gen_probability_simple, gen_weighted_average
];

// สร้างโจทย์คณิตศาสตร์/เชิงเหตุผลแบบสุ่มจำนวน n ข้อ พยายามไม่ให้ข้อความซ้ำกันภายในชุดเดียวกัน
function generateUniqueMathQuestions(n, existingTexts) {
  const seen = new Set(existingTexts || []);
  const result = [];
  let guard = 0;
  while (result.length < n && guard < n * 30) {
    guard++;
    const gen = pick(MATH_GENERATORS);
    const item = gen();
    if (!seen.has(item.q)) {
      seen.add(item.q);
      item.cat = MATH_CAT;
      result.push(item);
    }
  }
  return result;
}

if (typeof module !== 'undefined') {
  module.exports = { MATH_GENERATORS, generateUniqueMathQuestions, makeChoices, randInt, pick, gcd, MATH_CAT };
}
