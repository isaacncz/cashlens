import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  phase: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 2,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(p.phase + time * 0.01) * 0.3;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) * 0.02;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll('[data-hero-reveal]');
    gsap.fromTo(
      els,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.3 }
    );
  }, []);

  const scrollToModules = () => {
    const el = document.getElementById('money-mirror');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #112240 0%, #0A192F 70%)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p data-hero-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-6 opacity-0">
          Cashflow Lens Malaysia
        </p>
        <h1 data-hero-reveal className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 opacity-0" style={{ color: '#E6F1FF' }}>
          See Money Clearly{' '}
          <span className="text-gold">/</span>
          <br />
          For The First Time
        </h1>
        <p data-hero-reveal className="text-lg md:text-xl text-slate leading-relaxed mb-10 max-w-lg mx-auto opacity-0">
          An interactive financial literacy experience built for Malaysians. Discover what your salary really means — and what it doesn't.
        </p>
        <div data-hero-reveal className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <button
            onClick={scrollToModules}
            className="group relative px-8 py-4 border border-gold text-gold font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <span className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 group-hover:text-navy transition-colors duration-300">Start Your Journey</span>
          </button>
          <button
            onClick={scrollToModules}
            className="text-slate hover:text-white text-sm font-medium transition-colors duration-200 relative group"
          >
            Explore All Modules
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
