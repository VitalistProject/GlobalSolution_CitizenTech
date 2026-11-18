import { useState } from "react";
import { Activity, Check, ChevronDown, Leaf, Map, Settings2, X } from "lucide-react";
import { type Property } from "@/lib/siaf-data";
import { CURRENT_USER } from "@/lib/mock-session";
import { navGroups, viewLabels, type View } from "@/lib/navigation";

export function Sidebar({
  currentView,
  plantOpen,
  alertCount,
  properties,
  currentProperty,
  selectedPropertyId,
  onSelectProperty,
  onNavigate,
  onClose,
}: {
  currentView: View;
  plantOpen: boolean;
  alertCount: number;
  properties: Property[];
  currentProperty: Property;
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  onNavigate: (view: View) => void;
  onClose: () => void;
}) {
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <span className="brand-symbol">
          <Leaf size={21} />
        </span>
        <div>
          <b>S.I.A.F.</b>
          <small>INTELIGÊNCIA FITOLÓGICA</small>
        </div>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>
      <div className="property-picker">
        <button
          type="button"
          className="property-switch"
          aria-expanded={propertyMenuOpen}
          aria-haspopup="menu"
          onClick={() => setPropertyMenuOpen((value) => !value)}
        >
          <span className="property-switch-icon">
            <Map size={15} />
          </span>
          <span>
            <small>PROPRIEDADE ATUAL</small>
            <b>{currentProperty.name}</b>
          </span>
          <ChevronDown size={15} />
        </button>
        {propertyMenuOpen && (
          <div
            className="property-menu"
            role="menu"
            aria-label="Selecionar propriedade"
          >
            {properties.map((item) => (
              <button
                type="button"
                role="menuitemradio"
                aria-checked={item.id === selectedPropertyId}
                className={item.id === selectedPropertyId ? "selected" : ""}
                key={item.id}
                onClick={() => {
                    onSelectProperty(item.id);
                    setPropertyMenuOpen(false);
                  }}
              >
                <span className="property-menu-icon">
                  <Map size={14} />
                </span>
                <span className="property-menu-name">
                  <b>{item.name}</b>
                  <small>
                    {item.location} · {item.area}
                  </small>
                </span>
                {item.id === selectedPropertyId && <Check size={15} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="nav-scroll">
        {navGroups.map((group) => (
          <div className="nav-section" key={group.label}>
            <span className="nav-caption">{group.label}</span>
            {group.items.map((item) => (
              <button
                className={`nav-item ${currentView === item.view && !plantOpen ? "active" : ""}`}
                key={item.view}
                onClick={() => onNavigate(item.view)}
              >
                <item.icon size={17} />
                <span>{viewLabels[item.view]}</span>
                {item.view === "alerts" && alertCount > 0 && (
                  <b className="nav-count">{alertCount}</b>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button
        className={`nav-item settings-nav ${currentView === "settings" ? "active" : ""}`}
        onClick={() => onNavigate("settings")}
      >
        <Settings2 size={17} />
        <span>Configurações</span>
      </button>
      <div className="sidebar-bottom">
        <div className="demo-mode">
          <span className="demo-mode-icon">
            <Activity size={15} />
          </span>
          <span>
            <b>Ambiente demonstrativo</b>
            <small>Dados simulados nesta sessão</small>
          </span>
          <span className="demo-mode-dot" />
        </div>
        <div className="account-button">
          <span className="user-avatar">{CURRENT_USER.initials}</span>
          <span>
            <b>{CURRENT_USER.name}</b>
            <small>{CURRENT_USER.role}</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
