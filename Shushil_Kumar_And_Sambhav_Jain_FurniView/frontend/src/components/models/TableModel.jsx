import { useMemo } from 'react';
import * as THREE from 'three';

function TableModel({ color = '#8B4513', materialType = 'Wood', config = {} }) {
  const topShape = config.topShape || 'Rectangular';
  const isRound = topShape === 'Round';

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

  const legColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.8), [color]);

  const legPositions = isRound
    ? [
        [0.35, -0.35, 0],
        [-0.35, -0.35, 0],
        [0, -0.35, 0.35],
        [0, -0.35, -0.35],
      ]
    : [
        [-0.65, -0.35, -0.35],
        [0.65, -0.35, -0.35],
        [-0.65, -0.35, 0.35],
        [0.65, -0.35, 0.35],
      ];

  return (
    <group>
      {/* Table Top */}
      {isRound ? (
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.06, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ) : (
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.8]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )}

      {/* Edge trim (subtle detail) */}
      {isRound ? (
        <mesh position={[0, 0.02, 0]} castShadow>
          <torusGeometry args={[0.7, 0.015, 8, 32]} />
          <meshStandardMaterial {...materialProps} color={legColor} />
        </mesh>
      ) : (
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[1.52, 0.02, 0.82]} />
          <meshStandardMaterial {...materialProps} color={legColor} />
        </mesh>
      )}

      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.65, 8]} />
          <meshStandardMaterial {...materialProps} color={legColor} />
        </mesh>
      ))}

      {/* Cross support bar (rectangular only) */}
      {!isRound && (
        <>
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[1.2, 0.04, 0.04]} />
            <meshStandardMaterial {...materialProps} color={legColor} />
          </mesh>
          <mesh position={[0, -0.45, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[0.55, 0.04, 0.04]} />
            <meshStandardMaterial {...materialProps} color={legColor} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default TableModel;
