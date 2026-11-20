import Quote from '@/components/Quote';
import Head from '@/components/Head';
export const metadata = { title: 'Devis gratuit' };
export default async function Page({ searchParams }: { searchParams: Promise<{ pack?: string; besoin?: string; modele?: string }> }) {
  const sp = await searchParams;
  return (<section className="sec"><div className="wrap"><Head eye="Devis" title="Votre devis gratuit, en deux minutes." sub="Le total se calcule tout seul. Envoyez votre demande, téléchargez le PDF ou copiez le devis." /><Quote pack0={sp.pack} besoin={sp.besoin} modele={sp.modele} /></div></section>);
}
