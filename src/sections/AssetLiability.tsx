import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DraggableItem {
  id: string;
  label: string;
  category: 'asset' | 'liability';
  icon: string;
  description: string;
  special?: 'house-trap' | 'rpgt';
}

const items: DraggableItem[] = [
  { id: 'asb', label: 'ASB/ASNB Units', category: 'asset', icon: '🏦', description: 'Bumiputera savings. Dividends ~5.50 sen/unit.' },
  { id: 'epf', label: 'EPF Account 1', category: 'asset', icon: '🔒', description: 'Locked until 55. Forced savings, not liquid wealth.' },
  { id: 'rental', label: 'Rental Property', category: 'asset', icon: '🏠', description: 'Generates rental income. Watch the RPGT timer!', special: 'rpgt' },
  { id: 'stocks', label: 'Dividend Stocks', category: 'asset', icon: '📈', description: 'Maybank, Public Bank dividends. Tax-exempt.' },
  { id: 'unit-trust', label: 'Unit Trust', category: 'asset', icon: '💼', description: 'Public Mutual, etc. Managed fund investments.' },
  { id: 'prs', label: 'PRS Contribution', category: 'asset', icon: '🐷', description: 'Private Retirement Scheme. Age 55+ access.' },
  { id: 'ptptn', label: 'PTPTN Loan', category: 'liability', icon: '🎓', description: 'Education debt. 417,000+ defaulters in Malaysia.' },
  { id: 'car', label: 'Car Loan', category: 'liability', icon: '🚗', description: 'Myvi/Civic. Loses 20% value when driven out.' },
  { id: 'cc', label: 'Credit Card Debt', category: 'liability', icon: '💳', description: '15-18% interest. The silent wealth killer.' },
  { id: 'iphone', label: 'iPhone Installment', category: 'liability', icon: '📱', description: 'Depreciating gadget. Monthly drain.' },
  { id: 'house', label: 'Primary Residence', category: 'liability', icon: '🏡', description: 'THE TRAP: Money flows OUT every month.', special: 'house-trap' },
  { id: 'watch', label: 'Luxury Watch', category: 'liability', icon: '⌚', description: 'Status symbol. Cash outflow.' },
];

export default function AssetLiability() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(items);
  const [assets, setAssets] = useState<DraggableItem[]>([]);
  const [liabilities, setLiabilities] = useState<DraggableItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [showHouseTrap, setShowHouseTrap] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [assetFlow, setAssetFlow] = useState(0);
  const [liabilityLeak, setLiabilityLeak] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  useEffect(() => {
    if (available.length === 0 && !completed) {
      setCompleted(true);
      setTimeout(() => {
        const summary = document.getElementById('asset-summary');
        if (summary) {
          gsap.fromTo(summary, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      }, 100);
    }
  }, [available, completed]);

  const handleDragStart = (id: string) => {
    setDragging(id);
  };

  const handleDrop = (target: 'asset' | 'liability') => {
    if (!dragging) return;
    const item = items.find(i => i.id === dragging);
    if (!item) return;

    const correct = item.category === target;
    setFeedback({ id: dragging, correct });

    if (item.special === 'house-trap' && target === 'asset') {
      setShowHouseTrap(true);
      setTimeout(() => setShowHouseTrap(false), 4000);
    }

    if (correct) {
      setAvailable(prev => prev.filter(i => i.id !== dragging));
      if (target === 'asset') {
        setAssets(prev => [...prev, item]);
        setAssetFlow(prev => Math.min(prev + 1, 6));
      } else {
        setLiabilities(prev => [...prev, item]);
        setLiabilityLeak(prev => prev + 1);
      }
    }

    setTimeout(() => {
      setDragging(null);
      setFeedback(null);
    }, 600);
  };

  const getCardStyle = (item: DraggableItem) => {
    if (feedback?.id === item.id) {
      return feedback.correct
        ? 'border-emerald shadow-[0_0_16px_rgba(16,185,129,0.4)]'
        : 'border-crimson shadow-[0_0_16px_rgba(220,38,38,0.4)] animate-shake';
    }
    return 'border-navy-light hover:border-gold/30';
  };

  const riverWidth = 40 + assetFlow * 12;
  const leakGaps = liabilityLeak > 0;

  return (
    <section id="asset-liability" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 02 / Asset vs Liability
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Assets Put Money{' '}
          <span className="text-emerald">In.</span>{' '}
          Liabilities Take Money{' '}
          <span className="text-crimson">Out.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          Drag each item into the right bucket. Watch the river respond.
        </p>

        {/* Available Items */}
        {available.length > 0 && (
          <div data-reveal className="mb-8">
            <p className="text-navy-light text-xs uppercase tracking-wider mb-4">Drag these items into a bucket</p>
            <div className="flex flex-wrap gap-3">
              {available.map(item => (
                <button
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => {
                    setDragging(item.id);
                    // On mobile, show a choice
                    const choice = window.confirm(`Place "${item.label}" into:\nOK = Assets bucket\nCancel = Liabilities bucket`);
                    handleDrop(choice ? 'asset' : 'liability');
                  }}
                  className={`flex items-center gap-3 bg-navy-surface border rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02] hover:shadow-card ${getCardStyle(item)} ${dragging === item.id ? 'opacity-70 rotate-2' : ''}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-navy-light text-xs">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* House Trap Tooltip */}
        {showHouseTrap && (
          <div className="mb-6 bg-navy-surface border border-gold rounded-xl p-5 animate-pulse">
            <p className="text-gold font-semibold text-sm mb-1">The House Trap!</p>
            <p className="text-slate text-sm">Your parents said a house is an asset. But does it put money IN your pocket every month? Mortgage, maintenance, sinking fund — money flows OUT.</p>
          </div>
        )}

        {/* Two Buckets */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleDrop('asset'); }}
            className="min-h-[280px] bg-navy-surface/50 border-2 border-emerald/40 rounded-2xl p-6 transition-all duration-300"
            style={{ boxShadow: assets.length > 0 ? '0 0 30px rgba(16,185,129,0.15)' : 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald" />
              <h3 className="text-emerald font-bold text-lg uppercase tracking-wider">Assets</h3>
              <span className="text-navy-light text-sm ml-auto">{assets.length} items</span>
            </div>
            <div className="space-y-2">
              {assets.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-emerald/10 border border-emerald/30 rounded-lg px-3 py-2">
                  <span>{item.icon}</span>
                  <span className="text-white text-sm">{item.label}</span>
                  {item.special === 'rpgt' && (
                    <span className="text-gold text-xs ml-auto bg-gold/10 px-2 py-0.5 rounded-full">RPGT: 0% after Y6</span>
                  )}
                </div>
              ))}
              {assets.length === 0 && <p className="text-navy-light text-sm italic">Drop assets here</p>}
            </div>
            {/* Asset River */}
            <div className="mt-4">
              <svg width="100%" height="20" viewBox="0 0 400 20">
                <path
                  d={`M0,10 Q50,${5 + Math.sin(Date.now() * 0.003) * 3} 100,10 T200,10 T300,10 T400,10`}
                  stroke="#10B981"
                  strokeWidth={riverWidth / 10}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.6 + assetFlow * 0.1}
                >
                  <animate attributeName="d"
                    values="M0,10 Q50,5 100,10 T200,10 T300,10 T400,10;M0,10 Q50,15 100,10 T200,10 T300,10 T400,10;M0,10 Q50,5 100,10 T200,10 T300,10 T400,10"
                    dur="3s" repeatCount="indefinite" />
                </path>
                {assetFlow > 0 && Array.from({ length: assetFlow * 2 }).map((_, i) => (
                  <circle key={i} r="2" fill="#10B981" opacity="0.8">
                    <animate attributeName="cx" values={`${-20 + i * 30};${420 + i * 30}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${8 + Math.random() * 4};${8 + Math.random() * 4}`} dur="2s" repeatCount="indefinite" />
                  </circle>
                ))}
              </svg>
            </div>
          </div>

          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleDrop('liability'); }}
            className="min-h-[280px] bg-navy-surface/50 border-2 border-crimson/40 rounded-2xl p-6 transition-all duration-300"
            style={{ boxShadow: liabilities.length > 0 ? '0 0 30px rgba(220,38,38,0.15)' : 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <h3 className="text-crimson font-bold text-lg uppercase tracking-wider">Liabilities</h3>
              <span className="text-navy-light text-sm ml-auto">{liabilities.length} items</span>
            </div>
            <div className="space-y-2">
              {liabilities.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-crimson/10 border border-crimson/30 rounded-lg px-3 py-2">
                  <span>{item.icon}</span>
                  <span className="text-white text-sm">{item.label}</span>
                </div>
              ))}
              {liabilities.length === 0 && <p className="text-navy-light text-sm italic">Drop liabilities here</p>}
            </div>
            {/* Liability River */}
            <div className="mt-4">
              <svg width="100%" height="20" viewBox="0 0 400 20">
                <path
                  d="M0,10 Q50,15 100,10 T200,10 T300,10 T400,10"
                  stroke="#DC2626"
                  strokeWidth={4 + liabilityLeak * 2}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.5 + liabilityLeak * 0.08}
                  strokeDasharray={leakGaps ? '60 15 30 15' : 'none'}
                />
                {leakGaps && (
                  <>
                    <circle cx="120" cy="25" r="2" fill="#DC2626" opacity="0.6">
                      <animate attributeName="cy" values="18;35" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="280" cy="25" r="2" fill="#DC2626" opacity="0.6">
                      <animate attributeName="cy" values="18;35" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Completion Summary */}
        {completed && (
          <div id="asset-summary" className="bg-navy-surface border border-emerald/30 rounded-2xl p-8 text-center">
            <p className="text-emerald font-bold text-xl mb-2">Your Assets Are Flowing. Your Liabilities Are Contained.</p>
            <p className="text-slate text-sm">You classified all 12 items. The key insight: <span className="text-gold">your primary residence is a liability</span> — it takes money OUT of your pocket every month.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </section>
  );
}
