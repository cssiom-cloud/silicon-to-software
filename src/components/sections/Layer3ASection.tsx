import { LAYER_CAUSAL_CHAINS } from '../../data/layers'
import { BinaryAdderSimulator } from '../simulators/BinaryAdderSimulator'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface LayerSectionSharedProps {
  onOpenGlossary: (termId: string) => void
}

const ONE_BIT_ADD_TABLE = [
  { a: 0, b: 0, sum: 0, carry: 0, desc: '0 + 0 = 00₂' },
  { a: 0, b: 1, sum: 1, carry: 0, desc: '0 + 1 = 01₂' },
  { a: 1, b: 0, sum: 1, carry: 0, desc: '1 + 0 = 01₂' },
  { a: 1, b: 1, sum: 0, carry: 1, desc: '1 + 1 = 10₂ (ใส่ 0 ทด 1)' },
]

export function Layer3ASection({ onOpenGlossary }: LayerSectionSharedProps) {
  return (
    <LayerSection
      id="layer-3a"
      code="LAYER 3A"
      titleTh="วงจรคำนวณ: จาก Half Adder สู่ 4-Bit Adder และ ALU"
      titleEn="Combinational Logic → Binary Addition & ALU"
      accent="cyan"
      causalChain={LAYER_CAUSAL_CHAINS['layer-3a']}
    >
      {/* 1-Bit Addition Discovery + Scaling to ALU */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* 1-Bit Binary Addition Truth Table */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden lg:col-span-6">
          <div className="border-b border-[var(--border-subtle)] px-5 py-3.5">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              ตารางบวกเลขฐานสอง 1 บิต (Half Adder Discovery)
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              สังเกตคอลัมน์ Sum และ Carry — มันตรงกับตารางความจริงของ XOR และ AND เป๊ะ 100%!
            </p>
          </div>
          <table className="w-full text-left font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-[var(--text-muted)]">
                <th className="px-4 py-2.5">A</th>
                <th className="px-4 py-2.5">B</th>
                <th className="px-4 py-2.5 text-[var(--signal-high-bright)]">Sum (XOR)</th>
                <th className="px-4 py-2.5 text-[var(--signal-field-bright)]">Carry (AND)</th>
                <th className="px-4 py-2.5 font-sans">ความหมาย</th>
              </tr>
            </thead>
            <tbody>
              {ONE_BIT_ADD_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 text-[var(--text-secondary)]"
                >
                  <td className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{row.a}</td>
                  <td className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{row.b}</td>
                  <td
                    className="px-4 py-2.5 font-bold"
                    style={{
                      color: row.sum === 1 ? 'var(--signal-high-bright)' : 'var(--text-muted)',
                    }}
                  >
                    {row.sum}
                  </td>
                  <td
                    className="px-4 py-2.5 font-bold"
                    style={{
                      color: row.carry === 1 ? 'var(--signal-field-bright)' : 'var(--text-muted)',
                    }}
                  >
                    {row.carry}
                  </td>
                  <td className="px-4 py-2.5 font-sans text-[11px]">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scaling to 4-Bit Adder & ALU */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:col-span-6 space-y-3">
          <div className="font-mono-tech text-xs font-bold text-[var(--signal-high)]">
            HALF ADDER → FULL ADDER → ALU
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            คณิตศาสตร์ที่แท้จริงในชิปคือ “การไหลของไฟผ่านเกต XOR กับ AND”
          </h3>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            เมื่อเรารู้ว่าหลักหน่วย (<span className="font-mono-tech">Sum</span>) คือ{' '}
            <strong className="font-mono-tech text-[var(--signal-high-bright)]">A ⊕ B (XOR)</strong> และตัวทด (
            <span className="font-mono-tech">Carry</span>) คือ{' '}
            <strong className="font-mono-tech text-[var(--signal-field-bright)]">A · B (AND)</strong> เราก็แค่นำวงจร
            Half Adder สองชุดมารวมกับ OR Gate เพื่อให้รับตัวทดจากหลักก่อนหน้า (<span className="font-mono-tech">C_in</span>)
            ได้ เรียกว่า <strong>Full Adder</strong>
          </p>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            จากนั้นนำ Full Adder มาเรียงต่อกัน 4 ตัว (หรือ 64 ตัวใน CPU ยุคใหม่) ให้ขาตัวทดไหลต่อกันเป็นลูกคลื่น (Ripple-Carry)
            แล้วรวมเข้ากับวงจรลบ, เลื่อนบิต และเปรียบเทียบ จนกลายเป็น{' '}
            <TermButton termId="alu" onOpenGlossary={onOpenGlossary}>
              ALU (Arithmetic Logic Unit)
            </TermButton>
          </p>
        </div>
      </div>

      {/* Interactive 4-Bit Binary Adder */}
      <BinaryAdderSimulator />
    </LayerSection>
  )
}
