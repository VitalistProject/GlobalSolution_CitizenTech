"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Clock3 } from "lucide-react";
import {
  initialAlerts,
  initialTimeline,
  plants as seedPlants,
  properties as propertySeeds,
  sectors,
  type Alert,
} from "@/lib/siaf-data";
import { exportPlantsCsv } from "@/lib/export-csv";
import { CURRENT_USER } from "@/lib/mock-session";
import { viewLabels, type View } from "@/lib/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { EventDialog, type NewEvent } from "@/components/dialogs/event-dialog";
import { PlantDialog } from "@/components/dialogs/plant-dialog";
import { MonitoringDashboard } from "@/components/monitoring-dashboard";
import { AlertsView } from "@/components/views/alerts-view";
import { AnalysisMap } from "@/components/views/analysis-map";
import { Dashboard } from "@/components/views/dashboard";
import { DevicesView } from "@/components/views/devices-view";
import { EngineView } from "@/components/views/engine-view";
import { IntelligenceAnalysis } from "@/components/views/intelligence-analysis";
import { PlantProfile } from "@/components/views/plant-profile";
import { PlantsView } from "@/components/views/plants-view";
import { ReportsView } from "@/components/views/reports-view";
import { SettingsView } from "@/components/views/settings-view";

const ALL_SECTORS = "Todos os setores";

type DialogState = { kind: "plant" } | { kind: "event"; plantId: string } | null;

export function SiafApp() {
  const [view, setView] = useState<View>("overview");
  const [plants, setPlants] = useState(seedPlants);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    propertySeeds[0].id,
  );
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [sector, setSector] = useState(ALL_SECTORS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const mainRef = useRef<HTMLElement>(null);

  const currentProperty =
    propertySeeds.find((property) => property.id === selectedPropertyId) ??
    propertySeeds[0];

  const propertyPlants = useMemo(
    () => plants.filter((plant) => plant.propertyId === selectedPropertyId),
    [plants, selectedPropertyId],
  );

  const filteredPlants = useMemo(
    () =>
      sector === ALL_SECTORS
        ? propertyPlants
        : propertyPlants.filter((p) => p.sector === sector),
    [propertyPlants, sector],
  );

  const propertyAlerts = useMemo(
    () =>
      alerts.filter((alert) =>
        propertyPlants.some((plant) => plant.id === alert.plantId),
      ),
    [alerts, propertyPlants],
  );

  const alertCount = propertyAlerts.filter(
    (a) => a.status === "Requer verificação" || a.status === "Em análise",
  ).length;

  const devicesOnline = propertyPlants.filter(
    (p) => p.state !== "offline",
  ).length;

  const currentPlant = selectedPlant
    ? propertyPlants.find((p) => p.id === selectedPlant)
    : undefined;

  // pequena animação de entrada a cada troca de tela
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-content > *",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.36, stagger: 0.035, ease: "power2.out" },
      );
    }, mainRef);
    return () => ctx.revert();
  }, [view, selectedPlant]);

  const navigate = (next: View) => {
    setSelectedPlant(null);
    setView(next);
    setSidebarOpen(false);
  };

  const openPlant = (id: string) => {
    setSelectedPlant(id);
    setView("plants");
    setSidebarOpen(false);
  };

  const selectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setSelectedPlant(null);
    setSector(ALL_SECTORS);
    setSidebarOpen(false);
  };

  const reviewAlert = (
    alert: Alert,
    status: Alert["status"],
    note?: string,
  ) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              status,
              reviewNote: note,
              reviewedAt: new Date().toLocaleString("pt-BR"),
            }
          : a,
      ),
    );
  };

  const registerPlant = ({ id, sector: plantSector }: { id: string; sector: string }) => {
    setPlants((prev) => [
      {
        id,
        propertyId: selectedPropertyId,
        sector: plantSector,
        species: "Solanum lycopersicum",
        variety: currentProperty.crop,
        stage: "Vegetativo",
        state: "offline",
        deviceId: "Aguardando vínculo",
        quality: 0,
        soil: 0,
        temperature: 0,
        registered: new Date().toLocaleDateString("pt-BR"),
      },
      ...prev,
    ]);
    setDialog(null);
    openPlant(id);
  };

  const registerEvent = ({ plantId, type, date, note }: NewEvent) => {
    const at = new Date(date);
    const time = at.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTimeline((prev) => [
      {
        id: `H-${Date.now()}`,
        plantId,
        type,
        description: note,
        date: `${at.toLocaleDateString("pt-BR")} · ${time}`,
        person: CURRENT_USER.name,
      },
      ...prev,
    ]);
    setDialog(null);
  };

  const searchAction = () => {
    const term = search.trim().toLowerCase();
    const found = propertyPlants.find(
      (p) => p.id.toLowerCase() === term || p.sector.toLowerCase().includes(term),
    );
    if (found) openPlant(found.id);
    else navigate("plants");
  };

  const renderPage = () => {
    if (selectedPlant && currentPlant) {
      return (
        <PlantProfile
          plant={currentPlant}
          plants={propertyPlants}
          timeline={timeline}
          onBack={() => setSelectedPlant(null)}
          onAddNote={() => setDialog({ kind: "event", plantId: selectedPlant })}
          onOpenAnalysis={() => navigate("engine")}
        />
      );
    }

    switch (view) {
      case "overview":
        return (
          <Dashboard
            property={currentProperty}
            plants={filteredPlants}
            allPlants={propertyPlants}
            alerts={propertyAlerts}
            onPlant={openPlant}
            onAlerts={() => navigate("alerts")}
            sector={sector}
            setSector={setSector}
            setView={navigate}
          />
        );
      case "map":
        return (
          <AnalysisMap
            property={currentProperty}
            plants={filteredPlants}
            alerts={propertyAlerts}
            sector={sector}
            onSector={setSector}
            onPlant={openPlant}
          />
        );
      case "plants":
        return (
          <PlantsView
            plants={filteredPlants}
            onPlant={openPlant}
            onAdd={() => setDialog({ kind: "plant" })}
          />
        );
      case "monitoring":
        return (
          <MonitoringDashboard property={currentProperty} plants={filteredPlants} />
        );
      case "analysis":
        return (
          <IntelligenceAnalysis
            property={currentProperty}
            plants={propertyPlants}
            alerts={propertyAlerts}
            onPlant={openPlant}
          />
        );
      case "engine":
        return <EngineView />;
      case "alerts":
        return (
          <AlertsView
            alerts={propertyAlerts}
            plants={propertyPlants}
            onReview={reviewAlert}
            onPlant={openPlant}
          />
        );
      case "reports":
        return (
          <ReportsView
            property={currentProperty}
            properties={propertySeeds}
            plants={filteredPlants}
            onPlant={openPlant}
            onCsv={() => exportPlantsCsv(propertyPlants)}
            onSelectProperty={selectProperty}
          />
        );
      case "devices":
        return <DevicesView plants={propertyPlants} />;
      case "settings":
        return <SettingsView />;
    }
  };

  return (
    <div className={`siaf-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      <Sidebar
        currentView={view}
        plantOpen={selectedPlant !== null}
        alertCount={alertCount}
        properties={propertySeeds}
        currentProperty={currentProperty}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={selectProperty}
        onNavigate={navigate}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-frame">
        <Header
          propertyName={currentProperty.name}
          currentLabel={viewLabels[selectedPlant ? "plants" : view]}
          devicesOnline={devicesOnline}
          devicesTotal={propertyPlants.length}
          onMenu={() => setSidebarOpen(true)}
          onSearch={searchAction}
          onAlerts={() => navigate("alerts")}
          alerts={propertyAlerts}
          count={alertCount}
          search={search}
          setSearch={setSearch}
        />
        <main className="main-content" ref={mainRef}>
          <div className="context-strip">
            <span className="context-dot" />
            <span>{currentProperty.name}</span>
            <span>/</span>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              aria-label="Filtrar por setor"
            >
              <option>{ALL_SECTORS}</option>
              {sectors.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <span className="context-updated">
              <Clock3 size={12} /> Atualizado há 2 min{" "}
              <span className="context-divider" />{" "}
              <span className="context-demo">DADOS DE DEMONSTRAÇÃO</span>
            </span>
          </div>
          <div className="page-content">{renderPage()}</div>
        </main>
        <footer className="app-footer">
          <span>
            © 2026 S.I.A.F. <span>·</span> Plataforma de inteligência fitológica
          </span>
          <span>
            Ambiente demonstrativo <i />
          </span>
        </footer>
      </div>
      {dialog?.kind === "plant" && (
        <PlantDialog
          existingIds={plants.map((p) => p.id)}
          defaultSector={sector === ALL_SECTORS ? sectors[0] : sector}
          onCreate={registerPlant}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "event" && (
        <EventDialog
          plants={propertyPlants}
          initialPlantId={dialog.plantId}
          onCreate={registerEvent}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
