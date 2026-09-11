import { useMemo } from 'react';
import * as THREE from 'three';

function BedModel({ color = '#8B4513', materialType = 'Wood', config = {} }) {
  const headboard = config.headboard || 'Flat';

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

  const frameColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.8), [color]);
  const mattressColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.lerp(new THREE.Color('#FFFFFF'), 0.6);
    return c;
  }, [color]);

  return (
    <group>
      {/* Bed Frame */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.18, 2.2]} />
        <meshStandardMaterial {...materialProps} color={frameColor} />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.06, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.22, 2.0]} />
        <meshStandardMaterial color={mattressColor} roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Pillow Left */}
      <mesh position={[-0.35, 0.22, -0.75]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Pillow Right */}
      <mesh position={[0.35, 0.22, -0.75]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Headboard */}
      {headboard === 'Flat' ? (
        <mesh position={[0, 0.35, -1.05]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.8, 0.08]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ) : (
        /* Curved headboard - approximated with a wider box with rounded appearance */
        <group position={[0, 0.35, -1.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.65, 0.65, 0.08]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Curved top */}
          <mesh position={[0, 0.37, 0]} castShadow>
            <cylinderGeometry args={[0.82, 0.82, 0.08, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>
      )}

      {/* Footboard (smaller) */}
      <mesh position={[0, 0.05, 1.05]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.3, 0.08]} />
        <meshStandardMaterial {...materialProps} color={frameColor} />
      </mesh>

      {/* Legs */}
      {[
        [-0.72, -0.35, -1.0],
        [0.72, -0.35, -1.0],
        [-0.72, -0.35, 1.0],
        [0.72, -0.35, 1.0],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.2, 8]} />
          <meshStandardMaterial {...materialProps} color={frameColor} />
        </mesh>
      ))}
    </group>
  );
}

export default BedModel;
