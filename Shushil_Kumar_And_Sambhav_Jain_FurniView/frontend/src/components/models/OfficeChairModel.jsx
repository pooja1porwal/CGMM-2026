import { useMemo } from 'react';
import * as THREE from 'three';

function OfficeChairModel({ color = '#1A1A1A', materialType = 'Leather', config = {} }) {
  const armrests = config.armrests || 'With Armrests';
  const hasArmrests = armrests === 'With Armrests';

  const materialProps = useMemo(() => {
    const baseColor = new THREE.Color(color);
    switch (materialType) {
      case 'Leather':
        return { color: baseColor, roughness: 0.6, metalness: 0.2 };
      case 'Fabric':
        return { color: baseColor, roughness: 1.0, metalness: 0.0 };
      case 'Metal':
        return { color: baseColor, roughness: 0.3, metalness: 0.9 };
      case 'Wood':
      default:
        return { color: baseColor, roughness: 0.8, metalness: 0.1 };
    }
  }, [color, materialType]);

  const metalMat = { color: '#3a3a3a', roughness: 0.4, metalness: 0.8 };

  return (
    <group>
      {/* Base - 5-star wheel base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.cos(angle) * 0.35;
        const z = Math.sin(angle) * 0.35;
        return (
          <group key={`base-${i}`}>
            {/* Arm of the base */}
            <mesh position={[x / 2, -0.62, z / 2]} rotation={[0, -angle, 0]} castShadow>
              <boxGeometry args={[0.38, 0.04, 0.06]} />
              <meshStandardMaterial {...metalMat} />
            </mesh>
            {/* Wheel */}
            <mesh position={[x, -0.66, z]} castShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Center stem */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Gas lift cylinder */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.15, 12]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Seat */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.1, 0.5]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.42, -0.22]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.65, 0.06]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Backrest curve / lumbar support */}
      <mesh position={[0, 0.3, -0.18]} castShadow>
        <boxGeometry args={[0.46, 0.15, 0.05]} />
        <meshStandardMaterial {...materialProps} roughness={materialProps.roughness * 0.9} />
      </mesh>

      {/* Armrests */}
      {hasArmrests && (
        <>
          {/* Left armrest */}
          <group>
            <mesh position={[-0.3, 0.12, -0.05]} castShadow>
              <boxGeometry args={[0.04, 0.2, 0.04]} />
              <meshStandardMaterial {...metalMat} />
            </mesh>
            <mesh position={[-0.3, 0.22, -0.05]} castShadow>
              <boxGeometry args={[0.08, 0.03, 0.25]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
          {/* Right armrest */}
          <group>
            <mesh position={[0.3, 0.12, -0.05]} castShadow>
              <boxGeometry args={[0.04, 0.2, 0.04]} />
              <meshStandardMaterial {...metalMat} />
            </mesh>
            <mesh position={[0.3, 0.22, -0.05]} castShadow>
              <boxGeometry args={[0.08, 0.03, 0.25]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}

export default OfficeChairModel;
