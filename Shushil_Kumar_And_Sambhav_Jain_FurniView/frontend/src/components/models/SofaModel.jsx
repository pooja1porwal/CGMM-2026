import { useMemo } from 'react';
import * as THREE from 'three';

function SofaModel({ color = '#808080', materialType = 'Fabric', config = {} }) {
  const seating = config.seating || '3-Seat';
  const is3Seat = seating === '3-Seat';
  const sofaWidth = is3Seat ? 2.4 : 1.6;

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

  const darkerColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.75), [color]);
  const cushionCount = is3Seat ? 3 : 2;
  const cushionWidth = (sofaWidth - 0.3) / cushionCount;

  return (
    <group>
      {/* Base / Frame */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[sofaWidth, 0.25, 0.9]} />
        <meshStandardMaterial {...materialProps} color={darkerColor} />
      </mesh>

      {/* Seat Cushions */}
      {Array.from({ length: cushionCount }).map((_, i) => {
        const x = -((cushionCount - 1) * cushionWidth) / 2 + i * cushionWidth;
        return (
          <mesh key={`seat-${i}`} position={[x, 0.12, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[cushionWidth - 0.04, 0.18, 0.76]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      })}

      {/* Backrest */}
      <mesh position={[0, 0.45, -0.33]} castShadow receiveShadow>
        <boxGeometry args={[sofaWidth, 0.55, 0.22]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Back Cushions */}
      {Array.from({ length: cushionCount }).map((_, i) => {
        const x = -((cushionCount - 1) * cushionWidth) / 2 + i * cushionWidth;
        return (
          <mesh key={`back-${i}`} position={[x, 0.42, -0.2]} castShadow>
            <boxGeometry args={[cushionWidth - 0.06, 0.42, 0.16]} />
            <meshStandardMaterial {...materialProps} roughness={materialProps.roughness * 0.95} />
          </mesh>
        );
      })}

      {/* Left Armrest */}
      <mesh position={[-(sofaWidth / 2 + 0.06), 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.52, 0.85]} />
        <meshStandardMaterial {...materialProps} color={darkerColor} />
      </mesh>

      {/* Right Armrest */}
      <mesh position={[(sofaWidth / 2 + 0.06), 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.52, 0.85]} />
        <meshStandardMaterial {...materialProps} color={darkerColor} />
      </mesh>

      {/* Feet */}
      {[
        [-(sofaWidth / 2 - 0.15), -0.28, 0.3],
        [(sofaWidth / 2 - 0.15), -0.28, 0.3],
        [-(sofaWidth / 2 - 0.15), -0.28, -0.3],
        [(sofaWidth / 2 - 0.15), -0.28, -0.3],
      ].map((pos, i) => (
        <mesh key={`foot-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default SofaModel;
