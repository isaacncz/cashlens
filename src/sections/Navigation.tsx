import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './Navigation.css';

export type AppTab = 'learn' | 'compounding';
const navLinks = [
  { label: 'Money Mirror', target: 'money-mirror' },
  { label: 'Assets & liabilities', target: 'asset-liability' },
  { label: 'Cashflow Quadrant', target: 'cashflow-quadrant' },
  { label: 'Income Engine', target: 'income-engine' },
  { label: 'Rat Race', target: 'rat-race' },
  { label: 'Debt', target: 'debt' },
  { label: 'Salary & wealth', target: 'salary-wealth' },
  { label: 'Wealth Thermometer', target: 'wealth-thermometer' },
  { label: 'Financial Playbook', target: 'literacy-playbook' },
];

export default function Navigation({ activeTab, onTabChange }: { activeTab: AppTab; onTabChange: (tab: AppTab) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('money-mirror');
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTab !== 'learn') return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });
    navLinks.forEach(link => { const target = document.getElementById(link.target); if (target) observer.observe(target); });
    return () => observer.disconnect();
  }, [activeTab]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); };
  }, [menuOpen]);

  const selectTab = (tab: AppTab) => { setMenuOpen(false); onTabChange(tab); };
  const activeIndex = Math.max(0, navLinks.findIndex(link => link.target === activeSection));
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="site-brand" onClick={() => selectTab('learn')} aria-label="Cashflow Lens home">Cashflow Lens<span>Malaysia</span></button>
        <div className="site-tabs" role="tablist" aria-label="Cashlens pages" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next: AppTab = event.key === 'Home' ? 'learn' : event.key === 'End' ? 'compounding' : activeTab === 'learn' ? 'compounding' : 'learn';
          selectTab(next); document.getElementById(`tab-${next}`)?.focus();
        }}>
          {(['learn', 'compounding'] as const).map(tab => <button key={tab} id={`tab-${tab}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`panel-${tab}`} tabIndex={activeTab === tab ? 0 : -1} onClick={() => selectTab(tab)}>{tab === 'learn' ? 'Learn' : 'Compounding'}</button>)}
        </div>
        <div className="site-header-action">{activeTab === 'learn' ? <button ref={menuButton} className="site-lessons-button" type="button" aria-expanded={menuOpen} aria-controls="lesson-menu" onClick={() => setMenuOpen(value => !value)}><span>Lessons <small>{activeIndex + 1}/9</small></span>{menuOpen ? <X size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}</button> : <span className="site-private">On your device</span>}</div>
      </div>
      {menuOpen && activeTab === 'learn' && <nav id="lesson-menu" className="site-lesson-menu" ref={menuRef} aria-label="Financial lessons" data-lenis-prevent>{navLinks.map((link, index) => <a key={link.target} href={`#${link.target}`} aria-current={activeSection === link.target ? 'location' : undefined} onClick={event => {
        setMenuOpen(false);
        if (window.location.hash === `#${link.target}`) {
          event.preventDefault();
          const target = document.getElementById(link.target);
          if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 760 ? 120 : 88), behavior: 'instant' });
        }
      }}><span>{String(index + 1).padStart(2, '0')}</span>{link.label}</a>)}</nav>}
    </header>
  );
}
