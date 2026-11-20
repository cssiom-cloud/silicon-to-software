import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**
   * การตั้งค่า Base Path สำหรับ Deploy บน GitHub Pages:
   * - หาก Deploy ไปที่ https://<username>.github.io/<repo-name>/
   *   ให้แก้ค่า base เป็น '/<repo-name>/' เช่น '/silicon-to-software/'
   * - หาก Deploy ไปที่ Custom Domain หรือ Root (https://<username>.github.io/)
   *   หรือทดสอบแบบ Relative Path ให้ใช้ './'
   */
  base: '/silicon-to-software/',
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'three-vendor', test: /node_modules\/three/ },
            { name: 'motion-vendor', test: /node_modules\/framer-motion/ },
          ],
        },
      },
    },
  },
})
