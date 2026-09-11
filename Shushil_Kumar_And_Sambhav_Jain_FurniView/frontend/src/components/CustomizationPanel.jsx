import { useState } from 'react';
import TransformControls from './TransformControls';
import LightingControls from './LightingControls';
import AnimationControls from './AnimationControls';

const materialMeta = {
  Wood: {
    icon: '🪵',
    desc: 'Natural organic grain finish',
    gradient: 'linear-gradient(135deg, #a0714f, #c49a6c)',
  },
  Leather: {
    icon: '👜',
    desc: 'Full-grain leather with soft sheen',
    gradient: 'linear-gradient(135deg, #5c3a21, #8b5e3c)',
  },
  Fabric: {
    icon: '🧶',
    desc: 'Textured woven textile',
    gradient: 'linear-gradient(135deg, #4a6fa5, #6b8fc4)',
  },
  Velvet: {
    icon: '✨',
    desc: 'Plush velvet with deep specular sheen',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  },
  Metal: {
    icon: '⚙️',
    desc: 'Brushed industrial metallic finish',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
  },
};

const TAB_LIST = [
  { id: 'color', label: 'Color', icon: '🎨' },
  { id: 'material', label: 'Material', icon: '✨' },
  { id: 'accessories', label: 'Accessories', icon: '🛋️' },
  { id: 'config', label: 'Configuration', icon: '⚙️' },
  { id: 'transform', label: 'Transformations', icon: '📐' },
  { id: 'lighting', label: 'Lighting', icon: '💡' },
  { id: 'animation', label: 'Animation', icon: '🎬' },
];

export default function CustomizationPanel({
  furniture,
  color,
  onColorChange,
  materialType,
  onMaterialChange,
  materialOverrides,
  onMaterialOverridesChange,
  accessories,
  onAccessoriesChange,
  config,
  onConfigChange,
  transforms,
  onTransformsChange,
  lightPreset,
  onLightPresetChange,
  lightIntensity,
  onLightIntensityChange,
  floorStyle,
  onFloorStyleChange,
  contactShadowsEnabled,
  onContactShadowsChange,
  autoRotate,
  onAutoRotateChange,
  autoRotateSpeed,
  onAutoRotateSpeedChange,
  activeTransition,
  onTriggerTransition,
  onCameraPreset,
  onResetAll,
}) {
  const [activeTab, setActiveTab] = useState('color');

  if (!furniture) return null;

  const colors = furniture.colors || [];
  const colorNames = furniture.colorNames || [];
  const materials = furniture.materials || ['Fabric', 'Leather', 'Wood', 'Velvet', 'Metal'];
  const configurations = furniture.configurations || {};

  const updateAccessory = (key, val) => {
    onAccessoriesChange({
      ...accessories,
      [key]: val,
    });
  };

  const isSofa = furniture.category === 'Sofa' || furniture.name.includes('Sofa');
  const isBed = furniture.category === 'Bed' || furniture.name.includes('Bed');
  const isArmchair = furniture.category === 'Armchair' || furniture.name.includes('Armchair');
  const isTable = furniture.name.includes('Dining Table') || (furniture.category === 'Table' && !furniture.name.includes('Coffee'));
  const isCoffeeTable = furniture.name.includes('Coffee Table');
  const isOfficeChair = furniture.name.includes('Office Chair');
  const isDiningChair = furniture.name.includes('Dining Chair') || (furniture.category === 'Chair' && !furniture.name.includes('Office'));
  const isWardrobe = furniture.category === 'Wardrobe' || furniture.name.includes('Wardrobe');
  const isDesk = furniture.category === 'Desk' || furniture.name.includes('Desk');
  const isTvCabinet = furniture.category === 'Cabinet' || furniture.name.includes('TV') || furniture.name.includes('Console');

  return (
    <div id="customization-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-light)' }}>
      {/* ─── TABS HEADER ─── */}
      <div style={{
        display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--color-border)',
        padding: '8px 12px', gap: '4px', background: 'var(--color-surface)', flexShrink: 0,
      }}>
        {TAB_LIST.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 12px', borderRadius: '8px', fontSize: '11px',
                fontWeight: 600, border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT BODY ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* 1. COLOR TAB */}
        {activeTab === 'color' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '10px' }}>
                Preset Palette
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {colors.map((c, i) => {
                  const isActive = color.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => onColorChange(c)}
                      title={colorNames[i] || c}
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        backgroundColor: c, border: isActive ? '3px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer', outline: 'none', transform: isActive ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 0 14px rgba(139, 92, 246, 0.4)' : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* Custom Hex Color Picker */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Custom Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', background: 'none',
                  }}
                />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>
                  {color.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. MATERIAL TAB */}
        {activeTab === 'material' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '10px' }}>
                Surface Materials & Textures
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {materials.map((mat) => {
                  const meta = materialMeta[mat] || { icon: '📦', desc: mat, gradient: '#444' };
                  const isActive = materialType === mat;
                  return (
                    <button
                      key={mat}
                      onClick={() => onMaterialChange(mat)}
                      className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '12px 8px', gap: '6px', textAlign: 'center',
                      }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: meta.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '15px',
                      }}>
                        {meta.icon}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{mat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PBR Surface Finetuning */}
            <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '10px' }}>
                PBR Surface Fine-Tuning
              </span>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Roughness (Gloss ↔ Matte)</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{(materialOverrides?.roughness ?? 0.65).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={materialOverrides?.roughness ?? 0.65}
                  onChange={(e) => onMaterialOverridesChange({ ...materialOverrides, roughness: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Metalness (Dielectric ↔ Metallic)</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{(materialOverrides?.metalness ?? 0.1).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={materialOverrides?.metalness ?? 0.1}
                  onChange={(e) => onMaterialOverridesChange({ ...materialOverrides, metalness: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. ACCESSORIES TAB */}
        {activeTab === 'accessories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
                Modular Furniture Accessories
              </span>

              {/* SOFA ACCESSORIES */}
              {isSofa && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Decorative Cushions</span>
                    <button
                      onClick={() => updateAccessory('cushions', !accessories.cushions)}
                      className={`btn ${accessories.cushions ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.cushions ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  {accessories.cushions && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Cushion Color:</span>
                      {['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#f8fafc'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateAccessory('cushionColor', c)}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c,
                            border: accessories.cushionColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Draped Throw Blanket</span>
                    <button
                      onClick={() => updateAccessory('throwBlanket', !accessories.throwBlanket)}
                      className={`btn ${accessories.throwBlanket ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.throwBlanket ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  {accessories.throwBlanket && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Throw Color:</span>
                      {['#e2e8f0', '#b45309', '#1e293b', '#8b5cf6', '#047857'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateAccessory('throwColor', c)}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c,
                            border: accessories.throwColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BED ACCESSORIES */}
              {isBed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Bedsheet */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Fitted Bedsheet</span>
                    <button
                      onClick={() => updateAccessory('bedsheet', !accessories.bedsheet)}
                      className={`btn ${accessories.bedsheet ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.bedsheet ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  {accessories.bedsheet && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Sheet Color:</span>
                      {['#ffffff', '#cbd5e1', '#fef08a', '#bbf7d0', '#bae6fd'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateAccessory('bedsheetColor', c)}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c,
                            border: accessories.bedsheetColor === c ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Folded Blanket / Duvet */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Duvet Comforter</span>
                    <button
                      onClick={() => updateAccessory('blanket', !accessories.blanket)}
                      className={`btn ${accessories.blanket ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.blanket ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  {accessories.blanket && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Blanket Color:</span>
                      {['#8b5cf6', '#1e293b', '#b91c1c', '#047857', '#d97706'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateAccessory('blanketColor', c)}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c,
                            border: accessories.blanketColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pillows */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Plush Sleeping Pillows</span>
                    <button
                      onClick={() => updateAccessory('pillows', !accessories.pillows)}
                      className={`btn ${accessories.pillows ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.pillows ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  {accessories.pillows && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Pillow Cover:</span>
                      {['#f59e0b', '#ffffff', '#06b6d4', '#ec4899', '#334155'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateAccessory('pillowColor', c)}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c,
                            border: accessories.pillowColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ARMCHAIR ACCESSORIES */}
              {isArmchair && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Lumbar Accent Pillow</span>
                    <button
                      onClick={() => updateAccessory('lumbarPillow', !accessories.lumbarPillow)}
                      className={`btn ${accessories.lumbarPillow ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.lumbarPillow ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              )}

              {/* DINING TABLE ACCESSORIES */}
              {isTable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Linen Table Runner</span>
                    <button
                      onClick={() => updateAccessory('tableRunner', !accessories.tableRunner)}
                      className={`btn ${accessories.tableRunner ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.tableRunner ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Ceramic Vase & Plant</span>
                    <button
                      onClick={() => updateAccessory('centerpieceVase', !accessories.centerpieceVase)}
                      className={`btn ${accessories.centerpieceVase ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.centerpieceVase ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              )}

              {/* COFFEE TABLE ACCESSORIES */}
              {isCoffeeTable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Art Books & Coffee Mug</span>
                    <button
                      onClick={() => updateAccessory('artBooks', !accessories.artBooks)}
                      className={`btn ${accessories.artBooks ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.artBooks ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Designer Area Rug</span>
                    <button
                      onClick={() => updateAccessory('designerRug', !accessories.designerRug)}
                      className={`btn ${accessories.designerRug ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.designerRug ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              )}

              {/* OFFICE CHAIR ACCESSORIES */}
              {isOfficeChair && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Ergonomic Headrest</span>
                    <button
                      onClick={() => updateAccessory('headrest', !accessories.headrest)}
                      className={`btn ${accessories.headrest ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.headrest ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Contoured Lumbar Pad</span>
                    <button
                      onClick={() => updateAccessory('lumbarPad', !accessories.lumbarPad)}
                      className={`btn ${accessories.lumbarPad ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.lumbarPad ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              )}

              {/* DINING CHAIR ACCESSORIES */}
              {isDiningChair && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Padded Seat Cushion</span>
                    <button
                      onClick={() => updateAccessory('seatPad', !accessories.seatPad)}
                      className={`btn ${accessories.seatPad ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.seatPad ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              )}

              {/* WARDROBE ACCESSORIES */}
              {isWardrobe && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Wardrobe Doors State</span>
                    <button
                      onClick={() => updateAccessory('doorsOpen', !accessories.doorsOpen)}
                      className={`btn ${accessories.doorsOpen ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.doorsOpen ? 'Doors Open 🚪' : 'Doors Closed 🔒'}
                    </button>
                  </div>
                </div>
              )}

              {/* STUDY DESK ACCESSORIES */}
              {isDesk && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Study Task Lamp</span>
                    <button
                      onClick={() => updateAccessory('studyLamp', !accessories.studyLamp)}
                      className={`btn ${accessories.studyLamp ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.studyLamp ? 'Equipped 💡' : 'None'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Open Laptop</span>
                    <button
                      onClick={() => updateAccessory('laptop', !accessories.laptop)}
                      className={`btn ${accessories.laptop ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.laptop ? 'Equipped 💻' : 'None'}
                    </button>
                  </div>
                </div>
              )}

              {/* TV CABINET ACCESSORIES */}
              {isTvCabinet && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>55" Ultra-Slim OLED TV</span>
                    <button
                      onClick={() => updateAccessory('flatScreenTv', !accessories.flatScreenTv)}
                      className={`btn ${accessories.flatScreenTv ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.flatScreenTv ? 'Mounted 📺' : 'None'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>Stereo Soundbar</span>
                    <button
                      onClick={() => updateAccessory('soundbar', !accessories.soundbar)}
                      className={`btn ${accessories.soundbar ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      {accessories.soundbar ? 'Equipped 🔊' : 'None'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 4. CONFIGURATION TAB */}
        {activeTab === 'config' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease-out' }}>
            {Object.keys(configurations).length > 0 ? (
              <div style={{ padding: '12px', background: 'var(--color-surface-card)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
                  Furniture Structural Configuration
                </span>
                {Object.entries(configurations).map(([key, configData]) => (
                  <div key={key} style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                      {configData.label}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {configData.options.map((option) => {
                        const isActive = (config[key] || configData.default) === option;
                        return (
                          <button
                            key={option}
                            onClick={() => onConfigChange({ ...config, [key]: option })}
                            className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '8px 14px', fontSize: '11px' }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                Standard single-body configuration for this piece.
              </div>
            )}
          </div>
        )}

        {/* 5. TRANSFORMATIONS TAB */}
        {activeTab === 'transform' && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <TransformControls
              transforms={transforms}
              onTransformsChange={onTransformsChange}
            />
          </div>
        )}

        {/* 6. LIGHTING TAB */}
        {activeTab === 'lighting' && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <LightingControls
              lightPreset={lightPreset}
              onLightPresetChange={onLightPresetChange}
              lightIntensity={lightIntensity}
              onLightIntensityChange={onLightIntensityChange}
              floorStyle={floorStyle}
              onFloorStyleChange={onFloorStyleChange}
              contactShadowsEnabled={contactShadowsEnabled}
              onContactShadowsChange={onContactShadowsChange}
            />
          </div>
        )}

        {/* 7. ANIMATION TAB */}
        {activeTab === 'animation' && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <AnimationControls
              activeTransition={activeTransition}
              onTriggerTransition={onTriggerTransition}
              autoRotate={autoRotate}
              onAutoRotateChange={onAutoRotateChange}
              autoRotateSpeed={autoRotateSpeed}
              onAutoRotateSpeedChange={onAutoRotateSpeedChange}
              onCameraPreset={onCameraPreset}
            />
          </div>
        )}

      </div>

      {/* ─── FOOTER RESET ACTION ─── */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <button
          onClick={onResetAll}
          className="btn btn-ghost"
          style={{ width: '100%', padding: '10px', fontSize: '11px', color: 'var(--color-text-muted)' }}
        >
          🔄 Reset All Customizations
        </button>
      </div>
    </div>
  );
}
