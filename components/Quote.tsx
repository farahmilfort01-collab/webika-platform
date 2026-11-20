'use client';
import { useEffect, useMemo, useState } from 'react';
import { PACKS, T, CATS, SVC, CONFIG, eur, pdf, packOf } from '@/lib/core';
import { browser, configured } from '@/lib/supabase';
const NO = (() => { const d = new Date(), p = (n: number) => String(n).padStart(2, '0'); return 'WBK-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + Math.floor(1000 + Math.random() * 9000); });
export default function Quote({ pack0 = 'pro', besoin = '', modele = '' }: { pack0?: string; besoin?: string; modele?: string }) {
  const [no, setNo] = useState('');
  useEffect(() => setNo(NO()), []); // généré côté navigateur uniquement
  const [f, setF] = useState<any>({ nom: '', com: '', tel: '', mail: '', ville: '', modele, pack: (PACKS as any)[pack0] ? pack0 : 'pro', logo: false, photo: false, page: false, pageQ: 1, vis: false, ent: 0, pay: '50', promo: false, msg: besoin && (SVC as any)[besoin] ? 'Besoin : ' + (SVC as any)[besoin].t : '' });
  const [note, setNote] = useState('');
  const set = (k: string, v: any) => setF((x: any) => { const n = { ...x, [k]: v }; if (k === 'modele') { const t = T.find((t: any) => t.id === v); if (t) n.pack = packOf(t); } if (n.pack === 'essentiel') n.pay = '50'; if (n.pack === 'premium' && n.pay === '2') n.pay = '3'; return n; });
  const payOpts = f.pack === 'essentiel' ? [['50', '50 % à la commande, 50 % à la livraison']] : f.pack === 'pro' ? [['50', '50 % à la commande, 50 % à la livraison'], ['2', 'En 2 fois sans frais'], ['3', 'En 3 fois sans frais'], ['1', 'En une fois']] : [['50', '50 % à la commande, 50 % à la livraison'], ['3', 'En 3 fois sans frais'], ['1', 'En une fois']];
  const d = useMemo(() => {
    const pk = (PACKS as any)[f.pack], L: any[] = [['Pack ' + pk.n + ' — ' + pk.s, pk.p]];
    if (f.promo) L.push(['Offre de lancement -30 % sur le pack', -Math.round(pk.p * 0.3)]);
    if (f.logo) L.push(['Logo simple', 80]); if (f.photo) L.push(['Séance photo sur place', 60]);
    if (f.page) { const q = Math.max(1, Math.min(10, +f.pageQ || 1)); L.push([q + ' page' + (q > 1 ? 's' : '') + ' supplémentaire' + (q > 1 ? 's' : ''), 50 * q]); }
    if (f.vis) L.push(['Pack de 8 visuels réseaux sociaux', 90]);
    const tot = L.reduce((s, l) => s + l[1], 0);
    let sc: any[] = f.pay === '50' ? [['À la commande', tot / 2], ['À la livraison', tot / 2]] : f.pay === '2' ? [['À la commande', tot / 2], ['30 jours après', tot / 2]] : f.pay === '3' ? [['À la commande', tot / 3], ['30 jours après', tot / 3], ['60 jours après', tot / 3]] : [['À la commande', tot]];
    sc = sc.map((x) => [x[0], Math.round(x[1] * 100) / 100]);
    return { no, date: no ? new Date().toLocaleDateString('fr-FR') : '', pack: f.pack, L, tot, sc, ent: +f.ent || 0, mod: T.find((t: any) => t.id === f.modele), nom: f.nom.trim(), com: f.com.trim(), tel: f.tel.trim(), mail: f.mail.trim(), ville: f.ville.trim(), msg: f.msg.trim() };
  }, [f, no]);
  const text = () => { let s = `Bonjour WEBIKA, voici mon devis ${d.no} du ${d.date} :\n`; if (d.com || d.nom) s += [d.com, d.nom].filter(Boolean).join(' — ') + '\n'; if (d.mod) s += 'Modèle : ' + d.mod.name + '\n'; d.L.forEach((l) => (s += '• ' + l[0] + ' : ' + eur(l[1]) + '\n')); s += 'Total : ' + eur(d.tot) + '\n'; if (d.ent) s += 'Maintenance : ' + d.ent + ' € / mois\n'; if (d.msg) s += 'Message : ' + d.msg + '\n'; return s + 'Je souhaite recevoir ma démonstration.'; };
  const dl = async () => { const { jsPDF } = await import('jspdf'); pdf(d, jsPDF).save('Devis-WEBIKA-' + d.no + '.pdf'); };
  const copy = async () => { try { await navigator.clipboard.writeText(text()); setNote('Devis copié.'); } catch { setNote('Copie impossible : utilisez le PDF.'); } };
  const send = async () => {
    if (!d.nom || !(d.tel || d.mail)) { setNote('Indiquez votre nom et un téléphone ou un e-mail pour envoyer la demande.'); return; }
    if (!configured) { setNote('L\'envoi en ligne n\'est pas encore activé. Téléchargez le PDF ou copiez le devis.'); return; }
    const { error } = await browser().from('leads').insert({ kind: 'devis', name: d.nom, company: d.com, phone: d.tel, email: d.mail, data: { no: d.no, pack: d.pack, lignes: d.L, total: d.tot, echeancier: d.sc, maintenance: d.ent, modele: d.mod?.id || null, ville: d.ville, message: d.msg } });
    setNote(error ? 'L\'envoi a échoué. Réessayez ou téléchargez le PDF.' : 'Demande envoyée. Nous vous recontactons rapidement.');
  };
  const I = (k: string, label: string, type = 'text') => <label className="f">{label}<input type={type} value={f[k]} onChange={(e) => set(k, e.target.value)} /></label>;
  const C = (k: string, label: string, price: string, extra?: any) => <div className="ck"><label><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} /> {label}</label>{extra}<span>{price}</span></div>;
  const wa = CONFIG.whatsapp ? 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text()) : null;
  return (
    <div className="dv">
      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <fieldset><legend>Vos coordonnées</legend><div className="fields">{I('nom', 'Nom et prénom')}{I('com', 'Nom de l\'entreprise')}{I('tel', 'Téléphone / WhatsApp', 'tel')}{I('mail', 'E-mail', 'email')}{I('ville', 'Ville et pays')}
          <label className="f">Modèle choisi<select value={f.modele} onChange={(e) => set('modele', e.target.value)}><option value="">Pas encore choisi / démo à mon nom</option>{CATS.map(([k, l]: any) => <optgroup key={k} label={l}>{T.filter((t: any) => t.cat === k).map((t: any) => <option key={t.id} value={t.id}>{t.name} — {t.metier}</option>)}</optgroup>)}</select></label></div></fieldset>
        <fieldset><legend>Votre pack</legend><div className="ch3">{Object.entries(PACKS).map(([k, p]: any) => <label className="ch" key={k}><input type="radio" name="pack" checked={f.pack === k} onChange={() => set('pack', k)} /><span><b>{p.n}</b><em>{p.s}</em><strong>{p.p} €</strong></span></label>)}</div></fieldset>
        <fieldset><legend>Options</legend>{C('logo', 'Logo simple', '80 €')}{C('photo', 'Séance photo sur place', '60 €')}{C('page', 'Pages supplémentaires', '50 € / page', <input type="number" className="q" min={1} max={10} aria-label="Nombre de pages" value={f.pageQ} onChange={(e) => set('pageQ', e.target.value)} />)}{C('vis', 'Pack de 8 visuels réseaux', '90 €')}</fieldset>
        <fieldset style={{ margin: 0 }}><legend>Maintenance et paiement</legend><div className="fields">
          <label className="f">Maintenance<select value={f.ent} onChange={(e) => set('ent', e.target.value)}><option value="0">Sans maintenance</option><option value="25">25 € / mois</option><option value="49">49 € / mois</option></select></label>
          <label className="f">Paiement<select value={f.pay} onChange={(e) => set('pay', e.target.value)}>{payOpts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <div className="ck f full" style={{ fontWeight: 500, margin: 0 }}><label><input type="checkbox" checked={f.promo} onChange={(e) => set('promo', e.target.checked)} /> Offre de lancement -30 % sur le pack (contre un avis et un témoignage)</label></div>
          <label className="f full">Votre message (facultatif)<textarea value={f.msg} onChange={(e) => set('msg', e.target.value)} /></label></div></fieldset>
      </form>
      <aside className="card sum" aria-label="Récapitulatif"><span className="eye">Devis n° {no}</span><h3>Récapitulatif</h3>
        <div>{d.mod && <div className="rw"><span>Modèle : {d.mod.name}</span><b /></div>}{d.L.map((l) => <div className="rw" key={l[0]}><span>{l[0]}</span><b>{eur(l[1])}</b></div>)}</div>
        <div className="tot"><span>Total</span><b>{eur(d.tot)}</b></div>
        <div className="sch"><b>Échéancier</b>{d.sc.map((s) => <span key={s[0]}>{s[0]} : {eur(s[1])}</span>)}</div>
        <p className="nt">{d.ent ? 'Puis maintenance : ' + d.ent + ' € / mois, sans engagement.' : 'Sans maintenance : les modifications ultérieures font l\'objet d\'un devis.'}</p>
        <button type="button" className="btn b-blue" onClick={send}>Envoyer ma demande</button>
        <button type="button" className="btn b-ink" onClick={dl}>Télécharger le devis (PDF)</button>
        {wa && <a className="btn b-wa" href={wa} target="_blank" rel="noopener">Envoyer par WhatsApp</a>}
        <button type="button" className="btn b-line" onClick={copy}>Copier le devis</button>
        <p className="nt" role="status" aria-live="polite">{note || 'Devis valable 30 jours. Rien n\'est facturé avant votre validation.'}</p>
      </aside>
    </div>
  );
}
