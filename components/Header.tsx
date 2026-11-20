'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const LINKS = [['/', 'Accueil'], ['/besoins', 'Vos besoins'], ['/services', 'Services'], ['/modeles', 'Modèles'], ['/tarifs', 'Tarifs'], ['/devis', 'Devis'], ['/faq', 'FAQ'], ['/contact', 'Contact'], ['/espace-client', 'Mon espace']];
export default function Header() {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return (
    <header className="site"><div className="wrap nav">
      <Link className="logo" href="/" aria-label="WEBIKA, accueil"><i />webika</Link>
      <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="links" onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2A1D" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <nav className={'links' + (open ? ' open' : '')} id="links" aria-label="Navigation principale" onClick={() => setOpen(false)}>
        {LINKS.map(([h, l]) => <Link key={h} href={h} className={(h === '/' ? path === '/' : path.startsWith(h)) ? 'on' : ''} aria-current={path === h ? 'page' : undefined}>{l}</Link>)}
        <Link href="/creer" className="btn b-blue sm">Créer mon site</Link>
      </nav>
    </div></header>
  );
}
