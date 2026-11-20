# จากทรายซิลิคอนสู่โค้ดโปรแกรม (Silicon to Software)

Interactive First-Principles Educational Web Application อธิบายกลไกการทำงานของไมโครชิปประมวลผล (**CPU**) และหน่วยความจำ (**SRAM, DRAM, NAND Flash**) แบบเจาะลึกทีละชั้นนามธรรม (**Layer 0 → Layer 5**) โดยไม่มี "กล่องดำ" พร้อม **Interactive Animated SVG Simulator** ให้ทดลองได้จริงในทุกชั้น

## เนื้อหาและ Interactive Modules

- **Hero & Abstraction Stack Map:** แผนผัง Layer 0 – Layer 5 แบบคลิกกระโดดข้ามชั้นได้ทันที
- **Layer 0 — Semiconductor & Doping:** ตัวจำลองโครงสร้างผลึกซิลิคอน 2D (`Pure Si` / `N-Type (+P)` / `P-Type (+B)`) พร้อมสวิตช์แรงดันดูการไหลของอิเล็กตรอนและ Hole
- **Layer 1 — MOSFET Transistor:** หน้าตัด MOSFET พร้อม Slider ปรับแรงดันขา Gate (`0V – 1.2V`) และโหมด NMOS/PMOS ดูสนามไฟฟ้าทะลุฉนวนสร้าง Inversion Channel
- **Layer 2 — CMOS Logic Gates:** วงจร CMOS NOT Gate และ NAND Gate สลับอินพุต `A`/`B` ดูสถานะ PMOS/NMOS, เส้นทาง `VDD`/`GND` และ Truth Table แบบเรียลไทม์
- **Layer 3A — Binary Adder & ALU:** เครื่องจำลอง 4-Bit Ripple-Carry Binary Adder แสดงเส้นทางตัวทด Carry และตรวจสอบเกต XOR/AND ของแต่ละหลักได้
- **Layer 3B — Memory (SRAM / DRAM / NAND Flash):** ตัวจำลอง 3 แท็บ (Feedback Loop + ตัดไฟ, Capacitor Tank + กราฟประจุรั่ว/Refresh, Floating Gate + Quantum Tunneling + Read/Program/Erase/Power Off)
- **Layer 4 — Clock & CPU Cycle:** Mini 4-Step CPU Simulator รันโปรแกรม `LOAD R1, 5`, `LOAD R2, 3`, `ADD R1, R2`, `HALT` ทีละรอบ Clock พร้อมโหมด Auto Play
- **Layer 5 — Full Abstraction Stack:** ตารางสรุปห่วงโซ่เหตุ-ผลครบทั้ง 6 ชั้น และบทส่งท้ายเรื่อง EUV Photolithography

## Tech Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide React**
- **Inline Animated SVG**

## การรันและพัฒนาในเครื่อง (Local Development)

```bash
npm install
npm run dev
```

## การ Build และ Deploy บน GitHub Pages

```bash
npm run build
```

> สามารถปรับค่า `base` ในไฟล์ `vite.config.ts` ให้ตรงกับชื่อ Repository (เช่น `base: '/silicon-to-software/'` หรือใช้ `base: './'`) จากนั้น Deploy โฟลเดอร์ `dist/` ขึ้น GitHub Pages ได้ทันที
