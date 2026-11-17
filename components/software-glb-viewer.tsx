"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { gsap } from "gsap"
import { Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import * as THREE from "three"

type GlbMesh = {
  positions: Float32Array
  normals: Float32Array
  uvs: Float32Array
  indices: Uint32Array
  texture: Blob | null
  baseColor: [number, number, number, number]
}
type TexturePixels = { width: number; height: number; pixels: Uint8ClampedArray }
type AccessorData = { values: Float32Array | Uint32Array; components: number }
type GlbJson = { bufferViews?: { byteOffset?: number; byteLength: number; byteStride?: number }[]; accessors?: { bufferView?: number; byteOffset?: number; componentType: number; count: number; type: string }[]; meshes?: { primitives: { attributes: Record<string, number>; indices: number; material?: number }[] }[]; materials?: { pbrMetallicRoughness?: { baseColorFactor?: [number, number, number, number]; baseColorTexture?: { index: number } } }[]; textures?: { source?: number }[]; images?: { bufferView?: number; mimeType?: string }[]; nodes?: { mesh?: number; children?: number[]; matrix?: number[]; translation?: [number, number, number]; rotation?: [number, number, number, number]; scale?: [number, number, number] }[]; scenes?: { nodes: number[] }[]; scene?: number }
type ViewerState = { yaw: number; pitch: number; zoom: number }

function componentCount(type: string) { return type === "VEC2" ? 2 : type === "VEC3" ? 3 : type === "VEC4" ? 4 : 1 }
function componentSize(type: number) { return type === 5125 || type === 5126 ? 4 : type === 5123 ? 2 : 1 }

async function loadGlb(url: string): Promise<GlbMesh> {
  const response = await fetch(url)
  if (!response.ok) throw new Error("O arquivo do modelo não pôde ser carregado.")
  const buffer = await response.arrayBuffer()
  const dataView = new DataView(buffer)
  if (dataView.getUint32(0, true) !== 0x46546c67) throw new Error("O arquivo recebido não é um GLB válido.")

  let chunkOffset = 12
  let json: GlbJson | undefined
  let binaryOffset = 0
  let binaryLength = 0
  while (chunkOffset + 8 <= buffer.byteLength) {
    const length = dataView.getUint32(chunkOffset, true)
    const type = dataView.getUint32(chunkOffset + 4, true)
    const contentOffset = chunkOffset + 8
    if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, contentOffset, length))) as GlbJson
    if (type === 0x004e4942) { binaryOffset = contentOffset; binaryLength = length }
    chunkOffset = contentOffset + length
  }
  if (!json?.meshes?.length || !json.accessors || !json.bufferViews) throw new Error("O GLB não contém uma malha compatível.")
  const binary = new Uint8Array(buffer, binaryOffset, binaryLength)

  const readAccessor = (index: number): AccessorData => {
    const accessor = json!.accessors![index]
    const view = json!.bufferViews![accessor.bufferView ?? -1]
    if (!view) throw new Error("O GLB contém um atributo sem buffer.")
    const components = componentCount(accessor.type)
    const size = componentSize(accessor.componentType)
    const stride = view.byteStride ?? components * size
    const start = binaryOffset + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
    const values = accessor.componentType === 5125 ? new Uint32Array(accessor.count * components) : new Float32Array(accessor.count * components)
    for (let row = 0; row < accessor.count; row++) {
      for (let column = 0; column < components; column++) {
        const offset = start + row * stride + column * size
        const value = accessor.componentType === 5126 ? dataView.getFloat32(offset, true) : accessor.componentType === 5125 ? dataView.getUint32(offset, true) : accessor.componentType === 5123 ? dataView.getUint16(offset, true) : dataView.getUint8(offset)
        values[row * components + column] = value
      }
    }
    return { values, components }
  }

  const primitive = json.meshes[0].primitives[0]
  const positionAccessor = readAccessor(primitive.attributes.POSITION)
  const normalAccessor = readAccessor(primitive.attributes.NORMAL)
  const uvAccessor = readAccessor(primitive.attributes.TEXCOORD_0)
  const indexAccessor = readAccessor(primitive.indices)
  const positions = positionAccessor.values as Float32Array
  const normals = normalAccessor.values as Float32Array
  const uvs = uvAccessor.values as Float32Array
  const indices = indexAccessor.values as Uint32Array
  const rootMatrixData = json.nodes?.find(node => node.matrix)?.matrix
  const rootMatrix = rootMatrixData ? new THREE.Matrix4().fromArray(rootMatrixData) : new THREE.Matrix4()
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(rootMatrix)
  const points: THREE.Vector3[] = []
  const normalVectors: THREE.Vector3[] = []
  const bounds = new THREE.Box3()
  for (let i = 0; i < positions.length; i += 3) {
    const point = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]).applyMatrix4(rootMatrix)
    points.push(point)
    bounds.expandByPoint(point)
    normalVectors.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]).applyMatrix3(normalMatrix).normalize())
  }
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const scale = 2.45 / Math.max(size.x, size.y, size.z)
  const normalizedPositions = new Float32Array(positions.length)
  points.forEach((point, index) => {
    normalizedPositions[index * 3] = (point.x - center.x) * scale
    normalizedPositions[index * 3 + 1] = (point.y - center.y) * scale
    normalizedPositions[index * 3 + 2] = (point.z - center.z) * scale
  })
  const normalizedNormals = new Float32Array(normals.length)
  normalVectors.forEach((normal, index) => {
    normalizedNormals[index * 3] = normal.x
    normalizedNormals[index * 3 + 1] = normal.y
    normalizedNormals[index * 3 + 2] = normal.z
  })

  const material = json.materials?.[primitive.material ?? 0]
  const baseColor = material?.pbrMetallicRoughness?.baseColorFactor ?? [0.72, 0.76, 0.67, 1]
  const textureIndex = material?.pbrMetallicRoughness?.baseColorTexture?.index
  const imageIndex = textureIndex === undefined ? undefined : json.textures?.[textureIndex]?.source
  const image = imageIndex === undefined ? undefined : json.images?.[imageIndex]
  let texture: Blob | null = null
  if (image?.bufferView !== undefined) {
    const imageView = json.bufferViews[image.bufferView]
    const bytes = binary.slice(imageView.byteOffset ?? 0, (imageView.byteOffset ?? 0) + imageView.byteLength)
    texture = new Blob([bytes], { type: image.mimeType ?? "image/png" })
  }
  return { positions: normalizedPositions, normals: normalizedNormals, uvs, indices, texture, baseColor }
}

function getTexturePixels(blob: Blob): Promise<TexturePixels> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext("2d", { willReadFrequently: true })
      if (!context) { reject(new Error("Não foi possível ler a textura do modelo.")); return }
      context.drawImage(image, 0, 0)
      resolve({ width: canvas.width, height: canvas.height, pixels: context.getImageData(0, 0, canvas.width, canvas.height).data })
    }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("A textura do modelo não pôde ser decodificada.")) }
    image.src = url
  })
}

export function SoftwareGLBViewer() {
  const { data, error, isLoading } = useSWR("/tomato_plant.glb", loadGlb, { revalidateOnFocus: false, shouldRetryOnError: false })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textureRef = useRef<TexturePixels | null>(null)
  const view = useRef<ViewerState>({ yaw: -0.35, pitch: 0.08, zoom: 1 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const drawRef = useRef<() => void>(() => undefined)
  const spin = useRef<gsap.core.Tween | null>(null)
  const [textureReady, setTextureReady] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)

  useEffect(() => {
    if (!data) return
    if (!data.texture) { setTextureReady(true); return }
    setTextureReady(false)
    let cancelled = false
    getTexturePixels(data.texture).then(texture => { if (!cancelled) { textureRef.current = texture; setTextureReady(true) } }).catch(() => setTextureReady(true))
    return () => { cancelled = true }
  }, [data])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = rect.width
    const height = rect.height
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) { canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr) }
    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)
    context.save()
    context.fillStyle = "rgba(69, 104, 68, 0.14)"
    context.filter = "blur(12px)"
    context.beginPath()
    context.ellipse(width / 2, height * 0.84, Math.min(width, height) * 0.2 * view.current.zoom, Math.min(width, height) * 0.035, 0, 0, Math.PI * 2)
    context.fill()
    context.restore()

    const { yaw, pitch, zoom } = view.current
    const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw), cosPitch = Math.cos(pitch), sinPitch = Math.sin(pitch)
    const cameraDistance = 4.2
    const focal = Math.min(width, height) * 1.42
    const centerX = width / 2, centerY = height / 2 + height * 0.035
    const points = new Array<{ x: number; y: number; z: number }>(data.positions.length / 3)
    const normals = new Array<{ x: number; y: number; z: number }>(data.normals.length / 3)
    for (let i = 0; i < points.length; i++) {
      const x = data.positions[i * 3], y = data.positions[i * 3 + 1], z = data.positions[i * 3 + 2]
      const yawX = x * cosYaw - z * sinYaw, yawZ = x * sinYaw + z * cosYaw
      const pitchY = y * cosPitch - yawZ * sinPitch, pitchZ = y * sinPitch + yawZ * cosPitch
      const depth = cameraDistance - pitchZ
      const scale = focal * zoom / depth
      points[i] = { x: centerX + yawX * scale, y: centerY - pitchY * scale, z: pitchZ }
      const nx = data.normals[i * 3], ny = data.normals[i * 3 + 1], nz = data.normals[i * 3 + 2]
      const normalX = nx * cosYaw - nz * sinYaw, normalZ = nx * sinYaw + nz * cosYaw
      const normalY = ny * cosPitch - normalZ * sinPitch, normalZRotated = ny * sinPitch + normalZ * cosPitch
      normals[i] = { x: normalX, y: normalY, z: normalZRotated }
    }
    const triangles: { a: number; b: number; c: number; depth: number }[] = []
    for (let i = 0; i < data.indices.length; i += 3) {
      const a = data.indices[i], b = data.indices[i + 1], c = data.indices[i + 2]
      triangles.push({ a, b, c, depth: (points[a].z + points[b].z + points[c].z) / 3 })
    }
    triangles.sort((a, b) => a.depth - b.depth)
    const light = new THREE.Vector3(-0.4, 0.78, 0.48).normalize()
    const texture = textureRef.current
    for (const triangle of triangles) {
      const { a, b, c } = triangle
      const pa = points[a], pb = points[b], pc = points[c]
      if (Math.max(pa.x, pb.x, pc.x) < -3 || Math.min(pa.x, pb.x, pc.x) > width + 3 || Math.max(pa.y, pb.y, pc.y) < -3 || Math.min(pa.y, pb.y, pc.y) > height + 3) continue
      let red = data.baseColor[0], green = data.baseColor[1], blue = data.baseColor[2], alpha = data.baseColor[3]
      if (texture) {
        const u = (data.uvs[a * 2] + data.uvs[b * 2] + data.uvs[c * 2]) / 3
        const v = (data.uvs[a * 2 + 1] + data.uvs[b * 2 + 1] + data.uvs[c * 2 + 1]) / 3
        const tx = Math.max(0, Math.min(texture.width - 1, Math.floor(u * texture.width)))
        const ty = Math.max(0, Math.min(texture.height - 1, Math.floor((1 - v) * texture.height)))
        const pixel = (ty * texture.width + tx) * 4
        red = texture.pixels[pixel] / 255
        green = texture.pixels[pixel + 1] / 255
        blue = texture.pixels[pixel + 2] / 255
        alpha *= texture.pixels[pixel + 3] / 255
      }
      if (alpha < 0.12) continue
      const nx = (normals[a].x + normals[b].x + normals[c].x) / 3
      const ny = (normals[a].y + normals[b].y + normals[c].y) / 3
      const nz = (normals[a].z + normals[b].z + normals[c].z) / 3
      const brightness = 0.38 + Math.max(0, nx * light.x + ny * light.y + nz * light.z) * 0.72
      context.globalAlpha = Math.min(1, alpha)
      context.fillStyle = `rgb(${Math.min(255, red * brightness * 255)},${Math.min(255, green * brightness * 255)},${Math.min(255, blue * brightness * 255)})`
      context.beginPath()
      context.moveTo(pa.x, pa.y)
      context.lineTo(pb.x, pb.y)
      context.lineTo(pc.x, pc.y)
      context.closePath()
      context.fill()
    }
    context.globalAlpha = 1
  }, [data])

  useEffect(() => {
    drawRef.current = draw
    draw()
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [draw])
  useEffect(() => { if (textureReady) drawRef.current() }, [textureReady])

  const stopSpin = () => { spin.current?.kill(); spin.current = null; setAutoRotate(false) }
  const toggleSpin = () => {
    if (spin.current) { stopSpin(); return }
    setAutoRotate(true)
    spin.current = gsap.to(view.current, { yaw: view.current.yaw + Math.PI * 2, duration: 22, repeat: -1, ease: "none", onUpdate: () => drawRef.current() })
  }
  const rotateBy = (amount: number) => { stopSpin(); view.current.yaw += amount; drawRef.current() }
  const zoomBy = (amount: number) => { view.current.zoom = THREE.MathUtils.clamp(view.current.zoom + amount, 0.68, 1.65); drawRef.current() }
  const reset = () => { stopSpin(); view.current = { yaw: -0.35, pitch: 0.08, zoom: 1 }; drawRef.current() }
  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY }; stopSpin() }
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return
    view.current.yaw += (event.clientX - drag.current.x) * 0.009
    view.current.pitch = THREE.MathUtils.clamp(view.current.pitch + (event.clientY - drag.current.y) * 0.007, -0.9, 0.9)
    drag.current = { x: event.clientX, y: event.clientY }
    drawRef.current()
  }
  const onWheel = (event: React.WheelEvent<HTMLCanvasElement>) => { event.preventDefault(); zoomBy(event.deltaY < 0 ? 0.06 : -0.06) }
  useEffect(() => () => { spin.current?.kill() }, [])

  if (isLoading) return <div className="software-model-shell"><div className="twin-loading model-loading"><span className="model-spinner"/>Carregando tomato_plant.glb…</div></div>
  if (error || !data) return <div className="software-model-error" role="status">Não foi possível carregar o modelo tomato_plant.glb.</div>

  return <div className="software-model-shell" role="group" aria-label="Visualizador interativo do modelo tridimensional carregado de tomate">
    <canvas ref={canvasRef} className="software-model-canvas" aria-label="Modelo 3D de tomate. Arraste para orbitar; role para aproximar." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onWheel={onWheel}/>
    <div className="plant-control-bar" aria-label="Controles do modelo 3D"><button type="button" onClick={() => rotateBy(-0.38)} aria-label="Girar para a esquerda" title="Girar para a esquerda"><RotateCcw size={14}/></button><button type="button" onClick={toggleSpin} aria-label={autoRotate ? "Pausar rotação automática" : "Ativar rotação automática"} title={autoRotate ? "Pausar giro" : "Giro automático"}>{autoRotate ? <Pause size={14}/> : <Play size={14}/>}</button><button type="button" onClick={() => rotateBy(0.38)} aria-label="Girar para a direita" title="Girar para a direita"><RotateCcw size={14} className="rotate-right-icon"/></button><span className="control-divider"/><button type="button" onClick={() => zoomBy(0.12)} aria-label="Aproximar modelo" title="Aproximar"><ZoomIn size={14}/></button><button type="button" onClick={() => zoomBy(-0.12)} aria-label="Afastar modelo" title="Afastar"><ZoomOut size={14}/></button><button type="button" onClick={reset} aria-label="Redefinir visualização" title="Redefinir"><RotateCcw size={14}/></button></div>
    <span className="plant-gesture-hint">Modelo carregado do GLB · arraste para orbitar · scroll para zoom</span>
  </div>
}
