import { AuthForm } from '@/components/Forms';
import Head from '@/components/Head';
export const metadata = { title: 'Connexion' };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (<section className="sec"><div className="wrap"><div className="auth"><Head eye="Espace client" title="Connexion" sub="Accédez à votre espace client." /></div><AuthForm mode="in" next={next} /></div></section>);
}
