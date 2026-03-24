import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],
    base: './',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
