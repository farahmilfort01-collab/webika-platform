import { ICON } from '@/lib/core';
export default function Icon({ k, c = '#0B6B3A', s = 24 }: { k: string; c?: string; s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: (ICON as any)[k] }} />;
}
