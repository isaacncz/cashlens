export type Theme = 'system' | 'light' | 'dark';
export type Preferences = { theme: Theme; reduceMotion: boolean };
const key = 'cashflow-lens-preferences';
export function readPreferences(): Preferences {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { theme: ['system', 'dark', 'light'].includes(value.theme) ? value.theme : 'light', reduceMotion: value.reduceMotion === true };
  } catch { return { theme: 'light', reduceMotion: false }; }
}
export function applyPreferences(value: Preferences) {
  const root = document.documentElement;
  const dark = value.theme === 'dark' || (value.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme = dark ? 'dark' : 'light';
  root.classList.toggle('dark', dark);
  root.dataset.reduceMotion = String(value.reduceMotion);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121c17' : '#f6f8fa');
}
export function savePreferences(value: Preferences) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing can block storage. */ }
  applyPreferences(value);
}
