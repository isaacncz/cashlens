import { isLesson, lessons, pathForLesson, routeHref } from '../app/lessons';
import { ArrowLeft, BookOpen, Check, House, Settings2, Sprout, X } from 'lucide-react';
import type { Destination, LessonId, Route } from '../app/lessons';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
export default function Navigation({ active, route, visitedLessons }: { active: Destination; route: Route; visitedLessons: LessonId[] }) {
  const inLesson = isLesson(route);
  const focused = inLesson || route === 'compounding';
  const title = inLesson ? lessons.find(lesson => lesson.id === route)!.title : 'Repeat sales';
  const path = inLesson ? pathForLesson(route) : null;
  const step = path ? path.lessonIds.findIndex(id => id === route) + 1 : 0;
  const navigationRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (sheetRef.current?.open) sheetRef.current.close(); }, [route]);
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
      {focused && <div className="workspace-header"><a href={routeHref(inLesson ? 'learn' : 'home')} aria-label={inLesson ? 'Back to lessons' : 'Back to home'}><ArrowLeft size={22} aria-hidden="true" /></a><span>{title}</span>
        {path && <button type="button" className="workspace-progress" aria-haspopup="dialog" aria-label={`${path.title}, lesson ${step} of 3. Show path`} onClick={() => sheetRef.current?.showModal()}><span>{step} of 3</span><span className="progress-segments" aria-hidden="true">{path.lessonIds.map((id, index) => <span key={id} data-filled={index < step} />)}</span></button>}
      </div>}
      <a className="site-brand" href={routeHref('home')} onClick={() => resetScroll('#home')} aria-label="CashflowLens.MY home"><span className="brand-mark" aria-hidden="true"><Sprout size={22} strokeWidth={1.8} /></span><span>CashflowLens<span className="brand-domain">.MY</span></span></a>
      <span className="header-note">A little clarity, every day.</span>
      <span className="header-currency">MYR <span>·</span> <span className="currency-country">Malaysia</span></span>
    </header>
    <nav ref={navigationRef} className="app-navigation" aria-label="Main navigation" data-wide-labels={wideLabels}>
      <div className="nav-heading">Your space</div>
      {destinations.map(({ id, label, icon: Icon }) => <a key={id} href={routeHref(id)} onClick={() => resetScroll(`#${id}`)} aria-current={active === id ? 'page' : undefined}><Icon aria-hidden="true" size={22} strokeWidth={1.8} /><span>{label}</span></a>)}
      <div className="nav-footer"><span className="privacy-dot" />Private by design<p>Your numbers stay in this session.</p></div>
    </nav>
    {path && <dialog ref={sheetRef} className="path-sheet" aria-labelledby="path-sheet-title" onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      <div className="path-sheet-header"><h2 id="path-sheet-title">{path.title}</h2><button type="button" aria-label="Close path" onClick={() => sheetRef.current?.close()}><X size={22} aria-hidden="true" /></button></div>
      <nav aria-label={`${path.title} lessons`}><ol>{path.lessonIds.map((id, index) => {
        const visitedLesson = visitedLessons.includes(id) && id !== route;
        return <li key={id}><a href={routeHref(id)} aria-current={id === route ? 'step' : undefined} onClick={() => sheetRef.current?.close()}><span className="lesson-marker" data-visited={visitedLesson}>{visitedLesson ? <><Check size={16} strokeWidth={2.5} aria-hidden="true" /><span className="sr-only">Visited:</span></> : index + 1}</span>{' '}{lessons.find(lesson => lesson.id === id)!.title}</a></li>;
      })}</ol></nav>
      <a className="path-sheet-all" href={routeHref('learn')} onClick={() => sheetRef.current?.close()}>All lessons</a>
    </dialog>}
  </>;
}
