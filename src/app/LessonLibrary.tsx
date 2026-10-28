import { ArrowUpRight, ArrowLeftRight, BookOpen, ChartNoAxesCombined, Gauge, Grid2X2, Layers2, ReceiptText, Route, Wallet } from 'lucide-react';
import { lessons, routeHref } from './lessons';
const icons = { wallet: Wallet, arrows: ArrowLeftRight, grid: Grid2X2, layers: Layers2, receipt: ReceiptText, route: Route, chart: ChartNoAxesCombined, gauge: Gauge, book: BookOpen };
export default function LessonLibrary() {
  return <div className="app-page library-page">
    <header className="page-heading"><h1>A clearer way to learn.</h1><p>One idea at a time. Try it with your own numbers.</p></header>
    <div className="library-heading"><h2>All lessons</h2><span>9 interactive tools</span></div>
    <div className="lesson-list">{lessons.map(({ id, title, description, group, icon }, index) => {
      const Icon = icons[icon];
      return <a href={routeHref(id)} className="lesson-link" key={id}><div className="lesson-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></div><div><span className="lesson-group">{group} <span>· {String(index + 1).padStart(2, '0')}</span></span><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>;
    })}</div>
  </div>;
}
