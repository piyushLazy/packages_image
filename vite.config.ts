import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Your preferred port
    strictPort: true,
    // Add this configuration:
    host: true, // needed for ngrok
    allowedHosts: [
      'https://packages-image.vercel.app' // Your ngrok host
    ],
    // Optional: If you need CORS in dev server
    cors: {
      origin: [
        'https://packages-image.vercel.app',
        'http://localhost:3000'
      ],
      credentials: true
    }
  },
  // Optional: For production build if needed
  preview: {
    port: 5173,
    host: true,
    allowedHosts: [
      'packages-image.vercel.app'
    ]
  }
})