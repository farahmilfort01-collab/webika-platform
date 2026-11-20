'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { browser, configured } from '@/lib/supabase';
import { SVC, CONFIG } from '@/lib/core';
const Off = () => <p className="alert">Les comptes clients ne sont pas encore activés sur ce site. En attendant, utilisez la page <Link href="/contact">Contact</Link>.</p>;
export function AuthForm({ mode, next = '/espace-client' }: { mode: 'in' | 'up'; next?: string }) {
  const router = useRouter(); const [f, setF] = useState<any>({ email: '', password: '', full_name: '', company: '', phone: '' }), [note, setNote] = useState(''), [busy, setBusy] = useState(false);
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/espace-client';
  if (!configured) return <Off />;
  const go = async (e: any) => { e.preventDefault(); setBusy(true); setNote(''); const sb = browser();
    if (mode === 'in') { const { error } = await sb.auth.signInWithPassword({ email: f.email, password: f.password }); if (error) { setNote('E-mail ou mot de passe incorrect.'); setBusy(false); return; } }
    else { if (f.password.length < 8) { setNote('Le mot de passe doit contenir au moins 8 caractères.'); setBusy(false); return; }
      const { data, error } = await sb.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.full_name, company: f.company, phone: f.phone } } });
      if (error) { setNote('Inscription impossible : ' + error.message); setBusy(false); return; }
      if (!data.session) { setNote('Compte créé. Ouvrez l\'e-mail de confirmation que nous venons de vous envoyer, puis connectez-vous.'); setBusy(false); return; } }
    router.push(safeNext); router.refresh(); };
  const I = (k: string, label: string, type = 'text', ac = '') => <label className="f">{label}<input type={type} required={k === 'email' || k === 'password'} autoComplete={ac} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>;
  return (<form className="card auth" onSubmit={go} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {mode === 'up' && <>{I('full_name', 'Nom et prénom', 'text', 'name')}{I('company', 'Nom de l\'entreprise')}{I('phone', 'Téléphone / WhatsApp', 'tel', 'tel')}</>}
    {I('email', 'E-mail', 'email', 'email')}{I('password', 'Mot de passe', 'password', mode === 'in' ? 'current-password' : 'new-password')}
    <button className="btn b-blue" disabled={busy}>{mode === 'in' ? 'Me connecter' : 'Créer mon compte'}</button>
    <p className="nt" role="status" aria-live="polite">{note}</p>
    <p className="nt">{mode === 'in' ? <>Pas encore de compte ? <Link href={'/inscription?next=' + encodeURIComponent(safeNext)}>Créer un compte</Link></> : <>Déjà un compte ? <Link href={'/connexion?next=' + encodeURIComponent(safeNext)}>Me connecter</Link></>}</p>
  </form>);
}
export function ContactForm({ besoin = '' }: { besoin?: string }) {
  const [f, setF] = useState<any>({ name: '', company: '', contact: '', need: besoin === 'sur-mesure' ? 'Projet sur mesure' : '', msg: '' }), [note, setNote] = useState('');
  const text = `Bonjour WEBIKA, je suis ${f.name || '[nom]'}${f.company ? ' (' + f.company + ')' : ''}. ${f.need ? 'Besoin : ' + f.need + '. ' : ''}${f.msg || 'Je voudrais une démonstration gratuite.'}`;
  const send = async (e: any) => { e.preventDefault();
    if (!f.name.trim() || !f.contact.trim()) { setNote('Indiquez votre nom et un téléphone ou un e-mail.'); return; }
    if (!configured) { try { await navigator.clipboard.writeText(text); setNote('L\'envoi en ligne n\'est pas encore activé. Votre message est copié : collez-le dans WhatsApp ou un e-mail.'); } catch { setNote('L\'envoi en ligne n\'est pas encore activé.'); } return; }
    const isMail = f.contact.includes('@');
    const { error } = await browser().from('leads').insert({ kind: 'contact', name: f.name, company: f.company, email: isMail ? f.contact : null, phone: isMail ? null : f.contact, data: { besoin: f.need, message: f.msg } });
    setNote(error ? 'L\'envoi a échoué. Réessayez dans un instant.' : 'Message envoyé. Nous vous répondons rapidement.'); };
  const S = (k: string) => ({ value: f[k], onChange: (e: any) => setF({ ...f, [k]: e.target.value }) });
  return (<form onSubmit={send}>
    <label className="f">Votre nom<input type="text" autoComplete="name" {...S('name')} /></label>
    <label className="f">Votre entreprise<input type="text" {...S('company')} /></label>
    <label className="f">Téléphone ou e-mail<input type="text" {...S('contact')} /></label>
    <label className="f">Votre besoin<select {...S('need')}><option value="">Choisir…</option>{Object.values(SVC).map((s: any) => <option key={s.t}>{s.t}</option>)}<option>Projet sur mesure</option><option>Autre</option></select></label>
    <label className="f">Votre message<textarea {...S('msg')} /></label>
    <button className="btn b-blue">Envoyer mon message</button>
    {CONFIG.whatsapp && <a className="btn b-wa" target="_blank" rel="noopener" href={'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text)}>Envoyer par WhatsApp</a>}
    <p className="nt" role="status" aria-live="polite">{note}</p>
  </form>);
}
export function PayButton({ kind, projectId, plan, children, cls = 'b-blue' }: any) {
  const [note, setNote] = useState('');
  const pay = async () => { setNote('Ouverture du paiement…'); const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, projectId, plan }) }); const j = await r.json().catch(() => ({})); if (j.url) window.location.href = j.url; else setNote(j.error || 'Paiement indisponible pour le moment.'); };
  return <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}><button type="button" className={'btn sm ' + cls} onClick={pay}>{children}</button>{note && <span className="nt" role="status">{note}</span>}</span>;
}
export function RequestForm({ projects }: { projects: any[] }) {
  const router = useRouter(); const [f, setF] = useState<any>({ kind: 'modification', project_id: projects[0]?.id || '', message: '' }), [note, setNote] = useState('');
  const send = async (e: any) => { e.preventDefault(); if (!f.message.trim()) { setNote('Écrivez votre demande.'); return; } const sb = browser(); const { data: { user } } = await sb.auth.getUser(); if (!user) return;
    const { error } = await sb.from('requests').insert({ user_id: user.id, kind: f.kind, project_id: f.project_id || null, message: f.message }); if (error) { setNote('L\'envoi a échoué.'); return; } setF({ ...f, message: '' }); setNote('Demande envoyée.'); router.refresh(); };
  return (<form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div className="fields"><label className="f">Type<select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="modification">Modification du site</option><option value="support">Question / assistance</option></select></label>
      <label className="f">Projet<select value={f.project_id} onChange={(e) => setF({ ...f, project_id: e.target.value })}><option value="">Aucun en particulier</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.company?.name || p.template_id}</option>)}</select></label></div>
    <label className="f">Votre demande<textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
    <button className="btn b-ink sm" style={{ alignSelf: 'flex-start' }}>Envoyer la demande</button><p className="nt" role="status" aria-live="polite">{note}</p></form>);
}
export function ProfileForm({ profile }: { profile: any }) {
  const router = useRouter(); const [f, setF] = useState<any>({ full_name: profile?.full_name || '', company: profile?.company || '', phone: profile?.phone || '' }), [note, setNote] = useState('');
  const save = async (e: any) => { e.preventDefault(); const { error } = await browser().from('profiles').update(f).eq('id', profile.id); setNote(error ? 'Échec de l\'enregistrement.' : 'Informations enregistrées.'); router.refresh(); };
  const I = (k: string, l: string) => <label className="f">{l}<input type="text" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>;
  return <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{I('full_name', 'Nom et prénom')}{I('company', 'Entreprise')}{I('phone', 'Téléphone / WhatsApp')}<button className="btn b-ink sm" style={{ alignSelf: 'flex-start' }}>Enregistrer</button><p className="nt" role="status" aria-live="polite">{note}</p></form>;
}
export function SignOut() { const router = useRouter(); return <button type="button" className="btn b-line sm" onClick={async () => { await browser().auth.signOut(); router.push('/'); router.refresh(); }}>Me déconnecter</button>; }
export function AdminSelect({ table, id, field, value, options }: { table: string; id: string; field: string; value: string; options: string[][] }) {
  const router = useRouter(); const [v, setV] = useState(value), [note, setNote] = useState('');
  return <span><select aria-label="Statut" value={v} style={{ minHeight: 40, padding: '6px 10px', width: 'auto' }} onChange={async (e) => { const nv = e.target.value; setV(nv); const { error } = await browser().from(table).update({ [field]: nv }).eq('id', id); setNote(error ? ' Échec' : ' Enregistré'); router.refresh(); }}>{options.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select><span className="nt" role="status">{note}</span></span>;
}
