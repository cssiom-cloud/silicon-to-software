import { Cpu, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'

type GateMode = 'not' | 'nand'

export function CmosGateSimulator() {
  const [gateMode, setGateMode] = useState<GateMode>('nand')
  const [inputA, setInputA] = useState<0 | 1>(1)
  const [inputB, setInputB] = useState<0 | 1>(0)

  // Transistor states:
  // PMOS conducts when gate = 0; NMOS conducts when gate = 1
  const p1On = inputA === 0
  const p2On = inputB === 0
  const n1On = inputA === 1
  const n2On = inputB === 1

  const outputY: 0 | 1 =
    gateMode === 'not' ? (inputA === 0 ? 1 : 0) : inputA === 1 && inputB === 1 ? 0 : 1

  const pullUpActive = outputY === 1
  const pullDownActive = outputY === 0

  const highColor = 'var(--signal-high-bright)'
  const fieldColor = 'var(--signal-field-bright)'
  const offColor = 'var(--svg-wire-off)'

  const truthRows =
    gateMode === 'not'
      ? [
          { a: 0 as const, b: null, y: 1 as const, note: 'PMOS เปิด → Y ต่อ VDD' },
          { a: 1 as const, b: null, y: 0 as const, note: 'NMOS เปิด → Y ลง GND' },
        ]
      : [
          { a: 0 as const, b: 0 as const, y: 1 as const, note: 'P1, P2 เปิดทั้งคู่ → VDD' },
          { a: 0 as const, b: 1 as const, y: 1 as const, note: 'P1 เปิด / N1 ปิด → VDD' },
          { a: 1 as const, b: 0 as const, y: 1 as const, note: 'P2 เปิด / N2 ปิด → VDD' },
          { a: 1 as const, b: 1 as const, y: 0 as const, note: 'N1 & N2 เปิดอนุกรม → GND' },
        ]

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & Gate Switcher */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4.5 w-4.5 text-[var(--signal-high)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: วงจร CMOS NOT Gate และ NAND Gate
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            กดสลับอินพุต A และ B เพื่อดูว่า PMOS ด้านบน หรือ NMOS ด้านล่างตัวไหนเปิดเชื่อมต่อกับ VDD / GND
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="cmos-mode-not"
            type="button"
            onClick={() => setGateMode('not')}
            className={`rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              gateMode === 'not'
                ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            CMOS NOT (2 FETs)
          </button>
          <button
            id="cmos-mode-nand"
            type="button"
            onClick={() => setGateMode('nand')}
            className={`rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              gateMode === 'nand'
                ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            CMOS NAND (4 FETs)
          </button>
        </div>
      </div>

      {/* Main Split: Circuit Schematic + Controls & Truth Table */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* SVG Schematic */}
        <div className="simulator-stage p-3 lg:col-span-7 flex items-center justify-center">
          {gateMode === 'not' ? (
            <svg
              viewBox="0 0 460 350"
              className="w-full h-auto max-h-[360px] select-none"
              role="img"
              aria-label="แผนผังวงจร CMOS NOT Gate"
            >
              {/* VDD Rail */}
              <line x1="175" y1="30" x2="285" y2="30" stroke={highColor} strokeWidth="4" />
              <text
                x="230"
                y="20"
                textAnchor="middle"
                fill={highColor}
                className="font-mono-tech text-xs font-bold"
              >
                VDD (+1.2V = 1)
              </text>

              {/* Top wire VDD to PMOS */}
              <line
                x1="230"
                y1="30"
                x2="230"
                y2="84"
                stroke={p1On ? highColor : offColor}
                strokeWidth="3.5"
              />
              {p1On && (
                <line
                  x1="230"
                  y1="30"
                  x2="230"
                  y2="175"
                  stroke={highColor}
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* Middle Output Junction */}
              <line
                x1="230"
                y1="142"
                x2="230"
                y2="208"
                stroke={pullUpActive ? highColor : 'var(--signal-low)'}
                strokeWidth="3.5"
              />

              {/* Output Wire to Y */}
              <line
                x1="230"
                y1="175"
                x2="355"
                y2="175"
                stroke={pullUpActive ? highColor : 'var(--signal-low)'}
                strokeWidth="4"
              />
              {pullUpActive && (
                <line
                  x1="230"
                  y1="175"
                  x2="355"
                  y2="175"
                  stroke={highColor}
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* Bottom wire NMOS to GND */}
              <line
                x1="230"
                y1="266"
                x2="230"
                y2="316"
                stroke={n1On ? 'var(--signal-low)' : offColor}
                strokeWidth="3.5"
              />
              {n1On && (
                <line
                  x1="230"
                  y1="175"
                  x2="230"
                  y2="316"
                  stroke="var(--text-secondary)"
                  strokeWidth="2.5"
                  className="animate-flow"
                />
              )}

              {/* GND Symbol */}
              <line x1="205" y1="316" x2="255" y2="316" stroke="var(--signal-low)" strokeWidth="3.5" />
              <line x1="214" y1="323" x2="246" y2="323" stroke="var(--signal-low)" strokeWidth="2.5" />
              <line x1="223" y1="330" x2="237" y2="330" stroke="var(--signal-low)" strokeWidth="2" />
              <text
                x="230"
                y="344"
                textAnchor="middle"
                fill="var(--svg-text-muted)"
                className="font-mono-tech text-[11px] font-bold"
              >
                GND (0V = 0)
              </text>

              {/* Input A Control Bus */}
              <path
                d="M 88 175 L 135 175 M 135 113 L 135 237 M 135 113 L 184 113 M 135 237 L 190 237"
                fill="none"
                stroke={inputA === 1 ? fieldColor : 'var(--signal-low)'}
                strokeWidth="3"
              />

              {/* Input A Node */}
              <rect
                x="22"
                y="153"
                width="68"
                height="44"
                rx="10"
                fill="var(--svg-node)"
                stroke={inputA === 1 ? fieldColor : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text
                x="56"
                y="172"
                textAnchor="middle"
                fill="var(--svg-text-muted)"
                className="font-mono-tech text-[10px]"
              >
                IN A
              </text>
              <text
                x="56"
                y="188"
                textAnchor="middle"
                fill={inputA === 1 ? fieldColor : 'var(--svg-text)'}
                className="font-mono-tech text-sm font-bold"
              >
                {inputA}
              </text>

              {/* PMOS Block */}
              <g>
                <circle
                  cx="188"
                  cy="113"
                  r="5"
                  fill="var(--svg-canvas)"
                  stroke={p1On ? highColor : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <rect
                  x="194"
                  y="84"
                  width="72"
                  height="58"
                  rx="10"
                  fill={p1On ? 'rgba(6, 182, 212, 0.16)' : 'var(--svg-node)'}
                  stroke={p1On ? highColor : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text
                  x="230"
                  y="107"
                  textAnchor="middle"
                  fill="var(--svg-text)"
                  className="font-mono-tech text-xs font-bold"
                >
                  PMOS
                </text>
                <text
                  x="230"
                  y="126"
                  textAnchor="middle"
                  fill={p1On ? highColor : 'var(--svg-text-muted)'}
                  className="font-mono-tech text-[11px] font-bold"
                >
                  {p1On ? '● ON' : '○ OFF'}
                </text>
              </g>

              {/* NMOS Block */}
              <g>
                <rect
                  x="194"
                  y="208"
                  width="72"
                  height="58"
                  rx="10"
                  fill={n1On ? 'rgba(113, 113, 122, 0.24)' : 'var(--svg-node)'}
                  stroke={n1On ? 'var(--text-primary)' : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text
                  x="230"
                  y="231"
                  textAnchor="middle"
                  fill="var(--svg-text)"
                  className="font-mono-tech text-xs font-bold"
                >
                  NMOS
                </text>
                <text
                  x="230"
                  y="250"
                  textAnchor="middle"
                  fill={n1On ? 'var(--svg-text)' : 'var(--svg-text-muted)'}
                  className="font-mono-tech text-[11px] font-bold"
                >
                  {n1On ? '● ON' : '○ OFF'}
                </text>
              </g>

              {/* Output Y Node */}
              <circle cx="230" cy="175" r="5" fill={pullUpActive ? highColor : 'var(--signal-low)'} />
              <rect
                x="355"
                y="148"
                width="84"
                height="54"
                rx="12"
                fill={pullUpActive ? 'rgba(6, 182, 212, 0.18)' : 'var(--svg-node)'}
                stroke={pullUpActive ? highColor : 'var(--border-strong)'}
                strokeWidth="2.5"
              />
              <text
                x="397"
                y="168"
                textAnchor="middle"
                fill="var(--svg-text-muted)"
                className="font-mono-tech text-[10px]"
              >
                OUT Y (¬A)
              </text>
              <text
                x="397"
                y="190"
                textAnchor="middle"
                fill={pullUpActive ? highColor : 'var(--svg-text-muted)'}
                className="font-mono-tech text-base font-bold"
              >
                {outputY} ({outputY === 1 ? 'HIGH' : 'LOW'})
              </text>
            </svg>
          ) : (
            /* CMOS NAND GATE (4 TRANSISTORS: P1 || P2 on top, N1 -- N2 in series below) */
            <svg
              viewBox="0 0 500 380"
              className="w-full h-auto max-h-[380px] select-none"
              role="img"
              aria-label="แผนผังวงจร CMOS NAND Gate 4 ทรานซิสเตอร์"
            >
              {/* VDD Rail */}
              <line x1="150" y1="28" x2="350" y2="28" stroke={highColor} strokeWidth="4" />
              <text
                x="250"
                y="18"
                textAnchor="middle"
                fill={highColor}
                className="font-mono-tech text-xs font-bold"
              >
                VDD (+1.2V = 1) — PMOS Parallel Pull-Up
              </text>

              {/* Parallel PMOS top branches */}
              <path
                d="M 195 28 L 195 72"
                stroke={p1On ? highColor : offColor}
                strokeWidth="3"
              />
              <path
                d="M 305 28 L 305 72"
                stroke={p2On ? highColor : offColor}
                strokeWidth="3"
              />
              {/* Bottom join of PMOS branches to Output Node */}
              <path
                d="M 195 130 L 195 162 L 305 162 L 305 130"
                fill="none"
                stroke={pullUpActive ? highColor : offColor}
                strokeWidth="3"
              />

              {/* Animated Pull-up flows */}
              {p1On && (
                <path
                  d="M 195 28 L 195 162 L 250 162 L 390 162"
                  fill="none"
                  stroke={highColor}
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}
              {p2On && (
                <path
                  d="M 305 28 L 305 162 L 390 162"
                  fill="none"
                  stroke={highColor}
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* Output wire to Y */}
              <line
                x1="250"
                y1="162"
                x2="390"
                y2="162"
                stroke={pullUpActive ? highColor : 'var(--signal-low)'}
                strokeWidth="4"
              />
              <circle cx="250" cy="162" r="5" fill={pullUpActive ? highColor : 'var(--signal-low)'} />

              {/* Series NMOS Pull-Down Backbone */}
              <line
                x1="250"
                y1="162"
                x2="250"
                y2="196"
                stroke={pullDownActive ? 'var(--text-secondary)' : offColor}
                strokeWidth="3.5"
              />
              <line
                x1="250"
                y1="250"
                x2="250"
                y2="274"
                stroke={n1On && n2On ? 'var(--text-secondary)' : offColor}
                strokeWidth="3.5"
              />
              <line
                x1="250"
                y1="328"
                x2="250"
                y2="348"
                stroke={n1On && n2On ? 'var(--text-secondary)' : offColor}
                strokeWidth="3.5"
              />
              {pullDownActive && (
                <line
                  x1="250"
                  y1="162"
                  x2="250"
                  y2="348"
                  stroke="var(--text-secondary)"
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* GND Symbol */}
              <line x1="226" y1="348" x2="274" y2="348" stroke="var(--signal-low)" strokeWidth="3.5" />
              <line x1="234" y1="355" x2="266" y2="355" stroke="var(--signal-low)" strokeWidth="2.5" />
              <text
                x="250"
                y="372"
                textAnchor="middle"
                fill="var(--svg-text-muted)"
                className="font-mono-tech text-[11px] font-bold"
              >
                GND (0V = 0) — NMOS Series Pull-Down
              </text>

              {/* Input A Control Lines (to P1 and N1) */}
              <path
                d="M 76 101 L 154 101 M 112 101 L 112 223 L 210 223"
                fill="none"
                stroke={inputA === 1 ? fieldColor : 'var(--signal-low)'}
                strokeWidth="2.5"
                strokeDasharray={inputA === 1 ? undefined : '4 3'}
              />

              {/* Input B Control Lines (to P2 and N2) */}
              <path
                d="M 76 301 L 210 301 M 136 301 L 136 144 L 258 144 L 258 101 L 264 101"
                fill="none"
                stroke={inputB === 1 ? fieldColor : 'var(--signal-low)'}
                strokeWidth="2.5"
                strokeDasharray={inputB === 1 ? undefined : '4 3'}
              />

              {/* Input A Badge */}
              <rect
                x="18"
                y="80"
                width="58"
                height="42"
                rx="9"
                fill="var(--svg-node)"
                stroke={inputA === 1 ? fieldColor : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="47" y="97" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                IN A
              </text>
              <text x="47" y="113" textAnchor="middle" fill={inputA === 1 ? fieldColor : 'var(--svg-text)'} className="font-mono-tech text-sm font-bold">
                {inputA}
              </text>

              {/* Input B Badge */}
              <rect
                x="18"
                y="280"
                width="58"
                height="42"
                rx="9"
                fill="var(--svg-node)"
                stroke={inputB === 1 ? fieldColor : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="47" y="297" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                IN B
              </text>
              <text x="47" y="313" textAnchor="middle" fill={inputB === 1 ? fieldColor : 'var(--svg-text)'} className="font-mono-tech text-sm font-bold">
                {inputB}
              </text>

              {/* P1 (controlled by A) */}
              <circle cx="158" cy="101" r="4.5" fill="var(--svg-canvas)" stroke={p1On ? highColor : 'var(--border-strong)'} strokeWidth="2" />
              <rect
                x="163"
                y="72"
                width="64"
                height="58"
                rx="9"
                fill={p1On ? 'rgba(6, 182, 212, 0.16)' : 'var(--svg-node)'}
                stroke={p1On ? highColor : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="195" y="94" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-[11px] font-bold">
                P1 (A)
              </text>
              <text x="195" y="114" textAnchor="middle" fill={p1On ? highColor : 'var(--svg-text-muted)'} className="font-mono-tech text-[11px] font-bold">
                {p1On ? '● ON' : '○ OFF'}
              </text>

              {/* P2 (controlled by B) */}
              <circle cx="268" cy="101" r="4.5" fill="var(--svg-canvas)" stroke={p2On ? highColor : 'var(--border-strong)'} strokeWidth="2" />
              <rect
                x="273"
                y="72"
                width="64"
                height="58"
                rx="9"
                fill={p2On ? 'rgba(6, 182, 212, 0.16)' : 'var(--svg-node)'}
                stroke={p2On ? highColor : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="305" y="94" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-[11px] font-bold">
                P2 (B)
              </text>
              <text x="305" y="114" textAnchor="middle" fill={p2On ? highColor : 'var(--svg-text-muted)'} className="font-mono-tech text-[11px] font-bold">
                {p2On ? '● ON' : '○ OFF'}
              </text>

              {/* N1 (controlled by A) */}
              <rect
                x="212"
                y="196"
                width="76"
                height="54"
                rx="9"
                fill={n1On ? 'rgba(113, 113, 122, 0.24)' : 'var(--svg-node)'}
                stroke={n1On ? 'var(--text-primary)' : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="250" y="218" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-[11px] font-bold">
                N1 (A)
              </text>
              <text x="250" y="236" textAnchor="middle" fill={n1On ? 'var(--svg-text)' : 'var(--svg-text-muted)'} className="font-mono-tech text-[11px] font-bold">
                {n1On ? '● ON' : '○ OFF'}
              </text>

              {/* N2 (controlled by B) */}
              <rect
                x="212"
                y="274"
                width="76"
                height="54"
                rx="9"
                fill={n2On ? 'rgba(113, 113, 122, 0.24)' : 'var(--svg-node)'}
                stroke={n2On ? 'var(--text-primary)' : 'var(--border-strong)'}
                strokeWidth="2"
              />
              <text x="250" y="296" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-[11px] font-bold">
                N2 (B)
              </text>
              <text x="250" y="314" textAnchor="middle" fill={n2On ? 'var(--svg-text)' : 'var(--svg-text-muted)'} className="font-mono-tech text-[11px] font-bold">
                {n2On ? '● ON' : '○ OFF'}
              </text>

              {/* Output Y Badge */}
              <rect
                x="390"
                y="134"
                width="94"
                height="56"
                rx="12"
                fill={pullUpActive ? 'rgba(6, 182, 212, 0.18)' : 'var(--svg-node)'}
                stroke={pullUpActive ? highColor : 'var(--border-strong)'}
                strokeWidth="2.5"
              />
              <text x="437" y="155" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                OUT Y (A NAND B)
              </text>
              <text
                x="437"
                y="177"
                textAnchor="middle"
                fill={pullUpActive ? highColor : 'var(--svg-text-muted)'}
                className="font-mono-tech text-base font-bold"
              >
                {outputY} ({outputY === 1 ? 'HIGH' : 'LOW'})
              </text>
            </svg>
          )}
        </div>

        {/* Right Column: Interactive Switches + Truth Table */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Interactive Toggle Switches */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
            <div className="font-mono-tech text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              ควบคุมสัญญาณอินพุต (Input Switches)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="cmos-toggle-a"
                type="button"
                onClick={() => setInputA((v) => (v === 0 ? 1 : 0))}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition cursor-pointer ${
                  inputA === 1
                    ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/12'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)]'
                }`}
              >
                <div className="text-left">
                  <div className="font-mono-tech text-xs text-[var(--text-muted)]">Input A</div>
                  <div
                    className="font-mono-tech text-lg font-bold"
                    style={{
                      color:
                        inputA === 1
                          ? 'var(--signal-field-bright)'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {inputA} {inputA === 1 ? '(1.2V)' : '(0V)'}
                  </div>
                </div>
                {inputA === 1 ? (
                  <ToggleRight className="h-7 w-7 text-[var(--signal-field-bright)]" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-[var(--text-muted)]" />
                )}
              </button>

              {gateMode === 'nand' && (
                <button
                  id="cmos-toggle-b"
                  type="button"
                  onClick={() => setInputB((v) => (v === 0 ? 1 : 0))}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition cursor-pointer ${
                    inputB === 1
                      ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/12'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)]'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-mono-tech text-xs text-[var(--text-muted)]">Input B</div>
                    <div
                      className="font-mono-tech text-lg font-bold"
                      style={{
                        color:
                          inputB === 1
                            ? 'var(--signal-field-bright)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {inputB} {inputB === 1 ? '(1.2V)' : '(0V)'}
                    </div>
                  </div>
                  {inputB === 1 ? (
                    <ToggleRight className="h-7 w-7 text-[var(--signal-field-bright)]" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-[var(--text-muted)]" />
                  )}
                </button>
              )}
            </div>

            {/* Active Path Summary */}
            <div
              className="rounded-lg px-3.5 py-2.5 text-xs leading-relaxed"
              style={{
                backgroundColor: pullUpActive
                  ? 'rgba(6, 182, 212, 0.12)'
                  : 'rgba(113, 113, 122, 0.14)',
                color: 'var(--text-primary)',
              }}
            >
              <strong>เส้นทางไฟปัจจุบัน:</strong>{' '}
              {pullUpActive
                ? 'Output Y ถูกดึงเชื่อมขึ้นไปที่ VDD (+1.2V) ด้านบน และทางลง GND ถูกตัดขาด → ออกค่า 1 (HIGH)'
                : 'Output Y ถูกดึงเชื่อมลง GND (0V) ด้านล่าง และทางขึ้น VDD ถูกตัดขาดสนิท → ออกค่า 0 (LOW)'}
            </div>
          </div>

          {/* Live Highlighted Truth Table */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="border-b border-[var(--border-subtle)] px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono-tech text-xs font-semibold text-[var(--text-primary)]">
                Truth Table ({gateMode === 'not' ? 'NOT Gate' : 'NAND Gate'})
              </span>
              <span className="font-mono-tech text-[11px] text-[var(--signal-high)]">
                Active Row Highlighted
              </span>
            </div>

            <table className="w-full text-left font-mono-tech text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-[var(--text-muted)]">
                  <th className="px-3 py-2">A</th>
                  {gateMode === 'nand' && <th className="px-3 py-2">B</th>}
                  <th className="px-3 py-2">Y (Out)</th>
                  <th className="px-3 py-2 font-sans">สถานะวงจร</th>
                </tr>
              </thead>
              <tbody>
                {truthRows.map((row, idx) => {
                  const isCurrent =
                    gateMode === 'not'
                      ? row.a === inputA
                      : row.a === inputA && row.b === inputB
                  return (
                    <tr
                      key={idx}
                      onClick={() => {
                        setInputA(row.a)
                        if (row.b !== null) setInputB(row.b)
                      }}
                      className={`border-b border-[var(--border-subtle)] last:border-b-0 transition cursor-pointer ${
                        isCurrent
                          ? 'bg-[var(--signal-high)]/15 font-bold text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/40'
                      }`}
                    >
                      <td className="px-3 py-2">{row.a}</td>
                      {gateMode === 'nand' && <td className="px-3 py-2">{row.b}</td>}
                      <td
                        className="px-3 py-2 font-bold"
                        style={{
                          color:
                            row.y === 1
                              ? 'var(--signal-high-bright)'
                              : 'var(--signal-low)',
                        }}
                      >
                        {row.y}
                      </td>
                      <td className="px-3 py-2 font-sans text-[11px]">{row.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
