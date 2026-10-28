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
        <Wallet size={24} strokeWidth={1.6} aria-hidden="true" />
        <h2 id="dashboard-start-title">What does an hour<br />really earn you?</h2>
        <p>Look beyond your salary. See what’s left after time, deductions, and work costs.</p>
      </div>
      <a href={routeHref('money-mirror')} className="primary-button dashboard-primary">Check my cashflow <ArrowRight size={20} aria-hidden="true" /></a>
    </section>
    <div className="section-heading"><h2>Choose your next move</h2><a href={routeHref('learn')}>All lessons <ArrowRight size={18} aria-hidden="true" /></a></div>
    <div className="dashboard-tools">
      <a href={routeHref('compounding')} className="tool-card"><Sprout size={24} strokeWidth={1.7} aria-hidden="true" /><div><h3>Explore repeat sales</h3><p>One product. One customer. See what happens next.</p><span className="tool-name">Compound</span></div><ArrowRight size={20} aria-hidden="true" /></a>
      <a href={routeHref('wealth-thermometer')} className="tool-card"><Gauge size={24} strokeWidth={1.7} aria-hidden="true" /><div><h3>Find your breathing room</h3><p>See how long your money could support you.</p><span className="tool-name">Wealth Thermometer</span></div><ArrowRight size={20} aria-hidden="true" /></a>
    </div>
    <section className="dashboard-guide" aria-labelledby="dashboard-guide-title">
      <h2 id="dashboard-guide-title">Start where you are.</h2>
      <p>Understand your money, build breathing room, then put it into practice.</p>
      <a href={routeHref('learn')}>Find your path <ArrowRight size={18} aria-hidden="true" /></a>
    </section>
    <div className="section-heading"><h2>Learn by doing</h2><span>9 hands-on lessons</span></div>
    <ol className="dashboard-paths">{learningPaths.map((path, index) => <li key={path.id}>
      <a href={routeHref(path.lessonIds[0])}><span aria-hidden="true">{index + 1}</span>{path.title}<ArrowRight size={18} aria-hidden="true" /></a>
    </li>)}</ol>
    <p className="local-note"><CircleCheck size={16} aria-hidden="true" />Malaysia-first. No account needed.</p>
  </div>;
}
