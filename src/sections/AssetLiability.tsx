import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Building2, Car, CreditCard, GraduationCap, House, Landmark, Lock, PiggyBank, Smartphone, TrendingUp, Watch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface DraggableItem {
  id: string;
  label: string;
  category: 'asset' | 'liability';
  icon: LucideIcon;
  description: string;
  special?: 'house-trap' | 'rpgt';
}

const items: DraggableItem[] = [
  { id: 'asb', label: 'ASB/ASNB Units', category: 'asset', icon: Landmark, description: 'Bumiputera savings. Dividends ~5.50 sen/unit.' },
  { id: 'epf', label: 'EPF Account 1', category: 'asset', icon: Lock, description: 'Locked until 55. Forced savings, not liquid wealth.' },
  { id: 'rental', label: 'Rental Property', category: 'asset', icon: Building2, description: 'Generates rental income. Watch the RPGT timer!', special: 'rpgt' },
  { id: 'stocks', label: 'Dividend Stocks', category: 'asset', icon: TrendingUp, description: 'Maybank, Public Bank dividends. Tax-exempt.' },
  { id: 'unit-trust', label: 'Unit Trust', category: 'asset', icon: Briefcase, description: 'Public Mutual, etc. Managed fund investments.' },
  { id: 'prs', label: 'PRS Contribution', category: 'asset', icon: PiggyBank, description: 'Private Retirement Scheme. Age 55+ access.' },
  { id: 'ptptn', label: 'PTPTN Loan', category: 'liability', icon: GraduationCap, description: 'Education debt. 417,000+ defaulters in Malaysia.' },
  { id: 'car', label: 'Car Loan', category: 'liability', icon: Car, description: 'Myvi/Civic. Loses 20% value when driven out.' },
  { id: 'cc', label: 'Credit Card Debt', category: 'liability', icon: CreditCard, description: '15-18% interest. The silent wealth killer.' },
  { id: 'iphone', label: 'iPhone Installment', category: 'liability', icon: Smartphone, description: 'Depreciating gadget. Monthly drain.' },
  { id: 'house', label: 'Primary Residence', category: 'liability', icon: House, description: 'THE TRAP: Money flows OUT every month.', special: 'house-trap' },
  { id: 'watch', label: 'Luxury Watch', category: 'liability', icon: Watch, description: 'Status symbol. Cash outflow.' },
];

export default function AssetLiability() {
  const [available, setAvailable] = useState(items);
  const [assets, setAssets] = useState<DraggableItem[]>([]);
  const [liabilities, setLiabilities] = useState<DraggableItem[]>([]);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [showHouseTrap, setShowHouseTrap] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const pointerStartX = useRef<number | null>(null);



  const completed = available.length === 0;



  const currentItem = available[0] ?? null;

  const classifyCurrentCard = (target: 'asset' | 'liability') => {
    if (!currentItem) return;

    const correct = currentItem.category === target;
    setFeedback({ id: currentItem.id, correct });

    if (currentItem.special === 'house-trap' && target === 'asset') {
      setShowHouseTrap(true);
      setTimeout(() => setShowHouseTrap(false), 4000);
    }

    if (correct) {
      setAvailable(prev => prev.slice(1));
      if (target === 'asset') {
        setAssets(prev => [...prev, currentItem]);
      } else {
        setLiabilities(prev => [...prev, currentItem]);
      }
    }

    setDragOffsetX(0);
    setTimeout(() => {
      setFeedback(null);
    }, correct ? 420 : 600);
  };

  const handleCardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    const bounded = Math.max(-140, Math.min(140, delta));
    setDragOffsetX(bounded);
  };

  const handleCardPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    const threshold = 90;
    if (dragOffsetX <= -threshold) {
      classifyCurrentCard('asset');
    } else if (dragOffsetX >= threshold) {
      classifyCurrentCard('liability');
    } else {
      setDragOffsetX(0);
    }
    pointerStartX.current = null;
  };

  const cardFeedback = (item: DraggableItem) => feedback?.id === item.id ? (feedback.correct ? 'correct' : 'wrong') : undefined;
  const progressDone = items.length - available.length;
  const swipeHint = dragOffsetX < -30 ? 'Asset' : dragOffsetX > 30 ? 'Liability' : null;

  return (
    <section id="asset-liability" className="lesson" aria-labelledby="asset-liability-heading">
      <header className="lesson-intro">
        <h1 id="asset-liability-heading">Assets put money in. Liabilities take money out.</h1>
        <p>One card at a time. Swipe <span className="tone-good">left for Asset</span>, <span className="tone-bad">right for Liability</span>.</p>
      </header>

      <div className="lesson-stack">
        <div className="al-progress">
          <p><span>Card classifier mode</span><span>{progressDone}/{items.length} classified</span></p>
          <div className="meter meter-positive" aria-hidden="true"><span style={{ width: `${(progressDone / items.length) * 100}%` }} /></div>
        </div>

        {currentItem && (() => {
          const Icon = currentItem.icon;
          return <div>
            <div
              onPointerDown={handleCardPointerDown}
              onPointerMove={handleCardPointerMove}
              onPointerUp={handleCardPointerUp}
              onPointerCancel={() => {
                pointerStartX.current = null;
                setDragOffsetX(0);
              }}
              className={`lesson-card al-card select-none touch-none${cardFeedback(currentItem) === 'wrong' ? ' animate-shake' : ''}`}
              data-feedback={cardFeedback(currentItem)}
              style={{ transform: `translateX(${dragOffsetX}px) rotate(${dragOffsetX / 18}deg)` }}
            >
              <div className="al-card-body">
                <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                <div><h2>{currentItem.label}</h2><p className="lesson-muted">{currentItem.description}</p></div>
              </div>
              <div className="al-actions">
                <button type="button" className="lesson-button al-asset" onClick={() => classifyCurrentCard('asset')}><ArrowLeft size={18} aria-hidden="true" />Asset</button>
                <button type="button" className="lesson-button al-liability" onClick={() => classifyCurrentCard('liability')}>Liability<ArrowRight size={18} aria-hidden="true" /></button>
              </div>
            </div>
            <p className="lesson-muted al-hint">
              {swipeHint ? <>Current direction: <strong className={swipeHint === 'Asset' ? 'tone-good' : 'tone-bad'}>{swipeHint}</strong></> : <>Drag horizontally or tap a button to classify.</>}
              {' '}{available.length - 1} cards remaining after this one.
            </p>
          </div>;
        })()}

        {showHouseTrap && (
          <div className="lesson-card al-trap" role="status">
            <h2>The House Trap!</h2>
            <p className="lesson-muted">Your parents said a house is an asset. But does it put money IN your pocket every month? Mortgage, maintenance, sinking fund — money flows OUT.</p>
          </div>
        )}

        <div className="al-buckets">
          {([['Assets', assets, 'tone-good'], ['Liabilities', liabilities, 'tone-bad']] as const).map(([title, list, tone]) => (
            <section key={title} className="lesson-card al-bucket" aria-label={title}>
              <h2><span className={tone}>{title}</span><span>{list.length} items</span></h2>
              {list.length > 0 ? <ul>{list.map(item => {
                const Icon = item.icon;
                return <li key={item.id}><Icon size={16} aria-hidden="true" />{item.label}{item.special === 'rpgt' && <small>RPGT: 0% after Y6</small>}</li>;
              })}</ul> : <p className="lesson-muted">{title === 'Assets' ? 'Drop assets here' : 'Drop liabilities here'}</p>}
            </section>
          ))}
        </div>

        {completed && (
          <div id="asset-summary" className="lesson-card" role="status">
            <h2 className="tone-good al-summary-title">Your Assets Are Flowing. Your Liabilities Are Contained.</h2>
            <p className="lesson-muted">You classified all 12 items. The key insight: <strong>your primary residence is a liability</strong> — it takes money OUT of your pocket every month.</p>
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
