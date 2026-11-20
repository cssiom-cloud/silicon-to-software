import { LAYER_CAUSAL_CHAINS } from '../../data/layers'
import { CmosGateSimulator } from '../simulators/CmosGateSimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

export function Layer2Section({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-2"
      code="LAYER 2"
      titleTh="ลอจิกเกต CMOS: เปลี่ยนแรงดันไฟฟ้าเป็นตรรกะ"
      titleEn="Complementary MOS & Boolean Logic Gates"
      accent="cyan"
      causalChain={LAYER_CAUSAL_CHAINS['layer-2']}
    >
      {/* Explanation Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-high)]">
            กฎดิจิทัล: VDD = 1, GND = 0
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            ทำไมต้องจับคู่ PMOS ด้านบน + NMOS ด้านล่าง (CMOS)?
          </h3>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            ในสถาปัตยกรรม{' '}
            <TermButton termId="cmos" onOpenGlossary={onOpenGlossary}>
              CMOS
            </TermButton>{' '}
            เราวาง PMOS เป็นเครือข่ายดึงขึ้น (<span className="font-mono-tech">Pull-Up → VDD</span>) และวาง NMOS
            เป็นเครือข่ายดึงลง (<span className="font-mono-tech">Pull-Down → GND</span>) ด้วยสัญญาณอินพุตชุดเดียวกัน
            เมื่อฝั่งบนเปิด ฝั่งล่างจะปิดสนิทเสมอ ทำให้ไม่มีกระแสลัดวงจรไหลทิ้งจาก VDD ลง GND ในภาวะนิ่ง —
            ชิปจึงไม่ร้อนจนละลาย!
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-field-bright)]">
            UNIVERSAL GATE PROPERTY
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            ทำไม NAND Gate ตัวเดียวสร้างได้ทุกวงจรในจักรวาล?
          </h3>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            <TermButton termId="universal-gate" onOpenGlossary={onOpenGlossary}>
              NAND Gate
            </TermButton>{' '}
            ใช้ทรานซิสเตอร์เพียง 4 ตัว (P1 ขนาน P2 ด้านบน, N1 อนุกรม N2 ด้านล่าง) โดยเอาต์พุตจะเป็น{' '}
            <span className="font-mono-tech">0</span> เฉพาะเมื่อ <span className="font-mono-tech">A=1</span> และ{' '}
            <span className="font-mono-tech">B=1</span> เท่านั้น จากพีชคณิตบูลีน เพียงแค่นำ NAND มาต่อซ้อนกันก็สร้าง
            NOT, AND, OR, XOR, วงจรบวกเลข, หน่วยความจำ ไปจนถึง CPU และ GPU ทั้งตัวได้ครบทุกอย่าง!
          </p>
        </div>
      </div>

      {/* Interactive CMOS Gate Simulator */}
      <CmosGateSimulator />
    </LayerSection>
  )
}
