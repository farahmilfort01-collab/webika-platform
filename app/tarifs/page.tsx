import Link from 'next/link';
import { PACKS } from '@/lib/core';
import Head from '@/components/Head';
export const metadata = { title: 'Tarifs' };
export default function Page() {
  return (<section className="sec"><div className="wrap">
    <Head eye="Tarifs" title="Des offres claires, sans surprise." sub="Paiement unique pour la création. Livraison sous 7 jours après réception de vos éléments. Deux séries de retouches incluses." />
    <div className="g3">{Object.entries(PACKS).map(([k, p]: any) => (
      <div className={'plan' + (p.ft ? ' ft' : '')} key={k}>{p.ft && <span className="tg">Le plus choisi</span>}<div><h2 style={{ fontSize: 30 }}>{p.n}</h2><span className="sb">{p.s}</span></div>
        <div className="pr">{p.p} €<small>paiement unique</small></div><ul>{p.i.map((x: string) => <li key={x}>{x}</li>)}</ul><p className="lim">{p.pay}. {p.lim}</p>
        <Link href={'/devis?pack=' + k} className={'btn ' + (p.ft ? 'b-coral' : 'b-ink')}>Choisir {p.n}</Link></div>))}</div>
    <div className="x3">
      <div className="box"><h3>Maintenance, sans engagement</h3><div className="rw"><span>Hébergement, sécurité et deux mises à jour par mois</span><b>25 € / mois</b></div><div className="rw"><span>La même formule + quatre visuels réseaux sociaux + suivi des avis</span><b>49 € / mois</b></div><div className="rw"><span>Résiliable avec un mois de préavis</span><b /></div></div>
      <div className="box"><h3>Options</h3><div className="rw"><span>Logo simple</span><b>80 €</b></div><div className="rw"><span>Séance photo sur place (selon zone)</span><b>60 €</b></div><div className="rw"><span>Page supplémentaire</span><b>50 €</b></div><div className="rw"><span>Pack de 8 visuels réseaux</span><b>90 €</b></div></div>
      <div className="box pm"><span className="eye" style={{ color: 'var(--ink)' }}>Offre de lancement</span><h3 style={{ marginTop: 8 }}>-30 % pour les cinq premiers commerces</h3><p>Sur le pack, en échange d'un avis et d'un témoignage. À cocher dans le devis.</p></div></div>
    <p className="nt" style={{ marginTop: 16 }}>Paiement par carte bancaire depuis votre espace client, ou par virement. Mobile Money et autres moyens locaux : selon le pays, sur demande. Les boutiques en ligne avec paiement intégré font l'objet d'un devis personnalisé.</p></div></section>);
}
