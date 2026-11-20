import Needs from '@/components/Needs';
import Custom from '@/components/Custom';
export const metadata = { title: 'Vos besoins' };
export default function Page() {
  return (<section className="sec dark"><div className="wrap">
    <div className="head"><span className="eye">Un besoin, une solution</span><h1 style={{ fontSize: 'clamp(32px,4.6vw,54px)' }}>Votre entreprise rencontre-t-elle l'un de ces problèmes ?</h1><p>Cliquez sur votre situation : la solution adaptée s'affiche juste en dessous.</p></div>
    <Needs /><Custom />
    <p className="promise">« Quel que soit votre besoin, WEBIKA vous accompagne pour construire votre présence digitale. »</p></div></section>);
}
