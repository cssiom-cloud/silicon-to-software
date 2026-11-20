import { LAYER_CAUSAL_CHAINS } from '../../data/layers'
import { SiliconDopingSimulator } from '../simulators/SiliconDopingSimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

export function Layer0Section({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-0"
      code="LAYER 0"
      titleTh="ฟิสิกส์ของอะตอมและการโดปซิลิคอน"
      titleEn="Semiconductor Physics & Doping"
      accent="cyan"
      causalChain={LAYER_CAUSAL_CHAINS['layer-0']}
    >
      {/* Editorial Content Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
          <div className="font-mono-tech text-xs font-bold text-[var(--text-muted)]">
            01 / PURE SILICON (Si)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            พันธะโควาเลนต์ที่แน่นหนาเกินไป
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            ซิลิคอน (ได้จากการสกัดทรายควอตซ์ <span className="font-mono-tech">SiO₂</span>) อยู่หมู่ 4 มีเวเลนซ์อิเล็กตรอน 4 ตัว
            จึงจับมือสร้าง{' '}
            <TermButton termId="covalent-bond" onOpenGlossary={onOpenGlossary}>
              Covalent Bond
            </TermButton>{' '}
            กับเพื่อนบ้าน 4 ทิศครบ 8 ตัวพอดี อิเล็กตรอนทุกตัวถูกล็อกสนิท จึงแทบไม่นำไฟฟ้า
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-high)]">
            02 / N-TYPE (+PHOSPHORUS)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            เติมฟอสฟอรัส → อิเล็กตรอนอิสระเกิน
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            เมื่อทำ{' '}
            <TermButton termId="doping" onOpenGlossary={onOpenGlossary}>
              Doping
            </TermButton>{' '}
            ด้วยการแทรกอะตอมฟอสฟอรัส (<span className="font-mono-tech">P</span> หมู่ 5) เข้าไป อิเล็กตรอน 4 ตัวจับพันธะกับซิลิคอน
            ส่วน<strong>ตัวที่ 5 ไม่มีที่เกาะ</strong> จึงหลุดลอยเป็นอิเล็กตรอนอิสระ (<span className="font-mono-tech">e⁻</span>)
            พร้อมวิ่งทันทีเมื่อเจอแรงดันไฟ
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-field-bright)]">
            03 / P-TYPE (+BORON)
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            เติมโบรอน → สร้างหลุมประจุบวก (Hole)
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            หากเติมอะตอมโบรอน (<span className="font-mono-tech">B</span> หมู่ 3) ที่มีอิเล็กตรอนแค่ 3 ตัว จะเกิดช่องว่างขาดอิเล็กตรอน
            1 ตำแหน่งเรียกว่า <strong className="font-mono-tech text-[var(--signal-field-bright)]">Hole (h⁺)</strong>{' '}
            อิเล็กตรอนข้าง ๆ สามารถกระโดดเข้ามาเติมช่องว่างนี้เป็นทอด ๆ ทำให้ดูเหมือนประจุบวกเคลื่อนที่สวนทางไปได้
          </p>
        </div>
      </div>

      {/* Interactive Simulator */}
      <SiliconDopingSimulator />
    </LayerSection>
  )
}
