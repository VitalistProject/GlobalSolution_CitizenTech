import { Settings2, ShieldCheck } from "lucide-react";

export function SettingsView() {
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">PREFERÊNCIAS DO AMBIENTE DEMONSTRATIVO</div>
          <h1>Configurações</h1>
          <p>Preferências locais desta sessão e informações do protótipo.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="panel settings-card">
          <span className="settings-icon">
            <Settings2 />
          </span>
          <h3>Preferências de visualização</h3>
          <p>Defina como os dados demonstrativos são exibidos para você.</p>
          <label className="setting-line">
            <span>Unidade de temperatura</span>
            <select>
              <option>Celsius (°C)</option>
              <option>Fahrenheit (°F)</option>
            </select>
          </label>
          <label className="setting-line">
            <span>Alertas no painel</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="setting-line">
            <span>Movimento reduzido</span>
            <input
              type="checkbox"
              onChange={(e) =>
                document.documentElement.classList.toggle(
                  "reduce-motion",
                  e.target.checked,
                )
              }
            />
          </label>
        </section>
        <section className="panel settings-card">
          <span className="settings-icon">
            <ShieldCheck />
          </span>
          <h3>Sobre os dados</h3>
          <p>
            O S.I.A.F. está em modo de demonstração. Dados, sensores e hipóteses
            apresentados são simulados.
          </p>
          <div className="settings-info">
            <span>Persistência</span>
            <b>Somente durante esta sessão</b>
          </div>
          <div className="settings-info">
            <span>Integração IoT</span>
            <b>Não conectada</b>
          </div>
          <div className="settings-info">
            <span>Modelo científico</span>
            <b>Não conectado</b>
          </div>
        </section>
      </div>
    </>
  );
}
