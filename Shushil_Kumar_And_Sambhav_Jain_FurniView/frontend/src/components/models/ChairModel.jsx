import { useMemo } from 'react';
import * as THREE from 'three';

function ChairModel({ color = '#8B4513', materialType = 'Wood', config = {} }) {
  const legStyle = config.legStyle || 'Tapered';

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

  const legPositions = [
    [-0.35, -0.45, -0.35],
    [0.35, -0.45, -0.35],
    [-0.35, -0.45, 0.35],
    [0.35, -0.45, 0.35],
  ];

  const getLegGeometry = () => {
    switch (legStyle) {
      case 'Straight':
        return <boxGeometry args={[0.06, 0.5, 0.06]} />;
      case 'Cross':
        return <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />;
      default: // Tapered
        return <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />;
    }
  };

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.08, 0.8]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.5, -0.36]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.85, 0.06]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Backrest support bars */}
      <mesh position={[-0.25, 0.35, -0.36]} castShadow>
        <boxGeometry args={[0.04, 0.55, 0.04]} />
        <meshStandardMaterial {...materialProps} roughness={materialProps.roughness + 0.1} />
      </mesh>
      <mesh position={[0.25, 0.35, -0.36]} castShadow>
        <boxGeometry args={[0.04, 0.55, 0.04]} />
        <meshStandardMaterial {...materialProps} roughness={materialProps.roughness + 0.1} />
      </mesh>

      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          {getLegGeometry()}
          <meshStandardMaterial {...materialProps} color={new THREE.Color(color).multiplyScalar(0.85)} />
        </mesh>
      ))}

      {/* Cross bars for 'Cross' leg style */}
      {legStyle === 'Cross' && (
        <>
          <mesh position={[0, -0.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[1.0, 0.04, 0.04]} />
            <meshStandardMaterial {...materialProps} color={new THREE.Color(color).multiplyScalar(0.8)} />
          </mesh>
          <mesh position={[0, -0.55, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[1.0, 0.04, 0.04]} />
            <meshStandardMaterial {...materialProps} color={new THREE.Color(color).multiplyScalar(0.8)} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default ChairModel;
