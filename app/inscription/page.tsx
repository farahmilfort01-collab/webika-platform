import { AuthForm } from '@/components/Forms';
import Head from '@/components/Head';
export const metadata = { title: 'Inscription' };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (<section className="sec"><div className="wrap"><div className="auth"><Head eye="Espace client" title="Inscription" sub="Créez votre compte pour suivre votre projet." /></div><AuthForm mode="up" next={next} /></div></section>);
}
