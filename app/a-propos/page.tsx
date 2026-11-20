export const metadata = { title: 'À propos' };
export default function Page() {
  return (<section className="sec"><div className="wrap about">
    <blockquote>« Votre entreprise mérite <b>sa place</b> sur Internet. »</blockquote>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 17 }}><h1 className="eye" style={{ fontFamily: 'var(--sans)' }}>À propos</h1>
      <p><b>Notre mission.</b> Permettre aux entrepreneurs, commerçants, artisans, restaurants, indépendants et PME de disposer facilement d'un site internet professionnel, moderne et accessible, même sans connaissances techniques.</p>
      <p><b>Notre vision.</b> Devenir une plateforme de référence pour la digitalisation des petites et moyennes entreprises, de la Guyane et des Antilles à l'Afrique, puis à l'international.</p>
      <p><b>Notre méthode.</b> Des modèles conçus par métier, un accompagnement humain et des prix annoncés à l'avance.</p></div></div></section>);
}
