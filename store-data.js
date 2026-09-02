// store-data.js — รายการไฟล์ในคลังเอกสาร (ร้านค้า)
// แยกออกมาจาก app.js เพื่อให้เพิ่ม/แก้ไฟล์ได้ง่าย โดยไม่ต้องแตะ app.js
// category: ข้อความใดก็ได้ แอปจะสร้างแท็บกรองหมวดให้อัตโนมัติ
//
// ชื่อไฟล์เก็บตามต้นฉบับของผู้ใช้ (รวมตัวสะกดที่ผิด เช่น กฏ ตํา สํา คํา เเละ หห ตร) — ไม่แก้ให้
// href '#' = ยังไม่ได้เชื่อมลิงก์ (ผู้ใช้เติมทีหลัง)
//
// badge: ป้ายเล็กๆ มุมซ้ายบน (เช่น 'ใหม่' 'อัปเดต')

const STORE_ITEMS = [
  // ===== ไอเทมตัวอย่าง/เทสระบบเดิม (คงไว้ตามเดิม) =====
  {
    title:'ข้อสอบ (อยู่ในการเทสระบบ) ', badge:'ฟรี!', icon:'📘', category:'ทั้งหมด',
    files:[
      {label:'ตัวข้อสอบ', ext:'PDF', href:'thai/หลักธรรม.pdf', downloadable:false},
      {label:'ตัวข้อสอบ', ext:'PDF', href:'thai/คำเป็น-คำตาย.pdf', downloadable:false},
    ]
  },

  // ===== ภาษาไทย (14) =====
  { title:'โวหาร.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'โวหาร', ext:'PDF', href:'#', downloadable:false}] },
  { title:'การผันวรรณยุกต์.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'การผันวรรณยุกต์', ext:'PDF', href:'#', downloadable:false}] },
  { title:'การสร้างคํา.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'การสร้างคํา', ext:'PDF', href:'#', downloadable:false}] },
  { title:'การอ่านจับใจความสําคัญ.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'การอ่านจับใจความสําคัญ', ext:'PDF', href:'#', downloadable:false}] },
  { title:'การเขียนสะกดคํา.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'การเขียนสะกดคํา', ext:'PDF', href:'#', downloadable:false}] },
  { title:'การเรียงประโยค.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'การเรียงประโยค', ext:'PDF', href:'#', downloadable:false}] },
  { title:'คําราชาศัพท์.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'คําราชาศัพท์', ext:'PDF', href:'#', downloadable:false}] },
  { title:'คําเป็น-คําตาย.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'คําเป็น-คําตาย', ext:'PDF', href:'#', downloadable:false}] },
  { title:'ชนิดและหน้าที่ของคํา.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'ชนิดและหน้าที่ของคํา', ext:'PDF', href:'#', downloadable:false}] },
  { title:'ภาษาฟุ่มเฟือย.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'ภาษาฟุ่มเฟือย', ext:'PDF', href:'#', downloadable:false}] },
  { title:'วิชาภาษาไทย 1114 ข้อ.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'วิชาภาษาไทย 1114 ข้อ', ext:'PDF', href:'#', downloadable:false}] },
  { title:'สํานวนไทย.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'สํานวนไทย', ext:'PDF', href:'#', downloadable:false}] },
  { title:'แนวข้อสอบวิชา-ภาษาไทย.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'แนวข้อสอบวิชา-ภาษาไทย', ext:'PDF', href:'#', downloadable:false}] },
  { title:'ไฟล์แถม แนวข้อสอบภาษาไทย.pdf', badge:'ไทย', icon:'📘', category:'ภาษาไทย', files:[{label:'ไฟล์แถม แนวข้อสอบภาษาไทย', ext:'PDF', href:'#', downloadable:false}] },

  // ===== กฎหมาย (5) =====
  { title:'กฎหมาย จริยธรรม อาเซียน.pdf', badge:'กฎหมาย', icon:'⚖️', category:'กฎหมาย', files:[{label:'กฎหมาย จริยธรรม อาเซียน', ext:'PDF', href:'#', downloadable:false}] },
  { title:'กฎหมายที่ประชาชนควรรู้.pdf', badge:'กฎหมาย', icon:'⚖️', category:'กฎหมาย', files:[{label:'กฎหมายที่ประชาชนควรรู้', ext:'PDF', href:'#', downloadable:false}] },
  { title:'กฎหหมายทั่วไป..pdf', badge:'กฎหมาย', icon:'⚖️', category:'กฎหมาย', files:[{label:'กฎหหมายทั่วไป..', ext:'PDF', href:'#', downloadable:false}] },
  { title:'กฏหมายที่ควรทราบ.pdf', badge:'กฎหมาย', icon:'⚖️', category:'กฎหมาย', files:[{label:'กฏหมายที่ควรทราบ', ext:'PDF', href:'#', downloadable:false}] },
  { title:'แนวข้อสอบวิชา-กฎหมายที่ประชาชนควรรู้.pdf', badge:'กฎหมาย', icon:'⚖️', category:'กฎหมาย', files:[{label:'แนวข้อสอบวิชา-กฎหมายที่ประชาชนควรรู้', ext:'PDF', href:'#', downloadable:false}] },

  // ===== สังคม & จริยธรรม (5) =====
  { title:'จริยธรรม กฎหมาย เพิ่มเติม..pdf', badge:'สังคม', icon:'🌏', category:'สังคม & จริยธรรม', files:[{label:'จริยธรรม กฎหมาย เพิ่มเติม..', ext:'PDF', href:'#', downloadable:false}] },
  { title:'รัฐศาสตร์.pdf', badge:'สังคม', icon:'🌏', category:'สังคม & จริยธรรม', files:[{label:'รัฐศาสตร์', ext:'PDF', href:'#', downloadable:false}] },
  { title:'เศรษฐกิจพอเพียง.pdf', badge:'สังคม', icon:'🌏', category:'สังคม & จริยธรรม', files:[{label:'เศรษฐกิจพอเพียง', ext:'PDF', href:'#', downloadable:false}] },
  { title:'จริยธรรม ตร.pdf', badge:'สังคม', icon:'🌏', category:'สังคม & จริยธรรม', files:[{label:'จริยธรรม ตร', ext:'PDF', href:'#', downloadable:false}] },
  { title:'หลักธรรม.pdf', badge:'สังคม', icon:'🌏', category:'สังคม & จริยธรรม', files:[{label:'หลักธรรม', ext:'PDF', href:'#', downloadable:false}] },

  // ===== ตำรวจ (2) =====
  { title:'สรุป-พรบ.ตํารวจ.pdf', badge:'ตำรวจ', icon:'🚓', category:'ตำรวจ', files:[{label:'สรุป-พรบ.ตํารวจ', ext:'PDF', href:'#', downloadable:false}] },
  { title:'ระเบียบงานสารบรรณ 90 ข้อ.pdf', badge:'ตำรวจ', icon:'🚓', category:'ตำรวจ', files:[{label:'ระเบียบงานสารบรรณ 90 ข้อ', ext:'PDF', href:'#', downloadable:false}] },

  // ===== ความรู้ความสามารถทั่วไป (2) =====
  { title:'ความสามารถทั่วไปคณิตศาสตร์เเละภาษาไทย.pdf', badge:'ความรู้ทั่วไป', icon:'🧠', category:'ความรู้ความสามารถทั่วไป', files:[{label:'ความสามารถทั่วไปคณิตศาสตร์เเละภาษาไทย', ext:'PDF', href:'#', downloadable:false}] },
  { title:'แนวข้อสอบวิชา-ความรู้ความสามารถทั่วไป.pdf', badge:'ความรู้ทั่วไป', icon:'🧠', category:'ความรู้ความสามารถทั่วไป', files:[{label:'แนวข้อสอบวิชา-ความรู้ความสามารถทั่วไป', ext:'PDF', href:'#', downloadable:false}] },
];
