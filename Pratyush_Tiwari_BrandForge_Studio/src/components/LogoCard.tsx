import { ArrowUpRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LogoConcept } from '../types/logo';
import LogoPreview from './LogoPreview';
import PaletteStrip from './PaletteStrip';
import ExportButtons from './ExportButtons';
import { useStudio } from './StudioContext';
export default function LogoCard({ concept, index }: { concept: LogoConcept; index: number }) {
  const { select } = useStudio(),
    navigate = useNavigate();
  return (
    <article className="concept-card">
      <div className="concept-image">
        {index % 9 === 0 && <span className="free-label">FREE</span>}
        <button className="favorite-logo" aria-label="Save logo idea" type="button">
          <Heart size={22} />
        </button>
        <LogoPreview concept={concept} />
        <span className="layout-label">{concept.layout}</span>
      </div>
      <div className="concept-body">
        <div className="row between">
          <h3>{concept.name}</h3>
          <PaletteStrip palette={concept.palette} />
        </div>
        <div className="concept-actions">
          <button
            className="btn btn-small btn-primary"
            onClick={() => {
              select(concept);
              navigate('/editor');
            }}
          >
            Edit <ArrowUpRight size={13} />
          </button>
          <ExportButtons concept={concept} />
        </div>
      </div>
    </article>
  );
}
