import raw from "./funcionalidades.json";
import type { Catalog, Cycle, Feature, FeatureHit, Module } from "./types";

export const catalog = raw as Catalog;

// Confere a integridade do conteúdo: slug único e todo status/tela presentes
// nos mapas do próprio JSON. Devolve a lista de problemas (vazia = ok).
export function validateCatalog(data: Catalog): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const mod of data.modules) {
    if (!(mod.status in data.statuses)) problems.push(`módulo ${mod.id}: status desconhecido ${mod.status}`);
    if (!data.meta.cycles.some((c) => c.id === mod.cycle)) problems.push(`módulo ${mod.id}: ciclo desconhecido ${mod.cycle}`);
    for (const f of mod.features) {
      if (seen.has(f.slug)) problems.push(`slug repetido: ${f.slug}`);
      seen.add(f.slug);
      if (!(f.status in data.statuses)) problems.push(`${f.id}: status desconhecido ${f.status}`);
      if (!f.description?.trim()) problems.push(`${f.id}: sem descrição`);
      for (const s of f.surfaces) {
        if (!(s in data.surfaces)) problems.push(`${f.id}: tela desconhecida ${s}`);
      }
    }
  }
  return problems;
}

const bySlug = new Map<string, FeatureHit>();
catalog.modules.forEach((module) =>
  module.features.forEach((feature, index) => bySlug.set(feature.slug, { feature, module, index }))
);

export function findFeature(slug: string): FeatureHit | undefined {
  return bySlug.get(slug);
}

export function neighbours({ module, index }: FeatureHit): { prev?: Feature; next?: Feature } {
  return { prev: module.features[index - 1], next: module.features[index + 1] };
}

// "Entregue" = já implementada, verificada ou em validação; só "planned" fica de fora.
export function deliveredCount(module: Module): number {
  return module.features.filter((f) => f.status !== "planned").length;
}

export function cycleTitle(c: Cycle): string {
  return c.scope ? `${c.label} · ${c.scope}` : c.label;
}

export function featurePath(slug: string): string {
  return `/funcionalidades/${slug}`;
}

export function moduleAnchor(id: string): string {
  return `m-${id}`;
}
