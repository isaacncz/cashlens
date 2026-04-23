import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import MoneyMirror from './sections/MoneyMirror';
import AssetLiability from './sections/AssetLiability';
import CashflowQuadrant from './sections/CashflowQuadrant';
import RatRace from './sections/RatRace';
import DebtVisualizer from './sections/DebtVisualizer';
import SalaryWealth from './sections/SalaryWealth';
import WealthThermometer from './sections/WealthThermometer';
import Footer from './sections/Footer';

export default function App() {
  useLenis();

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0A192F' }}>
      <Navigation />
      <Hero />
      <MoneyMirror />
      <AssetLiability />
      <CashflowQuadrant />
      <RatRace />
      <DebtVisualizer />
      <SalaryWealth />
      <WealthThermometer />
      <Footer />
    </div>
  );
}
