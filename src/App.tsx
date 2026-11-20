import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { NavigationDrawer } from './components/layout/NavigationDrawer'
import { HeroSection } from './components/sections/HeroSection'
import { Lab3DSection } from './components/sections/Lab3DSection'
import { Layer0Section } from './components/sections/Layer0Section'
import { Layer1Section } from './components/sections/Layer1Section'
import { Layer2Section } from './components/sections/Layer2Section'
import { Layer3ASection } from './components/sections/Layer3ASection'
import { Layer3BSection } from './components/sections/Layer3BSection'
import { Layer4Section } from './components/sections/Layer4Section'
import { Layer5Section } from './components/sections/Layer5Section'
import { GlossaryModal } from './components/ui/GlossaryModal'
import { LAYER_NAV_ITEMS } from './data/layers'

const SECTION_IDS = ['hero', 'lab-3d', ...LAYER_NAV_ITEMS.map((item) => item.id)]

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false)
  const [activeTermId, setActiveTermId] = useState<string | null>('doping')
  const [activeSection, setActiveSection] = useState<string>('hero')

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const visibleMap = new Map<string, number>()

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibleMap.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
          })
          let bestId = ''
          let bestScore = 0
          visibleMap.forEach((score, key) => {
            if (score > bestScore) {
              bestScore = score
              bestId = key
            }
          })
          if (bestScore > 0 && bestId) {
            setActiveSection(bestId)
          }
        },
        {
          rootMargin: '-18% 0px -45% 0px',
          threshold: [0, 0.15, 0.35, 0.6],
        }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleOpenGlossary = useCallback((termId?: string) => {
    if (termId) {
      setActiveTermId(termId)
    }
    setGlossaryOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#06B6D4]/25 selection:text-[#22D3EE]">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenGlossary={handleOpenGlossary}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenGlossary={handleOpenGlossary}
      />

      <main>
        <HeroSection
          onNavigate={handleNavigate}
          onOpenGlossary={handleOpenGlossary}
        />
        <Lab3DSection theme={theme} onNavigateLayer={handleNavigate} />
        <Layer0Section onOpenGlossary={handleOpenGlossary} />
        <Layer1Section onOpenGlossary={handleOpenGlossary} />
        <Layer2Section onOpenGlossary={handleOpenGlossary} />
        <Layer3ASection onOpenGlossary={handleOpenGlossary} />
        <Layer3BSection onOpenGlossary={handleOpenGlossary} />
        <Layer4Section onOpenGlossary={handleOpenGlossary} />
        <Layer5Section
          onNavigate={handleNavigate}
          onOpenGlossary={handleOpenGlossary}
        />
      </main>

      <GlossaryModal
        isOpen={glossaryOpen}
        activeTermId={activeTermId}
        onSelectTerm={(termId) => setActiveTermId(termId)}
        onClose={() => setGlossaryOpen(false)}
      />
    </div>
  )
}

export default App
