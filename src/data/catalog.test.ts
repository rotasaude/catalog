import { describe, expect, it } from "vitest";
import raw from "./funcionalidades.json";
import { catalog, deliveredCount, findFeature, neighbours, validateCatalog } from "./catalog";
import type { Catalog } from "./types";
import { formatRanges, formatValidating } from "../pages/ModuleList";

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
  it("entra no ciclo 2 com as 29 funcionalidades, a assinatura e a receita controlada em validação e os documentos disponíveis", () => {
    const m19 = catalog.modules.find((m) => m.id === "19")!;
    expect(m19.cycle).toBe(2);
    expect(m19.status).toBe("validating");
    expect(m19.features.map((f) => f.id)).toEqual(
      Array.from({ length: 29 }, (_, i) => `F-19.${i + 1}`)
    );
    for (const f of m19.features.slice(0, 7)) expect(f.status).toBe("available");
    for (const f of m19.features.slice(7, 15)) {
      expect(f.status).toBe("validating");
      expect(f.note).toMatch(/simulado/);
    }
    for (const f of m19.features.slice(15, 23)) expect(f.status).toBe("available");
    for (const f of m19.features.slice(23)) {
      expect(f.status).toBe("validating");
      expect(f.note).toMatch(/simulado/);
    }
    expect(findFeature("f-19.6")?.feature.note).toMatch(/e-SUS PEC real/);
  });
});

describe("módulo 20", () => {
  it("entra no ciclo 2 com as 6 funcionalidades, a página do PEC em validação", () => {
    const m20 = catalog.modules.find((m) => m.id === "20")!;
    expect(m20.cycle).toBe(2);
    expect(m20.status).toBe("validating");
    expect(m20.features.map((f) => f.id)).toEqual(Array.from({ length: 6 }, (_, i) => `F-20.${i + 1}`));
    for (const f of m20.features.slice(0, 5)) expect(f.status).toBe("available");
    expect(findFeature("f-20.1")?.feature.note).toMatch(/e-SUS PEC real/);
    const pec = findFeature("f-20.6")!.feature;
    expect(pec.status).toBe("validating");
    expect(pec.note).toMatch(/PEC simulado/);
  });
});

describe("formatRanges", () => {
  it("junta ids consecutivos em faixas", () => {
    expect(formatRanges(["02", "03", "04"])).toBe("02 a 04");
    expect(formatRanges(["02", "03", "05", "07", "08"])).toBe("02 a 03, 05 e 07 a 08");
    expect(formatRanges(["09"])).toBe("09");
  });
});

describe("formatValidating", () => {
  it("um, dois e três módulos", () => {
    expect(formatValidating(["19"])).toBe("o 19 está");
    expect(formatValidating(["19", "20"])).toBe("o 19 e o 20 estão");
    expect(formatValidating(["19", "20", "21"])).toBe("o 19, o 20 e o 21 estão");
  });
});

describe("módulo 21", () => {
  it("entra no ciclo 2: entrada FHIR e PEC em validação, o resto disponível", () => {
    const m21 = catalog.modules.find((m) => m.id === "21")!;
    expect(m21.cycle).toBe(2);
    expect(m21.status).toBe("validating");
    expect(m21.features.map((f) => f.id)).toEqual(Array.from({ length: 34 }, (_, i) => `F-21.${i + 1}`));
    for (const id of ["f-21.1", "f-21.2", "f-21.3", "f-21.4", "f-21.5", "f-21.6", "f-21.8", "f-21.9", "f-21.10", "f-21.12", "f-21.13"]) {
      expect(findFeature(id)?.feature.status).toBe("available");
    }
    const fhir = findFeature("f-21.7")!.feature;
    expect(fhir.status).toBe("validating");
    expect(fhir.note).toMatch(/laboratório simulado/);
    expect(findFeature("f-21.1")?.feature.note).toMatch(/fora de produção/);
    const pec = findFeature("f-21.11")!.feature;
    expect(pec.status).toBe("validating");
    expect(pec.note).toMatch(/PEC real/);
  });

  it("21b, laboratório municipal: só a entrada dos aparelhos em validação; ICP e etiqueta com nota", () => {
    for (const id of ["f-21.14", "f-21.15", "f-21.16", "f-21.17", "f-21.18", "f-21.20", "f-21.21", "f-21.22", "f-21.23", "f-21.24"]) {
      expect(findFeature(id)?.feature.status).toBe("available");
    }
    const hl7 = findFeature("f-21.19")!.feature;
    expect(hl7.status).toBe("validating");
    expect(hl7.note).toMatch(/middleware simulado/);
    expect(findFeature("f-21.14")?.feature.note).toMatch(/fora de produção/);
    expect(findFeature("f-21.20")?.feature.note).toMatch(/ICP-Brasil/);
    expect(findFeature("f-21.16")?.feature.note).toMatch(/impressora/);
    expect(findFeature("f-21.24")?.feature.description).toMatch(/nunca para o cidadão/);
  });

  it("21c, qualidade e insumos: só o controle pela HL7 em validação, até haver middleware real", () => {
    const m21 = catalog.modules.find((m) => m.id === "21")!;
    expect(m21.description).toMatch(/controle de qualidade/);
    expect(m21.description).toMatch(/lote do reagente/);
    for (const id of ["f-21.25", "f-21.26", "f-21.27", "f-21.29", "f-21.30", "f-21.31", "f-21.32", "f-21.33", "f-21.34"]) {
      expect(findFeature(id)?.feature.status).toBe("available");
    }
    const hl7 = findFeature("f-21.28")!.feature;
    expect(hl7.status).toBe("validating");
    expect(hl7.note).toMatch(/middleware simulado/);
    expect(hl7.note).toMatch(/middleware real/);
    expect(hl7.surfaces).toEqual([ "bastidores" ]);
    expect(findFeature("f-21.25")?.feature.surfaces).toEqual([ "plataforma", "secretaria" ]);
    expect(findFeature("f-21.27")?.feature.note).toMatch(/responsável técnico/);
    expect(findFeature("f-21.32")?.feature.description).toMatch(/a abertura de embalagem não/);
    expect(findFeature("f-21.34")?.feature.description).toMatch(/nada é baixado/);
  });
});
