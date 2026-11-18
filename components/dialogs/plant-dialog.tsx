import { useState, type FormEvent } from "react";
import { Flower2 } from "lucide-react";
import { sectors } from "@/lib/siaf-data";
import { DialogFrame } from "@/components/dialogs/dialog-frame";

export function PlantDialog({
  existingIds,
  defaultSector,
  onCreate,
  onClose,
}: {
  existingIds: string[];
  defaultSector: string;
  onCreate: (data: { id: string; sector: string }) => void;
  onClose: () => void;
}) {
  const [plantId, setPlantId] = useState("");
  const [sector, setSector] = useState(defaultSector);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = plantId.trim().toUpperCase();
    if (!id) return;

    if (existingIds.includes(id)) {
      setError("Este identificador já está cadastrado.");
      return;
    }
    onCreate({ id, sector });
  };

  return (
    <DialogFrame
      icon={<Flower2 size={20} />}
      title="Cadastrar planta"
      description="O cadastro ficará disponível nesta sessão. O vínculo do dispositivo pode ser feito posteriormente."
      submitLabel="Cadastrar planta"
      onClose={onClose}
      onSubmit={submit}
    >
      <label className="form-label">
        Identificador da planta
        <input
          required
          pattern="[A-Za-z]-[0-9]{3}"
          title="Use o formato T-049"
          value={plantId}
          aria-invalid={error !== ""}
          onChange={(e) => {
            setError("");
            setPlantId(e.target.value);
          }}
          placeholder="Ex.: T-049"
        />
        {error && (
          <small className="form-error" role="alert">
            {error}
          </small>
        )}
      </label>
      <label className="form-label">
        Setor
        <select value={sector} onChange={(e) => setSector(e.target.value)}>
          {sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </DialogFrame>
  );
}
