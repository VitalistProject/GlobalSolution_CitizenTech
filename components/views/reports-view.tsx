import { Activity, Download, FileText, Filter, Flower2, Signal } from "lucide-react";
import { sectors, type Plant, type Property } from "@/lib/siaf-data";
import { LAST_READING } from "@/lib/mock-session";
import { StatusTag } from "@/components/shared/status-tag";
import { MiniChart } from "@/components/shared/mini-chart";

export function ReportsView({ property, properties, plants, onPlant, onCsv, onSelectProperty }: {
  property: Property;
  properties: Property[];
  plants: Plant[];
  onPlant: (id: string) => void;
  onCsv: () => void;
  onSelectProperty: (id: string) => void;
}) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">DADOS PARA ACOMPANHAMENTO</div>
          <h1>Relatórios</h1>
          <p>Visualize e exporte um resumo dos dados demonstrativos.</p>
        </div>
        <button className="button-primary" onClick={onCsv}>
          <Download size={15} /> Exportar CSV
        </button>
      </div>
      <div className="report-filters panel">
        <div>
          <label>Propriedade</label>
          <select
            value={property.id}
            onChange={(event) => onSelectProperty(event.target.value)}
          >
            {properties.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Período</label>
          <select>
            <option>Últimas 24 horas</option>
            <option>Últimos 7 dias</option>
          </select>
        </div>
        <div>
          <label>Setor</label>
          <select>
            <option>Todos os setores</option>
            {sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="button-secondary" onClick={onCsv}>
          <Filter size={14} /> Aplicar filtros
        </button>
      </div>
      <div className="report-grid">
        <div className="panel report-card">
          <span className="report-icon">
            <Flower2 />
          </span>
          <span>PLANTAS MONITORADAS</span>
          <b>{plants.length}</b>
          <small>Atualizado às {LAST_READING} · dados demonstrativos</small>
          <MiniChart height={74} />
        </div>
        <div className="panel report-card">
          <span className="report-icon amber">
            <Activity />
          </span>
          <span>ALTERAÇÕES REGISTRADAS</span>
          <b>
            {
              plants.filter(
                (p) => p.state === "alert" || p.state === "observation",
              ).length
            }
          </b>
          <small>Dados ilustrativos</small>
          <MiniChart color="#d59d32" height={74} />
        </div>
        <div className="panel report-card">
          <span className="report-icon blue">
            <Signal />
          </span>
          <span>QUALIDADE MÉDIA</span>
          <b>
            96<small>%</small>
          </b>
          <small>Média simulada do sinal</small>
          <MiniChart color="#6a9fb8" height={74} />
        </div>
      </div>
      <div className="panel report-preview">
        <div className="panel-heading">
          <div>
            <div className="panel-title">Prévia do relatório</div>
            <p>Resumo por planta · valores de demonstração</p>
          </div>
          <button className="text-button" onClick={onCsv}>
            <Download size={14} /> Baixar CSV
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>PLANTA</th>
                <th>SETOR</th>
                <th>CONDIÇÃO</th>
                <th>UMIDADE DO SOLO</th>
                <th>QUALIDADE</th>
              </tr>
            </thead>
            <tbody>
              {plants.slice(0, 6).map((p) => (
                <tr key={p.id} onClick={() => onPlant(p.id)}>
                  <td>
                    <strong>{p.id}</strong>
                  </td>
                  <td>{p.sector}</td>
                  <td>
                    <StatusTag state={p.state} />
                  </td>
                  <td>{p.soil}%</td>
                  <td>{p.quality ? `${p.quality}%` : "Sem dados"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="science-note">
          <FileText size={15} /> Exportação CSV disponível. Relatório PDF
          requer integração futura.
        </div>
      </div>
    </>
  );
}
