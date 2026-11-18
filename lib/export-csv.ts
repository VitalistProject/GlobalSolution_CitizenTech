import { measurements, stateLabel, type Plant } from "@/lib/siaf-data";

const HEADER = [
  "planta",
  "setor",
  "condicao",
  "umidade_solo",
  "temperatura",
  "dispositivo",
  "sensor",
  "timestamp",
  "qualidade",
  "origem",
  "processamento",
];

// Gera e baixa um CSV com a última leitura de umidade do solo de cada planta.
export function exportPlantsCsv(plants: Plant[]) {
  const rows = plants.flatMap((p) =>
    measurements
      .filter((m) => m.plantId === p.id && m.variable === "Umidade do solo")
      .slice(-1)
      .map((m) => [
        p.id,
        p.sector,
        stateLabel[p.state],
        p.soil,
        p.temperature,
        p.deviceId,
        m.sensorId,
        m.timestamp,
        m.quality,
        m.origin,
        m.processing,
      ]),
  );

  // "\uFEFF" (BOM) faz o Excel abrir os acentos corretamente
  const csv =
    "\uFEFF" +
    [HEADER, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  link.download = "siaf-relatorio-demonstrativo.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
