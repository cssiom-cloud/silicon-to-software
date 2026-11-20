import { motion } from 'framer-motion'
import type { CausalChain } from '../../data/layers'
import { FirstPrinciplesFlow } from './FirstPrinciplesFlow'

interface LayerSectionProps {
  id: string
  code: string
  titleTh: string
  titleEn: string
  accent?: 'cyan' | 'purple'
  causalChain?: CausalChain
  children: React.ReactNode
}

export function LayerSection({
  id,
  code,
  titleTh,
  titleEn,
  accent = 'cyan',
  causalChain,
  children,
}: LayerSectionProps) {
  const accentColor = accent === 'purple' ? 'var(--signal-field)' : 'var(--signal-high)'
  const badgeBg =
    accent === 'purple' ? 'rgba(168, 85, 247, 0.14)' : 'rgba(6, 182, 212, 0.14)'

  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-[var(--border-subtle)] py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8"
      >
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center rounded-lg px-3 py-1 font-mono-tech text-xs font-bold tracking-wider"
              style={{ backgroundColor: badgeBg, color: accentColor }}
            >
              {code}
            </span>
            <span className="font-mono-tech text-xs font-medium text-[var(--text-muted)]">
              {titleEn}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            {titleTh}
          </h2>
        </div>

        {/* First-Principles Causal Chain */}
        {causalChain && <FirstPrinciplesFlow chain={causalChain} />}

        {/* Layer Main Content & Interactive Simulator */}
        <div className="space-y-8">{children}</div>
      </motion.div>
    </section>
  )
}
