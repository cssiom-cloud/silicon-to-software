import { LAYER_CAUSAL_CHAINS, MEMORY_COMPARISON_ROWS } from '../../data/layers'
import { MemorySimulator } from '../simulators/MemorySimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

export function Layer3BSection({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-3b"
      code="LAYER 3B"
      titleTh="วงจรความจำ: SRAM vs DRAM vs NAND Flash"
      titleEn="Memory Architecture: Feedback Loop, Capacitor & Quantum Trap"
      accent="purple"
      causalChain={LAYER_CAUSAL_CHAINS['layer-3b']}
    >
      {/* Intro Prose */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
          ทำไมคอมพิวเตอร์ถึงต้องมีหน่วยความจำถึง 3 แบบ แทนที่จะใช้แบบเดียวทั้งหมด?
        </h3>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          คำตอบอยู่ที่ข้อจำกัดทางฟิสิกส์ของ <strong className="text-[var(--text-primary)]">ความเร็ว vs ขนาด vs ความคงทนตอนตัดไฟ</strong>:
          <strong className="text-[var(--signal-high-bright)]"> SRAM</strong> ใช้ NOT Gate ต่อวนลูปจึงเร็วสุดขีดแต่แพงมาก (ทำ CPU Cache),
          <strong className="text-[var(--text-primary)]"> DRAM</strong> ย่อเหลือ 1 ทรานซิสเตอร์ + 1 ตัวเก็บประจุ จึงราคาถูกพอทำ RAM หลายสิบ GB แต่ต้องสู้กับ{' '}
          <TermButton termId="capacitance-leakage" onOpenGlossary={onOpenGlossary}>
            Charge Leakage & Refresh
          </TermButton>{' '}
          ส่วน <strong className="text-[var(--signal-field-bright)]">NAND Flash (SSD)</strong> ใช้ปรากฏการณ์{' '}
          <TermButton termId="quantum-tunneling" onOpenGlossary={onOpenGlossary}>
            Quantum Tunneling
          </TermButton>{' '}
          ยิงอิเล็กตรอนเข้าไปขังใน{' '}
          <TermButton termId="floating-gate" onOpenGlossary={onOpenGlossary}>
            Floating Gate
          </TermButton>{' '}
          ทำให้เก็บข้อมูลข้ามปีได้แม้ถอดปลั๊ก!
        </p>
      </div>

      {/* Interactive 3-Tab Memory Simulator */}
      <MemorySimulator />

      {/* Detailed Comparison Matrix */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-3.5">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            ตารางเปรียบเทียบเชิงวิศวกรรม: SRAM vs DRAM vs NAND Flash
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/65 text-[var(--text-muted)]">
                <th className="px-4 py-3 font-semibold">มิติเปรียบเทียบ</th>
                <th className="px-4 py-3 font-mono-tech font-bold text-[var(--signal-high-bright)]">
                  SRAM (Cache)
                </th>
                <th className="px-4 py-3 font-mono-tech font-bold text-[var(--text-primary)]">
                  DRAM (Main RAM)
                </th>
                <th className="px-4 py-3 font-mono-tech font-bold text-[var(--signal-field-bright)]">
                  NAND Flash (SSD)
                </th>
              </tr>
            </thead>
            <tbody>
              {MEMORY_COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.metric}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 text-[var(--text-secondary)]"
                >
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">
                    {row.metric}
                  </td>
                  <td className="px-4 py-3">{row.sram}</td>
                  <td className="px-4 py-3">{row.dram}</td>
                  <td className="px-4 py-3">{row.nand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayerSection>
  )
}
