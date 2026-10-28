import { Laptop, Moon, Sun, ShieldCheck } from 'lucide-react';
import type { Preferences, Theme } from './preferences';
export default function Settings({ value, onChange }: { value: Preferences; onChange: (value: Preferences) => void }) {
  return <div className="app-page settings-page">
    <header className="page-heading"><h1>Make yourself at home.</h1><p>A calmer space, your way.</p></header>
    <section className="settings-section"><h2>Appearance</h2><p>Choose a theme, or follow your device.</p><fieldset className="theme-options"><legend className="sr-only">Color theme</legend>{([{ id: 'system', label: 'Device', icon: Laptop }, { id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }] as const).map(({ id, label, icon: Icon }) => <label key={id} data-selected={value.theme === id}><input type="radio" name="theme" value={id} checked={value.theme === id} onChange={() => onChange({ ...value, theme: id as Theme })} /><Icon size={24} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></label>)}</fieldset></section>
    <section className="settings-section"><h2>Comfort</h2><label className="switch-row"><span><strong>Reduce motion</strong><span>Your device’s reduced-motion setting is always respected.</span></span><input type="checkbox" checked={value.reduceMotion} onChange={event => onChange({ ...value, reduceMotion: event.target.checked })} /></label></section>
    <section className="settings-section"><h2>Currency</h2><div className="settings-value"><span>Malaysian ringgit</span><strong>MYR · RM</strong></div></section>
    <section className="settings-privacy"><ShieldCheck size={24} strokeWidth={1.6} aria-hidden="true" /><div><h2>Your numbers are yours.</h2><p>Calculator inputs stay in this session. Only appearance and motion preferences are saved on this device.</p></div></section>
    <p className="education-note">For financial education. Calculations are estimates, not personal financial advice.</p>
    <p className="preference-status" role="status">Preferences apply automatically.</p>
  </div>;
}
