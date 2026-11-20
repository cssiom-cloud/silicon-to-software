import { LAYER_CAUSAL_CHAINS } from '../../data/layers'
import { MosfetSimulator } from '../simulators/MosfetSimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

export function Layer1Section({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-1"
      code="LAYER 1"
      titleTh="ทรานซิสเตอร์ MOSFET: สวิตช์ที่คุมด้วยสนามไฟฟ้า"
      titleEn="Metal-Oxide-Semiconductor Field-Effect Transistor"
      accent="purple"
      causalChain={LAYER_CAUSAL_CHAINS['layer-1']}
    >
      {/* Core Physics + NMOS vs PMOS */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:col-span-7 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            เปิด-ปิดสวิตช์ได้พันล้านครั้งต่อวินาที โดยไม่มีชิ้นส่วนขยับเลยแม้แต่นิดเดียว
          </h3>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            สวิตช์ไฟตามบ้านต้องใช้นิ้วกดแผ่นทองแดงมาแตะกัน แต่ในไมโครชิปเราใช้{' '}
            <strong className="text-[var(--text-primary)]">MOSFET</strong> ซึ่งวางขั้ว{' '}
            <span className="font-mono-tech text-[var(--signal-high)]">Source</span> และ{' '}
            <span className="font-mono-tech text-[var(--signal-high)]">Drain</span> (ชนิด N⁺) ไว้บนฐานชนิด P
            โดยปกติมีฐาน P กั้นกลางทำให้อิเล็กตรอนข้ามไม่ได้ แต่เหนือช่องว่างนั้นมีขั้ว{' '}
            <span className="font-mono-tech text-[var(--signal-field-bright)]">Gate</span> ที่คั่นด้วย{' '}
            <TermButton termId="oxide-insulator" onOpenGlossary={onOpenGlossary}>
              Oxide Insulator (SiO₂)
            </TermButton>
          </p>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            เมื่อจ่ายแรงดันที่ Gate เกิน{' '}
            <TermButton termId="threshold-voltage" onOpenGlossary={onOpenGlossary}>
              Threshold Voltage (Vth)
            </TermButton>{' '}
            สนามไฟฟ้าจะทะลุชั้นฉนวนลงไปดูดอิเล็กตรอนขึ้นมาเกาะใต้ผิวออกไซด์ กลายเป็นสะพาน{' '}
            <TermButton termId="inversion-channel" onOpenGlossary={onOpenGlossary}>
              Inversion Channel
            </TermButton>{' '}
            เชื่อม Source กับ Drain ให้กระแสไหลผ่านได้ทันที!
          </p>
        </div>

        {/* NMOS vs PMOS Compact Comparison */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            ความต่างของสวิตช์คู่หู: NMOS vs PMOS
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--signal-high)]/35 bg-[var(--signal-high)]/8 p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs font-bold text-[var(--signal-high-bright)]">
                  NMOS (N-Channel)
                </span>
                <span className="font-mono-tech text-[11px] text-[var(--text-primary)]">
                  Gate = 1 → ON
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                ขั้ว N⁺ บนฐาน P — เปิดนำกระแสเมื่อจ่ายไฟ <strong>สูง (HIGH / 1)</strong> ที่ขา Gate
                เก่งเรื่องดึงสัญญาณลงกราวด์ (<span className="font-mono-tech">GND = 0</span>)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--signal-field)]/35 bg-[var(--signal-field)]/8 p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs font-bold text-[var(--signal-field-bright)]">
                  PMOS (P-Channel)
                </span>
                <span className="font-mono-tech text-[11px] text-[var(--text-primary)]">
                  Gate = 0 → ON
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                ขั้ว P⁺ บนฐาน N — เปิดนำกระแสเมื่อจ่ายไฟ <strong>ต่ำ (LOW / 0)</strong> ที่ขา Gate
                เก่งเรื่องดึงสัญญาณขึ้นไฟบวก (<span className="font-mono-tech">VDD = 1</span>)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive MOSFET Simulator */}
      <MosfetSimulator />
    </LayerSection>
  )
}
