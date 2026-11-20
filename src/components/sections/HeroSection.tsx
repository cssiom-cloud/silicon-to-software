import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, BookOpen, Box, Layers } from 'lucide-react'
import { LAYER_NAV_ITEMS } from '../../data/layers'

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
  onOpenGlossary: (termId?: string) => void
}

export function HeroSection({ onNavigate, onOpenGlossary }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-10 sm:py-18 lg:py-22"
    >
      {/* Subtle architectural radial glow — clean, restrained, no cliché grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--signal-high) 0%, var(--signal-field) 60%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial Thesis */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            <div className="font-mono-tech text-xs font-semibold uppercase tracking-[0.18em] text-[var(--signal-high)]">
              FIRST-PRINCIPLES INTERACTIVE 3D TEXTBOOK
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.18]">
              จากทรายซิลิคอนสู่โค้ดโปรแกรม:
              <span className="block mt-2 text-[var(--text-secondary)] font-semibold text-xl sm:text-3xl lg:text-[2rem]">
                กลไกการทำงานของไมโครชิปและหน่วยความจำ
              </span>
            </h1>

            <blockquote className="border-l-2 border-[var(--signal-high)] pl-4 py-1 text-base sm:text-lg font-medium leading-relaxed text-[var(--text-primary)]">
              “คอมพิวเตอร์ไม่มีสมอง ไม่มีความคิด และไม่เข้าใจภาษาคน —
              มันมีแค่สวิตช์ไฟฟ้าขนาดนาโนเมตรหลายหมื่นล้านตัวที่ต่อกันเป็นลูกโซ่”
            </blockquote>

            <p className="text-sm sm:text-base leading-7 text-[var(--text-secondary)]">
              บทเรียนเชิงโต้ตอบนี้จะแกะทุก <strong className="text-[var(--text-primary)]">“กล่องดำ”</strong>{' '}
              ออกทีละชั้น ตั้งแต่ฟิสิกส์ของอะตอมซิลิคอน (<span className="font-mono-tech">Layer 0</span>)
              ไปจนถึงวงจร CPU และหน่วยความจำ SRAM, DRAM, NAND Flash (<span className="font-mono-tech">Layer 5</span>)
              พร้อม <strong className="text-[var(--text-primary)]">3D Studio ที่หมุน 360° และปรับแต่งได้จริง</strong> ทั้งบนมือถือและคอมพิวเตอร์
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <button
                id="hero-3d-btn"
                type="button"
                onClick={() => onNavigate('lab-3d')}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--signal-high)] px-5 py-3 text-sm font-bold text-zinc-950 transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
              >
                <Box className="h-4 w-4" />
                <span>เปิดห้องทดลอง 3D (หมุนได้)</span>
              </button>

              <button
                id="hero-start-btn"
                type="button"
                onClick={() => onNavigate('layer-0')}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--signal-high)] cursor-pointer"
              >
                <span>เริ่มเรียน Layer 0</span>
                <ArrowDown className="h-4 w-4 text-[var(--signal-high)]" />
              </button>

              <button
                id="hero-summary-btn"
                type="button"
                onClick={() => onNavigate('layer-5')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-transparent px-3.5 py-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--signal-high)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <Layers className="h-4 w-4 text-[var(--signal-high)]" />
                <span>ตารางสรุปรวม</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenGlossary('doping')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-transparent px-3.5 py-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--signal-field)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-[var(--signal-field)]" />
                <span>คำศัพท์เทคนิค</span>
              </button>
            </div>

            {/* Technical Signal Color Legend */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#06B6D4]" />
                <span>
                  <strong className="font-mono-tech text-[var(--text-primary)]">1 (HIGH)</strong> / กระแสไฟไหล
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#A855F7]" />
                <span>
                  <strong className="font-mono-tech text-[var(--text-primary)]">E-Field</strong> / สัญญาณควบคุม / Quantum
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#52525B]" />
                <span>
                  <strong className="font-mono-tech text-[var(--text-primary)]">0 (LOW)</strong> / สถานะปิด
                </span>
              </span>
            </div>
          </motion.div>

          {/* Right Interactive Abstraction Stack (Layer 0 -> Layer 5) */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">
                    Abstraction Stack Map (Layer 0 → Layer 5)
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    คลิกเลือกชั้นใดก็ได้เพื่อกระโดดไปยังบทเรียนและ Simulator ทันที
                  </p>
                </div>
                <span className="rounded-lg bg-[var(--bg-elevated)] px-2.5 py-1 font-mono-tech text-[11px] font-semibold text-[var(--signal-high)]">
                  6 Simulators
                </span>
              </div>

              <div className="relative space-y-2">
                {LAYER_NAV_ITEMS.map((layer, index) => {
                  const accentColor =
                    layer.accent === 'purple'
                      ? 'var(--signal-field)'
                      : 'var(--signal-high)'
                  const badgeBg =
                    layer.accent === 'purple'
                      ? 'rgba(168, 85, 247, 0.14)'
                      : 'rgba(6, 182, 212, 0.14)'

                  return (
                    <motion.button
                      key={layer.id}
                      id={`hero-stack-${layer.id}`}
                      type="button"
                      onClick={() => onNavigate(layer.id)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      className="group flex w-full items-center gap-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-left transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className="inline-flex w-16 justify-center rounded-md py-1 font-mono-tech text-[10px] font-bold"
                          style={{ backgroundColor: badgeBg, color: accentColor }}
                        >
                          {layer.code}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                            {layer.shortTitle}
                          </span>
                          <span className="hidden sm:inline font-mono-tech text-[10px] text-[var(--text-muted)] truncate">
                            — {layer.titleEn}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-1">
                          {layer.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[var(--text-muted)] transition group-hover:text-[var(--signal-high)]">
                        <span className="font-mono-tech text-[10px] hidden sm:inline">
                          0{index}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
