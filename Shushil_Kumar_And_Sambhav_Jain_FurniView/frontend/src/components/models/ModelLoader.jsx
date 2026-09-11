import { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getMaterialProperties } from '../../utils/materials';

/**
 * Universal GLB Model Loader with PBR Material injection,
 * accessory toggles, custom color tinting, and animated doors.
 */
export default function ModelLoader({
  modelUrl,
  color,
  materialType,
  accessories = {},
  config = {},
  materialOverrides = {},
}) {
  const gltf = useGLTF(modelUrl);

  // Clone scene so multiple instances or changes don't cross-contaminate
  const scene = useMemo(() => {
    return gltf.scene.clone(true);
  }, [gltf.scene]);

  // Generate primary PBR material
  const primaryMaterial = useMemo(() => {
    const props = getMaterialProperties(materialType, color, materialOverrides);
    return new THREE.MeshStandardMaterial({
      ...props,
      side: THREE.DoubleSide,
    });
  }, [materialType, color, materialOverrides]);

  // Generate secondary accent materials for accessories
  const cushionMaterial = useMemo(() => {
    const c = accessories.cushionColor || '#f59e0b';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.cushionColor]);

  const throwMaterial = useMemo(() => {
    const c = accessories.throwColor || '#e2e8f0';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.throwColor]);

  const bedsheetMaterial = useMemo(() => {
    const c = accessories.bedsheetColor || '#ffffff';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.bedsheetColor]);

  const blanketMaterial = useMemo(() => {
    const c = accessories.blanketColor || '#8b5cf6';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.blanketColor]);

  const pillowMaterial = useMemo(() => {
    const c = accessories.pillowColor || '#f59e0b';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.pillowColor]);

  const runnerMaterial = useMemo(() => {
    const c = accessories.runnerColor || '#e2e8f0';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.runnerColor]);

  const rugMaterial = useMemo(() => {
    const c = accessories.rugColor || '#1e293b';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.rugColor]);

  const padMaterial = useMemo(() => {
    const c = accessories.padColor || '#3b82f6';
    const props = getMaterialProperties('Fabric', c);
    return new THREE.MeshStandardMaterial({ ...props, side: THREE.DoubleSide });
  }, [accessories.padColor]);

  // Apply materials and accessories state across the scene hierarchy
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name || '';

        // ACCESSORY TOGGLES & CUSTOM MATERIALS
        if (name.includes('accessory_cushion')) {
          child.visible = accessories.cushions !== false;
          child.material = cushionMaterial;
        } else if (name.includes('accessory_throw')) {
          child.visible = accessories.throwBlanket !== false;
          child.material = throwMaterial;
        } else if (name.includes('accessory_lumbar')) {
          child.visible = accessories.lumbarPillow !== false && accessories.lumbarPad !== false;
          child.material = pillowMaterial;
        } else if (name.includes('accessory_headrest')) {
          child.visible = accessories.headrest !== false;
          child.material = primaryMaterial;
        } else if (name.includes('accessory_bedsheet')) {
          child.visible = accessories.bedsheet !== false;
          child.material = bedsheetMaterial;
        } else if (name.includes('accessory_blanket')) {
          child.visible = accessories.blanket !== false;
          child.material = blanketMaterial;
        } else if (name.includes('accessory_pillow')) {
          child.visible = accessories.pillows !== false;
          child.material = pillowMaterial;
        } else if (name.includes('accessory_runner')) {
          child.visible = accessories.tableRunner !== false;
          child.material = runnerMaterial;
        } else if (name.includes('accessory_vase') || name.includes('accessory_plant')) {
          child.visible = accessories.centerpieceVase !== false;
        } else if (name.includes('accessory_book') || name.includes('accessory_mug')) {
          child.visible = accessories.artBooks !== false;
        } else if (name.includes('accessory_rug')) {
          child.visible = accessories.designerRug !== false;
          child.material = rugMaterial;
        } else if (name.includes('accessory_seat_pad')) {
          child.visible = accessories.seatPad !== false;
          child.material = padMaterial;
        } else if (name.includes('accessory_lamp')) {
          child.visible = accessories.studyLamp !== false;
        } else if (name.includes('accessory_laptop')) {
          child.visible = accessories.laptop !== false;
        } else if (name.includes('accessory_tv')) {
          child.visible = accessories.flatScreenTv !== false;
        } else if (name.includes('accessory_soundbar')) {
          child.visible = accessories.soundbar !== false;
        } else if (name.includes('accessory_door_left')) {
          // Wardrobe or cabinet doors open/close rotation
          child.rotation.y = accessories.doorsOpen ? 1.4 : 0;
          child.material = primaryMaterial;
        } else if (name.includes('accessory_door_right')) {
          child.rotation.y = accessories.doorsOpen ? -1.4 : 0;
          child.material = primaryMaterial;
        } else if (name.includes('leg') || name.includes('ferrule') || name.includes('pull')) {
          // Keep metal/brass/wood accents distinct if present
        } else {
          // Primary body meshes
          child.material = primaryMaterial;
        }
      }
    });
  }, [
    scene,
    primaryMaterial,
    cushionMaterial,
    throwMaterial,
    bedsheetMaterial,
    blanketMaterial,
    pillowMaterial,
    runnerMaterial,
    rugMaterial,
    padMaterial,
    accessories,
  ]);

  return <primitive object={scene} />;
}
