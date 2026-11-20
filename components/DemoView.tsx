'use client';
import { useState } from 'react';
import Preview from './Preview';
export default function DemoView({ id }: { id: string }) {
  const [mob, setMob] = useState(false);
  return (<div className="pvframe"><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
    <div className="seg" role="group" aria-label="Taille d'écran"><button type="button" aria-pressed={!mob} onClick={() => setMob(false)}>Ordinateur</button><button type="button" aria-pressed={mob} onClick={() => setMob(true)}>Téléphone</button></div></div>
    <Preview id={id} mobile={mob} /></div>);
}
