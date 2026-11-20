import * as THREE from 'three'

export type Model3DId = 'mosfet' | 'crystal' | 'nand' | 'cpu'
export type RenderStyle = 'solid' | 'xray' | 'wireframe'
export type PaletteId = 'cyber' | 'emerald' | 'solar'

export interface PartInfo {
  titleTh: string
  titleEn: string
  descriptionTh: string
  layerId: string
  layerLabel: string
}

export interface StudioParams {
  model: Model3DId
  theme: 'dark' | 'light'
  renderStyle: RenderStyle
  palette: PaletteId
  exploded: number // 0..1
  speed: number // 0.2..3
  // MOSFET params
  mosType: 'nmos' | 'pmos'
  gateVoltage: number // 0..1.2
  // Crystal params
  dopingMode: 'pure' | 'ntype' | 'ptype'
  crystalVoltageOn: boolean
  // NAND params
  nandState: 'erased' | 'programmed'
  nandAction: 'idle' | 'program' | 'erase' | 'poweroff' | 'read'
  // CPU params
  cpuClockSpeed: number // 0.5..3
}

export interface ScenePalette {
  signalHigh: number
  signalField: number
  metal: number
  substrate: number
  oxide: number
  well: number
  pcb: number
  gold: number
}

export const PALETTES: Record<PaletteId, ScenePalette> = {
  cyber: {
    signalHigh: 0x06b6d4,
    signalField: 0xa855f7,
    metal: 0x94a3b8,
    substrate: 0x1e293b,
    oxide: 0x7c3aed,
    well: 0x0284c7,
    pcb: 0x0f172a,
    gold: 0xf59e0b,
  },
  emerald: {
    signalHigh: 0x10b981,
    signalField: 0xf59e0b,
    metal: 0xa1a1aa,
    substrate: 0x132a23,
    oxide: 0xd97706,
    well: 0x059669,
    pcb: 0x064e3b,
    gold: 0xfbbf24,
  },
  solar: {
    signalHigh: 0xf59e0b,
    signalField: 0xec4899,
    metal: 0xa8a29e,
    substrate: 0x271b24,
    oxide: 0xdb2777,
    well: 0xea580c,
    pcb: 0x1c1917,
    gold: 0xfde047,
  },
}

export interface Built3DModel {
  group: THREE.Group
  clickableMeshes: THREE.Object3D[]
  update: (dt: number, elapsed: number, params: StudioParams) => void
  dispose: () => void
}

function tagMesh(mesh: THREE.Object3D, info: PartInfo, list: THREE.Object3D[]) {
  mesh.userData.partInfo = info
  list.push(mesh)
}

function applyMaterialStyle(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  baseOpacity: number,
  renderStyle: RenderStyle
) {
  if (renderStyle === 'wireframe') {
    mat.wireframe = true
    mat.transparent = true
    mat.opacity = Math.max(0.55, baseOpacity)
  } else if (renderStyle === 'xray') {
    mat.wireframe = false
    mat.transparent = true
    mat.opacity = Math.min(baseOpacity, 0.32)
  } else {
    mat.wireframe = false
    mat.transparent = baseOpacity < 1
    mat.opacity = baseOpacity
  }
}

function disposeGroup(group: THREE.Group) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
      obj.geometry?.dispose()
      const material = obj.material
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose())
      } else {
        material?.dispose()
      }
    }
  })
}

/* ============================================================================
 * 1. 3D MOSFET TRANSISTOR MODEL
 * ========================================================================== */
export function buildMosfetScene(initialParams: StudioParams): Built3DModel {
  const group = new THREE.Group()
  const clickableMeshes: THREE.Object3D[] = []
  const pal = PALETTES[initialParams.palette]

  // Substrate Body
  const substrateMat = new THREE.MeshStandardMaterial({
    color: pal.substrate,
    roughness: 0.55,
    metalness: 0.2,
  })
  const substrate = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.8, 3.4), substrateMat)
  substrate.position.set(0, -1.1, 0)
  tagMesh(
    substrate,
    {
      titleTh: 'ฐานซิลิคอน (Silicon Substrate)',
      titleEn: 'P-Type / N-Well Body',
      descriptionTh:
        'ฐานสารกึ่งตัวนำที่กั้นระหว่าง Source และ Drain ในภาวะปกติจะกันไม่ให้กระแสไหลข้ามไปได้',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(substrate)

  // Source Well (Left) & Drain Well (Right)
  const wellMat = new THREE.MeshStandardMaterial({
    color: pal.well,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.18,
    roughness: 0.35,
    metalness: 0.35,
  })
  const sourceWell = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 3.44), wellMat)
  sourceWell.position.set(-2.15, -0.64, 0)
  tagMesh(
    sourceWell,
    {
      titleTh: 'ขั้ว Source (แหล่งจ่ายพาหะประจุ)',
      titleEn: 'N⁺ / P⁺ Source Region',
      descriptionTh:
        'บริเวณซิลิคอนที่โดปเข้มข้น เป็นต้นทางของอิเล็กตรอน (หรือ Hole ใน PMOS) ที่พร้อมไหลข้ามไปฝั่ง Drain',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(sourceWell)

  const drainWell = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 3.44), wellMat)
  drainWell.position.set(2.15, -0.64, 0)
  tagMesh(
    drainWell,
    {
      titleTh: 'ขั้ว Drain (ปลายทางรับกระแส)',
      titleEn: 'N⁺ / P⁺ Drain Region',
      descriptionTh:
        'ขั้วปลายทางที่รับกระแสไฟฟ้าเมื่อ Inversion Channel ก่อตัวสมบูรณ์ใต้ขา Gate',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(drainWell)

  // Dynamic Inversion Channel Bridge
  const channelMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.85,
    roughness: 0.2,
  })
  const channel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.36, 3.36), channelMat)
  channel.position.set(0, -0.35, 0)
  tagMesh(
    channel,
    {
      titleTh: 'สะพานนำไฟฟ้า (Inversion Channel)',
      titleEn: 'Field-Induced Channel',
      descriptionTh:
        'เมื่อแรงดันขา Gate เกิน Threshold Voltage สนามไฟฟ้าจะดูดพาหะมาสร้างสะพานเชื่อม Source–Drain โดยไร้ชิ้นส่วนเคลื่อนไหว',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(channel)

  // Oxide Insulator (SiO2)
  const oxideMat = new THREE.MeshStandardMaterial({
    color: pal.oxide,
    emissive: pal.signalField,
    emissiveIntensity: 0.22,
    transparent: true,
    opacity: 0.58,
    roughness: 0.15,
    metalness: 0.1,
  })
  const oxide = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.42, 3.42), oxideMat)
  oxide.position.set(0, 0.02, 0)
  tagMesh(
    oxide,
    {
      titleTh: 'ชั้นฉนวนออกไซด์ (SiO₂ Oxide Insulator)',
      titleEn: 'Gate Dielectric Barrier',
      descriptionTh:
        'ฉนวนบางระดับนาโนเมตรที่กั้นไม่ให้กระแสไฟรั่วจาก Gate ลงซิลิคอน แต่ยอมให้สนามไฟฟ้าทะลุผ่านไปเปิดสวิตช์ได้',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(oxide)

  // Gate Electrode Block
  const gateMat = new THREE.MeshStandardMaterial({
    color: pal.metal,
    emissive: pal.signalField,
    emissiveIntensity: 0.25,
    roughness: 0.25,
    metalness: 0.78,
  })
  const gateBlock = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.58, 3.38), gateMat)
  gateBlock.position.set(0, 0.55, 0)
  tagMesh(
    gateBlock,
    {
      titleTh: 'ขั้วควบคุม Gate (Polysilicon / Metal Gate)',
      titleEn: 'Gate Terminal Electrode',
      descriptionTh:
        'รับแรงดันควบคุม (0V ถึง 1.2V) เพื่อสร้างสนามไฟฟ้าสั่งเปิด-ปิดช่องนำไฟฟ้าด้านล่าง',
      layerId: 'layer-1',
      layerLabel: 'Layer 1',
    },
    clickableMeshes
  )
  group.add(gateBlock)

  // Metal Contact Pillars (Source, Gate, Drain Vias)
  const contactMat = new THREE.MeshStandardMaterial({
    color: pal.gold,
    roughness: 0.25,
    metalness: 0.85,
  })
  const pillarGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.35, 24)
  const padGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.16, 24)

  const sourcePillar = new THREE.Group()
  const spMesh = new THREE.Mesh(pillarGeo, contactMat)
  const spPad = new THREE.Mesh(padGeo, contactMat)
  spPad.position.y = 0.7
  sourcePillar.add(spMesh, spPad)
  sourcePillar.position.set(-2.15, 0.5, 0)
  group.add(sourcePillar)

  const drainPillar = new THREE.Group()
  const dpMesh = new THREE.Mesh(pillarGeo, contactMat)
  const dpPad = new THREE.Mesh(padGeo, contactMat)
  dpPad.position.y = 0.7
  drainPillar.add(dpMesh, dpPad)
  drainPillar.position.set(2.15, 0.5, 0)
  group.add(drainPillar)

  const gatePillar = new THREE.Group()
  const gpMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 24), contactMat)
  const gpPad = new THREE.Mesh(padGeo, contactMat)
  gpPad.position.y = 0.48
  gatePillar.add(gpMesh, gpPad)
  gatePillar.position.set(0, 1.28, 0)
  group.add(gatePillar)

  // Electric Field 3D Arrows piercing Oxide
  const fieldArrows: THREE.Group[] = []
  const fieldMat = new THREE.MeshStandardMaterial({
    color: pal.signalField,
    emissive: pal.signalField,
    emissiveIntensity: 1.1,
    transparent: true,
    opacity: 0.9,
  })
  const arrowPositions = [
    [-0.95, -0.85],
    [0, -0.85],
    [0.95, -0.85],
    [-0.95, 0.85],
    [0, 0.85],
    [0.95, 0.85],
  ]
  arrowPositions.forEach(([ax, az]) => {
    const arrow = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.52, 10), fieldMat)
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 12), fieldMat)
    tip.rotation.x = Math.PI
    tip.position.y = -0.32
    arrow.add(shaft, tip)
    arrow.position.set(ax, 0.08, az)
    fieldArrows.push(arrow)
    group.add(arrow)
  })

  // Animated 3D Electron Spheres flowing Source -> Drain
  const carrierCount = 24
  const carriers: Array<{ mesh: THREE.Mesh; offset: number; laneZ: number; laneY: number }> = []
  const carrierMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: pal.signalHigh,
    emissiveIntensity: 1.5,
    roughness: 0.1,
  })
  const carrierGeo = new THREE.SphereGeometry(0.11, 14, 14)
  for (let i = 0; i < carrierCount; i++) {
    const mesh = new THREE.Mesh(carrierGeo, carrierMat)
    const laneZ = ((i % 4) - 1.5) * 0.72
    const laneY = ((i % 2) - 0.5) * 0.14
    carriers.push({
      mesh,
      offset: i / carrierCount,
      laneZ,
      laneY,
    })
    group.add(mesh)
  }

  return {
    group,
    clickableMeshes,
    update: (_dt, elapsed, params) => {
      const p = PALETTES[params.palette]
      const vth = 0.5
      const vdd = 1.2
      const effectiveDrive =
        params.mosType === 'nmos' ? params.gateVoltage - vth : vdd - params.gateVoltage - vth
      const isConducting = effectiveDrive >= 0
      const strength = isConducting ? Math.min(1, Math.max(0.18, effectiveDrive / (vdd - vth))) : 0
      const fieldStrength =
        params.mosType === 'nmos'
          ? Math.min(1, params.gateVoltage / vdd)
          : Math.min(1, (vdd - params.gateVoltage) / vdd)

      // Palette updates
      substrateMat.color.setHex(p.substrate)
      wellMat.color.setHex(params.mosType === 'nmos' ? p.well : p.oxide)
      wellMat.emissive.setHex(params.mosType === 'nmos' ? p.signalHigh : p.signalField)
      channelMat.color.setHex(p.signalHigh)
      channelMat.emissive.setHex(p.signalHigh)
      oxideMat.color.setHex(p.oxide)
      oxideMat.emissive.setHex(p.signalField)
      gateMat.emissive.setHex(p.signalField)
      gateMat.emissiveIntensity = 0.12 + fieldStrength * 0.55
      fieldMat.color.setHex(p.signalField)
      fieldMat.emissive.setHex(p.signalField)
      carrierMat.emissive.setHex(p.signalHigh)
      contactMat.color.setHex(p.gold)

      // Render styles
      applyMaterialStyle(substrateMat, 1, params.renderStyle)
      applyMaterialStyle(wellMat, 0.96, params.renderStyle)
      applyMaterialStyle(oxideMat, 0.55, params.renderStyle)
      applyMaterialStyle(gateMat, 1, params.renderStyle)
      applyMaterialStyle(contactMat, 1, params.renderStyle)

      // Exploded view vertical separation
      const ex = params.exploded
      substrate.position.y = -1.1 - ex * 0.75
      sourceWell.position.y = -0.64 - ex * 0.25
      drainWell.position.y = -0.64 - ex * 0.25
      channel.position.y = -0.35 + ex * 0.15
      oxide.position.y = 0.02 + ex * 0.72
      gateBlock.position.y = 0.55 + ex * 1.38
      gatePillar.position.y = 1.28 + ex * 1.95
      sourcePillar.position.y = 0.5 + ex * 0.9
      drainPillar.position.y = 0.5 + ex * 0.9

      // Channel thickness & visibility
      channel.visible = isConducting
      channel.scale.y = Math.max(0.15, strength * 1.25)
      channelMat.opacity = params.renderStyle === 'xray' ? 0.55 : 0.78

      // Electric field arrows pulse
      const pulse = 0.7 + 0.3 * Math.sin(elapsed * 4.5)
      fieldArrows.forEach((arrow, idx) => {
        arrow.visible = fieldStrength > 0.08
        arrow.position.y = oxide.position.y + Math.sin(elapsed * 3 + idx) * 0.04
        arrow.rotation.z = params.mosType === 'nmos' ? 0 : Math.PI
        arrow.scale.setScalar(0.65 + fieldStrength * 0.5)
      })
      fieldMat.opacity = fieldStrength * 0.9 * pulse

      // Flowing carriers inside channel
      const flowSpeed = (0.35 + strength * 0.9) * params.speed
      carriers.forEach((c) => {
        c.mesh.visible = isConducting
        if (!isConducting) return
        const t = (c.offset + elapsed * flowSpeed * 0.55) % 1
        const x = -2.4 + t * 4.8
        c.mesh.position.set(x, channel.position.y + c.laneY, c.laneZ)
        const s = 0.8 + 0.25 * Math.sin(elapsed * 6 + c.offset * 12)
        c.mesh.scale.setScalar(s)
      })
    },
    dispose: () => disposeGroup(group),
  }
}

/* ============================================================================
 * 2. 3D SILICON CRYSTAL LATTICE (3x3x3)
 * ========================================================================== */
export function buildCrystalScene(initialParams: StudioParams): Built3DModel {
  const group = new THREE.Group()
  const clickableMeshes: THREE.Object3D[] = []
  const pal = PALETTES[initialParams.palette]

  const atomGeo = new THREE.SphereGeometry(0.29, 22, 22)
  const siMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.55,
  })
  const dopantMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.75,
    roughness: 0.2,
    metalness: 0.4,
  })
  const bondMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.5,
    metalness: 0.3,
  })

  const atoms: Array<{ mesh: THREE.Mesh; gx: number; gy: number; gz: number; isDopant: boolean }> =
    []
  const bonds: Array<{
    mesh: THREE.Mesh
    a: [number, number, number]
    b: [number, number, number]
  }> = []

  const coords = [-1, 0, 1]
  coords.forEach((gx) => {
    coords.forEach((gy) => {
      coords.forEach((gz) => {
        const isDopant =
          (gx === 0 && gy === 0 && gz === 0) || (gx === 1 && gy === 0 && gz === 0)
        const mesh = new THREE.Mesh(atomGeo, isDopant ? dopantMat : siMat)
        tagMesh(
          mesh,
          isDopant
            ? {
                titleTh: 'อะตอมสารเจือปน (Dopant Atom: P หรือ B)',
                titleEn: 'Phosphorus (+5) / Boron (+3)',
                descriptionTh:
                  'อะตอมที่เติมเข้าไปในผลึกซิลิคอนเพื่อสร้างอิเล็กตรอนอิสระ (N-Type) หรือหลุมประจุบวก Hole (P-Type)',
                layerId: 'layer-0',
                layerLabel: 'Layer 0',
              }
            : {
                titleTh: 'อะตอมซิลิคอน (Silicon Atom +4)',
                titleEn: '4-Valence Crystal Atom',
                descriptionTh:
                  'อะตอมซิลิคอนที่มีเวเลนซ์อิเล็กตรอน 4 ตัว จับพันธะโควาเลนต์กับเพื่อนบ้านรอบทิศอย่างแน่นหนา',
                layerId: 'layer-0',
                layerLabel: 'Layer 0',
              },
          clickableMeshes
        )
        atoms.push({ mesh, gx, gy, gz, isDopant })
        group.add(mesh)
      })
    })
  })

  // Create bond cylinders along X, Y, Z axes
  const bondGeo = new THREE.CylinderGeometry(0.055, 0.055, 1, 10)
  coords.forEach((x) => {
    coords.forEach((y) => {
      coords.forEach((z) => {
        if (x < 1) {
          const m = new THREE.Mesh(bondGeo, bondMat)
          m.rotation.z = Math.PI / 2
          bonds.push({ mesh: m, a: [x, y, z], b: [x + 1, y, z] })
          group.add(m)
        }
        if (y < 1) {
          const m = new THREE.Mesh(bondGeo, bondMat)
          bonds.push({ mesh: m, a: [x, y, z], b: [x, y + 1, z] })
          group.add(m)
        }
        if (z < 1) {
          const m = new THREE.Mesh(bondGeo, bondMat)
          m.rotation.x = Math.PI / 2
          bonds.push({ mesh: m, a: [x, y, z], b: [x, y, z + 1] })
          group.add(m)
        }
      })
    })
  })

  // Electrodes on Left (-) and Right (+)
  const leftPlateMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.28,
  })
  const rightPlateMat = new THREE.MeshStandardMaterial({
    color: pal.signalField,
    emissive: pal.signalField,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.28,
  })
  const plateGeo = new THREE.BoxGeometry(0.14, 3.6, 3.6)
  const leftPlate = new THREE.Mesh(plateGeo, leftPlateMat)
  leftPlate.position.set(-2.9, 0, 0)
  const rightPlate = new THREE.Mesh(plateGeo, rightPlateMat)
  rightPlate.position.set(2.9, 0, 0)
  group.add(leftPlate, rightPlate)

  // Moving Free Electrons / Holes
  const carrierMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 1.4,
    roughness: 0.1,
  })
  const holeMat = new THREE.MeshStandardMaterial({
    color: pal.signalField,
    emissive: pal.signalField,
    emissiveIntensity: 1.2,
    wireframe: true,
  })
  const electronGeo = new THREE.SphereGeometry(0.13, 14, 14)
  const holeGeo = new THREE.TorusGeometry(0.17, 0.045, 10, 20)

  const freeCarriers: Array<{
    eMesh: THREE.Mesh
    hMesh: THREE.Mesh
    offset: number
    y: number
    z: number
  }> = []
  for (let i = 0; i < 16; i++) {
    const eMesh = new THREE.Mesh(electronGeo, carrierMat)
    const hMesh = new THREE.Mesh(holeGeo, holeMat)
    const y = ((i % 3) - 1) * 0.95 + (i % 2 === 0 ? 0.35 : -0.35)
    const z = (Math.floor(i / 4) - 1.5) * 0.85
    freeCarriers.push({ eMesh, hMesh, offset: i / 16, y, z })
    group.add(eMesh, hMesh)
  }

  return {
    group,
    clickableMeshes,
    update: (_dt, elapsed, params) => {
      const p = PALETTES[params.palette]
      const spacing = 1.45 + params.exploded * 0.65

      // Update dopant appearance
      if (params.dopingMode === 'pure') {
        dopantMat.color.setHex(0x64748b)
        dopantMat.emissive.setHex(0x000000)
        dopantMat.emissiveIntensity = 0
      } else if (params.dopingMode === 'ntype') {
        dopantMat.color.setHex(p.signalHigh)
        dopantMat.emissive.setHex(p.signalHigh)
        dopantMat.emissiveIntensity = 0.8
      } else {
        dopantMat.color.setHex(p.signalField)
        dopantMat.emissive.setHex(p.signalField)
        dopantMat.emissiveIntensity = 0.8
      }

      carrierMat.color.setHex(p.signalHigh)
      carrierMat.emissive.setHex(p.signalHigh)
      holeMat.color.setHex(p.signalField)
      holeMat.emissive.setHex(p.signalField)
      leftPlateMat.color.setHex(p.signalHigh)
      leftPlateMat.emissive.setHex(p.signalHigh)
      rightPlateMat.color.setHex(p.signalField)
      rightPlateMat.emissive.setHex(p.signalField)

      applyMaterialStyle(siMat, 1, params.renderStyle)
      applyMaterialStyle(dopantMat, 1, params.renderStyle)
      applyMaterialStyle(bondMat, 0.85, params.renderStyle)

      // Update atom positions with slight thermal vibration
      const vibe = params.crystalVoltageOn && params.dopingMode === 'pure' ? 0.04 : 0.012
      atoms.forEach((a, idx) => {
        a.mesh.position.set(
          a.gx * spacing + Math.sin(elapsed * 8 + idx) * vibe,
          a.gy * spacing + Math.cos(elapsed * 7 + idx) * vibe,
          a.gz * spacing
        )
        const scale = a.isDopant && params.dopingMode !== 'pure' ? 1.18 : 1.0
        a.mesh.scale.setScalar(scale)
      })

      bonds.forEach((b) => {
        b.mesh.position.set(
          ((b.a[0] + b.b[0]) * 0.5) * spacing,
          ((b.a[1] + b.b[1]) * 0.5) * spacing,
          ((b.a[2] + b.b[2]) * 0.5) * spacing
        )
        b.mesh.scale.y = spacing
      })

      leftPlate.position.x = -(spacing * 1.55)
      rightPlate.position.x = spacing * 1.55
      leftPlateMat.opacity = params.crystalVoltageOn ? 0.34 : 0.08
      rightPlateMat.opacity = params.crystalVoltageOn ? 0.34 : 0.08

      // Carriers drift
      const showN = params.dopingMode === 'ntype'
      const showP = params.dopingMode === 'ptype'
      const span = spacing * 2.8

      freeCarriers.forEach((c, i) => {
        c.eMesh.visible = showN
        c.hMesh.visible = showP

        if (showN) {
          if (params.crystalVoltageOn) {
            const t = (c.offset + elapsed * 0.36 * params.speed) % 1
            c.eMesh.position.set(-span / 2 + t * span, c.y, c.z)
          } else {
            const ang = elapsed * 1.6 + i
            c.eMesh.position.set(
              Math.cos(ang) * 0.65 + (i % 2 === 0 ? 0 : spacing),
              Math.sin(ang * 1.2) * 0.55,
              Math.sin(ang) * 0.65
            )
          }
        }

        if (showP) {
          c.hMesh.rotation.y = elapsed * 2.2 + i
          if (params.crystalVoltageOn) {
            const t = (c.offset + elapsed * 0.28 * params.speed) % 1
            // Holes drift right-to-left (toward negative electrode)
            c.hMesh.position.set(span / 2 - t * span, c.y, c.z)
          } else {
            const ang = elapsed * 1.3 + i
            c.hMesh.position.set(
              Math.cos(ang) * 0.5 + (i % 2 === 0 ? 0 : spacing),
              Math.sin(ang) * 0.5,
              Math.cos(ang * 0.8) * 0.5
            )
          }
        }
      })
    },
    dispose: () => disposeGroup(group),
  }
}

/* ============================================================================
 * 3. 3D NAND FLASH FLOATING GATE CELL
 * ========================================================================== */
export function buildNandScene(initialParams: StudioParams): Built3DModel {
  const group = new THREE.Group()
  const clickableMeshes: THREE.Object3D[] = []
  const pal = PALETTES[initialParams.palette]

  // Substrate
  const subMat = new THREE.MeshStandardMaterial({
    color: pal.substrate,
    roughness: 0.55,
    metalness: 0.2,
  })
  const sub = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.4, 3.2), subMat)
  sub.position.set(0, -1.6, 0)
  group.add(sub)

  // Source & Drain
  const sdMat = new THREE.MeshStandardMaterial({
    color: pal.well,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.16,
    roughness: 0.35,
  })
  const src = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.78, 3.24), sdMat)
  src.position.set(-2.15, -1.24, 0)
  const drn = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.78, 3.24), sdMat)
  drn.position.set(2.15, -1.24, 0)
  group.add(src, drn)

  // Read Channel
  const readChMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.85,
  })
  const readCh = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.24, 3.16), readChMat)
  readCh.position.set(0, -1.0, 0)
  group.add(readCh)

  // Tunnel Oxide
  const tunnelOxMat = new THREE.MeshStandardMaterial({
    color: pal.oxide,
    emissive: pal.signalField,
    emissiveIntensity: 0.28,
    transparent: true,
    opacity: 0.42,
    roughness: 0.15,
  })
  const tunnelOx = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.34, 3.16), tunnelOxMat)
  tunnelOx.position.set(0, -0.68, 0)
  tagMesh(
    tunnelOx,
    {
      titleTh: 'ชั้นฉนวน Tunnel Oxide (~8nm)',
      titleEn: 'Quantum Tunneling Barrier',
      descriptionTh:
        'ฉนวนบางเฉียบที่ปกติกันอิเล็กตรอนไว้ได้นานนับสิบปี แต่เมื่ออัดไฟสูง 20V อิเล็กตรอนจะทะลุผ่านด้วยกลศาสตร์ควอนตัม',
      layerId: 'layer-3b',
      layerLabel: 'Layer 3B',
    },
    clickableMeshes
  )
  group.add(tunnelOx)

  // Floating Gate Cage (translucent box + glowing wireframe border)
  const fgMat = new THREE.MeshStandardMaterial({
    color: pal.signalField,
    emissive: pal.signalField,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.32,
    roughness: 0.15,
    metalness: 0.4,
  })
  const fgMesh = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.72, 3.05), fgMat)
  fgMesh.position.set(0, -0.05, 0)
  tagMesh(
    fgMesh,
    {
      titleTh: 'กรงขังอิเล็กตรอน Floating Gate',
      titleEn: 'Non-Volatile Charge Trap',
      descriptionTh:
        'ชั้นตัวนำลอยกลางฉนวนไร้สายไฟ หากมีอิเล็กตรอนขังอยู่ข้างใน จะอยู่ครบแม้ตัดไฟ (เก็บค่า 0) และคอยต้านสนามไฟฟ้าเวลา Read',
      layerId: 'layer-3b',
      layerLabel: 'Layer 3B',
    },
    clickableMeshes
  )
  group.add(fgMesh)

  // Blocking Oxide
  const blockOxMat = new THREE.MeshStandardMaterial({
    color: pal.oxide,
    transparent: true,
    opacity: 0.5,
    roughness: 0.2,
  })
  const blockOx = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.32, 3.16), blockOxMat)
  blockOx.position.set(0, 0.55, 0)
  group.add(blockOx)

  // Control Gate
  const cgMat = new THREE.MeshStandardMaterial({
    color: pal.metal,
    emissive: pal.signalField,
    emissiveIntensity: 0.2,
    roughness: 0.25,
    metalness: 0.8,
  })
  const cgMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.52, 3.18), cgMat)
  cgMesh.position.set(0, 1.06, 0)
  tagMesh(
    cgMesh,
    {
      titleTh: 'ขั้ว Control Gate (+20V / +5V / 0V)',
      titleEn: 'Control Gate Terminal',
      descriptionTh:
        'จ่ายไฟสูง +20V เพื่อ Program (ยิงอิเล็กตรอนเข้ากรง), -20V เพื่อ Erase และ +5V (V_read) เพื่อทดสอบกระแสตอนอ่านข้อมูล',
      layerId: 'layer-3b',
      layerLabel: 'Layer 3B',
    },
    clickableMeshes
  )
  group.add(cgMesh)

  // Trapped Electrons inside Floating Gate
  const trappedMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: pal.signalField,
    emissiveIntensity: 1.5,
  })
  const eGeo = new THREE.SphereGeometry(0.115, 14, 14)
  const trappedElectrons: Array<{ mesh: THREE.Mesh; bx: number; bz: number; phase: number }> = []
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(eGeo, trappedMat)
    const bx = ((i % 4) - 1.5) * 0.62
    const bz = (Math.floor(i / 4) - 1) * 0.78
    trappedElectrons.push({ mesh: m, bx, bz, phase: i * 0.7 })
    group.add(m)
  }

  // Tunneling Electrons (Program/Erase vertical stream)
  const tunnelParticles: Array<{ mesh: THREE.Mesh; bx: number; bz: number; offset: number }> = []
  const tunMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: pal.signalHigh,
    emissiveIntensity: 1.6,
  })
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), tunMat)
    tunnelParticles.push({
      mesh: m,
      bx: ((i % 5) - 2) * 0.5,
      bz: (i % 2 === 0 ? -0.6 : 0.6),
      offset: i / 10,
    })
    group.add(m)
  }

  // Read Current Particles
  const readParticles: Array<{ mesh: THREE.Mesh; offset: number; laneZ: number }> = []
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), tunMat)
    readParticles.push({
      mesh: m,
      offset: i / 16,
      laneZ: ((i % 4) - 1.5) * 0.65,
    })
    group.add(m)
  }

  return {
    group,
    clickableMeshes,
    update: (_dt, elapsed, params) => {
      const p = PALETTES[params.palette]
      const ex = params.exploded

      subMat.color.setHex(p.substrate)
      sdMat.color.setHex(p.well)
      sdMat.emissive.setHex(p.signalHigh)
      readChMat.color.setHex(p.signalHigh)
      readChMat.emissive.setHex(p.signalHigh)
      tunnelOxMat.color.setHex(p.oxide)
      tunnelOxMat.emissive.setHex(p.signalField)
      fgMat.color.setHex(p.signalField)
      fgMat.emissive.setHex(p.signalField)
      blockOxMat.color.setHex(p.oxide)
      cgMat.emissive.setHex(
        params.nandAction === 'read' ? p.signalHigh : p.signalField
      )
      cgMat.emissiveIntensity =
        params.nandAction === 'program' || params.nandAction === 'erase'
          ? 0.85
          : params.nandAction === 'read'
            ? 0.55
            : 0.08
      trappedMat.emissive.setHex(p.signalField)
      tunMat.emissive.setHex(p.signalHigh)

      applyMaterialStyle(subMat, 1, params.renderStyle)
      applyMaterialStyle(sdMat, 0.96, params.renderStyle)
      applyMaterialStyle(tunnelOxMat, 0.4, params.renderStyle)
      applyMaterialStyle(fgMat, 0.3, params.renderStyle)
      applyMaterialStyle(blockOxMat, 0.45, params.renderStyle)
      applyMaterialStyle(cgMat, 1, params.renderStyle)

      // Exploded view offsets
      sub.position.y = -1.6 - ex * 0.7
      src.position.y = -1.24 - ex * 0.45
      drn.position.y = -1.24 - ex * 0.45
      readCh.position.y = -1.0 - ex * 0.25
      tunnelOx.position.y = -0.68 + ex * 0.1
      fgMesh.position.y = -0.05 + ex * 0.65
      blockOx.position.y = 0.55 + ex * 1.18
      cgMesh.position.y = 1.06 + ex * 1.65

      // Trapped electrons inside floating gate (stays even on poweroff!)
      const hasTrapped = params.nandState === 'programmed'
      trappedElectrons.forEach((te) => {
        te.mesh.visible = hasTrapped
        if (!hasTrapped) return
        te.mesh.position.set(
          te.bx + Math.sin(elapsed * 2.4 + te.phase) * 0.06,
          fgMesh.position.y + Math.cos(elapsed * 3.1 + te.phase) * 0.14,
          te.bz + Math.cos(elapsed * 2.1 + te.phase) * 0.06
        )
      })

      // Tunneling animation on Program / Erase
      const isTunneling =
        params.nandAction === 'program' || params.nandAction === 'erase'
      tunnelParticles.forEach((tp) => {
        tp.mesh.visible = isTunneling
        if (!isTunneling) return
        const t = (tp.offset + elapsed * 0.95 * params.speed) % 1
        const yStart = readCh.position.y
        const yEnd = fgMesh.position.y
        const y =
          params.nandAction === 'program'
            ? yStart + t * (yEnd - yStart)
            : yEnd - t * (yEnd - yStart)
        tp.mesh.position.set(tp.bx, y, tp.bz)
      })

      // Read Channel flows ONLY when Reading AND Floating Gate is empty (Erased = 1)
      const readFlows = params.nandAction === 'read' && !hasTrapped
      readCh.visible = readFlows
      readParticles.forEach((rp) => {
        rp.mesh.visible = readFlows
        if (!readFlows) return
        const t = (rp.offset + elapsed * 0.8 * params.speed) % 1
        rp.mesh.position.set(-2.35 + t * 4.7, readCh.position.y, rp.laneZ)
      })
    },
    dispose: () => disposeGroup(group),
  }
}

/* ============================================================================
 * 4. 3D FULL CPU DIE ARCHITECTURE
 * ========================================================================== */
export function buildCpuDieScene(initialParams: StudioParams): Built3DModel {
  const group = new THREE.Group()
  const clickableMeshes: THREE.Object3D[] = []
  const pal = PALETTES[initialParams.palette]

  // Bottom PCB Package Substrate
  const pcbMat = new THREE.MeshStandardMaterial({
    color: pal.pcb,
    roughness: 0.45,
    metalness: 0.35,
  })
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.36, 6.6), pcbMat)
  pcb.position.set(0, -1.1, 0)
  tagMesh(
    pcb,
    {
      titleTh: 'แผ่นรอง Package PCB และขาพินทองคำ',
      titleEn: 'CPU Substrate & Contact Pins',
      descriptionTh:
        'ส่งจ่ายไฟ VDD/GND และเชื่อมต่อ Data Bus / Address Bus จากตัวชิปซิลิคอนออกไปยัง RAM และเมนบอร์ด',
      layerId: 'layer-4',
      layerLabel: 'Layer 4',
    },
    clickableMeshes
  )
  group.add(pcb)

  // Gold Pins around PCB perimeter
  const goldMat = new THREE.MeshStandardMaterial({
    color: pal.gold,
    roughness: 0.22,
    metalness: 0.9,
  })
  const pinGroup = new THREE.Group()
  const pinGeo = new THREE.BoxGeometry(0.16, 0.22, 0.36)
  for (let i = -5; i <= 5; i++) {
    const offset = i * 0.54
    const pTop = new THREE.Mesh(pinGeo, goldMat)
    pTop.position.set(offset, -1.12, -3.32)
    const pBot = new THREE.Mesh(pinGeo, goldMat)
    pBot.position.set(offset, -1.12, 3.32)
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.16), goldMat)
    pLeft.position.set(-3.32, -1.12, offset)
    const pRight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.16), goldMat)
    pRight.position.set(3.32, -1.12, offset)
    pinGroup.add(pTop, pBot, pLeft, pRight)
  }
  group.add(pinGroup)

  // Silicon Die Wafer Layer
  const waferMat = new THREE.MeshStandardMaterial({
    color: pal.substrate,
    roughness: 0.25,
    metalness: 0.65,
  })
  const wafer = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.3, 5.1), waferMat)
  wafer.position.set(0, -0.72, 0)
  tagMesh(
    wafer,
    {
      titleTh: 'แผ่นซิลิคอนได (Silicon Die — พิมพ์ด้วยแสง EUV)',
      titleEn: 'Monolithic Silicon Die',
      descriptionTh:
        'แผ่นผลึกซิลิคอนบริสุทธิ์ที่พิมพ์ทรานซิสเตอร์หลายหมื่นล้านตัวด้วยกระบวนการ Photolithography',
      layerId: 'layer-5',
      layerLabel: 'Layer 5',
    },
    clickableMeshes
  )
  group.add(wafer)

  // Functional Core Blocks Group (lifts together in Exploded View)
  const logicLayer = new THREE.Group()
  group.add(logicLayer)

  // 1) ALU Core Block (Front-Right, Cyan)
  const aluMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.5,
  })
  const aluBlock = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.72, 1.85), aluMat)
  aluBlock.position.set(1.25, -0.18, 1.15)
  tagMesh(
    aluBlock,
    {
      titleTh: 'หน่วยคำนวณ ALU (4-Bit / 64-Bit Adder)',
      titleEn: 'Arithmetic Logic Unit',
      descriptionTh:
        'รวมกลุ่มลอจิกเกต XOR และ AND ต่อเป็นวงจรบวก ลบ และเปรียบเทียบเลขฐานสองด้วยความเร็วแสง',
      layerId: 'layer-3a',
      layerLabel: 'Layer 3A',
    },
    clickableMeshes
  )
  logicLayer.add(aluBlock)

  // 2) Instruction Decoder & Control Unit (Front-Left, Purple)
  const decMat = new THREE.MeshStandardMaterial({
    color: pal.signalField,
    emissive: pal.signalField,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.5,
  })
  const decBlock = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.64, 1.85), decMat)
  decBlock.position.set(-1.25, -0.22, 1.15)
  tagMesh(
    decBlock,
    {
      titleTh: 'Instruction Decoder & Clock Control',
      titleEn: 'Control Unit (Fetch & Decode)',
      descriptionTh:
        'ถอดรหัส Opcode ฐานสองจาก RAM แล้วส่งสายสัญญาณควบคุมไปสับสวิตช์เลือกทางไฟใน ALU และ Registers',
      layerId: 'layer-4',
      layerLabel: 'Layer 4',
    },
    clickableMeshes
  )
  logicLayer.add(decBlock)

  // 3) SRAM L1/L2/L3 Cache Array (Back-Left, stacked modules)
  const sramMat = new THREE.MeshStandardMaterial({
    color: pal.well,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.25,
    roughness: 0.3,
    metalness: 0.55,
  })
  const sramGroup = new THREE.Group()
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const bank = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.52, 0.78), sramMat)
      bank.position.set(-1.88 + c * 0.66, -0.28, -1.55 + r * 0.92)
      tagMesh(
        bank,
        {
          titleTh: 'หน่วยความจำ SRAM Cache (L1 / L2 / L3)',
          titleEn: '6T Feedback-Loop SRAM Array',
          descriptionTh:
            'เก็บข้อมูลและคำสั่งที่ใช้บ่อยด้วยวงจร NOT Gate วนลูป เข้าถึงได้เร็วระดับ 0.5–2 นาโนวินาที',
          layerId: 'layer-3b',
          layerLabel: 'Layer 3B',
        },
        clickableMeshes
      )
      sramGroup.add(bank)
    }
  }
  logicLayer.add(sramGroup)

  // 4) Register File & Program Counter (Back-Right)
  const regMat = new THREE.MeshStandardMaterial({
    color: pal.gold,
    emissive: pal.gold,
    emissiveIntensity: 0.25,
    roughness: 0.25,
    metalness: 0.75,
  })
  const regBlock = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.56, 1.7), regMat)
  regBlock.position.set(1.25, -0.26, -1.1)
  tagMesh(
    regBlock,
    {
      titleTh: 'Registers (R1, R2, ACC) & Program Counter',
      titleEn: 'Ultra-Fast Register File',
      descriptionTh:
        'พื้นที่เก็บตัวเลขชั่วคราวที่ติดกับ ALU ที่สุด และเก็บเลขที่อยู่คำสั่งถัดไปใน Program Counter (PC)',
      layerId: 'layer-4',
      layerLabel: 'Layer 4',
    },
    clickableMeshes
  )
  logicLayer.add(regBlock)

  // Metal Interconnect Bus Layer (sits above logic blocks)
  const busLayer = new THREE.Group()
  group.add(busLayer)

  const traceMat = new THREE.MeshStandardMaterial({
    color: pal.signalHigh,
    emissive: pal.signalHigh,
    emissiveIntensity: 0.65,
    roughness: 0.2,
  })
  const busRoutes: Array<{ from: [number, number]; to: [number, number] }> = [
    { from: [-1.25, -1.1], to: [-1.25, 1.15] }, // SRAM -> Decoder
    { from: [-1.25, 1.15], to: [1.25, 1.15] }, // Decoder -> ALU
    { from: [1.25, -1.1], to: [1.25, 1.15] }, // Registers <-> ALU
    { from: [-1.25, -1.1], to: [1.25, -1.1] }, // SRAM <-> Registers
  ]

  busRoutes.forEach(({ from, to }) => {
    const dx = to[0] - from[0]
    const dz = to[1] - from[1]
    const len = Math.hypot(dx, dz)
    const trace = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.16), traceMat)
    trace.position.set((from[0] + to[0]) / 2, 0.34, (from[1] + to[1]) / 2)
    trace.rotation.y = -Math.atan2(dz, dx)
    busLayer.add(trace)
  })

  // Signal Packets racing across 3D Buses
  const packetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: pal.signalHigh,
    emissiveIntensity: 1.8,
  })
  const packetGeo = new THREE.SphereGeometry(0.11, 12, 12)
  const packets: Array<{ mesh: THREE.Mesh; routeIdx: number; offset: number }> = []
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(packetGeo, packetMat)
    packets.push({ mesh: m, routeIdx: i % busRoutes.length, offset: (i * 0.27) % 1 })
    busLayer.add(m)
  }

  // Translucent Integrated Heat Spreader (IHS Lid)
  const lidMat = new THREE.MeshStandardMaterial({
    color: pal.metal,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.22,
  })
  const lid = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.24, 5.5), lidMat)
  lid.position.set(0, 0.86, 0)
  tagMesh(
    lid,
    {
      titleTh: 'ฝาครอบระบายความร้อน (Heat Spreader / IHS)',
      titleEn: 'Integrated Heat Spreader',
      descriptionTh:
        'กระจายความร้อนจากการสับสวิตช์ MOSFET หลายพันล้านครั้งต่อวินาทีไปยังชุดระบายความร้อน ลองเลื่อน Exploded View เพื่อยกฝาขึ้น!',
      layerId: 'layer-2',
      layerLabel: 'Layer 2',
    },
    clickableMeshes
  )
  group.add(lid)

  return {
    group,
    clickableMeshes,
    update: (_dt, elapsed, params) => {
      const p = PALETTES[params.palette]
      const ex = params.exploded

      pcbMat.color.setHex(p.pcb)
      goldMat.color.setHex(p.gold)
      waferMat.color.setHex(p.substrate)
      aluMat.color.setHex(p.signalHigh)
      aluMat.emissive.setHex(p.signalHigh)
      decMat.color.setHex(p.signalField)
      decMat.emissive.setHex(p.signalField)
      sramMat.color.setHex(p.well)
      sramMat.emissive.setHex(p.signalHigh)
      regMat.color.setHex(p.gold)
      regMat.emissive.setHex(p.gold)
      traceMat.color.setHex(p.signalHigh)
      traceMat.emissive.setHex(p.signalHigh)
      packetMat.emissive.setHex(p.signalHigh)

      applyMaterialStyle(pcbMat, 1, params.renderStyle)
      applyMaterialStyle(waferMat, 1, params.renderStyle)
      applyMaterialStyle(aluMat, 0.96, params.renderStyle)
      applyMaterialStyle(decMat, 0.96, params.renderStyle)
      applyMaterialStyle(sramMat, 0.96, params.renderStyle)
      applyMaterialStyle(regMat, 0.96, params.renderStyle)
      applyMaterialStyle(lidMat, 0.22, params.renderStyle)

      // Exploded view vertically lifts each architectural tier
      pcb.position.y = -1.1 - ex * 0.95
      pinGroup.position.y = -ex * 0.95
      wafer.position.y = -0.72 - ex * 0.35
      logicLayer.position.y = ex * 0.3
      busLayer.position.y = ex * 1.15
      lid.position.y = 0.86 + ex * 2.1

      // Pulsing clock glow on Decoder & ALU
      const clkPulse = 0.35 + 0.35 * Math.sin(elapsed * 4.5 * params.cpuClockSpeed)
      decMat.emissiveIntensity = clkPulse
      aluMat.emissiveIntensity = 0.35 + 0.35 * Math.cos(elapsed * 4.5 * params.cpuClockSpeed)

      // Animate packets racing on 3D bus traces
      const pSpeed = 0.45 * params.speed * params.cpuClockSpeed
      packets.forEach((pk) => {
        const route = busRoutes[pk.routeIdx]
        const t = (pk.offset + elapsed * pSpeed) % 1
        const x = route.from[0] + (route.to[0] - route.from[0]) * t
        const z = route.from[1] + (route.to[1] - route.from[1]) * t
        pk.mesh.position.set(x, 0.39, z)
      })
    },
    dispose: () => disposeGroup(group),
  }
}
