import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CPU_EXECUTION_STEPS, CPU_RAM_PROGRAM } from '../../data/cpuProgram'

function toBin4(val: number): string {
  return (val & 0xf).toString(2).padStart(4, '0')
}

export function CpuCycleSimulator() {
  const [stepIdx, setStepIdx] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const state = CPU_EXECUTION_STEPS[stepIdx]
  const isFinished = stepIdx >= CPU_EXECUTION_STEPS.length - 1

  useEffect(() => {
    if (!isPlaying || isFinished) return
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        const next = prev + 1
        if (next >= CPU_EXECUTION_STEPS.length - 1) {
          setIsPlaying(false)
          return CPU_EXECUTION_STEPS.length - 1
        }
        return next
      })
    }, 1700)
    return () => window.clearInterval(timer)
  }, [isPlaying, isFinished])

  const handleNext = () => {
    if (isFinished) {
      setStepIdx(0)
    } else {
      setStepIdx((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setStepIdx(0)
  }

  const hasBus = (bus: (typeof state.activeBuses)[number]) =>
    state.activeBuses.includes(bus)
  const hasBlock = (block: (typeof state.activeBlocks)[number]) =>
    state.activeBlocks.includes(block)

  const phaseColor =
    state.phase === 'FETCH'
      ? 'var(--signal-high-bright)'
      : state.phase === 'DECODE'
        ? 'var(--signal-field-bright)'
        : state.phase === 'EXECUTE' || state.phase === 'WRITEBACK'
          ? '#10B981'
          : 'var(--text-secondary)'

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & Playback Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: phaseColor }}
            />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: Mini 4-Step CPU (Fetch → Decode → Execute)
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            กด Next Clock Cycle ทีละจังหวะ หรือ Auto Play เพื่อดูโปรแกรม LOAD R1, 5 / LOAD R2, 3 / ADD R1, R2 ทำงานจริงในฮาร์ดแวร์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="cpu-next-cycle"
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--signal-high)] bg-[var(--signal-high)] px-4 py-2 font-mono-tech text-xs font-bold text-zinc-950 transition hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <StepForward className="h-4 w-4" />
            <span>{isFinished ? 'เริ่มรอบใหม่ (Restart)' : 'Next Clock Cycle'}</span>
          </button>

          <button
            id="cpu-auto-play"
            type="button"
            onClick={() => {
              if (isFinished) setStepIdx(0)
              setIsPlaying((p) => !p)
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              isPlaying
                ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]'
                : 'border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--signal-field)]'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            id="cpu-reset"
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 font-mono-tech text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Clock Phase Timeline Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs text-[var(--text-muted)]">CLOCK CYCLE:</span>
          <span className="font-mono-tech text-sm font-bold text-[var(--text-primary)]">
            #{state.cycleNumber} / {CPU_EXECUTION_STEPS.length - 1}
          </span>
          <span
            className="rounded-md px-2 py-0.5 font-mono-tech text-[11px] font-bold"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: phaseColor,
              border: `1px solid ${phaseColor}`,
            }}
          >
            {state.phase}
          </span>
        </div>

        {/* Clickable Cycle Dots */}
        <div className="flex items-center gap-1.5">
          {CPU_EXECUTION_STEPS.map((s) => (
            <button
              key={s.stepIndex}
              type="button"
              onClick={() => {
                setIsPlaying(false)
                setStepIdx(s.stepIndex)
              }}
              title={`Cycle ${s.cycleNumber}: ${s.phase}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                s.stepIndex === stepIdx
                  ? 'w-7 bg-[var(--signal-high-bright)]'
                  : s.stepIndex < stepIdx
                    ? 'w-2.5 bg-[var(--signal-field)]/70'
                    : 'w-2.5 bg-[var(--border-strong)]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main SVG CPU Architecture Datapath */}
      <div className="simulator-stage p-2 sm:p-4 overflow-x-auto">
        <svg
          viewBox="0 0 740 370"
          className="w-full min-w-[600px] h-auto max-h-[385px] select-none"
          role="img"
          aria-label="แผนผังสถาปัตยกรรม CPU แสดงการไหลของข้อมูลระหว่าง Clock, PC, RAM, Instruction Decoder, ALU และ Registers"
        >
          {/* ===== BUS CONNECTIONS ===== */}
          {/* Clock -> PC & Decoder */}
          <path
            d="M 135 52 L 205 52"
            fill="none"
            stroke={hasBus('clock-pulse') ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('clock-pulse') ? 3.5 : 2}
          />
          {hasBus('clock-pulse') && (
            <path
              d="M 135 52 L 205 52"
              fill="none"
              stroke="var(--signal-field-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* PC -> RAM (Address Bus) */}
          <path
            d="M 272 86 L 272 114 L 122 114 L 122 136"
            fill="none"
            stroke={hasBus('pc-to-ram') ? 'var(--signal-high-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('pc-to-ram') ? 4 : 2}
          />
          {hasBus('pc-to-ram') && (
            <path
              d="M 272 86 L 272 114 L 122 114 L 122 136"
              fill="none"
              stroke="var(--signal-high-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}
          <text x="195" y="109" textAnchor="middle" fill={hasBus('pc-to-ram') ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'} className="font-mono-tech text-[9.5px] font-semibold">
            Address Bus (0x0{state.pc})
          </text>

          {/* RAM -> Instruction Decoder (Data Bus) */}
          <path
            d="M 244 218 L 298 218"
            fill="none"
            stroke={hasBus('ram-to-ir') ? 'var(--signal-high-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('ram-to-ir') ? 4 : 2}
          />
          {hasBus('ram-to-ir') && (
            <path
              d="M 244 218 L 298 218"
              fill="none"
              stroke="var(--signal-high-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}
          <text x="271" y="209" textAnchor="middle" fill={hasBus('ram-to-ir') ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'} className="font-mono-tech text-[9px] font-semibold">
            Data Bus
          </text>

          {/* Decoder -> Registers (Control / Imm) */}
          <path
            d="M 484 185 L 542 185 L 542 135 L 558 135"
            fill="none"
            stroke={hasBus('decoder-to-reg') ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('decoder-to-reg') ? 3.5 : 2}
          />
          {hasBus('decoder-to-reg') && (
            <path
              d="M 484 185 L 542 185 L 542 135 L 558 135"
              fill="none"
              stroke="var(--signal-field-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* Decoder -> ALU (Control Signal) */}
          <path
            d="M 484 268 L 558 268"
            fill="none"
            stroke={hasBus('decoder-to-alu') ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('decoder-to-alu') ? 3.5 : 2}
          />
          {hasBus('decoder-to-alu') && (
            <path
              d="M 484 268 L 558 268"
              fill="none"
              stroke="var(--signal-field-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}
          <text x="521" y="260" textAnchor="middle" fill={hasBus('decoder-to-alu') ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'} className="font-mono-tech text-[9px]">
            Control
          </text>

          {/* Registers -> ALU (Operands A & B) */}
          <path
            d="M 622 192 L 622 230"
            fill="none"
            stroke={hasBus('reg-to-alu') ? 'var(--signal-high-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('reg-to-alu') ? 4 : 2}
          />
          {hasBus('reg-to-alu') && (
            <path
              d="M 622 192 L 622 230"
              fill="none"
              stroke="var(--signal-high-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* ALU -> Registers (Writeback Loop) */}
          <path
            d="M 672 230 L 672 192"
            fill="none"
            stroke={hasBus('alu-to-reg') ? '#10B981' : 'var(--svg-wire-off)'}
            strokeWidth={hasBus('alu-to-reg') ? 4 : 2}
          />
          {hasBus('alu-to-reg') && (
            <path
              d="M 672 230 L 672 192"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* ===== BLOCK 1: CLOCK GENERATOR ===== */}
          <rect
            x="18"
            y="18"
            width="117"
            height="68"
            rx="12"
            fill={hasBlock('clock') ? 'rgba(168, 85, 247, 0.14)' : 'var(--svg-node)'}
            stroke={hasBlock('clock') ? 'var(--signal-field-bright)' : 'var(--border-strong)'}
            strokeWidth={hasBlock('clock') ? 2.5 : 1.5}
          />
          <text x="76" y="38" textAnchor="middle" fill="var(--signal-field-bright)" className="font-mono-tech text-[10px] font-bold">
            CLOCK (Hz)
          </text>
          {/* Mini Square Wave */}
          <path
            d={
              state.cycleNumber % 2 === 1
                ? 'M 32 70 L 44 70 L 44 50 L 64 50 L 64 70 L 84 70 L 84 50 L 104 50 L 104 70 L 120 70'
                : 'M 32 50 L 44 50 L 44 70 L 64 70 L 64 50 L 84 50 L 84 70 L 104 70 L 104 50 L 120 50'
            }
            fill="none"
            stroke={hasBus('clock-pulse') ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
            strokeWidth="2.2"
          />

          {/* ===== BLOCK 2: PROGRAM COUNTER (PC) ===== */}
          <rect
            x="205"
            y="18"
            width="148"
            height="68"
            rx="12"
            fill={hasBlock('pc') ? 'rgba(6, 182, 212, 0.14)' : 'var(--svg-node)'}
            stroke={hasBlock('pc') ? 'var(--signal-high-bright)' : 'var(--border-strong)'}
            strokeWidth={hasBlock('pc') ? 2.5 : 1.5}
          />
          <text x="279" y="38" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px] font-bold">
            PROGRAM COUNTER (PC)
          </text>
          <text x="279" y="65" textAnchor="middle" fill="var(--signal-high-bright)" className="font-mono-tech text-lg font-bold">
            0x0{state.pc} ({toBin4(state.pc)}₂)
          </text>

          {/* ===== BLOCK 3: RAM (PROGRAM MEMORY) ===== */}
          <rect
            x="18"
            y="136"
            width="226"
            height="214"
            rx="14"
            fill="var(--svg-node)"
            stroke={hasBlock('ram') ? 'var(--signal-high-bright)' : 'var(--border-strong)'}
            strokeWidth={hasBlock('ram') ? 2.5 : 1.5}
          />
          <text x="131" y="158" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
            RAM (หน่วยความจำคำสั่ง)
          </text>
          {CPU_RAM_PROGRAM.map((instr, idx) => {
            const isRowActive = state.ramActiveAddress === idx
            const isPointed = state.pc === idx
            const yTop = 172 + idx * 42
            return (
              <g key={instr.address}>
                <rect
                  x="28"
                  y={yTop}
                  width="206"
                  height="35"
                  rx="8"
                  fill={
                    isRowActive
                      ? 'rgba(6, 182, 212, 0.2)'
                      : isPointed
                        ? 'rgba(168, 85, 247, 0.1)'
                        : 'var(--svg-canvas)'
                  }
                  stroke={
                    isRowActive
                      ? 'var(--signal-high-bright)'
                      : isPointed
                        ? 'var(--signal-field)'
                        : 'var(--border-subtle)'
                  }
                  strokeWidth={isRowActive ? 2 : 1}
                />
                <text
                  x="38"
                  y={yTop + 15}
                  fill="var(--svg-text-muted)"
                  className="font-mono-tech text-[10px] font-bold"
                >
                  {instr.address}
                </text>
                <text
                  x="72"
                  y={yTop + 15}
                  fill={isRowActive ? 'var(--signal-high-bright)' : 'var(--svg-text)'}
                  className="font-mono-tech text-[11px] font-bold"
                >
                  {instr.assembly}
                </text>
                <text
                  x="72"
                  y={yTop + 28}
                  fill="var(--svg-text-muted)"
                  className="font-mono-tech text-[9.5px]"
                >
                  {instr.binary}₂
                </text>
              </g>
            )
          })}

          {/* ===== BLOCK 4: INSTRUCTION REGISTER & DECODER ===== */}
          <rect
            x="298"
            y="136"
            width="186"
            height="214"
            rx="14"
            fill={hasBlock('decoder') ? 'rgba(168, 85, 247, 0.1)' : 'var(--svg-node)'}
            stroke={hasBlock('decoder') ? 'var(--signal-field-bright)' : 'var(--border-strong)'}
            strokeWidth={hasBlock('decoder') ? 2.5 : 1.5}
          />
          <text x="391" y="158" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
            IR & DECODER
          </text>

          {/* IR Box inside */}
          <rect x="312" y="172" width="158" height="62" rx="9" fill="var(--svg-canvas)" stroke="var(--border-subtle)" />
          <text x="391" y="189" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[9.5px]">
            Instruction Register (IR)
          </text>
          <text x="391" y="209" textAnchor="middle" fill="var(--signal-high-bright)" className="font-mono-tech text-xs font-bold">
            {state.irAssembly}
          </text>
          <text x="391" y="225" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
            Bits: {state.irBinary}₂
          </text>

          {/* Control Signal Output inside */}
          <rect
            x="312"
            y="248"
            width="158"
            height="86"
            rx="9"
            fill="rgba(168, 85, 247, 0.12)"
            stroke="var(--signal-field)"
            strokeOpacity="0.6"
          />
          <text x="391" y="268" textAnchor="middle" fill="var(--signal-field-bright)" className="font-mono-tech text-[9.5px] font-bold">
            CONTROL SWITCHES
          </text>
          <foreignObject x="318" y="274" width="146" height="56">
            <div className="flex h-full items-center justify-center text-center font-mono-tech text-[10px] leading-snug text-[var(--text-primary)] font-semibold">
              {state.decoderSignal}
            </div>
          </foreignObject>

          {/* ===== BLOCK 5: REGISTERS (R1, R2, ACC) ===== */}
          <rect
            x="558"
            y="18"
            width="164"
            height="174"
            rx="14"
            fill={hasBlock('registers') ? 'rgba(6, 182, 212, 0.1)' : 'var(--svg-node)'}
            stroke={hasBlock('registers') ? 'var(--signal-high-bright)' : 'var(--border-strong)'}
            strokeWidth={hasBlock('registers') ? 2.5 : 1.5}
          />
          <text x="640" y="40" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
            REGISTERS (SRAM)
          </text>

          {[
            { name: 'R1', val: state.r1, y: 54 },
            { name: 'R2', val: state.r2, y: 98 },
            { name: 'ACC', val: state.acc, y: 142 },
          ].map((reg) => (
            <g key={reg.name}>
              <rect
                x="570"
                y={reg.y}
                width="140"
                height="36"
                rx="8"
                fill="var(--svg-canvas)"
                stroke={reg.val > 0 ? 'var(--signal-high)' : 'var(--border-subtle)'}
              />
              <text x="582" y={reg.y + 22} fill="var(--svg-text-muted)" className="font-mono-tech text-xs font-bold">
                {reg.name}
              </text>
              <text
                x="698"
                y={reg.y + 22}
                textAnchor="end"
                fill={reg.val > 0 ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'}
                className="font-mono-tech text-xs font-bold"
              >
                {toBin4(reg.val)}₂ ({reg.val})
              </text>
            </g>
          ))}

          {/* ===== BLOCK 6: ALU ===== */}
          <rect
            x="558"
            y="230"
            width="164"
            height="120"
            rx="14"
            fill={hasBlock('alu') ? 'rgba(16, 185, 129, 0.14)' : 'var(--svg-node)'}
            stroke={hasBlock('alu') ? '#10B981' : 'var(--border-strong)'}
            strokeWidth={hasBlock('alu') ? 2.5 : 1.5}
          />
          <text x="640" y="254" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
            ALU (4-Bit Adder)
          </text>
          <text x="640" y="280" textAnchor="middle" fill="#10B981" className="font-mono-tech text-xs font-bold">
            {state.aluOp}
          </text>
          <text x="640" y="305" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10.5px]">
            A={state.aluInA ?? '-'} | B={state.aluInB ?? '-'}
          </text>
          <text x="640" y="330" textAnchor="middle" fill="var(--signal-high-bright)" className="font-mono-tech text-sm font-bold">
            OUT = {state.aluOut !== null ? `${toBin4(state.aluOut)}₂ (${state.aluOut})` : '—'}
          </text>
        </svg>
      </div>

      {/* Live Step-by-Step Physical Narration */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            {state.headlineTh}
          </h4>
          <span className="rounded-lg bg-[var(--bg-elevated)] px-2.5 py-1 font-mono-tech text-[11px] text-[var(--signal-high)]">
            {state.hardwareSwitchDetail}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {state.explanationTh}
        </p>
      </div>
    </div>
  )
}
