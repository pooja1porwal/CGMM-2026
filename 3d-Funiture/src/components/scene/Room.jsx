export default function Room({ shadows }) {
  const shadow = { receiveShadow: shadows }
  return <group>
    <mesh {...shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color="#c8b69f" roughness={.82} /></mesh>
    <mesh {...shadow} position={[0, 2.1, -4]}><planeGeometry args={[10, 4.2]} /><meshStandardMaterial color="#e9e4dc" roughness={.95} /></mesh>
    <mesh {...shadow} rotation={[0, Math.PI / 2, 0]} position={[-5, 2.1, 0]}><planeGeometry args={[8, 4.2]} /><meshStandardMaterial color="#d9e1df" roughness={.95} /></mesh>
    <mesh {...shadow} position={[0, 4.15, 0]} rotation={[Math.PI / 2,0,0]}><planeGeometry args={[10,8]}/><meshStandardMaterial color="#f3f0e9" roughness={1}/></mesh>
    <mesh receiveShadow position={[0,.012,.85]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.8,2.8]}/><meshStandardMaterial color="#8d6654" roughness={.9}/></mesh>
  </group>
}
