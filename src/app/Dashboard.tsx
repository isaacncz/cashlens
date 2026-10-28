import { routeHref } from './lessons';
import { ArrowRight, BookOpen, Gauge, Sprout } from 'lucide-react';

export default function Dashboard() {
  return <div className="app-page dashboard">
    <header className="page-heading">
      <h1>Make sense of your money.</h1>
      <p>Choose a question. Try a tool.</p>
    </header>
    <section className="dashboard-start" aria-labelledby="dashboard-start-title">
      <div className="start-copy">
        <h2 id="dashboard-start-title">What do I really earn?</h2>
        <p>Find your hourly pay after work costs.</p>
      </div>
      <a href={routeHref('money-mirror')} className="primary-button dashboard-primary">Check my cashflow <ArrowRight size={20} aria-hidden="true" /></a>
    </section>
    <div className="dashboard-tools" aria-label="More tools">
      <a href={routeHref('wealth-thermometer')} className="tool-card"><Gauge size={22} aria-hidden="true" /><div><h2>How long would my savings last?</h2><p>Find your financial breathing room.</p></div><ArrowRight size={18} aria-hidden="true" /></a>
      <a href={routeHref('compounding')} className="tool-card"><Sprout size={22} aria-hidden="true" /><div><h2>What could repeat sales build?</h2><p>Start with one product and one customer.</p></div><ArrowRight size={18} aria-hidden="true" /></a>
    </div>
    <a className="dashboard-browse" href={routeHref('learn')}><BookOpen size={22} aria-hidden="true" /><span>Browse all 9 lessons</span><ArrowRight size={18} aria-hidden="true" /></a>
    <p className="local-note">No account needed. Your numbers stay in this session.</p>
  </div>;
}
