import { motion } from 'framer-motion'
import {
  BatteryCharging,
  Database,
  Eye,
  Power,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type MemoryTab = 'sram' | 'dram' | 'nand'

export function MemorySimulator() {
  const [activeTab, setActiveTab] = useState<MemoryTab>('sram')

  // --- TAB 1: SRAM STATE ---
  const [sramPower, setSramPower] = useState<boolean>(true)
  const [sramBit, setSramBit] = useState<0 | 1 | null>(1)

  const handleSramWrite = (val: 0 | 1) => {
    setSramPower(true)
    setSramBit(val)
  }

  const handleSramPowerToggle = () => {
    setSramPower((prev) => {
      const next = !prev
      if (!next) {
        setSramBit(null)
      }
      return next
    })
  }

  // --- TAB 2: DRAM STATE ---
  const [dramPower, setDramPower] = useState<boolean>(true)
  const [dramCharge, setDramCharge] = useState<number>(92) // 0..100%
  const [dramAutoRefresh, setDramAutoRefresh] = useState<boolean>(false)
  const [dramHistory, setDramHistory] = useState<number[]>([
    98, 95, 92, 88, 85, 81, 78, 98, 95, 92, 92, 92,
  ])
  const [dramRefreshingPulse, setDramRefreshingPulse] = useState<boolean>(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDramCharge((prev) => {
        if (!dramPower) {
          const decayed = Math.max(0, prev - 14)
          setDramHistory((h) => [...h.slice(-23), decayed])
          return decayed
        }
        if (prev <= 0) {
          setDramHistory((h) => [...h.slice(-23), 0])
          return 0
        }
        const next = Math.max(0, prev - 3.6)
        if (dramAutoRefresh && next <= 58 && prev >= 50) {
          setDramRefreshingPulse(true)
          window.setTimeout(() => setDramRefreshingPulse(false), 320)
          setDramHistory((h) => [...h.slice(-23), 100])
          return 100
        }
        setDramHistory((h) => [...h.slice(-23), next])
        return next
      })
    }, 350)

    return () => window.clearInterval(timer)
  }, [dramPower, dramAutoRefresh])

  const handleDramRefresh = () => {
    if (!dramPower) return
    // Real DRAM Sense Amp only refreshes back to 100% if charge is still above threshold (>=50%)
    if (dramCharge >= 50) {
      setDramCharge(100)
      setDramRefreshingPulse(true)
      window.setTimeout(() => setDramRefreshingPulse(false), 350)
    }
  }

  const dramLogicalValue: 0 | 1 = dramCharge >= 50 ? 1 : 0

  // --- TAB 3: NAND FLASH STATE ---
  const [nandTrappedElectrons, setNandTrappedElectrons] = useState<boolean>(false)
  const [nandMode, setNandMode] = useState<'idle' | 'program' | 'erase' | 'poweroff' | 'read'>(
    'idle'
  )

  const handleNandProgram = () => {
    setNandMode('program')
    setNandTrappedElectrons(true)
  }

  const handleNandErase = () => {
    setNandMode('erase')
    setNandTrappedElectrons(false)
  }

  const handleNandPowerOff = () => {
    setNandMode('poweroff')
  }

  const handleNandRead = () => {
    setNandMode('read')
  }

  const nandReadCurrentFlows = nandMode === 'read' && !nandTrappedElectrons

  // Build SVG polyline for DRAM decay graph
  const dramPoints = dramHistory
    .map((val, idx) => {
      const x = 14 + (idx / Math.max(1, dramHistory.length - 1)) * 222
      const y = 104 - (val / 100) * 86
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & 3 Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-[var(--signal-field)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: เปรียบเทียบกลไกหน่วยความจำ 3 แบบ
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            ทดลองเขียนข้อมูล รีเฟรช และ "ตัดไฟ" ในหน่วยความจำทั้ง 3 สถาปัตยกรรมเพื่อเห็นความแตกต่างจริง
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'sram', label: '1. SRAM (Feedback Loop)' },
              { id: 'dram', label: '2. DRAM (Capacitor Tank)' },
              { id: 'nand', label: '3. NAND Flash (Floating Gate)' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                id={`memory-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= TAB 1: SRAM ================= */}
      {activeTab === 'sram' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="sram-write-1"
              type="button"
              onClick={() => handleSramWrite(1)}
              className="rounded-xl border border-[var(--signal-high)] bg-[var(--signal-high)]/15 px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--signal-high-bright)] transition hover:bg-[var(--signal-high)]/25 cursor-pointer"
            >
              Write 1 (ล็อก Q = 1)
            </button>
            <button
              id="sram-write-0"
              type="button"
              onClick={() => handleSramWrite(0)}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--signal-field)] cursor-pointer"
            >
              Write 0 (ล็อก Q = 0)
            </button>
            <button
              id="sram-power-cut"
              type="button"
              onClick={handleSramPowerToggle}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
                sramPower
                  ? 'border-red-500/50 bg-red-500/12 text-red-400 hover:bg-red-500/20'
                  : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{sramPower ? 'ตัดไฟ (Power Off)' : 'จ่ายไฟคืน (Power On)'}</span>
            </button>
          </div>

          <div className="simulator-stage p-3 sm:p-5">
            <svg
              viewBox="0 0 600 280"
              className="w-full h-auto max-h-[290px] select-none"
              role="img"
              aria-label="แผนผังวงจร SRAM แบบ Cross-Coupled NOT Gate Feedback Loop"
            >
              {/* Power Rail Indicator */}
              <rect
                x="18"
                y="14"
                width="175"
                height="28"
                rx="8"
                fill={sramPower ? 'rgba(6, 182, 212, 0.14)' : 'rgba(239, 68, 68, 0.14)'}
                stroke={sramPower ? 'var(--signal-high)' : 'var(--signal-danger)'}
              />
              <text
                x="105"
                y="32"
                textAnchor="middle"
                fill={sramPower ? 'var(--signal-high-bright)' : 'var(--signal-danger)'}
                className="font-mono-tech text-[11px] font-bold"
              >
                {sramPower ? 'VDD POWER: ON (+1.2V)' : 'VDD POWER: CUT (0V)'}
              </text>

              {/* Right Loop Path (Node Q): NOT 1 output -> NOT 2 input */}
              <path
                d="M 352 95 L 502 95 L 502 185 L 358 185"
                fill="none"
                stroke={
                  sramPower && sramBit === 1
                    ? 'var(--signal-high-bright)'
                    : 'var(--svg-wire-off)'
                }
                strokeWidth={sramPower && sramBit === 1 ? 4 : 2.5}
              />
              {sramPower && sramBit === 1 && (
                <path
                  d="M 352 95 L 502 95 L 502 185 L 358 185"
                  fill="none"
                  stroke="var(--signal-high-bright)"
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* Left Loop Path (Node Qbar): NOT 2 output -> NOT 1 input */}
              <path
                d="M 248 185 L 98 185 L 98 95 L 242 95"
                fill="none"
                stroke={
                  sramPower && sramBit === 0
                    ? 'var(--signal-high-bright)'
                    : 'var(--svg-wire-off)'
                }
                strokeWidth={sramPower && sramBit === 0 ? 4 : 2.5}
              />
              {sramPower && sramBit === 0 && (
                <path
                  d="M 248 185 L 98 185 L 98 95 L 242 95"
                  fill="none"
                  stroke="var(--signal-high-bright)"
                  strokeWidth="3"
                  className="animate-flow"
                />
              )}

              {/* Top Inverter: NOT 1 (Left -> Right) */}
              <g>
                <polygon
                  points="242,68 242,122 332,95"
                  fill="var(--svg-node)"
                  stroke={sramPower ? 'var(--signal-high)' : 'var(--border-strong)'}
                  strokeWidth="2.5"
                />
                <circle
                  cx="342"
                  cy="95"
                  r="10"
                  fill="var(--svg-node)"
                  stroke={sramPower ? 'var(--signal-high)' : 'var(--border-strong)'}
                  strokeWidth="2.5"
                />
                <text
                  x="275"
                  y="99"
                  textAnchor="middle"
                  fill="var(--svg-text)"
                  className="font-mono-tech text-xs font-bold"
                >
                  NOT 1
                </text>
              </g>

              {/* Bottom Inverter: NOT 2 (Right -> Left) */}
              <g>
                <polygon
                  points="358,158 358,212 268,185"
                  fill="var(--svg-node)"
                  stroke={sramPower ? 'var(--signal-field)' : 'var(--border-strong)'}
                  strokeWidth="2.5"
                />
                <circle
                  cx="258"
                  cy="185"
                  r="10"
                  fill="var(--svg-node)"
                  stroke={sramPower ? 'var(--signal-field)' : 'var(--border-strong)'}
                  strokeWidth="2.5"
                />
                <text
                  x="325"
                  y="189"
                  textAnchor="middle"
                  fill="var(--svg-text)"
                  className="font-mono-tech text-xs font-bold"
                >
                  NOT 2
                </text>
              </g>

              {/* Node Q Badge */}
              <rect
                x="412"
                y="56"
                width="106"
                height="32"
                rx="8"
                fill={
                  sramPower && sramBit === 1
                    ? 'rgba(6, 182, 212, 0.2)'
                    : 'var(--svg-node)'
                }
                stroke={
                  sramPower && sramBit === 1
                    ? 'var(--signal-high-bright)'
                    : 'var(--border-strong)'
                }
              />
              <text
                x="465"
                y="76"
                textAnchor="middle"
                fill={
                  !sramPower
                    ? 'var(--signal-danger)'
                    : sramBit === 1
                      ? 'var(--signal-high-bright)'
                      : 'var(--svg-text-muted)'
                }
                className="font-mono-tech text-xs font-bold"
              >
                {sramPower && sramBit !== null ? `Node Q = ${sramBit}` : 'Q = LOST (0V)'}
              </text>

              {/* Node Qbar Badge */}
              <rect
                x="82"
                y="224"
                width="124"
                height="32"
                rx="8"
                fill={
                  sramPower && sramBit === 0
                    ? 'rgba(6, 182, 212, 0.2)'
                    : 'var(--svg-node)'
                }
                stroke={
                  sramPower && sramBit === 0
                    ? 'var(--signal-high-bright)'
                    : 'var(--border-strong)'
                }
              />
              <text
                x="144"
                y="244"
                textAnchor="middle"
                fill={
                  !sramPower
                    ? 'var(--signal-danger)'
                    : sramBit === 0
                      ? 'var(--signal-high-bright)'
                      : 'var(--svg-text-muted)'
                }
                className="font-mono-tech text-xs font-bold"
              >
                {sramPower && sramBit !== null
                  ? `Node Q̄ = ${sramBit === 1 ? 0 : 1}`
                  : 'Q̄ = LOST (0V)'}
              </text>

              {/* Stored State Banner */}
              <text
                x="395"
                y="250"
                textAnchor="middle"
                fill={
                  !sramPower || sramBit === null
                    ? 'var(--signal-danger)'
                    : 'var(--svg-text)'
                }
                className="font-mono-tech text-xs font-bold"
              >
                {!sramPower
                  ? '⚠ ตัดไฟแล้ว: ลูปย้อนกลับดับสนิท ข้อมูลหายทันที!'
                  : sramBit === null
                    ? 'เพิ่งเปิดไฟคืน — กด Write 0 หรือ Write 1 เพื่อล็อกค่าใหม่'
                    : `FEEDBACK LOOP LOCKED: เก็บค่า ${sramBit} ถาวรตราบที่มีไฟเลี้ยง`}
              </text>
            </svg>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 px-4 py-3 text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">กลไก SRAM (CPU L1/L2/L3 Cache):</strong>{' '}
            NOT Gate สองตัวคอยตอกย้ำค่าตรงข้ามให้กันและกันตลอดเวลา (Q = 1 → NOT 2 กลับเป็น 0 → NOT 1 กลับเป็น 1 วนไม่รู้จบ) จึงเร็วระดับนาโนวินาทีและไม่ต้อง Refresh แต่กินพื้นที่ถึง 6 ทรานซิสเตอร์ต่อ 1 บิต และหายทันทีที่ตัดไฟ
          </div>
        </div>
      )}

      {/* ================= TAB 2: DRAM ================= */}
      {activeTab === 'dram' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="dram-write-1"
              type="button"
              onClick={() => {
                setDramPower(true)
                setDramCharge(100)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--signal-high)] bg-[var(--signal-high)]/15 px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--signal-high-bright)] cursor-pointer"
            >
              <BatteryCharging className="h-3.5 w-3.5" />
              <span>Write 1 (ชาร์จ 100%)</span>
            </button>
            <button
              id="dram-write-0"
              type="button"
              onClick={() => {
                setDramPower(true)
                setDramCharge(0)
              }}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
            >
              Write 0 (คายประจุ 0%)
            </button>
            <button
              id="dram-refresh-btn"
              type="button"
              onClick={handleDramRefresh}
              disabled={!dramPower || dramCharge < 50}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--signal-field)] bg-[var(--signal-field)]/15 px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--signal-field-bright)] transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${dramRefreshingPulse ? 'animate-spin' : ''}`} />
              <span>Refresh (เติมไฟ)</span>
            </button>
            <button
              id="dram-auto-refresh"
              type="button"
              onClick={() => setDramAutoRefresh((v) => !v)}
              className={`rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
                dramAutoRefresh
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
              }`}
            >
              Auto-Refresh: {dramAutoRefresh ? 'ON (64ms)' : 'OFF'}
            </button>
            <button
              id="dram-power-cut"
              type="button"
              onClick={() => setDramPower((p) => !p)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold cursor-pointer ${
                dramPower
                  ? 'border-red-500/50 bg-red-500/12 text-red-400'
                  : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{dramPower ? 'ตัดไฟ' : 'จ่ายไฟคืน'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* 1T1C Capacitor Tank SVG */}
            <div className="simulator-stage p-3 lg:col-span-7">
              <svg
                viewBox="0 0 420 250"
                className="w-full h-auto max-h-[260px] select-none"
                role="img"
                aria-label="แผนผังเซลล์ DRAM 1T1C แสดงตัวเก็บประจุที่ค่อยๆ รั่วไหล"
              >
                {/* Bitline */}
                <line
                  x1="36"
                  y1="100"
                  x2="132"
                  y2="100"
                  stroke={dramRefreshingPulse ? 'var(--signal-high-bright)' : 'var(--border-strong)'}
                  strokeWidth="4"
                />
                <text x="42" y="88" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px] font-bold">
                  BITLINE
                </text>

                {/* Wordline to Access FET */}
                <line
                  x1="176"
                  y1="26"
                  x2="176"
                  y2="72"
                  stroke={dramRefreshingPulse ? 'var(--signal-field-bright)' : 'var(--svg-wire-off)'}
                  strokeWidth="3.5"
                />
                <text x="176" y="18" textAnchor="middle" fill="var(--signal-field-bright)" className="font-mono-tech text-[10px] font-bold">
                  WORDLINE (Access FET)
                </text>

                {/* Access Transistor */}
                <rect
                  x="132"
                  y="72"
                  width="88"
                  height="56"
                  rx="10"
                  fill={dramRefreshingPulse ? 'rgba(168, 85, 247, 0.2)' : 'var(--svg-node)'}
                  stroke={dramRefreshingPulse ? 'var(--signal-field-bright)' : 'var(--border-strong)'}
                  strokeWidth="2"
                />
                <text x="176" y="96" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
                  1T FET
                </text>
                <text x="176" y="114" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                  {dramRefreshingPulse ? 'REFRESHING!' : 'ISOLATED'}
                </text>

                {/* Wire FET -> Capacitor Tank */}
                <path
                  d="M 220 100 L 296 100 L 296 122"
                  fill="none"
                  stroke={dramCharge >= 50 ? 'var(--signal-high-bright)' : 'var(--svg-wire-off)'}
                  strokeWidth="3.5"
                />

                {/* Capacitor Tank Body */}
                <rect
                  x="246"
                  y="122"
                  width="100"
                  height="104"
                  rx="12"
                  fill="var(--svg-node)"
                  stroke={
                    dramCharge >= 50
                      ? 'var(--signal-high)'
                      : dramCharge > 0
                        ? 'var(--signal-warn)'
                        : 'var(--border-strong)'
                  }
                  strokeWidth="2.5"
                />

                {/* Liquid Charge Level inside Tank */}
                <rect
                  x="250"
                  y={126 + (100 - dramCharge) * 0.96}
                  width="92"
                  height={Math.max(0, dramCharge * 0.96)}
                  rx="8"
                  fill={
                    dramCharge >= 50
                      ? 'rgba(6, 182, 212, 0.35)'
                      : 'rgba(245, 158, 11, 0.32)'
                  }
                />

                {/* 50% Sense Threshold dashed line */}
                <line
                  x1="242"
                  y1="174"
                  x2="354"
                  y2="174"
                  stroke="var(--signal-danger)"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <text x="358" y="177" fill="var(--signal-danger)" className="font-mono-tech text-[9px] font-bold">
                  50% V_th
                </text>

                {/* Charge % Text */}
                <text
                  x="296"
                  y="165"
                  textAnchor="middle"
                  fill="var(--svg-text)"
                  className="font-mono-tech text-lg font-bold"
                >
                  {Math.round(dramCharge)}%
                </text>
                <text
                  x="296"
                  y="194"
                  textAnchor="middle"
                  fill={dramLogicalValue === 1 ? 'var(--signal-high-bright)' : 'var(--signal-danger)'}
                  className="font-mono-tech text-xs font-bold"
                >
                  BIT = {dramLogicalValue}
                </text>

                {/* Leakage droplets animation when charge > 0 */}
                {dramCharge > 0 && (
                  <g>
                    <motion.circle
                      cx="296"
                      r="3"
                      fill="var(--signal-warn)"
                      initial={{ cy: 228, opacity: 0.9 }}
                      animate={{ cy: [228, 246], opacity: [0.9, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: 'easeIn' }}
                    />
                    <text x="296" y="244" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[9px]">
                      Leakage Current (รั่วออกต่อเนื่อง)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Live Decay Chart */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs font-semibold text-[var(--text-primary)]">
                  กราฟระดับประจุตามเวลาจริง
                </span>
                <span
                  className="rounded px-2 py-0.5 font-mono-tech text-[11px] font-bold"
                  style={{
                    backgroundColor:
                      dramLogicalValue === 1
                        ? 'rgba(6, 182, 212, 0.16)'
                        : 'rgba(239, 68, 68, 0.16)',
                    color:
                      dramLogicalValue === 1
                        ? 'var(--signal-high-bright)'
                        : 'var(--signal-danger)',
                  }}
                >
                  อ่านได้: {dramLogicalValue}
                </span>
              </div>

              <svg viewBox="0 0 250 120" className="w-full h-32 rounded-lg bg-[var(--svg-canvas)] border border-[var(--border-subtle)]">
                {/* 50% threshold */}
                <line
                  x1="12"
                  y1="61"
                  x2="238"
                  y2="61"
                  stroke="var(--signal-danger)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <text x="16" y="56" fill="var(--signal-danger)" className="font-mono-tech text-[9px]">
                  Threshold (50%) — ต่ำกว่านี้ถือเป็น 0!
                </text>
                <polyline
                  fill="none"
                  stroke={dramLogicalValue === 1 ? 'var(--signal-high-bright)' : 'var(--signal-warn)'}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  points={dramPoints}
                />
              </svg>

              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {dramCharge < 50 ? (
                  <span className="text-amber-400 font-medium">
                    <ShieldAlert className="inline h-3.5 w-3.5 mr-1" />
                    ประจุรั่วต่ำกว่า 50% แล้ว! Sense Amplifier จะอ่านเป็น 0 และ Refresh กู้คืนไม่ได้ ต้องกด Write 1 ใหม่
                  </span>
                ) : (
                  <span>
                    ตัวเก็บประจุกำลังรั่วออกทีละนิด ลองกด <strong>Refresh</strong> ก่อนตกเส้นแดง หรือเปิด{' '}
                    <strong>Auto-Refresh</strong> เหมือนที่ RAM จริงทำทุก 64ms
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: NAND FLASH ================= */}
      {activeTab === 'nand' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="nand-program-btn"
              type="button"
              onClick={handleNandProgram}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--signal-field)] bg-[var(--signal-field)]/15 px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--signal-field-bright)] transition hover:bg-[var(--signal-field)]/25 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Program (อัดไฟสูง +20V)</span>
            </button>
            <button
              id="nand-erase-btn"
              type="button"
              onClick={handleNandErase}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--signal-high)] cursor-pointer"
            >
              Erase (ดึง e⁻ ออก -20V)
            </button>
            <button
              id="nand-poweroff-btn"
              type="button"
              onClick={handleNandPowerOff}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/12 px-3.5 py-2 font-mono-tech text-xs font-semibold text-amber-400 hover:bg-amber-500/20 cursor-pointer"
            >
              <Power className="h-3.5 w-3.5" />
              <span>ตัดไฟ (Power Off 0V)</span>
            </button>
            <button
              id="nand-read-btn"
              type="button"
              onClick={handleNandRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--signal-high)] bg-[var(--signal-high)]/15 px-3.5 py-2 font-mono-tech text-xs font-semibold text-[var(--signal-high-bright)] hover:bg-[var(--signal-high)]/25 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Read (จ่าย V_read 5V)</span>
            </button>
          </div>

          <div className="simulator-stage p-3 sm:p-4">
            <svg
              viewBox="0 0 640 330"
              className="w-full h-auto max-h-[340px] select-none"
              role="img"
              aria-label="แผนผังโครงสร้าง NAND Flash Floating Gate และ Quantum Tunneling"
            >
              {/* Control Gate Voltage Header */}
              <rect
                x="198"
                y="16"
                width="244"
                height="34"
                rx="8"
                fill={
                  nandMode === 'program' || nandMode === 'erase'
                    ? 'rgba(168, 85, 247, 0.25)'
                    : nandMode === 'read'
                      ? 'rgba(6, 182, 212, 0.2)'
                      : 'var(--svg-node)'
                }
                stroke={
                  nandMode === 'program' || nandMode === 'erase'
                    ? 'var(--signal-field-bright)'
                    : nandMode === 'read'
                      ? 'var(--signal-high-bright)'
                      : 'var(--border-strong)'
                }
                strokeWidth="2"
              />
              <text
                x="320"
                y="37"
                textAnchor="middle"
                fill="var(--svg-text)"
                className="font-mono-tech text-xs font-bold"
              >
                CONTROL GATE:{' '}
                {nandMode === 'program'
                  ? '+20V (HIGH VOLTAGE!)'
                  : nandMode === 'erase'
                    ? '-20V (ERASE PULSE)'
                    : nandMode === 'read'
                      ? '+5V (V_read)'
                      : '0V (POWER OFF)'}
              </text>

              {/* Blocking Oxide */}
              <rect
                x="198"
                y="54"
                width="244"
                height="24"
                fill="var(--svg-oxide)"
                stroke="var(--signal-field)"
                strokeOpacity="0.45"
              />
              <text x="320" y="70" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                BLOCKING OXIDE (ฉนวนบน)
              </text>

              {/* Floating Gate (Electron Trap Cage) */}
              <rect
                x="198"
                y="82"
                width="244"
                height="56"
                rx="8"
                fill={
                  nandTrappedElectrons
                    ? 'rgba(168, 85, 247, 0.22)'
                    : 'var(--svg-node)'
                }
                stroke={
                  nandTrappedElectrons
                    ? 'var(--signal-field-bright)'
                    : 'var(--border-strong)'
                }
                strokeWidth="2.5"
              />
              <text
                x="320"
                y="101"
                textAnchor="middle"
                fill={nandTrappedElectrons ? 'var(--signal-field-bright)' : 'var(--svg-text-muted)'}
                className="font-mono-tech text-[10px] font-bold"
              >
                FLOATING GATE (กรงขังอิเล็กตรอนไร้สายไฟ)
              </text>

              {/* Trapped Electrons Inside Floating Gate */}
              {nandTrappedElectrons ? (
                <g>
                  {[230, 266, 302, 338, 374, 410].map((ex) => (
                    <g key={ex}>
                      <circle cx={ex} cy={121} r="8" fill="var(--signal-field-bright)" />
                      <text
                        x={ex}
                        y={122}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#09090B"
                        className="font-mono-tech text-[9px] font-extrabold"
                      >
                        e⁻
                      </text>
                    </g>
                  ))}
                </g>
              ) : (
                <text x="320" y="124" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[11px]">
                  [ กรงว่างเปล่า — ไม่มีอิเล็กตรอนถูกขัง ]
                </text>
              )}

              {/* Tunnel Oxide */}
              <rect
                x="198"
                y="142"
                width="244"
                height="34"
                fill="var(--svg-oxide)"
                stroke="var(--signal-field)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="320" y="163" textAnchor="middle" fill="var(--signal-field-bright)" className="font-mono-tech text-[10px] font-bold">
                TUNNEL OXIDE (~8nm — ทะลุด้วย Quantum Tunneling)
              </text>

              {/* Quantum Tunneling Animation During Program or Erase */}
              {nandMode === 'program' && (
                <g>
                  {[248, 320, 392].map((tx, i) => (
                    <g key={tx} className="animate-tunnel-in" style={{ animationDelay: `${i * 0.22}s` }}>
                      <circle cx={tx} cy={158} r="6.5" fill="var(--signal-high-bright)" />
                      <text x={tx} y={161} textAnchor="middle" fill="#09090B" className="font-mono-tech text-[8px] font-bold">
                        e⁻
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {nandMode === 'erase' && (
                <g>
                  {[248, 320, 392].map((tx, i) => (
                    <g key={tx} className="animate-tunnel-out" style={{ animationDelay: `${i * 0.22}s` }}>
                      <circle cx={tx} cy={158} r="6.5" fill="var(--signal-field-bright)" />
                    </g>
                  ))}
                </g>
              )}

              {/* P-Substrate + Source/Drain */}
              <rect
                x="56"
                y="180"
                width="528"
                height="132"
                rx="12"
                fill="var(--svg-substrate)"
                stroke="var(--border-strong)"
                strokeWidth="2"
              />
              <rect
                x="76"
                y="180"
                width="122"
                height="60"
                rx="8"
                fill="rgba(6, 182, 212, 0.18)"
                stroke="var(--signal-high)"
                strokeWidth="2"
              />
              <text x="137" y="214" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
                N⁺ Source
              </text>

              <rect
                x="442"
                y="180"
                width="122"
                height="60"
                rx="8"
                fill="rgba(6, 182, 212, 0.18)"
                stroke="var(--signal-high)"
                strokeWidth="2"
              />
              <text x="503" y="214" textAnchor="middle" fill="var(--svg-text)" className="font-mono-tech text-xs font-bold">
                N⁺ Drain
              </text>

              {/* Channel Conducting when READ & Floating Gate Empty */}
              {nandReadCurrentFlows && (
                <g>
                  <rect
                    x="198"
                    y="182"
                    width="244"
                    height="22"
                    rx="4"
                    fill="var(--signal-high)"
                    opacity="0.85"
                  />
                  <line
                    x1="150"
                    y1="193"
                    x2="490"
                    y2="193"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="animate-flow"
                  />
                </g>
              )}

              {/* Status Banner inside Substrate */}
              <text
                x="320"
                y="265"
                textAnchor="middle"
                fill={
                  nandMode === 'read'
                    ? nandReadCurrentFlows
                      ? 'var(--signal-high-bright)'
                      : 'var(--signal-field-bright)'
                    : 'var(--svg-text)'
                }
                className="font-mono-tech text-xs font-bold"
              >
                {nandMode === 'program' &&
                  '⚡ QUANTUM TUNNELING: อิเล็กตรอนทะลุฉนวนเข้าไปขังในกรง Floating Gate → เก็บค่า 0'}
                {nandMode === 'erase' &&
                  '⚡ ERASE (-20V): อิเล็กตรอนทะลุกลับลงฐานซิลิคอน กรงว่างเปล่า → รีเซ็ตเป็น 1'}
                {nandMode === 'poweroff' &&
                  (nandTrappedElectrons
                    ? '✓ ตัดไฟ 0V แล้ว แต่อิเล็กตรอนยังติดในกรงฉนวนครบทุกตัว! (Non-Volatile Memory)'
                    : '✓ ตัดไฟ 0V แล้ว กรงยังคงว่างเปล่าเหมือนเดิม (เก็บค่า 1 ถาวร)')}
                {nandMode === 'read' &&
                  (nandReadCurrentFlows
                    ? 'READ (V_read = 5V): ไม่มี e⁻ ขวาง → สะพานเปิด กระแสไหลผ่าน → อ่านได้ "1"'
                    : 'READ (V_read = 5V): e⁻ ในกรงต้านสนามไฟฟ้า → กระแสไม่ไหล → อ่านได้ "0"')}
                {nandMode === 'idle' &&
                  'กด [Program] เพื่อยิงอิเล็กตรอนเข้ากรง แล้วลองกด [ตัดไฟ] และ [Read]'}
              </text>

              <text x="320" y="294" textAnchor="middle" fill="var(--svg-text-muted)" className="font-mono-tech text-[10px]">
                สถานะบิตในเซลล์ NAND ปัจจุบัน: {nandTrappedElectrons ? '0 (Programmed — มี e⁻ ขังอยู่)' : '1 (Erased — กรงว่าง)'}
              </text>
            </svg>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 px-4 py-3 text-sm text-[var(--text-secondary)]">
            <Zap className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[var(--signal-field)]" />
            <p>
              <strong className="text-[var(--text-primary)]">ทำไม SSD ไม่ต้องใช้ไฟเลี้ยง?</strong>{' '}
              เพราะชั้น Floating Gate ถูกห่อหุ้มด้วยฉนวนออกไซด์ทั้งบนและล่าง เมื่อหยุดจ่ายไฟสูง 20V อิเล็กตรอนที่ทะลุเข้าไปด้วย{' '}
              <span className="font-mono-tech text-[var(--signal-field-bright)]">Quantum Tunneling</span>{' '}
              จะไม่มีพลังงานพอจะหนีออกมาได้ จึงเก็บไฟล์และรูปถ่ายของคุณไว้ได้นานนับสิบปี!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
