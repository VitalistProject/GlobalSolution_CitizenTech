import { type Plant } from "@/lib/siaf-data";
import { PlantList } from "@/components/views/plant-list";

export function PlantsView({ plants, onPlant, onAdd }: {
  plants: Plant[];
  onPlant: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">CADASTRO INDIVIDUAL</div>
          <h1>Plantas monitoradas</h1>
          <p>Indivíduos, sensores associados e estado de monitoramento.</p>
        </div>
      </div>
      <PlantList
        plants={plants}
        onPlant={onPlant}
        onAdd={onAdd}
      />
    </>
  );
}
