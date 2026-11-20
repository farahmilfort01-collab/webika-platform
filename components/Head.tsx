export default function Head({ eye, title, sub }: { eye: string; title: string; sub?: string }) {
  return <div className="head"><span className="eye">{eye}</span><h1 style={{ fontSize: 'clamp(32px,4.6vw,54px)' }}>{title}</h1>{sub && <p>{sub}</p>}</div>;
}
