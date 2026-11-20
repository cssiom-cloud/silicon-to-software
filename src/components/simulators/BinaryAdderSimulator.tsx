import { Calculator, RotateCcw } from 'lucide-react'
import { useState } from 'react'

type Bit = 0 | 1

interface AdderBitResult {
  index: number // 0 = LSB, 3 = MSB
  a: Bit
  b: Bit
  cin: Bit
  xorAB: Bit
  andAB: Bit
  andCinXor: Bit
  sum: Bit
  cout: Bit
}

export function BinaryAdderSimulator() {
  // Stored as [bit3 (MSB), bit2, bit1, bit0 (LSB)] -> default A = 5 (0101), B = 3 (0011)
  const [bitsA, setBitsA] = useState<[Bit, Bit, Bit, Bit]>([0, 1, 0, 1])
  const [bitsB, setBitsB] = useState<[Bit, Bit, Bit, Bit]>([0, 0, 1, 1])
  const [inspectedBit, setInspectedBit] = useState<number>(0)

  const toggleBitA = (posFromMsb: number) => {
    setBitsA((prev) => {
      const next = [...prev] as [Bit, Bit, Bit, Bit]
      next[posFromMsb] = next[posFromMsb] === 1 ? 0 : 1
      return next
    })
  }

  const toggleBitB = (posFromMsb: number) => {
    setBitsB((prev) => {
      const next = [...prev] as [Bit, Bit, Bit, Bit]
      next[posFromMsb] = next[posFromMsb] === 1 ? 0 : 1
      return next
    })
  }

  // Compute 4-bit Ripple-Carry from LSB (index 0) to MSB (index 3)
  const stages: AdderBitResult[] = []
  let carry: Bit = 0
  for (let bitIdx = 0; bitIdx < 4; bitIdx++) {
    const arrPos = 3 - bitIdx
    const a = bitsA[arrPos]
    const b = bitsB[arrPos]
    const cin = carry
    const xorAB: Bit = (a ^ b) as Bit
    const sum: Bit = (xorAB ^ cin) as Bit
    const andAB: Bit = (a & b) as Bit
    const andCinXor: Bit = (cin & xorAB) as Bit
    const cout: Bit = (andAB | andCinXor) as Bit
    stages.push({ index: bitIdx, a, b, cin, xorAB, andAB, andCinXor, sum, cout })
    carry = cout
  }

  const carryOut = carry
  const valA = bitsA[0] * 8 + bitsA[1] * 4 + bitsA[2] * 2 + bitsA[3]
  const valB = bitsB[0] * 8 + bitsB[1] * 4 + bitsB[2] * 2 + bitsB[3]
  const totalDec = valA + valB
  const sumBitsMsbFirst = [stages[3].sum, stages[2].sum, stages[1].sum, stages[0].sum]
  const totalBin5 = `${carryOut}${sumBitsMsbFirst.join('')}`

  const inspected = stages[inspectedBit]

  // SVG X positions for Bit 3 (left) -> Bit 0 (right)
  const colX = [175, 305, 435, 565]

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & Presets */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="h-4.5 w-4.5 text-[var(--signal-high)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: 4-Bit Ripple-Carry Binary Adder
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            คลิกสลับบิตของเลข A และ B เพื่อดูสัญญาณตัวทด (Carry) ไหลข้ามหลักจากขวาไปซ้ายแบบเรียลไทม์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setBitsA([0, 1, 0, 1])
              setBitsB([0, 0, 1, 1])
            }}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-tech text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--signal-high)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            5 + 3 (Chain Carry)
          </button>
          <button
            type="button"
            onClick={() => {
              setBitsA([1, 1, 1, 1])
              setBitsB([0, 0, 0, 1])
            }}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-tech text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--signal-field)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            15 + 1 (Ripple All!)
          </button>
          <button
            type="button"
            onClick={() => {
              setBitsA([0, 0, 0, 0])
              setBitsB([0, 0, 0, 0])
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-tech text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Bit Toggle Matrix */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Input A Row */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-tech text-xs font-bold text-[var(--signal-high-bright)]">
              เลข A (4-Bit Input)
            </span>
            <span className="font-mono-tech text-xs text-[var(--text-secondary)]">
              ฐานสอง: <strong className="text-[var(--text-primary)]">{bitsA.join('')}₂</strong> ={' '}
              <strong className="text-[var(--signal-high-bright)]">{valA}₁₀</strong>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {bitsA.map((bit, idx) => {
              const weight = 8 >> idx
              const bitLabel = `A${3 - idx}`
              return (
                <button
                  key={bitLabel}
                  id={`adder-bit-${bitLabel}`}
                  type="button"
                  onClick={() => toggleBitA(idx)}
                  className={`flex flex-col items-center rounded-xl border py-2.5 transition active:scale-95 cursor-pointer ${
                    bit === 1
                      ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/16 text-[var(--signal-high-bright)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className="font-mono-tech text-[10px] opacity-80">
                    {bitLabel} (2^{3 - idx}={weight})
                  </span>
                  <span className="mt-0.5 font-mono-tech text-xl font-bold">{bit}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input B Row */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-tech text-xs font-bold text-[var(--signal-field-bright)]">
              เลข B (4-Bit Input)
            </span>
            <span className="font-mono-tech text-xs text-[var(--text-secondary)]">
              ฐานสอง: <strong className="text-[var(--text-primary)]">{bitsB.join('')}₂</strong> ={' '}
              <strong className="text-[var(--signal-field-bright)]">{valB}₁₀</strong>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {bitsB.map((bit, idx) => {
              const weight = 8 >> idx
              const bitLabel = `B${3 - idx}`
              return (
                <button
                  key={bitLabel}
                  id={`adder-bit-${bitLabel}`}
                  type="button"
                  onClick={() => toggleBitB(idx)}
                  className={`flex flex-col items-center rounded-xl border py-2.5 transition active:scale-95 cursor-pointer ${
                    bit === 1
                      ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/16 text-[var(--signal-field-bright)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className="font-mono-tech text-[10px] opacity-80">
                    {bitLabel} (2^{3 - idx}={weight})
                  </span>
                  <span className="mt-0.5 font-mono-tech text-xl font-bold">{bit}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* SVG 4-Bit Ripple-Carry Circuit Diagram */}
      <div className="simulator-stage p-2 sm:p-4 overflow-x-auto">
        <svg
          viewBox="0 0 660 285"
          className="w-full min-w-[540px] h-auto max-h-[300px] select-none"
          role="img"
          aria-label="แผนผังวงจร 4-Bit Ripple-Carry Binary Adder แสดงเส้นทางตัวทด Carry"
        >
          {/* Carry Out (C4) Final Wire to Left */}
          <path
            d="M 135 142 L 62 142 L 62 222"
            fill="none"
            stroke={carryOut === 1 ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
            strokeWidth={carryOut === 1 ? 4 : 2.5}
          />
          {carryOut === 1 && (
            <path
              d="M 135 142 L 62 142 L 62 222"
              fill="none"
              stroke="var(--signal-field-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* Carry Out Output Box */}
          <rect
            x="24"
            y="222"
            width="76"
            height="48"
            rx="10"
            fill={carryOut === 1 ? 'rgba(168, 85, 247, 0.2)' : 'var(--svg-node)'}
            stroke={carryOut === 1 ? 'var(--signal-field-bright)' : 'var(--border-strong)'}
            strokeWidth="2"
          />
          <text x="62" y="241" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
            C4 (16)
          </text>
          <text
            x="62"
            y="260"
            textAnchor="middle"
            fill={carryOut === 1 ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
            className="font-mono-tech text-base font-bold"
          >
            {carryOut}
          </text>

          {/* Render 4 Full Adders from MSB (left: bitIdx 3) to LSB (right: bitIdx 0) */}
          {[3, 2, 1, 0].map((bitIdx, visualCol) => {
            const st = stages[bitIdx]
            const cx = colX[visualCol]
            const isSelected = inspectedBit === bitIdx

            return (
              <g key={bitIdx}>
                {/* Input A wire down into FA */}
                <line
                  x1={cx - 18}
                  y1={42}
                  x2={cx - 18}
                  y2={106}
                  stroke={st.a === 1 ? 'var(--signal-high)' : 'var(--svg-wire-off)'}
                  strokeWidth={st.a === 1 ? 3.5 : 2}
                />
                <circle
                  cx={cx - 18}
                  cy={32}
                  r="13"
                  fill={st.a === 1 ? 'rgba(6, 182, 212, 0.2)' : 'var(--svg-node)'}
                  stroke={st.a === 1 ? 'var(--signal-high)' : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text
                  x={cx - 18}
                  y={36}
                  textAnchor="middle"
                  fill={st.a === 1 ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'}
                  className="font-mono-tech text-xs font-bold"
                >
                  {st.a}
                </text>
                <text
                  x={cx - 18}
                  y={14}
                  textAnchor="middle"
                  fill="var(--svg-text-muted)"
                  className="font-mono-tech text-[10px]"
                >
                  A{bitIdx}
                </text>

                {/* Input B wire down into FA */}
                <line
                  x1={cx + 18}
                  y1={42}
                  x2={cx + 18}
                  y2={106}
                  stroke={st.b === 1 ? 'var(--signal-field)' : 'var(--svg-wire-off)'}
                  strokeWidth={st.b === 1 ? 3.5 : 2}
                />
                <circle
                  cx={cx + 18}
                  cy={32}
                  r="13"
                  fill={st.b === 1 ? 'rgba(168, 85, 247, 0.2)' : 'var(--svg-node)'}
                  stroke={st.b === 1 ? 'var(--signal-field)' : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text
                  x={cx + 18}
                  y={36}
                  textAnchor="middle"
                  fill={st.b === 1 ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
                  className="font-mono-tech text-xs font-bold"
                >
                  {st.b}
                </text>
                <text
                  x={cx + 18}
                  y={14}
                  textAnchor="middle"
                  fill="var(--svg-text-muted)"
                  className="font-mono-tech text-[10px]"
                >
                  B{bitIdx}
                </text>

                {/* Carry Ripple Wire to the next FA on the left (for bitIdx 0, 1, 2) */}
                {bitIdx < 3 && (
                  <g>
                    <line
                      x1={cx - 42}
                      y1={142}
                      x2={colX[visualCol - 1] + 42}
                      y2={142}
                      stroke={st.cout === 1 ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
                      strokeWidth={st.cout === 1 ? 4 : 2}
                    />
                    {st.cout === 1 && (
                      <line
                        x1={cx - 42}
                        y1={142}
                        x2={colX[visualCol - 1] + 42}
                        y2={142}
                        stroke="var(--signal-field-bright)"
                        strokeWidth="3"
                        className="animate-flow"
                      />
                    )}
                    <text
                      x={(cx - 42 + colX[visualCol - 1] + 42) / 2}
                      y={132}
                      textAnchor="middle"
                      fill={st.cout === 1 ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
                      className="font-mono-tech text-[10px] font-bold"
                    >
                      C{bitIdx + 1}={st.cout}
                    </text>
                  </g>
                )}

                {/* Initial Cin = 0 label on Bit 0 right edge */}
                {bitIdx === 0 && (
                  <g>
                    <line x1={cx + 42} y1={142} x2={632} y2={142} stroke="var(--svg-wire-off)" strokeWidth="2" />
                    <text x={636} y={136} textAnchor="end" fill="var(--svg-text-muted)" className="font-mono-tech text-[9px]">
                      Cin=0
                    </text>
                  </g>
                )}

                {/* Full Adder Clickable Box */}
                <g
                  onClick={() => setInspectedBit(bitIdx)}
                  className="cursor-pointer"
                >
                  <rect
                    x={cx - 42}
                    y={106}
                    width="84"
                    height="72"
                    rx="12"
                    fill={
                      isSelected
                        ? 'rgba(6, 182, 212, 0.14)'
                        : 'var(--svg-node)'
                    }
                    stroke={
                      isSelected
                        ? 'var(--signal-high-bright)'
                        : st.sum === 1 || st.cout === 1
                          ? 'var(--signal-high)'
                          : 'var(--border-strong)'
                    }
                    strokeWidth={isSelected ? 2.8 : 1.8}
                  />
                  <text
                    x={cx}
                    y={131}
                    textAnchor="middle"
                    fill="var(--svg-text)"
                    className="font-mono-tech text-xs font-bold"
                  >
                    FA {bitIdx}
                  </text>
                  <text
                    x={cx}
                    y={149}
                    textAnchor="middle"
                    fill="var(--svg-text-muted)"
                    className="font-mono-tech text-[9.5px]"
                  >
                    XOR + AND
                  </text>
                  <text
                    x={cx}
                    y={166}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'}
                    className="font-mono-tech text-[9px]"
                  >
                    {isSelected ? '▼ กำลังดูไส้ใน' : 'คลิกดูเกต'}
                  </text>
                </g>

                {/* Sum Output Wire & Result Box */}
                <line
                  x1={cx}
                  y1={178}
                  x2={cx}
                  y2={222}
                  stroke={st.sum === 1 ? 'var(--signal-high-bright)' : 'var(--svg-wire-off)'}
                  strokeWidth={st.sum === 1 ? 4 : 2.5}
                />
                {st.sum === 1 && (
                  <line
                    x1={cx}
                    y1={178}
                    x2={cx}
                    y2={222}
                    stroke="var(--signal-high-bright)"
                    strokeWidth="3"
                    className="animate-flow"
                  />
                )}
                <rect
                  x={cx - 34}
                  y={222}
                  width="68"
                  height="48"
                  rx="10"
                  fill={st.sum === 1 ? 'rgba(6, 182, 212, 0.18)' : 'var(--svg-node)'}
                  stroke={st.sum === 1 ? 'var(--signal-high-bright)' : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text x={cx} y={241} textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                  S{bitIdx} ({1 << bitIdx})
                </text>
                <text
                  x={cx}
                  y={260}
                  textAnchor="middle"
                  fill={st.sum === 1 ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'}
                  className="font-mono-tech text-base font-bold"
                >
                  {st.sum}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Live Binary + Decimal Result Banner & Gate Inspector */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Live Equation Readout */}
        <div className="rounded-xl border border-[var(--signal-high)]/40 bg-[var(--signal-high)]/8 p-4 lg:col-span-6 flex flex-col justify-center">
          <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[var(--signal-high)]">
            ผลลัพธ์การบวกแบบเรียลไทม์ (Binary & Decimal)
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2 font-mono-tech">
            <span className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              {bitsA.join('')}₂ + {bitsB.join('')}₂ ={' '}
              <span className="text-[var(--signal-high-bright)]">{totalBin5}₂</span>
            </span>
          </div>
          <div className="mt-1 font-mono-tech text-sm text-[var(--text-secondary)]">
            เลขฐานสิบ: <strong>{valA}</strong> + <strong>{valB}</strong> ={' '}
            <strong className="text-base text-[var(--signal-high-bright)]">{totalDec}</strong>
            {carryOut === 1 && (
              <span className="ml-2 rounded bg-[var(--signal-field)]/20 px-2 py-0.5 text-[11px] text-[var(--signal-field-bright)]">
                C4 Carry Out = +16
              </span>
            )}
          </div>
        </div>

        {/* Selected Full Adder Gate Breakdown */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs font-bold text-[var(--text-primary)]">
              ไส้ในลอจิกเกตของ Full Adder หลักที่ {inspected.index} (น้ำหนัก 2^{inspected.index} ={' '}
              {1 << inspected.index})
            </span>
            <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">
              A={inspected.a}, B={inspected.b}, Cin={inspected.cin}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-tech text-xs">
            <div className="rounded-lg bg-[var(--bg-elevated)] px-3 py-2">
              <div className="text-[10px] text-[var(--text-muted)]">หลักหน่วย (Sum = XOR)</div>
              <div className="mt-0.5 text-[var(--signal-high-bright)] font-semibold">
                {inspected.a} ⊕ {inspected.b} ⊕ {inspected.cin} = {inspected.sum}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--bg-elevated)] px-3 py-2">
              <div className="text-[10px] text-[var(--text-muted)]">ตัวทด (Carry = AND + OR)</div>
              <div className="mt-0.5 text-[var(--signal-field-bright)] font-semibold">
                ({inspected.a}·{inspected.b}) | ({inspected.cin}·{inspected.xorAB}) = {inspected.cout}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
