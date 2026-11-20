import Wizard from '@/components/Wizard';
import Head from '@/components/Head';
export const metadata = { title: 'Créer mon site' };
export default async function Page({ searchParams }: { searchParams: Promise<{ modele?: string }> }) {
  const { modele } = await searchParams;
  return (<section className="sec"><div className="wrap"><Head eye="Créer mon site" title="Commencez votre projet maintenant." sub="Remplissez vos informations : l'aperçu se met à jour en direct. Votre brouillon est gardé sur cet appareil." /><Wizard modele={modele} /></div></section>);
}
