import type { Metadata } from 'next'
import { fraunces, inter } from '@/lib/fonts'
import SiteHeader from '@/components/layout/SiteHeader'
import './globals.css'

// Placeholder hasta que exista dominio propio (docs/MASTER-PLAN.md, sección 21);
// necesario para que las URLs absolutas de Open Graph se generen correctamente.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joseph-dayan-art.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Joseph Dayan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
