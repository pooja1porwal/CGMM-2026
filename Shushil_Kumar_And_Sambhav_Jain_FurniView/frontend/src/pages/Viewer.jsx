import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFurnitureById } from '../services/api';
import { defaultFurnitureList } from '../services/furnitureData';
import FurnitureViewer from '../components/FurnitureViewer';
import CustomizationPanel from '../components/CustomizationPanel';
import { DEFAULT_TRANSFORMS } from '../components/TransformControls';
import ThemeToggle from '../components/ThemeToggle';

export default function Viewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Customization State
  const [color, setColor] = useState('#475569');
  const [materialType, setMaterialType] = useState('Fabric');
  const [materialOverrides, setMaterialOverrides] = useState({ roughness: 0.7, metalness: 0.1 });
  const [accessories, setAccessories] = useState({});
  const [config, setConfig] = useState({});

  // Computer Graphics Affine Transformations State
  const [transforms, setTransforms] = useState(DEFAULT_TRANSFORMS);

  // Lighting & Scene Environment State
  const [lightPreset, setLightPreset] = useState('studio');
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [floorStyle, setFloorStyle] = useState('concrete');
  const [contactShadowsEnabled, setContactShadowsEnabled] = useState(true);

  // Multimedia Animations & Transitions State
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2.0);
  const [activeTransition, setActiveTransition] = useState(null);
  const [cameraTargetPos, setCameraTargetPos] = useState(null);

  // Fetch or resolve furniture
  useEffect(() => {
    const resolveFurniture = async () => {
      // 1. Check local dataset first for instant matching
      const localItem = defaultFurnitureList.find((item) => item._id === id || item.name === id);

      try {
        const { data } = await getFurnitureById(id);
        if (data && data._id) {
          initItem(data, localItem);
          return;
        }
      } catch (err) {
        // Fallback to local
      }

      if (localItem) {
        initItem(localItem, localItem);
      } else {
        // Fallback to first item if ID not found
        initItem(defaultFurnitureList[0], defaultFurnitureList[0]);
      }
      setLoading(false);
    };

    const initItem = (item, fallback) => {
      setFurniture(item);
      setColor(item.colors?.[0] || '#475569');
      setMaterialType(item.materials?.[0] || 'Fabric');

      // Configurations
      if (item.configurations) {
        const dc = {};
        Object.entries(item.configurations).forEach(([k, v]) => {
          dc[k] = v.default || v.options?.[0] || '';
        });
        setConfig(dc);
      }

      // Default accessories
      setAccessories(item.defaultAccessories || fallback?.defaultAccessories || {
        cushions: true,
        throwBlanket: true,
        bedsheet: true,
        blanket: true,
        pillows: true,
        lumbarPillow: true,
        tableRunner: true,
        centerpieceVase: true,
        artBooks: true,
        designerRug: true,
        headrest: true,
        lumbarPad: true,
        seatPad: true,
        doorsOpen: false,
        studyLamp: true,
        laptop: true,
        flatScreenTv: true,
        soundbar: true,
      });

      setLoading(false);
    };

    resolveFurniture();
  }, [id]);

  const handleResetAll = () => {
    if (!furniture) return;
    setColor(furniture.colors?.[0] || '#475569');
    setMaterialType(furniture.materials?.[0] || 'Fabric');
    setMaterialOverrides({ roughness: 0.7, metalness: 0.1 });
    setTransforms(DEFAULT_TRANSFORMS);
    setLightPreset('studio');
    setLightIntensity(1.0);
    setFloorStyle('concrete');
    setContactShadowsEnabled(true);
    setAutoRotate(false);
    setAccessories(furniture.defaultAccessories || {});
    if (furniture.configurations) {
      const dc = {};
      Object.entries(furniture.configurations).forEach(([k, v]) => {
        dc[k] = v.default || v.options?.[0] || '';
      });
      setConfig(dc);
    }
  };

  const handleTriggerTransition = (transitionId) => {
    setActiveTransition(transitionId);
  };

  const handleCameraPreset = (pos) => {
    setCameraTargetPos(pos);
    // Reset target after transition lerp completes
    setTimeout(() => setCameraTargetPos(null), 1000);
  };

  if (loading || !furniture) {
    return (
      <div style={{ height: '100vh', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '42px', height: '42px', border: '3px solid rgba(139,92,246,0.2)',
            borderTopColor: 'var(--color-primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Loading Realistic 3D Model...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ─── TOP BAR ─── */}
      <header id="viewer-topbar" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 24px', background: 'var(--color-surface-light)',
        borderBottom: '1px solid var(--color-border)', flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            ← Collection
          </button>
          <div style={{ height: '18px', width: '1px', background: 'var(--color-border)' }} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {furniture.name}
            </h1>
            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
              {furniture.category} • 3D GLB Studio
            </p>
          </div>
        </div>

        {/* Top bar controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick interaction hints */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '6px', fontSize: '10px', color: 'var(--color-text-muted)' }}>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--color-surface-lighter)', border: '1px solid var(--color-border)' }}>
              🖱 Drag rotate
            </span>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--color-surface-lighter)', border: '1px solid var(--color-border)' }}>
              🔍 Scroll zoom
            </span>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--color-surface-lighter)', border: '1px solid var(--color-border)' }}>
              ✋ Right-click pan
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* ─── MAIN CONTENT: 3D CANVAS + SIDEBAR ─── */}
      <div id="viewer-main" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* 3D Canvas Area */}
        <div id="viewer-canvas" style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <FurnitureViewer
            furnitureName={furniture.name}
            color={color}
            materialType={materialType}
            accessories={accessories}
            config={config}
            materialOverrides={materialOverrides}
            transforms={transforms}
            lightPreset={lightPreset}
            lightIntensity={lightIntensity}
            floorStyle={floorStyle}
            contactShadowsEnabled={contactShadowsEnabled}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            activeTransition={activeTransition}
            onTransitionEnd={() => setActiveTransition(null)}
            cameraTargetPos={cameraTargetPos}
          />

          {/* Quick Status Tag */}
          <div style={{
            position: 'absolute', bottom: '16px', left: '16px',
            background: 'var(--color-surface-card)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--color-border)', borderRadius: '10px',
            padding: '8px 14px', fontSize: '11px', color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
              {materialType}
            </span>
            <span>•</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Scale {transforms.uniformScale.toFixed(1)}x
            </span>
            <span>•</span>
            <span style={{ color: 'var(--color-accent)' }}>
              {lightPreset.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Sidebar Customization Tabs */}
        <div id="viewer-sidebar" style={{
          width: '380px',
          flexShrink: 0,
          background: 'var(--color-surface-light)',
          borderLeft: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}>
          <CustomizationPanel
            furniture={furniture}
            color={color}
            onColorChange={setColor}
            materialType={materialType}
            onMaterialChange={setMaterialType}
            materialOverrides={materialOverrides}
            onMaterialOverridesChange={setMaterialOverrides}
            accessories={accessories}
            onAccessoriesChange={setAccessories}
            config={config}
            onConfigChange={setConfig}
            transforms={transforms}
            onTransformsChange={setTransforms}
            lightPreset={lightPreset}
            onLightPresetChange={setLightPreset}
            lightIntensity={lightIntensity}
            onLightIntensityChange={setLightIntensity}
            floorStyle={floorStyle}
            onFloorStyleChange={setFloorStyle}
            contactShadowsEnabled={contactShadowsEnabled}
            onContactShadowsChange={setContactShadowsEnabled}
            autoRotate={autoRotate}
            onAutoRotateChange={setAutoRotate}
            autoRotateSpeed={autoRotateSpeed}
            onAutoRotateSpeedChange={setAutoRotateSpeed}
            activeTransition={activeTransition}
            onTriggerTransition={handleTriggerTransition}
            onCameraPreset={handleCameraPreset}
            onResetAll={handleResetAll}
          />
        </div>
      </div>
    </div>
  );
}
