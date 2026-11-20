import { Info } from 'lucide-react'

interface TermButtonProps {
  termId: string
  children: React.ReactNode
  onOpenGlossary: (termId: string) => void
}

export function TermButton({ termId, children, onOpenGlossary }: TermButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenGlossary(termId)}
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-medium text-[var(--signal-high)] underline decoration-[var(--signal-high)]/45 decoration-dashed underline-offset-4 transition hover:bg-[var(--signal-high)]/10 hover:decoration-[var(--signal-high)] cursor-pointer"
      title="คลิกเพื่อดูคำอธิบายคำศัพท์เชิงลึก"
    >
      <span>{children}</span>
      <Info className="h-3 w-3 shrink-0 opacity-75" />
    </button>
  )
}
