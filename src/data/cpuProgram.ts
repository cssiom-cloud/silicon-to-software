export type CpuPhase = 'IDLE' | 'FETCH' | 'DECODE' | 'EXECUTE' | 'WRITEBACK' | 'HALT'

export interface RamInstruction {
  address: string
  binary: string
  opcodeBits: string
  operandBits: string
  assembly: string
  commentTh: string
}

export interface CpuStepState {
  stepIndex: number
  cycleNumber: number
  phase: CpuPhase
  pc: number
  ramActiveAddress: number | null
  irBinary: string
  irAssembly: string
  decoderSignal: string
  aluOp: string
  aluInA: number | null
  aluInB: number | null
  aluOut: number | null
  r1: number
  r2: number
  acc: number
  activeBuses: Array<
    | 'clock-pulse'
    | 'pc-to-ram'
    | 'ram-to-ir'
    | 'ir-to-decoder'
    | 'decoder-to-reg'
    | 'decoder-to-alu'
    | 'reg-to-alu'
    | 'alu-to-reg'
  >
  activeBlocks: Array<'clock' | 'pc' | 'ram' | 'decoder' | 'alu' | 'registers'>
  headlineTh: string
  explanationTh: string
  hardwareSwitchDetail: string
}

export const CPU_RAM_PROGRAM: RamInstruction[] = [
  {
    address: '0x00',
    binary: '0001 0101',
    opcodeBits: '0001',
    operandBits: '0101',
    assembly: 'LOAD R1, 5',
    commentTh: 'โหลดค่าคงที่ 5 (0101₂) เข้าสู่รีจิสเตอร์ R1',
  },
  {
    address: '0x01',
    binary: '0010 0011',
    opcodeBits: '0010',
    operandBits: '0011',
    assembly: 'LOAD R2, 3',
    commentTh: 'โหลดค่าคงที่ 3 (0011₂) เข้าสู่รีจิสเตอร์ R2',
  },
  {
    address: '0x02',
    binary: '0011 0000',
    opcodeBits: '0011',
    operandBits: '0000',
    assembly: 'ADD R1, R2',
    commentTh: 'ส่ง R1 และ R2 เข้า ALU บวกกัน แล้วเก็บผลใน R1 (และ ACC)',
  },
  {
    address: '0x03',
    binary: '1111 0000',
    opcodeBits: '1111',
    operandBits: '0000',
    assembly: 'HALT',
    commentTh: 'หยุดสัญญาณนาฬิกา จบการทำงานของโปรแกรม',
  },
]

export const CPU_EXECUTION_STEPS: CpuStepState[] = [
  {
    stepIndex: 0,
    cycleNumber: 0,
    phase: 'IDLE',
    pc: 0,
    ramActiveAddress: null,
    irBinary: '0000 0000',
    irAssembly: 'READY',
    decoderSignal: 'WAITING FOR CLOCK',
    aluOp: 'IDLE',
    aluInA: null,
    aluInB: null,
    aluOut: null,
    r1: 0,
    r2: 0,
    acc: 0,
    activeBuses: [],
    activeBlocks: ['clock', 'pc'],
    headlineTh: 'สถานะเริ่มต้น (Reset State): รอขอบสัญญาณนาฬิกาแรก',
    explanationTh:
      'CPU ยังไม่รู้เลยว่ามีโปรแกรมอะไรรออยู่ มีเพียงรีจิสเตอร์ Program Counter (PC) ที่ถูกตั้งค่าเริ่มต้นไว้ที่ 0x00 และโปรแกรม 3 บรรทัดที่ถูกเก็บเป็นบิต 0/1 ไว้ใน RAM กดปุ่ม Next Clock Cycle เพื่อยิงสัญญาณนาฬิกาลูกแรก',
    hardwareSwitchDetail: 'PC = 0000₂ | R1 = 0000₂ | R2 = 0000₂ | Clock = LOW',
  },
  // --- Instruction 1: LOAD R1, 5 ---
  {
    stepIndex: 1,
    cycleNumber: 1,
    phase: 'FETCH',
    pc: 0,
    ramActiveAddress: 0,
    irBinary: '0001 0101',
    irAssembly: 'LOAD R1, 5',
    decoderSignal: 'FETCHING FROM 0x00',
    aluOp: 'IDLE',
    aluInA: null,
    aluInB: null,
    aluOut: null,
    r1: 0,
    r2: 0,
    acc: 0,
    activeBuses: ['clock-pulse', 'pc-to-ram', 'ram-to-ir'],
    activeBlocks: ['clock', 'pc', 'ram', 'decoder'],
    headlineTh: 'Cycle 1 [FETCH]: ดึงคำสั่งที่ 0x00 จาก RAM',
    explanationTh:
      'จังหวะ Clock ยกขึ้นเป็น 1! ค่าใน PC (0x00) วิ่งไปตาม Address Bus ปลุกเซลล์ RAM แถวที่ 0 ให้ปล่อยแรงดันบิต 0001 0101 ออกมาตาม Data Bus เข้ามาพักไว้ใน Instruction Register (IR)',
    hardwareSwitchDetail: 'Address Bus = 0x00 → RAM Read Enable = 1 → IR ← 0001_0101₂',
  },
  {
    stepIndex: 2,
    cycleNumber: 2,
    phase: 'DECODE',
    pc: 0,
    ramActiveAddress: 0,
    irBinary: '0001 0101',
    irAssembly: 'LOAD R1, 5',
    decoderSignal: 'OP=0001 → WRITE_EN(R1), IMM=5',
    aluOp: 'BYPASS (PASS 5)',
    aluInA: 5,
    aluInB: null,
    aluOut: null,
    r1: 0,
    r2: 0,
    acc: 0,
    activeBuses: ['clock-pulse', 'ir-to-decoder', 'decoder-to-reg'],
    activeBlocks: ['clock', 'decoder'],
    headlineTh: 'Cycle 2 [DECODE]: วงจรลอจิกเกตถอดรหัส Opcode 0001',
    explanationTh:
      'Instruction Decoder รับ 4 บิตหน้า (0001) เข้าตารางลอจิกเกต AND/NOT ผลลัพธ์คือสายควบคุมสีม่วงของคำสั่ง LOAD R1 ติดไฟเป็น 1 ทันที เพื่อเตรียมเปิดประตูรับข้อมูลของรีจิสเตอร์ R1 และแยกค่าคงที่ 0101₂ (เลข 5) ออกมา',
    hardwareSwitchDetail: 'Opcode 0001 → Control Line [R1_WRITE_EN = 1, MUX_IMM = 1]',
  },
  {
    stepIndex: 3,
    cycleNumber: 3,
    phase: 'EXECUTE',
    pc: 1,
    ramActiveAddress: null,
    irBinary: '0001 0101',
    irAssembly: 'LOAD R1, 5',
    decoderSignal: 'LATCH 0101₂ → R1 | PC ← PC + 1',
    aluOp: 'LOAD IMM',
    aluInA: 5,
    aluInB: null,
    aluOut: 5,
    r1: 5,
    r2: 0,
    acc: 0,
    activeBuses: ['clock-pulse', 'decoder-to-reg', 'alu-to-reg'],
    activeBlocks: ['clock', 'registers', 'pc'],
    headlineTh: 'Cycle 3 [EXECUTE & PC++]: บันทึกเลข 5 ลง R1 และขยับ PC เป็น 0x01',
    explanationTh:
      'สวิตช์ขาเข้าของ R1 เปิดออก แรงดันของเลข 0101₂ (5) ไหลเข้าไปล็อกอยู่ในวงจร SRAM ภายในรีจิสเตอร์ R1 พร้อมกันนั้นวงจรบวกของ PC ขยับค่าจาก 0x00 เป็น 0x01 เพื่อรอคำสั่งถัดไป',
    hardwareSwitchDetail: 'R1 ← 0101₂ (5) | PC Increment: 0x00 → 0x01',
  },
  // --- Instruction 2: LOAD R2, 3 ---
  {
    stepIndex: 4,
    cycleNumber: 4,
    phase: 'FETCH',
    pc: 1,
    ramActiveAddress: 1,
    irBinary: '0010 0011',
    irAssembly: 'LOAD R2, 3',
    decoderSignal: 'FETCHING FROM 0x01',
    aluOp: 'IDLE',
    aluInA: null,
    aluInB: null,
    aluOut: null,
    r1: 5,
    r2: 0,
    acc: 0,
    activeBuses: ['clock-pulse', 'pc-to-ram', 'ram-to-ir'],
    activeBlocks: ['clock', 'pc', 'ram', 'decoder'],
    headlineTh: 'Cycle 4 [FETCH]: ดึงคำสั่งที่ 0x01 จาก RAM',
    explanationTh:
      'Clock ตีจังหวะใหม่! ตอนนี้ PC ชี้อยู่ที่ 0x01 จึงส่งแอดเดรส 0x01 ไปยัง RAM และดึงบิต 0010 0011 (คำสั่ง LOAD R2, 3) เข้ามาแทนที่ใน Instruction Register',
    hardwareSwitchDetail: 'Address Bus = 0x01 → RAM Read Enable = 1 → IR ← 0010_0011₂',
  },
  {
    stepIndex: 5,
    cycleNumber: 5,
    phase: 'DECODE',
    pc: 1,
    ramActiveAddress: 1,
    irBinary: '0010 0011',
    irAssembly: 'LOAD R2, 3',
    decoderSignal: 'OP=0010 → WRITE_EN(R2), IMM=3',
    aluOp: 'BYPASS (PASS 3)',
    aluInA: 3,
    aluInB: null,
    aluOut: null,
    r1: 5,
    r2: 0,
    acc: 0,
    activeBuses: ['clock-pulse', 'ir-to-decoder', 'decoder-to-reg'],
    activeBlocks: ['clock', 'decoder'],
    headlineTh: 'Cycle 5 [DECODE]: ถอดรหัส Opcode 0010 เพื่อเลือก R2',
    explanationTh:
      'ลอจิกเกตใน Decoder ตรวจเจอบิต 0010 จึงเปลี่ยนไปจ่ายไฟให้สายควบคุม R2_WRITE_EN = 1 แทน R1 และแยกค่าคงที่ 4 บิตหลังคือ 0011₂ (เลข 3) ออกมารอส่งเข้าบัสข้อมูล',
    hardwareSwitchDetail: 'Opcode 0010 → Control Line [R2_WRITE_EN = 1, MUX_IMM = 1]',
  },
  {
    stepIndex: 6,
    cycleNumber: 6,
    phase: 'EXECUTE',
    pc: 2,
    ramActiveAddress: null,
    irBinary: '0010 0011',
    irAssembly: 'LOAD R2, 3',
    decoderSignal: 'LATCH 0011₂ → R2 | PC ← PC + 1',
    aluOp: 'LOAD IMM',
    aluInA: 3,
    aluInB: null,
    aluOut: 3,
    r1: 5,
    r2: 3,
    acc: 0,
    activeBuses: ['clock-pulse', 'decoder-to-reg', 'alu-to-reg'],
    activeBlocks: ['clock', 'registers', 'pc'],
    headlineTh: 'Cycle 6 [EXECUTE & PC++]: บันทึกเลข 3 ลง R2 และขยับ PC เป็น 0x02',
    explanationTh:
      'ค่า 0011₂ (3) ถูกล็อกเก็บไว้ใน R2 เรียบร้อย ขณะที่ R1 ยังคงล็อกค่า 5 ไว้อย่างเหนียวแน่น ส่วน Program Counter ขยับไปชี้คำสั่งถัดไปที่ 0x02',
    hardwareSwitchDetail: 'R1 = 0101₂ (5) | R2 ← 0011₂ (3) | PC: 0x01 → 0x02',
  },
  // --- Instruction 3: ADD R1, R2 ---
  {
    stepIndex: 7,
    cycleNumber: 7,
    phase: 'FETCH',
    pc: 2,
    ramActiveAddress: 2,
    irBinary: '0011 0000',
    irAssembly: 'ADD R1, R2',
    decoderSignal: 'FETCHING FROM 0x02',
    aluOp: 'IDLE',
    aluInA: null,
    aluInB: null,
    aluOut: null,
    r1: 5,
    r2: 3,
    acc: 0,
    activeBuses: ['clock-pulse', 'pc-to-ram', 'ram-to-ir'],
    activeBlocks: ['clock', 'pc', 'ram', 'decoder'],
    headlineTh: 'Cycle 7 [FETCH]: ดึงคำสั่งที่ 0x02 (ADD R1, R2)',
    explanationTh:
      'PC ส่งแอดเดรส 0x02 ไปอ่าน RAM ได้บิต 0011 0000 ไหลเข้ามาใน IR สังเกตว่าสำหรับฮาร์ดแวร์ มันยังเป็นแค่กลุ่มแรงดันไฟ สูง-ต่ำ 8 เส้นเท่านั้น',
    hardwareSwitchDetail: 'Address Bus = 0x02 → IR ← 0011_0000₂',
  },
  {
    stepIndex: 8,
    cycleNumber: 8,
    phase: 'DECODE',
    pc: 2,
    ramActiveAddress: 2,
    irBinary: '0011 0000',
    irAssembly: 'ADD R1, R2',
    decoderSignal: 'OP=0011 → ALU_SEL=ADD, SRC=R1,R2',
    aluOp: 'SELECT: 4-BIT ADDER',
    aluInA: 5,
    aluInB: 3,
    aluOut: null,
    r1: 5,
    r2: 3,
    acc: 0,
    activeBuses: ['clock-pulse', 'ir-to-decoder', 'decoder-to-alu', 'decoder-to-reg'],
    activeBlocks: ['clock', 'decoder', 'alu'],
    headlineTh: 'Cycle 8 [DECODE]: สับสวิตช์เลือกวงจรบวกใน ALU',
    explanationTh:
      'Decoder ถอดรหัส Opcode 0011 แล้วส่งสัญญาณควบคุมสีม่วงไปเปิดสวิตช์ 2 จุดพร้อมกัน: (1) เปิดทางให้ R1 และ R2 ไหลเข้าขา A/B ของ ALU และ (2) สับมัลติเพล็กเซอร์ใน ALU ไปยังวงจร 4-Bit Adder จาก Layer 3A',
    hardwareSwitchDetail: 'Opcode 0011 → [ALU_MODE = ADD, READ_R1 = 1, READ_R2 = 1]',
  },
  {
    stepIndex: 9,
    cycleNumber: 9,
    phase: 'EXECUTE',
    pc: 2,
    ramActiveAddress: null,
    irBinary: '0011 0000',
    irAssembly: 'ADD R1, R2',
    decoderSignal: 'ALU COMPUTING: 0101₂ + 0011₂',
    aluOp: 'ADD: 5 + 3 = 8',
    aluInA: 5,
    aluInB: 3,
    aluOut: 8,
    r1: 5,
    r2: 3,
    acc: 0,
    activeBuses: ['clock-pulse', 'reg-to-alu', 'decoder-to-alu'],
    activeBlocks: ['clock', 'registers', 'alu'],
    headlineTh: 'Cycle 9 [EXECUTE]: กระแสไฟวิ่งผ่านวงจร Adder ได้ผลลัพธ์ 1000₂ (8)',
    explanationTh:
      'แรงดันไฟของ R1 (0101₂ = 5) และ R2 (0011₂ = 3) ไหลเข้าเกต XOR และ AND ใน ALU เกิดสัญญาณ Carry ไหลข้ามหลัก 0 → 1 → 2 → 3 ในเสี้ยวนาโนวินาที ได้แรงดันเอาต์พุตเป็น 1000₂ (เลข 8) โดยไม่ต้องมี "สมอง" คิดเลยแม้แต่นิดเดียว',
    hardwareSwitchDetail: 'ALU Input A = 0101₂ (5), B = 0011₂ (3) → Adder Out = 1000₂ (8)',
  },
  {
    stepIndex: 10,
    cycleNumber: 10,
    phase: 'WRITEBACK',
    pc: 3,
    ramActiveAddress: null,
    irBinary: '0011 0000',
    irAssembly: 'ADD R1, R2',
    decoderSignal: 'WRITEBACK 1000₂ → ACC & R1 | PC → 0x03',
    aluOp: 'DONE (8)',
    aluInA: 5,
    aluInB: 3,
    aluOut: 8,
    r1: 8,
    r2: 3,
    acc: 8,
    activeBuses: ['clock-pulse', 'alu-to-reg'],
    activeBlocks: ['clock', 'alu', 'registers', 'pc'],
    headlineTh: 'Cycle 10 [WRITEBACK]: เก็บผลลัพธ์ 8 กลับสู่รีจิสเตอร์ และเลื่อน PC',
    explanationTh:
      'ผลลัพธ์ 1000₂ (8) จากขาออกของ ALU วิ่งกลับตามสายบัสเข้าสู่ Accumulator (ACC) และอัปเดตค่า R1 จาก 5 เป็น 8 พร้อมเลื่อน PC ไปที่ 0x03',
    hardwareSwitchDetail: 'ACC ← 1000₂ (8) | R1 ← 1000₂ (8) | PC: 0x02 → 0x03',
  },
  // --- Instruction 4: HALT ---
  {
    stepIndex: 11,
    cycleNumber: 11,
    phase: 'HALT',
    pc: 3,
    ramActiveAddress: 3,
    irBinary: '1111 0000',
    irAssembly: 'HALT',
    decoderSignal: 'OP=1111 → STOP CLOCK (PROGRAM COMPLETE)',
    aluOp: 'HALTED',
    aluInA: 5,
    aluInB: 3,
    aluOut: 8,
    r1: 8,
    r2: 3,
    acc: 8,
    activeBuses: ['pc-to-ram', 'ram-to-ir', 'ir-to-decoder'],
    activeBlocks: ['pc', 'ram', 'decoder', 'registers'],
    headlineTh: 'Cycle 11 [HALT]: จบโปรแกรมอย่างสมบูรณ์! (5 + 3 = 8)',
    explanationTh:
      'CPU อ่านคำสั่ง 1111 0000 (HALT) จาก 0x03 วงจร Decoder ปิดสวิตช์สัญญาณ Clock ลง ทั้งหมดที่คุณเห็นตั้งแต่บรรทัดแรกจนได้เลข 8 เกิดจากการเปิด-ปิดสวิตช์ MOSFET ต่อกันเป็นลูกโซ่ล้วน ๆ!',
    hardwareSwitchDetail: 'Opcode 1111 → CLOCK_ENABLE = 0 | Final Result: R1 = 8 (1000₂)',
  },
]
