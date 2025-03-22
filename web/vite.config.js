import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
//import { fileURLToPath } from 'url'
//import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  //envDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
})