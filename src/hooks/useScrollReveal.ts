import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : [el];

    gsap.set(targets, { opacity: 0, y: 40 });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}
