import { AlertCircle, CheckCircle2, Droplets, Thermometer, Wifi, Zap } from "lucide-react";
import { type Plant } from "@/lib/siaf-data";

export function DevicesView({ plants }: {
  plants: Plant[];
}) {
  const offlineDevices = plants.filter((p) => p.state === "offline");
  const onlineDevices = plants.filter((p) => p.state !== "offline");

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">INVENTÁRIO DE HARDWARE</div>
          <h1>Dispositivos e sensores</h1>
          <p>Rastreamento de conectividade de nós distributivos.</p>
        </div>
        <span className="connection-status">
          <span className="connection-pulse" /> {onlineDevices.length} de{" "}
          {plants.length} conectados
        </span>
      </div>
      <div className="device-summary">
        <div className="summary-stat">
          <span className="stat-label">Online</span>
          <b>{onlineDevices.length}</b>
        </div>
        <div
          className={`summary-stat ${offlineDevices.length > 0 ? "critical" : ""}`}
        >
          <span className="stat-label">Offline</span>
          <b>{offlineDevices.length}</b>
        </div>
      </div>
      <div className="device-sections">
        <section>
          <h3>Nós Conectados ({onlineDevices.length})</h3>
          <div className="device-grid">
            {onlineDevices.map((p, i) => (
              <div className="panel device-card" key={p.id}>
                <div className="device-top">
                  <span className="device-icon">
                    <CheckCircle2 size={18} />
                  </span>
                  <span className="device-state online">
                    <i />
                    Ativo
                  </span>
                </div>
                <h3>{p.deviceId}</h3>
                <p>
                  {p.id} · {p.sector}
                </p>
                <div className="device-specs">
                  <span>
                    Modelo<b>SIA Node v2</b>
                  </span>
                  <span>
                    Firmware<b>1.4.2-demo</b>
                  </span>
                  <span>
                    Bateria<b>86%</b>
                  </span>
                  <span>
                    Última comunicação<b>há 2 min</b>
                  </span>
                </div>
                <div className="sensor-chips">
                  <span>
                    <Zap size={11} />
                    Eletrofisiologia
                  </span>
                  <span>
                    <Droplets size={11} />
                    Umidade do solo
                  </span>
                  <span>
                    <Thermometer size={11} />
                    Temperatura
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {offlineDevices.length > 0 && (
          <section>
            <h3>Nós Offline ({offlineDevices.length})</h3>
            <div className="device-grid">
              {offlineDevices.map((p) => (
                <div className="panel device-card offline" key={p.id}>
                  <div className="device-top">
                    <span className="device-icon">
                      <AlertCircle size={18} />
                    </span>
                    <span className="device-state offline">
                      <i />
                      Sem comunicação
                    </span>
                  </div>
                  <h3>{p.deviceId}</h3>
                  <p>
                    {p.id} · {p.sector}
                  </p>
                  <div className="device-specs">
                    <span>
                      Modelo<b>SIA Node v2</b>
                    </span>
                    <span>
                      Firmware<b>1.4.2-demo</b>
                    </span>
                    <span>
                      Bateria<b>—</b>
                    </span>
                    <span>
                      Última comunicação<b>há 42 min</b>
                    </span>
                  </div>
                  <div className="sensor-chips offline">
                    <span>
                      <Zap size={11} />
                      Eletrofisiologia
                    </span>
                    <span>
                      <Droplets size={11} />
                      Umidade do solo
                    </span>
                    <span>
                      <Thermometer size={11} />
                      Temperatura
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="science-note wide">
        <Wifi size={15} /> Dados de nós conectados, bateria e última
        comunicação são demonstrativos.
      </div>
    </>
  );
}
