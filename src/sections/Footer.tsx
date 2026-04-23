const moduleLinks = [
  { label: 'Money Mirror', target: 'money-mirror' },
  { label: 'Asset vs Liability', target: 'asset-liability' },
  { label: 'Cashflow Quadrant', target: 'cashflow-quadrant' },
  { label: 'Rat Race Simulator', target: 'rat-race' },
  { label: 'Debt Visualizer', target: 'debt' },
  { label: 'Salary vs Wealth', target: 'salary-wealth' },
  { label: 'Wealth Thermometer', target: 'wealth-thermometer' },
];

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-navy-surface border-t border-navy-light">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          <div className="md:w-1/3">
            <h3 className="text-gold font-bold text-lg mb-2">Cashflow Lens Malaysia</h3>
            <p className="text-slate text-sm leading-relaxed">
              See money clearly for the first time. An interactive financial literacy experience inspired by Rich Dad Poor Dad, built specifically for Malaysians.
            </p>
          </div>
          <div className="md:w-1/3">
            <h4 className="text-white text-xs font-medium uppercase tracking-wider mb-4">Modules</h4>
            <div className="grid grid-cols-2 gap-2">
              {moduleLinks.map(link => (
                <button
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  className="text-left text-slate text-sm hover:text-gold transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:w-1/3">
            <h4 className="text-white text-xs font-medium uppercase tracking-wider mb-4">Disclaimer</h4>
            <p className="text-slate text-xs leading-relaxed">
              This is financial education, not licensed financial advice. Consult a licensed financial planner for personalized advice. All calculations are estimates for educational purposes.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-navy-light flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate text-xs">Built for Malaysians. Inspired by Rich Dad Poor Dad.</p>
          <p className="text-slate text-xs">Privacy-first. No data stored. Client-side only.</p>
        </div>
      </div>
    </footer>
  );
}
