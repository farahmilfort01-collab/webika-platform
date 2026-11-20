import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import { CONFIG } from '@/lib/core';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'WEBIKA — Votre entreprise mérite sa place sur Internet', template: '%s · WEBIKA' },
  description: 'WEBIKA crée des sites internet professionnels pour les entrepreneurs, commerçants, artisans et PME. 50 modèles prêts à l\'emploi, dès 190 €.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr"><head>
      <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;600;700&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&family=Archivo+Black&family=Cormorant+Garamond:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap" />
    </head><body>
      <Header /><main>{children}</main>
      <footer><div className="wrap"><span><b style={{ color: '#fff' }}>webika</b> · Votre entreprise mérite sa place sur Internet. · <Link href="/a-propos" style={{ color: '#A9ACB6' }}>À propos</Link></span>
        <span>{CONFIG.entreprise} · SIREN {CONFIG.siren} · {CONFIG.mentionTVA}</span></div></footer>
    </body></html>
  );
}
