import type { FormEvent, ReactNode } from "react";
import { CircleHelp, X } from "lucide-react";

export function DialogFrame({
  icon,
  title,
  description,
  submitLabel,
  onClose,
  onSubmit,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="dialog-card" onSubmit={onSubmit}>
        <button
          type="button"
          className="dialog-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        <div className="dialog-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
        <div className="dialog-demo">
          <CircleHelp size={14} /> Registro demonstrativo; não será
          sincronizado com outros usuários.
        </div>
        <div className="dialog-actions">
          <button type="button" className="button-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
