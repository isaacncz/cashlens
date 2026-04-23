import { useEffect, useState, useRef } from 'react';

const navLinks = [
  { label: 'Money Mirror', target: 'money-mirror' },
  { label: 'Assets', target: 'asset-liability' },
  { label: 'Quadrant', target: 'cashflow-quadrant' },
  { label: 'Rat Race', target: 'rat-race' },
  { label: 'Debt', target: 'debt' },
  { label: 'Salary', target: 'salary-wealth' },
  { label: 'Wealth', target: 'wealth-thermometer' },
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

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(10, 25, 47, 0.85)' : 'rgba(10, 25, 47, 0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(35, 53, 84, 0.5)' : '1px solid transparent',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <button onClick={scrollToTop} className="flex items-center gap-2 cursor-pointer">
          <span className="text-gold font-bold text-xl tracking-tight">Cashflow Lens</span>
          <span className="text-slate text-xs">Malaysia</span>
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
          <div className="flex items-center gap-1 text-xs ml-4">
            <span className="text-gold font-medium">EN</span>
            <span className="text-navy-light">/</span>
            <span className="text-navy-light opacity-50">BM</span>
          </div>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
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
        <div className="absolute top-16 left-0 right-0 bg-navy/95 backdrop-blur-lg border-b border-navy-light lg:hidden">
          <div className="flex flex-col p-4 gap-3">
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
    </nav>
  );
}
