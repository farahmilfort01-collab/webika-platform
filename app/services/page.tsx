import Link from 'next/link';
import { SVC } from '@/lib/core';
import Icon from '@/components/Icon';
import Custom from '@/components/Custom';
import Head from '@/components/Head';
import { svcHref } from '@/lib/labels';
const HOW = [['Choisissez votre activité', 'Douze secteurs, du restaurant à la boutique en ligne.'], ['Découvrez les modèles', 'Ouvrez les démonstrations sur ordinateur et téléphone.'], ['Sélectionnez votre design', 'Gardez vos favoris, choisissez celui qui vous ressemble.'], ['Personnalisez vos informations', 'Nom, services, tarifs, couleurs.'], ['Validez votre commande', 'Devis clair, paiement en plusieurs fois possible.'], ['Recevez votre site', 'En ligne sous 7 jours, avec tous vos accès.']];
export const metadata = { title: 'Nos services' };
export default function Page() {
  return (<section className="sec"><div className="wrap">
    <Head eye="Nos services" title="Tout ce dont votre entreprise a besoin pour réussir en ligne." sub="De la création de votre site internet à votre visibilité digitale, WEBIKA vous accompagne à chaque étape." />
    <div className="g3">{Object.entries(SVC).map(([k, s]: any) => (
      <article className="svc" id={'svc-' + k} key={k}><div className="ic"><Icon k={s.ic} s={26} /></div><h2 style={{ fontSize: 24 }}>{s.t}</h2><ul>{s.b.map((b: string) => <li key={b}>{b}</li>)}</ul>
        <div className="row"><Link className="btn b-ink sm" href={svcHref(k)}>{s.cta}</Link><Link className="btn b-line sm" href={'/devis?pack=' + s.pack + '&besoin=' + k}>Demander un devis</Link></div></article>))}</div>
    <Custom />
    <div className="head" style={{ marginTop: 72 }}><span className="eye">Comment ça marche</span><h2>Six étapes, et votre site est prêt.</h2></div>
    <div className="g3 how">{HOW.map((x) => <div className="hs" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></div>)}</div></div></section>);
}
