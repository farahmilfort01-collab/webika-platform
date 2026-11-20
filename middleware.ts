import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
// Rafraîchit la session et protège l'espace client et l'administration.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;
  const sb = createServerClient(url, key, { cookies: {
    getAll: () => req.cookies.getAll(),
    setAll: (list) => { res = NextResponse.next({ request: req }); list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
  } });
  const { data: { user } } = await sb.auth.getUser();
  const p = req.nextUrl.pathname;
  if (!user && (p.startsWith('/espace-client') || p.startsWith('/admin'))) {
    const to = req.nextUrl.clone(); to.pathname = '/connexion'; to.search = '?next=' + encodeURIComponent(p);
    return NextResponse.redirect(to);
  }
  return res;
}
export const config = { matcher: ['/espace-client/:path*', '/admin/:path*', '/creer', '/connexion', '/inscription'] };
