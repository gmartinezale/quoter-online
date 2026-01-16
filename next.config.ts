/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers () {
    return [
      {
        source: '/(.*)',
        headers: [
          // Permitimos popups (requerido por GSI popup)
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },

          // Opcional: si añadiste COEP antes, evita 'require-corp' a menos que lo necesites.
          // { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ]
  },
};

export default nextConfig
