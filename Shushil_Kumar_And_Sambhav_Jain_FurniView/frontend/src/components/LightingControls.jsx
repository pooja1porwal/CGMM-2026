export const LIGHTING_PRESETS = {
  studio: {
    label: 'Studio Softbox',
    icon: '💡',
    ambientColor: '#f1f5f9',
    ambientIntensity: 0.5,
    keyColor: '#fffdfa',
    keyIntensity: 1.1,
    fillColor: '#93c5fd',
    fillIntensity: 0.4,
    envPreset: 'studio',
  },
  sunset: {
    label: 'Warm Sunset',
    icon: '🌅',
    ambientColor: '#fdba74',
    ambientIntensity: 0.6,
    keyColor: '#f97316',
    keyIntensity: 1.4,
    fillColor: '#818cf8',
    fillIntensity: 0.3,
    envPreset: 'sunset',
  },
  daylight: {
    label: 'Clean Daylight',
    icon: '☀️',
    ambientColor: '#e0f2fe',
    ambientIntensity: 0.7,
    keyColor: '#ffffff',
    keyIntensity: 1.2,
    fillColor: '#bae6fd',
    fillIntensity: 0.5,
    envPreset: 'city',
  },
  cyberpunk: {
    label: 'Cyberpunk Neon',
    icon: '🔮',
    ambientColor: '#3b0764',
    ambientIntensity: 0.5,
    keyColor: '#06b6d4',
    keyIntensity: 1.5,
    fillColor: '#ec4899',
    fillIntensity: 1.0,
    envPreset: 'night',
  },
};

export const FLOOR_STYLES = [
  { id: 'hardwood', label: 'Dark Hardwood', color: '#1c130d', roughness: 0.7 },
  { id: 'marble', label: 'Polished Marble', color: '#e2e8f0', roughness: 0.15 },
  { id: 'concrete', label: 'Studio Concrete', color: '#1e293b', roughness: 0.85 },
  { id: 'grid', label: 'Minimalist Grid', color: '#0b0f19', roughness: 0.9 },
];

export default function LightingControls({
  lightPreset,
  onLightPresetChange,
  lightIntensity,
  onLightIntensityChange,
  floorStyle,
  onFloorStyleChange,
  contactShadowsEnabled,
  onContactShadowsChange,
}) {
  return (
    <div className="lighting-controls" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ─── 1. LIGHTING ENVIRONMENT PRESETS ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
          Lighting Mood & Environment
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {Object.entries(LIGHTING_PRESETS).map(([key, p]) => {
            const isActive = lightPreset === key;
            return (
              <button
                key={key}
                onClick={() => onLightPresetChange(key)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', padding: '10px', justifyContent: 'flex-start', gap: '6px' }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. MASTER LIGHT INTENSITY ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            Intensity Multiplier
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-primary)' }}>
            {lightIntensity.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min="0.2"
          max="2.0"
          step="0.1"
          value={lightIntensity}
          onChange={(e) => onLightIntensityChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
        />
      </div>

      {/* ─── 3. FLOOR / STUDIO BACKDROP ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
          Floor & Studio Surface
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {FLOOR_STYLES.map((f) => {
            const isActive = floorStyle === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFloorStyleChange(f.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '10px', padding: '8px 10px' }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 4. SHADOWS TOGGLE ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            Contact Ground Shadows
          </span>
          <button
            onClick={() => onContactShadowsChange(!contactShadowsEnabled)}
            className={`btn ${contactShadowsEnabled ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '10px', padding: '4px 12px' }}
          >
            {contactShadowsEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
