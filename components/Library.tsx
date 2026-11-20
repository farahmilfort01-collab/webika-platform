'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { T, CATS, STYLES } from '@/lib/core';
import Preview from './Preview';
import Icon from './Icon';
export function Card({ t, fav, onFav }: { t: any; fav?: boolean; onFav?: (id: string) => void }) {
  return (
    <article className="tc">
      <Link className="thumb" href={'/modeles/' + t.id} aria-label={'Ouvrir la démonstration ' + t.name}><Preview id={t.id} thumb height={220} /></Link>
      <div className="m">
        <div className="top"><div><h3>{t.name}</h3><span className="mt">{t.metier}</span></div>
          {onFav && <button type="button" className="fav" aria-pressed={!!fav} aria-label={'Ajouter ' + t.name + ' aux favoris'} onClick={() => onFav(t.id)}><Icon k="heart" c="#0F2A1D" s={20} /></button>}</div>
        <div className="tags"><span className="st">{(STYLES as any)[t.style]}</span>{t.features.map((f: string) => <span key={f}>{f}</span>)}</div>
        <div className="bt"><Link className="btn b-line sm" href={'/modeles/' + t.id}>Démonstration</Link><Link className="btn b-blue sm" href={'/creer?modele=' + t.id}>Utiliser ce modèle</Link></div>
      </div>
    </article>
  );
}
export default function Library({ initialCat = 'all' }: { initialCat?: string }) {
  const [cat, setCat] = useState(initialCat), [style, setStyle] = useState(''), [q, setQ] = useState(''), [favOnly, setFavOnly] = useState(false), [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { try { setFavs(JSON.parse(localStorage.getItem('wbk-fav') || '[]')); } catch {} }, []);
  const toggle = (id: string) => setFavs((f) => { const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]; try { localStorage.setItem('wbk-fav', JSON.stringify(n)); } catch {} return n; });
  const catName = (k: string) => (CATS.find((c: any) => c[0] === k) || [])[1] || '';
  const list = useMemo(() => { const s = q.trim().toLowerCase(); return T.filter((t: any) => (cat === 'all' || t.cat === cat) && (!style || t.style === style) && (!favOnly || favs.includes(t.id)) && (!s || (t.name + ' ' + t.metier + ' ' + catName(t.cat) + ' ' + (STYLES as any)[t.style] + ' ' + t.features.join(' ')).toLowerCase().includes(s))); }, [cat, style, q, favOnly, favs]);
  return (<>
    <div className="tools">
      <label className="sr" htmlFor="q">Rechercher un modèle</label><input type="search" id="q" placeholder="Rechercher : restaurant, luxe, boutique…" value={q} onChange={(e) => setQ(e.target.value)} />
      <label className="sr" htmlFor="fs">Style</label><select id="fs" value={style} onChange={(e) => setStyle(e.target.value)}><option value="">Tous les styles</option>{Object.entries(STYLES).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}</select>
      <button type="button" className="chipb" aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)}>Mes favoris</button>
    </div>
    <div className="chips" role="group" aria-label="Filtrer par activité">{[['all', 'Tous'], ...CATS].map(([k, l]: any) => <button key={k} type="button" className="chipb" aria-pressed={k === cat} onClick={() => setCat(k)}>{l}</button>)}</div>
    <p className="count" aria-live="polite">{list.length} {list.length > 1 ? 'modèles' : 'modèle'}</p>
    <div className="g3">{list.length ? list.map((t: any) => <Card key={t.id} t={t} fav={favs.includes(t.id)} onFav={toggle} />) : <div className="empty" style={{ gridColumn: '1/-1' }}>Aucun modèle ne correspond. Essayez un autre mot ou retirez un filtre.</div>}</div>
  </>);
}
