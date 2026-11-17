export type PlantState = "baseline" | "observation" | "alert" | "offline"
export type Measurement = { id: string; plantId: string; deviceId: string; sensorId: string; timestamp: string; variable: string; value: number; unit: string; quality: number; origin: "sensor demonstrativo"; processing: "processed" | "raw" }
export type Plant = { id: string; propertyId: string; sector: string; species: string; variety: string; stage: string; state: PlantState; deviceId: string; quality: number; soil: number; temperature: number; registered: string }
export type Property = { id: string; name: string; location: string; area: string; crop: string; mapImage: string }
export type Alert = { id: string; plantId: string; title: string; priority: "Alta" | "Média" | "Baixa"; time: string; status: "Requer verificação" | "Em análise" | "Verificação registrada" | "Hipótese rejeitada"; type: string; sector: string; reviewNote?: string; reviewedAt?: string }
export type TimelineEvent = { id: string; plantId: string; type: string; description: string; date: string; person: string }

export const sectors = ["Estufa A", "Estufa B", "Talhão 01", "Talhão 02", "Talhão 03", "Talhão 04"]
export const properties: Property[] = [
  { id: "boa-vista", name: "Fazenda Boa Vista", location: "Ibiúna, São Paulo", area: "24,8 ha", crop: "Tomate cereja", mapImage: "/siaf-aerial-map.png" },
  { id: "vale-verde", name: "Sítio Vale Verde", location: "Piedade, São Paulo", area: "18,6 ha", crop: "Tomate italiano", mapImage: "/siaf-aerial-vale-verde.png" },
]

function createPropertyPlants(property: Property, propertyIndex: number): Plant[] {
  return Array.from({ length: 48 }, (_, i) => {
    const alertIndices = propertyIndex === 0 ? [23, 30, 35] : [10, 27, 42]
    const offlineIndices = propertyIndex === 0 ? [25, 45] : [14, 39]
    return {
      id: `${propertyIndex === 0 ? "T" : "V"}-${String(i + 1).padStart(3, "0")}`,
      propertyId: property.id,
      sector: sectors[Math.floor(i / 8)],
      species: "Solanum lycopersicum",
      variety: propertyIndex === 0 ? (i % 2 ? "Tomate cereja" : "Santa Clara") : (i % 2 ? "Tomate italiano" : "Rasteiro"),
      stage: i < 24 ? "Floração" : "Vegetativo",
      state: alertIndices.includes(i) ? "alert" : offlineIndices.includes(i) ? "offline" : i % 9 === 0 ? "observation" : "baseline",
      deviceId: `${propertyIndex === 0 ? "SIA" : "VV"}-${String(i + 1).padStart(3, "0")}`,
      quality: offlineIndices.includes(i) ? 0 : 91 + i % 9,
      soil: alertIndices.includes(i) ? 24 + (i % 4) * 3 : 48 + i % 12,
      temperature: 24 + (i % 5) * 0.3,
      registered: "12/09/2026",
    }
  })
}

export const plants: Plant[] = properties.flatMap(createPropertyPlants)
export const initialAlerts: Alert[] = [
  { id: "A-001", plantId: "T-024", title: "Alteração compatível com déficit hídrico", priority: "Alta", time: "10:42", status: "Requer verificação", type: "Alteração fisiológica", sector: "Talhão 01" },
  { id: "A-002", plantId: "T-031", title: "Alteração persistente na linha de base", priority: "Alta", time: "10:28", status: "Requer verificação", type: "Anomalia persistente", sector: "Talhão 02" },
  { id: "A-003", plantId: "T-036", title: "Temperatura acima da faixa de referência", priority: "Média", time: "10:15", status: "Requer verificação", type: "Alteração ambiental", sector: "Talhão 03" },
  { id: "A-004", plantId: "T-026", title: "Dispositivo sem comunicação", priority: "Média", time: "09:56", status: "Requer verificação", type: "Perda de comunicação", sector: "Talhão 02" },
  { id: "A-005", plantId: "T-046", title: "Dados insuficientes para análise", priority: "Baixa", time: "09:32", status: "Requer verificação", type: "Dados insuficientes", sector: "Talhão 04" },
  { id: "A-006", plantId: "V-011", title: "Variação ambiental em observação", priority: "Média", time: "10:36", status: "Requer verificação", type: "Alteração ambiental", sector: "Estufa B" },
  { id: "A-007", plantId: "V-028", title: "Alteração persistente na linha de base", priority: "Alta", time: "10:12", status: "Requer verificação", type: "Anomalia persistente", sector: "Talhão 02" },
  { id: "A-008", plantId: "V-043", title: "Qualidade do sinal reduzida", priority: "Baixa", time: "09:48", status: "Requer verificação", type: "Baixa qualidade do sinal", sector: "Talhão 04" },
]
export const initialTimeline: TimelineEvent[] = [
  { id: "H-1", plantId: "T-024", type: "Análise demonstrativa", description: "Variação observada em relação à linha de base individual. Hipótese requer verificação humana.", date: "17 nov. 2026 · 10:42", person: "Intelligence Engine · simulação" },
  { id: "H-2", plantId: "T-024", type: "Inspeção técnica", description: "Inspeção visual e conferência da fixação dos eletrodos.", date: "17 nov. 2026 · 08:30", person: "Ana Oliveira" },
  { id: "H-3", plantId: "T-025", type: "Irrigação realizada", description: "Manejo registrado no setor. Relação causal com alterações não estabelecida.", date: "16 nov. 2026 · 16:00", person: "Ana Oliveira" },
  { id: "H-4", plantId: "V-011", type: "Inspeção técnica", description: "Conferência demonstrativa de sensores no Sítio Vale Verde.", date: "17 nov. 2026 · 09:18", person: "Marcos Souza" },
]
const variables = [{ key: "Umidade do solo", unit: "%", base: 50 }, { key: "Temperatura", unit: "°C", base: 25 }, { key: "Umidade do ar", unit: "%", base: 68 }, { key: "Luminosidade", unit: "lux", base: 12450 }, { key: "Condutividade elétrica do solo", unit: "mS/cm", base: 1.8 }, { key: "Sinal eletrofisiológico", unit: "u.a.", base: 0 }]
export const measurements: Measurement[] = plants.flatMap((plant, p) => variables.flatMap((v, j) => Array.from({ length: 24 }, (_, k) => ({
  id: `M-${plant.id}-${j}-${k}`, plantId: plant.id, deviceId: plant.deviceId, sensorId: `${plant.deviceId}-S${j + 1}`,
  timestamp: new Date(Date.UTC(2026, 10, 17, k)).toISOString(), variable: v.key,
  value: v.key === "Sinal eletrofisiológico" ? Math.sin(k / 2.8 + p) * 0.55 + Math.cos(k / 5) * 0.2 : Math.round((v.base + Math.sin(k / 3 + p) * (j === 0 ? 8 : j === 1 ? 1.8 : j === 3 ? 2200 : j === 4 ? 0.35 : 7)) * 10) / 10,
  unit: v.unit, quality: plant.quality, origin: "sensor demonstrativo" as const, processing: j === 5 ? "processed" as const : "raw" as const,
}))))

export type MonitoringRange = "24h" | "7d" | "30d"
export type MonitoringFrequency = "15m" | "1h" | "6h" | "12h" | "24h"
export type MonitoringPoint = { timestamp: string; label: string; temperature: number; humidity: number; soil: number; light: number; conductivity: number; signal: number; quality: number; stress: number | null }

export function getMonitoringSeries(plantId: string, range: MonitoringRange, frequency: MonitoringFrequency): MonitoringPoint[] {
  const plant = plants.find(item => item.id === plantId)
  if (!plant) return []
  const totalHours = range === "24h" ? 24 : range === "7d" ? 168 : 720
  const stepHours: Record<MonitoringFrequency, number> = { "15m": 0.25, "1h": 1, "6h": 6, "12h": 12, "24h": 24 }
  const step = Math.max(stepHours[frequency], totalHours / 240)
  const series = new Map<string, number[]>()
  measurements.filter(item => item.plantId === plantId).forEach(item => {
    const values = series.get(item.variable) ?? []
    values.push(item.value)
    series.set(item.variable, values)
  })
  const start = Date.UTC(2026, 10, 17, 10, 45) - totalHours * 60 * 60 * 1000
  const sampleCount = Math.floor(totalHours / step)
  return Array.from({ length: sampleCount + 1 }, (_, index) => {
    const elapsedHours = index * step
    const hoursAgo = totalHours - elapsedHours
    const sourceIndex = ((10 - Math.floor(hoursAgo)) % 24 + 24) % 24
    const at = new Date(start + elapsedHours * 60 * 60 * 1000)
    const read = (name: string, fallback: number) => series.get(name)?.[sourceIndex] ?? fallback
    const dayVariation = Math.sin(elapsedHours / 24 * 0.72 + plant.id.length) * 0.45
    const label = range === "24h"
      ? at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : at.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit" })
    return {
      timestamp: at.toISOString(), label,
      temperature: Math.round((read("Temperatura", plant.temperature) + dayVariation) * 10) / 10,
      humidity: Math.round(read("Umidade do ar", 68) + dayVariation * 2),
      soil: Math.round(read("Umidade do solo", plant.soil) + dayVariation * 3),
      light: Math.round(read("Luminosidade", 12000) + Math.sin(elapsedHours / 8) * 640),
      conductivity: Math.round(read("Condutividade elétrica do solo", 1.8) * 100) / 100,
      signal: Math.round(read("Sinal eletrofisiológico", 0) * 100) / 100,
      quality: plant.quality,
      stress: plant.state === "offline" ? null : Math.round(Math.min(100, Math.max(0, (plant.state === "alert" ? 70 : plant.state === "observation" ? 46 : 10) + Math.max(0, 38 - read("Umidade do solo", plant.soil)) * 1.6 + Math.max(0, read("Temperatura", plant.temperature) - 27) * 5 + (100 - plant.quality) * 0.15 + 4 + Math.sin(elapsedHours / 8 + plant.id.length) * 3))),
    }
  })
}

export const stateLabel: Record<PlantState, string> = { baseline: "Linha de base", observation: "Em observação", alert: "Requer verificação", offline: "Dados insuficientes" }
export const getPlant = async (id: string) => plants.find((plant) => plant.id === id)
export const getMeasurements = async (plantId: string) => measurements.filter((measurement) => measurement.plantId === plantId)
export const getAlerts = async () => initialAlerts
