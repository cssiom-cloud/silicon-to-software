import { motion, useScroll, useSpring } from 'framer-motion'
import { BookOpen, Box, Cpu, Menu, Moon, Sun } from 'lucide-react'
import { LAYER_NAV_ITEMS } from '../../data/layers'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onOpenDrawer: () => void
  onOpenGlossary: (termId?: string) => void
  onNavigate: (sectionId: string) => void
  activeSection: string
}

export function Navbar({
  theme,
  onToggleTheme,
  onOpenDrawer,
  onOpenGlossary,
  onNavigate,
  activeSection,
}: NavbarProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  })

  const currentLayer = LAYER_NAV_ITEMS.find((item) => item.id === activeSection)
  const is3DActive = activeSection === 'lab-3d'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-15 sm:h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left: Drawer Button + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            id="nav-drawer-toggle"
            type="button"
            onClick={onOpenDrawer}
            aria-label="เปิดเมนูนำทาง Layer 0 ถึง Layer 5"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition hover:border-[var(--signal-high)] hover:text-[var(--signal-high)] active:scale-95 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a
            href="#hero"
            className="group flex items-center gap-2 min-w-0 focus:outline-none"
          >
            <div className="hidden xs:flex sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--signal-high)] transition group-hover:border-[var(--signal-high)]">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-[var(--text-primary)] truncate">
                Silicon to Software
              </span>
              <span className="font-mono-tech text-[10px] sm:text-[11px] text-[var(--text-muted)]">
                3D Lab • Layer 0–5
              </span>
            </div>
          </a>
        </div>

        {/* Center: Active Layer Indicator (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: is3DActive
                ? 'var(--signal-high-bright)'
                : currentLayer?.accent === 'purple'
                  ? 'var(--signal-field)'
                  : 'var(--signal-high)',
            }}
          />
          <span className="font-mono-tech font-semibold text-[var(--text-secondary)]">
            {is3DActive ? '3D LAB' : currentLayer ? currentLayer.code : 'OVERVIEW'}
          </span>
          <span className="text-[var(--border-strong)]">/</span>
          <span className="font-medium text-[var(--text-primary)]">
            {is3DActive
              ? 'ห้องทดลองไมโครชิป 3 มิติ'
              : currentLayer
                ? currentLayer.shortTitle
                : 'ภาพรวมสถาปัตยกรรมชิป'}
          </span>
        </div>

        {/* Right: 3D Lab + Glossary + Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="nav-3d-btn"
            type="button"
            onClick={() => onNavigate('lab-3d')}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 font-mono-tech text-xs font-bold transition active:scale-95 cursor-pointer ${
              is3DActive
                ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/18 text-[var(--signal-high-bright)]'
                : 'border-[var(--signal-high)]/50 bg-[var(--bg-surface)] text-[var(--signal-high-bright)] hover:border-[var(--signal-high)]'
            }`}
          >
            <Box className="h-4 w-4" />
            <span>3D</span>
          </button>

          <button
            id="nav-glossary-btn"
            type="button"
            onClick={() => onOpenGlossary()}
            aria-label="เปิดพจนานุกรมคำศัพท์เทคนิค"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 sm:px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--signal-field)] hover:text-[var(--text-primary)] active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-[var(--signal-field)]" />
            <span className="hidden md:inline">พจนานุกรมศัพท์</span>
          </button>

          <button
            id="nav-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'สลับเป็น Light Mode' : 'สลับเป็น Dark Mode'}
            title={theme === 'dark' ? 'สลับเป็น Clean Light Mode' : 'สลับเป็น Dark Mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition hover:border-[var(--signal-high)] hover:text-[var(--signal-high)] active:scale-95 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="relative h-[2.5px] w-full bg-[var(--border-subtle)]/60">
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX,
            background:
              'linear-gradient(90deg, var(--signal-high) 0%, var(--signal-field) 100%)',
          }}
        />
      </div>
    </header>
  )
}
