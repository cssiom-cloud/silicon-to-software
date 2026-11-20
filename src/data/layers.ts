export interface LayerNavItem {
  id: string
  code: string
  shortTitle: string
  titleTh: string
  titleEn: string
  tagline: string
  accent: 'cyan' | 'purple'
}

export interface CausalChain {
  inputLabel: string
  inputDetail: string
  mechanismLabel: string
  mechanismDetail: string
  outputLabel: string
  outputDetail: string
}

export interface SummaryRow {
  layerId: string
  layerBadge: string
  layerNameTh: string
  layerNameEn: string
  startsFrom: string
  coreMechanism: string
  handsOffToNext: string
}

export interface MemoryComparisonRow {
  metric: string
  sram: string
  dram: string
  nand: string
}

export const LAYER_NAV_ITEMS: LayerNavItem[] = [
  {
    id: 'layer-0',
    code: 'LAYER 0',
    shortTitle: 'อะตอม & การโดปซิลิคอน',
    titleTh: 'ฟิสิกส์ของอะตอมและการโดปซิลิคอน',
    titleEn: 'Semiconductor & Doping',
    tagline: 'เปลี่ยนทรายที่ไม่นำไฟฟ้า ให้กลายเป็นวัสดุควบคุมกระแสได้ด้วยอิเล็กตรอนและ Hole',
    accent: 'cyan',
  },
  {
    id: 'layer-1',
    code: 'LAYER 1',
    shortTitle: 'ทรานซิสเตอร์ MOSFET',
    titleTh: 'ทรานซิสเตอร์ MOSFET',
    titleEn: 'Field-Effect Electronic Switch',
    tagline: 'สร้างสวิตช์ไฟฟ้าไร้ชิ้นส่วนเคลื่อนไหว ที่เปิด-ปิดด้วยสนามไฟฟ้าทะลุฉนวน',
    accent: 'purple',
  },
  {
    id: 'layer-2',
    code: 'LAYER 2',
    shortTitle: 'ลอจิกเกต CMOS',
    titleTh: 'ลอจิกเกต CMOS',
    titleEn: 'Voltage to Boolean Logic',
    tagline: 'จับคู่ PMOS และ NMOS เปลี่ยนแรงดันไฟฟ้าให้กลายเป็นตรรกะ NOT และ NAND',
    accent: 'cyan',
  },
  {
    id: 'layer-3a',
    code: 'LAYER 3A',
    shortTitle: 'วงจรคำนวณ & ALU',
    titleTh: 'วงจรคำนวณ (Adder & ALU)',
    titleEn: 'Combinational Logic & Arithmetic',
    tagline: 'ร้อยเกต XOR และ AND ต่อกันเป็นเครื่องบวกเลขฐานสองที่คำนวณได้ด้วยความเร็วแสง',
    accent: 'cyan',
  },
  {
    id: 'layer-3b',
    code: 'LAYER 3B',
    shortTitle: 'หน่วยความจำ 3 ชนิด',
    titleTh: 'วงจรความจำ (SRAM / DRAM / NAND)',
    titleEn: 'Feedback Loop, Capacitor & Quantum Trap',
    tagline: 'กลไกการจำบิต 0 และ 1 ทั้งแบบล็อกวงจร เก็บประจุ และขังอิเล็กตรอนแบบควอนตัม',
    accent: 'purple',
  },
  {
    id: 'layer-4',
    code: 'LAYER 4',
    shortTitle: 'นาฬิกา & วงจร CPU',
    titleTh: 'นาฬิกาและวงจร CPU',
    titleEn: 'Clock & Fetch-Decode-Execute',
    tagline: 'สัญญาณนาฬิกาขับเคลื่อนวงจรดึงคำสั่ง ถอดรหัส และสับสวิตช์ให้โค้ดทำงานอัตโนมัติ',
    accent: 'purple',
  },
  {
    id: 'layer-5',
    code: 'LAYER 5',
    shortTitle: 'สรุปห่วงโซ่เหตุ-ผล',
    titleTh: 'ตารางสรุปห่วงโซ่เหตุ-ผลทั้งหมด',
    titleEn: 'Full Abstraction Stack & Photolithography',
    tagline: 'ภาพรวมไร้กล่องดำทั้ง 6 ชั้น และเหตุผลที่ซิลิคอนเปลี่ยนโลกวิศวกรรม',
    accent: 'cyan',
  },
]

export const LAYER_CAUSAL_CHAINS: Record<string, CausalChain> = {
  'layer-0': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'ผลึกซิลิคอนบริสุทธิ์ (Si) ที่จับพันธะโควาเลนต์แน่น 4 แขน + ธาตุเจือปน ฟอสฟอรัส (P) หรือ โบรอน (B)',
    mechanismLabel: 'กลไกทางฟิสิกส์จริง ๆ',
    mechanismDetail: 'การโดป (Doping) สร้างอิเล็กตรอนอิสระส่วนเกินใน N-Type และหลุมประจุบวก (Hole) ใน P-Type ทำให้เคลื่อนที่เมื่อมีแรงดันไฟ',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'แผ่นวัสดุสารกึ่งตัวนำชนิด N และ P ที่ปรับสมบัติการนำไฟฟ้าได้ตามต้องการ สำหรับประกอบเป็นทรานซิสเตอร์',
  },
  'layer-1': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'ฐานซิลิคอน P-Type ฝังขั้ว N+ สองฝั่ง (Source, Drain) คั่นด้วยฉนวนออกไซด์ (SiO₂) และขั้ว Gate ด้านบน',
    mechanismLabel: 'กลไกทางฟิสิกส์จริง ๆ',
    mechanismDetail: 'Field Effect: แรงดันที่ขา Gate เกิน Vth ส่งสนามไฟฟ้าทะลุฉนวน ดึงอิเล็กตรอนมาสร้างสะพาน Inversion Channel เชื่อม Source–Drain',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'สวิตช์อิเล็กทรอนิกส์ขนาดนาโนเมตร (NMOS / PMOS) ที่เปิด-ปิดได้พันล้านครั้งต่อวินาทีโดยไม่มีชิ้นส่วนกลไก',
  },
  'layer-2': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'ทรานซิสเตอร์ PMOS ต่อกับไฟบวก (VDD = 1) และ NMOS ต่อกับกราวด์ (GND = 0) ในรูปแบบ CMOS',
    mechanismLabel: 'กลไกทางตรรกะจริง ๆ',
    mechanismDetail: 'การต่ออนุกรม/ขนานของสวิตช์คู่ตรงข้าม ทำให้เอาต์พุตเชื่อมต่อกับ VDD หรือ GND อย่างใดอย่างหนึ่งตามกฎตรรกะ NOT และ NAND',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'ลอจิกเกตสากล (Universal Gates) ที่แปลงสัญญาณแรงดันแอนะล็อกให้เป็นบิตดิจิทัล 0 และ 1 ที่แม่นยำและทนสัญญาณรบกวน',
  },
  'layer-3a': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'ลอจิกเกตพื้นฐาน (XOR, AND, OR) และสัญญาณบิตอินพุตของตัวเลขฐานสองหลายหลัก',
    mechanismLabel: 'กลไกทางตรรกะจริง ๆ',
    mechanismDetail: 'XOR สร้างผลบวกหลักหน่วย (Sum) ส่วน AND สร้างตัวทด (Carry) แล้วต่อพ่วงเป็น Full Adder หลายหลักให้ตัวทดไหลข้ามหลัก',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'หน่วยคำนวณทางคณิตศาสตร์และตรรกะ (ALU) ที่บวก ลบ และเปรียบเทียบตัวเลขได้ทันทีเมื่อมีแรงดันไฟไหลผ่าน',
  },
  'layer-3b': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'ลอจิกเกตต่อวนลูป (SRAM), ทรานซิสเตอร์+ตัวเก็บประจุ (DRAM), และเกตลอยตัวหุ้มฉนวน (NAND Flash)',
    mechanismLabel: 'กลไกทางฟิสิกส์จริง ๆ',
    mechanismDetail: 'SRAM ล็อกแรงดันด้วย Feedback Loop, DRAM เก็บประจุในถังและคอย Refresh, NAND ใช้ Quantum Tunneling ขังอิเล็กตรอนในกรงฉนวน',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'ระบบหน่วยความจำครบทุกชั้น (Cache, RAM, SSD) ที่เก็บทั้งข้อมูลและรหัสคำสั่งโปรแกรมให้ CPU เรียกใช้ได้',
  },
  'layer-4': {
    inputLabel: 'เริ่มจากอะไร',
    inputDetail: 'สัญญาณนาฬิกา (Clock), ชุดคำสั่งเลขฐานสองใน RAM, ALU และรีจิสเตอร์ (PC, IR, R1, R2)',
    mechanismLabel: 'กลไกทางวงจรจริง ๆ',
    mechanismDetail: 'วงรอบ Fetch → Decode → Execute: Clock ขยับ PC ไปดึงบิตจาก RAM, Decoder สับสวิตช์ควบคุม ALU และเขียนผลกลับรีจิสเตอร์',
    outputLabel: 'ส่งต่อให้ชั้นถัดไป',
    outputDetail: 'เครื่องจักรประมวลผลทั่วไป (CPU) ที่สามารถรันโค้ดโปรแกรม ระบบปฏิบัติการ และ AI ได้จากแค่การไหลของอิเล็กตรอน',
  },
}

export const MEMORY_COMPARISON_ROWS: MemoryComparisonRow[] = [
  {
    metric: 'โครงสร้างต่อ 1 บิต',
    sram: '6 ทรานซิสเตอร์ (NOT 2 ตัววนลูป + Access FET)',
    dram: '1 ทรานซิสเตอร์ + 1 ตัวเก็บประจุ (1T1C)',
    nand: '1 ทรานซิสเตอร์ Floating Gate / Charge Trap',
  },
  {
    metric: 'ความเร็วในการเข้าถึง',
    sram: 'เร็วที่สุด (~0.5 – 2 ns) ใช้ทำ CPU Cache (L1/L2/L3)',
    dram: 'เร็วปานกลาง (~15 – 50 ns) ใช้ทำหน่วยความจำหลัก RAM',
    nand: 'ช้ากว่า RAM (~25,000 – 100,000 ns) ใช้ทำ SSD / Flash',
  },
  {
    metric: 'ความจุต่อพื้นที่ / ราคาต่อ GB',
    sram: 'กินพื้นที่มากที่สุด / แพงที่สุด',
    dram: 'ความหนาแน่นสูง / ราคากลาง',
    nand: 'ความหนาแน่นสูงสุด (ซ้อน 3D ได้) / ถูกที่สุด',
  },
  {
    metric: 'เมื่อตัดไฟ (Volatility)',
    sram: 'หายทันที (Volatile) — ลูปแรงดันยุบเป็น 0V',
    dram: 'หายภายในเสี้ยววินาที (Volatile) — ประจุรั่วหมด',
    nand: 'อยู่ครบเป็นปี (Non-Volatile) — อิเล็กตรอนถูกขังในฉนวน',
  },
  {
    metric: 'ต้องคอย Refresh หรือไม่',
    sram: 'ไม่ต้อง (ตราบใดที่ยังจ่ายไฟ)',
    dram: 'ต้อง Refresh ทุก ~64 ms',
    nand: 'ไม่ต้อง (แต่มีจำนวนรอบ Program/Erase จำกัด)',
  },
]

export const SUMMARY_TABLE_ROWS: SummaryRow[] = [
  {
    layerId: 'layer-0',
    layerBadge: 'Layer 0',
    layerNameTh: 'อะตอม & การโดปซิลิคอน',
    layerNameEn: 'Semiconductor Physics',
    startsFrom: 'ผลึกซิลิคอนบริสุทธิ์ (Si) + สารเจือปน ฟอสฟอรัส (P) / โบรอน (B)',
    coreMechanism: 'การโดปสร้างอิเล็กตรอนอิสระ (N-Type) และหลุมประจุบวก Hole (P-Type) ที่เคลื่อนที่เมื่อมีแรงดันไฟฟ้า',
    handsOffToNext: 'วัสดุสารกึ่งตัวนำชนิด N และ P สำหรับประกอบโครงสร้างทรานซิสเตอร์',
  },
  {
    layerId: 'layer-1',
    layerBadge: 'Layer 1',
    layerNameTh: 'ทรานซิสเตอร์ MOSFET',
    layerNameEn: 'Field-Effect Switch',
    startsFrom: 'ฐานซิลิคอน P/N, ขั้ว Source–Drain, ชั้นฉนวน Oxide และขั้ว Gate',
    coreMechanism: 'แรงดันที่ Gate เกิน Vth ส่งสนามไฟฟ้าทะลุฉนวน สร้าง Inversion Channel เชื่อมกระแสโดยไร้ชิ้นส่วนเคลื่อนไหว',
    handsOffToNext: 'สวิตช์อิเล็กทรอนิกส์ความเร็วระดับนาโนวินาที (NMOS และ PMOS)',
  },
  {
    layerId: 'layer-2',
    layerBadge: 'Layer 2',
    layerNameTh: 'ลอจิกเกต CMOS',
    layerNameEn: 'Boolean Logic Gates',
    startsFrom: 'สวิตช์ PMOS ต่อ VDD (1) และ NMOS ต่อ GND (0) ทำงานคู่ตรงข้ามกัน',
    coreMechanism: 'สลับการเชื่อมต่อขาออกไปยังไฟบวกหรือกราวด์ตามตารางความจริง สร้าง NOT Gate และ NAND Gate สากล',
    handsOffToNext: 'ตัวดำเนินการตรรกะดิจิทัล 0/1 ที่ทนสัญญาณรบกวนและต่อยอดได้ไม่จำกัด',
  },
  {
    layerId: 'layer-3a',
    layerBadge: 'Layer 3A',
    layerNameTh: 'วงจรคำนวณ & ALU',
    layerNameEn: 'Combinational Arithmetic',
    startsFrom: 'ลอจิกเกต XOR, AND, OR ต่อเป็นวงจร Half Adder และ Full Adder',
    coreMechanism: 'แยกผลบวก (Sum = XOR) กับตัวทด (Carry = AND) แล้วส่งตัวทดไหลข้ามหลักทีละบิตในวงจร Ripple-Carry',
    handsOffToNext: 'หน่วยคำนวณทางคณิตศาสตร์และตรรกะ (ALU) ที่คิดเลขฐานสองได้ในพริบตา',
  },
  {
    layerId: 'layer-3b',
    layerBadge: 'Layer 3B',
    layerNameTh: 'หน่วยความจำ 3 ชนิด',
    layerNameEn: 'SRAM / DRAM / NAND',
    startsFrom: 'Feedback Loop (SRAM), ตัวเก็บประจุ (DRAM), และ Floating Gate (NAND)',
    coreMechanism: 'ล็อกสถานะแรงดัน, เก็บประจุพร้อมวงจร Refresh, และใช้ Quantum Tunneling ขังอิเล็กตรอนข้ามฉนวน',
    handsOffToNext: 'พื้นที่จัดเก็บข้อมูลและรหัสโปรแกรมทั้งชั่วคราว (Cache/RAM) และถาวร (SSD)',
  },
  {
    layerId: 'layer-4',
    layerBadge: 'Layer 4',
    layerNameTh: 'นาฬิกา & วงจร CPU',
    layerNameEn: 'Fetch–Decode–Execute',
    startsFrom: 'คลื่นนาฬิกา (Clock), Program Counter, RAM, Decoder, ALU และ Registers',
    coreMechanism: 'ทุกจังหวะ Clock จะดึงบิตคำสั่งจาก RAM, ถอดรหัส Opcode เพื่อสับสวิตช์ควบคุม ALU และบันทึกผลอัตโนมัติ',
    handsOffToNext: 'หน่วยประมวลผลที่รันภาษาเครื่อง, OS, แอปพลิเคชัน และซอฟต์แวร์ยุคใหม่ทั้งหมด',
  },
]
