'use client';
import { useEffect, useRef, useState } from 'react';
import { T, renderSite } from '@/lib/core';
// Affiche un modèle, réduit à la largeur disponible.
export default function Preview({ id, mobile = false, thumb = false, o = null, height }: { id: string; mobile?: boolean; thumb?: boolean; o?: any; height?: number | string }) {
  const box = useRef<HTMLDivElement>(null); const [z, setZ] = useState(0.3); const base = mobile ? 390 : 1200;
  useEffect(() => { const el = box.current; if (!el) return; const f = () => setZ(Math.min(1, el.clientWidth / base)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, [base]);
  const t = T.find((x: any) => x.id === id); if (!t) return null;
  return (
    <div ref={box} style={{ height, overflow: thumb ? 'hidden' : 'auto', background: '#fff', borderRadius: thumb ? 0 : 12 }}>
      <div style={{ width: base, zoom: z, margin: mobile ? '0 auto' : undefined, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: renderSite(t, mobile, o, thumb) }} />
    </div>
  );
}
