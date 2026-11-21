import Link from 'next/link';
import { T } from '@/lib/core';
import { Card } from '@/components/Library';
import Typewriter from '@/components/Typewriter';
const ADV = [["On s'occupe de tout", 'Vous nous donnez vos informations, nous créons le site, la fiche Google et le WhatsApp Business.'], ['En ligne en 7 jours', 'Un modèle pensé pour votre métier, personnalisé à vos couleurs, parfait sur téléphone.'], ['Dès 190 €', "Un prix annoncé à l'avance, payable en plusieurs fois, avec une démonstration avant de payer."]];
export default function Home() {
  const feat = ['r2', 'b2', 't1'].map((id) => T.find((t: any) => t.id === id));
  return (<>
    <section className="hero-cine">
      <div className="hero-cine-img" aria-hidden="true"></div>
      <div className="hero-cine-wrap">
        <span className="eye">Création de sites internet professionnels</span>
        <Typewriter text="Votre entreprise mérite sa place sur Internet." />
        <p className="sr">Votre entreprise mérite sa place sur Internet.</p>
        <p className="lead">Créez une présence digitale professionnelle en quelques étapes. Découvrez nos modèles, choisissez votre style et donnez une nouvelle dimension à votre entreprise.</p>
        <div className="cta"><Link href="/modeles" className="btn b-coral">Découvrir les modèles</Link><Link href="/creer" className="btn b-white">Créer mon site</Link></div>
      </div>
      <div className="hero-scroll" aria-hidden="true"></div>
    </section>
    <section className="sec"><div className="wrap"><div className="head"><span className="eye">Pourquoi WEBIKA</span><h2>Simple, rapide, à votre image.</h2></div>
      <div className="g3">{ADV.map((a, i) => <div className="adv" key={i}><span className="n">0{i + 1}</span><h3>{a[0]}</h3><p>{a[1]}</p></div>)}</div></div></section>
    <section className="sec" style={{ background: 'var(--soft)' }}><div className="wrap"><div className="head"><span className="eye">Nos modèles</span><h2>Un aperçu de la bibliothèque.</h2><p>Trois modèles parmi cinquante. Ouvrez une démonstration pour voir le site complet.</p></div>
      <div className="g3">{feat.map((t: any) => <Card key={t.id} t={t} />)}</div><div style={{ marginTop: 28 }}><Link href="/modeles" className="btn b-ink">Voir les 50 modèles</Link></div></div></section>
    <section className="sec"><div className="wrap"><div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
      <p style={{ font: '700 24px/1.2 var(--disp)', maxWidth: 640 }}>Un problème précis à régler ? Trouvez la solution adaptée à votre entreprise.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}><Link href="/besoins" className="btn b-blue">Trouver ma solution</Link><Link href="/tarifs" className="btn b-line">Voir les tarifs</Link></div></div></div></section>
  </>);
}
