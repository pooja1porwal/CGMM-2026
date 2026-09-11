import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import FurnitureModel from './FurnitureModel';
import { computeAffineMatrix } from './TransformControls';
import { LIGHTING_PRESETS, FLOOR_STYLES } from './LightingControls';

/**
 * Animated 3D Scene containing the furniture group,
 * camera transitions, lighting, and floor.
 */
function Scene({
  furnitureName,
  color,
  materialType,
  accessories,
  config,
  materialOverrides,
  transforms,
  lightPreset = 'studio',
  lightIntensity = 1.0,
  floorStyle = 'concrete',
  contactShadowsEnabled = true,
  autoRotate = false,
  autoRotateSpeed = 2.0,
  activeTransition = null,
  onTransitionEnd = () => {},
  cameraTargetPos = null,
}) {
  const controlsRef = useRef();
  const modelGroupRef = useRef();
  const transitionProgress = useRef(0);
  const transitionActiveRef = useRef(null);

  const preset = LIGHTING_PRESETS[lightPreset] || LIGHTING_PRESETS.studio;
  const currentFloor = FLOOR_STYLES.find((f) => f.id === floorStyle) || FLOOR_STYLES[2];

  // Base 4x4 Transformation Matrix from Affine Controls (T, R, S, Ref, Shear)
  const affineMatrix = useMemo(() => {
    return computeAffineMatrix(transforms);
  }, [transforms]);

  // When activeTransition changes, trigger animation loop
  useEffect(() => {
    if (activeTransition) {
      transitionProgress.current = 0;
      transitionActiveRef.current = activeTransition;
    }
  }, [activeTransition]);

  // Render frame loop for CG animation transitions and smooth camera movement
  useFrame((state, delta) => {
    // 1. Smooth Camera Movement to Target Preset
    if (cameraTargetPos && controlsRef.current) {
      state.camera.position.lerp(new THREE.Vector3(...cameraTargetPos), 0.08);
      controlsRef.current.update();
    }

    if (!modelGroupRef.current) return;

    // Apply the 4x4 Affine Transformation Matrix
    modelGroupRef.current.matrixAutoUpdate = false;
    const currentMat = affineMatrix.clone();

    // 2. Multimedia / CG Transition Animations
    if (transitionActiveRef.current) {
      transitionProgress.current += delta * 1.5;
      const t = Math.min(1.0, transitionProgress.current);

      switch (transitionActiveRef.current) {
        case 'fade': {
          // Fade opacity transition on materials
          modelGroupRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.transparent = true;
              child.material.opacity = Math.sin(t * Math.PI * 0.5);
            }
          });
          break;
        }

        case 'slide': {
          // Slide in from left with cubic ease out
          const slideX = (1 - Math.pow(1 - t, 3)) * 0;
          const startX = -2.5 * (1 - t);
          const slideMat = new THREE.Matrix4().makeTranslation(startX, 0, 0);
          currentMat.premultiply(slideMat);
          break;
        }

        case 'zoom': {
          // Camera focal punch zoom
          const pulse = 1 + Math.sin(t * Math.PI) * 0.25;
          const scaleMat = new THREE.Matrix4().makeScale(pulse, pulse, pulse);
          currentMat.premultiply(scaleMat);
          break;
        }

        case 'rotation': {
          // 360-degree spin
          const spinAngle = t * Math.PI * 2;
          const rotMat = new THREE.Matrix4().makeRotationY(spinAngle);
          currentMat.premultiply(rotMat);
          break;
        }

        case 'scale': {
          // Elastic bounce scale pop-in
          // Elastic curve: 1 + 2^(-10*t) * sin((t - 0.1) * (2*pi)/0.4)
          const bounce = t >= 1 ? 1 : 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.075) * ((2 * Math.PI) / 0.3));
          const bounceMat = new THREE.Matrix4().makeScale(bounce, bounce, bounce);
          currentMat.premultiply(bounceMat);
          break;
        }

        case 'appear': {
          // Dissolve appear / disappear
          const scaleVal = Math.sin(t * Math.PI * 0.5);
          const appearMat = new THREE.Matrix4().makeScale(scaleVal, scaleVal, scaleVal);
          currentMat.premultiply(appearMat);
          modelGroupRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.transparent = true;
              child.material.opacity = scaleVal;
            }
          });
          break;
        }

        default:
          break;
      }

      if (t >= 1.0) {
        transitionActiveRef.current = null;
        onTransitionEnd();
      }
    }

    modelGroupRef.current.matrix.copy(currentMat);
  });

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.2}
        maxDistance={9.0}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minPolarAngle={0.15}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />

      {/* Environment lighting map for realistic PBR reflections */}
      <Environment preset={preset.envPreset} />

      {/* Ambient Fill */}
      <ambientLight
        color={preset.ambientColor}
        intensity={preset.ambientIntensity * lightIntensity}
      />

      {/* Key Directional Light with Shadows */}
      <directionalLight
        position={[4.5, 7.5, 4.5]}
        intensity={preset.keyIntensity * lightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
        color={preset.keyColor}
      />

      {/* Fill Light */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={preset.fillIntensity * lightIntensity}
        color={preset.fillColor}
      />

      {/* Accent Overhead Spot Light */}
      <spotLight
        position={[0, 6, 0]}
        intensity={0.4 * lightIntensity}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Floor Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.66, 0]}
        receiveShadow
      >
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color={currentFloor.color}
          roughness={currentFloor.roughness}
          metalness={0.08}
        />
      </mesh>

      {/* Subtle floor grid lines for spatial reference */}
      <gridHelper
        args={[10, 20, '#3b4252', '#1e2538']}
        position={[0, -0.655, 0]}
      />

      {/* Realistic Soft Contact Shadows */}
      {contactShadowsEnabled && (
        <ContactShadows
          position={[0, -0.65, 0]}
          opacity={0.6}
          scale={7}
          blur={2.2}
          far={3}
          color="#050811"
        />
      )}

      {/* Furniture Model Group with 4x4 Matrix Transform */}
      <group ref={modelGroupRef}>
        <FurnitureModel
          furnitureName={furnitureName}
          color={color}
          materialType={materialType}
          accessories={accessories}
          config={config}
          materialOverrides={materialOverrides}
        />
      </group>
    </>
  );
}

export default function FurnitureViewer({
  furnitureName,
  color,
  materialType,
  accessories,
  config,
  materialOverrides,
  transforms,
  lightPreset,
  lightIntensity,
  floorStyle,
  contactShadowsEnabled,
  autoRotate,
  autoRotateSpeed,
  activeTransition,
  onTransitionEnd,
  cameraTargetPos,
}) {
  return (
    <div className="canvas-container w-full h-full" style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [3, 2.3, 3], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{
          background: 'radial-gradient(circle at 50% 35%, var(--canvas-bg-center), var(--canvas-bg-edge))',
        }}
      >
        <Scene
          furnitureName={furnitureName}
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
          onTransitionEnd={onTransitionEnd}
          cameraTargetPos={cameraTargetPos}
        />
      </Canvas>
    </div>
  );
}
