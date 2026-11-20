import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Box, Home, Layers, X } from 'lucide-react'
import { useEffect } from 'react'
import { LAYER_NAV_ITEMS } from '../../data/layers'

interface NavigationDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onNavigate: (sectionId: string) => void
  onOpenGlossary: (termId?: string) => void
}

export function NavigationDrawer({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
  onOpenGlossary,
}: NavigationDrawerProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative z-10 flex h-full w-full max-w-sm flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[var(--signal-high)]" />
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Abstraction Stack Map
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    เลือกกระโดดไปยังแต่ละชั้นได้ทันที
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="ปิดเมนู"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onNavigate('hero')
                  onClose()
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition cursor-pointer ${
                  activeSection === 'hero'
                    ? 'bg-[var(--bg-elevated)] font-semibold text-[var(--text-primary)] border border-[var(--border-strong)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/70 hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                <Home className="h-4 w-4 text-[var(--signal-high)]" />
                <span>หน้าแรก & แผนผังภาพรวม</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('lab-3d')
                  onClose()
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition cursor-pointer ${
                  activeSection === 'lab-3d'
                    ? 'bg-[var(--signal-high)]/15 font-semibold text-[var(--signal-high-bright)] border border-[var(--signal-high)]'
                    : 'bg-[var(--signal-high)]/8 text-[var(--text-primary)] hover:bg-[var(--signal-high)]/15 border border-[var(--signal-high)]/30'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Box className="h-4 w-4 text-[var(--signal-high-bright)]" />
                  <span className="font-semibold">ห้องทดลอง 3D Studio (หมุน 360°)</span>
                </span>
                <span className="rounded bg-[var(--signal-high)]/20 px-1.5 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--signal-high-bright)]">
                  NEW
                </span>
              </button>

              <div className="pt-2 pb-1 px-2">
                <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Layer 0 → Layer 5
                </span>
              </div>

              {LAYER_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                const accentColor =
                  item.accent === 'purple' ? 'var(--signal-field)' : 'var(--signal-high)'

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id)
                      onClose()
                    }}
                    className={`group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition cursor-pointer ${
                      isActive
                        ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)]'
                        : 'border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]/60'
                    }`}
                  >
                    <span
                      className="mt-0.5 inline-flex shrink-0 rounded-md px-1.5 py-0.5 font-mono-tech text-[10px] font-bold"
                      style={{
                        color: accentColor,
                        backgroundColor:
                          item.accent === 'purple'
                            ? 'rgba(168, 85, 247, 0.12)'
                            : 'rgba(6, 182, 212, 0.12)',
                      }}
                    >
                      {item.code.replace('LAYER ', 'L')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {item.shortTitle}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-1">
                        {item.titleEn}
                      </p>
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* Footer Glossary Shortcut */}
            <div className="border-t border-[var(--border-subtle)] p-4">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenGlossary()
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--signal-field)] cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="h-4.5 w-4.5 text-[var(--signal-field)]" />
                  <span>เปิดพจนานุกรมคำศัพท์เชิงลึก</span>
                </span>
                <span className="font-mono-tech text-xs text-[var(--text-muted)]">15 คำ</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
