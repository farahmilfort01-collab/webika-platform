import Link from 'next/link';
import { redirect } from 'next/navigation';
import { server } from '@/lib/supabase-server';
import { configured } from '@/lib/supabase';
import { T, PACKS } from '@/lib/core';
import { STATUS, fmtDate, fmtEur } from '@/lib/labels';
import { PayButton, RequestForm, ProfileForm, SignOut } from '@/components/Forms';
import Head from '@/components/Head';
export const metadata = { title: 'Mon espace' };
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<{ paiement?: string; projet?: string }> }) {
  const sp = await searchParams;
  if (!configured) return <section className="sec"><div className="wrap"><Head eye="Espace client" title="Bientôt disponible." sub="Les comptes clients ne sont pas encore activés sur ce site." /><Link href="/contact" className="btn b-blue">Nous contacter</Link></div></section>;
  const sb = await server(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect('/connexion?next=/espace-client');
  const [{ data: profile }, { data: projects }, { data: requests }, { data: payments }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', user.id).single(), sb.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    sb.from('requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }), sb.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })]);
  const P = projects || [], R = requests || [], Y = payments || [];
  return (<section className="sec"><div className="wrap">
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, alignItems: 'flex-end', marginBottom: 28 }}>
      <div><span className="eye">Espace client</span><h1 style={{ fontSize: 'clamp(30px,4vw,46px)', marginTop: 8 }}>Bonjour {profile?.full_name || user.email}</h1></div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{profile?.role === 'admin' && <Link href="/admin" className="btn b-ink sm">Administration</Link>}<Link href="/creer" className="btn b-blue sm">Nouveau projet</Link><SignOut /></div></div>
    {sp.paiement === 'ok' && <p className="alert" style={{ marginBottom: 18, background: '#D9F2E0', borderColor: '#1F8F3A' }}>Paiement reçu, merci. Il apparaît dans votre historique sous quelques instants.</p>}
    {sp.paiement === 'annule' && <p className="alert" style={{ marginBottom: 18 }}>Paiement annulé. Aucun montant n'a été débité.</p>}
    {sp.projet === 'cree' && <p className="alert" style={{ marginBottom: 18, background: '#D9F2E0', borderColor: '#1F8F3A' }}>Votre projet est enregistré. Nous préparons votre démonstration.</p>}
    <div className="dash">
      <div className="card" style={{ gridColumn: '1/-1' }}><h2>Mes projets</h2>
        {!P.length ? <p>Aucun projet pour l'instant. <Link href="/creer">Créer mon site</Link></p> : <div className="tblw"><table className="tbl"><thead><tr><th>Entreprise</th><th>Modèle</th><th>Pack</th><th>Statut</th><th>Créé le</th><th>Paiement</th></tr></thead><tbody>
          {P.map((p: any) => { const t: any = T.find((x: any) => x.id === p.template_id), pk: any = (PACKS as any)[p.pack]; const paid = Y.filter((y: any) => y.project_id === p.id && !y.label.startsWith('Maintenance')).length;
            return <tr key={p.id}><td><b>{p.company?.name || '—'}</b></td><td>{t ? <Link href={'/modeles/' + t.id}>{t.name}</Link> : p.template_id}</td><td>{pk.n} · {pk.p} €</td><td><span className={'st ' + (p.status === 'livre' ? 'ok' : 'wait')}>{STATUS[p.status]}</span></td><td>{fmtDate(p.created_at)}</td>
              <td>{paid >= 2 ? <span className="st ok">Réglé</span> : <PayButton kind={paid === 0 ? 'acompte' : 'solde'} projectId={p.id}>{paid === 0 ? 'Payer l\'acompte' : 'Payer le solde'} · {pk.p / 2} €</PayButton>}</td></tr>; })}</tbody></table></div>}</div>
      <div className="card"><h2>Demandes et assistance</h2><RequestForm projects={P} />
        {R.length > 0 && <div className="tblw" style={{ marginTop: 14 }}><table className="tbl"><thead><tr><th>Date</th><th>Demande</th><th>Statut</th></tr></thead><tbody>{R.map((r: any) => <tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{r.message}</td><td><span className={'st ' + (r.status === 'traitee' ? 'ok' : 'wait')}>{r.status === 'traitee' ? 'Traitée' : 'Ouverte'}</span></td></tr>)}</tbody></table></div>}</div>
      <div className="card"><h2>Mes informations</h2><ProfileForm profile={profile} /></div>
      <div className="card"><h2>Historique des paiements</h2>{!Y.length ? <p>Aucun paiement enregistré.</p> : <div className="tblw"><table className="tbl"><thead><tr><th>Date</th><th>Libellé</th><th>Montant</th></tr></thead><tbody>{Y.map((y: any) => <tr key={y.id}><td>{fmtDate(y.created_at)}</td><td>{y.label}</td><td>{fmtEur(y.amount_cents)}</td></tr>)}</tbody></table></div>}</div>
      <div className="card"><h2>Maintenance</h2><p style={{ marginBottom: 12 }}>Abonnement mensuel sans engagement : hébergement, sécurité et mises à jour.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><PayButton kind="maintenance" plan={25} projectId={P[0]?.id} cls="b-ink">Souscrire · 25 € / mois</PayButton><PayButton kind="maintenance" plan={49} projectId={P[0]?.id} cls="b-line">Souscrire · 49 € / mois</PayButton></div>
        <p className="nt" style={{ marginTop: 10 }}>Pour modifier ou résilier un abonnement, envoyez une demande d'assistance.</p></div>
    </div></div></section>);
}
