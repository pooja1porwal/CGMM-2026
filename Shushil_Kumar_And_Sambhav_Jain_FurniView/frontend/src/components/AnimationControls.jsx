export default function AnimationControls({
  activeTransition,
  onTriggerTransition,
  autoRotate,
  onAutoRotateChange,
  autoRotateSpeed,
  onAutoRotateSpeedChange,
  onCameraPreset,
}) {
  const transitionButtons = [
    { id: 'fade', label: 'Fade Transition', icon: '🌫️', desc: 'Alpha opacity easing' },
    { id: 'slide', label: 'Slide In / Out', icon: '🛷', desc: 'Translation glide' },
    { id: 'zoom', label: 'Zoom Punch', icon: '🔍', desc: 'Focal scale thrust' },
    { id: 'rotation', label: '360° Spin Spin', icon: '🔄', desc: 'Full turntable spin' },
    { id: 'scale', label: 'Elastic Bounce', icon: '🏀', desc: 'Scale pop-in spring' },
    { id: 'appear', label: 'Disappear / Appear', icon: '✨', desc: 'Dissolve in & out' },
  ];

  const cameraAngles = [
    { id: 'perspective', label: 'Perspective (3/4)', pos: [3, 2.5, 3] },
    { id: 'front', label: 'Front (Elevation)', pos: [0, 1.2, 4] },
    { id: 'side', label: 'Side Profile', pos: [4, 1.2, 0] },
    { id: 'top', label: 'Top-Down Plan', pos: [0, 4.5, 0.01] },
    { id: 'iso', label: 'Isometric 45°', pos: [3.5, 3.5, 3.5] },
  ];

  return (
    <div className="animation-controls" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ─── 1. MULTIMEDIA CG TRANSITIONS ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
          Multimedia / CG Transitions
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {transitionButtons.map((btn) => {
            const isPlaying = activeTransition === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => onTriggerTransition(btn.id)}
                className={`btn ${isPlaying ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '10px', gap: '2px', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
                  <span>{btn.icon}</span>
                  <span>{btn.label}</span>
                </div>
                <span style={{ fontSize: '9px', opacity: 0.65 }}>{btn.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. TURNTABLE AUTO-ROTATION ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            Continuous Turntable Rotation
          </span>
          <button
            onClick={() => onAutoRotateChange(!autoRotate)}
            className={`btn ${autoRotate ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '10px', padding: '4px 12px' }}
          >
            {autoRotate ? '⏸ Active' : '▶ Play'}
          </button>
        </div>

        {autoRotate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.2s ease-out' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', width: '70px' }}>Speed:</span>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={autoRotateSpeed}
              onChange={(e) => onAutoRotateSpeedChange(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
              {autoRotateSpeed}x
            </span>
          </div>
        )}
      </div>

      {/* ─── 3. CAMERA VIEW PRESETS ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
          Camera View Angles
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {cameraAngles.map((cam) => (
            <button
              key={cam.id}
              onClick={() => onCameraPreset(cam.pos)}
              className="btn btn-ghost"
              style={{ fontSize: '10px', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              🎥 {cam.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
