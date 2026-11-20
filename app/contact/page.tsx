import { ContactForm } from '@/components/Forms';
import { CONFIG } from '@/lib/core';
export const metadata = { title: 'Contact' };
export default async function Page({ searchParams }: { searchParams: Promise<{ besoin?: string }> }) {
  const { besoin } = await searchParams;
  return (<section className="sec dark"><div className="wrap">
    <div className="head"><span className="eye">Contact</span><h1 style={{ fontSize: 'clamp(32px,4.6vw,54px)' }}>Parlons de votre projet.</h1><p>Démonstration gratuite et sans engagement.</p></div>
    <div className="ct"><div className="inf"><span>WhatsApp : <b style={{ color: '#fff' }}>{CONFIG.whatsappAffiche}</b></span><span>E-mail : <b style={{ color: '#fff' }}>{CONFIG.email}</b></span><span>Guyane, Antilles, Afrique et partout à distance</span></div>
      <ContactForm besoin={besoin} /></div></div></section>);
}
