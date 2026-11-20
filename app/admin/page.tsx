import { redirect } from 'next/navigation';
import { server } from '@/lib/supabase-server';
import { configured } from '@/lib/supabase';
import { T, PACKS } from '@/lib/core';
import { STATUS, fmtDate, fmtEur } from '@/lib/labels';
import { AdminSelect } from '@/components/Forms';
export const metadata = { title: 'Administration' };
export const dynamic = 'force-dynamic';
export default async function Page() {
  if (!configured) redirect('/');
  const sb = await server(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect('/connexion?next=/admin');
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single(); if (me?.role !== 'admin') redirect('/espace-client');
  const [{ data: projects }, { data: requests }, { data: leads }, { data: payments }, { data: profiles }] = await Promise.all([
    sb.from('projects').select('*').order('created_at', { ascending: false }), sb.from('requests').select('*').order('created_at', { ascending: false }),
    sb.from('leads').select('*').order('created_at', { ascending: false }).limit(100), sb.from('payments').select('*').order('created_at', { ascending: false }).limit(100), sb.from('profiles').select('*').order('created_at', { ascending: false })]);
  const who = (id: string) => { const p: any = (profiles || []).find((x: any) => x.id === id); return p ? [p.full_name, p.company, p.phone].filter(Boolean).join(' · ') || '—' : '—'; };
  const total = (payments || []).reduce((s: number, y: any) => s + y.amount_cents, 0);
  const Box = ({ title, children }: any) => <div className="card" style={{ marginBottom: 20 }}><h2 style={{ fontSize: 24, marginBottom: 12 }}>{title}</h2><div className="tblw">{children}</div></div>;
  return (<section className="sec"><div className="wrap">
    <span className="eye">Administration</span><h1 style={{ fontSize: 'clamp(30px,4vw,46px)', margin: '8px 0 24px' }}>Tableau de bord WEBIKA</h1>
    <div className="g4" style={{ marginBottom: 20 }}>{[['Clients', (profiles || []).length], ['Projets', (projects || []).length], ['Demandes ouvertes', (requests || []).filter((r: any) => r.status === 'ouverte').length], ['Encaissé', fmtEur(total)]].map(([l, v]: any) => <div className="adv" key={l}><span className="n">{l}</span><h3 style={{ fontSize: 30 }}>{v}</h3></div>)}</div>
    <Box title="Projets"><table className="tbl"><thead><tr><th>Date</th><th>Client</th><th>Entreprise</th><th>Modèle</th><th>Pack</th><th>Statut</th></tr></thead><tbody>{(projects || []).map((p: any) => <tr key={p.id}><td>{fmtDate(p.created_at)}</td><td>{who(p.user_id)}</td><td><b>{p.company?.name}</b><br /><span className="nt">{[p.company?.tel, p.company?.whatsapp, p.company?.email].filter(Boolean).join(' · ')}</span></td><td>{(T.find((t: any) => t.id === p.template_id) as any)?.name || p.template_id}</td><td>{(PACKS as any)[p.pack].n}</td><td><AdminSelect table="projects" id={p.id} field="status" value={p.status} options={Object.entries(STATUS)} /></td></tr>)}</tbody></table></Box>
    <Box title="Demandes des clients"><table className="tbl"><thead><tr><th>Date</th><th>Client</th><th>Type</th><th>Message</th><th>Statut</th></tr></thead><tbody>{(requests || []).map((r: any) => <tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{who(r.user_id)}</td><td>{r.kind}</td><td>{r.message}</td><td><AdminSelect table="requests" id={r.id} field="status" value={r.status} options={[['ouverte', 'Ouverte'], ['traitee', 'Traitée']]} /></td></tr>)}</tbody></table></Box>
    <Box title="Devis et messages reçus"><table className="tbl"><thead><tr><th>Date</th><th>Type</th><th>Contact</th><th>Détail</th></tr></thead><tbody>{(leads || []).map((l: any) => <tr key={l.id}><td>{fmtDate(l.created_at)}</td><td>{l.kind}</td><td><b>{l.name}</b> {l.company && '(' + l.company + ')'}<br /><span className="nt">{[l.phone, l.email].filter(Boolean).join(' · ')}</span></td><td>{l.kind === 'devis' ? <>Devis {l.data?.no} · pack {l.data?.pack} · <b>{l.data?.total} €</b>{l.data?.message && <><br />{l.data.message}</>}</> : <>{l.data?.besoin && <b>{l.data.besoin} : </b>}{l.data?.message}</>}</td></tr>)}</tbody></table></Box>
    <Box title="Paiements"><table className="tbl"><thead><tr><th>Date</th><th>Client</th><th>Libellé</th><th>Montant</th></tr></thead><tbody>{(payments || []).map((y: any) => <tr key={y.id}><td>{fmtDate(y.created_at)}</td><td>{who(y.user_id)}</td><td>{y.label}</td><td>{fmtEur(y.amount_cents)}</td></tr>)}</tbody></table></Box>
    <Box title="Clients"><table className="tbl"><thead><tr><th>Inscrit le</th><th>Nom</th><th>Entreprise</th><th>Téléphone</th><th>Rôle</th></tr></thead><tbody>{(profiles || []).map((p: any) => <tr key={p.id}><td>{fmtDate(p.created_at)}</td><td>{p.full_name}</td><td>{p.company}</td><td>{p.phone}</td><td>{p.role}</td></tr>)}</tbody></table></Box>
  </div></section>);
}
