import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { presets } from '../data/presets';
import { generateLogos } from '../generator/logoGenerator';
import LogoPreview from './LogoPreview';
import { useStudio } from './StudioContext';
const demos = presets.map((p) => generateLogos(p)[0]);
export default function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null),
    { setBrand } = useStudio(),
    navigate = useNavigate();
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="demo-modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="demo-title"
    >
      <div className="row between">
        <span className="eyebrow">A LITTLE INSPIRATION</span>
        <button className="icon-button" aria-label="Close demos" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <h2 id="demo-title">Start with a story.</h2>
      <p>Pick a demo brand. Explore its brief, then make it your own.</p>
      <div className="demo-grid">
        {presets.map((brand, i) => (
          <button
            className="demo-option"
            key={brand.brandName}
            onClick={() => {
              setBrand({ ...brand });
              onClose();
              navigate('/create');
            }}
          >
            <LogoPreview concept={demos[i]} />
            <span className="row between">
              <strong>{brand.brandName}</strong>
              <ArrowRight size={18} />
            </span>
            <small>
              {brand.industry} · {brand.personality[0]}
            </small>
          </button>
        ))}
      </div>
    </dialog>
  );
}
