import { catalog } from "../data/catalog";
import { StatusIcon } from "./icons";

// Ícone + texto sempre juntos: legível em escala de cinza e por daltônicos.
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge b-${status}`}>
      <StatusIcon status={status} />
      {catalog.statuses[status]}
    </span>
  );
}
