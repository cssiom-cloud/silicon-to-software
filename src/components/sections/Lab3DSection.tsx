import { motion } from 'framer-motion'
import { Silicon3DStudio } from '../simulators/Silicon3DStudio'

interface Lab3DSectionProps {
  theme: 'dark' | 'light'
  onNavigateLayer: (layerId: string) => void
}

export function Lab3DSection({ theme, onNavigateLayer }: Lab3DSectionProps) {
  return (
    <section
      id="lab-3d"
      className="scroll-mt-20 border-t border-[var(--border-subtle)] py-12 sm:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center rounded-lg bg-[var(--signal-high)]/15 px-3 py-1 font-mono-tech text-xs font-bold tracking-wider text-[var(--signal-high-bright)]">
              3D INTERACTIVE LAB
            </span>
            <span className="font-mono-tech text-xs font-medium text-[var(--text-muted)]">
              Real-Time WebGL • Touch & Mouse 360°
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            ห้องทดลองไมโครชิป 3 มิติ: หมุน แยกชั้น และปรับแต่งได้อิสระ
          </h2>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            สำรวจโครงสร้างจริงของ <strong className="text-[var(--text-primary)]">MOSFET, ผลึกซิลิคอน 3×3×3, NAND Flash Floating Gate และชิป CPU Die</strong>{' '}
            แบบ 3 มิติเต็มรูปแบบ — เลื่อนปรับแรงดันไฟ ดึงแยกชั้น (Exploded View) สลับโหมด X-Ray / Wireframe เปลี่ยนโทนสี และแตะชิ้นส่วนใดก็ได้เพื่อดูคำอธิบาย
          </p>
        </div>

        <Silicon3DStudio theme={theme} onNavigateLayer={onNavigateLayer} />
      </motion.div>
    </section>
  )
}
