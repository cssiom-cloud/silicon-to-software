import { motion } from 'framer-motion'
import { Sliders, Zap } from 'lucide-react'
import { useState } from 'react'

type MosType = 'nmos' | 'pmos'

const V_TH = 0.5
const VDD = 1.2

export function MosfetSimulator() {
  const [mosType, setMosType] = useState<MosType>('nmos')
  const [gateVoltage, setGateVoltage] = useState<number>(0.85)

  // NMOS turns ON when Vg >= 0.5V; PMOS turns ON when Vg <= 0.7V (i.e., |Vgs| = VDD - Vg >= 0.5V)
  const effectiveDrive =
    mosType === 'nmos' ? gateVoltage - V_TH : VDD - gateVoltage - V_TH
  const isConducting = effectiveDrive >= 0
  const channelStrength = isConducting
    ? Math.min(1, Math.max(0.15, effectiveDrive / (VDD - V_TH)))
    : 0
  const fieldStrength =
    mosType === 'nmos'
      ? Math.min(1, gateVoltage / VDD)
      : Math.min(1, (VDD - gateVoltage) / VDD)

  const drainCurrentMa = isConducting
    ? (channelStrength * channelStrength * 14.5).toFixed(2)
    : '0.00'

  const channelHeight = isConducting ? 8 + channelStrength * 18 : 0

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header & NMOS/PMOS Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-[var(--signal-field)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Interactive Simulator: หน้าตัดทรานซิสเตอร์ MOSFET
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            เลื่อนแถบแรงดันขา Gate (0V – 1.2V) เพื่อดูสนามไฟฟ้าทะลุชั้นฉนวนสร้าง Inversion Channel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="mosfet-type-nmos"
            type="button"
            onClick={() => {
              setMosType('nmos')
              setGateVoltage(0.85)
            }}
            className={`rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              mosType === 'nmos'
                ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            NMOS (เปิดเมื่อไฟสูง)
          </button>
          <button
            id="mosfet-type-pmos"
            type="button"
            onClick={() => {
              setMosType('pmos')
              setGateVoltage(0.2)
            }}
            className={`rounded-xl border px-3.5 py-2 font-mono-tech text-xs font-semibold transition cursor-pointer ${
              mosType === 'pmos'
                ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            PMOS (เปิดเมื่อไฟต่ำ)
          </button>
        </div>
      </div>

      {/* Voltage Control Bar */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="mosfet-gate-slider"
            className="text-xs font-semibold text-[var(--text-primary)]"
          >
            แรงดันไฟฟ้าขา Gate (<span className="font-mono-tech">V_G</span>)
          </label>
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs text-[var(--text-muted)]">
              Threshold:{' '}
              <strong className="text-[var(--signal-field-bright)]">
                {mosType === 'nmos' ? '≥ 0.50V' : '≤ 0.70V'}
              </strong>
            </span>
            <span
              className="rounded-lg px-2.5 py-1 font-mono-tech text-sm font-bold"
              style={{
                backgroundColor: isConducting
                  ? 'rgba(6, 182, 212, 0.16)'
                  : 'rgba(82, 82, 91, 0.2)',
                color: isConducting
                  ? 'var(--signal-high-bright)'
                  : 'var(--text-secondary)',
              }}
            >
              {gateVoltage.toFixed(2)} V
            </span>
          </div>
        </div>

        <input
          id="mosfet-gate-slider"
          type="range"
          min={0}
          max={1.2}
          step={0.01}
          value={gateVoltage}
          onChange={(e) => setGateVoltage(parseFloat(e.target.value))}
          className="tech-slider"
        />

        <div className="flex items-center justify-between font-mono-tech text-[11px] text-[var(--text-muted)]">
          <button
            type="button"
            onClick={() => setGateVoltage(0)}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            0.00V (LOW / 0)
          </button>
          <span className="text-[var(--signal-field-bright)]">
            {mosType === 'nmos' ? '▲ Vth = 0.50V' : '▲ Vth = 0.70V (|Vgs|=0.5V)'}
          </span>
          <button
            type="button"
            onClick={() => setGateVoltage(1.2)}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            1.20V (HIGH / 1)
          </button>
        </div>
      </div>

      {/* SVG MOSFET Cross-Section */}
      <div className="simulator-stage p-2 sm:p-4">
        <svg
          viewBox="0 0 640 340"
          className="w-full h-auto max-h-[360px] select-none"
          role="img"
          aria-label="แผนผังหน้าตัดโครงสร้างทรานซิสเตอร์ MOSFET"
        >
          <defs>
            <linearGradient id="channelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--signal-high)" stopOpacity="0.95" />
              <stop offset="50%" stopColor="var(--signal-high-bright)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--signal-high)" stopOpacity="0.95" />
            </linearGradient>
            <filter id="mosGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Terminal Wires */}
          {/* Source Wire */}
          <path
            d="M 110 42 L 110 155"
            stroke={isConducting ? 'var(--signal-high)' : 'var(--svg-wire-off)'}
            strokeWidth="4"
          />
          {isConducting && (
            <path
              d="M 110 42 L 110 155"
              stroke="var(--signal-high-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* Drain Wire */}
          <path
            d="M 530 155 L 530 42"
            stroke={isConducting ? 'var(--signal-high)' : 'var(--svg-wire-off)'}
            strokeWidth="4"
          />
          {isConducting && (
            <path
              d="M 530 155 L 530 42"
              stroke="var(--signal-high-bright)"
              strokeWidth="3"
              className="animate-flow"
            />
          )}

          {/* Gate Wire */}
          <path
            d="M 320 26 L 320 96"
            stroke={fieldStrength > 0.1 ? 'var(--signal-field)' : 'var(--svg-wire-off)'}
            strokeWidth="4"
          />

          {/* Terminal Labels */}
          <rect
            x="55"
            y="14"
            width="110"
            height="28"
            rx="8"
            fill="var(--svg-node)"
            stroke={isConducting ? 'var(--signal-high)' : 'var(--border-strong)'}
          />
          <text
            x="110"
            y="32"
            textAnchor="middle"
            fill="var(--svg-text)"
            className="font-mono-tech text-xs font-bold"
          >
            SOURCE
          </text>

          <rect
            x="252"
            y="8"
            width="136"
            height="30"
            rx="8"
            fill="var(--svg-node)"
            stroke={fieldStrength > 0.1 ? 'var(--signal-field)' : 'var(--border-strong)'}
          />
          <text
            x="320"
            y="27"
            textAnchor="middle"
            fill={
              fieldStrength > 0.1
                ? 'var(--signal-field-bright)'
                : 'var(--svg-text-muted)'
            }
            className="font-mono-tech text-xs font-bold"
          >
            GATE ({gateVoltage.toFixed(2)}V)
          </text>

          <rect
            x="475"
            y="14"
            width="110"
            height="28"
            rx="8"
            fill="var(--svg-node)"
            stroke={isConducting ? 'var(--signal-high)' : 'var(--border-strong)'}
          />
          <text
            x="530"
            y="32"
            textAnchor="middle"
            fill="var(--svg-text)"
            className="font-mono-tech text-xs font-bold"
          >
            DRAIN
          </text>

          {/* Substrate Body */}
          <rect
            x="50"
            y="165"
            width="540"
            height="148"
            rx="12"
            fill="var(--svg-substrate)"
            stroke="var(--border-strong)"
            strokeWidth="2"
          />
          <text
            x="320"
            y="286"
            textAnchor="middle"
            fill="var(--svg-text-muted)"
            className="font-mono-tech text-xs font-semibold"
          >
            {mosType === 'nmos'
              ? 'P-TYPE SILICON SUBSTRATE (ฐานซิลิคอนชนิด P — เต็มไปด้วย Hole)'
              : 'N-WELL SILICON SUBSTRATE (ฐานซิลิคอนชนิด N — เต็มไปด้วย e⁻)'}
          </text>

          {/* Gate Metal Electrode */}
          <rect
            x="198"
            y="96"
            width="244"
            height="34"
            rx="6"
            fill={
              fieldStrength > 0.12
                ? 'rgba(168, 85, 247, 0.28)'
                : 'var(--svg-node)'
            }
            stroke={
              fieldStrength > 0.12
                ? 'var(--signal-field-bright)'
                : 'var(--border-strong)'
            }
            strokeWidth="2"
          />
          <text
            x="320"
            y="117"
            textAnchor="middle"
            fill="var(--svg-text)"
            className="font-mono-tech text-[11px] font-bold"
          >
            METAL / POLYSILICON GATE
          </text>

          {/* Oxide Insulator Layer (SiO2) */}
          <rect
            x="198"
            y="130"
            width="244"
            height="35"
            fill="var(--svg-oxide)"
            stroke="var(--signal-field)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <text
            x="320"
            y="151"
            textAnchor="middle"
            fill="var(--signal-field-bright)"
            className="font-mono-tech text-[10px] font-semibold"
          >
            OXIDE INSULATOR (SiO₂ — ฉนวนกันกระแสรั่ว)
          </text>

          {/* Electric Field Lines Penetrating Oxide */}
          {fieldStrength > 0.08 && (
            <g opacity={0.25 + fieldStrength * 0.75} className="animate-field-pulse">
              {[228, 265, 302, 338, 375, 412].map((fx) => (
                <g key={fx}>
                  <line
                    x1={fx}
                    y1={128}
                    x2={fx}
                    y2={166}
                    stroke="var(--signal-field-bright)"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  <polygon
                    points={
                      mosType === 'nmos'
                        ? `${fx},170 ${fx - 4},162 ${fx + 4},162`
                        : `${fx},125 ${fx - 4},133 ${fx + 4},133`
                    }
                    fill="var(--signal-field-bright)"
                  />
                </g>
              ))}
            </g>
          )}

          {/* Source & Drain Wells */}
          <rect
            x="70"
            y="165"
            width="128"
            height="68"
            rx="8"
            fill={
              mosType === 'nmos'
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(168, 85, 247, 0.22)'
            }
            stroke={
              mosType === 'nmos' ? 'var(--signal-high)' : 'var(--signal-field)'
            }
            strokeWidth="2"
          />
          <text
            x="134"
            y="204"
            textAnchor="middle"
            fill="var(--svg-text)"
            className="font-mono-tech text-sm font-bold"
          >
            {mosType === 'nmos' ? 'N⁺ Source' : 'P⁺ Source'}
          </text>

          <rect
            x="442"
            y="165"
            width="128"
            height="68"
            rx="8"
            fill={
              mosType === 'nmos'
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(168, 85, 247, 0.22)'
            }
            stroke={
              mosType === 'nmos' ? 'var(--signal-high)' : 'var(--signal-field)'
            }
            strokeWidth="2"
          />
          <text
            x="506"
            y="204"
            textAnchor="middle"
            fill="var(--svg-text)"
            className="font-mono-tech text-sm font-bold"
          >
            {mosType === 'nmos' ? 'N⁺ Drain' : 'P⁺ Drain'}
          </text>

          {/* Inversion Channel Bridge */}
          <motion.rect
            x="198"
            y="166"
            width="244"
            rx="4"
            fill="url(#channelGrad)"
            filter="url(#mosGlow)"
            animate={{
              height: channelHeight,
              opacity: isConducting ? 0.92 : 0,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          />

          {/* Channel Label */}
          {isConducting ? (
            <text
              x="320"
              y={166 + channelHeight + 18}
              textAnchor="middle"
              fill="var(--signal-high-bright)"
              className="font-mono-tech text-[11px] font-bold"
            >
              INVERSION CHANNEL OPEN ({mosType === 'nmos' ? 'สะพานอิเล็กตรอน N' : 'สะพาน Hole P'})
            </text>
          ) : (
            <text
              x="320"
              y="205"
              textAnchor="middle"
              fill="var(--svg-text-muted)"
              className="font-mono-tech text-[11px]"
            >
              NO CHANNEL — พื้นที่กั้นปิดสนิท กระแสข้ามไม่ได้
            </text>
          )}

          {/* Animated Electron Flow Across Inversion Channel */}
          {isConducting && (
            <g filter="url(#mosGlow)">
              {[0, 1, 2, 3, 4].map((idx) => (
                <motion.circle
                  key={`carrier-${idx}`}
                  cy={166 + channelHeight / 2}
                  r={4.5}
                  fill="#FAFAFA"
                  initial={{ cx: 145 }}
                  animate={{ cx: [145, 495] }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(0.65, 1.8 - channelStrength * 1.1),
                    delay: idx * 0.25,
                    ease: 'linear',
                  }}
                />
              ))}
            </g>
          )}

          {/* Switch State Pill Bottom Right */}
          <rect
            x="220"
            y="304"
            width="200"
            height="26"
            rx="13"
            fill={
              isConducting
                ? 'rgba(6, 182, 212, 0.16)'
                : 'rgba(82, 82, 91, 0.22)'
            }
            stroke={isConducting ? 'var(--signal-high)' : 'var(--border-strong)'}
          />
          <text
            x="320"
            y="321"
            textAnchor="middle"
            fill={
              isConducting
                ? 'var(--signal-high-bright)'
                : 'var(--svg-text-muted)'
            }
            className="font-mono-tech text-[11px] font-bold"
          >
            {isConducting ? 'SWITCH: ON (CONDUCTING)' : 'SWITCH: OFF (CUTOFF)'}
          </text>
        </svg>
      </div>

      {/* Telemetry Readout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <div className="font-mono-tech text-[10px] uppercase text-[var(--text-muted)]">
            Gate Voltage
          </div>
          <div className="mt-1 font-mono-tech text-sm font-bold text-[var(--signal-field-bright)]">
            {gateVoltage.toFixed(2)} V
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <div className="font-mono-tech text-[10px] uppercase text-[var(--text-muted)]">
            Channel Width
          </div>
          <div className="mt-1 font-mono-tech text-sm font-bold text-[var(--signal-high-bright)]">
            {Math.round(channelStrength * 100)}%
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-[10px] uppercase text-[var(--text-muted)]">
              Drain Current
            </span>
            <Zap
              className="h-3.5 w-3.5"
              style={{
                color: isConducting ? 'var(--signal-high)' : 'var(--signal-low)',
              }}
            />
          </div>
          <div className="mt-1 font-mono-tech text-sm font-bold text-[var(--text-primary)]">
            {drainCurrentMa} mA
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <div className="font-mono-tech text-[10px] uppercase text-[var(--text-muted)]">
            Digital Switch
          </div>
          <div
            className="mt-1 font-mono-tech text-sm font-bold"
            style={{
              color: isConducting
                ? 'var(--signal-high-bright)'
                : 'var(--signal-low)',
            }}
          >
            {isConducting ? 'CLOSED (นำกระแส)' : 'OPEN (ตัดกระแส)'}
          </div>
        </div>
      </div>
    </div>
  )
}
