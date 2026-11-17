"use client"

import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { Bounds, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei"
import { Pause, Play, RotateCcw, Sprout, ZoomIn, ZoomOut } from "lucide-react"
import { SoftwareGLBViewer } from "@/components/software-glb-viewer"

function TomatoModel({ controlsRef, autoRotate, onReady }: { controlsRef: React.RefObject<any>; autoRotate: boolean; onReady: () => void }) {
  const { scene } = useGLTF("/tomato_plant.glb")
  const model = useMemo(() => scene.clone(true), [scene])
  useEffect(() => { onReady() }, [onReady])
  return <>
    <ambientLight intensity={1.4}/><directionalLight position={[4, 7, 5]} intensity={2.2} color="#fff4dc"/><directionalLight position={[-4, 2, -3]} intensity={1.1} color="#b9d9b8"/>
    <Bounds fit clip observe margin={1.35}><primitive object={model}/></Bounds>
    <ContactShadows position={[0, -1.15, 0]} opacity={0.27} scale={4} blur={2.6} far={3}/>
    <OrbitControls ref={controlsRef} enablePan={false} enableDamping dampingFactor={0.08} minDistance={1.4} maxDistance={8} minPolarAngle={0.16} maxPolarAngle={2.82} autoRotate={autoRotate} autoRotateSpeed={0.55}/>
  </>
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}

function WebGLUnavailable({ onUnavailable }: { onUnavailable: () => void }) {
  useEffect(() => { onUnavailable() }, [onUnavailable])
  return null
}

export default function PlantTwin() {
  const controlsRef = useRef<any>(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const handleWebGLFailure = useCallback(() => setWebglFailed(true), [])
  const handleModelReady = useCallback(() => setModelReady(true), [])
  useEffect(() => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoRotate(true) }, [])
  const zoom = (factor: number) => {
    if (!controlsRef.current) return
    factor > 1 ? controlsRef.current.dollyIn(factor) : controlsRef.current.dollyOut(1 / factor)
    controlsRef.current.update()
  }
  const rotate = (direction: number) => {
    controlsRef.current?.rotateLeft(direction * 0.38)
    controlsRef.current?.update()
  }
  const reset = () => controlsRef.current?.reset()
  const fallback = <SoftwareGLBViewer/>

  return <div className="twin-canvas glb-viewer" role="group" aria-label="Visualizador do modelo 3D Tomato Plant. Arraste para orbitar, use a roda para zoom ou os controles.">
    {!webglFailed&&<ModelErrorBoundary fallback={null} onError={handleWebGLFailure}><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.5, 4], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} fallback={<WebGLUnavailable onUnavailable={handleWebGLFailure}/>}><Suspense fallback={null}><TomatoModel controlsRef={controlsRef} autoRotate={autoRotate} onReady={handleModelReady}/></Suspense></Canvas></ModelErrorBoundary>}
    {!webglFailed&&!modelReady&&<div className="twin-loading model-loading"><span className="model-spinner"/>Carregando modelo 3D Tomato Plant…</div>}
    {webglFailed&&fallback}
    {!webglFailed&&<div className="plant-control-bar" aria-label="Controles do modelo 3D"><button type="button" onClick={() => rotate(1)} aria-label="Girar para a esquerda" title="Girar para a esquerda"><RotateCcw size={14}/></button><button type="button" onClick={() => setAutoRotate(value => !value)} aria-label={autoRotate ? "Pausar rotação automática" : "Ativar rotação automática"} title={autoRotate ? "Pausar giro" : "Giro automático"}>{autoRotate ? <Pause size={14}/> : <Play size={14}/>}</button><button type="button" onClick={() => rotate(-1)} aria-label="Girar para a direita" title="Girar para a direita"><RotateCcw size={14} className="rotate-right-icon"/></button><span className="control-divider"/><button type="button" onClick={() => zoom(1.18)} aria-label="Aproximar modelo" title="Aproximar"><ZoomIn size={14}/></button><button type="button" onClick={() => zoom(1 / 1.18)} aria-label="Afastar modelo" title="Afastar"><ZoomOut size={14}/></button><button type="button" onClick={reset} aria-label="Redefinir visualização" title="Redefinir"><Sprout size={14}/></button></div>}
    <a className="model-credit" href="https://sketchfab.com/zvanstone" target="_blank" rel="noreferrer">Tomato Plant · zvanstone · CC BY 4.0</a>
  </div>
}

useGLTF.preload("/tomato_plant.glb")
