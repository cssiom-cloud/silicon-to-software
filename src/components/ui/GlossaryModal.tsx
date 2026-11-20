import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Lightbulb, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GLOSSARY_LIST, GLOSSARY_TERMS } from '../../data/glossary'

interface GlossaryModalProps {
  isOpen: boolean
  activeTermId: string | null
  onSelectTerm: (termId: string) => void
  onClose: () => void
}

export function GlossaryModal({
  isOpen,
  activeTermId,
  onSelectTerm,
  onClose,
}: GlossaryModalProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GLOSSARY_LIST
    return GLOSSARY_LIST.filter(
      (item) =>
        item.termEn.toLowerCase().includes(q) ||
        item.termTh.toLowerCase().includes(q) ||
        item.layer.toLowerCase().includes(q)
    )
  }, [query])

  const selectedTerm =
    (activeTermId && GLOSSARY_TERMS[activeTermId]) ||
    filteredTerms[0] ||
    GLOSSARY_LIST[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="glossary-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--signal-field)]/15 text-[var(--signal-field)]">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2
                    id="glossary-modal-title"
                    className="text-base font-semibold text-[var(--text-primary)]"
                  >
                    พจนานุกรมคำศัพท์เชิงลึก (Technical Glossary)
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    คลิกเลือกคำศัพท์เพื่อเจาะลึกกลไกทางฟิสิกส์โดยไม่หลุดออกจากหน้าหลัก
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="ปิดหน้าต่างคำศัพท์"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body: Split List + Detail */}
            <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-12">
              {/* Left Sidebar Term Selector */}
              <div className="flex flex-col border-b border-[var(--border-subtle)] md:col-span-4 md:border-b-0 md:border-r">
                <div className="p-3 border-b border-[var(--border-subtle)]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="ค้นหา เช่น Doping, Tunneling..."
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--signal-field)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto p-3 max-h-36 md:max-h-[58vh]">
                  {filteredTerms.map((term) => {
                    const isSelected = term.id === selectedTerm?.id
                    return (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => onSelectTerm(term.id)}
                        className={`shrink-0 md:shrink md:w-full rounded-xl border px-3 py-2 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/10 text-[var(--text-primary)]'
                            : 'border-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs font-semibold truncate">
                            {term.termEn}
                          </span>
                          <span className="hidden md:inline font-mono-tech text-[10px] text-[var(--text-muted)] shrink-0">
                            {term.layer}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)] truncate">
                          {term.termTh}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Detail Panel */}
              {selectedTerm && (
                <div className="overflow-y-auto p-5 sm:p-6 md:col-span-8 space-y-5 max-h-[56vh] md:max-h-[64vh]">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-[var(--signal-high)]/15 px-2.5 py-1 font-mono-tech text-xs font-semibold text-[var(--signal-high)]">
                      {selectedTerm.layer}
                    </span>
                    <h3 className="mt-2.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {selectedTerm.termEn}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-[var(--text-secondary)]">
                      {selectedTerm.termTh}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                    <div className="font-mono-tech text-[11px] font-semibold uppercase tracking-wider text-[var(--signal-high)]">
                      นิยามสั้น (Summary)
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-primary)]">
                      {selectedTerm.shortDef}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      กลไกเชิงลึก (First-Principles Physics)
                    </h4>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {selectedTerm.deepExplanation}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--signal-field)]/30 bg-[var(--signal-field)]/8 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--signal-field-bright)]">
                      <Lightbulb className="h-4 w-4" />
                      <span>ภาพเปรียบเทียบให้เห็นภาพจริง (Mental Model)</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-primary)]">
                      {selectedTerm.physicalAnalogy}
                    </p>
                  </div>

                  {selectedTerm.relatedIds.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-medium text-[var(--text-muted)] mb-2">
                        คำศัพท์ที่เชื่อมโยงกัน:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.relatedIds.map((relId) => {
                          const rel = GLOSSARY_TERMS[relId]
                          if (!rel) return null
                          return (
                            <button
                              key={relId}
                              type="button"
                              onClick={() => onSelectTerm(relId)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--signal-high)] hover:text-[var(--signal-high)] cursor-pointer"
                            >
                              <span className="font-mono-tech">{rel.termEn}</span>
                              <span className="text-[var(--text-muted)]">({rel.layer})</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
