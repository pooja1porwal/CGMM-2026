import { useNavigate } from 'react-router-dom';

// Clean aesthetic gradient backdrops for cards
const categoryGradients = {
  Sofa: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
  Armchair: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.1) 100%)',
  Table: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.1) 100%)',
  Bed: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(139,92,246,0.1) 100%)',
  Chair: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 100%)',
  Wardrobe: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(99,102,241,0.1) 100%)',
  Desk: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(14,165,233,0.1) 100%)',
  Cabinet: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,179,8,0.1) 100%)',
};

// High quality 3D isometric vector silhouettes replacing simple emojis
function ModelPreviewGraphic({ category, name }) {
  if (name.includes('Sofa')) {
    return (
      <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
        <rect x="15" y="48" width="90" height="24" rx="6" fill="#8b5cf6" fillOpacity="0.8" />
        <rect x="24" y="32" width="72" height="20" rx="4" fill="#a78bfa" fillOpacity="0.9" />
        <rect x="10" y="38" width="14" height="30" rx="4" fill="#7c3aed" />
        <rect x="96" y="38" width="14" height="30" rx="4" fill="#7c3aed" />
        <line x1="25" y1="72" x2="20" y2="82" stroke="#d4af37" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="95" y1="72" x2="100" y2="82" stroke="#d4af37" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('Bed')) {
    return (
      <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
        <rect x="12" y="16" width="96" height="32" rx="4" fill="#8b5cf6" fillOpacity="0.8" />
        <rect x="18" y="36" width="84" height="38" rx="6" fill="#f8fafc" fillOpacity="0.95" />
        <rect x="18" y="52" width="84" height="22" rx="4" fill="#06b6d4" fillOpacity="0.85" />
        <rect x="25" y="30" width="30" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" />
        <rect x="65" y="30" width="30" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" />
      </svg>
    );
  }
  if (name.includes('Armchair')) {
    return (
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
        <rect x="24" y="44" width="52" height="22" rx="5" fill="#10b981" fillOpacity="0.85" />
        <rect x="28" y="20" width="44" height="32" rx="5" fill="#34d399" fillOpacity="0.9" />
        <rect x="18" y="36" width="12" height="28" rx="4" fill="#059669" />
        <rect x="70" y="36" width="12" height="28" rx="4" fill="#059669" />
        <line x1="30" y1="66" x2="24" y2="82" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="66" x2="76" y2="82" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('Office Chair')) {
    return (
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
        <rect x="28" y="44" width="44" height="10" rx="4" fill="#1e293b" />
        <rect x="32" y="16" width="36" height="30" rx="4" fill="#334155" />
        <rect x="36" y="8" width="28" height="8" rx="3" fill="#475569" />
        <line x1="50" y1="54" x2="50" y2="72" stroke="#94a3b8" strokeWidth="4" />
        <line x1="50" y1="72" x2="30" y2="80" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="72" x2="70" y2="80" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('Dining Table')) {
    return (
      <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
        <rect x="12" y="38" width="96" height="10" rx="3" fill="#d97706" />
        <rect x="42" y="24" width="36" height="14" rx="2" fill="#f8fafc" fillOpacity="0.8" />
        <line x1="24" y1="48" x2="20" y2="78" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
        <line x1="96" y1="48" x2="100" y2="78" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('Coffee Table')) {
    return (
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        <ellipse cx="55" cy="42" rx="45" ry="12" fill="#b45309" />
        <ellipse cx="55" cy="56" rx="35" ry="8" fill="#78350f" fillOpacity="0.8" />
        <line x1="28" y1="46" x2="24" y2="74" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
        <line x1="82" y1="46" x2="86" y2="74" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('Wardrobe')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <rect x="20" y="10" width="50" height="68" rx="3" fill="#78350f" />
        <line x1="45" y1="10" x2="45" y2="78" stroke="#451a03" strokeWidth="2" />
        <rect x="42" y="38" width="2" height="14" rx="1" fill="#d4af37" />
        <rect x="47" y="38" width="2" height="14" rx="1" fill="#d4af37" />
        <rect x="24" y="78" width="42" height="6" fill="#1c1917" />
      </svg>
    );
  }
  if (name.includes('Desk')) {
    return (
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        <rect x="15" y="36" width="80" height="8" rx="2" fill="#d97706" />
        <rect x="65" y="44" width="26" height="30" rx="2" fill="#b45309" />
        <line x1="25" y1="44" x2="25" y2="74" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="35" y="24" width="20" height="12" rx="2" fill="#06b6d4" />
      </svg>
    );
  }
  if (name.includes('TV') || name.includes('Cabinet')) {
    return (
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        <rect x="15" y="52" width="80" height="22" rx="3" fill="#78350f" />
        <rect x="25" y="20" width="60" height="30" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <line x1="25" y1="74" x2="20" y2="82" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
        <line x1="85" y1="74" x2="90" y2="82" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Default Dining Chair
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
      <rect x="28" y="44" width="44" height="8" rx="3" fill="#d97706" />
      <rect x="32" y="16" width="36" height="28" rx="3" fill="#b45309" />
      <line x1="34" y1="52" x2="28" y2="80" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="52" x2="72" y2="80" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function FurnitureCard({ furniture }) {
  const navigate = useNavigate();

  const gradient = categoryGradients[furniture.category] || 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))';

  return (
    <div
      className="furniture-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* 3D Model Graphic Preview */}
      <div style={{
        position: 'relative',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradient,
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
          transform: 'scale(1.15)',
          transition: 'transform 0.35s ease',
        }}>
          <ModelPreviewGraphic category={furniture.category} name={furniture.name} />
        </div>

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '20px', background: 'rgba(139, 92, 246, 0.2)',
            color: 'var(--color-primary-light)', border: '1px solid rgba(139, 92, 246, 0.3)',
          }}>
            {furniture.category}
          </span>
        </div>

        {/* GLB 3D Badge */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span style={{
            fontSize: '9px', fontWeight: 700, padding: '3px 8px',
            borderRadius: '6px', background: 'rgba(6, 182, 212, 0.2)',
            color: 'var(--color-accent)', border: '1px solid rgba(6, 182, 212, 0.3)',
          }}>
            3D GLB
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          {furniture.name}
        </h3>
        <p style={{
          fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5,
          marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {furniture.description}
        </p>

        {/* Color Palette Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          {(furniture.colors || []).slice(0, 5).map((c) => (
            <span
              key={c}
              style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: c, border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            />
          ))}
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
            +{furniture.materials?.length || 4} Materials
          </span>
        </div>

        {/* Explore Button */}
        <button
          onClick={() => navigate(`/furniture/${furniture._id}`)}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'auto', padding: '10px', fontSize: '12px' }}
        >
          View & Customize in 3D →
        </button>
      </div>
    </div>
  );
}
