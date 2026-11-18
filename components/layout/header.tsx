import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  ChevronRight,
  Info,
  Menu,
  Search,
} from "lucide-react";
import { type Alert } from "@/lib/siaf-data";
import { CURRENT_USER } from "@/lib/mock-session";
import { IconButton } from "@/components/shared/icon-button";

const priorityIcon = {
  Alta: AlertTriangle,
  Média: AlertCircle,
  Baixa: Info,
} as const;

export function Header({
  propertyName,
  currentLabel,
  devicesOnline,
  devicesTotal,
  onMenu,
  onSearch,
  onAlerts,
  alerts,
  count,
  search,
  setSearch,
}: {
  propertyName: string;
  currentLabel: string;
  devicesOnline: number;
  devicesTotal: number;
  onMenu: () => void;
  onSearch: () => void;
  onAlerts: () => void;
  alerts: Alert[];
  count: number;
  search: string;
  setSearch: (v: string) => void;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const activeAlerts = alerts
    .filter(
      (alert) =>
        alert.status === "Requer verificação" || alert.status === "Em análise",
    )
    .slice(0, 4);
  const hiddenCount = Math.max(count - activeAlerts.length, 0);

  // fecha o painel ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!notificationsOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!notificationsRef.current?.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotificationsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notificationsOpen]);

  const openAlerts = () => {
    setNotificationsOpen(false);
    onAlerts();
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <IconButton label="Abrir navegação" onClick={onMenu}>
          <Menu size={19} />
        </IconButton>
        <span className="breadcrumb-dash">{propertyName}</span>
        <ChevronRight size={14} className="header-chevron" />
        <span className="breadcrumb-current">{currentLabel}</span>
      </div>
      <div className="header-right">
        <div className="connectivity">
          <span className="connection-pulse" /> <span>Dispositivos</span>{" "}
          <b>
            {devicesOnline}/{devicesTotal}
          </b>
        </div>
        <label className="global-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229 &&
              onSearch()
            }
            placeholder="Buscar planta, setor…"
            aria-label="Buscar planta ou setor"
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="notification-wrap" ref={notificationsRef}>
          <IconButton
            label={
              notificationsOpen
                ? "Fechar notificações"
                : "Ver notificações recentes"
            }
            onClick={() => setNotificationsOpen((value) => !value)}
          >
            <Bell size={18} />
            {count > 0 && <span className="notification-count">{count}</span>}
          </IconButton>
          {notificationsOpen && (
            <div
              className="notification-popover"
              role="region"
              aria-label="Notificações recentes"
            >
              <div className="notification-heading">
                <strong>Notificações</strong>
                {count > 0 && (
                  <span>
                    {count} {count === 1 ? "pendente" : "pendentes"}
                  </span>
                )}
              </div>

              {activeAlerts.length ? (
                <ul className="notification-list">
                  {activeAlerts.map((alert) => {
                    const Icon = priorityIcon[alert.priority];
                    return (
                      <li key={alert.id}>
                        <button
                          type="button"
                          className="notification-item"
                          data-priority={alert.priority}
                          onClick={openAlerts}
                        >
                          <span className="notification-item-icon">
                            <Icon size={16} />
                          </span>
                          <span className="notification-item-body">
                            <span className="notification-item-title">
                              {alert.title}
                            </span>
                            <span className="notification-item-meta">
                              <span>{alert.plantId}</span>
                              <span>{alert.sector}</span>
                              <span>{alert.time}</span>
                            </span>
                          </span>
                          <span className="notification-item-tag">
                            {alert.priority}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="notification-empty">
                  Nenhuma notificação pendente.
                </p>
              )}

              <div className="notification-footer">
                <button
                  type="button"
                  className="notification-open"
                  onClick={openAlerts}
                >
                  {hiddenCount > 0
                    ? `Ver todas (mais ${hiddenCount})`
                    : "Abrir central de alertas"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="user-menu" aria-label="Usuário conectado">
          <span className="user-avatar">{CURRENT_USER.initials}</span>
          <span className="user-name">{CURRENT_USER.name}</span>
        </div>
      </div>
    </header>
  );
}