import Link from 'next/link';
import { notFound } from 'next/navigation';
import { T, CATS, STYLES, PACKS, packOf } from '@/lib/core';
import DemoView from '@/components/DemoView';
export function generateStaticParams() { return T.map((t: any) => ({ id: t.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const t: any = T.find((x: any) => x.id === id); return { title: t ? 'Modèle ' + t.name + ' — ' + t.metier : 'Modèle' }; }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const t: any = T.find((x: any) => x.id === id); if (!t) notFound();
  const pk: any = (PACKS as any)[packOf(t)];
  return (<section className="sec"><div className="wrap">
    <p style={{ marginBottom: 14 }}><Link href="/modeles">← Tous les modèles</Link></p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
      <div><span className="eye">{(CATS.find((c: any) => c[0] === t.cat) as any)[1]} · {(STYLES as any)[t.style]}</span><h1 style={{ fontSize: 'clamp(30px,4vw,48px)', marginTop: 8 }}>{t.name}</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>{t.metier} · Fonctionnalités : {t.features.join(', ')} · Pack conseillé : {pk.n}, {pk.p} €</p></div>
      <Link href={'/creer?modele=' + t.id} className="btn b-blue">Utiliser ce modèle</Link></div>
    <DemoView id={t.id} /></div></section>);
}
