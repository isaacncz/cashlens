import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PipeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  pipe: string;
}

function calculateTax(monthlySalary: number): number {
  const annual = monthlySalary * 12;
  let tax = 0;
  const brackets = [
    { limit: 5000, rate: 0 },
    { limit: 20000, rate: 0.01 },
    { limit: 35000, rate: 0.03 },
    { limit: 50000, rate: 0.06 },
    { limit: 70000, rate: 0.11 },
    { limit: 100000, rate: 0.19 },
    { limit: 250000, rate: 0.25 },
    { limit: 400000, rate: 0.26 },
    { limit: 600000, rate: 0.28 },
    { limit: 1000000, rate: 0.30 },
  ];
  let remaining = annual;
  let prevLimit = 0;
  for (const b of brackets) {
    const taxable = Math.min(Math.max(remaining, 0), b.limit - prevLimit);
    tax += taxable * b.rate;
    remaining -= taxable;
    prevLimit = b.limit;
    if (remaining <= 0) break;
  }
  if (remaining > 0) tax += remaining * 0.30;
  const rebate = annual <= 35000 ? 400 : 0;
  return Math.max(0, tax - rebate) / 12;
}

function calculateEPF(salary: number): { employee: number; employer: number } {
  const capped = Math.min(salary, 20000);
  return {
    employee: capped * 0.11,
    employer: capped * (salary <= 5000 ? 0.13 : 0.12),
  };
}

export default function MoneyMirror() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<PipeParticle[]>([]);
  const rafRef = useRef<number>(0);
  const flowActiveRef = useRef(false);

  const [salary, setSalary] = useState('');
  const [hours, setHours] = useState('');
  const [commute, setCommute] = useState('');
  const [expenses, setExpenses] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState({
    trueHourly: 0,
    annualHours: 0,
    monthsSurvival: 0,
    grossMonthly: 0,
    epfEmployee: 0,
    epfEmployer: 0,
    taxMonthly: 0,
    sstMonthly: 0,
    workExpenses: 0,
    netIncome: 0,
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const drawAmbient = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() * 0.001;
    for (let i = 0; i < 40; i++) {
      const x = (w * 0.3) + Math.sin(time * 0.5 + i * 0.8) * (w * 0.2);
      const y = ((i / 40) * h + time * 30) % (h + 20) - 10;
      const r = 2 + Math.sin(i * 1.3) * 1;
      const a = 0.15 + Math.sin(i * 0.7) * 0.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${a})`;
      ctx.fill();
    }
  }, []);

  const drawPipeSystem = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const total = results.grossMonthly;
    if (total <= 0) return;

    const cx = w / 2;
    const pipeW = Math.min(w * 0.35, 160);
    const startY = 20;
    const endY = h - 20;

    const ratios = {
      epf: results.epfEmployee / total,
      tax: results.taxMonthly / total,
      sst: results.sstMonthly / total,
      expense: results.workExpenses / total,
      net: results.netIncome / total,
    };

    const epfY = startY + (endY - startY) * 0.2;
    const taxY = startY + (endY - startY) * 0.4;
    const sstY = startY + (endY - startY) * 0.6;
    const expY = startY + (endY - startY) * 0.8;

    // Draw pipe walls
    ctx.strokeStyle = '#233554';
    ctx.lineWidth = 1;

    // Main pipe
    ctx.beginPath();
    ctx.moveTo(cx - pipeW / 2, startY);
    ctx.lineTo(cx - pipeW / 2, endY);
    ctx.moveTo(cx + pipeW / 2, startY);
    ctx.lineTo(cx + pipeW / 2, endY);
    ctx.stroke();

    // Side pipes
    const drawBranch = (y: number, dir: number, ratio: number, color: string) => {
      const bw = Math.max(20, pipeW * ratio * 1.5);
      const bx = dir > 0 ? cx + pipeW / 2 : cx - pipeW / 2;
      const ex = dir > 0 ? cx + pipeW / 2 + 60 : cx - pipeW / 2 - 60;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(bx, y - bw / 2);
      ctx.lineTo(ex, y - bw / 2);
      ctx.moveTo(bx, y + bw / 2);
      ctx.lineTo(ex, y + bw / 2);
      ctx.stroke();
      // End cap
      ctx.beginPath();
      ctx.moveTo(ex, y - bw / 2);
      ctx.lineTo(ex, y + bw / 2);
      ctx.stroke();
      // Label
      ctx.fillStyle = color;
      ctx.font = '11px Inter';
      ctx.textAlign = dir > 0 ? 'left' : 'right';
      ctx.fillText(`${(ratio * 100).toFixed(0)}%`, ex + dir * 8, y + 4);
    };

    drawBranch(epfY, -1, ratios.epf, '#DAA520');
    drawBranch(taxY, -1, ratios.tax, '#0033A0');
    drawBranch(sstY, 1, ratios.sst, '#64748B');
    drawBranch(expY, 1, ratios.expense, '#DC2626');

    // Net at bottom
    const netW = Math.max(20, pipeW * ratios.net);
    ctx.strokeStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(cx - netW / 2, endY);
    ctx.lineTo(cx + netW / 2, endY);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`NET ${(ratios.net * 100).toFixed(0)}%`, cx, endY + 18);

    // Spawn particles
    if (Math.random() < 0.3) {
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * pipeW * 0.6,
        y: startY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 1.5 + Math.random(),
        color: '#FFD700',
        size: 2 + Math.random() * 2,
        alpha: 0.7 + Math.random() * 0.3,
        pipe: 'main',
      });
    }

    // Update particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.y += p.vy;
      p.x += p.vx;

      if (p.y >= endY) {
        p.color = '#FFD700';
        p.alpha *= 0.9;
        if (p.alpha < 0.05) return false;
        return true;
      }

      // EPF junction
      if (p.pipe === 'main' && p.y >= epfY - 5 && p.y <= epfY + 5 && Math.random() < ratios.epf) {
        p.pipe = 'epf';
        p.color = '#DAA520';
        p.vx = -1.5;
      }
      // Tax junction
      if (p.pipe === 'main' && p.y >= taxY - 5 && p.y <= taxY + 5 && Math.random() < ratios.tax) {
        p.pipe = 'tax';
        p.color = '#0033A0';
        p.vx = -1.5;
      }
      // SST junction
      if (p.pipe === 'main' && p.y >= sstY - 5 && p.y <= sstY + 5 && Math.random() < ratios.sst) {
        p.pipe = 'sst';
        p.color = '#64748B';
        p.vx = 1.5;
      }
      // Expense junction
      if (p.pipe === 'main' && p.y >= expY - 5 && p.y <= expY + 5 && Math.random() < ratios.expense) {
        p.pipe = 'expense';
        p.color = '#DC2626';
        p.vx = 1.5;
      }

      // Side pipe exit
      if ((p.pipe === 'epf' || p.pipe === 'tax') && p.x < cx - pipeW / 2 - 60) {
        p.alpha *= 0.9;
      }
      if ((p.pipe === 'sst' || p.pipe === 'expense') && p.x > cx + pipeW / 2 + 60) {
        p.alpha *= 0.9;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      return true;
    });
  }, [results]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (flowActiveRef.current) {
        drawPipeSystem(ctx, w, h);
      } else {
        drawAmbient(ctx, w, h);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [drawAmbient, drawPipeSystem]);

  const handleCalculate = () => {
    const gross = parseFloat(salary) || 0;
    const hrs = parseFloat(hours) || 44;
    const comm = parseFloat(commute) || 0;
    const exp = parseFloat(expenses) || 0;

    const epf = calculateEPF(gross);
    const taxMonthly = calculateTax(gross);
    const sstMonthly = gross * 0.03;
    const netIncome = gross - epf.employee - taxMonthly - sstMonthly - exp;
    const totalHours = hrs * 4.3 + comm * 4.3 * 5;
    const trueHourly = totalHours > 0 ? netIncome / totalHours : 0;
    const annualHours = totalHours * 12;
    const monthsSurvival = exp > 0 ? (netIncome * 6) / (gross * 0.7) : 0;

    setResults({
      trueHourly,
      annualHours,
      monthsSurvival,
      grossMonthly: gross,
      epfEmployee: epf.employee,
      epfEmployer: epf.employer,
      taxMonthly,
      sstMonthly,
      workExpenses: exp,
      netIncome,
    });

    setCalculated(true);
    flowActiveRef.current = true;

    setTimeout(() => {
      if (resultsRef.current) {
        const els = resultsRef.current.querySelectorAll('[data-result]');
        gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 });
      }
    }, 100);
  };

  const inputClass = "w-full bg-navy-surface border border-navy-light rounded-lg px-4 py-3 text-white font-mono-data text-sm focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15)] transition-all placeholder:text-navy-light";
  const labelClass = "block text-xs font-medium uppercase tracking-wider text-slate mb-2";

  return (
    <section id="money-mirror" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Panel */}
          <div>
            <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
              Module 01 / The Money Mirror
            </p>
            <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
              What Is Your Time{' '}
              <span className="text-gold">Really Worth?</span>
            </h2>
            <p data-reveal className="text-slate text-base md:text-lg mb-8 leading-relaxed">
              Enter your monthly details. Watch the hidden drains appear.
            </p>

            <div data-reveal className="space-y-5 mb-8">
              <div>
                <label className={labelClass}>Gross Monthly Salary (RM)</label>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="8000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hours Worked Per Week</label>
                <input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="44" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Daily Commute (hours)</label>
                <input type="number" value={commute} onChange={e => setCommute(e.target.value)} placeholder="2" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Work-Related Expenses (RM/month)</label>
                <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="500" className={inputClass} />
                <p className="text-navy-light text-xs mt-1">Petrol, toll, food, uniforms, parking</p>
              </div>
            </div>

            <button
              data-reveal
              onClick={handleCalculate}
              className="w-full py-4 bg-gold text-navy font-semibold rounded-lg hover:shadow-[0_4px_16px_rgba(255,215,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Reveal My True Rate
            </button>

            {calculated && (
              <div ref={resultsRef} className="mt-8 space-y-4">
                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-6">
                  <p className="text-slate text-sm mb-1">True Hourly Rate</p>
                  <p className="text-gold font-mono-data text-4xl md:text-5xl font-bold">
                    RM {results.trueHourly.toFixed(2)}
                  </p>
                </div>
                <div data-result className="grid grid-cols-2 gap-4">
                  <div className="bg-navy-surface border border-navy-light rounded-xl p-4">
                    <p className="text-navy-light text-xs uppercase mb-1">Annual Hours Traded</p>
                    <p className="text-white font-mono-data text-xl font-bold">{results.annualHours.toFixed(0)}</p>
                  </div>
                  <div className="bg-navy-surface border border-navy-light rounded-xl p-4">
                    <p className="text-navy-light text-xs uppercase mb-1">Survival Without Work</p>
                    <p className="text-crimson font-mono-data text-xl font-bold">{results.monthsSurvival.toFixed(1)} months</p>
                  </div>
                </div>
                <div data-result className="bg-navy-surface/50 border border-gold/20 rounded-xl p-4">
                  <p className="text-slate text-sm italic">
                    Freedom comparison:{' '}
                    <span className="text-gold">RM 5,000/month passive income from ASB = same cash, zero hours.</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Canvas Visualization */}
          <div data-reveal className="relative min-h-[400px] lg:min-h-[600px] bg-navy-surface/30 rounded-2xl border border-navy-light/50 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            {!calculated && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-navy-light text-sm">Enter your details and click reveal to see your money flow</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
