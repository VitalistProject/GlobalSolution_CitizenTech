import { ChevronRight, Map } from "lucide-react";
import { type Alert, type Plant, type Property } from "@/lib/siaf-data";
import { FarmMap } from "@/components/map/farm-map";

export function AnalysisMap({
  property,
  plants,
  alerts,
  sector,
  onSector,
  onPlant,
}: {
  property: Property;
  plants: Plant[];
  alerts: Alert[];
  sector: string;
  onSector: (value: string) => void;
  onPlant: (id: string) => void;
}) {
  const openAlerts = alerts.filter(
    (alert) =>
      alert.status === "Requer verificação" || alert.status === "Em análise",
  );

  const offline = plants.filter((plant) => plant.state === "offline");

  const averageQuality = Math.round(
    plants.reduce((total, plant) => total + plant.quality, 0) /
      Math.max(plants.length, 1),
  );


  return (
    <div className="map-analysis-view">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">LEITURA ESPACIAL · DEMONSTRAÇÃO</div>
          <h1>Análise de mapa</h1>
          <p>{property.name} · ocorrências e sinais por setor</p>
        </div>
        <span className="demo-badge">MAPA ILUSTRATIVO</span>
      </div>
      <div className="map-analysis-metrics">
        <div>
          <span>Plantas na área</span>
          <strong>{plants.length}</strong>
        </div>
        <div className={openAlerts.length ? "attention" : ""}>
          <span>Hipóteses abertas</span>
          <strong>{openAlerts.length}</strong>
        </div>
        <div className={offline.length ? "offline" : ""}>
          <span>Sem comunicação</span>
          <strong>{offline.length}</strong>
        </div>
        <div>
          <span>Qualidade média</span>
          <strong>{averageQuality}%</strong>
        </div>
      </div>
      <div className="map-analysis-layout">
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Distribuição por setor</div>
              <p>Selecione um marcador ou setor para explorar as plantas</p>
            </div>
            <span className="map-location-label">
              <Map size={14} />
              {property.location}
            </span>
          </div>
          <FarmMap
            property={property}
            plants={plants}
            onSelect={onPlant}
            selectedSector={sector}
            onSector={onSector}
          />
        </section>
        <aside className="panel map-analysis-aside">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Prioridade de verificação</div>
              <p>Ocorrências que precisam de contexto humano</p>
            </div>
          </div>
          <div className="map-alert-list">
            {openAlerts.length ? (
              openAlerts.map((alert) => (
                <button
                  className="map-alert-item"
                  type="button"
                  key={alert.id}
                  onClick={() => onPlant(alert.plantId)}
                >
                  <span
                    className={`occurrence-indicator ${alert.priority.toLowerCase()}`}
                  />
                  <span>
                    <strong>
                      {alert.plantId} · {alert.title}
                    </strong>
                    <small>
                      {alert.sector} · {alert.time}
                    </small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              ))
            ) : (
              <p className="notification-empty">
                Sem hipóteses pendentes nesta propriedade.
              </p>
            )}
          </div>
          <div className="map-analysis-foot">
            <strong>Leitura do mapa</strong>
            <p>
              Os pontos e limites são ilustrativos. Confirme o estado da planta
              e do sensor antes de qualquer decisão operacional.
            </p>
            <span>
              <i className="map-dot" /> Linha de base{" "}
              <i className="map-dot amber-dot" /> Observação{" "}
              <i className="map-dot coral-dot" /> Verificação
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
