import { motion } from 'framer-motion'
import { Atom, Power, Zap } from 'lucide-react'
import { useState } from 'react'

type DopingMode = 'pure' | 'ntype' | 'ptype'

const COLS = [110, 210, 310, 410, 510]
const ROWS = [75, 160, 245]

const MODE_META: Record<
  DopingMode,
  {
    label: string
    badge: string
    carrierText: string
    conductivity: string
    explanationOn: string
    explanationOff: string
  }
> = {
  pure: {
    label: 'Pure Si (บริสุทธิ์)',
    badge: '4 Valence e⁻',
    carrierText: 'ไม่มีพาหะอิสระ (อิเล็กตรอนทุกตัวถูกล็อกในพันธะ)',
    conductivity: '0.00 µA (แทบไม่นำไฟฟ้า)',
    explanationOff:
      'ซิลิคอนทุกอะตอมจับมือแชร์อิเล็กตรอนครบ 8 ตัว (4 พันธะโควาเลนต์) แข็งแรงและเป็นกลางทางไฟฟ้า',
    explanationOn:
      'แม้จ่ายแรงดันไฟฟ้าแล้ว แต่อิเล็กตรอนทั้งหมดถูกตรึงอยู่ในพันธะโควาเลนต์ จึงได้แค่สั่นอยู่กับที่ ไม่เกิดกระแสไหลผ่านผลึก',
  },
  ntype: {
    label: 'N-Type (+P ฟอสฟอรัส)',
    badge: '5 Valence e⁻ (+1 อิสระ)',
    carrierText: 'Free Electrons (e⁻) — พาหะประจุลบอิสระ',
    conductivity: '42.8 mA (นำไฟฟ้าได้ดีมาก)',
    explanationOff:
      'อะตอมฟอสฟอรัส (P) มีเวเลนซ์อิเล็กตรอน 5 ตัว จับพันธะได้ 4 แขน จึงเหลืออิเล็กตรอนส่วนเกินลอยอิสระอยู่รอบผลึก',
    explanationOn:
      'เมื่อจ่ายแรงดันไฟ อิเล็กตรอนอิสระ (สีฟ้า Cyan) ถูกขั้วบวก (+) ทางขวาดูดและขั้วลบ (-) ทางซ้ายผลัก จึงไหลต่อเนื่องเป็นกระแสไฟฟ้าได้ทันที!',
  },
  ptype: {
    label: 'P-Type (+B โบรอน)',
    badge: '3 Valence e⁻ (+1 Hole)',
    carrierText: 'Holes (h⁺) — หลุมประจุบวกที่เคลื่อนที่สวนทาง e⁻',
    conductivity: '31.4 mA (นำไฟฟ้าผ่านการขยับของ Hole)',
    explanationOff:
      'อะตอมโบรอน (B) มีเวเลนซ์อิเล็กตรอนแค่ 3 ตัว ทำให้พันธะขาดอิเล็กตรอนไป 1 ตำแหน่ง เกิดเป็น "หลุมประจุบวก" (Hole)',
    explanationOn:
      'เมื่อจ่ายแรงดัน อิเล็กตรอนจากพันธะข้างเคียงกระโดดมาเติมหลุม (ไปทางขวา) ทำให้ช่องว่าง Hole (สีม่วง) เคลื่อนที่สวนทางไปหาขั้วลบ (-) ทางซ้ายอย่างต่อเนื่อง!',
  },
}

export function SiliconDopingSimulator() {
  const [mode, setMode] = useState<DopingMode>('ntype')
  const [voltageOn, setVoltageOn] = useState<boolean>(true)

  const meta = MODE_META[mode]

  const isDopant = (rowIdx: number, colIdx: number) =>
    (rowIdx === 1 && colIdx === 1) || (rowIdx === 1 && colIdx === 3)

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Controls Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Atom className="h-4.5 w-4.5 text-[var(--signal-high)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: โครงสร้างผลึกซิลิคอน 2D และการโดป
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            ลองสลับชนิดสารกึ่งตัวนำและเปิด-ปิดแรงดันไฟฟ้า เพื่อสังเกตการเคลื่อนที่ของอิเล็กตรอนและหลุมประจุ
          </p>
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(['pure', 'ntype', 'ptype'] as DopingMode[]).map((m) => {
            const active = mode === m
            return (
              <button
                key={m}
                id={`doping-mode-${m}`}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? m === 'ptype'
                      ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]'
                      : m === 'ntype'
                        ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                        : 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {m === 'pure' && 'Pure Si'}
                {m === 'ntype' && 'N-Type (+P)'}
                {m === 'ptype' && 'P-Type (+B)'}
              </button>
            )
          })}

          <button
            id="doping-voltage-toggle"
            type="button"
            onClick={() => setVoltageOn((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              voltageOn
                ? 'border-[var(--signal-high)] bg-[var(--signal-high)] text-zinc-950 shadow-sm'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>{voltageOn ? 'Voltage: ON (+1.2V)' : 'Voltage: OFF (0V)'}</span>
          </button>
        </div>
      </div>

      {/* SVG Crystal Lattice Stage */}
      <div className="simulator-stage p-2 sm:p-4">
        <svg
          viewBox="0 0 620 320"
          className="w-full h-auto max-h-[340px] select-none"
          role="img"
          aria-label="แผนผังโครงสร้างผลึกซิลิคอน 2D แสดงการโดปแบบ Pure, N-Type และ P-Type"
        >
          <defs>
            <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowPurple" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Electrode (-) */}
          <rect
            x="16"
            y="38"
            width="28"
            height="244"
            rx="8"
            fill={voltageOn ? 'rgba(6, 182, 212, 0.14)' : 'var(--svg-node)'}
            stroke={voltageOn ? 'var(--signal-high)' : 'var(--border-strong)'}
            strokeWidth="2"
          />
          <text
            x="30"
            y="156"
            textAnchor="middle"
            fill={voltageOn ? 'var(--signal-high-bright)' : 'var(--svg-text-muted)'}
            className="font-mono-tech text-lg font-bold"
          >
            −
          </text>
          <text
            x="30"
            y="178"
            textAnchor="middle"
            fill="var(--svg-text-muted)"
            className="font-mono-tech text-[9px]"
          >
            GND
          </text>

          {/* Right Electrode (+) */}
          <rect
            x="576"
            y="38"
            width="28"
            height="244"
            rx="8"
            fill={voltageOn ? 'rgba(168, 85, 247, 0.14)' : 'var(--svg-node)'}
            stroke={voltageOn ? 'var(--signal-field)' : 'var(--border-strong)'}
            strokeWidth="2"
          />
          <text
            x="590"
            y="156"
            textAnchor="middle"
            fill={voltageOn ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
            className="font-mono-tech text-lg font-bold"
          >
            +
          </text>
          <text
            x="590"
            y="178"
            textAnchor="middle"
            fill="var(--svg-text-muted)"
            className="font-mono-tech text-[9px]"
          >
            +V
          </text>

          {/* Electric Field Direction Banner when Voltage ON */}
          {voltageOn && (
            <g opacity="0.85">
              <line
                x1="545"
                y1="22"
                x2="75"
                y2="22"
                stroke="var(--signal-field)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <polygon points="75,22 83,18 83,26" fill="var(--signal-field)" />
              <text
                x="310"
                y="17"
                textAnchor="middle"
                fill="var(--signal-field-bright)"
                className="font-mono-tech text-[10px] font-semibold"
              >
                ELECTRIC FIELD (E-FIELD) → ผลัก e⁻ ไปขวา / ดึง Hole ไปซ้าย
              </text>
            </g>
          )}

          {/* Covalent Bond Lines (Horizontal) */}
          {ROWS.map((y, rIdx) =>
            COLS.slice(0, -1).map((x, cIdx) => {
              const xNext = COLS[cIdx + 1]
              const midX = (x + xNext) / 2
              const missingRightBond =
                mode === 'ptype' && rIdx === 1 && (cIdx === 1 || cIdx === 3)
              return (
                <g key={`h-${rIdx}-${cIdx}`}>
                  <line
                    x1={x + 22}
                    y1={y - 5}
                    x2={xNext - 22}
                    y2={y - 5}
                    stroke="var(--svg-wire-off)"
                    strokeWidth="2"
                  />
                  <line
                    x1={x + 22}
                    y1={y + 5}
                    x2={xNext - 22}
                    y2={y + 5}
                    stroke="var(--svg-wire-off)"
                    strokeWidth="2"
                  />
                  {/* Shared Electron Pair dots */}
                  <circle cx={midX - 5} cy={y - 5} r="2.8" fill="var(--svg-text-muted)" />
                  {!missingRightBond ? (
                    <circle cx={midX + 5} cy={y + 5} r="2.8" fill="var(--svg-text-muted)" />
                  ) : (
                    !voltageOn && (
                      <circle
                        cx={midX + 5}
                        cy={y + 5}
                        r="5.5"
                        fill="rgba(168, 85, 247, 0.15)"
                        stroke="var(--signal-field-bright)"
                        strokeWidth="1.8"
                        strokeDasharray="2.5 2"
                      />
                    )
                  )}
                </g>
              )
            })
          )}

          {/* Covalent Bond Lines (Vertical) */}
          {ROWS.slice(0, -1).map((y, rIdx) =>
            COLS.map((x, cIdx) => {
              const yNext = ROWS[rIdx + 1]
              const midY = (y + yNext) / 2
              return (
                <g key={`v-${rIdx}-${cIdx}`}>
                  <line
                    x1={x - 5}
                    y1={y + 22}
                    x2={x - 5}
                    y2={yNext - 22}
                    stroke="var(--svg-wire-off)"
                    strokeWidth="2"
                  />
                  <line
                    x1={x + 5}
                    y1={y + 22}
                    x2={x + 5}
                    y2={yNext - 22}
                    stroke="var(--svg-wire-off)"
                    strokeWidth="2"
                  />
                  <circle cx={x - 5} cy={midY - 4} r="2.6" fill="var(--svg-text-muted)" />
                  <circle cx={x + 5} cy={midY + 4} r="2.6" fill="var(--svg-text-muted)" />
                </g>
              )
            })
          )}

          {/* Silicon / Dopant Atoms */}
          {ROWS.map((y, rIdx) =>
            COLS.map((x, cIdx) => {
              const dopant = isDopant(rIdx, cIdx) && mode !== 'pure'
              const isPhosphorus = dopant && mode === 'ntype'
              const isBoron = dopant && mode === 'ptype'

              const fill = isPhosphorus
                ? 'rgba(6, 182, 212, 0.18)'
                : isBoron
                  ? 'rgba(168, 85, 247, 0.18)'
                  : 'var(--svg-node)'

              const stroke = isPhosphorus
                ? 'var(--signal-high)'
                : isBoron
                  ? 'var(--signal-field)'
                  : 'var(--border-strong)'

              return (
                <g key={`atom-${rIdx}-${cIdx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="22"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={dopant ? 2.5 : 1.5}
                  />
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={
                      isPhosphorus
                        ? 'var(--signal-high-bright)'
                        : isBoron
                          ? 'var(--signal-field-bright)'
                          : 'var(--svg-text)'
                    }
                    className="font-mono-tech text-xs font-bold"
                  >
                    {isPhosphorus ? 'P' : isBoron ? 'B' : 'Si'}
                  </text>
                  <text
                    x={x}
                    y={y + 13}
                    textAnchor="middle"
                    fill="var(--svg-text-muted)"
                    className="font-mono-tech text-[8px]"
                  >
                    {isPhosphorus ? '+5' : isBoron ? '+3' : '+4'}
                  </text>
                </g>
              )
            })
          )}

          {/* Animated Free Electrons for N-Type */}
          {mode === 'ntype' && (
            <g filter="url(#glowCyan)">
              {voltageOn ? (
                <>
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const yTrack = idx % 2 === 0 ? 118 : 202
                    return (
                      <motion.g
                        key={`free-e-${idx}`}
                        initial={{ x: 56 + idx * 95 }}
                        animate={{ x: [56, 560] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.6,
                          delay: idx * 0.52,
                          ease: 'linear',
                        }}
                      >
                        <circle cx={0} cy={yTrack} r="8" fill="var(--signal-high-bright)" />
                        <text
                          x={0}
                          y={yTrack + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#09090B"
                          className="font-mono-tech text-[9px] font-extrabold"
                        >
                          e⁻
                        </text>
                      </motion.g>
                    )
                  })}
                  <path
                    d="M 76 118 L 548 118"
                    stroke="var(--signal-high)"
                    strokeWidth="1.5"
                    className="animate-flow"
                    opacity="0.45"
                  />
                  <path
                    d="M 76 202 L 548 202"
                    stroke="var(--signal-high)"
                    strokeWidth="1.5"
                    className="animate-flow"
                    opacity="0.45"
                  />
                </>
              ) : (
                // Hovering unbound electrons near Phosphorus atoms
                [
                  { cx: 238, cy: 132 },
                  { cx: 438, cy: 132 },
                ].map((pt, idx) => (
                  <motion.g
                    key={`idle-e-${idx}`}
                    animate={{
                      x: [0, 8, -4, 0],
                      y: [0, -7, 6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.2,
                      delay: idx * 0.6,
                      ease: 'easeInOut',
                    }}
                  >
                    <circle cx={pt.cx} cy={pt.cy} r="8" fill="var(--signal-high-bright)" />
                    <text
                      x={pt.cx}
                      y={pt.cy + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#09090B"
                      className="font-mono-tech text-[9px] font-extrabold"
                    >
                      e⁻
                    </text>
                  </motion.g>
                ))
              )}
            </g>
          )}

          {/* Animated Holes for P-Type */}
          {mode === 'ptype' && (
            <g filter="url(#glowPurple)">
              {voltageOn ? (
                <>
                  {[0, 1, 2, 3].map((idx) => {
                    const yTrack = idx % 2 === 0 ? 118 : 202
                    return (
                      <motion.g
                        key={`hole-${idx}`}
                        initial={{ x: 556 }}
                        animate={{ x: [556, 62] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.1,
                          delay: idx * 0.75,
                          ease: 'linear',
                        }}
                      >
                        <circle
                          cx={0}
                          cy={yTrack}
                          r="9"
                          fill="rgba(168, 85, 247, 0.2)"
                          stroke="var(--signal-field-bright)"
                          strokeWidth="2.2"
                          strokeDasharray="3.5 2.5"
                        />
                        <text
                          x={0}
                          y={yTrack + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="var(--signal-field-bright)"
                          className="font-mono-tech text-[9px] font-extrabold"
                        >
                          h⁺
                        </text>
                      </motion.g>
                    )
                  })}
                  <path
                    d="M 548 118 L 76 118"
                    stroke="var(--signal-field)"
                    strokeWidth="1.5"
                    className="animate-flow"
                    opacity="0.45"
                  />
                  <path
                    d="M 548 202 L 76 202"
                    stroke="var(--signal-field)"
                    strokeWidth="1.5"
                    className="animate-flow"
                    opacity="0.45"
                  />
                </>
              ) : (
                <text
                  x="310"
                  y="302"
                  textAnchor="middle"
                  fill="var(--signal-field-bright)"
                  className="font-mono-tech text-[11px]"
                >
                  Hole (ช่องว่างประจุบวก) ประจำที่ข้างอะตอมโบรอน — กดเปิดแรงดันเพื่อดูการเคลื่อนที่
                </text>
              )}
            </g>
          )}

          {/* Pure Si status note inside stage */}
          {mode === 'pure' && (
            <text
              x="310"
              y="302"
              textAnchor="middle"
              fill="var(--svg-text-muted)"
              className="font-mono-tech text-[11px]"
            >
              {voltageOn
                ? 'พันธะโควาเลนต์แน่นหนา 100% → กระแสไหลผ่าน = 0.00 µA'
                : 'ผลึกซิลิคอนบริสุทธิ์ — ไม่มีอิเล็กตรอนส่วนเกินและไม่มี Hole'}
            </text>
          )}
        </svg>
      </div>

      {/* Live Telemetry & Physics Explanation */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
          <div className="font-mono-tech text-[11px] text-[var(--text-muted)]">
            ชนิดพาหะประจุ (Charge Carrier)
          </div>
          <div className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
            {meta.carrierText}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">
              กระแสไฟฟ้า (Current)
            </span>
            <Zap
              className="h-3.5 w-3.5"
              style={{
                color:
                  voltageOn && mode !== 'pure'
                    ? 'var(--signal-high)'
                    : 'var(--signal-low)',
              }}
            />
          </div>
          <div
            className="mt-1 font-mono-tech text-xs font-bold"
            style={{
              color:
                voltageOn && mode !== 'pure'
                  ? mode === 'ptype'
                    ? 'var(--signal-field-bright)'
                    : 'var(--signal-high-bright)'
                  : 'var(--text-muted)',
            }}
          >
            {voltageOn ? meta.conductivity : '0.00 µA (ยังไม่จ่ายแรงดัน)'}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 md:col-span-1">
          <div className="font-mono-tech text-[11px] text-[var(--text-muted)]">
            โครงสร้างเวเลนซ์
          </div>
          <div className="mt-1 font-mono-tech text-xs font-semibold text-[var(--text-primary)]">
            {meta.badge}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)]">สิ่งที่เกิดขึ้นจริง: </span>
        {voltageOn ? meta.explanationOn : meta.explanationOff}
      </div>
    </div>
  )
}
