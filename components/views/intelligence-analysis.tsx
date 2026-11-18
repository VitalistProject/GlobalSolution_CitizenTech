import { Activity, AlertTriangle, ChevronRight, Lightbulb, RadioTower } from "lucide-react";
import { type Alert, type Plant, type Property } from "@/lib/siaf-data";
import { LAST_READING } from "@/lib/mock-session";

export function IntelligenceAnalysis({
  property,
  plants,
  alerts,
  onPlant,
}: {
  property: Property;
  plants: Plant[];
  alerts: Alert[];
  onPlant: (id: string) => void;
}) {
  const pending = alerts.filter(
    (alert) =>
      alert.status === "Requer verificação" || alert.status === "Em análise",
  );

  const connected = plants.filter((plant) => plant.state !== "offline").length;

  const averageQuality = Math.round(
    plants
      .filter((plant) => plant.quality > 0)
      .reduce((total, plant) => total + plant.quality, 0) /
      Math.max(connected, 1),
  );


  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            SINAIS E VERIFICAÇÕES · DADOS DEMONSTRATIVOS
          </div>
          <h1>Análise de IA</h1>
          <p>
            Veja quais plantas enviaram sinais e onde a qualidade ou o estado
            precisa de atenção.
          </p>
        </div>
        <span className="demo-badge large">
          SEM MODELO CIENTÍFICO CONECTADO
        </span>
      </div>
      <div className="ai-summary-grid">
        <div className="panel">
          <RadioTower size={17} />
          <span>Sinais recebidos</span>
          <strong>
            {connected} / {plants.length}
          </strong>
          <small>2 dispositivos sem comunicação</small>
        </div>
        <div className="panel">
          <Activity size={17} />
          <span>Qualidade média</span>
          <strong>{averageQuality}%</strong>
          <small>Leituras simuladas · última amostra {LAST_READING}</small>
        </div>
        <div className="panel">
          <AlertTriangle size={17} />
          <span>Exigem revisão humana</span>
          <strong>{pending.length}</strong>
          <small>Hipóteses não equivalem a diagnóstico</small>
        </div>
      </div>
      <section className="panel ai-plants-panel">
        <div className="panel-heading">
          <div>
            <div className="panel-title">Recebimento por planta</div>
            <p>Estado do dispositivo, qualidade e alertas ativos</p>
          </div>
          <span className="demo-badge">SIMULAÇÃO</span>
        </div>
        <div className="ai-plant-list">
          {plants.map((plant) => {
            const alert = pending.find((item) => item.plantId === plant.id);
            return (
              <button
                type="button"
                className="ai-plant-row"
                key={plant.id}
                onClick={() => onPlant(plant.id)}
              >
                <span className={`ai-signal-dot ${plant.state}`} />
                <span className="ai-plant-name">
                  <strong>{plant.id}</strong>
                  <small>
                    {plant.deviceId} · {plant.sector}
                  </small>
                </span>
                <span className="ai-signal-state">
                  {plant.state === "offline"
                    ? "Sem sinal"
                    : plant.state === "alert"
                      ? "Alteração detectada"
                      : plant.state === "observation"
                        ? "Em observação"
                        : "Recebido"}
                </span>
                <span className="ai-quality">
                  <i>
                    <b style={{ width: `${plant.quality}%` }} />
                  </i>
                  {plant.quality ? `${plant.quality}%` : "—"}
                </span>
                <span className="ai-alert-state">
                  {alert?.title ??
                    (plant.state === "offline"
                      ? "Verificar conexão"
                      : "Sem alerta")}
                </span>
                <ChevronRight size={15} />
              </button>
            );
          })}
        </div>
        <div className="science-note">
          <Lightbulb size={14} /> O motor científico ainda não está conectado.
          Esta tela mostra apenas integridade do sinal e hipóteses
          demonstrativas; não gera recomendações de manejo.
        </div>
      </section>
    </>
  );
}
