import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleIntelligenceRequest } from './server/intelligence-api.js'

function intelligenceApi() {
  return {
    name: 'resq-intelligence-api',
    configureServer(server) {
      server.middlewares.use('/api/intelligence', handleIntelligenceRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/intelligence', handleIntelligenceRequest)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), intelligenceApi()],
})
