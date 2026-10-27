import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import type { AppTab } from './sections/Navigation';
import Hero from './sections/Hero';
import MoneyMirror from './sections/MoneyMirror';
import AssetLiability from './sections/AssetLiability';
import CashflowQuadrant from './sections/CashflowQuadrant';
import IncomeEngine from './sections/IncomeEngine';
import RepeatSales from './sections/RepeatSales';
import RatRace from './sections/RatRace';
import DebtVisualizer from './sections/DebtVisualizer';
import SalaryWealth from './sections/SalaryWealth';
import WealthThermometer from './sections/WealthThermometer';
import LiteracyPlaybook from './sections/LiteracyPlaybook';
import Footer from './sections/Footer';

const tabFromHash = (): AppTab => ['#compounding', '#repeat-sales'].includes(window.location.hash) ? 'compounding' : 'learn';

export default function App() {
  const lenis = useLenis();
  const [activeTab, setActiveTab] = useState<AppTab>(tabFromHash);

  useEffect(() => {
    const followHash = () => {
      setActiveTab(tabFromHash());
      requestAnimationFrame(() => {
        const hash = window.location.hash.slice(1);
        const target = !['learn', 'compounding', 'repeat-sales'].includes(hash) ? document.getElementById(hash) : null;
        const offset = window.innerWidth <= 760 ? 120 : 88;
        const top = target ? target.getBoundingClientRect().top + window.scrollY - offset : 0;
        window.scrollTo({ top, behavior: 'instant' });
        lenis.current?.scrollTo(top, { immediate: true, force: true });
      });
    };
    window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, [lenis]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      lenis.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [activeTab, lenis]);

  const changeTab = (tab: AppTab) => {
    if (window.location.hash === `#${tab}`) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      lenis.current?.scrollTo(0, { immediate: true, force: true });
    } else window.location.hash = tab;
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0A192F' }}>
      <Navigation activeTab={activeTab} onTabChange={changeTab} />
      <main id="panel-learn" role="tabpanel" aria-labelledby="tab-learn" hidden={activeTab !== 'learn'} tabIndex={-1}>
        <Hero />
        <MoneyMirror />
        <AssetLiability />
        <CashflowQuadrant />
        <IncomeEngine />
        <RatRace />
        <DebtVisualizer />
        <SalaryWealth />
        <WealthThermometer />
        <LiteracyPlaybook />
        <Footer />
      </main>
      <main id="panel-compounding" role="tabpanel" aria-labelledby="tab-compounding" hidden={activeTab !== 'compounding'} tabIndex={-1}>
        <RepeatSales />
      </main>
    </div>
  );
}
