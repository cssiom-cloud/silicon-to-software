import { LAYER_CAUSAL_CHAINS } from '../../data/layers'
import { CpuCycleSimulator } from '../simulators/CpuCycleSimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

export function Layer4Section({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-4"
      code="LAYER 4"
      titleTh="นาฬิกาและวงจร CPU: Fetch → Decode → Execute"
      titleEn="Clock-Driven Instruction Cycle & Control Path"
      accent="purple"
      causalChain={LAYER_CAUSAL_CHAINS['layer-4']}
    >
      {/* 3-Step Cycle Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-high-bright)]">
            STEP 1 / FETCH (ดึงคำสั่ง)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Clock ขยับ PC ไปปลุกแถวบิตใน RAM
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            ไม่มี “คนสั่งงาน” อยู่ใน CPU มีแค่คลื่น{' '}
            <TermButton termId="clock-cycle" onOpenGlossary={onOpenGlossary}>
              Clock Cycle
            </TermButton>{' '}
            ที่กระตุ้นให้{' '}
            <TermButton termId="program-counter" onOpenGlossary={onOpenGlossary}>
              Program Counter (PC)
            </TermButton>{' '}
            ส่งแอดเดรสไปดึงบิตคำสั่งจาก RAM เข้ามาพักใน Instruction Register
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-field-bright)]">
            STEP 2 / DECODE (ถอดรหัสสวิตช์)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Opcode แปลงเป็นสายไฟสับสวิตช์
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            4 บิตหน้าของคำสั่งไหลเข้า{' '}
            <TermButton termId="opcode-decoder" onOpenGlossary={onOpenGlossary}>
              Instruction Decoder
            </TermButton>{' '}
            ซึ่งเป็นเพียงลอจิกเกต AND/NOT ธรรมดา ลวดลายบิตจะดันสายควบคุมสีม่วงให้เปิดทางไฟของรีจิสเตอร์และเลือกโหมดใน ALU อัตโนมัติ
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
          <div className="font-mono-tech text-xs font-bold text-emerald-400">
            STEP 3 / EXECUTE & PC++ (คำนวณ)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            ข้อมูลไหลผ่าน ALU แล้ววนรอบใหม่
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            แรงดันจากรีจิสเตอร์ R1, R2 ไหลผ่านวงจรบวกใน{' '}
            <TermButton termId="alu" onOpenGlossary={onOpenGlossary}>
              ALU
            </TermButton>{' '}
            ได้ผลลัพธ์กลับไปล็อกในรีจิสเตอร์ แล้ว PC บวกเพิ่มทีละ 1 เพื่อดึงคำสั่งบรรทัดต่อไป ทำซ้ำแบบนี้ 3–5 พันล้านรอบต่อวินาที!
          </p>
        </div>
      </div>

      {/* Interactive Mini 4-Step CPU Simulator */}
      <CpuCycleSimulator />
    </LayerSection>
  )
}
