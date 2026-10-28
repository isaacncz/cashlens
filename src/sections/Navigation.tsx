import { routeHref } from '../app/lessons';
import { BookOpen, House, Settings2, Sprout } from 'lucide-react';
import type { Destination } from '../app/lessons';
import './Navigation.css';
const resetScroll = (hash: string) => {
  if (window.location.hash === hash) {
    const main = document.getElementById('main-content');
    main?.scrollTo({ top: 0, behavior: 'instant' });
    main?.focus({ preventScroll: true });
  }
};

const destinations = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'compounding', label: 'Compound', icon: Sprout },
  { id: 'settings', label: 'Settings', icon: Settings2 },
] as const;
export default function Navigation({ active }: { active: Destination }) {
  return <>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="site-header">
      <a className="site-brand" href={routeHref('home')} onClick={() => resetScroll('#home')} aria-label="CashflowLens.MY home"><span className="brand-mark" aria-hidden="true"><Sprout size={22} strokeWidth={1.8} /></span><span>CashflowLens<span className="brand-domain">.MY</span></span></a>
      <span className="header-note">A little clarity, every day.</span>
      <span className="header-currency">MYR <span>·</span> <span className="currency-country">Malaysia</span></span>
    </header>
    <nav className="app-navigation" aria-label="Main navigation">
      <div className="nav-heading">Your space</div>
      {destinations.map(({ id, label, icon: Icon }) => <a key={id} href={routeHref(id)} onClick={() => resetScroll(`#${id}`)} aria-current={active === id ? 'page' : undefined}><Icon aria-hidden="true" size={22} strokeWidth={1.8} /><span>{label}</span></a>)}
      <div className="nav-footer"><span className="privacy-dot" />Private by design<p>Your numbers stay in this session.</p></div>
    </nav>
  </>;
}
