import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { server } from '@/lib/supabase-server';
import { PACKS } from '@/lib/core';
// Crée une session de paiement Stripe : acompte ou solde d'un projet, ou abonnement de maintenance.
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Le paiement en ligne n\'est pas encore configuré.' }, { status: 503 });
  const sb = await server();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  const { kind, projectId, plan } = await req.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const common = { customer_email: user.email!, success_url: origin + '/espace-client?paiement=ok', cancel_url: origin + '/espace-client?paiement=annule' };
  if (kind === 'maintenance') {
    const amount = plan === 49 ? 4900 : 2500;
    const s = await stripe.checkout.sessions.create({ ...common, mode: 'subscription',
      line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: amount, recurring: { interval: 'month' }, product_data: { name: 'WEBIKA — Maintenance ' + amount / 100 + ' € / mois' } } }],
      metadata: { user_id: user.id, project_id: projectId || '', label: 'Maintenance ' + amount / 100 + ' € / mois (1er mois)' } });
    return NextResponse.json({ url: s.url });
  }
  const { data: project } = await sb.from('projects').select('id, pack').eq('id', projectId).single(); // la sécurité RLS garantit que le projet appartient au client
  if (!project) return NextResponse.json({ error: 'Projet introuvable.' }, { status: 404 });
  const pk = (PACKS as any)[project.pack];
  const label = (kind === 'solde' ? 'Solde' : 'Acompte') + ' — Pack ' + pk.n;
  const s = await stripe.checkout.sessions.create({ ...common, mode: 'payment',
    line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: Math.round(pk.p * 50), product_data: { name: 'WEBIKA — ' + label } } }],
    metadata: { user_id: user.id, project_id: project.id, label } });
  return NextResponse.json({ url: s.url });
}
