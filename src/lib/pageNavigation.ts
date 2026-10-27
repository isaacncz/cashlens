/** Match anchor navigation to the rendered header, including zoom and safe areas. */
export function getHeaderOffset(): number {
  return (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 73) + 16;
}
