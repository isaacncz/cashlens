import { routeHref } from './lessons';
import { ArrowRight, ArrowUpRight, CircleCheck, Coins, Gauge, Sprout, Wallet } from 'lucide-react';
export default function Dashboard() {
  return <div className="app-page dashboard">
    <header className="page-heading"><h1>Make sense of<br /><span>your next ringgit.</span></h1><p>Small decisions. A clearer financial future.</p></header>
    <section className="dashboard-start" aria-labelledby="dashboard-start-title">
      <div className="start-copy"><Wallet size={24} strokeWidth={1.6} aria-hidden="true" /><h2 id="dashboard-start-title">What does an hour<br />really earn you?</h2><p>Look beyond your salary. See what’s left after time, deductions, and work costs.</p><a className="start-link" href={routeHref('money-mirror')}>Open Money Mirror <ArrowUpRight size={20} aria-hidden="true" /></a></div>
      <div className="cashflow-example" aria-label="What Money Mirror helps you understand"><span>Illustrative salary breakdown</span><div className="example-track" aria-hidden="true"><i /><i /><i /></div><div className="example-key"><span><i />Deductions</span><span><i />Work costs</span><span><i />What you keep</span></div><p>Follow where your money goes.</p></div>
    </section>
    <div className="section-heading"><h2>Explore what’s possible</h2><a href={routeHref('learn')}>All lessons <ArrowRight size={18} aria-hidden="true" /></a></div>
    <div className="dashboard-tools">
      <a href={routeHref('compounding')} className="tool-card"><Sprout size={24} strokeWidth={1.7} aria-hidden="true" /><div><h3>Small basket. Long view.</h3><p>Tick everyday products. Explore 50 years of repeat sales.</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>
      <a href={routeHref('wealth-thermometer')} className="tool-card"><Gauge size={24} strokeWidth={1.7} aria-hidden="true" /><div><h3>How long could it last?</h3><p>Find your financial breathing room.</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>
    </div>
    <section className="dashboard-principle"><Coins size={22} strokeWidth={1.6} aria-hidden="true" /><div><h2>Earn. Keep. Build.</h2><p>Wealth starts with understanding the difference.</p></div></section>
    <p className="local-note"><CircleCheck size={16} aria-hidden="true" />Malaysia-first. No account needed.</p>
    <div className="thumb-action"><a href={routeHref('money-mirror')} className="primary-button">Check my cashflow <ArrowRight size={20} aria-hidden="true" /></a></div>
  </div>;
}
