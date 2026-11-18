import dynamic from "next/dynamic";
import { Activity, ArrowRight, ChevronLeft, CircleHelp, Droplets, History, MoreHorizontal, Plus, ShieldCheck, Sprout, Thermometer, Wind } from "lucide-react";
import { measurements, type Plant, type TimelineEvent } from "@/lib/siaf-data";
import { LAST_READING } from "@/lib/mock-session";
import { StatusTag } from "@/components/shared/status-tag";

const PlantTwin = dynamic(() => import("@/components/plant-twin"), {
  ssr: false,
  loading: () => (
    <div className="twin-loading">
      <Sprout size={30} />
      <span>Preparando gêmeo digital…</span>
    </div>
  ),
});

export function PlantProfile({
  plant,
  plants,
  timeline,
  onBack,
  onAddNote,
  onOpenAnalysis,
}: {
  plant: Plant;
  plants: Plant[];
  timeline: TimelineEvent[];
  onBack: () => void;
  onAddNote: () => void;
  onOpenAnalysis: () => void;
}) {
  const history = timeline.filter((e) => e.plantId === plant.id);

  const samples = measurements.filter(
    (m) => m.plantId === plant.id && m.variable === "Sinal eletrofisiológico",
  );


  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={15} /> Voltar para plantas
      </button>
      <div className="profile-heading">
        <div>
          <div className="eyebrow">
            GÊMEO FISIOLÓGICO DIGITAL{" "}
            <span className="demo-badge">DEMONSTRAÇÃO</span>
          </div>
          <h1>
            {plant.id} <span>·</span> Tomate {plant.variety}
          </h1>
          <p>
            {plant.species} · {plant.stage} · {plant.sector} · Cadastrada em{" "}
            {plant.registered}
          </p>
        </div>
        <button className="button-secondary" onClick={onAddNote}>
          <Plus size={15} /> Registrar evento
        </button>
      </div>
      <div className="profile-grid">
        <section className="panel twin-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Digital Physiological Twin</div>
              <p>Gêmeo 3D demonstrativo · arraste, role ou use os controles</p>
            </div>
            <span className="view-toggle">
              <span /> Modelo 3D GLB
            </span>
          </div>
          <div className="twin-stage">
            <div className="twin-grid-bg" />
            <PlantTwin />
            <div className="twin-disclaimer">
              A aparência não representa medição fisiológica
            </div>
          </div>
          <div className="twin-identity">
            <div className="twin-avatar">
              <Sprout size={21} />
            </div>
            <div>
              <strong>{plant.id}</strong>
              <span>Dispositivo {plant.deviceId} · conectado</span>
            </div>
            <StatusTag state={plant.state} />
          </div>
        </section>
        <section className="panel condition-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Condição estimada</div>
              <p>Inferência demonstrativa · 10:42</p>
            </div>
            <span className="condition-icon">
              <Activity size={17} />
            </span>
          </div>
          <div className={`hypothesis-box ${plant.state}`}>
            <div className="hypothesis-kicker">
              HIPÓTESE ILUSTRATIVA · NÃO É DIAGNÓSTICO
            </div>
            <h3>
              {plant.state === "offline"
                ? "Inconclusivo"
                : plant.state === "alert"
                  ? plant.id === "T-024"
                    ? "Possível alteração compatível com déficit hídrico"
                    : "Alteração em relação à linha de base individual"
                  : "Comportamento dentro da linha de base"}
            </h3>
            <p>
              {plant.state === "offline"
                ? "Dados insuficientes ou ausência de comunicação para estimar uma condição."
                : "Evidências demonstrativas: variação do sinal normalizado e mudança nas condições ambientais."}
            </p>
          </div>
          <div className="confidence-row">
            <span>
              Confiança da análise <CircleHelp size={13} />
            </span>
            <b>
              {plant.state === "offline"
                ? "Não estimável"
                : "Moderada · simulada"}
            </b>
          </div>
          <div className="quality-row">
            <span>Qualidade dos dados</span>
            <b>
              {plant.quality
                ? `${plant.quality}% · simulada`
                : "Sem dados recentes"}
            </b>
          </div>
          <div className="confidence-track">
            <i style={{ width: plant.state === "offline" ? "0%" : "64%" }} />
          </div>
          <div className="limitation-note">
            <ShieldCheck size={15} />
            <span>
              Hipótese sujeita à verificação humana. Não constitui recomendação
              de manejo.
            </span>
          </div>
          <button
            className="text-button full-link"
            onClick={onOpenAnalysis}
          >
            Ver análise completa <ArrowRight size={14} />
          </button>
        </section>
      </div>
      <div className="profile-detail-grid">
        <section className="panel profile-chart-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Sinal eletrofisiológico</div>
              <p>Série normalizada · unidade arbitrária (u.a.)</p>
            </div>
            <select className="small-select" aria-label="Período do sinal">
              <option>Últimas 24 horas</option>
              <option>Últimos 7 dias</option>
            </select>
          </div>
          <div className="signal-plot">
            <div className="plot-axis">
              <span>1,0</span>
              <span>0,5</span>
              <span>0,0</span>
              <span>-0,5</span>
              <span>-1,0</span>
            </div>
            <div className="plot-main">
              <div className="plot-grid">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 600 150"
                preserveAspectRatio="none"
                role="img"
                aria-label="Gráfico demonstrativo do sinal eletrofisiológico normalizado"
              >
                <path
                  d="M0 75 C20 54 28 93 46 76 S70 40 88 69 S112 97 131 75 S153 58 170 80 S194 105 211 72 S235 42 251 69 S272 91 289 76 S314 37 330 71 S350 105 368 77 S389 50 409 75 S431 95 449 72 S475 44 492 75 S519 101 537 72 S569 58 600 77"
                  fill="none"
                  stroke="#288654"
                  strokeWidth="2.3"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0 75 C20 54 28 93 46 76 S70 40 88 69 S112 97 131 75 S153 58 170 80 S194 105 211 72 S235 42 251 69 S272 91 289 76 S314 37 330 71 S350 105 368 77 S389 50 409 75 S431 95 449 72 S475 44 492 75 S519 101 537 72 S569 58 600 77"
                  fill="none"
                  stroke="#288654"
                  strokeOpacity=".12"
                  strokeWidth="9"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="plot-times">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>Agora</span>
              </div>
            </div>
          </div>
          <div className="trace-foot">
            <span>
              <i />
              Sinal processado · {samples.length} amostras
            </span>
            <span>
              Origem: {plant.deviceId}-S5 · qualidade {plant.quality}%
            </span>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Variáveis ambientais</div>
              <p>Última leitura · valores demonstrativos</p>
            </div>
            <button className="more-button" aria-label="Mais informações">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="profile-environment">
            <div>
              <Droplets />
              <span>Umidade do solo</span>
              <b>{plant.soil}%</b>
              <small>{plant.deviceId}-S1 · {LAST_READING}</small>
            </div>
            <div>
              <Thermometer />
              <span>Temperatura</span>
              <b>{plant.temperature.toFixed(1).replace(".", ",")}°C</b>
              <small>{plant.deviceId}-S2 · {LAST_READING}</small>
            </div>
            <div>
              <Wind />
              <span>Umidade do ar</span>
              <b>68%</b>
              <small>{plant.deviceId}-S3 · {LAST_READING}</small>
            </div>
          </div>
        </section>
      </div>
      <section className="panel history-panel">
        <div className="panel-heading">
          <div>
            <div className="panel-title">Histórico individual</div>
            <p>Eventos e observações vinculados a esta planta</p>
          </div>
          <button className="text-button" onClick={onAddNote}>
            <Plus size={14} /> Registrar evento
          </button>
        </div>
        {history.length ? (
          <div className="timeline">
            {history.map((e) => (
              <div className="timeline-item" key={e.id}>
                <div className="timeline-mark">
                  <History size={14} />
                </div>
                <div>
                  <strong>{e.type}</strong>
                  <p>{e.description}</p>
                  <small>
                    {e.date} · {e.person}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Ainda não há eventos registrados para esta planta.
          </div>
        )}
      </section>
    </>
  );
}
