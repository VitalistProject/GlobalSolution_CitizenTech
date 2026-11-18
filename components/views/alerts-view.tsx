import { useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Clock3, Lightbulb, ShieldCheck, X } from "lucide-react";
import { type Alert, type Plant } from "@/lib/siaf-data";

function AlertReviewDialog({
  alert,
  status,
  note,
  setNote,
  onCancel,
  onSubmit,
}: {
  alert: Alert;
  status: Alert["status"];
  note: string;
  setNote: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const title =
    status === "Em análise"
      ? "Iniciar análise"
      : status === "Verificação registrada"
        ? "Registrar resultado da verificação"
        : "Rejeitar hipótese";


  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <form
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        onSubmit={onSubmit}
      >
        <button
          type="button"
          className="dialog-close"
          onClick={onCancel}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        <div className="dialog-icon">
          <ShieldCheck size={20} />
        </div>
        <h2 id="review-dialog-title">{title}</h2>
        <p>
          {alert.plantId} · {alert.title}. Registre o que foi verificado antes
          de confirmar.
        </p>
        <label className="form-label">
          Registro da revisão
          <textarea
            autoFocus
            required
            minLength={8}
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex.: inspeção visual realizada; sensor conferido; evidências observadas…"
          />
        </label>
        <div className="dialog-demo">
          <Lightbulb size={14} /> A decisão e o contexto ficam vinculados a esta
          ocorrência nesta sessão.
        </div>
        <div className="dialog-actions">
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="button-primary">
            Confirmar ação
          </button>
        </div>
      </form>
    </div>
  );
}

export function AlertsView({
  alerts,
  plants,
  onReview,
  onPlant,
}: {
  alerts: Alert[];
  plants: Plant[];
  onReview: (alert: Alert, status: Alert["status"], note?: string) => void;
  onPlant: (id: string) => void;
}) {
  const [filter, setFilter] = useState("Todos");

  const [reviewing, setReviewing] = useState<{
    alert: Alert;
    status: Alert["status"];
  } | null>(null);

  const [reviewNote, setReviewNote] = useState("");

  const list = alerts.filter((a) => filter === "Todos" || a.status === filter);

  const openReview = (alert: Alert, status: Alert["status"]) => {
    setReviewNote("");
    setReviewing({ alert, status });
  };

  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewing || reviewNote.trim().length < 8) return;
    onReview(reviewing.alert, reviewing.status, reviewNote.trim());
    setReviewing(null);
    setReviewNote("");
  };


  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">CENTRAL DE OCORRÊNCIAS</div>
          <h1>Alertas e verificações</h1>
          <p>Registre o que foi observado antes de concluir uma verificação.</p>
        </div>
        <select
          className="period-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Todos</option>
          <option>Requer verificação</option>
          <option>Em análise</option>
          <option>Verificação registrada</option>
          <option>Hipótese rejeitada</option>
        </select>
      </div>
      <div className="alert-summary">
        <div>
          <AlertTriangle />
          <b>
            {
              alerts.filter(
                (a) =>
                  a.priority === "Alta" && a.status === "Requer verificação",
              ).length
            }
          </b>
          <span>Prioridade alta</span>
        </div>
        <div>
          <Clock3 />
          <b>
            {alerts.filter((a) => a.status === "Requer verificação").length}
          </b>
          <span>Aguardando análise</span>
        </div>
        <div>
          <CheckCircle2 />
          <b>
            {alerts.filter((a) => a.status === "Verificação registrada").length}
          </b>
          <span>Verificações registradas</span>
        </div>
      </div>
      <div className="panel alerts-table">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>OCORRÊNCIA</th>
                <th>PLANTA / SETOR</th>
                <th>PRIORIDADE</th>
                <th>STATUS</th>
                <th>REVISÃO HUMANA</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const plant = plants.find((p) => p.id === a.plantId);
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      <small className="table-sub">
                        {a.type} · hoje às {a.time}
                      </small>
                      {a.reviewNote && (
                        <small className="review-note">
                          Registro: {a.reviewNote}
                        </small>
                      )}
                    </td>
                    <td>
                      <button
                        className="link-cell"
                        onClick={() => onPlant(a.plantId)}
                      >
                        {a.plantId} · {plant?.sector}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`priority-label ${a.priority.toLowerCase()}`}
                      >
                        {a.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-tag ${a.status === "Requer verificação" ? "alert" : a.status === "Verificação registrada" ? "baseline" : a.status === "Hipótese rejeitada" ? "offline" : "observation"}`}
                      >
                        <i />
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "Requer verificação" ||
                      a.status === "Em análise" ? (
                        <div className="row-actions">
                          {a.status === "Requer verificação" && (
                            <button onClick={() => openReview(a, "Em análise")}>
                              Iniciar análise
                            </button>
                          )}
                          <button
                            className="action-confirm"
                            onClick={() =>
                              openReview(a, "Verificação registrada")
                            }
                          >
                            Registrar resultado
                          </button>
                          <button
                            className="action-reject"
                            onClick={() => openReview(a, "Hipótese rejeitada")}
                          >
                            Rejeitar hipótese
                          </button>
                        </div>
                      ) : (
                        <span className="done-label">
                          <Check size={13} />
                          {a.reviewedAt
                            ? `Registrado ${a.reviewedAt}`
                            : "Encerrado"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="science-note">
          <Lightbulb size={15} /> Cada mudança exige uma nota de inspeção ou a
          justificativa da rejeição; nenhuma hipótese gera recomendação
          automática de manejo.
        </div>
      </div>
      {reviewing && (
        <AlertReviewDialog
          alert={reviewing.alert}
          status={reviewing.status}
          note={reviewNote}
          setNote={setReviewNote}
          onCancel={() => setReviewing(null)}
          onSubmit={submitReview}
        />
      )}
    </>
  );
}
