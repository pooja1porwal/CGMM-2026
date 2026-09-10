import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import Furniture from './Furniture'
import Room from './Room'

const presets = { Day: { ambient: .65, sun: 2.1, point: .55, bg: '#e9eef0', sunColor: '#fff5de' }, 'Warm Interior': { ambient: .35, sun: .65, point: 1.6, bg: '#252229', sunColor: '#ffcd8b' }, Night: { ambient: .16, sun: .23, point: 1.05, bg: '#131a2d', sunColor: '#93b5ff' } }
function CameraRig({ mode, resetKey, controlsRef }) {
  const { camera } = useThree()
  useEffect(() => { const positions = { Perspective: [7,5.2,7], Top: [0,10,0.01], Front: [0,2.8,10], Side: [10,2.8,0] }; const p = positions[mode]; camera.position.set(...p); controlsRef.current?.target.set(0,.7,-.5); controlsRef.current?.update() }, [mode, resetKey, camera, controlsRef])
  return null
}
function SceneContents(props) {
  const controlsRef = useRef()
  const current = presets[props.lighting]
  return <>
    <color attach="background" args={[current.bg]} />
    <PerspectiveCamera makeDefault={props.cameraMode === 'Perspective'} fov={48} position={[7,5.2,7]} />
    <OrthographicCamera makeDefault={props.cameraMode !== 'Perspective'} zoom={52} position={[0,10,.01]} />
    <CameraRig mode={props.cameraMode} resetKey={props.resetCameraKey} controlsRef={controlsRef} />
    <ambientLight intensity={props.lightsOn ? current.ambient : .12} />
    <directionalLight castShadow={props.lightsOn && props.shadows} intensity={props.lightsOn ? current.sun : 0} color={current.sunColor} position={[3.5,6,2]} shadow-mapSize={[1024,1024]} shadow-camera-far={18} />
    <pointLight castShadow={props.lightsOn && props.shadows} intensity={props.lightsOn ? current.point : 0} color="#ffc682" position={[-2.5,2.8,1]} distance={8} />
    <Room shadows={props.shadows} />
    {props.grid && <Grid args={[10,8]} position={[0,.015,0]} cellColor="#587079" sectionColor="#35606b" fadeDistance={16} />}
    {props.axes && <axesHelper args={[2.5]} position={[-4.6,.03,3.6]} />}
    {props.furniture.map(item => <Furniture key={item.id} item={item} selected={item.id === props.selectedId} onSelect={props.onSelect} onUpdate={props.onUpdate} transformMode={props.transformMode} />)}
    <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={.08} maxPolarAngle={Math.PI/2.03} />
    <GizmoHelper alignment="bottom-right" margin={[72,72]}><GizmoViewport axisColors={['#ef6767','#73d49a','#6eb9e9']} labelColor="white" /></GizmoHelper>
  </>
}
export default function Scene(props) { return <Canvas shadows={props.shadows} dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true, antialias: true }} onPointerMissed={() => props.onSelect(null)}><Suspense fallback={null}><SceneContents {...props}/></Suspense></Canvas> }
