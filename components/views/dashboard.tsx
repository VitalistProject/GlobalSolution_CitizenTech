import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, CircleHelp, CloudSun, Cpu, Droplets, Flower2, Lightbulb, MoreHorizontal, Plus, Signal, Thermometer, Wind } from "lucide-react";
import { type Alert, type Plant, type Property } from "@/lib/siaf-data";
import { type View } from "@/lib/navigation";
import { LAST_READING } from "@/lib/mock-session";
import { MiniChart } from "@/components/shared/mini-chart";
import { IconButton } from "@/components/shared/icon-button";
import { FarmMap } from "@/components/map/farm-map";

export function Dashboard({
  property,
  plants,
  allPlants,
  alerts,
  onPlant,
  onAlerts,
  sector,
  setSector,
  setView,
}: {
  property: Property;
  plants: Plant[];
  allPlants: Plant[];
  alerts: Alert[];
  onPlant: (id: string) => void;
  onAlerts: () => void;
  sector: string;
  setSector: (v: string) => void;
  setView: (v: View) => void;
}) {
  const activeAlerts = alerts.filter(
    (a) => a.status === "Requer verificação" || a.status === "Em análise",
  );

  const baseline = plants.filter((p) => p.state === "baseline").length;

  const altered = plants.filter(
    (p) => p.state === "alert" || p.state === "observation",
  ).length;

  const online = plants.filter((p) => p.state !== "offline").length;

  const quality = Math.round(
    plants.filter((p) => p.quality > 0).reduce((n, p) => n + p.quality, 0) /
      Math.max(online, 1),
  );

  const metrics = [
    {
      label: "Plantas monitoradas",
      value: String(plants.length),
      note: "em 6 setores",
      icon: Flower2,
      color: "green",
      trend: "+4 no período",
    },
    {
      label: "Dentro da linha de base",
      value: String(baseline),
      note: `${Math.round((baseline / plants.length) * 100)}% da propriedade`,
      icon: CheckCircle2,
      color: "green",
      trend: "Comportamento estável",
    },
    {
      label: "Sinais de estresse em observação",
      value: String(altered),
      note: "Exigem verificação humana",
      icon: Activity,
      color: "amber",
      trend: "2 novas hoje",
    },
    {
      label: "Alertas pendentes",
      value: String(activeAlerts.length),
      note: "Prioridade alta e média",
      icon: AlertTriangle,
      color: "coral",
      trend: "Revisar ocorrências",
    },
    {
      label: "Dispositivos conectados",
      value: `${online}/48`,
      note: "2 sem comunicação",
      icon: Cpu,
      color: "blue",
      trend: "96% conectados",
    },
    {
      label: "Qualidade dos dados",
      value: `${quality}%`,
      note: "Média simulada do sinal",
      icon: Signal,
      color: "green",
      trend: "+2,4% vs. anterior",
    },
  ];


  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> TERÇA-FEIRA, 17 DE NOVEMBRO DE 2026
          </div>
          <h1>
            Bom dia, Ana <span>—</span>
          </h1>
          <p>Acompanhe os sinais de {property.name} em um só lugar.</p>
        </div>
        <div className="welcome-actions">
          <select className="period-select" aria-label="Selecionar período">
            <option>Últimas 24 horas</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
          </select>
          <button
            className="button-primary"
            onClick={() => setView("plants")}
          >
            <Plus size={16} /> Adicionar planta
          </button>
        </div>
      </div>
      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <div className={`metric-card ${m.color}`} key={m.label}>
            <div className="metric-top">
              <div className="metric-icon">
                <m.icon size={17} />
              </div>
              {i === 5 ? (
                <span className="metric-mini">{m.value}</span>
              ) : (
                <span className="metric-hint">DEMO</span>
              )}
            </div>
            <div className="metric-label">
              {m.label}
              <span title={m.note}>
                <CircleHelp size={13} />
              </span>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-foot">
              <span>{m.note}</span>
              {i === 3 ? (
                <span className="foot-alert">{m.trend}</span>
              ) : i === 5 ? (
                <span className="foot-positive">
                  <ArrowUpRight size={12} />
                  {m.trend}
                </span>
              ) : (
                <span className="foot-muted">{m.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="overview-grid">
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">
                Mapa de monitoramento{" "}
                <span className="demo-badge">DEMONSTRAÇÃO</span>
              </div>
              <p>
                {property.name} · {property.location} · 6 setores
              </p>
            </div>
            <button
              className="text-button"
              onClick={() => setView("map")}
            >
              Abrir análise do mapa <ArrowRight size={14} />
            </button>
          </div>
          <FarmMap
            property={property}
            plants={allPlants}
            onSelect={onPlant}
            selectedSector={sector}
            onSector={setSector}
          />
        </section>
        <section className="panel alert-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">
                Ocorrências recentes{" "}
                <span className="alert-badge">
                  {activeAlerts.length} abertas
                </span>
              </div>
              <p>Prioridade por necessidade de verificação</p>
            </div>
            <IconButton label="Ver todas as ocorrências" onClick={onAlerts}>
              <ArrowUpRight size={17} />
            </IconButton>
          </div>
          <div className="occurrence-list">
            {alerts.slice(0, 4).map((a) => (
              <button
                className="occurrence-row"
                key={a.id}
                onClick={() => onPlant(a.plantId)}
              >
                <span
                  className={`occurrence-indicator ${a.priority.toLowerCase()}`}
                />
                <span className="occurrence-content">
                  <strong>{a.title}</strong>
                  <small>
                    {a.plantId} · {a.sector} <span>· {a.time}</span>
                  </small>
                </span>
                <span className={`priority-label ${a.priority.toLowerCase()}`}>
                  {a.priority}
                </span>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
          <button className="all-alerts" onClick={onAlerts}>
            Abrir central de alertas <ArrowRight size={14} />
          </button>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Evolução das alterações</div>
              <p>Eventos observados · últimas 24 horas</p>
            </div>
            <select className="small-select" aria-label="Variável do gráfico">
              <option>Alterações fisiológicas</option>
              <option>Qualidade do sinal</option>
            </select>
          </div>
          <div className="trend-chart">
            <div className="chart-y-labels">
              <span>12</span>
              <span>8</span>
              <span>4</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <div className="chart-gridlines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <MiniChart height={112} />
              <div className="chart-x-labels">
                <span>00h</span>
                <span>04h</span>
                <span>08h</span>
                <span>12h</span>
                <span>16h</span>
                <span>20h</span>
                <span>Agora</span>
              </div>
            </div>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-line" />
              Eventos identificados
            </span>
            <span>
              <i className="legend-dash" />
              Faixa de referência demonstrativa
            </span>
          </div>
        </section>
        <section className="panel environment-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Condições ambientais</div>
              <p>Médias da propriedade · dados simulados</p>
            </div>
            <button className="more-button" aria-label="Mais opções">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="environment-grid">
            <div className="environment-cell">
              <Droplets size={16} />
              <span>Umidade do solo</span>
              <b>
                54<small>%</small>
              </b>
              <div className="measure-bar">
                <i style={{ width: "54%" }} />
              </div>
              <small>faixa demonstrativa</small>
            </div>
            <div className="environment-cell">
              <Thermometer size={16} />
              <span>Temperatura</span>
              <b>
                25,4<small>°C</small>
              </b>
              <div className="measure-bar">
                <i style={{ width: "61%" }} />
              </div>
              <small>ambiente estável</small>
            </div>
            <div className="environment-cell">
              <Wind size={16} />
              <span>Umidade do ar</span>
              <b>
                68<small>%</small>
              </b>
              <div className="measure-bar">
                <i style={{ width: "68%" }} />
              </div>
              <small>faixa demonstrativa</small>
            </div>
            <div className="environment-cell">
              <CloudSun size={16} />
              <span>Luminosidade</span>
              <b>
                12,4<small>klux</small>
              </b>
              <div className="measure-bar">
                <i style={{ width: "76%" }} />
              </div>
              <small>leitura simulada</small>
            </div>
          </div>
          <div className="environment-source">
            <span className="connection-pulse" /> Atualizado às {LAST_READING}{" "}
            <span>·</span> 4 sensores ambientais
          </div>
        </section>
      </div>
      <div className="dashboard-note">
        <Lightbulb size={15} />
        <span>
          <strong>Sobre estes dados:</strong> Esta interface opera em modo de
          demonstração. Hipóteses ilustrativas não são diagnósticos e precisam
          de verificação humana.
        </span>
        <button onClick={() => setView("analysis")}>
          Ver sinais recebidos <ArrowRight size={13} />
        </button>
      </div>
    </>
  );
}
