import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navigation from './sections/Navigation';
import { applyPreferences, readPreferences, savePreferences } from './app/preferences';
import type { Preferences } from './app/preferences';
import { isLesson, lessons, learningOrder, pathForLesson, routeFromHash, routeHref } from './app/lessons';
import type { Destination, LessonId, Route } from './app/lessons';
import './styles/app.css';
import './styles/mobile.css';
import './styles/lesson.css';

const Dashboard = lazy(() => import('./app/Dashboard'));
const LessonLibrary = lazy(() => import('./app/LessonLibrary'));
const Settings = lazy(() => import('./app/Settings'));
const screens = {
  'money-mirror': lazy(() => import('./sections/MoneyMirror')),
  'asset-liability': lazy(() => import('./sections/AssetLiability')),
  'cashflow-quadrant': lazy(() => import('./sections/CashflowQuadrant')),
  'income-engine': lazy(() => import('./sections/IncomeEngine')),
  'rat-race': lazy(() => import('./sections/RatRace')),
  'debt': lazy(() => import('./sections/DebtVisualizer')),
  'salary-wealth': lazy(() => import('./sections/SalaryWealth')),
  'wealth-thermometer': lazy(() => import('./sections/WealthThermometer')),
  'literacy-playbook': lazy(() => import('./sections/LiteracyPlaybook')),
  compounding: lazy(() => import('./sections/RepeatSales')),
};
class ScreenBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="screen-error" role="alert"><h2>This tool couldn’t load.</h2><p>Check your connection and try again.</p><button className="primary-button" onClick={() => window.location.reload()}>Reload this tool</button></div> : this.props.children;
  }
}
export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [visited, setVisited] = useState<Route[]>(() => [routeFromHash()]);
  const [lastLesson, setLastLesson] = useState<LessonId | null>(() => { const initial = routeFromHash(); return isLesson(initial) ? initial : null; });
  const [preferences, setPreferences] = useState(readPreferences);
  const mainRef = useRef<HTMLElement>(null);
  const destination: Destination = isLesson(route) ? 'learn' : route;
  // Opened lessons count as visited for this session only, like calculator inputs.
  const visitedLessons = visited.filter(isLesson);
  useEffect(() => {
    const navigate = () => {
      const next = routeFromHash();
      setRoute(next);
      if (isLesson(next)) setLastLesson(next);
      setVisited(previous => previous.includes(next) ? previous : [...previous, next]);
      requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
        mainRef.current?.focus({ preventScroll: true });
      });
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    applyPreferences(preferences);
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => applyPreferences(preferences);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [preferences]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const syncSvgMotion = () => {
      const reduce = preferences.reduceMotion || media.matches;
      mainRef.current?.querySelectorAll('svg').forEach(svg => {
        if (reduce) svg.pauseAnimations();
        else svg.unpauseAnimations();
      });
    };
    syncSvgMotion();
    const observer = new MutationObserver(syncSvgMotion);
    if (mainRef.current) observer.observe(mainRef.current, { childList: true, subtree: true });
    media.addEventListener('change', syncSvgMotion);
    return () => { observer.disconnect(); media.removeEventListener('change', syncSvgMotion); };
  }, [preferences.reduceMotion]);
  const changePreferences = (value: Preferences) => { savePreferences(value); setPreferences(value); };
  return <div className="app-shell" data-focus-mode={isLesson(route) || route === 'compounding'}>
    <Navigation active={destination} route={route} visitedLessons={visitedLessons} />
    <main id="main-content" data-route={route} ref={mainRef} tabIndex={-1}>
      {visited.includes('home') && <div hidden={route !== 'home'}><ScreenBoundary><Suspense fallback={<div className="screen-loading" role="status">Opening home…</div>}><Dashboard lastLesson={lastLesson} visitedLessons={visitedLessons} /></Suspense></ScreenBoundary></div>}
      {visited.includes('learn') && <div hidden={route !== 'learn'}><ScreenBoundary><Suspense fallback={<div className="screen-loading" role="status">Opening lessons…</div>}><LessonLibrary lastLesson={lastLesson} visitedLessons={visitedLessons} /></Suspense></ScreenBoundary></div>}
      {visited.includes('settings') && <div hidden={route !== 'settings'}><ScreenBoundary><Suspense fallback={<div className="screen-loading" role="status">Opening settings…</div>}><Settings value={preferences} onChange={changePreferences} /></Suspense></ScreenBoundary></div>}
      {visited.map(key => {
        if (!(key in screens)) return null;
        const Screen = screens[key as keyof typeof screens];
        const index = lessons.findIndex(lesson => lesson.id === key);
        const lesson = lessons[index];
        const path = lesson ? pathForLesson(lesson.id) : null;
        const position = lesson ? learningOrder.indexOf(lesson.id) : -1;
        const nextId = learningOrder[position + 1];
        const next = lessons.find(item => item.id === nextId);
        return <div key={key} hidden={route !== key} className={lesson ? 'lesson-screen' : 'compound-screen'}>
          {lesson && <header className="lesson-top"><a href={routeHref('learn')}><ArrowLeft size={18} aria-hidden="true" />All lessons</a><span>{position + 1} of 9</span></header>}
          <ScreenBoundary><Suspense fallback={<div className="screen-loading" role="status"><div className="loading-line" /><p>Opening your tool…</p></div>}><Screen /></Suspense></ScreenBoundary>
          {path && <nav className="lesson-path-nav" aria-label={`${path.title} lessons`}><span>{path.title}</span><ol>{path.lessonIds.map((id, step) => <li key={id}><a href={routeHref(id)} aria-current={id === key ? 'step' : undefined}><span>{step + 1}</span>{' '}{lessons.find(item => item.id === id)!.title}</a></li>)}</ol></nav>}
          {/* On phones this dock stays at the bottom of the lesson; a lesson can portal a live result into its slot. */}
          {lesson && <div className="lesson-dock">
            <div className="lesson-dock-slot" id={`lesson-dock-${key}`} />
            <nav className="lesson-pagination" aria-label="Lesson navigation"><a href={routeHref('learn')}>All lessons</a>{next ? <a href={routeHref(next.id)} aria-label={`Next lesson: ${next.title}`}><span>Next<span className="lesson-next-title">: {next.title}</span></span><ArrowRight size={18} aria-hidden="true" /></a> : <a href={routeHref('learn')}>Choose another path<ArrowRight size={18} aria-hidden="true" /></a>}</nav>
          </div>}
        </div>;
      })}
    </main>
  </div>;
}
