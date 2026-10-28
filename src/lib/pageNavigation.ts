/** Match in-app scrolling to the usable area between the header and thumb controls. */
export function getHeaderOffset(): number {
  return (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 64) + 16;
}
export function scrollToContent(target: HTMLElement): void {
  const main = document.getElementById('main-content');
  if (main) {
    main.scrollTo({ top: target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 16, behavior: 'instant' });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), behavior: 'instant' });
  }
  target.focus({ preventScroll: true });
}
