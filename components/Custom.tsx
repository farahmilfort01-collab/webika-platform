import Link from 'next/link';
export default function Custom() {
  return (
    <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginTop: 22, color: 'var(--ink)' }}>
      <div style={{ maxWidth: 680 }}><h3 style={{ fontSize: 26, marginBottom: 8 }}>Vous ne trouvez pas votre besoin ? Discutons-en.</h3>
        <p style={{ color: 'var(--muted)' }}>Chaque entreprise est différente. Décrivez-nous votre projet : nous construisons une solution sur mesure, avec un devis personnalisé.</p></div>
      <Link href="/contact?besoin=sur-mesure" className="btn b-blue">Discuter de mon projet sur mesure</Link>
    </div>
  );
}
