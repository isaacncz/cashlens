import { useState } from 'react';
import { Package } from 'lucide-react';
import { productImages } from '../data/productImages';

/** Product names are adjacent to every thumbnail, so the image is decorative. */
export default function ProductImage({ id, eager = false }: { id: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = productImages[id];
  return <span className="rs-product-image" aria-hidden="true">
    {src && !failed ? <img src={src} alt="" width="80" height="80" loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} /> : <Package size={24} strokeWidth={1.5} />}
  </span>;
}
