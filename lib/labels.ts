import { SVC } from './core';
export const STATUS: Record<string, string> = { demande: 'Demande reçue', en_cours: 'En cours de création', en_revision: 'En attente de vos retours', livre: 'Livré' };
export const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR');
export const fmtEur = (c: number) => (c / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
export const svcHref = (k: string) => { const s = (SVC as any)[k]; return s.act === 'modeles' ? '/modeles' : s.act === 'tarifs' ? '/tarifs' : s.act.startsWith('cat:') ? '/modeles?cat=' + s.act.slice(4) : '/devis?pack=' + s.pack + '&besoin=' + k; };
