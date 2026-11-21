'use client';
import { useEffect, useState } from 'react';

export default function Typewriter({ text, speed = 42 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      setShown(text.slice(0, i));
      i++;
      if (i <= text.length) t = setTimeout(step, speed);
    };
    step();
    return () => clearTimeout(t);
  }, [text, speed]);
  return (<h1 className="hero-type"><span>{shown}</span><span className="caret" aria-hidden="true">&nbsp;</span></h1>);
}
