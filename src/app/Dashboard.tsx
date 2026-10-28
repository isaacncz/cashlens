import { learningPaths, routeHref } from './lessons';
import { ArrowRight, CircleCheck, Gauge, Sprout, Wallet } from 'lucide-react';

export default function Dashboard() {
  return <div className="app-page dashboard">
    <header className="page-heading">
      <h1>A little clarity.<br />A little more freedom.</h1>
      <p>Make your next money decision a little easier.</p>
    </header>
    <section className="dashboard-start" aria-labelledby="dashboard-start-title">
      <div className="start-copy">
        <div className="start-label"><Wallet size={22} strokeWidth={1.6} aria-hidden="true" /><span>Start here · Money Mirror</span></div>
        <h2 id="dashboard-start-title">What does an hour<br />really earn you?</h2>
        <p>See your real hourly pay, after deductions and work costs.</p>
      </div>
      <a href={routeHref('money-mirror')} className="primary-button dashboard-primary">Check my cashflow <ArrowRight size={20} aria-hidden="true" /></a>
    </section>
    <div className="section-heading"><h2>Try another tool</h2><span>Make it practical</span></div>
    <div className="dashboard-tools">
      <a href={routeHref('compounding')} className="tool-card"><span className="tool-icon"><Sprout size={24} strokeWidth={1.7} aria-hidden="true" /></span><div><h3>Explore repeat sales</h3><p>Start with one product and one customer.</p></div><ArrowRight size={20} aria-hidden="true" /></a>
      <a href={routeHref('wealth-thermometer')} className="tool-card"><span className="tool-icon"><Gauge size={24} strokeWidth={1.7} aria-hidden="true" /></span><div><h3>Find your breathing room</h3><p>How long could your money support you?</p></div><ArrowRight size={20} aria-hidden="true" /></a>
    </div>
    <section className="dashboard-guide" aria-labelledby="dashboard-guide-title">
      <div className="section-heading"><h2 id="dashboard-guide-title">A little learning goes a long way.</h2><a href={routeHref('learn')}>All lessons <ArrowRight size={18} aria-hidden="true" /></a></div>
      <p>Three paths. Nine hands-on lessons. Start where you are.</p>
      <ol className="dashboard-paths">{learningPaths.map((path, index) => <li key={path.id}>
        <a href={routeHref(path.lessonIds[0])}><span className="path-number" aria-hidden="true">0{index + 1}</span><span className="path-copy"><strong>{path.title}</strong><small>3 hands-on lessons</small></span><ArrowRight size={18} aria-hidden="true" /></a>
      </li>)}</ol>
    </section>
    <p className="local-note"><CircleCheck size={16} aria-hidden="true" />Malaysia-first. No account needed.</p>
  </div>;
}
