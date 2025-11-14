import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // SWC is bundled
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
