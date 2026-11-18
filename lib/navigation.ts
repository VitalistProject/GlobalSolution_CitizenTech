import {
  Activity,
  AlertTriangle,
  Cpu,
  FileText,
  Flower2,
  Gauge,
  Map,
  Zap,
} from "lucide-react";

export type View =
  | "overview"
  | "map"
  | "plants"
  | "monitoring"
  | "analysis"
  | "engine"
  | "alerts"
  | "reports"
  | "devices"
  | "settings";

export const viewLabels: Record<View, string> = {
  overview: "Visão geral",
  map: "Análise de mapa",
  plants: "Plantas monitoradas",
  monitoring: "Monitoramento",
  analysis: "Análise de IA",
  engine: "Motor de análise",
  alerts: "Central de alertas",
  reports: "Relatórios",
  devices: "Dispositivos e sensores",
  settings: "Configurações",
};

export const navGroups: {
  label: string;
  items: { view: View; icon: typeof Activity }[];
}[] = [
  {
    label: "ACOMPANHAMENTO",
    items: [
      { view: "overview", icon: Activity },
      { view: "map", icon: Map },
      { view: "plants", icon: Flower2 },
      { view: "monitoring", icon: Gauge },
    ],
  },
  {
    label: "INTELIGÊNCIA",
    items: [
      { view: "analysis", icon: Zap },
      { view: "alerts", icon: AlertTriangle },
    ],
  },
  {
    label: "GESTÃO",
    items: [
      { view: "reports", icon: FileText },
      { view: "devices", icon: Cpu },
    ],
  },
];
