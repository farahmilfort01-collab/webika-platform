'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { NEEDS, SVC, PACKS } from '@/lib/core';
import Icon from './Icon';
import { svcHref } from '@/lib/labels';
export default function Needs() {
  const [sel, setSel] = useState(-1); const panel = useRef<HTMLDivElement>(null);
  const n: any = sel >= 0 ? NEEDS[sel] : null, s: any = n ? (SVC as any)[n[2]] : null, pk: any = s ? (PACKS as any)[s.pack] : null;
  return (<>
    <div className="g4">{NEEDS.map((x: any, i: number) => (
      <div key={i} className={'need' + (i === sel ? ' on' : '')}><div className="ic"><Icon k={x[3]} c="#F28C28" /></div><h3>{x[0]}</h3><p>{x[1]}</p>
        <button type="button" className="btn b-coral sm" aria-pressed={i === sel} onClick={() => { setSel(i); setTimeout(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); }}>Trouver ma solution</button></div>))}</div>
    <div className="fpanel" ref={panel} aria-live="polite" style={{ marginTop: 22 }}>
      {!s ? <><h3>Votre solution s'affiche ici.</h3><p>Choisissez la situation qui ressemble à la vôtre parmi les huit ci-dessus.</p></> : <>
        <span className="tag">Votre solution</span><h3>{s.t}</h3><p>Ce que nous mettons en place pour vous :</p>
        <ul>{s.b.slice(0, 5).map((b: string) => <li key={b}>{b}</li>)}</ul><p><b>Pack conseillé : {pk.n}, {pk.p} €.</b></p>
        <div className="row"><Link className="btn b-coral sm" href={svcHref(n[2])}>{s.cta}</Link><Link className="btn b-white sm" href={'/devis?pack=' + s.pack + '&besoin=' + n[2]}>Demander un devis</Link><Link className="btn b-white sm" href={'/services#svc-' + n[2]}>Voir le service</Link></div></>}
    </div>
  </>);
}
