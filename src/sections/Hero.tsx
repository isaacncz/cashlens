import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="learning-intro">
      <h1>See money clearly.<br /><span>Make your next move.</span></h1>
      <p>Interactive financial literacy for Malaysians. Explore your cashflow, understand your choices, and put each lesson to work.</p>
      <div className="learning-intro-actions"><a href="#money-mirror">Start learning <ArrowRight size={17} aria-hidden="true" /></a><a href="#compounding">Explore repeat sales</a></div>
      <p className="learning-intro-note">9 interactive lessons · Malaysia-first · Private by default</p>
    </section>
  );
}
