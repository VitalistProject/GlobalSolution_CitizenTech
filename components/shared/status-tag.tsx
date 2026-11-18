import { stateLabel, type PlantState } from "@/lib/siaf-data";

export function StatusTag({ state }: { state: PlantState }) {
  return (
    <span className={`status-tag ${state}`}>
      <i />
      {stateLabel[state]}
    </span>
  );
}
