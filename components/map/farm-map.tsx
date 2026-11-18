import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, LocateFixed, Map, Settings2, ZoomIn, ZoomOut } from "lucide-react";
import { stateLabel, type Plant, type PlantState, type Property } from "@/lib/siaf-data";

const stateColor: Record<PlantState, string> = {
  baseline: "#329365",
  observation: "#d59d32",
  alert: "#dc7657",
  offline: "#89948b",
};

export function FarmMap({
  property,
  plants,
  onSelect,
  selectedSector,
  onSector,
}: {
  property: Property;
  plants: Plant[];
  onSelect: (id: string) => void;
  selectedSector: string;
  onSector: (v: string) => void;
}) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [showPlants, setShowPlants] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showAerial, setShowAerial] = useState(true);
  const [showStress, setShowStress] = useState(true);
  const [mapView, setMapView] = useState({ x: 0, y: 0, scale: 1 });


  const dragStart = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const zoomMap = (delta: number) =>
    setMapView((current) => ({
      ...current,
      scale: Math.min(2.7, Math.max(1, current.scale + delta)),
    }));

  const resetMap = () => setMapView({ x: 0, y: 0, scale: 1 });
  const startMapDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest(".map-sector,.map-marker,button"))
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: mapView.x,
      offsetY: mapView.y,
    };
  };

  const moveMap = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const maxX = (bounds.width * (mapView.scale - 1)) / 2 + 80;
    const maxY = (bounds.height * (mapView.scale - 1)) / 2 + 60;
    setMapView((current) => ({
      ...current,
      x: Math.max(
        -maxX,
        Math.min(
          maxX,
          dragStart.current!.offsetX + event.clientX - dragStart.current!.x,
        ),
      ),
      y: Math.max(
        -maxY,
        Math.min(
          maxY,
          dragStart.current!.offsetY + event.clientY - dragStart.current!.y,
        ),
      ),
    }));
  };

  const stopMapDrag = () => {
    dragStart.current = null;
  };

  const zoomMapAtWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomMap(event.deltaY < 0 ? 0.12 : -0.12);
  };

  const plantMapPoint = (index: number) => {
    const sectorIndex = Math.floor(index / 8);
    const localIndex = index % 8;
    const x =
      sectorIndex < 2
        ? 218 + (localIndex % 4) * 55
        : sectorIndex % 2 === 0
          ? 400 + (localIndex % 4) * 29
          : 535 + (localIndex % 4) * 30;
    const y =
      sectorIndex === 0
        ? 91 + Math.floor(localIndex / 4) * 34
        : sectorIndex === 1
          ? 174 + Math.floor(localIndex / 4) * 34
          : sectorIndex === 2 || sectorIndex === 3
            ? 92 + Math.floor(localIndex / 4) * 48
            : 174 + Math.floor(localIndex / 4) * 43;
    return { x, y };
  };


  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".map-sector",
        { opacity: 0.65, scale: 0.97, transformOrigin: "center center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    }, mapRef);
    return () => context.revert();
  }, [showAerial]);


  return (
    <div className="map-visual">
      <div className="map-tools">
        <span className="map-location">
          <Map size={14} /> {property.location}{" "}
          <span className="coord-label">ÁREA SIMULADA</span>
        </span>
        <div className="map-layer-wrap">
          <button
            className="map-layer"
            aria-expanded={layersOpen}
            onClick={() => setLayersOpen((value) => !value)}
          >
            <Settings2 size={14} /> Camadas <ChevronDown size={13} />
          </button>
          {layersOpen && (
            <div className="layer-menu">
              <label>
                <input
                  type="checkbox"
                  checked={showPlants}
                  onChange={(e) => setShowPlants(e.target.checked)}
                />{" "}
                Plantas e sensores
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={(e) => setShowIncidents(e.target.checked)}
                />{" "}
                Ocorrências
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showAerial}
                  onChange={(e) => setShowAerial(e.target.checked)}
                />{" "}
                Imagem aérea simulada
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showStress}
                  onChange={(e) => setShowStress(e.target.checked)}
                />{" "}
                Estresse da cultura
              </label>
              <span>Mapa demonstrativo · sem georreferenciamento</span>
            </div>
          )}
        </div>
      </div>
      <div
        className={`map-stage ${showAerial ? "has-aerial" : ""}`}
        ref={mapRef}
        onPointerDown={startMapDrag}
        onPointerMove={moveMap}
        onPointerUp={stopMapDrag}
        onPointerCancel={stopMapDrag}
        onWheel={zoomMapAtWheel}
      >
        <div
          className="map-tile-layer"
          style={{
            transform: `translate3d(${mapView.x}px, ${mapView.y}px, 0) scale(${mapView.scale})`,
          }}
        >
          <img
            className="map-aerial"
            src={property.mapImage}
            alt={`Imagem aérea simulada de ${property.name}, com duas estufas e quatro talhões`}
            loading="lazy"
            style={{ opacity: showAerial ? 1 : 0 }}
          />
          <svg
            viewBox="0 0 720 350"
            className="farm-svg"
            role="img"
            aria-label={`Mapa demonstrativo de ${property.name} com duas estufas e quatro talhões selecionáveis`}
          >
            <defs>
              <pattern
                id="rows"
                width="10"
                height="10"
                patternTransform="rotate(23)"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 0 10"
                  stroke="#8bac83"
                  strokeWidth="2"
                  opacity=".45"
                />
              </pattern>
              <pattern
                id="rows2"
                width="12"
                height="12"
                patternTransform="rotate(-18)"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 0 12"
                  stroke="#a2b98e"
                  strokeWidth="2"
                  opacity=".45"
                />
              </pattern>
              <radialGradient id="crop-stress">
                <stop stopColor="#e65d5d" stopOpacity=".95" />
                <stop offset=".48" stopColor="#f3c64e" stopOpacity=".65" />
                <stop offset="1" stopColor="#48c978" stopOpacity=".1" />
              </radialGradient>
            </defs>
            <rect
              width="720"
              height="350"
              rx="15"
              fill="#e8eee4"
              opacity={showAerial ? 0 : 1}
            />
            {showStress &&
              plants
                .filter(
                  (plant) =>
                    plant.state === "alert" || plant.state === "observation",
                )
                .map((plant) => {
                  const point = plantMapPoint(
                    plants.findIndex((item) => item.id === plant.id),
                  );
                  return (
                    <g key={`stress-${plant.id}`}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={plant.state === "alert" ? 36 : 24}
                        fill="url(#crop-stress)"
                        pointerEvents="none"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={plant.state === "alert" ? 36 : 24}
                        fill="none"
                        stroke={plant.state === "alert" ? "#dc7657" : "#d59d32"}
                        strokeWidth={plant.state === "alert" ? 2.5 : 1.8}
                        opacity={plant.state === "alert" ? 0.9 : 0.7}
                        pointerEvents="none"
                      />
                    </g>
                  );
                })}
            {[
              {
                name: "Estufa A",
                d: "M194 72 l198 3 -4 76 -198 -3z",
                x: 292,
                y: 112,
                p: "url(#rows)",
              },
              {
                name: "Estufa B",
                d: "M194 157 l198 0 0 76 -198 0z",
                x: 293,
                y: 195,
                p: "url(#rows2)",
              },
              {
                name: "Talhão 01",
                d: "M387 74 l130 0 4 83 -134 -3z",
                x: 453,
                y: 116,
                p: "url(#rows2)",
              },
              {
                name: "Talhão 02",
                d: "M522 75 l148 -2 7 89 -150 0z",
                x: 596,
                y: 119,
                p: "url(#rows)",
              },
              {
                name: "Talhão 03",
                d: "M387 160 l130 -3 4 80 -134 -1z",
                x: 453,
                y: 199,
                p: "url(#rows)",
              },
              {
                name: "Talhão 04",
                d: "M522 168 l148 -2 7 79 -150 0z",
                x: 596,
                y: 207,
                p: "url(#rows2)",
              },
            ].map((s, i) => (
              <g
                key={s.name}
                onClick={() => onSector(s.name)}
                className="map-sector"
                tabIndex={0}
                role="button"
                aria-label={`Selecionar ${s.name}`}
                onKeyDown={(e) => e.key === "Enter" && onSector(s.name)}
              >
                <path
                  d={s.d}
                  fill={s.name === selectedSector ? "#b9d8bc" : "#d3e0cb"}
                  stroke={s.name === selectedSector ? "#24804e" : "#a1b79a"}
                  strokeWidth={s.name === selectedSector ? 2.5 : 1.5}
                  fillOpacity={s.name === selectedSector ? 0.7 : 0.48}
                />
                <path d={s.d} fill={s.p} opacity=".64" />
                <rect
                  x={s.x - 39}
                  y={s.y - 10}
                  width="78"
                  height="20"
                  rx="10"
                  fill="#ffffff"
                  opacity=".92"
                />
                <text
                  x={s.x}
                  y={s.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#355441"
                >
                  {s.name}
                </text>
                {showIncidents && i === 2 && (
                  <circle
                    cx="500"
                    cy="84"
                    r="8"
                    fill="#dc7657"
                    stroke="white"
                    strokeWidth="3"
                  />
                )}
              </g>
            ))}
            {showPlants &&
              Array.from({ length: 48 }, (_, i) => {
                const plant = plants[i];
                const { x, y } = plantMapPoint(i);
                const c = stateColor[plant?.state ?? "baseline"];
                return (
                  <g
                    key={i}
                    onClick={() => plant && onSelect(plant.id)}
                    className="map-marker"
                    tabIndex={0}
                    role="button"
                    aria-label={
                      plant
                        ? `Abrir planta ${plant.id} · ${stateLabel[plant.state]}`
                        : "Planta sem dados"
                    }
                    onKeyDown={(event) =>
                      (event.key === "Enter" || event.key === " ") &&
                      plant &&
                      onSelect(plant.id)
                    }
                  >
                    {showStress &&
                      plant &&
                      (plant.state === "alert" ||
                        plant.state === "observation") && (
                        <circle
                          cx={x}
                          cy={y}
                          r={plant.state === "alert" ? 22 : 15}
                          fill="url(#crop-stress)"
                          stroke={
                            plant.state === "alert" ? "#d84e45" : "#d59d32"
                          }
                          strokeWidth={plant.state === "alert" ? 2.5 : 1.5}
                          opacity={plant.state === "alert" ? 0.95 : 0.8}
                          pointerEvents="none"
                        />
                      )}
                    <circle
                      cx={x}
                      cy={y}
                      r="4.4"
                      fill={c}
                      stroke="#fff"
                      strokeWidth="1.8"
                    />
                    <circle cx={x} cy={y} r="8" fill={c} opacity=".12" />
                  </g>
                );
              })}
            <g transform="translate(638 39)">
              <circle r="21" fill="#fff" opacity=".9" />
              <path d="M0 -14 L5 4 L0 0 L-5 4Z" fill="#467455" />
              <text y="-18" textAnchor="middle" fontSize="8" fill="#65766a">
                N
              </text>
            </g>
            <text
              x="30"
              y="325"
              fontSize="9"
              fill="#ffffff"
              stroke="#214832"
              strokeWidth="2.5"
              paintOrder="stroke"
            >
              Imagem aérea ilustrativa · sem escala geográfica
            </text>
          </svg>
        </div>
        {showAerial && (
          <span className="aerial-tag">
            <span /> IMAGEM AÉREA SIMULADA
          </span>
        )}
        <div
          className="map-navigation-controls"
          aria-label="Controles de navegação do mapa"
        >
          <button
            type="button"
            onClick={() => zoomMap(0.2)}
            aria-label="Aproximar mapa"
            title="Aproximar"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={() => zoomMap(-0.2)}
            aria-label="Afastar mapa"
            title="Afastar"
          >
            <ZoomOut size={15} />
          </button>
          <span />
          <button
            type="button"
            onClick={resetMap}
            aria-label="Redefinir posição do mapa"
            title="Redefinir posição"
          >
            <LocateFixed size={15} />
          </button>
        </div>
        <span className="map-pan-hint">
          Arraste para mover · role para zoom
        </span>
      </div>
      <div className="map-footer">
        <span>
          <span className="map-dot" style={{ background: "#329365" }} />
          Linha de base
        </span>
        <span>
          <span className="map-dot" style={{ background: "#d59d32" }} />
          Observação
        </span>
        <span>
          <span className="map-dot" style={{ background: "#dc7657" }} />
          Verificação
        </span>
        <span>
          <span className="map-dot" style={{ background: "#89948b" }} />
          Sem dados
        </span>
        <span>
          <span className="map-dot" style={{ background: "#dc7657" }} />
          Estresse ilustrativo
        </span>
        <span className="map-count">48 plantas · 6 setores</span>
      </div>
    </div>
  );
}
