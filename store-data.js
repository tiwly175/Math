// store-data.js — รายการไฟล์ในคลังเอกสาร (ร้านค้า)
// จัดหมวดหมู่ตามเนื้อหา และชี้ path ไปยังโฟลเดอร์ที่ถูกต้อง
// - ไฟล์ภาษาไทยอยู่ในโฟลเดอร์ thai/
// - ไฟล์หมวดอื่นอยู่ในโฟลเดอร์ files/

const STORE_ITEMS = [
  // ---------- หมวดกฎหมาย ----------
  {
    title: 'กฎหมายและจริยธรรม (ชุดรวม)', badge: 'PDF', icon: '⚖️', category: 'กฎหมาย',
    files: [
      { label: 'กฎหมาย จริยธรรม อาเซียน', ext: 'PDF', href: 'law/กฎหมาย จริยธรรม อาเซียน.pdf', downloadable: false },
      { label: 'กฎหมายที่ประชาชนควรรู้', ext: 'PDF', href: 'law/กฎหมายที่ประชาชนควรรู้.pdf', downloadable: false },
      { label: 'กฎหมายทั่วไป', ext: 'PDF', href: 'law/กฎหหมายทั่วไป..pdf', downloadable: false },
      { label: 'กฎหมายที่ควรทราบ', ext: 'PDF', href: 'law/กฏหมายที่ควรทราบ.pdf', downloadable: false },
      { label: 'จริยธรรม กฎหมาย เพิ่มเติม', ext: 'PDF', href: 'law/จริยธรรม กฎหมาย เพิ่มเติม..pdf', downloadable: false },
      { label: 'แนวข้อสอบวิชา-กฎหมายที่ประชาชนควรรู้', ext: 'PDF', href: 'law/แนวข้อสอบวิชา-กฎหมายที่ประชาชนควรรู้.pdf', downloadable: false }
    ]
  },
  // ---------- หมวดภาษาไทย (ใช้โฟลเดอร์ thai/) ----------
  {
    title: 'ภาษาไทย (ชุดรวม)', badge: 'PDF', icon: '📖', category: 'ภาษาไทย',
    files: [
      { label: 'โวหาร', ext: 'PDF', href: 'thai/โวหาร.pdf', downloadable: false },
      { label: 'การผันวรรณยุกต์', ext: 'PDF', href: 'thai/การผันวรรณยุกต์.pdf', downloadable: false },
      { label: 'การสร้างคำ', ext: 'PDF', href: 'thai/การสร้างคํา.pdf', downloadable: false },
      { label: 'การอ่านจับใจความสำคัญ', ext: 'PDF', href: 'thai/การอ่านจับใจความสําคัญ.pdf', downloadable: false },
      { label: 'การเขียนสะกดคำ', ext: 'PDF', href: 'thai/การเขียนสะกดคํา.pdf', downloadable: false },
      { label: 'การเรียงประโยค', ext: 'PDF', href: 'thai/การเรียงประโยค.pdf', downloadable: false },
      { label: 'คำราชาศัพท์', ext: 'PDF', href: 'thai/คําราชาศัพท์.pdf', downloadable: false },
      { label: 'คำเป็น-คำตาย', ext: 'PDF', href: 'thai/คําเป็น-คําตาย.pdf', downloadable: false },
      { label: 'ชนิดและหน้าที่ของคำ', ext: 'PDF', href: 'thai/ชนิดและหน้าที่ของคํา.pdf', downloadable: false },
      { label: 'ภาษาฟุ่มเฟือย', ext: 'PDF', href: 'thai/ภาษาฟุ่มเฟือย.pdf', downloadable: false },
      { label: 'สำนวนไทย', ext: 'PDF', href: 'thai/สํานวนไทย.pdf', downloadable: false },
      { label: 'หลักธรรม', ext: 'PDF', href: 'thai/หลักธรรม.pdf', downloadable: false },
      { label: 'วิชาภาษาไทย 1114 ข้อ', ext: 'PDF', href: 'thai/วิชาภาษาไทย 1114 ข้อ.pdf', downloadable: false },
      { label: 'แนวข้อสอบวิชา-ภาษาไทย', ext: 'PDF', href: 'thai/แนวข้อสอบวิชา-ภาษาไทย.pdf', downloadable: false },
      { label: 'ไฟล์แถม แนวข้อสอบภาษาไทย', ext: 'PDF', href: 'thai/ไฟล์แถม แนวข้อสอบภาษาไทย.pdf', downloadable: false }
    ]
  },
  // ---------- หมวดสังคม / รัฐศาสตร์ / เศรษฐกิจ ----------
  {
    title: 'สังคม รัฐศาสตร์ เศรษฐกิจ', badge: 'PDF', icon: '🌏', category: 'สังคม',
    files: [
      { label: 'รัฐศาสตร์', ext: 'PDF', href: 'files/รัฐศาสตร์.pdf', downloadable: false },
      { label: 'เศรษฐกิจพอเพียง', ext: 'PDF', href: 'files/เศรษฐกิจพอเพียง.pdf', downloadable: false }
    ]
  },
  // ---------- หมวดตำรวจ / จริยธรรมตำรวจ ----------
  {
    title: 'ตำรวจ / จริยธรรม', badge: 'PDF', icon: '👮', category: 'ตำรวจ',
    files: [
      { label: 'สรุป-พรบ.ตำรวจ', ext: 'PDF', href: 'files/สรุป-พรบ.ตํารวจ.pdf', downloadable: false },
      { label: 'จริยธรรม ตร.', ext: 'PDF', href: 'files/จริยธรรม ตร.pdf', downloadable: false }
    ]
  },
  // ---------- หมวดความสามารถทั่วไป ----------
  {
    title: 'ความสามารถทั่วไป (คณิต + ไทย)', badge: 'PDF', icon: '🧮', category: 'ความสามารถทั่วไป',
    files: [
      { label: 'ความสามารถทั่วไปคณิตศาสตร์เเละภาษาไทย', ext: 'PDF', href: 'files/ความสามารถทั่วไปคณิตศาสตร์เเละภาษาไทย.pdf', downloadable: false },
      { label: 'แนวข้อสอบวิชา-ความรู้ความสามารถทั่วไป', ext: 'PDF', href: 'files/แนวข้อสอบวิชา-ความรู้ความสามารถทั่วไป.pdf', downloadable: false }
    ]
  },
  // ---------- หมวดงานสารบรรณ ----------
  {
    title: 'งานสารบรรณ', badge: 'PDF', icon: '📁', category: 'งานสารบรรณ',
    files: [
      { label: 'ระเบียบงานสารบรรณ 90 ข้อ', ext: 'PDF', href: 'files/ระเบียบงานสารบรรณ 90 ข้อ.pdf', downloadable: false }
    ]
  }
];
