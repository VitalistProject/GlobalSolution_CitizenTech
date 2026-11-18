import { useState, type FormEvent } from "react";
import { History } from "lucide-react";
import type { Plant } from "@/lib/siaf-data";
import { DialogFrame } from "@/components/dialogs/dialog-frame";

const EVENT_TYPES = [
  "Inspeção visual",
  "Irrigação",
  "Adubação",
  "Poda ou tutoramento",
  "Calibração do sensor",
  "Aplicação de defensivo",
  "Outro",
];

// valor para <input type="datetime-local"> no fuso do usuário
function nowForInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export type NewEvent = {
  plantId: string;
  type: string;
  date: string;
  note: string;
};

export function EventDialog({
  plants,
  initialPlantId,
  onCreate,
  onClose,
}: {
  plants: Plant[];
  initialPlantId: string;
  onCreate: (event: NewEvent) => void;
  onClose: () => void;
}) {
  const [plantId, setPlantId] = useState(initialPlantId);
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [date, setDate] = useState(nowForInput);
  const [note, setNote] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!plantId || !note.trim()) return;
    onCreate({ plantId, type, date, note: note.trim() });
  };

  return (
    <DialogFrame
      icon={<History size={20} />}
      title="Registrar evento"
      description="Vincule o registro a uma planta e informe o tipo, o momento e o contexto da atividade."
      submitLabel="Registrar evento"
      onClose={onClose}
      onSubmit={submit}
    >
      <label className="form-label">
        Planta
        <select
          required
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
        >
          <option value="">Selecionar planta</option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.id}>
              {plant.id} · {plant.sector}
            </option>
          ))}
        </select>
      </label>
      <label className="form-label">
        Tipo de evento
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="form-label">
        Data e hora
        <input
          required
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label className="form-label">
        O que foi observado ou realizado
        <textarea
          required
          minLength={8}
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Registre evidências, ação realizada e contexto…"
        />
      </label>
    </DialogFrame>
  );
}
