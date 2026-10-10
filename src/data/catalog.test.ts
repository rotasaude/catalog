import { describe, expect, it } from "vitest";
import raw from "./funcionalidades.json";
import { catalog, deliveredCount, findFeature, neighbours, validateCatalog } from "./catalog";
import type { Catalog } from "./types";
import { formatRanges } from "../pages/ModuleList";

const clone = (): Catalog => JSON.parse(JSON.stringify(raw));

describe("validateCatalog", () => {
  it("aceita o conteúdo publicado", () => {
    expect(validateCatalog(clone())).toEqual([]);
  });

  it("acusa slug repetido", () => {
    const data = clone();
    data.modules[1].features[1].slug = data.modules[1].features[0].slug;
    expect(validateCatalog(data)).toContain(`slug repetido: ${data.modules[1].features[0].slug}`);
  });

  it("acusa tela que não existe no mapa de surfaces", () => {
    const data = clone();
    data.modules[1].features[0].surfaces = ["recepcao"];
    expect(validateCatalog(data)).toContain("F-02.1: tela desconhecida recepcao");
  });

  it("acusa funcionalidade sem descrição", () => {
    const data = clone();
    data.modules[1].features[0].description = "  ";
    expect(validateCatalog(data)).toContain("F-02.1: sem descrição");
  });

  it("acusa módulo de ciclo que não existe", () => {
    const data = clone();
    data.modules[0].cycle = 9;
    expect(validateCatalog(data)).toContain("módulo 01: ciclo desconhecido 9");
  });

  it("acusa status que não existe no mapa de statuses", () => {
    const data = clone();
    data.modules[2].status = "beta";
    data.modules[2].features[0].status = "beta";
    expect(validateCatalog(data)).toEqual(
      expect.arrayContaining(["módulo 03: status desconhecido beta", "F-03.1: status desconhecido beta"])
    );
  });
});

describe("consultas", () => {
  it("encontra a funcionalidade pelo slug, com o módulo e a posição", () => {
    const hit = findFeature("f-03.1");
    expect(hit?.feature.title).toMatch(/Classificação previsível/);
    expect(hit?.module.id).toBe("03");
    expect(hit?.index).toBe(0);
  });

  it("devolve undefined para slug inválido", () => {
    expect(findFeature("f-99.1")).toBeUndefined();
  });

  it("anterior e próxima ficam dentro do mesmo módulo", () => {
    const first = findFeature("f-04.1")!;
    expect(neighbours(first)).toEqual({ prev: undefined, next: first.module.features[1] });
    const last = findFeature("f-04.7")!;
    expect(neighbours(last).next).toBeUndefined();
    expect(neighbours(last).prev?.id).toBe("F-04.6");
  });

  it("conta como entregues as funcionalidades que não estão planejadas", () => {
    const m10 = catalog.modules.find((m) => m.id === "10")!;
    expect(deliveredCount(m10)).toBe(6);
    expect(m10.features).toHaveLength(7);
  });
});

describe("módulo 18", () => {
  it("entra no ciclo 2 com as 8 funcionalidades e a nota de go-live da ficha da escuta", () => {
    const m18 = catalog.modules.find((m) => m.id === "18")!;
    expect(m18.cycle).toBe(2);
    expect(m18.features.map((f) => f.id)).toEqual(
      ["F-18.1", "F-18.2", "F-18.3", "F-18.4", "F-18.5", "F-18.6", "F-18.7", "F-18.8"]
    );
    expect(findFeature("f-18.5")?.feature.note).toMatch(/SIGTAP/);
  });
});

describe("módulo 19", () => {
  it("entra no ciclo 2 com as 23 funcionalidades, a assinatura em validação e os documentos disponíveis", () => {
    const m19 = catalog.modules.find((m) => m.id === "19")!;
    expect(m19.cycle).toBe(2);
    expect(m19.status).toBe("validating");
    expect(m19.features.map((f) => f.id)).toEqual(
      Array.from({ length: 23 }, (_, i) => `F-19.${i + 1}`)
    );
    for (const f of m19.features.slice(0, 7)) expect(f.status).toBe("available");
    for (const f of m19.features.slice(7, 15)) {
      expect(f.status).toBe("validating");
      expect(f.note).toMatch(/simulado/);
    }
    for (const f of m19.features.slice(15)) expect(f.status).toBe("available");
    expect(findFeature("f-19.6")?.feature.note).toMatch(/e-SUS PEC real/);
  });
});

describe("formatRanges", () => {
  it("junta ids consecutivos em faixas", () => {
    expect(formatRanges(["02", "03", "04"])).toBe("02 a 04");
    expect(formatRanges(["02", "03", "05", "07", "08"])).toBe("02 a 03, 05 e 07 a 08");
    expect(formatRanges(["09"])).toBe("09");
  });
});
