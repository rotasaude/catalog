// Tipos do funcionalidades.json, a fonte única do conteúdo do catálogo.

export type Status = "available" | "validating" | "planned" | "disabled";
export type Surface = "cidadao" | "secretaria" | "plataforma" | "bastidores";

export interface Feature {
  id: string;
  slug: string;
  title: string;
  benefit: string;
  description: string;
  surfaces: string[];
  status: string;
  note?: string;
}

export interface Module {
  id: string;
  name: string;
  status: string;
  description: string;
  features: Feature[];
}

export interface Catalog {
  meta: { updatedAt: string; cycle: { id: number; label: string; scope: string; modules: string } };
  statuses: Record<string, string>;
  surfaces: Record<string, { label: string; text: string }>;
  modules: Module[];
}

export interface FeatureHit {
  feature: Feature;
  module: Module;
  index: number;
}
