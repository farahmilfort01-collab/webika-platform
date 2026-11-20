import Library from '@/components/Library';
import Head from '@/components/Head';
import { CATS } from '@/lib/core';
export const metadata = { title: 'Les 50 modèles' };
export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams; const ok = CATS.some((c: any) => c[0] === cat);
  return (<section className="sec"><div className="wrap"><Head eye="Bibliothèque" title="50 modèles prêts à l'emploi." sub="Filtrez par activité ou par style, ouvrez la démonstration sur ordinateur et sur téléphone, gardez vos favoris." /><Library initialCat={ok ? cat : 'all'} /></div></section>);
}
