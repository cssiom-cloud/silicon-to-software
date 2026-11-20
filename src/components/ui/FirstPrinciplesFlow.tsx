import { ArrowRight, Cpu, Layers, Sparkles } from 'lucide-react'
import type { CausalChain } from '../../data/layers'

interface FirstPrinciplesFlowProps {
  chain: CausalChain
}

export function FirstPrinciplesFlow({ chain }: FirstPrinciplesFlowProps) {
  const steps = [
    {
      index: '01',
      label: chain.inputLabel,
      detail: chain.inputDetail,
      accent: 'var(--signal-low)',
      badgeBg: 'rgba(113, 113, 122, 0.14)',
      badgeText: 'var(--text-secondary)',
      Icon: Layers,
    },
    {
      index: '02',
      label: chain.mechanismLabel,
      detail: chain.mechanismDetail,
      accent: 'var(--signal-field)',
      badgeBg: 'rgba(168, 85, 247, 0.14)',
      badgeText: 'var(--signal-field-bright)',
      Icon: Sparkles,
    },
    {
      index: '03',
      label: chain.outputLabel,
      detail: chain.outputDetail,
      accent: 'var(--signal-high)',
      badgeBg: 'rgba(6, 182, 212, 0.14)',
      badgeText: 'var(--signal-high-bright)',
      Icon: Cpu,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {steps.map((step, idx) => {
        const Icon = step.Icon
        return (
          <div
            key={step.index}
            className="relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: step.badgeBg, color: step.badgeText }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{step.label}</span>
                </span>
                <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">
                  {step.index}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.detail}
              </p>
            </div>

            {idx < 2 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-muted)]">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
