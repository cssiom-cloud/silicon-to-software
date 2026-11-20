import { ArrowUp, ArrowUpRight, Cpu, Sparkles } from 'lucide-react'
import { SUMMARY_TABLE_ROWS } from '../../data/layers'
import { LayerSection } from '../ui/LayerSection'
import { TermButton } from '../ui/TermButton'

interface Layer5SectionProps {
  onNavigate: (sectionId: string) => void
  onOpenGlossary: (termId: string) => void
}

export function Layer5Section({ onNavigate, onOpenGlossary }: Layer5SectionProps) {
  return (
    <LayerSection
      id="layer-5"
      code="LAYER 5"
      titleTh="ตารางสรุปห่วงโซ่เหตุ-ผลทั้งหมด (Full Abstraction Stack)"
      titleEn="Zero Black Boxes: Complete Causal Chain & Photolithography"
      accent="cyan"
    >
      {/* Full 6-Layer Causal Summary Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="border-b border-[var(--border-subtle)] px-5 py-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              ห่วงโซ่เหตุและผลครบทั้ง 6 ชั้น (Layer 0 → Layer 4)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              คลิกที่แถวใดก็ได้เพื่อย้อนกลับไปทดลอง Simulator ของชั้นนั้นอีกครั้ง
            </p>
          </div>
          <span className="rounded-lg bg-[var(--signal-high)]/15 px-3 py-1 font-mono-tech text-xs font-bold text-[var(--signal-high-bright)]">
            NO BLACK BOXES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/75 text-[var(--text-muted)]">
                <th className="px-4 py-3.5 font-semibold w-48">ชั้น (Layer)</th>
                <th className="px-4 py-3.5 font-semibold">เริ่มจากอะไร (Input)</th>
                <th className="px-4 py-3.5 font-semibold">กลไกหลักทางฟิสิกส์ / ตรรกะ</th>
                <th className="px-4 py-3.5 font-semibold">ผลลัพธ์ส่งต่อให้ชั้นถัดไป (Output)</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY_TABLE_ROWS.map((row) => (
                <tr
                  key={row.layerId}
                  onClick={() => onNavigate(row.layerId)}
                  className="group border-b border-[var(--border-subtle)] last:border-b-0 transition hover:bg-[var(--bg-elevated)]/65 cursor-pointer"
                >
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-tech text-xs font-bold text-[var(--signal-high-bright)]">
                        {row.layerBadge}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] opacity-0 transition group-hover:opacity-100 group-hover:text-[var(--signal-high)]" />
                    </div>
                    <div className="mt-1 font-semibold text-[var(--text-primary)]">
                      {row.layerNameTh}
                    </div>
                    <div className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                      {row.layerNameEn}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top leading-relaxed text-[var(--text-secondary)]">
                    {row.startsFrom}
                  </td>
                  <td className="px-4 py-4 align-top leading-relaxed text-[var(--text-primary)] font-medium">
                    {row.coreMechanism}
                  </td>
                  <td className="px-4 py-4 align-top leading-relaxed text-[var(--text-secondary)]">
                    {row.handsOffToNext}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Epilogue: Why Silicon & Photolithography Changed Engineering Forever */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--signal-field-bright)]">
              EPILOGUE / บทส่งท้าย
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              ทำไม “ซิลิคอน” และ “การพิมพ์ด้วยแสง (Photolithography)” ถึงพลิกวิศวกรรมโลก?
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 text-sm leading-7 text-[var(--text-secondary)]">
          <p>
            หากคุณต้องบัดกรีทรานซิสเตอร์ทีละตัวด้วยมือเพื่อสร้าง CPU ยุคใหม่ที่มีทรานซิสเตอร์{' '}
            <strong className="font-mono-tech text-[var(--text-primary)]">50,000,000,000 ตัว</strong>{' '}
            ต่อให้บัดกรีวินาทีละ 1 ตัวโดยไม่นอน คุณต้องใช้เวลานานกว่า{' '}
            <strong className="text-[var(--text-primary)]">1,580 ปี</strong> และตัวเครื่องจะใหญ่เท่าเมืองทั้งเมือง!
            แต่เพราะซิลิคอนมีสมบัติมหัศจรรย์ 2 อย่างพร้อมกัน: หาได้มหาศาลจากทราย และเมื่ออบกับออกซิเจนจะสร้างชั้นฉนวน{' '}
            <span className="font-mono-tech text-[var(--signal-field-bright)]">SiO₂</span> ที่เรียบเนียนระดับอะตอมได้เอง
          </p>
          <p>
            เมื่อนำซิลิคอนมารวมกับ{' '}
            <TermButton termId="photolithography" onOpenGlossary={onOpenGlossary}>
              EUV Photolithography
            </TermButton>{' '}
            มนุษย์จึงสามารถ “ฉายแสงพิมพ์วงจรทั้งเมือง” ลงบนแผ่นเวเฟอร์ได้พร้อมกันในคราวเดียว เหมือนการอัดภาพถ่าย
            ยิ่งย่อขนาดทรานซิสเตอร์ให้เล็กลงถึงระดับ 2–3 นาโนเมตร สวิตช์ก็ยิ่งเปิด-ปิดเร็วขึ้น กินไฟน้อยลง และราคาต่อทรานซิสเตอร์ถูกลงนับพันล้านเท่า —
            จนทรายธรรมดาใต้เท้าเรากลายมาเป็นสมาร์ทโฟน อินเทอร์เน็ต และปัญญาประดิษฐ์ในวันนี้
          </p>
        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
          <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
            <Cpu className="h-4 w-4 text-[var(--signal-high)]" />
            <span>
              Silicon to Software — Interactive First-Principles Learning Experience
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--signal-high)] cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5 text-[var(--signal-high)]" />
            <span>กลับขึ้นด้านบนสุด</span>
          </button>
        </div>
      </div>
    </LayerSection>
  )
}
