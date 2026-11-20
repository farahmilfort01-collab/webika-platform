'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { T, CATS, STYLES, PACKS, packOf } from '@/lib/core';
import { browser, configured } from '@/lib/supabase';
import Preview from './Preview';
const EMPTY = { cat: '', id: '', name: '', desc: '', addr: '', tel: '', wa: '', mail: '', hours: '', soc: '', s1: '', p1: '', s2: '', p2: '', s3: '', p3: '', tagline: '', cta: '', p: '', a: '' };
export default function Wizard({ modele = '' }: { modele?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1), [w, setW] = useState<any>(EMPTY), [mob, setMob] = useState(false), [note, setNote] = useState(''), [busy, setBusy] = useState(false);
  const pick = (id: string, base: any = w) => { const t: any = T.find((x: any) => x.id === id); return t ? { ...base, id, cat: t.cat, p: t.c.p, a: t.c.a } : base; };
  useEffect(() => { let d: any = EMPTY; try { d = { ...EMPTY, ...JSON.parse(localStorage.getItem('wbk-draft') || '{}') }; } catch {} if (modele) d = pick(modele, d); setW(d); if (d.id) setStep(d.name ? 4 : 3); /* eslint-disable-next-line */ }, []);
  useEffect(() => { try { localStorage.setItem('wbk-draft', JSON.stringify(w)); } catch {} }, [w]);
  const set = (k: string, v: string) => setW((x: any) => ({ ...x, [k]: v }));
  const t: any = T.find((x: any) => x.id === w.id);
  const o = { name: w.name, desc: w.desc, addr: w.addr, tel: w.tel, hours: w.hours, soc: w.soc, tagline: w.tagline, cta: w.cta, p: w.p, a: w.a, services: [[w.s1, w.p1], [w.s2, w.p2], [w.s3, w.p3]] };
  const goto = (n: number) => { if (n > 1 && !w.cat) { setNote('Choisissez d\'abord votre secteur.'); return setStep(1); } if (n > 2 && !w.id) { setNote('Choisissez un modèle.'); return setStep(2); } if (n > 3 && !w.name.trim()) { setNote('Indiquez le nom de votre entreprise.'); return setStep(3); } setNote(''); setStep(n); };
  const order = async () => {
    if (!configured) { setNote('La création de compte n\'est pas encore activée. Utilisez la page Devis ou Contact pour nous transmettre votre projet.'); return; }
    setBusy(true); const sb = browser(); const { data: { user } } = await sb.auth.getUser();
    if (!user) { router.push('/inscription?next=/creer'); return; }
    const { error } = await sb.from('projects').insert({ user_id: user.id, template_id: w.id, pack: packOf(t), company: { ...o, whatsapp: w.wa, email: w.mail } });
    setBusy(false);
    if (error) { setNote('L\'enregistrement a échoué. Réessayez dans un instant.'); return; }
    try { localStorage.removeItem('wbk-draft'); } catch {} router.push('/espace-client?projet=cree');
  };
  const I = (k: string, label: string, full = false, ph = '') => <label className={'f' + (full ? ' full' : '')}>{label}<input type="text" value={w[k]} placeholder={ph} onChange={(e) => set(k, e.target.value)} /></label>;
  return (
    <div className="wz">
      <div className="panel">
        <div className="steps">{[1, 2, 3, 4, 5].map((i) => <button key={i} type="button" className={i === step ? 'on' : i < step ? 'done' : ''} aria-label={'Étape ' + i} aria-current={i === step ? 'step' : undefined} onClick={() => goto(i)} />)}</div>
        {step === 1 && <><h3>1. Votre secteur d'activité</h3><p className="hint">Choisissez ce qui ressemble le plus à votre activité.</p>
          <div className="opts">{CATS.map(([k, l]: any) => <button key={k} type="button" className="opt" aria-pressed={w.cat === k} onClick={() => { setW((x: any) => ({ ...x, cat: k, id: x.id && (T.find((t: any) => t.id === x.id) as any)?.cat === k ? x.id : '' })); setStep(2); }}>{l}<small>{T.filter((t: any) => t.cat === k).length} modèles</small></button>)}</div></>}
        {step === 2 && <><h3>2. Votre modèle</h3><p className="hint">Cliquez sur un modèle pour le voir dans l'aperçu.</p>
          <div className="opts">{T.filter((x: any) => x.cat === w.cat).map((x: any) => <button key={x.id} type="button" className="opt" aria-pressed={w.id === x.id} onClick={() => setW(pick(x.id))}>{x.name}<small>{x.metier} · {(STYLES as any)[x.style]}</small></button>)}</div></>}
        {step === 3 && <><h3>3. Votre entreprise</h3><p className="hint">Seul le nom est obligatoire. Vous pourrez compléter plus tard.</p>
          <div className="fields">{I('name', 'Nom commercial', true)}<label className="f full">Description<textarea value={w.desc} onChange={(e) => set('desc', e.target.value)} /></label>
            {I('addr', 'Adresse', true)}{I('tel', 'Téléphone')}{I('wa', 'WhatsApp')}{I('mail', 'E-mail')}{I('hours', 'Horaires')}
            {I('s1', 'Service 1')}{I('p1', 'Tarif 1')}{I('s2', 'Service 2')}{I('p2', 'Tarif 2')}{I('s3', 'Service 3')}{I('p3', 'Tarif 3')}{I('soc', 'Réseaux sociaux', true)}</div>
          <p className="nt" style={{ marginTop: 10 }}>Logo et photos : vous nous les transmettrez par WhatsApp ou e-mail après la commande.</p></>}
        {step === 4 && <><h3>4. Personnalisez</h3><p className="hint">Ajustez le message et les couleurs du modèle.</p>
          <div className="fields">{I('tagline', 'Phrase d\'accroche', true, t?.tagline)}{I('cta', 'Texte du bouton principal', true, t?.features[0])}
            <label className="f">Couleur principale<input type="color" value={w.p || '#000000'} onChange={(e) => set('p', e.target.value)} /></label>
            <label className="f">Couleur d'accent<input type="color" value={w.a || '#000000'} onChange={(e) => set('a', e.target.value)} /></label></div></>}
        {step === 5 && t && <><h3>5. On le crée pour vous</h3><p className="hint">Vérifiez l'aperçu, puis enregistrez votre projet dans votre espace client.</p>
          <div className="sumbox"><span><b>Entreprise :</b> {w.name}</span><span><b>Modèle :</b> {t.name} ({(STYLES as any)[t.style]})</span><span><b>Pack conseillé :</b> {(PACKS as any)[packOf(t)].n}, {(PACKS as any)[packOf(t)].p} €</span></div>
          <button type="button" className="btn b-blue" disabled={busy} onClick={order}>{busy ? 'Enregistrement…' : 'Enregistrer mon projet'}</button></>}
        <p className="nt" role="status" aria-live="polite" style={{ marginTop: 12 }}>{note}</p>
        <div className="wnav"><button type="button" className="btn b-line sm" style={{ visibility: step === 1 ? 'hidden' : 'visible' }} onClick={() => setStep(step - 1)}>Retour</button>{step < 5 && <button type="button" className="btn b-blue sm" onClick={() => goto(step + 1)}>Continuer</button>}</div>
      </div>
      <div className="pv">
        <div className="bar"><span>{t ? 'Aperçu : ' + (w.name || t.name) : 'Aperçu en direct'}</span><div className="seg" role="group" aria-label="Taille de l'aperçu"><button type="button" aria-pressed={!mob} onClick={() => setMob(false)}>Ordinateur</button><button type="button" aria-pressed={mob} onClick={() => setMob(true)}>Téléphone</button></div></div>
        {t ? <Preview id={t.id} mobile={mob} o={o} height={520} /> : <div className="pvbox"><div className="ph0">Choisissez un secteur puis un modèle : votre futur site apparaît ici.</div></div>}
      </div>
    </div>
  );
}
