import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skill Swap - Skill Exchange Platform',
    short_name: 'Skill Swap',
    description: 'A modern platform that enables users to exchange skills through a barter system for learning. Connect with people who want to teach skills they know in exchange for learning skills they need.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0ea5e9',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['education', 'social', 'productivity'],
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],

    shortcuts: [
      {
        name: 'Terms & Conditions',
        short_name: 'Terms',
        description: 'View terms and conditions',
        url: '/terms',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Privacy Policy',
        short_name: 'Privacy',
        description: 'View privacy policy',
        url: '/privacy',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    ]
  }
}
