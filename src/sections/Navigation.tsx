import { useEffect, useState, useRef } from 'react';

const navLinks = [
  { label: 'Money Mirror', target: 'money-mirror' },
  { label: 'Assets', target: 'asset-liability' },
  { label: 'Quadrant', target: 'cashflow-quadrant' },
  { label: 'Streams', target: 'income-engine' },
  { label: 'Rat Race', target: 'rat-race' },
  { label: 'Debt', target: 'debt' },
  { label: 'Salary', target: 'salary-wealth' },
  { label: 'Wealth', target: 'wealth-thermometer' },
  { label: 'Playbook', target: 'literacy-playbook' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(l => document.getElementById(l.target)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observers: IntersectionObserver[] = [];
    sections.forEach(section => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeIndex = Math.max(0, navLinks.findIndex((link) => link.target === activeSection));
  const progressPercent = ((activeIndex + 1) / navLinks.length) * 100;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center transition-all duration-300 pt-[env(safe-area-inset-top)]"
      style={{
        backgroundColor: scrolled || mobileOpen ? 'rgba(10, 25, 47, 0.9)' : 'rgba(10, 25, 47, 0)',
        backdropFilter: scrolled || mobileOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || mobileOpen ? '1px solid rgba(35, 53, 84, 0.5)' : '1px solid transparent',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button onClick={scrollToTop} className="flex items-center gap-2 cursor-pointer">
          <span className="text-gold font-bold text-lg sm:text-xl tracking-tight leading-none">Cashflow Lens</span>
          <span className="text-slate text-[11px] sm:text-xs leading-none">Malaysia</span>
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="text-sm transition-colors duration-200 cursor-pointer"
              style={{
                color: activeSection === link.target ? '#FFD700' : '#8892B0',
              }}
              onMouseEnter={e => { if (activeSection !== link.target) e.currentTarget.style.color = '#E6F1FF'; }}
              onMouseLeave={e => { if (activeSection !== link.target) e.currentTarget.style.color = '#8892B0'; }}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-4">
            <div className="px-3 py-1 rounded-full border border-gold/20 bg-gold/10 text-gold text-xs font-semibold">
              Lesson {activeIndex + 1}/{navLinks.length}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gold font-medium">EN</span>
              <span className="text-slate">/</span>
              <span className="text-slate opacity-50">BM</span>
            </div>
          </div>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-navy/95 backdrop-blur-lg border-b border-navy-light lg:hidden max-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] overflow-y-auto">
          <div className="flex flex-col p-4 gap-3 pb-6">
            <div className="rounded-xl bg-gold/10 border border-gold/20 px-3 py-3">
              <p className="text-gold text-xs uppercase tracking-[0.12em] mb-1">Your progress</p>
              <p className="text-white text-sm font-medium">Lesson {activeIndex + 1} of {navLinks.length}</p>
              <div className="w-full bg-navy-light rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            {navLinks.map(link => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-left text-sm py-2 px-3 rounded-lg transition-colors"
                style={{
                  color: activeSection === link.target ? '#FFD700' : '#8892B0',
                  backgroundColor: activeSection === link.target ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-px bg-navy-light/60 overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </nav>
  );
}
