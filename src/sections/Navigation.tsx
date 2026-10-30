import { isLesson, lessons, routeHref } from '../app/lessons';
import { ArrowLeft, BookOpen, House, Settings2, Sprout } from 'lucide-react';
import type { Destination, Route } from '../app/lessons';
import { useLayoutEffect, useRef, useState } from 'react';
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
export default function Navigation({ active, route }: { active: Destination; route: Route }) {
  const inLesson = isLesson(route);
  const focused = inLesson || route === 'compounding';
  const title = inLesson ? lessons.find(lesson => lesson.id === route)!.title : 'Repeat sales';
  const navigationRef = useRef<HTMLElement>(null);
  const [wideLabels, setWideLabels] = useState(false);
  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;
    const labels = [...navigation.querySelectorAll<HTMLSpanElement>('a > span')];
    const measure = () => {
      if (!navigation.getClientRects().length) return;
      const style = getComputedStyle(navigation);
      const available = (navigation.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 3 * (parseFloat(style.columnGap) || 0)) / 4;
      setWideLabels(labels.some(label => label.scrollWidth + 4 > available));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(navigation);
    labels.forEach(label => observer.observe(label));
    measure();
    return () => observer.disconnect();
  }, []);
  return <>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="site-header">
      {focused && <div className="workspace-header"><a href={routeHref(inLesson ? 'learn' : 'home')} aria-label={inLesson ? 'Back to lessons' : 'Back to home'}><ArrowLeft size={22} aria-hidden="true" /></a><span>{title}</span></div>}
      <a className="site-brand" href={routeHref('home')} onClick={() => resetScroll('#home')} aria-label="CashflowLens.MY home"><span className="brand-mark" aria-hidden="true"><Sprout size={22} strokeWidth={1.8} /></span><span>CashflowLens<span className="brand-domain">.MY</span></span></a>
      <span className="header-note">A little clarity, every day.</span>
      <span className="header-currency">MYR <span>·</span> <span className="currency-country">Malaysia</span></span>
    </header>
    <nav ref={navigationRef} className="app-navigation" aria-label="Main navigation" data-wide-labels={wideLabels}>
      <div className="nav-heading">Your space</div>
      {destinations.map(({ id, label, icon: Icon }) => <a key={id} href={routeHref(id)} onClick={() => resetScroll(`#${id}`)} aria-current={active === id ? 'page' : undefined}><Icon aria-hidden="true" size={22} strokeWidth={1.8} /><span>{label}</span></a>)}
      <div className="nav-footer"><span className="privacy-dot" />Private by design<p>Your numbers stay in this session.</p></div>
    </nav>
  </>;
}
