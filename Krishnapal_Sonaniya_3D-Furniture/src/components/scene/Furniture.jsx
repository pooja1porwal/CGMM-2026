import { useMemo, useRef } from "react";
// import { Edges, TransformControls } from "@react-three/drei";
import { Edges, RoundedBox, TransformControls } from "@react-three/drei";
import { MATERIALS } from "../../data/furniture";

function Material({ color, kind }) {
  return <meshStandardMaterial color={color} {...MATERIALS[kind]} />;
}

function Sofa({ color, material }) {
  return (
    <group>
      {/* =========================
          MAIN SOFA BASE
          ========================= */}
      <RoundedBox
        castShadow
        receiveShadow
        args={[2.45, 0.34, 0.92]}
        radius={0.12}
        smoothness={5}
        position={[0, 0.42, 0]}
      >
        <Material color={color} kind={material} />
      </RoundedBox>

      {/* =========================
          SEAT CUSHIONS
          ========================= */}
      {[-0.78, 0, 0.78].map((x) => (
        <RoundedBox
          key={`seat-${x}`}
          castShadow
          receiveShadow
          args={[0.72, 0.22, 0.72]}
          radius={0.09}
          smoothness={5}
          position={[x, 0.66, -0.02]}
        >
          <Material color={color} kind={material} />
        </RoundedBox>
      ))}

      {/* =========================
          BACK CUSHIONS
          ========================= */}
      {[-0.78, 0, 0.78].map((x) => (
        <RoundedBox
          key={`back-${x}`}
          castShadow
          args={[0.72, 0.62, 0.18]}
          radius={0.09}
          smoothness={5}
          position={[x, 1.02, 0.3]}
        >
          <Material color={color} kind={material} />
        </RoundedBox>
      ))}

      {/* =========================
          LEFT ARM
          ========================= */}
      <RoundedBox
        castShadow
        receiveShadow
        args={[0.22, 0.62, 0.94]}
        radius={0.1}
        smoothness={5}
        position={[-1.12, 0.76, 0]}
        rotation={[0, 0, -0.08]}
      >
        <Material color={color} kind={material} />
      </RoundedBox>

      {/* =========================
          RIGHT ARM
          ========================= */}
      <RoundedBox
        castShadow
        receiveShadow
        args={[0.22, 0.62, 0.94]}
        radius={0.1}
        smoothness={5}
        position={[1.12, 0.76, 0]}
        rotation={[0, 0, 0.08]}
      >
        <Material color={color} kind={material} />
      </RoundedBox>

      {/* =========================
          LOWER FRONT APRON
          ========================= */}
      <RoundedBox
        castShadow
        args={[2.15, 0.18, 0.82]}
        radius={0.06}
        smoothness={4}
        position={[0, 0.28, 0]}
      >
        <Material color={color} kind={material} />
      </RoundedBox>

      {/* =========================
          BACK SUPPORT
          ========================= */}
      <RoundedBox
        castShadow
        args={[2.15, 0.22, 0.22]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.93, 0.34]}
      >
        <Material color={color} kind={material} />
      </RoundedBox>

      {/* =========================
          DARK TAPERED LEGS
          ========================= */}
      {[-0.92, 0.92].map((x) =>
        [-0.31, 0.31].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 0.12, z]}>
            <coneGeometry args={[0.045, 0.32, 10]} />
            <Material color="#292521" kind="Metal" />
          </mesh>
        )),
      )}
    </group>
  );
}
function Chair({ color, material }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[0.72, 0.14, 0.72]} />
        <Material color={color} kind={material} />
      </mesh>
      <mesh castShadow position={[0, 1.17, 0.29]}>
        <boxGeometry args={[0.72, 0.85, 0.13]} />
        <Material color={color} kind={material} />
      </mesh>
      {[-0.28, 0.28].map((x) =>
        [-0.28, 0.28].map((z) => (
          <mesh key={`${x}${z}`} castShadow position={[x, 0.35, z]}>
            <cylinderGeometry args={[0.045, 0.045, 0.7, 10]} />
            <Material color="#3f3028" kind="Wood" />
          </mesh>
        )),
      )}
    </group>
  );
}
function Table({ color, material }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[1.4, 0.14, 0.92]} />
        <Material color={color} kind={material} />
      </mesh>
      {[-0.58, 0.58].map((x) =>
        [-0.34, 0.34].map((z) => (
          <mesh key={`${x}${z}`} castShadow position={[x, 0.44, z]}>
            <cylinderGeometry args={[0.055, 0.055, 0.88, 12]} />
            <Material color={color} kind={material} />
          </mesh>
        )),
      )}
    </group>
  );
}
function Bed({ color, material }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.45, 0.35, 2.05]} />
        <Material color="#59433b" kind="Wood" />
      </mesh>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.36, 0.2, 1.92]} />
        <Material color={color} kind={material} />
      </mesh>
      <mesh castShadow position={[0, 0.79, -0.62]}>
        <boxGeometry args={[1.15, 0.14, 0.52]} />
        <Material color="#eee4d2" kind="Fabric" />
      </mesh>
      <mesh castShadow position={[0, 1.02, 0.92]}>
        <boxGeometry args={[1.45, 1.1, 0.13]} />
        <Material color="#59433b" kind="Wood" />
      </mesh>
    </group>
  );
}
function Cabinet({ color, material }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[1.05, 1.7, 0.48]} />
        <Material color={color} kind={material} />
      </mesh>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} castShadow position={[x, 0.85, 0.252]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <Material color="#d5b16b" kind="Metal" />
        </mesh>
      ))}
    </group>
  );
}
function Lamp({ color, material }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.1, 20]} />
        <Material color={color} kind={material} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.35, 12]} />
        <Material color={color} kind={material} />
      </mesh>
      <mesh castShadow position={[0, 1.58, 0]}>
        <coneGeometry args={[0.42, 0.42, 24, 1, true]} />
        <Material color="#e9d2a2" kind="Fabric" />
      </mesh>
      <pointLight
        color="#ffd99b"
        intensity={0.35}
        distance={2.5}
        position={[0, 1.4, 0]}
      />
    </group>
  );
}
function TV({ color, material }) {
  return (
    <group>
      {/* TV screen / body */}
      <RoundedBox
        castShadow
        receiveShadow
        args={[1.9, 1.08, 0.08]}
        radius={0.035}
        smoothness={4}
        position={[0, 1.15, 0]}
      >
        <Material color="#090909" kind="Plastic" />
      </RoundedBox>

      {/* Actual screen */}
      <mesh position={[0, 1.15, -0.046]}>
        <boxGeometry args={[1.72, 0.9, 0.012]} />
        <meshStandardMaterial
          color={color}
          roughness={0.12}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Bottom bezel */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.9, 0.055, 0.09]} />
        <Material color="#090909" kind="Plastic" />
      </mesh>

      {/* Wall mount / rear support */}
      <mesh position={[0, 0.54, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <Material color="#222222" kind="Metal" />
      </mesh>

      {/* Small indicator */}
      <mesh position={[0.78, 0.59, -0.05]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshStandardMaterial
          color="#8FD3FF"
          emissive="#8FD3FF"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
const models = {
  sofa: Sofa,
  chair: Chair,
  table: Table,
  bed: Bed,
  cabinet: Cabinet,
  lamp: Lamp,
  tv: TV,
};

export default function Furniture({
  item,
  selected,
  onSelect,
  onUpdate,
  transformMode,
}) {
  const Component = models[item.type] || Table;
  const ref = useRef();
  const props = useMemo(
    () => ({ color: item.color, material: item.material }),
    [item.color, item.material],
  );
  const syncTransform = () =>
    onUpdate?.(item.id, {
      position: ref.current.position.toArray(),
      rotation: [
        ref.current.rotation.x,
        ref.current.rotation.y,
        ref.current.rotation.z,
      ],
      scale: ref.current.scale.toArray(),
    });
  return (
    <>
      <group
        ref={ref}
        position={item.position}
        rotation={item.rotation}
        scale={item.scale}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item.id);
        }}
      >
        <Component {...props} />
        {selected && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.35, 2.35]} />
            <meshBasicMaterial color="#76c6dc" transparent opacity={0.11} />
            <Edges color="#76c6dc" />
          </mesh>
        )}
      </group>
      {selected && (
        <TransformControls
          object={ref}
          mode={transformMode}
          onMouseUp={syncTransform}
        />
      )}
    </>
  );
}
