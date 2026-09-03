// store-data.js — รายการไฟล์ในคลังเอกสาร (ร้านค้า)
// ไฟล์นี้แยกออกมาจาก app.js โดยเฉพาะ เพื่อให้เพิ่ม/แก้ไฟล์เอกสารได้ง่ายๆ
// โดยไม่ต้องไปยุ่งกับโค้ดของแอป — มีไฟล์เยอะแค่ไหน หรือเพิ่มเรื่อยๆ ก็แค่ copy-paste
// อ็อบเจกต์แบบเดิมแล้วแก้ค่า ไม่ต้องแตะ app.js เลย
//
// วิธีเพิ่มไฟล์ใหม่:
//   1) copy หนึ่งช่อง { ... } ในอาเรย์ STORE_ITEMS ด้านล่าง มาวางต่อท้าย (ลำดับในนี้ = ลำดับที่โชว์ในแอป
//      รายการที่เพิ่มใหม่ควรวางไว้ "บนสุด" เพื่อให้ขึ้นก่อน)
//   2) แก้ title / icon / badge / category ตามต้องการ
//   3) ใส่ href ของแต่ละไฟล์:
//        - ไฟล์ในโปรเจกต์เอง: วางไฟล์ PDF ไว้ในโฟลเดอร์ "files/" แล้วใส่ href เป็น "files/ชื่อไฟล์.pdf"
//          (แบบนี้เปิดออฟไลน์ได้ หลัง service worker แคชไว้ตอนเปิดครั้งแรก)
//        - ลิงก์นอก (Google Drive แบบเปิดสาธารณะ, GitHub raw ฯลฯ) ก็ใช้ได้ แต่ต้องมีเน็ตตอนเปิด
//          และปุ่ม "ดาวน์โหลด" อาจกดไม่ได้ผล 100% กับบางลิงก์ (เบราว์เซอร์เป็นคนคุม ไม่ใช่แอป)
//   4) downloadable: true  → มีปุ่มดาวน์โหลดให้ในตัวดูไฟล์
//      downloadable: false → เปิดดูในแอปได้อย่างเดียว ไม่มีปุ่มดาวน์โหลด (กันเบื้องต้น ไม่ใช่บล็อกจริง 100%)
//
// หมายเหตุ (28 ไฟล์ชุดนี้): href ทุกอันใช้ path นำหน้าว่า "thai/" ตามที่ store-data.js
//   เดิมของคุณใช้อยู่ก่อนแล้ว — ถ้าจริงๆ ไฟล์อยู่คนละโฟลเดอร์ ให้ "หาแทนที่ทั้งไฟล์" คำว่า thai/
//   เป็นชื่อโฟลเดอร์จริงบน GitHub ทีเดียวจบ ไม่ต้องแก้ทีละบรรทัด
//
// category: ใส่เป็นข้อความอะไรก็ได้ (เช่น 'ปราบปราม', 'อำนวยการ', 'กฎหมาย', 'เฉลย')
//   แอปจะไปสร้างแท็บกรองหมวดหมู่ให้เองอัตโนมัติจากค่าตรงนี้ ไม่ต้องไปประกาศรายชื่อหมวดที่ไหนอีก
//   ถ้าไม่ใส่ category จะถูกจัดเป็น "ทั่วไป" โดยอัตโนมัติ
//
// badge: ใส่ 'ฟรี!' หรือข้อความอื่น เช่น 'ใหม่' 'อัปเดต' ก็ได้ (แค่เป็นป้ายเล็กๆ มุมซ้ายบน)

const STORE_ITEMS = [
  {
    title:'ชุดเอกสาร กฎหมาย · จริยธรรม · ความรู้ทั่วไป', badge:'ใหม่', icon:'⚖️', category:'กฎหมาย-จริยธรรม',
    files:[
      {label:'กฎหมาย จริยธรรม อาเซียน', ext:'PDF', href:'thai/กฎหมาย จริยธรรม อาเซียน.pdf', downloadable:true},
      {label:'กฎหมายที่ประชาชนควรรู้', ext:'PDF', href:'thai/กฎหมายที่ประชาชนควรรู้.pdf', downloadable:true},
      {label:'กฎหหมายทั่วไป', ext:'PDF', href:'thai/กฎหหมายทั่วไป..pdf', downloadable:true},
      {label:'กฏหมายที่ควรทราบ', ext:'PDF', href:'thai/กฏหมายที่ควรทราบ.pdf', downloadable:true},
      {label:'จริยธรรม กฎหมาย เพิ่มเติม', ext:'PDF', href:'thai/จริยธรรม กฎหมาย เพิ่มเติม..pdf', downloadable:true},
      {label:'รัฐศาสตร์', ext:'PDF', href:'thai/รัฐศาสตร์.pdf', downloadable:true},
      {label:'สรุป พ.ร.บ. ตำรวจ', ext:'PDF', href:'thai/สรุป-พรบ.ตำรวจ.pdf', downloadable:true},
      {label:'เศรษฐกิจพอเพียง', ext:'PDF', href:'thai/เศรษฐกิจพอเพียง.pdf', downloadable:true},
      {label:'แนวข้อสอบวิชา กฎหมายที่ประชาชนควรรู้', ext:'PDF', href:'thai/แนวข้อสอบวิชา-กฎหมายที่ประชาชนควรรู้.pdf', downloadable:true},
      {label:'จริยธรรม ตร.', ext:'PDF', href:'thai/จริยธรรม ตร.pdf', downloadable:true},
      {label:'หลักธรรม', ext:'PDF', href:'thai/หลักธรรม.pdf', downloadable:true}
    ]
  },
  {
    title:'ชุดเอกสาร ภาษาไทย · ความสามารถทั่วไป', badge:'ใหม่', icon:'📖', category:'ภาษาไทย',
    files:[
      {label:'โวหาร', ext:'PDF', href:'thai/โวหาร.pdf', downloadable:true},
      {label:'การผันวรรณยุกต์', ext:'PDF', href:'thai/การผันวรรณยุกต์.pdf', downloadable:true},
      {label:'การสร้างคำ', ext:'PDF', href:'thai/การสร้างคํา.pdf', downloadable:true},
      {label:'การอ่านจับใจความสำคัญ', ext:'PDF', href:'thai/การอ่านจับใจความสําคัญ.pdf', downloadable:true},
      {label:'การเขียนสะกดคำ', ext:'PDF', href:'thai/การเขียนสะกดคํา.pdf', downloadable:true},
      {label:'การเรียงประโยค', ext:'PDF', href:'thai/การเรียงประโยค.pdf', downloadable:true},
      {label:'ความสามารถทั่วไป คณิตศาสตร์ และภาษาไทย', ext:'PDF', href:'thai/ความสามารถทั่วไปคณิตศาสตร์เเละภาษาไทย.pdf', downloadable:true},
      {label:'คำราชาศัพท์', ext:'PDF', href:'thai/คําราชาศัพท์.pdf', downloadable:true},
      {label:'คำเป็น-คำตาย', ext:'PDF', href:'thai/คําเป็น-คําตาย.pdf', downloadable:true},
      {label:'ชนิดและหน้าที่ของคำ', ext:'PDF', href:'thai/ชนิดและหน้าที่ของคํา.pdf', downloadable:true},
      {label:'ภาษาฟุ่มเฟือย', ext:'PDF', href:'thai/ภาษาฟุ่มเฟือย.pdf', downloadable:true},
      {label:'ระเบียบงานสารบรรณ 90 ข้อ', ext:'PDF', href:'thai/ระเบียบงานสารบรรณ 90 ข้อ.pdf', downloadable:true},
      {label:'วิชาภาษาไทย 1114 ข้อ', ext:'PDF', href:'thai/วิชาภาษาไทย 1114 ข้อ.pdf', downloadable:true},
      {label:'สำนวนไทย', ext:'PDF', href:'thai/สํานวนไทย.pdf', downloadable:true},
      {label:'แนวข้อสอบวิชา ความรู้ความสามารถทั่วไป', ext:'PDF', href:'thai/แนวข้อสอบวิชา-ความรู้ความสามารถทั่วไป.pdf', downloadable:true},
      {label:'แนวข้อสอบวิชา ภาษาไทย', ext:'PDF', href:'thai/แนวข้อสอบวิชา-ภาษาไทย.pdf', downloadable:true},
      {label:'ไฟล์แถม แนวข้อสอบภาษาไทย', ext:'PDF', href:'thai/ไฟล์แถม แนวข้อสอบภาษาไทย.pdf', downloadable:true}
    ]
  }
];
