import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
// Stripe appelle cette adresse après un paiement : on l'enregistre dans l'historique du client.
export async function POST(req: NextRequest) {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_SERVICE_ROLE_KEY || !NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: 'non configuré' }, { status: 503 });
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') || '', STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: 'signature invalide' }, { status: 400 }); }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const admin = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await admin.from('payments').upsert({ stripe_session_id: s.id, user_id: s.metadata?.user_id || null, project_id: s.metadata?.project_id || null,
      label: s.metadata?.label || 'Paiement', amount_cents: s.amount_total || 0, status: 'paye' }, { onConflict: 'stripe_session_id' });
  }
  return NextResponse.json({ received: true });
}
