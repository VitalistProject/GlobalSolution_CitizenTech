import { useState } from "react";
import { ChevronLeft, ChevronRight, Cpu, Leaf, Plus, Search } from "lucide-react";
import { stateLabel, type Plant } from "@/lib/siaf-data";
import { LAST_READING } from "@/lib/mock-session";
import { StatusTag } from "@/components/shared/status-tag";

export function PlantList({
  plants,
  onPlant,
  onAdd,
}: {
  plants: Plant[];
  onPlant: (id: string) => void;
  onAdd: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todas as condições");
  const [page, setPage] = useState(1);
  const filtered = plants.filter(
    (p) =>
      `${p.id} ${p.sector} ${p.variety} ${p.deviceId}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "Todas as condições" || stateLabel[p.state] === filter),
  );

  const size = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / size));


  return (
    <>
      <div className="page-toolbar">
        <label className="table-search">
          <Search size={16} />
          <input
            placeholder="Buscar por ID, setor ou dispositivo"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <select
          className="period-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Todas as condições</option>
          {Object.values(stateLabel).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="button-primary" onClick={onAdd}>
          <Plus size={16} /> Cadastrar planta
        </button>
      </div>
      <div className="panel table-panel">
        <div className="table-topline">
          <span>{filtered.length} plantas encontradas</span>
          <span>Dados demonstrativos · última leitura às {LAST_READING}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>IDENTIFICAÇÃO</th>
                <th>ESPÉCIE / VARIEDADE</th>
                <th>SETOR</th>
                <th>ESTÁGIO</th>
                <th>DISPOSITIVO</th>
                <th>CONDIÇÃO</th>
                <th>QUALIDADE</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * size, page * size).map((p) => (
                <tr key={p.id} onClick={() => onPlant(p.id)}>
                  <td>
                    <div className="table-plant">
                      <span className="plant-thumb">
                        <Leaf size={16} />
                      </span>
                      <strong>{p.id}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="species">
                      Tomate <i>· {p.variety}</i>
                    </span>
                  </td>
                  <td>{p.sector}</td>
                  <td>{p.stage}</td>
                  <td>
                    <span className="device-code">
                      <Cpu size={12} />
                      {p.deviceId}
                    </span>
                  </td>
                  <td>
                    <StatusTag state={p.state} />
                  </td>
                  <td>
                    <span className="quality-cell">
                      <i style={{ width: `${p.quality}%` }} />
                      {p.quality ? `${p.quality}%` : "—"}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pagination">
          <span>
            Exibindo {filtered.length ? (page - 1) * size + 1 : 0}–
            {Math.min(page * size, filtered.length)} de {filtered.length}{" "}
            plantas
          </span>
          <div>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft size={15} />
            </button>
            <span>
              {page} / {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
