import { Suspense, useMemo } from 'react';
import ModelLoader from './models/ModelLoader';
import { Html } from '@react-three/drei';

// URL dictionary for all 10 furniture models
const modelUrlMap = {
  // Sofa
  'Modern Luxury Sofa': '/models/sofa.glb',
  'Comfortable Sofa': '/models/sofa.glb',
  'Sofa': '/models/sofa.glb',

  // Armchair
  'Nordic Accent Armchair': '/models/armchair.glb',
  'Armchair': '/models/armchair.glb',

  // Dining Table
  'Architectural Dining Table': '/models/dining-table.glb',
  'Dining Table': '/models/dining-table.glb',
  'Table': '/models/dining-table.glb',

  // Coffee Table
  'Floating Tier Coffee Table': '/models/coffee-table.glb',
  'Coffee Table': '/models/coffee-table.glb',

  // Bed
  'Grand Fluted Platform Bed': '/models/bed.glb',
  'Queen Bed': '/models/bed.glb',
  'Bed': '/models/bed.glb',

  // Office Chair
  'Executive Ergonomic Chair': '/models/office-chair.glb',
  'Office Chair': '/models/office-chair.glb',

  // Dining Chair
  'Scandinavian Dining Chair': '/models/dining-chair.glb',
  'Modern Chair': '/models/dining-chair.glb',
  'Dining Chair': '/models/dining-chair.glb',
  'Chair': '/models/dining-chair.glb',

  // Wardrobe
  'Modernist Armoire Wardrobe': '/models/wardrobe.glb',
  'Wardrobe': '/models/wardrobe.glb',

  // Study Desk
  'Executive Workstation Desk': '/models/study-desk.glb',
  'Study Desk': '/models/study-desk.glb',
  'Desk': '/models/study-desk.glb',

  // TV Cabinet
  'Fluted Media TV Console': '/models/tv-cabinet.glb',
  'TV Cabinet': '/models/tv-cabinet.glb',
  'Cabinet': '/models/tv-cabinet.glb',
};

function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '12px 20px', borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)', color: '#f1f5f9',
        fontSize: '12px', fontWeight: 600, gap: '8px',
      }}>
        <div style={{
          width: '24px', height: '24px',
          border: '2.5px solid rgba(139, 92, 246, 0.2)',
          borderTopColor: '#8b5cf6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span>Loading 3D Model...</span>
      </div>
    </Html>
  );
}

export default function FurnitureModel({
  furnitureName,
  color,
  materialType,
  accessories = {},
  config = {},
  materialOverrides = {},
}) {
  const modelUrl = useMemo(() => {
    return modelUrlMap[furnitureName] || '/models/sofa.glb';
  }, [furnitureName]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModelLoader
        modelUrl={modelUrl}
        color={color}
        materialType={materialType}
        accessories={accessories}
        config={config}
        materialOverrides={materialOverrides}
      />
    </Suspense>
  );
}
