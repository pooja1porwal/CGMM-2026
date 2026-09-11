import { useState, useMemo } from 'react';
import * as THREE from 'three';

export const DEFAULT_TRANSFORMS = {
  translation: [0, 0, 0], // [x, y, z]
  rotation: [0, 0, 0],    // [pitch (rx), yaw (ry), roll (rz)] in degrees
  uniformScale: 1.0,
  scale: [1, 1, 1],       // [sx, sy, sz]
  reflection: { xy: false, yz: false, xz: false },
  shearing: { xy: 0, xz: 0, yx: 0, yz: 0, zx: 0, zy: 0 },
};

/**
 * Computes the combined 4x4 affine Transformation Matrix:
 * M = Translation * Rotation * Scale * Reflection * Shearing
 */
export function computeAffineMatrix(transforms) {
  const { translation, rotation, uniformScale, scale, reflection, shearing } = transforms;

  // 1. Translation Matrix
  const tMat = new THREE.Matrix4().makeTranslation(
    translation[0],
    translation[1],
    translation[2]
  );

  // 2. Rotation Matrix (Euler angles in radians)
  const rMat = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(
      (rotation[0] * Math.PI) / 180,
      (rotation[1] * Math.PI) / 180,
      (rotation[2] * Math.PI) / 180,
      'XYZ'
    )
  );

  // 3. Scale Matrix (Uniform * Non-uniform)
  const sMat = new THREE.Matrix4().makeScale(
    uniformScale * scale[0] * (reflection.yz ? -1 : 1),
    uniformScale * scale[1] * (reflection.xz ? -1 : 1),
    uniformScale * scale[2] * (reflection.xy ? -1 : 1)
  );

  // 4. Shearing Matrix
  // In 3D CG, shearing adds a proportional amount of other coordinate axes:
  // x' = x + sh_xy * y + sh_xz * z
  // y' = sh_yx * x + y + sh_yz * z
  // z' = sh_zx * x + sh_zy * y + z
  const shMat = new THREE.Matrix4();
  shMat.set(
    1,             shearing.xy,   shearing.xz,   0,
    shearing.yx,   1,             shearing.yz,   0,
    shearing.zx,   shearing.zy,   1,             0,
    0,             0,             0,             1
  );

  // Compose: M = T * R * S * Sh
  const finalMat = new THREE.Matrix4();
  finalMat.multiply(tMat);
  finalMat.multiply(rMat);
  finalMat.multiply(sMat);
  finalMat.multiply(shMat);

  return finalMat;
}

export default function TransformControls({ transforms, onTransformsChange }) {
  const [showMatrix, setShowMatrix] = useState(false);

  // Compute live matrix for educational inspection
  const matrix = useMemo(() => {
    return computeAffineMatrix(transforms);
  }, [transforms]);

  const updateField = (key, value) => {
    onTransformsChange({
      ...transforms,
      [key]: value,
    });
  };

  const updateTranslation = (axisIdx, val) => {
    const next = [...transforms.translation];
    next[axisIdx] = parseFloat(val) || 0;
    updateField('translation', next);
  };

  const updateRotation = (axisIdx, val) => {
    const next = [...transforms.rotation];
    next[axisIdx] = parseFloat(val) || 0;
    updateField('rotation', next);
  };

  const updateScale = (axisIdx, val) => {
    const next = [...transforms.scale];
    next[axisIdx] = parseFloat(val) || 1;
    updateField('scale', next);
  };

  const toggleReflection = (plane) => {
    updateField('reflection', {
      ...transforms.reflection,
      [plane]: !transforms.reflection[plane],
    });
  };

  const updateShear = (key, val) => {
    updateField('shearing', {
      ...transforms.shearing,
      [key]: parseFloat(val) || 0,
    });
  };

  const handleReset = () => {
    onTransformsChange(DEFAULT_TRANSFORMS);
  };

  const matrixElements = matrix.elements; // 16 float column-major elements in Three.js

  return (
    <div className="transform-controls" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with CG Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          3D Affine Transformations
        </span>
        <button
          onClick={handleReset}
          className="btn btn-ghost"
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          Reset Transforms
        </button>
      </div>

      {/* ─── 1. TRANSLATION (X, Y, Z) ─── */}
      <div className="control-group" style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            1. Translation (X, Y, Z)
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            [{transforms.translation[0].toFixed(2)}, {transforms.translation[1].toFixed(2)}, {transforms.translation[2].toFixed(2)}]
          </span>
        </div>

        {['X (Horizontal)', 'Y (Vertical)', 'Z (Depth)'].map((label, idx) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', width: '70px', color: 'var(--color-text-secondary)' }}>{label}</span>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.05"
              value={transforms.translation[idx]}
              onChange={(e) => updateTranslation(idx, e.target.value)}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
              {transforms.translation[idx].toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ─── 2. ROTATION (Euler Pitch, Yaw, Roll) ─── */}
      <div className="control-group" style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            2. Rotation (Pitch, Yaw, Roll)
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            [{transforms.rotation[0]}°, {transforms.rotation[1]}°, {transforms.rotation[2]}°]
          </span>
        </div>

        {[
          { label: 'Pitch (Rx)', min: -180, max: 180 },
          { label: 'Yaw (Ry)', min: -180, max: 180 },
          { label: 'Roll (Rz)', min: -180, max: 180 },
        ].map((item, idx) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', width: '70px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step="1"
              value={transforms.rotation[idx]}
              onChange={(e) => updateRotation(idx, e.target.value)}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
              {transforms.rotation[idx]}°
            </span>
          </div>
        ))}
      </div>

      {/* ─── 3. SCALING (Uniform & Non-Uniform) ─── */}
      <div className="control-group" style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            3. Scaling (Uniform & Non-Uniform)
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            {transforms.uniformScale.toFixed(2)}x
          </span>
        </div>

        {/* Uniform Scale */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', width: '70px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Uniform</span>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={transforms.uniformScale}
            onChange={(e) => updateField('uniformScale', parseFloat(e.target.value) || 1)}
            style={{ flex: 1, accentColor: 'var(--color-accent)' }}
          />
          <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
            {transforms.uniformScale.toFixed(2)}x
          </span>
        </div>

        {/* Independent Axis Scale */}
        {['Sx (Width)', 'Sy (Height)', 'Sz (Depth)'].map((label, idx) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', width: '70px', color: 'var(--color-text-secondary)' }}>{label}</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={transforms.scale[idx]}
              onChange={(e) => updateScale(idx, e.target.value)}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
              {transforms.scale[idx].toFixed(2)}x
            </span>
          </div>
        ))}
      </div>

      {/* ─── 4. REFLECTION (Mirroring Across Planes) ─── */}
      <div className="control-group" style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            4. Reflection (Mirror Inversion)
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { key: 'yz', label: 'Mirror X (YZ Plane)', desc: 'X → -X' },
            { key: 'xz', label: 'Mirror Y (XZ Plane)', desc: 'Y → -Y' },
            { key: 'xy', label: 'Mirror Z (XY Plane)', desc: 'Z → -Z' },
          ].map((item) => {
            const isActive = transforms.reflection[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggleReflection(item.key)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  display: 'flex', flexDirection: 'column',
                  padding: '8px 4px', fontSize: '10px', textAlign: 'center',
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '9px', opacity: 0.7 }}>{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 5. SHEARING (Affine Skew) ─── */}
      <div className="control-group" style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)' }}>
            5. Shearing (Matrix Skew)
          </span>
        </div>

        {[
          { key: 'xy', label: 'Shear X by Y (Sh_xy)' },
          { key: 'xz', label: 'Shear X by Z (Sh_xz)' },
          { key: 'yx', label: 'Shear Y by X (Sh_yx)' },
          { key: 'yz', label: 'Shear Y by Z (Sh_yz)' },
        ].map((item) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', width: '110px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={transforms.shearing[item.key] || 0}
              onChange={(e) => updateShear(item.key, e.target.value)}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '10px', width: '32px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
              {(transforms.shearing[item.key] || 0).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ─── 6. LIVE 4x4 COMPUTER GRAPHICS MATRIX INSPECTOR ─── */}
      <div style={{ padding: '12px', background: 'var(--color-surface-lighter)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <button
          onClick={() => setShowMatrix(!showMatrix)}
          style={{
            background: 'none', border: 'none', color: 'var(--color-primary-light)',
            fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', width: '100%',
          }}
        >
          <span>📐 CG 4x4 Transformation Matrix [M = T·R·S·Ref·Sh]</span>
          <span>{showMatrix ? '▲ Hide' : '▼ View Matrix'}</span>
        </button>

        {showMatrix && (
          <div style={{ marginTop: '10px', animation: 'fadeIn 0.2s ease-out' }}>
            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Live homogeneous coordinate matrix calculated in real-time for the 3D scene:
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px',
              background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px',
              fontFamily: 'monospace', fontSize: '10px', textAlign: 'center',
            }}>
              {/* Three.js Matrix4 elements are in column-major order: elements[col * 4 + row] */}
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3].map((col) => {
                  const val = matrixElements[col * 4 + row];
                  return (
                    <div
                      key={`${row}-${col}`}
                      style={{
                        padding: '4px 2px',
                        background: col === 3 ? 'rgba(56, 189, 248, 0.1)' : row === col ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                        borderRadius: '3px',
                        color: col === 3 ? '#38bdf8' : row === col ? '#a78bfa' : '#94a3b8',
                      }}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: 'var(--color-text-muted)' }}>
              <span>Purple = Scaling/Rot diagonals</span>
              <span>Cyan = Translation Vector</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
