import { ArrowRight, Lightbulb } from "lucide-react";

export function EngineView() {
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            MOTOR DE ANÁLISE · VERSÃO DEMONSTRATIVA
          </div>
          <h1>Motor de análise</h1>
          <p>Da coleta de dados à apresentação transparente de hipóteses.</p>
        </div>
        <span className="demo-badge large">
          SEM MODELO CIENTÍFICO CONECTADO
        </span>
      </div>
      <div className="engine-flow panel">
        {[
          { n: "01", t: "Recebimento", d: "Sinais e sensores" },
          { n: "02", t: "Qualidade", d: "Integridade dos dados" },
          { n: "03", t: "Processamento", d: "Normalização" },
          { n: "04", t: "Linha de base", d: "Contexto individual" },
          { n: "05", t: "Hipóteses", d: "Exige verificação" },
        ].map((x, i) => (
          <div className="engine-step" key={x.n}>
            <span>{x.n}</span>
            <b>{x.t}</b>
            <small>{x.d}</small>
            {i < 4 && <ArrowRight size={15} />}
          </div>
        ))}
      </div>
      <div className="engine-grid">
        <div className="panel analysis-result">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Análise ilustrativa · T-024</div>
              <p>17 nov. 2026 às 10:42 · valores simulados</p>
            </div>
            <span className="priority-label alta">Requer verificação</span>
          </div>
          <div className="analysis-hypothesis">
            <span>HIPÓTESE PRINCIPAL</span>
            <h2>Possível alteração compatível com déficit hídrico</h2>
            <p>
              Exemplo de interface para uma hipótese demonstrativa, não
              resultado de modelo científico validado.
            </p>
          </div>
          <div className="evidence-grid">
            <div>
              <b>Evidências demonstrativas</b>
              <p>
                Variação em relação à linha de base individual; umidade do
                solo simulada abaixo da faixa ilustrativa.
              </p>
            </div>
            <div>
              <b>Limitações e verificações</b>
              <p>
                Requer inspeção visual, conferência do sensor e contexto de
                manejo. Não recomenda irrigação.
              </p>
            </div>
          </div>
          <div className="confidence-row">
            <span>Confiança apresentada</span>
            <b>Moderada · simulada</b>
          </div>
        </div>
        <div className="panel contribution-panel">
          <div className="panel-title">Fontes consideradas</div>
          <p>
            Visualização demonstrativa de contribuição, sem inferência real.
          </p>
          {[
            { t: "Sinal eletrofisiológico", v: 82, c: "green" },
            { t: "Umidade do solo", v: 68, c: "amber" },
            { t: "Histórico individual", v: 46, c: "blue" },
            { t: "Qualidade do sinal", v: 91, c: "green" },
          ].map((x) => (
            <div className="contribution" key={x.t}>
              <span>{x.t}</span>
              <b>{x.v}%</b>
              <div>
                <i className={x.c} style={{ width: `${x.v}%` }} />
              </div>
            </div>
          ))}
          <div className="science-note">
            <Lightbulb size={14} /> Percentuais são apenas elementos visuais
            demonstrativos, não pesos do modelo.
          </div>
        </div>
      </div>
    </>
  );
}
