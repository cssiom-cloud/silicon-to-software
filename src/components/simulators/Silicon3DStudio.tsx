import {
  ArrowUpRight,
  Atom,
  Box,
  Cpu,
  Eye,
  HardDrive,
  Layers,
  Maximize2,
  Minimize2,
  Palette,
  Power,
  RotateCcw,
  RotateCw,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  buildCpuDieScene,
  buildCrystalScene,
  buildMosfetScene,
  buildNandScene,
  type Built3DModel,
  type Model3DId,
  type PaletteId,
  type PartInfo,
  type RenderStyle,
  type StudioParams,
} from './three/sceneBuilders'

interface Silicon3DStudioProps {
  theme: 'dark' | 'light'
  onNavigateLayer: (layerId: string) => void
}

const MODEL_TABS: Array<{
  id: Model3DId
  label: string
  shortLabel: string
  subtitle: string
  Icon: typeof Cpu
}> = [
  {
    id: 'mosfet',
    label: 'MOSFET 3D',
    shortLabel: 'MOSFET',
    subtitle: 'สวิตช์สนามไฟฟ้า + Inversion Channel',
    Icon: Sliders,
  },
  {
    id: 'crystal',
    label: 'ผลึกซิลิคอน 3D',
    shortLabel: 'Crystal',
    subtitle: 'โครงสร้างอะตอม 3×3×3 + การโดป',
    Icon: Atom,
  },
  {
    id: 'nand',
    label: 'NAND Flash 3D',
    shortLabel: 'NAND',
    subtitle: 'กรง Floating Gate + Quantum Tunneling',
    Icon: HardDrive,
  },
  {
    id: 'cpu',
    label: 'ชิป CPU Die 3D',
    shortLabel: 'CPU Die',
    subtitle: 'ALU + Cache + Decoder + Data Bus',
    Icon: Cpu,
  },
]

const CAMERA_PRESETS = {
  iso: { pos: [6.4, 4.6, 6.8] as const, target: [0, 0, 0] as const },
  front: { pos: [0, 0.8, 8.6] as const, target: [0, 0, 0] as const },
  top: { pos: [0.01, 9.2, 0.6] as const, target: [0, 0, 0] as const },
}

export function Silicon3DStudio({ theme, onNavigateLayer }: Silicon3DStudioProps) {
  const [model, setModel] = useState<Model3DId>('mosfet')
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('solid')
  const [palette, setPalette] = useState<PaletteId>('cyber')
  const [exploded, setExploded] = useState<number>(0.15)
  const [speed, setSpeed] = useState<number>(1.2)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [selectedPart, setSelectedPart] = useState<PartInfo | null>(null)

  // Model-specific interactive physics state
  const [mosType, setMosType] = useState<'nmos' | 'pmos'>('nmos')
  const [gateVoltage, setGateVoltage] = useState<number>(0.9)
  const [dopingMode, setDopingMode] = useState<'pure' | 'ntype' | 'ptype'>('ntype')
  const [crystalVoltageOn, setCrystalVoltageOn] = useState<boolean>(true)
  const [nandState, setNandState] = useState<'erased' | 'programmed'>('programmed')
  const [nandAction, setNandAction] = useState<'idle' | 'program' | 'erase' | 'poweroff' | 'read'>(
    'program'
  )
  const [cpuClockSpeed, setCpuClockSpeed] = useState<number>(1.4)

  const mountRef = useRef<HTMLDivElement | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const activeModelRef = useRef<Built3DModel | null>(null)

  // Keep latest reactive params in a ref for smooth 60fps animation loop without recreating WebGL context
  const paramsRef = useRef<StudioParams>({
    model,
    theme,
    renderStyle,
    palette,
    exploded,
    speed,
    mosType,
    gateVoltage,
    dopingMode,
    crystalVoltageOn,
    nandState,
    nandAction,
    cpuClockSpeed,
  })

  useEffect(() => {
    paramsRef.current = {
      model,
      theme,
      renderStyle,
      palette,
      exploded,
      speed,
      mosType,
      gateVoltage,
      dopingMode,
      crystalVoltageOn,
      nandState,
      nandAction,
      cpuClockSpeed,
    }
  }, [
    model,
    theme,
    renderStyle,
    palette,
    exploded,
    speed,
    mosType,
    gateVoltage,
    dopingMode,
    crystalVoltageOn,
    nandState,
    nandAction,
    cpuClockSpeed,
  ])

  const setCameraPreset = useCallback((presetKey: keyof typeof CAMERA_PRESETS) => {
    const cam = cameraRef.current
    const ctrl = controlsRef.current
    if (!cam || !ctrl) return
    const preset = CAMERA_PRESETS[presetKey]
    cam.position.set(preset.pos[0], preset.pos[1], preset.pos[2])
    ctrl.target.set(preset.target[0], preset.target[1], preset.target[2])
    ctrl.update()
  }, [])

  // Sync Auto-Rotate flag with OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  // Escape key exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  // Update scene background on Dark/Light theme change
  useEffect(() => {
    if (!sceneRef.current) return
    sceneRef.current.background = new THREE.Color(theme === 'dark' ? 0x0b0b11 : 0xf1f5f9)
  }, [theme])

  // Initialize WebGLRenderer, Camera, Lights, OrbitControls once
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(paramsRef.current.theme === 'dark' ? 0x0b0b11 : 0xf1f5f9)
    sceneRef.current = scene

    const width = container.clientWidth || 640
    const height = container.clientHeight || 420
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(6.4, 4.6, 6.8)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Lighting Studio Rig
    const ambient = new THREE.AmbientLight(0xffffff, 0.72)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35)
    keyLight.position.set(7, 11, 8)
    scene.add(keyLight)

    const rimCyan = new THREE.PointLight(0x06b6d4, 1.8, 22)
    rimCyan.position.set(-6, 3, -5)
    scene.add(rimCyan)

    const rimPurple = new THREE.PointLight(0xa855f7, 1.5, 22)
    rimPurple.position.set(6, -2, -5)
    scene.add(rimPurple)

    // Subtle reference floor ring
    const floorRingGeo = new THREE.RingGeometry(4.1, 4.18, 64)
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0x3f3f46,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    })
    const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat)
    floorRing.rotation.x = -Math.PI / 2
    floorRing.position.y = -2.45
    scene.add(floorRing)

    // OrbitControls — Touch 1-finger rotate, 2-finger pinch zoom & pan
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = true
    controls.minDistance = 4.0
    controls.maxDistance = 16.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.9
    controlsRef.current = controls

    // Tap / Click Raycasting (distinguish drag vs tap)
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let downX = 0
    let downY = 0

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX
      downY = e.clientY
    }

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY)
      if (dist > 7) return // User was dragging to orbit, not tapping

      const built = activeModelRef.current
      if (!built) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const hits = raycaster.intersectObjects(built.clickableMeshes, false)
      if (hits.length > 0) {
        const part = hits[0].object.userData.partInfo as PartInfo | undefined
        if (part) {
          setSelectedPart(part)
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)

    // Responsive ResizeObserver (handles mobile orientation change & fullscreen toggle)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(200, Math.floor(entry.contentRect.width))
        const h = Math.max(200, Math.floor(entry.contentRect.height))
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    // Animation Loop
    let rafId = 0
    let lastTime = performance.now()
    const startTime = lastTime

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate)
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const elapsed = (now - startTime) / 1000

      controls.update()
      if (activeModelRef.current) {
        activeModelRef.current.update(dt, elapsed, paramsRef.current)
      }
      renderer.render(scene, camera)
    }
    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointerup', handlePointerUp)
      controls.dispose()
      floorRingGeo.dispose()
      floorRingMat.dispose()
      if (activeModelRef.current) {
        scene.remove(activeModelRef.current.group)
        activeModelRef.current.dispose()
        activeModelRef.current = null
      }
      renderer.dispose()
    }
  }, [])

  // Swap 3D Model cleanly whenever `model` tab changes
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (activeModelRef.current) {
      scene.remove(activeModelRef.current.group)
      activeModelRef.current.dispose()
      activeModelRef.current = null
    }

    const builders: Record<Model3DId, (p: StudioParams) => Built3DModel> = {
      mosfet: buildMosfetScene,
      crystal: buildCrystalScene,
      nand: buildNandScene,
      cpu: buildCpuDieScene,
    }

    const built = builders[model](paramsRef.current)
    scene.add(built.group)
    activeModelRef.current = built
    setSelectedPart(null)
  }, [model])

  const mosConducting =
    mosType === 'nmos' ? gateVoltage >= 0.5 : 1.2 - gateVoltage >= 0.5

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 flex flex-col bg-[var(--bg-page)] p-3 sm:p-5 overflow-y-auto'
          : 'glass-panel rounded-2xl p-4 sm:p-6 space-y-5'
      }
    >
      {/* Top Bar: Model Switcher Tabs + Fullscreen Button */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Interactive 3D Silicon Studio (หมุนได้ 360° & ปรับแต่งอิสระ)
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                รองรับทั้งนิ้วแตะบนมือถือและเมาส์บนคอม • แตะชิ้นส่วน 3D เพื่อดูคำอธิบายทันที
              </p>
            </div>
          </div>

          <button
            id="studio-3d-fullscreen-btn"
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? 'ย่อขนาด 3D Studio' : 'ขยายเต็มจอ 3D Studio'}
            className="inline-flex lg:hidden h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-primary)] active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{isFullscreen ? 'ย่อ' : 'เต็มจอ'}</span>
          </button>
        </div>

        {/* 4 Switchable 3D Model Tabs (scrollable smoothly on narrow phones) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {MODEL_TABS.map((tab) => {
            const active = model === tab.id
            const Icon = tab.Icon
            return (
              <button
                key={tab.id}
                id={`studio-3d-tab-${tab.id}`}
                type="button"
                onClick={() => setModel(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                  active
                    ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/16 text-[var(--signal-high-bright)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            className="hidden lg:inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--signal-high)] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{isFullscreen ? 'ออกจากเต็มจอ' : 'ขยายเต็มจอ'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: 3D Viewport (Left/Top) + Customization Controls (Right/Bottom) */}
      <div
        className={`grid grid-cols-1 gap-4 lg:grid-cols-12 ${
          isFullscreen ? 'flex-1 mt-3 min-h-0' : ''
        }`}
      >
        {/* 3D WebGL Viewport Container */}
        <div className="relative lg:col-span-8 flex flex-col">
          <div
            className={`relative w-full overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--svg-canvas)] ${
              isFullscreen
                ? 'h-[52vh] lg:h-full min-h-[340px]'
                : 'h-[340px] sm:h-[430px] lg:h-[500px]'
            }`}
          >
            {/* Three.js Canvas Mount — touch-none for smooth 1-finger orbit & 2-finger pinch */}
            <div
              ref={mountRef}
              className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
              aria-label="หน้าต่างจำลองไมโครชิป 3 มิติแบบโต้ตอบได้"
            />

            {/* Top-Left Live Status Pill */}
            <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
              <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2.5 py-1 font-mono-tech text-[10px] sm:text-[11px] font-bold text-[var(--signal-high-bright)] backdrop-blur-md">
                WebGL 3D • 60FPS
              </span>
              {model === 'mosfet' && (
                <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2.5 py-1 font-mono-tech text-[10px] sm:text-[11px] font-semibold text-[var(--text-primary)] backdrop-blur-md">
                  {mosType.toUpperCase()} | Vg={gateVoltage.toFixed(2)}V |{' '}
                  {mosConducting ? 'ON' : 'OFF'}
                </span>
              )}
              {model === 'nand' && (
                <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2.5 py-1 font-mono-tech text-[10px] sm:text-[11px] font-semibold text-[var(--text-primary)] backdrop-blur-md">
                  {nandState === 'programmed' ? 'e⁻ TRAPPED (BIT 0)' : 'CAGE EMPTY (BIT 1)'}
                </span>
              )}
            </div>

            {/* Top-Right Camera Angle Quick Presets */}
            <div className="absolute right-3 top-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCameraPreset('iso')}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2 py-1 font-mono-tech text-[10px] font-semibold text-[var(--text-primary)] backdrop-blur-md hover:border-[var(--signal-high)] cursor-pointer"
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('front')}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2 py-1 font-mono-tech text-[10px] font-semibold text-[var(--text-primary)] backdrop-blur-md hover:border-[var(--signal-high)] cursor-pointer"
              >
                หน้าตัด
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('top')}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2 py-1 font-mono-tech text-[10px] font-semibold text-[var(--text-primary)] backdrop-blur-md hover:border-[var(--signal-high)] cursor-pointer"
              >
                ด้านบน
              </button>
              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                title={autoRotate ? 'หยุดหมุนอัตโนมัติ' : 'เปิดหมุนอัตโนมัติ'}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition cursor-pointer ${
                  autoRotate
                    ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/20 text-[var(--signal-high-bright)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)]'
                }`}
              >
                <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </button>
            </div>

            {/* Bottom Gesture Hint or Raycasted Part Inspector Card */}
            {selectedPart ? (
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-[var(--signal-high)]/60 bg-[var(--bg-glass)] p-3.5 backdrop-blur-xl shadow-xl">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[var(--signal-high)]/20 px-1.5 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--signal-high-bright)]">
                        {selectedPart.layerLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        {selectedPart.titleTh}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {selectedPart.descriptionTh}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPart(null)}
                    aria-label="ปิดคำอธิบายชิ้นส่วน"
                    className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                    {selectedPart.titleEn}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreen(false)
                      onNavigateLayer(selectedPart.layerId)
                    }}
                    className="inline-flex items-center gap-1 font-mono-tech text-[11px] font-bold text-[var(--signal-high-bright)] hover:underline cursor-pointer"
                  >
                    <span>ไปอ่านรายละเอียด {selectedPart.layerLabel}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center">
                <div className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3.5 py-1.5 text-[11px] text-[var(--text-secondary)] backdrop-blur-md text-center">
                  <span className="sm:hidden">
                    👆 ลาก 1 นิ้วหมุน 360° • 2 นิ้วซูม • แตะชิ้นส่วนดูข้อมูล
                  </span>
                  <span className="hidden sm:inline">
                    🖱️ ลากเมาส์หมุน 360° • เลื่อนลูกกลิ้งซูม • คลิกชิ้นส่วน 3D เพื่อตรวจสอบกลไก
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right/Bottom Customization Studio Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 overflow-y-auto">
          {/* Section A: Model-Specific Physics Controls */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-[var(--signal-high)]">
                1. ควบคุมกลไกฟิสิกส์ (Physics)
              </span>
              <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                LIVE 3D
              </span>
            </div>

            {model === 'mosfet' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMosType('nmos')
                      setGateVoltage(0.9)
                    }}
                    className={`rounded-xl border py-2 font-mono-tech text-xs font-semibold cursor-pointer ${
                      mosType === 'nmos'
                        ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    NMOS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMosType('pmos')
                      setGateVoltage(0.2)
                    }}
                    className={`rounded-xl border py-2 font-mono-tech text-xs font-semibold cursor-pointer ${
                      mosType === 'pmos'
                        ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    PMOS
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--text-secondary)]">แรงดันขา Gate (V_G)</span>
                    <strong className="font-mono-tech text-[var(--signal-field-bright)]">
                      {gateVoltage.toFixed(2)} V
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1.2}
                    step={0.02}
                    value={gateVoltage}
                    onChange={(e) => setGateVoltage(parseFloat(e.target.value))}
                    className="tech-slider"
                  />
                </div>
              </div>
            )}

            {model === 'crystal' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-1.5">
                  {(['pure', 'ntype', 'ptype'] as const).map((dm) => (
                    <button
                      key={dm}
                      type="button"
                      onClick={() => setDopingMode(dm)}
                      className={`rounded-xl border py-2 font-mono-tech text-[11px] font-semibold cursor-pointer ${
                        dopingMode === dm
                          ? 'border-[var(--signal-high)] bg-[var(--signal-high)]/15 text-[var(--signal-high-bright)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {dm === 'pure' ? 'Pure Si' : dm === 'ntype' ? 'N (+P)' : 'P (+B)'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCrystalVoltageOn((v) => !v)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 font-mono-tech text-xs font-bold cursor-pointer ${
                    crystalVoltageOn
                      ? 'border-[var(--signal-high)] bg-[var(--signal-high)] text-zinc-950'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{crystalVoltageOn ? 'จ่ายแรงดันไฟ: ON (+1.2V)' : 'จ่ายแรงดันไฟ: OFF (0V)'}</span>
                </button>
              </div>
            )}

            {model === 'nand' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNandAction('program')
                    setNandState('programmed')
                  }}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--signal-field)] bg-[var(--signal-field)]/15 py-2 font-mono-tech text-[11px] font-semibold text-[var(--signal-field-bright)] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Program +20V</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNandAction('erase')
                    setNandState('erased')
                  }}
                  className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] py-2 font-mono-tech text-[11px] font-semibold text-[var(--text-primary)] cursor-pointer"
                >
                  Erase -20V
                </button>
                <button
                  type="button"
                  onClick={() => setNandAction('poweroff')}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-amber-500/50 bg-amber-500/12 py-2 font-mono-tech text-[11px] font-semibold text-amber-400 cursor-pointer"
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>ตัดไฟ 0V</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNandAction('read')}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--signal-high)] bg-[var(--signal-high)]/15 py-2 font-mono-tech text-[11px] font-semibold text-[var(--signal-high-bright)] cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Read +5V</span>
                </button>
              </div>
            )}

            {model === 'cpu' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[var(--text-secondary)]">ความถี่สัญญาณ Clock (GHz)</span>
                  <strong className="font-mono-tech text-[var(--signal-high-bright)]">
                    {(cpuClockSpeed * 2.4).toFixed(1)} GHz
                  </strong>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={2.6}
                  step={0.1}
                  value={cpuClockSpeed}
                  onChange={(e) => setCpuClockSpeed(parseFloat(e.target.value))}
                  className="tech-slider"
                />
              </div>
            )}
          </div>

          {/* Section B: 3D Geometry & Customization Studio */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-[var(--signal-field-bright)]">
                2. ปรับแต่งมุมมองและรูปลักษณ์ 3D
              </span>
              <button
                type="button"
                onClick={() => {
                  setExploded(0.15)
                  setSpeed(1.2)
                  setRenderStyle('solid')
                  setPalette('cyber')
                  setCameraPreset('iso')
                }}
                className="inline-flex items-center gap-1 font-mono-tech text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>รีเซ็ต</span>
              </button>
            </div>

            {/* Exploded View Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Layers className="h-3.5 w-3.5 text-[var(--signal-high)]" />
                  <span>แยกชั้น 3D (Exploded View)</span>
                </span>
                <strong className="font-mono-tech text-[var(--text-primary)]">
                  {Math.round(exploded * 100)}%
                </strong>
              </div>
              <input
                id="studio-3d-exploded-slider"
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={exploded}
                onChange={(e) => setExploded(parseFloat(e.target.value))}
                className="tech-slider"
              />
            </div>

            {/* Animation Speed Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[var(--text-secondary)]">ความเร็วการไหลของอิเล็กตรอน</span>
                <strong className="font-mono-tech text-[var(--text-primary)]">
                  {speed.toFixed(1)}x
                </strong>
              </div>
              <input
                type="range"
                min={0.2}
                max={3}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="tech-slider"
              />
            </div>

            {/* Render Style (Solid / X-Ray / Wireframe) */}
            <div className="space-y-1.5">
              <div className="text-xs text-[var(--text-secondary)]">โหมดการแสดงผล (Material Style)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'solid', label: 'Solid ทึบ' },
                    { id: 'xray', label: 'X-Ray ใส' },
                    { id: 'wireframe', label: 'Wireframe' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setRenderStyle(st.id)}
                    className={`rounded-xl border py-2 text-[11px] font-semibold transition cursor-pointer ${
                      renderStyle === st.id
                        ? 'border-[var(--signal-field)] bg-[var(--signal-field)]/15 text-[var(--signal-field-bright)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette Customization */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Palette className="h-3.5 w-3.5 text-[var(--signal-field)]" />
                <span>โทนสีชิป (Color Theme)</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'cyber', label: 'Cyan / Purple', dot: '#06B6D4' },
                    { id: 'emerald', label: 'Emerald / Gold', dot: '#10B981' },
                    { id: 'solar', label: 'Amber / Rose', dot: '#F59E0B' },
                  ] as const
                ).map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPalette(pal.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-1.5 text-[11px] font-semibold transition cursor-pointer ${
                      palette === pal.id
                        ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-transparent text-[var(--text-muted)]'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: pal.dot }}
                    />
                    <span className="truncate">{pal.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
